<%@ Page Title="Key Line" Language="VB" AutoEventWireup="false" CodeFile="KeyLineInMM.aspx.vb" Inherits="keylineinmm" %>

<html>
<body>
    <!-- Bootstrap Core Css -->
    <link href="../../plugins/bootstrap/css/bootstrap.css" rel="stylesheet">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <svg id="mysvg" width="0mm" height="0mm" style="background-color: white">
            <g transform="scale(3.7795275591)">
                <line />
                <path d="" stroke="black" stroke-width=".1" fill="transparent" />
                <text id="txt" x="5" y="100" style="font-size: 5px"></text>
            </g>
        </svg>
    </div>
    <!-- Jquery Core Js -->
    <script src="../../plugins/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core Js -->
    <script src="../../plugins/bootstrap/js/bootstrap.js"></script>
    <script src="CustomJS/DrawKeyLine.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>

</body>
</html>

