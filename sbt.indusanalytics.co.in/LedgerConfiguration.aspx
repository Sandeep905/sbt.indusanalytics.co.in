<%@ Page Language="VB" AutoEventWireup="false" CodeFile="LedgerConfiguration.aspx.vb" Inherits="LedgerConfiguration" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>LedgerWiseDataModule</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/devextreme/22.1.4/css/dx.light.css" rel="stylesheet" />
    <link href="https://cdn3.devexpress.com/jslib/22.1.4/css/dx.common.css" rel="stylesheet" />
    <script src="https://cdn3.devexpress.com/jslib/22.1.4/js/dx.all.js"></script>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

</head>
<body>
    <%--    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-11">
    </div>--%>
    <div class="container">
        <div class="row mt-4">
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <h5>Ledger Master Client Name</h5>
                <div id="LedgerMasterDropDown"></div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <h5>Ledger Wise Data Grid</h5>
                <div id="LedgerWiseDataGrid"></div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div style="float: right" class="row mt-1 p-2">
                <div style="width: auto; padding: 2px;">
                    <input type="button" value="Update" class="btn btn-primary active p-1" id="BtnUpdate" />
                </div>
            </div>
        </div>

    </div>
</body>
<script src="CustomJS/LedgerWiseDataModule.js" type="text/javascript"></script>
</html>
