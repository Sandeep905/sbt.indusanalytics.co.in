"use strict";
var Griddatasource = [];
var GBLID = 0;
var IsEdit = false;

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

$('#RadioBtnMaster').dxRadioGroup({
    items: ["Allocated", "RunningJob"],
    layout: "horizontal",
    value: 'RunningJob',
    onValueChanged: function (e) {
        if (e.value === "Allocated") {
            AllocatedDT();
        } else if (e.value === "RunningJob") {
            GetRunningJobDt();
        }
    },
});

$('#VendorName').dxSelectBox({
    items: [],
    displayExpr: "LedgerName",
    valueExpr: "LedgerID",
    placeholder: 'Select Vendor Name',
    showClearButton: true,
    onValueChanged: function (e) {
        if (e.value != null && e.value != -1) {

            var radioGroupValue = $('#RadioBtnMaster').dxRadioGroup('instance').option('value');

            if (radioGroupValue == "Allocated") {
                AllocatedDT();
            } else {
                GetRunningJobDt();
            }
        } else {
            $('#VendorName').dxSelectBox({
                value: -1
            });
            $("#GetDataGrid1").dxDataGrid({
                dataSource: []
            });
            $("#GetDataGrid2").dxDataGrid({
                dataSource: []
            });
        }
    }
});

GetVendor();
function GetVendor() {

    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetVendorName',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            //alert(res);
            var RES1 = JSON.parse(res);

            $('#VendorName').dxSelectBox({
                items: RES1,
                displayExpr: "LedgerName",
                valueExpr: "LedgerID"
            });
            clean();

        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}


$("#GetDataGrid1").dxDataGrid({

    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "OrderQuantity", allowEditing: false },
        { dataField: "EnquiryNo" },
        { dataField: "QuotaionNo" },

    ],

    onSelectionChanged: function (e) {


        const data = e.selectedRowsData;


        if (data.length > 0) {


            var radioGroupValue = $('#RadioBtnMaster').dxRadioGroup('instance').option('value');

            if (radioGroupValue == "Allocated") {


                var ScheduleVendorid = $('#VendorName').dxSelectBox('instance').option('value');

                $.ajax({
                    async: false,
                    type: 'post',
                    url: 'WebServiceProductionWorkOrder.asmx/GetDataGrid2',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: "{ScheduleVendorid: '" + Number(ScheduleVendorid) + "'}",
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (results) {
                        var res = results.d.replace(/\\/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        //alert(res);
                        var RES1 = JSON.parse(res);
                        $('#GetDataGrid2').dxDataGrid({
                            dataSource: RES1
                        });

                    },
                    error: function errorFunc(jqXHR) {
                        // alert("not show");
                    }
                });

            } else {
                
                var JobBookingID = data[0].JobBookingID;

                $.ajax({
                    async: false,
                    type: 'post',
                    url: 'WebServiceProductionWorkOrder.asmx/NewRunningJob',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: "{JobBookingID: '" + Number(JobBookingID) + "'}",
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (results) {
                        var res = results.d.replace(/\\/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        //alert(res);
                        var RES1 = JSON.parse(res);
                        $('#GetDataGrid2').dxDataGrid({
                            dataSource: RES1
                        });

                    },
                    error: function errorFunc(jqXHR) {
                        // alert("not show");
                    }
                });
            }
        }
    },



    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, apolyFilter: "auto" },
    columnResizingMode: "widget",
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 50,
        maxwidth: 50,
        marginright: 0,
        marginleft: 50,
        text: 'Data is loading...'
    },

    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#0a5696');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
       
});


$("#GetDataGrid2").dxDataGrid({

    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "ProcessName", allowEditing: false },
        { dataField: "OrderQuantity", allowEditing: false },
        { dataField: "EnquiryNo" },
        { dataField: "QuotaionNo" },
        { dataField: "ProductionQuantity", allowEditing: false },
        { dataField: "ScheduleVendorName", allowEditing: false },

    ],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, apolyFilter: "auto" },
    columnResizingMode: "widget",
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 50,
        maxwidth: 50,
        marginright: 50,
        marginleft: 0,
        text: 'Data is loading...'
    },
    onSelectionChanged: function (e) {

        const data = e.selectedRowsData;
        if (data.length > 0) {
            var JobBookingID = data[0].JobBookingID;
            $.ajax({
                async: false,
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/GetAllProcess',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{JobBookingID: '" + Number(JobBookingID) + "'}",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (results) {
                    var res = results.d.replace(/\\/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    //alert(res);
                    var RES1 = JSON.parse(res);
                    console.log(RES1);

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
        }
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#0a5696');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },

});

function AllocatedDT() {
    var ScheduleVendorid = $('#VendorName').dxSelectBox('instance').option('value');

    $.ajax({
        async: false,
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/AllocatedDT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{ScheduleVendorid: '" + Number(ScheduleVendorid) + "'}",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            //alert(res);
            var RES1 = JSON.parse(res);
            $('#GetDataGrid1').dxDataGrid({
                dataSource: RES1
            });

        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}

function GetRunningJobDt() {
    var ScheduleVendorid = $('#VendorName').dxSelectBox('instance').option('value');

    $.ajax({
        async: false,
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetRunningJobDt',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{ScheduleVendorid: '" + Number(ScheduleVendorid) + "'}",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            //alert(res);
            var RES1 = JSON.parse(res);
            $('#GetDataGrid1').dxDataGrid({
                dataSource: RES1
            });

        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}
function clean() {
    $('#VendorName').dxSelectBox({
        value: -1
    });

    $("#GetDataGrid1").dxDataGrid({
        dataSource: []
    });

    $("#GetDataGrid2").dxDataGrid({
        dataSource: []
    });

};

