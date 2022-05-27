"use strict";

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

$("#DtFromTime").dxDateBox({
    //pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    type: 'datetime',
    value: new Date(),
    max: new Date()
});

$("#GridReport").dxDataGrid({
    dataSource: [],
    showBorders: true,
    showRowLines: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    columnChooser: { enabled: true },
    //wordWrapEnabled: true,
    export: {
        enabled: true,
        fileName: "Stock Bin Wise Report",
        allowExportSelectedData: true
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    columns: [
        { dataField: "ItemGroupName", width: 120 }, { dataField: "ItemSubGroupName", width: 120 }
        , { dataField: "ItemCode", width: 120 }, { dataField: "ItemName", width: 250 }
        , { dataField: "Quality", width: 120 }, { dataField: "GSM" }
        , { dataField: "Finish", width: 120 }, { dataField: "SizeW", width: 100 }, { dataField: "SizeL", width: 100 }
        , { dataField: "StockUnit", width: 120 }, { dataField: "BatchStock", width: 100 }
        , { dataField: "GRNNo", width: 100 }, { dataField: "GRNDate", width: 100 }
        , { dataField: "BatchNo", width: 120 }, { dataField: "PurchaseReferenceRemark", width: 180, caption:"Purchase Reference" }, { dataField: "Warehouse", width: 120 }
        , { dataField: "Bin", width: 120 }, { dataField: "WtPerPacking", width: 120 }
        , { dataField: "UnitPerPacking", width: 120, visible: false }, { dataField: "ConversionFactor", width: 120, visible: false }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        if (e.rowType === "data") {
            if (e.data.IsMailSend === true || e.data.IsMailSend === 1) {
                e.rowElement.css('background', 'lightgreen');
                e.rowElement.css('color', '#fff');
            }
        }
    },
    //onExporting: function (e) {
    //    e.cancel = true;
    //    var dataSourceArray = e.component.getDataSource().items();
    //    var csv = JSON2CSV(dataSourceArray);
    //    var downloadLink = document.createElement("a");
    //    var blob = new Blob(["\ufeff", csv]);
    //    var url = URL.createObjectURL(blob);
    //    downloadLink.href = url;
    //    downloadLink.download = "Stock Bin Wise Report.csv";
    //    document.body.appendChild(downloadLink);
    //    downloadLink.click();
    //    document.body.removeChild(downloadLink);
    //},
    summary: {
        totalItems: [{
            column: "BatchStock",
            summaryType: "sum",
            displayFormat: "Total: {0}"
        }]
    }
});

function RefreshReport(FromTime, check) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: "POST",
        url: "WebService_CommonMIS.asmx/GetStockBinWiseReport",
        data: '{FromDate:' + JSON.stringify(FromTime) + ',check:' + JSON.stringify(check) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var RES1 = GetJsonConvertedObject(results);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            $("#GridReport").dxDataGrid({ dataSource: RES1 });
        }
    });
}

function BtnRefreshclick() {
    var IsActiveDate = document.getElementById("IsActiveDate").checked;
    var DtFromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    RefreshReport(DtFromTime, IsActiveDate);
}

function BtnPrintclick() {
    var IsActiveDate = document.getElementById("IsActiveDate").checked;
    var DtFromTime = $('#DtFromTime').dxDateBox('instance').option('value');
    var DtToTime = $('#DtToTime').dxDateBox('instance').option('value');

    var url = "ReportPrint.aspx?IsDate=" + IsActiveDate + "&FromTime=" + DtFromTime.format("dd-MMM-yyyy HH:mm tt") + "&TransactionID=" + MachineID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
}
