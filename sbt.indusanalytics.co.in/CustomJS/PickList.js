"use strict";

var GblStatus = "";
var RadioValue = "";
var RadioStockTypeValue = "";
var RadioFilterValue = "";

var objContainer = "";
var radioGridData = [];
var DynamicColPush = [];
var ValRES1 = [];
var JCdata = "";
var PickListGriddata = [];
var sholistData = "";
var GblPickListNo = "";

var BatchWiseGrid = [];
var AllocatedItemGrid = [];
var BatchWisdata = [];

var AuditApprovalRequired = false;

RadioValue = "All";
RadioFilterValue = "Available Stock";
RadioStockTypeValue = "Job Consumables";

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

var priorities = ["Job Allocated", "All"];
$("#RadioButtonPicklist").dxRadioGroup({
    items: priorities,
    value: priorities[1],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = "";
        RadioValue = e.value;
        if (RadioValue === "Job Allocated") {
            $("#RadioButtonStockType").dxRadioGroup({
                value: stockcategories[0],
                disabled: true
            });
            RadioStockTypeValue = "Job Consumables";
        } else {
            $("#RadioButtonStockType").dxRadioGroup({
                value: stockcategories[0],
                disabled: false
            });
            RadioStockTypeValue = "Job Consumables";
        }
        radioGroup();
    }
});

var stockcategories = ["Job Consumables", "Other"];
$("#RadioButtonStockType").dxRadioGroup({
    items: stockcategories,
    value: stockcategories[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioStockTypeValue = "";
        RadioStockTypeValue = e.value;
        radioGroup();
    }
});

var prioritiesAvailable = ["Available Stock", "Not Available Stock", "All"];
$("#RadioButtonAvailable").dxRadioGroup({
    items: prioritiesAvailable,
    value: prioritiesAvailable[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioFilterValue = "";
        RadioFilterValue = e.value;

        fillAllItemsGrid();
    }
});

//Department Name
$("#SelDepartment").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== "" && data.value !== undefined && data.value !== null) {
            RefreshDepartmentMachines(data.value);
        }
    }
});

$.ajax({
    type: "POST",
    url: "WebService_PickList.asmx/DepartmentName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var Departmentname = JSON.parse(res);

        $("#SelDepartment").dxSelectBox({
            items: Departmentname
        });
    }
});

function RefreshProcessListJobWise(JobID) {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PickList.asmx/JobWiseProcessList",
            data: '{JobID:' + JSON.stringify(JobID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                var Processlist = JSON.parse(res);

                $("#SelProcess").dxSelectBox({
                    items: Processlist,
                    placeholder: "Select--",
                    displayExpr: 'ProcessName',
                    valueExpr: 'ProcessID',
                    searchEnabled: true,
                    showClearButton: true
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#SelMachine").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'MachineName',
    valueExpr: 'MachineID',
    searchEnabled: true,
    showClearButton: true
});

function RefreshDepartmentMachines(DepartmentID) {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PickList.asmx/MachinesList",
            data: '{DepartmentID:' + JSON.stringify(DepartmentID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                var Machinelist = JSON.parse(res);

                $("#SelMachine").dxSelectBox({
                    items: Machinelist
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
}

//Pick List No
CreatePicklistNO();
function CreatePicklistNO() {
    var prefix = "IPIC";

    $.ajax({
        type: "POST",
        url: "WebService_PickList.asmx/GetPickNO",
        data: '{prefix:' + JSON.stringify(prefix) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            GblPickListNo = "";
            if (res !== "") {
                GblPickListNo = res;
                document.getElementById("TxtVoucherNo").value = GblPickListNo;
            }
        }
    });
}

//Get Job Card List
$.ajax({
    type: "POST",
    url: "WebService_PickList.asmx/JobCardRender",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());

        $("#FiltrJobcardGrid").dxDataGrid({
            dataSource: RES1
        });
    }
});

//StockBatch
//$("#StockBatchWiseGrid").dxDataGrid({
//    dataSource: BatchWiseGrid,
//    columnAutoWidth: true,
//    showBorders: true,
//    showRowLines: true,
//    allowColumnReordering: true,
//    allowColumnResizing: true,
//    columnResizingMode: "widget",
//    //filterRow: { visible: true, applyFilter: "auto" },
//    //  selection: { mode: "multiple", showCheckBoxesMode: "always", },
//    selection: { mode: "single" },
//    loadPanel: {
//        enabled: true,
//        height: 90,
//        width: 200,
//        text: 'Data is loading...'
//    },
//    editing: {
//        mode: "cell",
//        allowDeleting: true,
//        //allowAdding: true,
//        //allowUpdating: true
//    },

//    onRowPrepared: function (e) {
//        if (e.rowType === "header") {
//            e.rowElement.css('background', '#509EBC');
//            e.rowElement.css('color', 'white');
//            e.rowElement.css('font-weight', 'bold');
//        }
//        e.rowElement.css('fontSize', '11px');
//    },
//    onSelectionChanged: function (selectedBatchWisdata) {
//        BatchWisdata = [];
//        BatchWisdata = selectedBatchWisdata.selectedRowsData;
//        document.getElementById("TxtQuantity").value = Number(BatchWisdata[0].BatchStock);
//    },
//    columns: [
//        { dataField: "GRNTransactionID", visible: false, caption: "GRNTransactionID", },
//        { dataField: "ItemID", visible: false, caption: "ItemID", },
//        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", },
//        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", },
//        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", },
//        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", },
//        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
//        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
//        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
//        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
//        { dataField: "StockUnit", visible: true, caption: "Unit", width: 80 },
//        { dataField: "BatchStock", visible: true, caption: "Stock Qty", width: 100 },
//        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 140 },
//        { dataField: "GRNNo", visible: false, caption: "GRNNo", width: 100 },
//        { dataField: "GRNDate", visible: false, caption: "GRNDate", width: 100 },
//        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 120 },
//        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
//        { dataField: "TotalAllocatedStock", visible: true, caption: "Total Allocated", width: 100 },
//        { dataField: "TotalPhysicalStock", visible: false, caption: "Stock(Sheets)", },
//    ]
//})

////Job Card List
$("#FiltrJobcardGrid").dxDataGrid({
    showBorders: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnAutoWidth: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (Items) {
        JCdata = Items.selectedRowsData;
        document.getElementById("TxtJCN").value = JCdata[0].JobCardNo;
        document.getElementById("TxtJobBookingJobCardContentsID").value = JCdata[0].JobBookingJobCardContentsID;
        document.getElementById("TxtJobBookingID").value = JCdata[0].JobBookingID;
        document.getElementById("TxtBookingNo").value = JCdata[0].BookingNo;
        document.getElementById("TxtRequiredSheets").value = Number(JCdata[0].FullSheets);
        document.getElementById("TxtAllocatedSheets").value = Number(JCdata[0].AllocatedQuantity);
        if (Number(JCdata[0].JobBookingJobCardContentsID) > 0) {
            RefreshProcessListJobWise(JCdata[0].JobBookingJobCardContentsID);
        } else {
            $("#SelProcess").dxSelectBox({
                value: ''
            });
            $("#SelProcess").dxSelectBox('instance').option('disabled', true);
        }

    },
    columns: [
        { dataField: "BookingNo", visible: true },
        { dataField: "JobCardNo", visible: true },
        { dataField: "JobName", visible: true },
        { dataField: "ContentName", visible: true },
        { dataField: "FullSheets", visible: true, caption: "Required Sheets" },
        { dataField: "AllocatedQuantity", visible: false }]
});

///Show List
$("#PickShowlistGrid").dxDataGrid({
    showBorders: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 1.2;
    },
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        } else if (e.rowType === "data") {
            if (e.data.IsCancelled === true) {
                e.rowElement.css('background', '#ec6b6b');
            } else if (e.data.IsCompleted === true) {
                e.rowElement.css('background', '#1a750f');
                e.rowElement.css('color', 'white');
            } else if (e.data.IsReleased === true) {
                e.rowElement.css('background', '#ecf927');
            }
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (Showlist) {
        sholistData = [];
        sholistData = Showlist.selectedRowsData;
        document.getElementById("TxtPickID").value = sholistData[0].TransactionID;
        document.getElementById("TxtNarration").value = sholistData[0].Narration;
    },
    columns: [
        { dataField: "TransactionID", visible: false, width: 120 },
        { dataField: "DepartmentID", visible: false, width: 120 },
        { dataField: "MaxVoucherNo", visible: false, width: 100, caption: "Ref.Picklist No." },
        { dataField: "VoucherNo", visible: true, width: 100, caption: "Picklist No." },
        { dataField: "VoucherDate", visible: true, width: 80, caption: "Picklist Date" },
        { dataField: "JobCardContentNo", visible: true, width: 100, caption: "J.C. No." },
        { dataField: "JobName", visible: true, width: 180, caption: "Job Name" },
        { dataField: "ContentName", visible: true, width: 180, caption: "Content Name" },
        { dataField: "DepartmentName", visible: true, width: 100, caption: "Department" },
        { dataField: "ItemCode", width: 80, caption: "Item Code" },
        { dataField: "ItemName", visible: true, width: 150, caption: "Item Name" },
        { dataField: "RequiredQuantity", visible: true, width: 100, caption: "Pick.Qty" },
        { dataField: "CreatedBy", visible: true, width: 100, caption: "Created By" },
        { dataField: "ReleasedQuantity", visible: false, width: 100, caption: "Released Qty" },
        { dataField: "IssuedQuantity", visible: true, width: 100, caption: "Issued Qty" },
        { dataField: "IssueNo", visible: true, width: 100, caption: "Issued No." },
        { dataField: "Narration", visible: true, width: 100, caption: "Remark" }]
});

//AllocatedItemGrid
$("#AllotedItemGrid").dxDataGrid({
    dataSource: AllocatedItemGrid,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    //filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: "cell",
        allowDeleting: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onRowRemoved: function () {
        var grid = $("#AllotedItemGrid").dxDataGrid('instance');
        if (grid.totalCount() === 0) {
            $("#SelDepartment").dxSelectBox('instance').option('disabled', false);
        }
    },
    columns: [
        { dataField: "GRNTransactionID", visible: false, caption: "GRNTransactionID", width: 140 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 140 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 140 },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 140 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 140 },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 140 },
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 140 },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 140 },
        { dataField: "MachineID", visible: false, caption: "MachineID", width: 140 },
        { dataField: "ProcessID", visible: false, caption: "ProcessID", width: 140 },
        { dataField: "JobCardNo", visible: true, caption: "J.C.NO.", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 140 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 140 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Unit", width: 100 },
        { dataField: "PicklistQuantity", visible: true, caption: "Picklist Qty.", width: 120 },
        { dataField: "BatchNo", visible: false, caption: "Batch No", width: 120 },
        { dataField: "GRNNo", visible: false, caption: "GRNNo", width: 120 },
        { dataField: "GRNDate", visible: false, caption: "GRNDate", width: 120 },
        { dataField: "Warehouse", visible: false, caption: "Warehouse", width: 120 },
        { dataField: "Bin", visible: false, caption: "Bin", width: 120 },
        { dataField: "MachineName", visible: true, caption: "Machine Name", width: 120 },
        { dataField: "ProcessName", visible: true, caption: "Process Name", width: 120 },
        { dataField: "TotalAllocatedStock", visible: false, caption: "Total Allocated", width: 120 },
        { dataField: "TotalPhysicalStock", visible: false, caption: "Stock(Sheets)", width: 120 },
        { dataField: "BookingNo", visible: false, caption: "BookingNo", width: 140 }]
});

function radioGroup() {
    if (RadioValue === "Job Allocated") {
        document.getElementById("LOADER").style.display = "block";
        document.getElementById("TxtJCN").value = "";
        document.getElementById("TxtJCN").disabled = true;

        document.getElementById("TxtPickQuantity").value = 0;
        document.getElementById("DivPicQty").style.display = "block";

        $("#RadioButtonStockType").dxRadioGroup({
            value: stockcategories[0],
            disabled: true
        });
        $("#SelProcess").dxSelectBox({ value: null });
        $("#SelProcess").dxSelectBox('instance').option('disabled', true);
        //document.getElementById("JobCardDiv").style.display = "none";
        //document.getElementById("StockCategory").style.display = "none";
        BatchWiseGrid = [];
        //StockBatchWise();

        $.ajax({
            type: "POST",
            url: "WebService_PickList.asmx/JobAllocated",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";

                ValRES1 = JSON.parse(res.toString());

                objContainer = { 'FilterData': ValRES1 };
                fillAllItemsGrid();
            }
        });
    }
    else if (RadioValue === "All") {
        document.getElementById("TxtPickQuantity").value = 0;
        document.getElementById("DivPicQty").style.display = "none";

        if (RadioStockTypeValue === "Job Consumables") {
            document.getElementById("JobCardDiv").style.display = "block";
            document.getElementById("TxtJCN").disabled = false;
        } else {
            document.getElementById("TxtJCN").value = "";
            document.getElementById("TxtJCN").disabled = true;
        }
        $("#SelProcess").dxSelectBox({ value: null });
        $("#SelProcess").dxSelectBox('instance').option('disabled', false);
        BatchWiseGrid = [];

        //StockBatchWise();
        $.ajax({
            type: "POST",
            url: "WebService_PickList.asmx/All",
            data: '{StockType:' + JSON.stringify(RadioStockTypeValue) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);

                ValRES1 = JSON.parse(res.toString());
                objContainer = { 'FilterData': ValRES1 };

                fillAllItemsGrid();
            }
        });
    }
}

function fillAllItemsGrid() {
    var FlagAllVisible = false;
    var FlagProcess = true;
    if (RadioValue === "Job Allocated") {
        FlagAllVisible = true;
        FlagProcess = false;
    }

    radioGridData = [];

    if (RadioFilterValue === "Available Stock") {
        if (objContainer !== "") {
            radioGridData = objContainer.FilterData.filter(function (el) {
                return Number(el.PhysicalStock) > 0;
            });
        }
    }
    else if (RadioFilterValue === "Not Available Stock") {
        if (objContainer !== "") {
            radioGridData = objContainer.FilterData.filter(function (el) {
                return el.PhysicalStock === 0;
            });
        }
    }
    else {
        radioGridData = ValRES1;
    }

    $("#PickListGrid").dxDataGrid({
        dataSource: radioGridData,
        columns: [{ dataField: "BookingNo", visible: false }, { dataField: "JobCardNo", width: 100, visible: FlagAllVisible }, { dataField: "JobName", width: 220, visible: FlagAllVisible }, { dataField: "ContentName", width: 200, visible: FlagAllVisible }
            , { width: 120, dataField: "ProcessName", visible: FlagProcess }, { dataField: "ItemCode", width: 90, visible: true }, { width: 120, dataField: "ItemGroup", visible: true }
            , { width: 120, dataField: "SubGroup", visible: true }, { width: 200, dataField: "ItemName", visible: true }
            , { width: 100, dataField: "StockUnit", visible: true }, { dataField: "BookedQuantity", visible: FlagAllVisible }, { dataField: "PickedQuantity", visible: FlagAllVisible }
            , { dataField: "PendingToPick", visible: FlagAllVisible }, { dataField: "PhysicalStock", visible: true }, { dataField: "AllocatedStock", visible: true }
            , { dataField: "FreeStock", visible: true }, { dataField: "IncomingStock", visible: true }, { dataField: "UnapprovedStock", visible: true }
            , { dataField: "WtPerPacking", visible: false }, { dataField: "UnitPerPacking", visible: false }, { dataField: "ConversionFactor", visible: false }, { dataField: "UnitDecimalPlace", visible: true }]
    });
}

var PickListGridInstance = $("#PickListGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    height: function () {
        return window.innerHeight / 2.3;
    },
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (selectedItems) {
        PickListGriddata = [];
        PickListGriddata = selectedItems.selectedRowsData;
        if (PickListGriddata.length > 0) {
            var ItemId = PickListGriddata[0].ItemID;
            document.getElementById("TxtQuantity").value = Number(PickListGriddata[0].PhysicalStock);
            document.getElementById("TxtUnitDecimalPlace").value = Number(PickListGriddata[0].UnitDecimalPlace);
            if (RadioValue === "Job Allocated") {
                document.getElementById("TxtPickQuantity").value = Number(PickListGriddata[0].PickedQuantity);
            } else {
                document.getElementById("TxtPickQuantity").value = 0;
            }
        }
    },
    columns: [{ dataField: "BookingNo", visible: false }, { dataField: "JobCardNo", visible: false }, { dataField: "JobName", visible: false }, { dataField: "ContentName", visible: false }
        , { width: 120, dataField: "ProcessName", visible: true }, { width: 120, dataField: "ItemCode", visible: true }, { width: 120, dataField: "ItemGroup", visible: true }
        , { width: 120, dataField: "SubGroup", visible: true }, { width: 300, dataField: "ItemName", visible: true } 
        , { width: 120, dataField: "StockUnit", visible: true }, { dataField: "BookedQuantity", visible: false }, { dataField: "PickedQuantity", visible: false }
        , { dataField: "PendingToPick", visible: false }, { width: 120, dataField: "PhysicalStock", visible: true }, { width: 120, dataField: "AllocatedStock", visible: true }
        , { width: 120, dataField: "FreeStock", visible: true }, { width: 120, dataField: "IncomingStock", visible: true }, { width: 120, dataField: "UnapprovedStock", visible: true }
        , { dataField: "WtPerPacking", visible: false }, { dataField: "UnitPerPacking", visible: false }, { dataField: "ConversionFactor", visible: false }, { width: 120, dataField: "UnitDecimalPlace", visible: true }]

}).dxDataGrid("instance");

$("#CreateButton").click(function () {
    BatchWiseGrid = [];
    AllocatedItemGrid = [];

    $("#VoucherDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });
    GblStatus = "";
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;

    //document.getElementById("PLPrintButton").disabled = true;
    AllocatedItem();
    $("#SelDepartment").dxSelectBox({
        value: "",
        disabled: false
    });

    $("#SelMachine").dxSelectBox({
        value: ""
    });
    $("#SelProcess").dxSelectBox({
        value: ""
    });
    radioGroup();
    document.getElementById("TxtVoucherNo").value = GblPickListNo;
    document.getElementById("TxtJCN").value = "";
    document.getElementById("TxtNarration").value = "";

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");

    AuditApprovalRequired = false;
});

//StockBatchWise();
//AllocatedItem();

//function StockBatchWise() {
//    $("#StockBatchWiseGrid").dxDataGrid({
//        dataSource: BatchWiseGrid,
//    })
//}

function AllocatedItem() {

    $("#AllotedItemGrid").dxDataGrid({
        dataSource: AllocatedItemGrid
    });
}

$("#BtnAddItemPop").click(function () {
    var JCNO = document.getElementById("TxtJCN").value;
    var TxtQuantity = document.getElementById("TxtQuantity").value;
    var TxtPickQuantity = document.getElementById("TxtPickQuantity").value;
    var DepID = $("#SelDepartment").dxSelectBox('instance').option('value');
    var MachineID = $("#SelMachine").dxSelectBox('instance').option('value');
    var ProcessID = $("#SelProcess").dxSelectBox('instance').option('value');
    var MachineName = "";
    var ProcessName = "";
    if (DepID === undefined || DepID === "" || DepID === null) {
        DevExpress.ui.notify("Please select department...!", "error", 1000);
        $("#SelDepartment").dxSelectBox('instance').focus();
        return false;
    }
    if (MachineID === undefined || MachineID === "" || MachineID === null) {
        MachineID = 0;
        MachineName = "";
    } else {
        MachineName = $("#SelMachine").dxSelectBox('instance').option('text');
    }
    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();
    if (RadioValue === "All") {
        if (RadioStockTypeValue === "Job Consumables" || RadioStockTypeValue === "") {
            if (JCNO === "" || JCNO === undefined || JCNO === null || JCdata.length <= 0) {
                DevExpress.ui.notify("Please select Job Card No...!", "error", 1000);
                $("#SelDepartment").dxSelectBox('instance').focus();
                return false;
            }
            if (ProcessID === undefined || ProcessID === "" || ProcessID === null || ProcessID === 0) {
                ProcessID = 0;
                ProcessName = "";
                DevExpress.ui.notify("Please select process name for allocated job card...!", "error", 1000);
                $("#SelProcess").dxSelectBox('instance').focus();
                return false;
            } else {
                ProcessName = $("#SelProcess").dxSelectBox('instance').option('text');
            }

        }
    }
    //if (ItemGrid.totalCount() === 0) {
    //    DevExpress.ui.notify("Please add picklist items...!", "error", 1000);
    //    return false;
    //}

    if (TxtQuantity === "" || TxtQuantity === undefined || TxtQuantity === null || Number(TxtQuantity) === 0) {
        DevExpress.ui.notify("Please Enter Quantity..!", "error", 1000);
        document.getElementById("TxtQuantity").focus();
        return false;
    }
    if (RadioValue === "Job Allocated") {
        if (Number(TxtQuantity) > Number(PickListGriddata[0].PendingToPick)) {
            DevExpress.ui.notify("Please enter valid picklist quantity less than quantity available to pick...!", "error", 1000);
            document.getElementById("TxtQuantity").focus();
            return false;
        }
    } else {
        if (RadioStockTypeValue === "Job Consumables" || RadioStockTypeValue === "All" || RadioStockTypeValue === "") {
            var TxtQty = 0.00;
            var WtPerPacking = 0;
            WtPerPacking = Number(Number(PickListGriddata[0].SizeW) * Number(PickListGriddata[0].SizeL) * Number(PickListGriddata[0].GSM)) / 1000000000;

            TxtQty = Number(document.getElementById("TxtRequiredSheets").value) - Number(document.getElementById("TxtAllocatedSheets").value);
            if (PickListGriddata[0].ItemGroupNameID === -2) {
                TxtQty = Number(document.getElementById("TxtRequiredSheets").value) / Number(WtPerPacking) - Number(document.getElementById("TxtAllocatedSheets").value);
            }
            if (JCdata[0].PlanType === "Sheet Planning") {
                if (PickListGriddata[0].ItemGroupNameID === -1) {
                    TxtQty = Number(document.getElementById("TxtRequiredSheets").value) - Number(document.getElementById("TxtAllocatedSheets").value);
                } else if (PickListGriddata[0].ItemGroupNameID === -2) {
                    AuditApprovalRequired = true;
                    DevExpress.ui.notify("Different item group selected it will move to audit approval...!", "warning", 2000);
                    //TxtQty = Number(document.getElementById("TxtRequiredSheets").value) / Number(WtPerPacking) - Number(document.getElementById("TxtAllocatedSheets").value);
                }
            } else {
                if (PickListGriddata[0].ItemGroupNameID === -1) {
                    AuditApprovalRequired = true;
                    DevExpress.ui.notify("Different item group selected it will move to audit approval...!", "warning", 2000);
                    //TxtQty = Number(document.getElementById("TxtRequiredSheets").value) * Number(WtPerPacking) - Number(document.getElementById("TxtAllocatedSheets").value);
                } else if (PickListGriddata[0].ItemGroupNameID === -2) {
                    TxtQty = Number(document.getElementById("TxtRequiredSheets").value) - Number(document.getElementById("TxtAllocatedSheets").value);
                }
            }
            if (Number(TxtQuantity) > Number(TxtQty)) {
                AuditApprovalRequired = true;
                DevExpress.ui.notify("Excess quantity is added ,it will move to audit approval...!", "warning", 2000);
            }
        }
    }
    //Batch Wise Condition
    //if (BatchWisdata.length > 0) {
    //    if (TxtQuantity > BatchWisdata[0].PhysicalStock) {
    //        DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
    //        document.getElementById("TxtQuantity").focus();
    //        return false;
    //    }
    //    if (ItemGridRow > 0) {
    //        for (var check = 0; check < ItemGridRow; check++) {
    //            // && ItemGrid._options.dataSource[check].BatchNo === BatchWisdata[0].BatchNo
    //            if (ItemGrid._options.dataSource[check].JobCardNo === document.getElementById("TxtJCN").value && ItemGrid._options.dataSource[check].ItemID === BatchWisdata[0].ItemID) {
    //                DevExpress.ui.notify("This item already exist..! You can not add it..", "error", 1000);
    //                return false;
    //            }
    //        }
    //    }
    //} else {
    //    DevExpress.ui.notify("Please Select batch wise stock...!", "error", 1000);
    //    return false;
    //}

    if (PickListGriddata.length > 0) {
        if (TxtQuantity > PickListGriddata[0].FreeStock) {
            DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
            document.getElementById("TxtQuantity").focus();
            return false;
        }

        for (var check = 0; check < ItemGridRow; check++) {
            if (ItemGrid._options.dataSource[check].ItemID === PickListGriddata[0].ItemID) {//ItemGrid._options.dataSource[check].JobCardNo === document.getElementById("TxtJCN").value && 
                DevExpress.ui.notify("This item already exist..! You can not add it..", "error", 1000);
                return false;
            }
        }

    } else {
        DevExpress.ui.notify("Please Select batch wise stock...!", "error", 1000);
        return false;
    }

    AllocatedItemGrid = [];
    var optAllocatedItemGrid = {};

    if (ItemGridRow > 0) {
        for (var t = 0; t <= ItemGridRow; t++) {
            if (t === ItemGridRow) {
                optAllocatedItemGrid = {};

                //optAllocatedItemGrid.GRNTransactionID = BatchWisdata[0].GRNTransactionID;
                optAllocatedItemGrid.ItemID = PickListGriddata[0].ItemID;
                optAllocatedItemGrid.ItemGroupID = PickListGriddata[0].ItemGroupID;
                optAllocatedItemGrid.ItemGroupNameID = PickListGriddata[0].ItemGroupNameID;
                optAllocatedItemGrid.ItemSubGroupID = PickListGriddata[0].ItemSubGroupID;
                //optAllocatedItemGrid.WarehouseID = BatchWisdata[0].WarehouseID;
                optAllocatedItemGrid.ItemCode = PickListGriddata[0].ItemCode;
                optAllocatedItemGrid.ItemGroupName = PickListGriddata[0].ItemGroup;
                optAllocatedItemGrid.ItemSubGroupName = PickListGriddata[0].SubGroup;
                optAllocatedItemGrid.ItemName = PickListGriddata[0].ItemName;
                optAllocatedItemGrid.StockUnit = PickListGriddata[0].StockUnit;
                optAllocatedItemGrid.PicklistQuantity = document.getElementById("TxtQuantity").value;
                //optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
                //optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
                //optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
                //optAllocatedItemGrid.Warehouse = BatchWisdata[0].Warehouse;
                //optAllocatedItemGrid.Bin = BatchWisdata[0].Bin;
                optAllocatedItemGrid.TotalPhysicalStock = PickListGriddata[0].PhysicalStock;
                optAllocatedItemGrid.TotalAllocatedStock = PickListGriddata[0].AllocatedStock;
                optAllocatedItemGrid.MachineID = MachineID;
                optAllocatedItemGrid.MachineName = MachineName;

                if (RadioValue === "All" && RadioStockTypeValue === "Job Consumables") {
                    optAllocatedItemGrid.JobCardNo = document.getElementById("TxtJCN").value;
                    optAllocatedItemGrid.JobBookingJobCardContentsID = document.getElementById("TxtJobBookingJobCardContentsID").value;
                    optAllocatedItemGrid.JobBookingID = document.getElementById("TxtJobBookingID").value;
                    optAllocatedItemGrid.BookingNo = document.getElementById("TxtBookingNo").value;
                    optAllocatedItemGrid.ProcessID = ProcessID;
                    optAllocatedItemGrid.ProcessName = ProcessName;
                } else {
                    optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
                    optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
                    optAllocatedItemGrid.JobBookingID = PickListGriddata[0].JobBookingID;
                    optAllocatedItemGrid.BookingNo = PickListGriddata[0].BookingNo;
                    optAllocatedItemGrid.ProcessID = PickListGriddata[0].ProcessID;
                    optAllocatedItemGrid.ProcessName = PickListGriddata[0].ProcessName;
                }

                AllocatedItemGrid.push(optAllocatedItemGrid);
            } else {
                optAllocatedItemGrid = {};

                optAllocatedItemGrid.JobCardNo = ItemGrid._options.dataSource[t].JobCardNo;
                optAllocatedItemGrid.BookingNo = ItemGrid._options.dataSource[t].BookingNo;
                optAllocatedItemGrid.JobBookingJobCardContentsID = ItemGrid._options.dataSource[t].JobBookingJobCardContentsID;
                optAllocatedItemGrid.JobBookingID = ItemGrid._options.dataSource[t].JobBookingID;
                optAllocatedItemGrid.MachineID = ItemGrid._options.dataSource[t].MachineID;
                //optAllocatedItemGrid.GRNTransactionID = ItemGrid._options.dataSource[t].GRNTransactionID;
                optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
                optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
                optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
                optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
                //optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;
                optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
                optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
                optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
                optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
                optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                optAllocatedItemGrid.PicklistQuantity = ItemGrid._options.dataSource[t].PicklistQuantity;
                //optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                //optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
                //optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
                //optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
                //optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                optAllocatedItemGrid.TotalPhysicalStock = ItemGrid._options.dataSource[t].TotalPhysicalStock;
                optAllocatedItemGrid.TotalAllocatedStock = ItemGrid._options.dataSource[t].TotalAllocatedStock;
                optAllocatedItemGrid.MachineID = ItemGrid._options.dataSource[t].MachineID;
                optAllocatedItemGrid.MachineName = ItemGrid._options.dataSource[t].MachineName;
                optAllocatedItemGrid.ProcessID = ItemGrid._options.dataSource[t].ProcessID;
                optAllocatedItemGrid.ProcessName = ItemGrid._options.dataSource[t].ProcessName;

                AllocatedItemGrid.push(optAllocatedItemGrid);

            }
        }
    }
    else {
        optAllocatedItemGrid = {};

        //optAllocatedItemGrid.GRNTransactionID = BatchWisdata[0].GRNTransactionID;
        optAllocatedItemGrid.ItemID = PickListGriddata[0].ItemID;
        optAllocatedItemGrid.ItemGroupID = PickListGriddata[0].ItemGroupID;
        optAllocatedItemGrid.ItemGroupNameID = PickListGriddata[0].ItemGroupNameID;
        optAllocatedItemGrid.ItemSubGroupID = PickListGriddata[0].ItemSubGroupID;
        //optAllocatedItemGrid.WarehouseID = BatchWisdata[0].WarehouseID;
        optAllocatedItemGrid.ItemGroupName = PickListGriddata[0].ItemGroup;
        optAllocatedItemGrid.ItemSubGroupName = PickListGriddata[0].SubGroup;
        optAllocatedItemGrid.ItemCode = PickListGriddata[0].ItemCode;
        optAllocatedItemGrid.ItemName = PickListGriddata[0].ItemName;
        optAllocatedItemGrid.StockUnit = PickListGriddata[0].StockUnit;
        optAllocatedItemGrid.PicklistQuantity = document.getElementById("TxtQuantity").value;
        //optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
        //optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
        //optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
        //optAllocatedItemGrid.Warehouse = BatchWisdata[0].Warehouse;
        //optAllocatedItemGrid.Bin = BatchWisdata[0].Bin;
        optAllocatedItemGrid.TotalPhysicalStock = PickListGriddata[0].PhysicalStock;
        optAllocatedItemGrid.TotalAllocatedStock = PickListGriddata[0].AllocatedStock;
        optAllocatedItemGrid.MachineID = MachineID;
        optAllocatedItemGrid.MachineName = MachineName;

        if (RadioValue === "All" && RadioStockTypeValue === "Job Consumables") {
            optAllocatedItemGrid.JobCardNo = document.getElementById("TxtJCN").value;
            optAllocatedItemGrid.JobBookingJobCardContentsID = document.getElementById("TxtJobBookingJobCardContentsID").value;
            optAllocatedItemGrid.JobBookingID = document.getElementById("TxtJobBookingID").value;
            optAllocatedItemGrid.BookingNo = document.getElementById("TxtBookingNo").value;
            optAllocatedItemGrid.ProcessID = ProcessID;
            optAllocatedItemGrid.ProcessName = ProcessName;
        } else {
            optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
            optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
            optAllocatedItemGrid.JobBookingID = PickListGriddata[0].JobBookingID;
            optAllocatedItemGrid.BookingNo = PickListGriddata[0].BookingNo;
            optAllocatedItemGrid.ProcessID = PickListGriddata[0].ProcessID;
            optAllocatedItemGrid.ProcessName = PickListGriddata[0].ProcessName;
        }

        AllocatedItemGrid.push(optAllocatedItemGrid);

    }

    //if (BatchWisdata.length > 0) {
    //    for (var A = 0; A < BatchWisdata; A++) {
    //        var ItemIDA = Number(BatchWisdata[A].ItemID);
    //        if (ItemGridRow > 0) {
    //            for (var B = 0; B < ItemGridRow; B++) {
    //                var ItemIDB = Number(AllotedItemGrid._options.dataSource[B].ItemID);
    //                if (ItemIDA === ItemIDB) {
    //                    DevExpress.ui.notify("This Item Already added.....!", "error", 1000);
    //                    return false;
    //                }
    //            }
    //        }
    //    }
    //}
    //else {
    //    DevExpress.ui.notify("Please Select Any Item...!", "error", 1000);
    //    return false;
    //}


    //// AllocatedItemGrid = [];
    //BatchWisdata[0].BatchStock = document.getElementById("TxtQuantity").value;
    //AllocatedItemGrid = BatchWisdata;


    //if (RadioValue === "All") {
    //    if (JCNO === "" || JCNO === undefined || JCNO === null) {
    //        //swal("Error!", "Please Choose Supplier Name..", "");
    //        DevExpress.ui.notify("Please Choose Job Card No...!", "error", 1000);
    //        document.getElementById("TxtJCN").focus();
    //        return false;
    //    }
    //    AllocatedItemGrid[0].JobCardNo = document.getElementById("TxtJCN").value;
    //    AllocatedItemGrid[0].JobBookingJobCardContentsID = document.getElementById("TxtJobBookingJobCardContentsID").value;
    //    AllocatedItemGrid[0].JobBookingID = document.getElementById("TxtJobBookingID").value;
    //    AllocatedItemGrid[0].BookingNo = document.getElementById("TxtBookingNo").value;
    //}
    //else {
    //    AllocatedItemGrid[0].JobCardNo = PickListGriddata[0].JobCardNo;
    //    AllocatedItemGrid[0].JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
    //    AllocatedItemGrid[0].JobBookingID = PickListGriddata[0].JobBookingID;
    //    AllocatedItemGrid[0].BookingNo = PickListGriddata[0].BookingNo;
    //}

    //if (TxtQuantity === "" || TxtQuantity === undefined || TxtQuantity === null) {
    //    DevExpress.ui.notify("Please Enter Quantity..!", "error", 1000);
    //    document.getElementById("TxtQuantity").focus();
    //    return false;
    //}

    //if (TxtQuantity > AllocatedItemGrid[0].BatchStock) {
    //    DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
    //    document.getElementById("TxtQuantity").focus();
    //    return false;
    //}


    AllocatedItem();
    var gridInstance = $("#AllotedItemGrid").dxDataGrid('instance');
    if (gridInstance.totalCount() === 0) {
        $("#SelDepartment").dxSelectBox({
            disabled: false
        });
    } else {
        $("#SelDepartment").dxSelectBox({
            disabled: true
        });
    }
});

function keydownFunction() {
    document.getElementById("TxtJCN").value = "";
    $("#OpenPopup").click();
}

function keyupFunction() {
    document.getElementById("TxtJCN").value = "";
    document.getElementById("TxtJobBookingJobCardContentsID").value = "";
    document.getElementById("TxtJobBookingID").value = "";
    document.getElementById("TxtBookingNo").value = "";
    document.getElementById("TxtRequiredSheets").value = "";
    document.getElementById("TxtAllocatedSheets").value = "";
}

$("#OpenPopup").click(function () {
    document.getElementById("OpenPopup").setAttribute("data-toggle", "modal");
    document.getElementById("OpenPopup").setAttribute("data-target", "#largeModalFiltrJobcard");

    $("#FiltrJobcardGrid").dxDataGrid({ clearSelection: true });
    var grid = $("#FiltrJobcardGrid").dxDataGrid('instance');
    grid.clearSelection();
});

$("#EditButton").click(function () {
    var TxtPickID = document.getElementById("TxtPickID").value;
    if (TxtPickID === "" || TxtPickID === null || TxtPickID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";

    //document.getElementById("PLPrintButton").disabled = false;

    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_PickList.asmx/RetriveAllocatedItems",
        data: '{transactionID:' + JSON.stringify(TxtPickID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var PicklistRetrive = JSON.parse(res);

            AllocatedItemGrid = PicklistRetrive;

            AllocatedItem();

        }
    });


    $("#SelDepartment").dxSelectBox({
        value: sholistData[0].DepartmentID
    });
    $("#VoucherDate").dxDateBox({
        value: sholistData[0].VoucherDate
    });

    document.getElementById("TxtVoucherNo").value = sholistData[0].VoucherNo;

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = false;
    if (sholistData[0].DepartmentID > 0) $("#SelDepartment").dxSelectBox('instance').option('disabled', true);

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#DeleteButton").click(function () {
    var TxtPickID = document.getElementById("TxtPickID").value;

    if (TxtPickID === "" || TxtPickID === null || TxtPickID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_PickList.asmx/CheckPermission",
        data: '{TransactionID:' + JSON.stringify(TxtPickID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res === "Exist") {
                swal("", "Can't delete this picklist,selected picklist has been used in further transactions", "error");
                return false;
            }
            else {
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
                            url: "WebService_PickList.asmx/DeletePicklist",
                            data: '{TxtPickID:' + JSON.stringify(TxtPickID) + '}',
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
            }
        }
    });

});

$("#BtnSave").click(function () {
    var prefix = "IPIC";

    var VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
    var SelDepartment = $('#SelDepartment').dxSelectBox('instance').option('value');
    var textNarration = document.getElementById("TxtNarration").value.trim();
    if (SelDepartment === "" || SelDepartment === undefined || SelDepartment === null) {
        // swal("Error!", "Please Choose Mode Of Transport..", "");
        DevExpress.ui.notify("Please Choose Department name..!", "error", 1000);
        return false;
    }

    var AllotedItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var AllotedItemGridRow = AllotedItemGrid._options.dataSource.length;
    if (AllotedItemGridRow <= 0) return;

    var TtlStock = 0;
    for (var C = 0; C < AllotedItemGridRow; C++) {
        TtlStock = TtlStock + Number(AllotedItemGrid._options.dataSource[C].PicklistQuantity);
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    OperationRecordMain = {};
    OperationRecordMain.VoucherID = -17;
    OperationRecordMain.VoucherDate = VoucherDate;
    OperationRecordMain.TotalQuantity = TtlStock;
    OperationRecordMain.DepartmentID = SelDepartment;
    OperationRecordMain.Narration = textNarration;

    jsonObjectsRecordMain.push(OperationRecordMain);

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    for (var e = 0; e < AllotedItemGridRow; e++) {
        OperationRecordDetail = {};

        OperationRecordDetail.TransID = e + 1;
        //OperationRecordDetail.ParentTransactionID = AllotedItemGrid._options.dataSource[e].GRNTransactionID;;
        OperationRecordDetail.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
        OperationRecordDetail.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
        OperationRecordDetail.JobBookingID = AllotedItemGrid._options.dataSource[e].JobBookingID;
        OperationRecordDetail.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
        OperationRecordDetail.RequiredQuantity = AllotedItemGrid._options.dataSource[e].PicklistQuantity;
        //OperationRecordDetail.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
        OperationRecordDetail.StockUnit = AllotedItemGrid._options.dataSource[e].StockUnit;
        //OperationRecordDetail.WarehouseID = AllotedItemGrid._options.dataSource[e].WarehouseID;
        OperationRecordDetail.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
        OperationRecordDetail.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
        if (GblStatus === "Update") {
            OperationRecordDetail.IsAuditApproved = AllotedItemGrid._options.dataSource[e].IsAuditApproved;
            OperationRecordDetail.AuditApprovedBy = AllotedItemGrid._options.dataSource[e].AuditApprovedBy;
        } else {
            if (AuditApprovalRequired === false) {
                OperationRecordDetail.IsAuditApproved = 1;
                OperationRecordDetail.AuditApprovedBy = 0;
            } else {
                OperationRecordDetail.IsAuditApproved = 0;
                OperationRecordDetail.AuditApprovedBy = 0;
            }
        }
        jsonObjectsRecordDetail.push(OperationRecordDetail);

    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);

    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
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
            document.getElementById("BtnSave").disabled = true;
            document.getElementById("LOADER").style.display = "block";
            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_PickList.asmx/UpdatePickList",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtPickID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        document.getElementById("BtnSave").disabled = false;
                        document.getElementById("LOADER").style.display = "none";
                        if (res === "Success") {
                            document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        } else if (res === "Exist") {
                            swal("", "Can't update this picklist,selected picklist has been used in further transactions...", "warning");
                            return false;
                        } else {
                            swal("Error..!", res, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time.." + jqXHR, "");
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "WebService_PickList.asmx/SavePickList",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
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
                        document.getElementById("BtnSave").disabled = false;

                        if (res === "Success") {
                            swal("Saved!", "Your data saved...", "success");
                            location.reload();
                        }
                        else {
                            swal("Error..!", res, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });
});

$("#ShowListButton").click(function () {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_PickList.asmx/Showlist",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var RES1 = JSON.parse(res.toString());

            $("#PickShowlistGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
});

$('#TxtQuantity').keypress(function (event) {
    if (this.type === "text" && event.which !== 13 && event.which !== 34 && event.which !== 39) {
        return isNumber(event, this);
    }
});

$('#TxtQuantity').change(function (event) {
    var x = Number(document.getElementById("TxtUnitDecimalPlace").value);
    this.value = Number(this.value).toFixed(x);
});

function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode !== 45) && (charCode !== 46 || $(element).val().indexOf('.') !== -1) && ((charCode < 48 && charCode !== 8) || charCode > 57)) {
        return false;
    }
    else {
        return true;
    }
}

$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

//$("#PLPrintButton").click(function () {
//    var TxtPOID = document.getElementById("TxtPickID").value;
//    //var url = "PrintPickList.aspx?TI=" + TxtPOID;
//    var url = "ReportPickList.aspx?TransactionID=" + TxtPOID;
//    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
//});