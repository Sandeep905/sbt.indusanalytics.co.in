"use strict";

var imgCount = "", row = "";
var hideDelBtn = "";
var r_index;

$("#UpladBtnFirst").click(function () {

    var fileUpload2 = $("#AttachDesign").get(0);
    var attachName = document.getElementById("AttachDesign").value;

    attachName = attachName.split('\\');
    var len = attachName.length;

    var files = fileUpload2.files;

    var test = new FormData();
    for (var i = 0; i < files.length; i++) {
        test.append(files[i].name, files[i]);
    }

    $.ajax({
        url: "FileAttachmentHandler.ashx",
        type: "POST",
        contentType: false,
        processData: false,
        data: test,
        // dataType: "json",
        success: function (result) {
            var tbl = document.getElementById("tblDetails");

            if (result === "" || result === undefined || result === null) {
                return;
            } else {
                var tblLength = tbl.rows.length;
                row = "";

                if (tblLength <= 1) {
                    for (var j = 0; j <= tblLength; j++) {
                        if (j === 1) {
                            row += "<tr><td style='display:none'>" + result + "</td><td style='display:none'>" + attachName[len - 1] + "</td><td class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><a href=" + result + " download='" + attachName[len - 1] + "' target='_blank'>" + attachName[len - 1] + "</a></td><td class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='button' id='" + tbl.rows.length + "'" + "value='Delete' class='btn btn-danger' onclick='deleteRow(this)'/></td></tr>";
                        }
                        else if (j === 0) {
                            document.getElementById("tblDetails").innerHTML = "";
                            row = "<tr style='display:none'><td></td><td></td><td></td><td></td></tr>";
                        }
                    }
                } else if (tbl.rows.length > 1) {
                    for (var i = 0; i <= tbl.rows.length - 1; i++) {
                        if (i === 0) {
                            row += "<tr><td style='display:none'>" + tbl.rows[i].cells[0].innerHTML + "</td><td style='display:none'>" + tbl.rows[i].cells[1].innerHTML + "</td><td></td><td></td></tr>";
                        }
                        else {
                            if (tbl.rows[i].cells[1].innerHTML === "Saved Attachment") {
                                row += "<tr><td style='display:none'>" + tbl.rows[i].cells[0].innerHTML + "</td><td style='display:none'>" + tbl.rows[i].cells[1].innerHTML + "</td><td class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><a href=" + tbl.rows[i].cells[0].innerHTML + " download='" + attachName[len - 1] + "' target='_blank'>" + tbl.rows[i].cells[1].innerHTML + "</a></td><td class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='button' id='" + tbl.rows[i].cells[3].innerHTML + "'" + "value='Delete' class='btn btn-danger' onclick='deleteRow(this)' style = 'Display:none'/></td></tr>";
                            } else {
                                row += "<tr><td style='display:none'>" + tbl.rows[i].cells[0].innerHTML + "</td><td style='display:none'>" + tbl.rows[i].cells[1].innerHTML + "</td><td class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><a href=" + tbl.rows[i].cells[0].innerHTML + " download='" + attachName[len - 1] + "' target='_blank'>" + tbl.rows[i].cells[1].innerHTML + "</a></td><td class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='button' id='" + tbl.rows[i].cells[3].innerHTML + "'" + "value='Delete' class='btn btn-danger' onclick='deleteRow(this)'" + hideDelBtn + " /></td></tr>";
                            }
                        }
                    }
                    row += "<tr><td style='display:none'>" + result + "</td><td style='display:none'>" + attachName[len - 1] + "</td><td class='col-lg-10 col-md-10 col-sm-10 col-xs-10'><a href=" + result + " download='" + attachName[len - 1] + "' target='_blank'>" + attachName[len - 1] + "</a></td><td class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='button' id='" + tbl.rows.length + "'" + "value='Delete' class='btn btn-danger' onclick='deleteRow(this)' /></td></tr>";
                    document.getElementById("tblDetails").innerHTML = "";
                }

                $("#tblDetails").append(row);

            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    return true;
});

function deleteRow(row) {
    r_index = row.parentNode.parentNode.rowIndex;
    var tbl = document.getElementById("tblDetails");

    swal({
        title: "Deleting..",
        text: "Are you sure you want to delete this file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: true
    }, function () {
        var tbl = document.getElementById("tblDetails");
        var fileUpload = tbl.rows[r_index].cells[0].innerHTML;

        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/DeleteQuoteAttachedFiles",
            data: '{fileUpload:' + JSON.stringify(fileUpload) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                document.getElementById('tblDetails').deleteRow(r_index);
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
        return false;
    });

    if (tbl.rows.length === 1) {
        document.getElementById("tblDetails").innerHTML = "";
        var statment = "No Attachment";
        row += "<tr><td></td><td>" + statment + "</td><td></td></tr>";

        $("#tblDetails").append(row);
    }
}

tableHeading();
function tableHeading() {
    var tblDetails = document.getElementById("tblDetails");

    if (Number(tblDetails.rows.length) <= 0 || tblDetails.rows.length === null || tblDetails.rows.length === "") {
        var statment = "No Attachment";
        row += "<tr><td></td><td>" + statment + "</td><td></td></tr>";

        $("#tblDetails").append(row);
    }
}



