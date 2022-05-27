
var GblStatus = "", GblConsumptionNo = "", RadioValue = "";
var DynamicColPush = [], AllocatedItemGrid = [], DynamicColPush_Allo = [], PickListGriddata = [];
var ValRES1 = "", sholistData = [];

RadioValue = "Job Issue Vouchers";

var priorities = ["Job Issue Vouchers", "General Issue Vouchers", "All"];
$("#RadioButtonConIssue").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = "";
        RadioValue = e.value;
        radioGroup();
    }
});

$("#IssueDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#ConsumptionShowListGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.2;
    },
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    paging: {
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
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
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },

    onSelectionChanged: function (Showlist) {
        sholistData = [];
        sholistData = Showlist.selectedRowsData;

        document.getElementById("TxtConsumptionID").value = sholistData[0].ConsumptionTransactionID;

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
        { dataField: "VoucherDate", visible: true, width: 140, caption: "Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar" },
        { dataField: "ItemCode", visible: true, width: 80, caption: "Item Code" },
        { dataField: "ItemGroupName", visible: true, width: 120, caption: "Item Group" },
        { dataField: "ItemSubGroupName", visible: true, width: 120, caption: "Sub Group" },
        { dataField: "ItemName", visible: true, width: 400, caption: "Item Name" },
        { dataField: "ItemDescription", visible: false },
        { dataField: "DepartmentName", visible: true, width: 150, caption: "Department" },
        { dataField: "JobCardNo", visible: true, width: 120, caption: "J.C. No." },
        { dataField: "StockUnit", visible: true, width: 80, caption: "Unit" },
        { dataField: "ConsumeQuantity", visible: true, width: 100, caption: "Consume Qty" },
        { dataField: "FYear", visible: false, width: 100 },

    ]
});

//Get Show List
Showlist();
function Showlist() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_ItemConsumption.asmx/Showlist",
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

            $("#ConsumptionShowListGrid").dxDataGrid({
                dataSource: RES1
            });            
        }
    });
}

// GEnerate Consumption No
CreateIssueNO();

function CreateIssueNO() {
    var prefix = "IC";

    $.ajax({
        type: "POST",
        url: "WebService_ItemConsumption.asmx/GetConsumptionNO",
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
            GblConsumptionNo = "";
            if (res !== "") {
                GblConsumptionNo = res;
                document.getElementById("Consumption").value = GblConsumptionNo;
                document.getElementById("Consumption").value = GblConsumptionNo;
            }
        }
    });
}

$("#CreateButton").click(function () {

    GblStatus = "";
    //document.getElementById("RTSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

//Add Item(PicklistGrid)
radioGroup();
function radioGroup() {
    if (RadioValue === "Job Issue Vouchers") {
        document.getElementById("LOADER").style.display = "block";
        //document.getElementById("TxtJCN").value = "";
        //BatchWiseGrid = [];
        //StockBatchWise();
        $.ajax({
            type: "POST",
            url: "WebService_ItemConsumption.asmx/JobAllocatedPicklist",
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
                ValRES1 = [];
                ValRES1 = JSON.parse(res.toString());
                PicklistGrid();
            }
        });
    }
    else if (RadioValue === "General Issue Vouchers") {
        document.getElementById("LOADER").style.display = "block";
        //document.getElementById("TxtJCN").value = "";
        //BatchWiseGrid = [];
        //StockBatchWise();
        $.ajax({
            type: "POST",
            url: "WebService_ItemConsumption.asmx/NonJobAllocatedPicklist",
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
                ValRES1 = [];
                ValRES1 = JSON.parse(res.toString());
                PicklistGrid();
            }
        });
    }
    else if (RadioValue === "All") {
        document.getElementById("LOADER").style.display = "block";
        //document.getElementById("TxtJCN").value = "";
        //BatchWiseGrid = [];
        //StockBatchWise();

        $.ajax({
            type: "POST",
            url: "WebService_ItemConsumption.asmx/AllPicklist",
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
                ValRES1 = [];
                ValRES1 = JSON.parse(res.toString());

                PicklistGrid();

            }
        });
    }
}

function PicklistGrid() {

    $("#PicklistGrid").dxDataGrid({
        dataSource: ValRES1,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        paging: {
            enabled: false
        },
        height: function () {
            return window.innerHeight / 2.5;
        },
        allowSorting: false,
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

        onSelectionChanged: function (selectedItems) {
            PickListGriddata = [];
            PickListGriddata = selectedItems.selectedRowsData;
            document.getElementById("TxtQuantity").value = Number(PickListGriddata[0].IssueQuantity);
            //document.getElementById("TxtUnitDecimalPlace").value = Number(PickListGriddata[0].UnitDecimalPlace);
        },

        // columns: DynamicColPush,
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
            { dataField: "MaxVoucherNo", visible: false, width: 100, caption: "Issue Ref.No." },
            { dataField: "VoucherNo", visible: true, width: 100, caption: "Issue No." },
            { dataField: "VoucherDate", visible: true, width: 100, caption: "Issue Date" },
            { dataField: "ItemCode", visible: true, width: 80, caption: "Item Code" },
            { dataField: "ItemGroupName", visible: false, width: 100, caption: "Item Group" },
            { dataField: "ItemSubGroupName", visible: true, width: 120, caption: "Sub Group" },
            { dataField: "ItemName", visible: true, width: 250, caption: "Item Name" },
            { dataField: "ItemDescription", visible: false, width: 250 },
            //{ dataField: "PicklistNo", visible: true, width: 100 },
            { dataField: "DepartmentName", visible: true, width: 120, caption: "Department" },
            { dataField: "JobCardNo", visible: true, width: 100, caption: "J.C. No." },
            { dataField: "JobName", visible: true, width: 200, caption: "Job Name" },
            { dataField: "ContentName", visible: true, width: 150, caption: "Content Name" },
            { dataField: "StockUnit", visible: true, width: 80, caption: "Unit" },
            { dataField: "IssueQuantity", visible: true, width: 80, caption: "Issue Qty" },
            { dataField: "BatchNo", visible: true, width: 100, caption: "Batch No" },
            { dataField: "Warehouse", visible: false, width: 100 },
            { dataField: "Bin", visible: false, width: 100 },
        ]

    });

    $("#PicklistGrid").dxDataGrid('instance').clearFilter();
}

//AllocatedGrid Initialised
AllocatedItem();
function AllocatedItem() {
    $("#AllotedItemGrid").dxDataGrid({
        dataSource: AllocatedItemGrid,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        height: function () {
            return window.innerHeight / 4;
        },
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
            allowDeleting: true,
            //allowAdding: true,
            //allowUpdating: true
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onRowRemoved: function () {
            var grid = $("#AllotedItemGrid").dxDataGrid('instance');
            if (grid.totalCount() === 0) {
                $("#RadioButtonConIssue").dxRadioGroup({
                    disabled: false
                });
                $("#PicklistGrid").dxDataGrid('instance').clearFilter();
            }
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
            { dataField: "MaxVoucherNo", visible: false, width: 100 },
            { dataField: "VoucherNo", visible: true, width: 100, caption: "Issue No." },
            { dataField: "VoucherDate", visible: true, width: 100, caption: "Issue Date" },
            { dataField: "ItemCode", visible: true, width: 80, caption: "Item Code" },
            { dataField: "ItemGroupName", visible: false, width: 100, caption: "Item Group" },
            { dataField: "ItemSubGroupName", visible: true, width: 120, caption: "Sub Group" },
            { dataField: "ItemName", visible: true, width: 250, caption: "Item Name" },
            { dataField: "ItemDescription", visible: false, width: 250 },
            //{ dataField: "PicklistNo", visible: true, width: 100 },
            { dataField: "DepartmentName", visible: true, width: 120, caption: "Department" },
            { dataField: "JobCardNo", visible: true, width: 100, caption: "J.C. No."  },
            { dataField: "JobName", visible: true, width: 150, caption: "Job Name" },
            { dataField: "ContentName", visible: true, width: 150, caption: "Content Name" },
            { dataField: "StockUnit", visible: true, width: 80, caption: "Unit" },
            { dataField: "IssueQuantity", visible: true, width: 80, caption: "Consume Qty" },
            { dataField: "BatchNo", visible: true, width: 100 },
            { dataField: "Warehouse", visible: false, width: 100 },
            { dataField: "Bin", visible: false, width: 100 },
            { dataField: "ConsumptionTransactionID", visible: false, width: 100 },
            
        ]
    });
}

//Data Add in Last Grid(AllocatedItemGrid) from BatchStockGrid
$("#BtnAddRow").click(function () {

    var TxtQuantity = document.getElementById("TxtQuantity").value;

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (PickListGriddata.length > 0) {

        if (TxtQuantity > PickListGriddata[0].IssueQuantity) {
            DevExpress.ui.notify("Please Enter Valid Quantity..!", "error", 1000);
            document.getElementById("TxtQuantity").focus();
            return false;
        }
        if (ItemGridRow > 0) {
            for (var check = 0; check < ItemGridRow; check++) {
                if (ItemGrid._options.dataSource[check].TransactionID === PickListGriddata[0].TransactionID && ItemGrid._options.dataSource[check].PicklistReleaseTransactionID === PickListGriddata[0].PicklistReleaseTransactionID && ItemGrid._options.dataSource[check].JobBookingJobCardContentsID === PickListGriddata[0].JobBookingJobCardContentsID && ItemGrid._options.dataSource[check].DepartmentID === PickListGriddata[0].DepartmentID && ItemGrid._options.dataSource[check].ProcessID === PickListGriddata[0].ProcessID && ItemGrid._options.dataSource[check].ProcessID === PickListGriddata[0].ProcessID && ItemGrid._options.dataSource[check].ItemID === PickListGriddata[0].ItemID && ItemGrid._options.dataSource[check].BatchNo === PickListGriddata[0].BatchNo) {//&& ItemGrid._options.dataSource[check].BatchNo === BatchWisdata[0].BatchNo
                    DevExpress.ui.notify("This item already exist..! You can not add it..", "error", 1000);
                    return false;
                }
            }
        }
    } else {
        DevExpress.ui.notify("Please Select Any Item...!", "error", 1000);
        return false;
    }

    if (TxtQuantity === "" || TxtQuantity === undefined || TxtQuantity === null) {
        DevExpress.ui.notify("Please Enter Quantity..!", "error", 1000);
        document.getElementById("TxtQuantity").focus();
        return false;
    }

    AllocatedItemGrid = [];
    var optAllocatedItemGrid = {};

    if (ItemGridRow > 0) {
        for (var t = 0; t <= ItemGridRow; t++) {
            if (t === ItemGridRow) {
                optAllocatedItemGrid = {};

                optAllocatedItemGrid.JobBookingID = PickListGriddata[0].JobBookingID;
                optAllocatedItemGrid.TransactionID = PickListGriddata[0].TransactionID;
                optAllocatedItemGrid.ParentTransactionID = PickListGriddata[0].ParentTransactionID;
                optAllocatedItemGrid.DepartmentID = PickListGriddata[0].DepartmentID;
                optAllocatedItemGrid.FloorWarehouseID = PickListGriddata[0].FloorWarehouseID;;
                optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
                optAllocatedItemGrid.MachineID = PickListGriddata[0].MachineID;
                optAllocatedItemGrid.OperationID = PickListGriddata[0].OperationID;
                optAllocatedItemGrid.ItemID = PickListGriddata[0].ItemID;
                optAllocatedItemGrid.ItemGroupID = PickListGriddata[0].ItemGroupID;
                optAllocatedItemGrid.ItemGroupNameID = PickListGriddata[0].ItemGroupNameID;
                optAllocatedItemGrid.ItemSubGroupID = PickListGriddata[0].ItemSubGroupID;
                optAllocatedItemGrid.DepartmentName = PickListGriddata[0].DepartmentName;
                optAllocatedItemGrid.VoucherNo = PickListGriddata[0].VoucherNo;
                optAllocatedItemGrid.VoucherDate = PickListGriddata[0].VoucherDate;
                optAllocatedItemGrid.ItemCode = PickListGriddata[0].ItemCode;
                optAllocatedItemGrid.ItemGroupName = PickListGriddata[0].ItemGroupName;
                optAllocatedItemGrid.ItemSubGroupName = PickListGriddata[0].ItemSubGroupName;
                optAllocatedItemGrid.ItemName = PickListGriddata[0].ItemName;
                optAllocatedItemGrid.ItemDescription = PickListGriddata[0].ItemDescription;
                optAllocatedItemGrid.StockType = PickListGriddata[0].StockType;
                optAllocatedItemGrid.StockCategory = PickListGriddata[0].StockCategory;
                optAllocatedItemGrid.StockUnit = PickListGriddata[0].StockUnit;
                optAllocatedItemGrid.BatchNo = PickListGriddata[0].BatchNo;
                optAllocatedItemGrid.GRNNo = PickListGriddata[0].GRNNo;
                optAllocatedItemGrid.GRNDate = PickListGriddata[0].GRNDate;
                optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
                optAllocatedItemGrid.JobName = PickListGriddata[0].JobName;
                optAllocatedItemGrid.ContentName = PickListGriddata[0].ContentName;
                optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtQuantity").value;
                optAllocatedItemGrid.ConsumeQuantity = PickListGriddata[0].ConsumeQuantity;
                optAllocatedItemGrid.MachineName = PickListGriddata[0].MachineName;
                optAllocatedItemGrid.Warehouse = PickListGriddata[0].Warehouse;
                optAllocatedItemGrid.Bin = PickListGriddata[0].Bin;
                optAllocatedItemGrid.ConsumptionTransactionID = "";

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
                optAllocatedItemGrid.OperationID = ItemGrid._options.dataSource[t].OperationID;
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
                optAllocatedItemGrid.ItemDescription = ItemGrid._options.dataSource[t].ItemDescription;
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
                optAllocatedItemGrid.MachineName = ItemGrid._options.dataSource[t].MachineName;
                optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
                optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                optAllocatedItemGrid.ConsumptionTransactionID = ItemGrid._options.dataSource[t].ConsumptionTransactionID;;

                AllocatedItemGrid.push(optAllocatedItemGrid);

            }
        }
    }
    else {
        optAllocatedItemGrid = {};

        optAllocatedItemGrid.JobBookingID = PickListGriddata[0].JobBookingID;
        optAllocatedItemGrid.TransactionID = PickListGriddata[0].TransactionID;
        optAllocatedItemGrid.ParentTransactionID = PickListGriddata[0].ParentTransactionID;
        optAllocatedItemGrid.DepartmentID = PickListGriddata[0].DepartmentID;
        optAllocatedItemGrid.FloorWarehouseID = PickListGriddata[0].FloorWarehouseID;
        optAllocatedItemGrid.JobBookingJobCardContentsID = PickListGriddata[0].JobBookingJobCardContentsID;
        optAllocatedItemGrid.MachineID = PickListGriddata[0].MachineID;
        optAllocatedItemGrid.OperationID = PickListGriddata[0].OperationID;
        optAllocatedItemGrid.ItemID = PickListGriddata[0].ItemID;
        optAllocatedItemGrid.ItemGroupID = PickListGriddata[0].ItemGroupID;
        optAllocatedItemGrid.ItemGroupNameID = PickListGriddata[0].ItemGroupNameID;
        optAllocatedItemGrid.ItemSubGroupID = PickListGriddata[0].ItemSubGroupID;
        optAllocatedItemGrid.DepartmentName = PickListGriddata[0].DepartmentName;
        optAllocatedItemGrid.VoucherNo = PickListGriddata[0].VoucherNo;
        optAllocatedItemGrid.VoucherDate = PickListGriddata[0].VoucherDate;
        optAllocatedItemGrid.ItemCode = PickListGriddata[0].ItemCode;
        optAllocatedItemGrid.ItemGroupName = PickListGriddata[0].ItemGroupName;
        optAllocatedItemGrid.ItemSubGroupName = PickListGriddata[0].ItemSubGroupName;
        optAllocatedItemGrid.ItemName = PickListGriddata[0].ItemName;
        optAllocatedItemGrid.ItemDescription = PickListGriddata[0].ItemDescription;
        optAllocatedItemGrid.StockType = PickListGriddata[0].StockType;
        optAllocatedItemGrid.StockCategory = PickListGriddata[0].StockCategory;
        optAllocatedItemGrid.StockUnit = PickListGriddata[0].StockUnit;
        optAllocatedItemGrid.BatchNo = PickListGriddata[0].BatchNo;
        optAllocatedItemGrid.GRNNo = PickListGriddata[0].GRNNo;
        optAllocatedItemGrid.GRNDate = PickListGriddata[0].GRNDate;
        optAllocatedItemGrid.JobCardNo = PickListGriddata[0].JobCardNo;
        optAllocatedItemGrid.JobName = PickListGriddata[0].JobName;
        optAllocatedItemGrid.ContentName = PickListGriddata[0].ContentName;
        optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtQuantity").value;
        optAllocatedItemGrid.ConsumeQuantity = PickListGriddata[0].ConsumeQuantity;
        optAllocatedItemGrid.Warehouse = PickListGriddata[0].Warehouse;
        optAllocatedItemGrid.Bin = PickListGriddata[0].Bin;
        optAllocatedItemGrid.MachineName = PickListGriddata[0].MachineName;
        optAllocatedItemGrid.ConsumptionTransactionID = "";

        AllocatedItemGrid.push(optAllocatedItemGrid);

    }

    AllocatedItem();

    if (ItemGrid._options.dataSource.length === 1) {
        $("#PicklistGrid").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", PickListGriddata[0].DepartmentID]);
        $("#PicklistGrid").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", PickListGriddata[0].JobBookingJobCardContentsID]);
    }
    $("#RadioButtonConIssue").dxRadioGroup({
        disabled: true
    });
});

$("#BtnSave").click(function () {
    var VoucherDate = $('#IssueDate').dxDateBox('instance').option('value');
    var TxtNarration = document.getElementById("TxtNarration").value;
    var prefix = "IC";

    var AllotedItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var AllotedItemGridRow = AllotedItemGrid.totalCount();
    if (AllotedItemGridRow <= 0) {
        DevExpress.ui.notify("Please add issue items in list to save!", "error", 1000);
        return false;
    }

    var TtlStock = 0;
    for (var C = 0; C < AllotedItemGridRow; C++) {
        TtlStock = TtlStock + Number(AllotedItemGrid._options.dataSource[C].IssueQuantity);
    }

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    if (AllotedItemGridRow > 0) {
        for (var A = 0; A < AllotedItemGridRow; A++) {

            OperationRecordMain = {};
            OperationRecordMain.VoucherID = -30;
            OperationRecordMain.VoucherDate = VoucherDate;
            OperationRecordMain.TotalQuantity = TtlStock;
            OperationRecordMain.DepartmentID = AllotedItemGrid._options.dataSource[0].DepartmentID;
            OperationRecordMain.Narration = TxtNarration;
            OperationRecordMain.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[0].JobBookingJobCardContentsID;

            jsonObjectsRecordMain.push(OperationRecordMain);
        }

        if (AllotedItemGridRow > 0) {
            for (var e = 0; e < AllotedItemGridRow; e++) {
                OperationRecordDetail = {};

                OperationRecordDetail.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
                OperationRecordDetail.DepartmentID = AllotedItemGrid._options.dataSource[e].DepartmentID;
                OperationRecordDetail.MachineID = AllotedItemGrid._options.dataSource[e].MachineID;
                OperationRecordDetail.ProcessID = AllotedItemGrid._options.dataSource[e].ProcessID;
                OperationRecordDetail.TransID = e + 1;
                OperationRecordDetail.ItemID = AllotedItemGrid._options.dataSource[e].ItemID;
                OperationRecordDetail.ItemGroupID = AllotedItemGrid._options.dataSource[e].ItemGroupID;
                OperationRecordDetail.ConsumeQuantity = AllotedItemGrid._options.dataSource[e].IssueQuantity;
                OperationRecordDetail.BatchNo = AllotedItemGrid._options.dataSource[e].BatchNo;
                OperationRecordDetail.IssueTransactionID = AllotedItemGrid._options.dataSource[e].TransactionID;
                OperationRecordDetail.FloorWarehouseID = AllotedItemGrid._options.dataSource[e].FloorWarehouseID;

                jsonObjectsRecordDetail.push(OperationRecordDetail);

            }
        }
    }

    jsonObjectsRecordMain = JSON.stringify(jsonObjectsRecordMain);
    jsonObjectsRecordDetail = JSON.stringify(jsonObjectsRecordDetail);


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
                    url: "WebService_ItemConsumption.asmx/UpdateIssue",
                    data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtConsumptionID").value) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
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
                    url: "WebService_ItemConsumption.asmx/SaveIssueData",
                    data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + jsonObjectsRecordMain + ',jsonObjectsRecordDetail:' + jsonObjectsRecordDetail + '}',
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

$("#EditButton").click(function () {
    var TxtConsumptionID = document.getElementById("TxtConsumptionID").value;
    if (TxtConsumptionID === "" || TxtConsumptionID === null || TxtConsumptionID === undefined) {
        alert("Please select issue vouchers to edit or view..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";

    $.ajax({
        type: "POST",
        url: "WebService_ItemConsumption.asmx/SelectedRow",
        data: '{transactionID:' + JSON.stringify(TxtConsumptionID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            document.getElementById("LOADER").style.display = "none";
            var ConsumptionRetrive = JSON.parse(res);

            AllocatedItemGrid = [];
            AllocatedItemGrid = ConsumptionRetrive;

            AllocatedItem();
            if (ConsumptionRetrive.length > 0) {
                var JCID = ConsumptionRetrive[0].JobBookingJobCardContentsID;
                if (Number(JCID) > 0) {
                    $("#RadioButtonConIssue").dxRadioGroup({
                        value: priorities[0],
                        disabled: true
                    });
                    RadioValue = "Job Issue Vouchers";
                } else {
                    $("#RadioButtonConIssue").dxRadioGroup({
                        value: priorities[1],
                        disabled: true
                    });
                    RadioValue = "General Issue Vouchers";
                }
                $("#PicklistGrid").dxDataGrid("option", "filterValue", ["DepartmentID", "contains", ConsumptionRetrive[0].DepartmentID]);
                $("#PicklistGrid").dxDataGrid("option", "filterValue", ["JobBookingJobCardContentsID", "contains", ConsumptionRetrive[0].JobBookingJobCardContentsID]);
            }
        }
    });

    document.getElementById("Consumption").value = sholistData[0].VoucherNo;
    document.getElementById("TxtNarration").value = sholistData[0].Narration;

    $("#IssueDate").dxDateBox({
        value: sholistData[0].VoucherDate,
    });
    
    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = false;

});

$("#DeleteButton").click(function () {
    var TxtConsumptionID = document.getElementById("TxtConsumptionID").value;
    if (TxtConsumptionID === "" || TxtConsumptionID === null || TxtConsumptionID === undefined) {
        alert("Please select any issue voucher to delete..!");
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
                url: "WebService_ItemConsumption.asmx/DeleteConsumption",
                data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtConsumptionID").value) + '}',
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

$("#BtnNew").click(function () {
    location.reload();
});
