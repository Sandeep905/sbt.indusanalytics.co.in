<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="JobQCPacking.aspx.vb" Inherits="JobQCPacking" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 10px; padding-right: 10px; padding-bottom: 2px">
                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12 padding-0 margin-0">
                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 padding-0 margin-0">
                            <div id="RadioButtonQC"></div>
                        </div>
                        <div id="DivCreateButton" class="col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0 margin-0">
                            <a id="CreateButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Create
                            </a>
                        </div>

                        <div id="DivEdit" class="col-lg-2 col-md-2 col-sm-4 col-xs-12 padding-0 margin-0" style="display: none">
                            <a id="EditButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: block">
                                <i class="fa fa-eye fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Show
                            </a>
                            <a id="DeleteButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: block">
                                <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0 margin-0">
                        <b id="QCID" style="display: none"></b><b id="PRDisName" style="display: none"></b>
                        <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">QC & Packing </strong>
                    </div>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto; padding-left: 10px; padding-right: 10px;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="PendingProcessGrid" style="width: 100%; height: calc(100vh - 88px); float: left; display: block"></div>
                        <%--<div id="PIGridProcess" style="width: 100%; height: calc(100vh - 92px); float: left; display: none"></div>--%>
                        <input type="text" id="TxtQCID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="image-indicator"></div>
    <%--largeModalPickList Model PopUp (PickList) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Create QC And Packing</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="FieldCntainerRowPickList" class="row clearfix">
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridPickList">
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Voucher No.</b>
                                    <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                    <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Date</b>
                                    <div id="VoucherDate"></div>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Job Booking No.</b>
                                    <input type="text" class="forTextBox" name="txtJobBookingNo" id="txtJobBookingNo" readonly="readonly" value="" style="float: left" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Prod.Code</b>
                                    <input type="text" class="forTextBox" name="txtProductCode" id="txtProductCode" readonly="readonly" value="" style="float: left" />
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                    <b class="font-11">Job Name</b>
                                    <input type="text" class="forTextBox" name="txtJobName" id="txtJobName" readonly="readonly" value="" style="float: left" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">P.C. No.</b>
                                    <input type="text" class="forTextBox" name="txtProductCatalogNo" id="txtProductCatalogNo" readonly="readonly" value="" style="float: left" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Order Qty</b>
                                    <input type="text" class="forTextBox" name="txtOrderQty" id="txtOrderQty" readonly="readonly" value="" style="float: left" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Job Qty</b>
                                    <input type="text" class="forTextBox" name="txtJobCardQty" id="txtJobCardQty" readonly="readonly" value="" style="float: left" />
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Ready Qty</b>
                                    <input type="text" class="forTextBox" name="txtReadyQty" id="txtReadyQty" readonly="readonly" value="" style="float: left" />
                                </div>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <b class="font-11">Semi-Packing Details</b>
                                    <div id="packingDetailGrid"></div>
                                </div>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <b class="font-12">SHIPPER DETAILS SIZE IN(CM)</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Length</b>
                                    <input type="number" class="forTextBox" name="txtShipperLength" id="txtShipperLength" value="" style="float: left" onkeyup="CalulationCBInch();" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Width</b>
                                    <input type="number" class="forTextBox" name="txtShipperWidth" id="txtShipperWidth" value="" style="float: left" onkeyup="CalulationCBInch();" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Height</b>
                                    <input type="number" class="forTextBox" name="txtShipperHeight" id="txtShipperHeight" value="" style="float: left" onkeyup="CalulationCBInch();" />
                                    <input type="number" class="forTextBox" name="txtCFT" id="txtCB_INCH" value="" style="float: left; display: none" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">CFT/CFC</b>
                                    <input type="number" class="forTextBox" name="txtCFT" id="txtCFT" value="" style="float: left" readonly="" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">QC Approved CFC</b>
                                    <input type="number" class="forTextBox" name="txtQcApproveCFC" id="txtQcApproveCFC" value="" style="float: left" />
                                </div>

                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <b class="font-11">Wt./CFC</b>
                                    <input type="number" class="forTextBox" name="txtCFCWt" id="txtCFCWt" value="" style="float: left" />
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0">
                                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" style="display: none">
                                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                                            <b class="font-11">Verified by Q.C.</b>
                                        </div>
                                        <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                                            <div id="RadioButtonQCApprove"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 padding-0 margin-0">
                                        <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-t-5" style="float: left;">
                                            <b class="font-11">QC Hold CFC</b>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                                            <input type="number" class="forTextBox" name="txtQcHoldCFC" id="txtQcHoldCFC" value="" />
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 padding-0 margin-0">
                                        <div class="DialogBoxCustom" style="float: right; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; margin-right: 0px; border-radius: 4px; text-align: left; box-shadow: 0 0px 0px rgba(0, 0, 0, 0.3);">
                                            <%-- <a id="BtnRemoveCFC" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; float: right" title="add new row">
                                                        <i class="fa fa-minus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Remove
                                                    </a>--%>
                                            <a id="BtnAddCFC" href='#' class="iconButton" style="margin-top: 0px; margin-right: 10px; float: right" title="add new row">
                                                <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Add
                                            </a>
                                            <a id="BtnHoldCFC" href='#' class="iconButton" style="margin-top: 0px; margin-right: 10px; float: right; display: none" title="add new row">
                                                <i class="fa fa-pause fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Hold
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="QcPackingDetailGrid"></div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                    <b class="font-11">Warehouse</b>
                                    <div id="selWarehouse"></div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                    <b class="font-11">Bin</b>
                                    <div id="selBin"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                    <b class="font-11">Remark</b>
                                    <textarea id="TxtNarration" class="forTextBox m-t-0"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="btnDivPickList" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="BtnPrintButton" class="btn btn-primary waves-effect" disabled="disabled">Print</button>
                    <button type="button" id="BtnNew" class="btn btn-default waves-effect">New</button>
                </div>
            </div>
        </div>
    </div>

    <input type="text" id="txtSemiPackingMainID" style="display: none" />
    <input type="text" id="txtJobBookingID" style="display: none" />
    <input type="text" id="txtJobBookingJobCardContentsID" style="display: none" />
    <input type="text" id="txtProductMasterID" style="display: none" />
    <input type="text" id="txtBookingID" style="display: none" />
    <input type="text" id="txtOrderBookingID" style="display: none" />
    <input type="text" id="txtOrderBookingDetailsID" style="display: none" />

    <input type="text" id="txtTotalQuantity" style="display: none" />
    <input type="text" id="txtTotalOuterCarton" style="display: none" />
    <input type="text" id="txtTotalInnerCarton" style="display: none" />

    <input type="text" id="FGTransactionID" style="display: none" />

    <script src="CustomJS/QcAndPacking.js"></script>
</asp:Content>

