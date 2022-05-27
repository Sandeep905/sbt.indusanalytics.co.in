<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ItemTransferBetweenWarehouses.aspx.vb" Inherits="ItemTransferBetweenWarehouses" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <a id="CreateVoucherButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 10px;">
                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Create Transfer Voucher
                        </a>
                        <a id="EditVoucherButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                            <i class="fa fa-edit fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Edit Voucher
                        </a>
                         <a id="DeleteVoucherButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;display:none">
                            <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                        </a>
                    </div>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Transfer Between Warehouses</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px;margin-left: 10px;margin-right: 10px;">
                        <div class="demo-container">
                            <div id="gridvoucherslist" style="width: 100%; min-height: calc(100vh - 100px); float: left; display: block"></div>
                            <input type="text" id="TxtTransactionID" style="display: none" />
                        </div>
                    </div>
                    <%--<div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 2px; padding-bottom: 2px; width: auto; padding-right: 1px; margin-top: 0px; border-radius: 4px; text-align: left">
                        <a id="Btn_Update" href='#' class="iconButton" style="margin-top: 1px; margin-right: 1px; float: left">
                            <i class="fa fa-copy fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Approve
                        </a>
                    </div>--%>
                </div>
            </div>
        </div>
    </div>
    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">

            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Transfer Between Warehouses</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="popContenerContent" style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px; padding-top: 10px; padding-left: 0px;">
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px;">
                                    <b class="font-11">Voucher No. :</b>
                                </div>
                                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                                    <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                    <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px;">
                                    <b class="font-11">Voucher Date :</b>
                                </div>
                                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                                    <div id="DtPickerVoucherDate" style="float: left; height: auto;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px;">
                                    <b class="font-11">Warehouse :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-left: 0px;">
                                    <div id="sel_Warehouse" style="float: left; height: auto;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; padding-top: 5px;">
                                    <b class="font-11">Bin :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-left: 0px;">
                                    <div id="sel_Bin" style="float: left; height: auto;"></div>
                                </div>
                            </div>
                        </div>
                        <div id="FieldCntainerRow" class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 0px; max-height: calc(100vh - 147px); overflow-y: auto">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 2px;">
                                <div id="GridWarehouseStock" style="float: left; width: 100%; height: auto;"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 2px;">
                                <div id="GridTransferStock" style="float: left; width: 100%; height: auto;"></div>
                            </div>
                            <%--<div class="DialogBoxCustom" style="float: left; background-color: #fff; margin-left: 15px; width: 98%; padding-left: 10px; padding-bottom: 2px">
                                <strong id="PRMasterDisplayName1" class="MasterDisplayName" style="float: left; color: #42909A">Voucher Details : -</strong>
                            </div>--%>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px;">
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-top: 27px; float: left; padding-left: 0px; padding-right: 0px">
                                    <b class="font-11">Destination Warehouse :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-top: 20px;">
                                    <div id="sel_DestinationWarehouse" style="float: left; height: auto;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-top: 27px; float: left; text-align: right; padding-left: 0px; padding-right: 0px;">
                                    <b class="font-11">Destination Bin :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-top: 20px; padding-right: 0px;">
                                    <div id="sel_DestinationBin" style="float: left; height: auto;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-top: 27px; float: left; padding-left: 0px; padding-right: 0px">
                                    <b class="font-11">Slip No. :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-top: 20px;">
                                    <input class="forTextBox" type="text" id="TxtDnNo" name="TxtDnNo" placeholder="Slip No." value="" />
                                </div>
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-top: 27px; float: left; padding-right: 0px; padding-left: 0px;">
                                    <b class="font-11">Slip Date :</b>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2" style="padding-top: 20px;">
                                    <div id="DtPickerDnDate" style="float: left; height: auto;"></div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-top: 0px; margin-bottom: 0px; padding-right: 0px;">
                                <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-top: 5px; float: left; padding-left: 0px; padding-right: 0px">
                                    <b class="font-11">Remark :</b>
                                </div>
                                <div class="col-xs-12 col-sm-11 col-md-11 col-lg-11" style="padding-top: 0px;">
                                    <%--<input class="forTextBox" type="text" id="TxtNarration" name="TxtNarration" placeholder="Remark" value="" />--%>
                                    <textarea class="forTextBox" id="TxtNarration" name="TxtNarration" placeholder="Remark" style="height:40px;"></textarea>
                                </div>
                            </div>
                            <%--<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-1">
                                        <b class="font-11">Order Quantity</b>
                                        <input type="number" name="OrderQuantity" id="TxtOrderQuantity" value="" min="0" class="forTextBox" />
                                    </div>
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-1">
                                        <b class="font-11">Quoted Rate</b>
                                        <input type="number" name="QuotedRate" id="TxtQuotedRate" readonly="readonly" value="" min="0" class="forTextBox" />
                                    </div>
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-1">
                                        <b class="font-11">Approved Rate</b>
                                        <input type="number" name="ApprovedRate" id="TxtApprovedRate" readonly="readonly" value="" min="0" class="forTextBox" />
                                    </div>
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-1">
                                        <a id="BtnAddProduct" href='#' class="myButton" style="margin-top: 1px; margin-left: 2px;">
                                            <i class="fa fa-plus-square fa-2x"></i>
                                        </a>
                                    </div>
                                </div>--%>
                        </div>
                        <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                            <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                            <button type="button" id="BtnPrint" class="btn btn-link waves-effect" style="margin-top: -1em">Print</button>
                            <button type="button" id="BtnDelete" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <script src="CustomJS/ItemTransferBetweenWarehouses.js"></script>
</asp:Content>

