var result = "";
var GblStatus;
var ContryData = [];
var getCountryListData = [];
var getStateListData = [];
var getCityListData = [];


var getCountryStateId = "";


$("#CountryStateMasterGrid").dxDataGrid({
    dataSource: ContryData,
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowReordering: false,
    //allowColumnResizing: true,
    paging: {
        pageSize: 15
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [15, 25, 50, 100]
    },
    selection: { mode: "single" },
    grouping: {
        autoExpandAll: true
    },
    stateStoring: {
        enabled: true,
        type: "localStorage",
        storageKey: "storage"
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
        fileName: "Country master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (e) {
        var grid = $('#CountryStateMasterGrid').dxDataGrid('instance');
        if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
        var Row = e.row.rowIndex;
        var Col = e.columnIndex;

        //document.getElementById("CountryStateMasterGridRow").value = "";
        //document.getElementById("CountryStateMasterGridRow").value = Row;

        document.getElementById("CountryStateMasterGridRow").value = "";
        getCountryStateId = document.getElementById("CountryStateMasterGridRow").value = e.row.data.CountryStateID;

        if (e.row.data.CountryStateID === "") {
            document.getElementById("DeleteButton").disabled = true;
            document.getElementById("BtnSave").disabled = true;
            document.getElementById("BtnSaveAS").disabled = true;

        }
        else {
            document.getElementById("DeleteButton").disabled = false;
            document.getElementById("BtnSave").disabled = false;
            document.getElementById("BtnSaveAS").disabled = false;
        }

    },

    columns: [{ dataField: "CountryStateID", visible: false, caption: "CountryStateID" },
    { dataField: "Country", visible: true, caption: "Country Name" },
    { dataField: "CountryCode", visible: true, caption: "Country Code" },
    { dataField: "State", visible: true, caption: "State Name" },
    { dataField: "City", visible: true, caption: "City Name" },
    { dataField: "StateCode", visible: true, caption: "State Code" },
    { dataField: "StateTinNo", visible: true, caption: "State Tin No" }
    ]
});

//Create Button
$("#CreateButton").click(function () {
    GblStatus = "";
    //  $("#BtnNew").click();
    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {
    var getTextCountryStateId = getCountryStateId;
    if (getTextCountryStateId === "" || getTextCountryStateId === null || getTextCountryStateId === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";
    var CountryStateGrid = $('#CountryStateMasterGrid').dxDataGrid('instance');
    var selectedCountryRows = CountryStateGrid.getSelectedRowsData();

    $("#SelectBoxCountry").dxSelectBox({ value: selectedCountryRows[0].Country });
    $("#SelectBoxState").dxSelectBox({ value: selectedCountryRows[0].State });
    $("#SelectBoxCity").dxSelectBox({ value: selectedCountryRows[0].City });
    document.getElementById("textStateTinNo").value = selectedCountryRows[0].StateTinNo;
    document.getElementById("textStateCode").value = selectedCountryRows[0].StateCode;
    document.getElementById("textCountryCode").value = selectedCountryRows[0].CountryCode;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");
});

$("#BtnSave").click(function () {
    SaveBtnFun();
});

$("#DeleteButton").click(function () {
    var getTextCountryStateId = getCountryStateId;
    if (getTextCountryStateId === "" || getTextCountryStateId === null || getTextCountryStateId === undefined) {
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
                url: "WebServiceCountryStateMaster.asmx/deleteCountryStateMasterData",
                data: '{getTextCountryStateId:' + JSON.stringify(getTextCountryStateId) + '}',
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

//Save Data.....
function SaveBtnFun() {
    var TextCountry = $('#SelectBoxCountry').dxSelectBox('instance').option('value');
    var TextState = $('#SelectBoxState').dxSelectBox('instance').option('value');
    var TextCity = $('#SelectBoxCity').dxSelectBox('instance').option('value');
    var TextStateTinNo = document.getElementById("textStateTinNo").value.trim();
    var TextStateCode = document.getElementById("textStateCode").value.trim();
    var TextCountryCode = document.getElementById("textCountryCode").value.trim();

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
                    url: "WebServiceCountryStateMaster.asmx/UpdateCountryStateMasterFunction",
                    data: '{TextCountryStateId:' + JSON.stringify(getCountryStateId) + ',TextCountry:' + JSON.stringify(TextCountry) + ',TextState:' + JSON.stringify(TextState) + ',TextCity:' + JSON.stringify(TextCity) + ',TextStateTinNo:' + JSON.stringify(TextStateTinNo) + ',TextStateCode:' + JSON.stringify(TextStateCode) + ',TextCountryCode:' + JSON.stringify(TextCountryCode) +'}',
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
                            swal("Duplicate!", "This Name already exist..\n Please enter another name..", "");
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
                    url: "WebServiceCountryStateMaster.asmx/SaveCountryStateMasterFunction",
                    data: '{TextCountry:' + JSON.stringify(TextCountry) + ',TextState:' + JSON.stringify(TextState) + ',TextCity:' + JSON.stringify(TextCity) + ',TextStateTinNo:' + JSON.stringify(TextStateTinNo) + ',TextStateCode:' + JSON.stringify(TextStateCode) + ',TextCountryCode:' + JSON.stringify(TextCountryCode) +'}',
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
        value: '',
    });
    document.getElementById("TxtCategoryID").value = "";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = false;
    document.getElementById("BtnSaveAS").disabled = true;

});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});
$("#BtnNew").click(function () {

    if (GblStatus === "Update") {
        document.getElementById("NewPassword").value = "";
        document.getElementById("NewPasswordAgain").value = "";
        document.getElementById("ChangePassTab").style.display = "none";

        document.getElementById("ChangePassTab").className = "";
        document.getElementById("UserMasterChangePass").className = "tab-pane animated fadeInRight";

        document.getElementById("ProfileTab").className = "active";
        document.getElementById("UserProfile").className = "tab-pane animated fadeInRight active";

        document.getElementById("AnchorUserProfile").setAttribute("data-toggle", "tab");
        document.getElementById("AnchorUserProfile").setAttribute("href", "#UserProfile");
    }

    GblStatus = "";
    document.getElementById("fotoupload").disabled = "";
    BlankField();

});


//To get data in grid....
fillGrid();
function fillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebServiceCountryStateMaster.asmx/CountryStateMasterFunction",
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
            var ContryData = JSON.parse(res);
            document.getElementById("LOADER").style.display = "none";
            $("#CountryStateMasterGrid").dxDataGrid({
                dataSource: ContryData,
            });
        }
    });
}

//To get list of country 
$.ajax({
    type: "POST",
    url: "WebServiceCountryStateMaster.asmx/toGetCountryList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"Country":"/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var splitContry = res.split(',');

        if (splitContry.length > 0) {
            for (var c in splitContry) {
                getCountryListData.push(splitContry[c]);
            }
        }
        else {
            getCountryListData = [];
        }

        document.getElementById("LOADER").style.display = "none";
        $("#SelectBoxCountry").dxSelectBox({
            items: getCountryListData,
            placeholder: "Select--",
            searchEnabled: true,
            showClearButton: true,
            acceptCustomValue: true,
        });
    }
});
//To get list of state 
$.ajax({
    type: "POST",
    url: "WebServiceCountryStateMaster.asmx/toGetStateList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        //console.debug(results);
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"State":"/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var splitContry = res.split(',');

        if (splitContry.length > 0) {
            for (var c in splitContry) {
                getStateListData.push(splitContry[c]);
            }
        }
        else {
            getStateListData = [];
        }
        document.getElementById("LOADER").style.display = "none";
        $("#SelectBoxState").dxSelectBox({
            items: getStateListData,
            placeholder: "Select--",
            searchEnabled: true,
            showClearButton: true,
            acceptCustomValue: true,
        });
    }
});
//To get list of city 
$.ajax({
    type: "POST",
    url: "WebServiceCountryStateMaster.asmx/toGetCityList",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        //console.debug(results);
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.replace(/"City":"/g, '');
        res = res.replace(/"/g, '');
        res = res.replace(/{/g, '');
        res = res.replace(/}/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var splitContry = res.split(',');

        if (splitContry.length > 0) {
            for (var c in splitContry) {
                getCityListData.push(splitContry[c]);
            }
        }
        else {
            getCityListData = [];
        }
        document.getElementById("LOADER").style.display = "none";
        $("#SelectBoxCity").dxSelectBox({
            items: getCityListData,
            placeholder: "Select--",
            searchEnabled: true,
            showClearButton: true,
            acceptCustomValue: true,
        });
    }
});

