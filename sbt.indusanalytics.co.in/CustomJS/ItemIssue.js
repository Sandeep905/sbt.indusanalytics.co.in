"use strict";

var GblStatus = "";
var CreateGridData = [];
var JCdata = "";
var GblIssueNo = "";
var Groupdata = "";
var Departmentname = "";
var RadioValue = "";
var ValRES1 = "";
var PendingPicklist = "";
var ColumnString = "";
var DynamicColPush = [];
var BatchWisdata = [];
var sholistData = [];
var PickListGriddata = [];
var existDepartment = [];
var FilterDepartment = [];

var AllocatedItemGrid = [];
var BatchWiseGrid = [];

RadioValue = "Job Allocated";
ColumnString = "PicklistTransactionID,PicklistReleaseTransactionID,JobBookingJobCardContentsID,DepartmentID,MachineID,ProcessID,ItemID,ItemGroupID,ItemGroupNameID,ItemSubGroupID,PicklistNo,ReleaseNo,BookingNo,JobCardNo,JobName,ContentName,ProcessName,Department,MachineName,ItemCode,ItemGroup,SubGroup,ItemName,ItemDescription,StockUnit,PhysicalStock,AllocatedStock,WtPerPacking,UnitPerPacking,ConversionFactor,ReleaseQuantity,IssueQuantity,PendingQuantity";

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

PendingPicklistData();
var priorities = ["Job Allocated", "All"];
$("#RadioButtonPicklistIssue").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = "";
        RadioValue = e.value;
        radioGroup();
    }
});

//radioGroup();

$("#IssueDate").dxDateBox({
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

$("#SlipDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelDepartment").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
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
        $.ajax({
            type: "POST",
            url: "WebService_ItemIssue.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(e.value) + '}',
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

$("#PicklistGrid").dxDataGrid({
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
    paging: {
        pageSize: 15
    },
    height: function () {
        return window.innerHeight / 3;
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 25, 50, 100]
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
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        PickListGriddata = [];
        PickListGriddata = selectedItems.selectedRowsData;
        document.getElementById("TxtIssuedQuantity").value = PickListGriddata[0].IssueQuantity;
        var ItemId = PickListGriddata[0].ItemID;
        $.ajax({
            type: "POST",
            url: "WebService_ItemIssue.asmx/GetStockBatchWise",
            data: '{ItemId:' + JSON.stringify(ItemId) + '}',
            //   data: '{ItemId:' + JSON.stringify(ItemId) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var StockRES1 = JSON.parse(res.toString());
                BatchWiseGrid = StockRES1;
                StockBatchWise();

            }
        });
    }
});

$("#FiltrJobcardGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: {
        pageSize: 15
    },
    height: function () {
        return window.innerHeight / 2;
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
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (Items) {
        JCdata = Items.selectedRowsData;
        if (JCdata !== [] && JCdata !== "") {
            document.getElementById("TxtJCN").value = JCdata[0].JobCardContentNo;
            document.getElementById("TxtJobName").value = JCdata[0].JobName;
            document.getElementById("TxtJobBookingID").value = JCdata[0].JobBookingID;
            document.getElementById("TxtJobBookingJobCardContentsID").value = JCdata[0].JobBookingJobCardContentsID;
            document.getElementById("TxtLedgerID").value = JCdata[0].LedgerID;
            document.getElementById("TxtJobBookingNo").value = JCdata[0].JobBookingNo;
            document.getElementById("TxtJobCardContentNo").value = JCdata[0].JobCardContentNo;
            document.getElementById("TxtContentName").value = JCdata[0].PlanContName;

            existDepartment = { 'FilterDep': Departmentname };
            FilterDepartment = existDepartment.FilterDep.filter(function (el) {
                return el.JobBookingJobCardContentsID === document.getElementById("TxtJobBookingJobCardContentsID").value;
            });

            $("#SelDepartment").dxSelectBox({
                items: FilterDepartment
            });
        }
    },
    columns: [{ dataField: "JobBookingNo", visible: true, caption: "Booking No" },
    { dataField: "JobCardContentNo", visible: true, caption: "Job Card No." },
    { dataField: "JobName", visible: true, caption: "Job Name" },
    { dataField: "PlanContName", visible: true, caption: "Content Name" },
    { dataField: "JobBookingID", visible: false },
    { dataField: "JobBookingJobCardContentsID", visible: false },
    { dataField: "LedgerID", visible: false }
    ]
});

$("#IssueShowListGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: {
        pageSize: 50
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 125, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (Showlist) {
        sholistData = [];
        sholistData = Showlist.selectedRowsData;
        document.getElementById("TxtIssueID").value = sholistData[0].TransactionID;
    },
    columns: [
        { dataField: "TransactionID", visible: false },
        { dataField: "PicklistTransactionID", visible: false },
        { dataField: "PicklistReleaseTransactionID", visible: false },
        { dataField: "FloorWarehouseID", visible: false },
        { dataField: "DepartmentID", visible: false },
        { dataField: "JobBookingJobCardContentsID", visible: false },
        { dataField: "ItemID", visible: false },
        { dataField: "ItemGroupID", visible: false },
        { dataField: "ItemGroupNameID", visible: false },
        { dataField: "ItemSubGroupID", visible: false },
        { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Issue No.", width: 100 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 120 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
        { dataField: "VoucherNo", visible: true, caption: "Issue No.", width: 100 },
        { dataField: "VoucherDate", visible: true, caption: "Issue Date", width: 100, dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
        { dataField: "ItemDescription", visible: false },
        { dataField: "PicklistNo", visible: true, caption: "Picklist No.", width: 100 },
        { dataField: "DepartmentName", visible: true, caption: "Department", width: 150 },
        { dataField: "JobCardNo", visible: true, caption: "J.C. No.", width: 100 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "ContentName", visible: true, caption: "Content Name", width: 200 },
        { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "StockUnit", width: 100 },
        { dataField: "UserName", visible: true, caption: "Created By", width: 100 },
        { dataField: "Narration", visible: true, caption: "Remark", width: 300 }
    ],
    summary: {
        totalItems: [{
            column: "IssueQuantity",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }]
    }
});

function PendingPicklistData() {
    PendingPicklist = [];
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebService_ItemIssue.asmx/JobAllocatedPicklist",
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
                PendingPicklist = JSON.parse(res.toString());
            }
        });
    } catch (e) {
        console.log(e);
    }
}

//Add Item(PicklistGrid)
function radioGroup() {
    var PendingPick = { 'ExistRec': PendingPicklist };
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("TxtJCN").value = "";
    BatchWiseGrid = [];
    StockBatchWise();
    ValRES1 = [];
    if (RadioValue === "Job Allocated") {
        ValRES1 = PendingPick.ExistRec.filter(function (el) {
            return el.JobBookingJobCardContentsID > 0;
        });
        PicklistGrid();
    } else if (RadioValue === "All") {
        ValRES1 = PendingPick.ExistRec.filter(function (el) {
            return el.JobBookingJobCardContentsID === 0;
        });
        PicklistGrid();
        //$.ajax({
        //    type: "POST",
        //    url: "WebService_ItemIssue.asmx/AllPicklist",
        //    data: '{}',
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

        //        PicklistGrid();

        //    }
        //});
    }
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    $("#PicklistGrid").dxDataGrid('instance').clearFilter();
}

// GEnerate Issue No
CreateIssueNO();
function CreateIssueNO() {
    var prefix = "IS";

    $.ajax({
        type: "POST",
        url: "WebService_ItemIssue.asmx/GetIssueNO",
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
            GblIssueNo = "";
            if (res !== "") {
                GblIssueNo = res;
                document.getElementById("TxtIssueNo").value = GblIssueNo;
                document.getElementById("TxtSlipNo").value = GblIssueNo;
            }
        }
    });
}

//Floor Warehouse List and Bin List
$.ajax({
    type: "POST",
    url: "WebService_ItemIssue.asmx/GetWarehouseList",
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

//Department Name
$.ajax({
    type: "POST",
    url: "WebService_ItemIssue.asmx/DepartmentName",
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
        Departmentname = [];
        Departmentname = JSON.parse(res);

        FilterDepartment = Departmentname;

        $("#SelDepartment").dxSelectBox({
            items: FilterDepartment
        });
    }
});

//Get JobcardList
$.ajax({
    type: "POST",
    url: "WebService_ItemIssue.asmx/JobCardRender",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());

        $("#FiltrJobcardGrid").dxDataGrid({
            dataSource: RES1
        });
    }
});

//Get Pick Issue Showlist
$("#ShowListButton").click(function () {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_ItemIssue.asmx/Showlist",
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
            $("#IssueShowListGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
});

$("#CreateButton").click(function () {
    GblStatus = "";
    document.getElementById("BtnDeletePopUp").disabled = true;

    radioGroup();
    $("#RadioButtonPicklistIssue").dxRadioGroup({ disabled: false });

    $("#AllotedItemGrid").dxDataGrid({ dataSource: [] });
    $("#AllotedItemGrid").dxDataGrid({ dataSource: [] });

    document.getElementById("IssuePrintButton").disabled = true;

    $("#SelDepartment").dxSelectBox({ value: "" });
    $("#SelFloorGodown").dxSelectBox({ value: "" });
    $("#SelBinName").dxSelectBox({ value: "" });

    document.getElementById("TxtIssueNo").value = GblIssueNo;
    document.getElementById("TxtSlipNo").value = GblIssueNo;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

//Picklist Grid
function PicklistGrid() {
    var DynamicCol = {};
    if (ColumnString !== "") {
        var splitRow = ColumnString.split(',');
        if (RadioValue === "Job Allocated") {
            DynamicColPush = [];
            for (var sp in splitRow) {
                var Colobj = splitRow[sp];
                DynamicCol = {};
                if (Colobj === "PicklistTransactionID" || Colobj === "PicklistReleaseTransactionID" || Colobj === "JobBookingJobCardContentsID" || Colobj === "DepartmentID" || Colobj === "MachineID" || Colobj === "ProcessID" || Colobj === "ItemID" || Colobj === "ItemGroupID" || Colobj === "ItemGroupNameID" || Colobj === "ItemSubGroupID" || Colobj === "BookingNo" || Colobj === "ProcessName" || Colobj === "MachineName" || Colobj === "ItemDescription" || Colobj === "WtPerPacking" || Colobj === "UnitPerPacking" || Colobj === "ConversionFactor" || Colobj === "AllowIssueExtraQuantity") {
                    DynamicCol.dataField = Colobj;
                    DynamicCol.visible = false;
                }
                else {
                    if (Colobj === "JobName") {
                        DynamicCol.width = 250;
                    } else {
                        DynamicCol.width = 100;
                    }
                    DynamicCol.dataField = Colobj;
                    DynamicCol.visible = true;
                }

                //DynamicCol.dataField = Colobj;
                //DynamicCol.visible = true;
                //DynamicCol.width = 100;

                DynamicColPush.push(DynamicCol);
            }
        }
        else if (RadioValue === "All") {
            DynamicColPush = [];
            for (var sp1 in splitRow) {
                var ColobjE = splitRow[sp1];
                DynamicCol = {};
                if (ColobjE === "PicklistTransactionID" || ColobjE === "PicklistReleaseTransactionID" || ColobjE === "JobBookingJobCardContentsID" || ColobjE === "DepartmentID" || ColobjE === "MachineID" || ColobjE === "ProcessID" || ColobjE === "ItemID" || ColobjE === "ItemGroupID" || ColobjE === "ItemGroupNameID" || ColobjE === "ItemSubGroupID" || ColobjE === "BookingNo" || ColobjE === "JobCardNo" || ColobjE === "JobName" || ColobjE === "ContentName" || ColobjE === "ProcessName" || ColobjE === "MachineName" || ColobjE === "ItemDescription" || ColobjE === "WtPerPacking" || ColobjE === "UnitPerPacking" || ColobjE === "ConversionFactor" || ColobjE === "AllowIssueExtraQuantity") {
                    DynamicCol.dataField = ColobjE;
                    DynamicCol.visible = false;
                }
                else {
                    DynamicCol.dataField = ColobjE;
                    DynamicCol.visible = true;
                    DynamicCol.width = 100;
                }
                //DynamicCol.dataField = Colobj;
                //DynamicCol.visible = true;
                //DynamicCol.width = 100;

                DynamicColPush.push(DynamicCol);
            }
        }
    }
    $("#PicklistGrid").dxDataGrid({
        dataSource: ValRES1,
        columns: DynamicColPush
    });
}

//BatchStock Initialised
$("#StockBatchWiseGrid").dxDataGrid({
    dataSource: BatchWiseGrid,
    //columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 4;
    },
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
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedBatchWisdata) {
        BatchWisdata = [];
        BatchWisdata = selectedBatchWisdata.selectedRowsData;
        //document.getElementById("TxtQuantity").value = Number(BatchWisdata[0].BatchStock);
        document.getElementById("TxtUnitDecimalPlace").value = Number(BatchWisdata[0].UnitDecimalPlace);
        if (PickListGriddata.length > 0) {
            if (Number(PickListGriddata[0].PendingQuantity) > Number(BatchWisdata[0].BatchStock)) {
                document.getElementById("TxtQuantity").value = Number(BatchWisdata[0].BatchStock);
            } else {
                document.getElementById("TxtQuantity").value = Number(PickListGriddata[0].PendingQuantity);
            }
        }
        //if (Number(document.getElementById("TxtUnitDecimalPlace").value))
    },
    columns: [
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID", width: 100 },
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
        { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
        { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID" },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 150 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 500 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description" },
        { dataField: "StockUnit", visible: true, caption: "Unit", width: 100 },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 150 },
        { dataField: "GRNNo", visible: false, caption: "GRNNo" },
        { dataField: "GRNDate", visible: false, caption: "GRNDate" },
        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking" },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking" },
        { dataField: "ConversionFactor", visible: false, caption: "Conversion Factor" },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace" }
    ]
});

//AllocatedGrid Initialised
$("#AllotedItemGrid").dxDataGrid({
    dataSource: AllocatedItemGrid,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    //filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none"
    },
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
        setDataGridRowCss(e);
    },
    onRowRemoved: function (e) {
        if (e.component.totalCount() === 0) {
            $("#RadioButtonPicklistIssue").dxRadioGroup({
                disabled: false
            });
            $("#PicklistGrid").dxDataGrid('instance').clearFilter();
        }
    },
    columns: [
        { dataField: "PicklistNo", visible: true, caption: "Picklist No.", width: 120 },
        { dataField: "ReleaseNo", visible: true, caption: "Release No.", width: 80 },
        { dataField: "BookingNo", visible: false, caption: "BookingNo" },
        { dataField: "JobCardNo", visible: true, caption: "Job Card No.", width: 120 },
        { dataField: "JobName", visible: true, caption: "Job Name", width: 200 },
        { dataField: "ContentName", visible: true, caption: "Content Name", width: 150 },
        { dataField: "ProcessName", visible: true, caption: "Process", width: 100 },
        { dataField: "MachineName", visible: true, caption: "Machine", width: 100 },
        { dataField: "DepartmentName", visible: true, caption: "Department", width: 100 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
        { dataField: "ItemDescription", visible: false, caption: "Item Description", width: 120 },
        { dataField: "StockUnit", visible: true, caption: "Unit", width: 60 },
        { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", width: 80 },
        { dataField: "BatchStock", visible: false, caption: "Batch Stock", width: 80 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 150 },
        { dataField: "GRNNo", visible: false, caption: "GRNNo" },
        { dataField: "GRNDate", visible: false, caption: "GRNDate" },
        { dataField: "Warehouse", visible: true, caption: "Warehouse", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 80 },
        { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking" },
        { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking" },
        { dataField: "ConversionFactor", visible: false, caption: "Conversion Factor" },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace" }
        //{ dataField: "BookingNo", visible: false, caption: "BookingNo" }, PicklistOrderNo
    ],
    summary: {
        totalItems: [{
            column: "IssueQuantity",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }]
    }

});

//Get JobcardList Popup
function keydownFunction() {
    document.getElementById("TxtJCN").value = "";

    document.getElementById("TxtJobName").value = "";
    document.getElementById("TxtJobBookingID").value = "";
    document.getElementById("TxtJobBookingJobCardContentsID").value = "";
    document.getElementById("TxtLedgerID").value = "";
    document.getElementById("TxtJobBookingNo").value = "";
    document.getElementById("TxtJobCardContentNo").value = "";
    document.getElementById("TxtContentName").value = "";

    $("#OpenPopupJobcard").click();
}

function keyupFunction() {
    document.getElementById("TxtJCN").value = "";
    document.getElementById("TxtJobName").value = "";
    document.getElementById("TxtJobBookingID").value = "";
    document.getElementById("TxtJobBookingJobCardContentsID").value = "";
    document.getElementById("TxtLedgerID").value = "";
    document.getElementById("TxtJobBookingNo").value = "";
    document.getElementById("TxtJobCardContentNo").value = "";
    document.getElementById("TxtContentName").value = "";
}

$("#OpenPopupJobcard").click(function () {
    document.getElementById("OpenPopupJobcard").setAttribute("data-toggle", "modal");
    document.getElementById("OpenPopupJobcard").setAttribute("data-target", "#largeModalFiltrJobcard");

    $("#FiltrJobcardGrid").dxDataGrid({ clearSelection: true });
    var grid = $("#FiltrJobcardGrid").dxDataGrid('instance');
    grid.clearSelection();
});

$("#RefreshButton").click(function () {
    location.reload();
});

//AllocatedItemGrid
function AllocatedItem() {
    $("#AllotedItemGrid").dxDataGrid({
        dataSource: AllocatedItemGrid
    });
}

//Batch Stock
function StockBatchWise() {
    $("#StockBatchWiseGrid").dxDataGrid({
        dataSource: BatchWiseGrid
    });
}

//Data Add in Last Grid(AllocatedItemGrid) from BatchStockGrid
$("#BtnAddRow").click(function () {

    var TxtQuantity = document.getElementById("TxtQuantity").value;
    var TxtIssuedQuantity = document.getElementById("TxtIssuedQuantity").value;

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();
    //$("#dataGridContainer").dxDataGrid("columnOption", "Status", {
    //    selectedFilterOperation: "=",
    //        filterValue: "Finished"
    //});
    if (TxtQuantity === "" || TxtQuantity === undefined || TxtQuantity === null) {
        DevExpress.ui.notify("Please Enter Quantity..!", "error", 1000);
        document.getElementById("TxtQuantity").focus();
        return false;
    }
    try {
        if (BatchWisdata.length > 0) {
            if (TxtQuantity > BatchWisdata[0].BatchStock) {
                DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
                document.getElementById("TxtQuantity").focus();
                return false;
            }
            var addedqty = 0;
            if (ItemGridRow > 0) {
                for (var check = 0; check < ItemGridRow; check++) {
                    if (ItemGrid._options.dataSource[check].PicklistTransactionID === PickListGriddata[0].PicklistTransactionID && ItemGrid._options.dataSource[check].PicklistReleaseTransactionID === PickListGriddata[0].PicklistReleaseTransactionID && ItemGrid._options.dataSource[check].JobBookingJobCardContentsID === PickListGriddata[0].JobBookingJobCardContentsID && ItemGrid._options.dataSource[check].DepartmentID === PickListGriddata[0].DepartmentID && ItemGrid._options.dataSource[check].ProcessID === PickListGriddata[0].ProcessID && ItemGrid._options.dataSource[check].ItemID === BatchWisdata[0].ItemID && ItemGrid._options.dataSource[check].BatchNo === BatchWisdata[0].BatchNo && ItemGrid._options.dataSource[check].WarehouseID === BatchWisdata[0].WarehouseID) {
                        DevExpress.ui.notify("This item already exist..! You can not add it..", "warning", 1000);
                        return false;
                    }
                }

                for (check = 0; check < ItemGridRow; check++) {
                    if (ItemGrid._options.dataSource[check].PicklistTransactionID === PickListGriddata[0].PicklistTransactionID && ItemGrid._options.dataSource[check].PicklistReleaseTransactionID === PickListGriddata[0].PicklistReleaseTransactionID && ItemGrid._options.dataSource[check].JobBookingJobCardContentsID === PickListGriddata[0].JobBookingJobCardContentsID && ItemGrid._options.dataSource[check].DepartmentID === PickListGriddata[0].DepartmentID && ItemGrid._options.dataSource[check].ProcessID === PickListGriddata[0].ProcessID && ItemGrid._options.dataSource[check].ItemID === BatchWisdata[0].ItemID) {
                        addedqty = Number(addedqty) + Number(ItemGrid._options.dataSource[check].IssueQuantity);
                    }
                }
            }
            addedqty = Number(addedqty) + Number(TxtQuantity);
            if (PickListGriddata[0].AllowIssueExtraQuantity === false) {
                if (Number(addedqty) > Number(PickListGriddata[0].PendingQuantity)) {
                    DevExpress.ui.notify("Can't issue more than release quantity", "warning", 1000);
                    return false;
                }
            }
        } else {
            DevExpress.ui.notify("Please Select Any Item...!", "error", 1000);
            return false;
        }
        AllocatedItemGrid = [];
        var optAllocatedItemGrid = {};

        if (ItemGridRow > 0) {
            for (var t = 0; t <= ItemGridRow; t++) {
                if (t === ItemGridRow) {
                    optAllocatedItemGrid = {};

                    optAllocatedItemGrid.PicklistTransactionID = PickListGriddata[0].PicklistTransactionID;
                    optAllocatedItemGrid.PicklistReleaseTransactionID = PickListGriddata[0].PicklistReleaseTransactionID;
                    optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
                    optAllocatedItemGrid.DepartmentID = PickListGriddata[0].DepartmentID;
                    optAllocatedItemGrid.MachineID = PickListGriddata[0].MachineID;
                    optAllocatedItemGrid.ProcessID = PickListGriddata[0].ProcessID;
                    optAllocatedItemGrid.ParentTransactionID = BatchWisdata[0].ParentTransactionID;
                    optAllocatedItemGrid.ItemID = BatchWisdata[0].ItemID;
                    optAllocatedItemGrid.ItemGroupID = BatchWisdata[0].ItemGroupID;
                    optAllocatedItemGrid.ItemGroupNameID = BatchWisdata[0].ItemGroupNameID;
                    optAllocatedItemGrid.ItemSubGroupID = BatchWisdata[0].ItemSubGroupID;
                    optAllocatedItemGrid.WarehouseID = BatchWisdata[0].WarehouseID;
                    optAllocatedItemGrid.PicklistNo = PickListGriddata[0].PicklistNo;
                    optAllocatedItemGrid.ReleaseNo = PickListGriddata[0].ReleaseNo;
                    optAllocatedItemGrid.BookingNo = PickListGriddata[0].BookingNo;
                    optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
                    optAllocatedItemGrid.JobName = PickListGriddata[0].JobName;
                    optAllocatedItemGrid.ContentName = PickListGriddata[0].ContentName;
                    optAllocatedItemGrid.ProcessName = PickListGriddata[0].ProcessName;
                    optAllocatedItemGrid.MachineName = PickListGriddata[0].MachineName;
                    optAllocatedItemGrid.DepartmentName = PickListGriddata[0].Department;
                    optAllocatedItemGrid.ItemCode = BatchWisdata[0].ItemCode;
                    optAllocatedItemGrid.ItemGroupName = BatchWisdata[0].ItemGroupName;
                    optAllocatedItemGrid.ItemSubGroupName = BatchWisdata[0].ItemSubGroupName;
                    optAllocatedItemGrid.ItemName = BatchWisdata[0].ItemName;
                    optAllocatedItemGrid.ItemDescription = BatchWisdata[0].ItemDescription;
                    optAllocatedItemGrid.StockUnit = BatchWisdata[0].StockUnit;
                    optAllocatedItemGrid.BatchStock = BatchWisdata[0].BatchStock;
                    optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtQuantity").value;
                    optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
                    optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
                    optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
                    optAllocatedItemGrid.Warehouse = BatchWisdata[0].Warehouse;
                    optAllocatedItemGrid.Bin = BatchWisdata[0].Bin;
                    optAllocatedItemGrid.WtPerPacking = BatchWisdata[0].WtPerPacking;
                    optAllocatedItemGrid.UnitPerPacking = BatchWisdata[0].UnitPerPacking;
                    optAllocatedItemGrid.ConversionFactor = BatchWisdata[0].ConversionFactor;

                    AllocatedItemGrid.push(optAllocatedItemGrid);
                } else {
                    optAllocatedItemGrid = {};

                    optAllocatedItemGrid.PicklistTransactionID = ItemGrid._options.dataSource[t].PicklistTransactionID;
                    optAllocatedItemGrid.PicklistReleaseTransactionID = ItemGrid._options.dataSource[t].PicklistReleaseTransactionID;
                    optAllocatedItemGrid.JobBookingJobCardContentsID = ItemGrid._options.dataSource[t].JobBookingJobCardContentsID;
                    optAllocatedItemGrid.DepartmentID = ItemGrid._options.dataSource[t].DepartmentID;
                    optAllocatedItemGrid.MachineID = ItemGrid._options.dataSource[t].MachineID;
                    optAllocatedItemGrid.ProcessID = ItemGrid._options.dataSource[t].ProcessID;
                    optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
                    optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
                    optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
                    optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
                    optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
                    optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;
                    optAllocatedItemGrid.PicklistNo = ItemGrid._options.dataSource[t].PicklistNo;
                    optAllocatedItemGrid.ReleaseNo = ItemGrid._options.dataSource[t].ReleaseNo;
                    optAllocatedItemGrid.BookingNo = ItemGrid._options.dataSource[t].BookingNo;
                    optAllocatedItemGrid.JobCardNo = ItemGrid._options.dataSource[t].JobCardNo;
                    optAllocatedItemGrid.JobName = ItemGrid._options.dataSource[t].JobName;
                    optAllocatedItemGrid.ContentName = ItemGrid._options.dataSource[t].ContentName;
                    optAllocatedItemGrid.ProcessName = ItemGrid._options.dataSource[t].ProcessName;
                    optAllocatedItemGrid.MachineName = ItemGrid._options.dataSource[t].MachineName;
                    optAllocatedItemGrid.DepartmentName = ItemGrid._options.dataSource[t].DepartmentName;
                    optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
                    optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
                    optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
                    optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
                    optAllocatedItemGrid.ItemDescription = ItemGrid._options.dataSource[t].ItemDescription;
                    optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                    optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
                    optAllocatedItemGrid.BatchStock = ItemGrid._options.dataSource[t].BatchStock;
                    optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                    optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
                    optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
                    optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
                    optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                    optAllocatedItemGrid.WtPerPacking = ItemGrid._options.dataSource[t].WtPerPacking;
                    optAllocatedItemGrid.UnitPerPacking = ItemGrid._options.dataSource[t].UnitPerPacking;
                    optAllocatedItemGrid.ConversionFactor = ItemGrid._options.dataSource[t].ConversionFactor;

                    AllocatedItemGrid.push(optAllocatedItemGrid);

                }
            }
        }
        else {
            optAllocatedItemGrid = {};

            optAllocatedItemGrid.PicklistTransactionID = PickListGriddata[0].PicklistTransactionID;
            optAllocatedItemGrid.PicklistReleaseTransactionID = PickListGriddata[0].PicklistReleaseTransactionID;
            optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
            optAllocatedItemGrid.DepartmentID = PickListGriddata[0].DepartmentID;
            optAllocatedItemGrid.MachineID = PickListGriddata[0].MachineID;
            optAllocatedItemGrid.ProcessID = PickListGriddata[0].ProcessID;
            optAllocatedItemGrid.ParentTransactionID = BatchWisdata[0].ParentTransactionID;
            optAllocatedItemGrid.ItemID = BatchWisdata[0].ItemID;
            optAllocatedItemGrid.ItemGroupID = BatchWisdata[0].ItemGroupID;
            optAllocatedItemGrid.ItemGroupNameID = BatchWisdata[0].ItemGroupNameID;
            optAllocatedItemGrid.ItemSubGroupID = BatchWisdata[0].ItemSubGroupID;
            optAllocatedItemGrid.WarehouseID = BatchWisdata[0].WarehouseID;
            optAllocatedItemGrid.PicklistNo = PickListGriddata[0].PicklistNo;
            optAllocatedItemGrid.ReleaseNo = PickListGriddata[0].ReleaseNo;
            optAllocatedItemGrid.BookingNo = PickListGriddata[0].BookingNo;
            optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
            optAllocatedItemGrid.JobName = PickListGriddata[0].JobName;
            optAllocatedItemGrid.ContentName = PickListGriddata[0].ContentName;
            optAllocatedItemGrid.ProcessName = PickListGriddata[0].ProcessName;
            optAllocatedItemGrid.MachineName = PickListGriddata[0].MachineName;
            optAllocatedItemGrid.DepartmentName = PickListGriddata[0].Department;
            optAllocatedItemGrid.ItemCode = BatchWisdata[0].ItemCode;
            optAllocatedItemGrid.ItemGroupName = BatchWisdata[0].ItemGroupName;
            optAllocatedItemGrid.ItemSubGroupName = BatchWisdata[0].ItemSubGroupName;
            optAllocatedItemGrid.ItemName = BatchWisdata[0].ItemName;
            optAllocatedItemGrid.ItemDescription = BatchWisdata[0].ItemDescription;
            optAllocatedItemGrid.StockUnit = BatchWisdata[0].StockUnit;
            optAllocatedItemGrid.BatchStock = BatchWisdata[0].BatchStock;
            optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtQuantity").value;
            optAllocatedItemGrid.BatchNo = BatchWisdata[0].BatchNo;
            optAllocatedItemGrid.GRNNo = BatchWisdata[0].GRNNo;
            optAllocatedItemGrid.GRNDate = BatchWisdata[0].GRNDate;
            optAllocatedItemGrid.Warehouse = BatchWisdata[0].Warehouse;
            optAllocatedItemGrid.Bin = BatchWisdata[0].Bin;
            optAllocatedItemGrid.WtPerPacking = BatchWisdata[0].WtPerPacking;
            optAllocatedItemGrid.UnitPerPacking = BatchWisdata[0].UnitPerPacking;
            optAllocatedItemGrid.ConversionFactor = BatchWisdata[0].ConversionFactor;

            AllocatedItemGrid.push(optAllocatedItemGrid);
        }

        AllocatedItem();

        if (ItemGrid._options.dataSource.length === 1) {
            $("#PicklistGrid").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", PickListGriddata[0].DepartmentID]);
            $("#PicklistGrid").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", PickListGriddata[0].JobBookingJobCardContentsID]);
        }
        $("#RadioButtonPicklistIssue").dxRadioGroup({ disabled: true });

    } catch (e) {
        console.log(e);
    }
});

$("#BtnSave").click(function () {
    var AllotedItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var AllotedItemGridRow = AllotedItemGrid.totalCount();
    if (AllotedItemGridRow <= 0) {
        DevExpress.ui.notify("Please add issue items in list to save!", "error", 1000);
        return false;
    }
    var TxtJCN = "";
    var TxtContentName = "";
    var TxtJobName = "";
    var JobBookingJobCardContentsID = 0;
    var JobBookingID = 0;

    //var SelDepartment = $('#SelDepartment').dxSelectBox('instance').option('value');
    //var TxtJCN = document.getElementById("TxtJCN").value;
    //var TxtContentName = document.getElementById("TxtContentName").value;
    //var TxtJobName = document.getElementById("TxtJobName").value;
    ////console.log(AllotedItemGrid._options.dataSource[0]);
    var prefix = "IS";
    var VoucherDate = $('#IssueDate').dxDateBox('instance').option('value');
    var SelDepartment = AllotedItemGrid._options.dataSource[0].DepartmentID;
    if (RadioValue === "Job Allocated") {
        TxtJCN = AllotedItemGrid._options.dataSource[0].JobCardNo;
        TxtContentName = AllotedItemGrid._options.dataSource[0].ContentName;
        TxtJobName = AllotedItemGrid._options.dataSource[0].JobName;
        JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[0].JobBookingJobCardContentsID;
        JobBookingID = AllotedItemGrid._options.dataSource[0].JobBookingID;
    } else {
        TxtJCN = "";
        TxtContentName = "";
        TxtJobName = "";
        JobBookingJobCardContentsID = 0;
        JobBookingID = 0;
    }
    var SelFloorGodown = $('#SelFloorGodown').dxSelectBox('instance').option('value');
    var SelBinName = $('#SelBinName').dxSelectBox('instance').option('value');
    var SlipDate = $('#SlipDate').dxDateBox('instance').option('value');
    var TxtNarration = document.getElementById("TxtNarration").value;
    if (RadioValue === "Job Allocated") {
        if (TxtJCN === "" || TxtJCN === undefined || TxtJCN === null) {
            DevExpress.ui.notify("Please select Job allocated picklist to issue...!", "error", 1000);
            //var text = "Please select Job Card No...!";
            //document.getElementById("TxtJCN").value = "";
            //document.getElementById("TxtJCN").focus();
            //document.getElementById("ValStrTxtJCN").style.display = "block";
            //document.getElementById("ValStrTxtJCN").innerHTML = text;
            return false;
        } else {
            document.getElementById("ValStrTxtJCN").style.display = "none";
        }
    }
    if (SelDepartment === "" || SelDepartment === undefined || SelDepartment === null) {
        DevExpress.ui.notify("Please add valid picklist to issue on particular department.!", "error", 1000);
        //var text = "Please select Department name..!";
        //document.getElementById("SelDepartment").focus();
        //document.getElementById("ValStrSelDepartment").style.display = "block";
        //document.getElementById("ValStrSelDepartment").innerHTML = text;
        return false;
    }
    else {
        document.getElementById("ValStrSelDepartment").style.display = "none";
    }

    if (SelFloorGodown === "" || SelFloorGodown === undefined || SelFloorGodown === null) {
        DevExpress.ui.notify("Please select floor warehouse..!", "error", 1000);
        var text = "Please select floor warehouse..!";
        document.getElementById("SelFloorGodown").focus();
        document.getElementById("ValStrSelFloorGodown").style.display = "block";
        document.getElementById("ValStrSelFloorGodown").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrSelFloorGodown").style.display = "none";
    }

    if (SelBinName === "" || SelBinName === undefined || SelBinName === null) {
        DevExpress.ui.notify("Please select bin name..!", "error", 1000);
        var text1 = "Please select bin name..!";
        document.getElementById("SelBinName").focus();
        document.getElementById("ValStrSelBinName").style.display = "block";
        document.getElementById("ValStrSelBinName").innerHTML = text1;
        return false;
    } else {
        document.getElementById("ValStrSelBinName").style.display = "none";
    }

    var TtlStock = 0;
    for (var C = 0; C < AllotedItemGridRow; C++) {
        TtlStock = TtlStock + Number(AllotedItemGrid._options.dataSource[C].IssueQuantity);
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    if (AllotedItemGridRow <= 0) return;

    OperationRecordMain = {};
    OperationRecordMain.VoucherID = -19;
    OperationRecordMain.VoucherDate = VoucherDate;
    OperationRecordMain.TotalQuantity = TtlStock;
    OperationRecordMain.DepartmentID = SelDepartment;
    OperationRecordMain.Narration = TxtNarration;
    //OperationRecordMain.JobBookingJobCardContentsID = document.getElementById("TxtJobBookingJobCardContentsID").value;
    OperationRecordMain.JobBookingJobCardContentsID = JobBookingJobCardContentsID;
    OperationRecordMain.DeliveryNoteNo = document.getElementById("TxtSlipNo").value;

    jsonObjectsRecordMain.push(OperationRecordMain);

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    for (var e = 0; e < AllotedItemGridRow; e++) {
        OperationRecordDetail = {};

        OperationRecordDetail.PicklistTransactionID = AllotedItemGrid._options.dataSource[e].PicklistTransactionID;
        OperationRecordDetail.PicklistReleaseTransactionID = AllotedItemGrid._options.dataSource[e].PicklistReleaseTransactionID;
        OperationRecordDetail.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
        OperationRecordDetail.JobBookingID = AllotedItemGrid._options.dataSource[e].JobBookingID;
        OperationRecordDetail.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
        OperationRecordDetail.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
        OperationRecordDetail.TransID = e + 1;
        OperationRecordDetail.ParentTransactionID = AllotedItemGrid._options.dataSource[e].ParentTransactionID;
        OperationRecordDetail.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
        OperationRecordDetail.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
        OperationRecordDetail.WarehouseID = AllotedItemGrid._options.dataSource[e].WarehouseID;
        OperationRecordDetail.IssueQuantity = AllotedItemGrid._options.dataSource[e].IssueQuantity;
        OperationRecordDetail.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
        OperationRecordDetail.StockUnit = AllotedItemGrid._options.dataSource[e].StockUnit;
        OperationRecordDetail.FloorWarehouseID = SelBinName;

        jsonObjectsRecordDetail.push(OperationRecordDetail);

    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);

    ////////////////////CONSUMED TRANSACTION ENTRY

    var ConsumeMain = {};
    var ObjectsConsumeMain = [];
    var ConsumeDetails = {};
    var ObjectsConsumeDetails = [];

    ConsumeMain = {};
    ConsumeMain.VoucherDate = VoucherDate;
    ConsumeMain.TotalQuantity = TtlStock;
    ConsumeMain.DepartmentID = SelDepartment;
    ConsumeMain.Narration = TxtNarration;
    ConsumeMain.JobBookingJobCardContentsID = JobBookingJobCardContentsID;

    ObjectsConsumeMain.push(ConsumeMain);

    for (e = 0; e < AllotedItemGridRow; e++) {
        ConsumeDetails = {};
        ConsumeDetails.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
        ConsumeDetails.JobBookingID = AllotedItemGrid._options.dataSource[e].JobBookingID;
        ConsumeDetails.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
        ConsumeDetails.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
        ConsumeDetails.DepartmentID = SelDepartment;
        ConsumeDetails.ParentTransactionID = AllotedItemGrid._options.dataSource[e].ParentTransactionID;
        ConsumeDetails.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
        ConsumeDetails.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
        ConsumeDetails.WarehouseID = AllotedItemGrid._options.dataSource[e].WarehouseID;
        ConsumeDetails.ReceivedQuantity = AllotedItemGrid._options.dataSource[e].IssueQuantity;
        ConsumeDetails.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
        ConsumeDetails.StockUnit = AllotedItemGrid._options.dataSource[e].StockUnit;
        ConsumeDetails.FloorWarehouseID = SelBinName;
        ConsumeDetails.TransID = e + 1;

        ObjectsConsumeDetails.push(ConsumeDetails);
    }

    ////////// End

    swal({
        title: "Item Issueing...",
        text: 'Are you sure to save item issue..?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_ItemIssue.asmx/UpdateIssue",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtIssueID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',ObjectsConsumeMain:' + JSON.stringify(ObjectsConsumeMain) + ',ObjectsConsumeDetails:' + JSON.stringify(ObjectsConsumeDetails) + '}',
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
                $.ajax({
                    type: "POST",
                    url: "WebService_ItemIssue.asmx/SaveIssueData",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + ',ObjectsConsumeMain:' + JSON.stringify(ObjectsConsumeMain) + ',ObjectsConsumeDetails:' + JSON.stringify(ObjectsConsumeDetails) + '}',
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
                        console.log(jqXHR);
                    }
                });
            }
        });

});

$('#TxtQuantity').keypress(function (event) {
    if (this.type === "text" && event.which !== 13 && event.which !== 34 && event.which !== 39) {
        return isNumber(event, this);
    }
});

$('#TxtQuantity').change(function (event) {
    var x = Number(document.getElementById("TxtUnitDecimalPlace").value);
    this.value = Number(this.value).toFixed(x);
});

function isNumber(evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    if (charCode !== 45 && (charCode !== 46 || $(element).val().indexOf('.') !== -1) && ((charCode < 48 && charCode !== 8) || charCode > 57)) {
        return false;
    }
    else {
        return true;
    }
}

$("#BtnNew").click(function () {
    location.reload();
    $("#RadioButtonPicklistIssue").dxRadioGroup({
        disabled: false
    });
});

$("#DeleteButton").click(function () {
    var TxtIssueID = document.getElementById("TxtIssueID").value;
    if (TxtIssueID === "" || TxtIssueID === null || TxtIssueID === undefined) {
        alert("Please select any issue voucher to delete..!");
        return false;
    }
    swal({
        title: "Are you sure to delete this issue voucher..?",
        text: 'You will not be able to recover this voucher!',
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
                url: "WebService_ItemIssue.asmx/DeleteIssue",
                data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtIssueID").value) + '}',
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
                        Text = "Your data has been deleted successfully...";
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
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

$("#EditButton").click(function () {
    var TxtIssueID = document.getElementById("TxtIssueID").value;
    if (TxtIssueID === "" || TxtIssueID === null || TxtIssueID === undefined) {
        alert("Please select issue vouchers to edit or view..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("IssuePrintButton").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_ItemIssue.asmx/GetIssueVoucherDetails",
        data: '{transactionID:' + JSON.stringify(TxtIssueID) + '}',
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

            AllocatedItemGrid = IssueRetrive;

            AllocatedItem();
            if (IssueRetrive.length > 0) {
                var JCID = IssueRetrive[0].JobBookingJobCardContentsID;
                if (Number(JCID) > 0) {
                    $("#RadioButtonPicklistIssue").dxRadioGroup({
                        value: priorities[0],
                        disabled: true
                    });

                    RadioValue = "Job Allocated";
                } else {
                    $("#RadioButtonPicklistIssue").dxRadioGroup({
                        value: priorities[1],
                        disabled: true
                    });
                    RadioValue = "All";
                }
                PicklistGrid();
                $("#PicklistGrid").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", IssueRetrive[0].DepartmentID]);
                $("#PicklistGrid").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", IssueRetrive[0].JobBookingJobCardContentsID]);
            }
        }
    });

    document.getElementById("TxtIssueNo").value = sholistData[0].VoucherNo;
    document.getElementById("TxtJCN").value = sholistData[0].JobCardNo;
    //document.getElementById("TxtJobBookingID").value = sholistData[0].VoucherNo;    
    //document.getElementById("TxtLedgerID").value = sholistData[0].VoucherNo;
    //document.getElementById("TxtJobBookingNo").value = sholistData[0].VoucherNo;
    document.getElementById("TxtJobBookingJobCardContentsID").value = sholistData[0].JobBookingJobCardContentsID;
    document.getElementById("TxtJobCardContentNo").value = sholistData[0].JobCardNo;
    document.getElementById("TxtJobName").value = sholistData[0].JobName;
    document.getElementById("TxtContentName").value = sholistData[0].ContentName;

    document.getElementById("TxtSlipNo").value = sholistData[0].DeliveryNoteNo;
    document.getElementById("TxtNarration").value = sholistData[0].Narration;

    $("#SelDepartment").dxSelectBox({ value: sholistData[0].DepartmentID });
    $("#IssueDate").dxDateBox({ value: sholistData[0].VoucherDate });
    $("#SlipDate").dxDateBox({ value: sholistData[0].VoucherDate });
    $("#SelFloorGodown").dxSelectBox({ value: sholistData[0].Warehouse });
    $("#SelBinName").dxSelectBox({ value: sholistData[0].FloorWarehouseID });

    document.getElementById("BtnDeletePopUp").disabled = false;
});

$("#IssuePrintButton").click(function () {
    var TxtPOID = document.getElementById("TxtIssueID").value;
    //var url = "PrintIssueItem.aspx?TI=" + TxtPOID;
    var url = "ReportMaterialIssue1.aspx?TransactionID=" + TxtPOID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});