
$("#SelVouchersList").dxSelectBox({
    items: [],
    placeholder: "Select Voucher",
    displayExpr: 'VoucherNo',
    valueExpr: 'TransactionID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        refreshstock(e.value);
    }
});

$("#GridItemsDetail").dxDataGrid({
    dataSource: [],
    sorting: { mode: "multiple" },
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 1.3;
    },
    filterRow: { applyFilter: "auto" },
    scrolling: { mode: 'virtual' },
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
    columns: [
        { dataField: "ItemCode", caption: "ItemCode" },
        { dataField: "ItemGroupName", caption: "Item Group" },
        { dataField: "ItemSubGroupName", caption: "Sub Group" },
        { dataField: "ItemName", caption: "ItemName", width: 220 },
        { dataField: "StockUnit", caption: "Stock Unit" },
        { dataField: "PhysicalStock", caption: "Physical Stock" },
        { dataField: "AllocatedStock", caption: "Allocated Stock" },
        { dataField: "FreeStock", caption: "Free Stock" },
        { dataField: "IncomingStock", caption: "Incoming Stock" },
        { dataField: "OutgoingStock", caption: "Outgoing Stock" },
        { dataField: "BookedStock", caption: "Booked Stock" },
        { dataField: "UnapprovedStock", caption: "Unapproved Stock" },
        { dataField: "FloorStock", caption: "Floor Stock" },
        { dataField: "TheoriticalStock", caption: "Theoritical Stock" },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking" }]
});

$.ajax({
    type: "POST",
    url: "WebServicePurchaseGRN.asmx/GetVouchersList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/:,/g, ':null,');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelVouchersList").dxSelectBox({ items: RES1 });
    }
});

function refreshstock(TransID) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/TransactionWiseStockData",
            data: '{TransID:' + TransID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/:,/g, ':null,');
                res = res.substr(1);
                res = res.slice(0, -1);
                var StockGridData = JSON.parse(res);
                $("#GridItemsDetail").dxDataGrid({ dataSource: StockGridData });
            }
        });
    } catch (e) {
        alert(e);
    }
}