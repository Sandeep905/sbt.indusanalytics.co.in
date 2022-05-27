

var prefix = "OSPI";
var SupplierData = [];
var newSUPllierArray = [];
var CPItemID = "";
var sholistData = [];
var GetRow = "";

var GblStatus = "", GRNNO = "", DelNoteNo = "", GetTransactionID = "", GblLedgerID = "", GblLedgerName = "";
var FillGridDataObj = [];
var MasterGridData = [];
var ObjItemRate = [];
var ItemRateString = "";
var GblCompanyStateTin = "";
var GblGSTApplicable = true;

//Additional Charges
var ChargesGrid = [];
var updateTotalTax = 0;

var ObjVendorChargesType = [];

//initialize Charges Grid
var CalculateOnLookup = [{ "ID": 1, "Name": "Value" }, { "ID": 2, "Name": "Quantity" }];

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
        { dataField: "LedgerName", visible: true, caption: "Tax Ledger", width: 200 },
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

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#PIBillDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelDeliveryNoteDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

var RadioValue = "Pending";
GetDataGrid();

var priorities = ["Pending", "Processed"];
$("#RadioButtonPI").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = e.value;
        GblStatus = "";
        GetDataGrid();
    }
});

var ProductHSNGridRES1 = [], SelectedProductHSNList = [], GetPOGridRow = "";
$("#ProductHSNGrid").dxDataGrid({
    dataSource: ProductHSNGridRES1,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    //allowColumnResizing: true,
    paging: {
        pageSize: 15
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 25, 50, 100]
    },
    selection: { mode: "single" },
    grouping: {
        autoExpandAll: true
    },
    filterRow: { visible: true, applyFilter: "auto" },
    //columnChooser: { enabled: true },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Department Master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (Sel) {
        var data = Sel.selectedRowsData;
        SelectedProductHSNList = [];
        SelectedProductHSNList = Sel.selectedRowsData;
    },
    columns: [
        { dataField: "ProductHSNID", visible: false, caption: "ProductHSNID" },
        { dataField: "HSNCode", visible: true, caption: "HSNCode", width: 80 },
        { dataField: "ProductHSNName", visible: true, caption: "ProductHSNName", width: 280 },
        { dataField: "GSTTaxPercentage", visible: true, caption: "GSTTaxPercentage", width: 80 },
        { dataField: "CGSTTaxPercentage", visible: true, caption: "CGSTTaxPercentage", width: 80 },
        { dataField: "SGSTTaxPercentage", visible: true, caption: "SGSTTaxPercentage", width: 80 },
        { dataField: "IGSTTaxPercentage", visible: true, caption: "IGSTTaxPercentage", width: 80 }
    ]
});

//get vendor charges type
$.ajax({
    type: "POST",
    url: "WebService_VendorWiseRateSetting.asmx/VendorChargesType",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"u0026"/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjVendorChargesType = JSON.parse(res);
        refreshGridData(ObjVendorChargesType);
    }
});

CreatePONO();
function CreatePONO() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/GetPINO",
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

        document.getElementById("DivCretbtn").style.display = "block";
        document.getElementById("DivEdit").style.display = "none";

        document.getElementById("LOADER").style.display = "block";

        document.getElementById("PIGridPending").style.display = "block";
        document.getElementById("PIGridProcess").style.display = "none";

        document.getElementById("TxtPIID").value = "";

        $.ajax({
            type: "POST",
            url: "WebService_OutsourceProductionPurchaseInvoice.asmx/FillGrid",
            data: '{RadioValue:' + JSON.stringify(RadioValue) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/:}/g, ":null}");
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

        document.getElementById("DivCretbtn").style.display = "none";
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
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/Showlist",
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
                    pageSize: 15
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [15, 25, 50, 100]
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
                { dataField: "MaxVoucherNo", visible: false, width: 120 },
                { dataField: "VoucherNo", visible: true, width: 100 },
                { dataField: "VoucherDate", visible: true, width: 120 },
                { dataField: "SupplierName", visible: true, width: 120 },
                { dataField: "PONo", visible: true, width: 100 },
                { dataField: "GRNNo", visible: true, width: 120 },
                { dataField: "GRNDate", visible: true, width: 120 },
                { dataField: "InvoiceNo", visible: true, width: 120 },
                { dataField: "InvoiceDate", visible: true, width: 100 },
                { dataField: "DeliveryNoteNo", visible: true, width: 100 },
                { dataField: "DeliveryNoteDate", visible: true, width: 120 },
                { dataField: "FYear", visible: true, width: 100 }
                ]
            });
        }
    });
}

$.ajax({
    type: "POST",
    url: "WebService_OutsourceProductionPurchaseInvoice.asmx/GetAllHSN",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"u0026"/g, '&');
        res = res.replace(/"u0027"/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        ProductHSNGridRES1 = JSON.parse(res);

        $("#ProductHSNGrid").dxDataGrid({
            dataSource: ProductHSNGridRES1
        });
    }
});

function refreshGridData(ObjVendorChargesType) {
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
            if (e.column.dataField !== "PurchaseRate" && e.column.dataField !== "ExpectedDeliveryDate" && e.column.dataField !== "PurchaseTolerance" && e.column.dataField !== "Disc" && e.column.dataField !== "ChargeQty" && e.column.dataField !== "RateType" && e.column.dataField !== "IsFlatRate") {
                e.cancel = true;
            } else {
                e.cancel = false;
            }
        },
        onRowUpdated: function (editcell) {
            AddItemCalculation();
            if (ChargesGrid.length > 0) {
                AddItemWithChargessGrid();
            }
        },
        onCellPrepared: function (e) {
            GridColumnCal();
            if (e.rowType !== "data" && e.columnIndex !== 0) return;
            if (e.column.dataField === "ProductHSNName") {
                e.cellElement.addClass('btn');
            }
        },
        onCellClick: function (AddClick) {
            if (AddClick.rowType === undefined || AddClick.rowType === "filter" || AddClick.rowType !== "data") return false;

            if (AddClick.column.dataField === "HSNCode" || AddClick.column.dataField === "ProductHSNName") {//40
                GetRow = AddClick.rowIndex;
                gridProductHSNList = [];
                GetPOGridRow = AddClick.rowIndex;

                $("#BtnOpenProductHSNPopUp").click();
            }
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
            { dataField: "ProductHSNID", visible: false, caption: "ProductHSNID", width: 120 },
            { dataField: "PurchaseTransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "OutsourceSendNo", visible: true, caption: "OS Send No", width: 120 },
            { dataField: "OutsourceReceiptNo", visible: true, caption: "OS GRN No", width: 120 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
            { dataField: "LedgerName", visible: true, caption: "Vendor", width: 120 },
            { dataField: "ProcessName", visible: true, caption: "Process", width: 120 },
            { dataField: "JobCardFormNo", visible: true, caption: "JC Form No", width: 120 },
            { dataField: "PlanContName", visible: true, caption: "Content Name", width: 120 },
            { dataField: "ProductHSNName", visible: true, caption: "HSN Group", width: 120 },
            { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 120 },
            { dataField: "PurchaseOrderQuantity", visible: true, caption: "Send Qty", width: 80 },
            { dataField: "ChallanQuantity", visible: true, caption: "Receipt Qty", width: 80 },
            {
                dataField: "ChargeQty", visible: true, caption: "Charge Qty", width: 80,
                validationRules: [{ type: "required" }, { type: "numeric" }]
            },
            {
                dataField: "RateType", visible: true, caption: "Charge Type", width: 80,
                lookup: {
                    dataSource: ObjVendorChargesType,
                    valueExpr: "RateType",
                    displayExpr: "RateType"
                },
                validationRules: [{ type: "required" }]
            },
            { dataField: "IsFlatRate", visible: true, caption: "Is Flat Rate", width: 80, dataType: "boolean" },
            {
                dataField: "PurchaseRate", visible: true, caption: "Rate", width: 60,
                validationRules: [{ type: "required" }, { type: "numeric" }]
            },
            {
                dataField: "ExpectedDeliveryDate", visible: true, caption: "Expec.Del.Date", width: 100,
                dataType: "date", format: "dd-MMM-yyyy",
                showEditorAlways: true
            },
            {
                dataField: "PurchaseTolerance", visible: false, caption: "Tole. %", width: 60,
                validationRules: [{ type: "required" }, { type: "numeric" }]
            },
            { dataField: "MinimumCharges", visible: true, caption: "Min.Charges", width: 80 },
            { dataField: "BasicAmount", visible: true, caption: "Basic Amt", width: 100 },
            {
                dataField: "Disc", visible: true, caption: "Disc. %", width: 60,
                validationRules: [{ type: "required" }, { type: "numeric" }]
            },
            { dataField: "AfterDisAmt", visible: false, caption: "After Dis. Amt.", width: 80 },
            { dataField: "TaxableAmount", visible: false, caption: "Taxable Amt.", width: 100 },
            { dataField: "GSTTaxPercentage", visible: true, caption: "GST %", width: 50 },
            { dataField: "CGSTTaxPercentage", visible: true, caption: "CGST %", width: 50 },
            { dataField: "SGSTTaxPercentage", visible: true, caption: "SGST %", width: 50 },
            { dataField: "IGSTTaxPercentage", visible: true, caption: "IGST %", width: 50 },
            { dataField: "CGSTAmt", visible: true, caption: "CGST Amt.", width: 80 },
            { dataField: "SGSTAmt", visible: true, caption: "SGST Amt.", width: 80 },
            { dataField: "IGSTAmt", visible: true, caption: "IGST Amt.", width: 80 },
            { dataField: "TotalAmount", visible: true, caption: "Total Amt.", width: 80 },
            { dataField: "ReceiptQuantityComp", visible: false, caption: "ReceiptQuantityComp", width: 120 }, //For Compair of Purchase qty
            { dataField: "CreatedBy", visible: false, caption: "Created By", width: 120 },
            { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
            { dataField: "FYear", visible: true, caption: "FYear", width: 120 },
            { dataField: "LandedAmt", visible: false, caption: "Landed Amt.", width: 120 },
            { dataField: "LandedPrice", visible: true, caption: "Landed Price", width: 120 }
        ],
    });
}

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
                if (GblLedgerID === "") {
                    //GRNNO = clickedIndentCell.currentSelectedRowKeys[0].ReceiptVoucherNo;
                    DelNoteNo = clickedIndentCell.currentSelectedRowKeys[0].DeliveryNoteNo;
                    GetTransactionID = clickedIndentCell.currentSelectedRowKeys[0].TransactionID;
                    GblLedgerID = clickedIndentCell.currentSelectedRowKeys[0].LedgerID;
                    GblLedgerName = clickedIndentCell.currentSelectedRowKeys[0].LedgerName;
                }
                else if (GblLedgerID !== clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                    clickedIndentCell.component.deselectRows((clickedIndentCell || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please select records which have same GRN No..!", "warning", 3000);
                    clickedIndentCell.currentSelectedRowKeys = [];
                    return false;
                }
                else if (GblLedgerID === clickedIndentCell.currentSelectedRowKeys[0].LedgerID) {
                    GetTransactionID = GetTransactionID + "," + clickedIndentCell.currentSelectedRowKeys[0].TransactionID;
                }
            }
            var GetPendingData = clickedIndentCell.selectedRowsData;
            if (GetPendingData.length === 0) {
                //GRNNO = "";
                DelNoteNo = "";
                GetTransactionID = "";
                GblLedgerID = "";
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
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
            { dataField: "PurchaseTransactionID", visible: false, caption: "PurchaseTransactionID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobCardContentNo", visible: false, caption: "Content No", width: 100 },
            { dataField: "VehicleNo", visible: false, caption: "Vehicle No", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "Vendor", width: 120 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 250 },
            { dataField: "JobBookingNo", visible: true, caption: "JC No", width: 100 },
            { dataField: "JobBookingDate", visible: true, caption: "Job Date", width: 100 },
            { dataField: "OrderQuantity", visible: true, caption: "Order Qty", width: 100 },
            { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 120 },
            { dataField: "VoucherDate", visible: true, caption: "Voucher Date", width: 140 },
            { dataField: "LedgerName", visible: false, caption: "Ledger Name", width: 120 },
            { dataField: "UserName", visible: false, caption: "Created By", width: 120 },
            { dataField: "PlanContName", visible: false, caption: "Content Name", width: 100 }, //For Compair of Purchase qty
            { dataField: "Transporter", visible: true, caption: "Transporter", width: 100 },
            { dataField: "Remark", visible: true, caption: "Remark", width: 80 }
        ]
    });
}

//Supplere Get
$.ajax({
    type: "POST",
    url: "WebService_OutsourceProductionPurchaseInvoice.asmx/Supplier",
    data: '{}',
    async: false,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"u0026"/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var Supplier = JSON.parse(res);
        GblGSTApplicable = true;
        GblCompanyStateTin = Supplier[0].CompanyStateTinNo;
        SupplierData = { 'AllSup': Supplier };
    }
});

$("#CreatePIButton").click(function () {
    ChargesGrid = [];
    FillGridDataObj = [];
    $("#CreatePIGrid").dxDataGrid({
        dataSource: FillGridDataObj
    });
    $("#AdditionalChargesGrid").dxDataGrid({
        dataSource: ChargesGrid
    });

    if (GetTransactionID === "") {
        DevExpress.ui.notify("Please Choose any row from given below grid..!", "warning", 3000);
        return false;
    }

    document.getElementById("TxtSupplierID").value = GblLedgerID;
    document.getElementById("TxtSupplierName").value = GblLedgerName;
    document.getElementById("textDeliveryNote").value = DelNoteNo;


    $.ajax({
        type: "POST",
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/GetItemRate",
        data: '{LedgerId:' + JSON.stringify(GblLedgerID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var I_RateRESS = JSON.parse(res);
            ItemRateString = { 'ItemRateObj': I_RateRESS };

            $.ajax({
                type: "POST",
                url: "WebService_OutsourceProductionPurchaseInvoice.asmx/PurchaseLedger",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"u0026"/g, '&');
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

    newSUPllierArray = SupplierData.AllSup.filter(function (el) {
        return el.LedgerID === Number(document.getElementById("TxtSupplierID").value);
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

    //Calculation Start

    $.ajax({
        type: "POST",
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/FillCreatePIGrid",
        data: '{GetTransactionID:' + JSON.stringify(GetTransactionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
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
                    FinalQty = Number(newArray[d].ChargeQty);

                    var Qty = "";

                    if (FinalQty === "" || FinalQty === undefined || FinalQty === null || FinalQty === "NULL") {
                        Qty = 0;
                    }
                    else {
                        Qty = parseFloat(Number(FinalQty)).toFixed(2);
                    }

                    var PurchaseRate = "";
                    if (newArray[0].PurchaseRate === "" || newArray[0].PurchaseRate === undefined || newArray[0].PurchaseRate === null || newArray[0].PurchaseRate === "NULL") {
                        PurchaseRate = 0;
                    }
                    else {
                        PurchaseRate = newArray[0].PurchaseRate;
                    }

                    var ddlSupplierId = Number(document.getElementById("TxtSupplierID").value);

                    if (ddlSupplierId === 0 || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                        PurchaseRate = PurchaseRate;
                    }
                    else {
                        ObjItemRate = [];

                        ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                            return el.LedgerID === ddlSupplierId;
                            // &&  el.ItemName === newArray[0].ItemName;
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

                    var DiscountAmt = Number(Number(BasicAmt) * Number(DisPercentage)) / 100;

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
                        SGSTAMT = Number(Number(TaxAbleAmt) * Number(SGSTPER)) / 100;
                        CGSTAMT = Number(Number(TaxAbleAmt) * Number(CGSTPER)) / 100;
                        TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt);

                    }
                    else {
                        if (newArray[0].IGSTTaxPercentage === "" || newArray[0].IGSTTaxPercentage === undefined || newArray[0].IGSTTaxPercentage === null || newArray[0].IGSTTaxPercentage === "NULL") {
                            IGSTPER = 0;
                        }
                        else {
                            IGSTPER = newArray[0].IGSTTaxPercentage;
                        }

                        IGSTAMT = Number(Number(TaxAbleAmt) * Number(IGSTPER)) / 100;
                        TotalAmount = Number(IGSTAMT) + Number(TaxAbleAmt);
                    }

                    MasterGridOpt = {};

                    MasterGridOpt.ReceiptQuantityComp = Qty;
                    //MasterGridOpt.ReceiptQuantity = Qty;

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
                    MasterGridOpt.JobBookingJobCardContentsID = newArray[d].JobBookingJobCardContentsID;
                    MasterGridOpt.LedgerID = newArray[d].LedgerID;
                    MasterGridOpt.OutsourceSendNo = newArray[d].OutsourceSendNo;
                    MasterGridOpt.OutsourceReceiptNo = newArray[d].OutsourceReceiptNo;
                    MasterGridOpt.ItemName = newArray[d].ItemName;

                    MasterGridOpt.ProcessName = newArray[d].ProcessName;
                    MasterGridOpt.LedgerName = newArray[d].LedgerName;
                    MasterGridOpt.JobCardFormNo = newArray[d].JobCardFormNo;
                    MasterGridOpt.PlanContName = newArray[d].PlanContName;
                    MasterGridOpt.PurchaseOrderQuantity = newArray[d].PurchaseOrderQuantity;
                    MasterGridOpt.ChallanQuantity = newArray[d].ChallanQuantity;
                    MasterGridOpt.ChargeQty = newArray[d].ChargeQty;
                    MasterGridOpt.RateType = newArray[d].RateType;
                    MasterGridOpt.PurchaseRate = newArray[d].PurchaseRate;
                    MasterGridOpt.IsFlatRate = newArray[d].IsFlatRate;
                    MasterGridOpt.MinimumCharges = newArray[d].MinimumCharges;
                    MasterGridOpt.ExpectedDeliveryDate = newArray[d].ExpectedDeliveryDate;
                    MasterGridOpt.PurchaseTolerance = newArray[d].PurchaseTolerance;//RequiredQuantity 
                    MasterGridOpt.Narration = newArray[d].Narration;
                    MasterGridOpt.FYear = newArray[d].FYear;
                    MasterGridOpt.ProductHSNName = newArray[d].ProductHSNName;
                    MasterGridOpt.HSNCode = newArray[d].HSNCode;
                    MasterGridOpt.ProductHSNID = newArray[d].ProductHSNID;

                    MasterGridData.push(MasterGridOpt);
                }
            }

            FillGridDataObj = [];
            FillGridDataObj = MasterGridData;
            $("#CreatePIGrid").dxDataGrid({
                dataSource: FillGridDataObj
            });
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
        var g = 0;

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
                        for (g = 0; g < FillGridDataObj.length; g++) {
                            if (TaxRatePer === FillGridDataObj[g].CGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[g].CGSTAmt);
                            }
                        }
                    }
                    // taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "STATE TAX") {

                    if (FillGridDataObj.length > 0) {
                        for (g = 0; g < FillGridDataObj.length; g++) {
                            if (TaxRatePer === FillGridDataObj[g].SGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[g].SGSTAmt);
                            }
                        }
                    }
                    //taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                    if (FillGridDataObj.length > 0) {
                        for (g = 0; g < FillGridDataObj.length; g++) {
                            if (TaxRatePer === FillGridDataObj[g].IGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(FillGridDataObj[g].IGSTAmt);
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
                        for (g = 0; g < FillGridDataObj.length; g++) {
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
                        for (g = 0; g < FillGridDataObj.length; g++) {
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
                        for (g = 0; g < FillGridDataObj.length; g++) {
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
                        for (g = 0; g < FillGridDataObj.length; g++) {
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
            //var Qty = FillGridDataObj[CreatePIGridRow].ReceiptQuantity;
            var Qty = FillGridDataObj[CreatePIGridRow].ChargeQty;
            var DisPercentage = FillGridDataObj[CreatePIGridRow].Disc;

            var ddlSupplierId = Number(document.getElementById("TxtSupplierID").value);
            if (ddlSupplierId === 0 || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                PurchaseRate = PurchaseRate;
            }
            else {

                ObjItemRate = [];
                ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                    return el.LedgerID === ddlSupplierId &&
                        el.ItemID === FillGridDataObj[CreatePIGridRow].ItemID;
                });
                if (FillGridDataObj === [] || FillGridDataObj === "" || FillGridDataObj.length === 0) {
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

            var CalculationFormula = "Number(Number(PurchaseRate) * Number(Qty)).toFixed(2)";
            var result = $.grep(ObjVendorChargesType, function (e) { return e.RateType === FillGridDataObj[CreatePIGridRow].RateType; });
            if (result.length > 0) {
                CalculationFormula = result[0].CalculationFormula;
            }

            if (FillGridDataObj[CreatePIGridRow].IsFlatRate === 0 || FillGridDataObj[CreatePIGridRow].IsFlatRate === false) {
                BasicAmt = eval(CalculationFormula); // parseFloat(Number(Qty) * Number(PurchaseRate)).toFixed(2);
                if (FillGridDataObj[CreatePIGridRow].MinimumCharges > 0 && FillGridDataObj[CreatePIGridRow].MinimumCharges > BasicAmt) {
                    BasicAmt = FillGridDataObj[CreatePIGridRow].MinimumCharges;
                }
            } else {
                BasicAmt = Number(PurchaseRate).toFixed(2);
            }

            var DiscountAmt = parseFloat((Number(BasicAmt) * Number(DisPercentage)) / 100).toFixed(2);

            var afterDiscountAmt = 0;
            afterDiscountAmt = parseFloat(Number(BasicAmt) - Number(DiscountAmt)).toFixed(2);

            TaxAbleAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);

            var LandedPrice = 0.00;
            var LandedAmt = 0;

            LandedAmt = parseFloat(Number(afterDiscountAmt)).toFixed(2);
            // LandedPrice = parseFloat(Number(LandedAmt) / (Number(FillGridDataObj[CreatePIGridRow].ReceiptQuantity))).toFixed(2);
            LandedPrice = parseFloat(Number(LandedAmt) / Number(FillGridDataObj[CreatePIGridRow].ChargeQty)).toFixed(2);

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
                IGSTAMT = parseFloat(Number(Number(TaxAbleAmt) * Number(IGSTPER)) / 100).toFixed(2);
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
        //gridColTotalQty = parseFloat(Number(gridColTotalQty) + Number(dataGrid._options.dataSource[cal].ReceiptQuantity)).toFixed(2);
        gridColTotalQty = parseFloat(Number(gridColTotalQty) + Number(dataGrid._options.dataSource[cal].ChargeQty)).toFixed(2);

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
    document.getElementById("TxtRoundOff").value = parseFloat(Number(document.getElementById("TxtNetAmt").value) - Number(gridColTotalAmt)).toFixed(2);
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
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/CHLname",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
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
        window.setTimeout(function () { e.component.cancelEditData(); }, 0);
    } else {
        var optCH = {};
        if (ChooseText !== "" && ChooseText !== undefined && ChooseText !== null) {
            ObjChargeHead = Var_ChargeHead.LedgerDetail.filter(function (el) {
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
            ChargesGrid.push(optCH);

            $("#AdditionalChargesGrid").dxDataGrid({ dataSource: ChargesGrid });

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


    var TxtSupplierID = Number(document.getElementById("TxtSupplierID").value);
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
    var SelDeliveryNoteDate = $('#SelDeliveryNoteDate').dxDateBox('instance').option('value');

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

    OperationRecordMain.VoucherID = -105;
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
    OperationRecordMain.DeliveryNoteDate = SelDeliveryNoteDate;
    OperationRecordMain.InvoiceNo = PIBillNo;
    OperationRecordMain.InvoiceDate = PIBillDate;
    OperationRecordMain.RoundOffValue = TxtTotalQty;
    OperationRecordMain.TotalDiscountAmount = Number(TxtBasicAmt) - Number(TxtAfterDisAmt);

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

            var Disc = CreatePIGrid._options.dataSource[e].Disc;
            if (Disc === "" || Disc === null || Disc === undefined) {
                Disc = 0;
            } else {
                Disc = Number(Disc);
            }

            OperationRecordDetail.JobName = CreatePIGrid._options.dataSource[e].ItemName;
            OperationRecordDetail.ParentTransactionID = CreatePIGrid._options.dataSource[e].TransactionID;
            OperationRecordDetail.PurchaseTransactionID = CreatePIGrid._options.dataSource[e].PurchaseTransactionID;
            OperationRecordDetail.JobBookingJobCardContentsID = CreatePIGrid._options.dataSource[e].JobBookingJobCardContentsID;
            OperationRecordDetail.LedgerID = CreatePIGrid._options.dataSource[e].LedgerID;
            OperationRecordDetail.LedgerName = CreatePIGrid._options.dataSource[e].LedgerName;
            OperationRecordDetail.OutsourceSendNo = CreatePIGrid._options.dataSource[e].OutsourceSendNo;
            OperationRecordDetail.OutsourceReceiptNo = CreatePIGrid._options.dataSource[e].OutsourceReceiptNo;
            OperationRecordDetail.JobCardFormNo = CreatePIGrid._options.dataSource[e].JobCardFormNo;
            OperationRecordDetail.PlanContName = CreatePIGrid._options.dataSource[e].PlanContName;
            OperationRecordDetail.TransID = e + 1;
            OperationRecordDetail.PurchaseOrderQuantity = Number(CreatePIGrid._options.dataSource[e].PurchaseOrderQuantity).toFixed(2);
            OperationRecordDetail.ReceiptRate = Number(CreatePIGrid._options.dataSource[e].PurchaseRate).toFixed(2);
            OperationRecordDetail.ChallanQuantity = CreatePIGrid._options.dataSource[e].ChallanQuantity;
            OperationRecordDetail.GrossAmount = Number(CreatePIGrid._options.dataSource[e].BasicAmount).toFixed(2);
            OperationRecordDetail.DiscountPercentage = Number(Disc).toFixed(2);
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
            //alert(CreatePIGrid._options.dataSource[e].LandedPrice);
            if (CreatePIGrid._options.dataSource[e].LandedPrice === "" || CreatePIGrid._options.dataSource[e].LandedPrice === "NaN" || CreatePIGrid._options.dataSource[e].LandedPrice === undefined || CreatePIGrid._options.dataSource[e].LandedPrice === Infinity || CreatePIGrid._options.dataSource[e].LandedPrice === "Infinity") {
                OperationRecordDetail.LandedRate = 0;
            } else {
                OperationRecordDetail.LandedRate = CreatePIGrid._options.dataSource[e].LandedPrice;
            }
            OperationRecordDetail.LandedAmount = CreatePIGrid._options.dataSource[e].LandedAmt;
            OperationRecordDetail.ChargeQty = CreatePIGrid._options.dataSource[e].ChargeQty;
            OperationRecordDetail.RateType = CreatePIGrid._options.dataSource[e].RateType;
            OperationRecordDetail.IsFlatRate = CreatePIGrid._options.dataSource[e].IsFlatRate;
            OperationRecordDetail.MinimumCharges = CreatePIGrid._options.dataSource[e].MinimumCharges;
            OperationRecordDetail.ExpectedDeliveryDate = CreatePIGrid._options.dataSource[e].ExpectedDeliveryDate;
            OperationRecordDetail.PurchaseTolerance = CreatePIGrid._options.dataSource[e].PurchaseTolerance;
            OperationRecordDetail.ProductHSNID = CreatePIGrid._options.dataSource[e].ProductHSNID;


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
    //alert(jsonObjectsRecordMain);

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
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_OutsourceProductionPurchaseInvoice.asmx/UpdatePurchaseInvoice",
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
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Group Name already Exist..\n Please enter another Group Name..", "");
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
                    url: "WebService_OutsourceProductionPurchaseInvoice.asmx/SavePaperPurchaseInvoice",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',TransactionID_String:' + JSON.stringify(TransactionID_String) + '}',
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
    if (sholistData[0].DeliveryNoteDate === "" || sholistData[0].DeliveryNoteDate === null) sholistData[0].DeliveryNoteDate = new Date();
    $("#SelDeliveryNoteDate").dxDateBox({ value: sholistData[0].DeliveryNoteDate });

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

    document.getElementById("textNaretion").value = sholistData[0].Narration;

    $.ajax({
        type: "POST",
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/GetItemRate",
        data: '{LedgerId:' + JSON.stringify(GblLedgerID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var I_RateRESS = JSON.parse(res);
            ItemRateString = { 'ItemRateObj': I_RateRESS };

            $.ajax({
                type: "POST",
                url: "WebService_OutsourceProductionPurchaseInvoice.asmx/PurchaseLedger",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"u0026"/g, '&');
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

    newSUPllierArray = SupplierData.AllSup.filter(function (el) {
        return el.LedgerID === Number(document.getElementById("TxtSupplierID").value);
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

    ChargesGrid = [];
    FillGridDataObj = [];

    $("#CreatePIGrid").dxDataGrid({ dataSource: FillGridDataObj });
    $("#AdditionalChargesGrid").dxDataGrid({ dataSource: ChargesGrid });

    $.ajax({
        type: "POST",
        url: "WebService_OutsourceProductionPurchaseInvoice.asmx/RetrivePICreateGrid",
        data: '{transactionID:' + JSON.stringify(TxtPIID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"u0026"/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var InvoiceRetrive = JSON.parse(res);

            $.ajax({
                type: "POST",
                url: "WebService_OutsourceProductionPurchaseInvoice.asmx/RetrivePICreateTaxChares",
                data: '{transactionID:' + JSON.stringify(TxtPIID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    ////console.debug(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"u0026"/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var InvoiceRetriveTaxCharges = JSON.parse(res);
                    document.getElementById("LOADER").style.display = "none";

                    FillGridDataObj = [];
                    FillGridDataObj = InvoiceRetrive;

                    $("#CreatePIGrid").dxDataGrid({ dataSource: FillGridDataObj });

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
        text: 'You will not be able to recover this ' + sholistData[0].VoucherNo + ' voucher no.!',
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
                url: "WebService_OutsourceProductionPurchaseInvoice.asmx/DeletePaperPurchaseInvoice",
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

$("#BtnProductHSN").click(function () {
    if (SelectedProductHSNList.length > 0) {
        var CreatePOGriddataGrid = $('#CreatePIGrid').dxDataGrid('instance');
        var ProductHSNID = 0, ProductHSNName = "", HSNCode = "", HSNGSTTaxPercentage = 0, HSNCGSTTaxPercentage = 0, HSNSGSTTaxPercentage = 0, HSNSIGSTTaxPercentage = 0;

        ProductHSNID = SelectedProductHSNList[0].ProductHSNID;
        ProductHSNName = SelectedProductHSNList[0].ProductHSNName;
        HSNCode = SelectedProductHSNList[0].HSNCode;
        HSNGSTTaxPercentage = SelectedProductHSNList[0].GSTTaxPercentage;
        HSNCGSTTaxPercentage = SelectedProductHSNList[0].CGSTTaxPercentage;
        HSNSGSTTaxPercentage = SelectedProductHSNList[0].SGSTTaxPercentage;
        HSNSIGSTTaxPercentage = SelectedProductHSNList[0].IGSTTaxPercentage;

        CreatePOGriddataGrid.cellValue(GetPOGridRow, "ProductHSNID", ProductHSNID);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "ProductHSNName", ProductHSNName);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "HSNCode", HSNCode);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "GSTTaxPercentage", HSNGSTTaxPercentage);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "CGSTTaxPercentage", HSNCGSTTaxPercentage);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "SGSTTaxPercentage", HSNSGSTTaxPercentage);
        CreatePOGriddataGrid.cellValue(GetPOGridRow, "IGSTTaxPercentage", HSNSIGSTTaxPercentage);

        CreatePOGriddataGrid.saveEditData();

        AddItemCalculation();
        GridColumnCal();

    }
});

$("#BtnOpenProductHSNPopUp").click(function () {
    document.getElementById("BtnOpenProductHSNPopUp").setAttribute("data-toggle", "modal");
    document.getElementById("BtnOpenProductHSNPopUp").setAttribute("data-target", "#largeModalHSNGroup");
});