﻿<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ProjectQuotationReportViewer.aspx.vb" Inherits="ProjectQuotationReportViewer" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=15.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Project Quotation</title>
    <style>
        body:nth-of-type(1) img[src*="Blank.gif"] {
            display: none;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Width="100%" Height="1000px"></rsweb:ReportViewer>
        </div>
    </form>
</body>
</html>
