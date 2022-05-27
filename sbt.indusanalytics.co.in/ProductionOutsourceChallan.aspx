<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductionOutsourceChallan.aspx.vb" Inherits="OutsourceChallan" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div role="tabpanel" class="row p-l-10" id="EntryForm">
        <div class="dialogboxContainerMainMAster">
            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-bottom: 2px">
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                    <button type="button" id="BtnCreateEdit" class="btn btn-primary waves-effect">Create Challan</button>
                    <button type="button" id="BtnPrint" class="btn btn-info waves-effect hidden">Print Challan</button>
                </div>
                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12 margin-0 padding-0">
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Production Outsource</strong>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="RadioButtonPO"></div>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div id="gridPendingProcessPO"></div>
            <textarea id="TxtOutsourceIds" class="hidden"></textarea>
        </div>
    </div>

    <%-- Model Add Material--%>
    <div class="modal fade" id="largeModalDetails" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag"></strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                        <li role='presentation' class="active"><a id="AnchorFieldPlannedJobProcess" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Material Selection</a></li>
                    </ul>
                    <div class="rowcontents clearfix p-l-0">
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0">Outsouce Challan No</label>
                            <input type="text" id="LblPONo" class="forTextBox disabled" readonly="" disabled="disabled" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0">Challan Date</label>
                            <div id="DtVoucherDate"></div>
                        </div>

                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <label class="font-12 m-b-0">Vendor</label>
                            <input type="text" name="TxtVendorName" id="TxtVendorName" disabled="disabled" class="forTextBox disabled" value="" />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <label class="font-11 m-b-0">Place of Supply</label>
                            <input type="text" id="TxtDestination" class="forTextBox" />
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="gridContentMaterialDetail"></div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <label class="font-12 m-b-0" for="TxtRemarks">Remarks</label>
                            <textarea id="TxtRemarks" class="forTextBox m-t-0" rows="3" cols="2"></textarea>
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtTransporter">Transporter</label>
                            <input type="text" name="TxtTransporter" id="TxtTransporter" class="forTextBox" value="" />
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                            <label class="font-12 m-b-0" for="TxtVehicleNo">Vehicle No.</label>
                            <input type="text" name="TxtVehicleNo" id="TxtVehicleNo" class="forTextBox" value="" />
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
                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 2.5em">
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect m-t--15">Save</button>
                    <button type="button" id="BtnDelete" class="btn btn-danger waves-effect m-t--15">Delete</button>
                </div>
            </div>

        </div>
    </div>

    <script src="CustomJS/ProductionOutsourceChallan.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
</asp:Content>

