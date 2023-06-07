<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Production_start.aspx.vb" Inherits="Production_start" %>

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
            <b>Operation<b class="text-danger"> *</b></b>
            <div id="Operation" class="form-control form-control-sm"></div>
            <label id="Operationlbl" class="text-danger dx-hidden">Please Select Operation</label>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-4" style="padding-top: 5px">
            <b>Remaining Quantity For This Process <b class="text-danger"></b></b>
            <input id="remainingValue" disabled="disabled" placeholder="Remaining Quantity For This Process" class="form-control form-control-sm" />
            <label id="remainingValuelbl" class="text-danger dx-hidden"></label>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-4 " style="padding-top: 5px">
            <b>Production Quantity<b class="text-danger"> *</b></b>
            <input id="Quantity" oninput="Validatedsundeep()" placeholder="Quantity" class="form-control form-control-sm" />
            <label id="Quantitylbl" class="text-danger dx-hidden">Quantity should be less then or equal to Allocated QTY</label>

            <%--   <label id="Quantitylbl" class="text-danger dx-hidden"></label>--%>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-12" style="padding: 5px">
            <b>Remark</b>
            <textarea id="Remark" placeholder="Remark" rows="1" class="form-control form-control-sm">Remark</textarea>
        </div>
        <div class="modal-footer">
            <%-- <a id="Start" class="btn btn-primary">Start</a>--%>
            <a id="Save" class="btn btn-success">Start</a>
        </div>
        <div class="p-2">
            <label>RUNNING JOB:</label>

            <div id="StartGrid"></div>
        </div>
    </div>


    <script src="CustomJS/Production_start.js"></script>
</asp:Content>

