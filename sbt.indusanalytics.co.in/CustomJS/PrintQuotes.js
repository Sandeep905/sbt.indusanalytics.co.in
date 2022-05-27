
var TBLQtyCol = "", DistinctProductDiv = "", DistinctPriceDiv = "";
var Obj_Estimate_Data, Obj_UserMas_Data;
var queryString = new Array();

$(function () {
    if (queryString.length === 0) {
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]);
                queryString[key] = value;
            }
        }
    }
    //alert(queryString["BN"]);
    if (queryString["BN"] !== null) {
        var BookingID, BookingNo;
        BookingID = queryString["BN"];
        BookingNo = queryString["BookingNo"];

        $("#Quote_No").html(BookingNo);

        DistinctProductDiv = "";
        DistinctPriceDiv = "";
        var Split_BookingID = BookingID.split(",");

        if (Split_BookingID.length > 1) {
            document.getElementById("jobDictd1").style.display = "none";
            document.getElementById("Job_Name2").style.display = "none";
        }
        else {
            document.getElementById("jobDictd1").style.display = "block";
            document.getElementById("Job_Name2").style.display = "block";
        }

        for (var Bid in Split_BookingID) {
            var DistinctBID = Split_BookingID[Bid];

            $.ajax({
                type: "POST",
                url: 'WebService_GridClass.asmx/QuotationDetails',
                data: '{BookingID: ' + DistinctBID + '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'text',
                success: function (results) {
                    // alert(results);
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"d":/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    Obj_Estimate_Data = JSON.parse(res.toString());
                    //$("#Date_Quote").html(res);

                    //document.getElementById("Date_Quote").innerHTML = Obj_Estimate_Data[0].Job_Date;
                    document.getElementById("Client_Name").innerHTML = Obj_Estimate_Data[0].LedgerName;
                    document.getElementById("Terms").value = Obj_Estimate_Data[0].FooterText;
                    document.getElementById("Remark").value = Obj_Estimate_Data[0].Remark;
                    document.getElementById("CompanyName").innerHTML = Obj_Estimate_Data[0].CompanyName;

                    var address = Obj_Estimate_Data[0].Address;
                    if (address === "" || address === null) {
                        document.getElementById("Address").innerHTML = "";
                    }
                    else {
                        address = address.replace(/,,/g, '<br />');
                        document.getElementById("Address").innerHTML = address;
                    }
                    document.getElementById("Job_Name").innerHTML = Obj_Estimate_Data[0].JobName;
                    document.getElementById("Job_Name2").innerHTML = Obj_Estimate_Data[0].JobName;
                },
                error: function errorFunc(jqXHR) {
                    //alert(jqXHR.message);
                }
            });

            //Product Details
            var PriceDetailAtt = "";
            $.ajax({
                type: "POST",
                url: 'WebService_GridClass.asmx/GetDetailContents',
                data: '{BookingID: ' + DistinctBID + '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'text',
                success: function (results) {
                    var res = results.replace(/\\/g, '');
                    res = res.replace(/""/g, '');
                    res = res.replace(/"d":/g, '');
                    res = res.substr(1);
                    res = res.slice(0, -1);
                    RES1 = JSON.parse(res.toString());
                    var sampleRES1_JSON = []; var RES4 = [];
                    var sampleRES1 = {};
                    var TblTr = "";
                    if (RES1.length > 0) {
                        TblTr = "";
                        TBLQtyCol = "";
                        var Operations = "";
                        for (var i = 0; i < RES1.length; i++) {
                            sampleRES1 = {};
                            sampleRES1.ProductCode = RES1[i].ProductCode;
                            sampleRES1.BookingNo = RES1[i].BookingNo;
                            sampleRES1.PlanContQty = RES1[i].PlanContQty;
                            //sampleRES1.UnitCost = RES1[i].UnitCost;
                            //sampleRES1.UnitCost1000 = RES1[i].UnitCost1000;
                            sampleRES1.QuotedCost = RES1[i].QuotedCost;
                            sampleRES1.TypeOfCost = RES1[i].TypeOfCost;
                            sampleRES1.JobName = RES1[i].JobName;
                            sampleRES1.Job_Date = RES1[i].Job_Date;

                            sampleRES1_JSON.push(sampleRES1);

                            if (RES1[i].Operatios === "" || RES1[i].Operatios === "null" || RES1[i].Operatios === null) {
                                Operations = "NA";
                            } else {
                                Operations = RES1[i].Operatios.slice(0, -1);
                            }
                            try {
                                if (RES4.length > 0) {
                                    var result = $.grep(RES4, function (ex) { return ex.Content_Name === RES1[i].Content_Name && ex.Job_Size === RES1[i].Job_Size; });
                                    ///duplicate contents name match
                                    if (result.length === 0) {
                                        TBLQtyCol = "<td>" + RES1[i].Content_Name + "</td><td>" + RES1[i].Job_Size + "</td><td>" + RES1[i].Printing + "</td><td>" + RES1[i].Paper + "</td><td>" + Operations + "</td>";
                                        TblTr += "<tr>" + TBLQtyCol + "</tr>";
                                        RES4.push(RES1[i]);
                                    }
                                } else {
                                    TBLQtyCol = "<td>" + RES1[i].Content_Name + "</td><td>" + RES1[i].Job_Size + "</td><td>" + RES1[i].Printing + "</td><td>" + RES1[i].Paper + "</td><td>" + Operations + "</td>";
                                    TblTr += "<tr>" + TBLQtyCol + "</tr>";
                                    RES4.push(RES1[i]);
                                }
                            } catch (e) {
                                alert(e);
                            }

                        }
                        DistinctProductDiv = "";
                        DistinctProductDiv += "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'><strong style='font-size: 15px'>Product Details :-</strong>" +
                            "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
                            "<tr><th>Content Name</th><th>Job Size</th><th>Printing</th><th>Paper</th><th>Operations</th></tr></thead>" +
                            "<tbody>" + TblTr + "</tbody></table></div>";

                        $('#Div_ProductDetails').append(DistinctProductDiv);

                        //For Price Details if Data Load
                        var distinct = [];
                        if (sampleRES1_JSON !== "" && sampleRES1_JSON !== [] && sampleRES1_JSON !== undefined) {
                            var flags = [];
                            distinct = [];

                            var DissampleRES1 = {};

                            for (var c = 0; c < sampleRES1_JSON.length; c++) {
                                //if (flags[sampleRES1_JSON[c].BookingNo]) continue;
                                //flags[sampleRES1_JSON[c].BookingNo] = true;
                                DissampleRES1 = {};
                                DissampleRES1.ProductCode = sampleRES1_JSON[c].ProductCode;
                                DissampleRES1.BookingNo = sampleRES1_JSON[c].BookingNo;
                                DissampleRES1.Quantity = sampleRES1_JSON[c].PlanContQty;
                                DissampleRES1.QuotedCost = sampleRES1_JSON[c].QuotedCost; //UnitCost;
                                ///DissampleRES1.Price_1000_Unit = sampleRES1_JSON[c].UnitCost1000;
                                DissampleRES1.TypeOfCost = sampleRES1_JSON[c].TypeOfCost;
                                DissampleRES1.JobName = sampleRES1_JSON[c].JobName;
                                DissampleRES1.Job_Date = sampleRES1_JSON[c].Job_Date;

                                distinct.push(DissampleRES1);
                            }
                            var PriceRES1 = distinct;

                            if (PriceRES1.length > 0) {
                                TBLQtyCol = "";
                                PriceDetailAtt = "";
                                for (i = 0; i < PriceRES1.length; i++) {
                                    if (flags[PriceRES1[i].BookingNo] && flags[PriceRES1[i].Quantity] === PriceRES1[i].Quantity ) continue;
                                    flags[PriceRES1[i].BookingNo] = true;
                                    flags[PriceRES1[i].Quantity] = PriceRES1[i].Quantity;
                                    TBLQtyCol = TBLQtyCol + "<tr><td>" + PriceRES1[i].Quantity + "</td><td>" + PriceRES1[i].QuotedCost + "</td><td>" + PriceRES1[i].TypeOfCost + "</td></tr>";

                                    PriceDetailAtt = "<tr><th>Job Description</th><td><span>" + PriceRES1[i].JobName + "</span></td><th>Quote Date</th><td><span>" + PriceRES1[i].Job_Date + "</span></td></tr>" +
                                        "<tr><th>Quotation Ref</th><td><span>" + PriceRES1[i].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[i].ProductCode + "</span></td></tr>";
                                }
                                DistinctPriceDiv = "";
                                DistinctPriceDiv += "<strong style='font-size: 15px'>Price Details :-</strong>" +
                                    "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'> " + PriceDetailAtt + " </thead></table>" +
                                    //"<tr><th>Job Description</th><td><span>" + PriceRES1[0].JobName + "</span></td><th>Quote Date</th><td><span>" + PriceRES1[0].Job_Date + "</span></td></tr>" +
                                    //"<tr><th>Quotation Ref</th><td><span>" + PriceRES1[0].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[0].ProductCode + "</span></td></tr>" +
                                    // "</thead></table > " +
                                    "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
                                    "<tr><th>Quantity</th><th>Quoted Cost</th><th>Type Of Cost</th></tr></thead>" +
                                    //"<tr><th>Quantity</th><th>Quoted Price(Unit)</th><th>Quoted Price(Unit/1000)</th></tr></thead>" +
                                    "<tbody><tr>" + TBLQtyCol + "</tr></tbody></table>";

                                var tbldiv = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'>" + DistinctPriceDiv + "</div>";

                                $('#Div_ProductDetails').append(tbldiv);

                            }
                            else {
                                //For Price Details if Data Blank
                                TBLQtyCol = "";
                                TBLQtyCol = "<td style='border-top:none;border-right:none'>No Data</td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-left:none;border-top:none;border-right:none'></td>";

                                PriceDetailAtt = "";
                                PriceDetailAtt = "<tr><th>Job Description</th><td><span>  </span></td><th>Quote Date</th><td><span>  </span></td></tr>" +
                                    "<tr><th>Quotation Ref</th><td><span>  </span></td><th>Product Code</th><td><span>  </span></td></tr>";


                                DistinctPriceDiv = "";
                                DistinctPriceDiv += "<strong style='font-size: 15px'>Price Details :-</strong>" +
                                    "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" + PriceDetailAtt + " </thead></table>" +
                                    //"<tr><th>Job Description</th><td><span>" + PriceRES1[0].JobName + "</span></td><th>Quote Date</th><td><span>" + PriceRES1[0].Job_Date + "</span></td></tr>" +
                                    //"<tr><th>Quotation Ref</th><td><span>" + PriceRES1[0].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[0].ProductCode + "</span></td></tr>" +
                                    //"</thead></table>" +
                                    "<table class=' + Content_Details + '><thead style='height: 0em; border: 2px solid #eee;'>" +
                                    "<tr><th>Quantity</th><th>Quoted Cost</th><th>Type Of Cost</th></tr></thead>" +
                                    //"<tr><th>Quantity</th><th>Quoted Price(Unit)</th><th>Quoted Price(Unit/1000)</th></tr></thead>" +
                                    "<tbody><tr>" + TBLQtyCol + "</tr></tbody></table>";

                                var tbldivelse = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'>" + DistinctPriceDiv + "</div>";
                                $('#Div_ProductDetails').append(tbldivelse);

                            }
                        }

                    }
                    else {
                        sampleRES1_JSON = [];
                        TblTr = "";
                        TBLQtyCol = "";
                        TBLQtyCol = "<td style='border-top:none;border-right:none'>No Data</td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-top:none;border-left:none;'></td>";
                        TblTr += "<tr>" + TBLQtyCol + "</tr>";

                        DistinctProductDiv = "";
                        DistinctProductDiv += "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'><strong style='font-size: 15px'>Product Details :-</strong>" +
                            "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
                            "<tr><th>Content Name</th><th>Job Size</th><th>Printing</th><th>Paper</th><th>Operations</th></tr></thead>" +
                            "<tbody>" + TblTr + "</tbody></table></div>";
                        $('#Div_ProductDetails').append(DistinctProductDiv);

                        //For Price Details if Data Blank
                        TBLQtyCol = "";
                        TBLQtyCol = "<td style='border-top:none;border-right:none'>No Data</td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-left:none;border-top:none;border-right:none'></td>";

                        PriceDetailAtt = "";
                        PriceDetailAtt = "<tr><th>Job Description</th><td><span>  </span></td><th>Quote Date</th><td><span>  </span></td></tr>" +
                            "<tr><th>Quotation Ref</th><td><span>  </span></td><th>Product Code</th><td><span>  </span></td></tr>";


                        DistinctPriceDiv = "";
                        DistinctPriceDiv += "<strong style='font-size: 15px'>Price Details :-</strong>" +
                            "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" + PriceDetailAtt + " </thead></table>" +
                            //"<tr><th>Job Description</th><td><span>" + PriceRES1[0].JobName + "</span></td><th>Quote Date</th><td><span>" + PriceRES1[0].Job_Date + "</span></td></tr>" +
                            //"<tr><th>Quotation Ref</th><td><span>" + PriceRES1[0].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[0].ProductCode + "</span></td></tr>" +
                            //"</thead></table>" +
                            "<table class=' + Content_Details + '><thead style='height: 0em; border: 2px solid #eee;'>" +
                            "<tr><th>Quantity</th><th>Quoted Cost</th><th>Type Of Cost</th></tr></thead>" +
                            //"<tr><th>Quantity</th><th>Quoted Price(Unit)</th><th>Quoted Price(Unit/1000)</th></tr></thead>" +
                            "<tbody><tr>" + TBLQtyCol + "</tr></tbody></table>";

                        var tbldivelse1 = "<div style='float: left; width: 100%; height: auto;margin-bottom:1em'>" + DistinctPriceDiv + "</div>";
                        $('#Div_ProductDetails').append(tbldivelse1);

                    }

                }
            });

            // Price Details
            ////$.ajax({
            ////    type: "POST",
            ////    url: 'WebService_GridClass.asmx/Get_Detail_Price',
            ////    data: '{BookingID:' + DistinctBID + '}',
            ////    contentType: 'application/json; charset=utf-8',
            ////    dataType: 'text',
            ////    success: function (results) {
            ////        var res = results.replace(/\\/g, '');
            ////        //   alert(res);
            ////        res = res.replace(/""/g, '');
            ////        res = res.replace(/"d":/g, '');
            ////        res = res.substr(1);
            ////        res = res.slice(0, -1);
            ////        var PriceRES1 = JSON.parse(res.toString());
            ////        //alert(PriceRES1);
            ////        //document.getElementById("ArtWork").innerHTML = PriceRES1[0].ProductCode;
            ////        //document.getElementById("QRef").innerHTML = PriceRES1[0].BookingNo;

            ////        if (PriceRES1.length > 0) {
            ////            TBLQtyCol = "";

            ////            for (var i = 0; i < PriceRES1.length; i++) {

            ////                TBLQtyCol = "<td>" + PriceRES1[i].Quantity + "</td><td>" + PriceRES1[i].QuotedCost + "</td><td>" + PriceRES1[i].TypeOfCost + "</td>";

            ////            }
            ////            DistinctPriceDiv = "";
            ////            DistinctPriceDiv += "<strong style='font-size: 15px'>Price Details :-</strong>" +
            ////                            "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
            ////                            "<tr><th>Quotation Ref</th><td><span>" + PriceRES1[0].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[0].ProductCode + "</span></td></tr>" +
            ////                            "</thead></table>" +
            ////                            "<table class=' + Content_Details + '><thead style='height: 0em; border: 2px solid #eee;'>" +
            ////                            "<tr><th>Quantity</th><th>Quoted Price(Unit)</th><th>Type Of Cost</th></tr></thead>" +
            ////                            "<tbody><tr>" + TBLQtyCol + "</tr></tbody></table>";

            ////            var tbldiv = "<div style='float: left; width: 100%; height: auto;'>" + DistinctPriceDiv + "</div>"

            ////            $('#Div_PriceDetails').append(tbldiv);


            ////            //$('#Bdy_Price_DetailsTBL').append(TBLQtyCol);
            ////        }
            ////        else {
            ////            TBLQtyCol = "";
            ////            TBLQtyCol = "<td style='border-top:none;border-right:none'>No Data</td><td style='border-left:none;border-top:none;border-right:none'></td><td style='border-left:none;border-top:none;border-right:none'></td>";

            ////            DistinctPriceDiv = "";
            ////            DistinctPriceDiv += "<strong style='font-size: 15px'>Price Details :-</strong>" +
            ////                            "<table class='Content_Details'><thead style='height: 0em; border: 2px solid #eee;'>" +
            ////                            "<tr><th>Quotation Ref</th><td><span>" + PriceRES1[0].BookingNo + "</span></td><th>Product Code</th><td><span>" + PriceRES1[0].ProductCode + "</span></td></tr>" +
            ////                            "</thead></table>" +
            ////                            "<table class=' + Content_Details + '><thead style='height: 0em; border: 2px solid #eee;'>" +
            ////                            "<tr><th>Quantity</th><th>Quoted Price(Unit)</th><th>Type Of Cost</th></tr></thead>" +
            ////                            "<tbody><tr>" + TBLQtyCol + "</tr></tbody></table>";

            ////            var tbldiv = "<div style='float: left; width: 100%; height: auto;'>" + DistinctPriceDiv + "</div>"
            ////            $('#Div_PriceDetails').append(tbldiv);


            ////            // $('#Bdy_Price_DetailsTBL').append(TBLQtyCol);
            ////        }

            ////    },
            ////});

        }
    }
});

