
var objMachineName = [], objUserName = [], objLoginInfo=[];

$("#DateFrom").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});

$("#DateTo").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});

ShowList(objLoginInfo);

$("#SelMachine").dxTagBox({
    items: objMachineName,
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Machine...",
    displayExpr: "MachineName",
    valueExpr: "MachineID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    //showMultiTagOnly: false,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#MachineID").text(data);
        }
        else {
            $("#MachineID").text("");
        }        
    }
});

$("#SelUser").dxTagBox({
    items: objUserName,
    multiline: false,
    searchEnabled: true,
    placeholder: "Select User...",
    displayExpr: 'UserName',
    valueExpr: 'UserID',
    showSelectionControls: true,
    maxDisplayedTags: 2,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#UserID").text(data);
        }
        else {
            $("#UserID").text("");
        }
    }
});

function ShowList(objLoginInfo) {
    $("#ShowListGrid").dxDataGrid({
        dataSource: objLoginInfo,
        columnAutoWidth: true,
        columnResizingMode: "widget",
        showBorders: true,
        showRowLines: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        sorting: {
            mode: "multiple"
        },
        paging: { enabled: true },
        selection: { mode: "single" },
        filterRow: { visible: true, applyFilter: "auto" },
        columnChooser: { enabled: false },
        headerFilter: { visible: true },
        searchPanel: { visible: false },
        loadPanel: {
            enabled: true,
            text: 'Data is loading...'
        },
        export: {
            enabled: true,
            fileName: "Login information",
            allowExportSelectedData: true,
        },
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        columns: [
            { dataField: "UserName", visible: true, width: 250, caption: "User Name" },
            { dataField: "MachineID", visible: true, width: 120 },
            { dataField: "MachineName", visible: true, width: 250, caption: "Machine Name" },
            { dataField: "LoginTime", visible: true, width: 300, caption: "Log in Time" },
            { dataField: "LogOutTime", visible: true, width: 300, caption: "Log Out Time" }           
        ],
        height: function () {
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        }
    });
}

$.ajax({
    type: "POST",
    url: "WebService_LoginInformation.asmx/GetAllMachine",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        objMachineName = [];
        objMachineName = JSON.parse(res.toString());
        $("#SelMachine").dxTagBox({
            items: objMachineName,
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebService_LoginInformation.asmx/GetAllUser",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: 'text',
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/u0027/g, "'");
        res = res.substr(1);
        res = res.slice(0, -1);
        document.getElementById("LOADER").style.display = "none";
        objUserName = [];
        objUserName = JSON.parse(res.toString());
        $("#SelUser").dxTagBox({
            items: objUserName,
        });
    }
});

$("#BtnSearch").click(function () {
    var DateFrom = $('#DateFrom').dxDateBox('instance').option('value');
    var DateTo = $('#DateTo').dxDateBox('instance').option('value');
    var ShowAll = document.getElementById("ShowAll").checked;
    var UserID = document.getElementById("UserID").value;
    var MachineID = document.getElementById("MachineID").value;
    
    $.ajax({
        type: "POST",
        url: "WebService_LoginInformation.asmx/GetLoginInfo",
        data: '{DateFrom:' + JSON.stringify(DateFrom) + ',DateTo:' + JSON.stringify(DateTo) + ',ShowAll:' + JSON.stringify(ShowAll) + ',UserID:' + JSON.stringify(UserID) + ',MachineID:' + JSON.stringify(MachineID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027/g, "'");
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            objLoginInfo = [];
            objLoginInfo = JSON.parse(res.toString());

            $("#ShowListGrid").dxDataGrid({
                dataSource: objLoginInfo,
            });
        }
    });
});


