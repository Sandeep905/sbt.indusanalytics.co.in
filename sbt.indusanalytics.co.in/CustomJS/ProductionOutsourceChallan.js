"use strict";
var FlagEdit = false;
var GblOutsourceID = 0, GblVendorID = 0, GblOutChallanID = 0;

////init date and select box
$("#DtVoucherDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    value: new Date(),
    min: new Date()
});

$("#DtBillDate").dxDateBox({
    pickerType: "rollers",
    type: "datetime",
    displayFormat: 'dd-MMM-yyyy HH:mm',
    value: new Date(),
    min: new Date()
});

var optionData = ["Pending Challan PO", "Sent Challan PO"];
$("#RadioButtonPO").dxRadioGroup({
    items: optionData,
    value: optionData[0],
    layout: 'horizontal',
    onValueChanged: function (e) {
        if (e.value === "Pending Challan PO") {
            FlagEdit = false;
            document.getElementById("BtnCreateEdit").innerHTML = "Create Challan";
            $("#BtnPrint").addClass("hidden");
        } else {
            FlagEdit = true;
            $("#BtnPrint").removeClass("hidden");
            document.getElementById("BtnCreateEdit").innerHTML = "Edit Challan";
        }
        GetPendingChallanPOData();
    }
});

////init Grids
$("#gridPendingProcessPO").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    selection: { mode: "multiple", allowSelectAll: false },
    filterRow: { visible: true, applyFilter: "auto" },
    sorting: { mode: 'multiple' },
    columns: [{ dataField: "LedgerName", caption: "Vendor Name" }, { dataField: "VoucherNo", caption: "Voucher No" }, { dataField: "VoucherDate", caption: "Date" }, { dataField: "SendVoucherNo", caption: "Send No" }, { dataField: "SendVoucherDate", caption: "Send Date" },
    { dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", maxWidth: 180 },
    { dataField: "Remark", caption: "Remark", maxWidth: 180 }, { dataField: "UserName", caption: "Created By" }],
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
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData;
        newClick();
        if (selectedItems.currentSelectedRowKeys.length > 0) {
            //GblOutsourceID = data[0].OutsourceID;
            GblOutChallanID = data[0].OutsourceChallanID;
            if (GblVendorID === 0) {
                GblVendorID = data[0].LedgerID;
            } else if (GblVendorID !== selectedItems.currentSelectedRowKeys[0].LedgerID && FlagEdit === false) {
                selectedItems.component.deselectRows((selectedItems || {}).currentSelectedRowKeys[0]);
                DevExpress.ui.notify("Please select records which have same vendor..!", "warning", 1500);
                selectedItems.currentSelectedRowKeys = [];
                return false;
            }
        }
        if (data.length === 0) {
            GblVendorID = 0;
            $("#TxtOutsourceIds").text('');
        } {

            document.getElementById("TxtVendorName").value = data[0].LedgerName;
            document.getElementById("TxtTransporter").value = data[0].Transporter;
            document.getElementById("TxtVehicleNo").value = data[0].VehicleNo;
            document.getElementById("TxtDestination").value = data[0].PlaceOfSupply;

            document.getElementById("TxtBillNo").value = data[0].EWayBillNumber;
            $("#DtBillDate").dxDateBox({ value: data[0].EWayBillDate });

            $("#TxtOutsourceIds").text(
                $.map(data, function (value) {
                    return value.OutsourceID;
                }).join(','));
        }
    }
});

$("#gridContentMaterialDetail").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnResizingMode: "widget",
    sorting: { mode: 'none' },
    columns: [{ dataField: "JobCardContentNo", caption: "JC Content No" }, { dataField: "PlanContName", caption: "Content Name", width: 180 },
    { dataField: "ItemCode" }, { dataField: "ItemName", caption: "Item Name" }, { dataField: "HSNCode", caption: "HSNCode" },
    { dataField: "IssueQuantity" }, { dataField: "IssueWt" }, { dataField: "ItemRate", caption: "Rate" }, { dataField: "ItemAmount", caption: "Item Amount" },
    { dataField: "StockUnit" }, { dataField: "Remark", caption: "WIP - Item Description" }, { dataField: "ProcessingQty" }, { dataField: "WIPUnit", caption: "WIP Unit" }],
    showRowLines: true,
    showBorders: true,
    scrolling: {
        mode: 'virtual'
    },
    height: function () {
        return window.innerHeight / 1.5;
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
        if (e.column.dataField === "ItemRate") {
            e.cancel = false;
        } else e.cancel = true;
    },
    onRowUpdating: function (e) {
        if (e.newData.ItemRate > 0) {
            e.newData.ItemAmount = e.newData.ItemRate * e.oldData.IssueWt;
            e.newData.ItemAmount = e.newData.ItemAmount.toFixed(2);
        }
    },
    summary: {
        recalculateWhileEditing: true,
        totalItems: [{
            column: "ConsumeQuantity",
            summaryType: "sum",
            displayFormat: "Ttl: {0}"
        }, {
            column: "ItemAmount",
            summaryType: "sum",
            displayFormat: "₹: {0}"
        }]
    }////₹  
});

///Btn clicked
$("#BtnCreateEdit").click(function () {
    var OutsourceID = $("#TxtOutsourceIds").text();
    if (FlagEdit === false && OutsourceID.length <= 0) return false;
    if (FlagEdit === true && GblOutChallanID <= 0) return false;

    if (FlagEdit === false) GetContentWiseMaterial(OutsourceID);
    if (FlagEdit === true) GetContentWiseMaterial(GblOutChallanID);

    document.getElementById("BtnCreateEdit").setAttribute("data-toggle", "modal");
    document.getElementById("BtnCreateEdit").setAttribute("data-target", "#largeModalDetails");
});

$("#BtnSave").click(function () {

    var gridContents = $('#gridContentMaterialDetail').dxDataGrid('instance');
    var Remark = document.getElementById("TxtRemarks").value.trim();
    var VoucherDate = $("#DtVoucherDate").dxDateBox('instance').option('value');
    var TxtTransporter = document.getElementById("TxtTransporter").value.trim();
    var TxtVehicleNo = document.getElementById("TxtVehicleNo").value.trim();
    var TxtDestination = document.getElementById("TxtDestination").value.trim();

    var BillNo = document.getElementById("TxtBillNo").value.trim();
    var BillDate = $("#DtBillDate").dxDateBox('instance').option('value');

    if (gridContents._options.dataSource.length <= 0) {
        DevExpress.ui.notify("No any items detail found for save challan..", "warning", 1500);
        return false;
    }
    if (TxtTransporter === "" || TxtTransporter === null) {
        DevExpress.ui.notify("Please enter transporter..", "warning", 1500);
        document.getElementById("TxtTransporter").focus();
        return false;
    }
    if (TxtVehicleNo === "" || TxtVehicleNo === null) {
        DevExpress.ui.notify("Please enter vehicle no..", "warning", 1500);
        document.getElementById("TxtVehicleNo").focus();
        return false;
    }
    var ObjData = {};
    var ArrObjData = [];

    if (FlagEdit === true) {
        ObjData.OutsourceChallanID = GblOutChallanID;
    }
    ObjData.OutsourceID = gridContents._options.dataSource[0].OutsourceID;
    ObjData.JobBookingJobCardContentsID = gridContents._options.dataSource[0].JobBookingJobCardContentsID;
    ObjData.LedgerID = GblVendorID;
    ObjData.Remark = Remark;
    ObjData.VoucherDate = VoucherDate;
    ObjData.Transporter = TxtTransporter;
    ObjData.VehicleNo = TxtVehicleNo;
    ObjData.PlaceOfSupply = TxtDestination;
    ObjData.EWayBillNumber = BillNo;
    ObjData.EWayBillDate = BillDate;

    var ObjDataDetails = {};
    var ArrObjDataDetails = [];
    var SumItemAmount = 0;

    for (var i = 0; i < gridContents._options.dataSource.length; i++) {
        ObjDataDetails = {};
        if (FlagEdit === true) {
            ObjDataDetails.OutsourceChallanID = gridContents._options.dataSource[i].OutChallanID;
            ObjDataDetails.ChallanDetailID = gridContents._options.dataSource[i].ChallanDetailID;
        }
        ObjDataDetails.OutsourceID = gridContents._options.dataSource[i].OutsourceID;
        ObjDataDetails.ItemID = gridContents._options.dataSource[i].ItemID;
        ObjDataDetails.ItemGroupID = gridContents._options.dataSource[i].ItemGroupID;
        ObjDataDetails.ItemRate = parseFloat(gridContents._options.dataSource[i].ItemRate).toFixed(2);
        ObjDataDetails.ConsumeQuantity = Number(gridContents._options.dataSource[i].IssueQuantity);
        ObjDataDetails.ItemAmount = parseFloat(gridContents._options.dataSource[i].ItemAmount).toFixed(2);
        ObjDataDetails.StockUnit = gridContents._options.dataSource[i].StockUnit;
        ObjDataDetails.Remark = gridContents._options.dataSource[i].Remark;
        ObjDataDetails.SequenceNo = i + 1;

        ObjDataDetails.ItemDescription = gridContents._options.dataSource[i].ItemDescription; //WIP - Item Description
        ObjDataDetails.ProcessingQty = gridContents._options.dataSource[i].ProcessingQty;
        ObjDataDetails.WIPUnit = gridContents._options.dataSource[i].WIPUnit;

        SumItemAmount = SumItemAmount + Number(ObjDataDetails.ItemAmount);

        ArrObjDataDetails.push(ObjDataDetails);
    }

    ObjData.TotalAmount = SumItemAmount;
    ArrObjData.push(ObjData);

    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/SaveProductionOutsourceChallan",
        data: '{ObjData:' + JSON.stringify(ArrObjData) + ',ObjDataDetails:' + JSON.stringify(ArrObjDataDetails) + ',ChallanID:' + JSON.stringify(GblOutChallanID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var Title, Text, Type;
            if (results.d.includes("Success:")) {
                if (FlagEdit === false) {
                    var ChallanID = results.d.split(":")[1];
                    GblOutChallanID = Number(ChallanID);
                    Text = "Challan data saved..";
                } else {
                    Text = "Challan data updated..";
                }
                FlagEdit = true;
                Title = "Success...";
                Type = "success";
                newClick();
            } else if (results.d.includes("Can't")) {
                Title = results.d.split(",")[1];
                Text = results.d;
                Type = "warning";
            } else if (results.d.includes("Error:")) {
                Title = "Error..!";
                Text = results.d;
                Type = "error";
            }
            swal(Title, Text, Type);
            if (Type === "success") window.location.reload();
        },
        error: function errorFunc(jqXHR) {
            swal("Error!", "Please try after some time..", "");
            console.log(jqXHR);
        }
    });
});

$("#BtnPrint").click(function () {
    if (FlagEdit === false || GblOutChallanID <= 0) return;

    var url = "ReportOutsourceChallan.aspx?UID=" + GblOutChallanID;
    window.open(url, "blank", "location=yes,height=" + window.innerHeight + ",width=" + window.innerWidth / 1.1 + ",scrollbars=yes,status=no", true);
});

$("#BtnDelete").click(function () {
    if (FlagEdit === false || GblOutChallanID <= 0) return;
    swal({
        title: "Deleting...",
        text: "Are you sure to delete this record..?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        function () {
            $.ajax({
                type: "POST",
                url: "WebServiceProductionOutsource.asmx/DeleteProductionOutsourceChallan",
                data: '{OutID:' + GblOutChallanID + '}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (results) {
                    if (results.d === "Success") {
                        swal("Deleted..!", "Your data deleted successfully..", "success");
                        location.reload();
                    } else if (results.d.includes("Error:")) {
                        swal("Error..!", results.d, "error");
                    } else if (results.d.includes("Can't")) {
                        swal("Can't Delete..!", results.d, "warning");
                    }
                },
                error: function errorFunc(jqXHR) {
                    swal("Error!", "Please try after some time..", "");
                    console.log(jqXHR);
                }
            });
        });
});

///////Voucher No
$.ajax({
    type: "POST",
    url: "WebServiceProductionOutsource.asmx/GetOutsourceChallanVoucherNo",
    data: '{}',
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

GetPendingChallanPOData();
////Functions
function GetPendingChallanPOData() {
    try {
        if (FlagEdit === "") return;
        $.ajax({
            type: "POST",
            url: "WebServiceProductionOutsource.asmx/GetPendingChallanPO",
            data: '{flag:' + JSON.stringify(FlagEdit) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/u0027/g, "'");
                res = res.replace(/:,/g, ':null,');
                res = res.replace(/:}/g, ':null},');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                if (FlagEdit === false) {
                    $("#gridPendingProcessPO").dxDataGrid({
                        dataSource: RES1,
                        selection: { mode: "multiple", allowSelectAll: false }
                    });
                } else {
                    $("#gridPendingProcessPO").dxDataGrid({
                        dataSource: RES1,
                        selection: { mode: "single" }
                    });
                }
                var gridInstance = $("#gridPendingProcessPO").dxDataGrid('instance');
                gridInstance.columnOption("VoucherNo", "visible", FlagEdit);
                gridInstance.columnOption("VoucherDate", "visible", FlagEdit);

            },
            error: function errorFunc(jqXHR) {
                console.log(jqXHR);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function GetContentWiseMaterial(OutID) {
    $("#gridContentMaterialDetail").dxDataGrid({ dataSource: [] });
    if (OutID === null || OutID === "" || OutID === undefined) return;

    $.ajax({
        type: "POST",
        url: "WebServiceProductionOutsource.asmx/GetContentWiseMaterialDetail",
        data: '{OutID:' + JSON.stringify(OutID) + ',Flag:' + JSON.stringify(FlagEdit) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.replace(/u0026/g, "&");
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ':null,');
            res = res.replace(/:}/g, ':null},');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#gridContentMaterialDetail").dxDataGrid({
                dataSource: RES1
            });
        }
    });
}

function newClick() {
    document.getElementById("TxtVendorName").value = "";
    document.getElementById("TxtTransporter").value = "";
    document.getElementById("TxtVehicleNo").value = "";
    GblOutsourceID = 0; GblOutChallanID = 0;

    document.getElementById("TxtBillNo").value = "";
    $("#DtBillDate").dxDateBox({ value: new Date() });
}