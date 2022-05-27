<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="PurchaseOrderApproval.aspx.vb" Inherits="PurchaseOrderApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-bottom: 2px">
                    <div class="col-lg-6 col-md-7 col-sm-8 col-xs-12">
                        <div id="opt-approval-radio"></div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                        <button type="button" id="DetailPOButton" class="btn btn-success waves-effect">PO Details</button>
                    </div>
                    <div class="col-lg-4 col-md-3 col-sm-2 col-xs-12"><strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Purchase Order Approval</strong></div>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin: 10px;">
                        <div class="demo-container">
                            <div id="gridpurchaseorders"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <%-- Model PopUp (view datails) --%>
    <div class="modal fade" id="ModalPODetails" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Purchase Order Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <button id="largeModalDisNone" type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="display: none">Reload</button>
                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRow" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div id="FieldCntainerRow" class="rowcontents clearfix">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGrid">

                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <label>PO No</label><br />
                                    <input type="text" id="LblPONo" class="forTextBox disabled" readonly="" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <label>Date</label><br />
                                    <div id="VoucherDate"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <label>Supplier Name</label><br />
                                    <div id="SupplierName"></div>
                                    <strong id="ValStrSupplierName" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" hidden="hidden">
                                    <label id="LblState" style="float: left; width: 100%"></label>
                                    <br />
                                    <label id="LblCountry" style="float: left; width: 100%"></label>

                                    <label id="LblSupplierStateTin" style="float: left; display: none">0</label>
                                    <label id="CurrentCurrency" style="float: left; display: none"></label>
                                    <label id="ConversionRate" style="float: left; display: none"></label>
                                    <label id="VatGSTApplicable" style="float: left; display: none"></label>
                                </div>
                                <div id="DivContactPerson" class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label>Cont.Person</label><br />
                                    <div id="ContactPersonName"></div>
                                    <strong id="ValStrContactPersonName" style="color: red; font-size: 12px; display: none"></strong>
                                </div>

                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label>Purchase Division</label><br />
                                    <div id="PurchaseDivision"></div>
                                    <strong id="ValStrPurchaseDivision" style="color: red; font-size: 12px; display: none"></strong>
                                </div>

                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label>Currency Code</label>
                                    <div id="SelCurrencyCode"></div>
                                </div>
                                <%--<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                            <label>PO Approval By</label>
                                            <div id="SelPOApprovalBy"></div>
                                        </div>--%>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="CreatePOGrid"></div>
                                </div>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div style="float: left; width: 100%; text-align: right">
                                        <label style="">Basic Amount</label>
                                        &nbsp;&nbsp;&nbsp;<input type="text" id="TxtBasicAmt" class="forTextBox" value="0" readonly="" style="width: 15em; text-align: right" />
                                        <input type="text" id="TxtCGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                        <input type="text" id="TxtSGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                        <input type="text" id="TxtIGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                        <input type="text" id="TxtAfterDisAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                        <input type="text" id="Txt_TaxAbleSum" class="forTextBox" value="0" readonly="" style="display: none" />
                                        <input type="text" id="TxtTotalQty" class="forTextBox" value="0" readonly="" style="display: none" />
                                    </div>
                                </div>

                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                        <div id="PaymentTermsGrid" style="height: 10em;"></div>
                                    </div>
                                </div>

                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                        <div id="AdditionalChargesGrid" style="height: 10em;"></div>
                                    </div>
                                </div>

                                <div class="col-lg-8 col-md-8 col-sm-7 col-xs-12 padding-0 margin-0">
                                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                        <label>Dealer Name</label>
                                        <div id="DealerName"></div>
                                        <strong id="ValStrDealerName" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                        <label>Mode Of Transport</label>
                                        <div id="ModeOfTransport"></div>
                                        <strong id="ValStrModeOfTransport" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 padding-0 margin-0">
                                        <label>Delivery At</label>
                                        <textarea id="textDeliverAt" class="forTextBox" style="height: 5em"></textarea>
                                    </div>

                                    <div class="col-lg-12 col-md-12 col-sm-6 col-xs-12 p-r-0">
                                        <label>Purchase Reference</label>
                                        <textarea id="PORefernce" class="forTextBox" style="height: 5em"></textarea>
                                        <strong id="ValStrPORefernce" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                </div>

                                <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <div style="float: left; width: 100%; text-align: right">
                                        <label>GST Amount</label>
                                        <input type="text" id="TxtGstamt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" /><br />
                                        <label>Other Taxable Amount</label>
                                        <input type="text" id="TxtOtheramt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" /><br />
                                        <label style="display: none">Total Tax Amount</label><%--&nbsp;&nbsp;&nbsp;--%>
                                        <input type="text" id="TxtTaxAmt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right; display: none" />
                                        <label>Net Amount</label>
                                        <input type="text" id="TxtNetAmt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="Btn_Update" class="btn btn-success waves-effect" style="margin-top: -1em">Approve</button>
                    <button type="button" id="Btn_Cancel" class="btn btn-danger waves-effect" style="margin-top: -1em">Cancel</button>
                    <button type="button" id="POPrintButton" class="btn btn-primary waves-effect hidden" style="margin-top: -1em">Print PO</button>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/PurchaseOrderApproval.js"></script>
</asp:Content>

