"use strict";

var GblStatus = "";
var RadioValue = "";
var ValRES1 = [];
var VarPendingRes = [];
var objContainer = "";
var objContainer1 = "";
var FilteredArray = [];
var GetPickListStatusGridData = [];

RadioValue = "Pending";

var priorities = ["Pending", "Completed", "Cancel", "Released"];
$("#RadioButtonPicklistStatus").dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        RadioValue = e.value;
        $('#PickListStatusGrid').dxDataGrid('instance').clearSelection();
        radioGroup();
    }
});

document.getElementById("LOADER").style.display = "block";
$.ajax({
    type: "POST",
    url: "WebService_PickListStatus.asmx/GetUnreleasedANDCancelledPicklist",
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
        VarPendingRes = [];
        VarPendingRes = JSON.parse(res.toString());

        objContainer1 = "";
        objContainer1 = { 'FilterPendingData': VarPendingRes };
        radioGroup();
    }
});
$.ajax({
    type: "POST",
    url: "WebService_PickListStatus.asmx/GetWholeData",
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

        objContainer = "";
        objContainer = { 'FilterData': ValRES1 };
        //radioGroup();
    }
});

function radioGroup() {
    document.getElementById("PLSPrintButton").disabled = true;
    $("#PLSPrintButton").addClass("hidden");
    $("#BtnComplete").addClass("hidden");
    $("#BtnInComplete").addClass("hidden");
    $("#BtnUnCancel").addClass("hidden");
    $("#BtnUnReleased").addClass("hidden");
    $("#BtnCancel").addClass("hidden");
    $("#BtnReleased").addClass("hidden");
    if (RadioValue === "Pending") {
        $("#BtnReleased").removeClass("hidden");
        $("#BtnCancel").removeClass("hidden");
        FilteredArray = [];
        FilteredArray = objContainer1.FilterPendingData.filter(function (el) {
            return el.IsCancelled === false;
        });
    }
    else if (RadioValue === "Completed") {
        $("#BtnInComplete").removeClass("hidden");

        FilteredArray = [];
        FilteredArray = objContainer.FilterData.filter(function (el) {
            return el.IsReleased === true && el.IsCompleted === true;
        });
    }
    else if (RadioValue === "Cancel") {
        $("#BtnUnCancel").removeClass("hidden");
        $("#BtnReleased").removeClass("hidden");
        FilteredArray = [];
        FilteredArray = objContainer1.FilterPendingData.filter(function (el) {
            return el.IsCancelled === true;
        });
    }
    else if (RadioValue === "Released") {
        document.getElementById("PLSPrintButton").disabled = false;

        $("#PLSPrintButton").removeClass("hidden");
        $("#BtnComplete").removeClass("hidden");
        $("#BtnUnReleased").removeClass("hidden");
        FilteredArray = [];
        FilteredArray = objContainer.FilterData.filter(function (el) {
            return el.IsReleased === true && el.IsCompleted === false; ///is completed added by pKp on 170420
        });
    }

    fillStatusGrid();
}

function fillStatusGrid() {
    var PicklistTransactionID = 0;
    var ReleasedFlag = false, CancelFlag = false, CompletedFlag = false;
    var PendingQtyCap = "Pending Qty";
    if (RadioValue === "Released") {
        ReleasedFlag = true;
        PendingQtyCap = "Pending Qty To Issue";
    } else if (RadioValue === "Cancel") {
        CancelFlag = true;
    } else if (RadioValue === "Completed") {
        ReleasedFlag = true;
        CompletedFlag = true;
    }

    $("#PickListStatusGrid").dxDataGrid({
        dataSource: FilteredArray,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "multiple", selectAllMode: "allPages" },
        paging: {
            pageSize: 25
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [25, 50, 100, 500]
        },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        filterRow: { visible: true, applyFilter: "auto" },
        headerFilter: { visible: true },
        height: function () {
            return window.innerHeight / 1.3;
        },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        export: {
            enabled: true,
            fileName: "Pending Picklist to release",
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
        onRowUpdated: function (e) {
            e.data.PendingQuantity = Number(e.data.PendingQuantity).toFixed(e.data.UnitDecimalPlace);
            if (Number(e.data.ReleaseQuantity) <= Number(e.data.PicklistQuantity) - Number(e.data.ReleasedQuantity)) {
                e.data.PendingQuantity = Number(e.data.PicklistQuantity) - Number(e.data.ReleasedQuantity) - Number(e.data.ReleaseQuantity);
            } else {
                e.data.PendingQuantity = Number(e.data.PicklistQuantity) - Number(e.data.ReleasedQuantity);
                e.data.ReleaseQuantity = 0;
            }
        },
        onSelectionChanged: function (selectedItems) {
            GetPickListStatusGridData = selectedItems.selectedRowsData;

            if (selectedItems.currentSelectedRowKeys.length > 0) {
                if ((selectedItems.currentSelectedRowKeys[0].ReleaseQuantity === undefined || selectedItems.currentSelectedRowKeys[0].ReleaseQuantity <= 0) && (RadioValue === "Pending" || RadioValue === "Cancel")) {
                    selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please enter release quantity first..!", "warning", 2000);
                    selectedItems.currentSelectedRowKeys = [];
                    return false;
                } else if (PicklistTransactionID === 0) {
                    PicklistTransactionID = selectedItems.currentSelectedRowKeys[0].PicklistTransactionID;
                }
                else if (PicklistTransactionID !== selectedItems.currentSelectedRowKeys[0].PicklistTransactionID) {
                    selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                    DevExpress.ui.notify("Please select records which have same pick list voucher..!", "warning", 2000);
                    selectedItems.currentSelectedRowKeys = [];
                    return false;
                }
            }
            if (GetPickListStatusGridData.length === 0) PicklistTransactionID = 0;
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "ReleaseQuantity" && (RadioValue === "Pending" || RadioValue === "Cancel")) {
                e.cancel = false;
            }
            else {
                e.cancel = true;
            }
        },
        columns: [
            { dataField: "PicklistTransactionID", visible: false, caption: "PicklistTransactionID" },
            { dataField: "TransactionDetailID", visible: false, caption: "TransactionDetailID" },
            { dataField: "PicklistReleaseTransactionID", visible: false, caption: "PicklistReleaseTransactionID" },
            { dataField: "DepartmentID", visible: false, caption: "DepartmentID" },
            { dataField: "MachineID", visible: false, caption: "MachineID" },
            { dataField: "ProcessID", visible: false, caption: "ProcessID" },
            { dataField: "ParentTransactionID", visible: false, caption: "ParentTransactionID" },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID" },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID" },
            { dataField: "ItemID", visible: false, caption: "ItemID" },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID" },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID" },
            { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID" },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID" },
            { dataField: "PicklistNo", visible: true, caption: "Picklist No.", width: 100, fixed: true },
            {
                dataField: "PicklistDate", visible: true, caption: "Picklist Date",
                dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
                calculateCellValue: function (e) {
                    return new Date(parseInt(e.PicklistDate.substr(6)));
                }
            },
            { dataField: "MaxReleaseNo", visible: false, caption: "Release No.", width: 80 },
            { dataField: "DepartmentName", visible: true, caption: "Department", width: 120 },
            { dataField: "BookingNo", visible: false, caption: "Booking No" },
            { dataField: "JobCardNo", visible: true, caption: "Job Card No.", width: 100 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 150 },
            { dataField: "ContentName", visible: true, caption: "Content Name", width: 150 },
            { dataField: "ProcessName", visible: true, caption: "Process Name", width: 100 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 200 },
            { dataField: "ItemDescription", visible: false, caption: "Item Description" },
            { dataField: "StockUnit", visible: true, caption: "Unit", width: 60 },
            { dataField: "PicklistQuantity", visible: true, caption: "Picklist Qty", width: 100 },
            { dataField: "ReleasedQuantity", visible: true, caption: "Released Qty", width: 100 },
            { dataField: "IssuedQuantity", visible: true, caption: "Issue Qty", width: 100 },
            { dataField: "ReleaseQuantity", visible: true, caption: "Release Qty", width: 100, validationRules: [{ type: "required" }, { type: "numeric" }] },
            { dataField: "PendingQuantity", visible: true, caption: PendingQtyCap, width: 100 },
            { dataField: "BatchNo", visible: false, caption: "BatchNo" },
            { dataField: "Warehouse", visible: false, caption: "Warehouse" },
            { dataField: "Bin", visible: false, caption: "Bin" },
            { dataField: "TotalAllocatedStock", visible: true, caption: "Total Allocated Stock", width: 150 },
            { dataField: "TotalPhysicalStock", visible: true, caption: "Total Physical Stock", width: 150 },
            { dataField: "CreatedBy", visible: true, width: 100 },
            { dataField: "IsReleased", visible: false, caption: "Released", dataType: "boolean", width: 100 },
            { dataField: "ReleasedBy", visible: ReleasedFlag, width: 100 },
            {
                dataField: "ReleasedDate", visible: ReleasedFlag,
                dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
                calculateCellValue: function (e) {
                    if (e.ReleasedDate === null) return null;
                    return new Date(parseInt(e.ReleasedDate.substr(6)));
                }
            },
            { dataField: "IsCancelled", visible: false, caption: "Cancelled", dataType: "boolean", width: 100 },
            { dataField: "CancelledBy", visible: CancelFlag, width: 100 },
            {
                dataField: "CancelledDate", visible: CancelFlag,
                dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
                calculateCellValue: function (e) {
                    if (e.CancelledDate === null) return null;
                    return new Date(parseInt(e.CancelledDate.substr(6)));
                }
            },
            { dataField: "IsCompleted", visible: false, caption: "Completed", dataType: "boolean", width: 100 },
            { dataField: "CompletedBy", visible: CompletedFlag, width: 100 },
            {
                dataField: "CompletedDate", visible: CompletedFlag,
                dataType: "date", format: "dd-MMM-yyyy HH:mm:ss",
                calculateCellValue: function (e) {
                    if (e.CompletedDate === null) return null;
                    return new Date(parseInt(e.CompletedDate.substr(6)));
                }
            },
            { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace" }
        ]

    });
}

var jsonObjectsRecordDetail = [];
var OperationRecordDetail = {};

var jsonObjectsRecordUpdate = [];
var OperationRecordUpdate = {};

$("#BtnReleased").click(function () {
    GblStatus = "Release";

    var ItemGrid = $('#PickListStatusGrid').dxDataGrid('instance');
    var ItemGridRow = ItemGrid.totalCount();

    if (GetPickListStatusGridData.length > 0) {
        for (var check = 0; check < GetPickListStatusGridData.length; check++) {
            var TxDetailID = GetPickListStatusGridData[check].TransactionDetailID;
            var TxPickID = GetPickListStatusGridData[check].PicklistTransactionID;
            var TxPickItemID = GetPickListStatusGridData[check].ItemID;
            var TxPickDepartmentID = GetPickListStatusGridData[check].DepartmentID;
            var TxPickJobBookingJobCardContentsID = GetPickListStatusGridData[check].JobBookingJobCardContentsID;
            if (ItemGridRow > 0) {
                for (var g1 = 0; g1 < ItemGridRow; g1++) {
                    var G1TxDetailID = ItemGrid._options.dataSource[g1].TransactionDetailID;
                    var G1TxPickID = ItemGrid._options.dataSource[g1].PicklistTransactionID;
                    var G1TxItemID = ItemGrid._options.dataSource[g1].ItemID;
                    var G1TxDepartmentID = ItemGrid._options.dataSource[g1].DepartmentID;
                    var G1TxJobBookingJobCardContentsID = ItemGrid._options.dataSource[g1].JobBookingJobCardContentsID;
                    if (TxDetailID === G1TxDetailID && G1TxPickID === TxPickID && G1TxItemID === TxPickItemID && G1TxDepartmentID === TxPickDepartmentID && G1TxJobBookingJobCardContentsID === TxPickJobBookingJobCardContentsID) {
                        GetPickListStatusGridData[check].PendingQuantity = ItemGrid._options.dataSource[g1].PendingQuantity;
                        GetPickListStatusGridData[check].ReleaseQuantity = ItemGrid._options.dataSource[g1].ReleaseQuantity;
                    }
                }
            }
        }
    } else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }

    InsertReleasedData();
});

$("#BtnCancel").click(function () {
    if (GetPickListStatusGridData.length > 0) {
        GblStatus = "Cancel";
        UpdateData();
    }
    else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }

});

$("#BtnComplete").click(function () {

    if (GetPickListStatusGridData.length > 0) {
        GblStatus = "Complete";
        UpdateData();
    }
    else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }
});

$("#BtnInComplete").click(function () {
    if (GetPickListStatusGridData.length > 0) {
        GblStatus = "InComplete";
        UpdateData();
    }
    else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }
});

$("#BtnUnCancel").click(function () {
    if (GetPickListStatusGridData.length > 0) {
        GblStatus = "UnCancel";
        UpdateData();
    }
    else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }
});

$("#BtnUnReleased").click(function () {
    if (GetPickListStatusGridData.length > 0) {
        GblStatus = "Delete";
        DeleteReleasedPicklist();
    }
    else {
        DevExpress.ui.notify("Please Choose any Row from above Grid..!", "error", 1000);
        return false;
    }
});

function UpdateData() {
    jsonObjectsRecordDetail = [];
    OperationRecordDetail = {};

    if (GetPickListStatusGridData.length > 0) {
        for (var U = 0; U < GetPickListStatusGridData.length; U++) {
            OperationRecordDetail = {};
            OperationRecordDetail.TransactionID = GetPickListStatusGridData[U].PicklistTransactionID;
            OperationRecordDetail.TransactionDetailID = GetPickListStatusGridData[U].TransactionDetailID;
            OperationRecordDetail.ItemID = GetPickListStatusGridData[U].ItemID;
            OperationRecordDetail.JobBookingJobCardContentsID = GetPickListStatusGridData[U].JobBookingJobCardContentsID;
            //if (GblStatus === "Released") {
            OperationRecordDetail.RequiredQuantity = GetPickListStatusGridData[U].PicklistQuantity;
            //  }
            if (GblStatus === "Cancel") {
                OperationRecordDetail.RejectedQuantity = Number(GetPickListStatusGridData[U].PicklistQuantity) - Number(GetPickListStatusGridData[U].ReleasedQuantity);
            } else if (GblStatus === "UnCancel") {
                OperationRecordDetail.RejectedQuantity = 0;
            } else if (GblStatus === "Complete" || GblStatus === "InComplete") {
                OperationRecordDetail.RejectedQuantity = GetPickListStatusGridData[U].PendingQuantity;
            }
            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }
    }

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

            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_PickListStatus.asmx/UpdatePickListStatus",
                data: '{GblStatus:' + JSON.stringify(GblStatus) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + ',RadioValue:' + JSON.stringify(RadioValue) + '}',
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
                        swal("Updated!", "Your data Updated", "success");
                        location.reload();
                    }
                    else {
                        swal("", res, "error");
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });

        });
}

function InsertReleasedData() {
    jsonObjectsRecordDetail = [];
    OperationRecordDetail = {};

    jsonObjectsRecordUpdate = [];
    OperationRecordUpdate = {};

    if (GetPickListStatusGridData.length <= 0) return;
    for (var U = 0; U < GetPickListStatusGridData.length; U++) {
        if (Number(GetPickListStatusGridData[U].ReleaseQuantity) > 0) {
            OperationRecordDetail = {};

            OperationRecordDetail.PicklistTransactionID = GetPickListStatusGridData[U].PicklistTransactionID;
            OperationRecordDetail.PicklistTransactionDetailID = GetPickListStatusGridData[U].TransactionDetailID;
            //OperationRecordDetail.ParentTransactionID = GetPickListStatusGridData[U].ParentTransactionID;
            OperationRecordDetail.ItemID = GetPickListStatusGridData[U].ItemID;
            OperationRecordDetail.JobBookingID = GetPickListStatusGridData[U].JobBookingID;
            OperationRecordDetail.JobBookingJobCardContentsID = GetPickListStatusGridData[U].JobBookingJobCardContentsID;
            OperationRecordDetail.DepartmentID = GetPickListStatusGridData[U].DepartmentID;
            //OperationRecordDetail.BatchNo = GetPickListStatusGridData[U].BatchNo;
            OperationRecordDetail.StockUnit = GetPickListStatusGridData[U].StockUnit;
            OperationRecordDetail.DepartmentID = GetPickListStatusGridData[U].DepartmentID;
            OperationRecordDetail.ReleaseQuantity = GetPickListStatusGridData[U].ReleaseQuantity;   //PendingQuantity;
            OperationRecordDetail.MaxReleaseNo = GetPickListStatusGridData[U].MaxReleaseNo;

            jsonObjectsRecordDetail.push(OperationRecordDetail);

            OperationRecordUpdate = {};
            OperationRecordUpdate.TransactionID = GetPickListStatusGridData[U].PicklistTransactionID;
            OperationRecordUpdate.TransactionDetailID = GetPickListStatusGridData[U].TransactionDetailID;
            OperationRecordUpdate.ItemID = GetPickListStatusGridData[U].ItemID;
            //OperationRecordUpdate.JobBookingID = GetPickListStatusGridData[U].JobBookingID;
            OperationRecordUpdate.JobBookingJobCardContentsID = GetPickListStatusGridData[U].JobBookingJobCardContentsID;

            jsonObjectsRecordUpdate.push(OperationRecordUpdate);

        }
    }

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

            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_PickListStatus.asmx/InsertPickListReleasedData",
                data: '{jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + ',jsonObjectsRecordUpdate:' + JSON.stringify(jsonObjectsRecordUpdate) + '}',
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
                        swal("Updated!", "Your data Updated", "success");
                        location.reload();
                    } else {
                        swal("Error...!", res, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });

        });

}

function DeleteReleasedPicklist() {
    jsonObjectsRecordDetail = [];
    OperationRecordDetail = {};

    if (GetPickListStatusGridData.length > 0) {
        for (var U = 0; U < GetPickListStatusGridData.length; U++) {
            OperationRecordDetail = {};
            OperationRecordDetail.PicklistReleaseTransactionID = GetPickListStatusGridData[U].PicklistReleaseTransactionID;
            OperationRecordDetail.PicklistTransactionID = GetPickListStatusGridData[U].PicklistTransactionID;
            OperationRecordDetail.PicklistTransactionDetailID = GetPickListStatusGridData[U].TransactionDetailID;
            OperationRecordDetail.MaxReleaseNo = GetPickListStatusGridData[U].MaxReleaseNo;
            OperationRecordDetail.ItemID = GetPickListStatusGridData[U].ItemID;
            OperationRecordDetail.JobBookingJobCardContentsID = GetPickListStatusGridData[U].JobBookingJobCardContentsID;
            //if (GblStatus === "Released") {
            //OperationRecordDetail.RequiredQuantity = GetPickListStatusGridData[U].PicklistQuantity;
            //  }
            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }
    }

    //alert(TxtGRNID);
    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Content!',
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
                url: "WebService_PickListStatus.asmx/DeleteReleasedPicklist",
                data: '{jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + '}',
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
                    } else {
                        swal("Error...!", res, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert("d");
                    alert(jqXHR);
                }
            });

        });
}

$("#PLSPrintButton").click(function () {
    if (RadioValue !== "Released" || GetPickListStatusGridData.length <= 0) return false;
    var ItemIDStr = GetPickListStatusGridData[0].TransactionDetailID;
    var result = $.grep(GetPickListStatusGridData, function (ex) {
        return ex.PicklistTransactionID === GetPickListStatusGridData[0].PicklistTransactionID;
    });
    for (var i = 1; i < result.length; i++) {
        ItemIDStr = ItemIDStr + "," + result[i].TransactionDetailID;
    }

    var url = "ReportPickList.aspx?TransactionID=" + GetPickListStatusGridData[0].PicklistTransactionID + "&ItemIDStr=" + ItemIDStr;
    var ItemGrid = $('#PickListStatusGrid').dxDataGrid('instance');
    ItemGrid.clearSelection();

    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
});