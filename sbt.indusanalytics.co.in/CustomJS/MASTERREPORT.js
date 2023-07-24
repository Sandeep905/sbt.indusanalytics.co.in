"use strict";
var GBLID = 0;
var IsEdit = false;
var str = ""
const now1 = new Date();
$('#From').dxDateBox({
    type: 'date',
    //disabled: true,
    value: now1,
    displayFormat: "dd-MM-yyyy"
});
const now2 = new Date();
$('#ToDate').dxDateBox({
    type: 'date',
    //disabled: true,
    value: now2,
    displayFormat: "dd-MM-yyyy"
});
$('#EnquiryNo').dxSelectBox({
    items: [],
    displayExpr: "EnquiryNo",
    valueExpr: "EnquiryID",
    placeholder: 'Select Enquiry No',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            GetQuotation(" AND PQ.EnquiryID =" + e.value)
            GetSalesOrder(" AND PQ.EnquiryID =" + e.value)
            GetLedgerName(" AND PQ.EnquiryID =" + e.value)
            GetedVendor(" AND PQ.EnquiryID =" + e.value)
            //GetGRIDDATA("AND PQ.ENQUIRYID =" + e.value)
            str = " AND PQ.EnquiryID =" + e.value
        }
    }
});
$('#QuotationNo').dxSelectBox({
    items: [],
    displayExpr: "QuotaionNo",
    valueExpr: "ProductEstimateID",
    placeholder: 'Select Quotaion No',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            ALLDATA(" and PQ.ProductEstimateID =" + e.value)
            GetSalesOrder("and PQ.ProductEstimateID =" + e.value)
            GetLedgerName("and PQ.ProductEstimateID =" + e.value)
            GetedVendor("and PQ.ProductEstimateID =" + e.value)
            //GetGRIDDATA("and PQ.ProductEstimateID =" + e.value)
            str = str + " AND PQ.ProductEstimateID =" + e.value
        }
    }
});
$('#SalesOrderNo').dxSelectBox({
    items: [],
    displayExpr: "SalesOrderNo",
    valueExpr: "",
    placeholder: 'Select Sales Order No',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            ALLDATA(" and JOB.orderbookingID =" + e.value)
            GetQuotation(" AND JOB.orderbookingID =" + e.value)
            GetLedgerName(" and JOB.orderbookingID =" + e.value)
            GetedVendor(" and JOB.orderbookingID =" + e.value)
            //GetGRIDDATA(" and JOB.orderbookingID =" + e.value);
            str = str + " AND JOB.orderbookingID =" + e.value
        }
    }
});
$('#ClientName').dxSelectBox({
    items: [],
    displayExpr: "ClientName",
    valueExpr: "LedgerID",
    placeholder: 'Select Client Name',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            ALLDATA(" and LM.LedgerID =" + e.value)
            GetQuotation(" AND LM.LedgerID =" + e.value)
            GetSalesOrder("AND LM.LedgerID =" + e.value)
            GetedVendor("AND LM.LedgerID =" + e.value)
            //GetGRIDDATA("AND LM.LedgerID =" + e.value)
            str = str + " AND LM.LedgerID =" + e.value
        }
    }
});
$('#VendorName').dxSelectBox({
    items: [],
    displayExpr: "VendorName",
    valueExpr: "LedgerID",
    placeholder: 'Select Vendor Name',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            ALLDATA(" And LMA.LedgerID =" + e.value)
            GetQuotation(" AND LMA.LedgerID =" + e.value)
            GetSalesOrder("AND LMA.LedgerID =" + e.value)
            //GetGRIDDATA("AND LM.LedgerID =" + e.value)
            str = str + " AND LMA.LedgerID =" + e.value
        }
    }
});
$('#Status').dxSelectBox({
    items: ["All", "Close", "Open"],
    placeholder: 'Select Status',
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value > 0) {
            //GetGRIDDATA();

        }
    }
});
ALLDATA("");
function ALLDATA(con) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/ALLDATA',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ condt:' + JSON.stringify(con) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $('#EnquiryNo').dxSelectBox({
                items: RES1,
                displayExpr: "EnquiryNo",
                valueExpr: "EnquiryID",
            });
        },
        error: function errorFunc(jqXHR) {
        }
    });
}
GetQuotation("");
function GetQuotation(QNO) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetQuotation',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ QUONO:' + JSON.stringify(QNO) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $('#QuotationNo').dxSelectBox({
                items: RES1,
                displayExpr: "QuotationNo",
                valueExpr: "ProductEstimateID",
            });
        },
        error: function errorFunc(jqXHR) {
        }
    });
}
GetSalesOrder("");
function GetSalesOrder(SON) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetSalesOrder',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ GSONO:' + JSON.stringify(SON) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $('#SalesOrderNo').dxSelectBox({
                items: RES1,
                displayExpr: "SalesOrderNo",
                valueExpr: "OrderBookingID",
            });
        },
        error: function errorFunc(jqXHR) {
        }
    });

}

GetLedgerName("");
function GetLedgerName(CN) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetLedgerName',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ LNAME:' + JSON.stringify(CN) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $('#ClientName').dxSelectBox({
                items: RES1,
                displayExpr: "ClientName",
                valueExpr: "LedgerID",
            });
        },
        error: function errorFunc(jqXHR) {
        }
    });

}


GetedVendor("");
function GetedVendor(VN) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetedVendor',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ VNAME:' + JSON.stringify(VN) + '}',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $('#VendorName').dxSelectBox({
                items: RES1,
                displayExpr: "VendorName",
                valueExpr: "LedgerID",
            });
        },
        error: function errorFunc(jqXHR) {
        }
    });

}
$('#BtnReload').click(function () {
    var From = $('#From').dxDateBox('instance').option('value');
    var ToDate = $('#ToDate').dxDateBox('instance').option('value');
    var isApplied = $('#myCheckbox').is(':checked'); // Get the checkbox value

    From = From.toISOString();


    ToDate = ToDate.toISOString();


    GetGRIDDATA(str, From, ToDate, isApplied);
});

$("#GridJocardData").dxDataGrid({
    dataSource: [],
    columns: [
        { dataField: "ProductName", allowEditing: false },
        { dataField: "Quantity", allowEditing: false },
        { dataField: "EnquiryNo", allowEditing: false },
        { dataField: "QuotationNo", allowEditing: false },
        { dataField: "SalesOrderNo", allowEditing: false },
        { dataField: "ClientName", allowEditing: false },
        { dataField: "VendorName", allowEditing: false },
        { dataField: "Status", allowEditing: false },
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

function GetGRIDDATA(ALLD, From, ToDate, isApplied) {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetGRIDDATA',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{ ALLDATA:' + JSON.stringify(ALLD) + ',From :' + JSON.stringify(From) + ',ToDate :' + JSON.stringify(ToDate) + ',isApplied :' + JSON.stringify(isApplied) + '}',
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
            $('#GridJocardData').dxDataGrid({
                dataSource: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });

}