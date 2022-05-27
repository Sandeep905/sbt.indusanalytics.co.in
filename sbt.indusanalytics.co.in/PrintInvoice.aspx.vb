Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection
Partial Class PrintInvoice
    Inherits System.Web.UI.Page
    Dim GBLCompanyID, TransactionID, IsDirect, QueryStr As String
    Dim db As New DBConnection

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        IsDirect = Convert.ToString(HttpContext.Current.Request.QueryString("IsDircetInvoice"))
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))
        If Not IsPostBack Then

            ReportViewer1.Reset()
            'path
            '  ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ReportPurchaseOrder.rdlc")
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/PrintInvoiceMain.rdlc")

            Dim DTPrintCopies As DataTable = GetDataTable("Select NoOfCopies,PageCaption FROM PrintCopies Where PrintForm='INVOICE'")
            Dim ds5 As ReportDataSource = New ReportDataSource("PrintCopies", DTPrintCopies)
            ReportViewer1.LocalReport.DataSources.Add(ds5)

            AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf InvoiceMainSubreportProcessing
            AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf InvoiceDetailsSubreportProcessing
            AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf InvoiceChargesSubreportProcessing
            AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf CompanyMasterSubreportProcessing

        End If
    End Sub

    Private Sub CompanyMasterSubreportProcessing(sender As Object, e As SubreportProcessingEventArgs)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

        Dim DTCompany As DataTable = GetDataTable("SELECT CompanyID, CompanyName,ImportExportCode, Address1, Address2, Address3, City, State, Country, Pincode, ConcerningPerson,ContactNo As MobileNo, Email, Website, StateTinNo As StateCode,CINNo, TallyCompanyName, ProductionUnitAddress As FactoryAddress, CashAgainstDocumentsBankDetails As BankDetails, Address As CompanyAddress, GSTIN,ProductionUnitName, PAN,FAX FROM CompanyMaster Where CompanyID=" & GBLCompanyID & "")

        Dim ds4 As ReportDataSource = New ReportDataSource("CompanyMaster", DTCompany)
        e.DataSources.Add(ds4)
    End Sub

    Private Sub InvoiceChargesSubreportProcessing(sender As Object, e As SubreportProcessingEventArgs)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        IsDirect = Convert.ToString(HttpContext.Current.Request.QueryString("IsDircetInvoice"))
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))

        Dim dsChallanChargesGrid As DataTable = GetDataTable("Select Nullif(LM.LedgerName,'') AS LedgerName,Isnull(IT.TaxPercentage,0) AS TaxRatePer,Isnull(IT.CalculatedON,0) AS CalculateON,Isnull(IT.GSTApplicable,0) AS GSTApplicable,  " &
               " Isnull(IT.TaxInAmount,0) As InAmount,Isnull(IT.Amount,0) As ChargesAmount,Isnull(IT.IsComulative,0) As IsCumulative,Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where LedgerID=LM.LedgerID AND CompanyID=LM.CompanyID AND FieldName='TaxType'),'') AS TaxType,Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where LedgerID=LM.LedgerID AND CompanyID=LM.CompanyID AND FieldName='GSTLedgerType'),'') AS GSTLedgerType,Nullif(IT.LedgerID,'') AS LedgerID  " &
               " From InvoiceTransactionTaxes AS IT INNER JOIN LedgerMaster AS LM ON IT.LedgerID=LM.LedgerID AND IT.CompanyID=LM.CompanyID  " &
               " Where IT.InvoiceTransactionID='" & TransactionID & "' And IT.CompanyID='" & GBLCompanyID & "' And LM.LedgerName Not IN('CGST','SGST','IGST','ROUNDOFF')  " &
               " Order By IT.TransID")

        Dim ds3 As ReportDataSource = New ReportDataSource("InvoiceCharges", dsChallanChargesGrid)
        e.DataSources.Add(ds3)
    End Sub

    Private Sub InvoiceDetailsSubreportProcessing(sender As Object, e As SubreportProcessingEventArgs)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        IsDirect = Convert.ToString(HttpContext.Current.Request.QueryString("IsDircetInvoice"))
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))

        If IsDirect = True Or IsDirect = "True" Then QueryStr = " LEFT" Else QueryStr = " INNER"

        QueryStr = "Select ITD.TransID,ITD.FGTransactionID,ITD.CompanyID,ITD.ProductMasterID,ITD.ProductHSNID,  " &
                        " Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,PGM.HSNCode AS ProductCode,Nullif(ITD.JobName,'') AS JobName,Isnull(ITD.Quantity,0) AS PurchaseQuantity,Isnull(ITD.Rate,0) AS PurchaseRate,Case When Isnull(ITD.RateType,'')='UnitCost' Then 'Per Unit' Else '1000 Unit' End AS PurchaseUnit,  " &
                        " ITD.BasicAmount,ITD.DiscountAmount,ITD.DiscountPercentage,ITD.TaxableAmount,ITD.GSTPercentage AS GSTTaxPercentage,ITD.CGSTPercentage AS CGSTTaxPercentage,ITD.SGSTPercentage AS SGSTTaxPercentage,ITD.IGSTPercentage AS IGSTTaxPercentage,  " &
                        " ITD.CGSTAmount AS CGSTTaxAmount, ITD.SGSTAmount AS SGSTTaxAmount, ITD.IGSTAmount AS IGSTTaxAmount, ITD.GrossAmount AS TotalAmount,Nullif(JB.PONo,'') AS PONo,  " &
                        " JOB.PODate,Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo, JOB.OrderBookingDate,JB.JobBookingNo,  " &
                        " JB.JobBookingDate,FGM.VoucherNo AS DeliveryNoteNo, FGM.VoucherDate AS DeliveryNoteDate,ITD.GrossAmount AS AfterDisAmt,Round(ITM.RoundOffTax,3) As RoundOffAmt,  " &
                        " ITD.OrderBookingID AS DeliveryOrderBookingID, ITD.OrderBookingDetailsID AS DeliveryOrderBookingDetailsID, ITD.JobBookingID AS DeliveryJobBookingID, ITD.JobBookingJobCardContentsID AS DeliveryJobBookingJobCardContentsID  " &
                        " From InvoiceTransactionMain AS ITM  " &
                        " INNER JOIN InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID=ITD.InvoiceTransactionID AND ITM.CompanyID=ITD.CompanyID AND ITD.IsDeletedTransaction=0 " &
                        QueryStr & " JOIN FinishGoodsTransactionMain AS FGM ON ITD.FGTransactionID=FGM.FGTransactionID And ITD.CompanyID=FGM.CompanyID  INNER JOIN ProductHSNMaster As PGM On PGM.ProductHSNID=ITD.ProductHSNID And ITD.CompanyID=PGM.CompanyID " &
                        QueryStr & " JOIN JobOrderBooking AS JOB ON ITD.OrderBookingID=JOB.OrderBookingID AND ITD.CompanyID=JOB.CompanyID AND JOB.IsDeletedTransaction=0" &
                        QueryStr & " JOIN JobOrderBookingDetails AS JOBD ON ITD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID And ITD.OrderBookingID=JOBD.OrderBookingID And ITD.CompanyID=JOBD.CompanyID  " &
                        QueryStr & " JOIN JobBookingJobCard AS JB ON ITD.JobBookingID=JB.JobBookingID AND ITD.CompanyID=JB.CompanyID AND JB.IsDeletedTransaction=0" &
                        " LEFT JOIN ProductMaster AS PM ON ITD.ProductMasterID=PM.ProductMasterID And ITD.CompanyID=PM.CompanyID " &
                        " Where ITM.InvoiceTransactionID='" & TransactionID & "' AND Isnull(ITM.IsDeletedTransaction,0)=0 AND ITM.CompanyID='" & GBLCompanyID & "'   " &
                        " Order By ITD.TransID"
        Dim dsChallanDetail As DataTable = GetDataTable(QueryStr)

        Dim ds2 As ReportDataSource = New ReportDataSource("InvoiceDetail", dsChallanDetail)
        e.DataSources.Add(ds2)
    End Sub

    Private Sub InvoiceMainSubreportProcessing(sender As Object, e As SubreportProcessingEventArgs)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        IsDirect = Convert.ToString(HttpContext.Current.Request.QueryString("IsDircetInvoice"))
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))

        If IsDirect = True Or IsDirect = "True" Then QueryStr = " LEFT" Else QueryStr = " INNER"

        Dim dsSelectedItem As New DataTable
        dsSelectedItem = GetDataTable("Select Distinct ITM.InvoiceTransactionID, ITM.TotalTaxAmount,ITM.TotalBasicAmount,IsNull(ITM.Narration,'') as Narration,  " &
               " ITM.VoucherNo AS InvoiceNo,ITM.CreatedDate As InvoiceDate,LM.LedgerName AS ClientName,CM.LedgerName AS ConsigneeName, ITM.AmountInWords As TotalAmtInWords,'' As GSTAmtInWords,ITM.TotalCGSTTaxAmount,ITM.TotalSGSTTaxAmount,ITM.TotalIGSTTaxAmount,ITM.RoundOffTax, " &
               " ITM.TotalQuantity,ITM.NetAmount,Isnull(C.State,'') AS CompanyState,(Select Distinct StateTinNo From CountryStateMaster Where Isnull(State,'')=Isnull(LMD.State,'')) As ClientStateCode,LMD.GSTNo As ClientGSTIN,LMD.City, LMD.State As ClientState,LMD.MailingAddress As ClientAddress, CMD.State As ConsigneeState,(Select Distinct StateTinNo From CountryStateMaster Where Isnull(State,'')=Isnull(CMD.State,'')) As ConsigneeStateCode,CMD.GSTNo As ConsigneeGSTIN, CMD.MailingAddress As ConsigneeAddress,SLM.LedgerName AS SalesLedgerName,UM.UserName As PreparedBy,TM.LedgerName As TransporterName,FGM.VehicleNo " &
               " From InvoiceTransactionMain AS ITM  " &
               " INNER JOIN InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID=ITD.InvoiceTransactionID And ITM.CompanyID=ITD.CompanyID AND ITD.IsDeletedTransaction=0 " &
               " INNER JOIN LedgerMaster AS LM ON ITM.LedgerID=LM.LedgerID AND ITM.CompanyID=LM.CompanyID  " &
               " INNER JOIN (Select A.[LedgerID] AS LedgerID, A.[CompanyID], A.[City], A.[State], A.[GSTNo],[MailingAddress] From(SELECT [LedgerID], [LedgerGroupID], [CompanyID], [City], [State], [GSTNo],[MailingAddress] FROM(Select [LedgerID], [LedgerGroupID], [CompanyID], [FieldName], nullif([FieldValue],'') as FieldValue From [LedgerMasterDetails] Where CompanyID =" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID =" & GBLCompanyID & " And LedgerGroupNameID=24))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([City], [State], [Country], [Address1], [Address2], [GSTNo],[MailingAddress])) p) AS A Where A.CompanyID=" & GBLCompanyID & " ) AS LMD ON LMD.LedgerID=LM.LedgerID And LMD.CompanyID=LM.CompanyID " &
               " INNER JOIN CompanyMaster as C ON ITM.CompanyID=C.CompanyID INNER JOIN UserMaster As UM On UM.UserID=ITM.CreatedBy And UM.CompanyID=ITM.CompanyID " &
               " LEFT JOIN LedgerMaster AS CM ON ITM.ConsigneeLedgerID=CM.LedgerID AND ITM.CompanyID=CM.CompanyID  " &
               " INNER JOIN (Select A.[LedgerID] AS LedgerID, A.[CompanyID], A.[City], A.[State], A.[GSTNo],[MailingAddress] From(SELECT [LedgerID], [LedgerGroupID], [CompanyID], [City], [State], [GSTNo],[MailingAddress] FROM(Select [LedgerID], [LedgerGroupID], [CompanyID], [FieldName], nullif([FieldValue],'') as FieldValue From [LedgerMasterDetails] Where CompanyID =" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID =" & GBLCompanyID & " And LedgerGroupNameID=44))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([City], [State], [Country], [Address1], [Address2], [GSTNo],[MailingAddress])) p) AS A Where A.CompanyID='" & GBLCompanyID & "' ) AS CMD ON CMD.LedgerID=CM.LedgerID And CMD.CompanyID=CM.CompanyID " &
               " LEFT JOIN LedgerMaster AS SLM ON ITM.SalesLedgerID=SLM.LedgerID And ITM.CompanyID=SLM.CompanyID Left Join FinishGoodsTransactionMain As FGM On FGM.LedgerID=ITM.LedgerID And FGM.CompanyID=ITM.CompanyID And FGM.FGTransactionID=ITD.FGTransactionID And FGM.IsDeletedTransaction=0 LEFT JOIN LedgerMaster As TM On TM.LedgerID=FGM.Transporter And TM.CompanyID=FGM.CompanyID " &
               " Where Isnull(ITM.IsDeletedTransaction,0)=0 AND ITM.CompanyID='" & GBLCompanyID & "'  AND ITM.InvoiceTransactionID='" & TransactionID & "'")

        If dsSelectedItem.Rows.Count > 0 Then
            dsSelectedItem(0)("GSTAmtInWords") = db.ReadNumber(dsSelectedItem(0)("TotalTaxAmount"), "", "", "INR") & " only"
        End If

        Dim ds1 As ReportDataSource = New ReportDataSource("InvoiceMain", dsSelectedItem)
        e.DataSources.Add(ds1)
    End Sub

    Private Function GetDataTable(SqlQuery As String) As DataTable
        Dim dss As DataSet = New DataSet()
        Dim con As New SqlConnection
        Dim dt As DataTable = New DataTable()

        Try
            con = db.OpenDataBase()

            Dim cmd As SqlCommand = New SqlCommand(SqlQuery, con)
            Dim adapter As New SqlDataAdapter(cmd)
            adapter.Fill(dt)
            con.Close()

            Return dt
        Catch ex As Exception
            con.Close()
            Return dt
        End Try
    End Function

End Class
