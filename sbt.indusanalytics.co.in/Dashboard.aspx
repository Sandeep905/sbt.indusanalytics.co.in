<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Dashboard.aspx.vb" Inherits="Dashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
<%--    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>--%>
 
  <%--  <style>
        #chart {
            height: 270px;
            width: 100%;
            margin-bottom: 10px;
            margin-bottom: 30px;
        }

        .title {
            font-size: 15px;
            font-weight: 500;
        }

        #Lastchart {
            height: 603px;
            width: 100%;
        }

        #barchart {
            height: 297px;
            width: 100%;
        }

        #barchart2 {
            height: 297px;
            width: 100%;
        }

        #chartContainer {
            width: 100%;
            height: 300px;
        }

        .state-tooltip {
            height: 90px;
        }

            .state-tooltip > img {
                width: 60px;
                height: 40px;
                display: block;
                margin: 0 5px 0 0;
                float: left;
                border: 1px solid rgba(191, 191, 191, 0.25);
            }

            .state-tooltip > h4 {
                line-height: 40px;
                font-size: 14px;
                margin-bottom: 5px;
            }

            .state-tooltip .caption {
                font-weight: 500;
            }

            .state-tooltip sup {
                font-size: 0.8em;
                vertical-align: super;
                line-height: 0;
            }

        /* Media queries for responsive layout */
        @media (max-width: 767px) {
            .col-lg-12,
            .col-md-12,
            .col-sm-12,
            .col-xs-12 {
                width: 100%;
            }

            .col-lg-3,
            .col-md-4 {
                width: 100%;
                margin-bottom: 10px;
            }

            .col-md-6 {
                width: 100%;
                margin-bottom: 10px;
            }

            #Lastchart,
            #barchart,
            #barchart2,
            #chartContainer {
                width: 100%;
            }

            .col-lg-9 {
                margin-top: 0;
            }
        }
    </style>--%>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px;">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-right: 2px;">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px;">
                            <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                                <label for="years">Select a Year:</label>
                                <div id="Yeardropdown"></div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <label for="years">Select a Month:</label>
                                <div id="dropdown"></div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <label for="states">Select a State:</label>
                                <div id="Statedropdown"></div>
                            </div>
                        </div>
                       
                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 demo-container" style="border: solid #000000 0.1px;margin-left:-3PX; border-radius: 4px;">
                            <div id="chartContainer">
                                <div id="salesChart"></div>
                            </div>
                        </div>
                        <div class="col-lg-8 col-md-7 col-sm-12 col-xs-12 demo-container" style="border: solid #000000 0.1px;margin-left:3px;padding-right:-4PX; border-radius: 5px;">
                            <div id="chart"></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12" style="padding-left: 3px; padding-right: 3px;">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 demo-container" style="border: solid #000000 0.1px; border-radius: 4px;">
                                <div id="barchart"></div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 demo-container" style="border: solid #000000 0.1px; border-radius: 4px;margin-left:3PX; margin-right: -4px;">
                                <div id="barchart2"></div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="padding-left: 3px; padding-right: 3px; padding-right: 4px;">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 demo-container" style="border: solid #000000 0.1px; border-radius: 5px;">
                                <div id="Lastchart"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="Dashboard.js"></script>
</asp:Content>
