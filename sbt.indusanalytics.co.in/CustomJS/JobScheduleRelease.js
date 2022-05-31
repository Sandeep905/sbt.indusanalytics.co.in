"use strict";

var PageLoadRES1 = [], AllocatedGrid = [], DeliveryGrid = [], FormWiseDetail = [], FinalGridDetail = [], AllMachine = [];
var gridScheduleListObj = [];

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading ...",
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#dateboxJCDateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#dateboxTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#DeldateboxJCDateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#DeldateboxTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#ReleaseDateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#ReleasedateTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

//GetMachineName
$.ajax({
    type: "POST",
    url: "WebService_NewSchedularPlanner.asmx/GetMachine",
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

$("#GridJobList").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: {
        enabled: false
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    height: function () {
        return window.innerHeight / 1.25;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    sorting: {
        mode: "single"
    },
    selection: { mode: "single" },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "LedgerName", caption: "Client Name", width: 180, minWidth: 100 },
        { dataField: "JobBookingNo", caption: "JC No" },
        { dataField: "JobBookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy' },
        { dataField: "JobName", caption: "Job Name", width: 200, minWidth: 100 },
        { dataField: "SalesOrderNO", caption: "Sales Order No", maxWidth: 100 },
        { dataField: "PONO", caption: "PO No", width: 80 },
        { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy' },
        { dataField: "OrderQuantity", caption: "JC Qty", width: 100 },
        { dataField: "ProductCode", caption: "Product Code" },
        { dataField: "JobPriority", caption: "Priority" },
        { dataField: "CategoryName", caption: "Category" }
    ],
    onSelectionChanged: function (Sel) {
        var data = Sel.selectedRowsData;
        $("#gridScheduleList").dxDataGrid({
            dataSource: []
        });
        if (data.length > 0) {
            var JCId = data[0].JobBookingID;
            $.ajax({
                type: "POST",
                url: "WebService_NewSchedularPlanner.asmx/GetSchedulePlanner",
                data: '{JCId:' + JCId + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.replace(/u0027/g, "'");
                    res = res.replace(/:,/g, ":null,");
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res);
                    $("#gridScheduleList").dxDataGrid({
                        dataSource: RES1
                    });

                    $("#MaxBtn").click();
                }
            });
        }
    }
});

$("#gridScheduleList").dxDataGrid({
    dataSource: PageLoadRES1,
    showBorders: true,
    paging: {
        enabled: false
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    height: function () {
        return window.innerHeight / 3;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    sorting: {
        mode: "single"
    },
    selection: { mode: "single" },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "LedgerName", caption: "Client Name", width: 180, minWidth: 100 },
        { dataField: "JobName", caption: "Job Name", width: 200, minWidth: 100 },
        { dataField: "SalesOrderNO", caption: "Sales Order No" },
        { dataField: "PONO", caption: "PO No", width: 60 },
        { dataField: "JobCardContentNo", caption: "JC Content No" },
        { dataField: "PlanContName", caption: "Content Name", width: 180 },
        { dataField: "JobBookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "OrderQuantity", caption: "JC Qty", width: 80 },
        { dataField: "ProductCode", caption: "Product Code" },
        { dataField: "JobPriority", caption: "Priority" },
        { dataField: "JobType", caption: "Job Type", width: 50 },
        { dataField: "ItemCode", caption: "Item Code", width: 50 },
        { dataField: "ItemType", caption: "Item Type", width: 80 },
        { dataField: "ItemName", caption: "Item Name", width: 150 },
        { dataField: "FullSheets", caption: "Full Sheets", width: 50 },
        { dataField: "ActualSheets", caption: "Actual Sheets", width: 50 }
    ],
    onSelectionChanged: function (Sel) {
        var data = Sel.selectedRowsData;
        gridScheduleListObj = Sel.selectedRowsData;
        if (data.length > 0) {
            $("#TxtScheduleID").val(data[0].JobBookingJobCardContentsID);
            $("#TxtOrderSalesID").val(data[0].SalesOrderNO);
            var JContentsID = data[0].JobBookingJobCardContentsID;

            $.ajax({
                type: "POST",
                url: "WebService_NewSchedularPlanner.asmx/GetFormWiseProcessDetail",
                data: '{ContentsID:' + JSON.stringify(JContentsID) + '}',
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
                    FormWiseDetail = JSON.parse(res);
                    $("#gridFormWiseDetail").dxDataGrid({
                        dataSource: FormWiseDetail
                    });
                }
            });
        }
        RefreshDiv();
    }
});

$("#gridFormWiseDetail").dxDataGrid({
    dataSource: FormWiseDetail,
    showBorders: true,
    paging: { enabled: false },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 1.8;
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
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "ToBeProduceQty", caption: "To Be Produce Qty", allowEditing: false },
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
            dataField: "RemoveRow", caption: "", allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        }
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

$("#GridAllocatedDetails").dxDataGrid({
    dataSource: AllocatedGrid,
    showBorders: true,
    paging: {
        enabled: false
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    sorting: {
        mode: "single"
    },
    height: function () {
        return window.innerHeight / 1.26;
    },
    selection: { mode: "single" },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemCode", caption: "Item Code", width: 150 },
        { dataField: "ItemName", caption: "Item Name", width: 380 },
        { dataField: "RequiredQty", caption: "Required Qty", width: 150 },
        { dataField: "StockUnit", caption: "Stock Unit", width: 150 }
    ]
});

$("#GridDeliveryDetails").dxDataGrid({
    dataSource: DeliveryGrid,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowReordering: false,
    selection: { mode: "single" },
    grouping: {
        autoExpandAll: true
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 1.26;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "LedgerID", visible: false, caption: "LedgerID" },
        { dataField: "SalesOrderNO", caption: "Sales Order No", width: 200 },
        { dataField: "Consignee", caption: "Consignee", width: 200 },
        { dataField: "ScheduleQuantity", caption: "Schedule Qty", width: 150 },
        { dataField: "DeliveryDate", caption: "Delivery Date", width: 200 },
        { dataField: "TransporterName", caption: "Transporter Name", width: 200 }
    ]
});

FillJobGrid();
function FillJobGrid() {
    var textJCDateFrom = $('#dateboxJCDateFrom').dxDateBox('instance').option('value');
    var textJCDateTo = $('#dateboxTo').dxDateBox('instance').option('value');

    var DeldateboxJCDateFrom = $('#DeldateboxJCDateFrom').dxDateBox('instance').option('value');
    var DeldateboxTo = $('#DeldateboxTo').dxDateBox('instance').option('value');

    var checkB = document.getElementById("ScheduleCheckB").checked;
    var checkD = document.getElementById("ScheduleCheckD").checked;

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/GetAllJobCardList",
        data: '{JCDateFrom:' + JSON.stringify(textJCDateFrom) + ',JCDateTo:' + JSON.stringify(textJCDateTo) + ',checkB:' + JSON.stringify(checkB) + ',checkD:' + JSON.stringify(checkD) + ',DeldateboxJCDateFrom:' + JSON.stringify(DeldateboxJCDateFrom) + ',DeldateboxTo:' + JSON.stringify(DeldateboxTo) + '}',
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
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            $("#GridJobList").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

$("#Refresh").click(function () {
    FillJobGrid();
});

$("#MinBtn").click(function () {
    document.getElementById("ExtraDetailDiv").style.display = "none";
    document.getElementById("GridJobList").style.display = "block";
    document.getElementById("filterRow").style.display = "block";
    document.getElementById("MinBtn").style.display = "none";
    document.getElementById("MaxBtn").style.display = "block";
    document.getElementById("tooltipspan").innerHTML = "Click me to show detail..";
});

$("#MaxBtn").click(function () {
    document.getElementById("GridJobList").style.display = "none";
    document.getElementById("filterRow").style.display = "none";
    document.getElementById("ExtraDetailDiv").style.display = "block";
    document.getElementById("MinBtn").style.display = "block";
    document.getElementById("MaxBtn").style.display = "none";
    document.getElementById("tooltipspan").innerHTML = "Click me to hide detail..";
});

$("#BtnBooked").click(function () {
    var ContentsID = document.getElementById("TxtScheduleID").value;
    if (ContentsID === "" || ContentsID === null || ContentsID === undefined) {
        DevExpress.ui.notify("Please select any row from below grid..!", "warning", 3000);
        return false;
    }
    document.getElementById("pop_tag").innerHTML = "Booked detail..";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("GridDeliveryDetails").style.display = "none";
    document.getElementById("GridAllocatedDetails").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/AllocatedSchedulePlanner",
        data: '{JobBookingContentsID:' + JSON.stringify(ContentsID) + '}',
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
            AllocatedGrid = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            $("#GridAllocatedDetails").dxDataGrid({
                dataSource: AllocatedGrid
            });
        }
    });

    document.getElementById("BtnBooked").setAttribute("data-toggle", "modal");
    document.getElementById("BtnBooked").setAttribute("data-target", "#largeModal");
});

$("#BtnDelivery").click(function () {
    var TxtOrderSalesID = document.getElementById("TxtOrderSalesID").value;
    if (TxtOrderSalesID === "" || TxtOrderSalesID === null || TxtOrderSalesID === undefined) {
        DevExpress.ui.notify("Please select any row from below grid..!", "warning", 3000);
        return false;
    }

    document.getElementById("pop_tag").innerHTML = "Delivery detail..";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("GridDeliveryDetails").style.display = "block";
    document.getElementById("GridAllocatedDetails").style.display = "none";
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/DeliverySchedulePlanner",
        data: '{TxtOrderSalesID:' + JSON.stringify(TxtOrderSalesID) + '}',
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
            DeliveryGrid = [];
            DeliveryGrid = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            $("#GridDeliveryDetails").dxDataGrid({
                dataSource: DeliveryGrid
            });
        }
    });

    document.getElementById("BtnDelivery").setAttribute("data-toggle", "modal");
    document.getElementById("BtnDelivery").setAttribute("data-target", "#largeModal");
});

$("#BtnSave").click(function () {
    if (gridScheduleListObj.length <= 0) {
        DevExpress.ui.notify("Please choose any record from above grid..!", "warning", 2000);
        return false;
    }
    var ObjDetail = {};
    FinalGridDetail = [];
    var MachineCount = 0, ScheduleQtyCount = 0;
    var gridFormWiseDetail = $('#gridFormWiseDetail').dxDataGrid('instance');

    for (var i = 0; i < gridFormWiseDetail._options.dataSource.length; i++) {
        if (Number(gridFormWiseDetail._options.dataSource[i].ScheduleQty) > 0) {
            ObjDetail = {};

            ObjDetail.SequenceNo = i + 1;
            ObjDetail.JobBookingID = gridFormWiseDetail._options.dataSource[i].JobBookingID;
            ObjDetail.JobBookingJobCardContentsID = gridFormWiseDetail._options.dataSource[i].JobBookingJobCardContentsID;
            ObjDetail.ProcessID = gridFormWiseDetail._options.dataSource[i].ProcessID;
            ObjDetail.ProcessName = gridFormWiseDetail._options.dataSource[i].ProcessName;
            ObjDetail.JobCardFormNo = gridFormWiseDetail._options.dataSource[i].JobCardFormNo;
            ObjDetail.MachineID = gridFormWiseDetail._options.dataSource[i].MachineID;
            ObjDetail.MachineSpeed = gridFormWiseDetail._options.dataSource[i].MachineSpeed;
            ObjDetail.ScheduleQty = gridFormWiseDetail._options.dataSource[i].ScheduleQty;
            ObjDetail.TotalTimeToBeTaken = gridFormWiseDetail._options.dataSource[i].TotalTimeToBeTaken;
            ObjDetail.RateFactor = gridFormWiseDetail._options.dataSource[i].RateFactor;
            ObjDetail.VendorID = gridScheduleListObj[0].VendorID;

            ObjDetail.JobCardContentNo = gridScheduleListObj[0].JobCardContentNo;
            ObjDetail.JobName = gridScheduleListObj[0].JobName;
            ObjDetail.ContentName = gridScheduleListObj[0].PlanContName;

            FinalGridDetail.push(ObjDetail);
        } else {
            ScheduleQtyCount = ScheduleQtyCount + 1;
        }
        if (Number(gridFormWiseDetail._options.dataSource[i].MachineID) === 0 || gridFormWiseDetail._options.dataSource[i].MachineID === null || gridFormWiseDetail._options.dataSource[i].MachineID === undefined) {
            MachineCount = MachineCount + 1;
        }
    }

    if (ScheduleQtyCount > 0) {
        DevExpress.ui.notify("Please enter schedule quantity for all process..!", "warning", 2000);
        return false;
    }
    if (MachineCount > 0) {
        DevExpress.ui.notify("Please select machines for all process..!", "warning", 2000);
        return false;
    }
    if (FinalGridDetail.length <= 0) {
        DevExpress.ui.notify("Please choose any record from above grid..!", "warning", 2000);
        return false;
    }

    var total = 0, PID = 0, RFactor = "";
    for (var j = 0; j < FormWiseDetail.length; j++) {
        PID = FormWiseDetail[j].ProcessID;
        RFactor = FormWiseDetail[j].RateFactor;
        for (i = 0; i < FinalGridDetail.length; i++) {
            if (FinalGridDetail[i].ProcessID === PID && FinalGridDetail[i].RateFactor === RFactor) {
                total += Number(FinalGridDetail[i].ScheduleQty) << 0;
            }
        }
        if (Number(FormWiseDetail[j].ToBeProduceQty) > total) {
            DevExpress.ui.notify("Please enter schedule quantity for the process '" + FormWiseDetail[j].ProcessName + "'..!", "warning", 2000);
            return;
        }
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
                url: "WebService_NewSchedularPlanner.asmx/SaveSchedule",
                data: '{FinalGridDetail:' + JSON.stringify(FinalGridDetail) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {                    
                    if (results.d === "Success") {
                        swal("Saved!", "Your data saved", "success");
                        RefreshDiv();
                        $("#Refresh").click();
                    } else
                        swal("Not Saved!", results.d, "error");
                },
                error: function errorFunc(jqXHR) {
                    swal("Error!", "Please try after some time..", "");
                }
            });
        });
});

function RefreshDiv() {
    FormWiseDetail = [];
    FinalGridDetail = [];
    $("#gridFormWiseDetail").dxDataGrid({ dataSource: FormWiseDetail });
}

//ShowList Code
var SelectedShowlistId = 0, SelectedShowlistData = [];

$("#GridReleaseShowlist").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: {
        enabled: true
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    height: function () {
        return window.innerHeight / 2;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    sorting: {
        mode: "single"
    },
    selection: { mode: "single" },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "ReleasedDate", caption: "Released Date" },
        { dataField: "LedgerName", caption: "Client Name", width: 180, minWidth: 100 },
        { dataField: "JobName", caption: "Job Name", width: 200, minWidth: 100 },
        { dataField: "PONo", caption: "PO No", width: 80 },
        { dataField: "JobCardContentNo", caption: "JC Content No" },
        { dataField: "PlanContName", caption: "Content Name", maxWidth: 100 },
        { dataField: "JobBookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "OrderQuantity", caption: "JC Qty", width: 50 },
        { dataField: "ProductCode", caption: "Product Code" },
        { dataField: "JobPriority", caption: "Job Priority" },
        { dataField: "JobType", caption: "Job Type", width: 50 },
        { dataField: "ReleasedBy", caption: "Scheduled By" },
        { dataField: "JCBY", caption: "JC Created By" }
    ],
    onSelectionChanged: function (Show) {
        SelectedShowlistData = Show.selectedRowsData;
        SelectedShowlistId = 0;
        if (SelectedShowlistData.length <= 0) return;
        SelectedShowlistId = SelectedShowlistData[0].ScheduleID;
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebService_NewSchedularPlanner.asmx/GetReleasedQty",
            data: '{JobScheduleID:' + SelectedShowlistId + '}',
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
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                $("#GridShowlistScheduledQty").dxDataGrid({
                    dataSource: RES1
                });
            },
            error: function (e) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                console.log(e);
            }
        });
    }
});

$("#GridShowlistScheduledQty").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: {
        enabled: false
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        allowDeleting: false
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "JobCardContentNo", visible: false, caption: "JC Content No" },
        { dataField: "JobName", caption: "Job Name", width: 200, minWidth: 100, fixed: true },
        { dataField: "ReleasedDate", caption: "Released Date" },
        { dataField: "ContentName", caption: "Content Name", maxWidth: 100 },
        { dataField: "ProcessName", caption: "Process Name", maxWidth: 100 },
        { dataField: "RateFactor", caption: "Rate Factor" },
        { dataField: "JobCardFormNo", caption: "Ref. Form No" },
        { dataField: "ScheduleQty", caption: "Schedule Qty" },
        { dataField: "MachineName", caption: "Machine Name" },
        { dataField: "MachineSpeed", caption: "Machine Speed" }
    ]
});

$("#BtnShowList").click(function () {
    SelectedShowlistId = 0;
    $("#GridShowlistScheduledQty").dxDataGrid({
        dataSource: []
    });
    document.getElementById("BtnShowList").setAttribute("data-toggle", "modal");
    document.getElementById("BtnShowList").setAttribute("data-target", "#largeModalShowlist");
});

$("#ReleaseRefresh").click(function () {
    SelectedShowlistId = 0;
    ReleaseShowlist();
    $("#GridShowlistScheduledQty").dxDataGrid({
        dataSource: []
    });
});

ReleaseShowlist();
function ReleaseShowlist() {
    SelectedShowlistId = 0;
    var ReleaseDateFrom = $('#ReleaseDateFrom').dxDateBox('instance').option('value');
    var ReleasedateTo = $('#ReleasedateTo').dxDateBox('instance').option('value');
    var ScheduleCheckB = document.getElementById("ReleaseCheckB").checked;
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/GetShowlistReleased",
        data: '{ReleaseDateFrom:' + JSON.stringify(ReleaseDateFrom) + ',ReleasedateTo:' + JSON.stringify(ReleasedateTo) + ',ScheduleCheckB:' + JSON.stringify(ScheduleCheckB) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GridReleaseShowlist").dxDataGrid({ dataSource: RES1 });
        },
        error: function (ex) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

$("#BtnShowListDelete").click(function () {

    if (SelectedShowlistId === 0 || SelectedShowlistId === null || SelectedShowlistId === undefined) {
        DevExpress.ui.notify("Please choose any row from above scheduled list..!", "warning", 1500);
        return false;
    }

    swal({
        title: "Are you sure to delete..?",
        text: "You will not be able to recover this schedule..!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    }, function () {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebService_NewSchedularPlanner.asmx/DeleteJobScheduleRelease",
            data: '{JobScheduleID:' + SelectedShowlistId + ',JobContentsID:' + SelectedShowlistData[0].JobBookingJobCardContentsID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);

                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                if (res === "Success") {
                    swal("Deleted...!", "Your Data has been deleted.", "success");
                    $("#ReleaseRefresh").click();
                } else {
                    swal("Not Deleted...!", res, "warning");
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR);
            }
        });

    });
});

function CalculateTtlTime(e) {
    var TtlTime = Number(e.ScheduleQty) / Number(e.MachineSpeed);
    if (isNaN(TtlTime)) { TtlTime = 0; } else { TtlTime = Math.ceil(TtlTime); }
    return TtlTime;
}

function getMachineLoads(PId) {
    $.ajax({
        type: "POST",
        url: "WebService_NewSchedularPlanner.asmx/GetMachineWiseLoads",
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