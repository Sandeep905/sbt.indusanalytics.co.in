<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductionOutsourceReceived.aspx.vb" Inherits="ProductionOutsourceReceived" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div role="tabpanel" class="row p-l-10" id="EntryForm">
        <div class="dialogboxContainerMainMAster">
            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-bottom: 2px">
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <button type="button" id="BtnCreateEdit" class="btn btn-primary waves-effect">Create</button>
                    <button type="button" id="BtnPrint" class="btn btn-info waves-effect hidden">Print</button>
                    <button type="button" id="BtnDelete" class="btn btn-danger waves-effect hidden">Delete</button>
                    <button type="button" id="BtnPrintChallan" class="btn btn-def waves-effect hidden">Print Challan</button>
                </div>
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-6 margin-0 padding-0">
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Outsource Receipt</strong>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="RadioButtonPO"></div>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div id="gridPendingProcess"></div>
        </div>
    </div>
    <div id="LoadIndicator"></div>
    <%-- Model Received--%>
    <div class="modal fade" id="largeModalDetails" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Outsource Receipt</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="rowcontents clearfix p-l-0">
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0">Received Voucher No</label>
                            <input type="text" id="LblPONo" class="forTextBox disabled" readonly="" disabled="disabled" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0">Voucher Date</label>
                            <div id="DtVoucherDate"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                            <label class="font-12 m-b-0">Job Card No</label>
                            <input type="text" name="TxtJobNo" id="TxtJobCardNo" readonly="" disabled="disabled" class="forTextBox disabled" value="" />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <label class="font-12 m-b-0">Vendor</label>
                            <input type="text" name="TxtVendorName" id="TxtVendorName" readonly="" disabled="disabled" class="forTextBox disabled" value="" />
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="gridJobCardContentsList"></div>
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="gridProcessDetail"></div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="gridMaterialsDetail"></div>
                        </div>
                        
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtDeliveryNoteNo">Delivery Note No</label>
                            <input type="text" name="DeliveryNoteNo" id="TxtDeliveryNoteNo" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="DtDeliveryNoteDate">Delivery Note Date</label>
                            <div id="DtDeliveryNoteDate"></div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtTransporter">Transporter</label>
                            <input type="text" name="TxtTransporter" id="TxtTransporter" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtVehicleNo">Vehicle No.</label>
                            <input type="text" name="TxtVehicleNo" id="TxtVehicleNo" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtReceivedBy">Received By</label>
                            <input type="text" name="TxtReceivedBy" id="TxtReceivedBy" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                            <label class="font-12 m-b-0" for="TxtRemarks">Remarks</label>
                            <textarea id="TxtRemarks" class="forTextBox m-t-0" rows="3" cols="2"></textarea>
                        </div>
                        
                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtBillNo">E-Way Bill No.</label>
                            <input type="text" name="TxtBillNo" id="TxtBillNo" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0">E-Way Bill Date</label>
                            <div id="DtBillDate"></div>
                        </div>

                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                </div>
            </div>

        </div>
    </div>

    <script src="CustomJS/ProductionOutsourceReceived.js"></script>
</asp:Content>

