"use strict";
var JobPriority, JobReference, JobType, ProductHSNGrp, ObjSchData;
var AprNo = "0", MaxProductCode;
var GblClientID = 0, FlagEdit = false, GblSalesOrderNo = "";
var ObjSchDelivery = [];
let GBLProductEstimateID = 0;

$('.disabledbutton').prop('disabled', true);
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

$(function () {
    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/SelctboxPrefix",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/JobPrefix/g, '');
            res = res.replace(/"":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.replace(/"nul/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);

            $("#SOBPrefix").dxSelectBox({
                items: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/SelctboxJobPriority",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"{null/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            JobPriority = JSON.parse(res);
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/SelctboxJobReference",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"{null/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            JobReference = JSON.parse(res);
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/SelctboxJobType",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"{null/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            JobType = JSON.parse(res);
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/SelctboxTransporter",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var items = JSON.parse(res);

            $("#SOBTransporter").dxSelectBox({
                placeholder: "Select Transporter",
                items: items,
                showClearButton: true
            });
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    ///Sales Rep.
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/SOBSalesRepresentive",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#SOBSalesRep").dxSelectBox({
                items: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
        }
    });

    $.ajax({                //// For Client
        type: 'post',
        url: 'WebServiceOthers.asmx/GetCostFilteredClient',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            //alert(res);
            var RES1 = JSON.parse(res);
            $("#SOBClientName").dxSelectBox({
                items: RES1,
                placeholder: "Select Client Name",
                displayExpr: 'LedgerName',
                valueExpr: 'LedgerId',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (e) {
                    //var previousValue = e.element.context.id; ////Fetch current selectbox ID               
                    // Event handling commands go here
                    if (!e.value) {
                        $("#SOBProductData").dxDataGrid({ dataSource: [] });
                        GblClientID = 0;
                        return;
                    }
                    GblClientID = e.value;
                    $.ajax({
                        type: "POST",
                        url: "WebServiceOthers.asmx/LoadOBProductsData",
                        data: '{LedgerID:' + GblClientID + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (results) {
                            var res = results.d.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/"d":null/g, '');
                            res = res.replace(/u0026/g, '&');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            var RES1 = JSON.parse(res.toString());
                            $("#SOBProductData").dxDataGrid({
                                dataSource: RES1
                            });
                        },
                        error: function errorFunc(jqXHR) {
                            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                            alert(jqXHR.message);
                        }
                    });
                }
            });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceOthers.asmx/GetProductHSNGroups",
        data: '{Category:"Finish Goods"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            ProductHSNGrp = JSON.parse(res);
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

});

$.ajax({
    type: "POST",
    url: "WebServiceOthers.asmx/LoadOrderBookingData",
    data: '{}',//BookingID:' + BookingID + '
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res.toString());
        $("#SalesOrderBookingGrid").dxDataGrid({
            dataSource: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        alert(jqXHR.message);
    }
});

$("#SalesOrderBookingGrid").dxDataGrid({
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
    selection: { mode: 'single' },
    filterRow: { visible: true },
    rowAlternationEnabled: false,
    headerFilter: { visible: false },
    columns: ["SalesOrderNo", "OrderDate", "ClientName", { dataField: "BookingNo", caption: "Quote No", width: 60 }, "ProductCode", { dataField: "JobName", width: 145 }, { dataField: "OrderQuantity", caption: "Order Qty", width: 70 },
        "DeliveryDate", "PONo", { dataField: "PODate", width: 70 }, { dataField: "BookedBy", caption: "Booked By", width: 60 }, { dataField: "IsBooked", dataType: "boolean", width: 40 }, { dataField: "City", width: 60 },
        { dataField: "State", width: 60 }, { dataField: "JobWork", dataType: "boolean", width: 60 }, { dataField: "DirectOrder", dataType: "boolean", width: 60 }],
    //onContentReady: function (e) {
    //    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    //},
    height: function () {
        return window.innerHeight / 1.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (data) {
        if (data.selectedRowsData.length <= 0) {
            GblClientID = 0;
            GblSalesOrderNo = "";
            return;
        } else {
            GblSalesOrderNo = data.selectedRowsData[0].SalesOrderNo;
            GblClientID = data.selectedRowsData[0].LedgerID;
        }
    }
});

$("#SOBProductData").dxDataGrid({
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    selection: { mode: 'single' },
    scrolling: { mode: 'infinite' },
    filterRow: { visible: true },
    rowAlternationEnabled: false,
    headerFilter: { visible: false },
    columns: [
        { dataField: "QuotationNo" },
        { dataField: "ProjectName" },
        { dataField: "ClientName" },
        { dataField: "SalesPerson" },
        { dataField: "FreightAmount" },
        { dataField: "Remark" },
        { dataField: "ApprovedBy" },
    ],
    height: function () {
        return window.innerHeight / 2.5;
    },
    //onEditingStart: function (e) {
    //    if (e.column.dataField === "OrderQuantity") {
    //        e.cancel = false;
    //    } else {
    //        e.cancel = true;
    //    }
    //},
    //onRowUpdated: function (e) {
    //    if (e.data.OrderQuantity > 0) {
    //        e.key.ApprovedRate = CalculateSlabrates(e.key.BookingID, Number(e.key.OrderQuantity), "AR");
    //        e.key.QuoteRate = CalculateSlabrates(e.key.BookingID, Number(e.key.OrderQuantity), "QR");
    //    } else {
    //        e.key.ApprovedRate = 0;
    //        e.key.QuoteRate = 0;
    //    }
    //    e.component.refresh();
    //},
    //onCellClick: function (clickedCell) {
    //    if (clickedCell.rowType === undefined) return;
    //    if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
    //        return false;
    //    }
    //    if (clickedCell.column.dataField === "Add") {
    //        try {
    //            clickedCell.component.saveEditData();
    //            clickedCell.component.refresh();
    //            if (clickedCell.data.OrderQuantity <= 0 || !clickedCell.data.OrderQuantity) {
    //                DevExpress.ui.notify("Please enter order quantity first..!", "warning", 1500);
    //                clickedCell.component.cellValue(clickedCell.row.rowIndex, "OrderQuantity", "");
    //                return false;
    //            }
    //            if (clickedCell.data.ApprovedRate <= 0 || !clickedCell.data.ApprovedRate) {
    //                DevExpress.ui.notify("Entered quantity is not a valid approved quantity..!", "warning", 1500);
    //                return false;
    //            }
    //            var dataGrid = $('#SOBProductAddedData').dxDataGrid('instance');
    //            var result = $.grep(dataGrid._options.dataSource, function (e) { return e.BookingNo === clickedCell.data.BookingNo; });
    //            if (result.length === 1) {
    //                // data found
    //                DevExpress.ui.notify("Product already added..!", "error", 500);
    //                return false;
    //            }

    //            var newData = clickedCell.data;
    //            newData.OrderQuantity = clickedCell.data.OrderQuantity;
    //            newData.ApprovedRate = clickedCell.data.ApprovedRate; ///clickedCell.component._options.dataSource[clickedCell.rowIndex].ApprovedRate; 
    //            newData.QuoteRate = clickedCell.data.QuoteRate;
    //            newData.FinalCost = clickedCell.data.FinalCost;
    //            newData.TotalAmount = clickedCell.data.TotalAmount;
    //            newData.TypeOfCost = clickedCell.data.TypeOfCost;
    //            newData.CGSTTaxAmount = 0;
    //            newData.SGSTTaxAmount = 0;
    //            newData.IGSTTaxAmount = 0;

    //            var clonedItem = $.extend({}, newData);
    //            dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
    //            dataGrid.refresh(true);

    //            //dataGrid._events.preventDefault();
    //            DevExpress.ui.notify("Product added..!", "success", 500);
    //            clickedCell.component.clearFilter();
    //            $("#SOBClientName").dxSelectBox({
    //                disabled: true
    //            });
    //        } catch (e) {
    //            console.log(e);
    //        }
    //    }
    //},
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (data) {
        GBLProductEstimateID = data.selectedRowsData[0].ProductEstimateID

        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/LoadProjectContents",
            data: '{ProductEstimateID:' + data.selectedRowsData[0].ProductEstimateID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                $("#SOBProductAddedData").dxDataGrid({
                    dataSource: RES1
                });
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    }
});

$("#SOBProductAddedData").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
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
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    height: function () {
        return window.innerHeight / 2.7;
    },
    onRowRemoved: function (e) {
        if (e.component.totalCount() <= 0)
            $("#SOBClientName").dxSelectBox({ disabled: false });
    },
    summary: {
        totalItems: [{
            format: "currency",
            showInColumn: "OrderQuantity",
            column: "OrderQuantity",
            summaryType: "sum",
            displayFormat: "{0}",
            alignByColumn: true
        }]
    }
});

function CalculateSlabrates(BKID, Qty, type) {
    var data = 0;
    type = JSON.stringify(type);
    $.ajax({
        async: false,
        type: "POST",
        url: "WebServiceOthers.asmx/SOBCalculateSlabRates",
        data: '{BKID:' + BKID + ',Qty:' + Qty + ',type:' + type + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            res = Number(res);
            res = res.toFixed(3);
            return data = res;
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
            return 0;
        }
    });
    return data;
}

$("#SOBOrderHistory").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
    columns: [{ dataField: "SalesOrderNo", caption: "Order No" }, { dataField: "OrderBookingDate", caption: "Order Date" }, { dataField: "OrderQuantity", caption: "Order Qty" }, { dataField: "Cost", caption: "Order Rate" },
        "JobBookingNo", "ApproveCostRemark", "Remark"],
    height: function () {
        return window.innerHeight / 2.5;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$("#SOBDate").dxDateBox({
    pickerType: "rollers",
    disabled: true,
    value: new Date(),
    displayFormat: "dd-MMM-yyyy"
});

$("#SOBPrefix").dxSelectBox({
    items: [],
    //showClearButton: true,
    //acceptCustomValue: true    
    onValueChanged: function (data) {
        var PFix = data.value;
        if (!PFix) return;
        GetMaxSOBNumber(PFix);
    }
});

$("#SOBPODate").dxDateBox({
    pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    max: new Date(),
    onValueChanged: function (data) {
        var PDate = data.value;
        $("#SOBDeliveryDate").dxDateBox({
            min: PDate
        });
    }
});

$("#SOBDeliveryDate").dxDateBox({
    pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    min: new Date()

});

$("#SOBSalesRep").dxSelectBox({
    items: [],
    valueExpr: 'EmployeeID',
    displayExpr: 'EmployeeName'
});

$("#GridOrdersList").dxDataGrid({
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    columnResizingMode: "widget",
    selection: { mode: 'single' },
    showBorders: true,
    sorting: false,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
    height: function () {
        return window.innerHeight / 3;
    },

    //summary: {
    //    recalculateWhileEditing: true,
    //    totalItems: [{
    //        format: "largeNumber",
    //        showInColumn: "OrderQuantity",
    //        column: "OrderQuantity",
    //        summaryType: "sum",
    //        displayFormat: "{0}",
    //        alignByColumn: true
    //    }, {
    //        format: "fixedPoint",
    //        precision: 2,
    //        showInColumn: "TotalAmount",
    //        column: "TotalAmount",
    //        summaryType: "sum",
    //        displayFormat: "₹{0}",
    //        alignByColumn: true
    //    }, {
    //        format: "fixedPoint",
    //        precision: 2,
    //        showInColumn: "NetAmount",
    //        column: "NetAmount",
    //        summaryType: "sum",
    //        displayFormat: "₹{0}",
    //        alignByColumn: true
    //    }]
    //},
    onEditingStart: function (e) {
        if (e.column.dataField === "FinalDeliveryDate" || e.column.dataField === "JobType" || e.column.dataField === "JobReference"
            || e.column.dataField === "JobPriority" || e.column.dataField === "PrePressRemark") {
            e.cancel = false;
        } else
            e.cancel = true;
    },

    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },

    onCellClick: function (e) {
        if (e.row === undefined) return;
        if (e.rowType === undefined) return;

        //scheduleGridBlank();
        //if (e.rowType === "data") {

        //    document.getElementById("SOBProductMasterNo").value = 0;
        //    document.getElementById("SOBJobName").value = e.row.data.JobName;

        //    document.getElementById('SOBQuoteNo').value = 0;
        //    document.getElementById('SOBSchQuantity').value = e.row.data.OrderQuantity;

        //    MaxProductCode = 0;
        //    ObjSchData = e.row.data;
        //    reloadSchGrid();
        //} else {
        //    ObjSchData = [];
        //}
        //alert('oncellClick');
    },
    onSelectionChanged: function (data) {
        //scheduleGridBlank();
        if (data) {
            //document.getElementById("SOBProductMasterNo").value = data.selectedRowsData[0].ProductMasterCode;
            //document.getElementById("SOBQuoteNo").value = data.selectedRowsData[0].QuotationNo;
            document.getElementById("SOBJobName").value = data.selectedRowsData[0].ProductName;
            document.getElementById('SOBSchQuantity').value = 0;
            //MaxProductCode = data.selectedRowsData[0].MaxPMCode;

            ObjSchData = data.selectedRowsData[0];
            //reloadSchGrid();
        } else {
            ObjSchData = [];
        }

        var HSNID = data.selectedRowsData[0].ProductHSNID;
        var result = $.grep(ProductHSNGrp, function (ex) { return ex.ProductHSNID === HSNID; });
        if (result.length === 1) {
            if (data.selectedRowsData[0].ClientState !== data.selectedRowsData[0].CompanyState) {
                data.selectedRowsData[0].IGSTTaxPercentage = result[0].IGSTTaxPercentage;
                data.selectedRowsData[0].CGSTTaxPercentage = 0;
                data.selectedRowsData[0].SGSTTaxPercentage = 0;
            } else {
                data.selectedRowsData[0].IGSTTaxPercentage = 0;
                data.selectedRowsData[0].SGSTTaxPercentage = result[0].SGSTTaxPercentage;
                data.selectedRowsData[0].CGSTTaxPercentage = result[0].CGSTTaxPercentage;
            }
            data.selectedRowsData[0].GSTTaxPercentage = result[0].GSTTaxPercentage;
        }
        data.selectedRowsData[0].IGSTTaxAmount = (Number(Number(data.selectedRowsData[0].FinalAmount) * Number(data.selectedRowsData[0].IGSTTaxPercentage)) / 100).toFixed(2);
        data.selectedRowsData[0].CGSTTaxAmount = (Number(Number(data.selectedRowsData[0].FinalAmount) * Number(data.selectedRowsData[0].CGSTTaxPercentage)) / 100).toFixed(2);
        data.selectedRowsData[0].SGSTTaxAmount = (Number(Number(data.selectedRowsData[0].FinalAmount) * Number(data.selectedRowsData[0].SGSTTaxPercentage)) / 100).toFixed(2);
        //GridOrdersListRowPO = e.rowIndex;
        //GridOrdersListColPO = e.columnIndex;
        data.component.refresh();
    }
});

$("#SOBTransporter").dxSelectBox({
    placeholder: "Select Transporter",
    items: [],
    valueExpr: "TransporterID",
    displayExpr: "TransporterName",
    showClearButton: true
});

$("#SOBConsignee").dxSelectBox({
    //value: [3],
    valueExpr: "ConsigneeID",
    placeholder: "Select consignee...",
    displayExpr: "ConsigneeName",
    showClearButton: true
});

$("#SOBScheduleGrid").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    sorting: false,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
    editing: {
        allowDeleting: true
    },
    //height: function () {
    //    return window.innerHeight / 2.8;
    //},
    columns: [

        { dataField: "JobName", caption: "Job Name" },
        { dataField: "ScheduleQuantity", caption: "Schedule Qty" },
        {
            dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date",
            format: "dd/MM/yyyy"
        },
        { dataField: "ConsigneeName", caption: "Consignee Name" },
        { dataField: "ConsigneeID", visible: false },
        { dataField: "TransporterID", visible: false },
        { dataField: "Transporter" },
        { dataField: "BookingID", visible: false }
    ],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onRowRemoved: function (e) {
        //ObjSchDelivery = ObjSchDelivery.filter(function (obj) {
        //    return obj.ScheduleQuantity !== e.key.ScheduleQuantity && obj.DeliveryDate !== e.key.DeliveryDate;
        //});

        var index = ObjSchDelivery.indexOf(e.key);
        ObjSchDelivery.splice(index, 1);
    }
});

$("#BtnNext").click(function () {
    var dataGrid = $('#SOBProductAddedData').dxDataGrid('instance');
    if (dataGrid.totalCount() < 0) {
        DevExpress.ui.notify("Grid is in editing mode please finish editing first..!", "warning", 1500);
        return;
    }
    if (dataGrid.totalCount() === 0) {
        DevExpress.ui.notify("Please add products first..!", "warning", 1200);
        return;
    }

    try {
        GetConsignee(GblClientID);
        dataGrid.refresh();
        reloadOrderList(dataGrid._options.dataSource);
        document.getElementById("SOBTxtClientName").value = $("#SOBClientName").dxSelectBox("instance").option('text');
        document.getElementById("TxtTotalOrderQty").value = dataGrid.getTotalSummaryValue("OrderQuantity");

        //OpenPopup("BtnNext", "#ModalOrderWindow");
        document.getElementById("FieldCntainerRow").style.display = 'none';
        document.getElementById("DetailedFieldCntainer").style.display = 'block';
    } catch (e) {
        console.log(e);
    }
});

$("#BtnBack").click(function () {
    document.getElementById("FieldCntainerRow").style.display = 'block';
    document.getElementById("DetailedFieldCntainer").style.display = 'none';
});

$("#BtnAddSchedule").click(function () {

    try {
        if (Object.keys(ObjSchData).length <= 0) {
            DevExpress.ui.notify("Please select any item to add Schedule quantity..!", "warning", 1200);
            return false;
        }
        if (Object.keys(ObjSchData).length > 0) {
            if (ObjSchData.FinalDeliveryDate == "" || ObjSchData.FinalDeliveryDate == undefined) {
                DevExpress.ui.notify("Please select final delivery date of selected product in list..!", "warning", 1200);
                return false;
            }
            if (ObjSchData.JobType == "" || ObjSchData.JobType == undefined) {
                DevExpress.ui.notify("Please select job type of selected product in list..!", "warning", 1200);
                return false;
            }
            if (ObjSchData.JobReference == "" || ObjSchData.JobReference == undefined) {
                DevExpress.ui.notify("Please select job reference of selected product in list..!", "warning", 1200);
                return false;
            }
            if (ObjSchData.JobPriority == "" || ObjSchData.JobPriority == undefined) {
                DevExpress.ui.notify("Please select job priority of selected product in list..!", "warning", 1200);
                return false;
            }
        }
        var SchQty = Number(document.getElementById("SOBSchQuantity").value);
        var txtSchConsignee = $("#SOBConsignee").dxSelectBox("instance").option('text');
        if (txtSchConsignee === "" || txtSchConsignee === null) {
            txtSchConsignee = document.getElementById('txtSchConsignee').value;
        }
        var SOBJobName = document.getElementById('SOBJobName').value;

        if (SOBJobName === "") {
            alert("Please select any item to add Schedule quantity..!");
            DevExpress.ui.notify("Please select any item to add Schedule quantity..!", "warning", 1200);
            document.getElementById('SOBJobName').focus();
            document.getElementById('SOBJobName').style.borderColor = 'red';
            return false;
        }
        document.getElementById('SOBJobName').style.borderColor = '';


        if (Number(SchQty) <= 0) {
            DevExpress.ui.notify("Please enter currect schedule quantity..!", "warning", 1000);
            document.getElementById("SOBSchQuantity").value = 0;
            return false;
        }

        if (txtSchConsignee === "") {
            alert("Please Enter Consignee...");
            document.getElementById('txtSchConsignee').focus();
            document.getElementById('txtSchConsignee').style.borderColor = 'red';
            return false;
        }
        document.getElementById('txtSchConsignee').style.borderColor = '';

        var DelDate = new Date($('#SOBDeliveryDate').dxDateBox('instance').option('value'));
        var DelDateDay = DelDate.getDate();
        DelDate = (DelDateDay < 10 ? '0' : '') + DelDateDay + '/' + (DelDate.getMonth() + 1) + '/' + DelDate.getFullYear();

        var PODate = new Date($('#SOBPODate').dxDateBox('instance').option('value'));
        var PODateDay = PODate.getDate();
        PODate = (PODateDay < 10 ? '0' : '') + PODateDay + '/' + (PODate.getMonth() + 1) + '/' + PODate.getFullYear();

        if (DateDiff(PODate, DelDate) === "InValid") {
            alert("Invalid delivery or purchase order date, please select date again");
            return false;
        }
        //if (DateDiff(PODate, DelDate) === "Lesser") {
        //    alert("You can not select delivery date earlier than purchase order date");
        //    document.getElementById('SOBDeliveryDate').style.borderColor = 'red';
        //    return false;
        //}
        document.getElementById('SOBDeliveryDate').style.borderColor = '';

        var dataGrid = $('#SOBScheduleGrid').dxDataGrid('instance');
        //var result = $.grep(dataGrid._options.dataSource, function (e) { return e.DeliveryDate === DelDate; });
        //if (result.length === 1) {
        //    alert("You have already made schedule for this date!");
        //    document.getElementById('SOBDeliveryDate').style.borderColor = 'red';
        //    return false;
        //}
        var TtlSchQty = 0;

        for (var i = 0; i < dataGrid._options.dataSource.length; i++) {
            if (dataGrid._options.dataSource[i].ProductEstimationContentID == ObjSchData.ProductEstimationContentID) {
                var CompDate = dataGrid.cellValue(i, 2);
                if (CompDate !== "" || CompDate !== null || CompDate !== undefined) {
                    var CompDateDay = CompDate.getDate();
                    CompDate = (CompDateDay < 10 ? '0' : '') + CompDateDay + '/' + (CompDate.getMonth() + 1) + '/' + CompDate.getFullYear();

                    if (DateDiff(DelDate, CompDate) === "Equal"
                        && txtSchConsignee === dataGrid._options.dataSource[i].ConsigneeName) {
                        alert("You have already made schedule for this date!");
                        DevExpress.ui.notify("You have already made schedule for this date..!", "warning", 1500);
                        document.getElementById('SOBDeliveryDate').style.borderColor = 'red';
                        return false;
                    }
                    document.getElementById('SOBDeliveryDate').style.borderColor = '';
                    TtlSchQty = TtlSchQty + Number(dataGrid._options.dataSource[i].ScheduleQuantity);
                }
            }
        }
        if (Number(ObjSchData.Quantity) < Number(SchQty) + TtlSchQty) {
            DevExpress.ui.notify("Can't add quantity more than order quantity..!", "warning", 1500);
            return false;
        }

        var newdata = [];
        //newdata.ProductMasterCode = ObjSchData.ProductMasterCode;
        //newdata.ApprovalNo = ObjSchData.ApprovalNo;
        newdata.ProductEstimationContentID = ObjSchData.ProductEstimationContentID;
        newdata.JobName = ObjSchData.ProductName;
        newdata.ScheduleQuantity = Number(SchQty);
        newdata.DeliveryDate = $("#SOBDeliveryDate").dxDateBox("instance").option('text');
        newdata.ConsigneeName = txtSchConsignee; // $("#SOBConsignee").dxSelectBox("instance").option('text');
        newdata.ConsigneeID = $("#SOBConsignee").dxSelectBox("instance").option('value');
        newdata.TransporterID = $("#SOBTransporter").dxSelectBox("instance").option('value');
        newdata.Transporter = $("#SOBTransporter").dxSelectBox("instance").option('text');
        newdata.BookingID = ObjSchData.BookingID;

        var clonedItem = $.extend({}, newdata);
        dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
        dataGrid.refresh(true);
        ObjSchDelivery.push(clonedItem);

    } catch (e) {
        DevExpress.ui.notify(e, "error", 1000);
        alert(e);
    }
});

function GetMaxSOBNumber(PFix) {
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/SOBOrderNo",
        data: '{PFix:' + JSON.stringify(PFix) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/d":"/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            if (FlagEdit === true) {
                document.getElementById("SOBTxtNo").value = GblSalesOrderNo;
            } else
                document.getElementById("SOBTxtNo").value = RES1;
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
        }
    });
}

function GetConsignee(CID) {
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetConsigneeData",
        data: '{ClientID:' + CID + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#SOBConsignee").dxSelectBox({
                dataSource: RES1
                ////onValueChanged: function (e) {
                ////    if (e.value) {
                ////        document.getElementById("txtSchConsignee").value = e.value;
                ////    }
                ////},
                //onCustomItemCreating: function (data) {
                //    var newItem = data.text;
                //    RES1.push(newItem);
                //    data.option("items", RES1);
                //    data.customItem = newItem;
                //}
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
}

$("#BtnOrderHistory").click(function () {
    GetOrderHistory();
});

function GetOrderHistory() {

    var SOBProductData = $('#SOBProductData').dxDataGrid('instance');
    var selectedRow = SOBProductData.getSelectedRowsData();
    if (selectedRow.length <= 0) return;
    var OID = selectedRow[0].ProductMasterCode;
    if (OID === "" || OID === null) return;
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetOrderHistory",
        data: '{OID:' + JSON.stringify(OID) + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#SOBOrderHistory").dxDataGrid({
                dataSource: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
        }
    });
}

function GridSelectedProductsRow() {
    var dataGrid = $('#GridOrdersList').dxDataGrid('instance');
    var OrderDate, fillDate, returnVar = "";
    var date = new Date($('#SOBDate').dxDateBox('instance').option('value'));
    // SOBDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    var day = date.getDate();
    var Month = date.getMonth();
    var year = date.getFullYear();

    OrderDate = (day < 10 ? '0' : '') + day + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    fillDate = OrderDate;

    OrderDate = OrderDate.replace("/", "-");
    OrderDate = OrderDate.replace("/", "-");

    for (var i = 0; i < dataGrid._options.dataSource.length; i++) {

        var DD = dataGrid._options.dataSource[i].FinalDeliveryDate; ///(i, 8);   /// (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        if (DD === "" || DD === null) {
            alert("Please select final delivery date of products..!");
            dataGrid.cellValue(i, "FinalDeliveryDate", fillDate);
            return false;
        }
        var DelDate = DD.split("/");
        var Mday = Number(DelDate[2]);
        var Mmonth = Number(DelDate[1]);
        var Myear = Number(DelDate[0]);

        if (year >= Myear) {
            if (Month >= Mmonth) {
                if (day > Mday) {
                    returnVar = "yes";
                    dataGrid.cellValue(i, 8, fillDate);
                }
            }
        }
    }

    if (returnVar === "yes") {
        returnVar = "";
        DevExpress.ui.notify({
            message: "You can not select final delivery date earlier than order date",
            position: {
                my: "middle top",
                at: "middle top"
            }
        }, "info", 3000);
        return false;
    }
    return true;
}

function scheduleGridBlank() {
    document.getElementById('SOBProductMasterNo').value = "";
    document.getElementById('SOBJobName').value = "";
    document.getElementById('SOBQuoteNo').value = "";
    document.getElementById('SOBSchQuantity').value = 0;
    //document.getElementById("txtGridQty").value = 0;

    $("#SOBTransporter").dxSelectBox({ value: null });
    $("#SOBScheduleGrid").dxDataGrid({ dataSource: [] });
    var dataGrid = $('#SOBScheduleGrid').dxDataGrid('instance');
    dataGrid.refresh();
}

function DateDiff(PODate, DelDate) {
    var compair = "";
    PODate = PODate.replace("/", "-");
    PODate = PODate.replace("/", "-");
    DelDate = DelDate.replace("/", "-");
    DelDate = DelDate.replace("/", "-");

    var P_c_dd = PODate.split("-");
    var D_c_dd = DelDate.split("-");

    if (Number(P_c_dd[2]) >= Number(D_c_dd[2])) {
        if (Number(P_c_dd[1]) >= Number(D_c_dd[1])) {
            if (Number(P_c_dd[0]) < Number(D_c_dd[0])) {
                compair = "Lesser";
                return compair;
            } else if (Number(P_c_dd[0]) > Number(D_c_dd[0])) {
                compair = "Greater";
                return compair;
            } else if (Number(P_c_dd[0]) === Number(D_c_dd[0])) {
                compair = "Equal";
                return compair;
            }
        } else {
            compair = "Greater";
            return compair;
        }
    } else {
        compair = "Greater";
        return compair;
    }
    return "InValid";
}

function reloadSchGrid() {
    var newData = [];
    for (var i = 0; i < ObjSchDelivery.length; i++) {
        if (ObjSchDelivery[i].ProductEstimationContentID === ObjSchData.ProductEstimationContentID && ObjSchDelivery[i].ApprovalNo === ObjSchData.ApprovalNo) {
            newData.push(ObjSchDelivery[i]);
        }
    }
    $("#SOBScheduleGrid").dxDataGrid({ dataSource: newData });
}

function OpenPopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-toggle", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}

$("#BtnCreateOrder").click(function () {
    GblSalesOrderNo = "";
    GblClientID = 0;
    FlagEdit = false;
    ObjSchDelivery = [];
    $("#SOBClientName").dxSelectBox({
        value: null,
        disabled: false
    });

    $("#SOBPrefix").dxSelectBox({
        value: null,
        disabled: false
    });

    $("#SOBProductAddedData").dxDataGrid({
        dataSource: []
    });
    document.getElementById('SOBTxtPONo').value = "";

    document.getElementById("FieldCntainerRow").style.display = 'block';
    document.getElementById("DetailedFieldCntainer").style.display = 'none';
});

$("#BtnShowList").click(function () {
    OpenPopup("BtnShowList", "#largeModal");
});

$("#EditButton").click(function () {
    if (GblClientID <= 0 || GblClientID === "" || GblSalesOrderNo === "" || GblSalesOrderNo === null || GblSalesOrderNo === undefined) {
        alert("Please select order first..!");
        DevExpress.ui.notify({
            message: "Please select order first..!",
            position: {
                my: "middle top",
                at: "middle top"
            }
        }, "warning", 1800);
        return false;
    }
    $("#SOBClientName").dxSelectBox({
        value: GblClientID,
        disabled: true
    });
    document.getElementById('SOBTxtNo').value = GblSalesOrderNo;
    document.getElementById("SOBTxtClientName").value = $("#SOBClientName").dxSelectBox('instance').option('displayValue');
    FlagEdit = true;
    //OpenPopup("EditButton", "#ModalOrderWindow");

    document.getElementById("EditButton").setAttribute("data-dismiss", "modal");
    document.getElementById("FieldCntainerRow").style.display = 'none';
    document.getElementById("DetailedFieldCntainer").style.display = 'block';
    GetConsignee(GblClientID);
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/ReloadOrderBooking",
            data: '{BKNo:' + JSON.stringify(GblSalesOrderNo) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                $("#SOBProductAddedData").dxDataGrid({
                    dataSource: RES1.OrderBooking
                });
                ObjSchDelivery = RES1.OrderBookingDelivery;
                reloadOrderList(RES1.OrderBooking);
                ObjSchData = RES1.OrderBooking[0];
                $("#SOBScheduleGrid").dxDataGrid({ dataSource: ObjSchDelivery });

                $("#SOBDate").dxDateBox({
                    value: RES1.OrderBooking[0].OrderBookingDate
                });
                $("#SOBPODate").dxDateBox({
                    value: RES1.OrderBooking[0].PODate
                });
                //alert(ObjSchData.SalesEmployeeID);
                $("#SOBSalesRep").dxSelectBox({
                    value: ObjSchData.SalesEmployeeID
                });
                $("#SOBPrefix").dxSelectBox({
                    value: ObjSchData.BookingPrefix,
                    disabled: true
                });
                document.getElementById('SOBTxtPONo').value = ObjSchData.PONo;
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            },
            error: function errorFunc(jqXHR) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR.message);
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

$("#DeleteButton").click(function () {

    if (GblClientID <= 0 || GblClientID === "" || GblSalesOrderNo === "" || GblSalesOrderNo === null || GblSalesOrderNo === undefined) {
        alert("Please select order first..!");
        DevExpress.ui.notify({
            message: "Please select order first..!",
            position: {
                my: "middle top",
                at: "middle top"
            }
        }, "warning", 1800);
        return;
    }
    var person = confirm("Do you want continue to delete this booking No '" + GblSalesOrderNo + "'...?");
    if (person === true) {

        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/SalesOrderBookingDelete",
            data: '{SOBNo:' + JSON.stringify(GblSalesOrderNo) + ',HardDelete:"False"}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                if (res === "Success") {
                    alert("Record Deleted successfully!");
                    DevExpress.ui.notify("Record Deleted successfully!", "success", 1500);
                } else {
                    DevExpress.ui.notify(res, "error", 1200);
                    alert(res);
                }
                location.reload();
            },
            error: function errorFunc(jqXHR) {
                alert(jqXHR.message);
            }
        });
    }
});

$("#BtnSave").click(function () {
    try {
        if (GblClientID <= 0) {
            alert("Invalid client selection please select client again..!");
            return false;
        }
        //var TxtTotalAmt = Number(document.getElementById("TxtTotalAmt").value);
        //if (TxtTotalAmt <= 0) return false;
        //if (GridSelectedProductsRow() === false) return false;
        var SOBTxtNo = document.getElementById('SOBTxtNo').value.trim();

        var txtPONo = document.getElementById('SOBTxtPONo').value.trim();
        var SOBPrefix = $('#SOBPrefix').dxSelectBox('instance').option('value');
        //var sel_Approval = $('#sel_Approval').dxSelectBox('instance').option('value');
        //var Sel_Job_Coordinator = $('#Sel_Job_Coordinator').dxSelectBox('instance').option('value');

        var SOBSalesRep = $('#SOBSalesRep').dxSelectBox('instance').option('value');
        var OrderDate = $('#SOBDate').dxDateBox('instance').option('value');
        var PODate = $('#SOBPODate').dxDateBox('instance').option('value');
        var SOBTxtClientName = document.getElementById('SOBTxtClientName').value.trim();

        var alertMSG = "";
        if (SOBSalesRep === "" || SOBSalesRep === null) {
            alertMSG = "Please select job coordinator first..!";
            alert(alertMSG);
            DevExpress.ui.notify(alertMSG, "warning", 1000);
            document.getElementById('SOBSalesRep').style.borderColor = 'red';
            return false;
        }
        document.getElementById('SOBSalesRep').style.borderColor = '';


        if (SOBPrefix === "" || SOBPrefix === null) {
            alertMSG = "Please select job order prefix..!";
            alert(alertMSG);
            DevExpress.ui.notify(alertMSG, "warning", 1000);
            document.getElementById('SOBPrefix').style.borderColor = 'red';
            return false;
        }
        document.getElementById('SOBPrefix').style.borderColor = '';

        if (SOBTxtNo === "" || SOBTxtNo === null) {
            alertMSG = "Please select job order prefix..!";
            alert(alertMSG);
            DevExpress.ui.notify(alertMSG, "warning", 1000);
            document.getElementById('SOBPrefix').style.borderColor = 'red';
            return false;
        }
        document.getElementById('SOBPrefix').style.borderColor = '';


        if (txtPONo === "") {
            alert("Please Enter PO NO.");
            alert(alertMSG);
            DevExpress.ui.notify(alertMSG, "warning", 1000);
            document.getElementById('SOBTxtPONo').focus();
            document.getElementById('SOBTxtPONo').style.borderColor = 'red';
            return false;
        }
        document.getElementById('SOBTxtPONo').style.borderColor = '';

        //if (GridValidation() === false) {
        //    return false;
        //}

        var grid = $('#GridOrdersList').dxDataGrid('instance');
        if (grid._options.dataSource.length <= 0) return false;
        var ObjSaveOrder = [], SaveOrder = {};
        var Objvalid = [], subobjvalid = {};
        var NewOrderBook = [], OrderBook = {};
        var BKIDS = "", PMIDS = "";
        if (FlagEdit === true) {
            SaveOrder.SalesOrderNo = SOBTxtNo;
        }
        OrderBook.BookingPrefix = SOBPrefix;
        OrderBook.LedgerID = GblClientID;
        OrderBook.TotalAmount = 0;
        OrderBook.ProductEstimateID = GBLProductEstimateID;
        OrderBook.PONo = txtPONo;
        OrderBook.PODate = PODate;
        OrderBook.Remark = document.getElementById("SOBRemark").value;
        OrderBook.PODetail = document.getElementById("SOBDeliveryDetails").value.trim();
        OrderBook.SalesEmployeeId = SOBSalesRep;

        NewOrderBook.push(OrderBook);

        //################################################################################################################################################

        for (var i = 0; i < grid._options.dataSource.length; i++) {

            SaveOrder = {}; subobjvalid = {};

            if (FlagEdit === true) {
                SaveOrder.SalesOrderNo = SOBTxtNo;
                SaveOrder.OrderBookingDetailsID = grid._options.dataSource[i].OrderBookingDetailsID;
            }

            SaveOrder.BookingID = grid._options.dataSource[i].ProductEstimateID;
            SaveOrder.NewBookingID = SaveOrder.BookingID;
            if (BKIDS === "") {
                BKIDS = grid._options.dataSource[i].ProductEstimateID;
            } else
                BKIDS = BKIDS + ',' + grid._options.dataSource[i].ProductEstimateID;

            SaveOrder.OrderBookingDate = OrderDate;
            SaveOrder.LedgerID = GblClientID;
            SaveOrder.JobName = grid._options.dataSource[i].ProductName;
            SaveOrder.CategoryID = grid._options.dataSource[i].CategoryID;
            SaveOrder.OrderQuantity = grid._options.dataSource[i].Quantity;
            SaveOrder.ApproveQuantity = grid._options.dataSource[i].Quantity;
            SaveOrder.FinalCost = grid._options.dataSource[i].FinalAmount;
            SaveOrder.VendorID = grid._options.dataSource[i].VendorID;
            SaveOrder.Rate = grid._options.dataSource[i].Rate;
            SaveOrder.ChangeCost = grid._options.dataSource[i].ApprovedCost;
            SaveOrder.RateType = grid._options.dataSource[i].RateType;
            SaveOrder.PONo = txtPONo;
            SaveOrder.PODate = PODate;

            //var monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            //var DD = grid._options.dataSource[i].FinalDeliveryDate;  ///(i, 8); pKp 271217  /// (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            //var DelDate = DD.split("/");
            //var MSplit = Number(DelDate[1]);
            //var date = new Date($('#SOBDate').dxDateBox('instance').option('value'));

            SaveOrder.DeliveryDate = grid._options.dataSource[i].FinalDeliveryDate;
            SaveOrder.ProductionUnitID = 1;
            SaveOrder.ProductCode = 0//grid._options.dataSource[i].ProductCode;
            SaveOrder.JobType = grid._options.dataSource[i].JobType;
            //SaveOrder.ApprovalBy = sel_Approval;
            //SaveOrder.JobCoordinatorID = Sel_Job_Coordinator;
            SaveOrder.JobPriority = grid._options.dataSource[i].JobPriority;
            SaveOrder.BookingPrefix = SOBPrefix;
            SaveOrder.BookingNo = 0//grid._options.dataSource[i].QuotationNo;
            SaveOrder.ProductMasterCode = 0//grid._options.dataSource[i].ProductMasterCode;

            //if (PMIDS === "" && grid._options.dataSource[i].ProductMasterCode !== "") {
            //    PMIDS = '"' + grid._options.dataSource[i].ProductMasterCode + '"';
            //} else if (grid._options.dataSource[i].ProductMasterCode !== "") {
            //    PMIDS = PMIDS + ',' + '"' + 0 /*grid._options.dataSource[i].ProductMasterCode*/ + '"';
            //}

            SaveOrder.ApprovalNo = grid._options.dataSource[i].ApprovalNo;
            SaveOrder.ExpectedDeliveryDate = grid._options.dataSource[i].FinalDeliveryDate;
            SaveOrder.PrePressRemark = grid._options.dataSource[i].PrePressRemark;
            //SaveOrder.NewBookingNo = grid._options.dataSource[i].NewBookingNo;
            SaveOrder.JobReference = grid._options.dataSource[i].JobReference;
            SaveOrder.MiscAmount = grid._options.dataSource[i].MiscAmount;
            SaveOrder.MiscPercantage = grid._options.dataSource[i].MiscPercantage;
            SaveOrder.ShippingCost = grid._options.dataSource[i].ShippingCost;
            SaveOrder.GSTAmount = grid._options.dataSource[i].GSTAmount;
            SaveOrder.GSTPercantage = grid._options.dataSource[i].GSTPercantage;
            SaveOrder.ProfitCost = grid._options.dataSource[i].ProfitCost;
            SaveOrder.ProfitPer = grid._options.dataSource[i].ProfitPer;
            SaveOrder.SalesEmployeeId = SOBSalesRep;
            SaveOrder.JobCoordinatorID = SOBSalesRep;

            //if (txtSchConsignee !== "") {
            //    SaveOrder.ConsigneeID = 0;
            //} else {
            //    SaveOrder.ConsigneeID = $("#SOBConsignee").dxSelectBox("instance").option('value');
            //}
            SaveOrder.ConsigneeID = $("#SOBConsignee").dxSelectBox("instance").option('value');
            SaveOrder.DispatchRemark = document.getElementById("SOBDispatchedDetails").value.trim();
            SaveOrder.Remark = document.getElementById("SOBRemark").value.trim();
            SaveOrder.PODetail = document.getElementById("SOBDeliveryDetails").value.trim();

            SaveOrder.BookingDate = grid._options.dataSource[i].BookingDate;
            SaveOrder.ProductHSNID = grid._options.dataSource[i].ProductHSNID;

            //SaveOrder.BasicAmount = grid._options.dataSource[i].BasicAmount;
            //SaveOrder.TotalAmount = grid._options.dataSource[i].TotalAmount;

            if (Number(grid._options.dataSource[i].CGSTTaxAmount) > 0) {
                SaveOrder.CGSTTaxPercentage = grid._options.dataSource[i].CGSTTaxPercentage;
                SaveOrder.CGSTTaxAmount = grid._options.dataSource[i].CGSTTaxAmount;
            }
            if (Number(grid._options.dataSource[i].SGSTTaxAmount) > 0) {
                SaveOrder.SGSTTaxPercentage = grid._options.dataSource[i].SGSTTaxPercentage;
                SaveOrder.SGSTTaxAmount = grid._options.dataSource[i].SGSTTaxAmount;
            }
            if (Number(grid._options.dataSource[i].IGSTTaxAmount) > 0) {
                SaveOrder.IGSTTaxPercentage = grid._options.dataSource[i].IGSTTaxPercentage;
                SaveOrder.IGSTTaxAmount = grid._options.dataSource[i].IGSTTaxAmount;
            }
            SaveOrder.NetAmount = grid._options.dataSource[i].FinalAmount;
            SaveOrder.TransID = i + 1;

            ObjSaveOrder.push(SaveOrder);

            /////////////validation fields added
            subobjvalid.PONO = txtPONo;
            subobjvalid.LedgerID = SaveOrder.LedgerID;
            subobjvalid.BookingID = SaveOrder.BookingID;
            subobjvalid.ProductCode = SaveOrder.ProductCode;
            subobjvalid.ClientName = SOBTxtClientName;

            Objvalid.push(subobjvalid);
        }
        var NewOrderBookDetails = JSON.stringify(ObjSaveOrder);

        //################################################################################################################################################

        var ObjSchOrder = [];
        var SchOrder = {};
        //var ScheduleGrid = $('#SOBScheduleGrid').dxDataGrid('instance'); //.option("dataSource")
        //ScheduleGrid = ScheduleGrid._options.dataSource;
        var ScheduleGrid = ObjSchDelivery;
        for (i = 0; i < ScheduleGrid.length; i++) {
            SchOrder = {};

            if (FlagEdit === true) {
                SchOrder.SalesOrderNo = SOBTxtNo;
            }
            SchOrder.OrderBookingNo = SOBTxtNo;
            SchOrder.ProductEstimationContentID = ScheduleGrid[i].ProductEstimationContentID;
            SchOrder.JobName = ScheduleGrid[i].JobName;
            SchOrder.ApprovalNo = 0;
            SchOrder.ScheduleQuantity = ScheduleGrid[i].ScheduleQuantity;
            SchOrder.DeliveryDate = ScheduleGrid[i].DeliveryDate;
            SchOrder.ConsigneeID = ScheduleGrid[i].ConsigneeID;
            SchOrder.TransporterID = ScheduleGrid[i].TransporterID;
            SchOrder.TransporterName = ScheduleGrid[i].Transporter;
            SchOrder.BookingID = 0;

            ObjSchOrder.push(SchOrder);
        }
        var ScheduleGridData = JSON.stringify(ObjSchOrder);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        if (FlagEdit === false) {
            ///check valid or not PO no with product code
            $.ajax({
                type: "POST",
                url: "WebServiceOthers.asmx/PreOrderSaveValidation",
                data: '{Objvalid:' + JSON.stringify(Objvalid) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/"/g, '');
                    res = res.replace(/\\n/g, '\n');
                    res = res.replace(/\\/g, '');
                    res = res.replace(/d:/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                    if (res === "Valid") {
                        saveCall();
                    } else if (res === "Session Expired") {
                        alert("Login session expired..!\n Please login and save order again..!");
                    } else {
                        var confirmation = confirm(res);
                        if (confirmation === true) {
                            saveCall();
                        }
                        return;
                    }
                    location.reload();
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert("error occured!");
                }
            });
        } else {
            saveCall();
        }
    } catch (e) {
        console.log(e);
        return;
    }

    function saveCall() {
        try {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebServiceOthers.asmx/SaveNewJobOrder",
                data: '{NewOrderBook:' + JSON.stringify(NewOrderBook) + ',NewOrderBookDetails:' + NewOrderBookDetails + ',ScheduleGridData:' + ScheduleGridData + ',FlagEdit:' + JSON.stringify(FlagEdit) + ',SOBTxtNo:' + JSON.stringify(SOBTxtNo) + ',Prefix:' + JSON.stringify(SOBPrefix) + ',PMIDS:' + JSON.stringify(PMIDS) + ',BKIDS:' + JSON.stringify(BKIDS) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/"/g, '');
                    res = res.replace(/d:/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                    if (res === "Not Editable") {
                        alert("This order is further processed Can't be edit...!");
                        DevExpress.ui.notify("This order is further processed Can't be edit...!!", "warning", 1500);
                    } else if (res === "Success") {
                        if (FlagEdit === true) {
                            alert("Information Updated successfully!");
                            DevExpress.ui.notify("Information Updated successfully!", "success", 1500);
                        } else {
                            DevExpress.ui.notify("Information Saved successfully!", "success", 1500);
                            alert("Information Saved successfully!");
                            FlagEdit = true;
                        }
                    } else if (res === "Session Expired") {
                        DevExpress.ui.notify(res, "error", 1500);
                        alert("Login session expired..!\n Please login and save order again..!");
                    } else {
                        alert(res);
                        return;
                    }
                    location.reload();
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert("error occured!");
                }
            });
        } catch (e) {
            alert(e);
        }
    }

});

function reloadOrderList(data) {
    $("#GridOrdersList").dxDataGrid({
        dataSource: data,
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [
            { allowEditing: false, dataField: "ProductName" },
            { allowEditing: false, dataField: "CategoryName" },
            { allowEditing: false, dataField: "ProductHSNID", caption: "HSN Name", width: 100, validationRules: [{ type: "required" }], lookup: { dataSource: ProductHSNGrp, valueExpr: 'ProductHSNID', displayExpr: 'ProductHSNName' } },
            { allowEditing: false, dataField: "Quantity" },
            { allowEditing: false, dataField: "Rate" },
            { allowEditing: false, dataField: "RateType" },
            //{ allowEditing: false, dataField: "UnitCost" },
            { allowEditing: false, dataField: "GSTPercantage" },
            { allowEditing: false, dataField: "GSTAmount" },
            { allowEditing: false, dataField: "MiscPercantage" },
            { allowEditing: false, dataField: "MiscAmount" },
            { allowEditing: false, dataField: "ShippingCost" },
            { allowEditing: false, dataField: "ProfitPer" },
            { allowEditing: false, dataField: "ProfitCost" },
            { dataField: "CGSTTaxPercentage", caption: "CGST %", width: 60, dataType: "numeric", visible: false, allowEditing: false },
            { dataField: "SGSTTaxPercentage", caption: "SGST %", width: 60, dataType: "numeric", visible: false, allowEditing: false },
            { dataField: "IGSTTaxPercentage", caption: "IGST %", width: 60, dataType: "numeric", visible: false, allowEditing: false },
            { dataField: "CGSTTaxAmount", caption: "CGST", dataType: "numeric", allowEditing: false },
            { dataField: "SGSTTaxAmount", caption: "SGST", dataType: "numeric", allowEditing: false },
            { dataField: "IGSTTaxAmount", caption: "IGST", dataType: "numeric", allowEditing: false },
            { allowEditing: false, dataField: "FinalAmount" },
            { allowEditing: false, dataField: "VendorName" },
            {
                dataField: "FinalDeliveryDate", width: 100, dataType: "date",
                format: "dd-MMM-yyyy", allowEditing: true, validationRules: [{ type: "required", message: "Final date of delivery is required" },
                { type: "range", min: new Date(), message: "Final date of delivery is not valid" }], allowEditing: true
            },
            { dataField: "JobType", visible: true, width: 80, validationRules: [{ type: "required" }], lookup: { dataSource: JobType, valueExpr: 'JobType', displayExpr: 'JobType' }, allowEditing: true },
            { dataField: "JobReference", visible: true, width: 100, validationRules: [{ type: "required" }], lookup: { dataSource: JobReference, valueExpr: 'JobReference', displayExpr: 'JobReference' }, allowEditing: true },
            { dataField: "JobPriority", visible: true, width: 100, validationRules: [{ type: "required" }], lookup: { dataSource: JobPriority, valueExpr: 'JobPriority', displayExpr: 'JobPriority' }, allowEditing: true },
            { dataField: "PrePressRemark", width: 100 }
        ],
        onContentReady: function (e) {
            document.getElementById("TxtTotalOrderQty").value = 0//e.component.getTotalSummaryValue("Quantity");
            document.getElementById("TxtTotalAmt").value = 0 //e.component.getTotalSummaryValue("FinalAmount");
            document.getElementById("TxtNetAmt").value = 0// e.component.getTotalSummaryValue("FinalAmount");
        }
    });
}

$("#BtnNotification").click(function () {
    var bookingIDs = "";
    var productMasterIDs = "";
    var commentData = "";
    var salesOrderNo = "";
    var priceApprovalNo = "";
    var moduleName = "SALES ORDER BOOKING";
    var newHtml = '';

    if (FlagEdit === false) {
        salesOrderNo = "";
        var orderGrid = $("#GridOrdersList").dxDataGrid('instance');
        orderGrid.refresh();
        if (orderGrid._options.dataSource.length > 0) {
            for (var x = 0; x < orderGrid._options.dataSource.length; x++) {
                if (Number(orderGrid._options.dataSource[x].BookingID) > 0) {
                    if (bookingIDs === "") {
                        bookingIDs = orderGrid._options.dataSource[x].BookingID.toString();
                    } else {
                        bookingIDs = bookingIDs + "," + orderGrid._options.dataSource[x].BookingID.toString();
                    }
                }
                if (Number(orderGrid._options.dataSource[x].ProductMasterID) > 0) {
                    if (productMasterIDs === "") {
                        productMasterIDs = orderGrid._options.dataSource[x].ProductMasterID.toString();
                    } else {
                        productMasterIDs = productMasterIDs + "," + orderGrid._options.dataSource[x].ProductMasterID.toString();
                    }
                }
            }

            document.getElementById("commentbody").innerHTML = "";
            if (bookingIDs !== "" || productMasterIDs !== "") {
                $.ajax({
                    type: "POST",
                    url: "WebServiceOthers.asmx/GetCommentData",
                    data: '{bookingIDs:' + JSON.stringify(bookingIDs) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
        }
    } else {
        salesOrderNo = document.getElementById('SOBTxtNo').value.trim();
        if (salesOrderNo === "" || salesOrderNo === null || salesOrderNo === undefined) {
            alert("Please select valid sales order to view comment details..!");
            return false;
        }
        priceApprovalNo = "";
        document.getElementById("commentbody").innerHTML = "";
        if (salesOrderNo !== "") {
            bookingIDs = "";
            productMasterIDs = "";
            $.ajax({
                type: "POST",
                url: "WebServiceOthers.asmx/GetCommentData",
                data: '{bookingIDs:' + JSON.stringify(bookingIDs) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
        var salesOrderNo = "";
        var moduleName = "SALES ORDER BOOKING";
        salesOrderNo = document.getElementById('SOBTxtNo').value.trim();
        if (salesOrderNo === "" || salesOrderNo === null || salesOrderNo === undefined) {
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
        objectCommentDetail.ModuleName = "Sales Order Booking";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        //objectCommentDetail.TransactionID = purchaseid;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        var priceApprovalNo = "";
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/SaveCommentData",
            data: '{jsonObjectCommentDetail:' + jsonObjectCommentDetail + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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
                salesOrderNo = document.getElementById('SOBTxtNo').value.trim();
                if (salesOrderNo === "" || salesOrderNo === null || salesOrderNo === undefined) {
                    alert("Please select valid sales order to view comment details..!");
                    return false;
                }
                var priceApprovalNo = "";
                var bookingIDs = "";
                var productMasterIDs = "";
                document.getElementById("commentbody").innerHTML = "";
                if (salesOrderNo !== "") {
                    $.ajax({
                        type: "POST",
                        url: "WebServiceOthers.asmx/GetCommentData",
                        data: '{bookingIDs:' + JSON.stringify(bookingIDs) + ',productMasterIDs:' + JSON.stringify(productMasterIDs) + ',salesOrderNo:' + JSON.stringify(salesOrderNo) + ',priceApprovalNo:' + JSON.stringify(priceApprovalNo) + ',moduleName:' + JSON.stringify(moduleName) + '}',
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