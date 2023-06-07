<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="Production_Status.aspx.vb" Inherits="Production_Status" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .timeline {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .timeline-item {
            position: relative;
            padding-left: 3.5rem;
        }

            .timeline-item::before {
                content: "";
                position: absolute;
                top: 0;
                left: 1.75rem;
                width: 0.25rem;
                height: 100%;
                background-color: #007bff;
            }

            .timeline-item .stage {
                position: absolute;
                top: -1.75rem;
                left: 5px;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                background-color: #007bff;
                color: #fff;
                text-align: center;
                line-height: 2.5rem;
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="LoadIndicator"></div>
    <div class="col-12 col-md-12 col-lg-12 col-xl-12 Maincontainer">

        <div class="row" style="padding: 0">
            <div class="row col-12 col-md-12 col-lg-12 col-xl-12">
                <div class="col-12 col-md-12 col-lg-2 col-xl-2 p-2">
                    <b>VendorName</b>
                    <div id="VendorName" class="form-control form-control-sm"></div>
                    <label id="VendorNamelbl" class="text-danger dx-hidden">Please Select Vendor Name</label>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-6 col-xl-6 p-2">
                <div id="RadioBtnMaster"></div>
            </div>


        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-4" style="padding: 0px">
            <div id="GetDataGrid1"></div>
        </div>

        <div class="row col-12 col-md-12 col-lg-6 col-xl-6" style="padding: 0px; margin-left: 5px;">
            <div id="GetDataGrid2"></div>
        </div>

        <div class="col-12 col-md-12 col-lg-2 col-xl-2" style="margin-left: 5px">

            <div class="timeline">
                <div class="timeline-item">
                    <div class="stage">1</div>
                    <div class="fw-bold">Shipped</div>
                    <p>Your item has been shipped.</p>
                    <span>2023-05-01</span>
                </div>
                <div class="timeline-item">
                    <div class="stage">2</div>
                    <div class="fw-bold">In Transit</div>
                    <p>Your item is in transit to the destination.</p>
                    <span>2023-05-02</span>
                </div>
                <div class="timeline-item">
                    <div class="stage">3</div>
                    <div class="fw-bold">Out for Delivery</div>
                    <p>Your item is out for delivery.</p>
                    <span>2023-05-03</span>
                </div>
                <div class="timeline-item">
                    <div class="stage">4</div>
                    <div class="fw-bold">Delivered</div>
                    <p>Your item has been delivered to the destination.</p>
                    <span>2023-05-04</span>
                </div>
            </div>
        </div>
    </div>


    <script src="CustomJS/Production_Status.js"></script>
</asp:Content>

