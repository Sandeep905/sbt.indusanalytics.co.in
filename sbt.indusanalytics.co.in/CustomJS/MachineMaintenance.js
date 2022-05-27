
var GblStatus = "";
var prefix = "SC";
var sholistData = [], RTSVoucherNo = "";
var WholeItem = [], WholeItemGridtData = [], AllocatedItemData = [];

$("#RTSDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});
CreateVoucherNO();
function CreateVoucherNO() {
    $.ajax({
        type: "POST",
        url: "WebService_MachineMaintenance.asmx/GetRTSVoucherNO",
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

document.getElementById("LOADER").style.display = "block";
$.ajax({
    type: "POST",
    url: "WebService_MachineMaintenance.asmx/Showlist",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        RES1 = JSON.parse(res.toString());


        $("#ShowListGrid").dxDataGrid({
            dataSource: RES1,
            showBorders: true,
            showRowLines: true,
            allowSorting: true,
            allowColumnResizing: true,
            columnResizingMode: "widget",
            selection: { mode: "single" },
            paging: {
                pageSize: 250
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [250, 350, 500, 1000]
            },
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
            height: function () {
                return window.innerHeight / 1.2;
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
                document.getElementById("ShowListID").value = sholistData[0].TransactionID;

            },
            columns: [
                { dataField: "TransactionID", visible: false, width: 120 },
                { dataField: "VoucherID", visible: false, width: 120 },
                { dataField: "SpareID", visible: false, width: 120 },
                { dataField: "SpareGroupID", visible: false, width: 120 },
                { dataField: "IssueTransactionID", visible: false, width: 120 },
                { dataField: "UserID", visible: false, width: 120 },
                { dataField: "VoucherID", visible: false, width: 120 },
                { dataField: "UserID", visible: false, width: 120 },
                { dataField: "UserID", visible: false, width: 120 },
                { dataField: "MaxVoucherNo", visible: false, width: 120, caption: "MaxVoucherNo" },
                { dataField: "MachineName", visible: true, caption: "MachineName", width: 150 },
                { dataField: "VoucherNo", visible: true, caption: "Voucher No.", width: 150 },
                { dataField: "VoucherDate", visible: true, caption: "Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar", width: 100 },
                { dataField: "IssueVoucherNo", visible: true, caption: "Issue Voucher No." },
                { dataField: "IssueVoucherDate", visible: true, caption: "Issue Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar", width: 100 },
                { dataField: "ConsumeQuantity", visible: true, caption: "Total Quantity", width: 150 },
                { dataField: "MaintenanceType", visible: true, caption: "MaintenanceType", width: 150, },
                { dataField: "JobReference", visible: false, caption: "Job Reference", width: 150 },
                { dataField: "Description", visible: true, caption: "Description", width: 150, },
                { dataField: "Engineer", visible: true, caption: "Engineer", width: 150, },
                { dataField: "CompanyName", visible: true, caption: "CompanyName", width: 150, },
                { dataField: "Narration", visible: true, caption: "Narration", width: 150, },
                { dataField: "CreatedBy", visible: true, caption: "Created By", width: 150 },
                { dataField: "FYear", visible: false, caption: "FYear" }
            ]
        });
    }
});

$("#CreateButton").click(function () {
    GblStatus = "";

    CreateVoucherNO();
    $("#RTSDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });
    $("#SelMachineName").dxSelectBox({
        value: ''
    });
    document.getElementById("MaintenanceType").value = '';
    document.getElementById("Description").value = '';
    document.getElementById("Engineer").value = '';
    document.getElementById("TxtCompanyName").value = '';
    document.getElementById("TxtNarration").value = '';

    document.getElementById("WOCSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");

});

try {
    $.ajax({
        type: "POST",
        url: "WebService_MachineMaintenance.asmx/MachineName",
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

            $("#SelMachineName").dxSelectBox({
                items: receivers,
                placeholder: "Select Machine",
                displayExpr: 'MachineName',
                valueExpr: 'MachineID',
                searchEnabled: true,
                showClearButton: true,
                onSelectionChanged: function (Showlist) {
                    document.getElementById("TxtQuantity").value = 0;
                    document.getElementById("TxtReceiptQty").value = '';
                    GetWholeItemStock();
                },
            });
        }
    });
} catch (e) {
    console.log(e);
}

$("#WholeItemGrid").dxDataGrid({
    dataSource: WholeItem,
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    height: function () {
        window.innerHeight / 3;
    },
    paging: {
        pageSize: 250
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [250, 350, 500, 1000]
    },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "single" // or "multiple" | "single"
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
        WholeItemGridtData = Showlist.selectedRowsData;
        if (WholeItemGridtData.lengt <= 0) return;
        document.getElementById("TxtQuantity").value = Number(WholeItemGridtData[0].FloorStock);
    },
    columns: [
       // { dataField: "TransactionDetailID", visible: false, caption: "TransactionDetailID" },
        { dataField: "TransactionID", visible: false, caption: "TransactionID" },
        { dataField: "VoucherID", visible: false, caption: "VoucherID" },
        { dataField: "SpareID", visible: false, caption: "SpareID" },
        { dataField: "MachineID", visible: false, caption: "MachineID" },
        { dataField: "SpareGroupID", visible: false, caption: "Spare Group ID" },
        { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 100 },
        { dataField: "SpareCode", visible: true, caption: "Spare Code", width: 100 },
        { dataField: "SpareGroupName", visible: true, caption: "Spare Group Name", width: 100 },
        { dataField: "SpareName", visible: true, caption: "Spare Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit" },
        { dataField: "VoucherDate", visible: true, caption: "Voucher Date" },
        { dataField: "FloorStock", visible: true, caption: "Floor Stock" },
        { dataField: "BatchNo", visible: true, caption: "Batch No." },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 150 },
        { dataField: "CreatedBy", visible: false, caption: "Created By" },
        { dataField: "FYear", visible: false, caption: "FYear" },
    ]
});

//AllocatedItemGrid
$("#AllotedItemGrid").dxDataGrid({
    dataSource: AllocatedItemData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    //filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "none" // or "multiple" | "single"
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
    height: function () {
        window.innerHeight / 3;
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

    },
    columns: [
        { dataField: "TransID", visible: false, caption: "TransID" },
      //  { dataField: "TransactionDetailID", visible: false, caption: "TransactionDetailID" },
        { dataField: "TransactionID", visible: false, caption: "TransactionID" },
        { dataField: "VoucherID", visible: false, caption: "VoucherID" },
        { dataField: "SpareID", visible: false, caption: "SpareID" },
        { dataField: "MachineID", visible: false, caption: "MachineID" },
        { dataField: "SpareGroupID", visible: false, caption: "Spare Group ID" },
        { dataField: "VoucherNo", visible: true, caption: "Voucher No", width: 100 },
        { dataField: "SpareCode", visible: true, caption: "Spare Code", width: 100 },
        { dataField: "SpareGroupName", visible: true, caption: "Spare Group Name", width: 100 },
        { dataField: "SpareName", visible: true, caption: "Spare Name", width: 180 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit" },
        { dataField: "VoucherDate", visible: true, caption: "Voucher Date" },
        { dataField: "IssueQuantity", visible: true, caption: "Issue Qty" },
        { dataField: "BatchNo", visible: true, caption: "Batch No." },
        { dataField: "Warehouse", visible: true, caption: "Godown Name", width: 100 },
        { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
        { dataField: "WarehouseID", visible: false, caption: "GodownID", width: 150 },
        { dataField: "CreatedBy", visible: false, caption: "Created By" },
        { dataField: "FYear", visible: false, caption: "FYear" },
    ]
});

$("#BtnNew").click(function () {
    location.reload();
});

function GetWholeItemStock() {
    var MachineID = $('#SelMachineName').dxSelectBox('instance').option('value');
    $.ajax({
        type: "POST",
        url: "WebService_MachineMaintenance.asmx/GetStockBatchWise",
        data: '{MachineID:' + JSON.stringify(MachineID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            WholeItem = [];
            WholeItem = JSON.parse(res.toString());
            $("#WholeItemGrid").dxDataGrid({
                dataSource: WholeItem
            });

        }
    });
}

$("#BtnAddItemPop").click(function () {
    var TxtQuantity = document.getElementById("TxtQuantity").value;
    var TxtReceiptQty = document.getElementById("TxtReceiptQty").value;

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (WholeItemGridtData.length < 1) {
        DevExpress.ui.notify("Please select any row from above grid...!", "warning", 1500);
        return false;
    }

    if (TxtReceiptQty === "" || TxtReceiptQty === null || Number(TxtReceiptQty) === 0) {
        DevExpress.ui.notify("Please Enter Quantity..!", "warning", 1500);
        document.getElementById("TxtReceiptQty").focus();
        return false;
    }

    var totalReceiptQty = 0;
    if (ItemGridRow > 0) {
        for (var t = 0; t < ItemGridRow; t++) {
            if (WholeItemGridtData[0].BatchNo === ItemGrid._options.dataSource[t].BatchNo) {
                totalReceiptQty = Number(totalReceiptQty) + Number(ItemGrid._options.dataSource[t].IssueQuantity);
            }
        }
    }

    totalReceiptQty = Number(totalReceiptQty) + Number(TxtReceiptQty);
    alert(totalReceiptQty);
    if (Number(totalReceiptQty) > Number(WholeItemGridtData[0].FloorStock)) {
        DevExpress.ui.notify("Quantity is greater then Issue Quantity..!", "warning", 1500);
        document.getElementById("TxtReceiptQty").focus();
        return false;
    }



    AllocatedItemData = [];
    var optAllocatedItemGrid = {};

    if (ItemGridRow > 0) {
        for (t = 0; t <= ItemGridRow; t++) {
            if (WholeItemGridtData[0].ItemGroupName === ItemGrid._options.dataSource[0].ItemGroupName) {
                if (t === ItemGridRow) {
                    optAllocatedItemGrid = {};
                    optAllocatedItemGrid.TransID = t + 1;
                  //  optAllocatedItemGrid.TransactionDetailID = WholeItemGridtData[0].TransactionDetailID;
                    optAllocatedItemGrid.TransactionID = WholeItemGridtData[0].TransactionID;
                    optAllocatedItemGrid.VoucherID = WholeItemGridtData[0].VoucherID;
                    optAllocatedItemGrid.SpareID = WholeItemGridtData[0].SpareID;
                    optAllocatedItemGrid.MachineID = WholeItemGridtData[0].MachineID;
                    optAllocatedItemGrid.SpareGroupID = WholeItemGridtData[0].SpareGroupID;
                    optAllocatedItemGrid.VoucherNo = WholeItemGridtData[0].VoucherNo;
                    // optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
                    optAllocatedItemGrid.SpareCode = WholeItemGridtData[0].SpareCode;
                    optAllocatedItemGrid.SpareGroupName = WholeItemGridtData[0].SpareGroupName;
                    optAllocatedItemGrid.SpareName = WholeItemGridtData[0].SpareName;
                    optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
                    optAllocatedItemGrid.VoucherDate = WholeItemGridtData[0].VoucherDate;
                    optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtReceiptQty").value;
                    // optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;
                    optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
                    optAllocatedItemGrid.Warehouse = WholeItemGridtData[0].Warehouse;
                    optAllocatedItemGrid.Bin = WholeItemGridtData[0].Bin;
                    optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
                    optAllocatedItemGrid.CreatedBy = WholeItemGridtData[0].CreatedBy;
                    optAllocatedItemGrid.FYear = WholeItemGridtData[0].FYear;

                    AllocatedItemData.push(optAllocatedItemGrid);
                } else {
                    optAllocatedItemGrid = {};

                    optAllocatedItemGrid.TransID = t + 1;
                    optAllocatedItemGrid.TransactionID = ItemGrid._options.dataSource[t].TransactionID;
                    //optAllocatedItemGrid.TransactionDetailID = ItemGrid._options.dataSource[t].TransactionDetailID;
                    optAllocatedItemGrid.VoucherID = ItemGrid._options.dataSource[t].VoucherID;
                    optAllocatedItemGrid.SpareID = ItemGrid._options.dataSource[t].SpareID;
                    optAllocatedItemGrid.MachineID = ItemGrid._options.dataSource[t].MachineID;
                    optAllocatedItemGrid.SpareGroupID = ItemGrid._options.dataSource[t].SpareGroupID;
                    optAllocatedItemGrid.VoucherNo = ItemGrid._options.dataSource[t].VoucherNo;
                    // optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
                    optAllocatedItemGrid.SpareCode = ItemGrid._options.dataSource[t].SpareCode;
                    optAllocatedItemGrid.SpareGroupName = ItemGrid._options.dataSource[t].SpareGroupName;
                    optAllocatedItemGrid.SpareName = ItemGrid._options.dataSource[t].SpareName;
                    optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                    optAllocatedItemGrid.VoucherDate = ItemGrid._options.dataSource[t].VoucherDate;
                    optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
                    // optAllocatedItemGrid.BatchStock = ItemGrid._options.dataSource[t].BatchStock;
                    optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                    optAllocatedItemGrid.Warehouse = ItemGrid._options.dataSource[t].Warehouse;
                    optAllocatedItemGrid.Bin = ItemGrid._options.dataSource[t].Bin;
                    optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;
                    optAllocatedItemGrid.CreatedBy = ItemGrid._options.dataSource[t].CreatedBy;
                    optAllocatedItemGrid.FYear = ItemGrid._options.dataSource[t].FYear;

                    AllocatedItemData.push(optAllocatedItemGrid);

                }
            } else {
                DevExpress.ui.notify("please choose same Item group name..!", "warning", 1500);
                return false;
            }
        }
        $("#AllotedItemGrid").dxDataGrid({
            dataSource: AllocatedItemData
        });
    }
    else {
        optAllocatedItemGrid = {};
        optAllocatedItemGrid.TransID = t + 1;
        optAllocatedItemGrid.TransactionID = WholeItemGridtData[0].TransactionID;
       // optAllocatedItemGrid.TransactionDetailID = WholeItemGridtData[0].TransactionDetailID;
        optAllocatedItemGrid.VoucherID = WholeItemGridtData[0].VoucherID;
        optAllocatedItemGrid.SpareID = WholeItemGridtData[0].SpareID;
        optAllocatedItemGrid.MachineID = WholeItemGridtData[0].MachineID;
        optAllocatedItemGrid.SpareGroupID = WholeItemGridtData[0].SpareGroupID;
        optAllocatedItemGrid.VoucherNo = WholeItemGridtData[0].VoucherNo;
        // optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
        optAllocatedItemGrid.SpareCode = WholeItemGridtData[0].SpareCode;
        optAllocatedItemGrid.SpareGroupName = WholeItemGridtData[0].SpareGroupName;
        optAllocatedItemGrid.SpareName = WholeItemGridtData[0].SpareName;
        optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
        optAllocatedItemGrid.VoucherDate = WholeItemGridtData[0].VoucherDate;
        optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtReceiptQty").value;
        // optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;
        optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
        optAllocatedItemGrid.Warehouse = WholeItemGridtData[0].Warehouse;
        optAllocatedItemGrid.Bin = WholeItemGridtData[0].Bin;
        optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
        optAllocatedItemGrid.CreatedBy = WholeItemGridtData[0].CreatedBy;
        optAllocatedItemGrid.FYear = WholeItemGridtData[0].FYear;

        AllocatedItemData.push(optAllocatedItemGrid);

        $("#AllotedItemGrid").dxDataGrid({
            dataSource: AllocatedItemData
        });
    }

});

$("#BtnSave").click(function () {
    var VoucherDate = $('#RTSDate').dxDateBox('instance').option('value');
    var SelMachineName = $('#SelMachineName').dxSelectBox('instance').option('value');
    var MaintenanceType = document.getElementById("MaintenanceType").value;
    var Description = document.getElementById("Description").value;
    var Engineer = document.getElementById("Engineer").value;
    var CompanyName = document.getElementById("TxtCompanyName").value;   
    var TxtNarration = document.getElementById("TxtNarration").value;
    var prefix = "SC";

    if (SelMachineName === "" || SelMachineName === "undefined" || SelMachineName === null) {
        DevExpress.ui.notify("Please select Machine Name..!", "warning", 1200);
        return;
    }
    if (MaintenanceType === "" || MaintenanceType === "undefined" || MaintenanceType === null) {
        DevExpress.ui.notify("Please enter Maintenance Type..!", "warning", 1200);
        return;
    }
    if (Engineer === "" || Engineer === "undefined" || Engineer === null) {
        DevExpress.ui.notify("Please enter Engineer Name..!", "warning", 1200);
        return;
    }
    if (CompanyName === "" || CompanyName === "undefined" || CompanyName === null) {
        DevExpress.ui.notify("Please enter Company Name..!", "warning", 1200);
        return;
    }

    var ItemGrid = $('#AllotedItemGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (ItemGridRow <= 0) {
        DevExpress.ui.notify("Please fill second grid for create Machine Maintenance..!", "warning", 1200);
        return false;
    }

    var totalReceiptQty = 0;
    if (ItemGridRow > 0) {
        for (var t = 0; t < ItemGridRow; t++) {
            totalReceiptQty = Number(totalReceiptQty) + Number(ItemGrid._options.dataSource[t].IssueQuantity);
        }
    }

    var jsonObjectsTransactionMain = [];
    var TransactionMainRecord = {};

    TransactionMainRecord = {};
    TransactionMainRecord.VoucherID = -118;
    TransactionMainRecord.VoucherDate = VoucherDate;
    TransactionMainRecord.TotalQuantity = totalReceiptQty;
    TransactionMainRecord.MaintenanceType = MaintenanceType;
    TransactionMainRecord.Description = Description;
    TransactionMainRecord.Engineer = Engineer;
    TransactionMainRecord.CompanyName = CompanyName;
    TransactionMainRecord.Narration = TxtNarration;
    TransactionMainRecord.MachineID = SelMachineName;
    //TransactionMainRecord.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[0].JobBookingJobCardContentsID;

    jsonObjectsTransactionMain.push(TransactionMainRecord);


    var jsonObjectsTransactionDetail = [];
    var TransactionDetailRecord = {};
    if (ItemGridRow > 0) {
        for (var e = 0; e < ItemGridRow; e++) {
            TransactionDetailRecord = {};
            //TransactionDetailRecord.JobBookingJobCardContentsID = AllotedItemGrid._options.dataSource[e].JobBookingJobCardContentsID;
            //TransactionDetailRecord.DepartmentID = AllotedItemGrid._options.dataSource[e].DepartmentID;
            TransactionDetailRecord.MachineID = ItemGrid._options.dataSource[e].MachineID;
            //  TransactionDetailRecord.ProcessID = ItemGrid._options.dataSource[e].ProcessID;
            TransactionDetailRecord.TransID = e + 1;
            TransactionDetailRecord.SpareID = ItemGrid._options.dataSource[e].SpareID;
            TransactionDetailRecord.SpareGroupID = ItemGrid._options.dataSource[e].SpareGroupID;
            TransactionDetailRecord.ConsumeQuantity = ItemGrid._options.dataSource[e].IssueQuantity;
            TransactionDetailRecord.IssueQuantity = ItemGrid._options.dataSource[e].IssueQuantity;
            TransactionDetailRecord.BatchNo = ItemGrid._options.dataSource[e].BatchNo;
            TransactionDetailRecord.IssueTransactionID = ItemGrid._options.dataSource[e].TransactionID;
            TransactionDetailRecord.ParentTransactionID = ItemGrid._options.dataSource[e].TransactionID;
            TransactionDetailRecord.FloorWarehouseID = ItemGrid._options.dataSource[e].WarehouseID;
            TransactionDetailRecord.StockUnit = ItemGrid._options.dataSource[e].StockUnit;

            jsonObjectsTransactionDetail.push(TransactionDetailRecord);
        }
    }

    jsonObjectsTransactionMain = JSON.stringify(jsonObjectsTransactionMain);
    jsonObjectsTransactionDetail = JSON.stringify(jsonObjectsTransactionDetail);

    try {

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
                    try {
                        $.ajax({
                            type: "POST",
                            url: "WebService_MachineMaintenance.asmx/UpdateData",
                            data: '{TransactionID:' + JSON.stringify(document.getElementById("ShowListID").value) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail:' + jsonObjectsTransactionDetail + '}',
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
                            url: "WebService_MachineMaintenance.asmx/SaveData",
                            data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsTransactionMain:' + jsonObjectsTransactionMain + ',jsonObjectsTransactionDetail:' + jsonObjectsTransactionDetail + '}',
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
                    } catch (e) {
                        console.log(e);
                    }

                }
            });
    } catch (e) {
        console.log(e);
    }
});

$("#EditButton").click(function () {
    var TxtConsumptionID = document.getElementById("ShowListID").value;
    if (TxtConsumptionID == "" || TxtConsumptionID == null || TxtConsumptionID == undefined) {
        DevExpress.ui.notify("Please select issue vouchers to edit or view..!", "warning", 1200);
       // alert("Please select issue vouchers to edit or view..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaintenance.asmx/SelectedRow",
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

            AllocatedItemData = [];
            AllocatedItemData = ConsumptionRetrive;
           
            $("#AllotedItemGrid").dxDataGrid({
                dataSource: AllocatedItemData,
            });

        }
    });
    $("#SelMachineName").dxSelectBox({
        value: sholistData[0].MachineID,
    });
    document.getElementById("MaintenanceType").value = sholistData[0].MaintenanceType;
    document.getElementById("Description").value = sholistData[0].Description;
    document.getElementById("Engineer").value = sholistData[0].Engineer;
    document.getElementById("TxtCompanyName").value = sholistData[0].CompanyName;
    document.getElementById("TxtNarration").value = sholistData[0].Narration;
    
    $("#IssueDate").dxDateBox({
        value: sholistData[0].IssueVoucherDate,
    });

    document.getElementById("BtnDeletePopUp").disabled = false;
   // document.getElementById("BtnSaveAS").disabled = false;

});

$("#DeleteButton").click(function () {
    var TxtConsumptionID = document.getElementById("ShowListID").value;
    if (TxtConsumptionID == "" || TxtConsumptionID == null || TxtConsumptionID == undefined) {
        DevExpress.ui.notify("Please select any issue voucher to delete..!", "warning", 1200);
        //alert("Please select any issue voucher to delete..!");
        return false;
    }
    swal({
        title: "Are you sure?",
        //text: 'You will not be able to recover this Content!',
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
                url: "WebService_MachineMaintenance.asmx/DeleteSpareConsumption",
                data: '{TransactionID:' + JSON.stringify(document.getElementById("ShowListID").value) + '}',
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
                    if (res == "Success") {
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