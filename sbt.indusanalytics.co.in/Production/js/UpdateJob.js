"use strict";

var ObjMachine = [], MachineID = 0, LedgerID = 0;
var PaperDetail = [], PaperDetailSelectedData = [];
var FetchData = [];
var GblUpdateStatus = "";
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

$("#PaperDetailGrid").dxDataGrid({
    dataSource: PaperDetail,
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
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
    height: function () {
        return window.innerHeight / 1.8;
    },
    onSelectionChanged: function (clicked2) {
        PaperDetailSelectedData = clicked2.selectedRowsData;
        //if (PaperDetailSelectedData.length > 0) {
        //    document.getElementById("TxtReceivedQuantity").value = Number(PaperDetailSelectedData[0].IssueQuantity) - Number(PaperDetailSelectedData[0].ConsumeQuantity);
        //    document.getElementById("TxtBalanceQuantity").value = Number(document.getElementById("TxtReceivedQuantity").value);
        //} else {
        //    document.getElementById("TxtReceivedQuantity").value = 0;
        //    document.getElementById("TxtBalanceQuantity").value = 0;
        //}
    },
    columns: [{ dataField: "PaperID", visible: false, caption: "PaperID", allowSorting: false },
    { dataField: "GRNTransactionID", visible: false, caption: "GRNTransactionID", allowSorting: false },
    { dataField: "ItemCode", visible: true, caption: "Item Code", allowSorting: false },
    { dataField: "ItemName", visible: true, caption: "Item Name", allowSorting: false, hidingPriority: 5 },
    { dataField: "IssueQuantity", visible: true, caption: "Issue Qty", allowSorting: false },
    { dataField: "ConsumeQuantity", visible: true, caption: "Consumed Qty", allowSorting: true },
    { dataField: "StockUnit", visible: true, caption: "Stock Unit", allowSorting: false },
    { dataField: "IssueSheets", visible: true, caption: "Issue Sheets", allowSorting: false },
    { dataField: "ConsumeSheets", visible: true, caption: "Consumed Sheets", allowSorting: true },
    { dataField: "VoucherNo", visible: true, caption: "Voucher No", allowSorting: false, hidingPriority: 2 },
    { dataField: "VoucherDate", visible: true, caption: "Voucher Date", allowSorting: false, hidingPriority: 3 },
    { dataField: "BatchNo", visible: true, caption: "Batch No", allowSorting: false, hidingPriority: 4 },
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

///// Semi Packing Grid///////
$("#SemiPackingGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnResizingMode: "widget",
    editing: {
        mode: "cell",
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        useIcons: true
    },
    height: function () {
        return window.innerHeight / 2.3;
    },
    onRowPrepared: function (e) {
        e.columns[6].width = 20; ///delete icon col width
        e.columns[7].width = 20; ///expand col width
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [{ dataField: "OuterCarton", visible: true, caption: "No Of CFC", allowEditing: true, dataType: "number", validationRules: [{ type: "required" }] },
    { dataField: "InnerCarton", visible: true, caption: "Bndl in CFC", allowEditing: true, dataType: "number", validationRules: [{ type: "required" }] },
    { dataField: "QuantityPerPack", visible: true, caption: "Qty in Bndl", allowEditing: true, dataType: "number", validationRules: [{ type: "required" }] },
    { dataField: "QuantityPerOuter", visible: true, caption: "Qty in CFC", allowEditing: false, dataType: "number", hidingPriority: 0 },
    { dataField: "PackedQuantity", visible: true, caption: "Total Qty", allowEditing: false, dataType: "number" },
    { dataField: "PackingDescription", visible: true, caption: "Packing Detail", allowEditing: false, hidingPriority: 1 }],
    onRowUpdated: function (e) {
        e.key.QuantityPerOuter = e.key.InnerCarton * e.key.QuantityPerPack;
        e.key.PackedQuantity = e.key.OuterCarton * e.key.QuantityPerOuter;
        e.key.PackingDescription = e.key.OuterCarton + "x" + e.key.QuantityPerOuter;
        e.component.refresh();

        document.getElementById("TxtProductionQuantity").value = e.component.getTotalSummaryValue("PackedQuantity");
    },
    onRowInserting: function (e) {
        e.data.QuantityPerOuter = e.data.InnerCarton * e.data.QuantityPerPack;
        e.data.PackedQuantity = e.data.OuterCarton * e.data.QuantityPerOuter;
        e.data.PackingDescription = e.data.OuterCarton + "x" + e.data.QuantityPerOuter;
    },
    onRowInserted: function (e) {
        document.getElementById("TxtProductionQuantity").value = e.component.getTotalSummaryValue("PackedQuantity");
    },
    onContentReady: function (e) {
        document.getElementById("TxtProductionQuantity").value = e.component.getTotalSummaryValue("PackedQuantity");
        if (Number(document.getElementById("TxtProductionQuantity").value) > 0) document.getElementById("TxtProductionQuantity").disabled = true;
    },
    summary: {
        recalculateWhileEditing: true,
        totalItems: [{
            column: "OuterCarton",
            summaryType: "sum",
            displayFormat: "Total Box: {0}"
        }, {
            column: "PackedQuantity",
            summaryType: "sum",
            displayFormat: "Total Packed Qty: {0}"
        }, {
            column: "InnerCarton",
            summaryType: "sum",
            displayFormat: "Ttl Inner Carton: {0}"
        }]
    }////₹   
});
////

$("#ddlOperation").dxSelectBox({
    displayExpr: 'ProcessName',
    valueExpr: 'ProcessID',
    disabled: true
});

$("#ddlJobCard").dxSelectBox({
    displayExpr: 'JobBookingNo',
    valueExpr: 'JobBookingNo',
    disabled: true
});

$("#ddlFormNo").dxSelectBox({
    displayExpr: 'JobCardFormNo',
    valueExpr: 'JobCardFormNo',
    disabled: true
});

$("#ddlMachine").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'MachineName',
    valueExpr: 'MachineID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        BlankTextField();
        MachineID = data.value;
        if (MachineID === "" || MachineID === null) return;
        $.ajax({
            type: "POST",
            url: "WebService_UpdateJob.asmx/GetSelectedData" + Qstring,
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

                RenderData();
            }
        });
    }
});

$("#SelMachineStatus").dxSelectBox({
    displayExpr: 'MachineStatus',
    valueExpr: 'MachineStatus',
    itemTemplate: function (data) {
        return "<div class='custom-item'><img src='Images/icons/" +
            data.IconSrc + "' /><div class='product-name'>" +
            data.MachineStatus + "</div></div>";
    },
    onSelectionChanged: function (e) {
        //e.component.option("dropDownButtonTemplate", dropDownButtonTemplate(e.selectedItem));
    },
    onValueChanged: function (data) {
        var MStatus = data.value;
        if (MStatus.includes("Complete") || MStatus === "Update") {
            $("#BtnStop").hide();
            $("#BtnUpdate").show();
        } else {
            $("#BtnStop").show();
            $("#BtnUpdate").hide();
        }
    }
});

$.ajax({
    type: "POST",
    url: "WebService_UpdateJob.asmx/GetRunningMachine" + Qstring,
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjMachine = [];
        ObjMachine = JSON.parse(res);

        $("#ddlMachine").dxSelectBox({ items: ObjMachine });
        if (MachineID > 0) $("#ddlMachine").dxSelectBox({ value: MachineID, disabled: true });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_UpdateJob.asmx/GetMachineStatusList" + Qstring,
    data: '{MId:' + MachineID + '}',
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

        $("#SelMachineStatus").dxSelectBox({ items: RES1 });

        //var drw = "";
        //for (var i = 0; i < RES1.length; i++) {
        //    drw += "<div class='col-lg-2 col-md-2 col-sm-2 col-xs-6 btn statusbtn' onclick='UpdateMachineStatus(this)'><img style='width:100%;height:7em;border: 1px solid;' src='Images/icons/" + RES1[i].IconSrc + "' /><div class='font-12 dx-word-wrap' style='height:2.4em;'><b style='white-space: pre-wrap;'>" + RES1[i].MachineStatus + "</b></div></div>";
        //}
        //$("#StatusDiv").append(drw);
        var drw = "";
        for (var cnt = 0; cnt < RES1.length; cnt++) {
            drw += '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 btn"><div onclick="UpdateMachineStatus(this);" class="statusbtn" title="' + RES1[cnt].MachineStatus + '" id="' + RES1[cnt].MachineStatus + '" style="height: 10em;">' +
                ' <div style="width: 100%; height: 8em; text-align: center"><img src="Images/icons/' + RES1[cnt].IconSrc + '" style="width: 100%; height: 100%;" /></div><div><b class="font-12">' + RES1[cnt].MachineStatus + '</b></div></div></div>';
        }
        $("#StatusDiv").append(drw);
    }
});

$("#BtnNext").click(function (e) {

    var TxtProductionQuantity = document.getElementById("TxtProductionQuantity").value.trim();
    if (TxtProductionQuantity === null || TxtProductionQuantity === undefined || TxtProductionQuantity === "") {
        DevExpress.ui.notify("Please enter production quantity..!, if not available enter 0(zero)", "warning", 2500);
        document.getElementById("TxtProductionQuantity").style.borderColor = "red";
        document.getElementById("TxtProductionQuantity").focus();
        return false;
    } else {
        document.getElementById("TxtProductionQuantity").style.borderColor = "";
    }

    $("#NextScreenDiv").removeClass("hidden");
    $("#MainUpdateScreen").addClass("hidden");
});

$("#BtnBackToMain").click(function (e) {
    $("#MainUpdateScreen").removeClass("hidden");
    $("#NextScreenDiv").addClass("hidden");
});

$("#BtnPaperDetails").click(function (e) {
    var grid = document.getElementById('PaperGridDiv');
    if (grid.style.display === "block") { grid.style.display = "none"; } else { grid.style.display = "block"; }
});

$("#TxtConValue").keyup(function (e) {
    if (e.target.value <= 0) {
        e.target.value = 1;
    }
});

$("#TxtWastageQuantity").keyup(function (e) {
    //if (GblRemainingQty !== 0) {
    $("#TxtProductionQuantity").keyup();
    //}
});

$("#TxtProductionQuantity").keyup(function (e) {
    var Ttl = 0;
    var GblRemainingQty = Number(document.getElementById("TxtBalanceQuantity").value);
    var ScheduleQty = Number(document.getElementById("TxtScheduleQuantity").value);
    var preProcess = "";
    if (FetchData[0].PreviousProcessName !== "" && FetchData[0].PreviousProcessName !== null) {
        preProcess = FetchData[0].PreviousProcessName.toUpperCase();
    }

    //if (FetchData[0].PlanType === "Sheet Planning") {
    if (preProcess === 'CUTTING' && FetchData[0].ProcessProductionType === 'Form Wise Production' && Number(ScheduleQty) < Number(document.getElementById("TxtProductionQuantity").value)) {
        document.getElementById("TxtProductionQuantity").value = 0;
        document.getElementById("TxtWastageQuantity").value = 0;
        document.getElementById("TxtSuspenseQuantity").value = 0;
        document.getElementById("TxtSuspenseRemark").value = "";
        return false;
    }
    let QtyTolerance = 500;
    if (Number(GblRemainingQty) + QtyTolerance < Number(document.getElementById("TxtProductionQuantity").value)) {
        document.getElementById("TxtProductionQuantity").value = 0;
        document.getElementById("TxtWastageQuantity").value = 0;
        document.getElementById("TxtSuspenseQuantity").value = 0;
        document.getElementById("TxtSuspenseRemark").value = "";
    } else {
        if (Number(document.getElementById("TxtReceivedQuantity").value) + QtyTolerance < Number(document.getElementById("TxtProductionQuantity").value)) {
            document.getElementById("TxtProductionQuantity").value = 0;
            document.getElementById("TxtSuspenseRemark").value = "";
        }
        Ttl = Number(document.getElementById("TxtCompletedQuantity").value) / Number(document.getElementById("TxtConValue").value) + Number(document.getElementById("TxtProductionQuantity").value) + Number(document.getElementById("TxtWastageQuantity").value);
        document.getElementById("TxtSuspenseQuantity").value = Number(GblRemainingQty) - Number(Ttl);

        if (document.getElementById("TxtUnitConversion").value.toUpperCase() === "FORMS UNIT" && FetchData[0].ProcessProductionType.toUpperCase().includes("GATHERING") && FetchData[0].PreProcessProductionType.toUpperCase().includes("FORM WISE PRODUCTION")) {
            Ttl = GblRemainingQty / Number(document.getElementById("TxtConValue").value);
            document.getElementById("TxtSuspenseQuantity").value = Number(Ttl) - (Number(document.getElementById("TxtProductionQuantity").value) + Number(document.getElementById("TxtWastageQuantity").value));
        } else if (FetchData[0].PlanContentType === "Multiple Leaves" || FetchData[0].PlanContentType === "Pre Planned Sheet" && FetchData[0].ProcessProductionType.toUpperCase().includes("GATHERING")) {
            var TempTtlUps = Number(FetchData[0].UpsL) * Number(FetchData[0].UpsW);
            Ttl = GblRemainingQty / Number(document.getElementById("TxtConValue").value) / TempTtlUps;
            document.getElementById("TxtSuspenseQuantity").value = Number(Ttl) - (Number(document.getElementById("TxtProductionQuantity").value) + Number(document.getElementById("TxtWastageQuantity").value));
        }
    }
    $("#TxtSuspenseQuantity").removeClass("btnAnimation planme_btn");
    if (Number(document.getElementById("TxtSuspenseQuantity").value) < 0) {
        $("#TxtSuspenseQuantity").addClass("btnAnimation planme_btn");
        document.getElementById("TxtSuspenseRemark").value = "Access";
    } else if (Number(document.getElementById("TxtSuspenseQuantity").value) > 0) {
        document.getElementById("TxtSuspenseRemark").value = "Extra";
    } else if (Number(document.getElementById("TxtSuspenseQuantity").value) === 0) document.getElementById("TxtSuspenseRemark").value = "";
    // btnAnimation planme_btn
    //}
});

function UpdateMachineStatus(ele) {

    var x = document.getElementById("StatusDiv").querySelectorAll(".statusbtn");
    for (var dx = 0; dx < x.length; dx++) {
        x[dx].style.border = '';
    }

    ele.style.border = '2px solid #42909A';

    GblUpdateStatus = ele.title;
    UpdateRecord(ele);
}

function BlankTextField() {
    $("#ddlOperation").dxSelectBox({
        value: '',
        disabled: true
    });
    $("#ddlJobCard").dxSelectBox({
        value: '',
        disabled: true
    });
    $("#ddlFormNo").dxSelectBox({
        value: '',
        disabled: true
    });
    document.getElementById("TxtJobName").value = "";
    document.getElementById("TxtContentName").value = "";
    document.getElementById("TxtPreviousOperation").value = "";
    document.getElementById("TxtReceivedQuantity").value = "";
    document.getElementById("TxtProductionQuantity").value = "";
    document.getElementById("TxtWastageQuantity").value = "";
    document.getElementById("TxtSuspenseQuantity").value = "";
    document.getElementById("TxtUnitConversion").value = "";
    document.getElementById("TxtConValue").value = "";
    document.getElementById("TxtProductionRemark").value = "";
    document.getElementById("TxtWastageremark").value = "";
    document.getElementById("TxtSuspenseRemark").value = "";
    document.getElementById("TxtCompletedQuantity").value = "";
    document.getElementById("TxtBalanceQuantity").value = "";
    $("#PaperGridDiv").addClass("hidden");
    $("#SemiPackingGridDiv").addClass("hidden");
    PaperDetail = [], PaperDetailSelectedData = [];
}

function RenderData() {
    PaperDetail = FetchData;

    $("#ddlOperation").dxSelectBox({
        items: FetchData,
        value: FetchData[0].ProcessID,
        disabled: true
    });
    $("#ddlJobCard").dxSelectBox({
        items: FetchData,
        value: FetchData[0].JobBookingNo,
        disabled: true
    });
    $("#ddlFormNo").dxSelectBox({
        items: FetchData,
        value: FetchData[0].JobCardFormNo,
        disabled: true
    });

    document.getElementById("TxtJobName").value = FetchData[0].JobName;
    document.getElementById("TxtContentName").value = FetchData[0].ContentName;
    document.getElementById("TxtPreviousOperation").value = FetchData[0].PreviousProcessName;
    document.getElementById("TxtUnitConversion").value = FetchData[0].UnitConversion;
    document.getElementById("TxtConValue").value = FetchData[0].ConversionValue;
    document.getElementById("TxtCompletedQuantity").value = FetchData[0].CompleteQuantity;
    if (FetchData[0].BALANCEQTY <= 0) FetchData[0].BALANCEQTY = FetchData[0].ReceivedQuantity = FetchData[0].ScheduleQty;
    document.getElementById("TxtBalanceQuantity").value = FetchData[0].BALANCEQTY;
    document.getElementById("TxtReceivedQuantity").value = FetchData[0].ReceivedQuantity;
    document.getElementById("TxtScheduleQuantity").value = FetchData[0].ScheduleQty;
    //document.getElementById("TxtSuspenseRemark").value = FetchData[0].SuspenseRemark;
    document.getElementById("TxtFormRefNo").value = FetchData[0].RefNo;

    document.getElementById("TxtSuspenseRemark").disabled = true;
    if (FetchData[0].UnitConversion.toUpperCase() === "NONE") {
        document.getElementById("TxtUnitConversion").disabled = false;
        //document.getElementById("TxtConValue").disabled = false;
    } else {
        document.getElementById("TxtUnitConversion").disabled = "disabled";
        //document.getElementById("TxtConValue").disabled = "disabled";
    }

    if (FetchData[0].PaperConsumptionRequired === true) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebService_StartJob.asmx/GetPaperDetail" + Qstring,
            data: '{BookingTrID:' + JSON.stringify(FetchData[0].JobBookingJobCardContentsID) + ',DeptID:' + FetchData[0].ProcessID + '}',
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
                $("#PaperDetailGrid").dxDataGrid({ dataSource: PaperDetail });
                //document.getElementById("PaperGridDiv").style.display = "block";
                var sumIss = 0, sumCons = 0;

                for (var i = 0; i < PaperDetail.length; i++) {
                    sumIss = sumIss + Number(PaperDetail[i].IssueSheets);
                    sumCons = sumCons + Number(PaperDetail[i].ConsumeSheets);
                }

                document.getElementById("TxtReceivedQuantity").value = Math.floor(sumIss);
                //document.getElementById("TxtCompletedQuantity").value = Math.floor(sumCons);
                document.getElementById("TxtBalanceQuantity").value = Math.floor(Number(sumIss)) - Math.floor(Number(sumCons));
                if (PaperDetail.length > 0) { $("#PaperGridDiv").removeClass("hidden"); } else { $("#PaperGridDiv").addClass("hidden"); }
            }
        });
    }
    $("#SemiPackingGridDiv").addClass("hidden");
    if (FetchData[0].ProcessProductionType === "Combine Contents Or Binding") {
        if (FetchData[0].NextProcess === "" || FetchData[0].NextProcess === null && FetchData[0].PreviousProcessStateForBinding <= 0) {
            $("#SemiPackingGridDiv").removeClass("hidden");
        }
    } else if (FetchData[0].NextProcess === "" || FetchData[0].NextProcess === null && FetchData[0].PreviousProcessStateForBinding <= 0) {
        $("#SemiPackingGridDiv").removeClass("hidden");
    } else {
        document.getElementById("TxtProductionQuantity").disabled = false;
        document.getElementById("TxtProductionQuantity").focus();
    }
}

function UpdateRecord(XX) {
    var UpdateStatus = GblUpdateStatus; // document.getElementById(XX.id).value;
    var MachineID = $("#ddlMachine").dxSelectBox('instance').option('value');
    var TxtProductionQuantity = Number(document.getElementById("TxtProductionQuantity").value);
    var TxtWastageQuantity = Number(document.getElementById("TxtWastageQuantity").value);
    var TxtSuspenseQuantity = Number(document.getElementById("TxtSuspenseQuantity").value);
    var TxtCompletedQuantity = Number(document.getElementById("TxtCompletedQuantity").value);
    var TxtUnitConversion = document.getElementById("TxtUnitConversion").value;
    var TxtConValue = Number(document.getElementById("TxtConValue").value);
    var TxtProductionRemark = document.getElementById("TxtProductionRemark").value.trim();
    var TxtWastageremark = document.getElementById("TxtWastageremark").value;
    var TxtDetailsForStatus = document.getElementById("TxtDetailsForStatus").value.trim();
    var ddlFormNo = $("#ddlFormNo").dxSelectBox('instance').option('value');
    //var SelMachineStatus = $("#SelMachineStatus").dxSelectBox('instance').option('value');
    if (TxtConValue === "" || TxtConValue <= 0) {
        TxtConValue = 1;
    }
    if (/*UpdateStatus.toUpperCase() === "COMPLETE" || */UpdateStatus.toUpperCase() === "RUNNING") {
        GblUpdateStatus = "Active";
    }

    if (FetchData.length <= 0) return;
    if (GblUpdateStatus === null || GblUpdateStatus === undefined || GblUpdateStatus === "") {
        DevExpress.ui.notify("Please choose status..!", "warning", 2000);
        return false;
    }

    if ((UpdateStatus.toUpperCase() === "COMPLETE" || UpdateStatus.toUpperCase() === "RUNNING") && (TxtProductionQuantity <= 0 || TxtProductionQuantity === null || TxtProductionQuantity === undefined || TxtProductionQuantity === "")) {
        DevExpress.ui.notify("Please enter production quantity ..!", "warning", 2000);
        document.getElementById("TxtProductionQuantity").style.borderColor = "red";
        $("#BtnBackToMain").click();
        document.getElementById("TxtProductionQuantity").focus();
        return false;
    }
    else {
        document.getElementById("TxtProductionQuantity").style.borderColor = "";
    }

    if (UpdateStatus.toUpperCase() !== "COMPLETE" && UpdateStatus.toUpperCase() !== "RUNNING" && (TxtDetailsForStatus === null || TxtDetailsForStatus === undefined || TxtDetailsForStatus === "")) {
        DevExpress.ui.notify("Please enter machine stop reason..!", "warning", 2500);
        document.getElementById("TxtDetailsForStatus").style.borderColor = "red";
        document.getElementById("TxtDetailsForStatus").focus();
        return false;
    } else {
        document.getElementById("TxtDetailsForStatus").style.borderColor = "";
    }

    if ($('#file')[0].files.length === 0) {
        DevExpress.ui.notify("Please attach file to update this process ..!", "warning", 2000);
        return false;
    }

    //if (FetchData[0].PaperConsumptionRequired === true && PaperDetailSelectedData.length <= 0) {
    //    DevExpress.ui.notify("Please select paper batch..!", "warning", 2000);
    //    return false;
    //}

    //if (FetchData[0].PaperConsumptionRequired === true && PaperDetailSelectedData[0].ConsumeQuantity >= PaperDetailSelectedData[0].IssueQuantity) {
    //    DevExpress.ui.notify("Please select other paper batch..!", "warning", 2000);
    //    return false;
    //} else
    //if (/*FetchData[0].PaperConsumptionRequired === false &&*/ Number(FetchData[0].ReceivedQuantity) < Number(TxtProductionQuantity)) {
    //    DevExpress.ui.notify("Production quantity is not more than receipt quantity..!", "warning", 2000);
    //    document.getElementById("TxtProductionQuantity").style.borderColor = "red";
    //    document.getElementById("TxtProductionQuantity").focus();
    //    document.getElementById("TxtProductionQuantity").value = "";
    //    return false;
    //} else {
    //    document.getElementById("TxtProductionQuantity").style.borderColor = "";
    //}

    //////Main table entry
    var objPEEntry = [];
    var OptPEEntry = {};

    OptPEEntry.MachineID = MachineID;
    OptPEEntry.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
    OptPEEntry.JobBookingID = FetchData[0].JobBookingID;
    OptPEEntry.ProcessID = FetchData[0].ProcessID;
    OptPEEntry.RateFactor = FetchData[0].RateFactor;
    // OptPEEntry.ReceivedQuantity = Number(FetchData[0].ReceivedQuantity);
    OptPEEntry.Status = UpdateStatus;
    OptPEEntry.JobCardFormNo = ddlFormNo;
    OptPEEntry.EmployeeID = LedgerID;

    ReadyQty = 0;
    if (TxtUnitConversion.toUpperCase().includes("UPS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("CUTS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("FORMS")) {
        ReadyQty = Number(TxtProductionQuantity);
    } else {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    }
    OptPEEntry.ProductionQuantity = Number(TxtProductionQuantity); //TxtProductionQuantity;
    OptPEEntry.ReadyQuantity = Number(TxtCompletedQuantity) + Number(ReadyQty);

    //OptPEEntry.ProductionQuantity = Number(TxtProductionQuantity) + Number(FetchData[0].CompleteQuantity);
    //OptPEEntry.ReadyQuantity = Number(Number(TxtProductionQuantity) * Number(TxtConValue)) + Number(FetchData[0].ReadyQuantity);
    OptPEEntry.WastageQuantity = Number(TxtWastageQuantity) + Number(FetchData[0].WastageQuantity);
    OptPEEntry.SuspenseQuantity = Number(TxtSuspenseQuantity) + Number(FetchData[0].SuspenseQuantity);
    OptPEEntry.ConversionValue = TxtConValue;
    OptPEEntry.ConversionUnit = TxtUnitConversion;
    OptPEEntry.ProductionRemark = TxtProductionRemark;
    //OptPEEntry.WastageRemark = TxtWastageremark;
    //OptPEEntry.SuspenseRemark = TxtSuspenseRemark;
    OptPEEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;
    OptPEEntry.AttachedFileName = $('#file')[0].files[0].name;

    if (FetchData[0].PaperConsumptionRequired === true && PaperDetailSelectedData.length > 0) {
        OptPEEntry.PaperID = PaperDetailSelectedData[0].PaperID;
        OptPEEntry.PaperBatchNo = PaperDetailSelectedData[0].BatchNo;
        OptPEEntry.IssueTransactionID = PaperDetailSelectedData[0].IssueTransactionID;
    }
    else {
        OptPEEntry.PaperID = 0;
        OptPEEntry.PaperBatchNo = "";
        OptPEEntry.IssueTransactionID = 0;
    }

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
    OptUpdateEntry.Status = UpdateStatus;
    OptUpdateEntry.JobCardFormNo = ddlFormNo;
    OptUpdateEntry.EmployeeID = LedgerID;

    var ReadyQty = 0;
    if (TxtUnitConversion.toUpperCase().includes("UPS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("CUTS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("FORMS")) {
        ReadyQty = Number(TxtProductionQuantity);
    } else {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    }
    OptUpdateEntry.ProductionQuantity = Number(TxtProductionQuantity); //TxtProductionQuantity;
    OptUpdateEntry.ReadyQuantity = Number(TxtCompletedQuantity) + Number(ReadyQty);

    OptUpdateEntry.WastageQuantity = TxtWastageQuantity;
    OptUpdateEntry.SuspenseQuantity = TxtSuspenseQuantity;
    OptUpdateEntry.ConversionValue = TxtConValue;
    OptUpdateEntry.ProductionRemark = TxtProductionRemark;
    //OptUpdateEntry.WastageRemark = TxtWastageremark;
    //OptUpdateEntry.SuspenseRemark = TxtSuspenseRemark;
    OptUpdateEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;
    OptUpdateEntry.AttachedFileName = $('#file')[0].files[0].name;

    if (FetchData[0].PaperConsumptionRequired === true && PaperDetailSelectedData.length > 0) {
        OptUpdateEntry.PaperID = PaperDetailSelectedData[0].PaperID;
        OptUpdateEntry.PaperBatchNo = PaperDetailSelectedData[0].BatchNo;
        OptUpdateEntry.IssueTransactionID = PaperDetailSelectedData[0].IssueTransactionID;
    }
    else {
        OptUpdateEntry.PaperID = 0;
        OptUpdateEntry.PaperBatchNo = "";
        OptUpdateEntry.IssueTransactionID = 0;
    }

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

    ReadyQty = 0;
    if (TxtUnitConversion.toUpperCase().includes("UPS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("CUTS")) {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    } else if (TxtUnitConversion.toUpperCase().includes("FORMS")) {
        ReadyQty = Number(TxtProductionQuantity);
    } else {
        ReadyQty = Number(TxtProductionQuantity) * Number(TxtConValue);
    }
    OptFormsEntry.ProductionQuantity = Number(TxtProductionQuantity); //TxtProductionQuantity;
    OptFormsEntry.ReadyQuantity = Number(TxtCompletedQuantity) + Number(ReadyQty);

    OptFormsEntry.WastageQuantity = Number(TxtWastageQuantity) + Number(FetchData[0].WastageQuantity);
    OptFormsEntry.SuspenseQuantity = Number(TxtSuspenseQuantity) + Number(FetchData[0].SuspenseQuantity);
    OptFormsEntry.ProductionRemark = TxtProductionRemark;
    //OptFormsEntry.WastageRemark = TxtWastageremark;
    //OptFormsEntry.SuspenseRemark = TxtSuspenseRemark;
    OptFormsEntry.ScheduleSequenceID = FetchData[0].ScheduleSequenceID;

    objFormsEntry.push(OptFormsEntry);
    ///////////////

    var objPaperConsumption = [];
    var OptPaperConsumption = {};

    var objPaperConsumptionDetails = [];
    var OptPaperConsumptionDetails = {};

    if (FetchData[0].PaperConsumptionRequired === true && PaperDetail.length > 0) {
        //OptPaperConsumption.ProductionID = FetchData[0].ProductionID;
        OptPaperConsumption.JobBookingID = FetchData[0].JobBookingID;
        OptPaperConsumption.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
        OptPaperConsumption.TotalQuantity = Number(TxtProductionQuantity) + Number(TxtWastageQuantity);
        OptPaperConsumption.DepartmentID = FetchData[0].DepartmentID;

        objPaperConsumption.push(OptPaperConsumption);

        var consumeQty = Number(TxtProductionQuantity) + Number(TxtWastageQuantity);

        var consumeWt = 0, WtperPack = 0.00;

        var remainQty = 0;
        for (var j = 0; j < PaperDetail.length; j++) {
            if (Number(PaperDetail[j].RemainingPaper) > 0) {
                OptPaperConsumptionDetails = {};

                if (PaperDetail[j].ItemGroupNameID === -1) {
                    remainQty = Number(PaperDetail[j].RemainingPaper) - consumeQty;
                    if (remainQty < 0) {
                        consumeWt = Number(PaperDetail[j].RemainingPaper);
                    } else {
                        consumeWt = consumeQty;
                    }
                } else {
                    if (PaperDetail[j].StockUnit.toUpperCase().includes("METER")) {
                        remainQty = Number(PaperDetail[j].RemainingPaper) - consumeQty;
                        if (remainQty < 0) {
                            consumeWt = Number(PaperDetail[j].RemainingPaper) * Number(PaperDetail[j].CutSizeL) / 1000;
                        } else {
                            consumeWt = consumeQty * Number(PaperDetail[j].CutSizeL) / 1000;
                        }
                    } else {
                        WtperPack = Number(Number(Number(PaperDetail[j].CutSizeW) * Number(PaperDetail[j].CutSizeL) * Number(PaperDetail[j].GSM)) / 1000000000).toFixed(6);
                        remainQty = Number(PaperDetail[j].RemainingPaper) - consumeQty;

                        if (remainQty < 0) {
                            consumeWt = Number(PaperDetail[j].RemainingPaper) * Number(WtperPack);
                        } else {
                            consumeWt = consumeQty * Number(WtperPack);
                        }
                    }
                }

                OptPaperConsumptionDetails.JobBookingID = FetchData[0].JobBookingID;
                OptPaperConsumptionDetails.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
                OptPaperConsumptionDetails.ProcessID = FetchData[0].ProcessID;
                OptPaperConsumptionDetails.DepartmentID = FetchData[0].DepartmentID;
                OptPaperConsumptionDetails.ItemID = PaperDetail[j].PaperID;
                OptPaperConsumptionDetails.BatchNo = PaperDetail[j].BatchNo;
                OptPaperConsumptionDetails.ConsumeQuantity = parseFloat(consumeWt).toFixed(3);
                OptPaperConsumptionDetails.ParentTransactionID = PaperDetail[j].GRNTransactionID;
                OptPaperConsumptionDetails.IssueTransactionID = PaperDetail[j].IssueTransactionID;
                OptPaperConsumptionDetails.TransID = j + 1;
                OptPaperConsumptionDetails.MachineID = MachineID;

                objPaperConsumptionDetails.push(OptPaperConsumptionDetails);
                if (remainQty >= 0) {
                    break;
                } else if (remainQty < 0) {
                    consumeQty = consumeQty - Number(PaperDetail[j].RemainingPaper);
                }
            }
        }
    }

    /////////Semi Packing Details
    var objSemiPack = [];
    var OptSemiPack = {};

    var objSemiPackDetails = [];
    var OptSemiPackDetails = {};
    var SemiPackDetails = $("#SemiPackingGrid").dxDataGrid('instance');

    if (SemiPackDetails._options.dataSource.length > 0) {
        OptSemiPack.LedgerID = FetchData[0].LedgerID;
        OptSemiPack.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
        OptSemiPack.JobBookingID = FetchData[0].JobBookingID;
        OptSemiPack.OrderBookingID = FetchData[0].OrderBookingID;
        OptSemiPack.ProductMasterID = FetchData[0].ProductMasterID;
        OptSemiPack.TotalPackedQuantity = SemiPackDetails.getTotalSummaryValue("PackedQuantity");
        OptSemiPack.TotalOuterCarton = SemiPackDetails.getTotalSummaryValue("OuterCarton");
        OptSemiPack.TotalInnerCarton = SemiPackDetails.getTotalSummaryValue("InnerCarton");
        OptSemiPack.Narration = TxtProductionRemark;

        objSemiPack.push(OptSemiPack);
        for (var i = 0; i < SemiPackDetails._options.dataSource.length; i++) {
            OptSemiPackDetails = {};
            OptSemiPackDetails.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
            OptSemiPackDetails.JobBookingID = FetchData[0].JobBookingID;
            OptSemiPackDetails.OrderBookingID = FetchData[0].OrderBookingID;
            OptSemiPackDetails.ProductMasterID = FetchData[0].ProductMasterID;
            OptSemiPackDetails.OuterCarton = SemiPackDetails._options.dataSource[i].OuterCarton;
            OptSemiPackDetails.InnerCarton = SemiPackDetails._options.dataSource[i].InnerCarton;
            OptSemiPackDetails.QuantityPerPack = SemiPackDetails._options.dataSource[i].QuantityPerPack;
            OptSemiPackDetails.QuantityPerOuter = SemiPackDetails._options.dataSource[i].QuantityPerOuter;
            OptSemiPackDetails.PackedQuantity = SemiPackDetails._options.dataSource[i].PackedQuantity;
            OptSemiPackDetails.PackingDescription = SemiPackDetails._options.dataSource[i].PackingDescription;
            OptSemiPackDetails.TransID = i + 1;

            objSemiPackDetails.push(OptSemiPackDetails);
        }
    }
    ///////
    var VarProcessID = 0, VarBookingTransactionID = 0, VarProductionID = 0, VarCheckConsumption = false;

    VarProcessID = FetchData[0].ProcessID;
    VarBookingTransactionID = FetchData[0].JobBookingJobCardContentsID;
    VarProductionID = FetchData[0].ProductionID;
    VarCheckConsumption = FetchData[0].PaperConsumptionRequired;

    ////Machine Status Entry
    var objMachineData = {}, ArrobjMachineData = [];
    objMachineData.MachineID = MachineID;
    objMachineData.Status = GblUpdateStatus;
    objMachineData.MachineStatus = GblUpdateStatus;
    objMachineData.Details = TxtDetailsForStatus;
    objMachineData.OtherRemark = TxtDetailsForStatus;
    objMachineData.ProcessID = FetchData[0].ProcessID;
    objMachineData.JobBookingJobCardContentsID = FetchData[0].JobBookingJobCardContentsID;
    objMachineData.ProductionID = FetchData[0].ProductionID;
    ArrobjMachineData.push(objMachineData);

    swal({
        title: UpdateStatus,
        text: "Do you want to '" + UpdateStatus + "' job status..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        showLoaderOnConfirm: true
    }, function () {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        
        $.ajax({
            type: "POST",
            url: "WebService_UpdateJob.asmx/EstimoSaveProductionData",
            data: '{objPEEntry:' + JSON.stringify(objPEEntry) + ',objUpdateEntry:' + JSON.stringify(objUpdateEntry) + ',objPaper_Consumption:' + JSON.stringify(objPaperConsumption) + ',objPaper_ConsumptionDetails:' + JSON.stringify(objPaperConsumptionDetails) + ',ProcessID:' + JSON.stringify(VarProcessID) + ',JobBookingContID:' + JSON.stringify(VarBookingTransactionID) + ',ProductionID:' + JSON.stringify(VarProductionID) + ',VarCheckConsumption:' + JSON.stringify(VarCheckConsumption) + ',objFormsEntry:' + JSON.stringify(objFormsEntry) + ',OptSemiPack:' + JSON.stringify(objSemiPack) + ',OptSemiPackDetails:' + JSON.stringify(objSemiPackDetails) + ',objMachineData:' + JSON.stringify(ArrobjMachineData) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                if (results.d === "Update") {
                    uploadFileProduction("Update");
                    swal("Updated..", "Machine status updated successfully..", "success");
                    //if (/*UpdateStatus.toUpperCase() === "COMPLETE" || */UpdateStatus.toUpperCase() === "RUNNING") { window.location = "UpdateJob.aspx"; } else { window.location = "StartJob.aspx"; }
                } else {
                    swal("Failed..!", results.d, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);                
                alert("Please try after some time..");
            }
        });
    });

}