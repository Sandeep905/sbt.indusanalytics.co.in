
var GblStatus = "";
var GblItemNameString = "";
var GblItemDecString = "";
var FilterObj = [];

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

$("#MasterGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    paging: {
        pageSize: 15
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 50, 100, 500]
    },
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: document.getElementById("MasterDisplayName").innerHTML,
        allowExportSelectedData: true
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
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), document.getElementById("MasterDisplayName").innerHTML + '_' + new Date().toString() + '.xlsx');
            });
        });
        e.cancel = true;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (e) {
        if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;

        document.getElementById("txtGetGridRow").value = "";
        document.getElementById("txtGetGridRow").value = e.row.data.ItemID; /// grid.cellValue(Row, 0);
        UnderGroupID = "";
        UnderGroupID = e.row.data.ItemGroupID; ///grid.cellValue(Row, 1);
        document.getElementById("LblItemCode").innerHTML = "";
        document.getElementById("LblItemCode").innerHTML = "Code : " + e.row.data.ItemCode;
        document.getElementById("TxtItemName").value = e.row.data.ItemName;
        document.getElementById("TxtTallyItemName").value = e.row.data.TallyItemName;
    },
    onContentReady: function (e) {
        var HCol = HideColumn;
        if (HCol) {
            HCol = HCol.split(',');
            for (var hc in HCol) {
                var placedHC = HCol[hc];
                $('#MasterGrid').dxDataGrid("columnOption", placedHC, "visible", false);
            }
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

if ((localStorage.getItem('activeID')) !== "" || (localStorage.getItem('activeID')) !== undefined || (localStorage.getItem('activeID')) !== "null") {

    var tagID = localStorage.getItem('activeID');
    var tagNAME = localStorage.getItem('activeName');

    document.getElementById("MasterID").innerHTML = tagID;
    document.getElementById("MasterName").innerHTML = tagNAME;

    var MD = tagNAME;
    // MD = MD.replace(//g, ' ');
    document.getElementById("MasterDisplayName").innerHTML = MD;
}

function OpenPopup(PU) {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';

    document.getElementById(PU.id).setAttribute("data-toggle", "modal");
    document.getElementById(PU.id).setAttribute("data-target", "#largeModal");
}

getMasterLIST();

//Dynamic Maser UL
function getMasterLIST() {
    var masterID = document.getElementById("MasterID").innerHTML;

    var currentMaster = "";
    if (masterID !== "") {
        currentMaster = "ChooseMaster" + masterID;
    }
    try {
        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebService_Master.asmx/MasterList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, "&");
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);

                $("#RadioMasterList").dxRadioGroup({
                    dataSource: RES1,
                    displayExpr: "ItemGroupName",
                    valueExpr: "ItemGroupID",
                    layout: 'horizontal',
                    onValueChanged: function (e) {
                        check = e.value;
                        CurrentMaster(e);
                    }
                });

                $("#RadioMasterList").dxRadioGroup({ value: RES1[0].ItemGroupID });
                //var MasterList = "";
                //document.getElementById("MasterUL").innerHTML = "";

                //// $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                //for (var i = 0; i < RES1.length; i++) {
                //    MasterList += "<li role='presentation' id=ChooseMaster" + RES1[i].ItemGroupID + " class=''><a id=" + RES1[i].ItemGroupID + "   href='#' data-toggle='tab'  onclick='CurrentMaster(this);' style='color:#42909A;font-size:10px;font-weight:600;width:100%;text-align: left;'>" + RES1[i].ItemGroupName.replace(/_/g, ' '); + "</a></li>";

                //}
                //$("#MasterUL").append('<li style="border-bottom:1px solid #42909A"><label style="color: #42909A; margin-left: .5em;font-size:12px;font-weight:600">Select Master</label></li>');
                //$('#MasterUL').append(MasterList);

                //if (currentMaster !== "") {
                //    document.getElementById(currentMaster).className = "active";
                //}
                //document.getElementById("LI_ChooseMaster").className = "dropdown open";
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

//Selected Master
function CurrentMaster(e) {

    //$("#MasterUL>li.active").removeClass("active");
    var value = e.value;
    if (value === undefined || value <= 0) return;
    var text = '';
    var ds = $("#RadioMasterList").dxRadioGroup('instance').option('dataSource');
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].ItemGroupID === value) {
            text = ds[i].ItemGroupName;
            continue;
        }
    }
    document.getElementById("MasterID").innerHTML = value;
    document.getElementById("MasterName").innerHTML = text;

    localStorage.setItem('activeID', value);
    localStorage.setItem('activeName', text);

    if (value > 0) {
        document.getElementById("MasterDisplayName").innerHTML = text;
    }
    DynamicControlls();

    $("#MasterGrid").dxDataGrid({ dataSource: [] });
}

var selID = ""; var selQuery = ""; var selDefault = "";

var GBLField = "";

$("#ShowListButton").click(function () {
    FillGrid();
});

//Creation of Dynamic Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";
    if (document.getElementById("MasterID").innerHTML === "") return;

    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = "";

    document.getElementById("IsactivItemstatic_Div").style.display = "none";

    document.getElementById("LblItemCode").style.display = "none";
    document.getElementById("LblItemCode").innerHTML = "";

    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");

    refreshbtn();
});

//Function For Create Controlls
function DynamicControlls() {
    var masterID = document.getElementById("MasterID").innerHTML;
    var fieldContainer = "";
    document.getElementById("FieldCntainerRow").innerHTML = "";
    if (masterID === "" || Number(masterID) <= 0) return;
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        async: false,
        url: "WebService_Master.asmx/Master",
        data: '{masterID:' + JSON.stringify(masterID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            GBLField = JSON.parse(res);

            var RES1 = GBLField;

            selQuery = ""; selID = "";

            if (RES1.length > 0) {

                for (var i = 0; i < RES1.length; i++) {
                    var DEselID = "";
                    var IsDisplayCol = "";
                    if (RES1[i].IsDisplay === true) {
                        IsDisplayCol = "";
                    }
                    else {
                        IsDisplayCol = "none";
                    }

                    var chngevt = RES1[i].ControllValidation;
                    fieldContainer = "";

                    if (RES1[i].FieldType === "text" || RES1[i].FieldType === "number") {
                        if (RES1[i].FieldFormula === "" || RES1[i].FieldFormula === null || RES1[i].FieldFormula === undefined) {
                            if (chngevt === "" || chngevt === null || chngevt === "null" || chngevt === undefined) {
                                fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                                    '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                                    '<input id=' + RES1[i].FieldName + ' type="' + RES1[i].FieldType + '" class="forTextBox" min="0"/><br />' +
                                    '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:12px;display:none"></strong></div></div>';

                            } else {
                                fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                                    '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                                    '<input id=' + RES1[i].FieldName + ' type="' + RES1[i].FieldType + '" class="forTextBox" onchange="' + chngevt + '" min="0"/><br />' +
                                    '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px;display:block"></strong></div></div>';
                            }
                            $("#FieldCntainerRow").append(fieldContainer);
                        } else {
                            fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                                '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                                '<input id=' + RES1[i].FieldName + ' type="' + RES1[i].FieldType + '" value=0 class="forTextBox" onchange="FarmulaChange(this);" min="0"/><br />' +
                                '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px;display:block"></strong><textarea id=ValCh' + RES1[i].FieldName + ' style="display: none" >' + RES1[i].FieldFormulaString + '</textarea><strong id=Formula' + RES1[i].FieldName + ' style="display: none">' + RES1[i].FieldFormula + '</strong></div></div>';
                            $("#FieldCntainerRow").append(fieldContainer);
                        }
                    }
                    else if (RES1[i].FieldType === "checkbox") {
                        fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                            '<br class="hidden-xs"/>' +
                            '<input type="checkbox" id="' + RES1[i].FieldName + '" class="filled-in chk-col-red" style="height:20px"/>' +
                            '<label for="' + RES1[i].FieldName + '" style="height:20px">' + RES1[i].FieldDisplayName + '</label><br />' +
                            '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong></div></div>';
                        $("#FieldCntainerRow").append(fieldContainer);
                    }
                    else if (RES1[i].FieldType === "datebox") {
                        fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                            '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                            '<div id="' + RES1[i].FieldName + '"  style="float: left; width: 100%;height:30px;border: 1px solid #d3d3d3"></div><br />' +
                            '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong>  </div></div>';
                        $("#FieldCntainerRow").append(fieldContainer);
                        $("#" + RES1[i].FieldName).dxDateBox({
                            pickerType: "rollers",
                            formate: 'date',
                            value: new Date().toISOString().substr(0, 10),
                            formatString: 'dd-MMM-yyyy'
                        });
                    }
                    else if (RES1[i].FieldType === "textarea") {
                        fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                            '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                            '<textarea id="' + RES1[i].FieldName + '" style="float: left; width: 100%; height: 27px; border-radius: 4px;padding-left:10px;padding-right:10px" onchange="' + chngevt + '"></textarea><br />' +
                            '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong></div></div>';
                        $("#FieldCntainerRow").append(fieldContainer);
                    }
                    else if (RES1[i].FieldType === "selectbox") {
                        DEselID = RES1[i].FieldName;
                        var DEselQuery = "";
                        DEselQuery = RES1[i].SelectBoxQueryDB;

                        var DEselDefault = "";
                        DEselDefault = RES1[i].SelectBoxDefault;

                        if (DEselQuery === "" || DEselQuery === "null" || DEselQuery === null || DEselQuery === undefined) {

                            fieldContainer = "";
                            fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                                '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                                '<div id="' + RES1[i].FieldName + '"  style="float: left; width: 100%;height:30px;border: 1px solid #d3d3d3"></div><br />' +
                                '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong>  <textarea id=ValCh' + RES1[i].FieldName + ' style="display: none" >' + RES1[i].FieldFormulaString + '</textarea><strong id=Formula' + RES1[i].FieldName + ' style="display: none">' + RES1[i].FieldFormula + '</strong>  </div></div>';
                            $("#FieldCntainerRow").append(fieldContainer);

                            var ItemPush = [];
                            var itemLength = 0;
                            if (DEselDefault !== null && DEselDefault !== "null" && DEselDefault !== undefined) {
                                var item = DEselDefault.split(',');
                                itemLength = item.length;
                            }


                            if (itemLength > 0) {
                                for (var k = 0; k < itemLength; k++) {
                                    ItemPush.push(item[k]);
                                }
                            }
                            var SID = "#" + DEselID;

                            if (RES1[i].FieldFormula === "" || RES1[i].FieldFormula === null || RES1[i].FieldFormula === undefined) {
                                $(SID).dxSelectBox({
                                    items: ItemPush,
                                    placeholder: "Select--",
                                    //displayExpr: 'GroupName',
                                    //valueExpr: 'GroupID',
                                    showClearButton: true,
                                    acceptCustomValue: true,
                                    searchEnabled: true
                                });
                            } else {
                                $(SID).dxSelectBox({
                                    items: ItemPush,
                                    placeholder: "Select--",
                                    //displayExpr: 'GroupName',
                                    //valueExpr: 'GroupID',
                                    showClearButton: true,
                                    acceptCustomValue: true,
                                    searchEnabled: true,
                                    onValueChanged: function (data) {
                                        if (data) {
                                            var currentID = data.element.context.id;
                                            FarmulaChangeSELECTBX(currentID);
                                        }
                                    }
                                });
                            }

                        }
                        else {

                            fieldContainer = "";
                            fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                                '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                                '<div id="' + RES1[i].FieldName + '" style="float: left; width: 100%;height:30px;border: 1px solid #d3d3d3"></div><br />' +
                                '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong>   <textarea id=ValCh' + RES1[i].FieldName + ' style="display: none" >' + RES1[i].FieldFormulaString + '</textarea><strong id=Formula' + RES1[i].FieldName + ' style="display: none">' + RES1[i].FieldFormula + '</strong>  </div></div>';
                            $("#FieldCntainerRow").append(fieldContainer);

                            if (selID === "" || selID === null || selID === undefined) {
                                selID = RES1[i].FieldName.replace(' ', '');
                            }
                            else {
                                selID = selID + ' ? ' + RES1[i].FieldName.replace(' ', '');
                            }

                            if (selQuery === "" || selQuery === null || selQuery === undefined) {
                                selQuery = RES1[i].ItemGroupFieldID;
                            }
                            else {
                                selQuery = selQuery + ' ? ' + RES1[i].ItemGroupFieldID;
                            }
                        }
                    }
                }

                $("#FieldCntainerRow").append('<div id="IsactivItemstatic_Div" class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:none">' +
                    '<br class="hidden-xs"/>' +
                    '<input type="checkbox" id="IsactivItemstatic" class="filled-in chk-col-red" style="height:20px" checked="true"/>' +
                    '<label for="IsactivItemstatic" style="height:20px">Is Active Item Master.?</label><br />' +
                    '<div style="min-height:15px;float:left;width:100%"><strong id="ValStrIsactivItemstaticLabel" style="color:red;font-size:10px"></strong></div></div>');
                fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;">' +
                    '<label style="float: left; width: 100%;">Item Name</label><br />' +
                    '<input id="TxtItemName" type="text" class="forTextBox"/><br />' +
                    '<div style="min-height:15px;float:left;width:100%"><strong id="ValStrTxtItemName" style="color:red;font-size:12px;display:none"></strong></div></div>';
                $("#FieldCntainerRow").append(fieldContainer);

                //Tally Code Added on 280720 pKp
                fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden" style="float:left;margin-bottom:0px;">' +
                    '<label style="float: left; width: 100%;">Tally Code</label><br />' +
                    '<input id="TxtTallyItemName" type="text" class="forTextBox"/><br />' +
                    '<div style="min-height:15px;float:left;width:100%"><strong id="ValStrTxtTallyItemName" style="color:red;font-size:12px;display:none"></strong></div></div>';
                $("#FieldCntainerRow").append(fieldContainer);
                ///

                if (selQuery !== "") {
                    selctbox();
                }
                if (RES1.length > 1) {
                    document.getElementById("BtnSave").disabled = false;
                }
            }
            else {
                document.getElementById("BtnSave").disabled = true;
            }
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

//Fill Dynamic Selectbox
function selctbox() {
    var selbox = "";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/SelectBoxLoad",
        data: '{Qery:' + JSON.stringify(selQuery) + ',selID:' + JSON.stringify(selID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res === "") {
                selbox = [];
            } else {
                selbox = "";
                selbox = JSON.parse(res);
            }

            var TBLName = Object.getOwnPropertyNames(selbox);

            for (var t in selbox) {
                var Tblobj = selbox[t];
                var selA = Object.getOwnPropertyNames(Tblobj[0]);
                selA = JSON.stringify(selA);
                selA = selA.substr(1);
                selA = selA.slice(0, -1);
                selA = selA.replace(/"/g, '');
                selA = selA.split(",");

                var Displayxpr = "";
                var Valuexpr = "";
                var selectID = JSON.stringify(Tblobj[Tblobj.length - 1]);

                if (selA.length > 1) {
                    ///////////////////////////////////////With  valueExpr/////////////////////////////////////////////
                    Displayxpr = selA[1];
                    Valuexpr = selA[0];

                    selectID = selectID.substr(1);
                    selectID = selectID.slice(0, -1);
                    selectID = selectID.replace(/"/g, '');
                    selectID = selectID.replace(/ /g, '');
                    selectID = selectID.split(":");
                    selectID = "#" + selectID[2];

                    Tblobj = Tblobj.slice(0, -1);

                    $(selectID).dxSelectBox({
                        items: Tblobj,
                        placeholder: "Select--",
                        displayExpr: Displayxpr,
                        valueExpr: Valuexpr,
                        searchEnabled: true,
                        showClearButton: true,
                        onValueChanged: function (data) {
                            if (data) {
                                var currentID = data.element.context.id;
                                FarmulaChangeSELECTBX(currentID);
                            }
                        }
                        //onCustomItemCreating: function (e) {
                        //    //Add a new item to your data store based on the e.text value
                        //    var NewItem = e.value;
                        //    Tblobj.push(NewItem);
                        //    editableProduct.option("items", Tblobj);
                        //    e.customItem = NewItem;
                        //   // return NewItem;
                        //}
                    });
                }
                else {
                    Displayxpr = selA[0];
                    Valuexpr = selA[0];
                    ///////////////////////////////////////WithOut  valueExpr/////////////////////////////////////////////

                    selectID = selectID.substr(1);
                    selectID = selectID.slice(0, -1);
                    selectID = selectID.replace(/"/g, '');
                    selectID = selectID.replace(/ /g, '');
                    selectID = selectID.split(":");
                    var replaceText = selectID[1];
                    selectID = "#" + selectID[1];

                    Tblobj = Tblobj.slice(0, -1);

                    var ReplaceTblobj = JSON.stringify(Tblobj);
                    ReplaceTblobj = ReplaceTblobj.replace(new RegExp(replaceText, 'g'), '');
                    ReplaceTblobj = ReplaceTblobj.replace(/"":/g, '');
                    ReplaceTblobj = ReplaceTblobj.replace(/{/g, '');
                    ReplaceTblobj = ReplaceTblobj.replace(/}/g, '');
                    ReplaceTblobj = ReplaceTblobj.substr(1);
                    ReplaceTblobj = ReplaceTblobj.slice(0, -1);
                    ReplaceTblobj = ReplaceTblobj = ReplaceTblobj.replace(/"/g, '');

                    ReplaceTblobj = ReplaceTblobj.split(',');
                    var simpleProducts = [];
                    for (var itemtxt in ReplaceTblobj) {
                        simpleProducts.push(ReplaceTblobj[itemtxt]);
                    }

                    $(selectID).dxSelectBox({
                        items: simpleProducts,
                        //placeholder: "Select--",                   
                        //displayExpr: Displayxpr,
                        //valueExpr: Valuexpr,
                        searchEnabled: true,
                        showClearButton: true,
                        acceptCustomValue: true,
                        onValueChanged: function (data) {
                            if (data) {
                                var currentID = data.element.context.id;
                                FarmulaChangeSELECTBX(currentID);
                            }
                        }
                    });
                }
            }
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        },
        error: function (e) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

//Save Dynamic Data
$("#BtnSave").click(function () {
    var xtraField = [];

    var columnlength = "";
    var GetChar = "";

    var MasterName = document.getElementById("MasterName").innerHTML;
    var masterID = document.getElementById("MasterID").innerHTML;

    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/Master",
        data: '{masterID:' + JSON.stringify(masterID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            columnlength = "";
            columnlength = JSON.parse(res);

            var DSValue = ""; var INValue = ""; var alertTag = ""; var x = "";
            if (columnlength.length > 0) {
                for (var i = 0; i < columnlength.length; i++) {

                    var DataTypeVali = columnlength[i].FieldDataType;
                    DataTypeVali = DataTypeVali.substring(0, 3);
                    DataTypeVali = DataTypeVali.toUpperCase().trim();
                    var decimal = /^[0-9]+\.?[0-9]*$/;
                    if (columnlength[i].IsDisplay === true) {
                        if (columnlength[i].FieldType === "text" || columnlength[i].FieldType === "textarea") {
                            x = document.getElementById(columnlength[i].FieldName).value;

                            if (DataTypeVali === "MON" || DataTypeVali === "FLO" || DataTypeVali === "REA") {
                                if (decimal.test(x) === true) {
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(alertTag).style.display = "none";
                                }
                                else {
                                    swal("Please enter Numeric OR Decimal value in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    //document.getElementById(columnlength[i].FieldName).value = "";
                                    document.getElementById(columnlength[i].FieldName).focus();
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter  Numeric OR Decimal value in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                            }
                            if (DataTypeVali === "INT" || DataTypeVali === "BIG") {
                                if (isNaN(x)) {
                                    swal("Please enter numeric in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    // document.getElementById(columnlength[i].FieldName).value = "";
                                    document.getElementById(columnlength[i].FieldName).focus();
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter numeric in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.display = "none";
                            }
                        }
                        if (columnlength[i].FieldType === "selectbox") {
                            x = $("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value');
                            if (DataTypeVali === "MON" || DataTypeVali === "FLO" || DataTypeVali === "REA") {
                                if (decimal.test(x) === true) {
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(alertTag).style.display = "none";
                                }
                                else {
                                    swal("Please enter Numeric OR Decimal value in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    //$("#" + columnlength[i].FieldName).dxSelectBox({
                                    //    value: "",
                                    //});
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter Numeric OR Decimal value in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                            }
                            if (DataTypeVali === "INT" || DataTypeVali === "BIG") {
                                if (isNaN(x)) {
                                    swal("Please enter numeric in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    //$("#" + columnlength[i].FieldName).dxSelectBox({
                                    //    value: "",
                                    //});
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter numeric in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.display = "none";
                            }
                        }
                    }
                    if (columnlength[i].IsDisplay === true && columnlength[i].IsRequiredFieldValidator === true) {

                        if (columnlength[i].FieldType === "text" || columnlength[i].FieldType === "number") {

                            if (document.getElementById(columnlength[i].FieldName).value === "" || document.getElementById(columnlength[i].FieldName).value === undefined || document.getElementById(columnlength[i].FieldName).value === null) {

                                swal("Please enter.." + columnlength[i].FieldDisplayName);
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(columnlength[i].FieldName).focus();
                                document.getElementById(alertTag).style.fontSize = "10px";
                                document.getElementById(alertTag).style.display = "block";
                                document.getElementById(alertTag).innerHTML = columnlength[i].FieldDisplayName + ' should not be empty..';
                                return false;
                            }
                            else {
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.display = "none";
                            }
                        }
                        if (columnlength[i].FieldType === "textarea") {
                            if (document.getElementById(columnlength[i].FieldName).value === "" || document.getElementById(columnlength[i].FieldName).value === undefined || document.getElementById(columnlength[i].FieldName).value === null) {
                                swal("Please enter.." + columnlength[i].FieldDisplayName);
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.fontSize = "10px";
                                document.getElementById(alertTag).style.display = "block";
                                document.getElementById(alertTag).innerHTML = columnlength[i].FieldDisplayName + ' should not be empty..';
                                return false;
                            }
                            else {
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.display = "none";
                            }
                        }
                        if (columnlength[i].FieldType === "selectbox") {
                            var FieldValue = $("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value');
                            if (FieldValue === "" || FieldValue === undefined || FieldValue === null) {
                                swal("Please select.." + columnlength[i].FieldDisplayName);
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.fontSize = "10px";
                                document.getElementById(alertTag).style.display = "block";
                                document.getElementById(alertTag).innerHTML = columnlength[i].FieldDisplayName + ' should not be empty..';
                                return false;
                            }
                            else {
                                alertTag = "ValStr" + columnlength[i].FieldName;
                                document.getElementById(alertTag).style.display = "none";
                            }
                        }
                    }
                }

                var jsonObjectsItemMasterRecord = [];
                var OperationItemMasterRecord = {};

                OperationItemMasterRecord.ItemType = document.getElementById("MasterName").innerHTML.trim();
                OperationItemMasterRecord.ItemGroupID = document.getElementById("MasterID").innerHTML.trim();

                var jsonObjectsItemMasterDetailRecord = [];
                var OperationItemMasterDetailRecord = {};

                for (var j = 0; j < columnlength.length; j++) {

                    OperationItemMasterDetailRecord = {};

                    OperationItemMasterDetailRecord.FieldName = columnlength[j].FieldName.trim();
                    OperationItemMasterDetailRecord.ParentFieldName = columnlength[j].FieldName.trim();

                    if (columnlength[j].FieldType === "text" || columnlength[j].FieldType === "number") {
                        OperationItemMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).value.trim().replace(/'/g, '');
                        OperationItemMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).value.trim().replace(/'/g, '');
                    }

                    if (columnlength[j].FieldType === "textarea") {
                        OperationItemMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).value.trim();
                        OperationItemMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).value.trim();
                    }

                    if (columnlength[j].FieldType === "datebox") {
                        OperationItemMasterDetailRecord.ParentFieldValue = $("#" + columnlength[j].FieldName).dxDateBox("instance").option('value');
                        OperationItemMasterDetailRecord.FieldValue = $("#" + columnlength[j].FieldName).dxDateBox("instance").option('value');
                    }

                    if (columnlength[j].FieldType === "selectbox") {
                        OperationItemMasterDetailRecord.ParentItemID = 0;

                        var pval = $("#" + columnlength[j].FieldName).dxSelectBox("instance").option('value');
                        if (pval !== "" && pval !== "null" && pval !== null && pval !== undefined) {
                            if (isNaN(pval)) {
                                pval = pval.trim();
                            }
                        }
                        OperationItemMasterDetailRecord.ParentFieldValue = pval;
                        OperationItemMasterDetailRecord.FieldValue = pval;//$("#" + columnlength[j].FieldName).dxSelectBox("instance").option('value');
                    }

                    if (columnlength[j].FieldType === "checkbox") {
                        OperationItemMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).checked;
                        OperationItemMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).checked;
                    }

                    OperationItemMasterDetailRecord.SequenceNo = j + 1;
                    OperationItemMasterDetailRecord.ItemGroupID = document.getElementById("MasterID").innerHTML.trim();

                    GetChar = "";
                    if (columnlength[j].UnitMeasurement === "" || columnlength[j].UnitMeasurement === null || columnlength[j].UnitMeasurement === "null" || columnlength[j].UnitMeasurement === undefined) {
                        GetChar = "";
                    }
                    else {
                        GetChar = columnlength[j].UnitMeasurement;
                    }

                    OperationItemMasterRecord[OperationItemMasterDetailRecord.FieldName] = OperationItemMasterDetailRecord.FieldValue; //for main table
                    OperationItemMasterRecord.UnitMeasurement = GetChar;

                    jsonObjectsItemMasterDetailRecord.push(OperationItemMasterDetailRecord); // for details

                }

                FilterObj = { 'GetFilterData': OperationItemMasterRecord };

                if (GblItemNameString.length > 0) {
                    var strIN = GblItemNameString;
                    strIN = strIN.split(",");
                    INValue = "";
                    for (var INS in strIN) {
                        var INobj = strIN[INS];

                        if (INValue === "") {
                            INValue = OperationItemMasterRecord[INobj] + " " + OperationItemMasterRecord.UnitMeasurement;
                        } else {
                            INValue = INValue + ", " + OperationItemMasterRecord[INobj] + " " + OperationItemMasterRecord.UnitMeasurement;
                        }
                    }
                }

                if (GblItemDecString !== "" && GblItemDecString !== undefined && GblItemDecString !== "null" && GblItemDecString !== null) {
                    var strDec = GblItemDecString;
                    strDec = strDec.split(",");
                    DSValue = "";
                    var optDS = {};
                    for (var DSS in strDec) {
                        var DSbj = strDec[DSS];
                        if (DSValue === "") {
                            DSValue = DSbj + ":" + OperationItemMasterRecord[DSbj];
                        } else {
                            DSValue = DSValue + ", " + DSbj + ":" + OperationItemMasterRecord[DSbj];
                        }
                    }
                }

                var ItemName = document.getElementById("TxtItemName").value.trim();
                var TallyItemName = document.getElementById("TxtTallyItemName").value.trim();
                if (ItemName !== undefined && ItemName !== "") INValue = ItemName;
                OperationItemMasterRecord.ItemName = INValue;
                OperationItemMasterRecord.ItemDescription = DSValue;
                OperationItemMasterRecord.TallyItemName = TallyItemName;

                jsonObjectsItemMasterRecord.push(OperationItemMasterRecord);

                var CostingDataItemDetailMaster = JSON.stringify(jsonObjectsItemMasterDetailRecord);

                var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
                swal({
                    title: "Do you want to continue",
                    text: txt,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Save it !",
                    closeOnConfirm: true
                },
                    function () {
                        if (GblStatus === "Update") {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

                            $.ajax({
                                type: "POST",
                                url: "WebService_Master.asmx/UpdateData",
                                data: '{CostingDataItemMaster:' + JSON.stringify(jsonObjectsItemMasterRecord) + ',CostingDataItemDetailMaster:' + CostingDataItemDetailMaster + ',MasterName:' + JSON.stringify(MasterName) + ',ItemID:' + JSON.stringify(document.getElementById("txtGetGridRow").value) + ',UnderGroupID:' + JSON.stringify(UnderGroupID) + ',ActiveItem:' + JSON.stringify(document.getElementById("IsactivItemstatic").checked) + '}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (results) {
                                    var res = JSON.stringify(results);
                                    res = res.replace(/"d":/g, '');
                                    res = res.replace(/{/g, '');
                                    res = res.replace(/}/g, '');
                                    res = res.substr(1);
                                    res = res.slice(0, -1);

                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    if (res === "Success") {
                                        swal("Saved!", "Your data Updated", "success");
                                        FillGrid();
                                        $("#largeModal").modal('hide');
                                    } else {
                                        swal("Not Saved!", res, "warning");
                                    }
                                },
                                error: function errorFunc(jqXHR) {
                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    swal("Error!", "Please try after some time..", "error");
                                    console.log(jqXHR);
                                }
                            });
                        } else {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

                            $.ajax({
                                type: "POST",
                                url: "WebService_Master.asmx/SaveData",
                                data: '{CostingDataItemMaster:' + JSON.stringify(jsonObjectsItemMasterRecord) + ',CostingDataItemDetailMaster:' + CostingDataItemDetailMaster + ',MasterName:' + JSON.stringify(MasterName) + ',ItemGroupID:' + JSON.stringify(document.getElementById("MasterID").innerHTML.trim()) + ',ActiveItem:' + JSON.stringify(document.getElementById("IsactivItemstatic").checked) + '}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (results) {
                                    var res = JSON.stringify(results);
                                    res = res.replace(/"d":/g, '');
                                    res = res.replace(/{/g, '');
                                    res = res.replace(/}/g, '');
                                    res = res.substr(1);
                                    res = res.slice(0, -1);

                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    if (res === "Success") {
                                        swal("Saved!", "Your data Saved", "success");
                                        FillGrid();
                                        $("#largeModal").modal('hide');
                                    }
                                    else {
                                        swal("Not Saved!", res, "warning");
                                    }
                                },
                                error: function errorFunc(jqXHR) {
                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    swal("Error!", "Please try after some time..", "error");
                                    console.log(jqXHR);
                                }
                            });
                        }
                    });
            }
        }
    });
});

//Default Grid Fill
var HideColumn = "", UnderGroupID = "", VisibleTab = "";
function FillGrid() {

    var masterID = document.getElementById("MasterID").innerHTML;
    if (masterID === "" || masterID <= 0) return;
    document.getElementById("txtGetGridRow").value = "";

    var SetColumn = "", DynamicCol = {}, DynamicColPush = [];
    HideColumn = "";
    VisibleTab = "";
    try {
        try {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_Master.asmx/MasterGridColumnHide",
                data: '{masterID:' + JSON.stringify(masterID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0026/g, "&");
                    res = res.replace(/u0027/g, "'");
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res);
                    HideColumn = RES1[0].GridColumnHide;
                    VisibleTab = RES1[0].TabName;

                    GblItemNameString = RES1[0].ItemNameFormula;
                    GblItemDecString = RES1[0].ItemDescriptionFormula;

                    $.ajax({
                        type: "POST",
                        url: "WebService_Master.asmx/MasterGridColumn",
                        data: '{masterID:' + JSON.stringify(masterID) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, "&");
                            res = res.replace(/u0027/g, "'");
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            SetColumn = JSON.parse(res);

                            var SSCol = SetColumn[0].GridColumnName;
                            if (SSCol === "" || SSCol === null || SSCol === undefined) {
                                DynamicColPush = DynamicColPush;
                            }
                            else {
                                SSCol = SSCol.split(',');
                                for (var m in SSCol) {
                                    var Colobj = SSCol[m];
                                    DynamicCol = {};
                                    if (Colobj.toString().toUpperCase().indexOf("AS ") === -1) {
                                        DynamicCol.dataField = Colobj;
                                        DynamicCol.maxWidth = 120;
                                    } else {
                                        //var colDataField = Colobj.substring(0, Colobj.toString().toUpperCase().indexOf("AS ")).trim();
                                        //var colCaption = Colobj.substring(Colobj.toString().toUpperCase().indexOf("AS ") + 2, Colobj.length).trim();
                                        var colDataField = Colobj.split(' As ');
                                        var colCaption = colDataField[1];
                                        DynamicCol.dataField = colDataField[0];
                                        DynamicCol.maxWidth = 120;
                                        DynamicCol.caption = colCaption;
                                    }
                                    DynamicColPush.push(DynamicCol);
                                }
                            }

                            $.ajax({
                                type: "POST",
                                url: "WebService_Master.asmx/MasterGrid",
                                data: '{masterID:' + JSON.stringify(masterID) + '}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "text",
                                success: function (results) {
                                    var res = results.replace(/\\/g, '');
                                    res = res.replace(/"d":""/g, '');
                                    res = res.replace(/""/g, '');
                                    res = res.replace(/u0026/g, '&');
                                    res = res.replace(/u0027/g, "'");
                                    res = res.replace(/,}/g, ',null}');
                                    res = res.replace(/:,/g, ':null,');
                                    res = res.substr(1);
                                    res = res.slice(0, -1);
                                    var RES1 = [];
                                    if (res !== "") RES1 = JSON.parse(res);

                                    $("#MasterGrid").dxDataGrid({
                                        dataSource: RES1,
                                        columns: DynamicColPush
                                    });
                                }
                            });

                        }
                    });

                    //Create Dril Down Of Masters
                    document.getElementById("TabDiv").innerHTML = "";

                    if (VisibleTab !== "" && VisibleTab !== null && VisibleTab !== undefined) {
                        var CreTab = VisibleTab.split(',');
                        var CreTabContener = "";
                        for (var cr in CreTab) {
                            var CreTabName = CreTab[cr];
                            CreTabContener += "<li role='presentation' id=TL" + CreTabName + " ><a id=" + CreTabName + "   href='#' data-toggle='tab' onclick='DrilDown(this);' style='background-color:none;'>" + CreTabName.replace(/_/g, ' ') + "</a></li>";
                        }
                        $('#TabDiv').append('<ul  class="nav nav-tabs tab-col-red" role="tablist" style="color: green;border:none">' + CreTabContener + '</ul>');
                    }

                }
            });

        } catch (e) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        }
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

//Edit Selected Data on PopUp
$("#EditButton").click(function () {

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = "";
    document.getElementById("BtnSave").disabled = "";

    document.getElementById("IsactivItemstatic_Div").style.display = "block";
    document.getElementById("LblItemCode").style.display = "block";

    var txtGetGridRow = document.getElementById("txtGetGridRow").value;

    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        swal("Please choose any row from below Grid..!", "", "");
        return false;
    }
    refreshbtn();
    GblStatus = "Update";

    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/MasterGridLoadedData",
        data: '{masterID:' + JSON.stringify(UnderGroupID) + ',Itemid:' + JSON.stringify(txtGetGridRow) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.replace(/,}/g, ',null}');
            res = res.replace(/:,/g, ':null,');
            res = res.substr(2);
            res = res.slice(0, -2);

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            var LoadedData = JSON.parse(res);

            if (LoadedData["ISItemActive"] === "True" || LoadedData["ISItemActive"] === true) {
                document.getElementById("IsactivItemstatic").checked = true;
            }
            else {
                document.getElementById("IsactivItemstatic").checked = false;
            }
            document.getElementById("TxtItemName").value = LoadedData["ItemName"];

            for (var e = 0; e < GBLField.length; e++) {

                if (GBLField[e].FieldType === "text") {
                    document.getElementById(GBLField[e].FieldName).value = LoadedData[GBLField[e].FieldName];
                }
                else if (GBLField[e].FieldType === "number") {
                    document.getElementById(GBLField[e].FieldName).value = Number(LoadedData[GBLField[e].FieldName]);
                }
                else if (GBLField[e].FieldType === "textarea") {
                    document.getElementById(GBLField[e].FieldName).value = LoadedData[GBLField[e].FieldName];
                }
                else if (GBLField[e].FieldType === "checkbox") {
                    var chkStatus = "";
                    if (LoadedData[GBLField[e].FieldName] === "False" || LoadedData[GBLField[e].FieldName] === false || LoadedData[GBLField[e].FieldName] === 0) {
                        chkStatus = false;
                    }
                    else if (LoadedData[GBLField[e].FieldName] === "True" || LoadedData[GBLField[e].FieldName] === true || LoadedData[GBLField[e].FieldName] === 1) {
                        chkStatus = true;
                    }

                    document.getElementById(GBLField[e].FieldName).checked = chkStatus;
                }
                else if (GBLField[e].FieldType === "datebox") {
                    // document.getElementById(GBLField[e].FieldName).value = LoadedData[GBLField[e].FieldName];
                    $("#" + GBLField[e].FieldName).dxDateBox({
                        value: LoadedData[GBLField[e].FieldName]
                    });
                }
                else if (GBLField[e].FieldType === "selectbox") {
                    var UPSID = "#" + GBLField[e].FieldName;
                    //var selValue = LoadedData[GBLField[e].FieldName];
                    var selValue = "";
                    if (isNaN(LoadedData[GBLField[e].FieldName])) {
                        selValue = LoadedData[GBLField[e].FieldName];
                    }
                    else {
                        selValue = JSON.parse(LoadedData[GBLField[e].FieldName]);
                    }

                    $(UPSID).dxSelectBox({
                        value: selValue
                    });

                }
            }
        }
    });

});

//SaveAs Data On Pop Up
$("#BtnSaveAS").click(function () {
    GblStatus = "";
    $("#BtnSave").click();
});

//Delete Selected Data on PopUp
$("#DeleteButton").click(function () {
    var MasterName = document.getElementById("MasterName").innerHTML;
    var txtGetGridRow = document.getElementById("txtGetGridRow").value;

    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/CheckPermission",
        data: '{TransactionID:' + JSON.stringify(txtGetGridRow) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res === "Exist") {
                swal("", "This item is used in another process..! Record can not be delete.", "error");
                return false;
            }
            else {

                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this Content!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, function () {

                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                    $.ajax({
                        type: "POST",
                        url: "WebService_Master.asmx/DeleteData",
                        data: '{txtGetGridRow:' + JSON.stringify(txtGetGridRow) + ',MasterName:' + JSON.stringify(MasterName) + ',UnderGroupID:' + JSON.stringify(UnderGroupID) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            if (res === "Success") {
                                //  alert("Your Data has been Deleted Successfully...!");
                                swal("Deleted!", "Your Content has been deleted.", "success");
                                //location.reload();
                                FillGrid();
                                $("#largeModal").modal('hide');
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            alert(jqXHR);
                        }
                    });

                });

            }

        }
    });


});

$("#BtnNew").click(function () {
    refreshbtn();
    document.getElementById("BtnDeletePopUp").disabled = true;
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

//For DrillDown Tab
function DrilDown(dr) {
    var masterID = document.getElementById("MasterID").innerHTML;

    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/DrillDownMasterGrid",
        data: '{masterID:' + JSON.stringify(masterID) + ',TabID:' + JSON.stringify(dr.id) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = [];
            if (res === "") { RES1 = []; } else RES1 = JSON.parse(res);
            if (RES1 === [] || RES1 === "") {
                RES1 = [];
            }

            $("#DrilDownGrid").dxDataGrid({
                dataSource: RES1,
                columnAutoWidth: true,
                showBorders: true,
                showRowLines: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                sorting: {
                    mode: "multiple"
                },
                selection: { mode: "single" },
                //height: 600,
                scrolling: { mode: 'virtual' },
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
                    fileName: document.getElementById("MasterDisplayName").innerHTML + '-' + document.getElementById(dr.id).innerHTML,
                    allowExportSelectedData: true
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                }

                //onCellClick: function (e) {
                //    var grid = $('#DrilDownGrid').dxDataGrid('instance');
                //    if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
                //    var Row = e.row.rowIndex;
                //    var Col = e.columnIndex;

                //    document.getElementById("txtGetGridRow").value = "";
                //    document.getElementById("txtGetGridRow").value = grid.cellValue(Row, 0);
                //    UnderGroupID = "";
                //    UnderGroupID = grid.cellValue(Row, 1);
                //},
                //onContentReady: function (e) {
                //    //  var HCol = HideColumn[0].GridColumnHide;
                //    var HCol = HideColumn;
                //    if (HCol) {
                //        HCol = HCol.split(',');
                //        for (var hc in HCol) {
                //            var placedHC = HCol[hc];
                //            $('#MasterGrid').dxDataGrid("columnOption", placedHC, "visible", false);
                //        }
                //    }
                //},
                //columns: DynamicColPush

            });
        }
    });

}

$("#btnTabModel").click(function () {

    var txtGetGridRow = document.getElementById("txtGetGridRow").value;

    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    $("#TabDiv>ul>li.active").removeClass("active");

    $("#TabDiv>ul>li.active").removeClass("active");

    $("#DrilDownGrid").dxDataGrid({
        dataSource: [],
        showBorders: true,
        showRowLines: true,
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        export: {
            enabled: true,
            fileName: document.getElementById("MasterDisplayName").innerHTML
            //allowExportSelectedData: false,
        }
    });

    document.getElementById("btnTabModel").setAttribute("data-toggle", "modal");
    document.getElementById("btnTabModel").setAttribute("data-target", "#TabModal");
});

//Refresh Function
function refreshbtn() {
    GblStatus = "";
    document.getElementById("LblItemCode").innerHTML = "";
    document.getElementById("LblItemCode").style.display = "none";
    document.getElementById("TxtItemName").value = "";/// added by pKp
    document.getElementById("TxtTallyItemName").value = "";/// added by pKp

    if (GBLField.length > 0) {
        for (var i = 0; i < GBLField.length; i++) {
            if (GBLField[i].FieldType === "text" || GBLField[i].FieldType === "number") {
                document.getElementById(GBLField[i].FieldName).value = "";
            }
            if (GBLField[i].FieldType === "textarea") {
                document.getElementById(GBLField[i].FieldName).value = "";
            }
            if (GBLField[i].FieldType === "checkbox") {
                document.getElementById(GBLField[i].FieldName).checked = false;
            }
            if (GBLField[i].FieldType === "datebox") {
                $("#" + GBLField[i].FieldName).dxDateBox({
                    value: new Date().toISOString().substr(0, 10)
                });
            }
            if (GBLField[i].FieldType === "selectbox") {
                $("#" + GBLField[i].FieldName).dxSelectBox({
                    value: null
                });
            }
        }
    }
}

//For Formulas
var holdvalue = "", getFormula = "";
function FarmulaChange(FC) {
    var getValid = "ValStr" + FC.id;

    var x = document.getElementById(FC.id).value;
    if (isNaN(x)) {
        document.getElementById(getValid).style.display = "block";
        document.getElementById(getValid).innerHTML = 'This field must have alphanumeric characters only';
        document.getElementById(FC.id).value = "";
        document.getElementById(FC.id).focus();
        return false;

    }
    else {
        document.getElementById(getValid).style.display = "none";
        var geval = "ValCh" + FC.id;
        var getSepValu = document.getElementById(geval).value;
        getSepValu = getSepValu.replace('/', '');
        getSepValu = getSepValu.replace(' ', '');

        var CreateVar = [];
        CreateVar = getSepValu;

        var StrgLength = 1;
        var NextString = CreateVar.toLowerCase().includes("and");

        var mergeString = "";
        if (NextString === true) {
            mergeString = CreateVar.split('and');
            StrgLength = mergeString.length;
        }
        else {
            mergeString = CreateVar;
            StrgLength = 1;
        }

        for (var z = 0; z < StrgLength; z++) {
            if (NextString === true) {
                CreateVar = mergeString[z].split(',');
            } else {
                CreateVar = mergeString.split(',');
            }
            holdvalue = "";
            var MakeObj = "", MakeObjValue = "";
            for (var t = 0; t < CreateVar.length; t++) {
                if (t === 0) {
                    holdvalue = CreateVar[t];
                } else {
                    var fillValue = document.getElementById(CreateVar[t]).value;
                    var StrVar = "";
                    if (MakeObj === "" || MakeObj === undefined || MakeObj === null) {
                        if (isNaN(fillValue)) {//*
                            StrVar = '"' + fillValue + '"';//*
                        } else {//*
                            StrVar = Number(fillValue);
                            //if (fillValue === "" || fillValue === null || fillValue === undefined) {
                            //    fillValue = 0;
                            //}
                        }//*
                        // MakeObj += CreateVar[t] + '=' + fillValue;
                        MakeObj += CreateVar[t] + '=' + StrVar;
                    } else {
                        if (isNaN(fillValue)) {//*
                            StrVar = '"' + fillValue + '"';//*
                        } else {
                            StrVar = Number(fillValue);
                        }
                        MakeObj += ',' + CreateVar[t] + '=' + StrVar;
                        //if (fillValue === "" || fillValue === null || fillValue === undefined) {
                        //    fillValue = 0;
                        //}
                        //MakeObj += ',' + CreateVar[t] + '=' + fillValue;
                    }

                }
            }
            getFormula = "";
            var addstr = "Formula" + FC.id;
            getFormula = document.getElementById(addstr).innerHTML;
            //alert(getFormula);
            var NextFarmula = getFormula.toLowerCase().includes("and");
            if (NextFarmula === true) {
                getFormula = getFormula.split('and');
                getFormula = getFormula[z];
            }
            ApplyOperation(MakeObj);
        }
    }

}

function FarmulaChangeSELECTBX(currentID) {

    var geval = "ValCh" + currentID;
    var getSepValu = document.getElementById(geval).value;

    var selValue = "";
    selValue = $("#" + currentID).dxSelectBox("instance").option('text');
    if (selValue !== "" && selValue !== null && selValue !== "null" && selValue !== undefined) {

        if (getSepValu !== null && getSepValu !== undefined && getSepValu !== "null" && getSepValu !== "") {

            getSepValu = getSepValu.replace('/', '');
            getSepValu = getSepValu.replace(/ /g, '');

            var CreateVar = [];
            CreateVar = getSepValu;

            var StrgLength = 1;
            var NextString = CreateVar.toLowerCase().includes("and");

            var mergeString = "";
            if (NextString === true) {
                mergeString = CreateVar.split('and');
                StrgLength = mergeString.length;
            }
            else {
                mergeString = CreateVar;
                StrgLength = 1;
            }

            for (var no = 0; no < StrgLength; no++) {
                if (NextString === true) {
                    CreateVar = mergeString[no].split(',');
                } else {
                    CreateVar = mergeString.split(',');
                }

                holdvalue = "";
                var MakeObj = "", MakeObjValue = "";

                for (var t = 0; t < CreateVar.length; t++) {
                    if (t === 0) {
                        holdvalue = CreateVar[t].replace(/ /g, '');
                    } else {
                        var fillValue = $("#" + CreateVar[t].replace(/ /g, '')).dxSelectBox("instance").option('text');
                        var StrVar = "";
                        if (MakeObj === "" || MakeObj === undefined || MakeObj === null) {
                            if (fillValue === null || fillValue === "" || fillValue === undefined || fillValue === "null") {
                                //fillValue = "null";
                                fillValue = 0;
                            }
                            if (isNaN(fillValue)) {
                                StrVar = '"' + fillValue + '"';
                            } else {
                                StrVar = Number(fillValue);
                            }

                            MakeObj += CreateVar[t] + '=' + StrVar;
                        } else {
                            if (fillValue === null || fillValue === "" || fillValue === undefined || fillValue === "null") {
                                //fillValue = "null";
                                fillValue = 0;
                            }
                            if (isNaN(fillValue)) {//*
                                StrVar = '"' + fillValue + '"';//*
                            } else {
                                StrVar = Number(fillValue);
                            }
                            MakeObj += ',' + CreateVar[t] + '=' + StrVar;
                        }

                    }
                }

                getFormula = "";
                var addstr = "Formula" + currentID;
                getFormula = document.getElementById(addstr).innerHTML;

                var NextFarmula = getFormula.toLowerCase().includes("and");

                if (NextFarmula === true) {
                    getFormula = getFormula.split('and');
                    getFormula = getFormula[no];
                }
                ApplyOperation(MakeObj);

            }

        }
    }
}

function ApplyOperation(MakeObj) {

    var getMakeObj = MakeObj.split(',');
    var doc = "";
    for (var e = 0; e < getMakeObj.length; e++) {
        if (getMakeObj[e] !== "" && getMakeObj[e] !== null) {
            if (doc === "" || doc === undefined || doc === null) {
                doc += "var " + getMakeObj[e];
            } else {
                doc += "; var " + getMakeObj[e];
            }
        }
    }

    getFormula = getFormula.split('=');
    getFormula = getFormula[1];

    var IsFarmula = getFormula.toLowerCase().includes("conc");

    if (IsFarmula === true) {
        var getFormulaConc = getFormula.replace(/conc/g, ',');
        getFormulaConc = getFormulaConc.replace(/CONC/g, ',');
        getFormulaConc = getFormulaConc.split(',');

        var concanate = getFormulaConc;
        var Concstrng = "";
        Concat(concanate);
    }
    else {
        getFormula = getFormula.replace(/u0027/g, "'");
        var CalResult = "return " + getFormula;

        if (doc === "") {
            doc = "function GetRes(){" + CalResult + ";}";
        } else {
            doc = doc + ";function GetRes(){" + CalResult + ";}";
        }
        eval(doc);

        var ResultsValue = GetRes();
        SetFieldValue(holdvalue, ResultsValue);
    }

    function Concat(concanate) {

        var MakeString = concanate;

        for (var g in MakeString) {
            var CalResult = "return " + MakeString[g];
            doc = doc + ";function cv(){" + CalResult + ";}";
            eval(doc);
            if (Concstrng === "") {
                Concstrng = cv();
            }
            else {
                Concstrng = Concstrng + " X " + cv();
            }
        }

        document.getElementById(holdvalue).value = Concstrng;
        document.getElementById(holdvalue).readOnly = true;
    }

}

function SetFieldValue(name, value) {
    try {
        if (GBLField.length > 0) {
            for (var i = 0; i < GBLField.length; i++) {
                if (GBLField[i].FieldName === name) {
                    var IsLocked = true;
                    if (GBLField[i].IsActive === true || GBLField[i].IsActive === "true") { IsLocked = false; } else { IsLocked = true; }
                    if (GBLField[i].FieldType === "text" || GBLField[i].FieldType === "number") {
                        document.getElementById(GBLField[i].FieldName).value = value;
                        document.getElementById(GBLField[i].FieldName).readOnly = IsLocked;
                    }
                    if (GBLField[i].FieldType === "textarea") {
                        document.getElementById(GBLField[i].FieldName).value = value;
                    }
                    if (GBLField[i].FieldType === "checkbox") {
                        document.getElementById(GBLField[i].FieldName).checked = value;
                    }
                    if (GBLField[i].FieldType === "datebox") {
                        $("#" + GBLField[i].FieldName).dxDateBox({
                            pickerType: "rollers",
                            formate: 'date',
                            value: value,
                            formatString: 'dd-MMM-yyyy'
                        });
                    }
                    if (GBLField[i].FieldType === "selectbox") {
                        $("#" + GBLField[i].FieldName).dxSelectBox({
                            value: value,
                            disabled: IsLocked
                        });
                    }
                }
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}
