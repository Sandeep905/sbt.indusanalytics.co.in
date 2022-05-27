<%@ Page Title="Data Import Tool" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="DataImportTool.aspx.vb" Inherits="DataImportTool" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix padding-0 margin-0">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                        <b class="font-11">Order Prefix</b>
                        <div id="Dropdown"></div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div id="CompanyGrid" style="padding-left:4px;padding-right:4px"></div>
                        <div id="ClientGrid" style="padding: 4px"></div>
                        <button type="button" class="btn btn-success" style="float: right; margin-right: 5px; width: 60px; margin-bottom: 2px" id="BtnSave">Save</button>
                    </div>
                </div>
            </div>
            <div id="image-indicator"></div>
        </div>
        <script src="CustomJS/DataImportTool.js"></script>
    </div>
</asp:Content>

