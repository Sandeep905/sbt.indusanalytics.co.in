<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="JobScheduleSequence.aspx.vb" Inherits="JobScheduleSequence" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <input type="button" name="BtnSave" class="btn btn-success" value="Save" id="BtnSave" />
                    <strong id="ProcessMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Job Schedule Sequence</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div id="JobScheduleGrid"></div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div id="JobScheduleSequenceGrid"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/JobScheduleSequence.js"></script>
</asp:Content>

