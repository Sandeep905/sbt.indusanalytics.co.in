<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="UpdateJob.aspx.vb" Inherits="UpdateJob" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <title>Update Job</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="MainUpdateScreen" class="row clearfix" style="padding: 0px; margin: 0px;">
        <div id="LoadIndicator"></div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Machine</b>
            <div id="ddlMachine"></div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Job Card</b>
            <div id="ddlJobCard"></div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Previous Operation</b>
            <input type="text" id="TxtPreviousOperation" disabled="disabled" class="forTextBox" readonly="readonly" />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Operation</b>
            <div id="ddlOperation"></div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <b>Job Name</b>
            <input type="text" id="TxtJobName" disabled="disabled" class="forTextBox" readonly="readonly" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <b>Content Name</b>
            <input type="text" id="TxtContentName" disabled="disabled" class="forTextBox" readonly="readonly" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <b>Form No.</b>
            <div id="ddlFormNo"></div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Ref Form No.</b>
            <input type="text" id="TxtFormRefNo" disabled="disabled" class="forTextBox" style="background-color: #ffc107;" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Unit Conversion</b>
            <input type="text" id="TxtUnitConversion" class="forTextBox" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>No Of Steps</b>
            <input type="number" id="TxtConValue" class="forTextBox font-bold" min="1" style="background: lightgreen;" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <b>Scheduled Quantity</b>
            <input type="number" id="TxtScheduleQuantity" disabled="disabled" readonly="readonly" class="forTextBox" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Received Qty</b>
            <input type="number" id="TxtReceivedQuantity" disabled="disabled" class="forTextBox" readonly="readonly" min="0" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Completed Qty</b>
            <input type="number" id="TxtCompletedQuantity" disabled="disabled" class="forTextBox" readonly="readonly" min="0" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Balance Qty</b>
            <input type="number" id="TxtBalanceQuantity" disabled="disabled" class="forTextBox" readonly="readonly" min="0" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Production Qty</b>
            <input type="number" id="TxtProductionQuantity" disabled="disabled" class="forTextBox" min="0" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Wastage Qty</b>
            <input type="number" id="TxtWastageQuantity" class="forTextBox" min="0" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
            <b>Excess Qty</b>
            <input type="number" id="TxtSuspenseQuantity" disabled="disabled" class="forTextBox" min="0" />
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <b>Remark</b>
            <input type="text" id="TxtProductionRemark" class="forTextBox" />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden">
            <b>Wastage Remark</b>
            <input type="text" id="TxtWastageremark" class="forTextBox" />
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden">
            <b>Excess Remark</b>
            <input type="text" id="TxtSuspenseRemark" class="forTextBox" />
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-5">
            <button type="button" class="btn btn-warning" id="BtnNext" value="Next">Next</button>
            <input type="button" name="BtnPaperDetails" id="BtnPaperDetails" value="Paper Details" class="btn btn-primary hidden" />
        </div>
        <div id="PaperGridDiv" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden">
            <b>Issued Items Details</b>
            <div id="PaperDetailGrid"></div>
        </div>
        <div id="SemiPackingGridDiv" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden">
            <b>Semi Packing Details</b>
            <div id="SemiPackingGrid"></div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-5 hidden">
            <button type="button" class="btn btn-primary" id="BtnPartComplete" value="Part Complete" onclick="UpdateRecord(this)">Part Complete</button>
            <button type="button" class="btn btn-success" id="BtnComplete" value="Complete" onclick="UpdateRecord(this)">Complete</button>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-5 hidden">
            <button type="button" class="btn btn-danger" id="BtnStop" value="Machine Stop" onclick="UpdateRecord(this)">Machine Stop</button>
        </div>
    </div>
    <div id="NextScreenDiv" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden">
        <button type="button" class="btn btn-primary" id="BtnBackToMain" value="Back">&laquo; Back</button>

        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden">
            <b>Machine Status</b>
            <div id="SelMachineStatus"></div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 m-b-5">
            <b>Details For Status Change</b>
            <input type="text" id="TxtDetailsForStatus" class="forTextBox" />
        </div>
        <div id="StatusDiv">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 btn">
                    <div class='statusbtn' onclick='UpdateMachineStatus(this)' title="Running">
                        <img style='width: 100%; height: 10em;' src="icon/PartCompleted.png" /><div class='font-12 dx-word-wrap' style='height: 2.5em;'><b title="Running" style='white-space: pre-wrap;'>CONTINUING</b></div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6 btn">
                    <div class='statusbtn' onclick='UpdateMachineStatus(this)' title="Complete">
                        <img style='width: 100%; height: 10em;' src='icon/Completed.png' /><div class='font-12 dx-word-wrap' style='height: 2.5em;'><b title="Complete" style='white-space: pre-wrap;'>COMPLETED</b></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-5 hidden">
            <div class="font-11">Attachement</div>
            <input type="file" capture="camera" name="photo" accept=".png, .jpg, .jpeg, .gif" id="file" style="width: 60%; float: left; height: 2.5em" />
            <input type="button" name="BtnRemoveFile" id="BtnRemoveFile" value="Remove File" class="btn btn-warning" />
            <div style="clear: both">
                <img src="#" id="PreviewAttachedFile" style="display: none; width: auto; height: 200px" />
            </div>
            <button type="button" class="btn btn-warning" id="BtnUpdate" value="Running" onclick="UpdateRecord(this)">Update</button>
        </div>
    </div>
    <script src="Production/js/UpdateJob.js?<%=System.Configuration.ConfigurationManager.AppSettings("VersionNo")%>"></script>
    <script src="Production/js/FileAttachment.js"></script>
</asp:Content>

