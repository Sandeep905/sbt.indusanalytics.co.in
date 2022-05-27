<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="CategoryMaster.aspx.vb" Inherits="CategoryMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <button type="button" id="CreateButton" class="btn btn-primary btn-sm waves-effect">Create</button>
                    <button type="button" id="EditButton" class="btn btn-info btn-sm waves-effect">Edit</button>
                    <button type="button" id="DeleteButton" class="btn btn-danger btn-sm waves-effect">Delete</button>
                    <b id="CategoryID" style="display: none"></b><b id="CategoryDisName" style="display: none"></b>
                    <strong id="CategoryMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Category Master</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="CategoryGrid"></div>
                        <input type="text" id="TxtCategoryID" style="display: none" />
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
                    <strong id="poptag">Category Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="row clearfix">
                        <ul class="nav nav-tabs tab-col-red m-b-5" role="tablist" style="color: green; border: none;">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRow" href="#ProcessMasterFieldCreation" data-toggle='tab' style='background-color: none;'>Category Field</a></li>
                            <li role='presentation'><a id="AnchorProcessMasterContentAllocation" href="#ProcessMasterContentAllocation" data-toggle='tab' style='background-color: none;'>Content Allocation</a></li>
                            <li role='presentation'><a id="AnchorProcessMasterProcessAllocation" href="#ProcessMasterProcessAllocation" data-toggle='tab' style='background-color: none;'>Process Allocation</a></li>
                        </ul>
                    </div>
                    <div id="FieldCntainerRow" class="row clearfix">
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ProcessMasterFieldCreation">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <b class="font-11">Category Name</b>
                                    <input id="CategoryName" type="text" class="forTextBox" />
                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCategoryName" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <b class="font-11">Orientation</b>
                                    <div id="SelectBoxOrientation"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrSelectBoxOrientation" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterContentAllocation">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">All Contents</b>
                                    <div id="GridContents"></div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">Allocated Contents</b>
                                    <div id="GridContentAllocation"></div>
                                    <textarea id="ContentId" style="display: none;">null</textarea>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterProcessAllocation">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">All Process</b>
                                    <div id="GridProcess"></div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <b class="font-11">Allocated Process</b>
                                    <div id="GridProcessAllocation"></div>
                                    <textarea id="ProcessId" style="display: none;">null</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-primary waves-effect">New</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                </div>
            </div>
        </div>
    </div>



    <script src="CustomJS/CategoryMaster.js"></script>
</asp:Content>

