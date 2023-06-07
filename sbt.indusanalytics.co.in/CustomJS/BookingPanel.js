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
var gblquotatioNo = 0;
var toolTip = $("#tooltip").dxTooltip({}).dxTooltip("instance");

try {

    var showDetails = function (RES1) {

        $("#GridBooingPanel").dxDataGrid({
            keyExpr: 'ProductEstimateID',
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
            onRowPrepared: function (e) {
                setDataGridRowCss(e);
                var selOption = $("#selectStatus").dxRadioGroup('instance').option('value');
                if (selOption !== "All") return;
                if (e.rowType === "data") {

                    if (e.data.IsPriceApproved === true) {
                        e.rowElement.addClass('jobapproved');
                        // e.rowElement.css('color', 'white');
                    }
                    else if (e.data.IsSendForInternalApproval === false && e.data.IsInternalApproved === false && e.data.IsCancelled === false && e.data.IsSendRework === false) {
                        e.rowElement.addClass('newquotes');
                    }
                    else if (e.data.IsSendInternalApproval === true && e.data.IsInternalApproved === false && e.data.IsCancelled === false && e.data.IsSendRework === false) {
                        e.rowElement.addClass('sentforintenalappproval');
                    }
                    else if (e.data.IsMailSent === true) {
                        e.rowElement.addClass('ismailsent');
                    }
                    else if (e.data.IsCancelled === true) {
                        e.rowElement.addClass('iscancelled');
                    }
                    else if (e.data.IsSendForPriceApproval === true) {
                        e.rowElement.addClass('pendingforpriceapproval');
                    }
                    else if (e.data.IsInternalApproved === true) {
                        e.rowElement.addClass('isinternalapproved');
                    }
                    else if (e.data.IsSendRework === true) {
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
                    if (true !== selectedItems.currentSelectedRowKeys[0].IsInternalApproved && selOption === "All") {
                        selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                        DevExpress.ui.notify("Selected quote is not internal approved..!", "warning", 2000);
                        selectedItems.currentSelectedRowKeys = [];
                        return false;
                    } else if (LedgerID === 0) {
                        LedgerID = selectedItems.currentSelectedRowKeys[0].LedgerID;
                    }
                    else if (LedgerID !== selectedItems.currentSelectedRowKeys[0].LedgerID) {
                        selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                        DevExpress.ui.notify("Please select records which have same client..!", "warning", 2000);
                        selectedItems.currentSelectedRowKeys = [];
                        return false;
                    }
                }

                if (data.length === 0) {
                    LedgerID = 0;
                    $("#QuoteIDId").text("");
                    $("#BookingNo").text("");
                } else {
                    $("#QuoteIDId").text(
                        $.map(data, function (value) {
                            return value.ProductEstimateID;
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
            text: "All Quotes"
        }, {
            value: "NewQuotes",
            text: "New Quotes"
        }, {
            value: "sentforintenalappproval",
            text: "Pending For Internal Approval"
        }, {
            value: "IsInternalApproved",
            text: "Internal Approved"
        }, {
            value: "pendingforpriceapproval",
            text: "Pending For Price Approval"
        }, {
            value: "IsRework",
            text: "Rework"
        }, {
            value: "IsCancelled",
            text: "Rejected"
        }, {
            value: "IsMailSent",
            text: "Sent Quotes"
        }, {
            value: "JobApproved",
            text: "Cost Approved"
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
            //var dataGrid = $("#GridBooingPanel").dxDataGrid('instance');


            LoadData();
            //if (data.value == "IsRework") {
            //    $('#PendingProcess').removeClass('hidden');
            //} else {
            //    $('#PendingProcess').addClass('hidden');
            //    IsReworkDone = 0;
            //}

        }
    });

    $("#selectStatus").dxRadioGroup({
        value: "NewQuotes"
    });
    showDetails([]);
} catch (e) {
    console.log(e);
}

$("#HistoryGrid").dxDataGrid({
    keyExpr: 'ProductEstimateID',
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
        //dataGrid.clearFilter();
        FilterSTR = data;
    } else if (data === "NewQuotes") {
        FilterSTR = " And PQ.IsSendForInternalApproval=0 And PQ.IsInternalApproved=0 And PQ.IsCancelled=0 And PQ.IsRework=0 And PQ.IsApproved=0 ";
        document.getElementById("BtnSendForInternalApproval").style.display = "block";
        document.getElementById("DivSendToUser").style.display = "block";
    } else if (data === "sentforintenalappproval") {
        FilterSTR = " And PQ.IsSendForInternalApproval=1 And PQ.IsInternalApproved=0 And PQ.IsCancelled=0 And PQ.IsRework=0 And PQ.IsApproved=0 ";
        document.getElementById("BtnDisInternalApproval").style.display = "block";
    } else if (data === "IsInternalApproved") {
        document.getElementById("BtnSendForApproval").style.display = "block";

        $('#PrintButton').removeClass('hidden');

        FilterSTR = " And PQ.IsInternalApproved=1 And PQ.IsCancelled=0 and PQ.IsApproved =0  ";
    } else if (data === "pendingforpriceapproval") {
        //document.getElementById("BtnSendForApproval").style.display = "block";
        $('#PrintButton').removeClass('hidden');
        FilterSTR = " And PQ.IsInternalApproved=1 And PQ.IsCancelled=0 And PQ.IsSendForPriceApproval=1 and Isnull(PQ.Isapproved,0) <> 1 ";
    } else {
        FilterSTR = " And PQ." + data + "= 1 " //and isnull(IsReworkDone,0) =" + IsReworkDone;
        //dataGrid.filter([data, "=", 1]);
    }

    if (data === "JobApproved") {
        FilterSTR = " And PQ.IsApproved = 1 ";
        document.getElementById("BtnDisApproval").style.display = "none";
    }
    $.ajax({
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetBookingData',
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
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "IsSendInternalApproval" },
                        { dataField: "IsInternalApproved" },
                        { dataField: "IsSendRework" },
                        { dataField: "IsCancelled" },
                        { dataField: "IsSendForPriceApproval" },
                        { dataField: "IsPriceApproved" },
                        //{ dataField: "ApprovedDate" },
                        //{ dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
                        //{ dataField: "ReworkDate" },
                        //{ dataField: "ReworkRemark", caption: "Rework Remark", visible: true, width: 200 },
                        //{ dataField: "CancelledDate" },
                        //{ dataField: "CancelledRemark", caption: "Reasons of Quote Failure", visible: true },

                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        }, {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: false,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]

                    break;
                case "NewQuotes":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: false,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },
                    ]
                    break;
                case "sentforintenalappproval":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "ApprovalSendDate" },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                if (options.key.CommentCount > 0) {
                                    $('<div title="Quote Comments">').addClass('fa fa-bell customgridbtn dx-link').append('<span class="bg-deep-orange badge font-10">' + options.key.CommentCount + '</span>')
                                        .on('dxclick', function () {
                                            FnNotification(options.key.BookingID);

                                            this.setAttribute("data-toggle", "modal");
                                            this.setAttribute("data-target", "#CommentModal");
                                        }).appendTo(container);
                                }

                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },

                    ]
                    break;
                case "IsInternalApproved":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "InternalApprovedDate" },
                        { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        }
                    ]

                    break;
                case "pendingforpriceapproval":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "InternalApprovedDate" },
                        { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: true,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        }
                    ]

                    break;
                case "IsRework":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "ReworkDate" },
                        { dataField: "ReworkRemark", caption: "Rework Remark", visible: true, width: 200 },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },

                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
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
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: false,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },
                        { dataField: "CancelledDate" },
                        { dataField: "CancelledRemark", caption: "Reasons of Quote Failure", visible: true },


                    ]

                    break;
                case "IsMailSent":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="See History">').addClass('fa fa-history dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "History");
                                    }).appendTo(container);
                            }
                        },
                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        }
                    ]

                    break;
                case "JobApproved":
                    cols = [
                        { dataField: "QuotationNo" },
                        { dataField: "EnquiryNo" },
                        { dataField: "ProjectName" },
                        { dataField: "ClientName" },
                        { dataField: "CreatedDate" },
                        { dataField: "SalesManager" },
                        { dataField: "SalesCordinator" },
                        { dataField: "SalesPerson", caption: 'Sales Executive' },
                        { dataField: "FreightAmount" },
                        { dataField: "Remark" },
                        { dataField: "EstimateBy" },
                        { dataField: "ApprovalSendTo" },
                        { dataField: "ApprovedDate" },

                        {
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Review Quote">').addClass('fa fa-eye dx-link')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, "Review");
                                    }).appendTo(container);
                            }
                        }, {
                            visible: false,
                            caption: "", fixedPosition: "right", fixed: true,
                            cellTemplate: function (container, options) {
                                $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                                    //                        .text('Revise')
                                    .on('dxclick', function () {
                                        QuotesLinkClick(options.data, false);
                                    }).appendTo(container);
                            }
                        },
                        { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },

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
        var url = "ProjectQuotationReportViewer.aspx?t=" + bid; //// "Print_Quotation.aspx?BN=" + document.getElementById("QuoteIDId").value + "&BookingNo=" + encodeURIComponent(document.getElementById("BookingNo").value);
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
        url: "WebServicePlanWindow.asmx/UpdateSendForIA",
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
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
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
            url: 'WebServicePlanWindow.asmx/GetBookingDataHistory',
            data: '{ID:' + JSON.stringify(rowData.EnquiryID) + '}',
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
                    { dataField: "QuotationNo" },
                    { dataField: "EnquiryNo" },
                    { dataField: "ProjectName" },
                    { dataField: "ClientName" },
                    { dataField: "CreatedDate" },
                    { dataField: "SalesManager" },
                    { dataField: "SalesCordinator" },
                    { dataField: "SalesPerson", caption: 'Sales Executive' },
                    { dataField: "FreightAmount" },
                    { dataField: "Remark" },
                    { dataField: "EstimateBy" },
                    { dataField: "ApprovalSendTo" },
                    { dataField: "IsSendInternalApproval" },
                    { dataField: "IsInternalApproved" },
                    { dataField: "IsSendRework" },
                    { dataField: "IsCancelled" },
                    { dataField: "IsSendForPriceApproval" },
                    { dataField: "IsPriceApproved" },
                    { dataField: "ApprovedDate" },
                    { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
                    { dataField: "ReworkDate" },
                    { dataField: "ReworkRemark", caption: "Rework Remark", visible: true, width: 200 },
                    { dataField: "CancelledDate" },
                    { dataField: "CancelledRemark", caption: "Reasons of Quote Failure", visible: true },

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
    var IsDirectPriceApproved = 0;
    var data = $("#selectStatus").dxRadioGroup('instance').option('value');
    var BKID = rowData.ProductEstimateID;
    if (data = "IsInternalApproved") {
        IsDirectApproved = 1
        IsDirectPriceApproved = 0
    } else {
        IsDirectApproved = 0
        IsDirectPriceApproved = 0
    }
    if (data = "pendingforpriceapproval") {
        IsDirectPriceApproved = 1
        IsDirectApproved = 0
    }
    else {
        IsDirectPriceApproved = 0
        IsDirectApproved = 0
    }
    var Captitle = "";
    if (Flag === true) {
        Captitle = "Clone Quote Of: ";
    } else if (Flag === false) {
        Captitle = "Revise Quote No: ";
    } else if (Flag === "Review") {
        Captitle = "Review Quote No: ";
    }
    swal({
        title: Captitle + rowData.QuotationNo,
        text: "Are you sure to continue..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continue",
        closeOnConfirm: false
    },
        function () {
            window.location.href = "ProjectQuotation.aspx?BookingID=" + BKID + "&FG=" + Flag + "&IsDirectApproved=" + IsDirectApproved + "&IsDirectPriceApproved=" + IsDirectPriceApproved;
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