<%@ Page Title="JobCard Schedule" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="JobCardSchedule.aspx.vb" Inherits="JobCardSchedule" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-1 margin-0">
        <input type="button" value="Show List" class="btn btn-success" id="BtnShowlist" data-toggle="modal" />
        <div id="AllContents" class="hidden"></div>
        <strong class="hidden" style="border: 1px dashed;" id="PlanContQty">0</strong>
        <strong class="hidden" style="border: 1px dashed;" id="ContentOrientation">0</strong>
        <strong class="hidden" style="border: 1px dashed;" id="PlanContName">0</strong>
        <a style="float: right; margin-bottom: 5px; cursor: pointer" class="btn btn-info" id="BtnChooseFromSO" data-toggle="modal">Choose From Sales Order</a>

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                <div role="tabpanel" class="row " style="display: block;">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 padding-0 margin-0 hidden">
                            <b class="font-12">Sales Order No</b>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 row" style="display: flex">
                                <input class="forTextBox" type="text" id="TxtSalesOrderNo" />
                                <i class="fa fa-search fa-2x" style="margin-left: 10px; cursor: pointer"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0" style="border-top: 0px solid #42909A; padding-top: 5px">

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <b class="font-11">Job Booking No</b><br />
                            <input class="forTextBox disabledbutton" type="text" id="TxtBookingNoAuto" disabled="disabled" readonly="" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                            <b class="font-11">Quantity</b><br />
                            <input type="text" class="forTextBox" id="TxtQuantity" disabled="disabled" readonly="" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                            <b class="font-11">Date</b><br />
                            <div id="DatePM"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Enquiry No</div>
                            <input type="text" class="forTextBox disabledbutton" id="TxtEnquiryNo" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Quotation No.</div>
                            <div class="hidden" id="SelPODate"></div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtQuotationNo" readonly="" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <%--Quotation Details--%>
                            <div class="font-11">Salse Order No</div>
                            <input type="text" class="forTextBox " id="TxtOrderBookingNo" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Sales Order Date</div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtOrderBookingDate" readonly="" />
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12  padding-0 margin-0 " style="border-top: 1px solid #42909A; padding-top: 5px">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                                    <%--Common Job Details--%>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="border-top: 1px solid black">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <b class="font-11">Products</b><br />
                                <div id="ProductsGrid"></div>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <label>Product Content Details</label>
                                <div class="" id="GridProductContentDetails"></div>
                                <div class="hidden" id="GridProductContentDetailsFlex"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <label>Processes</label>
                                <div id="GridSelectedProductProcess"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                                    <div id="Optsplit"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 ">
                                    <label>Vendor</label>
                                    <div id="SBVendor"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 hidden ">
                                    <label>Process</label>
                                    <div id="SBProcess"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 hidden">
                                    <br />
                                    <input id="allprocess" type="checkbox" class="form-control" style="width: 100%" onchange="AllProcessSelected()" />
                                    <label for="allprocess">All Process</label>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                    <label>Total Qty</label>
                                    <input type="text" class="forTextBox disabledbutton" id="TxtTotalQTY" disabled="disabled" readonly="" />
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                    <label>Remaining Qty</label>
                                    <input type="text" class="forTextBox disabledbutton" id="TxtRemainingQTY" disabled="disabled" readonly="" />
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 ">
                                    <label>Schedule Qty</label>
                                    <input type="text" class="forTextBox" onchange="ValidateMaxQty()" id="TxtScheduleQTY" />
                                    <label id="errorQty" style="color: red"></label>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                    <label>Vendor Unit Rate</label>
                                    <input type="text" class="forTextBox" id="TxtRate" oninput="checkVendorRateChange(this.value, 'Rate');" />
                                    <label id="errorRate" style="color: red"></label>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 ">
                                    <label>Job Coordinator</label>
                                    <div id="JobCoordinator"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 ">
                                    <label>Special Remark</label>
                                    <textarea rows="3" class="forTextBox" id="TxtCriticalRemark"></textarea>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 hidden" id="ReasonForChangediv">
                                    <label>Reson for change *</label>
                                    <div id="ReasonForChange"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 hidden" id="ReasonForOtherdiv">
                                    <label>Other reson *</label>
                                    <textarea class="forTextBox" id="ReasonForOther"></textarea>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                    <input type="checkbox" id="ISSuppliedBySBT" name="ISSuppliedBySBT" onclick="toggleButton()">
                                    <label for="ISSuppliedBySBT">Material Supplied by SBT</label>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                    <a id="AddMaterial" class="btn btn-success" style="display: none">Add Material</a>
                                </div>
                            </div>
                        </div>

                        <div style="float: left; padding: 0 0 0 15px">
                            <input type="button" value="Add" class="btn btn-secondary" id="BtnAdd" />
                        </div>
                    </div>
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                            <div id="ScheduleGrid"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                            <label>Material Grid :</label>
                            <div id="AllocatedMaterial"></div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                    <b class="font-11">Product Group</b><br />
                    <div id="SbProductHSNGroup"></div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                    <div class="font-11">Quote No</div>
                    <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtQuoteNo" readonly="" />
                </div>

                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                    <div class="font-11">Delivery Date</div>
                    <div id="SelDeliveryDate"></div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                    <div class="font-11">Product Code</div>
                    <input type="text" class="forTextBox" id="TxtProductCode" />
                </div>

                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                    <div class="font-11">Job Coordinator</div>
                    <div id="SbJobCoordinator"></div>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 hidden">
                <div class="font-11">Job Name </div>
                <input type="text" class="forTextBox disabledbutton" id="TxtJobName" />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                <div class="font-11">Job Priority</div>
                <div id="SbJobPriority"></div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                <div class="font-11">Category</div>
                <div id="SbCategory"></div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                <div class="font-11">Customer</div>
                <div id="SbClientName"></div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                <div class="font-11">Consignee Name</div>
                <%--<input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtConsigneeName" readonly="" />--%>
                <div id="SbConsigneeName"></div>
            </div>

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden ">
                <div class="font-11">Location</div>
                <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtLocation" readonly="" />
            </div>

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                <div class="font-11">Email</div>
                <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtEmail" readonly="" />
            </div>

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                <div class="font-11">Order Quantity</div>
                <input type="text" class="forTextBox disabledbutton" id="TxtOrderQuantity" disabled="disabled" readonly="" />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                <div class="font-11">Job Type</div>
                <div id="SbJobType"></div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                <div class="font-11">Job Reference</div>
                <div id="SbJobReference"></div>
            </div>
            <input type="button" style="float: right" id="BtnSavejc" value="Save JobCard" class="btn btn-success waves-effect" />

            <input type="button" value="Save" style="float: left; margin-top: 3px" class="btn btn-success hidden" id="BtnSave" data-toggle="modal" />
            <input type="button" value="Next>>" style="float: right; margin-top: 3px" class="btn btn-warning hidden" id="BtnNext" data-toggle="modal" />
        </div>
    </div>

    <div class="modal clearfix" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>JobCard Schedule</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseModal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnApply" value="Apply" class="btn btn-success waves-effect" />
                </div>
            </div>
        </div>
    </div>


    <div class="modal clearfix" id="ModalShowList" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>JobCard Schedule</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseModalx" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden">
                        <div id="RadioPMPendingProc"></div>
                    </div>

                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label style = "padding:5px;background-color:orange;border-radius:5px;margin:2px">Rate changed</label>
                        <label style = "padding:5px;background-color:yellow;border-radius:5px;margin:2px">Vendor changed</label>
                        <label style = "padding:5px;background-color:red;border-radius:5px;margin:2px">Vendor and rate changed</label>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label>JobCard:</label>
                        <div id="GridJocardData"></div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" value="Edit" class="btn btn-warning hidden " id="BtnEdit" data-toggle="modal" />
                    <input type="button" value="Cancel" class="btn btn-danger" id="BtnDelete" data-toggle="modal" />
                    <input type="button" value="Print" class="btn btn-info" id="BtnPrintJobcard" data-toggle="modal" />
                    <input type="button" value="Generate PO" class="btn btn" id="BtnPO" data-toggle="modal" />
                </div>
            </div>
        </div>
    </div>

    <div class="modal clearfix" id="ModalSOList" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Sales Orders</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseModaly" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div id="RadioSalesorder"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div id="SOGRID"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnNextSO" value="Next >>" class="btn btn-success waves-effect" />
                </div>
            </div>
        </div>
    </div>

    <div class="modal clearfix" id="ModalMaterial" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Material Requirements</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseModalM" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div id="OverFlowGrid"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px">
                                    <%--   <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                        <div id="transactionType"></div>
                                    </div>--%>

                                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="float: right;">
                                        <label>
                                            Issue Qty
                                            <label style="color: red">*</label></label>
                                        <div style="display: flex; flex-direction: row">
                                            <input class="forTextBox" id="IssueQty" value="0" type="number" />
                                            <input type="button" class="btn btn-success" id="additem" value="Add +" />
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12" style="float: right;">
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: right">
                                            <label>Can be schedule qty</label>
                                            <input class="forTextBox " id="remainingtoschedule" value="0" type="number" readonly="readonly" />
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="float: right">
                                            <label>Requisition qty</label>
                                            <input class="forTextBox " id="RequisitionQty" value="0" type="number" readonly="readonly" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div id="AllocatedMaterialTemp"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnApplyMaterial" value="Apply" class="btn btn-success waves-effect" />
                </div>
            </div>
        </div>
    </div>

    <div class="modal clearfix" id="PrintModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Schedule Contents</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseModalPrintModal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                <div id="PrintModalGRID"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnPrintModal" value="Print Job Card" class="btn btn-success waves-effect" />
                </div>
            </div>
        </div>
    </div>

    <%--new--%>

    <div class="modal clearfix" id="GeneratePO" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>PO Generation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="CloseMrodalx" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="border-top: 1px solid black">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b>PO Number<b class="text-danger">*</b></b>
                                    <input id="PONumber" class="form-control form-control-sm" placeholder="PONumber" disabled="disabled" readonly="readonly" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b>PO Date</b>
                                    <div id="PODate" class="form-control form-control-sm"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b class="font-11">Consignee</b><br />
                                    <div id="DeliveryAT"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b class="font-11">Delivery At </b><b class="text-danger">*</b><br />
                                    <textarea id="Address" rows="1" class="forTextBox"></textarea>
                                </div>
                                <div class="col-2 col-md-2 col-lg-2 col-xl-6 hidden">
                                    <b class="font-11">Delivary Remark</b>
                                    <textarea id="DelRemark" rows="1" class="forTextBox"></textarea>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b class="font-11">Vendor Name</b><br />
                                    <div id="VendorName"></div>
                                    <label id="VendorNamelbl" class="text-danger dx-hidden">Please Fill Vendor Name</label>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <b class="font-11">Job Booking No</b><br />
                                    <input class="forTextBox disabledbutton" type="text" id="POJobBookingNo" disabled="disabled" readonly="" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                                    <b class="font-11">Quantity</b><br />
                                    <input type="text" class="forTextBox" id="POtQuantity" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                                    <b class="font-11">Date</b><br />
                                    <div id="PODatePM"></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <%--Quotation Details--%>
                                    <div class="font-11">Sales Order No</div>
                                    <input type="text" class="forTextBox disabledbutton" id="POOrderBookingNo" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <div class="font-11">Sales Order Date</div>
                                    <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="POOrderBookingDate" readonly="" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <div class="font-11">Quotaion No</div>
                                    <input type="text" class="forTextBox disabledbutton" id="QuotaionNo" />
                                </div>

                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <div class="font-11">Enquiry No</div>
                                    <input type="text" class="forTextBox disabledbutton" id="EnquiryNo" />
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <b class="font-11">Products</b><br />
                                    <div id="POProductsGrid"></div>
                                </div>

                                <%--   grid ke bad--%>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-1" style="border-top: 1px solid black">
                                    <div class="row" style="display: flex">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5" style="padding-top: 5px">
                                            <table>
                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5 "><b>Vendor Name : </b></td>
                                                    <td id="TDVendorName"></td>

                                                </tr>

                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>Job Booking No :</b></td>
                                                    <td id="TDPOJobBookingNo"></td>
                                                </tr>

                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>Sales Order No :</b></td>
                                                    <td id="TDPOOrderBookingNo"></td>
                                                </tr>

                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>Sales Order Date :</b></td>
                                                    <td id="TDPOOrderBookingDate"></td>
                                                </tr>

                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5 "><b>Quotaion No :</b></td>
                                                    <td id="TDQuoteNo"></td>
                                                </tr>

                                                <tr style="height: 40px;">
                                                    <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 "><b>Enquiry No :</b></td>
                                                    <td id="TDEnqNo"></td>
                                                </tr>

                                            </table>

                                        </div>
                                        <div class="col-12 col-md-12 col-lg-6 col-xl-6" style="border-left: 1px solid gray;">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5" style="padding-top: 5px">
                                                <table>
                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5 "><b>Net Amount: </b></td>
                                                        <td id="NetAmount"></td>
                                                    </tr>

                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>IGST Amount :</b></td>
                                                        <td id="IGSTAmount"></td>
                                                    </tr>

                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>SGST Amount :</b></td>
                                                        <td id="SGSTAmount">></td>
                                                    </tr>

                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5"><b>CGST Amount :</b></td>
                                                        <td id="CGSTAmount"></td>
                                                    </tr>

                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5 "><b>Total GSTAmount :</b></td>
                                                        <td id="ToTalGSTAmount"></td>
                                                    </tr>

                                                    <tr style="height: 40px;">
                                                        <td class="col-lg-6 col-md-6 col-sm-6 col-xs-6 "><b>Total Amount :</b></td>
                                                        <td id="TotalAmount"></td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                                    <b>Vendor Freight</b>
                                    <input class="form-control form-control-sm" id="Freight" value="0" />
                                </div>
                                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                                    <b>Remark</b>
                                    <textarea id="Remark" placeholder="Remark" rows="1" class="form-control form-control-sm">Remark</textarea>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="SavePO" class="btn btn-primary">Save</a>
                    <a id="ClosePO" class="btn btn-danger" data-dismiss="modal">Close</a>
                </div>
            </div>
        </div>
    </div>


    <div id="LoadIndicator"></div>

    <script src="CustomJS/LocalStorage.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script type="text/javascript" src="CustomJS/JobCardSchedule.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <%--<script type="text/javascript" src="CustomJS/LayoutDraw.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>--%>
    <script src="CustomJS/RePlanProducts.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <%--<script src="CustomJS/PlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>--%>
</asp:Content>

