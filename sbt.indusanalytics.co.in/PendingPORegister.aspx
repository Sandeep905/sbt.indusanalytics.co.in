<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPageMIS.master" AutoEventWireup="false" CodeFile="PendingPORegister.aspx.vb" Inherits="PendingPORegister" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">                    
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Pending PO Register</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="PendingPORegisterGrid"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/PendingPORegister.js"></script>
</asp:Content>

