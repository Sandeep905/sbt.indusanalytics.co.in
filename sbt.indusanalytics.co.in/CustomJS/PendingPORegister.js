
var d = new Date();
var dd = d.getDate();
var mm = d.getMonth() + 1;
var yyyy = d.getFullYear();
var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var customDatestring = dd + " " + months_String[mm - 2] + " " + yyyy;

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 310,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

//$("#FromDate").dxDateBox({
//    pickerType: "rollers",
//    value: customDatestring,//new Date().toISOString().substr(0, 10),
//    displayFormat: 'dd-MMM-yyyy'
//});

//$("#ToDate").dxDateBox({
//    pickerType: "rollers",
//    value: new Date().toISOString().substr(0, 10),
//    displayFormat: 'dd-MMM-yyyy'
//});

//var FromDate = $("#FromDate").dxDateBox('instance').option('value');
//var ToDate = $("#ToDate").dxDateBox('instance').option('value');
$("#PendingPORegisterGrid").dxDataGrid({
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
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: true },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Pending PO Register",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    columns: [
        { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 100 },
        { dataField: "VoucherDate", visible: true, caption: "Voucher Date", width: 100 },
        { dataField: "LedgerName", visible: true, caption: "Ledger Name", width: 100 },
        { dataField: "PurchaseDivision", visible: true, caption: "Purchase Division", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 150 },
        { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 100 },
        { dataField: "PurchaseOrderQuantity", visible: true, caption: "PO Quantity", width: 120 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "POQtyStockUnit", visible: true, caption: "PO Qty Stock Unit", width: 120 },
        { dataField: "ExpectedDeliveryDate", visible: true, caption: "Expected Delivery Date", width: 120 },
        { dataField: "ReceiptQtyStockUnit", visible: true, caption: "Receipt Qty Stock Unit", width: 120 },
        { dataField: "ReceiptQtyPurchaseUnit", visible: true, caption: "Receipt Qty Purchase Unit", width: 120 },
        { dataField: "BalanceQtyPurchaseUnit", visible: true, caption: "Balance Qty Purchase Unit", width: 120 },
        { dataField: "BalanceQtyStockUnit", visible: true, caption: "Balance Qty Stock Unit", width: 120 },
        { dataField: "BalancePOValue", visible: true, caption: "Balance PO Value", width: 120 },
        { dataField: "PurchaseReferenceRemark", visible: true, caption: "Purchase Reference Remark", width: 150 },
        { dataField: "Narration", visible: true, caption: "Narration", width: 150 }
    ],
    summary: {
        totalItems: [{
            column: "PurchaseOrderQuantity",
            summaryType: "sum"
        }, {
            column: "POQtyStockUnit",
            summaryType: "sum"
        }, {
            column: "ReceiptQtyStockUnit",
            summaryType: "sum"
        }, {
            column: "BalanceQtyPurchaseUnit",
            summaryType: "sum"
        }, {
            column: "BalanceQtyStockUnit",
            summaryType: "sum"
        }, {
            column: "BalancePOValue",
            summaryType: "sum"
        }]
    }
});

showMore();
function showMore() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    //var FromDate = $("#FromDate").dxDateBox('instance').option('value');
    //var ToDate = $("#ToDate").dxDateBox('instance').option('value');

    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/GetWholeDataPendingPORegisterGrid",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = GetJsonConvertedObject(results);
            $("#PendingPORegisterGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
}

$("#BtnSearch").click(function () {
    showMore();
});