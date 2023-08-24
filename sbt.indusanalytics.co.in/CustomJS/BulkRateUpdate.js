"Use Strict";
$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 310,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});

$("#grid").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "multiple" },
    filterRow: { visible: true },
    scrolling: {
        mode: 'virtual',
    },
    columns: [
        { dataField: "ItemName", caption: "Item Name", allowEditing: false },
        { dataField: "PurchaseUnit", caption: "Purchase Unit", allowEditing: false },
        { dataField: "PurchaseRate", caption: "Purchase Rate", allowEditing: true }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    editing: {
        allowUpdating: true,
        mode: 'cell',

    },
});


LoadEnquiry();
function LoadEnquiry() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceOthers.asmx/LoadPapers",
            data: '{}',//
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var RES1 = JSON.parse(res.toString());
                $("#grid").dxDataGrid({ dataSource: RES1 });
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

$("#btnSave").click(function () {
    var gridInstance = $("#grid").dxDataGrid("instance");
    var selectedRowsData = gridInstance.getSelectedRowsData();
    if (selectedRowsData.length <= 0) {
        alert('Please select the paper first');
        return;
    }
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/SaveBulkRate",
        data: '{datas:' + JSON.stringify(selectedRowsData) + '}',//
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (res == "Success") {
                alert("Updated");
                location.reload();
            }
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });

});