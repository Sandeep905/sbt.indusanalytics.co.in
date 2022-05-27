<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ItemPhysicalVerification.aspx.vb" Inherits="ItemPhysicalVerification" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom">
                    <div class="col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 p-l-0 m-t-5"><b class="font-11">Voucher No</b></div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-7 p-l-0">
                            <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" disabled="disabled" />
                        <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                        </div>
                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-4 p-l-0 m-t-5"><b class="font-11">Date</b></div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-7 margin-0 p-l-0">
                            <div id="DtPickerVoucherDate"></div>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2 hidden">
                        <b class="font-11">Item Group:</b>
                        <div id="SelItemGroup"></div>
                    </div>
                    <div class="col-xs-2 col-sm-4 col-md-6 col-lg-7">
                        <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Physical Stock Verification</strong>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div id="gridstock"></div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <b class="font-11">Stock Batch Wise :</b>
                    <div id="StockBatchWiseGrid"></div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Item Code :</b>
                    </div>
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                        <input class="forTextBox" type="text" name="TxtItemCode" id="TxtItemCode" readonly="readonly" value="" />
                        <input class="forTextBox" type="hidden" name="TxtItemID" id="TxtItemID" value="" />
                        <input class="forTextBox" type="hidden" name="TxtGRNTransactionID" id="TxtGRNTransactionID" value="" />
                        <input class="forTextBox" type="hidden" name="TxtTotalStock" id="TxtTotalStock" value="" />
                        <input class="forTextBox" type="hidden" name="TxtUnitDecimalPlace" id="TxtUnitDecimalPlace" value="" />
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Item Name :</b>
                    </div>
                    <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5" style="padding-left: 0px;">
                        <input class="forTextBox" type="text" name="TxtItemName" id="TxtItemName" readonly="readonly" value="" />
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Stock Unit :</b>
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px;">
                        <input class="forTextBox" type="text" name="TxtStockUnit" id="TxtStockUnit" readonly="readonly" value="" />
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1" style="padding-left: 0px; margin-top: 5px;">
                        <input type="checkbox" id="chknewstock" class="filled-in chk-col-red" style="height: 20px; float: left" onclick="enableControls()" />
                        <label for="chknewstock" style="height: 20px">New Stock</label>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Warehouse :</b>
                    </div>
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                        <div id="sel_Warehouse" style="float: left; height: auto;"></div>
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Bin Name :</b>
                    </div>
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                        <div id="sel_Bin" style="float: left; height: auto;"></div>
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Batch No. :</b>
                    </div>
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                        <input class="forTextBox" type="text" name="TxtBatchNo" id="TxtBatchNo" value="" />
                    </div>
                    <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1">
                        <b class="font-11">Physical Qty :</b>
                    </div>
                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-left: 0px;">
                        <input class="forTextBox" type="text" name="TxtAdjestQty" id="TxtAdjestQty" value="" />
                    </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <a id="BtnAdd" href='#' class="myButton" style="margin-top: 0px; margin-right: 10px; float: right">
                        <%--<i class="fa fa-copy fa-2x fa-fw" style="font-size: 14px;"></i>onclick="OpenPopup(this)" --%>
                        <img src="images/NewClient.png" style="height: 20px; width: 15px; float: left; margin-top: 0px;" />&nbsp Add
                    </a>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div id="gridnewstock"></div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <b class="font-11">Remark :</b>
                    <%--<input class="forTextBox" type="text" id="TxtNarration" name="TxtNarration" placeholder="Remark" value="" />--%>
                    <input class="forTextBox" type="text" name="TxtNarration" id="TxtNarration" value="" placeholder="Remark" />
                </div>

                <div class="modal-footer" style="position: static;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnShowList" class="btn btn-info waves-effect">Show List</button>
                </div>
            </div>
        </div>
    </div>
    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">

            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Physical Stock Verification</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <div id="FieldCntainerRow" class="row clearfix tab-pane animated fadeInRight active">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div id="GridShowList"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="BtnDelete" data-dismiss="modal">Delete</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/ItemPhysicalVerification.js"></script>
</asp:Content>

