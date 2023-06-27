"use strict"
// *****  Declare Global varialbe  ****
var processids = "", GBLOrderBookingDetailsID = 0;
var ProcessArray = [], VendorArray = [], FillterProcessArray = [];
var GBLProductEstimationID = 0;
var ContentsDataArray = [];
var JobcoordinatorArray = [];
var GBLProductEstimationContentID = 0;
var GBLScheduleContents = [];
var GBLJCNO = '';
var GBLLedgerId = 0;
// *****  Declare Global varialbe  ****
var check = "Pending", GblContentName, GblGenCode, GblProdMasCode = "", GblContentType, GblFlagFormName, GblCommandName, GblJobCardNo = "";
var GblProductContID = 0, GblContentId = 0, GblProdMasID = 0, GblBookingID = 0, GblJobBookingID = 0, GblOrderQuantity = 0, GblPaperId = 0, ProductEstimateID = 0;

// *****  Declare Global Objects  ****
var ObjContentsDataAll, TablePendingData = [], GblObjProcessItemReq = {}, GBLProductType = [], GblInputValues = [], GblInputOpr = [], GblPlanValues = [];

// *****  Declare Global Flags  ****
var FlagEdit = false, FlagExport = false, ChkCond = false;
//var GblLoadingmsg = "Loading....";

var GBLLoginCompanyState = "";

var ObjProcessData = [], ObjStandardInkdata = [];
var ObjContentsData = [];
var GblJobType = [], GblPlateType = [];
var GblObjToolDetails = [];
var dataProject = [];

var GBLPOMain = [];
var GBLPOID = 0;
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


$("#RadioPMPendingProc").dxRadioGroup({
    //items: ["Pending", "Processed"],
    items: ["Pending"],
    value: "Pending",
    layout: 'horizontal',
    onValueChanged: function (e) {
        check = e.value;
        var grid = $("#GridJocardData").dxDataGrid('instance');
        grid.clearSelection();
        if (check === "Pending") {
            FlagEdit = false;
        } else {
            FlagEdit = true;
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("message", "Please wait...");
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        GetJobCardData();
    }
});


$("#RadioSalesorder").dxRadioGroup({
    items: ["Pending", "Processed"],
    value: "Pending",
    layout: 'horizontal',
    onValueChanged: function (e) {
        if (e.value == "Pending") {
            loadSalesOrder(false);
            $("#BtnNextSO").show()
        } else {
            loadSalesOrder(true);
            $("#BtnNextSO").hide();
        }
    }
});
$("#Optsplit").dxRadioGroup({
    items: ["Qty Wise"],//, "Process Wise""Both",
    value: "Qty Wise",
    layout: 'horizontal',
    onValueChanged: function (e) {
        var check = e.value;
        if (check === "Both") {
            document.getElementById('TxtScheduleQTY').removeAttribute("disabled");
            $('#SBProcess').dxSelectBox({
                value: -1,
                disabled: false
            });
            document.getElementById('allprocess').checked = false;
            document.getElementById('TxtScheduleQTY').value = 0;
            document.getElementById('allprocess').removeAttribute("disabled");
        } else if (check == "Qty Wise") {
            document.getElementById('TxtScheduleQTY').removeAttribute("disabled");
            $('#SBProcess').dxSelectBox({
                value: -1,
                disabled: true
            });
            document.getElementById('allprocess').setAttribute("disabled", "disabled");
            document.getElementById('allprocess').checked = false;
            document.getElementById('TxtScheduleQTY').value = 0;
        } else {
            document.getElementById('allprocess').removeAttribute("disabled");
            document.getElementById('TxtScheduleQTY').setAttribute("disabled", "disabled");
            $('#SBProcess').dxSelectBox({
                value: -1,
                disabled: false
            });
            document.getElementById('allprocess').checked = false;
            document.getElementById('TxtScheduleQTY').value = 0;
        }
    }
});
function GetJobCardData() {
    $.ajax({
        type: 'POST',
        url: "WebServiceProductionWorkOrder.asmx/GetJobCardData",
        data: '{check:' + JSON.stringify(check) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -3);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());
            var columns;
            //JobcardSchedule
            $("#GridJocardData").dxDataGrid({
                keyExpr: 'JobBookingID',
                dataSource: RES1.JobcardMain,
                masterDetail: {
                    enabled: true,
                    template(container, options) {
                        const currentProjectData = options.data;
                        $('<div>')
                            .addClass('master-detail-caption')
                            .text(`${currentProjectData.ClientName} 's Products:`)
                            .appendTo(container);
                        $('<div>')
                            .dxDataGrid({
                                columnAutoWidth: true,
                                showBorders: true,
                                columns: [
                                    { dataField: "ProductName" },
                                    { dataField: "JobType" },
                                    { dataField: "JobReference" },
                                    { dataField: "JobPriority" },
                                    { dataField: "VendorName", caption: "Planed Vendor Name" },
                                    { dataField: "OrderQuantity", caption: "Planed Qty" },
                                    { dataField: "ScheduleVendorName" },
                                    { dataField: "QTY", caption: "Schedule Qty" },
                                    { dataField: "RateType" },
                                    { dataField: "Rate" },
                                    { dataField: "NetAmount" },
                                    { dataField: "CGSTTaxPercentage" },
                                    { dataField: "CGSTTaxAmount" },
                                    { dataField: "SGSTTaxPercentage" },
                                    { dataField: "SGSTTaxAmount" },
                                    { dataField: "IGSTTaxPercentage" },
                                    { dataField: "IGSTTaxAmount" },
                                    { dataField: "TotalAmount" },
                                    { dataField: "ExpectedDeliveryDate" },
                                    { dataField: "JobCoordinator" },

                                ],
                                dataSource: new DevExpress.data.DataSource({
                                    store: new DevExpress.data.ArrayStore({
                                        //key: 'ID',
                                        data: RES1.JobcardSchedule,
                                    }),
                                    filter: ['JobBookingID', '=', options.key],
                                }),
                            }).appendTo(container);
                    },
                },
            });
            GBLScheduleContents = RES1.JobcardSchedule;
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}
GetJobCardData();
$("#SbConsigneeName").dxSelectBox({
    //value: [3],
    valueExpr: "ConsigneeID",
    placeholder: "Select consignee...",
    displayExpr: "ConsigneeName",
    showClearButton: true,
    disabled: true
});

//Department Name
$("#SelDepartment").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    searchEnabled: true,
    showClearButton: true,
    disabled: true
});

$("#JobCoordinator").dxSelectBox({
    placeholder: "Select",
    displayExpr: "CoordinatorLedgerName",
    valueExpr: "CoordinatorLedgerID",
    searchEnabled: true,
    showClearButton: true,

});


$("#SelPODate").dxDateBox({
    //pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    max: new Date(),
    onValueChanged: function (data) {
        var PDate = data.value;
        $("#SelDeliveryDate").dxDateBox({
            min: PDate
        });
    }
});

$("#SelDeliveryDate").dxDateBox({
    //pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    min: new Date(),
    disabled: true

});


$('#SBProcess').dxSelectBox({
    items: [],
    valueExpr: "ProcessID",
    displayExpr: "ProcessName",
    placeholder: 'Choose Process',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (ee) {
        return
        var OPT = $("#Optsplit").dxRadioGroup('instance').option('value');
        if (OPT === "Both") {
            var result = $.grep($('#ScheduleGrid').dxDataGrid('instance')._options.dataSource, function (e) { return e.ProcessID == ee.value; });
            var remainingQTY = Number(document.getElementById('TxtOrderQuantity').value)
            if (result.length > 0) {
                remainingQTY = Number(document.getElementById('TxtOrderQuantity').value) - Number(result.map(item => item.QTY).reduce((prev, next) => prev + next));
            }
            document.getElementById('TxtTotalQTY').value = Number(document.getElementById('TxtOrderQuantity').value);
            document.getElementById('TxtRemainingQTY').value = remainingQTY;
        }
        if (OPT === "Process Wise") {
            var result = $.grep($('#ScheduleGrid').dxDataGrid('instance')._options.dataSource, function (e) { return e.ProcessID == ee.value; });
            var remainingQTY = Number(document.getElementById('TxtOrderQuantity').value)
            if (result.length > 0) {
                remainingQTY = Number(document.getElementById('TxtOrderQuantity').value) - Number(result.map(item => item.QTY).reduce((prev, next) => prev + next));
            }
            document.getElementById('TxtTotalQTY').value = Number(document.getElementById('TxtOrderQuantity').value);
            document.getElementById('TxtRemainingQTY').value = remainingQTY;
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Process is required' }]
});
$('#SBVendor').dxSelectBox({
    items: [],
    valueExpr: "VendorID",
    displayExpr: "VendorName",
    placeholder: 'Choose Vendor',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (ee) {
        var OPT = $("#Optsplit").dxRadioGroup('instance').option('value');
        if (OPT === "Qty Wise") {
            var result = $('#ScheduleGrid').dxDataGrid('instance')._options.dataSource;
            var remainingQTY = Number(document.getElementById('TxtOrderQuantity').value)
            var Pre = 0, total = 0;
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (Pre !== result[i].QTY) {
                        Pre = result[i].QTY;
                        total += Pre
                    }
                }
                remainingQTY = Number(document.getElementById('TxtOrderQuantity').value) - Number(total);
            }
            document.getElementById('TxtTotalQTY').value = Number(document.getElementById('TxtOrderQuantity').value);
            document.getElementById('TxtRemainingQTY').value = remainingQTY;
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Vendor is required' }]
});
$.ajax({
    async: false,
    type: "POST",
    url: "WebServiceProductMaster.asmx/GetVendors",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        let RES1 = JSON.parse(res);
        $("#SBVendor").dxSelectBox({ dataSource: RES1 });
        VendorArray = RES1;
    }
});

$.ajax({// For Job Type And Plate Type
    type: 'post',
    async: false,
    url: 'WebServiceOthers.asmx/SelctboxTypes',
    data: {},
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"{null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        if (RES1.TblJobType !== undefined) {
            GblJobType = RES1.TblJobType;
            GblPlateType = RES1.TblPlateType;
        }
        $("#SbJobType").dxSelectBox({
            items: GblJobType,
            displayExpr: "JobType",
            valueExpr: "JobType",
            disabled: true
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProductionWorkOrder.asmx/GetDepartmentName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var Departmentname = JSON.parse(res);

        $("#SelDepartment").dxSelectBox({
            items: Departmentname
        });
    }
});

function GenerateJobCardNo() {
    try {
        $.ajax({
            async: false,
            type: 'post',
            url: 'WebServiceProductionWorkOrder.asmx/GenerateJobCardNo',
            data: '{}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text',
            async: false,
            crossDomain: true,
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var strmax = res.split(',');
                GblGenCode = strmax[0];
                $('#TxtBookingNoAuto').val(GblGenCode);
            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$.ajax({                //// For Category
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetSbCategory',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: '{}',
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbCategory").dxSelectBox({
            items: RES1,
            displayExpr: "CategoryName",
            valueExpr: "CategoryId",
            disabled: true
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

$.ajax({                //// For Customer
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetSbClient',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        //alert(res);
        var RES1 = JSON.parse(res);
        $("#SbClientName").dxSelectBox({
            items: RES1,
            displayExpr: "LedgerName",
            valueExpr: "LedgerId",
            disabled: true
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

/*
 // load consignee list of particular customer 
 */
function loadConsigneeData(clientID, consigneeID) {
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetConsigneeData",
        data: '{ClientID:' + clientID + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            consigneeID = Number(consigneeID);
            $("#SbConsigneeName").dxSelectBox({
                dataSource: RES1,
                disabled: true,
                ////onValueChanged: function (e) {
                ////    if (e.value) {
                ////        document.getElementById("txtSchConsignee").value = e.value;
                ////    }
                ////},
                //onCustomItemCreating: function (data) {
                //    var newItem = data.text;
                //    RES1.push(newItem);
                //    data.option("items", RES1);
                //    data.customItem = newItem;
                //}
                value: Number(consigneeID)
            });

        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
}
$.ajax({                //// For Job Priority
    type: 'post',
    url: 'WebServiceOthers.asmx/SelctboxJobPriority',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobPriority").dxSelectBox({
            items: RES1,
            displayExpr: "JobPriority",
            valueExpr: "JobPriority",
            disabled: true
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});
$.ajax({                //// For Job Reference
    type: "POST",
    url: "WebserviceOthers.asmx/SelctboxJobReference",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"{null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobReference").dxSelectBox({
            items: RES1,
            displayExpr: "JobReference",
            valueExpr: "JobReference",
            disabled: true
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});
$.ajax({                //// For Job Coordinator
    async: false,
    type: 'post',
    url: 'WebServiceProductionWorkOrder.asmx/LoadJobCoordinators',
    data: {},
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobCoordinator").dxSelectBox({
            items: RES1,
            displayExpr: "CoordinatorLedgerName",
            valueExpr: "CoordinatorLedgerID",
            disabled: true
        });
        $("#JobCoordinator").dxSelectBox({
            items: RES1
        })
        JobcoordinatorArray = RES1
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});
$("#DatePM").dxDateBox({
    value: new Date()
});
$.ajax({
    type: "POST",
    url: "WebserviceOthers.asmx/GetProductHSNGroups",
    data: '{Category:"Finish Goods"}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        $("#SbProductHSNGroup").dxSelectBox({
            items: RES1,
            placeholder: "Select...",
            displayExpr: "HSNCode",
            valueExpr: "HSNCode",
            searchEnabled: true,
            showClearButton: true,
            disabled: true
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Product HSN Group is required' }]
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});


$("#GridJocardData").dxDataGrid({
    dataSource: [],
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columns: [
        { dataField: "JobBookingNo", caption: 'JC No' },
        { dataField: "JobBookingDate", caption: 'JC Date' },
        { dataField: "EnquiryNo", caption: 'Enquiry No' },
        { dataField: "EstimateNo", caption: 'Quotation No' },
        { dataField: "ProjectName", caption: 'Project Name' },
        { dataField: "ClientName", caption: 'Client Name' },
        { dataField: "OrderBookingDate", caption: 'Sales Order Date' },
        { dataField: "SalesOrderNo", caption: 'Sales Order No' },
        { dataField: "PODate", caption: 'PO Date' },
        { dataField: "PONo", caption: 'PO No' },
    ],
    columnAutoWidth: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    sorting: { mode: 'multiple' },
    //export: {
    //    enabled: FlagExport,
    //    fileName: "JobCard ",
    //    allowExportSelectedData: true
    //},
    height: function () {
        return window.innerHeight / 1.4;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    filterRow: { visible: true },
    ////rowAlternationEnabled: true,
    searchPanel: { visible: false },
    onSelectionChanged: function (data) {

    }
});

$("#PrintModalGRID").dxDataGrid({
    dataSource: [],
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columns: [
        { dataField: "ProductName" },
        { dataField: "JobType" },
        { dataField: "JobReference" },
        { dataField: "JobPriority" },
        { dataField: "VendorName", caption: "Planed Vendor Name" },
        { dataField: "OrderQuantity", caption: "Planed Qty" },
        { dataField: "ScheduleVendorName" },
        { dataField: "QTY", caption: "Schedule Qty" },
        { dataField: "RateType" },
        { dataField: "Rate" },
        { dataField: "NetAmount" },
        { dataField: "CGSTTaxPercentage" },
        { dataField: "CGSTTaxAmount" },
        { dataField: "SGSTTaxPercentage" },
        { dataField: "SGSTTaxAmount" },
        { dataField: "IGSTTaxPercentage" },
        { dataField: "IGSTTaxAmount" },
        { dataField: "TotalAmount" },
        { dataField: "ExpectedDeliveryDate" },
    ],
    columnAutoWidth: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    sorting: { mode: 'multiple' },
    //export: {
    //    enabled: FlagExport,
    //    fileName: "JobCard ",
    //    allowExportSelectedData: true
    //},
    height: function () {
        return window.innerHeight / 1.4;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    filterRow: { visible: true },
    ////rowAlternationEnabled: true,
    searchPanel: { visible: false },
    onSelectionChanged: function (data) {

    }
});

function loadProcess(DefaultProcess) {
    $.ajax({
        async: false,
        type: 'POST',
        url: "WebServicePlanWindow.asmx/SuggestedOperations",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{'processids': '" + DefaultProcess + "'}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            FillterProcessArray = RES1;
            $('#SBProcess').dxSelectBox({
                items: RES1,
                valueExpr: "ProcessID",
                displayExpr: "ProcessName",
            });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
}

$("#GridPendingContents").dxDataGrid({
    dataSource: [],
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columns: [
        { dataField: "ProductName" },
        { dataField: "CategoryName" },
        { dataField: "HSNCode" },
        { dataField: "OrderQuantity" },
        { dataField: "Rate" },
        { dataField: "RateType" },
        { dataField: "GSTPercantage" },
        { dataField: "GSTAmount" },
        { dataField: "MiscPercantage" },
        { dataField: "MiscAmount" },
        { dataField: "ShippingCost" },
        { dataField: "FinalAmount" },
        { dataField: "VendorName" },
        { dataField: "Plan" }
    ],
    columnAutoWidth: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    sorting: { mode: 'multiple' },
    height: function () {
        return window.innerHeight / 2.6;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    filterRow: { visible: true },
    rowAlternationEnabled: true,
    searchPanel: { visible: false },


});
$("#SOGRID").dxDataGrid({
    dataSource: [],
    columns: [
        { dataField: "EnquiryNo", groupIndex: 0 },
        { dataField: "EstimateNo", caption: 'Quotation No' },
        { dataField: "SalesOrderNo" },
        { dataField: "OrderBookingDate" },
        //   { dataField: "PONo" },
        // { dataField: "POdate" },
        { dataField: "ClientName" },
        { dataField: "SalesManager" },
        { dataField: "SalesPerson" },
        { dataField: "SalesCoordinator" },
        { dataField: "ClientCoordinator" },
        { dataField: "CreatedBy" },
        // new columns
        { dataField: "ProductName" },
        { dataField: "OrderQuantity" },
        //{ dataField: "Rate" },
        { dataField: "RateType" },
        { dataField: "UnitCostVendor" },
        //{ dataField: "NetAmount" },
        //{ dataField: "GSTAmount" },
        //{ dataField: "FinalCost" },
        { dataField: "JobType" },
        { dataField: "JobReference" },
        { dataField: "JobPriority" },
        { dataField: "ProductDescription" },
        { dataField: "PackagingDetails" },
        { dataField: "DescriptionOther" },
        { dataField: "ExpectedDeliveryDate" },
        { dataField: "VendorName", caption: "Planed Vendor Name" }
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
    height: function () {
        return window.innerHeight / 1.6;
    },

    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#0a5696');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },

    grouping: {
        contextMenuEnabled: true,
        autoExpandAll: true, // Optional: expand all groups by default
    },
    groupPanel: {
        visible: "auto"
    },
    onContentReady: function (e) {
        e.component.option("columnAutoWidth", true);
    },
});

$("#ProductsGrid").dxDataGrid({
    dataSource: [],
    columns: [
        { dataField: "ProductName" },
        { dataField: "OrderQuantity" },
        { dataField: "UnitCostVendor" },
        { dataField: "Rate", visible: false },
        { dataField: "RateType", visible: false },
        { dataField: "NetAmount", visible: false },
        { dataField: "GSTAmount", visible: false },
        { dataField: "FinalCost", visible: false },
        { dataField: "JobType" },
        { dataField: "JobReference" },
        { dataField: "JobPriority" },
        { dataField: "ProductDescription" },
        { dataField: "PackagingDetails" },
        { dataField: "DescriptionOther" },
        { dataField: "ExpectedDeliveryDate" },
        { dataField: "VendorName", caption: "Planed Vendor Name" },
        { dataField: "Processes", caption: "Process", visible: false },

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
    onSelectionChanged: function (e) {
        document.getElementById('TxtTotalQTY').value = parseFloat(e.selectedRowsData[0].OrderQuantity);
        //document.getElementById('TxtRemainingQTY').value = Number(e.selectedRowsData[0].OrderQuantity);
        document.getElementById('TxtOrderQuantity').value = parseFloat(e.selectedRowsData[0].OrderQuantity);
        document.getElementById('TxtRate').value = parseFloat(e.selectedRowsData[0].UnitCostVendor);
        ProductType(e.selectedRowsData[0].ProductName)
        GblOrderQuantity = e.selectedRowsData[0].OrderQuantity;
        GblBookingID = e.selectedRowsData[0].ProductEstimateID;
        GblContentType = '';
        GblContentName = e.selectedRowsData[0].ProductName;
        GBLProductEstimationContentID = e.selectedRowsData[0].ProductEstimationContentID

        if (GBLProductType[0].IsOffsetProduct == true) {
            (async () => {
                await removeAllContentsData();
            })();


            GetSelectedContentPlans();
            $('#GridProductContentDetails').removeClass('hidden');
            $('#GridProductContentDetailsFlex').addClass('hidden');
            $('#arrowarea').removeClass('hidden');
        } else if (GBLProductType[0].IsUnitProduct != true && GBLProductType[0].IsOffsetProduct != true) {
            $('#GridProductContentDetails').addClass('hidden');
            $('#GridProductContentDetailsFlex').removeClass('hidden');
            $('#arrowarea').addClass('hidden');
            $("#GridProductContentDetails").dxDataGrid({
                dataSource: []
            });
            GetProductConfig(e.selectedRowsData[0].ProductEstimationContentID)


        } else {
            $("#GridProductContentDetailsFlex").dxDataGrid({
                dataSource: []
            });
            $("#GridSelectedProductProcess").dxDataGrid({ dataSource: [] });
        }
        loadprocessf(e.selectedRowsData[0].DefaultProcessStr)

        $('#SBVendor').dxSelectBox({
            value: e.selectedRowsData[0].VendorID
        })
        ValidateMaxQty();

    }

});

$("#ScheduleGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, apolyFilter: "auto" },
    columnResizingMode: "widget",
    selection: { mode: "single" },
    editing: {
        mode: 'row',
        allowDeleting: true,
        useIcon: true
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    columns: [
        { dataField: "ProductName" },
        { dataField: "OrderQuantity" },
        { dataField: "Rate" },
        { dataField: "RateType" },
        {
            dataField: "AllocatedVendorID", resizable: true, visible: true, caption: "New Allocated Vendor Name", lookup: {
                dataSource: VendorArray,
                displayExpr: "VendorName",
                valueExpr: "VendorID"
            }
        },
        { dataField: "QTY", resizable: true, visible: true, caption: "Allocated QTY" },
        { dataField: "NetAmount" },
        { dataField: "CGSTTaxAmount" },
        { dataField: "SGSTTaxAmount" },
        { dataField: "IGSTTaxAmount" },
        { dataField: "FinalCost" },
        { dataField: "JobType" },
        { dataField: "JobReference" },
        { dataField: "JobPriority" },
        {
            dataField: "JobCoordinatorID", resizable: true, visible: true, caption: "Job Coordinator", lookup: {
                dataSource: JobcoordinatorArray,
                displayExpr: "CoordinatorLedgerName",
                valueExpr: "CoordinatorLedgerID",
            }
        },
        { dataField: "CriticalInstructions", caption: 'Critical Remark' },
        { dataField: "ExpectedDeliveryDate" },
        { dataField: "VendorName", caption: "Planed Vendor Name" },

    ],
    onRowRemoved: function (e) {
        if (e.component._options.dataSource.length <= 0) {
            $("#Optsplit").dxRadioGroup({
                disabled: false
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
    onContentReady: function (e) {
        ValidateMaxQty();
    }
});

function loadprocessf(pids) {
    if (pids == "" || pids == undefined) {
        $("#GridSelectedProductProcess").dxDataGrid({ dataSource: [] });
        return
    };
    $.ajax({
        type: "POST",
        url: "WebServiceProductionWorkOrder.asmx/LoadProcess",
        data: '{pids:' + JSON.stringify(pids) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/{":,/g, '":null,');
            res = res.slice(0, -3);
            $("#GridSelectedProductProcess").dxDataGrid({ dataSource: JSON.parse(res.toString()) });
        }
    });
}

$("#GridProductContentDetailsFlex").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    //selection: { mode: "single" },
    columns: [
        { dataField: "ParameterName", caption: "Parameter Name", allowEditing: false, visible: false },
        { dataField: "ParameterDisplayName", caption: "Display Name", visible: true, allowEditing: false },
        { dataField: "ParameterDefaultValue", allowEditing: false, caption: "Default Value" },
        { dataField: "ParameterValue", caption: "Value", dataType: "number", validationRules: [{ type: "required", message: "Value is required" }] },
        { dataField: "ParameterFormula", caption: "Formula", allowEditing: false, visible: false }
    ],
    //editing: {
    //    mode: "cell",
    //    allowUpdating: true
    //},
    onEditorPreparing: function (e) {
        if (e.row.rowType === "data" && e.dataField === "ParameterValue") {
            let fildata = e.row.data.ParameterDefaultValue.split(",");
            if (fildata.length > 0 && e.row.data.ParameterDefaultValue.includes(",")) {
                e.editorName = "dxSelectBox"
                e.editorOptions.items = fildata;
                e.editorOptions.showSelectionControls = true;
                e.editorOptions.searchEnabled = true;
                e.editorOptions.value = e.value || [];
                //e.editorOptions.itemTemplate = function (itemData, _, itemElement) {
                //    itemElement
                //        .parent().attr("background", itemData.toLowerCase()).addClass("font-bold")
                //        .text(itemData);
                //}
                e.editorOptions.onValueChanged = function (args) {
                    e.setValue(args.value);
                }
            }
        }
    },
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 3.5;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitNewRow: function (e) {
        e.data.SequenceNo = e.component._options.dataSource.length + 1;
    },
    onSelectionChanged: function (data) {
        if (data) {

        }
    }
});
$("#GridSelectedProductProcess").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, apolyFilter: "auto" },
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 3.5;
    },
    editing: { mode: "cell", allowUpdating: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    columns: [{ dataField: "ProcessID", visible: false, width: 0, allowEditing: false },
    { dataField: "ProcessName", allowEditing: false },
    { dataField: "Rate", allowEditing: false, format: { type: "decimal", precision: 3 }, visible: false },
    { dataField: "RateFactor", allowEditing: false, visible: false },
    { dataField: "Remarks", caption: "Process Remark", allowEditing: true, visible: false },
    { dataField: "PaperConsumptionRequired", visible: false, width: 180, dataType: "boolean", allowEditing: true }

    ],
    rowDragging: {
        allowReordering: true,
        onReorder: function (e) {
            var visibleRows = e.component.getVisibleRows();
            var sourceRowIndex = e.fromIndex;
            var targetRowIndex = e.toIndex;

            if (sourceRowIndex >= 0 && targetRowIndex >= 0) {
                var sourceData = visibleRows[sourceRowIndex].data;
                var targetData = visibleRows[targetRowIndex].data;

                // Swap the order of the dragged row and the target row in your data source
                var dataSource = e.component.option("dataSource");
                dataSource.splice(sourceRowIndex, 1);
                dataSource.splice(targetRowIndex, 0, sourceData);

                // Update the data source
                e.component.option("dataSource", dataSource);
            }
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
var gridCont = $("#GridProductContentDetails").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    editing: {
        mode: "cell",
        allowUpdating: true,
        allowDeleting: true,
        useIcon: true
    },
    allowColumnResizing: true,
    columnResizingMode: "widget",
    showRowLines: true,
    sorting: false,
    showBorders: true,
    columnFixing: {
        enabled: true
    },
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 3.5;
    },
    //    columnAutoWidth: true,
    columns: [{
        type: "buttons",
        width: 50,
        buttons: ["delete"
            //, {
            //hint: "Clone",
            //icon: "repeat",
            ////visible: function (e) {
            ////    return !e.row.isEditing && !isChief(e.row.data.Position);
            ////},
            //onClick: function (e) {
            //    var clonedItem = $.extend({}, e.row.data, { ID: ++maxID });
            //    employees.splice(e.row.rowIndex, 0, clonedItem);
            //    e.component.refresh(true);
            //    e.event.preventDefault();
            //}
            //}
        ]
    },
    { dataField: "PlanContentType", caption: "Content Type", allowEditing: false, minWidth: 100 },
    { dataField: "PlanContName", caption: "Product Name", minWidth: 150, validationRules: [{ type: 'required', message: 'Content name is required' }] },
    { dataField: "PlanContQty", caption: "Quantity", allowEditing: false, visible: false },
    { dataField: "JobPrePlan", caption: "Job Size", minWidth: 100, allowEditing: false },
    { dataField: "PaperSize", allowEditing: false, minWidth: 80 },
    { dataField: "CutSize", caption: "Printing Sheet Size", allowEditing: false, minWidth: 80, visible: true },
    { dataField: "TotalUps", caption: "Ttl Ups", allowEditing: false, visible: true, minWidth: 50 },
    { dataField: "ItemPlanQuality", caption: "Quality", allowEditing: false, minWidth: 100 },
    { dataField: "ItemPlanGsm", caption: "GSM", allowEditing: false, minWidth: 80 },
    { dataField: "ItemPlanMill", caption: "Mill", allowEditing: false, minWidth: 80 },
    { dataField: "NoOfPages", caption: "Pages", allowEditing: false, visible: false, minWidth: 30 },
    { dataField: "PrintingStyle", allowEditing: false, visible: true, minWidth: 100 },
    {
        dataField: "JobTrimming", allowEditing: false, minWidth: 80,
        calculateCellValue(e) {
            if (e === undefined) return;
            if (e.Trimmingleft === undefined || e.Trimmingleft === "undefined") return "";
            var jobtrim = 'L=' + e.Trimmingleft + '; T=' + e.Trimmingtop + '; R=' + e.Trimmingright + '; B=' + e.Trimmingbottom;
            return jobtrim;
        }
    },
    {
        dataField: "PrintingImpressions", caption: "Ttl Impressions", allowEditing: false,
        visible: true, minWidth: 80,
        calculateCellValue(e) {
            if (e === undefined) return;
            if (e.ActualSheets === undefined || e.ActualSheets === "undefined") return 0;
            return e.ActualSheets + e.WastageSheets;
        }
    },
    { dataField: "PlanFColor", caption: "F Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanBColor", caption: "B Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanSpeFColor", caption: "Spe. F Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanSpeBColor", caption: "Spe. B Color", allowEditing: false, minWidth: 50 },
    {
        dataField: "UnitCost", caption: "Unit Cost", allowEditing: false, minWidth: 50,
        calculateCellValue(e) {
            if (e === undefined) return;
            if (e.GrantAmount !== undefined && e.GrantAmount > 0) {
                var unitCost = Number(Number(e.GrantAmount) / Number(GblOrderQuantity)).toFixed(3);
                return unitCost;
            } else
                return 0;
        }
    },
    {
        dataField: "OldUnitCost", caption: "Old Unit Cost", allowEditing: false, minWidth: 80,
        calculateCellValue(e) {
            if (e === undefined) return;
            if (e.OldGrantAmount === undefined || e.OldGrantAmount <= 0) e.OldGrantAmount = e.GrantAmount;
            if (e || e.OldGrantAmount !== undefined && e.OldGrantAmount > 0) {
                var unitCost = Number(Number(e.OldGrantAmount) / Number(GblOrderQuantity)).toFixed(3);
                return unitCost;
            } else
                return 0;
        }
    },
    { dataField: "FullSheets", caption: "Paper Qty(Sheets)", allowEditing: false, visible: true, minWidth: 80 },
    {
        caption: "Paper Qty(Packs)", minWidth: 80,
        calculateCellValue(e) {
            if (!e) return;
            var SizeL = 0, SizeW = 0; var pperpack = '';
            SizeL = e.PaperSize.split('x')[0];
            SizeW = e.PaperSize.split('x')[1];
            if (e.PlanType === 'Sheet Planning') {
                pperpack = Number(e.FullSheets + Number(Number(e.UnitPerPacking) - Number(Number(e.FullSheets) % Number(e.UnitPerPacking)))) /
                    Number(e.UnitPerPacking) + ' ' + e.Packing + ' (' + e.UnitPerPacking + ') & (' +
                    Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                        * Number(e.FullSheets), 0) + ' KG)';
                return pperpack;
            } else if (e.PurchaseUnit !== undefined && e.PurchaseUnit !== "" && e.PurchaseUnit !== null) {
                if (e.PurchaseUnit.toUpperCase() === "KG") {
                    pperpack = Number(e.FullSheets) + ' Sheets & (' +
                        Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                            * Number(e.FullSheets), 0) + ' KG)';
                } else if (e.PurchaseUnit.toUpperCase().includes("SHEET") === true) {
                    pperpack = Number(e.FullSheets) + ' Sheets & (' +
                        Math.round(Number(Number(SizeW) / 1000) * Number(e.FullSheets), 2) + ' Meter)';
                }
                return pperpack;
            } else {
                pperpack = Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                    * Number(e.FullSheets), 0) + ' KG';
                return pperpack;
            }
        }, allowEditing: false
    },
    { dataField: "ActualSheets", caption: "Cut Sheet Qty", allowEditing: false, visible: true, minWidth: 100 },
    {
        dataField: "PaperBy", allowEditing: false, visible: true, minWidth: 80,
        calculateCellValue(e) {
            var paperby = "Self";
            if (e === undefined) return;
            if (e.ChkPaperByClient === true) {
                paperby = 'Client';
            }
            return paperby;
        }
    },
    { dataField: "GrainDirection", allowEditing: false, visible: true, minWidth: 80 },
    { dataField: "MachineName", allowEditing: false, visible: true, minWidth: 80 },
    { dataField: "PlateQty", caption: "Plates", allowEditing: false, visible: true, minWidth: 50 },
    { dataField: "PlanOnlineCoating", allowEditing: false, visible: true, minWidth: 80 },
    { dataField: "PlanType", allowEditing: false, visible: true, minWidth: 80 },
    {
        dataField: "StripingMargin", allowEditing: false, visible: true, minWidth: 80,
        calculateCellValue(e) {
            if (e === undefined) return;
            if (e.Stripingleft === undefined) return "";
            var jobstrip = 'L=' + e.Stripingleft + '; T=' + e.Stripingtop + '; R=' + e.Stripingright + '; B=' + e.Stripingbottom;
            return jobstrip;
        }
    },
    {
        dataField: "JobType", allowEditing: true, minWidth: 80,
        lookup: {
            dataSource: GblJobType,
            displayExpr: "JobType",
            valueExpr: "JobType"
        }
    }],
    onContentReady: function (e) {
        window.setTimeout(function () {
            if (!e.component.getSelectedRowKeys().length)
                e.component.selectRowsByIndexes(0);
        }, 1000);
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
        if (e.rowType === "data") {
            if (e.data.OldGrantAmount < e.data.GrantAmount) {
                e.rowElement.css('background', '#ff8080');
            }
        }
    },
    onRowUpdating: function (e) {
        if (e.newData.PlanContName === undefined) return;
        var result = $.grep(e.component._options.dataSource, function (ex) {
            return ex.PlanContName.trim() === e.newData.PlanContName.trim() && ex.PlanContentType === e.key.PlanContentType;
        });
        if (result.length >= 1) {
            swal("Duplicate Content Name Found!", "Please enter different content name..!", "error");
            e.newData.PlanContName = e.key.PlanContName;
            return;
        }
        renameContentsData(e.newData.PlanContName.trim(), e.key.PlanContName.trim(), e.key.PlanContentType.trim());
    },
    onRowRemoved: function (e) {
        deleteDataContentsWise(e.data.PlanContName, e.data.PlanContentType); ////Delete data from data store
    },
    onSelectionChanged: function (data) {
        return
        if (data) {
            if (data.selectedRowsData.length <= 0) {
                GblContentName = "";
                GblContentType = ""; GblPaperId = 0;
                //   clearData();
                GblPlanValues = {};
                GblContentId = 0;
                return false;
            }
            try {
                GblContentName = data.selectedRowsData[0].PlanContName;
                GblContentType = data.selectedRowsData[0].PlanContentType;
                GblContentId = data.selectedRowsData[0].JobBookingJobCardContentsID;
                document.getElementById("PlanContentName").value = GblContentName;
                document.getElementById("PlanContentType").value = GblContentType;

                document.getElementById("PlanContName").innerHTML = GblContentName;
                document.getElementById("ContentOrientation").innerHTML = GblContentType;

                GblPaperId = data.selectedRowsData[0].PaperID;
                document.getElementById("PlanContQty").innerHTML = GblOrderQuantity;
                document.getElementById("TxtProductRemark").value = data.selectedRowsData[0].SpecialInstructions;

                //$('#TxtLineNo').val(ObjContentsDataAll[0].LineNo);
                if (GblProdMasCode === "" || GblProdMasCode === null || GblProdMasCode === undefined || GblProdMasCode === "null") {
                    //consol.log("passed");
                }
                else {
                    $('#TxtRemark').val(ObjContentsDataAll[0].JobDetailsRemark);
                }
                ProcesssData();
                LoadInkShadeSelected();
                GblPlanValues = data.selectedRowsData[0];

                var keys = data.component.getSelectedRowKeys();
                ContStore = data.component._options.dataSource;
                for (var i = 0; i < keys.length; i++) {
                    VisibleIndex = gridCont.getRowIndexByKey(keys[i]);
                }
                if (data.selectedRowsData[0].AttachedFileName !== null && data.selectedRowsData[0].UserAttachedPicture !== null) {
                    var ext = data.selectedRowsData[0].AttachedFileName.split(';')[0].match(/jpeg|png|gif|jpg/)[0];
                    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "data:image/" + ext + ";base64," + data.selectedRowsData[0].UserAttachedPicture);
                } else {
                    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
                }
            } catch (Ex) {
                //alert(Ex);
            }
        }
    }
}).dxDataGrid('instance');

function ValidateMaxQty() {
    var OPT = $("#Optsplit").dxRadioGroup('instance').option('value');
    document.getElementById('TxtRemainingQTY').value = 0;
    if (OPT === "Both") {
        if (Number(document.getElementById('TxtRemainingQTY').value) < Number(document.getElementById('TxtScheduleQTY').value)) {
            document.getElementById('errorQty').innerHTML = "Schedule qty should be less then or equal to remaining qty \n Remaining Qty : - " + Number(document.getElementById('TxtRemainingQTY').value);
            document.getElementById('TxtScheduleQTY').value = 0;
        } else document.getElementById('errorQty').innerHTML = "";
    } else if (OPT === "Qty Wise") {
        var result = $.grep($('#ScheduleGrid').dxDataGrid('instance')._options.dataSource, function (ex) {
            return ex.ProductEstimationContentID === GBLProductEstimationContentID;
        });;
        var remainingQTY = Number(document.getElementById('TxtOrderQuantity').value)
        var Pre = 0, total = 0;
        if (result.length > 0) {
            var total = 0;
            for (var i = 0; i < result.length; i++) {
                total += result[i].QTY;
            }
            var remainingQTY = Number(document.getElementById('TxtOrderQuantity').value) - total;
        }
        document.getElementById('TxtTotalQTY').value = Number(document.getElementById('TxtOrderQuantity').value);
        document.getElementById('TxtRemainingQTY').value = remainingQTY;
        document.getElementById('TxtRemainingQTY').value = remainingQTY - Number(document.getElementById('TxtScheduleQTY').value);
        if (Number(remainingQTY) < Number(document.getElementById('TxtScheduleQTY').value)) {
            if (Number(document.getElementById('TxtRemainingQTY').value) <= 0) {
                document.getElementById('TxtRemainingQTY').value = remainingQTY;
            }
            document.getElementById('errorQty').innerHTML = "Schedule qty should be less then or equal to remaining qty \n Remaining Qty : - " + Number(document.getElementById('TxtRemainingQTY').value);

            document.getElementById('TxtScheduleQTY').value = 0;
        } else {
            document.getElementById('errorQty').innerHTML = "";
        }
    }
}

$('#BtnEdit').click(function () {
    try {
        NewJC();
        var SelectedProductData = $('#GridJocardData').dxDataGrid('instance').getSelectedRowsData();
        if (SelectedProductData.length <= 0) {
            alert('Please Select jobcard');
            return;
        }
        dataProject = SelectedProductData
        //GBLScheduleContents
        $('#TxtOrderBookingDate').val(SelectedProductData[0].OrderBookingDate);
        $('#TxtOrderBookingNo').val(SelectedProductData[0].SalesOrderNo);
        $('#TxtPONo').val(SelectedProductData[0].PONo);
        $('#TxtPODate').val(SelectedProductData[0].PODate);
        $('#TxtBookingNoAuto').val(SelectedProductData[0].JobBookingNo);
        $("#SelPODate").dxDateBox({ value: SelectedProductData[0].PODate });

        var FilterContents = $.grep(GBLScheduleContents, function (ex) {
            return ex.JobBookingID === SelectedProductData[0].JobBookingID;
        });
        $('#ScheduleGrid').dxDataGrid({
            dataSource: FilterContents
        });

        $.ajax({
            type: 'post',
            url: 'WebServiceProductionWorkOrder.asmx/LoadSOContents',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: '{OrderbookingID:' + Number(SelectedProductData[0].OrderBookingID) + '}',
            success: function (results) {
                if (results.d === "500") return;
                var res = results.d.replace(/\\/g, '');
                res = res.substr(1);
                res = res.replace(/u0026/g, '&');
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                $('#ProductsGrid').dxDataGrid({
                    dataSource: RES1
                });
                ContentsDataArray = RES1
            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
            }
        });

        document.getElementById("BtnEdit").setAttribute("data-target", "#ModalCreate");
    } catch (e) {
        console.log(e);
    }

});

$('#BtnAdd').click(function () {
    var SelectedProductData = $('#ProductsGrid').dxDataGrid('instance').getSelectedRowsData();
    var ProcessData = $('#GridSelectedProductProcess').dxDataGrid('instance')._options.dataSource;
    var PlanDataOffset = $('#GridProductContentDetails').dxDataGrid('instance')._options.dataSource;
    var PlanData = $('#GridProductContentDetailsFlex').dxDataGrid('instance')._options.dataSource;
    var dataGrid = $('#ScheduleGrid').dxDataGrid('instance');
    var SBVendor = $('#SBVendor').dxSelectBox('instance').option('value');
    var JobCoordinator = $('#JobCoordinator').dxSelectBox('instance').option('value');
    var OPT = $("#Optsplit").dxRadioGroup('instance').option('value');
    //var SBProcess = $('#SBProcess').dxSelectBox('instance').option('value');
    //var IsallProcess = document.getElementById('allprocess').checked;
    var TxtCriticalRemark = document.getElementById('TxtCriticalRemark').value;
    var TxtRate = Number(document.getElementById('TxtRate').value);

    if (SBVendor === null || SBVendor <= 0) {
        DevExpress.ui.notify("Please select vendor..!", "error", 2000);
        $("#SBVendor").dxValidator('instance').validate();
        return;
    }
    if (JobCoordinator === null || JobCoordinator <= 0) {
        DevExpress.ui.notify("Please select JobCoordinator..!", "error", 2000);
        $("#JobCoordinator").dxValidator('instance').validate();
        return;
    }
    if (Number(document.getElementById('TxtScheduleQTY').value) <= 0) {
        DevExpress.ui.notify("Schedule qty should be greater then 0..!", "error", 2000);
        return;
    }
    if (TxtRate.toString() == "" || TxtRate.toString() == "0") {
        DevExpress.ui.notify("Rate should be greater then 0..!", "error", 2000);
        return;
    }
    if (ProcessData.length <= 0) {
        DevExpress.ui.notify("There are no available processes for the product, thus progress cannot be made...!", "error", 2000);
        return;
    }

    var ProcessIDStr = ProcessData.map(function (process) {
        return process.ProcessID;
    }).join(',');

    var newdata = [];
    if (OPT === "Qty Wise") {

        SelectedProductData[0].AllocatedVendorID = SBVendor;
        SelectedProductData[0].JobCoordinatorID = JobCoordinator;
        SelectedProductData[0].CriticalInstructions = TxtCriticalRemark;
        SelectedProductData[0].ProductEstimationContentID = GBLProductEstimationContentID;
        SelectedProductData[0].QTY = Number(document.getElementById('TxtScheduleQTY').value);
        SelectedProductData[0].NetAmount = (Number(document.getElementById('TxtScheduleQTY').value) * Number(TxtRate)).toFixed(2);

        var IsSameState = false;
        // To get State Of Client 
        var result = $.grep(VendorArray, function (ex) { return ex.VendorID === Number(SBVendor); });
        if (result.length === 1) {
            if (GBLLoginCompanyState == result[0].State)
                IsSameState = true;
            else
                IsSameState = false;
        }
        if (IsSameState) {
            SelectedProductData[0].CGSTTaxAmount = ((SelectedProductData[0].NetAmount * SelectedProductData[0].CGSTTaxPercentage) / 100).toFixed(2);
            SelectedProductData[0].CGSTTaxPercentage = SelectedProductData[0].CGSTTaxPercentage

            SelectedProductData[0].SGSTTaxAmount = ((SelectedProductData[0].NetAmount * SelectedProductData[0].SGSTTaxPercentage) / 100).toFixed(2);
            SelectedProductData[0].SGSTTaxPercentage = SelectedProductData[0].SGSTTaxPercentage;

            SelectedProductData[0].IGSTTaxAmount = 0;
            SelectedProductData[0].IGSTTaxPercentage = 0;

        } else {
            SelectedProductData[0].IGSTTaxAmount = ((SelectedProductData[0].NetAmount * SelectedProductData[0].IGSTTaxPercentage) / 100).toFixed(2);
            SelectedProductData[0].IGSTTaxPercentage = SelectedProductData[0].IGSTTaxPercentage;
            SelectedProductData[0].CGSTTaxAmount = 0;
            SelectedProductData[0].SGSTTaxAmount = 0;
            SelectedProductData[0].CGSTTaxPercentage = 0;
            SelectedProductData[0].SGSTTaxPercentage = 0;

        }
        SelectedProductData[0].TotalAmount = (parseFloat(SelectedProductData[0].IGSTTaxAmount) + parseFloat(SelectedProductData[0].SGSTTaxAmount) + parseFloat(SelectedProductData[0].CGSTTaxAmount) + parseFloat(SelectedProductData[0].NetAmount))
        SelectedProductData[0].FinalCost = (parseFloat(SelectedProductData[0].IGSTTaxAmount) + parseFloat(SelectedProductData[0].SGSTTaxAmount) + parseFloat(SelectedProductData[0].CGSTTaxAmount) + parseFloat(SelectedProductData[0].NetAmount))
        SelectedProductData[0].ProcessData = ProcessData
        SelectedProductData[0].ProcessIDStr = ProcessIDStr
        SelectedProductData[0].Rate = TxtRate;

        if (GBLProductType[0].IsOffsetProduct)
            SelectedProductData[0].ContentPlanDetail = PlanDataOffset;
        else
            SelectedProductData[0].ContentPlanDetail = PlanData;

        SelectedProductData[0].ProductType = GBLProductType[0].IsOffsetProduct == true ? "Offset" : 'Other';

        var clonedItem = $.extend({}, SelectedProductData[0]);
        dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
        dataGrid.refresh(true);
        document.getElementById('TxtScheduleQTY').value = 0;
        document.getElementById('TxtRemainingQTY').value = 0;
        document.getElementById("TxtCriticalRemark").value = '';
        ValidateMaxQty()
        return;

    }


});
$('#BtnCreate').click(function () {
    NewJC();
    document.getElementById('TxtSalesOrderNo').value = '';
    document.getElementById("BtnCreate").setAttribute("data-target", "#ModalCreate");
});
$('#BtnSavejc').click(function () {
    try {
        if (ContentsDataArray.length <= 0) {
            swal("There is no product to save");
            return;
        }
        // For Jobbooking JobCard
        var JobcardMain = [], Jobcardmainobj = {};

        Jobcardmainobj.OrderBookingID = dataProject[0].OrderBookingId;
        Jobcardmainobj.BookingID = dataProject[0].ProductEstimateID;
        Jobcardmainobj.ProductEstimateID = dataProject[0].ProductEstimateID;
        Jobcardmainobj.PONo = dataProject[0].PONo;
        Jobcardmainobj.PODate = dataProject[0].POdate;
        Jobcardmainobj.JobName = dataProject[0].ProjectName;
        Jobcardmainobj.ClientName = dataProject[0].ClientName;
        Jobcardmainobj.LedgerID = dataProject[0].LedgerID;
        JobcardMain.push(Jobcardmainobj);
        // For Jobbooking JobCardContents/Products

        var JobcardContents = [], JobcardContentsobj = {};
        var ProductsGrid = $('#ProductsGrid').dxDataGrid('instance')._options.dataSource;
        var ScheduleGridData = $('#ScheduleGrid').dxDataGrid('instance')._options.dataSource;

        if (ScheduleGridData.length <= 0) {
            swal("There is no product to save, Please schedule");
            return;
        }

        for (var i = 0; i < ProductsGrid.length; i++) {
            JobcardContentsobj = {};
            JobcardContentsobj.JobContentsID = ProductsGrid[i].ProductEstimationContentID;

            var result = $.grep($('#ScheduleGrid').dxDataGrid('instance')._options.dataSource, function (ex) {
                return ex.ProductEstimationContentID === ProductsGrid[i].ProductEstimationContentID;
            });
            var Pre = 0, total = 0;
            if (result.length > 0) {
                var total = 0;
                for (var j = 0; j < result.length; j++) {
                    total += result[j].QTY;
                }
            }

            // Condition to Check Total Order Qty is Equal to Schedule Qty
            if (Number(total) != Number(ProductsGrid[i].OrderQuantity)) {
                alert(`The total quantity scheduled for the product ${ProductsGrid[i].ProductName} should be equal to the order quantity.`);
                return;
            }

            var PlanData = $.grep(ScheduleGridData, function (ex) { return ex.ProductEstimationContentID === ProductsGrid[i].ProductEstimationContentID })
            if (PlanData.length > 0) {
                if (PlanData[0].ContentPlanDetail != undefined) {
                    if (PlanData[0].ProductType == "Offset") {
                        //for (var i = 0; i < PlanData[0].ContentPlanDetail.length; i++) {
                        var data = PlanData[0].ContentPlanDetail[0];
                        if (data != undefined) {
                            JobcardContentsobj.MachineID = data.MachineID
                            JobcardContentsobj.MachineName = data.MachineName
                            JobcardContentsobj.Gripper = data.Gripper
                            JobcardContentsobj.GripperSide = data.GripperSide
                            JobcardContentsobj.MachineColors = data.MachineColors
                            JobcardContentsobj.PaperID = data.PaperID
                            JobcardContentsobj.PaperSize = data.PaperSize
                            JobcardContentsobj.CutSize = data.CutSize
                            JobcardContentsobj.CutL = data.CutL
                            JobcardContentsobj.CutW = data.CutW
                            JobcardContentsobj.UpsL = data.UpsL
                            JobcardContentsobj.UpsW = data.UpsW
                            JobcardContentsobj.TotalUps = data.TotalUps
                            JobcardContentsobj.BalPiece = data.BalPiece
                            JobcardContentsobj.BalSide = data.BalSide
                            JobcardContentsobj.WasteArea = data.WasteArea
                            JobcardContentsobj.WastePerc = data.WastePerc
                            JobcardContentsobj.WastageKg = data.WastageKg
                            JobcardContentsobj.GrainDirection = data.GrainDirection
                            JobcardContentsobj.PlateQty = data.PlateQty
                            JobcardContentsobj.PlateRate = data.PlateRate
                            JobcardContentsobj.PlateAmount = data.PlateAmount
                            JobcardContentsobj.MakeReadyWastageSheet = data.MakeReadyWastageSheet
                            JobcardContentsobj.ActualSheets = data.ActualSheets
                            JobcardContentsobj.WastageSheets = data.WastageSheets
                            JobcardContentsobj.TotalPaperWeightInKg = data.TotalPaperWeightInKg
                            JobcardContentsobj.FullSheets = data.FullSheets
                            JobcardContentsobj.PaperRate = data.PaperRate
                            JobcardContentsobj.PaperAmount = data.PaperAmount
                            JobcardContentsobj.PrintingImpressions = data.PrintingImpressions
                            JobcardContentsobj.ImpressionsToBeCharged = data.ImpressionsToBeCharged
                            JobcardContentsobj.PrintingRate = data.PrintingRate
                            JobcardContentsobj.PrintingAmount = data.PrintingAmount
                            JobcardContentsobj.TotalMakeReadies = data.TotalMakeReadies
                            JobcardContentsobj.MakeReadyRate = data.MakeReadyRate
                            JobcardContentsobj.MakeReadyAmount = data.MakeReadyAmount
                            JobcardContentsobj.FinalQuantity = data.FinalQuantity
                            JobcardContentsobj.TotalColors = data.TotalColors
                            JobcardContentsobj.TotalAmount = data.TotalAmount
                            JobcardContentsobj.CutLH = data.CutLH
                            JobcardContentsobj.CutHL = data.CutHL
                            JobcardContentsobj.PrintingStyle = data.PrintingStyle
                            JobcardContentsobj.PrintingChargesType = data.PrintingChargesType
                            JobcardContentsobj.ExpectedExecutionTime = data.ExpectedExecutionTime
                            JobcardContentsobj.TotalExecutionTime = data.TotalExecutionTime
                            JobcardContentsobj.MainPaperName = data.MainPaperName
                            JobcardContentsobj.PlanType = data.PlanType
                            JobcardContentsobj.PaperRateType = data.PaperRateType
                            JobcardContentsobj.DieCutSize = data.DieCutSize
                            JobcardContentsobj.InterlockStyle = data.InterlockStyle
                            JobcardContentsobj.NoOfSets = data.NoOfSets
                            JobcardContentsobj.OldGrantAmount = data.OldGrantAmount
                            JobcardContentsobj.GrantAmount = data.GrantAmount
                            JobcardContentsobj.Packing = data.Packing
                            JobcardContentsobj.UnitPerPacking = data.UnitPerPacking
                            JobcardContentsobj.RoundofImpressionsWith = data.RoundofImpressionsWith
                            JobcardContentsobj.SpeColorFCharges = data.SpeColorFCharges
                            JobcardContentsobj.SpeColorBCharges = data.SpeColorBCharges
                            JobcardContentsobj.SpeColorFAmt = data.SpeColorFAmt
                            JobcardContentsobj.SpeColorBAmt = data.SpeColorBAmt
                            JobcardContentsobj.OpAmt = data.OpAmt
                            JobcardContentsobj.PlanID = data.PlanID
                            JobcardContentsobj.PlanContQty = data.PlanContQty
                            JobcardContentsobj.PlanContentType = data.PlanContentType
                            JobcardContentsobj.PlanContName = data.PlanContName
                            JobcardContentsobj.SequenceNo = data.SequenceNo
                            JobcardContentsobj.ContentSizeValues = data.ContentSizeValues
                            JobcardContentsobj.CoatingCharges = data.CoatingCharges
                            JobcardContentsobj.CoatingAmount = data.CoatingAmount
                            JobcardContentsobj.PaperGroup = data.PaperGroup
                            JobcardContentsobj.JobPriority = data.JobPriority
                            JobcardContentsobj.JobReference = data.JobReference;
                            JobcardContentsobj.JobPriority = data.JobPriority;
                            JobcardContentsobj.CoordinatorLedgerID = 0//SbJobCoordinatorID;
                            JobcardContentsobj.CoordinatorLedgerName = ''//$("#SbJobCoordinator").dxSelectBox("instance").option('text');
                            JobcardContentsobj.ConsigneeLedgerID = 0//SbConsigneeID;
                            JobcardContentsobj.ProductMasterID = 0//TablePendingData[0].ProductMasterID;
                            JobcardContentsobj.OrderBookingID = PlanData[0].OrderBookingId;
                        }
                    } else {
                        JobcardContentsobj.OtherPlan = JSON.stringify(PlanData[0].ContentPlanDetail);
                    }
                }
            }
            JobcardContents.push(JobcardContentsobj);
        }


        // For JobCard Schedule
        var ScheduleArr = [], objSchedule = {};
        var ProcessArr = [], objProcess = {};
        for (var i = 0; i < ScheduleGridData.length; i++) {
            objSchedule = {}
            objSchedule.OrderBookingID = GblBookingID

            objSchedule.JobContentsID = ScheduleGridData[i].ProductEstimationContentID;
            objSchedule.OrderBookingDetailsID = ScheduleGridData[i].OrderBookingDetailsID;
            objSchedule.ProductEstimateID = ScheduleGridData[i].ProductEstimateID
            objSchedule.JobName = ScheduleGridData[i].ProductName
            objSchedule.OrderQuantity = ScheduleGridData[i].OrderQuantity
            objSchedule.ScheduleQty = ScheduleGridData[i].QTY
            objSchedule.ScheduleVendorId = ScheduleGridData[i].AllocatedVendorID
            objSchedule.ProductType = ScheduleGridData[i].ProductType
            objSchedule.NetAmount = ScheduleGridData[i].NetAmount
            objSchedule.JobCoordinatorID = ScheduleGridData[i].JobCoordinatorID
            objSchedule.ProcessData = JSON.stringify(ScheduleGridData[i].ProcessData);
            objSchedule.CriticalRemark = ScheduleGridData[i].CriticalInstructions;
            objSchedule.VendorID = ScheduleGridData[i].VendorID;
            objSchedule.IGSTTaxAmount = ScheduleGridData[i].IGSTTaxAmount;
            objSchedule.IGSTTaxPercentage = ScheduleGridData[i].IGSTTaxPercentage;
            objSchedule.SGSTTaxAmount = ScheduleGridData[i].SGSTTaxAmount;
            objSchedule.SGSTTaxPercentage = ScheduleGridData[i].SGSTTaxPercentage;
            objSchedule.CGSTTaxAmount = ScheduleGridData[i].CGSTTaxAmount;
            objSchedule.CGSTTaxPercentage = ScheduleGridData[i].CGSTTaxPercentage;
            objSchedule.TotalAmount = parseFloat(ScheduleGridData[i].TotalAmount).toFixed(2)
            objSchedule.FinalCost = parseFloat(ScheduleGridData[i].FinalCost).toFixed(2)
            objSchedule.RateType = ScheduleGridData[i].RateType;
            objSchedule.Rate = ScheduleGridData[i].Rate;
            objSchedule.JobType = ScheduleGridData[i].JobType;
            objSchedule.JobReference = ScheduleGridData[i].JobReference;
            objSchedule.JobPriority = ScheduleGridData[i].JobPriority;
            objSchedule.ExpectedDeliveryDate = ScheduleGridData[i].ExpectedDeliveryDate;

            objSchedule.ProductDescription = ScheduleGridData[i].ProductDescription;
            objSchedule.PackagingDetails = ScheduleGridData[i].PackagingDetails;
            objSchedule.DescriptionOther = ScheduleGridData[i].DescriptionOther;
            objSchedule.ProcessIDStr = ScheduleGridData[i].ProcessIDStr;

            // Adding Process to Array
            for (var j = 0; j < ScheduleGridData[i].ProcessIDStr.split(',').length; j++) {
                if (ScheduleGridData[i].ProcessIDStr.split(',')[j] != "") {
                    objProcess = {};
                    objProcess.BookingID = ScheduleGridData[i].ProductEstimateID;
                    objProcess.ProductEstimationContentID = ScheduleGridData[i].ProductEstimationContentID;
                    objProcess.ProcessID = Number(ScheduleGridData[i].ProcessIDStr.split(',')[j]);
                    ProcessArr.push(objProcess);
                }
            }
            ScheduleArr.push(objSchedule);
        }
        swal({
            title: "Jobcard Saving...",
            text: 'Are you sure to save?',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        },
            function () {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                // Calling To Ajax 
                $.ajax({
                    type: "POST",
                    url: "WebServiceProductionWorkOrder.asmx/SavejobcardSchedule",
                    data: '{JobCardMain:' + JSON.stringify(JobcardMain) + ',JobcardContents:' + JSON.stringify(JobcardContents) + ',JObCardSchedule:' + JSON.stringify(ScheduleArr) + ',ProcessArr:' + JSON.stringify(ProcessArr) + ',FlagEdit:false,JobcardId:0}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        var RES1 = JSON.parse(results);
                        var title, text, type;
                        if (RES1.d.includes("Error:500")) {
                            title = "Error in saving Production Work Order..!";
                            text = RES1.d.replace("Error:500,", "");
                            type = "error";
                        } else if (RES1.d.includes("You are not authorized")) {
                            title = "Access Denied..!";
                            text = RES1.d;
                            type = "warning";
                        } else if (RES1.d.includes("can not Modify")) {
                            title = "Can't Update..!";
                            text = RES1.d;
                            type = "warning";
                        } else if (RES1.d.includes("Job card can't be saved")) {
                            title = "Free stock is not available in the listed content's item";
                            type = "warning";
                            text = RES1.d + " Please check free stock and save job card again";
                        } else {
                            if (FlagEdit === false) {
                                FlagEdit = true;
                                title = "Saved Successfully";
                            } else title = "Updated Successfully";
                            text = "Production Work Order No: " + RES1.d + " " + title + "..!";
                            DevExpress.ui.notify("Production Work Order " + title + "..!", "success", 1500);
                            type = "success";
                            document.getElementById("TxtBookingNoAuto").value = RES1.d;
                            //$("#BtnSaveJobcard").hide();
                            //uploadFileJobCard();
                        }
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal({
                            title: title,
                            text: text,
                            type: type,
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            closeOnConfirm: true
                        }, function () {
                            if (title === "Saved Successfully") location.reload();
                        });
                    },
                    error: function (ex) {
                        console.log(ex);
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    }
                });

            });

    } catch (e) {
        console.log(e);
    }

})
$('#BtnNextSO').click(function () {
    dataProject = $('#SOGRID').dxDataGrid('instance').getSelectedRowsData();
    if (dataProject.length <= 0) {
        alert('Please select a sales order form the grid to continue.');
        return
    }
    var TablePendingData = $.grep(ContentsDataArray, function (ex) { return ex.OrderBookingDetailsID === dataProject[0].OrderBookingDetailsID; })
    GenerateJobCardNo();
    $('#TxtOrderBookingDate').val(dataProject[0].OrderBookingDate);
    $('#TxtOrderBookingNo').val(dataProject[0].SalesOrderNo);
    $('#TxtPONo').val(dataProject[0].PONo);
    $('#TxtPODate').val(dataProject[0].POdate);
    $("#SelPODate").dxDateBox({ value: dataProject[0].POdate });


    $("#ProductsGrid").dxDataGrid({
        columns: [
            { dataField: "ProductName" },
            { dataField: "OrderQuantity" },
            { dataField: "UnitCostVendor" },
            { dataField: "Rate", visible: false },
            { dataField: "RateType", visible: false },
            { dataField: "NetAmount", visible: false },
            { dataField: "GSTAmount", visible: false },
            { dataField: "FinalCost", visible: false },
            { dataField: "JobType" },
            { dataField: "JobReference" },
            { dataField: "JobPriority" },
            { dataField: "ProductDescription" },
            { dataField: "PackagingDetails" },
            { dataField: "DescriptionOther" },
            { dataField: "ExpectedDeliveryDate" },
            { dataField: "VendorName", caption: "Planed Vendor Name" },
            { dataField: "Processes", caption: "Process", visible: false },

        ],
        dataSource: TablePendingData,

    });

    $('#CloseModaly').click();
    return;
    //---------------------------

});

function ProductType(ContentName) {
    $.ajax({
        async: false,
        type: "POST",
        url: "WebServiceProductionWorkOrder.asmx/CheckProductType",
        data: '{ContentName:' + JSON.stringify(ContentName) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            GBLProductType = RES1;
        },
        error: function errorFunc(jqXHR) {
            //alert("Something went wrong!");
        }
    });
}
function ProcesssData() {
    $("#GridSelectedProductProcess").dxDataGrid({ dataSource: [] });
    $.ajax({
        type: 'post',
        url: 'WebServiceOthers.asmx/JobBookingProcess',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{BookingId:' + JSON.stringify(GblBookingID) + '}',
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridSelectedProductProcess").dxDataGrid({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}
$('#BtnChooseFromSO').click(function () {

    document.getElementById("BtnChooseFromSO").setAttribute("data-target", "#ModalSOList");
})
function loadSalesOrder(IsJCCreated) {
    $.ajax({
        type: 'post',
        url: 'WebServiceOthers.asmx/LoadSalesOrderss',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{IsJCCreated:' + IsJCCreated + '}',
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#SOGRID").dxDataGrid({
                keyExpr: 'OrderBookingDetailsID',
                dataSource: RES1.Contents,
                onContentReady: function (e) {
                    e.component.updateDimensions();
                },
                // minWidth:'300px'
                //masterDetail: {
                //    enabled: true,
                //    template(container, options) {
                //        const currentProjectData = options.data;

                //        $('<div>')
                //            .addClass('master-detail-caption')
                //            .text(`${currentProjectData.ClientName} 's Products:`)
                //            .appendTo(container);
                //        $('<div>')
                //            .dxDataGrid({
                //                columnAutoWidth: true,
                //                showBorders: true,
                //                columns: [
                //                    { dataField: "ProductName" },
                //                    { dataField: "OrderQuantity" },
                //                    { dataField: "Rate" },
                //                    { dataField: "RateType" },
                //                    { dataField: "NetAmount" },
                //                    { dataField: "GSTAmount" },
                //                    { dataField: "FinalCost" },
                //                    { dataField: "JobType" },
                //                    { dataField: "JobReference" },
                //                    { dataField: "JobPriority" },
                //                    { dataField: "ProductDescription" },
                //                    { dataField: "PackagingDetails" },
                //                    { dataField: "DescriptionOther" },
                //                    { dataField: "ExpectedDeliveryDate" },
                //                    { dataField: "VendorName", caption: "Planed Vendor Name" },

                //                ],
                //                dataSource: new DevExpress.data.DataSource({
                //                    store: new DevExpress.data.ArrayStore({
                //                        //key: 'ID',
                //                        data: RES1.Contents,
                //                    }),
                //                    filter: ['OrderBookingId', '=', options.key],
                //                }),
                //            }).appendTo(container);
                //    },
                //},
            });
            ContentsDataArray = RES1.Contents
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}

function GetProductConfig(ProductEstimationContentID) {
    $.ajax({
        async: false,
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetInputSizess',
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        data: '{ID:' + JSON.stringify(ProductEstimationContentID) + '}',
        crossDomain: true,
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/":}/g, '":null}');
            //res = res.replace(/}/g, '');
            //res = res.replace(/{/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(23, -4);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res.includes("error code:404")) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                DevExpress.ui.notify("Data not found", "error", 1000);
                return;
            }
            $("#GridProductContentDetailsFlex").dxDataGrid({ dataSource: JSON.parse(res) });

        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}
$("#BtnPrintModal").click(function () {
    try {
        var data = $('#PrintModalGRID').dxDataGrid('instance').getSelectedRowsData();
        if (data.length <= 0) {
            alert('Please Select JobCard from grid');
            return;
        }
        var url = "ReportJobCard.aspx?JobCardId=" + data[0].JobBookingID + "&jobContentID=" + data[0].ProductEstimationContentID + "&ContID=" + GBLJCNO + "&OrderBookingScheduleID=" + data[0].OrderBookingScheduleID;
        window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);

    } catch (e) {
        console.log(e);
    }
});
$("#BtnPrintJobcard").click(function () {
    var data = $('#GridJocardData').dxDataGrid('instance').getSelectedRowsData();
    if (data.length <= 0) {
        alert('Please Select JobCard from grid');
        return;
    }
    try {
        GBLJCNO = data[0].JobBookingNo;
        var result = $.grep(GBLScheduleContents, function (e) { return e.JobBookingID == data[0].JobBookingID; });
        $("#PrintModalGRID").dxDataGrid({
            dataSource: result,
        });
        document.getElementById("BtnPrintJobcard").setAttribute("data-target", "#PrintModal");
        return;

    } catch (e) {
        console.log(e);
    }
});

const now = new Date();
$('#PODate').dxDateBox({
    type: 'datetime',
    //disabled: true,
    value: now,
    displayFormat: "dd-MM-yyyy hh:mm"
});


$('#VendorName').dxSelectBox({
    items: [],
    displayExpr: "VendorName",
    valueExpr: "LedgerID",
    placeholder: 'Select Vendor Name',
    showClearButton: true,
    onValueChanged: function (e) {
        if (e.value != -1 && e.value != null) {
            var data = $('#GridJocardData').dxDataGrid('instance').getSelectedRowsData();
            if (data.length <= 0) {
                DevExpress.ui.notify("Please select data in grid", "error", 1000);
                return;
            }
            var JobBookingID = data[0].JobBookingID;
            var ScheduleVendorId = e.value;

            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/GetJobDataPO',
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
                    GBLPOMain = RES1;
                    document.getElementById('POOrderBookingDate').value = RES1[0].OrderBookingDate.trim();
                    //document.getElementById('PONumber').value = RES1[0].PONumber.trim();
                    document.getElementById('POJobBookingNo').value = RES1[0].JobBookingNo.trim();
                    document.getElementById('POOrderBookingNo').value = RES1[0].SalesOrderNo.trim();
                    document.getElementById('QuotaionNo').value = RES1[0].QuotaionNo.trim();
                    document.getElementById('EnquiryNo').value = RES1[0].EnquiryNo.trim();


                    document.getElementById('TDVendorName').innerHTML = e.component.option("text").trim();
                    document.getElementById('TDPOJobBookingNo').innerHTML = RES1[0].JobBookingNo.trim();
                    document.getElementById('TDPOOrderBookingNo').innerHTML = RES1[0].SalesOrderNo.trim();
                    document.getElementById('TDPOOrderBookingDate').innerHTML = RES1[0].OrderBookingDate.trim();
                    document.getElementById('TDQuoteNo').innerHTML = RES1[0].QuotaionNo.trim();
                    document.getElementById('TDEnqNo').innerHTML = RES1[0].EnquiryNo.trim();

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });

            $.ajax({
                type: 'post',
                url: 'WebServiceProductionWorkOrder.asmx/GetJobbookingDataPO',
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

                    $('#POProductsGrid').dxDataGrid({
                        dataSource: RES1
                    });

                },
                error: function errorFunc(jqXHR) {
                    // alert("not show");
                }
            });

        } else {
            document.getElementById('POJobBookingNo').value = 0;
            document.getElementById('POOrderBookingNo').value = 0;
            document.getElementById('POOrderBookingDate').value = 0;
            //document.getElementById('PONumber').value = 0;
            document.getElementById('PODate').value = 0;
            document.getElementById('QuotaionNo').value = 0;
            document.getElementById('EnquiryNo').value = 0;
        }
        $("#POProductsGrid").dxDataGrid({
            dataSource: []
        });

    }

});

function CalculateAmount() {

    var RES1 = $("#POProductsGrid").dxDataGrid("instance");

    document.getElementById('NetAmount').innerHTML = RES1.getTotalSummaryValue("NetAmount", "sum");
    document.getElementById('IGSTAmount').innerHTML = RES1.getTotalSummaryValue("IGSTTaxAmount", "sum");
    document.getElementById('SGSTAmount').innerHTML = RES1.getTotalSummaryValue("SGSTTaxAmount", "sum");
    document.getElementById('CGSTAmount').innerHTML = RES1.getTotalSummaryValue("CGSTTaxAmount", "sum");
    document.getElementById('ToTalGSTAmount').innerHTML = RES1.getTotalSummaryValue("ToTalGSTAmount", "sum");
    document.getElementById('TotalAmount').innerHTML = RES1.getTotalSummaryValue("TotalAmount", "sum");
};


GetPONo();
function GetPONo() {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetPONo',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');

            document.getElementById('PONumber').value = res;
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}



GetLoginCompanyState();
function GetLoginCompanyState() {
    $.ajax({

        type: "POST",
        url: "WebServiceProductMaster.asmx/GetLoginCompanyState",
        data: '{}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            GBLLoginCompanyState = RES1[0].State;

        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}

$('#BtnPO').click(function () {
    var data = $('#GridJocardData').dxDataGrid('instance').getSelectedRowsData();
    if (data.length <= 0) {
        DevExpress.ui.notify("Please select data in grid", "error", 1000);
        return;
    }
    var JobBookingID = data[0].JobBookingID;
    GBLLedgerId = data[0].LedgerID
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/VendorName',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{'JobbookingID': '" + JobBookingID + "'}",
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
            $("#VendorName").dxSelectBox({
                items: RES1,
            });
            VendorArray = RES1;
            clean();
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
    GetDelAddress()
    document.getElementById("BtnPO").setAttribute("data-target", "#GeneratePO");
});

$("#POProductsGrid").dxDataGrid({
    dataSource: [],

    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "OrderQuantity", allowEditing: false },
        { dataField: "Rate", caption: "Planned Rate", allowEditing: false, visible: false },

        { dataField: "RateType", allowEditing: false },
        { dataField: "ScheduleVendorName", allowEditing: false },
        { dataField: "ScheduleQty", resizable: true, visible: true, allowEditing: true },
        { dataField: "ScheduleRate" },
        { dataField: "NetAmount", allowEditing: false },
        { dataField: "CGSTTaxAmount", allowEditing: false },
        { dataField: "SGSTTaxAmount", allowEditing: false },
        { dataField: "IGSTTaxAmount", allowEditing: false },
        { dataField: "TotalAmount", allowEditing: false },
        { dataField: "JobType", allowEditing: false },
        { dataField: "JobReference", allowEditing: false },
        { dataField: "JobPriority", allowEditing: false },
        { dataField: "CriticalRemark", caption: 'Critical Remark', allowEditing: false },
        { dataField: "ExpectedDeliveryDate", allowEditing: false },
        { dataField: "PlanedVendorName", caption: "Planed Vendor Name", allowEditing: false },

    ],

    editing: {
        allowUpdating: true,
        mode: 'cell',

    },

    onRowUpdated: function (e) {
        if (e.data != null) {
            if (e.data.ScheduleQty > e.data.OrderQuantity) {
                alert("Schedule qty can't be greater then order qty");
                e.data.ScheduleQty = e.data.OrderQuantity
                return;
            }

            e.data.NetAmount = Number(e.data.ScheduleRate) * Number(e.data.ScheduleQty)
            var IsSameState = false;
            // To get State Of Client 
            var result = $.grep(VendorArray, function (ex) { return ex.LedgerID === e.data.ScheduleVendorId; });
            if (result.length === 1) {
                if (GBLLoginCompanyState == result[0].state)
                    IsSameState = true;
                else
                    IsSameState = false;
            }
            if (IsSameState) {
                e.data.CGSTTaxAmount = ((e.data.NetAmount * e.data.GSTPercantage / 2) / 100).toFixed(2);
                e.data.CGSTTaxPercentage = e.data.GSTPercantage;

                e.data.SGSTTaxAmount = ((e.data.NetAmount * e.data.GSTPercantage / 2) / 100).toFixed(2);
                e.data.SGSTTaxPercentage = e.data.GSTPercantage;

                e.data.IGSTTaxAmount = 0;
                e.data.IGSTTaxPercentage = 0;

            } else {
                e.data.IGSTTaxAmount = ((e.data.NetAmount * e.data.GSTPercantage) / 100).toFixed(2);
                e.data.IGSTTaxPercentage = e.data.GSTPercantage;
                e.data.CGSTTaxAmount = 0;
                e.data.SGSTTaxAmount = 0;
                e.data.CGSTTaxPercentage = 0;
                e.data.SGSTTaxPercentage = 0;

            }

            e.data.TotalAmount = (Number(e.data.IGSTTaxAmount) + Number(e.data.SGSTTaxAmount) + Number(e.data.CGSTTaxAmount) + Number(e.data.NetAmount)).toFixed(2);
            e.data.ToTalGSTAmount = (Number(e.data.IGSTTaxAmount) + Number(e.data.SGSTTaxAmount) + Number(e.data.CGSTTaxAmount)).toFixed(2);

        }

        e.component.refresh();
    },
    summary: {
        totalItems: [{
            column: "NetAmount",
            summaryType: "sum",
            showInColumn: "NetAmount",

        }, {
            column: "IGSTTaxAmount",
            summaryType: "sum",
            showInColumn: "IGSTAmount",

        }, {
            column: "SGSTTaxAmount",
            summaryType: "sum",
            showInColumn: "SGSTAmount",

        }, {
            column: "CGSTTaxAmount",
            summaryType: "sum",
            showInColumn: "CGSTAmount",

        }, {
            column: "ToTalGSTAmount",
            summaryType: "sum",
            showInColumn: "ToTalGSTAmount",

        }, {
            column: "TotalAmount",
            summaryType: "sum",
            showInColumn: "TotalAmount",

        },

        ]
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
    onContentReady: function (e) {
        CalculateAmount();
    }

});


function clean() {
    $('#VendorName').dxSelectBox({
        value: -1
    });

    document.getElementById('POJobBookingNo').value = '';
    document.getElementById('POOrderBookingNo').value = '';
    document.getElementById('POOrderBookingDate').value = '';

    document.getElementById('PODate').value = '';
    document.getElementById('Remark').value = '';
    document.getElementById('EnquiryNo').value = '';
    document.getElementById('QuotaionNo').value = '';

    document.getElementById('TDVendorName').innerHTML = '';
    document.getElementById('TDPOJobBookingNo').innerHTML = '';
    document.getElementById('TDPOOrderBookingNo').innerHTML = '';
    document.getElementById('TDPOOrderBookingDate').innerHTML = '';
    document.getElementById('TDQuoteNo').innerHTML = '';
    document.getElementById('TDEnqNo').innerHTML = '';

    document.getElementById('NetAmount').innerHTML = 0;
    document.getElementById('IGSTAmount').innerHTML = 0;
    document.getElementById('SGSTAmount').innerHTML = 0;
    document.getElementById('CGSTAmount').innerHTML = 0;
    document.getElementById('ToTalGSTAmount').innerHTML = 0;
    document.getElementById('TotalAmount').innerHTML = 0;

    $("#POProductsGrid").dxDataGrid({
        dataSource: []
    });

};


$("#BtnDelete").click(function () {
    try {
        var SelectedProductData = $('#GridJocardData').dxDataGrid('instance').getSelectedRowsData();

        if (SelectedProductData.length <= 0) {
            alert("Please select Jobcard ");
            return;
        }
        var JCID = SelectedProductData[0].JobBookingID;

        swal({
            title: "Are you sure to delete selected record..?",
            text: 'You will not be able to recover!',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        },
            function (e) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "WebServiceProductionWorkOrder.asmx/DeleteJC",
                    data: '{JCID:' + JCID + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        var Title, Text, Type;
                        if (results.d.includes("Success")) {
                            Title = "Success...";
                            Text = "Your data has been deleted successfully...";
                            Type = "success";
                        } else {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        swal({
                            title: Title,
                            text: Text,
                            type: Type,
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Ok",
                            closeOnConfirm: true
                        });
                        if (Type === "success") {
                            window.location.reload();
                        } else {
                            alert(Text);
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        console.log(jqXHR);
                    }
                });
            });

    } catch (e) {
        console.log(e);
    }
});


$('#SavePO').click(function () {


    var arr = [];
    var obj = {};
    var RES1 = $("#POProductsGrid").dxDataGrid("instance");
    var Remark = document.getElementById('Remark').value;
    var Freight = document.getElementById('Freight').value;
    var DelivaryAddress = document.getElementById('Address').value;
    var JobBookingNo = document.getElementById('POJobBookingNo').value;
    var SalesOrderNo = document.getElementById('POOrderBookingNo').value;
    var QuotaionNo = document.getElementById('QuotaionNo').value;
    var EnquiryNo = document.getElementById('EnquiryNo').value;
    var NetAmount = RES1.getTotalSummaryValue("NetAmount", "sum");
    var IGSTAmount = RES1.getTotalSummaryValue("IGSTTaxAmount", "sum");
    var SGSTAmount = RES1.getTotalSummaryValue("SGSTTaxAmount", "sum");
    var CGSTAmount = RES1.getTotalSummaryValue("CGSTTaxAmount", "sum");
    var ToTalGSTAmount = Number(IGSTAmount) + Number(SGSTAmount) + Number(CGSTAmount)
    var TotalAmount = RES1.getTotalSummaryValue("TotalAmount", "sum");
    var PODataGrid = $("#POProductsGrid").dxDataGrid("getDataSource")._items;
    if (PODataGrid.length <= 0) {
        return;
    }

    if (DelivaryAddress == "") {
        alert("Please mention delivary address");
        document.getElementById('Address').focus();
        return;
    }

    obj.JobBookingNo = JobBookingNo;
    obj.SalesOrderNo = SalesOrderNo;
    obj.Remark = Remark;
    obj.NetAmount = NetAmount;
    obj.IGSTAmount = IGSTAmount;
    obj.SGSTAmount = SGSTAmount;
    obj.CGSTAmount = CGSTAmount;
    obj.ToTalGSTAmount = ToTalGSTAmount;
    obj.TotalAmount = TotalAmount;
    obj.EnquiryNo = EnquiryNo;
    obj.QuotationNo = QuotaionNo;
    obj.DelivaryAddress = DelivaryAddress;
    obj.Freight = Freight;

    obj.ProductEstimateID = GBLPOMain[0].ProductEstimateID;
    obj.JobBookingID = GBLPOMain[0].JobBookingID;

    obj.ProductCatelogID = GBLPOMain[0].ProductCatelogID;
    obj.LedgerID = GBLPOMain[0].LedgerID;
    obj.OrderBookingID = GBLPOMain[0].OrderBookingID;
    obj.EnquiryID = GBLPOMain[0].EnquiryID;


    arr.push(obj);

    //console.log(arr);

    var POArr = [], POObj = {};
    //itemDataGrid

    for (let i = 0; i < PODataGrid.length; i++) {
        POObj = {};
        POObj.PlannedVendorID = PODataGrid[0].VendorID;
        POObj.OrderBookingDetailsID = PODataGrid[0].OrderBookingDetailsID;
        POObj.ProductName = PODataGrid[i].ProductName;
        POObj.ProductEstimationContentID = PODataGrid[i].ProductEstimationContentID;
        POObj.OrderQuantity = PODataGrid[i].OrderQuantity;
        POObj.PlannedRate = PODataGrid[i].Rate.toString();
        POObj.ScheduleRate = PODataGrid[i].ScheduleRate.toString();
        POObj.RateType = PODataGrid[i].RateType;
        POObj.ScheduleVendorId = PODataGrid[i].ScheduleVendorId;
        POObj.ScheduleQty = PODataGrid[i].ScheduleQty;
        POObj.NetAmount = PODataGrid[i].NetAmount.toString();
        POObj.CGSTAmount = PODataGrid[i].CGSTTaxAmount.toString();
        POObj.SGSTAmount = PODataGrid[i].SGSTTaxAmount.toString();
        POObj.IGSTAmount = PODataGrid[i].IGSTTaxAmount.toString();
        POObj.TotalAmount = PODataGrid[i].TotalAmount.toString();
        POObj.TotalGSTAmount = PODataGrid[i].ToTalGSTAmount.toString()//Number(PODataGrid[i].IGSTTaxAmount) + Number(PODataGrid[i].SGSTTaxAmount) + Number(PODataGrid[i].CGSTTaxAmount);
        //POObj.JobType = PODataGrid[i].JobType;
        //POObj.JobReference = PODataGrid[i].JobReference;
        //POObj.JobPriority = PODataGrid[i].JobPriority;
        //POObj.CriticalRemark = PODataGrid[i].CriticalRemark;
        //POObj.ExpectedDeliveryDate = PODataGrid[i].ExpectedDeliveryDate;
        //POObj.PlanedVendorName = PODataGrid[i].PlanedVendorName;
        POArr.push(POObj);
    }


    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: 'post',
        url: ' WebServiceProductionWorkOrder.asmx/SavePO',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{Data:' + JSON.stringify(arr) + ',POData:' + JSON.stringify(POArr) + ',IsEdit:' + IsEdit + ',GBLPOID:' + Number(GBLPOID) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res == "Success") {
                swal("Saved", " Saved  successfully", 'success');
                clean();
                location.replace('/JobcardSchedule.aspx');
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





// TO Revise The PO ######################################## Start  #####################################################


var IsDirectApproved = 0;
var queryString = new Array();

$(function () {

    if (queryString.length === 0) {
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]).replace(/"/g, '');
                queryString[key] = value;
            }
        }
    }

    if (queryString["POID"] !== null && queryString["POID"] !== undefined) {
        GBLPOID = Number(queryString["POID"]);
        IsDirectApproved = Number(queryString["IsDirectApproved"]);

        if (GBLPOID <= 0) return;
        else {
            GetPOData(GBLPOID)
            IsEdit = true
        }

    }

    function GetPOData(POID) {
        try {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: 'POST',
                url: "WebServiceProductionWorkOrder.asmx/GetPOData",
                data: '{POID:' + JSON.stringify(POID) + '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/{"d":null/g, '');
                    res = res.replace(/{"d":""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.slice(0, -3);
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    var RES1 = JSON.parse(res.toString());

                    if (RES1.POMain.length >= 1) {
                        GBLPOMain = RES1.POMain;
                        document.getElementById('PONumber').value = RES1.POMain[0].PONumber;
                        document.getElementById('Freight').value = RES1.POMain[0].Freight;
                        document.getElementById('POJobBookingNo').value = RES1.POMain[0].JobbookingNo;
                        document.getElementById('POOrderBookingNo').value = RES1.POMain[0].SalesOrderNo;
                        document.getElementById('QuotaionNo').value = RES1.POMain[0].EstimateNo;
                        document.getElementById('EnquiryNo').value = RES1.POMain[0].EnquiryNo;
                        document.getElementById('POOrderBookingDate').value = RES1.POMain[0].BookingDate;
                        document.getElementById('Remark').value = RES1.POMain[0].Remark;
                        document.getElementById('Address').value = RES1.POMain[0].DelivaryAddress;
                      

                        document.getElementById('TDVendorName').innerHTML = RES1.POMain[0].ScheduleVendorName;
                        document.getElementById('TDPOJobBookingNo').innerHTML = RES1.POMain[0].JobbookingNo;
                        document.getElementById('TDPOOrderBookingNo').innerHTML = RES1.POMain[0].SalesOrderNo;
                        document.getElementById('TDPOOrderBookingDate').innerHTML = RES1.POMain[0].BookingDate;
                        document.getElementById('TDQuoteNo').innerHTML = RES1.POMain[0].EstimateNo;
                        document.getElementById('TDEnqNo').innerHTML = RES1.POMain[0].EnquiryNo;

                        $("#GeneratePO").modal("show");

                        var JobBookingID = RES1.POMain[0].JobBookingID;
                        var VendorID = RES1.POMain[0].ScheduleVendorId;
                        GBLLedgerId = RES1.POMain[0].LedgerID;
                        GetDelAddress()
                        $.ajax({
                            type: 'post',
                            url: 'WebServiceProductionWorkOrder.asmx/VendorName',
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            data: "{'JobbookingID': '" + JobBookingID + "'}",
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
                                $("#VendorName").dxSelectBox({
                                    items: RES1,
                                    value: VendorID
                                });
                                VendorArray = RES1;

                            },
                            error: function errorFunc(jqXHR) {
                                // alert("not show");
                            }
                        });

                    }

                    $("#POProductsGrid").dxDataGrid({
                        dataSource: RES1.PODetail
                    });

                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                }
            });

        } catch (e) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            console.error(e);
        }
    }

});

function OpenPopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-toggle", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}
// TO Revise The PO ------------------######################################## END  #####################################################



function NewJC() {
    try {


        // Reset input values
        document.getElementById("TxtSalesOrderNo").value = "";
        document.getElementById("TxtBookingNoAuto").value = "";
        document.getElementById("TxtQuantity").value = 0;
        document.getElementById("TxtOrderBookingNo").value = "";
        document.getElementById("TxtOrderBookingDate").value = "";
        document.getElementById("TxtPONo").value = "";
        document.getElementById("TxtPODate").value = "";
        document.getElementById("TxtTotalQTY").value = 0;
        document.getElementById("TxtRemainingQTY").value = 0;
        document.getElementById("TxtScheduleQTY").value = 0;
        document.getElementById("TxtRate").value = 0;
        document.getElementById("TxtCriticalRemark").value = "";

        $("#SBVendor").dxSelectBox({
            value: -1
        });
        $("#JobCoordinator").dxSelectBox({
            value: -1
        });

        $("#GridProductContentDetails").dxDataGrid({
            dataSource: []
        });
        $("#GridProductContentDetailsFlex").dxDataGrid({
            dataSource: []
        });
        $("#GridSelectedProductProcess").dxDataGrid({
            dataSource: []
        });
        $("#ScheduleGrid").dxDataGrid({
            dataSource: []
        });
        $("#ProductsGrid").dxDataGrid({
            dataSource: []
        });


    } catch (e) {
        console.log(e);
    }
}


function GetDelAddress() {
    $.ajax({
        type: "POST",
        url: 'WebServiceProductionWorkOrder.asmx/GetDelAddress',
        data: '{LedgerId:' + JSON.stringify(GBLLedgerId) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES = JSON.parse(res);
            $("#DeliveryAT").dxSelectBox({
                items: RES,
                displayExpr: "LedgerName",
                valueExpr: "LedgerId",
                placeholder: 'Select--',
                showClearButton: false,
                onSelectionChanged: function (e) {
                    document.getElementById("Address").value = e.selectedItem.Address;
                }
            });

        }
    });
}


loadSalesOrder(false)