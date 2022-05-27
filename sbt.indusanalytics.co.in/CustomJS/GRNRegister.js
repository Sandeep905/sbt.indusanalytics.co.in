
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

$("#FromDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});
$("#ToDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});

var FromDate = $("#FromDate").dxDateBox('instance').option('value');
var ToDate = $("#ToDate").dxDateBox('instance').option('value');
$("#GRNRegisterGrid").dxDataGrid({
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
        enabled: true,
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: true },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "GRN Register (" + FromDate + " To " + ToDate + " )",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    columns: [
        { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 150, groupIndex: 0 },
        { dataField: "VoucherDate", visible: true, caption: "Voucher Date", width: 100 },
        { dataField: "BillNo", visible: true, caption: "Bill No", width: 100 },
        { dataField: "BillDate", visible: true, caption: "Bill Date", width: 100 },
        { dataField: "PONO", visible: true, caption: "PO No", width: 100 },
        { dataField: "PODate", visible: true, caption: "PO Date", width: 100 },
        { dataField: "PurchaseDivision", visible: true, caption: "Division", width: 100 },
        { dataField: "LedgerCode", visible: true, caption: "Supplier Code", width: 200 },
        { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 100 },
        { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 100 },
        { dataField: "ProductHSNName", visible: true, caption: "HSN Name", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group Name", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 100 },
        { dataField: "PurchaseReferenceRemark", visible: true, caption: "PO Reference", width: 100 },
        { dataField: "PurchaseUnit", visible: true, caption: "PO Unit", width: 100 },
        { dataField: "PurchaseOrderQuantity", visible: true, caption: "PO Quantity", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "POQtyStockUnit", visible: true, caption: "PO Qty (S.U.)", width: 150 },
        { dataField: "ReceiptQuantityInStockUnit", visible: true, caption: "Receipt Qty (S.U.)", width: 150 },
        { dataField: "ReceiptQtyPurchaseUnit", visible: true, caption: "Receipt Qty (P.U.)", width: 100 },
        { dataField: "PurchaseRate", visible: true, caption: "Purchase Rate", width: 100 },
        { dataField: "ReceiptValue", visible: true, caption: "Receipt Value", width: 100 },
        { dataField: "FreightAmount", visible: true, caption: "Freight Amount", width: 100 },
        { dataField: "InsuranceAmount", visible: true, caption: "Insurance Amount", width: 100 },
        { dataField: "UnloadingAmount", visible: true, caption: "Unloading Amount", width: 100 },
        { dataField: "DealerCharges", visible: true, caption: "Dealer Charges", width: 100 },
        { dataField: "OtherChargesAmount", visible: true, caption: "Other Charges", width: 100 },
        { dataField: "Rate", visible: true, caption: "Landed Rate", width: 100 }
    ],
    summary: {
        totalItems: [{
            column: "PurchaseOrderQuantity",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "POQtyStockUnit",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "ReceiptQuantityInStockUnit",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "ReceiptQtyPurchaseUnit",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }, {
            column: "ReceiptValue",
            summaryType: "sum",
            displayFormat: "Total: {0}"
            }],
        //groupItems: [{
        //    column: "PurchaseOrderQuantity",
        //    summaryType: "sum",
        //    displayFormat: "Total: {0}",
        //    showInGroupFooter: true,
        //    alignByColumn: true
        //}, {
        //    column: "POQtyStockUnit",
        //    summaryType: "sum",
        //    displayFormat: "Total: {0}",
        //    showInGroupFooter: true,
        //    alignByColumn: true
        //}, {
        //    column: "ReceiptQuantityInStockUnit",
        //    summaryType: "sum",
        //    displayFormat: "Total: {0}",
        //    showInGroupFooter: true,
        //    alignByColumn: true
        //}, {
        //    column: "ReceiptQtyPurchaseUnit",
        //    summaryType: "sum",
        //    displayFormat: "Total: {0}",
        //    showInGroupFooter: true,
        //    alignByColumn: true
        //}, {
        //    column: "ReceiptValue",
        //    summaryType: "sum",
        //    displayFormat: "Total: {0}",
        //    showInGroupFooter: true,
        //    alignByColumn: true
        //}]
    }
});

showMore();
function showMore() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var FromDate = $("#FromDate").dxDateBox('instance').option('value');
    var ToDate = $("#ToDate").dxDateBox('instance').option('value');

    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/GetWholeDataGRNRegisterGrid",
        data: '{FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GRNRegisterGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
}

$("#BtnSearch").click(function () {
    showMore();
});

