"use strict";
var GBLID = 0;
var IsEdit = false;
var LedgerID = '';
var VendorID = 0;


var queryString = new Array();
$(function () {
    if (queryString.length === 0) {
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]).replace(/"/g, '');
                queryString[key] = value;
            }
        }
    }

    if (queryString["id"] !== null && queryString["id"] !== undefined) {
        VendorID = Number(queryString["id"]);
        MachineData();
    }
});

const tabsInstance = $('#tabs > .tabs-container').dxTabs({
    dataSource: [],
    selectedIndex: 0,
    onItemClick(e) {
        VendorMachineGrid(e.itemData.id, VendorID)
    }
}).dxTabs('instance');


function MachineData() {
    $.ajax({
        type: "POST",
        url: 'WebServiceDashboard.asmx/MachineData',
        data: '{ LedgerID: ' + JSON.stringify(VendorID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
           
            $('#tabs > .tabs-container').dxTabs({
                dataSource: RES1
            });
            VendorMachineGrid(RES1[0].id, VendorID)
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}
function Slabgrid(existslab) {
    $("#VMAGridData").dxDataGrid({
        dataSource: existslab,
        showBorders: true,
        paging: {
            enabled: false
        },
        showRowLines: true,
        sorting: {
            mode: "none"
        },
        filterRow: { visible: true, applyFilter: "auto" },
        editing: {
            mode: "cell",
            allowDeleting: false,
            allowAdding: false,
            allowUpdating: false
        },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        },
        columns: [
            {
                dataField: "PaperGroup", visible: true, caption: "Paper Group", width: 200,
                validationRules: [{ type: "required" }, {
                    type: "required",
                    message: 'Paper Group is Required'
                }]
            },
            {
                dataField: "SizeW", visible: true, caption: "Size W", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SizeL", visible: true, caption: "Size L", width: 80,
                validationRules: [{
                    type: "required"
                }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeFrom", visible: true, caption: "Sheet From", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SheetRangeTo", visible: true, caption: "Sheet To", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "MinCharges", visible: true, caption: "Min Charges", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Rate", visible: true, caption: "Rate", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric OR decimal value..!'
                }]
            },
            {
                dataField: "PlateCharges", visible: true, caption: "CTP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "PSPlateCharges", visible: true, caption: "PS", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "CTCPPlateCharges", visible: true, caption: "CTCP", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "Wastage", visible: true, caption: "Wastage", width: 100,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorFrontCharges", visible: true, caption: "SP.Color F", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            },
            {
                dataField: "SpecialColorBackCharges", visible: true, caption: "SP.Color B", width: 80,
                validationRules: [{ type: "required" }, {
                    type: "numeric",
                    message: 'You must enter only numeric value..!'
                }]
            }
        ]
    });
}
Slabgrid([])
function VendorMachineGrid(MachineID, VendorID) {
    $.ajax({
        type: "POST",
        url: "WebServiceDashboard.asmx/VendorMachineGrid",
        data: '{MachineID:' + JSON.stringify(MachineID) + ',VendorID:' + JSON.stringify(VendorID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            console.log(RES1);
            Slabgrid(RES1);
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}