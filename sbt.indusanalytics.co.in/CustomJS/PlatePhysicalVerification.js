
"use strict";
var GblStatus = "";
var Stockrow = "";
var Colorsrow = "", Formrow = "";
var Gblshowlist = [];
var TransactionID = 0;
var ShowlistSelectedRow = [];

$("#DtPickerVoucherDate").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',
});

CreateVoucher();

function CreateVoucher() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_PlatePhysicalVerification.asmx/GetVoucherNo",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            if (res != "fail") {
                document.getElementById("TxtVoucherNo").value = res;
            }

        },
    });

}
GetJobCardNo();
function GetJobCardNo() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/GetJobCardNoList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                //console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var warehouse = JSON.parse(res);

                $("#SelectJCNO").dxSelectBox({
                    items: warehouse,
                    placeholder: "Select JobCard",
                    displayExpr: 'JobCardContentNo',
                    valueExpr: 'JobCardContentNo',
                    searchEnabled: true,
                    showClearButton: true,
                    //onValueChanged: function (data) {                      

                    //},
                    onSelectionChanged: function (SelVal) {
                        // var SelPCValue = $('#SelectPCCode').dxSelectBox('instance').option('value');    
                        var SelPCValue = "";
                        var SelJCNo = $('#SelectJCNO').dxSelectBox('instance').option('value');
                        refreshstock(SelPCValue, SelJCNo);
                    }

                });
            },
        });

    } catch (e) {
        alert(e);
    }

}
GetPMCode();
function GetPMCode() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/GetPMCodeList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                // console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var warehouse = JSON.parse(res);

                $("#SelectPCCode").dxSelectBox({
                    items: warehouse,
                    placeholder: "Select PMCN",
                    displayExpr: 'ProductMasterContentNO',
                    valueExpr: 'ProductMasterContentNO',
                    searchEnabled: true,
                    showClearButton: true,
                    onSelectionChanged: function (SelVal) {
                        var SelPCValue = $('#SelectPCCode').dxSelectBox('instance').option('value');
                        //var SelJCNo = $('#SelectJCNO').dxSelectBox('instance').option('value');
                        var SelJCNo = "";
                        refreshstock(SelPCValue, SelJCNo);
                    }
                    //onValueChanged: function (data) {

                    //},

                });
            },
        });

    } catch (e) {
        alert(e);
    }

}

RefreshWarehouse();
function RefreshWarehouse() {
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/GetWarehouseList",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                // console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var warehouse = JSON.parse(res);

                $("#sel_Warehouse").dxSelectBox({
                    items: warehouse,
                    placeholder: "Select Warehouse",
                    displayExpr: 'Warehouse',
                    valueExpr: 'WarehouseID',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        RefreshBins();
                    },

                });
            },
        });

    } catch (e) {
        alert(e);
    }

}
$("#sel_Bin").dxSelectBox({
    items: [],
    placeholder: "Select Bin",
    displayExpr: 'Bin',
    valueExpr: 'WarehouseID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        //alert(data.value);
    },

});
function RefreshBins() {
    try {
        var WarehouseID = $('#sel_Warehouse').dxSelectBox('instance').option('text');
        $.ajax({
            type: "POST",
            url: "WebServiceItemPhysicalVerification.asmx/GetBinsList",
            data: '{warehousename:' + JSON.stringify(WarehouseID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
               // console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var bins = JSON.parse(res);

                $("#sel_Bin").dxSelectBox({
                    items: bins,
                    placeholder: "Select Bin",
                    displayExpr: 'Bin',
                    valueExpr: 'WarehouseID',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (data) {
                        //alert(data.value);
                    },

                });
            },
        });

    } catch (e) {
        alert(e);
    }
}

SetStockGrid([]);

function refreshstock(SelPCValue, SelJCNo) {
    // document.getElementById("LOADER").style.display = "block";   
    if (SelJCNo == "") {
        $("#SelectJCNO").dxSelectBox({
            value: '',
        });
    }
    else if (SelPCValue == "") {
        $("#SelectPCCode").dxSelectBox({
            value: '',
        });
    }
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/PhysicalStockData",
            data: '{SelPCValue:' + JSON.stringify(SelPCValue) + ', SelJCNo:' + JSON.stringify(SelJCNo) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                //  console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                //    document.getElementById("LOADER").style.display = "none";
                var tt = JSON.parse(res);

                SetStockGrid(tt);
                //$("#gridreceiptlist").dxDataGrid({
                //    dataSource: tt,
                //});
            }
        });
    } catch (e) {
        alert(e);
    }
}

function SetStockGrid(tt) {
    $("#gridstock").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: true },
        selection: { mode: "single" },
        paging: {
            pageSize: 100
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [100, 200, 500, 1000]
        },
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: false },
        headerFilter: { visible: true },
        //rowAlternationEnabled: true,
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: false,
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },

        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
            { dataField: "ProductMasterContentsID", visible: false, caption: "ProductMasterContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "ToolID", visible: false, caption: "ToolID", width: 100 },
            { dataField: "ProductMasterContentNO", visible: true, caption: "ProductMasterContentNO", width: 180 },
            { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 250 },
            { dataField: "LedgerName", visible: true, caption: "LedgerName", width: 100 },
            { dataField: "ToolCode", visible: true, caption: "ToolCode", width: 120 },
            { dataField: "ToolType", visible: true, caption: "ToolType", width: 120 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 200 },
            { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 150 },
            { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 100 },
            //{ dataField: "PlanFColor", visible: true, caption: "PlanFColor", width: 100 },
            //{ dataField: "PlanBColor", visible: true, caption: "PlanBColor", width: 120 },
            //{ dataField: "PlanSpeFColor", visible: true, caption: "PlanSpeFColor", width: 100 },
            //{ dataField: "PlanSpeBColor", visible: true, caption: "PlanSpeBColor", width: 100 },
        ],

        height: function () {
            return window.innerHeight / 2.5;
        },
        //onEditingStart: function (e) {    
        //    if (e.column.dataField === "BatchDetail") {
        //        e.cancel = false;
        //    } else {
        //        e.cancel = true;
        //    }
        //},
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onSelectionChanged: function (selectedItems) {
            Stockrow = "";
            Stockrow = selectedItems.selectedRowsData[0];
            document.getElementById("TxtItemID").value = 0;
            document.getElementById("TxtItemCode").value = "";
            document.getElementById("TxtJobCardContentNO").value = "";
            document.getElementById("TxtItemPantoneCode").value = "";
            document.getElementById("TxtColorName").value = "";
            document.getElementById("TxtColorSpecification").value = "";
            document.getElementById("TxtFormNo").value = "";
            document.getElementById("TxtPages").value = "";
            document.getElementById("TxtJobName").value = "";
            document.getElementById("TxtPlanContName").value = "";
            document.getElementById("TxtBatchNo").value = "";

            document.getElementById("TxtFormItemCode").value = "";
            document.getElementById("TxtJobBookingID").value = "";
            document.getElementById("TxtTotalStock").value = "";
            document.getElementById("TxtPlateID").value = "";

            document.getElementById("TxtAdjestQty").value = 1;

            document.getElementById("TxtItemCode").value = Stockrow.ToolCode;
            document.getElementById("TxtJobCardContentNO").value = Stockrow.JobCardContentNo;
            document.getElementById("TxtJobName").value = Stockrow.JobName;
            document.getElementById("TxtPlanContName").value = Stockrow.PlanContName;
            document.getElementById("TxtJobBookingID").value = Stockrow.JobBookingID;
            document.getElementById("TxtPlateID").value = Stockrow.ToolID;

            if ((Stockrow.ToolType).toLowerCase() == "plate") {
                document.getElementById("TxtColorSpecification").readOnly = true;
                var JobBookingJobcardContentsID = Stockrow.JobBookingJobCardContentsID;
                $.ajax({
                    type: "POST",
                    url: "WebService_PlatePhysicalVerification.asmx/GetColorsGridData",
                    data: '{JobBookingJobcardContentsID:' + JSON.stringify(JobBookingJobcardContentsID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'text',
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/""/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var ColorRES1 = JSON.parse(res.toString());
                        SetColorGrid(ColorRES1);

                        $.ajax({
                            type: "POST",
                            url: "WebService_PlatePhysicalVerification.asmx/GetFormsGridData",
                            data: '{JobBookingJobcardContentsID:' + JSON.stringify(JobBookingJobcardContentsID) + '}',
                            contentType: "application/json; charset=utf-8",
                            dataType: 'text',
                            success: function (results) {
                                var res = results.replace(/\\/g, '');
                                res = res.replace(/"d":/g, '');
                                res = res.replace(/""/g, '');
                                res = res.substr(1);
                                res = res.slice(0, -1);
                                var FormRES1 = JSON.parse(res.toString());
                                SetFormGrid(FormRES1);

                            }
                        });
                    }
                });
            }
            else {
                document.getElementById("TxtColorSpecification").readOnly = false;
                Formrow = ""; Colorsrow = "";
                $("#ColorsGrid").dxDataGrid({
                    dataSource: [],
                });
                $("#FormsGrid").dxDataGrid({
                    dataSource: [],
                });
            }
            //document.getElementById("TxtBatchNo").value = Stockrow.ItemID;
        }

    });
}

SetColorGrid([]);
function SetColorGrid(tt) {
    $("#ColorsGrid").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: false },
        selection: { mode: "single" },
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: false, applyFilter: "auto" },
        columnChooser: { enabled: false },
        headerFilter: { visible: false },
        //rowAlternationEnabled: true,
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },

        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "JobBookingJobcardContentsID", visible: false, caption: "JobBookingJobcardContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 150 },
            { dataField: "ItemName", visible: false, caption: "ItemName", width: 200 },
            { dataField: "ItemPantoneCode", visible: true, caption: "ItemPantoneCode", width: 150 },
            { dataField: "ColorSpecification", visible: true, caption: "ColorSpecification", width: 100 },
        ],

        height: function () {
            return window.innerHeight / 5;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onSelectionChanged: function (selectedItems) {
            Colorsrow = "";
            Colorsrow = selectedItems.selectedRowsData[0];

            document.getElementById("TxtItemID").value = Colorsrow.ItemID;
            document.getElementById("TxtItemPantoneCode").value = Colorsrow.ItemPantoneCode;
            document.getElementById("TxtColorName").value = Colorsrow.ItemName;
            document.getElementById("TxtColorSpecification").value = Colorsrow.ColorSpecification;
            document.getElementById("TxtFormItemCode").value = Colorsrow.ItemCode;

        }

    });
}

SetFormGrid([]);
function SetFormGrid(tt) {
    $("#FormsGrid").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: false },
        selection: { mode: "single" },
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: false, applyFilter: "auto" },
        columnChooser: { enabled: false },
        headerFilter: { visible: false },
        //rowAlternationEnabled: true,
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },

        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "JobBookingJobcardContentsID", visible: false, caption: "JobBookingJobcardContentsID", width: 120 },
            { dataField: "JobCardFormNO", visible: true, caption: "JobCardFormNO", width: 150 },
            { dataField: "Pages", visible: true, caption: "Pages", width: 100 },
            { dataField: "SetsForms", visible: true, caption: "SetsForms", width: 100 },
        ],

        height: function () {
            return window.innerHeight / 5;
        },

        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onSelectionChanged: function (selectedItems) {
            Formrow = "";
            Formrow = selectedItems.selectedRowsData[0];

            document.getElementById("TxtFormNo").value = Formrow.JobCardFormNO;
            document.getElementById("TxtPages").value = Formrow.Pages;

        }

    });
}

SetNewStockGrid([]);

function SetNewStockGrid(tt) {
    $("#gridnewstock").dxDataGrid({
        dataSource: tt,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: false },
        selection: { mode: "single" },
        //        paging: {
        //            pageSize: 15
        //    },
        //        pager: {
        //            showPageSizeSelector: true,
        //            allowedPageSizes: [15, 25, 50, 100]
        //},
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: false },
        columnChooser: { enabled: false },
        headerFilter: { visible: false },
        //rowAlternationEnabled: true,
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: false,
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },

        editing: {
            mode: "cell",
            allowUpdating: false,
            allowDeleting: true
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "JobBookingJobcardContentsID", visible: false, caption: "JobBookingJobcardContentsID", width: 120 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "PLateCode", visible: true, caption: "ToolCode", width: 120 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 200 },
            { dataField: "ContentName", visible: true, caption: "ContentName", width: 150 },
            { dataField: "ItemCode", visible: true, caption: "ItemCode", width: 100 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 150 },
            { dataField: "ColorSpecification", visible: true, caption: "ToolSpecification", width: 100 },
            { dataField: "BatchNo", visible: true, caption: "BatchNo", width: 200 },
            { dataField: "CurrentStock", visible: true, caption: "Current Stock", width: 100 },
            { dataField: "NewStock", visible: true, caption: "New Stock", width: 100 },
            { dataField: "AdjustedStock", visible: true, caption: "AdjustedStock", width: 100 },
            { dataField: "GodownName", visible: true, caption: "GodownName", width: 100 },
            { dataField: "Bin", visible: true, caption: "Bin", width: 100 },
            { dataField: "GodownID", visible: false, caption: "GodownID", width: 120 },
            { dataField: "FormNo", visible: true, caption: "FormNo", width: 120 },
            { dataField: "PlateId", visible: false, caption: "PlateId", width: 120 },
        ],

        height: function () {
            return window.innerHeight / 5.5;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
    });
}

var addedstock = [];
var objpub = {};
$("#BtnAdd").click(function () {
    var i = 0;
    addedstock = [];
    objpub = {};

    if (Stockrow == "") {
        DevExpress.ui.notify("Please select stock item to adjust physical stock !", "warning", 1200);
        return;
    }
    if ((Stockrow.ToolType).toLowerCase() == "plate") {
        var itemid = document.getElementById("TxtItemID").value;
        if (isNaN(itemid) || Number(document.getElementById("TxtItemID").value) === 0) {
            DevExpress.ui.notify("Please select stock item to adjust physical stock !", "warning", 1200);
            return;
        }
    }
    var x = $("#sel_Warehouse").dxSelectBox("instance");
    if (x.option('value') == null || x.option('value') == "") {
        DevExpress.ui.notify("Please select warehouse to adjust physical stock !", "warning", 1200);
        return;
    }
    var x = $("#sel_Bin").dxSelectBox("instance");
    if (x.option('value') == null || x.option('value') == "") {
        DevExpress.ui.notify("Please select bin to adjust physical stock !", "warning", 1200);
        return;
    }
    //if (document.getElementById("TxtBatchNo").value.trim() == "") {
    //    DevExpress.ui.notify("Please enter stock batch no. to adjust physical stock !", "warning", 1200);
    //    return;
    //}
    var adjustqty = document.getElementById("TxtAdjestQty").value;

    if (isNaN(adjustqty) || Number(adjustqty) === 0) {
        DevExpress.ui.notify("Please enter valid current physical stock quantity !", "warning", 1200);
        return;
    }

    var currstock = 0;
    var newstock = 0;
    var adjustedstock = 0;
    currstock = Number(document.getElementById("TxtTotalStock").value);
    newstock = Number(document.getElementById("TxtAdjestQty").value);
    if (currstock > 0) {
        if ((currstock - newstock) == 0) {
            DevExpress.ui.notify("Please enter valid stock current physical stock quantity !", "warning", 1200);
            return;
        }
    }
    var AllReadyGridCountBatch = 0;
    var dataGrid = $("#gridnewstock").dxDataGrid("instance");
    if (dataGrid.totalCount() > 0) {
        for (var e = 0; e < dataGrid.totalCount() ; e++) {
            var ExistItemID = Number(dataGrid._options.dataSource[e].ItemID);
            var CurrentItemID = Number(document.getElementById("TxtItemID").value.trim());
            var ExistPlateId = Number(dataGrid._options.dataSource[e].PlateId);
            var CurrentPlateId = Number(document.getElementById("TxtPlateID").value.trim());
            var ExistFormNo = JSON.stringify(dataGrid._options.dataSource[e].FormNo);
            var CurrentFormNo = JSON.stringify(document.getElementById("TxtFormNo").value.trim());
            var ExistColorSpecification = JSON.stringify(dataGrid._options.dataSource[e].ColorSpecification);
            var CurrentColorSpecification = JSON.stringify(document.getElementById("TxtColorSpecification").value.trim());
            var ExistPlateCode = JSON.stringify(dataGrid._options.dataSource[e].PLateCode);
            var CurrentPlateCode = JSON.stringify(document.getElementById("TxtItemCode").value.trim());

            if (ExistItemID == CurrentItemID && ExistPlateId == CurrentPlateId && ExistFormNo == CurrentFormNo && ExistColorSpecification == CurrentColorSpecification && ExistPlateCode == CurrentPlateCode) {
                AllReadyGridCountBatch = Number(AllReadyGridCountBatch) + 1;
            }
        }

        //  var result = $.grep(dataGrid._options.dataSource, function (e) { return (e.ItemID === Number(document.getElementById("TxtItemID").value) && e.BatchNo === document.getElementById("TxtBatchNo").value.trim()); });
        //if (result.length === 1) {
        //    //found
        //    DevExpress.ui.notify("Already added stock for same batch and selected item !", "warning", 1200);
        //    return;
        //}
    }
    var CountBatch = 0;

    var PlateId = document.getElementById("TxtPlateID").value;
    var PlateCode = document.getElementById("TxtItemCode").value;
    var ItemID = document.getElementById("TxtItemID").value;
    var FormNo = document.getElementById("TxtFormNo").value;
    var ColorSpecifitaion = document.getElementById("TxtColorSpecification").value;
    var voucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
    var d = new Date(voucherDate);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $.ajax({
        type: "POST",
        url: "WebService_PlatePhysicalVerification.asmx/GetCountBatchNO",
        data: '{PlateID:' + JSON.stringify(PlateId) + ',PlateCode:' + JSON.stringify(PlateCode) + ',ItemID:' + JSON.stringify(ItemID) + ',FormNo:' + JSON.stringify(FormNo) + ',ColorSpecifitaion:' + JSON.stringify(ColorSpecifitaion) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            CountBatch = 0;
            var RESCountBatch = JSON.parse(res.toString());
            CountBatch = RESCountBatch[0].NoOfBatchNO;

            var SumOfCount = Number(CountBatch) + Number(AllReadyGridCountBatch);
            var FinalBatchNo = "";
            if ((Stockrow.ToolType).toLowerCase() == "plate") {
                FinalBatchNo = PlateCode + "_" + ColorSpecifitaion[0] + "_" + dd + "" + months_String[mm - 1] + "" + yyyy + "_" + document.getElementById("TxtFormItemCode").value + "_" + SumOfCount;
            }
            else {
                FinalBatchNo = PlateCode + "_" + ColorSpecifitaion[0] + "_" + dd + "" + months_String[mm - 1] + "" + yyyy + "_0_" + SumOfCount;
            }
            
            var ToolSpeString = Stockrow.ToolType + " - ";
            if ((Stockrow.ToolType).toLowerCase() == "plate") {
                for (var cc = 0; cc < 5; cc++) {

                    if (cc == 0) {
                        if (document.getElementById("TxtColorSpecification").value == "") {
                            ToolSpeString = ToolSpeString;
                        } else {
                            ToolSpeString = ToolSpeString + document.getElementById("TxtColorSpecification").value;
                        }
                    }
                    else if (cc == 1) {
                        if (document.getElementById("TxtColorName").value == "") {
                            ToolSpeString = ToolSpeString;
                        } else {
                            ToolSpeString = ToolSpeString + " / " + document.getElementById("TxtColorName").value;
                        }
                    }
                    else if (cc == 2) {
                        if (document.getElementById("TxtItemPantoneCode").value == "") {
                            ToolSpeString = ToolSpeString;
                        } else {
                            ToolSpeString = ToolSpeString + " / " + document.getElementById("TxtItemPantoneCode").value;
                        }
                    }
                    else if (cc == 3) {
                        if (document.getElementById("TxtFormNo").value == "") {
                            ToolSpeString = ToolSpeString;
                        } else {
                            ToolSpeString = ToolSpeString + " / " + document.getElementById("TxtFormNo").value;
                        }
                    }
                    else if (cc == 4) {
                        if (document.getElementById("TxtPages").value == "") {
                            ToolSpeString = ToolSpeString;
                        } else {
                            ToolSpeString = ToolSpeString + " / " + document.getElementById("TxtPages").value;
                        }
                    }
                }
            } else {
                ToolSpeString = ToolSpeString + document.getElementById("TxtColorSpecification").value;
            }


            objpub.JobBookingJobcardContentsID = Stockrow.JobBookingJobCardContentsID;
            objpub.PlateId = PlateId;
            objpub.FormNo = FormNo;
            objpub.ItemID = Number(document.getElementById("TxtItemID").value);
            objpub.JobBookingID = document.getElementById("TxtJobBookingID").value;
            objpub.PLateCode = document.getElementById("TxtItemCode").value;
            objpub.JobName = document.getElementById("TxtJobName").value;
            objpub.ContentName = document.getElementById("TxtPlanContName").value;
            objpub.ItemCode = document.getElementById("TxtFormItemCode").value;
            objpub.ItemName = document.getElementById("TxtColorName").value;
            objpub.ColorSpecification = ToolSpeString;//document.getElementById("TxtColorSpecification").value;
            objpub.BatchNo = FinalBatchNo;
            objpub.GodownName = $("#sel_Warehouse").dxSelectBox("instance").option('text');
            objpub.GodownID = $("#sel_Warehouse").dxSelectBox("instance").option('value');
            objpub.Bin = $("#sel_Bin").dxSelectBox("instance").option('text');
            objpub.CurrentStock = Number(document.getElementById("TxtTotalStock").value);
            objpub.NewStock = Number(document.getElementById("TxtAdjestQty").value);

            if (currstock > 0) {
                if (currstock > newstock) {
                    objpub.AdjustedStock = newstock - currstock
                } else {
                    objpub.AdjustedStock = newstock - currstock
                }
            } else {
                objpub.AdjustedStock = newstock
            }

            dataGrid._options.dataSource.push(objpub);
            dataGrid.refresh();
        }
    })
});

$("#BtnNew").click(function () {
    document.getElementById("BtnSave").disabled = false;
    location.reload();
});

$("#BtnSave").click(function () {
    var dataGrid = $("#gridnewstock").dxDataGrid('instance');
    if (dataGrid.totalCount() <= 0) {
        DevExpress.ui.notify("Please add any item to adjust physical stock!", "warning", 1200);
        return;
    }
    var ObjPlaetMain = [];
    var optPlateMain = {};

    optPlateMain.VoucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
    optPlateMain.Narration = document.getElementById("TxtNarration").value;
    optPlateMain.VoucherID = -41;
    optPlateMain.LedgerID = Stockrow.LedgerID;
    optPlateMain.JobBookingJobCardContentsID = Stockrow.ProductMasterContentsID;
    optPlateMain.JobBookingID = Stockrow.JobBookingID;

    ObjPlaetMain.push(optPlateMain);

    var ObjPlaetDetail = [];
    var optPlateDetail = {};
    var dataGrid = $("#gridnewstock").dxDataGrid("instance");
    if (dataGrid.totalCount() > 0) {
        for (var e = 0; e < dataGrid.totalCount() ; e++) {
            var SetFormNO = dataGrid._options.dataSource[e].FormNo;
            if (SetFormNO == "" || SetFormNO == undefined || SetFormNO == null || SetFormNO == "null") {
                SetFormNO = 1;
            }
            optPlateDetail = {};
            optPlateDetail.TransID = e + 1;
            optPlateDetail.ItemID = dataGrid._options.dataSource[e].ItemID;
            optPlateDetail.JobBookingID = dataGrid._options.dataSource[e].JobBookingID;
            optPlateDetail.JobBookingJobCardContentsID = dataGrid._options.dataSource[e].JobBookingJobcardContentsID;
            optPlateDetail.ColorSpecifications = dataGrid._options.dataSource[e].ColorSpecification;
            optPlateDetail.FormNo = SetFormNO;
            optPlateDetail.PlateCode = dataGrid._options.dataSource[e].PLateCode;
            optPlateDetail.ToolID = dataGrid._options.dataSource[e].PlateId;
            optPlateDetail.ReceiptQuantity = dataGrid._options.dataSource[e].AdjustedStock;
            optPlateDetail.ApprovedQuantity = dataGrid._options.dataSource[e].AdjustedStock;
            optPlateDetail.NewStockQuantity = dataGrid._options.dataSource[e].NewStock;
            optPlateDetail.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            //optPlateDetail.PalletNo = dataGrid._options.dataSource[e].ItemID;
            optPlateDetail.WarehouseID = dataGrid._options.dataSource[e].GodownID;
            optPlateDetail.ItemNarration = document.getElementById("TxtNarration").value;

            ObjPlaetDetail.push(optPlateDetail);
        }
    }
    var PlateDetailData = JSON.stringify(ObjPlaetDetail);
    var PlateMainData = JSON.stringify(ObjPlaetMain);
    try {
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
                //if (GblStatus != "Update") {
                document.getElementById("LOADER").style.display = "block";
                var Prefix = "PPH";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_PlatePhysicalVerification.asmx/SavePlateData",
                        data: '{prefix:' + JSON.stringify(Prefix) + ',PlateMainData:' + PlateMainData + ',PlateDetailData:' + PlateDetailData + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (results) {
                            var res = JSON.stringify(results);
                            res = res.replace(/"d":/g, '');
                            res = res.replace(/{/g, '');
                            res = res.replace(/}/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);

                            document.getElementById("LOADER").style.display = "none";

                            if (res == "Success") {
                                swal("Saved!", "Your data saved", "success");
                                location.reload();
                            }
                            else if (res == "Exist") {
                                swal("Duplicate!", "This Plate Name allready Exist..\n Please enter another Plate Name..", "");
                            }
                        },
                        error: function errorFunc(jqXHR) {
                            document.getElementById("LOADER").style.display = "none";
                            swal("Error!", "Please try after some time..", "");
                            alert(jqXHR);
                        }
                    });
                } catch (e) {
                    alert(e);
                }
                //}
                //else {
                //    document.getElementById("LOADER").style.display = "block";
                //    $.ajax({
                //        type: "POST",
                //        url: "WebService_PlatePhysicalVerification.asmx/UpdatePlateData",
                //        data: '{TxtTransactionID:' + JSON.stringify(document.getElementById("TxtTransactionID").value) + ',PlateDetailData:' + PlateDetailData + ',PlateMainData:' + PlateMainData + '}',
                //        contentType: "application/json; charset=utf-8",
                //        dataType: "json",
                //        success: function (results) {
                //            var res = JSON.stringify(results);
                //            res = res.replace(/"d":/g, '');
                //            res = res.replace(/{/g, '');
                //            res = res.replace(/}/g, '');
                //            res = res.substr(1);
                //            res = res.slice(0, -1);

                //            document.getElementById("LOADER").style.display = "none";
                //            if (res == "Success") {
                //                document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                //                swal("Updated!", "Your data Updated", "success");

                //                location.reload();
                //            }
                //            else if (res == "Exist") {
                //                swal("Duplicate!", "This Plate Name allready Exist..\n Please enter another Plate Name..", "");
                //            }

                //        },
                //        error: function errorFunc(jqXHR) {
                //            document.getElementById("LOADER").style.display = "none";
                //            swal("Error!", "Please try after some time..", "");
                //        }
                //    });
                //}
            });
    } catch (e) {
        alert(e);
    }
});

$("#BtnShowList").click(function () {
    document.getElementById("BtnShowList").setAttribute("data-toggle", "modal");
    document.getElementById("BtnShowList").setAttribute("data-target", "#largeModal");
    RefreshVS();
});

function RefreshVS() {
    document.getElementById("LOADER").style.display = "block";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/RefreshVouchersList",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
               // console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";
                Gblshowlist = [];
                Gblshowlist = JSON.parse(res);
                
                SetShowListGrid();
                //$("#GridShowList").dxDataGrid({
                //    dataSource: Gblshowlist,
                //});
            }
        });
    } catch (e) {
        alert(e);
    }
}

function SetShowListGrid() {
    $("#GridShowList").dxDataGrid({
        dataSource: Gblshowlist,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        //keyExpr: "TransactionID",
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: true },
        selection: { mode: "single" },
        paging: {
            pageSize: 100
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [100, 200, 500, 1000]
        },
        // scrolling: { mode: 'virtual' },
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: false },
        headerFilter: { visible: true },
        //rowAlternationEnabled: true,
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        export: {
            enabled: false,
            fileName: "Pending Orders",
            allowExportSelectedData: true,
        },

        editing: {
            mode: "cell",
            allowUpdating: false
        },
        //focusedRowEnabled: true,
        columns: [
            { dataField: "TransactionID", visible: false, caption: "TransactionID", width: 120 },
            { dataField: "MaxVoucherNo", visible: false, caption: "MaxVoucherNo", width: 120 },
            { dataField: "ToolID", visible: false, caption: "ToolID", width: 120 },
            { dataField: "VoucherNo", visible: true, caption: "VoucherNo", width: 120 },
            { dataField: "VoucherDate", visible: true, caption: "VoucherDate", width: 120 },
            { dataField: "ToolCode", visible: true, caption: "ToolCode", width: 120 },
            { dataField: "ToolType", visible: true, caption: "ToolType", width: 120 },
            { dataField: "ProductMasterContentNO", visible: true, caption: "ProductMasterContentNO", width: 120 },
            { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 120 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 120 },
            { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 120 },
            { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 120 },
            { dataField: "UserName", visible: true, caption: "UserName", width: 120 },
            { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
            { dataField: "ModifiedDate", visible: true, caption: "ModifiedDate", width: 120 },
            { dataField: "CreatedDate", visible: true, caption: "CreatedDate", width: 120 },
            { dataField: "VoucherPrefix", visible: false, caption: "VoucherPrefix", width: 120 },
            { dataField: "UserID", visible: false, caption: "UserID", width: 120 },
            { dataField: "CompanyID", visible: false, caption: "CompanyID", width: 120 },

        ],

        //height: function () {
        //    return window.innerHeight / 2.5;
        //},

        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        onSelectionChanged: function (selectedItems) {
            ShowlistSelectedRow = "";
            ShowlistSelectedRow = selectedItems.selectedRowsData;
        }
    });
}

$("#BtnNextPopUp").click(function () {
    var GblDetailData = [];
    var Newobjpub = [];
    if (ShowlistSelectedRow.length < 1) {
        DevExpress.ui.notify("Please choose any record from above grid..!", "warning", 2000);
        return;
    } else {
        GblStatus = "Update"
        document.getElementById("BtnSave").disabled = true;
        document.getElementById("TxtTransactionID").value = ShowlistSelectedRow[0].TransactionID;
        $("#VoucherDate").dxDateBox({
            value: ShowlistSelectedRow[0].VoucherDate,
        });
        document.getElementById("TxtVoucherNo").value = ShowlistSelectedRow[0].VoucherNo;
        document.getElementById("TxtMaxVoucherNo").value = ShowlistSelectedRow[0].MaxVoucherNo;
        document.getElementById("TxtNarration").value = ShowlistSelectedRow[0].Narration;

        document.getElementById("LOADER").style.display = "block";
        var dataGrid = $("#gridnewstock").dxDataGrid("instance");
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/GetPlateDetailData",
            data: '{TxtTransactionID:' + JSON.stringify(document.getElementById("TxtTransactionID").value) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
              //  console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                document.getElementById("LOADER").style.display = "none";
                GblDetailData = [];
                GblDetailData = JSON.parse(res);
               
                objpub = {};
                for (var x = 0; x < GblDetailData.length; x++) {
                    objpub = {};
                    objpub.JobBookingJobcardContentsID = GblDetailData[x].JobBookingJobCardContentsID;
                    objpub.PlateId = GblDetailData[x].PlateId;
                    objpub.FormNo = GblDetailData[x].FormNo;
                    objpub.ItemID = GblDetailData[x].ItemID;
                    objpub.JobBookingID = GblDetailData[x].JobBookingID;
                    objpub.PLateCode = GblDetailData[x].PlateCode;
                    objpub.JobName = GblDetailData[x].JobName;
                    objpub.ContentName = GblDetailData[x].PlanContName;
                    objpub.ItemCode = GblDetailData[x].ItemCode;
                    objpub.ItemName = GblDetailData[x].ItemName;
                    objpub.ColorSpecification = GblDetailData[x].ColorSpecifications;
                    objpub.BatchNo = GblDetailData[x].BatchNo;
                    objpub.GodownName = GblDetailData[x].WarehouseName;
                    objpub.GodownID = GblDetailData[x].WarehouseID;
                    objpub.Bin = GblDetailData[x].BinName;
                    objpub.CurrentStock = 0;
                    objpub.NewStock = GblDetailData[x].ReceiptQuantity;
                    objpub.AdjustedStock = GblDetailData[x].ReceiptQuantity;

                    Newobjpub.push(objpub);
                    // dataGrid._options.dataSource.push(objpub);
                }
               
                // dataGrid.refresh();
                $("#gridnewstock").dxDataGrid({
                    dataSource: Newobjpub,
                });
              //  Newobjpub.push(objpub);
            }
        });
        document.getElementById("BtnNextPopUp").setAttribute("data-dismiss", "modal");
    }
});

$("#BtnDeletePopUp").click(function () {
    if (ShowlistSelectedRow.length < 1) {
        DevExpress.ui.notify("Please choose any record from above Showlist grid..!", "warning", 2000);
    } else {
        var TxtTransactionID = document.getElementById("TxtTransactionID").value;
        if (TxtTransactionID == "" || TxtTransactionID == null || TxtTransactionID == undefined) {
            DevExpress.ui.notify("Please choose any record from above Showlist grid..!", "warning", 2000);
            return false;
        }
        //$.ajax({
        //    type: "POST",
        //    url: "WebService_PurchaseOrder.asmx/CheckPermission",
        //    data: '{TransactionID:' + JSON.stringify(TxtPOID) + '}',
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    success: function (results) {
        //        var res = JSON.stringify(results);
        //        res = res.replace(/"d":/g, '');
        //        res = res.replace(/{/g, '');
        //        res = res.replace(/}/g, '');
        //        res = res.substr(1);
        //        res = res.slice(0, -1);

        //if (res == "Exist") {
        //    swal("", "This item is used in another process..! Record can not be delete.", "error");
        //    return false;
        //}
        //else {

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
                document.getElementById("LOADER").style.display = "block";
                $.ajax({
                    type: "POST",
                    url: "WebService_PlatePhysicalVerification.asmx/DeletePlateData",
                    data: '{TxtTransactionID:' + JSON.stringify(TxtTransactionID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);

                        document.getElementById("LOADER").style.display = "none";
                        if (res == "Success") {
                            swal("Deleted!", "Your data Deleted", "success");
                            // alert("Your Data has been Saved Successfully...!");
                            location.reload();
                        }

                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        alert(jqXHR);
                    }
                });

            });

        //}
        //    }
        //});
    }
});

$("#BtnDelete").click(function () {
    if (GblStatus != "Update") {
        DevExpress.ui.notify("Please choose any record from above Showlist grid..!", "warning", 2000);
        return;
    }
    else {
        $("#BtnDeletePopUp").click();
    }
});


