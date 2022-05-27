"use strict";
var GridBookContents, GblGSM = 0, GblQuality = "", GblMill = "";
var ObjCate = ["PERFECT BINDING BOOK", "SPIRAL/WIRE-O BINDING BOOK", "HARD COVER BOOK (Flat Spine)", "HARD COVER BOOK (Round Spine)", "WIRE-O PAD", "WRITING PAD", "CENTER PINNING BOOK", "BOOK BLOCK", "HARD COVER CASE", "HOT MELT PERFECT BINDING BOOK"]
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
////        $("#BookCategories").dxSelectBox({
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

$("#BookCategories").dxSelectBox({
    items: ObjCate,
    placeholder: "Select Category",
    //displayExpr: 'CategoryName',
    //valueExpr: 'CategoryId',
    //searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var Category = data.value;
        $('#BookJob_Size input').each(function () {
            if (this.id === "") return;
            if (this.type === "text" || this.type === "number") {
                var id = "#" + this.id;
                $(id).addClass("disabledbutton");
                $('.disabledbutton').prop('disabled', true);

                document.getElementById(this.id).value = "";
            }
        });
        if (Category === null) return;

        var dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "Wiro Book Pages" }, { "ContentName": "Book Cover" }
            , { "ContentName": "Hard Case Cover" }, { "ContentName": "Dust Cover" }, { "ContentName": "End Paper" }, { "ContentName": "Tipping Leaves" },
        { "ContentName": "Multiple Leaves" }, { "ContentName": "Jacket Top" }, { "ContentName": "Jacket Bottom" }];
        document.getElementById("BookExtension").value = 0;
        document.getElementById("BookCoverTurnIn").value = 0;
        document.getElementById("BookHinge").value = 0;
        document.getElementById("BookLoops").value = 0;

        if (Category.includes("PERFECT BINDING BOOK")) {
            $("#BookSpine").removeClass("disabledbutton");
            $('#BookSpine').prop('disabled', false);
            dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "Book Cover" }, { "ContentName": "End Paper" }
                , { "ContentName": "Tipping Leaves" }, { "ContentName": "Dust Cover" }, { "ContentName": "Multiple Leaves" }];
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Perfect.png";
        } else if (Category.includes("SPIRAL/WIRE-O BINDING BOOK")) {
            dataSource = [{ "ContentName": "Wiro Book Pages" }, { "ContentName": "Wiro Leaves" }, { "ContentName": "Top Cover" },
            { "ContentName": "Back Cover" }, { "ContentName": "Jacket Top" }, { "ContentName": "Jacket Bottom" },
            { "ContentName": "Tipping Leaves" }, { "ContentName": "Multiple Leaves" }];
            $("#BookSpine").removeClass("disabledbutton");
            $("#BookLoops").removeClass("disabledbutton");
            $('#BookSpine').prop('disabled', false);
            $('#BookLoops').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Wiro.png";
        } else if (Category.includes("HARD COVER BOOK (Flat Spine)")) {
            document.getElementById("BookExtension").value = 4;
            document.getElementById("BookCoverTurnIn").value = 15;
            document.getElementById("BookHinge").value = 10;

            $("#BookExtension").removeClass("disabledbutton");
            $("#BookCoverTurnIn").removeClass("disabledbutton");
            $("#BookSpine").removeClass("disabledbutton");
            $("#BookHinge").removeClass("disabledbutton");

            $('#BookExtension').prop('disabled', false);
            $('#BookCoverTurnIn').prop('disabled', false);
            $('#BookSpine').prop('disabled', false);
            $('#BookHinge').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Hardcase.png";
        } else if (Category.includes("HARD COVER BOOK (Round Spine)")) {
            document.getElementById("BookExtension").value = 4;
            document.getElementById("BookCoverTurnIn").value = 15;
            document.getElementById("BookHinge").value = 10;

            $("#BookExtension").removeClass("disabledbutton");
            $("#BookCoverTurnIn").removeClass("disabledbutton");
            $("#BookSpine").removeClass("disabledbutton");
            $("#BookHinge").removeClass("disabledbutton");

            $('#BookExtension').prop('disabled', false);
            $('#BookCoverTurnIn').prop('disabled', false);
            $('#BookSpine').prop('disabled', false);
            $('#BookHinge').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Round_Hardcase.png";
        } else if (Category.includes("WIRE-O PAD")) {
            dataSource = [{ "ContentName": "Wiro Leaves" }, { "ContentName": "Top Cover" },
            { "ContentName": "Back Cover" }, { "ContentName": "Jacket Top" }, { "ContentName": "Jacket Bottom" }, { "ContentName": "Multiple Leaves" }];

            $("#BookSpine").removeClass("disabledbutton");
            $("#BookLoops").removeClass("disabledbutton");

            $('#BookSpine').prop('disabled', false);
            $('#BookHinge').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_WiroPad.png";
        } else if (Category.includes("WRITING PAD")) {
            dataSource = [{ "ContentName": "Top Cover" }, { "ContentName": "Back Cover" }, { "ContentName": "Jacket Top" },
            { "ContentName": "Jacket Bottom" }, { "ContentName": "Multiple Leaves" }];

            $("#BookSpine").removeClass("disabledbutton");
            $('#BookSpine').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Wrinting_Pad.png";

        } else if (Category.includes("CENTER PINNING BOOK")) {
            dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "Book Cover" }];
            //$("#BookHinge").removeClass("disabledbutton");
            //$('#BookHinge').prop('disabled',false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Center_Stitch.png";
        } else if (Category.includes("BOOK BLOCK")) {
            dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "End Paper" }
                , { "ContentName": "Tipping Leaves" }, { "ContentName": "Multiple Leaves" }];
            document.getElementById("BookExtension").value = 4;
            document.getElementById("BookCoverTurnIn").value = 15;
            document.getElementById("BookHinge").value = 10;

            $("#BookExtension").removeClass("disabledbutton");
            $("#BookCoverTurnIn").removeClass("disabledbutton");
            $("#BookSpine").removeClass("disabledbutton");
            $("#BookHinge").removeClass("disabledbutton");

            $('#BookExtension').prop('disabled', false);
            $('#BookCoverTurnIn').prop('disabled', false);
            $('#BookSpine').prop('disabled', false);
            $('#BookHinge').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Hardcase.png";
        } else if (Category.includes("HARD COVER CASE")) {
            dataSource = [{ "ContentName": "Book Cover" }, { "ContentName": "Book Pages" }, { "ContentName": "Hard Case Cover" }, { "ContentName": "Dust Cover" },
            { "ContentName": "End Paper" }, { "ContentName": "Jacket Top" }, { "ContentName": "Jacket Bottom" }];
            document.getElementById("BookExtension").value = 4;
            document.getElementById("BookCoverTurnIn").value = 15;
            document.getElementById("BookHinge").value = 10;

            $("#BookExtension").removeClass("disabledbutton");
            $("#BookCoverTurnIn").removeClass("disabledbutton");
            $("#BookSpine").removeClass("disabledbutton");
            $("#BookHinge").removeClass("disabledbutton");

            $('#BookExtension').prop('disabled', false);
            $('#BookCoverTurnIn').prop('disabled', false);
            $('#BookSpine').prop('disabled', false);
            $('#BookHinge').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Hardcase.png";
        } else if (Category.includes("HOT MELT PERFECT BINDING BOOK") || Category.includes("PUR PERFECT BINDING BOOK")) {
            dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "Book Cover" }, { "ContentName": "End Paper" }
                , { "ContentName": "Tipping Leaves" }, { "ContentName": "Dust Cover" }, { "ContentName": "Multiple Leaves" }];

            $("#BookSpine").removeClass("disabledbutton");
            $('#BookSpine').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Perfect.png";
        } else if (Category.includes("PUR PERFECT BINDING BOOK")) {
            dataSource = [{ "ContentName": "Book Pages" }, { "ContentName": "Book Cover" }, { "ContentName": "End Paper" }
                , { "ContentName": "Tipping Leaves" }, { "ContentName": "Dust Cover" }, { "ContentName": "Multiple Leaves" }];

            $("#BookSpine").removeClass("disabledbutton");
            $('#BookSpine').prop('disabled', false);
            document.getElementById("PlanBookContImg").src = "images/Contents/Picture_Perfect.png";
        }

        $(function () {
            GridBookContents = $("#GridBookContents").dxDataGrid({
                dataSource: [],
                editing: {
                    mode: "row",
                    allowUpdating: true,
                    allowAdding: true,
                    allowDeleting: true,
                    //useIcons: true 
                    //popup: {
                    //    title: "Contents Info",
                    //    showTitle: true,
                    //    //width: function () {
                    //    //    return window.innerWidth / 1.3;
                    //    //},
                    //    //showColonAfterLabel: true,
                    //    //minColWidth: 100,
                    //    //colCount: "auto",
                    //    height: function () {
                    //        return window.innerHeight;
                    //    },
                    //    position: {
                    //        my: "top",
                    //        at: "top",
                    //        of: window
                    //    }
                    //}
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
                        var BookCategory = $("#BookCategories").dxSelectBox("instance").option('value');
                        var BH = Number(document.getElementById("BookHeight").value);
                        var BL = Number(document.getElementById("BookLength").value);
                        var BExt = Number(document.getElementById("BookExtension").value);
                        var BSpine = Number(document.getElementById("BookSpine").value);
                        var BHinge = Number(document.getElementById("BookHinge").value);
                        rowData.ContentCaption = value;
                        rowData.ContentName = value;
                        rowData.JobH = BH;
                        rowData.JobL = BL;
                        rowData.FrontColor = 0;
                        rowData.BackColor = 0;
                        rowData.Pages = 0;
                        if (value === "") return;
                        if (value === "End Paper") {
                            rowData.Pages = 4;
                            rowData.JobL = BL;//// * 2;
                        } else if (value === "Book Cover") {
                            if (BookCategory.includes("Hard")) {
                                rowData.JobH = BH + Number(BExt * 2);
                                rowData.JobL = BL * 2 + BSpine + BExt;
                            } else {
                                rowData.JobL = BL * 2 + BSpine;
                            }
                        } else if (value === "Dust Cover") {
                            rowData.DustTrimL = BL / 2;
                            rowData.DustTrimR = BL / 2;
                            if (BookCategory.includes("Hard Case")) {
                                // rowData.JobH = BH + Number(BExt * 2);
                                rowData.JobL = BL * 2 + BSpine + Number(BExt) * 2 + Number(BHinge) * 2 + rowData.DustTrimL + rowData.DustTrimR;
                            } else {
                                rowData.JobL = BL * 2 + BSpine + rowData.DustTrimL + rowData.DustTrimR;
                            }
                        } else if (value === "Hard Case Cover") {
                            if (BookCategory.includes("Hard Case")) {
                                rowData.JobH = BH + Number(BExt * 2);
                                rowData.JobL = BL * 2 + BSpine + Number(BExt);// + Number(BHinge);
                            } else {
                                rowData.JobH = BH + Number(BExt * 2);
                                rowData.JobL = BL * 2 + BSpine + Number(BExt) - Number(BHinge);
                            }
                        } else if (value === "Tag") {
                            rowData.JobH = Math.round(BH / 2);
                            rowData.JobL = Math.round(BL / 3);
                        } else if (value.includes("Jacket")) {
                            rowData.DustTrimL = 0;
                            rowData.DustTrimR = 0;
                            if (BookCategory.includes("Hard Case")) {
                                rowData.JobH = BH;
                                rowData.JobL = BL + rowData.DustTrimL + rowData.DustTrimR;
                            } else {
                                rowData.JobH = BH + Number(BExt * 2);
                                rowData.JobL = BL * 2 + BSpine + Number(BExt) - Number(BHinge);
                            }
                        }
                        rowData.JobL = Math.round(rowData.JobL);
                        rowData.JobH = Math.round(rowData.JobH);

                        rowData.PlateType = "CTP Plate";
                        if (value.includes("Pages")) {
                            rowData.Pages = "";
                        }
                        ///else
                            ///GridBookContents._views.gridView.component.columnOption("Spine", "allowEditing", false);
                        if (value.includes("Cover")) {
                            GridBookContents._views.gridView.component.columnOption("Pages", "allowEditing", false);
                            if (value === "Hard Case Cover") {
                                GridBookContents._views.gridView.component.columnOption("FrontColor", "allowEditing", false);
                                GridBookContents._views.gridView.component.columnOption("BackColor", "allowEditing", false);
                                GridBookContents._views.gridView.component.columnOption("Plate", "allowEditing", false);
                                rowData.PlateType = "None";
                            } else {
                                GridBookContents._views.gridView.component.columnOption("FrontColor", "allowEditing", true);
                                GridBookContents._views.gridView.component.columnOption("BackColor", "allowEditing", true);
                                GridBookContents._views.gridView.component.columnOption("Plate", "allowEditing", true);
                            }
                        } else {
                            GridBookContents._views.gridView.component.columnOption("Pages", "allowEditing", true);
                            GridBookContents._views.gridView.component.columnOption("Pages", "validationRules", [{ type: "required" }]);
                        }
                    }
                }, {
                    dataField: "ContentCaption", width: 100,
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "Quality", visible: true, lookup: {
                        dataSource: ResQuality,
                        displayExpr: "Quality",
                        valueExpr: "Quality"
                    }, width: 100,
                    validationRules: [{ type: "required" }],
                    setCellValue: function (rowData, value) {
                        rowData.Quality = value;
                        if (value !== "") {
                            GblQuality = value;
                            refreshGSM(value);
                        }
                    }
                },
                {
                    dataField: "GSM",
                    setCellValue: function (rowData, value) {
                        rowData.GSM = value;
                        GblGSM = value;
                        refreshMill(value);
                    },
                    visible: true, width: 80,
                    lookup: {
                        dataSource: ResItems.TblGSM,
                        displayExpr: "GSM",
                        valueExpr: "GSM"
                    },
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "Mill", visible: true, width: 80,
                    lookup: {
                        dataSource: ResItems.TblMill,
                        displayExpr: "Mill",
                        valueExpr: "Mill"
                    },
                    setCellValue: function (rowData, value) {
                        rowData.Mill = value;
                        if (value === "") return;
                        GblMill = value;
                        refreshFinish(value);
                    },
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "Finish", visible: true, width: 80, lookup: {
                        dataSource: ResItems.TblFinish,
                        displayExpr: "Finish",
                        valueExpr: "Finish"
                    }
                },
                {
                    dataField: "Pages", dataType: "number",
                    visible: true, width: 50,
                    setCellValue: function (rowData, value) {
                        if (Number(GblGSM) <= 0) return;
                        if (Number(value) <= 0) {
                            rowData.Pages = "";
                            return;
                        }
                        var MultipleFour = Number(value) % 2;
                        if (MultipleFour >= 1) {
                            rowData.Pages = "";
                            return;
                        } else
                            rowData.Pages = value;
                        var Sheet_Thichness = Number(GblGSM) * 0.000631312;
                        rowData.Spine = value * Sheet_Thichness;
                    }
                },
                { dataField: "FrontColor", caption: "F Color", width: 50, visible: true },
                { dataField: "BackColor", caption: "B Color", width: 50, visible: true },
                {
                    dataField: "PlateType", lookup: {
                        dataSource: [{ "PlateType": "CTP Plate" }, { "PlateType": "PS Plate" },
                        { "PlateType": "PS Plate+Film" }, { "PlateType": "CTcP Plate" }, { "PlateType": "None" }],
                        displayExpr: "PlateType",
                        valueExpr: "PlateType"
                    }, validationRules: [{ type: "required" }] //value: "CTP Plate"
                },
                {
                    dataField: "Spine", visible: true, format: {
                        type: "fixedPoint",
                        precision: 2
                    }
                },
                {
                    dataField: "JobH", visible: true, width: 50,
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: "JobL", visible: true, width: 50,
                    validationRules: [{ type: "required" }]
                },
                { dataField: "DustTrimL", caption: "Marg L", width: 50, visible: true },
                { dataField: "DustTrimR", caption: "Marg R", width: 50, visible: true },
                { dataField: "DustTrimT", caption: "Marg T", width: 50, visible: true },
                { dataField: "DustTrimB", caption: "Marg B", width: 50, visible: true }],
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                onInitNewRow: function (e) {
                    if (isValid() === false) {
                        window.setTimeout(function () { e.component.cancelEditData(); }, 0);
                        return true;
                    }
                    var BookCategory = $("#BookCategories").dxSelectBox("instance").option('value');
                    e.component.columnOption("ContentName", "allowEditing", true);
                    e.component._options.editing.popup.title = BookCategory;
                },
                onEditingStart: function (e) {
                    e.component.columnOption("ContentName", "allowEditing", false);
                },
                onRowInserting: function (e) {
                    //document.getElementById("BookDustleft").value = 0;
                    //document.getElementById("BookDustright").value = 0;
                    //if (e.data.ContentName === "Dust Cover") {
                    //    document.getElementById("BookDustleft").value = Number(document.getElementById("BookLength").value) / 2;
                    //    document.getElementById("BookDustright").value = Number(document.getElementById("BookHeight").value) / 2;
                    //}
                    e.data.Spine = 0;
                    if (e.data.ContentName === "Hard Case Cover") {
                        e.data.Spine = Number(e.data.GSM) / 1000 * 2;
                    } else if (e.data.ContentName.includes("Pages") || e.data.ContentName === "End Paper" || e.data.ContentName === "Wiro Leaves" || e.data.ContentName === "Multiple Leaves") {
                        var Sheet_Thichness = Number(e.data.GSM) * 0.000631312;
                        e.data.Spine = e.data.Pages * Sheet_Thichness;
                    }
                },
                onRowInserted: function (e) {
                    CalculateSpin(e);
                },
                onRowUpdating: function (e) {
                    // logEvent("RowUpdating");
                },
                onRowUpdated: function (e) {
                    CalculateSpin(e);
                },
                summary: {
                    totalItems: [{
                        format: "number",
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
    }
});

function CalculateSpin(e) {
    //var Board_Caliper, Sheet_Thichness = 0;
    // //var totalCount = GridBookContents._views.gridView.component.option('dataSource').length;

    var BookCategory = $("#BookCategories").dxSelectBox("instance").option('value');
    if (BookCategory.includes("Round Spine")) {
        document.getElementById("BookSpine").value = Number(GridBookContents.getTotalSummaryValue("Spine")).toFixed(2) * 1.18;
    } else
        document.getElementById("BookSpine").value = Number(GridBookContents.getTotalSummaryValue("Spine")).toFixed(2);
    Calc_Wiroloops();
}

$("#BookHeight").keyup(function () {
    Calc_Wiroloops();
});

function Calc_Wiroloops() {
    if ($("#BookLoops").hasClass("disabledbutton")) {
        document.getElementById("BookLoops").value = 0;
        return;
    }
    var BS = Number(document.getElementById("BookSpine").value);
    var BH = Number(document.getElementById("BookHeight").value);
    if (BS >= 12.7) {
        document.getElementById("BookLoops").value = Math.round(BH / 25.4) * 2;
    } else if (BS >= 4.8) {
        document.getElementById("BookLoops").value = Math.round(BH / 25.4) * 3;
    } else {
        document.getElementById("BookLoops").value = Math.round(BH / 25.4) * 4;
    }
}

////$.ajax({
////    type: 'POST',
////    url: "WebServicePlanWindow.asmx/LoadBookContents",
////    dataType: 'json',
////    contentType: "application/json; charset=utf-8",
////    data: {},    // "{'name': '" + Method_Name + "'}",
////    crossDomain: true,
////    success: function (results) {
////        if (results.d === "500") return;
////        var res = results.d.replace(/\\/g, '');
////        res = res.substr(1);
////        res = res.slice(0, -1);

////        LoadBookGrid(JSON.parse(res.toString()));
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

function refreshGSM(value) {
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
            //GridBookContents._options.columns[3].lookup.dataSource = RES1;
            //GridBookContents._options.columns[3].lookup.displayExpr = "GSM";
            //GridBookContents._options.columns[3].lookup.valueExpr = "GSM";
            //GridBookContents.refresh();
            //GridBookContents.repaint();
            //rowData.GSM = RES1[0].GSM;
            var lookup = GridBookContents.columnOption("GSM", "lookup");
            lookup.dataSource = RES1;
            GridBookContents.columnOption("GSM", "lookup", lookup);
            GridBookContents.repaint();
        },
        error: function errorFunc(jqXHR) {
            alert("not show");
        }
    });
}

function refreshMill(value) {
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
            var lookup = GridBookContents.columnOption("Mill", "lookup");
            lookup.dataSource = Res1;
            GridBookContents.columnOption("Mill", "lookup", lookup);
            GridBookContents.repaint();
        }
    });
}

function refreshFinish(value) {
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
            var lookup = GridBookContents.columnOption("Finish", "lookup");
            lookup.dataSource = Res1;
            GridBookContents.columnOption("Finish", "lookup", lookup);
            GridBookContents.repaint();
        }
    });
}

$("#Apply_Book_Button").click(function () {
    if (isValid() === false) return;
    var rowCount = GridBookContents.totalCount();
    if (rowCount <= 0) {
        DevExpress.ui.notify("Please add book contents first", "warning", 1000);
        return;
    }
    document.getElementById("Apply_Book_Button").setAttribute("data-dismiss", "modal");
    var BQty = Number(document.getElementById("BookQuantity").value);
    var BookCategory = $("#BookCategories").dxSelectBox("instance").option('value');
    $("#SbCategory").dxSelectBox({
        value: BookCategory
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

                    //document.getElementById("Footer_Cost").deleteRow(0);
                }
            }
        }

        //var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;

        //var elmtTable = document.getElementById('Body_Planning');
        //var tableRows = elmtTable.getElementsByTagName('tr');
        //var rowC = tableRows.length;

        //for (var x = rowC - 1; x > 0; x--) {
        //    elmtTable.removeChild(tableRows[x]);
        //}

        //var allRows = document.getElementById('Body_Planning').rows;
        //var FooterRows = document.getElementById('Footer_Cost').rows;


        //for (i = 0; i < allRows.length; i++) {
        //    if (allRows[i].cells.length > 1) {
        //        allRows[i].deleteCell(cellIndex); //delete the cell
        //    }
        //    //else {
        //    //    alert("You can't delete more columns.");
        //    //    return;
        //    //}
        //}

        //if (FooterRows[0].cells.length > 1) {
        //    FooterRows[0].deleteCell(cellIndex);
        //}
        //for (i = 0; i <= allRows[0].cells.length + 1; i++) {
        //    tableRows.deleteCell(0);
        //    if (FooterRows[0].cells.length > 1) {
        //        FooterRows[0].deleteCell(0);
        //    }
        //}
        //$("#Body_Planning tr").remove();
        removeAllContentsData();

        document.getElementById('lastCol').innerHTML = 0;
        document.getElementById('lastRow').innerHTML = 1;
        document.getElementById('Bdy_QtyRow').innerHTML = "";
        document.getElementById('FinalCostDivFooter').innerHTML = "";
        $("#Add_Quantity_Button").click();
        document.getElementById("txtqty1").value = BQty;

        for (var i = 0; i < rowCount; i++) {
            Obj_Job_Size = {};
            Obj_Job_Size.SizeHeight = GridBookContents._options.dataSource[i].JobH; //  Number(SizeHeight);
            Obj_Job_Size.SizeLength = GridBookContents._options.dataSource[i].JobL; // Number(SizeLength);
            Obj_Job_Size.SizeWidth = 0; //Number(SizeWidth);
            Obj_Job_Size.SizeOpenflap = 0;// Number(SizeOpenflap);
            Obj_Job_Size.SizePastingflap = 0;//  Number(SizePastingflap);
            Obj_Job_Size.SizeBottomflap = 0;// Number(SizeBottomflap);
            Obj_Job_Size.JobNoOfPages = GridBookContents._options.dataSource[i].Pages;  // Number(JobNoOfPages);
            Obj_Job_Size.JobUps = 0;
            Obj_Job_Size.JobFlapHeight = 0;
            Obj_Job_Size.JobTongHeight = 0;
            Obj_Job_Size.JobFoldedH = 0;
            Obj_Job_Size.JobFoldedL = 0;

            var ContName;
            var PlanContentType = ContName = GridBookContents._options.dataSource[i].ContentName;
            if (ContName === "Dust Cover" || ContName === "Hard Case Cover") {
                PlanContentType = "Book Cover"; //Orientation
            } else if (ContName.includes("Jacket")) {
                PlanContentType = "Multiple Leaves";
            } else if (ContName.includes("Top Cover") || ContName.includes("Back Cover")) {
                PlanContentType = "Rectangular";
            } else if (ContName.includes("End Paper")) {
                PlanContentType = "Book Pages";
            } else if (ContName.includes("Tipping Leaves")) {
                PlanContentType = "Wiro Leaves";
            }
            document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + PlanContentType + ".jpg";
            PlanContentType = PlanContentType.replace(/ /g, '');
            Obj_Job_Size.PlanContentType = PlanContentType;
            Obj_Job_Size.PlanFColor = GridBookContents._options.dataSource[i].FrontColor;  // Number(PlanFColor);
            Obj_Job_Size.PlanBColor = GridBookContents._options.dataSource[i].BackColor;  // Number(PlanBColor);
            Obj_Job_Size.PlanColorStrip = 0; // Number(PlanColorStrip);
            Obj_Job_Size.PlanGripper = 0; // Number(PlanGripper);
            if (Obj_Job_Size.PlanBColor === 0) {
                Obj_Job_Size.PlanPrintingStyle = "Single Side";
            } else if (Obj_Job_Size.PlanFColor === 0 && Obj_Job_Size.PlanBColor === 0) {
                Obj_Job_Size.PlanPrintingStyle = "No Printing";
            } else /*if (Obj_Job_Size.PlanFColor === Obj_Job_Size.PlanBColor)*/ {
                Obj_Job_Size.PlanPrintingStyle = "Choose Best";
            }

            Obj_Job_Size.PlanWastageValue = 0;
            if (PlanContentType === "BookPages" || PlanContentType === "WiroBookPages" || PlanContentType === "WiroBookLeaves" || PlanContentType === "MultipleLeaves" || PlanContentType === "EndPaper") {
                Obj_Job_Size.Trimmingleft = Number(document.getElementById("BookTrimmingleft").value);
                Obj_Job_Size.Trimmingright = Number(document.getElementById("BookTrimmingright").value);
                Obj_Job_Size.Trimmingtop = Number(document.getElementById("BookTrimmingtop").value);
                Obj_Job_Size.Trimmingbottom = Number(document.getElementById("BookTrimmingbottom").value);
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
            Obj_Job_Size.ItemPlanQuality = GridBookContents._options.dataSource[i].Quality;// ItemPlanQuality;
            Obj_Job_Size.ItemPlanGsm = GridBookContents._options.dataSource[i].GSM;  // ItemPlanGsm;
            Obj_Job_Size.ItemPlanMill = GridBookContents._options.dataSource[i].Mill;  // ItemPlanMill;
            Obj_Job_Size.PlanPlateType = GridBookContents._options.dataSource[i].PlateType;  // PlanPlateType;
            Obj_Job_Size.PlanWastageType = "Machine Default";
            Obj_Job_Size.PlanContQty = Number(BQty);
            Obj_Job_Size.PlanSpeFColor = 0;
            Obj_Job_Size.PlanSpeBColor = 0;
            Obj_Job_Size.PlanContName = GridBookContents._options.dataSource[i].ContentCaption;  // PlanContName;
            var finish = "";
            if (GridBookContents._options.dataSource[i].Finish === undefined || GridBookContents._options.dataSource[i].Finish === "undefined") {
                finish = "";
            } else {
                finish = GridBookContents._options.dataSource[i].Finish;
            }
            Obj_Job_Size.ItemPlanFinish = finish; // GridBookContents._options.dataSource[i].Finish;  // ItemPlanFinish;

            document.getElementById("Txt_Content_Name").value = Obj_Job_Size.PlanContName;
            document.getElementById("PlanContentType").value = Obj_Job_Size.PlanContentType;

            $("#Btn_Select_Content").click();
            saveContentsSizeValues(Obj_Job_Size);
        }
    } catch (e) {
        alert(e);
    }
});

function isValid() {
    var BookCategory = $("#BookCategories").dxSelectBox("instance").option('value');
    var BH = Number(document.getElementById("BookHeight").value);
    var BL = Number(document.getElementById("BookLength").value);
    var BQty = Number(document.getElementById("BookQuantity").value);

    if (BookCategory === "" || BookCategory === null || BookCategory === "null") {
        DevExpress.ui.notify("Please select Category first", "warning", 1000);
        return false;
    }
    if (BH === "" || BH < 1 || BH === "null") {
        DevExpress.ui.notify("Please select job height first", "warning", 1000);
        document.getElementById("BookHeight").focus();
        return false;
    }
    if (BL === "" || BL < 1 || BL === "null") {
        DevExpress.ui.notify("Please select job length first", "warning", 1000);
        document.getElementById("BookLength").focus();
        return false;
    }
    if (BQty === "" || BQty < 1 || BQty === "null") {
        DevExpress.ui.notify("Please select quantity first", "warning", 1000);
        document.getElementById("BookQuantity").focus();
        return false;
    }
    return true;
}

$(".sizeFields").keypress(function (e) {
    if (e.which === 34) { // For "  (Double Code)
        Convert_Value(event);
    } else if (e.which === 39) { // For '  (Single Code)
        Convert_Value(event);
    }
});
