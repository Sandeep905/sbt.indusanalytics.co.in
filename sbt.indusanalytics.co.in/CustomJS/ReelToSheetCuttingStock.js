"use strict";

var GblStatus = "";
var prefix = "RTSC";
var sholistData = [];
var SelectedItemData = [];
var WholeItem = [], WholeItemGridtData = [], AllocatedItemData = [];

var AllocatedItemDataMaster = [];
var WholeItemMaster = [], WholeItemGridtDataMaster = [];
var SecondItemGridSelectedData = [];

$("#RTSDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

function CreateVoucherNO() {
    $.ajax({
        type: "POST",
        url: "WebService_ReelToSheetCuttingStock.asmx/GetRTSVoucherNO",
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
            if (res !== "") {
                document.getElementById("TxtRTSVoucherNo").value = res;
            }
        }
    });
}

$("#WorkOrderConversionGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.2;
    },
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    paging: {
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 250, 350, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    //export: {
    //    enabled: true,
    //    fileName: "Reel To Sheet Cutting Stock",
    //    allowExportSelectedData: true
    //},
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        if (e.rowType === "data") {
            if (e.data.WoIdentityID === 2) {
                e.rowElement.css('background', '#017f01c4');
                e.rowElement.css('color', 'white');
            } else {
                e.rowElement.css('background', 'coral');
            }
        }
    },
    onSelectionChanged: function (Showlist) {
        sholistData = Showlist.selectedRowsData;
        if (sholistData.length <= 0) return;
        document.getElementById("TxtWorkOrderConversionID").value = sholistData[0].TransactionID;
    },
    columns: [
        { dataField: "TransactionID", visible: false, width: 120 },
        { dataField: "VoucherID", visible: false, width: 120 },
        { dataField: "LedgerID", visible: false, width: 120 },
        { dataField: "MaxVoucherNo", visible: false, width: 80, caption: "MaxVoucherNo" },
        //{ dataField: "LedgerName", visible: true, width: 150, caption: "Vendor Name" },
        { dataField: "VoucherNo", visible: true, width: 100, caption: "Voucher No." },
        { dataField: "VoucherNo", visible: true, width: 100, caption: "Voucher No.", groupIndex: 0 },
        { dataField: "VoucherDate", visible: true, width: 90, caption: "Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ItemCode", visible: true, width: 90, caption: "Item Code" },
        { dataField: "ItemGroupName", visible: false, width: 100, caption: "Item Group" },
        { dataField: "ItemSubGroupName", visible: true, width: 100, caption: "Sub Group" },
        { dataField: "ItemName", visible: true, width: 250, caption: "Item Name" },
        { dataField: "ReceiptQuantity", visible: true, width: 100, caption: "Receipt Quantity" },
        { dataField: "IssueQuantity", visible: true, width: 100, caption: "Consumed Quantity" },
        { dataField: "RejectedQuantity", visible: true, width: 100, caption: "Waste Quantity" },
        { dataField: "CreatedBy", visible: true, width: 100, caption: "Created By" },
        { dataField: "FYear", visible: false, width: 100, caption: "FYear" },
        { dataField: "Particular", visible: true, width: 120, caption: "Instruction By" },
        { dataField: "Narration", visible: true, width: 120, caption: "Narration" },
        { dataField: "JobReference", visible: true, width: 100, caption: "Job Reference" }
    ]
});

//SelectedItemGrid
$("#SelectedItemGrid").dxDataGrid({
    dataSource: SelectedItemData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 2.5;
    },
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
        allowDeleting: true,
        allowUpdating: true
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "ConsumedQty" || e.column.dataField === "WasteQty") {
            e.cancel = false;
        } else {
            e.cancel = true;
        }
    },
    onRowUpdated: function (e) {
        var ItemGrid = $('#SelectedItemGrid').dxDataGrid('instance');
        var ItemGridRow = ItemGrid._options.dataSource.length;
        for (var t = 0; t < ItemGridRow; t++) {
            var ConsumedQuantity = ItemGrid._options.dataSource[t].ConsumedQty;
            var WasteQuantity = ItemGrid._options.dataSource[t].WasteQty;

            if (ConsumedQuantity === "" || ConsumedQuantity === undefined || ConsumedQuantity === null) {
                ConsumedQuantity = 0;
            }
            if (WasteQuantity === "" || WasteQuantity === undefined || WasteQuantity === null) {
                WasteQuantity = 0;
                ItemGrid._options.dataSource[t].WasteQty = 0;
            }
            if (Number(Number(ConsumedQuantity) + Number(WasteQuantity)) > Number(ItemGrid._options.dataSource[t].BatchStock)) {
                DevExpress.ui.notify("Quantity is greater than available stock..!", "warning", 2500);
                ItemGrid._options.dataSource[t].ConsumedQty = 0;
                ItemGrid._options.dataSource[t].WasteQty = 0;
                return false;
            }
        }
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 150 },
        { dataField: "ItemSubGroupName", visible: false, caption: "Sub Group Name", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 80 },
        { dataField: "IssueQuantity", visible: false, caption: "Qty", width: 100 },
        { dataField: "ConsumedQty", visible: true, caption: "Consumed Qty", width: 100 },
        { dataField: "WasteQty", visible: true, caption: "Waste Qty", width: 100 },
        { dataField: "GRNNo", visible: true, caption: "GRN No.", width: 100 },
        { dataField: "GRNDate", visible: true, caption: "GRN Date", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 150 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "SizeW", visible: true, caption: "Size W", width: 100 },
        { dataField: "SizeL", visible: true, caption: "Size L", width: 100 }
    ]
});

$("#WholeItemGrid").dxDataGrid({
    dataSource: WholeItem,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 2.3;
    },
    paging: {
        pageSize: 250
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [250, 350, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "single" // or "multiple" | "single"
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
    onSelectionChanged: function (Showlist) {
        WholeItemGridtData = Showlist.selectedRowsData;
        if (WholeItemGridtData.length <= 0) return;
        document.getElementById("TxtQuantity").value = Number(WholeItemGridtData[0].BatchStock);
    },
    columns: [
        { dataField: "ItemCode", visible: true, caption: "Item Code" },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name" },
        { dataField: "ItemSubGroupName", visible: false, caption: "Sub Group Name", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit" },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock" },
        { dataField: "IssueQuantity", visible: false, caption: "Qty", width: 100 },
        { dataField: "GRNNo", visible: true, caption: "GRN No.", width: 120 },
        { dataField: "GRNDate", visible: true, caption: "GRN Date", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "SizeW", visible: true, caption: "Size W", width: 100 },
        { dataField: "SizeL", visible: true, caption: "Size L", width: 100 }
    ]
});

//AllocatedItemGrid
$("#AllotedItemGrid").dxDataGrid({
    dataSource: AllocatedItemData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3.2;
    },
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
    columns: [
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 150 },
        { dataField: "ItemSubGroupName", visible: false, caption: "Sub Group Name", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit" },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock" },
        { dataField: "IssueQuantity", visible: false, caption: "Qty", width: 100 },
        { dataField: "GRNNo", visible: true, caption: "GRN No.", width: 120 },
        { dataField: "GRNDate", visible: true, caption: "GRN Date" },
        { dataField: "BatchNo", visible: true, caption: "Batch No." },
        { dataField: "Warehouse", visible: true, caption: "Godown Name" },
        { dataField: "Bin", visible: true, caption: "Bin" },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 150 },
        { dataField: "GSM", visible: true, caption: "GSM" },
        { dataField: "SizeW", visible: true, caption: "Size W" },
        { dataField: "SizeL", visible: true, caption: "Size L" }
    ]
});

///WholeItemGrid Paper Group
$("#WholeItemGridMaster").dxDataGrid({
    dataSource: WholeItemMaster,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 2.3;
    },
    paging: {
        pageSize: 250
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [250, 350, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "single" // or "multiple" | "single"
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
    onSelectionChanged: function (Showlist) {
        WholeItemGridtDataMaster = Showlist.selectedRowsData;
    },
    columns: [
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 150 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 600 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 120 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "SizeW", visible: true, caption: "Size W", width: 100 },
        { dataField: "SizeL", visible: true, caption: "Size L", width: 100 }
    ]
});

//AllocatedItemGrid
$("#AllotedItemGridMaster").dxDataGrid({
    dataSource: AllocatedItemDataMaster,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3.2;
    },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    editing: {
        mode: "cell",
        allowUpdating: true,
        allowDeleting: true
    },
    onRowUpdating: function (e) {
        if (e.newData.ReceivedQuantity > 0) {
            var QtyInKg_Cal = 0;
            var GSM, SizeW, SizeL;
            GSM = Number(e.oldData.GSM);
            SizeW = Number(e.oldData.SizeW);
            SizeL = Number(e.oldData.SizeL);
            QtyInKg_Cal = (Number(e.newData.ReceivedQuantity) * (Number(GSM * SizeW * SizeL) / 1000000000)).toFixed(2);
            e.newData.QtyInKg = QtyInKg_Cal;
        }
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "TransID", visible: false, caption: "TransID" },
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code", allowEditing: false },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 150, allowEditing: false },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 350, allowEditing: false },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 120, allowEditing: false },
        { dataField: "ReceivedQuantity", visible: true, caption: "Qty", width: 100, allowEditing: true },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100, allowEditing: false },
        { dataField: "Bin", visible: true, caption: "Bin", width: 150, allowEditing: false },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 100, allowEditing: false },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100, allowEditing: false },
        { dataField: "SizeW", visible: true, caption: "Size W", width: 100, allowEditing: false },
        { dataField: "SizeL", visible: true, caption: "Size L", width: 100, allowEditing: false }
    ]
});

$("#ProductJobCard").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    height: function () {
        return window.innerHeight / 1.3;
    },
    paging: {
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    selection: { mode: "multiple", showCheckBoxesMode: "always" },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (Sel) {
        SelectedProductJobCardList = Sel.selectedRowsData;
    },
    columns: [
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
        { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 200 },
        { dataField: "LedgerName", visible: true, caption: "LedgerName", width: 150 },
        { dataField: "SalesOrderNO", visible: true, caption: "SalesOrderNO", width: 120 },
        { dataField: "PONO", visible: true, caption: "PONO", width: 120 },
        { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 150 },
        { dataField: "JobBookingDate", visible: true, caption: "JobBookingDate", width: 120 },
        { dataField: "JobName", visible: true, caption: "JobName", width: 150 },
        { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 100 },
        { dataField: "OrderQuantity", visible: true, caption: "OrderQuantity", width: 100 },
        { dataField: "DeliveryDate", visible: true, caption: "DeliveryDate", width: 100 },
        { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 100 }
    ]
});

$("#SecondItemGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 3.2;
    },
    paging: {
        pageSize: 250
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [250, 350, 500, 1000]
    },
    sorting: {
        mode: "single" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: 'cell',
        allowDeleting: true,
        allowUpdating: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "ReceivedQuantity") {
            e.cancel = false;
        } else e.cancel = true;
    },
    onRowUpdating: function (e) {
        if (e.newData.ReceivedQuantity > 0) {
            var QtyInKg_Cal = 0;
            var GSM, SizeW, SizeL;
            GSM = Number(e.oldData.GSM);
            SizeW = Number(e.oldData.SizeW);
            SizeL = Number(e.oldData.SizeL);
            QtyInKg_Cal = (Number(e.newData.ReceivedQuantity) * (Number(GSM * SizeW * SizeL) / 1000000000)).toFixed(2);
            e.newData.QtyInKg = QtyInKg_Cal;
            FillConsumedQty(QtyInKg_Cal);
        }
    },
    onSelectionChanged: function (s) {
        SecondItemGridSelectedData = s.selectedRowsData;
    },
    columns: [
        { dataField: "TransID", visible: false, caption: "TransID" },
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 120 },
        { dataField: "ReceivedQuantity", visible: true, caption: "Qty", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 150 },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 150 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "SizeW", visible: true, caption: "Size W", width: 100 },
        { dataField: "SizeL", visible: true, caption: "Size L", width: 100 },
        { dataField: "QtyInKg", visible: true, caption: "Qty(Kg)", width: 100 }
    ]
});

$.ajax({
    type: "POST",
    url: "WebService_ReelToSheetCuttingStock.asmx/Showlist",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        var RES1 = JSON.parse(res.toString());

        $("#WorkOrderConversionGrid").dxDataGrid({
            dataSource: RES1
        });
    }
});

$("#CreateButton").click(function () {
    GblStatus = "";
    SelectedItemData = [];
    $("#SelectedItemGrid").dxDataGrid({
        dataSource: SelectedItemData
    });

    CreateVoucherNO();

    $("#RTSDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#SelVendorName").dxSelectBox({ value: null });

    document.getElementById("TxtInstruction").value = '';
    document.getElementById("TxtNarration").value = '';
    document.getElementById("BtnOpenProductJobCard").value = '';
    document.getElementById("TxtWorkOrderNarration").value = '';

    document.getElementById("WOCSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#SelectStockItemButton").click(function () {
    AllocatedItemData = [];

    var ItemGrid = $('#SelectedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    var optAllocatedItemGrid = {};
    if (ItemGridRow > 0) {
        for (var t = 0; t < ItemGridRow; t++) {
            optAllocatedItemGrid = {};
            optAllocatedItemGrid.TransID = t + 1;
            optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
            optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
            optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
            optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
            optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
            optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
            optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
            optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
            optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
            optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
            optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
            optAllocatedItemGrid.BatchStock = ItemGrid._options.dataSource[t].BatchStock;
            optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
            optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
            optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
            optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
            optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
            optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;

            AllocatedItemData.push(optAllocatedItemGrid);
        }
    }

    $("#AllotedItemGrid").dxDataGrid({
        dataSource: AllocatedItemData
    });
    document.getElementById("SelectStockItemButton").setAttribute("data-toggle", "modal");
    document.getElementById("SelectStockItemButton").setAttribute("data-target", "#largeModalSelectItem");
});

$("#BtnNew").click(function () {
    location.reload();
});

GetWholeItemStock();
function GetWholeItemStock() {
    $.ajax({
        type: "POST",
        url: "WebService_ReelToSheetCuttingStock.asmx/GetStockBatchWise",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            WholeItem = [];
            WholeItem = JSON.parse(res.toString());
            $("#WholeItemGrid").dxDataGrid({
                dataSource: WholeItem
            });
        }
    });
}

$("#BtnAddItemPop").click(function () {
    var TxtQuantity = document.getElementById("TxtQuantity").value;

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (WholeItemGridtData.length < 1) {
        DevExpress.ui.notify("Please select any row from above grid...!", "warning", 1500);
        return false;
    }
    if (ItemGridRow > 0) {
        for (var k = 0; k < ItemGridRow; k++) {
            if (WholeItemGridtData[0].BatchNo === ItemGrid._options.dataSource[k].BatchNo && WholeItemGridtData[0].ItemID === ItemGrid._options.dataSource[k].ItemID) {
                DevExpress.ui.notify("This Item already exist.Please select another Item..!", "warning", 1500);
                return false;
            }
        }
    }

    var result = $.grep(ItemGrid._options.dataSource, function (e) {
        return WholeItemGridtData[0].ItemID !== e.ItemID;
    });
    if (result.length > 0) {
        DevExpress.ui.notify("Please select same item with different batch no..!", "warning", 1500);
        return false;
    }

    AllocatedItemData = [];
    var optAllocatedItemGrid = {};

    if (ItemGridRow > 0) {
        for (var t = 0; t <= ItemGridRow; t++) {
            if (WholeItemGridtData[0].ItemGroupName === ItemGrid._options.dataSource[0].ItemGroupName) {
                if (t === ItemGridRow) {
                    optAllocatedItemGrid = {};
                    optAllocatedItemGrid.TransID = t + 1;
                    optAllocatedItemGrid.ItemID = WholeItemGridtData[0].ItemID;
                    optAllocatedItemGrid.ItemGroupID = WholeItemGridtData[0].ItemGroupID;
                    optAllocatedItemGrid.ItemGroupNameID = WholeItemGridtData[0].ItemGroupNameID;
                    optAllocatedItemGrid.ItemSubGroupID = WholeItemGridtData[0].ItemSubGroupID;
                    optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
                    optAllocatedItemGrid.ItemCode = WholeItemGridtData[0].ItemCode;
                    optAllocatedItemGrid.ItemGroupName = WholeItemGridtData[0].ItemGroupName;
                    optAllocatedItemGrid.IssueQuantity = WholeItemGridtData[0].BatchStock;
                    optAllocatedItemGrid.ItemSubGroupName = WholeItemGridtData[0].ItemSubGroupName;
                    optAllocatedItemGrid.ItemName = WholeItemGridtData[0].ItemName;
                    optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
                    optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;
                    optAllocatedItemGrid.GRNNo = WholeItemGridtData[0].GRNNo;
                    optAllocatedItemGrid.GRNDate = WholeItemGridtData[0].GRNDate;
                    optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
                    optAllocatedItemGrid.Warehouse = WholeItemGridtData[0].Warehouse;
                    optAllocatedItemGrid.Bin = WholeItemGridtData[0].Bin;
                    optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
                    optAllocatedItemGrid.GSM = WholeItemGridtData[0].GSM;
                    optAllocatedItemGrid.SizeW = WholeItemGridtData[0].SizeW;
                    optAllocatedItemGrid.SizeL = WholeItemGridtData[0].SizeL;

                    AllocatedItemData.push(optAllocatedItemGrid);
                } else {
                    optAllocatedItemGrid = {};

                    optAllocatedItemGrid = {};
                    optAllocatedItemGrid.TransID = t + 1;
                    optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
                    optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
                    optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
                    optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
                    optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
                    optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
                    optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
                    optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
                    optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
                    optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
                    optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                    optAllocatedItemGrid.BatchStock = ItemGrid._options.dataSource[t].BatchStock;
                    optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
                    optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
                    optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                    optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
                    optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                    optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;
                    optAllocatedItemGrid.GSM = ItemGrid._options.dataSource[t].GSM;
                    optAllocatedItemGrid.SizeW = ItemGrid._options.dataSource[t].SizeW;
                    optAllocatedItemGrid.SizeL = ItemGrid._options.dataSource[t].SizeL;

                    AllocatedItemData.push(optAllocatedItemGrid);

                }
            } else {
                DevExpress.ui.notify("please choose same Item group name..!", "warning", 1500);
                return false;
            }
        }

        $("#AllotedItemGrid").dxDataGrid({
            dataSource: AllocatedItemData
        });
    }
    else {
        optAllocatedItemGrid = {};
        optAllocatedItemGrid.TransID = t + 1;
        optAllocatedItemGrid.ItemID = WholeItemGridtData[0].ItemID;
        optAllocatedItemGrid.ItemGroupID = WholeItemGridtData[0].ItemGroupID;
        optAllocatedItemGrid.ItemGroupNameID = WholeItemGridtData[0].ItemGroupNameID;
        optAllocatedItemGrid.ItemSubGroupID = WholeItemGridtData[0].ItemSubGroupID;
        optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
        optAllocatedItemGrid.ItemCode = WholeItemGridtData[0].ItemCode;
        optAllocatedItemGrid.ItemGroupName = WholeItemGridtData[0].ItemGroupName;
        optAllocatedItemGrid.IssueQuantity = WholeItemGridtData[0].BatchStock;
        optAllocatedItemGrid.ItemSubGroupName = WholeItemGridtData[0].ItemSubGroupName;
        optAllocatedItemGrid.ItemName = WholeItemGridtData[0].ItemName;
        optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
        optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;
        optAllocatedItemGrid.GRNNo = WholeItemGridtData[0].GRNNo;
        optAllocatedItemGrid.GRNDate = WholeItemGridtData[0].GRNDate;
        optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
        optAllocatedItemGrid.Warehouse = WholeItemGridtData[0].Warehouse;
        optAllocatedItemGrid.Bin = WholeItemGridtData[0].Bin;
        optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
        optAllocatedItemGrid.GSM = WholeItemGridtData[0].GSM;
        optAllocatedItemGrid.SizeW = WholeItemGridtData[0].SizeW;
        optAllocatedItemGrid.SizeL = WholeItemGridtData[0].SizeL;

        AllocatedItemData.push(optAllocatedItemGrid);

        $("#AllotedItemGrid").dxDataGrid({
            dataSource: AllocatedItemData
        });
    }
});

$("#BtnApply").click(function () {
    SelectedItemData = AllocatedItemData;
    $("#SelectedItemGrid").dxDataGrid({
        dataSource: SelectedItemData
    });

    document.getElementById("BtnApply").setAttribute("data-dismiss", "modal");
    document.getElementById("BtnApply").setAttribute("data-target", "#largeModalSelectItem");
});

$("#BtnSave").click(function () {
    var voucherDate = $('#RTSDate').dxDateBox('instance').option('value');
    var TxtInstruction = document.getElementById("TxtInstruction").value.trim();
    var TxtNarration = document.getElementById("TxtNarration").value.trim();
    var TxtWorkOrderNarration = document.getElementById("TxtWorkOrderNarration").value.trim();
    var TxtJobReference = document.getElementById("BtnOpenProductJobCard").value.trim();

    var ItemGrid = $('#SelectedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    var SecondItemGrid = $('#SecondItemGrid').dxDataGrid('instance');
    var SecondItemGridRow = SecondItemGrid.totalCount();

    if (ItemGridRow <= 0) {
        DevExpress.ui.notify("Please select reel from stock..!", "warning", 1200);
        return false;
    }

    if (SecondItemGridRow <= 0) {
        DevExpress.ui.notify("Please select item master..!", "warning", 1200);
        return false;
    }

    for (var t = 0; t < ItemGridRow; t++) {
        if (ItemGrid._options.dataSource[t].ConsumedQty === "" || Number(ItemGrid._options.dataSource[t].ConsumedQty) === 0 || ItemGrid._options.dataSource[t].ConsumedQty === undefined) {
            DevExpress.ui.notify("Please enter consumed quantity..!", "warning", 1200);
            return false;
        }
    }

    var totalReceiptQty = 0;
    var QuantityInKg = 0;

    for (t = 0; t < SecondItemGridRow; t++) {
        if (Number(SecondItemGrid._options.dataSource[t].ReceivedQuantity) === 0 || SecondItemGrid._options.dataSource[t].ReceivedQuantity === "" || SecondItemGrid._options.dataSource[t].ReceivedQuantity === undefined) {
            DevExpress.ui.notify("Quantity should be greater than '0'..!", "warning", 1200);
            return false;
        } else {
            QuantityInKg = Number(QuantityInKg) + Number(SecondItemGrid._options.dataSource[t].QtyInKg);
            totalReceiptQty = Number(totalReceiptQty) + Number(SecondItemGrid._options.dataSource[t].ReceivedQuantity);
        }
    }

    var TotalConsumedQty = 0;
    for (var j = 0; j < ItemGridRow; j++) {
        TotalConsumedQty = Number(TotalConsumedQty) + Number(ItemGrid._options.dataSource[j].ConsumedQty);

        if (Number(ItemGrid._options.dataSource[j].ReceivedQuantity) > 0) {
            totalReceiptQty = Number(totalReceiptQty) + Number(ItemGrid._options.dataSource[j].ReceivedQuantity);
        }
    }

    var ConsQty = Number(TotalConsumedQty).toFixed(2);
    var ProdQty = Number(QuantityInKg).toFixed(2);

    if (ConsQty > ProdQty) {
        swal("Invalid Consume Quantity..!", "Consumed quantity should not be less than production sheet weight..!", "warning");
        return false;
    }

    var jsonObjectsTransactionMain = [];
    var TransactionMainRecord = {};

    TransactionMainRecord.VoucherDate = voucherDate;
    TransactionMainRecord.Narration = TxtNarration;
    TransactionMainRecord.TotalQuantity = totalReceiptQty;
    TransactionMainRecord.Particular = TxtInstruction;
    TransactionMainRecord.JobReference = TxtJobReference;
    TransactionMainRecord.WorkOrderNarration = TxtWorkOrderNarration;

    jsonObjectsTransactionMain.push(TransactionMainRecord);

    var jsonObjectsItemConsumptionMain = [];
    var OptItemConsumptionMain = {};

    OptItemConsumptionMain.VoucherDate = voucherDate;
    OptItemConsumptionMain.Narration = TxtNarration;
    OptItemConsumptionMain.TotalQuantity = totalReceiptQty;
    OptItemConsumptionMain.Particular = TxtInstruction;
    //OptItemConsumptionMain.JobReference = TxtJobReference;
    //OptItemConsumptionMain.WorkOrderNarration = TxtWorkOrderNarration;

    jsonObjectsItemConsumptionMain.push(OptItemConsumptionMain);

    var jsonObjectsTransactionDetail = [];
    var TransactionDetailRecord = {};
    if (SecondItemGridRow > 0) {
        for (var e = 0; e < SecondItemGridRow; e++) {
            TransactionDetailRecord = {};

            TransactionDetailRecord.TransID = e + 1;
            TransactionDetailRecord.ItemID = SecondItemGrid._options.dataSource[e].ItemID;
            TransactionDetailRecord.ItemGroupID = SecondItemGrid._options.dataSource[e].ItemGroupID;
            TransactionDetailRecord.ReceiptQuantity = SecondItemGrid._options.dataSource[e].ReceivedQuantity;
            TransactionDetailRecord.StockUnit = SecondItemGrid._options.dataSource[e].StockUnit;
            TransactionDetailRecord.BatchNo = "";
            TransactionDetailRecord.WarehouseID = SecondItemGrid._options.dataSource[e].WarehouseID;
            TransactionDetailRecord.WoTransactionID = 0;
            TransactionDetailRecord.WoIdentityID = 2;

            jsonObjectsTransactionDetail.push(TransactionDetailRecord);
        }
    }

    var ObjFirstGridData = [];
    var optFirstGridData = [];

    for (var x = 0; x < ItemGridRow; x++) {
        optFirstGridData = {};

        optFirstGridData.TransID = x + 1;
        optFirstGridData.ParentTransactionID = ItemGrid._options.dataSource[x].ParentTransactionID;
        optFirstGridData.ItemID = ItemGrid._options.dataSource[x].ItemID;
        optFirstGridData.ItemGroupID = ItemGrid._options.dataSource[x].ItemGroupID;
        optFirstGridData.IssueQuantity = Number(ItemGrid._options.dataSource[x].ConsumedQty); // + Number(ItemGrid._options.dataSource[x].WasteQty);
        optFirstGridData.RejectedQuantity = Number(ItemGrid._options.dataSource[x].WasteQty);
        optFirstGridData.StockUnit = ItemGrid._options.dataSource[x].StockUnit;
        optFirstGridData.BatchNo = ItemGrid._options.dataSource[x].BatchNo;
        optFirstGridData.WarehouseID = ItemGrid._options.dataSource[x].WarehouseID;
        optFirstGridData.WoIdentityID = 1;

        ObjFirstGridData.push(optFirstGridData);
    }

    var jsonObjectsItemConsumptionDetail = [];
    var OptItemConsumptionDetail = {};
    for (x = 0; x < ItemGridRow; x++) {
        OptItemConsumptionDetail = {};

        OptItemConsumptionDetail.ParentTransactionID = ItemGrid._options.dataSource[x].ParentTransactionID;
        OptItemConsumptionDetail.ItemID = ItemGrid._options.dataSource[x].ItemID;
        OptItemConsumptionDetail.ItemGroupID = ItemGrid._options.dataSource[x].ItemGroupID;
        OptItemConsumptionDetail.ReceivedQuantity = Number(ItemGrid._options.dataSource[x].ConsumedQty) + Number(ItemGrid._options.dataSource[x].WasteQty);
        OptItemConsumptionDetail.StockUnit = ItemGrid._options.dataSource[x].StockUnit;
        OptItemConsumptionDetail.BatchNo = ItemGrid._options.dataSource[x].BatchNo;
        OptItemConsumptionDetail.WarehouseID = ItemGrid._options.dataSource[x].WarehouseID;
        OptItemConsumptionDetail.TransID = 1;

        jsonObjectsItemConsumptionDetail.push(OptItemConsumptionDetail);
    }

    var jsonObjectsItemConsumptionDetail_Consumed = [];
    var OptItemConsumptionDetail_Consumed = {};

    for (x = 0; x < ItemGridRow; x++) {
        OptItemConsumptionDetail_Consumed = {};

        OptItemConsumptionDetail_Consumed.ParentTransactionID = ItemGrid._options.dataSource[x].ParentTransactionID;
        OptItemConsumptionDetail_Consumed.ItemID = ItemGrid._options.dataSource[x].ItemID;
        OptItemConsumptionDetail_Consumed.ItemGroupID = ItemGrid._options.dataSource[x].ItemGroupID;
        OptItemConsumptionDetail_Consumed.IssueQuantity = Number(ItemGrid._options.dataSource[x].ConsumedQty) + Number(ItemGrid._options.dataSource[x].WasteQty);
        OptItemConsumptionDetail_Consumed.ConsumeQuantity = ItemGrid._options.dataSource[x].ConsumedQty;
        OptItemConsumptionDetail_Consumed.WasteQuantity = ItemGrid._options.dataSource[x].WasteQty;
        OptItemConsumptionDetail_Consumed.StockUnit = ItemGrid._options.dataSource[x].StockUnit;
        OptItemConsumptionDetail_Consumed.BatchNo = ItemGrid._options.dataSource[x].BatchNo;
        OptItemConsumptionDetail_Consumed.WarehouseID = ItemGrid._options.dataSource[x].WarehouseID;
        OptItemConsumptionDetail_Consumed.TransID = 1;

        jsonObjectsItemConsumptionDetail_Consumed.push(OptItemConsumptionDetail_Consumed);
    }

    jsonObjectsTransactionMain = JSON.stringify(jsonObjectsTransactionMain);
    jsonObjectsTransactionDetail = JSON.stringify(jsonObjectsTransactionDetail);
    jsonObjectsItemConsumptionMain = JSON.stringify(jsonObjectsItemConsumptionMain);
    jsonObjectsItemConsumptionDetail = JSON.stringify(jsonObjectsItemConsumptionDetail);
    jsonObjectsItemConsumptionDetail_Consumed = JSON.stringify(jsonObjectsItemConsumptionDetail_Consumed);

    ObjFirstGridData = JSON.stringify(ObjFirstGridData);

    try {

        var txt = '';
        swal({
            title: "Do you want to continue..?",
            text: txt,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Save it !",
            closeOnConfirm: false
        },
            function () {
                if (GblStatus === "Update") {
                    DevExpress.ui.notify("You can not update it..!", "warning", 1200);
                    return false;
                } else {
                    document.getElementById("LOADER").style.display = "block";
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebService_ReelToSheetCuttingStock.asmx/SaveData",
                            data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsTransactionMain :' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail :' + jsonObjectsTransactionDetail + ',jsonObjectsItemConsumptionMain :' + jsonObjectsItemConsumptionMain + ',jsonObjectsItemConsumptionDetail  :' + jsonObjectsItemConsumptionDetail + ',jsonObjectsItemConsumptionDetail_Consumed:' + jsonObjectsItemConsumptionDetail_Consumed + ',ObjFirstGridData :' + ObjFirstGridData + '}',
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
                                    swal("Data Saved..!", "Your data saved successfully...", "success");
                                    location.reload();
                                } else if (res.includes("Can't Delete")) {
                                    swal("Can't Delete..!", res, "error");
                                } else {
                                    console.log(res);
                                }
                            },
                            error: function errorFunc(jqXHR) {
                                document.getElementById("LOADER").style.display = "none";
                                swal("Error!", "Please try after some time..", "");
                                alert(jqXHR);
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
    } catch (e) {
        console.log(e);
    }
});

$("#EditButton").click(function () {
    var TxtWorkOrderConversionID = document.getElementById("TxtWorkOrderConversionID").value;
    if (TxtWorkOrderConversionID === "" || TxtWorkOrderConversionID === null || TxtWorkOrderConversionID === undefined) {
        alert("Please select any record to edit or view !");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_ReelToSheetCuttingStock.asmx/RetriveDataFirstGrid",
        data: '{transactionID:' + JSON.stringify(TxtWorkOrderConversionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var WOCSRetrive = JSON.parse(res);
            SelectedItemData = WOCSRetrive;
            $("#SelectedItemGrid").dxDataGrid({
                dataSource: SelectedItemData
            });

            $.ajax({
                type: "POST",
                url: "WebService_ReelToSheetCuttingStock.asmx/RetriveDataSecondGrid",
                data: '{transactionID:' + JSON.stringify(TxtWorkOrderConversionID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var SecondItemGridData = JSON.parse(res);
                    $("#SecondItemGrid").dxDataGrid({
                        dataSource: SecondItemGridData
                    });
                }
            });
        }
    });

    document.getElementById("TxtRTSVoucherNo").value = sholistData[0].VoucherNo;
    $("#RTSDate").dxDateBox({
        value: sholistData[0].VoucherDate
    });
    document.getElementById("BtnOpenProductJobCard").value = sholistData[0].JobReference;
    document.getElementById("TxtWorkOrderNarration").value = sholistData[0].WorkOrderNarration;

    document.getElementById("TxtInstruction").value = sholistData[0].Particular;
    document.getElementById("TxtNarration").value = sholistData[0].Narration;

    GblStatus = "Update";
    document.getElementById("WOCSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#DeleteButton").click(function () {
    var TxtPOID = document.getElementById("TxtWorkOrderConversionID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        alert("Please select any record to delete..!");
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this ' + sholistData[0].VoucherNo + ' voucher no.!',
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
                url: "WebService_ReelToSheetCuttingStock.asmx/DeleteWOCS",
                data: '{TxtPOID:' + JSON.stringify(TxtPOID) + '}',
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

$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

var SelectedProductJobCardList = [];
$("#BtnOpenProductJobCard").click(function () {
    $.ajax({
        type: "POST",
        url: "WebService_ReelToSheetCuttingStock.asmx/GetJobCardNoForPopUp",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var ProductJobCardRES1 = JSON.parse(res);

            $("#ProductJobCard").dxDataGrid({
                dataSource: ProductJobCardRES1
            });
        }
    });

    document.getElementById("BtnOpenProductJobCard").setAttribute("data-toggle", "modal");
    document.getElementById("BtnOpenProductJobCard").setAttribute("data-target", "#largeModalJobCard");
});

$("#BtnJobCard").click(function () {
    var JobCardText = "";
    if (SelectedProductJobCardList.length > 0) {
        for (var f = 0; f < SelectedProductJobCardList.length; f++) {
            if (JobCardText === "") {
                JobCardText = SelectedProductJobCardList[f].JobCardContentNo;
            } else {
                JobCardText = JobCardText + "," + SelectedProductJobCardList[f].JobCardContentNo;
            }
        }
    }
    document.getElementById("BtnOpenProductJobCard").value = JobCardText;
});

$("#SelectItemMasterButton").click(function () {
    var SelectedItemGrid = $('#SelectedItemGrid').dxDataGrid('instance');
    if (SelectedItemGrid._options.dataSource.length <= 0) return;
    $("#WholeItemGridMaster").dxDataGrid("instance").filter([
        ["SizeW", "=", Number(SelectedItemGrid._options.dataSource[0].SizeW)], "and", ["ItemName", "contains", SelectedItemGrid._options.dataSource[0].ItemName.split(',')[0]],
        "and", ["GSM", "=", Number(SelectedItemGrid._options.dataSource[0].GSM)]//, "and",
        //["Manufecturer", "=", AllocatedItemData[0].Manufecturer], "and", ["Finish", "=", AllocatedItemData[0].Finish]
    ]);
    document.getElementById("SelectItemMasterButton").setAttribute("data-toggle", "modal");
    document.getElementById("SelectItemMasterButton").setAttribute("data-target", "#largeModalSelectItemMaster");
});

try {
    //fetch paper group master list
    $.ajax({
        type: "POST",
        url: "WebService_ReelToSheetCuttingStock.asmx/GetStockItemGroupIDWise",
        data: '{ItemGroupID_Str:' + JSON.stringify("Paper") + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            WholeItemMaster = JSON.parse(res.toString());
            $("#WholeItemGridMaster").dxDataGrid({
                dataSource: WholeItemMaster
            });
        }
    });
} catch (e) {
    document.getElementById("LOADER").style.display = "none";
    console.log(e);
}

//PopUp
$("#BtnAddItemPopMaster").click(function () {
    var SelGodownName = $("#SelGodownName").dxSelectBox('instance').option('value');
    var SelBin = $("#SelBin").dxSelectBox('instance').option('value');

    var ItemGrid = $('#AllotedItemGridMaster').dxDataGrid('instance');

    if (WholeItemGridtDataMaster.length < 1) {
        DevExpress.ui.notify("Please select any row from above grid...!", "warning", 1500);
    }

    if (SelGodownName === "" || SelGodownName === null || SelGodownName === undefined || SelGodownName === "null") {
        DevExpress.ui.notify("Please select Godown Name...!", "warning", 1500);
        return false;
    }
    if (SelBin === "" || SelBin === null || SelBin === undefined || SelBin === "null") {
        DevExpress.ui.notify("Please select Bin...!", "warning", 1500);
        return false;
    }
    var dataGridMain = $('#SecondItemGrid').dxDataGrid('instance');
    var result = $.grep(dataGridMain._options.dataSource, function (e) {
        return WholeItemGridtDataMaster[0].ItemID === e.ItemID;
    });
    if (result.length > 0) {
        DevExpress.ui.notify("This Item already exist.Please select another Item..!", "warning", 1500);
        return false;
    }

    AllocatedItemDataMaster = [];
    var optAllocatedItemGrid = {};

    optAllocatedItemGrid.TransID = ItemGrid._options.dataSource.length + 1;
    optAllocatedItemGrid.ItemID = WholeItemGridtDataMaster[0].ItemID;
    optAllocatedItemGrid.ItemGroupID = WholeItemGridtDataMaster[0].ItemGroupID;
    optAllocatedItemGrid.ItemGroupNameID = WholeItemGridtDataMaster[0].ItemGroupNameID;
    optAllocatedItemGrid.ItemCode = WholeItemGridtDataMaster[0].ItemCode;
    optAllocatedItemGrid.ItemGroupName = WholeItemGridtDataMaster[0].ItemGroupName;
    optAllocatedItemGrid.ReceivedQuantity = 0;
    optAllocatedItemGrid.QtyInKg = 0;
    optAllocatedItemGrid.ItemName = WholeItemGridtDataMaster[0].ItemName;
    optAllocatedItemGrid.StockUnit = WholeItemGridtDataMaster[0].StockUnit;
    optAllocatedItemGrid.Warehouse = SelGodownName;
    optAllocatedItemGrid.Bin = $("#SelBin").dxSelectBox('instance').option('text');
    optAllocatedItemGrid.WarehouseID = SelBin;
    optAllocatedItemGrid.GSM = WholeItemGridtDataMaster[0].GSM;
    optAllocatedItemGrid.SizeW = WholeItemGridtDataMaster[0].SizeW;
    optAllocatedItemGrid.SizeL = WholeItemGridtDataMaster[0].SizeL;

    AllocatedItemDataMaster.push(optAllocatedItemGrid);

    var clonedItem = $.extend({}, optAllocatedItemGrid);
    ItemGrid._options.dataSource.splice(ItemGrid._options.dataSource.length, 0, clonedItem);
    ItemGrid.refresh(true);
});

$("#BtnApplyMaster").click(function () {

    var ItemGrid = $('#AllotedItemGridMaster').dxDataGrid('instance');
    var SecondItemGrid = $('#SecondItemGrid').dxDataGrid('instance');
    var ItemDataMaster = ItemGrid._options.dataSource;
    if (ItemDataMaster.length === 0) {
        DevExpress.ui.notify("Please add items first..!", "warning", 1500);
        return false;
    }
    var SumConsQty = 0;
    for (var i = 0; i < ItemDataMaster.length; i++) {
        var result = $.grep(SecondItemGrid._options.dataSource, function (e) { return ItemDataMaster[i].ItemID === e.ItemID; });
        if (result.length === 1) {
            SumConsQty = SumConsQty + Number(result[0].QtyInKg);
            continue;
        }
        SumConsQty = SumConsQty + Number(ItemDataMaster[i].QtyInKg);

        var clonedItem = $.extend({}, ItemDataMaster[i]);
        SecondItemGrid._options.dataSource.splice(SecondItemGrid._options.dataSource.length, 0, clonedItem);
        SecondItemGrid.refresh(true);
    }
    //$("#SecondItemGrid").dxDataGrid({ dataSource: AllocatedItemDataMaster });
    FillConsumedQty(SumConsQty);

    document.getElementById("BtnApplyMaster").setAttribute("data-dismiss", "modal");
    document.getElementById("BtnApplyMaster").setAttribute("data-target", "#largeModalSelectItem");
});

$("#SelBin").dxSelectBox({
    items: [],
    placeholder: "Select Bin",
    displayExpr: 'Bin',
    valueExpr: 'WarehouseID',
    searchEnabled: true,
    showClearButton: true
});

$("#SelGodownName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'Warehouse',
    valueExpr: 'Warehouse',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        //Bin
        $.ajax({
            type: "POST",
            url: "WebService_ReelToSheetCuttingStock.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(e.value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var SelFloorGodown = JSON.parse(res.toString());
                $("#SelBin").dxSelectBox({
                    items: SelFloorGodown
                });
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_ReelToSheetCuttingStock.asmx/GetWarehouseList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var warehouseContener = JSON.parse(res);

        $("#SelGodownName").dxSelectBox({
            items: warehouseContener
        });
    }
});

function FillConsumedQty(SumConsQty) {
    var SelectedItemGrid = $('#SelectedItemGrid').dxDataGrid('instance');
    var ItemGridRow = SelectedItemGrid._options.dataSource.length;

    for (var t = 0; t < ItemGridRow; t++) {
        if (Number(SumConsQty) <= 0) return;
        if (Number(SumConsQty) > Number(SelectedItemGrid._options.dataSource[t].BatchStock)) {
            SumConsQty = Number(SumConsQty) - Number(SelectedItemGrid._options.dataSource[t].BatchStock);
            SelectedItemGrid._options.dataSource[t].ConsumedQty = Number(SelectedItemGrid._options.dataSource[t].BatchStock).toFixed(2);
        } else {
            SelectedItemGrid._options.dataSource[t].ConsumedQty = Number(SumConsQty).toFixed(2);
            SumConsQty = 0;
        }
    }
    SelectedItemGrid.refresh(true);
}