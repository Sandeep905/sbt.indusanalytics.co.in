﻿<%@ Page Language="VB" AutoEventWireup="false" CodeFile="PrintMachineWiseSchedule.aspx.vb" Inherits="PrintMachineWiseSchedule" %>
<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=15.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Print Machine Wise Schedule</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <br />
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Width="100%" Height="580px">
        </rsweb:ReportViewer>
    
        </div>
    </form>
</body>
</html>