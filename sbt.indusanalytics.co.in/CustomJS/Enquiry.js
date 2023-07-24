let ProductCatalogID = 0;
let CategoryID = 0;
let OprDatap = [];
var SelectedProductData = [];
var AllContents = [];
var processids = '';
var suggestedprocessids = '';
var Defaultprocessids = '';
var ProjectBookingID = 0, SalesManagerId = 0;
var EditMode = false;
var Isprocessed = 0;
let GBLCategoryIDForProcess = '';
let SelectedItemImagesStr = '';
let GBLEnquiryDetailID = 0;
let GBLUniqueID = "";
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

$("#SalesCordinator").dxSelectBox({
    dataSource: [],
    placeholder: "Select --",
    valueExpr: "LedgerId",
    displayExpr: "LedgerName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {

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
                        dataSource: RES1.SalesExcutive
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
    onValueChanged: function (data) {
        if (data.value !== null) {

        }
    }
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
                    //if ($.grep($('#gridProductList').dxDataGrid('instance')._options.dataSource, function (ex) { return ex.ProductCatalogID === value; }).length != 0) {
                    //    alert("Duplicate product cannot be added");
                    //    rowData.ProductCatalogID = null
                    //    return;
                    //}
                    //processids = $.grep(p, function (ex) { return ex.ProductHSNID === rowData.ProductHSNID; })
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
                    rowData.ProductName1 = result[0].ProductName + e.SequenceNo;
                    rowData.CategoryID = result[0].CategoryID;
                    rowData.ProcessIDStr = result[0].ProcessIDStr;
                    rowData.ProductHSNID = result[0].ProductHSNID;
                    rowData.IsOffsetProduct = result[0].IsOffsetProduct;
                    rowData.IsUnitProduct = result[0].IsUnitProduct;
                    rowData.DefaultProcessStr = result[0].DefaultProcessStr;
                    rowData.OtherDetails = '';
                    var result = $.grep(ObjProductHSNGrp, function (ex) { return ex.ProductHSNID === rowData.ProductHSNID; });
                    if (result.length === 1) {
                        rowData.GSTTaxPercentage = result[0].GSTTaxPercentage;
                    } else
                        rowData.GSTTaxPercentage = 0;
                    //rowData.ProductImagePath = result[0].ProductImagePath;
                } else {
                    rowData.ProductCatalogCode = "";
                    rowData.ProductDescription = "";
                    rowData.ProductName = "";
                    //rowData.ProductImagePath = "";
                    rowData.ProcessIDStr = "";
                    rowData.ProductHSNID = 0;
                    rowData.IsOffsetProduct = 0;
                    rowData.IsUnitProduct = 0;

                }
            }
        },
        // SequenceNo = 2
        { dataField: "ProductName1", caption: "Product Name", allowEditing: true, width: 100 },
        { dataField: "ProductCatalogCode", caption: "Product Code", allowEditing: false, width: 100 },
        { dataField: "ProductDescription", caption: "Product Description", allowEditing: false },
        { dataField: "Quantity", caption: "Quantity", allowEditing: true, dataType: "number", min: 0, validationRules: [{ type: "required", message: "Quantity is required" }] },
        {
            dataField: "PlanHere", caption: "Detail", allowEditing: false,
            cellTemplate(container, options) {
                $('<div>').addClass('btn btn-success')
                    .text("Add Detail")
                    .on('dxclick', function (e) {
                        e.preventDefault();
                        if (options.data.Quantity === undefined || Number(options.data.Quantity) <= 0) return;
                        SelectedProductData = options.data;
                        GBLUniqueID = options.data.UniqueID
                        if (options.data.ProductName == "" || options.data.ProductName == undefined) {
                            var result = $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })
                            options.data.ProductName = result[0].ProductName
                        }

                        GBLCategoryIDForProcess = options.data.ProcessIDStr === undefined ? '' : options.data.ProcessIDStr;
                        document.getElementById("TxtProductName").value = options.data.ProductName;
                        document.getElementById("TxtProductNameUnit").value = options.data.ProductName;
                        document.getElementById("TxtPlanQty").value = options.data.Quantity;
                        document.getElementById("TxtPlanQtyUnit").value = options.data.Quantity;

                        document.getElementById("FlexRemark").value = options.data.OtherDetails;
                        document.getElementById("OffsetRemark").value = options.data.OtherDetails;
                        document.getElementById("UnitRemark").value = options.data.OtherDetails;

                        document.getElementById("FinalTaxPer").value = options.data.GSTTaxPercentage;
                        document.getElementById("FinalTaxPer1").value = options.data.GSTTaxPercentage;
                        document.getElementById("FinalTaxPerUnit").value = options.data.GSTTaxPercentage;
                        document.getElementById("FinalMiscPer1").value = Number(options.data.MiscPer);
                        document.getElementById("FinalMiscPer").value = Number(options.data.MiscPer);
                        document.getElementById("FinalMiscPerUnit").value = Number(options.data.MiscPer);
                        document.getElementById("FinalShipperCost").value = Number(options.data.ShippingCost);
                        document.getElementById("FinalShipperCost1").value = Number(options.data.ShippingCost);
                        document.getElementById("FinalShipperCostUnit").value = Number(options.data.ShippingCost);
                        document.getElementById("FinalTotal").value = Number(options.data.FinalAmount);
                        if (options.data.IsOffsetProduct === true) {
                            document.getElementById("PlanContName").innerHTML = options.data.ProductName1//$.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductName;
                            document.getElementById("PlanContQty").innerHTML = options.data.Quantity;
                            document.getElementById("ContentOrientation").innerHTML = $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName;
                        }
                        document.getElementById('MYbackgroundOverlay').style.display = 'none';
                        const City = document.getElementById("TxtClientCity").value;
                        if (City === "" | City === undefined) {
                            $("#SelClient").dxValidator('instance').validate();
                            //DevExpress.ui.notify("Please select client for best nearby plan..!", "warning", 1500);
                        }

                        if (options.data.attachedfile != "" && options.data.attachedfile != undefined) {
                            //  $("#fileDownloadunit").removeClass("hidden");
                            //$("#fileDownloadunit").attr("href", "Files/Enquiry/" + options.data.attachedfile);
                            //   $("#fileDownloadunit").attr("download", options.data.attachedfile);
                            SelectedItemImagesStr = options.data.attachedfile;

                            GBLEnquiryDetailID = options.data.EnquiryIDDetail;
                            //  $("#fileDownloadflex").removeClass("hidden");
                            //$("#fileDownloadflex").attr("href", "Files/Enquiry/" + options.data.attachedfile);
                            //   $("#fileDownloadflex").attr("download", options.data.attachedfile);

                            //  $("#fileDownloadoffset").removeClass("hidden");
                            //$("#fileDownloadoffset").attr("href", "Files/Enquiry/" + options.data.attachedfile);
                            //  $("#fileDownloadoffset").attr("download", options.data.attachedfile);

                        } else {
                            $("#fileDownloadunit").addClass("hidden");
                            $("#fileDownloadflex").addClass("hidden");
                            $("#fileDownloadoffset").addClass("hidden");
                        }

                        ProductCatalogID = options.data.ProductCatalogID;
                        processids = options.data.ProcessIDStr == null ? '' : options.data.ProcessIDStr;
                        Defaultprocessids = options.data.DefaultProcessStr == null ? '' : options.data.DefaultProcessStr;
                        $("#gridContentPlansList").dxDataGrid({ dataSource: [] });
                        loadProcess();
                        $("OperIdPQ").text(options.data.ProcessIDStr);

                        //reload already created plan for the selected product
                        if (EditMode == true && options.data.IsOffsetProduct !== true && options.data.IsUnitProduct !== true) {
                            Getinputsizess(options.data.EnquiryIDDetail, "Flex")
                        } else {

                            if (options.data.ProductInputSizes !== undefined && options.data.IsOffsetProduct !== true && options.data.IsUnitProduct !== true) {
                                $("#gridProductConfig").dxDataGrid({ dataSource: JSON.parse(options.data.ProductInputSizes) });
                            } else
                                if (options.data.IsUnitProduct !== true && options.data.IsOffsetProduct !== true)
                                    GetProductConfig(ProductCatalogID);
                        }

                        if (options.data.IsOffsetProduct === true) {

                            displayFilesInModal(SelectedItemImagesStr, "OffestUploadexFiles");
                            // allQuantity(options.data.Quantity, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductName, $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductImagePath)
                            allQuantity(options.data.Quantity, options.data.ProductName1, $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductImagePath)

                            if (options.data.ProductInputSizes !== undefined) {
                                $("#GridOperationAllocated").dxDataGrid({ dataSource: [] });
                                LoadAllPlansoffset(options.data.DefaultProcessStr + ',' + options.data.ProcessIDStr, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductName, $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName)
                            }
                            else {
                                //allQuantity(options.data.Quantity, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductName, $.grep(AllContents, function (ex) { return ex.ContentID === $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ContentID; })[0].ContentName, $.grep(ProductMasterList, function (ex) { return ex.ProductCatalogID === options.data.ProductCatalogID; })[0].ProductImagePath)
                                if (EditMode == true) {
                                    Getinputsizess(options.data.EnquiryIDDetail, "Offset")
                                }
                            }
                        } else {
                            if (options.data.IsUnitProduct === true) {
                                // alert('No Information Required');
                                displayFilesInModal(SelectedItemImagesStr, "UnitUploadexFiles");
                                this.setAttribute("data-toggle", "modal");
                                this.setAttribute("data-target", "#modalEstimateProductUnit");
                                return;
                            }
                            displayFilesInModal(SelectedItemImagesStr, "FlexUploadexFiles");
                            this.setAttribute("data-toggle", "modal");
                            this.setAttribute("data-target", "#modalEstimateProduct");

                        }

                        document.getElementById('MYbackgroundOverlay').style.display = 'none';


                    })
                    .appendTo(container);
            },
        },
        { dataField: "Rate", caption: "Cost", allowEditing: false, dataType: "number", visible: false },
        {
            dataField: "RateType", caption: "Rate Type", allowEditing: true, visible: false,
            lookup: {
                dataSource: [{ RateType: "Per Unit" }, { RateType: "Per 1000 Unit" }, { RateType: "Per Square Feet" }],
                displayExpr: "RateType",
                valueExpr: "RateType"
            },// validationRules: [{ type: "required", message: "Rate type is required" }]
        },
        {
            dataField: "ProductHSNID", caption: "HSN Code", allowEditing: true, visible: false,
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
        { visible: false, dataField: "GSTTaxPercentage", caption: "GST Tax", allowEditing: false, dataType: "number" },
        { visible: false, dataField: "MiscPer", caption: "Misc.cost%", allowEditing: false, dataType: "number" },
        { visible: false, dataField: "ShippingCost", caption: "Shipping Cost", allowEditing: false, dataType: "number" },
        { visible: false, dataField: "Amount", caption: "Amount", allowEditing: false, dataType: "number" },
        { visible: false, dataField: "VendorID", allowEditing: false },
        { visible: false, dataField: "VendorName", caption: "Associate Name", allowEditing: false },
        { visible: false, dataField: "City", caption: "City", allowEditing: false },
        { visible: false, dataField: "ProcessCost", caption: "Operation Amount", allowEditing: false },
        { visible: false, dataField: "FinalAmount", caption: "Final Amount", allowEditing: false },
        { visible: false, dataField: "UnitCost", caption: "Unit Price", allowEditing: false },
        { visible: false, dataField: "ProfitPer", caption: "Profit", allowEditing: false },
        { visible: false, dataField: "ProfitCost", caption: "Profit", allowEditing: false },
        { visible: false, dataField: "ProcessIDStr", allowEditing: false },
        { visible: false, dataField: "BookingID", allowEditing: false },
        { visible: false, dataField: "DefaultProcessStr", allowEditing: false },
        { visible: false, dataField: "OtherDetails", allowEditing: false }
    ],
    editing: {
        mode: "popup",
        allowUpdating: false,
        allowDeleting: true,
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
        return window.innerHeight / 2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onInitNewRow: function (e) {
        e.data.SequenceNo = e.component._options.dataSource.length + 1;
        e.data.UniqueID = generateUniqueID(); 
    },
    onEditingStart: function (e) {
        if (e.column.dataField == "Quantity" && e.data.Amount > 0) {
            e.cancel = true;
        }
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
    },

    onSelectionChanged: function (data) {
        if (data) {

        }
    }
}).dxDataGrid('instance');


function generateUniqueID() {
    return Math.random().toString(36).substr(2, 9); // Generates a 9-character alphanumeric ID
}
//AddRow();
function AddRow() {
    $('#gridProductList').dxDataGrid('instance').addRow();
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
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
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

                }
                var gridProductData = $('#gridProductList').dxDataGrid('instance');
                for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
                    if (gridProductData._options.dataSource[i].EnquiryIDDetail == ID)
                        if (res != "ul") {
                            gridProductData._options.dataSource[i].ProductInputSizes = res
                        }
                }



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

function LoadAllPlansoffset(ProcessIDStr, PlanContName, Type) {
    try {
        //removeAllContentsData();
        processids = ProcessIDStr

        //document.getElementById("ContentOrientation").innerHTML = JobCont[i].PlanContentType;


        readContentsSizeValues(Type, PlanContName)
        //loadProcess()
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        alert(e);
    }
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
        return window.innerHeight / 3.2;
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


$("#GridShowlist").dxDataGrid({
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
        { dataField: "ProjectName", caption: "Project Name", width: 180 },
        { dataField: "LedgerName", caption: "Client" },
        { dataField: "SalesLedgerName", caption: "Sales Person" },
        { dataField: "ProductName", caption: "Content Name" },
        { dataField: "ProductName1", caption: "Product Name", width: 180 },
        { dataField: "Quantity", caption: "Quantity" },
        { dataField: "CreatedBy", caption: "Created By" },
        { dataField: "CreatedDate", caption: "Created Date" },
        {
            dataField: "attachedfile",
            caption: "",
            fixedPosition: "right",
            fixed: true,

            cellTemplate(container, options) {
                $('<a>').addClass('fa fa-download dx-link')
                    .on('dxclick', function (e) {
                        e.preventDefault();
                        displayFilesInGrid(options.data.attachedfile)
                        this.setAttribute("data-toggle", "modal");
                        this.setAttribute("data-target", "#ModalDownloadPreview");
                    })
                    .appendTo(container);
            },
        }

    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.6;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },

    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data.length > 0) {
            document.getElementById("BookingID").value = data[0].EnquiryID;
        }
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProductMaster.asmx/GetEnquiryNo",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d.includes("fail") === false) {
            document.getElementById("TxtQuoteNo").value = results.d;
        }
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

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
            $("#SelClient").dxSelectBox({ dataSource: RES1 });
        },
        error: function errorFunc(jqXHR) {
            console.log(jqXHR);
        }
    });
}
ReloadClients();
$("#btnCloseiFrame").click(function () {
    ReloadClients();
});
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


$("#BtnEdit").click(function () {
    if (Isprocessed == 1) {
        alert("You can't load this enquiry, Quotation is already created");
        return;
    }
    var datasource = $('#GridShowlist').dxDataGrid('instance')._options.dataSource;
    datasource = $.grep(datasource, function (ex) { return ex.EnquiryID === Number(document.getElementById("BookingID").value) })
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
    document.getElementById('TxtFreightAmount').value = datasource[0].FreightAmount;
    document.getElementById('TxtRemark').value = datasource[0].Narration;
    document.getElementById('TxtQuoteNo').value = datasource[0].EnquiryNo

    for (var i = 0; i < datasource.length; i++) {
        datasource[i].SequenceNo = i + 1;
    }
    $('#gridProductList').dxDataGrid({
        dataSource: datasource
    })



    for (let i = 0; i < datasource.length; i++) {
        const val = datasource[i];
        if (val.IsUnitProduct !== true) {
            if (val.IsOffsetProduct == true) {
                document.getElementById("PlanContName").innerHTML = val.ProductName;
                document.getElementById("PlanContQty").innerHTML = val.Quantity;
                const contentID = $.grep(ProductMasterList, function (ex) {
                    return ex.ProductCatalogID === val.ProductCatalogID;
                })[0].ContentID;
                const contentName = $.grep(AllContents, function (ex) {
                    return ex.ContentID === contentID;
                })[0].ContentName;
                document.getElementById("ContentOrientation").innerHTML = contentName;
                Getinputsizess(val.EnquiryIDDetail, "Offset");
            } else {
                Getinputsizess(val.EnquiryIDDetail, "Flex");
            }
        }
    }

    EditMode = true;
    setGridDisplay('block', 'none')
    //document.getElementById("BtnEdit").setAttribute("data-dismiss", "modal");
})
$("#BtnApplyPlan").click(function (e) {
    e.preventDefault();
    var isnotvalid = false;
    var gridProductData = $('#gridProductList').dxDataGrid('instance');
    var gridProductData1 = $('#gridProductList').dxDataGrid('instance').getSelectedRowsData();

    var gridOperation = $('#gridOperation').dxDataGrid('instance')._options.dataSource;
    var Suggestedoperation = $('#gridSelOperation').dxDataGrid('instance')._options.dataSource.store.data;
    var gridProductConfig = $('#gridProductConfig').dxDataGrid('instance')._options.dataSource;


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

    for (var i = 0; i < gridProductConfig.length; i++) {
        if (gridProductConfig[i].ParameterValue == null || gridProductConfig[i].ParameterValue <= 0) {
            isnotvalid = true;
        }
    }

    if (isnotvalid) {
        alert("Please entet parameter value");
        return;
    }
    $("OperIdPQ").text(oprids);

    var file = $('#fileflex')[0].files[0];

    if (file) {
        uploadFile($('#fileflex')[0].files)
            .then(function (response) {
                for (var i = 0; i < gridProductData1.length; i++) {
                    if (SelectedItemImagesStr != "") {
                        response = SelectedItemImagesStr + "," + response
                    }
                    gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].attachedfile = response;
                    gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].DefaultProcessStr = oprids.slice(0, -1);
                    gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
                    gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProductInputSizes = JSON.stringify(gridProductConfig);
                    gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].OtherDetails = $.trim($("#FlexRemark").val());
                    gridProductData.refresh();

                }
            })
            .catch(function (error) {
                alert("File upload error: " + error.message);
            });
    } else {
        for (var i = 0; i < gridProductData1.length; i++) {
            gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].attachedfile = "";
            gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].DefaultProcessStr = oprids.slice(0, -1);
            gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
            gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProductInputSizes = JSON.stringify(gridProductConfig);
            gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].OtherDetails = $.trim($("#FlexRemark").val());
            gridProductData.refresh();

        }
    }

    document.getElementById("BtnApplyPlan").setAttribute("data-dismiss", "modal");
});

$("#BtnSave").click(function () {
    swal({
        title: "Project Enquiry Saving...",
        text: 'Are you sure to save?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            FinalSave()
        });
});

function FinalSave() {

    var SalesPersonID = $('#SelSalesPerson').dxSelectBox('instance').option('value');
    var SalesCordinatorId = $('#SalesCordinator').dxSelectBox('instance').option('value');
    var ClientCordinator = $('#ClientCordinator').dxSelectBox('instance').option('value');
    var SelClientID = $('#SelClient').dxSelectBox('instance').option('value');
    var TxtProjectName = document.getElementById("TxtProjectName").value.trim();
    var TxtRemark = document.getElementById("TxtRemark").value.trim();
    var TxtFreightAmount = document.getElementById("TxtFreightAmount").value.trim();

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
    if (gridProductList._options.dataSource.length <= 0) {
        DevExpress.ui.notify("Please add at least one product ..!", "warning", 1000);
        return;
    }
    var isnotvaliddata = false;
    let ObjMainDetail = {};
    let ObjMain = [];
    let gridProductData = {};
    let objProductConfig = [];
    if (EditMode)
        ObjMainDetail.EnquiryID = Number(document.getElementById("BookingID").value);
    ObjMainDetail.LedgerID = SelClientID;
    ObjMainDetail.SalesPersonID = SalesPersonID;
    ObjMainDetail.SalesCordinatorId = SalesCordinatorId;
    ObjMainDetail.ClientCordinatorID = ClientCordinator;
    ObjMainDetail.SalesManagerID = SalesManagerId;
    ObjMainDetail.ProjectName = TxtProjectName;
    ObjMainDetail.Narration = TxtRemark;
    ObjMainDetail.FreightAmount = TxtFreightAmount;
    ObjMain.push(ObjMainDetail);

    for (var i = 0; i < gridProductList._options.dataSource.length; i++) {
        gridProductData = {};
        if (Number(gridProductList._options.dataSource[i].Rate) >= 0 && Number(gridProductList._options.dataSource[i].Amount) >= 0) {
            gridProductData.Quantity = gridProductList._options.dataSource[i].Quantity;
            gridProductData.ProductName = gridProductList._options.dataSource[i].ProductName1;
            gridProductData.CategoryID = gridProductList._options.dataSource[i].CategoryID;
            gridProductData.ProcessIDStr = gridProductList._options.dataSource[i].ProcessIDStr;
            gridProductData.DefaultProcessStr = gridProductList._options.dataSource[i].DefaultProcessStr;
            gridProductData.ProductCatalogID = gridProductList._options.dataSource[i].ProductCatalogID;
            gridProductData.ProductHSNID = gridProductList._options.dataSource[i].ProductHSNID;
            gridProductData.OtherDetails = gridProductList._options.dataSource[i].OtherDetails;
            gridProductData.attachedfile = gridProductList._options.dataSource[i].attachedfile;
            if (!gridProductList._options.dataSource[i].IsUnitProduct) {
                if (gridProductList._options.dataSource[i].ProductInputSizes !== "" && gridProductList._options.dataSource[i].ProductInputSizes !== undefined)
                    gridProductData.ProductInputSizes = gridProductList._options.dataSource[i].ProductInputSizes;
                else {
                    alert("Please add details of the product , Product Name : " + gridProductList._options.dataSource[i].ProductName1);
                    isnotvaliddata = true;
                    break;
                }
            } else {
                gridProductData.ProductInputSizes = '';
                if (gridProductList._options.dataSource[i].DefaultProcessStr == "") {
                    alert("Please add processes of the product , Product Name : " + gridProductList._options.dataSource[i].ProductName1);
                    isnotvaliddata = true;
                    break;
                }
            }
            gridProductData.GSTPercantage = gridProductList._options.dataSource[i].GSTTaxPercentage;
            objProductConfig.push(gridProductData);
        }
    }


    if (objProductConfig.length <= 0) {
        swal("Please plan the product first..");
        return;
    }
    if (isnotvaliddata) {
        return;
    }
    var BookingNo = document.getElementById("TxtQuoteNo").value;
    var Quo_No = BookingNo.split('.');
    BookingNo = Quo_No[0];

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    $.ajax({
        type: "POST",
        url: "WebServiceProductMaster.asmx/SaveProjectEnquiry",
        data: '{ObjMain:' + JSON.stringify(ObjMain) + ',ObjProductConfig:' + JSON.stringify(objProductConfig) + ',FlagSave:' + JSON.stringify(EditMode) + ',EnqID:' + JSON.stringify(document.getElementById("BookingID").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            var Title, Text, Type;
            if (results.d === "Success") {
                Title = "Success...";
                Text = "Your data Saved...";
                Type = "success";
            } else {
                Title = "Error..!";
                Text = results.d;
                Type = "error";
            }
            swal(Title, Text, Type);
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
function LoadEnquiry() {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
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
                $("#GridShowlist").dxDataGrid({ dataSource: RES1 });
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
$("#BtnShowList").click(function () {
    LoadEnquiry();
});
$("#BtnDelete").click(function () {
    if (Isprocessed == 1) {
        alert("You can't delete this enquiry, Quotation is already created");
        return;
    }
    var BookingID = Number(document.getElementById("BookingID").value);

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
                url: "WebServiceProductMaster.asmx/DeleteEnquiry",
                data: '{TxtBKID:' + BookingID + '}',
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

$("#btnApplyCostPQ").click(function (e) {
    e.preventDefault();
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;
    var InValid = false;
    var JobCloseSize = "";
    $('#planJob_Size input').each(function () {
        if (this.type === "text" && this.style.display === "block" && this.required === true) {
            if (Number(this.value) === 0) {
                this.value = "";
                DevExpress.ui.notify(this.placeholder + " is Empty", "warning", 500);
                InValid = true;
                this.focus();
                return false;
            } else {
                if (JobCloseSize === "") {
                    //JobCloseSize = this.id.substr(4, 1) + ':' + this.value;
                    JobCloseSize = this.name + ':' + this.value;
                    //} else if (PlanContentType.includes("Leaves") && this.id === "JobNoOfPages") {
                    //    JobCloseSize = JobCloseSize + ', Leaves:' + this.value;
                    //} else if (PlanContentType.includes("Book") && this.id === "JobNoOfPages") {
                    //    JobCloseSize = JobCloseSize + ', Pages:' + this.value;
                    //} else if (PlanContentType === "WebbedSelfLockingTray" && this.id === "JobTongHeight") {
                    //    JobCloseSize = JobCloseSize + ',Wall Width:' + this.value;
                } else
                    //JobCloseSize = JobCloseSize + ',' + this.id.substr(4, 1) + ':' + this.value;
                    JobCloseSize = JobCloseSize + ',' + this.name + ':' + this.value;
            }
        }
        if (InValid === true) return;
    });
    if (InValid === true) return;
    $("#ItemPlanQuality").dxValidator('instance').validate();
    var PlanPrintingGrain = $("#PlanPrintingGrain").dxSelectBox("instance").option('value');
    var PlanPrintingStyle = $("#PlanPrintingStyle").dxSelectBox("instance").option('value');
    var ItemPlanQuality = $("#ItemPlanQuality").dxSelectBox("instance").option('value');
    var ItemPlanGsm = $("#ItemPlanGsm").dxSelectBox("instance").option('value');
    var ItemPlanMill = $("#ItemPlanMill").dxSelectBox("instance").option('value');
    var ItemPlanFinish = $("#ItemPlanFinish").dxSelectBox("instance").option('value');
    var PlanPlateType = $("#PlanPlateType").dxSelectBox("instance").option('value');
    var PlanWastageType = $("#PlanWastageType").dxSelectBox("instance").option('value');

    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContName = document.getElementById("PlanContName").innerHTML;

    var SizeHeight = Number(document.getElementById("SizeHeight").value);
    var SizeLength = Number(document.getElementById("SizeLength").value);
    var SizeWidth = Number(document.getElementById("SizeWidth").value);
    var SizeOpenflap = Number(document.getElementById("SizeOpenflap").value);
    var SizePastingflap = Number(document.getElementById("SizePastingflap").value);
    var SizeBottomflap = Number(document.getElementById("SizeBottomflap").value);

    var JobNoOfPages = Number(document.getElementById("JobNoOfPages").value);
    var JobTongHeight = Number(document.getElementById("JobTongHeight").value);
    var JobBottomPerc = Number(document.getElementById("JobBottomPerc").value);
    var JobUps = Number(document.getElementById("JobUps").value);
    var JobPrePlan = document.getElementById("JobPrePlan").value.trim();
    var JobFlapHeight = Number(document.getElementById("JobFlapHeight").value);
    var JobFoldedH = Number(document.getElementById("JobFoldedH").value);
    var JobFoldedL = Number(document.getElementById("JobFoldedL").value);

    var JobFoldInL = Number(document.getElementById("JobFoldInL").value);
    var JobFoldInH = Number(document.getElementById("JobFoldInH").value);

    var PlanColorStrip = Number(document.getElementById("PlanColorStrip").value);
    var PlanGripper = Number(document.getElementById("PlanGripper").value);
    var PlanFColor = Number(document.getElementById("PlanFColor").value);
    var PlanBColor = Number(document.getElementById("PlanBColor").value);
    var PlanSpeFColor = Number(document.getElementById("PlanSpeFColor").value);
    var PlanSpeBColor = Number(document.getElementById("PlanSpeBColor").value);

    var PlanWastageValue = Number(document.getElementById("PlanWastageValue").value);
    var Trimmingleft = Number(document.getElementById("Trimmingleft").value);
    var Trimmingright = Number(document.getElementById("Trimmingright").value);
    var Trimmingtop = Number(document.getElementById("Trimmingtop").value);
    var Trimmingbottom = Number(document.getElementById("Trimmingbottom").value);
    var Stripingleft = Number(document.getElementById("Stripingleft").value);
    var Stripingright = Number(document.getElementById("Stripingright").value);
    var Stripingtop = Number(document.getElementById("Stripingtop").value);
    var Stripingbottom = Number(document.getElementById("Stripingbottom").value);

    var PaperTrimleft = Number(document.getElementById("PaperTrimleft").value);
    var PaperTrimright = Number(document.getElementById("PaperTrimright").value);
    var PaperTrimtop = Number(document.getElementById("PaperTrimtop").value);
    var PaperTrimbottom = Number(document.getElementById("PaperTrimbottom").value);

    $("#OperId").text(OprIds.join());
    var OperId = $("#OperId").text();
    var val = /^[0-9]+$/;
    var decimal = /[-+][0-9]+\.[0-9]+$/;

    if (PlanColorStrip === null || PlanColorStrip === "") {
        PlanColorStrip = 0;
    }
    if (!val.test(PlanColorStrip)) {
        alert("Please Type Only Number");
        DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        document.getElementById("PlanColorStrip").focus();
        return false;
    }
    if (PlanGripper === null || PlanGripper === "") {
        PlanGripper = 0;
    }
    if (PlanFColor === null || PlanFColor === "") {
        PlanFColor = 0;
    }
    if (!val.test(PlanFColor)) {
        alert("Please Type Only Number");
        DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        document.getElementById("PlanFColor").focus();
        return false;
    }
    if (PlanBColor === null || PlanBColor === "") {
        PlanBColor = 0;
    }
    if (!val.test(PlanBColor)) {
        alert("Please Type Only Number");
        DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        document.getElementById("PlanBColor").focus();
        return false;
    }
    // alert(PlanSpeFColor);
    if (PlanSpeFColor === null || PlanSpeFColor === "") {
        PlanSpeFColor = 0;
    }
    if (!val.test(PlanSpeFColor)) {
        alert("Please Type Only Number");
        DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        document.getElementById("PlanSpeFColor").focus();
        return false;
    }
    //alert(PlanSpeFColor);
    if (PlanSpeBColor === null || PlanSpeBColor === "") {
        PlanSpeBColor = 0;
    }
    if (!val.test(PlanSpeBColor)) {
        alert("Please Type Only Number");
        DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        document.getElementById("PlanSpeBColor").focus();
        return false;
    }
    if (PlanWastageValue === null || PlanWastageValue === "") {
        PlanWastageValue = 0;
    }
    if (PlanWastageType === "" || PlanWastageType === null || PlanWastageType === "null" || PlanWastageType === undefined || PlanWastageType === "undefined") {
        PlanWastageType = "Machine Default";
    }
    if (PlanPrintingGrain === "" || PlanPrintingGrain === null || PlanPrintingGrain === "null" || PlanPrintingGrain === undefined || PlanPrintingGrain === "undefined") {
        PlanPrintingGrain = "Both";
    }
    if (PlanPlateType === null || PlanPlateType === "" || PlanPlateType === undefined || PlanPlateType === "undefined") {
        PlanPlateType = "CTP Plate";
    }

    if (PlanWastageType !== "Machine Default") {
        //if (!decimal.test(PlanWastageValue)) {
        //    alert("Please Type Only Number");
        //    DevExpress.ui.notify("Please Type Only Number", "warning", 1500);
        //    document.getElementById("PlanWastageValue").focus();
        //    return false;
        //}
    } else {
        PlanWastageValue = 0;
    }
    if (Trimmingleft === null || Trimmingleft === "") {
        Trimmingleft = 0;
    }
    if (Trimmingright === null || Trimmingright === "") {
        Trimmingright = 0;
    }
    if (Trimmingtop === null || Trimmingtop === "") {
        Trimmingtop = 0;
    }
    if (Trimmingbottom === null || Trimmingbottom === "") {
        Trimmingbottom = 0;
    }
    if (Stripingleft === null || Stripingleft === "") {
        Stripingleft = 0;
    }
    if (Stripingright === null || Stripingright === "") {
        Stripingright = 0;
    }
    if (Stripingtop === null || Stripingtop === "") {
        Stripingtop = 0;
    }
    if (Stripingbottom === null || Stripingbottom === "") {
        Stripingbottom = 0;
    }
    if (JobFlapHeight === null || JobFlapHeight === "" || JobFlapHeight === undefined || JobFlapHeight === "undefined") {
        JobFlapHeight = 0;
    }
    if (JobTongHeight === null || JobTongHeight === "" || JobTongHeight === undefined || JobTongHeight === "undefined") {
        JobTongHeight = 0;
    }
    if (JobFoldInH === "" || JobFoldInH <= 0 || JobFoldInL === "" || JobFoldInL <= 0) {
        JobFoldInL = 1; JobFoldInH = 1;
    }

    if (ItemPlanQuality === "" || ItemPlanQuality === null || ItemPlanQuality === "null") {
        alert("Please Select Item Quality");
        DevExpress.ui.notify("Please select item quality", "warning", 1500);
        $("#ItemPlanQuality").dxValidator('instance').validate();
        return false;
    }
    if (ItemPlanGsm === "" || ItemPlanGsm === null || ItemPlanGsm === "null") {
        alert("Please Select Item GSM");
        DevExpress.ui.notify("Item GSM is not selected..!", "warning", 1500);
        $("#ItemPlanGsm").dxValidator('instance').validate();
        return false;
    }
    if (ItemPlanFinish === "undefined" || ItemPlanFinish === undefined || ItemPlanFinish === "null" || ItemPlanFinish === "" || ItemPlanFinish === null || ItemPlanFinish === "null") {
        DevExpress.ui.notify("Item Finish is not selected..!", "warning", 1500);
        ItemPlanFinish = "";
        //return false;
    }
    if (ItemPlanMill === "" || ItemPlanMill === null || ItemPlanMill === "null" || ItemPlanMill === "undefined" || ItemPlanMill === undefined || ItemPlanMill === "null") {
        ItemPlanMill = "";
        DevExpress.ui.notify("Item Mill is not selected..!", "warning", 1500);
    }
    if (PlanPrintingStyle === "" || PlanPrintingStyle === null || PlanPrintingStyle === "null") {
        alert("Please Select Printing Style");
        DevExpress.ui.notify("Please select printing style or enter colors..", "warning", 1500);
        document.getElementById("PlanFColor").focus();
        return false;
    }
    if (PaperTrimleft === null || PaperTrimleft === "") {
        PaperTrimleft = 0;
    }
    if (PaperTrimtop === null || PaperTrimtop === "") {
        PaperTrimtop = 0;
    }
    if (PaperTrimright === null || PaperTrimright === "") {
        PaperTrimright = 0;
    }
    if (PaperTrimbottom === null || PaperTrimbottom === "") {
        PaperTrimbottom = 0;
    }

    if (JobPrePlan === null || JobPrePlan === "") {
        if (PlanContentType.includes("PrePlanned")) {
            //swal("Empty Size", "Please enter plan size", "warning");
            alert("Please enter plan size", "warning");
            DevExpress.ui.notify("Please enter plan size..", "warning", 1500);
            document.getElementById("JobPrePlan").focus();
            return false;
        } else if (JobPrePlan === null || JobPrePlan === "") {
            JobPrePlan = JobCloseSize;
        }
    }

    if (OperId === null || OperId === "") {
        alert("Process not selected,Please add process");
        return;
        //var opconf = confirm("Process not selected\nAre you sure to continue..?");
        //if (opconf !== true) {
        //    $("#PlanButtonHide").removeClass("fa fa-arrow-circle-down");
        //    $("#PlanButtonHide").addClass("fa fa-arrow-circle-up");
        //    $("#PlanSizeContainer").slideDown(800);
        //    $("#PlanContainer").slideUp(800);
        //    return;
        //}
    }

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var Obj_Job_Size = {};
    var Job_Size_Obj = [];
    Obj_Job_Size.SizeHeight = Number(SizeHeight);
    Obj_Job_Size.SizeLength = Number(SizeLength);
    Obj_Job_Size.SizeWidth = Number(SizeWidth);
    Obj_Job_Size.SizeOpenflap = Number(SizeOpenflap);
    Obj_Job_Size.SizePastingflap = Number(SizePastingflap);
    Obj_Job_Size.SizeBottomflap = Number(SizeBottomflap);
    Obj_Job_Size.JobNoOfPages = Number(JobNoOfPages);
    Obj_Job_Size.JobUps = Number(JobUps);
    Obj_Job_Size.JobFlapHeight = Number(JobFlapHeight);
    Obj_Job_Size.JobTongHeight = Number(JobTongHeight);
    Obj_Job_Size.JobFoldedH = Number(JobFoldedH);
    Obj_Job_Size.JobFoldedL = Number(JobFoldedL);

    Obj_Job_Size.PlanContentType = PlanContentType;
    Obj_Job_Size.PlanFColor = Number(PlanFColor);
    Obj_Job_Size.PlanBColor = Number(PlanBColor);
    Obj_Job_Size.PlanColorStrip = Number(PlanColorStrip);
    Obj_Job_Size.PlanGripper = Number(PlanGripper);
    Obj_Job_Size.PlanPrintingStyle = PlanPrintingStyle;
    Obj_Job_Size.PlanWastageValue = Number(PlanWastageValue);
    Obj_Job_Size.Trimmingleft = Number(Trimmingleft);
    Obj_Job_Size.Trimmingright = Number(Trimmingright);
    Obj_Job_Size.Trimmingtop = Number(Trimmingtop);
    Obj_Job_Size.Trimmingbottom = Number(Trimmingbottom);
    Obj_Job_Size.Stripingleft = Number(Stripingleft);
    Obj_Job_Size.Stripingright = Number(Stripingright);
    Obj_Job_Size.Stripingtop = Number(Stripingtop);
    Obj_Job_Size.Stripingbottom = Number(Stripingbottom);
    Obj_Job_Size.PlanPrintingGrain = PlanPrintingGrain;
    Obj_Job_Size.ItemPlanQuality = ItemPlanQuality;
    Obj_Job_Size.ItemPlanGsm = ItemPlanGsm;
    Obj_Job_Size.ItemPlanMill = ItemPlanMill;
    Obj_Job_Size.PlanPlateType = PlanPlateType;
    Obj_Job_Size.PlanWastageType = PlanWastageType;
    Obj_Job_Size.PlanContQty = Number(PlanContQty);
    Obj_Job_Size.PlanSpeFColor = PlanSpeFColor;
    Obj_Job_Size.PlanSpeBColor = PlanSpeBColor;
    Obj_Job_Size.PlanContName = PlanContName;
    Obj_Job_Size.ItemPlanFinish = ItemPlanFinish;
    Obj_Job_Size.OperId = OperId;
    Obj_Job_Size.JobBottomPerc = Number(JobBottomPerc);
    Obj_Job_Size.JobPrePlan = JobPrePlan;
    Obj_Job_Size.ChkPlanInSpecialSizePaper = $("#ChkPlanInSpecialSizePaper").dxCheckBox('instance').option('value');
    Obj_Job_Size.ChkPlanInStandardSizePaper = $("#ChkPlanInStandardSizePaper").dxCheckBox('instance').option('value');
    Obj_Job_Size.MachineId = $("#MachineId").text(); // document.getElementById("MachineIDFiltered").value;
    Obj_Job_Size.PlanOnlineCoating = $("#PlanOnlineCoating").dxSelectBox("instance").option('value');

    Obj_Job_Size.PaperTrimleft = Number(PaperTrimleft);
    Obj_Job_Size.PaperTrimright = Number(PaperTrimright);
    Obj_Job_Size.PaperTrimtop = Number(PaperTrimtop);
    Obj_Job_Size.PaperTrimbottom = Number(PaperTrimbottom);
    Obj_Job_Size.ChkPaperByClient = $("#ChkPaperByClient").dxCheckBox('instance').option('value');
    Obj_Job_Size.JobFoldInL = JobFoldInL;
    Obj_Job_Size.JobFoldInH = JobFoldInH;
    Obj_Job_Size.ChkPlanInAvailableStock = $("#ChkPlanInAvailableStock").dxCheckBox('instance').option('value');
    var LedgerID = $("#SbClientName").dxSelectBox("instance").option('value');
    if (LedgerID === null || LedgerID === "") LedgerID = 0;

    Job_Size_Obj.push(Obj_Job_Size);
    var ObjJSJson = JSON.stringify(Job_Size_Obj);
    ///--------------------------------------------#################################################################


    saveContentsSizeValues(Obj_Job_Size);

    var ContentSizeValues = "";
    for (var sz in Obj_Job_Size) {
        if (ContentSizeValues === "") {
            ContentSizeValues = sz + "=" + Obj_Job_Size[sz];
        } else {
            ContentSizeValues = ContentSizeValues + "AndOr" + sz + "=" + Obj_Job_Size[sz];
        }
    }


    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var gridOperationsuggestion = $('#GridOperation').dxDataGrid('instance')._options.dataSource;
        var suggestedprocess = "";
        gridOperationsuggestion.store.data.map(value => {
            if (suggestedprocess == "") {
                suggestedprocess = value.ProcessID
            } else {
                suggestedprocess = suggestedprocess + ',' + value.ProcessID
            }

        })

        var gridOperation = $('#GridOperationAllocated').dxDataGrid('instance')._options.dataSource;
        saveContentsOprations(gridOperation);
        var gridProductData = $('#gridProductList').dxDataGrid('instance');
        var gridProductData1 = $('#gridProductList').dxDataGrid('instance').getSelectedRowsData();
        Defaultprocessids = OperId;

        var file = $('#fileOffset')[0].files[0];

        if (file) {
            uploadFile($('#fileOffset')[0].files)
                .then(function (response) {
                    for (var i = 0; i < gridProductData1.length; i++) {
                        if (SelectedItemImagesStr != "") {
                            response = SelectedItemImagesStr + "," + response
                        }
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].RequiredQuantity = gridProductData._options.dataSource[i].Quantity;
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProductInputSizes = ContentSizeValues;
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProcessIDStr = suggestedprocess == "" ? OperId : OperId + ',' + suggestedprocess;
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].DefaultProcessStr = OperId;
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].OtherDetails = $.trim($("#OffsetRemark").val());
                        gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].attachedfile = response;
                        gridProductData.refresh();
                        break;
                    }
                })
                .catch(function (error) {
                    alert("File upload error: " + error.message);
                    return;
                });
        } else {
            for (var i = 0; i < gridProductData1.length; i++) {
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].RequiredQuantity = gridProductData._options.dataSource[i].Quantity;
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProductInputSizes = ContentSizeValues;
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].ProcessIDStr = suggestedprocess == "" ? OperId : OperId + ',' + suggestedprocess;
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].DefaultProcessStr = OperId;
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].OtherDetails = $.trim($("#OffsetRemark").val());
                gridProductData._options.dataSource[gridProductData1[0].SequenceNo - 1].attachedfile = "";
                gridProductData.refresh();
                break;
            }
        }


        closeBottomTabBar();
        $("#SelJobSizeTemplate").dxSelectBox({
            value: -1
        });
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});


$("#BtnApplyPlanUnit").click(function (e) {
    e.preventDefault();
    try {

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

        for (var i = 0; i < gridProductConfig.length; i++) {
            if (gridProductConfig[i].ParameterValue == null || gridProductConfig[i].ParameterValue <= 0) {
                isnotvalid = true;
            }
        }
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var file = $('#fileUnit')[0].files[0];

        if (file) {
            uploadFile($('#fileUnit')[0].files)
                .then(function (response) {
                    for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
                        if (gridProductData._options.dataSource[i].ProductCatalogID === ProductCatalogID && gridProductData._options.dataSource[i].UniqueID === GBLUniqueID  && gridProductData._options.dataSource[i].Quantity === Number(document.getElementById("TxtPlanQtyUnit").value)) {
                            gridProductData._options.dataSource[i].OtherDetails = $.trim($("#UnitRemark").val());
                            if (SelectedItemImagesStr != "") {
                                response = SelectedItemImagesStr + "," + response
                            }
                            gridProductData._options.dataSource[i].attachedfile = response;
                            gridProductData._options.dataSource[i].DefaultProcessStr = oprids.slice(0, -1);
                            gridProductData._options.dataSource[i].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
                            gridProductData.refresh();
                            break;
                        }
                    }
                })
                .catch(function (error) {
                    alert("File upload error: " + error.message);
                });
        } else {
            for (var i = 0; i < gridProductData._options.dataSource.length; i++) {
                if (gridProductData._options.dataSource[i].ProductCatalogID === ProductCatalogID && gridProductData._options.dataSource[i].UniqueID === GBLUniqueID && gridProductData._options.dataSource[i].Quantity === Number(document.getElementById("TxtPlanQtyUnit").value)) {
                    gridProductData._options.dataSource[i].OtherDetails = $.trim($("#UnitRemark").val());
                    gridProductData._options.dataSource[i].attachedfile = "";
                    gridProductData._options.dataSource[i].DefaultProcessStr = oprids.slice(0, -1);
                    gridProductData._options.dataSource[i].ProcessIDStr = suggestoprids + oprids.slice(0, -1);
                    gridProductData.refresh();
                    break;
                }
            }
        }


        closeBottomTabBar();

        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

        document.getElementById("BtnApplyPlanUnit").setAttribute("data-dismiss", "modal");

    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});
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



function uploadFile(files) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        for (var i = 0; i < files.length; i++) {
            fd.append("files[]", files[i]);
        }

        xhr.open("POST", "EnquiryFileUpload.ashx", true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                console.log("Files uploaded successfully. File names: " + response);
                resolve(response);
            } else {
                console.error("Error uploading files. Status: " + xhr.status);
                reject(new Error("File upload failed"));
            }
        };
        xhr.onerror = function () {
            console.error("File upload failed due to network error");
            reject(new Error("File upload failed"));
        };
        xhr.send(fd);
    });
}


function displayFilesInGrid(fileNamesString) {
    var previewArea = document.getElementById("PreviewArea");
    previewArea.innerHTML = ""; // Clear the previous content

    if (fileNamesString === "" || fileNamesString.trim() === "") {
        var h1Element = document.createElement("h1");
        h1Element.textContent = "There are no files attached";
        previewArea.appendChild(h1Element);
        return;
    }

    var fileNames = fileNamesString.split(",");

    // Create a grid with 2 columns and 2 rows
    var grid = document.createElement("div");
    grid.className = "grid";

    for (var i = 0; i < fileNames.length; i++) {
        // Create a grid item
        var gridItem = document.createElement("div");
        //gridItem.className = "grid-item";

        // Create an image element for preview
        var imageElement = document.createElement("img");
        imageElement.className = "grid-item"
        imageElement.src = "Files/Enquiry/" + fileNames[i]; // Update the image path as per your file structure
        imageElement.onerror = function () {
            this.src = "https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png"; // Update with the path to your placeholder image or set a suitable alternative text
        };
        // Create a file name element
        var fileNameElement = document.createElement("p");
        fileNameElement.textContent = fileNames[i];

        // Create a download button
        var downloadButton = document.createElement("a");
        downloadButton.href = "Files/Enquiry/" + fileNames[i];
        downloadButton.download = fileNames[i];
        downloadButton.textContent = "Download";

        // Append the image and file name elements to the grid item
        gridItem.appendChild(imageElement);
        gridItem.appendChild(fileNameElement);
        gridItem.appendChild(downloadButton);

        // Append the grid item to the grid
        grid.appendChild(gridItem);
    }

    // Append the grid to the preview area
    previewArea.appendChild(grid);
}


function displayFilesInModal(fileNamesString, FlexUploadexFiles) {
    var previewArea = document.getElementById(FlexUploadexFiles);
    previewArea.innerHTML = ""; // Clear the previous content

    if (fileNamesString === "" || fileNamesString.trim() === "") {
        var h1Element = document.createElement("h1");
        h1Element.textContent = "There are no files attached";
        previewArea.appendChild(h1Element);
        return;
    }

    var fileNames = fileNamesString.split(",");

    // Create a grid with 2 columns and 2 rows
    var grid = document.createElement("div");
    grid.style.display = "Flex";
    grid.style.flexDirection = "row";

    for (var i = 0; i < fileNames.length; i++) {
        // Create a grid item
        var gridItem = document.createElement("div");
        gridItem.style.width = '200px';
        gridItem.id = fileNames[i];
        // Create an image element for preview
        //var imageElement = document.createElement("img");
        //imageElement.className = ""
        //imageElement.src = "Files/Enquiry/" + fileNames[i]; // Update the image path as per your file structure
        //imageElement.onerror = function () {
        //    this.src = "https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png"; // Update with the path to your placeholder image or set a suitable alternative text
        //};
        // Create a file name element
        var fileNameElement = document.createElement("p");
        fileNameElement.textContent = fileNames[i];

        // Create a download button
        var downloadButton = document.createElement("a");
        downloadButton.href = "Files/Enquiry/" + fileNames[i];
        downloadButton.download = fileNames[i];
        downloadButton.className = "DownloadLink";
        downloadButton.textContent = "Download";

        // Create a remove button
        var removeButton = document.createElement("a");
        removeButton.textContent = "Remove";
        removeButton.className = "RemoveLink";
        removeButton.href = "Files/Enquiry/" + fileNames[i];
        removeButton.setAttribute("data-file-name", fileNames[i]);
        removeButton.addEventListener("click", function (event) {
            var fileName = event.target.getAttribute("data-file-name");
            removeFromServer(fileName, GBLEnquiryDetailID);
            event.preventDefault();
        });

        //  gridItem.appendChild(imageElement);
        gridItem.appendChild(fileNameElement);
        gridItem.appendChild(downloadButton);
        gridItem.appendChild(removeButton);

        // Append the grid item to the grid
        grid.appendChild(gridItem);
    }

    // Append the grid to the preview area
    previewArea.appendChild(grid);
}

function removeFromServer(FileName, EnquiryDetailID) {

    swal({
        title: "Are you sure to delete selected file..?",
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
                url: "WebServiceProductMaster.asmx/DeleteFileFromFolder",
                data: '{fileName:' + JSON.stringify(FileName) + ',EnquiryDetailID:' + Number(EnquiryDetailID) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (results.d.includes("Success")) {
                        var divElement = document.getElementById(FileName);
                        if (divElement) {
                            divElement.parentNode.removeChild(divElement);
                        }
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });
        });

}
