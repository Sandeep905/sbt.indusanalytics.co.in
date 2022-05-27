
var GblStatus = "";
var ShowListData = [];
var GetRowWarehouseID = "";

//City Name
$.ajax({
    type: "POST",
    url: "WebService_WarehouseMaster.asmx/GetCity",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        ////console.debug(results);
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        RES1 = JSON.parse(res);

        $("#SelCity").dxSelectBox({
            items: RES1,
            placeholder: "Select--",
            displayExpr: 'City',
            valueExpr: 'City',
            searchEnabled: true,
            showClearButton: true,
            acceptCustomValue: true,

        });
    }
});

//Get Show List
Showlist();
function Showlist() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_WarehouseMaster.asmx/ShowListWarehouseMaster",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            RES1 = JSON.parse(res.toString());

            $("#WarehouseShowListGrid").dxDataGrid({
                dataSource: RES1,
                showBorders: true,
                paging: {
                    enabled: false
                },
                showRowLines: true,
                allowSorting: false,
                allowColumnResizing: true,
                selection: { mode: "single" },
                paging: {
                    pageSize: 15
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [15, 25, 50, 100]
                },
                filterRow: { visible: true, applyFilter: "auto" },
                sorting: {
                    mode: "none" // or "multiple" | "single"
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
                    }
                    e.rowElement.css('fontSize', '11px');
                },

                onSelectionChanged: function (Showlist) {
                    sholistData = [];
                    sholistData = Showlist.selectedRowsData;
                    document.getElementById("TxtWarehouseID").value = sholistData[0].WarehouseName;

                },
                columns: [{ dataField: "UserID", visible: false, width: 120 },
                        { dataField: "CompanyID", visible: false, width: 120 },
                        { dataField: "CreatedBy", visible: false, width: 120 },
                        { dataField: "ModifiedBy", visible: false, width: 100 },
                        { dataField: "DeletedBy", visible: false, width: 120 },
                        { dataField: "WarehouseName", visible: true, width: 250 },
                        { dataField: "City", visible: true, width: 100 },
                        { dataField: "Address", visible: true, width: 350 },
                        { dataField: "FYear", visible: true, width: 100 },
                        //{ dataField: "ItemCode", visible: true, width: 100 },
                        { dataField: "CreatedDate", visible: true, width: 120 },
                        { dataField: "ModifiedDate", visible: true, width: 120 },
                        { dataField: "DeletedDate", visible: true, width: 100 },
                ]
            })
        }
    });
}

$("#BtnNew").click(function () {
    GblStatus = "";
    // document.getElementById('TxtWarehouseID').value = "";
    document.getElementById('TxtWarehouseAddress').value = "";
    document.getElementById('TxtWarehouseName').value = "";
    GblStatus = "";

    $("#SelCity").dxSelectBox({
        value: null
    });

    ObjBinNameGrid = [];
    CreateBin();

});

$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

var ObjBinNameGrid = [];
CreateBin()
function CreateBin() {
    $("#BinNameGrid").dxDataGrid({
        dataSource: ObjBinNameGrid,
        columnAutoWidth: true,
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        sorting: {
            mode: "none"
        },
        loadPanel: {
            enabled: true,
            height: 90,
            width: 200,
            text: 'Data is loading...'
        },
        editing: {
            mode: "cell",
            allowDeleting: true,
            //allowAdding: true,
            allowUpdating: true
        },

        onRowRemoving: function (e) {

            GetRowWarehouseID = "";
            GetRowWarehouseID = e.data.WarehouseID;

            if (isNaN(GetRowWarehouseID)) {
                console.log("this row not exist");
            } else {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: "WebService_WarehouseMaster.asmx/CheckPermission",
                    data: '{GetRowWarehouseID:' + JSON.stringify(GetRowWarehouseID) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        if (res == "Exist") {
                            swal("", "This item is used in another process..! Record can not be delete.", "error");
                            e.cancel = true;
                        }
                    }
                });
            }
        },
        //onRowRemoved: function (e) {           
        //        e.component.undeleteRow(0);
        //},
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#509EBC');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        columns: [{ dataField: "WarehouseID", visible: false, caption: "WarehouseID", },
        { dataField: "BinName", visible: true, caption: "Bin Name", },

        ]

    })
}

$("#BtnAddRowCol").click(function () {
    var CheckExistBinName = "";
    var TxtBinName = document.getElementById("TxtBinName").value;

    var BinNameGrid = $('#BinNameGrid').dxDataGrid('instance');
    var BinNameGridCount = BinNameGrid.totalCount();

    if (BinNameGridCount > 0) {
        for (var h = 0; h < BinNameGridCount; h++) {
            if (TxtBinName != "") {
                if (BinNameGrid._options.dataSource[h].BinName.toLowerCase() == TxtBinName.toLowerCase()) {
                    CheckExistBinName = "yes";
                    BinNameGrid.cellValue(h, "BinName", BinNameGrid._options.dataSource[h].BinName);
                    DevExpress.ui.notify("This Bin name already exist..Please enter another Bin name ..!", "error", 1000);
                    return false;
                }
            }
        }
        if (CheckExistBinName == "") {
            var optpaytr = {}
            var GenID = BinNameGridCount + 1;
            optpaytr.WarehouseID = "New" + GenID;
            optpaytr.BinName = TxtBinName;
            ObjBinNameGrid.push(optpaytr);

            $("#BinNameGrid").dxDataGrid({
                dataSource: ObjBinNameGrid,
            });
        }
    } else {
        var optpaytr = {}
        var GenID = BinNameGridCount + 1;
        optpaytr.WarehouseID = "New" + GenID;
        optpaytr.BinName = TxtBinName;
        ObjBinNameGrid.push(optpaytr);

        $("#BinNameGrid").dxDataGrid({
            dataSource: ObjBinNameGrid,
        });
    }

});

$("#BtnSave").click(function () {

    var SelCity = $('#SelCity').dxSelectBox('instance').option('value');
    var TxtWarehouseName = document.getElementById("TxtWarehouseName").value;
    var TxtWarehouseAddress = document.getElementById("TxtWarehouseAddress").value;

    if (TxtWarehouseName == "" || TxtWarehouseName == undefined || TxtWarehouseName == null) {
        DevExpress.ui.notify("Please enter Warehouse name...!", "error", 1000);
        var text = "Please enter Warehouse name...!";
        document.getElementById("TxtWarehouseName").value = "";
        document.getElementById("TxtWarehouseName").focus();
        document.getElementById("ValStrTxtWarehouseName").style.display = "block";
        document.getElementById("ValStrTxtWarehouseName").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrTxtWarehouseName").style.display = "none";
    }

    if (TxtWarehouseAddress == "" || TxtWarehouseAddress == undefined || TxtWarehouseAddress == null) {
        DevExpress.ui.notify("Please enter Warehouse address...!", "error", 1000);
        var text = "Please enter Warehouse address...!";
        document.getElementById("TxtWarehouseAddress").value = "";
        document.getElementById("TxtWarehouseAddress").focus();
        document.getElementById("ValStrTxtWarehouseAddress").style.display = "block";
        document.getElementById("ValStrTxtWarehouseAddress").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrTxtWarehouseAddress").style.display = "none";
    }

    if (SelCity == "" || SelCity == undefined || SelCity == null) {
        DevExpress.ui.notify("Please Choose City...!", "error", 1000);
        var text = "Please Choose City...!";
        document.getElementById("SelCity").focus();
        document.getElementById("ValStrCity").style.display = "block";
        document.getElementById("ValStrCity").innerHTML = text;
        return false;
    } else {
        document.getElementById("ValStrCity").style.display = "none";
    }

    var BinNameGrid = $('#BinNameGrid').dxDataGrid('instance');
    var BinNameGridCount = BinNameGrid.totalCount();

    var jsonObjectsUpdateRecord = [];
    var OperationUpdateRecord = {};

    var jsonObjectsSaveRecord = [];
    var OperationSaveRecord = {};

    var CheckExistBinName = "";

    if (BinNameGridCount > 0) {
        for (var h = 0; h < BinNameGridCount; h++) {
            if (BinNameGrid._options.dataSource[h].BinName == "" || BinNameGrid._options.dataSource[h].BinName == null || BinNameGrid._options.dataSource[h].BinName == undefined) {
                BinNameGrid.cellValue(h, "BinName", "");
                DevExpress.ui.notify("Please enter Bin name ..!", "error", 1000);
                return false;
            }
            if (h > 0) {
                CheckExistBinName = BinNameGrid._options.dataSource[h - 1].BinName;
                if (CheckExistBinName.toLowerCase() == (BinNameGrid._options.dataSource[h].BinName).toLowerCase()) {
                    BinNameGrid.cellValue(h, "BinName", BinNameGrid._options.dataSource[h].BinName);
                    DevExpress.ui.notify("Already exist this Bin name ..!", "error", 1000);
                    return false;
                }
            }
        }
    }

    if (GblStatus == "Update") {
        if (BinNameGridCount > 0) {
            for (var t = 0; t < BinNameGridCount; t++) {
                var getGridBinID = BinNameGrid._options.dataSource[t].WarehouseID;

                if (isNaN(getGridBinID)) {
                    OperationSaveRecord = {};
                    OperationSaveRecord.WarehouseBinName = TxtWarehouseName + "-" + BinNameGrid._options.dataSource[t].BinName;
                    OperationSaveRecord.WarehouseName = TxtWarehouseName;
                    OperationSaveRecord.BinName = BinNameGrid._options.dataSource[t].BinName;
                    OperationSaveRecord.City = SelCity;
                    OperationSaveRecord.Address = TxtWarehouseAddress;

                    jsonObjectsSaveRecord.push(OperationSaveRecord);
                }
                else {
                    OperationUpdateRecord = {};
                    OperationUpdateRecord.WarehouseID = BinNameGrid._options.dataSource[t].WarehouseID;
                    OperationUpdateRecord.WarehouseBinName = TxtWarehouseName + "-" + BinNameGrid._options.dataSource[t].BinName;
                    OperationUpdateRecord.WarehouseName = TxtWarehouseName;
                    OperationUpdateRecord.BinName = BinNameGrid._options.dataSource[t].BinName;
                    OperationUpdateRecord.City = SelCity;
                    OperationUpdateRecord.Address = TxtWarehouseAddress;

                    jsonObjectsUpdateRecord.push(OperationUpdateRecord);
                }

            }
        } else {
            DevExpress.ui.notify("Please enter Bin name ..!", "error", 1000);
            return false;
        }


    }
    else {
        if (BinNameGridCount > 0) {
            for (var t = 0; t < BinNameGridCount; t++) {
                OperationSaveRecord = {};
                OperationSaveRecord.WarehouseBinName = TxtWarehouseName + "-" + BinNameGrid._options.dataSource[t].BinName;
                OperationSaveRecord.WarehouseName = TxtWarehouseName;
                OperationSaveRecord.BinName = BinNameGrid._options.dataSource[t].BinName;
                OperationSaveRecord.City = SelCity;
                OperationSaveRecord.Address = TxtWarehouseAddress;

                jsonObjectsSaveRecord.push(OperationSaveRecord);
            }
        }
        else {
            DevExpress.ui.notify("Please enter Bin name ..!", "error", 1000);
            return false;
        }

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
        if (GblStatus == "Update") {
            //alert(JSON.stringify(jsonObjectsRecordMain));
            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_WarehouseMaster.asmx/UpdateWarehouse",
                data: '{TxtWarehouseID:' + JSON.stringify(document.getElementById("TxtWarehouseID").value) + ',jsonObjectsSaveRecord:' + JSON.stringify(jsonObjectsSaveRecord) + ',jsonObjectsUpdateRecord:' + JSON.stringify(jsonObjectsUpdateRecord) + '}',
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
                        document.getElementById("BtnSave").setAttribute("data-dismiss", "modal");
                        swal("Updated!", "Your data Updated", "success");
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

            document.getElementById("LOADER").style.display = "block";

            $.ajax({
                type: "POST",
                url: "WebService_WarehouseMaster.asmx/SaveWarehouse",
                data: '{jsonObjectsSaveRecord:' + JSON.stringify(jsonObjectsSaveRecord) + '}',
                // data: '{prefix:' + JSON.stringify(prefix) + '}',
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
                        swal("Duplicate!", "This Process Name allready Exist..\n Please enter another Process Name..", "");
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                    alert(jqXHR);
                }
            });
        }
    });

});

$("#EditButton").click(function () {
    var TxtWarehouseID = document.getElementById("TxtWarehouseID").value;
    if (TxtWarehouseID == "" || TxtWarehouseID == null || TxtWarehouseID == undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";

    document.getElementById("TxtWarehouseName").value = sholistData[0].WarehouseName;
    document.getElementById("TxtWarehouseAddress").value = sholistData[0].Address;
    $("#SelCity").dxSelectBox({
        value: sholistData[0].City
    });

    $.ajax({
        type: "POST",
        url: "WebService_WarehouseMaster.asmx/SelectBinName",
        data: '{WarehouseName:' + JSON.stringify(TxtWarehouseID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            ////console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            document.getElementById("LOADER").style.display = "none";
            var IssueRetrive = JSON.parse(res);

            ObjBinNameGrid = [];
            ObjBinNameGrid = IssueRetrive;
            CreateBin();

        }
    });
});