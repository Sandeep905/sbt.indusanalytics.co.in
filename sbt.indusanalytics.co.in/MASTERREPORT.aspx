<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="MASTERREPORT.aspx.vb" Inherits="MASTERREPORT" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="col-12 col-md-12 col-lg-3 col-xl-3">
                                <b>Enquiry From</b>
                                <div id="From" class="form-control form-control-sm"></div>
                            </div>
                            <div class="col-12 col-md-12 col-lg-3 col-xl-3">
                                <b>To</b>
                                <div id="ToDate" class="form-control form-control-sm"></div>
                            </div>
                            <div class="col-12 col-md-12 col-lg-3 col-xl-3">
                                <br />
                                <input type="checkbox" id="myCheckbox">
                                <label for="myCheckbox">Is Applied</label>
                            </div>
                        </div>
                        <div class="row" style="display: flex">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5" style="padding-top: 5px">
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Enquiry No</b>
                                    <div id="EnquiryNo" class="form-control form-control-sm"></div>
                                    <label id="EnquiryNolbl" class="text-danger dx-hidden">Please Select EnquiryNo</label>
                                </div>
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Quotation No</b>
                                    <div id="QuotationNo" class="form-control form-control-sm"></div>
                                    <label id="QuotationNolbl" class="text-danger dx-hidden">Please Select QuotaionNo</label>
                                </div>
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Sales Order No</b>
                                    <div id="SalesOrderNo" class="form-control form-control-sm"></div>
                                    <label id="SalesOrderNolbl" class="text-danger dx-hidden">Please Select SalesOrderNo</label>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-5" style="border-left: 1px solid gray;">
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Client Name</b>
                                    <div id="ClientName" class="form-control form-control-sm"></div>
                                    <label id="ClientNamelbl" class="text-danger dx-hidden">Please Select Client Name</label>
                                </div>
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Vendor Name</b>
                                    <div id="VendorName" class="form-control form-control-sm"></div>
                                    <label id="VendorNamelbl" class="text-danger dx-hidden">Please Select Vendor Name</label>
                                </div>
                                <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                                    <b>Status</b>
                                    <div id="Status" class="form-control form-control-sm"></div>
                                    <label id="Statuslbl" class="text-danger dx-hidden">Please Select Status</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <button type="button" id="BtnReload" class="btn btn-primary btn-sm waves-effect">Reload Data</button>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <label>JobCard:</label>
                            <div id="GridJocardData"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="CustomJS/MASTERREPORT.js"></script>
</asp:Content>

