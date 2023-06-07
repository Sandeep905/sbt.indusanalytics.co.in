"use strict";
var LedgerID = 0;
var GBLContents = [];
var IsReworkDone = 0;
var FilterSTR = "";
var ProfitValue = 0;
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
$("#PendingProcess").dxRadioGroup({
    items: ["Pending", "Processed"],
    layout: "horizontal",
    value: "Pending",
    onValueChanged: function (data) {
        if (data.value != null) {
            if (data.value === "Pending")
                IsReworkDone = 0
            else
                IsReworkDone = 1
        }
        LoadData();
    }
});
$("#Approvaldropdown").dxSelectBox({
    items: ["Approved", "Rejcted", "Rework"],
    placeholder: "Select Reason",
    onValueChanged: function (data) {
        if (data.value != null) {

        }

    }
});
var gblquotatioNo = 0;
var toolTip = $("#tooltip").dxTooltip({}).dxTooltip("instance");

try {

    var showDetails = function (RES1) {

        $("#GridBooingPanel").dxDataGrid({
            keyExpr: 'POID',
            dataSource: RES1,
            export: {
                enabled: true,
                fileName: "Quotes",
                allowExportSelectedData: true
            },
            allowColumnReordering: true,
            allowColumnResizing: true,
            showRowLines: true,
            //wordWrapEnabled: true,
            paging: {
                enabled: true,
                pageSize: 100
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [100, 200, 500, 1000]
            },
            onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('Main sheet');
                DevExpress.excelExporter.exportDataGrid({
                    worksheet: worksheet,
                    component: e.component,
                    customizeCell: function (options) {
                        var excelCell = options;
                        excelCell.font = { name: 'Arial', size: 12 };
                        excelCell.alignment = { horizontal: 'left' };
                    }
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'BookingPanel.xlsx');
                    });
                });
                e.cancel = true;
            },
            filterRow: { visible: true },
            showBorders: true,
            loadPanel: {
                enabled: true,
                text: 'Data is loading...'
            },
            selection: { mode: "single", showCheckBoxesMode: "always", allowSelectAll: false },
            sorting: { mode: 'multiple' },
            height: function () {
                return window.innerHeight / 1.25;
            },
            columnAutoWidth: true,

            masterDetail: {
                enabled: true,
                template(container, options) {
                    const currentProjectData = options.data;

                    $('<div>')
                        .addClass('master-detail-caption')
                        .text(`${currentProjectData.LedgerName} 's Products:`)
                        .appendTo(container);
                    $('<div>')
                        .dxDataGrid({
                            columnAutoWidth: true,
                            showBorders: true,
                            columns: [
                                { dataField: "ProductName", caption: "Product Name" },
                                { dataField: "PlanedVendor", caption: "Planned Vendor" },
                                { dataField: "OrderQuantity", caption: "Planned Quantity" },
                                { dataField: "ScheduleVendorName", caption: "Scheduled Vendor Name" },
                                { dataField: "ScheduleQty", caption: "Scheduled Quantity" },
                                { dataField: "Rate", caption: "Rate" },
                                { dataField: "NetAmount", caption: "Net Amount" },
                                { dataField: "IGSTAmount", caption: "IGST Amount" },
                                { dataField: "CGSTAmount", caption: "CGST Amount" },
                                { dataField: "SGSTAmount", caption: "SGST Amount" },
                                { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                                { dataField: "TotalAmount", caption: "Total Amount" }
                            ],
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.ArrayStore({
                                    //key: 'ID',
                                    data: GBLContents,
                                }),
                                filter: ['POID', '=', options.key],
                            }),
                        }).appendTo(container);
                },
            },
            onRowPrepared: function (e) {
                setDataGridRowCss(e);
                var selOption = $("#selectStatus").dxRadioGroup('instance').option('value');
                if (selOption !== "All") return;
                if (e.rowType === "data") {

                    if (e.data.IsPriceApproved === true) {
                        e.rowElement.addClass('jobapproved');
                        // e.rowElement.css('color', 'white');
                    }
                    else if (e.data.IsSentForApproval === false && e.data.IsApproved === false && e.data.IsCancel === false && e.data.IsRework === false) {
                        e.rowElement.addClass('newquotes');
                    }
                    else if (e.data.IsSentForApproval === true && e.data.IsApproved === false && e.data.IsCancel === false && e.data.IsRework === false) {
                        e.rowElement.addClass('sentforintenalappproval');
                    }

                    else if (e.data.IsCancel === true) {
                        e.rowElement.addClass('iscancelled');
                    }

                    else if (e.data.IsApproved === true) {
                        e.rowElement.addClass('isinternalapproved');
                    }
                    else if (e.data.IsRework === true) {
                        e.rowElement.addClass('isrework');
                    }
                    else {
                        e.rowElement.addClass('newquotes');
                    }

                    //e.rowElement.mousemove(function () {
                    //    if (e.data.ReworkRemark !== null && e.data.ReworkRemark !== "" || (e.data.RemarkInternalApproved !== null && e.data.RemarkInternalApproved !== "")) {
                    //        $('#tooltipText').text("Rework Remark: '" + e.data.ReworkRemark + "',\nInternal Approval Remark: '" + e.data.RemarkInternalApproved + "'").addClass('font-12').css('white-space', 'pre');
                    //        toolTip.show(e.rowElement);
                    //    }
                    //});
                }
            },

            onSelectionChanged: function (selectedItems) {
                var data = selectedItems.selectedRowsData;
                var selOption = $("#selectStatus").dxRadioGroup('instance').option('value');

                if (selectedItems.currentSelectedRowKeys.length > 0) {
                    if (selOption === "All") {
                        return false;
                    } else if (LedgerID === 0) {
                        LedgerID = selectedItems.currentSelectedRowKeys[0].LedgerID;
                    }
                }

                if (data.length === 0) {
                    LedgerID = 0;
                    $("#QuoteIDId").text("");
                    $("#BookingNo").text("");
                } else {
                    $("#QuoteIDId").text(
                        $.map(data, function (value) {
                            return value.POID;
                        }).join(','));

                    $("#BookingNo").text(
                        $.map(data, function (value) {
                            return value.QuotationNo;
                        }).join(','));
                }
            }

        });
    };



    $("#selectStatus").dxRadioGroup({
        items: [{
            value: "All",
            text: "All PO"
        }, {
            value: "NewPO",
            text: "New PO"
        }, {
            value: "Sentforapproval",
            text: "Pending For Approval"
        }, {
            value: "IsApproved",
            text: "Approved"
        }, {
            value: "IsRework",
            text: "Rework"
        }, {
            value: "IsCancelled",
            text: "Rejected"
        }],
        displayExpr: "text",
        valueExpr: "value",
        layout: "horizontal",
        itemTemplate: function (itemData, _, itemElement) {
            itemElement
                .parent().addClass(itemData.value.toLowerCase()).addClass("font-bold")
                .text(itemData.text);
        },
        onValueChanged: function (data) {
            if (data.value == null) return;


            LoadData();


        }
    });

    $("#selectStatus").dxRadioGroup({
        value: "NewPO"
    });
    showDetails([]);
} catch (e) {
    console.log(e);
}

$("#HistoryGrid").dxDataGrid({
    keyExpr: 'POID',
    dataSource: [],
    export: {
        enabled: true,
        fileName: "Quotes_History",
        allowExportSelectedData: true
    },
    allowColumnReordering: true,
    allowColumnResizing: true,
    showRowLines: true,
    //wordWrapEnabled: true,
    paging: {
        enabled: true,
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    onExporting: function (e) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('Main sheet');
        DevExpress.excelExporter.exportDataGrid({
            worksheet: worksheet,
            component: e.component,
            customizeCell: function (options) {
                var excelCell = options;
                excelCell.font = { name: 'Arial', size: 12 };
                excelCell.alignment = { horizontal: 'left' };
            }
        }).then(function () {
            workbook.xlsx.writeBuffer().then(function (buffer) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'BookingPanel_History.xlsx');
            });
        });
        e.cancel = true;

    }, onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    filterRow: { visible: true },
    showBorders: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    selection: { mode: "single", showCheckBoxesMode: "always", allowSelectAll: false },
    sorting: { mode: 'multiple' },
    height: function () {
        return window.innerHeight / 1.25;
    },
    columnAutoWidth: true,

    masterDetail: {
        enabled: true,
        template(container, options) {
            const currentProjectData = options.data;

            $('<div>')
                .addClass('master-detail-caption')
                .text(`${currentProjectData.ClientName} 's Products:`)
                .appendTo(container);
            $('<div>')
                .dxDataGrid({
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        { dataField: "ProductName", caption: "Content Name" },
                        { dataField: "ProductName1", caption: "Product Name" },
                        { dataField: "CategoryName" },
                        { dataField: "HSNCode" },
                        { dataField: "Quantity" },
                        { dataField: "Rate" },
                        { dataField: "RateType" },
                        { dataField: "UnitCost" },
                        { dataField: "GSTPercantage" },
                        { dataField: "GSTAmount" },
                        { dataField: "MiscPercantage" },
                        { dataField: "MiscAmount" },
                        { dataField: "ShippingCost" },
                        { dataField: "ProfitPer" },
                        { dataField: "ProfitCost" },
                        { dataField: "FinalAmount" },
                        { dataField: "VendorName" }
                    ],
                    dataSource: new DevExpress.data.DataSource({
                        store: new DevExpress.data.ArrayStore({
                            //key: 'ID',
                            data: GBLContents,
                        }),
                        filter: ['ProductEstimateID', '=', options.key],
                    }),
                }).appendTo(container);
        },
    },
});
function LoadData() {
    var data = $("#selectStatus").dxRadioGroup('instance').option('value');
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    document.getElementById("BtnSendForApproval").style.display = "none";
    document.getElementById("BtnDisApproval").style.display = "none";
    document.getElementById("BtnSendForInternalApproval").style.display = "none";
    document.getElementById("DivSendToUser").style.display = "none";
    document.getElementById("BtnDisInternalApproval").style.display = "none";
    $('#PrintButton').addClass('hidden');

    if (data === "All") {
        FilterSTR = "All";
        document.getElementById("AllDivDeletePrint").style.display = "none";
        document.getElementById("BtnSendForInternalApproval").style.display = "none";
        document.getElementById("DivSendToUser").style.display = "none";
        document.getElementById("DivApprovaldropdown").style.display = "none";
    } else if (data === "NewPO") {
        FilterSTR = " And PO.IsCancel=0 And PO.IsSentForApproval=0 And PO.IsApproved=0 and PO.IsRework = 0";
        document.getElementById("BtnSendForInternalApproval").style.display = "block";
        document.getElementById("DivSendToUser").style.display = "block";
        document.getElementById("DivApprovaldropdown").style.display = "none";
        document.getElementById("AllDivDeletePrint").style.display = "block";
    } else if (data === "Sentforapproval") {
        FilterSTR = " And PO.IsCancel=0 And PO.IsSentForApproval=1 And PO.IsApproved=0 and PO.IsRework = 0";
        document.getElementById("DivApprovaldropdown").style.display = "flex";
        document.getElementById("AllDivDeletePrint").style.display = "none";
    } else if (data === "IsApproved") {

        $('#PrintButton').removeClass('hidden');
        document.getElementById("DivApprovaldropdown").style.display = "flex";
        document.getElementById("AllDivDeletePrint").style.display = "none";
        FilterSTR = " And PO.IsCancel=0 And PO.IsSentForApproval=1 And PO.IsApproved=1 and PO.IsRework = 0";
    }
    else if (data === "IsCancelled") {
        document.getElementById("AllDivDeletePrint").style.display = "none";
        $('#PrintButton').addClass('hidden');
        document.getElementById("DivApprovaldropdown").style.display = "flex";
        FilterSTR = " And PO.IsCancel=1 And PO.IsSentForApproval=1 And PO.IsApproved=0 and PO.IsRework = 0";
    }
    else {
        FilterSTR = " And PO.IsCancel=0 And PO.IsSentForApproval=1 And PO.IsApproved=0 and PO.IsRework = 1";
        document.getElementById("DivApprovaldropdown").style.display = "flex";
        document.getElementById("AllDivDeletePrint").style.display = "none";
    }

    $.ajax({
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetPoBookingData',
        data: '{FilterSTR:' + JSON.stringify(FilterSTR) + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, ' & ');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            GBLContents = RES1.Contents;

            var cols = [];
            switch (data) {
                case "All":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },
                        { dataField: "IsSentForApproval", caption: "Is Sent For Approval" },
                        { dataField: "IsApproved", caption: "Is Approved" },
                        { dataField: "IsCancel", caption: "Is Cancelled" },
                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Po">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]

                    break;
                case "NewPO":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },

                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Po">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },
                    ]
                    break;
                case "Sentforapproval":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },
                        { dataField: "IsSentForApproval", caption: "Is Sent For Approval" },
                        { dataField: "ApprovalSentDate", caption: "Approval Sent Date" },
                        { dataField: "ApprovalSentTo", caption: "Approval Sent To" },
                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Po">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]
                    break;
                case "IsApproved":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },
                        { dataField: "IsApproved", caption: "Is Approved" },
                        { dataField: "ApprovedDate", caption: "Approved Date" },
                        { dataField: "ApprovedBy", caption: "Approved By" },
                        { dataField: "ApprovedRemark", caption: "Approved Remark" },
                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Po">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]

                    break;
                case "IsRework":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },
                        { dataField: "IsRework", caption: "Is Rework" },
                        { dataField: "ReworkDate", caption: "Rework Date" },
                        { dataField: "ReworkRemark", caption: "Rework Remark" },
                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Po">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]
                    break;
                case "IsCancelled":
                    cols = [
                        { dataField: "EnquiryNo", caption: "Enquiry No" },
                        { dataField: "EstimateNo", caption: "Quotation No" },
                        { dataField: "salesOrderNo", caption: "Sales Order Number" },
                        { dataField: "JobbookingNo", caption: "Job Booking Number" },
                        { dataField: "PONumber", caption: "PO Number" },
                        { dataField: "PoDate", caption: "PO Date" },
                        { dataField: "LedgerName", caption: "Client Name" },
                        { dataField: "NetAmount", caption: "Net Amount" },
                        { dataField: "IGSTAmount", caption: "IGST Amount" },
                        { dataField: "SGSTAmount", caption: "SGST Amount" },
                        { dataField: "CGSTAmount", caption: "CGST Amount" },
                        { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                        { dataField: "TotalAmount", caption: "Total Amount" },
                        { dataField: "IsCancel", caption: "Is Cancelled" },
                        { dataField: "CanceledDate", caption: "Cancelled Date" },
                        { dataField: "CanceledRemark", caption: "Cancelled Remark" },
                        {
                            caption: "", fixedPosition: "right", fixed: true, cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }

                    ]
                    break;

                default:
                // code block
            }
            $("#GridBooingPanel").dxDataGrid({
                dataSource: RES1.Projects,
                columns: cols

            });
        },
        error: function errorFunc(jqXHR) {
            //DevExpress.ui.notify(jqXHR.statusText, "error", 500);
        }
    });
}
$("#PrintButton").click(function () {
    // var bid = document.getElementById("txtBookingID").value;
    var bid = document.getElementById("QuoteIDId").value;

    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "ServicePoViewer.aspx?t=" + bid; //// "Print_Quotation.aspx?BN=" + document.getElementById("QuoteIDId").value + "&BookingNo=" + encodeURIComponent(document.getElementById("BookingNo").value);
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
    }
});

$("#PrintCostingButton").click(function () {
    var bid = document.getElementById("QuoteIDId").value;

    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        //var url = "Print_Detail_Costing_Sheets.aspx?EI=" + document.getElementById("txtBookingID").value;
        var url = "ReportDetailCosting.aspx?BN=" + document.getElementById("QuoteIDId").value;
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
    }
});

$("#BtnSendForApproval").click(function () {
    var bid = document.getElementById("QuoteIDId").value;

    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/UpdateSendForApproval",
            data: '{BKID:' + JSON.stringify(bid) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                if (res === "Save") {
                    swal("Sent", "Selected Quotes are successfully send for approval!", "success");
                    DevExpress.ui.notify("Selected Quotes are successfully send for approval", "success", 1000);
                    location.reload();
                } else {
                    DevExpress.ui.notify("Something went wrong..!", "warning", 500);
                }
            },
            error: function errorFunc(jqXHR) {
                //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    }
});

$("#BtnSendForInternalApproval").click(function () {
    var bid = document.getElementById("QuoteIDId").value;
    var SendTo = $("#SelectBoxSendToUser").dxSelectBox('instance').option('value');
    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    } else if (SendTo === "" || SendTo === null || SendTo <= 0) {
        swal("Invalid Selection", "Please select to whom send for approval...!", "warning");
    } else {
        sendForIntApproval(bid, 1, SendTo);
    }
});

$("#BtnDisInternalApproval").click(function () {
    var bid = document.getElementById("QuoteIDId").value;
    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        sendForIntApproval(bid, 0, 0);
    }
});
$("#BtnDisApproval").click(function () {
    var bid = document.getElementById("QuoteIDId").value;
    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/DisApproval",
            data: '{BKID:' + JSON.stringify(bid) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                if (res === "Save") {

                    swal("Status Updated..", "Selected quotes are successfully disapproved!", "success");
                    location.reload();
                } else {
                    DevExpress.ui.notify("Something went wrong..!", "warning", 1500);
                }
            },
            error: function errorFunc(jqXHR) {
                //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    }
});

$("#Sendmail").click(function () {


    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/Sendmail",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            alert(res);
        },
        error: function errorFunc(jqXHR) {
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });

});

//Internal Approval User Name List
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/InternalApprovalUsers",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelectBoxSendToUser").dxSelectBox({
            items: RES1
        });
    }
});

$("#SelectBoxSendToUser").dxSelectBox({
    items: [],
    placeholder: "Send to--",
    displayExpr: 'UserName',
    valueExpr: 'UserID',
    searchEnabled: true,
    showClearButton: true
});

function sendForIntApproval(bid, flg, SendTo) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/UpdateSendForApprovalPO",
        data: '{BKID:' + JSON.stringify(bid) + ',flag:' + flg + ',SendTo:' + SendTo + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res === "Save") {
                if (flg === 1) {
                    flg = "send";
                } else {
                    flg = "unsend";
                }
                swal("Status Updated..", "Selected quotes are successfully " + flg + " for Internal approval!", "success");
                location.reload();
            } else {
                DevExpress.ui.notify("Something went wrong..!", "warning", 1500);
            }
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
}

function deleteQuotationDetails(ObjBK) {
    var BKID = ObjBK.ProductEstimateID;
    if (BKID <= 0 || BKID === undefined) return;
    swal({
        title: "Delete Quote",
        text: "Are you sure to delete the Quote '" + ObjBK.BookingNo + "'..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Delete",
        closeOnConfirm: true
    },
        function () {

            $.ajax({
                type: "POST",
                url: "WebServicePlanWindow.asmx/DeleteQuotation",
                data: '{BKId:' + BKID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/"/g, '');
                    res = res.replace(/d:/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    if (res === "Success") {
                        swal("Deleted", "Selected quote is successfully deleted!", "success");
                        DevExpress.ui.notify("Selected quote deleted successfully", "success", 1000);
                    } else if (res === "false") {
                        DevExpress.ui.notify("Selected quote is further in transactions can't be deleted..!", "warning", 1000);
                    } else {
                        DevExpress.ui.notify(res, "error", 1000);
                    }
                    location.reload();
                },
                error: function errorFunc(jqXHR) {
                    //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR.message);
                }
            });
        });
}

function QuotesLinkClick(rowData, Flag) {

    if (Flag == "History") {

        $.ajax({
            type: 'post',
            url: 'WebServicePlanWindow.asmx/GetPoBookingHistoryData',
            data: '{PONumber:' + JSON.stringify(rowData.PONumber.split('.')[0]) + '}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/u0026/g, ' & ');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                GBLContents = RES1.Contents;

                var cols = [
                    { dataField: "LedgerName", caption: "Client Name" },
                    { dataField: "PoDate", caption: "PO Date" },
                    { dataField: "PONumber", caption: "PO Number" },
                    { dataField: "JobbookingNo", caption: "Job Booking Number" },
                    { dataField: "salesOrderNo", caption: "Sales Order Number" },
                    { dataField: "EstimateNo", caption: "Quotation No" },
                    { dataField: "EnquiryNo", caption: "Enquiry No" },
                    { dataField: "NetAmount", caption: "Net Amount" },
                    { dataField: "IGSTAmount", caption: "IGST Amount" },
                    { dataField: "SGSTAmount", caption: "SGST Amount" },
                    { dataField: "CGSTAmount", caption: "CGST Amount" },
                    { dataField: "TotalGSTAmount", caption: "Total GST Amount" },
                    { dataField: "TotalAmount", caption: "Total Amount" },
                    { dataField: "IsSentForApproval", caption: "Is Sent For Approval" },
                    { dataField: "IsApproved", caption: "Is Approved" },
                    { dataField: "IsCancel", caption: "Is Cancelled" },
                ]


                $("#HistoryGrid").dxDataGrid({
                    dataSource: RES1.Projects,
                    columns: cols
                });

                $('#modalHistory').modal('show');
            }
        });

        return
    }


    var IsDirectApproved = 0;
    var data = $("#selectStatus").dxRadioGroup('instance').option('value');
    var BKID = rowData.POID;
    if (data = "IsApproved")
        IsDirectApproved = 1
    else
        IsDirectApproved = 0

    var Captitle = "";
    if (Flag === true) {
        Captitle = "Clone Quote Of: ";
    } else if (Flag === false) {
        Captitle = "Revise Po No: ";
    }
    swal({
        title: Captitle + rowData.PONumber,
        text: "Are you sure to continue..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continue",
        closeOnConfirm: false
    },
        function () {
            window.location.href = "JobCardSchedule.aspx?POID=" + BKID + "&FG=" + Flag + "&IsDirectApproved=" + IsDirectApproved;
            window.location.href.reload(true);
        });
}

//////////////////////////////////// Start Notifications ///////////////////////////////////////////////

$("#BtnNotification").click(function () {
    var BookingID = $("#QuoteIDId").text();
    FnNotification(BookingID);

    document.getElementById("BtnNotification").setAttribute("data-toggle", "modal");
    document.getElementById("BtnNotification").setAttribute("data-target", "#CommentModal");
});

function FnNotification(BookingID) {
    var commentData = "";
    var newHtml = '';

    document.getElementById("commentbody").innerHTML = "";
    if (BookingID !== "" && BookingID !== undefined && BookingID !== null && BookingID !== 0) {
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/GetCommentData",
            data: '{PriceApprovalID:0,OrderBookingIDs:0,ProductMasterID:0,JobBookingID:0,BookingID:' + JSON.stringify(BookingID) + '}',
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
                        var CommentDate = new Date(parseInt(commentData[x].CommentDate.substr(6))).toLocaleString('en-IN');
                        newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + ', Date: ' + CommentDate + '</b>';
                        newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                    }
                }
                $("#commentbody").append(newHtml);
                $(".commentInput").show();
            }
        });
    } else {
        $(".commentInput").hide();
    }
}
$('#AllDivDeletePrint').click(function (e) {
    try {
        var bid = document.getElementById("QuoteIDId").value;

        if (bid == 0 || bid == null || bid == undefined) {
            alert("Please Select PO")
            return;
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/DeletePO",
            data: '{POID:' + Number(bid) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                if (res === "Success") {
                    DevExpress.ui.notify("Deleted", "success", 1500);
                    location.reload();
                } else
                    DevExpress.ui.notify(res, "warning", 1500);

            },
            error: function errorFunc(jqXHR) {
                DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 1000);
            }
        });
    } catch (e) {
        console.error(e);
        DevExpress.ui.notify("" + e + "", "error", 100);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});
$('#UpdateAproval').click(function () {
    try {
        var Reason = $("#Approvaldropdown").dxSelectBox('instance').option('value')
        var Reasonremark = document.getElementById('Remarkstatus').value;
        var bid = document.getElementById("QuoteIDId").value;
        if (Reason == null || Reason == "") {
            alert("Please select the reason");
            return;
        }
        if (Reasonremark == null || Reasonremark == "") {
            alert("Please mention remark of updation");
            return;
        }
        try {
            $.ajax({
                type: "POST",
                url: "WebServicePlanWindow.asmx/UpdatePOStatus",
                data: '{Type:' + JSON.stringify(Reason) + ',Remark:' + JSON.stringify(Reasonremark) + ',ID:' + Number(bid) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = results.d.replace(/\\/g, '');
                    if (res === "Success") {
                        DevExpress.ui.notify(res, "success", 1500);
                        location.reload();
                    } else
                        DevExpress.ui.notify(res, "warning", 1500);

                },
                error: function errorFunc(jqXHR) {
                    DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 1000);
                }
            });
        } catch (e) {
            console.log(e);
            DevExpress.ui.notify("" + e + "", "error", 100);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }


    } catch (e) {
        console.log(e);
    }
})

$(function () {
    $("#BtnSaveComment").click(function () {
        var BookingID = $("#QuoteIDId").text();
        if (BookingID === "" || BookingID === null || BookingID === undefined || BookingID === 0) {
            alert("Please select valid estimate to save comment details..!");
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
        objectCommentDetail.ModuleName = "Estimation";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = BookingID;
        objectCommentDetail.BookingID = BookingID;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/SaveCommentData",
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
                //if (res == "Success") {
                // RadioValue = "Pending Requisitions";
                alert("Comment Saved!", "Comment saved successfully.", "success");
                $("#BtnNotification").click();
            },
            error: function errorFunc(jqXHR) {
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });
});
/////////////////////////////////////////////////////// End Notifications ////////////////////////////////////////////////////////////