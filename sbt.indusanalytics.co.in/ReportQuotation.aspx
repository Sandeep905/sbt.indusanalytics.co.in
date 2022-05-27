﻿<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ReportQuotation.aspx.vb" Inherits="ReportQuotation" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <!-- Bootstrap Core Css -->
    <link href="plugins/bootstrap/css/bootstrap.css" rel="stylesheet" />

    <link href="CustomCSS/AdditinalDesign.css" rel="stylesheet" />
</head>
<body style="height: 505px">
    <form id="form1" runat="server">

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
            <input type="button" name="BtnMailBox" value="Send Mail" data-target="#myModalMail" data-toggle="modal" class="btn btn-primary" />
            <label id="MailError" runat="server" class="danger"></label>
        </div>
        <!-- The Layout Mail Box -->
        <div class="modal fade" id="myModalMail" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
            <div class="modal-dialog modal-lg" role="document" style="">
                <%--width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px--%>
                <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: 100%">
                    <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                        <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                            <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                        </a>
                    </div>

                    <div class="modal-body" style="position: initial; padding-right: 0px">
                        <div style="width: 100%; height: auto; overflow-y: auto;">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: 1px solid">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <label style="float: left; width: 100%;">To</label>
                                    <input type="text" name="TxtEmailTo" id="TxtEmailTo" runat="server" class="forTextBox" />
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <label style="float: left; width: 100%;">CC</label>
                                    <input id="TxtEmailCC" runat="server" type="text" class="forTextBox" />
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <label style="float: left; width: 100%;">BCC</label>
                                    <input id="TxtEmailBcc" runat="server" type="text" class="forTextBox" />
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <label style="float: left; width: 100%;">Subject</label>
                                    <input id="TxtSubject" runat="server" type="text" class="forTextBox" />
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <label style="float: left; width: 100%;">Message</label>
                                    <textarea id="TxtEmailBody" runat="server" class="forTextBox" style="height: 100%" rows="3"></textarea>
                                </div>

                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                                    <asp:Button Text="Send Mail" CssClass="btn btn-success" runat="server" OnClick="Email" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                        <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Jquery Core Js -->
        <script src="../../plugins/jquery/jquery.min.js"></script>
        <!-- Bootstrap Core Js -->
        <script src="plugins/bootstrap/js/bootstrap.js"></script>

        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" Width="100%" Height="1000px">
            </rsweb:ReportViewer>
        </div>
    </form>

</body>
</html>
