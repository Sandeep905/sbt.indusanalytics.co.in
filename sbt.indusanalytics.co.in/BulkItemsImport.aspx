<%@ Page Language="VB" AutoEventWireup="false" CodeFile="BulkItemsImport.aspx.vb" Inherits="BulkItemsImport" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache, must-revalidate, post-check=0, pre-check=0" />
    <meta http-equiv="cache-control" content="max-age=0" />

    <title>Indus Analytics</title>

    <!-- Bootstrap Core Css -->
    <link href="plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />
    <!-- Custom Css -->
    <link href="css/style.css" rel="stylesheet" />
    <link type="text/css" href="CustomCSS/dx.common.css" rel="stylesheet" />
    <link type="text/css" href="CustomCSS/dx.light.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-10">
                <h3 class="align-center">Bulk Item Import</h3>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                    <label>Item Group Name</label>
                    <div id="SelItemGroup"></div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                    <label>Upload File</label>
                    <input type="file" id="fileUpload" class="btn waves-effect" />
                </div>
                <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">
                    <label>Sheet Number</label>
                    <input type="number" name="SheetNo" id="SheetNumber" value="" min="0" />
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-2 m-t-5">
                    <br class="hidden-xs" />
                    <input type="button" id="upload" value="Show" class="btn btn-warning waves-effect" onclick="Upload()" />
                    <input type="button" id="ImportData" value="Import Data" class="btn btn-success waves-effect" onclick="SaveData()" />
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5 m-l-15">
                <div class="progress-info">
                    Time left 00:00:<span id="timer">0</span>
                    Total Items:<span id="totalItems">0</span>
                </div>
                <div id="progress">
                    <div id="progressBarStatus"></div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: .5em; margin-bottom: .5em; height: 33em; width: 100%; overflow-y: auto">
                <div id="dvExcel"></div>
            </div>
        </div>
        <div id="LoadIndicator"></div>

        <!-- Jquery Core Js -->
        <script src="../../plugins/jquery/jquery.min.js"></script>
        <%--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js"></script>--%>
        <script type="text/javascript" src="js/xlsx.full.min.js"></script>

        <%-- DevExpress Control Grid --%>
        <script src="js/jszip.js"></script>
        <script src="js/dx.all.19.2.3.js"></script>
        <%-- DevExpress Control Grid --%>

        <script src="CustomJS/BulkItemsImport.js"></script>
    </form>
</body>
</html>
