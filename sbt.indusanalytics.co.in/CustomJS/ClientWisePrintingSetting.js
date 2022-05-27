"use strict";
var Client_Machine_Cost_ID = 0;

$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus Logo.png",
    message: 'Loading...',
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: true
});

$("#Machine").dxSelectBox({
    items: [],
    valueExpr: "MachineId",
    displayExpr: "MachineName",
    placeholder: "Select Machine",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var MachineID = data.value;
        if (MachineID === null) return;
        var ClientID = $('#Client').dxSelectBox('instance').option('value');
        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: 'POST',
            url: "WebServiceOthers.asmx/GetMachineData",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: '{MachineID :' + JSON.stringify(MachineID) + ',ClientID:' + JSON.stringify(ClientID) + '}',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/":,"/g, ':null,');
                res = res.replace(/":}"/g, ':null}');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);

                var RES1 = JSON.parse(res);
                $("#DataGrid").dxDataGrid({ dataSource: RES1 });
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR.message);
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            }
        });
    }
});

$("#Client").dxSelectBox({
    items: [],
    valueExpr: "LedgerID",
    displayExpr: "LedgerName",
    placeholder: "Select Client",
    searchEnabled: true,
    showClearButton: true
});

$.ajax({
    type: 'POST',
    url: "WebServiceOthers.asmx/GetMachineSelectBox",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        $("#Machine").dxSelectBox({ items: JSON.parse(res.toString()) });
    },
    error: function errorFunc(jqXHR) {
        alert(jqXHR.message);
    }
});

$.ajax({
    type: 'POST',
    url: "WebServiceOthers.asmx/GetClientSelectBox",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        $("#Client").dxSelectBox({ items: JSON.parse(res.toString()) });
    },
    error: function errorFunc(jqXHR) {
        alert(jqXHR.message);
        $("#image-indicator").dxLoadPanel("instance").option("visible", false);
    }
});

$('#Roundofimp').on('change', function () {
    $("#TypeofCharges").dxSelectBox({
        placeholder: "Select Charges",
        items: ["Impressions", "Impressions/" + document.getElementById("Roundofimp").value, "Impressions/Color", "Impressions/" + document.getElementById("Roundofimp").value + "/Color"],
        showClearButton: true
    });
});

$("#TypeofCharges").dxSelectBox({
    placeholder: "Select Charges",
    items: ["Impressions", "Impressions/" + document.getElementById("Roundofimp").value, "Impressions/Color", "Impressions/" + document.getElementById("Roundofimp").value + "/Color"],
    showClearButton: true
});

$("#DataGrid").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    scrolling: { mode: 'infinite' },
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
    columns: [
        { dataField: "PaperGroup", caption: "Paper Group", validationRules: [{ type: "required" }] },
        { dataField: "MaxPlanW", caption: "Max Plan W", validationRules: [{ type: "required" }] },
        { dataField: "MaxPlanL", caption: "Max Plan L", validationRules: [{ type: "required" }] },
        { dataField: "SheetRangeFrom", caption: "Sheet From", validationRules: [{ type: "required" }] },
        { dataField: "SheetRangeTo", caption: "Sheet To", validationRules: [{ type: "required" }] },
        { dataField: "MinCharges", caption: "Min. Charges", validationRules: [{ type: "required" }] },
        { dataField: "Rate", caption: "Rate", validationRules: [{ type: "required" }] },
        { dataField: "Wastage", caption: "Wastage %", validationRules: [{ type: "required" }] },
        { dataField: "PLateCharges", caption: "CTP", validationRules: [{ type: "required" }] },
        { dataField: "PSPlateCharges", caption: "PS", validationRules: [{ type: "required" }] },
        { dataField: "CTCPPlateCharges", caption: "CTPC", validationRules: [{ type: "required" }] },
        { dataField: "SpecialColorFrontCharges", caption: "Sp.Color F.Charges", validationRules: [{ type: "required" }] },
        { dataField: "SpecialColorBackCharges", caption: "Sp.Color B.Charges", validationRules: [{ type: "required" }] }
    ],
    height: function () {
        return window.innerHeight / 1.35;
    },
    editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        useIcon: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    }
});

$("#ShowList").dxDataGrid({
    dataSource: [],
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    selection: { mode: 'single' },
    scrolling: { mode: 'infinite' },
    columns: [
        { dataField: "LedgerName", caption: "Client Name" },
        { dataField: "MachineName", caption: "Machine Name" }
    ],
    height: function () {
        return window.innerHeight / 1.3;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    }
});

$("#BtnDelete").click(function () {
    if (Client_Machine_Cost_ID === 0) {
        swal("Please select any row from the given list", "", "warning");
        return;
    }
    swal({
        title: "Deleting...",
        text: "Are you sure to delete the clientwise rate setting ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: true,
        confirmButtonText: "Yes"
    }, function (e) {
        if (e === true) {
            $.ajax({
                type: 'POST',
                url: "WebServiceOthers.asmx/DeleteCostSetting",
                dataType: 'text',
                contentType: "application/json; charset=utf-8",
                data: '{Client_Machine_Cost_ID :' + JSON.stringify(Client_Machine_Cost_ID) + '}',
                success: function (results) {
                    var res = results.replace(/"/g, '');
                    res = res.replace(/d:/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');

                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                    if (res === "Success") {
                        DevExpress.ui.notify("Deleted successfully! ", "success", 2000);
                        newData();
                    } else {
                        DevExpress.ui.notify(res, "error", 2500);
                        return;
                    }
                },
                error: function errorFunc(jqXHR) {
                    alert(jqXHR.message);
                    $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                }
            });
        }
    });
});

$("#BtnNext").click(function () {
    var grid = $('#ShowList').dxDataGrid('instance');
    var selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length <= 0) {
        DevExpress.ui.notify("Please select any row from the given list..?", "warning", 1400);
        return;
    }

    Client_Machine_Cost_ID = selectedRows[0].ClientMachineCostID;
    $("#Client").dxSelectBox({ value: selectedRows[0].LedgerID });
    document.getElementById("Mini_Sheets").value = selectedRows[0].MinimumSheet;
    document.getElementById("BPC").value = selectedRows[0].BasicPrintingCharges;
    document.getElementById("Roundofimp").value = selectedRows[0].RoundofImpressionsWith;
    $("#TypeofCharges").dxSelectBox({ value: selectedRows[0].ChargesType });
    $("#Machine").dxSelectBox({ value: selectedRows[0].MachineID });

    ClosePopup("BtnNext", "#ModalShowlist");
});

$("#BtnSave").click(function () {

    var Machine = $('#Machine').dxSelectBox('instance').option('value');
    if (Machine === null || Machine === 0) {
        alert("Please select machine..!");
        return;
    }
    var Client = $('#Client').dxSelectBox('instance').option('value');
    if (Client === null || Client === 0) {
        alert("Please select client..!");
        return;
    }
    var TypeofCharges = $('#TypeofCharges').dxSelectBox('instance').option('value');
    if (TypeofCharges === null) {
        alert("Please select type of charges..!");
        return;
    }
    var grid = $('#DataGrid').dxDataGrid('instance');
    if (grid._options.dataSource.length <= 0) {
        alert("Please make sure you have at least a row in the data grid.");
        return;
    }
    /// to check Setting for this machine and client already available or not.
    var MachineID = $('#Machine').dxSelectBox('instance').option('value');
    var ClientID = $('#Client').dxSelectBox('instance').option('value');

    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: 'POST',
        url: "WebServiceOthers.asmx/CheckPreEntry",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        data: '{MachineID :' + JSON.stringify(MachineID) + ',ClientId :' + JSON.stringify(ClientID) + '}',
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            if (res === "True" || res === true) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                swal({
                    title: "Replacing Existing Setting",
                    text: "Setting for this machine and client already available.\n Are you sure to replace it? ",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: true,
                    confirmButtonText: "Yes"
                }, function (e) {
                    if (e === true) {
                        SaveData();
                    }
                });
            } else if (res.includes("not authorized")) {
                DevExpress.ui.notify(res, "error", 2500);
            } else {
                SaveData();
            }
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
});

function SaveData() {
    var grids = $('#DataGrid').dxDataGrid('instance');
    var ObjSaveOrder = [], SaveOrder = {};

    for (let i = 0; i < grids._options.dataSource.length; i++) {
        SaveOrder = {};

        SaveOrder.SlabID = i + 1;
        SaveOrder.MachineID = $('#Machine').dxSelectBox('instance').option('value');
        SaveOrder.LedgerID = $('#Client').dxSelectBox('instance').option('value');
        SaveOrder.ChargesType = $('#TypeofCharges').dxSelectBox('instance').option('value');
        SaveOrder.BasicPrintingCharges = document.getElementById("BPC").value;
        SaveOrder.RoundofImpressionsWith = document.getElementById("Roundofimp").value;
        SaveOrder.MinimumSheet = document.getElementById("Mini_Sheets").value;

        SaveOrder.MaxPlanW = grids._options.dataSource[i].MaxPlanW;
        SaveOrder.MaxPlanL = grids._options.dataSource[i].MaxPlanL;
        SaveOrder.SheetRangeFrom = grids._options.dataSource[i].SheetRangeFrom;
        SaveOrder.SheetRangeTo = grids._options.dataSource[i].SheetRangeTo;
        SaveOrder.Rate = grids._options.dataSource[i].Rate;
        SaveOrder.PLateCharges = grids._options.dataSource[i].PLateCharges;
        SaveOrder.PSPlateCharges = grids._options.dataSource[i].PSPlateCharges;
        SaveOrder.CTCPPlateCharges = grids._options.dataSource[i].CTCPPlateCharges;
        SaveOrder.Wastage = grids._options.dataSource[i].Wastage;
        SaveOrder.SpecialColorFrontCharges = grids._options.dataSource[i].SpecialColorFrontCharges;
        SaveOrder.SpecialColorBackCharges = grids._options.dataSource[i].SpecialColorBackCharges;
        SaveOrder.MinCharges = grids._options.dataSource[i].MinCharges;
        SaveOrder.PaperGroup = grids._options.dataSource[i].PaperGroup;
        ObjSaveOrder.push(SaveOrder);
    }

    $.ajax({
        type: 'POST',
        url: "WebServiceOthers.asmx/SaveClientSetting",
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        data: '{ObjSaveOrder :' + JSON.stringify(ObjSaveOrder) + '}',
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);

            if (res === "Success") {
                DevExpress.ui.notify("Information saved successfully! ", "success", 2500);
                newData();
            } else {
                DevExpress.ui.notify(res, "error", 2500);
            }
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
}

function newData() {
    Client_Machine_Cost_ID = 0;
    document.getElementById("Mini_Sheets").value = "";
    document.getElementById("BPC").value = "";
    document.getElementById("Roundofimp").value = 1000;
    $("#TypeofCharges").dxSelectBox({ value: null });
    $("#Client").dxSelectBox({ value: null });
    $("#Machine").dxSelectBox({ value: null });
    $("#DataGrid").dxDataGrid({ dataSource: [] });
}

$("#BtnShow").click(function () {
    $("#image-indicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        async: false,
        type: 'POST',
        url: "WebServiceOthers.asmx/GetShowList",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{}',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/":,"/g, ':null,');
            res = res.replace(/":}"/g, ':null}');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res);
            $("#ShowList").dxDataGrid({
                dataSource: RES1
            });
            OpenPopup("BtnShow", "#ModalShowlist");
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR.message);
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
        }
    });
});

function OpenPopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-toggle", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}

function ClosePopup(ID, modalId) {
    document.getElementById(ID).setAttribute("data-dismiss", "modal");
    document.getElementById(ID).setAttribute("data-target", modalId);
}