"use strict";

var vsselectedrow = "";
var voucherPrefix = "TRN";
var TransactionID = 0;
var FlagEdit = false;
var ResWarehouse, ResBin, ResStock, ResDestBin, Resvouchers;


$("#sel_DestinationBin").dxSelectBox({
    value: ''
});

$("#DtPickerDnDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',
});

$("#DtPickerVoucherDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',
});

RefreshWarehouse();

$("#CreateVoucherButton").click(function () {
    var dataGrid;
    TransactionID = 0;
    vsselectedrow = "";
    document.getElementById("TxtVoucherNo").value = '';
    document.getElementById("TxtMaxVoucherNo").value = '';
    document.getElementById("TxtDnNo").value = '';
    document.getElementById("TxtNarration").value = '';
    document.getElementById("BtnDelete").disabled = true;
    document.getElementById("BtnPrint").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    $("#sel_Warehouse").dxSelectBox({
        value: '',
    });
    $("#sel_Bin").dxSelectBox({
        items: [],
    });

    $("#sel_DestinationWarehouse").dxSelectBox({
        value: '',
    });
    $("#sel_DestinationBin").dxSelectBox({
        items: [],
    });

    $("#DtPickerVoucherDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10),
    });
    $("#DtPickerDnDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10),
    });
    $("#GridWarehouseStock").dxDataGrid({
        dataSource: []
    });
    $("#GridTransferStock").dxDataGrid({
        dataSource: []
    });
    CreateVoucherNo();
    document.getElementById("CreateVoucherButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateVoucherButton").setAttribute("data-target", "#largeModal");
});

$("#EditVoucherButton").click(function () {
    if (vsselectedrow == "" || vsselectedrow == null) {
        DevExpress.ui.notify("Please select any voucher to view or edit !", "warning", 1200);
        return;
    }
    TransactionID = Number(document.getElementById("TxtTransactionID").value);

    var dataGrid = $("#gridvoucherslist").dxDataGrid('instance');
    var TransactionData = "";
    var newArray = [];
    TransactionData = dataGrid.option('dataSource');
    newArray = TransactionData.filter(function (el) {
        return el.TransactionID == TransactionID;
    });
    if (newArray.length <= 0) {
        DevExpress.ui.notify("No voucher details found for the selected row !", "warning", 1200);
        return;
    }

    FlagEdit = true;
    document.getElementById("TxtVoucherNo").value = newArray[0].VoucherNo;
    document.getElementById("TxtMaxVoucherNo").value = newArray[0].MaxVoucherNo;
    document.getElementById("TxtDnNo").value = newArray[0].DeliveryNoteNo;
    document.getElementById("TxtNarration").value = newArray[0].Narration;
    document.getElementById("BtnDelete").disabled = false;
    document.getElementById("BtnPrint").disabled = false;
    document.getElementById("BtnSave").disabled = true;
    $("#sel_Warehouse").dxSelectBox({
        value: newArray[0].Warehouse
    });
    $("#sel_Bin").dxSelectBox({
        value: newArray[0].WarehouseID
    });

    $("#sel_DestinationWarehouse").dxSelectBox({
        value: newArray[0].DestinationWarehouse
    });
    $("#sel_DestinationBin").dxSelectBox({
        value: newArray[0].DestinationWarehouseID
    });

    $("#DtPickerVoucherDate").dxDateBox({
        value: newArray[0].VoucherDate
    });
    $("#DtPickerDnDate").dxDateBox({
        value: newArray[0].DeliveryNoteDate
    });
    $("#GridWarehouseStock").dxDataGrid({
        dataSource: []
    });
    $("#GridTransferStock").dxDataGrid({
        dataSource: newArray
    });
    document.getElementById("EditVoucherButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditVoucherButton").setAttribute("data-target", "#largeModal");
});
function RefreshWarehouse() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetWarehouseList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                ResWarehouse = JSON.parse(res);
                $("#sel_Warehouse").dxSelectBox({
                    items: ResWarehouse,
                    placeholder: "Select source warehouse",
                    displayExpr: "Warehouse",
                    valueExpr: "Warehouse",
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        RefreshBin(data.value);
                    }
                });
                $("#sel_DestinationWarehouse").dxSelectBox({
                    items: ResWarehouse,
                    placeholder: "Select destination warehouse",
                    displayExpr: "Warehouse",
                    valueExpr: "Warehouse",
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        var x = $("#sel_Bin").dxSelectBox("instance");
                        if (x.option('value') == null || x.option('value') == "") {
                            $("#sel_DestinationBin").dxSelectBox({
                                items: []
                            });
                        } else {
                            RefreshDestinationBin(data.value, x.option('value'));
                        }

                    }
                });

            }
        });
    } catch (e) {
        alert(e);
    }

}

function RefreshBin(value) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                ResBin = JSON.parse(res);

                $("#sel_Bin").dxSelectBox({
                    items: ResBin,
                    placeholder: "Select source warehouse-bin",
                    displayExpr: "Bin",
                    valueExpr: "WarehouseID",
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        //RefreshBins(data.value);
                        $.ajax({
                            type: "POST",
                            url: "WebServiceItemTransferBetweenWarehouses.asmx/WarehouseStockData",
                            data: '{WarehouseID:' + JSON.stringify(data.value) + '}',
                            contentType: "application/json; charset=utf-8",
                            dataType: "text",
                            success: function (results) {
                                console.debug(results);
                                var res = results.replace(/\\/g, '');
                                res = res.replace(/"d":""/g, '');
                                res = res.replace(/""/g, '');
                                res = res.substr(1);
                                res = res.slice(0, -1);
                                ResStock = JSON.parse(res);
                                $("#GridWarehouseStock").dxDataGrid({
                                    dataSource: ResStock
                                });
                            }
                        });
                        $("#sel_DestinationWarehouse").dxSelectBox({
                            value: null,
                        });
                    }

                });
            }
        });
    } catch (e) {
        alert(e);
    }

}

function RefreshDestinationBin(value, sourcebinid) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemTransferBetweenWarehouses.asmx/GetDestinationBinsList",
            data: '{warehousename:' + JSON.stringify(value) + ',sourcebinid:' + JSON.stringify(sourcebinid) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                ResDestBin = JSON.parse(res);

                $("#sel_DestinationBin").dxSelectBox({
                    items: ResDestBin,
                    placeholder: "Select destination warehouse-bin",
                    displayExpr: "Bin",
                    valueExpr: "WarehouseID",
                    searchEnabled: true,
                    showClearButton: true,
                });
            }
        });
    } catch (e) {
        alert(e);
    }

}

RefreshVouchersList();
RefreshStockGrid();
RefreshTransferStockGrid([]);

function RefreshVouchersList() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemTransferBetweenWarehouses.asmx/GetCreatedVouchersList",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                Resvouchers = JSON.parse(res);
                $("#gridvoucherslist").dxDataGrid({
                    dataSource: Resvouchers,
                });
            }
        });
    } catch (e) {
        alert(e);
    }

    $("#gridvoucherslist").dxDataGrid({
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
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: true },
        headerFilter: { visible: true },
        //rowAlternationEnabled: true,
        searchPanel: { visible: true },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: true,
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
            { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
            { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
            { dataField: "DestinationWarehouseID", visible: false, caption: "DestinationWarehouseID", width: 120 },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Voucher No.", width: 80 },
            { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 120 },
            { dataField: "VoucherDate", visible: true, caption: "Voucher Date", width: 120 },
            { dataField: "TotalTransferItems", visible: true, caption: "Transferred Items", width: 120 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Item Sub Group", width: 100 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
            { dataField: "ItemDescription", visible: false, caption: "Item Desc.", width: 200 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
            { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 100 },
            { dataField: "BatchStock", visible: false, caption: "BatchStock", width: 120 },
            { dataField: "TransferStock", visible: true, caption: "Transferred Qty", width: 120 },
            { dataField: "Warehouse", visible: true, caption: "Source Warehouse", width: 120 },
            { dataField: "Bin", visible: true, caption: "Source Bin", width: 120 },
            { dataField: "DestinationWarehouse", visible: true, caption: "Destination Warehouse", width: 120 },
            { dataField: "DestinationBin", visible: true, caption: "Destination Bin", width: 120 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 120 },
            { dataField: "Narration", visible: true, caption: "Narration", width: 200 },
            { dataField: "DeliveryNoteNo", visible: false, caption: "DeliveryNoteNo", width: 120 },
            { dataField: "DeliveryNoteDate", visible: false, caption: "DeliveryNoteDate", width: 120 },
        ],

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
            vsselectedrow = "";
            vsselectedrow = selectedItems.selectedRowsData[0];
            var MakeObj = [];
            if (vsselectedrow != "" && vsselectedrow != undefined && vsselectedrow != null) {
                MakeObj.push(vsselectedrow);
                document.getElementById("TxtTransactionID").value = MakeObj[0].TransactionID;
                TransactionID = Number(document.getElementById("TxtTransactionID").value);
            }
        }

    });
}



function RefreshStockGrid() {
    $("#GridWarehouseStock").dxDataGrid({
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
            fileName: "Warehouse Stock",
            allowExportSelectedData: true,
        },
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID" },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
            { dataField: "ItemGroupName", visible: false, caption: "ItemGroupName", width: 120 },
            { dataField: "ItemSubGroupName", visible: false, caption: "ItemSubGroupName", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 120 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 400 },
            { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 120 },
            { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 120 },
            { dataField: "TransferStock", visible: false, caption: "Transfer Stock", width: 120 },
            { dataField: "GRNNo", visible: false, caption: "Receipt No.", width: 120 },
            { dataField: "GRNDate", visible: false, caption: "Receipt Date", width: 120 },
            { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 200 },
            { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 120 },
            { dataField: "Bin", visible: true, caption: "Bin", width: 120 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
            {
                dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 120,
                cellTemplate: function (container, options) {
                    $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
                }
            }
        ],
        height: function () {
            return window.innerHeight / 3;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Add") {
                try {
                    //if (clickedCell.data.OrderQuantity <= 0 || !clickedCell.data.OrderQuantity) {
                    //    DevExpress.ui.notify("Please enter order quantity first..!", "warning", 1200);
                    //    clickedCell.component.cellValue(clickedCell.row.rowIndex, "OrderQuantity", "");
                    //    return false;
                    //}
                    var dataGrid = $('#GridTransferStock').dxDataGrid('instance');
                    var result = $.grep(dataGrid._options.dataSource, function (e) { return (e.ParentTransactionID === clickedCell.data.ParentTransactionID && e.ItemID === clickedCell.data.ItemID && e.BatchNo === clickedCell.data.BatchNo); });
                    if (result.length === 1) {
                        // data found
                        DevExpress.ui.notify("Item with same batch stock is already added..!", "error", 500);
                        return false;
                    }
                    var clonedItem = $.extend({}, clickedCell.data);
                    dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                    dataGrid.refresh(true);

                    //dataGrid._events.preventDefault();
                    DevExpress.ui.notify("Item added..!", "success", 500);
                    clickedCell.component.clearFilter();
                    $("#sel_Warehouse").dxSelectBox({
                        disabled: true
                    });
                    $("#sel_Bin").dxSelectBox({
                        disabled: true
                    });
                } catch (e) {
                    console.log(e);
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
        }
    });
}

function RefreshTransferStockGrid(tt) {
    $("#GridTransferStock").dxDataGrid({
        dataSource: tt,
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
        filterRow: { visible: false, applyFilter: "auto" },
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
            allowExportSelectedData: true,
        },
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowDeleting: true
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID" },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
            { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID" },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
            { dataField: "ItemGroupName", visible: false, caption: "ItemGroupName", width: 120 },
            { dataField: "ItemSubGroupName", visible: false, caption: "ItemSubGroupName", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 120 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 400 },
            { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 120 },
            { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 120 },
            { dataField: "TransferStock", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Transfer Qty", width: 80 },
            { dataField: "GRNNo", visible: false, caption: "Receipt No.", width: 120 },
            { dataField: "GRNDate", visible: false, caption: "Receipt Date", width: 120 },
            { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 120 },
            { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 120 },
            { dataField: "Bin", visible: true, caption: "Bin", width: 120 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 }
        ],
        height: function () {
            return window.innerHeight / 3.5;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "TransferStock") {// || e.column.dataField === "BatchNo"
                e.cancel = false;
            } else {
                e.cancel = true;
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
        onRowUpdated: function (e) {
            if (e.data.TransferStock <= 0) {
                e.data.TransferStock = e.key.BatchStock;
            } else if (e.data.TransferStock > e.key.BatchStock) {
                e.key.TransferStock = e.key.BatchStock;
            }
        },
        onRowRemoved: function (e) {
            var x = $("#GridTransferStock").dxDataGrid('instance');
            if (x.totalCount() <= 0) {
                $("#sel_Warehouse").dxSelectBox({
                    disabled: false
                });
                $("#sel_Bin").dxSelectBox({
                    disabled: false
                });
            }
        }
    });
}

function CreateVoucherNo() {
    var prefix = "PREQ";
    $.ajax({
        type: "POST",
        url: "WebServiceItemTransferBetweenWarehouses.asmx/CreateVoucherNo",
        data: '{prefix:' + JSON.stringify(voucherPrefix) + '}',
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
            if (res != "fail") {
                document.getElementById("TxtVoucherNo").value = res;
            }

        },
    });
}

$("#BtnSave").click(function () {
    var dataGrid = $("#GridTransferStock").dxDataGrid('instance');
    if (dataGrid.totalCount() <= 0) {
        DevExpress.ui.notify("Please add any item to transfer stock to another warehouse-bin !", "warning", 1200);
        return;
    } else {
        for (var i = 0; i < dataGrid.totalCount(); i++) {
            if (Number(dataGrid._options.dataSource[i].TransferStock) <= 0) {
                DevExpress.ui.notify("Please enter valid transfer qty !", "warning", 1200);
                return;
            }
        }
    }
    var sourcebinid;
    sourcebinid = $("#sel_Bin").dxSelectBox('instance').option('value');
    if (sourcebinid == null || sourcebinid == 0) {
        DevExpress.ui.notify("Please select valid source warehouse-bin !", "warning", 1200);
        return;
    }
    var destinationbinid;
    destinationbinid = $("#sel_DestinationBin").dxSelectBox('instance').option('value');
    if (destinationbinid == null || destinationbinid == 0) {
        DevExpress.ui.notify("Please select valid destination warehouse-bin !", "warning", 1200);
        return;
    }

    var voucherid = -22;
    var voucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
    var slipDate = $('#DtPickerDnDate').dxDateBox('instance').option('value');
    //var totalreceiptqty = $.receiptBatchDetail.Sum({ ChallanQuantity });
    var totalreceiptqty = 0;
    var slipNo = document.getElementById("TxtDnNo").value.trim();
    var textNarration = document.getElementById("TxtNarration").value.trim();

    try {

        var jsonObjectsTransactionMain = [];
        var TransactionMainRecord = {};

        TransactionMainRecord.VoucherID = -22;
        TransactionMainRecord.VoucherDate = voucherDate;
        TransactionMainRecord.SourceWarehouseID = sourcebinid;
        TransactionMainRecord.DestinationWarehouseID = destinationbinid;
        TransactionMainRecord.TotalQuantity = totalreceiptqty;
        TransactionMainRecord.Particular = "Transfer Between Warehouse";
        TransactionMainRecord.DeliveryNoteNo = slipNo;
        TransactionMainRecord.DeliveryNoteDate = slipDate;
        TransactionMainRecord.Narration = textNarration;

        jsonObjectsTransactionMain.push(TransactionMainRecord);

        var jsonObjectsIssueTransactionDetail = [];
        var TransactionIssueDetailRecord = {};
        for (var e = 0; e < dataGrid.totalCount(); e++) {
            TransactionIssueDetailRecord = {};

            TransactionIssueDetailRecord.TransID = e + 1;
            TransactionIssueDetailRecord.ParentTransactionID = Number(dataGrid._options.dataSource[e].ParentTransactionID);
            TransactionIssueDetailRecord.ItemGroupID = Number(dataGrid._options.dataSource[e].ItemGroupID);
            TransactionIssueDetailRecord.ItemID = Number(dataGrid._options.dataSource[e].ItemID);
            TransactionIssueDetailRecord.IssueQuantity = Number(dataGrid._options.dataSource[e].TransferStock);
            TransactionIssueDetailRecord.ReceiptQuantity = 0;
            TransactionIssueDetailRecord.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            TransactionIssueDetailRecord.StockUnit = dataGrid._options.dataSource[e].StockUnit;
            TransactionIssueDetailRecord.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;

            jsonObjectsIssueTransactionDetail.push(TransactionIssueDetailRecord);
        }

        var jsonObjectsReceiptTransactionDetail = [];
        var TransactionReceiptDetailRecord = {};
        for (var e = 0; e < dataGrid.totalCount(); e++) {
            TransactionReceiptDetailRecord = {};

            TransactionReceiptDetailRecord.TransID = e + 1;
            TransactionReceiptDetailRecord.ParentTransactionID = Number(dataGrid._options.dataSource[e].ParentTransactionID);
            TransactionReceiptDetailRecord.ItemGroupID = Number(dataGrid._options.dataSource[e].ItemGroupID);
            TransactionReceiptDetailRecord.ItemID = Number(dataGrid._options.dataSource[e].ItemID);
            TransactionReceiptDetailRecord.ReceiptQuantity = Number(dataGrid._options.dataSource[e].TransferStock);
            TransactionReceiptDetailRecord.IssueQuantity = 0;
            TransactionReceiptDetailRecord.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            TransactionReceiptDetailRecord.StockUnit = dataGrid._options.dataSource[e].StockUnit;
            TransactionReceiptDetailRecord.WarehouseID = destinationbinid;

            jsonObjectsReceiptTransactionDetail.push(TransactionReceiptDetailRecord);
        }

        jsonObjectsTransactionMain = JSON.stringify(jsonObjectsTransactionMain);
        jsonObjectsIssueTransactionDetail = JSON.stringify(jsonObjectsIssueTransactionDetail);
        jsonObjectsReceiptTransactionDetail = JSON.stringify(jsonObjectsReceiptTransactionDetail);

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
                if (FlagEdit == false) {
                    document.getElementById("LOADER").style.display = "block";
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServiceItemTransferBetweenWarehouses.asmx/SaveStockTransferWarehouseVoucher",
                            data: '{prefix:' + JSON.stringify(voucherPrefix) + ',voucherid:' + JSON.stringify(voucherid) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsIssueTransactionDetail:' + jsonObjectsIssueTransactionDetail + ',jsonObjectsReceiptTransactionDetail:' + jsonObjectsReceiptTransactionDetail + '}',
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

                                document.getElementById("LOADER").style.display = "none";

                                if (res == "Success") {
                                    swal("Saved!", "Your data saved", "success");
                                    location.reload();
                                }
                                else {
                                    swal("Warning...!", res, "warning");
                                }

                            },
                            error: function errorFunc(jqXHR) {
                                document.getElementById("LOADER").style.display = "none";
                                //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                swal("Error!", "Please try after some time..", "");
                                alert(jqXHR);
                            }
                        });
                    } catch (e) {
                        alert(e);
                    }
                } else {
                    document.getElementById("LOADER").style.display = "block";
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServiceItemTransferBetweenWarehouses.asmx/UpdateStockTransferWarehouseVoucher",
                            data: '{TransactionID:' + JSON.stringify(TransactionID) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsIssueTransactionDetail:' + jsonObjectsIssueTransactionDetail + ',jsonObjectsReceiptTransactionDetail:' + jsonObjectsReceiptTransactionDetail + '}',
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
                                if (res == "Success") {
                                    swal("Updated!", "Your data Updated", "success");
                                    location.reload();
                                }
                                else {
                                    swal("Warning...!", res, "warning");
                                }

                            },
                            error: function errorFunc(jqXHR) {
                                document.getElementById("LOADER").style.display = "none";
                                swal("Error!", "Please try after some time..", "");
                            }
                        });
                    } catch (e) {
                        alert(e);
                    }
                }

            });
    } catch (e) {
        alert(e);
    }
});

$("#BtnDelete").click(function () {

    if (FlagEdit == false) {
        DevExpress.ui.notify("You can't delete this voucher in saving mode !", "warning", 1200);
        return;
    }

    if (TransactionID <= 0) {
        DevExpress.ui.notify("Invalid voucher to delete !", "warning", 1200);
        return;
    }

    if (TransactionID == "" || TransactionID == null || TransactionID == undefined || TransactionID==0) {
        DevExpress.ui.notify("Invalid voucher to delete !", "warning", 1200);
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
                url: "WebServiceItemTransferBetweenWarehouses.asmx/DeleteTransferVoucher",
                data: '{TransactionID:' + JSON.stringify(TransactionID) + '}',
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
                    if (res == "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert("d");
                    alert(jqXHR);
                }
            });

        });

});