"use strict";
var dxboxval, ISpaper = false, Isvisible = true;
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

$("#Dropdown").dxSelectBox({
    placeholder: "Select Item...",
    items: ["Reel", "Paper"],
    value: "Reel",
    onValueChanged: function (data) {
        RefreshData();
    }
});

RefreshData();

function RefreshData() {
    dxboxval = $('#Dropdown').dxSelectBox('instance').option('value');
    if (dxboxval === "Reel") {
        ISpaper = false;
        Isvisible = true;
    }
    if (dxboxval === "Paper") {
        ISpaper = true;
        Isvisible = true;
    }
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetImportData",
        data: '{dxboxval:' + JSON.stringify(dxboxval) + '}',
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
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res);
            $("#CompanyGrid").dxDataGrid({ dataSource: RES1 });

        }
    });

    var SheetName = "DataImportEstimo" + '_' + new Date().toISOString().substr(0, 10) + '.xlsx';
    $("#CompanyGrid").dxDataGrid({
        dataSource: [],
        export: {
            enabled: true
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), SheetName);
                });
            });
            e.cancel = true;
        },
        columns: [
            { dataField: "ItemID", caption: "ItemID", visible: false, allowEditing: false },
            { dataField: "Quality", caption: "Quality", allowEditing: false, visible: Isvisible },
            { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 180, visible: Isvisible },
            { dataField: "ItemSize", caption: "Item Size", allowEditing: false, visible: ISpaper },
            { dataField: "GSM", caption: "GSM", allowEditing: false, visible: Isvisible },
            { dataField: "Manufecturer", caption: "Mill", allowEditing: false, visible: Isvisible },
            { dataField: "Finish", caption: "Finish", allowEditing: false, visible: Isvisible },
            { dataField: "PackingType", caption: "Packing Type", allowEditing: false, visible: ISpaper },
            { dataField: "UnitPerPacking", caption: "Unit Per Packing", allowEditing: true, visible: Isvisible },
            { dataField: "WtPerPacking", caption: "Wt Per Packing", allowEditing: true, visible: Isvisible },
            { dataField: "SizeW", caption: "Size W", allowEditing: false, visible: Isvisible },
            { dataField: "SizeL", caption: "Size L", allowEditing: false, visible: Isvisible },
            { dataField: "Caliper", caption: "Caliper", allowEditing: false, visible: Isvisible },
            { dataField: "EstimationRate", caption: "Estimation Rate", allowEditing: true, visible: Isvisible },
            { dataField: "EstimationUnit", caption: "Estimation Unit", allowEditing: false, visible: Isvisible },
            { dataField: "MinimumStockQty", caption: "Minimum Stock Level", allowEditing: false, visible: Isvisible },
            { dataField: "IsStandardItem", caption: "Is Standard Item", allowEditing: true, visible: Isvisible },
            {
                dataField: "Add", caption: "", visible: true, fixedPosition: "right", fixed: true, width: 50, allowEditing: false,
                cellTemplate: function (container, options) {
                    $('<div>').addClass('fa fa-plus dx-link').appendTo(container);
                }
            }]        
    });

    $("#ClientGrid").dxDataGrid({
        dataSource: [],
        columns: [
            { dataField: "ItemID", caption: "ItemID", visible: false, allowEditing: false },
            { dataField: "Quality", caption: "Quality", allowEditing: false, visible: Isvisible },
            { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 180, visible: Isvisible },
            { dataField: "ItemSize", caption: "Item Size", allowEditing: false, visible: ISpaper },
            { dataField: "GSM", caption: "GSM", allowEditing: false, visible: Isvisible },
            { dataField: "Manufecturer", caption: "Mill", allowEditing: false, visible: Isvisible },
            { dataField: "Finish", caption: "Finish", allowEditing: false, visible: Isvisible },
            { dataField: "PackingType", caption: "Packing Type", allowEditing: false, visible: ISpaper },
            { dataField: "UnitPerPacking", caption: "Unit Per Packing", allowEditing: true, visible: Isvisible },
            { dataField: "WtPerPacking", caption: "Wt Per Packing", allowEditing: true, visible: Isvisible },
            { dataField: "SizeW", caption: "Size W", allowEditing: false, visible: Isvisible },
            { dataField: "SizeL", caption: "Size L", allowEditing: false, visible: Isvisible },
            { dataField: "Caliper", caption: "Caliper", allowEditing: false, visible: Isvisible },
            { dataField: "EstimationRate", caption: "Estimation Rate", allowEditing: true, visible: Isvisible },
            { dataField: "EstimationUnit", caption: "Estimation Unit", allowEditing: false, visible: Isvisible },
            { dataField: "MinimumStockQty", caption: "Minimum Stock Level", allowEditing: true, visible: Isvisible },
            { dataField: "IsStandardItem", caption: "Is Standard Item", allowEditing: true, visible: Isvisible }
        ]
    });

}

$("#CompanyGrid").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    filterRow: { visible: true },
    showBorders: true,
    showRowLines: true,
    editing: { mode: "cell", allowUpdating: true },
    selection: { mode: 'single' },
    height: function () {
        return window.innerHeight / 2.4;
    },
    scrolling: { mode: 'virtual' },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ItemID", caption: "ItemID", visible: false, allowEditing: false },
        { dataField: "Quality", caption: "Quality", allowEditing: false, visible: Isvisible },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 180, visible: Isvisible },
        { dataField: "ItemSize", caption: "Item Size", allowEditing: false, visible: ISpaper },
        { dataField: "GSM", caption: "GSM", allowEditing: false, visible: Isvisible },
        { dataField: "Manufecturer", caption: "Mill", allowEditing: false, visible: Isvisible },
        { dataField: "Finish", caption: "Finish", allowEditing: false, visible: Isvisible },
        { dataField: "PackingType", caption: "Packing Type", allowEditing: false, visible: ISpaper },
        { dataField: "UnitPerPacking", caption: "Unit Per Packing", allowEditing: false, visible: Isvisible },
        { dataField: "WtPerPacking", caption: "Wt Per Packing", allowEditing: false, visible: Isvisible },
        { dataField: "SizeW", caption: "Size W", allowEditing: false, visible: Isvisible },
        { dataField: "SizeL", caption: "Size L", allowEditing: false, visible: Isvisible },
        { dataField: "Caliper", caption: "Caliper", allowEditing: false, visible: Isvisible },
        { dataField: "EstimationRate", caption: "Estimation Rate", allowEditing: true, visible: Isvisible },
        { dataField: "EstimationUnit", caption: "Estimation Unit", allowEditing: false, visible: Isvisible },
        { dataField: "MinimumStockQty", caption: "Minimum Stock Level", allowEditing: false, visible: Isvisible },
        { dataField: "IsStandardItem", caption: "Is Standard Item", allowEditing: true, visible: Isvisible },
        {
            dataField: "Add", caption: "", visible: true, fixedPosition: "right", fixed: true, width: 50, allowEditing: false,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus dx-link').appendTo(container);
            }
        }],
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "Add") {
            try {
                clickedCell.component.saveEditData();
                clickedCell.component.refresh();

                var dataGrid = $('#ClientGrid').dxDataGrid('instance');
                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ItemID === clickedCell.data.ItemID; });
                if (result.length >= 1) {
                    // data found
                    DevExpress.ui.notify("Item already added..!", "error", 500);
                    return false;
                }

                var newData = clickedCell.data;

                newData.ItemID = clickedCell.data.ItemID;
                newData.ItemGroupID = clickedCell.data.ItemGroupID;
                newData.Quality = clickedCell.data.Quality;
                newData.ItemName = clickedCell.data.ItemName;
                newData.ItemSize = clickedCell.data.ItemSize;
                newData.GSM = clickedCell.data.GSM;
                newData.Manufecturer = clickedCell.data.Manufecturer;
                newData.Finish = clickedCell.data.Finish;
                newData.PackingType = clickedCell.data.PackingType;
                newData.UnitPerPacking = clickedCell.data.UnitPerPacking;
                newData.EstimationRate = clickedCell.data.EstimationRate;
                newData.SizeW = clickedCell.data.SizeW;
                newData.SizeL = clickedCell.data.SizeL;
                newData.Caliper = clickedCell.data.Caliper;
                newData.EstimationUnit = clickedCell.data.EstimationUnit;
                newData.MinimumStockQty = clickedCell.data.MinimumStockQty;
                newData.IsStandardItem = clickedCell.data.IsStandardItem;
                newData.ItemType = dxboxval;

                var clonedItem = $.extend({}, newData);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                DevExpress.ui.notify("Item added..!", "success", 500);
                
            } catch (e) {
                console.log(e);
            }
        }
    },
    error: function errorFunc(jqXHR) {
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        alert(jqXHR.message);
    }
});

$("#ClientGrid").dxDataGrid({
    dataSource: [],
    sorting: { mode: "multiple" },
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    showBorders: true,
    showRowLines: true,
    editing: {
        mode: "cell",
        allowDeleting: true,
        allowUpdating: true,
        useIcon: true
    },
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 2.7;
    },
    scrolling: { mode: 'virtual' },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ItemID", caption: "ItemID", visible: false, allowEditing: false },
        { dataField: "Quality", caption: "Quality", allowEditing: false, visible: Isvisible },
        { dataField: "ItemName", caption: "Item Name", allowEditing: false, width: 180, visible: Isvisible },
        { dataField: "ItemSize", caption: "Item Size", allowEditing: false, visible: ISpaper },
        { dataField: "GSM", caption: "GSM", allowEditing: false, visible: Isvisible },
        { dataField: "Manufecturer", caption: "Mill", allowEditing: false, visible: Isvisible },
        { dataField: "Finish", caption: "Finish", allowEditing: false, visible: Isvisible },
        { dataField: "PackingType", caption: "Packing Type", allowEditing: false, visible: ISpaper },
        { dataField: "UnitPerPacking", caption: "Unit Per Packing", allowEditing: false, visible: Isvisible },
        { dataField: "WtPerPacking", caption: "Wt Per Packing", allowEditing: false, visible: Isvisible },
        { dataField: "SizeW", caption: "Size W", allowEditing: false, visible: Isvisible },
        { dataField: "SizeL", caption: "Size L", allowEditing: false, visible: Isvisible },
        { dataField: "Caliper", caption: "Caliper", allowEditing: false, visible: Isvisible },
        { dataField: "EstimationRate", caption: "Estimation Rate", allowEditing: true, visible: Isvisible },
        { dataField: "EstimationUnit", caption: "Estimation Unit", allowEditing: false, visible: Isvisible },
        { dataField: "MinimumStockQty", caption: "Minimum Stock Level", allowEditing: false, visible: Isvisible },
        { dataField: "IsStandardItem", caption: "Is Standard Item", allowEditing: true, visible: Isvisible }
    ]
});

$("#BtnAddAll").click(function () {
    try {

        var DataCompanyGrid = $('#CompanyGrid').dxDataGrid('instance');

        var AllData = []; var newData = {};
        for (var i = 0; i < DataCompanyGrid._options.dataSource.length; i++) {
            newData = {};
            newData.ItemID = DataCompanyGrid._options.dataSource[i].ItemID;
            newData.ItemGroupID = DataCompanyGrid._options.dataSource[i].ItemGroupID;
            newData.Quality = DataCompanyGrid._options.dataSource[i].Quality;
            newData.ItemName = DataCompanyGrid._options.dataSource[i].ItemName;
            newData.ItemSize = DataCompanyGrid._options.dataSource[i].ItemSize;
            newData.GSM = DataCompanyGrid._options.dataSource[i].GSM;
            newData.Manufecturer = DataCompanyGrid._options.dataSource[i].Manufecturer;
            newData.Finish = DataCompanyGrid._options.dataSource[i].Finish;
            newData.PackingType = DataCompanyGrid._options.dataSource[i].PackingType;
            newData.UnitPerPacking = DataCompanyGrid._options.dataSource[i].UnitPerPacking;
            newData.EstimationRate = DataCompanyGrid._options.dataSource[i].EstimationRate;
            newData.SizeW = DataCompanyGrid._options.dataSource[i].SizeW;
            newData.SizeL = DataCompanyGrid._options.dataSource[i].SizeL;
            newData.Caliper = DataCompanyGrid._options.dataSource[i].Caliper;
            newData.EstimationUnit = DataCompanyGrid._options.dataSource[i].EstimationUnit;
            newData.MinimumStockQty = DataCompanyGrid._options.dataSource[i].MinimumStockQty;
            newData.IsStandardItem = DataCompanyGrid._options.dataSource[i].IsStandardItem;
            newData.ItemType = dxboxval;
            AllData.push(newData);
        }
        $("#ClientGrid").dxDataGrid({
            dataSource: AllData
        });

        DevExpress.ui.notify("All Items added..!", "success", 500);


    } catch (e) {
        console.log(e);
    }
});

$("#BtnSave").click(function () {

    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    var grids = $('#ClientGrid').dxDataGrid('instance');
    var totalrow = grids._options.dataSource.length;
    if (totalrow <= 0) {
        return;
    }
    var ObjSaveData = [], SaveData = {};
    for (var i = 0; i < grids._options.dataSource.length; i++) {
        SaveData = {};
        SaveData.ItemCode = "";
        SaveData.MaxItemNo = "";
        SaveData.ItemGroupID = grids._options.dataSource[i].ItemGroupID;
        SaveData.ItemName = grids._options.dataSource[i].ItemName;
        SaveData.ItemSize = grids._options.dataSource[i].ItemSize;
        SaveData.Quality = grids._options.dataSource[i].Quality;
        SaveData.GSM = grids._options.dataSource[i].GSM;
        SaveData.Manufecturer = grids._options.dataSource[i].Manufecturer;
        SaveData.Finish = grids._options.dataSource[i].Finish;
        SaveData.PackingType = grids._options.dataSource[i].PackingType;
        SaveData.UnitPerPacking = grids._options.dataSource[i].UnitPerPacking;
        SaveData.WtPerPacking = grids._options.dataSource[i].WtPerPacking;
        SaveData.SizeW = grids._options.dataSource[i].SizeW;
        SaveData.SizeL = grids._options.dataSource[i].SizeL;
        SaveData.Caliper = grids._options.dataSource[i].Caliper;
        SaveData.EstimationRate = grids._options.dataSource[i].EstimationRate;
        SaveData.EstimationUnit = grids._options.dataSource[i].EstimationUnit;
        SaveData.ItemType = grids._options.dataSource[i].ItemType;
        SaveData.MinimumStockQty = grids._options.dataSource[i].MinimumStockQty;
        SaveData.IsStandardItem = grids._options.dataSource[i].IsStandardItem;
        ObjSaveData.push(SaveData);
    }
    var approveobj = JSON.stringify(ObjSaveData);

    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/Save_Import_Data",
        data: '{approveobj:' + approveobj + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            if (res === "Success") {
                DevExpress.ui.notify(" Data Saved successfully! ", "success", 2500);
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                $('#ClientGrid').dxDataGrid({ dataSource: [] });
            } else if (res === "Session Expired") {
                DevExpress.ui.notify(res, "error", 1500);
                alert("Login session expired..!\n Please login and save order again..!");
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            } else {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                $('#ClientGrid').dxDataGrid({ dataSource: [] });
                return;
            }
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
});