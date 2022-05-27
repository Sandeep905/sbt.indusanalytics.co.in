<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Print_Quotation.aspx.vb" Inherits="Print_Quotation" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Welcome To | Indus Analytics</title>
    <!-- Favicon-->
    <link rel="icon" href="images/Indus%20logo.ico" type="image/x-icon" />
    <style>
        .Content_Details {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 97.5%;
        }

            .Content_Details td, .Content_Details th {
                border: 1px solid #ddd;
                padding: 8px;
                padding-top: 4px;
                padding-Bottom: 4px;
                font-size: 12px;
                font: bold;
                word-wrap: break-word;
            }

            /*.Content_Details tr:nth-child(even) {
                background-color: #f2f2f2;
                font-size: 12px;
            }*/

            .Content_Details tr:hover {
                background-color: #ddd;
            }

            .Content_Details th {
                padding-top: 5px;
                padding-bottom: 5px;
                text-align: left;
                background-color: #fff;
                color: #000;
            }

        .forTextBox {
            padding: 5px 5px;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 12px;
            font-family: DXIcons,Helvetica, sans-serif;
            width: 100%;
            height: 30px;
            -webkit-transition: all 0.30s ease-in-out;
            -moz-transition: all 0.30s ease-in-out;
            -ms-transition: all 0.30s ease-in-out;
            -o-transition: all 0.30s ease-in-out;
            border: 1px solid #DDDDDD;
            outline: none;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div style="width: 100%; height: 99%; float: left; border: 2px solid; font-family: Arial;">
                <script src="js/2.2.3%20jquery.min.js"></script>

                <link href="css/DxCommon.css" rel="stylesheet" type="text/css" />
                <link href="css/DxLight.css" rel="stylesheet" type="text/css" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.2/jszip.min.js"></script>
                <%--Use for Export data --%>
                <script src="https://cdn3.devexpress.com/jslib/16.2.4/js/dx.all.js"></script>
                <%-- DevExpress Control Grid --%>


                <span id="lblData"></span><span id="dd"></span>
                <%--<img src=" &  & " height="130" width="1000" style="margin-left: 1em; margin-right: 1em" />--%>
                <div id="ImgQ">
                    <%--<img src="s" id="Img_Quote"  height="130" width="1000" style="margin-left: 1em; margin-right: 1em" />--%>
                </div>
                <div style="float: left; width: 100%;">
                    <div style="float: left; width: 100%; text-align: center; margin-top: 1em"><b>QUOTATION</b></div>
                    <table class='Content_Details' style="margin: 15px">
                        <tbody>
                            <tr>
                                <td style="width: 200px">Quote No :-</td>
                                <td><span id="Quote_No"></span></td>
                            </tr>
                            <tr>
                                <td style="width: 200px">Date :-</td>
                                <td><span id="Date_Quote"></span></td>
                            </tr>
                            <tr>
                                <td style="width: 200px">To :-</td>
                                <td><span id="Client_Name"></span></td>
                            </tr>
                            <tr>
                                <td style="width: 200px">Address :-</td>
                                <td><span id="Address"></span></td>
                            </tr>
                            <tr>
                                <td style="width: 200px">Subject :-</td>
                                <td>Quotation For : <span id="Job_Name"></span></td>
                            </tr>
                            <%--<tr>
                                <td><span id="Header"></span></td>
                            </tr>--%>
                            <tr>
                                <td style="width: 200px"><span id="jobDictd1">Job Description :- </span></td>
                                <td><span id="Job_Name2"></span></td>
                            </tr>
                        </tbody>
                    </table>

                    <table class='Content_Details' style="margin: 15px;">
                        <tbody>
                            <tr>
                                <td style="width: 100px">Kind Attention :- </td>
                                <td>
                                    <input type="text" id="KindAtt" class="forTextBox" /></td>
                            </tr>
                        </tbody>
                    </table>

                    <table class='Content_Details' style="margin: 15px;">
                        <tbody>
                            <tr>
                                <td style="width: 100%">Dear Sir / Madam, </td>
                            </tr>
                            <tr>
                                <td style="width: 100%">
                                    <input aria-multiline="true" type="text" id="DearTag" class="forTextBox" value="This has reference of your inquiry regarding your printing job." /></td>
                            </tr>
                            <tr>
                                <td style="width: 100%">
                                    <b class="dx-font-m">Please find below details and our most competitive rates as under.</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="Div_ProductDetails" style="float: left; width: 100%; height: auto; padding-left: 1em">
                        <%--<strong style="font-size: 15px">Product Details :-</strong>
                        <table id='Content_DetailsTBL' class='Content_Details'>
                            <thead style="height: 0em; border: 2px solid #eee;">
                                <tr>
                                    <th>Content Name</th>
                                    <th>Job Size</th>
                                    <th>Printing</th>
                                    <th>Paper</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody id="Body_Content_DetailsTBL">
                                <tr id="Bdy_Content_DetailsTBL"></tr>
                            </tbody>

                        </table>--%>
                    </div>

                    <div id="Div_PriceDetails" style="float: left; margin-top: 1em; width: 100%; height: auto; padding-left: 1em">
                        <%-- <strong style="font-size: 15px">Price Details :-</strong>
                        <table class='Content_Details'>
                            <thead style="height: 0em; border: 2px solid #eee;">
                                <tr>
                                    <th>Quotation Ref</th>
                                    <td><span id="QRef"></span></td>
                                    <th>Product Code</th>
                                    <td><span id="ArtWork"></span></td>
                                </tr>
                            </thead>
                        </table>

                        <table id='Price_DetailsTBL' class='Content_Details'>
                            <thead style="height: 0em; border: 2px solid #eee;">
                                <tr>
                                    <th>Quantity</th>
                                    <th>Quoted Price(Unit)</th>
                                    <th>Quoted Price(Unit/1000)</th>
                                </tr>
                            </thead>
                            <tbody id="Body_Price_DetailsTBL">
                                <tr id="Bdy_Price_DetailsTBL"></tr>
                            </tbody>
                        </table>--%>
                    </div>
                </div>

                <div style="float: left; margin-top: 1em; width: 100%">
                    <table class='Content_Details' style="margin: 15px;">
                        <tbody>
                            <tr>
                                <td style="width: 100px">Remark :- </td>
                                <td>
                                    <input type="text" id="Remark" class="forTextBox" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div id="Footer" style="float: left; margin-bottom: 1em; width: 100%">
                    <table class='Content_Details' style="margin: 15px;">
                        <tbody>
                            <tr>
                                <td style="width: 100%">Terms & Conditions : </td>
                            </tr>
                            <tr>
                                <td style="width: 100%">
                                    <textarea id="Terms" class="forTextBox" style="border: none; width: 100%"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="float: left; margin-top: 1em; width: 100%; height: auto; padding-left: 1em">
                    <strong style="font-size: 15px">Thank You</strong><br />
                    <strong style="font-size: 15px">For : </strong>
                    <span id="CompanyName"></span>
                </div>

                <%--<div style="margin-top: 1em; margin-bottom: 0.7em">
                    <span style="float: left; margin-left: 1em">For :-  </span>
                    <div id="Company_Name" style="float: left"></div>
                </div>--%>
                <div id="SignImg" style="float: left; margin-left: 1em; margin-right: 1em; width: 100%">
                    <%--<img src="images/sig.jpg" height="90" width="300" style="float: left; margin-left: 1em; margin-right: 1em; margin-top: 0.5em" />--%>
                </div>
                <br />
                <div id="Person" style="float: left; margin-left: 1em; margin-top: 1em"></div>
                <br />
                <br />
            </div>
        </div>
    </form>

    <script src="CustomJS/PrintQuotes.js" type="text/javascript"></script>
    <script>
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = mm + '/' + dd + '/' + yyyy;
        document.getElementById("Date_Quote").innerHTML = today;
    </script>
</body>
</html>

