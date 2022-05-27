"use strict";
//PicklistGrid = GRNListGrid
//StockBatchWiseGrid = GRNDetailsGrid
var GblStatus = "";
var CreateGridData = [];
var GblGRSNo = "";
var Groupdata = "";
var ValRES1 = "";
var GRNGridSelectedData = [];
var GRSGridSelectedData = [];
var GRNTransactionID = 0;
var GRSTransactionID = 0;

//radioGroup();

Initialize_Devcontrols();

function Initialize_Devcontrols() {
    $("#GRSDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });

    $("#FromDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });

    $("#ToDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });

    $("#DNDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });

    $("#GEDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });
    RefreshGRNList();
    RefreshGRNDetailsList();
}


// GEnerate Purchase GRS Voucher No.
function CreateGRSNO() {
    var prefix = "IS";

    $.ajax({
        type: "POST",
        url: "WebService_ItemPurchaseGRS.asmx/GetGRSNO",
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
            GblGRSNo = "";
            if (res !== "") {
                GblGRSNo = res;
                document.getElementById("TxtGRSNo").value = GblGRSNo;
            }
        }
    });
}


//Get GRS Vouchers List
GRSVouchersList();
function GRSVouchersList() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_ItemPurchaseGRS.asmx/GRSVouchersList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var RES1 = JSON.parse(res.toString());

            $("#PurchaseGRSListGrid").dxDataGrid({
                dataSource: RES1,
                showBorders: true,
                paging: {
                    enabled: false
                },
                showRowLines: true,
                allowSorting: false,
                allowColumnResizing: true,
                selection: { mode: "single" },
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
                onRowPrepared: function (e) {
                    if (e.rowType === "header") {
                        e.rowElement.css('background', '#509EBC');
                        e.rowElement.css('color', 'white');
                        e.rowElement.css('font-weight', 'bold');
                    }
                    e.rowElement.css('fontSize', '11px');
                },
                onSelectionChanged: function (GRSList) {
                    GRSGridSelectedData = [];
                    GRSGridSelectedData = GRSList.selectedRowsData;
                    document.getElementById("TxtGRSID").value = GRSGridSelectedData[0].GRSTransactionID;
                    GRSTransactionID = GRSGridSelectedData[0].GRSTransactionID;
                    GRNTransactionID = GRSGridSelectedData[0].GRNTransactionID;
                },
                columns: [
                    { dataField: "GRSTransactionID", visible: false },
                    { dataField: "GRNTransactionID", visible: false },
                    { dataField: "LedgerID", visible: false },
                    { dataField: "ReceivedByID", visible: false },
                    { dataField: "MaxVoucherNo", visible: true, caption: "Ref. GRS No.", width: 100 },
                    { dataField: "VoucherNo", visible: true, caption: "GRS No.", width: 120 },
                    { dataField: "VoucherDate", visible: true, caption: "GRS Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
                    { dataField: "GRNNo", visible: true, caption: "GRN No.", width: 120 },
                    { dataField: "GRNDate", visible: true, caption: "GRN Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
                    { dataField: "LedgerName", visible: true, caption: "Supplier", width: 250 },
                    { dataField: "TransporterBillNo", visible: true, caption: "Transporter Bill No.", width: 150 },
                    { dataField: "DeliveryNoteNo", visible: true, caption: "D.N. No.", width: 120 },
                    { dataField: "DeliveryNoteDate", visible: true, caption: "D.N. Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
                    { dataField: "GateEntryNo", visible: true, caption: "G.E. No.", width: 120 },
                    { dataField: "GateEntryDate", visible: true, caption: "G.E. Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
                    { dataField: "Transporter", visible: true, caption: "Transporter", width: 150 },
                    { dataField: "LRNOVehicleNo", visible: true, caption: "LR NO/VehicleNo", width: 120 },
                    { dataField: "ReceivedBy", visible: true, caption: "Received By", width: 100 },
                    { dataField: "GRNNarration", visible: false, caption: "GRN Remark" },
                    { dataField: "Narration", visible: true, caption: "Remark", width: 300 },
                    { dataField: "FYear", visible: true, caption: "F Year", width: 100 }
                ]
            });
        }
    });
}

//Refresh GRN List Grid 
RefreshGRNList();
function RefreshGRNList() {

    $("#GRNListGrid").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        allowSorting: false,
        selection: { mode: "single" },
        filterRow: { visible: true, applyFilter: "auto" },
        sorting: {
            mode: "none" // or "multiple" | "single"
        },
        height: function () {
            return window.innerHeight / 2.5;
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
        onSelectionChanged: function (selectedItems) {
            GRNGridSelectedData = [];
            GRNGridSelectedData = selectedItems.selectedRowsData;

            document.getElementById("TxtGRNTransactionID").value = GRNGridSelectedData[0].GRNTransactionID;
            document.getElementById("TxtLedgerID").value = GRNGridSelectedData[0].LedgerID;
            document.getElementById("TxtReceivedByID").value = GRNGridSelectedData[0].ReceivedByID;
            document.getElementById("TxtGRNNo").value = GRNGridSelectedData[0].GRNNo;
            document.getElementById("TxtLRNo").value = GRNGridSelectedData[0].LRNOVehicleNo;
            document.getElementById("TxtTransporter").value = GRNGridSelectedData[0].Transporter;
            document.getElementById("TxtReceivedBy").value = GRNGridSelectedData[0].ReceivedBy;
            document.getElementById("TxtGRNNarration").value = GRNGridSelectedData[0].GRNRemark;

            document.getElementById("TxtDNNo").value = GRNGridSelectedData[0].DeliveryNoteNo;
            //$("#DNDate").dxDateBox({
            //    value: GRNGridSelectedData[0].DeliveryNoteDate,
            //});
            document.getElementById("TxtGENo").value = GRNGridSelectedData[0].GateEntryNo;
            //$("#GEDate").dxDateBox({
            //    value: GRNGridSelectedData[0].GateEntryDate,
            //});

            GRNTransactionID = GRNGridSelectedData[0].GRNTransactionID;
            $.ajax({
                type: "POST",
                url: "WebService_ItemPurchaseGRS.asmx/GetGRNDetails",
                data: '{GRNTransactionID:' + JSON.stringify(GRNTransactionID) + '}',
                //   data: '{ItemId:' + JSON.stringify(ItemId) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var GRNData = JSON.parse(res.toString());
                    //BatchWiseGrid = GRNData;

                    var formula = "";
                    var ReceiptQtySU = 0;
                    var ReceiptQtyPU = 0;
                    var ItemGroupNameID = 0;
                    var UnitPerPacking = 1, WtPerPacking = 0, ReceiptWtPerpacking = 0, UnitDecimalPlace = 0, SizeW = 1;
                    for (var i = 0; i < GRNData.length; i++) {
                        formula = GRNData[i].ConversionFormula;
                        ReceiptQtySU = GRNData[i].ChallanQuantity;
                        ReceiptQtyPU = 0;
                        UnitPerPacking = GRNData[i].UnitPerPacking;
                        SizeW = GRNData[i].SizeW;
                        WtPerPacking = GRNData[i].WtPerPacking;
                        ReceiptWtPerpacking = GRNData[i].ReceiptWtPerPacking;
                        UnitDecimalPlace = GRNData[i].ConvertedUnitDecimalPlace;
                        ItemGroupNameID = GRNData[i].ItemGroupNameID;
                        //ConversionFactor = GRNData[i].ConversionFactor;

                        if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
                            formula = formula.split('e.').join('');
                            formula = formula.replace("Quantity", "ReceiptQtySU");

                            var n = formula.search("UnitPerPacking");
                            if (n > 0) {
                                if (Number(UnitPerPacking) > 0) {
                                    if (Number(ReceiptWtPerpacking) > 0) {
                                        WtPerPacking = Number(ReceiptWtPerpacking);
                                    }
                                    ReceiptQtyPU = eval(formula);
                                    ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                                }
                            } else {
                                n = formula.search("SizeW");
                                if (n > 0) {
                                    if (Number(SizeW) > 0) {

                                        ReceiptQtyPU = eval(formula);
                                        ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                                    }
                                } else {
                                    ReceiptQtyPU = eval(formula);
                                    ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                                }
                            }
                        } else {
                            ReceiptQtyPU = Number(ReceiptQtySU);
                        }

                        GRNData[i].ChallanQuantityInPurchaeUnit = ReceiptQtyPU;
                    }
                    $("#GRNDetailsGrid").dxDataGrid({
                        dataSource: GRNData
                    });
                }
            });
        },
        columns: [
            { dataField: "VoucherID", visible: false },
            { dataField: "GRNTransactionID", visible: false },
            { dataField: "LedgerID", visible: false },
            { dataField: "ReceivedByID", visible: false },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref. GRN No.", width: 100 },
            { dataField: "GRNNo", visible: true, caption: "GRN No.", width: 120 },
            { dataField: "GRNDate", visible: true, caption: "GRN Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "LedgerName", visible: true, caption: "Supplier", width: 250 },
            { dataField: "DeliveryNoteNo", visible: true, caption: "D.N. No.", width: 120 },
            { dataField: "DeliveryNoteDate", visible: true, caption: "D.N. Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "GateEntryNo", visible: true, caption: "G.E. No.", width: 120 },
            { dataField: "GateEntryDate", visible: true, caption: "G.E. Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "Transporter", visible: true, caption: "Transporter", width: 150 },
            { dataField: "LRNOVehicleNo", visible: true, caption: "LR NO/VehicleNo", width: 120 },
            { dataField: "ReceivedBy", visible: true, caption: "Received By", width: 100 },
            { dataField: "GRNNarration", visible: false, caption: "GRN Remark" },
            { dataField: "FYear", visible: true, caption: "F Year", width: 100 }
        ]
    });
    //$("#GRNListGrid").dxDataGrid('instance').clearFilter();
}

RefreshGRNDetailsList();
function RefreshGRNDetailsList() {

    $("#GRNDetailsGrid").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        allowSorting: false,
        height: function () {
            return window.innerHeight / 4;
        },
        selection: { mode: "single" },
        filterRow: { visible: false, applyFilter: "auto" },
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
            { dataField: "sel", visible: false },
            { dataField: "VoucherID", visible: false },
            { dataField: "GRNTransactionID", visible: false },
            { dataField: "PurchaseTransactionID", visible: false },
            { dataField: "LedgerID", visible: false },
            { dataField: "ItemID", visible: false },
            { dataField: "ItemGroupID", visible: false },
            { dataField: "ItemGroupNameID", visible: false },
            { dataField: "PONo", visible: true, caption: "P.O. No.", width: 150 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Group Name", width: 200 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 500 },
            { dataField: "ItemDescription", visible: false, caption: "Item Description" },
            { dataField: "ChallanQuantity", visible: true, caption: "Receipt Qty(S.U.)", width: 150 },
            { dataField: "ReceiptWtPerPacking", visible: false, caption: "Receipt Wt/Packing" },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
            { dataField: "ChallanQuantityInPurchaeUnit", visible: true, caption: "Receipt Qty(P.U.)", width: 150 },
            { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 100 },
            { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula", width: 80 },
            { dataField: "ConvertedUnitDecimalPlace", visible: false, caption: "ConvertedUnitDecimalPlace", width: 80 },
            { dataField: "UnitPerPacking", visible: false },
            { dataField: "WtperPacking", visible: false },
            { dataField: "SizeW", visible: false }
        ]
    });
}

RefreshOverheadGrid();
function RefreshOverheadGrid() {
    var OverheadGridData = [];
    try {
        $.ajax({
            type: "POST",
            url: "WebService_ItemPurchaseGRS.asmx/RefreshOverheadGrid",
            data: '{FlagStatus:' + JSON.stringify(GblStatus) + ',GRSTransactionID:' + JSON.stringify(GRSTransactionID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";
                OverheadGridData = JSON.parse(res.toString());
                setOverheadGrid(OverheadGridData);
            }
        });
    } catch (e) {
        console.log(e);
    }
}


function setOverheadGrid(OverheadGridData) {
    $("#OverheadGrid").dxDataGrid({
        dataSource: OverheadGridData,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        allowSorting: false,
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowUpdating: true
        },
        scrolling: { mode: 'infinite' },
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
        onEditingStart: function (e) {
            if (e.column.dataField === "QtyWeight" || e.column.dataField === "Rate" || e.column.dataField === "Amount") {
                e.cancel = false;
                if (e.column.dataField === "Amount" && e.key.Rate > 0) {
                    e.cancel = true;
                }
            } else {
                e.cancel = true;
            }
        },
        onRowUpdated: function (e) {
            if (e.key.Rate > 0 && e.key.QtyWeight > 0) {
                if (e.key.RateType === 'Rate/Kg') {
                    e.key.Amount = (Number(e.key.QtyWeight) * Number(e.key.Rate)).toFixed(2);
                } else if (e.key.RateType === 'Rate/Ton') {
                    e.key.Amount = (Number(e.key.QtyWeight) / 1000 * Number(e.key.Rate)).toFixed(2);
                }
            }
        },
        columns: [
            { dataField: "sel", visible: false },
            { dataField: "HeadID", visible: false },
            { dataField: "Head", visible: true, caption: "Head Name", width: 250 },
            { dataField: "RateType", visible: true, caption: "Rate Type", width: 150 },
            { dataField: "QtyWeight", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Wt./Unit", width: 100 },
            { dataField: "Rate", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Rate", width: 100 },
            { dataField: "Amount", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Amount", width: 100 }
        ]
    });
}

$("#CreateButton").click(function () {

    GblStatus = "";
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("GRSPrintButton").disabled = true;
    $.ajax({
        type: "POST",
        url: "WebService_ItemPurchaseGRS.asmx/GetGRNList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var RES1 = JSON.parse(res.toString());
            $("#GRNListGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });

    $("#GRNDetailsGrid").dxDataGrid({
        dataSource: []
    });
    $('#GRNListGrid').dxDataGrid('instance').clearFilter();

    CreateGRSNO();
    document.getElementById("TxtGRSNo").value = GblGRSNo;
    document.getElementById("TxtGRNTransactionID").value = "";
    document.getElementById("TxtLedgerID").value = "";
    document.getElementById("TxtReceivedByID").value = "";
    document.getElementById("TxtGRNNo").value = "";
    document.getElementById("TxtDNNo").value = "";
    document.getElementById("TxtGENo").value = "";
    document.getElementById("TxtLRNo").value = "";
    document.getElementById("TxtBillNo").value = "";
    document.getElementById("TxtTransporter").value = "";
    document.getElementById("TxtReceivedBy").value = "";
    document.getElementById("TxtGRNNarration").value = "";
    document.getElementById("TxtNarration").value = "";

    $("#GRSDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });

    $("#DNDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });
    $("#GEDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#BtnSave").click(function () {
    if (Number(GRNTransactionID) <= 0) {
        DevExpress.ui.notify("Please select valid grn !", "error", 1000);
        return false;
    } else if (document.getElementById("TxtGRNNo").value.trim() === "") {
        DevExpress.ui.notify("Please select valid grn !", "error", 1000);
        return false;
    } else if (Number(document.getElementById("TxtLedgerID").value) === 0) {
        DevExpress.ui.notify("Please select valid grn !", "error", 1000);
        return false;
    } else if (Number(document.getElementById("TxtGRNTransactionID").value) === 0) {
        DevExpress.ui.notify("Please select valid grn !", "error", 1000);
        return false;
    }
    if (document.getElementById("TxtBillNo").value.trim() === "") {
        DevExpress.ui.notify("Please enter valid transporter bill no. !", "error", 1000);
        return false;
    }
    var grnDetailGrid = $('#GRNDetailsGrid').dxDataGrid('instance');
    if (grnDetailGrid.totalCount() <= 0) {
        DevExpress.ui.notify("Please select valid grn !", "error", 1000);
        return false;
    }
    var OverheadGrid = $('#OverheadGrid').dxDataGrid('instance');
    var OverheadGridGridRow = OverheadGrid.totalCount();
    var flag = false;
    for (var i = 0; i < OverheadGridGridRow; i++) {
        if (Number(OverheadGrid._options.dataSource[i].Amount) > 0) {
            flag = true;
        }
    }
    if (flag === false) {
        DevExpress.ui.notify("Please enter the overhead charges details!", "error", 1000);
        return false;
    }

    var prefix = "GRS";
    var VoucherDate = $('#GRSDate').dxDateBox('instance').option('value');
    var DNDate = $('#DNDate').dxDateBox('instance').option('value');
    var GEDate = $('#GEDate').dxDateBox('instance').option('value');
    var TxtNarration = document.getElementById("TxtNarration").value;

    var TtlAmount = 0;
    for (var C = 0; C < OverheadGridGridRow; C++) {
        TtlAmount = TtlAmount + Number(OverheadGrid._options.dataSource[C].Amount);
    }

    var jsonObjectsGRSTransactionMain = [];
    var OperationGRSTransactionMain = {};

    if (OverheadGridGridRow > 0) {
        //for (var A = 0; A < OverheadGridGridRow; A++) {

        OperationGRSTransactionMain = {};
        OperationGRSTransactionMain.VoucherID = -19;
        OperationGRSTransactionMain.LedgerID = Number(document.getElementById("TxtLedgerID").value);
        OperationGRSTransactionMain.VoucherDate = VoucherDate;
        OperationGRSTransactionMain.GRNTransactionID = Number(document.getElementById("TxtGRNTransactionID").value);
        OperationGRSTransactionMain.TotalOverheadAmount = TtlAmount;
        OperationGRSTransactionMain.DeliveryNoteNo = document.getElementById("TxtDNNo").value.trim();
        OperationGRSTransactionMain.DeliveryNoteDate = DNDate;
        OperationGRSTransactionMain.Transporter = document.getElementById("TxtTransporter").value.trim();
        OperationGRSTransactionMain.GateEntryNo = document.getElementById("TxtGENo").value.trim();
        OperationGRSTransactionMain.GateEntryDate = GEDate;
        OperationGRSTransactionMain.LRNOVehicleNo = document.getElementById("TxtLRNo").value.trim();
        OperationGRSTransactionMain.ReceivedBy = Number(document.getElementById("TxtReceivedByID").value);
        OperationGRSTransactionMain.TransporterBillNo = document.getElementById("TxtBillNo").value.trim();
        OperationGRSTransactionMain.GRNNarration = document.getElementById("TxtGRNNarration").value.trim();
        OperationGRSTransactionMain.Narration = TxtNarration;
        jsonObjectsGRSTransactionMain.push(OperationGRSTransactionMain);
        //}


        var jsonObjectsGRSTransactionDetail = [];
        var OperationGRSTransactionDetail = {};

        for (var e = 0; e < OverheadGridGridRow; e++) {
            if (Number(OverheadGrid._options.dataSource[e].Amount) > 0) {

                OperationGRSTransactionDetail = {};
                OperationGRSTransactionDetail.GRNTransactionID = Number(document.getElementById("TxtGRNTransactionID").value);
                OperationGRSTransactionDetail.HeadID = OverheadGrid._options.dataSource[e].HeadID;
                OperationGRSTransactionDetail.HeadName = OverheadGrid._options.dataSource[e].Head;
                OperationGRSTransactionDetail.Quantity = Number(OverheadGrid._options.dataSource[e].QtyWeight);
                OperationGRSTransactionDetail.RateType = OverheadGrid._options.dataSource[e].RateType;
                OperationGRSTransactionDetail.Rate = OverheadGrid._options.dataSource[e].Rate;
                OperationGRSTransactionDetail.Amount = OverheadGrid._options.dataSource[e].Amount;
                OperationGRSTransactionDetail.TransID = e + 1;
                jsonObjectsGRSTransactionDetail.push(OperationGRSTransactionDetail);
            }
        }

        var grnDetailGridRow = grnDetailGrid.totalCount();
        var jsonObjectsGRSItemTransactionDetail = [];
        var OperationGRSItemTransactionDetail = {};
        if (OverheadGridGridRow > 0 && grnDetailGridRow > 0) {

            var Ttlqty = 0;
            for (var A = 0; A < grnDetailGridRow; A++) {
                Ttlqty = Ttlqty + Number(grnDetailGrid._options.dataSource[A].ChallanQuantityInPurchaeUnit);
            }
            Ttlqty = Ttlqty.toFixed(3);
            for (var x = 0; x < grnDetailGridRow; x++) {
                for (e = 0; e < OverheadGridGridRow; e++) {
                    if (Number(OverheadGrid._options.dataSource[e].Amount) > 0) {

                        OperationGRSItemTransactionDetail = {};
                        OperationGRSItemTransactionDetail.GRNTransactionID = Number(document.getElementById("TxtGRNTransactionID").value);
                        OperationGRSItemTransactionDetail.ItemID = grnDetailGrid._options.dataSource[x].ItemID;
                        OperationGRSItemTransactionDetail.PurchaseTransactionID = grnDetailGrid._options.dataSource[x].PurchaseTransactionID;
                        OperationGRSItemTransactionDetail.PurchaseOrderNo = grnDetailGrid._options.dataSource[x].PONo;
                        OperationGRSItemTransactionDetail.ReceiptQtyInPurchaseUnit = Number(grnDetailGrid._options.dataSource[x].ChallanQuantityInPurchaeUnit);
                        OperationGRSItemTransactionDetail.ReceiptQtyInStockUnit = Number(grnDetailGrid._options.dataSource[x].ChallanQuantity);
                        OperationGRSItemTransactionDetail.PurchaseUnit = grnDetailGrid._options.dataSource[x].PurchaseUnit;
                        OperationGRSItemTransactionDetail.StockUnit = grnDetailGrid._options.dataSource[x].StockUnit;
                        OperationGRSItemTransactionDetail.HeadID = OverheadGrid._options.dataSource[e].HeadID;
                        OperationGRSItemTransactionDetail.HeadName = OverheadGrid._options.dataSource[e].Head;
                        OperationGRSItemTransactionDetail.RateType = OverheadGrid._options.dataSource[e].RateType;
                        OperationGRSItemTransactionDetail.Rate = OverheadGrid._options.dataSource[e].Rate;
                        if (Number(OverheadGrid._options.dataSource[e].Rate) > 0) {
                            OperationGRSItemTransactionDetail.ActualRate = OverheadGrid._options.dataSource[e].Rate;
                        } else if (OverheadGrid._options.dataSource[e].RateType === 'Rate/Kg') {
                            OperationGRSItemTransactionDetail.ActualRate = (Number(OverheadGrid._options.dataSource[e].Amount) / Ttlqty).toFixed(3);
                        } else if (OverheadGrid._options.dataSource[e].RateType === 'Rate/Ton') {
                            OperationGRSItemTransactionDetail.ActualRate = Number(Number(OverheadGrid._options.dataSource[e].Amount) / (Ttlqty / 1000)).toFixed(3);
                        }

                        OperationGRSItemTransactionDetail.Amount = (Number(OperationGRSItemTransactionDetail.ActualRate) * Number(grnDetailGrid._options.dataSource[x].ChallanQuantityInPurchaeUnit)).toFixed(2);
                        jsonObjectsGRSItemTransactionDetail.push(OperationGRSItemTransactionDetail);
                    }
                }
            }
        }

        jsonObjectsGRSTransactionMain = JSON.stringify(jsonObjectsGRSTransactionMain);
        jsonObjectsGRSTransactionDetail = JSON.stringify(jsonObjectsGRSTransactionDetail);
        jsonObjectsGRSItemTransactionDetail = JSON.stringify(jsonObjectsGRSItemTransactionDetail);
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
            if (GblStatus === "Update") {
                //alert(JSON.stringify(jsonObjectsRecordMain));
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_ItemPurchaseGRS.asmx/UpdateGRS",
                    data: '{GRSTransactionID:' + JSON.stringify(document.getElementById("TxtGRSID").value) + ',jsonObjectsGRSTransactionMain:' + jsonObjectsGRSTransactionMain + ',jsonObjectsGRSTransactionDetail:' + jsonObjectsGRSTransactionDetail + ',jsonObjectsGRSItemTransactionDetail:' + jsonObjectsGRSItemTransactionDetail + '}',
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
                            document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                            swal("Updated!", "Your data Updated", "success");

                            location.reload();
                        }
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Group Name allready Exist..\n Please enter another Group Name..", "");
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
                    url: "WebService_ItemPurchaseGRS.asmx/SaveGRSData",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsGRSTransactionMain:' + jsonObjectsGRSTransactionMain + ',jsonObjectsGRSTransactionDetail:' + jsonObjectsGRSTransactionDetail + ',jsonObjectsGRSItemTransactionDetail:' + jsonObjectsGRSItemTransactionDetail + '}',
                    // data: '{prefix:' + JSON.stringify(prefix) + '}',
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
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Process Name allready Exist..\n Please enter another Process Name..", "");
                        }

                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });

});

$("#BtnNew").click(function () {
    location.reload();
});

$("#DeleteButton").click(function () {
    var TxtGRSID = document.getElementById("TxtGRSID").value;
    if (TxtGRSID === "" || TxtGRSID === null || TxtGRSID === undefined) {
        alert("Please select any GRS voucher to delete..!");
        return false;
    }
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
                url: "WebService_ItemPurchaseGRS.asmx/DeleteGRSVoucher",
                data: '{GRSTransactionID:' + JSON.stringify(document.getElementById("TxtGRSID").value) + '}',
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

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

$("#EditButton").click(function () {
    var TxtGRSID = document.getElementById("TxtGRSID").value;

    if (Number(TxtGRSID) === 0 || TxtGRSID === "" || TxtGRSID === null || TxtGRSID === undefined) {
        alert("Please select valid GRS voucher to edit or view..!");
        return false;
    }

    if (Number(GRNTransactionID) === 0 || GRNTransactionID === "" || GRNTransactionID === null || GRNTransactionID === undefined) {
        alert("Please select valid GRS voucher to edit or view..!");
        return false;
    }

    GblStatus = "Update";

    document.getElementById("GRSPrintButton").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_ItemPurchaseGRS.asmx/GetGRNList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";
                var RES1 = JSON.parse(res.toString());
                $("#GRNListGrid").dxDataGrid({
                    dataSource: RES1
                });
            }
        });
    } catch (e) {
        console.log(e);
    }

    $("#GRNDetailsGrid").dxDataGrid({
        dataSource: []
    });

    $.ajax({
        type: "POST",
        url: "WebService_ItemPurchaseGRS.asmx/GetGRNDetails",
        data: '{GRNTransactionID:' + JSON.stringify(GRNTransactionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var GRNData = JSON.parse(res.toString());
            //BatchWiseGrid = GRNData;

            var formula = "";
            var ReceiptQtySU = 0;
            var ReceiptQtyPU = 0;
            var UnitPerPacking = 1, WtPerPacking = 0, ReceiptWtPerpacking = 0, UnitDecimalPlace = 0, SizeW = 1;
            for (var i = 0; i < GRNData.length; i++) {
                formula = GRNData[i].ConversionFormula;
                ReceiptQtySU = GRNData[i].ChallanQuantity;
                ReceiptQtyPU = 0;
                UnitPerPacking = GRNData[i].UnitPerPacking;
                SizeW = GRNData[i].SizeW;
                WtPerPacking = GRNData[i].WtPerPacking;
                ReceiptWtPerpacking = GRNData[i].ReceiptWtPerPacking;
                UnitDecimalPlace = GRNData[i].ConvertedUnitDecimalPlace;
                //ItemGroupNameID = GRNData[i].ItemGroupNameID;
                //ConversionFactor = GRNData[i].ConversionFactor;

                if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
                    formula = formula.split('e.').join('');
                    formula = formula.replace("Quantity", "ReceiptQtySU");

                    var n = formula.search("UnitPerPacking");
                    if (n > 0) {
                        if (Number(UnitPerPacking) > 0) {
                            if (Number(ReceiptWtPerpacking) > 0) {
                                WtPerPacking = Number(ReceiptWtPerpacking);
                            }
                            ReceiptQtyPU = eval(formula);
                            ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                        }
                    } else {
                        n = formula.search("SizeW");
                        if (n > 0) {
                            if (Number(SizeW) > 0) {

                                ReceiptQtyPU = eval(formula);
                                ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                            }
                        } else {
                            ReceiptQtyPU = eval(formula);
                            ReceiptQtyPU = Number(ReceiptQtyPU).toFixed(Number(UnitDecimalPlace));
                        }
                    }
                } else {
                    ReceiptQtyPU = Number(ReceiptQtySU);
                }

                GRNData[i].ChallanQuantityInPurchaeUnit = ReceiptQtyPU;
            }
            $("#GRNDetailsGrid").dxDataGrid({
                dataSource: GRNData
            });
        }
    });
    RefreshOverheadGrid();

    $("#GRNListGrid").dxDataGrid("option", "filterValue", ["GRNTransactionID", "contains", Number(GRNTransactionID)]);

    document.getElementById("TxtGRSNo").value = GRSGridSelectedData[0].VoucherNo;
    document.getElementById("TxtGRNTransactionID").value = GRSGridSelectedData[0].GRNTransactionID;
    document.getElementById("TxtLedgerID").value = GRSGridSelectedData[0].LedgerID;
    document.getElementById("TxtReceivedByID").value = GRSGridSelectedData[0].ReceivedByID;
    document.getElementById("TxtGRNNo").value = GRSGridSelectedData[0].GRNNo;
    document.getElementById("TxtDNNo").value = GRSGridSelectedData[0].DeliveryNoteNo;
    document.getElementById("TxtGENo").value = GRSGridSelectedData[0].GateEntryNo;
    document.getElementById("TxtLRNo").value = GRSGridSelectedData[0].LRNOVehicleNo;
    document.getElementById("TxtBillNo").value = GRSGridSelectedData[0].TransporterBillNo;
    document.getElementById("TxtTransporter").value = GRSGridSelectedData[0].Transporter;
    document.getElementById("TxtReceivedBy").value = GRSGridSelectedData[0].ReceivedBy;
    document.getElementById("TxtGRNNarration").value = GRSGridSelectedData[0].GRNNarration;
    document.getElementById("TxtNarration").value = GRSGridSelectedData[0].Narration;

    //$("#GRSDate").dxDateBox({
    //    value: GRSGridSelectedData[0].VoucherDate,
    //});

    //$("#DNDate").dxDateBox({
    //    value: GRSGridSelectedData[0].DeliveryNoteDate,
    //});

    //$("#GEDate").dxDateBox({
    //    value: GRSGridSelectedData[0].GateEntryDate,
    //});

    document.getElementById("BtnDeletePopUp").disabled = false;

});

$("#GRSPrintButton").click(function () {
    var TxtPOID = document.getElementById("TxtGRSID").value;
    if (TxtPOID === null || TxtPOID === "") return;
    var url = "ReportPurchaseGRS.aspx?TransactionID=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
});