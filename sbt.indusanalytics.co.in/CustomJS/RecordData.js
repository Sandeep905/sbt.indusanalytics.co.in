
$("#DateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#DateTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#SelFormsName").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Machine...",
    displayExpr: "ModuleDisplayName",
    valueExpr: "ModuleID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    //showMultiTagOnly: false,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#FormsID").text(data);
        }
        else {
            $("#FormsID").text("");
        }
    }
});

$("#SelUser").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select User...",
    displayExpr: 'UserName',
    valueExpr: 'UserID',
    showSelectionControls: true,
    maxDisplayedTags: 2,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#UserID").text(data);
        }
        else {
            $("#UserID").text("");
        }
    }
});

$("#ShowListGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "multiple"
    },
    paging: { enabled: true },
    selection: { mode: "single" },
    // scrolling: { mode: 'virtual' },
    columnChooser: { enabled: false },
    headerFilter: { visible: true },
    filterRow: { visible: true, applyFilter: "auto" },
    searchPanel: { visible: false },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Record Data",
        allowExportSelectedData: true
    },
    editing: {
        mode: "cell",
        allowUpdating: false
    },
    columns: [
        { dataField: "UserID", visible: false, width: 120 },
        { dataField: "ModuleID", visible: false, width: 120 },
        { dataField: "UserName", visible: true, width: 200, caption: "User Name" },
        { dataField: "ModuleDisplayName", visible: true, width: 200, caption: "Module Name" },
        { dataField: "ModuleHeadName", visible: true, width: 250, caption: "Forms Name" },
        { dataField: "CreatedDate", visible: true, width: 120, caption: "Date" },
        { dataField: "CreatedTime", visible: true, width: 180, caption: "Time" },
        { dataField: "Details", visible: true, width: 300, caption: "Details" }
    ],
    height: function () {
        return window.innerHeight / 1.4;
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

$.ajax({
    type: "POST",
    url: "WebService_LoginInformation.asmx/GetAllForms",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.replace(/:,/g, ":null,");
        res = res.replace(/:}/g, ":null}");
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        var objFormsName = JSON.parse(res.toString());
        $("#SelFormsName").dxTagBox({ items: objFormsName });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_LoginInformation.asmx/GetAllUser",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        objUserName = JSON.parse(res.toString());
        $("#SelUser").dxTagBox({ items: objUserName });
    }
});

$("#BtnSearch").click(function () {
    var DateFrom = $('#DateFrom').dxDateBox('instance').option('value');
    var DateTo = $('#DateTo').dxDateBox('instance').option('value');
    var ShowAll = document.getElementById("ShowAll").checked;
    var UserID = document.getElementById("UserID").value;
    var ModuleID = document.getElementById("FormsID").value;

    $.ajax({
        type: "POST",
        url: "WebService_LoginInformation.asmx/GetAllRecord",
        data: '{DateFrom:' + JSON.stringify(DateFrom) + ',DateTo:' + JSON.stringify(DateTo) + ',ShowAll:' + JSON.stringify(ShowAll) + ',UserID:' + JSON.stringify(UserID) + ',ModuleID:' + JSON.stringify(ModuleID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var RES1 = JSON.parse(res.toString());
            $("#ShowListGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
});