var masterColumns = [];

$.ajax({
    type: "POST",
    url: "WebService_SparePartMaster.asmx/MasterColumnList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        masterColumns = JSON.parse(res);
    }
});

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) !== "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
}

function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    var SNo = Number(document.getElementById("SheetNumber").value);
    if (isNaN(SNo) || SNo === undefined || SNo < 0) SNo = 0;
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[SNo];

    //Read all rows from First Sheet into an JSON array.
    excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    //Create a HTML Table element.
    var table = document.createElement("table");
    table.border = "1";

    //Add the header row.
    var row = table.insertRow(-1);

    //Add the header cells.
    for (var j = 0; j < masterColumns.length; j++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = masterColumns[j].COLUMN_NAME;
        row.appendChild(headerCell);
    }
    //for (var col in excelRows[0]) {
    //    var headerCell = document.createElement("TH");
    //    headerCell.innerHTML = col.replace('/', 'Per').replace(' ', '');
    //    row.appendChild(headerCell);
    //}
    seconds = excelRows.length;
    document.getElementById("totalItems").innerHTML = seconds;
    //Add the data rows from Excel file.
    for (var i = 0; i < excelRows.length; i++) {

        //progressBarStatus.option("value", excelRows.length - (seconds - i));
        //$("#timer").text(("0" + (seconds - i)).slice(-2));
        //Add the data row.
        row = table.insertRow(-1);

        //Add the data cells.        
        //for (var col1 in excelRows[i]) {
        //    var cell = row.insertCell(-1);
        //    var colnam = masterColumns[i].FieldName;
        //    cell.innerHTML = excelRows[i][colnam];
        //}
        try {
            for (j = 0; j < masterColumns.length; j++) {
                var cell = row.insertCell(-1);
                var colnam = masterColumns[j].COLUMN_NAME;
                var cellValue = excelRows[i][colnam];
                if (cellValue === "-") cellValue = "";
                cell.innerHTML = cellValue;
            }
            //var cell1 = row.insertCell(-1);
            //cell1.innerHTML = excelRows[i]["LedgerName"];
        } catch (e) {
            console.log(e);
        }
    }

    var dvExcel = document.getElementById("dvExcel");
    dvExcel.innerHTML = "";
    dvExcel.appendChild(table);
}

function SaveData() {
    try {
        if (!excelRows) {
            alert("Please check import data by clicking show button");
            return;
        }

        var ObjMainData = [];
        var optSaprePart = {};

        for (var i = 0; i < excelRows.length; i++) {
            ObjMainData = [];
            optSaprePart = {};

            ///Progress status
            //progressBarStatus.option("value", excelRows.length - (seconds - i));
            $("#timer").text(("0" + (seconds - i)).slice(-2));
            document.getElementById("totalItems").innerHTML = Number(document.getElementById("totalItems").innerHTML) - i;

            optSaprePart.SparePartName = excelRows[i].SparePartName;
            //optSaprePart.VoucherDate = VoucherDate;
            optSaprePart.SparePartGroup = excelRows[i].SparePartGroup;
            optSaprePart.HSNGroup = excelRows[i].HSNGroup;
            optSaprePart.ProductHSNID = excelRows[i].ProductHSNID;
            optSaprePart.Unit = excelRows[i].Unit;
            optSaprePart.Rate = excelRows[i].Rate;
            optSaprePart.Narration = excelRows[i].Narration;

            optSaprePart.SupplierIDString = "";    // $("#SelSuppliers").dxTagBox("instance").option('value');
            optSaprePart.SparePartType = excelRows[i].SparePartType;
            optSaprePart.SupplierReference = excelRows[i].SupplierReference;
            optSaprePart.MinimumStockQty = excelRows[i].MinimumStockQty;
            optSaprePart.PurchaseOrderQuantity = excelRows[i].PurchaseOrderQuantity;
            optSaprePart.StockRefCode = excelRows[i].StockRefCode;
            optSaprePart.IsCritical = excelRows[i].IsCritical;
            optSaprePart.IsActive = excelRows[i].IsActive;

            ObjMainData.push(optSaprePart);

            $.ajax({
                type: "POST",
                async: false,
                url: "WebService_SparePartMaster.asmx/SaveSparePart",
                data: '{CostingDataMachinAllocation:' + JSON.stringify([]) + ',objSparePart:' + JSON.stringify(ObjMainData) + ',GridRow:' + JSON.stringify("") + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                },
                error: function errorFunc(jqXHR) {
                    alert(jqXHR);
                }
            });
        }
        alert("Your Data has been Saved Successfully...!");
        location.reload();
    } catch (e) {
        alert(e);
    }
}
