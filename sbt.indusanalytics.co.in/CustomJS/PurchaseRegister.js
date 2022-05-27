
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

showMore();
function showMore() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var FromDate = $("#FromDate").dxDateBox('instance').option('value');
    var ToDate = $("#ToDate").dxDateBox('instance').option('value');

    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/GetWholeDataPurchaseRegister",
        data: '{FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);

            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#PurchaseRegisterGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
}

var FromDate = $("#FromDate").dxDateBox('instance').option('value');
var ToDate = $("#ToDate").dxDateBox('instance').option('value');
$("#PurchaseRegisterGrid").dxDataGrid({
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
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Purchase Register (" + FromDate + " To " + ToDate + " )",
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
        { dataField: "PONO", visible: true, caption: "PO No", width: 150 },
        { dataField: "PODate", visible: true, caption: "PO Date", width: 100 },
        { dataField: "LedgerName", visible: true, caption: "Ledger Name", width: 100 },
        { dataField: "PurchaseDivision", visible: true, caption: "Division", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group Name", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
        { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 100 },
        { dataField: "PurchaseOrderQuantity", visible: true, caption: "PO Quantity", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "POQtyStockUnit", visible: true, caption: "PO Qty Stock Unit", width: 100 },
        { dataField: "PurchaseRate", visible: true, caption: "Purchase Rate", width: 100 },
        { dataField: "BasicAmount", visible: true, caption: "Basic Amount", width: 100 },
        { dataField: "DiscountAMount", visible: true, caption: "Discount Amount", width: 100 },
        { dataField: "CGSTAmount", visible: true, caption: "CGST Amount", width: 100 },
        { dataField: "SGSTAmount", visible: true, caption: "SGST Amount", width: 100 },
        { dataField: "IGSTAmount", visible: true, caption: "IGST Amount", width: 100 },
        { dataField: "GrossAmount", visible: true, caption: "Gross Amount", width: 100 },
        { dataField: "PurchaseReferenceRemark", visible: true, caption: "PO Reference", width: 150 },
        { dataField: "Narration", visible: true, caption: "Narration", width: 150 },
        { dataField: "HeadName", visible: true, caption: "Head Name", width: 100 },
        { dataField: "HeadAmount", visible: true, caption: "Head Amount", width: 100 }
    ]
    //summary: {
    //    totalItems: [{
    //        column: "Amt",
    //        summaryType: "sum"
    //    }]
    //}
});


$("#BtnSearch").click(function () {
    showMore();
});