"use strict";

var dataGridList = $("#JobScheduleGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnResizing: true,
    allowSorting: false,
    columnResizingMode: "widget",
    filterRow: { visible: true, apolyFilter: "auto" },
    sorting: false,
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
        dataGrid.option("rowDragging.showDragIcons", true);
    },
    height: function () {
        return window.innerHeight / 2;
    },
    columns: [
        { dataField: "BookingNo", visible: true, caption: "Quote No" },
        { dataField: "LedgerName", visible: true, caption: "Client Name", width: 180 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "JobBookingNo", visible: true, caption: "Job Card No" },
        { dataField: "JobCardContentNo", visible: true, caption: "JC Content No" },
        { dataField: "ContentName", visible: true, caption: "Content Name", width: 180 },
        { dataField: "JobBookingDate", visible: true, caption: "Job Date", width: 80 },
        // { dataField: "ScheduleQty", visible: true, caption: "Schedule Qty" },
        { dataField: "DeliveryDate", visible: true, caption: "Delivery Date", width: 80 },
        { dataField: "JCBY", visible: false, caption: "JC By" },
        { dataField: "ReleasedBy", visible: true, caption: "Scheduled By" },
        { dataField: "ReleasedDate", visible: true, caption: "Released Date", width: 80 },
        {
            dataField: "AddRow", caption: "", visible: true, fixedPosition: "right", fixed: true, width: 35,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
            }
        }],
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "AddRow") {
            try {
                var newdata = [];
                var dataGrid = $('#JobScheduleSequenceGrid').dxDataGrid('instance');
                if (dataGrid._options.dataSource.length > 15) {
                    DevExpress.ui.notify("Only 15 job card can be added at a time..!", "warning", 1000);
                    return;
                }
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                newdata = clickedCell.data;

                dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, newdata);
                dataGrid.refresh(true);

            } catch (e) {
                console.log(e);
            }
        }
    }
}).dxDataGrid("instance");

var dataGrid = $("#JobScheduleSequenceGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnResizing: true,
    allowSorting: false,
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
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
        dataGrid.option("rowDragging.showDragIcons", true);
    },
    height: function () {
        return window.innerHeight / 2;
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
        { dataField: "BookingNo", visible: true, caption: "Quote No", width: 60 },
        { dataField: "LedgerName", visible: true, caption: "Client Name" },
        { dataField: "JobName", visible: true, caption: "Job Name" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Card No" },
        { dataField: "JobCardContentNo", visible: true, caption: "JC Content No" },
        { dataField: "JobBookingDate", visible: true, caption: "Job Date" },
        //{ dataField: "ScheduleQty", visible: true, caption: "Schedule Qty" },
        { dataField: "DeliveryDate", visible: true, caption: "Delivery Date" },
        { dataField: "JCBY", visible: false, caption: "JC By" },
        { dataField: "ReleasedBy", visible: true, caption: "Scheduled By" },
        { dataField: "ReleasedDate", visible: true, caption: "Released Date" },
        {
            dataField: "RemoveRow", caption: "", visible: true, fixedPosition: "right", fixed: true, width: 20,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        }],
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "RemoveRow") {
            try {
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                var dataGrid = $('#JobScheduleGrid').dxDataGrid('instance');
                var newdata = clickedCell.data;

                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, newdata);
                dataGrid.refresh(true);

            } catch (e) {
                console.log(e);
            }
        }
    }
}).dxDataGrid("instance");

$.ajax({
    type: "POST",
    url: "WebService_NewSchedularPlanner.asmx/GetAllScheduleSequenceList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());
        $("#JobScheduleGrid").dxDataGrid({
            dataSource: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        alert(jqXHR);
    }
});

$("#BtnSave").click(function () {
    var Obj_UpdateDate = [];
    var Opt_Data = {};
    if (dataGrid._options.dataSource.length > 0) {
        for (var h = 0; h < dataGrid._options.dataSource.length; h++) {
            Opt_Data = {};
            Opt_Data.SequenceNo = h + 1;
            Opt_Data.BookingNo = dataGrid._options.dataSource[h].BookingNo;
            //Opt_Data.JobBookingNo = dataGrid._options.dataSource[h].JobBookingNo;
            Opt_Data.ScheduleID = dataGrid._options.dataSource[h].ScheduleID;
            Opt_Data.ScheduleDate = dataGrid._options.dataSource[h].ScheduleDate;
            Opt_Data.JobBookingID = dataGrid._options.dataSource[h].JobBookingID;
            Opt_Data.JobBookingJobCardContentsID = dataGrid._options.dataSource[h].JobBookingJobCardContentsID;

            Obj_UpdateDate.push(Opt_Data);
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
                $('#LoadIndicator').dxLoadPanel('instance').option('visible', true);
                $.ajax({
                    type: "POST",
                    url: "WebService_NewSchedularPlanner.asmx/UpdateJobScheduleSequence",
                    data: '{Obj_UpdateDate:' + JSON.stringify(Obj_UpdateDate) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'text',
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/""/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        res = res.replace(/"-":/g, '');
                        res = res.replace(/"/g, '');
                        $('#LoadIndicator').dxLoadPanel('instance').option('visible', false);
                        if (res === "Success") {
                            DevExpress.ui.notify("Data Successfully Updated", "success", 1000);
                            location.reload();
                        }
                        else {
                            DevExpress.ui.notify("Someting wrong..! Please try again.." + res, "error", 2000);
                        }
                    }
                });
            });
    }
    else {
        DevExpress.ui.notify("There is no data for update..", "error", 1000);
    }
});