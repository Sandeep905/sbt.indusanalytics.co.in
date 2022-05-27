<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="DepartmentMaster.aspx.vb" Inherits="DepartmentMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <button type="button" id="CreateButton" class="btn btn-primary btn-sm waves-effect">Create</button>
                    <button type="button" id="EditButton" class="btn btn-info btn-sm waves-effect">Edit</button>
                    <button type="button" id="DeleteButton" class="btn btn-danger btn-sm waves-effect">Delete</button>

                    <b id="DepartmentID" style="display: none"></b><b id="DepartmentDisName" style="display: none"></b>
                    <strong id="DepartmentMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Department Master</strong>
                </div>

                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="ButtonGridDiv" style="height: auto; display: block">
                        <div id="DepartmentGrid" style="width: 100%; min-height: calc(100vh - 85px); float: left;"></div>
                        <input type="text" id="TxtDepartmentID" style="display: none" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px;">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Department Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                        <label>Department Name</label>
                        <input id="DepartmentName" type="text" class="forTextBox" /><br />
                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrDepartmentName" style="color: red; font-size: 12px; display: none"></strong></div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                        <label>Press</label>
                        <div id="SelectBoxPress" style="float: left; width: 100%; height: 30px; border: 1px solid #d3d3d3"></div>
                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrSelectBoxPress" style="color: red; font-size: 12px; display: none"></strong></div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                        <label>Production Seq.No.</label>
                        <input id="ProductionSeqNo" type="number" class="forTextBox" min="0" /><br />
                        <div style="min-height: 20px; float: left; width: 100%"><strong id="ValStrProductionSeqNo" style="color: red; font-size: 12px; display: none"></strong></div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-primary waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <script src="CustomJS/DepartmentMaster.js"></script>
</asp:Content>

