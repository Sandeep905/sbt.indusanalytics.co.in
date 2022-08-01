<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="ProductMaster.aspx.vb" Inherits="ProductMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding-0 margin-0">
        <div id="image-indicator"></div>

        <div id="FieldCntainerRow" class="clearfix tab-pane animated fadeInRight active">
            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                <b class="font-11">Catalog Code</b>
                <input type="text" id="TxtCataLogCode" class="forTextBox disabled" style="float: left; width: 100%;" readonly="" />
            </div>
            <%--<div class="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                <b class="font-11">Catalog Type</b>
                <div id="SelCatalogType"></div>
            </div>--%>
            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                <b class="font-11">Category</b>
                <div id="SelCategory"></div>
            </div>
            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
                <b class="font-11">Ref. Product Code</b>
                <input type="text" id="TxtRefProductCode" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                <b class="font-11">Product HSN</b>
                <div id="SelProductHSN"></div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <b class="font-11">Product Name</b>
                <input type="text" id="TxtProductName" placeholder="Product Name" class="forTextBox" />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-5 col-lg-6">
                <b class="font-11">Product Description</b>
                <input id="TxtProductDesc" type="text" class="forTextBox" value="" placeholder="Product Description" title="Product Description" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <input type="button" name="btnProductConfig" id="btnProductConfig" value="Product Configuration" class="btn btn-primary" />
                <input type="button" name="btnVendorRateSetting" id="btnVendorRateSetting" value="Vendor Rates" class="btn btn-secondary" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div id="gridProductConfig"></div>
                <div id="gridVendorRateSetting" style="display: none"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div id="gridOperation"></div>
                <textarea id="OperId" class="hidden"></textarea>
                <textarea id="DefaultOperId" class="hidden"></textarea>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <b class="font-11">Remark</b>
                <textarea id="TxtRemark" placeholder="Enter your remark here" class="forTextBox m-t--5"></textarea>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <b class="font-11">Product Image</b>
                <input type="button" name="BtnRemoveFile" id="BtnRemoveFile" value="x" class="btn btn-danger p-t-0 p-b-0" />
                <input type="file" capture="camera" name="photo" accept=".png, .jpg, .jpeg, .gif" id="file" />
                <div style="clear: both">
                    <img src="#" id="PreviewAttachedFile" style="display: none; width: auto; height: 200px" />
                </div>
            </div>
            <div class="modal-footer col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <button id="BtnNew" type="button" class="btn btn-secondary">New</button>
                <button id="BtnSave" type="button" class="btn btn-success">Save</button>
                <input type="button" class="btn btn-primary" value="Show List" id="BtnShowList" onclick="setGridShowDisplay('none', 'block')" />
                <input id="ProductID" style="display: none" />
            </div>
        </div>

        <div id="myModal_1" class="clearfix tab-pane animated fadeInLeft">
            <div class="modal-footer">
                <button id="BtnEdit" type="button" class="btn btn-primary waves-effect">Edit</button>
                <button id="BtnDelete" type="button" class="btn btn-danger">Delete</button>
                <input type="button" value="Close" class="btn btn-secondary" onclick="setGridShowDisplay('block','none')" />
            </div>
            <div role="tabpanel">
                <div id="GridShowlist"></div>
            </div>
        </div>
    </div>

    <script src="CustomJS/ProductMaster.js"></script>
    <script src="Production/js/FileAttachment.js"></script>
</asp:Content>

