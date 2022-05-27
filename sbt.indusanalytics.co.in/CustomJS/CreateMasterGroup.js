
var GblStatus = "";

$.ajax({
    type: "POST",
    url: "WebService_Master.asmx/GetUnderGroup",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelectBoxUnderGroup").dxSelectBox({
            items: RES1,
            placeholder: "Select..",
            displayExpr: 'ItemSubGroupDisplayName',
            valueExpr: 'ItemSubGroupID',
            searchEnabled: true,
            showClearButton: true
            //acceptCustomValue: true,
        });
    }
});

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_Master.asmx/GetGroup",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            //console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            $("#CreateGroupGrid").dxDataGrid({
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
                selection: { mode: "single" },
                grouping: {
                    autoExpandAll: true
                },
                //height: 600,
                // scrolling: { mode: 'virtual' },
                filterRow: { visible: true, applyFilter: "auto" },
                columnChooser: { enabled: true },
                headerFilter: { visible: true },
                //rowAlternationEnabled: true,
                searchPanel: { visible: true },
                loadPanel: {
                    enabled: true,
                    height: 90,
                    width: 200,
                    text: 'Data is loading...'
                },
                export: {
                    enabled: true,
                    fileName: "Group master",
                    allowExportSelectedData: true
                },
                onRowPrepared: function (e) {
                    if (e.rowType === "header") {
                        e.rowElement.css('background', '#42909A');
                        e.rowElement.css('color', 'white');
                    }
                    e.rowElement.css('fontSize', '11px');
                },

                onSelectionChanged: function (selectedItem) {
                    //if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;

                    document.getElementById("ItemSubGroupUniqueID").value = "";
                    document.getElementById("ItemSubGroupID").value = "";
                    document.getElementById("ItemSubGroupLevel").value = "";
                    document.getElementById("BtnDeletePopUp").disabled = false;
                    document.getElementById("BtnSave").disabled = false;
                    document.getElementById("BtnSaveAS").disabled = false;

                    document.getElementById("GroupName").disabled = false;
                    document.getElementById("DisplayName").disabled = false;
                    $("#SelectBoxUnderGroup").dxSelectBox({
                        disabled: false
                    });
                    if (selectedItem.selectedRowsData.length <= 0) return;
                    document.getElementById("ItemSubGroupUniqueID").value = selectedItem.selectedRowsData[0].ItemSubGroupUniqueID;
                    document.getElementById("ItemSubGroupID").value = selectedItem.selectedRowsData[0].ItemSubGroupID;
                    document.getElementById("ItemSubGroupLevel").value = selectedItem.selectedRowsData[0].ItemSubGroupLevel;

                    if (Number(selectedItem.selectedRowsData[0].ItemSubGroupID) <= 1) {
                        document.getElementById("BtnDeletePopUp").disabled = true;
                        document.getElementById("BtnSave").disabled = true;
                        document.getElementById("BtnSaveAS").disabled = true;

                        document.getElementById("GroupName").disabled = true;
                        document.getElementById("DisplayName").disabled = true;
                        $("#SelectBoxUnderGroup").dxSelectBox({
                            disabled: true
                        });
                    }
                },
                columns: [
                    { dataField: "ItemSubGroupDisplayName", visible: true, caption: "Group Name" },
                    { dataField: "GroupName", visible: true, caption: "Group Name", groupIndex: 0 },
                    { dataField: "ItemSubGroupUniqueID", visible: false, caption: "ItemSubGroupUniqueID", width: 120 },
                    { dataField: "ItemSubGroupID", visible: false, caption: "ItemSubGroupID", width: 120 },
                    { dataField: "UnderSubGroupID", visible: false, caption: "UnderSubGroupID", width: 120 },
                    { dataField: "ItemSubGroupName", visible: false, caption: "ItemSubGroupName", width: 120 },
                    { dataField: "ItemSubGroupLevel", visible: false, caption: "ItemSubGroupLevel", width: 120 }
                ]
            });
        }
    });
}

//Creation of Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {
    var ItemSubGroupUniqueID = document.getElementById("ItemSubGroupUniqueID").value;
    if (ItemSubGroupUniqueID === "" || ItemSubGroupUniqueID === null || ItemSubGroupUniqueID === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    GblStatus = "Update";

    var CreateGroupGrid = $('#CreateGroupGrid').dxDataGrid('instance');
    var selectedGroupRows = CreateGroupGrid.getSelectedRowsData();

    document.getElementById("GroupName").value = selectedGroupRows[0].ItemSubGroupName;
    document.getElementById("DisplayName").value = selectedGroupRows[0].ItemSubGroupDisplayName;

    $("#SelectBoxUnderGroup").dxSelectBox({
        value: JSON.parse(selectedGroupRows[0].UnderSubGroupID)
    });

    if (Number(selectedGroupRows[0].ItemSubGroupID) > 0 && Number(selectedGroupRows[0].ItemSubGroupID) !== 1) {
        document.getElementById("BtnDeletePopUp").disabled = false;
        document.getElementById("BtnSave").disabled = false;
        document.getElementById("BtnSaveAS").disabled = false;

        document.getElementById("GroupName").disabled = false;
        document.getElementById("DisplayName").disabled = false;
        $("#SelectBoxUnderGroup").dxSelectBox({
            disabled: false
        });
    }

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

});

$("#BtnSave").click(function () {
    SaveBtnFun();
});

$("#GroupName").change(function () {
    document.getElementById("DisplayName").value = document.getElementById("GroupName").value;
});

$("#DeleteButton").click(function () {
    var ItemSubGroupUniqueID = document.getElementById("ItemSubGroupUniqueID").value;
    if (ItemSubGroupUniqueID === "" || ItemSubGroupUniqueID === null || ItemSubGroupUniqueID === undefined) {
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
                url: "WebService_Master.asmx/DeleteGroupMasterData",
                data: '{ItemSubGroupUniqueID:' + JSON.stringify(document.getElementById("ItemSubGroupUniqueID").value.trim()) + '}',
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

function SaveBtnFun() {
    var SelectBoxUnderGroup = $('#SelectBoxUnderGroup').dxSelectBox('instance').option('value');
    var GroupName = document.getElementById("GroupName").value.trim();
    var DisplayName = document.getElementById("DisplayName").value.trim();

    if (GroupName === "") {
        alert("Please Enter Group Name");
        document.getElementById("GroupName").focus();
        document.getElementById("ValStrGroupName").style.fontSize = "10px";
        document.getElementById("ValStrGroupName").style.display = "block";
        document.getElementById("ValStrGroupName").innerHTML = 'This field should not be empty..Group Name';
        return false;
    }
    else {
        document.getElementById("ValStrGroupName").style.display = "none";
    }
    if (DisplayName === "") {
        alert("Please Enter Display Name");
        document.getElementById("DisplayName").focus();
        document.getElementById("ValStrDisplayName").style.fontSize = "10px";
        document.getElementById("ValStrDisplayName").style.display = "block";
        document.getElementById("ValStrDisplayName").innerHTML = 'This field should not be empty..Display Name';
        return false;
    }
    else {
        document.getElementById("ValStrDisplayName").style.display = "none";
    }
    if (SelectBoxUnderGroup === null || SelectBoxUnderGroup === "") {
        alert("Please select..Under Group");
        document.getElementById("ValStrSelectBoxUnderGroup").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxUnderGroup").style.display = "block";
        document.getElementById("ValStrSelectBoxUnderGroup").innerHTML = 'This field should not be empty..Under Group';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxUnderGroup").style.display = "none";
    }


    var jsonObjectsGroupMasterRecord = [];
    var OperationGroupMasterRecord = {};

    OperationGroupMasterRecord.ItemSubGroupName = GroupName;
    OperationGroupMasterRecord.ItemSubGroupDisplayName = DisplayName;
    OperationGroupMasterRecord.UnderSubGroupID = SelectBoxUnderGroup;

    jsonObjectsGroupMasterRecord.push(OperationGroupMasterRecord);

    var CostingDataGroupMaster = JSON.stringify(jsonObjectsGroupMasterRecord);

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
                    url: "WebService_Master.asmx/UpdatGroupData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',ItemSubGroupUniqueID:' + JSON.stringify(document.getElementById("ItemSubGroupUniqueID").value.trim()) + ',ItemSubGroupLevel:' + JSON.stringify(document.getElementById("ItemSubGroupLevel").value.trim()) + ',GroupName:' + JSON.stringify(document.getElementById("GroupName").value.trim()) + '}',
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
                    url: "WebService_Master.asmx/SaveGroupData",
                    data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',GroupName:' + JSON.stringify(document.getElementById("GroupName").value.trim()) + ',UnderGroupID:' + JSON.stringify($('#SelectBoxUnderGroup').dxSelectBox('instance').option('value')) + '}',
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

$("#BtnSaveAS").click(function () {
    GblStatus = "";
    SaveBtnFun();
});

$("#BtnNew").click(function () {
    document.getElementById("GroupName").value = "";
    document.getElementById("DisplayName").value = "";
    $("#SelectBoxUnderGroup").dxSelectBox({
        value: ''
    });
    document.getElementById("ItemSubGroupUniqueID").value = "";
    document.getElementById("ItemSubGroupID").value = "";
    document.getElementById("ItemSubGroupLevel").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    document.getElementById("BtnSaveAS").disabled = true;

    document.getElementById("GroupName").disabled = false;
    document.getElementById("DisplayName").disabled = false;
    $("#SelectBoxUnderGroup").dxSelectBox({
        disabled: false
    });
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});
