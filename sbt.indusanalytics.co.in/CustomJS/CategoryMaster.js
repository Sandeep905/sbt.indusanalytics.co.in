"use strict";

var sizeCons = ["2D", "3D", "BOOK"], processgrid = [], Objid = [];
var GblStatus = "";

$("#SelectBoxOrientation").dxSelectBox({
    items: sizeCons,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
    //acceptCustomValue: true,
});

GblProcessMaster();
function GblProcessMaster() {
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/ProcessGrid",
        data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            processgrid = [];
            processgrid = JSON.parse(res);

            AllocationProcessGrid();
        }
    });
}

function AllocationProcessGrid() {
    $("#GridProcessAllocation").dxDataGrid({
        // dataSource: MachiGrid,
        dataSource: {
            store: {
                type: "array",
                key: "ProcessID",
                data: processgrid
            }
        },
        sorting: {
            mode: "none"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "multiple", showCheckBoxesMode: "always" },
        height: function () {
            return window.innerHeight / 1.3;
        },
        filterRow: {
            visible: true, applyFilter: "auto"
        },
        scrolling: {
            mode: 'virtual'
        },
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
            { dataField: "ProcessID", visible: false, caption: "ProcessID", width: 300 },
            { dataField: "ProcessName", visible: true, caption: "Process Name" },
            { dataField: "TypeofCharges", visible: true, caption: "TypeofCharges" }
        ],
        selectedRowKeys: Objid,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            if (data.length > 0) {
                $("#ProcessId").text(
                    $.map(data, function (value) {
                        return value.ProcessID;    //alert(value.ProcessId);
                    }).join(','));
            }
            else {
                $("#ProcessId").text("");
            }
        }
    });
}

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/GetCategory",
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
            document.getElementById("LOADER").style.display = "none";
            $("#CategoryGrid").dxDataGrid({
                dataSource: RES1,
                columnAutoWidth: true,
                showBorders: true,
                showRowLines: true,
                allowColumnReordering: true,
                //allowColumnResizing: true,
                paging: {
                    pageSize: 15
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [15, 25, 50, 100]
                },
                //sorting: {
                //    mode: "multiple"
                //},
                selection: {
                    mode: "single"
                },
                grouping: {
                    autoExpandAll: true
                },
                //height: 600,
                // scrolling: { mode: 'virtual' },
                filterRow: {
                    visible: true, applyFilter: "auto"
                },
                columnChooser: {
                    enabled: true
                },
                headerFilter: {
                    visible: true
                },
                //rowAlternationEnabled: true,
                searchPanel: {
                    visible: true
                },
                loadPanel: {
                    enabled: true,
                    height: 90,
                    width: 200,
                    text: 'Data is loading...'
                },
                export: {
                    enabled: true,
                    fileName: "Category master",
                    allowExportSelectedData: true
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                onCellClick: function (e) {
                    var grid = $('#CategoryGrid').dxDataGrid('instance');
                    if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
                    var Row = e.row.rowIndex;
                    var Col = e.columnIndex;

                    document.getElementById("TxtCategoryID").value = "";
                    document.getElementById("TxtCategoryID").value = e.row.data.CategoryID;

                    if (e.row.data.CategoryID === "") {
                        document.getElementById("BtnDeletePopUp").disabled = true;
                        document.getElementById("BtnSave").disabled = true;
                        document.getElementById("BtnSaveAS").disabled = true;

                    }
                    else {
                        document.getElementById("BtnDeletePopUp").disabled = false;
                        document.getElementById("BtnSave").disabled = false;
                        document.getElementById("BtnSaveAS").disabled = false;
                    }

                },

                columns: [
                    {
                        dataField: "CategoryID", visible: false, caption: "CategoryID"
                    },
                    {
                        dataField: "CategoryName", visible: true, caption: "Category Name"
                    },
                    { dataField: "Orientation", visible: true, caption: "Orientation" }
                ]

            });
        }
    });
}

//Creation of Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();
    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {
    var TxtCategoryID = document.getElementById("TxtCategoryID").value;
    if (TxtCategoryID === "" || TxtCategoryID === null || TxtCategoryID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    GblStatus = "Update";
    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab

    var CategoryGrid = $('#CategoryGrid').dxDataGrid('instance');
    var selectedCategoryRows = CategoryGrid.getSelectedRowsData();

    document.getElementById("CategoryName").value = selectedCategoryRows[0].CategoryName;

    $("#SelectBoxOrientation").dxSelectBox({
        value: selectedCategoryRows[0].Orientation
    });

    Objid = [];
    var selectMID = selectedCategoryRows[0].ProcessIDString;//ProcessMasterGrid.cellValue(txtGetGridRow, 14);

    if (selectMID === "" || selectMID === null || selectMID === undefined || selectMID === "null") {
        Objid = [];
    }
    else {
        var selectMIDSplit = selectMID.split(',');
        for (var s in selectMIDSplit) {
            Objid.push(selectMIDSplit[s]);
        }
    }

    ///////// Contents Allocation Id Strings ////////////////
    var IDString = selectedCategoryRows[0].ContentsIDString;
    if (IDString === "" || IDString === null || IDString === undefined) {
        ObjidContent = [];
    }
    else {
        var selectMIDSplitElse = IDString.split(',');
        for (var sp in selectMIDSplitElse) {
            ObjidContent.push(selectMIDSplitElse[sp]);
        }
    }
    //////////////////

    AllocationProcessGrid();
    ContentGridGrid();

    if (selectedCategoryRows[0].CategoryName === "" && selectedCategoryRows[0].Orientation === "") {
        document.getElementById("BtnDeletePopUp").disabled = true;
        document.getElementById("BtnSave").disabled = true;
        document.getElementById("BtnSaveAS").disabled = true;
    }
    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

});

$("#BtnSave").click(function () {
    SaveBtnFun();
});

$("#DeleteButton").click(function () {
    var TxtCategoryID = document.getElementById("TxtCategoryID").value;
    if (TxtCategoryID === "" || TxtCategoryID === null || TxtCategoryID === undefined) {
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
                url: "WebService_OtherMaster.asmx/DeleteCategoryMasterData",
                data: '{TxtCategoryID:' + JSON.stringify(TxtCategoryID) + '}',
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
});

$("#BtnSaveAS").click(function () {
    GblStatus = "";
    SaveBtnFun();
});

function SaveBtnFun() {
    var SelectBoxOrientation = $('#SelectBoxOrientation').dxSelectBox('instance').option('value');
    var CategoryName = document.getElementById("CategoryName").value.trim();

    if (CategoryName === "") {
        alert("Please Enter Category Name");
        document.getElementById("CategoryName").focus();
        document.getElementById("ValStrCategoryName").style.fontSize = "10px";
        document.getElementById("ValStrCategoryName").style.display = "block";
        document.getElementById("ValStrCategoryName").innerHTML = 'This field should not be empty..Category Name';
        return false;
    }
    else {
        document.getElementById("ValStrCategoryName").style.display = "none";
    }

    if (SelectBoxOrientation === null || SelectBoxOrientation === "") {
        alert("Please select..Orientation");
        document.getElementById("ValStrSelectBoxOrientation").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxOrientation").style.display = "block";
        document.getElementById("ValStrSelectBoxOrientation").innerHTML = 'This field should not be empty..Orientation';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxOrientation").style.display = "none";
    }


    //Content Grid
    var jsonObjectsContentAllocationDetailRecord = [];
    var OperationContentAllocationDetailRecord = {};
    var CostingDataContentAllocation = [];
    //Process Grid
    var jsonObjectsProcessAllocationDetailRecord = [];
    var OperationProcessAllocationDetailRecord = {};
    var CostingDataProcessAllocation = [];

    //Contents string
    var txtCID = $("#ContentId").text();
    var GridRowContent = "";

    if (txtCID === "null") {
        GridRowContent = JSON.stringify(ObjidContent);
        if (GridRowContent === [] || GridRowContent === "[]") {
            GridRowContent = "";
        }
        else {
            GridRowContent = GridRowContent.replace(/"/g, '');
            GridRowContent = GridRowContent.substr(1);
            GridRowContent = GridRowContent.slice(0, -1);
        }
    }
    else if (txtCID === "" || txtCID === null || txtCID === undefined) {
        GridRowContent = "";
    }
    else {
        GridRowContent = txtCID;
    }

    /// process string
    var GridRow = "";
    var txtMID = $("#ProcessId").text();
    if (txtMID === "null") {
        GridRow = JSON.stringify(Objid);
        if (GridRow === [] || GridRow === "[]") {
            GridRow = "";
        }
        else {
            GridRow = GridRowContent.replace(/"/g, '');
            GridRow = GridRowContent.substr(1);
            GridRow = GridRowContent.slice(0, -1);
        }
    }
    else if (txtMID === "" || txtMID === null || txtMID === undefined) {
        GridRow = "";
    }
    else {
        GridRow = txtMID;
    }
    //////

    var SplitGridRow = GridRow.split(',');
    if (GridRowContent !== "") {
        var SplitGridRowContent = GridRowContent.split(',');
        if (SplitGridRowContent.length > 0) {
            for (var cm = 0; cm < SplitGridRowContent.length; cm++) {
                OperationContentAllocationDetailRecord = {};
                OperationContentAllocationDetailRecord.ContentID = SplitGridRowContent[cm];

                jsonObjectsContentAllocationDetailRecord.push(OperationContentAllocationDetailRecord);

                if (SplitGridRow.length > 0) {
                    for (var m = 0; m < SplitGridRow.length; m++) {
                        OperationProcessAllocationDetailRecord = {};
                        OperationProcessAllocationDetailRecord.ProcessID = SplitGridRow[m];
                        OperationProcessAllocationDetailRecord.ContentID = SplitGridRowContent[cm];

                        jsonObjectsProcessAllocationDetailRecord.push(OperationProcessAllocationDetailRecord);
                    }
                }
            }
            CostingDataProcessAllocation = JSON.stringify(jsonObjectsProcessAllocationDetailRecord);
            CostingDataContentAllocation = JSON.stringify(jsonObjectsContentAllocationDetailRecord);
        }
    }
    else {
        CostingDataProcessAllocation = JSON.stringify(jsonObjectsProcessAllocationDetailRecord);
        CostingDataContentAllocation = JSON.stringify(CostingDataContentAllocation);
    }
    /////////   

    var jsonObjectsGroupMasterRecord = [];
    var OperationGroupMasterRecord = {};

    OperationGroupMasterRecord.CategoryName = CategoryName;
    OperationGroupMasterRecord.Orientation = SelectBoxOrientation;
    OperationGroupMasterRecord.ProcessIDString = GridRow;
    OperationGroupMasterRecord.ContentsIDString = GridRowContent;

    jsonObjectsGroupMasterRecord.push(OperationGroupMasterRecord);

    var CostingDataGroupMaster = JSON.stringify(jsonObjectsGroupMasterRecord);


    ////Process Allocation
    //if (GridRow !== "") {
    //    GridRow = GridRow.split(',');
    //    if (GridRow.length > 0) {
    //        for (m = 0; m < GridRow.length; m++) {
    //            OperationProcessAllocationDetailRecord = {};
    //            OperationProcessAllocationDetailRecord.ProcessID = GridRow[m];

    //            jsonObjectsProcessAllocationDetailRecord.push(OperationProcessAllocationDetailRecord);
    //        }
    //        CostingDataProcessAllocation = JSON.stringify(jsonObjectsProcessAllocationDetailRecord);
    //    }
    //}
    //else {
    //    CostingDataProcessAllocation = JSON.stringify(CostingDataProcessAllocation);
    //}

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
            if (GblStatus === "Update") {
                $.ajax({
                    type: "POST",
                    url: "WebService_OtherMaster.asmx/UpdatCategoryData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',TxtCategoryID:' + JSON.stringify(document.getElementById("TxtCategoryID").value.trim()) + ',CostingDataProcessAllocation:' + CostingDataProcessAllocation + ',CostingDataContentAllocation:' + CostingDataContentAllocation + '}',
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
                            swal("Saved!", "Your data Updated", "success");
                            location.reload();
                        }
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Group Name allready Exist..\n Please enter another Group Name..", "");
                        }

                    },
                    error: function errorFunc(jqXHR) {
                        document.getElementById("LOADER").style.display = "none";
                        swal("Error!", "Please try after some time..", "");
                    }
                });

            }
            else {

                $.ajax({
                    type: "POST",
                    url: "WebService_OtherMaster.asmx/SaveCategoryData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',CategoryName:' + JSON.stringify(document.getElementById("CategoryName").value.trim()) + ',SelectBoxOrientation:' + JSON.stringify($('#SelectBoxOrientation').dxSelectBox('instance').option('value')) + ',CostingDataProcessAllocation:' + CostingDataProcessAllocation + ',CostingDataContentAllocation:' + CostingDataContentAllocation + '}',
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
                        else if (res === "Exist") {
                            swal("Duplicate!", "This Group Name allready Exist..\n Please enter another Group Name..", "");
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

$("#BtnNew").click(function () {
    document.getElementById("CategoryName").value = "";
    $("#SelectBoxOrientation").dxSelectBox({
        value: ''
    });
    document.getElementById("TxtCategoryID").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    document.getElementById("BtnSaveAS").disabled = true;
    GblContent();
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});


/////=============Content Allocation=====================
var ContentGrid = "", ObjidContent = [];
GblContent();
function GblContent() {
    $.ajax({
        type: "POST",
        url: "WebServiceProcessMaster.asmx/ContentGrid",
        data: '{}',//UnderGroupID:' + JSON.stringify(UnderGroupID) + '
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            //console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027u0027/g, "''");
            res = res.substr(1);
            res = res.slice(0, -1);
            //$("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            ContentGrid = JSON.parse(res);
            ContentGridGrid();
        }
    });
}

function ContentGridGrid() {
    $("#GridContentAllocation").dxDataGrid({
        dataSource: {
            store: {
                type: "array",
                key: "ContentID",
                data: ContentGrid
            }
        },
        sorting: {
            mode: "multiple"
        },
        paging: false,
        showBorders: true,
        showRowLines: true,
        selection: { mode: "single" },
        filterRow: { visible: true, applyFilter: "auto" },
        height: function () {
            return window.innerHeight / 1.3;
        },
        scrolling: { mode: 'virtual' },
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
            { dataField: "ContentID", visible: false, caption: "ContentID", width: 300 },
            { dataField: "ContentName", visible: false, caption: "Content Name" },
            { dataField: "ContentCaption", visible: true, caption: "Content Name" }
        ],
        selectedRowKeys: ObjidContent,
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            if (data.length > 0) {
                $("#ContentId").text(
                    $.map(data, function (value) {
                        return value.ContentID;    //alert(value.ProcessId);
                    }).join(','));
                getContentWiseProcess($("#ContentId").text());
            }
            else {
                $("#ContentId").text("");
            }
        }
    });
}

function getContentWiseProcess(ContID) {
    var TxtCategoryID = Number(document.getElementById("TxtCategoryID").value);
    if (TxtCategoryID === "" || TxtCategoryID === null || TxtCategoryID === 0) {
        alert("Please choose category from below Grid..!");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/GetContentWiseProcess",
        data: '{ContID:' + ContID + ',CategoryID:' + TxtCategoryID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027u0027/g, "''");
            res = res.substr(1);
            res = res.slice(0, -1);
            Objid = [];
            var selectMIDSplitElse = JSON.parse(res);
            for (var sp in selectMIDSplitElse) {
                Objid.push(selectMIDSplitElse[sp].ProcessID);
            }
            $("#GridProcessAllocation").dxDataGrid({
                selectedRowKeys: Objid
            });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR);
        }
    });
}