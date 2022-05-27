
$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading ...",
    width: 300,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

RefreshJobList();
function RefreshJobList() {
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: 'POST',
        url: "WebService_InvoiceEntry.asmx/GetProcessInvoiceList",
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -3);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());

            $("#GridInvoiceData").dxDataGrid({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

$("#GridInvoiceData").dxDataGrid({
    dataSource: [],
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columnAutoWidth: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    sorting: { mode: 'multiple' },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    height: function () {
        return window.innerHeight / 1.1;
    },
    columns: [
        { dataField: "InvoiceNo", caption: "Invoice No" },
        { dataField: "ChallanNo", caption: "Challan No", width: 100 },
        { dataField: "InvoiceDate", caption: "Invoice Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ClientName", caption: "Client Name", width: 200 },
        { dataField: "JobBookingNo", caption: "Job Card No", width: 100 },
        { dataField: "JobName", caption: "Job Name", width: 200 },
        { dataField: "ConsigneeName", caption: "Consignee Name", width: 200 },
        { dataField: "ProductHSNName", caption: "Group Name", width: 150 },
        { dataField: "Quantity", caption: "Quantity", width: 100 },
        { dataField: "TotalQuantity", caption: "Total Quantity" },
        { dataField: "Rate", caption: "Cost" },
        { dataField: "NetAmount", caption: "Net Amount" },
        { dataField: "ClientState", caption: "Client State" },
        { dataField: "Narration", caption: "Remark" },
        { dataField: "IsInvoiceApproved", caption: "Is Invoice Approved", fixedPosition: "right", fixed: true, allowEditing: true },
        { dataField: "ConsigneeState", visible: false, caption: "Consignee State" },
        { dataField: "SalesLedgerName", caption: "Sales Ledger Name" }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('font-size', '11px');
        if (e.rowType === "data") {
            if (e.data.IsDirectInvoice === true) {
                e.rowElement.css('background', '#efe813c2');
            }
        }
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "IsInvoiceApproved") {
            e.cancel = false;
        } else {
            e.cancel = true;
        }
    },
    onRowUpdated: function (e) {
        UpdateInvoiceEntryApproval(e.data.InvoiceTransactionID, e.data.IsInvoiceApproved, e.data.IsLocked);
    },
    filterRow: { visible: true },
    searchPanel: { visible: false },
    onToolbarPreparing: function (e) {
        e.toolbarOptions.items.unshift({
            location: "after",
            widget: "dxButton",
            options: {
                icon: "refresh",
                onClick: function () {
                    RefreshJobList();
                }
            }
        });
    }
});

function UpdateInvoiceEntryApproval(InvoiceID, IsApprove, IsLocked) {
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/InvoiceEntryApproval",
        data: '{InvoiceID:' + JSON.stringify(InvoiceID) + ',IsApprove:' + JSON.stringify(IsApprove) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            if (res === "Success") {
                swal("Invoice updated successfully..!","", "success");
            } else {
                swal("Error..!", res, "warning");
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}
