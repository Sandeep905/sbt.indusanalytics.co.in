
var existRateDATA = [];
var ExistRESS1 = [];
var existRow = [];

var OprIds = [];

$(function () {
    var ProcessSlabs = [];
    $.ajax({
        type: 'POST',
        async: false,
        url: "WebServicePlanWindow.asmx/LoadOperationsSlabs",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},    // "{'name': '" + Method_Name + "'}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/(?:\r\n|\r|\n)/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.substr(1);
            res = res.slice(0, -1);
            ProcessSlabs = JSON.parse(res.toString());

            $.ajax({
                type: "POST",
                url: "WebService_VendorWiseRateSetting.asmx/VendorChargesType",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/"d":""/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"u0026"/g, '&');
                    res = res.replace(/u0027/g, "'");
                    res = res.replace(/,}/g, ",null}");
                    res = res.replace(/:}/g, ":null}");
                    res = res.replace(/:,/g, ":null,");
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res);
                    ShowGroupGrid(RES1, ProcessSlabs);
                    AlloactedGrid(RES1);
                }
            });

        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
});

$("#SelectBoxSupplierName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        var SMID = "";
        SMID = data.value;
        if (SMID === "" || SMID === undefined || SMID === null || SMID === "null" || SMID === "NULL") {
            $("#AlocatedList2Grid").dxDataGrid({ dataSource: [] });
            var grid1 = $('#AlocatedList2Grid').dxDataGrid('instance');
            grid1.clearSelection();
            return;
        }

        $.ajax({
            type: "POST",
            url: "WebService_VendorWiseRateSetting.asmx/GetAllExistProcessVendorWise",
            data: '{SMID:' + JSON.stringify(SMID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/"u0026"/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);

                var ExistRESS1 = JSON.parse(res);

                $("#AlocatedList2Grid").dxDataGrid({ dataSource: ExistRESS1 });

                var grid1 = $('#AlocatedList2Grid').dxDataGrid('instance');
                grid1.clearSelection();
            }
        });

    }
});

$.ajax({
    type: "POST",
    url: "WebService_VendorWiseRateSetting.asmx/VendorName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"u0026"/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SM = JSON.parse(res);
        $("#SelectBoxSupplierName").dxSelectBox({ items: SM });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_VendorWiseRateSetting.asmx/GetAllProcess",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"u0026"/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var AllProcess = JSON.parse(res);
        //ShowGroupGrid(AllProcess);
        $("#AutoLoadList1Grid").dxDataGrid({
            dataSource: AllProcess
        });
    }
});

function ShowGroupGrid(VendorChargesType, slabNames) {
    $("#AutoLoadList1Grid").dxDataGrid({
        allowEditing: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        sorting: { mode: 'none' },
        wordWrapEnabled: true,
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "RateType" || e.column.dataField === "RateFactor") {
                e.cancel = false;
            } else
                e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        //scrolling: {
        //    mode: 'infinite'
        //},
        paging: {
            pageSize: 100
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType !== "data") return;

            if (clickedCell.column.caption === "Add") {
                try {
                    var dataGrid = $('#AlocatedList2Grid').dxDataGrid('instance');
                    var newdata = [];
                    newdata = clickedCell.data;
                    if (newdata.RateType === undefined || newdata.RateType === "") {
                        DevExpress.ui.notify("Please select process charge type from dropdown..!", "warning", 1500);
                        return false;
                    }

                    for (var k = 0; k <= dataGrid._options.dataSource.length - 1; k++) {
                        if (clickedCell.data.RateFactor === dataGrid._options.dataSource[k].RateFactor && clickedCell.data.ProcessID === dataGrid._options.dataSource[k].ProcessID) { // && dataGrid._options.dataSource[k].RateType === clickedCell.data.RateType
                            DevExpress.ui.notify("This process is already added.. Please add another process..!", "warning", 1500);
                            return false;
                        }
                    }

                    newdata.MinimumCharges = 0;
                    
                    var clonedItem = $.extend({}, newdata);
                    dataGrid._options.dataSource.splice(dataGrid._options.dataSource.length, 0, clonedItem);
                    dataGrid.refresh(true);

                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "ProcessID", visible: false, caption: "ProcessID" },
            { dataField: "ProcessName", caption: "Process Name", minWidth: 150 },
            { dataField: "StartUnit", visible: false, caption: "Start Unit", width: 80 },
            { dataField: "EndUnit", visible: false, caption: "End Unit", width: 80 },
            { dataField: "UnitConversion", visible: false, caption: "Unit Conversion", width: 100 },
            { dataField: "Rate", caption: "Rate", width: 70 },
            { dataField: "TypeofCharges", visible: false, caption: "Type Of Charges", width: 120 },
            //{
            //    dataField: "RateFactor",
            //    lookup: {
            //        dataSource: function (options) {
            //            return {
            //                store: slabNames,
            //                filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
            //            };
            //        },
            //        displayExpr: "RateFactor",
            //        valueExpr: "RateFactor"
            //    },
            //    width: 180
            //},
            {
                dataField: "RateType", caption: "Charges Type", width: 120,
                lookup: {
                    dataSource: VendorChargesType,
                    valueExpr: "RateType",
                    displayExpr: "RateType"
                }
            },
            {
                dataField: "Add", fixedPosition: "right", fixed: true, caption: "Add", width: 50,
                cellTemplate: function (container, options) {
                    $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
                }
            }
        ]
    });
}

function AlloactedGrid(VendorChargesType) {

$("#AlocatedList2Grid").dxDataGrid({
    dataSource: ExistRESS1,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: {
        mode: "none" // or "multiple" | "single"
    },
    // selection: { mode: "single" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    editing: {
        mode: 'cell',
        allowDeleting: true,
        allowUpdating: true
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "Rate" || e.column.dataField === "MinimumCharges" || e.column.dataField === "RateType") {
            e.cancel = false;
        } else e.cancel = true;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    height: function () {
        return window.innerHeight / 1.4;
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", minWidth: 150 },
        { dataField: "StartUnit", visible: false, caption: "Start Unit", width: 80 },
        { dataField: "EndUnit", visible: false, caption: "End Unit", width: 60 },
        { dataField: "UnitConversion", visible: false, caption: "Unit Conv.", width: 100 },
        { dataField: "RateFactor", visible: false, width: 180 },
        { dataField: "Rate", caption: "Rate", width: 50 },
        { dataField: "MinimumCharges", caption: "Min Charges", width: 120 },
        {
            dataField: "RateType", caption: "Charges Type", width: 120,
            lookup: {
                dataSource: VendorChargesType,
                valueExpr: "RateType",
                displayExpr: "RateType"
            }
        }
    ]
});

}
$("#SaveButton").click(function () {
    var SupplierName = $("#SelectBoxSupplierName").dxSelectBox("instance").option('value');

    if (SupplierName === "" || SupplierName === undefined || SupplierName === null) {
        swal("", "Please select vendor..!", "warning");
        document.getElementById("SelectBoxSupplierName").focus();
        document.getElementById("ValStrSelectBoxSupplierName").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "block";
        document.getElementById("ValStrSelectBoxSupplierName").innerHTML = 'This field should not be empty..Vendor Name';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxSupplierName").style.display = "none";
    }

    var jsonObjectsRateRecord = [];
    var OperationRateRecord = {};

    var AlocatedList2Grid = $('#AlocatedList2Grid').dxDataGrid('instance');
    var AlocatedList2GridRow = AlocatedList2Grid._options.dataSource.length;

    if (AlocatedList2GridRow <= 0) {
        swal("", "Please add row in second grid from first grid..!", "warning");
        return false;
    }

    document.getElementById("LOADER").style.display = "block";

    for (var k = 0; k < AlocatedList2GridRow; k++) {
        OperationRateRecord = {};
        OperationRateRecord.LedgerID = SupplierName;
        OperationRateRecord.ProcessID = AlocatedList2Grid._options.dataSource[k].ProcessID;
        OperationRateRecord.Rate = Number(AlocatedList2Grid._options.dataSource[k].Rate).toFixed(3);
        OperationRateRecord.MinimumCharges = AlocatedList2Grid._options.dataSource[k].MinimumCharges;
        OperationRateRecord.RateType = AlocatedList2Grid._options.dataSource[k].RateType;
        OperationRateRecord.RateFactor = AlocatedList2Grid._options.dataSource[k].RateFactor;

        jsonObjectsRateRecord.push(OperationRateRecord);
    }

    $.ajax({
        type: "POST",
        url: "WebService_VendorWiseRateSetting.asmx/SaveVendorRatesetting",
        data: '{jsonObjectsRateRecord:' + JSON.stringify(jsonObjectsRateRecord) + ',VendorID:' + JSON.stringify(SupplierName) + '}',
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
            if (res === "Success") {
                swal("Saved!", "Your data saved", "success");
                $("#RefreshButton").click();
            }
            else {
                swal("Error..!", res, "error");
            }
        },
        error: function errorFunc(jqXHR) {
            document.getElementById("LOADER").style.display = "none";
            swal("Error!", "Please try after some time..", "");
            alert(jqXHR);
        }
    });

});

$("#RefreshButton").click(function () {
    location.reload();
});