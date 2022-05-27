
var GblStatus = "";

var existUser = [];
var newArray = [];

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
            //console.debug(results);
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            newArray = [];
            newArray = { 'AllUser': RES1 };

            document.getElementById("LOADER").style.display = "none";
            $("#UserGrid").dxDataGrid({
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
                    fileName: "User master",
                    allowExportSelectedData: true,
                },
                onRowPrepared: function (e) {
                    if (e.rowType === "header") {
                        e.rowElement.css('background', '#42909A');
                        e.rowElement.css('color', 'white');
                    }
                    e.rowElement.css('fontSize', '11px');
                },

                onCellClick: function (e) {
                    var grid = $('#UserGrid').dxDataGrid('instance');
                    if (e.row === undefined || e.rowType === "filter" || e.rowType === "header") return false;
                    var Row = e.row.rowIndex;
                    var Col = e.columnIndex;

                    document.getElementById("UserGetGridRow").value = "";
                    document.getElementById("UserGetGridRow").value = Row;

                    document.getElementById("Userid").value = "";
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
                    { dataField: "UserID", visible: false, caption: "UserID", },
                    { dataField: "Password", visible: false, caption: "Password", },
                    { dataField: "smtpUserPassword", visible: false, caption: "smtpUserPassword", },
                    { dataField: "ProfilePicHref", visible: false, caption: "ProfilePicHref", },
                    { dataField: "UnderUserID", visible: false, caption: "UnderUserID", },
                    { dataField: "UserName", visible: true, caption: "User Name" },
                    { dataField: "ContactNo", visible: true, caption: "ContactNo", },
                    { dataField: "Designation", visible: true, caption: "Designation", },
                    { dataField: "EmailID", visible: true, caption: "EmailID", },
                    { dataField: "Country", visible: true, caption: "Country", },
                    { dataField: "State", visible: true, caption: "State", },
                    { dataField: "City", visible: true, caption: "City", },
                    { dataField: "smtpUserName", visible: true, caption: "smtpUserName", },
                    { dataField: "smtpServer", visible: true, caption: "smtpServer", },
                    { dataField: "smtpServerPort", visible: true, caption: "smtpServerPort", },
                    { dataField: "smtpAuthenticate", visible: true, caption: "smtpAuthenticate", },
                    { dataField: "smtpUseSSL", visible: true, caption: "smtpUseSSL", },
                    { dataField: "Details", visible: true, caption: "Details", },
                    { dataField: "IsCreateUser", visible: true, caption: "IsCreateUser", },
                    { dataField: "IsExtraPaperIssue", visible: true, caption: "IsExtraPaperIssue", },
                    { dataField: "IsUserCannotViewCostingDetail", visible: true, caption: "IsUserCannotViewCostingDetail", },
                    { dataField: "IsHidden", visible: true, caption: "IsHidden", },
                    { dataField: "IsAdmin", visible: true, caption: "IsAdmin", },
                    { dataField: "ISChooseAnotherPaper", visible: true, caption: "ISChooseAnotherPaper", },
                    { dataField: "IsEditableProductionDate", visible: true, caption: "IsEditableProductionDate", },
                ]

            });
        }
    });
}

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
            items: RES1,
            placeholder: "Select--",
            displayExpr: 'UserName',
            valueExpr: 'UserID',
            searchEnabled: true,
            showClearButton: true,
            onValueChanged: function (data) {
                document.getElementById("LblUnderUser").innerHTML = $('#SelectBoxUnderUser').dxSelectBox('instance').option('text');
            }
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
                items: desiString,
                placeholder: "Select--",
                //displayExpr: 'UserName',               
                searchEnabled: true,
                showClearButton: true,
                acceptCustomValue: true,
            });
        }
    });
}
//Creation of Field on Popup
$("#CreateButton").click(function () {
    GblStatus = "";

    $("#BtnNew").click();

    document.getElementById("ChangePassTab").style.display = "none";

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#EditButton").click(function () {

    GblStatus = "Update";
    BlankField();
    document.getElementById("BtnDeletePopUp").disabled = "";
    document.getElementById("BtnSaveAS").disabled = "";

    var txtGetGridRow = document.getElementById("UserGetGridRow").value;
    if (txtGetGridRow === "" || txtGetGridRow === null || txtGetGridRow === undefined) {
        alert("Please Choose any row from below Grid..!");
        return false;
    }

    document.getElementById("ChangePassTab").style.display = "block";

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    var UserMasterGrid = $('#UserGrid').dxDataGrid('instance');
    var selectedUserRows = UserMasterGrid.getSelectedRowsData();

    document.getElementById("UserName").value = selectedUserRows[0].UserName;
    document.getElementById("Password").value = selectedUserRows[0].Password;
    document.getElementById("REPassword").value = selectedUserRows[0].Password;
    document.getElementById("ContactNO").value = selectedUserRows[0].ContactNo;

    $("#SelectBoxUnderUser").dxSelectBox({
        value: selectedUserRows[0].UnderUserID,
    });
    $("#SelectBoxDesignation").dxSelectBox({
        value: selectedUserRows[0].Designation,
    });

    document.getElementById("EmailID").value = selectedUserRows[0].EmailID;

    $("#SelectBoxCountry").dxSelectBox({
        value: selectedUserRows[0].Country,
    });
    $("#SelectBoxState").dxSelectBox({
        value: selectedUserRows[0].State,
    });
    $("#SelectBoxCity").dxSelectBox({
        value: selectedUserRows[0].City,
    });

    document.getElementById("SMTPUserName").value = selectedUserRows[0].smtpUserName;
    document.getElementById("SMTPPassword").value = selectedUserRows[0].smtpUserPassword;
    document.getElementById("RESMTPPassword").value = selectedUserRows[0].smtpUserPassword;
    document.getElementById("SMTPServer").value = selectedUserRows[0].smtpServer;
    document.getElementById("SMTPServerPort").value = selectedUserRows[0].smtpServerPort;

    $("#SelectBoxSMTPAuthenticate").dxSelectBox({
        value: selectedUserRows[0].smtpAuthenticate,
    });
    $("#SelectBoxSMTPUseSSL").dxSelectBox({
        value: selectedUserRows[0].smtpUseSSL,
    });
    document.getElementById("Details").value = selectedUserRows[0].Details;

    document.getElementById("CHKCreateuser").checked = selectedUserRows[0].IsCreateUser;
    document.getElementById("CHKAdministrativeRights").checked = selectedUserRows[0].IsAdmin;
    document.getElementById("CHKPaperIssue").checked = selectedUserRows[0].IsExtraPaperIssue;
    document.getElementById("CHKAnotherPaper").checked = selectedUserRows[0].ISChooseAnotherPaper;
    document.getElementById("CHKSeeCost").checked = selectedUserRows[0].IsUserCannotViewCostingDetail;
    document.getElementById("CHKProductionDate").checked = selectedUserRows[0].IsEditableProductionDate;
    document.getElementById("CHKHidden").checked = selectedUserRows[0].IsHidden;

    if (selectedUserRows[0].ProfilePicHref === "" || selectedUserRows[0].ProfilePicHref === undefined || selectedUserRows[0].ProfilePicHref === null) {
        document.getElementById("recentimg").src = "images/user22.png";
    }
    else {
        document.getElementById("recentimg").src = selectedUserRows[0].ProfilePicHref;
        document.getElementById("imgpathstringDatabase").value = selectedUserRows[0].ProfilePicHref;
    }

    document.getElementById("LblName").innerHTML = selectedUserRows[0].UserName;
    document.getElementById("LblUnderUser").innerHTML = $('#SelectBoxUnderUser').dxSelectBox('instance').option('text');
    document.getElementById("LblEmail").innerHTML = selectedUserRows[0].EmailID;
    document.getElementById("LblCity").innerHTML = selectedUserRows[0].City;
    document.getElementById("LblState").innerHTML = selectedUserRows[0].State;
    document.getElementById("LblCountry").innerHTML = selectedUserRows[0].Country;
    document.getElementById("LblMobNo").innerHTML = selectedUserRows[0].ContactNo;
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
                        // alert("Your Data has been Saved Successfully...!");
                        location.reload();
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
        }
        filerdr.readAsDataURL(input.files[0]);
    }
}

function ChangeEvent(val) {
    if (GblStatus !== "Update") {
        if (val.id === "UserName") {
            document.getElementById("LblName").innerHTML = document.getElementById(val.id).value;
        }
        else if (val.id === "EmailID") {
            document.getElementById("LblEmail").innerHTML = document.getElementById(val.id).value;
        }
        else if (val.id === "ContactNO") {
            document.getElementById("LblMobNo").innerHTML = document.getElementById(val.id).value;
        }
    }
}

var Authenticate = ["True", "False"]
$("#SelectBoxSMTPAuthenticate").dxSelectBox({
    items: Authenticate,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true,
    //acceptCustomValue: true,
});

var SMTPUseSSL = ["True", "False"]
$("#SelectBoxSMTPUseSSL").dxSelectBox({
    items: SMTPUseSSL,
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true,
    //acceptCustomValue: true,
});

//Country 
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetCountry",
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
        $("#SelectBoxCountry").dxSelectBox({
            items: RES1,
            placeholder: "Select--",
            displayExpr: 'Country',
            valueExpr: 'Country',
            searchEnabled: true,
            showClearButton: true,
            //acceptCustomValue: true,
            onValueChanged: function (data) {
                var SelectedData = "";
                document.getElementById("LblCountry").innerHTML = data.value;
            }
        });
    },
});

//State
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetState",
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
        $("#SelectBoxState").dxSelectBox({
            items: RES1,
            placeholder: "Select--",
            displayExpr: 'State',
            valueExpr: 'State',
            searchEnabled: true,
            showClearButton: true,
            //acceptCustomValue: true,
            onValueChanged: function (data) {
                var SelectedData = "";
                document.getElementById("LblState").innerHTML = data.value;
            }
        });
    },
});

//City
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/GetCity",
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
        $("#SelectBoxCity").dxSelectBox({
            items: RES1,
            placeholder: "Select--",
            displayExpr: 'City',
            valueExpr: 'City',
            searchEnabled: true,
            showClearButton: true,
            //acceptCustomValue: true,
            onValueChanged: function (data) {
                var SelectedData = "";
                document.getElementById("LblCity").innerHTML = data.value;
            }
        });
    },
});

var folderimgdel = "";
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
        if (existUser !== "" && existUser !== []) {
            alert("Please Enter another User Name..This is Allready exist..!");
            document.getElementById("ValStrUserName").innerHTML = 'User Name allready exist..';
            return false;
        }
        else {
            document.getElementById("ValStrUserName").style.display = "none";
        }
    }

    if (Password !== REPassword) {
        alert("Please Re-Enter Password");
        document.getElementById("REPassword").focus();
        document.getElementById("ValStrREPassword").style.fontSize = "10px";
        document.getElementById("ValStrREPassword").style.display = "block";
        document.getElementById("ValStrREPassword").innerHTML = 'This field should be Matched..Re Type Password';
        return false;
    }
    else {
        document.getElementById("ValStrREPassword").style.display = "none";
    }

    if (Password === "") {
        alert("Please Enter Password");
        document.getElementById("Password").focus();
        document.getElementById("ValStrPassword").style.fontSize = "10px";
        document.getElementById("ValStrPassword").style.display = "block";
        document.getElementById("ValStrPassword").innerHTML = 'This field should not be empty..Password';
        return false;
    }
    else {
        document.getElementById("ValStrPassword").style.display = "none";
    }

    if (ContactNO === "") {
        alert("Please Enter Contact NO");
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.fontSize = "10px";
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = 'This field should not be empty.. Contact NO';
        return false;
    }
    else if (ContactNO.length < 10 || ContactNO.length > 10) {
        text = "Input Only 10 degits valid..";
        alert("Input Only 10 degits valid..");
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = text;
        return false;
    }
    else {
        document.getElementById("ValStrContactNO").style.display = "none";
    }

    if (isNaN(ContactNO)) {
        alert("Please Enter numeric Contact NO");
        document.getElementById("ContactNO").focus();
        document.getElementById("ValStrContactNO").style.fontSize = "10px";
        document.getElementById("ValStrContactNO").style.display = "block";
        document.getElementById("ValStrContactNO").innerHTML = 'This field should not be empty..numeric Contact NO';
        return false;
    }
    else {
        document.getElementById("ValStrContactNO").style.display = "none";
    }


    if (SelectBoxUnderUser === null || SelectBoxUnderUser === "" || SelectBoxUnderUser === undefined) {
        alert("Please select..Select Under User");
        document.getElementById("ValStrSelectBoxUnderUser").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxUnderUser").style.display = "block";
        document.getElementById("ValStrSelectBoxUnderUser").innerHTML = 'This field should not be empty..Select Under User';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxUnderUser").style.display = "none";
    }

    if (SelectBoxDesignation === null || SelectBoxDesignation === "" || SelectBoxDesignation === undefined) {
        alert("Please select..Select Designation");
        document.getElementById("ValStrSelectBoxDesignation").style.fontSize = "10px";
        document.getElementById("ValStrSelectBoxDesignation").style.display = "block";
        document.getElementById("ValStrSelectBoxDesignation").innerHTML = 'This field should not be empty.. Designation';
        return false;
    }
    else {
        document.getElementById("ValStrSelectBoxDesignation").style.display = "none";
    }

    if (EmailID === "") {
        alert("Please Enter EmailID");
        document.getElementById("EmailID").focus();
        document.getElementById("ValStrEmailID").style.fontSize = "10px";
        document.getElementById("ValStrEmailID").style.display = "block";
        document.getElementById("ValStrEmailID").innerHTML = 'This field should not be empty..EmailID';
        return false;
    }
    else {
        document.getElementById("ValStrEmailID").style.display = "none";
    }

    if (EmailID.indexOf("@", 0) < 0) {
        text = "Please enter valid Email..";
        alert(text);
        document.getElementById("EmailID").focus();
        document.getElementById("ValStrEmailID").style.fontSize = "10px";
        document.getElementById("ValStrEmailID").style.display = "block";
        document.getElementById("ValStrEmailID").innerHTML = text;
        return false;
    }
    else if (EmailID.indexOf(".", 0) < 0) {
        text = "Please enter valid Email..";
        alert(text);
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
            alert("Please Re-Enter Password");
            document.getElementById("RESMTPPassword").focus();
            document.getElementById("ValStrRESMTPPassword").style.fontSize = "10px";
            document.getElementById("ValStrRESMTPPassword").style.display = "block";
            document.getElementById("ValStrRESMTPPassword").innerHTML = 'This field should be Matched..Re Type Password';
            return false;
        }
        else {
            document.getElementById("ValStrRESMTPPassword").style.display = "none";
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
            imgPath = result;
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
            ProfileParameter();
        }
    });
});

function ProfileParameter() {
    var UName = document.getElementById("UserName").value.trim();
    var Password = document.getElementById("Password").value.trim();
    var REPassword = document.getElementById("REPassword").value;
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

    var CHKCreateuser = document.getElementById("CHKCreateuser").checked;
    var CHKAdministrativeRights = document.getElementById("CHKAdministrativeRights").checked;
    var CHKPaperIssue = document.getElementById("CHKPaperIssue").checked;
    var CHKAnotherPaper = document.getElementById("CHKAnotherPaper").checked;
    var CHKSeeCost = document.getElementById("CHKSeeCost").checked;
    var CHKProductionDate = document.getElementById("CHKProductionDate").checked;
    var CHKHidden = document.getElementById("CHKHidden").checked;
    var UserProfilePic = document.getElementById("imgpathstring").value;



    var jsonObjectsUserMasterRecord = [];
    var OperationUserMasterRecord = {};

    OperationUserMasterRecord.UserName = UName;
    OperationUserMasterRecord.Password = Password;
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

    OperationUserMasterRecord.IsCreateUser = CHKCreateuser;
    OperationUserMasterRecord.IsExtraPaperIssue = CHKPaperIssue;
    OperationUserMasterRecord.IsUserCannotViewCostingDetail = CHKSeeCost;
    OperationUserMasterRecord.IsHidden = CHKHidden;
    OperationUserMasterRecord.IsAdmin = CHKAdministrativeRights;
    OperationUserMasterRecord.ISChooseAnotherPaper = CHKAnotherPaper;
    OperationUserMasterRecord.IsEditableProductionDate = CHKProductionDate;
    OperationUserMasterRecord.ProfilePicHref = UserProfilePic;//document.getElementById("imgpathstring").value=ProfilePicHref;

    jsonObjectsUserMasterRecord.push(OperationUserMasterRecord);

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
                    data: '{CostingDataUserMaster:' + JSON.stringify(jsonObjectsUserMasterRecord) + ',TxtUserid:' + JSON.stringify(document.getElementById("Userid").value.trim()) + ',folderimgdel:' + JSON.stringify(folderimgdel) + '}',
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
                            swal("Duplicate!", "This User Name allready Exist..\n Please enter another User Name..", "");
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
                    data: '{CostingDataUserMaster:' + JSON.stringify(jsonObjectsUserMasterRecord) + '}',
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

            };

        });

}

function BlankField() {
    document.getElementById("UserName").value = "";
    document.getElementById("Password").value = "";
    document.getElementById("REPassword").value = "";
    document.getElementById("ContactNO").value = "";

    $("#SelectBoxUnderUser").dxSelectBox({
        value: "",
    });
    $("#SelectBoxDesignation").dxSelectBox({
        value: "",
    });

    document.getElementById("EmailID").value = "";

    $("#SelectBoxCountry").dxSelectBox({
        value: "",
    });
    $("#SelectBoxState").dxSelectBox({
        value: "",
    });
    $("#SelectBoxCity").dxSelectBox({
        value: "",
    });

    document.getElementById("SMTPUserName").value = "";
    document.getElementById("SMTPPassword").value = "";
    document.getElementById("RESMTPPassword").value = "";
    document.getElementById("SMTPServer").value = "";
    document.getElementById("SMTPServerPort").value = "";

    $("#SelectBoxSMTPAuthenticate").dxSelectBox({
        value: "",
    });
    $("#SelectBoxSMTPUseSSL").dxSelectBox({
        value: "",
    });
    document.getElementById("Details").value = "";

    document.getElementById("CHKCreateuser").checked = false;
    document.getElementById("CHKAdministrativeRights").checked = false;
    document.getElementById("CHKPaperIssue").checked = false;
    document.getElementById("CHKAnotherPaper").checked = false;
    document.getElementById("CHKSeeCost").checked = false;
    document.getElementById("CHKProductionDate").checked = false;
    document.getElementById("CHKHidden").checked = false;

    document.getElementById("imgpathstringDatabase").value = "";
    document.getElementById("recentimg").src = "images/user22.png";

    document.getElementById("BtnDeletePopUp").disabled = true;
    document.getElementById("BtnSaveAS").disabled = true;

    document.getElementById("LblName").innerHTML = "";
    document.getElementById("LblUnderUser").innerHTML = "";
    document.getElementById("LblEmail").innerHTML = "";
    document.getElementById("LblCity").innerHTML = "";
    document.getElementById("LblState").innerHTML = "";
    document.getElementById("LblCountry").innerHTML = "";
    document.getElementById("LblMobNo").innerHTML = "";

    document.getElementById("BtnSave").disabled = "";
}

//Password Change
$("#SavePassword").click(function () {
    var NewPassword = document.getElementById("NewPassword").value.trim();
    var NewPasswordAgain = document.getElementById("NewPasswordAgain").value.trim();

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
        closeOnConfirm: false
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
                        swal("Saved!", "Your Password Updated", "success");
                        location.reload();
                    }

                },
                error: function errorFunc(jqXHR) {
                    document.getElementById("LOADER").style.display = "none";
                    swal("Error!", "Please try after some time..", "");
                }
            });
        }
    )

});