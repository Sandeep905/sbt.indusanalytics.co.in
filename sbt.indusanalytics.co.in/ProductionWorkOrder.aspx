<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductionWorkOrder.aspx.vb" Inherits="ProductionWorkOrder" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <link href="CustomCSS/Dynamic.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-l-0 p-r-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff;">
                    <div id="ButtonDiv" style="height: auto; display: block">
                        <input type="button" name="BtnJobDetails" value="Job Details >>" id="BtnJobDetails" class="btn btn-primary" />
                        <input type="button" id="BtnPrintJobcard" value="Print" class="btn btn-print hidden" />
                        <input type="button" id="BtnDeleteJobcard" value="Delete" class="btn btn-danger hidden" />
                        <a class="MasterDisplayName" style="float: right; color: #42909A">Production Work Order</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-l-10">
            <div id="RadioPMPendingProc"></div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-l-10">
            <div id="GridPendingProcessData"></div>
        </div>
    </div>

    <!--For JC Contents Details -->
    <div class="modal fade" id="modalJobContentsDetails" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Job Details</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right; cursor: pointer;">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i><span id="commentbadge" class="badge" hidden="hidden">0</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                <b class="font-11">Job Booking No</b><br />
                                <input class="forTextBox disabledbutton" type="text" id="TxtBookingNoAuto" disabled="disabled" readonly="" />
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                <b class="font-11">Quantity</b><br />
                                <input type="text" class="forTextBox" id="TxtQuantity" disabled="disabled" readonly="" />
                            </div>
                            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                <b class="font-11">Date</b><br />
                                <div id="DatePM"></div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                <b class="font-11">Product Group</b><br />
                                <div id="SbProductHSNGroup"></div>
                            </div>
                            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6">
                                <div class="font-11">Quote No</div>
                                <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtQuoteNo" readonly="" />
                            </div>
                        </div>
                        <%--Common Job Details--%>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <%--Quotation Details--%>
                            <div class="font-11">Order No</div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtOrderBookingNo" readonly="" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Order Date</div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtOrderBookingDate" readonly="" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">PO No</div>
                            <input type="text" class="forTextBox" id="TxtPONo" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">PO Date</div>
                            <%--<input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtPODate" />--%>
                            <div id="SelPODate"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Delivery Date</div>
                            <%--<input type="text" class="forTextBox disabledbutton" id="TxtDeliveryDate" />--%>
                            <div id="SelDeliveryDate"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <div class="font-11">Product Code</div>
                            <input type="text" class="forTextBox" id="TxtProductCode" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden" hidden>
                            <div class="font-11">Job Coordinator</div>
                            <div id="SbJobCoordinator"></div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <div class="font-11">Job Name </div>
                            <input type="text" class="forTextBox" id="TxtJobName" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Job Priority</div>
                            <div id="SbJobPriority"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                            <div class="font-11">Category</div>
                            <div id="SbCategory"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <div class="font-11">Customer</div>
                            <div id="SbClientName"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden" hidden>
                            <div class="font-11">Consignee Name</div>
                            <%--<input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtConsigneeName" readonly="" />--%>
                            <div id="SbConsigneeName"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden" hidden>
                            <div class="font-11">Location</div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtLocation" readonly="" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <div class="font-11">Email</div>
                            <input type="text" class="forTextBox disabledbutton" disabled="disabled" id="TxtEmail" readonly="" />
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden">
                            <div class="font-11">Order Quantity</div>
                            <input type="text" class="forTextBox disabledbutton" id="TxtOrderQuantity" disabled="disabled" readonly="" />
                        </div>
                        <%--<div style="float: left; margin-left: 1em; width: 21.5em; text-align: center; margin-top: 0.5em; background-color: #509EBC; color: white">Other Details </div>--%>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 hidden" hidden>
                            <div class="font-11">Job Type</div>
                            <div id="SbJobType"></div>
                        </div>

                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden" hidden>
                            <div class="font-11">Job Reference</div>
                            <div id="SbJobReference"></div>
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-16 align-right">
                            <div class="font-11">Grid Content Options</div>
                            <i data-toggle="modal" data-target="#largeModalContentsList" class="fa fa-plus btn btn-sm hidden" hidden></i>
                            <i id="ContSelMoveUp" class="fa fa-arrow-up btn btn-sm"></i>
                            <i id="ContSelMoveDown" class="fa fa-arrow-down btn btn-sm"></i>
                        </div>
                        <%--End Common details--%>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridProductContentDetails"></div>
                            <input type="hidden" class="hidden" name="GrantAmount" value="" id="TxtOldGrantAmount" />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="padding-right: 2px;">
                            <div id="GridSelectedProductProcess" style="border: solid 1px"></div>
                            <textarea id="TextareaOperId" style="display: none"></textarea>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div class="font-11">Special Instructions</div>
                            <textarea id="TxtProductRemark" class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="color: #ffffff; background-color: red;"></textarea>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <input type="button" id="BtnApplySpecialInstructions" value="Apply Instructions" class="btn btn-info" />
                            <input type="button" id="BtnProcessMaterialReq" value="Material Requirement" class="btn btn-primary waves-effect hidden" hidden />
                            <input type="button" id="BtnShadeSelection" value="Shade Selection" class="btn btn-primary waves-effect" />
                            <input type="button" id="BtnShipper" value="Shipper" class="btn btn-primary waves-effect hidden" hidden />
                            <input type="button" id="BtnFormWise" value="JC Formwise" class="btn btn-primary waves-effect" />
                            <input type="button" id="BtnItemsBooking" value="Item Allocation" class="btn btn-primary waves-effect" />
                            <input type="button" data-target="#modalPackingDetails" data-toggle="modal" id="BtnPackingDetails" value="Packing Details" class="btn btn-primary waves-effect hidden" hidden />
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div class="font-11">User Picture</div>
                            <input type="file" capture="camera" name="photo" accept=".png, .jpg, .jpeg, .gif" id="file" style="width: 54%; float: left; height: 2.5em" />
                            <input type="button" name="BtnRemoveFile" id="BtnRemoveFile" value="Remove File" class="btn btn-warning" />
                            <img src="" id="PreviewAttachedFile" style="display: none; width: auto; height: 200px" />
                        </div>

                    </div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnSaveJobcard" value="Save" class="btn btn-success waves-effect" />
                </div>
            </div>
        </div>
    </div>

    <%--Modal Send Indent--%>
    <div class="modal fade" id="modalSendRequisition" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Indent Creation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                            <strong class="col-lg-6 col-md-6 col-sm-6 col-xs-6">Voucher No # <b id="ShowVoucherNo"></b></strong>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="DateVoucherSR"></div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridSendRequisition"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnPrintSendReq" value="Print" class="btn btn-primary" style="display: none" />
                    <input type="button" id="BtnSaveIndentReq" value="Create Indent" class="btn btn-success" />
                    <input type="button" id="BtnDeleteSendReq" value="Delete" class="btn btn-danger" style="display: none" />
                </div>
            </div>
        </div>
    </div>

    <%--Modal Add Paper--%>
    <div class="modal fade" id="modalAddPaperSR" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Add Paper</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridPaperSelection"></div>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="border: none">
                            <strong>Quantity</strong>
                            <input type="text" class="forTextBox" id="TxtAddPprQty" style="float: left; height: 2.5em; margin-left: 0.5em; width: 8em" />
                            <strong>Order Type</strong>
                            <div id="SelectBoxOrdType" style="float: left; width: 8em; margin-left: 0.5em"></div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="border: none">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="border: none">
                                <input type="button" id="BtnAdd" value="Add" class="myButton" />
                                <input type="button" id="BtnRemove" value="Remove" class="myButton" />
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="border: none">
                                <input type="button" id="BtnApplyPpr" value="Apply" class="myButton" style="float: right; margin-right: 2em" /><br />
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridSelectedPapers" style="height: 15em; overflow-y: scroll"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                </div>
            </div>
        </div>
    </div>

    <%--Modal Item Booking--%>
    <div class="modal fade" id="modalItemAllocation" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Item Stock Allocation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix active">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <b class="font-11">Required Item:-</b>
                            <div id="GridRequiredItemList"></div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridItemsList"></div>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <b class="font-11">Allocated Items:-</b>
                            <div id="GridAllocatedItemList"></div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <b class="font-11">Department</b>
                            <div id="SelDepartment"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnApplyItemAllocation" value="Apply" class="btn btn-success" />
                </div>
            </div>
        </div>
    </div>

    <%--Modal Packing Details--%>
    <div class="modal fade clearfix tab-pane animated fadeInUp" id="modalPackingDetails" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Packing Details</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="rowcontents clearfix">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="font-11">Packing Instructions</div>
                            <textarea id="TxtCriticalRemark" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--For Shipper -->
    <div class="modal fade" id="modalShipper" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Shipper</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div id="GridShipper"></div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                </div>
            </div>
        </div>
    </div>

    <!--For JC FormWise -->
    <div class="modal fade" id="modalJCFormWise" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Job FormWise Details</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div id="GridJCFormWise" style="display: none;"></div>
                        <div id="GridJCFormWiseDetail"></div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input id="btnClearForms" type="button" name="btnClear" value="Clear" class="btn btn-danger" />
                    <input id="btnApplyForms" type="button" name="btnApply" value="Apply" class="btn btn-success" />
                </div>
            </div>
        </div>
    </div>

    <!--For Ink Shade selection And Material Requirements -->
    <div class="modal fade" id="modalShadeSelection" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="LblTitleShadeMaterial">Material Requirements</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div id="InkShadeSelection" role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: block;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div id="GridInkName"></div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div id="GridSelectedInkColor"></div>
                        </div>
                    </div>

                    <div id="ProcessMaterialRequirement" role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="display: none;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div id="GridMaterialProcess" style="border: solid 1px"></div>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div id="GridProcessMaterialList" style="border: solid 1px"></div>
                        </div>

                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                            <b class="font-11">Machine Name</b>
                            <div id="SelProcessMachine"></div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <b class="font-11">Required Quantity</b>
                            <input type="text" class="forTextBox" name="Quantity" value="" id="TxtRequiredMaterialQty" />
                            <input type="hidden" class="hidden" name="ItemID" value="" id="TxtMaterialID" />
                            <input type="hidden" class="hidden" name="ItemID" value="" id="TxtItemGroupID" />
                            <input type="hidden" class="hidden" name="ItemID" value="" id="TxtItemGroupNameID" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <b class="font-11">Stock Unit</b>
                            <input type="text" class="forTextBox" name="Quantity" value="" id="TxtMaterialStockUnit" readonly="readonly" />
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <b class="font-11">Remarks</b>
                            <textarea class="forTextBox col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0; margin: 0;" name="Quantity" id="TxtRequiredMaterialRemark"></textarea>
                        </div>
                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12">
                            <b class="col-sm-1"></b>
                            <input type="button" class="btn btn-primary" name="Quantity" value="Add Material" id="BtnAddMaterial" />
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridProcessMaterialRequired"></div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <input type="button" id="BtnApplyRequirement" value="Apply" class="btn btn-success" />
                </div>
            </div>
        </div>
    </div>

    <!-----------------  RePlan Content Start  --------------->
    <div class="modal fade" id="modalContentReplan" tabindex="-1" role="dialog" style="">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>RePlan Content</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <%--<div class="DialogBoxCustom" style="float: left; background-color: #fff">
                                <a id="AddContentButton" class="myButton" style="cursor: pointer; margin-right: 5px">Add Content</a>
                            </div>--%>
                            <div class="ContainerBoxCustom" style="float: left; height: calc(100vh - 83px); overflow-y: auto">
                                <p id="lastRow" style="display: none;">1</p>
                                <p id="lastCol" style="display: none;">0</p>

                                <div class="inner">
                                    <table id='PlanTable' class='table table-bordered' style="margin-top: .5em; margin-bottom: 0px;">
                                        <thead style="height: 0em">
                                            <tr style='background-color: white; color: red; text-align: center; height: 0em'>
                                            </tr>
                                        </thead>
                                        <tbody id="BodyPlanning">
                                            <tr id="BdyQtyRow"></tr>
                                        </tbody>
                                        <tfoot id="FooterCost" style="background-color: #fff; display: none;">
                                            <%--Final Cost Window--%>
                                            <tr id="FinalCostDivFooter"></tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div style="float: left; width: 100%; height: auto">
                                <%--Quantity wITH Content Table Container--%>
                            </div>
                        </div>

                        <div id="BottomTabBar" class="MYBottomsidenav" style="margin: 0 !important; padding: 0 !important; left: 0px;">
                            <div class="DialogBoxCustom" style="float: left">
                                <strong>Plan Window</strong>&nbsp;
                                <strong style="border: 1px dashed;" id="PlanContQty">0</strong>
                                <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="BottomTabBar" onclick="closeBottomTabBar()">
                                    <span data-dismiss="BottomTabBar" onclick="closeBottomTabBar()" style="font-weight: 900; margin-right: 8px">X</span>
                                </a>
                                <a class="myButton" style="float: right; display: block; cursor: pointer; margin-right: 5px" onclick="fnplnhideshow()">
                                    <span id="PlanButtonHide" style="margin-right: 9px;">Modify</span>
                                </a>
                            </div>

                            <div class="rowcontents clearfix" style="border-bottom: 1px solid #42909A; height: auto; padding-bottom: 0em; height: calc(100vh - 83px); overflow-y: auto;">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-right: 0px;">
                                    <div style="width: auto; float: left; display: none;">
                                        <strong id="displayStatusBottom"></strong>
                                    </div>

                                    <div id="PlanSizeContainer" class="Input_Parameter">
                                        <%--Plan Input parameter details--%>
                                        <div style='float: left; width: 100%; height: auto; margin-bottom: 0em;'>
                                            <div class="inner" style="margin-right: 0px;">
                                                <div id="BodywindowPlanning" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px; padding: 0px; margin-top: 1px; height: auto;">
                                                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3" style="padding: 0px; margin: 0px; height: auto;">
                                                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                                                            <div class='content_div' style='height: auto; text-align: center'>
                                                                <img id="PlanContImg" style='height: 8em; width: 8em; left: 0' />
                                                                <b id="PlanContName" style='display: block; border: 1px dashed; background-color: azure'></b>
                                                                <b id="ContentOrientation" style='display: none'></b>
                                                            </div>
                                                        </div>
                                                        <div id="planJob_Size" class="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                                                            <b class="font-11" style="width: auto;">Job Size</b><br />
                                                            <div style="width: auto;">
                                                                <input type='text' id='JobFoldedH' oninput="onInputChangeFolds(this);" name="FH" placeholder='Folded H' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input type='text' id='JobFoldedL' oninput="onInputChangeFolds(this);" name="FL" placeholder='Folded L' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                            </div>
                                                            <div style="width: auto;">
                                                                <input type='text' id='JobFoldInH' oninput="onInputChangeFolds(this);" name="FInH" value="1" placeholder='Fold In H' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                                                <input type='text' id='JobFoldInL' oninput="onInputChangeFolds(this);" name="FInL" value="1" placeholder='Fold In L' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                                            </div>
                                                            <div style="width: auto;">
                                                                <input required="required" type='text' id='SizeHeight' placeholder='Height' name="H" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input required="required" type='text' id='SizeLength' placeholder='Length' name="L" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                            </div>
                                                            <div style="width: auto;">
                                                                <input type='text' id='SizeWidth' placeholder='Width' class='forTextBox' name="W" style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input type='text' id='SizeOpenflap' placeholder='O.flap' class='forTextBox' name="OF" style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                            </div>
                                                            <div style="width: auto;">
                                                                <input type='text' id='SizeBottomflap' placeholder='B.flap' name="BF" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input type='text' id='SizePastingflap' placeholder='P.flap' name="PF" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                            </div>
                                                            <div style="width: auto;" <%--class="hidden"--%>>
                                                                <input type='text' id='JobNoOfPages' placeholder='No Of Pages' name="Pages" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                                                <input type='text' id='JobUps' placeholder='Job Ups' name="Ups" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                                                <input type='text' id='JobFlapHeight' placeholder='Flap Height' name="FlapH" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input type='text' id='JobTongHeight' placeholder='Tongue Height' name="TH" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                                <input type='text' id='JobBottomPerc' placeholder='Bottom Perc' name="BPer" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                                            </div>
                                                            <div style="width: auto;">
                                                                <textarea id='JobPrePlan' placeholder='Job Size' class='forTextBox' rows="3" cols="3" style="float: left; width: 100%; margin: .2em; display: none;"></textarea>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3" style="padding: 0px; margin: 0px;">
                                                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                            <b class="font-11">Raw Material Selection</b><br />
                                                            <div id="ItemPlanQuality" style="float: left; width: 99.3%; margin: .2%"></div>
                                                            <div style="width: auto;">
                                                                <div id="ItemPlanGsm" style="float: left; width: 45.2%; margin: .1%"></div>
                                                                <div id="ItemPlanMill" style="float: left; width: 54%; margin: .1%"></div>
                                                            </div>
                                                            <div id="ItemPlanFinish" style="float: left; width: 99.3%; margin: .2%"></div>
                                                            <br />
                                                            <b class="font-11">Paper Trimming</b>
                                                            <div id="PaperTrim" style="width: auto;">
                                                                <input type='text' title="Paper Trimming Top" id='PaperTrimtop' placeholder='T' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                                <input type='text' title="Paper Trimming Bottom" id='PaperTrimbottom' placeholder='B' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                                <input type='text' title="Paper Trimming Left" id='PaperTrimleft' placeholder='L' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                                <input type='text' title="Paper Trimming Right" id='PaperTrimright' placeholder='R' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" style="padding: 0px; margin: 0px; height: auto;">
                                                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                            <b class="font-11">Printing Details</b><br />
                                                            <input title="Front color" type='text' id='PlanFColor' placeholder='Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                                            <input title="Back color" type='text' id='PlanBColor' placeholder='Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                                            <input title="Special front color" type='text' id='PlanSpeFColor' placeholder='Spe.Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                                            <input title="Special back color" type='text' id='PlanSpeBColor' placeholder='Spe.Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                                            <b class="font-11">Printing Style</b><br />
                                                            <div id="PlanPrintingStyle" style="float: left; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                                            <div id="PlanPlateType" style="float: left; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                                        </div>
                                                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">

                                                            <b class="font-11">Machine Wastage</b><br />
                                                            <div style="width: auto;">
                                                                <div title="Wastage Type" id="PlanWastageType" style="float: left; width: 100%; margin: .1%"></div>
                                                                <input title="Enter wastage quantity" type='text' id='PlanWastageValue' placeholder='Enter Qty' class='forTextBox' style="float: left; width: 100%; margin: .1%; display: none" />
                                                            </div>
                                                            <b class="font-11">Grain Direction</b>
                                                            <div title="Grain Direction" id="PlanPrintingGrain" style="float: left; width: 100%; margin: .1%"></div>
                                                            <br />
                                                            <b class="font-11">Online Coating</b>
                                                            <div title="Grain Direction" id="PlanOnlineCoating" style="float: left; width: 100%; margin: .1%"></div>
                                                        </div>
                                                    </div>

                                                    <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2" style="margin: 0px; height: auto;">
                                                        <b class="font-11">Trimming</b><br />
                                                        <div style="width: auto;">
                                                            <input type='text' title="Job Trim Top" id='Trimmingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Job Trim Bottom" id='Trimmingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Job Trim Left" id='Trimmingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Job Trim Right" id='Trimmingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                        </div>
                                                        <br />
                                                        <br />
                                                        <b class="font-11">Striping</b><br />
                                                        <div style="width: auto;">
                                                            <input type='text' title="Striping Top" id='Stripingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Striping Bottom" id='Stripingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Striping Left" id='Stripingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                            <input type='text' title="Striping Right" id='Stripingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                        </div>
                                                        <br />
                                                        <div style="width: auto;">
                                                            <b class="font-11" style="float: left; width: 45%; margin: .2em">Color Strip</b>
                                                            <b class="font-11" style="float: left; width: 45%; margin: .2em">Gripper</b>
                                                        </div>
                                                        <br />
                                                        <div style="width: auto;">
                                                            <input required="required" title="Color Strip" type='text' id='PlanColorStrip' placeholder='Color Strip' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="3" onchange="myvalidation(this)" />

                                                            <input required="required" title="Gripper" type='text' id='PlanGripper' placeholder='Gripper' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="6" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                                                    <div id="ChkPlanInAvailableStock"></div>
                                                    <div id="ChkPlanInStandardSizePaper"></div>
                                                    <div id="ChkPlanInSpecialSizePaper"></div>
                                                    <div id="ChkPaperByClient"></div>
                                                    <div id="ChkUseFirstPlanAsMaster" style="display: none;"></div>
                                                </div>

                                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                                        <b style="float: left; width: auto; margin: .7em" class="font-11">Machine</b>
                                                    </div>
                                                    <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10">
                                                        <div id="MachineIDFiltered"></div>
                                                        <textarea id="MachineId" style="display: none"></textarea>
                                                    </div>
                                                </div>

                                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" style="padding: 0px; margin: 0px; padding-right: 0px; padding-left: 2px">
                                                    <div id="GridOperation"></div>
                                                    <textarea id="OperId" style="display: none"></textarea>
                                                </div>

                                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" style="padding: 0px; margin: 0px; padding-right: 2px; padding-left: 2px">
                                                    <div id="GridOperationAllocated"></div>
                                                </div>

                                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-t-5" style="float: right;">
                                                    <div class="DialogBoxCustom">
                                                        <a id="PlanButton" class="myButton" style="float: right; width: auto; cursor: pointer; margin-top: 5px;">Show Cost</a>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <%-- End Input --%>
                                    </div>

                                    <div id="PlanContainer" style="float: left; height: auto; width: 100%; display: none">

                                        <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10">
                                            <div style="height: auto; margin: 0px 2px 0px 2px;">
                                                <div class="col-sm-2 margin-0" id="FilterMachineFolds"></div>
                                                <b class="col-sm-4 margin-0 font-12" style="border: 1px dashed;" id="LblPlanContName"></b>
                                                <b class="col-sm-2 margin-0 font-12" style="background-color: rgba(228, 255, 0, 0.6509803921568628);">Reel To Sheet Planning</b>
                                                <b class="col-sm-2 margin-0 font-12" style="background-color: #ffc5d8;">Reel Planning</b>
                                                <b class="col-sm-2 margin-0 font-12" style="background-color: greenyellow;">Plan In Special Paper</b>
                                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-0" id="ContentPlansList"></div>
                                            </div>
                                        </div>

                                        <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                            <div class='content_div' style='height: auto; width: auto; text-align: center;'>
                                                <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                                    <div id="Layout_Sheet" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em"></div>
                                                </div>
                                                <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                                    <div id="Layout_Ups" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em;"></div>
                                                </div>
                                            </div>
                                            <div style="display: none">
                                                <svg id="svg_Sheet_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                                                </svg>
                                                <svg id="svg_Shape_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                                                </svg>
                                            </div>
                                        </div>

                                        <div id="tabDetailsMain" class="col-xs-12 col-sm-4 col-md-3 col-lg-3" style="padding: 0px; margin: 0px; height: auto;">
                                            <div id="TabHeadsDetails">
                                                <div style="height: auto; margin: 0px 2px 0px 2px;">
                                                    <div id="GridHeadsDetails"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                                            <div id="TabOperations">
                                                <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 padding-0 margin-0">
                                                    <div id="GridOperationDetails"></div>
                                                </div>

                                                <%--<div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                                    <i id="OperMoveUp" class="fa fa-2x fa-arrow-up btn btn-sm"></i>
                                                    <i id="OperMoveDown" class="fa fa-2x fa-arrow-down btn btn-sm"></i>
                                                </div>--%>
                                            </div>
                                            <div class='col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0 margin-0'>
                                                <div id="PlanChartLayout" data-target="#myModalChart" data-toggle="modal" style="height: 10em; margin-top: 0px; margin-left: 0em"></div>
                                            </div>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-9 col-lg-8" style="margin-bottom: 0px; float: right;">
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                                                <b class="font-11">Expected Qty</b>
                                                <input class="text-right forTextBox" disabled="disabled" type="text" name="Expected Quantity" title="Expected Quantity" id="TxtFinalQuantity" />
                                            </div>
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                                                <b class="font-11">Unit Cost</b>
                                                <input class="text-right forTextBox" disabled="disabled" type="text" name="finalUnitCost" title="Final Unit Cost" value="" id="finalUnitCost" />
                                            </div>
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                                                <b class="font-11">Final Cost</b>
                                                <input class="text-right forTextBox" disabled="disabled" type="text" name="finalCost" title="Final Cost" value="" id="finalCost" />
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-3 col-sm-4">
                                                <br />
                                                <div class="DialogBoxCustom">
                                                    <a id="btnApplyProductCost" name="nameApplyCost" class="myButton">Apply Cost </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <%--</div>--%>
                                </div>
                            </div>
                            <div id="PlanWindowDivZommer" class='PlancontentZoom' style="text-align: center; z-index: 9" onmouseover="PlanhideIN(this);" onmouseout="PlanhideOut(this);"></div>
                        </div>

                        <input type="text" id="PlanContentName" style="display: none;" />
                        <input type="text" id="PlanContentType" style="display: none;" />
                        <input type="text" id="TxtContentImgSrc" style="display: none" />

                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <%--<input type="button" data-dismiss="BottomTabBar" value="Close" class="btn btn-danger" />--%>
                </div>
            </div>
        </div>
    </div>

    <%--Modal Add Contents Window--%>
    <div class="modal fade" id="largeModalContentsList" title="Press enter key to add selected content" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Choose Content</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent" style="display: block; padding-top: 20px; padding-right: 0px">
                        <div class="rowcontents clearfix" style="border-bottom: 1px solid #42909A; height: auto;">
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="margin-bottom: 5px">
                                <h6 style="float: right"><b>Content Name </b></h6>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin-bottom: 5px">
                                <input class="forTextBox" style="float: left; width: 100%; border-radius: 4px" type="text" id="TxtAddContentName" />
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="margin-bottom: 5px">
                                <a id="BtnSelectContent" class="myButton" style="float: left; cursor: pointer; margin-right: 5px">Add </a>
                            </div>
                        </div>
                        <div role="tabpanel" class="row clearfix tab-pane animated fadeInRight active">
                            <div title="Double click to add content" id="AllContents"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em;">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Replan Contents Forms Details-->
    <div class="modal fade" id="myModalforms" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Book Forms</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position: relative;">
                    <div id="GridFormsDetails"></div>
                    <label>Slab Rates:- </label>
                    <br />
                    <div id="GridPrintingSlabsDetails"></div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Replan Contents Paper Details-->
    <div class="modal fade" id="myModalPapers" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px; width: auto;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: auto">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position: relative;">
                    <div style="display: block; padding-top: 10px; padding-right: 0px;">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <span id="PlanPaperString" class="cut-text"></span>
                            <div id="ContPaperDetails">
                                <div id="MainPaperDetails"></div>
                                <div id="DivPaperStock"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Replan Contents InPut parameter Operation calculation-->
    <div class="modal fade" id="ModalOperationEdit" tabindex="-1" role="dialog" style="padding: 20px; margin-top: 200px;">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Operation Calculation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position: relative;">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <label id="LblTtlPaperWtInKG" style="float: left; width: 100%;">Total Paper(KG)</label>
                            <div id="OperationEditP" role="tabpanel" class="row clearfix tab-pane animated fadeInRight active" style="padding-top: 10px; max-height: calc(100vh - 105px); overflow-y: auto">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnCalculateOperation" class="btn btn-link waves-effect">Apply</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Layout ZoomModal -->
    <div class="modal fade" id="myModalZoom" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document" style="">
            <%--width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px--%>
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 110px); overflow-y: auto; padding: 20px">
                            <div id="caption"></div>
                            <img src="images/Indus logo.png" id="Zoomedimg01" class="bg-svg">
                            <input type="button" id="PZoomBtn" style="display: none" />
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Tools Modal -->
    <div class="modal fade" id="myModalTool" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <b>Process Name</b>
                        <input type="text" name="TxtProcess" id="TxtToolProcessName" value="" class="forTextBox" readonly="readonly" disabled="disabled" />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div id="gridToolList"></div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div id="gridAddedTool"></div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-info waves-effect" id="BtnApplyTools">Apply</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div id="image-indicator"></div>
    <script src="CustomJS/LocalStorage.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script type="text/javascript" src="CustomJS/ProductionWorkOrder.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script type="text/javascript" src="CustomJS/LayoutDraw.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/RePlanProducts.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/PlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>

    <script type="text/javascript">

        $("#DatePM").dxDateBox({
            type: "datetime",
            disabled: true,
            value: new Date(),
            displayFormat: "dd-MMM-yyyy hh:mm a"
        });
        $("#DateVoucherSR").dxDateBox({
            type: "date",
            value: new Date()
        });

        $("#SbJobCoordinator").dxSelectBox({
            placeholder: "Select Job Coordinator",
            displayExpr: 'CoordinatorLedgerName',
            valueExpr: 'CoordinatorLedgerID',
            searchEnabled: true,
        });
        $("#SbJobPriority").dxSelectBox({
            placeholder: "Select Job Priority",
            displayExpr: 'JobPriority',
            valueExpr: 'JobPriority',
            searchEnabled: false,
        });
        $("#SbCategory").dxSelectBox({
            placeholder: "Select Category",
            displayExpr: 'CategoryName',
            valueExpr: 'CategoryId',
            searchEnabled: true,
            //readOnly: true
        });
        $("#SbClientName").dxSelectBox({
            placeholder: "Select Customer",
            displayExpr: 'LedgerName',
            valueExpr: 'LedgerId',
            searchEnabled: true,
            readOnly: true
        });
        $("#SbJobType").dxSelectBox({
            placeholder: "Select Job Type",
            displayExpr: 'JobType',
            valueExpr: 'JobType',
            searchEnabled: false,
        });
        $("#SbJobReference").dxSelectBox({
            placeholder: "Select Job Reference",
            displayExpr: 'JobReference',
            valueExpr: 'JobReference',
            searchEnabled: false,
        });
        $("#SbConsigneeName").dxSelectBox({
            placeholder: "Select Consignee",
            displayExpr: 'ConsigneeName',
            valueExpr: 'ConsigneeID',
            searchEnabled: false,
        });
    </script>
</asp:Content>

