<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="MachineWiseSchedule.aspx.vb" Inherits="MachineWiseSchedule" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <input type="button" name="BtnCopySchedule" class="btn btn-warning" value="Copy Suggested Schedule" id="BtnCopySchedule" />
                    <input type="button" name="BtnSave" class="btn btn-info" value="Save Schedule" id="BtnSave" />
                    <input type="button" name="BtnPrint" class="btn btn-primary" value="Print Schedule" id="BtnPrint" />
                    <strong id="ProcessMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Machine Wise Schedule</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto">
                    <div id="OptionScheduleType"></div>
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                        <div id="MachineGrid"></div>
                    </div>
                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">
                        <div id="MachineScheduleGrid"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/MachineWiseSchedule.js"></script>
</asp:Content>

