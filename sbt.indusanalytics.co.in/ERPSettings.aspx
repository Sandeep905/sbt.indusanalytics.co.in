<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .validation {
            color: red;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-style: italic;
        }

        #hiddenBtn_ChooseMaster {
            -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
            animation: mymove 5s infinite;
        }
        /* Safari 4.0 - 8.0 */
        @-webkit-keyframes mymove {
            25% {
                color: purple;
                box-shadow: 0px 10px 10px #42909A;
            }

            50% {
                color: blue;
                /*box-shadow: 0px 10px 10px #42909A;*/
            }
        }

        @keyframes mymove {
            25% {
                color: purple;
                box-shadow: 0px 10px 10px #42909A;
            }

            50% {
                color: blue;
                box-shadow: 10px 20px 30px #42909A;
            }
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row" style="padding: 0px; margin-left: 10px; margin-right: -10px">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-bottom: 0px; padding: 0px; margin: 0px">
                <div style="float: left; height: 32px; align-items: center; background: linear-gradient(45deg, #e6f5f5,#feb1fe); padding-bottom: 10px; border-radius: 0px; width: 100%">
                    <label id="Newdiv2Label" style="width: 100%; text-align: center; font-family: 'Segoe UI Symbol'; font-size: 18px; font-weight: normal">ERP Setting</label>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin-bottom: 0px; padding: 0px; margin: 0px">
                <h3 style="text-align: center;"><b id="ChoosedBlock">Job Reference</b></h3>
            </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="DialogBoxCustom" style="width: 100%; border-top-left-radius: 4px; border-top-left-radius: 0px;">
                <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: block">
                    <li role='presentation' class="active"><a id="JobReference" onclick="TabClick(this)" href="#MachineMasterFieldArea" data-toggle='tab' style='background-color: none;'>Job Reference</a></li>
                    <li role='presentation'><a id="JobTypetext" onclick="TabClick(this)" href="#MachineMasterSlabGrid" data-toggle='tab' style='background-color: none;'>Job Type</a></li>
                    <li role='presentation'><a id="PlateTypetext" onclick="TabClick(this)" href="#PlateTypeSlabGrid" data-toggle='tab' style='background-color: none;'>Plate Type</a></li>
                    <li role='presentation'><a id="Salesorderprefix" onclick="TabClick(this)" href="#MachineMasterCoatingSlabGrid" data-toggle='tab' style='background-color: none;'>Sales Order Prefix</a></li>
                    <li role='presentation'><a id="JobPriority" onclick="TabClick(this)" href="#MachineMasterFieldAreanew" data-toggle='tab' style='background-color: none;'>Job Priority</a></li>
                    <li role='presentation'><a id="JobCriteria" onclick="TabClick(this)" href="#MachineMasterCoatingSlabGridnew" data-toggle='tab' style='background-color: none;'>Job Criteria</a></li>
                    <li role='presentation'><a id="Approved" onclick="TabClick(this)" href="#MachineMasterFieldAreanew" data-toggle='tab' style='background-color: none;'>Approved By</a></li>
                </ul>
            </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="divInputs">
            <div id="reference" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Job Reference:</label>
                    <input type="text" id="TxtJobReference" class="input forTextBox" />&nbsp
                        <span id="err1" class="validation"></span>
                </div>
            </div>
            <div id="jobtype" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Job Type:</label>
                    <input type="text" id="TXtJobtype" class="input forTextBox" />&nbsp
                    <span id="err2" class="validation"></span>
                </div>
            </div>
            <div id="platetype" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Plate Type:</label>
                    <input type="text" id="TxtPlateType" class="input forTextBox" />&nbsp
                    <span id="err7" class="validation"></span>
                </div>
            </div>
            <div id="SalesOrderprefix" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Sales Order Prefix:</label>
                    <input type="text" id="TXtSalesPrefix" class="input forTextBox" />&nbsp
                     <span id="err3" class="validation"></span>
                </div>
            </div>
            <div id="jobpriority" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Job Priority:</label>
                    <input type="text" id="TXtJobPriority" class="input forTextBox" />&nbsp
                     <span id="err4" class="validation"></span>
                </div>
            </div>
            <div id="jobCriteria" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Job Criteria:</label>
                    <input type="text" id="TXtJobcriteriaNew" class="input forTextBox" />&nbsp
                     <span id="err5" class="validation"></span>
                </div>
            </div>
            <div id="Approvedby" style="display: none">
                <div class="col-lg-6 col-md-6 col-sm-10 col-xs-11" style="margin-top: 20px;">
                    <label>Approved By:</label>
                    <input type="text" id="TXtApproved" class="input forTextBox" />&nbsp
                     <span id="err6" class="validation"></span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="ButtonDiv" style="height: auto; width: 100%; padding-bottom: 2px">
                    <input id="CreateButton" type="button" name="BtnNew" value="New" class="btn btn-primary" />
                    <input id="SaveButton" type="button" name="BtnSave" value="Save" class="btn btn-success" />
                    <input id="DeleteButton" type="button" name="BtnDelete" value="Delete" class="btn btn-danger" />
                </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div id="GridShowlist"></div>
            </div>
        </div>
    </div>
    <script src="CustomJS/ERPSettings.js"></script>

</asp:Content>
