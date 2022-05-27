
var SMID = "";

$("#SelectBoxSupplierName").dxSelectBox({
    items: [],
    placeholder: "Select--",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerID',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        SMID = "";
        SMID = data.value;
        if (SMID == "" || SMID == undefined || SMID == null) { } else { }
    }
})

function Categorybar(OPT) {
    var CategoryButton = document.getElementById(OPT.id);

    if (OPT.id === "FilterCategory") {
        document.onclick = function (e) {
            if (e.target === CategoryButton) {
                var Categorypopup = document.getElementById('FilterCategorySidenav');
                var Categoryoverlay = document.getElementById('CategorybackgroundOverlay');

                if (Categorypopup.style.width === "200px") {
                    Categorypopup.style.width = "0";

                    if (document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px") {
                        Categoryoverlay.style.display = 'none';
                    }
                    else {
                        Categoryoverlay.style.display = 'block';
                    }
                    document.getElementById('TabFilterCategoryLI').setAttribute("class", "");
                }
                else {
                    document.getElementById('TabFilterCategoryLI').setAttribute("class", "active");
                    Categorypopup.style.width = "200px";
                    Categoryoverlay.style.display = 'block';
                }
            }
        };
    }
}

function closeCategory() {
    document.getElementById("FilterCategorySidenav").style.width = "0";
    if ((document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px")) {
        document.getElementById('CategorybackgroundOverlay').style.display = 'none';
    }
    else {
        document.getElementById('CategorybackgroundOverlay').style.display = 'block';
    }
    document.getElementById('TabFilterCategoryLI').setAttribute("class", "");
}

$.ajax({
    type: "POST",
    url: "WebService_SupplierRateSetting.asmx/SupplierName",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var SM = JSON.parse(res);

        $("#SelectBoxSupplierName").dxSelectBox({
            items: SM
        });
    }
});

//Dynamic Maser UL
getMasterLIST();
function getMasterLIST() {
    try {
        // $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var currentMaster = "";
        $.ajax({
            type: "POST",
            url: "WebService_SupplierRateSetting.asmx/MasterListSupplierRate",
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
                // alert(RES1);
                var MasterList = "";
                document.getElementById("CategoryUL").innerHTML = "";
                for (var i = 0; i < RES1.length; i++) {
                    MasterList += "<li role='presentation' id=ChooseMaster" + RES1[i].ItemGroupID + " style='width:100%'><a id=" + RES1[i].ItemGroupID + "  onclick='CategorySM(this);' data-toggle='tab' style='background-color:none;font-size:12px;cursor:pointer'>" + RES1[i].ItemGroupName + "</a></li>";
                }
                $("#CategoryUL").append("<ul class='nav nav-tabs tab-col-red' role='tablist' style='color: green; border: none'><li role='presentation' style='border-bottom:1px solid #42909A;width:100%;text-align:center'><label style='color: #42909A; margin-left: .5em;font-size:12px;font-weight:600'>Item Category</label></li>" + MasterList + " </ul> ");

                //if (currentMaster != "") {
                //    document.getElementById(currentMaster).className = "active";
                //}
            }
        })
    } catch (e) {
        //  $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

function CategorySM(SM) {
    var CategoryID = SM.id;
    document.getElementById("LOADER").style.display = "block";
    document.getElementById('FilterCategorySidenav').style.width = "0";
    document.getElementById('CategorybackgroundOverlay').style.display = 'none';
    $.ajax({
        type: "POST",
        url: "WebService_SupplierRateSetting.asmx/SupplierRateSettingGrid",
        data: '{masterID:' + JSON.stringify(CategoryID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);

            document.getElementById("LOADER").style.display = "none";

            if (res == "") {
                var RES1 = [];
            } else
                var RES1 = JSON.parse(res);

            if (RES1 === [] || RES1 === "") {
                RES1 = [];
            }

            ShowOperationGrid(RES1);
        }
    });
}

var OprIds = [];
function ShowOperationGrid(dataSource) {
    $("#AutoLoadList1Grid").dxDataGrid({                  //// GridOperation  gridopr
        dataSource: {
            store: {
                type: "array",
                data: dataSource,
                key: "ItemID"
            }
        },
        allowEditing: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        sorting: { mode: 'none' },
        columns: [{ dataField: "ItemID", visible: false, width: 0 },
        { dataField: "ItemName" },
        { dataField: "PurchaseUnit", caption: "Purchase Unit" },
        { dataField: "PurchaseRate", caption: "Last Purchase Rate" },
        // { dataField: "NewPurchaseRate", caption: "Purchase Rate" },
        //{ dataField: "MinimumCharges", visible: false },
        //{ dataField: "SetupCharges", visible: false },
        //{ dataField: "PrePress", visible: false },
        //{ dataField: "ChargeApplyOnSheets", visible: false },
        //{
        //    dataField: "RateFactor", fixedPosition: "right", fixed: true,
        //    lookup: {
        //        dataSource: function (options) {
        //            return {
        //                store: slabNames,
        //                filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
        //            };
        //        },
        //        displayExpr: "RateFactor",
        //        valueExpr: "RateFactor"
        //    },
        //    width: 100
        //},
        {
            dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 40,
            cellTemplate: function (container, options) {
                $('<div>').addClass('fa fa-plus customgridbtn').appendTo(container);
            }
        }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "NewPurchaseRate") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
        },
        showRowLines: true,
        showBorders: true,
        loadPanel: {
            enabled: false
        },
        scrolling: {
            mode: 'infinite'
        },
        paging: {
            pageSize: 100
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Add") {
                try {
                    var dataGrid = $('#AlocatedList2Grid').dxDataGrid('instance');
                    if (dataGrid.totalCount() > 0) {
                        for (var k = 0; k <= dataGrid.totalCount() - 1; k++) {
                            var cellvalItemID = dataGrid.options.dataSource[k].ItemID;
                            if (clickedCell.data.ItemID == cellvalItemID) {
                                //text = "This row allready added..Please add another row..";
                                //alert(text);
                                DevExpress.ui.notify("This row already added..Please add another row..!", "error", 1000);
                                return false;
                            }
                        }
                        var newdata = [];
                        newdata.ItemID = clickedCell.data.ItemID;
                        newdata.ItemName = clickedCell.data.ItemName;
                        newdata.PurchaseRate = clickedCell.data.PurchaseRate;
                        // newdata.NewPurchaseRate = clickedCell.data.NewPurchaseRate;
                        newdata.PurchaseUnit = clickedCell.data.PurchaseUnit;

                        var clonedItem = $.extend({}, newdata);
                        dataGrid.options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                        dataGrid.refresh(true);

                        OprIds.push(clickedCell.data.ProcessID);

                        //dataGrid.events.preventDefault();
                        DevExpress.ui.notify("List added..!", "success", 1000);
                        clickedCell.component.clearFilter();
                    }
                    else {
                        var newdata = [];
                        newdata.ItemID = clickedCell.data.ItemID;
                        newdata.ItemName = clickedCell.data.ItemName;
                        newdata.PurchaseRate = clickedCell.data.PurchaseRate;
                        // newdata.NewPurchaseRate = clickedCell.data.NewPurchaseRate;
                        newdata.PurchaseUnit = clickedCell.data.PurchaseUnit;

                        var clonedItem = $.extend({}, newdata);
                        dataGrid.options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                        dataGrid.refresh(true);

                        OprIds.push(clickedCell.data.ProcessID);

                        //dataGrid.events.preventDefault();
                        DevExpress.ui.notify("List added..!", "success", 1000);
                        clickedCell.component.clearFilter();
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
            e.rowElement.css({ height: 15 });
        },

    });
    //AlocatedList2Grid
    $("#AlocatedList2Grid").dxDataGrid({
        dataSource: [],
        columnAutoWidth: true,
        allowColumnResizing: true,
        sorting: { mode: 'none' },
        columns: [{ dataField: "ItemID", visible: false, width: 0 }, { dataField: "ItemName" },
        { dataField: "PurchaseUnit" },
        { dataField: "PurchaseRate", caption: "Last Purchase Rate" },
        { dataField: "NewPurchaseRate", caption: "New Purchase Rate" },
        {
            dataField: "Delete", fixedPosition: "right", fixed: true, width: 50,
            cellTemplate: function (container, options) {
                $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
            }
        }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "NewPurchaseRate") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
        },
        showRowLines: true,
        showBorders: true,
        scrolling: {
            mode: 'virtual'
        },
        filterRow: { visible: false },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Delete") {
                try {
                    clickedCell.component.options.editing.texts.confirmDeleteMessage = "";
                    clickedCell.component.deleteRow(clickedCell.rowIndex);
                    //clickedCell.component.refresh(true);
                    var index = OprIds.indexOf(clickedCell.data.ProcessID);
                    if (index > -1) {
                        OprIds.splice(index, 1);
                        DevExpress.ui.notify("Selected list removed..!", "error", 1000);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        height: function () {
            return window.innerHeight / 1.4;
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        }
    });
}

