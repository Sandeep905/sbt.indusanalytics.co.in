<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="MachineMaster.aspx.vb" Inherits="MachineMaster" %>

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
                    <button type="button" id="ItemSubGroupAlloButton" class="btn myButton btn-sm waves-effect hidden">Item Sub Group Allocation</button>

                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Machine Masters</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="MachineGrid" style="width: 100%; min-height: 100%; float: left; height: calc(100vh - 85px); overflow-y: auto"></div>
                        <input type="text" id="MachineGetGridRow" style="display: none" />
                        <input type="text" id="Machineid" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade m-l--5" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Machine Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: block">
                        <li role='presentation' class="active"><a id="AnchorMachineMasterFieldArea" href="#MachineMasterFieldArea" data-toggle='tab' style='background-color: none;'>Input Fields</a></li>
                        <li role='presentation'><a id="AnchorMachineMasterSlabGrid" href="#MachineMasterSlabGrid" data-toggle='tab' style='background-color: none;'>Input Slab Fields</a></li>
                        <li role='presentation'><a id="AnchorMachineMasterCoatingSlabGrid" href="#MachineMasterCoatingSlabGrid" data-toggle='tab' style='background-color: none; display: none;'>Coating Rate Slabs</a></li>
                    </ul>

                    <div class="rowcontents clearfix" id="popContenerContent" style="display: block;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="MachineMasterFieldArea">
                                <div class="rowcontents clearfix" style="padding-top: 10px;">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <label class="font-11">Machine Name</label>
                                            <input id="MachineName" type="text" class="forTextBox" />
                                            <strong id="ValStrMachineName" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <label class="font-11">Under Department</label>
                                            <div id="UnderDepartment"></div>
                                            <strong id="ValStrUnderDepartment" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                        <div id="SelectBoxMachineTypeDiv" class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <label class="font-11">Machine Type</label>
                                            <div id="SelectBoxMachineType"></div>
                                            <strong id="ValStrSelectBoxMachineType" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 p-r-0">
                                            <label class="font-11">Gripper (MM)</label>
                                            <input id="Griper" type="text" class="forTextBox convertsize" value="0" onchange="Numeric(this);" />
                                            <strong id="ValStrGriper" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                        <div id="PrintingMarginDiv" class="col-lg-3 col-md-3 col-sm-3 col-xs-6 p-r-0 hidden">
                                            <label class="font-11">Printing Margin (MM)</label>
                                            <input id="PrintingMargin" type="text" class="forTextBox convertsize" onchange="Numeric(this);" value="0" />
                                            <strong id="ValStrPrintingMargin" style="color: red; font-size: 12px; display: none"></strong>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                        <%--Box-----%>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                                <div id="PaperAreaFirst" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sizeFields" style="margin-bottom: 0px">
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin: 0px; padding: 0px;">
                                                        <label style="float: left; width: 100%; margin-left: -10px">Paper Area (MM) :-</label>
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-right: 1px">
                                                        <label class="font-11">Min.W</label>
                                                        <input id="TxtMinimumWidth" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px; padding-right: 1px">
                                                        <label class="font-11">Max.W</label>
                                                        <input id="TxtMaximumWidthh" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px; padding-right: 1px">
                                                        <label class="font-11">Min.L</label>
                                                        <input id="TxtMinimumLength" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px">
                                                        <label class="font-11">Max.L</label>
                                                        <input id="TxtMaximumLength" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                </div>

                                                <div id="ReeltoSheetCuttingdiv" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sizeFields" style="display: none; margin-bottom: 0px">
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin: 0px; padding: 0px;">
                                                        <label style="float: left; width: 100%; margin-left: -10px">Paper Area (MM) :-</label>
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-right: 1px">
                                                        <label class="font-11">Reel Size Max</label>
                                                        <input id="TxtReelSizeMaxcutting" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px; padding-right: 1px">
                                                        <label class="font-11">Min</label>
                                                        <input id="TxtReelSizeMincutting" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px; padding-right: 1px">
                                                        <label class="font-11">Cut of Max</label>
                                                        <input id="TxtReelSizeCutofmaxcutting" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="float: left; margin: 0px; padding: 0px; padding-left: 1px">
                                                        <label class="font-11">Min</label>
                                                        <input id="TxtReelSizeCutofMincutting" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                </div>

                                                <div id="PaperAreaForWebOffSet" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sizeFields" style="display: none; margin-bottom: 0px">
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin: 0px; padding: 0px;">
                                                        <label style="float: left; width: 100%; margin-left: -10px">Paper Area (MM) :-</label>
                                                    </div>
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="float: left; margin: 0px; padding: 0px; padding-right: 1px">
                                                        <label class="font-11">Reel Size Max</label>
                                                        <input id="TxtReelSizeMax" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="float: left; margin: 0px; padding: 0px; padding-left: 1px; padding-right: 1px">
                                                        <label class="font-11">Min</label>
                                                        <input id="TxtReelSizeMin" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="float: left; margin: 0px; padding: 0px; padding-left: 1px">
                                                        <label class="font-11">Cut Off</label>
                                                        <input id="TxtReelSizeCutOff" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                </div>

                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden" style="min-height: 20px;">
                                                    <strong id="ValStrTxtMinimumWidth" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtMinimumLength" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtMaximumWidthh" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtMaximumLength" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeMaxcutting" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeMincutting" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeCutofmaxcutting" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeCutofMincutting" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeMax" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeMin" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                    <strong id="ValStrTxtReelSizeCutOff" style="color: red; font-size: 12px; display: none; word-break: break-word"></strong>
                                                </div>
                                            </div>
                                            <%--LastBox--%>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="float: left; margin: 0px; padding: 0px;">
                                                <div id="PlateSize" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sizeFields" style="display: none;">
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="float: left; margin: 0px; padding: 0px;">
                                                        <label style="float: left; width: 100%; margin-left: -10px">Plate Size (MM) :-</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin: 0px; padding: 0px; padding-right: 3px">
                                                        <label class="font-11">Width</label>
                                                        <input id="TxtPlateSizeWidth" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="float: left; margin: 0px; padding: 0px; padding-left: 3px">
                                                        <label class="font-11">Length</label>
                                                        <input id="TxtPlateSizeLength" type="text" class="forTextBox convertsize" onchange="Decimal(this);" value="0" />
                                                    </div>

                                                    <div style="min-height: 20px; float: left; width: 100%; margin-left: 15px">
                                                        <strong id="ValStrTxtPlateSizeWidth" style="color: red; font-size: 12px; display: none"></strong>
                                                        <strong id="ValStrTxtPlateSizeLength" style="color: red; font-size: 12px; display: none"></strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div class="rowcontents clearfix" style="padding-top: 0px;">

                                    <div id="ColorsDiv" class="col-lg-2 col-md-2 col-sm-2 col-xs-4">
                                        <label class="font-11">Colors</label>
                                        <input id="Colors" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrColors" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-8">
                                        <label class="font-11">Make Ready Charges</label>
                                        <input id="MakeReadyCharges" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrMakeReadyCharges" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 p-r-0">
                                        <label class="font-11">Make Ready Wastage Sheet</label>
                                        <input id="MakeReadyWastageSheet" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrMakeReadyWastageSheet" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 p-r-0">
                                        <label class="font-11">Make Ready Time (Minute/Color)</label>
                                        <input id="TxtMakeReadyTime" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtMakeReadyTime" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 p-r-0">
                                        <label class="font-11">Job Change Over Time (Minute)</label>
                                        <input id="TxtJobChargeOverTime" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtJobChargeOverTime" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 p-r-0">
                                        <label class="font-11">Speed (Impressions/Minute)</label>
                                        <input id="TxtImpressionsperMinute" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtImpressionsperMinute" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 p-r-0 hidden">
                                        <label class="font-11">Electric Consumption (U./Mi.)</label>
                                        <input id="TxtElectricCon" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtElectricCon" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6 p-r-0 hidden">
                                        <label for="TxtCostPerHour" class="font-11">Cost Per Hour</label>
                                        <input id="TxtCostPerHour" type="text" class="forTextBox" style="width: 100%" onchange="Numeric(this);" value="0" />
                                        <%-- <a id="BtnPerHrsCoast" href='#' class="iconButton" style="margin-top: 1px; margin-left: 5px;">
                                    <i class="fa fa-eye" style="height: 18px;"></i>
                                    &nbsp Per Hour Cost
                                </a>--%>

                                        <strong id="ValStrTxtCostPerHour" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Associate Partner</label>
                                        <div id="SelectBoxVendor"></div>
                                        <strong id="ValStrSelectBoxVendor" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                </div>

                                <div class="rowcontents clearfix" id="ForPrintingDepartmrnt">
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Min. Printing Impr. To Be Charged</label>
                                        <input id="TxtMiniPrinting" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtMiniPrinting" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Basic Printing Charged</label>
                                        <input id="TxtBasicPrintingCharged" type="text" class="forTextBox" onchange="Numeric(this);" value="0" />
                                        <strong id="ValStrTxtBasicPrintingCharged" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Round Of Impressions With</label>
                                        <input id="TxtRoundofImpressionsWith" type="number" class="forTextBox" onchange="syncr()" min="0" />
                                        <strong id="ValStrTxtRoundofImpressionsWith" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Type Of Charges</label>
                                        <div id="SelectBoxTypeOfCharges"></div>
                                        <strong id="ValStrSelectBoxTypeOfCharges" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Wastage Type</label>
                                        <div id="SelectBoxWastagetype"></div>
                                        <strong id="ValStrSelectBoxWastagetype" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <label class="font-11">Wastage Calculation On</label>
                                        <div id="SelectBoxWastageCalculationOn"></div>
                                        <strong id="ValStrSelectBoxWastageCalculationOn" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                        <br class="hidden-xs" />
                                        <input type="checkbox" id="IsPlanningMachine" class="filled-in chk-col-red" />
                                        <label for="IsPlanningMachine" class="font-11">Is Planning Machine ?</label>
                                        <strong id="ValStrIsPlanningMachine" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>

                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                        <br class="hidden-xs" />
                                        <input type="checkbox" id="IsPerFectAMachine" class="filled-in chk-col-red" />
                                        <label for="IsPerFectAMachine" class="font-11">Is Perfecta Machine ?</label>
                                        <strong id="ValStrIsPerFectAMachine" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                        <br class="hidden-xs" />
                                        <input type="checkbox" id="IsSpecialMachine" class="filled-in chk-col-red" />
                                        <label for="IsSpecialMachine" class="font-11">Is Special Machine ?</label>
                                        <strong id="ValStrIsSpecialMachine" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                </div>

                            </div>
                            <div role="tabpanel" class="tab-pane animated fadeInRight" id="MachineMasterSlabGrid">
                                <div id="sLABdIV" class="rowcontents clearfix" style="padding-top: 0px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <strong style="float: left; color: green; margin-top: 10px">Slabs for various quantities.As per selected type of charges </strong>
                                        <div id="MachineGridSlab" style="float: left; width: 100%; margin-bottom: 1em"></div>
                                    </div>
                                </div>
                            </div>

                            <div role="tabpanel" class="tab-pane animated fadeInRight p-t-10" id="MachineMasterCoatingSlabGrid">
                                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <label class="font-11">Coating Name</label>
                                    <div id="SelectBoxCoatingName"></div>
                                    <strong id="ValStrSelectBoxCoatingName" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Sheet From</label>
                                    <input id="txtSheetFrom" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <strong id="ValStrtxtSheetFrom" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Sheet To</label>
                                    <input id="txtSheetTo" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <strong id="ValStrtxtSheetTo" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <label class="font-11">Rate Type</label>
                                    <div id="SelectBoxRateType"></div>
                                    <strong id="ValStrSelectBoxRateType" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12">
                                    <label class="font-11">Rate</label>
                                    <input id="txtRate" type="number" onchange="Numeric(this)" class="forTextBox" min="0" />
                                    <strong id="ValStrtxtRate" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12">
                                    <label class="font-11">Min.Charge</label>
                                    <input id="txtMinCharg" type="number" onchange="ZipCodeNumeric(this)" class="forTextBox" min="0" />
                                    <strong id="ValStrtxtMinCharg" style="color: red; font-size: 10px; display: none"></strong>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <br />
                                    <button type="button" id="btnAddColumn" class="btn myButton">Add </button>
                                </div>
                                <%-- <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                    <input id="txtAddColumn" type="text" class="forTextBox" placeholder="Enter coating name" style="width: 200px" />
                                    <button type="button" id="btnAddColumn" class="btn myButton">Add </button>
                                </div>--%>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="MachineGridCoatingSlabs"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-primary waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <%--ItemSubGroupAllocation Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="ItemSubGroupAllocation" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="MachineAllocationtag">Item Sub Group Allocation Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="MachineAllocationContenerContent" style="display: block;">
                        <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                            <li role='presentation' class="active"><a id="AnchorFieldMachineAllocation" href="#FieldMachineAllocation" data-toggle='tab' style='background-color: none;'>Text Field</a></li>
                            <li role='presentation' class="active" id="GridLITabMachineAllocation"><a id="AnchorDivMachineAllocation" href="#DivMachineAllocation" data-toggle='tab' style='background-color: none;'></a></li>
                        </ul>
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div id="FieldMachineAllocation" role="tabpanel" class="col-lg-3 col-md-3 col-sm-5 col-xs-12 tab-pane animated fadeInRight active">
                                <label class="font-11">Machine Name</label>
                                <div id="SelMachineName"></div>
                                <strong id="ValStrSelMachineName" style="color: red; font-size: 10px; display: block"></strong>
                            </div>

                            <div id="DivMachineAllocation" role="tabpanel" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div id="GridItemGoupAllocation"></div>
                                <textarea id="TxtItemGroupNameID" style="display: none;">null</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="MachineAllocationbtnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="ItemGroupAllocationBtnNew" class="btn btn-primary waves-effect">New</button>
                    <button type="button" id="ItemGroupAllocationBtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="ItemGroupAllocationBtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/AllValidation.js"></script>
    <script src="CustomJS/MachineMaster.js"></script>


    <script>
        var n1;

        function syncr() {
            n1 = document.getElementById('TxtRoundofImpressionsWith').value;
            // aa = "Impressions" + "/" + n1 + "/" + "Color";
            $("#SelectBoxTypeOfCharges").dxSelectBox({
                items: ["Impressions", "Impressions" + "/" + n1, "Impressions/color", "Impressions" + "/" + n1 + "/" + "Color"],
                width: 190,
                placeholder: "Select Type of Charges",
                showClearButton: true
            });
        }


        $("#SelectBoxTypeOfCharges").dxSelectBox({
            items: ["Impressions", "Impressions" + "/" + n1, "Impressions/color", "Impressions" + "/" + n1 + "/" + "Color"],
            placeholder: "Select Type of Charges",
            showClearButton: true
        });
        $("#SelectBoxWastageCalculationOn").dxSelectBox({
            items: ["Per Color", "Flat"],
            placeholder: "Select Wastage Calculation on",
            showClearButton: true
        });

    </script>
</asp:Content>

