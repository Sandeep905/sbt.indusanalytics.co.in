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


$('#Status').dxSelectBox({
    items: ["Hold", "Part completed", "completed"],
    placeholder: 'Select Status',
    // showClearButton: true,
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
                url: 'WebServiceProductionWorkOrder.asmx/JobcardEnd',
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


                    $("#POProductsGrid").dxDataGrid({
                        dataSource: []
                    });

                    document.getElementById('QuotaionNo').value = 0;
                    document.getElementById('EnquiryNo').value = 0;


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
                url: 'WebServiceProductionWorkOrder.asmx/ENDJOB',
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
                    document.getElementById('QuotaionNo').value = RES1[0].QuotaionNo;
                    document.getElementById('EnquiryNo').value = RES1[0].EnquiryNo;

                    $('#POProductsGrid').dxDataGrid({
                        dataSource: RES1
                    });
                    //document.getElementById('Quantity').value = RES1[0].ProductionQuantity;

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });
            //$.ajax({
            //    async: false,
            //    type: 'post',
            //    url: 'WebServiceProductionWorkOrder.asmx/RunningJob',
            //    dataType: 'json',
            //    contentType: "application/json; charset=utf-8",
            //    data: "{JobBookingID: '" + Number(JobBookingID) + "',ScheduleVendorId: '" + Number(ScheduleVendorId) + "'}",
            //    crossDomain: true,
            //    xhrFields: {
            //        withCredentials: true
            //    },
            //    success: function (results) {
            //        var res = results.d.replace(/\\/g, '');
            //        res = res.substr(1);
            //        res = res.slice(0, -1);
            //        //alert(res);
            //        var RES1 = JSON.parse(res);
            //        $('#StartGrid').dxDataGrid({
            //            dataSource: RES1
            //        });

            //    },
            //    error: function errorFunc(jqXHR) {
            //        // alert("not show");
            //    }
            //});
        } else {

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


        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}



$("#POProductsGrid").dxDataGrid({
    dataSource: [],

    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "ProductionQuantity", resizable: true, visible: true, allowEditing: false },
        { dataField: "JobType", allowEditing: false },
        { dataField: "JobReference", allowEditing: false },
        { dataField: "JobPriority", allowEditing: false },
        { dataField: "CriticalRemark", caption: 'Special Remark', allowEditing: false },
        { dataField: "ExpectedDeliveryDate", allowEditing: false },

    ],

    onSelectionChanged: function (e) {
        const data = e.selectedRowsData;

        var JobBookingID = $('#JobCardNo').dxSelectBox('instance').option('value');
        var ScheduleVendorId = $('#VendorName').dxSelectBox('instance').option('value');
      
        $.ajax({
            type: 'post',
            url: 'WebServiceProductionWorkOrder.asmx/ProductionQuantity',
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
                document.getElementById('ProductionQuantity').value = RES1[0].ProductionQuantity;
               
            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
            }
        });

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

    $('#Status').dxSelectBox({
        value: -1
    });
    document.getElementById('ProductionQuantity').value = 0;
   document.getElementById('QuotaionNo').value = 0;
    document.getElementById('EnquiryNo').value = 0;
   
};






$('#SaveEnd').click(function () {

    var VendorName = $('#VendorName').dxSelectBox('instance').option('value');
    var JobCardNo = $('#JobCardNo').dxSelectBox('instance').option('text');
    var JobCardID = $('#JobCardNo').dxSelectBox('instance').option('value');
    var Status = $('#Status').dxSelectBox('instance').option('value');
    var ProductionQuantity = document.getElementById('ProductionQuantity').value;
    var PODataGrid = $("#POProductsGrid").dxDataGrid("getDataSource")._items;
    if (PODataGrid.length <= 0) {
        return;
    }

    var JobBookingID = JobCardID;

    var arr = [], obj = {};

    obj.JobBookingID = JobCardID;
    obj.VendorID = VendorName;
    obj.JobBookingNo = JobCardNo;
  
    obj.ProductionQuantity = ProductionQuantity;
   
    arr.push(obj);



    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: 'post',
        url: ' WebServiceProductionWorkOrder.asmx/SaveEnd',
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
                } else {
                    swal("Saved", " Updated  successfully", 'success');
                }
                clean();

            }
            else {
                swal("Error", "Somthing went wrong", 'error');
            }
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);


            // alert("not show");
        }
    });
});


//function ValidatedEND() {

//    var ProductionQuantity = Number(document.getElementById('ProductionQuantity').value);

//    var Quantity = document.getElementById('Quantity').value;

//    var RES1 = $('#POProductsGrid').dxDataGrid('instance').getSelectedRowsData();
//    if (RES1.length <= 0) {
//        alert('Please Select POProductsGrid from grid');
//        return;
//    }

//    if (Number(RES1.ProductionQuantity) < Number(Quantity)) {
//        $('#Quantitylbl').removeClass('dx-hidden');
//    } else {
//        $('#Quantitylbl').addClass('dx-hidden');
//    }
//}












































































































































































