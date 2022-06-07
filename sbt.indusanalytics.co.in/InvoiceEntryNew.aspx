<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="InvoiceEntryNew.aspx.vb" Inherits="InvoiceEntryNew" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        /* Thanku */
        .myModal_thank {
            display: block; /* Hidden by default */
            position: fixed; /* Fixed/sticky position */
            bottom: 3px; /* Place the button at the bottom of the page */
            right: 5px; /* Place the button 30px from the right */
            z-index: 99; /* Make sure it does not overlap */
            border: none; /* Remove borders */
            outline: none; /* Remove outline */
            color: white; /* Text color */
            cursor: pointer; /* Add a mouse pointer on hover */
            /*padding: 15px;*/ /* Some padding */
            /*border-radius: 10px;*/ /* Rounded corners */
            background-color: white;
            /*background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);*/
        }


        /* Modal Content */
        .myModal_thank-content {
            background-color: transparent;
            margin: auto;
            padding: 0px;
            z-index: 4;
            border: 0px solid #888;
            width: 35%;
            height: 35%;
            /*border-radius: 7px;*/
            margin-top: 0em;
        }

        .myModal_thank .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #ccc;
            color: black;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            /* Position the tooltip */
            position: absolute;
            z-index: 1;
            /*top: 0px;*/
            right: 105%;
        }

        .myModal_thank:hover .tooltiptext {
            visibility: visible;
        }

        .mini_thank {
            color: #FF0000; /*#aaaaaa;*/
            float: right;
            font-size: 30px;
            font-weight: bold;
            margin-top: 0em;
        }

            .mini_thank:hover,
            .mini_thank:focus {
                color: #D18297;
                text-decoration: none;
                cursor: pointer;
            }

        .max_thank {
            color: #FF0000; /*#aaaaaa;*/
            float: right;
            font-size: 30px;
            font-weight: bold;
            margin-top: 0em;
        }

            .max_thank:hover,
            .max_thank:focus {
                color: #D18297;
                text-decoration: none;
                cursor: pointer;
            }

        .ContainerDiv {
            width: 100%;
            height: 72px;
            border-radius: 4px;
            margin: 2px;
            background-color: green;
            color: #fff;
            padding: 2px 5px 2px 5px;
        }

        .MsgDiv {
            display: block; /* Hidden by default */
            position: relative; /* Fixed/sticky position */
            z-index: 99; /* Make sure it does not overlap */
            border: none; /* Remove borders */
            outline: none; /* Remove outline */
            float: right;
            width: 20px;
            height: 16px;
            background-color: rgba(0, 0, 0, 0.3);
            color: #fff;
            text-align: center;
            font: bold;
            font-weight: 900;
            padding: 0px 5px 0px 5px;
            border-radius: 4px;
            cursor: pointer;
        }

        /* Modal ContentMsg */
        .MsgDiv-content {
            background-color: transparent;
            margin: auto;
            padding: 0px;
            z-index: 4;
            border: 0px solid #888;
            width: 35%;
            height: 35%;
            margin-top: 0em;
        }

        .MsgDiv .tooltiptextMsg {
            visibility: hidden;
            width: 72px;
            background-color: #ccc;
            color: black;
            text-align: center;
            border-radius: 3px;
            padding: 5px 0;
            /* Position the tooltip */
            position: absolute;
            z-index: 1;
            top: 0px;
            /*right: 105%;*/
        }

        .MsgDiv:hover .tooltiptextMsg {
            cursor: pointer;
            visibility: visible;
        }

        .DayDate {
            float: left;
            width: 100%;
            height: 35px;
            color: #fff;
            text-align: center;
        }

        .TimeDiv {
            float: left;
            width: 100%;
            height: 15px;
            background-color: rgba(0, 0, 0, 0.3);
            color: #fff;
            margin-top: 2px;
            text-align: center;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="row clearfix" style="padding: 0px; margin: 0px; margin-right: -15px">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding: 0px; margin: 0px;">
            <div class="dialogboxContainerMainMAster" style="margin: 0px">
                <div class="DialogBoxCustom" style="float: left; background-color: #fff; padding-left: 0px; padding-bottom: 2px">
                    <div id="ButtonDiv" style="height: auto;">
                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                            <div id="optreceiptradio"></div>
                        </div>
                        <div id="DivCretbtn" class="col-lg-2 col-md-3 col-sm-4 col-xs-6 padding-0 margin-0">
                            <input type="button" name="BtnInvoice" value="Create Invoice" class="btn btn-primary" id="BtnCreateInvoice" />
                            <input type="button" name="BtnInvoice" value="Direct Invoice" class="btn btn-warning hidden" hidden="hidden" id="BtnCreateDirectInvoice" />
                        </div>
                        <div id="DivEdit" class="col-lg-10 col-md-9 col-sm-8 col-xs-12" style="display: none">
                            <input type="button" name="EditCHButton" value="Edit Invoice" class="btn btn-info" id="EditCHButton" />
                            <input type="button" name="DeleteCHButton" value="Delete Invoice" class="btn btn-danger" id="DeleteCHButton" />
                            <button type="button" id="BtnPrint" class="btn btn-primary waves-effect">Print Invoice</button>
                            <button type="button" id="BtnGenerateJSON" class="btn btn-warning waves-effect">Generate JSON</button>
                            <button type="button" id="BtnUpdateEWay" class="btn btn-default waves-effect">Update E-Way</button>
                            <button type="button" id="BtnUpdateIRN" class="btn btn-info waves-effect">Update IRN</button>
                        </div>
                    </div>
                    <strong id="PRMasterDisplayName" class="MasterDisplayName" style="float: right; color: #42909A">Invoice Detail</strong>
                </div>
                <div class="ContainerBoxCustom" style="float: left; height: auto;">
                    <div id="gridCHDList"></div>
                    <div id="gridProcessedCHDList"></div>
                    <input type="text" id="TxtCHDID" style="display: none" />
                    <div id="ExtraDetailDiv" style="display: none">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <b class="font-11">Details :</b>
                            <div role="tabpanel" class="tab-pane animated fadeInRight active" id="StockDetail">
                                <div id="gridOtherDetail"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="image-indicator"></div>

        <div id="myModal_Max" class="myModal_thank" style="border-radius: 100%;">
            <span id="tooltipspan" class="tooltiptext">Click me to show finish goods detail..</span>
            <div class="myModal_Max-content" style="height: 25px; width: 30px">
                <div style="float: left; width: 30px; height: 24px">
                    <span id="MaxBtn" class="max_thank" style="margin-right: 2px">
                        <img src="icon/max.png" style="float: left; width: 25px; height: 25px; margin-top: 0px" /></span>
                    <span id="MinBtn" class="mini_thank" style="margin-right: 2px; display: none">
                        <img src="icon/min.png" style="float: left; width: 25px; height: 25px; margin-top: 0px" /></span>
                </div>
            </div>
        </div>

    </div>

    <%-- Model PopUp (Edit update delete) --%>
    <div class="modal fade" id="largeModal" tabindex="-1" role="dialog" style="margin-left: -7px">
        <div class="modal-dialog modal-lg" role="document" style="">

            <div class="modal-content">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong id="pop_tag">Invoice Entry</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body">
                    <div id="popContenerContent">
                        <div id="FieldCntainerRow" class="row clearfix">
                            <div class="tab-content" style="margin-bottom: 0em">
                                <div role="tabpanel" class="tab-pane active" id="ReqGrid">

                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-7">
                                        <b class="font-11">Document Type</b>
                                        <div id="SelDocumentType"></div>
                                    </div>
                                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-5">
                                        <b class="font-11">Is Export?</b>
                                        <div id="SelIsExport"></div>
                                    </div>
                                    <div class="col-lg-1 col-md-2 col-sm-2 col-xs-6">
                                        <b class="font-11">Currency</b>
                                        <div id="SelCurrencyType"></div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <b class="font-11">Client Name</b>
                                        <div id="TxtClientID"></div>
                                        <%-- <br />
                                            <strong id="ValStrTxtClientName" style="color: red; font-size: 12px; display: none"></strong>--%>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-4 hidden">
                                        <b class="font-11">State</b>
                                        <input type="text" id="TxtClientState" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <b class="font-11">Trade Name</b>
                                        <input type="text" id="TxtMailingName" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>

                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                                        <b class="font-11">Sales Ledger</b>
                                        <div id="SelSalesLedger"></div>
                                        <strong id="ValStrSelSalesLedger" style="color: red; font-size: 12px; display: none"></strong>
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                        <b class="font-11">Del.Note No.</b>
                                        <input type="text" id="TxtDelNote" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                        <b class="font-11">Date</b>
                                        <div id="VoucherDate"></div>
                                    </div>
                                    <div id="DivContactPerson" class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                        <b class="font-11">Consignee</b>
                                        <div id="TxtConsigneeID"></div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                        <b class="font-11">Trade Name</b>
                                        <input type="text" id="TxtConsigneeMailingName" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-4 hidden">
                                        <b class="font-11">State</b>
                                        <input type="text" id="TxtConsigneeState" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>
                                    <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                        <b class="font-11">Destination</b>
                                        <input type="text" id="TxtDestination" class="forTextBox" />
                                    </div>

                                    <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                        <b class="font-11">Shipped From</b>
                                        <div id="SelShippedFrom"></div>
                                        <div id="OptShippedLedgerType" class="hidden"></div>
                                    </div>

                                    <div id="DivShippedLegalName" class="hidden col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                        <b class="font-11">Legal Name</b>
                                        <div id="SelShippedFromLedger"></div>
                                        <b class="font-11">Trade Name</b>
                                        <input type="text" id="TxtShippedMailingName" class="forTextBox" readonly="" disabled="disabled" />
                                    </div>
                                    <div id="DivExportOptionNo">
                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">IGST On Intra</b>
                                            <div id="SelIGSTOnIntra"></div>
                                            <b class="font-11">Reverse Charge</b>
                                            <div id="SelReverseCharge"></div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">E-Commerce</b>
                                            <div id="SelECommerce"></div>
                                            <div id="divECommerceLegalName" class="hidden">
                                                <b class="font-11">Legal Name</b>
                                                <div id="SelECommerceLegalName"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="DivExportOptionYes">
                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Origin Country</b>
                                            <div id="SelOriginCountry"></div>
                                            <b class="font-11">Loading Port</b>
                                            <div id="SelLoadingPort"></div>
                                        </div>

                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Destination Country</b>
                                            <div id="SelDestinationCountry"></div>
                                            <b class="font-11">Discharge Port</b>
                                            <div id="SelDischargePort"></div>
                                        </div>

                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Notify Pary 1</b>
                                            <div id="SelNotifyParty1"></div>
                                            <b class="font-11">EPCG Licence</b>
                                            <input type="text" id="TxtEPCGLicenceNo" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                            <b id="DivNotifyParty2" class="font-11"></b>
                                            <div id="SelNotifyParty2"></div>
                                            <b class="font-11">REX Registration</b>
                                            <input type="text" id="TxtREXRegistrationNo" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Banker</b>
                                            <div id="SelBanker"></div>
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Delivery Terms</b>
                                            <input type="text" id="TxtDeliveryTerms" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
                                            <b class="font-11">Payment Terms</b>
                                            <input type="text" id="TxtPaymentTerms" class="forTextBox" />
                                        </div>
                                    </div>

                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        <div id="DeliveryDetailGrid"></div>
                                    </div>

                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                        <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
                                            <div id="SelLnameChargesGrid"></div>
                                        </div>
                                        <div class="DialogBoxCustom">
                                            <a id="BtnAddLedgerCharge" href="#" class="iconButton">
                                                <i class="fa fa-plus"></i>
                                            </a>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div id="AdditionalChargesGrid"></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 padding-0 margin-0">
                                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                            <b style="">Basic Amount</b>
                                            <input type="text" id="TxtBasicAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                            <b style="">Total Tax</b>
                                            <input type="text" id="TxtTotalTax" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                            <b style="">Round off A/c</b>
                                            <input type="text" id="TxtRoundTaxAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-6">
                                            <b style="">Net Amount</b>
                                            <input type="text" id="TxtNetAmt" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">
                                            <b style="">Total Dispatched Qty</b>
                                            <input type="text" id="TxtTotalDispatchedQty" class="forTextBox" value="0" readonly="" disabled="disabled" />
                                        </div>
                                        <div style="float: left; width: 50%; text-align: right" class="hidden">
                                            <input type="text" id="TxtCGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                            <input type="text" id="TxtSGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                            <input type="text" id="TxtIGSTAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                            <input type="text" id="TxtAfterDisAmt" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                            <input type="text" id="Txt_TaxAbleSum" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                            <input type="text" id="TxtTotalQty" class="forTextBox" value="0" readonly="" disabled="disabled" style="display: none" />
                                        </div>

                                        <div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">
                                            <b style="">Net Weight</b>
                                            <input type="text" id="TxtNetWeight" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">
                                            <b style="">Gross Weight</b>
                                            <input type="text" id="TxtGrossWeight" class="forTextBox" />
                                        </div>
                                    </div>

                                    <div>

                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <b style="">Remark</b>
                                            <input type="text" id="TxtRemark" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <b style="">Invoice Ref.No.</b>
                                            <input type="text" id="TxtInvoiceReferenceNo" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                                            <b style="">Transporter</b>
                                            <div id="SelTransporter"></div>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <b style="">Vehicle No.</b>
                                            <input type="text" id="TxtVehicleNo" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <b style="">Distance</b>
                                            <input type="number" id="TxtDistance" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <b style="">E-Way Bill</b>
                                            <input type="text" id="TxtEWayBillNumber" class="forTextBox" />
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                            <b style="">Date</b>
                                            <div id="DTEWayBillDate"></div>
                                        </div>
                                        <div id="DivIsExportRemarks" class="hidden">
                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                                <b style="">Container Desciption</b>
                                                <textarea id="TxtContainerDescription" class="forTextBox"></textarea>
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                                <b style="">DBK Remarks</b>
                                                <textarea id="TxtDBKRemarks" class="forTextBox"></textarea>
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                                <b style="">Other Remark</b>
                                                <textarea id="TxtOtherRemarks" class="forTextBox"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="btnDiv" class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnNew" class="btn btn-link waves-effect">New</button>
                    <button type="button" id="BtnSave" class="btn btn-link waves-effect">Save</button>
                    <button type="button" id="BtnDeletePopUp" class="btn btn-link waves-effect">Delete</button>
                </div>
            </div>

        </div>
    </div>


    <!-- The Modal InPut parameter Operation calculation-->
    <div class="modal fade" id="modalEwayDetails" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" style="border-radius: 4px; padding-bottom: .5em; padding-right: 0px">
                <div class="DialogBoxCustom" style="float: left; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <strong>E-Way Datails</strong>
                    <a href="javascript:void(0);" class="iconRightDbox btn-danger" data-dismiss="modal">
                        <span data-dismiss="modal" style="font-weight: 900; margin-right: 8px">X</span>
                    </a>
                </div>

                <div class="modal-body" style="position: initial; padding-right: 0px">
                    <div id="DivEwayDetails" class="tab-content" style="margin-bottom: 0em">
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <label class="font-11" for="TxtEWayBillNumber1">E-way Bill No</label>
                            <input type="text" id="TxtEWayBillNumber1" class="forTextBox" />
                        </div>
                        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                            <label class="font-11">E-way Bill Date</label>
                            <div id="DtEWayBillDate1"></div>
                        </div>
                    </div>

                    <div id="DivIRNDetails" class="tab-content hidden" style="margin-bottom: 0em">
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <label class="font-11">Invoice No</label>
                            <input type="text" id="TxtInvoiceNo" class="forTextBox" disabled="disabled" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <label class="font-11">Invoice Date</label>
                            <input type="text" id="TxtInvoiceDate" class="forTextBox" disabled="disabled" />
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-9">
                            <br class="hidden-xs" />
                            <input type="file" id="fileUpload" class="btn waves-effect" onchange="UploadExcel();" />
                        </div>
                        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3">
                            <br class="hidden-xs" />
                            <input type="button" name="btnfetchdata" id="btnfetchdata" class="btn btn-link" value="Fetch" onclick="UploadExcel();" />
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">
                            <label class="font-11" for="TxtInvoiceRefNo">Invoice Ref. No</label>
                            <input type="text" id="TxtInvoiceRefNo" class="forTextBox" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 1px solid #42909A;">
                    <button type="button" id="BtnUpdateDetails" class="btn btn-info waves-effect">Update</button>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="js/xlsx.full.min.js"></script>
    <script src="CustomJS/InvoiceEntryNew.js"></script>
</asp:Content>

