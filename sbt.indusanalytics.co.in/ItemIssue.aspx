<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ItemIssue.aspx.vb" Inherits="ItemIssue" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="LoadIndicator"></div>
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="height: auto; padding-bottom: 2px">
                    <input type="button" name="CreateButton" id="CreateButton" value="Create" class="btn btn-info" />
                    <input type="button" name="EditButton" id="EditButton" value="Edit" class="btn btn-warning" />
                    <input type="button" name="DeleteButton" id="DeleteButton" value="Delete" class="btn btn-danger" />
                    <input type="button" name="ShowListButton" id="ShowListButton" value="Show List" class="btn btn-primary" />
                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="IssueShowListGrid"></div>
                        <input type="text" id="TxtIssueID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--largeModalPickList Model PopUp (PickList) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Item Issue</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div id="popContenerContentPickList" style="display: block; padding-top: 0px; padding-left: 0px;">
                        <div id="FieldCntainerRowPickList" class="rowcontents clearfix" style="padding-top: 0px; padding-left: 0px">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridPickList">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0">
                                        <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                                            <b class="font-11">Issue No.</b>
                                            <input class="forTextBox" type="text" name="TxtIssueNo" id="TxtIssueNo" readonly="readonly" value="" />
                                            <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                                        </div>
                                        <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 p-l-0">
                                            <b class="font-11">Issue Date</b>
                                            <div id="IssueDate"></div>
                                        </div>
                                        <div id="JobCardDiv" class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="display: none">
                                            <label style="float: left; margin-top: 5px">Job Card No.</label>
                                            <input type="text" id="TxtJCN" onkeydown="keydownFunction()" onkeyup="keyupFunction()" class="forTextBox" style="width: 100%" placeholder="Job Card No." />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrTxtJCN" style="color: red; font-size: 12px; display: none"></strong></div>
                                            <input type="text" id="TxtJobBookingID" class="forTextBox" style="width: 100%; display: none" readonly="" />
                                            <input type="text" id="TxtJobBookingJobCardContentsID" class="forTextBox" style="width: 100%; display: none" readonly="" value="0" />
                                            <input type="text" id="TxtLedgerID" class="forTextBox" style="width: 100%; display: none" readonly="" />
                                            <input type="text" id="TxtJobBookingNo" class="forTextBox" style="width: 100%; display: none" readonly="" />
                                            <input type="text" id="TxtJobCardContentNo" class="forTextBox" style="width: 100%; display: none" readonly="" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="display: none">
                                            <label class="font-11">Job Name</label>
                                            <input type="text" id="TxtJobName" class="forTextBox" style="width: 100%" placeholder="Job Name" readonly="" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="display: none">
                                            <label class="font-11">Content Name</label>
                                            <input type="text" id="TxtContentName" class="forTextBox" style="width: 100%" placeholder="Content Name" readonly="" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="display: none">
                                            <label class="font-11">Department</label>
                                            <div id="SelDepartment"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelDepartment" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-8">
                                            <b class="font-11">Picklist Type</b>
                                            <div id="RadioButtonPicklistIssue"></div>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 p-l-0">
                                            <br class="hidden-xs" />
                                            <input type="button" name="RefreshButton" id="RefreshButton" class="btn btn-primary" value="Refresh" />
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div id="PicklistGrid"></div>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <label class="font-11">Stock Batch Wise</label>
                                            <div id="StockBatchWiseGrid"></div>
                                        </div>
                                        <div style="float: right;">
                                            <div class="col-xs-5 col-sm-3 col-md-3 col-lg-3 p-r-0">
                                                <label class="font-11">Already Issued Qty</label>
                                            </div>
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-7">
                                                <input type="text" id="TxtIssuedQuantity" class="forTextBox" placeholder="Already Issued Qty" disabled="disabled" readonly="" />
                                            </div>
                                            <div class="col-xs-5 col-sm-1 col-md-1 col-lg-1">
                                                <label class="font-11">Quantity</label>
                                            </div>
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-7">
                                                <input type="text" id="TxtQuantity" class="forTextBox" placeholder="Quantity" />
                                                <input type="text" id="TxtUnitDecimalPlace" class="forTextBox" style="display: none" placeholder="Unit Decimal Place" />
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                                <input type="button" name="BtnAddRow" id="BtnAddRow" class="btn btn-primary" value="Add" />
                                            </div>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div id="AllotedItemGrid"></div>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0">
                                            <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                                                <b class="font-11">Slip No.</b>
                                                <input class="forTextBox" type="text" name="TxtSlipNo" id="TxtSlipNo" placeholder="Slip No." readonly="readonly" value="" />
                                            </div>
                                            <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 p-l-0">
                                                <b class="font-11">Slip Date</b>
                                                <div id="SlipDate"></div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 p-r-0">
                                                <b class="font-11">Floor Warehouse</b>
                                                <div id="SelFloorGodown"></div>
                                                <div style="float: left; width: 100%"><strong id="ValStrSelFloorGodown" style="color: red; font-size: 12px; display: none"></strong></div>
                                            </div>
                                            <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                                                <b class="font-11">Bin Name</b>
                                                <div id="SelBinName"></div>
                                                <div style="float: left; width: 100%"><strong id="ValStrSelBinName" style="color: red; font-size: 12px; display: none"></strong></div>
                                            </div>

                                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                <b class="font-11">Remark</b>
                                                <input class="forTextBox" type="text" id="TxtNarration" name="TxtNarration" placeholder="Remark" value="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivPickList" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-default waves-effect">New</button>
                    <button type="button" id="IssuePrintButton" class="btn btn-primary waves-effect" disabled="disabled">Print</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                </div>
            </div>
        </div>
    </div>


    <%--largeModalFiltrJobcard Model PopUp (FiltrJobcard) --%>
    <div class="modal fade" id="largeModalFiltrJobcard" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Exist Job Card</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                        <input type="button" id="OpenPopupJobcard" style="display: none" />
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentFiltrJobcard" style="display: block; padding-top: 0px; padding-left: 0px;">
                        <div id="FieldCntainerFiltrJobcard" class="row clearfix" style="padding-top: 0px; padding-left: 0px">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="FiltrJobcard" style="margin-top: 10px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-bottom: 0px; margin-top: 0px; padding-right: 13px; height: calc(100vh - 125px); overflow-y: auto;">
                                        <div id="FiltrJobcardGrid" style="float: left; width: 100%; height: 10em; margin-bottom: 13px"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivFiltrJobcard" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/ItemIssue.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
</asp:Content>

