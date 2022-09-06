<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="InternalApproval.aspx.vb" Inherits="InternalApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster hidden">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <input type="button" name="print" id="BtnPrintJobDetails" class="btn btn-primary hidden" value="Job Details" />
                    <input type="button" name="print" id="BtnPrintCosting" class="btn btn-info hidden" value="Detail Costing Sheet" />
                    <input type="button" name="Btnreview" id="BtnReviewQuote" class="btn bg-amber" value="Review Quote" />

                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Internal Approval</strong>
                </div>
            </div>
        </div>
    </div>
    <div class="row clearfix p-t-0 margin-0">
        <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <div id="radioFilterOptions"></div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <div id="SelectStatus"></div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12">
            <input type="text" name="statusremark" id="TxtRemarks" placeholder="Remark" class="forTextBox" value="" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            <input type="button" name="statusupdate" id="BtnUpdate" class="btn btn-success" value="Update" />
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div id="GridData"></div>
        </div>
    </div>
    <script src="CustomJS/InternalApproval.js"></script>
</asp:Content>

