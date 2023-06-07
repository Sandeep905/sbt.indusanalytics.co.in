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

$('#Operation').dxSelectBox({
    items: [],
    displayExpr: "ProcessName",
    valueExpr: "ProcessId",
    placeholder: 'Select operation',
    onValueChanged: function (e) {
        if (e.value != null && e.value != -1) {

            var JobBookingID = $('#JobCardNo').dxSelectBox('instance').option('value');
            var ScheduleVendorId = $('#VendorName').dxSelectBox('instance').option('value');
            var ProcessId = $('#Operation').dxSelectBox('instance').option('value');


            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/Process',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{JobBookingID: '" + Number(JobBookingID) + "',ScheduleVendorId: '" + Number(ScheduleVendorId) + "',ProcessId: '" + Number(ProcessId) + "'}",
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
                    //document.getElementById('Quantity').value = data[0].ScheduleQty;
                    //document.getElementById('remainingValue').value = Number(RES1[0].orderQuantity) - Number(RES1[0].ProductionQuantity);
                    if (RES1.length > 0) {
                        document.getElementById('remainingValue').value = Number(RES1[0].orderQuantity) - Number(RES1[0].ProductionQuantity);
                        document.getElementById('Quantity').value = RES1[0].remainingValue;
                    } else {

                        var RES = $('#POProductsGrid').dxDataGrid('instance').getSelectedRowsData();

                        document.getElementById('remainingValue').value = Number(RES[0].ScheduleQty);
                        document.getElementById('Quantity').value = Number(RES[0].ScheduleQty);
                        
                    }






                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
        }
    }
});



$('#JobCardNo').dxSelectBox({
    items: [],
    displayExpr: "JobBookingNo",
    valueExpr: "JobBookingID",
    placeholder: 'Select JobCardNo',
    showClearButton: true,
    //disabled: true,
    onValueChanged: function (e) {
        if (e.value != null && e.value != -1) {

            //var JobBookingID = e.value;
            var JobBookingID = $('#JobCardNo').dxSelectBox('instance').option('value');

            var ScheduleVendorId = $('#VendorName').dxSelectBox('instance').option('value');

            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/GetJobbookingDataStart',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{JobBookingID: '" + Number(JobBookingID) + "',ScheduleVendorId: '" + Number(ScheduleVendorId) + "'}",
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
                    document.getElementById('QuotaionNo').value = RES1[0].QuotaionNo.trim();
                    document.getElementById('EnquiryNo').value = RES1[0].EnquiryNo.trim();

                    $('#POProductsGrid').dxDataGrid({
                        dataSource: RES1
                    });

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
            $.ajax({
                async: false,
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/RunningJob',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{JobBookingID: '" + Number(JobBookingID) + "',ScheduleVendorId: '" + Number(ScheduleVendorId) + "'}",
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
                    $('#StartGrid').dxDataGrid({
                        dataSource: RES1
                    });

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
        } else {
            $('#Quantitylbl').addClass('dx-hidden');

            $('#JobCardNo').dxSelectBox({
                value: -1
            });
            $('#Operation').dxSelectBox({
                value: -1
            });
            document.getElementById('QuotaionNo').value = 0;
            document.getElementById('EnquiryNo').value = 0;

            $("#POProductsGrid").dxDataGrid({
                dataSource: []
            });
            document.getElementById('remainingValue').value = 0;
            document.getElementById('Quantity').value = 0;
            //$("#StartGrid").dxDataGrid({
            //    dataSource: []
            //});
        }



    }

});



$('#VendorName').dxSelectBox({
    items: [],
    displayExpr: "LedgerName",
    valueExpr: "LedgerID",
    placeholder: 'Select Vendor Name',
    showClearButton: true,
    onValueChanged: function (e) {
        if (e.value != null && e.value != -1) {

            var ScheduleVendorId = e.value;

            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/DropDown',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{LedgerID: '" + Number(ScheduleVendorId) + "'}",
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
                    $('#JobCardNo').dxSelectBox({
                        items: RES1,
                        displayExpr: "JobBookingNo",
                        valueExpr: "JobBookingID",
                        value: -1
                    });

                    $('#Quantitylbl').addClass('dx-hidden');

                    $("#POProductsGrid").dxDataGrid({
                        dataSource: []
                    });
                    $('#Operation').dxSelectBox({
                        items: []
                    });
                    document.getElementById('Quantity').value = 0;
                    document.getElementById('Remark').value = '';
                    document.getElementById('QuotaionNo').value = 0;
                    document.getElementById('EnquiryNo').value = 0;
                    document.getElementById('remainingValue').value = 0;
                    //$("#StartGrid").dxDataGrid({
                    //    dataSource: []
                    //});

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }


            });

        } else {
            $('#JobCardNo').dxSelectBox({
                value: -1
            });

            //$("#POProductsGrid").dxDataGrid({
            //    dataSource: []
            //});

            $('#Operation').dxSelectBox({
                items: []
            });
            document.getElementById('Quantity').value = 0;
            document.getElementById('remainingValue').value = 0;

            $("#StartGrid").dxDataGrid({
                dataSource: []
            });

        }
    }

});


$("#POProductsGrid").dxDataGrid({
    dataSource: [],

    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "ScheduleQty", resizable: true, visible: true, caption: "Allocated QTY", allowEditing: false },
        { dataField: "JobType", allowEditing: false },
        { dataField: "JobReference", allowEditing: false },
        { dataField: "JobPriority", allowEditing: false },
        { dataField: "CriticalRemark", caption: 'Critical Remark', allowEditing: false },
        { dataField: "ExpectedDeliveryDate", allowEditing: false },

    ],

    onSelectionChanged: function (e) {
        const data = e.selectedRowsData;
        if (data.length > 0) {
            var Processidstr = data[0].Processidstr;
            if (Processidstr == "") return;
            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/Operation',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{Processidstr: " + JSON.stringify(Processidstr) + "}",
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
                    $('#Operation').dxSelectBox({
                        items: RES1,
                        displayExpr: "ProcessName",
                        valueExpr: "ProcessId",
                    });

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
            //document.getElementById('Quantity').value = RES1[0].remainingValue;
            //document.getElementById('RQFTP').value = data[0].Quantity;

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
        width: 200,
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


GetVendor();
function GetVendor() {

    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetVendorNamePO',
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

function clean() {
    $('#VendorName').dxSelectBox({
        value: -1
    });
    $('#JobCardNo').dxSelectBox({
        value: -1
    });

    $("#POProductsGrid").dxDataGrid({
        dataSource: []
    });
    $("#StartGrid").dxDataGrid({
        dataSource: []
    });

    $('#Operation').dxSelectBox({
        value: -1
    });
    $('#Quantitylbl').addClass('dx-hidden');

    document.getElementById('Quantity').value = 0;
    document.getElementById('Remark').value = '';
    document.getElementById('QuotaionNo').value = 0;
    document.getElementById('EnquiryNo').value = 0;
    document.getElementById('remainingValue').value = 0;

};


$('#Save').click(function () {

    let quantity = 0; // Replace with the actual quantity value

    if (quantity !== 0) {
        // Save the data
        // ... your save logic here ...
        swal('Data saved successfully.');
    } else {
        // Display an alert message
        swal('ProductionQuantity should be greater than 0.');
    }




    var VendorName = $('#VendorName').dxSelectBox('instance').option('value');
    var JobCardNo = $('#JobCardNo').dxSelectBox('instance').option('text');
    var JobCardID = $('#JobCardNo').dxSelectBox('instance').option('value');
    var Operation = $('#Operation').dxSelectBox('instance').option('value');
    var Quantity = document.getElementById('Quantity').value;
  
    var Remark = document.getElementById('Remark').value;
    var PODataGrid = $("#POProductsGrid").dxDataGrid("getDataSource")._items;
    if (PODataGrid.length <= 0) {
        return;
    }
    if (Quantity === "" || Quantity === null || Quantity <= 0) {
        $('#Quantitylbl').removeClass('dx-hidden');
        document.getElementById("Quantitylbl").focus();
        return;
    } else {
        $('#Quantitylbl').addClass('dx-hidden');

    }
    

    var JobBookingID = JobCardID;

    var arr = [], obj = {};

    obj.JobBookingID = JobCardID;
    obj.VendorID = VendorName;
    obj.JobBookingNo = JobCardNo;
    obj.ProcessId = Operation;
    obj.ProductionQuantity = Quantity;
    obj.Remark = Remark;
    arr.push(obj);



    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: 'post',
        url: ' WebServiceProductionWorkOrder.asmx/SaveStart',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{Data:' + JSON.stringify(arr) + ',IsEdit:' + IsEdit + ',JobBookingID: ' + JSON.stringify(JobBookingID) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);


            if (res == "Success") {
                if (IsEdit == false) {
                    swal("Saved", " Saved  successfully", 'success');
                    //swal("Error", "Quantity is 0", 'error');
                } else {
                    swal("Saved", " Updated  successfully", 'success');
                }
                clean();
               
            }
            else {
                swal("Error", "Somthing went wrong", 'error');
                //swal("Error", "Quantity is 0", 'error');

            }
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);


            // alert("not show");
        }
    });
});


$("#StartGrid").dxDataGrid({

    columns: [
        { dataField: "VendorName", allowEditing: false },
        { dataField: "JobBookingNo", caption: "Jobcard No", allowEditing: false },
        { dataField: "Operation", allowEditing: false },
        { dataField: "ProductionQuantity", allowEditing: false },
        { dataField: "Remark", allowEditing: false },
        { dataField: "JobName", caption: "ProductName", allowEditing: false },
        { dataField: "OrderQuantity", allowEditing: false },
        { dataField: "JobType", allowEditing: false },
        { dataField: "JobReference", allowEditing: false },
        { dataField: "JobPriority", allowEditing: false },
        { dataField: "CriticalRemark", caption: 'Special Remark', allowEditing: false },
        { dataField: "ExpectedDeliveryDate", allowEditing: false },

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
        width: 200,
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


function Validatedsundeep() {

    var remainingValue = Number(document.getElementById('remainingValue').value);

    var Quantity = document.getElementById('Quantity').value;

    var RES1 = $('#POProductsGrid').dxDataGrid('instance').getSelectedRowsData();
    if (RES1.length <= 0) {
        alert('Please Select POProductsGrid from grid');
        return;
    }

    if (Number(remainingValue) < Number(Quantity)) {
        $('#Quantitylbl').removeClass('dx-hidden');
    } else {
        $('#Quantitylbl').addClass('dx-hidden');
    }
}

