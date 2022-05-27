<%@ Page Title="Printing Rate Setting" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ClientWisePrintingSetting.aspx.vb" Inherits="Client_Wise_Printing_Setting" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix">
        <div id="image-indicator"></div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-right: 2px; padding-bottom: 2px; padding-top: 2px">
            <div class="DialogBoxCustom" style="margin-left: 0px; float: left; background-color: #fff; padding-left: 5px; padding-right: 5px; padding-bottom: 5px">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin: 0px; padding: 0px; padding-top: 2px">
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Machine</label>
                        <div id="Machine"></div>
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Client</label>
                        <div id="Client"></div>
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Min. Imp. To Be Charged</label>
                        <input class="forTextBox " type="number" name="Quote No." id="Mini_Sheets" value="" />
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Basic Printing Charges</label>
                        <input class="forTextBox " type="number" name="Quote No." id="BPC" value="" />
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Round Off Imp. With</label>
                        <input class="forTextBox " type="number" name="Quote No." id="Roundofimp" value="1000" />
                    </div>
                    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                        <label style="width: 100%;">Type Of Charges</label>
                        <div id="TypeofCharges"></div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div id="DataGrid"></div>
                </div>
                <div class="modal-footer">
                    <input id="BtnSave" type="button" name="btnsave" value="Save" class="btn btn-success" />
                    <input id="BtnDelete" type="button" name="btndelete" value="Delete" class="btn btn-danger" />
                    <input id="BtnShow" type="button" name="btnshowlist" value="Show List" class="btn btn-primary" />
                </div>
            </div>
        </div>
    </div>

    <%--for show list--%>
    <div class="modal fade" id="ModalShowlist" tabindex="-1" role="dialog" style="padding: 0px; margin-top: 0px; margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px; width: auto">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="ForMachineName"></strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px; height: auto">
                    <div style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div class="rowcontents clearfix tab-pane animated fadeInRight active" style="padding-top: 0px; max-height: calc(100vh - 147px); overflow-y: auto">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom: 0px;">
                                    <div id="ShowList"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a id="BtnNext" href='#' class="btn btn-success" style="margin-top: 5px; margin-right: 15px; margin-bottom: 1px; width: 65px; height: 32px; float: right">Next</a>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ClientWisePrintingSetting.js"></script>
</asp:Content>

