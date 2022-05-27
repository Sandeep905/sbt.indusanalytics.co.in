"use strict";
var GridCalenderContents, GblGSM = 0, GblQuality = "", GblMill = "";
var ObjCate = ["CALENDAR-DAILY", "CALENDAR-TABLE", "CALENDAR-TIN MOUNTING", "CALENDAR-WIRE O BOUND"];
////$.ajax({                //// For Category
////    type: 'post',
////    url: 'WebServicePlanWindow.asmx/GetSbCategory',
////    dataType: 'json',
////    contentType: "application/json; charset=utf-8",
////    data: {},
////    crossDomain: true,
////    success: function (results) {
////        if (results.d === "500") return;
////        var res = results.d.replace(/\\/g, '');
////        res = res.substr(1);
////        res = res.slice(0, -1);
////        var RES1 = JSON.parse(res);
////        $("#CalenderCategories").dxSelectBox({
////            items: RES1,
////            placeholder: "Select Category",
////            displayExpr: 'CategoryName',
////            valueExpr: 'CategoryId',
////            searchEnabled: true,
////            showClearButton: true
////        });
////    },
////    error: function errorFunc(jqXHR) {
////        // alert("not show");
////    }
////});

$("#CalenderCategories").dxSelectBox({
    items: ObjCate,
    placeholder: "Select Category",
    //displayExpr: 'CategoryName',
    //valueExpr: 'CategoryId',
    //searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var Category = data.value;
        $('#CalenderJobSize input').each(function () {
            if (this.id === "") return;
            if (this.type === "text" || this.type === "number") {
                //var id = "#" + this.id;
                //$(id).addClass("disabledbutton");
                //$('.disabledbutton').prop('disabled', true);

                document.getElementById(this.id).value = "";
            }
        });
        if (Category === null) {
            document.getElementById("PlanCalenderContImg").src = "images/Contents/PictureTable.png";
            $("#GridCalenderContents").dxDataGrid({ dataSource: [] });
            return;
        }

        var dataSource = [];
        document.getElementById("CalenderGutter").value = 0;

        if (Category.includes("CALENDAR-TABLE")) {
            $("#CalenderWidth").addClass("disabledbutton");
            $('#CalenderWidth').prop('disabled', false);
            $("#CalenderGutter").removeClass("disabledbutton");
            $('#CalenderGutter').prop('disabled', false);
            dataSource = [{ "ContentName": "Stand Board W*L" }, { "ContentName": "Stand Board H*L" }, { "ContentName": "Calendar" }
                , { "ContentName": "Plain Outer" }, { "ContentName": "Plain Inner" }, { "ContentName": "Pre Planned" }];
            document.getElementById("PlanCalenderContImg").src = "images/Contents/PictureTable.png";
        } else if (Category.includes("CALENDAR-TIN MOUNTING") || Category.includes("CALENDAR-DAILY") || Category.includes("CALENDAR-WIRE O BOUND")) {
            dataSource = [{ "ContentName": "Calendar" }, { "ContentName": "Plain Outer" }, { "ContentName": "Plain Inner" },
            { "ContentName": "Stand Board H*L" }, { "ContentName": "Pre Planned" }];
            $("#CalenderWidth").addClass("disabledbutton");
            $("#CalenderGutter").addClass("disabledbutton");
            $('#CalenderWidth').prop('disabled', false);
            $('#CalenderGutter').prop('disabled', false);
        }

        if (Category.includes("CALENDAR-TIN MOUNTING")) {
            document.getElementById("PlanCalenderContImg").src = "images/Contents/PictureTIN.png";
        } else if (Category.includes("CALENDAR-DAILY")) {
            document.getElementById("PlanCalenderContImg").src = "images/Contents/PictureDaily.png";
        } else if (Category.includes("CALENDAR-WIRE O BOUND")) {
            document.getElementById("PlanCalenderContImg").src = "images/Contents/PictureWiro.png";
        }

        $(function () {
            GridCalenderContents = $("#GridCalenderContents").dxDataGrid({
                dataSource: [],
                editing: {
                    mode: "row",
                    allowUpdating: true,
                    allowAdding: true,
                    allowDeleting: true
                },
                showRowLines: true,
                showBorders: true,
                columnFixing: { enabled: true },
                scrolling: { mode: 'virtual' },
                allowSorting: false,
                sorting: {
                    mode: "none"
                },
                allowColumnResizing: true,
                height: function () {
                    return window.innerHeight / 1.6;
                },
                columns: [{
                    dataField: "ContentName",
                    lookup: {
                        dataSource: dataSource,
                        displayExpr: "ContentName",
                        valueExpr: "ContentName"
                    }, width: 100,
                    validationRules: [{
                        type: "required",
                        message: "Content Name is required"
                    }],
                    setCellValue: function (rowData, value) {
                        var CalenderCategory = $("#CalenderCategories").dxSelectBox("instance").option('value');
                        var BH = Number(document.getElementById("CalenderHeight").value);
                        var BL = Number(document.getElementById("CalenderLength").value);
                        var BW = Number(document.getElementById("CalenderWidth").value);

                        var BHT = Number(document.getElementById("CalenderTrimTop").value);
                        var BHB = Number(document.getElementById("CalenderTrimBottom").value);
                        var BLL = Number(document.getElementById("CalenderTrimLeft").value);
                        var BLR = Number(document.getElementById("CalenderTrimRight").value);

                        var BGutter = Number(document.getElementById("CalenderGutter").value);
                        rowData.ContentCaption = value; rowData.ContentName = value;
                        rowData.JobH = BH;
                        rowData.JobL = BL;
                        rowData.JobW = BW;

                        rowData.DustTrimT = BHT;
                        rowData.DustTrimB = BHB;
                        rowData.DustTrimL = BLL;
                        rowData.DustTrimR = BLR;

                        rowData.FrontColor = 0; rowData.BackColor = 0; rowData.Pages = 0;
                        if (value === "") return;
                        if (value === "CALENDAR-DAILY") {
                            if (CalenderCategory.includes("Stand Board H*L")) {
                                rowData.Pages = 1;
                            }
                        } else {
                            if (CalenderCategory.includes("Stand Board H*L")) {
                                rowData.Pages = 2;
                            }
                        }
                        if (CalenderCategory.includes("Stand Board W*L")) {
                            rowData.Pages = 2;
                        } else if (CalenderCategory.includes("End Paper")) {
                            rowData.Pages = 4;
                        } else if (CalenderCategory.includes("Plain ")) {
                            rowData.Pages = 0;
                        }
                        if (value === "Hard Case Cover") {
                            rowData.Pages = 0;
                            rowData.FrontColor = 0;
                            rowData.BackColor = 0;
                            rowData.PlateType = "None";
                        }

                        if (value.includes("Stand Board")) {
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimL", "allowEditing", false);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimR", "allowEditing", false);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimT", "allowEditing", false);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimB", "allowEditing", false);
                            rowData.FrontColor = 0;
                            rowData.BackColor = 0;
                        } else {
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimL", "allowEditing", true);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimR", "allowEditing", true);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimT", "allowEditing", true);
                            GridCalenderContents._views.gridView.component.columnOption("DustTrimB", "allowEditing", true);
                        }

                        rowData.PlateType = "CTP Plate";
                        if (value.includes("Pages")) {
                            rowData.Pages = "";
                        }
                        if (value.includes("Stand Board") || value.includes("Hard Case Cover") || value.includes("Plain ") || value.includes("Dust Cover")) {
                            GridCalenderContents._views.gridView.component.columnOption("Pages", "allowEditing", false);
                            if (value === "Hard Case Cover") {
                                GridCalenderContents._views.gridView.component.columnOption("FrontColor", "allowEditing", false);
                                GridCalenderContents._views.gridView.component.columnOption("BackColor", "allowEditing", false);
                                GridCalenderContents._views.gridView.component.columnOption("Plate", "allowEditing", false);
                                rowData.PlateType = "None";
                            } else {
                                GridCalenderContents._views.gridView.component.columnOption("FrontColor", "allowEditing", true);
                                GridCalenderContents._views.gridView.component.columnOption("BackColor", "allowEditing", true);
                                GridCalenderContents._views.gridView.component.columnOption("Plate", "allowEditing", true);
                            }
                        } else {
                            GridCalenderContents._views.gridView.component.columnOption("Pages", "allowEditing", true);
                            GridCalenderContents._views.gridView.component.columnOption("Pages", "validationRules", [{ type: "required" }]);
                        }
                        if (value.includes("Pre Planned")) {
                            GridCalenderContents._views.gridView.component.columnOption("JobW", "allowEditing", false);
                            rowData.JobW = 0;
                        } else {
                            GridCalenderContents._views.gridView.component.columnOption("JobW", "allowEditing", true);
                        }
                        if ((value === "Plain Outer" || value === "Plain Inner") && CalenderCategory === "CALENDAR-TABLE") {
                            rowData.JobH = Number(2 * BH) + Number(BGutter * 3) + Number(2 * BW);
                            rowData.JobL = BL;
                        }
                    }
                }, { dataField: "ContentCaption", width: 100, validationRules: [{ type: "required" }] },
                {
                    dataField: "Quality", visible: true, lookup: { dataSource: ResQuality, displayExpr: "Quality", valueExpr: "Quality" }, width: 100,
                    validationRules: [{ type: "required" }],
                    setCellValue: function (rowData, value) {
                        rowData.Quality = value;
                        if (value !== "") {
                            GblQuality = value;
                            refreshCalGSM(value);
                        }
                    }
                }, {
                    dataField: "GSM",
                    setCellValue: function (rowData, value) {
                        rowData.GSM = value;
                        GblGSM = value;
                        refreshCalMill(value);
                    },
                    visible: true, width: 80,
                    lookup: { dataSource: ResItems.TblGSM, displayExpr: "GSM", valueExpr: "GSM" }, validationRules: [{ type: "required" }]
                }, {
                    dataField: "Mill", visible: true, width: 80,
                    lookup: { dataSource: ResItems.TblMill, displayExpr: "Mill", valueExpr: "Mill" },
                    setCellValue: function (rowData, value) {
                        rowData.Mill = value;
                        if (value === "") return;
                        GblMill = value;
                        refreshCalFinish(value);
                    },
                    validationRules: [{ type: "required" }]
                }, {
                    dataField: "Finish", visible: true, width: 80, lookup: { dataSource: ResItems.TblFinish, displayExpr: "Finish", valueExpr: "Finish" }
                },
                {
                    dataField: "Pages", caption: "Pages/Leaves", dataType: "number",
                    visible: true, width: 50,
                    setCellValue: function (rowData, value) {
                        if (Number(GblGSM) <= 0) return;
                        //var MultipleFour = Number(value) % 4;
                        //if (MultipleFour >= 1) {
                        //    rowData.Pages = 0;
                        //    return;
                        //} else
                        rowData.Pages = value;
                        var Sheet_Thichness = Number(GblGSM) * 0.000631312;
                        rowData.Spine = value * Sheet_Thichness;
                    }
                },
                { dataField: "FrontColor", caption: "F Color", width: 50, visible: true }, { dataField: "BackColor", caption: "B Color", width: 50, visible: true },
                {
                    dataField: "PlateType", lookup: {
                        dataSource: [{ "PlateType": "CTP Plate" }, { "PlateType": "PS Plate" },
                        { "PlateType": "PS Plate+Film" }, { "PlateType": "CTcP Plate" }, { "PlateType": "None" }],
                        displayExpr: "PlateType",
                        valueExpr: "PlateType"
                    }, validationRules: [{ type: "required" }] //value: "CTP Plate"
                }, {
                    dataField: "Spine", visible: true, format: {
                        type: "fixedPoint",
                        precision: 2
                    }
                },
                { dataField: "JobH", visible: true, width: 50, validationRules: [{ type: "required" }] },
                { dataField: "JobL", visible: true, width: 50, validationRules: [{ type: "required" }] },
                { dataField: "JobW", visible: true, width: 50 },
                { dataField: "DustTrimL", caption: "Marg L", width: 50, visible: true },
                { dataField: "DustTrimR", caption: "Marg R", width: 50, visible: true },
                { dataField: "DustTrimT", caption: "Marg T", width: 50, visible: true },
                { dataField: "DustTrimB", caption: "Marg B", width: 50, visible: true }],
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                onInitNewRow: function (e) {
                    if (isValidCalender() === false) {
                        window.setTimeout(function () { e.component.cancelEditData(); }, 0);
                        return true;
                    }
                    //                  var CalenderCategory = $("#CalenderCategories").dxSelectBox("instance").option('value');
                    //                    e.component.columnOption("ContentName", "allowEditing", true);
                    //                    e.component._options.editing.popup.title = CalenderCategory;
                },
                onEditingStart: function (e) {
                  //  e.component.columnOption("ContentName", "allowEditing", false);
                },
                onRowInserting: function (e) {
                    ////document.getElementById("CalenderDustleft").value = 0;
                    ////document.getElementById("CalenderDustright").value = 0;
                    ////if (e.data.ContentName === "Dust Cover") {
                    ////    document.getElementById("CalenderDustleft").value = Number(document.getElementById("CalenderLength").value) / 2;
                    ////    document.getElementById("CalenderDustright").value = Number(document.getElementById("CalenderHeight").value) / 2;
                    ////}
                                    
                    var BH = Number(document.getElementById("CalenderHeight").value);
                    var BL = Number(document.getElementById("CalenderLength").value);
                    e.data.JobL = BL + Number(e.data.DustTrimR) + Number(e.data.DustTrimL);
                    e.data.JobH = BH + Number(e.data.DustTrimT) + Number(e.data.DustTrimB);
                },
                //onRowInserted: function (e) {
                    
                //},
                onRowUpdating: function (e) {
                    // logEvent("RowUpdating");
                },
                onRowUpdated: function (e) {
                    //CalculateSpin(e);
                    var BH = Number(document.getElementById("CalenderHeight").value);
                    var BL = Number(document.getElementById("CalenderLength").value);
                    e.key.JobL = BL + Number(e.key.DustTrimR) + Number(e.key.DustTrimL);
                    e.key.JobH = BH + Number(e.key.DustTrimT) + Number(e.key.DustTrimB);
                    e.component.refresh();
                },
                summary: {
                    totalItems: [{
                        format: "fixedPoint",
                        precision: 2,
                        showInColumn: "Spine",
                        column: "Spine",
                        summaryType: "sum",
                        displayFormat: "Ttl:{0}",
                        alignByColumn: true,
                        visible: false
                    }]
                }
            }).dxDataGrid("instance");
        });
        document.getElementById("CalenderHeight").focus();
    }
});

////$.ajax({
////    type: 'POST',
////    url: "WebServicePlanWindow.asmx/LoadCalenderContents",
////    dataType: 'json',
////    contentType: "application/json; charset=utf-8",
////    data: {},    // "{'name': '" + Method_Name + "'}",
////    crossDomain: true,
////    success: function (results) {
////        if (results.d === "500") return;
////        var res = results.d.replace(/\\/g, '');
////        res = res.substr(1);
////        res = res.slice(0, -1);

////        LoadCalenderGrid(JSON.parse(res.toString()));
////    },
////    error: function errorFunc(jqXHR) {
////        // alert(jqXHR.message);
////    }
////});
var ResItems, ResQuality;
$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetQuality",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        ResQuality = JSON.parse(res);
    },
    error: function errorFunc(jqXHR) {
        alert("not show");
    }
});

$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetFiteredItems",
    data: '{Quality:' + JSON.stringify("") + ',GSM:' + JSON.stringify("") + ',Mill:' + JSON.stringify("") + '}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        ResItems = JSON.parse(res);
    }
});

function refreshCalGSM(value) {
    $.ajax({                //// For GSM
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetGSM',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{Quality:' + JSON.stringify(value) + '}',
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            var lookup = GridCalenderContents.columnOption("GSM", "lookup");
            lookup.dataSource = RES1;
            GridCalenderContents.columnOption("GSM", "lookup", lookup);
            GridCalenderContents.repaint();
        },
        error: function errorFunc(jqXHR) {
            alert("not show");
        }
    });
}

function refreshCalMill(value) {
    //var str = "Where GSM ='" + value + "' And Quality='" + GblQuality + "'";

    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/GetMill",
        data: '{Quality:' + JSON.stringify(GblQuality) + ',GSM:' + JSON.stringify(value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var Res1 = JSON.parse(res);
            var lookup = GridCalenderContents.columnOption("Mill", "lookup");
            lookup.dataSource = Res1;
            GridCalenderContents.columnOption("Mill", "lookup", lookup);
            GridCalenderContents.repaint();
        }
    });
}

function refreshCalFinish(value) {
    //var str = "Where GSM ='" + GblGSM + "' And Quality='" + GblQuality + "' And Mill='" + value + "'";

    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/GetFinish",
        data: '{Quality:' + JSON.stringify(GblQuality) + ',GSM:' + JSON.stringify(GblGSM) + ',Mill:' + JSON.stringify(value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var Res1 = JSON.parse(res);
            var lookup = GridCalenderContents.columnOption("Finish", "lookup");
            lookup.dataSource = Res1;
            GridCalenderContents.columnOption("Finish", "lookup", lookup);
            GridCalenderContents.repaint();
        }
    });
}

$("#ApplyCalenderButton").click(function () {
    if (isValidCalender() === false) return;
    var rowCount = GridCalenderContents.totalCount();
    if (rowCount <= 0) {
        DevExpress.ui.notify("Please add Calender contents first", "warning", 1000);
        return;
    }
    document.getElementById("ApplyCalenderButton").setAttribute("data-dismiss", "modal");
    var BQty = Number(document.getElementById("CalenderQuantity").value);
    var CalenderCategory = $("#CalenderCategories").dxSelectBox("instance").option('value');
    $("#SbCategory").dxSelectBox({
        value: CalenderCategory
    });
    try {
        var Obj_Job_Size = {};

        //document.getElementById('PlanTable').getElementsByTagName("tbody")[0];
        var tBodyContent = document.getElementById("Body_Planning");
        var BodyLength = tBodyContent.rows.length;
        if (BodyLength > 1) {
            for (var j = 0; j < BodyLength; j++) {
                if (j > 0) {
                    document.getElementById("Body_Planning").deleteRow(1);
                }
            }
        }

        removeAllContentsData();

        document.getElementById('lastCol').innerHTML = 0;
        document.getElementById('lastRow').innerHTML = 1;
        document.getElementById('Bdy_QtyRow').innerHTML = "";
        document.getElementById('FinalCostDivFooter').innerHTML = "";
        $("#Add_Quantity_Button").click();
        document.getElementById("txtqty1").value = BQty;

        for (var i = 0; i < rowCount; i++) {
            Obj_Job_Size = {};
            Obj_Job_Size.SizeHeight = GridCalenderContents._options.dataSource[i].JobH; //  Number(SizeHeight);
            Obj_Job_Size.SizeLength = GridCalenderContents._options.dataSource[i].JobL; // Number(SizeLength);
            Obj_Job_Size.SizeWidth = GridCalenderContents._options.dataSource[i].JobW; //Number(SizeWidth);
            Obj_Job_Size.SizeOpenflap = 0;// Number(SizeOpenflap);
            Obj_Job_Size.SizePastingflap = 0;//  Number(SizePastingflap);
            Obj_Job_Size.SizeBottomflap = 0;// Number(SizeBottomflap);
            Obj_Job_Size.JobNoOfPages = GridCalenderContents._options.dataSource[i].Pages;  // Number(JobNoOfPages);
            Obj_Job_Size.JobUps = 0;
            Obj_Job_Size.JobFlapHeight = 0;
            Obj_Job_Size.JobTongHeight = 0;
            Obj_Job_Size.JobFoldedH = 0;
            Obj_Job_Size.JobFoldedL = 0;

            var ContName;
            var PlanContentType = ContName = GridCalenderContents._options.dataSource[i].ContentName;
            if (ContName.includes("Cover")) { // === "Dust Cover" || ContName === "Hard Case Cover"
                PlanContentType = "Book Cover"; //Orientation
            } else if (ContName.includes("Stand Board")) {
                PlanContentType = "Multiple Leaves";
            } else if (ContName.includes("Plain Outer") || ContName.includes("Plain Inner")) {
                PlanContentType = "Rectangular";
            } else if (ContName.includes("End Paper")) {
                PlanContentType = "Book Pages";
            } else if (ContName.includes("Calendar") && CalenderCategory.includes("WIRO")) {
                PlanContentType = "Wiro Leaves";
            } else if (ContName.includes("Pre Planned")) {
                PlanContentType = "Pre Planned Sheet";
            }
            document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + PlanContentType + ".jpg";
            PlanContentType = PlanContentType.replace(/ /g, '');
            Obj_Job_Size.PlanContentType = PlanContentType;
            Obj_Job_Size.PlanFColor = GridCalenderContents._options.dataSource[i].FrontColor;  // Number(PlanFColor);
            Obj_Job_Size.PlanBColor = GridCalenderContents._options.dataSource[i].BackColor;  // Number(PlanBColor);
            Obj_Job_Size.PlanColorStrip = 0; // Number(PlanColorStrip);
            Obj_Job_Size.PlanGripper = 0; // Number(PlanGripper);
            if (Obj_Job_Size.PlanBColor === 0) {
                Obj_Job_Size.PlanPrintingStyle = "Single Side";
            } else /*if (Obj_Job_Size.PlanFColor === Obj_Job_Size.PlanBColor)*/ {
                Obj_Job_Size.PlanPrintingStyle = "Choose Best";
            }

            Obj_Job_Size.PlanWastageValue = 0;
            if (PlanContentType === "CalenderPages" || PlanContentType === "WiroCalenderPages" || PlanContentType === "WiroCalenderLeaves" || PlanContentType === "MultipleLeaves" || PlanContentType === "EndPaper") {
                Obj_Job_Size.Trimmingleft = Number(document.getElementById("CalenderTrimmingleft").value);
                Obj_Job_Size.Trimmingright = Number(document.getElementById("CalenderTrimmingright").value);
                Obj_Job_Size.Trimmingtop = Number(document.getElementById("CalenderTrimmingtop").value);
                Obj_Job_Size.Trimmingbottom = Number(document.getElementById("CalenderTrimmingbottom").value);
            } else {
                Obj_Job_Size.Trimmingleft = 0;
                Obj_Job_Size.Trimmingright = 0;
                Obj_Job_Size.Trimmingtop = 0;
                Obj_Job_Size.Trimmingbottom = 0;
            }
            Obj_Job_Size.Stripingleft = 0;
            Obj_Job_Size.Stripingright = 0;
            Obj_Job_Size.Stripingtop = 0;
            Obj_Job_Size.Stripingbottom = 0;
            Obj_Job_Size.PlanPrintingGrain = "Both";
            Obj_Job_Size.ItemPlanQuality = GridCalenderContents._options.dataSource[i].Quality;// ItemPlanQuality;
            Obj_Job_Size.ItemPlanGsm = GridCalenderContents._options.dataSource[i].GSM;  // ItemPlanGsm;
            Obj_Job_Size.ItemPlanMill = GridCalenderContents._options.dataSource[i].Mill;  // ItemPlanMill;
            Obj_Job_Size.PlanPlateType = GridCalenderContents._options.dataSource[i].PlateType;  // PlanPlateType;
            Obj_Job_Size.PlanWastageType = "Machine Default";
            Obj_Job_Size.PlanContQty = Number(BQty);
            Obj_Job_Size.PlanSpeFColor = 0;
            Obj_Job_Size.PlanSpeBColor = 0;
            Obj_Job_Size.PlanContName = GridCalenderContents._options.dataSource[i].ContentCaption;  // PlanContName;
            var finish = "";
            if (GridCalenderContents._options.dataSource[i].Finish === undefined || GridCalenderContents._options.dataSource[i].Finish === "undefined") {
                finish = "";
            } else {
                finish = GridCalenderContents._options.dataSource[i].Finish;
            }
            Obj_Job_Size.ItemPlanFinish = finish; // GridCalenderContents._options.dataSource[i].Finish;  // ItemPlanFinish;

            document.getElementById("Txt_Content_Name").value = Obj_Job_Size.PlanContName;
            document.getElementById("PlanContentType").value = Obj_Job_Size.PlanContentType;

            $("#Btn_Select_Content").click();
            saveContentsSizeValues(Obj_Job_Size);
        }
    } catch (e) {
        alert(e);
    }
});

function isValidCalender() {
    var CalenderCategory = $("#CalenderCategories").dxSelectBox("instance").option('value');
    var BH = Number(document.getElementById("CalenderHeight").value);
    var BL = Number(document.getElementById("CalenderLength").value);
    var BW = Number(document.getElementById("CalenderWidth").value);
    var BQty = Number(document.getElementById("CalenderQuantity").value);

    if (CalenderCategory === "" || CalenderCategory === null || CalenderCategory === "null") {
        alert("Please select Category first");
        DevExpress.ui.notify("Please select Category first", "warning", 1000);
        return false;
    }
    if ((BW === "" || BW < 1 || BW === "null") && $("#CalenderWidth").hasClass("disabledbutton") === false) {
        DevExpress.ui.notify("Please select job width first", "warning", 1000);
        document.getElementById("CalenderWidth").focus();
        return false;
    }
    if (BH === "" || BH < 1 || BH === "null") {
        DevExpress.ui.notify("Please select job height first", "warning", 1000);
        document.getElementById("CalenderHeight").focus();
        return false;
    }
    if (BL === "" || BL < 1 || BL === "null") {
        DevExpress.ui.notify("Please select job length first", "warning", 1000);
        document.getElementById("CalenderLength").focus();
        return false;
    }
    if (BQty === "" || BQty < 1 || BQty === "null") {
        DevExpress.ui.notify("Please enter order quantity first", "warning", 1000);
        document.getElementById("CalenderQuantity").focus();
        return false;
    }
    return true;
}