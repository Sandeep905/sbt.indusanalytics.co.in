
var GblStatus = "";
var prefix = "RS";
var sholistData = [], RTSVoucherNo = "";
var WholeItem = [], WholeItemGridtData = [], AllocatedItemData = [];

$("#RTSDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#ChallanDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

CreateVoucherNO();
function CreateVoucherNO() {
    $.ajax({
        type: "POST",
        url: "WebService_ReturnToSupplier.asmx/GetRTSVoucherNO",
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
                document.getElementById("TxtVoucherNo").value = RTSVoucherNo;
            }
        }
    });
}

document.getElementById("LOADER").style.display = "block";
$.ajax({
    type: "POST",
    url: "WebService_ReturnToSupplier.asmx/Showlist",
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
                { dataField: "UserID", visible: false, width: 120 },
                { dataField: "VoucherID", visible: false, width: 120 },
                { dataField: "MaxVoucherNo", visible: false, width: 120, caption: "MaxVoucherNo" },
                { dataField: "SupplierName", visible: true, caption: "Supplier Name", width: 150 },
                { dataField: "VoucherNo", visible: true, caption: "Voucher No.", width: 150 },
                { dataField: "VoucherDate", visible: true, caption: "Voucher Date", dataType: "date", format: "dd-MMM-yyyy", Mode: "DateRangeCalendar", width: 100 },
                { dataField: "TotalQuantity", visible: true, caption: "Total Quantity", width: 120 },
                { dataField: "Narration", visible: true, caption: "Narration", width: 250 },
                { dataField: "DeliveryNoteNo", visible: true, caption: "Challan No.", width: 100 },
                { dataField: "DeliveryNoteDate", visible: true, caption: "Challan Date", width: 120 },
                { dataField: "Particular", visible: true, caption: "Particular", width: 250 },
                { dataField: "CreatedBy", visible: true, caption: "Created By", width: 150 }
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
    $("#TxtSupplierName").dxSelectBox({
        value: ''
    });
    document.getElementById("TxtNarration").value = '';

    document.getElementById("WOCSPrintButton").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");

});

try {
    $.ajax({
        type: "POST",
        url: "WebService_ReturnToSupplier.asmx/SupplierName",
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

            $("#TxtSupplierName").dxSelectBox({
                items: receivers,
                placeholder: "Supplier Name",
                displayExpr: 'LedgerName',
                valueExpr: 'LedgerID',
                searchEnabled: true,
                showClearButton: true,
                onSelectionChanged: function (Showlist) {
                    document.getElementById("TxtQuantity").value = 0;
                    document.getElementById("TxtReceiptQty").value = '';
                    GetWholeItemStock();
                }
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
        document.getElementById("TxtQuantity").value = Number(WholeItemGridtData[0].BatchStock);
    },
    columns: [
        { dataField: "LedgerID", visible: false, caption: "LedgerID" },
        { dataField: "ItemID", visible: false, caption: "ItemID" },
        { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID" },
        { dataField: "WarehouseID", visible: false, caption: "WarehouseID" },
        { dataField: "ItemCode", visible: true, caption: "Item Code" },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 100 },
        { dataField: "Quality", visible: true, caption: "Quality", width: 100 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "Mill", visible: true, caption: "Mill", width: 100 },
        { dataField: "Finish", visible: true, caption: "Finish", width: 100 },
        { dataField: "ItemSize", visible: true, caption: "Size", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 180 },
        { dataField: "GRNNo", visible: true, caption: "GRN No" },
        { dataField: "GRNDate", visible: true, caption: "GRN Date" },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse" },
        { dataField: "BinName", visible: true, caption: "Bin" }
    ]
});

//AllocatedItemGrid
$("#AllotedItemGrid").dxDataGrid({
    dataSource: [],
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
        text: 'Data is loading...'
    },
    editing: {
        allowDeleting: true
    },
    height: function () {
        window.innerHeight / 2.3;
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
        { dataField: "ItemCode", visible: true, caption: "Item Code" },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 100 },
        { dataField: "Quality", visible: true, caption: "Quality", width: 100 },
        { dataField: "GSM", visible: true, caption: "GSM", width: 100 },
        { dataField: "Mill", visible: true, caption: "Mill", width: 100 },
        { dataField: "Finish", visible: true, caption: "Finish", width: 100 },
        { dataField: "ItemSize", visible: true, caption: "Size", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "BatchStock", visible: true, caption: "Batch Stock", width: 100 },
        { dataField: "BatchNo", visible: true, caption: "Batch No", width: 180 },
        { dataField: "IssueQuantity", visible: true, caption: "Return Qty" },
        { dataField: "GRNNo", visible: true, caption: "GRN No" },
        { dataField: "GRNDate", visible: true, caption: "GRN Date" },
        { dataField: "WarehouseName", visible: true, caption: "Warehouse" },
        { dataField: "BinName", visible: true, caption: "Bin" }
    ]
});

$("#BtnNew").click(function () {
    location.reload();
});

function GetWholeItemStock() {
    var TxtSupplierID = $('#TxtSupplierName').dxSelectBox('instance').option('value');
    $.ajax({
        type: "POST",
        url: "WebService_ReturnToSupplier.asmx/GetStockBatchWise",
        data: '{SupplierID:' + JSON.stringify(TxtSupplierID) + '}',
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
    // alert(totalReceiptQty);
    if (Number(totalReceiptQty) > Number(WholeItemGridtData[0].BatchStock)) {
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
                    optAllocatedItemGrid.LedgerID = WholeItemGridtData[0].LedgerID;
                    optAllocatedItemGrid.ItemID = WholeItemGridtData[0].ItemID;
                    // optAllocatedItemGrid.ItemGroupID = WholeItemGridtData[0].ItemGroupID;
                    // optAllocatedItemGrid.ItemGroupNameID = WholeItemGridtData[0].ItemGroupNameID;
                    // optAllocatedItemGrid.ItemSubGroupID = WholeItemGridtData[0].ItemSubGroupID;
                    optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
                    optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
                    // optAllocatedItemGrid.ItemSubGroupName = WholeItemGridtData[0].ItemSubGroupName;
                    // optAllocatedItemGrid.ItemGroupName = WholeItemGridtData[0].ItemGroupName;
                    optAllocatedItemGrid.ItemCode = WholeItemGridtData[0].ItemCode;
                    optAllocatedItemGrid.ItemName = WholeItemGridtData[0].ItemName;

                    optAllocatedItemGrid.Quality = WholeItemGridtData[0].Quality;
                    optAllocatedItemGrid.GSM = WholeItemGridtData[0].GSM;
                    optAllocatedItemGrid.Mill = WholeItemGridtData[0].Mill;
                    optAllocatedItemGrid.Finish = WholeItemGridtData[0].Finish;
                    optAllocatedItemGrid.ItemSize = WholeItemGridtData[0].ItemSize;
                    optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;

                    optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtReceiptQty").value;
                    optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
                    optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
                    optAllocatedItemGrid.GRNNo = WholeItemGridtData[0].GRNNo;
                    optAllocatedItemGrid.GRNDate = WholeItemGridtData[0].GRNDate;
                    optAllocatedItemGrid.WarehouseName = WholeItemGridtData[0].WarehouseName;
                    optAllocatedItemGrid.BinName = WholeItemGridtData[0].BinName;

                    AllocatedItemData.push(optAllocatedItemGrid);
                } else {
                    optAllocatedItemGrid = {};

                    optAllocatedItemGrid.TransID = t + 1;
                    optAllocatedItemGrid.TransactionID = ItemGrid._options.dataSource[t].TransactionID;
                    optAllocatedItemGrid.LedgerID = ItemGrid._options.dataSource[t].LedgerID;
                    optAllocatedItemGrid.ItemID = ItemGrid._options.dataSource[t].ItemID;
                    // optAllocatedItemGrid.ItemGroupID = ItemGrid._options.dataSource[t].ItemGroupID;
                    // optAllocatedItemGrid.ItemGroupNameID = ItemGrid._options.dataSource[t].ItemGroupNameID;
                    // optAllocatedItemGrid.ItemSubGroupID = ItemGrid._options.dataSource[t].ItemSubGroupID;
                    optAllocatedItemGrid.ParentTransactionID = ItemGrid._options.dataSource[t].ParentTransactionID;
                    optAllocatedItemGrid.WarehouseID = ItemGrid._options.dataSource[t].WarehouseID;
                    // optAllocatedItemGrid.ItemSubGroupName = ItemGrid._options.dataSource[t].ItemSubGroupName;
                    // optAllocatedItemGrid.ItemGroupName = ItemGrid._options.dataSource[t].ItemGroupName;
                    optAllocatedItemGrid.ItemCode = ItemGrid._options.dataSource[t].ItemCode;
                    optAllocatedItemGrid.ItemName = ItemGrid._options.dataSource[t].ItemName;
                    optAllocatedItemGrid.Quality = ItemGrid._options.dataSource[t].Quality;
                    optAllocatedItemGrid.GSM = ItemGrid._options.dataSource[t].GSM;
                    optAllocatedItemGrid.Mill = ItemGrid._options.dataSource[t].Mill;
                    optAllocatedItemGrid.Finish = ItemGrid._options.dataSource[t].Finish;
                    optAllocatedItemGrid.ItemSize = ItemGrid._options.dataSource[t].ItemSize;
                    optAllocatedItemGrid.BatchStock = ItemGrid._options.dataSource[t].BatchStock;
                    optAllocatedItemGrid.IssueQuantity = ItemGrid._options.dataSource[t].IssueQuantity;
                    optAllocatedItemGrid.StockUnit = ItemGrid._options.dataSource[t].StockUnit;
                    optAllocatedItemGrid.BatchNo = ItemGrid._options.dataSource[t].BatchNo;
                    optAllocatedItemGrid.GRNNo = ItemGrid._options.dataSource[t].GRNNo;
                    optAllocatedItemGrid.GRNDate = ItemGrid._options.dataSource[t].GRNDate;
                    optAllocatedItemGrid.WarehouseName = ItemGrid._options.dataSource[t].WarehouseName;
                    optAllocatedItemGrid.BinName = ItemGrid._options.dataSource[t].BinName;

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
        optAllocatedItemGrid.LedgerID = WholeItemGridtData[0].LedgerID;
        optAllocatedItemGrid.ItemID = WholeItemGridtData[0].ItemID;
        // optAllocatedItemGrid.ItemGroupID = WholeItemGridtData[0].ItemGroupID;
        // optAllocatedItemGrid.ItemGroupNameID = WholeItemGridtData[0].ItemGroupNameID;
        // optAllocatedItemGrid.ItemSubGroupID = WholeItemGridtData[0].ItemSubGroupID;
        optAllocatedItemGrid.ParentTransactionID = WholeItemGridtData[0].ParentTransactionID;
        optAllocatedItemGrid.WarehouseID = WholeItemGridtData[0].WarehouseID;
        // optAllocatedItemGrid.ItemSubGroupName = WholeItemGridtData[0].ItemSubGroupName;
        // optAllocatedItemGrid.ItemGroupName = WholeItemGridtData[0].ItemGroupName;
        optAllocatedItemGrid.ItemCode = WholeItemGridtData[0].ItemCode;
        optAllocatedItemGrid.ItemName = WholeItemGridtData[0].ItemName;
        optAllocatedItemGrid.Quality = WholeItemGridtData[0].Quality;
        optAllocatedItemGrid.GSM = WholeItemGridtData[0].GSM;
        optAllocatedItemGrid.Mill = WholeItemGridtData[0].Mill;
        optAllocatedItemGrid.Finish = WholeItemGridtData[0].Finish;
        optAllocatedItemGrid.ItemSize = WholeItemGridtData[0].ItemSize;
        optAllocatedItemGrid.BatchStock = WholeItemGridtData[0].BatchStock;
        optAllocatedItemGrid.IssueQuantity = document.getElementById("TxtReceiptQty").value;
        optAllocatedItemGrid.StockUnit = WholeItemGridtData[0].StockUnit;
        optAllocatedItemGrid.BatchNo = WholeItemGridtData[0].BatchNo;
        optAllocatedItemGrid.GRNNo = WholeItemGridtData[0].GRNNo;
        optAllocatedItemGrid.GRNDate = WholeItemGridtData[0].GRNDate;
        optAllocatedItemGrid.WarehouseName = WholeItemGridtData[0].WarehouseName;
        optAllocatedItemGrid.BinName = WholeItemGridtData[0].BinName;

        AllocatedItemData.push(optAllocatedItemGrid);

        $("#AllotedItemGrid").dxDataGrid({
            dataSource: AllocatedItemData
        });
    }
});

$("#BtnSave").click(function () {
    var VoucherDate = $('#RTSDate').dxDateBox('instance').option('value');
    var TxtSupplierName = $('#TxtSupplierName').dxSelectBox('instance').option('value');
    var TxtNarration = document.getElementById("TxtNarration").value;
    var TxtChallanNo = document.getElementById("TxtChallanNo").value;
    var ChallanDate = $('#ChallanDate').dxDateBox('instance').option('value');
    var prefix = "RS";

    if (TxtSupplierName === "" || TxtSupplierName === "undefined" || TxtSupplierName === null) {
        DevExpress.ui.notify("Please select Supplier Name..!", "warning", 1200);
        return;
    }
    if (TxtChallanNo === "" || TxtChallanNo === "undefined" || TxtChallanNo === null) {
        DevExpress.ui.notify("Please enter Challan No. .!", "warning", 1200);
        return;
    }
    if (ChallanDate === "" || ChallanDate === "undefined" || ChallanDate === null) {
        DevExpress.ui.notify("Please select Challan Date..!", "warning", 1200);
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
    TransactionMainRecord.VoucherID = -28;
    TransactionMainRecord.VoucherDate = VoucherDate;
    TransactionMainRecord.TotalQuantity = totalReceiptQty;
    TransactionMainRecord.Narration = TxtNarration;
    TransactionMainRecord.LedgerID = TxtSupplierName;
    TransactionMainRecord.DeliveryNoteNo = TxtChallanNo;
    TransactionMainRecord.DeliveryNoteDate = ChallanDate;
    TransactionMainRecord.Particular = "Return To : " + $('#TxtSupplierName').dxSelectBox('instance').option('text') + " on date : " + VoucherDate;
    jsonObjectsTransactionMain.push(TransactionMainRecord);


    var jsonObjectsTransactionDetail = [];
    var TransactionDetailRecord = {};
    if (ItemGridRow > 0) {
        for (var e = 0; e < ItemGridRow; e++) {
            TransactionDetailRecord = {};
            TransactionDetailRecord.TransID = e + 1;
            TransactionDetailRecord.ItemID = ItemGrid._options.dataSource[e].ItemID;
            // TransactionDetailRecord.ItemGroupID = ItemGrid._options.dataSource[e].ItemGroupID;
            TransactionDetailRecord.IssueQuantity = ItemGrid._options.dataSource[e].IssueQuantity;
            TransactionDetailRecord.BatchNo = ItemGrid._options.dataSource[e].BatchNo;
            //TransactionDetailRecord.IssueTransactionID = ItemGrid._options.dataSource[e].ParentTransactionID;
            TransactionDetailRecord.ParentTransactionID = ItemGrid._options.dataSource[e].ParentTransactionID;
            TransactionDetailRecord.FloorWarehouseID = ItemGrid._options.dataSource[e].WarehouseID;
            TransactionDetailRecord.WarehouseID = ItemGrid._options.dataSource[e].WarehouseID;
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
                            url: "WebService_ReturnToSupplier.asmx/UpdateData",
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
                            url: "WebService_ReturnToSupplier.asmx/SaveData",
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
    if (TxtConsumptionID === "" || TxtConsumptionID === null || TxtConsumptionID === undefined) {
        DevExpress.ui.notify("Please select issue vouchers to edit or view..!", "warning", 1200);
        return false;
    }
    GblStatus = "Update";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";

    $.ajax({
        type: "POST",
        url: "WebService_ReturnToSupplier.asmx/SelectedRow",
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

    $("#TxtSupplierName").dxSelectBox({
        value: sholistData[0].LedgerID,
    });
    document.getElementById("TxtVoucherNo").value = sholistData[0].VoucherNo;
    document.getElementById("TxtNarration").value = sholistData[0].Narration;
    $("#RTSDate").dxDateBox({
        value: sholistData[0].VoucherDate,
    });
    document.getElementById("TxtChallanNo").value = sholistData[0].DeliveryNoteNo;
    $("#ChallanDate").dxDateBox({
        value: sholistData[0].DeliveryNoteDate,
    });
    document.getElementById("BtnDeletePopUp").disabled = false;

});

$("#DeleteButton").click(function () {
    var TxtConsumptionID = document.getElementById("ShowListID").value;
    if (TxtConsumptionID === "" || TxtConsumptionID === null || TxtConsumptionID === undefined) {
        DevExpress.ui.notify("Please select any issue voucher to delete..!", "warning", 1200);
        return false;
    }
    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this ' + sholistData[0].VoucherNo + ' voucher no.!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
        function () {
            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_ReturnToSupplier.asmx/DeleteIRFS",
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
                    if (res === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        location.reload();
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    console.log(jqXHR);
                }
            });

        });

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});