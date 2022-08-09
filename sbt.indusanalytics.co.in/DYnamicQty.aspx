<%@ Page Title="Indus Estimo" Language="VB" MasterPageFile="~/IndusAnalytic.master" AutoEventWireup="false" CodeFile="DYnamicQty.aspx.vb" Inherits="DYnamicQty" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">

    <style>
        .HideColumn {
            display: none;
        }

        .stylImg {
            width: 8em;
            height: 8em;
        }

        .master-detail-caption {
            padding: 0 0 5px 10px;
            font-size: 12px;
            font-weight: bold;
        }

        .master-detail-label {
            font-size: 12px;
            float: right;
            pointer-events: painted;
            cursor: pointer;
        }

        .finalize {
            float: left;
            padding: 2px;
            width: 100%;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }

        .selected-finalize {
            float: left;
            padding: 2px;
            width: 100%;
            border-bottom: 1px solid #eee;
            background-color: red;
            color: white;
            cursor: not-allowed;
        }

        .custom-icon {
            max-height: 100%;
            max-width: 100%;
            font-size: 28px;
            display: inline-block;
            vertical-align: middle;
        }

        .flip-scale-up-hor {
            -webkit-animation: flip-scale-up-hor .5s linear both;
            animation: flip-scale-up-hor .5s linear both
        }

        .disabledbutton {
            pointer-events: none;
            opacity: 0.4;
        }

        div.sticky {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            padding: 1px;
            /*background-color: #cae8ca;
            border: 2px solid #4CAF50;*/
        }

        #PlanChartLayout {
            height: 300px;
        }

            #PlanChartLayout * {
                margin: 0 auto;
            }


        .btn-condensed.btn-condensed {
            padding: 0 5px;
            box-shadow: none;
        }


        /* use class to have a little animation */
        .hide-col {
            width: 0px !important;
            height: 0px !important;
            display: block !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }

        .customgridbtn {
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            padding-left: 25%;
        }

        .bg-svg {
            width: 100%;
            /*background-size: cover;*/
            height: auto;
            padding: 0; /* reset */
            /*padding-bottom: 92%;*/
            border: thin dotted darkgrey;
        }

        .iframeBottomTabBar {
            padding-right: 1px;
            height: 100% !important;
            margin-left: -31px;
            display: none;
        }
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="tooltip">
        <p id="tooltipText"></p>
    </div>
    <div class="row clearfix" style="padding: 0px; margin: 0px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainer">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff;">
                    <button type="button" id="Add_Quantity_Button" class="btn btn-secondary waves-effect">Add Quantity</button>
                    <button type="button" id="Add_Content_Button" class="btn btn-secondary waves-effect">Add Content</button>
                    <button type="button" data-target="#largeModalBook" data-toggle="modal" id="BookPlanButton" class="btn btn-secondary waves-effect">Book Plan</button>
                    <button type="button" data-target="#largeModalCalender" data-toggle="modal" id="CalenderPlanButton" class="btn btn-secondary waves-effect">Calender Plan</button>
                    <a data-target="#largeModalShipperPlan" data-toggle="modal" id="BtnShipperCalculation" class="myButton hidden" hidden style="cursor: pointer; margin-right: 5px">Packing Box Calculation</a>
                    <a data-target="#myModalFileAttachement" data-toggle="modal" class="myButton hidden" hidden style="cursor: pointer; margin-right: 5px">File Attachement</a>
                    <div id="ChkUseFirstPlanAsMaster" style="margin: 3px;"></div>
                    <a class="MasterDisplayName" style="float: right; color: #42909A">Estimation</a>
                    <a title="Comments" id="BtnNotification" class="iconButton" style="display: none;">
                        <i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i>
                    </a>
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: calc(100vh - 85px); overflow-y: auto">
                    <p id="lastRow" style="display: none;">1</p>
                    <p id="lastCol" style="display: none;">0</p>
                    <input type="text" name="name" value="" id="HTypeOfCost" hidden="hidden" />
                    <input type="number" name="name" value="0" id="HFinalCost" hidden="hidden" />
                    <input type="number" name="name" value="0" id="HQuotedCost" hidden="hidden" />

                    <%--<a href="#" class="square_btn"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true">&nbsp Add Quantity</i></a>--%>

                    <div class="inner">
                        <table id='PlanTable' class='table table-bordered' style="margin-top: .5em; margin-bottom: 0px;">
                            <thead style="height: 0em">
                                <tr style='background-color: white; color: red; text-align: center; height: 0em'>
                                    <%-- <th id="btn_AddQty" class="addqty" onclick="addqty();">Add Quantity
                        </th>--%>
                                </tr>
                            </thead>
                            <tbody id="Body_Planning">
                                <tr id="Bdy_QtyRow"></tr>
                            </tbody>
                            <tfoot id="Footer_Cost" style="background-color: #fff;">

                                <%--Final Cost Window--%>
                                <tr id="FinalCostDivFooter"></tr>
                                <tr id="trCurrencytype" style="width: 100%; display: none;">
                                    <td>
                                        <b class="font-12">Currency </b><a href="https://www.google.com/search?q=currency+convertor" target="_blank">Check here</a><br />
                                        <div id="SbCurrency" style="float: left; max-width: 90px; width: 50%; height: auto;"></div>
                                        <input id="TxtCurrencyValue" oninput="onchangeQuotedCost();" class="forTextBox" value="1" maxlength="4" placeholder="Con. value" title="Currency Conversion value" style="max-width: 65px; float: left; width: 50%; border-radius: 4px" type="text" />
                                    </td>
                                    <td>
                                        <input type="button" name="BtnFinalize" class="btn myButton" onclick="$('#Quotation_Finalize').click();" value="Finalize" />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div style="float: left; width: 100%; height: auto">
                    <%--Quantity wITH Content Table Container--%>
                </div>

            </div>
        </div>
    </div>

    <%--  <div class="rowcontents clearfix" style="padding-top: 0px">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-right: 0px; padding-top: 0px">--%>
    <div class="modal fade" id="largeModal" title="Press press Enter key to add selected content" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" <%-- style="width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px"--%>>
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px">

                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Choose Content</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="popContenerContent" style="display: block; padding-top: 20px; padding-right: 0px">
                        <div class="rowcontents clearfix" style="border-bottom: 1px solid #42909A; height: auto;">
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 hidden-xs" style="margin-bottom: 5px">
                                <h6 style="float: right"><b>Content Name </b></h6>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin-bottom: 5px">
                                <input class="forTextBox" title="Contents Name" style="float: left; width: 100%; border-radius: 4px" type="text" id="Txt_Content_Name" />
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="margin-bottom: 5px">
                                <a id="Btn_Select_Content" class="btn myButton" style="float: left; cursor: pointer; margin-right: 5px">Select</a>
                            </div>
                        </div>
                        <div title="Double click to add content" id="AllContents" style="height: calc(100vh - 127px); overflow-y: auto"></div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                </div>
            </div>
        </div>
    </div>

    <div id="BottomTabBar" class="MYBottomsidenav" style="padding-right: 1px">
        <div class="DialogBoxCustom" style="float: left">
            <strong>Plan Window</strong>&nbsp;                            
            <strong style="border: 1px dashed;" id="PlanContQty">0</strong>
            <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="BottomTabBar" onclick="closeBottomTabBar()">
                <span data-dismiss="BottomTabBar" onclick="closeBottomTabBar()" style="font-weight: 900; margin-right: 8px">X</span>
            </a>
            <a class="btn myButton" style="float: right; display: block; cursor: pointer; margin-right: 5px" onclick="fnplnhideshow()">
                <span id="PlanButtonHide" style="margin-right: 9px;">Modify</span>
            </a>
        </div>

        <div class="rowcontents clearfix" style="border-bottom: 1px solid #42909A; height: auto; padding-bottom: 0em; height: calc(100vh - 83px); overflow-y: auto;">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-right: 0px;">
                <div style="width: auto; float: left; display: none;">
                    <strong id="displayStatusBottom"></strong>
                </div>

                <div id="PlanSizeContainer" class="Input_Parameter">
                    <%--Plan Input parameter details--%>
                    <div style='float: left; width: 100%; height: auto; margin-bottom: 0em;'>
                        <div class="inner" style="margin-right: 0px;">
                            <div id="Body_windowPlanning" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px; padding: 0px; margin-top: 1px; height: auto;">
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 padding-0 margin-0">
                                    <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                                        <div class='content_div' style='height: auto; text-align: center'>
                                            <img src="#" id="PlanContImg" style='height: 8em; width: 8em; left: 0' onmouseover='Planshow(this);' onmouseout='Planhide(this);' />
                                            <b id="PlanContName" style='display: none; border: 1px dashed; background-color: azure'></b>
                                            <textarea rows="3" cols="3" class="forTextBox" id="TxtPlanContName"></textarea>
                                            <b id="ContentOrientation" style='display: none'></b>
                                        </div>
                                    </div>
                                    <div id="planJob_Size" class="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                                        <b class="font-12" style="width: auto;">Job Size</b><br />
                                        <div id="SelJobSizeTemplate"></div>
                                        <div style="width: auto;">
                                            <input type='text' id='JobFoldedH' oninput="onInputChangeFolds(this);" name="FH" placeholder='Folded H' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input type='text' id='JobFoldedL' oninput="onInputChangeFolds(this);" name="FL" placeholder='Folded L' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                        </div>
                                        <div style="width: auto;">
                                            <input type='text' id='JobFoldInH' oninput="onInputChangeFolds(this);" name="FInH" value="1" placeholder='Fold In H' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                            <input type='text' id='JobFoldInL' oninput="onInputChangeFolds(this);" name="FInL" value="1" placeholder='Fold In L' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                        </div>
                                        <div style="width: auto;">
                                            <input required="required" type='text' id='SizeHeight' placeholder='Height' name="H" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input required="required" type='text' id='SizeLength' placeholder='Length' name="L" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                        </div>
                                        <div style="width: auto;">
                                            <input type='text' id='SizeWidth' placeholder='Width' class='forTextBox' name="W" style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input type='text' id='SizeOpenflap' placeholder='O.flap' class='forTextBox' name="OF" style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                        </div>
                                        <div style="width: auto;">
                                            <input type='text' id='SizeBottomflap' placeholder='B.flap' name="BF" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input type='text' id='SizePastingflap' placeholder='P.flap' name="PF" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                        </div>
                                        <div style="width: auto;" <%--class="hidden"--%>>
                                            <input type='text' id='JobNoOfPages' placeholder='No Of Pages' name="Pages" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                            <input type='text' id='JobUps' placeholder='Job Ups' name="Ups" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="numericValidation(this)" />
                                            <input type='text' id='JobFlapHeight' placeholder='Flap Height' name="FlapH" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input type='text' id='JobTongHeight' placeholder='Tongue Height' name="TH" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                            <input type='text' id='JobBottomPerc' placeholder='Bottom Perc' name="BPer" class='forTextBox' style="float: left; width: 40%; margin: .2em; display: none;" onchange="myvalidation(this)" />
                                        </div>
                                        <div style="width: auto;">
                                            <textarea id='JobPrePlan' placeholder='Job Size' class='forTextBox' rows="3" cols="3" style="float: left; width: 100%; margin: .2em; display: none;"></textarea>
                                        </div>

                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; margin: 0px;">
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <b class="font-12">Raw Material Selection <i class="fa fa-plus btn btn-link font-12 padding-0 reloadquality btnnewmaster"></i></b>
                                        <br />
                                        <div id="ItemPlanQuality" style="float: left; width: 99.3%; margin: .2%"></div>
                                        <div style="width: auto;">
                                            <div id="ItemPlanGsm" style="float: left; width: 45.2%; margin: .1%"></div>
                                            <div id="ItemPlanMill" style="float: left; width: 54%; margin: .1%"></div>
                                        </div>
                                        <div id="ItemPlanFinish" style="float: left; width: 99.3%; margin: .2%"></div>
                                        <br />
                                        <div class="advancedOptions">
                                            <b class="font-12">Paper Trimming</b>
                                            <div id="PaperTrim" style="width: auto;">
                                                <input type='text' title="Paper Trimming Top" id='PaperTrimtop' placeholder='T' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Bottom" id='PaperTrimbottom' placeholder='B' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Left" id='PaperTrimleft' placeholder='L' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                                <input type='text' title="Paper Trimming Right" id='PaperTrimright' placeholder='R' class='forTextBox' style="float: left; width: 3em; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 padding-0 margin-0">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                        <b class="font-12">Printing Color Details</b><br />
                                        <input title="Front color" type='text' id='PlanFColor' placeholder='Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                        <input title="Back color" type='text' id='PlanBColor' placeholder='Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="PrintStyle(this)" />
                                        <input title="Special front color" type='text' id='PlanSpeFColor' placeholder='Spe.Front' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                        <input title="Special back color" type='text' id='PlanSpeBColor' placeholder='Spe.Back' class='forTextBox' style="float: left; width: 47%; margin: .2%" maxlength="3" onchange="numericValidation(this)" />
                                        <b class="font-12">Printing Style</b><br />
                                        <div id="PlanPrintingStyle" style="float: left; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                        <div id="PlanPlateType" class="advancedOptions" style="float: left; display: none; width: 95.5%; margin: .1%; margin-top: 2px;"></div>
                                    </div>
                                    <b class='advanced btn btn-link font-12'>Advance Options</b>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 advancedOptions">
                                        <b class="font-12">Machine Wastage</b><br />
                                        <div style="width: auto;">
                                            <div title="Wastage Type" id="PlanWastageType" style="float: left; width: 100%; margin: .1%"></div>
                                            <input title="Enter wastage quantity" type='text' id='PlanWastageValue' placeholder='Enter Qty' class='forTextBox' style="float: left; width: 100%; margin: .1%; display: none" />
                                        </div>
                                        <b class="font-12">Grain Direction</b>
                                        <div title="Grain Direction" id="PlanPrintingGrain" style="float: left; width: 100%; margin: .1%"></div>
                                        <br />
                                        <b class="font-12">Online Coating</b>
                                        <div title="Grain Direction" id="PlanOnlineCoating" style="float: left; width: 100%; margin: .1%"></div>
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 margin-0 advancedOptions">
                                    <b class="font-12">Trimming</b><br />
                                    <div style="width: auto;">
                                        <input type='text' title="Job Trim Top" id='Trimmingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Bottom" id='Trimmingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Left" id='Trimmingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Job Trim Right" id='Trimmingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                    </div>
                                    <br />
                                    <br />
                                    <b class="font-12">Striping</b><br />
                                    <div style="width: auto;">
                                        <input type='text' title="Striping Top" id='Stripingtop' placeholder='Top' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Bottom" id='Stripingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Left" id='Stripingleft' placeholder='Left' class='forTextBox' style="float: left; width: 22%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                        <input type='text' title="Striping Right" id='Stripingright' placeholder='Right' class='forTextBox' style="float: left; width: 23%; margin: .1em" maxlength="4" onchange="myvalidation(this)" />
                                    </div>
                                    <br />
                                    <div style="width: auto;">
                                        <b class="font-12" style="float: left; width: 45%; margin: .2em">Color Strip</b>
                                        <b class="font-12" style="float: left; width: 45%; margin: .2em">Gripper</b>
                                    </div>
                                    <br />
                                    <div style="width: auto;">
                                        <input required="required" title="Color Strip" type='text' id='PlanColorStrip' placeholder='Color Strip' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="3" onchange="myvalidation(this)" />

                                        <input required="required" title="Gripper" type='text' id='PlanGripper' placeholder='Gripper' class='forTextBox' style="float: left; width: 45%; margin: .2em" maxlength="6" />
                                    </div>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-8 col-lg-8">
                                    <div id="ChkPlanInAvailableStock" class="hidden"></div>
                                    <div id="ChkPlanInStandardSizePaper"></div>
                                    <div id="ChkPlanInSpecialSizePaper"></div>
                                    <div id="ChkPaperByClient"></div>
                                    <div>
                                        <i class="fa fa-plus btn btn-link font-12 padding-0 reloadprocess btnnewmaster">Create New Process</i>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 advancedOptions">
                                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                        <b style="float: left; width: auto; margin: .7em" class="font-12">Machine </b>
                                    </div>
                                    <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10">
                                        <div id="MachineIDFiltered"></div>
                                        <textarea id="MachineId" style="display: none"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0 margin-0" style="padding-right: 0px; padding-left: 2px">
                                <div id="GridOperation"></div>
                                <textarea id="OperId" style="display: none"></textarea>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0 margin-0" style="padding-right: 2px; padding-left: 2px">
                                <div id="GridOperationAllocated"></div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-t-5" style="float: right;">
                                <div class="DialogBoxCustom">
                                    <a id="PlanButton" class="btn myButton" style="float: right; width: auto; cursor: pointer; margin-top: 5px;">Show Cost </a>
                                </div>
                            </div>

                        </div>
                    </div>
                    <%-- End Input --%>
                </div>

                <div id="PlanContainer" style="float: left; height: auto; width: 100%; display: none">

                    <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10" style="padding-right: 0px; height: auto; padding-left: 0px;">
                        <div style="height: auto; margin: 0px 2px 0px 2px;">
                            <div class="col-sm-2 margin-0" id="FilterMachineFolds"></div>
                            <b class="col-sm-4 margin-0 font-12" style="border: 1px dashed;" id="LblPlanContName"></b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: rgba(228, 255, 0, 0.6509803921568628);">Reel To Sheet Planning</b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: #ffc5d8;">Reel Planning</b>
                            <b class="col-sm-2 margin-0 font-12" style="background-color: greenyellow;">Plan In Special Paper</b>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-0" id="ContentPlansList"></div>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2" style="padding-right: 0px; height: auto; padding-left: 0px; padding-top: 1px;">
                        <div class='content_div' style='height: auto; width: auto; text-align: center;'>
                            <b class="col-xs-12 btn btn-sm btn-primary font-12" id="BtnKeyLine">Key Line</b>
                            <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                <div id="Layout_Sheet" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em"></div>
                            </div>
                            <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" style="padding-right: 1px; height: auto; padding-left: 0px;">
                                <div id="Layout_Ups" style="height: 10em; cursor: pointer; width: auto; margin-left: 0em;"></div>
                            </div>
                        </div>
                        <div style="display: none">
                            <svg id="svg_Sheet_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' onmouseout='setTimeout(PlanLayoutHide,3000);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                            <svg id="svg_Shape_Container" preserveAspectRatio="xMidYMid meet" viewBox="0 0  1000 1000" onmouseover='PlanLayoutShow(this);' onmouseout='setTimeout(PlanLayoutHide,3000);' style="border: solid; border-width: 1px; height: 125px; width: 125px; background-color: #B7C4F0; text-align: center" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                        </div>
                    </div>

                    <div id="tabDetailsMain" class="col-xs-12 col-sm-4 col-md-3 col-lg-3 padding-0 margin-0">
                        <div id="TabHeadsDetails">
                            <div style="height: auto; margin: 0px 2px 0px 2px;">
                                <div id="GridHeadsDetails"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                        <div id="TabOperations">
                            <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 padding-0 margin-0">
                                <div id="GridOperationDetails"></div>
                            </div>

                            <%--<div class="col-lg-1 col-md-1 col-sm-1 col-xs-2 padding-0 margin-0">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OperMoveUp" class="btn btn-success"><i class="fa fa-2x fa-arrow-up"></i></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OperMoveDown" class="btn btn-success"><i class="fa fa-2x fa-arrow-down"></i></div>
                                </div>
                            </div>--%>
                        </div>
                        <div class='col-lg-2 col-md-2 col-sm-2 col-xs-12 padding-0 margin-0'>
                            <div id="PlanChartLayout" data-target="#myModalChart" data-toggle="modal" style="height: 10em; margin-top: 0px; margin-left: 0em"></div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-9 col-lg-8" style="margin-bottom: 0px; float: right;">
                        <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                            <b class="font-12">Expected Qty</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="Expected Quantity" title="Expected Quantity" id="TxtFinalQuantity" />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                            <b class="font-12">Unit Cost</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="finalUnitCost" title="Final Unit Cost" value="" id="finalUnitCost" />
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-sm-4">
                            <b class="font-12">Final Cost</b>
                            <input class="text-right forTextBox" disabled="disabled" type="text" name="finalCost" title="Final Cost" value="" id="finalCost" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-3 col-sm-4">
                            <br class="hidden-xs" />
                            <a id="btnApplyCost" name="nameApplyCost" class="btn myButton" style="color: #fff;">Apply Cost</a>
                        </div>
                    </div>
                </div>
                <%--</div>--%>
            </div>
        </div>
        <div id="PlanWindowDivZommer" class='PlancontentZoom' style="text-align: center; z-index: 9" onmouseover="PlanhideIN(this);" onmouseout="PlanhideOut(this);"></div>
    </div>

    <%--<div class="clearfix">
        <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10">
            <div class="modal fade" id="ModalOperation" title="Select operations for planning" tabindex="-1" role="dialog" style="padding-top: 20px">
                <div class="modal-dialog modal-lg" role="document" style="width: 95%; height: auto; bottom: 10px">
                    <div class="modal-content">
                        <div class="modal-header" style="border-bottom: 1px solid #42909A; height: 0.5em">
                            <div class="row clearfix">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: -.5em;">
                                    <div style="width: 90%; float: left; text-align: center; height: 0.5em;">
                                        <h6 style="color: #42909A; font-size: large; margin-top: -.5em" id="popTagOperation">Select Operation</h6>
                                    </div>
                                    <div style="width: 10%; float: left; text-align: center; height: 0.5em;">
                                        <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1.3em; float: right; height: 2em">X</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>--%>

    <!-- The Calender Modal -->
    <div class="modal fade" id="largeModalCalender" title="Calender Planning" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" <%-- style="width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px"--%>>
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px">

                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Calender Planning</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px;">
                    <div style="width: 100%; height: calc(100vh - 100px); overflow-y: auto;">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0 margin-0">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                    <b class="font-12" style="width: auto;">Order Quantity</b><br />
                                    <div class='content_div' style='height: auto; width: auto; min-width: 120px; float: left; text-align: center'>
                                        <input type="number" title="Plan Quantity" tabindex="0" class="forTextBox" name="CalenderQuantity" min="0" id="CalenderQuantity" value="" />
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" style="min-width: 120px;">
                                    <b class="font-12" style="width: auto;">Calender Category</b><br />
                                    <div class='content_div' style='height: auto; width: auto; float: left; text-align: center'>
                                        <div id="CalenderCategories"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" style="min-height: 160px">
                                <div class='content_div' style='height: auto; text-align: center'>
                                    <img id="PlanCalenderContImg" src="images/Contents/PictureTable.png" class="col-xs-5 col-sm-12 col-md-12 col-lg-12" />
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 sizeFields">
                                <b class="font-12" style="width: auto;">Job Size</b><br />
                                <div id="CalenderJobSize" style="width: auto;">
                                    <input title="Calender width" required="required" type='text' id='CalenderWidth' placeholder='Width' class='forTextBox' style="float: left; width: 25%; margin: .2em; display: block;" />
                                    <input title="Calender height" required="required" type='text' id='CalenderHeight' placeholder='Height' class='forTextBox' style="float: left; width: 25%; margin: .2em; display: block;" />
                                    <input title="Calender length" required="required" type='text' id='CalenderLength' placeholder='Length' class='forTextBox' style="float: left; width: 25%; margin: .2em; display: block;" />
                                    <input title="Gutter" type='text' id='CalenderGutter' placeholder='Gutter' value="6" class='forTextBox disabledbutton' style="float: left; width: 25%; margin: .2em;" />
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 sizeFields">
                                <b class="font-12">Calender Trimming</b><br />
                                <div style="width: auto;">
                                    <input type='text' title="Top" id='CalenderTrimTop' placeholder='Top' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                    <input type='text' title="Bottom" id='CalenderTrimBottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" /><br />
                                </div>
                                <div style="width: auto;">
                                    <input type='text' title="Left" id='CalenderTrimLeft' placeholder='Left' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                    <input type='text' title="Right" id='CalenderTrimRight' placeholder='Right' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                </div>
                            </div>
                            <%--<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div class='content_div' style='height: auto; text-align: center'>
                                    <img id="PlanCalenderContImg" style='height: 10em; width: 100%; left: 0' />
                                </div>
                            </div>--%>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5">
                            <b class="font-12" style="width: auto;">Select Contents</b>
                            <div id="GridCalenderContents"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="ApplyCalenderButton" class="btn myButton">Plan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Book Modal -->
    <div class="modal fade" id="largeModalBook" title="Book Planning" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" <%-- style="width: 98.2%; height: auto; padding-right: 0px; padding-bottom: 0px"--%>>
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px">

                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Book Planning</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px;">
                    <div style="width: 100%; height: calc(100vh - 100px); overflow-y: auto;">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding-0 margin-0">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                                    <b class="font-12" style="width: auto;">Book Quantity</b><br />
                                    <div class='content_div' style='height: auto; width: auto; float: left; text-align: center'>
                                        <input type="number" title="Plan Quantity" tabindex="0" class="forTextBox" name="BookQuantity" min="0" id="BookQuantity" value="" />
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" style="min-width: 120px;">
                                    <b class="font-12" style="width: auto;">Book Category</b><br />
                                    <div class='content_div' style='height: auto; width: auto; float: left; text-align: center'>
                                        <div id="BookCategories"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" style="min-height: 160px">
                                <div class='content_div' style='height: auto; text-align: center'>
                                    <img id="PlanBookImg" src="images/Contents/PictureBook.png" class="col-xs-5 col-sm-12 col-md-12 col-lg-12" />
                                </div>
                                <b class="font-12" style="width: auto;">Job Size</b><br />
                                <div style="width: auto;" class="sizeFields">
                                    <input required="required" type='text' id='BookHeight' placeholder='Height' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: block;" />
                                    <input required="required" type='text' id='BookLength' placeholder='Length' class='forTextBox' style="float: left; width: 40%; margin: .2em; display: block;" />
                                </div>
                            </div>
                            <div id="BookJob_Size" class="col-xs-12 col-sm-3 col-md-3 col-lg-3 sizeFields">
                                <b class="font-12">Book Parameters</b>
                                <br />
                                <div style="width: auto;">
                                    <input title="Book Hinge" type='text' id='BookHinge' placeholder='Hinge' class='forTextBox disabledbutton' style="float: left; width: 25%; margin: .2em; /*display: none; */" />
                                    <input title="Book Spine" type='text' id='BookSpine' placeholder='Book Spine' class='forTextBox disabledbutton' style="float: left; width: 28%; margin: .2em; /*display: none; */" />
                                    <input title="Book Loops" type='text' id='BookLoops' placeholder='Loops' class='forTextBox disabledbutton' style="float: left; width: 25%; margin: .2em; /*display: none; */" />
                                </div>
                                <div style="width: auto;">
                                    <input title="Book Cover TurnIn" type='text' id='BookCoverTurnIn' placeholder='Cover Turn In' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em; /*display: none; */" />
                                    <input title="Book Extension" type='text' id='BookExtension' placeholder='Extension' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em; /*display: none; */" />
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 sizeFields">
                                <b class="font-12">Book Trimming</b><br />
                                <div style="width: auto;">
                                    <input type='text' title="Top" id='BookTrimmingtop' placeholder='Top' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="4" />
                                    <input type='text' title="Bottom" id='BookTrimmingbottom' placeholder='Bottom' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="4" /><br />
                                </div>
                                <div style="width: auto;">
                                    <input type='text' title="Left" id='BookTrimmingleft' placeholder='Left' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="4" />
                                    <input type='text' title="Right" id='BookTrimmingright' placeholder='Right' class='forTextBox' style="float: left; width: 40%; margin: .2em" maxlength="4" />
                                </div>
                            </div>
                            <%--<div id="dustCoverMargins" class="col-xs-12 col-sm-3 col-md-3 col-lg-3 disabledbutton">
                                <b class="font-12">Dust Cover Margins</b><br />
                                <div style="width: auto;">
                                    <input type='text' id='BookDusttop' placeholder='Top' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                    <input type='text' id='BookDustbottom' placeholder='Bottom' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" /><br />
                                </div>
                                <div style="width: auto;">
                                    <input type='text' id='BookDustleft' placeholder='Left' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                    <input type='text' id='BookDustright' placeholder='Right' class='forTextBox disabledbutton' style="float: left; width: 40%; margin: .2em" maxlength="3" />
                                </div>
                            </div>--%>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div class='content_div' style='height: auto; text-align: center'>
                                    <img id="PlanBookContImg" style='height: 10em; width: 100%; left: 0' />
                                </div>
                            </div>
                        </div>

                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-t-5">
                            <b class="font-12" style="width: auto;">Select Contents</b>
                            <div id="GridBookContents"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="Apply_Book_Button" class="btn myButton">Plan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Layout ZoomModal -->
    <div class="modal fade" id="myModalZoom" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                    <strong id="caption"></strong>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="rowcontents clearfix" style="padding: 20px; overflow: auto; height: 50em;">
                        <button type="button" class="zoom-out">
                            <span class="fa fa-minus"></span>
                        </button>
                        <button type="button" class="zoom-in">
                            <span class="fa fa-plus"></span>
                        </button>

                        <img src="images/Indus logo.png" id="Zoomedimg01" style="height: 50em;" class="bg-svg">
                        <input type="button" id="PZoomBtn" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Forms Details-->
    <div class="modal fade" id="myModalforms" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Book Forms</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="GridFormsDetails"></div>
                    </div>
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="GridPrintingSlabsDetails"></div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Paper Details-->
    <div class="modal fade" id="myModalPapers" tabindex="-1" role="dialog" style="padding: 50px; margin-top: 100px; width: auto;">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: auto">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 5px;">
                    <div style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 110px); overflow-y: auto; margin-left: 0px;">
                            <span id="PlanPaperString" class="cut-text"></span>
                            <div id="ContPaperDetails" style="height: auto; width: 100%;">
                                <div id="MainPaperDetails"></div>
                                <div id="DivPaperStock"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal Chart-->
    <div class="modal fade" id="myModalChart" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: 0px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; width: 100%">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="display: block; padding-top: 20px; padding-right: 0px;">
                        <div id="ZoomChartLayout" class="rowcontents clearfix" style="padding-top: 10px; max-height: calc(100vh - 110px); overflow-y: auto; padding: 20px"></div>
                    </div>
                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal InPut parameter Operation calculation-->
    <div class="modal fade" id="ModalOperationEdit" tabindex="-1" role="dialog" style="padding: 20px; margin-top: 200px;">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Operation Calculation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <label id="LblTtlPaperWtInKG" style="float: left; width: 100%;">Total Paper(KG)</label>
                            <div id="OperationEditP" role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 10px; max-height: calc(100vh - 105px); overflow-y: auto">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnCalculateOperation" class="btn btn-link waves-effect" style="margin-top: -1em">Apply</button>
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>


    <!-- The Modal Shipper calculation-->
    <div class="modal fade" id="largeModalShipperPlan" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Shipper Planning</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 10px; max-height: calc(100vh - 105px); overflow-y: auto">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tab-pane animated fadeInDown">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 p-r-0">
                                        <div id="GridPackingContentsList"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 padding-0">
                                        <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 p-r-0">
                                            <b class="font-12">Total Qty</b>
                                            <input type="number" title="Total Quantity" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtShipperQuantity" value="" readonly="readonly" />
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4 p-r-0">
                                            <b class="font-12">Product L/W/H (MM)</b><br />
                                            <input type="text" title="Length of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductLength" value="" />
                                            <input type="text" title="Width of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductWidth" value="" />
                                            <input type="text" title="Height of Product" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtProductHeight" value="" />
                                        </div>
                                        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 p-r-0">
                                            <b class="font-12">Product Wt (GM)</b>
                                            <input type="number" title="Qty in a bundle" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtProductWt" value="1" />
                                        </div>
                                        <div class="col-xs-6 col-sm-2 col-md-2 col-lg-1 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Tol.%</b>
                                            <input type="text" title="Tolerance in percentage" tabindex="0" class="forTextBox" name="Quantity" id="TxtShipperTolerance" value="10" />
                                        </div>
                                        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 p-r-0">
                                            <b class="font-12">Exp. Qty In A Box</b>
                                            <input type="number" title="Total Quantity" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtExpectedQtyInBox" value="0" />
                                        </div>
                                        <div class="col-xs-6 col-sm-2 col-md-3 col-lg-2 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Qty in A Bundle</b>
                                            <input type="number" title="Qty in a bundle" tabindex="0" class="forTextBox" name="Quantity" min="0" id="TxtQtyInABundle" value="1" />
                                        </div>
                                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 p-l-0 hidden">
                                            <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 p-r-0">
                                                <b class="font-12" style="width: auto;">Wt. of Box(Kg) Min</b>
                                                <input type="text" title="Min Weight in box in KG" tabindex="0" class="forTextBox" name="Quantity" id="TxtMinWtInBox" value="1" />
                                            </div>
                                            <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 p-r-0">
                                                <b class="font-12" style="width: auto;">Max</b>
                                                <input type="text" title="Max Weight in box in KG" tabindex="0" class="forTextBox" name="Quantity" id="TxtMaxWtInBox" value="12" />
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Box Min L/W/H (MM)</b><br />
                                            <input type="text" title="Min Length of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinLengthofBox" value="300" />
                                            <input type="text" title="Min Width of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinWidthofBox" value="250" />
                                            <input type="text" title="Min Height of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMinHeightofBox" value="100" />
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 p-r-0 hidden">
                                            <b class="font-12" style="width: auto;">Box Max L/W/H (MM)</b><br />
                                            <input type="text" title="Max Length of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxLengthofBox" value="700" />
                                            <input type="text" title="Max Width of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxWidthofBox" value="600" />
                                            <input type="text" title="Max Height of Box" tabindex="0" class="forTextBox" style="width: 30%" name="Quantity" id="TxtMaxHeightofBox" value="400" />
                                        </div>
                                        <div class="col-xs-12 col-sm-8 col-md-5 col-lg-12 p-r-0">
                                            <button type="button" id="BtnPlanShipper" class="btn btn-warning">Show Plan</button>
                                            <button type="button" id="BtnPlanNewShipper" class="btn btn-primary">New Size Plan</button>
                                        </div>
                                        <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                            <img id="PlanShipperContImg" src="images/Contents/ShipperContent.png" style="width: 100%;" />
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div id="gridShipperPlans"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <b class="font-12">Container Capcity</b>
                                        <div id="gridContainerPlans"></div>
                                    </div>
                                    <div class="col-xs-12 col-sm-9 col-md-10 col-lg-10">
                                        <div id="gridShipperBoxes"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-3 col-sm-2 col-md-1 col-lg-1 m-t-10">
                    <b class="font-12">No of Ply</b>
                </div>
                <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 m-t-5">
                    <input type="text" title="No of Ply" placeholder="Shipper No of ply" tabindex="0" class="forTextBox" name="Quantity" id="TxtShipperNoOfPly" value="" />
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnSaveShipper" class="btn btn-success" style="margin-top: -1em">Save Shipper</button>
                    <button type="button" id="BtnApplyShipper" class="btn btn-info" style="margin-top: -1em">Apply</button>
                </div>
            </div>
        </div>
    </div>


    <!-- The Modal Input Clone Content-->
    <div class="modal fade" id="ModalCloneContent" tabindex="-1" role="dialog" style="padding: 20px; margin-top: 200px;">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Clone Content</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <label style="float: left; width: 100%;">Content Name</label>
                            <input type="text" name="CloneContent" value="" id="TxtCloneContent" class="forTextBox" />
                            <input type="hidden" name="TxtCloneContentName" id="TxtCloneContentName" value="" />
                            <input type="hidden" name="rowid" id="rowidCloneContent" value="" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" id="BtnCloneContent" class="btn btn-success" style="margin-top: -1em">Clone</button>
                </div>
            </div>
        </div>
    </div>


    <!-- The Modal Multiple File Attachement-->
    <div class="modal fade" id="myModalFileAttachement" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>File Attachement</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">

                    <div class="row clearfix" style="padding-top: 10px;">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <label style="float: left; width: 100%;">Attach File</label><br />
                            <input type="file" class="btn btn-block" id="AttachDesign" /><br />
                            <input type="button" id="UpladBtnFirst" value="Upload File" class="btn btn-primary" />
                        </div>

                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <label>Attached File List</label>
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <table id="tblDetails"></table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A; height: 3em">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal" style="margin-top: -1em">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal for new masters-->
    <div class="modal fade" id="ModaliFrame" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Add New Master</strong>
                    <a href="javascript:void(0);" id="btnCloseiFrame" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <label id="LbliFrame" hidden></label>
                <div class="modal-body" style="position: initial; padding-right: 0px; padding-left: 6px; padding-right: 6px;">
                    <iframe id="iFrameMasters" style="width: 100%;"></iframe>
                </div>
            </div>
        </div>
    </div>

    <!-- The Modal for Job Size Template-->
    <div class="modal fade" id="modaljobsizetemplate" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: 0em; padding-right: 0px; padding-left: 1px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Size Template</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div id="GridJobSizeTemplate"></div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A;">
                    <button type="button" id="BtnApplySize" class="btn btn-link waves-effect">Apply</button>
                </div>
            </div>
        </div>
    </div>

    <div id="DivZommer" class='contentZoom' style="text-align: center; z-index: 6; margin-top: 2em" onmouseover="hoverdivIN(this);" onmouseout="hoverdivOut(this);"></div>

    <input type="text" id="PlanContentType" style="display: none;" />
    <input type="text" id="Txt_ContentImgSrc" style="display: none" />

    <script src="CustomJS/LocalStorage.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/AddContent.js"></script>
    <script src="CustomJS/DynamicQty.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>

    <script src="CustomJS/PlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/LayoutDraw.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
    <script src="CustomJS/BookPlanning.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/CalenderPlanning.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/ShipperPlanning.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/RePlanWindow.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>" type="text/javascript"></script>
    <script src="CustomJS/MultipleFilesAttachment.js"></script>

</asp:Content>
