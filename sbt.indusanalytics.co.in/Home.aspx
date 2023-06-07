<%@ Page Title="Dashboard" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Home.aspx.vb" Inherits="Home" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        .customcard {
            width: 100%;
            height: 110px;
            align-items: center;
            justify-content: center;
            background: white;
            padding-top: 0px;
            border-radius: 10px;
            box-shadow: 0px 0px 20px 2px rgb(148 129 148);
            border: solid #42909a 0.1px;
        }

        .bold-text {
            font-weight: bold;
        }

        .dx-tab-selected {
            background-color: #0a5696 !important;
            color: white !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">

                    <div id="tabs">
                        <div class="tabs-container"></div>
                    </div>

                    <h3 id="dashname" class="text-center">Today's dashboard</h3>
                    <div>
                        <div class="row clearfix">
                            <div id="container">
                                <div id="image-indicator"></div>
                                <div class="dialogboxContainerMainMAster" style="padding-bottom: 10px">
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                            <div id="pie"></div>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="border: solid #000000 0.1px; border-radius: 10px; padding-bottom: 20px;">
                                            <label><b>Enquirys</b></label>
                                            <div style="padding-top: 10px;">
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 50%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Total Enquiry</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="TotalEnquiry" onclick="EnquiryDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 50%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Pending Enquiry</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="PendingEnquiry" onclick="EnquiryDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />

                                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 50%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Converted Enquiry</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="ConvertedEnquiry" onclick="EnquiryDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 50%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Auto Rejected Enquiry</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="RejectedEnquiry" onclick="EnquiryDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                            <div id="pie2"></div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="border: solid #000000 0.1px; border-radius: 10px; padding-bottom: 20px;">
                                            <label><b>Quotation</b></label>
                                            <div style="padding-top: 10px;">
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">All Quotes</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="AllQuotes" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">New Quotes</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="NewQuotes" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Pennding For I.A.</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="PenndingForIA" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Internal Approved</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="InternalApproved" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Pennding For P.A.</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="PenndingForPA" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Rework</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="Rework" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Rejected</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="Rejected" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="height: auto; padding: 2px 3px 1px 6px; width: 25%; margin: 0px; color: white;">
                                                    <div class="customcard">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <label style="width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 15px; text-align: center; color: black">Cost Approved</label>
                                                            <label style="color: blue; text-decoration: underline; width: 100%; white-space: pre; font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif; font-weight: bolder; fill: #232323; cursor: default; margin-bottom: 0px; font-size: 25px; text-align: center; color: blue; cursor: pointer" id="CostApproved" onclick="AllDetails(this.id)">0</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal clearfix-sm" id="AllTime" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                            <div class="modal-content" style="width: 90%">
                                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                                    <strong id="exampleModalLabel"></strong>
                                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                                    </a>
                                </div>
                                <div class="modal-header padding-2">
                                    <div class="clearfix tab-pane animated fadeInRight active">
                                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div id="datagrid"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal clearfix-sm" id="EnqueryTime" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                            <div class="modal-content" style="width: 90%">
                                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                                    <strong id="EnqueryexampleModalLabel"></strong>
                                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                                    </a>
                                </div>
                                <div class="modal-header padding-2">
                                    <div class="clearfix tab-pane animated fadeInRight active">
                                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div id="Enquerydatagrid"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/Home.js"></script>
</asp:Content>

