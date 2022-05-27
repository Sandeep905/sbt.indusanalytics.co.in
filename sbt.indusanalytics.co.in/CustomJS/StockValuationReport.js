"use strict";

var StockGridData = [];
var StockBatchWiseGridData = [];
var DynamicColPush = [];

//var popup = $("#popup").dxPopover({
//    width: 100,
//    height: 50
//}).dxPopover("instance");

$("#gridstock").dxDataGrid({
    dataSource: StockGridData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    //keyExpr: "TransactionID",
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "single" },
    paging: { enabled: true, pageSize: 100 },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    // scrolling: { mode: 'virtual' },
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: true },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Stock Report",
        allowExportSelectedData: true
    },

    editing: {
        mode: "cell",
        allowUpdating: false
    },
    //focusedRowEnabled: true,
    columns: [
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
        { dataField: "PhysicalStock", visible: true, caption: "Physical Stock", width: 120 },
        { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 120 },
        { dataField: "FreeStock", visible: true, caption: "Free Stock", width: 120 },
        { dataField: "IncomingStock", visible: true, caption: "Incoming Stock", width: 120 },
        { dataField: "OutgoingStock", visible: true, caption: "Outgoing Stock", width: 120 },
        { dataField: "BookedStock", visible: true, caption: "Booked Stock", width: 120 },
        { dataField: "TheoriticalStock", visible: true, caption: "Theoritical Stock", width: 120 },
        { dataField: "FloorStock", visible: true, caption: "Floor Stock", width: 120 },
        { dataField: "UnapprovedStock", visible: true, caption: "Unapproved Stock", width: 120 },
        { dataField: "PhysicalStockValue", visible: true, caption: "Physical Stock Value", width: 120 },
        { dataField: "AllocatedStockValue", visible: true, caption: "Allocated Stock Value", width: 120 },
        { dataField: "FreeStockValue", visible: true, caption: "Free Stock Value", width: 120 },
        { dataField: "IncomingStockValue", visible: true, caption: "Incoming Stock Value", width: 120 },
        { dataField: "OutgoingStockValue", visible: true, caption: "Outgoing Stock Value", width: 120 },
        { dataField: "BookedStockValue", visible: true, caption: "Booked Stock Value", width: 120 },
        { dataField: "TheoriticalStockValue", visible: true, caption: "Theoritical Stock Value", width: 120 },
        { dataField: "FloorStockValue", visible: true, caption: "Floor Stock Value", width: 120 },
        { dataField: "UnapprovedStockValue", visible: true, caption: "Unapproved Stock Value", width: 120 },
        { dataField: "WtPerPacking", visible: false, caption: "Wt. Per Packing", width: 120 }],

    height: function () {
        return window.innerHeight / 1.7;
    },

    onCellClick: function (clickedCell) {
        var grid = $('#gridstock').dxDataGrid('instance');
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType !== "data") return;

        if (clickedCell.columnIndex > 4 && clickedCell.column.dataField === "PhysicalStock" || clickedCell.column.dataField === "AllocatedStock" || clickedCell.column.dataField === "BookedStock" || clickedCell.column.dataField === "IncomingStock" || clickedCell.column.dataField === "FloorStock") {
            var ItemIDvar = clickedCell.data.ItemID;
            var colDataField = clickedCell.column.dataField;
            var DynamicCol = {};
            var fixColumn = "";
            if (colDataField === "PhysicalStock") {
                DynamicColPush = [];
                fixColumn = "ItemID,ItemGroupID,ItemGroupNameID,ItemSubGroupID,ParentTransactionID,WarehouseID,ItemGroupName,ItemSubGroupName,ItemCode,ItemName,BatchStock,StockUnit,BatchStockInPurchaseUnit,PurchaseUnit,LandedRate,BatchStockValue,GRNNo,GRNDate,BatchNo,Warehouse,Bin,WtPerPacking,UnitPerPacking,ConversionFactor,SizeW";
            }
            if (colDataField === "AllocatedStock") {
                DynamicColPush = [];
                fixColumn = "PicklistTransactionID,DepartmentID,MachineID,ItemID,JobBookingID,ItemGroupID,TransactionDetailID,JobBookingJobCardContentsID,ItemGroupNameID,ItemSubGroupID,IsReleased,IsCancelled,IsCompleted,PicklistNo,PicklistDate,DepartmentName,BookingNo,JobCardNo,JobName,ContentName,ItemGroupName,ItemSubGroupName,ItemCode,ItemName,PicklistQuantity,ReleasedQuantity,IssuedQuantity,AllocatedQuantity,StockUnit,AllocatedStockInPurchaseUnit,PurchaseUnit,LandedRate,AllocatedStockValue,CreatedBy";
            }
            if (colDataField === "BookedStock") {
                DynamicColPush = [];
                fixColumn = "JobBookingID,JobBookingJobCardContentsID,ItemID,ItemGroupID,ItemSubGroupID,ItemGroupNameID,ItemGroupName,ItemSubGroupName,ItemCode,ItemName,JobBookedQuantity, AllocatedQuantity,BookedQuantity,StockUnit,BookedStockInPurchaseUnit,PurchaseUnit,LandedRate,BookedStockValue";
            }
            if (colDataField === "IncomingStock") {
                DynamicColPush = [];
                fixColumn = "TransactionID,ItemID,ItemGroupID,ItemGroupNameID,ItemSubGroupID,PurchaseOrderNo,PurchaseOrderDate,ItemSubGroupName,ItemGroupName,ItemCode,ItemName,PurchaseOrderQuantity,ChallanQuantity,ReceiptQuantityInPurchaseUnit,PendingQuantity,PurchaseRate,PurchaseUnit,PendingStockValue";
            }
            if (colDataField === "FloorStock") {
                DynamicColPush = [];
                fixColumn = "JobBookingID,ParentTransactionID,TransactionID,DepartmentID,FloorWarehouseID,JobBookingJobCardContentsID,MachineID,ItemID,ItemGroupID,ItemGroupNameID,ItemSubGroupID,DepartmentName,IssueNo,IssueDate,ItemGroupName,ItemSubGroupName,ItemCode,ItemName,BatchNo,GRNDate,GRNNo,JobCardNo,JobName,ContentName,IssueQuantity,ConsumeQuantity,FloorStock StockUnit,FloorStockInPurchaseUnit,PurchaseUnit,WarehouseName,Bin,MachineName,LandedRate,FloorStockValue";
            }

            fixColumn = fixColumn.split(',');
            for (var FCOl in fixColumn) {
                var Colobj = fixColumn[FCOl];
                DynamicCol = {};
                DynamicCol.dataField = Colobj;

                if (Colobj === "ItemName") {
                    DynamicCol.width = 300;
                } else if (Colobj === "TransactionID" || Colobj === "ItemID" || Colobj === "ItemGroupID" || Colobj === "ItemGroupNameID" || Colobj === "ItemSubGroupID" || Colobj === "ParentTransactionID" || Colobj === "WarehouseID" || Colobj === "PicklistTransactionID" || Colobj === "DepartmentID" || Colobj === "MachineID" || Colobj === "JobBookingID" || Colobj === "TransactionDetailID" || Colobj === "JobBookingJobCardContentsID" || Colobj === "FloorWarehouseID") {
                    DynamicCol.width = 0;
                }
                else {
                    DynamicCol.width = 120;
                }
                DynamicColPush.push(DynamicCol);
            }
            $.ajax({
                type: "POST",
                url: "WebService_StockValuationReport.asmx/GetStockBatchWise",
                data: '{ItemId:' + JSON.stringify(ItemIDvar) + ',colDataField:' + JSON.stringify(colDataField) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var StockRES1 = JSON.parse(res.toString());
                    $("#StockBatchWiseGrid").dxDataGrid({
                        dataSource: StockRES1,
                        columns: DynamicColPush
                    });
                }
            });
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
    summary: {
        totalItems: [{
            column: "PhysicalStock",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "AllocatedStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "FreeStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "IncomingStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "BookedStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "FloorStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "TheoriticalStock",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "PhysicalStockValue",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "AllocatedStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "FreeStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "IncomingStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "BookedStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "FloorStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "TheoriticalStockValue",
            summaryType: "sum",
            displayFormat: "{0}"
        }]
    }
});

$("#StockBatchWiseGrid").dxDataGrid({
    dataSource: StockBatchWiseGridData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    sorting: {
        mode: "multiple"
    },
    paging: { enabled: false },
    selection: { mode: "single" },
    filterRow: { visible: false, applyFilter: "auto" },
    columnChooser: { enabled: false },
    headerFilter: { visible: false },
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Stock Report Item Batch Wise",
        allowExportSelectedData: true
    },
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    //focusedRowEnabled: true,
    //columns: [
    //    { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
    //    { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
    //    { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
    //    { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
    //    { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
    //    { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 80 },
    //    { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
    //    { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
    //    { dataField: "ItemName", visible: true, caption: "ItemName", width: 400 },
    //    { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
    //    { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
    //    { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 100 },
    //    { dataField: "GRNNo", visible: true, caption: "Receipt No.", width: 100 },
    //    { dataField: "GRNDate", visible: true, caption: "Receipt Date", width: 100 },
    //    { dataField: "BatchNo", visible: true, caption: "Batch No", width: 100 },
    //    { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
    //    { dataField: "Bin", visible: true, caption: "Bin", width: 80 },
    //    { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
    //    { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
    //    { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
    //],
    height: function () {
        return window.innerHeight / 3;
    },
    summary: {
        totalItems: [{
            column: "BatchStock",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }]
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    }
});

refreshstock();
function refreshstock() {
    document.getElementById("LOADER").style.display = "block";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_StockValuationReport.asmx/PhysicalStockData",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                ////console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                StockGridData = [];
                StockGridData = JSON.parse(res);
                $("#gridstock").dxDataGrid({
                    dataSource: StockGridData
                });
            }
        });
    } catch (e) {
        alert(e);
    }
}


