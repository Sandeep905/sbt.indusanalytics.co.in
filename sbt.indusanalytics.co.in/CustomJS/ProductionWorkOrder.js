"use strict";

// *****  Declare Global varialbe  ****
var check = "Pending", GblContentName, GblGenCode, GblProdMasCode = "", GblContentType, GblFlagFormName, GblCommandName, GblJobCardNo = "";
var GblProductContID = 0, GblContentId = 0, GblProdMasID = 0, GblBookingID = 0, GblJobBookingID = 0, GblOrderQuantity = 0, GblPaperId = 0;

// *****  Declare Global Objects  ****
var ObjContentsDataAll, TablePendingData = [], GblObjProcessItemReq = {};

// *****  Declare Global Flags  ****
var FlagEdit = false, FlagExport = false, ChkCond = false;
//var GblLoadingmsg = "Loading....";

var ObjProcessData = [], ObjStandardInkdata = [];
var ObjContentsData = [];
var GblJobType = [], GblPlateType = [];
var GblObjToolDetails = [];

$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: "Loading ...",
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#SbConsigneeName").dxSelectBox({
    //value: [3],
    valueExpr: "ConsigneeID",
    placeholder: "Select consignee...",
    displayExpr: "ConsigneeName",
    showClearButton: true
});

//Department Name
$("#SelDepartment").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    searchEnabled: true,
    showClearButton: true
});

$("#SelPODate").dxDateBox({
    pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    max: new Date(),
    onValueChanged: function (data) {
        var PDate = data.value;
        $("#SelDeliveryDate").dxDateBox({
            min: PDate
        });
    }
});

$("#SelDeliveryDate").dxDateBox({
    pickerType: "rollers",
    value: new Date(),
    displayFormat: "dd-MMM-yyyy",
    min: new Date()
});

$.ajax({
    type: "POST",
    url: "WebServiceProductionWorkOrder.asmx/GetDepartmentName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var Departmentname = JSON.parse(res);

        $("#SelDepartment").dxSelectBox({
            items: Departmentname
        });
    }
});

function CheckEligibility() {///////// *********  For Defult check for Export *************
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/IsEligible",
        data: '{Command:' + GblCommandName + ',FormName:' + GblFlagFormName + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');

            if (res === true || res === "true") {
                FlagExport = true;
                if (ChkCond === false) {
                    $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
                    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
                    LoadPendingProcessData();
                }
            }
            else {
                FlagExport = false;
                if (ChkCond === false) {
                    $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
                    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
                    LoadPendingProcessData();
                }
            }
            ChkCond = true;
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
        }
    });
}

$.ajax({                //// For Job Type And Plate Type
    type: 'post',
    async: false,
    url: 'WebServiceOthers.asmx/SelctboxTypes',
    data: {},
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"{null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        if (RES1.TblJobType !== undefined) {
            GblJobType = RES1.TblJobType;
            GblPlateType = RES1.TblPlateType;
        }
        $("#SbJobType").dxSelectBox({
            items: GblJobType
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

////***********   Generate Job Booking Job Card No  ********************
function GenerateJobCardNo() {
    try {
        $.ajax({
            type: 'post',
            url: 'WebServiceProductionWorkOrder.asmx/GenerateJobCardNo',
            data: '{}',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text',
            async: false,
            crossDomain: true,
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var strmax = res.split(',');
                GblGenCode = strmax[0];
            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

////***********   Generate Content Id  ********************
//$.ajax({
//    type: 'post',
//    url: 'WebServiceProductionWorkOrder.asmx/GenerateContentIdJobcard',
//    data: '{}',
//    contentType: 'application/json; charset=utf-8',
//    dataType: 'text',
//    success: function (results) {
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"/g, '');
//        res = res.replace(/d:/g, '');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        GblContentId = Number(res);
//    },
//    error: function errorFunc(jqXHR) {
//        // alert("not show");
//    }
//});

function LoadPendingProcessData() {
    $.ajax({
        type: 'POST',
        url: "WebServiceProductionWorkOrder.asmx/GridPendingProcessData",
        data: '{check:' + JSON.stringify(check) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -3);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());
            var columns;
            if (check === "Pending") {
                columns = [
                    { dataField: "LedgerName", caption: "Client Name", width: 200 },
                    { dataField: "SalesOrderNo", caption: "Order No" },
                    { dataField: "BookingDate", caption: "Order Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 120 },
                    { dataField: "ProductMasterCode", caption: "Product Catalog Code" },
                    { dataField: "CategoryName", caption: "Category" },
                    { dataField: "JobName", caption: "Job Name", width: 150 }, "ProductCode",
                    { dataField: "BookingNo", caption: "Quote No" }, "OrderQty",
                    { dataField: "BookedBy", caption: "Order Bkd By" }, "DeliveryDate", "FYear"
                ];
            } else {
                columns = [
                    { dataField: "SalesOrderNo", caption: "Order Booking No", width: 100 },
                    { dataField: "PONo", caption: "PO No", width: 70 },
                    { dataField: "PODate", caption: "PO Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80 },
                    { dataField: "JobBookingNo", caption: "Job Card No" },
                    { dataField: "BookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80 },
                    { dataField: "CategoryName", caption: "Job Type" },
                    { dataField: "LedgerName", caption: "Client Name", width: 180 },
                    { dataField: "JobName", caption: "Job Name", width: 200 },
                    { dataField: "OrderQty", caption: "Order Qty" },
                    { dataField: "BookedBy", caption: "Job Created By" },
                    { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy', Mode: "DateRangeCalendar", width: 80 },
                    { dataField: "ProductMasterCode", caption: "Product Catalog Code", width: 100 }, "ProductCode",
                    { dataField: "BookingNo", caption: "Quote No" }, "FYear"
                ];
            }
            $("#GridPendingProcessData").dxDataGrid({
                dataSource: RES1,
                columns: columns
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

$("#GridPendingProcessData").dxDataGrid({
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
        enabled: FlagExport,
        fileName: "JobCard ",
        allowExportSelectedData: true
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    filterRow: { visible: true },
    ////rowAlternationEnabled: true,
    searchPanel: { visible: false },
    onSelectionChanged: function (data) {
        TablePendingData = [];
        if (data) {
            TablePendingData = data.selectedRowsData;
            //if (data.selectedRowsData.length <= 0) { return false; }
            //GblOrderQuantity = data.selectedRowsData[0].Quantity;
            //GblBookingID = data.selectedRowsData[0].BookingID;
            //GblProdMasCode = data.selectedRowsData[0].ProductMasterCode;
            //GblJobCardNo = data.selectedRowsData[0].JobBookingNo;
            //GblJobBookingID = data.selectedRowsData[0].JobBookingID;
            //if (GblJobCardNo === undefined) {
            //    GblJobCardNo = ""; GblJobBookingID = 0;
            //}
            //(async () => {
            //    await removeAllContentsData();
            //})();
            //GetSelectedContentPlans();
            //if (check === "Pending") {
            //    FlagEdit = false;
            //    document.getElementById("TxtBookingNoAuto").value = GblGenCode;
            //    document.getElementById("BtnDeleteJobcard").style.display = "none";
            //} else {
            //    FlagEdit = true;
            //    GblGenCode = data.selectedRowsData[0].BookingNo;
            //    document.getElementById("TxtBookingNoAuto").value = GblGenCode;
            //    document.getElementById("BtnDeleteJobcard").style.display = "block";
            //}

            //$('#TxtQuantity').val(data.selectedRowsData[0].OrderQty);
            //$('#TxtJobName').val(data.selectedRowsData[0].JobName);
            //$('#TxtOrderQuantity').val(data.selectedRowsData[0].OrderQty);
            //$('#TxtOrderBookingDate').val(data.selectedRowsData[0].BookingDate);
            //$('#TxtOrderBookingNo').val(data.selectedRowsData[0].SalesOrderNo);
            //$('#TxtPONo').val(data.selectedRowsData[0].PONo);
            //$('#TxtPODate').val(data.selectedRowsData[0].PODate);
            //$('#TxtQuoteNo').val(data.selectedRowsData[0].BookingNo);
            //$('#TxtDeliveryDate').val(data.selectedRowsData[0].DeliveryDate);
            //$('#TxtProductCode').val(data.selectedRowsData[0].ProductCode);
            //$('#TxtEmail').val(data.selectedRowsData[0].Email);
            //$('#TxtRemark').val(data.selectedRowsData[0].Remark);

            //$("#SbClientName").dxSelectBox({ value: data.selectedRowsData[0].LedgerID });
            //$("#SbJobCoordinator").dxSelectBox({ value: data.selectedRowsData[0].CoordinatorLedgerID });
            //$("#SbJobPriority").dxSelectBox({ value: data.selectedRowsData[0].JobPriority });
            //$("#SbJobType").dxSelectBox({ value: data.selectedRowsData[0].JobType });
            //$("#SbJobReference").dxSelectBox({ value: data.selectedRowsData[0].JobReference });
            //$("#SbCategory").dxSelectBox({ value: data.selectedRowsData[0].CategoryID });
            //$("#SbProductHSNGroup").dxSelectBox({ value: data.selectedRowsData[0].ProductHSNID });

        } else {
            TablePendingData = [];
            GblOrderQuantity = 0;
            GblBookingID = 0;
            GblProdMasCode = "";
            $('#TxtJobName').val("");
            GblJobCardNo = ""; GblJobBookingID = 0;
        }
    }
});

////var ContRowNo, ContColNo;
////function FuncGridContents() {
////    $.ajax({
////        type: 'POST',
////        url: "WebServiceProductionWorkOrder.asmx/GridProductContentsData",
////        data: '{BookingId:' + GblBookingID + ', ProductType:' + JSON.stringify("Product") + ',check:' + JSON.stringify(check) + ',ProdMasCode:' + JSON.stringify(GblProdMasCode) + ',Quantity:' + GblOrderQuantity + '}',
////        contentType: 'application/json; charset=utf-8',
////        dataType: 'text',
////        success: function (results) {
////            var res = results.replace(/\\/g, '');
////            res = res.replace(/{"d":null/g, '');
////            res = res.replace(/{"d":""/g, '');
////            res = res.slice(0, -3);
////            ObjContentsDataAll = JSON.parse(res.toString());
////            $("#GridProductContentDetails").dxDataGrid({
////                dataSource: ObjContentsDataAll
////            });
////        },
////        error: function errorFunc(jqXHR) {
////            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
////        }
////    });
////}
$(function () {
    var VisibleIndex = 0, ContStore = [];
    var gridCont = $("#GridProductContentDetails").dxDataGrid({
        dataSource: [],
        allowColumnReordering: true,
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowDeleting: true,
            useIcon: true
        },
        allowColumnResizing: true,
        columnResizingMode: "widget",
        showRowLines: true,
        sorting: false,
        showBorders: true,
        columnFixing: {
            enabled: true
        },
        selection: { mode: "single" },
        height: function () {
            return window.innerHeight / 3.5;
        },
        //    columnAutoWidth: true,
        columns: [{
            type: "buttons",
            width: 50,
            buttons: ["delete"
                //, {
                //hint: "Clone",
                //icon: "repeat",
                ////visible: function (e) {
                ////    return !e.row.isEditing && !isChief(e.row.data.Position);
                ////},
                //onClick: function (e) {
                //    var clonedItem = $.extend({}, e.row.data, { ID: ++maxID });
                //    employees.splice(e.row.rowIndex, 0, clonedItem);
                //    e.component.refresh(true);
                //    e.event.preventDefault();
                //}
                //}
            ]
        },
        { dataField: "PlanContentType", caption: "Content Type", allowEditing: false, minWidth: 100 },
        { dataField: "PlanContName", caption: "Content Name", minWidth: 150, validationRules: [{ type: 'required', message: 'Content name is required' }] },
        { dataField: "PlanContQty", caption: "Quantity", allowEditing: false, visible: false },
        { dataField: "JobPrePlan", caption: "Job Size", minWidth: 100, allowEditing: false },
        { dataField: "PaperSize", allowEditing: false, minWidth: 80 },
        { dataField: "CutSize", caption: "Printing Sheet Size", allowEditing: false, minWidth: 80, visible: true },
        { dataField: "TotalUps", caption: "Ttl Ups", allowEditing: false, visible: true, minWidth: 50 },
        { dataField: "ItemPlanQuality", caption: "Quality", allowEditing: false, minWidth: 100 },
        { dataField: "ItemPlanGsm", caption: "GSM", allowEditing: false, minWidth: 80 },
        { dataField: "ItemPlanMill", caption: "Mill", allowEditing: false, minWidth: 80 },
        { dataField: "NoOfPages", caption: "Pages", allowEditing: false, visible: false, minWidth: 30 },
        { dataField: "PrintingStyle", allowEditing: false, visible: true, minWidth: 100 },
        {
            dataField: "JobTrimming", allowEditing: false, minWidth: 80,
            calculateCellValue(e) {
                if (e === undefined) return;
                if (e.Trimmingleft === undefined || e.Trimmingleft === "undefined") return "";
                var jobtrim = 'L=' + e.Trimmingleft + '; T=' + e.Trimmingtop + '; R=' + e.Trimmingright + '; B=' + e.Trimmingbottom;
                return jobtrim;
            }
        },
        {
            dataField: "PrintingImpressions", caption: "Ttl Impressions", allowEditing: false,
            visible: true, minWidth: 80,
            calculateCellValue(e) {
                if (e === undefined) return;
                if (e.ActualSheets === undefined || e.ActualSheets === "undefined") return 0;
                return e.ActualSheets + e.WastageSheets;
            }
        },
        { dataField: "PlanFColor", caption: "F Color", allowEditing: false, minWidth: 50 },
        { dataField: "PlanBColor", caption: "B Color", allowEditing: false, minWidth: 50 },
        { dataField: "PlanSpeFColor", caption: "Spe. F Color", allowEditing: false, minWidth: 50 },
        { dataField: "PlanSpeBColor", caption: "Spe. B Color", allowEditing: false, minWidth: 50 },
        {
            dataField: "UnitCost", caption: "Unit Cost", allowEditing: false, minWidth: 50,
            calculateCellValue(e) {
                if (e === undefined) return;
                if (e.GrantAmount !== undefined && e.GrantAmount > 0) {
                    var unitCost = Number(Number(e.GrantAmount) / Number(GblOrderQuantity)).toFixed(3);
                    return unitCost;
                } else
                    return 0;
            }
        },
        {
            dataField: "OldUnitCost", caption: "Old Unit Cost", allowEditing: false, minWidth: 80,
            calculateCellValue(e) {
                if (e === undefined) return;
                if (e.OldGrantAmount === undefined || e.OldGrantAmount <= 0) e.OldGrantAmount = e.GrantAmount;
                if (e || e.OldGrantAmount !== undefined && e.OldGrantAmount > 0) {
                    var unitCost = Number(Number(e.OldGrantAmount) / Number(GblOrderQuantity)).toFixed(3);
                    return unitCost;
                } else
                    return 0;
            }
        },
        { dataField: "FullSheets", caption: "Paper Qty(Sheets)", allowEditing: false, visible: true, minWidth: 80 },
        {
            caption: "Paper Qty(Packs)", minWidth: 80,
            calculateCellValue(e) {
                if (!e) return;
                var SizeL = 0, SizeW = 0; var pperpack = '';
                SizeL = e.PaperSize.split('x')[0];
                SizeW = e.PaperSize.split('x')[1];
                if (e.PlanType === 'Sheet Planning') {
                    pperpack = Number(e.FullSheets + Number(Number(e.UnitPerPacking) - Number(Number(e.FullSheets) % Number(e.UnitPerPacking)))) /
                        Number(e.UnitPerPacking) + ' ' + e.Packing + ' (' + e.UnitPerPacking + ') & (' +
                        Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                            * Number(e.FullSheets), 0) + ' KG)';
                    return pperpack;
                } else if (e.PurchaseUnit !== undefined && e.PurchaseUnit !== "" && e.PurchaseUnit !== null) {
                    if (e.PurchaseUnit.toUpperCase() === "KG") {
                        pperpack = Number(e.FullSheets) + ' Sheets & (' +
                            Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                                * Number(e.FullSheets), 0) + ' KG)';
                    } else if (e.PurchaseUnit.toUpperCase().includes("SHEET") === true) {
                        pperpack = Number(e.FullSheets) + ' Sheets & (' +
                            Math.round(Number(Number(SizeW) / 1000) * Number(e.FullSheets), 2) + ' Meter)';
                    }
                    return pperpack;
                } else {
                    pperpack = Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                        * Number(e.FullSheets), 0) + ' KG';
                    return pperpack;
                }
            }, allowEditing: false
        },
        { dataField: "ActualSheets", caption: "Cut Sheet Qty", allowEditing: false, visible: true, minWidth: 100 },
        {
            dataField: "PaperBy", allowEditing: false, visible: true, minWidth: 80,
            calculateCellValue(e) {
                var paperby = "Self";
                if (e === undefined) return;
                if (e.ChkPaperByClient === true) {
                    paperby = 'Client';
                }
                return paperby;
            }
        },
        { dataField: "GrainDirection", allowEditing: false, visible: true, minWidth: 80 },
        { dataField: "MachineName", allowEditing: false, visible: true, minWidth: 80 },
        { dataField: "PlateQty", caption: "Plates", allowEditing: false, visible: true, minWidth: 50 },
        { dataField: "PlanOnlineCoating", allowEditing: false, visible: true, minWidth: 80 },
        { dataField: "PlanType", allowEditing: false, visible: true, minWidth: 80 },
        {
            dataField: "StripingMargin", allowEditing: false, visible: true, minWidth: 80,
            calculateCellValue(e) {
                if (e === undefined) return;
                if (e.Stripingleft === undefined) return "";
                var jobstrip = 'L=' + e.Stripingleft + '; T=' + e.Stripingtop + '; R=' + e.Stripingright + '; B=' + e.Stripingbottom;
                return jobstrip;
            }
        },
        {
            dataField: "JobType", allowEditing: true, minWidth: 80,
            lookup: {
                dataSource: GblJobType,
                displayExpr: "JobType",
                valueExpr: "JobType"
            }
        }],
        onContentReady: function (e) {
            window.setTimeout(function () {
                if (!e.component.getSelectedRowKeys().length)
                    e.component.selectRowsByIndexes(0);
            }, 1000);
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
            if (e.rowType === "data") {
                if (e.data.OldGrantAmount < e.data.GrantAmount) {
                    e.rowElement.css('background', '#ff8080');
                }
            }
        },
        onRowUpdating: function (e) {
            if (e.newData.PlanContName === undefined) return;
            var result = $.grep(e.component._options.dataSource, function (ex) {
                return ex.PlanContName.trim() === e.newData.PlanContName.trim() && ex.PlanContentType === e.key.PlanContentType;
            });
            if (result.length >= 1) {
                swal("Duplicate Content Name Found!", "Please enter different content name..!", "error");
                e.newData.PlanContName = e.key.PlanContName;
                return;
            }
            renameContentsData(e.newData.PlanContName.trim(), e.key.PlanContName.trim(), e.key.PlanContentType.trim());
        },
        onRowRemoved: function (e) {
            deleteDataContentsWise(e.data.PlanContName, e.data.PlanContentType); ////Delete data from data store
        },
        onSelectionChanged: function (data) {
            if (data) {
                if (data.selectedRowsData.length <= 0) {
                    GblContentName = "";
                    GblContentType = ""; GblPaperId = 0;
                    clearData();
                    GblPlanValues = {};
                    GblContentId = 0;
                    return false;
                }
                try {
                    GblContentName = data.selectedRowsData[0].PlanContName;
                    GblContentType = data.selectedRowsData[0].PlanContentType;
                    GblContentId = data.selectedRowsData[0].JobBookingJobCardContentsID;
                    document.getElementById("PlanContentName").value = GblContentName;
                    document.getElementById("PlanContentType").value = GblContentType;

                    document.getElementById("PlanContName").innerHTML = GblContentName;
                    document.getElementById("ContentOrientation").innerHTML = GblContentType;

                    GblPaperId = data.selectedRowsData[0].PaperID;
                    document.getElementById("PlanContQty").innerHTML = GblOrderQuantity;
                    document.getElementById("TxtProductRemark").value = data.selectedRowsData[0].SpecialInstructions;

                    //$('#TxtLineNo').val(ObjContentsDataAll[0].LineNo);
                    if (GblProdMasCode === "" || GblProdMasCode === null || GblProdMasCode === undefined || GblProdMasCode === "null") {
                        //consol.log("passed");
                    }
                    else {
                        $('#TxtRemark').val(ObjContentsDataAll[0].JobDetailsRemark);
                    }
                    ProcesssData();
                    LoadInkShadeSelected();
                    GblPlanValues = data.selectedRowsData[0];

                    var keys = data.component.getSelectedRowKeys();
                    ContStore = data.component._options.dataSource;
                    for (var i = 0; i < keys.length; i++) {
                        VisibleIndex = gridCont.getRowIndexByKey(keys[i]);
                    }
                    if (data.selectedRowsData[0].AttachedFileName !== null && data.selectedRowsData[0].UserAttachedPicture !== null) {
                        var ext = data.selectedRowsData[0].AttachedFileName.split(';')[0].match(/jpeg|png|gif|jpg/)[0];
                        $("#PreviewAttachedFile").fadeIn("fast").attr('src', "data:image/" + ext + ";base64," + data.selectedRowsData[0].UserAttachedPicture);
                    } else {
                        $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
                    }
                } catch (Ex) {
                    //alert(Ex);
                }
            }
        }
    }).dxDataGrid('instance');

    $("#ContSelMoveUp").click(function () {
        if (VisibleIndex <= 0 || VisibleIndex === undefined || ContStore.length <= 0) return;
        SortContentSequence(ContStore[VisibleIndex].PlanContName, ContStore[VisibleIndex].PlanContentType, ContStore[VisibleIndex].SequenceNo, ContStore[VisibleIndex].SequenceNo - 1);
        gridCont._options.dataSource = array_move(ContStore, VisibleIndex, VisibleIndex - 1);
        VisibleIndex = VisibleIndex - 1;
        gridCont.refresh();
    });

    $("#ContSelMoveDown").click(function () {
        if (ContStore.length <= 0) return;
        if (VisibleIndex === ContStore.length - 1 || VisibleIndex === undefined) return;
        SortContentSequence(ContStore[VisibleIndex].PlanContName, ContStore[VisibleIndex].PlanContentType, ContStore[VisibleIndex].SequenceNo, ContStore[VisibleIndex].SequenceNo + 1);
        gridCont._options.dataSource = array_move(ContStore, VisibleIndex, VisibleIndex + 1);
        VisibleIndex = VisibleIndex + 1;
        gridCont.refresh();
    });

});

$("#GridProcessMaterialList").dxDataGrid({
    dataSource: [],
    filterRow: { visible: true },
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    selection: { mode: "single" },
    columns: [
        { dataField: "ItemID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemGroupID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemGroupNameID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemSubGroupID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemCode", allowEditing: false },
        { dataField: "ItemGroupName", allowEditing: false, caption: "Group Name" },
        { dataField: "ItemSubGroupName", allowEditing: false, caption: "Sub Group" },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false },
        { dataField: "StockUnit", allowEditing: false },
        { dataField: "PhysicalStock", caption: "Stock", allowEditing: false },
        { dataField: "Rate", caption: "Rate", allowEditing: false, format: { type: "decimal", precision: 3 } }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 2.3;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (data) {
        if (data) {
            if (data.selectedRowsData.length <= 0) {
                document.getElementById("TxtMaterialID").value = 0;
                document.getElementById("TxtItemGroupID").value = 0;
                document.getElementById("TxtItemGroupNameID").value = 0;
                return;
            }
            GblObjProcessItemReq.StockUnit = data.selectedRowsData[0].StockUnit;
            GblObjProcessItemReq.Rate = Number(data.selectedRowsData[0].Rate);
            GblObjProcessItemReq.ItemID = Number(data.selectedRowsData[0].ItemID);
            GblObjProcessItemReq.ItemCode = data.selectedRowsData[0].ItemCode;
            GblObjProcessItemReq.ItemName = data.selectedRowsData[0].ItemName;

            document.getElementById("TxtMaterialStockUnit").value = data.selectedRowsData[0].StockUnit;
            document.getElementById("TxtMaterialID").value = Number(data.selectedRowsData[0].ItemID);
            document.getElementById("TxtItemGroupID").value = Number(data.selectedRowsData[0].ItemGroupID);
            document.getElementById("TxtItemGroupNameID").value = Number(data.selectedRowsData[0].ItemGroupNameID);
            var Qty = 0, WastQty = 0; var rowData, SheetL = 0, TotalSheets = 0, NoOfPages = 0;
            TotalSheets = Number(GblPlanValues.ActualSheets);
            SheetL = GblPlanValues.CutSize.split('x')[0];
            NoOfPages = GblPlanValues.JobNoOfPages;
            rowData = data.selectedRowsData[0];

            if (rowData.ItemConsumptionFormula !== "" && rowData.ItemConsumptionFormula !== "null" && rowData.ItemConsumptionFormula !== null) {
                try {
                    Qty = eval(rowData.ItemConsumptionFormula);

                    TotalSheets = Number(GblPlanValues.WastageSheets);
                    WastQty = eval(rowData.ItemConsumptionFormula);
                } catch (e) {
                    console.log(e);
                    document.getElementById("TxtRequiredMaterialQty").value = 0;
                }
            }
            document.getElementById("TxtRequiredMaterialQty").value = Number(Qty) + Number(WastQty);
            GblObjProcessItemReq.RequiredQty = Number(Qty) + Number(WastQty);
            GblObjProcessItemReq.WasteQty = Number(WastQty);
        } else {
            document.getElementById("TxtRequiredMaterialQty").value = 0;
            document.getElementById("TxtMaterialID").value = 0;
            document.getElementById("TxtItemGroupID").value = 0;
            document.getElementById("TxtItemGroupNameID").value = 0;
        }
    }
});

$("#GridProcessMaterialRequired").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    columns: [{ dataField: "ItemID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemGroupID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemGroupNameID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessID", visible: false, width: 0, allowEditing: false },
    { dataField: "MachineID", allowEditing: false, visible: false }, { dataField: "MachineName", allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
    { dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", allowEditing: false }, { dataField: "RequiredQty", allowEditing: false }, { dataField: "EstimatedQuantity", allowEditing: false, visible: false },
    { dataField: "Rate", allowEditing: false }, { dataField: "Amount", allowEditing: false }, { dataField: "StockUnit", allowEditing: false }, { dataField: "Remark", allowEditing: false }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    editing: {
        allowDeleting: true
    },
    height: function () {
        return window.innerHeight / 3;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$.ajax({
    type: 'POST',
    url: "WebServiceProductionWorkOrder.asmx/LoadAllInksList",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},    // "{'name': '" + Method_Name + "'}",
    crossDomain: true,
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);

        ShowInkSelectGrid(JSON.parse(res.toString()));
    },
    error: function errorFunc(jqXHR) {
        // alert(jqXHR.message);
    }
});

LoadPendingProcessData();

$("#RadioPMPendingProc").dxRadioGroup({
    items: ["Pending", "Processed"],
    value: "Pending",
    layout: 'horizontal',
    onValueChanged: function (e) {
        check = e.value;
        var grid = $("#GridPendingProcessData").dxDataGrid('instance');
        grid.clearSelection();
        if (check === "Pending") {
            FlagEdit = false;
            $("#BtnDeleteJobcard").addClass("hidden");
            $("#BtnPrintJobcard").addClass("hidden");
        } else {
            FlagEdit = true;
            $("#BtnDeleteJobcard").removeClass("hidden");
            $("#BtnPrintJobcard").removeClass("hidden");
        }
        $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        LoadPendingProcessData();
    }
});

ShowAllProcesss();

//// ***************   For All Buttons  **********************************************

// *****  Declare Globle Objects  ****
var masterItemDataSource = [], OBJSaveSendRequisition = [], bookedItemDataSource = [];
// *****  Declare Globle Flags  ****
var SPRowNo = "", FlagRemoveRow = false;

$.ajax({                //// For Category
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetSbCategory',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: {},
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbCategory").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

$.ajax({                //// For Customer
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetSbClient',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        //alert(res);
        var RES1 = JSON.parse(res);
        $("#SbClientName").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

/*
 // load consignee list of particular customer 
 */
function loadConsigneeData(clientID, consigneeID) {
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetConsigneeData",
        data: '{ClientID:' + clientID + '}',//
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
            consigneeID = Number(consigneeID);
            $("#SbConsigneeName").dxSelectBox({
                dataSource: RES1,
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
                value: Number(consigneeID)
            });

        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
}
$.ajax({                //// For Job Priority
    type: 'post',
    url: 'WebServiceOthers.asmx/SelctboxJobPriority',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobPriority").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

$.ajax({                //// For Job Reference
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
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobReference").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

$.ajax({                //// For Job Coordinator
    type: 'post',
    url: 'WebServiceProductionWorkOrder.asmx/LoadJobCoordinators',
    data: {},
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.replace(/u0026/g, '&');
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SbJobCoordinator").dxSelectBox({
            items: RES1
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
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        $("#SbProductHSNGroup").dxSelectBox({
            items: RES1,
            placeholder: "Select...",
            displayExpr: "ProductHSNName",
            valueExpr: "ProductHSNID",
            searchEnabled: true,
            showClearButton: true
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Product HSN Group is required' }]
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

$("#GridJCFormWise").dxDataGrid({
    dataSource: [],
    showRowLines: true,
    columnAutoWidth: true,
    sorting: false,
    columnResizingMode: "widget",
    showBorders: true,
    height: function () {
        return window.innerHeight / 5;
    },
    scrolling: true,
    columns: [{ dataField: "PlanContName", caption: "Content Name" }, { dataField: "Forms" }, { dataField: "MachineName" },// { dataField: "PlateSize" },
    { dataField: "NoOfColors", caption: "Colors(F/B)" }, { dataField: "TotalUps" }, { dataField: "Sets" }, { dataField: "Sheets" }, { dataField: "Pages" }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$("#GridJCFormWiseDetail").dxDataGrid({
    dataSource: [],
    showRowLines: true,
    columnAutoWidth: true,
    sorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.2;
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    rowDragging: {
        allowReordering: true,
        onReorder: function (e) {
            var visibleRows = e.component.getVisibleRows(),
                toIndex = e.component._options.dataSource.indexOf(visibleRows[e.toIndex].data),
                fromIndex = e.component._options.dataSource.indexOf(e.itemData);

            e.component._options.dataSource.splice(fromIndex, 1);
            e.component._options.dataSource.splice(toIndex, 0, e.itemData);

            e.component.refresh();
        }
    },
    columns: [{ dataField: "JobCardFormNo", caption: "Form No", allowEditing: false }, { dataField: "PlanContName", caption: "Content", allowEditing: false }, { dataField: "MachineName", caption: "Machine", allowEditing: false },// { dataField: "PlateSize" },
    { dataField: "PlateSize", allowEditing: false }, { dataField: "ColorsFB", caption: "Colors(F/B)", allowEditing: false }, { dataField: "Pages", allowEditing: false }, { dataField: "Ups", caption: "Ups", allowEditing: false }, { dataField: "RefNo", caption: "Ref Form No", allowEditing: true }, { dataField: "SetsForms", caption: "Sets/Forms", allowEditing: false }, { dataField: "SheetSize", caption: "Sheet Size", allowEditing: false },
    { dataField: "ActualSheets" }, { dataField: "WasteSheets" }, { dataField: "TotalSheets", caption: "Ttl Sheets", allowEditing: false }, { dataField: "PrintingStyle", caption: "Printing Style", allowEditing: false }, { dataField: "PaperDetails", caption: "Paper Details", allowEditing: false }, { dataField: "FoldingStyle", caption: "Folding Style", allowEditing: true }, { dataField: "TotalFolds", caption: "Ttl Folds", allowEditing: true },
    { dataField: "PrintingRemark", caption: "Printing Remark", allowEditing: true }, { dataField: "FoldingRemark", caption: "Folding Remark", allowEditing: true }, { dataField: "OtherRemark", caption: "Other Remark", allowEditing: true }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onRowUpdated: function (e) {
        e.data.TotalSheets = e.data.ActualSheets + e.data.WasteSheets;
    },
    summary: {
        totalItems: [{
            column: "ActualSheets",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }, {
            column: "WasteSheets",
            summaryType: "sum",
            displayFormat: "{0}"
        }, {
            column: "TotalSheets",
            summaryType: "sum",
            displayFormat: "{0}"
        }]
    }
});

$("#SelProcessMachine").dxSelectBox({
    displayExpr: "MachineName",
    valueExpr: "MachineID",
    searchEnabled: true,
    showClearButton: true
});

$("#BtnShadeSelection").click(function () {
    document.getElementById("InkShadeSelection").style.display = "block";
    document.getElementById("ProcessMaterialRequirement").style.display = "none";
    document.getElementById("LblTitleShadeMaterial").innerHTML = "Ink Shade Selection";
    OpenCloseModal(true, "BtnShadeSelection", "#modalShadeSelection");
});

$("#BtnProcessMaterialReq").click(function () {
    document.getElementById("InkShadeSelection").style.display = "none";
    document.getElementById("ProcessMaterialRequirement").style.display = "block";
    document.getElementById("LblTitleShadeMaterial").innerHTML = "Material Requirements";
    var ObjStore = [];
    //Clear all inputs
    clearMaterialRequireInputs();
    $('#GridProcessMaterialRequired').dxDataGrid({ dataSource: ObjStore });
    var objectMaterial = db.transaction("JobContentsMaterialRequired").objectStore("JobContentsMaterialRequired");
    objectMaterial.openCursor().onsuccess = function (event) {
        var curOper = event.target.result;
        if (curOper) {
            if (Number(curOper.value.PlanContQty) === GblOrderQuantity && curOper.value.PlanContName === GblContentName && curOper.value.PlanContentType === GblContentType) {
                for (var val = 0; val < curOper.value.length; val++) {
                    if (curOper.value[val].ItemGroupNameID !== -1 && curOper.value[val].ItemGroupNameID !== -2) {
                        ObjStore.push(curOper.value[val]);
                    }
                }
                if (ObjStore.length > 0) {
                    $('#GridProcessMaterialRequired').dxDataGrid({ dataSource: ObjStore });
                    return;
                }
            }
            curOper.continue();
        }
    };

    OpenCloseModal(true, "BtnProcessMaterialReq", "#modalShadeSelection");
});

$("#BtnApplyRequirement").click(function () {
    try {
        var ObjStore = [];
        if (document.getElementById("InkShadeSelection").style.display === "none") {
            var dataGridMaterial = $('#GridProcessMaterialRequired').dxDataGrid('instance');
            ObjStore = dataGridMaterial._options.dataSource;
            if (ObjStore.length <= 0) {
                swal("Material Not added", "Please add material for consumption...", "warning");
                return;
            }
            if (ObjStore.length > 0) {
                saveMaterialsRequirement(ObjStore);
                DevExpress.ui.notify("Material requirement for selected content is successfully applied...", "success", 1000);

                OpenCloseModal(false, "BtnApplyRequirement", "#modalShadeSelection");
            }

            //Clear all inputs
            clearMaterialRequireInputs();
        } else {
            var dataGridInks = $('#GridSelectedInkColor').dxDataGrid('instance');
            ObjStore = dataGridInks._options.dataSource;
            if (ObjStore.length <= 0) {
                swal("Ink Not Selected", "Please add ink first...", "warning");
                return;
            }
            if (ObjStore.length > 0) {
                var result = $.grep(ObjStore, function (e) { return e.ColorSpecification !== "Front" && e.ColorSpecification !== "Back"; });
                if (result.length >= 1) {
                    swal("Invalid shade side selection!", "Please select shade side of ink in (Front Or Back) only..!", "warning");
                    return false;
                }
                saveInkShadesDetails(ObjStore);
                DevExpress.ui.notify("Ink requirement for selected content is successfully applied...", "success", 1000);

                OpenCloseModal(false, "BtnApplyRequirement", "#modalShadeSelection");
            }
        }
    } catch (e) {
        console.log(e);
    }
});

$("#BtnAddMaterial").click(function () {
    try {
        var dataGrid = $('#GridProcessMaterialRequired').dxDataGrid('instance');
        var newdata = [];
        newdata.ItemID = Number(document.getElementById("TxtMaterialID").value.trim());
        if (newdata.ItemID <= 0 || newdata.ItemID === null) {
            swal("Invalid Material Selection", "Please select material again..", "warning");
            return;
        }
        newdata.ItemGroupID = Number(document.getElementById("TxtItemGroupID").value.trim());
        newdata.ItemGroupNameID = Number(document.getElementById("TxtItemGroupNameID").value.trim());
        newdata.MachineID = $("#SelProcessMachine").dxSelectBox("instance").option('value');
        newdata.MachineName = $("#SelProcessMachine").dxSelectBox("instance").option('text');
        newdata.RequiredQty = Number(document.getElementById("TxtRequiredMaterialQty").value.trim());
        newdata.EstimatedQuantity = Number(document.getElementById("TxtRequiredMaterialQty").value.trim());
        newdata.WasteQty = GblObjProcessItemReq.WasteQty;
        newdata.Rate = Number(GblObjProcessItemReq.Rate);
        newdata.Amount = Number(Number(newdata.RequiredQty).toFixed(3) * Number(newdata.Rate)).toFixed(3);
        newdata.StockUnit = document.getElementById("TxtMaterialStockUnit").value.trim();
        newdata.ItemCode = GblObjProcessItemReq.ItemCode;
        newdata.ItemName = GblObjProcessItemReq.ItemName;
        newdata.ProcessID = GblObjProcessItemReq.ProcessID;
        newdata.ProcessName = GblObjProcessItemReq.ProcessName;
        newdata.RateFactor = GblObjProcessItemReq.RateFactor;
        newdata.Remark = document.getElementById("TxtRequiredMaterialRemark").value.trim();

        if (newdata.MachineID <= 0 || newdata.MachineID === null || newdata.MachineName === "") {
            swal("Machine Not Selected", "Please select machine first..", "warning");
            return;
        }
        var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ItemID === newdata.ItemID && e.ProcessID === newdata.ProcessID && e.MachineID === newdata.MachineID && e.RateFactor === newdata.RateFactor; });
        if (result.length >= 1) {
            swal("Duplicate Material Found!", "Please select different material..!", "error");
            return false;
        }
        if (newdata.RequiredQty < 0) {
            swal("Invalid Required Quantity", "Please enter valid required quantity..", "warning");
            document.getElementById("TxtRequiredMaterialQty").value = "";
            document.getElementById("TxtRequiredMaterialQty").focus();
            return;
        } else if (Number(GblObjProcessItemReq.RequiredQty) < Number(newdata.RequiredQty)) {
            swal({
                title: "Required quantity is: " + Number(GblObjProcessItemReq.RequiredQty),
                text: "Are you sure to add more than required quantity",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: true
            }, function () {
                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);
                document.getElementById("TxtMaterialID").value = 0;
                document.getElementById("TxtItemGroupID").value = 0;
                document.getElementById("TxtItemGroupNameID").value = 0;
                return;
            });
            return;
        }

        var clonedItem = $.extend({}, newdata);
        dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
        dataGrid.refresh(true);

        //Clear all inputs
        clearMaterialRequireInputs();
    } catch (e) {
        console.log(e);
    }
});

function clearMaterialRequireInputs() {
    document.getElementById("TxtRequiredMaterialQty").value = 0;
    document.getElementById("TxtMaterialID").value = 0;
    document.getElementById("TxtItemGroupID").value = 0;
    document.getElementById("TxtItemGroupNameID").value = 0;
    document.getElementById("TxtRequiredMaterialRemark").value = "";
    document.getElementById("TxtMaterialStockUnit").value = "";
    $("#SelProcessMachine").dxSelectBox({ value: null });
}

$("#BtnFormWise").click(function () {
    if (GblContentName === "" || GblContentType === "") return;
    $("#GridJCFormWise").dxDataGrid({ dataSource: [] });
    $("#GridJCFormWiseDetail").dxDataGrid({ dataSource: [] });

    OpenCloseModal(true, "BtnFormWise", "#modalJCFormWise");
    var objectStore = db.transaction("JobContentsFormsDetails").objectStore("JobContentsFormsDetails");
    objectStore.openCursor().onsuccess = function (event) {
        //$("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
        //$("#image-indicator").dxLoadPanel("instance").option("visible", true);
        var curFrm = event.target.result;
        if (curFrm) {
            if (GblContentName === curFrm.value["PlanContName"] && GblContentType === curFrm.value["PlanContentType"]) {
                var JCFormWise = [], JCFormWiseDetail = [], JCFormDetail = {};
                for (var i = 0; i < curFrm.value.length; i++) {
                    ////curFrm.value[i].PlanContName = GblContentName;
                    ////curFrm.value[i].MachineName = GblPlanValues.MachineName;
                    ////curFrm.value[i].NoOfColors = GblPlanValues.TotalColors;
                    ////curFrm.value[i].TotalUps = GblPlanValues.TotalUps;
                    JCFormWiseDetail.push(curFrm.value[i]);
                }
                ////$("#GridJCFormWise").dxDataGrid({ dataSource: JCFormWise });
                ////var Fcolor = Number(GblPlanValues.PlanFColor) + Number(GblPlanValues.PlanSpeFColor);
                ////var Bcolor = Number(GblPlanValues.PlanBColor) + Number(GblPlanValues.PlanSpeBColor);

                ////if (Number(Fcolor) > 0 || Number(Bcolor) > 0) {
                ////    JCFormDetail = curFrm.value[0];
                ////    JCFormDetail.ColorsFB = Number(Fcolor) + " + " + Number(Bcolor);
                ////    JCFormDetail.TotalSheets = GblPlanValues.FullSheets * Number(Number(JCFormDetail.Pages / JCFormDetail.Sets) / Number(Number(JCFormDetail.TotalUps) * 2));
                ////    var Pages = JCFormDetail.Pages / JCFormDetail.Sets + "(" + JCFormDetail.Pages + ")";
                ////    JCFormDetail.Pages = Pages;
                ////    JCFormDetail.PaperDetails = GblPlanValues.MainPaperName;
                ////    JCFormDetail.SheetSize = GblPlanValues.PaperSize;
                ////    JCFormDetail.PrintingStyle = GblPlanValues.PrintingStyle;
                ////    JCFormDetail.PaperID = GblPlanValues.PaperID;
                ////    JCFormDetail.MachineID = GblPlanValues.MachineID;

                ////    var j = 1;
                ////    while (j <= curFrm.value[0].Sets) {
                ////        JCFormDetail.SetsForms = j;
                ////        JCFormWiseDetail.push(JCFormDetail);
                ////        j++;
                ////    }
                ////    $("#GridJCFormWiseDetail").dxDataGrid({ dataSource: JCFormWiseDetail });
                ////    //$("#image-indicator").dxLoadPanel("instance").option("visible", false);

                ////}
                $("#GridJCFormWiseDetail").dxDataGrid({ dataSource: JCFormWiseDetail });
                return;
            }
            curFrm.continue();
        }
        //$("#image-indicator").dxLoadPanel("instance").option("visible", false);
    };
});

$("#btnApplyForms").click(function () {
    var FormsData = $("#GridJCFormWiseDetail").dxDataGrid('instance');
    if (FormsData._options.dataSource.length > 0) {
        UpdateJCFormDetails(FormsData._options.dataSource);
        OpenCloseModal(true, "btnApplyForms", "#modalJCFormWise");
    }
});

$("#btnClearForms").click(function () {
    $("#GridJCFormWiseDetail").dxDataGrid({
        dataSource: []
    });
    ////clear indexed db forms data
    var data = [];
    removeSelectedFormsDetails(data, data);
    ////
    DevExpress.ui.notify("Data cleared, please re-open it..!", "success", 1500);
    //OpenCloseModal(true, "btnClearForms", "#modalJCFormWise");
});

function ValidateCreateIndent() { //unused for now
    $.ajax({
        type: "POST",
        url: "WebServiceProductionWorkOrder.asmx/ValidateSendIndent",
        data: '{PaperId:' + GblPaperId + ',JobBKID:' + GblBookingID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.slice(0, -3);
            var ObjIsSend = JSON.parse(res.toString());
            if (ObjIsSend.length > 0) {
                if (ObjIsSend[0].IsIndentSent === "true" || ObjIsSend[0].IsIndentSent === true) {
                    var isSendConf = confirm("Requisition already sent by " + ObjIsSend[0].IndentSentBy + " for the selected jobcard " + GblJobCardNo + ", Make sure that purchase order was created...!, Want to send requisition again....?");
                    if (isSendConf === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
            return false;
        }
    });
}

function LoadIndentItemsList() {
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/LoadIndentItemsList",
            data: '{GblJobBookingID:' + JSON.stringify(GblJobBookingID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/{"d":null/g, '');
                res = res.replace(/{"d":""/g, '');
                res = res.replace(/{":,/g, '":null,');
                res = res.slice(0, -3);
                bookedItemDataSource = JSON.parse(res.toString());
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#BtnSaveJobcard").click(function () {
    if (TablePendingData.length <= 0) {
        swal("Invalid Selection", "Please select product again", "error");
        return;
    }
    saveProductJobCard();
});

$("#BtnPrintJobcard").click(function () {
    if (FlagEdit === false || TablePendingData.length <= 0) { return; }
    try {
        var url = "ReportJobCard.aspx?ContID=" + TablePendingData[0].JobBookingNo;
        window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
    } catch (e) {
        console.log(e);
    }
});

$("#BtnApplyItemAllocation").click(function () {
    var dataGrid = $('#GridAllocatedItemList').dxDataGrid('instance');
    var TotalSheets = Number(dataGrid.getTotalSummaryValue("FullSheets")).toFixed(2);
    var DepartmentID = $("#SelDepartment").dxSelectBox("instance").option('value');
    if (TotalSheets <= 0) {
        swal("Empty Item value", "Please add item value", "warning");
        return;
    }

    GblPlanValues.FullSheets = Number(TotalSheets);
    GblPlanValues.ActualSheets = Number(TotalSheets) - (Number(GblPlanValues.MakeReadyWastageSheet) + Number(GblPlanValues.WastageSheets));

    //$("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
    //$("#image-indicator").dxLoadPanel("instance").option("visible", true);

    OpenCloseModal(false, "BtnApplyItemAllocation", "#modalItemAllocation");
    try {
        var ObjStore = [];
        var estimatedCost = 0;
        var allocatedItemCost = 0;
        var reqItemGrid = $("#GridRequiredItemList").dxDataGrid('instance');
        if (reqItemGrid._options.dataSource.length > 0) {
            estimatedCost = Number(reqItemGrid._options.dataSource[0].QuotationPaperAmount);
        }
        for (var i = 0; i < dataGrid._options.dataSource.length; i++) {
            var newdata = dataGrid._options.dataSource[i];

            newdata.RequiredQty = dataGrid._options.dataSource[i].RequiredQty;

            newdata.StockUnit = dataGrid._options.dataSource[i].StockUnit;
            newdata.IsCreateIndent = dataGrid._options.dataSource[i].IsCreateIndent;
            newdata.IsCreatePickList = dataGrid._options.dataSource[i].IsCreatePickList;

            if (newdata.IsCreateIndent === true || newdata.IsCreatePickList === true) {
                if (DepartmentID === "" || DepartmentID === null) {
                    swal("Department Not Selected", "Please select department", "warning");
                    return;
                }
            }

            newdata.ItemGroupID = dataGrid._options.dataSource[i].ItemGroupID;
            newdata.ItemGroupNameID = dataGrid._options.dataSource[i].ItemGroupNameID;
            newdata.EstimatedQuantity = dataGrid._options.dataSource[i].EstimatedQuantity;
            newdata.Rate = dataGrid._options.dataSource[i].Rate;
            newdata.Amount = dataGrid._options.dataSource[i].Amount;
            newdata.DepartmentID = DepartmentID;
            allocatedItemCost = allocatedItemCost + Number(dataGrid._options.dataSource[i].Amount);
            ObjStore.push(newdata);
        }

        saveMaterialsRequirement(ObjStore);
        var contGrid = $("#GridProductContentDetails").dxDataGrid('instance');

        var grandAmount = (Number(GblPlanValues.GrantAmount) - Number(GblPlanValues.PaperAmount)).toFixed(2);
        grandAmount = Number(Number(grandAmount) + Number(allocatedItemCost)).toFixed(2);
        if (Number(grandAmount) > 0) {
            GblPlanValues.GrantAmount = Number(grandAmount);
            GblPlanValues.PaperAmount = Number(allocatedItemCost);
            contGrid.refresh();
        }

    } catch (e) {
        alert(e);
    }
    //var objsavereq = {};
    //var objgr = ObjStore.filter(function (e) {
    //    return e.IsCreateIndent === true;
    //});
});

$("#BtnDeleteJobcard").click(function () {
    if (FlagEdit === false || TablePendingData.length <= 0) { return; }
    if (TablePendingData[0].JobBookingID === 0 || TablePendingData[0].JobBookingID === "") {
        swal("Empty Selection", "Please select any row for Delete JobCard", "warning");
        return false;
    }

    swal({
        title: "Deleting Confirmation..",
        text: "Are you sure to delete this job card: " + TablePendingData[0].JobBookingNo,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: true
    }, function () {
        var BookNo = JSON.stringify(TablePendingData[0].JobBookingNo);
        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/RecycleProductionWorkOrder",
            data: '{JCNo:' + BookNo + ',JobBookingID:' + TablePendingData[0].JobBookingID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                if (res === "Success") {
                    swal("Deleted Success", "JobCard deleted successfully!", "success");
                    location.reload();
                }
                else if (res.includes("can not delete")) {
                    swal("Not Deleted..!", res, "error");
                }
                else {
                    swal("error occured!", res, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                //alert("Something went wrong!");
            }
        });
    });
});

$("#BtnJobDetails").click(function () {
    //Get Selected Rows data By Minesh Jain On 22-May-2019
    if (TablePendingData.length <= 0) { return false; }
    GblOrderQuantity = TablePendingData[0].Quantity;
    GblBookingID = TablePendingData[0].BookingID;
    GblProdMasCode = TablePendingData[0].ProductMasterCode;
    GblJobCardNo = TablePendingData[0].JobBookingNo;
    GblJobBookingID = TablePendingData[0].JobBookingID;
    $("#BtnSaveJobcard").show();
    if (GblJobCardNo === undefined) {
        GblJobCardNo = ""; GblJobBookingID = 0;
    }
    (async () => {
        await removeAllContentsData();
    })();

    GetSelectedContentPlans();

    if (check === "Pending") {
        GenerateJobCardNo();
        FlagEdit = false;
        document.getElementById("TxtBookingNoAuto").value = GblGenCode;
        $("#DatePM").dxDateBox({
            value: new Date()
        });
    } else {
        FlagEdit = true;
        GblGenCode = TablePendingData[0].JobBookingNo;
        document.getElementById("TxtBookingNoAuto").value = GblGenCode;
        $("#BtnDeleteJobcard").removeClass("hidden");
        $("#DatePM").dxDateBox({
            value: TablePendingData[0].BookingDate
        });
    }

    $('#TxtQuantity').val(TablePendingData[0].OrderQty);
    $('#TxtJobName').val(TablePendingData[0].JobName);
    $('#TxtOrderQuantity').val(TablePendingData[0].OrderQty);
    $('#TxtOrderBookingDate').val(TablePendingData[0].BookingDate);
    $('#TxtOrderBookingNo').val(TablePendingData[0].SalesOrderNo);
    $('#TxtPONo').val(TablePendingData[0].PONo);
    // $('#TxtPODate').val(TablePendingData[0].PODate);
    $("#SelPODate").dxDateBox({ value: TablePendingData[0].PODate });
    $("#SelDeliveryDate").dxDateBox({ value: TablePendingData[0].DeliveryDate });

    $('#TxtQuoteNo').val(TablePendingData[0].BookingNo);
    //$('#TxtDeliveryDate').val(TablePendingData[0].DeliveryDate);
    $('#TxtProductCode').val(TablePendingData[0].ProductCode);
    $('#TxtEmail').val(TablePendingData[0].Email);
    $('#TxtProductRemark').val(TablePendingData[0].Remark);
    $('#TxtCriticalRemark').val(TablePendingData[0].CriticalInstructions);

    $("#SbClientName").dxSelectBox({ value: TablePendingData[0].LedgerID });
    $("#SbJobCoordinator").dxSelectBox({ value: TablePendingData[0].CoordinatorLedgerID });
    $("#SbJobPriority").dxSelectBox({ value: TablePendingData[0].JobPriority });
    $("#SbJobType").dxSelectBox({ value: TablePendingData[0].JobType });
    $("#SbJobReference").dxSelectBox({ value: TablePendingData[0].JobReference });
    $("#SbCategory").dxSelectBox({ value: TablePendingData[0].CategoryID });

    $("#SbProductHSNGroup").dxSelectBox({ value: TablePendingData[0].ProductHSNID });

    if (Number(TablePendingData[0].LedgerID) > 0) {
        loadConsigneeData(TablePendingData[0].LedgerID, TablePendingData[0].ConsigneeID);
    }
    ///////////////////////////////////////////////////////
    clearData();
    if (document.getElementById("TxtJobName").value.trim() === "" || TablePendingData.length <= 0) {
        return false;
    }
    ProcesssData();
    LoadIndentItemsList();
    OpenCloseModal(true, "BtnJobDetails", "#modalJobContentsDetails");
    $(".rowcontents").animate({ scrollTop: 0 }, "slow");
});

$("#BtnSelectContent").click(function () {
    var TxtContentName = document.getElementById("TxtAddContentName").value.trim();
    var PlanContentType = document.getElementById("PlanContentType").value.trim();
    if (TxtContentName === "" || PlanContentType === "") {
        swal("Content Not Selected!", "Please select content first..!", "error");
        return false;
    }
    else {
        var GridContList = $("#GridProductContentDetails").dxDataGrid('instance');
        var result = $.grep(GridContList._options.dataSource, function (e) { return e.PlanContName.trim() === TxtContentName.trim() && e.PlanContentType.trim() === PlanContentType.trim(); });
        if (result.length >= 1) {
            //found
            swal("Duplicate Content Name Found!", "Please enter different content name..!", "error");
            return false;
        }
        var newdata = [];
        newdata.ContentID = 0;
        newdata.PlanContName = TxtContentName;
        newdata.PlanContentType = PlanContentType;
        newdata.PaperSize = "";
        newdata.PlanType = "";
        newdata.PurchaseUnit = "";

        var clonedItem = $.extend({}, newdata);
        GridContList._options.dataSource.splice(GridContList.totalCount(), 0, clonedItem);
        GridContList.refresh(true);

        document.getElementById("BtnSelectContent").setAttribute("data-dismiss", "modal");
    }
});

$("#BtnShipper").click(function () {
    OpenCloseModal(true, "BtnShipper", "#modalShipper");

    $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({                //// For shipper load
        type: 'post',
        url: 'WebServicePlanWindow.asmx/LoadShippersList',
        data: '{BKID:' + Number(GblBookingID) + ',PlanQty:' + GblOrderQuantity + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, ' & ');
            res = res.substr(1);
            res = res.slice(0, -1);
            var objres = JSON.parse(res);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            $("#GridShipper").dxDataGrid({
                dataSource: objres,
                showRowLines: true,
                columnAutoWidth: true,
                sorting: false,
                showBorders: true,
                height: function () {
                    return window.innerHeight / 1.2;
                },
                scrolling: true,
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                columns: [{ dataField: "ShipperID", visible: false }, { dataField: "ShipperName" },
                { dataField: "PackX" }, { dataField: "PackY" }, { dataField: "PackZ" },
                { dataField: "TotalShipperQtyReq" }, { dataField: "ShipperWeightPerPack" }]
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
});

$("#BtnItemsBooking").click(function () {

    ReloadItemAllocationGridData();

    OpenCloseModal(true, "BtnItemsBooking", "#modalItemAllocation");
});

function ProcesssData() {
    $("#GridSelectedProductProcess").dxDataGrid({ dataSource: [] });
    $("#GridMaterialProcess").dxDataGrid({ dataSource: [] });
    OprIds = [];
    var objectStore = db.transaction("JobOperation").objectStore("JobOperation");
    objectStore.openCursor().onsuccess = function (event) {
        var curOper = event.target.result;
        if (curOper) {
            if (GblContentName === curOper.value["PlanContName"] && GblContentType === curOper.value["PlanContentType"]) {
                var ObjProcess = curOper.value;
                for (var i = 0; i < curOper.value.length; i++) {
                    OprIds.push(curOper.value[i].ProcessID);
                }
                $("#GridSelectedProductProcess").dxDataGrid({ dataSource: ObjProcess });
                $("#GridMaterialProcess").dxDataGrid({ dataSource: ObjProcess });
                return;
            }
            curOper.continue();
        }
    };
}

function LoadInkShadeSelected() {
    ////$.ajax({
    ////    type: 'POST',
    ////    url: "WebServiceProductionWorkOrder.asmx/GridInkShadeSelectedData",
    ////    data: '{BookingId:' + GblBookingID + ', ProductContID:' + GblProductContID + ',ProdMasID:' + GblProdMasID + ',JobContId:' + GblContentId + '}',
    ////    contentType: 'application/json; charset=utf-8',
    ////    dataType: 'text',
    ////    success: function (results) {
    ////        var res = results.replace(/\\/g, '');
    ////        res = res.replace(/{"d":null/g, '');
    ////        res = res.replace(/{"d":""/g, '');
    ////        res = res.slice(0, -3);
    ////        var ObjInk = JSON.parse(res.toString());
    ////        $("#GridSelectedInkColor").dxDataGrid({
    ////            dataSource: ObjInk
    ////        });
    ////    }
    ////});

    $("#GridSelectedInkColor").dxDataGrid({ dataSource: [] });
    var objectStore = db.transaction("JobContentsInkShades").objectStore("JobContentsInkShades");
    objectStore.openCursor().onsuccess = function (event) {
        var curOper = event.target.result;
        if (curOper) {
            if (GblContentName === curOper.value["PlanContName"] && GblContentType === curOper.value["PlanContentType"]) {
                var ObjInk = curOper.value;
                $("#GridSelectedInkColor").dxDataGrid({ dataSource: ObjInk });
                return;
            }
            curOper.continue();
        } else {
            var grid = $("#GridSelectedInkColor").dxDataGrid('instance');
            if (grid._options.dataSource.length === 0) {
                $("#GridSelectedInkColor").dxDataGrid({
                    dataSource: ObjStandardInkdata
                });
            }
        }
    };
}

function ShowAllProcesss() {
    var VisibleIndex = 0, Oprstore = [], ObjProcessFilteredData = [];
    var gridOpr = $("#GridSelectedProductProcess").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: { mode: 'none' },
        selection: { mode: 'single' },
        editing: { mode: "cell", allowUpdating: true },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        columns: [{ dataField: "ProcessID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
        { dataField: "Rate", allowEditing: false, format: { type: "decimal", /* one of the predefined formats*/ precision: 3 /* the precision of values*/ } },
        { dataField: "RateFactor", allowEditing: false, visible: false }, { dataField: "Remarks", caption: "Process Remark", allowEditing: true },
        { dataField: "PaperConsumptionRequired", width: 180, dataType: "boolean", allowEditing: true },
        {
            dataField: "AddTools", caption: "Tool", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 35,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn')
                    .on('dxclick', function () {
                        document.getElementById("TxtToolProcessName").value = options.data.ProcessName;
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#myModalTool");
                    }).appendTo(container);
            }
        }
        ],
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        rowDragging: {
            allowReordering: true,
            onReorder: function (e) {
                var visibleRows = e.component.getVisibleRows(),
                    toIndex = e.component._options.dataSource.indexOf(visibleRows[e.toIndex].data),
                    fromIndex = e.component._options.dataSource.indexOf(e.itemData);

                e.component._options.dataSource.splice(fromIndex, 1);
                e.component._options.dataSource.splice(toIndex, 0, e.itemData);

                e.component.refresh();

                SortContentProcessSequence(GblContentName, GblContentType, fromIndex, toIndex);
            }
        },
        filterRow: { visible: false },
        height: function () {
            return window.innerHeight / 3;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        onRowUpdated: function (e) {
            UpdateContentWiseProcessRowData(GblContentName, GblContentType, e.data);
        },
        onSelectionChanged: function (selectedItems) {
            var keys = selectedItems.component.getSelectedRowKeys();
            Oprstore = selectedItems.component._options.dataSource;
            for (var i = 0; i < keys.length; i++) {
                VisibleIndex = gridOpr.getRowIndexByKey(keys[i]);
            }
        }
    }).dxDataGrid('instance');

    //$("#GridMaterialProcess").dxDataGrid($("#GridSelectedProductProcess").dxDataGrid("instance").option());

    $("#GridMaterialProcess").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        selection: { mode: "single" },
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        filterRow: { visible: false },
        height: function () {
            return window.innerHeight / 2.3;
        },
        columns: [{ dataField: "ProcessID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
        { dataField: "Rate", allowEditing: false }, { dataField: "RateFactor", allowEditing: false, visible: false }, { dataField: "Remarks", allowEditing: false }],
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        onSelectionChanged: function (data) {
            GblObjProcessItemReq = {};
            if (data) {
                if (data.selectedRowsData.length <= 0) return;
                GblObjProcessItemReq.ProcessID = data.selectedRowsData[0].ProcessID;
                GblObjProcessItemReq.ProcessName = data.selectedRowsData[0].ProcessName;
                GblObjProcessItemReq.RateFactor = data.selectedRowsData[0].RateFactor;
                GetMaterialList(data.selectedRowsData[0].ProcessID);
            }
        }
    });

    //$("#OperSelMoveUp").click(function () {
    //    if (VisibleIndex <= 0 || VisibleIndex === undefined || Oprstore.length <= 0) return;

    //    gridOpr._options.dataSource = array_move(Oprstore, VisibleIndex, VisibleIndex - 1);
    //    SortContentProcessSequence(GblContentName, GblContentType, VisibleIndex, VisibleIndex - 1);
    //    VisibleIndex = VisibleIndex - 1;
    //    gridOpr.refresh();
    //});

    //$("#OperSelMoveDown").click(function () {
    //    if (Oprstore.length <= 0) return;
    //    if (VisibleIndex === Oprstore.length - 1 || VisibleIndex === undefined) return;
    //    gridOpr._options.dataSource = array_move(Oprstore, VisibleIndex, VisibleIndex + 1);
    //    SortContentProcessSequence(GblContentName, GblContentType, VisibleIndex, VisibleIndex + 1);
    //    VisibleIndex = VisibleIndex + 1;
    //    gridOpr.refresh();
    //});
}

function clearData() {
    $("#GridSelectedProductProcess").dxDataGrid({ dataSource: [] });
    $("#GridMaterialProcess").dxDataGrid({ dataSource: [] });
    $("#GridSelectedInkColor").dxDataGrid({ dataSource: [] });
    $("#GridShipper").dxDataGrid({ dataSource: [] });
    $("#GridJCFormWise").dxDataGrid({ dataSource: [] });
    document.getElementById("TxtProductRemark").value = "";
}

/**
 * call for close and open Modal popup
 * @param {any} IsOpen Want to open modal or close
 * @param {any} LinkID clicked button id
 * @param {any} ModalID modal id that you want to open
 */
function OpenCloseModal(IsOpen, LinkID, ModalID) {
    if (IsOpen === true) {
        document.getElementById(LinkID).setAttribute("data-toggle", "modal");
        document.getElementById(LinkID).setAttribute("data-target", ModalID);
    } else {
        document.getElementById(LinkID).setAttribute("data-dismiss", "modal");
    }
}

function GetMaterialList(OPID) {

    $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GridMaterialList',
        data: '{OPID:' + OPID + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -3);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var objres = JSON.parse(res.toString());
            $("#GridProcessMaterialList").dxDataGrid({
                dataSource: objres
            });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });

    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GetDepartmentMachines',
        data: '{OPID:' + OPID + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.substr(1);
            res = res.slice(0, -3);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var objres = JSON.parse(res.toString());
            $("#SelProcessMachine").dxSelectBox({
                dataSource: objres
            });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

function ShowInkSelectGrid(dataSource) {
    $("#GridInkName").dxDataGrid({
        dataSource: dataSource,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        columnAutoWidth: true,
        columns: [{ dataField: "ItemID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", caption: "Ink Name", allowEditing: false },
        { dataField: "ItemGroupID", visible: false }, { dataField: "ItemGroupNameID", visible: false }, { dataField: "ItemPantoneCode", allowEditing: false },
        { dataField: "ItemGroupName", allowEditing: false, caption: "Group Name" },
        {
            dataField: "ColorSpecification", caption: "Shade Side", fixedPosition: "right", fixed: true, allowEditing: true,
            lookup: {
                dataSource: ["Front", "Back"]
            }, validationRules: [{ type: 'required' }],
            width: 100
        },
        {
            dataField: "Add", allowEditing: false, caption: "", visible: true, fixedPosition: "right", fixed: true, width: 25,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus dx-link').appendTo(container);
            }
        }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        showRowLines: true,
        showBorders: true,
        loadPanel: {
            enabled: false
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 1.3;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType !== "data") return;
            if (clickedCell.column.dataField === "Add") {
                try {
                    if (clickedCell.data.ColorSpecification === "" || clickedCell.data.ColorSpecification === undefined) {
                        DevExpress.ui.notify("Select Ink shade side first..!", "warning", 1000);
                        clickedCell.component.cellValue(clickedCell.rowIndex, 4, "");
                        return false;
                    }
                    var dataGrid = $('#GridSelectedInkColor').dxDataGrid('instance');
                    var result = $.grep(dataGrid._options.dataSource, function (e) {
                        return e.ColorSpecification === clickedCell.data.ColorSpecification;
                    });
                    var InkC = 0;
                    if (clickedCell.data.ColorSpecification === "Front") {
                        InkC = Number(GblPlanValues.PlanFColor) + Number(GblPlanValues.PlanSpeFColor);
                    } else {
                        InkC = Number(GblPlanValues.PlanBColor) + Number(GblPlanValues.PlanSpeBColor);
                    }
                    if (result.length >= InkC) {
                        DevExpress.ui.notify("Maximum limit of colors for " + clickedCell.data.ColorSpecification + " side is '" + InkC + "'..!", "warning", 1500);
                        return;
                    }
                    var newdata = [];
                    newdata.ItemID = clickedCell.data.ItemID;
                    newdata.ItemName = clickedCell.data.ItemName;
                    newdata.ItemGroupID = clickedCell.data.ItemGroupID;
                    newdata.ItemGroupNameID = clickedCell.data.ItemGroupNameID;
                    newdata.ColorSpecification = clickedCell.data.ColorSpecification;
                    newdata.FormSide = newdata.ColorSpecification;
                    newdata.ItemPantoneCode = clickedCell.data.ItemPantoneCode;

                    var clonedItem = $.extend({}, newdata);
                    dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                    dataGrid.refresh(true);

                    //dataGrid._events.preventDefault();
                    DevExpress.ui.notify("Ink added..!", "success", 500);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        }
    });

    ObjStandardInkdata = dataSource.filter(function (e) {
        return e.IsStandardItem === true || e.IsStandardItem === "True";
    });
    $("#GridSelectedInkColor").dxDataGrid({
        dataSource: ObjStandardInkdata,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: { mode: 'none' },
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [{ dataField: "ItemID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemName", caption: "Ink Name", allowEditing: false },
        { dataField: "ItemGroupID", visible: false }, { dataField: "ItemGroupNameID", visible: false }, { dataField: "ItemPantoneCode", allowEditing: false },
        {
            dataField: "ColorSpecification", caption: "Shade Side", width: 100, allowEditing: true,
            lookup: {
                dataSource: ["Front", "Back"]
            }, validationRules: [{ type: 'required' }]
        },
        {
            dataField: "Delete", caption: "", fixedPosition: "right", fixed: true, allowEditing: false, width: 25,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove dx-link').appendTo(container);
            }
        }],
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        filterRow: { visible: false },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.dataField === "Delete") {
                try {
                    clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                    clickedCell.component.deleteRow(clickedCell.rowIndex);
                    //clickedCell.component.refresh(true);
                    DevExpress.ui.notify("Ink removed..!", "error", 500);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        height: function () {
            return window.innerHeight / 1.3;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        }
    });
}

/**
     * Load all contetnts and it's process or forms details for save job card*/
function saveProductJobCard() {
    try {
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        var FlgPlan = false, FlgOpr = false, FlgBook = false, FlgBookDetails = false;
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        var TblPlanning = [], TblOperations = [], TblContentForms = [], TblContentMatRequireData = [], TblContentInkData = [], TblContentFormsDetails = [];
        var ObjItemIndentsMainData = {}, TblItemIndentsMainData = [], TblItemIndentsDetailData = [];
        var TblItemPickListMainData = [], TblItemPickListDetailData = [];

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (FlagEdit === false) { cursor.value.JobBookingJobCardContentsID = undefined; } ///added by pKp on 02072019 b/c identity column
                TblPlanning.push(cursor.value);
                cursor.continue();
            } else {
                //alert("No more entries!");
                FlgPlan = true;

                /**
                 * Fetch all Job Contents Forms data **/
                var objectJobForms = db.transaction("JobContentsForms").objectStore("JobContentsForms");
                objectJobForms.openCursor().onsuccess = function (event) {
                    var curForms = event.target.result;
                    var FormsData = {};
                    if (curForms) {
                        for (var val = 0; val < curForms.value.length; val++) {
                            FormsData = {};
                            FormsData = curForms.value[val];
                            FormsData.PlanContQty = curForms.value.PlanContQty;
                            FormsData.PlanContentType = curForms.value.PlanContentType;
                            FormsData.PlanContName = curForms.value.PlanContName;
                            FormsData.BookingID = GblBookingID;

                            TblContentForms.push(FormsData);
                        }
                        curForms.continue();
                    } else {
                        FlgBook = true;
                        //Fetch all operations data
                        var objectJobOperation = db.transaction("JobOperation").objectStore("JobOperation");
                        objectJobOperation.openCursor().onsuccess = function (event) {
                            var curOper = event.target.result;
                            var operData = {};
                            if (curOper) {
                                var TransID = 1;
                                for (var val = 0; val < curOper.value.length; val++) {
                                    operData = {};
                                    //operData = curOper.value[val];
                                    operData.PlanContQty = curOper.value.PlanContQty;
                                    operData.PlanContentType = curOper.value.PlanContentType;
                                    operData.PlanContName = curOper.value.PlanContName;

                                    operData.SequenceNo = Number(TransID);
                                    operData.ProcessID = Number(curOper.value[val].ProcessID);
                                    operData.SizeL = Number(curOper.value[val].SizeL);
                                    operData.SizeW = Number(curOper.value[val].SizeW);
                                    operData.NoOfPass = Number(curOper.value[val].NoOfPass);
                                    operData.Quantity = Number(curOper.value[val].Quantity);
                                    operData.Rate = Number(curOper.value[val].Rate).toFixed(3);
                                    operData.Ups = Number(curOper.value[val].Ups);
                                    operData.Amount = Number(curOper.value[val].Amount);
                                    operData.Remarks = curOper.value[val].Remarks;
                                    operData.PlanID = Number(curOper.value[val].DepartmentID);

                                    operData.PaperConsumptionRequired = curOper.value[val].PaperConsumptionRequired;
                                    operData.Pieces = Number(curOper.value[val].Pieces);
                                    operData.NoOfStitch = Number(curOper.value[val].NoOfStitch);
                                    operData.NoOfLoops = Number(curOper.value[val].NoOfLoops);
                                    operData.NoOfColors = Number(curOper.value[val].NoOfColors);
                                    operData.RateFactor = curOper.value[val].RateFactor;
                                    operData.BookingID = GblBookingID;

                                    TransID = TransID + 1;
                                    TblOperations.push(operData);
                                }
                                curOper.continue();
                            } else {
                                //alert("No more entries!");
                                FlgOpr = true;
                                /**
                                * Fetch all Job Contents Material Require data **/
                                var objectMat = db.transaction("JobContentsMaterialRequired").objectStore("JobContentsMaterialRequired");
                                objectMat.openCursor().onsuccess = function (event) {
                                    var curMat = event.target.result;
                                    var MatData = {};
                                    var indentData = {};
                                    if (curMat) {
                                        var SequenceNo = 1;
                                        for (var val = 0; val < curMat.value.length; val++) {
                                            MatData = {};
                                            /////MatData = curMat.value[val];
                                            MatData.PlanContQty = curMat.value.PlanContQty;
                                            MatData.PlanContentType = curMat.value.PlanContentType;
                                            MatData.PlanContName = curMat.value.PlanContName;

                                            MatData.ProcessID = curMat.value[val].ProcessID;
                                            MatData.RateFactor = curMat.value[val].RateFactor;
                                            MatData.ItemID = curMat.value[val].ItemID;
                                            MatData.ItemGroupID = curMat.value[val].ItemGroupID;
                                            MatData.MachineID = curMat.value[val].MachineID;
                                            MatData.RequiredQty = Number(curMat.value[val].RequiredQty);
                                            MatData.EstimatedQuantity = Number(curMat.value[val].EstimatedQuantity);
                                            MatData.WasteQty = Number(curMat.value[val].WasteQty);
                                            MatData.Rate = Number(curMat.value[val].Rate);
                                            MatData.Amount = Number(curMat.value[val].Amount);
                                            MatData.StockUnit = curMat.value[val].StockUnit;
                                            MatData.IsCreateIndent = curMat.value[val].IsCreateIndent;
                                            MatData.IsCreatePickList = curMat.value[val].IsCreatePickList;
                                            MatData.SequenceNo = SequenceNo;
                                            MatData.BookingID = GblBookingID;

                                            TblContentMatRequireData.push(MatData);

                                            //////Indend Main data                                            
                                            ObjItemIndentsMainData = {};

                                            //ObjItemIndentsMainData.VoucherID = -8;
                                            //ObjItemIndentsMainData.Particular = "JobCard Indent";
                                            ObjItemIndentsMainData.TotalQuantity = curMat.value[val].RequiredQty;
                                            ObjItemIndentsMainData.DepartmentID = curMat.value[val].DepartmentID;
                                            ObjItemIndentsMainData.OperationID = curMat.value[val].ProcessID;
                                            ObjItemIndentsMainData.PlanContName = curMat.value.PlanContName;
                                            ObjItemIndentsMainData.PlanContentType = curMat.value.PlanContentType;

                                            ///////Indent and picklist details data
                                            indentData = {};
                                            var result = $.grep(TblOperations, function (e) {
                                                return e.PaperConsumptionRequired === true && MatData.PlanContentType === e.PlanContentType
                                                    && MatData.PlanContQty === e.PlanContQty && MatData.PlanContName === e.PlanContName;
                                            });
                                            if (result.length >= 1 && curMat.value[val].ItemGroupID === 1) {
                                                indentData.ProcessID = result[0].ProcessID;
                                                if (ObjItemIndentsMainData.DepartmentID === undefined) {
                                                    ObjItemIndentsMainData.DepartmentID = result[0].PlanID;
                                                }
                                                if (ObjItemIndentsMainData.DepartmentID === undefined)
                                                    ObjItemIndentsMainData.DepartmentID = -1;
                                            } else if (result.length === 0 && curMat.value[val].ItemGroupID === 1 && TblOperations.length > 0) {
                                                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                                                swal("Paper consumption is not seleted in content '" + MatData.PlanContName + "'..!", "Please select process for paper consumption from process list", "warning");
                                                return;
                                            }
                                            indentData.PlanContQty = curMat.value.PlanContQty;
                                            indentData.PlanContentType = curMat.value.PlanContentType;
                                            indentData.PlanContName = curMat.value.PlanContName;

                                            indentData.TransID = SequenceNo;
                                            indentData.IsAuditApproved = 1;
                                            indentData.IsVoucherItemApproved = 1;
                                            indentData.MachineID = curMat.value[val].MachineID;
                                            ////indentData.ProcessID = indentData.ProcessID ? undefined : curMat.value[val].ProcessID, indentData.ProcessID;
                                            indentData.ItemID = curMat.value[val].ItemID;
                                            indentData.ItemGroupID = curMat.value[val].ItemGroupID;
                                            indentData.RequiredQuantity = Number(curMat.value[val].RequiredQty);
                                            indentData.StockUnit = curMat.value[val].StockUnit;
                                            indentData.DepartmentID = ObjItemIndentsMainData.DepartmentID;

                                            //Add data in a array of object for indent and picklist only if check box is true
                                            if (curMat.value[val].IsCreateIndent === true) {
                                                var result1 = $.grep(TblItemIndentsMainData, function (e) {
                                                    return ObjItemIndentsMainData.PlanContentType === e.PlanContentType
                                                        && ObjItemIndentsMainData.PlanContName === e.PlanContName;
                                                });
                                                if (result1.length === 0) {
                                                    TblItemIndentsMainData.push(ObjItemIndentsMainData);
                                                }
                                                TblItemIndentsDetailData.push(indentData);
                                            }
                                            if (curMat.value[val].IsCreatePickList === true) {
                                                //ObjItemIndentsMainData.VoucherID = -17;
                                                //ObjItemIndentsMainData.Particular = "JobCard Picklist";
                                                var result2 = $.grep(TblItemPickListMainData, function (e) {
                                                    return ObjItemIndentsMainData.PlanContentType === e.PlanContentType
                                                        && ObjItemIndentsMainData.PlanContName === e.PlanContName;
                                                });
                                                if (result2.length === 0) {
                                                    TblItemPickListMainData.push(ObjItemIndentsMainData);
                                                }
                                                TblItemPickListDetailData.push(indentData);
                                            }
                                            /////////////

                                            SequenceNo = SequenceNo + 1;
                                        }
                                        curMat.continue();
                                    } else {

                                        /**
                                        * Fetch all Job Contents Ink Requirement data **/
                                        var objectMat = db.transaction("JobContentsInkShades").objectStore("JobContentsInkShades");
                                        objectMat.openCursor().onsuccess = function (event) {
                                            var curMat = event.target.result;
                                            var MatData = {};
                                            if (curMat) {
                                                var SequenceNo = 1;
                                                for (var val = 0; val < curMat.value.length; val++) {
                                                    MatData = {};
                                                    MatData.PlanContQty = curMat.value.PlanContQty;
                                                    MatData.PlanContentType = curMat.value.PlanContentType;
                                                    MatData.PlanContName = curMat.value.PlanContName;

                                                    MatData.ItemID = curMat.value[val].ItemID;
                                                    MatData.ItemName = curMat.value[val].ItemName;
                                                    MatData.ItemGroupID = curMat.value[val].ItemGroupID;
                                                    MatData.ColorSpecification = curMat.value[val].ColorSpecification;
                                                    MatData.FormSide = MatData.ColorSpecification;
                                                    MatData.ItemPantoneCode = curMat.value[val].ItemPantoneCode;

                                                    MatData.SequenceNo = SequenceNo;
                                                    MatData.BookingID = GblBookingID;

                                                    TblContentInkData.push(MatData);
                                                    SequenceNo = SequenceNo + 1;
                                                }
                                                curMat.continue();
                                            } else {

                                                var objectJobFormsD = db.transaction("JobContentsFormsDetails").objectStore("JobContentsFormsDetails");
                                                objectJobFormsD.openCursor().onsuccess = function (event) {
                                                    var curFormsD = event.target.result;
                                                    var FormsDataD = {};
                                                    if (curFormsD) {
                                                        for (var val = 0; val < curFormsD.value.length; val++) {
                                                            FormsDataD = {};
                                                            FormsDataD = curFormsD.value[val];
                                                            FormsDataD.PlanContQty = curFormsD.value.PlanContQty;
                                                            FormsDataD.PlanContentType = curFormsD.value.PlanContentType;
                                                            FormsDataD.PlanContName = curFormsD.value.PlanContName;
                                                            FormsDataD.BookingID = GblBookingID;

                                                            TblContentFormsDetails.push(FormsDataD);
                                                        }
                                                        curFormsD.continue();
                                                    } else {
                                                        FlgBookDetails = true;

                                                        if (FlgPlan === true && FlgOpr === true && FlgBook === true) {
                                                            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                                                            TblPlanning.sort(compareSequence);
                                                            callSaveJobCard(TblPlanning, TblOperations, TblContentForms, TblContentMatRequireData, TblContentInkData, TblItemIndentsMainData, TblItemIndentsDetailData, TblContentFormsDetails, TblItemPickListDetailData, TblItemPickListMainData);
                                                        }
                                                    }
                                                };
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }
                };
            }
        };
    } catch (e) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

function compareSequence(a, b) {
    const bandA = Number(a.SequenceNo);
    const bandB = Number(b.SequenceNo);

    let comparison = 0;
    if (bandA > bandB) {
        comparison = 1;
    } else if (bandA < bandB) {
        comparison = -1;
    }
    return comparison;
}

function callSaveJobCard(TblPlanning, TblOperations, TblContentForms, TblContentMatRequireData, TblContentInkData, TblItemIndentsMainData, TblItemIndentsDetailData, TblContentFormsDetails, TblItemPickListDetailData, TblItemPickListMainData) {
    try {
        if (TblPlanning.length <= 0) {
            swal("Content Not Available", "Please add atleast one content", "error");
            return;
        }
        var JobName = document.getElementById("TxtJobName").value.trim();
        var PONo = document.getElementById("TxtPONo").value.trim();
        var PODate = $('#SelPODate').dxDateBox('instance').option('value'); // document.getElementById("TxtPODate").value.trim();
        var ArtWorkCode = document.getElementById("TxtProductCode").value.trim();
        var CriticalDetails = document.getElementById("TxtCriticalRemark").value.trim();
        var Remark = document.getElementById("TxtProductRemark").value.trim();

        var LedgerId = $("#SbClientName").dxSelectBox("instance").option('value');
        var ClientName = $("#SbClientName").dxSelectBox("instance").option('text');
        var CategoryId = $("#SbCategory").dxSelectBox("instance").option('value');
        var SbConsigneeID = $("#SbConsigneeName").dxSelectBox("instance").option('value');
        var SbConsigneeName = $("#SbConsigneeName").dxSelectBox("instance").option('text');
        var SbProductHSNID = $("#SbProductHSNGroup").dxSelectBox("instance").option('value');
        var SbJobCoordinatorID = $("#SbJobCoordinator").dxSelectBox("instance").option('value');
        var SbJobPriority = $("#SbJobPriority").dxSelectBox("instance").option('value');
        var TxtEmail = document.getElementById("TxtEmail").value.trim();
        var SbJobType = $("#SbJobType").dxSelectBox("instance").option('value');
        var SbJobReference = $("#SbJobReference").dxSelectBox("instance").option('value');
        var DeliveryDate = $('#SelDeliveryDate').dxDateBox('instance').option('value'); //  document.getElementById("TxtDeliveryDate").value.trim();

        if (GblBookingID === undefined || GblBookingID <= 0 || GblBookingID === null) {
            return;
        }

        if (JobName === "" || JobName === "null" || JobName === null) {
            swal("Invalid Job Name", "Please Enter Job Name", "warning");
            DevExpress.ui.notify("Please Enter Job Name..!", "error", 1500);
            document.getElementById("JobName").focus();
            return;
        }
        if (ClientName === "" || ClientName === null || ClientName === "null" || Number(LedgerId) <= 0) {
            swal("Invalid Client Name", "Please Select Client Name", "warning");
            DevExpress.ui.notify("Please Select Client Name..!", "error", 1500);
            //$("#SbClientName").dxValidator('instance').validate();
            return;
        }
        if (CategoryId === "" || CategoryId === null || CategoryId === "null") {
            swal("Invalid Category", "Please Select Category", "warning");
            DevExpress.ui.notify("Please Select Category..!", "error", 1500);
            //$("#SbCategory").dxValidator('instance').validate();
            return;
        }
        if (SbProductHSNID === "" || SbProductHSNID === null || SbProductHSNID === "null") {
            swal("Invalid Product Group", "Please Select Product HSN Group", "warning");
            DevExpress.ui.notify("Please Select Product HSN Group..!", "error", 1500);
            ///$("#SbHSNGroups").dxValidator('instance').validate();
            return;
        }
        if (ArtWorkCode === "" || ArtWorkCode === "null" || ArtWorkCode === null) {
            swal("Invalid Product code", "Please Enter Product code", "warning");
            DevExpress.ui.notify("Please Enter Product code..!", "error", 1500);
            document.getElementById("TxtProductCode").focus();
            return;
        }
        //if (SbJobCoordinatorID === "" || Number(SbJobCoordinatorID) <= 0 || SbJobCoordinatorID === null) {
        //    swal("Invalid Job Coordinator", "Please Enter Job Coordinator", "warning");
        //    DevExpress.ui.notify("Please Enter Job Coordinator..!", "error", 1500);
        //    return;
        //}
        if (SbJobPriority === "" || SbJobPriority === null || SbJobPriority === "null") {
            swal("Invalid Job Priority", "Please Select Job Priority", "warning");
            DevExpress.ui.notify("Please Select Job Priority..!", "error", 1500);
            //$("#SbJobPriority").dxValidator('instance').validate();
            return;
        }
        if (SbJobType === "" || SbJobType === "null" || SbJobType === null) {
            swal("Invalid Job Type", "Please Enter Job Type", "warning");
            DevExpress.ui.notify("Please Enter Job Coordinator..!", "error", 1500);
            return;
        }
        //if (SbJobReference === "" || SbJobReference === null || SbJobReference === "null") {
        //    swal("Invalid Job Reference", "Please Select Job Reference", "warning");
        //    DevExpress.ui.notify("Please Select Job Reference..!", "error", 1500);
        //    //$("#SbJobReference").dxValidator('instance').validate();
        //    return;
        //}
        if (PONo === "" || PONo === null || PONo === "null") {
            swal("Invalid PO Date", "Please Select PO Date", "warning");
            DevExpress.ui.notify("Please Select PO Date..!", "error", 1500);
            return;
        }
        if (PODate === "" || PODate === null || PODate === "null" || PODate === undefined) {
            swal("Invalid PO Date", "Please Select PO Date", "warning");
            DevExpress.ui.notify("Please Select PO Date..!", "error", 1500);
            return;
        }
        if (DeliveryDate === "" || DeliveryDate === null || DeliveryDate === "null" || DeliveryDate === undefined) {
            swal("Invalid Delivery Date", "Please Select Delivery Date", "warning");
            DevExpress.ui.notify("Please Select Delivery Date..!", "error", 1500);
            return;
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);

        var GridContList = $("#GridProductContentDetails").dxDataGrid('instance');

        for (var val = 0; val < TblPlanning.length; val++) {
            TblPlanning[val].BookingID = GblBookingID;

            TblPlanning[val].PONo = PONo;
            let JobType;
            for (var i = 0; i < GridContList._options.dataSource.length; i++) {
                JobType = GridContList._options.dataSource[i].JobType;
                if (GridContList._options.dataSource[i].JobType === undefined || GridContList._options.dataSource[i].JobType === null || GridContList._options.dataSource[i].JobType === "") {
                    JobType = SbJobType;
                }
                if (GridContList._options.dataSource[i].PlanContName === TblPlanning[val].PlanContName && GridContList._options.dataSource[i].PlanContentType === TblPlanning[val].PlanContentType) {
                    TblPlanning[val].JobType = JobType;
                    //TblPlanning[val].PlateType = GridContList._options.dataSource[i].PlateType;
                }
            }

            //TblPlanning[val].JobType = SbJobType;
            TblPlanning[val].JobReference = SbJobReference;
            TblPlanning[val].JobPriority = SbJobPriority;
            TblPlanning[val].CoordinatorLedgerID = SbJobCoordinatorID;
            TblPlanning[val].CoordinatorLedgerName = $("#SbJobCoordinator").dxSelectBox("instance").option('text');
            TblPlanning[val].ConsigneeLedgerID = SbConsigneeID;
            TblPlanning[val].ProductMasterID = TablePendingData[0].ProductMasterID;
            //TblPlanning[val].OrderBookingID = TablePendingData[0].OrderBookingID;
            //TblPlanning[val].OrderBookingDetailsID = TablePendingData[0].OrderBookingDetailsID;
        }

        var TblBooking = [];
        var ObjBooking = {};
        ObjBooking.BookingID = GblBookingID;
        ObjBooking.LedgerID = LedgerId;
        ObjBooking.ConsigneeID = SbConsigneeID;
        ObjBooking.CategoryID = CategoryId;
        ObjBooking.ProductHSNID = SbProductHSNID;
        ObjBooking.ProductMasterID = TablePendingData[0].ProductMasterID;
        ObjBooking.OrderBookingID = TablePendingData[0].OrderBookingID;
        ObjBooking.OrderBookingDetailsID = TablePendingData[0].OrderBookingDetailsID;
        ObjBooking.CoordinatorLedgerID = SbJobCoordinatorID;

        ObjBooking.JobBookingPrefix = "J";
        ObjBooking.PONo = PONo;
        ObjBooking.PODate = PODate;
        ObjBooking.JobName = JobName;
        ObjBooking.ProductCode = ArtWorkCode;
        ObjBooking.Remark = Remark;
        ObjBooking.ClientName = ClientName;
        ObjBooking.OrderQuantity = GblOrderQuantity;
        ObjBooking.ConsigneeName = SbConsigneeName;
        ObjBooking.JobPriority = SbJobPriority;
        ObjBooking.Email = TxtEmail;
        ObjBooking.DeliveryDate = DeliveryDate;
        ObjBooking.CriticalInstructions = CriticalDetails;

        TblBooking.push(ObjBooking);

        var BookingNo = document.getElementById("TxtBookingNoAuto").value;

        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/SaveProductionWorkOrderData",
            data: '{TblBooking:' + JSON.stringify(TblBooking) + ',TblPlanning:' + JSON.stringify(TblPlanning) + ',TblOperations:' + JSON.stringify(TblOperations) + '' +
                ', TblContentForms: ' + JSON.stringify(TblContentForms) + ', FlagEdit: ' + JSON.stringify(FlagEdit) + ', JobBookingNo: ' + JSON.stringify(BookingNo) + '' +
                ', JobBookingID:' + GblJobBookingID + ',ObjMateRequire:' + JSON.stringify(TblContentMatRequireData) + ',ObjInkData:' + JSON.stringify(TblContentInkData) + '' +
                ',TblItemIndentsMainData:' + JSON.stringify(TblItemIndentsMainData) + ',TblItemIndentsDetailData:' + JSON.stringify(TblItemIndentsDetailData) + ',TblContentFormsDetails:' + JSON.stringify(TblContentFormsDetails) + ',TblItemPickListDetailData:' + JSON.stringify(TblItemPickListDetailData) + ',TblItemPickListMainData:' + JSON.stringify(TblItemPickListMainData) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var RES1 = JSON.parse(results);
                var title, text, type;
                if (RES1.d.includes("Error:500")) {
                    title = "Error in saving Production Work Order..!";
                    text = RES1.d.replace("Error:500,", "");
                    type = "error";
                } else if (RES1.d.includes("You are not authorized")) {
                    title = "Access Denied..!";
                    text = RES1.d;
                    type = "warning";
                } else if (RES1.d.includes("can not Modify")) {
                    title = "Can't Update..!";
                    text = RES1.d;
                    type = "warning";
                } else if (RES1.d.includes("Job card can't be saved")) {
                    title = "Free stock is not available in the listed content's item";
                    type = "warning";
                    text = RES1.d + " Please check free stock and save job card again";
                } else {
                    if (FlagEdit === false) {
                        FlagEdit = true;
                        title = "Saved Successfully";
                    } else title = "Updated Successfully";
                    text = "Production Work Order No: " + RES1.d + " " + title + "..!";
                    DevExpress.ui.notify("Production Work Order " + title + "..!", "success", 1500);
                    type = "success";
                    document.getElementById("TxtBookingNoAuto").value = RES1.d;
                    $("#BtnSaveJobcard").hide();
                }
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                swal({
                    title: title,
                    text: text,
                    type: type,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: true
                }, function () {
                    if (title === "Saved Successfully") location.reload();
                });
            },
            error: function (ex) {
                console.log(ex);
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            }
        });
    } catch (e) {
        alert(e);
    }
}

$("#GridRequiredItemList").dxDataGrid({
    dataSource: [],
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    columns: [
        { dataField: "ItemID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemGroupID", visible: false },
        { dataField: "ItemCode", allowEditing: false },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 300 },
        { dataField: "RequiredSize", caption: "Required Size", width: 100, allowEditing: false },
        { dataField: "StockUnit", caption: "Unit" },
        { dataField: "FullSheets", caption: "Required Sheets" },
        { dataField: "WtPerPacking", caption: "Wt/Packing", allowEditing: false },
        { dataField: "TotalPaperWtInKG", caption: "Total Wt.(Kg)" },
        { dataField: "PhysicalStock", caption: "Physical Stock", allowEditing: false },
        { dataField: "IndentStock", caption: "Indent Stock", allowEditing: false, width: 120 },
        { dataField: "BookedStock", caption: "Booked Stock", allowEditing: false },
        { dataField: "FloorStock", caption: "Floor Stock", allowEditing: false },
        { dataField: "AllocatedStock", caption: "Allocated Stock" },
        { dataField: "IncomingStock", caption: "Incoming Stock" },
        { dataField: "EstimationUnit", caption: "EstimationUnit", visible: false },
        { dataField: "Rate", caption: "Rate", visible: false },
        { dataField: "PurchaseUnit", caption: "PurchaseUnit", visible: false },
        { dataField: "LastPORate", caption: "LastPORate", visible: false },
        { dataField: "QuotationPaperRate", caption: "QuotationPaperRate", visible: false },
        { dataField: "QuotationPaperRateType", caption: "QuotationPaperRateType", visible: false },
        { dataField: "QuotationPaperAmount", caption: "QuotationPaperAmount", visible: false }
    ],
    sorting: false,
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: false
    },
    columnFixing: { enabled: true },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$("#GridItemsList").dxDataGrid({
    dataSource: [],
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    columns: [
        { dataField: "ItemID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemGroupID", visible: false },
        { dataField: "ItemCode", allowEditing: false },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false },
        { dataField: "Quality", caption: "Quality", allowEditing: false },
        { dataField: "GSM", caption: "GSM", allowEditing: false },
        { dataField: "SizeW", caption: "Size W", allowEditing: false },
        { dataField: "SizeL", caption: "Size L", allowEditing: false },
        { dataField: "RequiredSize", caption: "Required Size", width: 100, allowEditing: false },
        { dataField: "WtPerPacking", caption: "Wt/Packing", allowEditing: false },
        { dataField: "PhysicalStock", caption: "Physical Stock", allowEditing: false },
        { dataField: "IndentStock", caption: "Indent Stock", allowEditing: false },
        { dataField: "BookedStock", caption: "Booked Stock", allowEditing: false },
        { dataField: "FloorStock", caption: "Floor Stock", allowEditing: false },
        { dataField: "AllocatedStock", caption: "Allocated Stock" },
        { dataField: "IncomingStock", caption: "Incoming Stock" },
        { dataField: "EstimationUnit", caption: "EstimationUnit", visible: false },
        { dataField: "Rate", caption: "Rate", visible: false },
        { dataField: "LastPORate", caption: "LastPORate", visible: false },
        { dataField: "PurchaseUnit", caption: "PurchaseUnit", visible: false },
        {
            dataField: "Add", allowEditing: false, caption: "", visible: true, fixedPosition: "right", fixed: true, width: 25,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus dx-link').appendTo(container);
            }
        }
    ],
    showRowLines: true,
    showBorders: true,
    //scrolling: {
    //    mode: 'virtual'
    //},
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 3;
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "Add") {
            try {
                var dataGrid = $('#GridAllocatedItemList').dxDataGrid('instance');
                var reqGrid = $('#GridRequiredItemList').dxDataGrid('instance');
                var newdata = clickedCell.data;
                newdata.RequiredSize = GblPlanValues.CutSize;
                //newdata.ItemName = clickedCell.data.ItemName;
                //newdata.ItemGroupID = clickedCell.data.ItemGroupID;
                //newdata.ItemCode = clickedCell.data.ItemCode;
                //newdata.PantoneCode = newdata.PantoneCode;
                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ItemID === newdata.ItemID; });
                if (result.length === 1) {
                    swal("Duplicate Entry", "Duplicate Item found..!", "warning"); return;
                }
                var clonedItem = $.extend({}, newdata);
                if (clonedItem !== {}) {
                    if (reqGrid._options.dataSource.length > 0) {
                        if (reqGrid._options.dataSource[0].ItemID === clonedItem.ItemID) {
                            clonedItem.Rate = reqGrid._options.dataSource[0].QuotationPaperRate;
                        }
                    } else {
                        if (Number(clonedItem.Rate) > 0 && Number(clonedItem.LastPORate) === 0) {
                            clonedItem.Rate = Number(clonedItem.Rate);
                        } else if (Number(clonedItem.Rate) === 0 && Number(clonedItem.LastPORate) > 0) {
                            clonedItem.Rate = Number(clonedItem.LastPORate);
                        } else if (Number(clonedItem.Rate) === 0 && Number(clonedItem.LastPORate) === 0) {
                            clonedItem.Rate = 0;
                        } else if (Number(clonedItem.Rate) >= Number(clonedItem.LastPORate)) {
                            clonedItem.Rate = Number(clonedItem.Rate);
                        } else if (Number(clonedItem.Rate) < Number(clonedItem.LastPORate)) {
                            clonedItem.Rate = Number(clonedItem.LastPORate);
                        }
                    }
                }
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);
            } catch (e) {
                console.log(e);
            }
        }
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$("#GridAllocatedItemList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: false,
    columns: [
        { dataField: "ItemID", visible: false, width: 0, allowEditing: false },
        { dataField: "ItemGroupID", visible: false, allowEditing: false },
        { dataField: "ItemGroupNameID", visible: false, allowEditing: false },
        { dataField: "ItemCode", allowEditing: false },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 300 },
        { dataField: "RequiredSize", caption: "Required Size", width: 100, allowEditing: false }, //{ dataField: "DieSize", caption: "Die Size", width: 100, allowEditing: false },
        { dataField: "UnitPerPacking", caption: "Unit/Pack", allowEditing: false, width: 100 },
        { dataField: "WtPerPacking", caption: "Wt/Pack", allowEditing: false },
        { dataField: "PhysicalStock", caption: "Physical Stock", allowEditing: false },
        { dataField: "IssuePacks", caption: "Issue Pack", allowEditing: false }, { dataField: "FullSheets", caption: "Total Sheets" },
        { dataField: "TotalPaperWtInKG", caption: "Total Wt.", allowEditing: false },
        { dataField: "IsCreateIndent", dataType: "boolean", caption: "Create Indent", allowEditing: true },
        { dataField: "IsCreatePickList", dataType: "boolean", caption: "Create PickList", allowEditing: true },
        { dataField: "RequiredQty", caption: "Req. Qty(S.U.)", allowEditing: false },
        { dataField: "EstimatedQuantity", visible: false, caption: "Estimate Qty", allowEditing: false },
        { dataField: "EstimationUnit", caption: "Estimation Unit", allowEditing: false, visible: false },
        { dataField: "Rate", caption: "Rate", allowEditing: false, visible: true },
        { dataField: "Amount", caption: "Amount", allowEditing: false, visible: true },
        {
            dataField: "Delete", caption: "", fixedPosition: "right", fixed: true, allowEditing: false, width: 25,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove dx-link').appendTo(container);
            }
        }],
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    filterRow: { visible: false },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType !== "data") return;

        var stock = Number(clickedCell.data.PhysicalStock);
        if (clickedCell.column.dataField === "Delete") {
            try {
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);
            } catch (e) {
                console.log(e);
            }
        } else if (clickedCell.column.dataField === "IsCreatePickList") {
            try {
                if (clickedCell.data.IsCreateIndent === false) {
                    if (clickedCell.data.IsCreatePickList === true && (stock <= 0 || stock < clickedCell.data.IssuePacks)) {
                        DevExpress.ui.notify("Physical stock '" + stock + "' is not enough to create picklist for the selected item...", "warning", 2000);
                        clickedCell.data.IsCreatePickList = false;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        } else if (clickedCell.column.dataField === "IsCreateIndent") {
            try {
                if (clickedCell.data.IsCreateIndent === true && stock >= clickedCell.data.IssuePacks) {
                    DevExpress.ui.notify("Create indent is not allow for the selected item...", "warning", 2000);
                    clickedCell.data.IsCreateIndent = false;
                }
                if (clickedCell.data.IsCreateIndent === false && (stock <= 0 || stock < clickedCell.data.IssuePacks)) {
                    DevExpress.ui.notify("Physical stock '" + stock + "' is not enough to create picklist for the selected item...", "warning", 2000);
                    clickedCell.data.IsCreatePickList = false;
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    height: function () {
        return window.innerHeight / 3.4;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onRowUpdated: function (e) {
        if (e.data.FullSheets === undefined || e.data.FullSheets === "undefined") {
            e.data.RequiredQty = 0;
            e.data.Amount = 0;
        }
        var IssuePack = Number(e.data.FullSheets) / Number(e.data.UnitPerPacking);
        var SizeSplit = GblPlanValues.CutSize.split('x');

        if (e.data.EstimationUnit === "") e.data.EstimationUnit = "KG";
        if (e.data.ItemGroupNameID === -2) e.data.WtPerPacking = Number(Number(e.data.SizeW) * Number(SizeSplit[1]) * Number(e.data.GSM) / 1000000000).toFixed(6);
        var WtInKG = Number(IssuePack).toFixed(3) * Number(e.data.WtPerPacking).toFixed(6);

        if (e.data.StockUnit.toUpperCase().includes("SHEET")) {
            e.data.RequiredQty = Number(e.data.FullSheets).toFixed(3);
        } else if (e.data.StockUnit.toUpperCase().includes("METER")) {
            e.data.RequiredQty = (Number(e.data.FullSheets) * Number(SizeSplit[1]) / 1000).toFixed(1);
        } else {
            e.data.RequiredQty = Number(WtInKG).toFixed(3);
        }

        //if (e.data.EstimationUnit.toUpperCase().includes("SHEET")) {
        //    e.data.EstimatedQuantity = Number(e.data.FullSheets).toFixed(3);
        //} else if (e.data.EstimationUnit.toUpperCase().includes("METER")) {
        //    e.data.EstimatedQuantity = (Number(e.data.FullSheets) * Number(SizeSplit[1]) / 1000).toFixed(3);
        //} else {
        //    e.data.EstimatedQuantity = Number(WtInKG).toFixed(3);
        //}
        e.data.EstimatedQuantity = Number(e.data.FullSheets);

        e.data.Amount = (Number(e.data.RequiredQty) * Number(e.data.Rate)).toFixed(3);
        e.data.TotalPaperWtInKG = Number(WtInKG).toFixed(3);
        e.data.IssuePacks = IssuePack;
    },
    summary: {
        totalItems: [{
            column: "FullSheets",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }]
    }////₹      
});

$.ajax({
    type: "POST",
    url: "WebServiceProductionWorkOrder.asmx/LoadItemsList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/{"d":null/g, '');
        res = res.replace(/{"d":""/g, '');
        res = res.replace(/{":,/g, '":null,');
        res = res.slice(0, -3);
        masterItemDataSource = "";
        masterItemDataSource = JSON.parse(res.toString());
    }
});

function getPhysicalStock(ItemID) {
    var stock = 0;
    $.ajax({
        type: "POST",
        async: false,
        url: "WebServiceProductionWorkOrder.asmx/CheckItemStock",
        data: '{Id:' + ItemID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.slice(0, -3);
            var RES1 = JSON.parse(res.toString());
            if (RES1.length === 0) {
                return stock = 0;
            } else if (RES1.length > 0) {
                return stock = Number(RES1[0].PhysicalStock);
            }
        }
    });
    return stock;
}

function ReloadItemAllocationGridData() {
    var requiredItemList = [];
    var gridData = [];
    var itemsList = "";
    //for (var i = 0; i < masterItemDataSource.itemDataSource.length; i++) {
    //    masterItemDataSource[i].RequiredSize = GblPlanValues.CutSize;
    //}
    //var objgr = OBJAllItemsList.filter(function (e) {
    //    return e.Quality === GblPlanValues.ItemPlanQuality;
    //});
    itemsList = masterItemDataSource.filter(function (e) {
        return e.Quality === GblPlanValues.ItemPlanQuality;
    });

    for (var i = 0; i < itemsList.length; i++) {
        itemsList[i].RequiredSize = GblPlanValues.CutSize;
    }
    $("#GridItemsList").dxDataGrid({
        dataSource: itemsList,
        //filterValue: [["Quality", "=", GblPlanValues.ItemPlanQuality], ["GSM", "=", GblPlanValues.ItemPlanGsm]]
    });

    requiredItemList = masterItemDataSource.filter(function (e) {
        return e.ItemID === GblPaperId;
    });
    if (requiredItemList.length > 0) {
        requiredItemList[0].RequiredSize = GblPlanValues.CutSize;
        requiredItemList[0].FullSheets = GblPlanValues.FullSheets;
        requiredItemList[0].TotalPaperWtInKG = GblPlanValues.TotalPaperWeightInKg;
        requiredItemList[0].QuotationPaperRate = GblPlanValues.PaperRate;
        requiredItemList[0].QuotationPaperRateType = GblPlanValues.PaperRateType;
        if (requiredItemList[0].QuotationPaperRateType.toUpperCase().trim() === "SHEET" || requiredItemList[0].QuotationPaperRateType.toUpperCase().trim() === "SHEETS") {
            requiredItemList[0].QuotationPaperAmount = (Number(requiredItemList[0].FullSheets) * Number(requiredItemList[0].QuotationPaperRate)).toFixed(2);
        }
        else if (requiredItemList[0].QuotationPaperRateType.toUpperCase().trim() === "" || requiredItemList[0].QuotationPaperRateType.toUpperCase().trim() === "KG" || requiredItemList[0].QuotationPaperRateType.toUpperCase().trim() === "KG.") {
            requiredItemList[0].QuotationPaperAmount = (Number(requiredItemList[0].TotalPaperWtInKG) * Number(requiredItemList[0].QuotationPaperRate)).toFixed(2);
        } else {
            requiredItemList[0].QuotationPaperAmount = (Number(requiredItemList[0].TotalPaperWtInKG) * Number(requiredItemList[0].QuotationPaperRate)).toFixed(2);
        }
        //requiredItemList[0].QuotationPaperAmount = GblPlanValues.TotalPaperWeightInKg;
    }

    gridData = [];
    if (bookedItemDataSource.length > 0) {
        gridData = bookedItemDataSource.filter(function (e) {
            return e.ContentName === GblContentName;
        });
        if (gridData.length > 0) {
            gridData[0].RequiredSize = GblPlanValues.CutSize;
        }
    } else {
        //debugger
        gridData = masterItemDataSource.filter(function (e) {
            return e.ItemID === GblPaperId;
        });
        if (GblPlanValues.PlanType === "Sheet Planning" || GblPlanValues.PlanType === "SHEET PLANNING" || GblPlanValues.PlanType === "" || GblPlanValues.PlanType === undefined || GblPlanValues.PlanType === null) {
            if (gridData.length > 0) {
                gridData[0].RequiredSize = GblPlanValues.CutSize;
                gridData[0].FullSheets = GblPlanValues.FullSheets;
                gridData[0].TotalPaperWtInKG = GblPlanValues.TotalPaperWeightInKg;
                gridData[0].Rate = Number(GblPlanValues.PaperRate);
                //alert((Number(GblPlanValues.FullSheets) / ((gridData.UnitPerPacking === 0) ? 1 : gridData.UnitPerPacking)));
                if (gridData[0].ItemGroupNameID === -1) {
                    gridData[0].IssuePacks = Number(GblPlanValues.FullSheets) / (Number(gridData[0].UnitPerPacking) === 0 ? 1 : gridData[0].UnitPerPacking);
                } else {
                    gridData[0].IssuePacks = Number(GblPlanValues.FullSheets);
                }
                if (gridData[0].EstimationUnit.toUpperCase().trim() === "SHEET" || gridData[0].EstimationUnit.toUpperCase().trim() === "SHEETS") {
                    gridData[0].EstimatedQuantity = Number(GblPlanValues.FullSheets);
                } else if (gridData[0].EstimationUnit.toUpperCase().trim() === "KG" || gridData[0].EstimationUnit.toUpperCase().trim() === "KG" || gridData[0].EstimationUnit.toUpperCase().trim() === "NULL" || gridData[0].EstimationUnit.toUpperCase().trim() === "" || gridData[0].EstimationUnit.toUpperCase().trim() === undefined || gridData[0].EstimationUnit.toUpperCase().trim() === null) {
                    gridData[0].EstimatedQuantity = Number(GblPlanValues.TotalPaperWeightInKg);
                }

                gridData[0].Amount = (Number(gridData[0].EstimatedQuantity) * Number(gridData[0].Rate)).toFixed(2);
            }
        } else {
            if (gridData.length > 0) {
                gridData[0].RequiredSize = GblPlanValues.CutSize;
                gridData[0].FullSheets = GblPlanValues.FullSheets;
                gridData[0].TotalPaperWtInKG = GblPlanValues.TotalPaperWeightInKg;
                gridData[0].IssuePacks = Number(GblPlanValues.FullSheets);
                gridData[0].Rate = Number(GblPlanValues.PaperRate);
                if (gridData[0].EstimationUnit.toUpperCase().trim() === "KG" || gridData[0].EstimationUnit.toUpperCase().trim() === "NULL" || gridData[0].EstimationUnit.toUpperCase().trim() === "" || gridData[0].EstimationUnit.toUpperCase().trim() === undefined || gridData[0].EstimationUnit.toUpperCase().trim() === null) {
                    gridData[0].EstimatedQuantity = Number(GblPlanValues.TotalPaperWtInKG);
                } else {
                    gridData[0].EstimatedQuantity = Number(GblPlanValues.TotalPaperWtInKG);
                }
                gridData[0].Amount = (Number(gridData[0].EstimatedQuantity) * Number(gridData[0].Rate)).toFixed(2);
            }
        }
    }

    $("#GridRequiredItemList").dxDataGrid({
        dataSource: requiredItemList
    });

    $("#GridAllocatedItemList").dxDataGrid({
        dataSource: gridData
    });

    var indentData = [];
    var objectMaterial = db.transaction("JobContentsMaterialRequired").objectStore("JobContentsMaterialRequired");
    objectMaterial.openCursor().onsuccess = function (event) {
        var curOper = event.target.result;
        if (curOper) {
            if (Number(curOper.value.PlanContQty) === GblOrderQuantity && curOper.value.PlanContName === GblContentName && curOper.value.PlanContentType === GblContentType) {
                for (var val = 0; val < curOper.value.length; val++) {
                    if (curOper.value[val].ItemGroupNameID === -1 || curOper.value[val].ItemGroupNameID === -2) {
                        indentData.push(curOper.value[val]);
                    }
                }
            }
            curOper.continue();
        } else {
            if (indentData.length > 0) {
                $('#GridAllocatedItemList').dxDataGrid({ dataSource: indentData });
            }
        }
    };
    //$.ajax({
    //    type: "POST",
    //    url: "WebServiceProductionWorkOrder.asmx/LoadIndentGridData",
    //    data: '{PaperId:' + GblPaperId + '}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "text",
    //    success: function (results) {
    //        var res = results.replace(/\\/g, '');
    //        res = res.replace(/{"d":null/g, '');
    //        res = res.replace(/{"d":""/g, '');
    //        res = res.slice(0, -3);
    //        var gridData = JSON.parse(res.toString());
    //        $("#GridRequiredItemList").dxDataGrid({
    //            dataSource: gridData
    //        });
    //    },
    //    error: function errorFunc(jqXHR) {
    //        alert(jqXHR.message);
    //    }
    //});
}

$("#BtnNotification").click(function () {
    var orderBookingIDs = 0;
    var jobBookingIDs = 0;
    var commentData = "";
    var newHtml = '';
    document.getElementById("commentbadge").innerHTML = 0;

    if (FlagEdit === false) {
        orderBookingIDs = 0;
        jobBookingIDs = 0;
        if (TablePendingData.length <= 0) { return false; }
        orderBookingIDs = Number(TablePendingData[0].OrderBookingID);
        document.getElementById("commentbody").innerHTML = "";
        if (orderBookingIDs !== "" || orderBookingIDs !== 0 || orderBookingIDs !== null || orderBookingIDs !== undefined) {
            $.ajax({
                type: "POST",
                url: "WebServiceProductionWorkOrder.asmx/GetCommentData",
                data: '{orderBookingID:' + JSON.stringify(orderBookingIDs) + ',jobBookingID:' + JSON.stringify(jobBookingIDs) + '}',
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
                        document.getElementById("commentbadge").innerHTML = commentData.length;
                        for (var x = 0; x < commentData.length; x++) {
                            var CommentDate = new Date(parseInt(commentData[x].CommentDate.substr(6))).toLocaleString('en-IN', { timeZone: 'UTC' });
                            newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + ', Date: ' + CommentDate + '</b>';
                            newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                        }
                    }
                    $("#commentbody").append(newHtml);
                    $(".commentInput").hide();

                }

            });
        }

    } else {
        jobBookingIDs = Number(GblJobBookingID);
        orderBookingIDs = 0;
        if (jobBookingIDs === "" || jobBookingIDs === null || jobBookingIDs === undefined || jobBookingIDs === 0) {
            alert("Please select valid production work order to view comment details..!");
            return false;
        }
        document.getElementById("commentbody").innerHTML = "";
        if (jobBookingIDs !== "") {
            $.ajax({
                type: "POST",
                url: "WebServiceProductionWorkOrder.asmx/GetCommentData",
                data: '{orderBookingID:' + JSON.stringify(orderBookingIDs) + ',jobBookingID:' + JSON.stringify(jobBookingIDs) + '}',
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
                        document.getElementById("commentbadge").innerHTML = commentData.length;
                        for (var x = 0; x < commentData.length; x++) {
                            var CommentDateX = new Date(parseInt(commentData[x].CommentDate.substr(6))).toLocaleString('en-IN', { timeZone: 'UTC' });
                            newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + ', Date: ' + CommentDateX + '</b>';
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
        var jobBookingID = 0;
        var orderBookingID = 0;
        jobBookingID = Number(GblJobBookingID);
        if (jobBookingID === "" || jobBookingID === null || jobBookingID === undefined || jobBookingID === 0) {
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
        objectCommentDetail.ModuleName = "Production Work Order";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = jobBookingID;
        objectCommentDetail.JobBookingID = jobBookingID;
        //objectCommentDetail.TransactionID = purchaseid;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/SaveCommentData",
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
                //if (res === "Success") {
                // RadioValue = "Pending Requisitions";
                alert("Comment saved!", "Comment saved successfully.", "success");
                var commentData = "";
                var newHtml = '';
                jobBookingID = Number(GblJobBookingID);
                if (jobBookingID === "" || jobBookingID === null || jobBookingID === undefined || jobBookingID === 0) {
                    alert("Please select valid production work order to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (jobBookingID !== "" && jobBookingID !== 0) {
                    $.ajax({
                        type: "POST",
                        url: "WebServiceProductionWorkOrder.asmx/GetCommentData",
                        data: '{orderBookingID:' + JSON.stringify(orderBookingID) + ',jobBookingID:' + JSON.stringify(jobBookingID) + '}',
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
                                    var CommentDate = new Date(parseInt(commentData[x].CommentDate.substr(6))).toLocaleString('en-IN', { timeZone: 'UTC' });
                                    newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + ', Date: ' + CommentDate + '</b>';
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

$("#BtnRemoveFile").click(function () {
    updateAttachedPicture(GblContentName, GblContentType, "", "");
    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
});

//////Add Tool Process Wise///////////

$("#gridToolList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 1.4;
    },
    columns: [{ dataField: "ToolCode", allowEditing: false, width: 80 }, { dataField: "ToolName", allowEditing: false }, { dataField: "Remarks", allowEditing: true },
    {
        dataField: "AddTool", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 25,
        cellTemplate: function (container, options) {
            $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
        }
    }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType !== "data") return;
        if (clickedCell.column.dataField === "AddTool") {
            try {

                var newdata = [];
                var dataGrid = $('#gridAddedTool').dxDataGrid('instance');
                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ToolID === clickedCell.data.ToolID; });
                if (result.length === 1) {
                    return;
                }

                newdata = clickedCell.data;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);
            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#gridAddedTool").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.4;
    },
    columns: [{ dataField: "ToolCode", allowEditing: false, width: 80 }, { dataField: "ToolName", allowEditing: false }, { dataField: "Remarks", allowEditing: false },
    {
        dataField: "RemoveTool", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 25,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    }],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType !== "data") return;
        if (clickedCell.column.dataField === "RemoveTool") {
            try {
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);
            } catch (e) {
                console.log(e);
            }
        }
    }
});

$.ajax({
    type: "POST",
    url: "WebserviceProductionWorkOrder.asmx/GetToolsList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#gridToolList").dxDataGrid({
            dataSource: RES1
        });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

function ReloadTools() {
    if (e.newData.PlanContName === undefined) return;
    var result = $.grep(GblObjToolDetails, function (ex) {
        return ex.PlanContName.trim() === GblContentName.trim() && ex.PlanContentType === GblContentType;
    });
    if (result.length >= 1) {
        swal("Duplicate Content Name Found!", "Please enter different content name..!", "error");
        return;
    }
}