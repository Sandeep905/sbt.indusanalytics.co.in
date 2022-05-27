"use strict";

var optionpurchaseapprovals = ["Unapproved Purchase Orders", "Approved Purchase Orders", "Cancelled Purchase Orders"];
var Groupdata = [];

//OtherHeads
var OtherHead = [];
var updateTotalTax = 0; var Gblstring = "Payment in 30 Days,Payment in 60 Days,Payment in 90 Days";
var SubGridData = [], ChargesGrid = [], PaymentTermsGrid = [], ScheduleListOBJ = [], existReq = [];

var TotalGstAmt = 0;

$("#opt-approval-radio").dxRadioGroup({
    items: optionpurchaseapprovals,
    value: optionpurchaseapprovals[0],
    layout: "horizontal"
});

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

var ModeOfTransportText = ["By Road", "By Rail", "By Air", "By Ocean", "Other"];
$("#ModeOfTransport").dxSelectBox({
    items: ModeOfTransportText,
    disabled: true
});

$("#DealerName").dxSelectBox({
    items: [],
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    disabled: true
});

var requisitionfilename = "";
var serviceUrl = "WebServicePurchaseOrderApproval.asmx/UnApprovedPurchaseOrders";
$(function () {
    $("#opt-approval-radio").dxRadioGroup({
        onValueChanged: function (e) {
            var previousValue = e.previousValue;
            Groupdata = [];
            var newValue = e.value;
            if (e.value === 'Unapproved Purchase Orders') {
                $("#POPrintButton").addClass("hidden");
                serviceUrl = "WebServicePurchaseOrderApproval.asmx/UnApprovedPurchaseOrders";
                requisitionfilename = "Unapproved Purchase Order's";
                RefreshPurchaseOrders();
                document.getElementById("Btn_Update").innerHTML = "Approve";
                document.getElementById("Btn_Cancel").innerHTML = "Cancel";
            } else if (e.value === 'Cancelled Purchase Orders') {
                serviceUrl = "WebServicePurchaseOrderApproval.asmx/CancelledPurchaseOrders";
                requisitionfilename = "Cancelled Purchase Order's";
                RefreshPurchaseOrders();
                document.getElementById("Btn_Update").innerHTML = "Approve";
                document.getElementById("Btn_Cancel").innerHTML = "UnCancel";
            } else {
                $("#POPrintButton").removeClass("hidden");
                serviceUrl = "WebServicePurchaseOrderApproval.asmx/ApprovedPurchaseOrders";
                requisitionfilename = "Approved Purchase Order's";
                RefreshPurchaseOrders();
                document.getElementById("Btn_Update").innerHTML = "UnApprove";
                document.getElementById("Btn_Cancel").innerHTML = "Cancel";
            }
        }
    });
});

RefreshPurchaseOrders();
function RefreshPurchaseOrders() {
    try {

        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: serviceUrl,
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, "&");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var tt = JSON.parse(res);
                //var i = 0;

                //var TransactionID = 0;
                //var sumqty = 0;
                //var sumgrossamt = 0;
                //var sumdiscountamt = 0;
                //var sumbasicamt = 0;
                //var sumgstamt = 0;
                //var sumnetamt = 0;
                //var purchasearray = [];
                //var OptObj = {};

                //if (tt.length > 0) {
                //    TransactionID = tt[0].TransactionID;
                //}
                //for (i = 0; i < tt.length; i++) {
                //    if (TransactionID === tt[i].TransactionID) {
                //        sumqty = sumqty + parseFloat(tt[i].PurchaseOrderQuantity);
                //        OptObj.PurchaseOrderQuantity = sumqty
                //        sumgrossamt = sumgrossamt + parseFloat(tt[i].GrossAmount);
                //        OptObj.GrossAmount = sumgrossamt
                //        sumdiscountamt = sumdiscountamt + parseFloat(tt[i].DiscountAmount);
                //        OptObj.DiscountAmount = sumdiscountamt
                //        sumbasicamt = sumbasicamt + parseFloat(tt[i].BasicAmount);
                //        OptObj.BasicAmount = sumbasicamt
                //        sumgstamt = sumgstamt + parseFloat(tt[i].GSTTaxAmount);
                //        OptObj.GSTTaxAmount = sumgstamt
                //        sumnetamt = sumnetamt + parseFloat(tt[i].NetAmount);
                //        OptObj.NetAmount = sumnetamt
                //    } else {
                //        purchasearray.push(OptObj);
                //        TransactionID = 0;
                //        sumqty = 0;
                //        sumgrossamt = 0;
                //        sumdiscountamt = 0;
                //        sumbasicamt = 0;
                //        sumgstamt = 0;
                //        sumnetamt = 0;
                //        TransactionID = tt[i].TransactionID
                //        OptObj = {};
                //        sumqty = sumqty + parseFloat(tt[i].PurchaseOrderQuantity);
                //        OptObj.PurchaseOrderQuantity = sumqty
                //        sumgrossamt = parseFloat(tt[i].GrossAmount);
                //        OptObj.GrossAmount = sumgrossamt
                //        sumdiscountamt = parseFloat(tt[i].DiscountAmount);
                //        OptObj.DiscountAmount = sumdiscountamt
                //        sumbasicamt = parseFloat(tt[i].BasicAmount);
                //        OptObj.BasicAmount = sumbasicamt
                //        sumgstamt = parseFloat(tt[i].GSTTaxAmount);
                //        OptObj.GSTTaxAmount = sumgstamt
                //        sumnetamt = parseFloat(tt[i].NetAmount);
                //        OptObj.NetAmount = sumnetamt
                //    }
                //    OptObj.TransactionID = tt[i].TransactionID
                //    OptObj.VoucherID = tt[i].VoucherID
                //    OptObj.LedgerID = tt[i].LedgerID
                //    OptObj.TotalItems = tt[i].TotalItems
                //    OptObj.LedgerName = tt[i].LedgerName
                //    OptObj.MaxVoucherNo = tt[i].MaxVoucherNo
                //    OptObj.VoucherNo = tt[i].VoucherNo
                //    OptObj.VoucherDate = tt[i].VoucherDate
                //    OptObj.CreatedBy = tt[i].CreatedBy
                //    OptObj.ApprovedBy = tt[i].ApprovedBy
                //    OptObj.ApprovalDate = tt[i].ApprovalDate
                //    OptObj.FYear = tt[i].FYear
                //}
                //if (tt.length > 0) {
                //    purchasearray.push(OptObj);
                //}
                //FillGrid(JSON.parse(res), purchasearray);

                FillGrid(tt);
                var gridInstance = $("#gridpurchaseorders").dxDataGrid('instance');
                var btntext = $("#opt-approval-radio").dxRadioGroup('instance');
                if (btntext.option('value') === "Unapproved Purchase Orders") {
                    gridInstance.columnOption("ApprovedBy", "visible", false);
                    gridInstance.columnOption("ApprovalDate", "visible", false);
                } else if (btntext.option('value') === "Cancelled Purchase Orders") {
                    gridInstance.columnOption("ApprovedBy", "visible", false);
                    gridInstance.columnOption("ApprovalDate", "visible", false);
                } else {
                    gridInstance.columnOption("ApprovedBy", "visible", true);
                    gridInstance.columnOption("ApprovalDate", "visible", true);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}

//function FillGrid(purchaseorderdetaildata, purchaseordersummary) {
function FillGrid(tt) {
    $("#gridpurchaseorders").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        height: function () {
            return window.innerHeight / 1.2;
        },
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "single" },
        paging: {
            pageSize: 20
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [20, 40, 50, 100]
        },
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: true },
        headerFilter: { visible: true },
        //rowAlternationEnabled: true,
        searchPanel: { visible: true },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: true,
            fileName: requisitionfilename,
            allowExportSelectedData: true
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onCellClick: function (e) {

            //var grid = $('#ProcessMasterGrid').dxDataGrid('instance');
            if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            var Row = e.row.rowIndex;
            var Col = e.columnIndex;

            //document.getElementById("ProtxtGetGridRow").value = "";
            //document.getElementById("ProtxtGetGridRow").value = Row;

            //document.getElementById("txtProcessID").value = "";
            //document.getElementById("txtProcessID").value = e.row.data.ProcessID;/// grid.cellValue(Row, 0);
        },
        //editing: {
        //    mode: "cell",
        //    allowUpdating: true
        //},
        //onEditingStart: function (e) {
        //    if (e.column.visibleIndex > 1) {
        //        e.cancel = true;
        //    }
        //},
        onSelectionChanged: function (clickedCell) {

            var Radiobtnval = $("#opt-approval-radio").dxRadioGroup('instance').option('value');
            if (Radiobtnval === "Approved Purchase Orders") {
                if (clickedCell.currentSelectedRowKeys[0] !== undefined) {
                    if (clickedCell.currentSelectedRowKeys[0].ReceiptTransactionID !== 0 && clickedCell.currentSelectedRowKeys[0].ReceiptTransactionID !== "0") {
                        DevExpress.ui.notify("Selected purchase orders has been used in further transactions, Can't change..!", "warning", 2500);
                        clickedCell.component.deselectRows((clickedCell || {}).currentSelectedRowKeys[0]);
                        clickedCell.currentSelectedRowKeys = [];
                    }
                    else {
                        Groupdata = clickedCell.selectedRowsData;
                    }
                }
            }
            else {
                Groupdata = clickedCell.selectedRowsData;
            }

            //Groupdata = clickedCell.selectedRowsData;           
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "Transaction ID", width: 120 },
            { dataField: "VoucherID", visible: false, caption: "Voucher ID", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 150, fixed: true },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.P.O. No.", width: 80, fixed: true },
            { dataField: "VoucherNo", visible: true, caption: "P.O. No.", width: 100, fixed: true },
            { dataField: "VoucherDate", visible: true, caption: "P.O. Date", width: 120, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar", fixed: true },
            { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 80 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
            { dataField: "PurchaseOrderQuantity", visible: true, caption: "P.O. Qty", width: 80 },
            { dataField: "PurchaseUnit", visible: true, caption: "Unit", width: 80 },
            { dataField: "PurchaseRate", visible: true, caption: "Rate", width: 60 },
            { dataField: "GrossAmount", visible: true, caption: "Gross Amt", width: 80 },
            { dataField: "DiscountAmount", visible: true, caption: "Disc.Amt", width: 80 },
            { dataField: "BasicAmount", visible: true, caption: "Basic Amt", width: 80 },
            { dataField: "GSTTaxAmount", visible: true, caption: "GST Amt", width: 80 },
            { dataField: "NetAmount", visible: true, caption: "Net Amt", width: 80 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 100 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 80 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 80 },
            { dataField: "ApprovalDate", visible: true, caption: "Approval Date", dataType: "date", format: "dd-MMM-yyyy", width: 100 },
            { dataField: "ReceiptTransactionID", visible: false, caption: "ReceiptTransactionID", width: 100 }

            //{ dataField: "TotalItem", visible: true, caption: "TotalItem", width: 120 },
            //{ dataField: "IsDisplay", visible: true, caption: "IsDisplay", width: 120 },

            // { dataField: "ChargeApplyOnSheets", visible: true, caption: "ChargeApplyOnSheets", width: 120 },
        ]
        ////masterDetail: {
        ////    enabled: true,
        ////    template: function (container, options) {
        ////        var currentpurchaseorderData = options.data;

        ////        $("<div>")
        ////            //.addClass("master-detail-grid-caption")
        ////            //.text(currentpurchaseorderData.VoucherNo + "  -  " + currentpurchaseorderData.VoucherDate + "")
        ////            //.appendTo(container);
        ////        $("<div>")
        ////            .dxDataGrid({
        ////                dataSource: purchaseorderdetaildata,
        ////                columnAutoWidth: true,
        ////                showBorders: true,
        ////                showRowLines: true,
        ////                allowColumnReordering: true,
        ////                allowColumnResizing: true,
        ////                columnResizingMode: "widget",
        ////                sorting: {
        ////                    mode: "none"
        ////                },
        ////                keyExpr: "TransactionID",

        ////                selection: { mode: "single" },
        ////                loadPanel: {
        ////                    enabled: true,
        ////                    height: 90,
        ////                    width: 200,
        ////                    text: 'Data is loading...'
        ////                },
        ////                onRowPrepared: function (e) {
        ////                    e.rowElement.css('fontSize', '11px');
        ////                },
        ////                columns: [
        ////                    { dataField: "TransactionID", visible: false, caption: "Transaction ID", width: 120 },
        ////                    { dataField: "VoucherID", visible: false, caption: "Voucher ID", width: 120 },
        ////                    { dataField: "VoucherNo", visible: true, caption: "P.O. No.", width: 100 },
        ////                    { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 100 },
        ////                    { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        ////                    { dataField: "PurchaseOrderQuantity", visible: true, caption: "P.O. Qty", width: 80 },
        ////                    { dataField: "PurchaseUnit", visible: true, caption: "Unit", width: 60 },
        ////                    { dataField: "PurchaseRate", visible: true, caption: "Rate", width: 80 },
        ////                    { dataField: "GrossAmount", visible: true, caption: "Gross Amount", width: 100 },
        ////                    { dataField: "DiscountAmount", visible: true, caption: "Disc. Amount", width: 100 },
        ////                    { dataField: "BasicAmount", visible: true, caption: "Basic Amount", width: 100 },
        ////                    { dataField: "GSTTaxAmount", visible: true, caption: "GST TaxAmount", width: 100 },
        ////                    { dataField: "NetAmount", visible: true, caption: "Net Amount", width: 100 },
        ////                    { dataField: "CreatedBy", visible: true, caption: "Created By", width: 100 },
        ////                    { dataField: "ApprovalBy", visible: false, caption: "Approval By", width: 100 },
        ////                    { dataField: "ReceiptTransactionID", visible: false, caption: "ReceiptTransactionID", width: 100 },
        ////                ],
        ////                dataSource: new DevExpress.data.DataSource({
        ////                    store: new DevExpress.data.ArrayStore({
        ////                        key: "TransactionID",
        ////                        data: purchaseorderdetaildata
        ////                    }),
        ////                    filter: ["TransactionID", "=", options.key]
        ////                })
        ////            }).appendTo(container);
        ////    }
        ////}
    });
}


$("#Btn_Update").click(function () {
    var btnstatus = document.getElementById("Btn_Update").innerText.trim();
    UpdateData(btnstatus);
});

$("#Btn_Cancel").click(function () {
    var btnstatus = document.getElementById("Btn_Cancel").innerText.trim();
    UpdateData(btnstatus);
});

function UpdateData(btnstatus) {

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    if (Groupdata.length > 0) {
        for (var e = 0; e < Groupdata.length; e++) {
            OperationRecordDetail = {};
            OperationRecordDetail.TransactionID = Groupdata[e].TransactionID;
            OperationRecordDetail.FYear = Groupdata[e].FYear;

            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }


        var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
        swal({
            title: "Do you want to continue",
            text: txt,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Save it !",
            closeOnConfirm: false
        },
            function () {

                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebServicePurchaseOrderApproval.asmx/UpdateData",
                    data: '{BtnText:' + JSON.stringify(btnstatus) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        document.getElementById("LOADER").style.display = "none";
                        if (res === "Success") {
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });

            });

    } else {
        DevExpress.ui.notify("Please choose data from given above Grid..!", "error", 1000);
        return false;
    }
}

//////////////////////////////////////Details Part/////////////////////////

$("#ContactPersonName").dxSelectBox({
    displayExpr: 'Name',
    valueExpr: 'Name'
});

$("#DetailPOButton").click(function () {
    if (Groupdata.length <= 0) {
        DevExpress.ui.notify("Please select any requisition voucher to view..!", "warning", 1500);
        return false;
    }
    var TxtPOID = Groupdata[0].TransactionID;

    SubGridData = [], ChargesGrid = [], PaymentTermsGrid = [], ScheduleListOBJ = [], existReq = [];

    TotalGstAmt = 0;

    document.getElementById("LblPONo").value = Groupdata[0].VoucherNo;
    //document.getElementById("textNarration").innerHTML = Groupdata[0].Narration;

    $("#VoucherDate").dxDateBox({ value: Groupdata[0].VoucherDate, disabled: true });
    $("#SupplierName").dxSelectBox({ value: Groupdata[0].LedgerName, acceptCustomValue: true, disabled: true });

    $("#ContactPersonName").dxSelectBox({ items: [], value: null });

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/GetContactPerson",
        data: '{ContactPerson:' + JSON.stringify(Groupdata[0].LedgerID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            var ContactPerson = JSON.parse(res);
            if (ContactPerson.length <= 0 || ContactPerson === "" || ContactPerson === undefined) return;
            $("#ContactPersonName").dxSelectBox({
                items: ContactPerson,
                value: ContactPerson[0].Name,
                disabled: true
            });
        }
    });

    $("#PurchaseDivision").dxSelectBox({ value: Groupdata[0].PurchaseDivision, acceptCustomValue: true, disabled: true });
    $("#SelCurrencyCode").dxSelectBox({ value: Groupdata[0].CurrencyCode, acceptCustomValue: true, disabled: true });
    //    $("#SelPOApprovalBy").dxSelectBox({ value: Groupdata[0].VoucherApprovalByEmployeeID, acceptCustomValue: true, disabled: true });

    updateTotalTax = Groupdata[0].TotalTaxAmount;
    document.getElementById("TxtBasicAmt").value = Groupdata[0].BasicAmount;
    document.getElementById("TxtAfterDisAmt").value = Groupdata[0].AfterDisAmt;

    document.getElementById("TxtNetAmt").value = Groupdata[0].NetAmount;
    document.getElementById("PORefernce").value = Groupdata[0].PurchaseReferenceRemark;
    document.getElementById("TxtTotalQty").value = Groupdata[0].TotalQuantity;

    document.getElementById("Txt_TaxAbleSum").value = Groupdata[0].TaxableAmount;

    Gblstring = Groupdata[0].TermsOfPayment;
    fillPayTermsGrid();

    document.getElementById("textDeliverAt").value = Groupdata[0].DeliveryAddress;
    //document.getElementById("textNarration").value = Groupdata[0].Narration;

    $("#DealerName").dxSelectBox({ value: Groupdata[0].DealerID });

    $("#ModeOfTransport").dxSelectBox({ value: Groupdata[0].ModeOfTransport });

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/RetrivePoCreateGrid",
        data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            var ProcessRetrive = JSON.parse(res);
            existReq = [];
            var ProcessRetrive1 = {};
            if (ProcessRetrive.length > 0) {
                for (var i = 0; i < ProcessRetrive.length; i++) {
                    var result = $.grep(existReq, function (e) { return e.ItemID === ProcessRetrive[i].ItemID; });
                    if (result.length === 0) {
                        ProcessRetrive1 = {};
                        ProcessRetrive1.TransactionID = ProcessRetrive[i].PurchaseTransactionID;
                        ProcessRetrive1.TransID = ProcessRetrive[i].TransID;
                        ProcessRetrive1.VoucherID = ProcessRetrive[i].PurchaseVoucherID;
                        ProcessRetrive1.MaxVoucherNo = ProcessRetrive[i].PurchaseMaxVoucherNo;
                        ProcessRetrive1.ItemID = ProcessRetrive[i].ItemID;
                        ProcessRetrive1.ItemGroupID = ProcessRetrive[i].ItemGroupID;
                        ProcessRetrive1.ItemSubGroupID = ProcessRetrive[i].ItemSubGroupID;
                        ProcessRetrive1.ItemGroupNameID = ProcessRetrive[i].ItemGroupNameID;
                        ProcessRetrive1.VoucherNo = "";
                        ProcessRetrive1.VoucherDate = ProcessRetrive[i].PurchaseVoucherDate;
                        ProcessRetrive1.ItemCode = ProcessRetrive[i].ItemCode;
                        ProcessRetrive1.ItemGroupName = ProcessRetrive[i].ItemGroupName;
                        ProcessRetrive1.ItemSubGroupName = ProcessRetrive[i].ItemSubGroupName;
                        ProcessRetrive1.ItemName = ProcessRetrive[i].ItemName;
                        ProcessRetrive1.RefJobBookingJobCardContentsID = ProcessRetrive[i].PORefJobBookingJobCardContentsID;
                        ProcessRetrive1.RefJobCardContentNo = ProcessRetrive[i].PORefJobCardContentNo;
                        ProcessRetrive1.RequiredQuantity = ProcessRetrive[i].TotalRequiredQuantity;
                        ProcessRetrive1.RequiredQuantityInPurchaseUnit = Number(StockUnitConversion(ProcessRetrive[i].ConversionFormula, Number(ProcessRetrive[i].TotalRequiredQuantity), Number(ProcessRetrive[i].UnitPerPacking), Number(ProcessRetrive[i].WtPerPacking), Number(ProcessRetrive[i].ConversionFactor), Number(ProcessRetrive[i].SizeW), Number(ProcessRetrive[i].UnitDecimalPlace)));
                        ProcessRetrive1.StockUnit = ProcessRetrive[i].PurchaseStockUnit;
                        ProcessRetrive1.PurchaseQuantityInStockUnit = Number(StockUnitConversion(ProcessRetrive[i].ConversionFormulaStockUnit, Number(ProcessRetrive[i].PurchaseQuantity), Number(ProcessRetrive[i].UnitPerPacking), Number(ProcessRetrive[i].WtPerPacking), Number(ProcessRetrive[i].ConversionFactor), Number(ProcessRetrive[i].SizeW), Number(ProcessRetrive[i].UnitDecimalPlaceStockUnit)));
                        ProcessRetrive1.PurchaseQuantity = ProcessRetrive[i].PurchaseQuantity;
                        ProcessRetrive1.PurchaseRate = ProcessRetrive[i].PurchaseRate;
                        ProcessRetrive1.PurchaseUnit = ProcessRetrive[i].PurchaseUnit;
                        ProcessRetrive1.ExpectedDeliveryDate = ProcessRetrive[i].ExpectedDeliveryDate;
                        ProcessRetrive1.Tolerance = ProcessRetrive[i].Tolerance;
                        ProcessRetrive1.ItemNarration = "";
                        ProcessRetrive1.BasicAmount = ProcessRetrive[i].BasicAmount;
                        ProcessRetrive1.Disc = ProcessRetrive[i].Disc;
                        ProcessRetrive1.AfterDisAmt = ProcessRetrive[i].AfterDisAmt;
                        ProcessRetrive1.TaxableAmount = ProcessRetrive[i].TaxableAmount;
                        ProcessRetrive1.GSTTaxPercentage = ProcessRetrive[i].GSTTaxPercentage;
                        ProcessRetrive1.CGSTTaxPercentage = ProcessRetrive[i].CGSTTaxPercentage;
                        ProcessRetrive1.SGSTTaxPercentage = ProcessRetrive[i].SGSTTaxPercentage;
                        ProcessRetrive1.IGSTTaxPercentage = ProcessRetrive[i].IGSTTaxPercentage;
                        ProcessRetrive1.CGSTAmt = ProcessRetrive[i].CGSTAmt;
                        ProcessRetrive1.SGSTAmt = ProcessRetrive[i].SGSTAmt;
                        ProcessRetrive1.IGSTAmt = ProcessRetrive[i].IGSTAmt;
                        ProcessRetrive1.TotalAmount = ProcessRetrive[i].TotalAmount;
                        ProcessRetrive1.PurchaseQuantityComp = ProcessRetrive[i].RequisitionQty;
                        ProcessRetrive1.CreatedBy = ProcessRetrive[i].CreatedBy;
                        ProcessRetrive1.Narration = ProcessRetrive[i].Narration;
                        ProcessRetrive1.FYear = ProcessRetrive[i].FYear;
                        ProcessRetrive1.ProductHSNName = ProcessRetrive[i].ProductHSNName;
                        ProcessRetrive1.HSNCode = ProcessRetrive[i].HSNCode;
                        ProcessRetrive1.WtPerPacking = ProcessRetrive[i].WtPerPacking;
                        ProcessRetrive1.UnitPerPacking = ProcessRetrive[i].UnitPerPacking;
                        ProcessRetrive1.ConversionFactor = ProcessRetrive[i].ConversionFactor;
                        ProcessRetrive1.ConversionFormula = ProcessRetrive[i].ConversionFormula;
                        ProcessRetrive1.UnitDecimalPlace = ProcessRetrive[i].UnitDecimalPlace;
                        ProcessRetrive1.ConversionFormulaStockUnit = ProcessRetrive[i].ConversionFormulaStockUnit;
                        ProcessRetrive1.UnitDecimalPlaceStockUnit = ProcessRetrive[i].UnitDecimalPlaceStockUnit;
                        existReq.push(ProcessRetrive1);
                    }
                }
                SubGridData = [];
                SubGridData = ProcessRetrive;
                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/RetrivePoSchedule",
                    data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, "&");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ProcessRetriveSch = JSON.parse(res);
                        ScheduleListOBJ = [];
                        ScheduleListOBJ = ProcessRetriveSch;
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/RetrivePoOverHead",
                    data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, "&");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ProcessRetriveOverHead = JSON.parse(res);

                        if (ProcessRetriveOverHead.length > 0) {
                            for (var p = 0; p < ProcessRetriveOverHead.length; p++) {
                                var HeadId = ProcessRetriveOverHead[p].HeadID;
                                for (var j = 0; j < OtherHead.length; j++) {
                                    var Exist_HeadId = OtherHead[j].HeadID;
                                    if (Exist_HeadId === HeadId) {
                                        OtherHead[j].Weight = ProcessRetriveOverHead[p].Weight;
                                        OtherHead[j].Rate = ProcessRetriveOverHead[p].Rate;
                                        OtherHead[j].HeadAmount = ProcessRetriveOverHead[p].HeadAmount;
                                        OtherHead[j].Sel = true;
                                    }
                                }
                            }
                        }

                        $("#OtherHeadsGrid").dxDataGrid({
                            dataSource: OtherHead
                        });
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/RetrivePoCreateTaxChares",
                    data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, "&");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ProcessRetriveTaxCharges = JSON.parse(res);

                        ChargesGrid = [];
                        ChargesGrid = ProcessRetriveTaxCharges;

                        var FrmUpdateTotalGstAmt = 0;////Edit By Pradeep Yadav 06 sept 2019                         
                        for (var CH = 0; CH < ChargesGrid.length; CH++) {
                            if (ChargesGrid[CH].TaxType === "GST") {
                                var Chamt = 0;
                                if (ChargesGrid[CH].ChargesAmount === undefined || ChargesGrid[CH].ChargesAmount === "undefined" || ChargesGrid[CH].ChargesAmount === "" || ChargesGrid[CH].ChargesAmount === "undefined" || ChargesGrid[CH].ChargesAmount === "null") {
                                    Chamt = 0;
                                }
                                else {
                                    Chamt = ChargesGrid[CH].ChargesAmount;
                                }
                                FrmUpdateTotalGstAmt = Number(FrmUpdateTotalGstAmt) + Number(Chamt);  //Edit By Pradeep Yadav  06 sept 2019
                            }
                        }

                        $("#AdditionalChargesGrid").dxDataGrid({
                            dataSource: ChargesGrid
                        });

                        document.getElementById("TxtTaxAmt").value = parseFloat(Number(updateTotalTax)).toFixed(2);
                        document.getElementById("TxtGstamt").value = parseFloat(Number(FrmUpdateTotalGstAmt)).toFixed(2);
                        document.getElementById("TxtOtheramt").value = parseFloat(Number(updateTotalTax) - Number(FrmUpdateTotalGstAmt)).toFixed(2);

                        var gridAfterDisAmt = parseFloat(Number(document.getElementById("TxtAfterDisAmt").value)).toFixed(2);
                        var gridColTotalTax = parseFloat(Number(document.getElementById("TxtTaxAmt").value)).toFixed(2);
                        document.getElementById("TxtNetAmt").value = (Number(gridAfterDisAmt) + Number(gridColTotalTax)).toFixed(2);

                    }
                });

                $("#CreatePOGrid").dxDataGrid({
                    dataSource: existReq
                });

                //fillPayTermsGrid();
            }
        }
    });

    document.getElementById("DetailPOButton").setAttribute("data-toggle", "modal");
    document.getElementById("DetailPOButton").setAttribute("data-target", "#ModalPODetails");
});

$("#CreatePOGrid").dxDataGrid({
    keyExpr: "ItemID",
    showBorders: true,
    paging: {
        enabled: false
    },
    height: function () {
        return window.innerHeight / 2.7;
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    wordWrapEnabled: true,
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    onCellClick: function (AddClick) {
        if (AddClick.rowType !== "data") return false;
        
        if (AddClick.column.visibleIndex === 40) {
            //GetRow = AddClick.rowIndex;
            var DistinctArray = [];
            if (ScheduleListOBJ === [] || ScheduleListOBJ === "" || ScheduleListOBJ === undefined || ScheduleListOBJ === null) {
                DistinctArray = [];
            } else {
                var MakeArray = { 'ExistRec': ScheduleListOBJ };
                DistinctArray = [];
                DistinctArray = MakeArray.ExistRec.filter(function (el) {
                    return el.ItemID === AddClick.data.ItemID;
                });
            }

            $("#ScheduleGrid").dxDataGrid({
                dataSource: DistinctArray
            });

        }
    },
    onCellPrepared: function (CEll) {
        //GridColumnCal();
    },
    columns: [
        { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
        { dataField: "TransID", visible: false, caption: "TransID", width: 120 },
        { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "MaxVoucherNo", visible: false, caption: "MaxVoucherNo", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "VoucherNo", visible: false, caption: "RequisitionNo", width: 120 },
        { dataField: "VoucherDate", visible: false, caption: "Requisition Date", width: 120 },
        { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 60 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 60 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
        ///RequiredQuantity In Stock Unit
        { dataField: "RequiredQuantity", visible: true, caption: "Req.Qty (In S.U.)", width: 60 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 60 },
        { dataField: "RequiredQuantityInPurchaseUnit", visible: true, caption: "Req.Qty (In P.U.)", width: 60 },
        {
            dataField: "PurchaseQuantity", visible: true, caption: "P.O.Qty (In P.U.)", width: 60,
            validationRules: [{ type: "required" }, { type: "numeric" }],
            setCellValue: function (newData, value, currentRowData) {
                newData.PurchaseQuantity = value;
                newData.PurchaseQuantityInStockUnit = Number(StockUnitConversion(currentRowData.ConversionFormulaStockUnit, value, currentRowData.UnitPerPacking, currentRowData.WtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlaceStockUnit));
            }
        },
        { dataField: "PurchaseQuantityInStockUnit", visible: true, caption: "P.O.Qty (In S.U.)", width: 60 },
        {
            dataField: "PurchaseRate", visible: true, caption: "Rate", width: 50,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 60 },
        {
            dataField: "ExpectedDeliveryDate", visible: true, caption: "Expec. Delivery Date", width: 120,
            dataType: "date", format: "dd-MMM-yyyy",
            showEditorAlways: true
        },
        {
            dataField: "Tolerance", visible: true, caption: "Tole. %", width: 40,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "ItemNarration", visible: false, caption: "Item Narration", width: 100 },
        { dataField: "BasicAmount", visible: true, caption: "Basic Amt", width: 60 },
        {
            dataField: "Disc", visible: true, caption: "Disc. %", width: 40,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "AfterDisAmt", visible: false, caption: "AfterDisAmt", width: 60 },
        { dataField: "TaxableAmount", visible: true, caption: "Taxable Amt", width: 60 },
        { dataField: "GSTTaxPercentage", visible: false, caption: "GST %", width: 40 },
        { dataField: "CGSTTaxPercentage", visible: true, caption: "CGST %", width: 40 },
        { dataField: "SGSTTaxPercentage", visible: true, caption: "SGST %", width: 40 },
        { dataField: "IGSTTaxPercentage", visible: true, caption: "IGST %", width: 50 },
        { dataField: "CGSTAmt", visible: true, caption: "CGST Amt", width: 60 },
        { dataField: "SGSTAmt", visible: true, caption: "SGST Amt", width: 60 },
        { dataField: "IGSTAmt", visible: true, caption: "IGST Amt", width: 60 },
        { dataField: "TotalAmount", visible: true, caption: "Total Amt", width: 60 },
        { dataField: "PurchaseQuantityComp", visible: false, caption: "Pending Quantity", width: 120 }, //For Compair of Purchase qty
        { dataField: "CreatedBy", visible: false, caption: "CreatedBy", width: 120 },
        { dataField: "Narration", visible: false, caption: "Narration", width: 120 },
        { dataField: "FYear", visible: false, caption: "FYear", width: 120 },
        { dataField: "ProductHSNName", visible: false, caption: "ProductHSNName", width: 120 },
        { dataField: "HSNCode", visible: false, caption: "HSNCode", width: 120 },
        {
            dataField: "Schedule", visible: true, caption: "Schedule", width: 70,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn')
                    .on('dxclick', function () {
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#largeModalSchedule");
                    }).appendTo(container);
            }
        },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },
        { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula", width: 120 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 120 },
        { dataField: "RefJobBookingJobCardContentsID", visible: false, caption: "RefJobBookingJobCardContentsID", width: 120 },
        { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 120 },
        { dataField: "ConversionFormulaStockUnit", visible: false, caption: "ConversionFormulaStockUnit", width: 120 },
        { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit", width: 120 }
    ],
    masterDetail: {
        enabled: true,
        template: function (container, options) {
            var currentEmployeeData = options.data;

            $("<div>")
                .dxDataGrid({
                    columnAutoWidth: true,
                    showBorders: true,
                    allowColumnResizing: true,
                    sorting: {
                        mode: "none"
                    },
                    columns: [{ dataField: "TransactionID", visible: false },
                    { dataField: "TransID", visible: false },
                    { dataField: "VoucherID", visible: false },
                    { dataField: "ItemGroupID", visible: false },
                    { dataField: "ItemID", visible: false },
                    { dataField: "MaxVoucherNo", caption: "Ref.Req.No.", width: 80 },
                    { dataField: "VoucherNo", caption: "Req.No.", width: 100 },
                    { dataField: "VoucherDate", caption: "Req.Date", width: 100, dataType: "date", format: "dd-MMM-yyyy" },
                    { dataField: "ItemCode", caption: "Item Code", width: 80 },
                    { dataField: "ItemGroupName", caption: "Item Group", width: 100 },
                    { dataField: "ItemSubGroupName", caption: "Sub Group", width: 100 },
                    { dataField: "ItemName", caption: "Item Name", width: 250 },
                    { dataField: "RefJobCardContentNo", caption: "Ref.J.C.No.", width: 120 },
                    { dataField: "RequiredQuantity", caption: "Req.Qty", width: 80 },
                    { dataField: "RequisitionQty", caption: "Total Req.Qty", width: 100 },
                    { dataField: "PurchaseQuantity", caption: "Purchase Qty", visible: false },
                    { dataField: "StockUnit", caption: "Unit", width: 80 },
                    { dataField: "CreatedBy", caption: "Created By", width: 80 },
                    { dataField: "Narration", caption: "Narration" },
                    { dataField: "FYear", caption: "FYear", visible: false },
                    { dataField: "PurchaseRate", caption: "Purchase Rate", visible: false },
                    { dataField: "PurchaseUnit", caption: "Purchase Unit", visible: false },
                    { dataField: "ProductHSNName", visible: false },
                    { dataField: "HSNCode", visible: false },
                    { dataField: "GSTTaxPercentage", caption: "GSTTaxPercentage", visible: false },
                    { dataField: "CGSTTaxPercentage", caption: "CGSTTaxPercentage", visible: false },
                    { dataField: "SGSTTaxPercentage", caption: "SGSTTaxPercentage", visible: false },
                    { dataField: "IGSTTaxPercentage", caption: "IGSTTaxPercentage", visible: false }],
                    dataSource: new DevExpress.data.DataSource({
                        store: new DevExpress.data.ArrayStore({
                            key: "ItemID",
                            data: SubGridData
                        }),
                        filter: [
                            ["ItemID", "=", options.key], "and",
                            ["RequiredQuantity", ">", 0], "and",
                            ["TransactionID", ">", 0]
                        ]
                    })
                }).appendTo(container);
        }
    }
});


$("#ScheduleGrid").dxDataGrid({
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: false, applyFilter: "auto" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [{ dataField: "id", visible: false, caption: "Seq.No", width: 120 },
    { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
    { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
    { dataField: "Quantity", visible: true, caption: "Quantity", width: 120 },
    { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 120 },
    { dataField: "SchDate", visible: true, caption: "Schedule Date", width: 120, dataType: "date", format: "dd-MMM-yyyy" }]
});

function fillPayTermsGrid() {
    var TermsID = 0;
    if (Gblstring !== "") {
        PaymentTermsGrid = [];
        Gblstring = Gblstring.split(",");
        for (var str in Gblstring) {
            var optTerms = {};
            TermsID = TermsID + 1;
            optTerms.TermsID = TermsID;
            optTerms.Terms = Gblstring[str];

            PaymentTermsGrid.push(optTerms);
        }
    }

    $("#PaymentTermsGrid").dxDataGrid({
        dataSource: PaymentTermsGrid
    });
}

$("#PaymentTermsGrid").dxDataGrid({
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: "cell",
        allowDeleting: true,
        allowUpdating: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [{ dataField: "TermsID", visible: false, caption: "TermsID" },
    { dataField: "Terms", visible: true, caption: "Terms" }]
});

$("#AdditionalChargesGrid").dxDataGrid({
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    //filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "LedgerName", visible: true, caption: "Tax  Ledger", width: 200 },
        { dataField: "TaxRatePer", visible: true, caption: "Tax %", width: 80 },
        {
            dataField: "CalculateON", visible: true, caption: "Calcu. ON", width: 80,
            lookup: {
                dataSource: [{ "ID": 1, "Name": "Value" }, { "ID": 2, "Name": "Quantity" }],
                displayExpr: "Name",
                valueExpr: "Name"
            }
        },
        { dataField: "GSTApplicable", visible: true, caption: "GST Applicable", width: 100, dataType: "boolean" },
        { dataField: "InAmount", visible: true, caption: "In Amount", width: 80, dataType: "boolean" },
        { dataField: "ChargesAmount", visible: true, caption: "Amount", width: 80 },
        { dataField: "IsCumulative", visible: false, caption: "Is Cumulative", width: 80 },
        { dataField: "TaxType", visible: true, caption: "Tax Type", width: .1 },
        { dataField: "GSTLedgerType", visible: false, caption: "GST Ledger Type", width: 80 },
        { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 80 }
    ]
});

$("#OtherHeadsGrid").dxDataGrid({
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onCellPrepared: function (cellPree) {
        var cellPreedataGrid = $('#OtherHeadsGrid').dxDataGrid('instance');

        if (cellPree.rowType === undefined || cellPree.rowType !== "data") return false;
        if (cellPree.columnIndex === 4 || cellPree.columnIndex === 5) {
            var RateType = "";
            var Weight = 0;
            var Rate = 0;
            var HeadAmount = 0;

            var CellRow = cellPree.row.rowIndex;
            RateType = cellPreedataGrid._options.dataSource[CellRow].RateType;
            Weight = cellPreedataGrid._options.dataSource[CellRow].Weight;
            Rate = cellPreedataGrid._options.dataSource[CellRow].Rate;

            if (RateType === "RateKg") {
                HeadAmount = Number(Weight) * Number(Rate);
            } else if (RateType === "RateTon") {
                HeadAmount = Number(Number(Weight) / 1000) * Number(Rate);
            } else if (RateType === "Amount") {
                HeadAmount = Number(Rate);
            }
            cellPreedataGrid._options.dataSource[CellRow].Weight = parseFloat(Number(Weight)).toFixed(2);
            cellPreedataGrid._options.dataSource[CellRow].Rate = parseFloat(Number(Rate)).toFixed(2);
            cellPreedataGrid._options.dataSource[CellRow].HeadAmount = parseFloat(Number(HeadAmount)).toFixed(2);
        }
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [{ dataField: "HeadID", visible: false, caption: "HeadID" },
    { dataField: "RateType", visible: false, caption: "RateType" },
    { dataField: "Sel", visible: true, caption: "Select", dataType: "boolean" },
    { dataField: "Head", visible: true, caption: "Head" },
    { dataField: "Weight", visible: true, caption: "Weight" },
    { dataField: "Rate", visible: true, caption: "Rate" },
    { dataField: "HeadAmount", visible: true, caption: "Amount" }]
});

function StockUnitConversion(formula, PhysicalStock, UnitPerPacking, WtPerPacking, ConversionFactor, SizeW, UnitDecimalPlace) {
    var convertedQuantity = 0;
    if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
        formula = formula.split('e.').join('');
        formula = formula.replace("Quantity", "PhysicalStock");

        var n = formula.search("UnitPerPacking");
        if (n > 0) {
            if (Number(UnitPerPacking) > 0) {
                convertedQuantity = eval(formula);
                convertedQuantity = Number(convertedQuantity).toFixed(Number(UnitDecimalPlace));

            }
        } else {
            n = formula.search("SizeW");
            if (n > 0) {
                if (Number(SizeW) > 0) {
                    convertedQuantity = eval(formula);

                    convertedQuantity = Number(convertedQuantity).toFixed(Number(UnitDecimalPlace));
                }
            } else {
                convertedQuantity = eval(formula);
                convertedQuantity = Number(convertedQuantity).toFixed(Number(UnitDecimalPlace));
            }
        }
    } else {
        convertedQuantity = Number(PhysicalStock);
    }
    return convertedQuantity;
}

$("#POPrintButton").click(function () {
    if (Groupdata.length <= 0) {
        DevExpress.ui.notify("Please select any requisition voucher to view..!", "warning", 1500);
        return false;
    }
    var TxtPOID = Groupdata[0].TransactionID;

    var url = "ReportPurchaseOrder.aspx?TransactionID=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});