
var GblStatus = "";
var SelCountry = [];
var selState = [];
var SelCity = [];
var SelPin = [];
var newArray = [];
var Fyear = [];
var CurrSymbol = [], selectedCompanyRows = [];

$("#ddlFromDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});
$("#ddlToDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#ddlCountry").dxSelectBox({
    items: SelCountry,
    placeholder: 'Country--',
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true
});

$("#ddlState").dxSelectBox({
    items: selState,
    placeholder: 'Sate--',
    // displayExpr: 'State',   
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true,
    onValueChanged: function (e) {
        $("#ddlCity").dxSelectBox({
            value: ''
        });
        $("#ddlPinCode").dxSelectBox({
            value: ''
        });
        SelCity = [];
        var FilterCity = newArray.filter(function (el) {
            return el.State === e.value;
        });
        for (var s = 0; s < FilterCity.length; s++) {
            SelCity.push(FilterCity[s].City);
        }

        if (SelCity !== "" && SelCity !== []) {
            $("#ddlCity").dxSelectBox({
                items: SelCity
            });
        }
        else {
            selState = [];
            $("#ddlCity").dxSelectBox({
                items: SelCity
            });
        }
    }
});

$("#ddlCity").dxSelectBox({
    items: SelCity,
    placeholder: 'City--',
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true,
    onValueChanged: function (e) {
        $("#ddlPinCode").dxSelectBox({
            value: null
        });
        SelPin = [];
        var FilterPin = newArray.filter(function (el) {
            return el.City === e.value;
        });
        for (var s = 0; s < FilterPin.length; s++) {
            SelPin.push(FilterPin[s].Pincode);
        }
        if (SelPin !== "" && SelPin !== []) {
            $("#ddlPinCode").dxSelectBox({
                items: SelPin
            });
        }
        else {
            selState = [];
            $("#ddlPinCode").dxSelectBox({
                items: SelPin
            });
        }
    }
});
$("#ddlPinCode").dxSelectBox({
    items: SelPin,
    placeholder: 'Pin/Zip Code--',
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true
});
$("#ddlFinancialYear").dxSelectBox({
    items: Fyear,
    placeholder: 'F-Year--',
    // displayExpr: 'CityName',   
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true
});
$("#ddlCurrencySymbol").dxSelectBox({
    items: CurrSymbol,
    placeholder: 'Rs--',
    // displayExpr: 'CityName',   
    showClearButton: true,
    searchEnabled: true,
    acceptCustomValue: true
});

$.ajax({
    type: "POST",
    url: "WebService_NewCompany.asmx/GetCurrencySymbol",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/Area:/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);

        var resCurrSymbol = res.split(',');
        CurrSymbol = [];
        if (resCurrSymbol.length > 0) {
            for (var itemtxt in resCurrSymbol) {
                CurrSymbol.push(resCurrSymbol[itemtxt]);
            }
        }
        $("#ddlCurrencySymbol").dxSelectBox({
            items: CurrSymbol
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_NewCompany.asmx/GetFyear",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/Area:/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);

        var resFyear = res.split(',');
        Fyear = [];
        if (resFyear.length > 0) {
            for (var itemtxt in resFyear) {
                Fyear.push(resFyear[itemtxt]);
            }
        }
        $("#ddlFinancialYear").dxSelectBox({
            items: Fyear
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_NewCompany.asmx/GetAllPara",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        newArray = [];
        newArray = JSON.parse(res);
    }
});

$.ajax({
    type: "POST",
    url: "WebService_NewCompany.asmx/GetCountry",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/Country:/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var resCountry = res.split(',');
        SelCountry = [];
        if (resCountry.length > 0) {
            for (var itemtxt in resCountry) {
                SelCountry.push(resCountry[itemtxt]);
            }
        }
        $("#ddlCountry").dxSelectBox({
            items: SelCountry,
            onValueChanged: function (e) {
                $("#ddlState").dxSelectBox({ value: null });
                $("#ddlCity").dxSelectBox({ value: null });
                $("#ddlPinCode").dxSelectBox({ value: null });
                selState = [];
                var FilterState = newArray.filter(function (el) { return el.Country === e.value; });
                for (var s = 0; s < FilterState.length; s++) {
                    selState.push(FilterState[s].State);
                }
                if (selState !== "" && selState !== []) {
                    $("#ddlState").dxSelectBox({ items: selState });
                }
                else {
                    selState = [];
                    $("#ddlState").dxSelectBox({ items: selState });
                }
            }
        });
    }
});

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_NewCompany.asmx/GetCompany",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            $("#CompanyGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
}

$("#CompanyGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    selection: {
        mode: "single"
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: {
        visible: true, applyFilter: "auto"
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (clickedIndentCell) {
        selectedCompanyRows = clickedIndentCell.selectedRowsData;
        document.getElementById("TxtCompanyID").value = "";
        document.getElementById("TxtCompanyID").value = selectedCompanyRows[0].CompanyID;
    },
    columns: [
        { dataField: "CompanyID", visible: false, caption: "CompanyID" },
        { dataField: "CompanyName", visible: true, caption: "Company Name" },
        { dataField: "Address1", visible: true, caption: "Address" },
        { dataField: "City", visible: true, caption: "City" },
        { dataField: "State", visible: true, caption: "State" },
        { dataField: "Pincode", visible: true, caption: "Pincode" },
        { dataField: "Country", visible: true, caption: "Country" },
        { dataField: "ContactNO", visible: true, caption: "Contact No" },
        { dataField: "FAX", visible: true, caption: "FAX" },
        { dataField: "Email", visible: true, caption: "Email" },
        { dataField: "Website", visible: true, caption: "Website" },
        { dataField: "PAN", visible: true, caption: "PAN" },
        { dataField: "CINNo", visible: true, caption: "CIN No" },
        { dataField: "GSTIN", visible: true, caption: "GSTIN" },
        { dataField: "ProductionUnitName", visible: true, caption: "Production Unit Name" }
    ]
});
$("#EditButton").click(function () {
    var TxtCompanyID = Number(document.getElementById("TxtCompanyID").value);
    if (TxtCompanyID <= 0 || TxtCompanyID === null || TxtCompanyID === undefined) {
        swal("Empty Selection..!", "Please choose any row from below Grid..!");
        return false;
    }

    GblStatus = "Update";
    document.getElementById("TxtCompanyName").value = selectedCompanyRows[0].CompanyName;
    document.getElementById("TxtAddress").value = selectedCompanyRows[0].Address1;

    $("#ddlCountry").dxSelectBox({ value: selectedCompanyRows[0].Country });
    $("#ddlState").dxSelectBox({ value: selectedCompanyRows[0].State });
    $("#ddlCity").dxSelectBox({ value: selectedCompanyRows[0].City });
    $("#ddlPinCode").dxSelectBox({ value: selectedCompanyRows[0].Pincode });
    document.getElementById("TxtPhone_1").value = selectedCompanyRows[0].ContactNO;
    document.getElementById("TxtFax").value = selectedCompanyRows[0].FAX;
    document.getElementById("TxtEmail").value = selectedCompanyRows[0].Email;
    document.getElementById("TxtWeb").value = selectedCompanyRows[0].Website;
    document.getElementById("TxtPAN").value = selectedCompanyRows[0].PAN;
    document.getElementById("TxtCIN").value = selectedCompanyRows[0].CINNo;
    document.getElementById("TxtGSTIN").value = selectedCompanyRows[0].GSTIN;
    document.getElementById("TxtProductionuint").value = selectedCompanyRows[0].ProductionUnitName;
    document.getElementById("TxtImportExportCode").value = selectedCompanyRows[0].ImportExportCode;

    document.getElementById('previewimgheader').src = selectedCompanyRows[0].PictureQuotationPath;
    document.getElementById("imgpathstringheaderimage").value = selectedCompanyRows[0].PictureQuotationPath;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#SaveButton").click(function () {

    if (GblStatus !== "Update") return;
    var TxtCompanyName = document.getElementById("TxtCompanyName").value;
    var TxtAddress = document.getElementById("TxtAddress").value;
    var ddlCity = $("#ddlCity").dxSelectBox('instance').option('value');
    var ddlState = $("#ddlState").dxSelectBox('instance').option('value');
    var ddlPinCode = $("#ddlPinCode").dxSelectBox('instance').option('value');
    var ddlCountry = $("#ddlCountry").dxSelectBox('instance').option('value');
    var TxtPhone_1 = document.getElementById("TxtPhone_1").value;
    var TxtFax = document.getElementById("TxtFax").value;
    var TxtEmail = document.getElementById("TxtEmail").value;
    var TxtWeb = document.getElementById("TxtWeb").value;
    var TxtPAN = document.getElementById("TxtPAN").value;
    var TxtCIN = document.getElementById("TxtCIN").value;
    var TxtGSTIN = document.getElementById("TxtGSTIN").value;
    var TxtProductionuint = document.getElementById("TxtProductionuint").value;
    var ImportExportCode = document.getElementById("TxtImportExportCode").value;

    var text = "";
    if (TxtCompanyName === "" || TxtCompanyName === null || TxtCompanyName === undefined || TxtCompanyName === "null") {
        text = "Please enter Company Name ..!";
        document.getElementById("ValStrTxtCompanyName").innerHTML = text;
        document.getElementById("ValStrTxtCompanyName").style.display = "block";
        document.getElementById("TxtCompanyName").value = "";
        document.getElementById("TxtCompanyName").focus();
        return false;
    }
    else {
        document.getElementById("ValStrTxtCompanyName").style.display = "none";
    }

    if (TxtAddress === "" || TxtAddress === null || TxtAddress === undefined || TxtAddress === "null") {
        text = "Please enter Company Address ..!";
        document.getElementById("ValStrTxtAddress").innerHTML = text;
        document.getElementById("ValStrTxtAddress").style.display = "block";
        document.getElementById("TxtAddress").value = "";
        document.getElementById("TxtAddress").focus();
        return false;
    }
    else {
        document.getElementById("ValStrTxtAddress").style.display = "none";
    }
    if (ddlCountry === "" || ddlCountry === null || ddlCountry === undefined || ddlCountry === "null") {
        text = "Please enter/choose Country..!";
        document.getElementById("ValStrddlCountry").innerHTML = text;
        document.getElementById("ValStrddlCountry").style.display = "block";
        document.getElementById("ddlCountry").value = "";
        document.getElementById("ddlCountry").focus();
        return false;
    }
    else {
        document.getElementById("ValStrddlCountry").style.display = "none";
    }
    if (ddlState === "" || ddlState === null || ddlState === undefined || ddlState === "null") {
        text = "Please enter/choose City ..!";
        document.getElementById("ValStrddlState").innerHTML = text;
        document.getElementById("ValStrddlState").style.display = "block";
        document.getElementById("ddlState").value = "";
        document.getElementById("ddlState").focus();
        return false;
    }
    else {
        document.getElementById("ValStrddlState").style.display = "none";
    }

    if (ddlCity === "" || ddlCity === null || ddlCity === undefined || ddlCity === "null") {
        text = "Please enter/choose City ..!";
        document.getElementById("ValStrddlCity").innerHTML = text;
        document.getElementById("ValStrddlCity").style.display = "block";
        document.getElementById("ddlCity").value = "";
        document.getElementById("ddlCity").focus();
        return false;
    }
    else {
        document.getElementById("ValStrddlCity").style.display = "none";
    }
    if (ddlPinCode === "" || ddlPinCode === null || ddlPinCode === undefined || ddlPinCode === "null") {
        text = "Please enter/choose PinCode..!";
        document.getElementById("ValStrddlPinCode").innerHTML = text;
        document.getElementById("ValStrddlPinCode").style.display = "block";
        document.getElementById("ddlPinCode").value = "";
        document.getElementById("ddlPinCode").focus();
        return false;
    }
    else {
        document.getElementById("ValStrddlPinCode").style.display = "none";
    }

    if (TxtPhone_1 === "" || TxtPhone_1 === null || TxtPhone_1 === undefined || TxtPhone_1 === "null") {
        text = "Please enter Phone 1..!";
        document.getElementById("ValStrTxtPhone_1").innerHTML = text;
        document.getElementById("ValStrTxtPhone_1").style.display = "block";
        document.getElementById("TxtPhone_1").value = "";
        document.getElementById("TxtPhone_1").focus();
        return false;
    }
    else {
        document.getElementById("ValStrTxtPhone_1").style.display = "none";
    }
    if (TxtEmail === "" || TxtEmail === null || TxtEmail === undefined || TxtEmail === "null") {
        text = "Please enter Email..!";
        document.getElementById("ValStrTxtEmail").innerHTML = text;
        document.getElementById("ValStrTxtEmail").style.display = "block";
        document.getElementById("TxtEmail").value = "";
        document.getElementById("TxtEmail").focus();
        return false;
    }
    else {
        document.getElementById("ValStrTxtEmail").style.display = "none";
    }

    var txt = 'Are you sure to save the data?';
    swal({
        title: "Saving Data...",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: true
    },
        function () {
            document.getElementById("LOADER").style.display = "block";

            /////////Uploading header Image Using Handler
            var fileheaderimageupload = $("#headerimageupload").get(0);
            var fileheaderimage = fileheaderimageupload.files;
            var test1 = new FormData();
            var folderimgdelheaderimage = document.getElementById("imgpathstringheaderimage").value;
            for (var j = 0; j < fileheaderimage.length; j++) {
                test1.append(fileheaderimage[j].name, fileheaderimage[j]);
            }
            if (fileheaderimage.length > 0) {
                $.ajax({
                    url: "Handler.ashx",
                    type: "POST",
                    async: false,
                    contentType: false,
                    processData: false,
                    data: test1,
                    success: function (result) {
                        var imgheaderpath = result;
                        if (imgheaderpath !== "")
                            folderimgdelheaderimage = document.getElementById("imgpathstringheaderimage").value = imgheaderpath;
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
            var jsonObjectsRecordMain = [];
            var OperationRecordMain = {};

            OperationRecordMain = {};
            if (GblStatus === "Update") {
                OperationRecordMain.CompanyID = document.getElementById("TxtCompanyID").value;
            }
            OperationRecordMain.CompanyName = TxtCompanyName;
            OperationRecordMain.Address1 = TxtAddress;
            OperationRecordMain.City = ddlCity;
            OperationRecordMain.State = ddlState;
            OperationRecordMain.Pincode = ddlPinCode;
            OperationRecordMain.Country = ddlCountry;
            OperationRecordMain.FAX = TxtFax;
            OperationRecordMain.Website = TxtWeb;
            OperationRecordMain.PAN = TxtPAN;
            OperationRecordMain.CINNo = TxtCIN;
            OperationRecordMain.GSTIN = TxtGSTIN;
            OperationRecordMain.ProductionUnitName = TxtProductionuint;
            OperationRecordMain.ImportExportCode = ImportExportCode;
            OperationRecordMain.PictureQuotationPath = folderimgdelheaderimage;

            jsonObjectsRecordMain.push(OperationRecordMain);
            jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);

            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_NewCompany.asmx/UpdatCompanyData",
                    data: '{objCompany_Entry:' + jsonObjectsRecordMain + '}',
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
                            swal("Updated..!", "Your data updated successfully", "success");
                            location.reload();
                        } else {
                            swal("Error..!", res, "warning");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
        });
});

//$("#BtnNew").click(function () {
//    GblStatus = "";
//    document.getElementById("TxtCompanyID").value = "";
//    BlankField();
//});

function BlankField() {
    document.getElementById("TxtCompanyName").value = "";
    document.getElementById("TxtAddress").value = "";
    $("#ddlCity").dxSelectBox({ value: null });
    $("#ddlState").dxSelectBox({ value: null });
    $("#ddlPinCode").dxSelectBox({ value: null });
    $("#ddlCountry").dxSelectBox({ value: null });
    document.getElementById("TxtPhone_1").value = "";
    document.getElementById("TxtFax").value = "";
    document.getElementById("TxtEmail").value = "";
    document.getElementById("TxtWeb").value = "";
    document.getElementById("TxtPAN").value = "";
    document.getElementById("TxtCIN").value = "";
    document.getElementById("TxtGSTIN").value = "";
    document.getElementById("TxtProductionuint").value = "";
    document.getElementById("TxtImportExportCode").value = "";
}

function headerimagepreview(inputheader) {
    var fileSignUpload = document.getElementById("headerimageupload");
    if (typeof (fileSignUpload.files) !== "undefined") {
        var size = parseFloat(fileSignUpload.files[0].size / 1024).toFixed(2);
        if (size > 300) {
            alert("Your attachment should be less than or equal to 300 kb..!");
            return false;
        }
    }
    if (inputheader.files && inputheader.files[0]) {
        var filesignrdr = new FileReader();
        filesignrdr.onload = function (e) {
            $('#previewimgheader').attr('src', e.target.result);
        };
        filesignrdr.readAsDataURL(inputheader.files[0]);
    }
}
