
let ProductCatalogID = 0;
let CategoryID = 0;
let OprDatap = [];
var SelectedProductData = [];
var AllContents = [];
var processids = '';
var suggestedprocessids = '', GBLLoginCompanyState = "";
var Defaultprocessids = '';
var ProjectBookingID = 0, SalesManagerId = 0;
var EnquiryID = 0;
var NetcostOffset = 0;
var EditMode = false;
var Isprocessed = 0;
var GBLClientData = [];
var GBLContents = [];
let GBLCategoryIDForProcess = '';


$("#SalesCordinator").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    valueExpr: "LedgerId",
    displayExpr: "LedgerName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        //if (data.value !== null) {
        //    $.ajax({
        //        type: 'POST',
        //        async: false,
        //        url: "WebServiceProductMaster.asmx/GetSalesPerson",
        //        dataType: 'json',
        //        contentType: "application/json; charset=utf-8",
        //        data: "{ID:" + Number(data.value) + "}",
        //        crossDomain: true,
        //        success: function (results) {
        //            if (results.d === "500") return;
        //            var res = results.d.replace(/\\/g, '');
        //            res = res.substr(1);
        //            res = res.slice(0, -1);
        //            var RES1 = JSON.parse(res.toString());
        //            $("#SelSalesPerson").dxSelectBox({
        //                dataSource: RES1,
        //            });

        //        },
        //        error: function errorFunc(jqXHR) {
        //            // alert(jqXHR.message);
        //        }
        //    });
        //} else {
        //    document.getElementById("SalesManager").innerText = "";
        //    $("#SelSalesPerson").dxSelectBox({
        //        dataSource: [],
        //    });
        //}
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Client is required' }]
});
$("#SelSalesPerson").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    valueExpr: "LedgerId",
    displayExpr: "LedgerName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {

        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Sales person is required' }]
});
$("#ClientCordinator").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    valueExpr: "ConcernPersonID",
    displayExpr: "Name",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {
            var result = $.grep(data.component._dataSource._store._array, function (ex) { return ex.ConcernPersonID === data.value; });
            $.ajax({
                type: 'POST',
                async: false,
                url: "WebServiceProductMaster.asmx/GetSalesCordinatorAndSalesExicutive",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{SCID:" + Number(result[0].SalesCordinatorID) + ",SEID:" + Number(result[0].SalesPersonId) + "}",
                crossDomain: true,
                success: function (results) {
                    if (results.d === "500") return;
                    var res = results.d.replace(/\\/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res.toString());
                    $("#SalesCordinator").dxSelectBox({
                        dataSource: RES1.SalesCordinator,
                        value: RES1.SalesCordinator[0].LedgerId
                    });
                    $("#SelSalesPerson").dxSelectBox({
                        dataSource: RES1.SalesExcutive,
                        value: RES1.SalesExcutive[0].LedgerId
                    });
                },
                error: function errorFunc(jqXHR) {
                    // alert(jqXHR.message);
                }
            });
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Sales person is required' }]
});
$('#RadioEnquiry').dxRadioGroup({
    items: ["Pending", "Processed", "AutoRejected"],
    value: "Pending",
    layout: 'horizontal',
    onValueChanged: function (e) {
        if (e.value == "Processed")
            Isprocessed = 1;
        else if (e.value == "Pending")
            Isprocessed = 0;
        else
            Isprocessed = -1

        LoadEnquiry();

    }
});
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
$("#SelClient").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    valueExpr: "LedgerID",
    displayExpr: "LedgerName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        document.getElementById("TxtClientCity").value = "";
        if (data.value !== null) {
            var result = $.grep(data.component._dataSource._store._array, function (ex) { return ex.LedgerID === data.value; });
            if (result.length === 1) {
                document.getElementById("TxtClientCity").value = result[0].City;
                //SalesManager
            }

            $.ajax({
                type: 'POST',
                async: false,
                url: "WebServiceProductMaster.asmx/GetSalesManagerAndClientCordinator",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{Id:" + Number(data.value) + "}",
                crossDomain: true,
                success: function (results) {
                    if (results.d === "500") return;
                    var res = results.d.replace(/\\/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    var RES1 = JSON.parse(res.toString());
                    if (RES1.SalesManager.length > 0) {
                        document.getElementById("SalesManager").innerText = "Sales Manager -:  " + RES1.SalesManager[0].LedgerName;
                        SalesManagerId = RES1.SalesManager[0].LedgerId;
                        $("#ClientCordinator").dxSelectBox({
                            dataSource: RES1.ClientCordinator,
                        });

                    }
                    //SalesManager
                },
                error: function errorFunc(jqXHR) {
                    // alert(jqXHR.message);
                }
            });
        } else {
            document.getElementById("SalesManager").innerText = "";
            $("#SalesCordinator").dxSelectBox({
                dataSource: [],
            });
            $("#SelSalesPerson").dxSelectBox({
                dataSource: [],
            });
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Client is required' }]
});


$("#Selvendor").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "VendorID",
    displayExpr: "VendorName",
    searchEnabled: true,
    showClearButton: true,
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Vendor name is required' }]
});

$("#SelvendorOffset").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "VendorID",
    displayExpr: "VendorName",
    searchEnabled: true,
    showClearButton: true,
    disabled: true,
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Vendor name is required' }]
});

$("#Selvendorflex").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "VendorID",
    displayExpr: "VendorName",
    searchEnabled: true,
    showClearButton: true,
    disabled: true,
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Vendor name is required' }]
});

let CategoryData = [], ProductMasterList = [];

$.ajax({
    type: 'POST',
    async: false,
    url: "WebServiceProductMaster.asmx/GetProductMasterList",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: "{}",
    crossDomain: true,
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        ProductMasterList = JSON.parse(res.toString());
    },
    error: function errorFunc(jqXHR) {
        // alert(jqXHR.message);
    }
});


$("#gridOperation").dxDataGrid({                  //// GridOperation  gridopr
    dataSource: [],
    allowEditing: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    sorting: { mode: 'single' },
    selection: { mode: "none", allowSelectAll: false },
    columns: [{ dataField: "ProcessName", allowEditing: false },
    { dataField: "Rate", width: 50, visible: false, allowEditing: false },
    {
        dataField: "RateFactor", fixedPosition: "right", fixed: true, allowEditing: false,
        lookup: {
            dataSource: function (options) {
                return {
                    store: ProcessSlabs,
                    filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
                };
            },
            displayExpr: "RateFactor",
            valueExpr: "RateFactor"
        },
        width: 120
    },
    { dataField: "TypeofCharges", allowEditing: false },
    { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80, allowEditing: false },
    {
        dataField: "Delete", fixedPosition: "right", fixed: true, width: 50,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    },
    ],
    paging: {
        pageSize: 10
    },
    //selectedRowKeys: [$("#OperId").text()],
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: true
    },
    editing: {
        mode: 'cell',
        allowUpdating: false,

    },
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 3.5;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data) {
            $("OperIdPQ").text(
                $.map(data, function (value) {
                    return value.ProcessID;
                }).join(','));
        }
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.caption === "Delete") {
            try {
                var dataGrid = $('#gridSelOperation').dxDataGrid('instance');
                var newdata = [];
                newdata.ProcessID = clickedCell.data.ProcessID;
                newdata.ProcessName = clickedCell.data.ProcessName;
                newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                newdata.RateFactor = clickedCell.data.RateFactor;
                newdata.TypeofCharges = clickedCell.data.TypeofCharges;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.store.data.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                DevExpress.ui.notify("Process removed..!", "error", 1000);

            } catch (e) {
                console.log(e);
            }
        }
    },
});

$("#UnitProcessDefault").dxDataGrid({                  //// GridOperation  gridopr
    dataSource: [],
    allowEditing: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    sorting: { mode: 'single' },
    selection: { mode: "none", allowSelectAll: false },
    columns: [{ dataField: "ProcessName", allowEditing: false },
    { dataField: "Rate", width: 50, visible: false, allowEditing: false },
    {
        dataField: "RateFactor", fixedPosition: "right", fixed: true, allowEditing: false,
        lookup: {
            dataSource: function (options) {
                return {
                    store: ProcessSlabs,
                    filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
                };
            },
            displayExpr: "RateFactor",
            valueExpr: "RateFactor"
        },
        width: 120
    },
    { dataField: "TypeofCharges", allowEditing: false },
    { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80, allowEditing: false, visible: false },
    {
        dataField: "Delete", fixedPosition: "right", fixed: true, width: 50,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    },
    ],
    paging: {
        pageSize: 10
    },
    //selectedRowKeys: [$("#OperId").text()],
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: true
    },
    editing: {
        mode: 'cell',
        allowUpdating: false,

    },
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 4.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data) {
            $("OperIdPQ").text(
                $.map(data, function (value) {
                    return value.ProcessID;
                }).join(','));
        }
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.caption === "Delete") {
            try {
                var dataGrid = $('#UnitProcessSuggestion').dxDataGrid('instance');
                var newdata = [];
                newdata.ProcessID = clickedCell.data.ProcessID;
                newdata.ProcessName = clickedCell.data.ProcessName;
                newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                newdata.RateFactor = clickedCell.data.RateFactor;
                newdata.TypeofCharges = clickedCell.data.TypeofCharges;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.store.data.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

                DevExpress.ui.notify("Process removed..!", "error", 1000);

            } catch (e) {
                console.log(e);
            }
        }
    },
});

$.ajax({
    type: "POST",
    async: false,
    url: "WebService_OtherMaster.asmx/GetCategory",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        CategoryData = JSON.parse(res);
    }
});


// for byPass AI Costing - 06-12-2022 sndp 
function IsMaualCosting() {
    if (document.getElementById('vehicle1').checked == true) {
        $("#MannualUnitRate").removeAttr("disabled");
        document.getElementById('MannualUnitRate').value = 0;
        document.getElementById('gridContentPlansList').style.display = "none"; // for flex
        $("#SelvendorOffset").dxSelectBox({
            value: -1,
            disabled: false,
        });

    } else {
        $("#MannualUnitRate").attr("disabled", "disabled");
        document.getElementById('MannualUnitRate').value = 0;
        document.getElementById('gridContentPlansList').style.display = "block"; // for flex
        $("#SelvendorOffset").dxSelectBox({
            value: -1,
            disabled: true,
        });
    }
}

// for byPass AI Costing - 06-12-2022 sndp 
function IsMaualCostingflex() {
    if (document.getElementById('IsManualcostflex').checked == true) {
        $("#MannualUnitRateflex").removeAttr("disabled");
        document.getElementById('MannualUnitRateflex').value = 0;
        document.getElementById('gridContentPlansList').style.display = "none"; // for flex
        $("#Selvendorflex").dxSelectBox({
            value: -1,
            disabled: false,
        });

    } else {
        $("#MannualUnitRateflex").attr("disabled", "disabled");
        document.getElementById('MannualUnitRateflex').value = 0;
        document.getElementById('gridContentPlansList').style.display = "block"; // for flex
        $("#Selvendorflex").dxSelectBox({
            value: -1,
            disabled: true,
        });
    }
}

let ObjProductHSNGrp = [];
$.ajax({
    type: "POST",
    async: false,
    url: "WebserviceOthers.asmx/GetProductHSNGroups",
    data: '{Category:"Finish Goods"}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjProductHSNGrp = JSON.parse(res);
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

$.ajax({                //// Add All Active Contents
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetAllContents',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    crossDomain: true,
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        //alert(res);
        var RES1 = JSON.parse(res);
        AllContents = RES1;
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});


$("#GridShowlistLoadFromEnquiry").dxDataGrid({
    dataSource: [],
    keyExpr: 'EnquiryID',
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    filterRow: { visible: true },
    columns: [
        { dataField: "EnquiryNo", caption: "Enquiry No", width: 180 },
        { dataField: "ProjectName", caption: "Contant Name", width: 180 },
        { dataField: "ProductName1", caption: "Product Name", width: 180 },
        { dataField: "LedgerName", caption: "Client" },
        { dataField: "SalesLedgerName", caption: "Sales Person" },
        { dataField: "ProductName", caption: "Product Name" },
        { dataField: "Quantity", caption: "Quantity" },
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.21;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            document.getElementById("BookingID").value = data[0].EnquiryID;
            EnquiryID = data[0].EnquiryID;
        }
    }
});
$("#BtnLoadFromEnquiry").click(function (e) {
    LoadEnquiry();
});
function LoadEnquiry() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            async: false,
            type: "POST",
            url: "WebServiceProductMaster.asmx/GetEnquiryList",
            data: '{Isprocessed:' + Isprocessed + '}',//
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());

                $("#GridShowlistLoadFromEnquiry").dxDataGrid({ dataSource: RES1 });
                document.getElementById('BtnLoadFromEnquiry').setAttribute("data-toggle", "modal");
                document.getElementById('BtnLoadFromEnquiry').setAttribute("data-target", "#modalLoadFromEnquiry");
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });

    } catch (e) {
        console.log(e);
    } finally {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

function Getinputsizess(ID, Type) {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            async: false,
            type: 'post',
            url: 'WebServiceProductMaster.asmx/GetInputSizess',
            dataType: 'text',
            contentType: "application/json; charset=utf-8",
            data: '{ID:' + ID + '}',
            crossDomain: true,
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/":,/g, '":null,');
                res = res.replace(/":}/g, '":null}');
                //res = res.replace(/}/g, '');
                //res = res.replace(/{/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(23, -4);
                if (res.includes("error code:404")) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    DevExpress.ui.notify("Data not found", "error", 1000);
                    return;
                }
                GblInputValues = {};
                var JobValues = res.split('AndOr');
                for (var key in JobValues) {
                    var spKey = JobValues[key].split('=');
                    if (spKey[0] === "ItemPlanGsm") {
                        GblInputValues[spKey[0]] = Number(spKey[1]);
                    } else if (spKey[0] !== "Id")
                        GblInputValues[spKey[0]] = spKey[1];
                }
                if (Type === "Offset") {
                    saveContentsSizeValues(GblInputValues);
                    readContentsSizeValues(GblInputValues.PlanContName)
                    return
                }
                var gridProductData = $('#gridProductList').dxDataGrid('instance');
                for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
                    if (gridProductData._options.dataSource[i].EnquiryIDDetail == ID)
                        if (res != "ul")
                            gridProductData._options.dataSource[i].ProductInputSizes = JSON.stringify(JSON.parse(res))
                }


                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                $("#gridProductConfig").dxDataGrid({ dataSource: JSON.parse(res) });

            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        });

    } catch (e) {
        console.log(e);
    }
}
$("#BtnLoadFromListt").click(function () {
    var DBDeleteRequest = window.indexedDB.deleteDatabase("localstore");
    DBDeleteRequest.onerror = function (event) {
        console.log("Error deleting database.");
    };
    DBDeleteRequest.onsuccess = function (event) {
        console.log("Database deleted successfully");
    };
    var datasource = $('#GridShowlistLoadFromEnquiry').dxDataGrid('instance')._options.dataSource;
    datasource = $.grep(datasource, function (ex) { return ex.EnquiryID === Number(document.getElementById("BookingID").value) })

    if (datasource.length <= 0) {
        alert('Please Select Enquiry :)');
        return;
    }
    if (Isprocessed == 1) {
        alert("You can't load this enquiry, Quotation is already created");
        return;
    }
    //document.getElementById("BookingID").value

    $("#SelClient").dxSelectBox({
        value: datasource[0].LedgerID
    });
    $("#ClientCordinator").dxSelectBox({
        value: datasource[0].ClientCordinatorID
    });

    $("#SalesCordinator").dxSelectBox({
        value: datasource[0].SalesCordinatorId
    });
    SalesManagerId = datasource[0].SalesManagerId;

    $("#SelSalesPerson").dxSelectBox({
        value: datasource[0].SalesPersonID
    });
    document.getElementById('TxtProjectName').value = datasource[0].ProjectName;
    document.getElementById('TxtPaymentTerms').value = datasource[0].CreditDays;
    document.getElementById('TxtFreightAmount').value = datasource[0].FreightAmount;
    document.getElementById('TxtRemark').value = datasource[0].Narration;
    document.getElementById('TxtQuoteNo').value = datasource[0].EnquiryNo

    for (var i = 0; i < datasource.length; i++) {
        datasource[i].SequenceNo = i + 1;
    }
    $('#gridProductList').dxDataGrid({
        dataSource: datasource
    })

    datasource.map(val => {

        if (val.IsUnitProduct !== true) {
            if (val.IsOffsetProduct == true) {
                document.getElementById("PlanContName").innerHTML = val.ProductName
                document.getElementById("PlanContQty").innerHTML = val.Quantity;
                document.getElementById("ContentOrientation").innerHTML = $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === val.ProductCatalogID; })[0].ContentID; })[0].ContentName;

                Getinputsizess(val.EnquiryIDDetail, "Offset")
            } else {
                Getinputsizess(val.EnquiryIDDetail, "Flex")
            }
        }
    });
    EditMode = true;

    document.getElementById("BtnLoadFromListt").setAttribute("data-dismiss", "modal");
})
var grid = $("#gridProductList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    selection: { mode: "single" },
    columns: [
        {
            dataField: "CategoryID", caption: "Product Category",
            lookup: {
                dataSource: CategoryData,
                displayExpr: "CategoryName",
                valueExpr: "CategoryID"
            }, validationRules: [{ type: "required", message: "Product category is required" }], width: 150,
            setCellValue: function (rowData, value) {
                CategoryID = value;
                GblCategoryID = value;
                rowData.CategoryID = value;
                rowData.ProductCatalogID = null;
            }
        },
        {
            dataField: "ProductCatalogID", caption: "Content Name",
            lookup: {
                dataSource: function (options) {
                    return {
                        store: ProductMasterList,
                        //filter: options.data ? ["CategoryID", "=", options.data.CategoryID] : 0
                    };
                },
                displayExpr: "ProductName",
                valueExpr: "ProductCatalogID",
            },
            width: 180, validationRules: [{ type: "required", message: "Product name is required" }],
            setCellValue: function (rowData, value, e) {
                if (value != null)
                    rowData.ProductCatalogID = value;
                rowData.Rate = 0;
                rowData.Amount = 0;
                rowData.MiscPer = 0;
                rowData.ShippingCost = 0;
                var result = $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === value; });
                if (result.length === 1) {
                    rowData.ProductCatalogCode = result[0].ProductCatalogCode;
                    rowData.ProductDescription = result[0].ProductDescription;
                    rowData.ProductName = result[0].ProductName;
                    rowData.ProductName1 = result[0].ProductName;
                    rowData.CategoryID = result[0].CategoryID;
                    rowData.ProcessIDStr = result[0].ProcessIDStr;
                    rowData.ProductHSNID = result[0].ProductHSNID;
                    rowData.IsOffsetProduct = result[0].IsOffsetProduct;
                    rowData.IsUnitProduct = result[0].IsUnitProduct;
                    rowData.DefaultProcessStr = result[0].DefaultProcessStr;
                    var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === rowData.ProductHSNID; });
                    if (result.length === 1) {
                        rowData.GSTTaxPercentage = result[0].GSTTaxPercentage;
                    } else
                        rowData.GSTTaxPercentage = 0;
                } else {
                    rowData.ProductCatalogCode = "";
                    rowData.ProductDescription = "";
                    rowData.ProductName = "";
                    rowData.ProcessIDStr = "";
                    rowData.ProductHSNID = 0;
                    rowData.IsOffsetProduct = 0;
                    rowData.IsUnitProduct = 0;

                }
            }
        },
        { dataField: "ProductName1", caption: "Product Name", width: 180 },

        { dataField: "ProductCatalogCode", caption: "Product Code", allowEditing: false, width: 100 },
        { dataField: "ProductDescription", caption: "Product Description", allowEditing: false },
        { dataField: "Quantity", caption: "Quantity", allowEditing: true, dataType: "number", min: 0, validationRules: [{ type: "required", message: "Quantity is required" }] },
        {
            dataField: "PlanHere", caption: "Plan Here", allowEditing: false,
            cellTemplate(container, options) {
                $('<div>').addClass('btn')
                    .text("Click me to plan")
                    .on('dxclick', function () {
                        if (options.data.Quantity === undefined || Number(options.data.Quantity) <= 0) return;
                        SelectedProductData = options.data;

                        if (options.data.ProductName == "" || options.data.ProductName == undefined) {
                            var result = $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })
                            options.data.ProductName = result[0].ProductName
                        }

                        GBLCategoryIDForProcess = options.data.ProcessIDStr === undefined ? '' : options.data.ProcessIDStr;
                        $("#OperId").text(GBLCategoryIDForProcess);
                        document.getElementById("TxtProductName").value = options.data.ProductName === undefined ? '' : options.data.ProductName;
                        document.getElementById("TxtProductNameUnit").value = options.data.ProductName === undefined ? '' : options.data.ProductName;
                        document.getElementById("TxtPlanQty").value = options.data.Quantity === undefined ? 0 : options.data.Quantity;
                        document.getElementById("TxtPlanQtyUnit").value = options.data.Quantity === undefined ? 0 : options.data.Quantity;
                        document.getElementById("FinalTaxPer").value = options.data.GSTTaxPercentage === undefined ? 0 : options.data.GSTTaxPercentage;
                        document.getElementById("FinalTaxPer1").value = options.data.GSTTaxPercentage === undefined ? 0 : options.data.GSTTaxPercentage;
                        document.getElementById("FinalTaxPerUnit").value = options.data.GSTTaxPercentage === undefined ? 0 : options.data.GSTTaxPercentage;
                        document.getElementById("FinalMiscPer1").value = Number(options.data.MiscPer === undefined ? 0 : options.data.MiscPer);
                        document.getElementById("FinalMiscPer").value = Number(options.data.MiscPer === undefined ? 0 : options.data.MiscPer);
                        document.getElementById("FinalMiscPerUnit").value = Number(options.data.MiscPer === undefined ? 0 : options.data.MiscPer);
                        document.getElementById("FinalShipperCost").value = Number(options.data.ShippingCost === undefined ? 0 : options.data.ShippingCost);
                        document.getElementById("FinalShipperCost1").value = Number(options.data.ShippingCost === undefined ? 0 : options.data.ShippingCost);
                        document.getElementById("FinalShipperCostUnit").value = Number(options.data.ShippingCost === undefined ? 0 : options.data.ShippingCost);
                        document.getElementById("ProfitCost1").value = Number(options.data.ProfitCost === undefined ? 0 : options.data.ProfitCost);
                        document.getElementById("ProfitPer1").value = Number(options.data.ProfitPer === undefined ? 0 : options.data.ProfitPer);

                        document.getElementById("ProfitCost").value = Number(options.data.ProfitCost === undefined ? 0 : options.data.ProfitCost);
                        document.getElementById("ProfitPer").value = Number(options.data.ProfitPer === undefined ? 0 : options.data.ProfitPer);

                        document.getElementById("ProfitCostUnit").value = Number(options.data.ProfitCost === undefined ? 0 : options.data.ProfitCost);
                        document.getElementById("ProfitPerUnit").value = Number(options.data.ProfitPer === undefined ? 0 : options.data.ProfitPer);


                        //UnitCostVendor
                        document.getElementById("VendorUnitCostFlex").value = Number(options.data.UnitCostVendor === undefined ? 0 : options.data.UnitCostVendor);
                        document.getElementById("VendorUnitCostUnit").value = Number(options.data.UnitCostVendor === undefined ? 0 : options.data.UnitCostVendor);
                        document.getElementById("VendorUnitCostOffset").value = Number(options.data.UnitCostVendor === undefined ? 0 : options.data.UnitCostVendor);



                        document.getElementById("FinalTotal").value = Number(options.data.FinalAmount === undefined ? 0 : options.data.FinalAmount);

                        // For Flex
                        document.getElementById("FlexPrdDisc").value = options.data.ProductDescription === undefined ? '' : options.data.ProductDescription;
                        document.getElementById("FlexPkgDtail").value = options.data.PackagingDetails === undefined ? '' : options.data.PackagingDetails;
                        document.getElementById("FlexOtrDisc").value = options.data.DescriptionOther === undefined ? '' : options.data.DescriptionOther;

                        // For Unit
                        document.getElementById("UnitPrdDisc").value = options.data.ProductDescription === undefined ? '' : options.data.ProductDescription;
                        document.getElementById("UnitPkgDtail").value = options.data.PackagingDetails === undefined ? '' : options.data.PackagingDetails;
                        document.getElementById("UnitOtrDisc").value = options.data.DescriptionOther === undefined ? '' : options.data.DescriptionOther;

                        if (options.data.IsOffsetProduct === true) {
                            document.getElementById("PlanContName").innerHTML = options.data.ProductName1  ///$.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductName;
                            document.getElementById("PlanContQty").innerHTML = options.data.Quantity;
                            document.getElementById("ContentOrientation").innerHTML = $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName;

                            // For Offset
                            document.getElementById("OffsetPrdDisc").value = options.data.ProductDescription === undefined ? '' : options.data.ProductDescription;
                            document.getElementById("OffsetPkgDtail").value = options.data.PackagingDetails === undefined ? '' : options.data.PackagingDetails;
                            document.getElementById("OffsetOtrDisc").value = options.data.DescriptionOther === undefined ? '' : options.data.DescriptionOther;

                            if (options.data.IsManualCosting == true) {
                                $("#SelvendorOffset").dxSelectBox({
                                    value: options.data.VendorID
                                });
                                document.getElementById('MannualUnitRate').value = options.data.VendorRate;
                                document.getElementById('vehicle1').checked = options.data.IsManualCosting;


                            } else {
                                $("#SelvendorOffset").dxSelectBox({
                                    value: -1
                                });
                                document.getElementById('MannualUnitRate').value = 0;

                            }
                        }


                        const City = document.getElementById("TxtClientCity").value;
                        if (City === "" | City === undefined) {
                            $("#SelClient").dxValidator('instance').validate();
                            DevExpress.ui.notify("Please select client for best nearby plan..!", "warning", 1500);
                        }
                        ProductCatalogID = options.data.ProductCatalogID;
                        processids = options.data.ProcessIDStr == null ? '' : options.data.ProcessIDStr;
                        Defaultprocessids = options.data.DefaultProcessStr == null ? '' : options.data.DefaultProcessStr;
                        $("#gridContentPlansList").dxDataGrid({ dataSource: [] });


                        $("OperIdPQ").text(options.data.ProcessIDStr);
                        loadProcess();
                        //reload already created plan for the selected product
                        if ((options.data.VendorID > 0 && options.data.IsOffsetProduct !== true && options.data.IsUnitProduct !== true) || (options.data.ProductInputSizes !== "" && options.data.ProductInputSizes !== undefined && options.data.IsOffsetProduct !== true && options.data.IsUnitProduct !== true)) {
                            if (options.data.VendorID > 0) {
                                IsMaualCostingflex();

                                if (options.data.IsManualCosting == true) {
                                    $("#Selvendorflex").dxSelectBox({
                                        value: options.data.VendorID
                                    });
                                    document.getElementById('MannualUnitRateflex').value = options.data.VendorRate
                                    document.getElementById('IsManualcostflex').checked = options.data.IsManualCosting
                                    document.getElementById('gridContentPlansList').style.display = "none"; // for flex
                                } else {
                                    $("#Selvendorflex").dxSelectBox({
                                        value: -1
                                    });
                                    document.getElementById('MannualUnitRateflex').value = 0
                                    document.getElementById('IsManualcostflex').checked = 0
                                    document.getElementById('gridContentPlansList').style.display = "block"; // for flex
                                }

                                $("#gridContentPlansList").dxDataGrid({ dataSource: JSON.parse(options.data.SelectedPlan) });
                            }

                            $("#gridProductConfig").dxDataGrid({ dataSource: JSON.parse(options.data.ProductInputSizes) });
                            //}
                        } else {
                            if (options.data.IsUnitProduct !== true && options.data.IsOffsetProduct !== true)
                                GetProductConfig(ProductCatalogID);
                        }

                        if (options.data.IsOffsetProduct === true) {
                            allQuantity(options.data.Quantity, options.data.ProductName1, $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductImagePath)

                            onChangeCalcAmountp();
                        } else {
                            if (options.data.IsUnitProduct === true) {
                                document.getElementById("VendorRate").value = Number(options.data.Rate);

                                $("#Selvendor").dxSelectBox({
                                    value: options.data.VendorID,
                                })
                                this.setAttribute("data-toggle", "modal");
                                this.setAttribute("data-target", "#modalEstimateProductUnit");
                                CalculateUnitCost();
                                return;
                            }
                            this.setAttribute("data-toggle", "modal");
                            this.setAttribute("data-target", "#modalEstimateProduct");
                            onChangeCalcAmountFlex();
                        }

                    })
                    .appendTo(container);
            },
        },
        { dataField: "Rate", caption: "Rate", allowEditing: false, dataType: "number", /*validationRules: [{ type: "required", message: "Rate is required" }]*/ },
        { dataField: "UnitCost", caption: "Unit Price", allowEditing: false, visible: true },
        {
            dataField: "RateType", caption: "Rate Type", allowEditing: true,
            lookup: {
                dataSource: [{ RateType: "Per Unit" }, { RateType: "Per 1000 Unit" }, { RateType: "Per Square Feet" }],
                displayExpr: "RateType",
                valueExpr: "RateType"
            },// validationRules: [{ type: "required", message: "Rate type is required" }]
        },
        {
            dataField: "ProductHSNID", caption: "HSN Code", allowEditing: true,
            lookup: {
                dataSource: ObjProductHSNGrp,
                displayExpr: "HSNCode",
                valueExpr: "ProductHSNID"
            },
            setCellValue: function (rowData, value) {
                rowData.ProductHSNID = value;
                var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === value; });
                if (result.length === 1) {
                    rowData.GSTTaxPercentage = result[0].GSTTaxPercentage;

                } else
                    rowData.GSTTaxPercentage = 0;
            }
        },
        { dataField: "GSTTaxPercentage", caption: "GST Tax", allowEditing: false, dataType: "number", visible: false },
        { dataField: "GSTAmount", caption: "GST Amt", allowEditing: false, dataType: "number", visible: false },

        { dataField: "SGSTPercantage", caption: "SGST %", allowEditing: false, dataType: "number" },
        { dataField: "SGSTAmount", caption: "SGST Amt", allowEditing: false, dataType: "number" },
        { dataField: "CGSTPercantage", caption: "CGST %", allowEditing: false, dataType: "number" },
        { dataField: "CGSTAmount", caption: "CGST Amt", allowEditing: false, dataType: "number" },
        { dataField: "IGSTPercantage", caption: "IGST %", allowEditing: false, dataType: "number" },
        { dataField: "IGSTAmount", caption: "IGST Amt", allowEditing: false, dataType: "number" },

        { dataField: "MiscPer", caption: "Misc.cost%", allowEditing: false, dataType: "number" },
        { dataField: "ShippingCost", caption: "Shipping Cost", allowEditing: false, dataType: "number" },
        { dataField: "Amount", caption: "Amount", allowEditing: false, dataType: "number" },
        { dataField: "VendorID", allowEditing: false, visible: false },
        { dataField: "VendorName", caption: "Associate Name", allowEditing: false, visible: false },
        { dataField: "City", caption: "City", allowEditing: false, visible: false },
        { dataField: "ProcessCost", caption: "Operation Amount", allowEditing: false, visible: false },
        { dataField: "FinalAmount", caption: "Final Amount", allowEditing: false, visible: true },
        { dataField: "ProfitPer", caption: "Profit", allowEditing: false, visible: false },
        { dataField: "ProfitCost", caption: "Profit", allowEditing: false, visible: true },
        { dataField: "ProcessIDStr", allowEditing: false, visible: false },
        { dataField: "BookingID", allowEditing: false, visible: false },
        { dataField: "DefaultProcessStr", allowEditing: false, visible: false },
        { dataField: "IsManualCosting", allowEditing: false, visible: false },

    ],
    editing: {
        mode: "popup",
        allowUpdating: true,
        allowDeleting: false,
        popup: {
            title: 'Product Requirement',
            showTitle: true,
            width: 500,
            height: 350,
        },
        form: {
            items: [{
                itemType: 'group',
                colCount: 1,
                colSpan: 2,
                items: ['CategoryID', 'ProductCatalogID', 'ProductName1', 'Quantity'],
            }],
        },

    },
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 2.5;
    },
    //onToolbarPreparing: function (e) {
    //    e.toolbarOptions.items.unshift({
    //        location: "before",
    //        template() {
    //            return $('<div>')
    //                .append(
    //                    $('<b>')
    //                        .addClass("font-13")
    //                        .text('Add Product'),
    //                );
    //        }
    //    });
    //},
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitNewRow: function (e) {
        e.data.SequenceNo = e.component._options.dataSource.length + 1;
    },

    onRowUpdating: function (e) {
        //calculateAmount(e);
    },
    onRowInserted(e) {
        e.component.navigateToRow(e.key);
    },
    onEditorPreparing: function (e) {
        if (e.dataField === "ProductCatalogID" && e.parentType === "dataRow") {
            var Fildata = [];
            if (CategoryID != 0)
                Fildata = $.grep(ProductMasterList, function (ex) { return ex.CategoryID === e.row.data.CategoryID; })
            else
                Fildata = ProductMasterList;
            e.editorOptions.dataSource = Fildata;
        }
        if (e.parentType == 'dataRow' && e.dataField == "Quantity") {
            e.editorOptions.min = 0;
        }
    }

}).dxDataGrid('instance');

//AddRow();
function AddRow() {
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    if (SelClientID === "" || SelClientID === null) {
        DevExpress.ui.notify("Please select client..!", "error", 2000);
        $("#SelClient").dxValidator('instance').validate();

        return false;
    }
    $('#gridProductList').dxDataGrid('instance').addRow();
}


$("#gridProductConfig").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    //selection: { mode: "single" },
    columns: [
        { dataField: "ParameterName", caption: "Parameter Name", allowEditing: false, visible: false },
        { dataField: "ParameterDisplayName", caption: "Display Name", visible: true, allowEditing: false },
        { dataField: "ParameterDefaultValue", allowEditing: false, caption: "Default Value" },
        { dataField: "ParameterValue", caption: "Value (*In Sq. Feet)", dataType: "number", validationRules: [{ type: "required", message: "Value is required" }] },
        { dataField: "ParameterFormula", caption: "Formula", allowEditing: false, visible: false }
    ],
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    onEditorPreparing: function (e) {
        if (e.row.rowType === "data" && e.dataField === "ParameterValue") {
            let fildata = e.row.data.ParameterDefaultValue.split(",");
            if (fildata.length > 0 && e.row.data.ParameterDefaultValue.includes(",")) {
                e.editorName = "dxSelectBox"
                e.editorOptions.items = fildata;
                e.editorOptions.showSelectionControls = true;
                e.editorOptions.searchEnabled = true;
                e.editorOptions.value = e.value || [];
                //e.editorOptions.itemTemplate = function (itemData, _, itemElement) {
                //    itemElement
                //        .parent().attr("background", itemData.toLowerCase()).addClass("font-bold")
                //        .text(itemData);
                //}
                e.editorOptions.onValueChanged = function (args) {
                    e.setValue(args.value);
                }
            }
        }
    },
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 4.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitNewRow: function (e) {
        e.data.SequenceNo = e.component._options.dataSource.length + 1;
    },
    onSelectionChanged: function (data) {
        if (data) {

        }
    }
});

var ProcessSlabs = [];
$.ajax({
    type: 'POST',
    async: false,
    url: "WebServicePlanWindow.asmx/LoadOperationsSlabs",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},    // "{'name': '" + Method_Name + "'}",
    crossDomain: true,
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/(?:\r\n|\r|\n)/g, '');
        res = res.replace(/":,/g, '":null,');
        res = res.substr(1);
        res = res.slice(0, -1);
        ProcessSlabs = JSON.parse(res.toString());
    },
    error: function errorFunc(jqXHR) {
        // alert(jqXHR.message);
    }
});

setGridDisplay('block', 'none');

$("#gridContentPlansList").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    filterRow: { visible: true },
    columns: [
        { dataField: "VendorName", caption: "Associate Name" },
        { dataField: "City", caption: "City" },
        { dataField: "RequiredQuantity" },
        { dataField: "VendorRate", caption: "Vendor Rate" },
        { dataField: "ProcessCost", caption: "Operation Amount" },
        { dataField: "FinalAmount", caption: "Final Amount" },
        { dataField: "UnitCost", caption: "Unit Price", sortOrder: 'asc', sortIndex: 1 }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 4;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onContentReady(e) {
        if (!e.component.getSelectedRowKeys().length) { e.component.selectRowsByIndexes(0); }
    },
    onSelectionChanged: function (data) {
        if (data) {
            document.getElementById('finalCost1').value = data.selectedRowsData[0].FinalAmount;
            document.getElementById('VendorUnitCostFlex').value = data.selectedRowsData[0].UnitCost.toFixed(2).toString();
            onChangeCalcAmountFlex();
        }
    }
});

$("#GridShowlist").dxDataGrid({
    dataSource: [],
    keyExpr: 'ProductEstimateID',
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    filterRow: { visible: true },
    columns: [
        { dataField: "QuotationNo" },
        { dataField: "EnquiryNo" },
        { dataField: "ProjectName" },
        { dataField: "ClientName" },
        { dataField: "CreatedDate" },
        { dataField: "SalesManager" },
        { dataField: "SalesCordinator" },
        { dataField: "SalesPerson", caption: 'Sales Executive' },
        { dataField: "FreightAmount" },
        { dataField: "Remark" },
        { dataField: "EstimateBy" }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.21;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }, masterDetail: {
        enabled: true,
        template(container, options) {
            const currentProjectData = options.data;

            $('<div>')
                .addClass('master-detail-caption')
                .text(`${currentProjectData.ClientName} 's Products:`)
                .appendTo(container);
            $('<div>')
                .dxDataGrid({
                    columnAutoWidth: true,
                    showBorders: true,
                    columns: [
                        { dataField: "ProductName", caption: "Content Name" },
                        { dataField: "ProductName1", caption: "Product Name" },
                        { dataField: "CategoryName" },
                        { dataField: "HSNCode" },
                        { dataField: "Quantity" },
                        { dataField: "Rate" },
                        { dataField: "RateType" },
                        { dataField: "UnitCost" },
                        { dataField: "GSTPercantage" },
                        { dataField: "GSTAmount" },
                        { dataField: "MiscPercantage" },
                        { dataField: "MiscAmount" },
                        { dataField: "ShippingCost" },
                        { dataField: "ProfitPer" },
                        { dataField: "ProfitCost" },
                        { dataField: "FinalAmount" },
                        { dataField: "VendorName" }
                    ],
                    dataSource: new DevExpress.data.DataSource({
                        store: new DevExpress.data.ArrayStore({
                            //key: 'ID',
                            data: GBLContents,
                        }),
                        filter: ['ProductEstimateID', '=', options.key],
                    }),
                }).appendTo(container);
        },
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        document.getElementById("EstimateID").value = "";
        if (data.length > 0) {
            document.getElementById("EstimateID").value = data[0].ProductEstimateID;
            document.getElementById("BookingID").value = data[0].BookingID;
        }
    }
});

//$.ajax({
//    type: "POST",
//    url: "WebServiceProductMaster.asmx/GetQuotationNo",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: "json",
//    success: function (results) {
//        if (results.d.includes("fail") === false) {
//            document.getElementById("TxtQuoteNo").value = results.d;
//        }
//    },
//    error: function errorFunc(jqXHR) {
//        //alert("not show");
//    }
//});

$.ajax({
    type: "POST",
    url: "WebserviceOthers.asmx/GetProductHSNGroups",
    data: '{Category:"Finish Goods"}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        var res = results.d.replace(/\\/g, '');
        res = res.replace(/"d":/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        $("#SelProductHSN").dxSelectBox({
            items: RES1
        })
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});


function ReloadClients() {
    ///Clients
    $.ajax({
        type: "POST",
        url: "WebServiceProductMaster.asmx/GetClientData",
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
            var RES1 = JSON.parse(res.toString());
            GBLClientData = RES1;
            $("#SelClient").dxSelectBox({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}
ReloadClients();
function loadProcess() {
    $.ajax({
        async: false,
        type: 'POST',
        url: "WebServicePlanWindow.asmx/SuggestedOperations",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{'processids': '" + processids + "'}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#GridOperation").dxDataGrid({ dataSource: [] });
            $("#GridOperationAllocated").dxDataGrid({ dataSource: [] });
            var fillarraySuggested = $.grep(JSON.parse(res.toString()), function (e) {
                return Defaultprocessids.split(',').indexOf(e.ProcessID.toString()) < 0;
            });
            ObjDefaultProcess = $.grep(JSON.parse(res.toString()), function (e) {
                return Defaultprocessids.split(',').indexOf(e.ProcessID.toString()) > -1;
            });
            if (EditMode) {
                saveContentsOprations(ObjDefaultProcess)
            }
            $("#GridOperation").dxDataGrid({                  //// GridOperation  gridopr
                dataSource: {
                    store: {
                        type: "array",
                        data: fillarraySuggested,
                        key: "ProcessID"
                    }
                },
            });
            $("#gridOperation").dxDataGrid({
                dataSource: ObjDefaultProcess,
            });

            $("#gridSelOperation").dxDataGrid({
                dataSource: {
                    store: {
                        type: "array",
                        data: fillarraySuggested,
                        key: "ProcessID"
                    }
                },
            });
            $("#GridOperationAllocated").dxDataGrid({
                dataSource: ObjDefaultProcess,
            });

            $("#UnitProcessDefault").dxDataGrid({
                dataSource: ObjDefaultProcess,
            });
            $("#UnitProcessSuggestion").dxDataGrid({
                dataSource: {
                    store: {
                        type: "array",
                        data: fillarraySuggested,
                        key: "ProcessID"
                    }
                },
            });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
}

//$.ajax({
//    type: "POST",
//    url: "WebServiceProductMaster.asmx/GetSalesPerson",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: "text",
//    success: function (results) {
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"d":""/g, '');
//        res = res.replace(/""/g, '');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        let RES1 = JSON.parse(res);
//        $("#SelSalesPerson").dxSelectBox({ dataSource: RES1 });
//    }
//});
$.ajax({
    type: "POST",
    url: "WebServiceProductMaster.asmx/GetVendors",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        let RES1 = JSON.parse(res);
        $("#Selvendor").dxSelectBox({ dataSource: RES1 });
        $("#SelvendorOffset").dxSelectBox({ dataSource: RES1 });
        $("#Selvendorflex").dxSelectBox({ dataSource: RES1 });
    }
});
function GetProductConfig(productId) {
    $.ajax({
        type: 'POST',
        url: "WebServiceProductMaster.asmx/GetProductConfigData",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{productId: " + productId + "}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            $("#gridProductConfig").dxDataGrid({ dataSource: JSON.parse(res.toString()) });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
}

function setGridDisplay(FieldCntainerRow, myModal_1) {
    document.getElementById("FieldCntainerRow").style.display = FieldCntainerRow;
    document.getElementById("myModal_1").style.display = myModal_1;
}

$("#BtnPlan").click(function () {
    let OperId = $("#OperIdPQ").text();
    let gridProductConfig = $('#gridProductConfig').dxDataGrid('instance');
    let PlanContQty = Number(document.getElementById("TxtPlanQty").value);
    let LedgerID = $("#SelClient").dxSelectBox("instance").option("value");

    var Obj_Job_Size = {};
    var Job_Size_Obj = [];
    let ProductFormula = "";
    for (var i = 0; i < gridProductConfig._options.dataSource.length; i++) {
        if (gridProductConfig._options.dataSource[i].ParameterValue === null) {
            DevExpress.ui.notify("Please enter valid parameter value", "warning", 1000);
            return;
        }
        Obj_Job_Size[gridProductConfig._options.dataSource[i].ParameterName] = Number(gridProductConfig._options.dataSource[i].ParameterValue);
        let varname = "var " + gridProductConfig._options.dataSource[i].ParameterName + "=" + Number(gridProductConfig._options.dataSource[i].ParameterValue);
        eval(varname);
        if (gridProductConfig._options.dataSource[i].ProductFormula !== "" && gridProductConfig._options.dataSource[i].ProductFormula !== null) {
            ProductFormula = gridProductConfig._options.dataSource[i].ProductFormula;
        }
    }

    Obj_Job_Size.ProductCatalogID = gridProductConfig._options.dataSource[0].ProductCatalogID;
    Obj_Job_Size.PlanContQty = Number(PlanContQty);
    if (ProductFormula !== "") {
        Obj_Job_Size.CalculationValue = eval(ProductFormula);
    } else
        Obj_Job_Size.CalculationValue = 0;
    Job_Size_Obj.push(Obj_Job_Size);

    if (document.getElementById("IsManualcostflex").checked == true) {


        var rate = document.getElementById('MannualUnitRateflex').value;  // Per sq. feet
        if (Number(rate) < 0) {
            alert("Please Enter Rate");
            return;
        }
        if ($("#Selvendorflex").dxSelectBox("instance").option("value") <= 0) {
            alert("Please Select Vendor");
            return;
        }
        var total = Obj_Job_Size.CalculationValue * rate * PlanContQty;
        document.getElementById('finalCost1').value = Number(total).toFixed(2);
        onChangeCalcAmountFlex();
        return;
    }
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: "POST",
            url: "WebServiceProductMaster.asmx/ProductPlanning",
            data: '{ObjJSJson:' + JSON.stringify(Job_Size_Obj) + ',GblOperId:' + JSON.stringify(OperId) + ',LedgerID:' + Number(LedgerID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                var blankdata = [];
                $("#gridContentPlansList").dxDataGrid({ dataSource: blankdata, clearSelection: true });
                var grid = $("#gridContentPlansList").dxDataGrid('instance');
                grid.clearSelection();

                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                var RES1 = JSON.parse(res);
                if (RES1.TblPlanning.length < 1) {
                    DevExpress.ui.notify("No plan available", "warning", 2000);
                }
                else {
                    try {
                        $("#gridContentPlansList").dxDataGrid({ dataSource: RES1.TblPlanning });
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 100);
            }
        });
    } catch (e) {
        DevExpress.ui.notify("" + e + "", "error", 100);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

$("#BtnApplyPlan").click(function () {
    var chkstate = false;
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var result = $.grep(GBLClientData, function (ex) { return ex.LedgerID === SelClientID; });
    if (result.length === 1) {
        if (GBLLoginCompanyState == result[0].State)
            chkstate = true;
        else
            chkstate = false;
    }
    /// For Mannual Costing 
    let VendorID = $("#Selvendorflex").dxSelectBox("instance").option("value");
    let VendorName = $("#Selvendorflex").dxSelectBox("instance").option("text");
    let Rate = document.getElementById('MannualUnitRateflex').value;
    var FinalAmount = parseFloat(document.getElementById("FinalTotal").value);
    var UnitCost = parseFloat(document.getElementById("FinalUnitCost1").value);
    var FinalMiscPer = parseFloat(document.getElementById("FinalMiscPer1").value);
    var FinalShipperCost = parseFloat(document.getElementById("FinalShipperCost1").value);
    var VendorUnitCostFlex = parseFloat(document.getElementById("VendorUnitCostFlex").value);


    var gridProductData = $('#gridProductList').dxDataGrid('instance');
    var gridProductConfig = $('#gridProductConfig').dxDataGrid('instance')._options.dataSource;

    var gridOperation = $('#gridOperation').dxDataGrid('instance')._options.dataSource;
    var Suggestedoperation = $('#gridSelOperation').dxDataGrid('instance')._options.dataSource.store.data;

    var oprids = '';
    for (var i = 0; i < gridOperation.length; i++) {
        oprids = oprids + gridOperation[i].ProcessID + ','
    }

    var suggestoprids = '';
    for (var i = 0; i < Suggestedoperation.length; i++) {
        suggestoprids = suggestoprids + Suggestedoperation[i].ProcessID + ','
    }
    var ProfitPer = parseFloat(document.getElementById("ProfitPer1").value);
    var ProfitCost = parseFloat(document.getElementById("ProfitCost1").value);

    var NetAmt = parseFloat(document.getElementById("NetAmtflex").value);
    var GSTAmount = parseFloat(document.getElementById("FinalTaxCost1").value);
    var FinalTaxPer = parseFloat(document.getElementById("FinalTaxPer1").value);

    var PrdDisc = document.getElementById("FlexPrdDisc").value;
    var PkgDtail = document.getElementById("FlexPkgDtail").value;
    var OtrDisc = document.getElementById("FlexOtrDisc").value;
    var TxtPlanQty = document.getElementById("TxtPlanQty").value;


    let OperId = oprids;
    var SelectedPlanData = $("#gridContentPlansList").dxDataGrid("instance").getSelectedRowsData();

    if (SelectedPlanData.length <= 0 && document.getElementById('IsManualcostflex').checked != true) {
        DevExpress.ui.notify("Please select vendor rate for the product..!", "warning", 2000);
        return;
    }
    if (document.getElementById('IsManualcostflex').checked == true) {
        var Obj = {};
        Obj.UnitCost = parseFloat(Rate);
        Obj.VendorName = VendorName;
        Obj.VendorID = parseFloat(VendorID);
        Obj.City = "";
        Obj.FinalAmount = parseFloat(NetAmt);
        Obj.RequiredQuantity = parseFloat(TxtPlanQty);
        Obj.VendorRate = parseFloat(Rate);
        Obj.UnitCostVendor = VendorUnitCostFlex.toString()
        Obj.DefaultProcessStr = OperId;
        Obj.ProcessIDStr = suggestoprids;
        Obj.ProcessCost = 0;
        SelectedPlanData.push(Obj);
    }

    for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
        if (gridProductData._options.dataSource[i].ProductCatalogID === ProductCatalogID && gridProductData._options.dataSource[i].Quantity === parseFloat(document.getElementById("TxtPlanQty").value)) {
            gridProductData._options.dataSource[i].Rate = SelectedPlanData[0].UnitCost;
            gridProductData._options.dataSource[i].RateType = "Per Unit";
            gridProductData._options.dataSource[i].Amount = NetAmt;
            gridProductData._options.dataSource[i].IsOffsetProduct = 0;
            gridProductData._options.dataSource[i].VendorName = SelectedPlanData[0].VendorName;
            gridProductData._options.dataSource[i].VendorID = SelectedPlanData[0].VendorID;
            gridProductData._options.dataSource[i].City = SelectedPlanData[0].City;
            gridProductData._options.dataSource[i].FinalAmount = SelectedPlanData[0].FinalAmount;
            gridProductData._options.dataSource[i].RequiredQuantity = SelectedPlanData[0].RequiredQuantity;
            gridProductData._options.dataSource[i].VendorRate = SelectedPlanData[0].VendorRate;
            gridProductData._options.dataSource[i].ProfitPer = parseFloat(ProfitPer);
            gridProductData._options.dataSource[i].ProfitCost = parseFloat(ProfitCost);
            gridProductData._options.dataSource[i].GSTAmount = parseFloat(GSTAmount);
            gridProductData._options.dataSource[i].UnitCostVendor = parseFloat(VendorUnitCostFlex);
            gridProductData._options.dataSource[i].MiscPer = parseFloat(FinalMiscPer);
            gridProductData._options.dataSource[i].ShippingCost = parseFloat(FinalShipperCost);
            gridProductData._options.dataSource[i].GSTTaxPercentage = parseFloat(FinalTaxPer);
            if (chkstate) {
                gridProductData._options.dataSource[i].CGSTPercantage = FinalTaxPer / 2;
                gridProductData._options.dataSource[i].CGSTAmount = parseFloat(GSTAmount) / 2;
                gridProductData._options.dataSource[i].SGSTPercantage = FinalTaxPer / 2;
                gridProductData._options.dataSource[i].SGSTAmount = parseFloat(GSTAmount) / 2;
                gridProductData._options.dataSource[i].IGSTPercantage = 0;
                gridProductData._options.dataSource[i].IGSTAmount = 0;
            } else {
                gridProductData._options.dataSource[i].IGSTPercantage = FinalTaxPer;
                gridProductData._options.dataSource[i].IGSTAmount = parseFloat(GSTAmount);
                gridProductData._options.dataSource[i].CGSTPercantage = 0;
                gridProductData._options.dataSource[i].CGSTAmount = 0;
                gridProductData._options.dataSource[i].SGSTPercantage = 0;
                gridProductData._options.dataSource[i].SGSTAmount = 0;
            }
            gridProductData._options.dataSource[i].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
            gridProductData._options.dataSource[i].DefaultProcessStr = oprids.slice(0, -1);
            gridProductData._options.dataSource[i].ProcessCost = SelectedPlanData[0].ProcessCost;
            gridProductData._options.dataSource[i].UnitCost = UnitCost.toFixed(2);
            gridProductData._options.dataSource[i].ProductInputSizes = JSON.stringify(gridProductConfig);
            gridProductData._options.dataSource[i].SelectedPlan = JSON.stringify(SelectedPlanData);
            gridProductData._options.dataSource[i].FinalAmount = parseFloat(FinalAmount);
            gridProductData._options.dataSource[i].DescriptionOther = OtrDisc;
            gridProductData._options.dataSource[i].PackagingDetails = PkgDtail;
            gridProductData._options.dataSource[i].ProductDescription = PrdDisc;
            gridProductData._options.dataSource[i].IsManualCosting = document.getElementById('IsManualcostflex').checked;
            gridProductData.refresh();
            break;
        }
    }
    document.getElementById("FinalTotal").value = 0
    document.getElementById("FinalMiscPer1").value = 0
    document.getElementById("FinalShipperCost1").value = 0
    document.getElementById("ProfitPer1").value = 0
    document.getElementById("FinalTaxPer1").value = 0
    document.getElementById("BtnApplyPlan").setAttribute("data-dismiss", "modal");
});

$("#BtnSave").click(function () {
    var SalesPersonID = $('#SelSalesPerson').dxSelectBox('instance').option('value');
    var SalesCordinatorId = $('#SalesCordinator').dxSelectBox('instance').option('value');
    var ClientCordinator = $('#ClientCordinator').dxSelectBox('instance').option('value');

    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var TxtProjectName = document.getElementById("TxtProjectName").value.trim();
    var TxtRemark = document.getElementById("TxtRemark").value.trim();
    var TxtFreightAmount = document.getElementById("TxtFreightAmount").value.trim();
    var TxtPaymentTerms = document.getElementById('TxtPaymentTerms').value.trim();
    var TxtDeliveryUpto = document.getElementById('TxtDeliveryUpto').value.trim();
    var TxtValidUpto = document.getElementById('TxtValidUpto').value.trim();

    var gridProductList = $('#gridProductList').dxDataGrid('instance');

    if (TxtProjectName === "" || TxtProjectName === null) {
        DevExpress.ui.notify("Please enter project name..!", "error", 2000);
        document.getElementById("TxtProjectName").style.border = "Solid red 1px";
        document.getElementById("TxtProjectName").focus();
        return false;
    } else {
        $("#TxtProjectName").removeAttr("style");
        document.getElementById("TxtProjectName").style.border = "Solid black -0.5px";
    }
    if (SelClientID === "" || SelClientID === null) {
        DevExpress.ui.notify("Please select client..!", "error", 2000);
        $("#SelClient").dxValidator('instance').validate();

        return false;
    }
    if (ClientCordinator === "" || ClientCordinator === null) {
        DevExpress.ui.notify("Please select client cordinator..!", "error", 2000);
        $("#ClientCordinator").dxValidator('instance').validate();
        return false;
    }
    if (SalesCordinatorId === "" || SalesCordinatorId === null) {
        DevExpress.ui.notify("Please select sales cordinator..!", "error", 2000);
        $("#SalesCordinator").dxValidator('instance').validate();
        return false;
    }
    if (SalesPersonID === "" || SalesPersonID === null) {
        DevExpress.ui.notify("Please select sales person..!", "error", 2000);
        $("#SelSalesPerson").dxValidator('instance').validate();
        return false;
    }

    if (TxtValidUpto === "" || TxtValidUpto === null || TxtValidUpto <= 0) {
        DevExpress.ui.notify("Please enter valid upto days..!", "error", 2000);
        document.getElementById("TxtValidUpto").style.border = "Solid red 1px";
        document.getElementById("TxtValidUpto").focus();
        return false;
    } else {
        $("#TxtValidUpto").removeAttr("style");
        document.getElementById("TxtValidUpto").style.border = "Solid black -0.5px";
    }
    if (TxtDeliveryUpto === "" || TxtDeliveryUpto === null || TxtDeliveryUpto <= 0) {
        DevExpress.ui.notify("Please enter delivery upto days..!", "error", 2000);
        document.getElementById("TxtDeliveryUpto").style.border = "Solid red 1px";
        document.getElementById("TxtDeliveryUpto").focus();
        return false;
    } else {
        $("#TxtDeliveryUpto").removeAttr("style");
        document.getElementById("TxtDeliveryUpto").style.border = "Solid black -0.5px";
    }
    if (TxtPaymentTerms === "" || TxtPaymentTerms === null || TxtPaymentTerms <= 0) {
        DevExpress.ui.notify("Please enter payment days..!", "error", 2000);
        document.getElementById("TxtPaymentTerms").style.border = "Solid red 1px";
        document.getElementById("TxtPaymentTerms").focus();
        return false;
    } else {
        $("#TxtPaymentTerms").removeAttr("style");
        document.getElementById("TxtPaymentTerms").style.border = "Solid black -0.5px";
    }
    if (gridProductList._options.dataSource.length <= 0) {
        DevExpress.ui.notify("Please add at least one product ..!", "warning", 1000);
        return;
    }


    for (var i = 0; i < gridProductList._options.dataSource.length; i++) {

        if (Number(gridProductList._options.dataSource[i].FinalAmount) <= 0) {
            alert(`FinalAmount of product "${gridProductList._options.dataSource[i].ProductName1}" is 0 please check it`);
            return
        }
    }


    swal({
        title: "Project Quotation Saving...",
        text: 'Are you sure to save?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            readAllSelectedPlans();
        });
});

GetLoginCompanyState();
function GetLoginCompanyState() {
    $.ajax({

        type: "POST",
        url: "WebServiceProductMaster.asmx/GetLoginCompanyState",
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
            var RES1 = JSON.parse(res.toString());
            GBLLoginCompanyState = RES1[0].State;

        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}
function FinalSave(BookingID) {

    var SalesPersonID = $('#SelSalesPerson').dxSelectBox('instance').option('value');
    var SalesCordinatorId = $('#SalesCordinator').dxSelectBox('instance').option('value');
    var ClientCordinator = $('#ClientCordinator').dxSelectBox('instance').option('value');

    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var TxtProjectName = document.getElementById("TxtProjectName").value.trim();
    var TxtRemark = document.getElementById("TxtRemark").value.trim();
    var TxtFreightAmount = document.getElementById("TxtFreightAmount").value.trim();
    var TxtPaymentTerms = document.getElementById('TxtPaymentTerms').value.trim();
    var TxtDeliveryUpto = document.getElementById('TxtDeliveryUpto').value.trim();
    var TxtValidUpto = document.getElementById('TxtValidUpto').value.trim();
    var IsDirectApproved = document.getElementById("IsDirectApproved").checked;
    var IsDirectPriceApproved = document.getElementById("IsDirectPriceApproved").checked;

    var gridProductList = $('#gridProductList').dxDataGrid('instance');



    let ObjMainDetail = {};
    let ObjMain = [];
    let gridProductData = {};
    let objProductConfig = [];

    ObjMainDetail.LedgerID = SelClientID;
    ObjMainDetail.SalesPersonID = SalesPersonID;
    ObjMainDetail.SalesCordinatorId = SalesCordinatorId;
    ObjMainDetail.SalesManagerID = SalesManagerId;
    ObjMainDetail.ClientCordinatorID = ClientCordinator;
    ObjMainDetail.ProjectName = TxtProjectName;
    ObjMainDetail.Narration = TxtRemark;
    ObjMainDetail.BookingID = BookingID;
    ObjMainDetail.EnquiryID = EnquiryID;

    ObjMainDetail.FreightAmount = TxtFreightAmount;
    ObjMainDetail.PaymentTerms = Number(TxtPaymentTerms);
    ObjMainDetail.DeliveryUpto = Number(TxtDeliveryUpto);
    ObjMainDetail.ValidUpto = Number(TxtValidUpto);
    ObjMain.push(ObjMainDetail);
    var IsSameState = false;
    // To get State Of Client 
    var result = $.grep(GBLClientData, function (ex) { return ex.LedgerID === SelClientID; });
    if (result.length === 1) {
        if (GBLLoginCompanyState == result[0].State)
            IsSameState = true;
        else
            IsSameState = false;
    }
    for (var i = 0; i < gridProductList._options.dataSource.length; i++) {
        gridProductData = {};
        if (Number(gridProductList._options.dataSource[i].Rate) >= 0 && Number(gridProductList._options.dataSource[i].Amount) >= 0) {
            gridProductData.VendorID = Number(gridProductList._options.dataSource[i].VendorID);
            gridProductData.ProductCatalogID = Number(gridProductList._options.dataSource[i].ProductCatalogID);
            gridProductData.ProductHSNID = Number(gridProductList._options.dataSource[i].ProductHSNID);

            gridProductData.ProductName = gridProductList._options.dataSource[i].ProductName1;
            if (gridProductList._options.dataSource[i].IsOffsetProduct === true) {
                SbProductHSNID = Number(gridProductList._options.dataSource[i].ProductHSNID);
                QuotedCost = parseFloat(gridProductList._options.dataSource[i].Rate).toString();
                PlanQty = Number(gridProductList._options.dataSource[i].Quantity);
                CategoryID = Number(gridProductList._options.dataSource[i].CategoryID);
                TypeOfCost = gridProductList._options.dataSource[i].RateType;
            }
            gridProductData.Rate = parseFloat(gridProductList._options.dataSource[i].VendorRate).toString();
            gridProductData.UnitCostVendor = parseFloat(gridProductList._options.dataSource[i].UnitCostVendor).toString();
            gridProductData.CategoryID = Number(gridProductList._options.dataSource[i].CategoryID);
            gridProductData.RateType = gridProductList._options.dataSource[i].RateType;
            gridProductData.Amount = parseFloat(gridProductList._options.dataSource[i].Amount).toString();

            gridProductData.FinalAmount = parseFloat(gridProductList._options.dataSource[i].FinalAmount).toString();
            gridProductData.Quantity = parseFloat(gridProductList._options.dataSource[i].Quantity);
            //gridProductData.VendorRate = gridProductList._options.dataSource[i].VendorRate;
            gridProductData.ProcessIDStr = gridProductList._options.dataSource[i].ProcessIDStr//$("OperIdPQ").text();
            gridProductData.DefaultProcessStr = gridProductList._options.dataSource[i].DefaultProcessStr
            gridProductData.ProcessCost = parseFloat(gridProductList._options.dataSource[i].ProcessCost).toString();
            gridProductData.UnitCost = parseFloat(gridProductList._options.dataSource[i].UnitCost).toString();
            gridProductData.ProductInputSizes = gridProductList._options.dataSource[i].ProductInputSizes;
            gridProductData.SelectedPlan = gridProductList._options.dataSource[i].SelectedPlan;
            gridProductData.MiscAmount = Number(gridProductList._options.dataSource[i].MiscAmount);
            gridProductData.GSTAmount = parseFloat(gridProductList._options.dataSource[i].GSTAmount).toString();
            gridProductData.GSTPercantage = gridProductList._options.dataSource[i].GSTTaxPercentage;
            if (IsSameState) {
                gridProductData.CGSTPercantage = gridProductList._options.dataSource[i].CGSTPercantage;
                gridProductData.CGSTAmount = parseFloat(gridProductList._options.dataSource[i].CGSTAmount);
                gridProductData.SGSTPercantage = gridProductList._options.dataSource[i].SGSTPercantage;
                gridProductData.SGSTAmount = parseFloat(gridProductList._options.dataSource[i].SGSTAmount);
            } else {
                gridProductData.IGSTPercantage = gridProductList._options.dataSource[i].IGSTPercantage;
                gridProductData.IGSTAmount = parseFloat(gridProductList._options.dataSource[i].IGSTAmount);
            }
            gridProductData.ProfitPer = gridProductList._options.dataSource[i].ProfitPer;
            gridProductData.ProfitCost = parseFloat(gridProductList._options.dataSource[i].ProfitCost).toString();
            gridProductData.MiscPercantage = gridProductList._options.dataSource[i].MiscPer;
            gridProductData.ShippingCost = parseFloat(gridProductList._options.dataSource[i].ShippingCost).toString();
            gridProductData.ProductDescription = gridProductList._options.dataSource[i].ProductDescription;
            gridProductData.PackagingDetails = gridProductList._options.dataSource[i].PackagingDetails;
            gridProductData.DescriptionOther = gridProductList._options.dataSource[i].DescriptionOther;
            gridProductData.IsManualCosting = gridProductList._options.dataSource[i].IsManualCosting;
            objProductConfig.push(gridProductData);
        }
    }

    if (objProductConfig.length <= 0) {
        swal("Please plan the product first..");
        return;
    }
    var BookingNo = document.getElementById("TxtQuoteNo").value;
    //    var Quo_No = BookingNo.split('.');
    //  BookingNo = Quo_No[0];


    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServiceProductMaster.asmx/SaveProjectQuotation",
        data: '{ObjMain:' + JSON.stringify(ObjMain) + ',ObjProductConfig:' + JSON.stringify(objProductConfig) + ',FlagSave:' + JSON.stringify(FlagSave) + ',BookingNo:' + JSON.stringify(BookingNo) + ',IsDirectApproved:' + IsDirectApproved + ',IsDirectPriceApproved:' + IsDirectPriceApproved + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var Title, Text, Type;
            if (results.d.split(',')[0] === "Success") {
                Title = "Success...";
                Text = "Your data Saved... Quotation No. is : " + results.d.split(',')[1];
                Type = "success";
            } else {
                Title = "Error..!";
                Text = results.d;
                Type = "error";
            }
            alert(Text);
            //swal(Title, Text, Type);
            if (Type === "success") {
                window.location.href = window.location.href.split("?")[0].split("#")[0];
                window.location.href.reload(true);
            };
        },
        error: function errorFunc(jqXHR) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            swal("Error!", "Please try after some time..", "");
            console.log(jqXHR);
        }
    });

}
$("#BtnShowList").click(function () {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: 'WebServicePlanWindow.asmx/GetBookingData',
            data: '{FilterSTR:' + JSON.stringify('') + '}',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                GBLContents = RES1.Contents;
                $("#GridShowlist").dxDataGrid({
                    dataSource: RES1.Projects,
                });
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    } finally {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});
$("#btnCloseiFrame").click(function () {
    ReloadClients();
});
$("#BtnDelete").click(function () {
    var EstimateID = Number(document.getElementById("EstimateID").value);
    var BookingID = Number(document.getElementById("BookingID").value);
    if (BookingID.toString() == 'NaN')
        BookingID = 0;
    if (EstimateID === null || EstimateID <= 0) {
        swal("Please select any record to delete..!");
        return false;
    }
    swal({
        title: "Are you sure to delete selected record..?",
        text: 'You will not be able to recover!',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebServiceProductMaster.asmx/DeleteProjectQuotation",
                data: '{TxtPOID:' + Number(EstimateID) + ',TxtBKID:' + Number(BookingID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    var Title, Text, Type;
                    if (results.d.includes("Success")) {
                        Title = "Success...";
                        Text = "Your data has been deleted successfully...";
                        Type = "success";
                    } else {
                        Title = "Error..!";
                        Text = results.d;
                        Type = "error";
                    }
                    swal(Title, Text, Type);
                    if (Type === "success") window.location.reload();
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });
        });
});
// for Offset case to change master page ui ----------sndp-11-08-22
document.getElementById('Customleftsidebar2').style.display = 'none';
document.getElementById('mySidenav').style.left = 0;
$('#Quotation_Finalize').click()

function checkIfRemoteFileExists(urlp) {
    $.ajax({
        url: urlp,
        async: false,
        type: 'HEAD',
        error: function () {
            urlp = "images/800X600 PIXL SOFTBERRY LOGO.png";
            //file not exists
        },
        success: function () {
            return urlp;
            //file exists
        }
    });
    return urlp;
};


function allQuantity(qty, ContentName, Orientation, ProductImagePath) {
    //alert(qt.id);
    Gbl_RowID = ""; Gbl_QtyID = "";

    Gbl_TDQty = qty;
    document.getElementById("PlanContQty").innerHTML = qty;
    document.getElementById("PlanContImg").src = ProductImagePath;
    var Bottompopup = document.getElementById('BottomTabBar');
    var Bottomoverlay = document.getElementById('MYbackgroundOverlay');
    document.getElementById('RightTabBar').style.width = "0px";
    document.getElementById('mySidenav').style.width = "0px";
    Bottompopup.style.height = "92.5%";
    Bottompopup.style.marginLeft = "-30px";
    Bottompopup.style.display = "block";
    Bottomoverlay.style.display = 'block';
    PlanWindowr(ContentName, Orientation);

}

function PlanWindowr(ContentName, Orientation) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        document.getElementById("PlanContName").innerHTML = ContentName;
        document.getElementById("LblPlanContName").innerHTML = ContentName;
        readContentsSizes(Orientation, ContentName);
        document.getElementById("ContentOrientation").innerHTML = Orientation;
        //find Div Scroll Height
        $("#BottomTabBar").animate({ scrollTop: 0 }, "slow");
    } catch (e) {
        alert(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

$("#btnApplyCostPQ").click(function () {
    var chkstate = false;
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var result = $.grep(GBLClientData, function (ex) { return ex.LedgerID === SelClientID; });
    if (result.length === 1) {
        if (GBLLoginCompanyState == result[0].State)
            chkstate = true;
        else
            chkstate = false;
    }
    if (Number(document.getElementById("finalquotatedCost").value) <= 0 || isNaN(document.getElementById("finalquotatedCost").value)) {
        swal({
            title: "Empty or Invalid Cost?",
            text: "Please select plan first",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            return;
        });
        return;
    }

    if (GblPlanValues === []) {
        alert("Empty selection\nPlease select plan");
        return;
    }
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var lclGridOperItems = "";
        var lclGridForms = "";
        if (document.getElementById('vehicle1').checked != true) {
            lclGridOperItems = $("#GridOperationDetails").dxDataGrid('instance')._controllers.data._dataSource._items;
            lclGridForms = $("#GridFormsDetails").dxDataGrid('instance')._controllers.data._dataSource._items;
        } else {
            GblPlanValues.VendorID = $('#SelvendorOffset').dxSelectBox('instance').option('value');
            GblPlanValues.VendorName = $('#SelvendorOffset').dxSelectBox('instance').option('text');
        }
        var FinalQuotedCost1 = parseFloat(document.getElementById("finalquotatedCost").value);
        var NetAmount = parseFloat(document.getElementById('NetAmt').value);
        var FinalMiscPer = parseFloat(document.getElementById("FinalMiscPer").value);
        var FinalShipperCost = parseFloat(document.getElementById("FinalShipperCost").value);
        var ProfitPer = parseFloat(document.getElementById("ProfitPer").value);
        var ProfitCost = parseFloat(document.getElementById("ProfitCost").value);
        var GSTAmount = parseFloat(document.getElementById("FinalTaxCost").value);
        var FinalTaxPer = parseFloat(document.getElementById("FinalTaxPer").value);
        var VendorUnitCostOffset = parseFloat(document.getElementById("VendorUnitCostOffset").value);


        var PrdDisc = document.getElementById("OffsetPrdDisc").value;
        var PkgDtail = document.getElementById("OffsetPkgDtail").value;
        var OtrDisc = document.getElementById("OffsetOtrDisc").value;

        if ($("#OperId").text() == "") {
            alert("There is no process allocated , Please add processes.");
            return;
        }

        var gridProductData = $('#gridProductList').dxDataGrid('instance');
        var gridProductData1 = $('#gridProductList').dxDataGrid('instance').getSelectedRowsData();
        for (var i = 0; i < gridProductData1.length; i++) {
            var row = gridProductData1[0].SequenceNo - 1;
            //if (gridProductData._options.dataSource[row].ProductCatalogID === ProductCatalogID && gridProductData._options.dataSource[i].ProductName1 === parseFloat(document.getElementById("TxtPlanQty").value)) {
            gridProductData._options.dataSource[row].Rate = VendorUnitCostOffset;
            gridProductData._options.dataSource[row].UnitCostVendor = VendorUnitCostOffset;
            gridProductData._options.dataSource[row].IsOffsetProduct = 1;

            gridProductData._options.dataSource[row].VendorRate = parseFloat(document.getElementById('finalUnitCost').value);
            gridProductData._options.dataSource[row].RateType = "Per Unit";
            gridProductData._options.dataSource[row].Amount = parseFloat(NetAmount);
            gridProductData._options.dataSource[row].MiscPer = parseFloat(FinalMiscPer);
            gridProductData._options.dataSource[row].ShippingCost = parseFloat(FinalShipperCost);
            gridProductData._options.dataSource[row].FinalAmount = parseFloat(FinalQuotedCost1);
            gridProductData._options.dataSource[row].ProfitPer = parseFloat(ProfitPer);
            gridProductData._options.dataSource[row].ProfitCost = parseFloat(ProfitCost);
            gridProductData._options.dataSource[row].GSTAmount = parseFloat(GSTAmount);
            gridProductData._options.dataSource[row].GSTTaxPercentage = parseFloat(FinalTaxPer);
            gridProductData._options.dataSource[row].RequiredQuantity = gridProductData._options.dataSource[i].Quantity;
            gridProductData._options.dataSource[row].UnitCost = parseFloat(document.getElementById('finalUnitCost').value);
            gridProductData._options.dataSource[row].VendorID = GblPlanValues.VendorID;
            gridProductData._options.dataSource[row].VendorName = GblPlanValues.VendorName;
            if (chkstate) {
                gridProductData._options.dataSource[row].CGSTPercantage = FinalTaxPer / 2;
                gridProductData._options.dataSource[row].CGSTAmount = parseFloat(GSTAmount) / 2;
                gridProductData._options.dataSource[row].SGSTPercantage = FinalTaxPer / 2;
                gridProductData._options.dataSource[row].SGSTAmount = parseFloat(GSTAmount) / 2;
                gridProductData._options.dataSource[row].IGSTPercantage = 0;
                gridProductData._options.dataSource[row].IGSTAmount = 0;
            } else {
                gridProductData._options.dataSource[row].IGSTPercantage = FinalTaxPer;
                gridProductData._options.dataSource[row].IGSTAmount = parseFloat(GSTAmount);
                gridProductData._options.dataSource[row].CGSTPercantage = 0;
                gridProductData._options.dataSource[row].CGSTAmount = 0;
                gridProductData._options.dataSource[row].SGSTPercantage = 0;
                gridProductData._options.dataSource[row].SGSTAmount = 0;
            }
            gridProductData._options.dataSource[row].DescriptionOther = OtrDisc;
            gridProductData._options.dataSource[row].ProcessIDStr = $("#OperId").text();
            gridProductData._options.dataSource[row].PackagingDetails = PkgDtail;
            gridProductData._options.dataSource[row].ProductDescription = PrdDisc;
            gridProductData._options.dataSource[row].IsManualCosting = document.getElementById('vehicle1').checked;
            gridProductData.refresh();
            break;
            //}
        }

        if (document.getElementById('vehicle1').checked != true) {
            removeContentQtyWise(GblPlanValues, lclGridOperItems, lclGridForms);
        }
        //        GblInputValues.OperId = $("#OperId").text();
        saveContentsSizeValues(GblInputValues);
        saveContentsOprations(GblInputOpr);

        closeBottomTabBar();

        document.getElementById("finalCost").value = 0;
        document.getElementById("finalUnitCost").value = 0;
        document.getElementById("FinalShipperCost").value = 0;
        document.getElementById("FinalTaxPer").value = 0;
        document.getElementById("FinalMiscPer").value = 0;
        $("#SelJobSizeTemplate").dxSelectBox({
            value: -1
        });
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

function onChangeCalcAmountp(id) {
    try {
        var PlanQty = Number(document.getElementById('PlanContQty').innerHTML);
        var finalUnitCost = parseFloat(document.getElementById('finalUnitCost').value);
        var taxper = parseFloat(document.getElementById('FinalTaxPer').value);
        var FinalShipperCost = parseFloat(document.getElementById('FinalShipperCost').value);
        var FinalMiscPer = parseFloat(document.getElementById('FinalMiscPer').value);
        var finalCost = parseFloat(NetcostOffset)// Number(document.getElementById('finalCost').value);
        var ProfitPer = parseFloat(document.getElementById('ProfitPer').value);
        var MiscCost = parseFloat(document.getElementById('FinalMiscCost').value);
        var ProfitCost = parseFloat(document.getElementById('ProfitCost').value);

        // Adding Misc Cost 
        if (id != undefined && id === 'FinalMiscCost') {
            document.getElementById('FinalMiscPer').value = (MiscCost * 100 / (finalCost)).toFixed(2);
        } else {
            document.getElementById('FinalMiscCost').value = (finalCost * FinalMiscPer / 100).toFixed(2);
        }
        finalCost += parseFloat(document.getElementById('FinalMiscCost').value);

        // Calculation of Profits
        if (id != undefined && id === 'ProfitCost') {
            document.getElementById('ProfitPer').value = (ProfitCost * 100 / (finalCost)).toFixed(2);
        } else {
            document.getElementById('ProfitCost').value = (finalCost * ProfitPer / 100).toFixed(2);
        }
        finalCost += parseFloat(document.getElementById('ProfitCost').value);

        // Adding Shiping Cost To final Amt 
        finalCost += parseFloat(FinalShipperCost);

        finalCost = parseFloat(document.getElementById('PlanContQty').innerHTML) * parseFloat(parseFloat(finalCost) / parseFloat(document.getElementById('PlanContQty').innerHTML)).toFixed(2)

        finalCost += parseFloat(document.getElementById('ProfitCost').value)
        var taxamt = finalCost * taxper / 100;

        document.getElementById('NetAmt').value = parseFloat(finalCost).toFixed(2);
        document.getElementById('ShippingGSTOffset').innerText = parseFloat(parseFloat(FinalShipperCost) + parseFloat(FinalShipperCost * 18 / 100)).toFixed(2);

        document.getElementById('finalquotatedCost').value = 0;
        document.getElementById('FinalTaxCost').value = taxamt.toFixed(2);
        document.getElementById('finalquotatedCost').value = (parseFloat(finalCost) + parseFloat(taxamt)).toFixed(2)
        document.getElementById('finalUnitCost').value = parseFloat(parseFloat(finalCost) / parseFloat(document.getElementById('PlanContQty').innerHTML)).toFixed(2);
        //document.getElementById('QuotedUCostOffset').innerHTML = parseFloat(parseFloat(finalCost) / parseFloat(document.getElementById('PlanContQty').innerHTML)).toFixed(2);

    } catch (e) {
        alert(e);
    }
}


function onChangeCalcAmountFlex(id) {
    try {
        var finalCost = Number(document.getElementById('finalCost1').value);
        var QTY = Number(document.getElementById('TxtPlanQty').value);
        var ProfitPer = Number(document.getElementById('ProfitPer1').value);
        var taxper = Number(document.getElementById('FinalTaxPer1').value);
        var FinalShipperCost = Number(document.getElementById('FinalShipperCost1').value);
        var FinalMiscPer = Number(document.getElementById('FinalMiscPer1').value);
        var MiscCost = Number(document.getElementById('FinalMiscCost1').value);
        var ProfitCost = Number(document.getElementById('ProfitCost1').value);

        // Adding Misc Cost 
        if (id != undefined && id === 'FinalMiscCost1') {
            document.getElementById('FinalMiscPer1').value = (MiscCost * 100 / (finalCost)).toFixed(2);
        } else {
            document.getElementById('FinalMiscCost1').value = (finalCost * FinalMiscPer / 100).toFixed(2);
        }
        finalCost += Number(document.getElementById('FinalMiscCost1').value);


        // Calculation Profit 
        if (id != undefined && id === 'ProfitCost1') {
            document.getElementById('ProfitPer1').value = (ProfitCost * 100 / (finalCost)).toFixed(2);
        } else {
            document.getElementById('ProfitCost1').value = (finalCost * ProfitPer / 100).toFixed(2);
        }
        finalCost += Number(document.getElementById('ProfitCost1').value);


        // Adding Shiping Cost To final Amt
        finalCost += Number(FinalShipperCost);
        var taxamt = finalCost * taxper / 100;

        document.getElementById('NetAmtflex').value = Number(finalCost).toFixed(2);

        document.getElementById('FinalTaxCost1').value = taxamt.toFixed(2);
        document.getElementById('ShippingGSTFlex').innerText = Number(Number(FinalShipperCost) + Number(FinalShipperCost * 18 / 100)).toFixed(2);

        document.getElementById('FinalTotal').value = (Number(finalCost) + Number(taxamt)).toFixed(2);

        document.getElementById('FinalUnitCost1').value = Number(Number(finalCost) / QTY).toFixed(2);
    } catch (e) {
        alert(e);
    }
}

var TblPlanning = [], TblOperations = [], TblContentForms = [];
function readAllSelectedPlans() {
    try {
        //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        //var FlgPlan = false, FlgOpr = false, FlgBook = false;
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                TblPlanning.push(cursor.value);

                cursor.continue();
            } else {
                //alert("No more entries!");
                FlgPlan = true;

                /**
                 * Fetch all Job Contents Forms data **/
                var objectJobForms = db.transaction("JobContentsForms").objectStore("JobContentsForms");
                objectJobForms.openCursor().onsuccess = function (event) {
                    var curForms = event.target.result;
                    var FormsData = {};
                    if (curForms) {
                        for (var val = 0; val < curForms.value.length; val++) {
                            //if (curForms.value.PlanContentType === cursor.value.PlanContentType && Number(curForms.value.PlanContQty) === Number(cursor.value.PlanContQty) && cursor.value.PlanContName === curForms.value.PlanContName) {
                            FormsData = {};
                            FormsData = curForms.value[val];
                            FormsData.PlanContQty = curForms.value.PlanContQty;
                            FormsData.PlanContentType = curForms.value.PlanContentType;
                            FormsData.PlanContName = curForms.value.PlanContName;
                            TblContentForms.push(FormsData);
                            //}
                        }
                        curForms.continue();
                    } else {
                        //alert("No more entries!");
                        FlgBook = true;
                        //Fetch all operations data
                        var objectJobOperation = db.transaction("JobOperation").objectStore("JobOperation");
                        objectJobOperation.openCursor().onsuccess = function (event) {
                            var curOper = event.target.result;
                            var operData = {};
                            if (curOper) {
                                //if (curOper.value.PlanContentType === cursor.value.PlanContentType && Number(curOper.value.PlanContQty) === Number(cursor.value.PlanContQty) && cursor.value.PlanContName === curOper.value.PlanContName) {
                                var TransID = 1;
                                for (var val = 0; val < curOper.value.length; val++) {
                                    operData = {};
                                    //operData = curOper.value[val];
                                    operData.PlanContQty = curOper.value.PlanContQty;
                                    operData.PlanContentType = curOper.value.PlanContentType;
                                    operData.PlanContName = curOper.value.PlanContName;

                                    operData.SequenceNo = TransID;
                                    operData.ProcessID = Number(curOper.value[val].ProcessID);
                                    operData.SizeL = Number(curOper.value[val].SizeL);
                                    operData.SizeW = Number(curOper.value[val].SizeW);
                                    operData.NoOfPass = Number(curOper.value[val].NoOfPass);
                                    operData.Quantity = Number(curOper.value[val].Quantity);
                                    operData.Rate = Number(curOper.value[val].Rate).toFixed(3);
                                    operData.Ups = Number(curOper.value[val].Ups);
                                    operData.Amount = Number(curOper.value[val].Amount);
                                    operData.Remarks = curOper.value[val].Remarks;
                                    operData.PlanID = Number(curOper.value[val].PlanID);
                                    operData.RateFactor = curOper.value[val].RateFactor;
                                    operData.IsDisplay = Number(curOper.value[val].IsDisplay); ///added on 16-10-19

                                    TransID = TransID + 1;
                                    TblOperations.push(operData);
                                }
                                // }
                                curOper.continue();
                            } else {
                                //alert("No more entries!");
                                FlgOpr = true;
                                if (FlgPlan === true && FlgOpr === true && FlgBook === true) {
                                    callSaveQuote(TblPlanning, TblOperations, TblContentForms);
                                }
                            }
                        };
                    }
                };
            }
        };
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

function callSaveQuote(TblPlanning, TblOperations, TblContentForms) {
    var JobName = document.getElementById("TxtProjectName").value.trim();
    var ArtWorkCode = document.getElementById("ArtWorkCode").value.trim();
    var Remark = document.getElementById("TxtRemark").value.trim();
    var LedgerId = $("#SbClientName").dxSelectBox("instance").option('value');   // integer Value
    //var CategoryId = $("#SbCategory").dxSelectBox("instance").option('value');   // integer Value
    var SbProductHSNID = $("#SbHSNGroups").dxSelectBox("instance").option('value');
    var SalesPersonID = $('#SelSalesPerson').dxSelectBox('instance').option('value');
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var TxtProjectName = document.getElementById("TxtProjectName").value.trim();


    var gridProductList = $('#gridProductList').dxDataGrid('instance');

    if (TxtProjectName === "" || TxtProjectName === null) {
        DevExpress.ui.notify("Please enter project name..!", "error", 2000);
        document.getElementById("TxtProjectName").focus();
        return false;
    }
    if (SelClientID === "" || SelClientID === null) {
        DevExpress.ui.notify("Please select client..!", "error", 2000);
        $("#SelClient").dxValidator('instance').validate();
        return false;
    }
    if (SalesPersonID === "" || SalesPersonID === null) {
        DevExpress.ui.notify("Please select sales person..!", "error", 2000);
        $("#SelSalesPerson").dxValidator('instance').validate();
        return false;
    }
    if (gridProductList._options.dataSource.length <= 0) {
        DevExpress.ui.notify("Please add at least one product ..!", "warning", 1000);
        return;
    }
    if (TblPlanning.length <= 0) {
        FinalSave(0); /// If there is no Offset Product in  list
        return;
        //DevExpress.ui.notify("No data for save..!", "error", 100);
        //return;
    }

    var TblBooking = [];
    var ObjBooking = {};
    ObjBooking.JobName = JobName;
    ObjBooking.LedgerID = LedgerId;
    ObjBooking.ProductCode = ArtWorkCode;
    ObjBooking.ExpectedCompletionDays = '';
    ObjBooking.CategoryID = 0;
    ObjBooking.Remark = Remark;
    //ObjBooking.BookingRemark = TaQuoteDetails;
    ObjBooking.IsEstimate = 1;
    ObjBooking.ClientName = SelClientID;
    ObjBooking.OrderQuantity = 0;
    ObjBooking.TypeOfCost = 'UnitCost';
    ObjBooking.FinalCost = 0;
    ObjBooking.QuotedCost = 0;
    ObjBooking.QuoteType = "Job Costing";
    //ObjBooking.ConsigneeID = SbConsigneeID;
    ObjBooking.ProductHSNID = SbProductHSNID;
    ObjBooking.CurrencySymbol = "INR";
    ObjBooking.ConversionValue = 1;
    //ObjBooking.ParentBookingID = ParentBookingID;
    //ObjBooking.ShipperID = GblShipperID;

    TblBooking.push(ObjBooking);

    var jsonObjectsCosting = [];
    var Costing = {};

    var gridProductList = $('#gridProductList').dxDataGrid('instance');
    for (var i = 0; i < gridProductList._options.dataSource.length; i++) {
        Costing = {};
        if (Number(gridProductList._options.dataSource[i].Rate) >= 0 && Number(gridProductList._options.dataSource[i].Amount) >= 0 && gridProductList._options.dataSource[i].IsOffsetProduct == true) {
            Costing.MiscPercentage = gridProductList._options.dataSource[i].MiscPer;
            Costing.TaxPercentage = gridProductList._options.dataSource[i].GSTTaxPercentage;
            Costing.PlanContQty = gridProductList._options.dataSource[i].Quantity;
            Costing.ShipperCost = gridProductList._options.dataSource[i].ShipperCost;
            Costing.MiscCost = Number(gridProductList._options.dataSource[i].Amount * gridProductList._options.dataSource[i].MiscPer / 100);
            Costing.TaxAmount = Number(gridProductList._options.dataSource[i].Amount * gridProductList._options.dataSource[i].GSTTaxPercentage / 100);;
            Costing.TotalCost = gridProductList._options.dataSource[i].FinalAmount;
            Costing.FinalCost = gridProductList._options.dataSource[i].FinalAmount;
            Costing.QuotedCost = gridProductList._options.dataSource[i].FinalAmount;
            Costing.GrandTotalCost = gridProductList._options.dataSource[i].FinalAmount;
            Costing.UnitCost = gridProductList._options.dataSource[i].Rate;
            Costing.CurrencySymbol = 'INR';
            Costing.ConversionValue = 1;
            jsonObjectsCosting.push(Costing);
        }
    }
    var CostingData = JSON.stringify(jsonObjectsCosting);
    //var BookingNo = document.getElementById("QuotationNo").value;
    //var Quo_No = BookingNo.split('.');
    //BookingNo = Quo_No[0];

    document.getElementById("BtnSaveQuotation").style.display = 'none';
    $.ajax({
        async: false,
        type: "POST",
        url: "WebServicePlanWindow.asmx/saveQuotationData",
        data: '{TblBooking:' + JSON.stringify(TblBooking) + ',TblPlanning:' + JSON.stringify(TblPlanning) + ',TblOperations:' + JSON.stringify(TblOperations) + '' +
            ', TblContentForms: ' + JSON.stringify(TblContentForms) + ', CostingData: ' + CostingData + ', FlagSave: ' + JSON.stringify(FlagSave) + ', BookingNo: ' + JSON.stringify(ProjectBookingID) + ',ObjShippers:[],ArrObjAttc:[]}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var RES1 = JSON.parse(results);
            var Title, Text, Type;
            if (RES1.d.includes("Error:500")) {
                document.getElementById("ContentOrientation").innerHTML = "";
                Title = "Error in saving quotation..!, Please send this error to indus support team";
                Text = RES1.d;
                Type = "error";
            } else if (RES1.d.includes("You are not authorized")) {
                Title = "Access Denied..!";
                Text = RES1.d;
                Type = "warning";
            } else {
                Title = "Quotation Saved..!";
                Text = "";
                Type = "success";
                DevExpress.ui.notify("Quotation Saved..!", "success", 1500);
                FinalSave(RES1.d);
                return;
            }
            swal(Title, Text, Type);
            if (Type === "success") {
                window.setTimeout(function () {
                    window.location.href = window.location.href.split("?")[0].split("#")[0];
                    window.location.href.reload(true);
                }, 200);
            } else {
                document.getElementById("BtnSaveQuotation").style.display = 'block';
            }
        },
        error: function (ex) {
            console.log(ex);
        }
    });
}

$('#BtnPrint').click(function () {
    var SelectedPlanData = $("#GridShowlist").dxDataGrid("instance").getSelectedRowsData();
    window.open("/ProjectQuotationReportViewer.aspx?t=" + SelectedPlanData[0].ProductEstimateID, '_blank')
});

function CalculateUnitCost(id) {

    var QTY = Number(document.getElementById('TxtPlanQtyUnit').value);
    var Rate = Number(document.getElementById('VendorRate').value);
    var ProfitPer = Number(document.getElementById('ProfitPerUnit').value);
    var taxper = Number(document.getElementById('FinalTaxPerUnit').value);
    var FinalShipperCost = Number(document.getElementById('FinalShipperCostUnit').value);
    var FinalMiscPer = Number(document.getElementById('FinalMiscPerUnit').value);
    var MiscCost = Number(document.getElementById('FinalMiscCostUnit').value);
    var ProfitCost = Number(document.getElementById('ProfitCostUnit').value);

    document.getElementById('VendorUnitCostUnit').value = Rate;

    var finalCost = Number(QTY * Rate);

    // Misc Cost Calculation --
    if (id != undefined && id === 'FinalMiscCostUnit') {
        document.getElementById('FinalMiscPerUnit').value = (MiscCost * 100 / (finalCost)).toFixed(2);
    } else {
        document.getElementById('FinalMiscCostUnit').value = finalCost * FinalMiscPer / 100;
    }

    finalCost += Number(document.getElementById('FinalMiscCostUnit').value);

    // Profit Cost Calculation ---
    if (id != undefined && id === 'ProfitCostUnit') {
        document.getElementById('ProfitPerUnit').value = (ProfitCost * 100 / (finalCost)).toFixed(2);
    } else {
        document.getElementById('ProfitCostUnit').value = (finalCost * ProfitPer / 100).toFixed(2);
    }

    finalCost += Number(document.getElementById('ProfitCostUnit').value);



    // Adding Shipping Cost 
    finalCost += Number(FinalShipperCost);

    // Tax Calculation
    var TaxtAmt = Number(finalCost * taxper / 100).toFixed(2);

    // Cost Calculation or Net Amount without GST
    document.getElementById('finalCostUnit').value = Number(finalCost).toFixed(2)

    document.getElementById('FinalTaxCostUnit').value = TaxtAmt;
    document.getElementById('ShippingGSTUnit').innerText = Number(Number(FinalShipperCost) + Number(FinalShipperCost * 18 / 100)).toFixed(2);

    document.getElementById('FinalTotalUnit').value = Number(Number(finalCost) + Number(TaxtAmt)).toFixed(2);

    document.getElementById('FinalUnitCostUnit').value = Number(finalCost / QTY).toFixed(2);
}

$("#BtnApplyPlanUnit").click(function () {
    var chkstate = false;
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var result = $.grep(GBLClientData, function (ex) { return ex.LedgerID === SelClientID; });
    if (result.length === 1) {
        if (GBLLoginCompanyState == result[0].State)
            chkstate = true;
        else
            chkstate = false;
    }
    var VendorID = $('#Selvendor').dxSelectBox('instance').option('value');
    var VendorName = $('#Selvendor').dxSelectBox('instance').option('text');


    if (VendorID === "" || VendorID === null) {
        DevExpress.ui.notify("Please select Vendor..!", "error", 2000);
        $("#Selvendor").dxValidator('instance').validate();
        return false;
    }

    if (Number(document.getElementById("FinalTotalUnit").value) <= 0 || isNaN(document.getElementById("FinalTotalUnit").value)) {
        swal({
            title: "Empty or Invalid Cost?",
            text: "Please enter rate",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            return;
        });
        return;
    }


    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var QTY = Number(document.getElementById('TxtPlanQtyUnit').value);
        var Rate = Number(document.getElementById('VendorRate').value);
        var VendorUnitCostUnit = Number(document.getElementById('VendorUnitCostUnit').value);

        var FinalQuotedCost1 = Number(document.getElementById("FinalTotalUnit").value);
        var FinalMiscPer = Number(document.getElementById("FinalMiscPerUnit").value);
        var FinalShipperCost = Number(document.getElementById("FinalShipperCostUnit").value);
        var ProfitPer = Number(document.getElementById("ProfitPerUnit").value);
        var ProfitCost = Number(document.getElementById("ProfitCostUnit").value);

        var GSTAmount = Number(document.getElementById("FinalTaxCostUnit").value);
        var FinalTaxPer = Number(document.getElementById("FinalTaxPerUnit").value);

        var NetAmount = Number(document.getElementById("finalCostUnit").value).toFixed(2);

        var PrdDisc = document.getElementById("UnitPrdDisc").value;
        var PkgDtail = document.getElementById("UnitPkgDtail").value;
        var OtrDisc = document.getElementById("UnitOtrDisc").value;

        var gridProductData = $('#gridProductList').dxDataGrid('instance');

        var gridOperation = $('#UnitProcessDefault').dxDataGrid('instance')._options.dataSource;
        var Suggestedoperation = $('#UnitProcessSuggestion').dxDataGrid('instance')._options.dataSource.store.data;

        var oprids = '';
        for (var i = 0; i < gridOperation.length; i++) {
            oprids = oprids + gridOperation[i].ProcessID + ','
        }

        if (oprids == "") {
            alert("No process available, please add process");
            return;
        }

        var suggestoprids = '';
        for (var i = 0; i < Suggestedoperation.length; i++) {
            suggestoprids = suggestoprids + Suggestedoperation[i].ProcessID + ','
        }

        for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
            if (gridProductData._options.dataSource[i].ProductCatalogID === ProductCatalogID && gridProductData._options.dataSource[i].Quantity === Number(document.getElementById("TxtPlanQtyUnit").value)) {
                gridProductData._options.dataSource[i].Rate = document.getElementById('VendorRate').value;
                gridProductData._options.dataSource[i].UnitCostVendor = VendorUnitCostUnit.toFixed(2).toString();
                gridProductData._options.dataSource[i].RateType = "Per Unit";
                gridProductData._options.dataSource[i].IsOffsetProduct = 0;
                gridProductData._options.dataSource[i].Amount = Number(NetAmount);
                gridProductData._options.dataSource[i].MiscPer = Number(FinalMiscPer);
                gridProductData._options.dataSource[i].ShippingCost = Number(FinalShipperCost);
                gridProductData._options.dataSource[i].FinalAmount = Number(FinalQuotedCost1);
                gridProductData._options.dataSource[i].ProfitPer = Number(ProfitPer);
                gridProductData._options.dataSource[i].ProfitCost = Number(ProfitCost);
                gridProductData._options.dataSource[i].DefaultProcessStr = oprids.slice(0, -1);
                gridProductData._options.dataSource[i].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
                gridProductData._options.dataSource[i].GSTAmount = Number(GSTAmount);
                gridProductData._options.dataSource[i].GSTTaxPercentage = Number(FinalTaxPer);
                gridProductData._options.dataSource[i].RequiredQuantity = Number(document.getElementById("TxtPlanQtyUnit").value);
                gridProductData._options.dataSource[i].VendorRate = Number(document.getElementById('VendorRate').value);
                gridProductData._options.dataSource[i].UnitCost = Number(document.getElementById('FinalUnitCostUnit').value);
                gridProductData._options.dataSource[i].VendorID = VendorID;
                gridProductData._options.dataSource[i].VendorName = VendorName;
                gridProductData._options.dataSource[i].DescriptionOther = OtrDisc;
                gridProductData._options.dataSource[i].PackagingDetails = PkgDtail;
                gridProductData._options.dataSource[i].ProductDescription = PrdDisc;
                if (chkstate) {
                    gridProductData._options.dataSource[i].CGSTPercantage = FinalTaxPer / 2;
                    gridProductData._options.dataSource[i].CGSTAmount = Number(GSTAmount) / 2;
                    gridProductData._options.dataSource[i].SGSTPercantage = FinalTaxPer / 2;
                    gridProductData._options.dataSource[i].SGSTAmount = Number(GSTAmount) / 2;
                    gridProductData._options.dataSource[i].IGSTPercantage = 0;
                    gridProductData._options.dataSource[i].IGSTAmount = 0;
                } else {
                    gridProductData._options.dataSource[i].IGSTPercantage = FinalTaxPer;
                    gridProductData._options.dataSource[i].IGSTAmount = Number(GSTAmount);
                    gridProductData._options.dataSource[i].CGSTPercantage = 0;
                    gridProductData._options.dataSource[i].CGSTAmount = 0;
                    gridProductData._options.dataSource[i].SGSTPercantage = 0;
                    gridProductData._options.dataSource[i].SGSTAmount = 0;
                }
                gridProductData.refresh();
                break;
            }
        }
        closeBottomTabBar();

        document.getElementById("FinalTotalUnit").value = 0;
        document.getElementById("FinalMiscPerUnit").value = 0;
        document.getElementById("FinalShipperCostUnit").value = 0;
        document.getElementById("FinalTaxPerUnit").value = 0;
        document.getElementById("ProfitPerUnit").value = 0;
        document.getElementById("VendorRate").value = 0;
        $("#Selvendor").dxSelectBox({
            value: -1,
        })
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

        document.getElementById("BtnApplyPlanUnit").setAttribute("data-dismiss", "modal");

    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

document.getElementById("SelClient").focus();

$("#gridSelOperation").dxDataGrid({
    keyExpr: "ProcessID",
    dataSource: [],

    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    selection: { mode: "single" },
    columns: [{ dataField: "ProcessName" },
    { dataField: "Rate", width: 50, visible: false },
    { dataField: "RateFactor", fixedPosition: "right" },
    { dataField: "TypeofCharges" },
    { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80, visible: false },
    {
        dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 40, allowEditing: false,
        cellTemplate: function (container, options) {
            $('<div title="' + options.data.ProcessName + '">').addClass('fa fa-plus customgridbtn').appendTo(container);
        }
    }

    ],
    paging: {
        pageSize: 10
    },
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: true
    },
    //editing: {
    //    mode: 'cell',
    //    allowUpdating: true
    //},
    height: function () {
        return window.innerHeight / 4.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.caption === "Add") {
            try {

                var dataGrid = $('#gridOperation').dxDataGrid('instance');

                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ProcessID === clickedCell.data.ProcessID });
                if (result.length > 0) {
                    DevExpress.ui.notify("Duplicate process found..!", "warning", 1000);
                    return;
                }
                var newdata = [];
                newdata.ProcessID = clickedCell.data.ProcessID;
                newdata.ProcessName = clickedCell.data.ProcessName;
                newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                newdata.RateFactor = clickedCell.data.RateFactor;
                newdata.TypeofCharges = clickedCell.data.TypeofCharges;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                //dataGrid._events.preventDefault();
                DevExpress.ui.notify("Process added..!", "success", 1000);
                //clickedCell.component.clearFilter();

                // TO REMOVE FROM THIS GRID
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

            } catch (e) {
                console.log(e);
            }
        }
    },
});
$("#UnitProcessSuggestion").dxDataGrid({
    keyExpr: "ProcessID",
    dataSource: [],
    allowEditing: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    selection: { mode: "single" },
    columns: [{ dataField: "ProcessName", allowEditing: false },
    { dataField: "Rate", width: 50, visible: false, allowEditing: false },
    { dataField: "RateFactor", fixedPosition: "right", allowEditing: false, },
    { dataField: "TypeofCharges", allowEditing: false },
    { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80, allowEditing: false, visible: false },
    {
        dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 40,
        cellTemplate: function (container, options) {
            $('<div title="' + options.data.ProcessName + '">').addClass('fa fa-plus customgridbtn').appendTo(container);
        }
    }

    ],
    paging: {
        pageSize: 10
    },
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: true
    },
    //editing: {
    //    mode: 'cell',
    //    allowUpdating: true
    //},
    height: function () {
        return window.innerHeight / 4.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onCellClick: function (clickedCell) {
        if (clickedCell.rowType === undefined) return;
        if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
            return false;
        }
        if (clickedCell.column.caption === "Add") {
            try {

                var dataGrid = $('#UnitProcessDefault').dxDataGrid('instance');

                var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ProcessID === clickedCell.data.ProcessID });
                if (result.length > 0) {
                    DevExpress.ui.notify("Duplicate process found..!", "warning", 1000);
                    return;
                }
                var newdata = [];
                newdata.ProcessID = clickedCell.data.ProcessID;
                newdata.ProcessName = clickedCell.data.ProcessName;
                newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                newdata.RateFactor = clickedCell.data.RateFactor;
                newdata.TypeofCharges = clickedCell.data.TypeofCharges;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                //dataGrid._events.preventDefault();
                DevExpress.ui.notify("Process added..!", "success", 1000);
                //clickedCell.component.clearFilter();

                // TO REMOVE FROM THIS GRID
                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);

            } catch (e) {
                console.log(e);
            }
        }
    },
});

$("#BtnSelectOperation").click(function () {
    document.getElementById("BtnSelectOperation").setAttribute("data-toggle", "modal");
    document.getElementById("BtnSelectOperation").setAttribute("data-target", "#SelectOperation");

});


