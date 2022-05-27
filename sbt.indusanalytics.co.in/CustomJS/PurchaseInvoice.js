
var prefix = "PI";
var newSUPllierArray = [];
var CPItemID = "";
var sholistData = [];

var GblStatus = "", GRNNO = "", DelNoteNo = "", GetTransactionID = 0, GblLedgerID = 0, GblLedgerName = "";
var FillGridDataObj = [];
var MasterGridData = [];
var ObjItemRate = [];
var ItemRateString = "";
var GblCompanyStateTin = "";
var GblGSTApplicable = true;

//Additional Charges
var ChargesGrid = [];
var updateTotalTax = 0;
var CHRemID = "";

//initialize Charges Grid
var CalculateOnLookup = [{ "ID": 1, "Name": "Value" }, { "ID": 2, "Name": "Quantity" }];
var TCSRate = 0;

$.ajax({
    type: "POST",
    url: "WebService_PurchaseInvoice.asmx/GetTCSRate",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = JSON.stringify(results);
        res = res.replace(/"d":/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        if (res !== "fail") { TCSRate = res; }
    }
});

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
    onRowRemoving: function (e) {
        CHRemID = "";
        CHRemID = e.data.LedgerID;
    },
    onRowRemoved: function (e) {
        AddItemCalculation();
        GridColumnCal();
        AddItemWithChargessGrid();
        var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
        CreatePIGrid.refresh();
        var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
        AdditionalChargesGrid.refresh();
    },
    onRowUpdated: function (CHGRID) {
        AddItemCalculation();
        GridColumnCal();
        AddItemWithChargessGrid();
        var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
        CreatePIGrid.refresh();
        var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
        AdditionalChargesGrid.refresh();
    },
    columns: [
        { dataField: "LedgerName", visible: true, caption: "Tax  Ledger", width: 200 },
        { dataField: "TaxRatePer", visible: true, caption: "Tax %", width: 80 },
        {
            dataField: "CalculateON", visible: true, caption: "Calcu. ON", width: 80,
            lookup: {
                dataSource: CalculateOnLookup,
                displayExpr: "Name",
                valueExpr: "Name",
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

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    type: 'datetime',
    value: new Date()
});

$("#PIBillDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    type: 'datetime',
    value: new Date()
});

var RadioValue = "Pending";
GetDataGrid();

var priorities = ["Pending", "Processed"];
$("#RadioButtonPI").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = "";
        RadioValue = e.value;
        GblStatus = "";
        GetDataGrid();
    }
});

CreatePONO();
function CreatePONO() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/GetPINO",
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
            if (res !== "fail") {
                document.getElementById("LblPINo").value = res;
            }
        }
    });
}

function GetDataGrid() {
    if (RadioValue === "Pending") {
        GetPendingData = "";
        GblStatus = "";

        document.getElementById("DivEdit").style.display = "none";

        document.getElementById("LOADER").style.display = "block";

        document.getElementById("PIGridPending").style.display = "block";
        document.getElementById("PIGridProcess").style.display = "none";

        document.getElementById("TxtPIID").value = "";

        $.ajax({
            type: "POST",
            url: "WebService_PurchaseInvoice.asmx/FillGrid",
            data: '{RadioValue:' + JSON.stringify(RadioValue) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                ////console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var PendingList = JSON.parse(res);
                document.getElementById("LOADER").style.display = "none";
                fillGridPending(PendingList);
            }
        });
    }
    else if (RadioValue === "Processed") {

        GetPendingData = "";
        GblStatus = "Update";

        document.getElementById("DivEdit").style.display = "block";

        document.getElementById("PIGridPending").style.display = "none";
        document.getElementById("PIGridProcess").style.display = "block";

        document.getElementById("TxtPIID").value = "";

        Showlist();
    }
}

//Get Show List
function Showlist() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/Showlist",
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
            RES1 = JSON.parse(res.toString());

            $("#PIGridProcess").dxDataGrid({
                dataSource: RES1,
                showBorders: true,
                showRowLines: true,
                allowSorting: false,
                allowColumnResizing: true,
                selection: { mode: "single" },
                paging: {
                    pageSize: 50
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [50, 100, 350, 1000]
                },
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
                        e.rowElement.css('background', '#42909A');
                        e.rowElement.css('color', 'white');
                    }
                    e.rowElement.css('fontSize', '11px');
                },

                onSelectionChanged: function (Showlist) {
                    sholistData = [];
                    sholistData = Showlist.selectedRowsData;
                    document.getElementById("TxtPIID").value = sholistData[0].TransactionID;
                },
                columns: [{ dataField: "TransactionID", visible: false, width: 120 },
                { dataField: "VoucherID", visible: false, width: 120 },
                { dataField: "VoucherNo", visible: true, caption: "Purchase Invoice No.", width: 100 },
                { dataField: "VoucherDate", visible: true, caption: "Purchase Invoice Date", width: 120 },
                { dataField: "PONo", visible: true, caption: "P.O. No.", width: 100 },
                { dataField: "GRNNo", visible: true, caption: "Receipt Note No.", width: 120 },
                { dataField: "GRNDate", visible: true, caption: "Receipt Date", width: 120 },
                { dataField: "InvoiceNo", visible: true, width: 120 },
                { dataField: "InvoiceDate", visible: true, width: 100 },
                { dataField: "SupplierName", visible: true, caption: "Supplier", width: 120 },
                { dataField: "DeliveryNoteNo", visible: true, width: 100 },
                { dataField: "DeliveryNoteDate", visible: true, width: 120 },
                { dataField: "FYear", visible: true, width: 100 }
                ]
            });
        }
    });
}

$("#CreatePIGrid").dxDataGrid({
    dataSource: FillGridDataObj,
    showBorders: true,
    paging: {
        enabled: false
    },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    editing: {
        mode: "cell",
        allowDeleting: true,
        //allowAdding: true,
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
        if (e.column.dataField !== "ReceiptQuantity" && e.column.dataField !== "PurchaseRate" && e.column.dataField !== "ExpectedDeliveryDate" && e.column.dataField !== "PurchaseTolerance" && e.column.dataField !== "Disc") {
            e.cancel = true;
        } else {
            e.cancel = false;
        }
    },
    onRowUpdated: function (editcell) {
        if (ChargesGrid.length > 0) {
            AddItemCalculation();
            AddItemWithChargessGrid();
        } else {
            AddItemCalculation();
        }
    },
    onCellPrepared: function (CEll) {
        GridColumnCal();
    },
    onRowRemoving: function (e) {
        CPItemID = "";
        CPItemID = e.data.ItemID;
    },
    onRowRemoved: function (e) {
        FillGridDataObj = FillGridDataObj.filter(function (obj) {
            return obj.ItemID !== CPItemID;
        });
        if (ChargesGrid.length > 0) {
            AddItemWithChargessGrid();
        } else {
            AddItemCalculation();
        }
    },
    columns: [
        { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
        { dataField: "PurchaseTransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
        { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 120 },
        { dataField: "PurchaseVoucherDate", visible: true, caption: "P.O. Date", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 120 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "PurchaseOrderQuantity", visible: true, caption: "Purchase Qty", width: 80 },
        { dataField: "ChallanQuantity", visible: false, caption: "Receipt Qty", width: 80 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
        {
            dataField: "ReceiptQuantity", visible: true, caption: "Receipt Qty", width: 80,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        {
            dataField: "PurchaseRate", visible: true, caption: "Rate", width: 60,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 80 },
        { dataField: "ReceiptWtPerPacking", visible: false, caption: "ReceiptWtPerPacking", width: 80 },
        {
            dataField: "ExpectedDeliveryDate", visible: false, caption: "Expec.Del.Date", width: 100,
            dataType: "date", format: "dd-MMM-yyyy",
            showEditorAlways: true
        },
        {
            dataField: "PurchaseTolerance", visible: false, caption: "Tole. %", width: 60,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "BasicAmount", visible: true, caption: "Basic Amt", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },

        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
        { dataField: "SizeW", visible: true, caption: "Width", width: 100 },
        {
            dataField: "Disc", visible: true, caption: "Disc. %", width: 60,
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "AfterDisAmt", visible: false, caption: "AfterDisAmt", width: 80 },
        { dataField: "TaxableAmount", visible: false, caption: "Taxable Amt", width: 100 },
        { dataField: "GSTTaxPercentage", visible: true, caption: "GST %", width: 50 },
        { dataField: "CGSTTaxPercentage", visible: true, caption: "CGST %", width: 50 },
        { dataField: "SGSTTaxPercentage", visible: true, caption: "SGST %", width: 50 },
        { dataField: "IGSTTaxPercentage", visible: true, caption: "IGST %", width: 50 },
        { dataField: "CGSTAmt", visible: true, caption: "CGST Amt", width: 80 },
        { dataField: "SGSTAmt", visible: true, caption: "SGST Amt", width: 80 },
        { dataField: "IGSTAmt", visible: true, caption: "IGST Amt", width: 80 },
        { dataField: "TotalAmount", visible: true, caption: "Total Amt", width: 80 },

        { dataField: "ReceiptQuantityComp", visible: false, caption: "ReceiptQuantityComp", width: 120 }, //For Compair of Purchase qty
        { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
        { dataField: "FYear", visible: true, caption: "F-Year", width: 120 },
        { dataField: "ProductHSNName", visible: true, caption: "HSN Group", width: 120 },
        { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 120 },
        { dataField: "LandedAmt", visible: false, caption: "Landed Amt", width: 120 },
        { dataField: "LandedPrice", visible: true, caption: "Landed Price", width: 120 }
    ]
});

function fillGridPending(PendingList) {
    $("#PIGridPending").dxDataGrid({
        dataSource: PendingList,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "multiple", showCheckBoxesMode: "always" },
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
            fileName: "Pending Invoice",
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

        onSelectionChanged: function (clickedIndentCell) {
            if (clickedIndentCell.currentSelectedRowKeys.length > 0) {

                if (GblLedgerID === 0 || GblLedgerID === "") {
                    GRNNO = clickedIndentCell.currentSelectedRowKeys[0].ReceiptVoucherNo;
                    DelNoteNo = clickedIndentCell.currentSelectedRowKeys[0].DeliveryNoteNo;
                    GetTransactionID = clickedIndentCell.currentSelectedRowKeys[0].TransactionID;
                    GblLedgerID = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                    GblLedgerName = clickedIndentCell.currentSelectedRowKeys[0].LedgerName;
                }
                else if (GblLedgerID !== clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                    clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please select records which have same supplier..!", "warning", 3000);
                    clickedIndentCell.currentSelectedRowKeys = [];
                    return false;
                }
                else if (GblLedgerID === clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                    GetTransactionID = GetTransactionID + "," + clickedIndentCell.currentSelectedRowKeys[0].TransactionID;
                    DelNoteNo = DelNoteNo + "," + clickedIndentCell.currentSelectedRowKeys[0].DeliveryNoteNo;
                }
            }
            var GetPendingData = clickedIndentCell.selectedRowsData;
            if (GetPendingData.length === 0) {
                GRNNO = "";
                DelNoteNo = "";
                GetTransactionID = 0;
                GblLedgerID = 0;
                GblLedgerName = "";
            }
        },
        onEditorPreparing: function (e) {
            if (e.parentType === 'headerRow' && e.command === 'select') {
                e.editorElement.remove();
            }
        },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            //if (e.column.dataField === "ChallanQuantity") {
            //    e.cancel = false;
            //}
            //else {
            e.cancel = true;
            //}
        },
        onRowUpdated: function (editcell) {
            //var dataGrid = $('#POGridPending').dxDataGrid('instance');
            //var ReqQty = 0, PerQty = 0;
            //for (var xx = 0; xx < dataGrid.totalCount() ; xx++) {
            //    ReqQty = dataGrid._options.dataSource[xx].ReceiptQuantityComp;
            //    PerQty = dataGrid._options.dataSource[xx].PurchaseQuantity;
            //    if (ReqQty < PerQty) {
            //        dataGrid.cellValue(xx, "PurchaseQuantity", ReqQty)
            //        DevExpress.ui.notify("Purchase Quantity should not be greater then Pending Quantity..!", "error", 1000);
            //        return false;
            //    }
            //}
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
            { dataField: "PurchaseTransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "Supplier", width: 250 },
            { dataField: "ReceiptVoucherNo", visible: true, caption: "Receipt Note No.", width: 120 },
            { dataField: "ReceiptVoucherDate", visible: true, caption: "Receipt Date", width: 100 },
            { dataField: "PurchaseVoucherNo", visible: true, caption: "P.O. No.", width: 100 },
            { dataField: "PurchaseVoucherDate", visible: true, caption: "P.O. Date", width: 100 },
            { dataField: "ChallanQuantity", visible: true, caption: "Receipt Qty", width: 100 },
            { dataField: "DeliveryNoteNo", visible: true, caption: "Delivery Note No.", width: 120 },
            { dataField: "DeliveryNoteDate", visible: true, caption: "Delivery Note Date", width: 140 },
            { dataField: "GateEntryNo", visible: false, caption: "G.E. No.", width: 120 },
            { dataField: "GateEntryDate", visible: false, caption: "G.E. Date", width: 120 },
            { dataField: "LRNoVehicleNo", visible: false, caption: "LR No./Vehicle No.", width: 100 },
            { dataField: "Transporter", visible: false, caption: "Transporter", width: 100 }, //For Compair of Purchase qty
            { dataField: "ReceiverName", visible: true, caption: "Received By", width: 100 },
            { dataField: "Narration", visible: true, caption: "Narration", width: 80 },
            { dataField: "FYear", visible: false, caption: "FYear", width: 120 },
            { dataField: "CreatedBy", visible: true, caption: "CreatedBy", width: 100 },
            { dataField: "ReceivedBy", visible: false, caption: "ReceivedBy", width: 100 }
        ]
    });
}

$("#CreatePIButton").click(function () {
    ChargesGrid = [];
    FillGridDataObj = [];
    $("#CreatePIGrid").dxDataGrid({ dataSource: FillGridDataObj });
    $("#AdditionalChargesGrid").dxDataGrid({ dataSource: ChargesGrid });

    if (GetTransactionID === "" || GetTransactionID === 0) {
        DevExpress.ui.notify("Please Choose any row from given below grid..!", "warning", 3000);
        return false;
    }

    document.getElementById("TxtSupplierID").value = GblLedgerID;
    document.getElementById("TxtSupplierName").value = GblLedgerName;
    document.getElementById("textDeliveryNote").value = DelNoteNo;
    document.getElementById("TxtTcsRate").value = TCSRate;
    $("#TxtTcsRate").keyup();
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/GetItemRate",
        data: '{LedgerId:' + JSON.stringify(GblLedgerID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var I_RateRESS = JSON.parse(res);
            ItemRateString = { 'ItemRateObj': I_RateRESS };

            $.ajax({
                type: "POST",
                url: "WebService_PurchaseInvoice.asmx/PurchaseLedger",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var PurchaseLed = JSON.parse(res);
                    $("#PurchaseLedger").dxSelectBox({
                        items: PurchaseLed,
                        placeholder: "Choose--",
                        displayExpr: 'LedgerName',
                        valueExpr: 'LedgerID',
                        searchEnabled: true,
                        showClearButton: true
                    });

                }
            });
        }
    });

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/Supplier",
        data: '{LedgerID:' + Number(document.getElementById("TxtSupplierID").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.substr(1);
            res = res.slice(0, -1);
            newSUPllierArray = JSON.parse(res);

            GblGSTApplicable = true;
            GblCompanyStateTin = newSUPllierArray[0].CompanyStateTinNo;

            if (newSUPllierArray.length > 0) {
                document.getElementById("LblState").innerHTML = "State : " + newSUPllierArray[0].SupState;
                document.getElementById("LblCountry").innerHTML = "Country : " + newSUPllierArray[0].Country;
                document.getElementById("CurrentCurrency").innerHTML = newSUPllierArray[0].CurrencyCode;
                document.getElementById("VatGSTApplicable").innerHTML = newSUPllierArray[0].GSTApplicable;
                document.getElementById("ConversionRate").innerHTML = 1;
                document.getElementById("LblSupplierStateTin").innerHTML = newSUPllierArray[0].StateTinNo;
                document.getElementById("TxtMailingName").value = newSUPllierArray[0].MailingName;

                if (newSUPllierArray[0].GSTApplicable === "True" || newSUPllierArray[0].GSTApplicable === "1") {
                    GblGSTApplicable = true;
                } else {
                    GblGSTApplicable = false;
                }
            }
            else {
                document.getElementById("LblState").innerHTML = "";
                document.getElementById("LblCountry").innerHTML = "";
                document.getElementById("CurrentCurrency").innerHTML = "";
                document.getElementById("VatGSTApplicable").innerHTML = "";
                document.getElementById("ConversionRate").innerHTML = "";
                document.getElementById("LblSupplierStateTin").innerHTML = "";
                document.getElementById("TxtMailingName").value = "";
            }
        }
    });

    //Calculation Start
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/FillCreatePIGrid",
        data: '{DelNoteNo:' + JSON.stringify(DelNoteNo) + ',GetTransactionID:' + JSON.stringify(GetTransactionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var newArray = [];
            newArray = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";

            var FinalQty = 0;
            var RequiredQuantity = 0;
            MasterGridData = [];
            var MasterGridOpt = {};


            if (newArray.length > 0) {
                for (var d = 0; d < newArray.length; d++) {
                    FinalQty = Number(newArray[d].ChallanQuantity);
                    // RequiredQuantity = Number(newArray[d].ChallanQuantity);

                    var Qty = 0;
                    var Var_ItemGroupNameID = 0;
                    var Var_WtPerPacking = 0;
                    var Var_UnitPerPacking = 0;

                    if (FinalQty === "" || FinalQty === undefined || FinalQty === null || FinalQty === "NULL") {
                        Qty = 0;
                    }
                    else {
                        //Start New Code for Change Sheets
                        Var_ItemGroupNameID = newArray[d].ItemGroupNameID;
                        Var_WtPerPacking = newArray[d].ReceiptWtPerPacking;
                        Var_UnitPerPacking = newArray[d].UnitPerPacking;
                        Var_ConversionFactor = newArray[d].ConversionFactor;

                        if (Var_ItemGroupNameID === -1 || Var_ItemGroupNameID === "-1") {
                            if (newArray[d].PurchaseUnit.toUpperCase().includes("KG")) {
                                Qty = parseFloat(Number(FinalQty / Number(Var_UnitPerPacking)) * Number(Var_WtPerPacking)).toFixed(2);
                            }
                            else {
                                Qty = parseFloat(Number(FinalQty)).toFixed(2);
                            }

                        } else {
                            Qty = parseFloat(Number(FinalQty)).toFixed(2);
                        }
                    }

                    var PurchaseRate = "";
                    if (newArray[0].PurchaseRate === "" || newArray[0].PurchaseRate === undefined || newArray[0].PurchaseRate === null || newArray[0].PurchaseRate === "NULL") {
                        PurchaseRate = 0;
                    }
                    else {
                        PurchaseRate = newArray[0].PurchaseRate;
                    }

                    var ddlSupplierId = document.getElementById("TxtSupplierID").value;

                    if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                        PurchaseRate = PurchaseRate;
                    }
                    else {
                        ObjItemRate = [];

                        ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                            return el.LedgerID === ddlSupplierId &&
                                el.ItemID === newArray[0].ItemID;
                        });
                        if (newArray === [] || newArray === "" || newArray === undefined) {
                            PurchaseRate = PurchaseRate;
                        } else {
                            PurchaseRate = newArray[d].PurchaseRate;
                        }
                    }

                    var BasicAmt = 0;
                    BasicAmt = Number(Qty) * Number(PurchaseRate);

                    var DisPercentage = 0;
                    var TaxAbleAmt = 0;

                    var LandedPrice = 0.00;
                    var LandedAmt = 0;

                    var DiscountAmt = (Number(BasicAmt) * Number(DisPercentage)) / 100;

                    TaxAbleAmt = Number(BasicAmt) - Number(DiscountAmt);
                    LandedAmt = Number(BasicAmt) - Number(DiscountAmt);
                    LandedPrice = parseFloat(Number(LandedAmt) / Number(Qty)).toFixed(2);

                    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;

                    var IGSTPER = 0, SGSTPER = 0, CGSTPER = 0;
                    var IGSTAMT = 0, SGSTAMT = 0, CGSTAMT = 0;
                    var TotalAmount = 0;

                    if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                        if (newArray[0].CGSTTaxPercentage === "" || newArray[0].CGSTTaxPercentage === undefined || newArray[0].CGSTTaxPercentage === null || newArray[0].CGSTTaxPercentage === "NULL") {
                            CGSTPER = 0;
                        }
                        else {
                            CGSTPER = newArray[0].CGSTTaxPercentage;
                        }
                        if (newArray[0].SGSTTaxPercentage === "" || newArray[0].SGSTTaxPercentage === undefined || newArray[0].SGSTTaxPercentage === null || newArray[0].SGSTTaxPercentage === "NULL") {
                            SGSTPER = 0;
                        }
                        else {
                            SGSTPER = newArray[0].SGSTTaxPercentage;
                        }
                        SGSTAMT = (Number(TaxAbleAmt) * Number(SGSTPER)) / 100;
                        CGSTAMT = (Number(TaxAbleAmt) * Number(CGSTPER)) / 100;
                        TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt);

                    }
                    else {
                        if (newArray[0].IGSTTaxPercentage === "" || newArray[0].IGSTTaxPercentage === undefined || newArray[0].IGSTTaxPercentage === null || newArray[0].IGSTTaxPercentage === "NULL") {
                            IGSTPER = 0;
                        }
                        else {
                            IGSTPER = newArray[0].IGSTTaxPercentage;
                        }

                        IGSTAMT = ((Number(TaxAbleAmt) * Number(IGSTPER)) / 100);
                        TotalAmount = Number(IGSTAMT) + Number(TaxAbleAmt);
                    }

                    MasterGridOpt = {};

                    MasterGridOpt.ReceiptQuantityComp = Qty;
                    MasterGridOpt.ReceiptQuantity = Qty;

                    MasterGridOpt.BasicAmount = parseFloat(BasicAmt).toFixed(2);
                    MasterGridOpt.Disc = parseFloat(DisPercentage).toFixed(2);
                    MasterGridOpt.Tolerance = 0;
                    MasterGridOpt.AfterDisAmt = parseFloat(TaxAbleAmt).toFixed(2);
                    MasterGridOpt.TaxableAmount = parseFloat(TaxAbleAmt).toFixed(2);

                    var GSTPER = newArray[0].GSTTaxPercentage;
                    if (GSTPER === "" || GSTPER === undefined || GSTPER === null) {
                        GSTPER = 0;
                    }

                    MasterGridOpt.GSTTaxPercentage = parseFloat(GSTPER).toFixed(2);
                    MasterGridOpt.CGSTTaxPercentage = parseFloat(CGSTPER).toFixed(2);
                    MasterGridOpt.SGSTTaxPercentage = parseFloat(SGSTPER).toFixed(2);
                    MasterGridOpt.IGSTTaxPercentage = parseFloat(IGSTPER).toFixed(2);

                    MasterGridOpt.CGSTAmt = parseFloat(CGSTAMT).toFixed(2);
                    MasterGridOpt.SGSTAmt = parseFloat(SGSTAMT).toFixed(2);
                    MasterGridOpt.IGSTAmt = parseFloat(IGSTAMT).toFixed(2);
                    MasterGridOpt.TotalAmount = parseFloat(TotalAmount).toFixed(2);

                    MasterGridOpt.LandedPrice = parseFloat(LandedPrice).toFixed(2);
                    MasterGridOpt.LandedAmt = parseFloat(LandedAmt).toFixed(2);

                    MasterGridOpt.TransactionID = newArray[d].TransactionID;//MasterGrid  
                    MasterGridOpt.PurchaseTransactionID = newArray[d].PurchaseTransactionID;
                    MasterGridOpt.ItemID = newArray[d].ItemID;
                    MasterGridOpt.ItemGroupID = newArray[d].ItemGroupID;
                    MasterGridOpt.ItemGroupNameID = newArray[d].ItemGroupNameID;
                    MasterGridOpt.PurchaseVoucherNo = newArray[d].PurchaseVoucherNo;
                    MasterGridOpt.PurchaseVoucherDate = newArray[d].PurchaseVoucherDate;
                    MasterGridOpt.ItemCode = newArray[d].ItemCode;
                    MasterGridOpt.ItemName = newArray[d].ItemName;
                    MasterGridOpt.PurchaseOrderQuantity = newArray[d].PurchaseOrderQuantity;
                    MasterGridOpt.StockUnit = newArray[d].StockUnit;
                    MasterGridOpt.ChallanQuantity = newArray[d].ChallanQuantity;
                    MasterGridOpt.PurchaseRate = newArray[d].PurchaseRate;
                    MasterGridOpt.PurchaseUnit = newArray[d].PurchaseUnit;
                    MasterGridOpt.ReceiptWtPerPacking = newArray[d].ReceiptWtPerPacking;
                    MasterGridOpt.ExpectedDeliveryDate = newArray[d].ExpectedDeliveryDate;
                    MasterGridOpt.PurchaseTolerance = newArray[d].PurchaseTolerance;//RequiredQuantity                    
                    MasterGridOpt.WtPerPacking = newArray[d].WtPerPacking;
                    MasterGridOpt.UnitPerPacking = newArray[d].UnitPerPacking;
                    MasterGridOpt.ConversionFactor = newArray[d].ConversionFactor;
                    MasterGridOpt.SizeW = newArray[d].SizeW;

                    MasterGridOpt.StockUnit = newArray[0].StockUnit;
                    MasterGridOpt.CreatedBy = newArray[d].CreatedBy;
                    MasterGridOpt.Narration = newArray[d].Narration;
                    MasterGridOpt.FYear = newArray[d].FYear;
                    MasterGridOpt.ProductHSNName = newArray[d].ProductHSNName;
                    MasterGridOpt.HSNCode = newArray[d].HSNCode;

                    MasterGridData.push(MasterGridOpt);
                }
            }

            FillGridDataObj = [];
            FillGridDataObj = MasterGridData;
            $("#CreatePIGrid").dxDataGrid({ dataSource: FillGridDataObj });
        }
    });

    GblStatus = "";
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;

    document.getElementById("CreatePIButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreatePIButton").setAttribute("data-target", "#largeModal");

});

function AddItemWithChargessGrid() {

    var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
    var CreatePIGrid_RowCount = CreatePIGrid.totalCount();

    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var Charge_RowCount = AdditionalChargesGrid.totalCount();

    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;

    var NewAfterDisAmt = 0;
    if (CreatePIGrid_RowCount > 0) {
        for (var t = 0; t < CreatePIGrid_RowCount; t++) {
            CreatePIGrid._options.dataSource[t].TaxableAmount = FillGridDataObj[t].AfterDisAmt;
            NewAfterDisAmt = Number(NewAfterDisAmt) + Number(FillGridDataObj[t].AfterDisAmt);
        }
    }

    document.getElementById("TxtAfterDisAmt").value = NewAfterDisAmt;
    BasicAmt = 0; IGSTPER = 0; SGSTPER = 0; CGSTPER = 0;
    TaxAbleAmt = 0; IGSTAMT = 0; SGSTAMT = 0; CGSTAMT = 0; TotalAmount = 0;

    var AfterDisAmt_WithGstApplicable = 0;
    var AfterLandedAmt_WithGstApplicable = 0;

    for (var c = 0; c < ChargesGrid.length; c++) {

        var GridTaxType = ChargesGrid[c].TaxType;
        var TaxRatePer = ChargesGrid[c].TaxRatePer;
        var GSTLedgerType = ChargesGrid[c].GSTLedgerType;
        var CalculateON = ChargesGrid[c].CalculateON;
        var taxAmt = 0;

        if (GridTaxType === "GST") {
            taxAmt = 0;
            if (TaxRatePer === 0 || TaxRatePer === "0") {
                taxAmt = 0;
                if (GSTLedgerType.toUpperCase().trim() === "CENTRAL TAX") {
                    taxAmt = Number(document.getElementById("TxtCGSTAmt").value);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "STATE TAX") {
                    taxAmt = Number(document.getElementById("TxtSGSTAmt").value);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                    taxAmt = Number(document.getElementById("TxtIGSTAmt").value);
                }

                if (ChargesGrid[c].InAmount === true || ChargesGrid[c].InAmount === "1" || ChargesGrid[c].InAmount === 1 || ChargesGrid[c].InAmount === "true") {
                    taxAmt = ChargesGrid[c].ChargesAmount;
                }
                else {
                    taxAmt = taxAmt;
                }
                ChargesGrid[c].ChargesAmount = taxAmt;
            }
            else {
                taxAmt = 0;
                var FilterAmt = 0;

                if (GSTLedgerType.toUpperCase().trim() === "CENTRAL TAX") {

                    if (FillGridDataObj.length > 0) {
                        for (var cg = 0; cg < FillGridDataObj.length; cg++) {
                            if (TaxRatePer === FillGridDataObj[cg].CGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[cg].CGSTAmt);
                            }
                        }
                    }
                    // taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "STATE TAX") {

                    if (FillGridDataObj.length > 0) {
                        for (var sg = 0; sg < FillGridDataObj.length; sg++) {
                            if (TaxRatePer === FillGridDataObj[sg].SGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[sg].SGSTAmt);
                            }
                        }
                    }
                    //taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                    if (FillGridDataObj.length > 0) {
                        for (var ig = 0; ig < FillGridDataObj.length; ig++) {
                            if (TaxRatePer === FillGridDataObj[ig].IGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[ig].IGSTAmt);
                            }
                        }
                    }
                    // taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }

                if (ChargesGrid[c].InAmount === true || ChargesGrid[c].InAmount === "1" || ChargesGrid[c].InAmount === 1 || ChargesGrid[c].InAmount === "true") {
                    taxAmt = ChargesGrid[c].ChargesAmount;
                }
                else {
                    taxAmt = taxAmt;
                }
                ChargesGrid[c].ChargesAmount = parseFloat(Number(taxAmt)).toFixed(2);
            }
        } else {
            taxAmt = 0;
            var OtherAmt = 0;
            var RatioLandedAmt = 0;

            if (ChargesGrid[c].InAmount === true || ChargesGrid[c].InAmount === "1" || ChargesGrid[c].InAmount === 1 || ChargesGrid[c].InAmount === "true") {
                OtherAmt = ChargesGrid[c].ChargesAmount;
                RatioLandedAmt = ChargesGrid[c].ChargesAmount;
            }
            else {
                OtherAmt = (Number(document.getElementById("TxtAfterDisAmt").value) * TaxRatePer) / 100;
                RatioLandedAmt = (Number(document.getElementById("TxtTtlLandedtAmtAmt").value) * TaxRatePer) / 100;
            }

            var GSTAplicable = ChargesGrid[c].GSTApplicable;

            if (GSTAplicable === true || GSTAplicable === "1" || GSTAplicable === 1 || GSTAplicable === "true") {
                if (CalculateON.toUpperCase().trim() === "VALUE") {

                    if (FillGridDataObj.length > 0) {
                        for (var g = 0; g < FillGridDataObj.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = (OtherAmt / Number(document.getElementById("TxtAfterDisAmt").value) * Number(FillGridDataObj[g].AfterDisAmt)) + Number(FillGridDataObj[g].TaxableAmount);

                            AfterLandedAmt_WithGstApplicable = 0;
                            AfterLandedAmt_WithGstApplicable = (RatioLandedAmt / Number(document.getElementById("TxtTtlLandedtAmtAmt").value) * Number(FillGridDataObj[g].AfterDisAmt)) + Number(FillGridDataObj[g].LandedAmt);


                            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                                if (FillGridDataObj[g].CGSTTaxPercentage === "" || FillGridDataObj[g].CGSTTaxPercentage === undefined || FillGridDataObj[g].CGSTTaxPercentage === null || FillGridDataObj[g].CGSTTaxPercentage === "NULL") {
                                    CGSTPER = 0;
                                }
                                else {
                                    CGSTPER = FillGridDataObj[g].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                                }
                                if (FillGridDataObj[g].SGSTTaxPercentage === "" || FillGridDataObj[g].SGSTTaxPercentage === undefined || FillGridDataObj[g].SGSTTaxPercentage === null || FillGridDataObj[g].SGSTTaxPercentage === "NULL") {
                                    SGSTPER = 0;
                                }
                                else {
                                    SGSTPER = FillGridDataObj[g].SGSTTaxPercentage;
                                }
                                SGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(SGSTPER)) / 100);
                                CGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(CGSTPER)) / 100);
                                TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            else {
                                if (FillGridDataObj[g].IGSTTaxPercentage === "" || FillGridDataObj[g].IGSTTaxPercentage === undefined || FillGridDataObj[g].IGSTTaxPercentage === null || FillGridDataObj[g].IGSTTaxPercentage === "NULL") {
                                    IGSTPER = 0;
                                }
                                else {
                                    IGSTPER = FillGridDataObj[g].IGSTTaxPercentage;
                                }

                                IGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(IGSTPER)) / 100);
                                TotalAmount = Number(IGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }

                            FillGridDataObj[g].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
                            FillGridDataObj[g].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
                            FillGridDataObj[g].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
                            FillGridDataObj[g].TotalAmount = parseFloat(Number(TotalAmount)).toFixed(2);
                            FillGridDataObj[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);

                            FillGridDataObj[g].LandedAmt = parseFloat(Number(AfterLandedAmt_WithGstApplicable)).toFixed(2);
                            FillGridDataObj[g].LandedPrice = parseFloat((Number(AfterLandedAmt_WithGstApplicable)) / Number(FillGridDataObj[g].ReceiptQuantity)).toFixed(2);
                        }
                    }
                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
                else {
                    if (FillGridDataObj.length > 0) {
                        for (var g = 0; g < FillGridDataObj.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = (OtherAmt / Number(document.getElementById("TxtTotalQty").value) * Number(FillGridDataObj[g].ReceiptQuantity)) + Number(FillGridDataObj[g].TaxableAmount);

                            AfterLandedAmt_WithGstApplicable = 0;
                            AfterLandedAmt_WithGstApplicable = (RatioLandedAmt / Number(document.getElementById("TxtTtlLandedtAmtAmt").value) * Number(FillGridDataObj[g].AfterDisAmt)) + Number(FillGridDataObj[g].LandedAmt);

                            FillGridDataObj[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);

                            FillGridDataObj[g].LandedAmt = parseFloat(Number(AfterLandedAmt_WithGstApplicable)).toFixed(2);
                            FillGridDataObj[g].LandedPrice = parseFloat((Number(AfterLandedAmt_WithGstApplicable)) / Number(FillGridDataObj[g].ReceiptQuantity)).toFixed(2);
                        }
                    }

                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
            }
            else {
                if (CalculateON.toUpperCase().trim() === "VALUE") {
                    if (FillGridDataObj.length > 0) {
                        for (var g = 0; g < FillGridDataObj.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            //AfterDisAmt_WithGstApplicable = Number(FillGridDataObj[g].BasicAmount) + (Number(FillGridDataObj[g].BasicAmount) * Number(FillGridDataObj[g].Disc) / 100);
                            AfterDisAmt_WithGstApplicable = Number(FillGridDataObj[g].BasicAmount) - (Number(FillGridDataObj[g].BasicAmount) * Number(FillGridDataObj[g].Disc) / 100);

                            AfterLandedAmt_WithGstApplicable = 0;
                            AfterLandedAmt_WithGstApplicable = (RatioLandedAmt / Number(document.getElementById("TxtTtlLandedtAmtAmt").value) * Number(FillGridDataObj[g].AfterDisAmt)) + Number(FillGridDataObj[g].LandedAmt);

                            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                                if (FillGridDataObj[g].CGSTTaxPercentage === "" || FillGridDataObj[g].CGSTTaxPercentage === undefined || FillGridDataObj[g].CGSTTaxPercentage === null || FillGridDataObj[g].CGSTTaxPercentage === "NULL") {
                                    CGSTPER = 0;
                                }
                                else {
                                    CGSTPER = FillGridDataObj[g].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                                }
                                if (FillGridDataObj[g].SGSTTaxPercentage === "" || FillGridDataObj[g].SGSTTaxPercentage === undefined || FillGridDataObj[g].SGSTTaxPercentage === null || FillGridDataObj[g].SGSTTaxPercentage === "NULL") {
                                    SGSTPER = 0;
                                }
                                else {
                                    SGSTPER = FillGridDataObj[g].SGSTTaxPercentage;
                                }
                                SGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(SGSTPER)) / 100)
                                CGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(CGSTPER)) / 100)
                                TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            else {
                                if (FillGridDataObj[g].IGSTTaxPercentage === "" || FillGridDataObj[g].IGSTTaxPercentage === undefined || FillGridDataObj[g].IGSTTaxPercentage === null || FillGridDataObj[g].IGSTTaxPercentage === "NULL") {
                                    IGSTPER = 0;
                                }
                                else {
                                    IGSTPER = FillGridDataObj[g].IGSTTaxPercentage;
                                }

                                IGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(IGSTPER)) / 100)
                                TotalAmount = Number(IGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }

                            FillGridDataObj[g].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
                            FillGridDataObj[g].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
                            FillGridDataObj[g].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
                            FillGridDataObj[g].TotalAmount = parseFloat(Number(TotalAmount)).toFixed(2);
                            FillGridDataObj[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);

                            FillGridDataObj[g].LandedAmt = parseFloat(Number(AfterLandedAmt_WithGstApplicable)).toFixed(2);
                            FillGridDataObj[g].LandedPrice = parseFloat((Number(AfterLandedAmt_WithGstApplicable)) / Number(FillGridDataObj[g].ReceiptQuantity)).toFixed(2);
                        }
                    }

                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
                else {

                    if (FillGridDataObj.length > 0) {
                        for (var g = 0; g < FillGridDataObj.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = Number(document.getElementById("TxtAfterDisAmt").value);

                            AfterLandedAmt_WithGstApplicable = 0;
                            AfterLandedAmt_WithGstApplicable = (RatioLandedAmt / Number(document.getElementById("TxtTtlLandedtAmtAmt").value) * Number(FillGridDataObj[g].AfterDisAmt)) + Number(FillGridDataObj[g].LandedAmt);

                            FillGridDataObj[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);

                            FillGridDataObj[g].LandedAmt = parseFloat(Number(AfterLandedAmt_WithGstApplicable)).toFixed(2);
                            FillGridDataObj[g].LandedPrice = parseFloat((Number(AfterLandedAmt_WithGstApplicable)) / Number(FillGridDataObj[g].ReceiptQuantity)).toFixed(2);

                        }
                    }
                    //ChargesGrid[c].ChargesAmount = OtherAmt;
                }

                taxAmt = (TaxRatePer * Number(document.getElementById("TxtAfterDisAmt").value)) / 100;

                if (ChargesGrid[c].InAmount === true || ChargesGrid[c].InAmount === "1" || ChargesGrid[c].InAmount === 1 || ChargesGrid[c].InAmount === "true") {
                    taxAmt = ChargesGrid[c].ChargesAmount;
                }
                else {
                    taxAmt = taxAmt;
                }

                ChargesGrid[c].ChargesAmount = parseFloat(Number(taxAmt)).toFixed(2);

            }
        }

    }
    AdditionalChargesGrid.refresh();
    GridColumnCal();
}

function AddItemCalculation() {

    var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
    var CreatePIGrid_RowCount = CreatePIGrid.totalCount();

    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var Charge_RowCount = AdditionalChargesGrid.totalCount();

    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;

    if (CreatePIGrid_RowCount > 0) {
        for (var t = 0; t < CreatePIGrid_RowCount; t++) {
            CreatePIGrid._options.dataSource[t].TaxableAmount = FillGridDataObj[t].AfterDisAmt;
        }
    }

    if (FillGridDataObj.length > 0) {

        for (var zz = 0; zz < FillGridDataObj.length; zz++) {
            var CreatePIGridRow = zz;

            var PurchaseRate = FillGridDataObj[CreatePIGridRow].PurchaseRate;
            var Qty = FillGridDataObj[CreatePIGridRow].ReceiptQuantity;
            var DisPercentage = FillGridDataObj[CreatePIGridRow].Disc;

            var ddlSupplierId = document.getElementById("TxtSupplierID").value;
            if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                PurchaseRate = PurchaseRate;
            }
            else {

                ObjItemRate = [];
                ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                    return el.LedgerID === ddlSupplierId &&
                        el.ItemID === FillGridDataObj[CreatePIGridRow].ItemID;
                });
                if (FillGridDataObj === [] || FillGridDataObj === "" || FillGridDataObj === undefined) {
                    PurchaseRate = PurchaseRate;
                } else {
                    PurchaseRate = FillGridDataObj[zz].PurchaseRate;
                }
            }

            if (Qty === "" || Qty === undefined || Qty === null || Qty === "NULL") {
                Qty = 0;
            } else {
                Qty = Qty;
            }
            if (DisPercentage === "" || DisPercentage === undefined || DisPercentage === null || DisPercentage === "NULL") {
                DisPercentage = 0;
            } else {
                DisPercentage = DisPercentage;
            }
            if (PurchaseRate === "" || PurchaseRate === undefined || PurchaseRate === null || PurchaseRate === "NULL") {
                PurchaseRate = 0;
            } else {
                PurchaseRate = PurchaseRate;
            }

            BasicAmt = parseFloat(Number(Qty) * Number(PurchaseRate)).toFixed(2);

            var DiscountAmt = parseFloat((Number(BasicAmt) * Number(DisPercentage)) / 100).toFixed(2);

            var afterDiscountAmt = 0;
            afterDiscountAmt = parseFloat(Number(BasicAmt) - Number(DiscountAmt)).toFixed(2);

            TaxAbleAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);

            var LandedPrice = 0.00;
            var LandedAmt = 0;

            LandedAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);
            LandedPrice = parseFloat(Number(LandedAmt) / (Number(FillGridDataObj[CreatePIGridRow].ReceiptQuantity))).toFixed(2);

            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                if (FillGridDataObj[CreatePIGridRow].CGSTTaxPercentage === "" || FillGridDataObj[CreatePIGridRow].CGSTTaxPercentage === undefined || FillGridDataObj[CreatePIGridRow].CGSTTaxPercentage === null || FillGridDataObj[CreatePIGridRow].CGSTTaxPercentage === "NULL") {
                    CGSTPER = 0;
                }
                else {
                    CGSTPER = FillGridDataObj[CreatePIGridRow].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                }
                if (FillGridDataObj[CreatePIGridRow].SGSTTaxPercentage === "" || FillGridDataObj[CreatePIGridRow].SGSTTaxPercentage === undefined || FillGridDataObj[CreatePIGridRow].SGSTTaxPercentage === null || FillGridDataObj[CreatePIGridRow].SGSTTaxPercentage === "NULL") {
                    SGSTPER = 0;
                }
                else {
                    SGSTPER = FillGridDataObj[CreatePIGridRow].SGSTTaxPercentage;
                }
                SGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(SGSTPER)) / 100)).toFixed(2);
                CGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(CGSTPER)) / 100)).toFixed(2);
                //Cal Corection
                IGSTAMT = 0;
                TotalAmount = parseFloat(Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
            }
            else {
                if (FillGridDataObj[CreatePIGridRow].IGSTTaxPercentage === "" || FillGridDataObj[CreatePIGridRow].IGSTTaxPercentage === undefined || FillGridDataObj[CreatePIGridRow].IGSTTaxPercentage === null || FillGridDataObj[CreatePIGridRow].IGSTTaxPercentage === "NULL") {
                    IGSTPER = 0;
                }
                else {
                    IGSTPER = FillGridDataObj[CreatePIGridRow].IGSTTaxPercentage;
                }
                //Cal Corection
                SGSTAMT = 0;
                CGSTAMT = 0;
                IGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(IGSTPER)) / 100)).toFixed(2);
                TotalAmount = parseFloat(Number(IGSTAMT) + Number(TaxAbleAmt)).toFixed(2);
            }

            FillGridDataObj[CreatePIGridRow].BasicAmount = BasicAmt;
            FillGridDataObj[CreatePIGridRow].AfterDisAmt = afterDiscountAmt;
            FillGridDataObj[CreatePIGridRow].TaxableAmount = TaxAbleAmt;
            FillGridDataObj[CreatePIGridRow].CGSTAmt = CGSTAMT;
            FillGridDataObj[CreatePIGridRow].SGSTAmt = SGSTAMT;
            FillGridDataObj[CreatePIGridRow].IGSTAmt = IGSTAMT;
            FillGridDataObj[CreatePIGridRow].TotalAmount = TotalAmount;
            FillGridDataObj[CreatePIGridRow].PurchaseRate = PurchaseRate;

            FillGridDataObj[CreatePIGridRow].LandedPrice = parseFloat(LandedPrice).toFixed(2);
            FillGridDataObj[CreatePIGridRow].LandedAmt = parseFloat(LandedAmt).toFixed(2);
        }

    }

}

function GridColumnCal() {

    // var AddCHGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var dataGrid = $('#CreatePIGrid').dxDataGrid('instance');
    var gridColBasicAmt = 0;
    var gridColTotalAmt = 0;
    var gridColCGSTAmt = 0;
    var gridColSGSTAmt = 0;
    var gridColIGSTAmt = 0;
    var gridAfterDisAmt = 0;
    var gridTaxAbleSum = 0;
    var gridColTotalQty = 0;
    var gridColTotalTax = 0;
    var gridLandedAmtSum = 0;

    for (var CH = 0; CH < ChargesGrid.length; CH++) {
        gridColTotalTax = parseFloat(Number(gridColTotalTax) + Number(ChargesGrid[CH].ChargesAmount)).toFixed(2);
    }
    for (var cal = 0; cal < dataGrid.totalCount(); cal++) {
        gridColBasicAmt = parseFloat(Number(gridColBasicAmt) + Number(dataGrid._options.dataSource[cal].BasicAmount)).toFixed(2);
        gridColTotalAmt = parseFloat(Number(gridColTotalAmt) + Number(dataGrid._options.dataSource[cal].TotalAmount)).toFixed(2);
        gridColTotalQty = parseFloat(Number(gridColTotalQty) + Number(dataGrid._options.dataSource[cal].ReceiptQuantity)).toFixed(2);

        gridColCGSTAmt = parseFloat(Number(gridColCGSTAmt) + Number(dataGrid._options.dataSource[cal].CGSTAmt)).toFixed(2);
        gridColSGSTAmt = parseFloat(Number(gridColSGSTAmt) + Number(dataGrid._options.dataSource[cal].SGSTAmt)).toFixed(2);
        gridColIGSTAmt = parseFloat(Number(gridColIGSTAmt) + Number(dataGrid._options.dataSource[cal].IGSTAmt)).toFixed(2);

        gridAfterDisAmt = parseFloat(Number(gridAfterDisAmt) + Number(dataGrid._options.dataSource[cal].AfterDisAmt)).toFixed(2);
        gridTaxAbleSum = parseFloat(Number(gridTaxAbleSum) + Number(dataGrid._options.dataSource[cal].TaxableAmount)).toFixed(2);

        gridLandedAmtSum = parseFloat(Number(gridLandedAmtSum) + Number(dataGrid._options.dataSource[cal].AfterDisAmt)).toFixed(2);
    }

    document.getElementById("TxtBasicAmt").value = gridColBasicAmt;
    document.getElementById("TxtNetAmt").value = Math.round(gridColTotalAmt);

    document.getElementById("TxtTotalQty").value = gridColTotalQty;

    document.getElementById("TxtCGSTAmt").value = gridColCGSTAmt;
    document.getElementById("TxtSGSTAmt").value = gridColSGSTAmt;
    document.getElementById("TxtIGSTAmt").value = gridColIGSTAmt;

    document.getElementById("TxtAfterDisAmt").value = gridAfterDisAmt;
    document.getElementById("Txt_TaxAbleSum").value = gridTaxAbleSum;

    document.getElementById("TxtTtlLandedtAmtAmt").value = gridLandedAmtSum;
    document.getElementById("TxtRoundOff").value = parseFloat((Number(document.getElementById("TxtNetAmt").value) - (gridColTotalAmt))).toFixed(2);

    document.getElementById("TxtTaxAmt").value = parseFloat(Number(gridColTotalTax)).toFixed(2);
}

//Additional Charges
fillChargesGrid();

var CHRow = "", CHCol = "";
var Var_ChargeHead = "";
var ObjChargeHead = [];

function fillChargesGrid() {
    var LName = [];
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/CHLname",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
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
                showClearButton: true,

            });

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
                onRowRemoving: function (e) {
                    CHRemID = "";
                    CHRemID = e.data.LedgerID;

                },
                onRowRemoved: function (e) {

                    AddItemCalculation();
                    GridColumnCal();
                    AddItemWithChargessGrid();
                    var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
                    CreatePIGrid.refresh();
                    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                    AdditionalChargesGrid.refresh();

                },
                onRowUpdated: function (CHGRID) {

                    AddItemCalculation();
                    GridColumnCal();
                    AddItemWithChargessGrid();
                    var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
                    CreatePIGrid.refresh();
                    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                    AdditionalChargesGrid.refresh();
                },

                columns: [
                    { dataField: "LedgerName", visible: true, caption: "Tax  Ledger", width: 200 },
                    { dataField: "TaxRatePer", visible: true, caption: "Tax %", width: 80 },
                    {
                        dataField: "CalculateON", visible: true, caption: "Calcu. ON", width: 80,
                        lookup: {
                            dataSource: CalculateOnLookup,
                            displayExpr: "Name",
                            valueExpr: "Name",
                        }
                    },
                    { dataField: "GSTApplicable", visible: true, caption: "GST Applicable", width: 100, dataType: "boolean" },
                    { dataField: "InAmount", visible: true, caption: "In Amount", width: 80, dataType: "boolean" },
                    { dataField: "ChargesAmount", visible: true, caption: "Amount", width: 80 },
                    { dataField: "IsCumulative", visible: false, caption: "Is Cumulative", width: 80 },
                    { dataField: "TaxType", visible: true, caption: "Tax Type", width: .1 },
                    { dataField: "GSTLedgerType", visible: false, caption: "GST Ledger Type", width: 80 },
                    { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 80 },
                ]

            })



        }
    });

}

$("#BtnAddLedgerCharge").click(function () {
    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var rowCountAC = AdditionalChargesGrid.totalCount();

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
        DevExpress.ui.notify("Please enter Purchase rate in above grid before add charges..!", "error", 1000);
        window.setTimeout(function () { e.component.cancelEditData(); }, 0)
    } else {
        var optCH = {};
        if (ChooseText !== "" && ChooseText !== undefined && ChooseText !== null) {
            ObjChargeHead = Var_ChargeHead.LedgerDetail.filter(function (el) {
                return el.LedgerID === ChooseID;
            });
            optCH.LedgerName = ChooseText;
            optCH.LedgerID = ObjChargeHead[0].LedgerID;
            var gstapl = ObjChargeHead[0].GSTApplicable;
            if (gstapl === "False" || gstapl === false) {
                gstapl = false;
            }
            else if (gstapl === "True" || gstapl === true) {
                gstapl = true
            }
            optCH.GSTApplicable = gstapl;
            optCH.TaxType = ObjChargeHead[0].TaxType;
            optCH.GSTLedgerType = ObjChargeHead[0].GSTLedgerType;
            optCH.CalculateON = ObjChargeHead[0].GSTCalculationOn;
            optCH.TaxRatePer = ObjChargeHead[0].TaxPercentage;
            ChargesGrid.push(optCH);


            $("#AdditionalChargesGrid").dxDataGrid({
                dataSource: ChargesGrid,
            });

            AddItemCalculation();
            GridColumnCal();
            AddItemWithChargessGrid();
            var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
            CreatePIGrid.refresh();
            // var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
            AdditionalChargesGrid.refresh();
        }
    }
});

$("#BtnSave").click(function () {
    var CreatePIGrid = $('#CreatePIGrid').dxDataGrid('instance');
    var CreatePIGridRow = CreatePIGrid.totalCount();

    var ChargesGridData = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var ChargesGridRow = ChargesGridData.totalCount();


    var TxtSupplierID = document.getElementById("TxtSupplierID").value;
    var TxtMailingName = document.getElementById("TxtMailingName").value;
    var VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
    var PurchaseLedger = $('#PurchaseLedger').dxSelectBox('instance').option('value');

    var TxtBasicAmt = document.getElementById("TxtBasicAmt").value;
    var TxtTaxAmt = document.getElementById("TxtTaxAmt").value;
    var TxtRoundOff = document.getElementById("TxtRoundOff").value;
    var TxtNetAmt = document.getElementById("TxtNetAmt").value;

    var TxtTotalQty = document.getElementById("TxtTotalQty").value;
    var Txt_TaxAbleSum = document.getElementById("Txt_TaxAbleSum").value;
    var TxtTtlLandedtAmtAmt = document.getElementById("TxtTtlLandedtAmtAmt").value;
    var TxtAfterDisAmt = document.getElementById("TxtAfterDisAmt").value;
    var TxtIGSTAmt = document.getElementById("TxtIGSTAmt").value;
    var TxtSGSTAmt = document.getElementById("TxtSGSTAmt").value;
    var TxtCGSTAmt = document.getElementById("TxtCGSTAmt").value;

    var PIBillNo = document.getElementById("PIBillNo").value;
    var PIBillDate = $('#PIBillDate').dxDateBox('instance').option('value');
    var textDeliveryNote = document.getElementById("textDeliveryNote").value;
    var textNaretion = document.getElementById("textNaretion").value;
    var TCSAMOUNT = document.getElementById("TxtTcsAmount").value;
    var TCTRate = Number(document.getElementById("TxtNetAmt").value);

    if (PurchaseLedger === "" || PurchaseLedger === undefined || PurchaseLedger === null) {
        DevExpress.ui.notify("Please Choose Purchase Ledger..!", "error", 1000);
        document.getElementById("ValStrPurchaseLedger").style.fontSize = "10px";
        document.getElementById("ValStrPurchaseLedger").style.display = "block";
        document.getElementById("ValStrPurchaseLedger").innerHTML = 'This field should not be empty..Purchase Ledger';
        return false;
    }
    else {
        document.getElementById("ValStrPurchaseLedger").style.display = "none";
    }

    if (PIBillNo === "" || PIBillNo === undefined || PIBillNo === null) {
        DevExpress.ui.notify("Please Enter Bill No..!", "error", 1000);
        document.getElementById("PIBillNo").focus();
        document.getElementById("ValStrPIBillNo").style.display = "block";
        document.getElementById("ValStrPIBillNo").innerHTML = 'This field should not be empty..Bill No.';
        return false;
    }
    else {
        document.getElementById("ValStrPIBillNo").style.display = "none";
    }

    if (CreatePIGridRow < 1) {
        DevExpress.ui.notify("Please add Item in given below Grid..!", "error", 1000);
        return false;
    }


    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    OperationRecordMain.VoucherID = -32;
    OperationRecordMain.VoucherDate = VoucherDate;
    OperationRecordMain.LedgerID = TxtSupplierID;
    OperationRecordMain.PurchaseLedgerID = PurchaseLedger;
    OperationRecordMain.TotalQuantity = TxtTotalQty;
    OperationRecordMain.TotalBasicAmount = Number(TxtBasicAmt).toFixed(2);
    OperationRecordMain.TotalCGSTTaxAmount = Number(TxtCGSTAmt).toFixed(2);
    OperationRecordMain.TotalSGSTTaxAmount = Number(TxtSGSTAmt).toFixed(2);
    OperationRecordMain.TotalIGSTTaxAmount = Number(TxtIGSTAmt).toFixed(2);
    OperationRecordMain.TotalTaxAmount = Number(TxtTaxAmt).toFixed(2);
    OperationRecordMain.NetAmount = Number(TxtNetAmt).toFixed(2);
    OperationRecordMain.Narration = textNaretion;
    OperationRecordMain.DeliveryNoteNo = textDeliveryNote;
    OperationRecordMain.InvoiceNo = PIBillNo;
    OperationRecordMain.InvoiceDate = PIBillDate;
    OperationRecordMain.RoundOffValue = TxtRoundOff;
    OperationRecordMain.TotalDiscountAmount = Number(TxtBasicAmt) - Number(TxtAfterDisAmt);
    OperationRecordMain.TCSRate = TCSRate;
    OperationRecordMain.TcsAmount = TCSAMOUNT;

    jsonObjectsRecordMain.push(OperationRecordMain);

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    var TransactionID_String = "";


    if (CreatePIGridRow > 0) {
        for (var e = 0; e < CreatePIGridRow; e++) {
            OperationRecordDetail = {};
            if (TransactionID_String === "") {
                TransactionID_String = CreatePIGrid._options.dataSource[e].TransactionID;
            }
            else {
                TransactionID_String = TransactionID_String + "," + CreatePIGrid._options.dataSource[e].TransactionID;
            }

            OperationRecordDetail.ItemID = CreatePIGrid._options.dataSource[e].ItemID;
            OperationRecordDetail.ParentTransactionID = CreatePIGrid._options.dataSource[e].TransactionID;
            OperationRecordDetail.PurchaseTransactionID = CreatePIGrid._options.dataSource[e].PurchaseTransactionID;
            OperationRecordDetail.TransID = e + 1;
            OperationRecordDetail.ItemGroupID = CreatePIGrid._options.dataSource[e].ItemGroupID;
            OperationRecordDetail.ReceiptQuantity = Number(CreatePIGrid._options.dataSource[e].ReceiptQuantity).toFixed(3);
            OperationRecordDetail.PurchaseOrderQuantity = Number(CreatePIGrid._options.dataSource[e].PurchaseOrderQuantity).toFixed(2);
            OperationRecordDetail.PurchaseUnit = CreatePIGrid._options.dataSource[e].PurchaseUnit;
            OperationRecordDetail.StockUnit = CreatePIGrid._options.dataSource[e].StockUnit;
            OperationRecordDetail.ReceiptRate = Number(CreatePIGrid._options.dataSource[e].PurchaseRate).toFixed(2);
            OperationRecordDetail.ChallanQuantity = CreatePIGrid._options.dataSource[e].ChallanQuantity;
            OperationRecordDetail.GrossAmount = Number(CreatePIGrid._options.dataSource[e].BasicAmount).toFixed(2);
            OperationRecordDetail.DiscountPercentage = Number(CreatePIGrid._options.dataSource[e].Disc).toFixed(2);
            OperationRecordDetail.DiscountAmount = (Number(CreatePIGrid._options.dataSource[e].BasicAmount) - Number(CreatePIGrid._options.dataSource[e].AfterDisAmt)).toFixed(2);
            OperationRecordDetail.BasicAmount = Number(CreatePIGrid._options.dataSource[e].AfterDisAmt).toFixed(2);
            OperationRecordDetail.TaxableAmount = Number(CreatePIGrid._options.dataSource[e].TaxableAmount).toFixed(2);
            OperationRecordDetail.GSTPercentage = CreatePIGrid._options.dataSource[e].GSTTaxPercentage;
            OperationRecordDetail.CGSTPercentage = CreatePIGrid._options.dataSource[e].CGSTTaxPercentage;
            OperationRecordDetail.SGSTPercentage = CreatePIGrid._options.dataSource[e].SGSTTaxPercentage;
            OperationRecordDetail.IGSTPercentage = CreatePIGrid._options.dataSource[e].IGSTTaxPercentage;
            OperationRecordDetail.CGSTAmount = Number(CreatePIGrid._options.dataSource[e].CGSTAmt).toFixed(2);
            OperationRecordDetail.SGSTAmount = Number(CreatePIGrid._options.dataSource[e].SGSTAmt).toFixed(2);
            OperationRecordDetail.IGSTAmount = Number(CreatePIGrid._options.dataSource[e].IGSTAmt).toFixed(2);
            OperationRecordDetail.NetAmount = Number(CreatePIGrid._options.dataSource[e].TotalAmount).toFixed(2);
            OperationRecordDetail.ItemNarration = CreatePIGrid._options.dataSource[e].ItemNarration;
            //OperationRecordDetail.ExpectedDeliveryDate = CreatePIGrid._options.dataSource[e].ExpectedDeliveryDate;
            OperationRecordDetail.ReceiptWtPerPacking = CreatePIGrid._options.dataSource[e].ReceiptWtPerPacking;
            OperationRecordDetail.LandedRate = CreatePIGrid._options.dataSource[e].LandedPrice;
            OperationRecordDetail.LandedAmount = CreatePIGrid._options.dataSource[e].LandedAmt;


            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }
    }

    var jsonObjectsRecordTax = [];
    var OperationRecordTax = {};

    if (ChargesGridRow > 0) {
        for (var ch = 0; ch < ChargesGridRow; ch++) {

            OperationRecordTax = {};
            OperationRecordTax.TransID = ch + 1;
            OperationRecordTax.LedgerID = ChargesGridData._options.dataSource[ch].LedgerID;
            OperationRecordTax.TaxPercentage = ChargesGridData._options.dataSource[ch].TaxRatePer;
            OperationRecordTax.Amount = Number(ChargesGridData._options.dataSource[ch].ChargesAmount).toFixed(2);
            OperationRecordTax.TaxInAmount = ChargesGridData._options.dataSource[ch].InAmount;
            OperationRecordTax.IsComulative = ChargesGridData._options.dataSource[ch].IsCumulative;
            OperationRecordTax.GSTApplicable = ChargesGridData._options.dataSource[ch].GSTApplicable;
            OperationRecordTax.CalculatedON = ChargesGridData._options.dataSource[ch].CalculateON;

            jsonObjectsRecordTax.push(OperationRecordTax);
        }
    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);
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
                //alert(JSON.stringify(jsonObjectsRecordMain));
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseInvoice.asmx/UpdatePurchaseInvoice",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtPIID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + '}',
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
                        else if (res.includes("Error")) {
                            swal("Error..!", res, "error");
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
                    url: "WebService_PurchaseInvoice.asmx/SavePaperPurchaseInvoice",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',TransactionID_String:' + JSON.stringify(TransactionID_String) + '}',
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
                        else if (res.includes("Error")) {
                            swal("Error..!", res, "error");
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

$("#EditPIButton").click(function () {

    var TxtPIID = document.getElementById("TxtPIID").value;
    if (TxtPIID === "" || TxtPIID === null || TxtPIID === undefined) {
        alert("Please select any row from below grid !");
        return false;
    }

    document.getElementById("LblPINo").value = sholistData[0].VoucherNo;
    $("#VoucherDate").dxDateBox({ value: sholistData[0].VoucherDate });

    document.getElementById("TxtSupplierName").value = sholistData[0].SupplierName;
    document.getElementById("TxtSupplierID").value = sholistData[0].SupplierID;
    document.getElementById("textDeliveryNote").value = sholistData[0].DeliveryNoteNo;

    document.getElementById("TxtCGSTAmt").value = parseFloat(sholistData[0].TotalCGSTTaxAmount).toFixed(2);
    document.getElementById("TxtSGSTAmt").value = parseFloat(sholistData[0].TotalSGSTTaxAmount).toFixed(2);
    document.getElementById("TxtIGSTAmt").value = parseFloat(sholistData[0].TotalIGSTTaxAmount).toFixed(2);

    document.getElementById("TxtTotalQty").value = parseFloat(sholistData[0].TotalQuantity).toFixed(2);
    document.getElementById("TxtBasicAmt").value = parseFloat(sholistData[0].TotalBasicAmount).toFixed(2);
    document.getElementById("TxtTaxAmt").value = parseFloat(sholistData[0].TotalTaxAmount).toFixed(2);
    document.getElementById("TxtRoundOff").value = parseFloat(sholistData[0].RoundOffValue).toFixed(2);
    document.getElementById("TxtNetAmt").value = parseFloat(sholistData[0].NetAmount).toFixed(2);

    document.getElementById("PIBillNo").value = sholistData[0].InvoiceNo;
    $("#PIBillDate").dxDateBox({ value: sholistData[0].InvoiceDate });

    document.getElementById("TxtTcsRate").value = parseFloat(sholistData[0].TCSRate).toFixed(4);
    document.getElementById("TxtTcsAmount").value = parseFloat(sholistData[0].TCSAmount).toFixed(2);

    document.getElementById("textNaretion").value = sholistData[0].Narration;

    //////Supplere Get
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/Supplier",
        data: '{LedgerID:' + Number(document.getElementById("TxtSupplierID").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.substr(1);
            res = res.slice(0, -1);
            newSUPllierArray = JSON.parse(res);
            GblCompanyStateTin = "";
            GblGSTApplicable = true;
            GblCompanyStateTin = newSUPllierArray[0].CompanyStateTinNo;

            $.ajax({
                type: "POST",
                url: "WebService_PurchaseInvoice.asmx/GetItemRate",
                data: '{LedgerId:' + JSON.stringify(GblLedgerID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var I_RateRESS = JSON.parse(res);
                    ItemRateString = { 'ItemRateObj': I_RateRESS };

                    $.ajax({
                        type: "POST",
                        url: "WebService_PurchaseInvoice.asmx/PurchaseLedger",
                        data: '{}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            ////console.debug(results);
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            var PurchaseLed = JSON.parse(res);
                            $("#PurchaseLedger").dxSelectBox({
                                items: PurchaseLed,
                                placeholder: "Choose--",
                                displayExpr: 'LedgerName',
                                valueExpr: 'LedgerID',
                                searchEnabled: true,
                                showClearButton: true,
                            });

                        }
                    });
                }
            });

            if (newSUPllierArray.length > 0) {
                document.getElementById("LblState").innerHTML = "State : " + newSUPllierArray[0].SupState;
                document.getElementById("LblCountry").innerHTML = "Country : " + newSUPllierArray[0].Country;
                document.getElementById("CurrentCurrency").innerHTML = newSUPllierArray[0].CurrencyCode;
                document.getElementById("VatGSTApplicable").innerHTML = newSUPllierArray[0].GSTApplicable;
                document.getElementById("ConversionRate").innerHTML = 1;
                document.getElementById("LblSupplierStateTin").innerHTML = newSUPllierArray[0].StateTinNo;
                document.getElementById("TxtMailingName").value = newSUPllierArray[0].MailingName;

                if (newSUPllierArray[0].GSTApplicable === "True" || newSUPllierArray[0].GSTApplicable === "1") {
                    GblGSTApplicable = true;
                } else {
                    GblGSTApplicable = false;
                }
            }
            else {
                document.getElementById("LblState").innerHTML = "";
                document.getElementById("LblCountry").innerHTML = "";
                document.getElementById("CurrentCurrency").innerHTML = "";
                document.getElementById("VatGSTApplicable").innerHTML = "";
                document.getElementById("ConversionRate").innerHTML = "";
                document.getElementById("LblSupplierStateTin").innerHTML = "";
                document.getElementById("TxtMailingName").value = "";
            }

            $("#PurchaseLedger").dxSelectBox({ value: sholistData[0].PurchaseLedgerID });
        }
    });


    ChargesGrid = [];
    FillGridDataObj = [];

    $("#CreatePIGrid").dxDataGrid({
        dataSource: FillGridDataObj,
    });
    $("#AdditionalChargesGrid").dxDataGrid({
        dataSource: ChargesGrid,
    });

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseInvoice.asmx/RetrivePICreateGrid",
        data: '{transactionID:' + JSON.stringify(TxtPIID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var InvoiceRetrive = JSON.parse(res);

            $.ajax({
                type: "POST",
                url: "WebService_PurchaseInvoice.asmx/RetrivePICreateTaxChares",
                data: '{transactionID:' + JSON.stringify(TxtPIID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var InvoiceRetriveTaxCharges = JSON.parse(res);
                    document.getElementById("LOADER").style.display = "none";

                    FillGridDataObj = [];
                    FillGridDataObj = InvoiceRetrive;

                    $("#CreatePIGrid").dxDataGrid({
                        dataSource: FillGridDataObj,
                    });

                    ChargesGrid = [];
                    ChargesGrid = InvoiceRetriveTaxCharges;

                    fillChargesGrid();

                    GridColumnCal();
                }
            });

        }
    });

    document.getElementById("BtnDeletePopUp").disabled = false;

    GblStatus = "Update";

    document.getElementById("EditPIButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditPIButton").setAttribute("data-target", "#largeModal");
});

$("#DeletePIButton").click(function () {
    var TxtPIID = document.getElementById("TxtPIID").value;
    if (TxtPIID === "" || TxtPIID === null || TxtPIID === undefined) {
        alert("Please select any row to delete..!");
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
                url: "WebService_PurchaseInvoice.asmx/DeletePaperPurchaseInvoice",
                data: '{TxtPIID:' + JSON.stringify(TxtPIID) + '}',
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

$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeletePIButton").click();
});

$("#TxtTcsRate").keyup(function (e) {
    $("#TxtTcsRate").keypress();
});
$("#TxtTcsRate").keypress(function (e) {
    var Amt = Number(document.getElementById("TxtTcsRate").value) * Number(document.getElementById("TxtNetAmt").value) / 100;
    document.getElementById("TxtTcsAmount").value = Amt.toFixed(2);
});