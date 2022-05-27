"use strict";
var BKID = 0, BKNo = "";

var statuses = ["Pending For Approval", "Internal Approved", "Rework"];
$("#radioFilterOptions").dxRadioGroup({
    dataSource: statuses,
    value: statuses[0],
    layout: "horizontal",
    onValueChanged: function (data) {
        BKID = 0;
        if (data.value === "Pending For Approval") {
            refreshGrid(0);
            $("#SelectStatus").dxSelectBox({
                items: ["Approve", "Rework", "Reject"]
            });
        } else if (data.value === "Internal Approved") {
            refreshGrid(1);
            $("#SelectStatus").dxSelectBox({
                items: ["Rework", "Reject"]
            });
        } else if (data.value === "Rework") {
            refreshGrid(2);
            $("#SelectStatus").dxSelectBox({
                items: ["Approve"]
            });
        }
        //else if (data.value === "Rejected") {
        //    refreshGrid(3);
        //    $("#SelectStatus").dxSelectBox({
        //        items: ["Approve", "Rework"]
        //    });
        //}
    }
});

$("#SelectStatus").dxSelectBox({
    items: ["Approve", "Rework", "Reject"],
    placeholder: "Select Status",
    showClearButton: true
}).dxValidator({
    validationRules: [{ type: 'required' }]
});

refreshGrid(0);
function refreshGrid(val) {
    try {
        $.ajax({
            type: 'post',
            url: 'WebServiceOthers.asmx/GetInternalApprovalData',
            data: '{types:' + val + '}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/u0026/g, ' & ');
                res = res.substr(1);
                res = res.slice(0, -1);
                if (res === "[]") {
                    DevExpress.ui.notify("No data founds..!", "warning", 1000);
                    $("#GridData").dxDataGrid({
                        dataSource: []
                    });
                    return false;
                }
                var RES1 = JSON.parse(res);
                if (RES1.length < 1) {
                    DevExpress.ui.notify("No data found..!", "warning", 1000);
                }
                var usercaption = "";
                var columns;
                if (val === 0) {
                    usercaption = "Quote By";
                } else if (val === 1) {
                    usercaption = "Int.Approval By";
                } else if (val === 2) {
                    usercaption = "Rework By";
                } else if (val === 3) {
                    usercaption = "Cancelled By";
                }
                columns = [{ dataField: "ClientName", caption: "Client Name", width: 180 }, { dataField: "CategoryName", caption: "Category Name" },
                { dataField: "JobName", caption: "Job Name", width: 200 }, { dataField: "BookingNo", caption: "Quote No" },
                { dataField: "CreatedDate", caption: "Quote Date" }, { dataField: "OrderQuantity", caption: "Order Qty" },
                { dataField: "QuotedCost", caption: "Quoted Cost" }, { dataField: "FinalCost", caption: "Cost" },
                { dataField: "TypeOfCost", caption: "Unit" }, { dataField: "RemarkInternalApproved", caption: "Int.Approval Remak" }, { dataField: "Remark", caption: "Quote Remark" },
                { dataField: "ReworkRemark", caption: "Rework Remark" }, { dataField: "UserName", caption: usercaption }, { dataField: "InternalApprovedDate", caption: "Approval Date" }, { dataField: "EnquiryID", caption: "Enquiry No", visible: false }];

                $("#GridData").dxDataGrid({
                    dataSource: RES1,
                    columns: columns
                });
            }
        });
    } catch (e) {
        //alert(e);
    }
}

$("#GridData").dxDataGrid({
    "export": {
        enabled: true,
        fileName: "Quotes",
        allowExportSelectedData: true
    },
    allowColumnReordering: true,
    allowColumnResizing: true,
    showRowLines: true,
    filterRow: { visible: true },
    showBorders: true,
    loadPanel: {
        enabled: false
    },
    selection: { mode: "single" },
    sorting: { mode: 'multiple' },
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    columnAutoWidth: true,
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    //columns: [{ dataField: "ClientName", caption: "Client Name", width: 180 }, { dataField: "CategoryName", caption: "Category Name" },
    //{ dataField: "JobName", caption: "Job Name", width: 200 }, { dataField: "BookingNo", caption: "Quote No" },
    //{ dataField: "CreatedDate", caption: "Quote Date", dataType: "date" }, { dataField: "OrderQuantity", caption: "Order Qty" },
    //{ dataField: "UserName", caption: "Quote By" }, { dataField: "QuotedCost", caption: "Quoted Cost" }, { dataField: "FinalCost", caption: "Cost" },
    //{ dataField: "TypeOfCost", caption: "Unit" }, { dataField: "InternalApprovedBy", caption: "Int.Approval By" }, { dataField: "RemarkInternalApproved", caption: "Int.Approval Remak" },
    //{ dataField: "ReworkBy", caption: "Rework By" }, { dataField: "ReworkRemark", caption: "Rework Remark" }, { dataField: "EnquiryID", caption: "Enquiry No", visible: false }],
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            BKID = data[0].BookingID;
            BKNo = data[0].BookingNo;
        } else {
            BKID = 0; BKNo = "";
        }
    }
});

$("#BtnReviewQuote").click(function () {
    if (BKID <= 0 || BKID === null || BKID === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "DYnamicQty.aspx?BookingID=" + BKID + "&FG=Review";
        window.open(url, "_blank", "", true);
    }
});

$("#BtnPrintJobDetails").click(function () {
    if (BKID <= 0 || BKID === null || BKID === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "ReportQuotation.aspx?BookingID=" + BKID;  //"Print_Quotation.aspx?BN=" + BKID + "&BookingNo=" + encodeURIComponent(BKNo);
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
    }
});

$("#BtnPrintCosting").click(function () {
    if (BKID <= 0 || BKID === null || BKID === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "ReportDetailCosting.aspx?BN=" + BKID;
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
    }
});

$("#BtnUpdate").click(function () {
    if (BKID <= 0 || BKID === null || BKID === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
        return;
    }
    var SelectStatus = $("#SelectStatus").dxSelectBox("instance").option('value');
    var radioFilterOptions = $("#radioFilterOptions").dxRadioGroup("instance").option('value');
    var UpdateRemark = document.getElementById("TxtRemarks").value.trim();
    $("#SelectStatus").dxValidator('instance').validate();
    if (SelectStatus === "" || SelectStatus === null || SelectStatus === undefined) {
        swal("Status Not Selected", "Please select status for update...!", "warning");
        return;
    }
    if (UpdateRemark === "" || UpdateRemark === null || UpdateRemark === undefined) {
        swal("Reason Of Update", "Please enter reason if not available enter NA...!", "warning");
        document.getElementById("TxtRemarks").focus();
        return;
    }
    var objArr = {};
    var objUdt = [];

    if (radioFilterOptions === "Pending For Approval") {
        objArr.type = 0;
    } else if (radioFilterOptions === "Intenal Approved") {
        objArr.type = 1;
    } else if (radioFilterOptions === "Rework") {
        objArr.type = 2;
    }
    objArr.status = SelectStatus;
    objArr.remarks = UpdateRemark;
    objArr.BKID = BKID;
    objArr.BKNo = BKNo;
    objUdt.push(objArr);

    try {
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/InternalApprovalUpdateStatus",
            data: '{ObjJSJson:' + JSON.stringify(objUdt) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                if (res === "Success") {
                    DevExpress.ui.notify(res, "success", 1500);
                } else
                    DevExpress.ui.notify(res, "warning", 1500);
                location.reload();
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
});
