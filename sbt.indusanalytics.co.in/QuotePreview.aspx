<%@ Page Language="VB" AutoEventWireup="false" CodeFile="QuotePreview.aspx.vb" Inherits="QuotePreview" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Quote Preview</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
    <link rel="icon" href="images/Indus logo.ico" type="image/x-icon" />

    <link href="plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="css/style.css" rel="stylesheet" />

    <!-- Themes. You can choose a theme from css/themes instead of get all themes -->
    <link href="css/themes/all-themes.css" rel="stylesheet" />

    <link href="CustomCSS/Dynamic.css" rel="stylesheet" />
    <link href="CustomCSS/AdditinalDesign.css" rel="stylesheet" />

</head>
<body>
    <form id="form1" runat="server">
        <input type="hidden" name="HdnUser" value="" runat="server" id="HdnUser" />
        <div class="body">
            <b class="font-11">Email Details</b>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: 1px solid">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <b class="font-11">To</b>
                    <input id="TxtEmailTo" type="email" class="forTextBox" />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <b class="font-11">CC</b>
                    <input id="TxtEmailCC" type="email" class="forTextBox" />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <b class="font-11">BCC</b>
                    <input id="TxtEmailBcc" type="email" class="forTextBox" />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <b class="font-11">Subject</b>
                    <input id="TxtSubject" type="text" class="forTextBox" />
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Message</b>
                    <textarea id="TxtEmailBody" rows="3" style="height: 100%" class="forTextBox m-t-0"></textarea>
                </div>
            </div>

            <b class="font-11">Quote Details</b>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: 1px solid">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Postal Name</b>
                    <input id="TxtPostalName" type="text" class="forTextBox" />
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Postal Address</b>
                    <textarea id="TxtAddress" rows="3" style="height: 100%" class="forTextBox m-t-0"></textarea>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Kind Attention</b>
                    <input id="TxtAttention" type="text" class="forTextBox" />
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Header Text</b>
                    <textarea id="TxtHeaderText" rows="3" style="height: 100%" class="forTextBox m-t-0"></textarea>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <b class="font-11">Footer Text</b>
                    <textarea id="TxtFooterText" rows="5" style="height: 100%" class="forTextBox m-t-0"></textarea>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <b class="font-11">Quote By</b>
                    <input type="text" name="TxtQuoteBy" value="" class="forTextBox" id="TxtQuoteBy" />
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <b class="font-11">Designation</b>
                    <input type="text" name="TxtDesignation" value="" class="forTextBox" id="TxtDesignation" />
                </div>

                <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12">
                    <b class="font-11">Currency Symbol</b>
                    <input type="text" name="TxtCurrency" value="" class="forTextBox" id="TxtCurrency" />
                </div>
                <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12">
                    <b class="font-11">Conversion Value</b>
                    <input type="number" name="TxtConvertValue" min="0" value="" class="forTextBox" id="TxtConvertValue" />
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 margin-0 padding-0">
                    <div id="GridContentDetails"></div>
                    <textarea rows="1" style="width: 100%; height: 100%;" class="forTextBox" id="TxtProcesses"></textarea>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 margin-0 padding-0">
                    <div id="GridContentQtyDetails"></div>

                    <input type="checkbox" class="filled-in chk-col-red" id="ChkHideContDetails" />
                    <label for="ChkHideContDetails" style="height: 20px">Hide Content Details</label>
                    <input type="button" name="BtnPreviewQuote" value="Preview" id="BtnPreviewQuote" class="btn btn-primary" />
                </div>
            </div>
        </div>
    </form>
    <!-- Jquery Core Js -->
    <script src="../../plugins/jquery/jquery.min.js"></script>

    <%-- DevExpress Control Grid --%>
    <link type="text/css" href="CustomCSS/dx.common.css" rel="stylesheet" />
    <link type="text/css" href="CustomCSS/dx.light.css" rel="stylesheet" />
    <script src="js/dx.all.19.2.3.js"></script>
    <!-- Bootstrap Core Js -->
    <script src="plugins/bootstrap/js/bootstrap.js"></script>

    <!-- Select Plugin Js -->
    <script src="plugins/bootstrap-select/js/bootstrap-select.js"></script>

    <script type="text/javascript" src="CustomJS/QuoteMailPreview.js"></script>
    <script type="text/javascript">
        var user = document.getElementById("HdnUser").value;
        if (user === "") {
            window.close();
        }
    </script>
</body>
</html>
