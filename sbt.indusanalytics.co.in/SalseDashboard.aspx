<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="SalseDashboard.aspx.vb" Inherits="SalseDashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        #dxchart {
            height: 418PX;
        }

        #pie {
            height: 418PX;
        }

        #chart {
            height: 418PX;
        }

        #drill-down-title {
            position: absolute;
            top: 50px;
            height: 418PX;
            width: 100%;
            text-align: center;
        }

        .link {
            color: #337ab7;
            text-decoration: underline;
            cursor: pointer;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px;">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-top: 5PX; border-radius: 4px; margin-left: 16PX;">
                        <div class="row" style="width: 100%; padding-right: -5PX;">

                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: -3PX;">

                                <div id="dxchart"></div>
                                <div class="options">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">
                                <div id="pie"></div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">
                                <div id="chart"></div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">
                                <div id="treemap"></div>
                                <div id="drill-down-title"></div>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: -17PX; padding-top: 5PX;">
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: -3PX;">

                                <canvas id="revenueChart"></canvas>
                                <script src="script.js"></script>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">

                                <canvas id="customerChart"></canvas>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">

                                <canvas id="grossProfitChart"></canvas>

                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="border: solid #000000 0.1px; border-radius: 4px; margin-left: 1PX;">
                                <canvas id="customerSatisfactionChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="SalesDashboard.js"></script>
</asp:Content>

