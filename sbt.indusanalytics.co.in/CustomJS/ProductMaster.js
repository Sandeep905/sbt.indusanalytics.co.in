let selectedDataShowList = [];
let FlagEdit = false;

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

$("#SelCatalogType").dxSelectBox({
    items: [],
    placeholder: "Select --",
    searchEnabled: true,
    showClearButton: true
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Product catalog type is required' }]
});

$("#SelCategory").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "CategoryID",
    displayExpr: "CategoryName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {

            $.ajax({
                async: false,
                type: 'POST',
                url: "WebServicePlanWindow.asmx/LoadOperations",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: "{'CategoryID': '" + JSON.stringify(data.value) + "'}",
                crossDomain: true,
                success: function (results) {
                    if (results.d === "500") return;
                    var res = results.d.replace(/\\/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    $("#gridOperation").dxDataGrid({                  //// GridOperation  gridopr
                        dataSource: {
                            store: {
                                type: "array",
                                data: JSON.parse(res.toString()),
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
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Product category is required' }]
});

$("#SelProductHSN").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "ProductHSNID",
    displayExpr: "HSNCode",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {

        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Product HSN Group is required' }]
});

let InputParameterData = [{ ParameterName: "SizeL", FieldDisplayName: "Length (Sq.ft.)" }, { ParameterName: "SizeW", FieldDisplayName: "Width (Sq.ft.)" }, { ParameterName: "SizeH", FieldDisplayName: "Height (Sq.ft.)" }];
//$.ajax({
//    type: "POST",
//    async: false,
//    url: "WebServiceProductMaster.asmx/GetInputParameterData",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: "text",
//    success: function (results) {
//        var res = results.replace(/\\/g, '');
//        res = res.replace(/"d":""/g, '');
//        res = res.replace(/""/g, '');
//        res = res.substr(1);
//        res = res.slice(0, -1);
//        InputParameterData = JSON.parse(res);
//    }
//});

$("#gridProductConfig").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    selection: { mode: "single" },
    columns: [
        { dataField: "SequenceNo", caption: "Sr. No", allowEditing: false },
        {
            dataField: "ParameterName", caption: "Parameter Name",
            //lookup: {
            //    dataSource: InputParameterData,
            //    displayExpr: "FieldDisplayName",
            //    valueExpr: "ParameterName"
            //},
            //setCellValue: function (rowData, value) {
            //    rowData.ParameterName = value;
            //    var result = $.grep(InputParameterData, function (ex) { return ex.ParameterName === value; });
            //    if (result.length === 1) {
            //        rowData.ParameterDisplayName = result[0].FieldDisplayName;
            //        rowData.ParameterDefaultValue = "";
            //    }
            //},
            validationRules: [{ type: "required", message: "Parameter name is required" }]
        },
        { dataField: "ParameterDisplayName", caption: "Display Name", validationRules: [{ type: "required", message: "Parameter display name is required" }] },
        { dataField: "ParameterDefaultValue", caption: "Default Values", validationRules: [{ type: "required", message: "Parameter default value is required" }] },
        { dataField: "ProductFormula", caption: "Formula" },
        { dataField: "IsDisplayParameter", caption: "Display In Enquiry", dataType: "boolean", allowEditing: true }
    ],
    editing: {
        mode: "cell",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        newRowPosition: 'last',
        texts: { confirmDeleteMessage: "" }
    },
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 2.3;
    },
    onToolbarPreparing: function (e) {
        e.toolbarOptions.items.unshift({
            location: "before",
            template() {
                return $('<div>')
                    .append(
                        $('<b>')
                            .addClass("font-13")
                            .text('Product Configurations'),
                    );
            }
        });
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

$("#gridOperation").dxDataGrid({                  //// GridOperation  gridopr
    dataSource: [],
    allowColumnResizing: true,
    columnResizingMode: "widget",
    columnAutoWidth: true,
    sorting: { mode: 'multiple' },
    selection: { mode: "multiple", allowSelectAll: false },
    editing: { mode: "cell", allowUpdating: true },
    columns: [{ dataField: "IsDefaultProcess", caption: "Is Default", dataType: "boolean", allowEditing: true },
    { dataField: "IsDisplayInEnquiry", caption: "Display In Enquiry", dataType: "boolean", allowEditing: true },
    { dataField: "ProcessName", allowEditing: false },
    { dataField: "Rate", width: 50, allowEditing: false },
    { dataField: "TypeofCharges", allowEditing: false },
    { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80, allowEditing: false },
    ],
    paging: {
        pageSize: 10
    },
    showRowLines: true,
    showBorders: true,
    loadPanel: {
        enabled: true
    },
    columnFixing: { enabled: true },
    filterRow: { visible: true },
    height: function () {
        return window.innerHeight / 2.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        if (data) {
            $("#OperId").text(
                $.map(data, function (value) {
                    return value.ProcessID;
                }).join(','));
        }
    },
    onCellClick: function (e) {
        if (e.rowType !== "data") return;

        if (e.columnIndex == 0) {
            e.data.IsDefaultProcess = false;
            e.data.IsDisplayInEnquiry = false;
        }
        if (e.column.dataField === "IsDefaultProcess") {
            var arr = e.component.getSelectedRowsData()
            if (arr.length > 0) {
                if ($.grep(arr, function (er) {
                    return er.ProcessID === e.key;
                }).length === 0) {
                    e.data.IsDefaultProcess = false;
                }
            } else {
                e.data.IsDefaultProcess = false
            }

        }
        if (e.column.dataField === "IsDisplayInEnquiry") {
            var arr = e.component.getSelectedRowsData()
            if (arr.length > 0) {
                if ($.grep(arr, function (er) {
                    return er.ProcessID === e.key;
                }).length === 0) {
                    e.data.IsDisplayInEnquiry = false;
                }
            } else {
                e.data.IsDisplayInEnquiry = false
            }

        }
        e.component.refresh();
    },
});

let VendorData = [];
$.ajax({
    type: 'POST',
    async: false,
    url: "WebService_LedgerMaster.asmx/GetVendorList",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    crossDomain: true,
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        VendorData = JSON.parse(res.toString());
    },
    error: function errorFunc(jqXHR) {
        // alert(jqXHR.message);
    }
});

$("#gridVendorRateSetting").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    selection: { mode: "single" },
    columns: [
        { dataField: "SequenceNo", caption: "Sr. No", allowEditing: false },
        {
            dataField: "VendorID", caption: "Vendor Name",
            lookup: {
                dataSource: VendorData,
                displayExpr: "VendorName",
                valueExpr: "VendorID"
            }, validationRules: [{ type: "required", message: "vendor is required" }]
        },
        { dataField: "VendorRate", caption: "Rate", dataType: "number", validationRules: [{ type: "required", message: "Rate is required" }] }
    ],
    editing: {
        mode: "cell",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        texts: { confirmDeleteMessage: "" }
    },
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 2.3;
    },
    onToolbarPreparing: function (e) {
        e.toolbarOptions.items.unshift({
            location: "before",
            template() {
                return $('<div>')
                    .append(
                        $('<b>')
                            .addClass("font-13")
                            .text('Vendor Rate Setting'),
                    );
            }
        });
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

setGridShowDisplay('block', 'none');
$("#GridShowlist").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    filterRow: { visible: true },
    columns: [
        { dataField: "ProductName", caption: "Product Name", width: 150 },
        { dataField: "ProductDescription", caption: "Description", width: 180 },
        { dataField: "ProductCatalogCode" },
        { dataField: "ReferenceProductCode", caption: "Ref. Product Code" },
        { dataField: "CategoryName", caption: "Category" },
        { dataField: "ProductHSNName", caption: "HSN Name" }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.24;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    },
    onSelectionChanged: function (data) {
        document.getElementById("ProductID").value = 0;
        selectedDataShowList = data.selectedRowsData;
        if (data.selectedRowsData.length > 0) {
            document.getElementById("ProductID").value = data.selectedRowsData[0].ProductCatalogID;
        }
    }
});

$("#btnProductConfig").click(function () {
    setGridDisplay("block", "none");
});

$("#btnVendorRateSetting").click(function () {
    setGridDisplay("none", "block");
});

$.ajax({
    type: "POST",
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
        var RES1 = JSON.parse(res);
        $("#SelCategory").dxSelectBox({ items: RES1 });
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProductMaster.asmx/GetProductCode",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (results) {
        if (results.d.includes("fail") === false) {
            document.getElementById("TxtCataLogCode").value = results.d;
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

$.ajax({
    type: 'POST',
    url: "WebServicePlanWindow.asmx/LoadOperations",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: "{'CategoryID': '-1000'}",
    crossDomain: true,
    success: function (results) {
        if (results.d === "500") return;
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        $("#gridOperation").dxDataGrid({                  //// GridOperation  gridopr
            dataSource: {
                store: {
                    type: "array",
                    data: JSON.parse(res.toString()),
                    key: "ProcessID"
                }
            },
        });
    },
    error: function errorFunc(jqXHR) {
        // alert(jqXHR.message);
    }
});

function setGridDisplay(divProduct, divVendor) {
    document.getElementById("gridProductConfig").style.display = divProduct;
    document.getElementById("gridVendorRateSetting").style.display = divVendor;
}

function setGridShowDisplay(FieldCntainerRow, myModal_1) {
    document.getElementById("FieldCntainerRow").style.display = FieldCntainerRow;
    document.getElementById("myModal_1").style.display = myModal_1;
}

$("#BtnSave").click(function () {
    //var SelCatalogType = $('#SelCatalogType').dxSelectBox('instance').option('value');
    var SelCategoryID = $('#SelCategory').dxSelectBox('instance').option('value');
    var SelProductHSNID = $('#SelProductHSN').dxSelectBox('instance').option('value');
    var TxtProductName = document.getElementById("TxtProductName").value.trim();
    var TxtProductDesc = document.getElementById("TxtProductDesc").value.trim();
    var TxtReferenceProductCode = document.getElementById("TxtRefProductCode").value.trim();
    var TxtRemark = document.getElementById("TxtRemark").value.trim();
    let ProductID = Number(document.getElementById("ProductID").value);

    //$("#SelCatalogType").dxValidator('instance').validate();
    $("#SelProductHSN").dxValidator('instance').validate();
    var gridProductConfig = $('#gridProductConfig').dxDataGrid('instance');

    if (SelCategoryID === "" || SelCategoryID === null) {
        DevExpress.ui.notify("Please select category..!", "error", 2000);
        $("#SelCategory").dxValidator('instance').validate();
        return false;
    }
    if (TxtProductName === "" || TxtProductName === null) {
        DevExpress.ui.notify("Please enter product name..!", "error", 2000);
        document.getElementById("TxtProductName").focus();
        return false;
    }
    if (TxtProductDesc === "" || TxtProductDesc === null) {
        DevExpress.ui.notify("Please enter product description..!", "error", 2000);
        document.getElementById("TxtProductDesc").focus();
        return false;
    }
    if ($('#file')[0].files.length === 0 && FlagEdit === false) {
        DevExpress.ui.notify("Please attach file to start this process ..!", "warning", 2000);
        return false;
    }
    let ObjMainDetail = {};
    let ObjMain = [];
    let objVendor = {};
    let objVendors = [];
    let objVendorsNew = [];
    let objProConfig = {};
    let objProductConfig = [];
    let objProductConfigNew = [];

    if (FlagEdit === true) ObjMainDetail.ProductCatalogID = ProductID;
    ObjMainDetail.CategoryID = SelCategoryID;
    ObjMainDetail.ProductHSNID = SelProductHSNID;
    ObjMainDetail.ProductName = TxtProductName;
    ObjMainDetail.ProductDescription = TxtProductDesc;
    ObjMainDetail.ReferenceProductCode = TxtReferenceProductCode;
    if (FlagEdit === false) ObjMainDetail.ProductImagePath = $('#file')[0].files[0].name;
    ObjMainDetail.Remark = TxtRemark;
    ObjMainDetail.ProcessIDStr = $("#OperId").text();
    ObjMainDetail.DefaultProcessStr = "";
    ObjMainDetail.DisplayProcessStr = "";

    var GridOperation = $('#gridOperation').dxDataGrid('instance')._options.dataSource.store.data;
    for (var i = 0; i < GridOperation.length; i++) {
        if (GridOperation[i].IsDefaultProcess === true) {
            ObjMainDetail.DefaultProcessStr += Number(GridOperation[i].ProcessID) + ",";
        }
        if (GridOperation[i].IsDisplayInEnquiry === true) {
            ObjMainDetail.DisplayProcessStr += Number(GridOperation[i].ProcessID) + ",";
        }
    }

    ObjMain.push(ObjMainDetail);

    var GridRateSetting = $('#gridVendorRateSetting').dxDataGrid('instance');
    for (var i = 0; i < GridRateSetting._options.dataSource.length; i++) {
        objVendor = {};
        if (FlagEdit === true) {
            objVendor.ProductCatalogID = ProductID;
            objVendor.RateSettingID = GridRateSetting._options.dataSource[i].RateSettingID;
        }
        objVendor.SequenceNo = i + 1;
        objVendor.VendorID = GridRateSetting._options.dataSource[i].VendorID;
        objVendor.VendorRate = Number(GridRateSetting._options.dataSource[i].VendorRate);
        if (objVendor.VendorID === "" || objVendor.VendorID <= 0) {
            DevExpress.ui.notify("Please select vendor..!", "warning", 1000);
            return;
        }
        if (objVendor.VendorRate === undefined || objVendor.VendorRate <= 0) {
            DevExpress.ui.notify("Please select vendor rate..!", "warning", 1000);
            return;
        }
        if (objVendor.RateSettingID === undefined && FlagEdit === true) {
            objVendorsNew.push(objVendor);
        } else
            objVendors.push(objVendor);
    }

    let ProductFormula = "";
    for (var i = 0; i < gridProductConfig._options.dataSource.length; i++) {
        objProConfig = {};
        if (FlagEdit === true) {
            objProConfig.ProductCatalogID = ProductID;
            objProConfig.ProductConfigID = gridProductConfig._options.dataSource[i].ProductConfigID;
        }
        objProConfig.SequenceNo = i + 1;
        objProConfig.ParameterName = gridProductConfig._options.dataSource[i].ParameterName;
        objProConfig.ParameterDisplayName = gridProductConfig._options.dataSource[i].ParameterDisplayName;
        objProConfig.ParameterDefaultValue = gridProductConfig._options.dataSource[i].ParameterDefaultValue;
        objProConfig.ProductFormula = gridProductConfig._options.dataSource[i].ProductFormula;
        if (gridProductConfig._options.dataSource[i].IsDisplayParameter == true) {
            objProConfig.IsDisplayParameter = true;
        } else {
            objProConfig.IsDisplayParameter = false;
        }
        
        if (objProConfig.ParameterName === "" || objProConfig.ParameterName === undefined) {
            DevExpress.ui.notify("Please enter parameter name..!", "warning", 1000);
            return;
        }

        if (objProConfig.ProductFormula !== "" && objProConfig.ProductFormula !== null) {
            ProductFormula = objProConfig.ProductFormula;
        }

        if (objProConfig.ProductConfigID === undefined && FlagEdit === true) {
            objProductConfigNew.push(objProConfig);
        } else
            objProductConfig.push(objProConfig);
    }

    if (objProductConfig.length <= 0) {
        DevExpress.ui.notify("Please enter product parameter..!", "warning", 1000);
        return;
    }
    if (ProductFormula === "" || ProductFormula === null) {
        DevExpress.ui.notify("Please enter product formula\n atleast in a single row..!", "warning", 1000);
        return;
    }
    //for (var i = 0; i < objProductConfig.length; i++) {
    //    if (ProductFormula.includes(objProductConfig[i].ParameterName) === false) {
    //        DevExpress.ui.notify("Entered product formula is not matched with the parameters..!", "warning", 1500);
    //        return;
    //    }
    //}
    swal({
        title: "Product Saving...",
        text: 'Are you sure to save?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
        function () {
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
            $.ajax({
                type: "POST",
                url: "WebServiceProductMaster.asmx/SaveProductMasterData",
                data: '{ObjMain:' + JSON.stringify(ObjMain) + ',ObjProductConfig:' + JSON.stringify(objProductConfig) + ',ObjVendorRate:' + JSON.stringify(objVendors) + ',objProductConfigNew:' + JSON.stringify(objProductConfigNew) + ',ObjVendorRateNew:' + JSON.stringify(objVendorsNew) + ',ProductID:' + ProductID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (results.d === "Success") {
                        if (FlagEdit === false) uploadFileProduction("Product");
                        swal(FlagEdit === false ? "Saved!" : "Updated", "Your data saved successfully...", "success");
                        if (FlagEdit === true) location.reload();
                    } else {
                        swal("Not Saved!", results.d, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnDelete").click(function () {
    var ProductID = Number(document.getElementById("ProductID").value);
    if (ProductID === null || ProductID <= 0) {
        swal("Please select any product to delete..!");
        return false;
    }
    swal({
        title: "Are you sure to delete this product..?",
        text: 'You will not be able to recover this product!',
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
                url: "WebServiceProductMaster.asmx/DeleteProductMaster",
                data: '{TxtPOID:' + ProductID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (results.d === "Success") {
                        swal("Deleted!", "Your data deleted successfully...", "success");
                        $("#BtnShowList").click();
                    } else {
                        swal("Not Deleted!", results.d, "error");
                    }
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    console.log(jqXHR);
                }
            });
        });
});

$("#BtnShowList").click(function () {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {
        $.ajax({
            type: "POST",
            url: "WebServiceProductMaster.asmx/GetProductMasterList",
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
});

$("#BtnEdit").click(function () {
    let ProductID = Number(document.getElementById("ProductID").value);
    if (ProductID <= 0) {
        swal("", "Please select record first..", "");
        return;
    }
    FlagEdit = true;
    $("#SelCategory").dxSelectBox({ value: selectedDataShowList[0].CategoryID });
    $("#SelProductHSN").dxSelectBox({ value: selectedDataShowList[0].ProductHSNID });
    document.getElementById("TxtProductName").value = selectedDataShowList[0].ProductName;
    document.getElementById("TxtRefProductCode").value = selectedDataShowList[0].ReferenceProductCode;
    document.getElementById("TxtProductDesc").value = selectedDataShowList[0].ProductDescription;
    document.getElementById("TxtRemark").value = selectedDataShowList[0].Remark;

    let OprIds = [];
    if (selectedDataShowList[0].ProcessIDStr !== "" && selectedDataShowList[0].ProcessIDStr !== null) {
        let op = selectedDataShowList[0].ProcessIDStr.split(",");
        for (var i = 0; i < op.length; i++) {
            OprIds.push(op[i]);
        }
        $("#OperId").text(OprIds.join());
    }

    var GridOperation = $('#gridOperation').dxDataGrid('instance')._options.dataSource.store.data;
    if ((selectedDataShowList[0].DefaultProcessStr !== "" && selectedDataShowList[0].DefaultProcessStr !== null) || (selectedDataShowList[0].DisplayProcessStr !== "" && selectedDataShowList[0].DisplayProcessStr !== null)) {
        //for (var j = 0; j < op.length; i++) {
        for (var i = 0; i < GridOperation.length; i++) {
            if (selectedDataShowList[0].DefaultProcessStr.includes(GridOperation[i].ProcessID) === true) {
                GridOperation[i].IsDefaultProcess = 1;
            } else {
                GridOperation[i].IsDefaultProcess = 0;
            }

            if (selectedDataShowList[0].DisplayProcessStr.includes(GridOperation[i].ProcessID) === true) {
                GridOperation[i].IsDisplayInEnquiry = 1;
            } else {
                GridOperation[i].IsDisplayInEnquiry = 0;
            }
                
        }
        //}
    } else {
        for (var i = 0; i < GridOperation.length; i++) {
            GridOperation[i].IsDefaultProcess = 0;
            GridOperation[i].IsDisplayInEnquiry = 0;
        }
    }

    $("#gridOperation").dxDataGrid({                  //// GridOperation  gridopr
        dataSource: {
            store: {
                type: "array",
                data: GridOperation,
                key: "ProcessID"
            }
        },
        selectedRowKeys: OprIds
    });

    $.ajax({
        type: "POST",
        url: "WebserviceProductMaster.asmx/GetProductConfigData",
        data: '{productId:' + ProductID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);

            $("#gridProductConfig").dxDataGrid({ dataSource: RES1 })
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    $.ajax({
        type: "POST",
        url: "WebserviceProductMaster.asmx/GetVendorRateSetting",
        data: '{productId:' + ProductID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);

            $("#gridVendorRateSetting").dxDataGrid({ dataSource: RES1 })
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });

    //if (selectedDataShowList[0].ProductImagePath !== null) {
    //    $("#PreviewAttachedFile").fadeIn("fast").attr('src', loadFile("/Files/ProductFiles/"+selectedDataShowList[0].ProductImagePath));
    //    $('#file').file = selectedDataShowList[0].ProductImagePath;
    //} else {
    //    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
    //}

    setGridShowDisplay('block', 'none');
});

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}