
var existslab = [];
var GblStatus = "";
var WastageTypeChange = "";
var CoatingSlabs = [];

$("#CreateButton").click(function () {
    GblStatus = "Save";
    newEntry();

    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("BtnDeletePopUp").disabled = true;

    Slabgrid();
    $("#MachineGridCoatingSlabs").dxDataGrid({ dataSource: [] });
    $('#MachineGridSlab').dxDataGrid('instance').addRow();

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
    $('#largeModal .nav-tabs li:eq(0) a').tab('show');
});

$("#EditButton").click(function () {
    GblStatus = "Update";
    var MachineGetGridRow = document.getElementById("MachineGetGridRow").value;
    document.getElementById("BtnSaveAS").disabled = "";

    if (MachineGetGridRow === "" || MachineGetGridRow === null || MachineGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    var MachineGrid = $('#MachineGrid').dxDataGrid('instance');
    var selectedMachineRows = MachineGrid.getSelectedRowsData();
    $('#largeModal .nav-tabs li:eq(0) a').tab('show');

    $("#UnderDepartment").dxSelectBox({ value: selectedMachineRows[0].DepartmentID });
    $("#SelectBoxMachineType").dxSelectBox({ value: selectedMachineRows[0].MachineType });
    $("#SelectBoxVendor").dxSelectBox({ value: selectedMachineRows[0].VendorID });

    document.getElementById("TxtMinimumWidth").value = selectedMachineRows[0].MinWidth;
    document.getElementById("TxtMinimumLength").value = selectedMachineRows[0].MinLength;
    document.getElementById("TxtMaximumWidthh").value = selectedMachineRows[0].MaxWidth;
    document.getElementById("TxtMaximumLength").value = selectedMachineRows[0].MaxLength;
    document.getElementById("TxtReelSizeMaxcutting").value = selectedMachineRows[0].MaxReelSize;
    document.getElementById("TxtReelSizeMincutting").value = selectedMachineRows[0].MinReelSize;
    document.getElementById("TxtReelSizeCutofmaxcutting").value = selectedMachineRows[0].WebCutOffSize;
    document.getElementById("TxtReelSizeCutofMincutting").value = selectedMachineRows[0].WebCutOffSizeMin;
    document.getElementById("TxtReelSizeMax").value = selectedMachineRows[0].MaxReelSize;
    document.getElementById("TxtReelSizeMin").value = selectedMachineRows[0].MinReelSize;
    document.getElementById("TxtReelSizeCutOff").value = selectedMachineRows[0].WebCutOffSize;
    document.getElementById("TxtPlateSizeWidth").value = selectedMachineRows[0].PlateWidth;
    document.getElementById("TxtPlateSizeLength").value = selectedMachineRows[0].PlateLength;

    document.getElementById("MachineName").value = selectedMachineRows[0].MachineName;
    document.getElementById("Griper").value = selectedMachineRows[0].Gripper;
    document.getElementById("PrintingMargin").value = selectedMachineRows[0].PrintingMargin;
    document.getElementById("Colors").value = selectedMachineRows[0].Colors;
    document.getElementById("MakeReadyCharges").value = selectedMachineRows[0].MakeReadyCharges;
    document.getElementById("MakeReadyWastageSheet").value = selectedMachineRows[0].MakeReadyWastageSheet;
    document.getElementById("TxtMakeReadyTime").value = selectedMachineRows[0].MakeReadyTime;
    document.getElementById("TxtJobChargeOverTime").value = selectedMachineRows[0].JobChangeOverTime;
    document.getElementById("TxtImpressionsperMinute").value = selectedMachineRows[0].MachineSpeed;
    document.getElementById("TxtElectricCon").value = selectedMachineRows[0].ElectricConsumption;

    document.getElementById("TxtCostPerHour").value = selectedMachineRows[0].PerHourCost;

    document.getElementById("TxtMiniPrinting").value = selectedMachineRows[0].MinimumSheet;
    document.getElementById("TxtBasicPrintingCharged").value = selectedMachineRows[0].BasicPrintingCharges;
    document.getElementById("TxtRoundofImpressionsWith").value = selectedMachineRows[0].RoundofImpressionsWith;
    document.getElementById("IsPerFectAMachine").checked = selectedMachineRows[0].IsPerfectaMachine;
    document.getElementById("IsSpecialMachine").checked = selectedMachineRows[0].IsSpecialMachine;

    var n1 = selectedMachineRows[0].RoundofImpressionsWith;
    // aa = "Impressions" + "/" + n1 + "/" + "Color";
    $("#SelectBoxTypeOfCharges").dxSelectBox({
        items: ["Impressions", "Impressions" + "/" + n1, "Impressions/Color", "Impressions" + "/" + n1 + "/" + "Color"],
        width: 190,
        placeholder: "Select Type of Charges",
        showClearButton: true
    });

    $("#SelectBoxTypeOfCharges").dxSelectBox({
        value: selectedMachineRows[0].ChargesType
    });
    $("#SelectBoxWastagetype").dxSelectBox({
        value: selectedMachineRows[0].WastageType
    });
    $("#SelectBoxWastageCalculationOn").dxSelectBox({
        value: selectedMachineRows[0].WastageCalculationOn
    });

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/ExistSlab",
        data: '{Machineid:' + JSON.stringify(document.getElementById("Machineid").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            existslab = JSON.parse(res);

            Slabgrid();
        }
    });

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/GetMachineOnlineCoatingRates",
        data: '{MID:' + Number(document.getElementById("Machineid").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            CoatingSlabs = [];
            var optExistData = {};
            if (RES1.length > 0) {
                for (var t = 0; t < RES1.length; t++) {
                    optExistData = {};
                    optExistData.CoteID = t + 1;
                    optExistData.CoatingName = RES1[t].CoatingName;
                    optExistData.SheetRangeFrom = RES1[t].SheetRangeFrom;
                    optExistData.SheetRangeTo = RES1[t].SheetRangeTo;
                    optExistData.RateType = RES1[t].RateType;
                    optExistData.Rate = RES1[t].Rate;
                    optExistData.BasicCoatingCharges = RES1[t].BasicCoatingCharges;
                    CoatingSlabs.push(optExistData);
                }
                $("#MachineGridCoatingSlabs").dxDataGrid({
                    dataSource: CoatingSlabs
                });
            }
            else {
                CoatingSlabs = [];
                $("#MachineGridCoatingSlabs").dxDataGrid({
                    dataSource: CoatingSlabs
                });
            }
            //var DynamicCols = [];
            //for (var Ex = 0; Ex < 1; Ex++) {
            //    var exRow = JSON.stringify(RES1[Ex]);
            //    exRow = exRow.replace(/"/g, '');
            //    exRow = exRow.substr(1);
            //    exRow = exRow.slice(0, -1);
            //    var splitRow = exRow.split(',');
            //    for (var sp in splitRow) {
            //        var splitColon = splitRow[sp];
            //        splitColon = splitColon.split(':');
            //        var Colobj = splitColon[0];
            //        DynamicCol = {};
            //        DynamicCol.dataField = Colobj;
            //        DynamicCols.push(DynamicCol);
            //    }
            //}
            //$("#MachineGridCoatingSlabs").dxDataGrid({
            //    dataSource: RES1,
            //    columns: DynamicCols
            //});
        }
    });

    document.getElementById("BtnDeletePopUp").disabled = false;
    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

//SaveAs Data On Pop Up
$("#BtnSaveAS").click(function () {
    GblStatus = "";
    $("#BtnSave").click();
});

var DelCoteID = "";
var MachineGridCoatingSlabs = $("#MachineGridCoatingSlabs").dxDataGrid({
    dataSource: CoatingSlabs,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    sorting: {
        mode: "none"
    },
    height: function () {
        return window.innerHeight / 1.5;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    filterRow: { visible: true, applyFilter: "auto" },
    rowAlternationEnabled: true,
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    editing: {
        mode: "row",
        allowDeleting: true,
        texts: { confirmDeleteMessage: "" }
    },
    onRowRemoving: function (e) {
        DelCoteID = "";
        DelCoteID = e.data.CoteID;
    },
    onRowRemoved: function (e) {
        if (CoatingSlabs !== "" && CoatingSlabs !== [] && CoatingSlabs !== undefined && CoatingSlabs !== null) {
            CoatingSlabs = CoatingSlabs.filter(function (obj) {
                return obj.CoteID !== DelCoteID;
            });
        }
    },
    columns: [
        { dataField: "CoteID", visible: false, caption: "CoteID", width: 200 },
        { dataField: "CoatingName", visible: true, caption: "Coating Name", width: 300 },
        { dataField: "SheetRangeFrom", visible: true, caption: "Sheet From", width: 200 },
        { dataField: "SheetRangeTo", visible: true, caption: "Sheet To", width: 200 },
        { dataField: "RateType", visible: true, caption: "Rate Type", width: 250 },
        { dataField: "Rate", visible: true, caption: "Rate", width: 120 },
        { dataField: "BasicCoatingCharges", visible: true, caption: "Min.Charge", width: 120 }
    ]
}).dxDataGrid("instance");

$("#UnderDepartment").dxSelectBox({
    placeholder: "Select Under Group",
    displayExpr: 'DepartmentName',
    valueExpr: 'DepartmentID',
    //width: 420,
    searchEnabled: true,
    onValueChanged: function (data) {
        var selectDepartment = data.value;
        if (selectDepartment === 100) {
            document.getElementById("AnchorMachineMasterCoatingSlabGrid").style.display = "block";

            document.getElementById("SelectBoxMachineTypeDiv").style.display = "block";
            document.getElementById("ForPrintingDepartmrnt").style.display = "block";

            document.getElementById("PrintingMarginDiv").style.display = "block";
            document.getElementById("ColorsDiv").style.display = "block";
        }
        else {
            blankBoxControll();
            document.getElementById("AnchorMachineMasterCoatingSlabGrid").style.display = "none";

            document.getElementById("SelectBoxMachineTypeDiv").style.display = "none";
            document.getElementById("ForPrintingDepartmrnt").style.display = "none";

            document.getElementById("PrintingMarginDiv").style.display = "none";
            document.getElementById("ColorsDiv").style.display = "none";
        }
    }
});

$("#SelectBoxVendor").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'VendorName',
    valueExpr: 'VendorID',
    showClearButton: true,
    searchEnabled: true
});

$.ajax({
    type: 'POST',
    url: 'WebService_MachineMaster.asmx/GetSelectDepartment',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: {},
    crossDomain: true,
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#UnderDepartment").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
    }
});

$.ajax({
    type: 'POST',
    url: 'WebService_LedgerMaster.asmx/GetVendorList',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.replace(/:,/g, ":null,");
        res = res.replace(/:}/g, ":null}");
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelectBoxVendor").dxSelectBox({
            items: RES1
        });
    },
    error: function errorFunc(jqXHR) {
    }
});

$("#SelectBoxMachineType").dxSelectBox({
    items: ["Sheetfed Offset", "Web Offset", "Digital", "Reel To Sheet Cutting"],
    //  width: 168,
    placeholder: "Select Machine Type",

    onValueChanged: function (data) {
        var selectitem = data.value;

        var se1 = "Sheetfed Offset";
        var se2 = "Web Offset";
        var se3 = "Digital";
        var se4 = "Reel To Sheet Cutting";

        var PlateSize = document.getElementById("PlateSize");
        var PaperAreaFirst = document.getElementById("PaperAreaFirst");
        var PaperAreaForWebOffSet = document.getElementById("PaperAreaForWebOffSet");
        var ReeltoSheetCuttingdiv = document.getElementById("ReeltoSheetCuttingdiv");

        if (selectitem === se1) {
            blankBoxControll();

            document.getElementById("IsPerFectAMachine").disabled = false;
            PlateSize.style.display = "block";
            PaperAreaFirst.style.display = "block";
            PaperAreaForWebOffSet.style.display = "none";
            ReeltoSheetCuttingdiv.style.display = "none";
        }
        else if (selectitem === se2) {

            blankBoxControll();
            document.getElementById("IsPerFectAMachine").disabled = false;

            //var PlateSize = document.getElementById("PlateSize");
            //PlateSize.style.display = "block";

            //var PaperAreaForWebOffSet = document.getElementById("PaperAreaForWebOffSet");
            //PaperAreaForWebOffSet.style.display = "block";

            //var PaperAreaFirst = document.getElementById("PaperAreaFirst");
            //PaperAreaFirst.style.display = "none";

            //var ReeltoSheetCuttingdiv = document.getElementById("ReeltoSheetCuttingdiv");
            //ReeltoSheetCuttingdiv.style.display = "none";

            PlateSize.style.display = "block";
            PaperAreaFirst.style.display = "block";
            PaperAreaForWebOffSet.style.display = "none";
            ReeltoSheetCuttingdiv.style.display = "none";
        }
        else if (selectitem === se3) {
            blankBoxControll();
            document.getElementById("IsPerFectAMachine").disabled = false;

            PaperAreaFirst.style.display = "block";
            PlateSize.style.display = "none";
            ReeltoSheetCuttingdiv.style.display = "none";
            PaperAreaForWebOffSet.style.display = "none";
        }
        else if (selectitem === se4) {
            blankBoxControll();

            document.getElementById('IsPerFectAMachine').checked = false;
            document.getElementById("IsPerFectAMachine").disabled = true;

            PlateSize.style.display = "none";
            PaperAreaFirst.style.display = "none";
            PaperAreaForWebOffSet.style.display = "none";
            ReeltoSheetCuttingdiv.style.display = "block";
        }
    }
});

$("#MachineName").change(function (e) {
    var VTxtMachine = document.getElementById("MachineName").value.trim();

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/TxtChangeEventFun",
        data: '{VTxtMachine:' + JSON.stringify(VTxtMachine) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var MachineName = results.replace(/\\/g, '');
            MachineName = MachineName.replace(/"d":/g, '');
            MachineName = MachineName.replace(/""/g, '');
            MachineName = MachineName.substr(1);
            MachineName = MachineName.slice(0, -1);
            var RES1 = JSON.parse(MachineName.toString());

            if (RES1 !== null && RES1 !== "" && RES1.length > 0) {
                alert("Machine Name All Ready Exist..!,Please Enter Another Machine Name");
                document.getElementById('MachineName').value = "";
                document.getElementById("MachineName").focus();
                return false;
            }
        },
        error: function errorFunc(jqXHR) {

        }
    });
});

$("#BtnSave").click(function () {
    SaveBtnMachinee();
});

$("#DeleteButton").click(function () {
    var MachineGetGridRow = document.getElementById("MachineGetGridRow").value;
    if (MachineGetGridRow === "" || MachineGetGridRow === null || MachineGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
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
                url: "WebService_MachineMaster.asmx/DeleteMachineMasterData",
                data: '{Machineid:' + JSON.stringify(document.getElementById("Machineid").value.trim()) + '}',
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
                        swal("Deleted..!", "Your data Deleted", "success");
                        location.reload();
                    } else if (res.includes("Further Used")) {
                        swal("Can't Deleted..!", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert(jqXHR);
                }
            });

        });
});

$("#BtnNew").click(function () {
    newEntry();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});
DefaultMasterField();

function DefaultMasterField() {

    document.getElementById("LOADER").style.display = "block";

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/MachineMaster",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.replace(/,}/g, ",null}");
            res = res.replace(/:}/g, ":null}");
            res = res.replace(/:,/g, ":null,");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            var GBLFieldProcessMaster = JSON.parse(res);

            $("#MachineGrid").dxDataGrid({
                dataSource: GBLFieldProcessMaster
            });
        }
    });
}

$("#MachineGrid").dxDataGrid({
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
    selection: { mode: "single" },
    paging: {
        pageSize: 100
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [100, 200, 500, 1000]
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: true },
    headerFilter: { visible: true },
    rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Machine Master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (e) {
        if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
        var Row = e.row.rowIndex;

        document.getElementById("MachineGetGridRow").value = Row;
        document.getElementById("Machineid").value = e.row.data.MachineId;/// grid.cellValue(Row, 0);
    },
    columns: [
        { dataField: "MachineName", caption: "Machine Name", width: 120 },
        { dataField: "MachineType", caption: "Machine Type", width: 120 },
        { dataField: "DepartmentName", width: 120 },
        { dataField: "Gripper", caption: "Gripper", width: 120 },
        { dataField: "MaxLength", caption: "Max Length", width: 120 },
        { dataField: "MaxWidth", caption: "Max Width", width: 120 },
        { dataField: "MinLength", caption: "Min Length", width: 120 },
        { dataField: "MinWidth", caption: "Min Width", width: 120 },
        { dataField: "PerHourCost", caption: "Per Hour Cost", width: 120 },
        { dataField: "Colors", caption: "Colors", width: 120 },
        { dataField: "MakeReadyCharges", caption: "Make Ready Charges", width: 120 },
        { dataField: "MakeReadyWastageSheet", caption: "Make Ready Wastage Sheet", width: 120 },
        { dataField: "MakeReadyTime", caption: "Make Ready Time", width: 120 },
        { dataField: "ElectricConsumption", caption: "Electric Consumption", width: 120 },
        { dataField: "MachineSpeed", caption: "Machine Speed", width: 120 },
        { dataField: "PrintingMargin", caption: "Printing Margin", width: 120 },
        { dataField: "IsPerfectaMachine", caption: "Is Perfecta Machine", dataType: "boolean", width: 120 },
        { dataField: "BasicPrintingCharges", caption: "Basic Printing Charges", width: 120 },
        { dataField: "PlateLength", caption: "Plate Length", width: 120 },
        { dataField: "PlateWidth", caption: "Plate Width", width: 120 },
        { dataField: "MinimumSheet", caption: "Minimum Sheet", width: 120 },
        { dataField: "WastageType", caption: "Wastage Type", width: 120 },
        { dataField: "ChargesType", caption: "Charges Type", width: 120 },
        { dataField: "WastageCalculationOn", caption: "Wastage Calculation On", width: 120 },
        { dataField: "BasicPrintingCharges", caption: "Basic Printing Charges", width: 120 }
    ]
});

function SaveBtnMachinee() {
    var MachineType = $('#SelectBoxMachineType').dxSelectBox('instance').option('text');
    var UnderDepartment = $('#UnderDepartment').dxSelectBox('instance').option('value');

    var MachineName = document.getElementById("MachineName").value.trim();
    var Gripper = document.getElementById("Griper").value.trim();
    var PrintingMargin = document.getElementById("PrintingMargin").value.trim();
    var Colors = document.getElementById("Colors").value.trim();
    var MakeReadyCharges = document.getElementById("MakeReadyCharges").value.trim();
    var MakeReadyWastageSheet = document.getElementById("MakeReadyWastageSheet").value.trim();
    var MakeReadyTime = document.getElementById("TxtMakeReadyTime").value.trim();
    var JobChangeOverTime = document.getElementById("TxtJobChargeOverTime").value.trim();
    var MachineSpeed = document.getElementById("TxtImpressionsperMinute").value.trim();
    var ElectricConsumption = document.getElementById("TxtElectricCon").value.trim();
    var PerHourCost = document.getElementById("TxtCostPerHour").value.trim();
    var IsPerfectaMachine = document.getElementById('IsPerFectAMachine').checked;
    var IsPlanningMachine = document.getElementById('IsPlanningMachine').checked; //Added by pKp for planning machine case
    var IsSpecialMachine = document.getElementById('IsSpecialMachine').checked; //Added by pKp for planning machine takes f&b printing case only

    var MinimumSheet = document.getElementById("TxtMiniPrinting").value.trim();
    var BasicPrintingCharges = document.getElementById("TxtBasicPrintingCharged").value.trim();
    var RoundofImpressionsWith = document.getElementById("TxtRoundofImpressionsWith").value.trim();

    var ChargesType = $('#SelectBoxTypeOfCharges').dxSelectBox('instance').option('text');
    var WastageType = $('#SelectBoxWastagetype').dxSelectBox('instance').option('text');
    var WastageCalculationOn = $('#SelectBoxWastageCalculationOn').dxSelectBox('instance').option('text');
    var SelectBoxVendorID = $('#SelectBoxVendor').dxSelectBox('instance').option('value');
    //For Box-----------------------
    var MinWidth = document.getElementById("TxtMinimumWidth").value.trim();          //PaperAreaFirst
    var MinLength = document.getElementById("TxtMinimumLength").value.trim();
    var MaxLength = document.getElementById("TxtMaximumLength").value.trim();
    var MaxWidth = document.getElementById("TxtMaximumWidthh").value.trim();

    var PlateWidth = document.getElementById("TxtPlateSizeWidth").value.trim();        //PlateSize
    var PlateLength = document.getElementById("TxtPlateSizeLength").value.trim();

    var MaxReelSize = document.getElementById("TxtReelSizeMax").value.trim();                 //PaperAreaForWebOffSet
    var MinReelSize = document.getElementById("TxtReelSizeMin").value.trim();
    var WebCutOffSize = document.getElementById("TxtReelSizeCutOff").value.trim();

    var MaxReelSizeCUT = document.getElementById("TxtReelSizeMaxcutting").value.trim();             //ReeltoSheetCuttingdiv
    var MinReelSizeCUT = document.getElementById("TxtReelSizeMincutting").value.trim();
    var ReelCutOffSizeCUT = document.getElementById("TxtReelSizeCutofmaxcutting").value.trim();
    var WebCutOffSizeMinCUT = document.getElementById("TxtReelSizeCutofMincutting").value.trim();

    //Close For Box-----------------------

    var val = /^[0-9]+$/;
    var decimal = /^[0-9]+\.?[0-9]*$/;

    if (MachineName === "") {
        alert("Please Enter Machine name");
        document.getElementById("MachineName").focus();
        document.getElementById("ValStrMachineName").style.fontSize = "10px";
        document.getElementById("ValStrMachineName").style.display = "block";
        document.getElementById("ValStrMachineName").innerHTML = 'This field should not be empty..Machine Name';
        return false;
    }
    else {
        document.getElementById("ValStrMachineName").style.display = "none";
    }

    var SheetfedOffset = "Sheetfed Offset";
    var WebOffset = "Web Offset";
    var Digital = "Digital";
    var ReelToSheetCutting = "Reel To Sheet Cutting";

    if (UnderDepartment === null || UnderDepartment === "") {
        swal("", "Please select..Under Department");
        document.getElementById("ValStrUnderDepartment").style.fontSize = "10px";
        document.getElementById("ValStrUnderDepartment").style.display = "block";
        document.getElementById("ValStrUnderDepartment").innerHTML = 'This field should not be empty..Under Department';
        return false;
    }
    else {
        document.getElementById("ValStrUnderDepartment").style.display = "none";
    }
    if ($("#SelectBoxVendor").hasClass("hidden") === false) {
        if (SelectBoxVendorID === null || SelectBoxVendorID === 0) {
            swal("", "Please select associate partner..");
            document.getElementById("ValStrSelectBoxVendor").style.fontSize = "10px";
            document.getElementById("ValStrSelectBoxVendor").style.display = "block";
            document.getElementById("ValStrSelectBoxVendor").innerHTML = 'This field should not be empty..Associate Partner';
            return false;
        }
        else {
            document.getElementById("ValStrSelectBoxVendor").style.display = "none";
        }
    }
    if (UnderDepartment === 100) {
        if (MachineType === null || MachineType === "") {
            alert("Please select..Machine Type");
            document.getElementById("ValStrSelectBoxMachineType").style.fontSize = "10px";
            document.getElementById("ValStrSelectBoxMachineType").style.display = "block";
            document.getElementById("ValStrSelectBoxMachineType").innerHTML = 'This field should not be empty..Machine Type';
            return false;
        }
        else {
            document.getElementById("ValStrSelectBoxMachineType").style.display = "none";
        }

        if (MachineType === SheetfedOffset || MachineType === WebOffset) {

            if (!decimal.test(MinWidth)) {                                     //PaperAreaFirst
                alert("Please Enter Minimum Width Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMinimumWidth").focus();
                document.getElementById("ValStrTxtMinimumWidth").style.fontSize = "10px";
                document.getElementById("ValStrTxtMinimumWidth").style.display = "block";
                document.getElementById("ValStrTxtMinimumWidth").innerHTML = 'This field should not be empty..Min.W';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMinimumWidth").style.display = "none";
            }
            if (!decimal.test(MinLength)) {
                alert("Please Enter Minimum Length Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMinimumLength").focus();
                document.getElementById("ValStrTxtMinimumLength").style.fontSize = "10px";
                document.getElementById("ValStrTxtMinimumLength").style.display = "block";
                document.getElementById("ValStrTxtMinimumLength").innerHTML = 'This field should not be empty..Min.L';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMinimumLength").style.display = "none";
            }
            if (!decimal.test(MaxWidth)) {
                alert("Please Enter maximum Width Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMaximumWidthh").focus();
                document.getElementById("ValStrTxtMaximumWidthh").style.fontSize = "10px";
                document.getElementById("ValStrTxtMaximumWidthh").style.display = "block";
                document.getElementById("ValStrTxtMaximumWidthh").innerHTML = 'This field should not be empty..Max.W';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMaximumWidthh").style.display = "none";
            }
            if (!decimal.test(MaxLength)) {
                alert("Please Enter maximum Length Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMaximumLength").focus();
                document.getElementById("ValStrTxtMaximumLength").style.fontSize = "10px";
                document.getElementById("ValStrTxtMaximumLength").style.display = "block";
                document.getElementById("ValStrTxtMaximumLength").innerHTML = 'This field should not be empty..Max.L';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMaximumLength").style.display = "none";
            }


            if (!decimal.test(PlateWidth)) {                                    //PlateSize
                alert("Please Enter Valid Plate Width");
                document.getElementById("TxtPlateSizeWidth").focus();
                document.getElementById("ValStrTxtPlateSizeWidth").style.fontSize = "10px";
                document.getElementById("ValStrTxtPlateSizeWidth").style.display = "block";
                document.getElementById("ValStrTxtPlateSizeWidth").innerHTML = 'This field should not be empty..Width';
                return false;
            }
            else {
                document.getElementById("ValStrTxtPlateSizeWidth").style.display = "none";
            }
            if (!decimal.test(PlateLength)) {
                alert("Please Enter Valid Plate Length");
                document.getElementById("TxtPlateSizeLength").focus();
                document.getElementById("ValStrTxtPlateSizeLength").style.fontSize = "10px";
                document.getElementById("ValStrTxtPlateSizeLength").style.display = "block";
                document.getElementById("ValStrTxtPlateSizeLength").innerHTML = 'This field should not be empty..Length';
                return false;
            }
            else {
                document.getElementById("ValStrTxtPlateSizeLength").style.display = "none";
            }
        }

        //else if (MachineType === WebOffset) {
        //    if (!decimal.test(MaxReelSize)) {
        //        alert("Please Enter M Reel Size Can Be Run On Machine");
        //        document.getElementById("TxtReelSizeMax").focus();
        //        document.getElementById("ValStrTxtReelSizeMax").style.fontSize = "10px";
        //        document.getElementById("ValStrTxtReelSizeMax").style.display = "block";
        //        document.getElementById("ValStrTxtReelSizeMax").innerHTML = 'This field should not be empty..Reel Size Max';
        //        return false;
        //    }
        //    else {
        //        document.getElementById("ValStrTxtReelSizeMax").style.display = "none";
        //    }

        //    if (!decimal.test(MinReelSize)) {
        //        alert("Please Enter M Reel Size Can Be Run On Machine");
        //        document.getElementById("TxtReelSizeMin").focus();
        //        document.getElementById("ValStrTxtReelSizeMin").style.fontSize = "10px";
        //        document.getElementById("ValStrTxtReelSizeMin").style.display = "block";
        //        document.getElementById("ValStrTxtReelSizeMin").innerHTML = 'This field should not be empty..Min';
        //        return false;
        //    }
        //    else {
        //        document.getElementById("ValStrTxtReelSizeMin").style.display = "none";
        //    }

        //    if (!decimal.test(WebCutOffSize)) {
        //        alert("Please Enter Maximum Reel Size Can Be Run On Machine");
        //        document.getElementById("TxtReelSizeCutOff").focus();
        //        document.getElementById("ValStrTxtReelSizeCutOff").style.fontSize = "10px";
        //        document.getElementById("ValStrTxtReelSizeCutOff").style.display = "block";
        //        document.getElementById("ValStrTxtReelSizeCutOff").innerHTML = 'This field should not be empty..Cut Off';
        //        return false;
        //    }
        //    else {
        //        document.getElementById("ValStrTxtReelSizeCutOff").style.display = "none";
        //    }

        //    if (!decimal.test(PlateWidth)) {                                    //PlateSize
        //        alert("Please Enter Valid Plate Width");
        //        document.getElementById("TxtPlateSizeWidth").focus();
        //        document.getElementById("ValStrTxtPlateSizeWidth").style.fontSize = "10px";
        //        document.getElementById("ValStrTxtPlateSizeWidth").style.display = "block";
        //        document.getElementById("ValStrTxtPlateSizeWidth").innerHTML = 'This field should not be empty..Width';
        //        return false;
        //    }
        //    else {
        //        document.getElementById("ValStrTxtPlateSizeWidth").style.display = "none";
        //    }
        //    if (!decimal.test(PlateLength)) {
        //        alert("Please Enter Valid Plate Length");
        //        document.getElementById("TxtPlateSizeLength").focus();
        //        document.getElementById("ValStrTxtPlateSizeLength").style.fontSize = "10px";
        //        document.getElementById("ValStrTxtPlateSizeLength").style.display = "block";
        //        document.getElementById("ValStrTxtPlateSizeLength").innerHTML = 'This field should not be empty..Length';
        //        return false;
        //    }
        //    else {
        //        document.getElementById("ValStrTxtPlateSizeLength").style.display = "none";
        //    }
        //}

        else if (MachineType === Digital) {

            if (!decimal.test(MinWidth)) {                                     //PaperAreaFirst
                alert("Please Enter Minimum Width Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMinimumWidth").focus();
                document.getElementById("ValStrTxtMinimumWidth").style.fontSize = "10px";
                document.getElementById("ValStrTxtMinimumWidth").style.display = "block";
                document.getElementById("ValStrTxtMinimumWidth").innerHTML = 'This field should not be empty..Min.W';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMinimumWidth").style.display = "none";
            }
            if (!decimal.test(MinLength)) {
                alert("Please Enter Minimum Length Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMinimumLength").focus();
                document.getElementById("ValStrTxtMinimumLength").style.fontSize = "10px";
                document.getElementById("ValStrTxtMinimumLength").style.display = "block";
                document.getElementById("ValStrTxtMinimumLength").innerHTML = 'This field should not be empty..Min.L';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMinimumLength").style.display = "none";
            }
            if (!decimal.test(MaxWidth)) {
                alert("Please Enter maximum Width Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMaximumWidthh").focus();
                document.getElementById("ValStrTxtMaximumWidthh").style.fontSize = "10px";
                document.getElementById("ValStrTxtMaximumWidthh").style.display = "block";
                document.getElementById("ValStrTxtMaximumWidthh").innerHTML = 'This field should not be empty..Max.W';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMaximumWidthh").style.display = "none";
            }
            if (!decimal.test(MaxLength)) {
                alert("Please Enter maximum Length Of Paper, Can Be Run On Machine");
                document.getElementById("TxtMaximumLength").focus();
                document.getElementById("ValStrTxtMaximumLength").style.fontSize = "10px";
                document.getElementById("ValStrTxtMaximumLength").style.display = "block";
                document.getElementById("ValStrTxtMaximumLength").innerHTML = 'This field should not be empty..Max.L';
                return false;
            }
            else {
                document.getElementById("ValStrTxtMaximumLength").style.display = "none";
            }


        }

        else if (MachineType === ReelToSheetCutting) {

            if (!decimal.test(MaxReelSizeCUT)) {
                alert("Please Enter Maximum Reel Size Can Be Run On Machine");
                document.getElementById("TxtReelSizeMaxcutting").focus();
                document.getElementById("ValStrTxtReelSizeMaxcutting").style.fontSize = "10px";
                document.getElementById("ValStrTxtReelSizeMaxcutting").style.display = "block";
                document.getElementById("ValStrTxtReelSizeMaxcutting").innerHTML = 'This field should not be empty..Reel Size Max';
                return false;
            }
            else {
                document.getElementById("ValStrTxtReelSizeMaxcutting").style.display = "none";
            }
            if (!decimal.test(MinReelSizeCUT)) {
                alert("Please Enter Minimum Reel Size Can Be Run On Machine");
                document.getElementById("TxtReelSizeMincutting").focus();
                document.getElementById("ValStrTxtReelSizeMincutting").style.fontSize = "10px";
                document.getElementById("ValStrTxtReelSizeMincutting").style.display = "block";
                document.getElementById("ValStrTxtReelSizeMincutting").innerHTML = 'This field should not be empty..Min';
                return false;
            }
            else {
                document.getElementById("ValStrTxtReelSizeMincutting").style.display = "none";
            }
            if (!decimal.test(ReelCutOffSizeCUT)) {
                alert("Please Enter Maximum Cut-Off of The Machine");
                document.getElementById("TxtReelSizeCutofmaxcutting").focus();
                document.getElementById("ValStrTxtReelSizeCutofmaxcutting").style.fontSize = "10px";
                document.getElementById("ValStrTxtReelSizeCutofmaxcutting").style.display = "block";
                document.getElementById("ValStrTxtReelSizeCutofmaxcutting").innerHTML = 'This field should not be empty..Cut of Max';
                return false;
            }
            else {
                document.getElementById("ValStrTxtReelSizeCutofmaxcutting").style.display = "none";
            }
            if (!decimal.test(WebCutOffSizeMinCUT)) {
                alert("Please Enter Minimum Cut-Off of The Machine");
                document.getElementById("TxtReelSizeCutofMincutting").focus();
                document.getElementById("ValStrTxtReelSizeCutofMincutting").style.fontSize = "10px";
                document.getElementById("ValStrTxtReelSizeCutofMincutting").style.display = "block";
                document.getElementById("ValStrTxtReelSizeCutofMincutting").innerHTML = 'This field should not be empty..Min';
                return false;
            }
            else {
                document.getElementById("ValStrTxtReelSizeCutofMincutting").style.display = "none";
            }

        }

        if (!val.test(Colors)) {
            alert("Please Enter Valid Machine Colors");
            document.getElementById("Colors").focus();
            document.getElementById("ValStrColors").style.fontSize = "10px";
            document.getElementById("ValStrColors").style.display = "block";
            document.getElementById("ValStrColors").innerHTML = 'This field should not be empty..Colors';
            return false;
        }
        else {
            document.getElementById("ValStrColors").style.display = "none";
        }
    }
    else {

        if (!decimal.test(MinWidth)) {                                     //PaperAreaFirst
            alert("Please Enter Minimum Width Of Paper, Can Be Run On Machine");
            document.getElementById("TxtMinimumWidth").focus();
            document.getElementById("ValStrTxtMinimumWidth").style.fontSize = "10px";
            document.getElementById("ValStrTxtMinimumWidth").style.display = "block";
            document.getElementById("ValStrTxtMinimumWidth").innerHTML = 'This field should not be empty..Min.W';
            return false;
        }
        else {
            document.getElementById("ValStrTxtMinimumWidth").style.display = "none";
        }
        if (!decimal.test(MinLength)) {
            alert("Please Enter Minimum Length Of Paper, Can Be Run On Machine");
            document.getElementById("TxtMinimumLength").focus();
            document.getElementById("ValStrTxtMinimumLength").style.fontSize = "10px";
            document.getElementById("ValStrTxtMinimumLength").style.display = "block";
            document.getElementById("ValStrTxtMinimumLength").innerHTML = 'This field should not be empty..Min.L';
            return false;
        }
        else {
            document.getElementById("ValStrTxtMinimumLength").style.display = "none";
        }
        if (!decimal.test(MaxWidth)) {
            alert("Please Enter maximum Width Of Paper, Can Be Run On Machine");
            document.getElementById("TxtMaximumWidthh").focus();
            document.getElementById("ValStrTxtMaximumWidthh").style.fontSize = "10px";
            document.getElementById("ValStrTxtMaximumWidthh").style.display = "block";
            document.getElementById("ValStrTxtMaximumWidthh").innerHTML = 'This field should not be empty..Max.W';
            return false;
        }
        else {
            document.getElementById("ValStrTxtMaximumWidthh").style.display = "none";
        }
        if (!decimal.test(MaxLength)) {
            alert("Please Enter maximum Length Of Paper, Can Be Run On Machine");
            document.getElementById("TxtMaximumLength").focus();
            document.getElementById("ValStrTxtMaximumLength").style.fontSize = "10px";
            document.getElementById("ValStrTxtMaximumLength").style.display = "block";
            document.getElementById("ValStrTxtMaximumLength").innerHTML = 'This field should not be empty..Max.L';
            return false;
        }
        else {
            document.getElementById("ValStrTxtMaximumLength").style.display = "none";
        }



    }

    var jsonObjectsPrintUp = [];
    var OperationPrintUp = {};

    OperationPrintUp.MachineName = MachineName;
    OperationPrintUp.DepartmentID = UnderDepartment;
    if (UnderDepartment === 100) {
        OperationPrintUp.MachineType = MachineType;
        OperationPrintUp.MinimumSheet = MinimumSheet;
        OperationPrintUp.Colors = Colors;
        OperationPrintUp.WastageType = WastageType;
        OperationPrintUp.ChargesType = ChargesType;
        OperationPrintUp.WastageCalculationOn = WastageCalculationOn;
        OperationPrintUp.BasicPrintingCharges = BasicPrintingCharges;
        OperationPrintUp.RoundofImpressionsWith = RoundofImpressionsWith;
    }

    OperationPrintUp.Gripper = Gripper;

    OperationPrintUp.MakeReadyCharges = MakeReadyCharges;
    OperationPrintUp.MakeReadyWastageSheet = MakeReadyWastageSheet;
    OperationPrintUp.MakeReadyTime = MakeReadyTime;

    OperationPrintUp.ElectricConsumption = ElectricConsumption;
    OperationPrintUp.MachineSpeed = MachineSpeed;
    OperationPrintUp.PrintingMargin = PrintingMargin;
    OperationPrintUp.IsPerfectaMachine = IsPerfectaMachine;
    /// Special Case for F&B
    OperationPrintUp.IsSpecialMachine = IsSpecialMachine;
    ///Added by pKp for Planning Machine flag
    OperationPrintUp.IsPlanningMachine = IsPlanningMachine;
    if (IsPlanningMachine === 1 || IsPlanningMachine === true || UnderDepartment === 100) {
        OperationPrintUp.MaxPrintL = MaxLength;
        OperationPrintUp.MaxPrintW = MaxWidth;
        OperationPrintUp.MinPrintL = MinLength;
        OperationPrintUp.MinPrintW = MinWidth;
    }
    ////
    OperationPrintUp.JobChangeOverTime = JobChangeOverTime;

    OperationPrintUp.PerHourCost = PerHourCost;
    OperationPrintUp.PlateLength = PlateLength;
    OperationPrintUp.PlateWidth = PlateWidth;

    OperationPrintUp.MaxLength = MaxLength;
    OperationPrintUp.MaxWidth = MaxWidth;
    OperationPrintUp.MinLength = MinLength;
    OperationPrintUp.MinWidth = MinWidth;

    if (MachineType === ReelToSheetCutting) {
        OperationPrintUp.WebCutOffSize = ReelCutOffSizeCUT;
        OperationPrintUp.WebCutOffSizeMin = WebCutOffSizeMinCUT;
        OperationPrintUp.MaxReelSize = MaxReelSizeCUT;
        OperationPrintUp.MinReelSize = MinReelSizeCUT;
    }
    else {
        OperationPrintUp.WebCutOffSize = WebCutOffSize;
        OperationPrintUp.MaxReelSize = MaxReelSize;
        OperationPrintUp.MinReelSize = MinReelSize;
    }
    OperationPrintUp.VendorID = SelectBoxVendorID;

    jsonObjectsPrintUp.push(OperationPrintUp);
    var CostingMachineData = JSON.stringify(jsonObjectsPrintUp);

    var PrintingRateSetting = $('#MachineGridSlab').dxDataGrid('instance');
    var ObjPrintingRateSetting = [];
    var PrintingRate = {};

    for (var i = 0; i < PrintingRateSetting._options.dataSource.length; i++) {
        PrintingRate = {};
        PrintingRate.PaperGroup = PrintingRateSetting._options.dataSource[i].PaperGroup;
        PrintingRate.MaxPlanW = Number(PrintingRateSetting._options.dataSource[i].SizeW);
        PrintingRate.MaxPlanL = Number(PrintingRateSetting._options.dataSource[i].SizeL);

        PrintingRate.SheetRangeFrom = Number(PrintingRateSetting._options.dataSource[i].SheetRangeFrom);
        PrintingRate.SheetRangeTo = Number(PrintingRateSetting._options.dataSource[i].SheetRangeTo);
        PrintingRate.Rate = parseFloat(PrintingRateSetting._options.dataSource[i].Rate).toFixed(3);
        PrintingRate.PlateCharges = parseFloat(PrintingRateSetting._options.dataSource[i].PlateCharges).toFixed(2);
        PrintingRate.MinCharges = Number(PrintingRateSetting._options.dataSource[i].MinCharges);
        PrintingRate.PSPlateCharges = Number(PrintingRateSetting._options.dataSource[i].PSPlateCharges);
        PrintingRate.CTCPPlateCharges = Number(PrintingRateSetting._options.dataSource[i].CTCPPlateCharges);
        PrintingRate.Wastage = Number(PrintingRateSetting._options.dataSource[i].Wastage);
        PrintingRate.SpecialColorFrontCharges = parseFloat(PrintingRateSetting._options.dataSource[i].SpecialColorFrontCharges).toFixed(2);
        PrintingRate.SpecialColorBackCharges = parseFloat(PrintingRateSetting._options.dataSource[i].SpecialColorBackCharges).toFixed(2);
        PrintingRate.SlabID = i;
        ObjPrintingRateSetting.push(PrintingRate);
    }
    var ObjMachineSlab = JSON.stringify(ObjPrintingRateSetting);

    var CoatingGridSlab = $('#MachineGridCoatingSlabs').dxDataGrid('instance');
    var SlabGridRow = CoatingGridSlab._options.dataSource.length;
    var CostingDataSlab = [];
    var CostingData = {};

    for (var k = 0; k < SlabGridRow; k++) {
        CostingData = {};
        CostingData.SheetRangeFrom = Number(CoatingGridSlab._options.dataSource[k].SheetRangeFrom);
        CostingData.SheetRangeTo = Number(CoatingGridSlab._options.dataSource[k].SheetRangeTo);
        CostingData.CoatingName = CoatingGridSlab._options.dataSource[k].CoatingName;
        CostingData.Rate = parseFloat(CoatingGridSlab._options.dataSource[k].Rate).toFixed(3);
        CostingData.BasicCoatingCharges = Number(CoatingGridSlab._options.dataSource[k].BasicCoatingCharges);
        CostingData.RateType = CoatingGridSlab._options.dataSource[k].RateType;

        CostingDataSlab.push(CostingData);
    }

    var txt = 'If you confident please click on \n' + 'Yes, Save it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue?",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save it !",
        closeOnConfirm: false
    },
        function () {
            document.getElementById("LOADER").style.display = "block";

            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_MachineMaster.asmx/UpdatMachineMasterData",
                    data: '{CostingMachineData:' + CostingMachineData + ',ObjMachineSlab:' + ObjMachineSlab + ',Machineid:' + JSON.stringify(document.getElementById("Machineid").value.trim()) + ',CoatingRates:' + JSON.stringify(CostingDataSlab) + '}',
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
                            swal("Updated!", "Your data Updated", "success");
                            location.reload();
                        }
                        else {
                            swal("Not Updated!", res, "");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });
            } else {

                $.ajax({
                    type: "POST",
                    url: "WebService_MachineMaster.asmx/SaveMachineMasterData",
                    data: '{CostingMachineData:' + CostingMachineData + ',ObjMachineSlab:' + ObjMachineSlab + ',MachineName:' + JSON.stringify(document.getElementById("MachineName").value.trim()) + ',CoatingRates:' + JSON.stringify(CostingDataSlab) + '}',
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
                            location.reload();
                        }
                        else {
                            swal("Not Saved!", res, "");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                        alert(jqXHR);
                    }
                });
            }
        });
}

function blankBoxControll() {
    document.getElementById("TxtMinimumWidth").value = "";
    document.getElementById("TxtMinimumLength").value = "";
    document.getElementById("TxtMaximumWidthh").value = "";
    document.getElementById("TxtMaximumLength").value = "";
    document.getElementById("TxtReelSizeMaxcutting").value = "";
    document.getElementById("TxtReelSizeMincutting").value = "";
    document.getElementById("TxtReelSizeCutofmaxcutting").value = "";
    document.getElementById("TxtReelSizeCutofMincutting").value = "";
    document.getElementById("TxtReelSizeMax").value = "";
    document.getElementById("TxtReelSizeMin").value = "";
    document.getElementById("TxtReelSizeCutOff").value = "";
    document.getElementById("TxtPlateSizeWidth").value = "";
    document.getElementById("TxtPlateSizeLength").value = "";
}

$("#SelectBoxWastagetype").dxSelectBox({
    items: ["Sheets", "Percentage"],
    placeholder: "Select Wastage Type",
    showClearButton: true,
    onValueChanged: function (data) {
        WastageTypeChange = data.value;
        WastageTypeChange = "Wastage (" + WastageTypeChange + ")";
        Slabgrid();
    }
});

function Slabgrid() {
    $("#MachineGridSlab").dxDataGrid({
        dataSource: existslab,
        showBorders: true,
        paging: {
            enabled: false
        },
        showRowLines: true,
        sorting: {
            mode: "none"
        },
        filterRow: { visible: true, applyFilter: "auto" },
        editing: {
            mode: "cell",
            allowDeleting: true,
            allowAdding: true,
            allowUpdating: true
        },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            {
                dataField: "PaperGroup", visible: true, caption: "Paper Group", width: 200,
                validationRules: [{ type: "required" }, {
                    type: "required",
                    message: 'Paper Group is Required'
                }]
            },
            {
                dataField: "SizeW", visible: true, caption: "Size W", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SizeL", visible: true, caption: "Size L", width: 80,
                validationRules: [{
                    type: "required"
                }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeFrom", visible: true, caption: "Sheet From", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeTo", visible: true, caption: "Sheet To", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "MinCharges", visible: true, caption: "Min Charges", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Rate", visible: true, caption: "Rate", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric OR decimal value..!'
                }]
            },
            {
                dataField: "PlateCharges", visible: true, caption: "CTP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "PSPlateCharges", visible: true, caption: "PS", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "CTCPPlateCharges", visible: true, caption: "CTCP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Wastage", visible: true, caption: WastageTypeChange, width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorFrontCharges", visible: true, caption: "SP.Color F", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorBackCharges", visible: true, caption: "SP.Color B", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            }
        ]
    });
}

//Add New Code 15 May 2019
$("#SelectBoxRateType").dxSelectBox({
    items: ["Rate/Sq.Inch/Sheet", "Rate/Sq.Inch/Sheet Both Side", "Rate/100 Sq.Inch/Sheet", "Rate/100 Sq.Inch/Sheet Both Side", "Impressions/1000"],
    placeholder: "Select RateType",
    showClearButton: true
});

$.ajax({
    type: 'POST',
    url: 'WebService_MachineMaster.asmx/GetCoatingName',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: {},
    crossDomain: true,
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"CoatingName":"/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.replace(/u0026/g, "&");
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -3);
        var CoatingName = [];
        var CotName = res.split(",");
        for (var CN in CotName) {
            CoatingName.push(CotName[CN]);
        }

        $("#SelectBoxCoatingName").dxSelectBox({
            items: CotName,
            searchEnabled: true,
            showClearButton: true,
            acceptCustomValue: true
        });
    },
    error: function errorFunc(jqXHR) {
    }
});

var MaxNo = 0;
$("#btnAddColumn").click(function () {
    var SelectBoxCoatingName = $("#SelectBoxCoatingName").dxSelectBox("instance").option('value');
    var txtSheetFrom = document.getElementById("txtSheetFrom").value.trim();
    var txtSheetTo = document.getElementById("txtSheetTo").value.trim();
    var txtRate = document.getElementById("txtRate").value.trim();
    var txtMinCharg = document.getElementById("txtMinCharg").value.trim();
    var SelectBoxRateType = $("#SelectBoxRateType").dxSelectBox("instance").option('value');
    var alertTag = "";

    if (SelectBoxCoatingName === "" || SelectBoxCoatingName === undefined || SelectBoxCoatingName === null) {
        alert("Please select OR enter.. Coating Name");
        alertTag = "ValStrSelectBoxCoatingName";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Coating Name';

        return false;
    }
    else {
        alertTag = "ValStrSelectBoxCoatingName";
        document.getElementById(alertTag).style.display = "none";
    }

    if (txtSheetFrom === "" || txtSheetFrom === undefined || txtSheetFrom === null) {
        alert("This field should not be empty.. Sheet From");
        alertTag = "ValStrtxtSheetFrom";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Sheet From';

        return false;
    }
    else {
        alertTag = "ValStrtxtSheetFrom";
        document.getElementById(alertTag).style.display = "none";
    }

    if (txtSheetTo === "" || txtSheetTo === undefined || txtSheetTo === null) {
        alert("This field should not be empty.. Sheet To");
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Sheet To';

        return false;
    }
    else {
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtRate === "" || txtRate === undefined || txtRate === null) {
        alert("This field should not be empty.. Rate");
        alertTag = "ValStrtxtRate";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Rate';

        return false;
    }
    else {
        alertTag = "ValStrtxtRate";
        document.getElementById(alertTag).style.display = "none";
    }
    if (txtMinCharg === "" || txtMinCharg === undefined || txtMinCharg === null) {
        alert("This field should not be empty.. Rate");
        alertTag = "ValStrtxtMinCharg";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Minimum Charges';

        return false;
    }
    else {
        alertTag = "ValStrtxtMinCharg";
        document.getElementById(alertTag).style.display = "none";
    }
    if (SelectBoxRateType === "" || SelectBoxRateType === undefined || SelectBoxRateType === null) {
        alert("Please select OR enter.. Rate Type");
        alertTag = "ValStrSelectBoxRateType";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Rate Type';

        return false;
    }
    else {
        alertTag = "ValStrSelectBoxRateType";
        document.getElementById(alertTag).style.display = "none";
    }

    if (Number(txtSheetTo) < Number(txtSheetFrom)) {
        alert("'Sheet To' should be greater then 'Sheet From'");
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = "'Sheet To' should be greater then 'Sheet From'";
        return false;
    }
    else {
        alertTag = "ValStrtxtSheetTo";
        document.getElementById(alertTag).style.display = "none";
    }

    var MachineGridCoatingSlabsRow = MachineGridCoatingSlabs.totalCount();

    if (MachineGridCoatingSlabsRow > 0) {
        for (var h = 0; h < MachineGridCoatingSlabsRow; h++) {
            if (MachineGridCoatingSlabs._options.dataSource[h].CoatingName.toLowerCase() === SelectBoxCoatingName.toLowerCase() && MachineGridCoatingSlabs._options.dataSource[h].SheetRangeFrom === txtSheetFrom && MachineGridCoatingSlabs._options.dataSource[h].RateType.toLowerCase() === SelectBoxRateType.toLowerCase()) {
                DevExpress.ui.notify("This 'Coating Name,Sheet From And Rate Type' already exist,Please enter another..!", "warning", 1500);
                return false;
            }
        }

        CoatingSlabs = [];
        MaxNo = 0;
        var optExistData = {};
        var optCoteGrid = {};
        for (var t = 0; t <= MachineGridCoatingSlabsRow; t++) {
            if (t === Number(MachineGridCoatingSlabsRow)) {
                optCoteGrid = {};
                MaxNo = Number(MaxNo) + 1;
                optCoteGrid.CoteID = MaxNo;
                optCoteGrid.CoatingName = SelectBoxCoatingName;
                optCoteGrid.SheetRangeFrom = txtSheetFrom;
                optCoteGrid.SheetRangeTo = txtSheetTo;
                optCoteGrid.RateType = SelectBoxRateType;
                optCoteGrid.Rate = txtRate;
                optCoteGrid.BasicCoatingCharges = txtMinCharg;
                CoatingSlabs.push(optCoteGrid);
            }
            else {
                optExistData = {};
                MaxNo = Number(MaxNo) + 1;
                optExistData.CoteID = MaxNo;
                optExistData.CoatingName = MachineGridCoatingSlabs._options.dataSource[t].CoatingName;
                optExistData.SheetRangeFrom = MachineGridCoatingSlabs._options.dataSource[t].SheetRangeFrom;
                optExistData.SheetRangeTo = MachineGridCoatingSlabs._options.dataSource[t].SheetRangeTo;
                optExistData.RateType = MachineGridCoatingSlabs._options.dataSource[t].RateType;
                optExistData.Rate = MachineGridCoatingSlabs._options.dataSource[t].Rate;
                optExistData.BasicCoatingCharges = MachineGridCoatingSlabs._options.dataSource[t].BasicCoatingCharges;
                CoatingSlabs.push(optExistData);
            }
        }
    } else {
        CoatingSlabs = [];
        optCoteGrid = {};
        MaxNo = Number(MaxNo) + 1;
        optCoteGrid.CoteID = MaxNo;
        optCoteGrid.CoatingName = SelectBoxCoatingName;
        optCoteGrid.SheetRangeFrom = txtSheetFrom;
        optCoteGrid.SheetRangeTo = txtSheetTo;
        optCoteGrid.RateType = SelectBoxRateType;
        optCoteGrid.Rate = txtRate;
        optCoteGrid.BasicCoatingCharges = txtMinCharg;
        CoatingSlabs.push(optCoteGrid);
    }

    $("#MachineGridCoatingSlabs").dxDataGrid({
        dataSource: CoatingSlabs
    });
});

function newEntry() {
    existslab = [];
    $("#MachineGridSlab").dxDataGrid({ dataSource: existslab });

    GblStatus = "Save";
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("MachineGetGridRow").value = "";
    document.getElementById("Machineid").value = "";

    document.getElementById("TxtMinimumWidth").value = "";
    document.getElementById("TxtMinimumLength").value = "";
    document.getElementById("TxtMaximumWidthh").value = "";
    document.getElementById("TxtMaximumLength").value = "";
    document.getElementById("TxtReelSizeMaxcutting").value = "";
    document.getElementById("TxtReelSizeMincutting").value = "";
    document.getElementById("TxtReelSizeCutofmaxcutting").value = "";
    document.getElementById("TxtReelSizeCutofMincutting").value = "";
    document.getElementById("TxtReelSizeMax").value = "";
    document.getElementById("TxtReelSizeMin").value = "";
    document.getElementById("TxtReelSizeCutOff").value = "";
    document.getElementById("TxtPlateSizeWidth").value = "";
    document.getElementById("TxtPlateSizeLength").value = "";

    document.getElementById("MachineName").value = "";
    document.getElementById("Griper").value = "";
    document.getElementById("PrintingMargin").value = "";
    document.getElementById("Colors").value = "";
    document.getElementById("MakeReadyCharges").value = "";
    document.getElementById("MakeReadyWastageSheet").value = "";
    document.getElementById("TxtMakeReadyTime").value = "";
    document.getElementById("TxtJobChargeOverTime").value = "";
    document.getElementById("TxtImpressionsperMinute").value = "";
    document.getElementById("TxtElectricCon").value = "";

    document.getElementById("TxtCostPerHour").value = "";

    document.getElementById("TxtMiniPrinting").value = "";
    document.getElementById("TxtBasicPrintingCharged").value = "";
    document.getElementById("TxtRoundofImpressionsWith").value = "";
    document.getElementById("IsPerFectAMachine").checked = false;
    document.getElementById("IsSpecialMachine").checked = false;

    var aa = null;
    $("#UnderDepartment").dxSelectBox({ value: aa });
    $("#SelectBoxMachineType").dxSelectBox({ value: aa });
    $("#SelectBoxVendor").dxSelectBox({ value: aa });
    $("#SelectBoxTypeOfCharges").dxSelectBox({ value: aa });
    $("#SelectBoxWastagetype").dxSelectBox({ value: aa });
    $("#SelectBoxWastageCalculationOn").dxSelectBox({ value: aa });
}


//////////////////////////////////////////////////////////////////Get ItemSubGroupAllocation////////////////////////////////////////

var SuppObjid = [];
var GroupAlloGrid = "";

$("#ItemSubGroupAlloButton").click(function () {
    document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = true;
    document.getElementById("LOADER").style.display = "block";

    GblGroupAllocation();

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/MachineName",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            var MN = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            $("#SelMachineName").dxSelectBox({
                items: MN,
                placeholder: "Select..",
                displayExpr: 'MachineName',
                valueExpr: 'MachineID',
                searchEnabled: true,
                showClearButton: true,
                onValueChanged: function (data) {
                    SuppObjid = [];

                    document.getElementById("LOADER").style.display = "block";
                    $.ajax({
                        type: "POST",
                        url: "WebService_MachineMaster.asmx/ExistGroupID",
                        data: '{MachineID:' + JSON.stringify(data.value) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.replace(/u0026/g, "&");
                            res = res.replace(/u0027/g, "'");
                            res = res.replace(/"/g, '');
                            res = res.replace(/GroupAllocationIDs:/g, '');
                            res = res.substr(3);
                            res = res.slice(0, -3);

                            document.getElementById("LOADER").style.display = "none";
                            var IDString = res;

                            if (IDString === "" || IDString === null || IDString === undefined) {
                                document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = true;
                                SuppObjid = [];
                                GblGroupAllocation();
                            }
                            else {
                                document.getElementById("ItemGroupAllocationBtnDeletePopUp").disabled = false;
                                var selectMIDSplit = IDString.split(',');
                                for (var s in selectMIDSplit) {
                                    SuppObjid.push(selectMIDSplit[s]);
                                }
                                GblGroupAllocation();
                            }
                        }
                    });
                }
            });
        }
    });

    document.getElementById("ItemSubGroupAlloButton").setAttribute("data-toggle", "modal");
    document.getElementById("ItemSubGroupAlloButton").setAttribute("data-target", "#ItemSubGroupAllocation");
});


function GblGroupAllocation() {

    $.ajax({
        type: "POST",
        url: "WebService_MachineMaster.asmx/GroupGrid",
        data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            // document.getElementById("LOADER").style.display = "none";
            GroupAlloGrid = JSON.parse(res);
            GroupAllocationGrid();
        }
    });
}

function GroupAllocationGrid() {

    $("#GridItemGoupAllocation").dxDataGrid({
        // dataSource: GroupAlloGrid,
        dataSource: {
            store: {
                type: "array",
                key: "ItemSubGroupID",
                data: GroupAlloGrid
            }
        },
        sorting: {
            mode: "multiple"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "multiple" },
        filterRow: { visible: true, applyFilter: "auto" },
        ////height: 600,
        //paging: {
        //    pageSize: 15
        //},
        //pager: {
        //    showPageSizeSelector: true,
        //    allowedPageSizes: [15, 25, 50, 100]
        //},
        // scrolling: { mode: 'virtual' },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 300 },
            { dataField: "ItemSubGroupName", visible: true, caption: "Item Sub Group Name" }
        ],
        selectedRowKeys: SuppObjid,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;

            if (data.length > 0) {
                $("#TxtItemGroupNameID").text(
                    $.map(data, function (value) {
                        return value.ItemSubGroupID;    //alert(value.ProcessId);
                    }).join(','));
            }
            else {
                $("#TxtItemGroupNameID").text("");
            }
        }
    });
}

$("#ItemGroupAllocationBtnSave").click(function () {
    var GridRow = "";
    var alertTag = "";
    var MachineID = $("#SelMachineName").dxSelectBox("instance").option('value');
    if (MachineID === "" || MachineID <= 0 || MachineID === null) {
        alert("Please select Machine Name..");
        alertTag = "ValStrSelMachineName";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Machine Name';

        return false;
    }
    else {
        alertTag = "ValStrSelMachineName";
        document.getElementById(alertTag).style.display = "none";
    }

    var jsonObjectsGroupAllocationDetailRecord = [];
    var OperationGroupAllocationDetailRecord = {};

    var CostingDataGroupAllocation = [];

    var txtMID = $("#TxtItemGroupNameID").text();

    if (txtMID === "null") {
        GridRow = JSON.stringify(SuppObjid);
        GridRow = GridRow.replace(/"/g, '');
        GridRow = GridRow.substr(1);
        GridRow = GridRow.slice(0, -1);
    }
    else if (txtMID === "" || txtMID === null || txtMID === undefined) {
        GridRow = "";
    }
    else {
        GridRow = txtMID;
    }

    var finalString = GridRow;

    if (GridRow !== "") {
        GridRow = GridRow.split(',');

        if (GridRow.length > 0) {
            for (var m = 0; m < GridRow.length; m++) {
                OperationGroupAllocationDetailRecord = {};

                OperationGroupAllocationDetailRecord.MachineID = MachineID;
                OperationGroupAllocationDetailRecord.ItemSubGroupID = GridRow[m];

                jsonObjectsGroupAllocationDetailRecord.push(OperationGroupAllocationDetailRecord);
            }

            CostingDataGroupAllocation = jsonObjectsGroupAllocationDetailRecord;
        }
    }
    else {
        CostingDataGroupAllocation = CostingDataGroupAllocation;
    }
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

            $.ajax({
                type: "POST",
                url: "WebService_MachineMaster.asmx/SaveGroupAllocation",
                data: '{CostingDataGroupAllocation:' + JSON.stringify(CostingDataGroupAllocation) + ',MachineID:' + JSON.stringify(MachineID) + ',GridRow:' + JSON.stringify(finalString) + '}',//
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
                    } else {
                        swal("Not Saved!", res, "");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });

});//Tommorow

$("#ItemGroupAllocationBtnNew").click(function () {
    $("#SelMachineName").dxSelectBox({
        value: ''
    });
    SuppObjid = [];
    GblGroupAllocation();
});//Tommorow

$("#ItemGroupAllocationBtnDeletePopUp").click(function () {

    var SelMachineName = $("#SelMachineName").dxSelectBox("instance").option('value');
    var alertTag = "";
    if (SelMachineName === "" || SelMachineName === undefined || SelMachineName === null) {
        alert("Please select Machine Name..");
        alertTag = "ValStrSelMachineName";
        document.getElementById(alertTag).style.fontSize = "10px";
        document.getElementById(alertTag).style.display = "block";
        document.getElementById(alertTag).innerHTML = 'This field should not be empty..Machine Name';

        return false;
    }
    else {
        alertTag = "ValStrSelMachineName";
        document.getElementById(alertTag).style.display = "none";
    }

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
                url: "WebService_MachineMaster.asmx/DeleteGroupAllo",
                data: '{MachineID:' + JSON.stringify(SelMachineName) + '}',
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
                        swal("Deleted!", "Your data Deleted", "success");
                        location.reload();
                    } else {
                        swal("Not Deleted!", res, "");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    alert(jqXHR);
                }
            });

        });
});//Tommorow

$(".sizeFields").keypress(function (e) {
    if (e.which === 34) { // For "  (Double Code)
        Convert_Value(event);
    } else if (e.which === 39) { // For '  (Single Code)
        Convert_Value(event);
    }
});

$(".convertsize").hover(function (e) {
    if (Number(e.target.value) !== "") {
        e.target.title = Number(e.target.value / 25.4).toFixed(2) + " Inch" + "\n" + Number(e.target.value / 10).toFixed(2) + " cm";
    }
});
