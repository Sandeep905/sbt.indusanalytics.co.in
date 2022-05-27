<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="PurchaseInvoice.aspx.vb" Inherits="PurchaseInvoice" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 10px; padding-right: 10px; padding-bottom: 2px">
                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12" style="margin: 0px; padding: 0px">
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12" style="margin: 0px; padding: 0px">
                            <div id="RadioButtonPI" style="float: left; margin-left: 1em; margin-top: .4em"></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12" style="margin: 0px; padding: 0px">
                            <div id="DivCretbtn" style="height: auto;">
                                <a id="CreatePIButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                                    <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Create Purchase Invoice
                                </a>
                            </div>
                        </div>

                        <div id="DivEdit" class="col-lg-3 col-md-3 col-sm-4 col-xs-12" style="margin: 0px; padding: 0px; display: none">
                            <a id="EditPIButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: block">
                                <i class="fa fa-edit fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Edit
                            </a>
                            <a id="DeletePIButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: block">
                                <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="margin: 0px; padding: 0px">
                        <b id="PRID" style="display: none"></b><b id="PRDisName" style="display: none"></b>
                        <strong id="PIMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Purchase Invoice </strong>
                    </div>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto; padding-left: 10px; padding-right: 10px;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="PIGridPending" style="width: 100%; height: calc(100vh - 88px); float: left; display: none"></div>
                        <div id="PIGridProcess" style="width: 100%; height: calc(100vh - 92px); float: left; display: none"></div>
                        <input type="text" id="TxtPIID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>


    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Purchase Invoice Creation/Updation</strong>
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
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGrid">

                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11">Voucher No</label>
                                        <input type="text" id="LblPINo" class="forTextBox" readonly="" />
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label class="font-11">Voucher Date</label>
                                        <div id="VoucherDate" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <label class="font-11">Supplier Name</label>
                                        <input type="text" id="TxtSupplierName" class="forTextBox" />
                                        <input type="text" id="TxtSupplierID" class="forTextBox" style="display: none" />
                                        <%--<div id="SupplierName" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>--%>
                                        <br />
                                        <strong id="ValStrTxtSupplierName" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div id="DivContactPerson" class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                                        <label class="font-11">Mailing Name</label>
                                        <input type="text" id="TxtMailingName" class="forTextBox" />
                                        <br />
                                        <strong id="ValStrTxtMailingName" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <label class="font-11">Purchase Ledger</label>
                                        <div id="PurchaseLedger" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                        <br />
                                        <strong id="ValStrPurchaseLedger" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <label id="LblState" style="float: left; width: 100%"></label>
                                        <br />
                                        <label id="LblCountry" style="float: left; width: 100%"></label>
                                        <label id="LblSupplierStateTin" style="float: left; display: none">0</label>
                                        <label id="CurrentCurrency" style="float: left; display: none"></label>
                                        <label id="ConversionRate" style="float: left; display: none"></label>
                                        <label id="VatGSTApplicable" style="float: left; display: none"></label>
                                    </div>

                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="CreatePIGrid" style="float: left; width: 100%; height: 20em;"></div>
                                    </div>

                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin-top: .5em; float: left; margin-bottom: 5px; height: auto; padding: 0px; padding-left: 0px; padding-right: 13px; margin-bottom: 0em">
                                            <div style="float: left; width: 100%;">
                                                <label style="">Additional Charges</label>
                                                <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="padding: 0px; margin: 0px;">
                                                    <div id="SelLnameChargesGrid" style="float: right; height: 30px; width: 100%; border: 1px solid #d3d3d3"></div>
                                                </div>
                                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="padding: 0px; margin: 0px">
                                                    <div class="DialogBoxCustom" style="float: right; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                                        <a id="BtnAddLedgerCharge" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; float: left">
                                                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px">
                                                    <div id="AdditionalChargesGrid" style="float: left; width: 100%; height: 20em;"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0">
                                            <div style="float: left; width: 100%; text-align: left">
                                                <label style="">Basic Amount</label>
                                                <input type="text" id="TxtBasicAmt" class="forTextBox" value="0" readonly="" />
                                            </div>
                                            <div style="float: left; width: 100%; text-align: left">
                                                <label style="">Total Tax</label>
                                                <input type="text" id="TxtTaxAmt" class="forTextBox" value="0" readonly="" /><br />
                                            </div>
                                            <div style="float: left; width: 100%; text-align: left">
                                                <label style="">Round Off A/C</label>
                                                <input type="text" id="TxtRoundOff" class="forTextBox" value="0" readonly="" />
                                            </div>
                                            <div style="float: left; width: 100%; text-align: left">
                                                <label style="">Net Amount</label>
                                                <input type="text" id="TxtNetAmt" class="forTextBox" value="0" readonly="" />
                                            </div>

                                            <div style="float: left; width: 100%; text-align: right; display: none">
                                                <input type="text" id="TxtCGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="TxtSGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="TxtIGSTAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="TxtAfterDisAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="TxtTtlLandedtAmtAmt" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="Txt_TaxAbleSum" class="forTextBox" value="0" readonly="" style="display: none" />
                                                <input type="text" id="TxtTotalQty" class="forTextBox" value="0" readonly="" style="display: none" />
                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="">
                                                <label class="font-11">Bill No.</label>
                                                <input type="text" id="PIBillNo" class="forTextBox" />
                                                <strong id="ValStrPIBillNo" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="">
                                                <label class="font-11">Bill Date</label>
                                                <div id="PIBillDate" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                                <strong id="ValStrPIBillDate" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>

                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="">
                                                <label class="font-11">D.Note No</label>
                                                <input type="text" id="textDeliveryNote" class="forTextBox" readonly="" />
                                            </div>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                            <label class="font-11">TCS Rate(%)</label>
                                            <input type="number" id="TxtTcsRate" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" style="">
                                            <label class="font-11">TCS Amount</label>
                                            <input type="number" id="TxtTcsAmount" class="forTextBox" readonly="" />
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="">
                                            <label class="font-11">Remark</label>
                                            <textarea id="textNaretion" class="forTextBox" style="height: 3em"></textarea>
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
                    <button type="button" id="PIPrintButton" class="btn btn-link waves-effect" style="margin-top: -1em; color: none; display: none" disabled="disabled">Print</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                </div>
            </div>
        </div>
    </div>



    <script src="CustomJS/PurchaseInvoice.js"></script>

</asp:Content>

