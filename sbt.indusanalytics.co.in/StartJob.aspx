<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="StartJob.aspx.vb" Inherits="StartJob" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <title>Start Job</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px;">
        <div id="LoadIndicator"></div>
        <div id="divOperator" class="col-lg-2 col-md-3 col-sm-4 col-xs-12 hidden">
            <b>Operator</b>
            <div id="ddlOperator"></div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-5 col-xs-12">
            <b>Machine</b>
            <div id="ddlMachine"></div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Job Card</b>
            <div id="ddlJobCard"></div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Select Content</b>
            <div id="ddlJobCardContent"></div>
        </div>
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
            <b>Operation</b>
            <div id="ddlOperation"></div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Form No.</b>
            <div id="ddlFormNo"></div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 hidden">
            <b>Ref Form No.</b>
            <input type="text" id="TxtFormRefNo" disabled="disabled" class="forTextBox" style="background-color: #ffc107;" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
            <b style="float: left;">Job Name</b>
            <input type="text" id="TxtJobName" disabled="disabled" class="forTextBox" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 hidden">
            <b style="float: left;">Client Name</b>
            <input type="text" id="TxtClientName" disabled="disabled" class="forTextBox" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
            <b>Content Name</b>
            <input type="text" id="TxtContentName" disabled="disabled" class="forTextBox" />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
            <b>Previous Operation</b>
            <input type="text" id="TxtPreviousOperation" disabled="disabled" class="forTextBox" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <b>Scheduled Quantity</b>
            <input type="number" id="TxtScheduleQuantity" disabled="disabled" readonly="readonly" class="forTextBox" />
        </div>
        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
            <b>Received Quantity</b>
            <input type="number" id="TxtReceivedQuantity" disabled="disabled" readonly="readonly" class="forTextBox" />
        </div>

    </div>
    <div class="row clearfix" style="padding: 0px; margin: 0px;">

        <div class="col-lg-3 col-md-5 col-sm-6 col-xs-12 m-t-10">
            <div class="font-11">Attachement</div>
            <input type="file" capture="camera" name="photo" accept=".png, .jpg, .jpeg, .gif" id="file" style="width: 60%; float: left; height: 2.5em" />
            <input type="button" name="BtnRemoveFile" id="BtnRemoveFile" value="Remove File" class="btn btn-warning" />
            <div style="clear: both">
                <img src="#" id="PreviewAttachedFile" style="display: none; width: auto; height: 200px" />
            </div>

            <button type="button" class="btn btn-success" id="BtnSaveStartJob">Start Job</button>
            <input type="button" name="BtnForms" id="BtnForms" value="Form Details" class="btn btn-info hidden" />
            <input type="button" name="BtnPaperDetails" id="BtnPaperDetails" onclick="document.getElementById('PaperGridDiv').style.display = 'block'" value="Paper Details" class="btn btn-primary hidden" />
        </div>
        <div id="PaperGridDiv" class="m-t-10 col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-pane animated fadeInRight hidden">
            <b>Issued Items Detail</b>
            <div id="PaperDetailGrid"></div>
        </div>

        <div id="FormsDetailsCntainer" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tab-pane animated fadeInRight padding-0" style="display: none; margin-top: 1em">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div id="GridFormsDetails"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button type="button" onclick="document.getElementById('FormsDetailsCntainer').style.display = 'none';" class="btn btn-danger waves-effect" style="float: right">Close</button>
            </div>
        </div>

        <div id="BindingContentsCntainer" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tab-pane animated fadeInRight padding-0" style="display: none; margin-top: 1em">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div id="GridBindingContents"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button type="button" onclick="document.getElementById('BindingContentsCntainer').style.display = 'none';" class="btn btn-danger waves-effect" style="float: right">Close</button>
            </div>
        </div>
    </div>

    <script src="Production/js/StartJob.js?<%=System.Configuration.ConfigurationManager.AppSettings("VersionNo")%>"></script>
    <script src="Production/js/FileAttachment.js"></script>
</asp:Content>

