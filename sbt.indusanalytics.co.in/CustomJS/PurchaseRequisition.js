
var GblStatus = "";
var existReq = [];

var DynamicColPush = [];
var Groupdata = "";
var MasterData = "";
var ChangeItemdata = "";
var RequisitionGroup = [];
var RetriveData = "";
var RetriveArray = [];
var AuditApprovalrequired = false;
var MasterGridData = []; //IndentMasterGridData
var SubGridData = [];   //IndentSubGridData

var GetIndentData = "";
var getRequisitionRow = "";
var RadioValue = "Indent List";
var GblJobCardRES = [];

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 250,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

var priorities = ["Indent List", "Created Requisitions"];
$("#RadioButtonPR").dxRadioGroup({
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
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        GblJobCardRES = JSON.parse(res);
    }
});

try {
    $("#RadioButtonStatus").dxRadioGroup({
        items: [{ value: "All", text: "All Req." }, { value: "PendingAuditApproval", text: "Pending Audit Approval" },
        { value: "AuditApproved", text: "Audit Approved" }, { value: "AuditCancelled", text: "Audit Cancelled" },
        { value: "ApprovedRequisition", text: "Approved Requisition" }, { value: "CancelledRequisition", text: "Cancelled Requisition" }],
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

            var FilterSTR = "";
            if (data.value === "All") {
                FilterSTR = "";
            } else if (data.value === "PendingAuditApproval") {
                FilterSTR = " And (Isnull(IED.IsAuditApproved,0)=0 And Isnull(IED.IsAuditCancelled,0)=0) ";
            } else if (data.value === "AuditApproved") {
                FilterSTR = " And (Isnull(IED.IsAuditApproved,0)=1 And Isnull(IED.AuditApprovedBy,0)>0 And Isnull(IED.IsVoucherItemApproved,0)=0) ";
            } else if (data.value === "AuditCancelled") {
                FilterSTR = " And (Isnull(IED.IsAuditApproved,0)=0 And Isnull(IED.IsAuditCancelled,0)=1) ";
            } else if (data.value === "ApprovedRequisition") {
                FilterSTR = " And (Isnull(IED.IsAuditApproved,0)=1 And Isnull(IED.IsVoucherItemApproved,0)=1) ";
            } else if (data.value === "CancelledRequisition") {
                FilterSTR = " And (Isnull(IED.IsCancelled,0)=1 And Isnull(IED.IsVoucherItemApproved,0)=0) ";
            } else {
                FilterSTR = "";
            }

            $.ajax({
                type: "POST",
                url: "WebService_PurchaseRequisition.asmx/FillGrid",
                data: '{RadioValue:' + JSON.stringify(RadioValue) + ',FilterString:' + JSON.stringify(FilterSTR) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                crossDomain: true,
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    RequisitionGroup = JSON.parse(res);
                    fillGridRequisitions(RequisitionGroup);
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

GetDataGrid();
function GetDataGrid() {
    var filter = "";
    RequisitionGroup = [];
    GetIndentData = "";

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    if (RadioValue === "Indent List") {
        $("#RadioButtonStatus").dxRadioGroup({
            disabled: true
        });
        document.getElementById("CreateReqButton").style.display = "block";
        document.getElementById("PRGridIndent").style.display = "block";
        document.getElementById("PRGridRequisitions").style.display = "none";

        document.getElementById("EditReqButton").style.display = "none";
        document.getElementById("DeleteReqButton").style.display = "none";
        // document.getElementById("TxtPRID").value = "";        
    }
    else if (RadioValue === "Created Requisitions") {
        $("#RadioButtonStatus").dxRadioGroup({
            disabled: false
        });
        document.getElementById("CreateReqButton").style.display = "none";
        document.getElementById("PRGridIndent").style.display = "none";
        document.getElementById("PRGridRequisitions").style.display = "block";

        document.getElementById("EditReqButton").style.display = "block";
        document.getElementById("DeleteReqButton").style.display = "block";

        //document.getElementById("TxtPRID").value = "";
    }

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseRequisition.asmx/FillGrid",
        data: '{RadioValue:' + JSON.stringify(RadioValue) + ',FilterString:' + JSON.stringify(filter) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            if (RadioValue === "Indent List") {
                var IndentList = JSON.parse(res);
                fillGridIndent(IndentList);
            } else if (RadioValue === "Created Requisitions") {
                RequisitionGroup = JSON.parse(res);
                fillGridRequisitions(RequisitionGroup);
            }
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

function fillGridIndent(IndentList) {
    $("#PRGridIndent").dxDataGrid({
        dataSource: IndentList,
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
        //scrolling: { mode: 'virtual' },
        height: function () {
            return window.innerHeight / 1.25;
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
            fileName: "Indent List",
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
            if (clickedIndentCell.selectedRowsData.length > 0) {
                GetIndentData = clickedIndentCell.selectedRowsData;
            } else {
                GetIndentData = "";
            }
        },
        columns: [
            { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 50 },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Indent No.", width: 120, fixed: true },
            { dataField: "VoucherNo", visible: true, caption: "Indent No.", width: 100, fixed: true },
            { dataField: "VoucherDate", visible: true, caption: "Indent Date", width: 100, fixed: true },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group Name", width: 120 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 400 },
            { dataField: "RequiredQuantity", visible: true, caption: "Req. Qty", width: 100 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80 },
            { dataField: "JobBookingContentNo", visible: true, caption: "Job Card No", width: 100 },
            { dataField: "BookedStock", visible: true, caption: "Booked Stock", width: 100 },
            { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 100 },
            { dataField: "PhysicalStock", visible: true, caption: "Current Stock", width: 100 },
            { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace" },
            { dataField: "PurchaseUnit", visible: false, caption: "PurchaseUnit" },
            { dataField: "ConversionFormula", visible: false, caption: "ConversionFormula" },
            { dataField: "LastPurchaseDate", visible: true, caption: "Last P.O.Date", dataType: "date", format: 'dd-MMM-yyyy', width: 100 }
        ]
    });
}

function fillGridRequisitions(Requisitions) {
    $("#PRGridRequisitions").dxDataGrid({
        dataSource: Requisitions,
        //keyExpr: "TransactionID",
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
            pageSize: 20
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [20, 40, 60, 100]
        },
        //scrolling: { mode: 'virtual' },
        height: function () {
            return window.innerHeight / 1.25;
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
            fileName: "Created Requisitions",
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
                if (e.data.AuditApproved === false && e.data.IsAuditCancelled === false && e.data.AuditApprovedBy === 0) {
                    e.rowElement.addClass('pendingauditapproval');
                } else if (e.data.AuditApproved === true && e.data.AuditApprovedBy > 0 && e.data.IsVoucherItemApproved === false) {
                    e.rowElement.addClass('auditapproved');
                } else if (e.data.IsAuditCancelled === true) {
                    e.rowElement.addClass('auditcancelled');
                } else if (e.data.AuditApproved === true && e.data.IsVoucherItemApproved === true) {
                    e.rowElement.addClass('approvedrequisition');
                } else if (e.data.AuditApproved === true && e.data.IsCancelled === true) {
                    e.rowElement.addClass('cancelledrequisition');
                }
            }
        },
        // onCellClick: function (e) {
        onSelectionChanged: function (clickedCell) {
            // Groupdata = clickedCell.selectedRowsData;
            //clickedCell.data.ItemID
            // if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
            // var Row = e.row.rowIndex;
            // var Col = e.columnIndex;
            document.getElementById("TxtPRID").value = "";
            if (clickedCell.selectedRowsData.length <= 0) return false;

            document.getElementById("TxtPRID").value = clickedCell.selectedRowsData[0].TransactionID;
            //document.getElementById("LblVoucherNo").innerHTML = "";
            //document.getElementById("LblVoucherNo").innerHTML = clickedCell.selectedRowsData[0].VoucherNo;

            document.getElementById("TxtVoucherNo").value = clickedCell.selectedRowsData[0].VoucherNo;
            document.getElementById("TxtMaxVoucherNo").value = clickedCell.selectedRowsData[0].MaxVoucherNo;
            document.getElementById("textNaretion").value = clickedCell.selectedRowsData[0].Narration;

            $("#VoucherDate").dxDateBox({
                value: clickedCell.selectedRowsData[0].VoucherDate
            });
        },
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 50 },
            { dataField: "VoucherID", visible: false, caption: "VoucherID", width: 120 },
            { dataField: "MaxVoucherNo", visible: true, caption: "Ref.Req.No.", width: 100, fixed: true },
            { dataField: "VoucherNo", visible: true, caption: "Req.No.", width: 150, fixed: true },
            { dataField: "VoucherDate", visible: true, caption: "Req.Date", width: 150, fixed: true },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
            { dataField: "RefJobCardContentNo", visible: true, caption: "Ref.J.C.No.", width: 120 },
            { dataField: "PurchaseQty", visible: true, caption: "Req. Qty", width: 100 },
            { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
            { dataField: "ExpectedDeliveryDate", visible: true, caption: "Expec.Date", dataType: "date", format: 'dd-MMM-yyyy', width: 100 },
            { dataField: "ItemNarration", visible: true, caption: "Item Remark", width: 200 },
            { dataField: "Narration", visible: true, caption: "Remark", width: 200 },
            { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace" },
            { dataField: "TotalQuantity", visible: false, caption: "Total Quantity", width: 120 },
            { dataField: "NoOfItems", visible: false, caption: "No Of Item", width: 120 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 120 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 120 },
            { dataField: "AuditApproved", visible: false, caption: "Audit Approved", width: 120, dataType: "boolean" },
            { dataField: "AuditApprovedBy", visible: false, caption: "AuditApprovedBy", width: 120 },
            { dataField: "IsAuditCancelled", visible: false, caption: "IsAuditCancelled", width: 120, dataType: "boolean" },
            { dataField: "IsVoucherItemApproved", visible: false, caption: "IsVoucherItemApproved", width: 120, dataType: "boolean" },
            { dataField: "IsCancelled", visible: false, caption: "IsCancelled", width: 120, dataType: "boolean" },
            { dataField: "PurchaseUnit", visible: false, caption: "PurchaseUnit", width: 100 }
            // { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            //  { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            // { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 120 },
            // { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 120 },
            //{ dataField: "ItemID", visible: true, caption: "ItemID", width: 120 },                     
            //{ dataField: "ItemGroupName", visible: true, caption: "Item Group Name", width: 120 },
            //{ dataField: "ItemName", visible: false, caption: "Item Name", width: 120 },
            //{ dataField: "RequiredQuantity", visible: false, caption: "RequiredQuantity", width: 120 },
            //{ dataField: "BookedStock", visible: false, caption: "Booked Stock", width: 120 },
            //{ dataField: "AllocatedStock", visible: false, caption: "Allocated Stock", width: 120 },
            //{ dataField: "PhysicalStock", visible: false, caption: "Current Stock", width: 120 },
            //{ dataField: "StockUnit", visible: false, caption: "Stock Unit", width: 120 },
            //{ dataField: "ExpectedDeliveryDate", visible: false, caption: "ExpectedDeliveryDate", width: 120 },
            //{ dataField: "ItemNarration", visible: false, caption: "Item Remark", width: 120 },
        ]

        //masterDetail: {
        //    enabled: true,
        //    template: function (container, options) {
        //        var currentEmployeeData = options.data;

        //        //$("<div>")
        //        //    .addClass("master-detail-caption")
        //        //    .text(currentEmployeeData.VoucherNo + "  (Requisition No.)")
        //        //    .appendTo(container);

        //        $("<div>")
        //            .dxDataGrid({
        //                columnAutoWidth: true,
        //                showBorders: true,
        //                allowColumnResizing: true,
        //                columnResizingMode: "widget",
        //                sorting: {
        //                    mode: "none"
        //                },
        //                columns: [{
        //                    dataField: "TransactionID", visible: false
        //                },
        //                {
        //                    dataField: "VoucherNo", caption: "Requisition No."
        //                }, {
        //                    dataField: "VoucherDate", caption: "Requisition Date", dataType: "date", format: 'dd-MMM-yyyy'

        //                },
        //                {
        //                    dataField: "ItemCode",
        //                    caption: "Item Code",
        //                },
        //                {
        //                    dataField: "ItemGroupName",
        //                    caption: "Item Group",
        //                },
        //                {
        //                    dataField: "ItemSubGroupName",
        //                    caption: "Sub Group",
        //                },

        //                {
        //                    dataField: "ItemName",
        //                    caption: "Item Name",
        //                },
        //                {
        //                    dataField: "PurchaseQty",
        //                    caption: "Requisition Quantity",
        //                },
        //                {
        //                    dataField: "StockUnit",
        //                    caption: "Stock Unit",
        //                },
        //                {
        //                    dataField: "ExpectedDeliveryDate", dataType: "date", format: 'dd-MMM-yyyy'
        //                },
        //                {
        //                    dataField: "ItemNarration",
        //                    caption: "Remark",
        //                },
        //                {
        //                    dataField: "UnitDecimalPlace",
        //                    caption: "UnitDecimalPlace", visible: false
        //                },
        //                ],
        //                dataSource: new DevExpress.data.DataSource({
        //                    store: new DevExpress.data.ArrayStore({
        //                        key: ["TransactionID"],
        //                        data: RequisitionGroup
        //                    }),
        //                    filter: ["TransactionID", "=", options.key],
        //                })
        //            }).appendTo(container);
        //    }
        //}

    });
}

function CreateVoucherId() {
    var prefix = "PREQ";
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseRequisition.asmx/GetVoucherID",
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

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res !== "fail") {
                //document.getElementById("LblVoucherNo").innerHTML = res;
                document.getElementById("TxtVoucherNo").value = res;
            }
        }
    });
}

$("#CreateReqButton").click(function () {
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("textNaretion").value = "";

    document.getElementById("POPrintButton").disabled = true;

    GblStatus = "";
    existReq = [];
    var prefix = "PREQ";
    $("#VoucherDate").dxDateBox({
        value: new Date().toISOString().substr(0, 10)
    });
    if (GetIndentData === "" || GetIndentData === []) {
        existReq = existReq;
    }
    else {

        MasterGridData = [];
        SubGridData = [];

        var MasterGridOpt = {};
        var SubGridOpt = {};

        var FinalQty = 0;
        var JobCardNumbers = "";
        var JobCardIDs = "";

        var WholeGetIndentData = "";
        var newArray = [];
        var f = 0;
        WholeGetIndentData = { 'AllGetIndentData': GetIndentData };

        for (var d = 0; d < GetIndentData.length; d++) {
            FinalQty = 0;
            JobCardNumbers = "";
            JobCardIDs = "";
            JobCards = [];
            newArray = [];
            var jcNoFound = false;
            if (MasterGridData === [] || MasterGridData === "" || MasterGridData === undefined || MasterGridData === null) {

                newArray = WholeGetIndentData.AllGetIndentData.filter(function (el) {
                    return el.ItemID === GetIndentData[d].ItemID;
                });
                // if (newArray.length > 1) {

                for (f = 0; f < newArray.length; f++) {
                    FinalQty = FinalQty + Number(newArray[f].RequiredQuantity);
                    jcNoFound = JobCards.includes(newArray[f].JobBookingContentNo);
                    if (jcNoFound === false) {
                        JobCards.push(newArray[f].JobBookingContentNo);
                        if (JobCardNumbers !== "") {
                            JobCardNumbers = JobCardNumbers + ',' + newArray[f].JobBookingContentNo;
                        } else {
                            JobCardNumbers = newArray[f].JobBookingContentNo;
                        }

                        if (newArray[f].JobBookingJobCardContentsID !== null && newArray[f].JobBookingJobCardContentsID !== undefined && newArray[f].JobBookingJobCardContentsID !== "") {
                            if (JobCardIDs !== "") {
                                JobCardIDs = JobCardIDs + ',' + newArray[f].JobBookingJobCardContentsID.toString();
                            } else {
                                JobCardIDs = newArray[f].JobBookingJobCardContentsID.toString();
                            }
                        }

                    }

                    if (newArray[f].TransactionID > 0) {

                        SubGridOpt = {};
                        SubGridOpt.TransactionID = newArray[f].TransactionID;//SubGrid
                        SubGridOpt.ItemID = newArray[f].ItemID;
                        SubGridOpt.RequisitionItemID = newArray[f].ItemID;
                        SubGridOpt.JobBookingJobCardContentsID = newArray[f].JobBookingJobCardContentsID;
                        SubGridOpt.ItemGroupID = newArray[f].ItemGroupID;
                        SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                        SubGridOpt.VoucherNo = newArray[f].VoucherNo;
                        SubGridOpt.VoucherDate = newArray[f].VoucherDate;
                        SubGridOpt.ItemGroupName = newArray[f].ItemGroupName;
                        SubGridOpt.ItemSubGroupName = newArray[f].ItemSubGroupName;
                        SubGridOpt.ItemCode = newArray[f].ItemCode;
                        SubGridOpt.ItemName = newArray[f].ItemName;
                        SubGridOpt.ItemDescription = newArray[f].ItemDescription;
                        SubGridOpt.JobCardNo = newArray[f].JobBookingContentNo;
                        SubGridOpt.RequisitionQty = newArray[f].RequiredQuantity;
                        SubGridOpt.BookedStock = newArray[f].BookedStock;
                        SubGridOpt.AllocatedStock = newArray[f].AllocatedStock;
                        SubGridOpt.PhysicalStock = newArray[f].PhysicalStock;
                        SubGridOpt.StockUnit = newArray[f].StockUnit;
                        SubGridOpt.OrderUnit = newArray[f].StockUnit;
                        SubGridOpt.PurchaseQty = newArray[f].PurchaseQty;
                        SubGridOpt.ExpectedDeliveryDate = newArray[f].ExpectedDeliveryDate;
                        SubGridOpt.ItemNarration = newArray[f].ItemNarration;
                        SubGridOpt.PurchaseUnit = newArray[f].PurchaseUnit;
                        SubGridData.push(SubGridOpt);
                    }

                }
                MasterGridOpt = {};
                MasterGridOpt.TransactionID = newArray[0].TransactionID;//Mster Grid with SubChild
                MasterGridOpt.ItemID = newArray[0].ItemID;
                MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                MasterGridOpt.ItemSubGroupName = newArray[0].ItemSubGroupName;
                MasterGridOpt.ItemCode = newArray[0].ItemCode;
                MasterGridOpt.ItemName = newArray[0].ItemName;
                MasterGridOpt.RequisitionQty = FinalQty;//newArray[d].RequiredQuantity;
                MasterGridOpt.BookedStock = newArray[0].BookedStock;
                MasterGridOpt.AllocatedStock = newArray[0].AllocatedStock;
                MasterGridOpt.PhysicalStock = newArray[0].PhysicalStock;
                MasterGridOpt.StockUnit = newArray[0].StockUnit;
                MasterGridOpt.OrderUnit = newArray[0].StockUnit;
                MasterGridOpt.PurchaseQty = Number(FinalQty).toFixed(Number(newArray[0].UnitDecimalPlace));
                //MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                MasterGridOpt.ExpectedDeliveryDate = new Date().toISOString().substr(0, 10);

                MasterGridOpt.ItemNarration = newArray[0].ItemNarration;
                MasterGridOpt.UnitDecimalPlace = newArray[0].UnitDecimalPlace;
                MasterGridOpt.RefJobCardContentNo = JobCardNumbers;
                MasterGridOpt.RefJobBookingJobCardContentsID = JobCardIDs;
                MasterGridOpt.VoucherItemApproved = "";
                MasterGridOpt.AuditApprovalRequired = 0;
                MasterGridOpt.PurchaseUnit = newArray[0].PurchaseUnit;
                MasterGridOpt.LastPurchaseDate = newArray[0].LastPurchaseDate;
                if (MasterGridOpt.StockUnit.toString().toUpperCase() === MasterGridOpt.PurchaseUnit.toString().toUpperCase()) {
                    MasterGridOpt.PhysicalStockInPurchaseUnit = MasterGridOpt.PhysicalStock;
                } else {
                    MasterGridOpt.PhysicalStockInPurchaseUnit = StockUnitConversion(newArray[0].ConversionFormula.toString(), Number(newArray[0].PhysicalStock), Number(newArray[0].UnitPerPacking), Number(newArray[0].WtPerPacking), Number(newArray[0].ConversionFactor), Number(newArray[0].SizeW), Number(newArray[0].ConvertedUnitDecimalPlace));
                }
                //PhysicalStockInPurchaseUnit
                MasterGridData.push(MasterGridOpt);
                //}
                //else {

                //    MasterGridOpt = {};
                //    MasterGridOpt.TransactionID = newArray[0].TransactionID;//Mster Grid without SubChild
                //    MasterGridOpt.ItemID = newArray[0].ItemID;
                //    MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                //    MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                //    MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                //    MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                //    MasterGridOpt.ItemName = newArray[0].ItemName;
                //    MasterGridOpt.RequisitionQty = FinalQty;//newArray[d].RequiredQuantity;
                //    MasterGridOpt.BookedStock = newArray[0].BookedStock;
                //    MasterGridOpt.AllocatedStock = newArray[0].AllocatedStock;
                //    MasterGridOpt.PhysicalStock = newArray[0].PhysicalStock;
                //    MasterGridOpt.StockUnit = newArray[0].StockUnit;
                //    MasterGridOpt.OrderUnit = newArray[0].StockUnit;
                //    MasterGridOpt.PurchaseQty = FinalQty;
                //    MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                //    MasterGridOpt.ItemNarration = newArray[0].ItemNarration;

                //    MasterGridData.push(MasterGridOpt);

                //}
            }
            else {
                var extobj = JSON.stringify(MasterGridData);

                var existID = extobj.includes(GetIndentData[d].ItemID);

                if (existID !== true) {
                    newArray = WholeGetIndentData.AllGetIndentData.filter(function (el) {
                        return el.ItemID === GetIndentData[d].ItemID;
                    });

                    // if (newArray.length > 1) {
                    for (f = 0; f < newArray.length; f++) {
                        FinalQty = FinalQty + Number(newArray[f].RequiredQuantity);
                        jcNoFound = JobCards.includes(newArray[f].JobBookingContentNo);
                        if (jcNoFound === false) {
                            if (JobCardNumbers !== "") {
                                JobCardNumbers = JobCardNumbers + ',' + newArray[f].JobBookingContentNo;
                            } else {
                                JobCardNumbers = newArray[f].JobBookingContentNo;
                            }

                            if (newArray[f].JobBookingJobCardContentsID !== null && newArray[f].JobBookingJobCardContentsID !== "" && newArray[f].JobBookingJobCardContentsID !== undefined) {
                                if (JobCardIDs !== "") {
                                    JobCardIDs = JobCardIDs + ',' + newArray[f].JobBookingJobCardContentsID.toString();
                                } else {
                                    JobCardIDs = newArray[f].JobBookingJobCardContentsID.toString();
                                }
                            }
                        }
                        if (newArray[f].TransactionID > 0) {
                            SubGridOpt = {};
                            SubGridOpt.TransactionID = newArray[f].TransactionID;//SubGrid
                            SubGridOpt.ItemID = newArray[f].ItemID;
                            SubGridOpt.RequisitionItemID = newArray[f].ItemID;
                            SubGridOpt.ItemGroupID = newArray[f].ItemGroupID;
                            SubGridOpt.ItemGroupNameID = newArray[f].ItemGroupNameID;
                            SubGridOpt.JobBookingJobCardContentsID = newArray[f].JobBookingJobCardContentsID;
                            SubGridOpt.VoucherNo = newArray[f].VoucherNo;
                            SubGridOpt.VoucherDate = newArray[f].VoucherDate;
                            SubGridOpt.ItemGroupName = newArray[f].ItemGroupName;
                            SubGridOpt.ItemSubGroupName = newArray[f].ItemSubGroupName;
                            SubGridOpt.ItemCode = newArray[f].ItemCode;
                            SubGridOpt.ItemName = newArray[f].ItemName;
                            SubGridOpt.ItemDescription = newArray[f].ItemDescription;
                            SubGridOpt.JobCardNo = newArray[f].JobBookingContentNo;
                            SubGridOpt.RequisitionQty = newArray[f].RequiredQuantity;
                            SubGridOpt.BookedStock = newArray[f].BookedStock;
                            SubGridOpt.AllocatedStock = newArray[f].AllocatedStock;
                            SubGridOpt.PhysicalStock = newArray[f].PhysicalStock;
                            SubGridOpt.StockUnit = newArray[f].StockUnit;
                            SubGridOpt.OrderUnit = newArray[f].StockUnit;
                            SubGridOpt.PurchaseQty = newArray[f].PurchaseQty;
                            SubGridOpt.ExpectedDeliveryDate = newArray[f].ExpectedDeliveryDate;
                            SubGridOpt.ItemNarration = newArray[f].ItemNarration;
                            SubGridOpt.PurchaseUnit = newArray[f].PurchaseUnit;
                            SubGridData.push(SubGridOpt);
                        }

                    }
                    MasterGridOpt = {};
                    MasterGridOpt.TransactionID = newArray[0].TransactionID;//Mster Grid with SubChild
                    MasterGridOpt.ItemID = newArray[0].ItemID;
                    MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                    MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                    MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                    MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                    MasterGridOpt.ItemSubGroupName = newArray[0].ItemSubGroupName;
                    MasterGridOpt.ItemCode = newArray[0].ItemCode;
                    MasterGridOpt.ItemName = newArray[0].ItemName;
                    MasterGridOpt.RequisitionQty = FinalQty;//newArray[d].RequiredQuantity;
                    MasterGridOpt.BookedStock = newArray[0].BookedStock;
                    MasterGridOpt.AllocatedStock = newArray[0].AllocatedStock;
                    MasterGridOpt.PhysicalStock = newArray[0].PhysicalStock;
                    MasterGridOpt.StockUnit = newArray[0].StockUnit;
                    MasterGridOpt.OrderUnit = newArray[0].StockUnit;
                    MasterGridOpt.PurchaseQty = Number(FinalQty).toFixed(Number(newArray[0].UnitDecimalPlace));
                    //MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    MasterGridOpt.ExpectedDeliveryDate = new Date().toISOString().substr(0, 10);
                    MasterGridOpt.ItemNarration = newArray[0].ItemNarration;
                    MasterGridOpt.UnitDecimalPlace = Number(newArray[0].UnitDecimalPlace);
                    MasterGridOpt.RefJobCardContentNo = JobCardNumbers;
                    MasterGridOpt.RefJobBookingJobCardContentsID = JobCardIDs;
                    MasterGridOpt.AuditApprovalRequired = 0;
                    MasterGridOpt.VoucherItemApproved = "";
                    MasterGridOpt.PurchaseUnit = newArray[0].PurchaseUnit;
                    MasterGridOpt.LastPurchaseDate = newArray[0].LastPurchaseDate;
                    if (MasterGridOpt.StockUnit.toString().toUpperCase() === MasterGridOpt.PurchaseUnit.toString().toUpperCase()) {
                        MasterGridOpt.PhysicalStockInPurchaseUnit = MasterGridOpt.PhysicalStock;
                    } else {
                        MasterGridOpt.PhysicalStockInPurchaseUnit = StockUnitConversion(newArray[0].ConversionFormula.toString(), Number(newArray[0].PhysicalStock), Number(newArray[0].UnitPerPacking), Number(newArray[0].WtPerPacking), Number(newArray[0].ConversionFactor), Number(newArray[0].SizeW), Number(newArray[0].ConvertedUnitDecimalPlace));
                    }
                    MasterGridData.push(MasterGridOpt);

                    //}
                    //else {

                    //    MasterGridOpt = {};
                    //    MasterGridOpt.TransactionID = newArray[0].TransactionID;//Mster Grid without SubChild
                    //    MasterGridOpt.ItemID = newArray[0].ItemID;
                    //    MasterGridOpt.ItemGroupID = newArray[0].ItemGroupID;
                    //    MasterGridOpt.ItemGroupNameID = newArray[0].ItemGroupNameID;
                    //    MasterGridOpt.ItemDescription = newArray[0].ItemDescription;
                    //    MasterGridOpt.ItemGroupName = newArray[0].ItemGroupName;
                    //    MasterGridOpt.ItemName = newArray[0].ItemName;
                    //    MasterGridOpt.RequisitionQty = FinalQty;//newArray[d].RequiredQuantity;
                    //    MasterGridOpt.BookedStock = newArray[0].BookedStock;
                    //    MasterGridOpt.AllocatedStock = newArray[0].AllocatedStock;
                    //    MasterGridOpt.PhysicalStock = newArray[0].PhysicalStock;
                    //    MasterGridOpt.StockUnit = newArray[0].StockUnit;
                    //    MasterGridOpt.OrderUnit = newArray[0].StockUnit;
                    //    MasterGridOpt.PurchaseQty = FinalQty;
                    //    MasterGridOpt.ExpectedDeliveryDate = newArray[0].ExpectedDeliveryDate;
                    //    MasterGridOpt.ItemNarration = newArray[0].ItemNarration;

                    //    MasterGridData.push(MasterGridOpt);

                    //}

                }
            }
        }
        existReq = MasterGridData;
    }

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    document.getElementById("CreateReqButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateReqButton").setAttribute("data-target", "#largeModal");

    CreateVoucherId();

    ShowCreateReqGrid();

});

$("#EditReqButton").click(function () {
    var TxtPRID = document.getElementById("TxtPRID").value;
    if (TxtPRID === "" || TxtPRID === null || TxtPRID === undefined) {
        alert("Please select any requisition voucher to edit or view !");
        return false;
    }
    GblStatus = "Update";
    document.getElementById("BtnSaveAS").disabled = false;
    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("POPrintButton").disabled = false;

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    //RetriveArray = RetriveData.SelectRowObject.filter(function (el) {
    //    return el.RequisitionTransactionID === TxtPRID;
    //});
    existReq = [];
    var ProcessRetrive = "";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseRequisition.asmx/RetriveRequisitionData",
            data: '{TransactionID:' + JSON.stringify(TxtPRID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                ProcessRetrive = JSON.parse(res);
                var ObjRetriveArray = {};
                for (var x = 0; x < ProcessRetrive.length; x++) {
                    var result = $.grep(existReq, function (e) { return e.ItemID === ProcessRetrive[x].RequisitionItemID; });
                    if (result.length === 0) {
                        ObjRetriveArray = {};
                        ObjRetriveArray.TransactionID = ProcessRetrive[x].RequisitionTransactionID;
                        ObjRetriveArray.ItemID = ProcessRetrive[x].RequisitionItemID;
                        ObjRetriveArray.ItemGroupID = ProcessRetrive[x].ItemGroupID;
                        ObjRetriveArray.ItemGroupNameID = ProcessRetrive[x].ItemGroupNameID;
                        ObjRetriveArray.ItemCode = ProcessRetrive[x].RequisitionItemCode;
                        ObjRetriveArray.ItemGroupName = ProcessRetrive[x].ItemGroupName;
                        ObjRetriveArray.ItemSubGroupName = ProcessRetrive[x].ItemSubGroupName;
                        ObjRetriveArray.ItemName = ProcessRetrive[x].RequisitionItemName;
                        ObjRetriveArray.ItemDescription = ProcessRetrive[x].RequisitionItemDescription;
                        ObjRetriveArray.RefJobCardContentNo = ProcessRetrive[x].RefJobCardContentNo;
                        ObjRetriveArray.RefJobBookingJobCardContentsID = ProcessRetrive[x].RefJobBookingJobCardContentsID;
                        ObjRetriveArray.RequisitionQty = ProcessRetrive[x].TotalRequisitionQty;
                        ObjRetriveArray.BookedStock = ProcessRetrive[x].RequisitionBookedStock;
                        ObjRetriveArray.AllocatedStock = ProcessRetrive[x].RequisitionAllocatedStock;
                        ObjRetriveArray.PhysicalStock = ProcessRetrive[x].RequisitionPhysicalStock;
                        ObjRetriveArray.StockUnit = ProcessRetrive[x].StockUnit;
                        ObjRetriveArray.OrderUnit = ProcessRetrive[x].OrderUnit;
                        ObjRetriveArray.PurchaseQty = Number(ProcessRetrive[x].PurchaseQty);
                        ObjRetriveArray.ExpectedDeliveryDate = ProcessRetrive[x].ExpectedDeliveryDate;
                        ObjRetriveArray.ItemNarration = ProcessRetrive[x].ItemNarration;
                        ObjRetriveArray.UnitDecimalPlace = ProcessRetrive[x].UnitDecimalPlace;
                        ObjRetriveArray.VoucherItemApproved = ProcessRetrive[x].VoucherItemApproved;
                        ObjRetriveArray.PhysicalStockInPurchaseUnit = ProcessRetrive[x].RequisitionPhysicalStockInPurchaseUnit;
                        ObjRetriveArray.PurchaseUnit = ProcessRetrive[x].PurchaseUnit;
                        ObjRetriveArray.LastPurchaseDate = ProcessRetrive[x].LastPurchaseDate;
                        existReq.push(ObjRetriveArray);
                    }
                }

                SubGridData = ProcessRetrive;

                ShowCreateReqGrid();
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }

    document.getElementById("EditReqButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditReqButton").setAttribute("data-target", "#largeModal");
});

var StkUnit = [{ "ID": 1, "Name": "Unit" }, { "ID": 0, "Name": "Kg" }, { "ID": 2, "Name": "Sheets" }];

function ShowCreateReqGrid() {
    gridInstance = $("#CreateReqGrid").dxDataGrid({
        dataSource: existReq,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        keyExpr: "ItemID",
        showBorders: true,
        paging: {
            enabled: false
        },
        showRowLines: true,
        allowSorting: false,
        wordWrapEnabled: true,
        sorting: {
            mode: "none" // or "multiple" | "single"
        },
        height: function () {
            return window.innerHeight / 1.5;
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
            if (e.column.dataField === "RefJobBookingJobCardContentsID" || e.column.dataField === "PurchaseQty" || e.column.dataField === "ExpectedDeliveryDate" || e.column.dataField === "OrderUnit" || e.column.dataField === "ItemNarration") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
            if (e.column.dataField === "OrderUnit") {
                var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');
                var lookUpDatasource = [];
                var lookUpData = {};
                if (e.data.StockUnit === e.data.PurchaseUnit) {
                    lookUpData.OrderUnit = e.data.StockUnit;
                    lookUpDatasource.push(lookUpData);
                    //console.log(lookUpDatasource);
                } else {
                    lookUpData.OrderUnit = e.data.StockUnit;
                    lookUpDatasource.push(lookUpData);
                    lookUpData = {};
                    lookUpData.OrderUnit = e.data.PurchaseUnit;
                    lookUpDatasource.push(lookUpData);
                    //console.log(lookUpDatasource);
                }
                var lookup = dataGrid.columnOption("OrderUnit", "lookup");
                lookup.dataSource = lookUpDatasource;
                dataGrid.columnOption("OrderUnit", "lookup", lookup);
                dataGrid.repaint();
            }
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined || clickedCell.rowType === "filter" || clickedCell.rowType !== "data") return false;
            if (clickedCell.rowType === "data" && clickedCell.column.dataField === "ChangeItem") {
                getRequisitionRow = clickedCell.rowIndex;
            } else {
                getRequisitionRow = "";
            }
            //if (clickedCell.column.visibleIndex === 38) {
            //        GetRow = AddClick.rowIndex;
            //if (clickedCell.columnIndex < 4 && clickedCell.rowType !== "header") {
            //    $("#BtnopenPop").click();
            //}
            //    if (clickedCell.columnIndex > 2 && clickedCell.rowType === "header") {
            //        var person = confirm("Do you want to Delete it..?");
            //        if (gridInstance.columnCount() > 4) {
            //            if (person === true) {
            //                gridInstance.deleteColumn(clickedCell.columnIndex);
            //            }
            //        }
            //        else {
            //            alert("You can not delete it...! Minimum one Slab rate is required..");
            //        }
            //    }
        },
        //   columns: DynamicColPush,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 100 },
            { dataField: "ItemID", visible: false, caption: "Item ID", width: 100 },
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 100 },
            { dataField: "ItemGroupNameID", visible: false, caption: "ItemGroupNameID", width: 100 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 60 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 80 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 250 },
            { dataField: "ItemDescription", visible: false, caption: "Item Desc.", width: 120 },
            { dataField: "RequisitionQty", visible: true, caption: "Indent Qty", width: 80 },
            { dataField: "BookedStock", visible: true, caption: "Total Booked", width: 80 },
            { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 80 },
            { dataField: "PhysicalStock", visible: true, caption: "Current Stock", width: 80 },
            {
                dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 80
                //lookup: {
                //    dataSource: StkUnit,
                //    displayExpr: "Name",
                //    valueExpr: "Name"
                //}StockUnit,OrderUnit,
            },
            { dataField: "PhysicalStockInPurchaseUnit", visible: true, caption: "Current Stock (In P.U.)", width: 100 },
            { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 100 },

            {
                dataField: "OrderUnit", visible: true, caption: "Order Unit", width: 80,
                lookup: {
                    dataSource:
                        function (options) {
                            return {
                                store: [{ OrderUnit: "Kg" }, { OrderUnit: "Sheet" }, { OrderUnit: "Meter" }, { OrderUnit: "KG" }, { OrderUnit: "SHEET" }, { OrderUnit: "METER" }]
                                //filter: options.data ? ["ItemID", "=", options.data.ItemID] : null
                            };
                        },
                    displayExpr: "OrderUnit",
                    valueExpr: "OrderUnit"
                }
            },
            {
                dataField: "PurchaseQty", visible: true, dataType: "numeric", validationRules: [{ type: "required" }, { type: "numeric" }], caption: "Purchase Qty", width: 100,
                //calculateCellValue: function (e) {
                //    alert(Object.getOwnPropertyNames(e));
                //    alert(e.PurchaseQty);
                //    var qty = Number(e.PurchaseQty);
                //    var decimalplace = Number(e.UnitDecimalPlace);
                //    alert(qty);
                //    alert(decimalplace);
                //    return parseFloat(qty.toFixed(decimalplace));
                //}
                setCellValue: function (newData, value, currentRowData) {
                    var qty = Number(value);
                    var decimalplace = Number(currentRowData.UnitDecimalPlace);
                    //return parseFloat(qty.toFixed(decimalplace));
                    newData.PurchaseQty = qty.toFixed(decimalplace);
                }
            },
            {
                dataField: "ExpectedDeliveryDate", visible: true, caption: "Expec.Del.Date", width: 120,
                dataType: "date", format: 'dd-MMM-yyyy', validationRules: [{ type: "required" }],
                showEditorAlways: true
            },
            { dataField: "ItemNarration", visible: true, caption: "Item Remark", width: 120 },
            { dataField: "RefJobCardContentNo", visible: false },
            {
                dataField: "RefJobBookingJobCardContentsID", visible: true, caption: "Ref. J.C. No.", width: 200,
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
            {
                dataField: "ChangeItem", visible: true, caption: "Change Item", width: 50,
                cellTemplate: function (container, options) {
                    $('<div>').addClass('fa fa-refresh customgridbtn')
                        .on('dxclick', function () {
                            if (options.data.ItemGroupID > 0) {
                                ChangeItemGrid(options);
                                this.setAttribute("data-toggle", "modal");
                                this.setAttribute("data-target", "#largeModalChangeItem");
                            }
                        }).appendTo(container);
                }
            },
            { dataField: "LastPurchaseDate", visible: true, caption: "Last P.O.Date", dataType: "date", format: 'dd-MMM-yyyy', width: 100 },
            { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 120 },
            { dataField: "VoucherItemApproved", visible: false, caption: "VoucherItemApproved", width: 120 },
            { dataField: "AuditApprovalRequired", visible: true, caption: "Audit Required", dataType: "boolean", width: 120 }
        ],
        summary: {
            totalItems: [{
                format: "currency",
                showInColumn: "PurchaseQty",
                column: "PurchaseQty",
                summaryType: "sum",
                displayFormat: "{0}",
                alignByColumn: true
            }]
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var currentEmployeeData = options.data;

                //$("<div>")
                //    .addClass("master-detail-caption")
                //    .text(currentEmployeeData.VoucherNo + "  (Voucher No.)")
                //    .appendTo(container);

                $("<div id='requisitionsubgrid'>")
                    .dxDataGrid({
                        columnAutoWidth: true,
                        allowColumnResizing: true,
                        allowSorting: false,
                        sorting: {
                            mode: "none" // or "multiple" | "single"
                        },
                        showBorders: true,
                        columns: [{ dataField: "TransactionID", visible: false },
                        { dataField: "ItemID", visible: false }, { dataField: "RequisitionItemID", visible: false },
                        { dataField: "ItemGroupID", visible: false }, { dataField: "ItemGroupNameID", visible: false },
                        { dataField: "VoucherNo", caption: "Indent No." }, { dataField: "VoucherDate", caption: "Indent Date", dataType: "date", format: "dd-MMM-yyyy" },
                        { dataField: "ItemGroupName", caption: "Item Group" }, { dataField: "ItemSubGroupName", caption: "Sub Group" },
                        { dataField: "ItemCode", caption: "Item Code" }, { dataField: "ItemName", caption: "Item Name" },
                        { dataField: "ItemDescription", visible: false }, { dataField: "JobCardNo", caption: "Job Card No." },
                        { dataField: "RequisitionQty", caption: "Indent Quantity" }, { dataField: "BookedStock", caption: "Total Booked" },
                        { dataField: "AllocatedStock", caption: "Allocated Stock" }, { dataField: "PhysicalStock", caption: "Current Stock" },
                        { dataField: "StockUnit", caption: "Stock Unit" }, { dataField: "OrderUnit", caption: "Order Unit", visible: false },
                        { dataField: "PurchaseQty", caption: "Purchase Qty", visible: false }, { dataField: "ExpectedDeliveryDate", dataType: "date", visible: false },
                        { dataField: "ItemNarration", caption: "Remark", visible: false }
                        ],
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.ArrayStore({
                                key: "ItemID",
                                data: SubGridData
                            }),
                            filter: [
                                ["RequisitionItemID", "=", options.key],
                                "and",
                                ["RequisitionQty", ">", 0]
                            ]
                        })
                    }).appendTo(container);
            }
        }

    }).dxDataGrid("instance");
}

OverFlowGrid();

$("#BtnopenPop").click(function () {
    Groupdata = "";
    var grid = $('#OverFlowGrid').dxDataGrid('instance');
    grid.clearSelection();

    document.getElementById("BtnopenPop").setAttribute("data-toggle", "modal");
    document.getElementById("BtnopenPop").setAttribute("data-target", "#largeModalOverFlow");
});

$("#BtnRefreshList").click(function () {
    OverFlowGrid();
});

$("#BtnCreateNewItem").click(function () {
    window.open('Masters.aspx', "_newtab");
});

function OverFlowGrid() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_PurchaseRequisition.asmx/GetOverFlowGrid",
        data: '{ItemGroupID:' + JSON.stringify('') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            MasterData = RES1;
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#OverFlowGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

$("#OverFlowGrid").dxDataGrid({
    //dataSource: RES1,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    paging: {
        pageSize: 50
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100, 200, 500]
    },
    //sorting: {
    //    mode: "multiple"
    //},
    selection: { mode: "multiple", showCheckBoxesMode: "always" },
    grouping: {
        autoExpandAll: true
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    //scrolling: { mode: 'infinite' },
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
        fileName: "Exist Group",
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
    onSelectionChanged: function (clickedCell) {
        if (clickedCell.selectedRowsData.length <= 0) {
            Groupdata = "";
            return false;
        } else {
            Groupdata = clickedCell.selectedRowsData;
        }

        try {
            var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');
            if (dataGrid.totalCount() > 0) {
                for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                    var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                    if (clickedCell.currentSelectedRowKeys[0].ItemID === cellvalItemID) {
                        DevExpress.ui.notify("This item already added.., Please select other item..!", "warning", 1000);
                        return false;
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
        { dataField: "ItemGroupName", visible: true, caption: "Item Group", width: 100 },
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 150 },
        { dataField: "ItemCode", visible: true, caption: "Item Code", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 400 },
        { dataField: "ItemDescription", visible: false, caption: "Item Desc.", width: 500 },
        { dataField: "BookedStock", visible: true, caption: "Total Booked", width: 120 },
        { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 120 },
        { dataField: "PhysicalStock", visible: true, caption: "Current Stock", width: 120 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 100 },
        { dataField: "PurchaseUnit", visible: false, caption: "Purchase Unit", width: 100 },
        { dataField: "LastPurchaseDate", visible: true, caption: "Last P.O.Date", dataType: "date", format: 'dd-MMM-yyyy', width: 100 }
    ]

});

function ChangeItemGrid(options) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    //$.ajax({
    //    type: "POST",
    //    url: "WebService_PurchaseRequisition.asmx/GetOverFlowGrid",
    //    data: '{ItemGroupID:' + JSON.stringify(options.data.ItemGroupID) + '}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "text",
    //    success: function (results) {
    //        //  //console.debug(results);
    //        var res = results.replace(/\\/g, '');
    //        res = res.replace(/"d":""/g, '');
    //        res = res.replace(/""/g, '');
    //        res = res.substr(1);
    //        res = res.slice(0, -1);
    //        var RES1 = JSON.parse(res);
    //        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    //        $("#ChangeItemGrid").dxDataGrid({
    //            dataSource: RES1
    //        });
    //    }
    //});
    var Mastergriddata = "";
    var Mastergridfilterdata = "";
    Mastergriddata = { 'AllGetMasterData': MasterData };
    Mastergridfilterdata = Mastergriddata.AllGetMasterData.filter(function (el) {
        return el.ItemGroupID === options.data.ItemGroupID;
    });
    $("#ChangeItemGrid").dxDataGrid({
        dataSource: Mastergridfilterdata
    });
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
}

$("#ChangeItemGrid").dxDataGrid({
    //dataSource: RES1,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    paging: {
        pageSize: 50
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100, 200, 500]
    },
    selection: { mode: "single" },
    grouping: {
        autoExpandAll: true
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    //scrolling: { mode: 'infinite' },
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
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clickedCell) {
        ChangeItemdata = "";
        if (clickedCell.selectedRowsData.length <= 0) return false;
        ChangeItemdata = clickedCell.selectedRowsData;
        try {
            var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');
            if (dataGrid.totalCount() > 0) {
                for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                    var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                    if (ChangeItemdata[0].ItemID === cellvalItemID) {
                        DevExpress.ui.notify("This item already added.., Please select other item..!", "warning", 1000);
                        var keys = dataGrid.getSelectedRowKeys();
                        dataGrid.deselectRows(keys);
                        ChangeItemdata = "";
                        return false;
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
        { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group", width: 100 },
        { dataField: "ItemName", visible: true, caption: "Item Name", width: 300 },
        { dataField: "BookedStock", visible: true, caption: "Total Booked", width: 100 },
        { dataField: "AllocatedStock", visible: true, caption: "Allocated Stock", width: 100 },
        { dataField: "PhysicalStock", visible: true, caption: "Current Stock", width: 100 },
        { dataField: "StockUnit", visible: true, caption: "Stock Unit", width: 100 },
        { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 100 }
    ]
});

$("#BtnChangeItemNext").click(function () {
    if (ChangeItemdata === "") {
        DevExpress.ui.notify("Please select any item from the list to replace existing item..!", "success", 1000);
    }
    var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');

    if (getRequisitionRow !== "") {
        AuditApprovalrequired = false;
        for (var x = 0; x < SubGridData.length; x++) {
            if (SubGridData[x].RequisitionItemID === dataGrid._options.dataSource[getRequisitionRow].ItemID) {
                SubGridData[x].RequisitionItemID = ChangeItemdata[0].ItemID;
                if (SubGridData[x].RequisitionItemID !== SubGridData[x].ItemID) {
                    AuditApprovalrequired = true;
                } else {
                    AuditApprovalrequired = false;
                }
            }
        }
        $("#requisitionsubgrid").dxDataGrid({
            dataSource: SubGridData
        });

        dataGrid._options.dataSource[getRequisitionRow].ItemID = ChangeItemdata[0].ItemID;
        dataGrid._options.dataSource[getRequisitionRow].ItemGroupID = ChangeItemdata[0].ItemGroupID;
        dataGrid._options.dataSource[getRequisitionRow].ItemGroupNameID = ChangeItemdata[0].ItemGroupNameID;
        dataGrid._options.dataSource[getRequisitionRow].ItemCode = ChangeItemdata[0].ItemCode;
        dataGrid._options.dataSource[getRequisitionRow].ItemGroupName = ChangeItemdata[0].ItemGroupName;
        dataGrid._options.dataSource[getRequisitionRow].ItemSubGroupName = ChangeItemdata[0].ItemSubGroupName;
        dataGrid._options.dataSource[getRequisitionRow].ItemName = ChangeItemdata[0].ItemName;
        dataGrid._options.dataSource[getRequisitionRow].ItemDescription = ChangeItemdata[0].ItemDescription;
        dataGrid._options.dataSource[getRequisitionRow].BookedStock = ChangeItemdata[0].BookedStock;
        dataGrid._options.dataSource[getRequisitionRow].AllocatedStock = ChangeItemdata[0].AllocatedStock;
        dataGrid._options.dataSource[getRequisitionRow].PhysicalStock = ChangeItemdata[0].PhysicalStock;
        dataGrid._options.dataSource[getRequisitionRow].StockUnit = ChangeItemdata[0].StockUnit;
        dataGrid._options.dataSource[getRequisitionRow].OrderUnit = ChangeItemdata[0].StockUnit;
        dataGrid._options.dataSource[getRequisitionRow].PurchaseUnit = ChangeItemdata[0].PurchaseUnit;
        if (ChangeItemdata[0].StockUnit.toString().toUpperCase() === ChangeItemdata[0].PurchaseUnit.toString().toUpperCase()) {
            dataGrid._options.dataSource[getRequisitionRow].PhysicalStockInPurchaseUnit = ChangeItemdata[0].PhysicalStock;
        } else {
            dataGrid._options.dataSource[getRequisitionRow].PhysicalStockInPurchaseUnit = StockUnitConversion(ChangeItemdata[0].ConversionFormula.toString(), Number(ChangeItemdata[0].PhysicalStock), Number(ChangeItemdata[0].UnitPerPacking), Number(ChangeItemdata[0].WtPerPacking), ChangeItemdata[0].ConversionFactor, Number(ChangeItemdata[0].SizeW), Number(ChangeItemdata[0].ConvertedUnitDecimalPlace));
        }

        if (AuditApprovalrequired === false) {
            dataGrid._options.dataSource[getRequisitionRow].AuditApprovalRequired = 0;
        } else {
            dataGrid._options.dataSource[getRequisitionRow].AuditApprovalRequired = 1;
        }
        dataGrid.refresh();
        DevExpress.ui.notify("Item Changed..!", "success", 1000);
        //clickedCell.component.clearFilter();
        document.getElementById("BtnChangeItemNext").setAttribute("data-dismiss", "modal");
    }
});

$("#BtnNext").click(function () {
    var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');


    if (Groupdata.length > 0) {
        for (var i = 0; i < Groupdata.length; i++) {
            if (Groupdata[i].StockUnit.toString().toUpperCase() === Groupdata[i].PurchaseUnit.toString().toUpperCase()) {
                Groupdata[i].PhysicalStockInPurchaseUnit = Groupdata[i].PhysicalStock;
            } else {
                Groupdata[i].PhysicalStockInPurchaseUnit = StockUnitConversion(Groupdata[i].ConversionFormula == null ? '' : Groupdata[i].ConversionFormula.toString(), Number(Groupdata[i].PhysicalStock), Number(Groupdata[i].UnitPerPacking), Number(Groupdata[i].WtPerPacking), Groupdata[i].ConversionFactor, Number(Groupdata[i].SizeW), Number(Groupdata[i].ConvertedUnitDecimalPlace));
            }

            var found = false;
            for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                if (Groupdata[i].ItemID === cellvalItemID) {
                    // DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                    found = true;
                }
            }
            if (found === false) {
                Groupdata[i].OrderUnit = Groupdata[i].StockUnit;
                Groupdata[i].PurchaseQty = 0;
                Groupdata[i].AuditApprovalRequired = 0;
                Groupdata[i].ExpectedDeliveryDate = new Date().toISOString().substr(0, 10);
                Groupdata[i].ItemNarration = "";
                Groupdata[i].RequisitionQty = 0;
                Groupdata[i].VoucherItemApproved = "";
                Groupdata[i].RefJobCardContentNo = "";
                Groupdata[i].RefJobBookingJobCardContentsID = "";
                Groupdata[i].TransactionID = document.getElementById("TxtPRID").value;
                var clonedItem = $.extend({}, Groupdata[i]);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);
            }
        }
        DevExpress.ui.notify("List added..!", "success", 1000);
        //clickedCell.component.clearFilter();

        document.getElementById("BtnNext").setAttribute("data-dismiss", "modal");
        var dataGrid1 = $('#OverFlowGrid').dxDataGrid('instance');
        dataGrid1.clearFilter();
    }
    else {
        DevExpress.ui.notify("please choose minimum one row from above Grid..!", "success", 1000);
    }
});

$("#BtnSave").click(function () {
    var prefix = "PREQ";
    var TotalQty = 0;

    var jsonObjectsRecordMain = [];
    var OperationRecordMain = {};

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};

    var jsonObjectsUpdateindentDetail = [];
    var OperationUpdateIndentDetail = {};

    try {
        var dataGrid = $('#CreateReqGrid').dxDataGrid('instance');
        var dataGridGridRow = dataGrid.totalCount();

        if (dataGridGridRow > 0) {
            TotalQty = 0;
            for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                if (dataGrid._options.dataSource[k].PurchaseQty === "" || dataGrid._options.dataSource[k].PurchaseQty === null || dataGrid._options.dataSource[k].PurchaseQty === undefined || Number(dataGrid._options.dataSource[k].PurchaseQty) === 0) {
                    dataGrid._options.dataSource[k].PurchaseQty = "";
                    DevExpress.ui.notify("please fill Purchase Qty in Grid..!", "error", 1000);
                    return false;
                }
                if (dataGrid._options.dataSource[k].ExpectedDeliveryDate === "" || dataGrid._options.dataSource[k].ExpectedDeliveryDate === null || dataGrid._options.dataSource[k].ExpectedDeliveryDate === undefined) {
                    dataGrid._options.dataSource[k].ExpectedDeliveryDate = "";
                    DevExpress.ui.notify("please fill Expected Delivery Date in Grid..!", "error", 1000);
                    return false;
                }
                if (dataGrid._options.dataSource[k].VoucherItemApproved !== "" && dataGrid._options.dataSource[k].VoucherItemApproved !== false && dataGrid._options.dataSource[k].VoucherItemApproved !== "false") {
                    DevExpress.ui.notify("This requisition has been used in further transactions, Can't edit !", "error", 1000);
                    return false;
                }
            }

            OperationRecordMain = {};

            if (GblStatus === "Update") {
                OperationRecordMain.TransactionID = document.getElementById("TxtPRID").value;
            }
            OperationRecordMain.VoucherID = -9;

            OperationRecordMain.VoucherDate = $('#VoucherDate').dxDateBox('instance').option('value');
            OperationRecordMain.TotalQuantity = dataGrid.getTotalSummaryValue("PurchaseQty");
            OperationRecordMain.Narration = document.getElementById("textNaretion").value;

            jsonObjectsRecordMain.push(OperationRecordMain);

            TotalQty = dataGrid.getTotalSummaryValue("PurchaseQty");
            for (var p = 0; p < dataGridGridRow; p++) {
                OperationRecordDetail = {};

                //if (GblStatus === "Update") {
                //    OperationRecordDetail.TransactionID = document.getElementById("TxtPRID").value;
                //}
                OperationRecordDetail.ItemID = dataGrid._options.dataSource[p].ItemID;
                OperationRecordDetail.TransID = p + 1;
                OperationRecordDetail.ItemGroupID = dataGrid._options.dataSource[p].ItemGroupID;
                OperationRecordDetail.RequiredQuantity = Number(dataGrid._options.dataSource[p].PurchaseQty);
                OperationRecordDetail.StockUnit = dataGrid._options.dataSource[p].OrderUnit;
                OperationRecordDetail.ItemNarration = dataGrid._options.dataSource[p].ItemNarration;
                OperationRecordDetail.ExpectedDeliveryDate = dataGrid._options.dataSource[p].ExpectedDeliveryDate;
                OperationRecordDetail.RefJobBookingJobCardContentsID = dataGrid._options.dataSource[p].RefJobBookingJobCardContentsID;
                OperationRecordDetail.RefJobCardContentNo = dataGrid._options.dataSource[p].RefJobCardContentNo;
                OperationRecordDetail.CurrentStockInStockUnit = Number(dataGrid._options.dataSource[p].PhysicalStock);
                OperationRecordDetail.CurrentStockInPurchaseUnit = Number(dataGrid._options.dataSource[p].PhysicalStockInPurchaseUnit);
                if (dataGrid._options.dataSource[p].AuditApprovalRequired === 0) {
                    OperationRecordDetail.IsAuditApproved = 1;
                } else {
                    OperationRecordDetail.IsAuditApproved = 0;
                }
                jsonObjectsRecordDetail.push(OperationRecordDetail);
                console.log(jsonObjectsRecordDetail);
            }

            for (p = 0; p < SubGridData.length; p++) {
                OperationUpdateIndentDetail = {};
                if (Number(SubGridData[p].TransactionID) > 0) {
                    OperationUpdateIndentDetail.TransactionID = SubGridData[p].TransactionID;
                    OperationUpdateIndentDetail.ItemID = SubGridData[p].ItemID;
                    OperationUpdateIndentDetail.JobBookingJobCardContentsID = SubGridData[p].JobBookingJobCardContentsID;
                    OperationUpdateIndentDetail.RequisitionItemID = SubGridData[p].RequisitionItemID;
                    //OperationUpdateIndentDetail.VoucherID = SubGridData[p].VoucherID;
                    jsonObjectsUpdateindentDetail.push(OperationUpdateIndentDetail);
                }
            }
        }
        else {
            text = "Please add a row.. Given Grid";
            alert(text);
            DevExpress.ui.notify("Please add a row.. Given Grid..!", "error", 1000);
            return false;
        }
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
                        url: "WebService_PurchaseRequisition.asmx/UpdatePaperPurchaseRequisition",
                        data: '{TransactionID:' + JSON.stringify(document.getElementById("TxtPRID").value) + ',jsonObjectsRecordMain:' + JSON.stringify(jsonObjectsRecordMain) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + ',jsonObjectsUpdateindentDetail:' + JSON.stringify(jsonObjectsUpdateindentDetail) + '}',
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
                                document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                                swal("Updated!", "Your data Updated", "success");

                                //location.reload();
                                //refresh Grid
                                if (RadioValue === "Indent List") {
                                    var grid1 = $('#PRGridIndent').dxDataGrid('instance');
                                    grid1.clearSelection();
                                }

                                $("#reloadDisplayNone").click();
                                GetDataGrid();
                            }
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
                        url: "WebService_PurchaseRequisition.asmx/SavePaperPurchaseRequisition",
                        data: '{prefix:' + JSON.stringify(prefix) + ',jsonObjectsRecordMain:' + JSON.stringify(jsonObjectsRecordMain) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + ',jsonObjectsUpdateindentDetail:' + JSON.stringify(jsonObjectsUpdateindentDetail) + '}',
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
                            if (res === "Success") {
                                swal("Saved!", "Your data saved", "success");
                                // alert("Your Data has been Saved Successfully...!");
                                //  location.reload();
                                //refresh Grid
                                if (RadioValue === "Indent List") {
                                    var grid1 = $('#PRGridIndent').dxDataGrid('instance');
                                    grid1.clearSelection();
                                }

                                $("#reloadDisplayNone").click();
                                GetDataGrid();
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                }
            });

    } catch (e) {
        console.log(e);
    }


});

$("#DeleteReqButton").click(function () {
    var TxtPRID = document.getElementById("TxtPRID").value;
    if (TxtPRID === "" || TxtPRID === null || TxtPRID === undefined) {
        alert("Please select any requisition voucher to delete !");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_PurchaseRequisition.asmx/CheckPermission",
        data: '{TransactionID:' + JSON.stringify(TxtPRID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res === "Exist") {
                swal("", "This item is used in another process..! Record can not be delete.", "error");
                return false;
            }
            else {
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
                            url: "WebService_PurchaseRequisition.asmx/DeletePaperPurchaseRequisition",
                            data: '{TxtPRID:' + JSON.stringify(TxtPRID) + '}',
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
                                    //location.reload();

                                    //refresh Grid
                                    if (RadioValue === "Indent List") {
                                        var grid1 = $('#PRGridIndent').dxDataGrid('instance');
                                        grid1.clearSelection();
                                    }

                                    $("#reloadDisplayNone").click();
                                    GetDataGrid();
                                }

                            },
                            error: function errorFunc(jqXHR) {
                                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                alert(jqXHR);
                            }
                        });

                    });

            }

        }
    });
});

$("#BtnNew").click(function () {
    // document.getElementById("TxtPRID").value = "";
    $("#VoucherDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10)
    });
    document.getElementById("textNaretion").value = "";
    GblStatus = "";
    existReq = [];
    CreateVoucherId();
    ShowCreateReqGrid();
    //CreateVoucherId()

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;
    var grid1 = $('#PRGridIndent').dxDataGrid('instance');
    grid1.clearSelection();
    var grid2 = $('#PRGridRequisitions').dxDataGrid('instance');
    grid2.clearSelection();

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteReqButton").click();
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

$("#POPrintButton").click(function () {
    var TxtPRID = document.getElementById("TxtPRID").value;
    var url = "PrintRequisition.aspx?TI=" + TxtPRID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

$("#BtnNotification").click(function () {
    var reqid = "";
    var purchaseid = "";
    var commentData = "";
    var newHtml = '';
    if (GblStatus === "Save" || GblStatus === "save" || GblStatus === "") {
        document.getElementById("commentbody").innerHTML = "";
        $("#commentbody").append(newHtml);
        $(".commentInput").hide();
    } else {
        var requisitionid = document.getElementById("TxtPRID").value;

        if (requisitionid === "" || requisitionid === null || requisitionid === undefined) {
            alert("Please select valid requisition voucher to view comment details..!");
            return false;
        }
        document.getElementById("commentbody").innerHTML = "";
        if (requisitionid !== "") {
            $.ajax({
                type: "POST",
                url: "WebService_PurchaseRequisition.asmx/GetCommentData",
                data: '{PurchaseTransactionID:0,requisitionIDs:' + JSON.stringify(requisitionid) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    commentData = JSON.parse(res);
                    if (commentData.length > 0) {
                        console.log(commentData);
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
        var requisitionid = document.getElementById("TxtPRID").value;
        if (requisitionid === "" || requisitionid === null || requisitionid === undefined) {
            alert("Please select valid requisition voucher to view comment details..!");
            return false;
        }

        var commentTitle = document.getElementById("TxtCommentTitle").value.trim();
        var commentDesc = document.getElementById("TxtCommentDetail").value.trim();
        var commentType = $('#selCommentType').dxSelectBox('instance').option('value');
        if (commentTitle === undefined || commentTitle === "" || commentTitle === null || commentType === undefined || commentType === "" || commentType === null || commentDesc === undefined || commentDesc === null || commentDesc === "") {
            alert("Please enter valid comment title and description..!");
            return false;
        }

        var jsonObjectCommentDetail = [];
        var objectCommentDetail = {};

        objectCommentDetail.CommentDate = new Date();
        objectCommentDetail.ModuleID = 0;
        objectCommentDetail.ModuleName = "Purchase Requisition";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = requisitionid;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebService_PurchaseRequisition.asmx/SaveCommentData",
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
                alert("Comment Saved!", "Comment saved successfully.", "success");
                var commentData = "";
                var newHtml = '';
                var requisitionid = document.getElementById("TxtPRID").value;
                if (requisitionid === "" || requisitionid === null || requisitionid === undefined) {
                    alert("Please select valid requisition voucher to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (requisitionid !== "") {
                    $.ajax({
                        type: "POST",
                        url: "WebService_PurchaseRequisition.asmx/GetCommentData",
                        data: '{PurchaseTransactionID:0,requisitionIDs:' + JSON.stringify(requisitionid) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
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
                console.log(jqXHR);
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