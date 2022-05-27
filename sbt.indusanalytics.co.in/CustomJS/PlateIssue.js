
"use strict";
var GblStatus = "", StockrowSecond = "";
var Stockrow = "";
var FinalGridData = [], Gblshowlist = [], ShowlistSelectedRow = "";

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
        url: "WebService_PlatePhysicalVerification.asmx/GetVoucherNoForPlateIssue",
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

SetStockGrid([]);
refreshstock();
function refreshstock() {
    document.getElementById("LOADER").style.display = "block";
    try {
        $.ajax({
            type: "POST",
            url: "WebService_PlatePhysicalVerification.asmx/PhysicalStockData",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027u0027/g, "''");
                res = res.substr(1);
                res = res.slice(0, -1);
                var tt = JSON.parse(res);
                SetStockGrid(tt);
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
            { dataField: "ProductMasterContentNO", visible: true, caption: "ProductMasterContentNO", width: 180 },
            { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 250 },
            { dataField: "LedgerName", visible: true, caption: "LedgerName", width: 100 },
            { dataField: "PlateCode", visible: true, caption: "PlateCode", width: 100 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 200 },
            { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 150 },
            { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 100 },
            { dataField: "PlanFColor", visible: true, caption: "PlanFColor", width: 100 },
            { dataField: "PlanBColor", visible: true, caption: "PlanBColor", width: 120 },
            { dataField: "PlanSpeFColor", visible: true, caption: "PlanSpeFColor", width: 100 },
            { dataField: "PlanSpeBColor", visible: true, caption: "PlanSpeBColor", width: 100 },
        ],

        height: function () {
            return window.innerHeight / 2.5;
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
            Stockrow = "";
            Stockrow = selectedItems.selectedRowsData[0];
            var JobBookingJobcardContentsID = Stockrow.JobBookingJobCardContentsID;
            var ProductMasterContentNo = Stockrow.ProductMasterContentNO;
            StockrowSecond = "";

            $.ajax({
                type: "POST",
                url: "WebService_PlatePhysicalVerification.asmx/GetPlateStock",
                data: '{JobBookingJobcardContentsID:' + JSON.stringify(JobBookingJobcardContentsID) + ',ProductMasterContentNo:' + JSON.stringify(ProductMasterContentNo) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/""/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var LoadStockGrid = JSON.parse(res.toString());
                    LoadStock(LoadStockGrid);

                }
            });
        }

    });
}

LoadStock([]);
function LoadStock(LoadStockGrid) {
    $("#StockGridSecond").dxDataGrid({
        dataSource: LoadStockGrid,
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
        height: function () {
            return window.innerHeight / 3.5;
        },
        columns: [
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
            { dataField: "ProductMasterContentsID", visible: false, caption: "ProductMasterContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "ProductMasterContentNO", visible: false, caption: "ProductMasterContentNO", width: 120 },
            { dataField: "JobCardContentNo", visible: false, caption: "JobCardContentNo", width: 120 },
            { dataField: "LedgerName", visible: false, caption: "LedgerName", width: 100 },
            { dataField: "PlateCode", visible: true, caption: "PlateCode", width: 100 },
            { dataField: "JobName", visible: false, caption: "JobName", width: 200 },
            { dataField: "PlanContName", visible: false, caption: "PlanContName", width: 150 },
            { dataField: "ProductCode", visible: false, caption: "ProductCode", width: 100 },
            { dataField: "ColorSpecifications", visible: true, caption: "ColorSpecifications", width: 100 },
            { dataField: "FormNo", visible: true, caption: "FormNo", width: 80 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 150 },
            { dataField: "BatchNo", visible: true, caption: "BatchNo", width: 150 },
            { dataField: "WarehouseName", visible: true, caption: "WarehouseName", width: 100 },
            { dataField: "BinName", visible: true, caption: "BinName", width: 100 },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 100 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 100 },
            { dataField: "PlateID", visible: false, caption: "PlateID", width: 100 },
        ],

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
            StockrowSecond = "";
            StockrowSecond = selectedItems.selectedRowsData[0];
        }

    });
}

SetNewStockGrid();

function SetNewStockGrid() {
    $("#gridnewstock").dxDataGrid({
        dataSource: FinalGridData,
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
            { dataField: "TransID", visible: false, caption: "TransID", width: 120 },
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
            { dataField: "ProductMasterContentsID", visible: false, caption: "ProductMasterContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "ProductMasterContentNO", visible: false, caption: "ProductMasterContentNO", width: 120 },
            { dataField: "JobCardContentNo", visible: false, caption: "JobCardContentNo", width: 120 },
            { dataField: "LedgerName", visible: false, caption: "LedgerName", width: 100 },
            { dataField: "PlateCode", visible: true, caption: "PlateCode", width: 100 },
            { dataField: "JobName", visible: false, caption: "JobName", width: 200 },
            { dataField: "PlanContName", visible: false, caption: "PlanContName", width: 150 },
            { dataField: "ProductCode", visible: false, caption: "ProductCode", width: 100 },
            { dataField: "ColorSpecifications", visible: true, caption: "ColorSpecifications", width: 100 },
            { dataField: "FormNo", visible: true, caption: "FormNo", width: 80 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 150 },
            { dataField: "BatchNo", visible: true, caption: "BatchNo", width: 150 },
            { dataField: "WarehouseName", visible: true, caption: "WarehouseName", width: 100 },
            { dataField: "BinName", visible: true, caption: "BinName", width: 100 },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 100 },
            { dataField: "ItemID", visible: false, caption: "ItemID", width: 100 },
            { dataField: "PlateID", visible: false, caption: "PlateID", width: 100 },
        ],

        height: function () {
            return window.innerHeight / 3.5;
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

$("#BtnNew").click(function () {
    location.reload();
});

var objpub = {};
$("#BtnAdd").click(function () {
    var i = 0;
    objpub = {};

    if (Stockrow == "") {
        DevExpress.ui.notify("Please choose any row from first grid !", "warning", 1200);
        return;
    }
    if (StockrowSecond == "") {
        DevExpress.ui.notify("Please choose any row from Stock grid !", "warning", 1200);
        return;
    }

    FinalGridData = [];
    var dataGrid = $("#gridnewstock").dxDataGrid("instance");
    
    if (dataGrid.totalCount() > 0) {
        for (var e = 0; e <= dataGrid.totalCount() ; e++) {
            if (e == dataGrid.totalCount()) {
                objpub = {};

                objpub.TransID = e + 1;
                objpub.LedgerID = StockrowSecond.LedgerID;
                objpub.ProductMasterID = StockrowSecond.ProductMasterID;
                objpub.ProductMasterContentsID = StockrowSecond.ProductMasterContentsID;
                objpub.JobBookingID = StockrowSecond.JobBookingID;
                objpub.JobBookingJobCardContentsID = StockrowSecond.JobBookingJobCardContentsID;
                objpub.ProductMasterContentNO = StockrowSecond.ProductMasterContentNO;
                objpub.JobCardContentNo = StockrowSecond.JobCardContentNo;
                objpub.LedgerName = StockrowSecond.LedgerName;
                objpub.PlateCode = StockrowSecond.PlateCode;
                objpub.JobName = StockrowSecond.JobName;
                objpub.PlanContName = StockrowSecond.PlanContName;
                objpub.ProductCode = StockrowSecond.ProductCode;
                objpub.ColorSpecifications = StockrowSecond.ColorSpecifications;
                objpub.FormNo = StockrowSecond.FormNo;
                objpub.ItemName = StockrowSecond.ItemName;
                objpub.BatchNo = StockrowSecond.BatchNo;
                objpub.WarehouseName = StockrowSecond.WarehouseName;
                objpub.BinName = StockrowSecond.BinName;
                objpub.WarehouseID = StockrowSecond.WarehouseID;
                objpub.ItemID = StockrowSecond.ItemID;
                objpub.PlateID = StockrowSecond.PlateID;

                FinalGridData.push(objpub);
            } else {
                objpub = {};
                objpub.TransID = e + 1;
                objpub.LedgerID = dataGrid._options.dataSource[e].LedgerID;
                objpub.ProductMasterID = dataGrid._options.dataSource[e].ProductMasterID;
                objpub.ProductMasterContentsID = dataGrid._options.dataSource[e].ProductMasterContentsID;
                objpub.JobBookingID = dataGrid._options.dataSource[e].JobBookingID;
                objpub.JobBookingJobCardContentsID = dataGrid._options.dataSource[e].JobBookingJobCardContentsID;
                objpub.ProductMasterContentNO = dataGrid._options.dataSource[e].ProductMasterContentNO;
                objpub.JobCardContentNo = dataGrid._options.dataSource[e].JobCardContentNo;
                objpub.LedgerName = dataGrid._options.dataSource[e].LedgerName;
                objpub.PlateCode = dataGrid._options.dataSource[e].PlateCode;
                objpub.JobName = dataGrid._options.dataSource[e].JobName;
                objpub.PlanContName = dataGrid._options.dataSource[e].PlanContName;
                objpub.ProductCode = dataGrid._options.dataSource[e].ProductCode;
                objpub.ColorSpecifications = dataGrid._options.dataSource[e].ColorSpecifications;
                objpub.FormNo = dataGrid._options.dataSource[e].FormNo;
                objpub.ItemName = dataGrid._options.dataSource[e].ItemName;
                objpub.BatchNo = dataGrid._options.dataSource[e].BatchNo;
                objpub.WarehouseName = dataGrid._options.dataSource[e].WarehouseName;
                objpub.BinName = dataGrid._options.dataSource[e].BinName;
                objpub.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;
                objpub.ItemID = dataGrid._options.dataSource[e].ItemID;
                objpub.PlateID = dataGrid._options.dataSource[e].PlateID;

                FinalGridData.push(objpub);
            }
        }
    } else {
        objpub = {};
        objpub.TransID = 1;
        objpub.LedgerID = StockrowSecond.LedgerID;
        objpub.ProductMasterID = StockrowSecond.ProductMasterID;
        objpub.ProductMasterContentsID = StockrowSecond.ProductMasterContentsID;
        objpub.JobBookingID = StockrowSecond.JobBookingID;
        objpub.JobBookingJobCardContentsID = StockrowSecond.JobBookingJobCardContentsID;
        objpub.ProductMasterContentNO = StockrowSecond.ProductMasterContentNO;
        objpub.JobCardContentNo = StockrowSecond.JobCardContentNo;
        objpub.LedgerName = StockrowSecond.LedgerName;
        objpub.PlateCode = StockrowSecond.PlateCode;
        objpub.JobName = StockrowSecond.JobName;
        objpub.PlanContName = StockrowSecond.PlanContName;
        objpub.ProductCode = StockrowSecond.ProductCode;
        objpub.ColorSpecifications = StockrowSecond.ColorSpecifications;
        objpub.FormNo = StockrowSecond.FormNo;
        objpub.ItemName = StockrowSecond.ItemName;
        objpub.BatchNo = StockrowSecond.BatchNo;
        objpub.WarehouseName = StockrowSecond.WarehouseName;
        objpub.BinName = StockrowSecond.BinName;
        objpub.WarehouseID = StockrowSecond.WarehouseID;
        objpub.ItemID = StockrowSecond.ItemID;
        objpub.PlateID = StockrowSecond.PlateID;

        FinalGridData.push(objpub);
    }
    $("#gridnewstock").dxDataGrid({
        dataSource: FinalGridData,
    });

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
    optPlateMain.VoucherID = -43;
    optPlateMain.LedgerID = Stockrow.LedgerID;
    optPlateMain.JobBookingJobCardContentsID = Stockrow.JobBookingJobCardContentsID;
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
            optPlateDetail.JobBookingJobCardContentsID = dataGrid._options.dataSource[e].JobBookingJobCardContentsID;
            optPlateDetail.ColorSpecifications = dataGrid._options.dataSource[e].ColorSpecifications;
            optPlateDetail.FormNo = SetFormNO;
            optPlateDetail.PlateCode = dataGrid._options.dataSource[e].PlateCode;
            optPlateDetail.PlateId = dataGrid._options.dataSource[e].PlateID;
            optPlateDetail.IssueQuantity = 1;
            optPlateDetail.BatchNo = dataGrid._options.dataSource[e].BatchNo;
            optPlateDetail.WarehouseID = dataGrid._options.dataSource[e].WarehouseID;
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
                var Prefix = "PI";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_PlatePhysicalVerification.asmx/SavePlateIssueData",
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
            url: "WebService_PlatePhysicalVerification.asmx/PlateIssueShowlist",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                console.debug(results);
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
            { dataField: "LedgerID", visible: false, caption: "LedgerID", width: 120 },
            { dataField: "ProductMasterID", visible: false, caption: "ProductMasterID", width: 120 },
            { dataField: "ProductMasterContentsID", visible: false, caption: "ProductMasterContentsID", width: 120 },
            { dataField: "JobBookingID", visible: false, caption: "JobBookingID", width: 120 },
            { dataField: "JobBookingJobCardContentsID", visible: false, caption: "JobBookingJobCardContentsID", width: 120 },
            { dataField: "PlateID", visible: false, caption: "PlateID", width: 120 },
            { dataField: "VoucherNo", visible: true, caption: "VoucherNo", width: 120 },
            { dataField: "VoucherDate", visible: true, caption: "VoucherDate", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "LedgerName", width: 120 },
            { dataField: "ProductMasterContentNO", visible: true, caption: "ProductMasterContentNO", width: 120 },
            { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 120 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 120 },
            { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 120 },
            { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 120 },
            { dataField: "PlateCode", visible: true, caption: "PlateCode", width: 120 },
            { dataField: "ColorSpecifications", visible: true, caption: "ColorSpecifications", width: 120 },
            { dataField: "FormNo", visible: true, caption: "FormNo", width: 120 },
            { dataField: "ItemName", visible: true, caption: "ItemName", width: 120 },
            { dataField: "BatchNo", visible: true, caption: "BatchNo", width: 120 },
            { dataField: "WarehouseName", visible: true, caption: "WarehouseName", width: 120 },
            { dataField: "BinName", visible: true, caption: "BinName", width: 120 },
            { dataField: "Narration", visible: true, caption: "Narration", width: 120 },
            { dataField: "ModifiedDate", visible: true, caption: "ModifiedDate", width: 120 },
            { dataField: "CreatedDate", visible: true, caption: "CreatedDate", width: 120 },
            { dataField: "VoucherPrefix", visible: false, caption: "VoucherPrefix", width: 120 },
            { dataField: "UserID", visible: false, caption: "UserID", width: 120 },
            { dataField: "CompanyID", visible: false, caption: "CompanyID", width: 120 },
            { dataField: "WarehouseID", visible: false, caption: "WarehouseID", width: 120 },

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