<%@ Page Language="VB" AutoEventWireup="false" CodeFile="BookPlanning.aspx.vb" Inherits="BookPlanning" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

    <!-- Bootstrap Core Css -->
    <link href="plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <!-- Animation Css -->
    <link href="plugins/animate-css/animate.css" rel="stylesheet" />

    <!-- Sweetalert Css -->
    <link href="../../plugins/sweetalert/sweetalert.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="css/style.css" rel="stylesheet" />

    <!-- Themes. You can choose a theme from css/themes instead of get all themes -->
    <link href="css/themes/all-themes.css" rel="stylesheet" />

    <link href="CustomCSS/Dynamic.css" rel="stylesheet" />
    <style>
        .DialogBoxCustom .iconButton {
            display: inline-block;
            padding: 0.5em 1em;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            color: #fff;
            background-image: -webkit-linear-gradient(45deg, #42909A 0%, #00DDD2 100%);
            background-image: linear-gradient(45deg, #42909A 0%, #00DDD2 100%);
            transition: .4s;
        }

            .DialogBoxCustom .iconButton:hover, .DialogBoxCustom .iconButton:focus {
                background-image: -webkit-linear-gradient(45deg, #42909A 50%, #00DDD2 100%);
                background-image: linear-gradient(45deg, #42909A 50%, #00DDD2 100%);
                color: #fff;
            }

        .disabledbutton {
            pointer-events: none;
            opacity: 0.4;
        }
    </style>

</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding: 0px; margin: 0px; height: auto;">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <b class="font-11" style="width: auto;">Book Quantity</b><br />
                    <div class='content_div' style='height: auto; width: auto; float: left; text-align: center'>
                        <input type="number" tabindex="1" class="forTextBox" name="BookQuantity" min="0" id="BookQuantity" value="" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" style="min-height: 60px; min-width: 50%;">
                    <b class="font-11" style="width: auto;">Book Category</b><br />
                    <div class='content_div' style='height: auto; width: auto; float: left; text-align: center'>
                        <div id="BookCategories"></div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" style="min-height: 160px">
                    <div class='content_div' style='height: auto; text-align: center'>
                        <img id="PlanBookImg" src="images/Contents/Wrinting Pad.jpg" class="col-xs-5 col-sm-12 col-md-12 col-lg-12" />
                    </div>
                    <b class="font-11" style="width: auto;">Job Size</b><br />
                    <div style="width: auto;">
                        <input required="required" type='text' id='BookHeight' placeholder='Height' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: block;" />
                        <input required="required" type='text' id='BookLength' placeholder='Length' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: block;" />
                    </div>
                </div>
                <div id="BookJob_Size" class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <b class="font-11">Book Parameters</b>
                    <br />
                    <div style="width: auto;">
                        <input type='text' id='BookHinge' placeholder='Hinge' class='forTextBox disabledbutton' style="float: left; width: 25%; margin: .2em; /*display: none; */" />
                        <input type='text' id='BookSpine' placeholder='Book Spine' class='forTextBox disabledbutton' style="float: left; width: 28%; margin: .2em; /*display: none; */" />
                        <input type='text' id='BookLoops' placeholder='Loops' class='forTextBox disabledbutton' style="float: left; width: 25%; margin: .2em; /*display: none; */" />
                    </div>
                    <div style="width: auto;">
                        <input type='text' id='BookCoverTurnIn' placeholder='Cover Turn In' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em; /*display: none; */" />
                        <input type='text' id='BookExtension' placeholder='Extension' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em; /*display: none; */" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                    <b class="font-11">Book Trimming</b><br />
                    <div style="width: auto;">
                        <input type='text' id='BookTrimmingtop' placeholder='Top' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                        <input type='text' id='BookTrimmingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" /><br />
                    </div>
                    <div style="width: auto;">
                        <input type='text' id='BookTrimmingleft' placeholder='Left' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                        <input type='text' id='BookTrimmingright' placeholder='Right' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                    </div>
                </div>
                <div id="dustCoverMargins" class="col-xs-12 col-sm-3 col-md-3 col-lg-3 disabledbutton">
                    <b class="font-11">Dust Cover Margins</b><br />
                    <div style="width: auto;">
                        <input type='text' id='BookDusttop' placeholder='Top' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                        <input type='text' id='BookDustbottom' placeholder='Bottom' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" /><br />
                    </div>
                    <div style="width: auto;">
                        <input type='text' id='BookDustleft' placeholder='Left' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                        <input type='text' id='BookDustright' placeholder='Right' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div class='content_div' style='height: auto; text-align: center'>
                        <img id="PlanBookContImg" src="images/Contents/Wrinting Pad.jpg" style='height: 10em; width: 100%; left: 0' />
                    </div>
                </div>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 DialogBoxCustom m-t-5">
                <b class="font-11" style="width: auto;">Select Contents</b><br />
                <div id="GridBookContents"></div>
                <textarea id="ContentName" style="display: none;"></textarea>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 DialogBoxCustom m-t-5">
                <%--<a id="Add_Content_Button" class="iconButton" style="cursor: pointer; margin-right: 5px; float: left;">
                    <i class="fa fa-pencil-square-o fa-lg" aria-hidden="true">&nbsp Add Content</i>
                </a>--%>
                <a id="Apply_Book_Button" class="iconButton" style="cursor: pointer; margin-right: 5px; float: left;">Apply</a>
            </div>
        </div>
    </form>

    <!-- Jquery Core Js -->
    <script src="../../plugins/jquery/jquery.min.js"></script>

    <%-- DevExpress Control Grid --%>
    <link type="text/css" href="CustomCSS/dx.common.css" rel="stylesheet" />
    <link type="text/css" href="CustomCSS/dx.light.css" rel="stylesheet" />
    <%--<link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.2.3/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.2.3/css/dx.light.css" />--%>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.2/jszip.min.js"></script>
    <%--Use for Export data --%>
    <script src="https://cdn3.devexpress.com/jslib/18.2.3/js/dx.all.js"></script>

    <script src="CustomJS/BookPlanning.js" type="text/javascript"></script>
</body>
</html>
