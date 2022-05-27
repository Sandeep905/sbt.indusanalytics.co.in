"use strict";

var FlagEdit = false;
var ParameterID = 0;
var ParameterNameEdition = '';
var ParameterTypeEdition = '';
var OnSelectionRow = [];
var CurrentBlock = "Job Reference";

function TabClick(d) {
    var LblId = d.id;
    document.getElementById("ChoosedBlock").innerHTML = document.getElementById(LblId).innerHTML;
    CurrentBlock = document.getElementById("ChoosedBlock").innerHTML;
    GetDataCurrentTab();
}

GetDataCurrentTab();

$("#GridShowlist").dxDataGrid({
    showBorders: true,
    showRowLines: true,
    allowSorting: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: {
        mode: "multiple" // or "multiple" | "single"
    },
    height: function () {
        return window.innerHeight / 1.5;
    },
    loadPanel: {
        enabled: true,
        height: 90,
        width: 200,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (e) {
        OnSelectionRow = [], ParameterID = 0;
        if (e.selectedRowsData.length > 0) {
            OnSelectionRow = e.selectedRowsData;
            ParameterID = OnSelectionRow[0].ParameterID;

            if (CurrentBlock === "Job Reference") {
                document.getElementById('TxtJobReference').value = OnSelectionRow[0].ParameterValue;
            }
            else if (CurrentBlock === "Job Type") {
                document.getElementById('TXtJobtype').value = OnSelectionRow[0].ParameterValue;
            }
            else if (CurrentBlock === "Sales Order Prefix") {
                document.getElementById('TXtSalesPrefix').value = OnSelectionRow[0].ParameterValue;
                textJobType = textTypeName = "Booking Prefix";
            }
            else if (CurrentBlock === "Job Priority") {
                document.getElementById('TXtJobPriority').value = OnSelectionRow[0].ParameterValue;
            }
            else if (CurrentBlock === "Job Criteria") {
                document.getElementById('TXtJobcriteriaNew').value = OnSelectionRow[0].ParameterValue;
            }
            else if (CurrentBlock === "Approved By") {
                document.getElementById('TXtApproved').value = OnSelectionRow[0].ParameterValue;
            } else if (CurrentBlock === "Plate Type") {
                document.getElementById('TxtPlateType').value = OnSelectionRow[0].ParameterValue;
            }
        }
    },
    columns: [
        { dataField: "ParameterID", visible: false, caption: "Parameter ID" },
        { dataField: "ParameterName", visible: true, caption: "Parameter Name" },
        { dataField: "ParameterType", visible: false, caption: "Parameter Type" },
        { dataField: "ParameterValue", visible: true, caption: "Parameter Value" }
    ]
});

function GetDataCurrentTab() {
    var Cblock = document.getElementById("ChoosedBlock").innerHTML;
    if (Cblock === "Sales Order Prefix") Cblock = "Booking Prefix";

    document.getElementById('err1').innerHTML = "";
    document.getElementById('err2').innerHTML = "";
    document.getElementById('err3').innerHTML = "";
    document.getElementById('err4').innerHTML = "";
    document.getElementById('err5').innerHTML = "";
    document.getElementById('err6').innerHTML = "";

    $("#jobtype").hide();
    $("#SalesOrderprefix").hide();
    $("#jobpriority").hide();
    $("#jobCriteria").hide();
    $("#reference").hide();
    $("#Approvedby").hide();
    $("#platetype").hide();

    if (Cblock === "Job Reference") {
        $("#reference").show();
    }
    else if (Cblock === "Job Type") {
        $("#jobtype").show();
    }
    else if (Cblock === "Booking Prefix") {
        $("#SalesOrderprefix").show();
    }
    else if (Cblock === "Job Priority") {
        $("#jobpriority").show();
    }
    else if (Cblock === "Job Criteria") {
        $("#jobCriteria").show();
    }
    else if (Cblock === "Approved By") {
        $("#Approvedby").show();
    } else if (Cblock === "Plate Type") {
        $("#platetype").show();
    }

    $.ajax({
        type: "POST",
        url: "UserAuthentication.asmx/GetSelectedBlockData",
        data: '{CurrentBlock:' + JSON.stringify(Cblock) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#GridShowlist").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

$("#SaveButton").click(function () {

    var textJobType = document.getElementById("ChoosedBlock").innerHTML;
    var textTypeName = document.getElementById("ChoosedBlock").innerHTML;

    var txtJobValueReference = document.getElementById('TxtJobReference').value;
    var txtJobType = document.getElementById('TXtJobtype').value;
    var txtJobSalesPrefix = document.getElementById('TXtSalesPrefix').value;
    var txtJobPriority = document.getElementById('TXtJobPriority').value;
    var txtCriteria = document.getElementById('TXtJobcriteriaNew').value;
    var txtJobApproved = document.getElementById('TXtApproved').value;
    var txtPlatetype = document.getElementById('TxtPlateType').value;

    if ((txtJobValueReference === "" || txtJobValueReference === "null" || txtJobValueReference === null || txtJobValueReference === "undefined" || txtJobValueReference === undefined)
        && (txtJobType === "" || txtJobType === "null" || txtJobType === null || txtJobType === "undefined" || txtJobType === undefined)
        && (txtJobPriority === "" || txtJobPriority === "null" || txtJobPriority === null || txtJobPriority === "undefined" || txtJobPriority === undefined)
        && (txtJobSalesPrefix === "" || txtJobSalesPrefix === "null" || txtJobSalesPrefix === null || txtJobSalesPrefix === "undefined" || txtJobSalesPrefix === undefined)
        && (txtJobPriority === "" || txtJobPriority === "null" || txtJobPriority === null || txtJobPriority === "undefined" || txtJobPriority === undefined)
        && (txtJobApproved === "" || txtJobApproved === "null" || txtJobApproved === null || txtJobApproved === "undefined" || txtJobApproved === undefined)
        && (txtPlatetype === "" || txtPlatetype === "null" || txtPlatetype === null || txtPlatetype === "undefined" || txtPlatetype === undefined)
        && (txtCriteria === "" || txtCriteria === "null" || txtCriteria === null || txtCriteria === "undefined" || txtCriteria === undefined)

    ) {
        document.getElementById('err1').innerHTML = 'This field should not be empty..Job Refrence !';
        document.getElementById('err2').innerHTML = 'This field should not be empty..Job Type !';
        document.getElementById('err3').innerHTML = 'This field should not be empty..Sales Order Prefix !';
        document.getElementById('err4').innerHTML = 'This field should not be empty..Job Priority !';
        document.getElementById('err5').innerHTML = 'This field should not be empty..Job Criteria !';
        document.getElementById('err6').innerHTML = 'This field should not be empty..Approved By !';
        document.getElementById('err7').innerHTML = 'This field should not be empty..Plate Type !';

        document.getElementById('TxtJobReference').focus();
        document.getElementById('TXtJobtype').focus();
        document.getElementById('TXtSalesPrefix').focus();
        document.getElementById('TXtJobPriority').focus();
        document.getElementById('TXtJobcriteriaNew').focus();
        document.getElementById('TXtApproved').focus();
        document.getElementById('TxtPlateType').focus();
        return false;
    }
    else {
        document.getElementById('err1').innerHTML = "";
        document.getElementById('err2').innerHTML = "";
        document.getElementById('err3').innerHTML = "";
        document.getElementById('err4').innerHTML = "";
        document.getElementById('err5').innerHTML = "";
        document.getElementById('err6').innerHTML = "";
        document.getElementById('err7').innerHTML = "";
    }

    //if (txtJobValueReference !== "" && txtJobType !== "" && txtJobPriority !== "" && txtJobSalesPrefix !== "" && txtJobPriority !== "" && txtJobApproved !== "") {
    //    ParameterValue = ;
    //}

    var textValue = "";
    if (CurrentBlock === "Job Reference") {
        textValue = document.getElementById('TxtJobReference').value;
    }
    else if (CurrentBlock === "Job Type") {
        textValue = document.getElementById('TXtJobtype').value;
    }
    else if (CurrentBlock === "Sales Order Prefix") {
        textValue = document.getElementById('TXtSalesPrefix').value;
        textJobType = textTypeName = "Booking Prefix";
    }
    else if (CurrentBlock === "Job Priority") {
        textValue = document.getElementById('TXtJobPriority').value;
    }
    else if (CurrentBlock === "Job Criteria") {
        textValue = document.getElementById('TXtJobcriteriaNew').value;
    }
    else if (CurrentBlock === "Approved By") {
        textValue = document.getElementById('TXtApproved').value;
    } else if (CurrentBlock === "Plate Type") {
        textValue = document.getElementById('TxtPlateType').value;
    }


    var ArrayObjectData = [];
    var ObjectOptionalData = {};

    ObjectOptionalData.ParameterType = textJobType;
    ObjectOptionalData.ParameterName = textTypeName;
    ObjectOptionalData.ParameterValue = textValue;

    ArrayObjectData.push(ObjectOptionalData);
    swal({
        title: "Please Confirm..!",
        text: "Do you want to Save this record",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Save!",
        closeOnConfirm: true
    }, function () {
        $.ajax({
            type: "POST",
            url: "UserAuthentication.asmx/InsertRecordData",
            data: '{JsonObjectReference:' + JSON.stringify(ArrayObjectData) + ',PID:'+ ParameterID +'}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                res = res.replace(/"d":/g, '');
                res = res.replace(/"/g, '');
                if (res === "Success") {
                    swal("Success..", "Data has been saved..!", "success");
                    $("#CreateButton").click();
                } else if (res === "Duplicate Data") {
                    swal("Duplicate Entry..", "Duplicate data found...!", "warning");
                } else if (res.includes("used in other process")) {
                    swal("Further Used Can't Update..", res, "warning");
                } else {
                    swal("Error..", "Something Wrong...!", "error");
                }
            }
        });
    });
});

$("#DeleteButton").click(function () {
    if (ParameterID > 0 && OnSelectionRow.length > 0) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this!",
            type: "error",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function () {
            $.ajax({
                type: "POST",
                url: "UserAuthentication.asmx/DeleteParameterData",
                data: '{ParameterID: ' + ParameterID + ',JsonObjectReference:' + JSON.stringify(OnSelectionRow) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"d":/g, '');
                    res = res.replace(/{/g, '');
                    res = res.replace(/}/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    if (res === "success") {
                        swal("Deleted..", "Data has been successfully deleted..!", "success");
                        $("#CreateButton").click();
                    } else if (res.includes("used in other")) {
                        swal("Used Further", res, "warning");
                    }
                    if (res === "fail") {
                        swal("Error..", "Something Wrong...!", "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    alert(JSON.stringify(jqXHR));
                }
            });
        });
    }
    else {
        swal("warning", "Please the select the row firstly if you want to delete the row....!", "warning");
        return false;
    }
});

$("#CreateButton").click(function () {
    ParameterID = 0, OnSelectionRow = [];
    $("#divInputs input").each(function () {
        if (this.type === "text" || this.type === "number") {
            document.getElementById(this.id).value = "";
        }
    });
    GetDataCurrentTab();
});