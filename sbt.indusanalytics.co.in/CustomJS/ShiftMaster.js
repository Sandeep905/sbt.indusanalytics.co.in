
var GblStatus = "", sholistData = [];
var ShiftDay = ["am", "pm"];

$("#SelShiftDay").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,
    //onValueChanged: function (e) {
    //    if (e.value !== "" && e.value !== undefined && e.value !== null) {
    //        calculateWorkingMin()
    //    }
    //}
});

$("#SelShiftDayTo").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,
    //onValueChanged: function (e) {
    //    if (e.value !== "" && e.value !== undefined && e.value !== null) {
    //        calculateWorkingMin()
    //    }
    //}
});

$("#SelShiftDay_Lunch").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,
    //onValueChanged: function (e) {
    //    if (e.value !== "" && e.value !== undefined && e.value !== null) {
    //        calculateWorkingMin_Lunch()
    //    }
    //}
});

$("#SelShiftDayTo_Lunch").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,
    //onValueChanged: function (e) {
    //    if (e.value !== "" && e.value !== undefined && e.value !== null) {
    //        calculateWorkingMin_Lunch()
    //    }
    //}
});

var ShiftStatus = ["Working Hours", "Lunch Time", "Tea Time", "Other Time"]
$("#SelStatus").dxSelectBox({
    items: ShiftStatus,
    placeholder: "Status--",
    searchEnabled: true,
});

$("#CreateButton").click(function () {
    GblStatus = "";
    BlankField();
    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#BtnNew").click(function () {
    BlankField()
});

$("#BtnSave").click(function () {
    var TxtShiftName = document.getElementById("TxtShiftName").value;

    var TxtFromHr = document.getElementById("TxtFromHr").value;
    var TxtFromMin = document.getElementById("TxtFromMin").value;
    var SelShiftDay = $("#SelShiftDay").dxSelectBox('instance').option('value');
    var TxtToHr = document.getElementById("TxtToHr").value;
    var TxtToMin = document.getElementById("TxtToMin").value;
    var SelShiftDayTo = $("#SelShiftDayTo").dxSelectBox('instance').option('value');
    var SelStatus = $("#SelStatus").dxSelectBox('instance').option('value');

    var TxtNarration = document.getElementById("TxtNarration").value;

    if (TxtShiftName == "" || TxtShiftName == undefined || TxtShiftName == null) {
        DevExpress.ui.notify("Please enter Shift name...!", "error", 1000);
        var text = "Please enter Shift name...!";
        document.getElementById("TxtShiftName").value = "";
        document.getElementById("TxtShiftName").focus();
        document.getElementById("TxtShiftName").style.borderColor = "red";
        document.getElementById("ValStrTxtShiftName").style.display = "block";
        document.getElementById("ValStrTxtShiftName").innerHTML = text;
        return false;
    } else {
        document.getElementById("TxtShiftName").style.borderColor = "";
        document.getElementById("ValStrTxtShiftName").style.display = "none";
    }

    if (TxtFromHr == "" || TxtFromHr == undefined || TxtFromHr == null) {
        DevExpress.ui.notify("Please enter Shift To hour...!", "error", 1000);
        var text = "Please enter Shift To hour...!";
        document.getElementById("TxtFromHr").value = "";
        document.getElementById("TxtFromHr").focus();
        document.getElementById("TxtFromHr").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeFrom").style.display = "block";
        document.getElementById("ValStrShiftTimeFrom").innerHTML = text;
        return false;
    } else {
        document.getElementById("TxtFromHr").style.borderColor = "";
        document.getElementById("ValStrShiftTimeFrom").style.display = "none";
    }

    if (TxtFromMin == "" || TxtFromMin == undefined || TxtFromMin == null) {
        DevExpress.ui.notify("Please enter Shift To min.  ...!", "error", 1000);
        var text = "Please enter Shift To min. ...!";
        document.getElementById("TxtFromMin").value = "";
        document.getElementById("TxtFromMin").focus();
        document.getElementById("TxtFromMin").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeFrom").style.display = "block";
        document.getElementById("ValStrShiftTimeFrom").innerHTML = text;
        return false;
    } else {
        document.getElementById("TxtFromMin").style.borderColor = "";
        document.getElementById("ValStrShiftTimeFrom").style.display = "none";
    }
    if (SelShiftDay == "" || SelShiftDay == undefined || SelShiftDay == null) {
        DevExpress.ui.notify("Please enter Shift From hour...!", "error", 1000);
        var text = "Please enter Shift From hour...!";
        document.getElementById("SelShiftDay").focus();
        document.getElementById("SelShiftDay").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeFrom").style.display = "block";
        document.getElementById("ValStrShiftTimeFrom").innerHTML = text;
        return false;
    } else {
        document.getElementById("SelShiftDay").style.borderColor = "";
        document.getElementById("ValStrShiftTimeFrom").style.display = "none";
    }

    if (TxtToHr == "" || TxtToHr == undefined || TxtToHr == null) {
        DevExpress.ui.notify("Please enter Shift To hour...!", "error", 1000);
        var text = "Please enter Shift To hour...!";
        document.getElementById("TxtToHr").value = "";
        document.getElementById("TxtToHr").focus();
        document.getElementById("TxtToHr").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeTo").style.display = "block";
        document.getElementById("ValStrShiftTimeTo").innerHTML = text;
        return false;
    } else {
        document.getElementById("TxtToHr").style.borderColor = "";
        document.getElementById("ValStrShiftTimeTo").style.display = "none";
    }

    if (TxtToMin == "" || TxtToMin == undefined || TxtToMin == null) {
        DevExpress.ui.notify("Please enter Shift To min.  ...!", "error", 1000);
        var text = "Please enter Shift To min. ...!";
        document.getElementById("TxtToMin").value = "";
        document.getElementById("TxtToMin").focus();
        document.getElementById("TxtToMin").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeTo").style.display = "block";
        document.getElementById("ValStrShiftTimeTo").innerHTML = text;
        return false;
    } else {
        document.getElementById("TxtToMin").style.borderColor = "";
        document.getElementById("ValStrShiftTimeTo").style.display = "none";
    }

    if (SelShiftDayTo == "" || SelShiftDayTo == undefined || SelShiftDayTo == null) {
        DevExpress.ui.notify("Please enter Shift From min.  ...!", "error", 1000);
        var text = "Please enter Shift From min. ...!";
        document.getElementById("SelShiftDayTo").value = "";
        document.getElementById("SelShiftDayTo").focus();
        document.getElementById("SelShiftDayTo").style.borderColor = "red";
        document.getElementById("ValStrShiftTimeTo").style.display = "block";
        document.getElementById("ValStrShiftTimeTo").innerHTML = text;
        return false;
    } else {
        document.getElementById("SelShiftDayTo").style.borderColor = "";
        document.getElementById("ValStrShiftTimeTo").style.display = "none";
    }

    //if (SelStatus == "" || SelStatus == undefined || SelStatus == null || SelStatus == "null") {
    //    DevExpress.ui.notify("Please choose Status...!", "error", 1000);
    //    var text = "Please choose Status...!";
    //    document.getElementById("SelStatus").focus();
    //    document.getElementById("SelStatus").style.borderColor = "red";
    //    document.getElementById("ValStrSelStatus").style.display = "block";
    //    document.getElementById("ValStrSelStatus").innerHTML = text;
    //    return false;
    //} else {
    //    document.getElementById("SelStatus").style.borderColor = "";
    //    document.getElementById("ValStrSelStatus").style.display = "none";
    //}

   

    var CurrentDate = new Date();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var GetShiftTimeFrom = CurrentDate.getDay() + "-" + months[CurrentDate.getMonth()] + "-" + CurrentDate.getFullYear() + " " + TxtFromHr + ":" + TxtFromMin + ":00" + " " + SelShiftDay;
    var GetShiftTimeTo = CurrentDate.getDay() + "-" + months[CurrentDate.getMonth()] + "-" + CurrentDate.getFullYear() + " " + TxtToHr + ":" + TxtToMin + ":00" + " " + SelShiftDayTo;

    var jsonObjectsSaveRecord = [];
    var OptSaveRecord = {};

    OptSaveRecord = {};
    OptSaveRecord.ShiftName = TxtShiftName;
    OptSaveRecord.StartTime = GetShiftTimeFrom;
    OptSaveRecord.EndTime = GetShiftTimeTo;
    OptSaveRecord.Status = SelStatus;
    OptSaveRecord.ShiftNarration = TxtNarration;

    OptSaveRecord.ShiftFromHr = TxtFromHr;
    OptSaveRecord.ShiftFromMin = TxtFromMin;
    OptSaveRecord.FromShift = SelShiftDay;
    OptSaveRecord.ShiftToHr = TxtToHr;
    OptSaveRecord.ShiftToMin = TxtToMin;
    OptSaveRecord.ToShift = SelShiftDayTo;
    
    jsonObjectsSaveRecord.push(OptSaveRecord);

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
                url: "WebService_ShiftMaster.asmx/UpdateShiftMaster",
                data: '{ShiftID:' + JSON.stringify(document.getElementById("TxtShiftMasterID").value) + ',jsonObjectsSaveRecord:' + JSON.stringify(jsonObjectsSaveRecord) + '}',
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
                url: "WebService_ShiftMaster.asmx/SaveSiftMaster",
                data: '{jsonObjectsSaveRecord:' + JSON.stringify(jsonObjectsSaveRecord) + '}',
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

function BlankField() {
    GblStatus = "";
    document.getElementById("BtnPopBtnDelete").disabled = true;
    document.getElementById("TxtShiftName").value = "";


    document.getElementById("TxtFromHr").value = 1;
    document.getElementById("TxtFromMin").value = 0;
    $("#SelShiftDay").dxSelectBox({
        value: "",
    });
    document.getElementById("TxtToHr").value = 1;
    document.getElementById("TxtToMin").value = 0;
    $("#SelShiftDayTo").dxSelectBox({
        value: "",
    });
    $("#SelStatus").dxSelectBox({
        value: "",
    });
   
}

//Get Show List
Showlist();
function Showlist() {
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_ShiftMaster.asmx/ShowListShiftMaster",
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

            $("#ShiftMasterShowListGrid").dxDataGrid({
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
                    document.getElementById("TxtShiftMasterID").value = sholistData[0].ShiftID;

                },
                columns: [{ dataField: "ShiftID", visible: false, width: 120 },
                        { dataField: "UserID", visible: false, width: 120 },
                        { dataField: "CompanyID", visible: false, width: 120 },
                        { dataField: "CreatedBy", visible: false, width: 120 },
                        { dataField: "ModifiedBy", visible: false, width: 100 },
                        { dataField: "DeletedBy", visible: false, width: 120 },
                        { dataField: "ShiftName", visible: true, width: 250 },
                        { dataField: "StartTime", visible: true, width: 120, width: 250 },
                        { dataField: "EndTime", visible: true, width: 120, width: 250 },
                        { dataField: "ShiftFromHr", visible: false, width: 80 },
                        { dataField: "ShiftFromMin", visible: false, width: 100 },
                        { dataField: "ShiftToHr", visible: false, width: 80 },
                        { dataField: "ShiftToMin", visible: false, width: 100 },
                        { dataField: "FromShift", visible: false, width: 100 },
                        { dataField: "ToShift", visible: false, width: 100 },
                        { dataField: "ShiftNarration", visible: true, width: 200 },
                        { dataField: "UserName", visible: true, width: 200, caption: "Created By" },
                        { dataField: "FYear", visible: true, width: 80 },
                        { dataField: "CreatedDate", visible: true, width: 100 },
                        { dataField: "ModifiedDate", visible: true, width: 100 },
                        { dataField: "DeletedDate", visible: true, width: 100 },

                ]
            })
        }
    });
}

$("#EditButton").click(function () {
    var TxtShiftMasterID = document.getElementById("TxtShiftMasterID").value;
    if (TxtShiftMasterID == "" || TxtShiftMasterID == null || TxtShiftMasterID == undefined) {
        DevExpress.ui.notify("Please Choose any row from below Grid..!", "error", 1000);
        return false;
    }
    GblStatus = "Update";
    document.getElementById("BtnPopBtnDelete").disabled = false;

    document.getElementById("EditButton").setAttribute("data-toggle", "modal");
    document.getElementById("EditButton").setAttribute("data-target", "#largeModal");

    document.getElementById("LOADER").style.display = "block";

    document.getElementById("TxtShiftName").value = sholistData[0].ShiftName;
    document.getElementById("TxtFromHr").value = sholistData[0].ShiftFromHr;
    document.getElementById("TxtFromMin").value = sholistData[0].ShiftFromMin;
    $("#SelShiftDay").dxSelectBox({
        value: sholistData[0].FromShift,
    });
    document.getElementById("TxtToHr").value = sholistData[0].ShiftToHr;
    document.getElementById("TxtToMin").value = sholistData[0].ShiftToMin;
    $("#SelShiftDayTo").dxSelectBox({
        value: sholistData[0].ToShift,
    });
    $("#SelStatus").dxSelectBox({
        value: sholistData[0].Status,
    });
    document.getElementById("TxtNarration").value = sholistData[0].ShiftNarration;

    document.getElementById("LOADER").style.display = "none";


});

//Delete Selected Data on PopUp
$("#DeleteButton").click(function () {
    var TxtShiftMasterID = document.getElementById("TxtShiftMasterID").value;
    if (TxtShiftMasterID == "" || TxtShiftMasterID == null || TxtShiftMasterID == undefined) {
        DevExpress.ui.notify("Please Choose any row from below Grid..!", "error", 1000);
        return false;
    }

    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Content!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        document.getElementById("LOADER").style.display = "block";
        $.ajax({
            type: "POST",
            url: "WebService_ShiftMaster.asmx/DeleteData",
            data: '{TxtShiftMasterID:' + JSON.stringify(TxtShiftMasterID) + '}',
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
                    //  alert("Your Data has been Deleted Successfully...!");
                    swal("Deleted!", "Your Data has been deleted.", "success");
                    //location.reload();
                    Showlist();
                    GblStatus = "";
                    BlankField();

                }

            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR);
            }
        });

    });

});

$("#BtnPopBtnDelete").click(function () {
    $("#DeleteButton").click();
});
