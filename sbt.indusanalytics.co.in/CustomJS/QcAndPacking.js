"use strict";
var GblStatus = "";
var radioOptions = ["Pending for QC", "QC Packed Jobs"];   /* declaring radio group button options in a variables*/
var radioValue = "Pending for QC"; /* default value of radio button, auto refresh of pending list on page load*/
var radioOptionsQcApprove = ["Yes", "No"];   /* declaring radio group button options in a variables*/
var GblPackingNo = "";
var getsemiPackingGridData = [];
var GetPendingData = [];
var GetProcessedData = [];
var SemiPackingMainID = 0;
var ObjCommonData = []; //Added by pKp

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#selBin").dxSelectBox({
    items: [],
    placeholder: "Select Bin",
    displayExpr: 'Bin',
    valueExpr: 'WarehouseID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        //alert(data.value);
    },

});

$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: 'Loading...',
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

// Define radioGroup button on web page to display
$("#RadioButtonQCApprove").dxRadioGroup({
    items: radioOptionsQcApprove,
    value: radioOptionsQcApprove[0],
    layout: 'horizontal'
});

// Define radioGroup button on web page to display
$("#RadioButtonQC").dxRadioGroup({
    items: radioOptions,
    value: radioOptions[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        radioValue = "";
        radioValue = e.value;
        if (radioValue === "Pending for QC") {
            document.getElementById("DivCreateButton").style.display = "block";
            document.getElementById("DivEdit").style.display = "none";
        } else if (radioValue === "QC Packed Jobs") {
            document.getElementById("DivCreateButton").style.display = "none";
            document.getElementById("DivEdit").style.display = "block";
        }

        GetDataGrid();
    }
});

$("#packingDetailGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        enabled: false
    },
    height: function () {
        return window.innerHeight / 4.2;
    },
    selection: { mode: "single" },
    //columnFixing: {
    //    enabled: true
    //},
    // scrolling: { mode: 'virtual' },
    filterRow: { visible: false },
    columnChooser: { enabled: false },
    headerFilter: { visible: false },
    //rowAlternationEnabled: true,
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: false
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
        getsemiPackingGridData = [];
        getsemiPackingGridData = clickedIndentCell.selectedRowsData;
        document.getElementById("txtQcApproveCFC").value = getsemiPackingGridData[0].OuterCarton;
    },
    editing: {
        enabled: false
    },
    columns: [
        { dataField: "SemiPackingMainID", visible: false, caption: "SemiPackingMainID" },
        { dataField: "SemiPackingDetailID", visible: false, caption: "SemiPackingDetailID" },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
        { dataField: "BookingID", visible: false, caption: "BookingID" },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
        { dataField: "TransID", visible: false, caption: "Seq.No." },
        { dataField: "OuterCarton", visible: true, caption: "No Of CFC" },
        { dataField: "InnerCarton", visible: true, caption: "Bndl in CFC" },
        { dataField: "QuantityPerPack", visible: true, caption: "Qty /Bndl" },
        { dataField: "QuantityPerOuter", visible: true, caption: "Qty /CFC" },
        { dataField: "PackedQuantity", visible: true, caption: "Total Qty" },
        { dataField: "PackingDescription", visible: true, caption: "Packing Detail" }
    ]
});

$("#QcPackingDetailGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        enabled: false
    },
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 4.2;
    },
    editing: {
        mode: "cell",
        allowDeleting: true
    },
    filterRow: { visible: false },
    columnChooser: { enabled: false },
    headerFilter: { visible: false },
    //rowAlternationEnabled: true,
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: false
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
        { dataField: "SemiPackingMainID", visible: false, caption: "SemiPackingMainID" },
        { dataField: "SemiPackingDetailID", visible: false, caption: "SemiPackingDetailID" },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
        { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
        { dataField: "BookingID", visible: false, caption: "BookingID" },
        { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
        { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
        { dataField: "TransID", visible: false, caption: "Seq.No." },
        { dataField: "OuterCarton", visible: true, caption: "No Of CFC" },
        { dataField: "InnerCarton", visible: true, caption: "Bndl in CFC" },
        { dataField: "QuantityPerPack", visible: true, caption: "Qty /Bndl" },
        { dataField: "QuantityPerOuter", visible: true, caption: "Qty /CFC" },
        { dataField: "PackedQuantity", visible: true, caption: "Total Qty" },
        { dataField: "PackingDescription", visible: true, caption: "Packing Detail" },
        { dataField: "WeightPerOuter", visible: true, caption: "Wt. /CFC" },
        { dataField: "TotalWeight", visible: true, caption: "Total Wt." },
        { dataField: "RejectedOuter", visible: false, caption: "Rej. CFC" },
        { dataField: "CFCLength", visible: true, caption: "Length" },
        { dataField: "CFCWidth", visible: true, caption: "Width" },
        { dataField: "CFCHeight", visible: true, caption: "Height" },
        { dataField: "CBCM", visible: true, caption: "CB Inch" },
        { dataField: "CFT", visible: true, caption: "CFT" },
        { dataField: "TotalCFT", visible: true, caption: "Total CFT" }
    ],
    summary: {
        totalItems: [{
            column: "OuterCarton",
            summaryType: "sum",
            customizeText: function (data) {
                document.getElementById("txtTotalOuterCarton").value = data.value;
            }
        }, {
            column: "InnerCarton",
            summaryType: "sum",
            customizeText: function (data1) {
                document.getElementById("txtTotalInnerCarton").value = data1.value;
            }
        }, {
            column: "PackedQuantity",
            summaryType: "sum",
            customizeText: function (data2) {
                document.getElementById("txtTotalQuantity").value = data2.value;
            }
        }]
    }
});

// function to define ajax calling Url for pending or processed options.
function GetDataGrid() {
    var ajaxUrl = "";
    if (radioValue.toUpperCase() === "PENDING FOR QC") {
        ajaxUrl = "WebService_JobQCPacking.asmx/PendingQCPacking";
        refreshPendingOrProcessedGrid(ajaxUrl, "Pending");
    }
    else if (radioValue.toUpperCase() === "QC PACKED JOBS") {
        ajaxUrl = "WebService_JobQCPacking.asmx/ProcessedQCPacking";
        refreshPendingOrProcessedGrid(ajaxUrl, "Processed");
    }
}

refreshPendingOrProcessedGrid("WebService_JobQCPacking.asmx/PendingQCPacking", "Pending");
//Ajax for calling web service method to get data of pending or processed list.
function refreshPendingOrProcessedGrid(ajaxUrl, RadioValueStatus) {
    //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: ajaxUrl,
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
                var refreshGridData = JSON.parse(res);
                //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                if (RadioValueStatus === "Pending") {
                    setPendingGrid(refreshGridData);
                } else if (RadioValueStatus === "Processed") {
                    setProcessedGrid(refreshGridData);
                }
            },

            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

//Pending grid setting .
function setPendingGrid(gridData) {
    $("#PendingProcessGrid").dxDataGrid({
        dataSource: gridData,
        columnAutoWidth: true,
        allowColumnReordering: true,
        columnResizingMode: "widget",
        searchPanel: { visible: true },
        showBorders: true,
        height: function () {
            return window.innerHeight / 1.2;
        },
        showRowLines: true,
        allowSorting: false,
        allowColumnResizing: true,
        selection: { mode: "single" },
        paging: {
            pageSize: 150
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [150, 250, 500, 1000]
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
        export: {
            enabled: true,
            fileName: "Pending Semi Packing List",
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
            GetProcessedData = [];
            GetPendingData = clickedIndentCell.selectedRowsData;
        },
        columns: [
            { dataField: "SemiPackingMainID", visible: false, caption: "SemiPackingMainID" },
            { dataField: "MaxSemiPackingNo", visible: true, caption: "Ref.No." },
            { dataField: "SemiPackingNo", visible: true, caption: "Semi Pack No." },
            { dataField: "SemiPackingDate", visible: true, caption: "Semi Pack Date" },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
            { dataField: "BookingID", visible: false, caption: "BookingID" },
            { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
            { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
            { dataField: "JobBookingNo", visible: true, caption: "Job Booking No." },
            { dataField: "JobBookingDate", visible: true, caption: "Job Booking Date", dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "ProductMasterCode", visible: true, caption: "P.C.Code" },
            { dataField: "SalesOrderNo", visible: true, caption: "S.O.No." },
            { dataField: "OrderBookingDate", visible: true, caption: "Order Date", dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "PONo", visible: false, caption: "P.O.No." },
            { dataField: "JobName", visible: true, caption: "Job Name" },
            { dataField: "ProductCode", visible: true, caption: "Product Code" },
            { dataField: "ExpectedDeliveryDate", visible: true, caption: "Expect.Deli.Date", dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "OrderQuantity", visible: true, caption: "Order Qty" },
            { dataField: "JobCardQuantity", visible: true, caption: "J.C. Qty" },
            { dataField: "SemiPackedQuantity", visible: true, caption: "Semi Pack Qty" },
            { dataField: "QCApprovedQuantity", visible: true, caption: "QC Appr.Qty" }
        ]
    });
}

//Processed grid setting .
function setProcessedGrid(gridData) {
    $("#PendingProcessGrid").dxDataGrid({
        dataSource: gridData,
        columnAutoWidth: true,
        allowColumnReordering: true,
        columnResizingMode: "widget",
        searchPanel: { visible: true },
        showBorders: true,
        height: function () {
            return window.innerHeight / 1.2;
        },
        showRowLines: true,
        allowSorting: false,
        allowColumnResizing: true,
        selection: { mode: "single" },
        paging: {
            pageSize: 150
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [150, 250, 500, 1000]
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
        export: {
            enabled: true,
            fileName: "QC Packed List",
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
            GetProcessedData = clickedIndentCell.selectedRowsData;
            document.getElementById("FGTransactionID").value = 0;
            if (GetProcessedData.length <= 0) return;
            document.getElementById("FGTransactionID").value = GetProcessedData[0].FGTransactionID;
        },
        columns: [
            { dataField: "FGTransactionID", visible: false, caption: "FGTransactionID" },
            { dataField: "JobBookingNo", visible: true, caption: "Job Booking No" },
            { dataField: "JobName", visible: true, maxWidth: 190, caption: "Job Name" },
            { dataField: "OrderBookingID", visible: false, caption: "OrderBookingID" },
            { dataField: "OrderBookingDetailsID", visible: false, caption: "OrderBookingDetailsID" },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID" },
            { dataField: "MaxVoucherNo", visible: false, caption: "MaxVoucherNo" },
            { dataField: "VoucherNo", visible: true, caption: "Voucher No" },
            { dataField: "VoucherDate", visible: true, caption: "Voucher Date", dataType: "date", format: 'dd-MMM-yyyy' },
            { dataField: "TotalOuterCarton", visible: true, caption: "Ttl Outer Carton" },
            { dataField: "TotalInnerCarton", visible: true, caption: "Ttl Inner Carton" },
            { dataField: "TotalQuantity", visible: true, caption: "Total Quantity" },
            { dataField: "FYear", visible: true, caption: "FYear" }
        ]
    });
}

$("#CreateButton").click(function () {
    GblStatus = "";
    document.getElementById("FGTransactionID").value = "";

    if (GetPendingData === "" || GetPendingData === [] || GetPendingData === undefined || GetPendingData === null || GetPendingData.length <= 0) {
        DevExpress.ui.notify("Please select semi packing voucher to proceed for qc checking..!", "warning", 1200);
        return false;
    }
    generatePackingNo();
    $("#VoucherDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });

    ObjCommonData = GetPendingData;
    SemiPackingMainID = GetPendingData[0].SemiPackingMainID;
    document.getElementById("txtJobBookingNo").value = GetPendingData[0].JobBookingNo;
    document.getElementById("txtProductCode").value = GetPendingData[0].ProductCode;
    document.getElementById("txtJobName").value = GetPendingData[0].JobName;
    document.getElementById("txtProductCatalogNo").value = GetPendingData[0].ProductMasterCode;
    document.getElementById("txtOrderQty").value = GetPendingData[0].OrderQuantity;
    document.getElementById("txtJobCardQty").value = GetPendingData[0].JobCardQuantity;
    document.getElementById("txtReadyQty").value = GetPendingData[0].SemiPackedQuantity;

    //IDes
    document.getElementById("txtSemiPackingMainID").value = GetPendingData[0].SemiPackingMainID;
    document.getElementById("txtJobBookingID").value = GetPendingData[0].JobBookingID;
    document.getElementById("txtJobBookingJobCardContentsID").value = GetPendingData[0].JobBookingJobCardContentsID;
    document.getElementById("txtProductMasterID").value = GetPendingData[0].ProductMasterID;
    document.getElementById("txtBookingID").value = GetPendingData[0].BookingID;
    document.getElementById("txtOrderBookingID").value = GetPendingData[0].OrderBookingID;
    document.getElementById("txtOrderBookingDetailsID").value = GetPendingData[0].OrderBookingDetailsID;

    refreshSemiPackingDetailGrid(SemiPackingMainID);
    $("#QcPackingDetailGrid").dxDataGrid({ dataSource: [] });

    $("#selWarehouse").dxSelectBox({ value: null });
    $("#selBin").dxSelectBox({ value: null });
    document.getElementById("TxtNarration").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnPrintButton").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

function refreshSemiPackingDetailGrid(semiPackingID) {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_JobQCPacking.asmx/LoadSemiPackingDetails",
            data: '{semiPackingID:' + JSON.stringify(semiPackingID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var SemiPackingDetail = JSON.parse(res);
                //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                //setPendingGrid(SemiPackingDetail);
                $("#packingDetailGrid").dxDataGrid({
                    dataSource: SemiPackingDetail
                });
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function generatePackingNo() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_JobQCPacking.asmx/GeneratePackingVoucherNo",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                //   $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                GblPackingNo = JSON.parse(res.toString());
                document.getElementById("TxtVoucherNo").value = GblPackingNo;
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

try {
    $.ajax({
        type: "POST",
        url: "WebService_JobQCPacking.asmx/GetWarehouseList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            //   $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var warehouseList = JSON.parse(res.toString());
            $("#selWarehouse").dxSelectBox({
                items: warehouseList,
                placeholder: "Select Warehouse",
                displayExpr: 'Warehouse',
                valueExpr: 'Warehouse',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (data) {
                    RefreshBins(data.value);
                }
            });
        }
    });
} catch (e) {
    console.log(e);
}

function RefreshBins(value) {
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var bins = JSON.parse(res);

                $("#selBin").dxSelectBox({
                    items: bins,
                    placeholder: "Select Bin",
                    displayExpr: 'Bin',
                    valueExpr: 'WarehouseID',
                    searchEnabled: true,
                    showClearButton: true
                });
            }
        });
    } catch (e) {
        alert(e);
    }
}

$("#BtnAddCFC").click(function () {

    var len = document.getElementById("txtShipperLength").value;
    var Wid = document.getElementById("txtShipperWidth").value;
    var Hei = document.getElementById("txtShipperHeight").value;
    var CFT = document.getElementById("txtCFT").value;
    var QcAppro = document.getElementById("txtQcApproveCFC").value;
    var WTCFC = document.getElementById("txtCFCWt").value;
    var QCHoldCFC = document.getElementById("txtQcHoldCFC").value;

    var FinalGrid = $('#QcPackingDetailGrid').dxDataGrid('instance');
    var FinalGridRow = FinalGrid._options.dataSource.length;

    if (getsemiPackingGridData.length > 0) {
        if (FinalGridRow > 0) {
            for (var check = 0; check < FinalGridRow; check++) {
                if (FinalGrid._options.dataSource[check].JobBookingID === getsemiPackingGridData[0].JobBookingID && FinalGrid._options.dataSource[check].SemiPackingDetailID === getsemiPackingGridData[0].SemiPackingDetailID) {
                    DevExpress.ui.notify("This item already exist..! You can not add it..", "warning", 1500);
                    return false;
                }
            }
        }
    } else {
        DevExpress.ui.notify("Please Select Semi-Packing Details...!", "error", 1000);
        return false;
    }

    if (len === "" || len === [] || len === undefined || len === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtShipperLength").focus();
        return false;
    }
    if (isNaN(len)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtShipperLength").focus();
        return false;
    }

    if (Wid === "" || Wid === [] || Wid === undefined || Wid === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtShipperWidth").focus();
        return false;
    }
    if (isNaN(Wid)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtShipperWidth").focus();
        return false;
    }

    if (Hei === "" || Hei === [] || Hei === undefined || Hei === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtShipperHeight").focus();
        return false;
    }
    if (isNaN(Hei)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtShipperHeight").focus();
        return false;
    }

    if (CFT === "" || CFT === [] || CFT === undefined || CFT === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtCFT").focus();
        return false;
    }
    if (isNaN(CFT)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtCFT").focus();
        return false;
    }

    if (QcAppro === "" || QcAppro === [] || QcAppro === undefined || QcAppro === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtQcApproveCFC").focus();
        return false;
    }
    if (isNaN(QcAppro)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtQcApproveCFC").focus();
        return false;
    }
    if (QcAppro > getsemiPackingGridData[0].OuterCarton) {
        DevExpress.ui.notify("QC Approved CFC should not be greater then Number of CFC..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtQcApproveCFC").value = getsemiPackingGridData[0].OuterCarton;
        document.getElementById("txtQcApproveCFC").focus();
        return false;
    }
    if (WTCFC === "" || WTCFC === [] || WTCFC === undefined || WTCFC === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtCFCWt").focus();
        return false;
    }
    if (isNaN(WTCFC)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtCFCWt").focus();
        return false;
    }

    if (QCHoldCFC === "" || QCHoldCFC === [] || QCHoldCFC === undefined || QCHoldCFC === null) {
        DevExpress.ui.notify("This field should not be empty..!", "warning", 1200);
        document.getElementById("txtQcHoldCFC").focus();
        return false;
    }
    if (isNaN(QCHoldCFC)) {
        DevExpress.ui.notify("Input not valid..Please enter numeric value..!", "warning", 1200);
        document.getElementById("txtQcHoldCFC").focus();
        return false;
    }

    if (QCHoldCFC > getsemiPackingGridData[0].OuterCarton - QcAppro) {
        DevExpress.ui.notify("QC Hold CFC should not be greater then Number of CFC..Please enter valid value..!", "warning", 1200);
        document.getElementById("txtQcHoldCFC").value = getsemiPackingGridData[0].OuterCarton - QcAppro;
        document.getElementById("txtQcHoldCFC").focus();
        return false;
    }

    var optAllocatedItemGrid = {};

    optAllocatedItemGrid.SemiPackingMainID = getsemiPackingGridData[0].SemiPackingMainID;
    optAllocatedItemGrid.SemiPackingDetailID = getsemiPackingGridData[0].SemiPackingDetailID;
    optAllocatedItemGrid.JobBookingID = getsemiPackingGridData[0].JobBookingID;
    optAllocatedItemGrid.ProductMasterID = getsemiPackingGridData[0].ProductMasterID;
    optAllocatedItemGrid.BookingID = getsemiPackingGridData[0].BookingID;
    optAllocatedItemGrid.OrderBookingID = getsemiPackingGridData[0].OrderBookingID;
    optAllocatedItemGrid.OrderBookingDetailsID = getsemiPackingGridData[0].OrderBookingDetailsID;
    optAllocatedItemGrid.TransID = getsemiPackingGridData[0].TransID;
    optAllocatedItemGrid.OuterCarton = QcAppro; //getsemiPackingGridData[0].OuterCarton;
    optAllocatedItemGrid.InnerCarton = getsemiPackingGridData[0].InnerCarton;
    optAllocatedItemGrid.QuantityPerPack = getsemiPackingGridData[0].QuantityPerPack;
    optAllocatedItemGrid.QuantityPerOuter = getsemiPackingGridData[0].QuantityPerOuter;
    optAllocatedItemGrid.PackedQuantity = getsemiPackingGridData[0].PackedQuantity;
    optAllocatedItemGrid.PackingDescription = getsemiPackingGridData[0].PackingDescription;

    optAllocatedItemGrid.WeightPerOuter = Number(document.getElementById("txtCFCWt").value).toFixed(3);
    optAllocatedItemGrid.CFCLength = Number(document.getElementById("txtShipperLength").value).toFixed(2);
    optAllocatedItemGrid.CFCWidth = Number(document.getElementById("txtShipperWidth").value).toFixed(2);
    optAllocatedItemGrid.CFCHeight = Number(document.getElementById("txtShipperHeight").value).toFixed(2);
    optAllocatedItemGrid.CFT = Number(document.getElementById("txtCFT").value).toFixed(2);
    optAllocatedItemGrid.CBCM = document.getElementById("txtCB_INCH").value;
    optAllocatedItemGrid.TotalCFT = (Number(document.getElementById("txtCFT").value) * Number(QcAppro)).toFixed(2);
    optAllocatedItemGrid.TotalWeight = Number(WTCFC) * Number(QcAppro);
    optAllocatedItemGrid.RejectedOuter = 0;

    CFT = document.getElementById("txtCFT").value;
    QcAppro = document.getElementById("txtQcApproveCFC").value;
    WTCFC = document.getElementById("txtCFCWt").value;

    var dataGrid = $('#QcPackingDetailGrid').dxDataGrid('instance');
    var clonedItem = $.extend({}, optAllocatedItemGrid);
    dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, clonedItem);
    dataGrid.refresh(true);
});

$("#BtnSave").click(function () {
    //  var VerifiedByQC = $("#selWarehouse").dxRadioGroup('instance').option('value');
    var Warehouse = $("#selWarehouse").dxSelectBox('instance').option('value');
    var selBin = $("#selBin").dxSelectBox('instance').option('value');

    var FinalGrid = $('#QcPackingDetailGrid').dxDataGrid('instance');
    var FinalGridRow = FinalGrid._options.dataSource.length;

    if (selBin === "" || selBin === undefined || selBin === null) {
        DevExpress.ui.notify("Please choose bin..!", "warning", 1200);
        document.getElementById("selBin").style.borderColor = "red";
        return false;
    }
    else {
        document.getElementById("selBin").style.borderColor = "";
    }

    var jsonObjectsRecordMain = [];
    var OperationMainRecordDetail = {};

    OperationMainRecordDetail = {};
    OperationMainRecordDetail.VoucherDate = $("#VoucherDate").dxDateBox('instance').option('value');
    OperationMainRecordDetail.SemiPackingMainID = document.getElementById("txtSemiPackingMainID").value;
    OperationMainRecordDetail.JobBookingID = document.getElementById("txtJobBookingID").value;
    OperationMainRecordDetail.JobBookingJobCardContentsID = document.getElementById("txtJobBookingJobCardContentsID").value;
    OperationMainRecordDetail.ProductMasterID = document.getElementById("txtProductMasterID").value;
    OperationMainRecordDetail.BookingID = document.getElementById("txtBookingID").value;
    OperationMainRecordDetail.OrderBookingID = document.getElementById("txtOrderBookingID").value;
    OperationMainRecordDetail.OrderBookingDetailsID = document.getElementById("txtOrderBookingDetailsID").value;
    OperationMainRecordDetail.TotalQuantity = document.getElementById("txtTotalQuantity").value;
    OperationMainRecordDetail.TotalOuterCarton = document.getElementById("txtTotalOuterCarton").value;
    OperationMainRecordDetail.TotalInnerCarton = document.getElementById("txtTotalInnerCarton").value;
    OperationMainRecordDetail.Narration = document.getElementById("TxtNarration").value;
    OperationMainRecordDetail.LedgerID = ObjCommonData[0].LedgerID;

    jsonObjectsRecordMain.push(OperationMainRecordDetail);

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    for (var e = 0; e < FinalGridRow; e++) {
        OperationRecordDetail = {};

        OperationRecordDetail.TransID = e + 1;
        OperationRecordDetail.SemiPackingMainID = FinalGrid._options.dataSource[e].SemiPackingMainID;
        OperationRecordDetail.SemiPackingDetailID = FinalGrid._options.dataSource[e].SemiPackingDetailID;
        OperationRecordDetail.JobBookingID = FinalGrid._options.dataSource[e].JobBookingID;
        OperationRecordDetail.JobBookingJobCardContentsID = document.getElementById("txtJobBookingJobCardContentsID").value;
        OperationRecordDetail.ProductMasterID = document.getElementById("txtProductMasterID").value;//*FinalGrid._options.dataSource[e].ProductMasterID
        OperationRecordDetail.BookingID = document.getElementById("txtBookingID").value;//* FinalGrid._options.dataSource[e].BookingID
        OperationRecordDetail.OrderBookingID = FinalGrid._options.dataSource[e].OrderBookingID; //*
        OperationRecordDetail.OrderBookingDetailsID = document.getElementById("txtOrderBookingDetailsID").value;//* FinalGrid._options.dataSource[e].OrderBookingDetailsID
        OperationRecordDetail.ReceiptQuantity = Number(FinalGrid._options.dataSource[e].OuterCarton) * Number(FinalGrid._options.dataSource[e].InnerCarton) * Number(FinalGrid._options.dataSource[e].QuantityPerPack);
        OperationRecordDetail.OuterCarton = FinalGrid._options.dataSource[e].OuterCarton;
        OperationRecordDetail.ReceiptOuterCarton = OperationRecordDetail.OuterCarton;

        OperationRecordDetail.InnerCarton = FinalGrid._options.dataSource[e].InnerCarton;
        OperationRecordDetail.QuantityPerPack = FinalGrid._options.dataSource[e].QuantityPerPack;
        OperationRecordDetail.WeightPerOuterCarton = FinalGrid._options.dataSource[e].WeightPerOuter;
        OperationRecordDetail.TotalWeight = FinalGrid._options.dataSource[e].TotalWeight;
        OperationRecordDetail.ReceiptTotalWeight = OperationRecordDetail.TotalWeight;

        OperationRecordDetail.ShipperLengthCM = FinalGrid._options.dataSource[e].CFCLength;
        OperationRecordDetail.ShipperWidthCM = FinalGrid._options.dataSource[e].CFCWidth;
        OperationRecordDetail.ShipperHeightCM = FinalGrid._options.dataSource[e].CFCHeight;
        OperationRecordDetail.CBCM = FinalGrid._options.dataSource[e].CBCM;
        OperationRecordDetail.CFT = FinalGrid._options.dataSource[e].CFT;
        OperationRecordDetail.TotalCFT = FinalGrid._options.dataSource[e].TotalCFT;
        //OperationRecordDetail.BatchNo = FinalGrid._options.dataSource[e].OrderBookingDetailsID;
        OperationRecordDetail.WarehouseID = selBin;
        OperationRecordDetail.PackingDescription = document.getElementById("TxtNarration").value;

        jsonObjectsRecordDetail.push(OperationRecordDetail);
    }

    if (jsonObjectsRecordMain.length <= 0) return;

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);

    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    if (GblStatus === "Update") {
        $.ajax({
            type: "POST",
            url: "WebService_JobQCPacking.asmx/UpdateQCPacking",
            data: '{FGTransactionID:' + JSON.stringify(document.getElementById("FGTransactionID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);

                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                if (res === "Success") {
                    document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                    swal("Updated..!", "Packing data updated successfully..", "success");
                    location.reload();
                } else if (res.includes("Error:")) {
                    swal("Error Occured..!", res, "error");
                } else if (res.includes("not authorized")) {
                    swal("Can't Update!", res, "warning");
                }
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                swal("Error!", "Please try after some time..", "");
            }
        });
    }
    else {        
        $.ajax({
            type: "POST",
            url: "WebService_JobQCPacking.asmx/SaveJobQCPacking",
            data: '{jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);

                $("#image-indicator").dxLoadPanel("instance").option("visible", false);

                if (res === "Success") {
                    swal("Saved..!", "Packing data saved successfully..", "success");
                    location.reload();
                }
                else if (res.includes("not authorized")) {
                    swal("Can't Save!", res, "warning");
                }
                else if (res.includes("Error")) {
                    swal("Error..!", res, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                swal("Error!", "Please try after some time..", "");
                console.log(jqXHR);
            }
        });
    }
});

$("#DeleteButton").click(function () {
    var FGTransactionID = document.getElementById("FGTransactionID").value;

    if (FGTransactionID === "" || FGTransactionID === null || FGTransactionID === undefined) {
        // alert("Please Choose any row from below Grid..!");
        DevExpress.ui.notify("Please Choose any row from below Grid..!", "warning", 1200);
        return false;
    }

    // $.ajax({
    //     type: "POST",
    //     url: "WebService_PickList.asmx/CheckPermission",
    //     data: '{TransactionID:' + JSON.stringify(TxtPickID) + '}',
    //     contentType: "application/json; charset=utf-8",
    //     dataType: "json",
    //     success: function (results) {
    //         var res = JSON.stringify(results);
    //         res = res.replace(/"d":/g, '');
    //         res = res.replace(/{/g, '');
    //         res = res.replace(/}/g, '');
    //         res = res.substr(1);
    //         res = res.slice(0, -1);

    //         //if (res === "Exist") {
    //         //    swal("", "Can't delete this picklist,selected picklist has been used in further transactions", "error");
    //         //    return false;
    //         //}
    //         //else {
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
            $("#image-indicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_JobQCPacking.asmx/DeleteQCPacking",
                data: '{FGTransactionID:' + JSON.stringify(FGTransactionID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);

                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                    if (res === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });
    //         //}
    //     //}
    //// });

});

$("#EditButton").click(function () {
    var FGTransactionID = Number(document.getElementById("FGTransactionID").value);
    if (FGTransactionID === 0 || FGTransactionID === null || FGTransactionID === undefined) {
        DevExpress.ui.notify("Please choose any row from below Grid..!", "warning", 1200);
        return false;
    }

    document.getElementById("BtnSave").disabled = true;
    //document.getElementById("BtnDeletePopUp").disabled = true;

    try {
        $.ajax({
            type: "POST",
            url: "WebService_JobQCPacking.asmx/RetriveData",
            data: '{FGTransactionID:' + JSON.stringify(FGTransactionID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);

                ObjCommonData = RES1;
                $("#VoucherDate").dxDateBox({
                    value: RES1[0].VoucherDate
                });

                document.getElementById("TxtVoucherNo").value = RES1[0].VoucherNo;
                document.getElementById("txtJobBookingNo").value = RES1[0].JobBookingNo;
                document.getElementById("txtProductCode").value = RES1[0].ProductCode;
                document.getElementById("txtJobName").value = RES1[0].JobName;
                document.getElementById("txtProductCatalogNo").value = RES1[0].ProductMasterCode;
                document.getElementById("txtOrderQty").value = RES1[0].OrderQuantity;
                document.getElementById("txtJobCardQty").value = RES1[0].JobQuantity;
                document.getElementById("txtReadyQty").value = RES1[0].SemiPackedQuantity;

                //IDes
                document.getElementById("txtSemiPackingMainID").value = RES1[0].SemiPackingMainID;
                document.getElementById("txtJobBookingID").value = RES1[0].JobBookingID;
                document.getElementById("txtJobBookingJobCardContentsID").value = RES1[0].JobBookingJobCardContentsID;
                document.getElementById("txtProductMasterID").value = RES1[0].ProductMasterID;
                document.getElementById("txtBookingID").value = RES1[0].BookingID;
                document.getElementById("txtOrderBookingID").value = RES1[0].OrderBookingID;
                document.getElementById("txtOrderBookingDetailsID").value = RES1[0].OrderBookingDetailsID;

                $("#selWarehouse").dxSelectBox({
                    value: RES1[0].WarehouseName
                });
                $("#selBin").dxSelectBox({
                    value: RES1[0].WarehouseID
                });
                document.getElementById("TxtNarration").value = RES1[0].Narration;

                $("#QcPackingDetailGrid").dxDataGrid({
                    dataSource: RES1
                });
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    } catch (e) {
        console.log(e);
    }

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#BtnNew").click(function () {
    location.reload();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

function CalulationCBInch() {
    var LL = document.getElementById("txtShipperLength").value;
    var WW = document.getElementById("txtShipperWidth").value;
    var HH = document.getElementById("txtShipperHeight").value;
    var CBInch = Number(document.getElementById("txtCB_INCH").value);

    if (LL === "" || LL === undefined || LL === null) {
        LL = 0;
    }
    if (WW === "" || WW === undefined || WW === null) {
        WW = 0;
    }
    if (HH === "" || HH === undefined || HH === null) {
        HH = 0;
    }
    document.getElementById("txtCB_INCH").value = (Number(LL) * Number(WW) * Number(HH)).toFixed(3);

    if (CBInch > 0) {
        document.getElementById("txtCFT").value = (Number(document.getElementById("txtCB_INCH").value) / 28772).toFixed(3);
    }
}