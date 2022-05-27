var GblStatus = "";

var sizeCons = ["Pree", "Post"]
$("#SelectBoxPress").dxSelectBox({
    items: sizeCons,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true,
    //acceptCustomValue: true,
});

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/GetDepartment",
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
            var RES1 = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            $("#DepartmentGrid").dxDataGrid({
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
                    autoExpandAll: true,
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
                    fileName: "Department master",
                    allowExportSelectedData: true,
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                onCellClick: function (e) {
                    var grid = $('#DepartmentGrid').dxDataGrid('instance');
                    if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
                    var Row = e.row.rowIndex;
                    var Col = e.columnIndex;

                    document.getElementById("TxtDepartmentID").value = "";
                    document.getElementById("TxtDepartmentID").value = e.row.data.DepartmentID;

                    if (e.row.data.DepartmentID == "") {
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
                          { dataField: "DepartmentID", visible: false, caption: "DepartmentID", },
                          { dataField: "DepartmentName", visible: true, caption: "Department Name" },
                          { dataField: "Press", visible: true, caption: "Press", },
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
    var TxtDepartmentID = document.getElementById("TxtDepartmentID").value;
    if (TxtDepartmentID == "" || TxtDepartmentID == null || TxtDepartmentID == undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    GblStatus = "Update";

    var DepartmentGrid = $('#DepartmentGrid').dxDataGrid('instance');
    var selectedDepartmentRows = DepartmentGrid.getSelectedRowsData();

    document.getElementById("DepartmentName").value = selectedDepartmentRows[0].DepartmentName;
    document.getElementById("ProductionSeqNo").value = selectedDepartmentRows[0].SequenceNo;
    
    $("#SelectBoxPress").dxSelectBox({
        value: selectedDepartmentRows[0].Press,
    });

   
    if (selectedDepartmentRows[0].DepartmentID == "" || selectedDepartmentRows[0].Press == "") {
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
    var TxtDepartmentID = document.getElementById("TxtDepartmentID").value;
    if (TxtDepartmentID == "" || TxtDepartmentID == null || TxtDepartmentID == undefined) {
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
            url: "WebService_OtherMaster.asmx/DeleteDepartmentMasterData",
            data: '{TxtDepartmentID:' + JSON.stringify(TxtDepartmentID) + '}',
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
});

$("#BtnSaveAS").click(function () {
    GblStatus = "";
    SaveBtnFun();
});

function SaveBtnFun() {
    var SelectBoxPress = $('#SelectBoxPress').dxSelectBox('instance').option('value');
    var DepartmentName = document.getElementById("DepartmentName").value.trim();
    var ProductionSeqNo = document.getElementById("ProductionSeqNo").value.trim();
   
    if (DepartmentName == "") {
        alert("Please Enter Department Name");
        document.getElementById("DepartmentName").focus();
        document.getElementById("ValStrDepartmentName").style.fontSize = "10px";
        document.getElementById("ValStrDepartmentName").style.display = "block";
        document.getElementById("ValStrDepartmentName").innerHTML = 'This field should not be empty..Depatment Name';
        return false;
    }
    else {
        document.getElementById("ValStrDepartmentName").style.display = "none";
    }

    if (SelectBoxPress == null || SelectBoxPress == "") {
        alert("Please select..Press");
        document.getElementById("ValStrSelectBoxPress").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxPress").style.display = "block";
        document.getElementById("ValStrSelectBoxPress").innerHTML = 'This field should not be empty..Orientation';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxPress").style.display = "none";
    }


    var jsonObjectsGroupMasterRecord = [];
    var OperationGroupMasterRecord = {};

    OperationGroupMasterRecord.DepartmentName = DepartmentName;
    OperationGroupMasterRecord.Press = SelectBoxPress.trim();
    OperationGroupMasterRecord.SequenceNo = ProductionSeqNo;

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
        if (GblStatus == "Update") {
            $.ajax({
                type: "POST",
                url: "WebService_OtherMaster.asmx/UpdatDepartmentData",
                data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',TxtDepartmentID:' + JSON.stringify(document.getElementById("TxtDepartmentID").value.trim()) + '}',
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
                        swal("Saved!", "Your data Updated", "success");
                        location.reload();
                    }
                    else if (res == "Exist") {
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
                url: "WebService_OtherMaster.asmx/SaveDepartmentData",
                data: '{CostingDataGroupMaster:' + CostingDataGroupMaster + ',DepartmentName:' + JSON.stringify(document.getElementById("DepartmentName").value.trim()) + ',SelectBoxPress:' + JSON.stringify($('#SelectBoxPress').dxSelectBox('instance').option('value')) + '}',
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
                        swal("Duplicate!", "This Group Name allready Exist..\n Please enter another Group Name..", "");
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                    alert(jqXHR);
                }
            });

        };

    });
}

$("#BtnNew").click(function () {
    document.getElementById("DepartmentName").value = "";
    $("#SelectBoxPress").dxSelectBox({
        value: '',
    });
    document.getElementById("TxtDepartmentID").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    document.getElementById("BtnSaveAS").disabled = true;

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});