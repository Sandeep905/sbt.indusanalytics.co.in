"use strict";

var d = new Date();
var dd = d.getDate();
var mm = d.getMonth() + 1;
var yyyy = d.getFullYear();
var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var customDatestring = dd + " " + months_String[mm - 2] + " " + yyyy;

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading please wait...",
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#FromDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    value: new Date()
});

$("#ToDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    value: new Date()
});

$("#SelClient").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Client...",
    displayExpr: "LedgerName",
    valueExpr: "LedgerID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    //showMultiTagOnly: false,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#ClientsID").text(data);
        }
        else {
            $("#ClientsID").text("");
        }
    }
});

$("#SelDepartment").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Department...",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    showSelectionControls: true,
    maxDisplayedTags: 2,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#DepartmentsID").text(data);
        }
        else {
            $("#DepartmentsID").text("");
        }
    }
});

$("#GridReport").dxDataGrid({
    dataSource: [],
    export: {
        enabled: true,
        fileName: "Job Floor Status Report",
        allowExportSelectedData: true
    },
    allowColumnReordering: true,
    allowColumnResizing: true,
    showRowLines: true,
    wordWrapEnabled: true,
    paging: {
        enabled: true,
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    filterRow: { visible: true },
    showBorders: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    sorting: { mode: 'multiple' },
    height: function () {
        return window.innerHeight / 1.3;
    },
    columnAutoWidth: true,
    columnResizingMode: "widget",
    columns: [{ dataField: "JobCardContentNo", caption: "Job Card No", fixed: true }, { dataField: "JobName", caption: "Job Name", width: 180, fixed: true }, { dataField: "PlanContName", caption: "Content Name", width: 180, fixed: true }, { dataField: "OrderQuantity", caption: "Job Qty", fixed: true },
    { dataField: "JobBookingDate", caption: "Job Date", width: 90 }, { dataField: "ActualSheets", caption: "Actual Sheets", width: 80 }, { dataField: "WastageSheets", caption: "Wastage Sheets", width: 80 }, { dataField: "DeliveryDate", caption: "Delivery Date", width: 90 },
    {
        dataField: "Process1", caption: "",
        calculateCellValue: function (e) { var a = e.Process1; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process2", caption: "",
        calculateCellValue: function (e) { var a = e.Process2; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process3", caption: "",
        calculateCellValue: function (e) { var a = e.Process3; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process4", caption: "",
        calculateCellValue: function (e) { var a = e.Process4; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process5", caption: "",
        calculateCellValue: function (e) { var a = e.Process5; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process6", caption: "",
        calculateCellValue: function (e) { var a = e.Process6; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process7", caption: "",
        calculateCellValue: function (e) { var a = e.Process7; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process8", caption: "",
        calculateCellValue: function (e) { var a = e.Process8; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process9", caption: "",
        calculateCellValue: function (e) { var a = e.Process9; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process10", caption: "",
        calculateCellValue: function (e) { var a = e.Process10; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process11", caption: "",
        calculateCellValue: function (e) { var a = e.Process11; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process12", caption: "",
        calculateCellValue: function (e) { var a = e.Process12; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process13", caption: "",
        calculateCellValue: function (e) { var a = e.Process13; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process14", caption: "",
        calculateCellValue: function (e) { var a = e.Process14; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process15", caption: "",
        calculateCellValue: function (e) { var a = e.Process15; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process16", caption: "",
        calculateCellValue: function (e) { var a = e.Process16; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process17", caption: "",
        calculateCellValue: function (e) { var a = e.Process17; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process18", caption: "",
        calculateCellValue: function (e) { var a = e.Process18; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process19", caption: "",
        calculateCellValue: function (e) { var a = e.Process19; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }, {
        dataField: "Process20", caption: "",
        calculateCellValue: function (e) { var a = e.Process20; if (a !== "" && a !== null) return a.replace(/<br >/g, '\n'); }
    }],
    onCellPrepared(e) {
        if (e.rowType !== "data" && e.columnIndex !== 0) return;
        if (e.column.dataField.includes("Process") && e.data[e.column.dataField] !== "" && e.data[e.column.dataField] !== null) {
            e.column.width = 120;
            if (e.data[e.column.dataField].includes("Part Complete")) {
                e.cellElement.css('background', 'coral');
            }
            else if (e.data[e.column.dataField].includes("Complete")) {
                e.cellElement.css('background', 'green');
                e.cellElement.css('color', '#fff');
            }
            else if (e.data[e.column.dataField].includes("In Queue")) {
                e.cellElement.css('background', 'yellow');
            }
            else if (e.data[e.column.dataField].includes("Running")) {
                e.cellElement.css('background', 'lightpink');
            }
            else if (e.data[e.column.dataField].includes("Outsource Send")) {
                e.cellElement.css('background', '#34f2f4');
            }
            else if (e.data[e.column.dataField].includes("Outsource Receive")) {
                e.cellElement.css('background', '#cc00ff');
                e.cellElement.css('color', '#fff');
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
    }
});

$.ajax({
    type: 'POST',
    url: "WebService_CommonMIS.asmx/GetClientsList",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/{"d":null/g, '');
        res = res.replace(/{"d":""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.slice(0, -3);
        var SelClient = JSON.parse(res.toString());
        $("#SelClient").dxTagBox({ items: SelClient });
    }
});

$.ajax({
    type: 'POST',
    url: "WebService_CommonMIS.asmx/GetDepartmentsList",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/{"d":null/g, '');
        res = res.replace(/{"d":""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.slice(0, -3);
        var ObjPrc = JSON.parse(res.toString());
        $("#SelDepartment").dxTagBox({ items: ObjPrc });
    }
});

function BtnRefreshclick() {
    var IsActiveDate = document.getElementById("IsActiveDate").checked;
    var FromDate = $('#FromDate').dxDateBox('instance').option('value');
    var ToDate = $('#ToDate').dxDateBox('instance').option('value');
    var DepartmentsID = $("#DepartmentsID").text(); // $('#SelProcess').dxTagBox('instance').option('value');
    var ClientsID = $("#ClientsID").text(); // $('#SelMachine').dxTagBox('instance').option('value');
    var StrFilter = '';
    if (DepartmentsID !== "") {
        StrFilter = "DepartmentID IN(" + DepartmentsID + ")";
    }
    if (ClientsID !== "" && StrFilter === "") {
        StrFilter = "LedgerID IN(" + ClientsID + ")";
    } else if (ClientsID !== "") {
        StrFilter = StrFilter + " And LedgerID IN(" + ClientsID + ")";
    }
    if (IsActiveDate === true && StrFilter === "") {
        StrFilter = "(CAST(FLOOR(CAST(JC.JobBookingDate AS Float)) AS Datetime) >= ''" + FromDate.format("dd-MMM-yyyy HH:mm tt") + "'') AND (CAST(FLOOR(CAST(JC.JobBookingDate AS Float)) AS Datetime) <= ''" + ToDate.format("dd-MMM-yyyy HH:mm tt") + "'') ";
    } else if (IsActiveDate === true) {
        StrFilter = StrFilter + " And (CAST(FLOOR(CAST(JC.JobBookingDate AS Float)) AS Datetime) >= ''" + FromDate.format("dd-MMM-yyyy HH:mm tt") + "'') AND (CAST(FLOOR(CAST(JC.JobBookingDate AS Float)) AS Datetime) <= ''" + ToDate.format("dd-MMM-yyyy HH:mm tt") + "'') ";
    }
    if (StrFilter === "") {
        DevExpress.ui.notify("Please select any one filter..!", "warning", 1200);
        return;
    }
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/JobFloorStatusReport",
        data: '{StrFilter:' + JSON.stringify(StrFilter) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/r\\/g, '').replace(/\\r/g, '').replace(/\\n/g, '<br >');
            res = res.replace(/\\/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:},/g, ':null},');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);

            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GridReport").dxDataGrid({ dataSource: RES1 });
        }
    });
}