"use strict";

var ProdType = ["For Release", "Released"];
$("#optionsSel").dxRadioGroup({
    items: ProdType,
    value: ProdType[0],
    layout: "horizontal",
    onValueChanged: function (e) {
        reloadGrid(e.value);
        if (e.value === "Released") {
            document.getElementById("BtnRelease").value = "Un-Release";
        } else {
            document.getElementById("BtnRelease").value = "Release";
        }
    }
});

reloadGrid(ProdType[0]);
function reloadGrid(e) {
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/ProductionReleaseList",
        data: '{type:' + JSON.stringify(e) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0027u0027/g, "''");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            $("#GridProductionsList").dxDataGrid({
                dataSource: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            alert(jqXHR);
        }
    });
}

$("#BtnRelease").click(function () {
    var Option = $("#optionsSel").dxRadioGroup("instance").option('value');
    var title;
    var GridProductionsList = $('#GridProductionsList').dxDataGrid('instance');
    var selectedRows = GridProductionsList.getSelectedRowsData();
    if (selectedRows.length <= 0) {
        swal("Invalid Selection!", "Please select any row for release or un-release jobs", "warning");
        return;
    }
    if (Option === "For Release") {
        title = "for release selected jobs.?";
    } else {
        title = "for un-release selected jobs.?";
    }
    swal({
        title: "Confirmation..",
        text: 'Are you sure ' + title,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            var BKID = $("#TxtBKID").text();
            $.ajax({
                type: "POST",
                url: "WebService_OtherMaster.asmx/ProductionReleaseUpdate",
                data: '{type:' + JSON.stringify(Option) + ',BKID:' + JSON.stringify(BKID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (results) {
                    var res = JSON.stringify(results);
                    res = res.replace(/"{"d":/g, '');
                    res = res.replace(/}"/g, '');
                    if (res === "Success") {
                        swal("Success!", "Your data updated successfully", "success");
                    }
                    location.reload();
                },
                error: function errorFunc(jqXHR) {
                    alert(jqXHR);
                }
            });
        });
});

$("#GridProductionsList").dxDataGrid({
    sorting: {
        mode: "multiple"
    },
    paging: false,
    showBorders: true,
    showRowLines: true,
    selection: { mode: "multiple" },
    height: function () {
        return window.innerHeight / 1.3;
    },
    filterRow: { visible: true, applyFilter: "auto" },
    scrolling: { mode: 'virtual' },
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
    columns: [
        { dataField: "LedgerName", visible: true, caption: "Client" },
        { dataField: "JobName", visible: true, caption: "Job Name" },
        { dataField: "JobBookingNo", visible: true, caption: "Job Booking No" },
        { dataField: "BookingNo", visible: true, caption: "Quote No" },
        { dataField: "JobBookingDate", visible: true, caption: "Job Date" },
        { dataField: "OrderQuantity", visible: true, caption: "Order Qty" },
        { dataField: "IsJobStarted", visible: true, caption: "Job Started" },
        { dataField: "UserName", visible: true, caption: "User By" },
        { dataField: "ReleasedDate", visible: true, caption: "Released Date" },
        { dataField: "JCBY", visible: true, caption: "JC By" }
    ],
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            $("#TxtBKID").text(
                $.map(data, function (value) {
                    return value.JobBookingID;
                }).join(','));
        }
        else {
            $("#TxtBKID").text("");
        }
    }
});