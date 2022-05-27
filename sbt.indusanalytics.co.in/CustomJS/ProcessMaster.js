"use strict";

var ContentGrid = "", ObjidContent = [];

var GblStatus = "", Objid = [];
var existslab = [];
var UnderDI = "";
var UnderGroupID = "";

var MachiGrid = "";
var FlagEditRateFactor = false;

$("#selStartUnit").dxSelectBox({
    items: [],
    placeholder: "Select Start Unit",
    displayExpr: 'UnitName',
    valueExpr: 'UnitSymbol',
    searchEnabled: true,
    showClearButton: true
});

$("#selEndUnit").dxSelectBox({
    items: [],
    placeholder: "Select End Unit",
    displayExpr: 'UnitName',
    valueExpr: 'UnitSymbol',
    searchEnabled: true,
    showClearButton: true
});

$("#selSizeConsidered").dxSelectBox({
    items: ["Process", "Specific", "None"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

var ProdType = ["Form Wise Production", "Gathering", "Combine Contents Or Binding", "None"];
$("#OptionProductions").dxRadioGroup({
    items: ProdType,
    value: ProdType[3],
    layout: "horizontal"
});

var ChargesApplicable = ["Actual Sheets", "Actual Sheets + Make Ready Sheets", "Actual Sheets + Wastage Sheets", "Actual Sheets + Make Ready Sheets + Wastage Sheets"];
$("#selChargesApplicable").dxSelectBox({
    items: ChargesApplicable,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#selPreePost").dxSelectBox({
    items: ["Pre", "Post"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

var UnitConversion = ["Cuts Unit", "Ups Unit", "Manual", "Forms Unit", "None"];
$("#selUnitConversion").dxSelectBox({
    items: UnitConversion,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#selProcessPurpose").dxSelectBox({
    items: ["Estimate", "Production", "Work Order"],
    placeholder: "Select --",
    showClearButton: true
});

$("#selUnderDepartment").dxSelectBox({
    items: [],
    placeholder: "Select Department",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        UnderGroupID = data.value;

        var ProcessMasterGrid = $('#ProcessMasterGrid').dxDataGrid('instance');
        var selectedRows = ProcessMasterGrid.getSelectedRowsData();

        if (GblStatus === "Update") {
            if (UnderGroupID !== selectedRows[0].DepartmentID) {
                Objid = [];
            }
        }

        $("#GridMachineAllocation").dxDataGrid({
            dataSource: {
                store: {
                    type: "array",
                    key: "MachineID",
                    data: MachiGrid
                }
            },
            selectedRowKeys: Objid
        });

        $("#GridMachineAllocation").dxDataGrid("getCombinedFilter", true);
        var dataGrid = $('#GridMachineAllocation').dxDataGrid('instance');
        dataGrid.clearFilter();
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_PurchaseOrder.asmx/CheckIsAdmin",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d === "True") {
            FlagEditRateFactor = true;
        } else
            FlagEditRateFactor = false;
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProcessMaster.asmx/MachiGrid",
    data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

        MachiGrid = JSON.parse(res);
        $("#GridMachineAllocation").dxDataGrid({
            dataSource: {
                store: {
                    type: "array",
                    key: "MachineID",
                    data: MachiGrid
                }
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProcessMaster.asmx/GetSelectDepartment",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var DM = JSON.parse(res);

        $("#selUnderDepartment").dxSelectBox({ items: DM });
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProcessMaster.asmx/GetTypeOfCharges",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        $("#selTypeOfCharges").dxSelectBox({
            items: RES1,
            placeholder: "Select Type Of Charges",
            displayExpr: 'TypeOfCharges',
            valueExpr: 'TypeOfCharges',
            searchEnabled: true,
            showClearButton: true,
            onValueChanged: function (data) {
                var ChargesType = data.value;

                var includesheet = ChargesType.toLowerCase().includes("sheet");
                if (includesheet === true) {
                    document.getElementById("DivChargesApplicable").style.display = "block";
                }
                else {
                    document.getElementById("DivChargesApplicable").style.display = "none";
                    $("#selChargesApplicable").dxSelectBox({ value: null });
                }
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProcessMaster.asmx/StartUnit",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        $("#selStartUnit").dxSelectBox({ items: RES1 });
        $("#selEndUnit").dxSelectBox({ items: RES1 });
    }
});

DefaultMasterField();

function DefaultMasterField() {
    try {

        document.getElementById("LOADER").style.display = "block";
        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServiceProcessMaster.asmx/ProcessMaster",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, "&");
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);

                document.getElementById("LOADER").style.display = "none";
                // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                let GBLFieldProcessMaster = JSON.parse(res);
                $("#ProcessMasterGrid").dxDataGrid({ dataSource: GBLFieldProcessMaster });
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#ProcessMasterGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "single" },
    paging: {
        pageSize: 15
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 25, 50, 100]
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    rowAlternationEnabled: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Process Master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) document.getElementById("txtProcessID").value = data[0].ProcessID;/// grid.cellValue(Row, 0);
    },
    columns: [
        { dataField: "DisplayProcessName", visible: true, caption: "Process Name", width: 120 },
        { dataField: "TypeofCharges", visible: true, caption: "Type Of Charges", width: 120 },
        { dataField: "SizeToBeConsidered", visible: true, caption: "Size To Be Cons.", width: 120 },
        { dataField: "MinimumCharges", visible: true, caption: "Min. Charges", width: 120 },
        { dataField: "SetupCharges", visible: true, caption: "Setup Charges", width: 120 },
        { dataField: "IsDisplay", visible: true, caption: "Is Display", dataType: "boolean", width: 120 },
        { dataField: "DepartmentName", visible: true, caption: "Department", width: 120 },
        { dataField: "StartUnit", visible: true, caption: "Start Unit", width: 120 },
        { dataField: "EndUnit", visible: true, caption: "End Unit", width: 120 },
        { dataField: "UnitConversion", visible: true, caption: "Unit Conversion", width: 120 },
        { dataField: "PrePress", visible: true, caption: "Pre Press", width: 120 },
        { dataField: "ProcessName", visible: false, caption: "ProcessName", width: 120 }
    ]
});

$("#GridMachineAllocation").dxDataGrid({
    dataSource: [],
    sorting: {
        mode: "multiple"
    },
    paging: false,
    showBorders: true,
    showRowLines: true,
    selection: { mode: "multiple" },
    height: function () {
        return window.innerHeight / 1.4;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    scrolling: { mode: 'virtual' },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "MachineID", visible: false, caption: "MachineID", width: 300 },
        { dataField: "MachineName", visible: true, caption: "Machine Name" },
        { dataField: "DepartmentID", visible: false, caption: "DepartmentID" },
        { dataField: "DepartmentName", visible: true, caption: "Departmen tName" }
    ],
    selectedRowKeys: Objid,
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            $("#MachineId").text(
                $.map(data, function (value) {
                    return value.MachineID;    //alert(value.ProcessId);
                }).join(','));
        }
        else {
            $("#MachineId").text("");
        }
    }
});

$("#CreateButton").click(function () {

    ObjidContent = [];

    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");

    if (GblStatus === "Update") {
        blankfield();
    }
    Slabgrid();
    GblContent();
    GblStatus = "";

    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab
});

$("#EditButton").click(function () {
    blankfield();
    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = "";

    var txtGetGridRow = Number(document.getElementById("txtProcessID").value);

    if (txtGetGridRow === 0 || txtGetGridRow === null || txtGetGridRow === undefined) {
        swal("Please choose any row from below grid..!");
        return false;
    }
    GblStatus = "Update";
    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab

    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    var ProcessMasterGrid = $('#ProcessMasterGrid').dxDataGrid('instance');
    var selectedPProcessRows = ProcessMasterGrid.getSelectedRowsData();

    document.getElementById("txtProcessName").value = selectedPProcessRows[0].ProcessName;
    document.getElementById("txtDisplayName").value = selectedPProcessRows[0].DisplayProcessName;

    Objid = [];
    var selectMID = selectedPProcessRows[0].AllocattedMachineID;

    if (selectMID === "" || selectMID === null || selectMID === undefined || selectMID === "null") {
        Objid = [];
    }
    else {
        var selectMIDSplit = selectMID.split(',');
        for (var s in selectMIDSplit) {
            Objid.push(selectMIDSplit[s]);
        }
    }

    $("#GridMachineAllocation").dxDataGrid({
        selectedRowKeys: Objid
    });

    var IDString = selectedPProcessRows[0].AllocatedContentID;
    if (IDString === "" || IDString === null || IDString === undefined) {
        ObjidContent = [];
    }
    else {
        var selectMIDSplitElse = IDString.split(',');
        for (var sp in selectMIDSplitElse) {
            ObjidContent.push(selectMIDSplitElse[sp]);
        }
    }

    UnderDI = selectedPProcessRows[0].DepartmentID;
    UnderGroupID = UnderDI;

    $("#selUnderDepartment").dxSelectBox({ value: UnderDI });
    $("#selTypeOfCharges").dxSelectBox({ value: selectedPProcessRows[0].TypeofCharges });
    $("#selChargesApplicable").dxSelectBox({ value: selectedPProcessRows[0].ChargeApplyOnSheets });
    $("#selSizeConsidered").dxSelectBox({ value: selectedPProcessRows[0].SizeToBeConsidered });
    $("#OptionProductions").dxRadioGroup({ value: selectedPProcessRows[0].ProcessProductionType });
    $("#selPreePost").dxSelectBox({ value: selectedPProcessRows[0].PrePress });
    $("#selStartUnit").dxSelectBox({ value: selectedPProcessRows[0].StartUnit });
    $("#selEndUnit").dxSelectBox({ value: selectedPProcessRows[0].EndUnit });
    $("#selUnitConversion").dxSelectBox({ value: selectedPProcessRows[0].UnitConversion });
    $("#selProcessPurpose").dxSelectBox({ value: selectedPProcessRows[0].ProcessPurpose });

    document.getElementById("txtMinimumCharges").value = selectedPProcessRows[0].MinimumCharges;
    document.getElementById("txtMakeSetupCharges").value = selectedPProcessRows[0].SetupCharges;
    document.getElementById("chkDisplayInQuotation").checked = selectedPProcessRows[0].IsDisplay;
    document.getElementById("txtRate").value = selectedPProcessRows[0].Rate;

    $.ajax({
        type: "POST",
        url: "WebServiceProcessMaster.asmx/ExistSlab",
        data: '{ProcessID:' + JSON.stringify(document.getElementById("txtProcessID").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, "&");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res);
            $("#GridSlab").dxDataGrid({ dataSource: RES1 });
        }
    });

    GblContent();
});

//SaveAs Data On Pop Up
$("#BtnSaveAS").click(function () {
    GblStatus = "";
    $("#BtnSave").click();
});

$("#DeleteButton").click(function () {
    var txtGetGridRow = Number(document.getElementById("txtProcessID").value);
    if (txtGetGridRow === 0 || txtGetGridRow === null || txtGetGridRow === undefined) {
        swal("Please choose any row from below grid..!");
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this process!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
        function () {
            document.getElementById("LOADER").style.display = "block";
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebServiceProcessMaster.asmx/DeleteprocessMasterData",
                data: '{ProcessID:' + JSON.stringify(document.getElementById("txtProcessID").value.trim()) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    document.getElementById("LOADER").style.display = "none";
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (results.d === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        location.reload();
                    } else {
                        swal("Not Deleted!", results.d, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });
        });
});

var controll = "txtProcessName,txtDisplayName,selUnderDepartment,selTypeOfCharges,selChargesApplicable,selSizeConsidered,selPreePost,selStartUnit,selEndUnit,selUnitConversion,txtMinimumCharges,txtMakeSetupCharges";
$("#BtnSave").click(function () {
    var alertTag;
    var SPLITcontroll = controll.split(',');
    if (SPLITcontroll.length > 0) {
        for (var i = 0; i < SPLITcontroll.length; i++) {
            var controlobj = SPLITcontroll[i];
            controlobj = controlobj.replace(/' '/g, '');
            var distinctCntroll = controlobj.split('');

            if (distinctCntroll[0] === "txt") {
                if (controlobj !== "txtMinimumCharges" && controlobj !== "txtMakeSetupCharges") {
                    if (Number(document.getElementById(controlobj).value) < 0 || document.getElementById(controlobj).value === "" || document.getElementById(controlobj).value === null) {
                        swal("Please enter.." + distinctCntroll[1]);
                        document.getElementById(controlobj).focus();
                        alertTag = "ValStr" + distinctCntroll[1];
                        document.getElementById(alertTag).style.fontSize = "10px";
                        document.getElementById(alertTag).style.display = "block";
                        document.getElementById(alertTag).innerHTML = 'This field should not be empty..' + distinctCntroll[1];
                        return false;
                    }
                    else {
                        alertTag = "ValStr" + distinctCntroll[1];
                        document.getElementById(alertTag).style.display = "none";
                    }
                }
            }
            else if (distinctCntroll[0] === "sel") {
                if (controlobj === "selChargesApplicable") {
                    var TOC = $("#selTypeOfCharges").dxSelectBox("instance").option('text');
                    var ISsheet = TOC.toLowerCase().includes("sheet");
                    if (ISsheet === true) {
                        if ($("#" + controlobj).dxSelectBox("instance").option('text') === "" || $("#" + controlobj).dxSelectBox("instance").option('text') === undefined || $("#" + controlobj).dxSelectBox("instance").option('text') === null) {
                            swal("Please select.." + distinctCntroll[1]);
                            alertTag = "ValStr" + distinctCntroll[1];
                            document.getElementById(alertTag).style.fontSize = "10px";
                            document.getElementById(alertTag).style.display = "block";
                            document.getElementById(alertTag).innerHTML = 'This field should not be empty..' + distinctCntroll[1];

                            return false;
                        }
                        else {
                            alertTag = "ValStr" + distinctCntroll[1];
                            document.getElementById(alertTag).style.display = "none";
                        }
                    }

                } else {

                    if ($("#" + controlobj).dxSelectBox("instance").option('text') === "" || $("#" + controlobj).dxSelectBox("instance").option('text') === undefined || $("#" + controlobj).dxSelectBox("instance").option('text') === null) {
                        swal("Please select.." + distinctCntroll[1]);
                        alertTag = "ValStr" + distinctCntroll[1];
                        document.getElementById(alertTag).style.fontSize = "10px";
                        document.getElementById(alertTag).style.display = "block";
                        document.getElementById(alertTag).innerHTML = 'This field should not be empty..' + distinctCntroll[1];

                        return false;
                    }
                    else {
                        alertTag = "ValStr" + distinctCntroll[1];
                        document.getElementById(alertTag).style.display = "none";
                    }
                }
            }
        }
    }

    if (gridInstance._options.dataSource.length > 0) {
        if (gridInstance._options.dataSource.length < 1) {
            swal("Please enter Slab rate..! Minimum one Slab rate required...");
            return false;
        }
    }
    if (gridInstance._options.dataSource.length > 0) {
        document.getElementById("txtRate").value = gridInstance.cellValue(0, 4);
    }

    if (document.getElementById("txtRate").value === "" || document.getElementById("txtRate").value === undefined || document.getElementById("txtRate").value === null) {
        swal("Please enter Rate");
        document.getElementById("txtRate").focus();
        alertTag = "ValStrtxtRate";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Rate';
        return false;
    }
    else {
        alertTag = "ValStrtxtRate";
        document.getElementById(alertTag).style.display = "none";
    }
    var GridRow = "";

    var txtMID = $("#MachineId").text();
    if (txtMID === "" || txtMID === null) {
        GridRow = JSON.stringify(Objid);
        if (GridRow === [] || GridRow === "[]") {
            GridRow = "";
        }
        else {
            GridRow = GridRowContent.replace(/"/g, '');
            GridRow = GridRowContent.substr(1);
            GridRow = GridRowContent.slice(0, -1);
        }
    }
    else if (txtMID === "" || txtMID === null || txtMID === undefined) {
        GridRow = "";
    }
    else {
        GridRow = txtMID;
    }

    var jsonObjectsProcessMasterDetailRecord = [];
    var OperationProcessMasterDetailRecord = {};


    OperationProcessMasterDetailRecord.ProcessName = document.getElementById("txtProcessName").value.trim();
    OperationProcessMasterDetailRecord.DisplayProcessName = document.getElementById("txtDisplayName").value.trim();

    OperationProcessMasterDetailRecord.DepartmentID = $("#selUnderDepartment").dxSelectBox("instance").option('value');

    OperationProcessMasterDetailRecord.TypeofCharges = $("#selTypeOfCharges").dxSelectBox("instance").option('text');
    OperationProcessMasterDetailRecord.SizeToBeConsidered = $("#selSizeConsidered").dxSelectBox("instance").option('value');
    OperationProcessMasterDetailRecord.PrePress = $("#selPreePost").dxSelectBox("instance").option('value');
    OperationProcessMasterDetailRecord.StartUnit = $("#selStartUnit").dxSelectBox("instance").option('value');
    OperationProcessMasterDetailRecord.EndUnit = $("#selEndUnit").dxSelectBox("instance").option('value');
    OperationProcessMasterDetailRecord.UnitConversion = $("#selUnitConversion").dxSelectBox("instance").option('value');
    OperationProcessMasterDetailRecord.MinimumCharges = document.getElementById("txtMinimumCharges").value.trim();
    OperationProcessMasterDetailRecord.SetupCharges = document.getElementById("txtMakeSetupCharges").value.trim();
    OperationProcessMasterDetailRecord.IsDisplay = document.getElementById("chkDisplayInQuotation").checked;
    OperationProcessMasterDetailRecord.AllocattedMachineID = GridRow;
    OperationProcessMasterDetailRecord.Rate = document.getElementById("txtRate").value;
    OperationProcessMasterDetailRecord.ProcessProductionType = $("#OptionProductions").dxRadioGroup("instance").option('value');
    OperationProcessMasterDetailRecord.ProcessPurpose = $("#selProcessPurpose").dxSelectBox("instance").option('value');

    var TOCW = $("#selTypeOfCharges").dxSelectBox("instance").option('text');
    var ISsheetW = TOCW.toLowerCase().includes("sheet");

    if (ISsheetW === true) {
        OperationProcessMasterDetailRecord.ChargeApplyOnSheets = $("#selChargesApplicable").dxSelectBox("instance").option('value');
    }

    jsonObjectsProcessMasterDetailRecord.push(OperationProcessMasterDetailRecord);

    var CostingDataProcessDetailMaster = JSON.stringify(jsonObjectsProcessMasterDetailRecord);

    //Machine Allocation
    var jsonObjectsMachineAllocationDetailRecord = [];
    var OperationMachineAllocationDetailRecord = {};

    var CostingDataMachinAllocation = [];
    if (GridRow !== "") {
        GridRow = GridRow.split(',');
        if (GridRow.length > 0) {
            for (var m = 0; m < GridRow.length; m++) {
                OperationMachineAllocationDetailRecord = {};
                OperationMachineAllocationDetailRecord.MachineID = GridRow[m];

                jsonObjectsMachineAllocationDetailRecord.push(OperationMachineAllocationDetailRecord);
            }
            CostingDataMachinAllocation = JSON.stringify(jsonObjectsMachineAllocationDetailRecord);
        }
    }
    else {
        CostingDataMachinAllocation = JSON.stringify(CostingDataMachinAllocation);
    }

    //Content Grid

    var jsonObjectsContentAllocationDetailRecord = [];
    var OperationContentAllocationDetailRecord = {};

    var CostingDataContentAllocation = [];

    var txtCID = $("#ContentId").text();
    var GridRowContent = "";

    if (txtCID === "null") {
        GridRowContent = JSON.stringify(ObjidContent);
        if (GridRowContent === [] || GridRowContent === "[]") {
            GridRowContent = "";
        }
        else {
            GridRowContent = GridRowContent.replace(/"/g, '');
            GridRowContent = GridRowContent.substr(1);
            GridRowContent = GridRowContent.slice(0, -1);
        }
    }
    else if (txtCID === "" || txtCID === null || txtCID === undefined) {
        GridRowContent = "";
    }
    else {
        GridRowContent = txtCID;
    }

    var finalStringContent = GridRowContent;
    //alert(finalStringContent);
    if (GridRowContent !== "") {
        GridRowContent = GridRowContent.split(',');
        if (GridRowContent.length > 0) {
            for (var cm = 0; cm < GridRowContent.length; cm++) {
                OperationContentAllocationDetailRecord = {};
                OperationContentAllocationDetailRecord.ContentID = GridRowContent[cm];

                jsonObjectsContentAllocationDetailRecord.push(OperationContentAllocationDetailRecord);
            }

            CostingDataContentAllocation = JSON.stringify(jsonObjectsContentAllocationDetailRecord);
        }
    }
    else {
        CostingDataContentAllocation = JSON.stringify(CostingDataContentAllocation);
    }


    //Slab Grid
    var jsonObjectsSlabDetailRecord = [];
    var OperationSlabDetailRecord = {};

    var GridSlab = $('#GridSlab').dxDataGrid('instance');
    var SlabGridRow = GridSlab._options.dataSource.length;

    var CostingDataSlab = [];

    if (SlabGridRow > 0) {

        for (var k = 0; k < SlabGridRow; k++) {
            ////if (GridSlab.columnCount() > 3) {
            ////    for (var l = 3; l < GridSlab.columnCount() ; l++) {
            ////        OperationSlabDetailRecord = {};
            ////        OperationSlabDetailRecord.FromQty = GridSlab.cellValue(k, 0);
            ////        OperationSlabDetailRecord.ToQty = GridSlab.cellValue(k, 1);
            ////        OperationSlabDetailRecord.StartUnit = GridSlab.cellValue(k, 2);
            ////        OperationSlabDetailRecord.Rate = GridSlab.cellValue(k, l);
            ////        OperationSlabDetailRecord.RateFactor = gridInstance.columnOption(l).caption;


            ////        jsonObjectsSlabDetailRecord.push(OperationSlabDetailRecord);
            ////    }
            ////} else {
            ////    OperationSlabDetailRecord = {};
            ////    OperationSlabDetailRecord.FromQty = GridSlab.cellValue(k, 0);
            ////    OperationSlabDetailRecord.ToQty = GridSlab.cellValue(k, 1);
            ////    OperationSlabDetailRecord.StartUnit = GridSlab.cellValue(k, 2);

            ////    jsonObjectsSlabDetailRecord.push(OperationSlabDetailRecord);
            ////}
            OperationSlabDetailRecord = {};
            OperationSlabDetailRecord.FromQty = GridSlab._options.dataSource[k].FromQty;
            OperationSlabDetailRecord.ToQty = GridSlab._options.dataSource[k].ToQty;
            OperationSlabDetailRecord.StartUnit = GridSlab._options.dataSource[k].StartUnit;
            OperationSlabDetailRecord.RateFactor = GridSlab._options.dataSource[k].RateFactor;
            OperationSlabDetailRecord.Rate = GridSlab._options.dataSource[k].Rate;
            OperationSlabDetailRecord.MinimumCharges = GridSlab._options.dataSource[k].MinimumCharges;
            OperationSlabDetailRecord.IsLocked = GridSlab._options.dataSource[k].IsLocked;
            jsonObjectsSlabDetailRecord.push(OperationSlabDetailRecord);
        }
    }
    CostingDataSlab = JSON.stringify(jsonObjectsSlabDetailRecord);

    var txt = 'If you are confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: true
    },
        function () {

            document.getElementById("LOADER").style.display = "block";
            // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            if (GblStatus === "Update") {

                $.ajax({
                    type: "POST",
                    url: "WebServiceProcessMaster.asmx/UpdatprocessMasterData",
                    data: '{CostingDataProcessDetailMaster:' + CostingDataProcessDetailMaster + ',CostingDataMachinAllocation:' + CostingDataMachinAllocation + ',CostingDataContentAllocation:' + CostingDataContentAllocation + ',CostingDataSlab:' + CostingDataSlab + ',ProcessID:' + JSON.stringify(document.getElementById("txtProcessID").value.trim()) + ',finalStringContent:' + JSON.stringify(finalStringContent) + '}',
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
                        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        if (res === "Success") {
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        } else {
                            swal("Not Updated!", res, "warning");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
            else {

                $.ajax({
                    type: "POST",
                    url: "WebServiceProcessMaster.asmx/SaveprocessMasterData",
                    data: '{CostingDataProcessDetailMaster:' + CostingDataProcessDetailMaster + ',CostingDataMachinAllocation:' + CostingDataMachinAllocation + ',CostingDataContentAllocation:' + CostingDataContentAllocation + ',CostingDataSlab:' + CostingDataSlab + ',ProcessName:' + JSON.stringify(document.getElementById("txtProcessName").value.trim()) + ',finalStringContent:' + JSON.stringify(finalStringContent) + '}',
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
                        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        if (res === "Success") {
                            swal("Saved!", "Your data saved", "success");
                            location.reload();
                        } else {
                            swal("Not Saved!", res, "warning");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            }
        });
});

var gridInstance = "", DynamicColPush = [];
var MaxNo = 0;
$("#btnAddColumn").click(function () {
    var alertTag;
    var txtSheetFrom = document.getElementById("txtSheetFrom").value.trim();
    var txtSheetTo = document.getElementById("txtSheetTo").value.trim();
    var txtStartUnit = document.getElementById("txtStartUnit").value.trim();
    var txtFactorName = document.getElementById("txtFactorName").value.trim();
    var txtFactorRate = document.getElementById("txtFactorRate").value.trim();
    var txtMinCharge = document.getElementById("txtMinCharge").value.trim();

    if (txtSheetFrom === "" || txtSheetFrom === undefined || txtSheetFrom === null) {
        //alert("This field should not be empty.. Sheet From");
        alertTag = "ValStrtxtSheetFrom";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Sheet From';
        document.getElementById("txtSheetFrom").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtSheetFrom";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtSheetTo === "" || txtSheetTo === undefined || txtSheetFrom === null) {
        //alert("This field should not be empty.. Sheet To");
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Sheet To';
        document.getElementById("txtSheetTo").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtStartUnit === "" || txtStartUnit === undefined || txtSheetFrom === null) {
        //alert("This field should not be empty.. Start Unit");
        alertTag = "ValStrtxtStartUnit";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Start Unit';
        document.getElementById("txtStartUnit").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtStartUnit";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtFactorName === "" || txtFactorName === undefined || txtSheetFrom === null) {
        //alert("This field should not be empty.. Factor Name");
        alertTag = "ValStrtxtFactorName";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Factor Name';
        document.getElementById("txtFactorName").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtFactorName";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtFactorRate === "" || Number(txtFactorRate) < 0 || txtFactorRate === null) {
        //alert("This field should not be empty.. Rate");
        alertTag = "ValStrtxtFactorRate";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Rate';
        document.getElementById("txtFactorRate").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtFactorRate";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtMinCharge === "" || Number(txtMinCharge) < 0 || txtMinCharge === null) {
        ///alert("This field should not be empty.. Min.Charge");
        alertTag = "ValStrtxtMinCharge";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Min.Charge';
        document.getElementById("txtMinCharge").focus();
        return false;
    }
    else {
        alertTag = "ValStrtxtMinCharge";
        document.getElementById(alertTag).style.display = "none";
    }

    var dataGrid = $('#GridSlab').dxDataGrid('instance');
    var dataGridSlabsRow = dataGrid._options.dataSource.length;

    for (var h = 0; h < dataGridSlabsRow; h++) {
        if (dataGrid._options.dataSource[h].FromQty === txtSheetFrom && dataGrid._options.dataSource[h].ToQty === txtSheetTo && dataGrid._options.dataSource[h].StartUnit.toLowerCase() === txtStartUnit.toLowerCase() && dataGrid._options.dataSource[h].RateFactor.toLowerCase() === txtFactorName.toLowerCase()) {
            DevExpress.ui.notify("Duplicate entry found,Please enter another factor..!", "warning", 1500);
            return false;
        }
    }

    var optCoteGrid = {};
    MaxNo = Number(MaxNo) + 1;
    optCoteGrid.SlabID = MaxNo;
    optCoteGrid.FromQty = txtSheetFrom;
    optCoteGrid.ToQty = txtSheetTo;
    optCoteGrid.StartUnit = txtStartUnit;
    optCoteGrid.RateFactor = txtFactorName;
    optCoteGrid.Rate = txtFactorRate;
    optCoteGrid.MinimumCharges = txtMinCharge;
    optCoteGrid.IsLocked = 0;

    var clonedItem = $.extend({}, optCoteGrid);
    dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
    dataGrid.refresh(true);
});

function Slabgrid() {
    gridInstance = $("#GridSlab").dxDataGrid({
        dataSource: [],
        showBorders: true,
        showRowLines: true,
        allowSorting: false,
        allowColumnResizing: true,
        sorting: {
            mode: "none" // or "multiple" | "single"
        },
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowUpdating: true
        },
        height: function () {
            return window.innerHeight / 1.5;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "FromQty", allowEditing: false, caption: "From Qty" },
            { dataField: "ToQty", allowEditing: false, caption: "To Qty" },
            { dataField: "StartUnit", allowEditing: false, caption: "Start Unit" },
            { dataField: "RateFactor", allowEditing: FlagEditRateFactor, caption: "Factor Name" },
            { dataField: "Rate", allowEditing: FlagEditRateFactor, caption: "Rate" },
            { dataField: "MinimumCharges", allowEditing: FlagEditRateFactor, caption: "Min. Charges" },
            { dataField: "IsLocked", allowEditing: FlagEditRateFactor, caption: "Is Locked" }
        ]
        ////onCellClick: function (clickedCell) {
        ////    if (clickedCell.columnIndex > 2 && clickedCell.rowType === "header") {
        ////        var person = confirm("Do you want to Delete it..?");
        ////        // alert(gridInstance.columnCount());
        ////        if (gridInstance.columnCount() > 4) {
        ////            if (person === true) {
        ////                gridInstance.deleteColumn(clickedCell.columnIndex);
        ////            }
        ////        }
        ////        else {
        ////            alert("You can not delete it...! Minimum one Slab rate is required..");
        ////        }
        ////    }
        ////},
        // columns: DynamicColPush,

    }).dxDataGrid("instance");

}

var Material = [];
function Materialgrid() {
    $("#GridMaterial").dxDataGrid({
        dataSource: Material,
        showBorders: true,
        paging: {
            enabled: false
        },
        showRowLines: true,
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowAdding: true,
            allowUpdating: true
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onEditingStart: function (e) {
            if (e.column.visibleIndex === 2) {
                e.cancel = true;
            }
            if (e.rowType !== "header") {
                var dataGrid = $('#GridSlab').dxDataGrid('instance');
                dataGrid.cellValue(0, 2, $("#selStartUnit").dxSelectBox("instance").option('text'));
            }
        },
        columns: [
            {
                dataField: "FromQty", visible: true, caption: "From",
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "ToQty", visible: true, caption: "To",
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            { dataField: "StartUnit", visible: true, caption: "Start Unit" },
            {
                dataField: "Rate", visible: true, caption: "Rate",
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric OR decimal value..!'
                }]
            }
        ]
    });
}

$("#BtnNew").click(function () {
    GblStatus = "";
    blankfield();

    ObjidContent = [];
    //    GblContent();
    document.getElementById("BtnDeletePopUp").disabled = true;
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

function blankfield() {

    existslab = [];
    Slabgrid();
    Objid = [];

    document.getElementById("txtProcessName").value = "";
    document.getElementById("txtDisplayName").value = "";

    $("#selTypeOfCharges").dxSelectBox({ value: '' });
    $("#selSizeConsidered").dxSelectBox({ value: '' });
    $("#selPreePost").dxSelectBox({ value: '' });
    $("#selStartUnit").dxSelectBox({ value: '' });
    $("#selEndUnit").dxSelectBox({ value: '' });
    $("#selUnitConversion").dxSelectBox({ value: '' });

    document.getElementById("txtMinimumCharges").value = "";
    document.getElementById("txtMakeSetupCharges").value = "";
    document.getElementById("chkDisplayInQuotation").checked = false;

    $("#selUnderDepartment").dxSelectBox({ value: '' });

    document.getElementById("txtRate").value = "";
}

$("#txtProcessName").change(function () {
    document.getElementById("txtDisplayName").value = document.getElementById("txtProcessName").value;
});


/////=============Content Allocation=====================

function GblContent() {
    $.ajax({
        type: "POST",
        url: "WebServiceProcessMaster.asmx/ContentGrid",
        data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            ContentGrid = JSON.parse(res);
            ContentGridGrid();
        }
    });
}

function ContentGridGrid() {
    // alert(ObjidContent);
    $("#GridContentAllocation").dxDataGrid({
        dataSource: {
            store: {
                type: "array",
                key: "ContentID",
                data: ContentGrid
            }
        },
        sorting: {
            mode: "multiple"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "multiple" },
        filterRow: { visible: true, applyFilter: "auto" },
        height: function () {
            return window.innerHeight / 1.3;
        },
        scrolling: { mode: 'virtual' },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "ContentID", visible: false, caption: "ContentID", width: 300 },
            { dataField: "ContentName", visible: false, caption: "Content Name" },
            { dataField: "ContentCaption", visible: true, caption: "Content Name" }
        ],
        selectedRowKeys: ObjidContent,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            if (data.length > 0) {
                $("#ContentId").text(
                    $.map(data, function (value) {
                        return value.ContentID;    //alert(value.ProcessId);
                    }).join(','));
            }
            else {
                $("#ContentId").text("");
            }
        }
    });
}


//function validateDecimal(str) {
//    str = alltrim(str);
//    return /^[-+]?[0-9]+(\.[0-9]+)?$/.test(str);
//}
//function test2(str) {
//    str = alltrim(str);
//    return /^[-+]?\d+(\.\d+)?$/.test(str);
//}
function validateDecimal(str) {
    var str1 = Number(str.value);
    //var Check = /^[-+]?\d{3,5}(\.\d{1,3})?$/;
    var Check = /^[-+]?[0-9]+(\.[0-4]+)?$/;
    if (Check.test(str)) {
        document.getElementById(str.id).value = str1;
    }
    else {
        document.getElementById(str.id).value = str1.toFixed(3);
        // DevExpress.ui.notify("Please Enter Group Name...!", "error", 1000);
        // alert("Please enter only Three Numeric value after Decimal..");        
    }
}