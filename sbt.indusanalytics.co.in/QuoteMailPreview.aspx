<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="QuoteMailPreview.aspx.vb" Inherits="QuoteMailPreview" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="body">
        <label style="float: left; width: 100%;">Email Details</label>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: 1px solid">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">To</label>
                <input id="TxtEmailTo" type="email" class="forTextBox" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">CC</label>
                <input id="TxtEmailCC" type="email" class="forTextBox" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">BCC</label>
                <input id="TxtEmailBcc" type="email" class="forTextBox" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Subject</label>
                <input id="TxtSubject" type="text" class="forTextBox" />
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Message</label>
                <textarea id="TxtEmailBody" class="forTextBox" style="height:100%" rows="3"></textarea>
            </div>
        </div>

        <label style="float: left; width: 100%;">Quote Details</label>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: 1px solid">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Postal Name</label>
                <br />
                <input id="TxtPostalName" type="text" class="forTextBox" />
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Postal Address</label>
                <br />
                <textarea id="TxtAddress" rows="3" style="height:100%" class="forTextBox"></textarea>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Kind Attention</label>
                <br />
                <input id="TxtAttention" type="text" class="forTextBox" />
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Header Text</label>
                <br />
                <textarea id="TxtHeaderText" rows="3" style="height:100%" class="forTextBox"></textarea>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Footer Text</label>
                <br />
                <textarea id="TxtFooterText" rows="3" style="height:100%" class="forTextBox"></textarea>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Quote By</label>
                <br />
                <input type="text" name="TxtQuoteBy" value="" class="forTextBox" id="TxtQuoteBy" />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Designation</label>
                <br />
                <input type="text" name="TxtDesignation" value="" class="forTextBox" id="TxtDesignation" />
            </div>

            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Currency Symbol</label>
                <br />
                <input type="text" name="TxtCurrency" value="" class="forTextBox" id="TxtCurrency" />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                <label style="float: left; width: 100%;">Conversion Value</label>
                <br />
                <input type="number" name="TxtConvertValue" min="0" value="" class="forTextBox" id="TxtConvertValue" />
            </div>
        </div>

        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 margin-0 padding-0">
            <div id="GridContentDetails"></div>
            <textarea id="ContentsIdStr" hidden></textarea>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 margin-0 padding-0">
            <div id="GridContentQtyDetails"></div>
            <textarea id="PlanQtyStr" hidden></textarea>
        </div>
        <input type="checkbox" class="filled-in chk-col-red" id="ChkHideContDetails" />
        <label for="ChkHideContDetails" style="height:20px">Hide Content Details</label>
        <input type="button" name="BtnPreviewQuote" value="Preview" id="BtnPreviewQuote" class="btn btn-primary" />
    </div>
    <script type="text/javascript" src="CustomJS/QuoteMailPreview.js"></script>
</asp:Content>

