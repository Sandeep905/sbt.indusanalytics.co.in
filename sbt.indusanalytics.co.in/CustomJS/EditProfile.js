"use strict";

var GblStatus = "";
var existUser = [];
var newArray = [];
var SupportSystemGridData = [];
var SectionCount = 0;
var text = "";

$("#SelectBoxCountry").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'Country',
    valueExpr: 'Country',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        //var SelectedData = "";
        // document.getElementById("LblCountry").innerHTML = data.value;
    }
});

$("#SelectBoxState").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'State',
    valueExpr: 'State',
    searchEnabled: true,
    showClearButton: true
});

$("#SelectBoxCity").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'City',
    valueExpr: 'City',
    searchEnabled: true,
    showClearButton: true
});

$("#SelectBoxDesignation").dxSelectBox({
    items: [],
    placeholder: "Select--",
    searchEnabled: true,
    showClearButton: true,
    acceptCustomValue: true
});

$("#SelectBoxUnderUser").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'UserName',
    valueExpr: 'UserID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        // document.getElementById("LblUnderUser").innerHTML = $('#SelectBoxUnderUser').dxSelectBox('instance').option('text');
    }
});

$("#SelectBoxSMTPAuthenticate").dxSelectBox({
    items: ["True", "False"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelectBoxSMTPUseSSL").dxSelectBox({
    items: ["True", "False"],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
});

$("#SelectBoxVendor").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'VendorName',
    valueExpr: 'VendorID',
    showClearButton: true,
    searchEnabled: true
});

$("#UserGrid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    showBorders: true,
    showRowLines: true,
    allowColumnReordering: true,
    allowReordering: false,
    //allowColumnResizing: true,
    paging: {
        pageSize: 20
    },
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [20, 40, 80, 300]
    },
    selection: { mode: "single" },
    grouping: {
        autoExpandAll: true
    },
    height: function () {
        return window.innerHeight / 1.2;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    headerFilter: { visible: true },
    rowAlternationEnabled: true,
    searchPanel: { visible: true },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    export: {
        enabled: true,
        fileName: "User Master",
        allowExportSelectedData: true
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (e) {
        if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;

        document.getElementById("UserGetGridRow").value = e.row.rowIndex;
        document.getElementById("Userid").value = e.row.data.UserID;

        if (e.row.data.UserID === "") {
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
    columns: [
        { dataField: "UserID", visible: false, caption: "UserID" },
        { dataField: "Password", visible: false, caption: "Password" },
        { dataField: "ProfilePicHref", visible: false, caption: "ProfilePicHref" },
        { dataField: "SignPicHref", visible: false, caption: "SignPicHref" },
        { dataField: "UnderUserID", visible: false, caption: "UnderUserID" },
        { dataField: "UserName", visible: true, caption: "User Name" },
        { dataField: "ContactNo", visible: true, caption: "Contact No" },
        { dataField: "Designation", visible: true, caption: "Designation" },
        { dataField: "EmailID", visible: true, caption: "Email ID" },
        { dataField: "Country", visible: true, caption: "Country" },
        { dataField: "State", visible: true, caption: "State" },
        { dataField: "City", visible: true, caption: "City" },
        { dataField: "smtpUserName", visible: true, caption: "smtp User Name" },
        { dataField: "smtpServer", visible: true, caption: "Server" },
        { dataField: "smtpServerPort", visible: true, caption: "Server Port" },
        { dataField: "smtpAuthenticate", visible: true, caption: "Authenticate" },
        { dataField: "smtpUseSSL", visible: true, caption: "Use SSL" },
        { dataField: "Details", visible: true, caption: "Details" },
        { dataField: "IsCreateUser", visible: true, caption: "Is Create User" },
        { dataField: "IsExtraPaperIssue", visible: true, caption: "Is Extra Paper Issue" },
        { dataField: "IsUserCannotViewCostingDetail", visible: true, caption: "Is User Can't View CostingDetail" },
        { dataField: "IsHidden", visible: true, caption: "Is Hidden" },
        { dataField: "IsAdmin", visible: true, caption: "Is Admin" },
        { dataField: "ISChooseAnotherPaper", visible: true, caption: "Is Choose Another Paper" },
        { dataField: "IsEditableProductionDate", visible: true, caption: "Is Editable Production Date" }
    ]
});

//password Coding
$(function () {
    var passwordEditor1 = $("#password1").dxTextBox({
        placeholder: "password",
        mode: "password",
        stylingMode: "filled",
        buttons: [{
            name: "password",
            location: "after",
            options: {
                icon: "fa fa-eye",
                type: "default",
                onClick: function () {
                    passwordEditor1.option("mode", passwordEditor1.option("mode") === "text" ? "password" : "text");
                }
            }
        }]
    }).dxTextBox("instance");
    var passwordEditor2 = $("#password2").dxTextBox({
        placeholder: "password",
        mode: "password",
        stylingMode: "filled",
        buttons: [{
            name: "password",
            location: "after",
            options: {
                icon: "fa fa-eye",
                type: "default",
                onClick: function () {
                    passwordEditor2.option("mode", passwordEditor2.option("mode") === "text" ? "password" : "text");
                }
            }
        }]
    }).dxTextBox("instance");
});

//UnderUserName
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/UnderUser",
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
        $("#SelectBoxUnderUser").dxSelectBox({
            items: RES1
        });
    }
});

//Operators List
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/UserOperatorsList",
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
        $("#OperatorAllocationGrid").dxDataGrid({
            dataSource: RES1
        });
    }
});

//Vendor List
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
    }
});

//Designation
designation();
function designation() {
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/UserDesignation",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            //console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/"Designation":/g, '');
            res = res.substr(2);
            res = res.slice(0, -2);
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.replace(/"/g, '');
            var desiString = [];
            res = res.split(",");
            for (var d in res) {
                desiString.push(res[d]);
            }
            $("#SelectBoxDesignation").dxSelectBox({
                items: desiString
            });
        }
    });
}

//Get All MasterFormGrid
var SelectRowNo;
var SelectColumnNo;
var gridObj = $("#SupportSystemGrid").dxDataGrid({
    dataSource: SupportSystemGridData,
    showBorders: true,
    showRowLines: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.4;
    },
    allowColumnResizing: true,
    columnResizingMode: "widget",
    allowSorting: false,
    filterRow: { visible: true, applyFilter: "auto" },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    columns: [//, groupIndex: 0
        { dataField: "SetGroupIndex", visible: true, width: .1 },
        { dataField: "ModuleID", visible: false, width: 120 },
        { dataField: "ModuleHeadDisplayOrder", visible: false, width: 120 },
        { dataField: "ModuleName", visible: false, width: 120 },
        { dataField: "ModuleHeadName", visible: true, width: 100 },
        { dataField: "ModuleDisplayName", visible: true, width: 120, caption: "Module Name" },
        { dataField: "CanView", visible: true, width: 120, dataType: "boolean" },
        { dataField: "CanSave", visible: true, width: 120, dataType: "boolean" },
        { dataField: "CanEdit", visible: true, width: 120, dataType: "boolean" },
        { dataField: "CanDelete", visible: true, width: 120, dataType: "boolean" },
        { dataField: "CanExport", visible: true, width: 120, dataType: "boolean" },
        { dataField: "CanPrint", visible: true, width: 120, dataType: "boolean" }
    ],
    onEditingStart: function (e) {
        if (e.column.visibleIndex > 5) {
            e.cancel = false;
        } else {
            e.cancel = true;
        }
        if (e.column.dataField !== "CanView" && e.column.visibleIndex > 5) {
            if (e.data.CanView === false) {
                e.cancel = true;
            }
            else {
                e.cancel = false;
            }
        }
    },
    onCellClick: function (e) {
        if (e.column === undefined) return;
        var gridinstance = $("#SupportSystemGrid").dxDataGrid('instance');
        var rowCountData = gridinstance._options.dataSource.length;
        // rowCountData = Number(rowCountData) + Number(SectionCount);

        var columnCount1 = gridinstance.columnCount();
        let rowIndex = gridinstance.getRowIndexByKey(e.key);

        var GetColCaption = e.column.dataField;
        var GetColIndexValue = e.columnIndex;

        var InsertValue = e.value;

        var InsVal = "false";

        if (e.rowType === "data") {
            if (e.column.dataField === "CanView" && rowIndex === 0) {
                InsertValue = e.value;
                if (InsertValue === false) {
                    e.data.CanSave = false;
                    e.data.CanEdit = false;
                    e.data.CanDelete = false;
                    e.data.CanExport = false;
                    e.data.CanPrint = false;

                    for (var r = 0; r < rowCountData; r++) {
                        gridinstance._options.dataSource[r].CanView = InsertValue;
                        gridinstance._options.dataSource[r].CanSave = InsertValue;
                        gridinstance._options.dataSource[r].CanDelete = InsertValue;
                        gridinstance._options.dataSource[r].CanEdit = InsertValue;
                        gridinstance._options.dataSource[r].CanExport = InsertValue;
                        gridinstance._options.dataSource[r].CanPrint = InsertValue;
                    }

                } else {
                    if (e.column.dataField === "CanView" && rowIndex === 0) {
                        for (var f = 0; f < rowCountData; f++) {
                            gridinstance._options.dataSource[f].CanView = InsertValue;
                        }
                    }
                }
            }
            else {
                var checkValue = gridinstance.cellValue(rowIndex, GetColCaption);
                if (e.column.dataField === "CanView" && rowIndex !== 0) {
                    if (e.value === false) {
                        e.data.CanSave = false;
                        e.data.CanEdit = false;
                        e.data.CanDelete = false;
                        e.data.CanExport = false;
                        e.data.CanPrint = false;
                    }
                }
                if (checkValue === false && rowIndex === 0) {
                    for (let A = 0; A < rowCountData; A++) {
                        for (var col = GetColIndexValue; col <= columnCount1; col++) {
                            if (GetColIndexValue === col) {
                                gridinstance._options.dataSource[A][GetColCaption] = InsertValue;
                            }
                        }
                    }
                }

                if (checkValue === true && rowIndex === 0) {
                    for (var A = 0; A < rowCountData; A++) {
                        InsVal = gridinstance._options.dataSource[0][GetColCaption];
                        var CheckCanView = gridinstance._options.dataSource[A].CanView;
                        if (CheckCanView === false) {
                            InsVal = false;
                        }
                        if (CheckCanView !== undefined && CheckCanView === true) {
                            gridinstance._options.dataSource[A][GetColCaption] = InsVal;
                        }
                    }
                }
            }
        }
    }

}).dxDataGrid('instance');

var gridOperator = $("#OperatorAllocationGrid").dxDataGrid({
    dataSource: [],
    keyExpr: "LedgerID",
    showBorders: true,
    showRowLines: true,
    scrolling: {
        mode: 'virtual'
    },
    selection: {
        mode: "multiple"
    },
    height: function () {
        return window.innerHeight / 1.4;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    columns: [
        { dataField: "LedgerID", visible: false, width: 120 },
        { dataField: "LedgerName", visible: true, caption: "Operator" }
    ],
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            $("#TxtOperatorID").text(
                $.map(data, function (value) {
                    return value.LedgerID;
                }).join(','));
        }
        else {
            $("#TxtOperatorID").text("");
        }
    }
}).dxDataGrid('instance');

//Creation of Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();
    document.getElementById("ChangePassTab").style.display = "none";
    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab

    $.ajax({
        type: "POST",
        url: "UserAuthentication.asmx/GetAllForm",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            SupportSystemGridData = JSON.parse(res);
            SectionCount = SupportSystemGridData[0].SectionCount;

            $("#SupportSystemGrid").dxDataGrid({
                dataSource: SupportSystemGridData
            });
        }
    });
    document.getElementById("Password").disabled = false;
    document.getElementById("REPassword").disabled = false;

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {

    var txtGetGridRow = document.getElementById("UserGetGridRow").value;
    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }
    GblStatus = "Update";
    $('#largeModal .nav-tabs li:eq(0) a').tab('show'); ///to navigate in the first tab

    BlankField();
    document.getElementById("BtnDeletePopUp").disabled = "";
    document.getElementById("BtnSaveAS").disabled = "";

    document.getElementById("ChangePassTab").style.display = "block";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    var UserMasterGrid = $('#UserGrid').dxDataGrid('instance');
    var selectedUserRows = UserMasterGrid.getSelectedRowsData();

    document.getElementById("UserName").value = selectedUserRows[0].UserName;
    document.getElementById("Password").value = selectedUserRows[0].Password;
    document.getElementById("REPassword").value = selectedUserRows[0].Password;
    document.getElementById("ContactNO").value = selectedUserRows[0].ContactNo;

    document.getElementById("Password").disabled = true;
    document.getElementById("REPassword").disabled = true;

    $("#SelectBoxUnderUser").dxSelectBox({ value: selectedUserRows[0].UnderUserID });
    $("#SelectBoxDesignation").dxSelectBox({ value: selectedUserRows[0].Designation });
    $("#SelectBoxVendor").dxSelectBox({ value: selectedUserRows[0].VendorID });

    $("#SelectBoxCountry").dxSelectBox({ value: selectedUserRows[0].Country });
    $("#SelectBoxState").dxSelectBox({ value: selectedUserRows[0].State });
    $("#SelectBoxCity").dxSelectBox({ value: selectedUserRows[0].City });

    document.getElementById("EmailID").value = selectedUserRows[0].EmailID;
    document.getElementById("SMTPUserName").value = selectedUserRows[0].smtpUserName;
    document.getElementById("SMTPPassword").value = selectedUserRows[0].smtpUserPassword;
    document.getElementById("RESMTPPassword").value = selectedUserRows[0].smtpUserPassword;
    document.getElementById("SMTPServer").value = selectedUserRows[0].smtpServer;
    document.getElementById("SMTPServerPort").value = selectedUserRows[0].smtpServerPort;
    document.getElementById("TxtMessage").value = selectedUserRows[0].EmailMessage;
    document.getElementById("TxtEmailHeader").value = selectedUserRows[0].HeaderText;
    document.getElementById("TxtEmailFooter").value = selectedUserRows[0].FooterText.replace(/<br >/g,'\n');
    ///////////////////ReSelect operators list
    $("#TxtOperatorID").text(selectedUserRows[0].UserWiseOperatorsIDStr);
    try {
        if (selectedUserRows[0].UserWiseOperatorsIDStr !== "" && selectedUserRows[0].UserWiseOperatorsIDStr !== null) {
            var OpeId = selectedUserRows[0].UserWiseOperatorsIDStr.split(',');
            var ObjOid = [];
            for (var id in OpeId) {
                ObjOid.push(Number(OpeId[id]));
            }
        }
    } catch (e) {
        console.log(e);
    }

    $("#OperatorAllocationGrid").dxDataGrid({
        selectedRowKeys: ObjOid
    });
    ////////

    $("#SelectBoxSMTPAuthenticate").dxSelectBox({
        value: selectedUserRows[0].smtpAuthenticate
    });
    $("#SelectBoxSMTPUseSSL").dxSelectBox({
        value: selectedUserRows[0].smtpUseSSL
    });
    document.getElementById("Details").value = selectedUserRows[0].Details;

    if (selectedUserRows[0].ProfilePicHref === "" || selectedUserRows[0].ProfilePicHref === undefined || selectedUserRows[0].ProfilePicHref === null) {
        document.getElementById("recentimg").src = "images/user22.png";
    }
    else {
        document.getElementById("recentimg").src = selectedUserRows[0].ProfilePicHref;
        document.getElementById("imgpathstringDatabase").value = selectedUserRows[0].ProfilePicHref;
    }
    if (selectedUserRows[0].SignPicHref === "" || selectedUserRows[0].SignPicHref === undefined || selectedUserRows[0].SignPicHref === null) {
        document.getElementById("recentimgsign").src = "images/user22.png";
    }
    else {
        document.getElementById("recentimgsign").src = selectedUserRows[0].SignPicHref;
        document.getElementById("imgpathstringDatabasesign").value = selectedUserRows[0].SignPicHref;
    }
    try {
        document.getElementById("TxtMessage").value = selectedUserRows[0].EmailMessage.replace(/<br >/g, '\n');
        document.getElementById("TxtEmailHeader").value = selectedUserRows[0].HeaderText.replace(/<br >/g, '\n');
        document.getElementById("TxtEmailFooter").value = selectedUserRows[0].FooterText.replace(/<br >/g, '\n');
    } catch (e) {
        //console.log(e);
    }
    //*********************************************
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/showData",
        data: '{ID:' + JSON.stringify(document.getElementById("Userid").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            SectionCount = RES1[0].SectionCount;

            $("#SupportSystemGrid").dxDataGrid({
                dataSource: RES1
            });
        }
    });
    //*********************************************
});

//Delete Data
$("#DeleteButton").click(function () {
    var txtGetGridRow = document.getElementById("UserGetGridRow").value;
    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
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
                url: "WebService_OtherMaster.asmx/DeleteUserMasterData",
                data: '{Userid:' + JSON.stringify(document.getElementById("Userid").value.trim()) + '}',
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
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (res === "Success") {
                        swal("Deleted!", "Your data Deleted", "success");
                        location.reload();
                    } else if (res.includes("not authorized")) {
                        swal("Access Denied...!", res, "warning");
                    } else {
                        swal("Error Occured..!", res, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    // $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(jqXHR);
                }
            });

        });
});

$("#BtnDeletePopUp").click(function () {
    $("#DeleteButton").click();
});

//SaveAs Data On Pop Up
$("#BtnSaveAS").click(function () {
    GblStatus = "";
    $("#BtnSave").click();
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

$("#ProfileTab").click(function () {
    document.getElementById("BtnSave").disabled = "";
    document.getElementById("fotoupload").disabled = "";
    if (GblStatus === "Update") {
        document.getElementById("BtnDeletePopUp").disabled = "";
        document.getElementById("BtnSaveAS").disabled = "";
    }
});

$("#ChangePassTab").click(function () {
    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSave").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;
    document.getElementById("fotoupload").disabled = true;
});

function imagepreview(input) {
    var fileUpload = document.getElementById("fotoupload");
    if (typeof (fileUpload.files) !== "undefined") {
        var size = parseFloat(fileUpload.files[0].size / 1024).toFixed(2);
        //alert(size + " KB.");
        if (size > 300) {
            alert("Your attachment should be less than or equal to 300 kb..!");
            return false;
        }
    }
    if (input.files && input.files[0]) {
        var filerdr = new FileReader();
        filerdr.onload = function (e) {
            $('#recentimg').attr('src', e.target.result);
        };
        filerdr.readAsDataURL(input.files[0]);
    }
}

function imagesignpreview(inputsign) {
    var fileSignUpload = document.getElementById("signupload");
    if (typeof (fileSignUpload.files) !== "undefined") {
        var size = parseFloat(fileSignUpload.files[0].size / 1024).toFixed(2);
        //alert(size + " KB.");
        if (size > 300) {
            alert("Your attachment should be less than or equal to 300 kb..!");
            return false;
        }
    }
    if (inputsign.files && inputsign.files[0]) {
        var filesignrdr = new FileReader();
        filesignrdr.onload = function (e) {
            $('#recentimgsign').attr('src', e.target.result);
        };
        filesignrdr.readAsDataURL(inputsign.files[0]);
    }
}

FillGrid();
function FillGrid() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/GetUser",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\n/g, '<br >');
            res = res.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/":,/g, '":null,');
            res = res.replace(/":}/g, '":null}');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            newArray = { 'AllUser': RES1 };

            document.getElementById("LOADER").style.display = "none";

            $("#UserGrid").dxDataGrid({ dataSource: RES1 });
        }
    });
}

//Country 
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetCountry",
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
        $("#SelectBoxCountry").dxSelectBox({
            items: RES1
        });
    }
});

//State
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetState",
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
        $("#SelectBoxState").dxSelectBox({
            items: RES1
        });
    }
});

//City
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetCity",
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
        $("#SelectBoxCity").dxSelectBox({
            items: RES1
        });
    }
});

var folderimgdel = "";
var folderimgdelsign = "";

$(function () {
    $("#BtnLogModel").click(function () {
        var FilterPermission = GetRecord.filter(function (el) {
            return el.ModuleName === localStorage.getItem('activeTab');
        });

        var ReasionDes = document.getElementById("ReasionDes").value;
        var ReasionUserPassword = document.getElementById("ReasionUserPassword").value;

        if (ReasionDes === "") {
            alert("Please Enter Reasion Description");
            document.getElementById("ReasionDes").focus();
            document.getElementById("ValStrReasionDes").style.fontSize = "10px";
            document.getElementById("ValStrReasionDes").style.display = "block";
            document.getElementById("ValStrReasionDes").innerHTML = 'This field should not be empty..Reasion Description';
            return false;
        }
        else {
            document.getElementById("ValStrReasionDes").style.display = "none";
        }

        if (ReasionUserPassword === "") {
            alert("Please Enter User Password");
            document.getElementById("ReasionUserPassword").focus();
            document.getElementById("ValStrReasionUserPassword").style.fontSize = "10px";
            document.getElementById("ValStrReasionUserPassword").style.display = "block";
            document.getElementById("ValStrReasionUserPassword").innerHTML = 'This field should not be empty..User Password';
            return false;
        }
        else {
            document.getElementById("ValStrReasionUserPassword").style.display = "none";
        }

        if (ReasionUserPassword !== FilterPermission[0].UserID) {
            alert("Please Enter Vailid Password");
            document.getElementById("ReasionUserPassword").focus();
            document.getElementById("ValStrReasionUserPassword").style.fontSize = "10px";
            document.getElementById("ValStrReasionUserPassword").style.display = "block";
            document.getElementById("ValStrReasionUserPassword").innerHTML = 'Enter Vailid Password..User Password';
            return false;
        }
        else {
            document.getElementById("ValStrReasionUserPassword").style.display = "none";
        }

        ProfileParameter();
    });
});

$("#BtnSave").click(function () {

    var UName = document.getElementById("UserName").value.trim();
    var Password = document.getElementById("Password").value.trim();
    var REPassword = document.getElementById("REPassword").value;
    var ContactNO = document.getElementById("ContactNO").value;
    var SelectBoxUnderUser = $('#SelectBoxUnderUser').dxSelectBox('instance').option('value');
    var SelectBoxDesignation = $('#SelectBoxDesignation').dxSelectBox('instance').option('value');
    var EmailID = document.getElementById("EmailID").value;
    var SMTPPassword = document.getElementById("SMTPPassword").value.trim();
    var RESMTPPassword = document.getElementById("RESMTPPassword").value;
    //var CHKCreateuser = document.getElementById("CHKCreateuser").checked;
    //var CHKAdministrativeRights = document.getElementById("CHKAdministrativeRights").checked;
    //var CHKPaperIssue = document.getElementById("CHKPaperIssue").checked;
    //var CHKAnotherPaper = document.getElementById("CHKAnotherPaper").checked;
    //var CHKSeeCost = document.getElementById("CHKSeeCost").checked;
    //var CHKProductionDate = document.getElementById("CHKProductionDate").checked;
    //var CHKHidden = document.getElementById("CHKHidden").checked;
    //var UserProfilePic = document.getElementById("imgpathstring").value;


    if (UName === "") {
        alert("Please Enter User Name");
        document.getElementById("UserName").focus();
        document.getElementById("ValStrUserName").style.fontSize = "10px";
        document.getElementById("ValStrUserName").style.display = "block";
        document.getElementById("ValStrUserName").innerHTML = 'This field should not be empty..User Name';
        return false;
    }
    else {
        document.getElementById("ValStrUserName").style.display = "none";
    }

    existUser = [];
    existUser = newArray.AllUser.filter(function (el) {
        return el.UserName === UName;
    });

    if (GblStatus !== "Update") {
        if (existUser.length > 0 || existUser === undefined) {
            alert("Please enter another user name, This is name already taken..!");
            document.getElementById("ValStrUserName").innerHTML = 'User Name already exist..';
            return false;
        }
        else {
            document.getElementById("ValStrUserName").style.display = "none";
        }
        if (Password !== "") {
            if (Password !== REPassword) {
                document.getElementById("REPassword").focus();
                document.getElementById("ValStrREPassword").style.fontSize = "10px";
                document.getElementById("ValStrREPassword").style.display = "block";
                document.getElementById("ValStrREPassword").innerHTML = 'This field should be Matched..Re Type Password';
                return false;
            }
            else {
                document.getElementById("ValStrREPassword").style.display = "none";
            }
        }
    }

    if (ContactNO === "") {
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.fontSize = "10px";
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = 'This field should not be empty.. Contact NO';
        return false;
    } else if (isNaN(ContactNO)) {
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.fontSize = "10px";
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = 'Please enter numeric number only';
        return false;
    } else if (ContactNO.length < 10 || ContactNO.length > 10) {
        text = "Input only 10 degits valid..";
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = text;
        return false;
    }
    else {
        document.getElementById("ValStrContactNO").style.display = "none";
    }

    if (SelectBoxUnderUser === null || SelectBoxUnderUser === "" || SelectBoxUnderUser === undefined) {
        document.getElementById("ValStrSelectBoxUnderUser").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxUnderUser").style.display = "block";
        document.getElementById("ValStrSelectBoxUnderUser").innerHTML = 'This field should not be empty.. Select under user';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxUnderUser").style.display = "none";
    }

    if (SelectBoxDesignation === null || SelectBoxDesignation === "" || SelectBoxDesignation === undefined) {
        document.getElementById("ValStrSelectBoxDesignation").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxDesignation").style.display = "block";
        document.getElementById("ValStrSelectBoxDesignation").innerHTML = 'This field should not be empty.. Designation';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxDesignation").style.display = "none";
    }

    if (EmailID !== "") {
        if (EmailID.indexOf("@", 0) < 0 || EmailID.indexOf(".", 0) < 0) {
            text = "Please enter valid Email..";
            document.getElementById("EmailID").focus();
            document.getElementById("ValStrEmailID").style.fontSize = "10px";
            document.getElementById("ValStrEmailID").style.display = "block";
            document.getElementById("ValStrEmailID").innerHTML = text;
            return false;
        }
        else {
            document.getElementById("ValStrEmailID").style.display = "none";
        }

        if (SMTPPassword !== "") {
            if (SMTPPassword !== RESMTPPassword) {
                document.getElementById("RESMTPPassword").focus();
                document.getElementById("ValStrRESMTPPassword").style.fontSize = "10px";
                document.getElementById("ValStrRESMTPPassword").style.display = "block";
                document.getElementById("ValStrRESMTPPassword").innerHTML = 'This field should be Matched..Re-Type Password';
                return false;
            }
            else {
                document.getElementById("ValStrRESMTPPassword").style.display = "none";
            }
        }
    }

    document.getElementById("imgpathstring").value = "";

    var fileUpload2 = $("#fotoupload").get(0);
    var files = fileUpload2.files;
    var test = new FormData();

    for (var i = 0; i < files.length; i++) {
        test.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "Handler.ashx",
        type: "POST",
        contentType: false,
        processData: false,
        data: test,
        success: function (result) {
            var imgPath = result;
            document.getElementById("imgpathstring").value = imgPath;

            if (imgPath === "") {
                folderimgdel = "";
                document.getElementById("imgpathstring").value = document.getElementById("imgpathstringDatabase").value;
            }
            else {

                if (document.getElementById("imgpathstringDatabase").value === "" || document.getElementById("imgpathstringDatabase").value === null || document.getElementById("imgpathstringDatabase").value === undefined) {
                    folderimgdel = "StringBlank";
                }
                else {
                    folderimgdel = document.getElementById("imgpathstringDatabase").value;
                }
            }

        }
    });

    document.getElementById("imgpathstringsign").value = "";
    var Photo2;
    var fileSignUpload2 = $("#signupload").get(0);
    var filesign = fileSignUpload2.files;
    var test1 = new FormData();

    for (var j = 0; j < filesign.length; j++) {
        test1.append(filesign[j].name, filesign[j]);
    }
    $.ajax({
        url: "Handler.ashx",
        type: "POST",
        contentType: false,
        processData: false,
        data: test1,
        success: function (result) {
            var imgSignPath = result;
            //alert(imgSignPath);
            document.getElementById("imgpathstringsign").value = imgSignPath;

            if (imgSignPath === "") {
                folderimgdelsign = "";
                document.getElementById("imgpathstringsign").value = document.getElementById("imgpathstringDatabasesign").value;
            }
            else {
                if (document.getElementById("imgpathstringDatabasesign").value === "" || document.getElementById("imgpathstringDatabasesign").value === null || document.getElementById("imgpathstringDatabase").value === undefined) {
                    folderimgdelsign = "StringBlank";
                }
                else {
                    folderimgdelsign = document.getElementById("imgpathstringDatabasesign").value;
                }
            }
            ProfileParameter();
            // $("#EditReasionModel").modal('show');
        },
        error: function (e) {
            console.log(e);
        }
    });
});

function ProfileParameter() {

    var UName = document.getElementById("UserName").value.trim();
    var Password = document.getElementById("Password").value.trim();
    var ContactNO = document.getElementById("ContactNO").value;
    var SelectBoxUnderUser = $('#SelectBoxUnderUser').dxSelectBox('instance').option('value');
    var SelectBoxDesignation = $('#SelectBoxDesignation').dxSelectBox('instance').option('value');
    var EmailID = document.getElementById("EmailID").value;
    var SelectBoxCountry = $('#SelectBoxCountry').dxSelectBox('instance').option('value');
    var SelectBoxState = $('#SelectBoxState').dxSelectBox('instance').option('value');
    var SelectBoxCity = $('#SelectBoxCity').dxSelectBox('instance').option('value');
    var SMTPUserName = document.getElementById("SMTPUserName").value.trim();
    var SMTPPassword = document.getElementById("SMTPPassword").value.trim();
    var RESMTPPassword = document.getElementById("RESMTPPassword").value;
    var SMTPServer = document.getElementById("SMTPServer").value;
    var SMTPServerPort = document.getElementById("SMTPServerPort").value;
    var SelectBoxSMTPAuthenticate = $('#SelectBoxSMTPAuthenticate').dxSelectBox('instance').option('value');
    var SelectBoxSMTPUseSSL = $('#SelectBoxSMTPUseSSL').dxSelectBox('instance').option('value');
    var Details = document.getElementById("Details").value;
    var UserProfilePic = document.getElementById("imgpathstring").value;
    var UserSignPic = document.getElementById("imgpathstringsign").value;
    var SelectBoxVendorID = $("#SelectBoxVendor").dxSelectBox('instance').option('value');

    //var CHKCreateuser = document.getElementById("CHKCreateuser").checked;
    //var CHKAdministrativeRights = document.getElementById("CHKAdministrativeRights").checked;
    //var CHKPaperIssue = document.getElementById("CHKPaperIssue").checked;
    //var CHKAnotherPaper = document.getElementById("CHKAnotherPaper").checked;
    //var CHKSeeCost = document.getElementById("CHKSeeCost").checked;
    //var CHKProductionDate = document.getElementById("CHKProductionDate").checked;
    //var CHKHidden = document.getElementById("CHKHidden").checked;
    //var UserProfilePic = document.getElementById("imgpathstring").value;

    var jsonObjectsUserMasterRecord = [];
    var OperationUserMasterRecord = {};

    OperationUserMasterRecord.UserName = UName;
    if (GblStatus !== "Update") { OperationUserMasterRecord.Password = Password; }
    OperationUserMasterRecord.ContactNo = ContactNO;
    OperationUserMasterRecord.UnderUserID = SelectBoxUnderUser;
    OperationUserMasterRecord.Designation = SelectBoxDesignation;
    OperationUserMasterRecord.EmailID = EmailID;
    OperationUserMasterRecord.Country = SelectBoxCountry;
    OperationUserMasterRecord.State = SelectBoxState;
    OperationUserMasterRecord.City = SelectBoxCity;

    OperationUserMasterRecord.smtpUserName = SMTPUserName;
    OperationUserMasterRecord.smtpUserPassword = SMTPPassword;
    OperationUserMasterRecord.smtpServer = SMTPServer;
    OperationUserMasterRecord.smtpServerPort = SMTPServerPort;
    OperationUserMasterRecord.smtpAuthenticate = SelectBoxSMTPAuthenticate;
    OperationUserMasterRecord.smtpUseSSL = SelectBoxSMTPUseSSL;
    OperationUserMasterRecord.Details = Details;

    OperationUserMasterRecord.ProfilePicHref = UserProfilePic;//document.getElementById("imgpathstring").value=ProfilePicHref;
    OperationUserMasterRecord.SignPicHref = UserSignPic;
    OperationUserMasterRecord.UserWiseOperatorsIDStr = $("#TxtOperatorID").text(); ///Added by pKp on 22-08-19

    OperationUserMasterRecord.EmailMessage = document.getElementById("TxtMessage").value;
    OperationUserMasterRecord.HeaderText = document.getElementById("TxtEmailHeader").value;
    OperationUserMasterRecord.FooterText = document.getElementById("TxtEmailFooter").value;
    OperationUserMasterRecord.VendorID = SelectBoxVendorID;

    jsonObjectsUserMasterRecord.push(OperationUserMasterRecord);

    /////////User Operator allocation Added by pKp on 22-08-19
    try {
        var ObjArrOperatorAllocation = [];
        var ObjOperatorAllocation = {};
        var GridOperators = $("#OperatorAllocationGrid").dxDataGrid('instance');
        var ObjOid = [];
        if (OperationUserMasterRecord.UserWiseOperatorsIDStr !== "") {
            var OpeId = OperationUserMasterRecord.UserWiseOperatorsIDStr.split(',');
            for (var id in OpeId) {
                ObjOid.push(OpeId[id]);
            }
        }
    } catch (e) {
        console.log(e);
    }

    for (var i = 0; i < GridOperators._options.dataSource.length; i++) {
        for (var j = 0; j < ObjOid.length; j++) {
            if (Number(ObjOid[j]) === GridOperators._options.dataSource[i].LedgerID) {
                ObjOperatorAllocation = {};
                ObjOperatorAllocation.OperatorID = GridOperators._options.dataSource[i].LedgerID;
                ObjOperatorAllocation.OperatorName = GridOperators._options.dataSource[i].LedgerName;
                ObjArrOperatorAllocation.push(ObjOperatorAllocation);
            }
        }
    }

    ///////
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
                    url: "WebService_OtherMaster.asmx/UpdatUserMasterData",
                    data: '{CostingDataUserMaster:' + JSON.stringify(jsonObjectsUserMasterRecord) + ',TxtUserid:' + JSON.stringify(document.getElementById("Userid").value.trim()) + ',folderimgdel:' + JSON.stringify(folderimgdel) + ',folderimgdelsign:' + JSON.stringify(folderimgdelsign) + ',OperatorAllocation:' + JSON.stringify(ObjArrOperatorAllocation) + '}',
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
                        else if (res.includes("not authorized")) {
                            swal("Access Denied...!", res, "warning");
                        }
                        else if (res === "Exist") {
                            swal("Duplicate...!", "This User Name already Exist..\n Please enter another User Name..", "");
                        } else {
                            swal("Error Occured..!", res, "error");
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
                    url: "WebService_OtherMaster.asmx/SaveUserData",
                    data: '{CostingDataUserMaster:' + JSON.stringify(jsonObjectsUserMasterRecord) + ',OperatorAllocation:' + JSON.stringify(ObjArrOperatorAllocation) + '}',
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
                            swal("Duplicate...!", "This User Name already Exist..\n Please enter another User Name..", "");
                        }
                        else if (res.includes("not authorized")) {
                            swal("Access Denied...!", res, "warning");
                        } else {
                            swal("Error Occured..!", res, "error");
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

function BlankField() {
    document.getElementById("UserName").value = "";
    document.getElementById("Password").value = "";
    document.getElementById("REPassword").value = "";
    document.getElementById("ContactNO").value = "";

    $("#SelectBoxUnderUser").dxSelectBox({ value: null });
    $("#SelectBoxDesignation").dxSelectBox({ value: null });

    document.getElementById("EmailID").value = "";

    $("#SelectBoxCountry").dxSelectBox({ value: null });
    $("#SelectBoxState").dxSelectBox({ value: null });
    $("#SelectBoxCity").dxSelectBox({ value: null });

    $("#SelectBoxVendor").dxSelectBox({ value: null });
    document.getElementById("SMTPUserName").value = "";
    document.getElementById("SMTPPassword").value = "";
    document.getElementById("RESMTPPassword").value = "";
    document.getElementById("SMTPServer").value = "";
    document.getElementById("SMTPServerPort").value = "";

    $("#SelectBoxSMTPAuthenticate").dxSelectBox({
        value: ""
    });
    $("#SelectBoxSMTPUseSSL").dxSelectBox({
        value: ""
    });
    document.getElementById("Details").value = "";

    //document.getElementById("CHKCreateuser").checked = false;
    //document.getElementById("CHKAdministrativeRights").checked = false;
    //document.getElementById("CHKPaperIssue").checked = false;
    //document.getElementById("CHKAnotherPaper").checked = false;
    //document.getElementById("CHKSeeCost").checked = false;
    //document.getElementById("CHKProductionDate").checked = false;
    //document.getElementById("CHKHidden").checked = false;

    document.getElementById("imgpathstringDatabase").value = "";
    document.getElementById("recentimg").src = "images/user22.png";
    document.getElementById("imgpathstringDatabasesign").value = "";
    document.getElementById("recentimgsign").src = "images/user22.png";


    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;

    //document.getElementById("LblName").innerHTML = "";
    //document.getElementById("LblUnderUser").innerHTML = "";
    //document.getElementById("LblEmail").innerHTML = "";
    //document.getElementById("LblCity").innerHTML = "";
    //document.getElementById("LblState").innerHTML = "";
    //document.getElementById("LblCountry").innerHTML = "";
    //document.getElementById("LblMobNo").innerHTML = "";

    document.getElementById("BtnSave").disabled = "";
}

//Password Change
$("#SavePassword").click(function () {

    var NewPassword = $('#password1').dxTextBox('instance').option('value');
    var NewPasswordAgain = $('#password2').dxTextBox('instance').option('value');
    console.log(NewPassword);
    console.log(NewPasswordAgain);
    if (NewPassword === "") {
        alert("Please Enter New Password");
        document.getElementById("NewPassword").focus();
        document.getElementById("ValStrNewPassword").style.fontSize = "10px";
        document.getElementById("ValStrNewPassword").style.display = "block";
        document.getElementById("ValStrNewPassword").innerHTML = 'This field should not be empty..New Password';
        return false;
    }
    else {
        document.getElementById("ValStrNewPassword").style.display = "none";
    }

    if (NewPasswordAgain === "") {
        alert("Please Enter New Password Again");
        document.getElementById("NewPasswordAgain").focus();
        document.getElementById("ValStrNewPasswordAgain").style.fontSize = "10px";
        document.getElementById("ValStrNewPasswordAgain").style.display = "block";
        document.getElementById("ValStrNewPasswordAgain").innerHTML = 'This field should not be empty..New Password Again';
        return false;
    }
    else {
        document.getElementById("ValStrNewPasswordAgain").style.display = "none";
    }

    if (NewPassword !== NewPasswordAgain) {
        alert("Please Re-Enter Password");
        document.getElementById("NewPasswordAgain").focus();
        document.getElementById("ValStrNewPasswordAgain").style.fontSize = "10px";
        document.getElementById("ValStrNewPasswordAgain").style.display = "block";
        document.getElementById("ValStrNewPasswordAgain").innerHTML = 'This field should be Matched..Re Type Password';
        return false;
    }
    else {
        document.getElementById("ValStrNewPasswordAgain").style.display = "none";
    }

    var txt = 'Do you want to change paswword please click on \n' + 'Yes, Change it ! \n' + 'otherwise click on \n' + 'Cancel';
    swal({
        title: "Do you want to continue",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Change it !",
        closeOnConfirm: true
    },
        function () {
            document.getElementById("LOADER").style.display = "block";
            $.ajax({
                type: "POST",
                url: "WebService_OtherMaster.asmx/UpdatePasswordData",
                data: '{TxtUserid:' + JSON.stringify(document.getElementById("Userid").value.trim()) + ',NewPassword:' + JSON.stringify(NewPassword) + '}',
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
                        swal("Saved..!", "Your Password Updated", "success");
                        location.reload();
                    } else {
                        swal("Error..", res, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });
        }
    );
});

var optAdd = {};
var UserData = [];
var all = 'All';
var ProvidedRowIndex = 1;

var GblObject;
$("#btn-save").click(function () {

    var jsonObjectsRecordDetail = [];
    var OperationRecordDetail = {};
    var User_ID = document.getElementById("Userid").value;

    var SupportSystemGrid = $('#SupportSystemGrid').dxDataGrid('instance');
    var ItemGridRow = SupportSystemGrid._options.dataSource.length;

    if (ItemGridRow > 0) {
        for (var t = 0; t < ItemGridRow; t++) {
            OperationRecordDetail = {};
            OperationRecordDetail.ModuleID = SupportSystemGrid._options.dataSource[t].ModuleID;
            OperationRecordDetail.ModuleName = SupportSystemGrid._options.dataSource[t].ModuleName;
            OperationRecordDetail.CanView = SupportSystemGrid._options.dataSource[t].CanView;
            OperationRecordDetail.CanSave = SupportSystemGrid._options.dataSource[t].CanSave;
            OperationRecordDetail.CanEdit = SupportSystemGrid._options.dataSource[t].CanEdit;
            OperationRecordDetail.CanDelete = SupportSystemGrid._options.dataSource[t].CanDelete;
            OperationRecordDetail.CanExport = SupportSystemGrid._options.dataSource[t].CanExport;
            OperationRecordDetail.CanPrint = SupportSystemGrid._options.dataSource[t].CanPrint;
            jsonObjectsRecordDetail.push(OperationRecordDetail);
        }
        var RecordDetail = JSON.stringify(jsonObjectsRecordDetail);

        $.ajax({
            type: "POST",
            url: "UserAuthentication.asmx/InsertFun",
            data: '{jsonObjectsRecordDetail:' + RecordDetail + ' , User_ID:' + JSON.stringify(User_ID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                if (RES1 === "Success") {
                    swal(RES1, "Data successfully saved...", "success");
                    location.reload();
                }
                else {
                    swal("Error..", res, "warning");
                }
            }
        });
    }
    else {
        alert("Please Choose any record..!");
        return false;
    }
});

