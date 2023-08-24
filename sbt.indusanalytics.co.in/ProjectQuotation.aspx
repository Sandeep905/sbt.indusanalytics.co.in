﻿<%@ Page Title="" Language="VB" MasterPageFile="~/IndusAnalytic.master" AutoEventWireup="false" CodeFile="ProjectQuotation.aspx.vb" Inherits="ProjectQuotation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
        <div id="image-indicator"></div>
        <div id="FieldCntainerRow" class="clearfix tab-pane animated fadeInRight active">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button id="BtnLoadFromEnquiry" type="button" class="btn btn-success">Load From Enquiry</button>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-1 col-lg-1">
                <b class="font-11" id="enqtext">Enquiry No.</b>
                <input type="text" id="TxtQuoteNo" class="forTextBox disabled" style="float: left; width: 100%;" readonly="" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <b class="font-11">Client Name<i style="color: red">*</i></b><i class="fa fa-plus btn btn-link font-12 padding-0 reloadclient btnnewmaster" style="color: green"></i>
                <div id="SelClient" tabindex="1"></div>
                <label id="SalesManager"></label>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                <b class="font-11">Client Cordinator<i style="color: red">*</i></b>
                <div id="ClientCordinator" tabindex="3"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                <b class="font-11">Sales Cordinator<i style="color: red">*</i></b>
                <div id="SalesCordinator" tabindex="3"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                <b class="font-11">Sales Executive<i style="color: red">*</i></b>
                <div id="SelSalesPerson" tabindex="3"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                <b class="font-11">Project Name<i style="color: red">*</i></b>
                <input type="text" tabindex="2" id="TxtProjectName" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-1">
                <b class="font-11">City</b>
                <input type="text" name="TxtClientCity" id="TxtClientCity" class="forTextBox" value="" readonly="readonly" disabled />
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <b class="font-11 hidden" onclick="AddRow()">Add Product <i onclick="AddRow()" class="fa fa-plus-circle" style="font-size: 20px; color: green"></i></b>
                <div id="gridProductList"></div>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                <b class="font-11">Freight Amount</b>
                <input id="TxtFreightAmount" placeholder="Enter Freight" type="number" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <b class="font-11">Remark</b>
                <textarea id="TxtRemark" placeholder="Enter your remark here" class="forTextBox"></textarea>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
                <b class="font-11">Valid Upto (Days)<i style="color: red">*</i></b>
                <input type="number" id="TxtValidUpto" min="0" class="forTextBox" />
            </div>

            <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
                <b class="font-11">Delivery Days<i style="color: red">*</i></b>
                <input type="number" id="TxtDeliveryUpto" min="0" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
                <b class="font-11">Payment Term (Days)<i style="color: red">*</i></b>
                <input type="number" id="TxtPaymentTerms" min="0" class="forTextBox" />
            </div>
            <div class="modal-footer col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div id="IsDirectApproveddiv" style="float: left; display: none">
                    <input type="checkbox" id="IsDirectApproved" />
                    <label for="IsDirectApproved" style="color: red">Is Direct Internal Approved </label>
                </div>
                <div id="IsDirectApproveddivp" style="float: left; display: none">
                    <input type="checkbox" id="IsDirectPriceApproved" />
                    <label for="IsDirectPriceApproved" style="color: red">Is Direct Price Approved</label>
                </div>
                <div>
                    <button id="BtnSave" type="button" class="btn btn-success">Save</button>
                    <input type="button" class="btn btn-primary" value="Show List" id="BtnShowList" onclick="setGridDisplay('none', 'block')" />
                    <input id="EstimateID" style="display: none" />
                    <input id="BookingID" style="display: none" />
                </div>
            </div>
        </div>
    </div>

    <div class="modal clearfix" id="modalEstimateProduct" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Product Estimation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-header">
                    <div class="col-xs-12 col-sm-9 col-md-10 col-lg-10">
                        <strong class="font-11">Product Name</strong>
                        <input type="text" id="TxtProductName" class="forTextBox disabled" readonly="" />
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                        <b class="font-11">Quantity</b>
                        <input type="text" id="TxtPlanQty" class="forTextBox disabled" readonly="" />
                    </div>
                </div>
                <div class="clearfix tab-pane" style="height: 80vh; overflow-y: auto; padding-bottom: 40px">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <b class="font-12">Product Configuraions</b>
                        <div id="gridProductConfig"></div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <b class="font-12">Operation List</b>
                        <a id="BtnSelectOperation" class="fa fa-plus btn btn-link" style="color: green" title="For Select Operation"></a>
                        <div id="gridOperation"></div>
                        <textarea id="OperId" class="hidden"></textarea>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5" style="float: left;">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5" style="float: left;">
                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 p-0">
                                <input onchange="IsMaualCostingflex()" type="checkbox" id="IsManualcostflex" name="vehiIsManualcostflexcle1" value="IsManualCosting">
                                <label style="color: red" for="IsManualcostflex">Want Mannual Costing</label>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 p-0">
                                <label>Vendor</label>
                                <div id="Selvendorflex"></div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 p-0">
                                <label>Rate Per Sq. feet</label>
                                <input type="number" id="MannualUnitRateflex" min="0" class='forTextBox' disabled="disabled" />
                            </div>
                        </div>

                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <input type="button" name="BtnPlan" id="BtnPlan" value="Estimate" class="btn btn-primary" />
                        <div id="gridContentPlansList"></div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-1" style="margin-bottom: 0px;">
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12 padding-0" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Misc.Cost(%): </label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='FinalMiscPer1' onchange='onChangeCalcAmountFlex()' />
                            <b>% </b>
                            <input class='text-right forTextBox' type='text' id='FinalMiscCost1' onchange='onChangeCalcAmountFlex(this.id)' style='width: 50%; float: right; text-align: right' />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row'>
                            <label>Shipping Cost </label>
                            <input class='text-right forTextBox' type='text' id='FinalShipperCost1' onchange='onChangeCalcAmountFlex()' style='width: 30%; text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                            <label class="hidden" style="color: blue">
                                Shipping Cost with GST(18%) :
                                <label id="ShippingGSTFlex">0</label></label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Tax Cost(%): </label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='FinalTaxPer1' onchange='onChangeCalcAmountFlex()' /><b>%</b><input class='text-right forTextBox' type='text' id='FinalTaxCost1' readonly="readOnly" style='width: 50%; float: right; text-align: right' />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Profit(%): </label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='ProfitPer1' onchange='onChangeCalcAmountFlex()' /><b>%</b><input class='text-right forTextBox' type='text' id='ProfitCost1' style='width: 50%; float: right; text-align: right' onchange='onChangeCalcAmountFlex(this.id)' />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: flex-start'>
                            <label>Unit Cost:</label>
                            <input class='text-right forTextBox' type='text' readonly="readOnly" id='FinalUnitCost1' onchange='CalculateUnitCost()' style='width: 72%; text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                            <input class="text-right forTextBox hidden" disabled="disabled" type="text" name="VendorUnitCostFlex" title="Final Unit Cost" value="" id="VendorUnitCostFlex" />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: flex-start'>
                            <label>Net Cost:</label>
                            <input class='text-right forTextBox' type='text' id='NetAmtflex' readonly="readOnly" style='width: 80%; float: right; text-align: right' />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Total: </label>
                            <input class='text-right forTextBox' type='text' id='FinalTotal' readonly="readOnly" style='width: 80%; float: right; text-align: right' />
                            <input class='text-right forTextBox hidden' type='text' id='finalCost1' readonly="readOnly" style='width: 80%; float: right; text-align: right' />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                        <b class="font-12">Product Description</b>
                        <textarea class="forTextBox" id="FlexPrdDisc"></textarea>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                        <b class="font-12">Packaging Details</b>
                        <textarea class="forTextBox" id="FlexPkgDtail"></textarea>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                        <b class="font-12">Description(Other)</b>
                        <textarea class="forTextBox" id="FlexOtrDisc"></textarea>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 modal-footer" style="border-top: 1px solid #42909A; padding: 5px; position: fixed; bottom: -5px; background: #fff">
                    <button type="button" id="BtnApplyPlan" class="btn btn-primary waves-effect">Apply Plan</button>
                </div>
            </div>
        </div>
    </div>
    <div id="myModal_1" class="clearfix tab-pane animated fadeInLeft">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div role="tabpanel">
                <div id="GridShowlist"></div>
            </div>
            <div class="modal-footer" style="border-top: 1px solid #42909A;">
                <%--<button type="button" id="BtnLinkToQuote" class="btn btn-secondary waves-effect">Link To Quote</button>--%>
                <button id="BtnPrint" type="button" class="btn btn-warning hidden">Print</button>
                <button type="button" id="BtnLoadFromList" class="btn btn-primary waves-effect hidden">Load</button>
                <button id="BtnDelete" type="button" class="btn btn-danger">Delete</button>
                <input type="button" data-dismiss="modal" value="Close" class="btn btn-secondary" onclick="setGridDisplay('block', 'none')" />
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalLoadFromEnquiry" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content">
                <div class="modal-body">
                    <div role="tabpanel">
                        <div id="RadioEnquiry" style="width: 100%"></div>
                        <div id="GridShowlistLoadFromEnquiry"></div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnLoadFromListt" class="btn btn-primary waves-effect">Load</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- The Modal for new masters-->
    <div class="modal fade" id="ModaliFrame" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Add New Master</strong>
                    <a href="javascript:void(0);" id="btnCloseiFrame" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <label id="LbliFrame" hidden></label>
                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">
                    <iframe id="iFrameMasters" style="width: 100%;"></iframe>
                </div>
            </div>
        </div>
    </div>
    <!-- The Modal Paper Details-->
    <div class="modal fade" id="myModalPapers" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px; width: auto;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: auto">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 5px;">
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 110px); overflow-y: auto; margin-left: 0px;">
                            <span id="PlanPaperString" class="cut-text"></span>
                            <div id="ContPaperDetails" style="height: auto; width: 100%;">
                                <div id="MainPaperDetails"></div>
                                <div id="DivPaperStock"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Forms Details-->
    <div class="modal fade" id="myModalforms" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Book Forms</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="GridFormsDetails"></div>
                    </div>
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="GridPrintingSlabsDetails"></div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>



    <!-- The Modal Chart-->
    <div class="modal fade" id="myModalChart" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="ZoomChartLayout" class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 110px); overflow-y: auto; padding: 20px"></div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal InPut parameter Operation calculation-->
    <div class="modal fade" id="ModalOperationEdit" tabindex="-1" role="dialog" style="padding: 20px; margin-top: 200px;">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Operation Calculation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <label id="LblTtlPaperWtInKG" style="float: left; width: 100%;">Total Paper(KG)</label>
                            <div id="OperationEditP" role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 10px; max-height: calc(100vh - 105px); overflow-y: auto">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnCalculateOperation" class="btn btn-link waves-effect" style="margin-top: -1em">Apply</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Shipper calculation-->
    <div class="modal fade" id="largeModalShipperPlan" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Shipper Planning</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 10px; max-height: calc(100vh - 105px); overflow-y: auto">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tab-pane animated fadeInDown">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 p-r-0">
                                        <div id="GridPackingContentsList"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0">
                                        <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-r-0">
                                            <b class="font-12">Total Qty</b>
                                            <input type="number" title="Total Quantity" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtShipperQuantity" value="" readonly="readonly" />
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4 p-r-0">
                                            <b class="font-12">Product L/W/H (MM)</b><br />
                                            <input type="text" title="Length of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductLength" value="" />
                                            <input type="text" title="Width of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductWidth" value="" />
                                            <input type="text" title="Height of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductHeight" value="" />
                                        </div>
                                        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 p-r-0">
                                            <b class="font-12">Product Wt (GM)</b>
                                            <input type="number" title="Qty in a bundle" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtProductWt" value="1" />
                                        </div>
                                        <div class="col-xs-6 col-sm-2 col-md-2 col-lg-1 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Tol.%</b>
                                            <input type="text" title="Tolerance in percentage" tabindex="0" class="forTextBox" name="Quantity" id="TxtShipperTolerance" value="10" />
                                        </div>
                                        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 p-r-0">
                                            <b class="font-12">Exp. Qty In A Box</b>
                                            <input type="number" title="Total Quantity" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtExpectedQtyInBox" value="0" />
                                        </div>
                                        <div class="col-xs-6 col-sm-2 col-md-3 col-lg-2 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Qty in A Bundle</b>
                                            <input type="number" title="Qty in a bundle" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtQtyInABundle" value="1" />
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 p-l-0 hidden">
                                            <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 p-r-0">
                                                <b class="font-12" style="width: auto;">Wt. of Box(Kg) Min</b>
                                                <input type="text" title="Min Weight in box in KG" tabindex="0" class="forTextBox" name="Quantity" id="TxtMinWtInBox" value="1" />
                                            </div>
                                            <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 p-r-0">
                                                <b class="font-12" style="width: auto;">Max</b>
                                                <input type="text" title="Max Weight in box in KG" tabindex="0" class="forTextBox" name="Quantity" id="TxtMaxWtInBox" value="12" />
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Box Min L/W/H (MM)</b><br />
                                            <input type="text" title="Min Length of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinLengthofBox" value="300" />
                                            <input type="text" title="Min Width of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinWidthofBox" value="250" />
                                            <input type="text" title="Min Height of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinHeightofBox" value="100" />
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Box Max L/W/H (MM)</b><br />
                                            <input type="text" title="Max Length of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxLengthofBox" value="700" />
                                            <input type="text" title="Max Width of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxWidthofBox" value="600" />
                                            <input type="text" title="Max Height of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxHeightofBox" value="400" />
                                        </div>
                                        <div class="col-xs-12 col-sm-8 col-md-5 col-lg-12 p-r-0">
                                            <button type="button" id="BtnPlanShipper" class="btn btn-warning">Show Plan</button>
                                            <button type="button" id="BtnPlanNewShipper" class="btn btn-primary">New Size Plan</button>
                                        </div>
                                        <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                            <img id="PlanShipperContImg" src="images/Contents/ShipperContent.png" style="width: 100%;" />
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div id="gridShipperPlans"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <b class="font-12">Container Capcity</b>
                                        <div id="gridContainerPlans"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-9 col-md-10 col-lg-10">
                                        <div id="gridShipperBoxes"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-3 col-sm-2 col-md-1 col-lg-1 m-t-10">
                    <b class="font-12">No of Ply</b>
                </div>
                <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 m-t-5">
                    <input type="text" title="No of Ply" placeholder="Shipper No of ply" tabindex="0" class="forTextBox" name="Quantity" id="TxtShipperNoOfPly" value="" />
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnSaveShipper" class="btn btn-success" style="margin-top: -1em">Save Shipper</button>
                    <button type="button" id="BtnApplyShipper" class="btn btn-info" style="margin-top: -1em">Apply</button>
                </div>
            </div>
        </div>
    </div>
    <!-- The Layout ZoomModal -->
    <div class="modal fade" id="myModalZoom" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <strong id="caption"></strong>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="rowcontents clearfix" style="padding: 20px; overflow: auto; height: 50em;">
                        <div style="padding: 5px">
                            <button type="button" class="zoom-out">
                                <span class="fa fa-minus"></span>
                            </button>
                            <button type="button" class="zoom-in">
                                <span class="fa fa-plus"></span>
                            </button>
                        </div>
                        <img src="images/Indus logo.png" id="Zoomedimg01" style="height: 50em;" class="bg-svg">
                        <input type="button" id="PZoomBtn" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- For Select op-->
    <div class="modal clearfix" id="SelectOperation" tabindex="-1" role="dialog" style="margin-top: 50px">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <strong id="caption1">Suggest Process</strong>
                </div>
                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="rowcontents clearfix" style="padding: 20px; overflow: auto;">
                        <div style="padding: 5px">
                            <b class="font-12">Select Operation</b>
                            <div id="gridSelOperation"></div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 modal-footer" style="border-top: 1px solid #42909A; padding: 5px; position: fixed; bottom: -5px; background: #fff">
                    <button id="BtnApplyOp" type="button" class="btn btn-secondary" data-dismiss="modal">Apply Operation</button>
                </div>
            </div>
        </div>
    </div>

    <%--for offfset plan window--%>

    <div id="BottomTabBar" class="MYBottomsidenav" style="padding-right: 1px">
        <div class="DialogBoxCustom" style="float: left">
            <strong>Plan Window</strong>&nbsp;  
            <strong style="border: 1px dashed;" id="PlanContNameD">0</strong>
            <strong style="border: 1px dashed;" id="PlanContQty">0</strong>
            <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="BottomTabBar" onclick="closeBottomTabBar()">
                <span data-dismiss="BottomTabBar" onclick="closeBottomTabBar()" style="font-weight: 900; margin-right: 8px">X</span>
            </a>
            <a class="btn myButton" style="float: right; display: block; cursor: pointer; margin-right: 5px" onclick="fnplnhideshow()">
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
                            <div id="Body_windowPlanning" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px; padding: 0px; margin-top: 1px; height: auto;">
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 padding-0 margin-0">
                                    <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                                        <div class='content_div' style='height: auto; text-align: center'>
                                            <img src="#" id="PlanContImg" style='height: 8em; width: 8em; left: 0' onmouseover='Planshow(this);' onmouseout='Planhide(this);' />
                                            <b id="PlanContName" style='display: none; border: 1px dashed; background-color: azure'></b>
                                            <textarea rows="3" cols="3" class="forTextBox" id="TxtPlanContName"></textarea>
                                            <b id="ContentOrientation" style='display: none'></b>
                                        </div>
                                    </div>
                                    <div id="planJob_Size" class="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                                        <b class="font-12" style="width: auto;">Job Size
                                            <label style="color: red">in MM</label>
                                        </b>
                                        <br />
                                        <label style="color: red; font-size: 10px">
                                            To convert Inch to MM,<br />
                                            Use shift + "</label>
                                        <br />
                                        <div id="SelJobSizeTemplate"></div>

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

                                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; margin: 0px;">
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <b class="font-12">Raw Material Selection <i class="fa fa-plus btn btn-link font-12 padding-0 reloadquality btnnewmaster"></i></b>
                                        <br />
                                        <div id="ItemPlanQuality" style="float: left; width: 99.3%; margin: .2%"></div>
                                        <div style="width: auto;">
                                            <div id="ItemPlanGsm" style="float: left; width: 45.2%; margin: .1%"></div>
                                            <div id="ItemPlanMill" style="float: left; width: 54%; margin: .1%"></div>
                                        </div>
                                        <div id="ItemPlanFinish" style="float: left; width: 99.3%; margin: .2%"></div>
                                        <br />
                                        <div class="advancedOptions">
                                            <b class="font-12">Paper Trimming</b>
                                            <div id="PaperTrim" style="width: auto;">
                                                <input type='text' title="Paper Trimming Top" id='PaperTrimtop' placeholder='T' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Bottom" id='PaperTrimbottom' placeholder='B' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Left" id='PaperTrimleft' placeholder='L' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Right" id='PaperTrimright' placeholder='R' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 padding-0 margin-0">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <b class="font-12">Printing Color Details</b><br />
                                        <input title="Front color" type='text' id='PlanFColor' placeholder='Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                        <input title="Back color" type='text' id='PlanBColor' placeholder='Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                        <input title="Special front color" type='text' id='PlanSpeFColor' placeholder='Spe.Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                        <input title="Special back color" type='text' id='PlanSpeBColor' placeholder='Spe.Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                        <b class="font-12">Printing Style</b><br />
                                        <div id="PlanPrintingStyle" style="float: left; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                        <div id="PlanPlateType" class="advancedOptions" style="float: left; display: none; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                    </div>
                                    <b class='advanced btn btn-link font-12'>Advance Options</b>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 advancedOptions">
                                        <b class="font-12">Machine Wastage</b><br />
                                        <div style="width: auto;">
                                            <div title="Wastage Type" id="PlanWastageType" style="float: left; width: 100%; margin: .1%"></div>
                                            <input title="Enter wastage quantity" type='text' id='PlanWastageValue' placeholder='Enter Qty' class='forTextBox' style="float: left; width: 100%; margin: .1%; display: none" />
                                        </div>
                                        <b class="font-12">Grain Direction</b>
                                        <div title="Grain Direction" id="PlanPrintingGrain" style="float: left; width: 100%; margin: .1%"></div>
                                        <br />
                                        <b class="font-12">Online Coating</b>
                                        <div title="Grain Direction" id="PlanOnlineCoating" style="float: left; width: 100%; margin: .1%"></div>
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 margin-0 advancedOptions">
                                    <b class="font-12">Trimming</b><br />
                                    <div style="width: auto;">
                                        <input type='text' title="Job Trim Top" id='Trimmingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Bottom" id='Trimmingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Left" id='Trimmingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Right" id='Trimmingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                    </div>
                                    <br />
                                    <br />
                                    <b class="font-12">Striping</b><br />
                                    <div style="width: auto;">
                                        <input type='text' title="Striping Top" id='Stripingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Bottom" id='Stripingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Left" id='Stripingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Right" id='Stripingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                    </div>
                                    <br />
                                    <div style="width: auto;">
                                        <b class="font-12" style="float: left; width: 45%; margin: .2em">Color Strip</b>
                                        <b class="font-12" style="float: left; width: 45%; margin: .2em">Gripper</b>
                                    </div>
                                    <br />
                                    <div style="width: auto;">
                                        <input required="required" title="Color Strip" type='text' id='PlanColorStrip' placeholder='Color Strip' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="3" onchange="myvalidation(this)" />

                                        <input required="required" title="Gripper" type='text' id='PlanGripper' placeholder='Gripper' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="6" />
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                                    <div id="ChkPlanInAvailableStock" class="hidden"></div>
                                    <div id="ChkPlanInStandardSizePaper"></div>
                                    <div id="ChkPlanInSpecialSizePaper"></div>
                                    <div id="ChkPaperByClient"></div>
                                    <div>
                                        <i class="fa fa-plus btn btn-link font-12 padding-0 reloadprocess btnnewmaster">Create New Process</i>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 advancedOptions">
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                        <b style="float: left; width: auto; margin: .7em" class="font-12">Machine </b>
                                    </div>
                                    <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10">
                                        <div id="MachineIDFiltered"></div>
                                        <textarea id="MachineId" style="display: none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0 margin-0" style="padding-right: 0px; padding-left: 2px">
                                <div id="GridOperation"></div>
                                <textarea id="OperIdPQ" style="display: none"></textarea>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0 margin-0" style="padding-right: 2px; padding-left: 2px">
                                <div id="GridOperationAllocated"></div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-t-5" style="float: left;">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5" style="float: left;">
                                    <input onchange="IsMaualCosting()" type="checkbox" id="vehicle1" name="vehicle1" value="IsManualCosting">
                                    <label style="color: red" for="vehicle1">Want Mannual Costing</label>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-t-5" style="float: left;">
                                    <label>Vendor</label>
                                    <div id="SelvendorOffset"></div>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-t-5" style="float: left;">
                                    <label>Unit Cost</label>
                                    <input type="number" id="MannualUnitRate" min="0" class='forTextBox' disabled="disabled" />
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-t-5" style="float: right;">

                                <div class="DialogBoxCustom">
                                    <a id="PlanButton" class="btn myButton" style="float: right; width: auto; cursor: pointer; margin-top: 5px;">Show Cost </a>
                                </div>
                            </div>

                        </div>
                    </div>
                    <%-- End Input --%>
                </div>

                <div id="PlanContainer" style="float: left; height: auto; width: 100%; display: none">

                    <div id="PlanMain1" class="col-xs-12 col-sm-10 col-md-10 col-lg-10" style="padding-right: 0px; height: auto; padding-left: 0px;">
                        <div style="height: auto; margin: 0px 2px 0px 2px;">
                            <div class="col-sm-2 margin-0" id="FilterMachineFolds"></div>
                            <b class="col-sm-4 margin-0 font-12" style="border: 1px dashed;" id="LblPlanContName"></b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: rgba(228, 255, 0, 0.6509803921568628);">Reel To Sheet Planning</b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: #ffc5d8;">Reel Planning</b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: greenyellow;">Plan In Special Paper</b>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-0" id="ContentPlansList"></div>
                        </div>
                    </div>

                    <div id="PlanMain" class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-right: 0px; height: auto; padding-left: 0px; padding-top: 1px;">
                        <div class='content_div' style='height: auto; width: auto; text-align: center;'>
                            <b class="col-xs-12 btn btn-sm btn-primary font-12" id="BtnKeyLine">Key Line</b>
                            <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                <div id="Layout_Sheet" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em"></div>
                            </div>
                            <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                <div id="Layout_Ups" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em;"></div>
                            </div>
                        </div>
                        <div style="display: none">
                            <svg id="svg_Sheet_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' onmouseout='setTimeout(PlanLayoutHide,3000);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                            <svg id="svg_Shape_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' onmouseout='setTimeout(PlanLayoutHide,3000);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                        </div>
                    </div>

                    <div id="tabDetailsMain" class="col-xs-12 col-sm-4 col-md-3 col-lg-3 padding-0 margin-0">
                        <div id="TabHeadsDetails">
                            <div style="height: auto; margin: 0px 2px 0px 2px;">
                                <div id="GridHeadsDetails"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                        <div id="TabOperations">
                            <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 padding-0 margin-0">
                                <div id="GridOperationDetails"></div>
                            </div>

                            <%--<div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OperMoveUp" class="btn btn-success"><i class="fa fa-2x fa-arrow-up"></i></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OperMoveDown" class="btn btn-success"><i class="fa fa-2x fa-arrow-down"></i></div>
                                </div>
                            </div>--%>
                        </div>
                        <div class='col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0 margin-0'>
                            <div id="PlanChartLayout" data-target="#myModalChart" data-toggle="modal" style="height: 10em; margin-top: 0px; margin-left: 0em"></div>
                        </div>
                    </div>


                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" style="margin-bottom: 0px;">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Misc.Cost(%): </label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='FinalMiscPer' onchange='onChangeCalcAmountp()' />
                            <b>% </b>
                            <input class='text-right forTextBox' type='text' id='FinalMiscCost' onchange='onChangeCalcAmountp(this.id)' style='width: 50%; float: right; text-align: right' />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: flex; flex-direction: row'>
                            <label>Shipping Cost </label>
                            <input class='text-right forTextBox' type='text' id='FinalShipperCost' onchange='onChangeCalcAmountp()' style='text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                            <label class="hidden" style="color: blue">
                                Shipping Cost with GST(18%) :
                                <label id="ShippingGSTOffset">0</label></label>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Profit(%):&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='ProfitPer' onchange='onChangeCalcAmountp()' /><b>%</b><input onchange='onChangeCalcAmountp(this.id)' class='text-right forTextBox' type='text' id='ProfitCost' style='width: 50%; float: right; text-align: right' />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: flex; flex-direction: row; align-items: center; justify-content: space-between'>
                            <label>Tax Cost(%): </label>
                            <input class='text-right forTextBox' style='float: left; width: 20%;' type='number' min='0' id='FinalTaxPer' onchange='onChangeCalcAmountp()' /><b>%</b><input class='text-right forTextBox' type='text' id='FinalTaxCost' readonly="readOnly" style='width: 50%; float: right; text-align: right' />
                        </div>

                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                            <b class="font-12">Expected Qty</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="Expected Quantity" title="Expected Quantity" id="TxtFinalQuantity" />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                            <b class="font-12">Unit Cost</b>
                            <b class="font-12" style="color: forestgreen">(Quotated Unit Cost : <b style="color: red" id="QuotedUCostOffset">0</b>)</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="finalUnitCost" title="Final Unit Cost" value="" id="finalUnitCost" />
                            <input class="text-right forTextBox hidden" disabled="disabled" type="text" name="VendorUnitCostOffset" title="Final Unit Cost" value="" id="VendorUnitCostOffset" />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                            <b class="font-12">Net Cost</b>
                            <input class='text-right forTextBox' type='text' id='NetAmt' readonly="readOnly" />
                        </div>
                        <input class="text-right forTextBox hidden" disabled="disabled" type="text" name="finalCost" title="Final Cost" value="" id="finalCost" />

                        <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                            <b class="font-12">Final Cost</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="finalquotatedCost" title="Final Quotated Cost" value="" id="finalquotatedCost" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6 col-sm-6 hidden">
                            <b class="font-12">Final Cost</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="TotalAmount" title="Final Quotated Cost" value="" id="TotalAmount" />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                        <b class="font-12">Product Description</b>
                        <textarea class="forTextBox" id="OffsetPrdDisc"></textarea>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12">
                        <b class="font-12">Packaging Details</b>
                        <textarea class="forTextBox" id="OffsetPkgDtail"></textarea>
                    </div>
                    <div class="col-lg-10 col-md-10 col-sm-12 col-sm-12">
                        <b class="font-12">Description(Other)</b>
                        <textarea class="forTextBox" id="OffsetOtrDisc"></textarea>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-4 col-sm-4">
                        <br />
                        <a id="btnApplyCostPQ" name="btnApplyCostPQ" class="btn myButton" style="color: #fff; float: right">Apply Cost</a>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="modal clearfix" id="modalEstimateProductUnit" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Product Estimation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="overflow-y: auto; height: 90vh; padding-bottom: 30px">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            <strong class="font-11">Product Name</strong>
                            <input type="text" id="TxtProductNameUnit" class="forTextBox disabled" readonly="" />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <b class="font-11">Quantity</b>
                            <input type="text" id="TxtPlanQtyUnit" class="forTextBox disabled" readonly="" />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <b class="font-11">Rate</b>
                            <input class='text-right forTextBox' onchange="CalculateUnitCost()" type='text' id='VendorRate' />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            <b class="font-11">Vendor Name</b>
                            <div id="Selvendor" />
                        </div>
                    </div>
                    <div style="width: 100%">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <label>Select Processes :</label>
                            <div id="UnitProcessSuggestion"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <label>Processes :</label>
                            <div id="UnitProcessDefault"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0" style="margin-bottom: 0px; border-top: 1px solid #42909A; padding: 5px">
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Misc.Cost(%):&nbsp&nbsp&nbsp </label>
                                <div style='display: flex; flex-direction: row; align-items: center; justify-content: flex-start'>
                                    <input class='text-right forTextBox' style="float: left; width: 30%;" type='number' min='0' id='FinalMiscPerUnit' onchange='CalculateUnitCost()' />
                                    <b>% </b>
                                    <input class='text-right forTextBox' type='text' id='FinalMiscCostUnit' onchange='CalculateUnitCost(this.id)' style='width: 70%; float: right; text-align: right' />
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Tax Cost(%):&nbsp&nbsp&nbsp&nbsp&nbsp </label>
                                <div style='display: flex; flex-direction: row; align-items: center; justify-content: flex-start'>
                                    <input class='text-right forTextBox' style='float: left; width: 30%;' type='number' min='0' id='FinalTaxPerUnit' onchange='CalculateUnitCost()' /><b>%</b><input class='text-right forTextBox' type='text' id='FinalTaxCostUnit' readonly="readOnly" style='width: 70%; float: right; text-align: right' />
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Profit(%):&nbsp&nbsp&nbsp</label>
                                <div style='display: flex; flex-direction: row; align-items: center; justify-content: flex-start'>
                                    <input class='text-right forTextBox' style='float: left; width: 30%;' type='number' min='0' id='ProfitPerUnit' onchange='CalculateUnitCost()' /><b>%</b><input class='text-right forTextBox' type='text' id='ProfitCostUnit' style='width: 70%; float: right; text-align: right' onchange='CalculateUnitCost(this.id)' />
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Shipping Cost:&nbsp</label>
                                <input class='text-right forTextBox' type='text' id='FinalShipperCostUnit' onchange='CalculateUnitCost()' style='width: 100%; text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                                <label class="hidden" style="color: blue">
                                    Shipping Cost with GST(18%) :
                                <label id="ShippingGSTUnit">0</label></label>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Unit Cost:&nbsp&nbsp&nbsp&nbsp</label>
                                <input class='text-right forTextBox' type='text' readonly="readOnly" id='FinalUnitCostUnit' onchange='CalculateUnitCost()' style='text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                                <input class='text-right forTextBox hidden' type='text' readonly="readOnly" id='VendorUnitCostUnit' style='text-align: right; display: flex; flex-direction: row; align-items: center; justify-content: space-between' />
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 col-sm-12" style='display: block; flex-direction: row; align-items: center; justify-content: flex-start'>
                                <label>Total:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label>
                                <input class='text-right forTextBox' type='text' id='FinalTotalUnit' readonly="readOnly" style='float: right; text-align: right' />
                                <input class='text-right forTextBox hidden' type='text' id='finalCostUnit' readonly="readOnly" style='width: 80%; float: right; text-align: right' />
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                                <b class="font-12">Product Description</b>
                                <textarea class="forTextBox" id="UnitPrdDisc"></textarea>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                                <b class="font-12">Packaging Details</b>
                                <textarea class="forTextBox" id="UnitPkgDtail"></textarea>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                                <b class="font-12">Description(Other)</b>
                                <textarea class="forTextBox" id="UnitOtrDisc"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A; padding: 5px; bottom: -5px; background: #fff; position: fixed; width: 100%; left: 0">
                    <button type="button" id="BtnApplyPlanUnit" class="btn btn-primary waves-effect">Apply Plan</button>
                </div>
            </div>
        </div>
    </div>
    <div id="PlanWindowDivZommer" class='PlancontentZoom' style="text-align: center; z-index: 9" onmouseover="PlanhideIN(this);" onmouseout="PlanhideOut(this);"></div>
    <input type="text" id="PlanContentType" style="display: none;" />
    <input type="text" id="Txt_ContentImgSrc" style="display: none" />
    <div id="ChkUseFirstPlanAsMaster" style="display: none"></div>


    <script src="CustomJS/LocalStorage.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/DynamicQty.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/PlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/ProjectQuotation.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/LayoutDraw.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/RePlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
</asp:Content>

