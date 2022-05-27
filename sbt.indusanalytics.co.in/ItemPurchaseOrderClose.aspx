<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ItemPurchaseOrderClose.aspx.vb" Inherits="ItemPurchaseOrderClose" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div id="opt-poclose-radio" style="float: left; margin-left: 2em; margin-top: .4em"></div>
                        <a id="Btn_Update" href='#' class="iconButton" style="margin-top: 1px; margin-right: 1px; float: left">
                            <i class="fa fa-copy fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Close Purchase Order
                        </a>
                    </div>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Purchase Order Close</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="gridpurchaseorders" style="width: 100%; min-height: calc(100vh - 150px); float: left; display: block"></div>
                    </div>
                    <%--<div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 2px; padding-bottom: 2px; width: auto; padding-right: 1px; margin-top: 0px; border-radius: 4px; text-align: left">
                        
                    </div>--%>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ItemPurchaseOrderClose.js"></script>
</asp:Content>

