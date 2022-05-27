<%@ Page Title="Invoice Approval" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="InvoiceApproval.aspx.vb" Inherits="InvoiceApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px;">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="GridInvoiceData"></div>
            </div>
        </div>
    </div>
    <div id="image-indicator"></div>
    <script src="CustomJS/InvoiceApproval.js" type="text/javascript"></script>
</asp:Content>

