"use strict";

var GblStatus = "";
var RadioValue = "";
var ValRES1 = [], RTSVoucherNo = "";
var AllocatedItemGrid = [];
var BatchWisdata = [];
var ExistQty = 0;
var sholistData = [];

RadioValue = "General Issue Vouchers";

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

$("#RTSDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelBinName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'Bin',
    valueExpr: 'WarehouseID',
    searchEnabled: true,
    showClearButton: true
});

$("#SelFloorGodown").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'Warehouse',
    valueExpr: 'Warehouse',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        //Bin
        var warehousename = $('#SelFloorGodown').dxSelectBox('instance').option('text');

        $.ajax({
            type: "POST",
            url: "WebService_ReturnToStock.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(warehousename) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var SelFloorGodown = JSON.parse(res.toString());

                $("#SelBinName").dxSelectBox({
                    items: SelFloorGodown
                });

            }
        });
    }
});

$("#ReturnToStockShowListGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: {
        enabled: false
    },
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
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
    onSelectionChanged: function (Showlist) {
        sholistData = [];
        sholistData = Showlist.selectedRowsData;
        document.getElementById("TxtReturnToStockID").value = sholistData[0].TransactionID;
    },
    columns: [
        { dataField: "TransactionID", visible: false, width: 120 },
        { dataField: "ItemID", visible: false, width: 120 },
        { dataField: "ItemGroupID", visible: false, width: 120 },
        { dataField: "ItemGroupNameID", visible: false, width: 100 },
        { dataField: "ItemSubGroupID", visible: false, width: 120 },
        { dataField: "WarehouseID", visible: false, width: 100 },
        { dataField: "FloorWarehouseID", visible: false, width: 120 },
        { dataField: "DepartmentID", visible: false, width: 120 },
        { dataField: "JobBookingJobCardContentsID", visible: false, width: 120 },
        { dataField: "MaxVoucherNo", visible: true, width: 80, caption: "Ref. No." },
        { dataField: "VoucherNo", visible: true, width: 120, caption: "Voucher No." },
        { dataField: "VoucherDate", visible: true, width: 100, caption: "Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ItemCode", visible: true, width: 100, caption: "Item Code" },
        { dataField: "ItemGroupName", visible: true, width: 100, caption: "Item Group" },
        { dataField: "ItemSubGroupName", visible: true, width: 120, caption: "Sub Group" },
        { dataField: "ItemName", visible: true, width: 250, caption: "Item Name" },
        //{ dataField: "PicklistNo", visible: true, width: 100 },
        { dataField: "DepartmentName", visible: true, width: 100, caption: "Department" },
        { dataField: "JobCardNo", visible: true, width: 100, caption: "J.C. No." },
        { dataField: "JobName", visible: true, width: 200, caption: "Job Name" },
        { dataField: "ContentName", visible: true, width: 150, caption: "Content Name" },
        { dataField: "StockUnit", visible: true, width: 80, caption: "Unit" },
        { dataField: "ReturnQuantity", visible: true, width: 80, caption: "Return Qty" },
        { dataField: "BatchNo", visible: true, width: 100, caption: "Batch No" },
        { dataField: "Warehouse", visible: true, width: 100 },
        { dataField: "Bin", visible: true, width: 100 }
    ]
});

//Issue No
CreateVoucherNO();
function CreateVoucherNO() {
    var prefix = "RTS";

    $.ajax({
        type: "POST",
        url: "WebService_ReturnToStock.asmx/GetRTSVoucherNO",
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
            RTSVoucherNo = "";
            if (res !== "") {
                RTSVoucherNo = res;
                document.getElementById("TxtRTSVoucherNo").value = RTSVoucherNo;
            }
        }
    });
}

//var priorities = ["Job Consumables", "General Consumables"];
var priorities = ["Job Issue Vouchers", "General Issue Vouchers", "All"];
$("#RadioButtonReturnToStock").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        radioGroup();
    }
});

radioGroup();
//Get Show List
Showlist();
function Showlist() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_ReturnToStock.asmx/Showlist",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());
            $("#ReturnToStockShowListGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

//Get JobcardList
//$.ajax({
//    type: "POST",
//    url: "WebService_ReturnToStock.asmx/JobCardRender",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: 'text',
//    success: function (results) {
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"d":/g, '');
//        res = res.replace(/""/g, '');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        RES1 = JSON.parse(res.toString());

//        $("#FiltrJobcardGrid").dxDataGrid({
//            dataSource: RES1,
//            showBorders: true,
//            paging: {
//                enabled: false
//            },
//            showRowLines: true,
//            allowSorting: false,
//            allowColumnResizing: true,
//            selection: { mode: "single" },
//            paging: {
//                pageSize: 15
//            },
//            pager: {
//                showPageSizeSelector: true,
//                allowedPageSizes: [15, 25, 50, 100]
//            },
//            filterRow: { visible: true, applyFilter: "auto" },
//            sorting: {
//                mode: "none" // or "multiple" | "single"
//            },
//            loadPanel: {
//                enabled: true,
//                height: 90,
//                width: 200,
//                text: 'Data is loading...'
//            },

//            onRowPrepared: function (e) {
//                if (e.rowType === "header") {
//                    e.rowElement.css('background', '#509EBC');
//                    e.rowElement.css('color', 'white');
//                    e.rowElement.css('font-weight', 'bold');
//                }
//                e.rowElement.css('fontSize', '11px');
//            },

//            onSelectionChanged: function (Items) {
//                JCdata = Items.selectedRowsData;
//                if (JCdata !== [] && JCdata !== "") {
//                    document.getElementById("TxtJCN").value = JCdata[0].JobCardContentNo;
//                    document.getElementById("TxtJobName").value = JCdata[0].JobName;
//                    document.getElementById("TxtJobBookingID").value = JCdata[0].JobBookingID;
//                    document.getElementById("TxtJobBookingJobCardContentsID").value = JCdata[0].JobBookingJobCardContentsID;
//                    document.getElementById("TxtLedgerID").value = JCdata[0].LedgerID;
//                    document.getElementById("TxtJobBookingNo").value = JCdata[0].JobBookingNo;
//                    document.getElementById("TxtJobCardContentNo").value = JCdata[0].JobCardContentNo;
//                    document.getElementById("TxtContentName").value = JCdata[0].PlanContName;


//                    var filterData = { 'FilterD': ValRES1 };
//                    var FillFloorStock = [];

//                    FillFloorStock = filterData.FilterD.filter(function (el) {
//                        return el.JobCardNo === document.getElementById("TxtJCN").value;
//                    });

//                    $("#IssueFloorStock").dxDataGrid({
//                        dataSource: FillFloorStock,
//                    });

//                }
//            },
//            columns: [
//                { dataField: "JobBookingNo", visible: true, caption: "Booking No" },
//                { dataField: "JobCardContentNo", visible: true, caption: "Job Card No." },
//                { dataField: "JobName", visible: true, caption: "Job Name" },
//                { dataField: "PlanContName", visible: true, caption: "Content Name" },
//                { dataField: "JobBookingID", visible: false },
//                { dataField: "JobBookingJobCardContentsID", visible: false },
//                { dataField: "LedgerID", visible: false },
//            ]
//        })
//    }
//});

//Get JobcardList Popup
//function keydownFunction() {
//    document.getElementById("TxtJCN").value = "";

//    document.getElementById("TxtJobName").value = "";
//    document.getElementById("TxtJobBookingID").value = "";
//    document.getElementById("TxtJobBookingJobCardContentsID").value = "";
//    document.getElementById("TxtLedgerID").value = "";
//    document.getElementById("TxtJobBookingNo").value = "";
//    document.getElementById("TxtJobCardContentNo").value = "";
//    document.getElementById("TxtContentName").value = "";

//    $("#OpenPopupJobcard").click();
//}

//function keyupFunction() {
//    document.getElementById("TxtJCN").value = "";
//    document.getElementById("TxtJobName").value = "";
//    document.getElementById("TxtJobBookingID").value = "";
//    document.getElementById("TxtJobBookingJobCardContentsID").value = "";
//    document.getElementById("TxtLedgerID").value = "";
//    document.getElementById("TxtJobBookingNo").value = "";
//    document.getElementById("TxtJobCardContentNo").value = "";
//    document.getElementById("TxtContentName").value = "";
//}

//BatchStock Initialised
IssueFloorStock();
function IssueFloorStock() {
    $("#IssueFloorStock").dxDataGrid({
        dataSource: ValRES1,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        //filterRow: { visible: true, applyFilter: "auto" },
        filterRow: { visible: true, applyFilter: "auto" },
        selection: { mode: "single" },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        editing: {
            mode: "cell",
            allowDeleting: false
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onSelectionChanged: function (selectedBatchWisdata) {
            BatchWisdata = [];
            BatchWisdata = selectedBatchWisdata.selectedRowsData;

            ExistQty = 0;
            ExistQty = Number(BatchWisdata[0].FloorStock);
            document.getElementById("TxtReturnQuantity").value = ExistQty;
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 100 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 100 },
            { dataField: "MachineID", visible: false, caption: "MachineID", width: 100 },
            { dataField: "DepartmentID", visible: false, caption: "DepartmentID", width: 100 },
            { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID" },
            { dataField: "FloorWarehouseID", visible: false, caption: "FloorWarehouseID" },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
            { dataField: "MachineID", visible: false, caption: "MachineID", width: 80 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 80 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 100 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 100 },
            { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 80 },
            { dataField: "VoucherNo", visible: true, caption: "Issue No.", width: 100 },
            { dataField: "VoucherDate", visible: true, caption: "Issue Date", width: 100 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
            { dataField: "DepartmentName", visible: true, caption: "Department", width: 120 },
            { dataField: "JobCardNo", visible: true, caption: "J.C. No.", width: 100 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
            { dataField: "ContentName", visible: true, caption: "Content Name", width: 150 },
            { dataField: "StockType", visible: false, caption: "Stock Type" },
            { dataField: "StockCategory", visible: false, caption: "StockCategory", width: 60 },
            { dataField: "StockUnit", visible: true, caption: "Unit", width: 80 },
            { dataField: "BatchNo", visible: true, caption: "Batch No.", width: 120 },
            { dataField: "GRNNo", visible: false, caption: "GRN No.", width: 100 },
            { dataField: "GRNDate", visible: false, caption: "GRN Date", width: 100 },
            { dataField: "IssueQuantity", visible: false, caption: "Issue Qty" },
            { dataField: "ConsumeQuantity", visible: false, caption: "ConsumeQuantity" },
            { dataField: "FloorStock", visible: true, caption: "Floor Stock", width: 80 },
            { dataField: "WarehouseName", visible: true, caption: "Warehouse", width: 100 },
            { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
            { dataField: "BinID", visible: false, caption: "BinID", width: 80 },
            { dataField: "MachineName", visible: false, caption: "MachineName", width: 80 }
        ]
    });
    $("#IssueFloorStock").dxDataGrid('instance').clearFilter();
}
//AllocatedGrid Initialised
$("#AllotedItemGrid").dxDataGrid({
    dataSource: AllocatedItemGrid,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    //filterRow: { visible: true, applyFilter: "auto" },
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: "cell",
        allowDeleting: true
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
        if (e.component.totalCount() === 0) {
            $("#RadioButtonReturnToStock").dxRadioGroup({
                disabled: false
            });
            $("#IssueFloorStock").dxDataGrid('instance').clearFilter();
        }
    },
    columns: [
        { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 100 },
        { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 100 },
        { dataField: "MachineID", visible: false, caption: "MachineID", width: 100 },
        { dataField: "DepartmentID", visible: false, caption: "DepartmentID", width: 100 },
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID" },
        { dataField: "FloorWarehouseID", visible: false, caption: "FloorWarehouseID" },
        { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
        { dataField: "MachineID", visible: false, caption: "MachineID", width: 80 },
        { dataField: "ItemID", visible: false, caption: "ItemID", width: 80 },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 100 },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 100 },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 80 },
        { dataField: "VoucherNo", visible: true, caption: "Issue No.", width: 100 },
        { dataField: "VoucherDate", visible: true, caption: "Issue Date", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
        { dataField: "DepartmentName", visible: true, caption: "Department", width: 100 },
        { dataField: "StockType", visible: false, caption: "StockType", width: 80 },
        { dataField: "StockCategory", visible: false, caption: "StockCategory", width: 60 },
        { dataField: "StockUnit", visible: true, caption: "Unit", width: 80 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 120 },
        { dataField: "GRNNo", visible: false, caption: "GRN No.", width: 100 },
        { dataField: "GRNDate", visible: false, caption: "GRN Date", width: 100 },
        { dataField: "JobCardNo", visible: true, caption: "J.C. No.", width: 100 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "ContentName", visible: true, caption: "Content", width: 200 },
        { dataField: "IssueQuantity", visible: false, caption: "Issue Qty", width: 80 },
        { dataField: "ConsumeQuantity", visible: false, caption: "Consumed Qty", width: 80 },
        { dataField: "FloorStock", visible: true, caption: "Return Qty", width: 80 },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "BinID", visible: false, caption: "BinID", width: 80 },
        { dataField: "MachineName", visible: false, caption: "MachineName", width: 100 }
    ]
});

//Department Name
//$.ajax({
//    type: "POST",
//    url: "WebService_ReturnToStock.asmx/DepartmentName",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: "text",
//    success: function (results) {
//        ////console.debug(results);
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"d":""/g, '');
//        res = res.replace(/""/g, '');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        Departmentname = [];
//        Departmentname = JSON.parse(res);

//        FilterDepartment = Departmentname;

//        $("#SelDepartment").dxSelectBox({
//            items: FilterDepartment,
//            placeholder: "Select--",
//            displayExpr: 'DepartmentName',
//            valueExpr: 'DepartmentID',
//            searchEnabled: true,
//            showClearButton: true,
//            onValueChanged: function (data) {
//                radioGroup();
//            }
//        });
//    }
//});

function radioGroup() {
    // if (RadioValue === "Job Consumables") {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    //document.getElementById("TxtJCN").value = "";
    BatchWisdata = [];
    //var SelDepartment = $('#SelDepartment').dxSelectBox('instance').option('value');
    var RadioValue = $('#RadioButtonReturnToStock').dxRadioGroup('instance').option('value');

    var urlMethod = "";
    if (RadioValue === "Job Issue Vouchers") {
        urlMethod = "JobIssueVouchers";
    }
    else if (RadioValue === "General Issue Vouchers") {
        urlMethod = "NonJobIssueVouchers";
    }
    else if (RadioValue === "All") {
        urlMethod = "AllIssueVouchers";
    }

    $.ajax({
        type: "POST",
        url: "WebService_ReturnToStock.asmx/JobPendingVouchers",
        data: '{Options:' + JSON.stringify(urlMethod) +'}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            ValRES1 = JSON.parse(res.toString());
            $("#IssueFloorStock").dxDataGrid({
                dataSource: ValRES1
            });
        }
    });

    //$.ajax({
    //    type: "POST",
    //    url: "WebService_ReturnToStock.asmx/IssueFloorStock",
    //    data: '{SelDepartment:' + JSON.stringify(SelDepartment) + ',RadioValue:' + JSON.stringify(RadioValue) + '}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: 'text',
    //    success: function (results) {
    //        var res = results.replace(/\\/g, '');
    //        res = res.replace(/"d":/g, '');
    //        res = res.replace(/""/g, '');
    //        res = res.substr(1);
    //        res = res.slice(0, -1);
    //        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    //        ValRES1 = [];
    //        ValRES1 = JSON.parse(res.toString());

    //        if (document.getElementById("TxtJCN").value !== "") {
    //            var FillFloorStock = [];
    //            var filterData = { 'FilterD': ValRES1 };
    //            FillFloorStock = filterData.FilterD.filter(function (el) {
    //                return el.JobCardNo === document.getElementById("TxtJCN").value;
    //            });

    //            $("#IssueFloorStock").dxDataGrid({
    //                dataSource: FillFloorStock,
    //            });
    //        }
    //        else {
    //            $("#IssueFloorStock").dxDataGrid({
    //                dataSource: ValRES1,
    //            });
    //        }
    //    }
    //});
    //  }    
}

//Data Add in Last Grid(AllocatedItemGrid) from BatchStockGrid
$("#BtnAddRow").click(function () {

    var TxtReturnQuantity = document.getElementById("TxtReturnQuantity").value;
    var SelFloorGodown = $('#SelFloorGodown').dxSelectBox('instance').option('value');

    var SelBinName = $('#SelBinName').dxSelectBox('instance').option('value');

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (BatchWisdata.length > 0) {
        if (TxtReturnQuantity > BatchWisdata[0].BatchStock) {
            DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
            document.getElementById("TxtReturnQuantity").focus();
            return false;
        }
        if (ItemGridRow > 0) {
            for (var check = 0; check < ItemGridRow; check++) {
                if (ItemGrid._options.dataSource[check].PicklistTransactionID === BatchWisdata[0].PicklistTransactionID && ItemGrid._options.dataSource[check].ItemID === BatchWisdata[0].ItemID && ItemGrid._options.dataSource[check].BatchNo === BatchWisdata[0].BatchNo) {
                    DevExpress.ui.notify("This item already exist..! You can not add it..", "error", 1000);
                    return false;
                }
            }
        }
    } else {
        DevExpress.ui.notify("Please Select Any Item...!", "error", 1000);
        return false;
    }

    var text = "";
    if (TxtReturnQuantity === "" || TxtReturnQuantity === undefined || TxtReturnQuantity === null) {
        DevExpress.ui.notify("Please Enter Quantity..!", "error", 1000);

        text = "Please Enter Quantity...!";
        document.getElementById("TxtReturnQuantity").value = "";
        document.getElementById("TxtReturnQuantity").focus();
        document.getElementById("ValStrTxtReturnQuantity").style.display = "block";
        document.getElementById("ValStrTxtReturnQuantity").innerHTML = text;
        document.getElementById("ValStrTxtReturnQuantity").style.minHeight = "20px";
        return false;
    }
    else {
        document.getElementById("ValStrTxtReturnQuantity").style.display = "none";
        document.getElementById("ValStrTxtReturnQuantity").style.minHeight = "0px";
    }
    if (SelFloorGodown === "" || SelFloorGodown === undefined || SelFloorGodown === null) {
        DevExpress.ui.notify("Please Choose Warehouse...!", "error", 1000);
        text = "Please Choose Warehouse...!";
        document.getElementById("ValStrSelFloorGodown").style.display = "block";
        document.getElementById("ValStrSelFloorGodown").innerHTML = text;
        document.getElementById("ValStrSelFloorGodown").style.minHeight = "20px";
        return false;
    } else {
        document.getElementById("ValStrSelFloorGodown").style.display = "none";
        document.getElementById("ValStrSelFloorGodown").style.minHeight = "0px";
    }
    if (SelBinName === "" || SelBinName === undefined || SelBinName === null) {
        DevExpress.ui.notify("Please Choose Bin...!", "error", 1000);
        text = "Please Choose Bin...!";
        document.getElementById("ValStrSelBinName").style.display = "block";
        document.getElementById("ValStrSelBinName").innerHTML = text;
        document.getElementById("ValStrSelBinName").style.minHeight = "20px";
        return false;
    } else {
        document.getElementById("ValStrSelBinName").style.display = "none";
        document.getElementById("ValStrSelBinName").style.minHeight = "0px";
    }

    if (Number(ExistQty) < Number(TxtReturnQuantity)) {
        DevExpress.ui.notify("Return quantity should not be greater then Floor stock..!", "error", 1000);

        text = "Return quantity should not be greater then Floor stock...!";
        document.getElementById("TxtReturnQuantity").focus();
        document.getElementById("ValStrTxtReturnQuantity").style.display = "block";
        document.getElementById("ValStrTxtReturnQuantity").innerHTML = text;
        document.getElementById("ValStrTxtReturnQuantity").style.minHeight = "20px";
        return false;
    }
    else {
        document.getElementById("ValStrTxtReturnQuantity").style.display = "none";
        document.getElementById("ValStrTxtReturnQuantity").style.minHeight = "0px";
    }

    AllocatedItemGrid = [];
    var optAllocatedItemGrid = {};

    if (ItemGridRow > 0) {
        for (var t = 0; t <= ItemGridRow; t++) {
            if (t === ItemGridRow) {
                optAllocatedItemGrid = {};

                optAllocatedItemGrid.JobBookingID = BatchWisdata[0].JobBookingID;
                optAllocatedItemGrid.TransactionID = BatchWisdata[0].TransactionID;
                optAllocatedItemGrid.ParentTransactionID = BatchWisdata[0].ParentTransactionID;
                optAllocatedItemGrid.DepartmentID = BatchWisdata[0].DepartmentID;
                optAllocatedItemGrid.FloorWarehouseID = BatchWisdata[0].FloorWarehouseID;
                optAllocatedItemGrid.JobBookingJobCardContentsID = BatchWisdata[0].JobBookingJobCardContentsID;
                optAllocatedItemGrid.MachineID = BatchWisdata[0].MachineID;
                optAllocatedItemGrid.ProcessID = BatchWisdata[0].ProcessID;
                optAllocatedItemGrid.ItemID = BatchWisdata[0].ItemID;
                optAllocatedItemGrid.ItemGroupID = BatchWisdata[0].ItemGroupID;
                optAllocatedItemGrid.ItemGroupNameID = BatchWisdata[0].ItemGroupNameID;
                optAllocatedItemGrid.ItemSubGroupID = BatchWisdata[0].ItemSubGroupID;
                optAllocatedItemGrid.DepartmentName = BatchWisdata[0].DepartmentName;
                optAllocatedItemGrid.VoucherNo = BatchWisdata[0].VoucherNo;
                optAllocatedItemGrid.VoucherDate = BatchWisdata[0].VoucherDate;
                optAllocatedItemGrid.ItemCode = BatchWisdata[0].ItemCode;
                optAllocatedItemGrid.ItemGroupName = BatchWisdata[0].ItemGroupName;
                optAllocatedItemGrid.ItemSubGroupName = BatchWisdata[0].ItemSubGroupName;
                optAllocatedItemGrid.ItemName = BatchWisdata[0].ItemName;
                optAllocatedItemGrid.StockType = BatchWisdata[0].StockType;
                optAllocatedItemGrid.StockCategory = BatchWisdata[0].StockCategory;
                optAllocatedItemGrid.StockUnit = BatchWisdata[0].StockUnit;
                optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
                optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
                optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
                optAllocatedItemGrid.JobCardNo = BatchWisdata[0].JobCardNo;
                optAllocatedItemGrid.JobName = BatchWisdata[0].JobName;
                optAllocatedItemGrid.ContentName = BatchWisdata[0].ContentName;
                optAllocatedItemGrid.IssueQuantity = BatchWisdata[0].IssueQuantity;
                optAllocatedItemGrid.ConsumeQuantity = BatchWisdata[0].ConsumeQuantity;
                optAllocatedItemGrid.FloorStock = document.getElementById("TxtReturnQuantity").value;
                optAllocatedItemGrid.WarehouseName = $('#SelFloorGodown').dxSelectBox('instance').option('text');
                optAllocatedItemGrid.Bin = $('#SelBinName').dxSelectBox('instance').option('text');
                optAllocatedItemGrid.BinID = SelBinName;
                optAllocatedItemGrid.MachineName = BatchWisdata[0].MachineName;

                AllocatedItemGrid.push(optAllocatedItemGrid);
            } else {
                optAllocatedItemGrid = {};

                optAllocatedItemGrid.JobBookingID = ItemGrid._options.dataSource[t].JobBookingID;
                optAllocatedItemGrid.TransactionID = ItemGrid._options.dataSource[t].TransactionID;
                optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
                optAllocatedItemGrid.DepartmentID = ItemGrid._options.dataSource[t].DepartmentID;
                optAllocatedItemGrid.FloorWarehouseID = ItemGrid._options.dataSource[t].FloorWarehouseID;
                optAllocatedItemGrid.JobBookingJobCardContentsID = ItemGrid._options.dataSource[t].JobBookingJobCardContentsID;
                optAllocatedItemGrid.MachineID = ItemGrid._options.dataSource[t].MachineID;
                optAllocatedItemGrid.ProcessID = ItemGrid._options.dataSource[t].ProcessID;
                optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
                optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
                optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
                optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
                optAllocatedItemGrid.DepartmentName = ItemGrid._options.dataSource[t].DepartmentName;
                optAllocatedItemGrid.VoucherNo = ItemGrid._options.dataSource[t].VoucherNo;
                optAllocatedItemGrid.VoucherDate = ItemGrid._options.dataSource[t].VoucherDate;
                optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
                optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
                optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
                optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
                optAllocatedItemGrid.StockType = ItemGrid._options.dataSource[t].StockType;
                optAllocatedItemGrid.StockCategory = ItemGrid._options.dataSource[t].StockCategory;
                optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
                optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
                optAllocatedItemGrid.JobCardNo = ItemGrid._options.dataSource[t].JobCardNo;
                optAllocatedItemGrid.JobName = ItemGrid._options.dataSource[t].JobName;

                optAllocatedItemGrid.ContentName = ItemGrid._options.dataSource[t].ContentName;
                optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
                optAllocatedItemGrid.ConsumeQuantity = ItemGrid._options.dataSource[t].ConsumeQuantity;
                optAllocatedItemGrid.FloorStock = ItemGrid._options.dataSource[t].FloorStock;
                optAllocatedItemGrid.WarehouseName = ItemGrid._options.dataSource[t].WarehouseName;
                optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                optAllocatedItemGrid.BinID = ItemGrid._options.dataSource[t].BinID;
                optAllocatedItemGrid.MachineName = ItemGrid._options.dataSource[t].MachineName;

                AllocatedItemGrid.push(optAllocatedItemGrid);

            }
        }
    }
    else {
        optAllocatedItemGrid = {};

        optAllocatedItemGrid.JobBookingID = BatchWisdata[0].JobBookingID;
        optAllocatedItemGrid.TransactionID = BatchWisdata[0].TransactionID;
        optAllocatedItemGrid.ParentTransactionID = BatchWisdata[0].ParentTransactionID;
        optAllocatedItemGrid.DepartmentID = BatchWisdata[0].DepartmentID;
        optAllocatedItemGrid.FloorWarehouseID = BatchWisdata[0].FloorWarehouseID;
        optAllocatedItemGrid.JobBookingJobCardContentsID = BatchWisdata[0].JobBookingJobCardContentsID;
        optAllocatedItemGrid.MachineID = BatchWisdata[0].MachineID;
        optAllocatedItemGrid.ProcessID = BatchWisdata[0].ProcessID;
        optAllocatedItemGrid.ItemID = BatchWisdata[0].ItemID;
        optAllocatedItemGrid.ItemGroupID = BatchWisdata[0].ItemGroupID;
        optAllocatedItemGrid.ItemGroupNameID = BatchWisdata[0].ItemGroupNameID;
        optAllocatedItemGrid.ItemSubGroupID = BatchWisdata[0].ItemSubGroupID;
        optAllocatedItemGrid.DepartmentName = BatchWisdata[0].DepartmentName;
        optAllocatedItemGrid.VoucherNo = BatchWisdata[0].VoucherNo;
        optAllocatedItemGrid.VoucherDate = BatchWisdata[0].VoucherDate;
        optAllocatedItemGrid.ItemCode = BatchWisdata[0].ItemCode;
        optAllocatedItemGrid.ItemGroupName = BatchWisdata[0].ItemGroupName;
        optAllocatedItemGrid.ItemSubGroupName = BatchWisdata[0].ItemSubGroupName;
        optAllocatedItemGrid.ItemName = BatchWisdata[0].ItemName;
        optAllocatedItemGrid.StockType = BatchWisdata[0].StockType;
        optAllocatedItemGrid.StockCategory = BatchWisdata[0].StockCategory;
        optAllocatedItemGrid.StockUnit = BatchWisdata[0].StockUnit;
        optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
        optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
        optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
        optAllocatedItemGrid.JobCardNo = BatchWisdata[0].JobCardNo;
        optAllocatedItemGrid.JobName = BatchWisdata[0].JobName;
        optAllocatedItemGrid.ContentName = BatchWisdata[0].ContentName;
        optAllocatedItemGrid.IssueQuantity = BatchWisdata[0].IssueQuantity;
        optAllocatedItemGrid.ConsumeQuantity = BatchWisdata[0].ConsumeQuantity;
        optAllocatedItemGrid.FloorStock = document.getElementById("TxtReturnQuantity").value;
        optAllocatedItemGrid.WarehouseName = $('#SelFloorGodown').dxSelectBox('instance').option('text');
        optAllocatedItemGrid.Bin = $('#SelBinName').dxSelectBox('instance').option('text');
        optAllocatedItemGrid.BinID = SelBinName;
        optAllocatedItemGrid.MachineName = BatchWisdata[0].MachineName;

        AllocatedItemGrid.push(optAllocatedItemGrid);
    }

    AllocatedItem();

    if (ItemGrid._options.dataSource.length === 1) {
        $("#IssueFloorStock").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", BatchWisdata[0].DepartmentID]);
        $("#IssueFloorStock").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", BatchWisdata[0].JobBookingJobCardContentsID]);
    }
    $("#RadioButtonReturnToStock").dxRadioGroup({
        disabled: true
    });
});

$("#OpenPopupJobcard").click(function () {
    document.getElementById("OpenPopupJobcard").setAttribute("data-toggle", "modal");
    document.getElementById("OpenPopupJobcard").setAttribute("data-target", "#largeModalFiltrJobcard");

    $("#FiltrJobcardGrid").dxDataGrid({ clearSelection: true });
    var grid = $("#FiltrJobcardGrid").dxDataGrid('instance');
    grid.clearSelection();
});

$("#CreateButton").click(function () {
    GblStatus = "";
    document.getElementById("RTSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#BtnNew").click(function () {
    location.reload();
});

$.ajax({
    type: "POST",
    url: "WebService_ReturnToStock.asmx/GetWarehouseList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SelFloorGodown = JSON.parse(res.toString());

        $("#SelFloorGodown").dxSelectBox({
            items: SelFloorGodown
        });
    }
});

$("#BtnSave").click(function () {
    var prefix = "RTS";
    var AllotedItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var AllotedItemGridRow = AllotedItemGrid.totalCount();
    if (AllotedItemGridRow <= 0) {
        DevExpress.ui.notify("Please select issue voucher details to return to floor stock", "error", 1000);
        return false;
    }
    //var SelDepartment = $('#SelDepartment').dxSelectBox('instance').option('value');
    var SelDepartment = AllotedItemGrid._options.dataSource[0].DepartmentID;
    var TxtJobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[0].JobBookingJobCardContentsID;
    //var TxtJCN = document.getElementById("TxtJCN").value;
    //var TxtContentName = document.getElementById("TxtContentName").value;
    //var TxtJobName = document.getElementById("TxtJobName").value;
    var VoucherDate = $('#RTSDate').dxDateBox('instance').option('value');

    if (RadioValue === "Job Issue Vouchers") {
        //if (TxtJCN === "" || TxtJCN === undefined || TxtJCN === null) {
        //    DevExpress.ui.notify("Please Choose Job Card No...!", "error", 1000);
        //    var text = "Please Choose Job Card No...!";
        //    document.getElementById("TxtJCN").value = "";
        //    document.getElementById("TxtJCN").focus();
        //    document.getElementById("ValStrTxtJCN").style.display = "block";
        //    document.getElementById("ValStrTxtJCN").innerHTML = text;
        //    return false;
        //} else {
        //    document.getElementById("ValStrTxtJCN").style.display = "none";
        //}
    }
    if (RadioValue === "General Issue Vouchers") {
        //if (SelDepartment === "" || SelDepartment === undefined || SelDepartment === null) {
        //    DevExpress.ui.notify("Please Choose Department name..!", "error", 1000);
        //    var text = "Please Choose Department name..!";
        //    document.getElementById("SelDepartment").focus();
        //    document.getElementById("ValStrSelDepartment").style.display = "block";
        //    document.getElementById("ValStrSelDepartment").innerHTML = text;
        //    return false;
        //}
        //else {
        //    document.getElementById("ValStrSelDepartment").style.display = "none";
        //}
    }

    var TtlStock = 0;
    for (var C = 0; C < AllotedItemGridRow; C++) {
        TtlStock = TtlStock + Number(AllotedItemGrid._options.dataSource[C].FloorStock);
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    if (AllotedItemGridRow > 0) {
        //for (var A = 0; A < AllotedItemGridRow; A++) {
        OperationRecordMain = {};
        OperationRecordMain.VoucherID = -25;
        OperationRecordMain.VoucherDate = VoucherDate;
        OperationRecordMain.DepartmentID = SelDepartment;
        OperationRecordMain.TotalQuantity = TtlStock;
        //OperationRecordMain.JobBookingJobCardContentsID = document.getElementById("TxtJobBookingJobCardContentsID").value;
        OperationRecordMain.JobBookingJobCardContentsID = TxtJobBookingJobCardContentsID;
        jsonObjectsRecordMain.push(OperationRecordMain);
        //}
    }

    var jsonObjectsRecordDetail = [];
    var jsonObjectsConsumptionDetail = [];
    var OperationRecordDetail = {};
    var consumptionRecordDetail = {};
    if (AllotedItemGridRow > 0) {
        for (var e = 0; e < AllotedItemGridRow; e++) {
            OperationRecordDetail = {};
            consumptionRecordDetail = {};

            OperationRecordDetail.TransID = e + 1;
            OperationRecordDetail.ParentTransactionID = AllotedItemGrid._options.dataSource[e].ParentTransactionID;
            OperationRecordDetail.IssueTransactionID = AllotedItemGrid._options.dataSource[e].TransactionID;
            OperationRecordDetail.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
            OperationRecordDetail.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
            OperationRecordDetail.JobBookingID = AllotedItemGrid._options.dataSource[e].JobBookingID;
            OperationRecordDetail.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
            OperationRecordDetail.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
            OperationRecordDetail.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
            OperationRecordDetail.ReceiptQuantity = AllotedItemGrid._options.dataSource[e].FloorStock;
            OperationRecordDetail.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
            OperationRecordDetail.FloorWarehouseID = AllotedItemGrid._options.dataSource[e].FloorWarehouseID;
            OperationRecordDetail.StockUnit = AllotedItemGrid._options.dataSource[e].StockUnit;
            OperationRecordDetail.WarehouseID = AllotedItemGrid._options.dataSource[e].BinID;

            consumptionRecordDetail.TransID = e + 1;
            consumptionRecordDetail.ParentTransactionID = AllotedItemGrid._options.dataSource[e].ParentTransactionID;
            consumptionRecordDetail.IssueTransactionID = AllotedItemGrid._options.dataSource[e].TransactionID;
            consumptionRecordDetail.DepartmentID = AllotedItemGrid._options.dataSource[e].DepartmentID;
            consumptionRecordDetail.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
            consumptionRecordDetail.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
            consumptionRecordDetail.JobBookingID = AllotedItemGrid._options.dataSource[e].JobBookingID;
            consumptionRecordDetail.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
            consumptionRecordDetail.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
            consumptionRecordDetail.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
            consumptionRecordDetail.ReturnQuantity = AllotedItemGrid._options.dataSource[e].FloorStock;
            consumptionRecordDetail.IssueQuantity = AllotedItemGrid._options.dataSource[e].FloorStock;
            consumptionRecordDetail.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
            consumptionRecordDetail.FloorWarehouseID = AllotedItemGrid._options.dataSource[e].FloorWarehouseID;
            consumptionRecordDetail.StockUnit = AllotedItemGrid._options.dataSource[e].StockUnit;
            consumptionRecordDetail.WarehouseID = AllotedItemGrid._options.dataSource[e].BinID;

            jsonObjectsRecordDetail.push(OperationRecordDetail);
            jsonObjectsConsumptionDetail.push(consumptionRecordDetail);
        }
    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);
    jsonObjectsConsumptionDetail = JSON.stringify(jsonObjectsConsumptionDetail);


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
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    type: "POST",
                    url: "WebService_ReturnToStock.asmx/UpdateRTS",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtReturnToStockID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsConsumptionMain:' + jsonObjectsRecordMain + ',jsonObjectsConsumptionDetail:' + jsonObjectsConsumptionDetail + '}',
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
                        if (results.d.includes("Success")) {
                            Title = "Updated...";
                            Text = "Your data Updated...";
                            Type = "success";
                        } else if (results.d.includes("Can't")) {
                            Title = results.d.split(",")[1];
                            Text = results.d;
                            Type = "warning";
                        } else if (results.d.includes("Error:")) {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        swal(Title, Text, Type);
                        if (Type === "success") window.location.reload();

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
                    url: "WebService_ReturnToStock.asmx/SaveRTSData",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',jsonObjectsConsumptionMain:' + jsonObjectsRecordMain + ',jsonObjectsConsumptionDetail:' + jsonObjectsConsumptionDetail + '}',
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
                        if (results.d.includes("Success")) {
                            Title = "Success...";
                            Text = "Your data Saved...";
                            Type = "success";
                        } else if (results.d.includes("Can't")) {
                            Title = results.d.split(",")[1];
                            Text = results.d;
                            Type = "warning";
                        } else if (results.d.includes("Error:")) {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        swal(Title, Text, Type);
                        if (Type === "success") window.location.reload();
                    },
                    error: function errorFunc(jqXHR) {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });
});

$("#EditButton").click(function () {
    var TxtReturnToStockID = document.getElementById("TxtReturnToStockID").value;
    if (TxtReturnToStockID === "" || TxtReturnToStockID === null || TxtReturnToStockID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("RTSPrintButton").disabled = false;
    document.getElementById("BtnDeletePopUp").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    document.getElementById("TxtRTSVoucherNo").value = sholistData[0].VoucherNo;
    $("#RTSDate").dxDateBox({
        value: sholistData[0].VoucherDate
    });

    $.ajax({
        type: "POST",
        url: "WebService_ReturnToStock.asmx/SelectedRow",
        data: '{transactionID:' + JSON.stringify(TxtReturnToStockID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var IssueRetrive = JSON.parse(res);

            AllocatedItemGrid = [];
            AllocatedItemGrid = IssueRetrive;

            AllocatedItem();
            if (IssueRetrive.length > 0) {
                var JCID = IssueRetrive[0].JobBookingJobCardContentsID;
                if (Number(JCID) > 0) {
                    $("#RadioButtonReturnToStock").dxRadioGroup({
                        value: priorities[0],
                        disabled: true
                    });
                    RadioValue = "Job Issue Vouchers";
                } else {
                    $("#RadioButtonReturnToStock").dxRadioGroup({
                        value: priorities[1],
                        disabled: true
                    });
                    RadioValue = "General Issue Vouchers";
                }
                $("#IssueFloorStock").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", IssueRetrive[0].DepartmentID]);
                $("#IssueFloorStock").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", IssueRetrive[0].JobBookingJobCardContentsID]);
            }
        }
    });
});

$("#DeleteButton").click(function () {
    var TxtReturnToStockID = document.getElementById("TxtReturnToStockID").value;
    if (TxtReturnToStockID === "" || TxtReturnToStockID === null || TxtReturnToStockID === undefined) {
        alert("Please Choose any row from below Grid..!");
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
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_ReturnToStock.asmx/DeleteRTS",
                data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtReturnToStockID").value) + '}',
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
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

function AllocatedItem() {
    $("#AllotedItemGrid").dxDataGrid({
        dataSource: AllocatedItemGrid
    });
}

$("#RTSPrintButton").click(function () {
    var TxtPOID = document.getElementById("TxtReturnToStockID").value;
    var url = "PrintReturnToStock.aspx?TI=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});