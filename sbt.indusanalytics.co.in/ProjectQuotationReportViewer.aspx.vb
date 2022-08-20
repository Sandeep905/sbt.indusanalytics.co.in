
Imports System.Data
Imports System.Data.SqlClient
Imports Connection
Imports Microsoft.Reporting.WebForms
Imports Newtonsoft.Json

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

            Dim DTDetail As DataTable = GetDataTable("Select PCM.ProductName,/*PQC.ProductInputSizes*/ '' AS Specification,PQC.Quantity,PQC.Rate,PQC.Amount,PQC.FinalAmount AS TotalAmount,Isnull(PQ.FreightAmount,0) as FreightAmount,PQC.ProductHSNID as HSN,PHM.GSTTaxPercentage as GST from ProductQuotationContents as PQC inner join  ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join ProductQuotation as PQ on PQ.ProductEstimateID = PQC.ProductEstimateID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PQC.ProductHSNID  where PQ.CompanyID = " & GBLCompanyID & " and PQ.ProductEstimateID = " & ID)
            Dim table As DataTable = JsonConvert.DeserializeObject(Of DataTable)("")
            Dim searchedValue = ""
            If table IsNot Nothing Then
                For i = 0 To table.Rows.Count - 1
                    Dim ddt = GetDataTable("Select ParameterDisplayName from ProductConfigurationMaster  where ProductCatalogID =" & table.Rows(i)("ProductCatalogID") & " and IsDisplayParameter = 1 and IsDeletedTransaction = 0")
                    For j = 1 To ddt.Rows.Count - 1
                        Dim row As DataRow = table.Select("ParameterDisplayName = '" & ddt.Rows(j)("ParameterDisplayName").ToString() & "'").FirstOrDefault()
                        If Not row Is Nothing Then
                            searchedValue = row.Item("ParameterValue") & ","
                        End If
                    Next

                Next
            End If

            'DTDetail.Rows(0)("Specification") = searchedValue

            Dim dsDetail As ReportDataSource = New ReportDataSource("ProjectQuotationDetail", DTDetail)
            ReportViewer1.LocalReport.DataSources.Add(dsDetail)

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
