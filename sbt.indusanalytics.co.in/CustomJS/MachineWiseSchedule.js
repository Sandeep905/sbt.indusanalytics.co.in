"use strict";
var GblScheduleData = [];
var Machineids = [];
var ObjUniqueMachine = [];
var GblMachineID = 0;

var dataGrid = $("#MachineScheduleGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnResizing: true,
    allowSorting: false,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, apolyFilter: "auto" },
    paging: false,
    sorting: false,
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
        dataGrid.option("rowDragging.showDragIcons", true);
        if (e.rowType === "data") {
            if (e.data.JobPriority.toUpperCase() === "EMERGENCY") {
                e.rowElement.css('background', '#ff0b0bb3');
                e.rowElement.css('color', 'white');
            }
        }
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
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
    columns: [
        { dataField: "ProcessName", visible: true, fixedPosition: "left", fixed: true, caption: "Process Name" },
        { dataField: "RateFactor", visible: true, caption: "Rate Factor" },
        { dataField: "JobBookingNo", visible: true, caption: "JC No" },
        { dataField: "JobCardContentNo", visible: true, caption: "JC Content No" },
        { dataField: "JCFormNo", visible: true, caption: "JC Form No" },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "ContentName", visible: true, caption: "Content Name", width: 180 },
        { dataField: "ScheduleQty", visible: true, caption: "Schedule Qty" },
        { dataField: "DeliveryDate", visible: true, caption: "Delivery Date" },
        { dataField: "JCBY", visible: false, caption: "JC By" },
        {
            dataField: "StartTime", visible: true, caption: "Start Time",
            dataType: "date", format: "dd-MMM-yyyy HH:mm:ss", // format: "shortDateShortTime",
            calculateCellValue: function (e) {
                return new Date(parseInt(e.StartTime.substr(6)));
            }
        },
        {
            dataField: "EndTime", visible: true, caption: "End Time", dataType: "date", format: "dd-MMM-yyyy HH:mm:ss", // format: "shortDateShortTime",
            calculateCellValue: function (e) {
                return new Date(parseInt(e.EndTime.substr(6)));
            }
        },
        { dataField: "JobPriority", visible: true, caption: "Priority" }]
}).dxDataGrid("instance");

var MachineGrid = $("#MachineGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnResizing: true,
    allowSorting: false,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, apolyFilter: "auto" },
    paging: false,
    sorting: false,
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
        dataGrid.option("rowDragging.showDragIcons", true);
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    columns: [{ dataField: "MachineName", visible: true, fixedPosition: "left", fixed: true, caption: "Machine Name" }],
    onSelectionChanged: function (e) {
        if (e.selectedRowsData.length <= 0) {
            GblMachineID = 0;
            return;
        }
        GblMachineID = e.selectedRowsData[0].MachineID;
        var selectedMachineData = $.grep(GblScheduleData, function (GblScheduleData) {
            return GblScheduleData.MachineID === e.selectedRowsData[0].MachineID;
        });
        $("#MachineScheduleGrid").dxDataGrid({
            dataSource: selectedMachineData
        });
    }
}).dxDataGrid("instance");

var Types = ["Suggested Machine Schedule", "Available Machine Schedule"];
var radioGroup = $("#OptionScheduleType").dxRadioGroup({
    items: Types,
    layout: "horizontal",
    onValueChanged: function (e) {
        $("#MachineScheduleGrid").dxDataGrid({ dataSource: [] });
        $("#MachineGrid").dxDataGrid({ dataSource: [] });

        if (e.value === "Suggested Machine Schedule") { GetMachineScheduleData(""); } else { GetMachineScheduleData("Temp"); }
    }
}).dxRadioGroup("instance");
radioGroup.option("value", Types[0]);

function GetMachineScheduleData(e) {
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/GetAllMachineScheduleList",
        data: '{TName:' + JSON.stringify(e) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:},/g, ':null},');
            res = res.substr(1);
            res = res.slice(0, -1);
            GblScheduleData = JSON.parse(res.toString());
            ObjUniqueMachine = [], Machineids = [];
            // --------------- Remove Duplicate Machine------------------------
            $.each(GblScheduleData, function (index, value) {
                if ($.inArray(value.MachineID, Machineids) === -1) {
                    Machineids.push(value.MachineID);
                    ObjUniqueMachine.push(value);
                }
            });
            // ---------------Close Remove Duplicate Machine------------------------

            $("#MachineGrid").dxDataGrid({
                dataSource: ObjUniqueMachine
            });
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR);
        }
    });
}

$("#BtnCopySchedule").click(function () {
    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: true
    },
        function () {
            $.ajax({
                type: "POST",
                url: "WebService_NewSchedularPlanner.asmx/SaveAsMachineSchedule",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = JSON.parse(results);
                    if (res.d === "Success") {
                        DevExpress.ui.notify("Suggested schedule copied successfully", "success", 1500);
                        radioGroup.option("value", Types[1]);
                    } else {
                        DevExpress.ui.notify(res.d, "error", 1500);
                    }
                },
                error: function errorFunc(jqXHR) {
                    alert(jqXHR);
                }
            });
        });
});

$("#BtnSave").click(function () {
    var ObjData = {};
    var ArrObjData = [];
    if (dataGrid._options.dataSource.length <= 0 || GblMachineID <= 0) return;
    for (var i = 0; i < dataGrid._options.dataSource.length; i++) {
        ObjData = {};
        ObjData.FinalScheduleID = dataGrid._options.dataSource[i].FinalScheduleID;
        ObjData.ScheduleID = dataGrid._options.dataSource[i].ScheduleID;
        ObjData.JobBookingJobcardContentsID = dataGrid._options.dataSource[i].JobBookingJobcardContentsID;
        ObjData.JobCardContentNo = dataGrid._options.dataSource[i].JobCardContentNo;
        ObjData.JCFormNo = dataGrid._options.dataSource[i].JCFormNo;
        ObjData.ProcessID = dataGrid._options.dataSource[i].ProcessID;
        ObjData.TransID = i + 1;
        ArrObjData.push(ObjData);
    }
    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: true
    },
        function () {
            $.ajax({
                type: "POST",
                url: "WebService_NewSchedularPlanner.asmx/UpdateMachineSchedule",
                data: '{ObjData:' + JSON.stringify(ArrObjData) + ',MId:' + GblMachineID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = JSON.parse(results);
                    if (res.d.includes("Error:")) {
                        DevExpress.ui.notify(res.d, "error", 1500);
                    } else {
                        DevExpress.ui.notify(res.d, "success", 1500);
                        GetMachineScheduleData("Temp");
                    }
                },
                error: function errorFunc(jqXHR) {
                    alert(jqXHR);
                }
            });
        });

});

$("#BtnPrint").click(function () {
    window.open("PrintMachineWiseSchedule.aspx", "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
});