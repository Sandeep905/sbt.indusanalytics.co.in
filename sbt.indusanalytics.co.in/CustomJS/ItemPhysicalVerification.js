"use strict";

var physicalstockrow = "";
var batchstockrow = "";
var Gblshowlist = [];
var TransactionID = 0;

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 250,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#SelItemGroup").dxSelectBox({
    items: [],
    placeholder: "Select",
    displayExpr: 'ItemGroupID',
    valueExpr: 'ItemGroupName',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {

    }
});

$("#sel_Warehouse").dxSelectBox({
    items: [],
    placeholder: "Select Warehouse",
    displayExpr: 'Warehouse',
    valueExpr: 'Warehouse',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        RefreshBins(data.value);
    }
});

$("#DtPickerVoucherDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});

try {
    $.ajax({
        type: "POST",
        url: "WebServiceItemPhysicalVerification.asmx/GenerateVoucherNo",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            document.getElementById("TxtVoucherNo").value = results.d;
        }
    });

    $.ajax({
        type: "POST",
        url: "WebServiceItemPhysicalVerification.asmx/GetWarehouseList",
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
            var warehouse = JSON.parse(res);

            $("#sel_Warehouse").dxSelectBox({
                items: warehouse
            });
        }
    });
} catch (e) {
    alert(e);
}

$("#sel_Bin").dxSelectBox({
    items: [],
    placeholder: "Select Bin",
    displayExpr: 'Bin',
    valueExpr: 'WarehouseID',
    searchEnabled: true,
    showClearButton: true
});

function RefreshBins(value) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var bins = JSON.parse(res);
                $("#sel_Bin").dxSelectBox({
                    items: bins
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
}

refreshstock();
function refreshstock() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/PhysicalStockData",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);

                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var tt = JSON.parse(res);
                $("#gridstock").dxDataGrid({
                    dataSource: tt
                });
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

$("#gridstock").dxDataGrid({
    dataSource: [],
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
    paging: {
        enabled: true,
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    // scrolling: { mode: 'virtual' },
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: false },
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
        enabled: false,
        fileName: "Pending Orders",
        allowExportSelectedData: true
    },
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    //focusedRowEnabled: true,
    columns: [
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
        { dataField: "ItemName", visible: true, caption: "ItemName", width: 300 },
        { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
        { dataField: "PhysicalStock", visible: true, caption: "Physical Stock", width: 100 },
        { dataField: "BookedStock", visible: true, caption: "Booked Stock", width: 100 },
        { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 100 },
        { dataField: "UnapprovedStock", visible: true, caption: "Unapproved Stock", width: 100 },
        { dataField: "FreeStock", visible: false, caption: "Free Stock", width: 100 },
        { dataField: "IncomingStock", visible: true, caption: "Incoming Stock", width: 100 },
        { dataField: "OutgoingStock", visible: true, caption: "Outgoing Stock", width: 100 },
        { dataField: "FloorStock", visible: true, caption: "Floor Stock", width: 100 },
        { dataField: "TheoriticalStock", visible: false, caption: "Theoritical Stock", width: 100 },
        { dataField: "PhysicalStockValue", visible: false, caption: "Physical Stock Value", width: 100 },
        { dataField: "BookedStockValue", visible: false, caption: "Booked Stock Value", width: 100 },
        { dataField: "AllocatedStockValue", visible: false, caption: "Allocated Stock Value", width: 100 },
        { dataField: "UnapprovedStockValue", visible: false, caption: "Unapproved Stock Value", width: 100 },
        { dataField: "FreeStockValue", visible: false, caption: "Free Stock Value", width: 100 },
        { dataField: "IncomingStockValue", visible: false, caption: "Incoming Stock Value", width: 100 },
        { dataField: "OutgoingStockValue", visible: false, caption: "Outgoing Stock Value", width: 100 },
        { dataField: "FloorStockValue", visible: false, caption: "Floor Stock Value", width: 100 },
        { dataField: "TheoriticalStockValue", visible: false, caption: "Theoritical Stock Value", width: 100 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 100 }
    ],
    height: function () {
        return window.innerHeight / 2.5;
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
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
    onSelectionChanged: function (selectedItems) {
        physicalstockrow = "";
        physicalstockrow = selectedItems.selectedRowsData[0];
        document.getElementById("TxtItemID").value = 0;
        document.getElementById("TxtItemCode").value = "";
        document.getElementById("TxtItemName").value = "";
        document.getElementById("TxtGRNTransactionID").value = 0;
        document.getElementById("TxtStockUnit").value = "";
        document.getElementById("TxtTotalStock").value = 0;
        document.getElementById("TxtUnitDecimalPlace").value = 0;
        document.getElementById("TxtBatchNo").value = "";
        document.getElementById("TxtAdjestQty").value = 0;
        $("#sel_Warehouse").dxSelectBox({
            value: ''
        });
        $("#sel_Bin").dxSelectBox({
            value: ''
        });
        document.getElementById("TxtItemID").value = physicalstockrow.ItemID;
        document.getElementById("TxtItemCode").value = physicalstockrow.ItemCode;
        document.getElementById("TxtItemName").value = physicalstockrow.ItemName;
        document.getElementById("TxtStockUnit").value = physicalstockrow.StockUnit;
        document.getElementById("TxtUnitDecimalPlace").value = physicalstockrow.UnitDecimalPlace;

        document.getElementById("TxtBatchNo").disabled = false;
        $("#sel_Warehouse").dxSelectBox({
            disabled: false
        });
        $("#sel_Bin").dxSelectBox({
            disabled: false
        });

        var ItemId = physicalstockrow.ItemID;
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/GetStockBatchWise",
            data: '{ItemId:' + JSON.stringify(ItemId) + '}',
            //   data: '{ItemId:' + JSON.stringify(ItemId) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var StockRES1 = JSON.parse(res.toString());
                $("#StockBatchWiseGrid").dxDataGrid({
                    dataSource: StockRES1
                });
            }
        });
        //if (physicalstockrow.BatchStock > 0) {
        //    document.getElementById("TxtBatchNo").disabled = true;
        //    $("#sel_Warehouse").dxSelectBox({
        //        disabled: true
        //    });
        //    $("#sel_Bin").dxSelectBox({
        //        disabled: true
        //    });
        //} else {
        //    document.getElementById("TxtBatchNo").disabled = false;
        //    $("#sel_Warehouse").dxSelectBox({
        //        disabled: false
        //    });
        //    $("#sel_Bin").dxSelectBox({
        //        disabled: false
        //    });
        //}
        //if (physicalstockrow.WarehouseID > 0) {
        //    $("#sel_Warehouse").dxSelectBox({
        //        value: physicalstockrow.Warehouse,
        //    });
        //    RefreshBins(physicalstockrow.Warehouse);
        //    $("#sel_Bin").dxSelectBox({
        //        value: physicalstockrow.WarehouseID,
        //    });
        //}
    }
});

$("#StockBatchWiseGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    //keyExpr: "TransactionID",
    sorting: {
        mode: "multiple"
    },
    paging: { enabled: false },
    selection: { mode: "single" },
    // scrolling: { mode: 'virtual' },
    filterRow: { visible: false, applyFilter: "auto" },
    columnChooser: { enabled: false },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    //focusedRowEnabled: true,
    columns: [
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
        { dataField: "ItemName", visible: true, caption: "ItemName", width: 400 },
        { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 100 },
        { dataField: "GRNNo", visible: true, caption: "Receipt No.", width: 100 },
        { dataField: "GRNDate", visible: true, caption: "Receipt Date", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 80 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 }
    ],
    height: function () {
        return window.innerHeight / 5;
    },
    //onEditingStart: function (e) {
    //    if (e.column.dataField === "BatchDetail") {
    //        e.cancel = false;
    //    } else {
    //        e.cancel = true;
    //    }
    //},
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
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
    onSelectionChanged: function (selectedItems) {
        batchstockrow = "";
        batchstockrow = selectedItems.selectedRowsData[0];
        document.getElementById("TxtGRNTransactionID").value = 0;
        document.getElementById("TxtTotalStock").value = 0;
        $("#sel_Warehouse").dxSelectBox({
            value: ''
        });
        $("#sel_Bin").dxSelectBox({
            value: ''
        });
        document.getElementById("TxtGRNTransactionID").value = batchstockrow.ParentTransactionID;
        document.getElementById("TxtTotalStock").value = batchstockrow.BatchStock;
        document.getElementById("TxtBatchNo").value = batchstockrow.BatchNo;
        document.getElementById("TxtAdjestQty").value = batchstockrow.BatchStock;
        document.getElementById("TxtBatchNo").disabled = true;
        if (batchstockrow.WarehouseID > 0) {
            $("#sel_Warehouse").dxSelectBox({
                value: batchstockrow.Warehouse,
                disabled: true
            });
            RefreshBins(batchstockrow.Warehouse);
            $("#sel_Bin").dxSelectBox({
                value: batchstockrow.WarehouseID,
                disabled: true
            });
        }
    }
});

$("#gridnewstock").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    //keyExpr: "TransactionID",
    sorting: {
        mode: "multiple"
    },
    paging: { enabled: false },
    selection: { mode: "single" },
    //        paging: {
    //            pageSize: 15
    //    },
    //        pager: {
    //            showPageSizeSelector: true,
    //            allowedPageSizes: [15, 25, 50, 100]
    //},
    // scrolling: { mode: 'virtual' },
    filterRow: { visible: false },
    columnChooser: { enabled: false },
    headerFilter: { visible: false },
    //rowAlternationEnabled: true,
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: false,
        fileName: "Pending Orders",
        allowExportSelectedData: true
    },
    editing: {
        mode: "cell",
        allowUpdating: false,
        allowDeleting: true
    },
    //focusedRowEnabled: true,
    columns: [
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 200 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
        { dataField: "GRNNo", visible: true, caption: "Receipt No.", width: 100 },
        { dataField: "GRNDate", visible: true, caption: "Receipt Date", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 120 },
        { dataField: "CurrentStock", visible: true, caption: "Current Stock", width: 100 },
        { dataField: "NewStock", visible: true, caption: "New Stock", width: 100 },
        { dataField: "AdjustedStock", visible: true, caption: "AdjustedStock", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 80 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 }
    ],

    height: function () {
        return window.innerHeight / 5.5;
    },
    //onEditingStart: function (e) {
    //    if (e.column.dataField === "BatchDetail") {
    //        e.cancel = false;
    //    } else {
    //        e.cancel = true;
    //    }
    //},
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
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

function enableControls() {
    var checkBox = document.getElementById("chknewstock");
    if (checkBox.checked === true) {
        document.getElementById("TxtGRNTransactionID").value = 0;
        document.getElementById("TxtBatchNo").value = "";
        document.getElementById("TxtTotalStock").value = 0;
        document.getElementById("TxtBatchNo").disabled = false;
        $("#sel_Warehouse").dxSelectBox({
            disabled: false
        });
        $("#sel_Bin").dxSelectBox({
            disabled: false
        });
    } else {
        if (physicalstockrow !== "") {
            document.getElementById("TxtItemID").value = physicalstockrow.ItemID;
            document.getElementById("TxtItemCode").value = physicalstockrow.ItemCode;
            document.getElementById("TxtItemName").value = physicalstockrow.ItemName;
            document.getElementById("TxtGRNTransactionID").value = physicalstockrow.ParentTransactionID;
            document.getElementById("TxtStockUnit").value = physicalstockrow.StockUnit;
            document.getElementById("TxtTotalStock").value = physicalstockrow.BatchStock;
            document.getElementById("TxtBatchNo").value = physicalstockrow.BatchNo;
            document.getElementById("TxtAdjestQty").value = physicalstockrow.BatchStock;
            document.getElementById("TxtUnitDecimalPlace").value === physicalstockrow.UnitDecimalPlace;
            if (physicalstockrow.BatchStock > 0) {
                document.getElementById("TxtBatchNo").disabled = true;
                $("#sel_Warehouse").dxSelectBox({
                    disabled: true
                });
                $("#sel_Bin").dxSelectBox({
                    disabled: true
                });
            } else {
                document.getElementById("TxtBatchNo").disabled = false;
                $("#sel_Warehouse").dxSelectBox({
                    disabled: false
                });
                $("#sel_Bin").dxSelectBox({
                    disabled: false
                });
            }
        }
    }
}

$("#BtnAdd").click(function () {
    var i = 0;
    var addedstock = [];
    var objpub = {};
    if (physicalstockrow === "") {
        DevExpress.ui.notify("Please select stock item to adjust physical stock !", "warning", 1200);
        return;
    }
    var itemid = document.getElementById("TxtItemID").value;
    if (isNaN(itemid) || Number(document.getElementById("TxtItemID").value) === 0) {
        DevExpress.ui.notify("Please select stock item to adjust physical stock !", "warning", 1200);
        return;
    }

    var x = $("#sel_Warehouse").dxSelectBox("instance");
    if (x.option('value') === null || x.option('value') === "") {
        DevExpress.ui.notify("Please select warehouse to adjust physical stock !", "warning", 1200);
        return;
    }
    x = $("#sel_Bin").dxSelectBox("instance");
    if (x.option('value') === null || x.option('value') === "") {
        DevExpress.ui.notify("Please select bin to adjust physical stock !", "warning", 1200);
        return;
    }
    if (document.getElementById("TxtBatchNo").value.trim() === "") {
        DevExpress.ui.notify("Please enter stock batch no. to adjust physical stock !", "warning", 1200);
        return;
    }
    var adjustqty = document.getElementById("TxtAdjestQty").value;
    var CheckNewStock = document.getElementById("chknewstock").checked;

    if ((isNaN(adjustqty) || Number(adjustqty) < 0) && CheckNewStock === false) {
        DevExpress.ui.notify("Please enter valid current physical stock quantity !", "warning", 1200);
        return;
    } else if ((isNaN(adjustqty) || Number(adjustqty) <= 0) && CheckNewStock === true) {
        DevExpress.ui.notify("Please enter valid current physical stock quantity !", "warning", 1200);
        return;
    }
    var currstock = 0;
    var newstock = 0;
    var adjustedstock = 0;
    currstock = Number(document.getElementById("TxtTotalStock").value);
    newstock = Number(document.getElementById("TxtAdjestQty").value);
    if (currstock > 0) {
        if (currstock - newstock === 0) {
            DevExpress.ui.notify("Please enter valid stock current physical stock quantity..!", "warning", 1200);
            return;
        }
    }

    var dataGrid = $("#gridnewstock").dxDataGrid("instance");
    if (dataGrid.totalCount() > 0) {
        var result = $.grep(dataGrid._options.dataSource, function (e) { return (e.ItemID === Number(document.getElementById("TxtItemID").value) && e.BatchNo === document.getElementById("TxtBatchNo").value.trim()); });
        if (result.length === 1) {
            //found
            DevExpress.ui.notify("Already added stock for same batch and selected item !", "warning", 1200);
            return;
        }
    }

    if (Number(document.getElementById("TxtGRNTransactionID").value) === "NaN" || Number(document.getElementById("TxtGRNTransactionID").value) === 0) {
        objpub.ParentTransactionID = 0;
    } else {
        objpub.ParentTransactionID = Number(document.getElementById("TxtGRNTransactionID").value);
    }

    objpub.ItemID = Number(document.getElementById("TxtItemID").value);
    objpub.ItemGroupID = physicalstockrow.ItemGroupID;
    objpub.ItemSubGroupID = physicalstockrow.ItemSubGroupID;
    objpub.WarehouseID = x.option('value');
    objpub.ItemGroupName = physicalstockrow.ItemGroupName;
    objpub.ItemSubGroupName = physicalstockrow.ItemSubGroupName;
    objpub.ItemCode = physicalstockrow.ItemCode;
    objpub.ItemName = physicalstockrow.ItemName;
    objpub.ItemDescription = physicalstockrow.ItemDescription;
    objpub.StockUnit = physicalstockrow.StockUnit;
    objpub.GRNNo = physicalstockrow.GRNNo;
    objpub.GRNDate = physicalstockrow.GRNDate;
    objpub.BatchNo = document.getElementById("TxtBatchNo").value.trim();
    objpub.CurrentStock = Number(document.getElementById("TxtTotalStock").value);
    objpub.NewStock = Number(document.getElementById("TxtAdjestQty").value);

    if (currstock > 0) {
        if (currstock > newstock) {
            objpub.AdjustedStock = newstock - currstock;
        } else {
            objpub.AdjustedStock = newstock - currstock;
        }
    } else {
        objpub.AdjustedStock = newstock;
    }
    objpub.Warehouse = $("#sel_Warehouse").dxSelectBox("instance").option('text');
    objpub.Bin = x.option('text');
    objpub.WtPerPacking = physicalstockrow.WtPerPacking;
    objpub.UnitPerPacking = physicalstockrow.UnitPerPacking;
    objpub.ConversionFactor = physicalstockrow.ConversionFactor;
    dataGrid._options.dataSource.push(objpub);
    dataGrid.refresh();
    //$("#gridnewstock").dxDataGrid({
    //    dataSource: addedstock,
    //});
    //for (i = 0; i < dataGrid._options)
});

$("#BtnShowList").click(function () {
    document.getElementById("BtnShowList").setAttribute("data-toggle", "modal");
    document.getElementById("BtnShowList").setAttribute("data-target", "#largeModal");
    RefreshVS();
});

$("#BtnDelete").click(function () {
    if (TransactionID <= 0) {
        swal("Selection..!", "Please select the transaction first", "warning");
        return false;
    }
    try {
        swal({
            title: "Are you sure..?",
            text: 'You will be able to recover this transaction..!',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        },
            function () {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    type: "POST",
                    url: "WebServiceItemPhysicalVerification.asmx/DeletePhysicalVerification",
                    data: '{TransID:' + Gblshowlist[0].TransactionDetailID + ',ItemID:' + Gblshowlist[0].ItemID + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        if (res === "Success") {
                            swal("Deleted..!", "Your data Deleted", "success");
                            location.reload();
                        } else {
                            swal("Not Deleted..!", res, "warning");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        console.log(jqXHR);
                    }
                });
            });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
});

function RefreshVS() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/RefreshVouchersList",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);

                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var RES1 = JSON.parse(res);
                
                $("#GridShowList").dxDataGrid({
                    dataSource: RES1
                });
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

$("#GridShowList").dxDataGrid({
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
    paging: {
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Physical Stock Updation",
        allowExportSelectedData: true
    },
    columns: [
        { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
        { dataField: "VoucherNo", visible: true, caption: "Voucher No.", width: 100 },
        { dataField: "VoucherDate", visible: true, caption: "Voucher Date", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 40 },
        { dataField: "OldStockQuantity", visible: true, caption: "Old Stock", width: 80 },
        { dataField: "NewStockQuantity", visible: true, caption: "New Stock", width: 80 },
        { dataField: "AdjustedStockQty", visible: true, caption: "Adjusted", width: 80 },
        { dataField: "ClosingQty", visible: true, caption: "Closing", width: 80 },
        { dataField: "GRNNo", visible: false, caption: "Receipt No.", width: 60 },
        { dataField: "GRNDate", visible: false, caption: "Receipt Date", width: 60 },
        { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 100 },
        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 80 },
        { dataField: "Narration", visible: true, caption: "Remark", width: 80 },
        { dataField: "CreatedBy", visible: true, caption: "Created By", width: 80 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (selectedItems) {
        if (selectedItems.selectedRowsData.length <= 0) {
            TransactionID = 0;
            Gblshowlist = [];
            return;
        }
        TransactionID = selectedItems.selectedRowsData[0].TransactionID;
        Gblshowlist = selectedItems.selectedRowsData;
    }
});

$("#BtnNew").click(function () {
    TransactionID = 0;
    document.getElementById("TxtVoucherNo").value = "";
    $("#DtPickerVoucherDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });
    document.getElementById("TxtItemCode").value = "";
    document.getElementById("TxtItemID").value = "";
    document.getElementById("TxtGRNTransactionID").value = "";
    document.getElementById("TxtTotalStock").value = "";
    document.getElementById("TxtItemName").value = "";
    document.getElementById("TxtStockUnit").value = "";
    document.getElementById("TxtBatchNo").value = "";
    document.getElementById("TxtAdjestQty").value = "";
    document.getElementById("TxtAdjestQty").value = "";
    document.getElementById("TxtNarration").value = "";
    document.getElementById("TxtUnitDecimalPlace").value = 0;
    document.getElementById("chknewstock").checked = false;
    document.getElementById("TxtBatchNo").disabled = false;
    $("#sel_Warehouse").dxSelectBox({
        value: '',
        disabled: false
    });
    $("#sel_Bin").dxSelectBox({
        value: '',
        disabled: false
    });
    $("#gridnewstock").dxDataGrid({
        dataSource: []
    });
    $("#StockBatchWiseGrid").dxDataGrid({
        dataSource: []
    });
});

$("#BtnSave").click(function () {
    var dataGrid = $("#gridnewstock").dxDataGrid('instance');
    if (dataGrid.totalCount() <= 0) {
        DevExpress.ui.notify("Please add any item to adjust physical stock!", "warning", 1200);
        return;
    }
    var prefix = "PHY";
    var voucherid = -16;
    var voucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
    //var totalreceiptqty = $.receiptBatchDetail.Sum({ ChallanQuantity });
    var totalreceiptqty = 0;
    var textNarration = document.getElementById("TxtNarration").value.trim();

    try {

        var jsonObjectsTransactionMain = [];
        var TransactionMainRecord = {};

        TransactionMainRecord.VoucherID = -16;
        TransactionMainRecord.VoucherDate = voucherDate;
        TransactionMainRecord.TotalQuantity = totalreceiptqty;
        TransactionMainRecord.Particular = "Stock Verification";
        TransactionMainRecord.Narration = textNarration;

        jsonObjectsTransactionMain.push(TransactionMainRecord);

        var jsonObjectsTransactionDetail = [];
        var TransactionDetailRecord = {};
        for (var e = 0; e < dataGrid.totalCount(); e++) {
            TransactionDetailRecord = {};

            TransactionDetailRecord.TransID = e + 1;
            TransactionDetailRecord.ItemID = Number(dataGrid._options.dataSource[e].ItemID);
            TransactionDetailRecord.ItemGroupID = Number(dataGrid._options.dataSource[e].ItemGroupID);
            TransactionDetailRecord.ParentTransactionID = Number(dataGrid._options.dataSource[e].ParentTransactionID);
            if (Number(dataGrid._options.dataSource[e].AdjustedStock) > 0) {
                TransactionDetailRecord.ReceiptQuantity = Number(dataGrid._options.dataSource[e].AdjustedStock);
            } else if (Number(dataGrid._options.dataSource[e].AdjustedStock) < 0) {
                TransactionDetailRecord.IssueQuantity = Number(dataGrid._options.dataSource[e].AdjustedStock) * -1;
            }
            if (Number(dataGrid._options.dataSource[e].CurrentStock) > 0) {
                TransactionDetailRecord.OldStockQuantity = Number(dataGrid._options.dataSource[e].CurrentStock);
            }
            if (Number(dataGrid._options.dataSource[e].CurrentStock) > 0) {
                TransactionDetailRecord.NewStockQuantity = Number(dataGrid._options.dataSource[e].NewStock);
            }
            TransactionDetailRecord.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            TransactionDetailRecord.StockUnit = dataGrid._options.dataSource[e].StockUnit;
            TransactionDetailRecord.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;

            jsonObjectsTransactionDetail.push(TransactionDetailRecord);
        }

        jsonObjectsTransactionMain = JSON.stringify(jsonObjectsTransactionMain);
        jsonObjectsTransactionDetail = JSON.stringify(jsonObjectsTransactionDetail);

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
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebServiceItemPhysicalVerification.asmx/SaveStockVerificationVoucher",
                        data: '{prefix:' + JSON.stringify(prefix) + ',voucherid:' + JSON.stringify(voucherid) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail:' + jsonObjectsTransactionDetail + '}',
                        // data: '{prefix:' + JSON.stringify(prefix) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);

                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                            if (res === "Success") {
                                // RadioValue = "Pending Requisitions";
                                swal("Saved!", "Your data saved", "success");
                                // alert("Your Data has been Saved Successfully...!");
                                location.reload();
                            } else if (res.includes("Error:")) {
                                swal("Error..!", res, "error");
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            swal("Error!", "Please try after some time..", "");
                            console.log(jqXHR);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    } catch (e) {
        console.log(e);
    }
});

$('#TxtAdjestQty').keypress(function (event) {
    if (this.type === "text" && event.which !== 13 && event.which !== 34 && event.which !== 39) {
        return isNumber(event, this);
    }
});

$('#TxtAdjestQty').change(function (event) {
    var x = Number(document.getElementById("TxtUnitDecimalPlace").value);
    this.value = Number(this.value).toFixed(x);
});

function isNumber(evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    if (charCode !== 45 && (charCode !== 46 || $(element).val().indexOf('.') !== -1) && ((charCode < 48 && charCode !== 8) || charCode > 57)) {
        return false;
    }
    else {
        return true;
    }
}
