<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="UserSignUp.aspx.vb" Inherits="UserSignUp" %>

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
                        <a id="DeleteButton" href='#' class="iconButton" style="margin-top: 1px; margin-left: 2px;">
                            <img src="images/MasterDelete.png" style="height: 20px; width: 25px; float: left; margin-top: 0px" />
                            &nbsp Delete
                        </a>
                    </div>
                    <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">User Masters</strong>

                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="UserGrid" style="width: 100%; min-height: 100%; float: left; height: calc(100vh - 85px); overflow-y: auto"></div>
                        <input type="text" id="UserGetGridRow" style="display: none" />
                        <input type="text" id="Userid" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" <%--style="width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px"--%>>
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">User Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 0px">
                    <div class="rowcontents clearfix" style="height: auto; margin-left: 0px; padding-left: 0px;">
                        <div id="ProcessTabDiv" style="padding-bottom: .5em; padding-left: 5px; height: auto; margin-top: 0px; background-color: #fff; -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                            <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none">
                                <li id="ProfileTab" role='presentation' class="active"><a id="AnchorUserProfile" href="#UserProfile" data-toggle='tab' style='background-color: none;'>User Profile</a></li>
                                <li id="ChangePassTab" role='presentation'><a id="AnchorUserMasterChangePass" href="#UserMasterChangePass" data-toggle='tab' style='background-color: none;'>Change Password</a></li>
                            </ul>
                        </div>
                    </div>

                    <div id="popContenerContent" style="display: block; padding-top: 0px; padding-right: 0px; padding-left: 15px">
                        <div class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 165px); overflow-y: auto">
                            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="float: left; margin-bottom: 8px;">
                                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 0px; border: none;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px; text-align: center; border-bottom: 1px solid #42909A; padding: 0px; margin: 0px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="background-image: url(images/ProfileBackground.png); background-repeat: no-repeat;">
                                            <img id="recentimg" style="width: 13em; height: 14em; border: 1px solid #42909A; border-radius: 6px; margin-top: .2em; padding: .2em;opacity: 1;filter: alpha(opacity=100);" />
                                            <input type="text" id="imgpathstring" style="display: none" />
                                            <input type="text" id="imgpathstringDatabase" style="display: none" />
                                            <div style="height: 2.5em; width: 100%; margin-top: 15px; padding-left: 5px">
                                                <input type="file" id="fotoupload" onchange="imagepreview(this)" class="file_txt" style="background-color: rgba(0, 0, 0, 0.8);color:white;cursor:pointer"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px; border-bottom: 1px solid #42909A; padding-left: 5px; margin-bottom: 10px">
                                        <div style="float: left; height: auto; width: 100%; padding-top: 10px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">Name</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblName" style="float: left; width: 100%;"></label>
                                            </div>
                                        </div>

                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">Under User</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblUnderUser" style="float: left; width: 100%;"></label>
                                            </div>
                                        </div>

                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">Email</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblEmail" style="float: left; width: 100%;"></label>
                                            </div>

                                        </div>
                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">City</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblCity" style="float: left; width: 100%;"></label>
                                            </div>

                                        </div>
                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">State</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblState" style="float: left; width: 100%;"></label>
                                            </div>

                                        </div>
                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">Country</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblCountry" style="float: left; width: 100%;"></label>
                                            </div>

                                        </div>
                                        <div style="float: left; height: auto; width: 100%; padding-top: 5px; padding-bottom: 5px">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label style="float: left; width: 100%;">Mob.No.</label>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin-bottom: 0px; padding: 0px; margin: 0px">
                                                <label id="LblMobNo" style="float: left; width: 100%;"></label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12" style="float: left; margin-bottom: 0px;">
                                <div class="tab-content" style="margin-bottom: 0em">
                                    <div id="UserProfile" role="tabpanel" class="tab-pane animated fadeInRight active" style="float: left; width: 100%; padding-left: 0px; padding-right: 0px">

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">User Name</label>
                                            <br />
                                            <input id="UserName" type="text" class="forTextBox" onchange="ChangeEvent(this)" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrUserName" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Password</label>
                                            <br />
                                            <input id="Password" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Re Type Password</label>
                                            <br />
                                            <input id="REPassword" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrREPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Contact No.</label>
                                            <br />
                                            <input id="ContactNO" type="text" class="forTextBox" maxlength="10" onchange="ChangeEvent(this)" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrContactNO" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Under User</label>
                                            <br />
                                            <div id="SelectBoxUnderUser" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxUnderUser" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Designation</label>
                                            <br />
                                            <div id="SelectBoxDesignation" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxDesignation" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Email ID</label>
                                            <br />
                                            <input id="EmailID" type="email" class="forTextBox" onchange="ChangeEvent(this)" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrEmailID" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Country</label>
                                            <br />
                                            <div id="SelectBoxCountry" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxCountry" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">State</label>
                                            <br />
                                            <div id="SelectBoxState" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxState" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">City</label>
                                            <br />
                                            <div id="SelectBoxCity" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxCity" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP User Name</label>
                                            <br />
                                            <input id="SMTPUserName" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPUserName" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP Password</label>
                                            <br />
                                            <input id="SMTPPassword" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Re Type Password</label>
                                            <br />
                                            <input id="RESMTPPassword" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrRESMTPPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP Server</label>
                                            <br />
                                            <input id="SMTPServer" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPServer" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP Server Port</label>
                                            <br />
                                            <input id="SMTPServerPort" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSMTPServerPort" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP Authenticate</label>
                                            <br />
                                            <div id="SelectBoxSMTPAuthenticate" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxSMTPAuthenticate" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">SMTP UseSSL</label>
                                            <br />
                                            <div id="SelectBoxSMTPUseSSL" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxSMTPUseSSL" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">Details</label>
                                            <br />
                                            <textarea id="Details" class="forTextBox" style="margin-top: 0px;"></textarea><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrDetails" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <div style="float: left; width: 100%; height: auto">
                                                <input type="checkbox" id="CHKCreateuser" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKCreateuser" style="height: 20px">Is eligible to Create User</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKCreateuser" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                            <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                <input type="checkbox" id="CHKAdministrativeRights" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKAdministrativeRights" style="height: 20px">Is have Administrative Rights</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKAdministrativeRights" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <div style="float: left; width: 100%; height: auto">
                                                <input type="checkbox" id="CHKPaperIssue" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKPaperIssue" style="height: 20px">Is eligible extra Paper Issue</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKPaperIssue" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                            <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                <input type="checkbox" id="CHKAnotherPaper" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKAnotherPaper" style="height: 20px">Is choose Another Paper</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKAnotherPaper" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <div style="float: left; width: 100%; height: auto">
                                                <input type="checkbox" id="CHKSeeCost" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKSeeCost" style="height: 20px">Is user can't See Cost</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKSeeCost" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                            <div style="float: left; width: 100%; height: auto; margin-top: 10px">
                                                <input type="checkbox" id="CHKProductionDate" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKProductionDate" style="height: 20px">Is editable Production Date</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKProductionDate" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <div style="float: left; width: 100%; height: auto">
                                                <input type="checkbox" id="CHKHidden" class="filled-in chk-col-red" style="height: 20px" />
                                                <label for="CHKHidden" style="height: 20px">Is Hidden</label><br />
                                                <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrCHKHidden" style="color: red; font-size: 10px"></strong></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div role="tabpanel" class="tab-pane animated fadeInRight" id="UserMasterChangePass" style="float: left; width: 100%;">
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">New Password</label>
                                            <br />
                                            <input id="NewPassword" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrNewPassword" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px; padding-left: 5px; padding-right: 5px">
                                            <label style="float: left; width: 100%;">New Password Again</label>
                                            <br />
                                            <input id="NewPasswordAgain" type="text" class="forTextBox" /><br />
                                            <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrNewPasswordAgain" style="color: red; font-size: 12px; display: none"></strong></div>
                                        </div>

                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="float: left; margin-bottom: 0px;">
                                            <div class="DialogBoxCustom" style="float: left; box-shadow: none; background-color: #fff; padding-left: 0px; padding-bottom: 2px; border: none">
                                                <a id="SavePassword" href='#' class="iconButton" style="margin-top: 20px; margin-left: 2px;">
                                                    <img src="images/NewClient.png" style="height: 20px; width: 25px; float: left; margin-top: 0px;" />
                                                    &nbsp Reset
                                                </a>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect" style="margin-top: -1em; color: none">New</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect" style="margin-top: -1em">Delete</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-link waves-effect" style="margin-top: -1em" disabled="disabled">Save As</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>

        </div>
    </div>

    <script src="CustomJS/UserSignUp.js"></script>
</asp:Content>

