<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="VendorMachineAllocation.aspx.vb" Inherits="VendorMachineAllocation" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        .dx-tab-selected {
            background-color: #0a5696 !important;
            color: white !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px; overflow: hidden;">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="tabs">
                        <div class="tabs-container"></div>
                    </div>
                    <div>
                        <div class="row clearfix">
                            <div id="container">
                                <div id="image-indicator"></div>
                                <div class="dialogboxContainerMainMAster" style="padding-bottom: 10px">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label>Vandor Machine Allocation Data:</label>
                                        <div id="VMAGridData"></div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <div class="modal-footer">
                                        <button type="button" id="BtnUpDate" class="btn btn-primary btn-sm waves-effect hidden">Up Date</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/VendorMachineAllocation.js"></script>
</asp:Content>

