<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="PurchaseGRN.aspx.vb" Inherits="PurchaseGRN" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="col-lg-3 col-md-4 col-sm-5 col-xs-10">
                    <div id="optreceiptradio"></div>
                </div>
                <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2">
                    <input type="button" name="Btn_Next" id="Btn_Next" class="btn btn-primary" value="Next" />
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="gridreceiptlist" style="width: 100%; height: calc(100vh - 100px); float: left; display: block"></div>
                        <input type="text" id="TxtGRNID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
        <div id="image-indicator"></div>
    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Goods Receipt Note</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="rowcontents">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0 margin-0">
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Receipt No.</b>
                                <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Receipt Date</b>
                                <div id="DtPickerVoucherDate"></div>
                            </div>
                            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                <b class="font-11">Supplier Name</b>
                                <input class="forTextBox" type="text" name="TxtSupplierName" id="TxtSupplierName" readonly="readonly" value="" />
                                <input class="forTextBox" type="hidden" name="TxtSupplierID" id="TxtSupplierID" value="" />
                            </div>
                        </div>
                    </div>
                    <div id="FieldCntainerRow" class="rowcontents clearfix tab-pane animated fadeInRight active">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div id="GridPurchaseOrders"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <b class="font-11">Batch Stock Details- </b>
                            <div id="GridReceiptBatchDetails"></div>
                        </div>
                        <%--<div class="DialogBoxCustom" style="float: left; background-color: #fff; margin-left: 15px; width: 98%; padding-left: 10px; padding-bottom: 2px">
                                <strong id="PRMasterDisplayName1" class="MasterDisplayName" style="float: left; color: #42909A">Receipt Note Details -</strong>
                            </div>--%>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0 margin-0">
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Purchase D.N.No./Invoice No.</b>
                                <input class="forTextBox" type="text" id="TxtDnNo" name="TxtDnNo" placeholder="Delivery Note No." value="" />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Purchase D.N.No./Invoice Date</b>
                                <div id="DtPickerDnDate"></div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Gate Entry No.</b>
                                <input class="forTextBox" type="text" id="TxtGENo" name="TxtGENo" placeholder="Gate Entry No." value="" />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Gate Entry Date</b>
                                <div id="DtPickerGEDate"></div>
                            </div>

                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">L.R.No./Vehicle No.</b>
                                <input class="forTextBox" type="text" id="TxtLRNo" name="TxtLRNo" placeholder="Vehicle No." value="" />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Transporter</b>
                                <input class="forTextBox" type="text" id="TxtTransporters" name="TxtTransporters" placeholder="Transporter Name" value="" />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                <b class="font-11">Received By</b>
                                <div id="sel_Receiver"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <b class="font-11">Remark</b>
                                <%--<input class="forTextBox" type="text" id="TxtNarration" name="TxtNarration" placeholder="Remark" value="" />--%>
                                <textarea class="forTextBox m-t-0" id="TxtNarration" name="TxtNarration" placeholder="Remark"></textarea>
                            </div>
                        </div>

                    </div>

                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnPrint" class="btn btn-primary waves-effect">Print</button>
                    <button type="button" id="BtnTransporterSlip" class="btn btn-secondary waves-effect">Transporter Slip</button>
                    <button type="button" id="BtnDelete" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/PurchaseGRN.js?1"></script>
</asp:Content>

