<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Login.aspx.vb" Inherits="Login" %>

<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Sign In | Indus Analytics</title>
    <!-- Favicon-->
    <link rel="icon" href="../../images/Indus logo.ico" type="image/x-icon">

    <!-- font-awesome.css -->
    <link href="plugins/font-awesome/css/font-awesome.css" rel="stylesheet" />
    <!-- Bootstrap Core Css -->
    <link href="../../plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

    <!-- Waves Effect Css -->
    <link href="../../plugins/node-waves/waves.css" rel="stylesheet" />

    <!-- Animation Css -->
    <link href="../../plugins/animate-css/animate.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="../../css/style.css" rel="stylesheet">
</head>

<body class="login-page">
    <div class="login-box">
        <div class="logo">
            <a href="javascript:void(0);"><b><%=System.Configuration.ConfigurationManager.AppSettings("CompanyName")%></b></a>
        </div>
        <div class="card">
            <div class="body">
                <form id="form1" runat="server">
                    <div class="msg">Sign in to start your session</div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-user"></i>
                        </span>
                        <div class="form-line">
                            <input type="text" id="txt_user" runat="server" class="form-control" name="username" placeholder="Username" required autofocus>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-lock"></i>
                        </span>
                        <div class="form-line">
                            <input type="password" id="txt_password" runat="server" class="form-control" name="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-8 p-t-5">
                            <input type="checkbox" runat="server" id="rememberme" name="rememberme" class="filled-in chk-col-pink">
                            <label for="rememberme">Remember Me</label>
                        </div>
                        <div class="col-xs-4">
                            <asp:Button ID="btnlogin" runat="server" class="btn btn-block bg-medium-blue waves-effect" Text="Sign in" />
                        </div>
                    </div>
                    <div class="row">
                            <div class="col-xs-12 align-left">
                                <label runat="server" class="text-danger" id="validateMsg" visible="false"></label>
                            </div>
                        </div>
                    <div class="row m-t-15 m-b--20">
                        <div class="col-xs-6">
                            <a href="VendorRegistration.aspx">Register Now!</a>
                        </div>
                        <div class="col-xs-6 align-right">
                            <a href="#">Forgot Password?</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="logo">
            <small>@Indus Analytics</small>
        </div>
    </div>

    <!-- Jquery Core Js -->
    <script src="../../plugins/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core Js -->
    <script src="../../plugins/bootstrap/js/bootstrap.js"></script>

    <!-- Waves Effect Plugin Js -->
    <script src="../../plugins/node-waves/waves.js"></script>

    <!-- Validation Plugin Js -->
    <script src="../../plugins/jquery-validation/jquery.validate.js"></script>

    <!-- Custom Js -->
    <script src="../../js/admin.js"></script>
    <script src="../../js/pages/examples/sign-in.js"></script>

    <script type="text/javascript">

        window.onload = function () {
            document.getElementById("txt_user").focus();
            if (localStorage) {
                localStorage.removeItem('activeID');
                localStorage.removeItem('activeName');
            }
        };

        //window.onbeforeunload = function () {            
        //    return '';
        //};

        function preventBack() {
            window.history.forward();
        }
        setTimeout("preventBack()", 0);
        window.onunload = function () { null };

    </script>

</body>

</html>
