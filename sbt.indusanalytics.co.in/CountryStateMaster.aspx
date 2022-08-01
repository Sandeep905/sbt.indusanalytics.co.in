<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="CountryStateMaster.aspx.vb" Inherits="CountryStateMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <input type="button" name="btnCreate" class="btn btn-primary" value="Create" id="CreateButton" />
                        <input type="button" name="EditButton" class="btn btn-secondary" value="Edit" id="EditButton" />
                        <input type="button" name="DeleteButton" class="btn btn-danger" value="Delete" id="DeleteButton" />                        
                    </div>
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Country State Master</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="CountryStateMasterGrid" style="width: 100%; min-height: 100%; float: left; height: calc(100vh - 85px); overflow-y: auto"></div>
                        <input type="text" id="CountryStateMasterGridRow" style="display: none" />
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
                    <strong id="poptag">Country State Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent" style="display: block; padding-top: 0px; padding-right: 0px;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldCntainerRow" href="#FieldCntainerRow" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                        </ul>
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div id="FieldCntainerRow" role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">Country</label>
                                    <div id="SelectBoxCountry"></div>
                                    <strong id="ValStrSelectBoxCountry" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">State</label>
                                    <div id="SelectBoxState"></div>
                                    <strong id="ValStrSelectBoxState" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">City</label>
                                    <div id="SelectBoxCity"></div>
                                    <strong id="ValStrSelectBoxCity" style="color: red; font-size: 12px; display: none"></strong>
                                </div>

                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">State Tin No : </label>
                                    <input id="textStateTinNo" type="text" class="forTextBox" />
                                    <strong id="ValOfStateTinNo" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">State Code : </label>
                                    <input id="textStateCode" type="text" class="forTextBox" />
                                    <strong id="ValOfStateCode" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11">Country Code : </label>
                                    <input id="textCountryCode" type="text" class="forTextBox" />
                                    <strong id="ValOfCountryCode" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em" disabled="disabled">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em" disabled="disabled">Save As</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/CountryStateMaster.js"></script>
</asp:Content>

