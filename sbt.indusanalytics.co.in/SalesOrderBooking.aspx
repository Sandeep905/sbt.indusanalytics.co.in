<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="SalesOrderBooking.aspx.vb" Inherits="SalesOrderBooking" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .DownloadLink {
            color: blue !important;
            font-size: 12px !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto; display: block">
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <input type="button" name="BtnCreateButton" value="Refersh" id="BtnCreateOrder" class="btn btn-primary" />
                            <input type="button" name="BtnShowList" value="Show List" id="BtnShowList" class="btn btn-info" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 hidden">
                            <div id="SOBClientName" style="float: left; width: 100%; height: auto;"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 hidden">
                            <input type="button" data-target="#ModalOrderHistory" data-toggle="modal" name="btnOrderHistory" value="Order History" id="BtnOrderHistory" class="btn btn-primary" />
                        </div>
                    </div>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Sales Order Booking</strong>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-right: 0px; height: auto; padding-left: 0px;">
                    <div style="height: auto; margin: 10px 2px 0px 2px;">
                        <div id="FieldCntainerRow" class="rowcontents clearfix tab-pane animated fadeInRight active">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div id="PendingProcess"></div>
                                <div id="SOBProductData" style="float: left; width: 100%; height: auto;"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div id="SOBProductAddedData" style="float: left; width: 100%; height: auto;"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <button type="button" id="BtnNext" class="btn btn-primary waves-effect" style="float: right">Next</button>
                            </div>
                        </div>

                        <div id="DetailedFieldCntainer" style="display: none;" class="rowcontents clearfix tab-pane animated fadeInRight">

                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                <b class="font-11">Order Prefix</b>
                                <div id="SOBPrefix"></div>
                            </div>
                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                <b class="font-11">Sales Order No.</b>
                                <input class="forTextBox disabledbutton" type="text" name="SOBNo" id="SOBTxtNo" readonly="readonly" value="" />
                            </div>
                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                <b class="font-11">Order Date</b>
                                <div id="SOBDate"></div>
                            </div>
                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 hidden">
                                <b class="font-11">Job Coordinator</b>
                                <div id="SOBSalesRep"></div>
                            </div>
                            <div class="col-xs-12 col-sm-2 col-md-4 col-lg-4">
                                <input type="checkbox" id="IsPoOnMail" class="form-control" />
                                <label for="IsPoOnMail">Is Client Approval Recived On Mail</label>
                            </div>
                            <div id="POContainer" class="col-xs-12 col-sm-2 col-md-4 col-lg-4 padding-0">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <b class="font-11">Client PO No.</b>
                                    <input class="forTextBox" type="text" name="SOBPONo" id="SOBTxtPONo" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-2 col-md-6 col-lg-6">
                                    <b class="font-11">Client PO Date</b>
                                    <div id="SOBPODate"></div>
                                </div>
                            </div>
                            <div id="mailContainer" class="col-xs-12 col-sm-2 col-md-4 col-lg-4 padding-0 hidden">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <b class="font-11">Client Approval Mail Address</b>
                                    <input class="forTextBox" type="email" name="SOBPONo" id="SOBTxtPOMail" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-2 col-md-6 col-lg-6">
                                    <b class="font-11">Client Approval Mail Date</b>
                                    <div id="SOBPOMailDate"></div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px;">
                                <b class="font-11">Client Name : </b>
                                <input class="forTextBox" style="width: 10em; min-width: 50%;" type="text" name="SOBClientName" id="SOBTxtClientName" readonly="readonly" value="" />
                                <div id="GridOrdersList" style="float: left; width: 100%; height: auto;"></div>
                            </div>

                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 hidden">
                                <b class="font-11">PM. Code</b>
                                <input class="forTextBox disabledbutton" type="text" name="SOBProductMasterNo" id="SOBProductMasterNo" readonly="readonly" value="" />
                            </div>

                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 hidden">
                                <b class="font-11">Quote No</b>
                                <input class="forTextBox disabledbutton" type="text" name="SOBQuoteNo" id="SOBQuoteNo" readonly="readonly" value="" />
                            </div>

                            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                                <b class="font-11">Product Name</b>
                                <input class="forTextBox disabledbutton" type="text" name="JobName" id="SOBJobName" readonly="readonly" value="" />
                            </div>

                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                <b class="font-11">Quantity</b>
                                <input class="forTextBox" type="number" min="0" name="SOBSchQuantity" id="SOBSchQuantity" value="" />
                                <%--<input type="number" id="txtGridQty" style="width: 100%; height: 2.0em; display: none" value="0" />--%>
                            </div>

                            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                <b class="font-11">Delivery Date</b>
                                <div id="SOBDeliveryDate"></div>
                            </div>

                            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                <b class="font-11">Consignee</b>
                                <div id="SOBConsignee"></div>
                                <input class="forTextBox hidden" type="text" placeholder="Enter consignee manually" name="txtSchConsignee" id="txtSchConsignee" value="" />
                            </div>

                            <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                                <b class="font-11">Transporter</b>
                                <div id="SOBTransporter"></div>
                            </div>

                            <div class="col-xs-12 col-sm-2 col-md-1 col-lg-1">
                                <br />
                                <button type="button" class="btn btn-primary" style="float: right" id="BtnAddSchedule">Add</button>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <b class="font-11">Delivery Schedule</b>
                                <div id="SOBScheduleGrid"></div>
                            </div>

                            <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <b class="font-11">Remark</b>
                                <textarea style="width: 100%" id="SOBRemark"></textarea>
                            </div>

                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 hidden" style="margin-top: .3em; float: left; margin-bottom: 5px; height: auto; padding: 0px; padding-left: 0px; padding-right: 13px; margin-bottom: 0em">
                                <div style="float: left; width: 100%; text-align: right">
                                    <label style="">Total Order Qty</label>
                                    &nbsp;&nbsp;&nbsp;<input type="text" id="TxtTotalOrderQty" class="forTextBox disabledbutton hidden" value="0" readonly="" style="text-align: right; width: 15em" /><br />
                                    <label style="">Total Amount</label>
                                    &nbsp;&nbsp;&nbsp;<input type="text" id="TxtTotalAmt" class="forTextBox disabledbutton hidden" value="0" readonly="" style="text-align: right; width: 15em" /><br />
                                    <label style="">Net Amount</label>
                                    &nbsp;&nbsp;&nbsp;<input type="text" id="TxtNetAmt" class="forTextBox disabledbutton hidden" value="0" readonly="" style="text-align: right; width: 15em" />
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <b class="font-11">Dispatched Details</b>
                                <input class="forTextBox" type="text" name="SOBDispatchedDetails" id="SOBDispatchedDetails" value="" />
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <b class="font-11">Delivery Details</b>
                                <input class="forTextBox" type="text" name="SOBDeliveryDetails" id="SOBDeliveryDetails" value="" />
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <b class="font-11">Reference File</b>
                                <input class="forTextBox" type="file" id="fileSO" />
                                <a class="DownloadLink hidden" id="fileDownload">Download file</a>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                                <button type="button" id="BtnDelete" class="btn btn-danger waves-effect">Delete</button>
                                <button type="button" id="BtnBack" class="btn btn-default waves-effect">Back</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div id="image-indicator"></div>
    </div>


    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">

            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Order Booked List</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="popContenerContent" style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="rowcontents clearfix" style="height: auto; overflow-y: auto; padding-left: 0px;">
                            <div id="SalesOrderBookingGrid"></div>
                        </div>
                    </div>
                </div>

                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="PrintButton" class="btn btn-primary" style="margin-top: -1em">Print</button>
                    <button type="button" id="EditButton" class="btn btn-primary" style="margin-top: -1em">Edit</button>
                    <button type="button" class="btn btn-danger" id="DeleteButton" style="margin-top: -1em">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp Order History--%>
    <div class="modal fade" id="ModalOrderHistory" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">

            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Order History</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 0px; max-height: calc(100vh - 147px); overflow-y: auto">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 10px;">
                                    <div id="SOBOrderHistory" style="float: left; width: 100%; height: auto;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-1">
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em" id="SOBtnPrint">Print</button>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp Order Window--%>
    <div class="modal fade" id="ModalOrderWindow" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">

            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Order Window</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/SalesOrderBooking.js"></script>
</asp:Content>

