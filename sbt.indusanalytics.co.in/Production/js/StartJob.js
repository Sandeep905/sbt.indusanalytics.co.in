"use strict";

$("#divOperator").removeClass("hidden");

// --------------- Gbl Variable for Remove Duplicate Machine------------------------
var ObjMachine = [], MachineID = 0, ObjAllJobCard = [], GblOperID = 0, ObjJobDetail = [];
var GblJobBookingID = 0, GblJobBookingContentID = 0, LedgerID = 0;
var GblRateFactor = "";

var PaperDetail = [], PaperDetailSelectedData = [];
var FetchData = [];

//////-------------------- user company from localstorage ------------------
var UId = localStorage.getItem('UId');
var CId = localStorage.getItem('CId');
var FYear = localStorage.getItem('FYear');
var Qstring = "?UId=" + UId + "&CId=" + CId + "&FYear=" + JSON.parse(FYear) + "";
/////--------------------

//if (MachineID <= 0 || MachineID === null || MachineID === undefined || MachineID === "") {
//    window.location = "MachineList.aspx";
//}

//if (LedgerID <= 0 || LedgerID === null || LedgerID === undefined || LedgerID === "") {
//    window.location = "MachineList.aspx";
//}

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 310,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#ddlOperator").dxSelectBox({
    placeholder: "Select --",
    valueExpr: "OperatorID",
    displayExpr: "OperatorName",
    //disabled: true,
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {
            GetMachines(data.value);
        }
        else {
            BlankTextField();
            $("#ddlMachine").dxSelectBox({ items: [], value: null });
        }
    }
});

$("#ddlMachine").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'MachineName',
    valueExpr: 'MachineID',
    //disabled: true,
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        BlankTextField();
        MachineID = data.value;
        ObjAllJobCard = [];
        $("#ddlJobCard").dxSelectBox({
            items: ObjAllJobCard,
            value: null
        });
        if (MachineID === "" || MachineID === null) return;
        $.ajax({
            type: "POST",
            url: "WebService_StartJob.asmx/CheckMachineStatus" + Qstring,
            data: '{MachineID:' + JSON.stringify(MachineID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var MachineStatusDta = JSON.parse(res);
                if (MachineStatusDta.length > 0) {
                    if (MachineStatusDta[0].Status !== "Running") {
                        GetMachineSelectedData();
                    } else {
                        var MsgDis = "Machine '" + MachineStatusDta[0].MachineName + "' is already running with job no '" + MachineStatusDta[0].JobCardContentNo + "' for process '" + MachineStatusDta[0].ProcessName + "'...!";
                        BlankTextField();
                        ObjAllJobCard = [];
                        $("#ddlJobCard").dxSelectBox({ items: ObjAllJobCard });
                        swal("Machine is busy", MsgDis, "warning");
                        return false;
                    }
                } else {
                    GetMachineSelectedData();
                }
            }
        });
    }
});

$("#ddlJobCard").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'JobBookingNo',
    valueExpr: 'JobBookingID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        GblJobBookingID = data.value;

        BlankTextField();
        $("#ddlJobCardContent").dxSelectBox({ items: [], value: null });
        if (GblJobBookingID === "" || GblJobBookingID === null) return;

        $.ajax({
            type: "POST",
            async: false,
            url: "WebService_StartJob.asmx/GetJobCardContents" + Qstring,
            data: '{Operation_ID:' + JSON.stringify(GblOperID) + ',MID:' + MachineID + ',BKID:' + JSON.stringify(GblJobBookingID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                if (RES1.length <= 0) return;
                $("#ddlJobCardContent").dxSelectBox({
                    items: RES1,
                    value: RES1[0].JobBookingJobCardContentsID
                });
            }
        });
    }
});

$("#ddlJobCardContent").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'JobCardContentNo',
    valueExpr: 'JobBookingJobCardContentsID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        GblJobBookingContentID = data.value;
        BlankTextField();

        PaperDetail = [];
        PaperDetailSelectedData = [];
        $("#PaperDetailGrid").dxDataGrid({ dataSource: PaperDetail });
        $("#PaperGridDiv").addClass("hidden");

        if (GblJobBookingContentID === "" || GblJobBookingContentID === null) return;

        $.ajax({
            type: "POST",
            async: false,
            url: "WebService_StartJob.asmx/GetContentProcess" + Qstring,
            data: '{MachineID:' + MachineID + ',ContentID:' + JSON.stringify(GblJobBookingContentID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);

                $("#ddlOperation").dxSelectBox({ dataSource: RES1 });

                //if (RES1.length <= 0) return;
                //$("#ddlOperation").dxSelectBox({ value: RES1[0].ProcessID });
            }
        });
    }
});

$("#ddlOperation").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'ProcessFactorName',
    valueExpr: 'ProcessFactorName',
    onValueChanged: function (data) {
        var ProcessFactorName = data.value;
        GblRateFactor = "";
        $("#ddlFormNo").dxSelectBox({ items: [] });
        if (ProcessFactorName !== null && ProcessFactorName !== "") {

            var result = $.grep(data.component._dataSource._store._array, function (ex) { return ex.ProcessFactorName === ProcessFactorName; });
            if (result.length > 0) {
                GblRateFactor = result[0].RateFactor;
                GblOperID = result[0].ProcessID;
            }

            $.ajax({
                type: "POST",
                url: "WebService_StartJob.asmx/GetContentForms" + Qstring,
                data: '{MachineID:' + MachineID + ',ContentID:' + JSON.stringify(GblJobBookingContentID) + ',ProcID:' + GblOperID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0027/g, "'");
                    res = res.replace(/u0026/g, '&');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res);

                    $("#ddlFormNo").dxSelectBox({ items: RES1, value: null });
                    if (RES1.length <= 0) return;
                    $("#ddlFormNo").dxSelectBox({ value: RES1[0].JobCardFormNo });
                }
            });

            document.getElementById("ddlOperation").style.borderColor = "";
        }
    }
});

$("#ddlFormNo").dxSelectBox({
    displayExpr: 'JobCardFormNo',
    valueExpr: 'JobCardFormNo',
    onValueChanged: function (data) {
        if (data.value !== null) {
            onProcessChanged(data.value);
            //var result = $.grep(ObjJobDetail, function (e) { return e.JobCardFormNo === data.value && e.ProcessID === GblOperID; });
            //if (result.length >= 1) {
            //    //found
            //    document.getElementById("TxtReceivedQuantity").value = Number(result[0].PreviousQty) - Number(result[0].ConsumedQty);
            //    document.getElementById("TxtFormRefNo").value = result[0].RefNo;
            //} else {
            //    document.getElementById("TxtReceivedQuantity").value = 0;
            //}
        }
        else {
            document.getElementById("TxtReceivedQuantity").value = "";
        }
    }
});

$("#PaperDetailGrid").dxDataGrid({
    dataSource: PaperDetail,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 1.8;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        if (e.rowType === "data") {
            if (e.data.RemainingPaper <= 0) {
                e.rowElement.css('background', 'green');
                e.rowElement.css('color', '#fff');
            }
            else if (e.data.ConsumeSheets > 0 && e.data.IssueSheets > 0) {
                e.rowElement.css('background', 'yellow');
            }
        }
    },
    onSelectionChanged: function (clicked2) {
        PaperDetailSelectedData = clicked2.selectedRowsData;
        //if (PaperDetailSelectedData.length > 0) {
        //    document.getElementById("TxtReceivedQuantity").value = Number(PaperDetailSelectedData[0].RemainingPaper);
        //} else
        //    document.getElementById("TxtReceivedQuantity").value = 0;
    },
    columns: [{ dataField: "PaperID", visible: false, caption: "PaperID", allowSorting: false },
    { dataField: "GRNTransactionID", visible: false, caption: "GRNTransactionID", allowSorting: false },
    { dataField: "ItemCode", visible: true, caption: "Item Code", allowSorting: false },
    { dataField: "ItemName", visible: true, caption: "Item Name", allowSorting: false },
    { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", allowSorting: false },
    { dataField: "ConsumeQuantity", visible: true, caption: "Consumed Qty", allowSorting: true },
    { dataField: "StockUnit", visible: true, caption: "Stock Unit", allowSorting: false },
    { dataField: "IssueSheets", visible: true, caption: "Issue Sheets", allowSorting: false },
    { dataField: "ConsumeSheets", visible: true, caption: "Consumed Sheets", allowSorting: true },
    { dataField: "VoucherNo", visible: true, caption: "Voucher NO", allowSorting: false, hidingPriority: 1 },
    { dataField: "VoucherDate", visible: true, caption: "Voucher Date", allowSorting: false, hidingPriority: 2 },
    { dataField: "BatchNo", visible: true, caption: "Batch NO", allowSorting: false, hidingPriority: 3 },
    { dataField: "IssueTransactionID", visible: false, caption: "IssueTransactionID", allowSorting: false },
    { dataField: "CutSize", visible: true, caption: "Cut Size", allowSorting: false, hidingPriority: 4 }],
    summary: {
        totalItems: [{
            column: "IssueQuantity",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }, {
            column: "ConsumeQuantity",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }, {
            column: "IssueSheets",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }, {
            column: "ConsumeSheets",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }]
    }
});

$("#GridFormsDetails").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
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
        if (e.rowType === "data") {
            if (e.data.Status === "Complete") {
                e.rowElement.css('background', 'green');
                e.rowElement.css('color', '#fff');
            }
            else if (e.data.Status === "In Queue") {
                e.rowElement.css('background', 'yellow');
            }
            else if (e.data.Status === "Part Complete") {
                e.rowElement.css('background', 'coral');
            }
            else if (e.data.Status === "Running") {
                e.rowElement.css('background', 'lightpink');
            }
        }
    },
    columns: [
        { dataField: "JobCardFormNo", visible: true, caption: "JC Form No", allowSorting: false },
        { dataField: "RefNo", visible: true, caption: "Ref Form No", allowSorting: false },
        { dataField: "ColorsFB", visible: true, caption: "Colors", allowSorting: false, hidingPriority: 6 },
        { dataField: "Pages", visible: true, caption: "Pages", allowSorting: true },
        { dataField: "PageNo", visible: true, caption: "Page No", allowSorting: false, hidingPriority: 7 },
        { dataField: "TotalSheets", visible: true, caption: "Total Sheets", allowSorting: false, hidingPriority: 8 },
        { dataField: "PrintingStyle", visible: true, caption: "Printing Style", allowSorting: false, hidingPriority: 5 },
        { dataField: "FoldingStyle", visible: true, caption: "Folding Style", allowSorting: false, hidingPriority: 4 },
        { dataField: "TotalFolds", visible: true, caption: "Total Folds", allowSorting: false, hidingPriority: 3 },
        { dataField: "PrintingRemark", visible: true, caption: "Printing Remark", allowSorting: false, hidingPriority: 0 },
        { dataField: "FoldingRemark", visible: true, caption: "Folding Remark", allowSorting: false, hidingPriority: 1 },
        { dataField: "OtherRemark", visible: true, caption: "Other Remark", allowSorting: false, hidingPriority: 2 },
        { dataField: "Status", visible: true, caption: "Status", allowSorting: false, hidingPriority: 9 }]
});

$("#GridBindingContents").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
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
    columns: [
        { dataField: "LedgerName", visible: true, caption: "Client", allowSorting: false },
        { dataField: "JobName", visible: true, caption: "Job Name", allowSorting: false, hidingPriority: 8 },
        { dataField: "PlanContName", visible: true, caption: "Content Name", allowSorting: false, hidingPriority: 6 },
        { dataField: "JobBookingNo", visible: true, caption: "JC No", allowSorting: true, hidingPriority: 1 },
        { dataField: "JobBookingDate", visible: true, caption: "JC Date", allowSorting: false, hidingPriority: 7 },
        { dataField: "OrderQuantity", visible: true, caption: "Order Qty", allowSorting: false },
        { dataField: "DeliveryDate", visible: true, caption: "Del. Dates", allowSorting: false, hidingPriority: 10 },
        { dataField: "CategoryName", visible: true, caption: "Category", allowSorting: false, hidingPriority: 5 },
        { dataField: "JobCardContentNo", visible: true, caption: "Content No", allowSorting: false, hidingPriority: 4 },
        { dataField: "SalesOrderNo", visible: true, caption: "SO No", allowSorting: false, hidingPriority: 3 },
        { dataField: "OrderBookingDate", visible: true, caption: "SO Date", allowSorting: false, hidingPriority: 0 },
        { dataField: "PONO", visible: true, caption: "PO No", allowSorting: false, hidingPriority: 2 },
        { dataField: "PODate", visible: true, caption: "PO Date", allowSorting: false, hidingPriority: 9 }]
});

$.ajax({
    type: "POST",
    url: "WebService_StartJob.asmx/GetOperator" + Qstring,
    crossDomain: true,
    data: '{LId:' + LedgerID + '}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        if (RES1.length <= 0) return;
        $("#ddlOperator").dxSelectBox({
            items: RES1,
            value: RES1[0].OperatorID
        });
    }
});

function GetMachineSelectedData() {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/GetSelectedData" + Qstring,
        data: '{MachineID:' + JSON.stringify(MachineID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            FetchData = JSON.parse(res);
            if (FetchData.length > 0) {
                RenderData();
            } else
                GetJobCardList();
        }
    });
}

function GetFormWiseReceiptQty(FormNo) {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/GetFormWiseReceiptQty" + Qstring,
        data: '{FormNo:' + JSON.stringify(FormNo) + ',PID:' + GblOperID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            if (RES1.length > 0) {
                document.getElementById("TxtReceivedQuantity").value = RES1[0].ReadyQuantity;
            }
            else {
                document.getElementById("TxtReceivedQuantity").value = 0;
            }
        }
    });
}

function GetMachines(EmpID) {
    var AjaxUrl;
    if (MachineID > 0) {
        AjaxUrl = "WebService_StartJob.asmx/GetMachine" + Qstring;
        EmpID = MachineID;
    } else {
        AjaxUrl = "WebService_StartJob.asmx/GetMachineOperatorWise" + Qstring;
    }
    $.ajax({
        type: "POST",
        url: AjaxUrl,
        data: '{EmpID:' + EmpID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            ObjMachine = JSON.parse(res);

            // --------------- Remove Duplicate Machine------------------------
            //$.each(ObjMachine, function (index, value) {
            //    if ($.inArray(value.MachineID, ids) === -1) {
            //        ids.push(value.MachineID);
            //        ObjUniqueMachine.push(value);
            //    }
            //});
            // ---------------Close Remove Duplicate Machine------------------------      
            if (MachineID > 0) {
                $("#ddlMachine").dxSelectBox({
                    items: ObjMachine,
                    value: MachineID,
                    disabled: true
                });
            } else {
                $("#ddlMachine").dxSelectBox({
                    items: ObjMachine
                });
            }
        }
    });
}

function GetJobCardList() {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/GetJobCard" + Qstring,
        data: '{Operation_ID:' + JSON.stringify(GblOperID) + ',MID:' + MachineID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            ObjAllJobCard = JSON.parse(res);

            $("#ddlJobCard").dxSelectBox({
                items: ObjAllJobCard
            });
        }
    });
}

function BlankTextField() {
    document.getElementById("TxtClientName").value = "";
    document.getElementById("TxtJobName").value = "";
    document.getElementById("TxtContentName").value = "";
    document.getElementById("TxtPreviousOperation").value = "";
    document.getElementById("TxtReceivedQuantity").value = "";
    document.getElementById('FormsDetailsCntainer').style.display = 'none';
    $("#PaperGridDiv").addClass("hidden");
    ObjJobDetail = [];
    $("#ddlFormNo").dxSelectBox({
        items: [],
        value: null
    });
    $("#ddlOperation").dxSelectBox({
        dataSource: [],
        value: null
    });
    GblOperID = 0;
}

function GetFormWiseDetails() {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/RefreshFormWiseDetails" + Qstring,
        data: '{BKId:' + ObjJobDetail[0].JobBookingJobCardContentsID + ',ProId:' + GblOperID + ',Purpose:"Binding"}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            if (RES1.length > 0) { $("#BtnForms").removeClass("hidden"); } else { $("#BtnForms").addClass("hidden"); }
            $("#GridFormsDetails").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

function GetFormWiseDetailsGathering() {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/RefreshFormWiseDetails" + Qstring,
        data: '{BKId:' + ObjJobDetail[0].JobBookingID + ',ProId:' + GblOperID + ',Purpose:"Gathering"}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridFormsDetails").dxDataGrid({
                dataSource: RES1,
                summary: {
                    recalculateWhileEditing: true,
                    totalItems: [{
                        column: "ReadyQuantity",
                        summaryType: "min",
                        displayFormat: "Min Qty: {0}"
                    }]
                }
            });

            var result = $.grep(RES1, function (e) { return e.ReadyQuantity === 0 && e.Status === "In Queue"; });
            if (result.length >= 1) {
                ObjJobDetail = [];
                DevExpress.ui.notify("Production not completed from previous process, Can't start this operation..!", "warning", 3200);
            }
        }
    });
}

function ReloadBindingContentDetails() {
    if (ObjJobDetail.length <= 0) return;
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/ReloadBindingContentDetails" + Qstring,
        data: '{BKID:' + ObjJobDetail[0].JobBookingID + ',ContID:' + ObjJobDetail[0].JobBookingJobCardContentsID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridBindingContents").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

function onProcessChanged(FormNo) {
    $.ajax({
        type: "POST",
        url: "WebService_StartJob.asmx/GetJobCardDetails" + Qstring,
        data: '{MachineID:' + MachineID + ',ObjJobCardNo:' + JSON.stringify(GblJobBookingContentID) + ',ProcID:' + GblOperID + ',RateFactor:' + JSON.stringify(GblRateFactor) + ',FormNo:' + JSON.stringify(FormNo) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            ObjJobDetail = JSON.parse(res);
            if (ObjJobDetail.length <= 0 || GblOperID <= 0) return;
            var result = ObjJobDetail;
            //var result = $.grep(ObjJobDetail, function (e) { return e.ProcessID === GblOperID; });
            if (result.length === 0) return;

            document.getElementById("TxtClientName").value = result[0].ClientName;
            document.getElementById("TxtJobName").value = result[0].JobName;
            document.getElementById("TxtContentName").value = result[0].ContentName;
            document.getElementById("TxtPreviousOperation").value = result[0].PreviousProcessName;
            document.getElementById("TxtReceivedQuantity").value = Number(result[0].PreviousQty) - Number(result[0].ConsumedQty);
            document.getElementById("TxtScheduleQuantity").value = result[0].ScheduleQty;

            document.getElementById("TxtFormRefNo").value = result[0].RefNo;
            //$("#ddlFormNo").dxSelectBox({ value: result[0].JobCardFormNo });
            //$("#ddlRateFactor").dxSelectBox({ items: result[0], value: result[0].RateFactor });
            //$("#ddlOperation").dxSelectBox({ value: result[0].ProcessID });

            if (result[0].ProcessProductionType.includes("Form Wise Production")) {
                GetFormWiseDetails();
                $("#BtnForms").removeClass("hidden");
            } else if (result[0].ContentType !== "MultipleLeaves" && result[0].ProcessProductionType.includes("Gathering") && result[0].PreProcessProductionType.includes("Form Wise Production")) {
                GetFormWiseDetailsGathering();
                $("#BtnForms").removeClass("hidden");
            } else {
                $("#BtnForms").addClass("hidden");
                document.getElementById('FormsDetailsCntainer').style.display = 'none';
            }

            if (result[0].PaperConsumptionRequired === true) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    type: "POST",
                    url: "WebService_StartJob.asmx/GetPaperDetail" + Qstring,
                    data: '{BookingTrID:' + JSON.stringify(result[0].JobBookingJobCardContentsID) + ',DeptID:' + result[0].ProcessID + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0027/g, "'");
                        res = res.replace(/u0026/g, '&');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        PaperDetail = JSON.parse(res);
                        if (PaperDetail.length <= 0) {
                            swal({
                                title: "Item Not Issued..!",
                                text: "Please issue item for this job..!",
                                type: "warning",
                                closeOnConfirm: true
                            }, function () {
                                window.location = "Home.aspx";
                            });
                        }
                        var sumIss = 0, sumCons = 0;

                        for (var i = 0; i < PaperDetail.length; i++) {
                            sumIss = sumIss + Number(PaperDetail[i].IssueSheets);
                            sumCons = sumCons + Number(PaperDetail[i].ConsumeSheets);
                        }

                        $("#PaperGridDiv").removeClass("hidden");
                        $("#PaperDetailGrid").dxDataGrid({ dataSource: PaperDetail });
                        document.getElementById("TxtReceivedQuantity").value = Math.floor(Number(sumIss)) - Math.floor(Number(sumCons));
                    }
                });
            }
            else {
                $("#PaperGridDiv").addClass("hidden");
            }

            document.getElementById('BindingContentsCntainer').style.display = 'none';
            if (result[0].ProcessProductionType.includes('Combine Contents Or Binding')) {
                if (Number(result[0].PreviousProcessStateForBinding) === 0) {
                    swal({
                        title: "Complete all Content's Process",
                        text: "Previous process are not completed for other contents of this job..!",
                        type: "warning",
                        closeOnConfirm: true
                    }, function () {
                        window.location = "Home.aspx";
                    });
                } else {
                    ReloadBindingContentDetails();
                    document.getElementById('BindingContentsCntainer').style.display = 'block';
                }
            }
        }
    });
}

$("#BtnSaveStartJob").click(function () {
    if (ObjJobDetail.length <= 0) return;
    var ddlMachine = $("#ddlMachine").dxSelectBox('instance').option('value');
    var ddlOperation = GblOperID; // $("#ddlOperation").dxSelectBox('instance').option('value');
    var ddlJobCard = $("#ddlJobCard").dxSelectBox('instance').option('value');
    var ddlFormNo = $("#ddlFormNo").dxSelectBox('instance').option('value');
    var ddlOperator = $("#ddlOperator").dxSelectBox('instance').option('value');
    var TxtReceivedQuantity = Number(document.getElementById("TxtReceivedQuantity").value);

    if (ObjJobDetail[0].ProcessProductionType === 'Combine Contents Or Binding' && Number(ObjJobDetail[0].PreviousProcessStateForBinding) <= 0) {
        DevExpress.ui.notify("Previous process are not completed for other contents of this job, Binding is not possible..!", "warning", 2500);
        return false;
    }

    if (ddlMachine === "" || ddlMachine === null || ddlMachine === undefined || ddlMachine === "null") {
        DevExpress.ui.notify("Please choose Machine ..!", "error", 2000);
        document.getElementById("ddlMachine").style.borderColor = "red";
        document.getElementById("ddlMachine").focus();
        return false;
    }
    else {
        document.getElementById("ddlMachine").style.borderColor = "";
    }

    if (ddlOperation === "" || ddlOperation === null || ddlOperation === undefined || ddlOperation <= 0) {
        DevExpress.ui.notify("Please choose Operation ..!", "error", 2000);
        document.getElementById("ddlOperation").style.borderColor = "red";
        document.getElementById("ddlOperation").focus();
        return false;
    }
    else {
        document.getElementById("ddlOperation").style.borderColor = "";
    }

    if (ddlJobCard === "" || ddlJobCard === null || ddlJobCard === undefined || ddlJobCard === "null") {
        DevExpress.ui.notify("Please choose JobCard ..!", "error", 2000);
        document.getElementById("ddlJobCard").style.borderColor = "red";
        document.getElementById("ddlJobCard").focus();
        return false;
    }
    else {
        document.getElementById("ddlJobCard").style.borderColor = "";
    }

    if ($('#file')[0].files.length === 0) {
        DevExpress.ui.notify("Please attach file to start this process ..!", "warning", 2000);
        return false;
    }

    if (ObjJobDetail[0].PaperConsumptionRequired === true) {
        if (PaperDetail.length === 0 || PaperDetail.length === [] || PaperDetail.length === "") {
            DevExpress.ui.notify("Please issue Paper for start this process ..!", "error", 2000);
            return false;
        }

        //if (PaperDetailSelectedData.length === 0) {
        //    DevExpress.ui.notify("Please choose a record from Paper Detail's grid..!", "error", 2000);
        //    return false;
        //}
    }

    if (TxtReceivedQuantity === "" || TxtReceivedQuantity <= 0 || TxtReceivedQuantity === null || TxtReceivedQuantity === undefined || TxtReceivedQuantity === "null") {
        DevExpress.ui.notify("Received quantity should be greater then 0..!", "error", 2000);
        document.getElementById("TxtReceivedQuantity").style.borderColor = "red";
        document.getElementById("TxtReceivedQuantity").focus();
        return false;
    }
    else {
        document.getElementById("TxtReceivedQuantity").style.borderColor = "";
    }

    var objMachineEntry = [];
    var OptMachineEntry = {};

    OptMachineEntry.MachineID = ddlMachine;
    OptMachineEntry.JobBookingJobCardContentsID = ObjJobDetail[0].JobBookingJobCardContentsID;
    OptMachineEntry.JobBookingID = ObjJobDetail[0].JobBookingID;
    OptMachineEntry.ProcessID = ddlOperation;
    OptMachineEntry.RateFactor = ObjJobDetail[0].RateFactor;
    OptMachineEntry.EntryType = 'Job Entry';
    OptMachineEntry.ReceivedQuantity = TxtReceivedQuantity;
    OptMachineEntry.ConversionValue = ObjJobDetail[0].ConversionValue;
    OptMachineEntry.Status = "Running";
    OptMachineEntry.JobCardFormNo = ddlFormNo;
    OptMachineEntry.EmployeeID = ddlOperator;
    OptMachineEntry.ScheduleSequenceID = ObjJobDetail[0].ScheduleSequenceID;
    OptMachineEntry.AttachedFileName = $('#file')[0].files[0].name;

    if (PaperDetailSelectedData.length > 0) {
        OptMachineEntry.PaperID = PaperDetailSelectedData[0].PaperID;
        OptMachineEntry.PaperBatchNo = PaperDetailSelectedData[0].BatchNo;
        OptMachineEntry.IssueTransactionID = PaperDetailSelectedData[0].IssueTransactionID;
    }
    else {
        OptMachineEntry.PaperID = 0;
        OptMachineEntry.PaperBatchNo = "";
        OptMachineEntry.IssueTransactionID = 0;
    }

    objMachineEntry.push(OptMachineEntry);

    var DdlStatus = "Running", VarOperationID = 0, VarJobBookingID = 0;

    //////forms table entry
    var objFormsEntry = [];
    var OptFormsEntry = {};

    OptFormsEntry.MachineID = MachineID;
    OptFormsEntry.JobBookingJobCardContentsID = ObjJobDetail[0].JobBookingJobCardContentsID;
    OptFormsEntry.JobBookingID = ObjJobDetail[0].JobBookingID;
    OptFormsEntry.ProcessID = ddlOperation;
    OptFormsEntry.EmployeeID = ddlOperator;
    OptFormsEntry.Status = DdlStatus;
    OptFormsEntry.JobCardFormNo = ddlFormNo;
    OptFormsEntry.ScheduleSequenceID = ObjJobDetail[0].ScheduleSequenceID;

    objFormsEntry.push(OptFormsEntry);
    ///////////////

    VarOperationID = ddlOperation;
    VarJobBookingID = ObjJobDetail[0].JobBookingJobCardContentsID;

    swal({
        title: "Job Start?",
        text: "Do you want to 'Start Job'..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        showLoaderOnConfirm: true
    }, function () {

        $.ajax({
            type: "POST",
            url: "WebService_StartJob.asmx/EstimoStartProductionData" + Qstring,
            data: '{objMachine_Entry:' + JSON.stringify(objMachineEntry) + ',DdlStatus:' + JSON.stringify(DdlStatus) + ',ProcessID:' + JSON.stringify(VarOperationID) + ',JobBookingID:' + JSON.stringify(VarJobBookingID) + ',objFormsEntry:' + JSON.stringify(objFormsEntry) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                if (results.d === "Success") {
                    swal("Job Started..", "Job started successfully..", "success");
                    uploadFileProduction("Start");
                } else {
                    swal("Failed..!", results.d, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                alert("Please try after some time..");
                console.log(jqXHR);
            }
        });
    });
});

$("#BtnForms").click(function () {
    if (ObjJobDetail.length <= 0) return;
    if (ObjJobDetail[0].ProcessProductionType.includes("Form Wise Production")) {
        GetFormWiseDetails();
    } else if (ObjJobDetail[0].ContentType !== "MultipleLeaves" && ObjJobDetail[0].ProcessProductionType.includes("Gathering") && ObjJobDetail[0].PreProcessProductionType.includes("Form Wise Production")) {
        GetFormWiseDetailsGathering();
    } else {
        document.getElementById('FormsDetailsCntainer').style.display = 'none';
        return;
    }

    document.getElementById('FormsDetailsCntainer').style.display = 'block';
});

function UpdateRecord() {
    if (FetchData.length <= 0) return;
    var UpdateStatus = "Running";
    var MachineID = $("#ddlMachine").dxSelectBox('instance').option('value');
    var ddlFormNo = $("#ddlFormNo").dxSelectBox('instance').option('value');

    //////Main table entry
    var objPEEntry = [];
    var OptPEEntry = {};

    OptPEEntry.MachineID = MachineID;
    OptPEEntry.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
    OptPEEntry.JobBookingID = FetchData[0].JobBookingID;
    OptPEEntry.ProcessID = FetchData[0].ProcessID;
    OptPEEntry.RateFactor = FetchData[0].RateFactor;
    OptPEEntry.ReceivedQuantity = FetchData[0].ReceivedQuantity;
    OptPEEntry.ConversionValue = FetchData[0].ConversionValue;
    OptPEEntry.Status = UpdateStatus;
    OptPEEntry.JobCardFormNo = ddlFormNo;
    OptPEEntry.EmployeeID = LedgerID;
    OptPEEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;

    objPEEntry.push(OptPEEntry);

    ////Update Entry
    var objUpdateEntry = [];
    var OptUpdateEntry = {};

    OptUpdateEntry.MachineID = MachineID;
    OptUpdateEntry.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
    OptUpdateEntry.JobBookingID = FetchData[0].JobBookingID;
    OptUpdateEntry.ProcessID = FetchData[0].ProcessID;
    OptUpdateEntry.RateFactor = FetchData[0].RateFactor;
    OptUpdateEntry.EntryType = 'Job Entry';
    OptUpdateEntry.ReceivedQuantity = FetchData[0].ReceivedQuantity;
    OptUpdateEntry.ConversionValue = FetchData[0].ConversionValue;
    OptUpdateEntry.Status = UpdateStatus;
    OptUpdateEntry.JobCardFormNo = ddlFormNo;
    OptUpdateEntry.EmployeeID = LedgerID;
    OptUpdateEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;

    objUpdateEntry.push(OptUpdateEntry);

    //////forms table entry
    var objFormsEntry = [];
    var OptFormsEntry = {};

    OptFormsEntry.JobCardFormNo = ddlFormNo;
    OptFormsEntry.MachineID = MachineID;
    OptFormsEntry.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
    OptFormsEntry.JobBookingID = FetchData[0].JobBookingID;
    OptFormsEntry.ProcessID = FetchData[0].ProcessID;
    OptFormsEntry.Status = UpdateStatus;
    OptFormsEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;

    objFormsEntry.push(OptFormsEntry);
    ///////////////
    var VarProductionID = 0;
    VarProductionID = FetchData[0].ProductionID;
    ///////

    swal({
        title: "Job Starting..",
        text: "Do you want to start the job?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        showLoaderOnConfirm: true
    }, function () {
        $.ajax({
            type: "POST",
            url: "WebService_StartJob.asmx/EstimoSaveProductionData" + Qstring,
            data: '{objPEEntry:' + JSON.stringify(objPEEntry) + ',objUpdateEntry:' + JSON.stringify(objUpdateEntry) + ',ProductionID:' + JSON.stringify(VarProductionID) + ',objFormsEntry:' + JSON.stringify(objFormsEntry) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                if (results.d === "Success") {
                    swal("Success..", "Job started successfully..", "success");
                    window.location = "UpdateJob.aspx";
                } else {
                    swal("Failed..!", results.d, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                swal("Error..", "Please try after some time..");
            }
        });
    });
}

function RenderData() {
    $("#ddlJobCard").dxSelectBox({ items: FetchData, value: FetchData[0].JobBookingID, disabled: true });
    $("#ddlJobCardContent").dxSelectBox({ value: FetchData[0].JobBookingJobCardContentsID, disabled: true });

    let ProcessFactor = FetchData[0].ProcessName;
    if (FetchData[0].RateFactor !== "") ProcessFactor = FetchData[0].ProcessName + '(' + FetchData[0].RateFactor + ')';
    $("#ddlOperation").dxSelectBox({ value: ProcessFactor/*, disabled: true*/ });
    $("#ddlFormNo").dxSelectBox({ items: FetchData, value: FetchData[0].JobCardFormNo/*, disabled: true*/ });
}
