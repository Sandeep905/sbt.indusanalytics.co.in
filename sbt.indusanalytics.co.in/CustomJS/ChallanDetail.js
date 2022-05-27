"use strict";
var NoteNo = "";
var GblStatus = "";
var RadioValue = "Pending";
var GetSelectedListData = [], GetProcessSelectedListData = [];
var supplieridvalidate = "";
var otherDetailGridData = [];
var optionreceiptoptions = ["Pending", "Processed"];
var add_tr = "";
var MinMaxBtnStatus = "";
var ObjgridDelDetail = [];
var ObjOrderDetailGrid = [];
var SelectedOrderDetailData = [];
var prefix = "DN";
var FinishGoodDetail = [], FinishGoodDetailSelectedData = [];
var ChargesGrid = [];

var ObjOrderDeliveryData = [];
var CurrencyCode = "";
var Var_ChargeHead = [];
var LblSupplierStateTin = 0, GblCompanyStateTin = 0;
var FlagEditPurchaseRate = false;

$("#ModeOfTransport").dxSelectBox({
    items: ["By Road", "By Rail", "By Air", "By Ocean", "Other"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelTransporter").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'TransporterName',
    valueExpr: 'TransporterID',
    searchEnabled: true
});

$("#TxtClientID").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value) {
            GetConsignee(e.value);
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.LedgerID === e.value; });
            if (result.length === 1) {
                GblCompanyStateTin = result[0].CompanyStateTinNo;
                document.getElementById("TxtAddress").value = result[0].MailingAddress;
            }
        }
    }
});

$("#TxtConsigneeID").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    searchEnabled: true,
    displayExpr: 'ConsigneeName',
    valueExpr: 'ConsigneeID',
    onValueChanged: function (e) {
        document.getElementById("TxtConsigneeAddress").value = "";
        if (e.value) {
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.ConsigneeID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtConsigneeAddress").value = result[0].MailingAddress;
            }
        }
    }
});

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#gridCHDList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    //keyExpr: "TransactionID",
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "multiple", showCheckBoxesMode: "always" },
    filterRow: { visible: true },
    showBorders: true,
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
        setDataGridRowCss(e);
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
            }
            else if (supplieridvalidate !== clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                DevExpress.ui.notify("Please select records which have same customer..!", "warning", 3000);
                clickedIndentCell.currentSelectedRowKeys = [];
                return false;
            }
        }
        $("#gridOtherDetail").dxDataGrid({
            dataSource: []
        });

        GetSelectedListData = clickedIndentCell.selectedRowsData;

        add_tr = "";
        if (GetSelectedListData.length > 0) {
            LblSupplierStateTin = GetSelectedListData[0].StateTinNo;
            otherDetailGrid();
            add_tr = "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px'>Client Name</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px'>" + GetSelectedListData[0].ClientName + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Consignee</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].ConsigneeName + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Delivery Date</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].DeliveryDate + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>P.M.Code</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].ProductMasterCode + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Dispatch Remark</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].DispatchRemark + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Order Qty</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].OrderQuantity + "</td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>PO No/Date</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].PONo + " / " + GetSelectedListData[0].PODate + " </td></tr>" +
                "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Buyer Remark</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;padding-left:5px;border-top:1px solid #ccc'>" + GetSelectedListData[0].PODetail + "</td></tr>";
            document.getElementById("tbl_task").innerHTML = "";
            $("#tbl_task").append(add_tr);

            if (MinMaxBtnStatus === "Max") {
                document.getElementById("gridCHDList").style.height = "calc(100vh - 340px)";
                document.getElementById("ExtraDetailDiv").style.display = "block";
                document.getElementById("MinBtn").style.display = "block";
                document.getElementById("MaxBtn").style.display = "none";
            }
            else if (MinMaxBtnStatus === "") {
                document.getElementById("gridCHDList").style.height = "calc(100vh - 340px)";
                document.getElementById("ExtraDetailDiv").style.display = "block";
                document.getElementById("MinBtn").style.display = "block";
                document.getElementById("MaxBtn").style.display = "none";
            }
        }

        if (GetSelectedListData.length === 0) {
            supplieridvalidate = "";
            document.getElementById("TxtCHDID").value = "";
            DynamicTbl();

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
        { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
        { dataField: "ConsigneeID", visible: false, caption: "Consignee ID", width: 120 },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID", width: 120 },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID", width: 120 },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
        { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No", width: 100 },
        { dataField: "ClientName", visible: true, caption: "Customer Name", width: 150, fixed: true },
        { dataField: "ConsigneeName", visible: true, caption: "Consignee Name", width: 100 },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No", width: 100 },
        { dataField: "JobBookingDate", visible: true, caption: "Job Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "OrderBookingDate", visible: true, caption: "Order Booking Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ProductMasterCode", visible: true, caption: "Product Master Code", width: 120 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "ProductCode", visible: false, caption: "Product Code", width: 80 },
        { dataField: "OrderQuantity", visible: false, caption: "Order Qty", width: 80 },
        { dataField: "JCQty", visible: true, caption: "JC Qty", width: 80 },
        { dataField: "FinishGoodsQty", visible: true, caption: "Finish Goods Qty", width: 100 },
        { dataField: "DeliveredQuantity", visible: true, caption: "Delivered Qty", width: 80 },
        { dataField: "PendingQuantity", visible: true, caption: "Pending Qty", width: 80 },
        { dataField: "DeliveryDate", visible: true, caption: "Delivery Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "PODetail", visible: true, caption: "PO Detail", width: 120 },
        { dataField: "FinishGoodsWt", visible: true, caption: "Finish Goods Wt", width: 100 },
        { dataField: "TTLCFT", visible: false, caption: "TTL CFT", width: 80 },
        { dataField: "WTPerCFC", visible: false, caption: "WT Per CFC", width: 80 },
        { dataField: "PODate", visible: false, caption: "PO Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "StateTinNo", visible: false, caption: "State Tin No", width: 100 },
        { dataField: "TotalFGOuterCartons", visible: false, caption: "TotalFGOuterCartons", width: 150 },
        { dataField: "DispatchRemark", visible: true, caption: "Dispatch Remark", width: 200 },
        { dataField: "PONo", visible: true, caption: "PONo", width: 100 },
        { dataField: "Remark", visible: true, caption: "Order Booking Remark", width: 150 },
        { dataField: "ClientAddress", visible: false, caption: "ClientAddress", width: 100 },
        { dataField: "ConsigneeAddress", visible: false, caption: "ConsigneeAddress", width: 150 }
    ]
});

///Clients
$.ajax({
    type: "POST",
    url: "WebService_ChallanDetail.asmx/GetClientData",
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
        $("#TxtClientID").dxSelectBox({
            dataSource: RES1
        });
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

        $("#SelTransporter").dxSelectBox({
            dataSource: items
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

CreateNOTENO();
function CreateNOTENO() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_ChallanDetail.asmx/GetNoteNO",
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
            document.getElementById("LOADER").style.display = "none";
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

$("#optreceiptradio").dxRadioGroup({
    items: optionreceiptoptions,
    value: optionreceiptoptions[0],
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
        document.getElementById("LOADER").style.display = "block";
        if (RadioValue === "Pending") {
            document.getElementById("DivCretbtn").style.display = "block";
            document.getElementById("DivEdit").style.display = "none";
            document.getElementById("BtnDeletePopUp").disabled = true;
            GblStatus = "";

            CurURL = "WebService_ChallanDetail.asmx/GetPendingOrdersList";
        } else if (RadioValue === "Processed") {
            document.getElementById("DivCretbtn").style.display = "none";
            document.getElementById("DivEdit").style.display = "block";
            CurURL = "WebService_ChallanDetail.asmx/GetProcessOrdersList";
        }

        $.ajax({
            type: "POST",
            url: CurURL,
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";

                var ResultData = JSON.parse(res);
                if (RadioValue === "Pending") {
                    SetPendingReceiptGrid(ResultData);
                } else if (RadioValue === "Processed") {
                    SetProcessedGrid(ResultData);
                }
            }
        });

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
    document.getElementById("BtnSave").disabled = false;
    GetSelectedListData = [];
    supplieridvalidate = "";

    $("#gridCHDList").dxDataGrid({
        dataSource: tt //.filter(function (e) { return e.PendingQuantity > 0; })
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
    document.getElementById("BtnSave").disabled = true;
    //  GetSelectedListData = [];

    $("#gridProcessedCHDList").dxDataGrid({
        dataSource: ProcessedData,
        columnAutoWidth: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        selection: { mode: "single" },
        showRowLines: true,
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
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        export: {
            enabled: true,
            fileName: "Challan Detail",
            allowExportSelectedData: true
        },
        onSelectionChanged: function (clickedProcessCell) {
            GetProcessSelectedListData = clickedProcessCell.selectedRowsData;
            if (GetProcessSelectedListData.length <= 0) return;
            document.getElementById("TxtCHDID").value = GetProcessSelectedListData[0].FGTransactionID;
        },
        columns: [
            { dataField: "FGTransactionID", visible: false, caption: "FGTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ConsigneeID", visible: false, caption: "Consignee ID", width: 120 },
            { dataField: "MaxVoucherNo", visible: false, caption: "Ref.D.N.No.", width: 100 },
            { dataField: "VoucherNo", visible: true, caption: "Delivery Note No.", width: 120 },
            { dataField: "VoucherDate", visible: true, caption: "Delivery Note Date", width: 120, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "LedgerName", visible: true, caption: "Client Name", width: 150 },
            { dataField: "JobBookingNo", caption: "Job Card No", width: 90 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 180 },
            { dataField: "ConsigneeName", visible: true, caption: "Consignee Name", width: 150 },
            { dataField: "PODate", visible: true, caption: "PO Date", width: 120, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "TotalOuterCarton", visible: true, caption: "Total Delivrd Carton", width: 100 },
            { dataField: "TotalQuantity", visible: true, caption: "Total Qty", width: 100 },
            { dataField: "TotalTaxAmount", visible: false, caption: "Total Tax AMt", width: 100 },
            { dataField: "NetAmount", visible: true, caption: "Net Amount", width: 120 }
        ]
    });
}

function otherDetailGrid() {
    if (GetSelectedListData === undefined || GetSelectedListData.length === 0) {
        return false;
    }
    var LedgerID = GetSelectedListData[0].LedgerID;

    $.ajax({
        type: "POST",
        url: "WebService_ChallanDetail.asmx/StockDetail",
        data: '{LedgerID:' + JSON.stringify(LedgerID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
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

$("#AnchorDelDetail").click(function () {
    DelDetail();
});

function DelDetail() {

    var JobBokingIdString = "";
    for (var i = 0; i < GetSelectedListData.length; i++) {
        JobBokingIdString += GetSelectedListData[i].JobBookingID;
        if (JobBokingIdString === "") {
            JobBokingIdString = GetSelectedListData[i].JobBookingID;
        }
        else {
            JobBokingIdString = JobBokingIdString + "," + GetSelectedListData[i].JobBookingID;
        }
    }
    $.ajax({
        type: "POST",
        url: "WebService_ChallanDetail.asmx/GetDeliveryDetail",
        data: '{JobBokingIdString:' + JSON.stringify(JobBokingIdString) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            ObjgridDelDetail = [];
            ObjgridDelDetail = JSON.parse(res);
            $("#gridDelDetail").dxDataGrid({
                dataSource: ObjgridDelDetail,
            });
        }
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

    //height: function () {
    //    return window.innerHeight / 1.2;
    //},      

    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },

    onRowPrepared: function (e) {
        setDataGridRowCss(e);
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
        { dataField: "ParentFGTransactionID", visible: false, caption: "ParentFGTransactionID", width: 120 },
        { dataField: "ParentFGTransactionDetailID", visible: false, caption: "ParentFGTransactionDetailID", width: 100 },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID", width: 100 },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID", width: 100 },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 100 },
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 100 },
        { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No", width: 100 },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No", width: 100 },
        //{ dataField: "SalesOrderNo", visible: true, caption: "SalesOrderNo", width: 100 },
        { dataField: "OrderQuantity", visible: true, caption: "Order Qty", width: 120 },
        { dataField: "PackingNo", visible: true, caption: "Packing No", width: 100 },
        { dataField: "PackingDate", visible: true, caption: "Packing Date", width: 120 },
        { dataField: "TotalFGOuterCarton", visible: true, caption: "Total FG Outer Carton", width: 100 },
        { dataField: "InnerCarton", visible: true, caption: "InnerCarton", width: 100 },
        { dataField: "QuantityPerPack", visible: true, caption: "Qty/Inner", width: 100 },

        { dataField: "TotalFGQuantity", visible: true, caption: "Total FG Qty", width: 100 },
        { dataField: "WeightPerOuterCarton", visible: true, caption: "Wt/Outer", width: 120 },
        { dataField: "TotalFGWeight", visible: true, caption: "Total FG Wt", width: 100 },
        { dataField: "PackingDetail", visible: true, caption: "Packing Detail", width: 100 },
        { dataField: "ShipperLengthCM", visible: true, caption: "Shipper L(CM)", width: 100 },
        { dataField: "ShipperWidthCM", visible: true, caption: "Shipper W(CM)", width: 100 },
        { dataField: "ShipperHeightCM", visible: true, caption: "Shipper H(CM)", width: 120 },
        { dataField: "CBCM", visible: true, caption: "CB CM", width: 100 },
        { dataField: "CFT", visible: true, caption: "CFT", width: 100 },
        { dataField: "TotalCFT", visible: true, caption: "Total CFT", width: 100 },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse Name", width: 100 },
        { dataField: "WarehouseBinName", visible: true, caption: "Bin Name", width: 100 },
        { dataField: "AGING", visible: true, caption: "AGING", width: 100 }
    ]
});

$("#gridDelDetail").dxDataGrid({
    dataSource: ObjgridDelDetail,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
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
        { dataField: "FGTransactionID", visible: false, caption: "FGTransactionID", width: 120 },
        { dataField: "DeliveryNoteNo", visible: true, caption: "Delivery Note No", width: 100 },
        { dataField: "DeliveryNoteDate", visible: true, caption: "Delivery Note Date", width: 120, dataType: "date", format: "dd-MMM-yyyy" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No", width: 100 },
        { dataField: "JobBookingDate", visible: true, caption: "Job Date", width: 100, dataType: "date", format: "dd-MMM-yyyy" },
        { dataField: "JobCardContentNo", visible: true, caption: "Job Card No", width: 80 },
        { dataField: "OrderQuantity", visible: true, caption: "Order Qty", width: 80 },
        { dataField: "Total_Box", visible: true, caption: "Total Box", width: 80 },
        { dataField: "TotalQty", visible: true, caption: "Total Qty", width: 80 },
        { dataField: "TotalWt", visible: true, caption: "Total Wt", width: 80 }
    ]
});

//PopUp Control Data Start..
$("#OrderDetailGrid").dxDataGrid({
    dataSource: ObjOrderDetailGrid,
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
    height: function () {
        return window.innerHeight / 4;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onEditorPreparing: function (e) {
        if (e.parentType === 'headerRow' && e.command === 'select') {
            e.editorElement.remove();
        }
    },
    onSelectionChanged: function (clicked) {
        FinishGoodDetailSelectedData = [];
        SelectedOrderDetailData = clicked.selectedRowsData;
        if (SelectedOrderDetailData.length <= 0) return;

        $.ajax({
            type: "POST",
            url: "WebService_ChallanDetail.asmx/GetFinisgGoddDetail",
            data: '{ProductMasterID:' + JSON.stringify(SelectedOrderDetailData[0].ProductMasterID) + ',JobBookingID:' + JSON.stringify(SelectedOrderDetailData[0].JobBookingID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                FinishGoodDetail = [];
                FinishGoodDetail = JSON.parse(res);
                $("#FinishGoodsGrid").dxDataGrid({
                    dataSource: FinishGoodDetail
                });
            }
        });
    },
    columns: [{ dataField: "CompanyID", visible: false, caption: "CompanyID" },
    { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
    { dataField: "LedgerID", visible: false, caption: "LedgerID" },
    { dataField: "ConsigneeID", visible: false, caption: "ConsigneeID" },
    { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
    { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
    { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
    { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
    { dataField: "ClientName", visible: false, caption: "Client Name" },
    { dataField: "ConsigneeName", visible: false, caption: "Consignee Name" },
    { dataField: "JobBookingNo", visible: true, caption: "Job Booking No" },
    { dataField: "JobBookingDate", visible: true, caption: "Job Date" },
    { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No" },
    { dataField: "OrderBookingDate", visible: true, caption: "Order Booking Date" },
    { dataField: "ProductMasterCode", visible: true, caption: "P.M. Code" },
    { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
    { dataField: "ProductCode", visible: false, caption: "Product Code", width: 80 },
    { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 80 },
    { dataField: "PONo", visible: true, caption: "PO No." },
    { dataField: "PODate", visible: false, caption: "PO Date" },
    { dataField: "OrderQuantity", visible: true, caption: "Order Qty" },
    { dataField: "JCQty", visible: true, caption: "JC Qty" },
    { dataField: "DeliveredQuantity", visible: true, caption: "Delivered Qty" },
    { dataField: "PendingQuantity", visible: true, caption: "Pending Qty" },
    { dataField: "FinishGoodsQty", visible: true, caption: "F.G. Qty" },
    { dataField: "PODetail", visible: false, caption: "PO Detail" },
    { dataField: "DispatchRemark", visible: false, caption: "DispatchRemark" },
    { dataField: "TotalFGOuterCartons", visible: false, caption: "F.G. Cartons" },
    { dataField: "FinishGoodsWt", visible: false, caption: "F.G. Wt" }
    ]
});

$("#FinishGoodsGrid").dxDataGrid({
    dataSource: FinishGoodDetail,
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
    height: function () {
        return window.innerHeight / 4.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onEditorPreparing: function (e) {
        if (e.parentType === 'headerRow' && e.command === 'select') {
            e.editorElement.remove();
        }
    },
    onSelectionChanged: function (clicked) {
        FinishGoodDetailSelectedData = clicked.selectedRowsData;
        if (FinishGoodDetailSelectedData.length <= 0) return;
        document.getElementById("TxtTotalCarton").value = Number(FinishGoodDetailSelectedData[0].TotalFGOuterCartons);
    },
    columns: [
        { dataField: "ParentFGTransactionID", visible: false, caption: "ParentFGTransactionID" },
        { dataField: "CompanyID", visible: false, caption: "CompanyID" },
        { dataField: "SemiPackingMainID", visible: false, caption: "SemiPackingMainID" },
        { dataField: "SemiPackingDetailID", visible: false, caption: "SemiPackingDetailID" },
        { dataField: "ParentFGTransactionDetailID", visible: false, caption: "ParentFGTransactionDetailID" },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID" },
        { dataField: "PackingNo", visible: true, caption: "Packing No" },
        { dataField: "PackingDate", visible: true, caption: "Packing Date" },
        { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No" },
        { dataField: "OrderBookingDate", visible: false, caption: "Order Date" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No" },
        { dataField: "JobBookingDate", visible: false, caption: "Job Date" },
        { dataField: "ProductMasterCode", visible: true, caption: "P.M. Code" },
        { dataField: "ProductCode", visible: false, caption: "Product Code", width: 80 },
        { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 80 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "PackedQuantity", visible: false, caption: "Packed Qty" },
        { dataField: "DeliveredQuantity", visible: false, caption: "Delivered Qty" },
        { dataField: "FGStock", visible: true, caption: "FG Stock Qty" },
        { dataField: "TotalPackedOuterCartons", visible: false, caption: "Total Packed Outer Carton" },
        { dataField: "TotalDeliveredOuterCartons", visible: false, caption: "Total Delivered Outer Carton" },
        { dataField: "TotalFGOuterCartons", visible: true, caption: "Total FG Carton" },
        { dataField: "InnerCarton", visible: true, caption: "Inner Carton" },
        { dataField: "QuantityPerPack", visible: true, caption: "Qty/ Inner Carton" },
        { dataField: "CFT", visible: false, caption: "CFT" },
        { dataField: "CBCM", visible: false, caption: "CBCM" },
        { dataField: "ShipperLengthCM", visible: false, caption: "ShipperLengthCM" },
        { dataField: "ShipperWidthCM", visible: false, caption: "ShipperWidthCM" },
        { dataField: "ShipperHeightCM", visible: false, caption: "ShipperHeightCM" },
        { dataField: "WeightPerOuterCarton", visible: false, caption: "WeightPerOuterCarton" },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse Name" },
        { dataField: "WarehouseBinName", visible: true, caption: "Bin Name" },

        { dataField: "GSTTaxPercentage", visible: false, caption: "GSTTaxPercentage" },
        { dataField: "CGSTTaxPercentage", visible: false, caption: "CGSTTaxPercentage" },
        { dataField: "SGSTTaxPercentage", visible: false, caption: "SGSTTaxPercentage" },
        { dataField: "IGSTTaxPercentage", visible: false, caption: "IGSTTaxPercentage" },
        { dataField: "CGSTAmt", visible: false, caption: "CGSTAmt" },
        { dataField: "SGSTAmt", visible: false, caption: "SGSTAmt" },
        { dataField: "IGSTAmt", visible: false, caption: "IGSTAmt" },
        { dataField: "ProductHSNID", visible: false, caption: "ProductHSNID" }
    ]
});

$("#DeliveryDetailGrid").dxDataGrid({
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
    height: function () {
        return window.innerHeight / 4.5;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
        if (e.rowType === "data") {
            GridColumnCal();
        }
    },
    onEditorPreparing: function (e) {
        if (e.parentType === 'headerRow' && e.command === 'select') {
            e.editorElement.remove();
        }
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "PurchaseRate" || e.column.dataField === "PurchaseUnit") {
            e.cancel = FlagEditPurchaseRate;
        } else
            e.cancel = true;
    },
    editing: {
        mode: "cell",
        allowDeleting: true,
        allowUpdating: true
    },
    onRowRemoved: function (e) {
        if (ObjOrderDeliveryData.length > 0) {
            ObjOrderDeliveryData = ObjOrderDeliveryData.filter(function (obj) {
                return obj.FGTransactionID !== e.data.FGTransactionID;
            });

            AddItemCalculation();
            if (ChargesGrid.length > 0) {
                GridColumnCal();
                CalculateAmount();
            }
        }
    },
    columns: [
        { dataField: "ParentFGTransactionID", visible: false, caption: "ParentFGTransactionID" },
        { dataField: "CompanyID", visible: false, caption: "CompanyID" },
        { dataField: "SemiPackingMainID", visible: false, caption: "SemiPackingMainID" },
        { dataField: "SemiPackingDetailID", visible: false, caption: "SemiPackingDetailID" },
        { dataField: "ParentFGTransactionDetailID", visible: false, caption: "ParentFGTransactionDetailID" },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID" },
        { dataField: "ProductHSNID", visible: false, caption: "ProductHSNID" },
        { dataField: "PackingNo", visible: true, caption: "Packing No" },
        { dataField: "PackingDate", visible: false, caption: "Packing Date" },
        { dataField: "SalesOrderNo", visible: true, caption: "Sales Order No" },
        { dataField: "OrderBookingDate", visible: false, caption: "Order Date" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No" },
        { dataField: "JobBookingDate", visible: false, caption: "Job Date" },
        { dataField: "ProductMasterCode", visible: true, caption: "P.M. Code" },
        { dataField: "ProductCode", visible: false, caption: "Product Code", width: 80 },
        { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 80 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "IssueOuterCarton", visible: false, caption: "Dispatch Outer Carton" },
        { dataField: "InnerCarton", visible: false, caption: "Inner Carton" },
        { dataField: "QuantityPerPack", visible: false, caption: "Qty/ Inner Carton" },
        { dataField: "PurchaseQuantity", visible: true, caption: "Dispatch Qty" },//IssueQuantity
        {
            dataField: "PurchaseRate", visible: true, caption: "Rate",
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },//Rate
        {
            dataField: "PurchaseUnit",
            lookup: {
                dataSource: [{ "PurchaseUnit": "UnitCost" }, { "PurchaseUnit": "UnitThCost" }],
                displayExpr: "PurchaseUnit",
                valueExpr: "PurchaseUnit"
            }, visible: true, caption: "Rate Type"
        },//Rate Type
        { dataField: "BasicAmount", visible: true, caption: "Amount" },//Amount
        { dataField: "Disc", visible: true, caption: "Disc. %", width: 60 },
        { dataField: "AfterDisAmt", visible: false, caption: "After Dis. Amt", width: 80 },
        { dataField: "TaxableAmount", visible: true, caption: "Taxable Amt", width: 100 },

        { dataField: "GSTTaxPercentage", visible: false, caption: "GST %", width: 50 },
        { dataField: "CGSTTaxPercentage", visible: true, caption: "CGST %", width: 50 },
        { dataField: "SGSTTaxPercentage", visible: true, caption: "SGST %", width: 50 },
        { dataField: "IGSTTaxPercentage", visible: true, caption: "IGST %", width: 50 },

        { dataField: "CGSTAmt", visible: true, caption: "CGST Amt", width: 80 },
        { dataField: "SGSTAmt", visible: true, caption: "SGST Amt", width: 80 },
        { dataField: "IGSTAmt", visible: true, caption: "IGST Amt", width: 80 },
        { dataField: "TotalAmount", visible: true, caption: "Total Amt", width: 80 },

        { dataField: "CFT", visible: false, caption: "CFT" },
        { dataField: "CBCM", visible: false, caption: "CBCM" },
        { dataField: "ShipperLengthCM", visible: false, caption: "Shipper Length(CM)" },
        { dataField: "ShipperWidthCM", visible: false, caption: "Shipper Width(CM)" },
        { dataField: "ShipperHeightCM", visible: false, caption: "Shipper Height(CM)" },
        { dataField: "WeightPerOuterCarton", visible: false, caption: "Wt. Per Outer Carton" },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse Name" },
        { dataField: "WarehouseBinName", visible: true, caption: "Bin Name" },
        { dataField: "DeliveryOrderBookingID", visible: false, caption: "DeliveryOrderBookingID" },
        { dataField: "DeliveryOrderBookingDetailsID", visible: false, caption: "DeliveryOrderBookingDetailsID" },
        { dataField: "DeliveryJobBookingID", visible: false, caption: "DeliveryJobBookingID" },
        { dataField: "DeliveryJobBookingJobCardContentsID", visible: false, caption: "DeliveryJobBookingJobCardContentsID" }
    ],
    onRowUpdated: function (editcell) {
        AddItemCalculation();
        GridColumnCal();
        if (ChargesGrid.length > 0) {
            CalculateAmount();
        }
    }
});

DynamicTbl();
function DynamicTbl() {
    add_tr = "";
    document.getElementById("tbl_task").innerHTML = "";
    add_tr = "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px'>Client Name</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Consignee</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Delivery Date</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>P.M.Code</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Dispatch Remark</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Order Qty</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>PO No/Date</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>" +
        "<tr style='width: 100%;height:25px; text-align: center;'><td style='width: 50px; height: auto; text-align: left; margin-top: 0px; font: large;color:black;border-right:1px solid #ccc;padding-left:5px;border-top:1px solid #ccc'>Buyer Remark</td><td style='width: 250px; height: auto; text-align: left; margin-top: 0px; font: large;color:black'> </td></tr>";
    $("#tbl_task").append(add_tr);
}

$("#Btn_Next").click(function () {
    var TxtCHDID = document.getElementById("TxtCHDID").value;

    if (TxtCHDID === "" || TxtCHDID === null || TxtCHDID === undefined) {
        alert("Please select any row from below grid !");
        return false;
    }
    document.getElementById("TxtTotalCarton").value = 0;
    ObjOrderDeliveryData = [], ObjOrderDetailGrid = [], ChargesGrid = [];
    FinishGoodDetail = [];
    var orderDetailGrid = $("#OrderDetailGrid").dxDataGrid('instance');
    orderDetailGrid.clearSelection();

    $("#OrderDetailGrid").dxDataGrid({
        dataSource: ObjOrderDetailGrid
    });
    $("#FinishGoodsGrid").dxDataGrid({
        dataSource: FinishGoodDetail
    });
    $("#DeliveryDetailGrid").dxDataGrid({
        dataSource: ObjOrderDeliveryData
    });
    $("#AdditionalChargesGrid").dxDataGrid({
        dataSource: ChargesGrid
    });

    BlankField();

    document.getElementById("TxtDelNote").value = NoteNo;
    $("#VoucherDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });
    $("#TxtClientID").dxSelectBox({
        value: GetSelectedListData[0].LedgerID
    });
    $("#TxtConsigneeID").dxSelectBox({
        value: GetSelectedListData[0].ConsigneeID
    });

    ObjOrderDetailGrid = [];
    ObjOrderDetailGrid = GetSelectedListData;
    $("#OrderDetailGrid").dxDataGrid({
        dataSource: ObjOrderDetailGrid
    });

    document.getElementById("Btn_Next").setAttribute("data-toggle", "modal");
    document.getElementById("Btn_Next").setAttribute("data-target", "#largeModal");
});

//Open Add Item in DeliveryDetailGrid
$("#AddButton").click(function () {
    if (FinishGoodDetail.length <= 0) return;
    var TtlCarton = FinishGoodDetail[0].TotalFGOuterCartons;
    var ParentFGTransactionID = FinishGoodDetail[0].ParentFGTransactionID;
    var EnterTotalCarton = document.getElementById("TxtTotalCarton").value;

    if (document.getElementById("TxtTotalCarton").value === "") {
        DevExpress.ui.notify("Please enter total carton less then OR equal to " + TtlCarton + "..!", "error", 2000);
        document.getElementById("TxtTotalCarton").style.borderColor = "red";
        document.getElementById("TxtTotalCarton").focus();
        return false;
    }

    if (EnterTotalCarton > TtlCarton) {
        DevExpress.ui.notify("Please enter total carton less then OR equal to " + TtlCarton + "..!", "error", 2000);
        document.getElementById("TxtTotalCarton").style.borderColor = "red";
        document.getElementById("TxtTotalCarton").value = TtlCarton;
        return false;
    }

    var DeliveryDetailGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var DeliveryDetailGridRow = DeliveryDetailGrid.totalCount();

    if (DeliveryDetailGridRow > 0) {
        for (var tp = 0; tp < DeliveryDetailGridRow; tp++) {
            if (FinishGoodDetailSelectedData[0].SemiPackingDetailID === DeliveryDetailGrid._options.dataSource[tp].SemiPackingDetailID && FinishGoodDetailSelectedData[0].PackingNo === DeliveryDetailGrid._options.dataSource[tp].PackingNo) {
                DevExpress.ui.notify("This packing no. already added.." + DeliveryDetailGrid._options.dataSource[tp].PackingNo + "..!", "warning", 2000);
                return false;
            }
        }
    }

    //ObjOrderDeliveryData = [];
    var OptMakeDynamicObj = {};
    
    OptMakeDynamicObj = {};
    OptMakeDynamicObj.ParentFGTransactionID = FinishGoodDetailSelectedData[0].ParentFGTransactionID;
    OptMakeDynamicObj.CompanyID = FinishGoodDetailSelectedData[0].CompanyID;
    OptMakeDynamicObj.SemiPackingMainID = FinishGoodDetailSelectedData[0].SemiPackingMainID;
    OptMakeDynamicObj.SemiPackingDetailID = FinishGoodDetailSelectedData[0].SemiPackingDetailID;
    OptMakeDynamicObj.ParentFGTransactionDetailID = FinishGoodDetailSelectedData[0].ParentFGTransactionDetailID;
    OptMakeDynamicObj.JobBookingID = FinishGoodDetailSelectedData[0].JobBookingID;
    OptMakeDynamicObj.JobBookingJobCardContentsID = FinishGoodDetailSelectedData[0].JobBookingJobCardContentsID;
    OptMakeDynamicObj.ProductMasterID = FinishGoodDetailSelectedData[0].ProductMasterID;
    OptMakeDynamicObj.OrderBookingID = FinishGoodDetailSelectedData[0].OrderBookingID;
    OptMakeDynamicObj.OrderBookingDetailsID = FinishGoodDetailSelectedData[0].OrderBookingDetailsID;
    OptMakeDynamicObj.WarehouseID = FinishGoodDetailSelectedData[0].WarehouseID;
    OptMakeDynamicObj.PackingNo = FinishGoodDetailSelectedData[0].PackingNo;
    OptMakeDynamicObj.PackingDate = FinishGoodDetailSelectedData[0].PackingDate;
    OptMakeDynamicObj.SalesOrderNo = FinishGoodDetailSelectedData[0].SalesOrderNo;
    OptMakeDynamicObj.OrderBookingDate = FinishGoodDetailSelectedData[0].OrderBookingDate;
    OptMakeDynamicObj.JobBookingNo = FinishGoodDetailSelectedData[0].JobBookingNo;
    OptMakeDynamicObj.JobBookingDate = FinishGoodDetailSelectedData[0].JobBookingDate;
    OptMakeDynamicObj.ProductMasterCode = FinishGoodDetailSelectedData[0].ProductMasterCode;
    OptMakeDynamicObj.ProductCode = FinishGoodDetailSelectedData[0].ProductCode;
    OptMakeDynamicObj.HSNCode = FinishGoodDetailSelectedData[0].HSNCode;
    OptMakeDynamicObj.JobName = FinishGoodDetailSelectedData[0].JobName;
    OptMakeDynamicObj.ProductHSNID = FinishGoodDetailSelectedData[0].ProductHSNID;
    OptMakeDynamicObj.IssueOuterCarton = Number(document.getElementById("TxtTotalCarton").value);
    OptMakeDynamicObj.InnerCarton = FinishGoodDetailSelectedData[0].InnerCarton;
    OptMakeDynamicObj.QuantityPerPack = FinishGoodDetailSelectedData[0].QuantityPerPack;

    //*Calculation*/       

    var TtlQty = Number(OptMakeDynamicObj.IssueOuterCarton) * Number(FinishGoodDetailSelectedData[0].InnerCarton) * Number(FinishGoodDetailSelectedData[0].QuantityPerPack);
    if (TtlQty === "" || TtlQty === undefined || TtlQty === null) {
        TtlQty = 0;
    }

    if (FinishGoodDetailSelectedData[0].PurchaseUnit === "UnitThCost") {
        FinishGoodDetailSelectedData[0].BasicAmount = parseFloat(Number(TtlQty) * Number(FinishGoodDetailSelectedData[0].PurchaseRate) / 1000).toFixed(2);
    } else {
        FinishGoodDetailSelectedData[0].BasicAmount = parseFloat(Number(TtlQty) * Number(FinishGoodDetailSelectedData[0].PurchaseRate)).toFixed(2);
    }

    //BasicAmt = Number(TtlQty) * Number(FinishGoodDetailSelectedData[0].PurchaseRate);

    var TaxableAmt = 0;
    TaxableAmt = Number(FinishGoodDetailSelectedData[0].BasicAmount);

    var IGSTPER = 0, SGSTPER = 0, CGSTPER = 0;
    var IGSTAMT = 0, SGSTAMT = 0, CGSTAMT = 0;
    var TotalAmount = 0;

    if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
        if (FinishGoodDetailSelectedData[0].CGSTTaxPercentage === "" || FinishGoodDetailSelectedData[0].CGSTTaxPercentage === undefined || FinishGoodDetailSelectedData[0].CGSTTaxPercentage === null || FinishGoodDetailSelectedData[0].CGSTTaxPercentage === "NULL") {
            CGSTPER = 0;
        }
        else {
            CGSTPER = FinishGoodDetailSelectedData[0].CGSTTaxPercentage;
        }
        if (FinishGoodDetailSelectedData[0].SGSTTaxPercentage === "" || FinishGoodDetailSelectedData[0].SGSTTaxPercentage === undefined || FinishGoodDetailSelectedData[0].SGSTTaxPercentage === null || FinishGoodDetailSelectedData[0].SGSTTaxPercentage === "NULL") {
            SGSTPER = 0;
        }
        else {
            SGSTPER = FinishGoodDetailSelectedData[0].SGSTTaxPercentage;
        }
        SGSTAMT = Number(Number(TaxableAmt) * Number(SGSTPER)) / 100;
        CGSTAMT = Number(Number(TaxableAmt) * Number(CGSTPER)) / 100;
        TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxableAmt);
    }
    else {
        if (FinishGoodDetailSelectedData[0].IGSTTaxPercentage === "" || FinishGoodDetailSelectedData[0].IGSTTaxPercentage === undefined || FinishGoodDetailSelectedData[0].IGSTTaxPercentage === null || FinishGoodDetailSelectedData[0].IGSTTaxPercentage === "NULL") {
            IGSTPER = 0;
        }
        else {
            IGSTPER = FinishGoodDetailSelectedData[0].IGSTTaxPercentage;
        }

        IGSTAMT = Number(Number(TaxableAmt) * Number(IGSTPER)) / 100;
        TotalAmount = Number(IGSTAMT) + Number(TaxableAmt);
    }

    OptMakeDynamicObj.PurchaseQuantity = TtlQty;
    OptMakeDynamicObj.PurchaseRate = FinishGoodDetailSelectedData[0].PurchaseRate;
    OptMakeDynamicObj.PurchaseUnit = FinishGoodDetailSelectedData[0].PurchaseUnit;
    OptMakeDynamicObj.BasicAmount = FinishGoodDetailSelectedData[0].BasicAmount;

    OptMakeDynamicObj.Disc = 0;
    OptMakeDynamicObj.AfterDisAmt = TaxableAmt;
    OptMakeDynamicObj.TaxableAmount = TaxableAmt;
    OptMakeDynamicObj.GSTTaxPercentage = FinishGoodDetailSelectedData[0].GSTTaxPercentage;
    OptMakeDynamicObj.CGSTTaxPercentage = FinishGoodDetailSelectedData[0].CGSTTaxPercentage;
    OptMakeDynamicObj.SGSTTaxPercentage = FinishGoodDetailSelectedData[0].SGSTTaxPercentage;
    OptMakeDynamicObj.IGSTTaxPercentage = FinishGoodDetailSelectedData[0].IGSTTaxPercentage;
    OptMakeDynamicObj.CGSTAmt = CGSTAMT;
    OptMakeDynamicObj.SGSTAmt = SGSTAMT;
    OptMakeDynamicObj.IGSTAmt = IGSTAMT;
    OptMakeDynamicObj.TotalAmount = TotalAmount;
    OptMakeDynamicObj.CFT = FinishGoodDetailSelectedData[0].CFT;
    OptMakeDynamicObj.CBCM = FinishGoodDetailSelectedData[0].CBCM;
    OptMakeDynamicObj.ShipperLengthCM = FinishGoodDetailSelectedData[0].ShipperLengthCM;
    OptMakeDynamicObj.ShipperWidthCM = FinishGoodDetailSelectedData[0].ShipperWidthCM;
    OptMakeDynamicObj.ShipperHeightCM = FinishGoodDetailSelectedData[0].ShipperHeightCM;
    OptMakeDynamicObj.WeightPerOuterCarton = FinishGoodDetailSelectedData[0].WeightPerOuterCarton;
    OptMakeDynamicObj.WarehouseName = FinishGoodDetailSelectedData[0].WarehouseName;
    OptMakeDynamicObj.WarehouseBinName = FinishGoodDetailSelectedData[0].WarehouseBinName;

    OptMakeDynamicObj.DeliveryOrderBookingID = SelectedOrderDetailData[0].OrderBookingID;
    OptMakeDynamicObj.DeliveryOrderBookingDetailsID = SelectedOrderDetailData[0].OrderBookingDetailsID;
    OptMakeDynamicObj.DeliveryJobBookingID = SelectedOrderDetailData[0].JobBookingID;
    OptMakeDynamicObj.DeliveryJobBookingJobCardContentsID = SelectedOrderDetailData[0].JobBookingJobCardContentsID;

    //    ObjOrderDeliveryData.push(OptMakeDynamicObj);
    //}
    
    var clonedItem = $.extend({}, OptMakeDynamicObj);
    DeliveryDetailGrid._options.dataSource.splice(DeliveryDetailGrid._options.dataSource.length, 0, clonedItem);
    DeliveryDetailGrid.refresh(true);

    //$("#DeliveryDetailGrid").dxDataGrid({
    //    dataSource: ObjOrderDeliveryData
    //});
});

//Close Add Item in DeliveryDetailGrid


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
                placeholder: "Choose Ledger Name--",
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
                editing: {
                    mode: "cell",
                    allowDeleting: true,
                    // allowAdding: true,
                    allowUpdating: true
                },
                height: function () {
                    return window.innerHeight / 4;
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
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
                    { dataField: "LedgerName", visible: true, caption: "Tax  Ledger", width: 200 },
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
    var rowCountAC = AdditionalChargesGrid.totalCount();

    var ChooseText = $("#SelLnameChargesGrid").dxSelectBox('instance').option('text');
    if (ChooseText === "" || ChooseText === "undefined" || ChooseText === null) {
        document.getElementById("SelLnameChargesGrid").style.borderColor = "#00DDD2";
        DevExpress.ui.notify("Please choose ledger name..!", "warning", 1200);
        return;
    }
    var ChooseID = $("#SelLnameChargesGrid").dxSelectBox('instance').option('value');

    if (rowCountAC > 0) {
        for (var cl = 0; cl < rowCountAC; cl++) {
            if (ChooseID === AdditionalChargesGrid._options.dataSource[cl].LedgerID) {
                DevExpress.ui.notify("This tax ledger already exist.. please add another tax ledger..!", "warning", 1200);
                return false;
            }
        }
    }

    if (document.getElementById("TxtAfterDisAmt").value === 0) {
        DevExpress.ui.notify("Please enter purchase rate in above grid before add charges..!", "warning", 1500);
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
            if (gstapl === "False" || gstapl === false) {
                gstapl = false;
            }
            else if (gstapl === "True" || gstapl === true) {
                gstapl = true;
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
                        ChargesGrid[m].ChargesAmount = Number(Number(document.getElementById("TxtAfterDisAmt").value) * TaxRatePer / 100).toFixed(2);
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
    var CreatePOGrid_RowCount = CreatePOGrid.totalCount();

    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var Charge_RowCount = AdditionalChargesGrid.totalCount();

    if (CreatePOGrid_RowCount > 0) {
        for (var t = 0; t < CreatePOGrid_RowCount; t++) {
            CreatePOGrid._options.dataSource[t].TaxableAmount = ObjOrderDeliveryData[t].AfterDisAmt;
        }
    }

    if (ObjOrderDeliveryData.length > 0) {

        for (var zz = 0; zz < ObjOrderDeliveryData.length; zz++) {
            var CreatePOGridRow = zz;

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

            var DiscountAmt = parseFloat(Number(Number(BasicAmt) * Number(DisPercentage)) / 100).toFixed(2);

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
    var TotalOuterCarton = 0;
    var WeightPerCarton = 0;
    for (var CH = 0; CH < ChargesGrid.length; CH++) {
        gridColTotalTax = parseFloat(Number(gridColTotalTax) + Number(ChargesGrid[CH].ChargesAmount)).toFixed(2);
    }
    for (var cal = 0; cal < dataGrid.totalCount(); cal++) {
        gridColBasicAmt = parseFloat(Number(gridColBasicAmt) + Number(dataGrid._options.dataSource[cal].BasicAmount)).toFixed(2);
        gridColTotalAmt = parseFloat(Number(gridColTotalAmt) + Number(dataGrid._options.dataSource[cal].TotalAmount)).toFixed(2);
        gridColTotalQty = parseFloat(Number(gridColTotalQty) + Number(dataGrid._options.dataSource[cal].PurchaseQuantity)).toFixed(2);

        gridColCGSTAmt = parseFloat(Number(gridColCGSTAmt) + Number(dataGrid._options.dataSource[cal].CGSTAmt)).toFixed(2);
        gridColSGSTAmt = parseFloat(Number(gridColSGSTAmt) + Number(dataGrid._options.dataSource[cal].SGSTAmt)).toFixed(2);
        gridColIGSTAmt = parseFloat(Number(gridColIGSTAmt) + Number(dataGrid._options.dataSource[cal].IGSTAmt)).toFixed(2);

        gridAfterDisAmt = parseFloat(Number(gridAfterDisAmt) + Number(dataGrid._options.dataSource[cal].AfterDisAmt)).toFixed(2);
        gridTaxAbleSum = parseFloat(Number(gridTaxAbleSum) + Number(dataGrid._options.dataSource[cal].TaxableAmount)).toFixed(2);
        gridColPurchaseQTY = parseFloat(Number(gridColPurchaseQTY) + Number(dataGrid._options.dataSource[cal].PurchaseQuantity)).toFixed(2);

        TotalOuterCarton = Number(TotalOuterCarton) + Number(dataGrid._options.dataSource[cal].IssueOuterCarton);
        WeightPerCarton = Number(WeightPerCarton) + Number(Number(dataGrid._options.dataSource[cal].WeightPerOuterCarton) * Number(dataGrid._options.dataSource[cal].IssueOuterCarton));
    }


    document.getElementById("TxtBasicAmt").value = gridColBasicAmt;
    document.getElementById("TxtNetAmt").value = Math.round((Number(gridAfterDisAmt) + Number(gridColTotalTax)).toFixed(2));

    document.getElementById("TxtTotalQty").value = gridColTotalQty;

    document.getElementById("TxtCGSTAmt").value = gridColCGSTAmt;
    document.getElementById("TxtSGSTAmt").value = gridColSGSTAmt;
    document.getElementById("TxtIGSTAmt").value = gridColIGSTAmt;

    document.getElementById("TxtAfterDisAmt").value = gridAfterDisAmt;
    document.getElementById("Txt_TaxAbleSum").value = gridTaxAbleSum;

    document.getElementById("TxtTotalTax").value = parseFloat(Number(gridColTotalTax)).toFixed(2);
    document.getElementById("TxtRoundTaxAmt").value = parseFloat(Number(document.getElementById("TxtNetAmt").value) - Number(gridColTotalAmt)).toFixed(2);

    document.getElementById("TxtTotalDispatchedQty").value = parseFloat(Number(gridColPurchaseQTY)).toFixed(2);
    document.getElementById("TxtBoxes").value = TotalOuterCarton;
    document.getElementById("TxtTotalWt").value = WeightPerCarton;
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

    var TxtCHDID = document.getElementById("TxtCHDID").value;
    var VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
    var TxtClientID = $("#TxtClientID").dxSelectBox('instance').option('value');
    var TxtConsigneeID = $("#TxtConsigneeID").dxSelectBox('instance').option('value');

    var TxtBasicAmt = document.getElementById("TxtBasicAmt").value;
    var TxtTotalTax = document.getElementById("TxtTotalTax").value;
    var TxtRoundTaxAmt = document.getElementById("TxtRoundTaxAmt").value;
    var TxtNetAmt = document.getElementById("TxtNetAmt").value;
    var TxtBoxes = document.getElementById("TxtBoxes").value;
    var TxtTotalDispatchedQty = document.getElementById("TxtTotalDispatchedQty").value;
    var TxtTotalWt = document.getElementById("TxtTotalWt").value;
    var TxtVehicleNo = document.getElementById("TxtVehicleNo").value;

    var TxtCGSTAmt = document.getElementById("TxtCGSTAmt").value;
    var TxtSGSTAmt = document.getElementById("TxtSGSTAmt").value;
    var TxtIGSTAmt = document.getElementById("TxtIGSTAmt").value;
    var TxtAfterDisAmt = document.getElementById("TxtAfterDisAmt").value;
    var Txt_TaxAbleSum = document.getElementById("Txt_TaxAbleSum").value;

    var Transporter = $("#SelTransporter").dxSelectBox('instance').option('value');
    var ModeOfTransport = $("#ModeOfTransport").dxSelectBox('instance').option('value');
    var TxtPODNO = document.getElementById("TxtPODNO").value;
    var TxtRemark = document.getElementById("TxtRemark").value;

    var DeliveryDetailGrid = $('#DeliveryDetailGrid').dxDataGrid('instance');
    var DeliveryDetailGridRow = DeliveryDetailGrid._options.dataSource.length;

    if (ModeOfTransport === "" || ModeOfTransport === null || ModeOfTransport === undefined || ModeOfTransport === "null") {
        DevExpress.ui.notify("Please choose mode of transport..!", "error", 2000);
        document.getElementById("ModeOfTransport").style.borderColor = "red";
        document.getElementById("ModeOfTransport").focus();
        return false;
    }
    else {
        document.getElementById("ModeOfTransport").style.borderColor = "";
    }

    if (DeliveryDetailGridRow < 1) {
        DevExpress.ui.notify("Please add total carton.!", "error", 2000);
        return false;
    }

    var jsonObjectsChallanDetyailmain = [];
    var OperationChallanDetailMain = {};

    var jsonObjectsChallanDetyail = [];
    var OperationChallanDetail = {};

    var SumInnierCarton = 0, SumOuterCarton = 0, DespQty = 0, TtlCFT = 0;
    if (DeliveryDetailGridRow > 0) {
        for (var a = 0; a < DeliveryDetailGridRow; a++) {
            SumInnierCarton = Number(SumInnierCarton) + Number(DeliveryDetailGrid._options.dataSource[a].InnerCarton);
            SumOuterCarton = Number(SumOuterCarton) + Number(DeliveryDetailGrid._options.dataSource[a].IssueOuterCarton);
            DespQty = Number(DespQty) + Number(DeliveryDetailGrid._options.dataSource[a].PurchaseQuantity);
            TtlCFT = Number(TtlCFT) + Number(DeliveryDetailGrid._options.dataSource[a].CFT);
        }
    }

    OperationChallanDetailMain.VoucherDate = VoucherDate;
    OperationChallanDetailMain.SemiPackingMainID = DeliveryDetailGrid._options.dataSource[0].SemiPackingMainID;
    OperationChallanDetailMain.JobBookingID = DeliveryDetailGrid._options.dataSource[0].JobBookingID;
    OperationChallanDetailMain.JobBookingJobCardContentsID = DeliveryDetailGrid._options.dataSource[0].JobBookingJobCardContentsID;
    OperationChallanDetailMain.ProductMasterID = DeliveryDetailGrid._options.dataSource[0].ProductMasterID;
    OperationChallanDetailMain.BookingID = DeliveryDetailGrid._options.dataSource[0].BookingID;
    OperationChallanDetailMain.OrderBookingID = DeliveryDetailGrid._options.dataSource[0].OrderBookingID;
    OperationChallanDetailMain.OrderBookingDetailsID = DeliveryDetailGrid._options.dataSource[0].OrderBookingDetailsID;
    OperationChallanDetailMain.LedgerID = TxtClientID;
    OperationChallanDetailMain.ConsigneeLedgerID = TxtConsigneeID;
    OperationChallanDetailMain.TotalQuantity = DespQty;
    OperationChallanDetailMain.TotalOuterCarton = SumOuterCarton;
    OperationChallanDetailMain.TotalInnerCarton = SumInnierCarton;
    OperationChallanDetailMain.TotalBasicAmount = TxtBasicAmt;
    OperationChallanDetailMain.TotalDiscountAmount = Number(TxtBasicAmt) - Number(TxtAfterDisAmt);
    OperationChallanDetailMain.TotalCGSTTaxAmount = TxtCGSTAmt;
    OperationChallanDetailMain.TotalSGSTTaxAmount = TxtSGSTAmt;
    OperationChallanDetailMain.TotalIGSTTaxAmount = TxtIGSTAmt;
    OperationChallanDetailMain.TotalTaxAmount = TxtTotalTax;
    OperationChallanDetailMain.NetAmount = TxtNetAmt;
    OperationChallanDetailMain.CurrencyCode = "";
    OperationChallanDetailMain.ConversionRate = 0;
    OperationChallanDetailMain.ModeOfTransport = ModeOfTransport;
    OperationChallanDetailMain.VehicleNo = TxtVehicleNo;
    OperationChallanDetailMain.Transporter = Transporter;
    OperationChallanDetailMain.Narration = TxtRemark;
    OperationChallanDetailMain.DeliveryNoteDate = VoucherDate;
    OperationChallanDetailMain.PODNO = TxtPODNO;

    jsonObjectsChallanDetyailmain.push(OperationChallanDetailMain);

    if (DeliveryDetailGridRow > 0) {
        for (var h = 0; h < DeliveryDetailGridRow; h++) {
            OperationChallanDetail = {};
            OperationChallanDetail.TransID = h + 1;
            OperationChallanDetail.ParentFGTransactionID = DeliveryDetailGrid._options.dataSource[h].ParentFGTransactionID;
            OperationChallanDetail.ParentFGTransactionDetailID = DeliveryDetailGrid._options.dataSource[h].ParentFGTransactionDetailID;
            OperationChallanDetail.SemiPackingMainID = DeliveryDetailGrid._options.dataSource[h].SemiPackingMainID;
            OperationChallanDetail.SemiPackingDetailID = DeliveryDetailGrid._options.dataSource[h].SemiPackingDetailID;
            OperationChallanDetail.JobBookingID = DeliveryDetailGrid._options.dataSource[h].JobBookingID;
            OperationChallanDetail.JobBookingJobCardContentsID = DeliveryDetailGrid._options.dataSource[h].JobBookingJobCardContentsID;
            OperationChallanDetail.ProductMasterID = DeliveryDetailGrid._options.dataSource[h].ProductMasterID;
            OperationChallanDetail.BookingID = DeliveryDetailGrid._options.dataSource[h].BookingID;
            OperationChallanDetail.OrderBookingID = DeliveryDetailGrid._options.dataSource[h].OrderBookingID;
            OperationChallanDetail.OrderBookingDetailsID = DeliveryDetailGrid._options.dataSource[h].OrderBookingDetailsID;
            OperationChallanDetail.DeliveryOrderBookingID = DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingID;
            OperationChallanDetail.DeliveryOrderBookingDetailsID = DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingDetailsID;
            OperationChallanDetail.DeliveryJobBookingID = DeliveryDetailGrid._options.dataSource[h].DeliveryJobBookingID;
            OperationChallanDetail.DeliveryJobBookingJobCardContentsID = DeliveryDetailGrid._options.dataSource[h].DeliveryJobBookingJobCardContentsID;
            OperationChallanDetail.ProductHSNID = DeliveryDetailGrid._options.dataSource[h].ProductHSNID;
            OperationChallanDetail.ReceiptQuantity = 0;
            OperationChallanDetail.IssueQuantity = DeliveryDetailGrid._options.dataSource[h].PurchaseQuantity;
            // OperationChallanDetail.ReceiptOuterCarton=DeliveryDetailGrid._options.dataSource[h].IssueOuterCarton;
            OperationChallanDetail.IssueOuterCarton = DeliveryDetailGrid._options.dataSource[h].IssueOuterCarton;
            OperationChallanDetail.InnerCarton = DeliveryDetailGrid._options.dataSource[h].InnerCarton;
            OperationChallanDetail.QuantityPerPack = DeliveryDetailGrid._options.dataSource[h].QuantityPerPack;
            OperationChallanDetail.WeightPerOuterCarton = DeliveryDetailGrid._options.dataSource[h].WeightPerOuterCarton;
            OperationChallanDetail.ReceiptTotalWeight = 0;
            // OperationChallanDetail.IssueTotalWeight=DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingDetailsID;
            OperationChallanDetail.Unit = DeliveryDetailGrid._options.dataSource[h].PurchaseUnit;
            OperationChallanDetail.Rate = DeliveryDetailGrid._options.dataSource[h].PurchaseRate;
            OperationChallanDetail.GrossAmount = DeliveryDetailGrid._options.dataSource[h].TotalAmount;
            OperationChallanDetail.DiscountPercentage = DeliveryDetailGrid._options.dataSource[h].Disc;
            OperationChallanDetail.DiscountAmount = (Number(DeliveryDetailGrid._options.dataSource[h].BasicAmount) - Number(DeliveryDetailGrid._options.dataSource[h].AfterDisAmt)).toFixed(2);
            OperationChallanDetail.BasicAmount = DeliveryDetailGrid._options.dataSource[h].BasicAmount;
            OperationChallanDetail.TaxableAmount = DeliveryDetailGrid._options.dataSource[h].TaxableAmount;
            OperationChallanDetail.GSTPercentage = DeliveryDetailGrid._options.dataSource[h].GSTTaxPercentage;
            OperationChallanDetail.CGSTPercentage = DeliveryDetailGrid._options.dataSource[h].CGSTTaxPercentage;
            OperationChallanDetail.SGSTPercentage = DeliveryDetailGrid._options.dataSource[h].SGSTTaxPercentage;
            OperationChallanDetail.IGSTPercentage = DeliveryDetailGrid._options.dataSource[h].IGSTTaxPercentage;
            OperationChallanDetail.CGSTAmount = DeliveryDetailGrid._options.dataSource[h].CGSTAmt;
            OperationChallanDetail.SGSTAmount = DeliveryDetailGrid._options.dataSource[h].SGSTAmt;
            OperationChallanDetail.IGSTAmount = DeliveryDetailGrid._options.dataSource[h].IGSTAmt;
            OperationChallanDetail.NetAmount = DeliveryDetailGrid._options.dataSource[h].TotalAmount;
            // OperationChallanDetail.LandedRate=DeliveryDetailGrid._options.dataSource[h].DeliveryOrderBookingDetailsID;
            OperationChallanDetail.WarehouseID = DeliveryDetailGrid._options.dataSource[h].WarehouseID;
            OperationChallanDetail.PackingDescription = "";
            OperationChallanDetail.ShipperLengthCM = DeliveryDetailGrid._options.dataSource[h].ShipperLengthCM;
            OperationChallanDetail.ShipperWidthCM = DeliveryDetailGrid._options.dataSource[h].ShipperWidthCM;
            OperationChallanDetail.ShipperHeightCM = DeliveryDetailGrid._options.dataSource[h].ShipperHeightCM;
            OperationChallanDetail.CBCM = DeliveryDetailGrid._options.dataSource[h].CBCM;
            OperationChallanDetail.CFT = DeliveryDetailGrid._options.dataSource[h].CFT;
            OperationChallanDetail.TotalCFT = TtlCFT;

            jsonObjectsChallanDetyail.push(OperationChallanDetail);
        }
    }

    var jsonObjectsRecordTax = [];
    var OperationRecordTax = {};

    if (ChargesGrid.length > 0) {
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
    }

    jsonObjectsChallanDetyailmain = JSON.stringify(jsonObjectsChallanDetyailmain);
    jsonObjectsChallanDetyail = JSON.stringify(jsonObjectsChallanDetyail);
    jsonObjectsRecordTax = JSON.stringify(jsonObjectsRecordTax);

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
            if (GblStatus === "Update") {
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_ChallanDetail.asmx/UpdateChallanDetail",
                    data: '{FGTransactionID:' + JSON.stringify(document.getElementById("TxtCHDID").value) + ',jsonObjectsChallanDetyailmain:' + jsonObjectsChallanDetyailmain + ',jsonObjectsChallanDetyail:' + jsonObjectsChallanDetyail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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
            }
            else {
                document.getElementById("LOADER").style.display = "block";

                $.ajax({
                    type: "POST",
                    url: "WebService_ChallanDetail.asmx/SaveChallanDetail",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsChallanDetyailmain:' + jsonObjectsChallanDetyailmain + ',jsonObjectsChallanDetyail:' + jsonObjectsChallanDetyail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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
                            swal("Saved!", "Your data saved", "success");
                            location.reload();
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });
});

$("#EditCHButton").click(function () {
    var TxtPOID = document.getElementById("TxtCHDID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        alert("Please select any record to edit or view !");
        return false;
    }

    document.getElementById("LOADER").style.display = "block";

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnPrint").disabled = false;
    GblStatus = "Update";
    FinishGoodDetail = [];

    $("#FinishGoodsGrid").dxDataGrid({
        dataSource: FinishGoodDetail
    });

    BlankField();

    document.getElementById("TxtDelNote").value = GetProcessSelectedListData[0].VoucherNo;
    $("#VoucherDate").dxDateBox({ value: GetProcessSelectedListData[0].VoucherDate });
    $("#TxtClientID").dxSelectBox({ value: GetProcessSelectedListData[0].LedgerID });
    $("#TxtConsigneeID").dxSelectBox({ value: GetProcessSelectedListData[0].ConsigneeID });
    $("#SelTransporter").dxSelectBox({ value: Number(GetProcessSelectedListData[0].TransporterID) });

    document.getElementById("TxtBasicAmt").value = GetProcessSelectedListData[0].TotalBasicAmount;
    document.getElementById("TxtTotalTax").value = GetProcessSelectedListData[0].TotalTaxAmount;
    document.getElementById("TxtRoundTaxAmt").value = Number(Number(GetProcessSelectedListData[0].NetAmount) - Number(GetProcessSelectedListData[0].TotalTaxAmount) - Number(GetProcessSelectedListData[0].TotalBasicAmount)).toFixed(2);
    document.getElementById("TxtNetAmt").value = GetProcessSelectedListData[0].NetAmount;
    document.getElementById("TxtBoxes").value = GetProcessSelectedListData[0].TotalOuterCarton;
    document.getElementById("TxtTotalDispatchedQty").value = GetProcessSelectedListData[0].TotalQuantity;
    document.getElementById("TxtTotalWt").value = "";
    document.getElementById("TxtVehicleNo").value = GetProcessSelectedListData[0].VehicleNo;
    document.getElementById("TxtPODNO").value = GetProcessSelectedListData[0].PODNo;

    LblSupplierStateTin = GetProcessSelectedListData[0].StateTinNo;

    $("#ModeOfTransport").dxSelectBox({
        value: GetProcessSelectedListData[0].ModeOfTransport
    });
    document.getElementById("TxtRemark").value = GetProcessSelectedListData[0].Narration;

    $.ajax({
        type: "POST",
        async: false,
        url: "WebService_ChallanDetail.asmx/AfterEditOrderDetailGrid",
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
            //document.getElementById("LOADER").style.display = "none";
            var GetDataOrderDetailGrid = JSON.parse(res);
            ObjOrderDetailGrid = [];
            ObjOrderDetailGrid = GetDataOrderDetailGrid;

            $("#OrderDetailGrid").dxDataGrid({
                dataSource: ObjOrderDetailGrid
            });
        }
    });

    $.ajax({
        type: "POST",
        async: false,
        url: "WebService_ChallanDetail.asmx/GetDataAfterEdit_ChargesGrid",
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
        url: "WebService_ChallanDetail.asmx/GetDataAfterEdit",
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
            //document.getElementById("LOADER").style.display = "none";
            var GetDataAfterEdit = JSON.parse(res);

            ObjOrderDeliveryData = GetDataAfterEdit;
            $("#DeliveryDetailGrid").dxDataGrid({
                dataSource: ObjOrderDeliveryData
            });
        }
    });

    document.getElementById("LOADER").style.display = "none";

    document.getElementById("EditCHButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditCHButton").setAttribute("data-target", "#largeModal");
});

$("#DeleteCHButton").click(function () {
    var TxtPOID = document.getElementById("TxtCHDID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        alert("Please select any record to edit or view !");
        return false;
    }

    //$.ajax({
    //    type: "POST",
    //    url: "WebService_ChallanDetail.asmx/CheckPermission",
    //    data: '{TransactionID:' + JSON.stringify(TxtPOID) + '}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (results) {
    //        var res = JSON.stringify(results);
    //        res = res.replace(/"d":/g, '');
    //        res = res.replace(/{/g, '');
    //        res = res.replace(/}/g, '');
    //        res = res.substr(1);
    //        res = res.slice(0, -1);

    //        if (res === "Exist") {
    //            swal("", "This item is used in another process..! Record can not be delete.", "error");
    //            return false;
    //        }
    //        else {

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Content!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
        function () {
            document.getElementById("LOADER").style.display = "block";

            $.ajax({
                type: "POST",
                url: "WebService_ChallanDetail.asmx/DeleteChallanDetail",
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

                    document.getElementById("LOADER").style.display = "none";
                    if (res === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert(jqXHR);
                }
            });

        });

    //}

    //   }
    //});

});

$("#BtnPrint").click(function () {
    var TxtPOID = Number(document.getElementById("TxtCHDID").value);
    if (TxtPOID <= 0) return;

    var url = "Print_DispatchDetails.aspx?TransactionID=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteCHButton").click();
});

function BlankField() {
    //  document.getElementById("TxtCHDID").value = "";
    document.getElementById("TxtDelNote").value = "";
    $("#VoucherDate").dxDateBox({ value: null });
    $("#TxtClientID").dxSelectBox({ value: null });
    $("#TxtConsigneeID").dxSelectBox({ value: null });

    document.getElementById("TxtAddress").value = "";
    document.getElementById("TxtConsigneeAddress").value = "";

    document.getElementById("TxtBasicAmt").value = "";
    document.getElementById("TxtTotalTax").value = "";
    document.getElementById("TxtRoundTaxAmt").value = "";
    document.getElementById("TxtNetAmt").value = "";
    document.getElementById("TxtBoxes").value = "";
    document.getElementById("TxtTotalDispatchedQty").value = "";
    document.getElementById("TxtTotalWt").value = "";
    document.getElementById("TxtVehicleNo").value = "";

    document.getElementById("TxtCGSTAmt").value = "";
    document.getElementById("TxtSGSTAmt").value = "";
    document.getElementById("TxtIGSTAmt").value = "";
    document.getElementById("TxtAfterDisAmt").value = "";
    document.getElementById("Txt_TaxAbleSum").value = "";
    $("#ModeOfTransport").dxSelectBox({ value: null });
    document.getElementById("TxtPODNO").value = "";
    document.getElementById("TxtRemark").value = "";

}

function GetConsignee(CID) {
    $.ajax({
        type: "POST",
        url: "WebService_ChallanDetail.asmx/GetConsigneeData",
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
                dataSource: RES1
            });
            if (RES1.length > 0) {
                $("#TxtConsigneeID").dxSelectBox({
                    value: RES1[0].ConsigneeID
                });
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}