"use strict";

var optionAuditModules = ["Requisitions", "Picklist"];
var optionAuditApprovals = ["Unapproved", "Approved", "Cancelled"];
var Groupdata = "";
var serviceUrl = "";
var serviceDetailUrl = "";
var groupData = "";
var detailData = "";
var GetApprovalData = "";
var requisitionfilename = "";
$(function () {
    $("#optModules").dxRadioGroup({
        items: optionAuditModules,
        value: optionAuditModules[0],
        layout: "horizontal"
    });

    $("#optApproval").dxRadioGroup({
        items: optionAuditApprovals,
        value: optionAuditApprovals[0],
        layout: "horizontal"
    });
});

serviceUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitions";
serviceDetailUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitionDetails";
RefreshRequisitions();

$(function () {
    $("#optModules").dxRadioGroup({
        onValueChanged: function (e) {
            var newValue = e.value;
            if (e.value == 'Requisitions') {
                var approvalStatus = $("#optApproval").dxRadioGroup('instance').option('value');
                if (approvalStatus == "Unapproved") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitionDetails";
                    requisitionfilename = "Audit Unapproved Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (approvalStatus == "Approved") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/AuditApprovedRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/AuditApprovedRequisitionDetails";
                    requisitionfilename = "Audit Approved Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "UnApprove"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (approvalStatus == "Cancelled") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/CancelledAuditRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/CancelledAuditRequisitionDetails";
                    requisitionfilename = "Audit Cancelled Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "UnCancel"
                }
                RefreshRequisitions();
            } else if (e.value == "Picklist") {
                var approvalStatus = $("#optApproval").dxRadioGroup('instance').option('value');
                if (approvalStatus == undefined || approvalStatus == null) {
                    approvalStatus = "Unapproved";
                }
                if (approvalStatus == "Unapproved") {
                    serviceUrl = "WebService_PickList.asmx/AuditUnApprovedPicklist";
                    serviceDetailUrl = "";
                    requisitionfilename = "Audit Unapproved Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (approvalStatus == "Approved") {
                    serviceUrl = "WebService_PickList.asmx/AuditApprovedPicklist";
                    requisitionfilename = "Audit Approved Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "UnApprove"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                    serviceDetailUrl = "";
                } else if (approvalStatus == "Cancelled") {
                    serviceUrl = "WebService_PickList.asmx/CancelledAuditPicklist";
                    requisitionfilename = "Audit Cancelled Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "UnCancel"
                    serviceDetailUrl = "";
                }
                RefreshAuditPicklist();
            }
        }
    });
});

$(function () {
    $("#optApproval").dxRadioGroup({
        onValueChanged: function (e) {
            var moduleName = $("#optModules").dxRadioGroup('instance').option('value');
            if (moduleName == undefined || moduleName == null) {
                moduleName = "Requisitions";
            }
            var newValue = e.value;
            if (moduleName == 'Requisitions') {
                if (e.value == "Unapproved") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/AuditUnApprovedRequisitionDetails";
                    requisitionfilename = "Audit Unapproved Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (e.value == "Approved") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/AuditApprovedRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/AuditApprovedRequisitionDetails";
                    requisitionfilename = "Audit Approved Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "UnApprove"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (e.value == "Cancelled") {
                    serviceUrl = "WebServiceRequisitionApproval.asmx/CancelledAuditRequisitions";
                    serviceDetailUrl = "WebServiceRequisitionApproval.asmx/CancelledAuditRequisitionDetails";
                    requisitionfilename = "Audit Cancelled Requisition's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "UnCancel"
                }
                RefreshRequisitions();
            } else if (moduleName == "Picklist") {
                if (e.value == "Unapproved") {
                    serviceUrl = "WebService_PickList.asmx/AuditUnApprovedPicklist";
                    requisitionfilename = "Audit Unapproved Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (e.value == "Approved") {
                    serviceUrl = "WebService_PickList.asmx/AuditApprovedPicklist";
                    requisitionfilename = "Audit Approved Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "UnApprove"
                    document.getElementById("Btn_Cancel").innerHTML = "Cancel"
                } else if (e.value == "Cancelled") {
                    serviceUrl = "WebService_PickList.asmx/CancelledAuditPicklist";
                    requisitionfilename = "Audit Cancelled Picklist's";
                    document.getElementById("Btn_Update").innerHTML = "Approve"
                    document.getElementById("Btn_Cancel").innerHTML = "UnCancel"
                }
                RefreshAuditPicklist();
            }
        }
    });
});

function RefreshRequisitions() {
    try {

        $.ajax({
            type: "POST",
            url: serviceUrl,
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                // document.getElementById("LOADER").style.display = "none";
                // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                groupData = JSON.parse(res);
            }
        });

        $.ajax({
            type: "POST",
            url: serviceDetailUrl,
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                detailData = JSON.parse(res);
                setRequisitionGrid(groupData, detailData);
                var gridInstance = $("#gridAudit").dxDataGrid('instance');
                var btntext = $("#optApproval").dxRadioGroup('instance');
                if (btntext.option('value') === "Unapproved") {
                    gridInstance.columnOption("ApprovedBy", "visible", false);
                } else if (btntext.option('value') === "Approved") {
                    gridInstance.columnOption("ApprovedBy", "visible", true);
                } else {
                    gridInstance.columnOption("ApprovedBy", "visible", false);
                }
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function setRequisitionGrid(mainData, masterDetailData) {
    GetApprovalData = "";
    $("#gridAudit").dxDataGrid({
        dataSource: mainData,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        //keyExpr: ["TransactionID", "RequisitionItemID"],
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "multiple", showCheckBoxesMode: "always" },
        paging: {
            pageSize: 20
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [20, 40, 60, 100]
        },
        height: function () {
            return window.innerHeight / 1.2;
        },
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
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },

        onCellClick: function (e) {
            if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            var Row = e.row.rowIndex;
            var Col = e.columnIndex;
        },

        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditorPreparing: function (e) {
            if (e.parentType == 'headerRow' && e.command == 'select') {
                e.editorElement.remove();
            }
        },
        onEditingStart: function (e) {
            if (e.column.visibleIndex > 1) {
                e.cancel = true;
            }
        },
        onSelectionChanged: function (clickedCell) {
            var Radiobtnval = $("#optApproval").dxRadioGroup('instance').option('value');
            if (Radiobtnval == "Approved") {
                //alert(clickedCell.currentSelectedRowKeys[0]);
                if (clickedCell.currentSelectedRowKeys[0] != undefined) {
                    console.log(clickedCell.currentSelectedRowKeys[0].IsVoucherItemApproved);
                    if (clickedCell.currentSelectedRowKeys[0].IsVoucherItemApproved !== false && clickedCell.currentSelectedRowKeys[0].IsVoucherItemApproved !== "0") {
                        DevExpress.ui.notify("This requisition has been used in further transactions, Can't Unapproved..!", "warning", 3000);
                        clickedCell.component.deselectRows((clickedCell || {}).currentSelectedRowKeys[0]);
                        clickedCell.currentSelectedRowKeys = [];
                    }
                    else {
                        GetApprovalData = clickedCell.selectedRowsData;
                    }
                }
            }
            else {
                GetApprovalData = clickedCell.selectedRowsData;
            }
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 50 },
            { dataField: "RequisitionItemID", visible: false, caption: "RequisitionItemID", width: 50 },
            { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Req. No.", width: 100, fixed: true },
            { dataField: "VoucherNo", visible: true, caption: "Requisition No", width: 150, fixed: true },
            { dataField: "VoucherDate", visible: true, caption: "Requisition Date", width: 150, fixed: true },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 120 },
            { dataField: "RequiredQuantity", visible: true, caption: "Req. Qty", width: 100 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
            { dataField: "ExpectedDeliveryDate", visible: true, caption: "Expec.Date", dataType: "date", format: 'dd-MMM-yyyy', width: 100 },
            { dataField: "ItemNarration", visible: true, caption: "Item Remark", width: 200 },
            { dataField: "Narration", visible: true, caption: "Remark", width: 200 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 120 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 120 },
            { dataField: "IsVoucherItemApproved", visible: false },
        ],

        masterDetail: {
            enabled: true,
            template: function (container, options) {
                //$("<div>")
                //    .addClass("master-detail-caption")
                //    .text(currentEmployeeData.VoucherNo + "  (Requisition No.)")
                //    .appendTo(container);

                $("<div>")
                    .dxDataGrid({
                        columnAutoWidth: true,
                        showBorders: true,
                        allowColumnResizing: true,
                        columnResizingMode: "widget",
                        sorting: {
                            mode: "none"
                        },
                        columns: [{
                            dataField: "RequisitionTransactionID", visible: false
                        },
                        {
                            dataField: "RequisitionItemID", visible: false
                        },
                        {
                            dataField: "IndentItemID", visible: false
                        },
                        {
                            dataField: "VoucherNo", caption: "Indent No."
                        },
                        {
                            dataField: "VoucherDate", caption: "Indent Date", dataType: "date", format: 'dd-MMM-yyyy'
                        },
                        {
                            dataField: "ItemCode",
                            caption: "Item Code",
                        },
                        {
                            dataField: "ItemGroupName",
                            caption: "Item Group",
                        },
                        {
                            dataField: "ItemSubGroupName",
                            caption: "Sub Group",
                        },

                        {
                            dataField: "ItemName",
                            caption: "Item Name",
                        },
                        {
                            dataField: "RequiredQuantity",
                            caption: "Indent Qty",
                        },
                        {
                            dataField: "StockUnit",
                            caption: "Stock Unit",
                        },
                        {
                            dataField: "ExpectedDeliveryDate", dataType: "date", format: 'dd-MMM-yyyy', visible: false
                        },
                        {
                            dataField: "ItemNarration",
                            caption: "Remark",
                        },
                        ],
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.ArrayStore({
                                key: ["TransactionID", "RequisitionItemID"],
                                data: masterDetailData
                            }),
                            filter: [
                                ["RequisitionTransactionID", "=", options.key.TransactionID],
                                "and",
                                ["RequisitionItemID", "=", options.key.RequisitionItemID]
                            ]
                        })
                    }).appendTo(container);
            }
        }
    });
}

function RefreshAuditPicklist() {
    try {

        $.ajax({
            type: "POST",
            url: serviceUrl,
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                groupData = JSON.parse(res);
                setPicklistGrid(groupData);
                var gridInstance = $("#gridAudit").dxDataGrid('instance');
                var btntext = $("#optApproval").dxRadioGroup('instance');
                if (btntext.option('value') === "Unapproved") {
                    gridInstance.columnOption("ApprovedBy", "visible", false);
                    gridInstance.columnOption("ReleasedQuantity", "visible", false);
                } else {
                    gridInstance.columnOption("ApprovedBy", "visible", true);
                    gridInstance.columnOption("ReleasedQuantity", "visible", true);
                }
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function setPicklistGrid(mainData) {
    GetApprovalData = "";
    $("#gridAudit").dxDataGrid({
        dataSource: mainData,
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
            pageSize: 20
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [20, 40, 60, 100]
        },
        height: function () {
            return window.innerHeight / 1.2;
        },
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
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },

        onCellClick: function (e) {
            if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            var Row = e.row.rowIndex;
            var Col = e.columnIndex;
        },

        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditorPreparing: function (e) {
            if (e.parentType == 'headerRow' && e.command == 'select') {
                e.editorElement.remove();
            }
        },
        onEditingStart: function (e) {
            if (e.column.visibleIndex > 1) {
                e.cancel = true;
            }
        },
        onSelectionChanged: function (clickedCell) {
            var Radiobtnval = $("#optApproval").dxRadioGroup('instance').option('value');
            if (Radiobtnval == "Approved") {
                //alert(clickedCell.currentSelectedRowKeys[0]);
                if (clickedCell.currentSelectedRowKeys[0] != undefined) {
                    if (Number(clickedCell.currentSelectedRowKeys[0].ReleasedQuantity) > 0) {
                        DevExpress.ui.notify("This picklist has been used in further transactions, Can't Unapprove..!", "warning", 3000);
                        clickedCell.component.deselectRows((clickedCell || {}).currentSelectedRowKeys[0]);
                        clickedCell.currentSelectedRowKeys = [];
                    }
                    else {
                        GetApprovalData = clickedCell.selectedRowsData;
                    }
                }
            }
            else {
                GetApprovalData = clickedCell.selectedRowsData;
            }
        },
        columns: [
            { dataField: "PicklistTransactionID", visible: false, caption: "PicklistTransactionID", width: 50 },
            { dataField: "TransactionDetailID", visible: false, caption: "TransactionDetailID", width: 50 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "PicklistNo", visible: true, caption: "Picklist No", width: 80, fixed: true },
            { dataField: "PicklistDate", visible: true, caption: "Picklist Date", width: 100, fixed: true },
            { dataField: "DepartmentName", visible: true, caption: "Department", width: 150 },
            { dataField: "BookingNo", visible: true, caption: "Booking No", width: 80 },
            { dataField: "JobCardNo", visible: true, caption: "Job Card No.", width: 100 },
            { dataField: "JobName", visible: true, caption: "Job Name", width: 250 },
            { dataField: "ContentName", visible: true, caption: "Content Name", width: 150 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
            { dataField: "PicklistQuantity", visible: true, caption: "Pick list Qty", width: 100 },
            { dataField: "ReleasedQuantity", visible: true, caption: "Released Qty", width: 100 },
            { dataField: "TotalAllocatedStock", visible: true, caption: "Allocated Stock", width: 100 },
            { dataField: "TotalPhysicalStock", visible: true, caption: "Physical Stock", width: 200 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 120 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 120 },
            { dataField: "ItemNarration", caption: "Item Remark", width: 200 },
            { dataField: "Narration", caption: "Remarks", visible: true, width: 200 }
        ]
    });
}

$("#Btn_Update").click(function () {
    var radioModule = $("#optModules").dxRadioGroup('instance').option('value');
    var btnstatus = document.getElementById("Btn_Update").innerText.trim();
    if (radioModule == "Requisitions") {
        UpdateRequisitionData(btnstatus);
    } else if (radioModule == "Picklist") {
        UpdatePicklistData(btnstatus);
    }

});

$("#Btn_Cancel").click(function () {
    var radioModule = $("#optModules").dxRadioGroup('instance').option('value');
    var btnstatus = document.getElementById("Btn_Cancel").innerText.trim();
    if (radioModule == "Requisitions") {
        UpdateRequisitionData(btnstatus);
    } else if (radioModule == "Picklist") {
        UpdatePicklistData(btnstatus);
    }

});

function UpdateRequisitionData(UpdateStatus) {

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    if (GetApprovalData.length > 0) {
        for (var e = 0; e < GetApprovalData.length; e++) {
            OperationRecordDetail = {};

            OperationRecordDetail.TransactionID = GetApprovalData[e].TransactionID;
            OperationRecordDetail.ItemID = GetApprovalData[e].RequisitionItemID;
            //OperationRecordDetail.FYear = Groupdata[e].FYear;

            jsonObjectsRecordDetail.push(OperationRecordDetail);
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
                    url: "WebServiceRequisitionApproval.asmx/UpdateRequisitionAuditData",
                    data: '{BtnText:' + JSON.stringify(UpdateStatus) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + '}',
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
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });

            });

    } else {
        DevExpress.ui.notify("Please choose data from given above Grid..!", "error", 1000);
        return false;
    }
}

function UpdatePicklistData(UpdateStatus) {
    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    if (GetApprovalData.length > 0) {
        for (var e = 0; e < GetApprovalData.length; e++) {
            OperationRecordDetail = {};
            OperationRecordDetail.TransactionID = GetApprovalData[e].PicklistTransactionID;
            OperationRecordDetail.TransactionDetailID = GetApprovalData[e].TransactionDetailID;
            OperationRecordDetail.ItemID = GetApprovalData[e].ItemID;
            //OperationRecordDetail.FYear = Groupdata[e].FYear;

            jsonObjectsRecordDetail.push(OperationRecordDetail);
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
                    url: "WebService_PickList.asmx/UpdatePicklistAuditData",
                    data: '{BtnText:' + JSON.stringify(UpdateStatus) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + '}',
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
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });

            });

    } else {
        DevExpress.ui.notify("Please choose data from given above Grid..!", "error", 1000);
        return false;
    }
}