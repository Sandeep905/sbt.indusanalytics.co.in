<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ChallanDetail.aspx.vb" Inherits="ChallanDetail" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        /* Thanku */
        .myModal_thank {
            display: block; /* Hidden by default */
            position: fixed; /* Fixed/sticky position */
            bottom: 3px; /* Place the button at the bottom of the page */
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
                cursor: pointer;
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
                    <div id="ButtonDiv" style="height: auto;">
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 padding-0 margin-0">
                            <div id="optreceiptradio" style="float: left; margin-left: 2em; margin-top: .4em; margin-right: 2em;"></div>
                        </div>
                        <div id="DivCretbtn" class="col-lg-2 col-md-2 col-sm-2 col-xs-6 padding-0 margin-0">
                            <a id="Btn_Next" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                <i style="font-size: 14px;"></i>&nbsp Next >
                            </a>
                        </div>
                        <div id="DivEdit" class="col-lg-2 col-md-2 col-sm-2 col-xs-6" style="padding: 0px; margin: 0px; display: none">
                            <a id="EditCHButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: block">
                                <i class="fa fa-edit fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Edit
                            </a>
                            <a id="DeleteCHButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; margin-right: 10px; display: block">
                                <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                            </a>
                        </div>
                    </div>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Challan Detail</strong>
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin: 5px; padding-left: 10px; padding-right: 10px; height: calc(100vh - 95px); overflow-y: auto">
                        <div id="gridCHDList" style="width: 100%; float: left; display: block;"></div>
                        <div id="gridProcessedCHDList" style="width: 100%; float: left; display: block;"></div>
                        <input type="text" id="TxtCHDID" style="display: none" />
                        <div id="ExtraDetailDiv" style="float: left; height: auto; width: 100%; border: 2px solid #ccc; padding-top: 3px; display: none">
                            <div style="float: left; height: auto; width: 100%; border-bottom: 1px solid #ccc; padding-left: 3px; padding-right: 3px">
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">Total Cartons:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtTotalCartons" id="TxtTotalCartons" readonly="readonly" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">Total Pices:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtTotalPices" id="TxtTotalPices" readonly="readonly" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">Total Weight:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtTotalWeight" id="TxtTotalWeight" readonly="readonly" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">CFT/CFC:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtCFT_CFC" id="TxtCFT_CFC" readonly="readonly" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">Total CFT:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtTotalCFT" id="TxtTotalCFT" readonly="readonly" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px; margin-bottom: 3px">
                                    <b class="font-11">Weight/CFC:</b>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-bottom: 3px">
                                    <input class="forTextBox" type="text" name="TxtWeightCFC" id="TxtWeightCFC" readonly="readonly" value="" />
                                </div>
                            </div>
                            <div style="float: left; width: 100%; height: auto; width: 100%;">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="height: auto; padding: 0px; margin-bottom: 1px">
                                    <table id="tbl_task" style="width: 100%; border: 1px solid #ccc; margin-top: 1px; margin-bottom: 0px; height: calc(100vh - 459px); overflow-y: auto">
                                    </table>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="height: auto; padding: 0px; margin-bottom: 1px">
                                    <div style="float: left; padding-bottom: .5em; padding-left: 5px; height: auto; margin-top: 0px; background-color: #fff; -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none">
                                            <li role='presentation' class="active"><a id="AnchorStockGrid" href="#StockDetail" data-toggle='tab' style='background-color: none;'>Stock Detail</a></li>
                                            <li role='presentation'><a id="AnchorDelDetail" href="#DeliveryDetail" data-toggle='tab' style='background-color: none;'>Delivery Detail</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                        <div class="tab-content" style="margin-bottom: 0em">
                                            <div role="tabpanel" class="tab-pane animated fadeInRight col-12" id="DeliveryDetail">
                                                <div id="gridDelDetail" style="width: 100%; float: left; display: block; height: calc(100vh - 500px)"></div>
                                            </div>
                                            <div role="tabpanel" class="tab-pane animated fadeInRight active col-12" id="StockDetail">
                                                <div id="gridOtherDetail" style="width: 100%; float: left; display: block; height: calc(100vh - 500px)"></div>
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
        <div id="image-indicator"></div>

        <div id="myModal_Max" class="myModal_thank" style="border-radius: 100%;">
            <span id="tooltipspan" class="tooltiptext">Click me to show finish goods detail..</span>
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
    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Delivery Note</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent">
                        <div id="FieldCntainerRow" class="row clearfix">
                            <div role="tabpanel" class="tab-pane active" id="ReqGrid">

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <b class="font-11">Del.Note No.</b>
                                    <input type="text" id="TxtDelNote" class="forTextBox" readonly="" disabled="disabled" />
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <b class="font-11">Date</b>
                                    <div id="VoucherDate"></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <b class="font-11">Client Name</b>
                                    <div id="TxtClientID"></div>
                                    <%-- <br />
                                            <strong id="ValStrTxtClientName" style="color: red; font-size: 12px; display: none"></strong>--%>
                                </div>
                                <div id="DivContactPerson" class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <b class="font-11">Consignee</b>
                                    <div id="TxtConsigneeID"></div>
                                    <%-- <br />
                                            <strong id="ValStrConsignee" style="color: red; font-size: 12px; display: none"></strong>--%>
                                </div>

                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">Address</b>
                                    <textarea id="TxtAddress" class="forTextBox m-t-0" readonly="" disabled="disabled"></textarea>
                                    <%--<br />
                                            <strong id="ValStrTxtAddress" style="color: red; font-size: 12px; display: none"></strong>--%>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">Consignee Address</b>
                                    <textarea id="TxtConsigneeAddress" class="forTextBox m-t-0" readonly="" disabled="disabled"></textarea>
                                    <%--<br />
                                            <strong id="ValStrTxtConsigneeAddress" style="color: red; font-size: 12px; display: none"></strong>--%>
                                </div>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OrderDetailGrid"></div>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <b class="font-12">Finish Goods Details(Packed Items) :- </b>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div id="FinishGoodsGrid"></div>
                                </div>

                                <div class="col-xs-12 col-sm-5 col-md-5 col-lg-3" style="float: right;">
                                    <b style="float: left; margin-top: 7px">Total Carton</b>
                                    <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                                        <input type="number" id="TxtTotalCarton" class="forTextBox" min="0">
                                    </div>
                                    <div class="DialogBoxCustom">
                                        <a id="AddButton" href="#" class="iconButton">Add </a>
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div id="DeliveryDetailGrid"></div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                    <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
                                        <div id="SelLnameChargesGrid"></div>
                                    </div>
                                    <div class="DialogBoxCustom">
                                        <a id="BtnAddLedgerCharge" href="#" class="iconButton">
                                            <i class="fa fa-plus"></i>
                                        </a>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="AdditionalChargesGrid"></div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Basic Amount</b>
                                        <input type="text" id="TxtBasicAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Total Tax</b>
                                        <input type="text" id="TxtTotalTax" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Round off A/c</b>
                                        <input type="text" id="TxtRoundTaxAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Net Amount</b>
                                        <input type="text" id="TxtNetAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>

                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Boxes</b>
                                        <input type="text" id="TxtBoxes" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                        <b style="">Total Wt.</b>
                                        <input type="text" id="TxtTotalWt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">
                                        <b style="">Total Dispatched Qty</b>
                                        <input type="text" id="TxtTotalDispatchedQty" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">
                                        <b style="">Mode of Transport</b>
                                        <div id="ModeOfTransport"></div>
                                        <strong id="ValStrModeOfTransport" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div style="float: left; width: 50%; text-align: right">
                                        <input type="text" id="TxtCGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        <input type="text" id="TxtSGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        <input type="text" id="TxtIGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        <input type="text" id="TxtAfterDisAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        <input type="text" id="Txt_TaxAbleSum" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        <input type="text" id="TxtTotalQty" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <b style="">Transporter</b>
                                        <div id="SelTransporter"></div>
                                        <strong id="ValStrSelTransport" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                        <b style="">Vehicle No</b>
                                        <input type="text" id="TxtVehicleNo" class="forTextBox" />
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                        <b style="">POD NO.</b>
                                        <input type="text" id="TxtPODNO" class="forTextBox" />
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <b style="">Remark</b>
                                        <input type="text" id="TxtRemark" class="forTextBox" />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect">Save</button>
                    <button type="button" id="BtnPrint" class="btn btn-link waves-effect">Print</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect">Delete</button>
                </div>
            </div>

        </div>
    </div>

    <script src="CustomJS/ChallanDetail.js"></script>
</asp:Content>

