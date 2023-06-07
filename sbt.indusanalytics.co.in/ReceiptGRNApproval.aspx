<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ReceiptGRNApproval.aspx.vb" Inherits="ReceiptGRNApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12 padding-0 margin-0">
                        <div class="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                            <div id="RadioButtonPGRN"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <div id="DivCretbtn" style="height: auto;">
                                <a id="NextButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                    <i class="fa fa-save fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Next
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="margin: 0px; padding: 0px">
                        <b id="PRID" style="display: none"></b><b id="PRDisName" style="display: none"></b>
                        <strong id="POMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Receipt Note QC Approval</strong>
                    </div>
                </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="PendingReceiptGRNGrid"></div>
                <input type="text" id="TxtGRNID" style="display: none" />
            </div>
        </div>
    </div>

    <%--largeModalPickList Model PopUp (PickList) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Purchase GRN Approval (Update)</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentPickList" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerPickList" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div id="FieldCntainerRowPickList" class="rowcontents clearfix">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridPickList">

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Receipt No. :</b>
                                    <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                    <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Receipt Date :</b>
                                    <div id="DtPickerVoucherDate"></div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                    <b class="font-11">Supplier Name :</b>
                                    <input class="forTextBox" type="text" name="TxtSupplierName" id="TxtSupplierName" readonly="readonly" value="" />
                                    <input class="forTextBox" type="hidden" name="TxtSupplierID" id="TxtSupplierID" value="" />
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div id="GridPurchaseGRNApproval"></div>
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Purchase D.N.No./Invoice No. :</b>
                                    <input class="forTextBox" type="text" id="TxtDnNo" name="TxtDnNo" readonly="" placeholder="Delivery Note No." value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Purchase D.N.No./Invoice Date :</b>
                                    <div id="DtPickerDnDate"></div>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Gate Entry No. :</b>
                                    <input class="forTextBox" type="text" id="TxtGENo" name="TxtGENo" readonly="" placeholder="Gate Entry No." value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Gate Entry Date :</b>
                                    <div id="DtPickerGEDate"></div>
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">L.R.No./Vehicle No. :</b>
                                    <input class="forTextBox" type="text" id="TxtLRNo" name="TxtLRNo" readonly="" placeholder="Vehicle No." value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Transporter :</b>
                                    <input class="forTextBox" type="text" id="TxtTransporters" name="TxtTransporters" readonly="" placeholder="Transporter Name" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Received By :</b>
                                    <div id="sel_Receiver"></div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <b class="font-11">Remark :</b>
                                    <%--<input class="forTextBox" type="text" id="TxtNarration" name="TxtNarration" placeholder="Remark" value="" />--%>
                                    <textarea class="forTextBox" id="TxtNarration" name="TxtNarration" placeholder="Remark" readonly=""></textarea>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivPickList" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnPermit" class="btn btn-link waves-effect" style="margin-top: -1em"></button>
                    <button type="button" id="POPrintButton" class="btn btn-link waves-effect" style="margin-top: -1em; color: none" disabled="disabled">Print</button>
                    <button type="button" id="BtnTransporterSlip" class="btn btn-link waves-effect" style="margin-top: -1em">Transporter Slip</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ReceiptGRNApproval.js"></script>
</asp:Content>

