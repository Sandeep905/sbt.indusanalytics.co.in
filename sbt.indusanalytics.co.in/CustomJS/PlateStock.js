

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
