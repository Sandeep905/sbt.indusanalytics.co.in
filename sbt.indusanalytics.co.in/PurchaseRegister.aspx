﻿<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPageMIS.master" AutoEventWireup="false" CodeFile="PurchaseRegister.aspx.vb" Inherits="PurchaseRegister" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <title>Purchase Register</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                            <b>From Time</b>
                            <div id="FromDate"></div>
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                            <b>To Time</b>
                            <div id="ToDate"></div>
                        </div>

                        <div class="col-lg-1 col-md-1 col-sm-2 col-xs-3">
                            <br class="hidden-xs"/>
                            <button type="button" id="BtnSearch" class="btn btn-primary waves-effect">Search</button>
                        </div>
                    </div>
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Purchase Register</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="PurchaseRegisterGrid"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/PurchaseRegister.js"></script>
</asp:Content>

