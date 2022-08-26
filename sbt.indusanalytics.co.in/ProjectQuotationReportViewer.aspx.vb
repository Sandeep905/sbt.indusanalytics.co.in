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
        Dim ID = Request.QueryString("t")
        If Not IsPostBack Then

            ReportViewer1.Reset()
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ProjectQuotation.rdlc")

            Dim DTMain As DataTable = GetDataTable("Select PQ.CreatedDate as QuotationDate,EstimateNo,LM.LedgerName,SP.LedgerName as SalesPerson  from ProductQuotation as PQ  inner join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID  inner join LedgerMaster as SP on sp.LedgerID = PQ.SalesPersonID where PQ.CompanyID = " & GBLCompanyID & " and ProductEstimateID = " & ID)
            Dim dsMain As ReportDataSource = New ReportDataSource("ProjectQuotationMain", DTMain)

            ReportViewer1.LocalReport.DataSources.Add(dsMain)

            Dim DTDetail As DataTable = GetDataTable("Select PCM.ProductName,PQC.Quantity,PQC.Rate,PQC.Amount,PQC.UnitCost,PQC.FinalAmount AS TotalAmount,Isnull(PQ.FreightAmount,0) as FreightAmount,PHM.HSNCode as HSN,Round(PQC.FinalAmount/100*PHM.GSTTaxPercentage,2) as GSTAMT,PHM.GSTTaxPercentage as GST from ProductQuotationContents as PQC inner join  ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join ProductQuotation as PQ on PQ.ProductEstimateID = PQC.ProductEstimateID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PQC.ProductHSNID  where PQ.CompanyID = " & GBLCompanyID & " and PQ.ProductEstimateID = " & ID)

            Dim sum = New ReportParameter("TOTALINWORD", db.ReadNumber((DTDetail.Compute("Sum(TotalAmount)", "") + DTDetail.Compute("Sum(GSTAMT)", "") + DTDetail.Compute("Sum(FreightAmount)", "")).ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()
            Dim GST = New ReportParameter("GSTINWORD", db.ReadNumber(DTDetail.Compute("Sum(GSTAMT)", "").ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()

            Dim dsDetail As ReportDataSource = New ReportDataSource("ProjectQuotationDetail", DTDetail)
            ReportViewer1.LocalReport.SetParameters(sum)
            ReportViewer1.LocalReport.SetParameters(GST)
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
