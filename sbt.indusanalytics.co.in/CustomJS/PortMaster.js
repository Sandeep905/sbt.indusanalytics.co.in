var GblPortID = 0;

$("#GridShowList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowReordering: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    height: function () {
        return window.innerHeight / 1.2;
    },
    scrolling: { mode: 'virtual' },
    filterRow: { visible: true, applyFilter: "auto" },
    columnChooser: { enabled: true },
    headerFilter: { visible: true },
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "Port Master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#509EBC');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (clickedProcessCell) {
        var GetSelectedListData = clickedProcessCell.selectedRowsData;
        GblPortID = 0;
        if (GetSelectedListData.length <= 0) return;
        GblPortID = GetSelectedListData[0].PortID;
    },
    columns: [
        { dataField: "PortName", visible: true, caption: "Port Name" },
        { dataField: "PortCode", visible: true, caption: "Port Code" },
        { dataField: "StateCode", visible: true, caption: "State Code" }]
});

$("#SelStateCode").dxSelectBox({
    items: [],
    valueExpr: "StateCode",
    displayExpr: "StateCode",
    placeholder: "Select--",
    searchEnabled: true,
    showClearButton: true
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebServiceCountryStateMaster.asmx/GetStateCode",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/u0026/g, '&');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);
        $("#SelStateCode").dxSelectBox({ items: RES1 });
    },
    error: function errorFunc(jqXHR) {
        console.log(jqXHR);
    }
});

refreshShowList();
function refreshShowList() {
    $.ajax({
        type: "POST",
        async: false,
        url: "WebServiceCountryStateMaster.asmx/GetPortMasters",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridShowList").dxDataGrid({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}

//Create Button
$("#BtnCreate").click(function () {
    document.getElementById("TxtPortName").value = "";
    document.getElementById("TxtPortCode").value = "";
    $("#SelStateCode").dxSelectBox({ value: null });
    document.getElementById("BtnDeletePopUp").disabled = true;

    document.getElementById("BtnCreate").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreate").setAttribute("data-target", "#largeModal");
});

$("#BtnEdit").click(function () {
    var GridShowList = $('#GridShowList').dxDataGrid('instance');
    var selectedPortRow = GridShowList.getSelectedRowsData();
    if (selectedPortRow.length <= 0 || GblPortID <= 0) {
        swal("Please choose any row from below grid..!", "", "warning");
        return false;
    }
    document.getElementById("BtnDeletePopUp").disabled = false;

    $("#SelStateCode").dxSelectBox({ value: selectedPortRow[0].StateCode });
    document.getElementById("TxtPortName").value = selectedPortRow[0].PortName;
    document.getElementById("TxtPortCode").value = selectedPortRow[0].PortCode;

    document.getElementById("BtnEdit").setAttribute("data-toggle", "modal");
    document.getElementById("BtnEdit").setAttribute("data-target", "#largeModal");
});

$("#BtnSave").click(function () {
    var SelStateCode = $('#SelStateCode').dxSelectBox('instance').option('value');
    var TxtPortCode = document.getElementById("TxtPortCode").value.trim();
    var TxtPortName = document.getElementById("TxtPortName").value.trim();

    var ArrPort = {};
    var ObjPort = [];
    ArrPort.PortName = TxtPortName;
    ArrPort.PortCode = TxtPortCode;
    ArrPort.StateCode = SelStateCode;
    ObjPort.push(ArrPort);

    swal({
        title: "Do you want to save port master..?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {

            document.getElementById("LOADER").style.display = "block";

            $.ajax({
                type: "POST",
                url: "WebServiceCountryStateMaster.asmx/SaveUpdatePortMaster",
                data: '{PortID:' + GblPortID + ',ObjPort:' + JSON.stringify(ObjPort) + '}',
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
                    if (res === "Updated") {
                        swal("Updated!", "Your data updated successfully", "success");
                        location.reload();
                    } else if (res === "Saved") {
                        swal("Saved!", "Your data saved successfully", "success");
                        location.reload();
                    }
                    else {
                        swal("Not Updated!", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });

        });
});

$("#BtnDelete").click(function () {
    if (GblPortID <= 0) {
        swal("Please choose any row from below grid..!", "", "warning");
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this..!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },

        function () {
            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebServiceCountryStateMaster.asmx/DeletePortMasterData",
                data: '{PortID:' + GblPortID + '}',
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
                        swal("Not Deleted!", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnDeletePopUp").click(function () {
    $("#BtnDelete").click();
});