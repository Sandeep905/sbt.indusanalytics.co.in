<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductGroupMasterForGST.aspx.vb" Inherits="ProductGroupMasterForGST" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto; padding-bottom: 2px">
                        <input type="button" name="BtnCreate" value="Create" id="CreateButton" class="btn btn-primary" />
                        <input type="button" name="EditButton" value="Edit" id="EditButton" class="btn btn-default" />
                        <input type="button" name="DeleteButton" value="Delete" id="DeleteButton" class="btn btn-danger" />
                    </div>
                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="PGHMShowListGrid"></div>
                        <input type="text" id="TxtPGMID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--largeModalPickList Model PopUp (PickList) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Product Group Master (Create/Update)</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="popContenerContentPickList" style="display: block; padding-top: 0px; padding-left: 0px;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerPickList" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div id="FieldCntainerRowPickList" class="rowcontents clearfix" style="padding-top: 0px; padding-left: 0px">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ReqGridPickList" style="margin-top: 10px;">
                                    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <label>Product Group Name  </label>
                                        <input type="text" id="TxtGroupName" class="forTextBox" style="width: 100%" placeholder="Product Group Name" />
                                        <div><strong id="ValStrTxtGroupName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <label>Product Display Name  </label>
                                        <input type="text" id="TxtDisplayName" class="forTextBox" style="width: 100%" placeholder="Display Name" />
                                        <div><strong id="ValStrTxtDisplayName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                        <label>Product HSN Code </label>
                                        <input type="text" id="TxtHSNCode" class="forTextBox" style="width: 100%" placeholder="HSN Code " />
                                        <div><strong id="ValStrTxtHSNCode" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden">
                                        <label>Tariff No </label>
                                        <input type="text" id="TxtTariffNo" class="forTextBox" style="width: 100%" placeholder="Tariff No " />
                                        <div><strong id="ValStrTxtTariffNo" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6">
                                        <label>GST % </label>
                                        <input type="text" id="TxtGST" class="forTextBox" style="width: 100%" placeholder="GST % " onchange="Numeric(this);" />
                                        <div><strong id="ValStrTxtGST" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6">
                                        <label>CGST % </label>
                                        <input type="text" id="TxtCGST" class="forTextBox" style="width: 100%" placeholder="CGST % " onchange="Numeric(this);" />
                                        <div><strong id="ValStrTxtCGST" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6">
                                        <label>SGST % </label>
                                        <input type="text" id="TxtSGST" class="forTextBox" style="width: 100%" placeholder="SGST % " onchange="Numeric(this);" />
                                        <div><strong id="ValStrTxtSGST" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-6">
                                        <label>IGST % </label>
                                        <input type="text" id="TxtIGST" class="forTextBox" style="width: 100%" placeholder="IGST % " onchange="Numeric(this);" />
                                        <div><strong id="ValStrTxtIGST" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label>Under Group  </label>
                                        &nbsp;&nbsp;&nbsp;
                                                <div id="SelUnderGroup" style="float: left; width: 100%"></div>
                                        <div><strong id="ValStrSelUnderGroup" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                        <label>Product Type  </label>
                                        &nbsp;&nbsp;&nbsp;
                                                <div id="SelProductType" style="float: left; width: 100%"></div>
                                        <div><strong id="ValStrSelProductType" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                    <div id="DivItemGroupName" class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="display: none; padding-top: 0px; margin-bottom: 0px">
                                        <label>Item Group Name </label>
                                        &nbsp;&nbsp;&nbsp;
                                                <div id="SelItemGroupName" style="float: left; width: 100%"></div>
                                        <div><strong id="ValStrSelItemGroupName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivPickList" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-default waves-effect">New</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ProductGroupMasterForGST.js"></script>
</asp:Content>

