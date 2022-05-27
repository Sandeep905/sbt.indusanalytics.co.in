"use strict";
var FlagEdit = false;
var GblOutsourceRecID = 0, GblVendorID = 0;

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

////init date and select box
$("#DtVoucherDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
    max: new Date().toISOString().substr(0, 10)
});

$("#DtDeliveryNoteDate").dxDateBox({
    pickerType: "rollers",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10)
});

$("#DtBillDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    value: new Date()
});

var optionData = ["Pending List", "Processed List"];
$("#RadioButtonPO").dxRadioGroup({
    items: optionData,
    value: optionData[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        GblOutsourceRecID = 0;
        if (e.value === "Pending List") {
            FlagEdit = false;
            document.getElementById("BtnCreateEdit").innerHTML = "Create";
            $("#BtnPrint").addClass("hidden");
            $("#BtnPrintChallan").addClass("hidden");
            $("#BtnDelete").addClass("hidden");
            GenerateVoucherNo();
        } else {
            FlagEdit = true;
            $("#BtnPrint").removeClass("hidden");
            $("#BtnPrintChallan").removeClass("hidden");
            $("#BtnDelete").removeClass("hidden");
            document.getElementById("BtnCreateEdit").innerHTML = "Edit";
        }
        GetPendingProcessedData();
    }
});

////init Grids
$("#gridPendingProcess").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "single" },
    sorting: { mode: 'multiple' },
    filterRow: { visible: true, applyFilter: "auto" },
    columns: [{ dataField: "JobName", caption: "Job Name", width: 150 }, { dataField: "LedgerName", caption: "Vendor Name", width: 120 }, { dataField: "SendVoucherNo", caption: "Send Voucher No" }, { dataField: "VoucherDate", caption: "Date", width: 100 },
    { dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", width: 150 },
    { dataField: "Remark", caption: "Outsource Remark", width: 100 },
    { dataField: "QuantitySent", caption: "Send Qty" }, { dataField: "QuantityReceive", caption: "Received Qty" }, { dataField: "PendingToReceive", caption: "Pending Qty" }, { dataField: "UserName", caption: "Created By" }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.3;
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onSelectionChanged: function (selectedItem) {
        var data = selectedItem.selectedRowsData;
        newClick();
        if (data.length > 0) {
            if (FlagEdit === true) {
                document.getElementById("LblPONo").value = data[0].VoucherNo;
                document.getElementById("TxtDeliveryNoteNo").value = data[0].DeliveryNoteNo;
                document.getElementById("TxtReceivedBy").value = data[0].ReceivedBy;

                $("#DtDeliveryNoteDate").dxDateBox({ value: data[0].DeliveryNoteDate });
                $("#DtVoucherDate").dxDateBox({ value: data[0].VoucherDate });
                $("#DtBillDate").dxDateBox({ value: data[0].EWayBillDate });
            }
            document.getElementById("TxtJobCardNo").value = data[0].JobBookingNo;
            document.getElementById("TxtVendorName").value = data[0].LedgerName;
            document.getElementById("TxtTransporter").value = data[0].Transporter;
            document.getElementById("TxtVehicleNo").value = data[0].VehicleNo;
            document.getElementById("TxtRemarks").value = data[0].Remark;

            document.getElementById("TxtBillNo").value = data[0].EWayBillNumber;

            GblOutsourceRecID = data[0].OutsourceID;
            GblVendorID = data[0].LedgerID;
        }
    }
});

$("#gridMaterialsDetail").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    columns: [ /*{ dataField: "JobCardFormNo", caption: "JC Form No" },{ dataField: "ProcessName", caption: "Process Name", width: 150 },*/
        { dataField: "ItemCode" }, { dataField: "ItemName", caption: "Item Name" }, { dataField: "HSNCode", caption: "HSN Code" },
        { dataField: "IssueQuantity", caption: "Send Qty" }, { dataField: "ReceivedQuantity", caption: "Return Qty", allowEditing: true, validationRules: [{ type: "required" }, { type: "numeric" }] },
        { dataField: "ConsumeQuantity", caption: "Consumed Qty" }, { dataField: "StockUnit" }, { dataField: "Remark" }, { dataField: "ItemDescription", caption: "WIP - Item Description", allowEditing: false }, { dataField: "ProcessingQty", caption: "WIP Return Qty", allowEditing: true }, { dataField: "WIPUnit", caption: "WIP Unit", allowEditing: false }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 3.1;
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    onEditingStart: function (e) {
        if (e.column.dataField === "ReceivedQuantity" || e.column.dataField === "ReceiptRemark") {
            e.cancel = false;
        } else e.cancel = true;
    },
    onRowUpdating: function (e) {
        if (Number(e.newData.ReceivedQuantity) > Number(e.oldData.IssueQuantity)) {
            e.newData.ReceivedQuantity = Number(e.oldData.IssueQuantity);
        }
        e.newData.ConsumeQuantity = Number(e.oldData.IssueQuantity) - Number(e.newData.ReceivedQuantity);
    }
});

$("#gridProcessDetail").dxDataGrid({
    dataSource: [],
    showBorders: true,
    paging: { enabled: false },
    columnAutoWidth: true,
    showRowLines: true,
    allowSorting: false,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    height: function () {
        return window.innerHeight / 3;
    },
    editing: {
        mode: 'cell',
        allowUpdating: true
    },
    sorting: {
        mode: "none"
    },
    loadPanel: {
        enabled: true,
        text: 'Data is loading...'
    },
    onRowPrepared: function (e) {
        if (e.rowType === "header") {
            e.rowElement.css('background', '#42909A');
            e.rowElement.css('color', 'white');
            e.rowElement.css('font-weight', 'bold');
        }
        e.rowElement.css('fontSize', '11px');
    },
    columns: [
        { dataField: "ProcessName", caption: "Process Name", allowEditing: false },
        { dataField: "RateFactor", caption: "Rate Factor", allowEditing: false },
        { dataField: "JobCardFormNo", caption: "Ref Form No", allowEditing: false },
        { dataField: "QuantitySent", caption: "Send Qty", allowEditing: false },
        { dataField: "RemainingQuantity", caption: "Remaining Qty", allowEditing: false },
        { dataField: "QuantityReceive", caption: "Production Qty", allowEditing: true, validationRules: [{ type: "required" }, { type: "numeric" }] },
        { dataField: "WastageQuantity", caption: "Wastage Qty", allowEditing: true }, { dataField: "SuspenseQuantity", caption: "Suspense Qty", allowEditing: false }, { dataField: "ConvertValue", caption: "No of Steps", allowEditing: true }, { dataField: "ReadyQuantity", caption: "Ready Qty", allowEditing: true },
        { dataField: "Remark", caption: "Outsource Remark", allowEditing: true }
    ],
    onRowUpdating: function (e) {
        if (Number(e.newData.QuantityReceive) <= 0) e.newData.QuantityReceive = e.oldData.QuantityReceive;
        if (Number(e.oldData.QuantitySent) < Number(e.newData.QuantityReceive)) {
            e.newData.QuantityReceive = e.oldData.QuantityReceive;
        }
        if (Number(e.newData.QuantityReceive) > 0) {
            //e.newData.SuspenseQuantity = Number(e.oldData.QuantitySent) - Number(e.newData.QuantityReceive) - e.newData.WastageQuantity;
            e.newData.ReadyQuantity = Number(e.oldData.ConvertValue) * Number(e.newData.QuantityReceive);
        }
        if (Number(e.newData.ConvertValue) > 0) {
            e.newData.ReadyQuantity = Number(e.newData.ConvertValue) * Number(e.oldData.QuantityReceive);
        }
    },
    onRowUpdated: function (e) {
        if (Number(e.data.QuantityReceive) > 0) {
            e.data.SuspenseQuantity = Number(e.data.RemainingQuantity) - Number(e.data.QuantityReceive) - e.data.WastageQuantity;
        }
        if (e.data.SuspenseQuantity < 0) {
            e.data.QuantityReceive = 0;
            e.data.WastageQuantity = 0;
            e.data.SuspenseQuantity = 0;
        }
    }
});

///Btn clicked
$("#BtnCreateEdit").click(function () {
    if (GblOutsourceRecID <= 0) return false;

    GetContentWiseDetails(GblOutsourceRecID);

    document.getElementById("BtnCreateEdit").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreateEdit").setAttribute("data-target", "#largeModalDetails");
});

$("#BtnSave").click(function () {
    try {
        if (FlagEdit === true) return false;
        var gridMaterials = $('#gridMaterialsDetail').dxDataGrid('instance');
        var dataGridProcess = $('#gridProcessDetail').dxDataGrid('instance');
        var Remark = document.getElementById("TxtRemarks").value.trim();
        var TxtVehicleNo = document.getElementById("TxtVehicleNo").value.trim();
        var TxtTransporter = document.getElementById("TxtTransporter").value.trim();
        var VoucherDate = $("#DtVoucherDate").dxDateBox('instance').option('value');
        var DeliveryDate = $("#DtDeliveryNoteDate").dxDateBox('instance').option('value');
        var ReceivedBy = document.getElementById("TxtReceivedBy").value.trim();

        var BillNo = document.getElementById("TxtBillNo").value.trim();
        var BillDate = $("#DtBillDate").dxDateBox('instance').option('value');

        if (dataGridProcess._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please add process first..", "warning", 1500);
            return false;
        }
        if (gridMaterials._options.dataSource.length <= 0) {
            DevExpress.ui.notify("Please add material first..", "warning", 1500);
            ///return;
        }

        var result = $.grep(dataGridProcess._options.dataSource, function (e) {
            return Number(e.QuantityReceive) <= 0 || e.QuantityReceive === null || e.QuantityReceive === "";
        });
        if (result.length > 0) {
            dataGridProcess.cellValue(result.length - 1, "QuantityReceive", "");
            DevExpress.ui.notify("Please enter production quantity in '" + result[0].ProcessName + "' ..", "warning", 1500);
            return false;
        }
        var ObjData = {};
        var ArrObjData = [];
        if (FlagEdit === true) {
            ObjData.OutsourceID = GblOutsourceRecID;
        } else
            ObjData.ParentOutsourceID = GblOutsourceRecID;

        ObjData.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[0].JobBookingJobCardContentsID;
        ObjData.JobBookingID = dataGridProcess._options.dataSource[0].JobBookingID;
        ObjData.WorkOrderType = "Outsource Receive";
        ObjData.LedgerID = GblVendorID;
        ObjData.Remark = Remark;
        ObjData.VehicleNo = TxtVehicleNo;
        ObjData.Transporter = TxtTransporter;
        ObjData.DeliveryNoteNo = document.getElementById("TxtDeliveryNoteNo").value.trim();
        ObjData.DeliveryNoteDate = DeliveryDate;
        ObjData.ReceivedBy = ReceivedBy;
        ObjData.EWayBillNumber = BillNo;
        ObjData.EWayBillDate = BillDate;

        ArrObjData.push(ObjData);

        /////Material Consumed data
        var ObjDataConsumedMain = {};
        var ArrObjConsumedMain = [];

        var ObjConsumedDetails = {};
        var ArrObjConsumedDetails = [];

        ObjDataConsumedMain.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[0].JobBookingJobCardContentsID;
        ObjDataConsumedMain.JobBookingID = dataGridProcess._options.dataSource[0].JobBookingID;
        ObjDataConsumedMain.VoucherDate = VoucherDate;

        ArrObjConsumedMain.push(ObjDataConsumedMain);
        var TransID = 0;
        for (var i = 0; i < gridMaterials._options.dataSource.length; i++) {
            ObjConsumedDetails = {};
            if (Number(gridMaterials._options.dataSource[i].ConsumeQuantity) > 0) {
                ObjConsumedDetails.ItemID = gridMaterials._options.dataSource[i].ItemID;
                ObjConsumedDetails.JobBookingID = dataGridProcess._options.dataSource[0].JobBookingID;
                ObjConsumedDetails.JobBookingJobCardContentsID = gridMaterials._options.dataSource[i].JobBookingJobCardContentsID;
                ObjConsumedDetails.ItemGroupID = gridMaterials._options.dataSource[i].ItemGroupID;
                ObjConsumedDetails.ProcessID = gridMaterials._options.dataSource[i].ProcessID;
                ObjConsumedDetails.MachineID = gridMaterials._options.dataSource[i].MachineID;
                //ObjConsumedDetails.ReceivedQuantity = Number(gridMaterials._options.dataSource[i].ReceivedQuantity);
                ObjConsumedDetails.ConsumeQuantity = Number(gridMaterials._options.dataSource[i].ConsumeQuantity);
                ObjConsumedDetails.StockUnit = gridMaterials._options.dataSource[i].StockUnit;
                ObjConsumedDetails.TransID = TransID + 1;

                ObjConsumedDetails.IssueTransactionID = gridMaterials._options.dataSource[i].IssueTransactionID;
                ObjConsumedDetails.ParentTransactionID = gridMaterials._options.dataSource[i].ParentTransactionID;
                ObjConsumedDetails.DepartmentID = gridMaterials._options.dataSource[i].DepartmentID;
                ObjConsumedDetails.BatchNo = gridMaterials._options.dataSource[i].BatchNo;
                ObjConsumedDetails.FloorWarehouseID = gridMaterials._options.dataSource[i].FloorWarehouseID;

                ObjConsumedDetails.Remark = gridMaterials._options.dataSource[i].ItemDescription; //WIP - Item Description               
                ObjConsumedDetails.ProcessingQty = gridMaterials._options.dataSource[i].ProcessingQty;
                ObjConsumedDetails.WIPUnit = gridMaterials._options.dataSource[i].WIPUnit;

                TransID = TransID + 1;
                ArrObjConsumedDetails.push(ObjConsumedDetails);
            }
        }

        /////Material Return data
        var ObjReturnDetails = {};
        var ArrObjReturnDetails = [];
        TransID = 0;

        for (i = 0; i < gridMaterials._options.dataSource.length; i++) {
            ObjReturnDetails = {};
            if (Number(gridMaterials._options.dataSource[i].ReceivedQuantity) > 0) {
                ObjReturnDetails.ItemID = gridMaterials._options.dataSource[i].ItemID;
                ObjReturnDetails.JobBookingID = dataGridProcess._options.dataSource[0].JobBookingID;
                ObjReturnDetails.JobBookingJobCardContentsID = gridMaterials._options.dataSource[i].JobBookingJobCardContentsID;
                ObjReturnDetails.ItemGroupID = gridMaterials._options.dataSource[i].ItemGroupID;
                ObjReturnDetails.ProcessID = gridMaterials._options.dataSource[i].ProcessID;
                ObjReturnDetails.MachineID = gridMaterials._options.dataSource[i].MachineID;
                ObjReturnDetails.ReceivedQuantity = Number(gridMaterials._options.dataSource[i].ReceivedQuantity);
                //ObjReturnDetails.ConsumeQuantity = Number(gridMaterials._options.dataSource[i].IssueQuantity) - Number(ObjReturnDetails.ReceivedQuantity);
                ObjReturnDetails.StockUnit = gridMaterials._options.dataSource[i].StockUnit;
                ObjReturnDetails.TransID = TransID + 1;

                ObjReturnDetails.IssueTransactionID = gridMaterials._options.dataSource[i].IssueTransactionID;
                ObjReturnDetails.ParentTransactionID = gridMaterials._options.dataSource[i].ParentTransactionID;
                ObjReturnDetails.DepartmentID = gridMaterials._options.dataSource[i].DepartmentID;
                ObjReturnDetails.BatchNo = gridMaterials._options.dataSource[i].BatchNo;
                ObjReturnDetails.FloorWarehouseID = gridMaterials._options.dataSource[i].FloorWarehouseID;

                TransID = TransID + 1;
                ArrObjReturnDetails.push(ObjReturnDetails);
            }
        }

        ///Process 
        var ObjDataProcess = {};
        var ArrObjDataProcess = [];

        //////Production Entry
        var objMachineEntry = [];
        var OptMachineEntry = {};
        var objMachineUpdtEntry = [];
        var OptMachineUpdtEntry = {};

        //////Production Forms
        var objFormsEntry = [];
        var OptFormsEntry = {};

        for (var j = 0; j < dataGridProcess._options.dataSource.length; j++) {
            ObjDataProcess = {};

            ObjDataProcess.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[j].JobBookingJobCardContentsID;
            ObjDataProcess.JobBookingID = dataGridProcess._options.dataSource[j].JobBookingID;
            ObjDataProcess.JobCardContentNo = dataGridProcess._options.dataSource[j].JobCardContentNo;
            ObjDataProcess.PlanContName = dataGridProcess._options.dataSource[j].PlanContName;
            ObjDataProcess.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            ObjDataProcess.RateFactor = dataGridProcess._options.dataSource[j].RateFactor;
            ObjDataProcess.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            ObjDataProcess.ReadyQuantity = dataGridProcess._options.dataSource[j].ReadyQuantity;
            ObjDataProcess.QuantitySent = dataGridProcess._options.dataSource[j].QuantitySent;
            ObjDataProcess.QuantityReceive = dataGridProcess._options.dataSource[j].QuantityReceive;
            //ObjDataProcess.SuspenseQuantity = dataGridProcess._options.dataSource[j].SuspenseQuantity;
            ObjDataProcess.VendorID = GblVendorID;
            ObjDataProcess.SequenceNo = j + 1;

            ArrObjDataProcess.push(ObjDataProcess);

            //////Production Entry
            OptMachineEntry = {};

            OptMachineEntry.ProductionID = dataGridProcess._options.dataSource[j].ProductionID;
            OptMachineEntry.ConversionValue = dataGridProcess._options.dataSource[j].ConvertValue;
            OptMachineEntry.MachineID = dataGridProcess._options.dataSource[j].MachineID;
            OptMachineEntry.EmployeeID = dataGridProcess._options.dataSource[j].OperatorID;
            OptMachineEntry.EntryType = 'Outsource';
            OptMachineEntry.Status = "Outsource Receive";
            OptMachineEntry.JobBookingID = dataGridProcess._options.dataSource[j].JobBookingID;
            OptMachineEntry.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            OptMachineEntry.RateFactor = dataGridProcess._options.dataSource[j].RateFactor;
            OptMachineEntry.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            OptMachineEntry.ReceivedQuantity = dataGridProcess._options.dataSource[j].QuantitySent;
            OptMachineEntry.ProductionQuantity = dataGridProcess._options.dataSource[j].QuantityReceive;
            OptMachineEntry.ConsumedQuantity = OptMachineEntry.ProductionQuantity;
            OptMachineEntry.ReadyQuantity = dataGridProcess._options.dataSource[j].ReadyQuantity;
            OptMachineEntry.WastageQuantity = dataGridProcess._options.dataSource[j].WastageQuantity;
            OptMachineEntry.SuspenseQuantity = dataGridProcess._options.dataSource[j].SuspenseQuantity;
            OptMachineEntry.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[j].JobBookingJobCardContentsID;
            OptMachineEntry.Remark = dataGridProcess._options.dataSource[j].Remark;

            objMachineEntry.push(OptMachineEntry);

            /////////////Update entry
            OptMachineUpdtEntry = {};

            OptMachineUpdtEntry.MachineID = dataGridProcess._options.dataSource[j].MachineID;
            OptMachineUpdtEntry.EmployeeID = dataGridProcess._options.dataSource[j].OperatorID;
            OptMachineUpdtEntry.EntryType = "Outsource";
            OptMachineUpdtEntry.Status = "Outsource Receive";
            OptMachineUpdtEntry.JobBookingID = dataGridProcess._options.dataSource[j].JobBookingID;
            OptMachineUpdtEntry.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            OptMachineUpdtEntry.RateFactor = dataGridProcess._options.dataSource[j].RateFactor;
            OptMachineUpdtEntry.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            OptMachineUpdtEntry.ReceivedQuantity = dataGridProcess._options.dataSource[j].QuantitySent;
            OptMachineUpdtEntry.ProductionQuantity = dataGridProcess._options.dataSource[j].QuantityReceive;
            OptMachineUpdtEntry.ConversionValue = dataGridProcess._options.dataSource[j].ConvertValue;
            OptMachineUpdtEntry.ConsumedQty = OptMachineUpdtEntry.ProductionQuantity;
            OptMachineUpdtEntry.ReadyQuantity = dataGridProcess._options.dataSource[j].ReadyQuantity;
            OptMachineUpdtEntry.WastageQuantity = dataGridProcess._options.dataSource[j].WastageQuantity;
            OptMachineUpdtEntry.SuspenseQuantity = dataGridProcess._options.dataSource[j].SuspenseQuantity;
            OptMachineUpdtEntry.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[j].JobBookingJobCardContentsID;
            OptMachineUpdtEntry.Remark = dataGridProcess._options.dataSource[j].Remark;

            objMachineUpdtEntry.push(OptMachineUpdtEntry);

            //////forms table entry
            OptFormsEntry = {};

            OptFormsEntry.ProductionID = dataGridProcess._options.dataSource[j].ProductionID;
            OptFormsEntry.JobCardFormNo = dataGridProcess._options.dataSource[j].JobCardFormNo;
            OptFormsEntry.JobBookingID = dataGridProcess._options.dataSource[j].JobBookingID;
            OptFormsEntry.ProcessID = dataGridProcess._options.dataSource[j].ProcessID;
            OptFormsEntry.MachineID = dataGridProcess._options.dataSource[j].MachineID;
            OptFormsEntry.EmployeeID = dataGridProcess._options.dataSource[j].OperatorID;
            OptFormsEntry.Status = "Outsource Receive";
            OptFormsEntry.ProductionQuantity = dataGridProcess._options.dataSource[j].QuantityReceive;
            OptFormsEntry.ConsumedQuantity = OptFormsEntry.ProductionQuantity;
            OptFormsEntry.ReadyQuantity = dataGridProcess._options.dataSource[j].ReadyQuantity;
            OptFormsEntry.WastageQuantity = dataGridProcess._options.dataSource[j].WastageQuantity;
            OptFormsEntry.SuspenseQuantity = dataGridProcess._options.dataSource[j].SuspenseQuantity;
            OptFormsEntry.JobBookingJobCardContentsID = dataGridProcess._options.dataSource[j].JobBookingJobCardContentsID;

            objFormsEntry.push(OptFormsEntry);
            ///////////////
        }

        var txt = "Are you sure to save this content's outsource receipt details..? \n" + "if not click on \n" + "Cancel";
        swal({
            title: "Do you want to save entry..?",
            text: txt,
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
                    url: "WebServiceProductionOutsource.asmx/SaveProductionOutsourceReceipt",
                    data: '{ObjData:' + JSON.stringify(ArrObjData) + ',ObjConsumedMain:' + JSON.stringify(ArrObjConsumedMain) + ',ObjConsumedDetails:' + JSON.stringify(ArrObjConsumedDetails) + ',ObjReturnDetails:' + JSON.stringify(ArrObjReturnDetails) + ',ObjProcess:' + JSON.stringify(ArrObjDataProcess) + ',objMachineEntry:' + JSON.stringify(objMachineEntry) + ',objMachineUpdtEntry:' + JSON.stringify(objMachineUpdtEntry) + ',objFormsEntry:' + JSON.stringify(objFormsEntry) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        var Title, Text, Type;
                        if (results.d.includes("Success")) {
                            Title = "Saved...";
                            Text = "Your data Saved...";
                            Type = "success";
                        } else if (results.d.includes("Can't")) {
                            Title = results.d.split(",")[1];
                            Text = results.d.split(",")[0];
                            Type = "warning";
                        } else if (results.d.includes("Error:")) {
                            Title = "Error..!";
                            Text = results.d;
                            Type = "error";
                        }
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
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
    } catch (e) {
        console.log(e);
    }
});

$("#BtnPrint").click(function () {
    if (FlagEdit === false || GblOutsourceRecID <= 0) return;

    var url = "ReportOutsourceReceived.aspx?UID=" + GblOutsourceRecID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

$("#BtnPrintChallan").click(function () {
    if (FlagEdit === false || GblOutsourceRecID <= 0) return;

    var url = "ReportOutsourceChallan.aspx?PrintType=INWARD&UID=" + GblOutsourceRecID;
    window.open(url, "blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
});

$("#BtnDelete").click(function () {
    if (GblOutsourceRecID <= 0) return;
    swal({
        title: "Deleting...",
        text: "Are you sure to delete this record..?",
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
                url: "WebServiceProductionOutsource.asmx/DeleteProductionOutsourceReceipt",
                data: '{OutID:' + GblOutsourceRecID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    var Title, Text, Type;
                    if (results.d.includes("Success")) {
                        Title = "Deleted...";
                        Text = "Your data deleted successfully..";
                        Type = "success";
                    } else if (results.d.includes("Can't")) {
                        Title = results.d.split(",")[1];
                        Text = results.d.split(",")[0];
                        Type = "warning";
                    } else if (results.d.includes("Error:")) {
                        Title = "Error..!";
                        Text = results.d;
                        Type = "error";
                    }
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    swal(Title, Text, Type);
                    if (Type === "success") window.location.reload();
                },
                error: function errorFunc(jqXHR) {
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });
});

///////Voucher No
function GenerateVoucherNo() {
    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetOutsourceVoucherNo",
        data: '{prefix:' + JSON.stringify("OR") + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = JSON.stringify(results);
            res = res.replace(/"d":/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            if (res !== "fail") {
                document.getElementById("LblPONo").value = res;
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
GenerateVoucherNo();

GetPendingProcessedData();
////Functions
function GetPendingProcessedData() {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        if (FlagEdit === "") return;
        $.ajax({
            type: "POST",
            url: "WebServiceProductionOutsource.asmx/GetPendingProcessedReceivedData",
            data: '{flag:' + JSON.stringify(FlagEdit) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/u0026/g, "&");
                res = res.replace(/:,/g, ":null,");
                res = res.replace(/,}/g, ",null}");
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                var FlagVisible = true;
                if (FlagEdit === true) {
                    FlagVisible = false;
                }
                var Columns = [{ dataField: "JobName", caption: "Job Name", width: 150 }, { dataField: "LedgerName", caption: "Vendor Name", width: 120 }, { dataField: "SendVoucherNo", caption: "Send Voucher No" }, { dataField: "SendVoucherDate", caption: "Send Date" }, { dataField: "VoucherNo", caption: "Receipt Voucher No", visible: FlagEdit }, { dataField: "VoucherDate", caption: "Receipt Date", visible: FlagEdit },
                { dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", minWidth: 100, width: 150 },
                { dataField: "Remark", caption: "Outsource Remark", minWidth: 90, width: 120 },
                { dataField: "QuantitySent", caption: "Send Qty" }, { dataField: "QuantityReceive", caption: "Received Qty" }, { dataField: "PendingToReceive", caption: "Pending Qty", visible: FlagVisible }, { dataField: "EWayBillNumber", caption: "E-Way Bill No", visible: FlagEdit }, { dataField: "EWayBillDate", caption: "E-Way Bill Date", visible: FlagEdit }, { dataField: "UserName", caption: "Created By" }];

                $("#gridPendingProcess").dxDataGrid({
                    dataSource: RES1,
                    columns: Columns
                });
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function GetContentWiseDetails(OutID) {
    $("#gridProcessDetail").dxDataGrid({ dataSource: [] });
    $("#gridMaterialsDetail").dxDataGrid({ dataSource: [] });
    if (OutID === null || OutID <= 0 || OutID === undefined) return;
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetOutsourceContentWiseDetails",
        data: '{OutID:' + OutID + ',Flag:' + JSON.stringify(FlagEdit) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/,}/g, ',null}');
            res = res.replace(/:}/g, ':null}');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/u0026/g, "&");
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            if (!res.includes("TblProcess")) return;
            $("#gridProcessDetail").dxDataGrid({ dataSource: RES1.TblProcess });
            $("#gridMaterialsDetail").dxDataGrid({ dataSource: RES1.TblMaterial });
        }
    });
}

function newClick() {
    document.getElementById("TxtDeliveryNoteNo").value = "";
    document.getElementById("TxtJobCardNo").value = "";
    document.getElementById("TxtVendorName").value = "";
    document.getElementById("TxtTransporter").value = "";
    document.getElementById("TxtVehicleNo").value = "";
    document.getElementById("TxtRemarks").value = "";
    document.getElementById("TxtReceivedBy").value = "";
    GblOutsourceRecID = 0; GblVendorID = 0;
    $("#DtDeliveryNoteDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });
    $("#DtVoucherDate").dxDateBox({ value: new Date().toISOString().substr(0, 10) });

    document.getElementById("TxtBillNo").value = "";
    $("#DtBillDate").dxDateBox({ value: new Date() });
}