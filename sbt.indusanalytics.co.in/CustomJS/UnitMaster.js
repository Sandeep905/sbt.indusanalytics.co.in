
var GblStatus = "";

var sizeCons = ["Simple", "Compound"], processgrid = [], Objid = [];
$("#SelectBoxType").dxSelectBox({
    items: sizeCons,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#UnitGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    selection: {
        mode: "single"
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: {
        visible: true, applyFilter: "auto"
    },
    headerFilter: {
        visible: true
    },
    searchPanel: {
        visible: true
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Category master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (e) {
        document.getElementById("TxtUnitID").value = "";
        if (e.selectedRowsData.length > 0) {
            document.getElementById("TxtUnitID").value = e.selectedRowsData[0].UnitID;
        }
    },
    columns: [
        { dataField: "UnitID", visible: false, caption: "UnitID" },
        { dataField: "UnitName", visible: true, caption: "Unit Name" },
        { dataField: "UnitSymbol", visible: true, caption: "Unit Symbol" },
        { dataField: "Type", visible: true, caption: "Type" },
        { dataField: "ConversionValue", visible: true, caption: "ConversionValue" },
        { dataField: "DecimalPlace", visible: true, caption: "DecimalPlace" }
    ]
});

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_UnitMaster.asmx/GetUnit",
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

            $("#UnitGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

//Creation of Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {
    var TxtUnitID = document.getElementById("TxtUnitID").value;
    if (TxtUnitID === "" || TxtUnitID === null || TxtUnitID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    GblStatus = "Update";

    var UnitGrid = $('#UnitGrid').dxDataGrid('instance');
    var selectedUnitGridRows = UnitGrid.getSelectedRowsData();

    document.getElementById("UnitName").value = selectedUnitGridRows[0].UnitName;
    document.getElementById("UnitSymbole").value = selectedUnitGridRows[0].UnitSymbol;
    $("#SelectBoxType").dxSelectBox({ value: selectedUnitGridRows[0].Type });
    document.getElementById("ConversionValue").value = selectedUnitGridRows[0].ConversionValue;
    document.getElementById("DecimalPlace").value = selectedUnitGridRows[0].DecimalPlace;

    if (selectedUnitGridRows[0].UnitName === "" && selectedUnitGridRows[0].UnitSymbol === "") {
        document.getElementById("BtnDeletePopUp").disabled = true;
        document.getElementById("BtnSave").disabled = true;
        document.getElementById("BtnSaveAS").disabled = true;
    }
    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#BtnNew").click(function () {
    document.getElementById("UnitName").value = "";
    document.getElementById("UnitSymbole").value = "";
    $("#SelectBoxType").dxSelectBox({ value: null });
    document.getElementById("ConversionValue").value = "";
    document.getElementById("DecimalPlace").value = "";
    document.getElementById("TxtUnitID").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    document.getElementById("BtnSaveAS").disabled = true;
});

$("#BtnSave").click(function () {
    SaveBtnFun();
});

$("#DeleteButton").click(function () {
    var TxtUnitID = document.getElementById("TxtUnitID").value;
    if (TxtUnitID === "" || TxtUnitID === null || TxtUnitID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this transaction!',
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
                url: "WebService_UnitMaster.asmx/DeleteUnitMasterData",
                data: '{TxtUnitID:' + JSON.stringify(TxtUnitID) + '}',
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

$("#BtnSaveAS").click(function () {
    GblStatus = "";
    SaveBtnFun();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

function SaveBtnFun() {
    var UnitName = document.getElementById("UnitName").value.trim();
    var UnitSymbole = document.getElementById("UnitSymbole").value.trim();
    var SelectBoxType = $('#SelectBoxType').dxSelectBox('instance').option('value');
    var ConversionValue = document.getElementById("ConversionValue").value.trim();
    var DecimalPlace = document.getElementById("DecimalPlace").value.trim();

    if (UnitName === "") {
        alert("Please Enter Unit Name");
        document.getElementById("UnitName").focus();
        document.getElementById("ValStrUnitName").style.fontSize = "10px";
        document.getElementById("ValStrUnitName").style.display = "block";
        document.getElementById("ValStrUnitName").innerHTML = 'This field should not be empty..Unit Name';
        return false;
    }
    else {
        document.getElementById("ValStrUnitName").style.display = "none";
    }

    if (UnitSymbole === "") {
        alert("Please Enter Unit Symbole");
        document.getElementById("UnitSymbole").focus();
        document.getElementById("ValStrUnitSymbole").style.fontSize = "10px";
        document.getElementById("ValStrUnitSymbole").style.display = "block";
        document.getElementById("ValStrUnitSymbole").innerHTML = 'This field should not be empty..Unit Symbole';
        return false;
    }
    else {
        document.getElementById("ValStrUnitSymbole").style.display = "none";
    }

    if (SelectBoxType === null || SelectBoxType === "") {
        alert("Please select..Type");
        document.getElementById("ValStrSelectBoxType").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxType").style.display = "block";
        document.getElementById("ValStrSelectBoxType").innerHTML = 'This field should not be empty..Type';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxType").style.display = "none";
    }

    var jsonObjectsGroupMasterRecord = [];
    var OperationGroupMasterRecord = {};

    OperationGroupMasterRecord.UnitName = UnitName;
    OperationGroupMasterRecord.UnitSymbol = UnitSymbole;
    OperationGroupMasterRecord.Type = SelectBoxType;
    OperationGroupMasterRecord.ConversionValue = ConversionValue;
    OperationGroupMasterRecord.DecimalPlace = DecimalPlace;

    jsonObjectsGroupMasterRecord.push(OperationGroupMasterRecord);

    var CostingDataGroupMaster = JSON.stringify(jsonObjectsGroupMasterRecord);

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

            document.getElementById("LOADER").style.display = "block";
            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_UnitMaster.asmx/UpdatUnitData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',TxtUnitID:' + JSON.stringify(document.getElementById("TxtUnitID").value.trim()) + '}',
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
                            swal("Saved!", "Your data Updated", "success");
                            location.reload();
                        } else if (res === "Exist") {
                            swal("Duplicate!", "This Unit Name already Exist..\n Please enter another Unit Name..", "");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "WebService_UnitMaster.asmx/SaveUnitData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',UnitName:' + JSON.stringify(document.getElementById("UnitName").value.trim()) + ',SelectBoxType:' + JSON.stringify($('#SelectBoxType').dxSelectBox('instance').option('value')) + '}',
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
                        } else if (res === "Exist") {
                            swal("Duplicate!", "This Unit Name already Exist..\n Please enter another Unit Name..", "");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            }
        });
}