"use strict";

var queryString = new Array();
var GblBookingID = 0;
var GridContent, GridContentQty;
$(function () {

    if (queryString.length === 0) {
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]).replace(/"/g, '');
                queryString[key] = value;
            }
        }
    }

    if (queryString["BKID"] !== null && queryString["BKID"] !== undefined) {
        GblBookingID = Number(queryString["BKID"]);
        if (GblBookingID <= 0) return;
        GetMailData();
    }
});

$(".forTextBox").keyup(function (e) {
    if (e.target.value.includes('"') || e.target.value.includes("'")) {
        e.target.value = e.target.value.replace(/"/g, '');
        e.target.value = e.target.value.replace(/'/g, "");
    }
});

$("#GridContentDetails").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    selection: { mode: "multiple", deferred: true },
    selectionFilter: ["BookingID", ">", "0"],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    filterRow: { visible: false },
    height: function () {
        return window.innerHeight / 4;
    },
    columns: [{ dataField: "PlanContName", caption: "Content Name", visible: true, allowEditing: false }, { dataField: "ProcessDetail", allowEditing: false }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitialized: function (e) {
        GridContent = e.component;
    }
}).dxDataGrid("instance");

$("#GridContentQtyDetails").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    selection: { mode: "multiple", deferred: true },
    selectionFilter: ["FinalCost", ">", "0"],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    filterRow: { visible: false },
    height: function () {
        return window.innerHeight / 4;
    },
    columns: [{ dataField: "PlanContQty", caption: "Quantity", visible: true, allowEditing: false }, { dataField: "FinalCost", caption: "Cost", visible: true, allowEditing: false }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitialized: function (e) {
        GridContentQty = e.component;
    }
});

function GetMailData() {
    if (GblBookingID <= 0) return;
    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/GetMailQuoteData",
        data: '{JobBKID:' + GblBookingID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\r/g, '').replace(/\\n/g, '<br >');
            res = res.replace(/\\/g, '').replace(/"d":""/g, '').replace(/""/g, '');
            res = res.replace(/":,/g, '":null,').replace(/":}/g, '":null}');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1).slice(0, -1);
            var ObjData = JSON.parse(res.toString());
            $("#GridContentDetails").dxDataGrid({
                dataSource: ObjData.TblQuotes
            });
            $("#GridContentQtyDetails").dxDataGrid({
                dataSource: ObjData.TblQuoteQties
            });
            if (ObjData.TblQuotes.length > 0) {
                var strProcess = "";
                for (var i = 0; i < ObjData.TblQuotes.length; i++) {
                    strProcess = strProcess + ObjData.TblQuotes[i].PlanContName + " :- " + ObjData.TblQuotes[i].ProcessDetail;
                    strProcess = strProcess + "\n";
                    document.getElementById("TxtProcesses").rows = Number(document.getElementById("TxtProcesses").rows) + 1;
                }
                document.getElementById("TxtProcesses").value = strProcess;

                document.getElementById("TxtPostalName").value = ObjData.TblQuotes[0].MailingName;
                document.getElementById("TxtAttention").value = ObjData.TblQuotes[0].ConcernPerson;
                document.getElementById("TxtHeaderText").value = ObjData.TblQuotes[0].HeaderText.replace(/<br >/g, '\n');
                document.getElementById("TxtFooterText").value = ObjData.TblQuotes[0].FooterText.replace(/<br >/g, '\n');
                document.getElementById("TxtEmailBody").value = ObjData.TblQuotes[0].EmailBody.replace(/<br >/g, '\n');
                document.getElementById("TxtEmailTo").value = ObjData.TblQuotes[0].EmailTo;
                document.getElementById("TxtCurrency").value = ObjData.TblQuotes[0].CurrencySymbol;
                document.getElementById("TxtConvertValue").value = ObjData.TblQuotes[0].ConversionValue;
                document.getElementById("TxtQuoteBy").value = ObjData.TblQuotes[0].UserName;
                document.getElementById("TxtDesignation").value = ObjData.TblQuotes[0].Designation;
                document.getElementById("TxtAddress").value = ObjData.TblQuotes[0].MailingAddress.replace(/<br >/g, '\n');
                //document.getElementById("TxtProcesses").value = ObjData.TblQuotes[0].ProcessContentRemarks;
                var EmailSubject = ObjData.TblQuotes[0].EmailSubject;
                if (EmailSubject === "" || EmailSubject === null) {
                    EmailSubject = "Quotation For : " + ObjData.TblQuotes[0].JobName;
                }
                document.getElementById("TxtSubject").value = EmailSubject;
            }
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
        }
    });
}

$("#BtnPreviewQuote").click(function () {
    var QtyStr = "", ContStr = "", ContHide;
    var ObjData = [];
    var ObjDataX = {};
    ObjDataX.BookingID = GblBookingID;
    ObjDataX.MailingName = document.getElementById("TxtPostalName").value;
    ObjDataX.MailingAddress = document.getElementById("TxtAddress").value;
    ObjDataX.EmailSubject = document.getElementById("TxtSubject").value;
    ObjDataX.ConcernPerson = document.getElementById("TxtAttention").value;
    ObjDataX.HeaderText = document.getElementById("TxtHeaderText").value;
    ObjDataX.FooterText = document.getElementById("TxtFooterText").value;
    ObjDataX.EmailBody = document.getElementById("TxtEmailBody").value;
    ObjDataX.EmailTo = document.getElementById("TxtEmailTo").value;
    ObjDataX.ProcessContentRemarks = document.getElementById("TxtProcesses").value;
    ObjDataX.Designation = document.getElementById("TxtDesignation").value.trim();
    ObjDataX.QuoteByUser = document.getElementById("TxtQuoteBy").value.trim();

    ObjData.push(ObjDataX);

    GridContent.getSelectedRowsData().then(function (rowData) {
        for (var i = 0; i < rowData.length; i++) {
            if (ContStr === "") {
                ContStr = "'" + rowData[i].PlanContName + "'";
            } else
                ContStr = ContStr + ',' + "'" + rowData[i].PlanContName + "'";
        }
    });

    GridContentQty.getSelectedRowsData().then(function (rowData) {
        for (var i = 0; i < rowData.length; i++) {
            if (QtyStr === "") {
                QtyStr = rowData[i].PlanContQty;
            } else
                QtyStr = QtyStr + "," + rowData[i].PlanContQty;
        }
    });

    ContHide = document.getElementById("ChkHideContDetails").checked;

    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/UpdateMailQuoteData",
        data: '{ObjData:' + JSON.stringify(ObjData) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var RES1 = JSON.parse(results);
            if (RES1.d.includes("Error:500")) {
                var text = RES1.d.replace("Error:500,", "");
                DevExpress.ui.notify("Error in preview " + text + "..!", "error", 1500);
            } else {
                var url = "ReportQuotation.aspx?BookingID=" + GblBookingID + "&QtyStr=" + QtyStr + "&ContStr=" + ContStr + "&ContHide=" + ContHide;
                window.open(url, "_parent", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
            }
        },
        error: function (ex) {
            console.log(ex);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
});