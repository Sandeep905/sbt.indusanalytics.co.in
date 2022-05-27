<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductionOutSource.aspx.vb" Inherits="ProductionOutSource" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div role="tabpanel" class="row" id="EntryForm">
        <div class="dialogboxContainerMainMAster">
            <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-bottom: 2px">
                <div class="col-lg-5 col-md-6 col-sm-8 col-xs-10">
                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 p-l-0 m-t-5"><b class="font-11">Voucher No</b></div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-7 p-l-0">
                        <input type="text" id="LblPONo" class="forTextBox" readonly="" disabled="disabled">
                    </div>
                    <div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 p-l-0 m-t-5"><b class="font-11">Date</b></div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-7 margin-0 p-l-0">                        
                        <div id="VoucherDate"></div>
                    </div>
                </div>
                <div class="col-lg-7 col-md-6 col-sm-4 col-xs-2 margin-0 padding-0">
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Production Outsource</strong>
                </div>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-r-0 p-l-10 p-t-5">

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 p-r-0">
                <b class="font-11">Job Card No</b>
                <div id="SelJobCard"></div>
                <strong id="ValStrSelJobCard" style="color: red; font-size: 12px; display: none"></strong>
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 p-r-0">
                <b class="font-11">Vendor</b>
                <div id="SelVendorName"></div>
                <strong id="ValStrSelVendorName" style="color: red; font-size: 12px; display: none"></strong>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 p-r-0">
                <b class="font-11">Place of Supply</b>
                <input type="text" id="TxtDestination" class="forTextBox" />
            </div>

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 p-r-0">
                <b class="font-11">Operator</b>
                <div id="SelOperators"></div>
                <strong id="ValStrSelOperators" style="color: red; font-size: 12px; display: none"></strong>
            </div>

            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 p-r-0">
                <b class="font-11">Machine</b>
                <div id="SelMachines"></div>
                <strong id="ValStrSelMachines" style="color: red; font-size: 12px; display: none"></strong>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-r-0">
                <div id="gridJobCardContentsList"></div>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-r-0">
                <div id="gridProcessDetail"></div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-r-0">
                <div id="gridAddedProcessDetail"></div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-r-0">
                <div id="gridAddedContentsDetail"></div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 p-r-0">
                <b class="font-11">Remarks</b>
                <textarea id="TxtRemarks" class="forTextBox m-t-0"></textarea>
            </div>
        </div>
    </div>

    <%-- Model Add Material--%>
    <div class="modal fade" id="largeModalMaterials" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" >
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag"></strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" >
                    <ul class="nav nav-tabs tab-col-red" role="tablist" style="color: green; border: none; display: none">
                        <li role='presentation' class="active"><a id="AnchorFieldPlannedJobProcess" href="#ReqGrid" data-toggle='tab' style='background-color: none;'>Material Selection</a></li>
                    </ul>
                    <div class="row clearfix">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="active">
                                <div class="tab-pane animated fadeInDown col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="gridShowSelectedProcess"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="OptionItemIssuedList"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="gridMaterialsDetail"></div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="gridAddedMaterialsDetail"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A;">
                    <button type="button" id="BtnApplyMaterial" class="btn btn-info waves-effect" data-dismiss="modal">Apply Material</button>
                </div>
            </div>

        </div>
    </div>

    <%-- Model Show List--%>
    <div class="modal fade" id="largeModalShowList" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" >
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Outsource List</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" >
                    <div class="row clearfix">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div role="tabpanel" class="active">
                                <div class="tab-pane animated fadeInDown col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div id="gridShowList"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-top: 0em; border-top: 1px solid #42909A;">
                    <button type="button" id="BtnEdit" class="btn btn-primary waves-effect">Edit</button>
                    <button type="button" id="BtnPrint" class="btn btn-info waves-effect">Print</button>
                    <button type="button" id="BtnDelete" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer" style="border-top: 1px solid #42909A;">
        <button type="button" id="BtnNew" class="btn btn-warning waves-effect">New</button>
        <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
        <button type="button" id="BtnShowList" class="btn btn-primary waves-effect">ShowList</button>
    </div>
    <script src="CustomJS/ProductionOutsource.js?<%=System.Configuration.ConfigurationManager.AppSettings("Version")%>"></script>
</asp:Content>

