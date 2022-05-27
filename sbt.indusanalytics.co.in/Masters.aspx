<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Masters.aspx.vb" Inherits="Masters" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        /*input[type=text]:focus {
            outline: none !important;
            border: 1px solid #42909A;
            box-shadow: 0 0 10px #42909A;
        }*/
        #hiddenBtn_ChooseMaster {
            -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
            animation: mymove 5s infinite;
        }
        /* Safari 4.0 - 8.0 */
        @-webkit-keyframes mymove {
            25% {
                color: purple;
                box-shadow: 0px 10px 10px #42909A;
            }

            50% {
                color: blue;
                box-shadow: 0px 10px 10px #42909A;
            }
        }

        @keyframes mymove {
            25% {
                color: purple;
                box-shadow: 0px 10px 10px #42909A;
            }

            50% {
                color: blue;
                box-shadow: 10px 20px 30px #42909A;
            }
        }
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

                    <a id="btnTabModel" href='#' class="btn myButton hidden" hidden style="margin-top: 1px; margin-left: 2px;">View Details
                    </a>
                    <b id="MasterID" style="display: none"></b><b id="MasterName" style="display: none"></b>
                    <strong id="MasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Masters</strong>
                </div>

                <div class="ContainerBoxCustom">
                    <div id="MasterGrid"></div>
                    <input type="text" id="txtGetGridRow" hidden style="display: none" />
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade col-lg-7 modal-m-l-15" id="largeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptag">Master Creation/Updation</strong>
                    &nbsp;&nbsp;&nbsp;<strong id="LblItemCode"></strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent" style="display: block;">
                        <div class="tab-content">
                            <div id="FieldCntainerRow" class="rowcontents clearfix tab-pane animated fadeInRight active">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-success waves-effect">Save</button>
                    <button type="button" id="BtnSaveAS" class="btn btn-info waves-effect" disabled="disabled">Save As</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-danger waves-effect">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <%-- Model PopUp (Explore) --%>
    <div class="modal fade" id="TabModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="poptagTab">Master View</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>
                <div class="modal-body">
                    <div style="display: block;">
                        <div class="rowcontents clearfix" style="height: auto; margin-left: 0px; padding-left: 0px;">
                            <div style="float: left; padding-bottom: .5em; width: 100%; background-color: #fff; -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);">
                                <div id="TabDiv" style="height: auto; margin-top: 0px; padding-left: 5px;"></div>
                            </div>
                        </div>
                        <div id="DrilDownGrid" style="height: calc(100vh - 175px); overflow: auto; margin-top: 4px">
                        </div>
                    </div>
                </div>
                <div id="btnDivTab" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        localStorage.setItem('activeTab', "Masters.aspx");
        localStorage.setItem('activeID', "");
        localStorage.setItem('activeName', "");

        //function callHref() {
        //    var id = document.getElementById("MasterID").innerHTML.trim();
        //    var name = document.getElementById("MasterName").innerHTML.trim();
        //    if (id === "") return;
        //    if (name === "") return;
        //    //var temp = { MasterID: id, MasterName: name }
        //    document.getElementById("btnImportData").href = "BulkItemsImport.aspx?MasterID=" + id + "&MasterName=" + name;
        //    //document.getElementById("btnImportData").href = "BulkItemsImport.aspx?Para=" + temp;
        //}
    </script>

    <script src="CustomJS/AllValidation.js"></script>
    <script src="CustomJS/DynamicMasters.js"></script>
</asp:Content>

