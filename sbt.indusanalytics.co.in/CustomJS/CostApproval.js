"use strict";

var GblBookingIDSelect, GblApprovalNo, GblTypeOfCost = "";
var OBJ_Grid = [];
var FlagEdit = false;
var GBLContents = [];
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

$.ajax({
    type: "POST",
    url: "WebServiceOthers.asmx/CostApprovalEnquiryNo",
    data: '{}',//BookingID:' + BookingID + '
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/d":"/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        let RES1 = JSON.parse(res.toString());
        GblApprovalNo = RES1;
        document.getElementById("APPNo").value = RES1;
    }
});



$("#BtnLoadBooking").click(function () {

    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("BtnLoadBooking").style.borderColor = '';
    var BtnLoad = document.getElementById('BtnLoad');

    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/CostApprovalQuoteLoad",
        data: '{}',//BookingID:' + BookingID + '
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, ' & ');
            res = res.substr(1);
            res = res.slice(0, -1);
            let RES1 = JSON.parse(res.toString());
            const Gbl_Columns = [
                { dataField: "QuotationNo" },
                { dataField: "Quotationdate" },
                { dataField: "EnquiryNo" },
                { dataField: "Enquirydate" },
                { dataField: "ProjectName" },
                { dataField: "ClientName" },
                { dataField: "SalesPerson" },
                { dataField: "FreightAmount" },
                { dataField: "MiscAmount" },
                { dataField: "ShippingCost" },
                { dataField: "GSTAmount" },
                { dataField: "FinalAmount" },
                { dataField: "ProfitCost" },
                { dataField: "Remark" },
                { dataField: "EstimateBy" },
            ];
            GBLContents = RES1.Contents;
            $("#GridLoadBooking").dxDataGrid({
                dataSource: RES1.Projects,
                columns: Gbl_Columns
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
    hidedetailsContainer();
    BtnLoad.onclick = function () {
        if (OBJ_Grid.length <= 0) {
            DevExpress.ui.notify("Data not selected", "warning", 1000);
            return;
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        FlagEdit = false;
        //GblTypeOfCost = "";
        GblBookingIDSelect = Number(OBJ_Grid[0].ProductEstimateID);
        document.getElementById("BookingNo").value = Number(OBJ_Grid[0].QuotationNo);
        Fill_Job_Details_Grid();
        Grid_Data_For_Approval_Window();
        //BtnLoad.setAttribute("data-dismiss", "modal");
        showdetailsContainer();
    };
});

$("#BtnShowListCostApp").click(function () {

    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    var BtnLoad = document.getElementById('BtnLoad');

    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/CostApprovalShowlist",
        data: '{}',//BookingID:' + BookingID + '
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = results.replace(/"{"d":null/g, '');
            res = res.replace(/u0026/g, ' & ');
            res = res.substr(1);
            res = res.slice(0, -1);
            res = res.replace(/\\/g, '');
            let RES1 = JSON.parse(res.toString());
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            const Gbl_Columns = ["ApprovalNo", { dataField: "PriceApprovedDate", caption: "Approval Date" }, "ClientName", { dataField: "JobName", caption: "Job Name", width: 180 }, { dataField: "BookingNo", caption: "Quote No" }, { dataField: "JobDate", caption: "Quote Date" }, "ProductCode", "OrderQuantity", { dataField: "FinalCost", caption: "Approved Price" },
                { dataField: "UserName", caption: "Quote By" }, "Remark", { dataField: "PhoneNo", visible: false }, { dataField: "Address", visible: false },
                { dataField: "LedgerID", visible: false }, { dataField: "BookingID", visible: false }, { dataField: "BookingRemark", visible: false },
                { dataField: "AppliedDateFrom", visible: false }, { dataField: "AppliedDateTo", visible: false }, { dataField: "UserId", visible: false },
                { dataField: "LedgerID", visible: false }, { dataField: "CategoryID", visible: false }, { dataField: "RemarkJAP", visible: false }, { dataField: "ApprovalID", visible: false }];

            $("#GridLoadBooking").dxDataGrid({
                dataSource: RES1,
                columns: Gbl_Columns
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
    hidedetailsContainer();
    BtnLoad.onclick = function () {
        if (OBJ_Grid.length <= 0) {
            DevExpress.ui.notify("Data not selected", "warning", 1000);
            return;
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        FlagEdit = true;
        GblTypeOfCost = "";
        GblBookingIDSelect = Number(OBJ_Grid[0].BookingID);
        document.getElementById("BookingNo").value = Number(OBJ_Grid[0].BookingNo);
        Fill_Job_Details_Grid();
        Grid_Data_For_Approval_Window();
        //BtnLoad.setAttribute("data-dismiss", "modal");
        showdetailsContainer();
    };
});

$("#GridLoadBooking").dxDataGrid({
    keyExpr: 'ProductEstimateID',
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
    selection: { mode: 'single' },
    filterRow: { visible: true },
    rowAlternationEnabled: false,
    headerFilter: { visible: true },
    columns: [],
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
                        { dataField: "ProductName" },
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
    paging: {
        pageSize: 150
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [150, 250, 500, 1000]
    },
    height: function () {
        return window.innerHeight / 1.32;
    },
    onContentReady: function (e) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (data) {
        if (data) {
            OBJ_Grid = [];
            OBJ_Grid = data.selectedRowsData;
        } else
            OBJ_Grid = [];
    }
});

$("#ApprovalDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

function Fill_Job_Details_Grid() {

    var grid_Job = $('#GridJobDetails').dxDataGrid('instance');
    grid_Job.cellValue(0, 1, OBJ_Grid[0].ClientName);
    grid_Job.cellValue(1, 1, OBJ_Grid[0].Address1);
    grid_Job.cellValue(2, 1, OBJ_Grid[0].MobileNo);
    grid_Job.cellValue(3, 1, OBJ_Grid[0].ProjectName);
    grid_Job.cellValue(4, 1, OBJ_Grid[0].EnquiryNo);
    grid_Job.cellValue(5, 1, OBJ_Grid[0].Enquirydate);
    grid_Job.cellValue(6, 1, OBJ_Grid[0].QuotationNo);
    grid_Job.cellValue(7, 1, OBJ_Grid[0].Quotationdate);
    grid_Job.cellValue(8, 1, OBJ_Grid[0].SalesPerson);
    grid_Job.cellValue(9, 1, OBJ_Grid[0].Remark);

    grid_Job.saveEditData();

    document.getElementById("BookingID").value = OBJ_Grid[0].ProductEstimateID;
    document.getElementById("LID").value = OBJ_Grid[0].LedgerID;
    //document.getElementById("CategoryID").value = OBJ_Grid[0].CategoryID;

    if (FlagEdit === true) {
        //GblApprovalNo = OBJ_Grid[0].ApprovalNo;
        document.getElementById("APPNo").value = OBJ_Grid[0].ApprovalNo;
        document.getElementById("txtRemark").innerHTML = OBJ_Grid[0].RemarkJAP;
        $("#ApprovalDate").dxDateBox({
            pickerType: "rollers",
            displayFormat: 'dd-MMM-yyyy',
            value: OBJ_Grid[0].PriceApprovedDate,
            min: OBJ_Grid[0].PriceApprovedDate
        });
        //$("#DivFromDate").dxDateBox({
        //    value: OBJ_Grid[0].AppliedDateFrom,
        //    formatString: 'dd-MMM-yyyy'
        //});
        $("#DivToDate").dxDateBox({
            pickerType: "rollers",
            displayFormat: 'dd-MMM-yyyy',
            value: OBJ_Grid[0].AppliedDateTo,
            min: OBJ_Grid[0].PriceApprovedDate
        });
    }
    else {

        document.getElementById("APPNo").value = GblApprovalNo;
        document.getElementById("txtRemark").innerHTML = "";
        $("#ApprovalDate").dxDateBox({
            pickerType: "rollers",
            displayFormat: "dd-MMM-yyyy",
            value: new Date().toISOString().substr(0, 10),
            min: new Date().toISOString().substr(0, 10)
        });
        //$("#DivFromDate").dxDateBox({
        //    value: new Date().toISOString().substr(0, 10),
        //    formatString: 'dd-MMM-yyyy'
        //});
        $("#DivToDate").dxDateBox({
            pickerType: "rollers",
            displayFormat: "dd-MMM-yyyy",
            value: new Date().toISOString().substr(0, 10),
            min: new Date().toISOString().substr(0, 10)
        });
    }
}

function Grid_Data_For_Approval_Window() {

    //var Flag = JSON.stringify(FlagEdit);
    var grid_Costing = $('#GridApprovalWindow').dxDataGrid('instance');
    var grdcnt = grid_Costing.columnCount();
    for (var j = 2; j <= grdcnt; j++) {
        grid_Costing.deleteColumn(j);
    }
    grid_Costing.addColumn("Details");
    grid_Costing.cellValue(0, 1, OBJ_Grid[0].FinalAmount);
    grid_Costing.cellValue(1, 1, OBJ_Grid[0].MiscAmount);
    grid_Costing.cellValue(2, 1, OBJ_Grid[0].ProfitCost);
    grid_Costing.cellValue(3, 1, 0);
    grid_Costing.cellValue(4, 1, JSON.stringify(OBJ_Grid[0].GSTAmount));
    grid_Costing.cellValue(5, 1, OBJ_Grid[0].FinalAmount);
    grid_Costing.cellValue(6, 1, OBJ_Grid[0].FinalAmount);
    grid_Costing.cellValue(7, 1, OBJ_Grid[0].FinalAmount);
    grid_Costing.saveEditData();
    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    grid_Costing.refresh();

    //$.ajax({
    //    type: "POST",
    //    url: 'WebServiceOthers.asmx/GridDataForApprovalWindow',
    //    data: '{BookingID:' + GblBookingIDSelect + ',Flag:' + Flag + '}',
    //    contentType: 'application/json; charset=utf-8',
    //    dataType: 'text',
    //    success: function (results) {
    //        var res = results.replace(/\\/g, '');
    //        res = res.replace(/"d":""/g, '');
    //        res = res.replace(/"d":null/g, '');
    //        res = res.substr(1);
    //        res = res.slice(0, -3);
    //        let Table_Costing_Data = JSON.parse(res.toString());

    //        var sd = grid_Costing.columnCount();
    //        for (var p = 2; p <= sd; p++) {
    //            grid_Costing.deleteColumn(p);
    //        }
    //        if (Table_Costing_Data.length > 0) {
    //            document.getElementById("TxtCurrency").value = Table_Costing_Data[0].CurrencySymbol;
    //            document.getElementById("TxtCurrencyValue").value = Table_Costing_Data[0].ConversionValue;
    //        }
    //        for (var i = 0; i < Table_Costing_Data.length; i++) {
    //            var Qty = JSON.stringify(Table_Costing_Data[i].Quantity);
    //            grid_Costing.addColumn("" + Qty + "");
    //            var k = 1 + i;
    //            if (FlagEdit === false) {
    //                grid_Costing.cellValue(0, k, Table_Costing_Data[i].Total);
    //                grid_Costing.cellValue(1, k, Table_Costing_Data[i].MiscCost);
    //                grid_Costing.cellValue(2, k, Table_Costing_Data[i].Profit);
    //                grid_Costing.cellValue(3, k, Table_Costing_Data[i].DiscountAmount);
    //                grid_Costing.cellValue(4, k, Table_Costing_Data[i].TaxAmount);
    //                grid_Costing.cellValue(5, k, JSON.stringify(Table_Costing_Data[i].GrandTotal));
    //                grid_Costing.cellValue(6, k, Table_Costing_Data[i].UnitCost);
    //                grid_Costing.cellValue(7, k, Table_Costing_Data[i].UnitCost1000);
    //                grid_Costing.cellValue(8, k, Table_Costing_Data[i].FinalCost);
    //                grid_Costing.cellValue(9, k, Table_Costing_Data[i].QuotedCost);
    //                grid_Costing.cellValue(10, k, Table_Costing_Data[i].QuotedCost);
    //            }
    //            else {
    //                grid_Costing.cellValue(0, k, Table_Costing_Data[i].GrandTotal);
    //                grid_Costing.cellValue(1, k, Table_Costing_Data[i].MiscCost);
    //                grid_Costing.cellValue(2, k, Table_Costing_Data[i].Profit);
    //                grid_Costing.cellValue(3, k, Table_Costing_Data[i].DiscPercentage);
    //                grid_Costing.cellValue(4, k, Table_Costing_Data[i].TaxPercentage);
    //                grid_Costing.cellValue(5, k, JSON.stringify(Table_Costing_Data[i].GrandTotal));
    //                grid_Costing.cellValue(6, k, Table_Costing_Data[i].UnitCost);
    //                grid_Costing.cellValue(7, k, Table_Costing_Data[i].UnitCost1000);
    //                grid_Costing.cellValue(8, k, Table_Costing_Data[i].QuotedFinalCost);
    //                grid_Costing.cellValue(9, k, Table_Costing_Data[i].QuotedCost);
    //                grid_Costing.cellValue(10, k, Table_Costing_Data[i].FinalCost);
    //            }
    //        }
    //        grid_Costing.saveEditData();
    //        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    //        grid_Costing.refresh();
    //    },
    //    error: function errorFunc(jqXHR) {
    //        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    //        alert(jqXHR.message);
    //    }
    //});
}
var Row_No, Col_No;

//var GridCostAmtData = [{ "Quantity": "Total Cost" }, { "Quantity": "Misc.Cost" }, { "Quantity": "Profit % Cost" },
//{ "Quantity": "Discount % Cost" }, { "Quantity": "GST % Cost" }, { "Quantity": "Grand Total" },
//{ "Quantity": "Unit Cost" }, { "Quantity": "Unit Cost/1000" }, { "Quantity": "Approved Price" }, { "Quantity": "Quoted Cost" }];

var GridCostAmtData = [{ "Name": "Total Cost" }, { "Name": "Misc.Cost" }, { "Name": "Profit  Cost" },
{ "Name": "Discount  Cost" }, { "Name": "GST Total" },
{ "Name": "Final Cost" }, { "Name": "Quoted Cost" }, { "Name": "Approved Price" }];

$("#GridApprovalWindow").dxDataGrid({
    dataSource: GridCostAmtData,
    showRowLines: true,
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: { enabled: true },
    sorting: false,
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    columns: [{ dataField: "Name", fixedPosition: "left", fixed: true, width: 120 }],
    onCellPrepared: function (e) {
        if (e.rowType === "header") {
            e.cellElement.css('background', '#0a5696');
            e.cellElement.css('color', 'white');
            e.cellElement.css('font-weight', 'bold');
        }
        if (e.rowIndex === 10) {
            e.cellElement.css('background', 'green');
        }
        if (e.rowIndex > 4 && e.rowIndex < 10) {
            e.cellElement.css('background', 'coral');
        }
    },
    onCellClick: function (clickedCell) {
        //var rowdata = clickedCell.row.values[1];
        //var Coldata = clickedCell.column.dataField;

        Row_No = clickedCell.row.rowIndex;
        Col_No = clickedCell.column.visibleIndex;

        //var i, j;
        //var dataGrid5 = $('#GridApprovalWindow').dxDataGrid('instance');
        //var CostType;
        //var currencySymbol = document.getElementById("TxtCurrency").value.trim();
        //var conversionValue = Number(document.getElementById("TxtCurrencyValue").value);
        if (clickedCell.row.rowIndex !== 10) {
            clickedCell.cancel = true;
        }

        if (Row_No === 5 || Row_No === 7) {
            GblTypeOfCost = "1000Unit";
        } else if (Row_No === 6) {
            GblTypeOfCost = "Unit";
        }
        //Commented by pKp on 03072019
        //if (Row_No === 5) {
        //    for (i = 1; i <= dataGrid5.columnCount() - 1; i++) {
        //        CostType = dataGrid5.cellValue(5, i);
        //        if (Number(CostType) > 0) {
        //            if (currencySymbol.toString().toUpperCase() === "INR") {
        //                dataGrid5.cellValue(10, i, CostType);
        //            } else {
        //                if (Number(conversionValue) > 0) {
        //                    CostType = Number(Number(CostType) / Number(conversionValue)).toFixed(3);
        //                    dataGrid5.cellValue(10, i, CostType);
        //                } else {
        //                    dataGrid5.cellValue(10, i, CostType);
        //                }

        //            }

        //        } else {
        //            dataGrid5.cellValue(10, i, CostType);
        //        }
        //        dataGrid5.saveEditData();
        //    }
        //    dataGrid5.refresh();
        //    GblTypeOfCost = "1000Unit";
        //}
        //if (Row_No === 6) {
        //    for (i = 1; i <= dataGrid5.columnCount() - 1; i++) {
        //        CostType = dataGrid5.cellValue(6, i);
        //        if (Number(CostType) > 0) {
        //            if (currencySymbol.toString().toUpperCase() === "INR") {
        //                dataGrid5.cellValue(10, i, CostType);
        //            } else {
        //                if (Number(conversionValue) > 0) {
        //                    CostType = Number(Number(CostType) / Number(conversionValue)).toFixed(3);
        //                    dataGrid5.cellValue(10, i, CostType);
        //                } else {
        //                    dataGrid5.cellValue(10, i, CostType);
        //                }

        //            }

        //        } else {
        //            dataGrid5.cellValue(10, i, CostType);
        //        }
        //        dataGrid5.saveEditData();
        //    }
        //    dataGrid5.refresh();
        //    GblTypeOfCost = "Unit";
        //}
        //if (Row_No === 7) {
        //    for (i = 1; i <= dataGrid5.columnCount() - 1; i++) {
        //        CostType = dataGrid5.cellValue(7, i);
        //        if (Number(CostType) > 0) {
        //            if (currencySymbol.toString().toUpperCase() === "INR") {
        //                dataGrid5.cellValue(10, i, CostType);
        //            } else {
        //                if (Number(conversionValue) > 0) {
        //                    CostType = Number(Number(CostType) / Number(conversionValue)).toFixed(3);
        //                    dataGrid5.cellValue(10, i, CostType);
        //                } else {
        //                    dataGrid5.cellValue(10, i, CostType);
        //                }
        //            }
        //        } else {
        //            dataGrid5.cellValue(10, i, CostType);
        //        }
        //        dataGrid5.saveEditData();
        //    }
        //    dataGrid5.refresh();
        //    GblTypeOfCost = "1000Unit";
        //}
    },
    onEditingStart: function (e) {
        if (Row_No < 1 || Col_No < 1) {
            e.cancel = true;
        }
        if ((Row_No < 10 && Row_No > 4) || Col_No < 1) {
            e.cancel = true;
        }
        e.cancel = true;
    }
});

var Grid_Job_Data = [{ "Name": "Client Name" }, { "Name": "Mailing Address" }, { "Name": "Contact No" }, { "Name": "Project Name" }, { "Name": "Enquiry No" }, { "Name": "Enquiry Date" },
{ "Name": "Quotation No" }, { "Name": "Quotation Date" }, { "Name": "POC" }, { "Name": "Remark" }];

$("#GridJobDetails").dxDataGrid({
    dataSource: Grid_Job_Data,
    showRowLines: true,
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: { enabled: true },
    sorting: false,
    columns: [{ dataField: "Name", fixedPosition: "left", fixed: true, width: 120 }, { dataField: "Details" }],
    onCellPrepared: function (e) {
        if (e.rowType === "header") {
            e.cellElement.css('background', '#0a5696');
            e.cellElement.css('color', 'white');
            e.cellElement.css('font-weight', 'bold');
        }
    }
});

$("#BtnCancel").click(function () {
    if ($('#txtRemark').val() == "") {
        alert("Please enter reson of cancellation")
        $('#txtRemark').focus()
        return;
    }
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/CancelJob",
            data: '{ProjectQuotationId:' + Number(GblBookingIDSelect) + ',TxtRemark:' + JSON.stringify($('#txtRemark').val()) + '}',
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
                alert("error occured!");
            }

        });
    } catch (e) {
        console.log(e);
    }

});
$("#BtnDeleteCostApp").click(function () {

    if (FlagEdit === false) {
        return false;
    }
    if (Number(GblBookingIDSelect) <= 0) return false;
    var del = confirm("Do you want to delete this record");
    if (del === true) {
        //var cmd = "Delete";
        //cmd = JSON.stringify(cmd);
        //var Frm_name = "frm_Price_Approval";
        //Frm_name = JSON.stringify(Frm_name);
        //$.ajax({
        //    type: "POST",
        //    url: "WebService_Planning.asmx/IsEligible",
        //    data: '{Command:' + cmd + ',Form_Name:' + Frm_name + '}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "text",
        //    success: function (results) {
        //        var res = results.replace(/"/g, '');
        //        res = res.replace(/d:/g, '');
        //        res = res.replace(/{/g, '');
        //        res = res.replace(/}/g, '');
        //        if (res === true || res === "true") {
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/DeleteCostApproval",
            data: '{BookingID:' + Number(GblBookingIDSelect) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                if (res === "Success") {
                    alert("Information deleted successfully!");
                    location.reload();
                } else if (res === "false") {
                    alert("Selected record has been used in few transactions. Please delete the transactions first.!");
                }
                else {
                    alert("Something went wrong!");
                }
            },
            error: function errorFunc(jqXHR) {
                alert("error occured!");
            }

        });
        //        }
        //        else {
        //            alert("Sorry! You are not authorised to Delete this record");
        //        }
        //    },
        //    error: function errorFunc(jqXHR) {
        //        alert(jqXHR.message);
        //    }
        //});
    }
});

$("#BtnSaveCostApp").click(function () {

    var Remark = document.getElementById("txtRemark").value.trim();
    var LID = document.getElementById("LID").value.trim();
    //var CategoryID = document.getElementById("CategoryID").value.trim();
    var ApprovalDate = $("#ApprovalDate").dxDateBox("instance").option('value');
    var DivToDate = $("#DivToDate").dxDateBox("instance").option('value');
    var currencySymbol = document.getElementById("TxtCurrency").value.trim();
    var conversionValue = Number(document.getElementById("TxtCurrencyValue").value);

    if (LID === "" || LID === null || LID === "null" || LID === undefined) {
        alert("Please load data for approval");
        DevExpress.ui.notify("Please load data for approval", "warning", 1000);
        document.getElementById("BtnLoadBooking").focus();
        document.getElementById("BtnLoadBooking").style.borderColor = 'red';
        return false;
    }

    //if (GblTypeOfCost === "") {
    //    alert("Please select type of cost on click on unit cost or unit cost/1000");
    //    DevExpress.ui.notify("Please select type of cost on click on unit cost or unit cost/1000", "warning", 1000);
    //    return false;
    //}

    var grid_Job = $('#GridJobDetails').dxDataGrid('instance');
    var GridApprovalWindow = $('#GridApprovalWindow').dxDataGrid('instance');
    var GridShowList = $('#GridLoadBooking').dxDataGrid('instance');
    //var cmd;
    var Obj_Price_App = [];
    var Price_Approval = {};


    for (var i = 1; i < GridApprovalWindow.columnCount(); i++) {
        Price_Approval = {};

        if (FlagEdit === false) {
            Price_Approval.JobName = grid_Job.cellValue(3, 1);
            Price_Approval.BookingNo = grid_Job.cellValue(6, 1);
            Price_Approval.Quantity = 0//grid_Job.cellValue(7, 1);
            Price_Approval.LedgerID = LID;
            Price_Approval.CategoryID = 0;
        } else if (FlagEdit === true) {
            for (var k = 0; k < GridShowList.totalCount(); k++) {
                if (GridShowList._options.dataSource[k].ApprovalNo === document.getElementById("APPNo").value
                    && Number(GridShowList._options.dataSource[k].OrderQuantity) === Number(GridApprovalWindow.columnOption(i).caption)) {
                    Price_Approval.ApprovalID = GridShowList._options.dataSource[k].ApprovalID;
                    continue;
                }
            }
        }
        Price_Approval.TypeOfCost = GblTypeOfCost;
        Price_Approval.Remark = Remark;
        Price_Approval.PriceApprovedDate = ApprovalDate;
        Price_Approval.AppliedDateValidUpTo = DivToDate;

        Price_Approval.OrderQuantity = 0;
        Price_Approval.TotalCost = GridApprovalWindow.cellValue(0, i);
        Price_Approval.MiscCost = GridApprovalWindow.cellValue(1, i);
        Price_Approval.ProfitCost = GridApprovalWindow.cellValue(2, i);
        Price_Approval.DiscountPercentage = GridApprovalWindow.cellValue(3, i);
        Price_Approval.TaxPercentage = 0;
        Price_Approval.GrandTotal = GridApprovalWindow.cellValue(5, i);
        Price_Approval.UnitCost = 0;
        Price_Approval.UnitCost1000 = 0;
        Price_Approval.QuotedFinalCost = GridApprovalWindow.cellValue(6, i);
        Price_Approval.QuotedCost = GridApprovalWindow.cellValue(7, i);
        Price_Approval.finalCost = GridApprovalWindow.cellValue(7, i);
        Price_Approval.CurrencySymbol = currencySymbol;
        Price_Approval.ConversionValue = Number(conversionValue);
        Obj_Price_App.push(Price_Approval);
    }

    var Price_Approval_Data = JSON.stringify(Obj_Price_App);
    var BookingID = Number(GblBookingIDSelect);
    var Flag = JSON.stringify(FlagEdit);
    ////if (FlagEdit === false) cmd = "Save";
    ////else cmd = "Edit";
    ////cmd = JSON.stringify(cmd);
    ////var Frm_name = "frm_Price_Approval";
    ////Frm_name = JSON.stringify(Frm_name);
    ////$.ajax({
    ////    type: "POST",
    ////    url: "WebService_Planning.asmx/IsEligible",
    ////    data: '{Command:' + cmd + ',Form_Name:' + Frm_name + '}',
    ////    contentType: "application/json; charset=utf-8",
    ////    dataType: "text",
    ////    success: function (results) {
    ////        var res = results.replace(/"/g, '');
    ////        res = res.replace(/d:/g, '');
    ////        res = res.replace(/{/g, '');
    ////        res = res.replace(/}/g, '');
    ////        if (res === true || res === "true") {
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/SaveCostApprovalData",
        data: '{CAData:' + Price_Approval_Data + ',BKID:' + BookingID + ',Flag:' + Flag + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            // alert(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            // alert(res);
            if (res === "Save") {
                alert("Price Approval Saved Successfully!");
                window.location.reload();
            }
            else if (res === "Update") {
                alert("Price Approval Updated Successfully!");
                window.location.reload();
            }
            else {
                alert("Something went wrong!");
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            // alert(jqXHR.message);
            alert("Error Occured!");
        }
    });
    ////    }
    ////    else {
    ////        alert("Sorry! You are not authorised to Save this record");
    ////        DevExpress.ui.notify("Sorry! You are not authorised to Save this record", "warning", 1000);
    ////    }
    ////},
    ////error: function errorFunc(jqXHR) {
    ////    alert(jqXHR.message);
    ////}
    //});
});

$("#BtnRemoveQuantity").click(function () {
    var dataGrid = $('#GridApprovalWindow').dxDataGrid('instance');

    if (Col_No === undefined || Col_No === 0) return false;
    if (Col_No < dataGrid.columnCount()) {
        if (dataGrid.columnCount() > 1) {
            dataGrid.deleteColumn(Col_No);
            dataGrid.refresh();
            Col_No = 0;
        }
    }
});

$("#BtnNewCostApp").click(function () {
    window.location.reload();
});

$("#BtnNotification").click(function () {
    var bookingID = "";
    var priceApprovalNo = "";
    var commentData = "";
    var newHtml = '';
    var productMasterIDs = "";
    var salesOrderNo = "";
    var moduleName = "PRICE APPROVAL";
    if (FlagEdit === false) {
        bookingID = "";
        priceApprovalNo = "";
        bookingID = Number(GblBookingIDSelect);
        document.getElementById("commentbody").innerHTML = "";
        if (bookingID !== "" && bookingID !== 0 && bookingID !== null && bookingID !== undefined && !isNaN(bookingID)) {
            $.ajax({
                type: "POST",
                url: "WebServiceOthers.asmx/GetCommentData",
                data: '{bookingIDs:' + JSON.stringify(bookingID) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
                            newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                            newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                        }
                    }
                    $("#commentbody").append(newHtml);
                    $(".commentInput").hide();

                }

            });
        }

    } else {
        bookingID = "";
        priceApprovalNo = "";
        priceApprovalNo = document.getElementById("APPNo").value;
        if (priceApprovalNo === "" || priceApprovalNo === null || priceApprovalNo === undefined || priceApprovalNo === "0") {
            alert("Please select valid price approval voucher to view comment details..!");
            return false;
        }
        document.getElementById("commentbody").innerHTML = "";
        if (priceApprovalNo !== "") {
            $.ajax({
                type: "POST",
                url: "WebServiceOthers.asmx/GetCommentData",
                data: '{bookingIDs:' + JSON.stringify(bookingID) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
                            newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                            newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                        }
                    }
                    $("#commentbody").append(newHtml);
                    $(".commentInput").show();
                }
            });
        }

    }
    document.getElementById("TxtCommentTitle").value = "";
    document.getElementById("TxtCommentDetail").value = "";
    document.getElementById("TxtCommentTitle").value = "";
    $('#selCommentType').dxSelectBox({
        value: ""
    });

    document.getElementById("BtnNotification").setAttribute("data-toggle", "modal");
    document.getElementById("BtnNotification").setAttribute("data-target", "#CommentModal");
});

$(function () {
    $("#BtnSaveComment").click(function () {
        var priceApprovalNo = "";
        var moduleName = "PRICE APPROVAL";
        priceApprovalNo = document.getElementById("APPNo").value;
        if (priceApprovalNo === "" || priceApprovalNo === null || priceApprovalNo === undefined || priceApprovalNo === 0) {
            alert("Please select valid sales order to save comment details..!");
            return false;
        }

        var commentTitle = document.getElementById("TxtCommentTitle").value.trim();
        var commentDesc = document.getElementById("TxtCommentDetail").value.trim();
        var commentType = $('#selCommentType').dxSelectBox('instance').option('value');
        if (commentTitle === undefined || commentTitle === "" || commentTitle === null || commentType === undefined || commentType === "" || commentType === null || commentDesc === undefined || commentDesc === null || commentDesc === "") {
            alert("Please enter valid comment title, type and description..!");
            return false;
        }
        var jsonObjectCommentDetail = [];
        var objectCommentDetail = {};

        objectCommentDetail.CommentDate = new Date();
        objectCommentDetail.ModuleID = 0;
        objectCommentDetail.ModuleName = "Price Approval";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        //objectCommentDetail.TransactionID = purchaseid;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/SaveCommentData",
            data: '{jsonObjectCommentDetail:' + jsonObjectCommentDetail + ',salesOrderNo:0,priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                //if (res === "Success") {
                // RadioValue = "Pending Requisitions";
                alert("Comment saved!", "Comment saved successfully.", "success");
                var commentData = "";
                var newHtml = '';
                var bookingID = "";
                priceApprovalNo = document.getElementById("APPNo").value;
                if (priceApprovalNo === "" || priceApprovalNo === null || priceApprovalNo === undefined || priceApprovalNo === "0") {
                    alert("Please select valid price approval voucher to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (priceApprovalNo !== "") {
                    var productMasterIDs = "";
                    var salesOrderNo = "";
                    var moduleName = "PRICE APPROVAL";
                    $.ajax({
                        type: "POST",
                        url: "WebServiceOthers.asmx/GetCommentData",
                        data: '{bookingIDs:' + JSON.stringify(bookingID) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
                                    newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                                    newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                                }
                            }
                            $("#commentbody").append(newHtml);
                            $(".commentInput").show();
                        }
                    });
                }
            },
            error: function errorFunc(jqXHR) {
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });
});

function hidedetailsContainer() {
    $("#myModal").removeClass("hidden");
    $("#FieldCntainerRow").addClass("hidden");
    $("#myModal_1").addClass("hidden");
}

function showdetailsContainer() {
    $("#FieldCntainerRow").removeClass("hidden");
    $("#myModal").addClass("hidden");
    $("#myModal_1").addClass("hidden");
}

$("#BtnBack").click(function () {
    $("#myModal").removeClass("hidden");
    $("#myModal_1").addClass("hidden");
});

$("#Revise").click(function () {
       if (GblBookingIDSelect <= 0 || GblBookingIDSelect === null || GblBookingIDSelect === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "";
           url = "ProjectQuotation.aspx?BookingID=" + GblBookingIDSelect + "&FG=false&IsDirectApproved=0&IsDirectPriceApproved=1";

        window.open(url, "_blank", "", true);
    }
});

$("#PrintButton").click(function () {

    var bid = GblBookingIDSelect;

    if (bid === "" || bid === null || bid === undefined) {
        swal("Empty Selection", "Please select quote first...!", "warning");
    }
    else {
        var url = "ProjectQuotationReportViewer.aspx?t=" + bid; //// "Print_Quotation.aspx?BN=" + document.getElementById("QuoteIDId").value + "&BookingNo=" + encodeURIComponent(document.getElementById("BookingNo").value);
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
    }
});

