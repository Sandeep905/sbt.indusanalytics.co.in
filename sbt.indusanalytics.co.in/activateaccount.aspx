<%@ Page Language="VB" AutoEventWireup="false" CodeFile="activateaccount.aspx.vb" Inherits="activateaccount" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
    <title>Activation | Indus Analytics</title>
    <!-- Favicon-->
    <link rel="icon" href="../../images/Indus logo.ico" type="image/x-icon" />

    <!-- font-awesome.css -->
    <link href="plugins/font-awesome/css/font-awesome.css" rel="stylesheet" />
    <!-- Bootstrap Core Css -->
    <link href="../../plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <!-- Waves Effect Css -->
    <link href="../../plugins/node-waves/waves.css" rel="stylesheet" />

    <!-- Animation Css -->
    <link href="../../plugins/animate-css/animate.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="../../css/style.css" rel="stylesheet" />
</head>

<body class="login-page">
    <div class="login-box">
        <div class="card">
            <div style="background-color: #fff; padding: 5px">
                <img class="img-responsive" src="inPrintLandingPage/images/Indus-Analytics-Logo.png" alt="Indus-logo" />
            </div>
            <div class="body">
                <form id="FormSetPassword" runat="server" visible="false">
                    <div class="msg font-18 font-bold">Create Password to enjoy inPrint</div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-lock"></i>
                        </span>
                        <div class="form-line">
                            <input type="password" id="txt_password" runat="server" class="form-control" name="password" placeholder="Password" required="required" autofocus="autofocus"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-lock"></i>
                        </span>
                        <div class="form-line">
                            <input type="password" id="TxtConfirmPassword" runat="server" class="form-control" name="confirmpassword" placeholder="Confirm Password" required="required" autofocus="autofocus" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-4">
                            <asp:Button ID="BtnSubmit" runat="server" class="btn btn-block bg-pink waves-effect" Text="Submit" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 align-left">
                            <label runat="server" class="text-danger" id="validateMsg" visible="false"></label>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>

    <!-- Jquery Core Js -->
    <script src="../../plugins/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core Js -->
    <script src="../../plugins/bootstrap/js/bootstrap.js"></script>

    <!-- Validation Plugin Js -->
    <script src="../../plugins/jquery-validation/jquery.validate.js"></script>

    <!-- Custom Js -->
    <script src="../../js/admin.js"></script>
    
</body>

</html>
