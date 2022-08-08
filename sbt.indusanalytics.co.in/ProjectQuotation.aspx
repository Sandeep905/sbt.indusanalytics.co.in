<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProjectQuotation.aspx.vb" Inherits="ProjectQuotation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
        <div id="image-indicator"></div>

        <div id="FieldCntainerRow" class="clearfix tab-pane animated fadeInRight active">
            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                <b class="font-11">Quote No.</b>
                <input type="text" id="TxtQuoteNo" class="forTextBox disabled" style="float: left; width: 100%;" readonly="" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <b class="font-11">Client Name</b>
                <div id="SelClient"></div>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-1">
                <b class="font-11">City</b>
                <input type="text" name="TxtClientCity" id="TxtClientCity" class="forTextBox" value="" readonly="readonly" disabled />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <b class="font-11">Project Name</b>
                <input type="text" id="TxtProjectName" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                <b class="font-11">Sales Person</b>
                <div id="SelSalesPerson"></div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
            <div class="modal-footer col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button id="BtnSave" type="button" class="btn btn-success">Save</button>
                <input type="button" class="btn btn-primary" value="Show List" id="BtnShowList" onclick="setGridDisplay('none', 'block')" />
                <input id="EstimateID" style="display: none" />
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
                    <div class="clearfix tab-pane">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <b class="font-12">Product Configuraions</b>
                            <div id="gridProductConfig"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <b class="font-12">Operation List</b>
                            <div id="gridOperation"></div>
                            <textarea id="OperId" class="hidden"></textarea>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <input type="button" name="BtnPlan" id="BtnPlan" value="Estimate" class="btn btn-primary" />
                            <div id="gridContentPlansList"></div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 modal-footer" style="border-top: 1px solid #42909A;">
                            <button type="button" id="BtnApplyPlan" class="btn btn-primary waves-effect">Apply Plan</button>
                        </div>
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
                    <button id="BtnPrint" type="button" class="btn btn-warning">Print</button>
                    <button type="button" id="BtnLoadFromList" class="btn btn-primary waves-effect hidden">Load</button>
                    <button id="BtnDelete" type="button" class="btn btn-danger">Delete</button>
                    <input type="button" value="Close" class="btn btn-secondary" onclick="setGridDisplay('block','none')" />
                </div>
            </div>
        </div>

        <!-- The Modal for new masters-->
        <div class="modal fade" id="ModaliFrame" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                    <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                        <strong>Quotation</strong>
                        <a href="javascript:void(0);" id="btnCloseiFrame" class="iconRightDbox btn-danger" data-dismiss="modal">
                            <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                        </a>
                    </div>
                    <label id="LbliFrame" hidden></label>
                    <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">
                        <iframe id="iFrameMasters" style="width: 100%;"></iframe>
                    </div>
                    <div class="modal-footer">
                        <input type="button" name="btnApplyQuote" id="btnApplyQuote" class="btn btn-info" value="Apply Final Cost" />
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="CustomJS/ProjectQuotation.js"></script>
</asp:Content>

