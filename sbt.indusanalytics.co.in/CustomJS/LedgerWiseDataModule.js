"use strict"

var LedgerMasterListOBJ = [];
var LedgerWiseDataGridOBJ = [];
var SelectLedgerDataOBJ = [];
var FieldTypeLoadDataOBJ = [];


//---------Start------------------Module List Load Data-------------//
LedgerMasterDropDownLoadData();
$('#LedgerMasterDropDown').dxSelectBox({
    items: [],
    displayExpr: "LedgerGroupNameDisplay",
    valueExpr: "LedgerGroupID",
    placeholder: 'Select Module',
    showClearButton: false,
    searchEnabled: true,
    onItemClick: function (e) {
        LedgerWiseGridDataLoad();
    }
});


function LedgerMasterDropDownLoadData() {
    $.ajax({
        async: true,
        type: "POST",
        url: "WebService_LedgerMaster.asmx/LedgerMasterLoadList",
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            LedgerMasterListOBJ = JSON.parse(res);
            $('#LedgerMasterDropDown').dxSelectBox({ items: LedgerMasterListOBJ })
        },
    });

};
////---------End------------------Module List Load Data-------------//

$.ajax({
    async: false,
    type: "POST",
    url: "WebService_LedgerMaster.asmx/FieldTypeLoadData",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/"d":null/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.replace(/u0027/g, "'");
        res = res.replace(/:,/g, ":null,");
        res = res.replace(/:}/g, ":null}");
        res = res.substr(1);
        res = res.slice(0, -1);
        FieldTypeLoadDataOBJ = JSON.parse(res);
    },
});



//---------Start------------------Module Wise User Authority-------------//
const GridABCD = $('#LedgerWiseDataGrid').dxDataGrid({
    columns: [
        { dataField: "FieldDisplayName", visible: true, allowEditing: true, caption: "FieldDisplayName", width: '*', width: 200, minWidth: 150 },
        { dataField: "LedgerGroupFieldID", visible: false, allowEditing: false, caption: "LedgerGroupFieldID", width: '*', width: 100 },
        { dataField: "LedgerGroupID", visible: false, allowEditing: false, caption: "LedgerGroupID", width: '*', width: 100 },
        { dataField: "FieldName", visible: false, allowEditing: false, caption: "FieldName", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldDataType", visible: false, allowEditing: false, caption: "FieldDataType", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldDescription", visible: false, allowEditing: false, caption: "FieldDescription", width: '*', width: 200, minWidth: 150 },
        { dataField: "IsDisplay", visible: true, allowEditing: true, caption: "IsDisplay", width: '*', width: 200, minWidth: 150 },
        { dataField: "IsCalculated", visible: false, allowEditing: false, caption: "IsCalculated", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldFormula", visible: false, allowEditing: false, caption: "FieldFormula", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldTabIndex", visible: false, allowEditing: false, caption: "FieldTabIndex", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldDrawSequence", visible: true, allowEditing: true, caption: "FieldDrawSequence", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldDefaultValue", visible: true, allowEditing: true, caption: "FieldDefaultValue", width: '*', width: 200, minWidth: 150 },
        { dataField: "IsActive", visible: true, allowEditing: true, caption: "IsActive", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldType", visible: true, allowEditing: true, lookup: { dataSource: FieldTypeLoadDataOBJ, valueExpr: 'FieldType', displayExpr: 'FieldType' }, caption: "FieldType", width: '*', width: 200, minWidth: 150 },
        { dataField: "SelectBoxQueryDB", visible: false, allowEditing: false, caption: "SelectBoxQueryDB", width: '*', width: 200, minWidth: 150 },
        { dataField: "SelectBoxDefault", visible: false, allowEditing: false, caption: "SelectBoxDefault", width: '*', width: 200, minWidth: 150 },
        { dataField: "ControllValidation", visible: false, allowEditing: true, caption: "ControllValidation", width: '*', width: 200, minWidth: 150 },
        { dataField: "FieldFormulaString", visible: false, allowEditing: false, caption: "FieldFormulaString", width: '*', width: 200, minWidth: 150 },
        { dataField: "IsLocked", visible: true, allowEditing: true, caption: "IsLocked", width: '*', width: 200, minWidth: 150 },
        { dataField: "IsDeletedTransaction", visible: false, allowEditing: false, caption: "IsDeletedTransaction", width: '*', width: 200, minWidth: 150 }
    ],
    dataSource: LedgerWiseDataGridOBJ,
    keyExpr: 'FieldDrawSequence',
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    scrolling: {
        mode: 'virtual',
    },

    rowDragging: {
        allowReordering: false,
        onReorder(e) {
            var updateind = 1;

            const visibleRows = e.component.getVisibleRows();

            const toIndex = LedgerWiseDataGridOBJ.findIndex((item) => item.FieldDrawSequence === visibleRows[e.toIndex].data.FieldDrawSequence);
            const fromIndex = LedgerWiseDataGridOBJ.findIndex((item) => item.FieldDrawSequence === e.itemData.FieldDrawSequence);



            LedgerWiseDataGridOBJ.splice(fromIndex, 1);
            LedgerWiseDataGridOBJ.splice(toIndex, 0, e.itemData);
            var fromloop = 0, toloop = 0;

            if (fromIndex < toIndex) {
                fromloop = fromIndex;
                toloop = toIndex;
            } else {
                fromloop = toIndex;
                toloop = fromIndex;

            }
            e.component.refresh();

            var data = GridABCD.getDataSource().items();

            for (var i = 0; i < data.length - 1; i++) {
                1
                data[i].FieldDrawSequence = i + 1;
            }
            e.component.refresh();
        },
    },


    height: function () {
        return window.innerHeight / 1.4;
    },
    filterRow: {
        visible: false,
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#0a5696');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '10px');
    },
    onSelectionChanged: function (clicked) {
        SelectLedgerDataOBJ = []
        SelectLedgerDataOBJ = clicked.selectedRowsData;
    },

}).dxDataGrid('instance');



function LedgerWiseGridDataLoad() {
    var LedgerGroupID = $('#LedgerMasterDropDown').dxSelectBox('instance').option('value');
    $.ajax({
        async: true,
        type: "POST",
        url: "WebService_LedgerMaster.asmx/LedgerGroupIDWiseData",
        data: '{LedgerGroupID:' + JSON.stringify(LedgerGroupID) + '}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            LedgerWiseDataGridOBJ = JSON.parse(res);
            $('#LedgerWiseDataGrid').dxDataGrid({
                dataSource: LedgerWiseDataGridOBJ,
            });
        },
    });
}


function FieldTypeLoadGetData() {
    $.ajax({
        async: true,
        type: "POST",
        url: "WebService_LedgerMaster.asmx/FieldTypeLoadData",
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            FieldTypeLoadDataOBJ = JSON.parse(res);
        },
    });
}


$('#BtnUpdate').click(function () {
    var data = GridABCD.getDataSource().items();

    var tdata = [], tobj = {};
    for (var i = 0; i < data.length; i++) {
        tobj = {};
        tobj.LedgerGroupFieldID = data[i].LedgerGroupFieldID;
        tobj.FieldDisplayName = data[i].FieldDisplayName;
        tobj.IsDisplay = data[i].IsDisplay;
        tobj.FieldDrawSequence = data[i].FieldDrawSequence;
              tobj.IsActive = data[i].IsActive;
        tobj.FieldType = data[i].FieldType;
        tobj.IsLocked = data[i].IsLocked;
        tdata.push(tobj);
    }

    console.log(tdata);
    //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: "POST",
        url: "WebService_LedgerMaster.asmx/SaveConfiguration",
        data: '{Data:' + JSON.stringify(tdata) + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

         //   $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res === "Success") {
                alert("Saved");
                location.reload();
            } else {
                swal("Not Saved..!", res, "warning");
            }
        },
        error: function errorFunc(jqXHR) {
        //    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            swal("Error!", "Please try after some time..", "");
            alert(jqXHR);
        }
    });
});