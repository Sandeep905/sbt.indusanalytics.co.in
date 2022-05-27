"use strict";

// *****  Declare Global varialbe  ****
var check = "Pending", GblContentName, GblGenCode, GblProdMasCode = "", GblContentType, GblFlagFormName, GblCommandName, GblJobCardNo = "";
var GblProductContID = 0, GblContentId = 0, GblProdMasID = 0, GblMaxGenCode = 0, GblBookingID = 0, GblJobBookingID = 0, GblOrderQuantity = 0, GblGenContId = 0, GblPaperId = 0;

// *****  Declare Global Objects  ****
var ObjContentsDataAll, TablePendingData = [], GblObjProcessItemReq = {};

// *****  Declare Global Flags  ****
var FlagEdit = false, FlagExport = false, ChkCond = false;
//var GblLoadingmsg = "Loading....";

var ObjProcessData = [];
var ObjContentsData = [], ObjStandardInkdata = [];
var GblJobType = [], GblPlateType = [];

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

try {

    $("#ProductCatalogGrid").dxDataGrid({
        dataSource: [],
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        columnResizingMode: 'widget',
        scrolling: { mode: 'infinite' },
        selection: { mode: 'single' },
        filterRow: { visible: true },
        rowAlternationEnabled: false,
        headerFilter: { visible: false },
        height: function () {
            return window.innerHeight / 1.3;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        onContentReady: function (e) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        },
        onSelectionChanged: function (data) {
            if (data) {
                TablePendingData = data.selectedRowsData;
                //if (data.selectedRowsData.length <= 0) { return false; }
                //GblOrderQuantity = data.selectedRowsData[0].OrderQuantity;
                //GblBookingID = data.selectedRowsData[0].BookingID;
                ////GblJobCardNo = data.selectedRowsData[0].JobBookingNo;
                //GblProdMasCode = data.selectedRowsData[0].ProductMasterCode;
                //GblJobBookingID = data.selectedRowsData[0].ProductMasterID;
                //if (GblProdMasCode === undefined) {
                //    GblProdMasCode = ""; GblJobBookingID = 0;
                //}
                //(async () => {
                //    await removeAllContentsData();
                //})();
                //if (check === "Pending") {
                //    FlagEdit = false;
                //    document.getElementById("BtnDeleteProduct").style.display = "none";
                //    GenerateProductCatalogNo();
                //} else {
                //    FlagEdit = true;
                //    GblGenCode = data.selectedRowsData[0].ProductMasterCode;
                //    document.getElementById("BtnDeleteProduct").style.display = "block";
                //}
                //document.getElementById("TxtBookingNoAuto").value = GblGenCode;
                //GetSelectedContentPlans();

                //$('#TxtQuantity').val(data.selectedRowsData[0].OrderQuantity);
                //$('#TxtJobName').val(data.selectedRowsData[0].JobName);
                //$('#TxtOrderQuantity').val(data.selectedRowsData[0].OrderQuantity);
                //$('#TxtApprovalNo').val(data.selectedRowsData[0].ApprovalNo);
                //$('#TxtApprovalDate').val(data.selectedRowsData[0].ApprovedDate);
                //$('#TxtQuoteNo').val(data.selectedRowsData[0].BookingNo);
                //$('#TxtQuoteDate').val(data.selectedRowsData[0].QuoteDate);
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
                //$("#SbConsigneeName").dxSelectBox({ value: data.selectedRowsData[0].ConsigneeID });

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

    $("#RadioPMPendingProc").dxRadioGroup({
        items: ["Pending", "Processed"],
        value: "Pending",
        layout: 'horizontal',
        onValueChanged: function (e) {
            check = e.value;
            TablePendingData = [];
            GblOrderQuantity = 0;
            GblBookingID = 0;
            GblProdMasCode = "";
            $('#TxtJobName').val("");
            GblJobCardNo = ""; GblJobBookingID = 0;
            $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
            $("#image-indicator").dxLoadPanel("instance").option("visible", true);
            LoadProductCatalogData();
        }
    });

    LoadProductCatalogData();

} catch (e) {
    alert(e);
}

//$.ajax({                //// For Job Type
//    type: 'post',
//    async: false,
//    url: 'WebServiceOthers.asmx/SelctboxJobType',
//    data: {},
//    contentType: "application/json; charset=utf-8",
//    dataType: "text",
//    success: function (results) {
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"d":/g, '');
//        res = res.replace(/""/g, '');
//        res = res.replace(/"{null/g, '');
//        res = res.replace(/u0026/g, '&');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        GblJobType = JSON.parse(res);
//        $("#SbJobType").dxSelectBox({
//            items: GblJobType
//        });
//    },
//    error: function errorFunc(jqXHR) {
//        // alert("not show");
//    }
//});

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

////***********   Generate Product Catalog No  ********************
function GenerateProductCatalogNo() {
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GenerateProductCatalogNo',
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var strmax = res.split(',');
            GblGenCode = strmax[0];
            document.getElementById("TxtBookingNoAuto").value = GblGenCode;
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}

function LoadProductCatalogData() {
    $.ajax({
        type: 'POST',
        url: "WebServiceProductionWorkOrder.asmx/LoadProductMasterData",
        data: '{Type:' + JSON.stringify(check) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());

            var columns;
            if (check === "Pending") {
                columns = [{ dataField: "LedgerID", visible: false }, { dataField: "BookingID", visible: false }, { dataField: "CategoryID", visible: false }, { dataField: "LedgerName", caption: "Client Name", minWidth: 50 }, { dataField: "CategoryName", minWidth: 40 }, { dataField: "JobName", minWidth: 50, width: 150 }, { dataField: "OrderQuantity", caption: "Planned Qty", minWidth: 30 },
                { dataField: "BookingNo", caption: "Quote No", minWidth: 30 }, { dataField: "QuoteDate", minWidth: 30 }, { dataField: "QuotedBy", caption: "Quoted By", minWidth: 30 }, /*{ dataField: "ProductMasterCode", caption: "PM Code", width: 90 }, */{ dataField: "ProductCode", minWidth: 40 }, { dataField: "IsHidden", caption: "Hidden", dataType: "boolean", minWidth: 10 }, { dataField: "ProductHSNName", caption: "HSN Group", minWidth: 20 }];
            } else {
                columns = [{ dataField: "ProductMasterCode", caption: "PC Code" }, { dataField: "LedgerID", visible: false }, { dataField: "BookingID", visible: false }, { dataField: "CategoryID", visible: false }, { dataField: "LedgerName", caption: "Client Name", width: 190 }, { dataField: "CategoryName", width: 100 }, { dataField: "JobName", width: 190 }, { dataField: "OrderQuantity", caption: "Planned Qty", width: 70 },
                { dataField: "BookingNo", caption: "Quote No", width: 60 }, { dataField: "QuoteDate", width: 80 }, { dataField: "UserName", caption: "PC Created By", width: 80 }, /*{ dataField: "ProductMasterCode", caption: "PM Code", width: 90 }, */{ dataField: "ProductCode", width: 80 }, { dataField: "IsHidden", caption: "Hidden", dataType: "boolean", width: 50 }, { dataField: "ProductHSNName", caption: "HSN Group", width: 110 },
                { dataField: "MaxProductMasterCode", visible: false, width: 60 }, { dataField: "ProductHSNID", visible: false, width: 60 }, { dataField: "ProductMasterCode", caption: "PC Code" }, { dataField: "JobBookingNo" }, { dataField: "ParentProductMasterCode", caption: "Parent PC Code" }, { dataField: "FileNo" }];
            }
            $("#ProductCatalogGrid").dxDataGrid({
                dataSource: RES1.PMData,
                columns: columns
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR.message);
        }
    });
}

$("#GridProductContentDetails").dxDataGrid({
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
    { dataField: "TotalUps", allowEditing: false, visible: false, minWidth: 50 },
    { dataField: "ItemPlanQuality", caption: "Quality", allowEditing: false, minWidth: 100 },
    { dataField: "ItemPlanGsm", caption: "GSM", allowEditing: false, minWidth: 80 },
    { dataField: "ItemPlanMill", caption: "Mill", allowEditing: false, minWidth: 80 },
    { dataField: "NoOfPages", caption: "Pages", allowEditing: false, visible: false, minWidth: 30 },
    { dataField: "PrintingStyle", allowEditing: false, visible: true, minWidth: 100 },
    {
        dataField: "JobTrimming", allowEditing: false, minWidth: 80,
        calculateCellValue(e) {
            if (e.Trimmingleft === undefined || e.Trimmingleft === "undefined") return "";
            var jobtrim = 'L=' + e.Trimmingleft + '; T=' + e.Trimmingtop + '; R=' + e.Trimmingright + '; B=' + e.Trimmingbottom;
            return jobtrim;
        }
    },
    { dataField: "PrintingImpressions", caption: "Ttl Impressions", allowEditing: false, visible: true, minWidth: 80 },
    { dataField: "PlanFColor", caption: "F Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanBColor", caption: "B Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanSpeFColor", caption: "Spe. F Color", allowEditing: false, minWidth: 50 },
    { dataField: "PlanSpeBColor", caption: "Spe. B Color", allowEditing: false, minWidth: 50 },
    {
        dataField: "UnitCost", caption: "Unit Cost", allowEditing: false, minWidth: 50,
        calculateCellValue(e) {
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
            if (e.OldGrantAmount === undefined || e.OldGrantAmount <= 0) e.OldGrantAmount = e.GrantAmount;
            if (e.OldGrantAmount !== undefined && e.OldGrantAmount > 0) {
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
            var SizeL = 0, SizeW = 0; var pperpack = '';
            SizeL = e.PaperSize.split('x')[0];
            SizeW = e.PaperSize.split('x')[1];
            if (e.PlanType === 'Sheet Planning') {
                pperpack = Number(e.FullSheets + Number(Number(e.UnitPerPacking) - Number(Number(e.FullSheets) % Number(e.UnitPerPacking)))) /
                    Number(e.UnitPerPacking) + ' ' + e.Packing + ' (' + e.UnitPerPacking + ') & (' +
                    Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                        * Number(e.FullSheets), 0) + ' KG)';
                return pperpack;
            } else {
                if (e.PurchaseUnit.toUpperCase() === "KG") {
                    pperpack = Number(e.FullSheets) + ' Sheets & (' +
                        Math.round(Number(Number(SizeL) * Number(SizeW) * Number(e.ItemPlanGsm)) / 1000000000
                            * Number(e.FullSheets), 0) + ' KG)';
                } else if (e.PurchaseUnit.toUpperCase().includes("SHEET") === true) {
                    pperpack = Number(e.FullSheets) + ' Sheets & (' +
                        Math.round(Number(Number(SizeW) / 1000) * Number(e.FullSheets), 2) + ' Meter)';
                }
                return pperpack;
            }
        }, allowEditing: false
    },
    { dataField: "ActualSheets", caption: "Cut Sheet Qty", allowEditing: false, visible: true, minWidth: 100 },
    {
        dataField: "PaperBy", allowEditing: false, visible: true, minWidth: 80,
        calculateCellValue(e) {
            var paperby = "Self";
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
            if (e.Stripingleft === undefined) return "";
            var jobstrip = 'L=' + e.Stripingleft + '; T=' + e.Stripingtop + '; R=' + e.Stripingright + '; B=' + e.Stripingbottom;
            return jobstrip;
        }
    },
    {
        caption: "", allowEditing: false, fixed: true, fixedPosition: "right", width: 50,
        cellTemplate: function (container, options) {
            $('<div>').addClass('master-detail-label dx-link').text('RePlan')
                .on('dxclick', function () {
                    try {
                        document.getElementById("TxtAddContentName").value = options.row.data.PlanContName;
                        document.getElementById("ContentOrientation").innerHTML = options.row.data.PlanContentType;
                        var ImgRef = options.row.data.PlanContentType.replace(/([A-Z])/g, ' $1').trim(); //add space before capital font 
                        document.getElementById("TxtContentImgSrc").value = "../images/Contents/" + ImgRef + ".jpg";

                        GblContentType = options.row.data.PlanContentType;
                        GblContentName = options.row.data.PlanContName;
                        GblProductContID = options.row.data.ProductMasterContentsID;
                        document.getElementById("PlanContentName").value = GblContentName;
                        document.getElementById("PlanContentType").value = GblContentType;
                        document.getElementById("PlanContQty").innerHTML = GblOrderQuantity;

                        clearPlanContWindow();
                        AddQuantityButton();
                        AddSelectedContent();

                        if (options.row.data.GrantAmount !== undefined && options.row.data.GrantAmount > 0) {
                            document.getElementById("Plan21").innerHTML = "";
                            var unitCost = Number(Number(options.row.data.GrantAmount) / Number(GblOrderQuantity)).toFixed(3);
                            var divPara1 = '<div style="margin-top: 0em; margin-bottom: 0px; background: transparent;"><div><div style="padding: 2px; font-size: 11px;">Paper:₹' + options.row.data.PaperAmount + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Printing:₹' + Number(options.row.data.PrintingAmount).toFixed(2) + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Process:₹' + options.row.data.OpAmt + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Total:₹ <span id="finalCstSpan21" class="th">' + options.row.data.GrantAmount + '</span></div>' +
                                '</div><div><div style="padding: 2px; font-size: 11px;">Unit:₹ ' + unitCost + '</div></div> <div style="display: none"><div style="padding: 2px; font-size: 11px;">Unit/1000:₹' + Number(Number(unitCost) * 1000).toFixed(3) + ' </div></div></div >';
                            document.getElementById("Plan21").innerHTML = divPara1;

                            document.getElementById("TxtOldGrantAmount").value = options.row.data.OldGrantAmount;
                        }
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#modalContentReplan");
                    } catch (e) {
                        console.log(e);
                    }
                }).appendTo(container);
        }
    },
    {
        dataField: "JobType", allowEditing: true, minWidth: 80,
        lookup: {
            dataSource: GblJobType,
            displayExpr: "JobType",
            valueExpr: "JobType"
        }
    },
    {
        dataField: "PlateType", allowEditing: true, minWidth: 80,
        lookup: {
            //dataSource: ["New", "Exist", "Partial"]
            dataSource: GblPlateType,
            displayExpr: "PlateType",
            valueExpr: "PlateType"
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
    //onEditorPreparing: function (e) {
    //    if (e.parentType === "dataRow" && e.dataField === "RePlan") {
    //        e.editorOptions.visible = false;
    //    } else if (e.parentType === "dataRow" && e.dataField !== "PlanContName") {
    //        e.editorOptions.disabled = true;
    //    }
    //},
    onSelectionChanged: function (data) {
        if (data) {
            if (data.selectedRowsData.length <= 0) {
                GblContentName = "";
                GblContentType = ""; GblPaperId = 0;
                clearData();
                GblPlanValues = {};
                GblProductContID = 0;
                return false;
            }
            try {
                GblContentName = data.selectedRowsData[0].PlanContName;
                GblContentType = data.selectedRowsData[0].PlanContentType;
                GblProductContID = data.selectedRowsData[0].ProductMasterContentsID;
                document.getElementById("PlanContentName").value = GblContentName;
                document.getElementById("PlanContentType").value = GblContentType;
                document.getElementById("PlanContQty").innerHTML = GblOrderQuantity;
                document.getElementById("TxtProductRemark").value = data.selectedRowsData[0].SpecialInstructions;

                GblPaperId = data.selectedRowsData[0].PaperID;

                //$('#TxtLineNo').val(ObjContentsDataAll[0].LineNo);
                if (GblProdMasCode === "" || GblProdMasCode === null || GblProdMasCode === undefined || GblProdMasCode === "null") {
                    //consol.log("passed");
                }
                else {
                    $('#TxtRemark').val(ObjContentsDataAll[0].JobDetailsRemark);
                }
                ProcesssData();
                GblPlanValues = data.selectedRowsData[0];

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
        { dataField: "ItemSubGroupName", allowEditing: false, caption: "Sub Name" },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false },
        { dataField: "ItemDescription", caption: "Item Desc.", allowEditing: false, visible: false },
        { dataField: "StockUnit", allowEditing: false },
        { dataField: "PhysicalStock", caption: "Stock", allowEditing: false },
        { dataField: "EstimationRate", caption: "Rate", allowEditing: false, format: { type: "decimal", precision: 3 } }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 3;
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
            var Qty = 0; var rowData, SheetL = 0, TotalSheets = 0, NoOfPages = 0;
            TotalSheets = GblPlanValues.ActualSheets;
            SheetL = GblPlanValues.CutSize.split('x')[0];
            NoOfPages = GblPlanValues.JobNoOfPages;
            rowData = data.selectedRowsData[0];

            if (rowData.ItemConsumptionFormula !== "" && rowData.ItemConsumptionFormula !== "null" && rowData.ItemConsumptionFormula !== null) {
                try {
                    Qty = eval(rowData.ItemConsumptionFormula);
                } catch (e) {
                    console.log(e);
                    document.getElementById("TxtRequiredMaterialQty").value = 0;
                }
            }
            document.getElementById("TxtRequiredMaterialQty").value = Qty;
            GblObjProcessItemReq.RequiredQty = Number(Qty);

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
    columns: [
        { dataField: "ItemID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemGroupID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemGroupNameID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessID", visible: false, width: 0, allowEditing: false },
        { dataField: "MachineID", allowEditing: false, visible: false }, { dataField: "MachineName", allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
        { dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", allowEditing: false }, { dataField: "RequiredQty", allowEditing: false },
        { dataField: "Rate", allowEditing: false },
        { dataField: "Amount", allowEditing: false },
        { dataField: "StockUnit", allowEditing: false },
        { dataField: "Remark", allowEditing: false }],
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
    data: {},
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

ShowAllProcesss();

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
            items: RES1,
            onSelectionChanged: function (data) {
                if (!data) return;
                GetConsignee(data.selectedItem.LedgerId);
            }
        });
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

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
    scrolling: true,
    height: function () {
        return window.innerHeight / 1.2;
    },
    columns: [{ dataField: "PlanContName", caption: "Content Name" }, { dataField: "Forms" }, { dataField: "MachineName" },// { dataField: "PlateSize" },
    { dataField: "Colors", caption: "Colors(F/B)" }, { dataField: "Ups" }, { dataField: "Sets" }, { dataField: "Sheets" }, { dataField: "PageNo" }
    ],
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
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

    var ObjStore = [];
    $('#GridSelectedInkColor').dxDataGrid({ dataSource: ObjStore });
    var objectMaterial = db.transaction("JobContentsInkShades").objectStore("JobContentsInkShades");
    objectMaterial.openCursor().onsuccess = function (event) {
        var curOper = event.target.result;
        if (curOper) {
            if (Number(curOper.value.PlanContQty) === GblOrderQuantity && curOper.value.PlanContName === GblContentName
                && curOper.value.PlanContentType === GblContentType) {
                for (var val = 0; val < curOper.value.length; val++) {
                    ObjStore.push(curOper.value[val]);
                }
                $('#GridSelectedInkColor').dxDataGrid({ dataSource: ObjStore });
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
                DevExpress.ui.notify("Material requirement for selected content is successfully applied...", "success", 1500);

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
                DevExpress.ui.notify("Ink requirement for selected content is successfully applied...", "success", 1500);

                OpenCloseModal(false, "BtnApplyRequirement", "#modalShadeSelection");
            }
        }
    } catch (e) {
        //alert(e);
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
        newdata.Rate = Number(GblObjProcessItemReq.Rate);
        newdata.Amount = Number(Number(newdata.RequiredQty).toFixed(3) * Number(newdata.Rate)).toFixed(3);
        newdata.StockUnit = document.getElementById("TxtMaterialStockUnit").value.trim();
        newdata.ItemCode = GblObjProcessItemReq.ItemCode;
        newdata.ItemName = GblObjProcessItemReq.ItemName;
        newdata.ProcessID = GblObjProcessItemReq.ProcessID;
        newdata.ProcessName = GblObjProcessItemReq.ProcessName;
        newdata.Remark = document.getElementById("TxtRequiredMaterialRemark").value.trim();

        if (newdata.MachineID <= 0 || newdata.MachineID === null || newdata.MachineName === "") {
            swal("Machine Not Selected", "Please select machine first..", "warning");
            return;
        }
        var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ItemID === newdata.ItemID && e.ProcessID === newdata.ProcessID && e.MachineID === newdata.MachineID; });
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

    var objectStore = db.transaction("JobContentsForms").objectStore("JobContentsForms");
    objectStore.openCursor().onsuccess = function (event) {
        $("#image-indicator").dxLoadPanel("instance").option("message", "Please wait...");
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        var curFrm = event.target.result;
        if (curFrm) {
            if (GblContentName === curFrm.value["PlanContName"] && GblContentType === curFrm.value["PlanContentType"]) {
                $("#GridJCFormWise").dxDataGrid({ dataSource: curFrm.value });
                OpenCloseModal(true, "BtnFormWise", "#modalJCFormWise");
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                return;
            }
            curFrm.continue();
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    };

    if (GblJobCardNo === "") return;
    $.ajax({
        type: 'post',
        url: 'WebServiceProductionWorkOrder.asmx/GridJCFormWise',
        data: '{JobCardNO:' + JSON.stringify(GblJobCardNo) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.substr(1);
            res = res.slice(0, -3);
            var objres = JSON.parse(res.toString());
            $("#GridJCFormWise").dxDataGrid({
                dataSource: objres
            });
            OpenCloseModal(true, "BtnFormWise", "#modalJCFormWise");
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
});

$("#BtnSaveProduct").click(function () {
    if (TablePendingData.length <= 0) {
        swal("Invalid Selection", "Please select product again", "error");
        return;
    }
    saveProductCatalog();
});

$("#BtnDeleteProduct").click(function () {

    if (Number(GblBookingID) <= 0 || GblBookingID === "" || GblBookingID === null) {
        swal("Empty Selection", "Please select product for delete", "warning");
        return false;
    }
    if (GblProdMasCode === "" || GblProdMasCode === null || GblProdMasCode === undefined || GblProdMasCode === "null") {
        swal("Empty Selection", "Please select product for delete", "warning");
        return false;
    }
    swal({
        title: "Deleting Confirmation..",
        text: "Are you sure to delete this Product: " + GblProdMasCode,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: true
    }, function () {
        var BookNo = JSON.stringify(GblProdMasCode);
        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/RecycleProductCatalog",
            data: '{PCNo:' + BookNo + ',PCId:' + GblJobBookingID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/"/g, '');
                res = res.replace(/d:/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                if (res === "Success") {
                    swal({
                        title: "Deleted",
                        text: "Product No: " + BookNo + " deleted successfully..!",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        closeOnConfirm: true
                    }, function () {
                        location.reload();
                    });
                } else if (res === "Order Booked" || res === "Production Work Order") {
                    swal("Can't Delete", "Selected product has been used in few transactions. Please delete the transactions first.!", "error");
                } else {
                    swal("error occured!", res, "error");
                }
            },
            error: function errorFunc(jqXHR) {
                //alert("Something went wrong!");
            }
        });
    });
});

$("#BtnProductDetails").click(function () {
    ///////Get Product Details From Pending Or Processed List By Minesh Jain On 22-May-2019
    if (TablePendingData.length <= 0) { return false; }
    GblOrderQuantity = TablePendingData[0].OrderQuantity;
    GblBookingID = TablePendingData[0].BookingID;
    //GblJobCardNo = TablePendingData[0].JobBookingNo;
    GblProdMasCode = TablePendingData[0].ProductMasterCode;
    GblJobBookingID = TablePendingData[0].ProductMasterID;
    if (GblProdMasCode === undefined) {
        GblProdMasCode = ""; GblJobBookingID = 0;
    }
    (async () => {
        await removeAllContentsData();
    })();
    if (check === "Pending") {
        FlagEdit = false;
        $("#BtnDeleteProduct").addClass("hidden");
        GenerateProductCatalogNo();
    } else {
        FlagEdit = true;
        GblGenCode = TablePendingData[0].ProductMasterCode;
        $("#BtnDeleteProduct").removeClass("hidden");
    }
    document.getElementById("TxtBookingNoAuto").value = GblGenCode;
    GetSelectedContentPlans();

    $('#TxtQuantity').val(TablePendingData[0].OrderQuantity);
    $('#TxtJobName').val(TablePendingData[0].JobName);
    $('#TxtOrderQuantity').val(TablePendingData[0].OrderQuantity);
    $('#TxtApprovalNo').val(TablePendingData[0].ApprovalNo);
    $('#TxtApprovalDate').val(TablePendingData[0].ApprovedDate);
    $('#TxtQuoteNo').val(TablePendingData[0].BookingNo);
    $('#TxtQuoteDate').val(TablePendingData[0].QuoteDate);
    $('#TxtProductCode').val(TablePendingData[0].ProductCode);
    $('#TxtEmail').val(TablePendingData[0].Email);
    $('#TxtRemark').val(TablePendingData[0].Remark);

    $("#SbClientName").dxSelectBox({ value: TablePendingData[0].LedgerID });
    $("#SbJobCoordinator").dxSelectBox({ value: TablePendingData[0].CoordinatorLedgerID });
    $("#SbJobPriority").dxSelectBox({ value: TablePendingData[0].JobPriority });
    $("#SbJobType").dxSelectBox({ value: TablePendingData[0].JobType });
    $("#SbJobReference").dxSelectBox({ value: TablePendingData[0].JobReference });
    $("#SbCategory").dxSelectBox({ value: TablePendingData[0].CategoryID });
    $("#SbProductHSNGroup").dxSelectBox({ value: TablePendingData[0].ProductHSNID });
    $("#SbConsigneeName").dxSelectBox({ value: TablePendingData[0].ConsigneeID });

    //////////////////////////////////////////////////////////////////////////////////
    clearData();
    if (document.getElementById("TxtJobName").value.trim() === "" || TablePendingData.length <= 0) {
        return false;
    }
    ProcesssData();
    OpenCloseModal(true, "BtnProductDetails", "#modalJobContentsDetails");
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
                scrolling: true,
                height: function () {
                    return window.innerHeight / 1.2;
                },
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

function ShowAllProcesss() {

    $("#GridSelectedProductProcess").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        sorting: { mode: 'none' },
        editing: { mode: "cell", allowUpdating: true },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        columns: [{ dataField: "ProcessID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
        {
            dataField: "Rate", allowEditing: false, format: {
                type: "decimal", // one of the predefined formats
                precision: 3 // the precision of values                    
            }
        },
        { dataField: "RateFactor", allowEditing: false, visible: false }, { dataField: "Remarks", caption: "Process Remark", allowEditing: true }, { dataField: "PaperConsumptionRequired", width: 180, dataType: "boolean", allowEditing: true }],
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        filterRow: { visible: false },
        height: function () {
            return window.innerHeight / 3;
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
        onRowUpdated: function (e) {
            UpdateContentWiseProcessRowData(GblContentName, GblContentType, e.data);
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        }
    });

    $("#GridMaterialProcess").dxDataGrid($("#GridSelectedProductProcess").dxDataGrid("instance").option());

    $("#GridMaterialProcess").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        selection: { mode: "single" },
        columns: [{ dataField: "ProcessID", visible: false, width: 0, allowEditing: false }, { dataField: "ProcessName", allowEditing: false },
        { dataField: "Rate", allowEditing: false }, { dataField: "Remarks", allowEditing: false }],
        onSelectionChanged: function (data) {
            GblObjProcessItemReq = {};
            if (data) {
                if (data.selectedRowsData.length <= 0) return;
                GblObjProcessItemReq.ProcessID = data.selectedRowsData[0].ProcessID;
                GblObjProcessItemReq.ProcessName = data.selectedRowsData[0].ProcessName;
                GetMaterialList(data.selectedRowsData[0].ProcessID);
            }
        }
    });
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
    $("#GridInkName").dxDataGrid({                  //// GridProcess  gridopr
        dataSource: dataSource,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        columnAutoWidth: true,
        columns: [{ dataField: "ItemID", visible: false, width: 0, allowEditing: false }, { dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", caption: "Ink Name", allowEditing: false },
        { dataField: "ItemGroupID", visible: false }, { dataField: "ItemGroupNameID", visible: false }, { dataField: "ItemPantoneCode", allowEditing: false },
        { dataField: "ItemGroupName", allowEditing: false, caption: "Group Name" },
        {
            dataField: "ColorSpecification", caption: "Shade Side", fixedPosition: "right", fixed: true,
            lookup: {
                dataSource: ["Front", "Back"]
            }, validationRules: [{ type: 'required' }],
            width: 120
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
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.dataField === "Add") {
                try {
                    if (clickedCell.data.ColorSpecification === "" || clickedCell.data.ColorSpecification === undefined) {
                        DevExpress.ui.notify("Select Ink shade side..!", "warning", 1000);
                        clickedCell.component.cellValue(clickedCell.rowIndex, 4, "");
                        return false;
                    }
                    var dataGrid = $('#GridSelectedInkColor').dxDataGrid('instance');
                    ////var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ColorSpecification === clickedCell.data.ColorSpecification; });
                    ////var InkC = 0;
                    ////if (clickedCell.data.ColorSpecification === "Front") {
                    ////    InkC = $('#GridProductContentDetails').dxDataGrid('instance').selectedRowsData[0].FrontColor;
                    ////} else {
                    ////    InkC = $('#GridProductContentDetails').dxDataGrid('instance').selectedRowsData[0].BackColor;
                    ////}
                    ////if (result.length >= InkC) {
                    ////    // not found
                    ////} 
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
                    //DevExpress.ui.notify("Ink added..!", "success", 1000);
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
        columns: [{ dataField: "ItemID", visible: false, allowEditing: false }, { dataField: "ItemName", caption: "Ink Name", allowEditing: false },
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
                    ////clickedCell.component.refresh(true);
                    //DevExpress.ui.notify("Ink removed..!", "error", 500);
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
     * Load all contetnts and it's process or forms details for save Product. */
function saveProductCatalog() {
    try {
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        var FlgPlan = false, FlgOpr = false, FlgBook = false;
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        var TblPlanning = [], TblOperations = [], TblContentForms = [], TblContentMatRequireData = [], TblContentInkData = [];

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
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
                            //FormsData.BookingID = GblBookingID;

                            TblContentForms.push(FormsData);
                        }
                        curForms.continue();
                    } else {
                        //alert("No more entries!");
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

                                    operData.SequenceNo = TransID;
                                    operData.ProcessID = Number(curOper.value[val].ProcessID);
                                    operData.SizeL = Number(curOper.value[val].SizeL);
                                    operData.SizeW = Number(curOper.value[val].SizeW);
                                    operData.NoOfPass = Number(curOper.value[val].NoOfPass);
                                    operData.Quantity = Number(curOper.value[val].Quantity);
                                    operData.Rate = Number(curOper.value[val].Rate).toFixed(3);
                                    operData.Ups = Number(curOper.value[val].Ups);
                                    operData.Amount = Number(curOper.value[val].Amount);
                                    operData.Remarks = curOper.value[val].Remarks;
                                    operData.PlanID = Number(curOper.value[val].PlanID);

                                    operData.PaperConsumptionRequired = curOper.value[val].PaperConsumptionRequired; //added on 30-12-19
                                    operData.Pieces = Number(curOper.value[val].Pieces);
                                    operData.NoOfStitch = Number(curOper.value[val].NoOfStitch);
                                    operData.NoOfLoops = Number(curOper.value[val].NoOfLoops);
                                    operData.NoOfColors = Number(curOper.value[val].NoOfColors);
                                    operData.RateFactor = curOper.value[val].RateFactor;
                                    //operData.BookingID = GblBookingID;

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
                                    if (curMat) {
                                        var SequenceNo = 1;
                                        for (var val = 0; val < curMat.value.length; val++) {
                                            MatData = {};
                                            /////MatData = curMat.value[val];
                                            MatData.PlanContQty = curMat.value.PlanContQty;
                                            MatData.PlanContentType = curMat.value.PlanContentType;
                                            MatData.PlanContName = curMat.value.PlanContName;

                                            MatData.ProcessID = curMat.value[val].ProcessID;
                                            MatData.ItemID = curMat.value[val].ItemID;
                                            MatData.MachineID = curMat.value[val].MachineID;
                                            MatData.RequiredQty = Number(curMat.value[val].RequiredQty);
                                            MatData.Rate = Number(curMat.value[val].Rate);
                                            MatData.Amount = Number(curMat.value[val].Amount);
                                            MatData.RequiredQtyUnit = curMat.value[val].StockUnit;
                                            MatData.SequenceNo = SequenceNo;
                                            MatData.BookingID = GblBookingID;

                                            TblContentMatRequireData.push(MatData);
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
                                                    /////MatData = curMat.value[val];
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
                                                if (FlgPlan === true && FlgOpr === true && FlgBook === true) {
                                                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                                                    callSaveProductCatalog(TblPlanning, TblOperations, TblContentForms, TblContentMatRequireData, TblContentInkData);
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
    } catch (e) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

/**
 * final save data call
 * @param {any} TblPlanning contents data list 
 * @param {any} TblOperations contents wise opeeration list
 * @param {any} TblContentForms contents wise forms list
 * @param {any} TblContentMatRequireData contents wise Material list
 * @param {any} TblContentInkData contents wise ink list
 */
function callSaveProductCatalog(TblPlanning, TblOperations, TblContentForms, TblContentMatRequireData, TblContentInkData) {
    try {
        if (TblPlanning.length <= 0) {
            swal("Content Not Available", "Please add atleast one content", "error");
            return;
        }
        var JobName = document.getElementById("TxtJobName").value.trim();
        var ApprovalNo = document.getElementById("TxtApprovalNo").value.trim();
        var ArtWorkCode = document.getElementById("TxtProductCode").value.trim();
        var QuoteNo = document.getElementById("TxtQuoteNo").value.trim();
        var QuoteDate = document.getElementById("TxtQuoteDate").value.trim();
        var Remark = document.getElementById("TxtProductRemark").value.trim();

        var LedgerId = $("#SbClientName").dxSelectBox("instance").option('value');
        var ClientName = $("#SbClientName").dxSelectBox("instance").option('text');
        var CategoryId = $("#SbCategory").dxSelectBox("instance").option('value');
        var SbConsigneeID = $("#SbConsigneeName").dxSelectBox("instance").option('value');
        var SbProductHSNID = $("#SbProductHSNGroup").dxSelectBox("instance").option('value');
        var SbJobCoordinatorID = $("#SbJobCoordinator").dxSelectBox("instance").option('value');
        var SbJobPriority = $("#SbJobPriority").dxSelectBox("instance").option('value');
        var TxtEmail = document.getElementById("TxtEmail").value.trim();
        var SbJobType = $("#SbJobType").dxSelectBox("instance").option('value');
        var SbJobReference = $("#SbJobReference").dxSelectBox("instance").option('value');

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
            $("#SbClientName").dxValidator('instance').validate();
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
        if (SbJobCoordinatorID === "" || Number(SbJobCoordinatorID) <= 0 || SbJobCoordinatorID === null) {
            swal("Invalid Job Coordinator", "Please Enter Job Coordinator", "warning");
            DevExpress.ui.notify("Please Enter Job Coordinator..!", "error", 1500);
            return;
        }
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
        if (SbJobReference === "" || SbJobReference === null || SbJobReference === "null") {
            swal("Invalid Job Reference", "Please Select Job Reference", "warning");
            DevExpress.ui.notify("Please Select Job Reference..!", "error", 1500);
            //$("#SbJobReference").dxValidator('instance').validate();
            return;
        }

        var GridContList = $("#GridProductContentDetails").dxDataGrid('instance');

        for (var val = 0; val < TblPlanning.length; val++) {
            TblPlanning[val].BookingID = GblBookingID;

            for (var i = 0; i < GridContList._options.dataSource.length; i++) {
                if (GridContList._options.dataSource[i].PlateType === undefined || GridContList._options.dataSource[i].PlateType === null || GridContList._options.dataSource[i].PlateType === "") {
                    swal("Invalid Plate Type Selection", "Please select type of plate for content: " + GridContList._options.dataSource[i].PlanContName, "warning");
                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                    return;
                }
                if (GridContList._options.dataSource[i].PlanContName === TblPlanning[val].PlanContName && GridContList._options.dataSource[i].PlanContentType === TblPlanning[val].PlanContentType) {
                    TblPlanning[val].JobType = GridContList._options.dataSource[i].JobType;
                    TblPlanning[val].PlateType = GridContList._options.dataSource[i].PlateType;
                }
            }

            TblPlanning[val].ApprovalNo = ApprovalNo;
            TblPlanning[val].JobType = SbJobType;
            TblPlanning[val].JobReference = SbJobReference;
            TblPlanning[val].JobPriority = SbJobPriority;
            TblPlanning[val].CoordinatorLedgerID = SbJobCoordinatorID;
            TblPlanning[val].CoordinatorLedgerName = $("#SbJobCoordinator").dxSelectBox("instance").option('text');
            TblPlanning[val].ConsigneeLedgerID = SbConsigneeID;
        }

        var TblBooking = [];
        var ObjBooking = {};
        //if (check !== "Pending" && FlagEdit === true) {
        //    ObjBooking.ProductMasterID = TablePendingData[0].ProductMasterID;
        //}

        ObjBooking.BookingID = GblBookingID;
        ObjBooking.LedgerID = LedgerId;
        ObjBooking.ConsigneeID = SbConsigneeID;
        ObjBooking.CategoryID = CategoryId;
        ObjBooking.ProductHSNID = SbProductHSNID;
        ObjBooking.OrderBookingID = TablePendingData[0].OrderBookingID;
        ObjBooking.OrderBookingDetailsID = TablePendingData[0].OrderBookingDetailsID;
        ObjBooking.CoordinatorLedgerID = SbJobCoordinatorID;

        ObjBooking.BookingNo = QuoteNo;
        ObjBooking.QuoteDate = QuoteDate;
        ObjBooking.ApprovalNo = ApprovalNo;
        ObjBooking.JobName = JobName;
        ObjBooking.ProductCode = ArtWorkCode;
        ObjBooking.Remark = Remark;
        ObjBooking.OrderQuantity = GblOrderQuantity;
        ObjBooking.JobPriority = SbJobPriority;
        ObjBooking.JobType = SbJobType;
        ObjBooking.JobReference = SbJobReference;
        ObjBooking.JobPriority = SbJobPriority;
        ///ObjBooking.Email = TxtEmail;

        TblBooking.push(ObjBooking);

        var BookingNo = document.getElementById("TxtBookingNoAuto").value;

        $.ajax({
            type: "POST",
            url: "WebServiceProductionWorkOrder.asmx/SaveProductCatalogData",
            data: '{TblBooking:' + JSON.stringify(TblBooking) + ',TblPlanning:' + JSON.stringify(TblPlanning) + ',TblOperations:' + JSON.stringify(TblOperations) + '' +
                ', TblContentForms: ' + JSON.stringify(TblContentForms) + ', FlagEdit: ' + JSON.stringify(FlagEdit) + ', ProductMasterCode: ' + JSON.stringify(BookingNo) + ', JobBookingID:' + JSON.stringify(GblJobBookingID) + ',ObjMateRequire:' + JSON.stringify(TblContentMatRequireData) + ',ObjInkData:' + JSON.stringify(TblContentInkData) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var RES1 = JSON.parse(results);
                var title, text, type;
                if (RES1.d.includes("Error:")) {
                    title = "Something went wrong";
                    text = RES1.d;
                    type = "error";
                } else if (RES1.d.includes("not authorized")) {
                    title = "Access Denied..!";
                    text = RES1.d;
                    type = "error";
                } else {
                    if (FlagEdit === false) { title = "Saved Successfully"; } else title = "Updated Successfully";
                    text = "Product Master No: " + RES1.d + " " + title + "..!";
                    type: "success";
                    document.getElementById("TxtBookingNoAuto").value = RES1.d;
                }
                swal({
                    title: title,
                    text: text,
                    type: type,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: true
                }, function () {
                    location.reload();
                });
            },
            error: function (ex) {
                console.log(ex);
            }
        });
    } catch (e) {
        alert(e);
    }
}

$("#BtnRemoveFile").click(function () {
    updateAttachedPicture(GblContentName, GblContentType, "", "");
    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
});