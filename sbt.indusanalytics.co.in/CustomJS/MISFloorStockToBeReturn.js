"use strict";

var gridData = "";

RefreshFloorStockToBeReturned();

function RefreshFloorStockToBeReturned() {
    try {

        $.ajax({
            type: "POST",
            url: "WebService_CommonMIS.asmx/ExpectedFloorStockToBeReturned",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);

                gridData = JSON.parse(res);
                setFloorStockReturnGrid(gridData);
            }
        });
        
    } catch (e) {
        console.log(e);
    }
}

function setFloorStockReturnGrid(gridData) {
    $("#gridFloorStock").dxDataGrid({
        dataSource: gridData,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "single"},
        paging: {
            pageSize: 30
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [30, 50, 70, 100]
        },
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
            fileName: "Expected Floor Stock To Be Return",
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
        onCellClick: function (e) {
            if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            var Row = e.row.rowIndex;
            var Col = e.columnIndex;
        },
        height: function () {
            return window.innerHeight / 1.2;
        },
        editing: {
            enabled: false
        },
        onEditorPreparing: function (e) {
            if (e.parentType === 'headerRow' && e.command === 'select') {
                e.editorElement.remove();
            }
        },        
        columns: [
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Issue No.", width: 80 },
            { dataField: "VoucherNo", visible: true, caption: "Issue No.", width: 100 },
            { dataField: "VoucherDate", visible: true, caption: "Issue Date", width: 100, fixed: true, dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar" },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
            { dataField: "DepartmentName", visible: true, caption: "Department", width: 100 },
            { dataField: "JobCardNo", visible: true, caption: "J.C. No.", width: 100 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
            { dataField: "ContentName", visible: true, caption: "Content Name", width: 150 },
            { dataField: "ProcessName", visible: true, caption: "Process Name", width: 100 },
            { dataField: "MachineName", visible: false, caption: "Machine Name", width: 100 },
            { dataField: "PickListVoucherNo", visible: true, caption: "Picklist No.", width: 100 },
            { dataField: "PickListVoucherDate", visible: true, caption: "Picklist Date", width: 100, dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "PicklistReleaseNo", visible: true, caption: "Release No.", width: 100 },
            { dataField: "PicklistReleaseDate", visible: true, caption: "Release Date", width: 100, dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "StockUnit", visible: true, caption: "Unit", width: 100 },
            { dataField: "PicklistQuantity", visible: true, caption: "Picklist Qty", width: 100 },
            { dataField: "ReleaseQuantity", visible: true, caption: "Release Qty", width: 100 },
            { dataField: "ReleaseBy", visible: true, caption: "Release By", width: 100 },
            { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", width: 100 },
            { dataField: "ConsumeQuantity", visible: false, caption: "Consume Qty", width: 100 },
            { dataField: "ReturnedQuantity", visible: false, caption: "Already Returned Qty", width: 100 },
            { dataField: "ExpectedReturnQuantity", visible: true, caption: "Expect.Return Qty", width: 100 },
            { dataField: "Narration", visible: true, caption: "Remark", width: 200 },
            { dataField: "IssueBy", visible: true, caption: "Issue By", width: 100 }
        ]        
    });
}
