Imports System.Data
Imports System.Data.SqlClient
Imports Connection
Imports Microsoft.Reporting.WebForms

Partial Class ProjectQuotationReportViewer
    Inherits System.Web.UI.Page
    Dim GBLCompanyID, TransactionID, IsDirect, QueryStr As String
    Dim db As New DBConnection

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim ID = Request.QueryString("t")
        If Not IsPostBack Then

            ReportViewer1.Reset()
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ProjectQuotation.rdlc")

            Dim DTMain As DataTable = GetDataTable("Select PQ.Narration, Replace(Convert(Nvarchar(30),PQ.CreatedDate,106),'','-') as QuotationDate,EstimateNo,LM.LedgerName,LM.Address1 as ClientAddress,SP.LedgerName as SalesPerson  from ProductQuotation as PQ  inner join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID  inner join LedgerMaster as SP on sp.LedgerID = PQ.SalesPersonID where PQ.CompanyID = " & GBLCompanyID & " and ProductEstimateID = " & ID)
            Dim dsMain As ReportDataSource = New ReportDataSource("ProjectQuotationMain", DTMain)
            ReportViewer1.LocalReport.DataSources.Add(dsMain)

            Dim DtTandC As DataTable = GetDataTable("Select Nullif(FooterText,'') As FooterText from UserMaster Where CompanyID=" & GBLCompanyID & " and UserId=" & GBLUserID & "")
            Dim DsTandC As ReportDataSource = New ReportDataSource("TandC", DtTandC)

            ReportViewer1.LocalReport.DataSources.Add(DsTandC)

            Dim DTDetail As DataTable = GetDataTable("Select PQC.ProductDescription,PQC.PackagingDetails,PQC.DescriptionOther, PCM.ProductName,PQC.GSTPercantage,PQC.Quantity,PQC.Rate,PQC.Amount,PQC.UnitCost,PQC.FinalAmount AS TotalAmount,Isnull(PQ.FreightAmount,0) as FreightAmount,PHM.HSNCode as HSN,Round(PQC.GSTAmount,2) as  GST from ProductQuotationContents as PQC inner join  ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join ProductQuotation as PQ on PQ.ProductEstimateID = PQC.ProductEstimateID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PQC.ProductHSNID  where PQ.CompanyID = " & GBLCompanyID & " and PQ.ProductEstimateID = " & ID)

            Dim sum = New ReportParameter("TOTALINWORD", db.ReadNumber(Math.Round(DTDetail.Compute("Sum(TotalAmount)", "") + DTDetail.Rows(0)("FreightAmount") + DTDetail.Rows(0)("FreightAmount") * 0.18, 0).ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()
            Dim GST = New ReportParameter("GSTINWORD", db.ReadNumber(Math.Round(DTDetail.Compute("Sum(GST)", "") + DTDetail.Rows(0)("FreightAmount") * 0.18, 0).ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()
            Dim IMG = New Uri(Server.MapPath("~/images/AuthorisedSignatory.jpeg")).AbsoluteUri
            Dim AuthorisedSignatory = New ReportParameter("ImageAuthoritys", IMG)
            Dim dsDetail As ReportDataSource = New ReportDataSource("ProjectQuotationDetail", DTDetail)
            Dim FivePerGST As Double = 0
            Dim EighteenPerGST As Double = 0
            Dim TwentyEightPerGST As Double = 0
            Dim TwelvePerGST As Double = 0
            If DTDetail.Rows.Count > 0 Then
                For i = 0 To DTDetail.Rows.Count - 1
                    Select Case DTDetail.Rows(i)("GSTPercantage").ToString()
                        Case "5"
                            FivePerGST += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                        Case "12"
                            TwelvePerGST += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                        Case "18"
                            EighteenPerGST += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                        Case "28"
                            TwentyEightPerGST += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                    End Select
                Next
            End If
            Dim FivePerGSTP = New ReportParameter("FivePerGST", FivePerGST)
            Dim TwentyEightPerGSTP = New ReportParameter("TwentyEightPerGST", TwentyEightPerGST)
            Dim TwelvePerGSTp = New ReportParameter("TwelvePerGST", TwelvePerGST)
            Dim EighteenPerGSTP = New ReportParameter("EighteenPerGST", EighteenPerGST + Convert.ToInt32(DTDetail.Rows(0)("FreightAmount")))
            ReportViewer1.LocalReport.EnableExternalImages = True
            ReportViewer1.LocalReport.SetParameters(sum)
            ReportViewer1.LocalReport.SetParameters(GST)
            ReportViewer1.LocalReport.SetParameters(AuthorisedSignatory)
            ReportViewer1.LocalReport.SetParameters(TwentyEightPerGSTP)
            ReportViewer1.LocalReport.SetParameters(EighteenPerGSTP)
            ReportViewer1.LocalReport.SetParameters(TwelvePerGSTp)
            ReportViewer1.LocalReport.SetParameters(FivePerGSTP)

            ReportViewer1.LocalReport.DataSources.Add(dsDetail)
            ReportViewer1.LocalReport.Refresh()

        End If
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
