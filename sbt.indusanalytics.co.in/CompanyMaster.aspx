<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="CompanyMaster.aspx.vb" Inherits="NewCompany" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <input type="button" name="btnEdit" id="EditButton" class="btn btn-info" value="Edit Details" />
                    <strong class="MasterDisplayName" style="float: right; color: #42909A">Company Profile</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: calc(100vh - 85px); overflow-y: auto">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="CompanyGrid" style="width: 100%; min-height: 100%; float: left;"></div>
                        <input type="text" id="TxtCompanyID" style="display: none" />
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
                    <strong id="poptag">New Company Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding: 0px 5px 0px 5px;">
                    <div id="FieldCntainerRow" class="rowcontents clearfix" style="padding-top: 10px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ProcessMasterFieldCreation">

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Company Name</label>
                                    <input type="text" id="TxtCompanyName" class="forTextBox" />
                                    <div><strong id="ValStrTxtCompanyName" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Country</label>
                                    <div id="ddlCountry"></div>
                                    <div><strong id="ValStrddlCountry" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>State</label>
                                    <div id="ddlState"></div>
                                    <div><strong id="ValStrddlState" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>City</label>
                                    <div id="ddlCity"></div>
                                    <div><strong id="ValStrddlCity" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Pin/Zip Code</label>
                                    <div id="ddlPinCode"></div>
                                    <div><strong id="ValStrddlPinCode" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Phone</label>
                                    <input type="number" id="TxtPhone_1" class="forTextBox" disabled />
                                    <div><strong id="ValStrTxtPhone_1" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Fax</label>
                                    <input type="text" id="TxtFax" class="forTextBox" />
                                    <div><strong id="ValStrTxtFax" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>


                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Email</label>
                                    <input type="text" id="TxtEmail" class="forTextBox" onchange="EmailValidation(this)" disabled />
                                    <div><strong id="ValStrTxtEmail" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Web</label>
                                    <input type="text" id="TxtWeb" class="forTextBox" />
                                    <div><strong id="ValStrTxtWeb" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>PAN</label>
                                    <input type="text" id="TxtPAN" class="forTextBox" />
                                    <div><strong id="ValStrTxtPAN" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>CIN</label>
                                    <input type="text" id="TxtCIN" class="forTextBox" />
                                    <div><strong id="ValStrTxtCIN" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>GSTIN</label>
                                    <input type="text" id="TxtGSTIN" class="forTextBox" />
                                    <div><strong id="ValStrTxtGSTIN" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 hidden">
                                    <label>Import Export Code</label>
                                    <input type="text" id="TxtImportExportCode" class="forTextBox" />
                                    <div><strong id="ValStrTxtImportExportCode" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label>Address</label>
                                    <textarea id="TxtAddress" class="forTextBox" style="margin-top: -1px; height: 6em;" rows="2" cols="2"></textarea>
                                    <div><strong id="ValStrTxtAddress" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 hidden">
                                    <label>Production Unit</label>
                                    <textarea id="TxtProductionuint" class="forTextBox" style="margin-top: -1px; height: 6em;" rows="3" cols="3"></textarea>
                                    <div><strong id="ValStrTxtProductionuint" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <%--Header Image For Quotation--%>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <img id="previewimgheader" style="width: 28em; height: 6em; border: 1px solid #42909A; border-radius: 6px; margin-top: .2em; padding: .2em; opacity: 1; filter: alpha(opacity=100);" />
                                    <input type="text" id="imgpathstringheaderimage" style="display: none" />
                                    <div style="height: 2.5em; width: 100%; margin-top: 15px; padding-left: 5px">
                                    <span>Picture Quotation Image</span>
                                        <input type="file" accept="image/*" id="headerimageupload" name="headerimage" onchange="headerimagepreview(this)" class="file_txt" style="background-color: rgba(0, 0, 0, 0.8); color: white; cursor: pointer" />
                                    </div>
                                </div>
                                <%--<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Currency Symbol</label>
                            <div id="ddlCurrencySymbol" ></div>
                            <div><strong id="ValStrddlCurrencySymbol" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Symbol Name</label>
                            <input type="text" id="TxtSymbolName" class="forTextBox" />
                            <div><strong id="ValStrTxtSymbolName" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Financial Year</label>
                            <div id="ddlFinancialYear" ></div>
                            <div><strong id="ValStrddlFinancialYear" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>From Date</label>
                            <div id="ddlFromDate" ></div>
                            <div><strong id="ValStrddlFromDate" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                           <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Phone 2</label>
                            <input type="number" id="TxtPhone_2" class="forTextBox" />
                            <div><strong id="ValStrTxtPhone_2" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>                  
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Mailing Address</label>
                            <textarea id="TxtMailingAddress" class="forTextBox" style="margin-top: -1px"></textarea>
                            <div><strong id="ValStrTxtMailingAddress" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Mailing Name</label>
                            <input type="text" id="TxtMailingName" class="forTextBox" />
                            <div><strong id="ValStrTxtMailingName" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>                       
                    </div>
                    
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>To Date</label>
                            <div id="ddlToDate" ></div>
                            <div><strong id="ValStrddlToDate" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>                       
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Factory Address</label>
                            <textarea id="TxtFactoryAddress" class="forTextBox" style="margin-top: -1px"></textarea>
                            <div><strong id="ValStrTxtFactoryAddress" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                            <label>Remark</label>
                            <textarea id="TxtRemark" class="forTextBox" style="margin-top: -1px"></textarea>
                            <div><strong id="ValStrTxtRemark" style="color: red; font-size: 12px; display: none"></strong></div>
                        </div>
                    </div>--%>
                                <%-- 
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 5px">
                            <fieldset>
                                <legend>Concerning Person:</legend>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Name</label>
                                    <input type="text" id="TxtName" class="forTextBox" />
                                    <div><strong id="ValStrTxtName" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Phone O</label>
                                    <input type="number" id="TxtPhoneO" class="forTextBox" />
                                    <div><strong id="ValStrTxtPhoneO" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Phone R</label>
                                    <input type="number" id="TxtPhoneR" class="forTextBox" />
                                    <div><strong id="ValStrTxtPhoneR" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Mobile No</label>
                                    <input type="number" id="TxtMobileNo" class="forTextBox" onchange="NumericWithPhone(this)"/>
                                    <div><strong id="ValStrTxtMobileNo" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Email</label>
                                    <input type="number" id="TxtConcernEmail" class="forTextBox"  onchange="NumericWithPhone(this)"/>
                                    <div><strong id="ValStrTxtConcernEmail" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12" style="padding-top:0px;padding-bottom:0px;margin-top:0px;margin-bottom:0px">
                                    <label>Address</label>
                                    <textarea id="TxtConcernAddress" class="forTextBox" style="margin-top: -1px"></textarea>
                                    <div><strong id="ValStrTxtConcernAddress" style="color: red; font-size: 12px; display: none"></strong></div>
                                </div>
                            </fieldset>
                        </div>
                    </div>--%>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="SaveButton" class="btn btn-success waves-effect" style="margin-top: -1em">Save</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/AllValidation.js"></script>
    <script src="CustomJS/NewCompany.js"></script>
</asp:Content>

