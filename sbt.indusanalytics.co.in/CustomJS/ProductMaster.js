
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

        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Product category is required' }]
});

$("#SelProductHSN").dxSelectBox({
    items: [],
    placeholder: "Select --",
    valueExpr: "ProductHSNID",
    displayExpr: "ProductHSNName",
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (data) {
        if (data.value !== null) {

        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Product HSN Group is required' }]
});

$("#gridProductConfig").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    selection: { mode: "single" },
    columns: [
        { dataField: "SequenceNo", caption: "Sr. No", allowEditing: false },
        { dataField: "ParameterName", caption: "Parameter Name" },
        { dataField: "ParameterDisplayName", caption: "Display Name" },
        { dataField: "ParameterDefaultValue" },
        { dataField: "ParameterFormula", caption: "Formula" }
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

let VendorData = [];
$.ajax({
    type: 'POST',
    async: false,
    url: "WebService_InvoiceEntry.asmx/GetShippedFromLedger",
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: "{ value: " + JSON.stringify('Vendor') + " }",
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
            dataField: "VendorID",
            lookup: {
                dataSource: VendorData,
                displayExpr: "VendorName",
                valueExpr: "VendorID"
            }
        },
        { dataField: "Rate", caption: "Rate" }
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

$("#GridShowlist").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'multiple' },
    selection: { mode: "single" },
    columns: [
        { dataField: "ProductName", caption: "Product Name" },
        { dataField: "ProductDescription", caption: "Description" },
        { dataField: "ProductCatalogCode" },
        { dataField: "ReferenceProductCode", caption: "Ref. Product Code" },
        { dataField: "CategoryName", caption: "Category" },
        { dataField: "ProductHSNName", caption: "HSN Name" }
    ],
    showRowLines: true,
    showBorders: true,
    height: function () {
        return window.innerHeight / 1.3;
    },
    onSelectionChanged: function (data) {
        if (data) {

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

function setGridDisplay(divProduct, divVendor) {
    document.getElementById("gridProductConfig").style.display = divProduct;
    document.getElementById("gridVendorRateSetting").style.display = divVendor;
}

$("#BtnSave").click(function () {
    var SelCatalogType = $('#SelCatalogType').dxSelectBox('instance').option('value');
    var SelCategoryID = $('#SelCategory').dxSelectBox('instance').option('value');
    var SelProductHSNID = $('#SelProductHSN').dxSelectBox('instance').option('value');
    var TxtProductName = document.getElementById("TxtProductName").value.trim();
    var TxtProductDesc = document.getElementById("TxtProductDesc").value.trim();
    var TxtReferenceProductCode = document.getElementById("TxtRefProductCode").value.trim();
    var TxtRemark = document.getElementById("TxtRemark").value.trim();

    $("#SelCatalogType").dxValidator('instance').validate();
    $("#SelCategory").dxValidator('instance').validate();
    $("#SelProductHSN").dxValidator('instance').validate();
    var gridProductConfig = $('#gridProductConfig').dxDataGrid('instance');

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
    if ($('#file')[0].files.length === 0) {
        DevExpress.ui.notify("Please attach file to start this process ..!", "warning", 2000);
        return false;
    }
    if (objProConfig._options.dataSource.length <= 0) {
        DevExpress.ui.notify("Please enter product parameter..!", "warning", 1000);
        return;
    }
    let ObjMainDetail = {};
    let ObjMain = [];
    let objVendor = {};
    let objVendors = [];
    let objProConfig = {};
    let objProductConfig = [];

    ObjMainDetail.ProductCatalogType = SelCatalogType;
    ObjMainDetail.CategoryID = SelCategoryID;
    ObjMainDetail.ProductHSNID = SelProductHSNID;
    ObjMainDetail.ProductName = TxtProductName;
    ObjMainDetail.ProductDescription = TxtProductDesc;
    ObjMainDetail.ReferenceProductCode = TxtReferenceProductCode;
    ObjMainDetail.ProductImagePath = $('#file')[0].files[0].name;
    ObjMainDetail.Remark = TxtRemark;
    ObjMain.push(ObjMainDetail);

    var GridRateSetting = $('#gridVendorRateSetting').dxDataGrid('instance');
    for (var i = 0; i < GridRateSetting._options.dataSource.length; i++) {
        objVendor = {};
        objVendor.SequenceNo = i + 1;
        objVendor.VendorID = GridRateSetting._options.dataSource[i].VendorID;
        objVendor.VendorRate = Number(GridRateSetting._options.dataSource[i].VendorRate);
        if (objVendor.VendorID === "" || objVendor.VendorID <= 0) {
            DevExpress.ui.notify("Please select vendor..!", "warning", 1000);
            return;
        }
        objVendors.push(objVendor);
    }

    for (var i = 0; i < gridProductConfig._options.dataSource.length; i++) {
        objProConfig = {};
        objProConfig.SequenceNo = i + 1;
        objProConfig.ParameterName = gridProductConfig._options.dataSource[i].ParameterName;
        objProConfig.ParameterDisplayName = gridProductConfig._options.dataSource[i].ParameterDisplayName;
        objProConfig.ParameterDefaultValue = gridProductConfig._options.dataSource[i].ParameterDefaultValue;
        objProConfig.ProductFormula = gridProductConfig._options.dataSource[i].ProductFormula;
        if (objProConfig.ParameterName === "" || objProConfig.ParameterName === undefined) {
            DevExpress.ui.notify("Please enter parameter name..!", "warning", 1000);
            return;
        }
        objProductConfig.push(objProConfig);
    }

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
                data: '{ObjMain:' + JSON.stringify(ObjMain) + ',ObjProductConfig:' + JSON.stringify(objProductConfig) + ',ObjVendorRate:' + JSON.stringify(ObjVendorRate) + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    uploadFileProduction("Product");
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
                    if (Type === "success") window.location.reload();
                },
                error: function errorFunc(jqXHR) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });
});

$("#DeleteButton").click(function () {
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
