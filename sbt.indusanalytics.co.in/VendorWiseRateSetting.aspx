<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="VendorWiseRateSetting.aspx.vb" Inherits="VendorWiseRateSetting" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto; padding-bottom: 2px">
                        <a id="SaveButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <i class="fa fa-save fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Save
                        </a>
                        <a id="SaveAs" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px; display: none">
                            <i class="fa fa-copy fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Save As
                        </a>
                        <a id="RefreshButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <i class="fa fa-refresh fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp New
                        </a>

                    </div>
                    <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Vendor Rate Setting</strong>
                </div>

                <div class="row clearfix" style="padding: 0px; margin: 0px;">
                    <div class=" ContainerBoxCustom" style="float: left;">
                        <div id="ButtonGridDiv" style="height: auto; display: block; margin-top: 10px">
                            <div style="width: 100%; min-height: 100%; float: left; height: calc(100vh - 95px); overflow-y: auto">
                                <div class="row clearfix" style="padding: 0px; margin: 0px;">
                                    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                                        <label style="float: left; width: 100%;">Vendor Name</label><br />
                                        <div id="SelectBoxSupplierName" style="float: left; width: 20em; height: 30px; border: 1px solid #d3d3d3"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxSupplierName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>
                                   <%-- <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style="float: left; margin-bottom: 0px;">
                                        <label style="float: left; width: 100%;">Item Group</label><br />
                                        <div id="SelectBoxItemGroup" style="float: left; width: 20em; height: 30px; border: 1px solid #d3d3d3"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxItemGroup" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>--%>

                                  <%--  <div id="inputdiv" class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px;display:none">
                                        <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12" style="float: left; margin-bottom: 0px;">
                                            <label style="float: left; width: 100%;">Quantity Tolerance</label><br />
                                            <input type="number" id="TxtQtyTolerance" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12" style="float: left; margin-bottom: 0px;">
                                            <label style="float: left; width: 100%;">Purchase Rate</label><br />
                                            <input type="number" id="TxtPurchaseRate" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-5 col-xs-12" style="float: left; margin-bottom: 0px;">
                                            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; width: auto; padding-right: 0px; margin-top: 20px; border-radius: 4px">
                                                <a id="BtnTransferData" href='#' class="iconButton" style="margin-top: 0px; margin-left: 0px;">
                                                    <i class="fa fa-forword fa-2x fa-fw" style="font-size: 14px;"></i>&nbsp Apply All
                                                </a>
                                            </div>
                                        </div>
                                    </div>--%>

                                </div>
                                <div class="row clearfix" style="padding: 0px; margin: 0px;">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="padding-top: 0px; margin-top: 0px">
                                        <div id="AutoLoadList1Grid"></div>
                                    </div>

                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="padding-top: 0px; margin-top: 0px">
                                        <%--<label style="float: left; width: 100%;">Rate Setting Done..</label>--%>
                                        <div id="AlocatedList2Grid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="text" id="TxtExistid" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/VendorWiseRateSetting.js"></script>
</asp:Content>

