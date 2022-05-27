<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="LoginInformation.aspx.vb" Inherits="LoginInformation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix padding-0 margin-0 margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin: 0px; padding: 0px">
                        <strong id="POMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Login Information</strong>
                    </div>
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px; height: calc(100vh - 88px); overflow-y: scroll">
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <label>User</label>
                            <div id="SelUser"></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <label>Machine</label>
                            <div id="SelMachine"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <label>Date From</label>
                            <div id="DateFrom"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <label>Date To</label>
                            <div id="DateTo"></div>
                        </div>
                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-6">
                            <input type="checkbox" id="ShowAll" class="filled-in chk-col-red" /><label for="ShowAll">Show All</label>
                        </div>
                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-6">
                            <div class="DialogBoxCustom" >
                                <a id="BtnSearch" href='#' class="iconButton" style="float: right; margin-top: 1px; margin-right: 1px; float: right" title="Search">
                                    <i class="fa fa-eye fa-2x fa-fw" style="font-size: 12px;"></i>&nbsp Search
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <textarea id="UserID" style="display: none"></textarea>
                            <textarea id="MachineID" style="display: none"></textarea>
                            <div id="ShowListGrid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/LoginInformation.js"></script>
</asp:Content>

