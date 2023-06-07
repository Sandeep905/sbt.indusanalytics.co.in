<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Production__End.aspx.vb" Inherits="Production__End" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="LoadIndicator"></div>
    <div class="col-12 col-md-12 col-lg-12 col-xl-12 Maincontainer">
        <div class="row">
            <div class="row col-12 col-md-12 col-lg-12 col-xl-12">
                <div class="col-12 col-md-12 col-lg-2 col-xl-2 p-2">
                    <b>VendorName</b>
                    <div id="VendorName" class="form-control form-control-sm"></div>
                    <label id="VendorNamelbl" class="text-danger dx-hidden">Please Select Vendor Name</label>
                </div>
                <div class="col-12 col-md-12 col-lg-2 col-xl-2 p-2">
                    <b>JobCard No.</b>
                    <div id="JobCardNo" class="form-control form-control-sm"></div>
                    <label id="JobCardNolbl" class="text-danger dx-hidden">Please Select JobCard No</label>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                    <b class="font-11">QuotaionNo</b>
                    <input type="text" placeholder="QuotaionNo" class="forTextBox disabledbutton" id="QuotaionNo" />
                </div>

                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-6">
                    <b class="font-11">EnquiryNo</b>
                    <input type="text" placeholder="EnquiryNo" class="forTextBox disabledbutton" id="EnquiryNo" />
                </div>
            </div>

        </div>
        <div class="p-2">
            <div id="POProductsGrid"></div>
        </div>

        <div class="col-12 col-md-12 col-lg-4 col-xl-4" style="padding-top: 5px">
            <b>Status<b class="text-danger"> *</b></b>
            <div id="Status" class="form-control form-control-sm"></div>
            <label id="Statuslbl" class="text-danger dx-hidden">Please Select Status</label>
        </div>

        <div class="col-12 col-md-12 col-lg-4 col-xl-4 " style="padding-top: 5px">
            <b>Production Quantity<b class="text-danger"> *</b></b>
            <input id="ProductionQuantity" oninput="ValidatedEND" placeholder="ProductionQuantity" class="form-control form-control-sm" />
            <label id="ProductionQuantitylbl" class="text-danger dx-hidden">Quantity should be less then or equal to Allocated QTY</label>

           
        </div>

        <div class="modal-footer">
            <a id="SaveEnd" class="btn btn-success">UPdate</a>
        </div>
    </div>
    <script src="Production_End.js"></script>
</asp:Content>

