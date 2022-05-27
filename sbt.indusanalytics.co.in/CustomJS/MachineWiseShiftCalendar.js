
var GblStatus = "", CreatedData = [], sholistData = [];
var ShiftMasterData = [], SelectedShiftMasterData = [];
var MachindData = [], SelectedMachindData = [];
var GetScheduledDate = [], CalendarData = [], SelectedCalendarData = [];
var ShiftUpperGridData = [], SelectedUpperGridData = [], ShiftLowerGridData = [], SelectedLowerGridData = [];


var DayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
$("#WeeklyOffDay").dxSelectBox({
    items: DayOfWeek,
    placeholder: "Week Off--",
    searchEnabled: true,
});

var d = new Date();
var dd = d.getDate();
var mm = d.getMonth() + 1;
var yyyy = d.getFullYear();
var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var yy = Number(yyyy) + 1;
//var customDate = dd + " " + months_String[mm - 1] + " " + yy;
var customDate = dd + " " + months_String[mm] + " " + yyyy;
var customDateFrom = dd + " " + months_String[mm - 1] + " " + yyyy;

$("#ToDateShowlist").dxDateBox({
    pickerType: "rollers",
    value: customDate,
    displayFormat: 'dd-MMM-yyyy',
});

$("#FromDateShowlist").dxDateBox({
    pickerType: "rollers",
    value: customDateFrom,
    displayFormat: 'dd-MMM-yyyy',
    // value: new Date().toISOString().substr(0, 10),
});

$("#ToDateDelete").dxDateBox({
    pickerType: "rollers",
    value: customDate,
    displayFormat: 'dd-MMM-yyyy',
});

$("#FromDateDelete").dxDateBox({
    pickerType: "rollers",
    value: customDateFrom,
    displayFormat: 'dd-MMM-yyyy',
    // value: new Date().toISOString().substr(0, 10),
});

$("#FromDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});

$("#ToDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
});

$("#ShiftExtraDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
    onValueChanged: function (e) {
        if (e.value !== "" && e.value !== undefined && e.value !== null) {
            $("#ShiftExtra_1Date").dxDateBox({
                pickerType: "rollers",
                value: e.value,
                displayFormat: 'dd-MMM-yyyy',
            });
        }
    }
});
$("#ShiftExtra_1Date").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',
    disabled: true,
});

var ShiftDay = ["am", "pm"];
$("#SelShiftDay").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,

});

$("#SelShiftDayTo").dxSelectBox({
    items: ShiftDay,
    placeholder: "am & pm",
    searchEnabled: true,

});

var ShiftStatus = ["Working Hours", "Lunch Time", "Tea Time", "Other Time"]
$("#SelStatus").dxSelectBox({
    items: ShiftStatus,
    placeholder: "Status--",
    searchEnabled: true,
});

$("#ShowListGrid").dxDataGrid({
    dataSource: CreatedData,
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
    height: function () {
        return window.innerHeight / 1.2;
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
        document.getElementById("TxtShowListGridID").value = sholistData[0].TransactionID;

    },
    columns: [{ dataField: "TransactionID", visible: false, width: 120 },
            { dataField: "MachineID", visible: false, width: 120 },
            { dataField: "CompanyID", visible: false, width: 120 },
            { dataField: "DepartmentID", visible: false, width: 120 },
            { dataField: "DepartmentName", visible: true, width: 150 },
            { dataField: "MachineName", visible: true, width: 150 },
            { dataField: "ShiftName", visible: true, width: 200 },
            { dataField: "StartTime", visible: true, width: 250 },
            { dataField: "EndTime", visible: true, width: 250 },
            { dataField: "Status", visible: true, width: 150 },

    ]
})

//Get Show List
Showlist();
function Showlist() {
    var FromDate = $("#FromDateShowlist").dxDateBox('instance').option('value');
    var ToDate = $("#ToDateShowlist").dxDateBox('instance').option('value');
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_MachineWiseShiftCalendar.asmx/ShowListShiftMaster",
        data: '{FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + '}',
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
            CreatedData = [];
            CreatedData = RES1;
            $("#ShowListGrid").dxDataGrid({
                dataSource: CreatedData,
            });
        }
    });
}

$("#MachineGrid").dxDataGrid({
    dataSource: MachindData,
    showBorders: true,
    //paging: {
    //    enabled: false
    //},
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: false,
    //paging: {
    //    pageSize: 15
    //},
    //pager: {
    //    showPageSizeSelector: true,
    //    allowedPageSizes: [15, 25, 50, 100]
    //},
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
    height: function () {
        return window.innerHeight / 1.3;
    },
    onSelectionChanged: function (machine) {
        SelectedMachindData = [];
        SelectedMachindData = machine.selectedRowsData;
        document.getElementById("txtMachineName").value = SelectedMachindData[0].MachineName;
        document.getElementById("txtMachineNameExtra").value = SelectedMachindData[0].MachineName;

        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/GetScheduled",
            data: '{MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'text',
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                GetScheduledDate = [];
                GetScheduledDate = JSON.parse(res.toString());

                if (GetScheduledDate[0].EndTime == "" || GetScheduledDate[0].EndTime == undefined || GetScheduledDate[0].EndTime == null) {
                    var d = new Date();
                    var dd = d.getDate();
                    var mm = d.getMonth() + 1;
                    var yyyy = d.getFullYear();
                    var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var customDateTo = dd + " " + months_String[mm + 1] + " " + yyyy;
                    $("#FromDate").dxDateBox({
                        pickerType: "rollers",
                        displayFormat: 'dd-MMM-yyyy',
                        value: new Date().toISOString().substr(0, 10),
                        disabled: false
                    });
                    $("#ToDate").dxDateBox({
                        pickerType: "rollers",
                        value: customDateTo,
                        displayFormat: 'dd-MMM-yyyy',
                    });
                }
                else {
                    var d = new Date();
                    var dd = d.getDate();
                    var mm = d.getMonth() + 1;
                    var yyyy = d.getFullYear();
                    var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var customDateTo = dd + " " + months_String[mm + 1] + " " + yyyy;

                    var dFR = new Date(GetScheduledDate[0].EndTime);
                    var ddFR = dFR.getDate();
                    var mmFR = dFR.getMonth() + 1;
                    var yyyyFR = dFR.getFullYear();
                    var months_StringFR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var customDateFrom = ddFR + " " + months_StringFR[mmFR - 1] + " " + yyyyFR;

                    $("#FromDate").dxDateBox({
                        pickerType: "rollers",
                        value: customDateFrom,
                        displayFormat: 'dd-MMM-yyyy',
                        disabled: true
                    });
                    $("#ToDate").dxDateBox({
                        pickerType: "rollers",
                        value: customDateTo,
                        displayFormat: 'dd-MMM-yyyy',
                    });
                }

                if (GetScheduledDate[0].EndTime1 == "" || GetScheduledDate[0].EndTime1 == undefined || GetScheduledDate[0].EndTime1 == null) {
                    $("#ToDateDelete").dxDateBox({
                        pickerType: "rollers",
                        value: customDate,
                        displayFormat: 'dd-MMM-yyyy',
                        disabled: false
                    });

                    $("#FromDateDelete").dxDateBox({
                        pickerType: "rollers",
                        value: new Date().toISOString().substr(0, 10),
                        displayFormat: 'dd-MMM-yyyy',
                        // value: new Date().toISOString().substr(0, 10),
                    });
                }
                else {
                    var dFR = new Date(GetScheduledDate[0].EndTime1);
                    var ddFR = dFR.getDate();
                    var mmFR = dFR.getMonth() + 1;
                    var yyyyFR = dFR.getFullYear();
                    var months_StringFR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var customDateTo = ddFR + " " + months_StringFR[mmFR - 1] + " " + yyyyFR;

                    $("#ToDateDelete").dxDateBox({
                        pickerType: "rollers",
                        value: customDateTo,
                        displayFormat: 'dd-MMM-yyyy',
                        disabled: true
                    });

                    $("#FromDateDelete").dxDateBox({
                        pickerType: "rollers",
                        value: new Date().toISOString().substr(0, 10),
                        // value: customDateFrom,
                        displayFormat: 'dd-MMM-yyyy',
                        // value: new Date().toISOString().substr(0, 10),
                    });
                }
            }
        });
    },
    columns: [{ dataField: "MachineID", visible: false, width: 120 },
            { dataField: "DepartmentID", visible: false, width: 120 },
            { dataField: "CompanyID", visible: false, width: 120 },
            { dataField: "MachineName", visible: true, width: 200 },
            { dataField: "DepartmentName", visible: true, width: 200 },

    ]
})

$("#ShiftMasterGrid").dxDataGrid({
    dataSource: ShiftMasterData,
    showBorders: true,
    //paging: {
    //    enabled: false
    //},
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "multiple", showCheckBoxesMode: "always", },
    paging: false,
    //paging: {
    //    pageSize: 15
    //},
    //pager: {
    //    showPageSizeSelector: true,
    //    allowedPageSizes: [15, 25, 50, 100]
    //},
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
    height: function () {
        return window.innerHeight / 1.6;
    },
    onSelectionChanged: function (shift) {
        SelectedShiftMasterData = [];
        SelectedShiftMasterData = shift.selectedRowsData;
        if (SelectedShiftMasterData.length > 0) {
            $("#TxtShiftID").text(
                $.map(SelectedShiftMasterData, function (value) {
                    return value.ShiftID;
                }).join(','));
        }
        else {
            $("#ShiftID").text("");
        }
    },
    columns: [{ dataField: "ShiftID", visible: false, width: 120 },
            { dataField: "UserID", visible: false, width: 120 },
            { dataField: "CompanyID", visible: false, width: 120 },
            { dataField: "CreatedBy", visible: false, width: 120 },
            { dataField: "ModifiedBy", visible: false, width: 100 },
            { dataField: "DeletedBy", visible: false, width: 120 },
            { dataField: "ShiftName", visible: true, width: 250 },
            { dataField: "StartTime", visible: true, width: 200 },
            { dataField: "EndTime", visible: true, width: 200 },
            { dataField: "Status", visible: true, width: 200, },
            { dataField: "ShiftFromHr", visible: false, width: 80 },
            { dataField: "ShiftFromMin", visible: false, width: 100 },
            { dataField: "ShiftToHr", visible: false, width: 80 },
            { dataField: "ShiftToMin", visible: false, width: 100 },
            { dataField: "FromShift", visible: false, width: 100 },
            { dataField: "ToShift", visible: false, width: 100 },
            { dataField: "ShiftNarration", visible: false, width: 200 },
            { dataField: "UserName", visible: false, width: 200, caption: "Created By" },
            { dataField: "FYear", visible: false, width: 80 },
            { dataField: "CreatedDate", visible: false, width: 100 },
            { dataField: "ModifiedDate", visible: false, width: 100 },
            { dataField: "DeletedDate", visible: false, width: 100 },
    ]
})

$("#CreateButton").click(function () {   
    BlankField();

    $.ajax({
        type: "POST",
        url: "WebService_MachineWiseShiftCalendar.asmx/GetMachineAndDepartMent",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            MachindData = [];
            MachindData = JSON.parse(res.toString());
            $("#MachineGrid").dxDataGrid({
                dataSource: MachindData,
            });

            $.ajax({
                type: "POST",
                url: "WebService_MachineWiseShiftCalendar.asmx/GetShiftMaster",
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
                    ShiftMasterData = [];
                    ShiftMasterData = JSON.parse(res.toString());
                    $("#ShiftMasterGrid").dxDataGrid({
                        dataSource: ShiftMasterData,
                    });
                }
            });
        }
    });

    document.getElementById("CreateButton").setAttribute("data-toggle", "modal");
    document.getElementById("CreateButton").setAttribute("data-target", "#largeModal");
});

$("#BtnFilterShowlist").click(function () {
    Showlist();
});

function BlankField() {
    document.getElementById("txtMachineName").value = "";
    $("#FromDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10),
        disabled: false
    });
    $("#ToDate").dxDateBox({
        pickerType: "rollers",
        displayFormat: 'dd-MMM-yyyy',
        value: new Date().toISOString().substr(0, 10),
    });
    $("#WeeklyOffDay").dxSelectBox({
        value: "",
    });
    var grid1 = $('#MachineGrid').dxDataGrid('instance');
    grid1.clearSelection();
    var grid2 = $('#ShiftMasterGrid').dxDataGrid('instance');
    grid2.clearSelection();
}

$("#BtnNew").click(function () {
    BlankField()
});

$("#BtnSave").click(function () {
    var txtMachineName = document.getElementById("txtMachineName").value;
    var FromDate = $("#FromDate").dxDateBox('instance').option('value');
    var ToDate = $("#ToDate").dxDateBox('instance').option('value');
    var WeeklyOffDay = $("#WeeklyOffDay").dxSelectBox('instance').option('value');
    var TxtShiftIDStr = document.getElementById("TxtShiftID").value;

    var d = new Date(FromDate);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    var months_String = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var customDateFr = dd + "-" + months_String[mm - 1] + "-" + yyyy;

    var d1 = new Date(ToDate);
    var dd1 = d1.getDate();
    var mm1 = d1.getMonth() + 1;
    var yyyy1 = d1.getFullYear();
    var months_String1 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var customDateTo = dd1 + "-" + months_String1[mm1 - 1] + "-" + yyyy1;


    if (txtMachineName == "" || txtMachineName == undefined || txtMachineName == null || SelectedMachindData.length < 1) {
        DevExpress.ui.notify("Please choose Machine Name from left side grid.!", "error", 1000);
        var text = "Please choose Machine Name from left side grid.!";
        document.getElementById("txtMachineName").value = "";
        document.getElementById("txtMachineName").focus();
        document.getElementById("txtMachineName").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("txtMachineName").style.borderColor = "";
    }
    if (WeeklyOffDay == "" || WeeklyOffDay == undefined || WeeklyOffDay == null) {
        DevExpress.ui.notify("Please choose Weekly Off Day.!", "error", 1000);
        var text = "Please choose Weekly Off Day.!";
        document.getElementById("WeeklyOffDay").focus();
        document.getElementById("WeeklyOffDay").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("WeeklyOffDay").style.borderColor = "";
    }

    if (TxtShiftIDStr == "" || TxtShiftIDStr == undefined || TxtShiftIDStr == null) {
        DevExpress.ui.notify("Please select shift.!", "error", 1000);
        return false;
    } else {
        TxtShiftIDStr = "(" + TxtShiftIDStr + ")"
    }

    var weekoff = "";
    if (WeeklyOffDay == "Sunday") {
        weekoff = 1;
    }
    else if (WeeklyOffDay == "Monday") {
        weekoff = 2;
    }
    else if (WeeklyOffDay == "Tuesday") {
        weekoff = 3;
    }
    else if (WeeklyOffDay == "Wednesday") {
        weekoff = 4;
    }
    else if (WeeklyOffDay == "Thursday") {
        weekoff = 5;
    }
    else if (WeeklyOffDay == "Friday") {
        weekoff = 6;
    }
    else if (WeeklyOffDay == "Saturday") {
        weekoff = 7;
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
        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/SaveData",
            data: '{weekoff:' + JSON.stringify(weekoff) + ',customDateFr:' + JSON.stringify(customDateFr) + ',customDateTo:' + JSON.stringify(customDateTo) + ',MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + ',TxtShiftIDStr:' + JSON.stringify(TxtShiftIDStr) + '}',
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
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });

});

$("#BtnDeletePopUp").click(function () {
    showlistCalender();
});

$("#BtnFilterDelete").click(function () {
    showlistCalender();
});

function showlistCalender() {
    var FromDate = $("#FromDateDelete").dxDateBox('instance').option('value');
    var ToDate = $("#ToDateDelete").dxDateBox('instance').option('value');

    var txtMachineName = document.getElementById("txtMachineName").value;
    if (txtMachineName == "" || txtMachineName == undefined || txtMachineName == null || SelectedMachindData.length < 1) {
        DevExpress.ui.notify("Please choose Machine Name from left side grid.!", "error", 1000);
        return false;
    }

    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_MachineWiseShiftCalendar.asmx/GetListCalender",
        data: '{FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + ',MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            document.getElementById("LOADER").style.display = "none";
            CalendarData = [];
            CalendarData = JSON.parse(res.toString());
            $("#CalenderGridGrid").dxDataGrid({
                dataSource: CalendarData,
            });
        }
    });

    document.getElementById("BtnDeletePopUp").setAttribute("data-toggle", "modal");
    document.getElementById("BtnDeletePopUp").setAttribute("data-target", "#largeModalCalender");
}

$("#CalenderGridGrid").dxDataGrid({
    dataSource: CalendarData,
    showBorders: true,
    //paging: {
    //    enabled: false
    //},
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: false,
    //paging: {
    //    pageSize: 15
    //},
    //pager: {
    //    showPageSizeSelector: true,
    //    allowedPageSizes: [15, 25, 50, 100]
    //},
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
    height: function () {
        return window.innerHeight / 1.3;
    },
    onSelectionChanged: function (calendar) {
        SelectedCalendarData = [];
        SelectedCalendarData = calendar.selectedRowsData;

    },
    columns: [{ dataField: "TransactionID", visible: false, width: 120 },
           { dataField: "MachineID", visible: false, width: 120 },
           { dataField: "CompanyID", visible: false, width: 120 },
           { dataField: "DepartmentID", visible: false, width: 120 },
           { dataField: "DepartmentName", visible: true, width: 200 },
           { dataField: "MachineName", visible: true, width: 200 },
           { dataField: "ShiftName", visible: true, width: 200 },
           { dataField: "StartTime", visible: true, width: 250 },
           { dataField: "EndTime", visible: true, width: 250 },
           { dataField: "Status", visible: true, width: 150 },

    ]
})

$("#BtnDeleteSch").click(function () {
    var FromDate = $("#FromDateDelete").dxDateBox('instance').option('value');
    var ToDate = $("#ToDateDelete").dxDateBox('instance').option('value');

    var txtMachineName = document.getElementById("txtMachineName").value;
    if (txtMachineName == "" || txtMachineName == undefined || txtMachineName == null || SelectedMachindData.length < 1) {
        DevExpress.ui.notify("Please choose Machine Name from left side grid.!", "error", 1000);
        return false;
    }

    swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this Machine "' + SelectedMachindData[0].MachineName + '" for allocated shift.!',
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
               url: "WebService_MachineWiseShiftCalendar.asmx/DeleteCalendar",
               data: '{FromDate:' + JSON.stringify(FromDate) + ',ToDate:' + JSON.stringify(ToDate) + ',MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + '}',
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
//-----------------Add Extra Shift--------------------
$("#EXtraShiftUpperGrid").dxDataGrid({
    dataSource: ShiftUpperGridData,
    showBorders: true,
    //paging: {
    //    enabled: false
    //},
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: false,
    //paging: {
    //    pageSize: 15
    //},
    //pager: {
    //    showPageSizeSelector: true,
    //    allowedPageSizes: [15, 25, 50, 100]
    //},
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
    height: function () {
        return window.innerHeight / 3;
    },
    onSelectionChanged: function (Upper) {
        SelectedUpperGridData = [];
        SelectedUpperGridData = Upper.selectedRowsData;

    },
    columns: [{ dataField: "TransactionID", visible: false, width: 120 },
           { dataField: "MachineID", visible: false, width: 120 },
           { dataField: "DepartmentName", visible: true, width: 220 },
           { dataField: "MachineName", visible: true, width: 250 },
           { dataField: "ShiftName", visible: true, width: 200 },
           { dataField: "StartTime", visible: true, width: 250 },
           { dataField: "EndTime", visible: true, width: 250 },
           { dataField: "Status", visible: true, width: 150 },
    ]
})

$("#EXtraShiftLowerGrid").dxDataGrid({
    dataSource: ShiftLowerGridData,
    showBorders: true,
    //paging: {
    //    enabled: false
    //},
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    selection: { mode: "single" },
    paging: false,
    //paging: {
    //    pageSize: 15
    //},
    //pager: {
    //    showPageSizeSelector: true,
    //    allowedPageSizes: [15, 25, 50, 100]
    //},
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
    height: function () {
        return window.innerHeight / 3;
    },
    onSelectionChanged: function (Lower) {
        SelectedLowerGridData = [];
        SelectedLowerGridData = Lower.selectedRowsData;

    },
    columns: [{ dataField: "TransactionID", visible: false, width: 120 },
           { dataField: "MachineID", visible: false, width: 120 },
           { dataField: "DepartmentName", visible: true, width: 220 },
           { dataField: "MachineName", visible: true, width: 250 },
           { dataField: "ShiftName", visible: true, width: 200 },
           { dataField: "StartTime", visible: true, width: 250 },
           { dataField: "EndTime", visible: true, width: 250 },
           { dataField: "Status", visible: true, width: 150 },
    ]
})

$("#BtnExtraShiftOnMachine").click(function () {
    AddExtraShiftOnMachine();
});

function AddExtraShiftOnMachine() {
    var ShiftExtraDate = $("#ShiftExtraDate").dxDateBox('instance').option('value');

    var txtMachineName = document.getElementById("txtMachineName").value;
    if (txtMachineName == "" || txtMachineName == undefined || txtMachineName == null || SelectedMachindData.length < 1) {
        DevExpress.ui.notify("Please choose Machine Name from left side grid.!", "error", 1000);
        return false;
    }
    ShiftUpperGridData = [], SelectedUpperGridData = [], ShiftLowerGridData = [], SelectedLowerGridData = [];
    BlankField();
    document.getElementById("LOADER").style.display = "block";
    $.ajax({
        type: "POST",
        url: "WebService_MachineWiseShiftCalendar.asmx/UpperGrid",
        data: '{ShiftExtraDate:' + JSON.stringify(ShiftExtraDate) + ',MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + '}',
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
            ShiftUpperGridData = [];
            ShiftUpperGridData = RES1;
            $("#EXtraShiftUpperGrid").dxDataGrid({
                dataSource: ShiftUpperGridData,
            });

            $.ajax({
                type: "POST",
                url: "WebService_MachineWiseShiftCalendar.asmx/LowerGrid",
                data: '{ShiftExtraDate:' + JSON.stringify(ShiftExtraDate) + ',MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + '}',
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
                    ShiftLowerGridData = [];
                    ShiftLowerGridData = RES1;
                    $("#EXtraShiftLowerGrid").dxDataGrid({
                        dataSource: ShiftLowerGridData,
                    });
                }
            });
        }
    });

    document.getElementById("BtnExtraShiftOnMachine").setAttribute("data-toggle", "modal");
    document.getElementById("BtnExtraShiftOnMachine").setAttribute("data-target", "#largeModalEXtraShift");
}

$("#BtnFilterEXtraShift").click(function () {
    AddExtraShiftOnMachine();
});

$("#BtnSaveEXtraShift").click(function () {
    var ShiftExtra_1Date = $("#ShiftExtra_1Date").dxDateBox('instance').option('value');
    var TxtShiftName = document.getElementById("txtSihft_1NameExtra").value;

    var TxtFromHr = document.getElementById("TxtFromHr").value;
    var TxtFromMin = document.getElementById("TxtFromMin").value;
    var SelShiftDay = $("#SelShiftDay").dxSelectBox('instance').option('value');
    var TxtToHr = document.getElementById("TxtToHr").value;
    var TxtToMin = document.getElementById("TxtToMin").value;
    var SelShiftDayTo = $("#SelShiftDayTo").dxSelectBox('instance').option('value');
    var SelStatus = $("#SelStatus").dxSelectBox('instance').option('value');

    var EXtraShiftUpperGrid = $('#EXtraShiftUpperGrid').dxDataGrid('instance');
    var EXtraShiftUpperGridRow = EXtraShiftUpperGrid.totalCount();

    var EXtraShiftLowerGrid = $('#EXtraShiftLowerGrid').dxDataGrid('instance');
    var EXtraShiftLowerGridRow = EXtraShiftLowerGrid.totalCount();

    if (EXtraShiftUpperGridRow <= 0) {
        DevExpress.ui.notify("No schedule found for current day, Please add in machine calender..!", "warning", 1200);
        return false;
    }
    if (EXtraShiftLowerGridRow <= 0) {
        DevExpress.ui.notify("No schedule found for next day, Please add in machine calender..!", "warning", 1200);
        return false;
    }
    var Max_end_Date = "";
    if (EXtraShiftUpperGridRow > 0) {
        for (var t = 0; t < EXtraShiftUpperGridRow; t++) {
            if (t == Number(EXtraShiftUpperGridRow) - 1) {
                Max_end_Date = EXtraShiftUpperGrid._options.dataSource[t].EndTime;
            }
        }
    }
    var Min_start_Date = "";
    Min_start_Date = EXtraShiftLowerGrid._options.dataSource[0].StartTime;

    var a = new Date(Max_end_Date);
    var b = new Date(Min_start_Date);
    if (a.getTime() == b.getTime()) {
        DevExpress.ui.notify("No time slot available, Can't add extra shift..!", "warning", 1200);
        return false;
    }

    if (TxtShiftName == "" || TxtShiftName == undefined || TxtShiftName == null) {
        DevExpress.ui.notify("Please enter Shift name...!", "error", 1000);
        var text = "Please enter Shift name...!";
        document.getElementById("txtSihft_1NameExtra").value = "";
        document.getElementById("txtSihft_1NameExtra").focus();
        document.getElementById("txtSihft_1NameExtra").style.borderColor = "red";
        document.getElementById("ValStrtxtSihft_1NameExtra").style.display = "block";
        document.getElementById("ValStrtxtSihft_1NameExtra").innerHTML = text;
        return false;
    } else {
        document.getElementById("txtSihft_1NameExtra").style.borderColor = "";
        document.getElementById("ValStrtxtSihft_1NameExtra").style.display = "none";
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

    if (SelStatus == "" || SelStatus == undefined || SelStatus == null || SelStatus == "null") {
        DevExpress.ui.notify("Please choose Status...!", "error", 1000);
        var text = "Please choose Status...!";
        document.getElementById("SelStatus").focus();
        document.getElementById("SelStatus").style.borderColor = "red";
        document.getElementById("ValStrSelStatus").style.display = "block";
        document.getElementById("ValStrSelStatus").innerHTML = text;
        return false;
    } else {
        document.getElementById("SelStatus").style.borderColor = "";
        document.getElementById("ValStrSelStatus").style.display = "none";
    }

    var CurrentDate = new Date($("#ShiftExtra_1Date").dxDateBox('instance').option('value'));
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var Extra_GetShiftTimeFrom = CurrentDate.getDay() + "-" + months[CurrentDate.getMonth()] + "-" + CurrentDate.getFullYear() + " " + TxtFromHr + ":" + TxtFromMin + ":00" + " " + SelShiftDay;
    var Extra_GetShiftTimeTo = CurrentDate.getDay() + "-" + months[CurrentDate.getMonth()] + "-" + CurrentDate.getFullYear() + " " + TxtToHr + ":" + TxtToMin + ":00" + " " + SelShiftDayTo;

    var Date1 = new Date(Extra_GetShiftTimeFrom);
    var Date2 = new Date(Extra_GetShiftTimeTo);
    var diffMs = (Date2 - Date1);
    var diffMins = Math.round(diffMs / 60000);

    if (Number(diffMins) < 0) {
        diffMins = 1440 - Number(Math.abs(Number(diffMins)));
    }

    var dt = new Date(Extra_GetShiftTimeFrom);
    dt.setMinutes(dt.getMinutes() + Number(diffMins));

    var Start_Time_Min = new Date(Extra_GetShiftTimeFrom);
    var Max_end_Date = new Date(Max_end_Date);

    if (Start_Time_Min.getTime() < Max_end_Date.getTime()) {
        DevExpress.ui.notify("Shift start time is invalid, It should be greater than last slot end time..!", "warning", 1200);
        return false;
    }

    var End_Time_Min = new Date(dt);
    var Min_start_Date = new Date(Min_start_Date);

    if (End_Time_Min.getTime() > Min_start_Date.getTime()) {
        DevExpress.ui.notify("Shift end time is invalid, It should be less than first slot start time of next day..!", "warning", 1200);
        return false;
    }

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var S_DAY = Start_Time_Min.getDay();
    var S_MON = months[Start_Time_Min.getMonth()];
    var S_YY = Start_Time_Min.getFullYear();
    var S_HH = Start_Time_Min.getHours();
    var S_MM = Start_Time_Min.getMinutes();
    var starttime = S_DAY + "-" + S_MON + "-" + S_YY + " " + S_HH + ":" + S_MM + ":00";

    var E_DAY = End_Time_Min.getDay();
    var E_MON = months[End_Time_Min.getMonth()];
    var E_YY = End_Time_Min.getFullYear();
    var E_HH = End_Time_Min.getHours();
    var E_MM = End_Time_Min.getMinutes();
    var endtime = E_DAY + "-" + E_MON + "-" + E_YY + " " + E_HH + ":" + E_MM + ":00";

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

        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/SaveExtraShift",
            data: '{MachineID:' + JSON.stringify(SelectedMachindData[0].MachineID) + ',TxtShiftName:' + JSON.stringify(TxtShiftName) + ',SelStatus:' + JSON.stringify(SelStatus) + ',Start_Time_Min:' + JSON.stringify(starttime) + ',End_Time_Min:' + JSON.stringify(endtime) + '}',
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
                    // location.reload();
                    AddExtraShiftOnMachine();
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
    });

});

$("#BtnDeleteShiftSlot").click(function () {
    if (SelectedUpperGridData.length < 1) {
        DevExpress.ui.notify("No schedule found for current day..! Please Choose any row from below Grid..", "error", 2000);
        return false;
    }

    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Shift Name '" + SelectedUpperGridData[0].ShiftName + "..StartTime-" + SelectedUpperGridData[0].StartTime + "'",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        document.getElementById("LOADER").style.display = "block";
        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/DeleteExtraShift",
            data: '{TransactionID:' + JSON.stringify(SelectedUpperGridData[0].TransactionID) + '}',
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
                    AddExtraShiftOnMachine();
                }

            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR);
            }
        });

    });

});

function BlankField() {   
    document.getElementById("txtSihft_1NameExtra").value = "";

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

$("#BtnRearrangeSchedule").click(function () {
    var txt = 'Are you to re-arrange the schedule..? if yes please click on \n' + 'Yes, re-arrange ! \n' + 'otherwise click on \n' + 'Cancel';

    swal({
        title: "Are you sure?",
        text: txt,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, re-arrange!",
        closeOnConfirm: false
    }, function () {
        document.getElementById("LOADER").style.display = "block";
        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/RearrangeSchedule",
            data: '{}',
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
                    swal("Rearranged", "Schedule Re-arrange sucessfully done..", "success");
                    AddExtraShiftOnMachine();
                }

            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert(jqXHR);
            }
        });

    });

});

$("#FromDateHoliday").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',    
});
$("#ToDateHoliday").dxDateBox({
    pickerType: "rollers",
    value: new Date().toISOString().substr(0, 10),
    displayFormat: 'dd-MMM-yyyy',
});

$("#BtnSaveHoliday").click(function () {
    var FromDateHoliday = $("#FromDateHoliday").dxDateBox('instance').option('value');
    var ToDateHoliday = $("#ToDateHoliday").dxDateBox('instance').option('value');
    var txtHolidayRemark = document.getElementById("txtHolidayRemark").value;

    if (txtHolidayRemark == "" || txtHolidayRemark == undefined || txtHolidayRemark == null) {
        DevExpress.ui.notify("Please enter Remark for Holiday...!", "error", 1000);
        var text = "Please enter Remark for Holiday...!";
        document.getElementById("txtHolidayRemark").value = "";
        document.getElementById("txtHolidayRemark").focus();
        document.getElementById("txtHolidayRemark").style.borderColor = "red";
        return false;
    } else {
        document.getElementById("txtHolidayRemark").style.borderColor = "";
    }

    if (txtHolidayRemark.trim() == "Working Hours") {
        DevExpress.ui.notify("Please change remark holiday...!", "error", 1000);
        return false;
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

        $.ajax({
            type: "POST",
            url: "WebService_MachineWiseShiftCalendar.asmx/SaveHoliday",
            data: '{FromDateHoliday:' + JSON.stringify(FromDateHoliday) + ',ToDateHoliday:' + JSON.stringify(ToDateHoliday) + ',txtHolidayRemark:' + JSON.stringify(txtHolidayRemark) + '}',
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
                    swal("Saved!", "Holiday remark saved", "success");
                    RetriveDataForHolidaySave();
                }
                else if (res == "Exist") {
                    swal("Duplicate!", "This Process Name allready Exist..\n Please enter another Process Name..", "");
                }

            },
            error: function errorFunc(jqXHR) {
                document.getElementById("LOADER").style.display = "none";
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });

});

$("#BtnAddHoliday").click(function () {

    document.getElementById("BtnAddHoliday").setAttribute("data-toggle", "modal");
    document.getElementById("BtnAddHoliday").setAttribute("data-target", "#largeModalHoliday");
});

function RetriveDataForHolidaySave() {
    BlankField();

    $.ajax({
        type: "POST",
        url: "WebService_MachineWiseShiftCalendar.asmx/GetMachineAndDepartMent",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: 'text',
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            MachindData = [];
            MachindData = JSON.parse(res.toString());
            $("#MachineGrid").dxDataGrid({
                dataSource: MachindData,
            });

            $.ajax({
                type: "POST",
                url: "WebService_MachineWiseShiftCalendar.asmx/GetShiftMaster",
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
                    ShiftMasterData = [];
                    ShiftMasterData = JSON.parse(res.toString());
                    $("#ShiftMasterGrid").dxDataGrid({
                        dataSource: ShiftMasterData,
                    });
                }
            });
        }
    });

}