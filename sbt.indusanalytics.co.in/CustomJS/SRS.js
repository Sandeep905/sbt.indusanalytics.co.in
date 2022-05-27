"use strict";
var existRateDATA = [];
var ExistRESS1 = [];
var existRow = [];

var GroupName = "";
var ObjColumnNameDy = [];
var ObjColumnNameDy2 = [];
var ColumnNameDy = {};

$("#SelectBoxSupplierName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var SMID = data.value;

        var GID = $("#SelectBoxItemGroup").dxSelectBox("instance").option('value');

        if (SMID === "" || SMID === undefined || SMID === null || SMID === "null" || SMID === "NULL") {
            document.getElementById("TxtExistid").value = 0;
            document.getElementById("inputdiv").style.display = "none";
            $("#AlocatedList2Grid").dxDataGrid({
                dataSource: []
            });
            $("#SelectBoxItemGroup").dxSelectBox({
                items: []
            });
            return false;
        }
        else {
            getMasterLIST(SMID);
            getSparesPartGroup(SMID);

            if (GID !== "" && GID !== undefined && GID !== null && GID !== "null" && GID !== "NULL") {
                //FillSecondGrid with Exsit Data Supplier name Wise
                document.getElementById("inputdiv").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_SupplierRateSetting.asmx/ExistRate",
                    data: '{Ledgerid:' + JSON.stringify(SMID) + ',GroupID:' + JSON.stringify(GID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/u0026/g, '&');
                        res = res.replace(/:,/g, ':null,');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        ExistRESS1 = [];

                        var FilterRESS1 = JSON.parse(res);
                        var optFilterRESS1 = {};
                        if (FilterRESS1 === [] || FilterRESS1 === "" || FilterRESS1 === undefined || FilterRESS1.length === 0) {
                            document.getElementById("TxtExistid").value = 0;
                            ExistRESS1 = [];
                        } else {
                            document.getElementById("TxtExistid").value = FilterRESS1[0].SupplierWisePurchaseSettingID;
                            for (var f = 0; f < FilterRESS1.length; f++) {
                                optFilterRESS1 = {};
                                optFilterRESS1.SupplierWisePurchaseSettingID = FilterRESS1[f].SupplierWisePurchaseSettingID;
                                optFilterRESS1.ItemID = FilterRESS1[f].ItemID;
                                optFilterRESS1.ItemGroupID = FilterRESS1[f].ItemGroupID;
                                optFilterRESS1.LedgerID = FilterRESS1[f].LedgerID;
                                optFilterRESS1.ItemName = FilterRESS1[f].ItemName;
                                optFilterRESS1.PurchaseUnit = FilterRESS1[f].PurchaseUnit;
                                optFilterRESS1.PurchaseRate = FilterRESS1[f].PurchaseRate;
                                optFilterRESS1.QuantityTolerance = FilterRESS1[f].QuantityTolerance;

                                ExistRESS1.push(optFilterRESS1);
                            }
                        }

                        existRow = { 'ExistIID': ExistRESS1 };

                        existRateDATA = JSON.parse(res);
                        AllotedGridList2();
                    }
                });
            }
        }
    }
});

$("#SelectBoxItemGroup").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'ItemGroupName',
    valueExpr: 'ItemGroupID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        GroupName = data.value;

        if (GroupName === null) return;
        var SPID = $("#SelectBoxSupplierName").dxSelectBox("instance").option('value');
        if (SPID === "" || SPID === undefined || SPID === null) {
            document.getElementById("inputdiv").style.display = "none";
            alert("Please select supplier name..!");
            document.getElementById("ValStrSelectBoxSupplierName").style.fontSize = "10px";
            document.getElementById("ValStrSelectBoxSupplierName").style.display = "block";
            document.getElementById("ValStrSelectBoxSupplierName").innerHTML = 'Please select supplier name';
            $("#SelectBoxItemGroup").dxSelectBox({
                value: null
            });
            return false;
        }
        else {
            document.getElementById("ValStrSelectBoxSupplierName").style.display = "none";
            document.getElementById("inputdiv").style.display = "block";
        }

        var PaperCol = "";
        if (GroupName === 1) {//Paper
            PaperCol = "ItemID,ItemCode,ItemName,Quality,GSM,Manufecturer,Finish,PaperGroup,SizeW,SizeL,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 2) {//Reel
            PaperCol = "ItemID,ItemCode,ItemName,Quality,GSM,Manufecturer,Finish,PaperGroup,SizeW,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 3) {//INK & ADDITIVES
            PaperCol = "ItemID,ItemCode,ItemName,ItemType,InkColour,PantoneCode,ManufecturerItemCode As Supplier Ref.,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 4) {//varnish and coatings
            PaperCol = "ItemID,ItemCode,ItemName,ItemType,ManufecturerItemCode As Supplier Ref.,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 5) {// laminaction films
            PaperCol = "ItemID,ItemCode,ItemName,Quality,ItemSubGroupName As Sub Group Name,ManufecturerItemCode As Supplier Ref.,Thickness,SizeW,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 6) {// Foil
            PaperCol = "ItemID,ItemCode,ItemName,Quality,ManufecturerItemCode As Supplier Ref.,SizL As Length,SizeW,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 7) {//Shipper Carton
            PaperCol = "ItemCode,ItemName As Shipper Name,NoOfPly,ManufecturerItemCode As Supplier Ref.,SizeL,SizeW,SizeH,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 8) {//Other Materials
            PaperCol = "ItemID,ItemCode,ItemName As Material Name,ItemSubGroupName As Sub Group Name,ManufecturerItemCode As Supplier Ref.,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 10) {//Wire-o
            PaperCol = "ItemCode,ItemName,ItemSubGroupName As Sub Group Name,ManufecturerItemCode As Supplier Ref.,Pitch,NoOfLoop,SizeH As Height,PurchaseUnit,PurchaseRate";
        }
        else if (GroupName === 11) {//Ribben
            PaperCol = "ItemID,ItemCode,ItemName,ItemSubGroupName As Sub Group Name,ManufecturerItemCode As Supplier Ref.,SizeW As Width,ConversionFactor,PurchaseUnit,PurchaseRate";
        }

        PaperCol = PaperCol.split(",");
        ObjColumnNameDy = [];
        ObjColumnNameDy2 = [];
        for (var ColN in PaperCol) {
            var Colobj = PaperCol[ColN];

            ColumnNameDy = {};
            if (Colobj.toString().toUpperCase().indexOf("AS ") === -1) {
                ColumnNameDy.dataField = Colobj;
            } else {
                var colDataField = Colobj.split(' As ');
                var colCaption = colDataField[1];
                ColumnNameDy.dataField = colDataField[0];
                ColumnNameDy.caption = colCaption;
            }

            if (Colobj === "ItemID") {
                ColumnNameDy.visible = false;
            }
            else {
                ColumnNameDy.maxWidth = 100;
                ColumnNameDy.visible = true;
                ColumnNameDy.alignment = "left";
            }

            if (Colobj === "GSM") {
                ColumnNameDy.dataType = "number";
            }
            ObjColumnNameDy.push(ColumnNameDy);
            ObjColumnNameDy2.push(ColumnNameDy);
        }

        CategorySM();

        //FillSecondGrid with Exsit Data Supplier name Wise
        $.ajax({
            type: "POST",
            url: "WebService_SupplierRateSetting.asmx/ExistRate",
            data: '{Ledgerid:' + JSON.stringify($("#SelectBoxSupplierName").dxSelectBox("instance").option('value')) + ',GroupID:' + GroupName + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/:,/g, ':null,');
                res = res.substr(1);
                res = res.slice(0, -1);

                ExistRESS1 = [];

                var FilterRESS1 = JSON.parse(res);
                var optFilterRESS1 = {};
                if (FilterRESS1.length > 0) {
                    document.getElementById("TxtExistid").value = FilterRESS1[0].SupplierWisePurchaseSettingID;
                    for (var f = 0; f < FilterRESS1.length; f++) {
                        optFilterRESS1 = {};
                        optFilterRESS1.SupplierWisePurchaseSettingID = FilterRESS1[f].SupplierWisePurchaseSettingID;
                        optFilterRESS1.ItemID = FilterRESS1[f].ItemID;
                        optFilterRESS1.ItemGroupID = FilterRESS1[f].ItemGroupID;
                        optFilterRESS1.LedgerID = FilterRESS1[f].LedgerID;
                        optFilterRESS1.ItemName = FilterRESS1[f].ItemName;
                        //optFilterRESS1.ItemCode = FilterRESS1[f].ItemCode;
                        optFilterRESS1.PurchaseUnit = FilterRESS1[f].PurchaseUnit;
                        optFilterRESS1.PurchaseRate = FilterRESS1[f].PurchaseRate;
                        optFilterRESS1.QuantityTolerance = FilterRESS1[f].QuantityTolerance;

                        ExistRESS1.push(optFilterRESS1);
                    }
                }
                existRateDATA = JSON.parse(res);
                AllotedGridList2();
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_SupplierRateSetting.asmx/SupplierName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/:,/g, ':null,');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SM = JSON.parse(res);
        $("#SelectBoxSupplierName").dxSelectBox({
            items: SM
        });
    }
});

function getMasterLIST(LedID) {
    try {
        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        $.ajax({
            type: "POST",
            url: "WebService_SupplierRateSetting.asmx/MasterListSupplierRate",
            data: '{LedID:' + LedID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/:,/g, ':null,');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                $("#SelectBoxItemGroup").dxSelectBox({
                    items: RES1
                });
            }
        });
    } catch (e) {
        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

function CategorySM() {

    var CategoryID = GroupName;
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: "POST",
        url: "WebService_SupplierRateSetting.asmx/SupplierRateSettingGrid",
        data: '{masterID:' + JSON.stringify(CategoryID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            // //console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/:,/g, ':null,');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);

            var RES1 = JSON.parse(res);
            if (RES1 === [] || RES1 === "") {
                RES1 = [];
            }
            ShowGroupGrid(RES1);
        }
    });
}

var OprIds = [];
function ShowGroupGrid(dataSource) {
    var ObjColumnNameFirst = [];
    ObjColumnNameFirst = ObjColumnNameDy;

    var Addfun = eval(function (container, _options) { $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container); });
    var ADDEvent = {};
    ADDEvent.dataField = "AddRow";
    ADDEvent.caption = "";
    ADDEvent.visible = true;
    ADDEvent.fixedPosition = "right";
    ADDEvent.fixed = true;
    ADDEvent.width = 25;
    ADDEvent.cellTemplate = Addfun;
    ObjColumnNameFirst.push(ADDEvent);

    $("#AutoLoadList1Grid").dxDataGrid({                  //// GridOperation  gridopr
        dataSource: {
            store: {
                type: "array",
                data: dataSource,
                key: "ItemID"
            }
        },
        allowEditing: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        sorting: { mode: 'none' },
        wordWrapEnabled: true,
        columns: ObjColumnNameFirst,
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        onEditingStart: function (e) {
            //if (e.column.dataField === "NewPurchaseRate") {
            //    e.cancel = false;
            //} else {
            //    e.cancel = true;
            //}
            e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'infinite'
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 2;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.dataField === "AddRow") {
                try {
                    var dataGrid = $('#AlocatedList2Grid').dxDataGrid('instance');
                    var newdata = [];

                    for (var k = 0; k <= dataGrid._options.dataSource.length - 1; k++) {
                        var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                        if (clickedCell.data.ItemID === cellvalItemID) {
                            if (Number(document.getElementById("TxtPurchaseRate").value) > 0) {
                                dataGrid._options.dataSource[k].NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                                dataGrid._options.dataSource[k].QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);
                                //DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                                dataGrid.refresh(true);
                                return false;
                            }
                        }
                    }
                    newdata = clickedCell.data;
                    newdata.NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                    newdata.QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);

                    var clonedItem = $.extend({}, newdata);
                    dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, clonedItem);
                    dataGrid.refresh(true);

                    //dataGrid.events.preventDefault();
                    DevExpress.ui.notify("List added..!", "success", 1000);
                    //clickedCell.component.clearFilter();

                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        }
    });
}


//AlocatedList2Grid
function AllotedGridList2() {

    var ObjColumnNameSecond = [];
    ObjColumnNameSecond = ObjColumnNameDy2;

    if (JSON.stringify(ObjColumnNameDy2).includes("NewPurchaseRate")) {
        //console.log(ObjColumnNameDy2);
    } else {
        var RemEvent = {};
        var newcolumn = "NewPurchaseRate,QuantityTolerance,Delete";
        newcolumn = newcolumn.split(",");
        for (var ColN in newcolumn) {
            var Colobj = newcolumn[ColN];
            RemEvent = {};
            if (Colobj === "Delete") {
                var AddfunDel = eval(function (container, _options) { $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container); });
                RemEvent.dataField = "Delete";
                RemEvent.caption = "";
                RemEvent.visible = true;
                RemEvent.fixedPosition = "right";
                RemEvent.fixed = true;
                RemEvent.width = 25;
                RemEvent.cellTemplate = AddfunDel;
                ObjColumnNameSecond.push(RemEvent);
            } else {
                RemEvent.dataField = Colobj;
                RemEvent.visible = true;
                RemEvent.width = 100;
                RemEvent.alignment = "left";
                ObjColumnNameSecond.push(RemEvent);
            }
        }
    }

    $("#AlocatedList2Grid").dxDataGrid({
        dataSource: existRateDATA,
        allowEditing: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        sorting: { mode: 'none' },
        wordWrapEnabled: true,
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        columns: ObjColumnNameSecond,
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "NewPurchaseRate" || e.column.dataField === "QuantityTolerance") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
        },
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'infinite'
        },
        paging: {
            pageSize: 100
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
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
                    var index = OprIds.indexOf(clickedCell.data.ProcessID);
                    if (index > -1) {
                        OprIds.splice(index, 1);
                        DevExpress.ui.notify("Selected list removed..!", "error", 1000);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        height: function () {
            return window.innerHeight / 2;
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
            e.rowElement.css('text-align', 'left');
        }
    });
}

$("#SaveButton").click(function () {

    var ExistItemID = Number(document.getElementById("TxtExistid").value);
    var SupplierName = $("#SelectBoxSupplierName").dxSelectBox("instance").option('value');
    var ItemGroup = $("#SelectBoxItemGroup").dxSelectBox("instance").option('value');

    if (SupplierName === 0 || SupplierName === "" || SupplierName === undefined || SupplierName === null) {
        alert("Please select..Supplier Name");
        document.getElementById("SelectBoxSupplierName").focus();
        document.getElementById("ValStrSelectBoxSupplierName").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "block";
        document.getElementById("ValStrSelectBoxSupplierName").innerHTML = 'This field should not be empty..Supplier Name';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "none";
    }
    if (ItemGroup === "" || ItemGroup === undefined || ItemGroup === null) {
        alert("Please select..Item Group");
        document.getElementById("SelectBoxItemGroup").focus();
        document.getElementById("ValStrSelectBoxItemGroup").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxItemGroup").style.display = "block";
        document.getElementById("ValStrSelectBoxItemGroup").innerHTML = 'This field should not be empty..Item Group';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxItemGroup").style.display = "none";
    }

    var jsonObjectsRateRecord = [];
    var OperationRateRecord = {};

    var AlocatedList2Grid = $('#AlocatedList2Grid').dxDataGrid('instance');
    var AlocatedList2GridRow = AlocatedList2Grid._options.dataSource.length;

    if (AlocatedList2GridRow > 0) {

        for (var k = 0; k < AlocatedList2GridRow; k++) {
            OperationRateRecord = {};
            if (Number(AlocatedList2Grid._options.dataSource[k].NewPurchaseRate) > 0) {
                OperationRateRecord.LedgerID = SupplierName;
                OperationRateRecord.ItemGroupID = ItemGroup;
                OperationRateRecord.ItemName = $("#SelectBoxItemGroup").dxSelectBox("instance").option('text');
                OperationRateRecord.ItemID = AlocatedList2Grid._options.dataSource[k].ItemID;
                OperationRateRecord.PurchaseUnit = AlocatedList2Grid._options.dataSource[k].PurchaseUnit;
                OperationRateRecord.PurchaseRate = AlocatedList2Grid._options.dataSource[k].NewPurchaseRate;
                OperationRateRecord.QuantityTolerance = AlocatedList2Grid._options.dataSource[k].QuantityTolerance;

                jsonObjectsRateRecord.push(OperationRateRecord);
            }
        }

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
                $.ajax({
                    type: "POST",
                    url: "WebService_SupplierRateSetting.asmx/SaveRatesettingData",
                    data: '{jsonObjectsRateRecord:' + JSON.stringify(jsonObjectsRateRecord) + ',ExistObjectsRateRecord:' + JSON.stringify(ExistRESS1) + ',ExistID:' + ExistItemID + ',SupplierName:' + SupplierName + ',ItemGroup:' + ItemGroup + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                        if (results.d === "Success") {
                            swal("Data Saved..!", "Your data saved successfuly...", "success");
                            location.reload();
                        } else if (results.d.includes("not authorized")) {
                            swal("Can't Save..!", results.d, "warning");
                        } else if (results.d.includes("Error:")) {
                            swal("Error..!", results.d, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            });
    } else {
        alert("Please add any row in second Grid from first Grid..!");
        return false;
    }
});

$("#BtnTransferData").click(function () {
    var dataGrid = $('#AlocatedList2Grid').dxDataGrid('instance');

    var Grid1 = $('#AutoLoadList1Grid').dxDataGrid('instance');

    var Grid1Row = dataGrid.totalCount();
    // alert(Grid1Row);
    var newdata;
    if (Number(document.getElementById("TxtPurchaseRate").value) <= 0) {
        DevExpress.ui.notify("Please enter purchase rate..!", "error", 1000);
        document.getElementById("TxtPurchaseRate").focus();
        return false;
    }
    try {

        if (Grid1Row > 0) {

            $("#image-indicator").dxLoadPanel("instance").option("visible", true);

            for (var comp = 0; comp < Grid1Row; comp++) {
                //for (var z = 0; z < Grid1._options.dataSource.store.data.length; z++) {
                var found = false;
                for (var k = 0; k <= dataGrid._options.dataSource.length - 1; k++) {
                    var cellvalItemID = dataGrid._options.dataSource[k].ItemID;
                    if (Number(dataGrid.cellValue(comp, "ItemID")) === cellvalItemID) {
                        //DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                        dataGrid._options.dataSource[k].NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                        dataGrid._options.dataSource[k].QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);
                        //found = true;
                    }
                }
                dataGrid.refresh(true);
                //if (found === false) {
                //    if (Grid1._options.dataSource.store.data[z].ItemID === Grid1.cellValue(comp, 0)) {
                //        newdata = [];
                //        newdata = Grid1._options.dataSource.store.data[z];
                //        newdata.NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                //        newdata.QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);

                //        var clonedItem = $.extend({}, newdata);
                //        dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, clonedItem);
                //        dataGrid.refresh(true);
                //    }
                //}
                //}
            }
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        //alert(e);
    }

});

$("document").ready(function () {

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
});

////////Spare Part Supplier Rate Settings ///////////////
function getSparesPartGroup(LedID) {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        $.ajax({
            type: "POST",
            url: "WebService_SupplierRateSetting.asmx/SparesGroupMasterList",
            data: '{LedID:' + LedID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/:,/g, ':null,');
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var RES1 = JSON.parse(res);
                $("#SelectBoxSpareGroup").dxSelectBox({ items: RES1 });
            }
        });
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

$("#SelectBoxSpareGroup").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'SparePartGroup',
    valueExpr: 'SparePartGroup',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        GroupName = data.value;

        if (GroupName === null || GroupName === "") return;
        var SPID = $("#SelectBoxSupplierName").dxSelectBox("instance").option('value');
        if (SPID === "" || SPID === undefined || SPID === null) {
            document.getElementById("ValStrSelectBoxSupplierName").style.display = "block";
            document.getElementById("ValStrSelectBoxSupplierName").innerHTML = 'Please select supplier name';
            $("#SelectBoxSpareGroup").dxSelectBox({ value: null });
            return false;
        }
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "none";

        //FillSecondGrid with Exsit Data Supplier name Wise
        $.ajax({
            type: "POST",
            url: "WebService_SupplierRateSetting.asmx/SparesExistRate",
            data: '{Ledgerid:' + JSON.stringify(SPID) + ',GroupID:' + JSON.stringify(GroupName) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/:,/g, ':null,');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                $("#SparesAlocatedList2Grid").dxDataGrid({ dataSource: RES1 });
            }
        });
    }
});

$("#SparesAutoLoadList1Grid").dxDataGrid({
    dataSource: [],
    allowEditing: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    sorting: { mode: 'none' },
    wordWrapEnabled: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    showRowLines: true,
    showBorders: true,
    scrolling: { mode: 'infinite' },
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 2;
    },
    columns: [{ dataField: "SparePartCode" }, { dataField: "SparePartName" }, { dataField: "SparePartGroup" }, { dataField: "HSNGroup" }
        , { dataField: "Unit" }, { dataField: "Rate" }, { dataField: "SparePartType" }, { dataField: "SupplierReference" }
        , { dataField: "StockRefCode" }, { dataField: "IsCritical" }, { dataField: "Narration" }, { dataField: "IsActive" },
    {
        dataField: "AddRow", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
        cellTemplate: function (container, options) {
            $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
        }
    }
    ],
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType !== "data") return false;

        if (clickedCell.column.dataField === "AddRow") {
            try {
                var dataGrid = $('#SparesAlocatedList2Grid').dxDataGrid('instance');
                var newdata = [];

                for (var k = 0; k <= dataGrid._options.dataSource.length - 1; k++) {
                    var cellvalSparePartID = dataGrid._options.dataSource[k].SparePartID;
                    if (clickedCell.data.SparePartID === cellvalSparePartID) {
                        if (Number(document.getElementById("TxtPurchaseRate").value) > 0) {
                            dataGrid._options.dataSource[k].NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                            dataGrid._options.dataSource[k].QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);
                            //DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                            dataGrid.refresh(true);
                            return false;
                        }
                    }
                }
                newdata = clickedCell.data;
                newdata.NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                newdata.QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);

                var clonedSpare = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, clonedSpare);
                dataGrid.refresh(true);

                //dataGrid.events.preventDefault();
                DevExpress.ui.notify("List added..!", "success", 1000);
                //clickedCell.component.clearFilter();

            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#SparesAlocatedList2Grid").dxDataGrid({
    dataSource: [],
    allowEditing: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    sorting: { mode: 'none' },
    wordWrapEnabled: true,
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    columns: [{ dataField: "SparePartCode" }, { dataField: "SparePartName" }, { dataField: "SparePartGroup" }, { dataField: "HSNGroup" }
        , { dataField: "Unit" }, { dataField: "Rate" }, { dataField: "SparePartType" }, { dataField: "SupplierReference" }, { dataField: "NewPurchaseRate" }, { dataField: "QuantityTolerance" }
        , { dataField: "StockRefCode" }, { dataField: "IsCritical" }, { dataField: "Narration" }, { dataField: "IsActive" },
    {
        dataField: "RemoveRow", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    }
    ],
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "NewPurchaseRate" || e.column.dataField === "QuantityTolerance") {
            e.cancel = false;
        } else {
            e.cancel = true;
        }
    },
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'infinite'
    },
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "RemoveRow") {
            try {
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);
                ////clickedCell.component.refresh(true);
                //var index = OprIds.indexOf(clickedCell.data.ProcessID);
                //if (index > -1) {
                //    OprIds.splice(index, 1);
                //    DevExpress.ui.notify("Selected list removed..!", "error", 1000);
                //}
            } catch (e) {
                console.log(e);
            }
        }
    },
    height: function () {
        return window.innerHeight / 2;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
        e.rowElement.css('text-align', 'left');
    }
});

$("#BtnSparesTransferData").click(function () {
    var dataGrid = $('#SparesAlocatedList2Grid').dxDataGrid('instance');

    var Grid1 = $('#SparesAutoLoadList1Grid').dxDataGrid('instance');

    var Grid1Row = dataGrid.totalCount();
    // alert(Grid1Row);
    var newdata;
    if (Number(document.getElementById("TxtPurchaseRate").value) <= 0) {
        DevExpress.ui.notify("Please enter purchase rate..!", "error", 1000);
        document.getElementById("TxtPurchaseRate").focus();
        return false;
    }
    try {

        if (Grid1Row > 0) {

            $("#image-indicator").dxLoadPanel("instance").option("visible", true);

            for (var comp = 0; comp < Grid1Row; comp++) {
                //for (var z = 0; z < Grid1._options.dataSource.store.data.length; z++) {
                var found = false;
                for (var k = 0; k <= dataGrid._options.dataSource.length - 1; k++) {
                    var cellvalSparePartID = dataGrid._options.dataSource[k].SparePartID;
                    if (Number(dataGrid.cellValue(comp, "SparePartID")) === cellvalSparePartID) {
                        //DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                        dataGrid._options.dataSource[k].NewPurchaseRate = Number(document.getElementById("TxtPurchaseRate").value);
                        dataGrid._options.dataSource[k].QuantityTolerance = Number(document.getElementById("TxtQtyTolerance").value);
                        //found = true;
                    }
                }
                dataGrid.refresh(true);
            }
        }
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    }
});

$("#BtnSparesSave").click(function () {

    var ExistSparePartID = Number(document.getElementById("TxtExistid").value);
    var SupplierName = $("#SelectBoxSupplierName").dxSelectBox("instance").option('value');
    var SpareGroup = $("#SelectBoxSpareGroup").dxSelectBox("instance").option('value');

    if (SupplierName === 0 || SupplierName === "" || SupplierName === undefined || SupplierName === null) {
        alert("Please select..Supplier Name");
        document.getElementById("SelectBoxSupplierName").focus();
        document.getElementById("ValStrSelectBoxSupplierName").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "block";
        document.getElementById("ValStrSelectBoxSupplierName").innerHTML = 'This field should not be empty..Supplier Name';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "none";
    }
    if (SpareGroup === "" || SpareGroup === undefined || SpareGroup === null) {
        alert("Please select..Spare Group");
        document.getElementById("SelectBoxSpareGroup").focus();
        document.getElementById("ValStrSelectBoxSpareGroup").style.display = "block";
        document.getElementById("ValStrSelectBoxSpareGroup").innerHTML = 'This field should not be empty..Spare Group';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxSpareGroup").style.display = "none";
    }

    var jsonObjectsRateRecord = [];
    var OperationRateRecord = {};

    var AlocatedList2Grid = $('#AlocatedList2Grid').dxDataGrid('instance');
    var AlocatedList2GridRow = AlocatedList2Grid._options.dataSource.length;

    if (AlocatedList2GridRow > 0) {

        for (var k = 0; k < AlocatedList2GridRow; k++) {
            OperationRateRecord = {};
            if (Number(AlocatedList2Grid._options.dataSource[k].NewPurchaseRate) > 0) {
                OperationRateRecord.LedgerID = SupplierName;
                OperationRateRecord.ItemGroupID = ItemGroup;
                OperationRateRecord.ItemName = $("#SelectBoxSpareGroup").dxSelectBox("instance").option('text');
                OperationRateRecord.SparePartID = AlocatedList2Grid._options.dataSource[k].SparePartID;
                OperationRateRecord.PurchaseUnit = AlocatedList2Grid._options.dataSource[k].PurchaseUnit;
                OperationRateRecord.PurchaseRate = AlocatedList2Grid._options.dataSource[k].NewPurchaseRate;
                OperationRateRecord.QuantityTolerance = AlocatedList2Grid._options.dataSource[k].QuantityTolerance;

                jsonObjectsRateRecord.push(OperationRateRecord);
            }
        }

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
                $.ajax({
                    type: "POST",
                    url: "WebService_SupplierRateSetting.asmx/SaveRatesettingData",
                    data: '{jsonObjectsRateRecord:' + JSON.stringify(jsonObjectsRateRecord) + ',ExistObjectsRateRecord:' + JSON.stringify(ExistRESS1) + ',ExistID:' + ExistSparePartID + ',SupplierName:' + SupplierName + ',ItemGroup:' + ItemGroup + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                        if (results.d === "Success") {
                            swal("Data Saved..!", "Your data saved successfuly...", "success");
                            location.reload();
                        } else if (results.d.includes("not authorized")) {
                            swal("Can't Save..!", results.d, "warning");
                        } else if (results.d.includes("Error:")) {
                            swal("Error..!", results.d, "error");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            });
    } else {
        alert("Please add any row in second Grid from first Grid..!");
        return false;
    }
});
