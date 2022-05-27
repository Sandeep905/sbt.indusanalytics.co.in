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

$("#SelMachine").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Machine...",
    displayExpr: "MachineName",
    valueExpr: "MachineID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    //showMultiTagOnly: false,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#MachineID").text(data);
        }
        else {
            $("#MachineID").text("");
        }
        GetMachineWiseUser();
    }
});

$("#SelUser").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select User...",
    displayExpr: 'UserName',
    valueExpr: 'UserID',
    showSelectionControls: true,
    maxDisplayedTags: 2,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#UserID").text(data);
        }
        else {
            $("#UserID").text("");
        }
    }
});

$("#GridProductionReport").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    //wordWrapEnabled: true,
    export: {
        enabled: true,
        fileName: "DPR",
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
        { dataField: "MachineName", caption: "Machine", width: 120, groupIndex: 0 },
        { dataField: "MachineName", caption: "Machine", width: 120 },
        { dataField: "OperatorName", caption: "Operator", width: 120 },
        { dataField: "Shift", caption: "Shift", width: 40 },
        { dataField: "JobCardContentNo", caption: "JC No", width: 100 },
        { dataField: "JobName", caption: "Job Name", width: 220 },
        { dataField: "ContentName", caption: "Content", width: 180 },
        { dataField: "ProcessName", caption: "Process", width: 100 },
        { dataField: "RateFactor", caption: "Rate Factor", width: 80 },
        { dataField: "RefNo", caption: "JC Form No", width: 80 },
        { dataField: "PageNo", caption: "Page No", width: 80 },
        { dataField: "OrderQuantity", caption: "Order Qty", width: 80 },
        { dataField: "ReceivedQuantity", caption: "Consumed Qty", width: 80 },
        { dataField: "ProductionQuantity", caption: "Prod. Qty", width: 80 },
        { dataField: "ConversionValue", caption: "Steps", width: 50 },
        { dataField: "ReadyQuantity", caption: "Good Qty", width: 80 },
        { dataField: "WastageQuantity", caption: "Wast. Qty", width: 80 },
        { dataField: "SuspenseQuantity", caption: "Susp. Qty", width: 80 },
        { dataField: "Status", caption: "Status", width: 80 },
        { dataField: "ProductionRemark", visible: false, caption: "Prod. Remark" },
        {
            dataField: "FromTime", caption: "Start Time", dataType: "datetime", format: "dd-MMM-yyyy HH:mm:ss", width: 120, // format: "shortDateShortTime",
            calculateCellValue: function (e) {
                return new Date(parseInt(e.FromTime.substr(6)));
            }
        },
        { dataField: "TotalTime", caption: "Duration(HH:MM)", width: 50 },
        {
            dataField: "ToTime", caption: "End Time", dataType: "datetime", format: "dd-MMM-yyyy HH:mm:ss", width: 120, // format: "shortDateShortTime",
            calculateCellValue: function (e) {
                if (e.ToTime === "" || e.ToTime === null) {
                    return e.ToTime;
                } else
                    return new Date(parseInt(e.ToTime.substr(6)));
            }
        }, { dataField: "DepartmentName" },
        { dataField: "Supervisor", caption: "Supervisor", width: 120 }
    ],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
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
    }
});

$.ajax({
    type: 'POST',
    url: "WebService_CommonMIS.asmx/GetProductionMachines",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (results) {
        var ObjMachine = GetJsonConvertedObject(results);
        $("#SelMachine").dxTagBox({
            items: ObjMachine
        });
    }
});

GetMachineWiseUser();
function GetMachineWiseUser() {
    var MID = $("#MachineID").text();
    $.ajax({
        type: 'POST',
        url: "WebService_CommonMIS.asmx/GridMachineWiseUser",
        data: '{MID:' + JSON.stringify(MID) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var ObjPrc = GetJsonConvertedObject(results);
            $("#SelUser").dxTagBox({
                items: ObjPrc
            });
        }
    });
}

function RefreshReport(FromTime, ToTime, check) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var UserID = $("#UserID").text();
    var MachineID = $("#MachineID").text();
    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/DailyProductionReport",
        data: '{FromTime:' + JSON.stringify(FromTime) + ',ToTime:' + JSON.stringify(ToTime) + ',check:' + JSON.stringify(check) + ',MachineID:' + JSON.stringify(MachineID) + ',UserID:' + JSON.stringify(UserID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var RES1 = GetJsonConvertedObject(results);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GridProductionReport").dxDataGrid({ dataSource: RES1 });
        }
    });
}

function BtnRefreshclick() {
    var IsActiveDate = document.getElementById("IsActiveDate").checked;
    var DtFromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    var DtToTime = $('#DtToTime').dxDateBox('instance').option('value');
    RefreshReport(DtFromTime, DtToTime, IsActiveDate);
}

function BtnPrintclick() {
    var IsActiveDate = document.getElementById("IsActiveDate").checked;
    var DtFromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    var DtToTime = $('#DtToTime').dxDateBox('instance').option('value');
    var UserID = $("#UserID").text();
    var MachineID = $("#MachineID").text();

    var url = "DailyProductionReportPrint.aspx?IsDate=" + IsActiveDate + "&FromTime=" + DtFromTime.format("dd-MMM-yyyy HH:mm tt") + "&ToTime=" + DtToTime.format("dd-MMM-yyyy HH:mm tt") + "&MachineID=" + MachineID + "&UserID=" + UserID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
}
