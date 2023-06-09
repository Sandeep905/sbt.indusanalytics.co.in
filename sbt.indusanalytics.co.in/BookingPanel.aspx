﻿<%@ Page Title="Booking Panel" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="BookingPanel.aspx.vb" Inherits="BookingPanel" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <input type="button" class="btn btn-primary hidden" value="Print" id="PrintButton" />
                          
                            <input type="button" class="btn btn-secondary hidden " value="Detail Costing" id="PrintCostingButton" />
                            <input type="button" class="btn btn-secondary hidden " value="btnHistory" id="btnHistory" />
                        </div>
                        <div id="DivSendToUser" style="display: none;" class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <div id="SelectBoxSendToUser"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <input type="button" class="btn btn-info" style="display: none;" value="Send For Internal Approval" id="BtnSendForInternalApproval" />
                            <input type="button" class="btn btn-danger" style="display: none;" value="Unsend For Internal Approval" id="BtnDisInternalApproval" />
                            <input type="button" class="btn btn-info" style="display: none;" value="Send For Price Approval" id="BtnSendForApproval" />
                            <input type="button" class="btn btn-danger" style="display: none;" value="Unsend For Approval" id="BtnDisApproval" />
                        </div>
                    </div>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Quote Panel</strong>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="modal clearfix-sm" id="modalHistory" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div class="modal-content" style="width: 90%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Project History</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-header padding-2">
                    <div id="FieldCntainerRow" class="clearfix tab-pane animated fadeInRight active">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div id="HistoryGrid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="tooltip">
        <p id="tooltipText"></p>
    </div>
    <div id="LoadIndicator"></div>
    <div class="row clearfix padding-0 margin-0">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <%--<div class="text-uppercase navbar-text text-center" style="border-bottom: double;">Filters</div>--%>
            <div id="selectStatus"></div>
            <div id="PendingProcess" style="margin: 10px" class="hidden"></div>
            <div id="range-selector-qty"></div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div id="GridBooingPanel"></div>
            <input type="text" id="txtBookingID" style="display: none" />
            <textarea id="QuoteIDId" style="display: none"></textarea>
            <textarea id="BookingNo" style="display: none"></textarea>
        </div>
    </div>
    <script type="text/javascript" src="CustomJS/BookingPanel.js"></script>
</asp:Content>

