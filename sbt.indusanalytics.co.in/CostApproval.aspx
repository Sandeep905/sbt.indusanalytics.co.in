<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="CostApproval.aspx.vb" Inherits="CostApproval" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <a title="Comments" id="BtnNotification" class="iconButton" style="float: right"><i class="fa fa-bell fa-2x fa-fw" style="font-size: 14px;"></i></a>
            <div id="image-indicator"></div>
            <input id="BtnLoadBooking" type="button" class="btn btn-primary" value="Load From Quotes" />
            <input id="BtnShowListCostApp" type="button" class="btn btn-primary" value="Show List" />
            <input type="button" class="btn btn-danger waves-effect" onclick="showdetailsContainer()" value="Close"/>
            <div id="FieldCntainerRow" class="rowcontents clearfix tab-pane animated fadeInRight active">
                <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                    <b class="font-11">Approval No</b>
                    <input type="text" id="APPNo" class="forTextBox disabled" style="float: left; width: 100%;" readonly="" />
                </div>

                <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                    <b class="font-11">Approval Date</b>
                    <div id="ApprovalDate" style="float: left; width: 100%;"></div>
                </div>
                <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                    <b class="font-11">Approval Applied Upto</b><br />
                    <div id="DivToDate" style="float: left; width: 100%;"></div>
                </div>
                <div class="col-xs-6 col-sm-3 col-md-2 col-lg-2">
                    <b class="font-11">Currency </b><a href="https://www.google.com/search?q=currency+conversion+usd+to+inr" target="_blank">Check here</a><br />
                    <input id="TxtCurrency" type="text" class="forTextBox" value="INR" placeholder="Currency Code" title="Currency" style="float: left; max-width: 90px; width: 50%; height: auto;" readonly="readonly" />
                    <input id="TxtCurrencyValue" class="forTextBox" value="1" maxlength="4" placeholder="Con. value" title="Currency Conversion value" style="max-width: 65px; float: left; width: 50%; border-radius: 4px" type="text" readonly="readonly" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div id="GridJobDetails"></div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div id="GridApprovalWindow"></div>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <textarea id="txtRemark" placeholder="Enter your remark here" class="forTextBox"></textarea>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <button id="BtnRemoveQuantity" type="button" class="btn btn-info">Remove Qty</button>
                    <button id="BtnSaveCostApp" type="button" class="btn btn-success">Save</button>
                    <button id="BtnDeleteCostApp" type="button" class="btn btn-danger">Delete</button>
                    <button id="BtnNewCostApp" type="button" class="btn btn-primary">New</button>
                    <input id="CategoryID" style="display: none" />
                </div>
            </div>

            <div id="myModal" class="rowcontents clearfix tab-pane animated fadeInRight hidden">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div role="tabpanel">
                        <div id="GridLoadBooking"></div>
                        <input type="text" id="BookingID" style="display: none" />
                        <input type="text" style="display: none;" name="BookingNo" id="BookingNo" value="" />
                        <input type="text" id="LID" style="display: none" />
                    </div>
                    <div class="modal-footer" style="border-top: 1px solid #42909A;">
                        <button type="button" id="BtnLoad" class="btn btn-link waves-effect">Load</button>
                    </div>
                </div>
            </div>

            <div id="myModal_1" class="rowcontents clearfix tab-pane animated fadeInRight hidden">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div role="tabpanel">
                        <div id="Grid_Show_list"></div>
                    </div>

                    <div class="modal-footer" style="border-top: 1px solid #42909A;">
                        <button type="button" id="Btn_Ok_1" class="btn btn-link waves-effect">Load</button>
                    </div>
                </div>
            </div>

            <input type="text" id="Txt_Last_App_No" style="display: none" />
            <input type="text" id="Txt_App_No" style="display: none" />

            <script type="text/javascript">

                $("#ApprovalDate").dxDateBox({
                    formate: 'date',
                    pickerType: "rollers",
                    value: new Date().toISOString().substr(0, 10),
                    min: new Date().toISOString().substr(0, 10)
                    //formatString: 'dd/MMM/yyyy'
                });

                //$("#DivFromDate").dxDateBox({
                //    formate: 'date',
                //    value: new Date().toISOString().substr(0, 10),
                //    //formatString: 'dd/MMM/yyyy'
                //});

                $("#DivToDate").dxDateBox({
                    formate: 'date',
                    pickerType: "rollers",
                    value: new Date().toISOString().substr(0, 10),
                    min: new Date().toISOString().substr(0, 10)
                    // formatString: 'mm-dd-yyyy'
                });

                var priorities = ["Consolidated", "Detailed"];
                $("#radioGroup").dxRadioGroup({
                    items: priorities,
                    value: priorities[0],
                    layout: 'horizontal'
                });
            </script>

        </div>
    </div>
    <script src="CustomJS/CostApproval.js"></script>

</asp:Content>

