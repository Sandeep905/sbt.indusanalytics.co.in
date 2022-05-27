"use strict";

var prefix = "PO", GblStatus = "";
var SupplierData = [], newSUPllierArray = [], SupplierDDL = [];
var VarItemApproved = "", Groupdata = "", GetPendingData = "";
var ObjItemRate = [], ItemRateString = "";

var existReq = []; var MasterGridData = []; //PendingMasterGridData
var SubGridData = [];   //PendingSubGridData

//For Grid Calculation
var GetRow = "", GblCompanyStateTin = "";
var GblGSTApplicable = true;

//Schdule Grid
var ScheduleListOBJ = []; var DistinctArray = []; var RemID = "";

//OtherHeads
var OtherHead = [];

//Additional Charges
var ChargesGrid = []; var updateTotalTax = 0; var TotalGstAmt = 0, FrmUpdateTotalGstAmt = 0;

//Terms Of Payment
var PaymentTermsGrid = []; var optTerms = {}; var PaymentTermsString = "Payment in 30 Days,Payment in 60 Days,Payment in 90 Days";
var GblJobCardRES = []; //added by pKp for job card selection in create PO grid
var FlagEditPurchaseRate = false; //Admin only can change the rate

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

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_PurchaseOrder.asmx/CheckIsAdmin",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d === "True") {
            FlagEditPurchaseRate = true;
        } else
            FlagEditPurchaseRate = false;
    }
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_PurchaseRequisition.asmx/GetJobCardList",
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
        GblJobCardRES = JSON.parse(res);
    }
});

$("#BtnOpenProductHSNPopUp").click(function () {
    document.getElementById("BtnOpenProductHSNPopUp").setAttribute("data-toggle", "modal");
    document.getElementById("BtnOpenProductHSNPopUp").setAttribute("data-target", "#largeModalHSNGroup");
});

//// init datagrid
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
    height: function () {
        return window.innerHeight / 1.3;
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
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Department Master",
        allowExportSelectedData: true,
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

$("#CreatePOGrid").dxDataGrid({
    keyExpr: "ItemID",
    showBorders: true,
    paging: {
        enabled: false
    },
    height: function () {
        return window.innerHeight / 3.2;
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
    editing: {
        mode: "cell",
        allowDeleting: true,
        //allowAdding: true,
        allowUpdating: true
    },
    //onRowUpdated: function (e) {
    //    var grid = $('#CreatePOGrid').dxDataGrid('instance');
    //    grid.refresh();
    //},
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onRowRemoved: function (e) {
        if (ScheduleListOBJ !== "" && ScheduleListOBJ !== [] && ScheduleListOBJ !== undefined && ScheduleListOBJ !== null) {
            ScheduleListOBJ = ScheduleListOBJ.filter(function (obj) {
                return obj.ItemID !== e.data.ItemID;
            });
        }
        //existReq = existReq.filter(function (obj) {
        //    return obj.ItemID !== e.data.ItemID;
        //});
        if (ChargesGrid.length > 0) {
            AddItemCalculation();
            GridColumnCal();
            //AddItemWithChargessGrid();
            CalculateAmount();
        } else {
            AddItemCalculation();
        }
        SubGridData = SubGridData.filter(function (objReq) {
            return objReq.ItemID !== e.data.ItemID;
        });
    },
    //onEditingStart: function (e) {
    //    if (e.column.visibleIndex < 14 || e.column.visibleIndex === 15 || e.column.visibleIndex === 17 || e.column.visibleIndex === 18 || e.column.visibleIndex === 19 || e.column.visibleIndex === 23 || e.column.visibleIndex === 25 || e.column.visibleIndex === 26 || e.column.visibleIndex === 27 || e.column.visibleIndex === 28 || e.column.visibleIndex === 29 || e.column.visibleIndex === 30 || e.column.visibleIndex === 31 || e.column.visibleIndex === 32 || e.column.visibleIndex === 33 || e.column.visibleIndex === 34 || e.column.visibleIndex === 39 || e.column.visibleIndex === 40 || e.column.visibleIndex === 47) {
    //        e.cancel = true;
    //    }
    //},
    onCellClick: function (AddClick) {
        if (AddClick.rowType !== "data") return false;

        if (AddClick.column.visibleIndex === 40) {
            GetRow = AddClick.rowIndex;

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

            document.getElementById("SchQtyLbl").innerHTML = "";
            document.getElementById("TxtUnitSch").value = "";
            document.getElementById("SchDelDateLbl").innerHtml = "";
            document.getElementById("SchItemIDLbl").innerHtml = "";
            document.getElementById("SchItemCodeLbl").innerHtml = "";
            document.getElementById("TxtQtySch").innerHtml = "";

            document.getElementById("SchQtyLbl").innerHtml = AddClick.data.PurchaseQuantity;
            document.getElementById("TxtPurchaseQtySch").value = AddClick.data.PurchaseQuantity;
            document.getElementById("TxtUnitSch").value = AddClick.data.PurchaseUnit;
            document.getElementById("SchDelDateLbl").innerHtml = AddClick.data.ExpectedDeliveryDate;
            document.getElementById("SchItemIDLbl").innerHtml = AddClick.data.ItemID;
            document.getElementById("SchItemCodeLbl").innerHtml = AddClick.data.ItemCode;
            //  }
        }

        if (AddClick.column.dataField === "ProductHSNName") {
            GetPOGridRow = AddClick.rowIndex;
            // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_PurchaseOrder.asmx/GetAllHSN",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.replace(/u0027/g, "'");
                    res = res.replace(/:,/g, ":null,");
                    res = res.replace(/,}/g, ",null}");
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    //   $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    ProductHSNGridRES1 = [];
                    ProductHSNGridRES1 = JSON.parse(res);

                    $("#ProductHSNGrid").dxDataGrid({
                        dataSource: ProductHSNGridRES1
                    });
                }
            });

            $("#BtnOpenProductHSNPopUp").click();
        }
    },
    onRowUpdated: function (editcell) {
        //var dataGrid = $('#CreatePOGrid').dxDataGrid('instance');
        //var ReqQty = 0, PerQty = 0;
        //for (var xx = 0; xx < dataGrid.totalCount() ; xx++) {           
        //        ReqQty = dataGrid._options.dataSource[xx].RequiredQuantity;
        //        PerQty = dataGrid._options.dataSource[xx].PurchaseQuantity;               
        //        if (ReqQty < PerQty) {
        //            dataGrid.cellValue(xx, "PurchaseQuantity", 0)
        //            DevExpress.ui.notify("Purchase Quantity should not be greater then Requisition Quantity..!", "error", 1000);
        //            return false;              
        //    }
        //}
        if (ChargesGrid.length > 0) {
            AddItemCalculation();
            GridColumnCal();
            //AddItemWithChargessGrid();
            CalculateAmount();
        } else {
            AddItemCalculation();
            GridColumnCal();
        }
    },
    onCellPrepared: function (CEll) {
        GridColumnCal();
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
        { dataField: "ItemGroupName", visible: true, allowEditing: false, caption: "Group Name", width: 60 },
        { dataField: "ItemCode", visible: true, allowEditing: false, caption: "Item Code", width: 60 },
        { dataField: "ItemName", visible: true, allowEditing: false, caption: "Item Name", width: 200 },
        ///RequiredQuantity In Stock Unit
        { dataField: "RequiredQuantity", visible: true, allowEditing: false, caption: "Req.Qty (In S.U.)", width: 60 },
        { dataField: "StockUnit", visible: true, allowEditing: false, caption: "Stock Unit", width: 60 },
        //Added field : RequiredQuantityInPurchaseUnit By Minesh Jain On 01-Oct-2019
        { dataField: "RequiredQuantityInPurchaseUnit", visible: true, allowEditing: false, caption: "Req.Qty (In P.U.)", width: 60 },
        {
            dataField: "PurchaseQuantity", visible: true, allowEditing: true, caption: "P.O.Qty (In P.U.)", width: 60,
            validationRules: [{ type: "required" }, { type: "numeric" }],
            setCellValue: function (newData, value, currentRowData) {
                newData.PurchaseQuantity = value;
                //newData.TotalPrice = currentRowData.Price * value;
                newData.PurchaseQuantityInStockUnit = Number(StockUnitConversion(currentRowData.ConversionFormulaStockUnit, value, currentRowData.UnitPerPacking, currentRowData.WtPerPacking, currentRowData.ConversionFactor, currentRowData.SizeW, currentRowData.UnitDecimalPlaceStockUnit));
            }
        },
        { dataField: "PurchaseQuantityInStockUnit", visible: true, allowEditing: false, caption: "P.O.Qty (In S.U.)", width: 60 },
        {
            dataField: "PurchaseRate", visible: true, allowEditing: FlagEditPurchaseRate, caption: "Rate", width: 50, //16
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        {
            dataField: "PurchaseUnit", visible: true, allowEditing: false, caption: "Purchase Unit", width: 60 //17
            //lookup: {
            //    dataSource: StkUnit,
            //    displayExpr: "Name",
            //    valueExpr: "Name"
            //}
        },
        {
            dataField: "ProductHSNName", visible: true, allowEditing: false, caption: "ProductHSNName", width: 120
            //cellTemplate: function (container, options) {
            //$('<div>').addClass('fa fa-plus customgridbtn')
            //    .on('dxclick', function () {
            //        this.setAttribute("data-toggle", "modal");
            //        this.setAttribute("data-target", "#largeModalHSNGroup");
            //    }).appendTo(container);
            // }

        }, //18
        { dataField: "HSNCode", visible: true, allowEditing: false, caption: "HSNCode", width: 80 }, //19
        {
            dataField: "ExpectedDeliveryDate", visible: true, allowEditing: true, caption: "Expec. Delivery Date", width: 120, //20
            dataType: "date", format: "dd-MMM-yyyy",
            showEditorAlways: true
        },
        {
            dataField: "Tolerance", visible: true, allowEditing: true, caption: "Tole. %", width: 40, //21
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "ItemNarration", visible: false, caption: "Item Narration", width: 100 }, //22
        { dataField: "BasicAmount", visible: true, allowEditing: false, caption: "Basic Amt", width: 60 }, //23
        {
            dataField: "Disc", visible: true, allowEditing: true, caption: "Disc. %", width: 40, //24
            validationRules: [{ type: "required" }, { type: "numeric" }]
        },
        { dataField: "AfterDisAmt", visible: false, caption: "AfterDisAmt", width: 60 },
        { dataField: "TaxableAmount", visible: true, allowEditing: false, caption: "Taxable Amt", width: 60 },
        { dataField: "GSTTaxPercentage", visible: false, caption: "GST %", width: 40 },
        { dataField: "CGSTTaxPercentage", visible: true, allowEditing: false, caption: "CGST %", width: 40 },
        { dataField: "SGSTTaxPercentage", visible: true, allowEditing: false, caption: "SGST %", width: 40 },
        { dataField: "IGSTTaxPercentage", visible: true, allowEditing: false, caption: "IGST %", width: 50 },

        { dataField: "CGSTAmt", visible: true, allowEditing: false, caption: "CGST Amt", width: 60 },
        { dataField: "SGSTAmt", visible: true, allowEditing: false, caption: "SGST Amt", width: 60 },
        { dataField: "IGSTAmt", visible: true, allowEditing: false, caption: "IGST Amt", width: 60 },
        { dataField: "TotalAmount", visible: true, allowEditing: false, caption: "Total Amt", width: 60 },

        { dataField: "PurchaseQuantityComp", visible: false, caption: "Pending Quantity", width: 120 }, //For Compair of Purchase qty
        { dataField: "CreatedBy", visible: false, caption: "CreatedBy", width: 120 },
        { dataField: "Narration", visible: false, caption: "Narration", width: 120 },
        { dataField: "FYear", visible: false, caption: "FYear", width: 120 },

        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 120 },
        {
            dataField: "Schedule", visible: true, allowEditing: false, caption: "Schedule", width: 60,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn')
                    .on('dxclick', function () {
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#largeModalSchedule");
                        //  $("p").text("Hello world!");
                    }).appendTo(container);
            }
        },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },
        { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula", width: 120 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 120 },
        {
            dataField: "RefJobBookingJobCardContentsID", visible: true, allowEditing: true, caption: "Ref.J.C.No.", width: 150,
            lookup: {
                dataSource: GblJobCardRES,
                displayExpr: "RefJobCardContentNo",
                valueExpr: "RefJobBookingJobCardContentsID"
            },
            setCellValue: function (newData, value) {
                var result = $.grep(GblJobCardRES, function (e) { return e.RefJobBookingJobCardContentsID === value; });
                newData.RefJobBookingJobCardContentsID = value;
                newData.RefJobCardContentNo = result[0].RefJobCardContentNo;
            }
        },
        { dataField: "RefJobCardContentNo", visible: false, allowEditing: false, caption: "Ref.J.C.No.", width: 120 },
        { dataField: "ConversionFormulaStockUnit", visible: false, caption: "ConversionFormulaStockUnit", width: 120 },
        { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit", width: 120 },
        { dataField: "ProductHSNID", visible: false, caption: "ProductHSNID", width: 120 }
    ]
});

$("#ScheduleGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    filterRow: { visible: false, applyFilter: "auto" },
    height: function () {
        return window.innerHeight / 1.3;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: "row",
        allowDeleting: true
    },
    onRowRemoving: function (e) {
        RemID = "";
        RemID = e.data.id;
    },
    onRowRemoved: function (e) {
        ScheduleListOBJ = ScheduleListOBJ.filter(function (obj) {
            return obj.id !== RemID;
        });
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
    { dataField: "SchDate", visible: true, caption: "Schedule Date", width: 120, dataType: "date", format: "dd-MMM-yyyy" }
    ]
});

$("#BtnProductHSN").click(function () {
    if (SelectedProductHSNList.length > 0) {
        var CreatePOGriddataGrid = $('#CreatePOGrid').dxDataGrid('instance');
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
        // CreatePOGriddataGrid.cellValue(GetPOGridRow, "PurchaseQuantity", ReqQty)
        //for (var xx = 0; xx < CreatePOGriddataGrid.totalCount() ; xx++) {
        //    ReqQty = CreatePOGriddataGrid._options.dataSource[xx].PurchaseQuantityComp;
        //    PerQty = CreatePOGriddataGrid._options.dataSource[xx].PurchaseQuantity;
        //    if (ReqQty < PerQty) {
        //        CreatePOGriddataGrid.cellValue(xx, "PurchaseQuantity", ReqQty)
        //        DevExpress.ui.notify("Purchase Quantity should not be greater then Pending Quantity..!", "error", 1000);
        //        return false;
        //    }
        //}

        //alert(GetPOGridRow);
        //alert(SelectedProductHSNList[0].HSNCode);
        //alert(SelectedProductHSNList[0].ProductHSNName);
    }
});

///init selectbox and datebox
var PurchaseDivisionText = ["COM", "CRD", "EXP"];
$("#PurchaseDivision").dxSelectBox({
    items: PurchaseDivisionText,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

var ModeOfTransportText = ["By Road", "By Rail", "By Air", "By Ocean", "Other"];
$("#ModeOfTransport").dxSelectBox({
    items: ModeOfTransportText,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#ContactPersonName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'Name',
    valueExpr: 'ConcernPersonID',
    searchEnabled: true,
    showClearButton: true
});

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelCurrencyCode").dxSelectBox({
    items: [],
    placeholder: "Select --",
    displayExpr: 'CurrencyCode',
    valueExpr: 'CurrencyCode',
    searchEnabled: true,
    showClearButton: true
});

$("#SelPOApprovalBy").dxSelectBox({
    items: [],
    placeholder: "Select --",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true
});

$("#DealerName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true
});

$("#SupplierName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true
});
//$("#FromDate").dxDateBox({
//    pickerType: "rollers",
//    displayFormat: 'dd-MMM-yyyy',
//    value: new Date().toISOString().substr(0, 10),
//});

//$("#ToDate").dxDateBox({
//    pickerType: "rollers",
//    displayFormat: 'dd-MMM-yyyy',
//    value: new Date().toISOString().substr(0, 10),
//});
loadCurrency();
function loadCurrency() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseOrder.asmx/GetCurrencyList",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                if (res !== "fail") {
                    var currencyList = JSON.parse(res);
                    $("#SelCurrencyCode").dxSelectBox({
                        items: currencyList
                    });
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}

loadPOApprovalBy();
function loadPOApprovalBy() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseOrder.asmx/GetPOApprovalBy",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                if (res !== "fail") {
                    var EmployeeList = JSON.parse(res);
                    $("#SelPOApprovalBy").dxSelectBox({
                        items: EmployeeList
                    });
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}

var StkUnit = [{
    "ID": 1,
    "Name": "Unit"
},
{
    "ID": 0,
    "Name": "Kg"
},
{
    "ID": 2,
    "Name": "Sheets"
}, {
    "ID": 3,
    "Name": "Sheet"
}
];

CreatePONO();

function CreatePONO() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/GetPONO",
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
                document.getElementById("LblPONo").value = res;
            }
        }
    });

    //Supplere Get
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/Supplier",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.substr(1);
            res = res.slice(0, -1);
            var Supplier = JSON.parse(res);
            GblCompanyStateTin = "";
            GblGSTApplicable = true;
            GblCompanyStateTin = Supplier[0].CompanyStateTinNo;

            if (Supplier.length > 0) {
                SupplierDDL = [];
                var OptSupplierDDL = {};
                for (var ee = 0; ee < Supplier.length; ee++) {
                    OptSupplierDDL = {};
                    OptSupplierDDL.LedgerID = Supplier[ee].LedgerID;
                    OptSupplierDDL.LedgerName = Supplier[ee].LedgerName;
                    SupplierDDL.push(OptSupplierDDL);
                }
            }
            else {
                SupplierDDL = [];
            }

            SupplierData = { 'AllSup': Supplier };

            $("#SupplierName").dxSelectBox({
                items: SupplierDDL,
                onValueChanged: function (data) {
                    //GroupName = "";
                    //GroupName = data.value;
                    document.getElementById("LblState").innerHTML = "State : ";
                    document.getElementById("LblCountry").innerHTML = "Country : ";
                    document.getElementById("CurrentCurrency").innerHTML = "INR";
                    document.getElementById("VatGSTApplicable").innerHTML = "";
                    document.getElementById("ConversionRate").innerHTML = 1;
                    document.getElementById("LblSupplierStateTin").innerHTML = "";
                    GblGSTApplicable = false;

                    if (data.value === "" || data.value === undefined || data.value === null) {
                        //document.getElementById("DivContactPerson").style.display = "none";
                        $("#ContactPersonName").dxSelectBox({
                            disabled: true
                        });
                    }
                    else {
                        // document.getElementById("DivContactPerson").style.display = "block";
                        $("#ContactPersonName").dxSelectBox({
                            disabled: false
                        });
                    }
                    newSUPllierArray = SupplierData.AllSup.filter(function (el) {
                        return el.LedgerID === data.value;
                    });

                    if (newSUPllierArray !== "" && newSUPllierArray !== [] && newSUPllierArray.length > 0) {
                        document.getElementById("LblState").innerHTML = "State : " + newSUPllierArray[0].SupState;
                        document.getElementById("LblCountry").innerHTML = "Country : " + newSUPllierArray[0].Country;
                        document.getElementById("CurrentCurrency").innerHTML = newSUPllierArray[0].CurrencyCode;
                        document.getElementById("VatGSTApplicable").innerHTML = newSUPllierArray[0].GSTApplicable;
                        document.getElementById("ConversionRate").innerHTML = 1;
                        document.getElementById("LblSupplierStateTin").innerHTML = newSUPllierArray[0].StateTinNo;
                        if (newSUPllierArray[0].GSTApplicable === "True" || newSUPllierArray[0].GSTApplicable === "1") {
                            GblGSTApplicable = true;
                        } else {
                            GblGSTApplicable = false;
                        }

                    }

                    $.ajax({
                        type: "POST",
                        url: "WebService_PurchaseOrder.asmx/GetItemRate",
                        data: '{LedgerId:' + JSON.stringify($('#SupplierName').dxSelectBox('instance').option('value')) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            ////console.debug(results);
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, '&');
                            res = res.replace(/u0027/g, "'");
                            res = res.replace(/:,/g, ":null,");
                            res = res.replace(/,}/g, ",null}");
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            var I_RateRESS = JSON.parse(res);
                            ItemRateString = { 'ItemRateObj': I_RateRESS };
                            var dtGrid = $("#CreatePOGrid").dxDataGrid('instance');
                            var purRate = 0, QuantityTolerance = 0;
                            for (var x = 0; x < dtGrid._options.dataSource.length; x++) {
                                ObjItemRate = [];

                                ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                                    return el.LedgerID === data.value &&
                                        el.ItemID === dtGrid._options.dataSource[x].ItemID;
                                });
                                if (ObjItemRate === [] || ObjItemRate === "" || ObjItemRate.length === 0) {
                                    purRate = Number(dtGrid._options.dataSource[x].PurchaseRate);
                                } else {
                                    purRate = Number(ObjItemRate[0].PurchaseRate);
                                    QuantityTolerance = Number(ObjItemRate[0].QuantityTolerance);
                                }
                                if (Number(purRate) > 0) {
                                    dtGrid._options.dataSource[x].PurchaseRate = purRate;
                                    dtGrid._options.dataSource[x].Tolerance = QuantityTolerance;

                                    dtGrid._options.dataSource[x].BasicAmount = (Number(dtGrid._options.dataSource[x].PurchaseQuantity) * Number(dtGrid._options.dataSource[x].PurchaseRate)).toFixed(2);
                                    if (Number(dtGrid._options.dataSource[x].Disc) > 0) {
                                        dtGrid._options.dataSource[x].AfterDisAmt = Number(dtGrid._options.dataSource[x].BasicAmount) - (Number(dtGrid._options.dataSource[x].BasicAmount) * Number(dtGrid._options.dataSource[x].Disc) / 100).toFixed(2);
                                        dtGrid._options.dataSource[x].TaxableAmount = Number(dtGrid._options.dataSource[x].BasicAmount) - (Number(dtGrid._options.dataSource[x].BasicAmount) * Number(dtGrid._options.dataSource[x].Disc) / 100).toFixed(2);
                                    } else {
                                        dtGrid._options.dataSource[x].AfterDisAmt = dtGrid._options.dataSource[x].BasicAmount;
                                        dtGrid._options.dataSource[x].TaxableAmount = dtGrid._options.dataSource[x].BasicAmount;
                                    }
                                }
                                dtGrid.refresh();
                            }
                            if (ChargesGrid.length > 0) {
                                AddItemCalculation();
                                GridColumnCal();
                                //AddItemWithChargessGrid();
                                CalculateAmount();
                            } else {
                                AddItemCalculation();
                                GridColumnCal();
                            }
                        }
                    });

                    $.ajax({
                        type: "POST",
                        url: "WebService_PurchaseOrder.asmx/GetContactPerson",
                        data: '{ContactPerson:' + JSON.stringify(data.value) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, '&');
                            res = res.replace(/u0027/g, "'");
                            res = res.replace(/:,/g, ":null,");
                            res = res.replace(/,}/g, ",null}");
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            var ContactPerson = JSON.parse(res);
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                            $("#ContactPersonName").dxSelectBox({
                                items: ContactPerson
                            });
                        }
                    });
                }
            });

            $("#DealerName").dxSelectBox({
                items: SupplierDDL
            });
        }
    });
}

var RadioValue = "Pending Requisitions";
GetDataGrid();

var priorities = ["Pending Requisitions", "Purchase Orders"];
$("#RadioButtonPO").dxRadioGroup({
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

function GetDataGrid() {
    if (RadioValue === "Pending Requisitions") {
        GetPendingData = "";
        GblStatus = "";
        SubGridData = []; ChargesGrid = []; PaymentTermsGrid = []; ScheduleListOBJ = []; existReq = [];

        document.getElementById("DivDateChk").style.display = "none";
        document.getElementById("DivEdit").style.display = "none";
        document.getElementById("DivCretbtn").style.display = "block";

        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        document.getElementById("POGridPending").style.display = "block";
        document.getElementById("POGridProcess").style.display = "none";

        document.getElementById("TxtPOID").value = "";

        $.ajax({
            type: "POST",
            url: "WebService_PurchaseOrder.asmx/FillGrid",
            data: '{RadioValue:' + JSON.stringify(RadioValue) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                ////console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                var PendingList = JSON.parse(res);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                fillGridPending(PendingList);
            }
        });
    }

    else if (RadioValue === "Purchase Orders") {
        SubGridData = [];
        GetPendingData = "";
        GblStatus = "Update";

        ChargesGrid = []; PaymentTermsGrid = []; ScheduleListOBJ = []; existReq = [];

        document.getElementById("DivDateChk").style.display = "block";
        document.getElementById("DivEdit").style.display = "block";
        document.getElementById("DivCretbtn").style.display = "none";

        document.getElementById("POGridPending").style.display = "none";
        document.getElementById("POGridProcess").style.display = "block";

        document.getElementById("TxtPOID").value = "";
        $("#RadioButtonStatus").dxRadioGroup({
            value: "ApprovalPending"
        });
        POProcessFillGrid();
    }
}

try {
    $("#RadioButtonStatus").dxRadioGroup({
        items: [{ value: "All", text: "All P.O." }, { value: "ApprovalPending", text: "Approval Pending P.O." },
        { value: "ApprovedOrders", text: "Approved P.O." }, { value: "CancelledOrders", text: "Cancelled P.O." }],
        displayExpr: "text",
        valueExpr: "value",
        layout: "horizontal",
        value: "All",
        itemTemplate: function (itemData, _, itemElement) {
            itemElement
                .parent().addClass(itemData.value.toLowerCase()).addClass("font-bold")
                .text(itemData.text);
        },
        onValueChanged: function (data) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            var FDate = "", ToDate = "", CHKPODate = "";
            var CHKPODetail = document.getElementById("CHKPODetail").checked;
            var FilterStr = "";
            if (data.value === "All") {
                FilterStr = "";
            } else if (data.value === "ApprovalPending") {
                FilterStr = " And (Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsCancelled,0)=0) ";
            } else if (data.value === "ApprovedOrders") {
                FilterStr = " And (Isnull(ITD.IsVoucherItemApproved,0)=1) ";
            } else if (data.value === "CancelledOrders") {
                FilterStr = " And (Isnull(ITD.IsCancelled,0)=1) ";
            } else {
                FilterStr = "";
            }

            $.ajax({
                type: "POST",
                url: "WebService_PurchaseOrder.asmx/ProcessFillGrid",
                data: '{FDate:' + JSON.stringify(FDate) + ',ToDate:' + JSON.stringify(ToDate) + ',chk:' + JSON.stringify(CHKPODate) + ',Detail:' + JSON.stringify(CHKPODetail) + ',FilterStr:' + JSON.stringify(FilterStr) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                crossDomain: true,
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.replace(/u0027/g, "'");
                    res = res.replace(/:,/g, ":null,");
                    res = res.replace(/,}/g, ",null}");
                    res = res.substr(1);
                    res = res.slice(0, -1);

                    var ProcessRESS = JSON.parse(res);
                    fillGridPOSuccess(ProcessRESS);

                    var gridInstance = $("#POGridProcess").dxDataGrid('instance');
                    gridInstance.columnOption("ItemCode", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("ItemGroupName", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("ItemSubGroupName", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("ItemName", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("PurchaseUnit", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("ExpectedDeliveryDate", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("RefJobCardContentNo", "visible", document.getElementById("CHKPODetail").checked);

                    gridInstance.columnOption("PurchaseRate", "visible", document.getElementById("CHKPODetail").checked);
                    gridInstance.columnOption("PendingToReceiveQty", "visible", document.getElementById("CHKPODetail").checked);

                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                },
                error: function errorFunc(jqXHR) {
                    //DevExpress.ui.notify(jqXHR.statusText, "error", 500);
                }
            });

        }
    });
} catch (e) {
    console.log(e);
}

$("#RefreshPOButton").click(function () {
    POProcessFillGrid();
});

function POProcessFillGrid() {
    var FDate = "", ToDate = "", CHKPODate = "";
    //var FDate = $('#FromDate').dxDateBox('instance').option('value');;
    //var ToDate = $('#ToDate').dxDateBox('instance').option('value');;
    //var CHKPODate = document.getElementById("CHKPODate").checked;
    var CHKPODetail = document.getElementById("CHKPODetail").checked;
    var optionStatus = $("#RadioButtonStatus").dxRadioGroup('instance').option('value');
    var FilterStr = "";
    if (optionStatus === "All") {
        FilterStr = "";
    } else if (optionStatus === "ApprovalPending") {
        FilterStr = " And (Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsCancelled,0)=0) ";
    } else if (optionStatus === "ApprovedOrders") {
        FilterStr = " And (Isnull(ITD.IsVoucherItemApproved,0)=1) ";
    } else if (optionStatus === "CancelledOrders") {
        FilterStr = " And (Isnull(ITD.IsCancelled,0)=1) ";
    } else {
        FilterStr = "";
    }
    //console.log(optionStatus);
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/ProcessFillGrid",
        data: '{FDate:' + JSON.stringify(FDate) + ',ToDate:' + JSON.stringify(ToDate) + ',chk:' + JSON.stringify(CHKPODate) + ',Detail:' + JSON.stringify(CHKPODetail) + ',FilterStr:' + JSON.stringify(FilterStr) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var ProcessRESS = JSON.parse(res);
            fillGridPOSuccess(ProcessRESS);

            var gridInstance = $("#POGridProcess").dxDataGrid('instance');
            gridInstance.columnOption("ItemCode", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("ItemGroupName", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("ItemSubGroupName", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("ItemName", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("PurchaseUnit", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("ExpectedDeliveryDate", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("RefJobCardContentNo", "visible", document.getElementById("CHKPODetail").checked);

            gridInstance.columnOption("PurchaseRate", "visible", document.getElementById("CHKPODetail").checked);
            gridInstance.columnOption("PendingToReceiveQty", "visible", document.getElementById("CHKPODetail").checked);

        }
    });
}

$("#POGridPending").dxDataGrid({
    dataSource: [],
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
        pageSize: 50
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Pending Requisition",
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
        GetPendingData = clickedIndentCell.selectedRowsData;
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "PurchaseQuantity") {
            e.cancel = false;
        }
        else {
            e.cancel = true;
        }
    },
    onRowUpdated: function (e) {
        var ReqQty = Number(e.data.PurchaseQuantityComp);
        var PerQty = Number(e.data.PurchaseQuantity);
        if (ReqQty < PerQty) {
            e.data.PurchaseQuantity = ReqQty;
            DevExpress.ui.notify("Purchase quantity should not be greater then pending quantity..!", "error", 1000);
        }
    },
    columns: [
        { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Req.No.", width: 100, fixed: true },
        { dataField: "VoucherNo", visible: true, caption: "Req. No.", width: 100, fixed: true },
        { dataField: "VoucherDate", visible: true, caption: "Req. Date", width: 100, fixed: true },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 120 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 120 },
        { dataField: "RequiredQuantity", visible: true, caption: "Req. Qty", width: 100 },
        { dataField: "PurchaseQuantityComp", visible: true, caption: "Pending Qty", width: 100 }, //For Compair of Purchase qty
        { dataField: "PurchaseQuantity", visible: true, caption: "Purchase Qty", width: 100 },
        { dataField: "OrderUnit", visible: true, caption: "Order Unit", width: 80 },
        { dataField: "CreatedBy", visible: true, caption: "CreatedBy", width: 120 },
        { dataField: "ItemNarration", visible: true, caption: "Item Narration", width: 120 },
        { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
        { dataField: "PurchaseRate", visible: false, caption: "PurchaseRate", width: 120 },
        { dataField: "PurchaseUnit", visible: false, caption: "PurchaseUnit", width: 120 },
        { dataField: "ProductHSNName", visible: false, caption: "ProductHSNName", width: 120 },
        { dataField: "HSNCode", visible: false, caption: "HSNCode", width: 120 },
        { dataField: "GSTTaxPercentage", visible: false, caption: "GSTTaxPercentage", width: 120 },
        { dataField: "CGSTTaxPercentage", visible: false, caption: "CGSTTaxPercentage", width: 120 },
        { dataField: "SGSTTaxPercentage", visible: false, caption: "SGSTTaxPercentage", width: 120 },
        { dataField: "IGSTTaxPercentage", visible: false, caption: "IGSTTaxPercentage", width: 120 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },
        { dataField: "SizeW", visible: false, caption: "SizeW", width: 120 },
        { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula", width: 120 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 120 },
        { dataField: "ConversionFormulaStockUnit", visible: false, caption: "ConversionFormulaStockUnit", width: 120 },
        { dataField: "UnitDecimalPlaceStockUnit", visible: false, caption: "UnitDecimalPlaceStockUnit", width: 120 },
        { dataField: "StockUnit", visible: false, caption: "StockUnit", width: 80 },
        { dataField: "PurchaseUnit", visible: false, caption: "PurchaseUnit", width: 80 }
    ]
});

$("#POGridProcess").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "single" },
    paging: {
        pageSize: 50
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    //rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Purchase Orders",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');

        if (e.rowType === "data") {
            if (e.data.VoucherItemApproved === false && e.data.VoucherCancelled === false) {
                e.rowElement.addClass('approvalpending');
            } else if (e.data.VoucherItemApproved === true) {
                e.rowElement.addClass('approvedorders');
            } else if (e.data.VoucherCancelled === true) {
                e.rowElement.addClass('cancelledorders');
            }
        }
    },
    onSelectionChanged: function (clickedCell) {
        // Groupdata = clickedCell.selectedRowsData;
        //clickedCell.data.ItemID
        // if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
        // var Row = e.row.rowIndex;
        // var Col = e.columnIndex;
        if (clickedCell.selectedRowsData.length <= 0) return false;
        ModalPopupScreencontrols();
        document.getElementById("TxtPOID").value = clickedCell.selectedRowsData[0].TransactionID;
        document.getElementById("LblPONo").value = clickedCell.selectedRowsData[0].VoucherNo;

        //document.getElementById("textNaretion").innerHTML = clickedCell.selectedRowsData[0].Narration;

        VarItemApproved = clickedCell.selectedRowsData[0].IsVoucherItemApproved;

        $("#VoucherDate").dxDateBox({ value: clickedCell.selectedRowsData[0].VoucherDate });
        $("#SupplierName").dxSelectBox({ value: clickedCell.selectedRowsData[0].LedgerID });
        $("#ContactPersonName").dxSelectBox({ value: clickedCell.selectedRowsData[0].ContactPersonID });
        $("#PurchaseDivision").dxSelectBox({ value: clickedCell.selectedRowsData[0].PurchaseDivision });
        $("#SelCurrencyCode").dxSelectBox({ value: clickedCell.selectedRowsData[0].CurrencyCode });
        $("#SelPOApprovalBy").dxSelectBox({ value: clickedCell.selectedRowsData[0].VoucherApprovalByEmployeeID });

        updateTotalTax = clickedCell.selectedRowsData[0].TotalTaxAmount;
        document.getElementById("TxtBasicAmt").value = clickedCell.selectedRowsData[0].BasicAmount;
        document.getElementById("TxtAfterDisAmt").value = clickedCell.selectedRowsData[0].AfterDisAmt;

        document.getElementById("TxtNetAmt").value = clickedCell.selectedRowsData[0].NetAmount;
        document.getElementById("PORefernce").value = clickedCell.selectedRowsData[0].PurchaseReference;
        document.getElementById("TxtTotalQty").value = clickedCell.selectedRowsData[0].TotalQuantity;

        //document.getElementById("TxtCGSTAmt").value = clickedCell.selectedRowsData[0].ContactPersonID;
        //document.getElementById("TxtSGSTAmt").value = clickedCell.selectedRowsData[0].ContactPersonID;
        //document.getElementById("TxtIGSTAmt").value = clickedCell.selectedRowsData[0].ContactPersonID;            
        document.getElementById("Txt_TaxAbleSum").value = clickedCell.selectedRowsData[0].TaxableAmount;

        PaymentTermsString = clickedCell.selectedRowsData[0].TermsOfPayment;

        document.getElementById("textDeliverAt").value = clickedCell.selectedRowsData[0].DeliveryAddress;
        //document.getElementById("textNaretion").value = clickedCell.selectedRowsData[0].Narration;

        $("#DealerName").dxSelectBox({ value: clickedCell.selectedRowsData[0].DealerID });

        $("#ModeOfTransport").dxSelectBox({ value: clickedCell.selectedRowsData[0].ModeOfTransport });
    },
    columns: [
        { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 200 },
        { dataField: "VoucherNo", visible: true, caption: "P.O. No", width: 100 },
        { dataField: "VoucherDate", visible: true, caption: "P.O. Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar", width: 120 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 120 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 300 },
        { dataField: "PurchaseQuantity", visible: true, caption: "P.O. Qty", width: 100 },
        { dataField: "PurchaseUnit", visible: true, caption: "Unit", width: 80 },
        { dataField: "ExpectedDeliveryDate", visible: true, caption: "ExpectedDeliveryDate", width: 80 },
        { dataField: "PurchaseRate", visible: false, caption: "Rate", width: 80 },
        { dataField: "PendingToReceiveQty", visible: false, width: 100 },
        { dataField: "GrossAmount", visible: false, caption: "Gross Amount", width: 100 },
        { dataField: "DiscountAmount", visible: false, caption: "Disc. Amount", width: 100 },
        { dataField: "BasicAmount", visible: false, caption: "Basic Amount", width: 100 },
        { dataField: "GSTPercentage", visible: false, caption: "GST %", width: 80 },
        { dataField: "GSTTaxAmount", visible: false, caption: "GST Amount", width: 100 },
        { dataField: "NetAmount", visible: true, caption: "Net Amount", width: 100 },
        { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 120 },
        { dataField: "CreatedBy", visible: true, caption: "Created By", width: 100 },
        { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 100 },
        { dataField: "ReceiptTransactionID", visible: false, caption: "ReceiptTransactionID", width: 120 },
        { dataField: "IsVoucherItemApproved", visible: false, caption: "IsVoucherItemApproved", width: 120 },
        { dataField: "IsReworked", visible: false, caption: "Is Reworked", width: 120 },
        { dataField: "ReworkRemark", visible: false, caption: "Rework Remark", width: 120 },
        { dataField: "PurchaseDivision", visible: true, caption: "Purchase Division", width: 120 },
        { dataField: "PurchaseReference", visible: true, caption: "Purchase Reference", width: 120 },
        { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
        { dataField: "TaxableAmount", visible: false, caption: "TaxableAmount", width: 80 },
        { dataField: "ContactPersonID", visible: false, caption: "Contact PersonID", width: 120 },
        { dataField: "RequiredQuantity", visible: false, caption: "RequiredQuantity", width: 80 },
        { dataField: "TotalTaxAmount", visible: false, caption: "TotalTaxAmount", width: 80 },
        { dataField: "TotalOverheadAmount", visible: false, caption: "TotalOverheadAmount", width: 80 },
        { dataField: "DeliveryAddress", visible: false, caption: "DeliveryAddress", width: 120 },
        { dataField: "TotalQuantity", visible: false, caption: "TotalQuantity", width: 120 },
        { dataField: "TermsOfPayment", visible: false, caption: "TermsOfPayment", width: 120 },
        { dataField: "ModeOfTransport ", visible: false, caption: "ModeOfTransport", width: 120 },
        { dataField: "DealerID", visible: false, caption: "DealerID", width: 120 },
        { dataField: "VoucherItemApproved", visible: false, caption: "VoucherItemApproved", dataType: "boolean" },
        { dataField: "VoucherCancelled", visible: false, caption: "VoucherCancelled", dataType: "boolean" },
        { dataField: "CurrencyCode", visible: false, caption: "CurrencyCode" }]
});

function fillGridPending(PendingList) {
    $("#POGridPending").dxDataGrid({
        dataSource: PendingList
    });
    var grid = $("#POGridPending").dxDataGrid('instance');
    grid.clearSelection();
}

function fillGridPOSuccess(ProcessRESS) {
    $("#POGridProcess").dxDataGrid({ dataSource: ProcessRESS });
    var grid = $("#POGridProcess").dxDataGrid('instance');
    grid.clearSelection();
}

$("#CreatePOButton").click(function () {
    TotalGstAmt = 0; //Edit By Pradeep 06 sept 2019
    VarItemApproved = "";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("POPrintButton").disabled = true;
    document.getElementById("TxtAddPayTerms").value = "";
    $("#SelLnameChargesGrid").dxSelectBox({ value: '' });
    $("#SelCurrencyCode").dxSelectBox({ value: 'INR' });
    ModalPopupScreencontrols();
    DistinctArray = [];
    ScheduleListOBJ = [];
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;
    GblStatus = "";
    PaymentTermsString = "Payment in 30 Days,Payment in 60 Days,Payment in 90 Days";
    fillPayTermsGrid();
    if (GetPendingData.length === 0 || GetPendingData === [] || GetPendingData === "") {
        existReq = [];
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        //existReq = existReq;

        $("#SupplierName").dxSelectBox({ items: SupplierDDL });
    }
    else {
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseOrder.asmx/GetAllotedSupp",
            data: '{ItemGroupID:' + JSON.stringify(GetPendingData[0].ItemGroupID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                var FilteredSupp = JSON.parse(res);

                $("#SupplierName").dxSelectBox({
                    items: FilteredSupp
                });
                if (FilteredSupp.length > 0) {
                    $("#SupplierName").dxSelectBox({
                        value: FilteredSupp[0].LedgerID
                    });
                }
            }
        });

        MasterGridData = [];
        SubGridData = [];
        var MasterGridOpt = {};
        var SubGridOpt = {};

        var FinalQty = 0;
        var FinalQtyInStockUnit = 0;
        var FinalQtyInPurchaseUnit = 0;
        var RequiredQuantity = 0;
        var RequiredQuantityInStockUnit = 0;
        var RequiredQuantityInPurchaseUnit = 0;
        var WholeGetPendingData = "";
        var newArray = [];
        var currentdate = new Date();

        var Qty = "";
        var QtyInStockUnit = "";
        var Var_ItemGroupNameID = 0;
        var Var_WtPerPacking = 0;
        var Var_UnitPerPacking = 0;
        var Var_SizeW = 0;
        var Var_ConversionFactor = 0;
        var Var_ConversionFormula = "", Var_UnitDecimalPlace = "";
        var JobCardNumbers = "";
        var JobCardList = [];
        var JobCardIDs = "";
        var JobCardIDList = [];
        WholeGetPendingData = { 'AllGetPendingData': GetPendingData };

        for (var d = 0; d < GetPendingData.length; d++) {
            FinalQty = 0;
            FinalQtyInStockUnit = 0;
            FinalQtyInPurchaseUnit = 0;
            RequiredQuantity = 0;
            RequiredQuantityInStockUnit = 0;
            RequiredQuantityInPurchaseUnit = 0;
            newArray = [];

            if (MasterGridData === [] || MasterGridData === "" || MasterGridData === undefined || MasterGridData === null) {

                newArray = WholeGetPendingData.AllGetPendingData.filter(function (el) {
                    return el.ItemID === GetPendingData[d].ItemID;
                });

                JobCardNumbers = "";
                JobCardList = [];
                JobCardIDs = "";
                JobCardIDList = [];
                var ddlSupplierId = $('#SupplierName').dxSelectBox('instance').option('value');
                var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;

                for (var f = 0; f < newArray.length; f++) {
                    if (newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].PurchaseUnit.toString().toUpperCase() && newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].StockUnit.toString().toUpperCase()) {
                        FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(newArray[f].PurchaseQuantity);
                        FinalQtyInStockUnit = FinalQtyInStockUnit + Number(newArray[f].PurchaseQuantity);
                        RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(newArray[f].RequiredQuantity);
                        RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(newArray[f].RequiredQuantity);
                    } else if (newArray[f].OrderUnit.toString().toUpperCase() !== newArray[f].PurchaseUnit.toString().toUpperCase()) {
                        FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(StockUnitConversion(newArray[f].ConversionFormula.toString(), Number(newArray[f].PurchaseQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlace)));
                        FinalQtyInStockUnit = FinalQtyInStockUnit + Number(newArray[f].PurchaseQuantity);
                        RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(StockUnitConversion(newArray[f].ConversionFormula.toString(), Number(newArray[f].RequiredQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlace)));
                        RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(newArray[f].RequiredQuantity);
                    } else if (newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].PurchaseUnit.toString().toUpperCase() && newArray[f].OrderUnit.toString().toUpperCase() !== newArray[f].StockUnit.toString().toUpperCase()) {
                        FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(newArray[f].PurchaseQuantity);
                        FinalQtyInStockUnit = FinalQtyInStockUnit + Number(StockUnitConversion(newArray[f].ConversionFormulaStockUnit.toString(), Number(newArray[f].PurchaseQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlaceStockUnit)));
                        RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(newArray[f].RequiredQuantity);
                        RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(StockUnitConversion(newArray[f].ConversionFormulaStockUnit.toString(), Number(newArray[f].RequiredQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlaceStockUnit)));
                    }
                    FinalQty = FinalQty + Number(newArray[f].PurchaseQuantity);
                    RequiredQuantity = RequiredQuantity + Number(newArray[f].RequiredQuantity);
                    if (newArray[f].RefJobCardContentNo !== "" && newArray[f].RefJobCardContentNo !== null && newArray[f].RefJobCardContentNo !== undefined) {
                        var JCNo = newArray[f].RefJobCardContentNo;
                        var JobCardArray = JCNo.split(",");
                        if (JobCardArray.length > 0) {
                            for (var ccount = 0; ccount < JobCardArray.length; ccount++) {
                                var found = JobCardList.includes(JobCardArray[ccount]);
                                if (found === false) {
                                    JobCardList.push(JobCardArray[ccount]);
                                }
                            }
                        }
                    }

                    if (newArray[f].RefJobBookingJobCardContentsID !== "" && newArray[f].RefJobBookingJobCardContentsID !== null && newArray[f].RefJobBookingJobCardContentsID !== undefined) {
                        var JCID = newArray[f].RefJobBookingJobCardContentsID.toString();
                        var JobCardArray1 = JCID.split(",");
                        if (JobCardArray1.length > 0) {
                            for (var count = 0; count < JobCardArray1.length; count++) {
                                var found1 = JobCardIDList.includes(JobCardArray1[count]);
                                if (found1 === false) {
                                    JobCardIDList.push(JobCardArray1[count]);
                                }
                            }
                        }
                    }
                    SubGridOpt = {};
                    SubGridOpt.TransactionID = newArray[f].TransactionID;//SubGrid  
                    SubGridOpt.TransID = newArray[f].TransID;
                    SubGridOpt.VoucherID = newArray[f].VoucherID;
                    SubGridOpt.ItemGroupID = newArray[f].ItemGroupID;
                    SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                    SubGridOpt.ItemSubGroupID = newArray[f].ItemSubGroupID;
                    SubGridOpt.ItemID = newArray[f].ItemID;
                    SubGridOpt.MaxVoucherNo = newArray[f].MaxVoucherNo;
                    //SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                    SubGridOpt.VoucherNo = newArray[f].VoucherNo;
                    SubGridOpt.VoucherDate = newArray[f].VoucherDate;
                    SubGridOpt.ItemCode = newArray[f].ItemCode;
                    SubGridOpt.ItemGroupName = newArray[f].ItemGroupName;
                    SubGridOpt.ItemSubGroupName = newArray[f].ItemSubGroupName;
                    SubGridOpt.ItemName = newArray[f].ItemName;
                    SubGridOpt.RefJobCardContentNo = newArray[f].RefJobCardContentNo;
                    SubGridOpt.ItemDescription = newArray[f].ItemDescription;
                    SubGridOpt.RequisitionQty = newArray[f].RequiredQuantity;
                    SubGridOpt.PurchaseQuantityComp = newArray[f].PurchaseQuantity;
                    SubGridOpt.RequiredQuantity = newArray[f].PurchaseQuantity;
                    SubGridOpt.StockUnit = newArray[f].OrderUnit;
                    SubGridOpt.ItemNarration = newArray[f].ItemNarration;
                    SubGridOpt.CreatedBy = newArray[f].CreatedBy;
                    SubGridOpt.PurchaseUnit = newArray[f].PurchaseUnit;
                    SubGridOpt.GSTTaxPercentage = newArray[f].GSTTaxPercentage;
                    SubGridOpt.CGSTTaxPercentage = newArray[f].CGSTTaxPercentage;
                    SubGridOpt.SGSTTaxPercentage = newArray[f].SGSTTaxPercentage;
                    SubGridOpt.IGSTTaxPercentage = newArray[f].IGSTTaxPercentage;
                    SubGridOpt.Narration = newArray[f].Narration;
                    SubGridOpt.FYear = newArray[f].FYear;
                    SubGridOpt.PurchaseRate = newArray[f].PurchaseRate;
                    SubGridOpt.ProductHSNName = newArray[f].ProductHSNName;
                    SubGridOpt.HSNCode = newArray[f].HSNCode;

                    SubGridData.push(SubGridOpt);

                }
                MasterGridOpt = {};

                MasterGridOpt.TransactionID = newArray[0].TransactionID;//MasterGrid  
                MasterGridOpt.TransID = newArray[0].TransID;
                MasterGridOpt.VoucherID = newArray[0].VoucherID;
                MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                MasterGridOpt.ItemSubGroupID = newArray[0].ItemSubGroupID;
                MasterGridOpt.ItemID = newArray[0].ItemID;
                MasterGridOpt.MaxVoucherNo = newArray[0].MaxVoucherNo;
                if (currentdate > Date.parse(newArray[0].ExpectedDeliveryDate)) {
                    MasterGridOpt.ExpectedDeliveryDate = currentdate;
                } else {
                    MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                }

                MasterGridOpt.VoucherNo = newArray[0].VoucherNo;
                MasterGridOpt.VoucherDate = newArray[0].VoucherDate;
                MasterGridOpt.ItemCode = newArray[0].ItemCode;
                MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                MasterGridOpt.ItemSubGroupName = newArray[0].ItemSubGroupName;
                MasterGridOpt.ItemName = newArray[0].ItemName;
                MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                MasterGridOpt.RefJobCardContentNo = JobCardList.join();
                MasterGridOpt.RefJobBookingJobCardContentsID = JobCardIDList.join();
                //MasterGridOpt.RequiredQuantity = newArray[0].PurchaseQuantity;//RequiredQuantity

                Qty = "";
                QtyInStockUnit = "";
                Var_ItemGroupNameID = 0;
                Var_WtPerPacking = 0;
                Var_UnitPerPacking = 0;
                Var_SizeW = 0;
                Var_ConversionFactor = 0;
                Var_ConversionFormula = "";

                //if (FinalQty === "" || FinalQty === undefined || FinalQty === null || FinalQty === "NULL") {
                //    Qty = 0;
                //    MasterGridOpt.RequiredQuantity = Qty;
                //}
                if (FinalQtyInStockUnit === "" || FinalQtyInStockUnit === undefined || FinalQtyInStockUnit === null || FinalQtyInStockUnit === "NULL") {
                    Qty = 0;
                    MasterGridOpt.RequiredQuantity = Qty;
                    MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                }
                else {
                    //Start New Code for Change Sheets
                    Var_ItemGroupNameID = newArray[0].ItemGroupNameID;
                    Var_WtPerPacking = newArray[0].WtPerPacking;
                    Var_UnitPerPacking = newArray[0].UnitPerPacking;
                    Var_SizeW = newArray[0].SizeW;
                    Var_ConversionFactor = newArray[0].ConversionFactor;
                    Var_ConversionFormula = newArray[0].ConversionFormula;
                    Var_UnitDecimalPlace = newArray[0].UnitDecimalPlace;

                    if (Var_ConversionFormula === "" || Var_ConversionFormula === undefined || Var_ConversionFormula === null) {
                        //Qty = parseFloat(Number(FinalQty)).toFixed(Number(Var_UnitDecimalPlace));
                        Qty = parseFloat(Number(FinalQtyInPurchaseUnit)).toFixed(Number(Var_UnitDecimalPlace));
                        MasterGridOpt.RequiredQuantity = parseFloat(Number(FinalQtyInStockUnit)).toFixed(Number(newArray[0].UnitDecimalPlaceStockUnit));
                        QtyInStockUnit = parseFloat(Number(FinalQtyInStockUnit)).toFixed(Number(newArray[0].UnitDecimalPlaceStockUnit));
                        MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                    } else {
                        if (Var_UnitPerPacking === 0) { Var_UnitPerPacking = 1; }
                        if (Var_ConversionFactor === 0) { Var_ConversionFactor = 1; }
                        if (Var_SizeW === 0) { Var_SizeW = 1; }
                        MasterGridOpt.RequiredQuantity = FinalQtyInStockUnit;
                        QtyInStockUnit = FinalQtyInStockUnit;
                        Qty = parseFloat(Number(FinalQtyInPurchaseUnit)).toFixed(Number(Var_UnitDecimalPlace));
                        MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                        ////Commented By Minesh Jain on 01-Oct-19 Conversion done by function at the start of loop
                        //MasterGridOpt.RequiredQuantity = FinalQty;
                        //Var_ConversionFormula = Var_ConversionFormula.split('e.').join('')
                        //Var_ConversionFormula = Var_ConversionFormula.replace("Quantity", "FinalQty");
                        //Var_ConversionFormula = Var_ConversionFormula.replace("UnitPerPacking", "Var_UnitPerPacking");
                        //Var_ConversionFormula = Var_ConversionFormula.replace("WtPerPacking", "Var_WtPerPacking");
                        //Var_ConversionFormula = Var_ConversionFormula.replace("SizeW", "Var_SizeW");
                        //Var_ConversionFormula = Var_ConversionFormula.replace("UnitDecimalPlace", "Var_UnitDecimalPlace");

                        //Qty = parseFloat(Number(eval(Var_ConversionFormula))).toFixed(Number(Var_UnitDecimalPlace));
                    }

                    //Close New Code for Change Sheets
                    //Qty = FinalQty;
                }

                var PurchaseRate = "";
                if (newArray[0].PurchaseRate === "" || newArray[0].PurchaseRate === undefined || newArray[0].PurchaseRate === null || newArray[0].PurchaseRate === "NULL") {
                    PurchaseRate = 0;
                }
                else {
                    PurchaseRate = newArray[0].PurchaseRate;
                }

                /////***************

                if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                    PurchaseRate = PurchaseRate;
                }
                else {
                    ObjItemRate = [];

                    ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                        return el.LedgerID === ddlSupplierId &&
                            el.ItemID === newArray[0].ItemID;
                    });
                    if (ObjItemRate === [] || ObjItemRate === "" || ObjItemRate === undefined) {
                        PurchaseRate = PurchaseRate;
                    } else {
                        PurchaseRate = ObjItemRate[0].PurchaseRate;
                    }
                }

                //PurchaseRate = 65;

                var BasicAmt = 0;
                BasicAmt = Number(Qty) * Number(PurchaseRate);

                var DisPercentage = 0;
                var TaxAbleAmt = 0;
                var DiscountAmt = Number(Number(BasicAmt) * Number(DisPercentage)) / 100;

                TaxAbleAmt = Number(BasicAmt) - Number(DiscountAmt);

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

                MasterGridOpt.PurchaseQuantityComp = Qty;
                MasterGridOpt.PurchaseQuantity = Qty;
                MasterGridOpt.PurchaseQuantityInStockUnit = QtyInStockUnit;

                MasterGridOpt.StockUnit = newArray[0].StockUnit;
                MasterGridOpt.CreatedBy = newArray[0].CreatedBy;
                MasterGridOpt.ItemNarration = newArray[0].ItemNarration;
                MasterGridOpt.PurchaseUnit = newArray[0].PurchaseUnit;
                MasterGridOpt.BasicAmount = BasicAmt;
                MasterGridOpt.Disc = DisPercentage;
                MasterGridOpt.Tolerance = 0;
                MasterGridOpt.AfterDisAmt = TaxAbleAmt;
                MasterGridOpt.TaxableAmount = TaxAbleAmt;

                MasterGridOpt.GSTTaxPercentage = newArray[0].GSTTaxPercentage;
                MasterGridOpt.CGSTTaxPercentage = newArray[0].CGSTTaxPercentage;
                MasterGridOpt.SGSTTaxPercentage = newArray[0].SGSTTaxPercentage;
                MasterGridOpt.IGSTTaxPercentage = newArray[0].IGSTTaxPercentage;

                MasterGridOpt.CGSTAmt = CGSTAMT;
                MasterGridOpt.SGSTAmt = SGSTAMT;
                MasterGridOpt.IGSTAmt = IGSTAMT;
                MasterGridOpt.TotalAmount = TotalAmount;

                MasterGridOpt.Narration = newArray[0].Narration;
                MasterGridOpt.FYear = newArray[0].FYear;
                MasterGridOpt.PurchaseRate = PurchaseRate;
                MasterGridOpt.ProductHSNName = newArray[0].ProductHSNName;
                MasterGridOpt.HSNCode = newArray[0].HSNCode;
                MasterGridOpt.WtPerPacking = newArray[0].WtPerPacking;
                MasterGridOpt.UnitPerPacking = newArray[0].UnitPerPacking;
                MasterGridOpt.ConversionFactor = newArray[0].ConversionFactor;
                MasterGridOpt.ConversionFormula = newArray[0].ConversionFormula;
                MasterGridOpt.UnitDecimalPlace = newArray[0].UnitDecimalPlace;
                MasterGridOpt.ConversionFormulaStockUnit = newArray[0].ConversionFormulaStockUnit;
                MasterGridOpt.UnitDecimalPlaceStockUnit = newArray[0].UnitDecimalPlaceStockUnit;
                // MasterGridOpt.Schedule = Addfun;

                MasterGridData.push(MasterGridOpt);
            }
            else {
                //var extobj = JSON.stringify(MasterGridData);

                //var existID = extobj.includes(GetPendingData[d].ItemID);

                //if (existID !== true) {
                //    newArray = WholeGetPendingData.AllGetPendingData.filter(function (el) {
                //        return el.ItemID === GetPendingData[d].ItemID;
                //    });
                var existID = MasterGridData.filter(function (el) {
                    return el.ItemID === GetPendingData[d].ItemID;
                });
                JobCardNumbers = "";
                JobCardList = [];
                JobCardIDs = "";
                JobCardIDList = [];

                if (existID.length === 0) {
                    newArray = WholeGetPendingData.AllGetPendingData.filter(function (el) {
                        return el.ItemID === GetPendingData[d].ItemID;
                    });
                    for (f = 0; f < newArray.length; f++) {
                        if (newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].PurchaseUnit.toString().toUpperCase() && newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].StockUnit.toString().toUpperCase()) {
                            FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(newArray[f].PurchaseQuantity);
                            FinalQtyInStockUnit = FinalQtyInStockUnit + Number(newArray[f].PurchaseQuantity);
                            RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(newArray[f].RequiredQuantity);
                            RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(newArray[f].RequiredQuantity);
                        } else if (newArray[f].OrderUnit.toString().toUpperCase() !== newArray[f].PurchaseUnit.toString().toUpperCase()) {
                            FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(StockUnitConversion(newArray[f].ConversionFormula.toString(), Number(newArray[f].PurchaseQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlace)));
                            FinalQtyInStockUnit = FinalQtyInStockUnit + Number(newArray[f].PurchaseQuantity);
                            RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(StockUnitConversion(newArray[f].ConversionFormula.toString(), Number(newArray[f].RequiredQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlace)));
                            RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(newArray[f].RequiredQuantity);
                        } else if (newArray[f].OrderUnit.toString().toUpperCase() === newArray[f].PurchaseUnit.toString().toUpperCase() && newArray[f].OrderUnit.toString().toUpperCase() !== newArray[f].StockUnit.toString().toUpperCase()) {
                            FinalQtyInPurchaseUnit = FinalQtyInPurchaseUnit + Number(newArray[f].PurchaseQuantity);
                            FinalQtyInStockUnit = FinalQtyInStockUnit + Number(StockUnitConversion(newArray[f].ConversionFormulaStockUnit.toString(), Number(newArray[f].PurchaseQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlaceStockUnit)));
                            RequiredQuantityInPurchaseUnit = RequiredQuantityInPurchaseUnit + Number(newArray[f].RequiredQuantity);
                            RequiredQuantityInStockUnit = RequiredQuantityInStockUnit + Number(StockUnitConversion(newArray[f].ConversionFormulaStockUnit.toString(), Number(newArray[f].RequiredQuantity), Number(newArray[f].UnitPerPacking), Number(newArray[f].WtPerPacking), Number(newArray[f].ConversionFactor), Number(newArray[f].SizeW), Number(newArray[f].UnitDecimalPlaceStockUnit)));
                        }

                        FinalQty = FinalQty + Number(newArray[f].PurchaseQuantity);
                        RequiredQuantity = RequiredQuantity + Number(newArray[f].RequiredQuantity);
                        if (newArray[f].RefJobCardContentNo !== "" && newArray[f].RefJobCardContentNo !== null && newArray[f].RefJobCardContentNo !== undefined) {
                            var JobCardArrayx = newArray[f].RefJobCardContentNo.split(",");
                            if (JobCardArrayx.length > 0) {
                                for (var ccounti = 0; ccounti < JobCardArrayx.length; ccounti++) {
                                    var foundx = JobCardList.includes(JobCardArrayx[ccounti]);
                                    if (foundx === false) {
                                        JobCardList.push(JobCardArrayx[ccounti]);
                                    }
                                }
                            }
                        }

                        if (newArray[f].RefJobBookingJobCardContentsID !== "" && newArray[f].RefJobBookingJobCardContentsID !== null && newArray[f].RefJobBookingJobCardContentsID !== undefined) {
                            var JobCardArray2 = newArray[f].RefJobBookingJobCardContentsID.toString().split(",");
                            if (JobCardArray2.length > 0) {
                                for (var count1 = 0; count1 < JobCardArray2.length; count1++) {
                                    var foundE = JobCardIDList.includes(JobCardArray2[count1]);
                                    if (foundE === false) {
                                        JobCardIDList.push(JobCardArray2[count1]);
                                    }
                                }
                            }
                        }

                        SubGridOpt = {};
                        SubGridOpt.TransactionID = newArray[f].TransactionID;//SubGrid  
                        SubGridOpt.TransID = newArray[f].TransID;
                        SubGridOpt.VoucherID = newArray[f].VoucherID;
                        SubGridOpt.ItemGroupID = newArray[f].ItemGroupID;
                        SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                        SubGridOpt.ItemSubGroupID = newArray[f].ItemSubGroupID;
                        SubGridOpt.ItemID = newArray[f].ItemID;
                        SubGridOpt.MaxVoucherNo = newArray[f].MaxVoucherNo;
                        //SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                        SubGridOpt.VoucherNo = newArray[f].VoucherNo;
                        SubGridOpt.VoucherDate = newArray[f].VoucherDate;
                        SubGridOpt.ItemCode = newArray[f].ItemCode;
                        SubGridOpt.ItemGroupName = newArray[f].ItemGroupName;
                        SubGridOpt.ItemSubGroupName = newArray[f].ItemSubGroupName;
                        SubGridOpt.ItemName = newArray[f].ItemName;
                        SubGridOpt.RefJobCardContentNo = newArray[f].RefJobCardContentNo;
                        SubGridOpt.ItemDescription = newArray[f].ItemDescription;
                        SubGridOpt.RequisitionQty = newArray[f].RequiredQuantity;
                        SubGridOpt.PurchaseQuantityComp = newArray[f].PurchaseQuantity;
                        SubGridOpt.RequiredQuantity = newArray[f].PurchaseQuantity;
                        SubGridOpt.StockUnit = newArray[f].OrderUnit;
                        SubGridOpt.CreatedBy = newArray[f].CreatedBy;
                        SubGridOpt.ItemNarration = newArray[f].ItemNarration;
                        SubGridOpt.PurchaseUnit = newArray[f].PurchaseUnit;

                        SubGridOpt.GSTTaxPercentage = newArray[f].GSTTaxPercentage;
                        SubGridOpt.CGSTTaxPercentage = newArray[f].CGSTTaxPercentage;
                        SubGridOpt.SGSTTaxPercentage = newArray[f].SGSTTaxPercentage;
                        SubGridOpt.IGSTTaxPercentage = newArray[f].IGSTTaxPercentage;
                        SubGridOpt.Narration = newArray[f].Narration;
                        SubGridOpt.FYear = newArray[f].FYear;
                        SubGridOpt.PurchaseRate = newArray[f].PurchaseRate;
                        SubGridOpt.ProductHSNName = newArray[f].ProductHSNName;
                        SubGridOpt.HSNCode = newArray[f].HSNCode;

                        SubGridData.push(SubGridOpt);
                    }

                    MasterGridOpt = {};

                    MasterGridOpt.TransactionID = newArray[0].TransactionID;//MasterGrid  
                    MasterGridOpt.TransID = newArray[0].TransID;
                    MasterGridOpt.VoucherID = newArray[0].VoucherID;
                    MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                    MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                    MasterGridOpt.ItemSubGroupID = newArray[0].ItemSubGroupID;
                    MasterGridOpt.ItemID = newArray[0].ItemID;
                    MasterGridOpt.MaxVoucherNo = newArray[0].MaxVoucherNo;
                    if (currentdate > Date.parse(newArray[0].ExpectedDeliveryDate)) {
                        MasterGridOpt.ExpectedDeliveryDate = currentdate;
                    } else {
                        MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    }
                    //MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    MasterGridOpt.VoucherNo = newArray[0].VoucherNo;
                    MasterGridOpt.VoucherDate = newArray[0].VoucherDate;
                    MasterGridOpt.ItemCode = newArray[0].ItemCode;
                    MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                    MasterGridOpt.ItemSubGroupName = newArray[0].ItemSubGroupName;
                    MasterGridOpt.ItemName = newArray[0].ItemName;
                    MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                    MasterGridOpt.RefJobCardContentNo = JobCardList.join();
                    MasterGridOpt.RefJobBookingJobCardContentsID = JobCardIDList.join();
                    //MasterGridOpt.RequiredQuantity = newArray[0].PurchaseQuantity; //RequiredQuantity;

                    Qty = "";
                    QtyInStockUnit = "";
                    //if (FinalQty === "" || FinalQty === undefined || FinalQty === null || FinalQty === "NULL") {
                    //    Qty = 0;
                    //    MasterGridOpt.RequiredQuantity = Qty;
                    //}
                    if (FinalQtyInStockUnit === "" || FinalQtyInStockUnit === undefined || FinalQtyInStockUnit === null || FinalQtyInStockUnit === "NULL") {
                        Qty = 0;
                        QtyInStockUnit = 0;
                        MasterGridOpt.RequiredQuantity = Qty;
                        MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                    }
                    else {
                        //Start New Code for Change Sheets
                        Var_ItemGroupNameID = newArray[0].ItemGroupNameID;
                        Var_WtPerPacking = newArray[0].WtPerPacking;
                        Var_UnitPerPacking = newArray[0].UnitPerPacking;
                        Var_ConversionFactor = newArray[0].ConversionFactor;
                        Var_SizeW = newArray[0].SizeW;
                        Var_ConversionFormula = newArray[0].ConversionFormula;
                        Var_UnitDecimalPlace = newArray[0].UnitDecimalPlace;

                        //MasterGridOpt.RequiredQuantity = FinalQty;
                        MasterGridOpt.RequiredQuantity = FinalQtyInStockUnit;

                        if (Var_ConversionFormula === "" || Var_ConversionFormula === undefined || Var_ConversionFormula === null) {
                            //Qty = parseFloat(Number(FinalQty)).toFixed(Number(Var_UnitDecimalPlace));
                            Qty = parseFloat(Number(FinalQtyInPurchaseUnit)).toFixed(Number(Var_UnitDecimalPlace));
                            QtyInStockUnit = parseFloat(Number(FinalQtyInStockUnit)).toFixed(Number(newArray[0].UnitDecimalPlaceStockUnit));
                            MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                        } else {
                            if (Var_UnitPerPacking === 0) { Var_UnitPerPacking = 1; }
                            if (Var_ConversionFactor === 0) { Var_ConversionFactor = 1; }
                            if (Var_SizeW === 0) { Var_SizeW = 1; }
                            //MasterGridOpt.RequiredQuantity = FinalQty;
                            MasterGridOpt.RequiredQuantity = FinalQtyInStockUnit;
                            QtyInStockUnit = FinalQtyInStockUnit;
                            Qty = parseFloat(Number(FinalQtyInPurchaseUnit)).toFixed(Number(Var_UnitDecimalPlace));
                            MasterGridOpt.RequiredQuantityInPurchaseUnit = Qty;
                        }
                        //Close New Code for Change Sheets
                    }

                    PurchaseRate = "";
                    if (newArray[0].PurchaseRate === "" || newArray[0].PurchaseRate === undefined || newArray[0].PurchaseRate === null || newArray[0].PurchaseRate === "NULL") {
                        PurchaseRate = 0;
                    }
                    else {
                        PurchaseRate = newArray[0].PurchaseRate;
                    }

                    /////***************
                    if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                        PurchaseRate = PurchaseRate;
                    }
                    else {
                        ObjItemRate = [];
                        ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                            return el.LedgerID === ddlSupplierId &&
                                el.ItemID === newArray[0].ItemID;
                        });
                        if (ObjItemRate === [] || ObjItemRate === "" || ObjItemRate === undefined) {
                            PurchaseRate = PurchaseRate;
                        } else {
                            PurchaseRate = ObjItemRate[0].PurchaseRate;
                        }
                    }

                    //PurchaseRate = 65;
                    var BasicAmtEl = 0;
                    BasicAmtEl = parseFloat(Number(Number(Qty) * Number(PurchaseRate))).toFixed(2);

                    var DisPercentage = 0;
                    var TaxAbleAmt = 0;
                    var DiscountAmt = parseFloat(Number((Number(BasicAmtEl) * Number(DisPercentage)) / 100)).toFixed(2);

                    TaxAbleAmt = parseFloat(Number(Number(BasicAmtEl) - Number(DiscountAmt))).toFixed(2);

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
                        SGSTAMT = parseFloat(Number(((Number(TaxAbleAmt) * Number(SGSTPER)) / 100))).toFixed(2);
                        CGSTAMT = parseFloat(Number(((Number(TaxAbleAmt) * Number(CGSTPER)) / 100))).toFixed(2);
                        TotalAmount = parseFloat(Number(Number(SGSTAMT) + Number(CGSTAMT) + Number(TaxAbleAmt))).toFixed(2);
                    }
                    else {
                        if (newArray[0].IGSTTaxPercentage === "" || newArray[0].IGSTTaxPercentage === undefined || newArray[0].IGSTTaxPercentage === null || newArray[0].IGSTTaxPercentage === "NULL") {
                            IGSTPER = 0;
                        }
                        else {
                            IGSTPER = newArray[0].IGSTTaxPercentage;
                        }
                        IGSTAMT = parseFloat(Number(((Number(TaxAbleAmt) * Number(IGSTPER)) / 100))).toFixed(2);
                        TotalAmount = parseFloat(Number(Number(IGSTAMT) + Number(TaxAbleAmt))).toFixed(2);
                    }

                    MasterGridOpt.PurchaseQuantityComp = Qty;
                    MasterGridOpt.PurchaseQuantity = Qty;
                    MasterGridOpt.PurchaseQuantityInStockUnit = QtyInStockUnit;

                    MasterGridOpt.StockUnit = newArray[0].StockUnit;
                    MasterGridOpt.CreatedBy = newArray[0].CreatedBy;
                    MasterGridOpt.ItemNarration = newArray[0].ItemNarration;
                    MasterGridOpt.PurchaseUnit = newArray[0].PurchaseUnit;
                    MasterGridOpt.BasicAmount = BasicAmtEl;
                    MasterGridOpt.Disc = DisPercentage;
                    MasterGridOpt.AfterDisAmt = TaxAbleAmt;
                    MasterGridOpt.TaxableAmount = TaxAbleAmt;
                    MasterGridOpt.Tolerance = 0;
                    MasterGridOpt.GSTTaxPercentage = newArray[0].GSTTaxPercentage;
                    MasterGridOpt.CGSTTaxPercentage = newArray[0].CGSTTaxPercentage;
                    MasterGridOpt.SGSTTaxPercentage = newArray[0].SGSTTaxPercentage;
                    MasterGridOpt.IGSTTaxPercentage = newArray[0].IGSTTaxPercentage;

                    MasterGridOpt.CGSTAmt = CGSTAMT;
                    MasterGridOpt.SGSTAmt = SGSTAMT;
                    MasterGridOpt.IGSTAmt = IGSTAMT;
                    MasterGridOpt.TotalAmount = TotalAmount;

                    MasterGridOpt.Narration = newArray[0].Narration;
                    MasterGridOpt.FYear = newArray[0].FYear;
                    MasterGridOpt.PurchaseRate = PurchaseRate;
                    MasterGridOpt.ProductHSNName = newArray[0].ProductHSNName;
                    MasterGridOpt.HSNCode = newArray[0].HSNCode;
                    MasterGridOpt.WtPerPacking = newArray[0].WtPerPacking;
                    MasterGridOpt.UnitPerPacking = newArray[0].UnitPerPacking;
                    MasterGridOpt.ConversionFactor = newArray[0].ConversionFactor;
                    MasterGridOpt.ConversionFormula = newArray[0].ConversionFormula;
                    MasterGridOpt.UnitDecimalPlace = newArray[0].UnitDecimalPlace;
                    MasterGridOpt.ConversionFormulaStockUnit = newArray[0].ConversionFormulaStockUnit;
                    MasterGridOpt.UnitDecimalPlaceStockUnit = newArray[0].UnitDecimalPlaceStockUnit;
                    //MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    if (currentdate > Date.parse(newArray[0].ExpectedDeliveryDate)) {
                        MasterGridOpt.ExpectedDeliveryDate = currentdate;
                    } else {
                        MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    }
                    // MasterGridOpt.Schedule = Addfun;

                    MasterGridData.push(MasterGridOpt);

                }
            }
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        existReq = MasterGridData;

    }

    //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    document.getElementById("CreatePOButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreatePOButton").setAttribute("data-target", "#largeModal");

    //CreatePONO();

    ShowCreatePOGrid();
    document.getElementById("textDeliverAt").value = "D.No. 5/208, 5/209, 5/209-A,B,C,D and E, Poovanathapuram Road, Enjar, Sivakasi West - 626124";
});

var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;
var BasicAmt = 0;
var TaxAbleAmt = 0;
var IGSTPER = 0, SGSTPER = 0, CGSTPER = 0;
var IGSTAMT = 0, SGSTAMT = 0, CGSTAMT = 0;
var TotalAmount = 0;

function ShowCreatePOGrid() {

    var gridInstance = $("#CreatePOGrid").dxDataGrid({
        dataSource: existReq,
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var currentEmployeeData = options.data;

                //$("<div>")
                //    .addClass("master-detail-caption")
                //    .text(currentEmployeeData.VoucherNo + "  (Voucher No.)")
                //    .appendTo(container);

                $("<div>")
                    .dxDataGrid({
                        columnAutoWidth: true,
                        showBorders: true,
                        allowColumnResizing: true,
                        sorting: {
                            mode: "none"
                        },
                        columns: [{ dataField: "TransactionID", visible: false }, { dataField: "TransID", visible: false },
                        { dataField: "VoucherID", visible: false }, { dataField: "ItemGroupID", visible: false },
                        { dataField: "ItemID", visible: false }, { dataField: "MaxVoucherNo", caption: "Ref.Req.No.", width: 80 },
                        { dataField: "VoucherNo", caption: "Req.No.", width: 100 }, { dataField: "VoucherDate", caption: "Req.Date", width: 100, dataType: "date", format: "dd-MMM-yyyy" },
                        { dataField: "ItemCode", caption: "Item Code", width: 80 }, { dataField: "ItemGroupName", caption: "Item Group", width: 100 },
                        { dataField: "ItemSubGroupName", caption: "Sub Group", width: 100 }, { dataField: "ItemName", caption: "Item Name", width: 250 },
                        { dataField: "RefJobCardContentNo", caption: "Ref.J.C.No.", width: 120 }, { dataField: "RequiredQuantity", caption: "Req.Qty", width: 80 },
                        { dataField: "RequisitionQty", caption: "Total Req.Qty", width: 100 }, { dataField: "PurchaseQuantity", caption: "Purchase Qty", visible: false },
                        { dataField: "StockUnit", caption: "Unit", width: 80 }, { dataField: "CreatedBy", caption: "Created By", width: 80 }, { dataField: "Narration", caption: "Narration" },
                        { dataField: "FYear", caption: "FYear", visible: false }, { dataField: "PurchaseRate", caption: "Purchase Rate", visible: false },
                        { dataField: "PurchaseUnit", caption: "Purchase Unit", visible: false }, { dataField: "ProductHSNName", visible: false },
                        { dataField: "HSNCode", visible: false }, { dataField: "GSTTaxPercentage", caption: "GSTTaxPercentage", visible: false },
                        { dataField: "CGSTTaxPercentage", caption: "CGSTTaxPercentage", visible: false }, { dataField: "SGSTTaxPercentage", caption: "SGSTTaxPercentage", visible: false },
                        { dataField: "IGSTTaxPercentage", caption: "IGSTTaxPercentage", visible: false }],
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.ArrayStore({
                                key: "ItemID",
                                data: SubGridData
                            }),
                            filter: [["ItemID", "=", options.key], "and", ["RequiredQuantity", ">", 0], "and", ["TransactionID", ">", 0]]
                        })
                    }).appendTo(container);
            }
        }

    }).dxDataGrid("instance");
}

function AddItemWithChargessGrid() {

    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
    //var CreatePOGrid_RowCount = CreatePOGrid.totalCount();
    var CreatePOGrid_RowCount = CreatePOGrid._options.dataSource.length;
    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var Charge_RowCount = AdditionalChargesGrid.totalCount();
    var t = 0;
    AdditionalChargesGrid.refresh();
    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;
    var NewAfterDisAmt = 0;
    if (CreatePOGrid_RowCount > 0) {
        for (t = 0; t < CreatePOGrid_RowCount; t++) {
            CreatePOGrid._options.dataSource[t].TaxableAmount = existReq[t].AfterDisAmt;
            NewAfterDisAmt = Number(NewAfterDisAmt) + Number(existReq[t].AfterDisAmt);
        }
    }

    document.getElementById("TxtAfterDisAmt").value = NewAfterDisAmt;
    BasicAmt = 0; IGSTPER = 0; SGSTPER = 0; CGSTPER = 0;
    TaxAbleAmt = 0; IGSTAMT = 0; SGSTAMT = 0; CGSTAMT = 0; TotalAmount = 0;

    var AfterDisAmt_WithGstApplicable = 0;

    //var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    //var AdditionalChargesGrid_RowCount = AdditionalChargesGrid.totalCount();
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
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            if (TaxRatePer === existReq[g].CGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[g].CGSTAmt);
                            }
                        }
                    }
                    // taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "STATE TAX") {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            if (TaxRatePer === existReq[g].SGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[g].SGSTAmt);
                            }
                        }
                    }
                    //taxAmt = FilterAmt * TaxRatePer;
                    taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
                }
                else if (GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            if (TaxRatePer === existReq[g].IGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[g].IGSTAmt);
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
            if (ChargesGrid[c].InAmount === true || ChargesGrid[c].InAmount === "1" || ChargesGrid[c].InAmount === 1 || ChargesGrid[c].InAmount === "true") {
                OtherAmt = ChargesGrid[c].ChargesAmount;
            }
            else {
                OtherAmt = Number(Number(document.getElementById("TxtAfterDisAmt").value) * TaxRatePer) / 100;
            }

            var GSTAplicable = ChargesGrid[c].GSTApplicable;

            if (GSTAplicable === true || GSTAplicable === "1" || GSTAplicable === 1 || GSTAplicable === "true") {
                if (CalculateON.toUpperCase().trim() === "VALUE") {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = Number(OtherAmt / Number(document.getElementById("TxtAfterDisAmt").value) * Number(existReq[g].AfterDisAmt)) + Number(existReq[g].TaxableAmount);

                            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                                if (existReq[g].CGSTTaxPercentage === "" || existReq[g].CGSTTaxPercentage === undefined || existReq[g].CGSTTaxPercentage === null || existReq[g].CGSTTaxPercentage === "NULL") {
                                    CGSTPER = 0;
                                }
                                else {
                                    CGSTPER = existReq[g].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                                }
                                if (existReq[g].SGSTTaxPercentage === "" || existReq[g].SGSTTaxPercentage === undefined || existReq[g].SGSTTaxPercentage === null || existReq[g].SGSTTaxPercentage === "NULL") {
                                    SGSTPER = 0;
                                }
                                else {
                                    SGSTPER = existReq[g].SGSTTaxPercentage;
                                }
                                SGSTAMT = Number(Number(AfterDisAmt_WithGstApplicable) * Number(SGSTPER)) / 100;
                                CGSTAMT = Number(Number(AfterDisAmt_WithGstApplicable) * Number(CGSTPER)) / 100;
                                TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            else {
                                if (existReq[g].IGSTTaxPercentage === "" || existReq[g].IGSTTaxPercentage === undefined || existReq[g].IGSTTaxPercentage === null || existReq[g].IGSTTaxPercentage === "NULL") {
                                    IGSTPER = 0;
                                }
                                else {
                                    IGSTPER = existReq[g].IGSTTaxPercentage;
                                }

                                IGSTAMT = Number(Number(Number(AfterDisAmt_WithGstApplicable) * Number(IGSTPER)) / 100);
                                TotalAmount = Number(IGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            existReq[g].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
                            existReq[g].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
                            existReq[g].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
                            existReq[g].TotalAmount = parseFloat(Number(TotalAmount)).toFixed(2);
                            existReq[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);
                        }
                    }
                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
                else {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = Number(OtherAmt / Number(document.getElementById("TxtTotalQty").value) * Number(existReq[g].PurchaseQuantity)) + Number(existReq[g].TaxableAmount);

                            existReq[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);
                        }
                    }
                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
            }
            else {
                if (CalculateON.toUpperCase().trim() === "VALUE") {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            //AfterDisAmt_WithGstApplicable = Number(existReq[g].BasicAmount) + (Number(existReq[g].BasicAmount) * Number(existReq[g].Disc) / 100);
                            AfterDisAmt_WithGstApplicable = Number(existReq[g].BasicAmount) - (Number(existReq[g].BasicAmount) * Number(existReq[g].Disc) / 100);

                            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                                if (existReq[g].CGSTTaxPercentage === "" || existReq[g].CGSTTaxPercentage === undefined || existReq[g].CGSTTaxPercentage === null || existReq[g].CGSTTaxPercentage === "NULL") {
                                    CGSTPER = 0;
                                }
                                else {
                                    CGSTPER = existReq[g].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                                }
                                if (existReq[g].SGSTTaxPercentage === "" || existReq[g].SGSTTaxPercentage === undefined || existReq[g].SGSTTaxPercentage === null || existReq[g].SGSTTaxPercentage === "NULL") {
                                    SGSTPER = 0;
                                }
                                else {
                                    SGSTPER = existReq[g].SGSTTaxPercentage;
                                }
                                SGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(SGSTPER)) / 100);
                                CGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(CGSTPER)) / 100);
                                TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            else {
                                if (existReq[g].IGSTTaxPercentage === "" || existReq[g].IGSTTaxPercentage === undefined || existReq[g].IGSTTaxPercentage === null || existReq[g].IGSTTaxPercentage === "NULL") {
                                    IGSTPER = 0;
                                }
                                else {
                                    IGSTPER = existReq[g].IGSTTaxPercentage;
                                }

                                IGSTAMT = ((Number(AfterDisAmt_WithGstApplicable) * Number(IGSTPER)) / 100);
                                TotalAmount = Number(IGSTAMT) + Number(AfterDisAmt_WithGstApplicable);
                            }
                            existReq[g].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
                            existReq[g].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
                            existReq[g].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
                            existReq[g].TotalAmount = parseFloat(Number(TotalAmount)).toFixed(2);
                            existReq[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);
                        }
                    }

                    ChargesGrid[c].ChargesAmount = parseFloat(Number(OtherAmt)).toFixed(2);
                }
                else {
                    if (existReq.length > 0) {
                        for (g = 0; g < existReq.length; g++) {
                            AfterDisAmt_WithGstApplicable = 0;
                            AfterDisAmt_WithGstApplicable = Number(document.getElementById("TxtAfterDisAmt").value);

                            existReq[g].TaxableAmount = parseFloat(Number(AfterDisAmt_WithGstApplicable)).toFixed(2);
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

    for (var u = 0; u < AdditionalChargesGrid._options.dataSource.length; u++) {
        for (t = 0; t < ChargesGrid.length; t++) {
            if (ChargesGrid[t].LedgerID === AdditionalChargesGrid._options.dataSource[u].LedgerID) {
                AdditionalChargesGrid._options.dataSource[u].ChargesAmount = ChargesGrid[t].ChargesAmount;
                break;
            }
        }
    }
    AdditionalChargesGrid.refresh();
}

function CalculateAmount() {
    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
    var CreatePOGrid_RowCount = CreatePOGrid._options.dataSource.length;
    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    AdditionalChargesGrid.refresh();
    var Charge_RowCount = ChargesGrid.length;
    var t = 0;
    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;
    var NewAfterDisAmt = 0;
    if (CreatePOGrid_RowCount > 0) {
        for (t = 0; t < CreatePOGrid_RowCount; t++) {
            CreatePOGrid._options.dataSource[t].TaxableAmount = existReq[t].AfterDisAmt;
            NewAfterDisAmt = Number(NewAfterDisAmt) + Number(existReq[t].AfterDisAmt);
        }
    }

    document.getElementById("TxtAfterDisAmt").value = NewAfterDisAmt;
    BasicAmt = 0; IGSTPER = 0; SGSTPER = 0; CGSTPER = 0;
    TaxAbleAmt = 0; IGSTAMT = 0; SGSTAMT = 0; CGSTAMT = 0; TotalAmount = 0;

    var AfterDisAmt_WithGstApplicable = 0;
    var GridTaxType = "";
    var TaxRatePer = 0;
    var afterDisAmt = 0;
    var GSTLedgerType = "";
    var CalculateON = "Value";
    var taxAmt = 0;
    //var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    //var AdditionalChargesGrid_RowCount = AdditionalChargesGrid.totalCount();
    //For j = 2 To VS_Material.rows - 1
    for (t = 0; t < CreatePOGrid_RowCount; t++) {
        TaxAbleAmt = 0;
        afterDisAmt = 0;
        existReq[t].TaxableAmount = existReq[t].AfterDisAmt;
        afterDisAmt = existReq[t].AfterDisAmt;
        //TaxAbleAmt = Number(CreatePOGrid._options.dataSource[t].AfterDisAmt);
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
                    if ((ChargesGrid[m].InAmount === false || ChargesGrid[m].InAmount === "0" || ChargesGrid[m].InAmount === 0 || ChargesGrid[m].InAmount === "false")) {
                        ChargesGrid[m].ChargesAmount = ((Number(document.getElementById("TxtAfterDisAmt").value) * TaxRatePer) / 100).toFixed(2);
                    }
                }
                if (CalculateON.toUpperCase().trim() === "VALUE" && (ChargesGrid[m].GSTApplicable === true || ChargesGrid[m].GSTApplicable === "1" || ChargesGrid[m].GSTApplicable === 1 || ChargesGrid[m].GSTApplicable === "true")) {
                    TaxAbleAmt = Number(TaxAbleAmt) + (Number(ChargesGrid[m].ChargesAmount) / Number(document.getElementById("TxtAfterDisAmt").value) * Number(existReq[t].AfterDisAmt)).toFixed(2);
                } else if (CalculateON.toUpperCase().trim() === "QUANTITY" && (ChargesGrid[m].GSTApplicable === true || ChargesGrid[m].GSTApplicable === "1" || ChargesGrid[m].GSTApplicable === 1 || ChargesGrid[m].GSTApplicable === "true")) {
                    TaxAbleAmt = Number(TaxAbleAmt) + (Number(ChargesGrid[m].ChargesAmount) / Number(document.getElementById("TxtTotalQty").value) * Number(existReq[t].PurchaseQuantity)).toFixed(2);
                }

            }
        }
        existReq[t].TaxableAmount = (Number(existReq[t].AfterDisAmt) + Number(TaxAbleAmt)).toFixed(2);
        TaxAbleAmt = Number(existReq[t].TaxableAmount);
        if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
            if (existReq[t].CGSTTaxPercentage === "" || existReq[t].CGSTTaxPercentage === undefined || existReq[t].CGSTTaxPercentage === null || existReq[t].CGSTTaxPercentage === "NULL") {
                CGSTPER = 0;
            }
            else {
                CGSTPER = existReq[t].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
            }
            if (existReq[t].SGSTTaxPercentage === "" || existReq[t].SGSTTaxPercentage === undefined || existReq[t].SGSTTaxPercentage === null || existReq[t].SGSTTaxPercentage === "NULL") {
                SGSTPER = 0;
            }
            else {
                SGSTPER = existReq[t].SGSTTaxPercentage;
            }
            SGSTAMT = ((Number(TaxAbleAmt) * Number(SGSTPER)) / 100);
            CGSTAMT = ((Number(TaxAbleAmt) * Number(CGSTPER)) / 100);
            TotalAmount = Number(SGSTAMT) + Number(CGSTAMT) + Number(afterDisAmt);
        }
        else {
            if (existReq[t].IGSTTaxPercentage === "" || existReq[t].IGSTTaxPercentage === undefined || existReq[t].IGSTTaxPercentage === null || existReq[t].IGSTTaxPercentage === "NULL") {
                IGSTPER = 0;
            }
            else {
                IGSTPER = existReq[t].IGSTTaxPercentage;
            }

            IGSTAMT = Number((Number(TaxAbleAmt) * Number(IGSTPER)) / 100);
            TotalAmount = Number(IGSTAMT) + Number(afterDisAmt);
        }
        existReq[t].TotalAmount = parseFloat(Number(TotalAmount)).toFixed(2);
        existReq[t].CGSTAmt = parseFloat(Number(CGSTAMT)).toFixed(2);
        existReq[t].SGSTAmt = parseFloat(Number(SGSTAMT)).toFixed(2);
        existReq[t].IGSTAmt = parseFloat(Number(IGSTAMT)).toFixed(2);
    }

    for (t = 0; t < Charge_RowCount; t++) {
        GridTaxType = ChargesGrid[t].TaxType;
        TaxRatePer = ChargesGrid[t].TaxRatePer;
        GSTLedgerType = ChargesGrid[t].GSTLedgerType;
        CalculateON = ChargesGrid[t].CalculateON;
        taxAmt = 0;
        var FilterAmt = 0;
        if (GridTaxType === "GST") {

            if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "CENTRAL TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (var gc = 0; gc < CreatePOGrid_RowCount; gc++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === existReq[gc].CGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[gc].CGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(existReq[gc].CGSTAmt);
                        }

                    }
                }
                // taxAmt = FilterAmt * TaxRatePer;
                taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
            }
            else if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "STATE TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (var gs = 0; gs < CreatePOGrid_RowCount; gs++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === existReq[gs].SGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[gs].SGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(existReq[gs].SGSTAmt);
                        }
                    }
                }
                //taxAmt = FilterAmt * TaxRatePer;
                taxAmt = parseFloat(Number(FilterAmt)).toFixed(2);
            }
            else if (GridTaxType === "GST" && GSTLedgerType.toUpperCase().trim() === "INTEGRATED TAX") {
                if (CreatePOGrid_RowCount > 0) {
                    for (var gi = 0; gi < CreatePOGrid_RowCount; gi++) {
                        if (Number(TaxRatePer) > 0) {
                            if (TaxRatePer === existReq[gi].IGSTTaxPercentage) {
                                FilterAmt = FilterAmt + Number(existReq[gi].IGSTAmt);
                            }
                        } else {
                            FilterAmt = FilterAmt + Number(existReq[gi].IGSTAmt);
                        }
                    }
                }
                // taxAmt = FilterAmt * TaxRatePer;
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

    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
    var CreatePOGrid_RowCount = CreatePOGrid.totalCount();

    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var Charge_RowCount = AdditionalChargesGrid.totalCount();

    var LblSupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;

    if (CreatePOGrid_RowCount > 0) {
        for (var t = 0; t < CreatePOGrid_RowCount; t++) {
            CreatePOGrid._options.dataSource[t].TaxableAmount = existReq[t].AfterDisAmt;
        }
    }

    if (existReq.length > 0) {

        for (var zz = 0; zz < existReq.length; zz++) {
            var CreatePOGridRow = zz;

            var PurchaseRate = existReq[CreatePOGridRow].PurchaseRate;
            var Qty = existReq[CreatePOGridRow].PurchaseQuantity;
            var DisPercentage = existReq[CreatePOGridRow].Disc;

            //var ddlSupplierId = $('#SupplierName').dxSelectBox('instance').option('value');
            //if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
            //    PurchaseRate = PurchaseRate;
            //}
            //else {
            //    ObjItemRate = [];
            //    ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
            //        return el.LedgerID === ddlSupplierId &&
            //        el.ItemID === existReq[CreatePOGridRow].ItemID;
            //    });
            //    if (ObjItemRate === [] || ObjItemRate === "" || ObjItemRate === undefined) {
            //        PurchaseRate = PurchaseRate;
            //    } else {
            //        PurchaseRate = ObjItemRate[0].PurchaseRate;
            //    }
            //}

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

            if (Number(LblSupplierStateTin) === Number(GblCompanyStateTin)) {
                if (existReq[CreatePOGridRow].CGSTTaxPercentage === "" || existReq[CreatePOGridRow].CGSTTaxPercentage === undefined || existReq[CreatePOGridRow].CGSTTaxPercentage === null || existReq[CreatePOGridRow].CGSTTaxPercentage === "NULL") {
                    CGSTPER = 0;
                }
                else {
                    CGSTPER = existReq[CreatePOGridRow].CGSTTaxPercentage;// newArray[0].CGSTTaxPercentage;
                }
                if (existReq[CreatePOGridRow].SGSTTaxPercentage === "" || existReq[CreatePOGridRow].SGSTTaxPercentage === undefined || existReq[CreatePOGridRow].SGSTTaxPercentage === null || existReq[CreatePOGridRow].SGSTTaxPercentage === "NULL") {
                    SGSTPER = 0;
                }
                else {
                    SGSTPER = existReq[CreatePOGridRow].SGSTTaxPercentage;
                }
                SGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(SGSTPER)) / 100)).toFixed(2);
                CGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(CGSTPER)) / 100)).toFixed(2);
                //Cal Corection
                IGSTAMT = 0;
                TotalAmount = parseFloat(Number(SGSTAMT) + Number(CGSTAMT) + Number(afterDiscountAmt)).toFixed(2);
            }
            else {
                if (existReq[CreatePOGridRow].IGSTTaxPercentage === "" || existReq[CreatePOGridRow].IGSTTaxPercentage === undefined || existReq[CreatePOGridRow].IGSTTaxPercentage === null || existReq[CreatePOGridRow].IGSTTaxPercentage === "NULL") {
                    IGSTPER = 0;
                }
                else {
                    IGSTPER = existReq[CreatePOGridRow].IGSTTaxPercentage;
                }
                //Cal Corection
                SGSTAMT = 0;
                CGSTAMT = 0;
                IGSTAMT = parseFloat(((Number(TaxAbleAmt) * Number(IGSTPER)) / 100)).toFixed(2);
                TotalAmount = parseFloat(Number(IGSTAMT) + Number(afterDiscountAmt)).toFixed(2);
            }

            existReq[CreatePOGridRow].BasicAmount = BasicAmt;
            existReq[CreatePOGridRow].AfterDisAmt = parseFloat(afterDiscountAmt).toFixed(2);
            existReq[CreatePOGridRow].TaxableAmount = TaxAbleAmt;
            existReq[CreatePOGridRow].CGSTAmt = CGSTAMT;
            existReq[CreatePOGridRow].SGSTAmt = SGSTAMT;
            existReq[CreatePOGridRow].IGSTAmt = IGSTAMT;
            existReq[CreatePOGridRow].TotalAmount = TotalAmount;
            existReq[CreatePOGridRow].PurchaseRate = PurchaseRate;

            //CreatePOGrid.refresh();
        }
        // GridColumnCal();
    }

}

function GridColumnCal() {
    // var AddCHGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
    var dataGrid = $('#CreatePOGrid').dxDataGrid('instance');
    var gridColBasicAmt = 0;
    var gridColTotalAmt = 0;
    var gridColCGSTAmt = 0;
    var gridColSGSTAmt = 0;
    var gridColIGSTAmt = 0;
    var gridAfterDisAmt = 0;
    var gridTaxAbleSum = 0;
    var gridColTotalQty = 0;
    var gridColTotalTax = 0;

    if (ChargesGrid.length > 0) {//Edit By Pradeep Yadav 06 sept 2019 
        TotalGstAmt = 0;
        for (var CH = 0; CH < ChargesGrid.length; CH++) {
            gridColTotalTax = parseFloat(Number(gridColTotalTax) + Number(ChargesGrid[CH].ChargesAmount)).toFixed(2);
            if (ChargesGrid[CH].TaxType === "GST") {
                var Chamt = 0;
                if (ChargesGrid[CH].ChargesAmount === undefined || ChargesGrid[CH].ChargesAmount === "undefined" || ChargesGrid[CH].ChargesAmount === "" || ChargesGrid[CH].ChargesAmount === "undefined" || ChargesGrid[CH].ChargesAmount === "null") {
                    Chamt = 0;
                }
                else {
                    Chamt = ChargesGrid[CH].ChargesAmount;
                }
                TotalGstAmt = Number(TotalGstAmt) + Number(Chamt);  //Edit By Pradeep Yadav  06 sept 2019
            }
        }
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
    }


    document.getElementById("TxtBasicAmt").value = gridColBasicAmt;
    document.getElementById("TxtNetAmt").value = (Number(gridAfterDisAmt) + Number(gridColTotalTax)).toFixed(2);

    document.getElementById("TxtTotalQty").value = gridColTotalQty;

    document.getElementById("TxtCGSTAmt").value = gridColCGSTAmt;
    document.getElementById("TxtSGSTAmt").value = gridColSGSTAmt;
    document.getElementById("TxtIGSTAmt").value = gridColIGSTAmt;

    document.getElementById("TxtAfterDisAmt").value = gridAfterDisAmt;
    document.getElementById("Txt_TaxAbleSum").value = gridTaxAbleSum;

    document.getElementById("TxtTaxAmt").value = parseFloat(Number(gridColTotalTax)).toFixed(2);

    document.getElementById("TxtGstamt").value = parseFloat(Number(TotalGstAmt)).toFixed(2);  //Edit By Pradeep Yadav 06 sept 2019
    document.getElementById("TxtOtheramt").value = parseFloat(Number(gridColTotalTax) - Number(TotalGstAmt)).toFixed(2); //Edit By Pradeep Yadav 06 sept 2019
}

$("#BtnRefreshList").click(function () {
    OverFlowGrid();
});

$("#BtnCreateNewItem").click(function () {
    window.open('masters.aspx', "_newtab");
});

$("#BtnopenPop").click(function () {
    Groupdata = "";
    var grid = $('#OverFlowGrid').dxDataGrid('instance');
    grid.clearSelection();

    var SelSupplierName = $('#SupplierName').dxSelectBox('instance').option('value');
    if (SelSupplierName !== "" && SelSupplierName !== null) {
        OverFlowGrid();
    }

    document.getElementById("BtnopenPop").setAttribute("data-toggle", "modal");
    document.getElementById("BtnopenPop").setAttribute("data-target", "#largeModalOverFlow");
});

$("#OverFlowGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    selection: { mode: "multiple", showCheckBoxesMode: "always" },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
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
        Groupdata = selectedItems.selectedRowsData;
        try {
            if (selectedItems.currentSelectedRowKeys.length > 0) {
                var dataGrid = $('#CreatePOGrid').dxDataGrid('instance');
                if (dataGrid._options.dataSource.length > 0) {
                    for (var k = 0; k < dataGrid._options.dataSource.length; k++) {
                        var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                        //if (clickedCell.data.ItemID === cellvalItemID) {
                        if (selectedItems.currentSelectedRowKeys[0].ItemID === cellvalItemID) {
                            DevExpress.ui.notify("This item is already added,Please add another item..!", "warning", 1500);
                            selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                            selectedItems.currentSelectedRowKeys = [];
                            return false;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    columns: [
        { dataField: "ItemID", visible: false, caption: "Item ID", width: 100 },
        { dataField: "ItemGroupID", visible: false, caption: "Item Group ID", width: 100 },
        { dataField: "ItemGroupNameID", visible: false, caption: "Item Group Name ID", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 400 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 500 },
        { dataField: "BookedStock", visible: true, caption: "Total Booked", width: 150 },
        { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 150 },
        { dataField: "PhysicalStock", visible: true, caption: "Current Stock", width: 120 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "HSNCode", visible: true, caption: "HSN Code", width: 100 },
        { dataField: "ProductHSNName", visible: true, caption: "HSN Name", width: 200 },
        { dataField: "GSTTaxPercentage", visible: false, caption: "GSTTaxPercentage", width: 100 },
        { dataField: "CGSTTaxPercentage", visible: false, caption: "CGSTTaxPercentage", width: 100 },
        { dataField: "SGSTTaxPercentage", visible: false, caption: "SGSTTaxPercentage", width: 100 },
        { dataField: "IGSTTaxPercentage", visible: false, caption: "IGSTTaxPercentage", width: 100 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 100 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 100 },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 100 },
        { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 100 },
        { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula", width: 100 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 100 }]
});

OverFlowGrid();
function OverFlowGrid() {
    var SelSupplierName = $('#SupplierName').dxSelectBox('instance').option('value');

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    if (SelSupplierName === "" || SelSupplierName === undefined || SelSupplierName === null) {
        SelSupplierName = "";
    }
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/GetOverFlowGrid",
        data: '{SelSupplierName:' + JSON.stringify(SelSupplierName) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            var GetOverFlowGrid = JSON.parse(res);

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#OverFlowGrid").dxDataGrid({
                dataSource: GetOverFlowGrid
            });
        }
    });
}

$("#BtnNext").click(function () {
    var dataGrid = $('#CreatePOGrid').dxDataGrid('instance');
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    if (Groupdata.length > 0) {
        for (var i = 0; i < Groupdata.length; i++) {
            var found = false;
            for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                if (Groupdata[i].ItemID === cellvalItemID) {
                    // DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                    found = true;
                }
            }
            if (found === false) {
                //*****************
                var ddlSupplierId = $('#SupplierName').dxSelectBox('instance').option('value');
                var PORate = 0;
                if (ddlSupplierId === "" || ddlSupplierId === null || ddlSupplierId === undefined || ddlSupplierId === "NULL") {
                    PORate = PORate;
                }
                else {
                    ObjItemRate = [];
                    ObjItemRate = ItemRateString.ItemRateObj.filter(function (el) {
                        return el.LedgerID === ddlSupplierId &&
                            el.ItemID === Groupdata[i].ItemID;
                    });
                    if (ObjItemRate === [] || ObjItemRate === "" || ObjItemRate === undefined) {
                        PORate = PORate;
                    } else {
                        PORate = ObjItemRate[0].PurchaseRate;
                    }
                }
                Groupdata[i].TransactionID = Number(document.getElementById("TxtPOID").value);
                Groupdata[i].TransID = 0;
                Groupdata[i].OrderUnit = Groupdata[i].StockUnit;
                Groupdata[i].PurchaseQty = 0;
                Groupdata[i].ExpectedDeliveryDate = "";
                Groupdata[i].ItemNarration = "";
                Groupdata[i].RequiredQuantity = 0;
                Groupdata[i].RequiredQuantityInPurchaseUnit = 0;

                Groupdata[i].VoucherID = "";
                Groupdata[i].MaxVoucherNo = "";
                Groupdata[i].VoucherNo = "";
                Groupdata[i].VoucherDate = "";
                Groupdata[i].PurchaseQuantity = 0;
                Groupdata[i].CreatedBy = "";
                Groupdata[i].Narration = "";
                Groupdata[i].FYear = "";
                Groupdata[i].PurchaseRate = PORate;
                Groupdata[i].Tolerance = 0;
                Groupdata[i].BasicAmount = 0;
                Groupdata[i].AfterDisAmt = 0;
                Groupdata[i].TaxableAmount = 0;
                Groupdata[i].CGSTAmt = 0;
                Groupdata[i].SGSTAmt = 0;
                Groupdata[i].IGSTAmt = 0;
                Groupdata[i].TotalAmount = 0;
                Groupdata[i].Disc = 0;
                Groupdata[i].RefJobBookingJobCardContentsID = "";
                Groupdata[i].RefJobCardContentNo = "";
                //Groupdata[i].PurchaseUnit = "";
                //Groupdata[i].ProductHSNName = Groupdata[i].ProductHSNName;
                //Groupdata[i].HSNCode = Groupdata[i].HSNCode;
                //Groupdata[i].GSTTaxPercentage = Groupdata[i].GSTTaxPercentage;
                //Groupdata[i].CGSTTaxPercentage = Groupdata[i].CGSTTaxPercentage;
                //Groupdata[i].SGSTTaxPercentage = Groupdata[i].SGSTTaxPercentage;
                //Groupdata[i].IGSTTaxPercentage = Groupdata[i].IGSTTaxPercentage;

                var clonedItem = $.extend({}, Groupdata[i]);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                //existReq.push(Groupdata[i]);
                dataGrid.refresh(true);
            }
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        DevExpress.ui.notify("Item added in purchase item list..!", "success", 1000);
        //clickedCell.component.clearFilter();

        document.getElementById("BtnNext").setAttribute("data-dismiss", "modal");
    }
    else {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        DevExpress.ui.notify("please choose minimum one row from above Grid..!", "error", 1000);
    }
});

$("#EditPOButton").click(function () {
    var TxtPOID = document.getElementById("TxtPOID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        alert("Please select any purchase order to edit or view !");
        return false;
    }
    document.getElementById("TxtAddPayTerms").value = "";
    $("#SelLnameChargesGrid").dxSelectBox({
        value: ''
    });
    if (VarItemApproved === "true" || VarItemApproved === true) {
        document.getElementById("POPrintButton").disabled = false;
    } else {
        document.getElementById("POPrintButton").disabled = true;
    }

    SubGridData = []; ChargesGrid = []; PaymentTermsGrid = []; ScheduleListOBJ = []; existReq = [];

    TotalGstAmt = 0; //Edit By Pradeep 06 sept 2019

    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

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
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
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
                        ProcessRetrive1.ItemDescription = ProcessRetrive[i].ItemDescription;
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
                //existReq = ProcessRetrive;

                //$.ajax({
                //    type: "POST",
                //    url: "WebService_PurchaseOrder.asmx/RetriveRequisitionDetail",
                //    data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
                //    contentType: "application/json; charset=utf-8",
                //    dataType: "text",
                //    success: function (results) {
                //        ////console.debug(results);
                //        var res = results.replace(/\\/g, '');
                //        res = res.replace(/"d":""/g, '');
                //        res = res.replace(/""/g, '');
                //        res = res.substr(1);
                //        res = res.slice(0, -1);
                //        var RetriveRequisition = JSON.parse(res);
                //        SubGridData = [];
                //        SubGridData = RetriveRequisition;

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
                        res = res.replace(/u0026/g, '&');
                        res = res.replace(/u0027/g, "'");
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
                        res = res.replace(/u0026/g, '&');
                        res = res.replace(/u0027/g, "'");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ProcessRetriveOverHead = JSON.parse(res);
                        var OtherHeadsGrid = $('#OtherHeadsGrid').dxDataGrid('instance');

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

                        fillOtherHeadsGrid(OtherHead);
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/RetrivePoCreateTaxChares",
                    data: '{transactionID:' + JSON.stringify(TxtPOID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        ////console.debug(results);
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, '&');
                        res = res.replace(/u0027/g, "'");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ProcessRetriveTaxCharges = JSON.parse(res);
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                        ChargesGrid = [];
                        ChargesGrid = ProcessRetriveTaxCharges;

                        FrmUpdateTotalGstAmt = 0;////Edit By Pradeep Yadav 06 sept 2019                         
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
                        }////Edit By Pradeep Yadav 06 sept 2019  

                        fillChargesGrid();

                        document.getElementById("TxtTaxAmt").value = parseFloat(Number(updateTotalTax)).toFixed(2);

                        document.getElementById("TxtGstamt").value = parseFloat(Number(FrmUpdateTotalGstAmt)).toFixed(2);  //Edit By Pradeep Yadav 06 sept 2019
                        document.getElementById("TxtOtheramt").value = parseFloat(Number(updateTotalTax) - Number(FrmUpdateTotalGstAmt)).toFixed(2); //Edit By Pradeep Yadav 06 sept 2019

                        var gridAfterDisAmt = parseFloat(Number(document.getElementById("TxtAfterDisAmt").value)).toFixed(2);
                        var gridColTotalTax = parseFloat(Number(document.getElementById("TxtTaxAmt").value)).toFixed(2);
                        document.getElementById("TxtNetAmt").value = (Number(gridAfterDisAmt) + Number(gridColTotalTax)).toFixed(2);

                    }
                });


                ShowCreatePOGrid();
                fillPayTermsGrid();
                //    }
                //});
                //    }
                //});
            }
        }
    });

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = false;
    GblStatus = "Update";

    document.getElementById("EditPOButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditPOButton").setAttribute("data-target", "#largeModal");
});

$("#DeletePOButton").click(function () {
    var TxtPOID = document.getElementById("TxtPOID").value;
    if (TxtPOID === "" || TxtPOID === null || TxtPOID === undefined) {
        alert("Please select any purchase order to delete..!");
        return false;
    }

    swal({
        title: "Are you sure to delete this transaction..?",
        text: 'You will not be able to recover this transaction..!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_PurchaseOrder.asmx/DeletePaperPurchaseOrder",
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
                    var Title, Text, Type;
                    if (res === "Success") {
                        Text = "Your data deleted successfully..";
                        Title = "Deleted...";
                        Type = "success";
                    } else if (res.includes("not authorized")) {
                        Title = "Not Deleted..!";
                        Text = res;
                        Type = "warning";
                    } else {
                        Title = "Error..!";
                        Text = res;
                        Type = "error";
                    }
                    swal(Title, Text, Type);
                    if (Type === "success") location.reload();
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });

        });

});

$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeletePOButton").click();
});

$("#BtnSaveAS").click(function () {
    GblStatus = "Save";
    if (GblStatus === "Save") {
        $("#BtnSave").click();
    }
});

$("#reloadDisplayNone").click(function () {
    document.getElementById("reloadDisplayNone").setAttribute("data-dismiss", "modal");
});

//Schedule...
$("#SelDelDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#BtnScheduleAdd").click(function () {
    var dataGrid = $('#CreatePOGrid').dxDataGrid('instance');
    var CompItemID = document.getElementById("SchItemIDLbl").innerHtml;
    var CompQty = Number(document.getElementById("SchQtyLbl").innerHtml);
    var CompDate = document.getElementById("SchItemIDLbl").innerHtml;
    var CompStocUnit = document.getElementById("TxtUnitSch").value;
    var CompItemCode = document.getElementById("SchItemCodeLbl").innerHtml;

    var expDate = $('#SelDelDate').dxDateBox('instance').option('value');
    var QtySlot = Number(document.getElementById("TxtQtySch").value);

    if (QtySlot === "") {
        document.getElementById("TxtQtySch").focus();
        DevExpress.ui.notify("Please eneter Quantity..!", "error", 1000);
        return false;
    }
    if (isNaN(QtySlot)) {
        document.getElementById("TxtQtySch").focus();
        DevExpress.ui.notify("Please eneter only numeric value..!", "error", 1000);
        return false;
    }

    var MakeNewArray = "";

    var AllotedQty = 0;
    var optSch = {};
    if (ScheduleListOBJ === [] || ScheduleListOBJ === "" || ScheduleListOBJ === undefined || ScheduleListOBJ === null) {
        if (QtySlot > CompQty) {
            DevExpress.ui.notify("Quantity should not be greater then Purchase Quantity..!", "error", 1000);
            return false;
        }
        else {
            optSch = {};
            optSch.id = 1;
            optSch.ItemID = CompItemID;
            optSch.ItemCode = CompItemCode;
            optSch.Quantity = QtySlot;
            optSch.PurchaseUnit = CompStocUnit;
            optSch.SchDate = expDate;

            ScheduleListOBJ.push(optSch);
            DistinctArray.push(optSch);
        }
    } else {
        var arr = [];
        for (var s = 0; s < ScheduleListOBJ.length; s++) {
            arr.push(ScheduleListOBJ[s].id);
        }
        var max = "";
        if (arr !== "" && arr !== []) {
            max = Math.max.apply(null, arr);
        }

        MakeNewArray = { 'ExistRec': ScheduleListOBJ };
        DistinctArray = MakeNewArray.ExistRec.filter(function (el) {
            return el.ItemID === CompItemID;
        });
        for (var x = 0; x < DistinctArray.length; x++) {
            AllotedQty = AllotedQty + Number(DistinctArray[x].Quantity);
        }

        var ttlQty = AllotedQty + QtySlot;

        var IncludeString = JSON.stringify(DistinctArray);
        var confirmInclude = IncludeString.includes(expDate);

        if (Number(ttlQty) > CompQty) {
            DevExpress.ui.notify("Quantity should not be greater then Purchase Quantity..!", "error", 1000);
            return false;
        }
        else if (confirmInclude === true) {
            DevExpress.ui.notify("This date alrady Booked to another delivery..! Please Choose another Date...", "error", 1000);
            return false;
        }
        else {
            optSch = {};
            optSch.id = max + 1;
            optSch.ItemID = CompItemID;
            optSch.ItemCode = CompItemCode;
            optSch.Quantity = QtySlot;
            optSch.PurchaseUnit = CompStocUnit;
            optSch.SchDate = expDate;

            DistinctArray.push(optSch);
            ScheduleListOBJ.push(optSch);
        }
    }

    document.getElementById("TxtQtySch").value = "";

    //$("#ScheduleGrid").dxDataGrid({
    //    dataSource: DistinctArray,
    //});
    fillGridSchedule(DistinctArray);
    //document.getElementById("SchQtyLbl").innerHtml = dataGrid._options.dataSource[GetRow].PurchaseQuantity;
    //document.getElementById("SchStockUnitLbl").innerHtml = dataGrid._options.dataSource[GetRow].StockUnit;
    //document.getElementById("SchDelDateLbl").innerHtml = dataGrid._options.dataSource[GetRow].ExpectedDeliveryDate;
    //document.getElementById("SchItemIDLbl").innerHtml = dataGrid._options.dataSource[GetRow].ItemID;

});

//fillGridSchedule();
function fillGridSchedule(DistinctArray) {
    $("#ScheduleGrid").dxDataGrid({
        dataSource: DistinctArray,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        sorting: {
            mode: "none" // or "multiple" | "single"
        },
        filterRow: { visible: false, applyFilter: "auto" },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        editing: {
            mode: "cell",
            allowDeleting: true
            //allowAdding: true,
            // allowUpdating: true
        },
        onRowRemoving: function (e) {
            RemID = "";
            RemID = e.data.id;
        },
        onRowRemoved: function (e) {
            ScheduleListOBJ = ScheduleListOBJ.filter(function (obj) {
                return obj.id !== RemID;
            });
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        columns: [{ dataField: "id", visible: false, caption: "Seq.No" },
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code" },
        { dataField: "Quantity", visible: true, caption: "Quantity" },
        { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit" },
        { dataField: "SchDate", visible: true, caption: "Schedule Date", dataType: "date", format: "dd-MMM-yyyy" }
        ]
    });
}

//Additional Charges

var CalculateOnLookup = [{ "ID": 1, "Name": "Value" }, { "ID": 2, "Name": "Quantity" }];

fillChargesGrid();

var CHRow = "", CHCol = "";
var Var_ChargeHead = "";
var ObjChargeHead = [];

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
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
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
                //onValueChanged: function (data) {
                //    if (document.getElementById("TxtAfterDisAmt").value === 0) {
                //        $("#SelLnameChargesGrid").dxSelectBox({
                //            value: '',
                //        });
                //        DevExpress.ui.notify("Please enter Purchase rate in above grid before add charges..!", "error", 1000);
                //        window.setTimeout(function () { e.component.cancelEditData(); }, 0)
                //    } else {
                //        var optCH = {};
                //        var ChooseText = $("#SelLnameChargesGrid").dxSelectBox('instance').option('text');
                //        if (ChooseText !== "" && ChooseText !== undefined && ChooseText !== null) {
                //            ObjChargeHead = Var_ChargeHead.LedgerDetail.filter(function (el) {
                //                return el.LedgerID === data.value;
                //            });
                //            optCH.LedgerName = ChooseText;
                //            optCH.LedgerID = ObjChargeHead[0].LedgerID;
                //            var gstapl = ObjChargeHead[0].GSTApplicable;
                //            if (gstapl === "False" || gstapl === false) {
                //                gstapl = false;
                //            }
                //            else if (gstapl === "True" || gstapl === true) {
                //                gstapl = true
                //            }
                //            optCH.GSTApplicable = gstapl;
                //            optCH.TaxType = ObjChargeHead[0].TaxType;
                //            optCH.GSTLedgerType = ObjChargeHead[0].GSTLedgerType;
                //            optCH.CalculateON = ObjChargeHead[0].GSTCalculationOn;
                //            optCH.TaxRatePer = ObjChargeHead[0].TaxPercentage;
                //            ChargesGrid.push(optCH);


                //            $("#AdditionalChargesGrid").dxDataGrid({
                //                dataSource: ChargesGrid,
                //            });                            

                //            AddItemCalculation();
                //            GridColumnCal();
                //            AddItemWithChargessGrid();
                //            var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
                //            CreatePOGrid.refresh();
                //            var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                //            AdditionalChargesGrid.refresh();
                //        }
                //    }
                //},

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
                    //ChargesGrid = ChargesGrid.filter(function (obj) {
                    //    return obj.LedgerID !== e.data.LedgerID;

                    //if (ChargesGrid.length > 0) {
                    //    AddItemWithChargessGrid();
                    //} else {
                    //    AddItemCalculation();
                    //}

                    AddItemCalculation();
                    GridColumnCal();
                    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
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

                    //AddItemWithChargessGrid();
                    CalculateAmount();
                    //});
                },
                onRowUpdated: function (CHGRID) {
                    AddItemCalculation();
                    GridColumnCal();
                    //AddItemWithChargessGrid();
                    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
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

                    //AddItemWithChargessGrid();
                    CalculateAmount();
                },
                //onCellPrepared: function (CHGRID) {
                //    var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                //    if (CHGRID.rowType === undefined || CHGRID.rowType === "header" || CHGRID.rowType !== "data") return false;

                //    if (CHGRID.columnIndex === 7 && CHGRID.data.TaxType !== "" && CHGRID.data.TaxType !== undefined && CHGRID.data.TaxType !== null) {

                //        AddItemCalculation();
                //        GridColumnCal();
                //        AddItemWithChargessGrid();
                //        var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
                //        CreatePOGrid.refresh();
                //        var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
                //        AdditionalChargesGrid.refresh();
                //    }

                //},
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

//Terms Of Payment
//fillPayTermsGrid();
function fillPayTermsGrid() {
    var string = PaymentTermsString;
    var TermsID = 0;
    if (string !== "" && string !== null) {
        PaymentTermsGrid = [];
        string = string.split(",");
        for (var str in string) {
            optTerms = {};
            TermsID = TermsID + 1;
            optTerms.TermsID = TermsID;
            optTerms.Terms = string[str];

            PaymentTermsGrid.push(optTerms);
        }
    }

    $("#PaymentTermsGrid").dxDataGrid({
        dataSource: PaymentTermsGrid,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        sorting: {
            mode: "none" // or "multiple" | "single"
        },
        //filterRow: { visible: true, applyFilter: "auto" },
        //  selection: { mode: "multiple", showCheckBoxesMode: "always" },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
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
        columns: [{ dataField: "TermsID", visible: false, caption: "TermsID" },
        { dataField: "Terms", visible: true, caption: "Terms" }
        ]
    });
}

//OtherHeads
HeadFun();
function HeadFun() {
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseOrder.asmx/HeadFun",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/,}/g, ",null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            OtherHead = JSON.parse(res);

            fillOtherHeadsGrid(OtherHead);
        }
    });
}

$("#BtnOtherHeadPop").click(function () {
    document.getElementById("BtnOtherHeadPop").setAttribute("data-toggle", "modal");
    document.getElementById("BtnOtherHeadPop").setAttribute("data-target", "#largeModalHeads");
});

function fillOtherHeadsGrid(OtherHead) {
    $("#OtherHeadsGrid").dxDataGrid({
        dataSource: OtherHead,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        filterRow: { visible: true, applyFilter: "auto" },
        height: function () {
            return window.innerHeight / 1.3;
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
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.visibleIndex === 0 || e.column.visibleIndex === 1 || e.column.visibleIndex === 3 || e.column.visibleIndex === 6) {
                e.cancel = true;
            }
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
}

$("#BtnSave").click(function () {
    var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
    var CreatePOGridRow = CreatePOGrid.totalCount();

    var VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
    var SupplierName = $('#SupplierName').dxSelectBox('instance').option('value');
    var SelPOApprovalBy = $('#SelPOApprovalBy').dxSelectBox('instance').option('value');

    if (GblStatus === "Update") {
        if (VarItemApproved === "true" || VarItemApproved === true) {
            DevExpress.ui.notify("This purchase order has been used in further transactions, Can't edit !", "error", 1000);
            return false;
        }
    }

    if (SupplierName === "" || SupplierName === undefined || SupplierName === null) {
        //swal("Error!", "Please Choose Supplier Name..", "");
        DevExpress.ui.notify("Please Choose Supplier Name..!", "error", 1000);
        document.getElementById("ValStrSupplierName").style.fontSize = "10px";
        document.getElementById("ValStrSupplierName").style.display = "block";
        document.getElementById("ValStrSupplierName").innerHTML = 'This field should not be empty..Supplier Name';
        return false;
    }
    else {
        document.getElementById("ValStrSupplierName").style.display = "none";
    }

    var ContactPersonName = $('#ContactPersonName').dxSelectBox('instance').option('value');

    var PurchaseDivision = $('#PurchaseDivision').dxSelectBox('instance').option('value');

    var LblState = document.getElementById("LblState").innerHTML.replace(/State : /g, '');
    var LblCountry = document.getElementById("LblCountry").innerHTML.replace(/Country : /g, '');

    var PORefernce = document.getElementById("PORefernce").value.trim();

    var DealerName = $('#DealerName').dxSelectBox('instance').option('value');
    var ModeOfTransport = $('#ModeOfTransport').dxSelectBox('instance').option('value');

    var textDeliverAt = document.getElementById("textDeliverAt").value.trim();
    //var textNaretion = document.getElementById("textNaretion").value.trim();

    var TxtTaxAmt = document.getElementById("TxtTaxAmt").value;
    var TxtNetAmt = document.getElementById("TxtNetAmt").value;
    var TxtBasicAmt = document.getElementById("TxtBasicAmt").value;
    var TxtCGSTAmt = document.getElementById("TxtCGSTAmt").value;
    var TxtSGSTAmt = document.getElementById("TxtSGSTAmt").value;
    var TxtIGSTAmt = document.getElementById("TxtIGSTAmt").value;
    var TxtAfterDisAmt = document.getElementById("TxtAfterDisAmt").value;
    var Txt_TaxAbleSum = document.getElementById("Txt_TaxAbleSum").value;
    var TxtTotalQty = document.getElementById("TxtTotalQty").value;

    //if (ContactPersonName === "" || ContactPersonName === undefined || ContactPersonName === null) {
    //    //swal("Error!", "Please Choose Cont.Person..", "");
    //    DevExpress.ui.notify("Please Choose Cont.Person..!", "error", 1000);
    //    document.getElementById("ValStrContactPersonName").style.fontSize = "10px";
    //    document.getElementById("ValStrContactPersonName").style.display = "block";
    //    document.getElementById("ValStrContactPersonName").innerHTML = 'This field should not be empty..Cont.Person';
    //    return false;
    //}
    //else {
    //    document.getElementById("ValStrContactPersonName").style.display = "none";
    //}

    if (PurchaseDivision === "" || PurchaseDivision === undefined || PurchaseDivision === null) {
        //swal("Error!", "Please Choose Supplier Name..", "");
        DevExpress.ui.notify("Please Choose Purchase Division..!", "error", 1000);
        document.getElementById("ValStrPurchaseDivision").style.fontSize = "10px";
        document.getElementById("ValStrPurchaseDivision").style.display = "block";
        document.getElementById("ValStrPurchaseDivision").innerHTML = 'This field should not be empty..Purchase Division';
        return false;
    }
    else {
        document.getElementById("ValStrPurchaseDivision").style.display = "none";
    }

    if (CreatePOGridRow < 1) {
        //swal("Error!", "Please add Item in given below Grid..", "");
        DevExpress.ui.notify("Please add Item in given below Grid..!", "error", 1000);
        return false;
    }

    for (var x = 0; x < CreatePOGridRow; x++) {
        if (Number(CreatePOGrid._options.dataSource[x].ItemID) <= 0) {
            DevExpress.ui.notify("Please select valid item from requisition or master list..!", "error", 1000);
            return false;
        } else if (Number(CreatePOGrid._options.dataSource[x].PurchaseQuantity) <= 0) {
            DevExpress.ui.notify("Please enter valid purchase order quantity..!", "error", 1000);
            return false;
        } else if (Number(CreatePOGrid._options.dataSource[x].PurchaseRate) <= 0) {
            DevExpress.ui.notify("Please enter valid purchase order rate..!", "error", 1000);
            return false;
        } else if (Number(CreatePOGrid._options.dataSource[x].TaxableAmount) <= 0) {
            DevExpress.ui.notify("Please enter valid purchase order quantity/rate..!", "error", 1000);
            return false;
        } else if (CreatePOGrid._options.dataSource[x].ExpectedDeliveryDate === "" || CreatePOGrid._options.dataSource[x].ExpectedDeliveryDate === null) {
            DevExpress.ui.notify("Please select expected delivery date..!", "error", 1000);
            return false;
        }
    }
    if (GblGSTApplicable === true) {

        if (ChargesGrid.length <= 0) {
            //swal("Error!", "Please add Item in given below Grid..", "");
            DevExpress.ui.notify("Please add tax ledger..!", "error", 1000);
            return false;
        }
        var results = $.grep(ChargesGrid, function (e) { return e.TaxType === "GST"; });
        if (results.length === 0) {
            DevExpress.ui.notify("Please add GST tax ledger..!", "error", 1000);
            return false;
        }
        var SupplierStateTin = document.getElementById("LblSupplierStateTin").innerHTML;
        results = 0;
        if (Number(SupplierStateTin) === Number(GblCompanyStateTin)) {
            //var GridTaxType = ChargesGrid[c].TaxType;
            //var TaxRatePer = ChargesGrid[c].TaxRatePer;
            //var GSTLedgerType = ChargesGrid[c].GSTLedgerType;
            results = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "Integrated Tax"; });
            if (results.length > 0) {
                DevExpress.ui.notify("You can't add integrated GST tax ledger..!", "error", 1000);
                return false;
            }
            results = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "Central Tax"; });
            if (results.length === 0) {
                DevExpress.ui.notify("Please add central GST tax ledger..!", "error", 1000);
                return false;
            } else {
                var results1 = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "State Tax"; });
                if (results1.length === 0) {
                    DevExpress.ui.notify("Please add state GST tax ledger..!", "error", 1000);
                    return false;
                }
            }
        } else {
            results = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "Central Tax"; });
            if (results.length > 0) {
                DevExpress.ui.notify("You can't add central GST tax ledger..!", "error", 1000);
                return false;
            }
            results = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "State Tax"; });
            if (results.length > 0) {
                DevExpress.ui.notify("You can't add state GST tax ledger..!", "error", 1000);
                return false;
            }
            results = $.grep(ChargesGrid, function (e) { return e.GSTLedgerType === "Integrated Tax"; });
            if (results.length === 0) {
                DevExpress.ui.notify("Please add integrated GST tax ledger..!", "error", 1000);
                return false;
            }
        }
    }
    //if (DealerName === "" || DealerName === undefined || DealerName === null) {
    //    //swal("Error!", "Please Choose Dealer Name..", "");
    //    DevExpress.ui.notify("Please Choose Dealer Name..!", "error", 1000);
    //    document.getElementById("ValStrDealerName").style.fontSize = "10px";
    //    document.getElementById("ValStrDealerName").style.display = "block";
    //    document.getElementById("ValStrDealerName").innerHTML = 'This field should not be empty..Dealer Name';
    //    return false;
    //}
    //else {
    //    document.getElementById("ValStrDealerName").style.display = "none";
    //}

    //if(document.getElementById("PORefernce").value==""||document.getElementById("PORefernce").value==undefined||document.getElementById("PORefernce").value==null){
    //    swal("Error!", "Please Enter PO Refernce..", "");
    //DevExpress.ui.notify("Please Enter PO Refernce..!", "error", 1000);
    //    document.getElementById("ValStrPORefernce").style.fontSize = "10px";
    //    document.getElementById("ValStrPORefernce").style.display = "block";
    //    document.getElementById("ValStrPORefernce").innerHTML = 'This field should not be empty..PO Refernce';
    //    return false;
    //}
    //else {
    //    document.getElementById("ValStrPORefernce").style.display = "none";
    //}

    if (ModeOfTransport === "" || ModeOfTransport === undefined || ModeOfTransport === null) {
        // swal("Error!", "Please Choose Mode Of Transport..", "");
        DevExpress.ui.notify("Please Choose Mode Of Transport..!", "error", 1000);
        document.getElementById("ValStrModeOfTransport").style.fontSize = "10px";
        document.getElementById("ValStrModeOfTransport").style.display = "block";
        document.getElementById("ValStrModeOfTransport").innerHTML = 'This field should not be empty..Mode Of Transport';
        return false;
    }
    else {
        document.getElementById("ValStrModeOfTransport").style.display = "none";
    }

    var TotalHeadAmt = 0;
    var termsofpayment = "";
    var PaymentTermsGrid = $('#PaymentTermsGrid').dxDataGrid('instance');
    var PaymentTermsGridRow = PaymentTermsGrid.totalCount();
    var CurrencyCode = $('#SelCurrencyCode').dxSelectBox('instance').option('value');
    if (CurrencyCode === null || CurrencyCode === "" || CurrencyCode === undefined) {
        CurrencyCode = "INR";
    }
    if (PaymentTermsGridRow > 0) {
        for (var tp = 0; tp < PaymentTermsGridRow; tp++) {
            if (termsofpayment === "") {
                termsofpayment = PaymentTermsGrid._options.dataSource[tp].Terms;
            } else {
                termsofpayment = termsofpayment + "," + PaymentTermsGrid._options.dataSource[tp].Terms;
            }
        }
    }

    var jsonObjectsRecordRequisition = [];
    var OperationRecordRequisition = {};

    if (SubGridData.length > 0) {
        for (var sb = 0; sb < SubGridData.length; sb++) {
            if (Number(SubGridData[sb].ItemID) > 0) {
                OperationRecordRequisition = {};
                OperationRecordRequisition.TransID = sb + 1;
                OperationRecordRequisition.ItemID = SubGridData[sb].ItemID;
                OperationRecordRequisition.RequisitionProcessQuantity = Number(SubGridData[sb].RequiredQuantity).toFixed(3);
                OperationRecordRequisition.StockUnit = SubGridData[sb].StockUnit;
                OperationRecordRequisition.RequisitionTransactionID = SubGridData[sb].TransactionID;

                jsonObjectsRecordRequisition.push(OperationRecordRequisition);
            }

        }
    }

    var OtherHeadsGrid = $('#OtherHeadsGrid').dxDataGrid('instance');
    var OtherHeadsGridRow = OtherHeadsGrid.totalCount();

    var jsonObjectsRecordOverHead = [];
    var OperationRecordOverHead = {};
    if (OtherHeadsGridRow > 0) {
        for (var h = 0; h < OtherHeadsGridRow; h++) {
            if (OtherHeadsGrid._options.dataSource[h].Sel === true || OtherHeadsGrid._options.dataSource[h].Sel === "on" || OtherHeadsGrid._options.dataSource[h].Sel === "true") {
                OperationRecordOverHead = {};

                OperationRecordOverHead.headID = OtherHeadsGrid._options.dataSource[h].HeadID;
                OperationRecordOverHead.TransID = h + 1;
                OperationRecordOverHead.headName = OtherHeadsGrid._options.dataSource[h].Head;
                OperationRecordOverHead.Quantity = Number(OtherHeadsGrid._options.dataSource[h].Weight).toFixed(3);
                OperationRecordOverHead.ChargesType = OtherHeadsGrid._options.dataSource[h].RateType;
                OperationRecordOverHead.Rate = Number(OtherHeadsGrid._options.dataSource[h].Rate).toFixed(4);
                OperationRecordOverHead.Amount = Number(OtherHeadsGrid._options.dataSource[h].HeadAmount).toFixed(2);
                TotalHeadAmt = Number(TotalHeadAmt) + Number(OtherHeadsGrid._options.dataSource[h].HeadAmount);
                TotalHeadAmt = Number(TotalHeadAmt).toFixed(2);

                jsonObjectsRecordOverHead.push(OperationRecordOverHead);
            }
        }
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    OperationRecordMain = {};
    //if (GblStatus === "Update") {
    //    OperationRecordMain.TransactionID = document.getElementById("TxtPOID").value;
    //}
    OperationRecordMain.VoucherID = -11;
    OperationRecordMain.VoucherDate = VoucherDate;
    OperationRecordMain.LedgerID = SupplierName;
    OperationRecordMain.ContactPersonID = ContactPersonName;
    OperationRecordMain.TotalQuantity = TxtTotalQty;
    OperationRecordMain.TotalBasicAmount = Number(TxtBasicAmt).toFixed(2);
    OperationRecordMain.TotalCGSTTaxAmount = Number(TxtCGSTAmt).toFixed(2);
    OperationRecordMain.TotalSGSTTaxAmount = Number(TxtSGSTAmt).toFixed(2);
    OperationRecordMain.TotalIGSTTaxAmount = Number(TxtIGSTAmt).toFixed(2);
    OperationRecordMain.TotalTaxAmount = Number(TxtTaxAmt).toFixed(2);
    OperationRecordMain.NetAmount = Number(TxtNetAmt).toFixed(2);
    OperationRecordMain.TotalOverheadAmount = Number(TotalHeadAmt).toFixed(2);
    OperationRecordMain.PurchaseDivision = PurchaseDivision;
    OperationRecordMain.PurchaseReferenceRemark = PORefernce;
    OperationRecordMain.DeliveryAddress = textDeliverAt;
    //OperationRecordMain.Narration = textNaretion;
    OperationRecordMain.TermsOfPayment = termsofpayment;
    OperationRecordMain.CurrencyCode = CurrencyCode;
    OperationRecordMain.ModeOfTransport = ModeOfTransport;
    OperationRecordMain.DealerID = DealerName;
    OperationRecordMain.VoucherApprovalByEmployeeID = SelPOApprovalBy;
    jsonObjectsRecordMain.push(OperationRecordMain);

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    if (CreatePOGridRow > 0) {
        for (var e = 0; e < CreatePOGridRow; e++) {
            OperationRecordDetail = {};

            OperationRecordDetail.ItemID = CreatePOGrid._options.dataSource[e].ItemID;
            OperationRecordDetail.TransID = e + 1;
            OperationRecordDetail.ItemGroupID = CreatePOGrid._options.dataSource[e].ItemGroupID;
            OperationRecordDetail.RequiredQuantity = Number(CreatePOGrid._options.dataSource[e].RequiredQuantity).toFixed(3);
            OperationRecordDetail.PurchaseOrderQuantity = Number(CreatePOGrid._options.dataSource[e].PurchaseQuantity).toFixed(2);
            OperationRecordDetail.ChallanWeight = Number(CreatePOGrid._options.dataSource[e].PurchaseQuantityInStockUnit).toFixed(2); //Added by pkp For print out 06052020
            OperationRecordDetail.PurchaseUnit = CreatePOGrid._options.dataSource[e].PurchaseUnit;
            OperationRecordDetail.StockUnit = CreatePOGrid._options.dataSource[e].StockUnit;
            OperationRecordDetail.PurchaseRate = Number(CreatePOGrid._options.dataSource[e].PurchaseRate).toFixed(4);
            OperationRecordDetail.PurchaseTolerance = CreatePOGrid._options.dataSource[e].Tolerance;
            OperationRecordDetail.GrossAmount = Number(CreatePOGrid._options.dataSource[e].BasicAmount).toFixed(2);
            OperationRecordDetail.DiscountPercentage = Number(CreatePOGrid._options.dataSource[e].Disc).toFixed(2);
            OperationRecordDetail.DiscountAmount = (Number(CreatePOGrid._options.dataSource[e].BasicAmount) - Number(CreatePOGrid._options.dataSource[e].AfterDisAmt)).toFixed(2);
            OperationRecordDetail.BasicAmount = Number(CreatePOGrid._options.dataSource[e].AfterDisAmt).toFixed(2);
            OperationRecordDetail.TaxableAmount = Number(CreatePOGrid._options.dataSource[e].TaxableAmount).toFixed(2);
            OperationRecordDetail.GSTPercentage = CreatePOGrid._options.dataSource[e].GSTTaxPercentage;
            OperationRecordDetail.CGSTPercentage = CreatePOGrid._options.dataSource[e].CGSTTaxPercentage;
            OperationRecordDetail.SGSTPercentage = CreatePOGrid._options.dataSource[e].SGSTTaxPercentage;
            OperationRecordDetail.IGSTPercentage = CreatePOGrid._options.dataSource[e].IGSTTaxPercentage;
            OperationRecordDetail.CGSTAmount = Number(CreatePOGrid._options.dataSource[e].CGSTAmt).toFixed(2);
            OperationRecordDetail.SGSTAmount = Number(CreatePOGrid._options.dataSource[e].SGSTAmt).toFixed(2);
            OperationRecordDetail.IGSTAmount = Number(CreatePOGrid._options.dataSource[e].IGSTAmt).toFixed(2);
            OperationRecordDetail.NetAmount = Number(CreatePOGrid._options.dataSource[e].TotalAmount).toFixed(2);
            OperationRecordDetail.ItemNarration = CreatePOGrid._options.dataSource[e].ItemNarration;
            OperationRecordDetail.ExpectedDeliveryDate = CreatePOGrid._options.dataSource[e].ExpectedDeliveryDate;
            OperationRecordDetail.RefJobBookingJobCardContentsID = CreatePOGrid._options.dataSource[e].RefJobBookingJobCardContentsID;
            OperationRecordDetail.RefJobCardContentNo = CreatePOGrid._options.dataSource[e].RefJobCardContentNo;
            //OperationRecordDetail.HSNCode = CreatePOGrid._options.dataSource[e].HSNCode;
            OperationRecordDetail.ProductHSNID = CreatePOGrid._options.dataSource[e].ProductHSNID;

            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }
    }
    //console.log(jsonObjectsRecordDetail);
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

    var jsonObjectsRecordSchedule = [];
    var OperationRecordSchedule = {};
    if (ScheduleListOBJ.length > 0) {
        for (var sch = 0; sch < ScheduleListOBJ.length; sch++) {
            OperationRecordSchedule = {};
            OperationRecordSchedule.TransID = sch + 1;
            OperationRecordSchedule.ItemID = ScheduleListOBJ[sch].ItemID;
            OperationRecordSchedule.Quantity = Number(ScheduleListOBJ[sch].Quantity).toFixed(3);
            OperationRecordSchedule.Unit = ScheduleListOBJ[sch].PurchaseUnit;
            OperationRecordSchedule.ScheduleDeliveryDate = ScheduleListOBJ[sch].SchDate;

            jsonObjectsRecordSchedule.push(OperationRecordSchedule);
        }
    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);
    jsonObjectsRecordOverHead = JSON.stringify(jsonObjectsRecordOverHead);
    jsonObjectsRecordTax = JSON.stringify(jsonObjectsRecordTax);
    jsonObjectsRecordSchedule = JSON.stringify(jsonObjectsRecordSchedule);
    //jsonObjectsRecordRequisition = JSON.stringify(jsonObjectsRecordRequisition);


    var txt = 'If you confident please click on \n' + 'Yes \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue..?",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            if (GblStatus === "Update") {
                //alert(JSON.stringify(jsonObjectsRecordMain));
                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/UpdatePurchaseOrder",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtPOID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsRecordOverHead:' + jsonObjectsRecordOverHead + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',jsonObjectsRecordSchedule:' + jsonObjectsRecordSchedule + ',jsonObjectsRecordRequisition:' + JSON.stringify(jsonObjectsRecordRequisition) + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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

                        var Title, Text, Type;
                        if (results.d === "Success") {
                            document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                            Text = "Your data updated successfully..";
                            Title = "Updated...";
                            Type = "success";
                        } else if (results.d.includes("not authorized")) {
                            Title = "Can't Update..!";
                            Text = results.d;
                            Type = "warning";
                        } else if (results.d.includes("Error:")) {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        swal(Title, Text, Type);
                        if (Type === "success") location.reload();
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/SavePaperPurchaseOrder",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsRecordOverHead:' + jsonObjectsRecordOverHead + ',jsonObjectsRecordTax:' + jsonObjectsRecordTax + ',jsonObjectsRecordSchedule:' + jsonObjectsRecordSchedule + ',jsonObjectsRecordRequisition:' + JSON.stringify(jsonObjectsRecordRequisition) + ',TxtNetAmt:' + JSON.stringify(TxtNetAmt) + ',CurrencyCode:' + JSON.stringify(CurrencyCode) + '}',
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

                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        var Title, Text, Type;
                        if (results.d === "Success") {
                            Text = "Your data saved successfully..";
                            Title = "Success...";
                            Type = "success";
                        } else if (results.d.includes("not authorized")) {
                            Title = "Not Save..!";
                            Text = results.d;
                            Type = "warning";
                        } else {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        swal(Title, Text, Type);
                        if (Type === "success") location.reload();
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

function ModalPopupScreencontrols() {
    //PaymentTermsGrid

    $("#AdditionalChargesGrid").dxDataGrid({
        dataSource: []
    });
    $("#CreatePOGrid").dxDataGrid({
        dataSource: []
    });
    for (var j = 0; j < OtherHead.length; j++) {
        OtherHead[j].Weight = 0;
        OtherHead[j].Rate = 0;
        OtherHead[j].HeadAmount = 0;
        OtherHead[j].Sel = false;
    }
    $("#OtherHeadsGrid").dxDataGrid({
        dataSource: OtherHead
    });
    $("#PORefernce").val('');
    $("#textDeliverAt").val('');
    //$("#textNaretion").val('');
    $("#TxtNetAmt").val(0);
    $("#TxtTaxAmt").val(0);
    $("#TxtTotalQty").val(0);
    $("#Txt_TaxAbleSum").val(0);
    $("#TxtAfterDisAmt").val(0);
    $("#Txt_TaxAbleSum").val(0);
    $("#TxtTotalQty").val(0);
    $("#TxtGstamt").val(0);
    $("#TxtOtheramt").val(0);

    document.getElementById("LblSupplierStateTin").innerHTML = 0;
    document.getElementById("CurrentCurrency").innerHTML = "";
    document.getElementById("ConversionRate").innerHTML = "";
    document.getElementById("VatGSTApplicable").innerHTML = "";
    document.getElementById("LblCountry").innerHTML = "";
    document.getElementById("LblCountry").innerHTML = "";
    document.getElementById("LblState").innerHTML = "";
    GblGSTApplicable = true;
    $("#DealerName").dxSelectBox({ value: "" });
    $("#ModeOfTransport").dxSelectBox({ value: "" });
    $("#PurchaseDivision").dxSelectBox({ value: "" });
    $("#ContactPersonName").dxSelectBox({ value: "" });
    $("#SupplierName").dxSelectBox({ value: "" });
    $("#VoucherDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
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
            optCH.InAmount = false;
            ChargesGrid.push(optCH);

            $("#AdditionalChargesGrid").dxDataGrid({
                dataSource: ChargesGrid
            });

            AddItemCalculation();
            GridColumnCal();
            //AddItemWithChargessGrid();
            CalculateAmount();
            var CreatePOGrid = $('#CreatePOGrid').dxDataGrid('instance');
            CreatePOGrid.refresh();
            //var AdditionalChargesGrid = $('#AdditionalChargesGrid').dxDataGrid('instance');
            AdditionalChargesGrid.refresh();
        }
    }
});

$("#BtnAddPayTerms").click(function () {
    var TxtAddPayTerms = document.getElementById("TxtAddPayTerms").value;
    //if (TxtAddPayTerms === "" || TxtAddPayTerms === "undefined" || TxtAddPayTerms === null) {
    //    DevExpress.ui.notify("Please Add Payment Terms..!", "warning", 1200);
    //    return;
    //}

    var GetPaymentTermsGrid = $('#PaymentTermsGrid').dxDataGrid('instance');
    var PaymentTermsGridCount = GetPaymentTermsGrid.totalCount();

    var optpaytr = {};

    optpaytr.TermsID = PaymentTermsGridCount + 1;
    optpaytr.Terms = TxtAddPayTerms;
    PaymentTermsGrid.push(optpaytr);

    $("#PaymentTermsGrid").dxDataGrid({
        dataSource: PaymentTermsGrid
    });
});

$("#POPrintButton").click(function () {
    var TxtPOID = document.getElementById("TxtPOID").value;
    //var url = "PrintPurchaseOrder.aspx?TI=" + TxtPOID;
    var url = "ReportPurchaseOrder.aspx?TransactionID=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

//$("#largeModalDisNone").click(function () {
//    document.getElementById("largeModalDisNone").setAttribute("data-dismiss", "modal");
//});

$("#BtnNotification").click(function () {
    var reqid = "";
    var purchaseid = "";
    var commentData = "";
    var newHtml = '';
    if (GblStatus === "Save" || GblStatus === "save" || GblStatus === "") {
        if (SubGridData.length > 0) {
            for (var i = 0; i < SubGridData.length; i++) {
                if (SubGridData[i].TransactionID > 0) {
                    if (reqid === "") {
                        reqid = SubGridData[i].TransactionID.toString();
                    } else {
                        reqid = reqid + "," + SubGridData[i].TransactionID.toString();
                    }
                }
            }

            document.getElementById("commentbody").innerHTML = "";
            if (reqid !== "") {
                $.ajax({
                    type: "POST",
                    url: "WebService_PurchaseOrder.asmx/GetCommentData",
                    data: '{PurchaseTransactionID:0,requisitionIDs:' + JSON.stringify(reqid) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, '&');
                        res = res.replace(/u0027/g, "'");
                        res = res.replace(/:,/g, ":null,");
                        res = res.replace(/,}/g, ",null}");
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
        purchaseid = document.getElementById("TxtPOID").value;
        if (purchaseid === "" || purchaseid === null || purchaseid === undefined) {
            alert("Please select valid purchase order to view comment details..!");
            return false;
        }
        document.getElementById("commentbody").innerHTML = "";
        if (purchaseid !== "") {
            $.ajax({
                type: "POST",
                url: "WebService_PurchaseOrder.asmx/GetCommentData",
                data: '{PurchaseTransactionID:' + JSON.stringify(purchaseid) + ',requisitionIDs:0}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.replace(/u0027/g, "'");
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
        var purchaseid = document.getElementById("TxtPOID").value;
        if (purchaseid === "" || purchaseid === null || purchaseid === undefined) {
            alert("Please select valid purchase order to view comment details..!");
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
        objectCommentDetail.ModuleName = "Purchase Order";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = purchaseid;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseOrder.asmx/SaveCommentData",
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
                var purchaseid = document.getElementById("TxtPOID").value;
                if (purchaseid === "" || purchaseid === null || purchaseid === undefined) {
                    alert("Please select valid purchase order to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (purchaseid !== "") {
                    $.ajax({
                        type: "POST",
                        url: "WebService_PurchaseOrder.asmx/GetCommentData",
                        data: '{PurchaseTransactionID:' + JSON.stringify(purchaseid) + ',requisitionIDs:0}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, '&');
                            res = res.replace(/u0027/g, "'");
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

$("#FieldCntainerRow").height = function () {
    return window.innerHeight / 1.2;
};