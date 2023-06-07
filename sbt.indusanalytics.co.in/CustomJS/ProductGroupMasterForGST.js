
var GblStatus = "";
var sholistData = [];

$("#PGHMShowListGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: {
        enabled: false
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    export: {
        enabled: true,
        fileName: "HSN Master",
        allowExportSelectedData: true
    },
    onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('HSNMaster_' + new Date());

        DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'HSNMaster_' + new Date() + '.xlsx');
            });
        });
        e.cancel = true;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (Showlist) {
        sholistData = [];
        sholistData = Showlist.selectedRowsData;
        document.getElementById("TxtPGMID").value = sholistData[0].ProductHSNID;
    },
    columns: [{ dataField: "ProductHSNID", visible: false, width: 120 },
    { dataField: "ProductHSNName", width: 200 },
    { dataField: "HSNCode", width: 90 },
    { dataField: "UnderProductHSNID", visible: false, width: 120 },
    { dataField: "CompanyID", visible: false, width: 100 },
    { dataField: "DisplayName", width: 200 },
    { dataField: "TariffNo", width: 80 },
    { dataField: "ProductCategory", width: 90 },
    { dataField: "GSTTaxPercentage", width: 100 },
    { dataField: "CGSTTaxPercentage", width: 100 },
    { dataField: "SGSTTaxPercentage", width: 120 },
    { dataField: "IGSTTaxPercentage", width: 120 },
    { dataField: "ItemGroupID", visible: false, width: 100 },
    { dataField: "CreatedBy", width: 100 },
    { dataField: "CreatedDate", width: 100 },
    { dataField: "FYear", width: 100 }
    ]
});

$("#SelUnderGroup").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'ProductHSNName',
    valueExpr: 'ProductHSNID',
    searchEnabled: true,
    showClearButton: true,
});

$("#SelItemGroupName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'ItemGroupName',
    valueExpr: 'ItemGRoupID',
    searchEnabled: true,
    showClearButton: true
});

//UnderGroup
$.ajax({
    type: "POST",
    url: "WebService_ProductGroupMasterForGST.asmx/UnderGroup",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        Departmentname = [];
        Departmentname = JSON.parse(res);

        FilterDepartment = Departmentname;

        $("#SelUnderGroup").dxSelectBox({
            items: FilterDepartment
        });
    }
});

//SelItemGroupName
$.ajax({
    type: "POST",
    url: "WebService_ProductGroupMasterForGST.asmx/SelItemGroupName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        ////console.debug(results);
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        Departmentname = [];
        Departmentname = JSON.parse(res);

        FilterDepartment = Departmentname;

        $("#SelItemGroupName").dxSelectBox({
            items: FilterDepartment
        });
    }
});

//SelProductType
var PT = ["Raw Material", "Finish Goods", "Spare Parts", "Service"];
$("#SelProductType").dxSelectBox({
    items: PT,
    placeholder: "Select--",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var selectitem = data.value;
        if (selectitem === "Raw Material") {
            document.getElementById("DivItemGroupName").style.display = "block";
        } else {
            $("#SelItemGroupName").dxSelectBox({
                value: null
            });
            document.getElementById("DivItemGroupName").style.display = "none";
        }
    }
});

//Get Pick Issue Showlist
Showlist();
function Showlist() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_ProductGroupMasterForGST.asmx/Showlist",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            RES1 = JSON.parse(res.toString());

            $("#PGHMShowListGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

$("#CreateButton").click(function () {

    GblStatus = "";
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;

    blankfield();

    //document.getElementById("TxtPGMID").value = GblIssueNo;
    //document.getElementById("TxtPGMID").value = GblIssueNo;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#BtnNew").click(function () {
    blankfield();
});

$("#BtnSave").click(function () {
    var TxtGroupName = document.getElementById("TxtGroupName").value.trim();
    var TxtDisplayName = document.getElementById("TxtDisplayName").value;
    var TxtHSNCode = document.getElementById("TxtHSNCode").value;
    var TxtTariffNo = document.getElementById("TxtTariffNo").value;
    var TxtGST = document.getElementById("TxtGST").value;
    var TxtCGST = document.getElementById("TxtCGST").value;
    var TxtSGST = document.getElementById("TxtSGST").value;
    var TxtIGST = document.getElementById("TxtIGST").value;

    var SelUnderGroup = $('#SelUnderGroup').dxSelectBox('instance').option('value');
    var SelProductType = $('#SelProductType').dxSelectBox('instance').option('value');
    var SelItemGroupName = $('#SelItemGroupName').dxSelectBox('instance').option('value');
    var text = "";

    if (TxtGroupName === "" || TxtGroupName === undefined || TxtGroupName === null) {
        DevExpress.ui.notify("Please Enter Group Name...!", "error", 1000);
        text = "Please Enter Group Name.!";
        document.getElementById("TxtGroupName").value = "";
        document.getElementById("TxtGroupName").focus();
        document.getElementById("ValStrTxtGroupName").style.display = "block";
        document.getElementById("ValStrTxtGroupName").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrTxtGroupName").style.display = "none";
    }

    if (TxtDisplayName === "" || TxtDisplayName === undefined || TxtDisplayName === null) {
        DevExpress.ui.notify("Please Enter Display Name...!", "error", 1000);
        text = "Please Enter Display Name.!";
        document.getElementById("TxtDisplayName").value = "";
        document.getElementById("TxtDisplayName").focus();
        document.getElementById("ValStrTxtDisplayName").style.display = "block";
        document.getElementById("ValStrTxtDisplayName").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrTxtDisplayName").style.display = "none";
    }

    if (TxtHSNCode === "" || TxtHSNCode === undefined || TxtHSNCode === null) {
        DevExpress.ui.notify("Please Enter HSN Code...!", "error", 1000);
        text = "Please Enter HSN Code.!";
        document.getElementById("TxtHSNCode").value = "";
        document.getElementById("TxtHSNCode").focus();
        document.getElementById("ValStrTxtHSNCode").style.display = "block";
        document.getElementById("ValStrTxtHSNCode").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrTxtHSNCode").style.display = "none";
    }

    //if (TxtTariffNo === "" || TxtTariffNo === undefined || TxtTariffNo === null) {
    //    DevExpress.ui.notify("Please Enter Tariff No...!", "error", 1000);
    //    text = "Please Enter Tariff No.!";
    //    document.getElementById("TxtTariffNo").value = "";
    //    document.getElementById("TxtTariffNo").focus();
    //    document.getElementById("ValStrTxtTariffNo").style.display = "block";
    //    document.getElementById("ValStrTxtTariffNo").innerHTML = text;
    //    return false;
    //} else {
    //    document.getElementById("ValStrTxtTariffNo").style.display = "none";
    //}


    //if (SelUnderGroup === "" || SelUnderGroup === undefined || SelUnderGroup === null) {
    //    DevExpress.ui.notify("Please Choose Under Group...!", "error", 1000);
    //    text = "Please Choose Under Group.!";
    //    document.getElementById("SelUnderGroup").focus();
    //    document.getElementById("ValStrSelUnderGroup").style.display = "block";
    //    document.getElementById("ValStrSelUnderGroup").innerHTML = text;
    //    return false;
    //} else {
    //    document.getElementById("ValStrSelUnderGroup").style.display = "none";
    //}

    if (SelProductType === "" || SelProductType === undefined || SelProductType === null) {
        DevExpress.ui.notify("Please Choose Product Type..!", "error", 1000);
        text = "Please Choose Product Type.!";
        document.getElementById("SelProductType").focus();
        document.getElementById("ValStrSelProductType").style.display = "block";
        document.getElementById("ValStrSelProductType").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrSelProductType").style.display = "none";
    }

    if (SelProductType === "Raw Material") {
        if (SelItemGroupName === "" || SelItemGroupName === undefined || SelItemGroupName === null) {
            DevExpress.ui.notify("Please Choose Item Group Name..!", "error", 1000);
            text = "Please Choose Item Group Name.!";
            document.getElementById("SelItemGroupName").focus();
            document.getElementById("ValStrSelItemGroupName").style.display = "block";
            document.getElementById("ValStrSelItemGroupName").innerHTML = text;
            return false;
        } else {
            document.getElementById("ValStrSelItemGroupName").style.display = "none";
        }
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    OperationRecordMain = {};

    OperationRecordMain.ProductHSNName = TxtGroupName;
    OperationRecordMain.HSNCode = TxtHSNCode;
    OperationRecordMain.UnderProductHSNID = SelUnderGroup;
    OperationRecordMain.DisplayName = TxtDisplayName;
    OperationRecordMain.TariffNo = TxtTariffNo;
    OperationRecordMain.ProductCategory = SelProductType;//$('#SelItemGroupName').dxSelectBox('instance').option('text');;
    OperationRecordMain.GSTTaxPercentage = TxtGST;
    OperationRecordMain.CGSTTaxPercentage = TxtCGST;
    OperationRecordMain.SGSTTaxPercentage = TxtSGST;
    OperationRecordMain.IGSTTaxPercentage = TxtIGST;
    OperationRecordMain.ItemGroupID = SelItemGroupName;

    jsonObjectsRecordMain.push(OperationRecordMain);

    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: false
    },
        function () {
            if (GblStatus === "Update") {
                //alert(JSON.stringify(jsonObjectsRecordMain));
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_ProductGroupMasterForGST.asmx/UpdatePGHM",
                    data: '{ID:' + JSON.stringify(document.getElementById("TxtPGMID").value) + ',jsonObjectsRecordMain:' + JSON.stringify(jsonObjectsRecordMain) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        document.getElementById("LOADER").style.display = "none";
                        if (res === "Success") {

                            swal("Updated!", "Your data Updated", "success");
                            location.reload();


                        }
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Group Name allready Exist..\n Please enter another Group Name..", "");
                        }

                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
            else {

                document.getElementById("LOADER").style.display = "block";

                $.ajax({
                    type: "POST",
                    url: "WebService_ProductGroupMasterForGST.asmx/SavePGHMData",
                    data: '{jsonObjectsRecordMain:' + JSON.stringify(jsonObjectsRecordMain) + ',TxtGroupName:' + JSON.stringify(TxtDisplayName) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        document.getElementById("LOADER").style.display = "none";

                        if (res === "Success") {
                            swal("Saved!", "Your data saved", "success");
                            location.reload();
                        }
                        else if (res === "Exist") {
                            swal("Duplicate!", "This  Group Name allready Exist..\n Please enter another  Group Name..", "");
                        }

                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });

});

$("#EditButton").click(function () {
    var TxtPGMID = document.getElementById("TxtPGMID").value;
    if (TxtPGMID === "" || TxtPGMID === null || TxtPGMID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("BtnSaveAS").disabled = "";

    document.getElementById("TxtGroupName").value = sholistData[0].ProductHSNName;
    document.getElementById("TxtDisplayName").value = sholistData[0].DisplayName;
    document.getElementById("TxtHSNCode").value = sholistData[0].HSNCode;
    document.getElementById("TxtTariffNo").value = sholistData[0].TariffNo;
    document.getElementById("TxtGST").value = sholistData[0].GSTTaxPercentage;
    document.getElementById("TxtCGST").value = sholistData[0].CGSTTaxPercentage;
    document.getElementById("TxtSGST").value = sholistData[0].SGSTTaxPercentage;
    document.getElementById("TxtIGST").value = sholistData[0].IGSTTaxPercentage;

    $("#SelItemGroupName").dxSelectBox({
        value: sholistData[0].ItemGroupID
    });
    $("#SelProductType").dxSelectBox({
        value: sholistData[0].ProductCategory
    });

    $("#SelUnderGroup").dxSelectBox({
        value: sholistData[0].UnderProductHSNID
    });

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#DeleteButton").click(function () {
    var TxtPGMID = document.getElementById("TxtPGMID").value;
    if (TxtPGMID === "" || TxtPGMID === null || TxtPGMID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Content!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
        function () {
            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_ProductGroupMasterForGST.asmx/DeletePGHM",
                data: '{TxtPGMID:' + JSON.stringify(document.getElementById("TxtPGMID").value) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);

                    document.getElementById("LOADER").style.display = "none";
                    if (res === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert(jqXHR);
                }
            });

        });

});

//SaveAs Data On Pop Up
$("#BtnSaveAS").click(function () {
    GblStatus = "";
    $("#BtnSave").click();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

// Only Numeric
function Numeric(val) {
    var x, text;
    var getValid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;

    if (isNaN(x)) {
        text = "numeric value valid..";
        document.getElementById(getValid).style.display = "block";
        document.getElementById(getValid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    document.getElementById(getValid).style.display = "none";
}

function blankfield() {
    GblStatus = "";
    // document.getElementById("TxtPGMID").value = "";
    document.getElementById("TxtGroupName").value = "";
    document.getElementById("TxtDisplayName").value = "";
    document.getElementById("TxtHSNCode").value = "";
    document.getElementById("TxtTariffNo").value = "";
    document.getElementById("TxtGST").value = "";
    document.getElementById("TxtCGST").value = "";
    document.getElementById("TxtSGST").value = "";
    document.getElementById("TxtIGST").value = "";

    $("#SelItemGroupName").dxSelectBox({ value: null });
    $("#SelProductType").dxSelectBox({ value: null });
    $("#SelUnderGroup").dxSelectBox({ value: null });
}