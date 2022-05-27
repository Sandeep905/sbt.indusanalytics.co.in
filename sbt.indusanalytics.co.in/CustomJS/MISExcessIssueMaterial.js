"use strict";

var IssueGridData = [];
var DynamicColPush = [];

var popup = $("#popup").dxPopover({
    width: 100,
    height: 50
}).dxPopover("instance");

$("#gridreport").dxDataGrid({
    dataSource: IssueGridData,
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
    paging: { enabled: true, pageSize: 100 },
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
        fileName: "Excess Issue Material List",
        allowExportSelectedData: true
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    //focusedRowEnabled: true,
    columns: [
        { dataField: "PicklistTransactionID", visible: false, caption: "PicklistTransactionID", width: 120 },
        { dataField: "PicklistTransactionDetailID", visible: false, caption: "PicklistTransactionDetailID", width: 120 },
        { dataField: "PicklistReleaseTransactionID", visible: false, caption: "PicklistReleaseTransactionID", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 80 },
        { dataField: "PicklistNo", visible: true, caption: "Picklist No.", width: 140 },
        { dataField: "PicklistDate", visible: true, caption: "Picklist Date", width: 120, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "DepartmentName", visible: true, caption: "Department", width: 160 },
        { dataField: "JobCardContentNo", visible: true, caption: "J.C. No.", width: 160 },
        { dataField: "PlanContName", visible: true, caption: "Content Name", width: 250 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "ItemDescription", visible: false, caption: "ItemDescription", width: 200 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 200 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
        { dataField: "ReleaseDate", visible: true, caption: "Release Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "RequiredQuantity", visible: true, caption: "Picklist Qty", width: 120 },
        { dataField: "ReleaseQuantity", visible: true, caption: "Release Qty", width: 120 },
        { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", width: 120 },
        { dataField: "PendingToIssue", visible: true, caption: "Pending To Issue", width: 120 }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    }
});

refreshExcessReportGrid();
function refreshExcessReportGrid() {
    document.getElementById("LOADER").style.display = "block";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_CommonMIS.asmx/ExcessIssueMaterialReport",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                ////console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                IssueGridData = [];
                IssueGridData = JSON.parse(res);
                $("#gridreport").dxDataGrid({
                    dataSource: IssueGridData
                });
            }
        });
    } catch (e) {
        alert(e);
    }
}


