
var Stockrow = "";
var Gblshowlist = [];

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
        url: "WebService_PlatePhysicalVerification.asmx/GetVoucherNoForScrap",
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
            url: "WebService_PlatePhysicalVerification.asmx/GetMakePlateList",
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
            { dataField: "ProductMasterContentNO", visible: true, caption: "ProductMasterContentNO", width: 120 },
            { dataField: "JobCardContentNo", visible: true, caption: "JobCardContentNo", width: 120 },
            { dataField: "LedgerName", visible: true, caption: "LedgerName", width: 100 },
            { dataField: "PlateCode", visible: true, caption: "PlateCode", width: 100 },
            { dataField: "JobName", visible: true, caption: "JobName", width: 200 },
            { dataField: "PlanContName", visible: true, caption: "PlanContName", width: 150 },
            { dataField: "ProductCode", visible: true, caption: "ProductCode", width: 100 },
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
            Stockrow = "";
            Stockrow = selectedItems.selectedRowsData[0];
        }

    });
}

$("#BtnSave").click(function () {
    var dataGrid = $("#gridnewstock").dxDataGrid('instance');
    if (Stockrow.length <= 0) {
        DevExpress.ui.notify("Please choose any record from above grid for scrap..!", "warning", 1200);
        return;
    }
    var ObjPlaetScrapMain = [];
    var optPlateScrapMain = {};

    optPlateScrapMain.VoucherDate = $('#DtPickerVoucherDate').dxDateBox('instance').option('value');
    optPlateScrapMain.Narration = document.getElementById("TxtNarration").value;
    optPlateScrapMain.VoucherID = -42;
    optPlateScrapMain.LedgerID = Stockrow.LedgerID;
    optPlateScrapMain.JobBookingJobCardContentsID = Stockrow.ProductMasterContentsID;
    optPlateScrapMain.JobBookingID = Stockrow.JobBookingID;

    ObjPlaetScrapMain.push(optPlateScrapMain);

    var ObjPlateScrapDetail = [];
    var optPlateScrapDetail = {};

    optPlateScrapDetail.TransID = 1;
    optPlateScrapDetail.ItemID = Stockrow.ItemID;
    optPlateScrapDetail.JobBookingID = Stockrow.JobBookingID;
    optPlateScrapDetail.JobBookingJobCardContentsID = Stockrow.JobBookingJobCardContentsID;
    optPlateScrapDetail.ColorSpecifications = Stockrow.ColorSpecifications;
    optPlateScrapDetail.FormNo = Stockrow.FormNo;
    optPlateScrapDetail.PlateCode = Stockrow.PlateCode;
    optPlateScrapDetail.PlateId = Stockrow.PlateID;
    optPlateScrapDetail.IssueQuantity = 1;
    optPlateScrapDetail.ApprovedQuantity = 1;
    optPlateScrapDetail.NewStockQuantity = 1;
    optPlateScrapDetail.BatchNo = Stockrow.BatchNo;
    optPlateScrapDetail.WarehouseID = Stockrow.WarehouseID;

    ObjPlateScrapDetail.push(optPlateScrapDetail);


    var PlateScrapDetailData = JSON.stringify(ObjPlateScrapDetail);
    var PlateScrapMainData = JSON.stringify(ObjPlaetScrapMain);

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
                document.getElementById("LOADER").style.display = "block";
                var Prefix = "PSC";
                try {
                    $.ajax({
                        type: "POST",
                        url: "WebService_PlatePhysicalVerification.asmx/SavePlateScrapData",
                        data: '{prefix:' + JSON.stringify(Prefix) + ',PlateScrapMainData:' + PlateScrapMainData + ',PlateScrapDetailData:' + PlateScrapDetailData + '}',
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

$("#BtnNew").click(function () {
    document.getElementById("BtnSave").disabled = false;
    location.reload();
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
            url: "WebService_PlatePhysicalVerification.asmx/ScrapShowlist",
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
