<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="EditProfile.aspx.vb" Inherits="EditProfile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix padding-0 margin-0">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <button type="button" id="CreateButton" class="btn btn-primary btn-sm waves-effect">Create</button>
                <button type="button" id="EditButton" class="btn btn-info btn-sm waves-effect">Edit</button>
                <button type="button" id="DeleteButton" class="btn btn-danger btn-sm waves-effect">Delete</button>
                <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">User Masters</strong>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                    <div id="UserGrid"></div>
                    <input type="text" id="UserGetGridRow" hidden style="display: none" />
                    <input type="text" id="Userid" hidden style="display: none" />
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">User Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="rowcontents clearfix">
                        <div id="ProcessTabDiv" style="-webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                            <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none">
                                <li id="ProfileTab" role='presentation' class="active"><a id="AnchorUserProfile" href="#UserProfile" data-toggle='tab' style='background-color: none;'>User Profile</a></li>
                                <li id="OperatorAllocationTab" role='presentation'><a id="AnchorOperatorAllocation" href="#ModuleOperatorAllocation" data-toggle='tab' style='background-color: none;'>Operator Allocation</a></li>
                                <li id="MailSettings" role='presentation'><a id="AnchorUserMasterMailSettings" href="#UserMasterMailSettings" data-toggle='tab' style='background-color: none;'>Quote Mail Settings</a></li>
                                <li id="ChangePassTab" role='presentation'><a id="AnchorUserMasterChangePass" href="#UserMasterChangePass" data-toggle='tab' style='background-color: none;'>Change Password</a></li>
                                <li id="ModuleAuthenticationTab" hidden role='presentation'><a id="AnchorModuleAuthentication" href="#ModuleAuthentication" data-toggle='tab' style='background-color: none;'>Module Authentication</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="rowcontents clearfix p-t-5">
                        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; border: none;">
                                <img id="recentimg" style="width: 18em; height: 23em; border: 1px solid #42909A; border-radius: 6px; margin-top: .2em; padding: .2em; opacity: 1; filter: alpha(opacity=100);" />
                                <input type="text" id="imgpathstring" style="display: none" />
                                <input type="text" id="imgpathstringDatabase" style="display: none" />
                                <div style="height: 2.5em; width: 100%; margin-top: 20px; padding-left: 5px">
                                    <input type="file" accept="image/*" id="fotoupload" name="profileimage" onchange="imagepreview(this)" class="file_txt" style="background-color: rgba(0, 0, 0, 0.8); color: white; cursor: pointer" />
                                </div>
                                <img id="recentimgsign" style="width: 18em; height: 5em; border: 1px solid #42909A; border-radius: 6px; margin-top: .2em; padding: .2em; opacity: 1; filter: alpha(opacity=100);" />
                                <input type="text" id="imgpathstringsign" style="display: none" />
                                <input type="text" id="imgpathstringDatabasesign" style="display: none" />
                                <div style="height: 2.5em; width: 100%; margin-top: 15px; padding-left: 5px">
                                    <input type="file" accept="image/*" id="signupload" name="signimage" onchange="imagesignpreview(this)" class="file_txt" style="background-color: rgba(0, 0, 0, 0.8); color: white; cursor: pointer" />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-9 col-md-9 col-sm-8 col-xs-12">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div id="UserProfile" role="tabpanel" class="tab-pane animated fadeInRight active" style="float: left; width: 100%; padding-left: 0px; padding-right: 0px">
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">User Name</label>
                                        <input id="UserName" type="text" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrUserName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Password</label>
                                        <input id="Password" type="password" class="forTextBox" disabled value="I am not editable" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Re Type Password</label>
                                        <input id="REPassword" type="password" class="forTextBox" disabled value="I am not editable" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrREPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Contact No.</label>
                                        <input id="ContactNO" type="text" class="forTextBox" maxlength="10" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrContactNO" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Under User</label>
                                        <div id="SelectBoxUnderUser"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxUnderUser" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Designation</label>
                                        <div id="SelectBoxDesignation"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxDesignation" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Email ID</label>
                                        <input id="EmailID" type="email" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrEmailID" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Country</label>
                                        <div id="SelectBoxCountry"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxCountry" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">State</label>
                                        <div id="SelectBoxState"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxState" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">City</label>
                                        <div id="SelectBoxCity"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxCity" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP User Name</label>
                                        <input id="SMTPUserName" type="text" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPUserName" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP Password</label>
                                        <input id="SMTPPassword" type="password" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Re Type Password</label>
                                        <input id="RESMTPPassword" type="password" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrRESMTPPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP Server</label>
                                        <input id="SMTPServer" type="text" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPServer" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP Server Port</label>
                                        <input id="SMTPServerPort" type="text" class="forTextBox" />
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPServerPort" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP Authenticate</label>
                                        <div id="SelectBoxSMTPAuthenticate"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxSMTPAuthenticate" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">SMTP UseSSL</label>
                                        <div id="SelectBoxSMTPUseSSL"></div>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxSMTPUseSSL" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                        <label class="font-11">Details</label>
                                        <textarea id="Details" class="forTextBox" style="margin-top: 0px;"></textarea>
                                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrDetails" style="color: red; font-size: 12px; display: none"></strong></div>
                                    </div>

                                    <%--<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" >
                                                <div style="float: left; width: 100%; height: auto">
                                                    <input type="checkbox" id="CHKCreateuser" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKCreateuser" style="height: 20px">Is eligible to Create User</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKCreateuser" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                                <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                    <input type="checkbox" id="CHKAdministrativeRights" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKAdministrativeRights" style="height: 20px">Is have Administrative Rights</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKAdministrativeRights" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" >
                                                <div style="float: left; width: 100%; height: auto">
                                                    <input type="checkbox" id="CHKPaperIssue" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKPaperIssue" style="height: 20px">Is eligible extra Paper Issue</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKPaperIssue" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                                <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                    <input type="checkbox" id="CHKAnotherPaper" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKAnotherPaper" style="height: 20px">Is choose Another Paper</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKAnotherPaper" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" >
                                                <div style="float: left; width: 100%; height: auto">
                                                    <input type="checkbox" id="CHKSeeCost" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKSeeCost" style="height: 20px">Is user can't See Cost</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKSeeCost" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                                <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                    <input type="checkbox" id="CHKProductionDate" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKProductionDate" style="height: 20px">Is editable Production Date</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKProductionDate" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                            </div>

                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" >
                                                <div style="float: left; width: 100%; height: auto">
                                                    <input type="checkbox" id="CHKHidden" class="filled-in chk-col-red" style="height: 20px" />
                                                    <label for="CHKHidden" style="height: 20px">Is Hidden</label>
                                                    <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKHidden" style="color: red; font-size: 10px"></strong></div>
                                                </div>
                                            </div>--%>
                                    <div class="modal-footer" style="border-top: 1px solid #42909A;">
                                        <button type="button" id="BtnNew" class="btn btn-primary waves-effect" style="color: none">New</button>
                                        <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect" style="">Delete</button>
                                        <button type="button" id="BtnSave" class="btn btn-success waves-effect" style="">Save</button>
                                        <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" style="" disabled="disabled">Save As</button>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane animated fadeInRight" id="UserMasterChangePass">
                                    <div class="dx-fieldset">
                                        <div class="dx-field">
                                            <div class="dx-field-label">New Password</div>
                                            <div class="dx-field-value">
                                                <div id="password1"></div>
                                            </div>
                                            <div style="min-height: 20px; float: left; width: 100%">
                                                <strong id="ValStrNewPassword" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>
                                        </div>
                                        <div class="dx-field">
                                            <div class="dx-field-label">New Password Again</div>
                                            <div class="dx-field-value">
                                                <div id="password2"></div>
                                            </div>
                                            <div style="min-height: 20px; float: left; width: 100%">
                                                <strong id="ValStrNewPasswordAgain" style="color: red; font-size: 12px; display: none"></strong>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                            <div class="DialogBoxCustom" style="float: left; box-shadow: none; background-color: #fff; padding-left: 0px; padding-bottom: 2px; border: none">
                                                <a id="SavePassword" href='#' class="iconButton" style="margin-top: 20px; margin-left: 2px;">
                                                    <img src="images/NewClient.png" style="height: 20px; width: 25px; float: left; margin-top: 0px;" />
                                                    &nbsp Reset
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div role="tabpanel" class="tab-pane animated fadeInRight" id="UserMasterMailSettings">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label class="font-11">Message</label>
                                        <textarea id="TxtMessage" class="forTextBox" style="height: 100%" rows="5"></textarea>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label class="font-11">Header Text</label>
                                        <textarea id="TxtEmailHeader" class="forTextBox" style="height: 100%" rows="6"></textarea>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label class="font-11">Footer Text</label>
                                        <textarea id="TxtEmailFooter" class="forTextBox" style="height: 100%" rows="6"></textarea>
                                    </div>
                                </div>

                                <div role="tabpanel" class="tab-pane animated fadeInRight" id="ModuleAuthentication">
                                    <div id="SupportSystemGrid"></div>
                                    <button type="button" id="btn-save" class="btn btn-success" title="Save user rights..">Update Rights</button>
                                </div>

                                <div role="tabpanel" class="tab-pane animated fadeInRight" id="ModuleOperatorAllocation">
                                    <div id="OperatorAllocationGrid"></div>
                                    <textarea id="TxtOperatorID" hidden="hidden"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/EditProfile.js"></script>
</asp:Content>

