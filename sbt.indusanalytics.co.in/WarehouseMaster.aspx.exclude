<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="WarehouseMaster.aspx.vb" Inherits="WarehouseMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto; padding-bottom: 2px">
                        <a id="CreateButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/NewClient.png" style="height: 20px; width: 25px; float: left; margin-top: 0px;" />
                            &nbsp Create
                        </a>
                        <a id="EditButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/Edit.png" style="height: 20px; width: 25px; float: left; margin-top: 0px" />
                            &nbsp Edit
                        </a>
                        <%-- <a id="DeleteButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/MasterDelete.png" style="height: 20px; width: 25px; float: left; margin-top: 0px" />
                            &nbsp Delete
                        </a>--%>
                    </div>
                    <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Warehouse master</strong>

                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="WarehouseShowListGrid" style="width: 100%; min-height: 100%; float: left; height: calc(100vh - 85px); overflow-y: auto"></div>
                        <input type="text" id="TxtWarehouseID" style="display: none" />
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
                    <strong>Create/Update Warehouse Master</strong>
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
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="height: calc(100vh - 110px); overflow-y: auto; padding: 0px; margin: 0px">
                                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12" style="margin-top: -.5em; float: left; margin: 0px; height: auto; padding: 0px; padding-left: 0px; padding-right: 0px; margin-bottom: 0em">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 0px; padding: 0px">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label style="float: left; margin-top: 5px">Warehouse Name </label>
                                                    <input type="text" id="TxtWarehouseName" class="forTextBox" style="width: 100%;" placeholder="Enter Warehouse Name" />
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrTxtWarehouseName" style="color: red; font-size: 12px; display: none"></strong></div>
                                                </div>

                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label style="float: left; margin-top: 0px; margin-right: 8px">City  </label>
                                                    <div id="SelCity" style="float: left; width: 100%"></div>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCity" style="color: red; font-size: 12px; display: none"></strong></div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 0px; padding: 0px">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label style="float: left; margin-top: 5px">Warehouse Address </label>
                                                    <textarea id="TxtWarehouseAddress" class="forTextBox" style="width: 100%; height: 9em" placeholder="Enter Warehouse Address"></textarea>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrTxtWarehouseAddress" style="color: red; font-size: 12px; display: none"></strong></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="margin-top: -.5em; float: left; margin: 0px; height: auto; padding: 0px; padding-left: 0px; padding-right: 0px; margin-bottom: 0em">
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                                                <label style="float: left; margin-top: 5px">Bin Name</label>
                                                <input type="text" id="TxtBinName" class="forTextBox" style="width: 100%;" placeholder="Enter Bin Name" />
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 2px; padding-bottom: 2px; width: auto; padding-right: 1px; margin-top: 25px; border-radius: 4px; text-align: left">
                                                    <a id="BtnAddRowCol" href='#' class="iconButton" style="float: right; margin-top: 1px; margin-right: 1px; float: right" title="add new row">
                                                        <i class="fa fa-plus fa-2x fa-fw" style="font-size: 12px;"></i>&nbsp Add
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div id="BinNameGrid" style="float: left; width: 100%; height: 17em;"></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDivPickList" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em; display: none" disabled="disabled">Save As</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/WarehouseMaster.js"></script>
</asp:Content>

