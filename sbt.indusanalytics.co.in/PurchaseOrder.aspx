<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="PurchaseOrder.aspx.vb" Inherits="PurchaseOrder" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .approvedorders {
            background-color: #4CAF50 !important;
        }

        .cancelledorders {
            background-color: #ea8384 !important;
        }

        .approvalpending {
            background-color: #e8f403 !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix padding-0 margin-0 margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 10px; padding-right: 10px; padding-bottom: 2px">
                    <div class="col-lg-11 col-md-11 col-sm-11 col-xs-12 padding-0 margin-0">
                        <div class="col-lg-3 col-md-4 col-sm-5 col-xs-12 padding-0 margin-0">
                            <div id="RadioButtonPO"></div>
                        </div>
                        <div id="DivCretbtn" class="col-lg-2 col-md-2 col-sm-2 col-xs-4 padding-0 margin-0">
                            <a id="CreatePOButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Create P.O.
                            </a>
                        </div>

                        <div id="DivEdit" class="col-lg-9 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                            <div class="col-lg-7 col-md-7 col-sm-9 col-xs-12 padding-0 margin-0">
                                <div id="RadioButtonStatus"></div>
                            </div>
                            <div id="DivDateChk" class="col-lg-1 col-md-1 col-sm-1 col-xs-3" style="display: none;">
                                <input type="checkbox" id="CHKPODetail" class="filled-in chk-col-red" />
                                <label class="font-11 m-b-0" for="CHKPODetail">Detail</label>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-8">
                                <a id="RefreshPOButton" href='#' class="iconButton">
                                    <i class="fa fa-refresh fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Refresh
                                </a>
                            </div>
                            <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 padding-0 margin-0">
                                <a id="EditPOButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                    <i class="fa fa-edit fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Edit
                                </a>
                                <a id="DeletePOButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                    <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12 padding-0 margin-0">
                        <b id="PRID" style="display: none"></b><b id="PRDisName" style="display: none"></b>
                        <strong id="POMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Purchase Order</strong>
                    </div>
                </div>
            </div>

            <div class="ContainerBoxCustom" style="float: left; height: auto; padding-left: 10px; padding-right: 10px;">
                <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                    <div id="POGridPending" style="width: 100%; height: calc(100vh - 88px); float: left; display: none"></div>
                    <div id="POGridProcess" style="width: 100%; height: calc(100vh - 92px); float: left; display: none"></div>
                    <input type="text" id="TxtPOID" style="display: none" />
                </div>
            </div>
        </div>
    </div>


    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Purchase Order Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>
                <button id="largeModalDisNone" type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="display: none">Reload</button>
                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <div class="row clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGrid">
                                    <div id="FieldCntainerRow">
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <label class="font-11 m-b-0">PO No</label>
                                            <input type="text" id="LblPONo" class="forTextBox" readonly="" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <label class="font-11 m-b-0">Date</label>
                                            <div id="VoucherDate"></div>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                            <label class="font-11 m-b-0">Supplier Name</label>
                                            <div id="SupplierName"></div>
                                            <strong id="ValStrSupplierName" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 p-r-0">
                                            <label class="font-11" id="LblState"></label>
                                            <br />
                                            <label class="font-11" id="LblCountry"></label>

                                            <label class="font-11 m-b-0" id="LblSupplierStateTin" style="float: left; display: none">0</label>
                                            <label class="font-11 m-b-0" id="CurrentCurrency" style="float: left; display: none"></label>
                                            <label class="font-11 m-b-0" id="ConversionRate" style="float: left; display: none"></label>
                                            <label class="font-11 m-b-0" id="VatGSTApplicable" style="float: left; display: none"></label>
                                        </div>

                                        <div id="DivContactPerson" class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="display: block">
                                            <label class="font-11 m-b-0">Cont.Person</label>
                                            <div id="ContactPersonName"></div>
                                            <strong id="ValStrContactPersonName" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>

                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <label class="font-11 m-b-0">Purchase Division</label>
                                            <div id="PurchaseDivision"></div>
                                            <strong id="ValStrPurchaseDivision" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>

                                        <div class="col-lg-9 col-md-9 col-sm-6 col-xs-12 padding-0 margin-0">
                                            <div id="DivCurrencySymbol" class="col-lg-3 col-md-4 col-sm-5 col-xs-12">
                                                <label class="font-11 m-b-0">Currency Code</label>
                                                <div id="SelCurrencyCode"></div>
                                            </div>
                                            <div id="DivPOApprovalBy" class="col-lg-4 col-md-5 col-sm-7 col-xs-12">
                                                <label class="font-11 m-b-0">PO Approval By</label>
                                                <div id="SelPOApprovalBy"></div>
                                            </div>
                                        </div>
                                        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-12">
                                            <br />
                                            <input type="button" name="BtnopenPop" value="Add Item" id="BtnopenPop" class="btn btn-primary" />
                                        </div>

                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div id="CreatePOGrid"></div>
                                        </div>

                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div style="float: left; width: 50%; text-align: left">
                                                <input id="BtnOtherHeadPop" type="button" name="BtnOtherHeadPop" value="Other Heads" class="btn btn-warning" />
                                            </div>
                                            <div style="float: left; width: 50%; text-align: right">
                                                <label class="font-11 m-b-0" style="">Basic Amount</label>
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
                                            <label class="font-11 m-b-0">Terms Of Payment</label>
                                            <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 padding-0 margin-0">
                                                <input type="text" id="TxtAddPayTerms" class="forTextBox" style="float: right;" placeholder="Add Payment Terms" />
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 padding-0 margin-0 padding-0 margin-0">
                                                <div class="DialogBoxCustom" style="float: right; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                                    <a id="BtnAddPayTerms" href='#' class="iconButton" style="margin-top: -1px; margin-right: 0px; float: left">
                                                        <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                                <div id="PaymentTermsGrid" style="float: left; width: 100%; height: 10em;"></div>
                                            </div>
                                        </div>

                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <label class="font-11 m-b-0" style="">Additional Charges</label><br />
                                            <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 padding-0 margin-0">
                                                <div id="SelLnameChargesGrid" style="float: right; height: 30px; width: 100%; border: 1px solid #d3d3d3"></div>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 padding-0 margin-0">
                                                <div class="DialogBoxCustom" style="float: right; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                                    <a id="BtnAddLedgerCharge" href='#' class="iconButton" style="margin-top: -1px; margin-right: 0px; float: left">
                                                        <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                                <div id="AdditionalChargesGrid" style="float: left; width: 100%; height: 10em;"></div>
                                            </div>
                                        </div>

                                        <div class="col-lg-8 col-md-8 col-sm-7 col-xs-12">
                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 p-r-0 p-l-0">
                                                <label class="font-11 m-b-0">Dealer Name</label>
                                                <div id="DealerName"></div>
                                                <strong id="ValStrDealerName" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>

                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                                <label class="font-11 m-b-0">Mode Of Transport</label>
                                                <div id="ModeOfTransport"></div>
                                                <strong id="ValStrModeOfTransport" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>

                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                                <label class="font-11 m-b-0">Delivery At</label>
                                                <textarea id="textDeliverAt" class="forTextBox m-t-0" style="height: 5em"></textarea>
                                            </div>

                                            <div class="col-lg-12 col-md-12 col-sm-6 col-xs-12 p-r-0">
                                                <label class="font-11 m-b-0">Purchase Reference</label>
                                                <textarea id="PORefernce" class="forTextBox" style="height: 5em"></textarea>
                                                <strong id="ValStrPORefernce" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                            <div style="float: left; width: 100%; text-align: right">
                                                <label class="font-11 m-b-0">GST Amount</label>
                                                <input type="text" id="TxtGstamt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" /><br />
                                                <label class="font-11 m-b-0">Other Taxable Amount</label>
                                                <input type="text" id="TxtOtheramt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" /><br />
                                                <label class="font-11 m-b-0" style="display: none">Total Tax Amount</label><%--&nbsp;&nbsp;&nbsp;--%>
                                                <input type="text" id="TxtTaxAmt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right; display: none" />
                                                <label class="font-11 m-b-0">Net Amount</label>
                                                <input type="text" id="TxtNetAmt" class="forTextBox" value="0" readonly="" style="width: 14em; text-align: right" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em; display: none" disabled="disabled">Save As</button>
                    <button type="button" id="POPrintButton" class="btn btn-link waves-effect" style="margin-top: -1em; color: none" disabled="disabled">Print</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                </div>
            </div>
        </div>
    </div>


    <%--OverFlow Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModalOverFlow" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Purchase Requisition</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentNext" style="display: block;">
                        <div id="FieldCntainerRowNext" class="row clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridNext">
                                    <div class="DialogBoxCustom" style="float: left; background-color: #fff; width: auto; padding-left: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                        <a id="BtnRefreshList" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; margin-left: 0px; padding-left: 0px; padding-right: 10px; float: left" title="Refresh Item List">
                                            <i class="fa fa-refresh fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp&nbsp Refresh 
                                        </a>

                                        <a id="BtnCreateNewItem" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; margin-left: 20px; padding-left: 0px; padding-right: 10px; float: left" title="Create New Item Master">
                                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp&nbsp Create New Item 
                                        </a>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="OverFlowGrid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivNext" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNext" class="btn btn-link waves-effect" style="margin-top: -1em">Next</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <%--largeModalSchedule Model PopUp (Delivery Schedule) --%>
    <div class="modal fade" id="largeModalSchedule" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Delivery Schedule</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div id="popContenerContentSchedule" style="display: block;">
                        <div id="FieldCntainerRowSchedule" class="row clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridSchedule">
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11 m-b-0">Purchase Quantity</label>
                                        <input type="text" id="TxtPurchaseQtySch" class="forTextBox" readonly="" />
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11 m-b-0">Schedule Quantity</label><br />
                                        <input type="text" id="TxtQtySch" class="forTextBox" />
                                        <br />
                                        <strong id="ValStrTxtQtySch" style="color: red; font-size: 12px; display: none"></strong>

                                        <label class="font-11 m-b-0" id="SchQtyLbl" style="float: left; display: none"></label>
                                        <label class="font-11 m-b-0" id="SchDelDateLbl" style="float: left; display: none"></label>
                                        <label class="font-11 m-b-0" id="SchItemIDLbl" style="float: left; display: none"></label>
                                        <label class="font-11 m-b-0" id="SchItemCodeLbl" style="float: left; display: none"></label>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11 m-b-0">Unit</label>
                                        <input type="text" id="TxtUnitSch" class="forTextBox" readonly="" />
                                        <strong id="ValStrTxtUnitSch" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11 m-b-0">Del.Date</label>
                                        <div id="SelDelDate"></div>
                                        <strong id="ValStrSelDelDate" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 20px; border-radius: 4px; text-align: left">
                                            <a id="BtnScheduleAdd" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; float: left">
                                                <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Add 
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="ScheduleGrid"></div>
                                    </div>
                                    <%--<div id="OverFlowGrid" style="float: left; width: 100%; height: calc(100vh - 110px); overflow-y: auto;"></div>--%>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivSchedule" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Apply Schedule</button>
                </div>
            </div>
            <%--</div>--%>
        </div>
    </div>

    <%--largeModalSchedule Model PopUp (Heads) --%>
    <div class="modal fade" id="largeModalHeads" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; width: 100%; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Others Heads</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentHeads" style="display: block;">
                        <div id="FieldCntainerRowHeads" class="row clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridHeads">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="OtherHeadsGrid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivHeads" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Ok</button>
                </div>
            </div>
        </div>
    </div>

    <%--Choose Another ProductHSNGroup Model PopUp (Delivery Schedule) --%>
    <div class="modal fade" id="largeModalHSNGroup" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Product HSN Name</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentProductHSN" style="display: block;">
                        <div id="FieldCntainerRowProductHSN" class="row clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridProductHSN">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button type="button" id="BtnOpenProductHSNPopUp" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em; display: none">OpenProductHSNPopUp</button>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div id="ProductHSNGrid"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivProductHSN" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnProductHSN" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Apply Group</button>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/PurchaseOrder.js?1"></script>
</asp:Content>

