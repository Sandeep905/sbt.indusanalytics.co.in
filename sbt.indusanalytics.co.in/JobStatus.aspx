<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="JobStatus.aspx.vb" Inherits="JobStatus" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        /*Open Draw Step Process*/
        ol.progtrckr {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }

            ol.progtrckr li {
                display: inline-block;
                text-align: center;
                line-height: 3.5em;
            }


                ol.progtrckr li.progtrckr-done {
                    float: left;
                    color: black;
                    border-bottom: 4px solid green;
                }

                ol.progtrckr li.progtrckr-todo {
                    float: left;
                    color: silver;
                    border-bottom: 4px solid silver;
                }

                ol.progtrckr li.progtrckr-running {
                    float: left;
                    color: black;
                    border-bottom: 4px solid lightpink;
                }

                ol.progtrckr li.progtrckr-part-done {
                    float: left;
                    color: black;
                    border-bottom: 4px solid coral;
                }

                ol.progtrckr li:after {
                    content: "\00a0\00a0";
                }

                ol.progtrckr li:before {
                    position: relative;
                    bottom: -2.5em;
                    float: left;
                    left: 50%;
                    line-height: 1em;
                }

                ol.progtrckr li.progtrckr-done:before {
                    content: "\2713";
                    color: white;
                    background-color: green;
                    height: 2.2em;
                    width: 2.2em;
                    line-height: 2.2em;
                    border: none;
                    border-radius: 2.2em;
                }

                ol.progtrckr li.progtrckr-running:before {
                    content: "\2713";
                    color: black;
                    background-color: lightpink;
                    height: 2.2em;
                    width: 2.2em;
                    line-height: 2.2em;
                    border: none;
                    border-radius: 2.2em;
                }

                ol.progtrckr li.progtrckr-todo:before {
                    content: "\039F";
                    color: black;
                    background-color: white;
                    font-size: 2.2em;
                    bottom: -1.2em;
                }

                ol.progtrckr li.progtrckr-part-done:before {
                    content: "\2713";
                    color: black;
                    background-color: coral;
                    height: 2.2em;
                    width: 2.2em;
                    line-height: 2.2em;
                    border: none;
                    border-radius: 2.2em;
                }
        /*Close Draw Step Process*/
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix padding-0 margin-0">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 m-r--15">
            <div class="DialogBoxCustom m-b-5" style="float: left; background-color: #fff;">
                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">
                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-6 m-t-5">
                        <b class="font-11 m-t-10">Job Card</b>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-5 col-xs-12">
                        <div id="SelJobCard"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="font-12">Job Card Detail's</label>
                <div id="JobCardGridGrid"></div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-2 col-xs-3">
                <label>Process Details</label>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-10 col-xs-9" style="text-align: right;">
                <label style="background-color: yellow; color: black;" class="btn btn-sm">In Queue</label>
                <label style="background-color: lightpink; color: black;" class="btn btn-sm">Running</label>
                <label style="background-color: coral; color: black;" class="btn btn-sm">Part Complete</label>
                <label style="background-color: green; color: white;" class="btn btn-sm">Complete</label>
                <label style="background-color: #34f2f4; color: black;" class="btn btn-sm">Outsource Send</label>
                <label style="background-color: #cc00ff; color: #fff;" class="btn btn-sm">Outsource Receive</label>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="JobStatusGrid"></div>
                <input type="text" id="TxtJobStatusGridID" style="display: none" />
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden">
                <div class="DialogBoxCustom">
                    <a id="ProductionDetailsButton" href='#' class="iconButton">
                        <i class="fa fa-eye fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp  Production Details
                    </a>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="DrawStepProcess_Div">
                <div id="DrawStepProcess" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="largeModalHSNGroup" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Production Details </strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div id="popContenerContentProductHSN">
                        <div id="FieldCntainerRowProductHSN" class="row clearfix">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <button type="button" id="BtnOpenProductHSNPopUp" class="btn btn-link waves-effect" data-dismiss="modal" style="display: none">Choose Product Group</button>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <b class="font-11">Schedule Details</b>
                                    <div id="ScheduleGrid"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <b class="font-11">Production Details</b>
                                    <div id="ProductionDetailsGrid"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivProductHSN" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/JobStatus.js"></script>
</asp:Content>

