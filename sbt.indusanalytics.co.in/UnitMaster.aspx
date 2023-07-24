<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="UnitMaster.aspx.vb" Inherits="UnitMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <a id="CreateButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px">
                            <img src="images/NewClient.png" style="height: 20px; width: 25px; float: left; margin-top: 0px;" />
                            &nbsp Create
                        </a>
                        <a id="EditButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/Edit.png" style="height: 20px; width: 25px; float: left; margin-top: 0px" />
                            &nbsp Edit
                        </a>
                        <a id="DeleteButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/MasterDelete.png" style="height: 20px; width: 25px; float: left; margin-top: 0px" />
                            &nbsp Delete
                        </a>
                    </div>
                    <input type="button" class="btn btn-secondary" value="mail" id="Sendmail" />
                    <b id="CategoryID" style="display: none"></b><b id="CategoryDisName" style="display: none"></b>
                    <strong id="CategoryMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Unit Master</strong>
                </div>

                <div class="ContainerBoxCustom">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div id="UnitGrid"></div>
                        <input type="text" id="TxtUnitID" style="display: none" />
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
                    <strong id="poptag">Unit Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="rowcontents clearfix m-t-5">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11 m-b-0">Unit Name</label>
                                    <input id="UnitName" type="text" class="forTextBox" />
                                    <strong id="ValStrUnitName" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11 m-b-0">Unit Symbole</label>
                                    <input id="UnitSymbole" type="text" class="forTextBox" />
                                    <strong id="ValStrUnitSymbole" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11 m-b-0">Type</label>
                                    <div id="SelectBoxType"></div>
                                    <strong id="ValStrSelectBoxType" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11 m-b-0">Conversion Value</label>
                                    <input id="ConversionValue" type="number" class="forTextBox" min="0" value="0" />
                                    <strong id="ValStrConversionValue" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <label class="font-11 m-b-0">Decimal Place</label>
                                    <input id="DecimalPlace" type="number" class="forTextBox" min="0" value="0" />
                                    <strong id="ValStrDecimalPlace" style="color: red; font-size: 12px; display: none"></strong>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em" disabled="disabled">Save As</button>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/UnitMaster.js"></script>
</asp:Content>

