
var LedgerStockData = [];

document.getElementById("chkDate").disabled = true;

var startDate = new Date(1981, 3, 27);
startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

$("#DateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: startDate.toISOString().substr(0, 10),
});
$("#DateTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});

$("#StockLedgerGrid").dxDataGrid({
    dataSource: LedgerStockData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Stock Ledger",
        allowExportSelectedData: true,
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

    },

    columns: [
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 100, },
        { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 120 },
        { dataField: "ItemGroupName", visible: true, caption: "ItemGroupName", width: 120, },
        { dataField: "ItemSubGroupName", visible: true, caption: "ItemSubGroupName", width: 120,},
        { dataField: "ItemName", visible: true, caption: "ItemName", width: 300, },
        { dataField: "ItemDescription", visible: true, caption: "ItemDescription", width: 300 },
        { dataField: "VoucherName", visible: true, caption: "VoucherName", width: 120 },
        { dataField: "Supplier", visible: true, caption: "Supplier", width: 120 },
        { dataField: "JobBookingNo", visible: true, caption: "JobBookingNo", width: 120 },
        { dataField: "PurchaseVoucherNo", visible: true, caption: "PurchaseVoucherNo", width: 120 },
        { dataField: "VoucherNo", visible: true, caption: "VoucherNo", width: 120 },
        { dataField: "VoucherDate", visible: true, caption: "VoucherDate", width: 120 },
        { dataField: "OpeningBalance", visible: true, caption: "OpeningBalance", width: 120 },
        { dataField: "ReceiptQty", visible: true, caption: "ReceiptQty", width: 120 },
        { dataField: "IssueuQty", visible: true, caption: "IssueuQty", width: 120 },
        { dataField: "Closingbalance", visible: true, caption: "Closingbalance", width: 120 },
    ]

})

$("#FilterButton").click(function () {
    RetriveData();
});

RetriveData();
function RetriveData() {
    var frdt = $('#DateFrom').dxDateBox('instance').option('value');
    var todt = $('#DateTo').dxDateBox('instance').option('value');
    var chkVal = document.getElementById("chkDate").checked;

    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_Report_StockLedger.asmx/GetStockLedger",
        data: '{chkVal:' + JSON.stringify(chkVal) + ',frdt:' + JSON.stringify(frdt) + ',todt:' + JSON.stringify(todt) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            LedgerStockData = [];
            LedgerStockData = JSON.parse(res.toString());
            
            $("#StockLedgerGrid").dxDataGrid({
                dataSource: LedgerStockData,
            });

        }
    });
}