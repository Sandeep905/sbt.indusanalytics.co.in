<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ReportSalesOrderBooking.aspx.vb" Inherits="ReportSalesOrderBooking" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=15.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      <style>
        body:nth-of-type(1) img[src*="Blank.gif"] {
            display: none;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <br />
            <rsweb:reportviewer id="ReportViewer1" runat="server" width="100%" height="1000px">
            </rsweb:reportviewer>
        </div>
    </form>
</body>
</html>
