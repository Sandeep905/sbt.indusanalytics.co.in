"use strict";

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

$("#DtFromTime").dxDateBox({
    //pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    type: 'datetime',
    value: new Date(),
    max: new Date()
});

$("#DtToTime").dxDateBox({
    //pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    type: 'datetime',
    value: new Date(),
    max: new Date()
});

$("#SelItemGroups").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Group...",
    displayExpr: "ItemGroupNameDisplay",
    valueExpr: "ItemGroupID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#TxtItemGroup").text(data);
            RefreshItemList();
        }
        else {
            $("#TxtItemGroup").text("");
        }
    }
});

$("#SelItemList").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'ItemCode',
    valueExpr: 'ItemID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        BtnRefreshclick();
    }
});

$("#GridReport").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    paging: {
        enabled: true,
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    export: {
        enabled: true,
        fileName: "Stock Ledger",
        allowExportSelectedData: true
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    columns: [
        { dataField: "ItemCode", caption: "Item Code", width: 100, groupIndex: 0 },
        { dataField: "ItemCode", caption: "ItemCode", width: 100 },
        { dataField: "ItemGroupName", caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", caption: "Sub Group", width: 120 },
        { dataField: "ItemName", caption: "Item Name", width: 180 },
        { dataField: "VoucherName", caption: "Voucher Name", width: 100 },
        { dataField: "Supplier", caption: "Supplier", width: 180 },
        { dataField: "Client", caption: "Client", width: 180 },
        { dataField: "JobBookingNo", caption: "JC No", width: 100 },
        { dataField: "PONO", caption: "PO No", width: 100 },
        { dataField: "VoucherNo", caption: "Voucher No", width: 100 },
        { dataField: "VoucherDate", caption: "Voucher Date", dataType: "datetime", format: "dd-MMM-yyyy HH:mm:ss", width: 100 },
        { dataField: "BatchNo", caption: "Batch No" },
        { dataField: "OpeningBalance", caption: "Opening Balance", format: { type: "fixedPoint", precision: 3 } },
        { dataField: "ReceiptQty", caption: "Receipt Qty", format: { type: "fixedPoint", precision: 3 } },
        { dataField: "IssueQty", caption: "Issue Qty", format: { type: "fixedPoint", precision: 3 } },
        { dataField: "ClosingBalance", caption: "Closing Balance", format: { type: "fixedPoint", precision: 3 } }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    //onExporting: function (e) {
    //    e.cancel = true;
    //    var dataSourceArray = e.component.getDataSource().items();
    //    var csv = JSON2CSV(dataSourceArray);
    //    var downloadLink = document.createElement("a");
    //    var blob = new Blob(["\ufeff", csv]);
    //    var url = URL.createObjectURL(blob);
    //    downloadLink.href = url;
    //    downloadLink.download = "StockReport.csv";
    //    document.body.appendChild(downloadLink);
    //    downloadLink.click();
    //    document.body.removeChild(downloadLink);
    //},
    summary: {
        totalItems: [{
            column: "ReceiptQty",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "IssueQty",
            summaryType: "sum",
            displayFormat: "{0}"
        }]
    }
});

$.ajax({
    type: 'POST',
    url: "WebService_CommonMIS.asmx/GetItemGroups",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (results) {
        var ObjItemGroups = GetJsonConvertedObject(results);
        $("#SelItemGroups").dxTagBox({ items: ObjItemGroups });
    }
});

function RefreshItemList() {
    var TxtItemGroup = $("#TxtItemGroup").text();
    $.ajax({
        type: 'POST',
        url: "WebService_CommonMIS.asmx/GetItemsList",
        data: '{TxtItemGroup:' + JSON.stringify(TxtItemGroup) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var RES1 = GetJsonConvertedObject(results);
            $("#SelItemList").dxSelectBox({ items: RES1 });
        }
    });
}

function BtnRefreshclick() {
    var FromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    var ToTime = $('#DtToTime').dxDateBox('instance').option('value');
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var TxtItemGroup = $("#TxtItemGroup").text();
    $("#GridReport").dxDataGrid({ dataSource: [] });
    var ItemID = $("#SelItemList").dxSelectBox('instance').option('value');

    var StrUrl = "WebService_CommonMIS.asmx/GetStockLedgerReport";
    if (ItemID !== null && ItemID > 0) {
        TxtItemGroup = ItemID;
        StrUrl = "WebService_CommonMIS.asmx/GetStockLedgerReportItemWise";
    }
    $.ajax({
        type: "POST",
        url: StrUrl,
        data: '{FromDate:' + JSON.stringify(FromTime) + ',ToDate:' + JSON.stringify(ToTime) + ',ItemGroupID:' + JSON.stringify(TxtItemGroup) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var RES1 = GetJsonConvertedObject(results);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GridReport").dxDataGrid({ dataSource: RES1 });
        },
        error: function (ex) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            console.log(ex);
        }
    });
}

function BtnPrintclick() {
    var DtFromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    var DtToTime = $('#DtToTime').dxDateBox('instance').option('value');
    var UserID = $("#UserID").text();
    var MachineID = $("#MachineID").text();

    var url = "DailyProductionReportPrint.aspx?IsDate=" + IsActiveDate + "&FromTime=" + DtFromTime.format("dd-MMM-yyyy HH:mm tt") + "&ToTime=" + DtToTime.format("dd-MMM-yyyy HH:mm tt") + "&MachineID=" + MachineID + "&UserID=" + UserID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
}
