"use strict";

var JobStatusGridData = [], GetJobStatusGridSelectedData = [];
var DrawStatsProgress = [], ProductionDetailsGridData = [], ScheduleGridData = [];

$("#SelJobCard").dxSelectBox({
    items: [],
    placeholder: "Select JobCard--",
    displayExpr: 'JobBookingNo',
    valueExpr: 'JobBookingID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        JobStatusGridData = [];
        $("#JobCardGridGrid").dxDataGrid({ dataSource: [] });
        $("#JobStatusGrid").dxDataGrid({ dataSource: [] });
        if (e.value === null) return;
        $.ajax({
            type: "POST",
            url: "WebService_JobStatus.asmx/GetJobCardContentsDetail",
            data: '{JCID:' + JSON.stringify(e.value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var ObjJobCardGridGrid = JSON.parse(res);
                $("#JobCardGridGrid").dxDataGrid({ dataSource: ObjJobCardGridGrid });
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_JobStatus.asmx/GetJobCardNo",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SelJobCardData = JSON.parse(res);

        $("#SelJobCard").dxSelectBox({
            items: SelJobCardData
        });
    }
});

$("#JobCardGridGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    columnResizingMode: "widget",
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 4;
    },
    columns: [{ dataField: "JobCardContentNo", caption: "Job Content No" },
    { dataField: "LedgerName", caption: "Ledger Name", width: 150, hidingPriority: 1 },
    { dataField: "JobBookingNo", visible: false, caption: "Job Card No", width: 100 },
    { dataField: "BookingDate", caption: "Booking Date", width: 100, hidingPriority: 2 },
    { dataField: "JobName", caption: "Job Name", width: 200, hidingPriority: 8 },
    { dataField: "ContentName", caption: "Content Name", width: 150, hidingPriority: 3 },
    { dataField: "OrderQuantity", caption: "Order Qty", width: 100, hidingPriority: 4 },
    { dataField: "PONo", caption: "PO No", width: 100, hidingPriority: 6 },
    { dataField: "PODate", caption: "PO Date", width: 80, hidingPriority: 5 },
    { dataField: "ProductCode", caption: "Product Code", width: 100, hidingPriority: 7 },
    { dataField: "IsClose", caption: "Job Close", width: 100, hidingPriority: 9 },
    { dataField: "OrderBookingNo", caption: "Order Booking No", width: 100, hidingPriority: 0 }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clicked) {

        ProductionDetailsGridData = clicked.selectedRowsData;
        DrawStatsProgress = [];
        $("#JobStatusGrid").dxDataGrid({ dataSource: [] });

        if (ProductionDetailsGridData.length <= 0) return;

        $.ajax({
            type: "POST",
            url: "WebService_JobStatus.asmx/GetAfterJobCardData",
            data: '{JobBookingJobCardContentsID:' + JSON.stringify(ProductionDetailsGridData[0].JobBookingJobCardContentsID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                JobStatusGridData = JSON.parse(res);
                $("#JobStatusGrid").dxDataGrid({
                    dataSource: JobStatusGridData
                });
            }
        });

        $.ajax({
            type: "POST",
            url: "WebService_JobStatus.asmx/DrawStatus",
            data: '{JobBookingJobCardContentsID:' + JSON.stringify(ProductionDetailsGridData[0].JobBookingJobCardContentsID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                DrawStatsProgress = JSON.parse(res);

                DrawStatus();
            }
        });

    }
});

$("#JobStatusGrid").dxDataGrid({
    dataSource: JobStatusGridData,
    keyExpr: 'MachineID',
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    paging: {
        pageSize: 250
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [250, 350, 500, 1000]
    },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.8;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        if (e.rowType === "data") {
            if (e.data.Status === "Complete") {
                e.rowElement.css('background', 'green');
                e.rowElement.css('color', '#fff');
            }
            else if (e.data.Status === "In Queue") {
                e.rowElement.css('background', 'yellow');
            }
            else if (e.data.Status === "Part Complete") {
                e.rowElement.css('background', 'coral');
            }
            else if (e.data.Status === "Running") {
                e.rowElement.css('background', 'lightpink');
            }
            else if (e.data.Status === "Outsource Send") {
                e.rowElement.css('background', '#34f2f4');
            }
            else if (e.data.Status === "Outsource Receive") {
                e.rowElement.css('background', '#cc00ff');
                e.rowElement.css('color', '#fff');
            }
        }
    },
    onSelectionChanged: function (xx) {
        GetJobStatusGridSelectedData = xx.selectedRowsData;
        if (GetJobStatusGridSelectedData.length <= 0) return;
        document.getElementById("TxtJobStatusGridID").value = GetJobStatusGridSelectedData[0].ProcessID;
    },
    columns: [
        { dataField: "SN", caption: "S No.", allowSorting: false, hidingPriority: 12 },
        { dataField: "MachineName", caption: "Machine Name", width: 120, allowSorting: false, hidingPriority: 11 },
        { dataField: "EmployeeName", caption: "Operator Name", width: 120, allowSorting: false, hidingPriority: 10 },
        { dataField: "JobCardFormNo", caption: "JC Form No", allowSorting: false },
        { dataField: "RefNo", width: 50, caption: "Ref Form No" },
        { dataField: "ProcessName", caption: "Process Name", allowSorting: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowSorting: false },
        { dataField: "FromTime", caption: "From Time", allowSorting: false, hidingPriority: 9 },
        { dataField: "ToTime", caption: "To Time", allowSorting: false, hidingPriority: 8 },
        { dataField: "ReceivedQuantity", caption: "Received Qty", allowSorting: false },
        { dataField: "ProductionQuantity", caption: "Produce Qty", allowSorting: false },
        { dataField: "Conversionvalue", caption: "No Of Steps", allowSorting: false, hidingPriority: 1 },
        { dataField: "ReadyQuantity", caption: "Ready Qty", allowSorting: false },
        { dataField: "WastageQuantity", caption: "Wastage Qty", allowSorting: false, hidingPriority: 7 },
        { dataField: "SuspenseQuantity", caption: "Suspense Qty", allowSorting: false, hidingPriority: 6 },
        { dataField: "Status", caption: "Status", allowSorting: false, hidingPriority: 13 },
        { dataField: "ProductionRemark", visible: false, caption: "Production Remark", allowSorting: false, hidingPriority: 5 },
        { dataField: "WastageRemark", visible: false, caption: "Wastage Remark", allowSorting: false, hidingPriority: 4 },
        { dataField: "SuspenseRemark", visible: false, caption: "Suspense Remark", allowSorting: false, hidingPriority: 3 },
        { dataField: "Shift", visible: false, caption: "Shift", allowSorting: false, hidingPriority: 2 },
        { dataField: "UserName", caption: "Supervisor", allowSorting: false, hidingPriority: 0 },
        {
            dataField: "AttachedFileName", width: 100,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate(container, options) {
                $('<div>')
                    .append($('<img>', { src: options.value }))
                    .appendTo(container);
            },
        }
    ],
    //onCellPrepared(e) {
    //    if (e.rowType !== "data" && e.columnIndex !== 0) return;
    //    if (e.columnIndex === 4) {
    //        e.cellElement.css('background-color', '#ff9600');
    //        e.cellElement.css('color', 'white');
    //    }
    //}
});

function DrawStatus() {
    document.getElementById("DrawStepProcess").innerHTML = "";
    try {

        var TotalStage = 0;
        var ClassApplyVar = "";
        var DisplayStepTag = "";
        var Draw_LI = "";
        TotalStage = DrawStatsProgress.length;

        if (TotalStage > 0) {
            for (var t = 0; t < TotalStage; t++) {
                if (DrawStatsProgress[t].Status === "Complete") {
                    ClassApplyVar = 'class="progtrckr-done col-lg-3 col-md-4 col-sm-6 col-xs-12"';
                }
                else if (DrawStatsProgress[t].Status === "Part Complete") {
                    ClassApplyVar = 'class="progtrckr-part-done col-lg-3 col-md-4 col-sm-6 col-xs-12"';
                }
                else if (DrawStatsProgress[t].Status === "Running") {
                    ClassApplyVar = 'class="progtrckr-running col-lg-3 col-md-4 col-sm-6 col-xs-12"';
                }
                else {
                    ClassApplyVar = 'class="progtrckr-todo col-lg-3 col-md-4 col-sm-6 col-xs-12"';
                }
                DisplayStepTag = DrawStatsProgress[t].ProcessName + " (" + DrawStatsProgress[t].Status + ")";

                Draw_LI += ' <li ' + ClassApplyVar + ' style="margin-bottom: 15px">' + DisplayStepTag + '</li>';
            }
            var OrderList = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><ol class="progtrckr" data-progtrckr-steps="' + TotalStage + '">' + Draw_LI + '</ol>  </div>';

            $("#DrawStepProcess").append(OrderList);
            document.getElementById("DrawStepProcess_Div").style.display = "block";
        }
        else {
            //alert("Data not found..");
            document.getElementById("DrawStepProcess_Div").style.display = "none";
        }

    } catch (e) {
        console.log(e);
    }
}

$("#ScheduleGrid").dxDataGrid({
    dataSource: ScheduleGridData,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.7;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "SN", width: 60, caption: "S.No" },
        { dataField: "ProcessName", caption: "Process Name" },
        { dataField: "RateFactor", caption: "Rate Factor" },
        { dataField: "JobCardFormNo", caption: "JC Form No" },
        { dataField: "RefNo", caption: "Ref Form No" },
        { dataField: "ScheduleQty", caption: "Schedule Qty" },
        { dataField: "ProductionQuantity", caption: "Production Qty" },
        { dataField: "ReadyQuantity", caption: "Ready Qty" },
        { dataField: "WastageQuantity", caption: "Wastage Qty" },
        { dataField: "SuspenseQuantity", caption: "Suspense Qty" },
        { dataField: "ScheduledMachine", caption: "Scheduled Machine" },
        { dataField: "Speed", caption: "Speed" },
        { dataField: "TimeToBeTaken", visible: false, caption: "Time To Be Taken" },
        { dataField: "Status", width: 100, caption: "Status" }
    ]
});

$("#ProductionDetailsGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.7;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "SN", width: 60, caption: "S.No" },
        { dataField: "ContentName", caption: "Content Name" },
        { dataField: "ProcessName", caption: "Process Name" },
        { dataField: "RateFactor", caption: "Rate Factor" },
        { dataField: "JobCardFormNo", caption: "JC Form No" },
        { dataField: "RefNo", caption: "Ref Form No" },
        { dataField: "ScheduleQty", caption: "Schedule Qty" },
        { dataField: "MachineName", caption: "Machine Name" },
        { dataField: "LedgerName", caption: "Client Name" },
        {
            dataField: "FromTime", width: 100, caption: "From Time",
            dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
            calculateCellValue: function (e) {
                return new Date(parseInt(e.FromTime.substr(6)));
            }
        },
        {
            dataField: "ToTime", width: 100, caption: "To Time",
            dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
            calculateCellValue: function (e) {
                return new Date(parseInt(e.ToTime.substr(6)));
            }
        },
        { dataField: "ProductionQuantity", caption: "Production Qty" },
        { dataField: "ReadyQuantity", caption: "Ready Qty" },
        { dataField: "WastageQuantity", caption: "Wastage Qty" },
        { dataField: "SuspenseQuantity", caption: "Suspense Qty" },
        { dataField: "ScheduledMachine", caption: "Scheduled Machine" },
        { dataField: "Speed", caption: "Speed" },
        { dataField: "TimeToBeTaken", visible: false, caption: "Time To Be Taken" },
        { dataField: "Status", width: 100, caption: "Status" }
    ]
});

$("#ProductionDetailsButton").click(function () {

    if (ProductionDetailsGridData.length <= 0) {
        DevExpress.ui.notify("Please choose job card content..!", "warning", 1500);
        return false;
    }
    $.ajax({
        type: "POST",
        url: "WebService_JobStatus.asmx/GetProductionDetailPopUp",
        data: '{JobBookingJobCardContentsID:' + JSON.stringify(ProductionDetailsGridData[0].JobBookingJobCardContentsID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#ProductionDetailsGrid").dxDataGrid({
                dataSource: RES1
            });

            $.ajax({
                type: "POST",
                url: "WebService_JobStatus.asmx/OperationDetailData",
                data: '{JobBookingJobCardContentsID:' + JSON.stringify(ProductionDetailsGridData[0].JobBookingJobCardContentsID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    ScheduleGridData = [];
                    ScheduleGridData = JSON.parse(res);
                    $("#ScheduleGrid").dxDataGrid({
                        dataSource: ScheduleGridData
                    });
                }
            });
        }
    });

    document.getElementById("ProductionDetailsButton").setAttribute("data-toggle", "modal");
    document.getElementById("ProductionDetailsButton").setAttribute("data-target", "#largeModalHSNGroup");
});