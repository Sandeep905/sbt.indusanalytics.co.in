"use strict";
var JobStatusGridData = [], GetJobStatusGridSelectedData = [];
var ProductionDetailsGridData = [], ProductionDetailsGridSelectedData = [], ScheduleGridData = [], GridScheduleReleaseData = [];
var JBJCCI = "", SelectedProcessID = "", CurrentStatus = "", FormWiseDetail = [];
var GetScheduleData = [], selectedJobCard = "";
var AllMachine = [];
var FlagEditScheduleQty = false;

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
    async: false,
    url: "WebService_PurchaseOrder.asmx/CheckIsAdmin",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d === "True") {
            FlagEditScheduleQty = true;
        } else
            FlagEditScheduleQty = false;
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
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 3;
    },
    columns: [{ dataField: "JobCardContentNo", visible: true, caption: "Job Content No" },
    { dataField: "LedgerName", visible: true, caption: "Ledger Name", width: 150, hidingPriority: 1 },
    { dataField: "JobBookingNo", visible: false, caption: "Job Card No", width: 100 },
    { dataField: "BookingDate", visible: true, caption: "Booking Date", width: 100, hidingPriority: 2 },
    { dataField: "JobName", visible: true, caption: "Job Name", width: 200, hidingPriority: 8 },
    { dataField: "ContentName", visible: true, caption: "Content Name", width: 150, hidingPriority: 3 },
    { dataField: "OrderQuantity", visible: true, caption: "Order Qty", width: 100, hidingPriority: 4 },
    { dataField: "PONo", visible: true, caption: "PO No", width: 100, hidingPriority: 6 },
    { dataField: "PODate", visible: true, caption: "PO Date", width: 80, hidingPriority: 5 },
    { dataField: "ProductCode", visible: true, caption: "Product Code", width: 100, hidingPriority: 7 },
    { dataField: "IsClose", visible: true, caption: "Job Close", width: 100, hidingPriority: 9 },
    { dataField: "OrderBookingNo", visible: true, caption: "Order Booking No", width: 100, hidingPriority: 0 }],
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

        $("#JobStatusGrid").dxDataGrid({ dataSource: [] });

        if (ProductionDetailsGridData.length <= 0) return;
        GetContProcesList();
    }
});

function GetContProcesList() {
    $.ajax({
        type: "POST",
        url: "WebService_JobStatusModification.asmx/OperationDetailData",
        data: '{JobBookingJobCardContentsID:' + JSON.stringify(ProductionDetailsGridData[0].JobBookingJobCardContentsID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            JobStatusGridData = JSON.parse(res);
            $("#JobStatusGrid").dxDataGrid({
                dataSource: JobStatusGridData
            });
        }
    });
}

function GetSelectedJobCardDetail() {
    JobStatusGridData = [];
    $.ajax({
        type: "POST",
        url: "WebService_JobStatusModification.asmx/GetAfterJobCardData",
        data: '{JobBookingJobCardContentsID:' + JSON.stringify(selectedJobCard) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            JobStatusGridData = [];
            JobStatusGridData = JSON.parse(res);
            $("#JobStatusGrid").dxDataGrid({
                dataSource: JobStatusGridData
            });

            $.ajax({
                type: "POST",
                url: "WebService_JobStatusModification.asmx/GetContentName",
                data: '{JobBookingJobCardContentsID:' + JSON.stringify(selectedJobCard) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var GetContentName = [];
                    GetContentName = JSON.parse(res);
                    document.getElementById("txtContentName").value = GetContentName[0].ContentName;
                    document.getElementById("txtJobName").value = GetContentName[0].JobName;
                    document.getElementById("txtScheduleID").value = GetContentName[0].ScheduleID;
                }
            });
        }
    });
}

var dataGrid = $("#JobStatusGrid").dxDataGrid({
    dataSource: JobStatusGridData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: false,
    filterRow: { visible: true, apolyFilter: "auto" },
    columnResizingMode: "widget",
    selection: { mode: "single" },
    paging: false,
    sorting: false,
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.5;
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        // dataGrid.option("rowDragging.showDragIcons", e.value);
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
    rowDragging: {
        allowReordering: true,
        onReorder: function (e) {
            if (e.component._options.dataSource[e.component._options.dataSource.indexOf(e.itemData)].Status === "In Queue") {
                var dataGridRow = dataGrid.totalCount();
                var DragFrom = e.component._options.dataSource.indexOf(e.itemData);
                var DragTo = e.component._options.dataSource.indexOf(e.component.getVisibleRows()[e.toIndex].data);

                var visibleRows = e.component.getVisibleRows(),
                    toIndex = e.component._options.dataSource.indexOf(visibleRows[e.toIndex].data),
                    fromIndex = e.component._options.dataSource.indexOf(e.itemData);
                if (Number(dataGridRow) - 1 === DragTo) {
                    e.component._options.dataSource.splice(fromIndex, 1);
                    e.component._options.dataSource.splice(toIndex, 0, e.itemData);
                }
                else {
                    if (e.component._options.dataSource[Number(DragTo) + 1].Status === "In Queue") {
                        e.component._options.dataSource.splice(fromIndex, 1);
                        e.component._options.dataSource.splice(toIndex, 0, e.itemData);
                    } else {
                        DevExpress.ui.notify("You can't reorder here..!", "warning", 1500);
                        return false;
                    }
                }
            }
            else {
                DevExpress.ui.notify("You can reorder only In Queue Process..!", "warning", 1500);
                return false;
            }
            e.component.refresh();
        }
    },
    onSelectionChanged: function (xx) {
        GetJobStatusGridSelectedData = xx.selectedRowsData;
        if (GetJobStatusGridSelectedData.length <= 0) return;
        document.getElementById("TxtJobStatusGridID").value = GetJobStatusGridSelectedData[0].ProcessID;

        document.getElementById("BtnReleaseSchedule").disabled = false;
        document.getElementById("BtnDeleteProcess").disabled = false;
    },
    columns: [
        { dataField: "SN", visible: false, width: 60, caption: "S.No", allowEditing: false },
        { dataField: "ProcessName", visible: true, caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", visible: true, caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", visible: true, caption: "JC Form No", allowEditing: false },
        { dataField: "MachineName", visible: true, caption: "Machine Name", allowEditing: false },
        { dataField: "ScheduleQty", visible: true, caption: "Schedule Qty", allowEditing: false },
        { dataField: "ProductionQuantity", visible: true, caption: "Production Qty", allowEditing: false },
        { dataField: "ConversionValue", visible: true, width: 50, caption: "Steps", allowEditing: false },
        { dataField: "ReadyQuantity", visible: true, caption: "Ready Qty", allowEditing: false },
        { dataField: "WastageQuantity", visible: true, caption: "Wastage Qty", allowEditing: false },
        { dataField: "SuspenseQuantity", visible: true, caption: "Suspense Qty", allowEditing: false },
        { dataField: "PaperConsumptionRequired", visible: true, caption: "Paper Consumption Required", allowEditing: true },
        { dataField: "Status", visible: true, caption: "Status", allowEditing: false }
    ]
}).dxDataGrid("instance");

$("#BtnReleaseSchedule").click(function () {
    if (GetJobStatusGridSelectedData.length === 0) {
        DevExpress.ui.notify("Please Choose Process..!", "error", 1000);
        return false;
    }

    JBJCCI = GetJobStatusGridSelectedData[0].JobBookingJobCardContentsID;
    SelectedProcessID = GetJobStatusGridSelectedData[0].ProcessID;
    var ScheduleID = GetJobStatusGridSelectedData[0].ScheduleSequenceID;
    //if (GetJobStatusGridSelectedData[0].JobBookingJobCardProcessID > 1) {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_JobStatusModification.asmx/ScheduleReleaseFun",
        data: '{JobBookingJobCardContentsID:' + JSON.stringify(JBJCCI) + ',SelectedProcessID:' + JSON.stringify(SelectedProcessID) + ',ScheduleID:' + JSON.stringify(ScheduleID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";

            GridScheduleReleaseData = JSON.parse(res);

            $("#gridFormWiseDetail").dxDataGrid({
                dataSource: GridScheduleReleaseData
            });
        }
    });
    //} else {
    //    GridScheduleReleaseData.push(GetJobStatusGridSelectedData[0]);
    //    $("#gridFormWiseDetail").dxDataGrid({
    //        dataSource: GridScheduleReleaseData
    //    });
    //}
    document.getElementById("BtnReleaseSchedule").setAttribute("data-toggle", "modal");
    document.getElementById("BtnReleaseSchedule").setAttribute("data-target", "#largeModalScheduleRelease");
});

$("#BtnDeleteProcess").click(function () {
    if (GetJobStatusGridSelectedData.length === 0) {
        DevExpress.ui.notify("Please Choose Process..!", "error", 1000);
        return false;
    }
    var GetStatusText = GetJobStatusGridSelectedData[0].Status;
    if (GetStatusText !== "In Queue") {
        DevExpress.ui.notify("You can delete only In Queue process..!", "warning", 1500);
        return false;
    }
    try {
        swal({
            title: "Are you sure?",
            text: 'You will not be able to recover this "' + GetJobStatusGridSelectedData[0].ProcessName + '"..!',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        },
            function () {
                document.getElementById("LOADER").style.display = "block";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_JobStatusModification.asmx/DeleteOperation",
                        data: '{JobBookingJobCardContentsID:' + JSON.stringify(GetJobStatusGridSelectedData[0].JobBookingJobCardContentsID) + ',ProcessID:' + JSON.stringify(GetJobStatusGridSelectedData[0].ProcessID) + ',RateFactor:' + JSON.stringify(GetJobStatusGridSelectedData[0].RateFactor) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            document.getElementById("LOADER").style.display = "none";
                            if (res === "Success") {
                                swal("Deleted..!", "Your data deleted...", "success");
                                GetContProcesList();
                            } else {
                                swal("Error..!", res, "error");
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            document.getElementById("LOADER").style.display = "none";
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    } catch (e) {
        console.log(e);
    }
});

$("#ScheduleGrid").dxDataGrid({
    dataSource: ScheduleGridData,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.5;
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
    onSelectionChanged: function (selectedItems) {
        GetScheduleData = selectedItems.selectedRowsData;
        if (GetScheduleData.length <= 0) return;
        var GetStatus = GetScheduleData[0].Status;

        var StatusText = [];
        var TextChange = "";
        if (GetStatus === "Complete") {
            TextChange = "Part Complete";
            StatusText.push(TextChange);
            $("#SelStatus").dxSelectBox({
                items: StatusText,
                value: StatusText[0],
                disabled: false
            });
            document.getElementById("ChangeStatusDiv").style.display = "block";
        }
        else if (GetStatus === "Part Complete" || GetStatus === "Job Change" || GetStatus === "Shift Change") {
            TextChange = "Complete";
            StatusText.push(TextChange);
            $("#SelStatus").dxSelectBox({
                items: StatusText,
                value: StatusText[0],
                disabled: false
            });
            document.getElementById("ChangeStatusDiv").style.display = "block";
        }
        else if (GetStatus === "In Queue") {
            TextChange = "Complete";
            StatusText.push(TextChange);
            TextChange = "Part Complete";
            StatusText.push(TextChange);
            $("#SelStatus").dxSelectBox({
                items: StatusText,
                value: StatusText[0],
                disabled: false
            });
            document.getElementById("ChangeStatusDiv").style.display = "block";
        } else {
            TextChange = "";
            StatusText.push(TextChange);
            $("#SelStatus").dxSelectBox({
                items: StatusText,
                value: StatusText[0],
                disabled: true
            });
            document.getElementById("ChangeStatusDiv").style.display = "none";
        }
    },
    columns: [
        { dataField: "SN", visible: true, width: 60, caption: "S.No" },
        { dataField: "ProcessName", visible: true, width: 150, caption: "Process Name" },
        { dataField: "RateFactor", visible: true, width: 120, caption: "Rate Factor" },
        { dataField: "JobCardFormNo", visible: true, width: 150, caption: "JC Form No" },
        { dataField: "RefNo", visible: true, width: 150, caption: "Ref Form No" },
        { dataField: "ScheduleQty", visible: true, width: 120, caption: "Schedule Qty" },
        { dataField: "ProductionQuantity", visible: true, width: 120, caption: "Production Qty" },
        { dataField: "ConversionValue", visible: true, width: 50, caption: "Steps" },
        { dataField: "ReadyQuantity", visible: true, width: 120, caption: "Ready Qty" },
        { dataField: "WastageQuantity", visible: true, width: 120, caption: "Wastage Qty" },
        { dataField: "SuspenseQuantity", visible: true, width: 120, caption: "Suspense Qty" },
        { dataField: "ScheduledMachine", visible: true, width: 120, caption: "Scheduled Machine" },
        { dataField: "Speed", visible: true, width: 100, caption: "Speed" },
        { dataField: "TimeToBeTaken", visible: false, width: 120, caption: "Time To Be Taken" },
        { dataField: "Status", visible: true, width: 100, caption: "Status" },
        { dataField: "ScheduleSequenceID", visible: false, width: 100, caption: "ScheduleSequenceID" }
    ]
});

$("#ProductionDetailsGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
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
    onSelectionChanged: function (selectedItem) {
        ProductionDetailsGridSelectedData = selectedItem.selectedRowsData;
    },
    columns: [
        { dataField: "SN", visible: true, width: 35, caption: "S No." },
        { dataField: "LedgerName", visible: true, width: 100, caption: "Operator" },
        { dataField: "ContentName", visible: true, width: 180, caption: "Content" },
        { dataField: "JobCardFormNo", visible: true, width: 110, caption: "JC Form No" },
        { dataField: "RefNo", visible: true, width: 50, caption: "Ref Form No" },
        { dataField: "MachineName", visible: true, width: 100, caption: "Machine" },
        { dataField: "ProcessName", visible: true, width: 100, caption: "Process" },
        { dataField: "RateFactor", visible: true, width: 100, caption: "Rate Factor" },
        { dataField: "ScheduleQty", visible: true, width: 100, caption: "Schedule Qty" },
        { dataField: "ProductionQuantity", visible: true, width: 90, caption: "Production Qty" },
        { dataField: "ConversionValue", visible: true, width: 50, caption: "Steps" },
        { dataField: "ReadyQuantity", visible: true, width: 90, caption: "Ready Qty" },
        { dataField: "WastageQuantity", visible: true, width: 90, caption: "Wastage Qty" },
        { dataField: "SuspenseQuantity", visible: true, width: 90, caption: "Suspense Qty" },
        { dataField: "FromTime", visible: true, width: 100, caption: "Start Time" },
        { dataField: "ToTime", visible: true, width: 100, caption: "End Time" },
        { dataField: "Speed", visible: true, width: 100, caption: "Speed" },
        { dataField: "TimeToBeTaken", visible: false, width: 120, caption: "Time Taken" },
        { dataField: "Status", visible: true, width: 100, caption: "Status" }
    ],
    onCellPrepared(e) {
        if (e.rowType !== "data" && e.columnIndex !== 0) return;
        if (e.column.dataField === "RefNo") {
            e.cellElement.css('background-color', '#ff9600');
            e.cellElement.css('color', 'white');
        }
    }
});

$("#ProductionDetailsButton").click(function () {
    ProductionDetailFun();
    document.getElementById("ProductionDetailsButton").setAttribute("data-toggle", "modal");
    document.getElementById("ProductionDetailsButton").setAttribute("data-target", "#largeModalHSNGroup");
});

$("#SelStatus").dxSelectBox({
    items: [],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true,
    disabled: true
});

function ProductionDetailFun() {
    if (ProductionDetailsGridData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }
    var JobBookingJobCardContentsID = ProductionDetailsGridData[0].JobBookingJobCardContentsID;

    document.getElementById("ChangeStatusDiv").style.display = "none";
    $.ajax({
        type: "POST",
        url: "WebService_JobStatusModification.asmx/GetProductionDetailPopUp",
        data: '{JobBookingJobCardContentsID:' + JSON.stringify(JobBookingJobCardContentsID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#ProductionDetailsGrid").dxDataGrid({
                dataSource: RES1
            });

            $.ajax({
                type: "POST",
                url: "WebService_JobStatusModification.asmx/OperationDetailData",
                data: '{JobBookingJobCardContentsID:' + JSON.stringify(JobBookingJobCardContentsID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/:,/g, ':null,');
                    res = res.replace(/u0026/g, '&');
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
}

$("#AddProcessButton").click(function () {
    if (ProductionDetailsGridData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }

    document.getElementById("AddProcessButton").setAttribute("data-toggle", "modal");
    document.getElementById("AddProcessButton").setAttribute("data-target", "#largeModalAddProcess");
});

$(function () {
    var ProcessSlabs = [];
    $.ajax({
        type: 'POST',
        async: false,
        url: "WebService_JobStatusModification.asmx/LoadOperationsSlabs",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/(?:\r\n|\r|\n)/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.substr(1);
            res = res.slice(0, -1);
            ProcessSlabs = JSON.parse(res.toString());
            $.ajax({
                type: 'POST',
                url: "WebService_JobStatusModification.asmx/LoadOperations",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{}",
                success: function (results) {
                    if (results.d === "500") return;
                    var res = results.d.replace(/\\/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    res = res.replace(/:,/g, ':null,');
                    res = res.replace(/u0026/g, '&');

                    ShowOperationGrid(JSON.parse(res.toString()), ProcessSlabs);
                },
                error: function errorFunc(jqXHR) {
                    // alert(jqXHR.message);
                }
            });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
});

var OprIds = [];
function ShowOperationGrid(dataSource, slabNames) {
    $("#GridOperation").dxDataGrid({                  //// GridOperation  gridopr
        dataSource: {
            store: {
                type: "array",
                data: dataSource,
                key: "ProcessID"
            }
        },
        allowEditing: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        sorting: { mode: 'multiple' },
        columns: [{ dataField: "ProcessID", visible: false, width: 0 }, { dataField: "ProcessName" },
        { dataField: "Rate", width: 50 },
        { dataField: "TypeofCharges" },
        { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80 },
        { dataField: "MinimumCharges", visible: false },
        { dataField: "SetupCharges", visible: false },
        { dataField: "PrePress", visible: false },
        { dataField: "ChargeApplyOnSheets", visible: false },
        {
            dataField: "RateFactor", fixedPosition: "right", fixed: true,
            lookup: {
                dataSource: function (options) {
                    return {
                        store: slabNames,
                        filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
                    };
                },
                displayExpr: "RateFactor",
                valueExpr: "RateFactor"
            },
            width: 180
        },
        {
            dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 40,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
            }
        }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "RateFactor") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
        },
        showRowLines: true,
        showBorders: true,
        loadPanel: {
            enabled: false
        },
        scrolling: {
            mode: 'infinite'
        },
        paging: {
            pageSize: 100
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 1.3;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Add") {
                try {

                    var dataGrid = $('#GridOperationAllocated').dxDataGrid('instance');
                    var newdata = [];
                    newdata.ProcessID = clickedCell.data.ProcessID;
                    newdata.ProcessName = clickedCell.data.ProcessName;
                    newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                    newdata.RateFactor = clickedCell.data.RateFactor;

                    var clonedItem = $.extend({}, newdata);
                    dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                    dataGrid.refresh(true);

                    OprIds.push(clickedCell.data.ProcessID);

                    //dataGrid._events.preventDefault();
                    DevExpress.ui.notify("Process added..!", "success", 1000);
                    //clickedCell.component.clearFilter();
                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
            e.rowElement.css({ height: 15 });
        }
    });

    $("#GridOperationAllocated").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        sorting: { mode: 'none' },
        columns: [{ dataField: "ProcessID", visible: false, width: 0 }, { dataField: "ProcessName" },
        { dataField: "Rate" },
        { dataField: "RateFactor", visible: true },
        {
            dataField: "Delete", fixedPosition: "right", fixed: true, width: 50,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        }],
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        filterRow: { visible: false },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Delete") {
                try {
                    clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                    clickedCell.component.deleteRow(clickedCell.rowIndex);
                    //clickedCell.component.refresh(true);
                    var index = OprIds.indexOf(clickedCell.data.ProcessID);
                    if (index > -1) {
                        OprIds.splice(index, 1);
                        DevExpress.ui.notify("Process removed..!", "error", 1000);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        height: function () {
            return window.innerHeight / 1.3;
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        }
    });
}

$("#AddNewProcess").click(function () {
    var GridOperationAllocated = $('#GridOperationAllocated').dxDataGrid('instance');
    var GridOperationAllocatedRow = GridOperationAllocated._options.dataSource.length;

    var JobStatusGrid = $('#JobStatusGrid').dxDataGrid('instance');
    var JobStatusGridRow = JobStatusGrid._options.dataSource.length;

    var optJobStatus = {};
    var SrNo = JobStatusGridRow;
    for (var j = 0; j < GridOperationAllocatedRow; j++) {

        var result = $.grep(JobStatusGrid._options.dataSource, function (e) {
            return e.ProcessID === GridOperationAllocated._options.dataSource[j].ProcessID && e.RateFactor === GridOperationAllocated._options.dataSource[j].RateFactor;
        });
        if (result.length === 1) {
            DevExpress.ui.notify("This process already exist..! Please select another process..!", "warning", 1500);
            continue;
        }

        optJobStatus = {};

        optJobStatus.ProcessID = GridOperationAllocated._options.dataSource[j].ProcessID;
        optJobStatus.SN = Number(SrNo) + 1;
        optJobStatus.ProcessName = GridOperationAllocated._options.dataSource[j].ProcessName;
        optJobStatus.RateFactor = GridOperationAllocated._options.dataSource[j].RateFactor;
        optJobStatus.JobBookingJobCardContentsID = JobStatusGrid._options.dataSource[0].JobBookingJobCardContentsID;
        optJobStatus.PlanContentType = JobStatusGrid._options.dataSource[0].PlanContentType;
        optJobStatus.PlanContName = JobStatusGrid._options.dataSource[0].PlanContName;
        optJobStatus.PlanContQty = JobStatusGrid._options.dataSource[0].PlanContQty;
        optJobStatus.ToBeProduceQuantity = 0;
        optJobStatus.ScheduleQty = 0;
        optJobStatus.ProductionQuantity = 0;
        optJobStatus.ReadyQuantity = 0;
        optJobStatus.WastageQuantity = 0;
        optJobStatus.SuspenseQuantity = 0;
        optJobStatus.Status = "In Queue";
        optJobStatus.PaperConsumptionRequired = false;

        //JobStatusGridData.push(optJobStatus);

        SrNo = SrNo + 1;
    }

    var clonedItem = $.extend({}, optJobStatus);
    JobStatusGrid._options.dataSource.splice(JobStatusGrid._options.dataSource.length, 0, clonedItem);
    JobStatusGrid.refresh(true);

    document.getElementById("AddNewProcess").setAttribute("data-dismiss", "modal");
    document.getElementById("AddNewProcess").setAttribute("data-target", "#largeModalAddProcess");

});

$("#BtnSaveProcess").click(function () {
    if (ProductionDetailsGridData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }
    var JobBookingJobCardContentsID = ProductionDetailsGridData[0].JobBookingJobCardContentsID;
    var JCNO = ProductionDetailsGridData[0].JobCardContentNo;
    var JCID = $('#SelJobCard').dxSelectBox('instance').option('value');

    var jsonObjects = [];
    var jsonUpdtObjects = [];
    var jsonJobObjects = [];
    var optRecord = {}, optJobRecord = {};

    var GridJobStatus = $('#JobStatusGrid').dxDataGrid('instance');
    var GridJobStatusRow = GridJobStatus._options.dataSource.length;

    if (GridJobStatusRow <= 0) return false;
    for (var t = 0; t < GridJobStatusRow; t++) {
        optRecord = {};
        optJobRecord = {};

        if (GridJobStatus._options.dataSource[t].JobBookingJobCardProcessID > 0) {
            optRecord.JobBookingJobCardProcessID = GridJobStatus._options.dataSource[t].JobBookingJobCardProcessID;
        }

        optJobRecord.ProcessID = optRecord.ProcessID = GridJobStatus._options.dataSource[t].ProcessID;
        optJobRecord.RateFactor = optRecord.RateFactor = GridJobStatus._options.dataSource[t].RateFactor;
        optJobRecord.JobBookingJobCardContentsID = optRecord.JobBookingJobCardContentsID = GridJobStatus._options.dataSource[t].JobBookingJobCardContentsID;
        optJobRecord.JobBookingID = optRecord.JobBookingID = JCID;// GridJobStatus._options.dataSource[t].JobBookingID;
        optJobRecord.SequenceNo = optRecord.SequenceNo = t + 1;
        if (GridJobStatus._options.dataSource[t].Status === "" || GridJobStatus._options.dataSource[t].Status === undefined) GridJobStatus._options.dataSource[t].Status = "In Queue";
        optJobRecord.Status = optRecord.Status = GridJobStatus._options.dataSource[t].Status;
        optJobRecord.PaperConsumptionRequired = GridJobStatus._options.dataSource[t].PaperConsumptionRequired;

        if (optRecord.JobBookingJobCardProcessID > 0) {
            optRecord.PaperConsumptionRequired = GridJobStatus._options.dataSource[t].PaperConsumptionRequired;
            jsonUpdtObjects.push(optRecord);
        } else {
            jsonObjects.push(optRecord);

            optJobRecord.BookingID = GridJobStatus._options.dataSource[0].BookingID;
            optJobRecord.PlanContQty = GridJobStatus._options.dataSource[0].PlanContQty;
            optJobRecord.PlanContentType = GridJobStatus._options.dataSource[0].PlanContentType;
            optJobRecord.PlanContName = GridJobStatus._options.dataSource[0].PlanContName;

            jsonJobObjects.push(optJobRecord);
        }
    }

    jsonObjects = JSON.stringify(jsonObjects);

    try {
        swal({
            title: "Saving Process....",
            text: "Do you want to continue..?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Save",
            closeOnConfirm: true
        },
            function () {
                document.getElementById("LOADER").style.display = "block";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_JobStatusModification.asmx/SaveProcessData",
                        data: '{jsonObjects:' + jsonObjects + ',jsonUpdtObjects:' + JSON.stringify(jsonUpdtObjects) + ',jsonJobObjects:' + JSON.stringify(jsonJobObjects) + ',JobBookingJobCardContentsID:' + JSON.stringify(JobBookingJobCardContentsID) + ',JCNO:' + JSON.stringify(JCNO) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);

                            document.getElementById("LOADER").style.display = "none";

                            if (res === "Success") {
                                swal("Saved..!", "Your data updated", "success");
                                GetContProcesList();
                            } else {
                                swal("Error..!", res, "error");
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            document.getElementById("LOADER").style.display = "none";
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    } catch (e) {
        console.log(e);
    }

});

////Chart Init
$("#chartMachineLoads").dxChart({
    rotated: true,
    dataSource: [],
    series: {
        label: {
            visible: true,
            backgroundColor: "#c18e92"
        },
        color: "#79cac4",
        type: "bar",
        argumentField: "MachineName",
        valueField: "MachineLoadInHr"
    },
    title: "Machine Loads(In Hrs)",
    argumentAxis: {
        label: {
            customizeText: function () {
                return this.valueText;
            }
        }
    },
    valueAxis: {
        tick: {
            visible: false
        },
        label: {
            visible: false
        }
    },
    "export": {
        enabled: true
    },
    legend: {
        visible: false
    }
});

///Chart Data Function Ajax
function getMachineLoads(PId) {
    $.ajax({
        type: "POST",
        url: "WebService_JobStatusModification.asmx/GetMachineWiseLoads",
        data: '{PId:' + PId + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#chartMachineLoads").dxChart({
                dataSource: RES1
            });
        }
    });
}

//GetMachineName
$.ajax({
    type: "POST",
    url: "WebService_JobStatusModification.asmx/GetMachine",
    data: '{}',
    async: false,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        AllMachine = [];
        AllMachine = JSON.parse(res);
    }
});

/////Process Details Grid
function CalculateTtlTime(e) {
    var TtlTime = Number(e.ScheduleQty) / Number(e.MachineSpeed);
    if (isNaN(TtlTime)) { TtlTime = 0; } else { TtlTime = Math.ceil(TtlTime); }
    return TtlTime;
}

$("#gridFormWiseDetail").dxDataGrid({
    dataSource: GridScheduleReleaseData,//FormWiseDetail,
    showBorders: true,
    paging: { enabled: false },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 1.5;
    },
    sorting: {
        mode: "none"
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "ToBeProduceQty", caption: "To Be Produce Qty", allowEditing: FlagEditScheduleQty },
        { dataField: "ScheduleQty", caption: "Schedule Qty", allowEditing: true },
        {
            dataField: "MachineID", caption: "Machine", width: 150,
            allowEditing: true,
            setCellValue: function (rowData, value) {
                rowData.MachineID = value;
                var result = $.grep(AllMachine, function (e) { return e.MachineID === value; });
                if (result.length >= 1) {
                    rowData.MachineSpeed = result[0].MachineSpeed;
                }
            },
            lookup: {
                dataSource: function (options) {
                    return {
                        store: AllMachine,
                        filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
                    };
                },
                valueExpr: "MachineID",
                displayExpr: "MachineName"
            }
        },
        { dataField: "MachineSpeed", caption: "Machine Speed", allowEditing: true },
        {
            dataField: "TotalTimeToBeTaken", caption: "Ttl Time", allowEditing: true, calculateCellValue: function (e) { return CalculateTtlTime(e); }
        },
        {
            dataField: "RemoveRow", caption: "", allowEditing: false, fixedPosition: "right", fixed: true, width: 30,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID" }
    ],
    rowDragging: {
        allowReordering: true,
        onReorder: function (e) {
            var visibleRows = e.component.getVisibleRows(),
                toIndex = e.component._options.dataSource.indexOf(visibleRows[e.toIndex].data),
                fromIndex = e.component._options.dataSource.indexOf(e.itemData);

            e.component._options.dataSource.splice(fromIndex, 1);
            e.component._options.dataSource.splice(toIndex, 0, e.itemData);

            e.component.refresh();
        }
    },
    onSelectionChanged: function (e) {
        var FrmdataObj = e.selectedRowsData;
        if (FrmdataObj.length > 0) getMachineLoads(FrmdataObj[0].ProcessID);
    },
    onRowUpdated: function (e) {
        try {
            var newdata = [];
            newdata = e.data;
            newdata.TotalTimeToBeTaken = CalculateTtlTime(newdata);

            var total = 0;
            var GridDataSource = e.component._options.dataSource;
            for (var i = 0; i < GridDataSource.length; i++) {
                if (GridDataSource[i].ProcessID === e.data.ProcessID && GridDataSource[i].JobCardFormNo === e.data.JobCardFormNo && GridDataSource[i].RateFactor === e.data.RateFactor) {
                    total += Number(GridDataSource[i].ScheduleQty) << 0;
                }
            }
            if (total > Number(e.data.ToBeProduceQty)) {
                e.data.ScheduleQty = 0;
            } else if (Number(e.data.ScheduleQty) < Number(e.data.ToBeProduceQty) && Number(e.data.ToBeProduceQty) - Number(total) > 0) {
                var clonedItem = $.extend({}, newdata);
                clonedItem.ScheduleQty = Number(e.data.ToBeProduceQty) - Number(total);
                clonedItem.SequenceNo = e.component._options.dataSource.length;
                clonedItem.TotalTimeToBeTaken = CalculateTtlTime(clonedItem);
                clonedItem.ScheduleSequenceID = 0;

                e.component._options.dataSource.splice(e.component.getRowIndexByKey(newdata) + 1, 0, clonedItem);
                e.component.refresh(true);
            }
        } catch (e) {
            console.log(e);
        }
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "RemoveRow") {
            try {
                var total = 0;
                var GridDataSource = clickedCell.component._options.dataSource;
                for (var i = 0; i < GridDataSource.length; i++) {
                    if (GridDataSource[i].ProcessID === clickedCell.data.ProcessID && GridDataSource[i].JobCardFormNo === clickedCell.data.JobCardFormNo && GridDataSource[i].RateFactor === clickedCell.data.RateFactor) {
                        total += Number(GridDataSource[i].ScheduleQty) << 0;
                    }
                }
                if (total - Number(clickedCell.data.ScheduleQty) > 0) {
                    clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                    clickedCell.component.deleteRow(clickedCell.rowIndex);
                    clickedCell.component.refresh(true);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getMachineLoads(clickedCell.data.ProcessID);
    }
});

$("#BtnScheduleRelease").click(function () {
    var JCID = $('#SelJobCard').dxSelectBox('instance').option('value');
    if (ProductionDetailsGridData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }
    document.getElementById("LOADER").style.display = "block";

    var jsonObjects = [], jsonUpdtObjects = [];
    var optRecord = {};

    var gridFormWiseDetail = $('#gridFormWiseDetail').dxDataGrid('instance');
    var gridFormWiseDetailRow = gridFormWiseDetail._options.dataSource.length;

    if (gridFormWiseDetailRow <= 0) return false;
    for (var t = 0; t < gridFormWiseDetailRow; t++) {
        optRecord = {};
        var newArray = AllMachine.filter(function (el) {
            return el.MachineID === gridFormWiseDetail._options.dataSource[t].MachineID;
        });
        if (gridFormWiseDetail._options.dataSource[t].ScheduleSequenceID > 0) {
            optRecord.ScheduleSequenceID = gridFormWiseDetail._options.dataSource[t].ScheduleSequenceID;
        }

        optRecord.JobBookingJobCardContentsID = ProductionDetailsGridData[0].JobBookingJobCardContentsID;
        optRecord.MachineID = gridFormWiseDetail._options.dataSource[t].MachineID;
        optRecord.MachineName = newArray[0].MachineName;//gridFormWiseDetail._options.dataSource[t].Ups;
        optRecord.MachineSpeed = gridFormWiseDetail._options.dataSource[t].MachineSpeed;
        optRecord.ScheduleQty = gridFormWiseDetail._options.dataSource[t].ScheduleQty;
        optRecord.TotalTimeToBeTaken = gridFormWiseDetail._options.dataSource[t].TotalTimeToBeTaken;

        if (optRecord.ScheduleSequenceID > 0) {
            jsonUpdtObjects.push(optRecord);
        } else {
            optRecord.JobCardFormNo = gridFormWiseDetail._options.dataSource[t].JobCardFormNo;
            optRecord.ProcessID = gridFormWiseDetail._options.dataSource[t].ProcessID;
            optRecord.RateFactor = gridFormWiseDetail._options.dataSource[t].RateFactor;
            optRecord.JobBookingID = JCID; // gridFormWiseDetail._options.dataSource[t].JobBookingID;
            optRecord.JobCardContentNo = ProductionDetailsGridData[0].JobCardContentNo;
            optRecord.JobName = ProductionDetailsGridData[0].JobName;
            optRecord.ContentName = ProductionDetailsGridData[0].ContentName;
            optRecord.ProcessName = gridFormWiseDetail._options.dataSource[t].ProcessName;

            jsonObjects.push(optRecord);
        }
    }

    try {
        $.ajax({
            type: "POST",
            url: "WebService_JobStatusModification.asmx/SaveFormDetailData",
            data: '{jsonObjects:' + JSON.stringify(jsonObjects) + ',jsonUpdtObjects:' + JSON.stringify(jsonUpdtObjects) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);

                document.getElementById("LOADER").style.display = "none";

                if (res === "Success") {
                    swal("Saved Successfully..!", "Schedule for selected process saved successfully...", "success");
                    GetContProcesList();
                } else {
                    swal("Not Saved..!", res, "warning");
                }
            },
            error: function errorFunc(jqXHR) {
                document.getElementById("LOADER").style.display = "none";
                swal("Error!", "Please try after some time..", "error");
                console.log(jqXHR);
            }
        });
    } catch (e) {
        document.getElementById("LOADER").style.display = "none";
        console.log(e);
    }
});

$("#ChangeStatusButton").click(function () {
    var SelStatus = $('#SelStatus').dxSelectBox('instance').option('value');
    if (GetScheduleData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }
    if (SelStatus === "" || SelStatus === null) {
        DevExpress.ui.notify("Please select status that you want to change..!", "warning", 1500);
        return false;
    }
    var JobBookingJobCardContentsID = GetScheduleData[0].JobBookingJobCardContentsID;
    if (JobBookingJobCardContentsID === undefined) return false;
    try {
        var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
        swal({
            title: "Do you want to continue",
            text: txt,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Save it !",
            closeOnConfirm: false
        },
            function () {
                document.getElementById("LOADER").style.display = "block";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_JobStatusModification.asmx/SaveStatusChange",
                        data: '{JobBookingJobCardContentsID:' + JSON.stringify(JobBookingJobCardContentsID) + ',SelStatus:' + JSON.stringify(SelStatus) + ',ProcessID:' + JSON.stringify(GetScheduleData[0].ProcessID) + ',ScheduleSequenceID:' + JSON.stringify(GetScheduleData[0].ScheduleSequenceID) + ',RateFactor:' + JSON.stringify(GetScheduleData[0].RateFactor) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);

                            document.getElementById("LOADER").style.display = "none";

                            if (res === "Success") {
                                swal("Saved..!", "Your data updated", "success");
                                ProductionDetailFun();
                            } else
                                swal("Error..!", res, "warning");

                        },
                        error: function errorFunc(jqXHR) {
                            document.getElementById("LOADER").style.display = "none";
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    } catch (e) {
        console.log(e);
    }
});

$("#ProductDetailDelteButton").click(function () {
    if (ProductionDetailsGridSelectedData.length === 0) {
        DevExpress.ui.notify("Please select job card content..!", "warning", 1000);
        return false;
    }
    var JobBookingJobCardContentsID = ProductionDetailsGridSelectedData[0].JobBookingJobCardContentsID;
    if (ProductionDetailsGridSelectedData.length < 1) {
        DevExpress.ui.notify("Please choose production process..!", "warning", 1500);
        return false;
    }

    try {
        swal({
            title: "Are you sure?",
            text: 'You will not be able to recover this "' + ProductionDetailsGridSelectedData[0].ProcessName + '"..!',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
            function () {
                document.getElementById("LOADER").style.display = "block";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_JobStatusModification.asmx/DeleteProductionDetail",
                        data: '{JobBookingJobCardContentsID:' + JSON.stringify(JobBookingJobCardContentsID) + ',ProductionID:' + JSON.stringify(ProductionDetailsGridSelectedData[0].ProductionID) + ',ProcessID:' + JSON.stringify(ProductionDetailsGridSelectedData[0].ProcessID) + ',RateFactor:' + JSON.stringify(ProductionDetailsGridSelectedData[0].RateFactor) + ',JobCardFormNo:' + JSON.stringify(ProductionDetailsGridSelectedData[0].JobCardFormNo) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            document.getElementById("LOADER").style.display = "none";
                            if (res === "Success") {
                                swal("Saved!", "Your data updated", "success");
                                ProductionDetailFun();
                            }

                        },
                        error: function errorFunc(jqXHR) {
                            document.getElementById("LOADER").style.display = "none";
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            });
    } catch (e) {
        console.log(e);
    }
});