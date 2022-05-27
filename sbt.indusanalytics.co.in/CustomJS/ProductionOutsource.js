"use strict";
var GblBKID = 0, GblContID = 0, GblOutsourceID = 0;
var GblSelectedContentData = [];
var GblShowListSelectedData = [];

//init select and date box
$("#VoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
    max: new Date().toISOString().substr(0, 10)
});

$("#SelVendorName").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    onValueChanged: function (e) {
        if (e.value) {
            var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.LedgerID === e.value; });
            if (result.length === 1) {
                document.getElementById("TxtDestination").value = result[0].City;
            }
        }
    }
});

$("#SelOperators").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'OperatorName',
    valueExpr: 'OperatorID',
    searchEnabled: true,
    showClearButton: true
});

$("#SelMachines").dxSelectBox({
    placeholder: "Select--",
    displayExpr: 'MachineName',
    valueExpr: 'MachineID',
    searchEnabled: true,
    showClearButton: true
});

$("#SelJobCard").dxSelectBox({
    items: [],
    placeholder: "Select Job--",
    displayExpr: 'JobBookingNo',
    valueExpr: 'JobBookingID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var JCId = data.value;
        if (JCId === null) {
            $("#BtnNew").click();
        } else
            GetContentList(JCId);
    }
});

$("#OptionItemIssuedList").dxRadioGroup({
    items: ["Job Allocated", "All"],
    value: "Job Allocated",
    layout: 'horizontal',
    onValueChanged: function (e) {
        if (e.value === null) return;
        GetProcessWiseMaterial(e.value);
    }
});

////init datagrid 
var dataGridContents = $("#gridJobCardContentsList").dxDataGrid({
    dataSource: [],
    showBorders: true,
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    sorting: {
        mode: "single"
    },
    selection: { mode: "single" },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "LedgerName", caption: "Client Name", width: 100 },
        { dataField: "JobName", caption: "Job Name", width: 100 },
        { dataField: "SalesOrderNO", caption: "Sales Order No" },
        { dataField: "PONO", caption: "PO No", width: 60 },
        { dataField: "JobCardContentNo", caption: "JC Content No" },
        { dataField: "PlanContName", caption: "Content Name", width: 180 },
        { dataField: "JobBookingDate", caption: "Job Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "DeliveryDate", caption: "Delivery Date", dataType: "date", format: 'dd-MMM-yyyy', width: 80 },
        { dataField: "OrderQuantity", caption: "JC Qty" },
        { dataField: "ProductCode", caption: "Product Code" },
        { dataField: "JobPriority", caption: "Priority" },
        { dataField: "JobType", caption: "Job Type" },
        { dataField: "ItemCode", caption: "Item Code" },
        { dataField: "ItemType", caption: "Item Type" },
        { dataField: "ItemName", caption: "Item Name", width: 150 },
        { dataField: "FullSheets", caption: "Full Sheets" },
        { dataField: "ActualSheets", caption: "Actual Sheets" }
    ],
    onSelectionChanged: function (selectedItem) {
        var data = selectedItem.selectedRowsData;

        clearGrids();

        if (data.length > 0) {
            GblContID = data[0].JobBookingJobCardContentsID;
            GblSelectedContentData = data;

            $("#OptionItemIssuedList").dxRadioGroup({
                value: "Job Allocated"
            });

            $.ajax({
                type: "POST",
                url: "WebServiceProductionOutsource.asmx/GetContentWiseProcessDetail",
                data: '{ContID:' + GblContID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/u0027/g, "'");
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res);
                    $("#gridProcessDetail").dxDataGrid({ dataSource: RES1 });
                }
            });
        }
    }
}).dxDataGrid("instance");

$("#gridProcessDetail").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: { enabled: false },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    filterRow: { visible: true, applyFilter: "auto" },
    height: function () {
        return window.innerHeight / 2.5;
    },
    sorting: {
        mode: "none"
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "ScheduleQty", caption: "Schedule Qty", allowEditing: false },
        { dataField: "PreProcessQty", caption: "Received Qty", allowEditing: true },
        { dataField: "ReadyQuantity", caption: "Ready Qty", allowEditing: false },
        {
            dataField: "AddProcess", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
            }
        }
    ],
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "AddProcess") {
            try {

                var newdata = [];
                var dataGrid = $('#gridAddedProcessDetail').dxDataGrid('instance');
                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ScheduleQty === clickedCell.data.ScheduleQty && e.ProcessID === clickedCell.data.ProcessID && e.JobCardFormNo === clickedCell.data.JobCardFormNo && e.RateFactor === clickedCell.data.RateFactor; });
                if (result.length === 1) {
                    return;
                }

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);
                newdata = clickedCell.data;
                if (newdata.PreProcessQty > 0) {
                    newdata.ScheduleQty = newdata.PreProcessQty;
                }
                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#gridMaterialsDetail").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    filterRow: { visible: true, applyFilter: "auto" },
    columns: [{ dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", caption: "Item Name", width: 180, allowEditing: false }, { dataField: "ItemGroupName", caption: "Item Group", allowEditing: false },
    { dataField: "FloorStock", allowEditing: false }, { dataField: "IssueQuantity", allowEditing: false }, { dataField: "RequiredQty", allowEditing: true },
    { dataField: "StockUnit", allowEditing: false }, { dataField: "Remark", caption: "WIP - Item Description", MinWidth: 100, allowEditing: true }, { dataField: "ProcessingQty", allowEditing: true }, { dataField: "WIPUnit", caption: "WIP Unit", allowEditing: true },
    {
        dataField: "AddMaterial", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 25,
        cellTemplate: function (container, options) {
            $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
        }
    }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    height: function () {
        return window.innerHeight / 2.5;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onRowUpdating: function (e) {
        if (Number(e.newData.RequiredQty) <= 0)
            e.newData.RequiredQty = e.oldData.RequiredQty;
    },
    onRowUpdated: function (e) {
        if (e.data.IssueQuantity < e.data.RequiredQty)
            e.data.RequiredQty = e.data.IssueQuantity;
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "AddMaterial") {
            try {
                if (Number(clickedCell.data.RequiredQty <= 0)) {
                    DevExpress.ui.notify("Please enter valid Required Qty..", "warning", 1500);
                    return;
                }
                var dataGrid = $('#gridAddedMaterialsDetail').dxDataGrid('instance');
                var result = $.grep(dataGrid._options.dataSource, function (e) {
                    return e.ScheduleQty === clickedCell.data.ScheduleQty && e.ItemCode === clickedCell.data.ItemCode
                        && e.ItemID === clickedCell.data.ItemID && e.BatchNo === clickedCell.data.BatchNo;
                });
                if (result.length === 1) {
                    return;
                }

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                var newdata = clickedCell.data;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#gridAddedProcessDetail").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: { enabled: false },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 2.5;
    },
    sorting: {
        mode: "none"
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "ScheduleQty", caption: "Schedule/Received Qty", allowEditing: false },
        { dataField: "ReadyQuantity", caption: "Ready Qty", allowEditing: false },
        {
            dataField: "AddMaterial", caption: "Add Material", visible: true, fixedPosition: "right", fixed: true, width: 80,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn')
                    .on('dxclick', function () {
                        var data = []; data.push(options.data);
                        $("#gridShowSelectedProcess").dxDataGrid({ dataSource: data });
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#largeModalMaterials");
                    }).appendTo(container);
            }
        },
        {
            dataField: "RemoveProcess", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        }
    ],
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "RemoveProcess") {
            try {
                var dataGrid = $('#gridProcessDetail').dxDataGrid('instance');
                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ScheduleQty === clickedCell.data.ScheduleQty && e.ProcessID === clickedCell.data.ProcessID && e.JobCardFormNo === clickedCell.data.JobCardFormNo && e.RateFactor === clickedCell.data.RateFactor; });
                if (result.length === 1) {
                    return;
                }

                var newdata = clickedCell.data;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#gridAddedMaterialsDetail").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    columns: [{ dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", caption: "Item Name", allowEditing: false }, { dataField: "ItemGroupName", caption: "Item Group", allowEditing: false },
    { dataField: "FloorStock", allowEditing: false }, { dataField: "IssueQuantity", allowEditing: false }, { dataField: "RequiredQty", allowEditing: true },
    { dataField: "StockUnit", allowEditing: false }, { dataField: "Remark", caption: "WIP - Item Description", allowEditing: false }, { dataField: "ProcessingQty", allowEditing: true }, { dataField: "WIPUnit", caption: "WIP Unit", allowEditing: false },
    {
        dataField: "RemoveMaterial", caption: "", visible: true, allowEditing: false, fixedPosition: "right", fixed: true, width: 20,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 3;
    },
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
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.dataField === "RemoveMaterial") {
            try {

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                var dataGrid = $('#gridMaterialsDetail').dxDataGrid('instance');
                var newdata = clickedCell.data;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);
            } catch (e) {
                console.log(e);
            }
        }
    }
});

$("#gridAddedContentsDetail").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    columns: [{ dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", width: 180 },
    { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
    { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
    { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
    { dataField: "ReadyQuantity", caption: "Ready Qty", allowEditing: false },
    { dataField: "ItemCode", allowEditing: false }, { dataField: "ItemName", caption: "Item Name", allowEditing: false }, { dataField: "ItemGroupName", caption: "Item Group", allowEditing: false },
    { dataField: "RequiredQty", allowEditing: false }, { dataField: "StockUnit", allowEditing: false }, { dataField: "Remark", caption: "WIP - Item Description", allowEditing: false }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    editing: {
        mode: 'cell',
        allowDeleting: true,
        allowUpdating: true
    },
    height: function () {
        return window.innerHeight / 2.5;
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

$("#gridShowSelectedProcess").dxDataGrid({
    dataSource: [],
    showBorders: true,
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "none"
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', 'white');
            e.rowElement.css('color', 'black');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "ScheduleQty", caption: "Schedule Qty", allowEditing: false },
        { dataField: "ReadyQuantity", caption: "Ready Qty", allowEditing: false },
        { dataField: "PreProcessQty", caption: "Previous Process Qty", allowEditing: false },
        {
            dataField: "AddMaterial", caption: "Add Base Material", visible: true, fixedPosition: "right", fixed: true,
            cellTemplate: function (container, options) {
                if (Number(options.data.ReadyQuantity) > 0 || Number(options.data.PreProcessQty) > 0) {
                    $('<div>').addClass('fa fa-plus customgridbtn')
                        .on('dxclick', function () {
                            addBaseMaterial(options.data);
                        }).appendTo(container);
                }
            }
        }
    ]
});

$("#gridShowList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    sorting: { mode: 'multiple' },
    filterRow: { visible: true, applyFilter: "auto" },
    columns: [{ dataField: "JobName", caption: "Job Name" }, { dataField: "LedgerName", caption: "Vendor Name" }, { dataField: "VoucherNo", caption: "Send Voucher No" }, { dataField: "VoucherDate", caption: "Send Date" },
    { dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", maxWidth: 180 },
    { dataField: "Remark", caption: "Remark", maxWidth: 180 }, { dataField: "QuantitySent", caption: "Send Qty" }, { dataField: "QuantityReceive", caption: "Received Qty" }, { dataField: "PendingToReceive", caption: "Pending Qty" }, { dataField: "ReceiptVoucherNo", caption: "Received No" }, { dataField: "ReceiptVoucherDate", caption: "Received Date" }, { dataField: "UserName", caption: "Created By" }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (selectedItem) {
        var data = selectedItem.selectedRowsData;
        GblOutsourceID = 0;
        GblShowListSelectedData = [];
        if (data.length > 0) {
            GblOutsourceID = data[0].OutsourceID;
            GblShowListSelectedData = data;
        }
    }
});

///Ajax
try {

    //Vendors
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetVendorsList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#SelVendorName").dxSelectBox({
                items: RES1
            });
        }
    });

    //Operators
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetOutsourceOperators",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            var dis = false, value = null;
            if (RES1.length === 1) { dis = true; value = RES1[0].OperatorID; }
            $("#SelOperators").dxSelectBox({
                items: RES1,
                disabled: dis,
                value: value
            });
        }
    });

    //Machines
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetOutsourceMachines",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            var dis = false, value = null;
            if (RES1.length === 1) { dis = true; value = RES1[0].MachineID; }
            $("#SelMachines").dxSelectBox({
                items: RES1,
                disabled: dis,
                value: value
            });
        }
    });

    //SelJobCard
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetScheduledJobCard",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);

            $("#SelJobCard").dxSelectBox({
                items: RES1
            });
        }
    });


} catch (e) {
    console.log(e);
}

////Functions
function GetContentList(JCId) {
    try {
        ///Job contents list
        $.ajax({
            type: "POST",
            url: "WebServiceProductionOutsource.asmx/GetScheduledJobCardContents",
            data: '{JCId:' + JCId + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                $("#gridJobCardContentsList").dxDataGrid({
                    dataSource: RES1
                });
            },
            error: function errorFunc(jqXHR) {
                alert(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function GetProcessWiseMaterial(OprType) {
    $("#gridMaterialsDetail").dxDataGrid({ dataSource: [] });
    $("#gridAddedMaterialsDetail").dxDataGrid({ dataSource: [] });
    if (GblContID <= 0) return;
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetContentWiseProcessMaterialsDetail",
        data: '{ContID:' + GblContID + ',OprType:' + JSON.stringify(OprType) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#gridMaterialsDetail").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

function clearGrids() {
    GetVoucherNo();
    GblSelectedContentData = [];
    GblContID = 0;
    GblOutsourceID = 0;
    $("#gridProcessDetail").dxDataGrid({ dataSource: [] });
    $("#gridMaterialsDetail").dxDataGrid({ dataSource: [] });
    $("#gridAddedProcessDetail").dxDataGrid({ dataSource: [] });
    $("#gridAddedContentsDetail").dxDataGrid({ dataSource: [] });
}

function addBaseMaterial(data) {
    try {
        var dataGrid = $('#gridMaterialsDetail').dxDataGrid('instance');
        var result = $.grep(dataGrid._options.dataSource, function (e) {
            return e.ItemID === 0 && e.ProcessID === data.ProcessID;
        });
        if (result.length === 1) {
            DevExpress.ui.notify("Base material already added for this process..", "warning", 1500);
            return;
        }

        var newdata = {};
        newdata.ItemCode = 'BS0001';
        newdata.ItemID = 0;
        newdata.ItemName = "(Base Material) " + GblSelectedContentData[0].ItemName;
        newdata.Remark = "(Base Material) ";
        newdata.ScheduleQty = data.ScheduleQty;
        newdata.IssueQuantity = data.PreProcessQty;
        newdata.RequiredQty = data.ReadyQuantity;
        newdata.FloorStock = data.ReadyQuantity;
        newdata.StockUnit = "Sheet";
        newdata.ItemGroupName = GblSelectedContentData[0].ItemType;
        newdata.ProcessID = data.ProcessID;

        var clonedItem = $.extend({}, newdata);
        dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
        dataGrid.refresh(true);

    } catch (e) {
        console.log(e);
    }
}

GetSavedData();
function GetSavedData() {    
    $("#gridShowList").dxDataGrid({ dataSource: [] });
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetShowList",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#gridShowList").dxDataGrid({
                dataSource: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}

GetVoucherNo();
function GetVoucherNo() {
    //Voucher No
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetOutsourceVoucherNo",
        data: '{prefix:' + JSON.stringify("OS") + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res !== "fail") {
                document.getElementById("LblPONo").value = res;
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//// Btn Clicks
$("#BtnNew").click(function () {
    clearGrids();
    $("#gridJobCardContentsList").dxDataGrid({ dataSource: [] });
    document.getElementById("TxtRemarks").value = "";
    $("#SelVendorName").dxSelectBox({ value: null });
    $("#SelJobCard").dxSelectBox({ value: null });
    GetSavedData();
});

$("#BtnApplyMaterial").click(function () {
    try {
        if (GblSelectedContentData.length <= 0) {
            return;
        }
        var dataGridMaterials = $('#gridAddedMaterialsDetail').dxDataGrid('instance');
        var dataGridProcess = $('#gridShowSelectedProcess').dxDataGrid('instance');
        var dataGridContent = $("#gridAddedContentsDetail").dxDataGrid('instance');

        if (dataGridProcess._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please select process again..", "warning", 1500);
            return;
        }

        if (dataGridMaterials._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please add material first..", "warning", 1500);
            return;
        }

        var ObjItemList = {};
        var ArrObjItemList = dataGridContent._options.dataSource;

        for (var i = 0; i < dataGridMaterials._options.dataSource.length; i++) {
            ObjItemList = {};

            ObjItemList = dataGridMaterials._options.dataSource[i];
            ObjItemList.ProcessID = dataGridProcess._options.dataSource[0].ProcessID;
            ObjItemList.ProcessName = dataGridProcess._options.dataSource[0].ProcessName;
            ObjItemList.RateFactor = dataGridProcess._options.dataSource[0].RateFactor;
            ObjItemList.JobCardFormNo = dataGridProcess._options.dataSource[0].JobCardFormNo;
            ObjItemList.ReadyQuantity = dataGridProcess._options.dataSource[0].ReadyQuantity;
            ObjItemList.PlanContName = GblSelectedContentData[0].PlanContName;
            ObjItemList.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;
            ObjItemList.JobCardContentNo = GblSelectedContentData[0].JobCardContentNo;

            var result = $.grep(ArrObjItemList, function (e) {
                return e.JobBookingJobCardContentsID === dataGridProcess._options.dataSource[0].JobBookingJobCardContentsID
                    && e.ItemID === dataGridMaterials._options.dataSource[i].ItemID && e.BatchNo === dataGridMaterials._options.dataSource[i].BatchNo && e.ProcessID === dataGridMaterials._options.dataSource[i].ProcessID && e.JobCardFormNo === dataGridMaterials._options.dataSource[i].JobCardFormNo
                    && e.RateFactor === dataGridMaterials._options.dataSource[i].RateFactor;
            });
            if (result.length === 1) {
                continue;
            }
            ArrObjItemList.push(ObjItemList);
        }

        $("#gridAddedContentsDetail").dxDataGrid({ dataSource: ArrObjItemList });
    } catch (e) {
        console.log(e);
    }
});

$("#BtnSave").click(function () {
    try {
        if (GblOutsourceID > 0) return;

        var gridContents = $('#gridAddedContentsDetail').dxDataGrid('instance');
        var dataGridProcess = $('#gridAddedProcessDetail').dxDataGrid('instance');
        var Remark = document.getElementById("TxtRemarks").value.trim();
        var TxtDestination = document.getElementById("TxtDestination").value.trim();
        var VendorID = $('#SelVendorName').dxSelectBox('instance').option('value');
        var JobCardID = $('#SelJobCard').dxSelectBox('instance').option('value');
        var VoucherDate = $("#VoucherDate").dxDateBox('instance').option('value');

        var OperatorID = $('#SelOperators').dxSelectBox('instance').option('value');
        var MachineID = $('#SelMachines').dxSelectBox('instance').option('value');

        var BaseMaterialSelct = "";

        if (JobCardID <= 0 || JobCardID === null || JobCardID === undefined) {
            DevExpress.ui.notify("Please select Job Card first..", "warning", 1500);
            return;
        }
        if (dataGridProcess._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please add process first..", "warning", 1500);
            return;
        }
        if (gridContents._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please add material first..", "warning", 1500);
            ///return;
        }
        if (VendorID <= 0 || VendorID === null || VendorID === undefined) {
            DevExpress.ui.notify("Please select vendor first..", "warning", 1500);
            return;
        }
        if (MachineID <= 0 || MachineID === null || MachineID === undefined) {
            DevExpress.ui.notify("Please select machine first..", "warning", 1500);
            return;
        }
        if (OperatorID <= 0 || OperatorID === null || OperatorID === undefined) {
            DevExpress.ui.notify("Please select operator first..", "warning", 1500);
            return;
        }

        var result = $.grep(gridContents._options.dataSource, function (e) {
            return e.ItemID === 0 || e.ItemGroupID === 1;
        });
        if (result.length === 0) {
            BaseMaterialSelct = "Base material is not added.\n";
            DevExpress.ui.notify("Base material is not added for outsource send..", "warning", 1500);
        }

        var ObjData = {};
        var ArrObjData = [];

        ObjData.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;
        ObjData.JobBookingID = JobCardID;
        ObjData.WorkOrderType = "Outsource Send";
        ObjData.LedgerID = VendorID;
        ObjData.Remark = Remark;
        ObjData.PlaceOfSupply = TxtDestination;
        ArrObjData.push(ObjData);

        /////Material Consume data
        var ObjDataMain = {};
        var ArrObjDataMain = [];

        ObjDataMain.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;
        ObjDataMain.JobBookingID = JobCardID;
        ObjDataMain.VoucherDate = VoucherDate;

        ArrObjDataMain.push(ObjDataMain);

        var ObjDataDetails = {};
        var ArrObjDataDetails = [];

        for (var i = 0; i < gridContents._options.dataSource.length; i++) {
            ObjDataDetails = {};

            ObjDataDetails.ItemID = gridContents._options.dataSource[i].ItemID;
            ObjDataDetails.JobBookingID = JobCardID;
            ObjDataDetails.JobBookingJobCardContentsID = gridContents._options.dataSource[i].JobBookingJobCardContentsID;
            ObjDataDetails.ItemGroupID = gridContents._options.dataSource[i].ItemGroupID;
            ObjDataDetails.ProcessID = gridContents._options.dataSource[i].ProcessID;
            ObjDataDetails.IssueTransactionID = gridContents._options.dataSource[i].IssueTransactionID;
            ObjDataDetails.ParentTransactionID = gridContents._options.dataSource[i].ParentTransactionID;
            ObjDataDetails.DepartmentID = gridContents._options.dataSource[i].DepartmentID;
            ObjDataDetails.BatchNo = gridContents._options.dataSource[i].BatchNo;
            ObjDataDetails.WarehouseID = gridContents._options.dataSource[i].WarehouseID;
            ObjDataDetails.FloorWarehouseID = gridContents._options.dataSource[i].FloorWarehouseID;
            ObjDataDetails.MachineID = MachineID;
            ObjDataDetails.IssueQuantity = gridContents._options.dataSource[i].RequiredQty;
            ObjDataDetails.StockUnit = gridContents._options.dataSource[i].StockUnit;
            ObjDataDetails.Remark = gridContents._options.dataSource[i].Remark; //WIP - Item Description
            if (gridContents._options.dataSource[i].Remark === "") {
                DevExpress.ui.notify("WIP - Item Description is empty..", "warning", 1500);
                return;
            }
            ObjDataDetails.TransID = i + 1;

            ObjDataDetails.ProcessingQty = gridContents._options.dataSource[i].ProcessingQty;
            if (gridContents._options.dataSource[i].ProcessingQty === "" || Number(gridContents._options.dataSource[i].ProcessingQty) <= 0) {
                DevExpress.ui.notify("Processing quantity is invalid or empty..", "warning", 1500);
                return;
            }
            ObjDataDetails.WIPUnit = gridContents._options.dataSource[i].WIPUnit;
            if (gridContents._options.dataSource[i].WIPUnit === "" || gridContents._options.dataSource[i].WIPUnit === null) {
                DevExpress.ui.notify("WIP - Unit is empty..", "warning", 1500);
                return;
            }

            ArrObjDataDetails.push(ObjDataDetails);
        }

        ///Process 
        var ObjDataProcess = {};
        var ArrObjDataProcess = [];

        //////Production Entry
        var objMachineEntry = [];
        var OptMachineEntry = {};

        //////Production Forms
        var objFormsEntry = [];
        var OptFormsEntry = {};

        for (var j = 0; j < dataGridProcess._options.dataSource.length; j++) {
            ObjDataProcess = {};

            ObjDataProcess.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;
            ObjDataProcess.JobBookingID = JobCardID;
            ObjDataProcess.JobCardContentNo = GblSelectedContentData[0].JobCardContentNo;
            ObjDataProcess.PlanContName = GblSelectedContentData[0].PlanContName;
            ObjDataProcess.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            ObjDataProcess.RateFactor = dataGridProcess._options.dataSource[j].RateFactor;
            ObjDataProcess.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            ObjDataProcess.ReadyQuantity = dataGridProcess._options.dataSource[j].ReadyQuantity;
            ObjDataProcess.QuantitySent = dataGridProcess._options.dataSource[j].ScheduleQty;
            ObjDataProcess.VendorID = VendorID;
            ObjDataProcess.SequenceNo = j + 1;

            ArrObjDataProcess.push(ObjDataProcess);

            //////Production Entry
            OptMachineEntry = {};

            OptMachineEntry.ConversionValue = 1;
            OptMachineEntry.MachineID = MachineID;
            OptMachineEntry.EmployeeID = OperatorID;
            OptMachineEntry.EntryType = 'Outsource';
            OptMachineEntry.Status = "Outsource Send";
            OptMachineEntry.JobBookingID = JobCardID;
            OptMachineEntry.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            OptMachineEntry.RateFactor = dataGridProcess._options.dataSource[j].RateFactor;
            OptMachineEntry.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            OptMachineEntry.ReceivedQuantity = dataGridProcess._options.dataSource[j].ScheduleQty;
            OptMachineEntry.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;

            objMachineEntry.push(OptMachineEntry);

            //////forms table entry
            OptFormsEntry = {};

            OptFormsEntry.TransID = 1;
            OptFormsEntry.MachineID = MachineID;
            OptFormsEntry.EmployeeID = OperatorID;
            OptFormsEntry.JobBookingID = JobCardID;
            OptFormsEntry.Status = "Outsource Send";
            OptFormsEntry.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            OptFormsEntry.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            OptFormsEntry.JobBookingJobCardContentsID = GblSelectedContentData[0].JobBookingJobCardContentsID;

            objFormsEntry.push(OptFormsEntry);
            ///////////////
        }

        var txt = BaseMaterialSelct + ' Are you sure to send this content for outsource..? \n' + 'if not click on \n' + 'Cancel';
        swal({
            title: "Do you want to continue",
            text: txt,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Send..!",
            closeOnConfirm: true
        },
            function () {
                $.ajax({
                    type: "POST",
                    url: "WebServiceProductionOutsource.asmx/SaveProductionOutsource",
                    data: '{ObjData:' + JSON.stringify(ArrObjData) + ',ObjDataMain:' + JSON.stringify(ArrObjDataMain) + ',ObjDataDetails:' + JSON.stringify(ArrObjDataDetails) + ',ObjProcess:' + JSON.stringify(ArrObjDataProcess) + ',objMachineEntry:' + JSON.stringify(objMachineEntry) + ',objFormsEntry:' + JSON.stringify(objFormsEntry) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        if (results.d === "Success") {
                            swal("Data Saved..!", "Your data saved successfuly...", "success");
                            $("#BtnNew").click();
                        } else if (results.d.includes("Error:")) {
                            swal("Error..!", results.d, "warning");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        swal("Error!", "Please try after some time..", "");
                        console.log(jqXHR);
                    }
                });
            });
    } catch (e) {
        console.log(e);
    }
});

$("#BtnShowList").click(function () {
    document.getElementById("BtnShowList").setAttribute("data-toggle", "modal");
    document.getElementById("BtnShowList").setAttribute("data-target", "#largeModalShowList");
});

$("#BtnEdit").click(function () {
    if (GblOutsourceID <= 0) {
        swal("Data Not Selected..!", "Please select transaction first..", "warning");
        return;
    }
    document.getElementById("TxtRemarks").value = GblShowListSelectedData[0].Remark;
    document.getElementById("TxtDestination").value = GblShowListSelectedData[0].PlaceOfSupply;
    document.getElementById("LblPONo").value = GblShowListSelectedData[0].VoucherNo;
    $('#SelVendorName').dxSelectBox({ value: GblShowListSelectedData[0].LedgerID });
    $('#SelJobCard').dxSelectBox({ value: GblShowListSelectedData[0].JobBookingID });
    $("#VoucherDate").dxDateBox({ value: GblShowListSelectedData[0].VoucherDate });

    $('#SelOperators').dxSelectBox({ value: GblShowListSelectedData[0].OperatorID });
    $('#SelMachines').dxSelectBox({ value: GblShowListSelectedData[0].MachineID });

    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/ReloadEditData",
        data: '{OutsourceID:' + JSON.stringify(GblOutsourceID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:}/g, ':null}');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, "&");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#gridAddedProcessDetail").dxDataGrid({
                dataSource: RES1.DTProcessDetail
            });
            $("#gridAddedContentsDetail").dxDataGrid({
                dataSource: RES1.DTContentsDetail
            });
        },
        error: function (e) {
            console.log(e);
        }
    });

    document.getElementById("BtnEdit").setAttribute("data-dismiss", "modal");
});

$("#BtnDelete").click(function () {
    if (GblOutsourceID <= 0) return;
    swal({
        title: "Deleting...",
        text: "Are you sure to delete this record..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "WebServiceProductionOutsource.asmx/DeleteProductionOutsource",
                data: '{OutID:' + GblOutsourceID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    if (results.d === "Success") {
                        swal("Deleted..!", "Your data deleted successfully..", "success");
                        $("#BtnNew").click();
                    } else if (results.d.includes("Error:")) {
                        swal("Error..!", results.d, "warning");
                    } else if (results.d.includes("Can't")) {
                        swal("Can't Delete..!", results.d, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnPrint").click(function () {
    if (GblOutsourceID <= 0) return;

    var url = "ReportOutsource.aspx?UID=" + GblOutsourceID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});