<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ItemMasterConfiguration.aspx.vb" Inherits="ItemMasterConfiguration" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="container">
        <div class="row mt-4">
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <h5>Ledger Master Client Name</h5>
                <div id="LedgerMasterDropDown"></div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <h5>Ledger Wise Data Grid</h5>
                <div id="LedgerWiseDataGrid"></div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div style="float: right" class="row mt-1 p-2">
                <div style="width: auto; padding: 2px;">
                    <input type="button" value="Update" class="btn btn-primary active p-1" id="BtnUpdate" />
                </div>
            </div>
        </div>

    </div>
    <script src="CustomJS/ItemMasterConfiguration.js" type="text/javascript"></script>

</asp:Content>

