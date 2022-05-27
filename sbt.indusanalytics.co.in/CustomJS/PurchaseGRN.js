var optionreceiptoptions = ["Purchase Orders", "Created Receipt Notes"];
var voucherPrefix = "REC";
var GetPendingData = "";
var GetSelectedListData = [];
var receiptBatchDetail = [];
var TransactionID = 0;
var receiptgridrow = "";
var purchaseorderrow = "";
var FlagEdit = false;
var ResWarehouse, ResBin;
var GridReceiptBatchDetails;
var supplieridvalidate = "";
var GblReceiptNo = "";
var ApprovedVoucher = false;
$("#sel_Receiver").dxSelectBox({ value: '' });

$("#optreceiptradio").dxRadioGroup({
    items: optionreceiptoptions,
    value: optionreceiptoptions[0],
    layout: "horizontal"
});

$("#DtPickerDnDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});

$("#DtPickerGEDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});

$("#DtPickerVoucherDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy'
});
RefreshWarehouse();
$(function () {
    $("#optreceiptradio").dxRadioGroup({
        onValueChanged: function (e) {
            var previousValue = e.previousValue;
            var newValue = e.value;
            document.getElementById("LOADER").style.display = "block";
            if (e.value === 'Purchase Orders') {
                PendingReceiptData();
                GetPendingData = "";
            } else {
                TransactionID = 0;
                ReceiptNotesVouchers();
            }
            var grid1 = $("#gridreceiptlist").dxDataGrid('instance');
            grid1.clearSelection();
            GetSelectedListData = [];
            supplieridvalidate = "";
        }
    });
});

function CreateReceiptNo() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetReceiptNo",
            data: '{prefix:' + JSON.stringify(voucherPrefix) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                GblReceiptNo = "";
                if (res !== "") {
                    GblReceiptNo = res;
                    document.getElementById("TxtVoucherNo").value = GblReceiptNo;
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

$("#Btn_Next").click(function () {
    var TxtGRNID = document.getElementById("TxtGRNID").value;
    ApprovedVoucher = false;
    if (TxtGRNID === "" || TxtGRNID === null || TxtGRNID === undefined) {
        alert("Please select any row from below grid !");
        return false;
    }
    var dataGrid;

    TransactionID = 0;
    receiptBatchDetail = [];
    document.getElementById("TxtVoucherNo").value = '';
    document.getElementById("TxtMaxVoucherNo").value = '';
    document.getElementById("TxtSupplierName").value = '';
    document.getElementById("TxtSupplierID").value = '';
    document.getElementById("TxtDnNo").value = '';
    document.getElementById("TxtGENo").value = '';
    document.getElementById("TxtLRNo").value = '';
    document.getElementById("TxtTransporters").value = '';
    document.getElementById("TxtNarration").value = '';
    $("#sel_Receiver").dxSelectBox({ value: '' });
    $("#DtPickerVoucherDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#DtPickerDnDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#DtPickerGEDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });
    $("#GridPurchaseOrders").dxDataGrid({ dataSource: [] });
    $("#GridReceiptBatchDetails").dxDataGrid({ dataSource: [] });
    var optradiovalue = $("#optreceiptradio").dxRadioGroup("instance");
    if (optradiovalue.option("value").toUpperCase().trim() === "PURCHASE ORDERS") {
        document.getElementById("BtnPrint").disabled = true;
        document.getElementById("BtnTransporterSlip").disabled = true;
        dataGrid = $("#gridreceiptlist").dxDataGrid("instance");
        if (dataGrid._options.dataSource.length <= 0) {
            DevExpress.ui.notify("No items present in the list to create receipt note..!", "warning", 1200);
            return;
        }
        //Set Purchase Detail and batch detail grid
        document.getElementById("LOADER").style.display = "block";
        if (GetSelectedListData.length <= 0) {
            DevExpress.ui.notify("Please select pending purchase orders to create new receipt note..!", "warning", 1200);
            return;
        }
        //document.getElementById("BtnDeletePopUp").disabled = true;
        GetPendingData = [];
        DefaultRowData = [];

        var OptObj = {};
        var i = 0;
        for (i = 0; i < GetSelectedListData.length; i++) {
            //if (dataGrid._options.dataSource[i].Sel === "true" || dataGrid._options.dataSource[i].Sel === "1") {
            OptObj.TransactionID = GetSelectedListData[i].TransactionID;
            document.getElementById("TxtSupplierID").value = GetSelectedListData[i].LedgerID;
            document.getElementById("TxtSupplierName").value = GetSelectedListData[i].LedgerName;
            OptObj.LedgerID = GetSelectedListData[i].LedgerID;
            OptObj.ItemID = GetSelectedListData[i].ItemID;
            OptObj.ItemGroupID = GetSelectedListData[i].ItemGroupID;
            OptObj.ItemGroupNameID = GetSelectedListData[i].ItemGroupNameID;
            OptObj.PurchaseVoucherNo = GetSelectedListData[i].PurchaseVoucherNo;
            OptObj.PurchaseVoucherDate = GetSelectedListData[i].PurchaseVoucherDate;
            OptObj.ItemCode = GetSelectedListData[i].ItemCode;
            OptObj.ItemName = GetSelectedListData[i].ItemName;
            OptObj.PurchaseOrderQuantity = GetSelectedListData[i].PurchaseOrderQuantity;
            OptObj.PurchaseUnit = GetSelectedListData[i].PurchaseUnit;
            OptObj.StockUnit = GetSelectedListData[i].StockUnit;
            OptObj.PurchaseTolerance = GetSelectedListData[i].PurchaseTolerance;
            OptObj.WtPerPacking = GetSelectedListData[i].WtPerPacking;
            OptObj.UnitPerPacking = GetSelectedListData[i].UnitPerPacking;
            OptObj.ConversionFactor = GetSelectedListData[i].ConversionFactor;
            OptObj.SizeW = GetSelectedListData[i].SizeW;
            OptObj.PurchaseReferenceRemark = GetSelectedListData[i].PurchaseReferenceRemark;

            OptObj.RefJobCardContentNo = GetSelectedListData[i].RefJobCardContentNo;
            OptObj.PendingQty = GetSelectedListData[i].PendingQty;
            OptObj.FormulaPurchaseToStockUnit = GetSelectedListData[i].FormulaPurchaseToStockUnit;
            OptObj.UnitDecimalPlaceStockUnit = GetSelectedListData[i].UnitDecimalPlaceStockUnit;
            OptObj.FormulaStockToPurchaseUnit = GetSelectedListData[i].FormulaStockToPurchaseUnit;
            OptObj.UnitDecimalPlacePurchaseUnit = GetSelectedListData[i].UnitDecimalPlacePurchaseUnit;
            GetPendingData.push(OptObj);
            if (i === 0) {
                DefaultRowData.push(OptObj);
            }
            OptObj = {};
            //}
        }
        document.getElementById("LOADER").style.display = "none";
        if (GetPendingData === "" || GetPendingData === []) {
            DevExpress.ui.notify("Please select pending purchase orders to create new receipt note..!", "warning", 1200);
            return;
        } else {
            FlagEdit = false;
            $("#GridPurchaseOrders").dxDataGrid({
                dataSource: GetPendingData
            });
            var dGrid = $("#GridPurchaseOrders").dxDataGrid('instance');
            dGrid.refresh();
            dGrid.repaint();
            if (GetPendingData.length > 0) {

                DefaultRowData[0].BatchNo = '_' + DefaultRowData[0].PurchaseVoucherNo + '_' + DefaultRowData[0].ItemID + '_1';
                DefaultRowData[0].ReceiptWtPerPacking = DefaultRowData[0].WtPerPacking;
                DefaultRowData[0].ReceiptQuantity = 0;
                DefaultRowData[0].WarehouseID = 0;
                DefaultRowData[0].Warehouse = "";
                DefaultRowData[0].Bin = "";
            }
            refreshbatchdetailsgrid(DefaultRowData);
            //var grid=$("#GridReceiptBatchDetails").dxDataGrid({
            //    dataSource: DefaultRowData
            //}).dxDataGrid('instance');

            document.getElementById("Btn_Next").setAttribute("data-toggle", "modal");
            document.getElementById("Btn_Next").setAttribute("data-target", "#largeModal");
            CreateReceiptNo();
        }
    } else {
        document.getElementById("BtnPrint").disabled = false;
        document.getElementById("BtnTransporterSlip").disabled = false;
        dataGrid = $("#gridreceiptlist").dxDataGrid("instance");
        if (dataGrid._options.dataSource.length <= 0) {
            DevExpress.ui.notify("No receipt note vouchers present in the list..!", "warning", 1200);
            return;
        }
        document.getElementById("LOADER").style.display = "none";
        //document.getElementById("BtnDeletePopUp").disabled = true;

        if (receiptgridrow !== "") {
            TransactionID = receiptgridrow.TransactionID;
            document.getElementById("TxtSupplierName").value = receiptgridrow.LedgerName;
            document.getElementById("TxtSupplierID").value = receiptgridrow.LedgerID;
            document.getElementById("TxtVoucherNo").value = receiptgridrow.ReceiptVoucherNo;
            document.getElementById("TxtMaxVoucherNo").value = receiptgridrow.MaxVoucherNo;
            document.getElementById("TxtDnNo").value = receiptgridrow.DeliveryNoteNo;
            document.getElementById("TxtGENo").value = receiptgridrow.GateEntryNo;
            document.getElementById("TxtLRNo").value = receiptgridrow.LRNoVehicleNo;
            document.getElementById("TxtTransporters").value = receiptgridrow.Transporter;
            document.getElementById("TxtNarration").value = receiptgridrow.Narration;
            if (receiptgridrow.IsVoucherItemApproved > 0) {
                ApprovedVoucher = true;
            } else {
                ApprovedVoucher = false;
            }
            $("#sel_Receiver").dxSelectBox({ value: receiptgridrow.ReceivedBy });
            $("#DtPickerVoucherDate").dxDateBox({ value: receiptgridrow.ReceiptVoucherDate });
            $("#DtPickerDnDate").dxDateBox({ value: receiptgridrow.DeliveryNoteDate });
            $("#DtPickerGEDate").dxDateBox({ value: receiptgridrow.GateEntryDate });
            FlagEdit = true;
        } else {
            DevExpress.ui.notify("No receipt note vouchers selected in the list to view or edit..!", "warning", 1200);
            return;
        }
        if (TransactionID > 0) {
            document.getElementById("Btn_Next").setAttribute("data-toggle", "modal");
            document.getElementById("Btn_Next").setAttribute("data-target", "#largeModal");
            $.ajax({
                type: "POST",
                url: "WebServicePurchaseGRN.asmx/GetReceiptVoucherBatchDetail",
                data: '{TransactionID:' + TransactionID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    receiptBatchDetail = JSON.parse(res);

                    var PurchaseTransID = 0;
                    var Item_ID = 0;
                    var sumqty = 0;
                    var receiptpoDetail = [];
                    var receiptfirstbatchDetail = [];
                    var OptObj = {};

                    //if (receiptBatchDetail.length > 0) {
                    //    PurchaseTransID = receiptBatchDetail[0].PurchaseTransactionID;
                    //    Item_ID = receiptBatchDetail[0].ItemID;
                    //}
                    for (i = 0; i < receiptBatchDetail.length; i++) {
                        var results = $.grep(receiptpoDetail, function (e) { return (e.TransactionID === receiptBatchDetail[i].PurchaseTransactionID && e.ItemID === receiptBatchDetail[i].ItemID); });
                        if (results.length <= 0) {
                            var formula = 0, PurchaseQty = 0, ReceiptQty = 0, UnitPerPacking = 0;
                            var pendingQty = 0, SizeW = 0, WtPerPacking = 0, UnitDecimalPlace = 0, ConversionFactor = 0;
                            formula = receiptBatchDetail[i].FormulaStockToPurchaseUnit;
                            PurchaseQty = receiptBatchDetail[i].PurchaseOrderQuantity;
                            ReceiptQty = receiptBatchDetail[i].ReceiptQuantity;
                            UnitPerPacking = receiptBatchDetail[i].UnitPerPacking;
                            SizeW = receiptBatchDetail[i].SizeW;
                            WtPerPacking = receiptBatchDetail[i].WtPerPacking;
                            UnitDecimalPlace = receiptBatchDetail[i].UnitDecimalPlacePurchaseUnit;
                            ConversionFactor = receiptBatchDetail[i].ConversionFactor;

                            if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
                                formula = formula.split('e.').join('');
                                formula = formula.replace("Quantity", "ReceiptQty");

                                var n = formula.search("UnitPerPacking");
                                if (n > 0) {
                                    if (Number(UnitPerPacking) > 0) {
                                        pendingQty = eval(formula);
                                        pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                                    }
                                } else {
                                    n = formula.search("SizeW");
                                    if (n > 0) {
                                        if (Number(SizeW) > 0) {
                                            pendingQty = eval(formula);

                                            pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                                        }
                                    } else {
                                        pendingQty = eval(formula);
                                        pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                                    }
                                }
                            } else {
                                if (ReceiptQty > 0) {
                                    pendingQty = (Number(PurchaseQty) - Number(ReceiptQty)).toFixed(Number(UnitDecimalPlace));
                                } else {
                                    pendingQty = Number(PurchaseQty);
                                }
                            }
                            OptObj = {};
                            OptObj.TransactionID = receiptBatchDetail[i].PurchaseTransactionID;
                            OptObj.LedgerID = receiptBatchDetail[i].LedgerID;
                            OptObj.ItemID = receiptBatchDetail[i].ItemID;
                            OptObj.ItemGroupID = receiptBatchDetail[i].ItemGroupID;
                            OptObj.ItemGroupNameID = receiptBatchDetail[i].ItemGroupNameID;
                            OptObj.PurchaseVoucherNo = receiptBatchDetail[i].PurchaseVoucherNo;
                            OptObj.PurchaseVoucherDate = receiptBatchDetail[i].PurchaseVoucherDate;
                            OptObj.ItemCode = receiptBatchDetail[i].ItemCode;
                            OptObj.ItemName = receiptBatchDetail[i].ItemName;
                            OptObj.PurchaseOrderQuantity = receiptBatchDetail[i].PurchaseOrderQuantity;
                            OptObj.PurchaseUnit = receiptBatchDetail[i].PurchaseUnit;
                            OptObj.StockUnit = receiptBatchDetail[i].StockUnit;
                            OptObj.PurchaseTolerance = receiptBatchDetail[i].PurchaseTolerance;
                            OptObj.WtPerPacking = receiptBatchDetail[i].WtPerPacking;
                            OptObj.UnitPerPacking = receiptBatchDetail[i].UnitPerPacking;
                            OptObj.ConversionFactor = receiptBatchDetail[i].ConversionFactor;
                            OptObj.SizeW = receiptBatchDetail[i].SizeW;
                            OptObj.FormulaPurchaseToStockUnit = receiptBatchDetail[i].FormulaPurchaseToStockUnit;
                            OptObj.UnitDecimalPlaceStockUnit = receiptBatchDetail[i].UnitDecimalPlaceStockUnit;
                            OptObj.FormulaStockToPurchaseUnit = receiptBatchDetail[i].FormulaStockToPurchaseUnit;
                            OptObj.UnitDecimalPlacePurchaseUnit = receiptBatchDetail[i].UnitDecimalPlacePurchaseUnit;

                            OptObj.RefJobCardContentNo = receiptBatchDetail[i].RefJobCardContentNo;
                            OptObj.PendingQty = pendingQty;

                            receiptpoDetail.push(OptObj);

                            if (i === 0) {
                                PurchaseTransID = receiptBatchDetail[i].PurchaseTransactionID;
                                Item_ID = receiptBatchDetail[i].ItemID;
                                var rs1 = $.grep(receiptBatchDetail, function (e) { return (e.PurchaseTransactionID === PurchaseTransID && e.ItemID === Item_ID); });
                                if (rs1.length > 0) {
                                    for (var x = 0; x < rs1.length; x++) {
                                        OptObj = {};
                                        OptObj = rs1[x];
                                        OptObj.TransactionID = rs1[x].PurchaseTransactionID;
                                        OptObj.ReceiptQuantity = rs1[x].ChallanQuantity;
                                        receiptfirstbatchDetail.push(OptObj);
                                    }
                                    var OptObj1 = {};
                                    //OptObj1 = rs1[0];
                                    OptObj1.TransactionID = rs1[0].PurchaseTransactionID;
                                    OptObj1.LedgerID = rs1[0].LedgerID;
                                    OptObj1.ItemID = rs1[0].ItemID;
                                    OptObj1.ItemGroupID = rs1[0].ItemGroupID;
                                    OptObj1.ItemGroupNameID = rs1[0].ItemGroupNameID;
                                    OptObj1.PurchaseVoucherNo = rs1[0].PurchaseVoucherNo;
                                    OptObj1.PurchaseVoucherDate = rs1[0].PurchaseVoucherDate;
                                    OptObj1.ItemCode = rs1[0].ItemCode;
                                    OptObj1.ItemName = rs1[0].ItemName;
                                    OptObj1.PurchaseOrderQuantity = rs1[0].PurchaseOrderQuantity;
                                    OptObj1.PurchaseUnit = rs1[0].PurchaseUnit;
                                    OptObj1.StockUnit = rs1[0].StockUnit;
                                    OptObj1.ReceiptQuantity = 0;
                                    //OptObj1.BatchNo = rs1[0].BatchNo.slice(0, rs1[0].BatchNo.length - 2) + '_' + (x + 1);
                                    OptObj1.BatchNo = TransactionID + '_' + rs1[0].PurchaseVoucherNo + '_' + rs1[0].ItemID + '_' + (x + 1);
                                    OptObj1.PurchaseTolerance = rs1[0].PurchaseTolerance;
                                    OptObj1.ReceiptWtPerPacking = rs1[0].WtPerPacking;
                                    OptObj1.WtPerPacking = rs1[0].WtPerPacking;
                                    OptObj1.UnitPerPacking = rs1[0].UnitPerPacking;
                                    OptObj1.ConversionFactor = rs1[0].ConversionFactor;
                                    OptObj1.SizeW = rs1[0].SizeW;
                                    OptObj1.WarehouseID = 0;
                                    OptObj1.Warehouse = "";
                                    OptObj1.Bin = "";
                                    OptObj1.FormulaPurchaseToStockUnit = rs1[0].FormulaPurchaseToStockUnit;
                                    OptObj1.UnitDecimalPlaceStockUnit = rs1[0].UnitDecimalPlaceStockUnit;
                                    OptObj1.FormulaStockToPurchaseUnit = rs1[0].FormulaStockToPurchaseUnit;
                                    OptObj1.UnitDecimalPlacePurchaseUnit = rs1[0].UnitDecimalPlacePurchaseUnit;
                                    receiptfirstbatchDetail.push(OptObj1);
                                }
                            }
                        }
                    }

                    $("#GridPurchaseOrders").dxDataGrid({
                        dataSource: receiptpoDetail
                    });
                    refreshbatchdetailsgrid(receiptfirstbatchDetail);
                }

            });
        }
    }
});

function checkExistingBatchDetail(options) {
    try {
        var i = 0;
        var newData = [];
        var objpub = {};
        if (receiptBatchDetail.length > 0) {
            for (i = 0; i < receiptBatchDetail.length; i++) {
                if (Number(receiptBatchDetail[i].PurchaseTransactionID) === Number(options.data.TransactionID) && Number(receiptBatchDetail[i].ItemID) === Number(options.data.ItemID)) {
                    objpub.TransactionID = receiptBatchDetail[i].PurchaseTransactionID;
                    objpub.LedgerID = receiptBatchDetail[i].LedgerID;
                    objpub.ItemID = receiptBatchDetail[i].ItemID;
                    objpub.ItemGroupID = receiptBatchDetail[i].ItemGroupID;
                    objpub.ItemGroupNameID = receiptBatchDetail[i].ItemGroupNameID;
                    objpub.PurchaseVoucherNo = receiptBatchDetail[i].PurchaseVoucherNo;
                    objpub.PurchaseVoucherDate = receiptBatchDetail[i].PurchaseVoucherDate;
                    objpub.ItemCode = receiptBatchDetail[i].ItemCode;
                    objpub.ItemName = receiptBatchDetail[i].ItemName;
                    objpub.PurchaseOrderQuantity = receiptBatchDetail[i].PurchaseOrderQuantity;
                    objpub.PurchaseUnit = receiptBatchDetail[i].PurchaseUnit;
                    objpub.ReceiptQuantity = receiptBatchDetail[i].ChallanQuantity;
                    objpub.BatchNo = receiptBatchDetail[i].BatchNo;
                    objpub.StockUnit = receiptBatchDetail[i].StockUnit;
                    objpub.Warehouse = receiptBatchDetail[i].Warehouse;
                    objpub.Bin = receiptBatchDetail[i].Bin;
                    objpub.PurchaseTolerance = receiptBatchDetail[i].PurchaseTolerance;
                    objpub.ReceiptWtPerPacking = receiptBatchDetail[i].ReceiptWtPerPacking;
                    objpub.WtPerPacking = receiptBatchDetail[i].WtPerPacking;
                    objpub.UnitPerPacking = receiptBatchDetail[i].UnitPerPacking;
                    objpub.ConversionFactor = receiptBatchDetail[i].ConversionFactor;
                    objpub.SizeW = receiptBatchDetail[i].SizeW;
                    objpub.WarehouseID = receiptBatchDetail[i].WarehouseID;
                    objpub.FormulaPurchaseToStockUnit = receiptBatchDetail[i].FormulaPurchaseToStockUnit;
                    objpub.UnitDecimalPlaceStockUnit = receiptBatchDetail[i].UnitDecimalPlaceStockUnit;
                    objpub.FormulaStockToPurchaseUnit = receiptBatchDetail[i].FormulaStockToPurchaseUnit;
                    objpub.UnitDecimalPlacePurchaseUnit = receiptBatchDetail[i].UnitDecimalPlacePurchaseUnit;
                    newData.push(objpub);
                    objpub = {};
                }
            }
        }
        if (newData.length > 0) {
            if (FlagEdit === false) {
                options.data.BatchNo = '_' + newData[newData.length - 1].PurchaseVoucherNo + '_' + newData[newData.length - 1].ItemID + '_' + (newData.length + 1)
                options.data.ReceiptWtPerPacking = options.data.WtPerPacking;
                options.data.ReceiptQuantity = 0;
            } else {
                options.data.BatchNo = TransactionID + '_' + newData[newData.length - 1].PurchaseVoucherNo + '_' + newData[newData.length - 1].ItemID + '_' + (newData.length + 1)
                options.data.ReceiptWtPerPacking = options.data.WtPerPacking;
                options.data.ReceiptQuantity = 0;
            }
        } else {
            options.data.ReceiptWtPerPacking = options.data.WtPerPacking;
            options.data.ReceiptQuantity = 0;
            options.data.BatchNo = '_' + options.data.PurchaseVoucherNo + '_' + options.data.ItemID + '_1'
        }
        options.data.WarehouseID = 0;
        options.data.Warehouse = "";
        options.data.Bin = "";

        newData.push(options.data);
        refreshbatchdetailsgrid(newData);
    } catch (e) {
        console.log(e);
    }

}

function refreshbatchdetailsgrid(newData) {
    GridReceiptBatchDetails = $("#GridReceiptBatchDetails").dxDataGrid({
        dataSource: newData,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //columnAutoWidth: true,
        columnResizingMode: "widget",
        showBorders: true,
        showRowLines: true,
        editing: {
            mode: "cell",
            allowDeleting: true,
            //allowAdding: true,
            allowUpdating: true
        },
        scrolling: { mode: 'infinite' },
        rowAlternationEnabled: false,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "PurchaseVoucherDate", visible: false, caption: "P.O. Date", width: 120 },
            { dataField: "PurchaseOrderQuantity", visible: false, caption: "P.O. Qty", width: 120 },
            { dataField: "PurchaseUnit", visible: false, caption: "Purchase Unit", width: 120 },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 120 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
            {
                dataField: "ReceiptQuantity", validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Receipt Quantity", visible: true, width: 120,
                setCellValue: function (newData, value, currentRowData) {
                    newData.ReceiptQuantity = value;
                    //newData.TotalPrice = currentRowData.Price * value;
                    if (currentRowData.ReceiptWtPerPacking > 0) {
                        newData.ReceiptQuantityInPurchaseUnit = Number(StockUnitConversion(currentRowData.FormulaStockToPurchaseUnit, value, currentRowData.UnitPerPacking, currentRowData.ReceiptWtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlacePurchaseUnit));
                    } else {
                        newData.ReceiptQuantityInPurchaseUnit = Number(StockUnitConversion(currentRowData.FormulaStockToPurchaseUnit, value, currentRowData.UnitPerPacking, currentRowData.WtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlacePurchaseUnit));
                    }
                }
            },
            {
                dataField: "ReceiptQuantityInPurchaseUnit", caption: "Receipt Qty (In P.U.)", visible: true, width: 120,
                calculateCellValue: function (rowData) {
                    if (Number(rowData.ReceiptWtPerPacking) > 0) {
                        return Number(StockUnitConversion(rowData.FormulaStockToPurchaseUnit, Number(rowData.ReceiptQuantity), Number(rowData.UnitPerPacking), Number(rowData.ReceiptWtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlacePurchaseUnit)));
                    } else {
                        return Number(StockUnitConversion(rowData.FormulaStockToPurchaseUnit, Number(rowData.ReceiptQuantity), Number(rowData.UnitPerPacking), Number(rowData.WtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlacePurchaseUnit)));
                    }
                }
            },
            {
                dataField: "BatchNo", validationRules: [{ type: "required" }], caption: "Ref. Batch No.", visible: true, width: 120
            },
            { dataField: "StockUnit", visible: true },
            { dataField: "ReceiptWtPerPacking", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Wt/Packing", width: 120 },
            {
                dataField: "Warehouse", visible: true, caption: "Warehouse", width: 120,
                lookup: {
                    dataSource: ResWarehouse,
                    displayExpr: "Warehouse",
                    valueExpr: "Warehouse"
                    //keyExpr: "WarehouseID"
                },
                validationRules: [{ type: "required" }],
                setCellValue: function (rowData, value) {
                    rowData.Warehouse = value;
                    if (value !== "") {
                        RefreshBin(value);
                    }
                }
            },
            {
                dataField: "Bin", visible: true, width: 120,
                lookup: {
                    dataSource: ResBin,
                    displayExpr: "Bin",
                    valueExpr: "WarehouseID"
                },
                validationRules: [{ type: "required" }],
                setCellValue: function (rowData, value) {
                    rowData.Bin = value;
                    rowData.WarehouseID = 0;
                    if (value > 0) {
                        rowData.WarehouseID = value;
                    }
                }
            },
            { dataField: "PurchaseTolerance", visible: false, caption: "P.O. Tol.(%)", width: 120 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },
            { dataField: "SizeW", visible: false, caption: "SizeW", width: 120 },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "FormulaPurchaseToStockUnit", visible: false, caption: "FormulaPurchaseToStockUnit" },
            { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit" },
            { dataField: "FormulaStockToPurchaseUnit", visible: false, caption: "FormulaStockToPurchaseUnit" },
            { dataField: "UnitDecimalPlacePurchaseUnit", visible: false, caption: "UnitDecimalPlacePurchaseUnit" },
        ],
        summary: {
            totalItems: [{
                column: "ReceiptQuantity",
                summaryType: "sum",
                displayFormat: "Ttl: {0}"
            }]
        }
    }).dxDataGrid("instance");
}
PendingReceiptData();
SetPurchaseOrderGrid();

function PendingReceiptData() {
    try {
        //document.getElementById("LOADER").style.display = "block";
        //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetPendingOrdersList",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                // document.getElementById("LOADER").style.display = "none";
                // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var tt = JSON.parse(res);
                var formula = "";
                var formula1 = "";
                var PurchaseQty = 0;
                var ReceiptQty = 0;
                var pendingQty = 0;
                var UnitPerPacking = 1, WtPerPacking = 0, ConversionFactor = 1, UnitDecimalPlace = 0, SizeW = 1;
                for (var i = 0; i < tt.length; i++) {
                    formula = tt[i].FormulaStockToPurchaseUnit;
                    PurchaseQty = tt[i].PurchaseOrderQuantity;
                    ReceiptQty = tt[i].ReceiptQuantity;
                    UnitPerPacking = tt[i].UnitPerPacking;
                    SizeW = tt[i].SizeW;
                    WtPerPacking = tt[i].WtPerPacking;
                    UnitDecimalPlace = tt[i].UnitDecimalPlacePurchaseUnit;
                    ConversionFactor = tt[i].ConversionFactor;

                    if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
                        formula = formula.split('e.').join('');
                        formula = formula.replace("Quantity", "ReceiptQty");

                        var n = formula.search("UnitPerPacking");
                        if (n > 0) {
                            if (Number(UnitPerPacking) > 0) {
                                pendingQty = eval(formula);
                                pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                            }
                        } else {
                            n = formula.search("SizeW");
                            if (n > 0) {
                                if (Number(SizeW) > 0) {

                                    pendingQty = eval(formula);
                                    pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                                }
                            } else {
                                pendingQty = eval(formula);
                                pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                            }
                        }
                    } else {
                        if (ReceiptQty > 0) {
                            pendingQty = (Number(PurchaseQty) - Number(ReceiptQty)).toFixed(Number(UnitDecimalPlace));
                        } else {
                            pendingQty = Number(PurchaseQty);
                        }
                    }
                    tt[i].PendingQty = pendingQty;
                }
                SetPendingReceiptGrid(tt);
                document.getElementById("LOADER").style.display = "none";

                //$("#gridreceiptlist").dxDataGrid({
                //    dataSource: tt,
                //});
            }
        });

    } catch (e) {
        document.getElementById("LOADER").style.display = "none";
        console.log(e);
    }
}

function ReceiptNotesVouchers() {
    try {

        //document.getElementById("LOADER").style.display = "block";
        //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetReceiptNoteList",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                // document.getElementById("LOADER").style.display = "none";
                // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var tt = JSON.parse(res);
                SetProcessedReceiptGrid(tt);
                document.getElementById("LOADER").style.display = "none";
            }
        });
    } catch (e) {
        document.getElementById("LOADER").style.display = "none";
        console.log(e);
    }
}

function SetPendingReceiptGrid(tt) {
    document.getElementById("BtnDelete").disabled = true;
    GetSelectedListData = [];
    supplieridvalidate = "";
    $("#gridreceiptlist").dxDataGrid({
        dataSource: tt.filter(function (e) { return e.PendingQty > 0; }),
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
            fileName: "Pending Orders",
            allowExportSelectedData: true,
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
            //if (clickedIndentCell.currentSelectedRowKeys.length > 0) {
            //    document.getElementById("TxtGRNID").value = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
            //}
            //else {
            //    document.getElementById("TxtGRNID").value = "";
            //}

            if (clickedIndentCell.currentSelectedRowKeys.length > 0) {
                if (supplieridvalidate === "") {
                    supplieridvalidate = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                    document.getElementById("TxtGRNID").value = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                }
                else if (supplieridvalidate !== clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                    clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please select records which have same supplier..!", "warning", 3000);
                    clickedIndentCell.currentSelectedRowKeys = [];
                    return false;
                }
            }
            GetSelectedListData = clickedIndentCell.selectedRowsData;

            if (GetSelectedListData.length === 0) {
                supplieridvalidate = "";
                document.getElementById("TxtGRNID").value = "";
            }
        },
        //focusedRowEnabled: true,
        columns: [
            //{ dataField: "Sel", visible: true, caption: "Select", dataType: "boolean", width: 80 },
            { dataField: "TransactionID", visible: false, caption: "Transaction ID", width: 120 },
            { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "TransID", visible: false, caption: "TransID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 150, fixed: true },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.P.O. No.", width: 100 },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 100 },
            { dataField: "PurchaseVoucherDate", visible: true, caption: "P.O. Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
            { dataField: "PurchaseOrderQuantity", visible: true, caption: "P.O. Qty", width: 80 },
            {
                dataField: "PendingQty", visible: true, caption: "Pending Qty", width: 100,
                //calculateCellValue: function (e) {
                //    var qty = Number(e.ReceiptQuantity);
                //    if (e.FormulaStockToPurchaseUnit !== "" && e.FormulaStockToPurchaseUnit !== null) {
                //        if (Number(e.UnitPerPacking) > 0) {
                //            qty = eval(e.FormulaStockToPurchaseUnit.replace("Quantity", "ReceiptQuantity"));
                //            return (Number(e.PurchaseOrderQuantity) - Number(qty)).toFixed(Number(e.UnitDecimalPlacePurchaseUnit));
                //        }
                //    } else {
                //        if (qty > 0) {
                //            return (Number(e.PurchaseOrderQuantity) - Number(qty)).toFixed(Number(e.UnitDecimalPlacePurchaseUnit));
                //        } else {
                //            return Number(e.PurchaseOrderQuantity)
                //        }
                //    }

                //}
            },
            { dataField: "PurchaseUnit", visible: true, caption: "Unit", width: 80 },
            { dataField: "StockUnit", visible: false, caption: "Stock Unit", width: 40 },
            { dataField: "PurchaseDivision", visible: true, caption: "Purchase Division", width: 120 },
            { dataField: "PurchaseReferenceRemark", visible: true, caption: "P.O. Ref. Remark", width: 200 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C. No.", width: 200 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 100 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 100 },
            { dataField: "SizeW", visible: false, caption: "SizeW", width: 100 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
            { dataField: "FormulaStockToPurchaseUnit", visible: false, caption: "FormulaStockToPurchaseUnit", width: 100 },
            { dataField: "UnitDecimalPlacePurchaseUnit", visible: false, caption: "UnitDecimalPlacePurchaseUnit", width: 100 },
            { dataField: "ReceiptQuantity", visible: false, caption: "ReceiptQuantity", width: 100 },
            { dataField: "FormulaPurchaseToStockUnit", visible: false, caption: "FormulaPurchaseToStockUnit", width: 100 },
            { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit", width: 100 }
            //{ dataField: "IsDisplay", visible: true, caption: "IsDisplay", width: 120 },

            // { dataField: "ChargeApplyOnSheets", visible: true, caption: "ChargeApplyOnSheets", width: 120 },
        ]
    });
}

function SetProcessedReceiptGrid(tt) {
    document.getElementById("BtnDelete").disabled = false;
    var grid1 = $("#gridreceiptlist").dxDataGrid('instance');
    grid1.clearSelection();
    $("#gridreceiptlist").dxDataGrid({
        //keyExpr: "TransactionID",
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
        selection: { mode: "single" },
        paging: {
            pageSize: 15
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [15, 25, 50, 100]
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
            fileName: "Receipt Note Vouchers",
            allowExportSelectedData: true
        },
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "Transaction ID", width: 120 },
            { dataField: "PurchaseTransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Receipt No.", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 180, fixed: true },
            { dataField: "ReceiptVoucherNo", visible: true, caption: "Receipt Note No.", width: 120 },
            { dataField: "ReceiptVoucherDate", visible: true, caption: "Receipt Note Date", width: 140, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 100 },
            { dataField: "PurchaseVoucherDate", visible: true, caption: "P.O. Date", width: 100 },
            { dataField: "DeliveryNoteNo", visible: true, caption: "D.N. No.", width: 80 },
            { dataField: "DeliveryNoteDate", visible: true, caption: "D.N. Date", width: 80 },
            { dataField: "GateEntryNo", visible: false, caption: "Gate Entry No.", width: 80 },
            { dataField: "GateEntryDate", visible: false, caption: "Gate Entry Date", width: 60 },
            { dataField: "LRNoVehicleNo", visible: false, caption: "LR No./Vehicle No.", width: 60 },
            { dataField: "Transporter", visible: true, caption: "Transporter", width: 100 },
            { dataField: "ReceiverName", visible: true, caption: "Received By", width: 100 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C. No.", width: 200 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 100 },
            { dataField: "Narration", visible: true, caption: "Remark", width: 60 },
            { dataField: "IsVoucherItemApproved", visible: false, caption: "IsVoucherItemApproved" }
        ],
        onSelectionChanged: function (selectedItems) {
            receiptgridrow = "";
            receiptgridrow = selectedItems.selectedRowsData[0];
            var MakeObj = [];
            if (receiptgridrow !== "" && receiptgridrow !== undefined && receiptgridrow !== null) {
                MakeObj.push(receiptgridrow);
                document.getElementById("TxtGRNID").value = MakeObj[0].TransactionID;
            }
        }
    });
}

function SetPurchaseOrderGrid() {
    $("#GridPurchaseOrders").dxDataGrid({
        allowColumnResizing: true,
        columnResizingMode: "widget",
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        wordWrapEnabled: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "none"
        },
        //editing: {
        //    mode: "cell",
        //    allowUpdating: false
        //},
        selection: {
            mode: "single"
        },
        scrolling: { mode: 'infinite' },
        rowAlternationEnabled: false,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID" },
            { dataField: "LedgerID", visible: false, caption: "LedgerID" },
            { dataField: "ItemID", visible: false, caption: "ItemID" },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 100 },
            { dataField: "PurchaseVoucherDate", visible: true, caption: "P.O. Date", width: 80 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 60 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 60 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
            { dataField: "PurchaseOrderQuantity", visible: true, caption: "P.O.Qty (P.U.)", width: 80 },
            {
                dataField: "PurchaseOrderQuantityInStockUnit", visible: true, caption: "P.O.Qty (S.U.)", width: 80,
                calculateCellValue: function (rowData) {
                    return Number(StockUnitConversion(rowData.FormulaPurchaseToStockUnit, Number(rowData.PurchaseOrderQuantity), Number(rowData.UnitPerPacking), Number(rowData.WtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlaceStockUnit)));
                }
            },
            { dataField: "PurchaseTolerance", visible: true, caption: "Tol.(%)", width: 40 },
            { dataField: "PendingQty", visible: true, caption: "Pending Qty (P.U.)", width: 80 },
            {
                dataField: "PendingQtyInStockUnit", visible: true, caption: "Pending Qty (S.U.)", width: 80,
                calculateCellValue: function (rowData) {
                    return Number(StockUnitConversion(rowData.FormulaPurchaseToStockUnit, Number(rowData.PendingQty), Number(rowData.UnitPerPacking), Number(rowData.WtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlaceStockUnit)));
                }
            },
            { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 80 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
            { dataField: "PurchaseReferenceRemark", visible: true, caption: "P.O. Ref. Remark", width: 140 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Job Card No.", width: 100 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking" },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking" },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor" },
            { dataField: "SizeW", visible: false, caption: "SizeW" },
            {
                dataField: "BatchDetail", caption: "Batch Detail", visible: true, width: 80,
                cellTemplate: function (container, options) {
                    $('<div>').addClass('master-detail-label dx-link')
                        .text('Batch Detail')
                        .on('dxclick', function () { checkExistingBatchDetail(options); }).appendTo(container);
                }

            },
            { dataField: "FormulaPurchaseToStockUnit", visible: false, caption: "FormulaPurchaseToStockUnit" },
            { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit" },
            { dataField: "FormulaStockToPurchaseUnit", visible: false, caption: "FormulaStockToPurchaseUnit" },
            { dataField: "UnitDecimalPlacePurchaseUnit", visible: false, caption: "UnitDecimalPlacePurchaseUnit" }
        ],
        //customizeColumns: function (columns) {
        //    columns[0].width = 120;
        //    columns[1].width = 150;
        //},
        height: function () {
            return window.innerHeight / 4;
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
            purchaseorderrow = "";
            purchaseorderrow = selectedItems.selectedRowsData[0];
        },
        onContentReady: function (e) {
            e.component.selectRowsByIndexes([0]);
        }
    });

    $("#GridReceiptBatchDetails").dxDataGrid({
        dataSource: [],
        allowColumnReordering: true,
        allowColumnResizing: true,
        //columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        columnResizingMode: "widget",
        //keyExpr: "TransactionID",
        sorting: {
            mode: "none"
        },
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowUpdating: true
        },
        scrolling: { mode: 'infinite' },
        rowAlternationEnabled: false,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "PurchaseVoucherDate", visible: false, caption: "P.O. Date", width: 120 },
            { dataField: "PurchaseOrderQuantity", visible: false, caption: "P.O.Qty", width: 120 },
            { dataField: "PurchaseUnit", visible: false, caption: "Purchase Unit", width: 120 },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 120 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 400 },
            {
                dataField: "ReceiptQuantity", validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Receipt Quantity", visible: true, width: 120,
                setCellValue: function (newData, value, currentRowData) {
                    newData.ReceiptQuantity = Number(value).toFixed(Number(currentRowData.UnitDecimalPlaceStockUnit));

                    //newData.TotalPrice = currentRowData.Price * value;
                    if (Number(currentRowData.ReceiptWtPerPacking) > 0) {
                        newData.ReceiptQuantityInPurchaseUnit = Number(StockUnitConversion(currentRowData.FormulaStockToPurchaseUnit, value, currentRowData.UnitPerPacking, currentRowData.ReceiptWtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlacePurchaseUnit));
                    } else {
                        newData.ReceiptQuantityInPurchaseUnit = Number(StockUnitConversion(currentRowData.FormulaStockToPurchaseUnit, value, currentRowData.UnitPerPacking, currentRowData.WtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlacePurchaseUnit));
                    }
                }
            },
            {
                dataField: "ReceiptQuantityInPurchaseUnit", caption: "Receipt Qty (In P.U.)", visible: true, width: 120,
                calculateCellValue: function (rowData) {
                    if (Number(rowData.ReceiptWtPerPacking) > 0) {
                        return Number(StockUnitConversion(rowData.FormulaPurchaseToStockUnit, Number(rowData.PurchaseOrderQuantity), Number(rowData.UnitPerPacking), Number(rowData.ReceiptWtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlaceStockUnit)));
                    } else {
                        return Number(StockUnitConversion(rowData.FormulaPurchaseToStockUnit, Number(rowData.PurchaseOrderQuantity), Number(rowData.UnitPerPacking), Number(rowData.WtPerPacking), Number(rowData.ConversionFactor), Number(rowData.SizeW), Number(rowData.UnitDecimalPlaceStockUnit)));
                    }

                }
            },
            {
                dataField: "BatchNo", validationRules: [{ type: "required" }], caption: "Ref. Batch No.", visible: true, width: 120
            },
            { dataField: "StockUnit", visible: true, width: 80 },
            { dataField: "ReceiptWtPerPacking", visible: true, validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Wt/Packing", width: 120 },
            {
                dataField: "Warehouse", visible: true, caption: "Warehouse", width: 120,
                lookup: {
                    dataSource: ResWarehouse,
                    displayExpr: "Warehouse",
                    valueExpr: "Warehouse"
                    //keyExpr: "WarehouseID"
                },
                validationRules: [{ type: "required" }],
                setCellValue: function (rowData, value) {
                    rowData.Warehouse = value;
                    if (value !== "") {
                        RefreshBin(value);
                    }
                }
            },
            {
                dataField: "Bin", visible: true, width: 120,
                lookup: {
                    dataSource: ResBin,
                    displayExpr: "Bin",
                    valueExpr: "WarehouseID"
                },
                validationRules: [{ type: "required" }],
                setCellValue: function (rowData, value) {
                    rowData.Bin = value;
                    rowData.WarehouseID = 0;
                    if (value > 0) {
                        rowData.WarehouseID = value;
                    }
                }
            },
            { dataField: "PurchaseTolerance", visible: false, caption: "P.O. Tol.(%)", width: 120 }, //, width: 40 
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },  //, width: 40 
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },  //, width: 40 
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },  //, width: 40 
            { dataField: "SizeW", visible: false, caption: "SizeW", width: 120 },//, width: 40 
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },    //, width: 40 
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "FormulaPurchaseToStockUnit", visible: false, caption: "FormulaPurchaseToStockUnit" },
            { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit" },
            { dataField: "FormulaStockToPurchaseUnit", visible: false, caption: "FormulaStockToPurchaseUnit" },
            { dataField: "UnitDecimalPlacePurchaseUnit", visible: false, caption: "UnitDecimalPlacePurchaseUnit" }
        ],
        height: function () {
            return window.innerHeight / 3.4;
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "ReceiptQuantity" || e.column.dataField === "Warehouse" || e.column.dataField === "Bin" || e.column.dataField === "ReceiptWtPerPacking") {// || e.column.dataField === "BatchNo"
                e.cancel = false;
            } else {
                e.cancel = true;
            }

            if (e.data.ItemGroupNameID === "-1" || e.data.ItemGroupNameID === -1) {
                if (e.column.dataField === "ReceiptWtPerPacking") {
                    e.cancel = false;
                }
            }
            else {
                if (e.column.dataField === "ReceiptWtPerPacking") {
                    e.cancel = true;
                }
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
        onRowRemoved: function (e) {
            var dataGrid = $("#GridReceiptBatchDetails").dxDataGrid('instance');
            var newData = [];
            objpub = {};

            receiptBatchDetail = receiptBatchDetail.filter(function (obj) {
                if (obj.BatchNo === e.key.BatchNo) {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (dataGrid._options.dataSource.length === 0 || e.key.ReceiptQuantity === 0) {
                objpub.TransactionID = e.key.TransactionID;
                objpub.LedgerID = e.key.LedgerID;
                objpub.ItemID = e.key.ItemID;
                objpub.ItemGroupID = e.key.ItemGroupID;
                objpub.ItemGroupNameID = e.key.ItemGroupNameID;
                objpub.PurchaseVoucherNo = e.key.PurchaseVoucherNo;
                objpub.PurchaseVoucherDate = e.key.PurchaseVoucherDate;
                objpub.ItemCode = e.key.ItemCode;
                objpub.ItemName = e.key.ItemName;
                objpub.PurchaseOrderQuantity = e.key.PurchaseOrderQuantity;
                objpub.PurchaseUnit = e.key.PurchaseUnit;
                objpub.ChallanQuantity = e.key.ReceiptQuantity;
                objpub.ReceiptQuantityInPurchaseUnit = e.key.ReceiptQuantityInPurchaseUnit;
                objpub.BatchNo = e.key.BatchNo;
                objpub.StockUnit = e.key.StockUnit;
                objpub.Warehouse = "";//e.key.Warehouse
                objpub.Bin = "";//e.key.Bin
                objpub.PurchaseTolerance = e.key.PurchaseTolerance;
                objpub.ReceiptWtPerPacking = e.key.ReceiptWtPerPacking;
                objpub.WtPerPacking = e.key.WtPerPacking;
                objpub.UnitPerPacking = e.key.UnitPerPacking;
                objpub.ConversionFactor = e.key.ConversionFactor;
                objpub.SizeW = e.key.SizeW;
                objpub.WarehouseID = 0;//e.key.WarehouseID
                objpub.ReceiptQuantity = 0;
                objpub.FormulaPurchaseToStockUnit = e.key.FormulaPurchaseToStockUnit;
                objpub.UnitDecimalPlaceStockUnit = e.key.UnitDecimalPlaceStockUnit;
                objpub.FormulaStockToPurchaseUnit = e.key.FormulaStockToPurchaseUnit;
                objpub.UnitDecimalPlacePurchaseUnit = e.key.UnitDecimalPlacePurchaseUnit;

                dataGrid._options.dataSource.push(objpub);
            }

            $("#GridReceiptBatchDetails").dxDataGrid({
                dataSource: dataGrid._options.dataSource,
                columnAutoWidth: true
            });
            dataGrid.refresh();
        },
        onRowUpdated: function (e) {
            //if (Object.getOwnPropertyNames(e.data) === "ReceiptQuantity" || Object.getOwnPropertyNames(e.data) === "Warehouse" || Object.getOwnPropertyNames(e.data) === "Bin") {
            if (e.key.StockUnit.toUpperCase() === "SHEETS" || e.key.StockUnit.toUpperCase() === "SHEET") {
                var textValue = Number(e.key.ReceiptQuantity);
                var decimal = /^[0-9]*$/;
                if (decimal.test(textValue) === false) {
                    DevExpress.ui.notify("Please enter only numeric value..!", "warning", 1200);
                    e.key.ReceiptQuantity = 0;
                }
                // e.component.refresh();
            }
            var i = 0;
            var rowUpdated = false;
            for (i = 0; i < receiptBatchDetail.length; i++) {
                if (receiptBatchDetail[i].PurchaseTransactionID === e.key.TransactionID && receiptBatchDetail[i].ItemID === e.key.ItemID && receiptBatchDetail[i].BatchNo === e.key.BatchNo) {
                    if (e.key.ReceiptQuantity === 0) {
                        e.key.ReceiptQuantity = receiptBatchDetail[i].ChallanQuantity;
                        e.key.ReceiptQuantityInPurchaseUnit = receiptBatchDetail[i].ReceiptQuantityInPurchaseUnit;
                    } else if (e.key.ReceiptQuantity <= 0) {
                        e.key.ReceiptQuantity = receiptBatchDetail[i].ChallanQuantity;
                    } else {
                        if (CheckQuantityTolerance(e.key.ReceiptQuantity, e.key.TransactionID, e.key.ItemID, e.key.BatchNo, e.key.PurchaseTolerance, e.key.WtPerPacking, e.key.UnitPerPacking, e.key.ConversionFactor, e.key.SizeW)) {
                            receiptBatchDetail[i].ChallanQuantity = e.key.ReceiptQuantity;
                            receiptBatchDetail[i].ReceiptQuantityInPurchaseUnit = e.key.ReceiptQuantityInPurchaseUnit;
                        } else {
                            e.key.ReceiptQuantity = receiptBatchDetail[i].ChallanQuantity;
                            e.key.ReceiptQuantityInPurchaseUnit = receiptBatchDetail[i].ReceiptQuantityInPurchaseUnit;
                            DevExpress.ui.notify("Please enter valid receipt quantity under tolerance limit..!", "warning", 1200);
                            return;
                        }

                    }
                    if (e.key.ReceiptWtPerPacking === 0) {
                        e.key.ReceiptWtPerPacking = receiptBatchDetail[i].ReceiptWtPerPacking;
                    } else if (e.key.ReceiptWtPerPacking <= 0) {
                        e.key.ReceiptWtPerPacking = receiptBatchDetail[i].ReceiptWtPerPacking;
                    } else {
                        e.key.ReceiptWtPerPacking = Number(e.key.ReceiptWtPerPacking).toFixed(6);
                        receiptBatchDetail[i].ReceiptWtPerPacking = Number(e.key.ReceiptWtPerPacking).toFixed(6);
                    }
                    receiptBatchDetail[i].Warehouse = e.key.Warehouse;
                    receiptBatchDetail[i].Bin = e.key.Bin;
                    receiptBatchDetail[i].WarehouseID = e.key.WarehouseID;
                    rowUpdated = true;
                }
            }
            if (rowUpdated === false) {
                if (e.key.ReceiptQuantity > 0 && e.key.TransactionID > 0 && e.key.ItemID > 0 && e.key.Warehouse !== "" && e.key.Bin !== "" && e.key.WarehouseID > 0) {
                    if (!CheckQuantityTolerance(e.key.ReceiptQuantity, e.key.TransactionID, e.key.ItemID, e.key.BatchNo, e.key.PurchaseTolerance, e.key.WtPerPacking, e.key.UnitPerPacking, e.key.ConversionFactor, e.key.SizeW)) {
                        DevExpress.ui.notify("Please enter valid receipt quantity under tolerance limit..!", "warning", 1200);
                        e.key.ReceiptQuantity = 0;
                        return;
                    }
                    var objpub = {};
                    objpub.PurchaseTransactionID = e.key.TransactionID;
                    objpub.LedgerID = e.key.LedgerID;
                    objpub.ItemID = e.key.ItemID;
                    objpub.ItemGroupID = e.key.ItemGroupID;
                    objpub.ItemGroupNameID = e.key.ItemGroupNameID;
                    objpub.PurchaseVoucherNo = e.key.PurchaseVoucherNo;
                    objpub.PurchaseVoucherDate = e.key.PurchaseVoucherDate;
                    objpub.ItemCode = e.key.ItemCode;
                    objpub.ItemName = e.key.ItemName;
                    objpub.PurchaseOrderQuantity = e.key.PurchaseOrderQuantity;
                    objpub.PurchaseUnit = e.key.PurchaseUnit;
                    objpub.ChallanQuantity = e.key.ReceiptQuantity;
                    objpub.ReceiptQuantityInPurchaseUnit = e.key.ReceiptQuantityInPurchaseUnit;
                    objpub.BatchNo = e.key.BatchNo;
                    objpub.StockUnit = e.key.StockUnit;
                    objpub.Warehouse = e.key.Warehouse;
                    objpub.Bin = e.key.Bin;
                    objpub.PurchaseTolerance = e.key.PurchaseTolerance;
                    e.key.ReceiptWtPerPacking = Number(e.key.ReceiptWtPerPacking).toFixed(6);
                    objpub.ReceiptWtPerPacking = Number(e.key.ReceiptWtPerPacking).toFixed(6);
                    objpub.WtPerPacking = e.key.WtPerPacking;
                    objpub.UnitPerPacking = e.key.UnitPerPacking;
                    objpub.ConversionFactor = e.key.ConversionFactor;
                    objpub.SizeW = e.key.SizeW;
                    objpub.WarehouseID = e.key.WarehouseID;
                    objpub.FormulaPurchaseToStockUnit = e.key.FormulaPurchaseToStockUnit;
                    objpub.UnitDecimalPlaceStockUnit = e.key.UnitDecimalPlaceStockUnit;
                    objpub.FormulaStockToPurchaseUnit = e.key.FormulaStockToPurchaseUnit;
                    objpub.UnitDecimalPlacePurchaseUnit = e.key.UnitDecimalPlacePurchaseUnit;

                    receiptBatchDetail.push(objpub);

                    //adding new row in batch details grid
                    var x = $("#GridReceiptBatchDetails").dxDataGrid("instance");

                    i = 0;
                    var newData = [];
                    objpub = {};
                    if (receiptBatchDetail.length > 0) {
                        for (i = 0; i < receiptBatchDetail.length; i++) {
                            if (receiptBatchDetail[i].PurchaseTransactionID === e.key.TransactionID && receiptBatchDetail[i].ItemID === e.key.ItemID) {
                                objpub.TransactionID = receiptBatchDetail[i].PurchaseTransactionID;
                                objpub.LedgerID = receiptBatchDetail[i].LedgerID;
                                objpub.ItemID = receiptBatchDetail[i].ItemID;
                                objpub.ItemGroupID = receiptBatchDetail[i].ItemGroupID;
                                objpub.ItemGroupNameID = receiptBatchDetail[i].ItemGroupNameID;
                                objpub.PurchaseVoucherNo = receiptBatchDetail[i].PurchaseVoucherNo;
                                objpub.PurchaseVoucherDate = receiptBatchDetail[i].PurchaseVoucherDate;
                                objpub.ItemCode = receiptBatchDetail[i].ItemCode;
                                objpub.ItemName = receiptBatchDetail[i].ItemName;
                                objpub.PurchaseOrderQuantity = receiptBatchDetail[i].PurchaseOrderQuantity;
                                objpub.PurchaseUnit = receiptBatchDetail[i].PurchaseUnit;
                                objpub.ReceiptQuantity = receiptBatchDetail[i].ChallanQuantity;
                                objpub.ReceiptQuantityInPurchaseUnit = receiptBatchDetail[i].ReceiptQuantityInPurchaseUnit;
                                objpub.BatchNo = receiptBatchDetail[i].BatchNo;
                                objpub.StockUnit = receiptBatchDetail[i].StockUnit;
                                objpub.Warehouse = receiptBatchDetail[i].Warehouse;
                                objpub.Bin = receiptBatchDetail[i].Bin;
                                objpub.PurchaseTolerance = receiptBatchDetail[i].PurchaseTolerance;
                                objpub.ReceiptWtPerPacking = receiptBatchDetail[i].ReceiptWtPerPacking;
                                objpub.WtPerPacking = receiptBatchDetail[i].WtPerPacking;
                                objpub.UnitPerPacking = receiptBatchDetail[i].UnitPerPacking;
                                objpub.ConversionFactor = receiptBatchDetail[i].ConversionFactor;
                                objpub.SizeW = receiptBatchDetail[i].SizeW;
                                objpub.WarehouseID = receiptBatchDetail[i].WarehouseID;
                                objpub.FormulaPurchaseToStockUnit = receiptBatchDetail[i].FormulaPurchaseToStockUnit;
                                objpub.UnitDecimalPlaceStockUnit = receiptBatchDetail[i].UnitDecimalPlaceStockUnit;
                                objpub.FormulaStockToPurchaseUnit = receiptBatchDetail[i].FormulaStockToPurchaseUnit;
                                objpub.UnitDecimalPlacePurchaseUnit = receiptBatchDetail[i].UnitDecimalPlacePurchaseUnit;

                                newData.push(objpub);
                                objpub = {};
                            }
                        }
                    }
                    objpub.TransactionID = e.key.TransactionID;
                    objpub.LedgerID = e.key.LedgerID;
                    objpub.ItemID = e.key.ItemID;
                    objpub.ItemGroupID = e.key.ItemGroupID;
                    objpub.ItemGroupNameID = e.key.ItemGroupNameID;
                    objpub.PurchaseVoucherNo = e.key.PurchaseVoucherNo;
                    objpub.PurchaseVoucherDate = e.key.PurchaseVoucherDate;
                    objpub.ItemCode = e.key.ItemCode;
                    objpub.ItemName = e.key.ItemName;
                    objpub.PurchaseOrderQuantity = e.key.PurchaseOrderQuantity;
                    objpub.PurchaseUnit = e.key.PurchaseUnit;
                    objpub.StockUnit = e.key.StockUnit;
                    objpub.PurchaseTolerance = e.key.PurchaseTolerance;
                    objpub.ReceiptWtPerPacking = e.key.WtPerPacking;
                    objpub.WtPerPacking = e.key.WtPerPacking;
                    objpub.UnitPerPacking = e.key.UnitPerPacking;
                    objpub.ConversionFactor = e.key.ConversionFactor;
                    objpub.SizeW = e.key.SizeW;
                    objpub.FormulaPurchaseToStockUnit = e.key.FormulaPurchaseToStockUnit;
                    objpub.UnitDecimalPlaceStockUnit = e.key.UnitDecimalPlaceStockUnit;
                    objpub.FormulaStockToPurchaseUnit = e.key.FormulaStockToPurchaseUnit;
                    objpub.UnitDecimalPlacePurchaseUnit = e.key.UnitDecimalPlacePurchaseUnit;

                    if (newData.length > 0) {
                        if (FlagEdit === false) {
                            objpub.BatchNo = '_' + newData[newData.length - 1].PurchaseVoucherNo + '_' + newData[newData.length - 1].ItemID + '_' + (newData.length + 1)
                            objpub.ReceiptQuantity = 0;
                            objpub.ReceiptQuantityInPurchaseUnit = 0;
                        } else {
                            objpub.BatchNo = TransactionID + '_' + newData[newData.length - 1].PurchaseVoucherNo + '_' + newData[newData.length - 1].ItemID + '_' + (newData.length + 1)
                            objpub.ReceiptQuantity = 0;
                            objpub.ReceiptQuantityInPurchaseUnit = 0;
                        }
                        objpub.WarehouseID = newData[newData.length - 1].WarehouseID;
                        objpub.Warehouse = newData[newData.length - 1].Warehouse;
                        objpub.Bin = newData[newData.length - 1].WarehouseID;
                    } else {
                        objpub.ReceiptQuantity = 0;
                        objpub.ReceiptQuantityInPurchaseUnit = 0;
                        objpub.WarehouseID = 0;
                        objpub.Warehouse = "";
                        objpub.Bin = "";
                        objpub.BatchNo = '_' + objpub.PurchaseVoucherNo + '_' + objpub.ItemID + '_1';
                    }

                    newData.push(objpub);

                    $("#GridReceiptBatchDetails").dxDataGrid({
                        dataSource: newData
                    });

                    //x.addRow();
                    //x.cellValue(0, 'TransactionID', e.key.TransactionID);
                    //x.cellValue(0, 'LedgerID', e.key.LedgerID);
                    //x.cellValue(0, 'ItemID', e.key.ItemID);
                    //x.cellValue(0, 'ItemGroupID', e.key.ItemGroupID);
                    //x.cellValue(0, 'PurchaseVoucherNo', e.key.PurchaseVoucherNo);
                    //x.cellValue(0, 'PurchaseVoucherDate', e.key.PurchaseVoucherDate);
                    //x.cellValue(0, 'ItemCode', e.key.ItemCode);
                    //x.cellValue(0, 'ItemName', e.key.ItemName);
                    //x.cellValue(0, 'PurchaseOrderQuantity', e.key.PurchaseOrderQuantity);
                    //x.cellValue(0, 'PurchaseUnit', e.key.PurchaseUnit);
                    //x.cellValue(0, 'StockUnit', e.key.StockUnit);
                    //x.cellValue(0, 'Warehouse', "");
                    //x.cellValue(0, 'Bin', "");
                    //x.cellValue(0, 'PurchaseTolerance', e.key.PurchaseTolerance);
                    //x.cellValue(0, 'WtPerPacking', e.key.WtPerPacking);
                    //x.cellValue(0, 'UnitPerPacking', e.key.UnitPerPacking);
                    //x.cellValue(0, 'ConversionFactor', e.key.ConversionFactor);
                    //x.cellValue(0, 'WarehouseID', 0);
                    //if (FlagEdit === false) {
                    //    x.cellValue(0, 'BatchNo', ('_' + e.key.PurchaseVoucherNo + '_' + e.key.ItemID + '_' + (x.totalCount() + 1)));
                    //} else {
                    //    x.cellValue(0, 'BatchNo', (TransactionID + '_' + e.key.PurchaseVoucherNo + '_' + e.key.ItemID + '_' + (x.totalCount()+1)));
                    //}
                    //x.saveEditData();
                    //x.refresh();
                    //x.repaint();
                }
            }

            //}
            //CheckQuantityTolerance(e.key.)
        },
        summary: {
            totalItems: [{
                column: "ReceiptQuantity",
                summaryType: "sum",
                displayFormat: "Ttl: {0}"
            }]
        }
    });
}

function CheckQuantityTolerance(ReceiptQUantity, PurchaseTransactionID, ItemID, ReceiptBatchNo, Tolerance, WtPerPacking, UnitPerPacking, ConversionFactor, SizeW) {
    var flag = false;
    try {
        $.ajax({
            type: "POST",
            async: false,
            url: "WebServicePurchaseGRN.asmx/GetPreviousReceivedQuantity",
            data: '{PurchaseTransactionID:' + PurchaseTransactionID + ',ItemID:' + ItemID + ',GRNTransactionID:' + TransactionID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var receivers = JSON.parse(res);
                var poquantity = receivers[0].PurchaseOrderQuantity;
                var stockunitpoquantity = 0;
                var prereceiptquantity = receivers[0].PreReceiptQuantity;
                var Conversionformula = receivers[0].FormulaPurchaseToStockUnit;
                var UnitDecimalPlace = receivers[0].UnitDecimalPlaceStockUnit;
                var currentreceiptquantity = 0;
                var totalreceiptquantity = 0;
                var results = $.grep(receiptBatchDetail, function (e) { return (e.PurchaseTransactionID === PurchaseTransactionID && e.ItemID === ItemID && e.BatchNo !== ReceiptBatchNo); })
                if (results.length > 0) {
                    for (var x = 0; x < results.length; x++) {
                        // currentreceiptquantity = currentreceiptquantity + Number(results[x].ReceiptQuantity);
                        currentreceiptquantity = Number(currentreceiptquantity) + Number(results[x].ChallanQuantity);//Updated By Pradeep Yadav 14 Oct 2019
                    }
                }
                totalreceiptquantity = Number(currentreceiptquantity) + Number(ReceiptQUantity) + Number(prereceiptquantity);
                if (Conversionformula !== "" && Conversionformula !== null && Conversionformula !== undefined && Conversionformula !== "undefined") {
                    Conversionformula = Conversionformula.split('e.').join('');
                    Conversionformula = Conversionformula.replace("Quantity", "poquantity");
                    var n = Conversionformula.search("WtPerPacking");
                    if (n > 0) {
                        if (Number(WtPerPacking) > 0) {
                            stockunitpoquantity = eval(Conversionformula);
                            flag = Number(totalreceiptquantity) <= Number(Number(stockunitpoquantity) + Number(Number(stockunitpoquantity) * (Number(Tolerance) / 100)));
                            //pendingQty = (Number(PurchaseQty) - Number(pendingQty)).toFixed(Number(UnitDecimalPlace));
                        }
                    } else {
                        n = Conversionformula.search("SizeW");
                        if (n > 0) {
                            if (Number(SizeW) > 0) {
                                stockunitpoquantity = eval(Conversionformula);
                                flag = Number(totalreceiptquantity) <= Number(Number(stockunitpoquantity) + (Number(stockunitpoquantity) * (Number(Tolerance) / 100)));
                            }
                        } else {
                            stockunitpoquantity = eval(Conversionformula);
                            flag = Number(totalreceiptquantity) <= Number(Number(stockunitpoquantity) + (Number(stockunitpoquantity) * (Number(Tolerance) / 100)));
                        }
                    }
                } else {
                    flag = Number(totalreceiptquantity) <= Number(poquantity) + Number(Number(poquantity) * (Number(Tolerance) / 100));
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
    return flag;
}
refreshReceiver();
function refreshReceiver() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetReceiverList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {

                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var receivers = JSON.parse(res);

                $("#sel_Receiver").dxSelectBox({
                    items: receivers,
                    placeholder: "Select Received By",
                    displayExpr: 'LedgerName',
                    valueExpr: 'LedgerID',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        //alert(data.value);
                    },

                });
            },
        });

    } catch (e) {
        console.log(e);
    }

}
//refreshTransporter();
//function refreshTransporter() {
//    try {
//        $.ajax({
//            type: "POST",
//            url: "WebServicePurchaseGRN.asmx/GetPurchaseSuppliersList",
//            data: '{}',
//            contentType: "application/json; charset=utf-8",
//            dataType: "text",
//            success: function (results) {
//                
//                var res = results.replace(/\\/g, '');
//                res = res.replace(/"d":""/g, '');
//                res = res.replace(/""/g, '');
//                res = res.substr(1);
//                res = res.slice(0, -1);
//                var transporters = JSON.parse(res);

//                $("#sel_Transporter").dxSelectBox({
//                    items: transporters,
//                    placeholder: "Select Transporter",
//                    displayExpr: 'LedgerName',
//                    valueExpr: 'LedgerID',
//                    searchEnabled: true,
//                    showClearButton: true,
//                    onValueChanged: function (data) {
//                        //alert(data.value);
//                    },

//                });
//            },
//        });

//    } catch (e) {
//        alert(e);
//    }

//}

function RefreshWarehouse() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetWarehouseList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {

                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                ResWarehouse = JSON.parse(res);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function RefreshBin(value) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                ResBin = JSON.parse(res);

                var lookup = GridReceiptBatchDetails.columnOption("Bin", "lookup");
                lookup.dataSource = ResBin;
                GridReceiptBatchDetails.columnOption("Bin", "lookup", lookup);
                GridReceiptBatchDetails.repaint();
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#BtnSave").click(function () {
    var i = 0;
    var prefix = "REC";
    var voucherid = -14;
    if (document.getElementById("TxtDnNo").value.trim() === "") {
        DevExpress.ui.notify("Please enter valid delivery note no. to create receipt note..!", "warning", 1200);
        document.getElementById("TxtDnNo").focus();
        return;
    }
    if ($("#sel_Receiver").dxSelectBox('instance').option('value') === "" || $("#sel_Receiver").dxSelectBox('instance').option('value') === "undefined" || $("#sel_Receiver").dxSelectBox('instance').option('value') === null) {
        DevExpress.ui.notify("Please select received by to create receipt note..!", "warning", 1200);
        return;
    }

    try {
        if (receiptBatchDetail.length <= 0) {
            DevExpress.ui.notify("Please enter batch details to create receipt note..!", "warning", 1200);
            return;
        }
        var dataGrid1 = $("#GridPurchaseOrders").dxDataGrid('instance');
        for (i = 0; i < dataGrid1.totalCount(); i++) {
            //alert(dataGrid1.cellValue(i, "ItemID"));
            var result = $.grep(receiptBatchDetail, function (e) { return (e.ItemID === dataGrid1.cellValue(i, "ItemID") && e.PurchaseTransactionID === dataGrid1.cellValue(i, "TransactionID")); });
            if (result.length === 0) {
                //Not found
                DevExpress.ui.notify("Please enter valid receipt batch details against purchase order no. '" + dataGrid1.cellValue(i, "PurchaseVoucherNo") + "' and item name '" + dataGrid1.cellValue(i, "ItemName") + " to create receipt note..!", "warning", 1200);
                return;
            }
        }

        var voucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
        var ledgerID = document.getElementById("TxtSupplierID").value;
        //var totalreceiptqty = $.receiptBatchDetail.Sum({ ChallanQuantity });
        var totalreceiptqty = 0;
        var dONo = document.getElementById("TxtDnNo").value.trim();
        var dODate = $('#DtPickerDnDate').dxDateBox('instance').option('value');
        var transporter = document.getElementById("TxtTransporters").value.trim();
        var gateentryno = document.getElementById("TxtGENo").value.trim();
        var gateentrydate = $('#DtPickerGEDate').dxDateBox('instance').option('value');
        var LRNoVehicleNo = document.getElementById("TxtLRNo").value.trim();
        var textNarration = document.getElementById("TxtNarration").value.trim();
        var ReceivedBy = $("#sel_Receiver").dxSelectBox('instance').option('value');
        var jsonObjectsTransactionMain = [];
        var TransactionMainRecord = {};

        TransactionMainRecord.VoucherID = -14;
        TransactionMainRecord.VoucherDate = voucherDate;
        TransactionMainRecord.ReceivedBy = ReceivedBy;
        TransactionMainRecord.LedgerID = ledgerID;
        TransactionMainRecord.TotalQuantity = totalreceiptqty;
        TransactionMainRecord.Particular = "Receipt Note";
        TransactionMainRecord.DeliveryNoteNo = dONo;
        TransactionMainRecord.DeliveryNoteDate = dODate;
        TransactionMainRecord.Transporter = transporter;
        TransactionMainRecord.GateEntryNo = gateentryno;
        TransactionMainRecord.GateEntryDate = gateentrydate;
        TransactionMainRecord.LRNoVehicleNo = LRNoVehicleNo;
        TransactionMainRecord.Narration = textNarration;

        jsonObjectsTransactionMain.push(TransactionMainRecord);

        var jsonObjectsTransactionDetail = [];
        var TransactionDetailRecord = {};
        if (receiptBatchDetail.length > 0) {
            for (var e = 0; e < receiptBatchDetail.length; e++) {
                TransactionDetailRecord = {};
                if (Number(receiptBatchDetail[e].ChallanQuantity > 0)) {
                    TransactionDetailRecord.TransID = e + 1;
                    TransactionDetailRecord.ItemID = receiptBatchDetail[e].ItemID;
                    TransactionDetailRecord.ItemGroupID = receiptBatchDetail[e].ItemGroupID;
                    TransactionDetailRecord.ChallanQuantity = receiptBatchDetail[e].ChallanQuantity;
                    TransactionDetailRecord.ChallanWeight = receiptBatchDetail[e].ReceiptQuantityInPurchaseUnit;
                    TransactionDetailRecord.BatchNo = "_" + receiptBatchDetail[e].PurchaseVoucherNo + "_" + receiptBatchDetail[e].ItemID;
                    TransactionDetailRecord.StockUnit = receiptBatchDetail[e].StockUnit;
                    var ReceiptWtPerPacking = 0.00;
                    ReceiptWtPerPacking = Number(receiptBatchDetail[e].ReceiptWtPerPacking).toFixed(5);
                    TransactionDetailRecord.ReceiptWtPerPacking = ReceiptWtPerPacking;
                    TransactionDetailRecord.WarehouseID = receiptBatchDetail[e].WarehouseID;
                    TransactionDetailRecord.PurchaseTransactionID = receiptBatchDetail[e].PurchaseTransactionID;

                    jsonObjectsTransactionDetail.push(TransactionDetailRecord);
                }
            }
        }

        jsonObjectsTransactionMain = JSON.stringify(jsonObjectsTransactionMain);
        jsonObjectsTransactionDetail = JSON.stringify(jsonObjectsTransactionDetail);

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
                if (FlagEdit === true) {
                    document.getElementById("LOADER").style.display = "block";
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServicePurchaseGRN.asmx/UpdateReceiptData",
                            data: '{TransactionID:' + JSON.stringify(TransactionID) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail:' + jsonObjectsTransactionDetail + '}',
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
                                else {
                                    swal("Error..!", res, "warning");
                                }
                            },
                            error: function errorFunc(jqXHR) {
                                document.getElementById("LOADER").style.display = "none";
                                swal("Error!", "Please try after some time..", "");
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    document.getElementById("LOADER").style.display = "block";
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebServicePurchaseGRN.asmx/SaveReceiptData",
                            data: '{prefix:' + JSON.stringify(prefix) + ',voucherid:' + JSON.stringify(voucherid) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail:' + jsonObjectsTransactionDetail + '}',
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
                                else {
                                    swal("Error..!", res, "warning");
                                }
                            },
                            error: function errorFunc(jqXHR) {
                                document.getElementById("LOADER").style.display = "none";
                                //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                swal("Error!", "Please try after some time..", "");
                                console.log(jqXHR);
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }

                }
            });
    } catch (e) {
        console.log(e);
    }
});

$("#BtnPrint").click(function () {
    //var url = "PrintReceiptApproval.aspx?TI=" + TransactionID;
    var TxtGRNID = document.getElementById("TxtGRNID").value;
    if (TxtGRNID === "" || TxtGRNID === null || TxtGRNID === undefined) {
        alert("Please select valid grn details to print..!");
        return false;
    }
    if (ApprovedVoucher === "" || ApprovedVoucher === null || ApprovedVoucher === undefined || ApprovedVoucher === false) {
        alert("GRN is not approved, please approve it before taking print..!");
        return false;
    }
    var url = "ReportPurchaseGRN.aspx?TransactionID=" + TxtGRNID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

$("#BtnTransporterSlip").click(function () {
    //var url = "PrintReceiptApproval.aspx?TI=" + TransactionID;
    var TxtGRNID = document.getElementById("TxtGRNID").value;
    if (TxtGRNID === "" || TxtGRNID === null || TxtGRNID === undefined) {
        alert("Please select valid grn details to print..!");
        return false;
    }

    var url = "ReportGRNTransportSlip.aspx?TransactionID=" + TxtGRNID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

$("#BtnDelete").click(function () {

    var TxtGRNID = document.getElementById("TxtGRNID").value;
    if (TxtGRNID === "" || TxtGRNID === null || TxtGRNID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebServicePurchaseGRN.asmx/CheckPermission",
        data: '{TransactionID:' + JSON.stringify(TxtGRNID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res === "Exist") {
                swal("", "This item is used in another process..! Record can not be delete.", "error");
                return false;
            }
            else {
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
                            url: "WebServicePurchaseGRN.asmx/DeletePGRN",
                            data: '{TransactionID:' + JSON.stringify(TxtGRNID) + '}',
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
            }

        }
    });
});

$("#BtnNotification").click(function () {
    var purchaseId = "";
    var receiptId = "";
    var commentData = "";
    var newHtml = '';
    if (FlagEdit === false) {
        if (GetPendingData.length > 0) {
            for (var i = 0; i < GetPendingData.length; i++) {
                if (GetPendingData[i].TransactionID > 0) {
                    if (purchaseId === "") {
                        purchaseId = GetPendingData[i].TransactionID.toString();
                    } else {
                        purchaseId = purchaseId + "," + GetPendingData[i].TransactionID.toString();
                    }
                }
            }

            document.getElementById("commentbody").innerHTML = "";
            if (purchaseId !== "") {
                $.ajax({
                    type: "POST",
                    url: "WebServicePurchaseGRN.asmx/GetCommentData",
                    data: '{receiptTransactionID:0,purchaseTransactionIDs:' + JSON.stringify(purchaseId) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        commentData = JSON.parse(res);
                        if (commentData.length > 0) {
                            for (var x = 0; x < commentData.length; x++) {
                                newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                                newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                            }
                        }
                        $("#commentbody").append(newHtml);
                        $(".commentInput").hide();

                    }

                });
            }

        }
    } else {
        receiptId = document.getElementById("TxtGRNID").value;
        if (receiptId === "" || receiptId === null || receiptId === undefined) {
            alert("Please select valid receipt note to view comment details..!");
            return false;
        }
        document.getElementById("commentbody").innerHTML = "";
        if (receiptId !== "") {
            $.ajax({
                type: "POST",
                url: "WebServicePurchaseGRN.asmx/GetCommentData",
                data: '{receiptTransactionID:' + JSON.stringify(receiptId) + ',purchaseTransactionIDs:0}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    commentData = JSON.parse(res);
                    if (commentData.length > 0) {
                        console.log(commentData);
                        for (var x = 0; x < commentData.length; x++) {
                            newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                            newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                        }
                    }
                    $("#commentbody").append(newHtml);
                    $(".commentInput").show();
                }
            });
        }

    }
    document.getElementById("BtnNotification").setAttribute("data-toggle", "modal");
    document.getElementById("BtnNotification").setAttribute("data-target", "#CommentModal");
});

$(function () {
    $("#BtnSaveComment").click(function () {
        var receiptId = document.getElementById("TxtGRNID").value;
        if (receiptId === "" || receiptId === null || receiptId === undefined) {
            alert("Please select valid receipt note to view comment details..!");
            return false;
        }

        var commentTitle = document.getElementById("TxtCommentTitle").value.trim();
        var commentDesc = document.getElementById("TxtCommentDetail").value.trim();
        var commentType = $('#selCommentType').dxSelectBox('instance').option('value');
        if (commentTitle === undefined || commentTitle === "" || commentTitle === null || commentType === undefined || commentType === "" || commentType === null || commentDesc === undefined || commentDesc === null || commentDesc === "") {
            alert("Please enter valid comment title, type and description..!");
            return false;
        }

        var jsonObjectCommentDetail = [];
        var objectCommentDetail = {};

        objectCommentDetail.CommentDate = new Date();
        objectCommentDetail.ModuleID = 0;
        objectCommentDetail.ModuleName = "Goods Receipt Note";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = receiptId;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebServicePurchaseGRN.asmx/SaveCommentData",
            data: '{jsonObjectCommentDetail:' + jsonObjectCommentDetail + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                //if (res === "Success") {
                // RadioValue = "Pending Requisitions";
                alert("Comment saved!", "Comment saved successfully.", "success");
                var commentData = "";
                var newHtml = '';
                var receiptId = document.getElementById("TxtGRNID").value;
                if (receiptId === "" || receiptId === null || receiptId === undefined) {
                    alert("Please select valid receipt note to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (receiptId !== "") {
                    $.ajax({
                        type: "POST",
                        url: "WebServicePurchaseGRN.asmx/GetCommentData",
                        data: '{receiptTransactionID:' + JSON.stringify(receiptId) + ',purchaseTransactionIDs:0}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            commentData = JSON.parse(res);

                            if (commentData.length > 0) {
                                for (var x = 0; x < commentData.length; x++) {
                                    newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>'
                                    newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>'
                                }
                            }
                            $("#commentbody").append(newHtml);
                            $(".commentInput").show();
                        }
                    });
                }
            },
            error: function errorFunc(jqXHR) {
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });
});

function StockUnitConversion(formula, PhysicalStock, UnitPerPacking, WtPerPacking, ConversionFactor, SizeW, UnitDecimalPlace) {
    var convertedQuantity = 0;
    if (formula !== "" && formula !== null && formula !== undefined && formula !== "undefined") {
        formula = formula.split('e.').join('')
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