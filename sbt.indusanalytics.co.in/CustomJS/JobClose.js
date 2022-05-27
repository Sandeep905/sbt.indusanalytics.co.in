
$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading ...",
    width: 300,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

RefreshJobList();
function RefreshJobList() {
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: 'POST',
        url: "WebService_JobStatus.asmx/GridJobCardData",
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/,}/g, ',null}');
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -3);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());

            $("#GridJobCardData").dxDataGrid({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

$("#GridJobCardData").dxDataGrid({
    dataSource: [],
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columnAutoWidth: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    selection: { mode: "single" },
    allowColumnResizing: true,
    sorting: { mode: 'multiple' },
    export: {
        enabled: false,
        fileName: "Job Card",
        allowExportSelectedData: true
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    height: function () {
        return window.innerHeight / 1.1;
    },
    columns: [
        { dataField: "SalesOrderNo", caption: "Order Booking No", width: 100, allowEditing: false },
        { dataField: "PONo", caption: "PO No", width: 70, allowEditing: false },
        { dataField: "PODate", caption: "PO Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80, allowEditing: false },
        { dataField: "JobBookingNo", caption: "Job Card No", allowEditing: false },
        { dataField: "BookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80, allowEditing: false },
        { dataField: "CategoryName", caption: "Job Type", allowEditing: false },
        { dataField: "LedgerName", caption: "Client Name", width: 180, allowEditing: false },
        { dataField: "JobName", caption: "Job Name", width: 200, allowEditing: false },
        { dataField: "OrderQty", caption: "Order Qty", allowEditing: false },
        { dataField: "TotalPackedQuantity", caption: "Packed Qty", allowEditing: false },
        { dataField: "BookedBy", caption: "Job Created By", allowEditing: false },
        { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80, allowEditing: false },
        { dataField: "ProductMasterCode", caption: "Product Catalog Code", width: 100, allowEditing: false }, { dataField: "ProductCode", allowEditing: false },
        { dataField: "BookingNo", caption: "Quote No", allowEditing: false }, { dataField: "IsClose", caption: "Job Close", fixedPosition: "right", fixed: true, allowEditing: true }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('font-size', '11px');
    },
    onRowUpdated: function (e) {
        UpdateJobCloseEntryFlag(e.data.JobBookingID, e.data.IsClose);
    },
    filterRow: { visible: true },
    searchPanel: { visible: false },
    onToolbarPreparing: function (e) {
        e.toolbarOptions.items.unshift({
            location: "after",
            widget: "dxButton",
            options: {
                icon: "refresh",
                onClick: function () {
                    RefreshJobList();
                }
            }
        });
    }
});

function UpdateJobCloseEntryFlag(JobBookingID, IsClose) {
    var EntryOpn = "Job Entry Open";
    if (IsClose === true) EntryOpn = "Job Entry Closed";
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_JobStatus.asmx/JobCardEntryClose",
        data: '{BKID:' + JSON.stringify(JobBookingID) + ',IsClose:' + JSON.stringify(IsClose) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            if (res === "Success") {
                swal(EntryOpn + " successfully..!", EntryOpn + " for selected job card no.", "success");
            } else {
                swal("Error..!", res, "warning");
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}
