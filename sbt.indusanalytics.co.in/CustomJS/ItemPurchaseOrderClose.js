var optionpoclose = ["Open Purchase Orders", "Closed Purchase Orders"];
var Groupdata = "";

$(function () {
    $("#opt-poclose-radio").dxRadioGroup({
        items: optionpoclose,
        value: optionpoclose[0],
        layout: "horizontal"
    });
});
var poclosefilename = "";
var serviceUrl = "WebServiceItemPurchaseOrderClose.asmx/OpenPurchaseOrders";
$(function () {
    $("#opt-poclose-radio").dxRadioGroup({
        onValueChanged: function (e) {
            var previousValue = e.previousValue;
            var newValue = e.value;
            if (e.value === 'Open Purchase Orders') {
                serviceUrl = "WebServiceItemPurchaseOrderClose.asmx/OpenPurchaseOrders";
                poclosefilename = "Open Purchase Orders";
                Refreshpurchaseorders();
                $('#Btn_Update').text("Close Purchase Order");
            } else {
                serviceUrl = "WebServiceItemPurchaseOrderClose.asmx/ClosedPurchaseOrders";
                poclosefilename = "Closed Purchase Orders";
                Refreshpurchaseorders();
                $('#Btn_Update').text("Open Purchase Order");
            }
        }
    });
});

Refreshpurchaseorders();
function Refreshpurchaseorders() {
    try {

        //document.getElementById("LOADER").style.display = "block";
        //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        //alert("hello");
        $.ajax({
            type: "POST",
            url: serviceUrl,
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/:,/g, ':null,');
                res = res.replace(/:},/g, ':null},');
                res = res.replace(/u0026/g, "&");
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                // document.getElementById("LOADER").style.display = "none";
                // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var tt = JSON.parse(res);
                //var ObjUniqueData = [], ids = [];
                ////(e.PurchaseTransactionID == tt[i].PurchaseTransactionID && e.ItemID == tt[i].ItemID)
                //// --------------- Remove Duplicate data------------------------
                //$.each(tt, function (index, value) {
                //    if ($.inArray(value.PurchaseTransactionID, ids) === -1) {
                //        ids.push(value.PurchaseTransactionID);
                //        ObjUniqueData.push(value);
                //    }
                //});

                FillGrid(tt, tt);
            }
        });

    } catch (e) {
        alert(e);
    }
}
function FillGrid(purchasegrndata, purchasearray) {
    $("#gridpurchaseorders").dxDataGrid({
        dataSource: purchasearray,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        keyExpr: ["PurchaseTransactionID", "ItemID"],
        sorting: {
            mode: "multiple"
        },
        selection: { mode: "multiple", showCheckBoxesMode: "always" },
        paging: {
            pageSize: 50
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [50, 100, 250, 1000]
        },
        height: function () {
            return window.innerHeight / 1.2;
        },
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: true },
        headerFilter: { visible: true },
        //rowAlternationEnabled: true,
        searchPanel: { visible: true },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: true,
            fileName: poclosefilename,
            allowExportSelectedData: true
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        //focusedRowEnabled: true,
        onSelectionChanged: function (clickedCell) {
            Groupdata = clickedCell.selectedRowsData;
        },
        columns: [
            { dataField: "VoucherNo", visible: true, caption: "P.O. No.", width: 100 },
            { dataField: "VoucherDate", visible: true, caption: "P.O. Date", width: 80 },
            { dataField: "LedgerName", visible: true, caption: "Supplier Name", width: 180 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Type", width: 100 },
            { dataField: "ItemSubGroupName", visible: true, caption: "ItemSubGroupName", width: 100 },
            { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
            { dataField: "ItemName", visible: true, caption: "Item Name", width: 180 },
            { dataField: "PurchaseQuantity", visible: true, caption: "P.O. Qty", width: 80 },
            {
                dataField: "ReceiptQty", visible: true, caption: "Receipt Qty", width: 100,
                format: {
                    type: "fixedPoint",
                    precision: 3
                },
                calculateCellValue: function (e) {
                    //var qty = Number(e.ReceiptQty);
                    //if (e.ConversionFormula !== "" && e.ConversionFormula !== null) {
                    //    if (Number(e.UnitPerPacking) > 0) {
                    //        qty = eval(e.ConversionFormula);
                    //    }
                    //}
                    //qty.toFixed(Number(e.UnitDecimalPlace));
                    return Number(e.PurchaseQuantity) - Number(e.PendingToReceiveQty);
                }
            },
            {
                dataField: "PendingToReceiveQty", visible: true, caption: "Pending Qty", width: 100,
                format: {
                    type: "fixedPoint",
                    precision: 3
                },
                //calculateCellValue: function (e) {
                //    var poqty = Number(e.PurchaseOrderQuantity);
                //    var receiptqty = Number(e.ReceiptQty);
                //    if (e.ConversionFormula !== "" && e.ConversionFormula !== null) {
                //        if (Number(e.UnitPerPacking) > 0) {
                //            receiptqty = eval(e.ConversionFormula);
                //        }
                //    }
                //    var pendingqty = Number(poqty - receiptqty);
                //    return pendingqty.toFixed(Number(e.UnitDecimalPlace));
                //}
            },
            { dataField: "PurchaseUnit", visible: true, caption: "Purchase Unit", width: 100 },
            { dataField: "ReceiptQuantity", visible: false, caption: "ReceiptQuantity", width: 100 },
            { dataField: "StockUnit", visible: false, caption: "UOM", width: 120 },
            { dataField: "ExpectedDeliveryDate", visible: false, caption: "Expec.Del.Date", width: 120 },
            { dataField: "PurchaseDivision", visible: true, caption: "Purchase Division", width: 140 },
            { dataField: "PurchaseReferenceRemark", visible: true, caption: "Purchase Ref.", width: 100 },
            { dataField: "Narration", visible: true, caption: "Remark", width: 200 },
            { dataField: "CreatedBy", visible: true, caption: "Created By", width: 100 },
            { dataField: "ApprovedBy", visible: true, caption: "Approved By", width: 100 },
            { dataField: "FYear", visible: false, caption: "F Year", width: 120 },
            { dataField: "WtPerPacking", visible: false, caption: "WtPerPacking", width: 120 },
            { dataField: "UnitPerPacking", visible: false, caption: "UnitPerPacking", width: 120 },
            { dataField: "ConversionFactor", visible: false, caption: "ConversionFactor", width: 120 },
            { dataField: "UnitDecimalPlace", visible: false, caption: "UnitDecimalPlace", width: 120 }
            //{ dataField: "IsDisplay", visible: true, caption: "IsDisplay", width: 120 },

            // { dataField: "ChargeApplyOnSheets", visible: true, caption: "ChargeApplyOnSheets", width: 120 },
        ],
        //masterDetail: {
        //    enabled: true,
        //    template: function (container, options) {
        //        var currentpurchaseorderData = options.data;

        //        $("<div>")
        //            .addClass("master-detail-grid-caption")
        //            .text(currentpurchaseorderData.VoucherNo + " - " + currentpurchaseorderData.VoucherDate + "")
        //            .appendTo(container);

        //        $("<div>")
        //            .dxDataGrid({
        //                //dataSource: purchasegrndata,
        //                columnAutoWidth: true,
        //                showBorders: true,
        //                showRowLines: true,
        //                allowColumnReordering: true,
        //                allowColumnResizing: true,
        //                columnResizingMode: "widget",
        //                keyExpr: ["PurchaseTransactionID", "ItemID"],
        //                selection: { mode: "single" },
        //                paging: {
        //                    pageSize: 15
        //                },
        //                pager: {
        //                    showPageSizeSelector: true,
        //                    allowedPageSizes: [15, 25, 50, 100]
        //                },
        //                loadPanel: {
        //                    enabled: true,
        //                    height: 90,
        //                    width: 200,
        //                    text: 'Data is loading...'
        //                },
        //                onRowPrepared: function (e) {
        //                    if (e.rowType === "header") {
        //                        e.rowElement.css('background', '#42909A');
        //                        e.rowElement.css('color', 'white');
        //                        e.rowElement.css('font-weight', 'bold');
        //                    }
        //                    e.rowElement.css('fontSize', '11px');
        //                },
        //                columns: [
        //                    { dataField: "LedgerName", visible: false, caption: "Supplier Name", width: 180 },
        //                    { dataField: "ItemGroupName", visible: true, caption: "Item Group" },
        //                    { dataField: "ItemSubGroupName", visible: true, caption: "Sub Group Name" },
        //                    { dataField: "ItemCode", visible: true, caption: "Item Code", width: 80 },
        //                    { dataField: "ItemName", visible: true, caption: "Item Name" },
        //                    { dataField: "PurchaseOrderQuantity", visible: false, caption: "P.O. Qty" },
        //                    { dataField: "ReceiptQty", visible: false, caption: "Receipt Qty" },
        //                    { dataField: "PendingQuantity", visible: false, caption: "Pending Qty" },
        //                    { dataField: "PurchaseUnit", visible: false, caption: "Purchase Unit", width: 80 },
        //                    { dataField: "GRNNo", visible: true, caption: "GRN No." },
        //                    { dataField: "GRNDate", visible: true, caption: "GRN Date" },
        //                    { dataField: "ReceiptQuantity", visible: true, caption: "Receipt Qty" },
        //                    { dataField: "StockUnit", visible: true, caption: "Stock Unit" },
        //                    { dataField: "BatchNo", visible: true, caption: "Batch No." },
        //                    { dataField: "ExpectedDeliveryDate", visible: false, caption: "Expec.Del.Date", width: 100 },
        //                    { dataField: "PurchaseDivision", visible: false, caption: "Division" },
        //                    { dataField: "PurchaseReferenceRemark", visible: false, caption: "PO Reference" },
        //                    { dataField: "Narration", visible: false, caption: "Remark" },
        //                    { dataField: "CreatedBy", visible: false, caption: "Created By" },
        //                    { dataField: "ApprovedBy", visible: false, caption: "Approved By" }
        //                ],
        //                dataSource: new DevExpress.data.DataSource({
        //                    store: new DevExpress.data.ArrayStore({
        //                        key: ["PurchaseTransactionID", "ItemID"],
        //                        data: purchasegrndata
        //                    }),
        //                    filter: [
        //                        ["PurchaseTransactionID", "=", options.key.PurchaseTransactionID],
        //                        "and",
        //                        ["ItemID", "=", options.key.ItemID],
        //                        "and",
        //                        ["ReceiptQuantity", ">", 0]
        //                    ]
        //                })
        //            }).appendTo(container);
        //    }
        //}
    });
}

$("#Btn_Update").click(function () {
    UpdateData();
});

function UpdateData() {

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    if (Groupdata.length <= 0) {
        DevExpress.ui.notify("Please choose data from given above Grid..!", "error", 1000);
        return false;
    }

    for (var e = 0; e < Groupdata.length; e++) {
        OperationRecordDetail = {};
        OperationRecordDetail.TransactionID = Groupdata[e].PurchaseTransactionID;
        OperationRecordDetail.ItemID = Groupdata[e].ItemID;
        //OperationRecordDetail.VoucherID = -11;
        //OperationRecordDetail.FYear = Groupdata[e].FYear;

        jsonObjectsRecordDetail.push(OperationRecordDetail);
    }

    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: false
    },
        function () {

            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebServiceItemPurchaseOrderClose.asmx/UpdateData",
                data: '{BtnText:' + JSON.stringify(document.getElementById("Btn_Update").innerText.trim()) + ',jsonObjectsRecordDetail:' + JSON.stringify(jsonObjectsRecordDetail) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);

                    document.getElementById("LOADER").style.display = "none";
                    if (res === "Success") {
                        swal("Updated!", "Your data Updated", "success");
                        location.reload();
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });

        });

}
