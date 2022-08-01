<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProcessMaster.aspx.vb" Inherits="ProcessMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix padding-0 margin-0">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="background-color: #fff; padding-left: 0px; padding-bottom: 2px">

                    <button type="button" id="CreateButton" class="btn btn-primary btn-sm waves-effect">Create</button>
                    <button type="button" id="EditButton" class="btn btn-info btn-sm waves-effect">Edit</button>
                    <button type="button" id="DeleteButton" class="btn btn-danger btn-sm waves-effect">Delete</button>

                    <strong id="ProcessMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Process Master</strong>

                </div>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                    <div id="ProcessMasterGrid"></div>
                    <input type="text" id="ProtxtGetGridRow" style="display: none" />
                    <input type="text" id="txtProcessID" style="display: none" />
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document" <%--style="width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px"--%>>
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Process Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="padding: 5px 5px 0px 20px;">
                    <div class="rowcontents clearfix">
                        <div style="-webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                            <ul id="ProcessTabDiv" class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none">
                                <li role='presentation' class="active"><a id="AnchorProcessMasterFieldCreation" href="#ProcessMasterFieldCreation" data-toggle='tab' style='background-color: none;'>Process Detail</a></li>
                                <li role='presentation' ><a id="AnchorProcessMasterSlab" href="#ProcessMasterSlab" data-toggle='tab' style='background-color: none;'>Slab</a></li>
                                <li role='presentation'><a id="AnchorProcessMasterMachineAllocation" href="#ProcessMasterMachineAllocation" data-toggle='tab' style='background-color: none;'>Machine Allocation</a></li>
                                <%--<li role='presentation'><a id="AnchorProcessMasterContentAllocation" href="#ProcessMasterContentAllocation" data-toggle='tab' style='background-color: none;'>Content Allocation</a></li>--%>
                                <%--<li role='presentation'><a id="AnchorProcessMasterMaterial" href="#ProcessMasterMaterial" data-toggle='tab' style='background-color: none;'>Material Allocation</a></li>--%>
                            </ul>
                        </div>
                    </div>
                    <div id="FieldCntainerRow" class="rowcontents clearfix p-t-5">
                        <div class="tab-content padding-0 margin-0">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="ProcessMasterFieldCreation">
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Process Name</label>
                                    <input id="txtProcessName" type="text" class="forTextBox" />
                                    <%--onchange=' + chngevt + '--%>
                                    <div style="float: left; width: 100%"><strong id="ValStrProcessName" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Display Name</label>
                                    <input id="txtDisplayName" type="text" class="forTextBox" />
                                    <div style="float: left; width: 100%"><strong id="ValStrDisplayName" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Under Department</label>
                                    <div id="selUnderDepartment"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrUnderDepartment" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Type Of Charges</label>
                                    <div id="selTypeOfCharges"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrTypeOfCharges" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div id="DivChargesApplicable" class="col-lg-3 col-md-3 col-sm-3 col-xs-12" style="float: left; margin-bottom: 0px; display: none">
                                    <label class="font-11">Charges Applicable</label>
                                    <div id="selChargesApplicable"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrChargesApplicable" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Size Considered</label>
                                    <div id="selSizeConsidered"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrSizeConsidered" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Pree/Post</label>
                                    <div id="selPreePost"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrPreePost" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Start Unit</label>
                                    <div id="selStartUnit"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrStartUnit" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">End Unit</label>
                                    <div id="selEndUnit"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrEndUnit" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Unit Conversion</label>
                                    <div id="selUnitConversion"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrUnitConversion" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Rate</label>
                                    <input id="txtRate" type="number" class="forTextBox" onchange="validateDecimal(this)" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtRate" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Minimum Charges</label>
                                    <input id="txtMinimumCharges" type="number" class="forTextBox" onchange="validateDecimal(this)" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrMinimumCharges" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Make Setup Charges</label>
                                    <input id="txtMakeSetupCharges" type="number" class="forTextBox" onchange="validateDecimal(this)" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrMakeSetupCharges" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <br />
                                    <input type="checkbox" id="chkDisplayInQuotation" class="filled-in chk-col-red" /><label for="chkDisplayInQuotation">Display In Quotation</label>
                                    <div style="float: left; width: 100%"><strong id="ValStrDisplayInQuotation" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12 hidden">
                                    <label for="selProcessPurpose" class="font-11">Process Purpose</label>
                                    <div id="selProcessPurpose"></div>
                                    <div style="float: left; width: 100%"><strong id="ValStrProcessPurpose" style="color: red; font-size: 10px; display: block"></strong></div>
                                </div>

                                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                    <label for="OptionProductions" class="font-11">Process Used As</label>
                                    <div id="OptionProductions"></div>
                                </div>

                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterMachineAllocation">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <label class="font-11">Machine Allocation</label>
                                    <div id="GridMachineAllocation"></div>
                                    <textarea id="MachineId" style="display: none;">null</textarea>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterContentAllocation">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div style="float: left; width: 100%; height: auto">
                                        <label class="font-11">Content Allocation</label>
                                    </div>
                                    <div style="float: left; width: 100%; height: auto">
                                        <div id="GridContentAllocation" style="float: left; width: 100%; max-height: calc(100vh - 241px); overflow-y: auto"></div>
                                        <textarea id="ContentId" style="display: none;">null</textarea>
                                    </div>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterSlab">
                                <%--<label class="font-12">Slab Qty.</label>--%>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Sheet From</label>
                                    <input id="txtSheetFrom" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtSheetFrom" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Sheet To</label>
                                    <input id="txtSheetTo" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtSheetTo" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Start Unit</label>
                                    <input id="txtStartUnit" type="text" class="forTextBox" placeholder="Enter Start Unit" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtStartUnit" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Factor Name</label>
                                    <input id="txtFactorName" type="text" class="forTextBox" placeholder="Enter Factor Name" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtFactorName" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-6 p-r-0">
                                    <label class="font-11">Rate</label>
                                    <input id="txtFactorRate" type="number" onchange="validateDecimal(this)" class="forTextBox" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtFactorRate" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                                    <label class="font-11">Min.Charge</label>
                                    <input id="txtMinCharge" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <div style="float: left; width: 100%"><strong id="ValStrtxtMinCharge" style="color: red; font-size: 10px; display: none"></strong></div>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-4 col-xs-12">
                                    <br class="hidden-xs hidden-sm"/>
                                    <input type="button" name="btnAddColumn" value="Add Slab" class="btn btn-primary" id="btnAddColumn"  />
                                </div>
                                <%--<input id="txtAddColumn" type="text" class="forTextBox" placeholder="Enter Slab Factor Name" style="float: right; width: 200px" />--%>

                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="GridSlab"></div>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="ProcessMasterMaterial">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <label class="font-11">Material Allocation</label>
                                    <div id="GridMaterial"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer">
                    <button type="button" id="BtnNew" class="btn btn-primary waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ProcessMaster.js"></script>
    <script src="CustomJS/AllValidation.js"></script>
</asp:Content>

