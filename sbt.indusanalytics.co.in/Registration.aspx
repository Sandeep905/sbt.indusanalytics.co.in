<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Registration.aspx.vb" Inherits="Registration" %>

<!DOCTYPE html>

<html>

<head>



    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="author" content="DSAThemes" />
    <meta name="description" content="inPrint - The Business app for printers" />
    <meta name="keywords" content="Offset, Digital, Corrugation, Printers, Packaging, Estimation, Costing, Artificial Intelligence, Quotation, Mobile App">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SITE TITLE -->
    <title>inPrint - The Business app for printers</title>

    <!-- FAVICON AND TOUCH ICONS  -->
    <link rel="shortcut icon" href="inPrintLandingPage/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="inPrintLandingPage/images/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="152x152" href="inPrintLandingPage/images/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="120x120" href="inPrintLandingPage/images/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="inPrintLandingPage/images/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" href="inPrintLandingPage/images/apple-touch-icon.png">

    <!-- GOOGLE FONTS -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700" rel="stylesheet">

    <!-- FONT ICONS -->
    <link href="inPrintLandingPage/css/fa-svg-with-js.css" rel="stylesheet">
    <link href="inPrintLandingPage/css/pe-icon-7-stroke.css" rel="stylesheet">

    <!-- On Scroll Animations -->
    <link href="inPrintLandingPage/css/animate.css" rel="stylesheet">

    <!-- TEMPLATE CSS -->
    <link href="inPrintLandingPage/css/style.css" rel="stylesheet">

    <!-- RESPONSIVE CSS -->
    <link href="inPrintLandingPage/css/responsive.css" rel="stylesheet">

    <!-- Bootstrap Core Css -->
    <link href="../../plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

    <%-- DevExpress Control Grid --%>
    <link type="text/css" href="CustomCSS/dx.common.css" rel="stylesheet" />
    <link type="text/css" href="CustomCSS/dx.light.css" rel="stylesheet" />
    <script src="js/dx.all.19.2.3.js"></script>
    <%-- DevExpress Control Grid --%>
</head>

<body>

    <!-- PRELOADER
    ============================================= -->
    <div id="loader-wrapper">
        <div id="loader">
            <ul class="cssload-flex-container">
                <li><span class="cssload-loading"></span></li>
            </ul>
        </div>
    </div>

    <!-- PAGE CONTENT
    ============================================= -->
    <section id="hero-2" class="bg-fixed division" style="padding-top: 10px; padding-bottom: 10px;">
        <div class="container">
            <div class="row d-flex align-items-center">
                <!-- HERO IMAGE -->
                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-12 animated" data-animation="fadeInLeft" data-animation-delay="400">
                    <div class="hero-img">
                        <img class="img-responsive img-login" src="inPrintLandingPage/images/inPrint-Features.png" alt="inPrint-features">
                    </div>
                </div>
                <div class="col-lg-4 col-md-5 col-sm-6 col-xs-12 animated form-section" data-animation="fadeInRight" data-animation-delay="400">
                    <form id="form1" runat="server">
                        <h2 class="font-weight-bold">inPrint Registration...</h2>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <i class="fa fa-flag"></i>
                            </span>
                            <select id="country-select" class="form-control h-25" required>
                                <option selected disabled>Country</option>
                            </select>
                        </div>
                        <div class="input-group m-top-5">
                            <span class="input-group-addon">
                                <i class="fa fa-envelope"></i>
                            </span>
                            <div class="form-line">
                                <input type="email" id="email" name="email" class="form-control" placeholder="Email" required autofocus />
                            </div>
                        </div>

                        <div class="input-group m-top-5">
                            <span class="input-group-addon">
                                <i class="fa fa-phone"></i>
                            </span>
                            <div class="form-line" id="forphone">
                                <input type="tel" id="Phone" maxlength="10" name="Phone" class="form-control" placeholder="Phone number" required />
                                <label class="hidden" hidden id="LabelMob"></label>
                            </div>
                        </div>
                        <div class="input-group m-top-5">
                            <span class="input-group-addon">
                                <i class="fa fa-user"></i>
                            </span>
                            <div class="form-line">
                                <input type="text" id="UserName" data-validation="alphanumeric" runat="server" class="form-control" name="UserName" placeholder="User name" required />
                            </div>
                        </div>
                        <div class="input-group m-top-5">
                            <span class="input-group-addon">
                                <i class="fa fa-building"></i>
                            </span>
                            <div class="form-line">
                                <input type="text" id="CompanyName" data-validation="alphanumeric" runat="server" class="form-control" name="CompanyName" placeholder="Company name" required />
                            </div>
                        </div>
                        <div class="row m-top-5">
                            <div class="col-xs-8" style="margin-top: 2px">
                                <b>Already enjoyed inPrint?
                                <a class="btn btn-login" href="Login.aspx">Login</a>
                                </b>
                            </div>
                            <div class="col-xs-4" style="float: right">
                                <a id="btnRegister" class="btn btn-block btn-login waves-effect">Register</a>
                            </div>
                        </div>
                        <div class="row m-t-5">
                            <div class="col-xs-12">
                                <a class="text-danger" href="inPrintLandingPage/privacypolicy.html" target="_blank">Privacy Policy</a>
                            </div>
                        </div>
                    </form>
                    <div id="OtpVerify" class="hidden">
                        <label class="font-weight-bold">Verify your mobile number...</label>
                        <div class="input-group m-top-5">
                            <span class="input-group-addon">
                                <i class="fa f-phone"></i>
                            </span>
                            <div class="form-line">
                                <input type="text" id="txtOTP" maxlength="4" class="form-control" placeholder="Enter OTP" required />
                            </div>
                        </div>
                        <div class="col-lg-12 col-xs-3 col-sm-5 col-md-4 m-top-5">
                            <input type="button" name="btnSubmitOtp" value="Submit" class="btn btn-success" id="btnSubmitOtp" />
                            <input type="button" name="btnModifyNumber" value="Modify" class="btn btn-warning" id="btnModifyNumber" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 align-left">
                            <label class="text-danger hidden" id="validateMsg"></label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End row -->
        </div>
        <!-- End container -->
    </section>

    <!-- EXTERNAL SCRIPTS
    ============================================= -->
    <script src="inPrintLandingPage/js/jquery-3.2.1.min.js"></script>
    <script src="inPrintLandingPage/js/bootstrap.min.js"></script>
    <script src="inPrintLandingPage/js/fontawesome-all.js"></script>
    <script src="inPrintLandingPage/js/jquery.appear.js"></script>
    <!-- Custom Script -->
    <script src="inPrintLandingPage/js/customlogin.js"></script>
    <script src="CustomJS/Registration.js"></script>
</body>
</html>
