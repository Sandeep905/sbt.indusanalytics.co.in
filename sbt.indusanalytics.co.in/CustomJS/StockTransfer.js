"use strict";
var Gblprefix = "STDC";
var GblVoucherNo = "";
var GblWarehouseID = 0;
var GblTransactionID = 0;
var ObjProductHSNGrp = [];
var ObjPendingSelectedData = [];
var FlagEdit = false;
var ResWarehouse = [];

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading ...",
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#DtVoucherDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date()
});

$("#DtEWayBillDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#DtEWayBillDate1").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#FromDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date()
});

$("#ToDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date()
});

//$("#selDestinationWarehouse").dxSelectBox({
//    items: [],
//    placeholder: "Select--",
//    displayExpr: 'Warehouse',
//    valueExpr: 'Warehouse',
//    searchEnabled: true,
//    showClearButton: true,
//    onValueChanged: function (e) {
//        $.ajax({
//            type: "POST",
//            url: "WebService_ReturnToStock.asmx/GetBinsList",
//            data: '{warehousename:' + JSON.stringify(e.value) + '}',
//            contentType: "application/json; charset=utf-8",
//            dataType: 'text',
//            success: function (results) {
//                var res = results.replace(/\\/g, '');
//                res = res.replace(/"d":/g, '');
//                res = res.replace(/""/g, '');
//                res = res.substr(1);
//                res = res.slice(0, -1);
//                var RES1 = JSON.parse(res.toString());
//                $("#selDestinationBin").dxSelectBox({ items: RES1 });
//            }
//        });
//    }
//});

//$("#selDestinationBin").dxSelectBox({
//    items: [],
//    placeholder: "Select--",
//    displayExpr: 'Bin',
//    valueExpr: 'WarehouseID',
//    searchEnabled: true,
//    showClearButton: true
//});

$("#SelClientName").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value) {
            GetConsignee(e.value);
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.LedgerID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtDeliveryAddress").value = result[0].City;
                document.getElementById("TxtClientLegalName").value = result[0].LegalName;
            }
        }
    }
});

$("#SelConsigneeName").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    searchEnabled: true,
    displayExpr: 'MailingName',
    valueExpr: 'ConsigneeID',
    onValueChanged: function (e) {
        if (e.value) {
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.ConsigneeID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtConsigneeLegalName").value = result[0].LegalName;
            }
        }
    }
});

$("#SelTransporter").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'TransporterName',
    valueExpr: 'TransporterID',
    searchEnabled: true
});

$("#SelSenderName").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'SenderName',
    valueExpr: 'DealerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value) {
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.DealerID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtSenderLegalName").value = result[0].LegalName;
            }
        }
    }
});

var priorities = ["Pending", "Processed"];
$("#RadioButtonPO").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        if (e.value === "Pending") {
            $("#GridProcess").addClass("hidden");
            $("#GridPending").removeClass("hidden");
            $("#DivCretbtn").removeClass("hidden");
            $("#DivEdit").addClass("hidden");
            FlagEdit = false;
        }
        else if (e.value === "Processed") {
            $("#GridPending").addClass("hidden");
            $("#GridProcess").removeClass("hidden");
            $("#DivEdit").removeClass("hidden");
            $("#DivCretbtn").addClass("hidden");
            FlagEdit = true;
        }
        onRadioGroupChanged();
    }
});

$("#GridPending").dxDataGrid({
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
    paging: { enabled: true },
    selection: { mode: "multiple", allowSelectAll: false },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: false,
        fileName: "Pending Transfer Data",
        allowExportSelectedData: true
    },
    columns: [
        { dataField: "VoucherNo", caption: "Voucher No", width: 120 },
        { dataField: "VoucherDate", caption: "Voucher Date", width: 120 },
        { dataField: "TotalTransferItems", caption: "Transferred Items", width: 120 },
        { dataField: "ItemGroupName", caption: "Group Name", width: 120 },
        { dataField: "ItemSubGroupName", caption: "Sub Group Name", width: 120 },
        { dataField: "ItemCode", caption: "Item Code", width: 120 },
        { dataField: "ItemName", caption: "Item Name", width: 200 },
        { dataField: "StockUnit", caption: "Stock Unit", width: 120 },
        { dataField: "TransferStock", caption: "Stock Qty", width: 80 },
        { dataField: "GRNNo", visible: false, caption: "Receipt No.", width: 120 },
        { dataField: "GRNDate", visible: false, caption: "Receipt Date", width: 120 },
        { dataField: "BatchNo", caption: "Batch No.", width: 120 },
        { dataField: "DestinationWarehouse", caption: "Destination Warehouse", width: 120 },
        { dataField: "DestinationBin", caption: "Destination Bin", width: 120 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 }
    ],
    height: function () {
        return window.innerHeight / 1.2;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clickedIndentCell) {
        if (clickedIndentCell.currentSelectedRowKeys.length > 0) {
            if (GblWarehouseID === 0) {
                GblWarehouseID = clickedIndentCell.currentSelectedRowKeys[0].DestinationWarehouseID;
            }
            else if (GblWarehouseID !== clickedIndentCell.currentSelectedRowKeys[0].DestinationWarehouseID) {
                clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                DevExpress.ui.notify("Please select records which have same warehouse..!", "warning", 2000);
                clickedIndentCell.currentSelectedRowKeys = [];
                return false;
            }
        }
        if (clickedIndentCell.selectedRowsData.length <= 0) GblWarehouseID = 0;
        ObjPendingSelectedData = clickedIndentCell.selectedRowsData;
    }
});

$("#GridProcess").dxDataGrid({
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
    paging: { enabled: true },
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: false },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: false,
        fileName: "Processed Transfer Data",
        allowExportSelectedData: true
    },
    columns: [
        { dataField: "VoucherNo", caption: "Voucher No", width: 110 },
        { dataField: "VoucherDate", caption: "Voucher Date", width: 100 },
        { dataField: "SenderName", caption: "Sender Name", width: 120 },
        { dataField: "LedgerName", caption: "Receiver Name", width: 120 },
        { dataField: "ItemGroupName", caption: "Group Name", width: 100 },
        { dataField: "ItemSubGroupName", caption: "Sub Group Name", width: 120 },
        { dataField: "ItemCode", caption: "Item Code", width: 80 },
        { dataField: "ItemName", caption: "Item Name", width: 200 },
        { dataField: "StockUnit", caption: "Stock Unit", width: 90 },
        { dataField: "BatchStock", caption: "Batch Stock", width: 90 },
        { dataField: "TransferStock", caption: "Transfer Qty", width: 80 },
        { dataField: "GRNNo", visible: false, caption: "Receipt No.", width: 120 },
        { dataField: "GRNDate", visible: false, caption: "Receipt Date", width: 120 },
        { dataField: "BatchNo", caption: "Batch No." },
        { dataField: "DestinationBin", caption: "Destination Bin", width: 120 },
        { dataField: "EWayBillNumber", caption: "E-Way Number" },
        { dataField: "EWayBillDate", caption: "E-Way Date" },
        { dataField: "TransporterName", caption: "Transporter" },
        { dataField: "WorkOrderNarration", caption: "No Of Packings" },
        { dataField: "Narration", caption: "Remarks" },
        { dataField: "CreatedBy", caption: "Created By", width: 100 }
    ],
    height: function () {
        return window.innerHeight / 1.2;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clickedIndentCell) {
        if (clickedIndentCell.selectedRowsData.length === 0) {
            GblTransactionID = 0;
            document.getElementById("TxtEWayBillNumber").value = "";
            return;
        }
        GblTransactionID = clickedIndentCell.selectedRowsData[0].TransactionID;
        document.getElementById("TxtEWayBillNumber").value = clickedIndentCell.selectedRowsData[0].EWayBillNumber;
    }
});

///Product HSN Group
$.ajax({
    type: "POST",
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetProductHSNGroups",
    data: '{Category:"Raw Material"}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjProductHSNGrp = JSON.parse(res);
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

///Warehouse
$.ajax({
    type: "POST",
    async: false,
    url: "WebServicePurchaseGRN.asmx/GetWarehouseList",
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
        ResWarehouse = JSON.parse(res);

        //$("#selDestinationWarehouse").dxSelectBox({ items: ResWarehouse });
    }
});

$("#CreateDetailsGrid").dxDataGrid({
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
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    paging: { enabled: true },
    columns: [
        { dataField: "VoucherNo", allowEditing: false, caption: "Voucher No", width: 110 },
        { dataField: "VoucherDate", allowEditing: false, caption: "Voucher Date", width: 100 },
        { dataField: "ItemGroupName", allowEditing: false, caption: "Group Name", width: 120 },
        { dataField: "ItemSubGroupName", allowEditing: false, caption: "Sub Group Name", width: 120 },
        { dataField: "ItemCode", allowEditing: false, caption: "Item Code", width: 90 },
        { dataField: "ItemName", allowEditing: false, caption: "Item Name", width: 200 },
        { dataField: "StockUnit", allowEditing: false, caption: "Stock Unit", width: 80 },
        { dataField: "TransferStock", allowEditing: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Transfer Qty", width: 80 },
        { dataField: "PurchaseRate", allowEditing: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Rate", width: 100 },
        {
            dataField: "ProductHSNID", caption: "Group Name", width: 150, validationRules: [{ type: "required" }],
            lookup: { dataSource: ObjProductHSNGrp, valueExpr: 'ProductHSNID', displayExpr: 'ProductHSNName' },
            setCellValue: function (rowData, value) {
                rowData.ProductHSNID = value;
                var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === value; });
                if (result.length === 1) {
                    rowData.HSNCode = result[0].HSNCode;
                }
            }
        },
        { dataField: "HSNCode", allowEditing: false, caption: "HSN Code", width: 100 },
        { dataField: "BatchNo", allowEditing: false, caption: "Batch No.", width: 120 },
        {
            dataField: "DestinationWarehouse", allowEditing: true, caption: "Destination Warehouse", width: 120, validationRules: [{ type: "required" }],
            lookup: { dataSource: ResWarehouse, valueExpr: 'Warehouse', displayExpr: 'Warehouse' },
            setCellValue: function (rowData, value) {
                rowData.DestinationWarehouse = value;
                refreshBinList(value);
            }
        },
        {
            dataField: "DestinationWarehouseID", allowEditing: true, caption: "Des. Bin", width: 100, validationRules: [{ type: "required" }],
            lookup: { dataSource: [], valueExpr: 'DestinationWarehouseID', displayExpr: 'DestinationBin' }
        }
    ],
    height: function () {
        return window.innerHeight / 2.3;
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
        if (Number(e.data.TransferStock) > Number(e.data.BatchStock) || Number(e.data.TransferStock) < 0) e.data.TransferStock = e.data.BatchStock;
        if (Number(e.data.PurchaseRate) < 0) e.data.PurchaseRate = 0;
    }
});

///Clients
$.ajax({
    type: "POST",
    url: "WebService_InvoiceEntry.asmx/GetClientData",
    data: '{}',//
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());
        $("#SelClientName").dxSelectBox({ dataSource: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

//Transporter
$.ajax({
    type: "POST",
    url: "WebService_ChallanDetail.asmx/GetTransporterData",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var items = JSON.parse(res);

        $("#SelTransporter").dxSelectBox({
            dataSource: items
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

///Senders
$.ajax({
    type: "POST",
    url: "WebServiceItemTransferBetweenWarehouses.asmx/GetSenderData",
    data: '{}',//
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());
        $("#SelSenderName").dxSelectBox({ dataSource: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

CreateVoucherNo();
function CreateVoucherNo() {
    $.ajax({
        type: "POST",
        url: "WebServiceItemTransferBetweenWarehouses.asmx/CreateStockTransferNo",
        data: '{prefix:' + JSON.stringify(Gblprefix) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            GblVoucherNo = "";
            if (res !== "") {
                GblVoucherNo = res;
                document.getElementById("TxtVoucherNo").value = GblVoucherNo;
            }
        }
    });
}

onRadioGroupChanged();
function onRadioGroupChanged() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var RadioValue = $('#RadioButtonPO').dxRadioGroup('instance').option('value');
    var FromDate = $('#FromDate').dxDateBox('instance').option('value');
    var ToDate = $('#ToDate').dxDateBox('instance').option('value');

    $.ajax({
        type: "POST",
        url: "WebServiceItemTransferBetweenWarehouses.asmx/PendingProcessStockData",
        data: '{Options:' + JSON.stringify(RadioValue) + ',FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var ValRES1 = JSON.parse(res.toString());

            if (RadioValue === "Pending") {
                $("#GridPending").dxDataGrid({ dataSource: ValRES1 });
            }
            else if (RadioValue === "Processed") {
                $("#GridProcess").dxDataGrid({ dataSource: ValRES1 });
            }
        }
    });
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
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var ResDestBin = JSON.parse(res);
                $("#sel_DestinationBin").dxSelectBox({ items: ResDestBin });
            }
        });
    } catch (e) {
        alert(e);
    }
}

function GetConsignee(CID) {
    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/GetConsigneeData",
        data: '{ClientID:' + CID + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#SelConsigneeName").dxSelectBox({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}

function refreshBinList(value) {
    $.ajax({
        type: "POST",
        url: "WebService_ReturnToStock.asmx/GetDestinationBinsList",
        data: '{warehousename:' + JSON.stringify(value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            var GridDetails = $("#CreateDetailsGrid").dxDataGrid('instance');
            var lookup = GridDetails.columnOption("DestinationWarehouseID", "lookup");
            lookup.dataSource = RES1;
            GridDetails.columnOption("DestinationWarehouseID", "lookup", lookup);
            GridDetails.repaint();
        }
    });
}

$("#BtnRefreshList").click(function () {
    onRadioGroupChanged();
});

$("#BtnCreate").click(function () {
    if (ObjPendingSelectedData.length === 0) {
        DevExpress.ui.notify("Please select record first..!", "warning", 1200);
        return false;
    }
    GblTransactionID = 0;
    document.getElementById("TxtVoucherNo").value = '';
    document.getElementById("TxtNarration").value = '';
    //$("#selDestinationWarehouse").dxSelectBox({ value: null });
    //$("#selDestinationBin").dxSelectBox({ items: [] });
    $("#SelSenderName").dxSelectBox({ value: null });

    $("#DtVoucherDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#CreateDetailsGrid").dxDataGrid({ dataSource: ObjPendingSelectedData });
    CreateVoucherNo();
    document.getElementById("BtnCreate").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreate").setAttribute("data-target", "#largeModalDetails");
});

$("#BtnSave").click(function () {
    var dataGrid = $("#CreateDetailsGrid").dxDataGrid('instance');
    var totalreceiptqty = 0, totalAmount = 0;
    if (dataGrid._options.dataSource.length <= 0) {
        DevExpress.ui.notify("Please add any item to transfer stock to another warehouse-bin..!", "warning", 1200);
        return;
    }

    //var destinationbinid = $("#selDestinationBin").dxSelectBox('instance').option('value');
    //if (destinationbinid === null || destinationbinid === 0) {
    //    DevExpress.ui.notify("Please select valid destination warehouse-bin !", "warning", 1200);
    //    return;
    //}

    var ClientId = $("#SelClientName").dxSelectBox('instance').option('value');
    if (ClientId === null || ClientId === 0) {
        DevExpress.ui.notify("Please select receiver first..!", "warning", 1200);
        return;
    }
    var ConsigneeId = $("#SelConsigneeName").dxSelectBox('instance').option('value');
    if (ConsigneeId === null || ConsigneeId === 0) {
        DevExpress.ui.notify("Please select consignee first..!", "warning", 1200);
        return;
    }
    if (DealerID === null || DealerID === 0) {
        DevExpress.ui.notify("Please select sender first..!", "warning", 1200);
        return;
    }

    for (var i = 0; i < dataGrid._options.dataSource.length; i++) {
        if (Number(dataGrid._options.dataSource[i].TransferStock) <= 0) {
            DevExpress.ui.notify("Please enter valid transfer qty..!", "warning", 1200);
            return;
        } else if (Number(dataGrid._options.dataSource[i].DestinationWarehouseID) <= 0 || dataGrid._options.dataSource[i].DestinationWarehouse === "") {
            DevExpress.ui.notify("Please select valid destination warehouse or bin..!", "warning", 1200);
            return;
        } else if (Number(dataGrid._options.dataSource[i].ProductHSNID) <= 0) {
            DevExpress.ui.notify("Please select valid group name..!", "warning", 1200);
            return;
        } else {
            totalreceiptqty = totalreceiptqty + Number(dataGrid._options.dataSource[i].TransferStock);
        }
    }

    var voucherid = -20;
    var voucherDate = $('#DtVoucherDate').dxDateBox('instance').option('value');
    var DtEWayBillDate = $('#DtEWayBillDate').dxDateBox('instance').option('value');
    var TxtEWayBillNo = document.getElementById("TxtEWayBillNo").value.trim();
    var textNarration = document.getElementById("TxtNarration").value.trim();
    var textDeliveryAddress = document.getElementById("TxtDeliveryAddress").value.trim();
    var VehicleNo = document.getElementById("TxtVehicleNo").value.trim();
    var TransporterID = $("#SelTransporter").dxSelectBox('instance').option('value');
    var NoOfPackages = document.getElementById("TxtTotalPackets").value.trim();
    var JobReference = document.getElementById("TxtDocumentNo").value.trim();
    var DealerID = $("#SelSenderName").dxSelectBox('instance').option('value');

    try {

        var jsonObjectsTransactionMain = [];
        var TransactionMainRecord = {};

        TransactionMainRecord.VoucherID = voucherid;
        TransactionMainRecord.VoucherDate = voucherDate;
        TransactionMainRecord.SourceWarehouseID = dataGrid._options.dataSource[0].WarehouseID;
        //TransactionMainRecord.DestinationWarehouseID = destinationbinid;
        TransactionMainRecord.LedgerID = ClientId; //Receiver ID
        TransactionMainRecord.ContactPersonID = ConsigneeId;
        TransactionMainRecord.TotalQuantity = totalreceiptqty;
        TransactionMainRecord.Particular = "Stock Transfer";
        TransactionMainRecord.EWayBillNumber = TxtEWayBillNo;
        TransactionMainRecord.EWayBillDate = DtEWayBillDate;
        TransactionMainRecord.Narration = textNarration;
        TransactionMainRecord.LRNoVehicleNo = VehicleNo;
        TransactionMainRecord.Transporter = TransporterID;
        TransactionMainRecord.WorkOrderNarration = NoOfPackages;
        TransactionMainRecord.JobReference = JobReference;
        TransactionMainRecord.DealerID = DealerID; //Sender ID
        TransactionMainRecord.DeliveryAddress = textDeliveryAddress;

        var jsonObjectsIssueTransactionDetail = [];
        var TransactionIssueDetailRecord = {};
        for (var e = 0; e < dataGrid.totalCount(); e++) {
            TransactionIssueDetailRecord = {};

            TransactionIssueDetailRecord.TransID = e + 1;
            TransactionIssueDetailRecord.ParentTransactionID = Number(dataGrid._options.dataSource[e].ParentTransactionID);
            TransactionIssueDetailRecord.ItemGroupID = Number(dataGrid._options.dataSource[e].ItemGroupID);
            TransactionIssueDetailRecord.ItemID = Number(dataGrid._options.dataSource[e].ItemID);
            TransactionIssueDetailRecord.IssueQuantity = Number(dataGrid._options.dataSource[e].TransferStock);
            TransactionIssueDetailRecord.PurchaseRate = Number(dataGrid._options.dataSource[e].PurchaseRate);
            TransactionIssueDetailRecord.NetAmount = Number(TransactionIssueDetailRecord.PurchaseRate) * Number(TransactionIssueDetailRecord.IssueQuantity);
            TransactionIssueDetailRecord.ReceiptQuantity = 0;
            TransactionIssueDetailRecord.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            TransactionIssueDetailRecord.StockUnit = dataGrid._options.dataSource[e].StockUnit;
            TransactionIssueDetailRecord.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;
            TransactionIssueDetailRecord.ProductHSNID = dataGrid._options.dataSource[e].ProductHSNID;

            totalAmount = totalAmount + Number(TransactionIssueDetailRecord.NetAmount);
            jsonObjectsIssueTransactionDetail.push(TransactionIssueDetailRecord);
        }

        TransactionMainRecord.TotalBasicAmount = totalAmount;
        jsonObjectsTransactionMain.push(TransactionMainRecord);

        var jsonObjectsReceiptTransactionDetail = [];
        var TransactionReceiptDetailRecord = {};
        for (e = 0; e < dataGrid.totalCount(); e++) {
            TransactionReceiptDetailRecord = {};

            TransactionReceiptDetailRecord.TransID = e + 1;
            TransactionReceiptDetailRecord.ParentTransactionID = Number(dataGrid._options.dataSource[e].ParentTransactionID);
            TransactionReceiptDetailRecord.ItemGroupID = Number(dataGrid._options.dataSource[e].ItemGroupID);
            TransactionReceiptDetailRecord.ItemID = Number(dataGrid._options.dataSource[e].ItemID);
            TransactionReceiptDetailRecord.ReceiptQuantity = Number(dataGrid._options.dataSource[e].TransferStock);
            TransactionReceiptDetailRecord.PurchaseRate = Number(dataGrid._options.dataSource[e].PurchaseRate);
            TransactionReceiptDetailRecord.NetAmount = Number(TransactionReceiptDetailRecord.PurchaseRate) * Number(TransactionReceiptDetailRecord.ReceiptQuantity);
            TransactionReceiptDetailRecord.IssueQuantity = 0;
            TransactionReceiptDetailRecord.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            TransactionReceiptDetailRecord.StockUnit = dataGrid._options.dataSource[e].StockUnit;
            TransactionReceiptDetailRecord.DestinationWarehouseID = dataGrid._options.dataSource[e].DestinationWarehouseID;
            TransactionReceiptDetailRecord.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;
            TransactionReceiptDetailRecord.ProductHSNID = dataGrid._options.dataSource[e].ProductHSNID;
            TransactionReceiptDetailRecord.HSNCode = dataGrid._options.dataSource[e].HSNCode;

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
            closeOnConfirm: true
        },
            function () {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                if (FlagEdit === false) {
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServiceItemTransferBetweenWarehouses.asmx/SaveStockTransfer",
                            data: '{prefix:' + JSON.stringify(Gblprefix) + ',voucherid:' + JSON.stringify(voucherid) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsIssueTransactionDetail:' + jsonObjectsIssueTransactionDetail + ',jsonObjectsReceiptTransactionDetail:' + jsonObjectsReceiptTransactionDetail + '}',
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
                                    swal("Saved!", "Your data saved", "success");
                                    location.reload();
                                } else {
                                    swal("Not Saved..!", res, "warning");
                                }
                            },
                            error: function errorFunc(jqXHR) {
                                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                console.log(jqXHR);
                            }
                        });
                    } catch (e) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        console.log(e);
                    }
                } else {
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServiceItemTransferBetweenWarehouses.asmx/UpdateStockTransfer",
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

                                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                if (res === "Success") {
                                    document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                                    swal("Updated!", "Your data Updated", "success");
                                    location.reload();
                                } else {
                                    swal("Not Updated..!", res, "warning");
                                }
                            },
                            error: function errorFunc(jqXHR) {
                                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
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
    if (FlagEdit === false) {
        DevExpress.ui.notify("You can't delete this voucher in saving mode !", "warning", 1200);
        return false;
    }

    if (GblTransactionID === "" || GblTransactionID === null || GblTransactionID === undefined || GblTransactionID === 0) {
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
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebServiceItemTransferBetweenWarehouses.asmx/DeleteTransferVoucher",
                data: '{TransactionID:' + JSON.stringify(GblTransactionID) + '}',
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
                        swal("Deleted!", "Your data Deleted", "success");
                        location.reload();
                    } else {
                        swal("Not Deleted!", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnPrint").click(function () {
    if (GblTransactionID === 0) {
        DevExpress.ui.notify("Please select record first..!", "warning", 1200);
        return false;
    }
    var url = "ReportStockTransferDC.aspx?TransID=" + GblTransactionID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
});

$("#BtnUpdateEWay").click(function () {
    if (GblTransactionID === 0) {
        DevExpress.ui.notify("Please select record first..!", "warning", 1200);
        return false;
    }

    document.getElementById("BtnUpdateEWay").setAttribute("data-toggle", "modal");
    document.getElementById("BtnUpdateEWay").setAttribute("data-target", "#modalEwayDetails");
});

$("#BtnUpdateDetails").click(function () {
    if (GblTransactionID === 0) {
        DevExpress.ui.notify("Please select record first..!", "warning", 1200);
        return false;
    }
    var TxtEwayNo = document.getElementById("TxtEWayBillNumber").value.trim();
    var EwayDate = $('#DtEWayBillDate1').dxDateBox('instance').option('value');
    if (TxtEwayNo === "") {
        DevExpress.ui.notify("Please enter E-Way Number..!", "warning", 1200);
        document.getElementById("TxtEWayBillNumber").focus();
        return false;
    }
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServiceItemTransferBetweenWarehouses.asmx/UpdateStockTransferEWayDetails",
        data: '{TransactionID:' + JSON.stringify(GblTransactionID) + ',EwayDate:' + JSON.stringify(EwayDate) + ',EWayBillNumber:' + JSON.stringify(TxtEwayNo) + '}',
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
                swal("Updated!", "Your data updated", "success");
                onRadioGroupChanged();
            } else {
                swal("Not Updated!", res, "warning");
            }
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
});