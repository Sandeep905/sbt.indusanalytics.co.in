<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="PurchaseRequisition.aspx.vb" Inherits="PurchaseRequisition" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .auditapproved {
            background-color: #4CAF50 !important;
        }

        .approvedrequisition {
            background-color: #88a7a5 !important;
        }

        .cancelledrequisition {
            background-color: #990033 !important;
        }

        .auditcancelled {
            background-color: #ea8384 !important;
        }

        .pendingauditapproval {
            background-color: #e8f403 !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div id="RadioButtonPR" style="float: left; margin-left: 2em; margin-top: .4em"></div>
                        <a id="CreateReqButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px;">
                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Create Requisition
                        </a>
                        <a id="EditReqButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: none">
                            <i class="fa fa-edit fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Edit
                        </a>
                        <a id="DeleteReqButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 4px; display: none">
                            <img src="images/MasterDelete.png" style="height: 16px; width: 25px; float: left; margin-top: 0px" />&nbsp Delete
                        </a>
                        <div id="RadioButtonStatus" style="float: left; margin-left: 2em; margin-top: .4em"></div>
                    </div>
                    <b id="PRID" style="display: none"></b><b id="PRDisName" style="display: none"></b>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Purchase Requisition</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="PRGridIndent" style="width: 100%; float: left; display: none"></div>
                        <div id="PRGridRequisitions" style="width: 100%; float: left; display: none"></div>
                        <input type="text" id="TxtPRID" style="display: none" />
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
                    <strong id="poptag">Purchase Requisition Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="float: right">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>
                <button id="reloadDisplayNone" type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="display: none">Reload</button>
                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRow" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>

                        <div id="FieldCntainerRow" class="rowcontents clearfix">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGrid">
                                <%--<div class="col-lg-2 col-md-2 col-sm-2 col-xs-6" style="margin-bottom: 0px; margin-top: 5px; padding: 0px;">
                                        <label style="float: left;">Voucher No #</label>&nbsp;&nbsp<label id="LblVoucherNo" style="float: left;">Voucher No</label>
                                    </div>--%>
                                <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11 m-b-0">Requisition No.:</label>
                                    <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                    <input class="forTextBox" type="hidden" name="TxtMaxVoucherNo" id="TxtMaxVoucherNo" value="" />
                                </div>
                                <div class="col-lg-2 col-md-3 col-sm-3 col-xs-7">
                                    <label class="font-11 m-b-0">Requisition Date:</label>
                                    <div id="VoucherDate"></div>
                                </div>

                                <div class="col-lg-8 col-md-6 col-sm-6 col-xs-5">
                                    <br />
                                    <div class="DialogBoxCustom" style="float: right; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                        <a id="BtnopenPop" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; float: left">
                                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Add Item
                                        </a>
                                    </div>
                                </div>

                            </div>

                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div id="CreateReqGrid"></div>
                            </div>
                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12 m-t-10">
                                <label class="font-11 m-b-0">Remark</label>
                            </div>
                            <div class="col-lg-11 col-md-11 col-sm-11 col-xs-12">
                                <textarea id="textNaretion" class="forTextBox"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em" disabled="disabled">Save As</button>
                    <button type="button" id="POPrintButton" class="btn btn-link waves-effect" style="margin-top: -1em">Print</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                </div>
            </div>
        </div>
        <%--</div>--%>
    </div>

    <%--largeModalChangeItem Model PopUp (Delivery Schedule) --%>
    <div class="modal fade" id="largeModalChangeItem" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Change Item</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentChangeItem" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerChangeItem" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div id="FieldCntainerChangeItem" class="rowcontents clearfix">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqChangeItem" style="margin-top: 2em">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div id="ChangeItemGrid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivChangeItem" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnChangeItemNext" class="btn btn-link waves-effect" style="margin-top: -1em">Next</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
            <%--</div>--%>
        </div>
    </div>

    <%--largeModalChangeItem Model PopUp (Heads) --%>

    <%--OverFlow Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModalOverFlow" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Purchase Requisition</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContentNext" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRowNext" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div id="FieldCntainerRowNext" class="rowcontents clearfix">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridNext">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 0px; border-radius: 4px; text-align: left">
                                        <a id="BtnRefreshList" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; margin-left: 0px; padding-left: 0px; padding-right: 10px; float: left" title="Refresh Item List">
                                            <i class="fa fa-refresh fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp&nbsp Refresh 
                                        </a>

                                        <a id="BtnCreateNewItem" href='#' class="iconButton" style="margin-top: 0px; margin-right: 0px; margin-left: 20px; padding-left: 0px; padding-right: 10px; float: left" title="Create New Item Master">
                                            <i class="fa fa-plus fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp&nbsp Create New Item 
                                        </a>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OverFlowGrid"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivNext" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNext" class="btn btn-link waves-effect" style="margin-top: -1em">Next</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>            
        </div>
    </div>


    <script src="CustomJS/PurchaseRequisition.js?2"></script>

</asp:Content>

