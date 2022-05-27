var FlagSave = true;
var ParentBookingID = 0;

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

    if (queryString["BookingID"] !== null && queryString["BookingID"] !== undefined) {
        BookingID = Number(queryString["BookingID"]);
        if (BookingID <= 0) return;
        ParentBookingID = BookingID;
        if (!db) { window.setTimeout(function () { GetAllPlans(); }, 1000); } else { GetAllPlans(); }
        if (queryString["FG"] !== null && queryString["FG"] !== undefined) {
            if (queryString["FG"] === "Copy" || queryString["FG"] === true || queryString["FG"] === "true") {
                FlagSave = true;
                GetQuoationNo(0);
            } else if (queryString["FG"] === "Review") {
                document.getElementById("BtnSaveQuotation").style.display = "none";
            } else {
                FlagSave = false;
            }
        }
    } else {
        FlagSave = true;
        GetQuoationNo(0);
    }
});

function GetAllPlans() {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({                ////Quotation Reload
            type: 'post',
            url: 'WebServicePlanWindow.asmx/LoadPlanDetails',
            dataType: 'text',
            contentType: "application/json; charset=utf-8",
            data: '{BookingID:' + BookingID + '}',
            crossDomain: true,
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/":,/g, '":null,');
                res = res.replace(/":}/g, '":null}');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                if (res.includes("error code:404")) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    DevExpress.ui.notify("Data not found", "error", 1000);
                    return;
                }
                var RES1 = JSON.parse(res);

                if (results.includes("TblBooking") === false) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    alert(results.d);
                } else {
                    LoadAllPlans(RES1);
                }
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

function LoadAllPlans(dataSource) {
    try {

        var tBodyContent = document.getElementById("Body_Planning");
        var BodyLength = tBodyContent.rows.length;
        if (BodyLength > 1) {
            for (var j = 0; j < BodyLength; j++) {
                if (j > 0) {
                    document.getElementById("Body_Planning").deleteRow(1);
                }
            }
        }

        removeAllContentsData();

        document.getElementById('lastCol').innerHTML = 0;
        document.getElementById('lastRow').innerHTML = 1;
        document.getElementById('Bdy_QtyRow').innerHTML = "";
        document.getElementById('FinalCostDivFooter').innerHTML = "";

        var JobCont = dataSource.TblBookingContents;
        var JobBooking = dataSource.TblBooking[0];
        document.getElementById("QuotationNo").value = JobBooking.BookingNo;
        document.getElementById("JobName").value = JobBooking.JobName;
        document.getElementById("ArtWorkCode").value = JobBooking.ProductCode;
        document.getElementById("TaQuoteDetails").value = JobBooking.BookingRemark;
        document.getElementById("TaRemark").value = JobBooking.Remark;
        document.getElementById("HTypeOfCost").value = JobBooking.TypeOfCost;
        document.getElementById("HFinalCost").value = JobBooking.FinalCost;
        document.getElementById("HQuotedCost").value = JobBooking.QuotedCost;
        document.getElementById("expectedDays").value = JobBooking.ExpectedCompletionDays;

        $("#SbClientName").dxSelectBox({ value: JobBooking.LedgerID });
        $("#SbCategory").dxSelectBox({ value: JobBooking.CategoryID });
        //$("#dxDateQuotation").dxDateBox({ value: JobBooking.CreatedDate });
        $("#SbConsigneeName").dxSelectBox({ value: JobBooking.ConsigneeID });
        $("#SbHSNGroups").dxSelectBox({ value: JobBooking.ProductHSNID });
        $("#SbCurrency").dxSelectBox({ value: JobBooking.CurrencySymbol });
        document.getElementById("TxtCurrencyValue").value = JobBooking.ConversionValue;
        GblShipperID = JobBooking.ShipperID;

        for (j = 0; j < dataSource.TblBookingCosting.length; j++) {

            $("#Add_Quantity_Button").click();
            document.getElementById("txtqty" + (j + 1)).value = dataSource.TblBookingCosting[j].PlanContQty;

            for (var i = 0; i < JobCont.length; i++) {
                var rowNo = Number(document.getElementById('lastRow').innerHTML);

                document.getElementById("PlanContQty").innerHTML = dataSource.TblBookingCosting[j].PlanContQty;
                document.getElementById("PlanContName").innerHTML = JobCont[i].PlanContName;
                document.getElementById("ContentOrientation").innerHTML = JobCont[i].PlanContentType;

                //var ForID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
                //ForID = ForID.rows.length;
                //for (var k = 0; k < dataSource.TblBooking.length; k++) {
                //    if (ForID !== dataSource.TblBooking.length && JobCont[i].PlanContName === dataSource.TblBooking[k].PlanContentType) {
                //addContentReplan(JobCont[i]);
                //    }
                //}

                addContentReplan(JobCont[i]);

                GblInputValues = {};
                var JobValues = JobCont[i].ContentSizeValues.split('AndOr');
                for (var key in JobValues) {
                    var spKey = JobValues[key].split('=');
                    if (spKey[0] === "ItemPlanGsm") {
                        GblInputValues[spKey[0]] = Number(spKey[1]);
                    } else if (spKey[0] !== "Id")
                        GblInputValues[spKey[0]] = spKey[1];
                }

                var GDFormStore = [];
                for (var Pi = 0; Pi < dataSource.TblBookingForms.length; Pi++) {
                    if (dataSource.TblBookingForms[Pi].PlanContName === JobCont[i].PlanContName &&
                        dataSource.TblBookingForms[Pi].PlanContQty === JobCont[i].PlanContQty &&
                        dataSource.TblBookingForms[Pi].PlanContentType === JobCont[i].PlanContentType) {
                        GDFormStore.push(dataSource.TblBookingForms[Pi]);
                    }
                }

                var GDOprstore = [], GDOprnStore = [];
                for (Pi = 0; Pi < dataSource.TblBookingProcess.length; Pi++) {
                    var GDOpr = {};
                    if (dataSource.TblBookingProcess[Pi].PlanContName === JobCont[i].PlanContName && dataSource.TblBookingProcess[Pi].PlanContQty === JobCont[i].PlanContQty && dataSource.TblBookingProcess[Pi].PlanContentType === JobCont[i].PlanContentType) {

                        GDOpr.ProcessID = dataSource.TblBookingProcess[Pi].ProcessID;  //cellValue(i, 0);
                        GDOpr.Rate = dataSource.TblBookingProcess[Pi].Rate;
                        GDOpr.RateFactor = dataSource.TblBookingProcess[Pi].RateFactor;
                        GDOpr.ProcessName = dataSource.TblBookingProcess[Pi].ProcessName;

                        GDOprstore.push(GDOpr);
                        GDOprnStore.push(dataSource.TblBookingProcess[Pi]);
                    }
                }
                GblInputOpr = GDOprstore;
                GblPlanValues = dataSource.TblBookingContents[i];

                if (dataSource.TblBookingCosting[j].PlanContQty === GblPlanValues.PlanContQty) {

                    //rowNo = Number(document.getElementById('lastRow').innerHTML);
                    //var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0];
                    //for (var t = 1; t < PTablecrow.cells.length; t++) {
                    //    if (Number(document.getElementById("txtqty" + t).value) === dataSource.TblBookingCosting[j].PlanContQty) {
                    //        document.getElementById("Plan" + rowNo + (j + 1)).innerHTML = "";
                    //        var unitCost = Number(Number(JobCont[i].GrantAmount) / Number(document.getElementById("PlanContQty").innerHTML)).toFixed(3);
                    //        var divPara1 = '<div style="margin-top: 0em; margin-bottom: 0px; background: transparent;"><div><div style="padding: 2px; font-size: 11px;">Paper:₹' + JobCont[i].PaperAmount + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Printing:₹' + Number(JobCont[i].PrintingAmount).toFixed(2) + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Process:₹' + JobCont[i].OpAmt + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Total:₹ <span id="finalCstSpan' + rowNo + (j + 1) + '" class="th">' + JobCont[i].GrantAmount + '</span></div>' +
                    //            '</div><div><div style="padding: 2px; font-size: 11px;">Unit:₹ ' + unitCost + '</div></div> <div style="display: none"><div style="padding: 2px; font-size: 11px;">Unit/1000:₹' + Number(Number(unitCost) * 1000).toFixed(3) + ' </div></div></div >';
                    //        document.getElementById("Plan" + rowNo + (j + 1)).innerHTML = divPara1;
                    //    }
                    //}

                    saveContentsSizeValues(GblInputValues);
                    saveSelectedPlan(GblPlanValues, GDOprnStore, GDFormStore);
                    saveContentsOprations(GblInputOpr);
                }

            }

            document.getElementById("FinalShipperCost" + (j + 1)).value = dataSource.TblBookingCosting[j].ShipperCost;
            document.getElementById("FinalMiscPer" + (j + 1)).value = dataSource.TblBookingCosting[j].MiscPercentage;
            document.getElementById("FinalMiscCost" + (j + 1)).value = dataSource.TblBookingCosting[j].MiscCost;
            document.getElementById("FinalPftPer" + (j + 1)).value = dataSource.TblBookingCosting[j].ProfitPercentage;
            document.getElementById("FinalProfitCost" + (j + 1)).value = dataSource.TblBookingCosting[j].ProfitCost;
            document.getElementById("FinalDiscPer" + (j + 1)).value = dataSource.TblBookingCosting[j].DiscountPercentage;
            document.getElementById("FinalDisCost" + (j + 1)).value = dataSource.TblBookingCosting[j].DiscountAmount;
            document.getElementById("FinalTaxPer" + (j + 1)).value = dataSource.TblBookingCosting[j].TaxPercentage;
            document.getElementById("FinalTaxCost" + (j + 1)).value = dataSource.TblBookingCosting[j].TaxAmount;
            document.getElementById("FinaltotalCost" + (j + 1)).innerHTML = dataSource.TblBookingCosting[j].TotalCost;

        }

        var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0];
        var ForID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
        ForID = ForID.rows.length;
        for (i = 0; i < JobCont.length; i++) {
            for (var ex = 2; ex <= ForID; ex++) {
                if (document.getElementById("contName" + ex).innerHTML.replace(/'/g, '') === JobCont[i].PlanContName && document.getElementById("contType" + ex).innerHTML.replace(/'/g, '') === JobCont[i].PlanContentType) {
                    for (var t = 1; t < PTablecrow.cells.length; t++) {
                        if (Number(document.getElementById("txtqty" + t).value) === JobCont[i].PlanContQty) {
                            document.getElementById("Plan" + ex + (t)).innerHTML = "";
                            var unitCost = Number(Number(JobCont[i].GrantAmount) / Number(JobCont[i].PlanContQty)).toFixed(3);

                            var divPara1 = '<div style="margin-top: 0em; margin-bottom: 0px;pointer-events: none; background: transparent;"><div hidden ><div style="padding: 2px; font-size: 11px;">Paper:₹' + JobCont[i].PaperAmount + ' </div></div><div hidden ><div style="padding: 2px; font-size: 11px;">Printing:₹' + Number(JobCont[i].PrintingAmount).toFixed(2) + ' </div></div hidden ><div hidden ><div style="padding: 2px; font-size: 11px;">Process:₹' + JobCont[i].OpAmt + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Total:₹ <span id="finalCstSpan' + ex + (t) + '" class="th">' + JobCont[i].GrantAmount + '</span></div>' +
                                '</div><div><div style="padding: 2px; font-size: 11px;">Unit:₹ ' + unitCost + '</div></div> <div style="display: none"><div style="padding: 2px; font-size: 11px;">Unit/1000:₹' + Number(Number(unitCost) * 1000).toFixed(3) + ' </div></div></div >';
                            document.getElementById("Plan" + ex + (t)).innerHTML = divPara1;

                            try {
                                var finalCost = Number(document.getElementById("FinaltotalCost" + t).innerHTML);

                                var value = Number(document.getElementById("FinalMiscPer" + t).value);
                                var amt = finalCost / 100 * value;
                                amt = Number(amt).toFixed(3);
                                document.getElementById("FinalMiscCost" + t).value = amt;

                                value = Number(document.getElementById("FinalPftPer" + t).value);
                                amt = finalCost / 100 * value;
                                amt = Number(amt).toFixed(3);
                                document.getElementById("FinalProfitCost" + t).value = amt;

                                value = Number(document.getElementById("FinalDiscPer" + t).value);
                                amt = finalCost / 100 * value;
                                amt = Number(amt).toFixed(3);
                                document.getElementById("FinalDisCost" + t).value = amt;

                                value = Number(document.getElementById("FinalTaxPer" + t).value);
                                amt = finalCost / 100 * value;
                                amt = Number(amt).toFixed(3);
                                document.getElementById("FinalTaxCost" + t).value = amt;
                            } catch (e) {
                                continue;
                            }
                            sumAllCost(t);
                            document.getElementById("FinalfinalCost" + t).value = dataSource.TblBookingCosting[t - 1].FinalCost;
                            document.getElementById("FinalQuotedCost" + t).value = dataSource.TblBookingCosting[t - 1].QuotedCost;
                            document.getElementById("txtqty" + t).disabled = true;
                        }
                    }
                }
            }
        }

        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        alert(e);
    }
}

function addContentReplan(JobCont) {
    try {

        var ForID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
        ForID = ForID.rows.length;
        var ImgRef = JobCont.PlanContentType.replace(/([A-Z])/g, ' $1').trim();

        if (ForID === 1) {
            document.getElementById("Txt_Content_Name").value = JobCont.PlanContName;
            document.getElementById("PlanContentType").value = JobCont.PlanContentType;
            document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + ImgRef + ".jpg";
            $("#Btn_Select_Content").click();
            return;
        } else {

            for (var ex = 2; ex <= ForID; ex++) { //check Content Already Exist
                var TblBody = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];//*            
                var EnableTR = TblBody.rows[ex - 1].className;//*

                if (EnableTR === "") {//*
                    var tdID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[ex - 1].cells[0].id;
                    tdID = tdID.replace('p', '');
                    var excn = "contName" + tdID;
                    //var row = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[ex - 2].rowIndex;
                    if (document.getElementById(excn).innerHTML.replace(/'/g, '') === JobCont.PlanContName) {
                        return;
                    }
                    //else {
                    //    document.getElementById("Txt_Content_Name").value = JobCont.PlanContName;
                    //    document.getElementById("PlanContentType").value = JobCont.PlanContentType;
                    //    document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + ImgRef + ".jpg";
                    //    $("#Btn_Select_Content").click();
                    //    return;
                    //}
                }
            }

            document.getElementById("Txt_Content_Name").value = JobCont.PlanContName;
            document.getElementById("PlanContentType").value = JobCont.PlanContentType;
            document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + ImgRef + ".jpg";
            $("#Btn_Select_Content").click();

        }
    } catch (e) {
        alert(e);
    }
}