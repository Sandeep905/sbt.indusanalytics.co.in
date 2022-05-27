<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="RequisitionApproval.aspx.vb" Inherits="RequisitionApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div id="opt-approval-radio" style="float: left; margin-left: 2em; margin-top: .4em; margin-right: 1em"></div>
                        <button type="button" class="btn btn-success waves-effect" id="DetailsReqButton">Requisition Detail</button>
                    </div>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Requisition Approval</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 5px">
                        <div id="grid-requisitions" style="width: 100%; height: calc(100vh - 100px); float: left; display: block"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>



     <%-- Modal Requistion View--%>>
    <div class="modal fade" id="largeModalReqView" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Purchase Requisition Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <button id="reloadDisplayNone" type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="display: none">Reload</button>
                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRow" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>

                        <div id="FieldCntainerRow" class="rowcontents clearfix">
                            <div class="tab-content">
                                <div role="tabpanel" class="col-lg-12 col-md-12 col-sm-12 tab-pane animated fadeInRight active" id="ReqGrid">
                                    <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                                        <b class="font-11">Requisition No:</b>
                                        <input class="forTextBox" type="text" name="TxtVoucherNo" id="TxtVoucherNo" readonly="readonly" value="" />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                                        <b class="font-11">Requisition Date:</b>
                                        <div id="VoucherDate"></div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="CreateReqGrid"></div>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12 m-t-10 m-b-0">
                                    <label style="float: left;">Remark</label>
                                </div>
                                <div class="m-t-0 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                                    <textarea id="textNaretion" class="forTextBox"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-success waves-effect" id="Btn_Update" style="margin-top: -1em">Approve</button>
                    <button type="button" class="btn btn-danger waves-effect" id="Btn_Cancel" style="margin-top: -1em">Cancel</button>                    
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/RequisitionApproval.js"></script>
</asp:Content>

