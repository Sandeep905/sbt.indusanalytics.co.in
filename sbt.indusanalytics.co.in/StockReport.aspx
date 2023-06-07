﻿<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="StockReport.aspx.vb" Inherits="StockReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="popup"></div>
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto; display: block">
                    </div>
                    <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Stock Report</strong>

                </div>

                <div class="ContainerBoxCustom" style="float: left; height: calc(100vh - 85px);">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div style="width: 100%; min-height: 100%; float: left; max-height: calc(100vh - 95px); overflow-y: auto">
                            <div id="gridstock" style="width: 100%; float: left; height: 251.333px; display: block; padding-bottom: 0px; margin-bottom: 0px;"></div>
                            <div style="float: left; width: 100%; height: auto; margin-top: 0px">
                                <label style="float: left; margin-top: 5px;margin-left:5px">Stock Batch Wise :</label>
                            </div>
                            <div id="StockBatchWiseGrid" style="width: 100%; float: left; height: auto; display: block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/StockReport.js"></script>
</asp:Content>

