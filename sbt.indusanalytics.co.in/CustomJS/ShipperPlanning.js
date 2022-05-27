"use strict";
var shipperPlans = [];
var ShipperPlanContents = [];

try {

    $("#BtnShipperCalculation").click(function () {
        var ColumnCunt = 0;
        var gridBoxes = $('#gridShipperBoxes').dxDataGrid('instance');
        var TtlCnt = gridBoxes.columnCount();
        for (var j = 1; j <= TtlCnt; j++) {
            gridBoxes.deleteColumn(j);
        }
        var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0];
        for (var t = 1; t < PTablecrow.cells.length; t++) {
            if (Number(document.getElementById("txtqty" + t).value) > 0 && Number(document.getElementById("FinalUnitCost" + t).innerHTML) > 0) {
                gridBoxes.addColumn("NewColumn" + t);
                ColumnCunt = ColumnCunt + 1;
                gridBoxes.cellValue(0, ColumnCunt, document.getElementById("txtqty" + t).value);
            }
        }
        gridBoxes.saveEditData();
        gridBoxes.refresh();
        if (ColumnCunt <= 0) {
            return false;
        }
        document.getElementById("TxtShipperQuantity").value = GblPlanValues.PlanContQty;
        if (shipperPlans.length <= 0) {
            ReloadShippers();
        } else {
            $("#gridShipperPlans").dxDataGrid({
                dataSource: shipperPlans
            });
        }
        ReloadShippersContentList();
        document.getElementById("BtnShipperCalculation").setAttribute("data-toggle", "modal");
        document.getElementById("BtnShipperCalculation").setAttribute("data-target", "#largeModalShipperPlan");
        // ShipperPlanSize("OLD");        
    });

    $("#gridShipperPlans").dxDataGrid({
        allowColumnReordering: true,
        allowColumnResizing: true,
        showRowLines: true,
        showBorders: true,
        columnResizingMode: "widget",
        selection: { mode: "single" },
        sorting: { mode: 'multiple' },
        scrolling: { mode: 'infinite' },
        editing: {
            mode: "cell",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true
        },
        height: function () {
            return window.innerHeight / 2.5;
        },
        columnAutoWidth: true,
        onContentReady: function (e) {
            if (!e.component.getSelectedRowKeys().length)
                e.component.selectRowsByIndexes(0);
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        columns: [{ dataField: "ShipperID", caption: "Shipper ID", visible: false }, { dataField: "ShipperName", caption: "Shipper Name", allowEditing: false },
        { dataField: "SizeL", caption: "Length", allowEditing: true, validationRules: [{ type: 'required' }] }, { dataField: "SizeW", caption: "Width", allowEditing: true, validationRules: [{ type: 'required' }] },
        { dataField: "SizeH", caption: "Height", allowEditing: true, validationRules: [{ type: 'required' }] }, { dataField: "EmptyCartonWt", caption: "Empty Shp. Wt(KG)", allowEditing: true, validationRules: [{ type: 'required' }] },
        { dataField: "Capacity", caption: "Filled Shp.Wt(KG)", allowEditing: true, validationRules: [{ type: 'required' }] }, { dataField: "QtyPerShipper", caption: "Qty In Shipper", allowEditing: false },
        { dataField: "TotalShipperQtyReq", caption: "Total Shp.Req.", allowEditing: false },
        { dataField: "TotalWtOfAllShippers", caption: "Total Wt.(KG)", allowEditing: true },
        { dataField: "PackX", caption: "X", allowEditing: true, validationRules: [{ type: 'required' }] }, { dataField: "PackY", caption: "Y", allowEditing: true, validationRules: [{ type: 'required' }] },
        { dataField: "PackZ", caption: "Z", allowEditing: true, validationRules: [{ type: 'required' }] }, { dataField: "ShippingRate", caption: "Rate/ CBM (Shipping)", allowEditing: true, validationRules: [{ type: 'required' }] },
        { dataField: "ShippingCost", caption: "Cost (Shipping)", allowEditing: false }, { dataField: "CBM", caption: "CBM", allowEditing: false },
        { dataField: "CBF", caption: "CBF", allowEditing: false }, { dataField: "ShipperWeightPerPack", caption: "Wt/Pc (GM)", allowEditing: false },
        { dataField: "ShipperRate", caption: "Rate/Shipper", allowEditing: true, validationRules: [{ type: 'required' }] },
        { dataField: "ShipperCost", caption: "Cost (Shippers)", allowEditing: false }],
        onInitNewRow: function (e) {
            if (e.component.totalCount() > 0) window.setTimeout(function () { e.component.cancelEditData(); }, 0);
        },
        onRowUpdated: function (e) {
            e.key.ShipperName = e.key.SizeL + "x" + e.key.SizeW + "x" + e.key.SizeH;
            e.key.QtyPerShipper = e.key.PackX * e.key.PackY * e.key.PackZ;
            if (e.key.QtyPerShipper <= 0) e.key.QtyPerShipper = 1;
            e.key.TotalShipperQtyReq = Math.round(Number(document.getElementById("TxtShipperQuantity").value) / e.key.QtyPerShipper);
            e.key.TotalWtOfAllShippers = Math.round(Number(e.key.EmptyCartonWt + e.key.Capacity) * e.key.TotalShipperQtyReq);
            e.key.ShipperCost = Math.ceil(e.key.ShipperRate * e.key.TotalShipperQtyReq);

            e.key.CBM = Number(Number(Number(e.key.SizeL) / 10) * (Number(e.key.SizeW) / 10) * Number(Number(e.key.SizeH) / 10)) / 1000000;
            e.key.CBM = e.key.CBM.toFixed(3);
            e.key.ShippingCost = Math.ceil(e.key.ShippingRate * e.key.CBM); //* e.key.TotalShipperQtyReq
            e.key.CBF = Number(Number(Number(e.key.SizeL) / 25.4) * (Number(e.key.SizeW) / 25.4) * Number(Number(e.key.SizeH) / 25.4)) / 1728;
            e.key.CBF = e.key.CBF.toFixed(3);
            //e.key.ShipperWeightPerPack = Math.ceil(e.key.Capacity / e.key.QtyPerShipper);
            e.component.refresh();
        },
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            try {
                if (data.length > 0) {
                    shipperPlans = data;
                } else {
                    shipperPlans = [];
                    return false;
                }
                var Quantity = Number(document.getElementById("TxtShipperQuantity").value);
                var PerUnitWt = Math.ceil(Number(GblPlanValues.TotalPaperWeightInKg) * 1000 / Quantity);
                var PerBoxWt = 0, NoofShipper = 0, TtlWt = 0;
                var gridBoxes = $('#gridShipperBoxes').dxDataGrid('instance');
                var ColCount = gridBoxes.columnCount();
                for (var cc = 1; cc <= ColCount; cc++) {
                    var Qty = gridBoxes.cellValue(0, cc);
                    if (Qty < shipperPlans[0].QtyPerShipper) {
                        PerBoxWt = Math.ceil(Number(PerUnitWt * Qty) / 1000);
                    } else {
                        PerBoxWt = shipperPlans[0].Capacity;
                    }

                    if (shipperPlans[0].QtyPerShipper > 0) {
                        NoofShipper = Math.ceil(Qty / Number(shipperPlans[0].QtyPerShipper));
                    }
                    TtlWt = PerBoxWt * NoofShipper;
                    gridBoxes.cellValue(0, cc, Qty);
                    gridBoxes.cellValue(1, cc, PerBoxWt);
                    gridBoxes.cellValue(2, cc, TtlWt.toFixed(2));
                    gridBoxes.cellValue(3, cc, NoofShipper);
                    gridBoxes.cellValue(4, cc, NoofShipper * shipperPlans[0].ShipperRate);
                    gridBoxes.cellValue(5, cc, NoofShipper * shipperPlans[0].ShippingCost);
                }
                gridBoxes.saveEditData();
                gridBoxes.refresh();

                $.ajax({
                    type: 'POST',
                    url: 'WebServicePlanWindow.asmx/LoadShippersID',
                    dataType: 'text',
                    contentType: "application/json; charset=utf-8",
                    data: '{ShipperName:' + JSON.stringify(shipperPlans[0].ShipperName) + '}',
                    crossDomain: true,
                    success: function (results) {
                        var RES1 = JSON.parse(results);
                        GblShipperID = RES1.d;
                    },
                    error: function errorFunc(jqXHR) {
                        // alert("not show");
                    }
                });

                var ObjArr = {};
                var ObjJSJson = [];
                ObjArr.JobH = shipperPlans[0].SizeH;
                ObjArr.JobL = shipperPlans[0].SizeL;
                ObjArr.JobW = shipperPlans[0].SizeW;
                ObjArr.TotalWtOfAllShippers = shipperPlans[0].TotalWtOfAllShippers; ///KG
                ObjArr.TtlShipperReq = shipperPlans[0].TotalShipperQtyReq;
                ObjArr.CBM = shipperPlans[0].CBM;
                ObjArr.CBF = shipperPlans[0].CBF;
                ObjJSJson.push(ObjArr);
                $.ajax({
                    type: 'post',
                    url: 'Api_shiring_service.asmx/ContainerPlanning',
                    data: '{ObjJSJson:' + JSON.stringify(ObjJSJson) + '}',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    crossDomain: true,
                    success: function (results) {
                        var res = results.d.replace(/\\/g, '');
                        res = res.replace(/u0026/g, ' & ');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var RES1 = JSON.parse(res);

                        $("#gridContainerPlans").dxDataGrid({
                            dataSource: RES1
                        });
                    },
                    error: function errorFunc(jqXHR) {
                        // alert("not show");
                    }
                });

            } catch (e) {
                shipperPlans = [];
            }
        }
    });

    $("#gridContainerPlans").dxDataGrid({
        allowColumnReordering: true,
        allowColumnResizing: true,
        showRowLines: true,
        showBorders: true,
        columnResizingMode: "widget",
        selection: { mode: "single" },
        sorting: { mode: 'multiple' },
        scrolling: { mode: 'infinite' },
        editing: {
            allowDeleting: true
        },
        height: function () {
            return window.innerHeight / 5;
        },
        columnAutoWidth: true,
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css('background', '#42909A');
                e.rowElement.css('color', 'white');
                e.rowElement.css('font-weight', 'bold');
            }
            e.rowElement.css('fontSize', '11px');
        },
        columns: [{ dataField: "ContainerName", caption: "Container Name" },
        { dataField: "LengthMM", caption: "Length(MM)" }, { dataField: "WidthMM", caption: "Width(MM)" },
        { dataField: "HeightMM", caption: "Height(MM)" }, { dataField: "LengthFT", caption: "Length(Ft)" },
        { dataField: "WidthFT", caption: "Width(Ft)" }, { dataField: "HeightFT", caption: "Height(Ft)" },
        { dataField: "CountL", caption: "Box In(L)" }, { dataField: "CountW", caption: "Box In(W)" },
        { dataField: "CountH", caption: "Box In(H)" }, { dataField: "TotalCarton", caption: "Total Boxes" }, { dataField: "TotalContainers", caption: "Ttl Containers" },
        { dataField: "CBM", caption: "CBM" }, { dataField: "CBF", caption: "CBF" },
        { dataField: "Direction", caption: "Direction" }, { dataField: "TotalWt", caption: "Total Wt." }, { dataField: "MaxWeight", caption: "Max Weight" }],
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            try {
                if (data.length > 0) {
                    shipperPlans.ContainerID = data[0].ContainerID;
                    shipperPlans.BoxInLength = data[0].CountL;
                    shipperPlans.BoxInWidth = data[0].CountW;
                    shipperPlans.BoxInHeight = data[0].CountH;

                    shipperPlans.TotalCarton = data[0].TotalCarton;
                    shipperPlans.TotalContainers = data[0].TotalContainers;
                    shipperPlans.TotalCBM = data[0].CBM;
                    shipperPlans.TotalCBF = data[0].CBF;
                    shipperPlans.TotalContainerWt = data[0].TotalWt;
                    shipperPlans.BoxDirection = data[0].Direction;
                } else {
                    shipperPlans.ContainerID = undefined;
                }
            } catch (e) {
                alert(e);
            }
        }
    });

    $("#gridShipperBoxes").dxDataGrid({
        dataSource: [{ "Name": "Quantity" }, { "Name": "Per Box Wt" }, { "Name": "Total Wt" }, { "Name": "No of Boxes" }, { "Name": "Shipper Cost" }, { "Name": "Shipping Cost" }],
        showRowLines: true,
        columnAutoWidth: true,
        allowColumnResizing: true,
        showBorders: true,
        columnFixing: { enabled: true },
        sorting: false,
        columns: [{ dataField: "Name", fixedPosition: "left", fixed: true }], //, { dataField: "Value" }
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css("display", 'none');
            }
            e.rowElement.css('fontSize', '11px');
        }
    });

    $("#BtnPlanNewShipper").click(function () {
        //$("#gridShipperPlans").dxDataGrid({ dataSource: [] });
        ShipperPlanSize("NEW");
    });

    $("#BtnPlanShipper").click(function () {
        if (Number(document.getElementById("TxtQtyInABundle").value) <= 0) {
            document.getElementById("TxtQtyInABundle").value = 1;
            DevExpress.ui.notify("Bundle quantity is not valid..!", "warning", 1500);
        }
        //if (Number(document.getElementById("TxtMinWtInBox").value) <= 0) {
        //    document.getElementById("TxtMinWtInBox").value = 1;
        //    DevExpress.ui.notify("Minimum limit of weight should be pack in a Shipper is not valid..!", "warning", 1500);
        //}
        //if (Number(document.getElementById("TxtMaxWtInBox").value) <= 0) {
        //    document.getElementById("TxtMaxWtInBox").value = 12;
        //    DevExpress.ui.notify("Max limit of weight should be pack in a Shipper is not valid..!", "warning", 1500);
        //}

        $("#gridShipperPlans").dxDataGrid({ dataSource: [] });
        ShipperPlanSize("OLD");
    });

    $("#BtnApplyShipper").click(function () {
        if (shipperPlans.length <= 0) {
            DevExpress.ui.notify("Please select plan first..!", "warning", 1500);
            return;
        }
        if (shipperPlans.ContainerID === undefined) {
            DevExpress.ui.notify("Container is not selected ,please make sure it is not export job..!", "warning", 2500);
            shipperPlans.ContainerID = 0;
        }
        var NoOfPly = Number(document.getElementById("TxtShipperNoOfPly").value);
        if (NoOfPly <= 0) {
            DevExpress.ui.notify("Please enter the shipper No Of Ply..!", "warning", 1500);
            document.getElementById("TxtShipperNoOfPly").focus();
            return;
        }

        GblObjShippers = [];
        var gridBoxes = $('#gridShipperBoxes').dxDataGrid('instance');
        var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0];
        for (var t = 1; t < PTablecrow.cells.length; t++) {
            var txtQty = Number(document.getElementById("txtqty" + t).value);
            if (txtQty > 0 && Number(document.getElementById("FinalUnitCost" + t).innerHTML) > 0) {
                for (var i = 0; i < gridBoxes.columnCount(); i++) {
                    var TransID = 1;
                    if (Number(gridBoxes.cellValue(0, i)) === txtQty) {
                        document.getElementById("FinalShipperCost" + t).value = Number(gridBoxes.cellValue(4, i)) + Number(gridBoxes.cellValue(5, i));
                        var ObjQties = {};
                        ObjQties.JobQuantity = txtQty;
                        ObjQties.MachineID = GblPlanValues.MachineID;
                        ObjQties.ItemID = GblShipperID;
                        ObjQties.TransID = TransID;
                        ObjQties.SizeL = shipperPlans[0].SizeL;
                        ObjQties.SizeW = shipperPlans[0].SizeW;
                        ObjQties.SizeH = shipperPlans[0].SizeH;
                        ObjQties.ItemGroupID = shipperPlans[0].ItemGroupID;
                        ObjQties.EmptyCartonWt = shipperPlans[0].EmptyCartonWt;
                        ObjQties.Capacity = shipperPlans[0].Capacity;
                        ObjQties.EstimatedQuantity = shipperPlans[0].TotalShipperQtyReq;
                        ObjQties.QtyPerShipper = shipperPlans[0].QtyPerShipper;
                        ObjQties.EstimatedRate = shipperPlans[0].ShipperRate;
                        ObjQties.EstimatedCost = shipperPlans[0].ShipperCost;
                        ObjQties.CBM = shipperPlans[0].CBM;
                        ObjQties.CBF = shipperPlans[0].CBF;
                        ObjQties.PackX = shipperPlans[0].PackX;
                        ObjQties.PackY = shipperPlans[0].PackY;
                        ObjQties.PackZ = shipperPlans[0].PackZ;
                        ObjQties.TotalWtOfAllShippers = shipperPlans[0].TotalWtOfAllShippers;
                        ObjQties.ShipperWeightPerPack = shipperPlans[0].ShipperWeightPerPack;

                        ObjQties.PerBoxWt = gridBoxes.cellValue(1, i);
                        ObjQties.TotalWt = gridBoxes.cellValue(2, i);
                        ObjQties.ShippingRate = gridBoxes.cellValue(4, i);
                        ObjQties.ShippingCost = gridBoxes.cellValue(5, i);
                        ObjQties.NoOfPly = NoOfPly;

                        ///Added on 29/07/2019
                        ObjQties.ContainerID = shipperPlans.ContainerID;
                        ObjQties.BoxInLength = shipperPlans.BoxInLength;
                        ObjQties.BoxInWidth = shipperPlans.BoxInWidth;
                        ObjQties.BoxInHeight = shipperPlans.BoxInHeight;
                        ObjQties.TotalCarton = shipperPlans.TotalCarton;
                        ObjQties.TotalContainers = shipperPlans.TotalContainers;
                        ObjQties.TotalCBM = shipperPlans.TotalCBM;
                        ObjQties.TotalCBF = shipperPlans.TotalCBF;
                        ObjQties.TotalContainerWt = shipperPlans.TotalContainerWt;
                        ObjQties.BoxDirection = shipperPlans.BoxDirection;
                        ObjQties.ProductLength = Number(document.getElementById("TxtProductLength").value);
                        ObjQties.ProductWidth = Number(document.getElementById("TxtProductWidth").value);
                        ObjQties.ProductHeight = Number(document.getElementById("TxtProductHeight").value);
                        ObjQties.ProductWt = Number(document.getElementById("TxtProductWt").value);

                        GblObjShippers.push(ObjQties);
                        TransID = TransID + 1;
                        sumAllCost(t);
                    }
                }
            }
        }
        document.getElementById("BtnApplyShipper").setAttribute("data-dismiss", "modal");
    });

    $("#BtnSaveShipper").click(function () {
        if (shipperPlans.length <= 0) {
            DevExpress.ui.notify("Please select plan first..!", "warning", 1500);
            return;
        }
        var NoOfPly = Number(document.getElementById("TxtShipperNoOfPly").value);
        if (NoOfPly <= 0) {
            DevExpress.ui.notify("Please enter the shipper No Of Ply..!", "warning", 1500);
            document.getElementById("TxtShipperNoOfPly").focus();
            return;
        }

        var ObjMsave = {};
        var ObjMDsave = {};
        var ArrMsave = [];
        var ArrMDsave = [];

        ///Master data object
        ObjMsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMsave.ItemType = shipperPlans[0].ItemGroupName;
        ObjMsave.ItemName = shipperPlans[0].ShipperName; // + ',CBM:' + shipperPlans[0].CBM + ',CBF:' + shipperPlans[0].CBF + 'x' + shipperPlans[0].SizeH;
        ObjMsave.ItemDescription = ObjMsave.ItemName;
        ArrMsave.push(ObjMsave);

        ///Master details object save 
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "SizeH";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].SizeH;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "SizeL";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].SizeL;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "SizeW";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].SizeW;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "EmptyCartonWt";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].EmptyCartonWt;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "EstimationRate";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].ShippingRate;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "Capacity";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].Capacity;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "CBM";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].CBM;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "CBF";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = shipperPlans[0].CBF;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);
        ObjMDsave = {};
        ObjMDsave.ItemGroupID = shipperPlans[0].ItemGroupID;
        ObjMDsave.FieldName = "NoOfPly";
        ObjMDsave.ParentFieldName = ObjMDsave.FieldName;
        ObjMDsave.FieldValue = NoOfPly;
        ObjMDsave.ParentFieldValue = ObjMDsave.FieldValue;
        ArrMDsave.push(ObjMDsave);

        var txt = 'Are you sure to save the selected shipper in master';
        swal({
            title: "Saving Shipper in Master",
            text: txt,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Save",
            closeOnConfirm: false
        },
            function () {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
                $.ajax({
                    type: "POST",
                    url: "WebService_Master.asmx/SaveData",
                    data: '{CostingDataItemMaster:' + JSON.stringify(ArrMsave) + ',CostingDataItemDetailMaster:' + JSON.stringify(ArrMDsave) + ',MasterName:' + JSON.stringify(shipperPlans[0].ItemGroupName) + ',ItemGroupID:' + JSON.stringify(shipperPlans[0].ItemGroupID) + ',ActiveItem:' + JSON.stringify(true) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var res = JSON.stringify(results);
                        res = res.replace(/"d":/g, '');
                        res = res.replace(/{/g, '');
                        res = res.replace(/}/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        if (res === "Success") {
                            swal("Saved", "Shipper details saved successfully", "success");
                        }
                        else if (res === "Duplicate data found") {
                            swal("Duplicate!", "Shipper already available in master..!", "");
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        swal("Error!", "Please try after some time..", "");
                        // alert(jqXHR);
                    }
                });
            });
    });

    $("#GridPackingContentsList").dxDataGrid({
        dataSource: [],
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        showRowLines: true,
        filterRow: { visible: true },
        showBorders: true,
        loadPanel: {
            enabled: true
        },
        sorting: { mode: 'none' },
        scrolling: {
            mode: 'infinite'
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
        height: function () {
            return window.innerHeight / 3.2;
        },
        selection: { mode: "single" },
        columnAutoWidth: true,
        columns: [{ dataField: "PlanContName", caption: "Content Name", width: 100 }, { dataField: "SizeLength", caption: "Length" },
        { dataField: "SizeWidth", caption: "Width" }, { dataField: "SizeHeight", caption: "Height" }, { dataField: "JobNoOfPages", caption: "Pages" },
        { dataField: "ItemPlanQuality", caption: "Quality", maxWidth: 100 }, { dataField: "ItemPlanGsm", caption: "GSM" },
        { dataField: "ProductWt", caption: "Cont. Wt", format: { type: "fixedPoint", precision: 2 } }],
        summary: {
            totalItems: [{
                column: "SizeLength",
                summaryType: "max",
                displayFormat: "Max: {0}"
            }, {
                column: "SizeHeight",
                summaryType: "max",
                displayFormat: "{0}"
            }, {
                column: "SizeWidth",
                summaryType: "max",
                displayFormat: "{0}"
            }, {
                column: "ProductWt",
                summaryType: "sum",
                displayFormat: "Sum:{0}"
            }]
        },
        onContentReady: function (e) {
            if (!e.component.getSelectedRowKeys().length)
                e.component.selectRowsByIndexes(0);
            document.getElementById("TxtProductWt").value = Number(e.component.getTotalSummaryValue("ProductWt")).toFixed(2);
        },
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData;
            try {
                ShipperPlanContents = [];
                document.getElementById("TxtProductLength").value = "";
                document.getElementById("TxtProductWidth").value = "";
                document.getElementById("TxtProductHeight").value = "";
                if (data.length > 0) {
                    ShipperPlanContents = data;
                    document.getElementById("TxtShipperQuantity").value = data[0].PlanContQty;
                    document.getElementById("TxtProductLength").value = data[0].SizeLength;
                    document.getElementById("TxtProductWidth").value = data[0].SizeWidth;
                    document.getElementById("TxtProductHeight").value = data[0].SizeHeight;
                }
            } catch (e) {
                console.log(e);
            }
        }
    });
} catch (e) {
    console.log(e);
}

function ShipperPlanSize(ShipperPlanType) {
    try {
        var ObjArr = {};
        var ObjJSJson = [];
        ObjArr.JobH = ShipperPlanContents[0].SizeHeight;
        ObjArr.JobL = ShipperPlanContents[0].SizeLength;
        ObjArr.JobW = ShipperPlanContents[0].SizeWidth;
        ObjArr.JobOF = ShipperPlanContents[0].SizeOpenflap;
        ObjArr.JobBF = ShipperPlanContents[0].SizeBottomflap;
        ObjArr.Pages = ShipperPlanContents[0].JobNoOfPages;
        ObjArr.JobTH = ShipperPlanContents[0].JobTongHeight;
        ObjArr.JobOvF = ShipperPlanContents[0].SizeHeight;
        ObjArr.GSM = ShipperPlanContents[0].ItemPlanGsm;
        ObjArr.OrderQty = ShipperPlanContents[0].PlanContQty;
        ObjArr.ContType = ShipperPlanContents[0].PlanContentType;
        ObjArr.PaperKG = GblPlanValues.TotalPaperWeightInKg;
        ObjArr.QtyInABundle = Number(document.getElementById("TxtQtyInABundle").value);
        ObjArr.ExpectedQtyInBox = Number(document.getElementById("TxtExpectedQtyInBox").value);
        ObjArr.Tollerance = 0; // Number(document.getElementById("TxtShipperTolerance").value);
        ObjArr.TotalQuantity = Number(document.getElementById("TxtShipperQuantity").value);

        ObjArr.MaxJobL = 0; //  Number(document.getElementById("TxtMaxLengthofBox").value);
        ObjArr.MaxJobW = 0; //  Number(document.getElementById("TxtMaxWidthofBox").value);
        ObjArr.MaxJobH = 0; // Number(document.getElementById("TxtMaxHeightofBox").value);
        ObjArr.MinWtInBox = 0; //  Number(document.getElementById("TxtMinWtInBox").value);
        ObjArr.MaxWtInBox = 0; //  Number(document.getElementById("TxtMaxWtInBox").value);
        ObjArr.ShipperPlanType = ShipperPlanType;

        ObjArr.MinJobL = 0; //  Number(document.getElementById("TxtMinLengthofBox").value);
        ObjArr.MinJobW = 0; //  Number(document.getElementById("TxtMinWidthofBox").value);
        ObjArr.MinJobH = 0; // Number(document.getElementById("TxtMinHeightofBox").value);

        ObjArr.ProductL = Number(document.getElementById("TxtProductLength").value);
        ObjArr.ProductW = Number(document.getElementById("TxtProductWidth").value);
        ObjArr.ProductH = Number(document.getElementById("TxtProductHeight").value);
        ObjArr.ProductWt = Number(document.getElementById("TxtProductWt").value);

        if (ObjArr.ProductL <= 0) {
            DevExpress.ui.notify("Please enter product length..!", "warning", 1800);
            document.getElementById("TxtProductLength").focus();
            return;
        }
        if (ObjArr.ProductW <= 0) {
            DevExpress.ui.notify("Please enter product width..!", "warning", 1800);
            document.getElementById("TxtProductWidth").focus();
            return;
        }
        if (ObjArr.ProductH <= 0) {
            DevExpress.ui.notify("Please enter product height..!", "warning", 1800);
            document.getElementById("TxtProductHeight").focus();
            return;
        }

        ObjJSJson.push(ObjArr);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $("#gridShipperPlans").dxDataGrid({
            dataSource: []
        });
        $.ajax({
            type: 'post',
            url: 'Api_shiring_service.asmx/ShipperPlanning',
            data: '{ObjJSJson:' + JSON.stringify(ObjJSJson) + '}',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/u0026/g, ' & ');
                res = res.substr(1);
                res = res.slice(0, -1);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                if (res === "[]") {
                    DevExpress.ui.notify("No shipper available in this requirement..!", "warning", 1800);
                }
                if (results.d.includes("not work")) {
                    DevExpress.ui.notify(results.d, "warning", 1800);
                    document.getElementById("BtnShipperCalculation").setAttribute("data-dismiss", "modal");
                    return;
                }
                var RES1 = JSON.parse(res);
                if (RES1.length < 1) {
                    DevExpress.ui.notify("No shipper available in this requirement..!", "warning", 1800);
                } else {
                    try {
                        $("#gridShipperPlans").dxDataGrid({
                            dataSource: RES1
                        });
                    } catch (e) {
                        console.log(e);
                        DevExpress.ui.notify(e.message, "error", 500);
                    }
                }
            },
            error: function errorFunc(jqXHR) {
                //alert(jqXHR);
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        });
    } catch (e) {
        alert(e);
    }
}

function ReloadShippers() {
    var TxtQty = Number(document.getElementById("TxtShipperQuantity").value);
    $.ajax({
        type: 'post',
        url: 'WebServicePlanWindow.asmx/LoadShippersList',
        data: '{BKID:' + BookingID + ',PlanQty:' + TxtQty + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            shipperPlans = RES1;
            if (RES1.length > 0) {
                document.getElementById("TxtShipperNoOfPly").value = RES1[0].NoOfPly;
                document.getElementById("TxtProductLength").value = RES1[0].ProductLength;
                document.getElementById("TxtProductWidth").value = RES1[0].ProductWidth;
                document.getElementById("TxtProductHeight").value = RES1[0].ProductHeight;
                document.getElementById("TxtProductWt").value = RES1[0].ProductWt;
            }
            $("#gridShipperPlans").dxDataGrid({ dataSource: shipperPlans });
        }
    });

    $.ajax({
        type: 'post',
        url: 'WebServicePlanWindow.asmx/LoadContainersList',
        data: '{BKID:' + BookingID + '}',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#gridContainerPlans").dxDataGrid({ dataSource: RES1 });
        }
    });
}

function ReloadShippersContentList() {
    var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
    var TblContents = [];
    var InputValues = {};

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            InputValues = {};
            var result = $.grep(TblContents, function (e) { return e.PlanContName === cursor.value.PlanContName; });
            if (result.length === 0) {
                var JobValues = cursor.value.ContentSizeValues.split('AndOr');
                for (var key in JobValues) {
                    var spKey = JobValues[key].split('=');
                    //if (spKey[0].includes("Size")) spKey[1] = (Number(spKey[1]) / 10).toFixed(1);
                    if (spKey[0].includes("Pages") && Number(spKey[1]) <= 0) spKey[1] = 2;
                    InputValues[spKey[0]] = spKey[1];
                }
                InputValues.ActualSheets = cursor.value.ActualSheets;

                var SheetThichness = Number(InputValues.ItemPlanGsm) * 0.000631312;
                InputValues.Spine = InputValues.JobNoOfPages * SheetThichness;
                if (Number(InputValues.SizeWidth) === 0) {
                    InputValues.SizeWidth = Number(InputValues.Spine).toFixed(2);
                    document.getElementById("TxtProductWidth").value = InputValues.SizeWidth;
                }
                InputValues.ProductWt = CalculateShipperWtPerBook(InputValues);
                TblContents.push(InputValues);
            }
            cursor.continue();
        } else {
            $("#GridPackingContentsList").dxDataGrid({
                dataSource: TblContents
            });
        }
    };
}

function CalculateShipperWtPerBook(Obj) {
    //if (Obj.length > 0) {
    var L = Obj.SizeLength;
    var W = Obj.SizeWidth;
    var H = Number(Obj.SizeHeight);
    var Pages = Number(Obj.JobNoOfPages);
    if (Pages <= 0 || isNaN(Pages) || Pages === undefined) Pages = 2;
    if (!Obj.PlanContentType.includes("Leaves") && Pages > 0) Pages = Pages / 2;
    
    if (Number(H) === 0) H = W;
    var ProductWt = 0;
    //ProductWt = (Number(L / 10) * Number(H / 10) * Obj[0].ItemPlanGsm / 20000 / 500 * Number(Obj[0].ActualSheets)) + (Number(L / 10) * Number(W / 10) * Obj[0].ItemPlanGsm / 20000 / 500 * 2);
    ProductWt = (Number(L) * Number(H) * Number(Obj.ItemPlanGsm) * Pages) / 1000000;
    return ProductWt.toFixed(2);
    //}
}