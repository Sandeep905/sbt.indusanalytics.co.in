"use strict";

var GBLContents = []
let selectedTabId = 0;
$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: 'Loading...',
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#datagrid").dxDataGrid({
    keyExpr: 'ProductEstimateID',
    dataSource: [],
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
        return
        //if (selOption !== "All") return;
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


        }
    },



});
function Homequery(selectedTabId) {


    $.ajax({
        type: 'post',
        url: 'WebServiceOthers.asmx/Homequery',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{TabID:' + Number(selectedTabId) + '}',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            console.log(RES1);

            // Assigning values to labels
            document.getElementById("TotalEnquiry").innerHTML = RES1[0].TotalEnquiry;
            document.getElementById("PendingEnquiry").innerHTML = RES1[0].PendingEnquiry;
            document.getElementById("ConvertedEnquiry").innerHTML = RES1[0].ConvertEnquiry;
            document.getElementById("RejectedEnquiry").innerHTML = RES1[0].RejectedEnquiry;
            document.getElementById("AllQuotes").innerHTML = RES1[0].AllQuotes;
            document.getElementById("NewQuotes").innerHTML = RES1[0].NewQuotes;
            document.getElementById("PenndingForIA").innerHTML = RES1[0].PenndingForIA;
            document.getElementById("InternalApproved").innerHTML = RES1[0].InternalApproved;
            document.getElementById("Rejected").innerHTML = RES1[0].Rejected;
            document.getElementById("PenndingForPA").innerHTML = RES1[0].PenndingForPA;
            document.getElementById("Rework").innerHTML = RES1[0].Rework;
            document.getElementById("CostApproved").innerHTML = RES1[0].CostApproved;
            document.getElementById("SalesOrder").innerHTML = RES1[0].SalesOrder;
            document.getElementById("JobCard").innerHTML = RES1[0].JobCard;

            const dataSource1 = [
                //{ data: 'TotalEnquiry', value: RES1[0].TotalEnquiry },
                { data: 'PendingEnquiry', value: RES1[0].PendingEnquiry },
                { data: 'ConvertedEnquiry', value: RES1[0].ConvertEnquiry },
                { data: 'RejectedEnquiry', value: RES1[0].RejectedEnquiry },
            ];

            const dataSource2 = [
                //{ data: 'AllQuotes', value: RES1[0].AllQuotes },
                { data: 'NewQuotes', value: RES1[0].NewQuotes },
                { data: 'PenndingForIA', value: RES1[0].PenndingForIA },
                { data: 'InternalApproved', value: RES1[0].InternalApproved },
                { data: 'Rework', value: RES1[0].Rework },
                { data: 'Rejected', value: RES1[0].Rejected },
                { data: 'PenndingForPA', value: RES1[0].PenndingForPA },
                { data: 'CostApproved', value: RES1[0].CostApproved },
            ];

            // Update the first pie chart (with ID "pie") using dataSource1
            $('#pie').dxPieChart({
                size: {
                    width: 500,
                },
                palette: 'bright',
                dataSource: dataSource1,
                series: [
                    {
                        argumentField: 'data',
                        valueField: 'value',
                        label: {
                            visible: true,
                            connector: {
                                visible: true,
                                width: 1,
                            },
                        },
                    },
                ],
                title: 'Enquiries',
                export: {
                    enabled: true,
                },
                onPointClick(e) {
                    const point = e.target;
                    toggleVisibility(point);
                },
                onLegendClick(e) {
                    const arg = e.target;
                    toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
                },
            });

            // Update the second pie chart (with ID "pie2") using dataSource2
            $('#pie2').dxPieChart({
                size: {
                    width: 500,
                },
                palette: 'bright',
                dataSource: dataSource2,
                series: [
                    {
                        argumentField: 'data',
                        valueField: 'value',
                        label: {
                            visible: true,
                            connector: {
                                visible: true,
                                width: 1,
                            },
                        },
                    },
                ],
                title: 'Quotation',
                export: {
                    enabled: true,
                },
                onPointClick(e) {
                    const point = e.target;
                    toggleVisibility(point);
                },
                onLegendClick(e) {
                    const arg = e.target;
                    toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
                },
            });

            function toggleVisibility(item) {
                if (item.isVisible()) {
                    item.hide();
                } else {
                    item.show();
                }
            }

        },
        error: function errorFunc(jqXHR) {
            // Handle error
        }
    });

}


Homequery(1);
const tabs = [
    {
        id: 0,
        text: 'All Time',

    },
    {
        id: 1,
        text: 'Today',

    },
    {
        id: 7,
        text: 'Last 7 days',

    },
    {
        id: 30,
        text: 'Last 30 days',
        icon: 'fa fa-calendar',
    },
];

const tabsInstance = $('#tabs > .tabs-container').dxTabs({
    dataSource: tabs,
    selectedIndex: 1,
    onItemClick(e) {
        //selectBox.option('value', e.itemData.id);
        selectedTabId = e.itemData.id;

        document.getElementById('dashname').innerText = e.itemData.text + "'s dashboard";

        Homequery(selectedTabId)
    }
     
}).dxTabs('instance');







//////////////////////////////////////////////////////////////////////OpenPopup///////////////////////////////////////////////////////////////////////////

function AllDetails(id) {
    var FilterSTR = ''
    document.getElementById('exampleModalLabel').innerText = id


    var timecon = `And PQ.CreatedDate >= DateAdd(Day, -${selectedTabId}, GETDATE())`

    if (selectedTabId == 0) timecon = "";
    if (id === "AllQuotes") {
        //dataGrid.clearFilter();
        FilterSTR = timecon
    } else if (id === "NewQuotes") {
        FilterSTR = " And PQ.IsSendForInternalApproval=0 And PQ.IsInternalApproved=0 And PQ.IsCancelled=0 And PQ.IsRework=0 And PQ.IsApproved=0 " + timecon;
    } else if (id === "PenndingForIA") {
        FilterSTR = " And PQ.IsSendForInternalApproval=1 And PQ.IsInternalApproved=0 And PQ.IsCancelled=0 And PQ.IsRework=0 And PQ.IsApproved=0 " + timecon;

    } else if (id === "InternalApproved") {

        FilterSTR = " And PQ.IsInternalApproved=1 And PQ.IsCancelled=0 and PQ.IsApproved =0 " + timecon;
    } else if (id === "PenndingForPA") {
        FilterSTR = " And PQ.IsInternalApproved=1 And PQ.IsCancelled=0 And PQ.IsSendForPriceApproval=1 and Isnull(PQ.Isapproved,0) <> 1 " + timecon;
    } else if (id === "Rejected") {
        FilterSTR = " And PQ.IsCancelled= 1  " + timecon
    } else {
        FilterSTR = " And PQ.isrework= 1  " + timecon
    }

    if (id === "CostApproved") {
        FilterSTR = " And PQ.IsApproved = 1 " + timecon
    }
    $.ajax({
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetBookingdashboarddata',
        data: '{FilterSTR: ' + JSON.stringify(FilterSTR) + '}',
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
            switch (id) {
                case "AllQuotes":
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

                    ]
                    break;
                case "PenndingForIA":
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

                    ]
                    break;
                case "InternalApproved":
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

                    ]

                    break;
                case "PenndingForPA":
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

                    ]

                    break;
                case "Rework":
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

                    ]
                    break;
                case "Rejected":
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
                        { dataField: "CancelledDate" },
                        { dataField: "CancelledRemark", caption: "Reasons of Quote Failure", visible: true },


                    ]

                    break;
                case "Rejected":
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
                    ]

                    break;
                case "CostApproved":
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
                        { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },

                    ]

                    break;

                default:
                // code block
            }
            $("#datagrid").dxDataGrid({
                dataSource: RES1.Projects,
                columns: cols

            });


            OpenPopup(id, '#AllTime');


        },
        error: function errorFunc(jqXHR) {
            //DevExpress.ui.notify(jqXHR.statusText, "error", 500);
        }
    });
}
function OpenPopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-toggle", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}
//EnqueryData
$("#Enquerydatagrid").dxDataGrid({
    dataSource: [],
    keyExpr: 'EnquiryID',
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    filterRow: { visible: true },
    columns: [
        { dataField: "EnquiryNo", caption: "Enquiry No", width: 180 },
        { dataField: "ProjectName", caption: "Project Name", width: 180 },
        { dataField: "LedgerName", caption: "Client" },
        { dataField: "SalesLedgerName", caption: "Sales Person" },
        { dataField: "ProductName", caption: "Content Name" },
        { dataField: "ProductName1", caption: "Product Name", width: 180 },
        { dataField: "Quantity", caption: "Quantity" },
        { dataField: "CreatedBy", caption: "Created By" },
        { dataField: "CreatedDate", caption: "Created Date" }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.6;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    //onSelectionChanged: function (selectedItems) {
    //    var data = selectedItems.selectedRowsData;
    //    if (data.length > 0) {
    //        document.getElementById("BookingID").value = data[0].EnquiryID;
    //    }
    //}
});



function EnquiryDetails(id) {
    alert("Under Development")
    return;
    var Isprocessed = ''

    document.getElementById('EnqueryexampleModalLabel').innerText = id

    var timecon = `And PQ.CreatedDate >= DateAdd(Day, -${selectedTabId}, GETDATE())`

    if (selectedTabId == 0) timecon = "";
    if (id === "TotalEnquiry") {
        //dataGrid.clearFilter();
     //   FilterSTR = timecon
    } else if (id === "PendingEnquiry") {
        Isprocessed = 0
        timecon += " AND  PQ.CreatedDate < DATEADD(day, -15, GETDATE())";  
    } else if (id === "ConvertedEnquiry") {
        Isprocessed=1
    } else if (id === "RejectedEnquiry") {
        Isprocessed = -1;
    }


    try {
        $.ajax({
            type: "POST",
            url: "WebServiceProductMaster.asmx/Enquerydatagrid",
            data: '{Isprocessed: ' + Number(Isprocessed) + ',FilterSTR: ' + JSON.stringify(timecon) + '}',
       
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
               
                $("#Enquerydatagrid").dxDataGrid({
                    dataSource: RES1
                });
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    } finally {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
    $("#Enquerydatagrid").dxDataGrid({
        dataSource: [],
        //columns: cols

    });


    OpenPopup(id, '#EnqueryTime');

 

}


function OpenPopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-toggle", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}
