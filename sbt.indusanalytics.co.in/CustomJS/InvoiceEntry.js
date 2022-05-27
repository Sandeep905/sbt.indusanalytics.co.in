"use strict";
var NoteNo = "";
var GblStatus = "", GblCompanyStateTin = 0;
var RadioValue = "Pending";
var GetSelectedListData = [], GetProcessSelectedListData = [];
var supplieridvalidate = "";
var otherDetailGridData = [];
var MinMaxBtnStatus = "";
var SelectedOrderDetailData = [];
var prefix = "";
var ChargesGrid = [];
var ObjOrderDeliveryData = [];
var Var_ChargeHead = [];
var TransactionIDString = "", LoadSalesLedgerData = [];
var FlagEditPurchaseRate = true;
var ObjProductHSNGrp = [];
var LblSupplierStateTin = 0;
var IsDirectInvoice = false;
var IsInvoiceApproved = false;

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

$("#ModeOfTransport").dxSelectBox({
    items: ["By Road", "By Rail", "By Air", "By Ocean", "Other"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelDocumentType").dxSelectBox({
    items: ["INV", "CRN", "DBN"],
    placeholder: "Select --",
    showClearButton: true
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Document type is required' }]
});

$("#SelIsExport").dxSelectBox({
    items: ["Yes", "No"],
    placeholder: "Select --",
    onValueChanged: function (e) {
        if (e.value === "No") {
            $("#DivExportOptionNo").removeClass("hidden");
            $("#DivExportOptionYes").addClass("hidden");
        } else {
            $("#DivExportOptionNo").addClass("hidden");
            $("#DivExportOptionYes").removeClass("hidden");
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Is Export Invoice.?' }]
});

$("#SelShippedFrom").dxSelectBox({
    items: ["Yes", "No"],
    placeholder: "Select --",
    onValueChanged: function (e) {
        if (e.value === "Yes") {
            $("#OptShippedLedgerType").removeClass("hidden");
            $("#DivShippedLegalName").removeClass("hidden");
        } else {
            $("#OptShippedLedgerType").addClass("hidden");
            $("#DivShippedLegalName").addClass("hidden");
        }
    }
});

$("#SelIGSTOnIntra").dxSelectBox({
    items: ["Yes", "No"],
    value: "No",
    placeholder: "Select --"
});

$("#SelReverseCharge").dxSelectBox({
    items: ["Yes", "No"],
    value: "No",
    placeholder: "Select --"
});

$("#SelECommerce").dxSelectBox({
    items: ["Yes", "No"],
    value: "No",
    placeholder: "Select --",
    onValueChanged: function (e) {
        if (e.value === "Yes") {
            $("#divECommerceLegalName").removeClass("hidden");
        } else {
            $("#divECommerceLegalName").addClass("hidden");
        }
    }
});

$("#OptShippedLedgerType").dxRadioGroup({
    items: ["Supplier", "Vendor"],
    layout: "horizontal",
    onValueChanged: function (e) {
        document.getElementById("TxtShippedMailingName").value = "";
        $("#SelShippedFromLedger").dxSelectBox({ value: null });
        RefreshShippedFrom(e.value);
    }
});

$("#SelCurrencyType").dxSelectBox({
    items: [],
    value: "INR",
    displayExpr: "CurrencyCode",
    valueExpr: "CurrencyCode",
    placeholder: "Select --",
    searchEnabled: true
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Currency code is required' }]
});

$("#SelOriginCountry").dxSelectBox({
    items: [],
    displayExpr: "Country",
    valueExpr: "Country",
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelDestinationCountry").dxSelectBox({
    items: [],
    displayExpr: "Country",
    valueExpr: "Country",
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelLoadingPort").dxSelectBox({
    items: [],
    displayExpr: "PortName",
    valueExpr: "PortName",
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelDischargePort").dxSelectBox({
    items: [],
    displayExpr: "PortName",
    valueExpr: "PortName",
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelECommerceLegalName").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true
});

$("#SelShippedFromLedger").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LegalName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.LedgerID === e.value; });
        if (result.length === 1) {
            document.getElementById("TxtShippedMailingName").value = result[0].MailingName;
        }
    }
});

$("#SelNotifyParty1").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'MailingName',
    valueExpr: 'LedgerID',
    searchEnabled: true
});

$("#SelNotifyParty2").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'MailingName',
    valueExpr: 'LedgerID',
    searchEnabled: true
});

$("#DTEWayBillDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd/MM/yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelTransporter").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'TransporterName',
    valueExpr: 'TransporterID',
    searchEnabled: true
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Transporter is required' }]
});

$("#TxtClientID").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LegalName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value) {
            GetConsignee(e.value);
            GblCompanyStateTin = 0;
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.LedgerID === e.value; });
            if (result.length === 1) {
                GblCompanyStateTin = result[0].CompanyStateTinNo;
                document.getElementById("TxtClientState").value = result[0].State;
                document.getElementById("TxtMailingName").value = result[0].MailingName;
                AddItemCalculation();
                CalculateAmount();
            }
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Client is required' }]
});

$("#TxtConsigneeID").dxSelectBox({
    items: [],
    placeholder: "Select --",
    searchEnabled: true,
    displayExpr: 'LegalName',
    valueExpr: 'ConsigneeID',
    onValueChanged: function (e) {
        document.getElementById("TxtConsigneeState").value = "";
        document.getElementById("TxtDestination").value = "";
        if (e.value) {
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.ConsigneeID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtConsigneeState").value = result[0].State;
                document.getElementById("TxtDestination").value = result[0].City;
                document.getElementById("TxtConsigneeMailingName").value = result[0].MailingName;
            }
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Consignee is required' }]
});

$("#SelBanker").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LegalName',
    valueExpr: 'LedgerID',
    searchEnabled: true
});

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd/MM/yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelSalesLedger").dxSelectBox({
    items: [],
    placeholder: "Select --",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID'
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Sales Ledger is required' }]
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetCurrencyCode",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelCurrencyType").dxSelectBox({ items: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetCountryList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelOriginCountry").dxSelectBox({ items: RES1 });
        $("#SelDestinationCountry").dxSelectBox({ items: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetPortsList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelLoadingPort").dxSelectBox({ items: RES1 });
        $("#SelDischargePort").dxSelectBox({ items: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetProductHSNGroups",
    data: '{Category:"Finish Goods"}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjProductHSNGrp = JSON.parse(res);
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_PurchaseOrder.asmx/CheckIsAdmin",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d === "True") {
            FlagEditPurchaseRate = false;
        } else
            FlagEditPurchaseRate = true;
    }
});

///Clients
$.ajax({
    type: "POST",
    url: "WebService_InvoiceEntry.asmx/GetClientData",
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
        $("#TxtClientID").dxSelectBox({ dataSource: RES1 });
        $("#SelECommerceLegalName").dxSelectBox({ dataSource: RES1 });
        $("#SelBanker").dxSelectBox({ dataSource: RES1 });
        $("#SelNotifyParty1").dxSelectBox({ dataSource: RES1 });
        $("#SelNotifyParty2").dxSelectBox({ dataSource: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

//Transporter
$.ajax({
    type: "POST",
    url: "WebService_ChallanDetail.asmx/GetTransporterData",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var items = JSON.parse(res);
        $("#SelTransporter").dxSelectBox({ dataSource: items });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

CreateNOTENO();
function CreateNOTENO() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/GetNoteNO",
        data: '{prefix:' + JSON.stringify(prefix) + '}',
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
            if (res !== "fail") {
                NoteNo = res;
                document.getElementById("TxtDelNote").value = res;
            }
            else {
                NoteNo = "";
                document.getElementById("TxtDelNote").value = res;
            }
        }
    });
}

//Load SalesLedger
loadSalesLedger();
function loadSalesLedger() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_InvoiceEntry.asmx/SalesLedger",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                LoadSalesLedgerData = JSON.parse(res);

                $("#SelSalesLedger").dxSelectBox({
                    items: LoadSalesLedgerData,
                    value: LoadSalesLedgerData[0].LedgerID
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#optreceiptradio").dxRadioGroup({
    items: ["Pending", "Processed"],
    value: "Pending",
    layout: "horizontal"
});

$(function () {
    $("#optreceiptradio").dxRadioGroup({
        onValueChanged: function (e) {
            //var previousValue = e.previousValue;
            var newValue = e.value;
            GetSelectedListData = [];
            document.getElementById("TxtCHDID").value = "";
            RadioValue = e.value;
            GetChallanDetailData();
        }
    });
});

//PendingReceiptData();

GetChallanDetailData();
function GetChallanDetailData() {
    var CurURL = "";

    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        if (RadioValue === "Pending") {
            document.getElementById("DivCretbtn").style.display = "block";
            document.getElementById("DivEdit").style.display = "none";
            document.getElementById("BtnDeletePopUp").disabled = true;
            GblStatus = "";
            $("#BtnSave").removeClass("hidden");

            CurURL = "WebService_InvoiceEntry.asmx/GetPendingOrdersList";
            $.ajax({
                type: "POST",
                //url: "WebService_InvoiceEntry.asmx/GetPendingOrdersList",
                url: CurURL,
                data: '',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/:,/g, ':null,');
                    res = res.replace(/u0026/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    var tt = JSON.parse(res);
                    SetPendingReceiptGrid(tt);
                }
            });
        } else if (RadioValue === "Processed") {
            document.getElementById("DivCretbtn").style.display = "none";
            document.getElementById("DivEdit").style.display = "block";
            CurURL = "WebService_InvoiceEntry.asmx/GetProcessOrdersList";
            $.ajax({
                type: "POST",
                //url: "WebService_InvoiceEntry.asmx/GetPendingOrdersList",
                url: CurURL,
                data: '',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/:,/g, ':null,');
                    res = res.replace(/u0026/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    var ProcessedData = JSON.parse(res);
                    SetProcessedGrid(ProcessedData);
                }
            });
        }

    } catch (e) {
        console.log(e);
    }
}

function SetPendingReceiptGrid(tt) {
    document.getElementById("gridProcessedCHDList").style.display = "none";
    document.getElementById("gridCHDList").style.display = "block";
    document.getElementById("gridCHDList").style.height = "calc(100vh - 95px)";
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnPrint").disabled = true;
    GetSelectedListData = [];
    supplieridvalidate = "";
    $("#gridCHDList").dxDataGrid({ //$("#gridreceiptlist").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "multiple", showCheckBoxesMode: "always" },
        height: function () {
            return window.innerHeight / 1.2;
        },
        filterRow: { visible: true },
        loadPanel: {
            enabled: false
        },
        searchPanel: { visible: true },
        export: {
            enabled: true,
            fileName: "Challan Detail",
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
            if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            var Row = e.row.rowIndex;
            var Col = e.columnIndex;
        },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditorPreparing: function (e) {
            if (e.parentType === 'headerRow' && e.command === 'select') {
                e.editorElement.remove();
            }
        },
        onEditingStart: function (e) {
            if (e.column.visibleIndex > 1) {
                e.cancel = true;
            }
        },
        onSelectionChanged: function (clickedIndentCell) {
            otherDetailGridData = [];

            if (clickedIndentCell.currentSelectedRowKeys.length > 0) {
                if (supplieridvalidate === "") {
                    supplieridvalidate = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                    document.getElementById("TxtCHDID").value = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                    if (TransactionIDString === "") {
                        TransactionIDString = clickedIndentCell.currentSelectedRowKeys[0].FGTransactionID;
                    } else {
                        TransactionIDString = TransactionIDString + "," + clickedIndentCell.currentSelectedRowKeys[0].FGTransactionID;
                    }
                }
                else if (supplieridvalidate !== clickedIndentCell.currentSelectedRowKeys[0].LedgerID && clickedIndentCell.selectedRowsData[0].Transporter !== clickedIndentCell.currentSelectedRowKeys[0].Transporter) {
                    clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please select records which have same Customer or same Transporter..!", "warning", 3000);
                    clickedIndentCell.currentSelectedRowKeys = [];
                    return false;
                }
            }
            else {
                TransactionIDString = "";
            }
            $("#gridOtherDetail").dxDataGrid({
                dataSource: otherDetailGridData
            });

            GetSelectedListData = clickedIndentCell.selectedRowsData;

            if (GetSelectedListData.length > 0) {

                TransactionIDString = $.map(GetSelectedListData, function (value) {
                    return value.FGTransactionID;
                }).join(',');

                otherDetailGrid();
                LblSupplierStateTin = GetSelectedListData[0].StateTinNo;
                document.getElementById("gridCHDList").style.height = "calc(100vh - 340px)";
                document.getElementById("ExtraDetailDiv").style.display = "block";
                document.getElementById("MinBtn").style.display = "block";
                document.getElementById("MaxBtn").style.display = "none";
            }

            if (GetSelectedListData.length === 0) {
                supplieridvalidate = "";
                document.getElementById("TxtCHDID").value = "";

                if (MinMaxBtnStatus === "Min") {
                    document.getElementById("ExtraDetailDiv").style.display = "none";
                    document.getElementById("gridCHDList").style.height = "calc(100vh - 95px)";
                    document.getElementById("MinBtn").style.display = "none";
                    document.getElementById("MaxBtn").style.display = "block";
                }
            }
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "FGTransactionID", visible: false, caption: "FGTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ConsigneeLedgerID", visible: false, caption: "Consignee ID", width: 120 },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
            { dataField: "DeliveryOrderBookingID", visible: false, caption: "DeliveryOrderBookingID", width: 120 },
            { dataField: "DeliveryOrderBookingDetailsID", visible: false, caption: "DeliveryOrderBookingDetailsID", width: 120 },
            { dataField: "DeliveryJobBookingID", visible: false, caption: "DeliveryJobBookingID", width: 120 },
            { dataField: "DeliveryJobBookingJobCardContentsID", visible: false, caption: "DeliveryJobBookingJobCardContentsID", width: 120 },
            { dataField: "MaxVoucherNo", visible: false, caption: "Ref. Voucher No", width: 100 },
            { dataField: "DeliveryNoteNo", visible: true, caption: "Delivery Note No", width: 120 },
            { dataField: "ClientName", visible: true, caption: "Customer Name", minWidth: 80, fixed: true },
            { dataField: "ConsigneeName", visible: true, caption: "Consignee Name", minWidth: 80 },
            { dataField: "ProductMasterCode", visible: true, caption: "Product Master Code", width: 100 },
            { dataField: "DeliveryNoteDate", visible: true, caption: "Delivery Note Date", width: 140, dataType: "date", format: "dd/MM/yyyy", Mode: "DateRangeCalendar" },
            { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No", width: 120 },
            { dataField: "JobBookingNo", visible: true, caption: "Job Booking No", width: 100 },
            { dataField: "OrderBookingDate", visible: true, caption: "Order Booking Date", width: 140, dataType: "date", format: "dd/MM/yyyy", Mode: "DateRangeCalendar" },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 120 },
            { dataField: "ProductCode", visible: true, caption: "Product Code", width: 100 },
            { dataField: "TotalOuterCarton", visible: false, caption: "Total Outer Carton", width: 120 },
            { dataField: "TotalDeliveredQuantity", visible: true, caption: "Total Delivered Quantity", width: 120 },
            { dataField: "ClientState", visible: false, caption: "Client State", width: 100 },
            { dataField: "ConsigneeState", visible: false, caption: "Consignee State", width: 100 },
            { dataField: "CompanyState", visible: false, caption: "Company State", width: 100 }

            //{ dataField: "JCQty", visible: true, caption: "JCQty", width: 80 },
            //{ dataField: "FinishGoodsQty", visible: true, caption: "FinishGoodsQty", width: 100 },
            //{ dataField: "DeliveredQuantity", visible: true, caption: "DeliveredQuantity", width: 80 },
            //{ dataField: "PendingQuantity", visible: true, caption: "PendingQuantity", width: 80 },
            //{ dataField: "DeliveryDate", visible: true, caption: "DeliveryDate", width: 140, dataType: "date", format: "dd/MM/yyyy", Mode: "DateRangeCalendar" },
            //{ dataField: "PODetail", visible: true, caption: "PODetail", width: 200 },
            //{ dataField: "FinishGoodsWt", visible: true, caption: "FinishGoodsWt", width: 200 },
            //{ dataField: "TTLCFT", visible: true, caption: "TTLCFT", width: 100 },
            //{ dataField: "WTPerCFC", visible: true, caption: "WTPerCFC", width: 100 },
            //{ dataField: "PODate", visible: true, caption: "PODate", width: 140, dataType: "date", format: "dd/MM/yyyy", Mode: "DateRangeCalendar" },
            //{ dataField: "StateTinNo", visible: true, caption: "StateTinNo", width: 100 },
            //{ dataField: "TotalFGOuterCartons", visible: true, caption: "TotalFGOuterCartons", width: 150 },
            //{ dataField: "DispatchRemark", visible: true, caption: "DispatchRemark", width: 200 },
            //{ dataField: "PONo", visible: true, caption: "PONo", width: 100 },
            //{ dataField: "Remark", visible: true, caption: "Remark", width: 150 },

        ]
    });

    var grid1 = $("#gridCHDList").dxDataGrid('instance');
    grid1.clearSelection();
}

function SetProcessedGrid(ProcessedData) {
    document.getElementById("gridProcessedCHDList").style.display = "block";
    document.getElementById("gridCHDList").style.display = "none";
    document.getElementById("gridProcessedCHDList").style.height = "calc(100vh - 95px)";
    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnPrint").disabled = false;
    //  document.getElementById("BtnSave").disabled = true;
    //  GetSelectedListData = [];

    $("#gridProcessedCHDList").dxDataGrid({
        dataSource: ProcessedData,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        selection: { mode: "single" },
        filterRow: { visible: true },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        height: function () {
            return window.innerHeight / 1.2;
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
            if (e.rowType === "data") {
                if (e.data.IsDirectInvoice === true) {
                    e.rowElement.css('background', '#efe813c2');
                }
            }
        },
        onEditorPreparing: function (e) {
            if (e.parentType === 'headerRow' && e.command === 'select') {
                e.editorElement.remove();
            }
        },
        export: {
            enabled: true,
            fileName: "Challan Detail",
            allowExportSelectedData: true
        },
        onSelectionChanged: function (clickedProcessCell) {
            GetProcessSelectedListData = clickedProcessCell.selectedRowsData;
            IsDirectInvoice = false, IsInvoiceApproved = false;
            if (GetProcessSelectedListData.length <= 0) return;
            document.getElementById("TxtCHDID").value = GetProcessSelectedListData[0].InvoiceTransactionID;
            IsDirectInvoice = GetProcessSelectedListData[0].IsDirectInvoice;
            IsInvoiceApproved = GetProcessSelectedListData[0].IsInvoiceApproved;
            if (IsInvoiceApproved === true) {
                $("#BtnSave").addClass("hidden");
            } else {
                $("#BtnSave").removeClass("hidden");
            }
        },
        columns: [
            { dataField: "InvoiceTransactionID", visible: false, caption: "InvoiceTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ConsigneeLedgerID", visible: false, caption: "ConsigneeLedgerID", width: 120 },
            { dataField: "SalesLedgerID", visible: false, caption: "SalesLedgerID", width: 120 },
            { dataField: "MaxVoucherNo", visible: false, caption: "Ref. Voucher No", width: 100 },
            { dataField: "InvoiceNo", caption: "Invoice No" },
            { dataField: "ChallanNo", caption: "Challan No", width: 100 },
            { dataField: "InvoiceDate", caption: "Invoice Date", dataType: "date", format: "dd/MM/yyyy", Mode: "DateRangeCalendar" },
            { dataField: "ClientName", caption: "Client Name", width: 200 },
            { dataField: "JobBookingNo", caption: "Job Card No", width: 100 },
            { dataField: "JobName", caption: "Job Name", width: 200 },
            { dataField: "ConsigneeName", caption: "Consignee Name", width: 200 },
            { dataField: "ProductHSNName", caption: "Group Name", width: 150 },
            { dataField: "Quantity", caption: "Quantity", width: 100 },
            { dataField: "TotalQuantity", caption: "Total Quantity" },
            { dataField: "Rate", caption: "Cost" },
            { dataField: "NetAmount", caption: "Net Amount" },
            { dataField: "ClientState", caption: "Client State" },
            { dataField: "Narration", caption: "Remark" },
            { dataField: "IsPostedInTally", caption: "Is Posted In Tally" },
            { dataField: "IsInvoiceApproved", caption: "Is Invoice Approved" },
            { dataField: "SalesLedgerName", caption: "Sales Ledger Name" }
        ]
    });
}

function otherDetailGrid() {
    var FGTransactionID = GetSelectedListData[0].FGTransactionID;

    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/StockDetail",
        data: '{FGTransactionID:' + JSON.stringify(FGTransactionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            otherDetailGridData = [];
            otherDetailGridData = JSON.parse(res);
            $("#gridOtherDetail").dxDataGrid({
                dataSource: otherDetailGridData
            });
        }
    });

    $("#gridOtherDetail").dxDataGrid({
        dataSource: otherDetailGridData
    });
}

$("#gridOtherDetail").dxDataGrid({
    dataSource: otherDetailGridData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3.5;
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
    onEditorPreparing: function (e) {
        if (e.parentType === 'headerRow' && e.command === 'select') {
            e.editorElement.remove();
        }
    },
    onEditingStart: function (e) {
        if (e.column.visibleIndex > 1) {
            e.cancel = true;
        }
    },
    columns: [
        { dataField: "MaxDNNo", visible: false, caption: "MaxDNNo", width: 120 },
        { dataField: "DeliveryNoteNo", visible: true, caption: "Delivery Note No", width: 100 },
        { dataField: "DeliveryNoteDate", visible: true, caption: "Delivery Note Date", width: 120 },
        { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No" },
        { dataField: "OrderBookingDate", visible: true, caption: "Order Booking Date" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No", width: 100 },
        { dataField: "TotalDeliveredOuterCarton", visible: true, caption: "Total Delivered Outer Carton", width: 120 },
        { dataField: "TotalDeliveredQuantity", visible: true, caption: "Total Delivered Quantity", width: 100 }
    ]
});

//PopUp Control Data Start..
var DeliveryDetailGrid = $("#DeliveryDetailGrid").dxDataGrid({
    dataSource: ObjOrderDeliveryData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
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
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        if (e.rowType === "data") {
            GridColumnCal();
        }
    },
    height: function () {
        return window.innerHeight / 2.6;
    },
    onEditorPreparing: function (e) {
        if (e.parentType === 'headerRow' && e.command === 'select') {
            e.editorElement.remove();
        }
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "PurchaseRate" || e.column.dataField === "PurchaseUnit") {
            if (IsDirectInvoice === false)
                e.cancel = FlagEditPurchaseRate;
        } else if (e.column.dataField === "PurchaseQuantity") {
            if (IsDirectInvoice === false)
                e.cancel = true;
        }
    },
    editing: {
        mode: "cell",
        allowDeleting: true,
        allowUpdating: true,
        allowAdding: false
    },
    columns: [
        { dataField: "FGTransactionID", visible: false, caption: "FGTransactionID" },
        { dataField: "CompanyID", visible: false, caption: "CompanyID" },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
        { dataField: "ProductMasterCode", allowEditing: false, caption: "P.M. Code" },
        { dataField: "ProductCode", allowEditing: false, visible: false, caption: "Product Code" },
        { dataField: "JobName", allowEditing: true, caption: "Description", minWidth: 100, width: 180 },
        {
            dataField: "IsService", allowEditing: true, caption: "Is Service?", width: 100,
            lookup: { dataSource: ["Yes", "No"], value: "No" }, validationRules: [{ type: "required" }]
        },
        {
            dataField: "ProductHSNID", caption: "Group Name", width: 150, minWidth: 100, validationRules: [{ type: "required" }],
            lookup: { dataSource: ObjProductHSNGrp, valueExpr: 'ProductHSNID', displayExpr: 'ProductHSNName' },
            setCellValue: function (rowData, value) {
                rowData.ProductHSNID = value;
                var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === value; });
                if (result.length === 1) {
                    rowData.IGSTTaxPercentage = result[0].IGSTTaxPercentage;
                    rowData.SGSTTaxPercentage = result[0].SGSTTaxPercentage;
                    rowData.CGSTTaxPercentage = result[0].CGSTTaxPercentage;
                    rowData.GSTTaxPercentage = result[0].GSTTaxPercentage;
                    rowData.HSNCode = result[0].HSNCode;
                }
            }
        },
        { dataField: "HSNCode", allowEditing: false, caption: "HSN Code" },
        { dataField: "FreeQuantity", allowEditing: false, caption: "Free Qty" },
        { dataField: "PurchaseQuantity", allowEditing: true, caption: "Dispatch Qty", validationRules: [{ type: "required" }, { type: "numeric" }] },//DeliveredQuantity
        { dataField: "PurchaseRate", allowEditing: true, caption: "Rate", validationRules: [{ type: "required" }, { type: "numeric" }] },//Rate
        {
            dataField: "PurchaseUnit",
            lookup: {
                dataSource: [{ "PurchaseUnit": "UnitCost", "PurchaseUnitX": "Per Unit" }, { "PurchaseUnit": "UnitThCost", "PurchaseUnitX": "1000 Unit" }],
                displayExpr: "PurchaseUnitX",
                valueExpr: "PurchaseUnit"
            }, visible: true, caption: "Rate Type", validationRules: [{ type: "required" }]
        },//Rate Type
        { dataField: "BasicAmount", allowEditing: false, caption: "Amount" },//Amount
        { dataField: "Disc", allowEditing: true, caption: "Disc. %", width: 60 },
        { dataField: "TaxableAmount", allowEditing: false, caption: "Taxable Amount" },
        { dataField: "PackingReference", allowEditing: true, caption: "Packing Ref." },
        { dataField: "NoOfPallet", allowEditing: false, caption: "No Of Pallet" },
        { dataField: "IssueOuterCarton", allowEditing: IsDirectInvoice, caption: "No Of Carton" },
        { dataField: "InnerCarton", allowEditing: IsDirectInvoice, caption: "Unit Per Carton" },
        { dataField: "GSTTaxPercentage", allowEditing: false, caption: "GST %" },
        { dataField: "CGSTTaxPercentage", allowEditing: false, caption: "CGST %" },
        { dataField: "SGSTTaxPercentage", allowEditing: false, caption: "SGST %" },
        { dataField: "IGSTTaxPercentage", allowEditing: false, caption: "IGST %" },
        { dataField: "CGSTAmt", allowEditing: false, caption: "CGST Amt" },
        { dataField: "SGSTAmt", allowEditing: false, caption: "SGST Amt" },
        { dataField: "IGSTAmt", allowEditing: false, caption: "IGST Amt" },
        { dataField: "TotalAmount", allowEditing: false, caption: "Total Amount" },
        { dataField: "PONo", allowEditing: false, caption: "PO No" },
        { dataField: "PODate", allowEditing: false, caption: "PO Date" },
        { dataField: "SalesOrderNo", allowEditing: false, caption: "Sales Order No" },
        { dataField: "OrderBookingDate", visible: false, caption: "Order Date" },
        { dataField: "JobBookingNo", allowEditing: false, caption: "Job Booking No" },
        { dataField: "JobBookingDate", visible: false, caption: "Job Booking Date" },
        { dataField: "DeliveryNoteNo", allowEditing: false, caption: "Delivery Note No" },
        { dataField: "DeliveryNoteDate", allowEditing: false, caption: "Delivery Note Date" },
        { dataField: "BatchName", allowEditing: true, caption: "Batch Name" },
        { dataField: "AfterDisAmt", visible: false, caption: "AfterDisAmt", width: 80 },
        { dataField: "DeliveryOrderBookingID", visible: false, caption: "DeliveryOrderBookingID" },
        { dataField: "DeliveryOrderBookingDetailsID", visible: false, caption: "DeliveryOrderBookingDetailsID" },
        { dataField: "DeliveryJobBookingID", visible: false, caption: "DeliveryJobBookingID" },
        { dataField: "DeliveryJobBookingJobCardContentsID", visible: false, caption: "DeliveryJobBookingJobCardContentsID" }
    ],
    onRowUpdated: function (e) {
        var HSNID = e.key.ProductHSNID;
        var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === HSNID; });
        if (result.length === 1) {
            e.key.IGSTTaxPercentage = result[0].IGSTTaxPercentage;
            e.key.SGSTTaxPercentage = result[0].SGSTTaxPercentage;
            e.key.CGSTTaxPercentage = result[0].CGSTTaxPercentage;
            e.key.GSTTaxPercentage = result[0].GSTTaxPercentage;
            e.key.HSNCode = result[0].HSNCode;
        }
        if (IsDirectInvoice === true) ObjOrderDeliveryData = e.component._options.dataSource;
        AddItemCalculation();
        GridColumnCal();
        if (ChargesGrid.length > 0) {
            //AddItemWithChargessGrid();
            CalculateAmount();
        }
    },
    onRowRemoved: function (e) {
        if (ObjOrderDeliveryData.length > 0) {
            ObjOrderDeliveryData = ObjOrderDeliveryData.filter(function (obj) {
                return obj.FGTransactionID !== e.data.FGTransactionID;
            });
            if (IsDirectInvoice === true) ObjOrderDeliveryData = e.component._options.dataSource;
            AddItemCalculation();
            if (ChargesGrid.length > 0) {
                GridColumnCal();
                CalculateAmount();
            }
        }
    },
    onRowInserted: function (e) {
        if (IsDirectInvoice === true) ObjOrderDeliveryData = e.component._options.dataSource;
        AddItemCalculation();
        GridColumnCal();
        if (ChargesGrid.length > 0) {
            CalculateAmount();
        }
    }
}).dxDataGrid("instance");

$("#BtnCreateInvoice").click(function () {

    var TxtCHDID = document.getElementById("TxtCHDID").value;

    if (TxtCHDID === "" || TxtCHDID === null || TxtCHDID === undefined) {
        swal("", "Please select any row from below grid..!", "warning");
        return false;
    }
    DeliveryDetailGrid.option("editing.allowAdding", false);
    IsDirectInvoice = false;
    IsInvoiceApproved = false;

    ObjOrderDeliveryData = [];
    ChargesGrid = [];

    $("#AdditionalChargesGrid").dxDataGrid({
        dataSource: ChargesGrid
    });
    // DrawMonthDay();
    BlankField();

    CreateNOTENO();
    $("#TxtClientID").dxSelectBox({
        value: GetSelectedListData[0].LedgerID
    });

    $("#SelSalesLedger").dxSelectBox({
        value: LoadSalesLedgerData[0].LedgerID
    });

    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/PopUpFirstGrid",
        data: '{TransactionIDString:' + JSON.stringify(TransactionIDString) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var GetDataDeliveryDetailGrid = JSON.parse(res);
            ObjOrderDeliveryData = [];
            ObjOrderDeliveryData = GetDataDeliveryDetailGrid;

            if (ObjOrderDeliveryData.length > 0) {

                //var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
                var CreatePOGrid_RowCount = ObjOrderDeliveryData.length;

                // var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                //var Charge_RowCount = ChargesGrid.length;

                if (CreatePOGrid_RowCount > 0) {
                    for (var t = 0; t < CreatePOGrid_RowCount; t++) {
                        ObjOrderDeliveryData[t].TaxableAmount = ObjOrderDeliveryData[t].AfterDisAmt;
                    }
                }
                if (ObjOrderDeliveryData.length > 0) {
                    var BasicAmt = 0, IGSTPER = 0, SGSTPER = 0, CGSTPER = 0;
                    var TaxAbleAmt = 0, IGSTAMT = 0, SGSTAMT = 0, CGSTAMT = 0, TotalAmount = 0;

                    for (var CreatePOGridRow = 0; CreatePOGridRow < ObjOrderDeliveryData.length; CreatePOGridRow++) {

                        var PurchaseRate = ObjOrderDeliveryData[CreatePOGridRow].PurchaseRate.toFixed(3);
                        var PurchaseUnit = ObjOrderDeliveryData[CreatePOGridRow].PurchaseUnit;
                        var Qty = ObjOrderDeliveryData[CreatePOGridRow].PurchaseQuantity;
                        var DisPercentage = ObjOrderDeliveryData[CreatePOGridRow].Disc;

                        if (Qty === "" || Qty === undefined || Qty === null || Qty === "NULL") {
                            Qty = 0;
                        }

                        if (DisPercentage === "" || DisPercentage === undefined || DisPercentage === null || DisPercentage === "NULL") {
                            DisPercentage = 0;
                        }

                        if (PurchaseRate === "" || PurchaseRate === undefined || PurchaseRate === null || PurchaseRate === "NULL") {
                            PurchaseRate = 0;
                        }

                        if (PurchaseUnit === "UnitThCost") {
                            BasicAmt = parseFloat(Number(Qty) * Number(PurchaseRate) / 1000).toFixed(2);
                        } else {
                            BasicAmt = parseFloat(Number(Qty) * Number(PurchaseRate)).toFixed(2);
                        }

                        var DiscountAmt = parseFloat(Number(BasicAmt) * Number(DisPercentage) / 100).toFixed(2);

                        var afterDiscountAmt = 0;
                        afterDiscountAmt = parseFloat(Number(BasicAmt) - Number(DiscountAmt)).toFixed(2);

                        TaxAbleAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);

                        if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                            if (ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === "NULL") {
                                CGSTPER = 0;
                            }
                            else {
                                CGSTPER = ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                            }
                            if (ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === "NULL") {
                                SGSTPER = 0;
                            }
                            else {
                                SGSTPER = ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage;
                            }
                            SGSTAMT = parseFloat(Number(TaxAbleAmt) * Number(SGSTPER) / 100).toFixed(2);
                            CGSTAMT = parseFloat(Number(TaxAbleAmt) * Number(CGSTPER) / 100).toFixed(2);
                            //Cal Corection
                            IGSTAMT = 0;
                            TotalAmount = parseFloat(Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
                        }
                        else {
                            if (ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === "NULL") {
                                IGSTPER = 0;
                            }
                            else {
                                IGSTPER = ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage;
                            }
                            //Cal Corection
                            SGSTAMT = 0;
                            CGSTAMT = 0;
                            IGSTAMT = parseFloat(Number(TaxAbleAmt) * Number(IGSTPER) / 100).toFixed(2);
                            TotalAmount = parseFloat(Number(IGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
                        }

                        ObjOrderDeliveryData[CreatePOGridRow].BasicAmount = BasicAmt;
                        ObjOrderDeliveryData[CreatePOGridRow].AfterDisAmt = afterDiscountAmt;
                        ObjOrderDeliveryData[CreatePOGridRow].TaxableAmount = TaxAbleAmt;
                        ObjOrderDeliveryData[CreatePOGridRow].CGSTAmt = CGSTAMT;
                        ObjOrderDeliveryData[CreatePOGridRow].SGSTAmt = SGSTAMT;
                        ObjOrderDeliveryData[CreatePOGridRow].IGSTAmt = IGSTAMT;
                        ObjOrderDeliveryData[CreatePOGridRow].TotalAmount = TotalAmount;
                        ObjOrderDeliveryData[CreatePOGridRow].PurchaseRate = PurchaseRate;
                    }
                }

                $("#DeliveryDetailGrid").dxDataGrid({
                    dataSource: ObjOrderDeliveryData
                });
            }
            else {
                $("#DeliveryDetailGrid").dxDataGrid({
                    dataSource: ObjOrderDeliveryData
                });
            }
        }
    });

    document.getElementById("BtnCreateInvoice").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreateInvoice").setAttribute("data-target", "#largeModal");
});

$("#BtnCreateDirectInvoice").click(function () {

    ObjOrderDeliveryData = [];
    ChargesGrid = [];
    IsDirectInvoice = true;
    $("#AdditionalChargesGrid").dxDataGrid({ dataSource: ChargesGrid });
    $("#DeliveryDetailGrid").dxDataGrid({ dataSource: [] });

    BlankField();
    $("#SelSalesLedger").dxSelectBox({ value: LoadSalesLedgerData[0].LedgerID });
    LblSupplierStateTin = LoadSalesLedgerData[0].StateTinNo;
    CreateNOTENO();
    DeliveryDetailGrid.option("editing.allowAdding", true);
    document.getElementById("BtnCreateDirectInvoice").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreateDirectInvoice").setAttribute("data-target", "#largeModal");
});

//Open AditionalCharges Grid
fillChargesGrid();

var CalculateOnLookup = [{ "ID": 1, "Name": "Value" }, { "ID": 2, "Name": "Quantity" }];

function fillChargesGrid() {
    var LName = [];
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/CHLname",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);

            var CHLname_RESS = JSON.parse(res);

            for (var z = 0; z < CHLname_RESS.length; z++) {
                var optLN = {};
                optLN.LedgerID = CHLname_RESS[z].LedgerID;
                optLN.LedgerName = CHLname_RESS[z].LedgerName;
                LName.push(optLN);
            }
            Var_ChargeHead = { 'LedgerDetail': CHLname_RESS };

            $("#SelLnameChargesGrid").dxSelectBox({
                items: LName,
                placeholder: "Choose Tax Ledger--",
                displayExpr: 'LedgerName',
                valueExpr: 'LedgerID',
                searchEnabled: true,
                showClearButton: true
            });
            var t = 0;
            var chGrid = {};
            $("#AdditionalChargesGrid").dxDataGrid({
                dataSource: ChargesGrid,
                columnAutoWidth: true,
                showBorders: true,
                showRowLines: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                height: function () {
                    return window.innerHeight / 4.5;
                },
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
                    // allowAdding: true,
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
                onEditingStart: function (e) {
                    if (e.data.InAmount === true || e.data.InAmount === 1) {
                        if (e.column.dataField === "ChargesAmount") {
                            e.cancel = false;
                        }
                    }
                    else {
                        if (e.column.dataField !== "ChargesAmount" && e.column.dataField !== "TaxType") {
                            e.cancel = false;
                        } else {
                            e.cancel = true;
                        }
                    }
                },
                onRowRemoved: function (e) {
                    AddItemCalculation();
                    GridColumnCal();
                    var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
                    CreatePOGrid.refresh();
                    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                    AdditionalChargesGrid.refresh();
                    ChargesGrid = [];
                    for (t = 0; t < AdditionalChargesGrid._options.dataSource.length; t++) {
                        chGrid = {};
                        chGrid.CalculateON = AdditionalChargesGrid._options.dataSource[t].CalculateON;
                        chGrid.ChargesAmount = AdditionalChargesGrid._options.dataSource[t].ChargesAmount;
                        chGrid.GSTApplicable = AdditionalChargesGrid._options.dataSource[t].GSTApplicable;
                        chGrid.GSTLedgerType = AdditionalChargesGrid._options.dataSource[t].GSTLedgerType;
                        chGrid.LedgerID = AdditionalChargesGrid._options.dataSource[t].LedgerID;
                        chGrid.LedgerName = AdditionalChargesGrid._options.dataSource[t].LedgerName;
                        chGrid.TaxRatePer = AdditionalChargesGrid._options.dataSource[t].TaxRatePer;
                        chGrid.TaxType = AdditionalChargesGrid._options.dataSource[t].TaxType;
                        chGrid.InAmount = AdditionalChargesGrid._options.dataSource[t].InAmount;
                        ChargesGrid.push(chGrid);
                    }
                    CalculateAmount();

                },
                onRowUpdated: function (CHGRID) {
                    AddItemCalculation();
                    GridColumnCal();
                    var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
                    CreatePOGrid.refresh();
                    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                    AdditionalChargesGrid.refresh();
                    ChargesGrid = [];
                    for (t = 0; t < AdditionalChargesGrid._options.dataSource.length; t++) {
                        chGrid = {};
                        chGrid.CalculateON = AdditionalChargesGrid._options.dataSource[t].CalculateON;
                        chGrid.ChargesAmount = AdditionalChargesGrid._options.dataSource[t].ChargesAmount;
                        chGrid.GSTApplicable = AdditionalChargesGrid._options.dataSource[t].GSTApplicable;
                        chGrid.GSTLedgerType = AdditionalChargesGrid._options.dataSource[t].GSTLedgerType;
                        chGrid.LedgerID = AdditionalChargesGrid._options.dataSource[t].LedgerID;
                        chGrid.LedgerName = AdditionalChargesGrid._options.dataSource[t].LedgerName;
                        chGrid.TaxRatePer = AdditionalChargesGrid._options.dataSource[t].TaxRatePer;
                        chGrid.TaxType = AdditionalChargesGrid._options.dataSource[t].TaxType;
                        chGrid.InAmount = AdditionalChargesGrid._options.dataSource[t].InAmount;
                        ChargesGrid.push(chGrid);
                    }
                    CalculateAmount();
                },
                columns: [
                    { dataField: "LedgerName", visible: true, caption: "Tax  Ledger", width: 150 },
                    { dataField: "TaxRatePer", visible: true, caption: "Tax %", width: 80 },
                    {
                        dataField: "CalculateON", visible: true, caption: "Calcu. ON", width: 80,
                        lookup: {
                            dataSource: CalculateOnLookup,
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
        }
    });
}

$("#BtnAddLedgerCharge").click(function () {
    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var rowCountAC = AdditionalChargesGrid._options.dataSource.length;

    var ChooseText = $("#SelLnameChargesGrid").dxSelectBox('instance').option('text');
    if (ChooseText === "" || ChooseText === "undefined" || ChooseText === null) {
        document.getElementById("SelLnameChargesGrid").style.borderColor = "#00DDD2";
        DevExpress.ui.notify("Please Choose Ledger Name..!", "warning", 1200);
        return;
    }
    var ChooseID = $("#SelLnameChargesGrid").dxSelectBox('instance').option('value');

    if (rowCountAC > 0) {
        for (var cl = 0; cl < rowCountAC; cl++) {
            if (ChooseID === AdditionalChargesGrid._options.dataSource[cl].LedgerID) {
                DevExpress.ui.notify("This Tax Ledger already exist.. please add another Tax ledger..!", "warning", 1200);
                return false;
            }
        }
    }

    if (document.getElementById("TxtAfterDisAmt").value === 0) {
        DevExpress.ui.notify("Please enter rate in above grid before add charges..!", "error", 1000);
        window.setTimeout(function () { e.component.cancelEditData(); }, 0);
    } else {
        var optCH = {};
        if (ChooseText !== "" && ChooseText !== undefined && ChooseText !== null) {
            var ObjChargeHead = Var_ChargeHead.LedgerDetail.filter(function (el) {
                return el.LedgerID === ChooseID;
            });

            optCH.LedgerName = ChooseText;
            optCH.LedgerID = ObjChargeHead[0].LedgerID;

            var gstapl = ObjChargeHead[0].GSTApplicable;
            if (gstapl === "True" || gstapl === true) {
                gstapl = true;
            } else {
                gstapl = false;
            }

            optCH.GSTApplicable = gstapl;
            optCH.TaxType = ObjChargeHead[0].TaxType;
            optCH.GSTLedgerType = ObjChargeHead[0].GSTLedgerType;
            optCH.CalculateON = ObjChargeHead[0].GSTCalculationOn;
            optCH.TaxRatePer = ObjChargeHead[0].TaxPercentage;
            optCH.InAmount = false;
            ChargesGrid.push(optCH);

            $("#AdditionalChargesGrid").dxDataGrid({
                dataSource: ChargesGrid
            });

            AddItemCalculation();
            GridColumnCal();
            CalculateAmount();
            var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
            CreatePOGrid.refresh();
            AdditionalChargesGrid.refresh();
        }
    }
});

function CalculateAmount() {
    var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var CreatePOGrid_RowCount = CreatePOGrid._options.dataSource.length;
    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    AdditionalChargesGrid.refresh();
    var Charge_RowCount = ChargesGrid.length;
    var t = 0;

    var NewAfterDisAmt = 0;
    if (CreatePOGrid_RowCount > 0) {
        for (t = 0; t < CreatePOGrid_RowCount; t++) {
            CreatePOGrid._options.dataSource[t].TaxableAmount = ObjOrderDeliveryData[t].AfterDisAmt;
            NewAfterDisAmt = Number(NewAfterDisAmt) + Number(ObjOrderDeliveryData[t].AfterDisAmt);
        }
    }

    document.getElementById("TxtAfterDisAmt").value = NewAfterDisAmt;
    var BasicAmt = 0, IGSTPER = 0, SGSTPER = 0, CGSTPER = 0;
    var TaxAbleAmt = 0, IGSTAMT = 0, SGSTAMT = 0, CGSTAMT = 0, TotalAmount = 0;

    var AfterDisAmt_WithGstApplicable = 0;
    var GridTaxType = "";
    var TaxRatePer = 0;
    var GSTLedgerType = "";
    var CalculateON = "Value";
    var taxAmt = 0;
    for (t = 0; t < CreatePOGrid_RowCount; t++) {
        TaxAbleAmt = 0;
        ObjOrderDeliveryData[t].TaxableAmount = ObjOrderDeliveryData[t].AfterDisAmt;
        for (var m = 0; m < Charge_RowCount; m++) {
            GridTaxType = ChargesGrid[m].TaxType;
            TaxRatePer = ChargesGrid[m].TaxRatePer;
            GSTLedgerType = ChargesGrid[m].GSTLedgerType;
            CalculateON = ChargesGrid[m].CalculateON;
            taxAmt = 0;
            if (GridTaxType.toString() !== "GST") {
                if (Number(TaxRatePer) === 0 && (ChargesGrid[m].InAmount === false || ChargesGrid[m].InAmount === "0" || ChargesGrid[m].InAmount === 0 || ChargesGrid[m].InAmount === "false")) {
                    ChargesGrid[m].InAmount = false;
                } else {
                    if (ChargesGrid[m].InAmount === false || ChargesGrid[m].InAmount === "0" || ChargesGrid[m].InAmount === 0 || ChargesGrid[m].InAmount === "false") {
                        ChargesGrid[m].ChargesAmount = (Number(document.getElementById("TxtAfterDisAmt").value) * TaxRatePer / 100).toFixed(2);
                    }
                }
                if (CalculateON.toUpperCase().trim() === "VALUE" && (ChargesGrid[m].GSTApplicable === true || ChargesGrid[m].GSTApplicable === "1" || ChargesGrid[m].GSTApplicable === 1 || ChargesGrid[m].GSTApplicable === "true")) {
                    TaxAbleAmt = Number(TaxAbleAmt) + (Number(ChargesGrid[m].ChargesAmount) / Number(document.getElementById("TxtAfterDisAmt").value) * Number(ObjOrderDeliveryData[t].AfterDisAmt)).toFixed(2);
                } else if (CalculateON.toUpperCase().trim() === "QUANTITY" && (ChargesGrid[m].GSTApplicable === true || ChargesGrid[m].GSTApplicable === "1" || ChargesGrid[m].GSTApplicable === 1 || ChargesGrid[m].GSTApplicable === "true")) {
                    TaxAbleAmt = Number(TaxAbleAmt) + (Number(ChargesGrid[m].ChargesAmount) / Number(document.getElementById("TxtTotalQty").value) * Number(ObjOrderDeliveryData[t].PurchaseQuantity)).toFixed(2);
                }
            }
        }
        ObjOrderDeliveryData[t].TaxableAmount = (Number(ObjOrderDeliveryData[t].AfterDisAmt) + Number(TaxAbleAmt)).toFixed(2);
        TaxAbleAmt = Number(ObjOrderDeliveryData[t].TaxableAmount);
        if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
            if (ObjOrderDeliveryData[t].CGSTTaxPercentage === "" || ObjOrderDeliveryData[t].CGSTTaxPercentage === undefined || ObjOrderDeliveryData[t].CGSTTaxPercentage === null || ObjOrderDeliveryData[t].CGSTTaxPercentage === "NULL") {
                CGSTPER = 0;
            }
            else {
                CGSTPER = ObjOrderDeliveryData[t].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
            }
            if (ObjOrderDeliveryData[t].SGSTTaxPercentage === "" || ObjOrderDeliveryData[t].SGSTTaxPercentage === undefined || ObjOrderDeliveryData[t].SGSTTaxPercentage === null || ObjOrderDeliveryData[t].SGSTTaxPercentage === "NULL") {
                SGSTPER = 0;
            }
            else {
                SGSTPER = ObjOrderDeliveryData[t].SGSTTaxPercentage;
            }
            SGSTAMT = Number(TaxAbleAmt) * Number(SGSTPER) / 100;
            CGSTAMT = Number(TaxAbleAmt) * Number(CGSTPER) / 100;
            TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt);
        }
        else {
            if (ObjOrderDeliveryData[t].IGSTTaxPercentage === "" || ObjOrderDeliveryData[t].IGSTTaxPercentage === undefined || ObjOrderDeliveryData[t].IGSTTaxPercentage === null || ObjOrderDeliveryData[t].IGSTTaxPercentage === "NULL") {
                IGSTPER = 0;
            }
            else {
                IGSTPER = ObjOrderDeliveryData[t].IGSTTaxPercentage;
            }

            IGSTAMT = Number(TaxAbleAmt) * Number(IGSTPER) / 100;
            TotalAmount = Number(IGSTAMT) + Number(TaxAbleAmt);
        }

        ObjOrderDeliveryData[t].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
        ObjOrderDeliveryData[t].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
        ObjOrderDeliveryData[t].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
    }

    for (t = 0; t < Charge_RowCount; t++) {
        GridTaxType = ChargesGrid[t].TaxType;
        TaxRatePer = ChargesGrid[t].TaxRatePer;
        GSTLedgerType = ChargesGrid[t].GSTLedgerType;
        CalculateON = ChargesGrid[t].CalculateON;
        taxAmt = 0;
        var FilterAmt = 0;
        if (GridTaxType === "GST") {
            var g = 0;
            if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "CENTRAL TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (g = 0; g < CreatePOGrid_RowCount; g++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === ObjOrderDeliveryData[g].CGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].CGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].CGSTAmt);
                        }

                    }
                }
                taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
            }
            else if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "STATE TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (g = 0; g < CreatePOGrid_RowCount; g++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === ObjOrderDeliveryData[g].SGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].SGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].SGSTAmt);
                        }
                    }
                }
                taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
            }
            else if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (g = 0; g < CreatePOGrid_RowCount; g++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === ObjOrderDeliveryData[g].IGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].IGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(ObjOrderDeliveryData[g].IGSTAmt);
                        }
                    }
                }
                taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
            }
            ChargesGrid[t].ChargesAmount = parseFloat(Number(taxAmt)).toFixed(2);
        }
    }

    AdditionalChargesGrid.refresh();
    for (var u = 0; u < AdditionalChargesGrid._options.dataSource.length; u++) {
        for (t = 0; t < ChargesGrid.length; t++) {
            if (ChargesGrid[t].LedgerID === AdditionalChargesGrid._options.dataSource[u].LedgerID) {
                AdditionalChargesGrid._options.dataSource[u].ChargesAmount = ChargesGrid[t].ChargesAmount;
                break;
            }
        }
    }
    AdditionalChargesGrid.refresh();
    GridColumnCal();
}

function AddItemCalculation() {

    var CreatePOGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var CreatePOGrid_RowCount = CreatePOGrid._options.dataSource.length;

    if (ObjOrderDeliveryData.length > 0) {
        if (CreatePOGrid_RowCount > 0) {
            for (var t = 0; t < CreatePOGrid_RowCount; t++) {
                CreatePOGrid._options.dataSource[t].TaxableAmount = ObjOrderDeliveryData[t].AfterDisAmt;
            }
        }

        for (var CreatePOGridRow = 0; CreatePOGridRow < ObjOrderDeliveryData.length; CreatePOGridRow++) {

            var PurchaseRate = ObjOrderDeliveryData[CreatePOGridRow].PurchaseRate;
            var PurchaseUnit = ObjOrderDeliveryData[CreatePOGridRow].PurchaseUnit;
            var Qty = ObjOrderDeliveryData[CreatePOGridRow].PurchaseQuantity;
            var DisPercentage = ObjOrderDeliveryData[CreatePOGridRow].Disc;

            if (Qty === "" || Qty === undefined || Qty === null || Qty === "NULL") {
                Qty = 0;
            }
            if (DisPercentage === "" || DisPercentage === undefined || DisPercentage === null || DisPercentage === "NULL") {
                DisPercentage = 0;
            }
            if (PurchaseRate === "" || PurchaseRate === undefined || PurchaseRate === null || PurchaseRate === "NULL") {
                PurchaseRate = 0;
            }

            var BasicAmt = 0;
            if (PurchaseUnit === "UnitThCost") {
                BasicAmt = parseFloat(Number(Qty) * Number(PurchaseRate) / 1000).toFixed(2);
            } else {
                BasicAmt = parseFloat(Number(Qty) * Number(PurchaseRate)).toFixed(2);
            }

            var DiscountAmt = parseFloat(Number(BasicAmt) * Number(DisPercentage) / 100).toFixed(2);

            var afterDiscountAmt = 0;
            afterDiscountAmt = parseFloat(Number(BasicAmt) - Number(DiscountAmt)).toFixed(2);
            var TaxAbleAmt = 0;
            TaxAbleAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);
            var CGSTPER = 0, SGSTPER = 0, IGSTPER = 0, CGSTAMT = 0, SGSTAMT = 0, IGSTAMT = 0, TotalAmount = 0;
            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                if (ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage === "NULL") {
                    CGSTPER = 0;
                }
                else {
                    CGSTPER = ObjOrderDeliveryData[CreatePOGridRow].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                }
                if (ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage === "NULL") {
                    SGSTPER = 0;
                }
                else {
                    SGSTPER = ObjOrderDeliveryData[CreatePOGridRow].SGSTTaxPercentage;
                }
                SGSTAMT = parseFloat(Number(TaxAbleAmt) * Number(SGSTPER) / 100).toFixed(2);
                CGSTAMT = parseFloat(Number(TaxAbleAmt) * Number(CGSTPER) / 100).toFixed(2);
                //Cal Corection
                IGSTAMT = 0;
                TotalAmount = parseFloat(Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
            }
            else {
                if (ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === "" || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === undefined || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === null || ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage === "NULL") {
                    IGSTPER = 0;
                }
                else {
                    IGSTPER = ObjOrderDeliveryData[CreatePOGridRow].IGSTTaxPercentage;
                }
                //Cal Corection
                SGSTAMT = 0;
                CGSTAMT = 0;
                IGSTAMT = parseFloat(Number(Number(TaxAbleAmt) * Number(IGSTPER) / 100)).toFixed(2);
                TotalAmount = parseFloat(Number(IGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
            }

            ObjOrderDeliveryData[CreatePOGridRow].BasicAmount = BasicAmt;
            ObjOrderDeliveryData[CreatePOGridRow].AfterDisAmt = afterDiscountAmt;
            ObjOrderDeliveryData[CreatePOGridRow].TaxableAmount = TaxAbleAmt;
            ObjOrderDeliveryData[CreatePOGridRow].CGSTAmt = CGSTAMT;
            ObjOrderDeliveryData[CreatePOGridRow].SGSTAmt = SGSTAMT;
            ObjOrderDeliveryData[CreatePOGridRow].IGSTAmt = IGSTAMT;
            ObjOrderDeliveryData[CreatePOGridRow].TotalAmount = TotalAmount;
            ObjOrderDeliveryData[CreatePOGridRow].PurchaseRate = PurchaseRate;
        }
    }
}

function GridColumnCal() {

    // var AddCHGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var dataGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var gridColBasicAmt = 0;
    var gridColTotalAmt = 0;
    var gridColCGSTAmt = 0;
    var gridColSGSTAmt = 0;
    var gridColIGSTAmt = 0;
    var gridAfterDisAmt = 0;
    var gridTaxAbleSum = 0;
    var gridColTotalQty = 0;
    var gridColTotalTax = 0;
    var gridColPurchaseQTY = 0;
    var TotalOtherTax = 0;

    for (var CH = 0; CH < ChargesGrid.length; CH++) {
        if (ChargesGrid[CH].LedgerName.includes("GST")) {
            gridColTotalTax = parseFloat(Number(gridColTotalTax) + Number(ChargesGrid[CH].ChargesAmount)).toFixed(2);
        } else {
            TotalOtherTax = parseFloat(TotalOtherTax + Number(ChargesGrid[CH].ChargesAmount)).toFixed(2);
        }
    }
    for (var cal = 0; cal < dataGrid._options.dataSource.length; cal++) {
        gridColBasicAmt = parseFloat(Number(gridColBasicAmt) + Number(dataGrid._options.dataSource[cal].BasicAmount)).toFixed(2);
        gridColTotalAmt = parseFloat(Number(gridColTotalAmt) + Number(dataGrid._options.dataSource[cal].TotalAmount)).toFixed(2);
        gridColTotalQty = parseFloat(Number(gridColTotalQty) + Number(dataGrid._options.dataSource[cal].PurchaseQuantity)).toFixed(2);

        gridColCGSTAmt = parseFloat(Number(gridColCGSTAmt) + Number(dataGrid._options.dataSource[cal].CGSTAmt)).toFixed(2);
        gridColSGSTAmt = parseFloat(Number(gridColSGSTAmt) + Number(dataGrid._options.dataSource[cal].SGSTAmt)).toFixed(2);
        gridColIGSTAmt = parseFloat(Number(gridColIGSTAmt) + Number(dataGrid._options.dataSource[cal].IGSTAmt)).toFixed(2);

        gridAfterDisAmt = parseFloat(Number(gridAfterDisAmt) + Number(dataGrid._options.dataSource[cal].AfterDisAmt)).toFixed(2);
        gridTaxAbleSum = parseFloat(Number(gridTaxAbleSum) + Number(dataGrid._options.dataSource[cal].TaxableAmount)).toFixed(2);
        gridColPurchaseQTY = parseFloat(Number(gridColPurchaseQTY) + Number(dataGrid._options.dataSource[cal].PurchaseQuantity)).toFixed(2);
    }

    document.getElementById("TxtBasicAmt").value = gridColBasicAmt;
    document.getElementById("TxtNetAmt").value = Math.round((Number(gridAfterDisAmt) + Number(gridColTotalTax) + Number(TotalOtherTax)).toFixed(2));

    document.getElementById("TxtTotalQty").value = gridColTotalQty;

    document.getElementById("TxtCGSTAmt").value = gridColCGSTAmt;
    document.getElementById("TxtSGSTAmt").value = gridColSGSTAmt;
    document.getElementById("TxtIGSTAmt").value = gridColIGSTAmt;

    document.getElementById("TxtAfterDisAmt").value = gridAfterDisAmt;
    document.getElementById("Txt_TaxAbleSum").value = gridTaxAbleSum;

    document.getElementById("TxtTotalTax").value = parseFloat(Number(gridColTotalTax)).toFixed(2);
    //document.getElementById("TxtRoundTaxAmt").value = parseFloat((Number(document.getElementById("TxtNetAmt").value) - (gridColTotalTax) + Number(gridColTotalTax))).toFixed(2);
    document.getElementById("TxtRoundTaxAmt").value = parseFloat(Number(document.getElementById("TxtNetAmt").value) - Number(gridColTotalTax) - Number(TotalOtherTax) - Number(gridColBasicAmt)).toFixed(2);
    document.getElementById("TxtTotalDispatchedQty").value = parseFloat(Number(gridColPurchaseQTY)).toFixed(2);
}

//Close AditionalCharges Grid

$("#MinBtn").click(function () {
    MinMaxBtnStatus = "Min";
    document.getElementById("ExtraDetailDiv").style.display = "none";
    document.getElementById("gridCHDList").style.height = "calc(100vh - 95px)";
    document.getElementById("MinBtn").style.display = "none";
    document.getElementById("MaxBtn").style.display = "block";
    document.getElementById("tooltipspan").innerHTML = "Click me to show finish goods detail..";
});

$("#MaxBtn").click(function () {
    MinMaxBtnStatus = "Max";
    document.getElementById("gridCHDList").style.height = "calc(100vh - 340px)";
    document.getElementById("ExtraDetailDiv").style.display = "block";
    document.getElementById("MinBtn").style.display = "block";
    document.getElementById("MaxBtn").style.display = "none";
    document.getElementById("tooltipspan").innerHTML = "Click me to hide finish goods detail..";
});

// Data Insertion Or Manupulate 
$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnSave").click(function () {

    var TxtInvoceTransactionID = document.getElementById("TxtCHDID").value;
    var VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
    var TxtClientID = $("#TxtClientID").dxSelectBox('instance').option('value');
    var TxtConsigneeID = $("#TxtConsigneeID").dxSelectBox('instance').option('value');

    var TxtBasicAmt = Number(document.getElementById("TxtBasicAmt").value);
    var TxtTotalTax = Number(document.getElementById("TxtTotalTax").value);
    var TxtRoundTaxAmt = Number(document.getElementById("TxtRoundTaxAmt").value);
    var TxtNetAmt = Number(document.getElementById("TxtNetAmt").value);
    var TxtTotalDispatchedQty = Number(document.getElementById("TxtTotalDispatchedQty").value);
    var TxtCGSTAmt = Number(document.getElementById("TxtCGSTAmt").value);
    var TxtSGSTAmt = Number(document.getElementById("TxtSGSTAmt").value);
    var TxtIGSTAmt = Number(document.getElementById("TxtIGSTAmt").value);
    var TxtAfterDisAmt = Number(document.getElementById("TxtAfterDisAmt").value);
    var Txt_TaxAbleSum = Number(document.getElementById("Txt_TaxAbleSum").value);
    var SelSalesLedger = $("#SelSalesLedger").dxSelectBox('instance').option('value');
    var TxtRemark = document.getElementById("TxtRemark").value;

    var SelDocumentType = $("#SelDocumentType").dxSelectBox('instance').option('value');
    var SelIsExport = $("#SelIsExport").dxSelectBox('instance').option('value');
    var SelCurrencyCode = $("#SelCurrencyType").dxSelectBox('instance').option('value');
    var SelShippedFrom = $("#SelShippedFrom").dxSelectBox('instance').option('value');
    var OptShippedLedgerType = $("#OptShippedLedgerType").dxRadioGroup('instance').option('value');
    var SelShippedLedgerID = $("#SelShippedFromLedger").dxSelectBox('instance').option('value');
    var SelIGSTOnIntra = $("#SelIGSTOnIntra").dxSelectBox('instance').option('value');
    var SelReverseCharge = $("#SelReverseCharge").dxSelectBox('instance').option('value');
    var SelECommerce = $("#SelECommerce").dxSelectBox('instance').option('value');
    var SelECommerceLedgerID = $("#SelECommerceLegalName").dxSelectBox('instance').option('value');
    var SelOriginCountry = $("#SelOriginCountry").dxSelectBox('instance').option('value');
    var SelDestinationCountry = $("#SelDestinationCountry").dxSelectBox('instance').option('value');
    var SelNotifyParty1 = $("#SelNotifyParty1").dxSelectBox('instance').option('value');
    var SelNotifyParty2 = $("#SelNotifyParty2").dxSelectBox('instance').option('value');
    var SelLoadingPort = $("#SelLoadingPort").dxSelectBox('instance').option('value');
    var SelDischargePort = $("#SelDischargePort").dxSelectBox('instance').option('value');
    var SelBankerID = $("#SelBanker").dxSelectBox('instance').option('value');
    var DTEWayBillDate = $("#DTEWayBillDate").dxDateBox('instance').option('value');
    var SelTransporterID = $("#SelTransporter").dxSelectBox('instance').option('value');

    var TxtEPCGLicenceNo = document.getElementById("TxtEPCGLicenceNo").value;
    var TxtREXRegistrationNo = document.getElementById("TxtREXRegistrationNo").value;
    var TxtDeliveryTerms = document.getElementById("TxtDeliveryTerms").value;
    var TxtPaymentTerms = document.getElementById("TxtPaymentTerms").value;
    var TxtNetWeight = Number(document.getElementById("TxtNetWeight").value);
    var TxtGrossWeight = Number(document.getElementById("TxtGrossWeight").value);
    var TxtOtherRemarks = document.getElementById("TxtOtherRemarks").value;
    var TxtInvoiceReferenceNo = document.getElementById("TxtInvoiceReferenceNo").value;
    var TxtContainerDescription = document.getElementById("TxtContainerDescription").value;
    var TxtDBKRemarks = document.getElementById("TxtDBKRemarks").value;
    var TxtEWayBillNumber = document.getElementById("TxtEWayBillNumber").value;
    var TxtVehicleNo = document.getElementById("TxtVehicleNo").value;

    var DeliveryDetailGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var DeliveryDetailGridRow = DeliveryDetailGrid._options.dataSource.length;

    if (SelSalesLedger === "" || SelSalesLedger === null || SelSalesLedger === undefined || SelSalesLedger === "null") {
        DevExpress.ui.notify("Please choose sales ledger..!", "error", 2000);
        document.getElementById("SelSalesLedger").style.borderColor = "red";
        $("#SelSalesLedger").dxValidator('instance').validate();
        return false;
    }
    else {
        document.getElementById("SelSalesLedger").style.borderColor = "";
    }

    if (SelDocumentType === "" || SelDocumentType === null) {
        DevExpress.ui.notify("Please select document type..!", "warning", 2000);
        $("#SelDocumentType").dxValidator('instance').validate();
        return false;
    }

    if (SelIsExport === "" || SelIsExport === null) {
        DevExpress.ui.notify("Please choose Is Export or Not..!", "warning", 2000);
        $("#SelIsExport").dxValidator('instance').validate();
        return false;
    }

    if (SelCurrencyCode === "" || SelCurrencyCode === null) {
        DevExpress.ui.notify("Please select currency code..!", "warning", 2000);
        $("#SelCurrencyCode").dxValidator('instance').validate();
        return false;
    }

    if (TxtClientID === 0 || TxtClientID === null) {
        DevExpress.ui.notify("Please select client..!", "warning", 2000);
        $("#TxtClientID").dxValidator('instance').validate();
        return false;
    }

    if (TxtConsigneeID === 0 || TxtConsigneeID === null) {
        DevExpress.ui.notify("Please select Consignee..!", "warning", 2000);
        $("#TxtConsigneeID").dxValidator('instance').validate();
        return false;
    }

    if (DeliveryDetailGridRow < 1) {
        DevExpress.ui.notify("Please add total carton.!", "warning", 2000);
        return false;
    }

    var DespQty = 0;
    for (var a = 0; a < DeliveryDetailGridRow; a++) {
        DespQty = Number(DespQty) + Number(DeliveryDetailGrid._options.dataSource[a].PurchaseQuantity);
    }

    var jsonObjectsInvoicemain = [];
    var OperationInvoicemain = {};

    var jsonObjectsInvoiceDetyail = [];
    var OperationInvoiceDetyail = {};

    OperationInvoicemain.VoucherDate = VoucherDate;
    OperationInvoicemain.LedgerID = TxtClientID;
    OperationInvoicemain.ConsigneeLedgerID = TxtConsigneeID;
    OperationInvoicemain.TotalQuantity = DespQty;
    OperationInvoicemain.TotalBasicAmount = TxtBasicAmt;
    OperationInvoicemain.TotalDiscountAmount = Number(TxtBasicAmt) - Number(TxtAfterDisAmt);

    if (TxtCGSTAmt === "" || TxtCGSTAmt === undefined || isNaN(TxtCGSTAmt)) {
        TxtCGSTAmt = 0;
    }
    if (TxtSGSTAmt === "" || TxtSGSTAmt === undefined || isNaN(TxtSGSTAmt)) {
        TxtSGSTAmt = 0;
    }
    if (TxtIGSTAmt === "" || TxtIGSTAmt === undefined || isNaN(TxtIGSTAmt)) {
        TxtIGSTAmt = 0;
    }
    if (TxtTotalTax === "" || TxtTotalTax === undefined || isNaN(TxtTotalTax)) {
        TxtTotalTax = 0;
    }
    if (TxtNetAmt === "" || TxtNetAmt === undefined || isNaN(TxtNetAmt)) {
        TxtNetAmt = 0;
    }

    OperationInvoicemain.TotalCGSTTaxAmount = parseFloat(TxtCGSTAmt).toFixed(2);
    OperationInvoicemain.TotalSGSTTaxAmount = parseFloat(TxtSGSTAmt).toFixed(2);
    OperationInvoicemain.TotalIGSTTaxAmount = parseFloat(TxtIGSTAmt).toFixed(2);
    OperationInvoicemain.TotalTaxAmount = parseFloat(TxtTotalTax).toFixed(2);
    OperationInvoicemain.NetAmount = parseFloat(TxtNetAmt).toFixed(2);
    OperationInvoicemain.Narration = TxtRemark;
    OperationInvoicemain.SalesLedgerID = SelSalesLedger;
    OperationInvoicemain.IsDirectInvoice = IsDirectInvoice;
    OperationInvoicemain.RoundOffTax = parseFloat(TxtRoundTaxAmt).toFixed(2);
    /////New Fields Invoice ///////

    OperationInvoicemain.DocumentType = SelDocumentType;
    OperationInvoicemain.IsExport = SelIsExport;
    OperationInvoicemain.CurrencyCode = SelCurrencyCode;
    OperationInvoicemain.ShippedFrom = SelShippedFrom;
    OperationInvoicemain.ShippedLedgerType = OptShippedLedgerType;
    OperationInvoicemain.ShippedLedgerID = SelShippedLedgerID;
    OperationInvoicemain.IGSTOnIntra = SelIGSTOnIntra;
    OperationInvoicemain.ReverseCharge = SelReverseCharge;
    OperationInvoicemain.ECommerce = SelECommerce;
    OperationInvoicemain.ECommerceLedgerID = SelECommerceLedgerID;
    OperationInvoicemain.OriginCountry = SelOriginCountry;
    OperationInvoicemain.DestinationCountry = SelDestinationCountry;
    OperationInvoicemain.NotifyParty1 = SelNotifyParty1;
    OperationInvoicemain.NotifyParty2 = SelNotifyParty2;
    OperationInvoicemain.LoadingPort = SelLoadingPort;
    OperationInvoicemain.DischargePort = SelDischargePort;
    OperationInvoicemain.BankerID = SelBankerID;
    OperationInvoicemain.EWayBillDate = DTEWayBillDate;
    OperationInvoicemain.TransporterID = SelTransporterID;
    OperationInvoicemain.VehicleNo = TxtVehicleNo;

    OperationInvoicemain.EPCGLicenceNo = TxtEPCGLicenceNo;
    OperationInvoicemain.REXRegistrationNo = TxtREXRegistrationNo;
    OperationInvoicemain.DeliveryTerms = TxtDeliveryTerms;
    OperationInvoicemain.PaymentTerms = TxtPaymentTerms;
    OperationInvoicemain.NetWeight = TxtNetWeight;
    OperationInvoicemain.GrossWeight = TxtGrossWeight;
    OperationInvoicemain.OtherRemarks = TxtOtherRemarks;
    OperationInvoicemain.InvoiceReferenceNo = TxtInvoiceReferenceNo;
    OperationInvoicemain.ContainerDescription = TxtContainerDescription;
    OperationInvoicemain.DBKRemarks = TxtDBKRemarks;
    OperationInvoicemain.EWayBillNumber = TxtEWayBillNumber;
    ///End

    jsonObjectsInvoicemain.push(OperationInvoicemain);

    for (var h = 0; h < DeliveryDetailGridRow; h++) {
        OperationInvoiceDetyail = {};
        OperationInvoiceDetyail.TransID = h + 1;
        OperationInvoiceDetyail.FGTransactionID = DeliveryDetailGrid._options.dataSource[h].FGTransactionID;
        OperationInvoiceDetyail.JobBookingID = DeliveryDetailGrid._options.dataSource[h].DeliveryJobBookingID;
        OperationInvoiceDetyail.JobBookingJobCardContentsID = DeliveryDetailGrid._options.dataSource[h].DeliveryJobBookingJobCardContentsID;
        OperationInvoiceDetyail.ProductMasterID = DeliveryDetailGrid._options.dataSource[h].ProductMasterID;
        OperationInvoiceDetyail.BookingID = 0;
        OperationInvoiceDetyail.OrderBookingID = DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingID;
        OperationInvoiceDetyail.OrderBookingDetailsID = DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingDetailsID;
        OperationInvoiceDetyail.JobName = DeliveryDetailGrid._options.dataSource[h].JobName;
        OperationInvoiceDetyail.Quantity = DeliveryDetailGrid._options.dataSource[h].PurchaseQuantity;
        OperationInvoiceDetyail.RateType = DeliveryDetailGrid._options.dataSource[h].PurchaseUnit;
        var Rate = 0.00;
        Rate = DeliveryDetailGrid._options.dataSource[h].PurchaseRate;
        OperationInvoiceDetyail.Rate = Rate;
        OperationInvoiceDetyail.GrossAmount = DeliveryDetailGrid._options.dataSource[h].TotalAmount;
        OperationInvoiceDetyail.DiscountPercentage = DeliveryDetailGrid._options.dataSource[h].Disc;
        OperationInvoiceDetyail.DiscountAmount = (Number(DeliveryDetailGrid._options.dataSource[h].BasicAmount) - Number(DeliveryDetailGrid._options.dataSource[h].AfterDisAmt)).toFixed(2);
        OperationInvoiceDetyail.BasicAmount = parseFloat(DeliveryDetailGrid._options.dataSource[h].BasicAmount).toFixed(2);
        OperationInvoiceDetyail.TaxableAmount = parseFloat(DeliveryDetailGrid._options.dataSource[h].TaxableAmount).toFixed(2);
        OperationInvoiceDetyail.GSTPercentage = DeliveryDetailGrid._options.dataSource[h].GSTTaxPercentage;
        OperationInvoiceDetyail.CGSTPercentage = DeliveryDetailGrid._options.dataSource[h].CGSTTaxPercentage;
        OperationInvoiceDetyail.SGSTPercentage = DeliveryDetailGrid._options.dataSource[h].SGSTTaxPercentage;
        OperationInvoiceDetyail.IGSTPercentage = DeliveryDetailGrid._options.dataSource[h].IGSTTaxPercentage;
        OperationInvoiceDetyail.CGSTAmount = parseFloat(DeliveryDetailGrid._options.dataSource[h].CGSTAmt).toFixed(2);
        OperationInvoiceDetyail.SGSTAmount = parseFloat(DeliveryDetailGrid._options.dataSource[h].SGSTAmt).toFixed(2);
        OperationInvoiceDetyail.IGSTAmount = parseFloat(DeliveryDetailGrid._options.dataSource[h].IGSTAmt).toFixed(2);
        OperationInvoiceDetyail.NetAmount = DeliveryDetailGrid._options.dataSource[h].TotalAmount;
        OperationInvoiceDetyail.ProductNarration = TxtRemark;
        OperationInvoiceDetyail.ProductMasterID = DeliveryDetailGrid._options.dataSource[h].ProductMasterID;
        OperationInvoiceDetyail.ProductHSNID = DeliveryDetailGrid._options.dataSource[h].ProductHSNID;

        jsonObjectsInvoiceDetyail.push(OperationInvoiceDetyail);
    }

    var jsonObjectsRecordTax = [];
    var OperationRecordTax = {};

    for (var ch = 0; ch < ChargesGrid.length; ch++) {
        OperationRecordTax = {};
        OperationRecordTax.TransID = ch + 1;
        OperationRecordTax.LedgerID = ChargesGrid[ch].LedgerID;
        OperationRecordTax.TaxPercentage = ChargesGrid[ch].TaxRatePer;
        OperationRecordTax.Amount = Number(ChargesGrid[ch].ChargesAmount).toFixed(2);
        OperationRecordTax.TaxInAmount = ChargesGrid[ch].InAmount;
        OperationRecordTax.IsComulative = ChargesGrid[ch].IsCumulative;
        OperationRecordTax.GSTApplicable = ChargesGrid[ch].GSTApplicable;
        OperationRecordTax.CalculatedON = ChargesGrid[ch].CalculateON;

        jsonObjectsRecordTax.push(OperationRecordTax);
    }

    jsonObjectsInvoicemain = JSON.stringify(jsonObjectsInvoicemain);
    jsonObjectsInvoiceDetyail = JSON.stringify(jsonObjectsInvoiceDetyail);
    jsonObjectsRecordTax = JSON.stringify(jsonObjectsRecordTax);

    var CurrencyCode = "";

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
            if (GblStatus === "Update") {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    type: "POST",
                    url: "WebService_InvoiceEntry.asmx/UpdateInvoice",
                    data: '{TxtInvoceTransactionID:' + JSON.stringify(document.getElementById("TxtCHDID").value) + ',jsonObjectsInvoicemain:' + jsonObjectsInvoicemain + ',jsonObjectsInvoiceDetyail:' + jsonObjectsInvoiceDetyail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        } else if (res.includes("not authorized")) {
                            swal("Access Denied..!", res, "error");
                        } else if (res.includes("Error:")) {
                            swal("Error..!", res, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
            else {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

                $.ajax({
                    type: "POST",
                    url: "WebService_InvoiceEntry.asmx/SaveInvoiceDetail",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsInvoicemain:' + jsonObjectsInvoicemain + ',jsonObjectsInvoiceDetyail:' + jsonObjectsInvoiceDetyail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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
                            swal("Saved!", "Your data saved", "success");
                            location.reload();
                        } else if (res.includes("not authorized")) {
                            swal("Access Denied..!", res, "error");
                        } else if (res.includes("Error:")) {
                            swal("Error..!", res, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            }
        });

});

$("#EditCHButton").click(function () {
    var TxtPOID = document.getElementById("TxtCHDID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        swal("", "Please select any record to edit or view..!", "warning");
        return false;
    }
    if (IsInvoiceApproved === true) {
        DevExpress.ui.notify("Invoice is approved you can't edit invoice..!", "warning", 1500);
    }
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    document.getElementById("BtnDeletePopUp").disabled = false;
    GblStatus = "Update";

    BlankField();

    document.getElementById("TxtDelNote").value = GetProcessSelectedListData[0].InvoiceNo;
    $("#VoucherDate").dxDateBox({ value: GetProcessSelectedListData[0].InvoiceDate });
    $("#TxtClientID").dxSelectBox({ value: GetProcessSelectedListData[0].LedgerID });
    $("#SelSalesLedger").dxSelectBox({ value: GetProcessSelectedListData[0].SalesLedgerID });

    LblSupplierStateTin = GetProcessSelectedListData[0].StateTinNo;

    document.getElementById("TxtBasicAmt").value = GetProcessSelectedListData[0].TotalBasicAmount;
    document.getElementById("TxtTotalTax").value = GetProcessSelectedListData[0].TotalTaxAmount;
    document.getElementById("TxtRoundTaxAmt").value = Number(Number(GetProcessSelectedListData[0].NetAmount) - Number(GetProcessSelectedListData[0].TotalTaxAmount) - Number(GetProcessSelectedListData[0].TotalBasicAmount)).toFixed(2);
    document.getElementById("TxtNetAmt").value = GetProcessSelectedListData[0].NetAmount;
    document.getElementById("TxtTotalDispatchedQty").value = GetProcessSelectedListData[0].TotalQuantity;
    document.getElementById("TxtRemark").value = GetProcessSelectedListData[0].Narration;

    ////New Invoice Fields

    $("#SelDocumentType").dxSelectBox({ value: GetProcessSelectedListData[0].DocumentType });
    $("#SelIsExport").dxSelectBox({ value: GetProcessSelectedListData[0].IsExport });
    $("#SelCurrencyType").dxSelectBox({ value: GetProcessSelectedListData[0].CurrencyCode });
    $("#SelShippedFrom").dxSelectBox({ value: GetProcessSelectedListData[0].ShippedFrom });
    $("#OptShippedLedgerType").dxRadioGroup({ value: GetProcessSelectedListData[0].ShippedLedgerType });
    $("#SelShippedFromLedger").dxSelectBox({ value: GetProcessSelectedListData[0].ShippedLedgerID });
    $("#SelIGSTOnIntra").dxSelectBox({ value: GetProcessSelectedListData[0].IGSTOnIntra });
    $("#SelReverseCharge").dxSelectBox({ value: GetProcessSelectedListData[0].ReverseCharge });
    $("#SelECommerce").dxSelectBox({ value: GetProcessSelectedListData[0].ECommerce });
    $("#SelECommerceLegalName").dxSelectBox({ value: GetProcessSelectedListData[0].ECommerceLedgerID });
    $("#SelOriginCountry").dxSelectBox({ value: GetProcessSelectedListData[0].OriginCountry });
    $("#SelDestinationCountry").dxSelectBox({ value: GetProcessSelectedListData[0].DestinationCountry });
    $("#SelNotifyParty1").dxSelectBox({ value: GetProcessSelectedListData[0].NotifyParty1 });
    $("#SelNotifyParty2").dxSelectBox({ value: GetProcessSelectedListData[0].NotifyParty2 });
    $("#SelLoadingPort").dxSelectBox({ value: GetProcessSelectedListData[0].LoadingPort });
    $("#SelDischargePort").dxSelectBox({ value: GetProcessSelectedListData[0].DischargePort });
    $("#SelBanker").dxSelectBox({ value: GetProcessSelectedListData[0].BankerID });
    $("#DTEWayBillDate").dxDateBox({ value: GetProcessSelectedListData[0].EWayBillDate });
    $("#SelTransporter").dxSelectBox({ value: GetProcessSelectedListData[0].TransporterID });

    document.getElementById("TxtEPCGLicenceNo").value = GetProcessSelectedListData[0].EPCGLicenceNo;
    document.getElementById("TxtREXRegistrationNo").value = GetProcessSelectedListData[0].REXRegistrationNo;
    document.getElementById("TxtDeliveryTerms").value = GetProcessSelectedListData[0].DeliveryTerms;
    document.getElementById("TxtPaymentTerms").value = GetProcessSelectedListData[0].PaymentTerms;
    document.getElementById("TxtNetWeight").value = GetProcessSelectedListData[0].NetWeight;
    document.getElementById("TxtGrossWeight").value = GetProcessSelectedListData[0].GrossWeight;
    document.getElementById("TxtOtherRemarks").value = GetProcessSelectedListData[0].OtherRemarks;
    document.getElementById("TxtInvoiceReferenceNo").value = GetProcessSelectedListData[0].InvoiceReferenceNo;
    document.getElementById("TxtContainerDescription").value = GetProcessSelectedListData[0].ContainerDescription;
    document.getElementById("TxtDBKRemarks").value = GetProcessSelectedListData[0].DBKRemarks;
    document.getElementById("TxtEWayBillNumber").value = GetProcessSelectedListData[0].EWayBillNumber;
    document.getElementById("TxtVehicleNo").value = GetProcessSelectedListData[0].VehicleNo;

    //////

    $.ajax({
        type: "POST",
        async: false,
        url: "WebService_InvoiceEntry.asmx/GetDataAfterEdit_ChargesGrid",
        data: '{TxtCHDID:' + JSON.stringify(document.getElementById("TxtCHDID").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var GetDataChargesGrid = JSON.parse(res);

            ChargesGrid = GetDataChargesGrid;
            $("#AdditionalChargesGrid").dxDataGrid({
                dataSource: ChargesGrid
            });
        }
    });

    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/GetDataAfterEdit",
        data: '{TxtCHDID:' + JSON.stringify(document.getElementById("TxtCHDID").value) + ',DirectInvoice:' + JSON.stringify(IsDirectInvoice) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var GetDataAfterEdit = JSON.parse(res);

            ObjOrderDeliveryData = GetDataAfterEdit;
            $("#DeliveryDetailGrid").dxDataGrid({
                dataSource: ObjOrderDeliveryData
            });
        }
    });

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

    document.getElementById("EditCHButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditCHButton").setAttribute("data-target", "#largeModal");
});

$("#DeleteCHButton").click(function () {
    var TxtPOID = document.getElementById("TxtCHDID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        swal("", "Please select any record to delete..!", "warning");
        return false;
    }

    swal({
        title: "Are you sure to delete this transaction..?",
        text: 'You will not be able to recover this invoice..!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: "POST",
                url: "WebService_InvoiceEntry.asmx/DeleteInvoice",
                data: '{TxtPOID:' + JSON.stringify(TxtPOID) + '}',
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
                        swal("Deleted!", "Your invoice data deleted successfully..", "success");
                        location.reload();
                    } else if (res.includes("not authorized")) {
                        swal("Access Denied..!", res, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });
        });
});

$("#BtnPrint").click(function () {
    var TxtPOID = Number(document.getElementById("TxtCHDID").value);
    if (TxtPOID <= 0) return;
    if (IsInvoiceApproved === false) {
        swal("Invoice Not Approved", "Invoice is not approved you can't print invoice..!", "warning");
        return false;
    }
    var url = "PrintInvoice.aspx?TransactionID=" + TxtPOID + "&IsDircetInvoice=" + IsDirectInvoice;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteCHButton").click();
});

function BlankField() {
    //  document.getElementById("TxtCHDID").value = "";
    document.getElementById("TxtDelNote").value = "";
    $("#VoucherDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#TxtClientID").dxSelectBox({ value: null });
    $("#TxtConsigneeID").dxSelectBox({ value: null });
    $("#SelSalesLedger").dxSelectBox({ value: null });

    document.getElementById("TxtClientState").value = "";
    document.getElementById("TxtMailingName").value = "";
    document.getElementById("TxtConsigneeState").value = "";

    document.getElementById("TxtDestination").value = "";
    document.getElementById("TxtBasicAmt").value = "";
    document.getElementById("TxtTotalTax").value = "";
    document.getElementById("TxtRoundTaxAmt").value = "";
    document.getElementById("TxtNetAmt").value = "";
    document.getElementById("TxtTotalDispatchedQty").value = "";
    document.getElementById("TxtCGSTAmt").value = "";
    document.getElementById("TxtSGSTAmt").value = "";
    document.getElementById("TxtIGSTAmt").value = "";
    document.getElementById("TxtAfterDisAmt").value = "";
    document.getElementById("Txt_TaxAbleSum").value = "";
    document.getElementById("TxtRemark").value = "";
}

function GetConsignee(CID) {
    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/GetConsigneeData",
        data: '{ClientID:' + CID + '}',//
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
            $("#TxtConsigneeID").dxSelectBox({
                items: RES1
            });
            if (GetProcessSelectedListData.length > 0) {
                $("#TxtConsigneeID").dxSelectBox({ value: GetProcessSelectedListData[0].ConsigneeLedgerID });
            } else if (GetSelectedListData.length > 0) {
                $("#TxtConsigneeID").dxSelectBox({ value: GetSelectedListData[0].ConsigneeLedgerID });
            } else {
                $("#TxtConsigneeID").dxSelectBox({ value: null });
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}

function RefreshShippedFrom(value) {
    $.ajax({
        type: "POST",
        url: "WebService_InvoiceEntry.asmx/GetShippedFromLedger",
        data: '{value:' + JSON.stringify(value) + '}',//
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
            $("#SelShippedFromLedger").dxSelectBox({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}

$("#BtnGenerateJSON").click(function () {
    var obj = [{
        Version: "1.1",
        TranDtls: {
            "TaxSch": "GST",
            "SupTyp": "B2B",
            "IgstOnIntra": "N",
            "RegRev": null,
            "EcmGstin": null
        },
        DocDtls: {
            "Typ": "INV",
            "No": "LALITAS37",
            "Dt": "11/08/2020"
        },
        SellerDtls: {
            "Gstin": "29BZNPM9430M1LK",
            "LglNm": "KAVYA",
            "TrdNm": null,
            "Addr1": "ADDRESS1",
            "Addr2": null,
            "Loc": "BANGALORE",
            "Pin": 560090,
            "Stcd": "29",
            "Ph": null,
            "Em": null
        },
        BuyerDtls: {
            "Gstin": "29BTNPK6274K1ZK",
            "LglNm": "legalname",
            "TrdNm": null,
            "Pos": "29",
            "Addr1": "addres",
            "Addr2": null,
            "Loc": "banglre",
            "Pin": 560024,
            "Stcd": "29",
            "Ph": null,
            "Em": null
        },
        DispDtls: null,
        ShipDtls: null,
        ValDtls: {
            "AssVal": 216.4,
            "IgstVal": 0,
            "CgstVal": 0,
            "SgstVal": 0,
            "CesVal": 0,
            "StCesVal": 0,
            "Discount": 0,
            "OthChrg": 0,
            "RndOffAmt": 0,
            "TotInvVal": 216.4,
            "TotInvValFc": 0
        },
        ExpDtls: {
            "ShipBNo": "1234",
            "ShipBDt": "29/07/2020",
            "Port": "innrp6",
            "RefClm": "Y",
            "ForCur": "aed",
            "CntCode": "ad",
            "ExpDuty": 0
        },
        EwbDtls: {
            "TransId": "29btnpk6274k1zv",
            "TransName": "jjjj",
            "TransMode": "1",
            "Distance": 32,
            "TransDocNo": "223",
            "TransDocDt": "11/08/2020",
            "VehNo": "abc1234",
            "VehType": "R"
        },
        PayDtls: {
            "Nm": "KAVYA",
            "AccDet": "1234567890123",
            "Mode": "Cash",
            "FinInsBr": "SBI",
            "PayTerm": "CREDIT",
            "PayInstr": "FDGD",
            "CrTrn": "Credit Transfer",
            "DirDr": "direct debit",
            "CrDay": 30,
            "PaidAmt": 3243,
            "PaymtDue": 345
        },
        RefDtls: {
            "InvRm": "sdsfsf",
            "DocPerdDtls": {
                "InvStDt": "01/08/2020",
                "InvEndDt": "01/08/2020"
            },
            "PrecDocDtls": [
                {
                    "InvNo": "11113",
                    "InvDt": "01/08/2020",
                    "OthRefNo": "lklkjkl"
                }
            ],
            "ContrDtls": [
                {
                    "RecAdvRefr": "1233654",
                    "RecAdvDt": "01/08/2020",
                    "TendRefr": "545545",
                    "ContrRefr": "658987",
                    "ExtRefr": "2563",
                    "ProjRefr": "456jih",
                    "PORefr": "gjhjj35j",
                    "PORefDt": "01/08/2020"
                }
            ]
        },
        AddlDocDtls: [
            {
                "Url": "https://einv-apisandbox.nic.in/einv_web_test/Invoice/BulkUpload",
                "Docs": "FGFD",
                "Info": "FFGFD"
            }
        ],
        "ItemList": [{
            "SlNo": "1",
            "PrdDesc": null,
            "IsServc": "N",
            "HsnCd": "1001",
            "Barcde": null,
            "Qty": 2.5,
            "FreeQty": 0,
            "Unit": "BAG",
            "UnitPrice": 86.56,
            "TotAmt": 216.4,
            "Discount": 0,
            "PreTaxVal": 0,
            "AssAmt": 216.4,
            "GstRt": 0,
            "IgstAmt": 0,
            "CgstAmt": 0,
            "SgstAmt": 0,
            "CesRt": 0,
            "CesAmt": 0,
            "CesNonAdvlAmt": 0,
            "StateCesRt": 0,
            "StateCesAmt": 0,
            "StateCesNonAdvlAmt": 0,
            "OthChrg": 0,
            "TotItemVal": 216.4,
            "OrdLineRef": null,
            "OrgCntry": null,
            "PrdSlNo": null,
            "BchDtls": null,
            "AttribDtls": [{
                "Nm": null,
                "Val": null
            }
            ]
        }
        ]
    }];

    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

    this.href = 'data:' + data;
    this.download = 'data.json';
});