<%@ Page Language="VB" AutoEventWireup="false" CodeFile="forgotpassword.aspx.vb" Inherits="forgotpassword" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="author" content="DSAThemes" />
    <meta name="description" content="inPrint - The Business app for printers" />
    <meta name="keywords" content="Offset, Digital, Corrugation, Printers, Packaging, Estimation, Costing, Artificial Intelligence, Quotation, Mobile App" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SITE TITLE -->
    <title>inPrint - The Business app for printers</title>

    <!-- FAVICON AND TOUCH ICONS  -->
    <link rel="shortcut icon" href="inPrintLandingPage/images/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="inPrintLandingPage/images/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="152x152" href="inPrintLandingPage/images/apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="inPrintLandingPage/images/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="inPrintLandingPage/images/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" href="inPrintLandingPage/images/apple-touch-icon.png" />

    <!-- GOOGLE FONTS -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700" rel="stylesheet" />
    
    <!-- TEMPLATE CSS -->
    <link href="inPrintLandingPage/css/style.css" rel="stylesheet" />

    <!-- RESPONSIVE CSS -->
    <link href="inPrintLandingPage/css/responsive.css" rel="stylesheet" />

    <!-- Bootstrap Core Css -->
    <link href="../../plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />
</head>
<body>       
    <!-- PAGE CONTENT
    ============================================= -->
    <section id="hero-2" class="bg-fixed division" style="padding-top:10px;padding-bottom:10px;">
        <div class="container">
            <div class="row">
                <!-- FEATURES IMAGE -->
                <div class="col-lg-7 col-md-6 col-sm-6 col-xs-12">
                    <div class="hero-img">
                        <img class="img-responsive img-login" src="inPrintLandingPage/images/inPrint-Features.png" alt="inPrint-features" />
                    </div>
                </div>
                <div class="col-lg-4 col-md-5 col-sm-6 col-xs-12 form-section">
                    <form id="formforgetpassword" runat="server">
                        <h2>Reset Password</h2>
                        <label class="font-weight-bold">You forgot your password? Here you can easily retrieve a new password.</label>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <i class="fa fa-envelope"></i>
                            </span>
                            <div class="form-line">
                                <input type="email" name="useremail" class="form-control" placeholder="Email" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <label runat="server" class="text-danger" id="validateMsg" visible="false"></label>
                            </div>
                        </div>
                        <div class="row m-top-5">
                            <div class="col-xs-6">
                                <a class="btn btn-login waves-effect" href="Login.aspx">Login Now!</a>
                            </div>
                            <div class="col-xs-4">
                                <asp:Button ID="Btnlogin" runat="server" class="btn btn-login waves-effect" Text="Request new password" />
                            </div>
                        </div>
                    </form>
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
    
</body>
</html>
