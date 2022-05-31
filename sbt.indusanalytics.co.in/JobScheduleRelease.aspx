<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="JobScheduleRelease.aspx.vb" Inherits="NewSchedulePlanner" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        /* Thanku */
        .myModal_thank {
            display: block; /* Hidden by default */
            position: fixed; /* Fixed/sticky position */
            bottom: 10px; /* Place the button at the bottom of the page */
            right: 5px; /* Place the button 30px from the right */
            z-index: 99; /* Make sure it does not overlap */
            border: none; /* Remove borders */
            outline: none; /* Remove outline */
            color: white; /* Text color */
            cursor: pointer; /* Add a mouse pointer on hover */
            /*padding: 15px;*/ /* Some padding */
            /*border-radius: 10px;*/ /* Rounded corners */
            background-color: white;
            /*background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);*/
        }


        /* Modal Content */
        .myModal_thank-content {
            background-color: transparent;
            margin: auto;
            padding: 0px;
            z-index: 4;
            border: 0px solid #888;
            width: 35%;
            height: 35%;
            /*border-radius: 7px;*/
            margin-top: 0em;
        }

        .myModal_thank .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #ccc;
            color: black;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            /* Position the tooltip */
            position: absolute;
            z-index: 1;
            /*top: 0px;*/
            right: 105%;
        }

        .myModal_thank:hover .tooltiptext {
            visibility: visible;
        }

        .mini_thank {
            color: #FF0000; /*#aaaaaa;*/
            float: right;
            font-size: 30px;
            font-weight: bold;
            margin-top: 0em;
        }

            .mini_thank:hover,
            .mini_thank:focus {
                color: #D18297;
                text-decoration: none;
                cursor: pointerExtraDetailDiv;
            }

        .max_thank {
            color: #FF0000; /*#aaaaaa;*/
            float: right;
            font-size: 30px;
            font-weight: bold;
            margin-top: 0em;
        }

            .max_thank:hover,
            .max_thank:focus {
                color: #D18297;
                text-decoration: none;
                cursor: pointer;
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster" style="margin: 0px">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                        <div id="filterRow" class="col-lg-11 col-md-11 col-sm-11 col-xs-12 padding-0 margin-0">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12 padding-0 margin-0">
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                    <label style="float: left; width: auto; margin-top: 5px; margin-right: 10px; margin-left: 5px;">From</label>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-10 padding-0 margin-0">
                                    <div id="dateboxJCDateFrom" style="float: left; width: 100%;"></div>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                    <label style="float: left; width: auto; margin-top: 5px; margin-right: 10px; margin-left: 5px">To</label>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 padding-0 margin-0">
                                    <div id="dateboxTo" style="float: left; width: 100%;"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 padding-0 margin-0" title="Booking Date">
                                    <input type="checkbox" id="ScheduleCheckB" class="filled-in chk-col-red" style="height: 20px" />
                                    <label for="ScheduleCheckB" style="height: 20px; margin-left: 10px; margin-top: 4px; float: left">B.Date</label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-12 padding-0 margin-0">
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                    <label style="float: left; width: auto; margin-top: 5px; margin-right: 10px; margin-left: 5px">From</label>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-10 padding-0 margin-0">
                                    <div id="DeldateboxJCDateFrom" style="float: left; width: 100%;"></div>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                    <label style="float: left; width: auto; margin-top: 5px; margin-right: 10px; margin-left: 5px">To</label>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 padding-0 margin-0">
                                    <div id="DeldateboxTo" style="float: left; width: 100%;"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 padding-0 margin-0" title="Delivery Date">
                                    <input type="checkbox" id="ScheduleCheckD" class="filled-in chk-col-red" style="height: 20px" />
                                    <label for="ScheduleCheckD" style="height: 20px; margin-left: 10px; margin-top: 4px; float: left">Del.Date</label>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                    <a id="Refresh" href='#' class="iconButton" style="margin-top: 1px; margin-left: 8px;">Refresh</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-9 padding-0 margin-0 hidden">
                            <div class="col-lg-4 col-md-1 col-sm-4 col-xs-3" style="padding: 0px; margin: 0px; display: none;">
                                <a id="BtnBooked" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">Booked</a>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-3" style="padding: 0px; margin: 0px; display: none;">
                                <a id="BtnDelivery" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">Delivery</a>
                            </div>
                        </div>

                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-3 padding-0 margin-0" style="float: right;" title="Job Schedule Release">
                            <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                        </div>
                    </div>
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: auto">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin: 5px; overflow-y: auto">
                        <div id="GridJobList" style="width: 100%;" class="tab-pane animated fadeInDown active"></div>
                        <input type="text" id="TxtScheduleID" style="display: none" />
                        <input type="text" id="TxtOrderSalesID" style="display: none" />
                        <div id="ExtraDetailDiv" style="display: none" class="rowcontents clearfix tab-pane animated fadeInUp active">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div id="gridScheduleList"></div>
                            </div>
                            <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                <div id="gridFormWiseDetail"></div>
                            </div>

                            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <div id="chartMachineLoads"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em; margin-bottom: 0px">
                        <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                        <button type="button" id="BtnShowList" class="btn btn-link waves-effect" style="margin-top: -1em; margin-right: 15px">ShowList</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="LoadIndicator"></div>
        <div id="myModal_Max" class="myModal_thank" style="border-radius: 100%;">
            <span id="tooltipspan" class="tooltiptext">Click me to show detail..</span>
            <div class="myModal_Max-content" style="height: 25px; width: 30px">
                <div style="float: left; width: 30px; height: 24px">
                    <span id="MaxBtn" class="max_thank" style="margin-right: 2px">
                        <img src="icon/max.png" style="float: left; width: 25px; height: 25px; margin-top: 0px" /></span>
                    <span id="MinBtn" class="mini_thank" style="margin-right: 2px; display: none">
                        <img src="icon/min.png" style="float: left; width: 25px; height: 25px; margin-top: 0px" /></span>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Details) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag"></strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                        <li role='presentation' class="active"><a id="AnchorFieldPlannedJobProcess" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Planned Job Process</a></li>
                    </ul>
                    <div id="FieldCntainerFiltrJobcard" class="row clearfix">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="FiltrPlannedJobProcess">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="GridAllocatedDetails"></div>
                                    <div id="GridDeliveryDetails"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>

        </div>
    </div>

    <%-- Model PopUp (Show list) --%>
    <div class="modal fade" id="largeModalShowlist" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tagShowlist">Release Scheduled Quantity</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentFiltrJobcardShowlist">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldPlannedJobProcessShowlist" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Planned Job Process</a></li>
                        </ul>
                        <div id="FieldCntainerFiltrJobcardShowlist" class="rowcontents clearfix">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="FiltrPlannedJobProcessShowlist">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                            <b>From</b>
                                            <div id="ReleaseDateFrom" style="float: left; width: 100%;"></div>
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                            <b>To</b>
                                            <div id="ReleasedateTo" style="float: left; width: 100%;"></div>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 padding-0 margin-0" title="Booking Date">
                                            <br />
                                            <input type="checkbox" id="ReleaseCheckB" class="filled-in chk-col-red" />
                                            <label for="ReleaseCheckB">Release Date</label>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 padding-0 margin-0">
                                            <br />
                                            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                                <a id="ReleaseRefresh" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; float: left">
                                                    <i class="fa fa-refresh fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Refresh
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="GridReleaseShowlist"></div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label class="font-11 m-b-0">Scheduled Quantity</label>
                                        <div id="GridShowlistScheduledQty"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivShowlist" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnShowListDelete" class="btn btn-link waves-effect" style="margin-top: -1em;">Delete</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>

        </div>
    </div>

    <script src="CustomJS/JobScheduleRelease.js"></script>
</asp:Content>

