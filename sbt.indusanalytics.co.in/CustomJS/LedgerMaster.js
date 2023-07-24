//"use strict";

var GblStatus = "", ConcernPerson = "";
var LedgerGrNID = "";
var DynamicColPush = [];

var ItemSelectionKeys = '';

var SalesCordiantorArray = [], SALESEXECUTIVEARRAY = [];
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

$("#ListIfItemsGrid").dxDataGrid({
    keyExpr: 'ItemId',
    dataSource: [],
    columns: [
        { dataField: "ItemCode" },
        { dataField: "ItemName" },
        { dataField: "Quality" },
        { dataField: "StockCategory" },
        { dataField: "GSM" },
        { dataField: "ItemSize" },
        { dataField: "ItemDescription" },
        { dataField: "ItemType" },
        { dataField: "StockUnit" },

    ],
    scrolling: {
        mode: 'infinite',
    },
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "multiple" },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },

});
getMasterLIST();

$("#MasterGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    paging: {
        pageSize: 25
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [25, 100, 250, 500, 1000]
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    sorting: {
        mode: "multiple"
    },
    selection: { mode: "single" },
    //height: 600,
    // scrolling: { mode: 'virtual' },
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
        fileName: document.getElementById("MasterDisplayName").innerHTML,
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        document.getElementById("txtGetGridRow").value = "";
        UnderGroupID = "";
        var data = selectedItems.selectedRowsData;
        if (data.length <= 0) return false;

        document.getElementById("txtGetGridRow").value = data[0].LedgerID; /// grid.cellValue(Row, 0);        
        UnderGroupID = data[0].LedgerGroupID; ///grid.cellValue(Row, 1);
        $.ajax({
            async: false,
            type: "POST",
            url: "WebService_LedgerMaster.asmx/GetSalesCordnators",
            data: '{ID:' + JSON.stringify(data[0].RefSalesRepresentativeID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                SalesCordiantorArray = JSON.parse(res);

            }
        });
        $.ajax({
            async: false,
            type: "POST",
            url: "WebService_LedgerMaster.asmx/GetSalesPerson",
            data: '{ID:' + JSON.stringify(data[0].RefSalesRepresentativeID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                SALESEXECUTIVEARRAY = JSON.parse(res);

            }

        });

        $("#GridPerson").dxDataGrid({
            columns: [
                { dataField: "Name", visible: true, caption: "Name", validationRules: [{ type: "required" }] },
                { dataField: "Designation", visible: true, caption: "Designation" },
                {
                    dataField: "Mobile", visible: true, caption: "Mobile No",
                    validationRules: [{ type: "required" }, {
                        type: "numeric",
                        message: 'You must enter only numeric value..!'
                    }]
                },
                { dataField: "Email", visible: true, caption: "Email", validationRules: [{ type: "required" }, { type: "email" }] },
                {
                    dataField: "SalesCordinatorID", visible: true, caption: "Sales Cordinator",
                    lookup: {
                        dataSource: SalesCordiantorArray,
                        displayExpr: "LedgerName",
                        valueExpr: "SalesCordinatorID",

                    }
                },
                {
                    dataField: "LedgerIDSE", visible: true, caption: "POC",
                    lookup: {
                        dataSource: SALESEXECUTIVEARRAY,
                        displayExpr: "LedgerName",
                        valueExpr: "LedgerIDSE",

                    }
                },
                { dataField: "IsPrimaryConcernPerson", visible: true, caption: "Is Primary ConcernPerson", dataType: "boolean" }
            ],
        });

        ExistCosernPerson();
    }
});

//Dynamic Maser UL
function getMasterLIST() {
    var masterID = document.getElementById("MasterID").innerHTML;

    var currentMaster = "";
    if (masterID !== "") {
        currentMaster = "ChooseMaster" + masterID;
    }
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebService_LedgerMaster.asmx/MasterList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);

                $("#RadioMasterList").dxRadioGroup({
                    dataSource: RES1,
                    displayExpr: "LedgerGroupNameDisplay",
                    valueExpr: "LedgerGroupID",
                    layout: 'horizontal',
                    onValueChanged: function (e) {
                        CurrentMaster(e);
                        $('#ShowListButton').click();
                    }
                });

                $("#RadioMasterList").dxRadioGroup({ value: RES1[0].LedgerGroupID });


            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

//Selected Master
function CurrentMaster(e) {
    var value = e.value;
    if (value === undefined || value <= 0) return;
    var text = '';
    var ds = $("#RadioMasterList").dxRadioGroup('instance').option('dataSource');
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].LedgerGroupID === value) {
            text = ds[i].LedgerGroupNameDisplay;
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
    if (text.toUpperCase().includes("CLIENT")) $("#btnConvertToConsignee").show(); else $("#btnConvertToConsignee").hide();

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GetLedgerGroupNameID",
        data: '{MID:' + JSON.stringify(value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var LGNI = JSON.parse(res);
            LedgerGrNID = LGNI[0].LedgerGroupNameID;
            if (LedgerGrNID === 23 || LedgerGrNID === "23") {
                $("#btnItemGroupAllo").removeClass("hidden");
            }
            else {
                $("#btnItemGroupAllo").addClass("hidden");
            }
        }
    });

    $("#MasterGrid").dxDataGrid({ dataSource: [] });

    FillGrid();
    DynamicControlls();
}


var selID = ""; var selQuery = ""; var selDefault = ""; var tagQuery = ""; var tgID = "";
var GBLField = "";

$("#ShowListButton").click(function () {
    var masterID = document.getElementById("MasterID").innerHTML;
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/MasterGrid",
        data: '{masterID:' + JSON.stringify(masterID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "Json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:}/g, ':null}');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res);

            $("#MasterGrid").dxDataGrid({
                dataSource: RES1,
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
                },
                columns: DynamicColPush,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), localStorage.getItem('activeName') + '.xlsx');
                        });
                    });
                    e.cancel = true;
                }
                //onFileSaving: function (e) {
                //    saveAs(new Blob([$('#MasterGrid').dxDataGrid('instance')._options.dataSource], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), localStorage.getItem('activeName'));

                //    e.cancel = true;
                //},
            });

        }
    });

});

//Creation of Dynamic Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";
    refreshbtn();

    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = "";

    document.getElementById("Isactivledgerstatic_Div").style.display = "none";
    // DynamicControlls();

    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

//Function For Create Controlls
function DynamicControlls() {
    GblStatus = "";

    var masterID = document.getElementById("MasterID").innerHTML;
    var fieldContainer = "";
    document.getElementById("FieldCntainerRow").innerHTML = "";
    $.ajax({
        type: "POST",
        async: false,
        url: "WebService_LedgerMaster.asmx/Master",
        data: '{masterID:' + JSON.stringify(masterID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            GBLField = JSON.parse(res);
            var RES1 = GBLField;

            selQuery = ""; selID = "";
            if (RES1.length <= 0) {
                document.getElementById("BtnSave").disabled = true;
                return;
            }
            for (var i = 0; i < RES1.length; i++) {
                var DEselID = "";
                var IsDisplayCol = "";
                if (RES1[i].IsDisplay === true) { IsDisplayCol = "block"; } else { IsDisplayCol = "none"; }
                if (RES1[i].FieldType === "text" || RES1[i].FieldType === "number") {
                    fieldContainer = "";
                    var chngevt = RES1[i].ControllValidation;
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
                            '<input id=' + RES1[i].FieldName + ' type="' + RES1[i].FieldType + '"  class="forTextBox" onchange="FarmulaChange(this);" min="0"/><br />' +
                            '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px;display:block"></strong><textarea id=ValCh' + RES1[i].FieldName + ' style="display: none" >' + RES1[i].FieldFormulaString + '</textarea><strong id=Formula' + RES1[i].FieldName + ' style="display: none">' + RES1[i].FieldFormula + '</strong></div></div>';
                        $("#FieldCntainerRow").append(fieldContainer);
                    }
                }
                else if (RES1[i].FieldType === "checkbox") {
                    fieldContainer = "";
                    fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                        '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                        '<input type="checkbox" id="' + RES1[i].FieldName + '" class="filled-in chk-col-red" style="height:20px"/>' +
                        '<label for="' + RES1[i].FieldName + '" style="height:20px"></label><br />' +
                        '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong></div></div>';
                    $("#FieldCntainerRow").append(fieldContainer);
                }
                else if (RES1[i].FieldType === "textarea") {
                    fieldContainer = "";
                    var chngevtn = RES1[i].ControllValidation;
                    fieldContainer = '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:' + IsDisplayCol + '">' +
                        '<label style="float: left; width: 100%;">' + RES1[i].FieldDisplayName + '</label><br />' +
                        '<textarea id="' + RES1[i].FieldName + '" style="float: left; width: 100%; height: 27px; border-radius: 4px;padding-left:10px;padding-right:10px;margin-top:0px" onchange="' + chngevtn + '"></textarea><br />' +
                        '<div style="min-height:15px;float:left;width:100%"><strong id=ValStr' + RES1[i].FieldName + ' style="color:red;font-size:10px"></strong></div></div>';
                    $("#FieldCntainerRow").append(fieldContainer);
                }
                else if (RES1[i].FieldType === "datebox") {
                    fieldContainer = "";
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
                else if (RES1[i].FieldType === "selectbox") {
                    DEselID = "";
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

                        var LedgerPush = [];
                        var LedgerLength = 0;
                        if (DEselDefault !== null && DEselDefault !== "null" && DEselDefault !== undefined) {

                            var Ledger = DEselDefault.split(',');
                            LedgerLength = Ledger.length;
                        }


                        if (LedgerLength > 0) {
                            for (var k = 0; k < LedgerLength; k++) {
                                LedgerPush.push(Ledger[k]);
                            }
                        }
                        var SID = "#" + DEselID;
                        if (RES1[i].FieldFormula === "" || RES1[i].FieldFormula === null || RES1[i].FieldFormula === undefined) {
                            $(SID).dxSelectBox({
                                items: LedgerPush,
                                placeholder: "Select--",
                                //displayExpr: 'GroupName',
                                //valueExpr: 'GroupID',
                                showClearButton: true,
                                acceptCustomValue: true,
                                searchEnabled: true
                            });
                        } else {
                            $(SID).dxSelectBox({
                                items: LedgerPush,
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
                            selID = RES1[i].FieldName;
                        }
                        else {
                            selID = selID + ' ? ' + RES1[i].FieldName;
                        }

                        if (selQuery === "" || selQuery === null || selQuery === undefined) {
                            // selQuery = RES1[i].SelectboxQueryDB;
                            selQuery = RES1[i].LedgerGroupFieldID;
                        }
                        else {
                            //selQuery = selQuery + ' ? ' + RES1[i].SelectboxQueryDB;
                            selQuery = selQuery + ' ? ' + RES1[i].LedgerGroupFieldID;
                        }

                    }

                } else if (RES1[i].FieldType === "tagbox") {
                    DEselID = "";
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

                        var LedgerPush = [];
                        var LedgerLength = 0;
                        if (DEselDefault !== null && DEselDefault !== "null" && DEselDefault !== undefined) {

                            var Ledger = DEselDefault.split(',');
                            LedgerLength = Ledger.length;
                        }


                        if (LedgerLength > 0) {
                            for (var k = 0; k < LedgerLength; k++) {
                                LedgerPush.push(Ledger[k]);
                            }
                        }
                        var SID = "#" + DEselID;
                        if (RES1[i].FieldFormula === "" || RES1[i].FieldFormula === null || RES1[i].FieldFormula === undefined) {
                            $(SID).dxTagBox({
                                items: LedgerPush,
                                //showSelectionControls: true,
                                //applyValueMode: 'useButtons',
                            });
                        } else {
                            $(SID).dxTagBox({
                                items: LedgerPush,
                                //showSelectionControls: true,
                                //applyValueMode: 'useButtons',
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

                        if (tgID === "" || tgID === null || tgID === undefined) {
                            tgID = RES1[i].FieldName;
                        }
                        else {
                            tgID = tgID + ' ? ' + RES1[i].FieldName;
                        }

                        if (tagQuery === "" || tagQuery === null || tagQuery === tagQuery) {
                            // selQuery = RES1[i].SelectboxQueryDB;
                            tagQuery = RES1[i].LedgerGroupFieldID;
                        }
                        else {
                            //selQuery = selQuery + ' ? ' + RES1[i].SelectboxQueryDB;
                            tagQuery = tagQuery + ' ? ' + RES1[i].LedgerGroupFieldID;
                        }

                    }

                }
            }

            $("#FieldCntainerRow").append('<div id="Isactivledgerstatic_Div" class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left;margin-bottom:0px;display:none">' +
                '<label style="float: left; width: 100%;">Is Active Ledger.?</label><br />' +
                '<input type="checkbox" id="Isactivledgerstatic" class="filled-in chk-col-red" style="height:20px" checked="true"/>' +
                '<label for="Isactivledgerstatic" style="height:20px" ></label><br />' +
                '<div style="min-height:15px;float:left;width:100%"><strong id="ValStrIsactivledgerstaticLabel" style="color:red;font-size:10px"></strong></div></div>');

            if (selQuery !== "") {
                selctbox();
            }
            if (tagQuery !== "") {
                tagbox();
            }
            document.getElementById("BtnSave").disabled = false;
        }
    });
}

//Fill Dynamic Selectbox
function selctbox() {
    var selbox = "";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/SelectBoxLoad",
        data: '{Qery:' + JSON.stringify(selQuery) + ',selID:' + JSON.stringify(selID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            try {
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
                    if (selA.length > 1) {
                        ///////////////////////////////////////With  valueExpr/////////////////////////////////////////////
                        Displayxpr = selA[1];
                        Valuexpr = selA[0];

                        var selectID = JSON.stringify(Tblobj[Tblobj.length - 1]);

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
                            //    var NewLedger = e.value;
                            //    Tblobj.push(NewLedger);
                            //    editableProduct.option("Ledgers", Tblobj);
                            //    e.customItem = NewLedger;
                            //   // return NewLedger;
                            //}
                        });

                    }
                    else {
                        Displayxpr = selA[0];
                        Valuexpr = selA[0];
                        ///////////////////////////////////////WithOut  valueExpr/////////////////////////////////////////////

                        var selectelseID = JSON.stringify(Tblobj[Tblobj.length - 1]);
                        selectelseID = selectelseID.substr(1);
                        selectelseID = selectelseID.slice(0, -1);
                        selectelseID = selectelseID.replace(/"/g, '');
                        selectelseID = selectelseID.replace(/ /g, '');
                        selectelseID = selectelseID.split(":");
                        var replaceText = selectelseID[1];
                        selectelseID = "#" + selectelseID[1];

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
                        for (var Ledgertxt in ReplaceTblobj) {
                            simpleProducts.push(ReplaceTblobj[Ledgertxt]);
                        }

                        $(selectelseID).dxSelectBox({
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

            } catch (e) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        }
    });
}
function tagbox() {
    var selbox = "";
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/SelectBoxLoad",
        data: '{Qery:' + JSON.stringify(tagQuery) + ',selID:' + JSON.stringify(tgID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            try {
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
                    if (selA.length > 1) {
                        ///////////////////////////////////////With  valueExpr/////////////////////////////////////////////
                        Displayxpr = selA[1];
                        Valuexpr = selA[0];

                        var selectID = JSON.stringify(Tblobj[Tblobj.length - 1]);

                        selectID = selectID.substr(1);
                        selectID = selectID.slice(0, -1);
                        selectID = selectID.replace(/"/g, '');
                        selectID = selectID.replace(/ /g, '');
                        selectID = selectID.split(":");
                        selectID = "#" + selectID[2];

                        Tblobj = Tblobj.slice(0, -1);

                        $(selectID).dxTagBox({
                            items: Tblobj,
                            placeholder: "Select--",
                            displayExpr: Displayxpr,
                            valueExpr: Valuexpr,
                            searchEnabled: true,
                            showClearButton: true,
                            showSelectionControls: true,
                            //applyValueMode: 'useButtons',
                            //onCustomItemCreating: function (e) {
                            //    //Add a new item to your data store based on the e.text value
                            //    var NewLedger = e.value;
                            //    Tblobj.push(NewLedger);
                            //    editableProduct.option("Ledgers", Tblobj);
                            //    e.customItem = NewLedger;
                            //   // return NewLedger;
                            //}
                        });

                    }
                    else {
                        Displayxpr = selA[0];
                        Valuexpr = selA[0];
                        ///////////////////////////////////////WithOut  valueExpr/////////////////////////////////////////////

                        var selectelseID = JSON.stringify(Tblobj[Tblobj.length - 1]);
                        selectelseID = selectelseID.substr(1);
                        selectelseID = selectelseID.slice(0, -1);
                        selectelseID = selectelseID.replace(/"/g, '');
                        selectelseID = selectelseID.replace(/ /g, '');
                        selectelseID = selectelseID.split(":");
                        var replaceText = selectelseID[1];
                        selectelseID = "#" + selectelseID[1];

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
                        for (var Ledgertxt in ReplaceTblobj) {
                            simpleProducts.push(ReplaceTblobj[Ledgertxt]);
                        }

                        $(selectelseID).dxTagBox({
                            items: simpleProducts,
                            //placeholder: "Select--",
                            //displayExpr: Displayxpr,
                            //valueExpr: Valuexpr,
                            searchEnabled: true,
                            showClearButton: true,
                            showSelectionControls: true,
                            //applyValueMode: 'useButtons',
                        });
                    }
                }
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

            } catch (e) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        }
    });
}

//Save Dynamic Data
$("#BtnSave").click(function () {
    var columnlength = "";

    var MasterName = document.getElementById("MasterName").innerHTML;
    var masterID = document.getElementById("MasterID").innerHTML;

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/Master",
        data: '{masterID:' + JSON.stringify(masterID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            columnlength = JSON.parse(res);

            if (columnlength.length > 0) {
                var alertTag = "";
                for (var i = 0; i < columnlength.length; i++) {

                    var DataTypeVali = columnlength[i].FieldDataType;
                    DataTypeVali = DataTypeVali.substring(0, 3);
                    DataTypeVali = DataTypeVali.toUpperCase().trim();
                    var decimal = /^[0-9]+\.?[0-9]*$/;

                    if (columnlength[i].IsDisplay === true) {
                        if (columnlength[i].FieldType === "text" || columnlength[i].FieldType === "textarea") {
                            var x = document.getElementById(columnlength[i].FieldName).value;
                            if (DataTypeVali === "MON" || DataTypeVali === "FLO" || DataTypeVali === "REA") {
                                if (decimal.test(x) === true) {
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(alertTag).style.display = "none";
                                }
                                else {
                                    alert("Please enter Numeric OR Decimal value in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(columnlength[i].FieldName).value = "";
                                    document.getElementById(columnlength[i].FieldName).focus();
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter Numeric OR Decimal value in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                            }
                            if (DataTypeVali === "INT" || DataTypeVali === "BIG") {
                                if (isNaN(x)) {
                                    alert("Please enter numeric in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(columnlength[i].FieldName).value = "";
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
                            var xx = $("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value');
                            if (DataTypeVali === "MON" || DataTypeVali === "FLO" || DataTypeVali === "REA") {
                                if (decimal.test(xx) === true) {
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    document.getElementById(alertTag).style.display = "none";
                                }
                                else {
                                    alert("Please enter Numeric OR Decimal value in ." + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    $("#" + columnlength[i].FieldName).dxSelectBox({
                                        value: ""
                                    });
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter Numeric OR Decimal value in ' + columnlength[i].FieldDisplayName;
                                    return false;
                                }
                            }
                            if (DataTypeVali === "INT" || DataTypeVali === "BIG") {
                                if (isNaN(xx)) {
                                    alert("Please enter numeric in " + columnlength[i].FieldDisplayName);
                                    alertTag = "ValStr" + columnlength[i].FieldName;
                                    $("#" + columnlength[i].FieldName).dxSelectBox({
                                        value: ""
                                    });
                                    document.getElementById(alertTag).style.fontSize = "10px";
                                    document.getElementById(alertTag).style.display = "block";
                                    document.getElementById(alertTag).innerHTML = 'Please enter numeric in' + columnlength[i].FieldDisplayName;
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
                                alert("Please enter.." + columnlength[i].FieldDisplayName);
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
                                alert("Please enter.." + columnlength[i].FieldDisplayName);
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

                            if ($("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value') === "" || $("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value') === undefined || $("#" + columnlength[i].FieldName).dxSelectBox("instance").option('value') === null) {
                                alert("Please select.." + columnlength[i].FieldDisplayName);
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

                var jsonObjectsLedgerMasterRecord = [];
                var OperationLedgerMasterRecord = {};

                OperationLedgerMasterRecord.LedgerName = document.getElementById("MasterName").innerHTML.trim();
                OperationLedgerMasterRecord.LedgerType = document.getElementById("MasterName").innerHTML.trim();
                OperationLedgerMasterRecord.LedgerGroupID = document.getElementById("MasterID").innerHTML.trim();

                var jsonObjectsLedgerMasterDetailRecord = [];
                var OperationLedgerMasterDetailRecord = {};

                for (var j = 0; j < columnlength.length; j++) {
                    OperationLedgerMasterDetailRecord = {};

                    OperationLedgerMasterDetailRecord.FieldName = columnlength[j].FieldName.trim();
                    OperationLedgerMasterDetailRecord.ParentFieldName = columnlength[j].FieldName.trim();

                    if (columnlength[j].FieldType === "text" || columnlength[j].FieldType === "number") {
                        OperationLedgerMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).value.trim().replace(/'/g, '');
                        OperationLedgerMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).value.trim().replace(/'/g, '');
                    }
                    if (columnlength[j].FieldType === "textarea") {
                        OperationLedgerMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).value.trim();
                        OperationLedgerMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).value.trim();
                    }
                    if (columnlength[j].FieldType === "datebox") {
                        OperationLedgerMasterDetailRecord.ParentFieldValue = $("#" + columnlength[j].FieldName).dxDateBox("instance").option('value');
                        OperationLedgerMasterDetailRecord.FieldValue = $("#" + columnlength[j].FieldName).dxDateBox("instance").option('value');
                    }
                    if (columnlength[j].FieldType === "selectbox") {

                        OperationLedgerMasterDetailRecord.ParentLedgerID = 0;
                        // OperationLedgerMasterDetailRecord.ParentLedgerID =$("#" + columnlength[j].FieldName).dxSelectBox("instance").option('value').trim();
                        var pval = $("#" + columnlength[j].FieldName).dxSelectBox("instance").option('value');
                        if (pval !== "" && pval !== "null" && pval !== null && pval !== undefined) {
                            if (isNaN(pval)) {
                                pval = pval.trim();
                            }
                        }
                        OperationLedgerMasterDetailRecord.ParentFieldValue = pval;//text
                        OperationLedgerMasterDetailRecord.FieldValue = pval;//text
                    }
                    if (columnlength[j].FieldType === "tagbox") {

                        OperationLedgerMasterDetailRecord.ParentLedgerID = 0;
                        // OperationLedgerMasterDetailRecord.ParentLedgerID =$("#" + columnlength[j].FieldName).dxSelectBox("instance").option('value').trim();
                        var pval = $("#" + columnlength[j].FieldName).dxTagBox("instance").option('value');
                        if (pval !== "" && pval !== "null" && pval !== null && pval !== undefined) {
                            if (isNaN(pval)) {
                                pval = pval.toString();
                            }
                        }
                        OperationLedgerMasterDetailRecord.ParentFieldValue = pval.toString();//text
                        OperationLedgerMasterDetailRecord.FieldValue = pval.toString();//text
                    }
                    if (columnlength[j].FieldType === "checkbox") {
                        OperationLedgerMasterDetailRecord.ParentFieldValue = document.getElementById(columnlength[j].FieldName).checked;
                        OperationLedgerMasterDetailRecord.FieldValue = document.getElementById(columnlength[j].FieldName).checked;
                    }
                    if (columnlength[j].FieldName.trim() === "LedgerName") {
                        OperationLedgerMasterRecord.LedgerName = OperationLedgerMasterDetailRecord.FieldValue;
                    } else if (columnlength[j].FieldName.trim() === "TallyCode") {
                        OperationLedgerMasterRecord.TallyCode = OperationLedgerMasterDetailRecord.FieldValue;
                    } else if (columnlength[j].FieldName.trim() === "VendorID") {
                        OperationLedgerMasterRecord.VendorID = OperationLedgerMasterDetailRecord.FieldValue;
                    } else if (columnlength[j].FieldName.trim() === "UnderUserID") {
                        OperationLedgerMasterRecord.UnderUserID = OperationLedgerMasterDetailRecord.FieldValue;
                    }
                    OperationLedgerMasterDetailRecord.SequenceNo = j + 1;
                    OperationLedgerMasterDetailRecord.LedgerGroupID = document.getElementById("MasterID").innerHTML.trim();

                    jsonObjectsLedgerMasterDetailRecord.push(OperationLedgerMasterDetailRecord);

                }


                // FOR SUPPLIER AND VENDOR ONLY for item allocation

                if (document.getElementById("MasterID").innerHTML.trim() == "2" || document.getElementById("MasterID").innerHTML.trim() == "8") {
                    OperationLedgerMasterDetailRecord = {}
                    OperationLedgerMasterDetailRecord.FieldName = 'SelectedItemIds';
                    OperationLedgerMasterDetailRecord.ParentFieldName = 'SelectedItemIds';

                    OperationLedgerMasterDetailRecord.ParentFieldValue = ItemSelectionKeys.toString();//text
                    OperationLedgerMasterDetailRecord.FieldValue = ItemSelectionKeys.toString();//text
                    OperationLedgerMasterDetailRecord.SequenceNo = jsonObjectsLedgerMasterDetailRecord.length + 1;
                    OperationLedgerMasterDetailRecord.LedgerGroupID = document.getElementById("MasterID").innerHTML.trim();

                    jsonObjectsLedgerMasterDetailRecord.push(OperationLedgerMasterDetailRecord);
                }



                jsonObjectsLedgerMasterRecord.push(OperationLedgerMasterRecord);
                var CostingDataLedgerMaster = JSON.stringify(jsonObjectsLedgerMasterRecord);
                var CostingDataLedgerDetailMaster = JSON.stringify(jsonObjectsLedgerMasterDetailRecord);

                /*
                 * Concern Person data save start
                 * */
                var GridPerson = $("#GridPerson").dxDataGrid("instance");
                var jsonObjectsSlabDetailRecord = [];
                var OperationSlabDetailRecord = {};

                var jsonObjectsSlabDetailRecordUpadate = [];
                var OperationSlabDetailRecordUpadate = {};
                var CostingDataSlab = [], CostingDataSlabUpdate = [];
                var GridDataSource = GridPerson._options.dataSource;

                for (var k = 0; k < GridDataSource.length; k++) {
                    OperationSlabDetailRecord = {};
                    OperationSlabDetailRecordUpadate = {};
                    if (GblStatus === "" || GridDataSource[k].ConcernPersonID === "" || GridDataSource[k].ConcernPersonID === null || GridDataSource[k].ConcernPersonID === undefined) {
                        OperationSlabDetailRecord.Name = GridDataSource[k].Name;
                        OperationSlabDetailRecord.Mobile = GridDataSource[k].Mobile;
                        OperationSlabDetailRecord.Email = GridDataSource[k].Email;
                        OperationSlabDetailRecord.Designation = GridDataSource[k].Designation;
                        OperationSlabDetailRecord.IsPrimaryConcernPerson = GridDataSource[k].IsPrimaryConcernPerson;
                        OperationSlabDetailRecord.SalesCordinatorID = GridDataSource[k].SalesCordinatorID;
                        OperationSlabDetailRecord.SalesPersonId = GridDataSource[k].LedgerIDSE;

                        jsonObjectsSlabDetailRecord.push(OperationSlabDetailRecord);
                    } else {
                        OperationSlabDetailRecordUpadate.ConcernPersonID = GridDataSource[k].ConcernPersonID;
                        OperationSlabDetailRecordUpadate.Name = GridDataSource[k].Name;
                        OperationSlabDetailRecordUpadate.Mobile = GridDataSource[k].Mobile;
                        OperationSlabDetailRecordUpadate.Email = GridDataSource[k].Email;
                        OperationSlabDetailRecordUpadate.Designation = GridDataSource[k].Designation;
                        OperationSlabDetailRecordUpadate.IsPrimaryConcernPerson = GridDataSource[k].IsPrimaryConcernPerson;
                        OperationSlabDetailRecordUpadate.SalesCordinatorID = GridDataSource[k].SalesCordinatorID;
                        OperationSlabDetailRecordUpadate.SalesPersonId = GridDataSource[k].LedgerIDSE;
                        jsonObjectsSlabDetailRecordUpadate.push(OperationSlabDetailRecordUpadate);
                    }
                }

                CostingDataSlab = JSON.stringify(jsonObjectsSlabDetailRecord);
                CostingDataSlabUpdate = JSON.stringify(jsonObjectsSlabDetailRecordUpadate);

                /* Concern Person End Save
                 * */

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
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                        if (GblStatus === "Update") {
                            $.ajax({
                                type: "POST",
                                url: "WebService_LedgerMaster.asmx/UpdateData",
                                data: '{CostingDataLedgerMaster:' + CostingDataLedgerMaster + ',CostingDataLedgerDetailMaster:' + CostingDataLedgerDetailMaster + ',MasterName:' + JSON.stringify(MasterName) + ',LedgerID:' + JSON.stringify(document.getElementById("txtGetGridRow").value) + ',UnderGroupID:' + JSON.stringify(UnderGroupID) + ',ActiveLedger:' + JSON.stringify(document.getElementById("Isactivledgerstatic").checked) + ',CostingDataSlab:' + CostingDataSlab + ',CostingDataSlabUpdate:' + CostingDataSlabUpdate + ',ItemStringArray:' + JSON.stringify(ItemSelectionKeys.toString()) + '}',
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
                                        swal("Updated!", "Your data has been updated successfully", "success");
                                        $("#ShowListButton").click();
                                        $("#largeModal").modal('hide');
                                        $("#ListIfItemsGrid").dxDataGrid({
                                            dataSource: []
                                        })
                                        ItemSelectionKeys = "";
                                    } else if (res.includes("not authorized")) {
                                        swal("Access Denied..!", res, "error");
                                    } else if (res.includes("Error:")) {
                                        swal("Error..!", res, "error");
                                    }
                                },
                                error: function errorFunc(jqXHR) {
                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    swal("Error!", "Please try after some time..", "");
                                }
                            });
                        } else {
                            $.ajax({
                                type: "POST",
                                url: "WebService_LedgerMaster.asmx/SaveData",
                                data: '{CostingDataLedgerMaster:' + CostingDataLedgerMaster + ',CostingDataLedgerDetailMaster:' + CostingDataLedgerDetailMaster + ',MasterName:' + JSON.stringify(MasterName) + ',ActiveLedger:' + JSON.stringify(document.getElementById("Isactivledgerstatic").checked) + ',LedgerGroupID:' + JSON.stringify(document.getElementById("MasterID").innerHTML.trim()) + ',CostingDataSlab:' + CostingDataSlab + ',ItemStringArray:' + JSON.stringify(ItemSelectionKeys) + '}',
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
                                        swal("Saved!", "Your data has been saved successfully", "success");
                                        location.reload();
                                    } else if (res.includes("not authorized")) {
                                        swal("Access Denied..!", res, "error");
                                    } else if (res.includes("Error:")) {
                                        swal("Error..!", res, "error");
                                    } else if (res === "Duplicate data found") {
                                        swal("Duplicate!", "Your data already exist..!", "");
                                    }
                                },
                                error: function errorFunc(jqXHR) {
                                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                                    swal("Error!", "Please try after some time..", "");
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

    var SetColumn = "", DynamicCol = {};
    DynamicColPush = [];
    HideColumn = "";
    VisibleTab = "";
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        try {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/MasterGridColumnHide",
                data: '{masterID:' + JSON.stringify(masterID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    // HideColumn = JSON.parse(res);
                    var RES1 = JSON.parse(res);
                    HideColumn = RES1[0].GridColumnHide;
                    VisibleTab = RES1[0].TabName;
                    ConcernPerson = RES1[0].ConcernPerson;
                    if (ConcernPerson === true) {
                        $("#btnConcernPerson").removeClass("hidden");
                    } else {
                        $("#btnConcernPerson").addClass("hidden");
                    }

                    if (RES1[0].EmployeeMachineAllocation === true) {
                        $("#btnMachineAllo").removeClass("hidden");
                    } else {
                        $("#btnMachineAllo").addClass("hidden");
                    }

                    if (masterID == 8) { //ASSOCIATE PARTNER
                        $("#btnApMachineAllo").removeClass("hidden");
                    } else {
                        $("#btnApMachineAllo").addClass("hidden");
                    }

                    if (masterID == 2 || masterID == 8) { //Supplier and AP for Item Allocation
                        $("#btnAllocateItems").removeClass("hidden");
                    } else {
                        $("#btnAllocateItems").addClass("hidden");
                    }
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

            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/MasterGridColumn",
                data: '{masterID:' + JSON.stringify(masterID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
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
                            if (Colobj.toString().toUpperCase().indexOf(" AS ") === -1) {
                                DynamicCol.dataField = Colobj;
                                DynamicCol.maxWidth = 120;
                            } else {
                                var colDataField = Colobj.split(' As ');
                                var colCaption = colDataField[1];
                                DynamicCol.dataField = colDataField[0];
                                DynamicCol.maxWidth = 120;
                                DynamicCol.caption = colCaption;
                            }
                            DynamicColPush.push(DynamicCol);
                        }
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

    GblStatus = "Update";
    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("BtnSaveAS").disabled = "";

    document.getElementById("Isactivledgerstatic_Div").style.display = "block";

    var MasterName = document.getElementById("MasterName").innerHTML;
    var txtGetGridRow = document.getElementById("txtGetGridRow").value;

    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    $.ajax({
        async: false,
        type: "POST",
        url: "WebService_LedgerMaster.asmx/MasterGridLoadedData",
        data: '{masterID:' + JSON.stringify(UnderGroupID) + ',Ledgerid:' + JSON.stringify(txtGetGridRow) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(2);
            res = res.slice(0, -2);
            try {

                var LoadedData = JSON.parse(res);

                if (LoadedData["ISLedgerActive"] === "True") {
                    document.getElementById("Isactivledgerstatic").checked = true;
                }
                else {
                    document.getElementById("Isactivledgerstatic").checked = false;
                }

                for (var e = 0; e < GBLField.length; e++) {

                    if (GBLField[e].FieldType === "text") {
                        document.getElementById(GBLField[e].FieldName).value = LoadedData[GBLField[e].FieldName] == undefined ? '' : LoadedData[GBLField[e].FieldName];
                    }
                    else if (GBLField[e].FieldType === "number") {
                        document.getElementById(GBLField[e].FieldName).value = Number(LoadedData[GBLField[e].FieldName] == undefined ? 0 : LoadedData[GBLField[e].FieldName]);
                    }
                    else if (GBLField[e].FieldType === "textarea") {
                        document.getElementById(GBLField[e].FieldName).value = LoadedData[GBLField[e].FieldName] == undefined ? '' : LoadedData[GBLField[e].FieldName];
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
                        if (LoadedData[GBLField[e].FieldName] === null || LoadedData[GBLField[e].FieldName] === "-") continue;
                        $("#" + GBLField[e].FieldName).dxDateBox({
                            value: LoadedData[GBLField[e].FieldName]
                        });
                    }
                    else if (GBLField[e].FieldType === "selectbox") {
                        var UPSID = "#" + GBLField[e].FieldName;

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
                    else if (GBLField[e].FieldType === "tagbox") {
                        var UPSID = "#" + GBLField[e].FieldName;

                        var selValue = "";
                        if (isNaN(LoadedData[GBLField[e].FieldName])) {
                            selValue = LoadedData[GBLField[e].FieldName];
                        }
                        else {
                            selValue = JSON.parse(LoadedData[GBLField[e].FieldName]);
                        }

                        $(UPSID).dxTagBox({
                            value: selValue.split(',')
                        });

                    }
                }
                $('#ListIfItemsGrid').dxDataGrid('instance').clearSelection();
                ItemSelectionKeys = "";
                if (LoadedData.SelectedItemIds != undefined)
                    ItemSelectionKeys = LoadedData.SelectedItemIds.split(',');
                $("#ListIfItemsGrid").dxDataGrid({
                    selectedRowKeys: ItemSelectionKeys
                });
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            } catch (e) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
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

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/CheckPermission",
        data: '{LedgerID:' + JSON.stringify(txtGetGridRow) + '}',
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
            if (res === "Exist") {
                swal("", "This ledger is used in another process..! Record can not be delete.", "error");
                return false;
            }
            else {
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this ledger!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: true
                }, function () {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                    $.ajax({
                        type: "POST",
                        url: "WebService_LedgerMaster.asmx/DeleteData",
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
                                swal("Deleted!", "Your Content has been deleted.", "success");
                                location.reload();
                            }

                        },
                        error: function errorFunc(jqXHR) {
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            alert(jqXHR);
                        }
                    });
                });
            }
        }, error: function (e) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            console.log(e);
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
        url: "WebService_LedgerMaster.asmx/DrillDownMasterGrid",
        data: '{masterID:' + JSON.stringify(masterID) + ',TabID:' + JSON.stringify(dr.id) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);

            var RES1 = [];
            if (res === "") { RES1 = []; } else RES1 = JSON.parse(res);

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
    // document.getElementById("txtGetGridRow").value = "";
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
                    pickerType: "rollers",
                    formate: 'date',
                    value: new Date().toISOString().substr(0, 10),
                    formatString: 'dd-MMM-yyyy'
                });
            }
            if (GBLField[i].FieldType === "selectbox") {
                $("#" + GBLField[i].FieldName).dxSelectBox({
                    value: ''
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
    //if (isNaN(x)) {
    //document.getElementById(getValid).style.display = "block";
    //document.getElementById(getValid).innerHTML = 'This field must have alphanumeric characters only';
    //document.getElementById(FC.id).value = "";
    //document.getElementById(FC.id).focus();
    //return false;

    //}
    //else {
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
        var StrVar = "", fillValue = "";
        for (var t = 0; t < CreateVar.length; t++) {
            if (t === 0) {
                holdvalue = CreateVar[t];
            } else {
                if (MakeObj === "" || MakeObj === undefined || MakeObj === null) {
                    fillValue = document.getElementById(CreateVar[t]).value;
                    StrVar = "";
                    if (isNaN(fillValue)) {
                        StrVar = '"' + fillValue + '"';
                    } else {
                        StrVar = Number(fillValue);
                    }
                    MakeObj += CreateVar[t] + '=' + StrVar;
                } else {
                    fillValue = document.getElementById(CreateVar[t]).value;
                    StrVar = "";
                    if (isNaN(fillValue)) {
                        StrVar = '"' + fillValue + '"';
                    } else {
                        StrVar = Number(fillValue);
                    }
                    MakeObj += ',' + CreateVar[t] + '=' + StrVar;
                }

            }
        }
        getFormula = "";
        var addstr = "Formula" + FC.id;
        getFormula = document.getElementById(addstr).innerHTML;

        var NextFarmula = getFormula.toLowerCase().includes("and");
        if (NextFarmula === true) {
            getFormula = getFormula.split('and');
            getFormula = getFormula[z];
        }
        ApplyOperation(MakeObj);
    }

}
//}

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
    //var getFormula = "PaperSize=SizeW CONC SizeL";

    getFormula = getFormula.split('=');
    getFormula = getFormula[1];


    var getFormulaConc = getFormula.replace(/conc/g, ',');
    getFormulaConc = getFormulaConc.replace(/CONC/g, ',');
    getFormulaConc = getFormulaConc.split(',');

    if (getFormulaConc.length > 1) {
        var concanate = getFormulaConc;
        var Concstrng = "";

        Concat(concanate);
    } else {
        getFormula = getFormula.replace(/u0027/g, "'");
        var CalResult = "return " + getFormula;

        if (doc === "") {
            doc = "function GetResLedger(){" + CalResult + ";}";
        } else {
            doc = doc + "; function GetResLedger(){" + CalResult + ";}";
        }

        eval(doc);

        var ResultsValue = GetResLedger();
        SetLedgerFieldValue(holdvalue, ResultsValue);
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

function SetLedgerFieldValue(name, value) {
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

//////////////////////////////////////////////////////////////////Get Concern Person////////////////////////////////////////
var existCocernPerson = [], ObjConcernPerson = [];
var newArray = [];
function ExistCosernPerson() {
    var txtGetGridRow = document.getElementById("txtGetGridRow").value;
    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) return;

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GetExistCocrnPerson",
        data: '{LID:' + txtGetGridRow + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RESS = JSON.parse(res);
            $("#GridPerson").dxDataGrid({ dataSource: RESS });
        }
    });
}


//var ObjDesignation = "";
//function ExistDesignation() {
//    $.ajax({
//        type: "POST",
//        url: "WebService_LedgerMaster.asmx/GetConcernPersonNameDesignation",
//        data: '{}',
//        contentType: "application/json; charset=utf-8",
//        dataType: "text",
//        success: function (results) {
//            ////console.debug(results);
//            var res = results.replace(/\\/g, '');
//            res = res.replace(/"d":""/g, '');
//            res = res.replace(/""/g, '');
//            res = res.substr(1);
//            res = res.slice(0, -1);
//            ObjDesignation = JSON.parse(res);

//        }
//    });
//}

$("#btnConvertToConsignee").click(function () {
    var LID = Number(document.getElementById("txtGetGridRow").value);
    if (LID === null || LID <= 0 || LID === undefined) {
        DevExpress.ui.notify("Please select client first..!", "warning", 2000);
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/ConvertLedgerToConsignee",
        data: '{LedID:' + LID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = JSON.parse(results);
            if (res.d === "Success") {
                DevExpress.ui.notify("Consignee created successfully", "success", 2000);
            } else
                DevExpress.ui.notify(res.d, "error", 2500);
        }
    });
});

$("#btnConcernPerson").click(function () {

    document.getElementById("ConcernPersonBtnDeletePopUp").disabled = false;
    if (GblStatus === "") {
        document.getElementById("ConcernPersonBtnDeletePopUp").disabled = true;
        $("#GridPerson").dxDataGrid({ dataSource: [] });
    }

    if (document.getElementById("MasterName").innerHTML == "ASSOCIATE PARTNER" || document.getElementById("MasterName").innerHTML == "SUPPLIERS") {
        $("#GridPerson").dxDataGrid({
            columns: [
                { dataField: "Name", visible: true, caption: "Name", validationRules: [{ type: "required" }] },
                { dataField: "Designation", visible: true, caption: "Designation" },
                {
                    dataField: "Mobile", visible: true, caption: "Mobile No",
                    validationRules: [{ type: "required" }, {
                        type: "numeric",
                        message: 'You must enter only numeric value..!'
                    }]
                },
                { dataField: "Email", visible: true, caption: "Email", validationRules: [{ type: "required" }, { type: "email" }] },
                {
                    dataField: "SalesCordinatorID", visible: false, caption: "Sales Cordinator",
                    lookup: {
                        dataSource: SalesCordiantorArray,
                        displayExpr: "LedgerName",
                        valueExpr: "SalesCordinatorID",

                    }
                },
                {
                    dataField: "LedgerIDSE", visible: false, caption: "POC",
                    lookup: {
                        dataSource: SALESEXECUTIVEARRAY,
                        displayExpr: "LedgerName",
                        valueExpr: "LedgerIDSE",

                    }
                },
                { dataField: "IsPrimaryConcernPerson", visible: true, caption: "Is Primary ConcernPerson", dataType: "boolean" }
            ],
        });
    }

    document.getElementById("btnConcernPerson").setAttribute("data-toggle", "modal");
    document.getElementById("btnConcernPerson").setAttribute("data-target", "#ConcernPersonModal");
});

$("#GridPerson").dxDataGrid({
    dataSource: [],
    columns: [
        { dataField: "Name", visible: true, caption: "Name", validationRules: [{ type: "required" }] },
        { dataField: "Designation", visible: true, caption: "Designation" },
        {
            dataField: "Mobile", visible: true, caption: "Mobile No",
            validationRules: [{ type: "required" }, {
                type: "numeric",
                message: 'You must enter only numeric value..!'
            }]
        },
        { dataField: "Email", visible: true, caption: "Email", validationRules: [{ type: "required" }, { type: "email" }] },
        {
            dataField: "LedgerID", visible: true, caption: "Sales Cordinator",
            lookup: {
                dataSource: SalesCordiantorArray,
                displayExpr: "LedgerName",
                valueExpr: "LedgerID",
                load: function (e) {
                    console.log(e);
                }
            }
        },
        {
            dataField: "LedgerIDSE", visible: true, caption: "Sales Excutive",
            lookup: {
                dataSource: SALESEXECUTIVEARRAY,
                displayExpr: "LedgerName",
                valueExpr: "LedgerID",
                load: function (e) {
                    console.log(e);
                }
            }
        },
        { dataField: "IsPrimaryConcernPerson", visible: true, caption: "Is Primary ConcernPerson", dataType: "boolean" }
    ],
    showBorders: true,
    paging: {
        enabled: false
    },
    height: function () {
        return window.innerHeight / 1.5;
    },
    showRowLines: true,

    editing: {
        mode: "row",
        allowDeleting: true,
        allowAdding: true,
        allowUpdating: true,
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);

    },
    export: {
        enabled: true,
        fileName: "Contact Person",
        allowExportSelectedData: true
    },
    onRowUpdating: function (e) {
        for (var k = 0; k < e.component._options.dataSource.length; k++) {
            if (e.component._options.dataSource[k].IsPrimaryConcernPerson === true) {
                e.component._options.dataSource[k].IsPrimaryConcernPerson = false;
            }
        }
    },

    onRowRemoving: function (select) {
        var txtGetGridRow = document.getElementById("txtGetGridRow").value;
        if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) return false;

        $.ajax({
            type: "POST",
            url: "WebService_LedgerMaster.asmx/DeleteConcernPersonDataGridRow",
            data: '{ConcernPersonID:' + JSON.stringify(select.key.ConcernPersonID) + ',LedgerID:' + JSON.stringify(txtGetGridRow) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
            }
        });
    },


});

$("#ConcernPersonBtnDeletePopUp").click(function () {
    var txtGetGridRow = document.getElementById("txtGetGridRow").value;
    if (txtGetGridRow === "" || txtGetGridRow === undefined || txtGetGridRow === null) {
        swal("", "Please select client from the given below list..");
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this concern person!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/DeleteConcernPersonData",
                data: '{LedgerID:' + JSON.stringify(txtGetGridRow) + '}',
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
                        swal("Deleted!", "Your data deleted", "success");
                        location.reload();
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });
});

//////////////////////////////////////////////////////////////////Get Operator Machine Allocation////////////////////////////////////////

var Objid = [];

$("#btnApMachineAllo").click(function () {
    var txtGetGridRow = Number(document.getElementById("txtGetGridRow").value);
    if (txtGetGridRow <= 0 || txtGetGridRow === null) {
        swal("", "Please select associate partner from the given below list..");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/VendorMachineGrid",
        data: '{VendorID:0}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:}/g, ':null}');
            res = res.substr(1);
            res = res.slice(0, -1);
            var DM = JSON.parse(res);

            $("#selMachine").dxSelectBox({
                items: DM,
                placeholder: "Select..",
                displayExpr: 'MachineName',
                valueExpr: 'MachineID',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (data) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                    $.ajax({
                        type: "POST",
                        url: "WebService_LedgerMaster.asmx/ExistSlab",
                        data: '{Machineid:' + JSON.stringify(data.value) + ',VendorID:' + JSON.stringify(txtGetGridRow) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, '&');
                            res = res.replace(/:,/g, ':null,');
                            res = res.replace(/:}/g, ':null}');
                            res = res.substr(1);
                            res = res.slice(0, -1);

                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            Slabgrid(JSON.parse(res));
                        }
                    });

                }
            });
        }
    });

    document.getElementById("btnApMachineAllo").setAttribute("data-toggle", "modal");
    document.getElementById("btnApMachineAllo").setAttribute("data-target", "#APMachineAllocationModal");
});

$("#btnMachineAllo").click(function () {
    document.getElementById("MachineAllocationBtnDeletePopUp").disabled = true;

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GetOperatorName",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var DM = JSON.parse(res);

            $("#selEmployetName").dxSelectBox({
                items: DM,
                placeholder: "Select..",
                displayExpr: 'LedgerName',
                valueExpr: 'LedgerID',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (data) {
                    Objid = [];
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                    $.ajax({
                        type: "POST",
                        url: "WebService_LedgerMaster.asmx/ExistMachineID",
                        data: '{EmployeeID:' + JSON.stringify(data.value) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0027/g, "'");
                            res = res.replace(/"/g, '');
                            res = res.replace(/MachineIDString:/g, '');
                            res = res.substr(3);
                            res = res.slice(0, -3);

                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            var IDString = res;
                            if (IDString === "" || IDString === null || IDString === undefined) {
                                document.getElementById("MachineAllocationBtnDeletePopUp").disabled = true;
                                Objid = [];
                            }
                            else {
                                document.getElementById("MachineAllocationBtnDeletePopUp").disabled = false;
                                var selectMIDSplit = IDString.split(',');
                                for (var s in selectMIDSplit) {
                                    Objid.push(selectMIDSplit[s]);
                                }
                            }
                            GblMachine(data.value);
                        }
                    });

                }
            });
        }
    });

    document.getElementById("btnMachineAllo").setAttribute("data-toggle", "modal");
    document.getElementById("btnMachineAllo").setAttribute("data-target", "#MachineAllocationModal");
});

function GblMachine(VendorID) {
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/VendorMachineGrid",
        data: '{VendorID:' + JSON.stringify(VendorID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            MachineGrid(JSON.parse(res));
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function MachineGrid(MachiGrid) {
    $("#GridMachineAllocation").dxDataGrid({
        // dataSource: MachiGrid,
        dataSource: {
            store: {
                type: "array",
                key: "MachineID",
                data: MachiGrid
            }
        },
        sorting: {
            mode: "multiple"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "multiple" },
        filterRow: { visible: true, applyFilter: "auto" },
        //height: 600,
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [15, 25, 50, 100]
        },
        // scrolling: { mode: 'virtual' },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "MachineName", caption: "Machine Name" },
            { dataField: "DepartmentName", caption: "Department Name" }],
        selectedRowKeys: Objid,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            if (data.length > 0) {
                $("#MachineId").text(
                    $.map(data, function (value) {
                        return value.MachineID;    //alert(value.ProcessId);
                    }).join(','));
            }
            else {
                $("#MachineId").text("");
            }
        }
    });
}

function Slabgrid(existslab) {
    $("#GridMachineSlab").dxDataGrid({
        dataSource: existslab,
        showBorders: true,
        paging: {
            enabled: false
        },
        showRowLines: true,
        sorting: {
            mode: "none"
        },
        filterRow: { visible: true, applyFilter: "auto" },
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowAdding: true,
            allowUpdating: true
        },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            {
                dataField: "PaperGroup", visible: true, caption: "Paper Group", width: 200,
                validationRules: [{ type: "required" }, {
                    type: "required",
                    message: 'Paper Group is Required'
                }]
            },
            {
                dataField: "SizeW", visible: true, caption: "Size W", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SizeL", visible: true, caption: "Size L", width: 80,
                validationRules: [{
                    type: "required"
                }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeFrom", visible: true, caption: "Sheet From", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeTo", visible: true, caption: "Sheet To", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "MinCharges", visible: true, caption: "Min Charges", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Rate", visible: true, caption: "Rate", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric OR decimal value..!'
                }]
            },
            {
                dataField: "PlateCharges", visible: true, caption: "CTP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "PSPlateCharges", visible: true, caption: "PS", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "CTCPPlateCharges", visible: true, caption: "CTCP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Wastage", visible: true, caption: "Wastage", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorFrontCharges", visible: true, caption: "SP.Color F", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorBackCharges", visible: true, caption: "SP.Color B", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            }
        ]
    });
}

$("#MachineAllocationBtnSave").click(function () {
    var GridRow = "";

    var alertTag = "ValStrEmployetName";
    if ($("#selEmployetName").dxSelectBox("instance").option('value') === "" || $("#selEmployetName").dxSelectBox("instance").option('value') === undefined || $("#selEmployetName").dxSelectBox("instance").option('value') === null) {
        alert("Please select Name..");
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Name';

        return false;
    }
    else {
        alertTag = "ValStrEmployetName";
        document.getElementById(alertTag).style.display = "none";
    }

    var jsonObjectsMachineAllocationDetailRecord = [];
    var OperationMachineAllocationDetailRecord = {};

    var CostingDataMachinAllocation = [];

    var txtMID = $("#MachineId").text();

    if (txtMID === "null") {
        GridRow = JSON.stringify(Objid);
        GridRow = GridRow.replace(/"/g, '');
        GridRow = GridRow.substr(1);
        GridRow = GridRow.slice(0, -1);
    }
    else if (txtMID === "" || txtMID === null || txtMID === undefined) {
        GridRow = "";
    }
    else {
        GridRow = txtMID;
    }

    var finalString = GridRow;
    if (GridRow !== "") {
        GridRow = GridRow.split(',');
        if (GridRow.length > 0) {
            for (var m = 0; m < GridRow.length; m++) {
                OperationMachineAllocationDetailRecord = {};
                OperationMachineAllocationDetailRecord.LedgerID = $("#selEmployetName").dxSelectBox("instance").option('value');
                OperationMachineAllocationDetailRecord.MachineID = GridRow[m];

                jsonObjectsMachineAllocationDetailRecord.push(OperationMachineAllocationDetailRecord);
            }

            CostingDataMachinAllocation = JSON.stringify(jsonObjectsMachineAllocationDetailRecord);
        }
    }
    else {
        CostingDataMachinAllocation = JSON.stringify(CostingDataMachinAllocation);
    }
    //alert(CostingDataMachinAllocation);

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

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/SaveEmpMachineAllocation",
                data: '{CostingDataMachinAllocation:' + CostingDataMachinAllocation + ',EmployeID:' + JSON.stringify($("#selEmployetName").dxSelectBox("instance").option('value')) + ',GridRow:' + JSON.stringify(finalString) + '}',//
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
                        swal("Saved!", "Your data saved", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        //location.reload();
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                    alert(jqXHR);
                }
            });
        });
});

$("#BtnSaveAPMachineAllocation").click(function () {
    var machineid = $("#selMachine").dxSelectBox("instance").option('value');
    if (machineid === "" || machineid <= 0 || machineid === null) {
        swal("Please select machine..");
        return false;
    }
    var txtGetGridRow = Number(document.getElementById("txtGetGridRow").value);
    if (txtGetGridRow <= 0 || txtGetGridRow === null) {
        swal("", "Please select associate partner from the given below list..");
        return false;
    }

    var ObjPrintingRateSetting = [];
    var PrintingRate = {};

    var PrintingRateSetting = $('#GridMachineSlab').dxDataGrid('instance');
    for (var i = 0; i < PrintingRateSetting._options.dataSource.length; i++) {
        PrintingRate = {};
        PrintingRate.MachineID = machineid;
        PrintingRate.LedgerID = txtGetGridRow;
        PrintingRate.PaperGroup = PrintingRateSetting._options.dataSource[i].PaperGroup;
        PrintingRate.MaxPlanW = Number(PrintingRateSetting._options.dataSource[i].SizeW);
        PrintingRate.MaxPlanL = Number(PrintingRateSetting._options.dataSource[i].SizeL);

        PrintingRate.SheetRangeFrom = Number(PrintingRateSetting._options.dataSource[i].SheetRangeFrom);
        PrintingRate.SheetRangeTo = Number(PrintingRateSetting._options.dataSource[i].SheetRangeTo);
        PrintingRate.Rate = parseFloat(PrintingRateSetting._options.dataSource[i].Rate).toFixed(3);
        PrintingRate.PlateCharges = parseFloat(PrintingRateSetting._options.dataSource[i].PlateCharges).toFixed(2);
        PrintingRate.MinCharges = Number(PrintingRateSetting._options.dataSource[i].MinCharges);
        PrintingRate.PSPlateCharges = Number(PrintingRateSetting._options.dataSource[i].PSPlateCharges);
        PrintingRate.CTCPPlateCharges = Number(PrintingRateSetting._options.dataSource[i].CTCPPlateCharges);
        PrintingRate.Wastage = Number(PrintingRateSetting._options.dataSource[i].Wastage);
        PrintingRate.SpecialColorFrontCharges = parseFloat(PrintingRateSetting._options.dataSource[i].SpecialColorFrontCharges).toFixed(2);
        PrintingRate.SpecialColorBackCharges = parseFloat(PrintingRateSetting._options.dataSource[i].SpecialColorBackCharges).toFixed(2);
        PrintingRate.SlabID = i + 1;
        ObjPrintingRateSetting.push(PrintingRate);
    }

    swal({
        title: "Saving Slabs.....?",
        text: "Do you want to continue to save?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/SaveAPMachineRateSlabs",
                data: '{machineSlabs:' + JSON.stringify(ObjPrintingRateSetting) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (results.d === "Success") {
                        swal("Saved!", "Your data saved", "success");
                        $("#selMachine").dxSelectBox({ value: null });
                    } else {
                        swal("Not Saved!", results.d, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                }
            });
        });
});

$("#MachineAllocationBtnNew").click(function () {
    $("#selEmployetName").dxSelectBox({ value: null });
    Objid = [];
    GblMachine("");
});

$("#MachineAllocationBtnDeletePopUp").click(function () {

    var selEmployetName = $("#selEmployetName").dxSelectBox("instance").option('value');
    var alertTag = "ValStrEmployetName";

    if (selEmployetName === "" || selEmployetName === undefined || selEmployetName === null) {
        alert("Please select name..");
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty.. Name';
        return false;
    }
    else {
        document.getElementById(alertTag).style.display = "none";
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Content!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/DeleteEmpMacineAllo",
                data: '{LedgerID:' + JSON.stringify(selEmployetName) + '}',
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
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });
});


//Supplier wise ItemGroup Allocation
var SuppObjid = [];
var GroupAlloGrid = [];
$("#btnItemGroupAllo").click(function () {
    document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = true;
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GetSupplierName",
        data: '{LedgerGrNID:' + JSON.stringify(LedgerGrNID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var SuppName = JSON.parse(res);
            var SupplierID = Number(document.getElementById("txtGetGridRow").value);

            $("#selSuppName").dxSelectBox({
                items: SuppName,
                placeholder: "Select..",
                displayExpr: 'LedgerName',
                valueExpr: 'LedgerID',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (data) {
                    SuppObjid = [];

                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                    GetExistSpareGrpString(data.value);
                    $.ajax({
                        type: "POST",
                        url: "WebService_LedgerMaster.asmx/ExistGroupID",
                        data: '{SupplierID:' + JSON.stringify(data.value) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0027/g, "'");
                            res = res.replace(/"/g, '');
                            res = res.replace(/GroupAllocationIDString:/g, '');
                            res = res.substr(3);
                            res = res.slice(0, -3);

                            var IDString = res;

                            if (IDString === "" || IDString === null || IDString === undefined) {
                                document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = true;
                                SuppObjid = [];
                            }
                            else {
                                document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = false;
                                var selectMIDSplit = IDString.split(',');
                                for (var s in selectMIDSplit) {
                                    SuppObjid.push(selectMIDSplit[s]);
                                }
                            }
                            GblGroupAllocation();
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        }
                    });
                }
            });
            if (SupplierID > 0 && SupplierID !== undefined) {
                $("#selSuppName").dxSelectBox({ value: SupplierID });
            } else {
                $("#selSuppName").dxSelectBox({ value: null });
            }
        }
    });

    document.getElementById("btnItemGroupAllo").setAttribute("data-toggle", "modal");
    document.getElementById("btnItemGroupAllo").setAttribute("data-target", "#ItemGoupAllocationModal");
});

function GblGroupAllocation() {
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GroupGrid",
        data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            GroupAlloGrid = JSON.parse(res);
            GroupAllocationGrid();
        }
    });

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/SpareGroupGrid",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var SpareGroupAlloGrid = JSON.parse(res);
            $("#GridSpareGroupAllocation").dxDataGrid({ dataSource: SpareGroupAlloGrid });
        }
    });
}

function GroupAllocationGrid() {
    $("#GridItemGoupAllocation").dxDataGrid({
        // dataSource: GroupAlloGrid,
        dataSource: {
            store: {
                type: "array",
                key: "ItemGroupID",
                data: GroupAlloGrid
            }
        },
        sorting: {
            mode: "multiple"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "multiple" },
        filterRow: { visible: true, applyFilter: "auto" },
        height: function () {
            return window.innerHeight / 2;
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [15, 25, 50, 100]
        },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "ItemGroupID", visible: false, caption: "ItemGroupID", width: 300 },
            { dataField: "ItemGroupName", visible: true, caption: "Item Group Name" }
        ],
        selectedRowKeys: SuppObjid,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;

            if (data.length > 0) {
                $("#TxtItemGroupNameID").text(
                    $.map(data, function (value) {
                        return value.ItemGroupID;    //alert(value.ProcessId);
                    }).join(','));
            }
            else {
                $("#TxtItemGroupNameID").text("");
            }
        }
    });
}

$("#GridSpareGroupAllocation").dxDataGrid({
    dataSource: [],
    keyExpr: "SparePartGroup",
    sorting: {
        mode: "multiple"
    },
    paging: false,
    showBorders: true,
    showRowLines: true,
    selection: { mode: "multiple" },
    filterRow: { visible: true, applyFilter: "auto" },
    height: function () {
        return window.innerHeight / 2;
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 25, 50, 100]
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "SparePartGroup", visible: true, caption: "Spare Group" }
    ]
});

$("#ItemGroupAllocationBtnSave").click(function () {
    var GridRow = "";
    var alertTag = "ValStrselSuppName";
    var SupplierID = $("#selSuppName").dxSelectBox("instance").option('value');

    if (SupplierID === "" || SupplierID === undefined || SupplierID === null) {
        alert("Please select supplier..");
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..supplier name';
        return false;
    }
    else {
        document.getElementById(alertTag).style.display = "none";
    }

    var jsonObjectsGroupAllocationDetailRecord = [];
    var OperationGroupAllocationDetailRecord = {};

    var CostingDataGroupAllocation = [];

    var txtMID = $("#TxtItemGroupNameID").text();

    if (txtMID === "null") {
        GridRow = JSON.stringify(SuppObjid);
        GridRow = GridRow.replace(/"/g, '');
        GridRow = GridRow.substr(1);
        GridRow = GridRow.slice(0, -1);
    }
    else if (txtMID === "" || txtMID === null || txtMID === undefined) {
        GridRow = "";
    }
    else {
        GridRow = txtMID;
    }

    var finalString = GridRow;

    if (GridRow !== "") {
        GridRow = GridRow.split(',');

        if (GridRow.length > 0) {
            for (var m = 0; m < GridRow.length; m++) {

                OperationGroupAllocationDetailRecord = {};
                OperationGroupAllocationDetailRecord.LedgerID = SupplierID;
                OperationGroupAllocationDetailRecord.ItemGroupID = GridRow[m];

                jsonObjectsGroupAllocationDetailRecord.push(OperationGroupAllocationDetailRecord);
            }

            CostingDataGroupAllocation = jsonObjectsGroupAllocationDetailRecord;
        }
    }

    ///Spare Group
    var GridSpares = $("#GridSpareGroupAllocation").dxDataGrid('instance');
    var GridRowSpareGroups = GridSpares.getSelectedRowsData();

    var SparePartAllocation = {};
    var ObjSparePartAllocation = [];
    for (var i = 0; i < GridRowSpareGroups.length; i++) {
        SparePartAllocation = {};
        SparePartAllocation.LedgerID = SupplierID;
        SparePartAllocation.SparePartGroup = GridRowSpareGroups[i].SparePartGroup;

        ObjSparePartAllocation.push(SparePartAllocation);
    }
    ////

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

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/SaveGroupAllocation",
                data: '{CostingDataGroupAllocation:' + JSON.stringify(CostingDataGroupAllocation) + ',SuppID:' + JSON.stringify(SupplierID) + ',GridRow:' + JSON.stringify(finalString) + ',ObjSparePartAllocation:' + JSON.stringify(ObjSparePartAllocation) + '}',//
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
                        swal("Saved..!", "Your data saved", "success");
                        $("#selSuppName").dxSelectBox({ value: null });
                    } else {
                        swal("Not Saved..!", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                    alert(jqXHR);
                }
            });
        });

});

$("#ItemGroupAllocationBtnNew").click(function () {
    $("#selSuppName").dxSelectBox({ value: null });
    SuppObjid = [];
    GblGroupAllocation();
});

$("#ItemGroupAllocationBtnDeletePopUp").click(function () {

    var selSuppName = $("#selSuppName").dxSelectBox("instance").option('value');
    var alertTag = "ValStrselSuppName";

    if (selSuppName === "" || selSuppName === undefined || selSuppName === null) {
        alert("Please select Name..");
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty.. Name';
        return false;
    }
    else {
        document.getElementById(alertTag).style.display = "none";
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Content!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebService_LedgerMaster.asmx/DeleteGroupAllo",
                data: '{LedgerID:' + JSON.stringify(selSuppName) + '}',
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
                        swal("Deleted!", "Your data Deleted", "success");
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });
});

function GetExistSpareGrpString(SupplierID) {
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/ExistSparesGroupID",
        data: '{SupplierID:' + JSON.stringify(SupplierID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/"/g, '');
            res = res.replace(/IDString:/g, '');
            res = res.substr(3);
            res = res.slice(0, -3);

            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var dataGridInstance = $("#GridSpareGroupAllocation").dxDataGrid("instance");
            dataGridInstance.clearSelection();
            var selectMIDSplit = res.split(',');
            for (var s in selectMIDSplit) {
                if (!dataGridInstance.isRowSelected(selectMIDSplit[s])) {
                    dataGridInstance.selectRows(selectMIDSplit[s], true);
                }
            }
        }
    });
}

function getCountryStateByPincode(pincode) {



    if (pincode.length < 6) {

        return;
    };
    //$("#Country").dxSelectBox({ items: [], value: null, disabled: false });
    $("#State").dxSelectBox({ items: [], value: null, disabled: false });
    $("#City").dxSelectBox({ items: [], value: null });
    $("#District").dxSelectBox({ items: [], value: null });
    var CountryCode = $("#Country").dxSelectBox("instance").option('value');
    //if (CountryCode === null) CountryCode = "IN";
    //const url = "http://api.worldpostallocations.com/pincode?postalcode=" + pincode + "&countrycode=" + CountryCode;
    const url = "https://api.postalpincode.in/pincode/" + pincode
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.getJSON(url, function (data) {

            let values = data[0].PostOffice;
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (data[0].Status === "Success") {
                //var statearr = []
                //statearr.push(values[0].State);

                $("#Country").dxSelectBox({ value: values[0].Country, disabled: true });

                $("#City").dxSelectBox({
                    items: values, displayExpr: "Name", valueExpr: "Name", value: values[0].Name
                });
                $("#State").dxSelectBox({
                    items: [{ "State": values[0].State }],
                    displayExpr: "State",
                    valueExpr: "State",
                    value: values[0].State,

                });
                $("#City").focus();
                document.getElementById
                //$("#State").dxSelectBox({
                //    items: values,
                //    value: values[0].State
                //});

                $("#District").dxSelectBox({ items: [{ "District": values[0].District }], displayExpr: "District", valueExpr: "District", value: values[0].District });
            } else {
                alert("Invalid Pincode or Somthing Went Wrong. Please Try Again")
                $("#Country").dxSelectBox({ items: [], value: null, disabled: false });
                $("#State").dxSelectBox({ items: [], value: null, disabled: false });
                $("#City").dxSelectBox({ items: [], value: null });
                $("#Pincode").dxSelectBox({ items: [], value: null });
                $("#Pincode").focus();
            }

            return;


        }).fail(function () {
            alert("Invalid Pincode or Somthing Went Wrong. Please Try Again")
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        })
    } catch (e) {

        console.log(e);
        alert("Invalid Pincode or Somthing Went Wrong. Please Try Again")
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }

}


$('#btnAllocateItems').click(function () {
    //var data = $('#MasterGrid').dxDataGrid('instance').getSelectedRowsData();
    //if (data.length <= 0) return;
    //var SupplierID = data[0].LedgerID;
    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/GetItemsList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:}/g, ':null}');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res);

            $("#ListIfItemsGrid").dxDataGrid({
                dataSource: RES1,
                selectedRowKeys: ItemSelectionKeys,
                columnAutoWidth: true,
            });
        }
    });

    document.getElementById("btnAllocateItems").setAttribute("data-toggle", "modal");
    document.getElementById("btnAllocateItems").setAttribute("data-target", "#ItemAllocationModal");
})

$('#BtnItmeApply').click(function () {
    var data = $('#ListIfItemsGrid').dxDataGrid('instance').getSelectedRowKeys();
    ItemSelectionKeys = data;
    $('#clodeItmeModal').click();
    $('#ListIfItemsGrid').dxDataGrid('instance').clearSelection();
});


$('#VendorMachineList').click(function () {

    window.open("/VendorMachineAllocation.aspx?id=" + Number(document.getElementById("txtGetGridRow").value),"_blank_");
})