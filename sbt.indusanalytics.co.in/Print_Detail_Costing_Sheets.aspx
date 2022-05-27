<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Print_Detail_Costing_Sheets.aspx.vb" Inherits="Print_Detail_Costing_Sheets" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <style>
        .header_name {
            color: #ffffff;
            text-align: center;
            font-size: 25px;
            /*padding: 15px;*/
        }

        table {
            border-collapse: collapse;
        }

        table, td, th {
            border: 1px solid black;
        }

        .auto-style1 {
            width: 100%;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div id="main" style="float: left; width: 100%; height: auto; border: groove">
            <div id="DivHeader2" style="float: left; width: 100%; height: 5em; background-color: #0775b1; color: white; font: bold; border-bottom: groove">
                <div style="width: 100%">
                    <div class="headername">
                        <p>Costing Sheet Details</p>

                        <div style="float: left" id="">Require Dispatch Date</div>
                    </div>
                </div>
            </div>
            <script src="js/2.2.3%20jquery.min.js"></script>
            <link href="css/DxCommon.css" rel="stylesheet" type="text/css" />
            <link href="css/DxLight.css" rel="stylesheet" type="text/css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.2/jszip.min.js"></script>
            <%--Use for Export data --%>
            <script src="https://cdn3.devexpress.com/jslib/16.2.4/js/dx.all.js"></script>
            <%-- DevExpress Control Grid --%>

            <span id="lblData"></span><span id="dd"></span>

            <script type="text/javascript">
                var queryString = new Array();
                $(function () {
                    if (queryString.length == 0) {

                        if (window.location.search.split('?').length > 1) {
                            var params = window.location.search.split('?')[1].split('&');
                            for (var i = 0; i < params.length; i++) {
                                var key = params[i].split('=')[0];
                                var value = decodeURIComponent(params[i].split('=')[1]);
                                queryString[key] = value;
                            }
                        }
                    }

                    if (queryString["EI"] != null) {
                        var JCNo;
                        JCNo = queryString["EI"];
                        $.ajax({
                            type: "POST",
                            url: 'WebService_GridClass.asmx/PrintDetailCostingSheets',
                            data: '{JCNo:' + JCNo + '}',
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'text',
                            success: function (results) {
                                var res = results.replace(/\\/g, '');
                                res = res.replace(/"d":/g, '');
                                res = res.replace(/""/g, '');
                                res = res.substr(1);
                                res = res.slice(0, -1);
                                RES1 = JSON.parse(res.toString());


                                document.getElementById('QuotationNo').innerHTML = RES1[0].BookingNo;
                                document.getElementById('JobDate').innerHTML = RES1[0].JobDate;
                                document.getElementById('ClientName').innerHTML = RES1[0].ClientName;
                                document.getElementById('Address').innerHTML = RES1[0].Address;
                                document.getElementById('ContactNo').innerHTML = RES1[0].ContactNo;
                                document.getElementById('JobName').innerHTML = RES1[0].JobName;
                                document.getElementById('OrderQuantity').innerHTML = RES1[0].OrderQuantity;
                                document.getElementById('CatagoryName').innerHTML = RES1[0].CategoryName;
                                document.getElementById('FinalCost').innerHTML = RES1[0].FinalCost;
                                document.getElementById('ProductCode').innerHTML = RES1[0].ProductCode;
                                document.getElementById('TypeOfCost').innerHTML = RES1[0].TypeOfCost;
                                document.getElementById('Remark').innerHTML = RES1[0].Remark;
                                document.getElementById('QuotationDetails').innerHTML = RES1[0].QuotationDetail;
                                document.getElementById('UserName').innerHTML = RES1[0].UserName;
                            },

                            error: function errorFunc(jqXHR) {
                                //alert(jqXHR.message);
                            }
                        });
                        $.ajax({
                            type: "POST",
                            url: 'WebService_GridClass.asmx/PrintDetailCostingSheets1',
                            data: '{JCNo:' + JCNo + '}',
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'text',
                            success: function (results) {
                                var res = results.replace(/\\/g, '');
                                res = res.replace(/"d":/g, '');
                                res = res.replace(/""/g, '');
                                res = res.substr(1);
                                res = res.slice(0, -1);
                                RES1 = JSON.parse(res.toString());
                                document.getElementById('JobNamee').innerHTML = RES1[0].JobName;
                                document.getElementById('QuotationNo1').innerHTML = RES1[0].QuotationNo;
                                document.getElementById('ContentName').innerHTML = RES1[0].ContentName;
                                document.getElementById('Quantity').innerHTML = RES1[0].Quantity;
                                document.getElementById('SPPaperName').innerHTML = RES1[0].SPPaperName;
                                document.getElementById('ColorStrip').innerHTML = RES1[0].ColorStrip;
                                document.getElementById('PaperCode').innerHTML = RES1[0].PaperCode;
                                document.getElementById('Gripper').innerHTML = RES1[0].Gripper;
                                document.getElementById('PaperBy').innerHTML = RES1[0].PaperBy;

                                document.getElementById('PlateType').innerHTML = RES1[0].PlateType;
                                document.getElementById('JobTrimming').innerHTML = RES1[0].JobTrimming;
                                document.getElementById('GrainDirection').innerHTML = RES1[0].GrainDirection;
                                document.getElementById('StrippingMargin').innerHTML = RES1[0].StrippingMargin;
                                document.getElementById('PrintingMargin').innerHTML = RES1[0].PrintingMargin;
                                document.getElementById('PlateNo').innerHTML = RES1[0].PlateNo;
                                document.getElementById('DieNo').innerHTML = RES1[0].DieNo;
                                document.getElementById('Remarks').innerHTML = RES1[0].Remark;
                                document.getElementById('ArtworkNo').innerHTML = RES1[0].ArtworkNo;
                                document.getElementById('MachineName').innerHTML = RES1[0].MachineName;
                                document.getElementById('PrintingSheetSize').innerHTML = RES1[0].PrintingSheetSize;
                                document.getElementById('BalancePiece').innerHTML = RES1[0].BalancePiece;
                                document.getElementById('FullSheets').innerHTML = RES1[0].FullSheets;
                                document.getElementById('ActualSheets').innerHTML = RES1[0].ActualSheets;
                                document.getElementById('WastageInPercentage').innerHTML = RES1[0].WasteInPercentage;
                                document.getElementById('MakeReadySheetsTotal').innerHTML = RES1[0].MakeReadySheetsTotal;
                                document.getElementById('PaperWastageInKg').innerHTML = RES1[0].PaperWastageInKg;
                                document.getElementById('WastageSheets').innerHTML = RES1[0].WastageSheets;
                                document.getElementById('PlateQuantity').innerHTML = RES1[0].PlateQuantity;
                                document.getElementById('PlateRate').innerHTML = RES1[0].PlateRate;
                                document.getElementById('PlateAmount').innerHTML = RES1[0].PlateAmount;
                                document.getElementById('PaperRate').innerHTML = RES1[0].PaperRate;
                                document.getElementById('PaperAmount').innerHTML = RES1[0].PaperAmount;
                                document.getElementById('MakeReadies').innerHTML = RES1[0].MakeReadies;
                                document.getElementById('MakeReadyRate').innerHTML = RES1[0].MakeReadyRate;
                                document.getElementById('MakeReadyAmount').innerHTML = RES1[0].MakeReadyAmount;
                                document.getElementById('PrintingImpressions').innerHTML = RES1[0].PrintingImpressions;
                                document.getElementById('PrintingRate').innerHTML = RES1[0].PrintingRate;
                                document.getElementById('PrintingAmount').innerHTML = RES1[0].PrintingAmount;
                                if (RES1[0].RateType == "Sheet") {
                                    document.getElementById('Paper').innerHTML = RES1[0].FullSheets;
                                    document.getElementById('PaperRateType').innerHTML = "Rate/Sheet";

                                } else {
                                    document.getElementById('Paper').innerHTML = RES1[0].TotalPaperInKg;
                                    document.getElementById('PaperRateType').innerHTML = "Rate/Kg";
                                }
                                document.getElementById('SpecialFrontColor').innerHTML = RES1[0].SpecialFrontColor;
                                document.getElementById('SpecialColorFrontAmount').innerHTML = RES1[0].SpecialColorFrontAmount;
                                document.getElementById('SpecialBackColor').innerHTML = RES1[0].SpecialBackColor;
                                document.getElementById('SpecialColorBackAmount').innerHTML = RES1[0].SpecialColorBackAmount;
                                document.getElementById('PrintingImpressionss').innerHTML = RES1[0].PrintingImpressions;
                                document.getElementById('CoatingCharges').innerHTML = RES1[0].CoatingCharges;
                                document.getElementById('CoatingAmount').innerHTML = RES1[0].CoatingAmount;
                                if ((RES1[0].ExpectedExecutionTime) > 60) {
                                    document.getElementById('ExpectedExecutionTime').innerHTML = ((RES1[0].ExpectedExecutionTime) / 60) + " Hour, " + ((RES1[0].ExpectedExecutionTime) % 60) + " Minutes";
                                }
                                else {
                                    document.getElementById('ExpectedExecutionTime').innerHTML = (RES1[0].ExpectedExecutionTime) + " Minutes";
                                }
                                document.getElementById('JobSize').innerHTML = "";
                                if (RES1[0].JobHeight != 0) {
                                    document.getElementById('JobSize').innerHTML = "Height=" + RES1[0].JobHeight + "; "
                                }

                                if (RES1[0].JobLength != 0) {
                                    document.getElementById('JobSize').innerHTML = document.getElementById('JobSize').innerHTML + "Length=" + RES1[0].JobLength + "; "
                                }

                                if (RES1[0].JobWidth != 0) {
                                    document.getElementById('JobSize').innerHTML = document.getElementById('JobSize').innerHTML + "Width=" + RES1[0].JobWidth + "; "
                                }
                                if (RES1[0].OpenFlap != 0) {
                                    document.getElementById('JobSize').innerHTML = document.getElementById('JobSize').innerHTML + "Open Flap=" + RES1[0].OpenFlap + "; "
                                }
                                if (RES1[0].OverlapFlap != 0) {
                                    document.getElementById('JobSize').innerHTML = document.getElementById('JobSize').innerHTML + "Overlap Flap=" + RES1[0].OverlapFlap + "; "
                                }
                                if (RES1[0].BottomFlap != 0) {
                                    document.getElementById('JobSize').innerHTML = document.getElementById('JobSize').innerHTML + "Bottom Flap=" + RES1[0].BottomFlap + "; "
                                }
                                document.getElementById('Colors').innerHTML = "Front=" + RES1[0].FrontColor + "; Back=" + RES1[0].BackColor + "; Sp.FC=" + RES1[0].SpecialFrontColor + "; Sp.BC=" + RES1[0].SpecialBackColor;

                                document.getElementById('OnlineCoating').innerHTML = RES1[0].onlinecoating;

                                //==================calculation
                                if (RES1[0].Orientation == "Book Pages" || RES1[0].Orientation == "Table Calendar" || RES1[0].Orientation == "Wall Calendar 2 Side" || RES1[0].Orientation == "Wiro Book") {
                                    document.getElementById('UpsTotal').innerHTML = RES1[0].NoOfSetsOfFrontBack + RES1[0].ProperWAndTSets + RES1[0].FinalWAndTMultipleUpSets;
                                    //    TxtPagesOrUpsName.Text = "Sets";
                                    document.getElementById('PagesPerSheet').innerHTML = ((RES1[0].UpsTotal) * 2);
                                    if (RES1[0].NoOfSetsOfFrontBack != 0) {
                                        var FB = RES1[0].NoOfSetsOfFrontBack + " Set FB/";
                                    }

                                    if (RES1[0].ProperWAndTSets != 0) {
                                        var WT = RES1[0].ProperWAndTSets + " Set " + RES1[0].WorkandTurn + "/ ";
                                    }

                                    if (RES1[0].FinalWAndTMultipleUpSets != 0) {
                                        var WTM = RES1[0].FinalWAndTMultipleUpSets + " Set WTM";
                                    }
                                    document.getElementById('PrintingStyle').innerHTML = FB + WT + WTM;
                                }
                                else if (RES1[0].Orientation == "Wall Calendar 1 Side" || RES1[0].Orientation == "Multiple Leaves") {
                                    document.getElementById('UpsTotal').innerHTML = RES1[0].Pages;
                                    //    TxtPagesOrUpsName.Text = "Total Leaves";
                                    document.getElementById('PagesPerSheet').innerHTML = "";
                                    document.getElementById('PrintingStyle').innerHTML = RES1[0].PrintingStyle;
                                }
                                else {
                                    //    TxtPagesOrUpsName.Text = "Total Ups";
                                    document.getElementById('UpsTotal').innerHTML = RES1[0].UpsTotal;
                                    document.getElementById('PagesPerSheet').innerHTML = "";
                                    document.getElementById('PrintingStyle').innerHTML = RES1[0].PrintingStyle;
                                }
                            },

                            error: function errorFunc(jqXHR) {
                                //alert(jqXHR.message);
                            }
                        });
                    }
                });

            </script>

            <div id="Div1" style="float: left; width: 100%; height: 1em; background-color: white; color: white; font: bold"></div>
            <div style="padding: 1%">
                <div id="Div2" style="float: left; width: 100%; height: auto; background-color: white; color: black; font: bold; padding-bottom: 3em">



                    <table class="auto-style1" style="width: 100%; height: 10px">
                        <tr>
                            <td style="width: 15%">Quotation No</td>
                            <td style="width: 35%">
                                <div id="QuotationNo"></div>
                            </td>
                            <td style="width: 15%">Date</td>
                            <td style="width: 35%">
                                <div id="JobDate"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 40px">
                        <tr>
                            <td style="width: 15%">Client Name</td>
                            <td style="width: 35%">
                                <div id="ClientName"></div>
                            </td>
                            <td style="width: 15%">Address</td>
                            <td style="width: 35%">
                                <div id="Address"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 6.2%">Concern Person</td>
                            <td style="width: 35%">
                                <div id=""></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Contact Details</td>
                            <td style="width: 35%">
                                <div id="ContactNo"></div>
                            </td>
                            <td style="width: 15%">Delivery Date</td>
                            <td style="width: 35%">
                                <div id=""></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Job Name</td>
                            <td style="width: 35%">
                                <div id="JobNamee"></div>
                            </td>
                            <td style="width: 15%">Finalize Quantity</td>
                            <td style="width: 35%">
                                <div id="OrderQuantity"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Catagory</td>
                            <td style="width: 35%">
                                <div id="CatagoryName"></div>
                            </td>
                            <td style="width: 15%">Final Cost</td>
                            <td style="width: 35%">
                                <div id="FinalCost"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Product Code</td>
                            <td style="width: 35%">
                                <div id="ProductCode"></div>
                            </td>
                            <td style="width: 15%">Cost Type</td>
                            <td style="width: 35%">
                                <div id="TypeOfCost"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Remark</td>
                            <td style="width: 35%">
                                <div id="Remark"></div>
                            </td>
                            <td style="width: 15%">Quotation Details</td>
                            <td style="width: 35%">
                                <div id="QuotationDetails"></div>
                            </td>
                        </tr>
                    </table>
                    <br />
                    <br />
                    <table class="auto-style1" style="width: 100%; height: 50px">
                        <tr>
                            <td style="font-family: Arial; font: bold; font-size: large; text-align: center; background-color: #0775b1; color: white">Costing Sheet</td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Job Name</td>
                            <td style="width: 35%">
                                <div id="JobName"></div>
                            </td>
                            <td style="width: 15%">Quotation No.</td>
                            <td style="width: 35%">
                                <div id="QuotationNo1"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Content</td>
                            <td style="width: 35%">
                                <div id="ContentName"></div>
                            </td>
                            <td style="width: 15%">Job Quantity</td>
                            <td style="width: 35%">
                                <div id="Quantity"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Job Size (mm)</td>
                            <td style="width: 35%">
                                <div id="JobSize"></div>
                            </td>
                            <td style="width: 15%">Paper</td>
                            <td style="width: 35%">
                                <div id="SPPaperName"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Color Strip (mm)</td>
                            <td style="width: 35%">
                                <div id="ColorStrip"></div>
                            </td>
                            <td style="width: 15%">Paper Code</td>
                            <td style="width: 35%">
                                <div id="PaperCode"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Gripper (mm)</td>
                            <td style="width: 35%">
                                <div id="Gripper"></div>
                            </td>
                            <td style="width: 15%">Paper By</td>
                            <td style="width: 35%">
                                <div id="PaperBy"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Printing Style</td>
                            <td style="width: 35%">
                                <div id="PrintingStyle"></div>
                            </td>
                            <td style="width: 15%">Plate Type</td>
                            <td style="width: 35%">
                                <div id="PlateType"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Job Trim (mm)</td>
                            <td style="width: 35%">
                                <div id="JobTrimming"></div>
                            </td>
                            <td style="width: 15%">Grain Direction</td>
                            <td style="width: 35%">
                                <div id="GrainDirection"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Stripping Margin</td>
                            <td style="width: 35%">
                                <div id="StrippingMargin"></div>
                            </td>
                            <td style="width: 15%">Colors</td>
                            <td style="width: 35%">
                                <div id="Colors"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Printing Margin</td>
                            <td style="width: 35%">
                                <div id="PrintingMargin"></div>
                            </td>
                            <td style="width: 15%">Plate Type</td>
                            <td style="width: 35%">
                                <div id="PlateNo"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%"></td>
                            <td style="width: 35%">
                                <div id="Div23"></div>
                            </td>
                            <td style="width: 15%">Die No</td>
                            <td style="width: 35%">
                                <div id="DieNo"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Remark</td>
                            <td style="width: 35%">
                                <div id="Remarks"></div>
                            </td>
                            <td style="width: 15%">Artwork No</td>
                            <td style="width: 35%">
                                <div id="ArtworkNo"></div>
                            </td>
                        </tr>
                    </table>
                    <br />
                    <br />
                    <table class="auto-style1" style="width: 100%; height: 50px">
                        <tr>
                            <td style="font-family: Arial; font: bold; font-size: large; text-align: center; background-color: #0775b1; color: white">PLAN DETAILS</td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Machine</td>
                            <td style="width: 35%">
                                <div id="MachineName"></div>
                            </td>
                            <td style="width: 15%">Sheet Size</td>
                            <td style="width: 35%">
                                <div id="PrintingSheetSize"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Total Ups</td>
                            <td style="width: 35%">
                                <div id="UpsTotal"></div>
                            </td>
                            <td style="width: 15%">Balance Piece</td>
                            <td style="width: 35%">
                                <div id="BalancePiece"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Pages Per Sheet</td>
                            <td style="width: 35%">
                                <div id="PagesPerSheet"></div>
                            </td>

                            <td style="width: 15%">Full Sheets</td>
                            <td style="width: 35%">
                                <div id="FullSheets"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Execution Time(Minutes)</td>
                            <td style="width: 35%">
                                <div id="ExpectedExecutionTime"></div>
                            </td>

                            <td style="width: 15%">Cut Sheets</td>
                            <td style="width: 35%">
                                <div id="ActualSheets"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Wastage In %</td>
                            <td style="width: 35%">
                                <div id="WastageInPercentage"></div>
                            </td>

                            <td style="width: 15%">MK Ready Sheets</td>
                            <td style="width: 35%">
                                <div id="MakeReadySheetsTotal"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 15%">Wastage In Kg</td>
                            <td style="width: 35%">
                                <div id="PaperWastageInKg"></div>
                            </td>

                            <td style="width: 15%">Wastage Sheets</td>
                            <td style="width: 35%">
                                <div id="WastageSheets"></div>
                            </td>
                        </tr>
                    </table>
                    <br />
                    <br />
                    <table class="auto-style1" style="width: 100%; height: 20px; background-color: #0775b1; color: white">
                        <tr>
                            <td style="width: 25%">Cost Details</td>
                            <td style="width: 15%">Quantity</td>

                            <td style="width: 15%">Rate</td>
                            <td style="width: 30%">@
                            </td>
                            <td style="width: 15%">Amount
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Plates</td>
                            <td style="width: 15%">
                                <div id="PlateQuantity"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="PlateRate"></div>
                            </td>
                            <td style="width: 30%">Rate/Plate
                            </td>
                            <td style="width: 15%">
                                <div id="PlateAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Paper</td>
                            <td style="width: 15%">
                                <div id="Paper"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="PaperRate"></div>
                            </td>
                            <td style="width: 30%">
                                <div id="PaperRateType"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="PaperAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Make Ready</td>
                            <td style="width: 15%">
                                <div id="MakeReadies"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="MakeReadyRate"></div>
                            </td>
                            <td style="width: 30%">Rate/Make Ready
                            </td>
                            <td style="width: 15%">
                                <div id="MakeReadyAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Printing</td>
                            <td style="width: 15%">
                                <div id="PrintingImpressions"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="PrintingRate"></div>
                            </td>
                            <td style="width: 30%">Rate/1000/Color
                            </td>
                            <td style="width: 15%">
                                <div id="PrintingAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Special Color(F)</td>
                            <td style="width: 15%">
                                <div id="Div40"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="SpecialFrontColor"></div>
                            </td>
                            <td style="width: 30%"></td>
                            <td style="width: 15%">
                                <div id="SpecialColorFrontAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Special Color(B)</td>
                            <td style="width: 15%">
                                <div id="Div41"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="SpecialBackColor"></div>
                            </td>
                            <td style="width: 30%"></td>
                            <td style="width: 15%">
                                <div id="SpecialColorBackAmount"></div>

                            </td>
                        </tr>
                    </table>
                    <table class="auto-style1" style="width: 100%; height: 20px">
                        <tr>
                            <td style="width: 25%">Coating 
                                <div id="OnlineCoating"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="PrintingImpressionss"></div>
                            </td>
                            <td style="width: 15%">
                                <div id="CoatingCharges"></div>
                            </td>
                            <td style="width: 30%">Rate/1000/Color
                            </td>
                            <td style="width: 15%">
                                <div id="CoatingAmount"></div>
                            </td>
                        </tr>
                    </table>
                    <br />
                    <br />
                    <table class="auto-style1" style="width: 100%; height: 50px; text-align: center">
                        <tr>
                            <td style="width: 50%">
                                <br />
                                AUTHORISED SIGN.</td>
                            <td style="width: 50%">
                                <div id="UserName"></div>
                                <br />
                                PREPARED BY</td>
                        </tr>
                    </table>
                </div>

            </div>
        </div>

    </form>
</body>
</html>


