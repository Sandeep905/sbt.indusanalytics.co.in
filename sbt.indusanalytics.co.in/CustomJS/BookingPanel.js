"use strict";
var LedgerID = 0;

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

var toolTip = $("#tooltip").dxTooltip({
}).dxTooltip("instance");

try {

    var showDetails = function (RES1) {

        $("#GridBooingPanel").dxDataGrid({
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
            filterRow: { visible: true },
            showBorders: true,
            loadPanel: {
                enabled: true,
                text: 'Data is loading...'
            },
            selection: { mode: "multiple", showCheckBoxesMode: "always", allowSelectAll: false },
            sorting: { mode: 'multiple' },
            height: function () {
                return window.innerHeight / 1.25;
            },
            columnAutoWidth: true,
            onContextMenuPreparing: function (e) {
                if (e.target === "content" && e.column) {
                    // e.items can be undefined
                    if (!e.items) e.items = [];

                    // Add a custom menu item
                    e.items.push({
                        text: "Review",
                        onItemClick: function () {
                            QuotesLinkClick(e.row.key, "Review");
                        }
                    });
                    e.items.push({
                        text: "Revise",
                        onItemClick: function () {
                            QuotesLinkClick(e.row.key, false);
                        }
                    });
                    e.items.push({
                        text: "Clone",
                        onItemClick: function () {
                            QuotesLinkClick(e.row.key, true);
                        }
                    });
                    e.items.push({
                        text: "Delete",
                        onItemClick: function () {
                            deleteQuotationDetails(e.row.key);
                        }
                    });
                    if (e.row.key.IsInternalApproved === false) return;
                    e.items.push({
                        text: "Print",
                        onItemClick: function () {
                            if (e.row.key.BookingID <= 0) return;
                            var url = "QuotePreview.aspx?BKID=" + e.row.key.BookingID;///ReportQuotation.aspx?BookingID
                            window.open(url, "_blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
                        }
                    });
                }
            },
            onRowPrepared: function (e) {
                setDataGridRowCss(e);
                if (e.rowType === "data") {
                    if (e.data.JobApproved === true) {
                        e.rowElement.addClass('jobapproved');
                    }
                    else if (e.data.IsSendForInternalApproval === false && e.data.IsInternalApproved === false && e.data.IsCancelled === false && e.data.IsRework === false) {
                        e.rowElement.addClass('newquotes');
                    }
                    else if (e.data.IsSendForInternalApproval === true && e.data.IsInternalApproved === false && e.data.IsCancelled === false && e.data.IsRework === false) {
                        e.rowElement.addClass('pendingforpriceapproval');
                    }
                    else if (e.data.IsMailSent === true) {
                        e.rowElement.addClass('ismailsent');
                    }
                    else if (e.data.IsInternalApproved === true) {
                        e.rowElement.addClass('isinternalapproved');
                    }
                    else if (e.data.IsRework === true) {
                        e.rowElement.addClass('isrework');
                    }
                    else if (e.data.IsCancelled === true) {
                        e.rowElement.addClass('iscancelled');
                    }

                    e.rowElement.mousemove(function () {
                        if (e.data.ReworkRemark !== null && e.data.ReworkRemark !== "" || (e.data.RemarkInternalApproved !== null && e.data.RemarkInternalApproved !== "")) {
                            $('#tooltipText').text("Rework Remark: '" + e.data.ReworkRemark + "',\nInternal Approval Remark: '" + e.data.RemarkInternalApproved + "'").addClass('font-12').css('white-space', 'pre');
                            toolTip.show(e.rowElement);
                        }
                    });
                }
            },
            columns: [{ dataField: "ClientName", caption: "Client Name", width: 180 }, { dataField: "CategoryName", caption: "Category Name" },
            { dataField: "JobName", caption: "Job Name", width: 200 }, { dataField: "BookingNo", caption: "Quote No" },
            { dataField: "CreatedDate", caption: "Date" }, { dataField: "OrderQuantity", caption: "Order Qty" },
            { dataField: "UserName", caption: "Quote By" }, { dataField: "QuotedCost", caption: "Quoted Cost" },
            { dataField: "TypeOfCost", caption: "Unit" },
            { dataField: "ProductCode", caption: "ArtWork Code" },
            { dataField: "EnquiryID", caption: "Enquiry No", visible: false }, { dataField: "ApprovalSendTo", caption: "Approval Send To", visible: true },
            { dataField: "InternalApprovedDate", caption: "IA Date" },
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
                            QuotesLinkClick(options.key, "Review");
                        }).appendTo(container);
                }
            }, {
                caption: "", fixedPosition: "right", fixed: true,
                cellTemplate: function (container, options) {
                    $('<a title="Revise Quote">').addClass('fa fa-edit dx-link')
                        //                        .text('Revise')
                        .on('dxclick', function () {
                            QuotesLinkClick(options.key, false);
                        }).appendTo(container);
                }
            },
            {
                caption: "", fixedPosition: "right", fixed: true,
                cellTemplate: function (container, options) {
                    $('<a title="Clone Quote">').addClass('customgridbtn fa fa-copy dx-link')
                        //.text('Clone')
                        .on('dxclick', function () {
                            QuotesLinkClick(options.key, true);
                            //this.href = "DYnamicQty.aspx?BookingID=" + options.key.BookingID + "&FG=true";
                        }).appendTo(container);
                }
            },
            {
                caption: "", fixedPosition: "right", fixed: true,
                cellTemplate: function (container, options) {
                    $('<a title="Print Quote">').addClass('fa fa-print dx-link customgridbtn')
                        .on('dxclick', function () {
                            if (options.key.BookingID <= 0 || options.key.IsInternalApproved === false) return;
                            //var url = "Print_Quotation.aspx?BN=" + options.key.BookingID + "&BookingNo=" + encodeURIComponent(options.key.BookingNo);
                            var url = "QuotePreview.aspx?BKID=" + options.key.BookingID;//ReportQuotation.aspx?BookingID
                            window.open(url, "_blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
                        }).appendTo(container);

                }
            },
                { dataField: "ReasonsofQuote", caption: "Reasons of Quote Failure", visible: false }, { dataField: "ReworkRemark", caption: "Rework Remark", visible: true, width: 200 },
            { dataField: "RemarkInternalApproved", caption: "IA Remark", visible: true },
            {
                caption: "", fixedPosition: "right", fixed: true, width: 30,
                cellTemplate: function (container, options) {
                    $('<div title="Delete Quote" style="color:red;">').addClass('fa fa-trash customgridbtn dx-link')
                        .on('dxclick', function () {
                            deleteQuotationDetails(options.key);
                        }).appendTo(container);

                }
            }],
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
                            return value.BookingID;
                        }).join(','));

                    $("#BookingNo").text(
                        $.map(data, function (value) {
                            return value.BookingNo;
                        }).join(','));
                }
            }
            ////summary: {
            ////    totalItems: [{
            ////        showInColumn: "ClientName",
            ////        column: "BookingID",
            ////        summaryType: "count"
            ////    }, {
            ////        showInColumn: "JobName",
            ////        column: "IsCancelled",
            ////        displayFormat: "Rejected Quotes: {0}",
            ////        summaryType: "sum"
            ////    }]
            ////}

            //onToolbarPreparing: function (e) {
            //    var dataGrid = e.component;
            //    e.toolbarOptions.items.unshift({
            ////        location: "before",
            ////        widget: "dxRadioGroup",
            ////        options: {
            ////            items: [{
            ////                value: "All",
            ////                text: "All Quotes"
            ////            }, {
            ////                value: "SendForApproval",
            ////                text: "Pending For Appproval"
            ////            }, {
            ////                value: "IsMailSent",
            ////                text: "Sent Quotes"
            ////            }, {
            ////                value: "IsInternalApproved",
            ////                text: "Intenal Appproved"
            ////            }, {
            ////                value: "JobApproved",
            ////                text: "Appproved"
            ////            }, {
            ////                value: "IsRework",
            ////                text: "Rework"
            ////            }, {
            ////                value: "IsCancelled",
            ////                text: "Rejected"
            ////            }],
            ////            displayExpr: "text",
            ////            valueExpr: "value",
            ////            layout: "horizontal",
            ////            value: "All",
            ////            itemTemplate: function (itemData, _, itemElement) {
            ////                itemElement
            ////                    .parent().addClass(itemData.value.toLowerCase())
            ////                    .text(itemData.text);
            ////            },
            ////            onValueChanged: function (data) {
            ////                if (data.value === "All") {
            ////                    dataGrid.clearFilter();
            ////                } else if (data.value === "IsInternalApproved") {
            ////                    dataGrid.clearFilter();
            ////                    dataGrid.filter([data.value, "=", 1], "or", ["IsCancelled", "=", 0], "or", ["PendingForPriceApproval", "=", 0]);
            ////                //} else if (data.value === "PendingForPriceApproval") {
            ////                //    dataGrid.clearFilter();
            ////                //    dataGrid.filter(["IsInternalApproved", "=", 0], "or", ["IsCancelled", "=", 0], "or", ["IsRework", "=", 0]);
            ////                } else
            ////                    dataGrid.filter([data.value, "=", 1]);
            ////            }
            ////        }
            ////    });
            ////}
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
            value: "PendingForApproval",
            text: "Pending For Internal Approval"
        }, {
            value: "IsInternalApproved",
            text: "Internal Approved"
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
            //var dataGrid = $("#GridBooingPanel").dxDataGrid('instance');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            document.getElementById("BtnSendForApproval").style.display = "none";
            document.getElementById("BtnDisApproval").style.display = "none";
            document.getElementById("BtnSendForInternalApproval").style.display = "none";
            document.getElementById("DivSendToUser").style.display = "none";
            document.getElementById("BtnDisInternalApproval").style.display = "none";

            var FilterSTR = "";
            if (data.value === "All") {
                //dataGrid.clearFilter();
                FilterSTR = data.value;
            } else if (data.value === "NewQuotes") {
                FilterSTR = " And IsSendForInternalApproval=0 And IsInternalApproved=0 And IsCancelled=0 And IsRework=0 And IsApproved=0 ";
                document.getElementById("BtnSendForInternalApproval").style.display = "block";
                document.getElementById("DivSendToUser").style.display = "block";
            } else if (data.value === "PendingForApproval") {
                //dataGrid.filter(["IsInternalApproved", "=", false], "or", ["IsCancelled", "=", 0], "or", ["IsRework", "=", 0], "or", ["JobApproved", "=", 0]);
                FilterSTR = " And IsSendForInternalApproval=1 And IsInternalApproved=0 And IsCancelled=0 And IsRework=0 And IsApproved=0 ";
                document.getElementById("BtnDisInternalApproval").style.display = "block";
            } else if (data.value === "IsInternalApproved") {
                document.getElementById("BtnSendForApproval").style.display = "block";
                //dataGrid.filter([data.value, "=", 1], "or", ["IsCancelled", "=", 0], "or", ["PendingForPriceApproval", "=", 0]);
                FilterSTR = " And IsInternalApproved=1 And IsCancelled=0 And IsSendForPriceApproval=0 ";
            } else {
                FilterSTR = " And " + data.value + "= 1 ";
                //dataGrid.filter([data.value, "=", 1]);
            }

            if (data.value === "JobApproved") {
                FilterSTR = " And IsApproved = 1 ";
                document.getElementById("BtnDisApproval").style.display = "block";
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
                    $("#GridBooingPanel").dxDataGrid({
                        dataSource: RES1
                    });
                },
                error: function errorFunc(jqXHR) {
                    //DevExpress.ui.notify(jqXHR.statusText, "error", 500);
                }
            });

        }
    });

    $("#selectStatus").dxRadioGroup({
        value: "NewQuotes"
    });
    showDetails([]);
} catch (e) {
    console.log(e);
}

$("#PrintButton").click(function () {
    // var bid = document.getElementById("txtBookingID").value;
    var bid = document.getElementById("QuoteIDId").value;

    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "QuotePreview.aspx?BKID=" + bid; //// "Print_Quotation.aspx?BN=" + document.getElementById("QuoteIDId").value + "&BookingNo=" + encodeURIComponent(document.getElementById("BookingNo").value);
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
    var BKID = ObjBK.BookingID;
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
    var BKID = rowData.BookingID;

    var Captitle = "";
    if (Flag === true) {
        Captitle = "Clone Quote Of: ";
    } else if (Flag === false) {
        Captitle = "Revise Quote No: ";
    } else if (Flag === "Review") {
        Captitle = "Review Quote No: ";
    }
    swal({
        title: Captitle + rowData.BookingNo,
        text: "Are you sure to continue..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continue",
        closeOnConfirm: false
    },
        function () {
            window.location.href = "DYnamicQty.aspx?BookingID=" + BKID + "&FG=" + Flag + "";
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