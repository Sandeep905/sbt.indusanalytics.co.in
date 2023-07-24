<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="LedgerMaster.aspx.vb" Inherits="LedgerMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
            <div class="dialogboxContainerMainMAster">
                <div class="DialogBoxCustom" style="background-color: #fff; padding-bottom: 2px">
                    <div id="RadioMasterList"></div>
                    <button type="button" id="CreateButton" class="btn btn-primary btn-sm waves-effect">Create</button>
                    <button type="button" id="EditButton" onclick="OpenPopup(this)" class="btn btn-info btn-sm waves-effect">Edit</button>
                    <button type="button" id="DeleteButton" class="btn btn-danger btn-sm waves-effect">Delete</button>
                    <button type="button" id="ShowListButton" class="btn btn-secondary btn-sm waves-effect">Show List</button>
                    <button type="button" id="btnConvertToConsignee" class="btn btn-secondary btn-sm waves-effect hidden">Save As Consignee</button>
                    <button type="button" id="btnMachineAllo" class="btn btn-secondary btn-sm waves-effect">Machine Allocation</button>
                    <button type="button" id="btnApMachineAllo" class="btn btn-primary btn-sm waves-effect hidden">AP Machine Allocation</button>
                    <button type="button" id="btnItemGroupAllo" class="btn btn-secondary btn-sm waves-effect hidden">Item Group Allocation</button>
                    <button type="button" id="btnTabModel" class="btn btn-dark waves-effect hidden">View Details</button>
                    <b id="MasterID" hidden style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Masters</strong>
                </div>

                <div class="ContainerBoxCustom">
                    <div id="MasterGrid"></div>
                    <input type="text" id="txtGetGridRow" style="display: none" />
                </div>
            </div>
        </div>
    </div>
    <div id="LoadIndicator"></div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade col-lg-7 modal-m-l-15" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Ledger Master Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div class="tab-content">
                        <div id="FieldCntainerRow" role="tabpanel" class="rowcontents clearfix tab-pane animated fadeInRight active">
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="btnAllocateItems" style="float: left" class="btn btn-warning btn-sm waves-effect hidden">Allocate Items</button>
                    <button type="button" id="btnConcernPerson" class="btn btn-dark btn-sm waves-effect hidden">Contact Person</button>
                    <button type="button" id="BtnNew" class="btn btn-primary waves-effect" style="color: none">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Explore) --%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="TabModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptagTab">Ledger Master View</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div style="display: block; padding-top: 20px; padding-right: 0px">
                        <div style="background-color: #fff; -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                            <div id="TabDiv" style="height: auto; margin-top: 0px; padding-left: 5px;"></div>
                        </div>
                        <div id="DrilDownGrid"></div>
                    </div>
                </div>
                <div id="btnDivTab" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <%--Item Allocation--%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="ItemAllocationModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="ItemAllocationtag">Item Allocation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" id="clodeItmeModal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="tab-content" style="margin-bottom: 0em">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="ListIfItemsGrid"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnItmeApply" style="float: left" class="btn btn-warning btn-sm waves-effect ">Apply</button>
                </div>
            </div>
        </div>
    </div>

    <%--ConcernPerson Model PopUp (Edit update delete) --%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="ConcernPersonModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="ConcernPersontag">Contact Person</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="tab-content" style="margin-bottom: 0em">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridPerson"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="ConcernPersonBtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <%--AP MachineAllocation Model PopUp (Edit update delete) --%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="APMachineAllocationModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>Associate Machine Allocation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="tab-content" style="margin-bottom: 0em">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <label>Machine Name</label>
                            <div id="selMachine"></div>
                        </div>
                        
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <input type="button" id="VendorMachineList" value ="Show All Machine" class="btn btn-success" />
                        </div>

                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridMachineSlab"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnSaveAPMachineAllocation" class="btn btn-success waves-effect">Save</button>
                </div>
            </div>
        </div>
    </div>

    <%--MachineAllocation Model PopUp (Edit update delete) --%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="MachineAllocationModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="MachineAllocationtag">Emp..Machine Allocation Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div class="tab-content" style="margin-bottom: 0em">
                        <div id="FieldMachineAllocation" role="tabpanel" class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <label>Name</label>
                            <div id="selEmployetName"></div>
                            <div style="min-height: 15px; float: left; width: 100%"><strong id="ValStrEmployetName" style="color: red; font-size: 10px; display: block"></strong></div>
                        </div>

                        <div id="DivMachineAllocation" role="tabpanel" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="GridMachineAllocation"></div>
                            <textarea id="MachineId" style="display: none;">null</textarea>
                        </div>
                    </div>
                </div>
                <div id="MachineAllocationbtnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="MachineAllocationBtnNew" class="btn btn-primary waves-effect" style="color: none">New</button>
                    <button type="button" id="MachineAllocationBtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="MachineAllocationBtnSave" class="btn btn-success waves-effect">Save</button>
                </div>
            </div>
        </div>
    </div>


    <%--Item Goup Model PopUp (Edit update delete) --%>
    <div class="modal col-lg-7 modal-m-l-15 fade" id="ItemGoupAllocationModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="ItemGoupAllocationtag">Supp.ItemGroup Allocation Creation/Updation</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="ItemGoupAllocationContenerContent" style="display: block; padding-top: 0px; padding-right: 0px;">
                        <div class="tab-content" style="margin-bottom: 0em">
                            <div class="rowcontents clearfix">
                                <div id="FieldItemGoupAllocation" role="tabpanel" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 tab-pane animated fadeInRight active">
                                    <label>Name</label>
                                    <div id="selSuppName"></div>
                                    <strong id="ValStrselSuppName" style="color: red; font-size: 10px; display: block"></strong>
                                </div>

                                <div id="DivItemGoupAllocation" role="tabpanel" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-pane animated fadeInRight">
                                    <div id="GridItemGoupAllocation"></div>
                                    <div id="GridSpareGroupAllocation"></div>
                                    <textarea id="TxtItemGroupNameID" style="display: none;">null</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="ItemGroupAllocationbtnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="ItemGroupAllocationBtnNew" class="btn btn-primary waves-effect" style="color: none">New</button>
                    <button type="button" id="ItemGroupAllocationBtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                    <button type="button" id="ItemGroupAllocationBtnSave" class="btn btn-success waves-effect">Save</button>
                </div>
            </div>
        </div>
    </div>


    <script>
        localStorage.setItem('activeID', "");
        localStorage.setItem('activeName', "");
    </script>
    <script src="CustomJS/AllValidation.js"></script>
    <script src="CustomJS/LedgerMaster.js"></script>

</asp:Content>

