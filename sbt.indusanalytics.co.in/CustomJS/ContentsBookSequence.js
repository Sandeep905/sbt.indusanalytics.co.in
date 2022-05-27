var ObjJobCardContents = [];

$("#SelJobCard").dxSelectBox({
    items: [],
    placeholder: "Select JobCard--",
    displayExpr: 'JobBookingNo',
    valueExpr: 'JobBookingID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        $("#JobCardGridGrid").dxDataGrid({ dataSource: [] });
        $("#GridFormsDetails").dxDataGrid({ dataSource: [] });
        if (e.value === null) return;
        $.ajax({
            type: "POST",
            url: "WebService_JobStatus.asmx/GetJobCardFormContentsDetail",
            data: '{JCID:' + JSON.stringify(e.value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var ObjJobCardGridGrid = JSON.parse(res);
                $("#JobCardGridGrid").dxDataGrid({ dataSource: ObjJobCardGridGrid });
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_JobStatus.asmx/GetJobCardNoFormWise",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SelJobCardData = JSON.parse(res);

        $("#SelJobCard").dxSelectBox({
            items: SelJobCardData
        });
    }
});

$("#JobCardGridGrid").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 3;
    },
    columns: [{ dataField: "JobCardContentNo", caption: "Job Content No", width: 100 },
    { dataField: "BookingDate", visible: true, caption: "Job Date", width: 80 },
    { dataField: "ContentName", visible: true, caption: "Content Name" },
    { dataField: "JobName", visible: true, caption: "Job Name" },
    { dataField: "OrderQuantity", visible: true, caption: "Order Qty", width: 100 }],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clicked) {
        ObjJobCardContents = clicked.selectedRowsData;
        $("#GridFormsDetails").dxDataGrid({ dataSource: [] });

        if (ObjJobCardContents.length <= 0) return;
        GetFormsDetails();
    }
});

$("#GridFormsDetails").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    allowSorting: false,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 2.5;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    columns: [{ dataField: "JobCardFormNo", caption: "Form No", allowEditing: false }, { dataField: "PlanContName", caption: "Content", allowEditing: false }, { dataField: "MachineName", caption: "Machine", allowEditing: false },
    { dataField: "PlateSize", allowEditing: false }, { dataField: "ColorsFB", caption: "Colors(F/B)", allowEditing: false }, { dataField: "Pages", allowEditing: false }, { dataField: "Ups", caption: "Ups", allowEditing: false },
    { dataField: "PageNo", caption: "Page No", allowEditing: true }, { dataField: "RefNo", caption: "Ref. Form No", allowEditing: true }, { dataField: "SetsForms", caption: "Sets/Forms", allowEditing: false }, { dataField: "SheetSize", caption: "Sheet Size", allowEditing: false },
    { dataField: "ActualSheets", allowEditing: false }, { dataField: "WasteSheets", allowEditing: false }, { dataField: "TotalSheets", caption: "Ttl Sheets", allowEditing: false }, { dataField: "PrintingStyle", caption: "Printing Style", allowEditing: false }, { dataField: "PaperDetails", caption: "Paper Details", allowEditing: false }, { dataField: "FoldingStyle", caption: "Folding Style", allowEditing: true }, { dataField: "TotalFolds", caption: "Ttl Folds", allowEditing: true },
    { dataField: "PrintingRemark", caption: "Printing Remark", allowEditing: true }, { dataField: "FoldingRemark", caption: "Folding Remark", allowEditing: true }, { dataField: "OtherRemark", caption: "Other Remark", allowEditing: true }],
    onCellPrepared(e) {
        if (e.rowType !== "data" && e.columnIndex !== 0) return;
        if (e.columnIndex === 7 || e.columnIndex === 8) {
            e.cellElement.css('background-color', 'red');
            e.cellElement.css('color', 'white');
        }
    }
});

$("#BtnUpdateForms").click(function () {
    if (ObjJobCardContents.length === 0) {
        DevExpress.ui.notify("Please choose content first..!", "warning", 1500);
        return false;
    }
    document.getElementById("BtnUpdateForms").disabled = false;

    var GridFormsDetails = $('#GridFormsDetails').dxDataGrid('instance');
    var FormsdataSource = GridFormsDetails._options.dataSource;

    var jsonObjectsRecordMain = [];
    var objRecordMain = {};

    for (var i = 0; i < FormsdataSource.length; i++) {
        objRecordMain = {};
        objRecordMain.JobCardFormDetailID = FormsdataSource[i].JobCardFormDetailID;
        objRecordMain.JobBookingJobCardContentsID = FormsdataSource[i].JobBookingJobCardContentsID;
        objRecordMain.PageNo = FormsdataSource[i].PageNo;
        objRecordMain.RefNo = FormsdataSource[i].RefNo;
        //if (FormsdataSource[i].RefNo === "" || FormsdataSource[i].RefNo === null || FormsdataSource[i].RefNo < 0) {
        //    DevExpress.ui.notify("Please enter form reference no..!", "warning", 1500);
        //    //document.getElementById("BtnUpdateForms").disabled = false;
        //    //return false;
        //}
        jsonObjectsRecordMain.push(objRecordMain);
    }

    $.ajax({
        type: "POST",
        url: "WebService_JobStatus.asmx/UpdateFormsDetails",
        data: '{jsonObjFormsMain:' + JSON.stringify(jsonObjectsRecordMain) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            document.getElementById("BtnUpdateForms").disabled = false;
            if (res === "Success") {
                swal("Updated!", "Your data Updated", "success");
                GetFormsDetails();
            } else {
                swal("", res, "error");
            }
        },
        error: function errorFunc(jqXHR) {
            document.getElementById("BtnUpdateForms").disabled = false;
            swal("Error!", "Please try after some time.." + jqXHR, "");
        }
    });
});

function GetFormsDetails() {
    if (ObjJobCardContents.length <= 0) return;
    $.ajax({
        type: "POST",
        url: "WebService_JobStatus.asmx/GetContentWiseFormsDetails",
        data: '{ContentsID:' + JSON.stringify(ObjJobCardContents[0].JobBookingJobCardContentsID) + ',BKID:' + JSON.stringify(ObjJobCardContents[0].JobBookingID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/":}/g, '":null}');
            res = res.replace(/":,/g, ":null,");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridFormsDetails").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}