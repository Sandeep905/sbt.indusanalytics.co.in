var BookingID = 0, GblShipperID = 0;
var Gbl_RowID = ""; var Gbl_TDQty = 0;
var GblPlanValues = {}, GblValuesOper = {}, GblInputValues = {}, GblInputOpr = [], GblTypesOfC = [];
var OprData; var GblObjShippers = [];
var GblTotalPaperWt = 0, GblTotalForms = 0;
var ObjMachines;
var ObjDefaultProcess = [];

$("#ItemPlanQuality").dxSelectBox({
    items: [],
    placeholder: "Select Quality",
    displayExpr: 'Quality',
    valueExpr: 'Quality',
    showClearButton: true,
    //acceptCustomValue: true,
    searchEnabled: true,
    onValueChanged: function (data) {
        var Quality = data.value;
        //if (!data) return;
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/GetGSM",
            data: '{Quality:' + JSON.stringify(Quality) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);
                $("#ItemPlanGsm").dxSelectBox({ items: RES1 });

                //$("#ItemPlanMill").dxSelectBox({ value: null });
                //$("#ItemPlanFinish").dxSelectBox({ value: null });
            }
        });
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Item quality is required' }]
});

$("#FilterMachineFolds").dxRadioGroup({
    items: ["All", "Machine Folds"],
    disabled: true,
    layout: "horizontal",
    //itemTemplate: function (itemData, _, itemElement) {
    //    itemElement
    //        .parent().addClass(itemData.toLowerCase().replace(' ','')).addClass("font-bold")
    //        .text(itemData);
    //},
    onValueChanged: function (data) {
        var dataGrid = $("#ContentPlansList").dxDataGrid('instance');
        dataGrid.clearFilter();
        if (data.value === "Machine Folds") {
            dataGrid.filter(["Folds", "=", 1]);
        }
    }
});

$("#MachineIDFiltered").dxTagBox({
    items: [],
    multiline: false,
    searchEnabled: true,
    placeholder: "Select Machine...",
    displayExpr: "MachineName",
    valueExpr: "MachineID",
    showSelectionControls: true,
    maxDisplayedTags: 2,
    //showMultiTagOnly: false,
    onValueChanged: function (selectedItems) {
        var data = selectedItems.value;
        if (!data) return;
        if (data.length > 0) {
            $("#MachineId").text(data);
        }
        else {
            $("#MachineId").text("");
        }
    }
});

$("#SbConsigneeName").dxSelectBox({
    valueExpr: "ConsigneeID",
    placeholder: "Select consignee...",
    displayExpr: "ConsigneeName",
    showClearButton: true
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Consignee is required' }]
});

$("#ItemPlanMill").dxSelectBox({
    items: [],
    placeholder: "Select Mill",
    showClearButton: true,
    //acceptCustomValue: true,
    displayExpr: 'Mill',
    valueExpr: 'Mill',
    searchEnabled: true,
    onValueChanged: function (data) {
        if (!data) return;
        var Mill = data.value;
        var Quality = $("#ItemPlanQuality").dxSelectBox("instance").option('value');
        var GSM = $("#ItemPlanGsm").dxSelectBox("instance").option('value');
        //var str = "Where GSM ='" + GSM + "' And Quality='" + Quality + "' And Mill='" + Mill + "'";

        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/GetFinish",
            data: '{Quality:' + JSON.stringify(Quality) + ',GSM:' + JSON.stringify(GSM) + ',Mill:' + JSON.stringify(Mill) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res);

                $("#ItemPlanFinish").dxSelectBox({
                    items: RES1
                });
            }
        });
    }
});

$("#ItemPlanFinish").dxSelectBox({
    items: [],
    placeholder: "Select Finish",
    showClearButton: true,
    searchEnabled: true,
    displayExpr: 'Finish',
    valueExpr: 'Finish'
    //acceptCustomValue: true
});

var toolTip = $("#tooltip").dxTooltip({
}).dxTooltip("instance");

$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetJobSizeTemplate",
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

        $("#SelJobSizeTemplate").dxSelectBox({
            dataSource: RES1,
            placeholder: "Select Template",
            showClearButton: true,
            searchEnabled: true,
            displayExpr: 'JobSizeTemplateName',
            valueExpr: 'JobSizeTemplateName',
            onValueChanged: function (data) {
                if (!data) return;
                var sizeType = data.value;
                var result = $.grep(data.component._dataSource._store._array, function (ex) { return ex.JobSizeTemplateName === sizeType; });
                if (result.length === 1) {
                    $('#planJob_Size input').each(function () {
                        if (this.type === "text" && this.style.display === "block") {
                            let sizename = this.id.replace('Size', 'Job');
                            if (sizename === "JobWidth") sizename = "JobHeight";
                            this.value = result[0][sizename] == undefined ? 0 : result[0][sizename];
                        }
                    });
                }
            }
        });

    }
});

$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetCoating",
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

        $("#PlanOnlineCoating").dxSelectBox({
            items: RES1,
            placeholder: "Select coating",
            displayExpr: "CoatingName",
            valueExpr: "CoatingName",
            searchEnabled: true,
            showClearButton: true,
            onValueChanged: function (data) {
                var coating = data.value;
                if (coating === "" || coating === null) {
                    $("#MachineIDFiltered").dxTagBox({
                        items: ObjMachines
                    });
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "WebServicePlanWindow.asmx/GetCoatingMachines",
                    data: '{coating:' + JSON.stringify(coating) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.replace(/":,/g, '":null,');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var RES1 = JSON.parse(res);

                        $("#MachineIDFiltered").dxTagBox({
                            items: RES1
                        });
                    }
                });
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetSbCurrency",
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

        $("#SbCurrency").dxSelectBox({
            items: RES1,
            value: "INR",
            placeholder: "Select Currency",
            displayExpr: "CurrencyCode",
            valueExpr: "CurrencyCode",
            searchEnabled: true,
            //showClearButton: true
            onValueChanged: function (e) {
                var endpoint = 'live';
                var access_key = '2fc524ac139a24e0ad4ada2fa8127d7e';

                // get the most recent exchange rates via the "live" endpoint:
                //$.ajax({
                //    url: 'http://apilayer.net/api/' + endpoint + '?access_key=' + access_key,
                //    dataType: 'jsonp',
                //    success: function (json) {
                //        var result = $.grep(json.quotes, function (ex) { return ex.quotes.includes(e.value); });
                //        if (result.length === 1) {
                //            var x = result[0];
                //            document.getElementById("TxtCurrencyValue").value = x;
                //        }
                //         exchange rata data is stored in json.quotes
                //        alert(json.quotes.USDGBP);
                //        document.getElementById("TxtCurrencyValue").value = json.quotes.USDGBP;
                //         source currency is stored in json.source
                //        alert(json.source);

                //         timestamp can be accessed in json.timestamp
                //        alert(json.timestamp);

                //    }
                //});

                //to = 'INR';
                var amount = '1';

                // execute the conversion using the "convert" endpoint:
                //$.ajax({
                //    url: 'http://apilayer.net/api/' + endpoint + '?access_key=' + access_key + '&from=' + e.value + '&to=INR&source:INR&amount=' + amount,
                //    dataType: 'json',
                //    success: function (json) {
                //        // access the conversion result in json.result
                //        alert(json.quotes);
                //        document.getElementById("TxtCurrencyValue").value = json.quotes[0];
                //    }
                //});
            }
        });
    }
});

$.ajax({
    type: "POST",
    url: "WebServiceProcessMaster.asmx/MachiGrid",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        ObjMachines = JSON.parse(res);

        var RES1 = ObjMachines.filter(function (obj) {
            return obj.DepartmentID === 100 || obj.DepartmentName === "Printing";
        });

        $("#MachineIDFiltered").dxTagBox({
            items: RES1,
            placeholder: "Select machine...",
            displayExpr: "MachineName",
            valueExpr: "MachineID"
        });
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

        $("#SbHSNGroups").dxSelectBox({
            dataSource: RES1,
            placeholder: "Select...",
            displayExpr: "HSNCode",
            valueExpr: "ProductHSNID",
            searchEnabled: true,
            showClearButton: true,
            onValueChanged: function (e) {
                var result = $.grep(e.component._dataSource._store._array, function (ex) { return ex.ProductHSNID === e.value; });
                if (result.length === 1) {
                    document.getElementById("FinalTaxPer0").value = result[0].GSTTaxPercentage;
                    onChangeUpdatePer("FinalTaxPer0");
                }
            }
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Product HSN Group is required' }]
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

$(".reloadprocess").click(function () {
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
                    ShowOperationGrid(JSON.parse(res.toString()), ProcessSlabs);
                },
                error: function errorFunc(jqXHR) {
                    // alert(jqXHR.message);
                }
            });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
});

$(".reloadquality").click(function (e) {

    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/GetQuality",
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

            $("#ItemPlanQuality").dxSelectBox({ items: RES1 });
        },
        error: function errorFunc(jqXHR) {
            //alert("not show");
        }
    });
});

$(".reloadquality").click();
$(".reloadprocess").click();

$(".btnnewmaster").click(function (e) {
    var UrlSrc = "";
    document.getElementById("LbliFrame").innerHTML = "";
    if (e.target.className.includes("quality")) {
        UrlSrc = "Masters.aspx";
        document.getElementById("LbliFrame").innerHTML = "reloadquality";
    } else if (e.target.className.includes("process")) {
        UrlSrc = "ProcessMaster.aspx";
        document.getElementById("LbliFrame").innerHTML = "reloadprocess";
    } else if (e.target.className.includes("client")) {
        UrlSrc = "LedgerMaster.aspx";
        document.getElementById("LbliFrame").innerHTML = "reloadclient";
    } else if (e.target.className.includes("category")) {
        UrlSrc = "CategoryMaster.aspx";
        document.getElementById("LbliFrame").innerHTML = "reloadcategory";
    }
    if (UrlSrc === "") return;
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    document.getElementById("iFrameMasters").src = UrlSrc;
    document.getElementById("iFrameMasters").style.height = window.innerHeight / 1.1 + "px";
    $(".btnnewmaster").attr("data-toggle", "modal");
    $(".btnnewmaster").attr("data-target", "#ModaliFrame");
});

$("#btnCloseiFrame").click(function () {
    var classid = document.getElementById("LbliFrame").innerHTML;
    $("." + classid).click();
});

//$('#iFrameMasters').load(function () {
//    $('#iFrameMasters').contents().find('#Customleftsidebar1').hide();
//    $('#iFrameMasters').contents().find('#SelFYearList').hide();
//    $('#iFrameMasters').contents().find('#myTopnav').hide();
//    $('#iFrameMasters').contents().find('#CreateButton').click();
//    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
//});

function GetConsignee(CID) {
    $.ajax({
        type: "POST",
        url: "WebServiceOthers.asmx/GetConsigneeData",
        data: '{ClientID:' + CID + '}',//
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
            $("#SbConsigneeName").dxSelectBox({
                dataSource: RES1
            });
        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            alert(jqXHR.message);
        }
    });
}

$.ajax({
    type: "POST",
    url: "WebServicePlanWindow.asmx/GetGSM",
    data: '{Quality:""}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        var RES1 = JSON.parse(res);

        //var products = new DevExpress.data.DataSource({
        //    store: RES1,
        //    key: "Item_ID",
        //    group: "Field_Name"
        //});

        //$("#ItemPlanGsm").dxTagBox({
        //    dataSource: products,
        //    valueExpr: "Item_ID",
        //   // value: [productsData[16].ID, productsData[18].ID],
        //    grouped: true,
        //    displayExpr: "Field_Value"
        //});

        $("#ItemPlanGsm").dxSelectBox({
            items: RES1,
            placeholder: "Select GSM",
            displayExpr: 'GSM',
            valueExpr: 'GSM',
            showClearButton: true,
            searchEnabled: true,
            onValueChanged: function (data) {
                if (!data) return;
                var GSM = data.value;
                var Quality = $("#ItemPlanQuality").dxSelectBox("instance").option('value');
                //                var str = "Where GSM ='" + GSM + "' And Quality='" + Quality + "'";
                $.ajax({
                    type: "POST",
                    url: "WebServicePlanWindow.asmx/GetMill",
                    data: '{Quality:' + JSON.stringify(Quality) + ',GSM:' + JSON.stringify(GSM) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var RES1 = JSON.parse(res);

                        $("#ItemPlanMill").dxSelectBox({
                            items: RES1,
                            placeholder: "Select Mill",
                            displayExpr: 'Mill',
                            valueExpr: 'Mill'
                        });

                        //$("#ItemPlanFinish").dxSelectBox({
                        //    items: RES1.TblFinish,
                        //    //  value: null,
                        //    placeholder: "Select Finish",
                        //    displayExpr: 'Finish',
                        //    valueExpr: 'Finish'
                        //});
                    }
                });
            }
        }).dxValidator({
            validationRules: [{ type: 'required', message: 'Item GSM is required' }]
        });
    },
    error: function errorFunc(jqXHR) {
        //alert("not show");
    }
});

$("#PlanPrintingGrain").dxSelectBox({
    items: ["Both", "With Grain", "Across Grain"],
    placeholder: "Grain Direction--",
    showClearButton: true,
    searchEnabled: true,
    value: "Both"
});

function PrintStyle(e) {
    if (!numericValidation(e)) return;

    var printS;
    var Fr = Number(document.getElementById("PlanFColor").value);
    var Bc = Number(document.getElementById("PlanBColor").value);
    if (Fr === Bc && Fr > 0 && Bc > 0) {
        printS = ["Choose Best", "Front & Back", "Work & Turn", "Work & Tumble", "FB-Perfection"];
    } else if (Fr !== 0 && Bc === 0 || Bc !== 0 && Fr === 0) {
        printS = ["Single Side"];
    } else if (Bc === 0 && Fr === 0) {
        printS = ["No Printing"];
    } else {
        printS = ["Choose Best"];
    }
    if (Fr > 0 || Bc > 0) {
        var RES1 = ObjMachines.filter(function (obj) {
            return obj.DepartmentID === 100 || obj.DepartmentName === "Printing";
        });

        $("#MachineIDFiltered").dxTagBox({
            items: RES1
        });
    } else {
        $("#MachineIDFiltered").dxTagBox({
            items: ObjMachines
        });
    }

    $("#PlanPrintingStyle").dxSelectBox({
        items: printS,
        value: printS[0]
    });
}

$("#PlanPrintingStyle").dxSelectBox({
    items: ["Choose Best", "Single Side", "Front & Back", "Work & Tumble", "Work & Turn", "FB-Perfection"],
    placeholder: "Printing Style..",
    showClearButton: true,
    searchEnabled: true,
    onvaluechanged: function (data) {
        //if (!data.value) {
        //    document.getelementbyid("planfcolor").disabled = false;
        //    document.getelementbyid("planbcolor").placeholder = "back";
        //    return;
        //}

        //if (data.value === "single side") {
        //    document.getelementbyid("planfcolor").disabled = "disabled";
        //    document.getelementbyid("planbcolor").placeholder = "color";
        //} else {
        //    document.getelementbyid("planbcolor").placeholder = "back";
        //    document.getelementbyid("planfcolor").disabled = false;
        //}
    }
});

$("#PlanWastageType").dxSelectBox({
    items: ["Machine Default", "Percentage", "Sheets"],
    placeholder: "Select Type--",
    showClearButton: true,
    searchEnabled: true,
    value: "Machine Default",
    onValueChanged: function (data) {
        var PlanWastage = data.value;
        if (PlanWastage === "Sheets" || PlanWastage === "Percentage") {
            document.getElementById("PlanWastageValue").style.display = "block";
            //document.getElementById("PlanWastageValue").value = 0;
        }
        else {
            document.getElementById("PlanWastageValue").value = "";
            document.getElementById("PlanWastageValue").style.display = "none";
        }
        //  fill();PlanPlateType
    }
});

$("#PlanPlateType").dxSelectBox({
    items: ["CTP Plate", "PS Plate", "PS Plate+Film", "CTcP Plate", "None"],
    value: "CTP Plate",
    placeholder: "Select Plate Type--",
    showClearButton: true,
    searchEnabled: true,
    onValueChanged: function (data) {
        var PlateType = data.value;

    }
});

function ValidatePlanQty() {
    $('#planJob_Size input').each(function () {
        if (this.id !== "") {
            if (this.required === true) {
                if (this.value === "") {
                    swal({
                        title: "Empty Field?",
                        text: "Please enter value in " + this.placeholder,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        closeOnConfirm: true
                    }, function () {
                        return false;
                    });
                    return false;
                }
            }
        }
    });
    return true;
}

$("#PlanButton").click(function () {
    if (Gbl_TDQty === 0) return false;
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
        var opconf = confirm("Process not selected\nAre you sure to continue..?");
        if (opconf !== true) {
            $("#PlanButtonHide").removeClass("fa fa-arrow-circle-down");
            $("#PlanButtonHide").addClass("fa fa-arrow-circle-up");
            $("#PlanSizeContainer").slideDown(800);
            $("#PlanContainer").slideUp(800);
            return;
        }
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

    GblPlanValues = {};
    GblInputValues = {};
    GblInputValues = Obj_Job_Size;
    ///saveContentsSizeValues(Obj_Job_Size);

    var Grid1 = $("#GridOperationAllocated").dxDataGrid('instance');
    var GDOprstore = [];
    for (var i = 0; i < Grid1.totalCount(); i++) {
        var GDOpr = {};
        GDOpr.ProcessID = Grid1._options.dataSource[i].ProcessID;  //cellValue(i, 0);
        GDOpr.Rate = Number(Grid1._options.dataSource[i].Rate);
        GDOpr.RateFactor = Grid1._options.dataSource[i].RateFactor;
        GDOpr.ProcessName = Grid1._options.dataSource[i].ProcessName;

        GDOprstore.push(GDOpr);
    }
    GblInputOpr = GDOprstore;
    var ObjOprJson = JSON.stringify(GDOprstore);

    try {
        $.ajax({
            type: "POST",
            url: "Api_shiring_service.asmx/Shirin_Job",
            data: '{ObjJSJson:' + ObjJSJson + ',ObjOprJson:' + ObjOprJson + ',LedgerID:' + LedgerID + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);    /////  res = res.slice(0, -1);

                ////var detailGrids = $("#grdTechnology").find(".internal-grid");
                ////for (var i = 0; i < detailGrids.length; i++) {
                ////    var grid = $(detailGrids[i]).dxDataGrid('instance');
                ////    grid.clearSelection();
                ////}
                var blankdata = [];
                $("#ContentPlansList").dxDataGrid({ dataSource: blankdata, clearSelection: true });
                var grid = $("#ContentPlansList").dxDataGrid('instance');
                grid.clearSelection();
                $("#GridHeadsDetails").dxDataGrid({ dataSource: blankdata });
                $("#GridOperationDetails").dxDataGrid({ dataSource: blankdata });

                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);

                var No_Plan = "Check Job Size: Job size may be larger than available Paper size or Machine Size. " + "\n" +
                    " Check Paper Size: Suitable paper size may not be available in selected Paper Group.  " + "\n" +
                    " Check Grain Direction: Grain Direction may not be correct. " + "\n" +
                    " Check Printing Style: Printing Style may not be correct. " + "\n" +
                    " Check Color Strip, Gripper,  Plate Type, Job Trimming, Stripping Margin, Printing Margin";
                if (results.d.includes("TblPlanning") === false) {
                    No_Plan = results.d;
                    if (No_Plan.includes("Conversion from string")) {
                        No_Plan = "Session Expired, Please login again";
                        DevExpress.ui.notify(No_Plan, "warning", 500);
                        alert(No_Plan);
                        location.reload(true);
                        return false;
                    } else if (No_Plan !== "") {
                        DevExpress.ui.notify(No_Plan, "warning", No_Plan.length);
                        alert(No_Plan);
                        return false;
                    }
                } else if (res === "[]") {
                    DevExpress.ui.notify(No_Plan, "warning", No_Plan.length);
                    alert(No_Plan);
                    return false;
                }
                var RES1 = JSON.parse(res);
                if (RES1.TblPlanning.length < 1) {
                    alert("Please Check Job Size");
                    DevExpress.ui.notify(No_Plan, "warning", 5000);
                }
                else {
                    try {
                        ShowShirinReport(RES1);
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert("Check Job Size " + jqXHR.statusText);
                DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 100);
            }
        });
    } catch (e) {
        console.log(e);
        DevExpress.ui.notify("" + e + "", "error", 100);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

function ShowShirinReport(gridData) {
    var Flagprinting = false;
    if (gridData.TblPlanning.length > 0) {
        $("#PlanButtonHide").removeClass("fa fa-arrow-circle-up");
        $("#PlanSizeContainer").slideUp(800);
        $("#PlanContainer").slideDown(800);
        $("#PlanButtonHide").addClass("fa fa-arrow-circle-down");
        $("#PlanSizeContainer").animate({ scrollTop: 0 }, "slow");
    }
    var contOrientation = document.getElementById("ContentOrientation").innerHTML;
    if (contOrientation === "BookPages" || contOrientation === "WiroBookPages" || contOrientation.includes("Leaves") || contOrientation === "WrintingPad" || contOrientation === "Calendar") {
        $("#FilterMachineFolds").dxRadioGroup({ disabled: false });
        if (contOrientation === "WrintingPad") { Flagprinting = true; } else { Flagprinting = false; }
    } else {
        $("#FilterMachineFolds").dxRadioGroup({ disabled: true });
        Flagprinting = true;
    }
    document.getElementById("finalCost").value = 0;
    document.getElementById("finalUnitCost").value = 0;


    $("#ContentPlansList").dxDataGrid({
        dataSource: gridData.TblPlanning,
        keyExpr: "PlanID",
        allowColumnReordering: true,
        allowColumnResizing: true,
        showRowLines: true,
        filterRow: { visible: true },
        showBorders: true,
        loadPanel: {
            enabled: true
        },
        sorting: { mode: 'multiple' },
        scrolling: {
            mode: 'infinite'
        },
        columnResizingMode: "widget",
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
            if (e.rowType === "data") {
                if (e.data.PlanType === "Sheet Planning") {
                    //    e.rowElement.css('background', 'red');
                } else if (e.data.PlanType === "Reel to Sheet Planning") {
                    e.rowElement.css('background', '#e4ff00a6');
                } else if (e.data.PlanType === "Reel Planning") {
                    e.rowElement.css('background', '#ffc5d8');
                }
                if (e.data.PaperID === 0) {
                    e.rowElement.css('background', 'greenyellow');
                }
                //for (var i = 1; i < 5; i++) {
                //    if (Math.pow(4, i) === e.data.TotalUps || 8 === e.data.TotalUps) {
                //        e.rowElement.addClass('machinefolds');
                //    }
                //}
            }
        },
        height: function () {
            return window.innerHeight / 2.5;
        },
        // headerFilter: { visible: true },
        //paging: { pageSize: 4 },
        selection: { mode: "single" }, //columnHidingEnabled: true,
        columnAutoWidth: true,
        columns: [{ dataField: "VendorName", width: 120, caption: "Associate Partner", visible: false }, {
            dataField: "MachineName", width: 150,
            cellTemplate: function (container, options) {
                $('<a>').addClass('btn padding-0 font-11').text(options.data.MachineName)
                    .on('dxclick', function () {
                        this.setAttribute("href", "MachineMaster.aspx");
                        this.setAttribute("target", "_blank");
                    }).appendTo(container);
            }
        }, { dataField: "PaperSize", width: 80 }, { dataField: "CutSize", width: 70 },
        { dataField: "TotalUps", caption: "Ttl Ups", width: 50 }, { dataField: "BalPiece", width: 80 }, { dataField: "WastePerc", caption: "Waste %", width: 60 },
        { dataField: "WastageKg", caption: "Waste Kg", sortOrder: 'asc', sortIndex: 2, width: 80 },
        { dataField: "TotalAmount", caption: "Total Cost", sortIndex: 1, sortOrder: 'asc', width: 80 },
        { dataField: "OpAmt", caption: "Opr Cost", visible: true, width: 60 },
        { dataField: "PrintingStyle", visible: Flagprinting, width: 100 },
        { dataField: "ExpectedExecutionTime", caption: "Exe Time", hidingPriority: 0, visible: false }, { dataField: "PaperRateType", hidingPriority: 2, visible: false },
        { dataField: "PlateQty", visible: false }, { dataField: "PlateRate", visible: false, width: 80 },
        { dataField: "PlateAmount", caption: "Plate Cost", visible: true, width: 60 }, { dataField: "PaperRate", visible: false, width: 80 },
        { dataField: "PaperAmount", caption: "Paper Cost", visible: true, width: 70 }, { dataField: "PrintingRate", visible: false, width: 80 },
        { dataField: "PrintingAmount", caption: "Print Cost", visible: true, width: 70, dataType: "numeric" }, { dataField: "GrantAmount", caption: "Grand Total", visible: true/*, sortIndex: 0, sortOrder: 'asc'*/, width: 80 },
        { dataField: "TotalExecutionTime", caption: "Ttl Time", visible: true }, { dataField: "PlanType", visible: true },
        { false: "MachineID", visible: false }, { dataField: "FullSheets", visible: false }, { dataField: "Impressionstobecharged", visible: false }, { dataField: "GrainDirection", visible: false, width: 80 },
        {
            caption: "Folds", visible: false, calculateCellValue: function (e) {
                var contOrientation = document.getElementById("ContentOrientation").innerHTML;
                if (contOrientation === "BookPages" || contOrientation === "WiroBookPages" || contOrientation.includes("Leaves") || contOrientation === "WrintingPad" || contOrientation === "Calendar") {
                    for (var i = 1; i < 5; i++) {
                        if (Math.pow(4, i) === e.TotalUps || 8 === e.TotalUps || 2 === e.TotalUps) {
                            return 1;
                        }
                    }
                    return 0;
                } else {
                    return 0;
                }
            }, width: 80
        }],
        //customizeColumns: function (columns) {
        //    columns[0].width = 120;
        //},
        //summary: {
        //    totalItems: [{
        //        column: "MachineName",
        //        summaryType: "count",
        //        displayFormat: "Total Plans: {0}"
        //    }]
        //},////₹
        //onCellHoverChanged: function (e) {
        //    e.cellElement.mousemove(function () {
        //        if (e.rowType === "data") {
        //            if (e.column.dataField === "PaperSize" || e.column.dataField === "CutSize") {
        //                var PL = e.displayValue.split("x");

        //                $('#tooltipText').text("Size in Inches : " + Number(Number(PL[0]) / 25.4).toFixed(2) + " x " + Number(Number(PL[1]) / 25.4).toFixed(2)).addClass('font-12').css('white-space', 'pre-wrap');
        //                toolTip.show(e.cellElement);
        //            }
        //        }
        //    });
        //},
        onContentReady: function (e) {
            if (!e.component.getSelectedRowKeys().length)
                e.component.selectRowsByIndexes(0);
        },
        onSelectionChanged: function (selectedItems) {
            ////selectedItems.component.collapseAll(-1);
            ////selectedItems.component.expandRow(selectedItems.currentSelectedRowKeys[0]);
            document.getElementById("TabOperations").style.display = "block";
            document.getElementById("TabHeadsDetails").style.display = "block";


            var value = selectedItems.selectedRowsData[0];
            GblPlanValues = {};
            $("a[name='nameApplyCost']").hide();
            if (!value) {
                document.getElementById("finalCost").value = 0;
                document.getElementById("finalUnitCost").value = 0;
                $("#GridHeadsDetails").dxDataGrid({
                    dataSource: []
                });
                $("#GridOperationDetails").dxDataGrid({
                    dataSource: []
                });
                return;
            }
            GblPlanValues = value;

            var JobH = Number(document.getElementById("SizeHeight").value);
            var JobL = Number(document.getElementById("SizeLength").value);
            var JobW = Number(document.getElementById("SizeWidth").value);
            var JobOpenFlap = Number(document.getElementById("SizeOpenflap").value);
            var JobPastingFlap = Number(document.getElementById("SizePastingflap").value);
            var JobBottomFlap = Number(document.getElementById("SizeBottomflap").value);

            //var PlanGripper = Number(document.getElementById("PlanGripper").value);
            //var FrontColor = Number(document.getElementById("PlanFColor").value);
            //var BackColor = Number(document.getElementById("PlanBColor").value);
            //var SPColorF = Number(document.getElementById("PlanSpeFColor").value);
            //var SPColorB = Number(document.getElementById("PlanSpeBColor").value);

            //var WastageValue = Number(document.getElementById("PlanWastageValue").value);
            var JobTrimmingL = Number(document.getElementById("Trimmingleft").value);
            var JobTrimmingR = Number(document.getElementById("Trimmingright").value);
            var JobTrimmingT = Number(document.getElementById("Trimmingtop").value);
            var JobTrimmingB = Number(document.getElementById("Trimmingbottom").value);
            var StrippingMarginL = Number(document.getElementById("Stripingleft").value);
            var StrippingMarginR = Number(document.getElementById("Stripingright").value);
            var StrippingMarginT = Number(document.getElementById("Stripingtop").value);
            var StrippingMarginB = Number(document.getElementById("Trimmingbottom").value);

            //var PlateAmt = Number(value.PlateAmount);
            //var PaperAmt = Number(value.PaperAmount);
            //var PrintingAmt = Number(value.PrintingAmount);

            //NoofSetsofFB = value.NoOfSets;
            //TotalUps = value.TotalUps;
            //TotalColors = value.TotalColors;
            //FinalQuantity = value.FinalQuantity;

            var PrintingMarginL = 0, PrintingMarginR = 0, PrintingMarginT = 0, PrintingMarginB = 0;
            var ContentType = document.getElementById("ContentOrientation").innerHTML; // $("#PlanContentType").val();
            var ColorStrip = Number(document.getElementById("PlanColorStrip").value);
            var JobTongHeight = 0;
            Draw_Sheets(value.PaperSize, value.CutSize, value.PlanType, value.GrainDirection);
            Draw_Cut_Sheet(ContentType, value.InterlockStyle, ColorStrip, value.Gripper, value.GripperSide, value.CutSize, value.GrainDirection, value.PrintingStyle, JobTrimmingL, JobTrimmingR, JobTrimmingT, JobTrimmingB, StrippingMarginL, StrippingMarginR, StrippingMarginT, StrippingMarginB, PrintingMarginL, PrintingMarginR, PrintingMarginT, PrintingMarginB, JobL, JobH, JobW, JobOpenFlap, JobPastingFlap, JobBottomFlap, value.UpsL, value.UpsW, JobTongHeight);

            var finalcost = Number(value.GrantAmount);
            document.getElementById("finalCost").value = finalcost.toFixed(3);
            document.getElementById("finalUnitCost").value = finalcost / Number(document.getElementById("PlanContQty").innerHTML);
            document.getElementById("finalUnitCost").value = Number(document.getElementById("finalUnitCost").value).toFixed(3);
            document.getElementById("TxtFinalQuantity").value = Number(value.FinalQuantity);

            var PrintingImp = value.ImpressionsToBeCharged / value.NoOfSets; // value.NoOfSets;
            var PaperSizeGrid = "Paper (" + value.PaperSize + ")";
            var PrintImpGrid = "Printing Imp'n (" + Number(PrintingImp).toFixed(0) + "x" + value.NoOfSets + ") Sets";
            if (value.UnitPerPacking <= 0) value.UnitPerPacking = 1;
            var PaperQty = Number(Number(value.FullSheets) / value.UnitPerPacking);
            var PaperQuantity = Math.floor(PaperQty);
            var ExtraSheets = Number((PaperQty - PaperQuantity) * value.UnitPerPacking);
            ExtraSheets = ExtraSheets.toFixed(0);
            var TtlString = PaperQuantity + " " + value.Packing + " (" + value.UnitPerPacking + ") and " + ExtraSheets + " Sheets Or " + PaperQty.toFixed(1) + " " + value.Packing;

            $("#MainPaperDetails").text("");
            var TblTr = "<tr><td>" + value.MainPaperName + "</td><td>" + value.MakeReadyWastageSheet + "</td><td>" + value.ActualSheets + "</td><td>" + value.WastageSheets + "</td><td>" + value.TotalPaperWeightInKg + "</td></tr>";
            var tblDiv = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'><strong style='font-size: 13px'>Paper Details:-</strong>" +
                "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
                "<tr><th>Paper Name</th><th>Make Ready Sheets</th><th>Actual Sheets</th><th>Wastage Sheets</th><th>Total Weight in Kg.</th></tr></tr></thead>" +
                "<tbody>" + TblTr + "</tbody></table></div>";
            tblDiv = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'>" + tblDiv + "</div>";

            $('#MainPaperDetails').append(tblDiv);

            document.getElementById("PlanPaperString").innerHTML = TtlString;
            ////$("<div>")
            ////    .addClass("master-detail-caption")
            ////    .text(TtlString)
            ////    .appendTo("#SelectedplanPaper");
            ////$("<div>").appendTo(container)

            var PlanSpeFColor = Number(document.getElementById("PlanSpeFColor").value);
            var PlanSpeBColor = Number(document.getElementById("PlanSpeBColor").value);
            var dataHeads = [];
            var aDataHeads = {};
            aDataHeads.Heads = "Plate";
            aDataHeads.Quantity = value.PlateQty;
            aDataHeads.Rate = value.PlateRate;
            aDataHeads.Amount = Number(value.PlateAmount);
            dataHeads.push(aDataHeads);

            aDataHeads = {};
            aDataHeads.Heads = PaperSizeGrid;
            aDataHeads.Quantity = value.FullSheets;
            aDataHeads.Rate = value.PaperRate;
            aDataHeads.Amount = parseFloat(Number(value.PaperAmount).toFixed(2));
            dataHeads.push(aDataHeads);

            aDataHeads = {};
            aDataHeads.Heads = PrintImpGrid;
            aDataHeads.Quantity = value.ImpressionsToBeCharged;
            aDataHeads.Rate = value.PrintingRate;
            aDataHeads.Amount = parseFloat(Number(value.PrintingAmount).toFixed(2));
            dataHeads.push(aDataHeads);

            if (Number(document.getElementById("PlanSpeFColor").value) > 0) {
                aDataHeads = {};
                aDataHeads.Heads = "Special Color Front";
                aDataHeads.Quantity = PlanSpeFColor;
                aDataHeads.Rate = value.SpeColorFCharges;
                aDataHeads.Amount = Number(value.SpeColorFAmt);
                dataHeads.push(aDataHeads);
            }
            if (Number(document.getElementById("PlanSpeBColor").value) > 0) {
                aDataHeads = {};
                aDataHeads.Heads = "Special Color Back";
                aDataHeads.Quantity = PlanSpeBColor;
                aDataHeads.Rate = value.SpeColorBCharges;
                aDataHeads.Amount = Number(value.SpeColorBAmt);
                dataHeads.push(aDataHeads);
            }
            if (Number(value.MakeReadyRate) > 0) {
                aDataHeads = {};
                aDataHeads.Heads = "Make Readies";
                aDataHeads.Quantity = value.TotalMakeReadies;
                aDataHeads.Rate = value.MakeReadyRate;
                aDataHeads.Amount = Number(value.MakeReadyAmount);
                dataHeads.push(aDataHeads);
            }
            var coat = $("#PlanOnlineCoating").dxSelectBox("instance").option('value');
            if (coat !== "" && coat !== "null" && coat !== null) {
                aDataHeads = {};
                aDataHeads.Heads = "Coating(" + coat + ")";
                aDataHeads.Quantity = value.ActualSheets; //value.ImpressionsToBeCharged;
                aDataHeads.Rate = value.CoatingCharges;
                aDataHeads.Amount = Number(value.CoatingAmount);
                dataHeads.push(aDataHeads);
            }
            if (window.location.pathname.includes("ProjectQuotation.aspx") === true) {
                onChangeCalcAmountp();
            }
            var GridHeadsDetails = $("#GridHeadsDetails").dxDataGrid({
                dataSource: dataHeads,
                allowSorting: false,
                allowColumnResizing: true,
                loadPanel: { enabled: true },
                sorting: {
                    mode: "none" // or "multiple" | "single"
                },
                showRowLines: true,
                showBorders: true,
                //paging: {
                //    pageSize: 6
                //},
                editing: {
                    mode: "cell",
                    allowUpdating: true
                },
                //height: 250,
                height: function () {
                    return window.innerHeight / 2.8;
                },
                onCellClick: function (clickedCell) {
                    if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                        return false;
                    }
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                columns: [{
                    dataField: "Heads", editable: false,
                    alignment: 'left', width: 160,
                    cellTemplate: function (container, options) {
                        $('<div>').text(options.key.Heads).appendTo(container);
                        if (options.key.Heads.includes("Printing") === true && gridData.TblBookForms.length > 0) {
                            $('<div>').addClass('master-detail-label dx-link')
                                .text('Forms Detail')
                                .on('dxclick', function () {
                                    GetPrintingSlabsDetails(value.MachineID, value.PaperGroup, value.CutSize);
                                    this.setAttribute("data-toggle", "modal");
                                    this.setAttribute("data-target", "#myModalforms");
                                }).appendTo(container);
                        } else if (options.key.Heads.includes("Paper")) {
                            $('<div>').addClass('master-detail-label dx-link')
                                .text('Paper Detail')
                                .on('dxclick', function () {
                                    getItemStockDetails(value.PaperID);
                                    this.setAttribute("data-toggle", "modal");
                                    this.setAttribute("data-target", "#myModalPapers");
                                }).appendTo(container);
                        }
                    }
                },
                { dataField: "Quantity", dataType: "number", editable: false, width: 55 },
                { dataField: "Rate", editable: true, width: 45 },
                { dataField: "Amount", caption: "Cost", dataType: "number", editable: false, width: 65 },
                {
                    dataField: "CostPerTh", caption: "Cost/1000", dataType: "number", editable: false, visible: false, width: 70,
                    calculateCellValue: function (e) {
                        var costPerTH = Number(e.Amount / Number(document.getElementById("PlanContQty").innerHTML)) * 1000;
                        return costPerTH.toFixed(3);
                    }
                }, {
                    dataField: "CostPerUnit", caption: "Cost/Unit", dataType: "number", editable: false, width: 60,
                    calculateCellValue: function (e) {
                        if (e.Quantity <= 0) return 0;
                        var costPerUnit = e.Amount / Number(document.getElementById("PlanContQty").innerHTML);
                        return costPerUnit.toFixed(3);
                    }
                }],
                columnAutoWidth: true,
                onEditingStart: function (e) {
                    if (e.column.editable === false) {
                        e.cancel = true;
                    } else
                        e.cancel = false;
                    if (e.data.Heads === "Plate" && e.column.dataField === "Quantity") {
                        e.cancel = false;
                    }
                },
                onRowUpdated: function (e) {
                    var rowData = value;
                    var Cal_Amt_Cost = {};
                    var calAmt = 0;
                    if (e.key.Heads.includes("Plate") === true) {
                        e.key.Amount = e.key.Quantity * e.key.Rate;
                        GblPlanValues.PlateQty = e.key.Quantity;
                        GblPlanValues.PlateRate = e.key.Rate;
                        GblPlanValues.PlateAmount = e.key.Amount;
                    } else if (e.key.Heads.includes("Paper") === true) {
                        //Cal_Amt_Cost = {};
                        //Cal_Amt_Cost.Row = 1;
                        //Cal_Amt_Cost.PaperRateType = value.PaperRateType.toUpperCase();
                        //Cal_Amt_Cost.FullSheets = value.FullSheets;
                        //Cal_Amt_Cost.Rate = e.key.Rate;
                        //Cal_Amt_Cost.TotalPaperWeightInKg = value.TotalPaperWeightInKg;

                        var paperAmt = 0;
                        if (value.PaperRateType.toUpperCase().includes("SHEET") === true) {
                            paperAmt = value.FullSheets * e.key.Rate;
                        } else { //if (value.PaperRateType.toUpperCase() === "KG")
                            paperAmt = value.TotalPaperWeightInKg * e.key.Rate;
                        }
                        e.key.Amount = parseFloat(paperAmt.toFixed(2));
                        GblPlanValues.PaperAmount = parseFloat(paperAmt.toFixed(2));
                        GblPlanValues.PaperRate = e.key.Rate;
                    } else if (e.key.Heads.includes("Printing") && gridData.TblBookForms.length === 0) {
                        Cal_Amt_Cost = {};
                        Cal_Amt_Cost.Row = 2;
                        Cal_Amt_Cost.Machine_Id = rowData.MachineID;
                        Cal_Amt_Cost.Quantity = rowData.ImpressionsToBeCharged;
                        Cal_Amt_Cost.Rate = e.key.Rate;
                        Cal_Amt_Cost.No_Of_Sets = rowData.NoOfSets;
                        Cal_Amt_Cost.F_Color = Number(document.getElementById("PlanFColor").value);
                        Cal_Amt_Cost.B_Color = Number(document.getElementById("PlanBColor").value);
                        Cal_Amt_Cost.Printing_Style = rowData.PrintingStyle;
                        Cal_Amt_Cost.CalType = "";
                        Cal_Amt_Cost.PaperGroup = rowData.PaperGroup;

                        calAmt = CalculateOprAmt(Cal_Amt_Cost);
                        value.PrintingAmount = parseFloat(Number(calAmt).toFixed(2));
                        e.key.Amount = Number(calAmt).toFixed(2);
                        GblPlanValues.PrintingAmount = parseFloat(Number(e.key.Amount).toFixed(2));
                        GblPlanValues.PrintingRate = Number(e.key.Rate);

                    } else if (e.key.Heads.includes("Special Color") === true) {
                        Cal_Amt_Cost = {};
                        Cal_Amt_Cost.Heads = 3;// e.key.Heads;
                        Cal_Amt_Cost.Quantity = e.key.Quantity;
                        Cal_Amt_Cost.Rate = e.key.Rate;
                        Cal_Amt_Cost.ImpToBeCharged = rowData.ImpressionsToBeCharged;
                        Cal_Amt_Cost.No_Of_Sets = rowData.NoOfSets;
                        Cal_Amt_Cost.Machine_Id = rowData.MachineID;

                        calAmt = CalculateOprAmt(Cal_Amt_Cost);
                        e.key.Amount = Number(calAmt).toFixed(2);
                        if (e.key.Heads.includes("Back") === true) {
                            value.SpeColorBAmt = Number(calAmt).toFixed(2);
                            GblPlanValues.SpeColorBAmt = e.key.Amount;
                            GblPlanValues.SpeColorBCharges = e.key.Rate;
                        } else {
                            value.SpeColorFAmt = Number(calAmt).toFixed(2);
                            GblPlanValues.SpeColorFAmt = e.key.Amount;
                            GblPlanValues.SpeColorFCharges = e.key.Rate;
                        }
                    } else if (e.key.Heads.includes("Make Readies") === true) {
                        value.MakeReadyRate = e.key.Rate;
                        e.key.Amount = e.key.Rate * e.key.Quantity;

                        value.MakeReadyAmount = e.key.Amount;
                        GblPlanValues.MakeReadyAmount = e.key.Amount;
                        GblPlanValues.MakeReadyRate = e.key.Rate;
                    } else if (e.key.Heads.includes("Printing") && gridData.TblBookForms.length > 0) {
                        return;
                    } else if (e.key.Heads.includes("Coating") === true) {
                        Cal_Amt_Cost = {};
                        Cal_Amt_Cost.Heads = 5;
                        Cal_Amt_Cost.Machine_Id = rowData.MachineID;
                        Cal_Amt_Cost.Quantity = e.key.Quantity;
                        Cal_Amt_Cost.Rate = e.key.Rate;
                        //Cal_Amt_Cost.SizeL = rowData.ImpressionsToBeCharged;
                        //Cal_Amt_Cost.SizeW = rowData.NoOfSets;
                        Cal_Amt_Cost.SizeL = GblPlanValues.CutSize.split('x')[1] / 25.4;
                        Cal_Amt_Cost.SizeW = GblPlanValues.CutSize.split('x')[0] / 25.4;
                        Cal_Amt_Cost.CoatingName = $("#PlanOnlineCoating").dxSelectBox("instance").option('value');

                        calAmt = CalculateOprAmt(Cal_Amt_Cost);
                        e.key.Amount = Number(calAmt).toFixed(2);

                        GblPlanValues.CoatingCharges = e.key.Rate;
                        GblPlanValues.CoatingAmount = e.key.Amount;
                    }
                    e.component.refresh();

                    var totalAmt = Number(rowData.PlateAmount) + Number(rowData.PaperAmount) + Number(rowData.SpeColorFAmt)
                        + Number(rowData.SpeColorBAmt) + Number(rowData.PrintingAmount) + Number(rowData.MakeReadyAmount) + Number(GblPlanValues.CoatingAmount);
                    rowData.TotalAmount = Number(totalAmt).toFixed(2);
                    GblPlanValues.TotalAmount = rowData.TotalAmount;

                    var finalcost = Number(rowData.OpAmt) + Number(rowData.TotalAmount);
                    value.GrantAmount = finalcost.toFixed(3);
                    document.getElementById("finalCost").value = finalcost.toFixed(3);
                    document.getElementById("finalUnitCost").value = finalcost.toFixed(3) / Number(document.getElementById("PlanContQty").innerHTML);
                    document.getElementById("finalUnitCost").value = Number(document.getElementById("finalUnitCost").value).toFixed(3);

                    drawChartCost(e.component._controllers.data._dataSource._items);
                },
                summary: {
                    totalItems: [{
                        format: "fixedPoint",
                        precision: 3,
                        showInColumn: "Amount",
                        column: "Amount",
                        summaryType: "sum",
                        displayFormat: "₹{0}",
                        alignByColumn: true
                    }, {
                        format: "fixedPoint",
                        precision: 3,
                        showInColumn: "CostPerUnit",
                        column: "CostPerUnit",
                        summaryType: "sum",
                        displayFormat: "₹{0}",
                        alignByColumn: true
                    }]
                }
            }).dxDataGrid('instance');

            var row = 0;
            $("#GridFormsDetails").dxDataGrid({
                dataSource: {
                    store: gridData.TblBookForms,
                    filter: ["PlanID", "=", value.PlanID],
                    reshapeOnPush: true
                },
                columnAutoWidth: true,
                allowSorting: false,
                sorting: {
                    mode: "none" // or "multiple" | "single"
                },
                showRowLines: true,
                showBorders: true,
                paging: {
                    pageSize: 6
                },
                editing: {
                    refreshMode: "full",
                    mode: "cell",
                    allowUpdating: true
                },
                //height: 250,
                onCellClick: function (clickedCell) {
                    if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                        return false;
                    }
                    row = clickedCell.rowIndex;
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                },
                columns: [{
                    dataField: "Forms",
                    cellTemplate: function (container, options) {
                        if (Number(options.data.Sets) > 1) {
                            if (GblPlanValues.PrintingStyle === "Single Side") {
                                $("<div>").append(options.value + " (F)").appendTo(container);
                            } else {
                                $("<div>").append(options.value + " (FB)").appendTo(container);
                            }
                        } else {
                            if (GblPlanValues.PrintingStyle === "Single Side") {
                                $("<div>").append(options.value + " (F)").appendTo(container);
                            } else {
                                if (GblPlanValues.MachineType === "Web Offset") {
                                    $("<div>").append(options.value + " (FB)").appendTo(container);
                                } else {
                                    $("<div>").append(options.value + " (WT)").appendTo(container);
                                }
                            }
                        }
                    },
                    editable: false
                },
                { dataField: "Sets", dataType: "number", editable: false },
                { dataField: "Pages", dataType: "number", editable: false },
                { dataField: "Sheets", dataType: "number", editable: false },
                { dataField: "ImpressionsPerSet", dataType: "number", editable: false },
                { dataField: "ImprsToChargedPerSet", dataType: "number", editable: false },
                { dataField: "SlabRate", dataType: "number", editable: true },
                { dataField: "Amount", caption: "Cost", dataType: "number", editable: false }],
                summary: {
                    recalculateWhileEditing: true,
                    totalItems: [{
                        displayFormat: "{0}",
                        column: "Forms",
                        summaryType: "sum"
                    }, {
                        displayFormat: "{0}",
                        column: "Sets",
                        summaryType: "sum"
                    }, {
                        displayFormat: "{0}",
                        column: "Pages",
                        summaryType: "sum"
                    }, {
                        displayFormat: "{0}",
                        column: "Sheets",
                        summaryType: "sum"
                    }, {
                        displayFormat: "{0}",
                        column: "ImpressionsPerSet",
                        summaryType: "sum"
                    },
                    {
                        displayFormat: "₹{0}",
                        column: "SlabRate",
                        summaryType: "sum"
                    }, {
                        displayFormat: "₹{0}",
                        column: "Amount",
                        summaryType: "sum"
                    }]
                },
                onContentReady: function (e) {
                    if (!e.component._options.dataSource.store) return;
                    if (e.component._options.dataSource.store.length > 0) {
                        value.PrintingAmount = parseFloat(Number(e.component.getTotalSummaryValue("Amount")));
                        if (Number(value.PrintingAmount) > 0) {
                            GblPlanValues.PrintingAmount = parseFloat(Number(value.PrintingAmount).toFixed(2));
                            GridHeadsDetails.cellValue(2, 3, Number(value.PrintingAmount).toFixed(2));
                            GridHeadsDetails.saveEditData();
                            GridHeadsDetails.refresh();
                            drawChartCost(GridHeadsDetails._controllers.data._dataSource._items);
                        }
                    }
                },
                onEditingStart: function (e) {
                    if (e.column.editable === false) {
                        e.cancel = true;
                    } else
                        e.cancel = false;
                },
                onRowUpdated: function (e) {
                    var rowData = value;
                    var Cal_Amt_Cost = {};
                    var calAmt = 0;
                    if (!e.key) return;

                    if (gridData.TblBookForms.length > 0 && e.component._controllers.data._dataSource._items.length > 0) {
                        Cal_Amt_Cost = {};
                        Cal_Amt_Cost.Row = 2;
                        Cal_Amt_Cost.Machine_Id = rowData.MachineID;
                        Cal_Amt_Cost.Quantity = e.key.ImprsToChargedPerSet;
                        Cal_Amt_Cost.Rate = e.key.SlabRate;
                        Cal_Amt_Cost.No_Of_Sets = e.key.Sets;
                        Cal_Amt_Cost.F_Color = Number(document.getElementById("PlanFColor").value);
                        Cal_Amt_Cost.B_Color = Number(document.getElementById("PlanBColor").value);
                        if (row === 0) {
                            Cal_Amt_Cost.Printing_Style = "Front & Back";
                        } else {
                            Cal_Amt_Cost.Printing_Style = rowData.PrintingStyle;
                        }
                        Cal_Amt_Cost.CalType = "Books";
                        Cal_Amt_Cost.PaperGroup = rowData.PaperGroup;

                        calAmt = CalculateOprAmt(Cal_Amt_Cost);
                        e.key.Amount = Number(calAmt).toFixed(2);
                        e.component.refresh();

                        GblPlanValues.PrintingRate = Number(e.key.SlabRate);
                        value.PrintingRate = Number(e.key.SlabRate);
                        GridHeadsDetails.cellValue(2, 2, Number(e.key.SlabRate));
                        //GridHeadsDetails.saveEditData();
                        //GridHeadsDetails.refresh();
                    }
                }
            });

            //var VisibleIndex = 0, Oprstore = [], ObjProcessFilteredData = [];
            var ObjProcessFilteredData = gridData.TblOperations.filter(function (item) {
                return item.PlanID === value.PlanID;
            });
            var dataFieldName = "IsDisplay";
            if (window.location.href.toUpperCase().includes("DYNAMICQTY")) {
                dataFieldName = "IsDisplay";
            } else {
                dataFieldName = "PaperConsumptionRequired";
            }
            var gridOpr = $("#GridOperationDetails").dxDataGrid({
                dataSource: {
                    store: ObjProcessFilteredData,
                    filter: ["PlanID", "=", value.PlanID]
                    //reshapeOnPush: true
                },
                selection: { mode: 'single' },
                showRowLines: true,
                showBorders: true,
                allowSorting: false,
                sorting: {
                    mode: "none" // or "multiple" | "single"
                },
                loadPanel: { enabled: true },
                height: function () {
                    return window.innerHeight / 2.8;
                },
                rowDragging: {
                    allowReordering: true,
                    onReorder: function (e) {
                        var visibleRows = e.component.getVisibleRows(),
                            toIndex = ObjProcessFilteredData.indexOf(visibleRows[e.toIndex].data),
                            fromIndex = ObjProcessFilteredData.indexOf(e.itemData);

                        ObjProcessFilteredData.splice(fromIndex, 1);
                        ObjProcessFilteredData.splice(toIndex, 0, e.itemData);

                        e.component.refresh();
                    }
                },
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                    if (e.rowType === "data") {
                        if (Number(e.data.Rate) < Number(e.data.MasterRate)) {
                            e.rowElement.css('background', '#f94a4abf');
                        } else if (Number(e.data.Rate) > Number(e.data.MasterRate)) {
                            e.rowElement.css('background', '#5ae25aa6');
                        }
                    }
                },
                //height: 250,
                //onCellClick: function (clickedCell) {
                //    if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                //        return false;
                //    }
                //},
                onContentReady: function (e) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    //var ChkPlanMaster = $("#ChkUseFirstPlanAsMaster").dxCheckBox('instance').option('value');
                    //if (ChkPlanMaster === true) {
                    //    $("#btnApplyCost").click();
                    //}
                    CalculateFinalAmt();
                },
                //stateStoring: {
                //    enabled: true,
                //    type: "localStorage",
                //    storageKey: "storageOpr"
                //},
                allowColumnResizing: true,
                columnAutoWidth: true,
                editing: {
                    mode: "cell",
                    allowUpdating: true
                },
                columns: [{ dataField: "ProcessID", visible: false, width: 0 },
                {
                    dataField: "ProcessName", allowEditing: false,
                    width: 160
                }, { dataField: "RateFactor", allowEditing: false, visible: false },
                { dataField: "TypeofCharges", visible: true, allowEditing: false, width: 120 },
                {
                    caption: "Advance Calculate", allowEditing: false,
                    cellTemplate: function (container, options) {
                        var editP = "";
                        if (options.key.SizeToBeConsidered === "None" || options.key.SizeToBeConsidered === null || options.key.SizeToBeConsidered === "") {
                            editP = "Qty:" + options.key.Quantity;
                        } else {
                            editP = options.key.SizeW + 'x' + options.key.SizeL + ',Qty:' + options.key.Quantity;
                        }
                        $('<div>').addClass('master-detail-label dx-link')
                            .text(editP)
                            .on('dxclick', function () {
                                OprData = options;
                                var result = $.grep(GblTypesOfC, function (e) { return e.TypeOfCharges === options.key.TypeofCharges; });
                                if (result.length === 1) {
                                    //found
                                    var newdata = result[0];
                                    document.getElementById("OperationEditP").innerHTML = "";
                                    if (newdata.FormulaVariables !== "" && newdata.FormulaVariables !== null) {
                                        var ObjData = newdata.FormulaVariables.split(',');
                                        for (var i = 0; i < ObjData.length; i++) {
                                            var labltext = ObjData[i];
                                            var valuetext = Number(options.key[ObjData[i]]);
                                            if (newdata.TypeOfCharges.includes("PerBoxWt")) {
                                                if (labltext === "NoOfPass" && valuetext <= 1) valuetext = 15;
                                                if (labltext === "NoOfPass") labltext = "Per Box Wt";
                                                if (labltext === "Quantity") {
                                                    var TtlPaperWt = GblTotalPaperWt + Number(GblPlanValues.TotalPaperWeightInKg);
                                                    labltext = "Box Qty";
                                                    valuetext = Math.ceil(Number(TtlPaperWt) / OprData.key.NoOfPass);
                                                }
                                            } else if (newdata.TypeOfCharges.includes("Calendar-Inch")) {
                                                if (labltext === "SizeL" && valuetext <= 0) valuetext = Number(GblInputValues.SizeLength) / 25.4;  /*&& valuetext <= Number(GblInputValues.SizeLength) / 25.4*/
                                                if (labltext === "SizeL") labltext = "Unit SizeL";
                                            }

                                            var fieldContainer = '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="float:left;margin-bottom:0px;">' +
                                                '<label style="float: left; width: 100%;">' + labltext + '</label><br />' +
                                                '<input id=' + ObjData[i] + ' type="text" class="forTextBox" onkeypress="return isNumber(event, this);" value="' + valuetext + '" /><br /><div style="min-height:20px;float:left;width:100%"></div></div>';

                                            $("#OperationEditP").append(fieldContainer);
                                        }
                                        this.setAttribute("data-toggle", "modal");
                                        this.setAttribute("data-target", "#ModalOperationEdit");
                                    }
                                }
                            }).appendTo(container);
                    }
                },
                { dataField: "Quantity", caption: "Qty", visible: false, allowEditing: false, width: 50 },
                {
                    dataField: "SizeW", caption: "Size W", visible: false, allowEditing: false, width: 50,
                    calculateCellValue: function (e) {
                        if (e.SizeToBeConsidered === "None" || e.SizeToBeConsidered === null || e.SizeToBeConsidered === "") {
                            return "None";
                        } else
                            return e.SizeW;
                    }
                }, {
                    dataField: "SizeL", caption: "Size L", visible: false, width: 50, allowEditing: false,
                    calculateCellValue: function (e) {
                        if (e.SizeToBeConsidered === "None" || e.SizeToBeConsidered === null || e.SizeToBeConsidered === "") {
                            return "None";
                        } else
                            return e.SizeL;
                    }
                }, {
                    dataField: "Ups", width: 50, visible: false, allowEditing: false,
                    calculateCellValue: function (e) {
                        if (value.TotalUps < e.Ups) {
                            return value.TotalUps;
                        } else
                            return e.Ups;
                    }
                }, { dataField: "NoOfPass", caption: "Pass", visible: false, allowEditing: false, width: 50 },
                {
                    dataField: "Rate", width: 40, allowEditing: true,
                    //format: {
                    //    type: "decimal", // one of the predefined formats
                    //    precision: 3 // the precision of values                    
                    //},
                    calculateCellValue: function (rowData) {
                        try {
                            if (!value) return 0;
                            var NoOfForms = $("#GridFormsDetails").dxDataGrid('instance').getTotalSummaryValue("Forms");
                            var JobNoOfPages = Number(document.getElementById("JobNoOfPages").value);
                            if (NoOfForms <= 0 || NoOfForms === undefined) NoOfForms = 1; //as per vivek sir 20-04-2019 at lovely
                            var TtlPaperWt = GblTotalPaperWt + Number(GblPlanValues.TotalPaperWeightInKg);
                            var TtlNoOfForms = GblTotalForms + Number(NoOfForms);
                            document.getElementById("LblTtlPaperWtInKG").innerHTML = "Total Paper(KG): " + Number(TtlPaperWt);

                            var result = $.grep(GblTypesOfC, function (e) { return e.TypeOfCharges === rowData.TypeofCharges; });
                            if (result.length === 1) {
                                //found
                                var newdata = result[0];
                                if (rowData.TypeofCharges.includes("PerBoxWt")) {
                                    if (rowData.NoOfPass <= 1) rowData.NoOfPass = 15;
                                } else if (rowData.TypeofCharges.includes("Calendar-Inch")) {
                                    if (rowData.SizeL <= 0) rowData.SizeL = Number(GblInputValues.SizeLength) / 25.4;
                                }
                                if (newdata.CalculationFormula !== "") {
                                    rowData.Amount = eval(newdata.CalculationFormula);
                                    if (rowData.MinimumCharges > Number(rowData.Amount)) {
                                        rowData.Amount = rowData.MinimumCharges;
                                    }
                                }
                            }
                            return rowData.Rate;
                        } catch (e) {
                            return rowData.Rate;
                        }
                    }
                }, { dataField: "MasterRate", width: 0, visble: false, allowEditing: false },
                {
                    dataField: "Amount", caption: "Cost", width: 80, allowEditing: false,
                    alignment: "right", format: {
                        type: "decimal", // one of the predefined formats
                        precision: 3 // the precision of values                    
                    },
                    calculateCellValue: function (e) {
                        return e.Amount;
                    }
                },
                {
                    dataField: "Remarks", allowEditing: true,
                    width: 120
                },
                { dataField: "Pieces", allowEditing: false, visible: false }, { dataField: "PlanID", allowEditing: false, visible: false },
                { dataField: "NoOfStitch", allowEditing: false, visible: false }, { dataField: "NoOfLoops", allowEditing: false, visible: false }, { dataField: "NoOfColors", allowEditing: false, visible: false }, { dataField: dataFieldName, allowEditing: true, dataType: "boolean" }],
                //onEditingStart: function (e) {
                //    var Col_No = e.column.visibleIndex;
                //    if (e.column.dataField === "Rate" || e.column.dataField === "Quantity" || e.column.dataField === "Ups" || e.column.dataField === "NoOfPass" || e.column.dataField === "Remarks") {
                //        e.cancel = false;
                //        return;
                //    }
                //    if (e.column.dataField === "SizeL" || e.column.dataField === "SizeW") {
                //        if (e.data.SizeToBeConsidered === "None" || e.data.SizeToBeConsidered === null || e.data.SizeToBeConsidered === "") {
                //            e.cancel = true;
                //        } else
                //            e.cancel = false;
                //    } else
                //        e.cancel = true;
                //},
                onRowUpdated: function (e) {
                    e.component.refresh();

                    value.OpAmt = e.component.getTotalSummaryValue("Amount");
                    GblPlanValues.OpAmt = value.OpAmt;

                    var finalcost = Number(value.OpAmt) + Number(value.TotalAmount);
                    value.GrantAmount = finalcost.toFixed(3);
                    document.getElementById("finalCost").value = finalcost.toFixed(3);
                    document.getElementById("finalUnitCost").value = finalcost.toFixed(3) / Number(document.getElementById("PlanContQty").innerHTML);
                    document.getElementById("finalUnitCost").value = Number(document.getElementById("finalUnitCost").value).toFixed(3);
                },
                summary: {
                    totalItems: [{
                        format: "fixedPoint",
                        precision: 3,
                        showInColumn: "Amount",
                        column: "Amount",
                        summaryType: "sum",
                        displayFormat: "₹{0}",
                        alignByColumn: true
                    }]
                }
                //onSelectionChanged: function (selectedItems) {
                //    if (selectedItems === undefined || selectedItems.selectedRowsData.length <= 0) return;
                //    Oprstore = selectedItems.component._options.dataSource.store;
                //    try {
                //        //Oprstore = Oprstore.filter(function (item) {
                //        //    return item.PlanID === value.PlanID;
                //        //});
                //        //Oprstore = $.grep(Oprstore, function (e) { return e.PlanID === value.PlanID; });
                //    } catch (e) {
                //        alert(e);
                //    }
                //    var keys = selectedItems.component.getSelectedRowKeys();
                //    for (var i = 0; i < keys.length; i++) {
                //        VisibleIndex = gridOpr.getRowIndexByKey(keys[i]);
                //    }
                //}
            }).dxDataGrid('instance');

            //call after some time for summary of amount in operations
            window.setTimeout(function () {
                var grid = $("#GridOperationDetails").dxDataGrid('instance');
                grid.refresh();
                CalculateFinalAmt();
            }, 100);
            //var lclGridOperItems = $("#GridOperationDetails").dxDataGrid('instance')._controllers.columns._dataSource._items;

            ////aDataHeads = {};
            ////aDataHeads.Heads = "All Process";
            ////aDataHeads.Quantity =0;
            ////aDataHeads.Rate = 0;
            ////aDataHeads.Amount = Number(value.OpAmt);
            ////dataHeads.push(aDataHeads);

            drawChartCost(dataHeads);

            //$("#OperMoveUp").click(function () {
            //    if (VisibleIndex <= 0 || VisibleIndex === undefined || Oprstore.length <= 0) return;
            //    gridOpr._options.dataSource.store = array_move(Oprstore, VisibleIndex, VisibleIndex - 1);
            //    VisibleIndex = VisibleIndex - 1;
            //    //gridOpr.clearSelection();
            //    gridOpr.refresh();
            //});

            //$("#OperMoveDown").click(function () {
            //    if (Oprstore.length <= 0) return;
            //    if (VisibleIndex === Oprstore.length - 1 || VisibleIndex === undefined) return;
            //    gridOpr._options.dataSource.store = array_move(Oprstore, VisibleIndex, VisibleIndex + 1);
            //    VisibleIndex = VisibleIndex + 1;
            //    //gridOpr.clearSelection();
            //    gridOpr.refresh();
            //});

            const svg = document.getElementById("Layout_Ups").innerHTML;
            svgToPng(svg, (imgData) => {
                GblPlanValues.UpsLayout = imgData.replace("data:image/png;base64,", '');
            });

            const svgSheet = document.getElementById("Layout_Sheet").innerHTML;
            svgToPng(svgSheet, (imgData) => {
                GblPlanValues.SheetLayout = imgData.replace("data:image/png;base64,", '');
                $("a[name='nameApplyCost']").show();
            });

        }
    });
}

function drawChartCost(dataSource) {
    var legendSettings = {
        orientation: "horizontal",
        itemTextPosition: "right",
        horizontalAlignment: "center",
        verticalAlignment: "bottom",
        columnCount: 4
    };
    $(function () {
        $("#PlanChartLayout").dxPieChart({
            size: {
                width: 250
            },
            palette: "bright",
            dataSource: dataSource,
            //legend: legendSettings,
            legend: {
                visible: false
            },
            //resolveLabelOverlapping: "hide",
            "export": {
                enabled: false
            },
            //commonSeriesSettings: {
            //    label: {
            //        visible: true
            //    }
            //},
            tooltip: {
                enabled: true,
                format: "currency",
                customizeTooltip: function () {
                    return /*this.argumentText + ": " +*/ this.percentText;
                }
            },
            series: [{
                argumentField: "Heads",
                valueField: "Amount",
                label: {
                    visible: true,
                    font: {
                        size: 10
                    },
                    connector: {
                        visible: true,
                        width: 0.5
                    },
                    position: "columns",
                    customizeText: function (arg) {
                        return /*this.argumentText + ": " +*/ arg.percentText;
                    }
                }
            }]
        });

        $("#ZoomChartLayout").dxPieChart({
            size: {
                width: function () {
                    return window.innerWidth / 1.9;
                }
            },
            palette: "bright",
            dataSource: dataSource,
            margin: {
                bottom: 10
            },
            legend: {
                orientation: "horizontal",
                itemTextPosition: "right",
                horizontalAlignment: "right",
                verticalAlignment: "bottom",
                columnCount: 4
            },
            animation: {
                enabled: true
            },
            resolveLabelOverlapping: "none",
            //title: "Area of Heads",
            "export": {
                enabled: false
            },
            series: [{
                argumentField: "Heads",
                valueField: "Amount",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 0.5
                    },
                    position: "columns",
                    customizeText: function (arg) {
                        return arg.percentText; ////arg.argumentText + " ( " + arg.percentText + ")";
                    }
                }
            }]
        });

        //$("#PlanChartLayout").dxPieChart({
        //    palette: "bright",
        //    dataSource: dataSource,
        //    legend: legendSettings,
        //    resolveLabelOverlapping: "hide",
        //    "export": {
        //        enabled: true
        //    },
        //    series: [{
        //        argumentField: "Heads",
        //        valueField: "Amount",
        //        label: {
        //            visible: true,
        //            font: {
        //                size: 10
        //            },
        //            connector: {
        //                visible: true,
        //                width: 0.5
        //            },
        //            position: "columns",
        //            customizeText: function (arg) {
        //                return arg.percentText;
        //            }
        //        }
        //    }]
        //});

    });
}

try {

    $.ajax({
        type: 'POST',
        url: "WebServicePlanWindow.asmx/GetTypeOfCharges",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            GblTypesOfC = JSON.parse(res.toString());
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });

} catch (e) {
    //alert(e);
}

function GetCategorizedProcess(CategoryID, ContName) {
    $.ajax({
        type: 'POST',
        async: false,
        url: "WebServicePlanWindow.asmx/LoadDefaultOperations",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{'CategoryID': " + CategoryID + ",ContName:" + JSON.stringify(ContName) + "}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());
            //ObjDefaultProcess = RES1;
            //if (RES1.length > 0) {
            //    $("#GridOperation").dxDataGrid({ dataSource: { store: { type: "array", data: $.grep(RES1, function (e) { return e.IsDefaultProcess === false || e.IsDefaultProcess === 0; }), key: "ProcessID" } } });
            //}
            //ObjDefaultProcess = $.grep(RES1, function (e) { return e.IsDefaultProcess === true || e.IsDefaultProcess === 1; });
        },
        error: function errorFunc(jqXHR) {
            // alert(jqXHR.message);
        }
    });
}

var OprIds = [];

function ShowOperationGrid(dataSource, slabNames) {
    $("#GridOperation").dxDataGrid({                  //// GridOperation  gridopr
        dataSource: {
            store: {
                type: "array",
                data: dataSource,
                key: "ProcessID"
            }
        },
        allowEditing: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        columnAutoWidth: true,
        sorting: { mode: 'multiple' },
        columns: [{ dataField: "ProcessName", caption: "Suggested Process" },
        {
            dataField: "Rate", width: 50
            //format: {
            //    type: "decimal", // one of the predefined formats
            //    precision: 3 // the precision of values                    
            //}
        },
        { dataField: "TypeofCharges" },
        { dataField: "SizeToBeConsidered", caption: "Size Cons", width: 80 },
        { dataField: "MinimumCharges", visible: false },
        { dataField: "SetupCharges", visible: false },
        { dataField: "PrePress", visible: false },
        { dataField: "ChargeApplyOnSheets", visible: false },
        {
            dataField: "RateFactor", fixedPosition: "right", fixed: true, visible: false,
            lookup: {
                dataSource: function (options) {
                    return {
                        store: slabNames,
                        filter: options.data ? ["ProcessID", "=", options.data.ProcessID] : null
                    };
                },
                displayExpr: "RateFactor",
                valueExpr: "RateFactor"
            },
            width: 120
        },
        {
            dataField: "AddRow", caption: "Add", visible: true, fixedPosition: "right", fixed: true, width: 40,
            cellTemplate: function (container, options) {
                $('<div title="' + options.data.ProcessName + '">').addClass('fa fa-plus customgridbtn').appendTo(container);
            }
        }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        onEditingStart: function (e) {
            if (e.column.dataField === "RateFactor") {
                e.cancel = false;
            } else {
                e.cancel = true;
            }
        },
        //selection: {
        //    mode: 'single',
        //    //showCheckBoxesMode: "always",
        //    //allowSelectAll: false
        //},
        //selectedRowKeys: [$("#OperId").text()],
        showRowLines: true,
        showBorders: true,
        loadPanel: {
            enabled: true
        },
        scrolling: {
            mode: 'infinite'
        },
        columnFixing: { enabled: true },
        filterRow: { visible: true },
        height: function () {
            return window.innerHeight / 2.2;
        },
        onCellClick: function (clickedCell) {
            if (clickedCell.rowType === undefined) return;
            if (clickedCell.rowType === "header" || clickedCell.rowType === "filter") {
                return false;
            }
            if (clickedCell.column.caption === "Add") {
                try {

                    var dataGrid = $('#GridOperationAllocated').dxDataGrid('instance');

                    var result = $.grep(dataGrid._options.dataSource, function (e) { return e.ProcessID === clickedCell.data.ProcessID && clickedCell.data.RateFactor === e.RateFactor; });
                    if (result.length > 0) {
                        DevExpress.ui.notify("Duplicate process found..!", "warning", 1000);
                        return;
                    }
                    var newdata = [];
                    newdata.ProcessID = clickedCell.data.ProcessID;
                    newdata.ProcessName = clickedCell.data.ProcessName;
                    newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                    newdata.RateFactor = clickedCell.data.RateFactor;

                    var clonedItem = $.extend({}, newdata);
                    dataGrid._options.dataSource.splice(dataGrid.totalCount(), 0, clonedItem);
                    dataGrid.refresh(true);

                    OprIds.push(clickedCell.data.ProcessID);

                    //dataGrid._events.preventDefault();
                    DevExpress.ui.notify("Process added..!", "success", 1000);
                    //clickedCell.component.clearFilter();

                    // TO REMOVE FROM THIS GRID
                    clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                    clickedCell.component.deleteRow(clickedCell.rowIndex);

                    if (GblPlanValues.PlanID === undefined) return;
                    var dataGridPlan = $('#GridOperationDetails').dxDataGrid('instance');
                    //var selectedPlanRows = dataGrid.getSelectedRowsData();

                    newdata = clickedCell.data;
                    newdata.SizeL = GblPlanValues.CutSize.split('x')[1] / 25.4;
                    newdata.SizeW = GblPlanValues.CutSize.split('x')[0] / 25.4;
                    newdata.SizeL = newdata.SizeL.toFixed(2);
                    newdata.SizeW = newdata.SizeW.toFixed(2);
                    newdata.MaximumL = 0;
                    newdata.MaximumW = 0;
                    newdata.Amount = 0;
                    newdata.Quantity = Number(document.getElementById("PlanContQty").innerHTML);
                    newdata.Ups = GblPlanValues.TotalUps;
                    newdata.NoOfPass = 1;
                    newdata.Remarks = '';

                    clonedItem = $.extend({}, newdata, { PlanID: GblPlanValues.PlanID });
                    dataGridPlan._options.dataSource.store.data.splice(dataGridPlan.totalCount(), 0, clonedItem);
                    dataGridPlan.refresh(true);

                    DevExpress.ui.notify("Process added in selected plan..!", "success", 1000);


                    //call after some time for summary of amount in operations
                    window.setTimeout(function () {
                        var grid = $("#GridOperationDetails").dxDataGrid('instance');

                        grid.refresh();
                        CalculateFinalAmt();
                    }, 1000);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        onRowPrepared: function (e) {
            setDataGridRowCss(e);
        }
        ////onSelectionChanged: function (selectedItems) {
        ////    var data = selectedItems.selectedRowsData;
        ////    if (data.length > 0) {
        ////        $("#OperId").text(
        ////            $.map(data, function (value) {
        ////                return value.ProcessID;    //alert(value.ProcessID);
        ////            }).join(','));
        ////        try {

        ////            if (GblPlanValues.PlanID === undefined) return;
        ////            var dataGrid = $('#GridOperationDetails').dxDataGrid('instance');
        ////            //var selectedPlanRows = dataGrid.getSelectedRowsData();
        ////            var result = $.grep(data, function (e) { return e.ProcessID === selectedItems.currentSelectedRowKeys[0]; });

        ////            //if (selectedItems.currentDeselectedRowKeys[0] >= 0) {
        ////            //    var kIndex = dataGrid.getRowIndexByKey(selectedItems.currentDeselectedRowKeys[0]);
        ////            //    if (kIndex !== -1) {
        ////            //        dataGrid.deleteRow(kIndex);
        ////            //    }
        ////            //    DevExpress.ui.notify("Operation removed in selected plan..!", "error", 1000);
        ////            //}
        ////            if (result.length === 0) {
        ////                // not found
        ////            } else if (result.length === 1) {
        ////                var newdata = result[0];
        ////                newdata.SizeL = GblPlanValues.CutSize.split('x')[1] / 25.4;
        ////                newdata.SizeW = GblPlanValues.CutSize.split('x')[0] / 25.4;
        ////                newdata.SizeL = newdata.SizeL.toFixed(2);
        ////                newdata.SizeW = newdata.SizeW.toFixed(2);
        ////                newdata.MaximumL = 0;
        ////                newdata.MaximumW = 0;
        ////                newdata.Amount = 0;
        ////                newdata.Quantity = Number(document.getElementById("PlanContQty").innerHTML);
        ////                newdata.Ups = GblPlanValues.TotalUps;
        ////                newdata.NoOfPass = 1;
        ////                newdata.Remarks = '';
        ////                // access the foo property using result[0]
        ////                var clonedItem = $.extend({}, newdata, { PlanID: GblPlanValues.PlanID });
        ////                dataGrid._options.dataSource.store.splice(dataGrid.totalCount(), 0, clonedItem);
        ////                dataGrid.refresh(true);
        ////                //dataGrid._events.preventDefault();
        ////                DevExpress.ui.notify("Operation added..!", "success", 1000);
        ////            } else {
        ////                // multiple items found
        ////            }
        ////        } catch (e) {
        ////            alert(e);
        ////        }
        ////    }
        ////    else {
        ////        $("#OperId").text("");
        ////        try {

        ////            //if (selectedItems.currentDeselectedRowKeys[0] >= 0) {
        ////            //    var eGrid = $('#GridOperationDetails').dxDataGrid('instance');
        ////            //    eGrid.getDataSource().store().remove(selectedItems.currentDeselectedRowKeys[0]);
        ////            //    //eGrid._options.dataSource.store().remove(selectedItems.currentDeselectedRowKeys[0]);
        ////            //    eGrid.refresh();
        ////            //    //var kInd = eGrid.getRowIndexByKey(selectedItems.currentDeselectedRowKeys[0]);
        ////            //    //if (kInd !== -1) {
        ////            //    //    eGrid.deleteRow(kInd);
        ////            //    //}
        ////            //    DevExpress.ui.notify("Operation removed from selected plan..!", "error", 1000);
        ////            //}

        ////        } catch (e) {
        ////            console.log(e);
        ////        }
        ////    }
        ////}
    });
}

$("#GridOperationAllocated").dxDataGrid({
    dataSource: [],
    columnAutoWidth: true,
    allowColumnResizing: true,
    sorting: { mode: 'none' },
    columns: [{ dataField: "ProcessName", caption: "Default Process" },
    {
        dataField: "Rate"
        //format: {
        //    type: "decimal", // one of the predefined formats
        //    precision: 3 // the precision of values                    
        //}
    },
    { dataField: "RateFactor", visible: false },
    {
        dataField: "Delete", fixedPosition: "right", fixed: true, width: 50,
        cellTemplate: function (container, options) {
            $('<div style="color:red;">').addClass('fa fa-remove customgridbtn').appendTo(container);
        }
    }],
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
                var dataGrid = $('#GridOperation').dxDataGrid('instance');
                var newdata = [];
                newdata.ProcessID = clickedCell.data.ProcessID;
                newdata.ProcessName = clickedCell.data.ProcessName;
                newdata.Rate = Number(clickedCell.data.Rate).toFixed(3);
                newdata.RateFactor = clickedCell.data.RateFactor;

                var clonedItem = $.extend({}, newdata);
                dataGrid._options.dataSource.store.data.splice(dataGrid.totalCount(), 0, clonedItem);
                dataGrid.refresh(true);

                clickedCell.component._options.editing.texts.confirmDeleteMessage = "";
                clickedCell.component.deleteRow(clickedCell.rowIndex);
                //clickedCell.component.refresh(true);
                var index = OprIds.indexOf(clickedCell.data.ProcessID);
                if (index > -1) {
                    OprIds.splice(index, 1);
                    DevExpress.ui.notify("Process removed..!", "error", 1000);
                }

                if (GblPlanValues.PlanID === undefined) return;
                var dataGridc = $('#GridOperationDetails').dxDataGrid('instance');

                dataGridc._options.editing.texts.confirmDeleteMessage = "";
                dataGridc.deleteRow(clickedCell.rowIndex);

                DevExpress.ui.notify("Process removed in selected plan..!", "error", 1000);
            } catch (e) {
                console.log(e);
            }
        }
    },
    height: function () {
        return window.innerHeight / 2.2;
    },
    onRowPrepared: function (e) {
        setDataGridRowCss(e);
    }
});

function CalculateOprAmt(Cal_Amt_Cost) {
    var data = 0;
    var Cal_Amt = [];
    Cal_Amt.push(Cal_Amt_Cost);
    var Cal_Amt_Oper = JSON.stringify(Cal_Amt);
    $.ajax({
        async: false,
        type: "POST",
        url: "Api_shiring_service.asmx/Amount_Calculation",
        data: '{Cal_Amt_Oper:' + Cal_Amt_Oper + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            res = Number(res);
            res = res.toFixed(2);
            return data = res;
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
            return 0;
        }
    });
    return data;
}

$("#btnApplyCost").click(function () {

    if (Number(document.getElementById("finalCost").value) <= 0 || isNaN(document.getElementById("finalCost").value)) {
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
    //var dataGrid = $('#ContentPlansList').dxDataGrid('instance');
    //var selectedPlanRows = dataGrid.getSelectedRowsData();
    //selectedPlanRows = dataGrid.option("dataSource");
    ////alert(Object.getOwnPropertyNames(selectedPlanRows));
    //GblPlanValues = selectedPlanRows;

    if (GblPlanValues === []) {
        alert("Empty selection\nPlease select plan");
        return;
    }
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var lclGridOperItems = $("#GridOperationDetails").dxDataGrid('instance')._controllers.data._dataSource._items;
        var lclGridForms = $("#GridFormsDetails").dxDataGrid('instance')._controllers.data._dataSource._items;

        var procCost = $("#GridOperationDetails").dxDataGrid('instance').getTotalSummaryValue("Amount");
        var displayStatusBottom = document.getElementById("displayStatusBottom").innerHTML.trim().split(/(\d+)/);
        var unitCost = Number(Number(document.getElementById("finalCost").value) / Number(document.getElementById("PlanContQty").innerHTML)).toFixed(3);

        document.getElementById("Plan" + displayStatusBottom[1]).innerHTML = ""; // "Paper Cost:₹0 \nPrinting Cost:₹0\nProcess Cost:₹0\nTotal Amount: ₹" + document.getElementById("finalCost").value +"\nUnit Price:₹0";
        //var divPara = '<div style="padding: 0em;font-size:10px;"><div class="table-responsive" style="margin-bottom: 0em"><div class="table table-hover dashboard-task-infos" style="margin-top: 0em;margin-bottom:0px;background: transparent;"><div><div><div style="padding: 2px;font-size:11px;">Paper:₹ </div><div style="padding: 2px;font-size:11px;">' + GblPlanValues.PaperAmount + '</div></div>' +
        //    '<div><div style="padding: 2px;font-size:11px;">Printing:₹ </div><div style="padding: 2px;font-size:11px;">' + Number(GblPlanValues.PrintingAmount).toFixed(2) + '</div></div><div><div style="padding: 2px;font-size:11px;">Process:₹ </div><div style="padding: 2px;font-size:11px;">' + procCost.toFixed(2) + '</div></div><div><div style="padding: 2px;font-size:11px;">Total:₹ </div><div style="padding: 2px;font-size:11px;"><span id="finalCstSpan' + displayStatusBottom[1] + '" class="th">' + Number(document.getElementById("finalCost").value).toFixed(2) + '</span></div></div><div><div style="padding: 2px;font-size:11px;">Unit:₹ </div><div style="padding: 2px;font-size:11px;">' + unitCost + '</div></div><div style="display:none"><div style="padding: 2px;font-size:11px;;">Unit/1000:₹ </div><div style="padding: 2px;font-size:11px;">' + Number(Number(unitCost) * 1000).toFixed(3) + '</div></div></div></div></div></div>';
        var divPara = '<div style="margin-top: 0em; margin-bottom: 0px;pointer-events: none; background: transparent;"><div hidden ><div style="padding: 2px; font-size: 11px;">Paper:₹' + GblPlanValues.PaperAmount + ' </div></div><div hidden ><div style="padding: 2px; font-size: 11px;">Printing:₹' + Number(GblPlanValues.PrintingAmount).toFixed(2) + ' </div></div><div hidden ><div style="padding: 2px; font-size: 11px;">Process:₹' + procCost.toFixed(2) + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Total:₹ <span id="finalCstSpan' + displayStatusBottom[1] + '" class="th">' + Number(document.getElementById("finalCost").value).toFixed(2) + '</span></div>' +
            '</div > <div><div style="padding: 2px; font-size: 11px;">Unit:₹ ' + unitCost + '</div></div> <div style="display: none"><div style="padding: 2px; font-size: 11px;">Unit/1000:₹' + Number(Number(unitCost) * 1000).toFixed(3) + ' </div></div></div >';
        document.getElementById("Plan" + displayStatusBottom[1]).innerHTML = divPara;

        ///////////////04072019
        //var doctype = '<?xml version="1.0" standalone="no"?>'
        //    + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
        //var source = (new XMLSerializer()).serializeToString(document.getElementById("Layout_Ups"));
        //var blob = new Blob([doctype + source], { type: 'image/svg+xml' });
        //var url = window.URL.createObjectURL(blob);
        //var img = new Image();
        //img.src = url;

        //const svg = document.getElementById("Layout_Ups").innerHTML;

        //svgToPng(svg, (imgData) => {
        //    //const pngImage = document.createElement('img');
        //    //document.body.appendChild(pngImage);
        //    //pngImage.src = imgData;
        //    GblPlanValues.UpsLayout = imgData;
        //});


        //var sourceSheet = (new XMLSerializer()).serializeToString(document.getElementById("Layout_Sheet"));
        ////var blobSheet = new Blob([doctype + sourceSheet], { type: 'image/svg+xml' });
        ////var urlSheet = window.URL.createObjectURL(blobSheet);
        ////var imgSheet = new Image();
        ////imgSheet.src = urlSheet;

        //GblPlanValues.UpsLayout = source;
        //GblPlanValues.SheetLayout = sourceSheet;

        ///////////////
        removeContentQtyWise(GblPlanValues, lclGridOperItems, lclGridForms);
        //        GblInputValues.OperId = $("#OperId").text();
        saveContentsSizeValues(GblInputValues);
        saveContentsOprations(GblInputOpr);

        closeBottomTabBar();

        var colS = displayStatusBottom[1].charAt(1);
        //document.getElementById("FinaltotalCost" + colS).innerHTML = Number(document.getElementById("FinaltotalCost" + colS).innerHTML) + Number(document.getElementById("finalCstSpan" + displayStatusBottom[1]).innerHTML);
        onChangeCalcAmount("FinalDiscPer0");
        //sumAllCost(colS);
        document.getElementById("finalCost").value = 0;
        document.getElementById("finalUnitCost").value = 0;
        document.getElementById("txtqty" + colS).disabled = true;
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

$("#BtnSaveQuotation").click(function () {
    readAllSelectedPlans();
});

/**
 * Booking data save to database
 * @param {Object} TblPlanning as plans
 * @param {Object} TblOperations as operations
 * @param {Object} TblContentForms as forms
 */
function callSaveQuote(TblPlanning, TblOperations, TblContentForms) {

    if (TblPlanning.length <= 0) {
        DevExpress.ui.notify("No data for save..!", "error", 400);
        return;
    }
    var JobName = document.getElementById("JobName").value.trim();
    var ArtWorkCode = document.getElementById("ArtWorkCode").value.trim();
    var TaQuoteDetails = document.getElementById("TaQuoteDetails").value.trim();
    var Remark = document.getElementById("TaRemark").value.trim();
    var TypeOfCost = document.getElementById("HTypeOfCost").value.trim();
    var FinalCost = Number(document.getElementById("HFinalCost").value.trim());
    var QuotedCost = Number(document.getElementById("HQuotedCost").value);

    var LedgerId = $("#SbClientName").dxSelectBox("instance").option('value');   // integer Value
    var ClientName = $("#SbClientName").dxSelectBox("instance").option('text');
    var CategoryId = $("#SbCategory").dxSelectBox("instance").option('value');   // integer Value
    var SbConsigneeID = $("#SbConsigneeName").dxSelectBox("instance").option('value');
    var SbProductHSNID = $("#SbHSNGroups").dxSelectBox("instance").option('value');
    var SbCurrency = $("#SbCurrency").dxSelectBox("instance").option('value');
    var CurrencyValue = Number(document.getElementById("TxtCurrencyValue").value);

    var val = /^[0-9]+$/;
    if (QuotedCost === "" || QuotedCost <= 0 || QuotedCost === null) {
        alert("Please enter quoted cost");
        DevExpress.ui.notify("Please enter quoted cost..!", "error", 1500);
        return;
    }
    if (TypeOfCost === "" || FinalCost <= 0 || TypeOfCost === null) {
        alert("Please select final cost");
        DevExpress.ui.notify("Please select final cost type..!", "error", 1500);
        return;
    }
    if (JobName === "" || JobName === "null" || JobName === null) {
        alert("Please Enter Job Name");
        DevExpress.ui.notify("Please Enter Job Name..!", "error", 1500);
        document.getElementById("JobName").focus();
        return;
    }
    if (ClientName === "" || ClientName === null || ClientName === "null" || Number(LedgerId) <= 0) {
        alert("Please Select Client Name");
        DevExpress.ui.notify("Please Select Client Name..!", "error", 1500);
        $("#SbClientName").dxValidator('instance').validate();
        return;
    }
    if (CategoryId === "" || CategoryId === null || CategoryId === "null") {
        alert("Please Select Category");
        DevExpress.ui.notify("Please Select Category..!", "error", 1500);
        $("#SbCategory").dxValidator('instance').validate();
        return;
    }
    if ((SbProductHSNID === "" || SbProductHSNID === null || SbProductHSNID === "null") && $("#SbHSNGroups").hasClass("hidden") === false) {
        DevExpress.ui.notify("Please Select Product HSN Group..!", "warning", 1500);
        //$("#SbHSNGroups").dxValidator('instance').validate();
        //return;
    }
    if (ArtWorkCode === "" || ArtWorkCode === "null" || ArtWorkCode === null) {
        DevExpress.ui.notify("Empty Product code..!", "error", 1500);
        //document.getElementById("ArtWorkCode").focus();
        //return;
    }
    if (SbCurrency === "" || SbCurrency === "null" || SbCurrency === null) {
        SbCurrency = "INR";
        CurrencyValue = 1;
    }

    var TblBooking = [];
    var ObjBooking = {};
    ObjBooking.JobName = JobName;
    ObjBooking.LedgerID = LedgerId;
    ObjBooking.ProductCode = ArtWorkCode;
    ObjBooking.ExpectedCompletionDays = Number(document.getElementById("expectedDays").value);
    ObjBooking.CategoryID = CategoryId;
    ObjBooking.Remark = Remark;
    ObjBooking.BookingRemark = TaQuoteDetails;
    ObjBooking.IsEstimate = 1;
    ObjBooking.ClientName = ClientName;
    ObjBooking.OrderQuantity = TblPlanning[0].PlanContQty;
    ObjBooking.TypeOfCost = TypeOfCost;
    ObjBooking.FinalCost = FinalCost;
    ObjBooking.QuotedCost = QuotedCost;
    ObjBooking.QuoteType = "Job Costing";
    ObjBooking.ConsigneeID = SbConsigneeID;
    ObjBooking.ProductHSNID = SbProductHSNID;
    ObjBooking.CurrencySymbol = SbCurrency;
    ObjBooking.ConversionValue = CurrencyValue;
    ObjBooking.ParentBookingID = ParentBookingID;
    ObjBooking.ShipperID = GblShipperID;

    //////////////////////File Attachment//////
    try {
        var ObjAttc = {}; var ArrObjAttc = [];

        var imgPath = "";
        var tblDetails = document.getElementById("tblDetails");
        var tblrowNo = tblDetails.rows.length;

        if (tblrowNo > 1) {
            imgPath = "";
            for (var i = 1; i <= tblrowNo - 1; i++) {
                var InnerStatement = tblDetails.rows[i].cells[1].innerHTML;
                if (InnerStatement !== "No Attachment") {
                    if (imgPath === "") {
                        imgPath += tblDetails.rows[i].cells[0].innerHTML;
                    }
                    else {
                        imgPath += "," + tblDetails.rows[i].cells[0].innerHTML;
                    }
                    ObjAttc = {};
                    ObjAttc.SequenceNo = i;
                    ObjAttc.FilePath = tblDetails.rows[i].cells[0].innerHTML;
                    ObjAttc.FileName = tblDetails.rows[i].cells[1].innerHTML;
                    ObjAttc.FileExtension = tblDetails.rows[i].cells[1].innerHTML.split('.')[1];
                    ArrObjAttc.push(ObjAttc);
                }
            }
        }
        ObjBooking.AttachedFilesPath = imgPath;
    } catch (e) {
        console.log(e);
    }
    //////

    TblBooking.push(ObjBooking);

    var jsonObjectsCosting = [];
    var Costing = {};
    //var PTablecells = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells;
    var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0];
    for (var t = 1; t < PTablecrow.cells.length; t++) {
        if (Number(document.getElementById("txtqty" + t).value) > 0 && Number(document.getElementById("FinalUnitCost" + t).innerHTML) > 0) {
            Costing = {};
            Costing.MiscPercentage = Number(document.getElementById("FinalMiscPer" + t).value);
            Costing.ProfitPercentage = Number(document.getElementById("FinalPftPer" + t).value);
            Costing.DiscountPercentage = Number(document.getElementById("FinalDiscPer" + t).value);
            Costing.TaxPercentage = Number(document.getElementById("FinalTaxPer" + t).value);

            Costing.PlanContQty = Number(document.getElementById("txtqty" + t).value);
            //Costing.PlanContentType = document.getElementById("contType" + t).innerHTML;
            //Costing.PlanContName = document.getElementById("contName" + t).innerHTML;

            Costing.ShipperCost = Number(document.getElementById("FinalShipperCost" + t).value);
            Costing.MiscCost = parseFloat(document.getElementById("FinalMiscCost" + t).value);
            Costing.ProfitCost = parseFloat(document.getElementById("FinalProfitCost" + t).value);
            Costing.DiscountAmount = parseFloat(document.getElementById("FinalDisCost" + t).value);
            Costing.TaxAmount = parseFloat(document.getElementById("FinalTaxCost" + t).value);
            Costing.TotalCost = parseFloat(document.getElementById("FinaltotalCost" + t).innerHTML);

            Costing.GrandTotalCost = parseFloat(document.getElementById("FinalGrandTotalCost" + t).innerHTML);
            Costing.UnitCost = parseFloat(document.getElementById("FinalUnitCost" + t).innerHTML);
            Costing.UnitCost1000 = parseFloat(document.getElementById("FinalUnitThCost" + t).innerHTML);

            Costing.FinalCost = parseFloat(document.getElementById("FinalfinalCost" + t).value);
            Costing.QuotedCost = parseFloat(document.getElementById("FinalQuotedCost" + t).value);
            Costing.CurrencySymbol = SbCurrency;
            Costing.ConversionValue = CurrencyValue;

            jsonObjectsCosting.push(Costing);
        }
    }

    var CostingData = JSON.stringify(jsonObjectsCosting);

    var BookingNo = document.getElementById("QuotationNo").value;
    var Quo_No = BookingNo.split('.');
    BookingNo = Quo_No[0];

    document.getElementById("BtnSaveQuotation").style.display = 'none';
    $.ajax({
        type: "POST",
        url: "WebServicePlanWindow.asmx/saveQuotationData",
        data: '{TblBooking:' + JSON.stringify(TblBooking) + ',TblPlanning:' + JSON.stringify(TblPlanning) + ',TblOperations:' + JSON.stringify(TblOperations) + '' +
            ', TblContentForms: ' + JSON.stringify(TblContentForms) + ', CostingData: ' + CostingData + ', FlagSave: ' + JSON.stringify(FlagSave) + ', BookingNo: ' + JSON.stringify(BookingNo) + ',ObjShippers:' + JSON.stringify(GblObjShippers) + ',ArrObjAttc:' + JSON.stringify(ArrObjAttc) + '}',
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
                BookingID = RES1.d;
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

$("#BtnPrintQuotation").click(function () {
    if (Number(BookingID) > 0) {
        var url = "Print_Quotation.aspx?BN=" + BookingID + "&BookingNo=" + document.getElementById("QuotationNo").value;
        window.open(url, "_blank", "location=yes,height=1100,width=1050,scrollbars=yes,status=no", true);
        window.location.href = window.location.href.split("?")[0];
        window.location.href.reload(true);
    }
});

function masterPlan() {
    if (GblPlanValues.length <= 0) {
        swal("Invalid master plan", "Please plan for at least one quantity..", "warning");
        return;
    }
    $("#OperId").text(OprIds.join());
    var OperId = $("#OperId").text();
    var ItemPlanQuality = $("#ItemPlanQuality").dxSelectBox("instance").option('value');
    var ItemPlanGsm = $("#ItemPlanGsm").dxSelectBox("instance").option('value');
    var ItemPlanMill = $("#ItemPlanMill").dxSelectBox("instance").option('value');
    var ItemPlanFinish = $("#ItemPlanFinish").dxSelectBox("instance").option('value');
    var PlanPlateType = $("#PlanPlateType").dxSelectBox("instance").option('value');
    var PlanWastageType = $("#PlanWastageType").dxSelectBox("instance").option('value');

    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;

    var JobNoOfPages = Number(document.getElementById("JobNoOfPages").value);

    //var JobPrePlan = document.getElementById("JobPrePlan").value;

    var PlanFColor = document.getElementById("PlanFColor").value;
    var PlanBColor = document.getElementById("PlanBColor").value;
    var PlanSpeFColor = document.getElementById("PlanSpeFColor").value;
    var PlanSpeBColor = document.getElementById("PlanSpeBColor").value;

    var PlanWastageValue = document.getElementById("PlanWastageValue").value;

    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var Obj_Job_Size = {};
    var Job_Size_Obj = [];

    Obj_Job_Size.CutSize = GblPlanValues.CutSize;
    Obj_Job_Size.PlanContentType = PlanContentType;
    Obj_Job_Size.UpsH = Number(GblPlanValues.UpsW);
    Obj_Job_Size.UpsL = Number(GblPlanValues.UpsL);
    Obj_Job_Size.MachineId = GblPlanValues.MachineID;
    Obj_Job_Size.PlanContQty = Number(PlanContQty);
    Obj_Job_Size.JobNoOfPages = Number(JobNoOfPages);
    Obj_Job_Size.PlanPrintingStyle = GblPlanValues.PrintingStyle.replace(/ {1,}/g, " "); //r//replace multiple space into 1 space
    Obj_Job_Size.PlanFColor = Number(PlanFColor);
    Obj_Job_Size.PlanBColor = Number(PlanBColor);
    Obj_Job_Size.PlanSpeFColor = PlanSpeFColor;
    Obj_Job_Size.PlanSpeBColor = PlanSpeBColor;
    Obj_Job_Size.PlanWastageType = PlanWastageType;
    Obj_Job_Size.PlanWastageValue = Number(PlanWastageValue);
    Obj_Job_Size.PlanPrintingGrain = GblPlanValues.GrainDirection;

    Obj_Job_Size.ItemPlanQuality = ItemPlanQuality;
    Obj_Job_Size.ItemPlanGsm = ItemPlanGsm;
    Obj_Job_Size.ItemPlanMill = ItemPlanMill;
    Obj_Job_Size.ItemPlanFinish = ItemPlanFinish;

    Obj_Job_Size.PlanPlateType = PlanPlateType;
    Obj_Job_Size.PlanType = GblPlanValues.PlanType;
    Obj_Job_Size.PaperID = GblPlanValues.PaperID;
    Obj_Job_Size.PlanOnlineCoating = $("#PlanOnlineCoating").dxSelectBox("instance").option('value');
    Obj_Job_Size.PaperGroup = GblPlanValues.PaperGroup;
    Obj_Job_Size.GripperSide = GblPlanValues.GripperSide;
    Obj_Job_Size.PlanGripper = GblPlanValues.Gripper;
    Obj_Job_Size.OperId = OperId;
    Obj_Job_Size.InterlockStyle = GblPlanValues.InterlockStyle;
    Obj_Job_Size.VendorID = GblPlanValues.VendorID;
    Obj_Job_Size.VendorName = GblPlanValues.VendorName;

    //Obj_Job_Size.JobPrePlan = JobPrePlan;

    Job_Size_Obj.push(Obj_Job_Size);
    var ObjJobSize = JSON.stringify(Job_Size_Obj);
    var ObjOpr = JSON.stringify(GblInputOpr);

    try {
        $.ajax({
            type: "POST",
            url: "Api_shiring_service.asmx/ShirinJobMaster",
            data: '{ObjJobSize:' + ObjJobSize + ',ObjOpr:' + ObjOpr + ',PlateRate:' + GblPlanValues.PlateRate + ',PaperRate:' + GblPlanValues.PaperRate + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);    /////  res = res.slice(0, -1);

                var blankdata = [];
                $("#ContentPlansList").dxDataGrid({ dataSource: blankdata, clearSelection: true });
                var grid = $("#ContentPlansList").dxDataGrid('instance');
                grid.clearSelection();
                $("#GridHeadsDetails").dxDataGrid({ dataSource: blankdata });
                $("#GridOperationDetails").dxDataGrid({ dataSource: blankdata });

                var No_Plan = "Check Job Size: Job size may be larger than available Paper size or Machine Size. " + "\n" +
                    " Check Paper Size: Suitable paper size may not be available in selected Paper Group.  " + "\n" +
                    " Check Grain Direction: Grain Direction may not be correct. " + "\n" +
                    " Check Printing Style: Printing Style may not be correct. " + "\n" +
                    " Check Color Strip, Gripper,  Plate Type, Job Trimming, Stripping Margin, Printing Margin";
                if (results.d.includes("TblPlanning") === false) {
                    No_Plan = results.d;
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (No_Plan.includes("Conversion from string")) {
                        No_Plan = "Session Expired, Please login again";
                        DevExpress.ui.notify(No_Plan, "warning", 1500);
                        alert(No_Plan);
                        location.reload(true);
                        return false;
                    } else if (No_Plan !== "") {
                        DevExpress.ui.notify(No_Plan, "warning", 1500);
                        alert(No_Plan);
                        return false;
                    }
                } else if (res === "[]") {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    DevExpress.ui.notify(No_Plan, "warning", 1500);
                    alert(No_Plan);
                    return false;
                }
                var RES1 = JSON.parse(res);
                if (RES1.TblPlanning.length < 1) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert("Please Check Job Size");
                    DevExpress.ui.notify(No_Plan, "warning", 5000);
                }
                else {
                    try {
                        var PlanContName = document.getElementById("PlanContName").innerHTML;
                        var objectJobOperation = db.transaction("JobOperation").objectStore("JobOperation");
                        objectJobOperation.openCursor().onsuccess = function (event) {
                            var curOper = event.target.result;
                            if (curOper) {
                                if (curOper.value.PlanContName === PlanContName && curOper.value.PlanContentType === PlanContentType) {
                                    for (var val = 0; val < RES1.TblOperations.length; val++) {
                                        var result = $.grep(curOper.value, function (e) {
                                            if (e.RateFactor === null) { e.RateFactor = ""; }
                                            return RES1.TblOperations[val].ProcessID === e.ProcessID && RES1.TblOperations[val].RateFactor === e.RateFactor;
                                        });
                                        if (result.length === 1) {
                                            // found
                                            RES1.TblOperations[val].SizeL = result[0].SizeL;
                                            RES1.TblOperations[val].SizeW = result[0].SizeW;
                                            RES1.TblOperations[val].Pieces = result[0].Pieces;
                                            RES1.TblOperations[val].NoOfStitch = result[0].NoOfStitch;
                                            RES1.TblOperations[val].NoOfLoops = result[0].NoOfLoops;
                                            RES1.TblOperations[val].NoOfColors = result[0].NoOfColors;
                                            RES1.TblOperations[val].RateFactor = result[0].RateFactor;
                                            RES1.TblOperations[val].NoOfPass = result[0].NoOfPass;
                                            RES1.TblOperations[val].Rate = result[0].Rate;
                                        }
                                    }
                                    ShowShirinReport(RES1);
                                    return;
                                }
                                curOper.continue();
                            } else
                                ShowShirinReport(RES1);
                        };

                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                alert("Check Job Size " + jqXHR.statusText);
                DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 500);
            }
        });
    } catch (e) {
        console.log(e);
        DevExpress.ui.notify("" + e + "", "error", 100);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

var blankdata = [];
blankdata.TblPlanning = [];
blankdata.TblOperations = [];
blankdata.TblBookForms = [];
ShowShirinReport(blankdata);

$("#BtnCalculateOperation").click(function () {
    try {
        var rowData = OprData.key;
        $('#OperationEditP input').each(function () {
            if (this.id === "") return;
            if (this.type === "text" || this.type === "number") {
                rowData[this.id] = document.getElementById(this.id).value;
                OprData.key[this.id] = rowData[this.id];
            }
        });
        var NoOfForms = $("#GridFormsDetails").dxDataGrid('instance').getTotalSummaryValue("Forms");
        var JobNoOfPages = Number(document.getElementById("JobNoOfPages").value);
        if (NoOfForms <= 0) NoOfForms = 1; //as per vivek sir 20-04-2019 at lovely
        var TtlPaperWt = GblTotalPaperWt + Number(GblPlanValues.TotalPaperWeightInKg);
        var TtlNoOfForms = GblTotalForms + Number(NoOfForms);

        var result = $.grep(GblTypesOfC, function (e) { return e.TypeOfCharges === rowData.TypeofCharges; });
        if (result.length === 0) {
            // not found
        } else if (result.length === 1) {
            //found
            var newdata = result[0];
            if (newdata.CalculationFormula !== "") {
                if (rowData.TypeofCharges.includes("PerBoxWt")) {
                    rowData.Quantity = Math.ceil(Number(TtlPaperWt) / OprData.key.NoOfPass);
                } else if (rowData.TypeofCharges.includes("Calendar-Inch")) {
                    if (rowData.SizeL <= 0) rowData.SizeL = Number(GblInputValues.SizeLength) / 25.4;
                }
                OprData.key.Amount = eval(newdata.CalculationFormula);
                if (rowData.MinimumCharges > Number(OprData.key.Amount)) {
                    OprData.key.Amount = rowData.MinimumCharges;
                }
                OprData.component.refresh();
                CalculateFinalAmt();
            }
        }
        document.getElementById("BtnCalculateOperation").setAttribute("data-dismiss", "modal");
    } catch (e) {
        console.log(e);
    }
});

function CalculateFinalAmt() {
    var grid = $("#GridOperationDetails").dxDataGrid('instance');

    GblPlanValues.OpAmt = grid.getTotalSummaryValue("Amount");
    var finalcost = Number(GblPlanValues.OpAmt) + Number(GblPlanValues.TotalAmount);
    GblPlanValues.GrantAmount = finalcost.toFixed(3);
    document.getElementById("finalCost").value = finalcost.toFixed(3);
    document.getElementById("finalUnitCost").value = finalcost.toFixed(3) / Number(document.getElementById("PlanContQty").innerHTML);
    document.getElementById("finalUnitCost").value = Number(document.getElementById("finalUnitCost").value).toFixed(3);
}

function getItemStockDetails(ItmID) {
    $.ajax({
        type: 'POST',
        url: "WebServicePlanWindow.asmx/LoadItemStockDetails",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{ItmID: " + ItmID + "}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());

            $("#DivPaperStock").text("");
            var TblTr = "<tr><td>" + RES1[0].ItemCode + "</td><td>" + RES1[0].PhysicalStock + "</td><td>" + RES1[0].BookedStock + "</td><td>" + RES1[0].AllocatedStock + "</td><td>" + RES1[0].IncomingStock + "</td><td>" + RES1[0].FloorStock + "</td></tr>";
            var tblDiv = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'><strong style='font-size: 13px'>Stock Details :-</strong>" +
                "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
                "<tr><th>Item Code</th><th>Physical Stock</th><th>Booked Stock</th><th>Allocated Stock</th><th>Incoming Stock</th><th>Floor Stock</th></tr></tr></thead>" +
                "<tbody>" + TblTr + "</tbody></table></div>";
            tblDiv = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'>" + tblDiv + "</div>";

            $('#DivPaperStock').append(tblDiv);
        }
    });
}

function GetPrintingSlabsDetails(MID, PaperGroup, SizeWL) {
    if (MID <= 0) return;
    $.ajax({
        type: 'POST',
        url: "WebServicePlanWindow.asmx/LoadPrintingSlabsDetails",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{MachineID: " + MID + ",PaperGrp:" + JSON.stringify(PaperGroup) + ",SizeWL:" + JSON.stringify(SizeWL) + "}",
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res.toString());

            $("#GridPrintingSlabsDetails").dxDataGrid({
                dataSource: RES1,
                columnAutoWidth: true,
                allowColumnResizing: true,
                sorting: { mode: 'none' },
                columns: [{ dataField: "MachineID", visible: false, width: 0 }, { dataField: "SheetRangeFrom" },
                { dataField: "SheetRangeTo" }, { dataField: "Rate" },
                { dataField: "MaxPlanW", caption: "Size W" }, { dataField: "MaxPlanL", caption: "Size L" },
                { dataField: "PaperGroup", width: 100 }, { dataField: "MinCharges" }],
                showRowLines: true,
                showBorders: true,
                scrolling: {
                    mode: 'virtual'
                },
                filterRow: { visible: false },
                height: 200,
                onRowPrepared: function (e) {
                    setDataGridRowCss(e);
                }
            });
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
        }
    });
}

function onInputChangeFolds(Obj) {
    try {
        var FoldInH = Number(document.getElementById("JobFoldInH").value);
        var FoldInL = Number(document.getElementById("JobFoldInL").value);

        var sizeH = Number(document.getElementById("JobFoldedH").value);
        var sizeL = Number(document.getElementById("JobFoldedL").value);

        if (Obj.id === "JobFoldInH" || Obj.id === "JobFoldedH") {
            document.getElementById("SizeHeight").value = sizeH * FoldInH;
        } else if (Obj.id === "JobFoldInL" || Obj.id === "JobFoldedL") {
            document.getElementById("SizeLength").value = sizeL * FoldInL;
        }
    } catch (e) {
        alert(e);
    }
}

/*
 * Move array of object rows up and down.
 * arr is object array.
 * old_index is old index of row.
 * new_index is new index of row.
 */
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}

//$.getScript("CustomJS/LayoutDraw.js", function () {
//    //alert("Script loaded but not necessarily executed.");
//});

async function svgToPng(svg, callback) {
    const url = await getSvgUrl(svg);
    svgUrlToPng(url, (imgData) => {
        callback(imgData);
        URL.revokeObjectURL(url);
    });
}
function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
}
async function svgUrlToPng(svgUrl, callback) {
    const svgImage = document.createElement('img');
    svgImage.style.position = 'absolute';
    svgImage.style.top = '-9999px';
    document.body.appendChild(svgImage);
    svgImage.onload = async function () {
        const canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = await canvas.toDataURL('image/png');
        callback(imgData);
        // document.body.removeChild(imgPreview);
    };
    svgImage.src = svgUrl;
}