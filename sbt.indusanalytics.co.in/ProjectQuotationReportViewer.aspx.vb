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
        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        Dim ID = Request.QueryString("t")
        If Not IsPostBack Then

            ReportViewer1.Reset()
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ProjectQuotation.rdlc")

            Dim DTMain As DataTable = GetDataTable("Select EM.EnquiryNo,PQ.Narration, Replace(Convert(Nvarchar(30),PQ.CreatedDate,106),'','-') as QuotationDate,LEFT(EstimateNo, CHARINDEX('.', EstimateNo + '.') - 1) EstimateNo,PQ.RevisionNo,LM.LedgerName,'GST No. - ' + LM.GSTNo as GSTIN,LM.Address1 +','+ LM.City +','+ LM.State +',' + LM.Pincode as ClientAddress,(SP.LedgerName +  ', Contact No.-' + isnull(SP.TelephoneNo,0)  )  + CHAR(13)+CHAR(10) +'Email -' + nullif(SP.Email,'') as SalesPerson, Replace(Convert(Nvarchar(30),GetDate()+PQ.ValidUpto,106),'','-') as ValidUpto,PQ.DeliveryUpto,PQ.PaymentTerms  from ProductQuotation as PQ inner join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID  and LM.CompanyID = PQ.CompanyID Left Join EnquiryMain as EM on EM.EnquiryID = PQ.EnquiryID and EM.CompanyID = PQ.CompanyID inner join LedgerMaster as SP on sp.LedgerID = PQ.SalesPersonID and SP.CompanyID = PQ.CompanyID where PQ.CompanyID = " & GBLCompanyID & " and ProductEstimateID = " & ID)
            Dim dsMain As ReportDataSource = New ReportDataSource("ProjectQuotationMain", DTMain)
            ReportViewer1.LocalReport.DataSources.Add(dsMain)

            Dim DtTandC As DataTable = GetDataTable("Select Nullif(FooterText,'') As FooterText from UserMaster Where CompanyID=" & GBLCompanyID & " and UserId=" & GBLUserID & "")
            Dim DsTandC As ReportDataSource = New ReportDataSource("TandC", DtTandC)
            ReportViewer1.LocalReport.DataSources.Add(DsTandC)
            Dim DTDetail As DataTable = GetDataTable("Select dbo.CreateOperationName(PQC.ProcessIdStr) as Process,REPLACE(PQC.ProductDescription, CHAR(13) + CHAR(10), ' ') ProductDescription,REPLACE(nullif(PQC.PackagingDetails,''), CHAR(13) + CHAR(10), ' ')  PackagingDetails,REPLACE(nullif(PQC.DescriptionOther,''), CHAR(13) + CHAR(10), ' ') DescriptionOther, PCM.ProductName,PQC.GSTPercantage,PQC.Quantity,PQC.Rate,PQC.Amount,PQC.UnitCost,PQC.FinalAmount AS TotalAmount,Isnull(PQ.FreightAmount,0) as FreightAmount,PHM.HSNCode as HSN,Round(PQC.GSTAmount,2) as  GST,Round(PQC.CGSTAmount,2) as  CGST,Round(PQC.SGSTAmount,2) as  SGST ,Round(PQC.IGSTAmount,2) as  IGST from ProductQuotationContents as PQC inner join  ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join ProductQuotation as PQ on PQ.ProductEstimateID = PQC.ProductEstimateID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PQC.ProductHSNID  where PQ.CompanyID = " & GBLCompanyID & " and PQ.ProductEstimateID = " & ID)
            Dim ApprovedByAndPrintBy As DataTable = GetDataTable("Select TOP(1) isnull(UM.UserName,'') as ApprovedBy,'' as PrintedBy,Isnull(convert(varchar,GetDate(),106),'') as PrintedDate from ProductQuotation PQ LEFT join UserMaster UM on PQ.InternalApprovedUserID = UM.UserID where Isnull(PQ.IsDeletedTransaction,0) = 0 and PQ.ProductEstimateID =" & ID & " and PQ.CompanyID=" & GBLCompanyID)

            For i = 0 To ApprovedByAndPrintBy.Rows.Count - 1
                ApprovedByAndPrintBy.Rows(i)("PrintedBy") = UserName
            Next

            Dim sum = New ReportParameter("TOTALINWORD", db.ReadNumber(Math.Round(DTDetail.Compute("Sum(TotalAmount)", "") + DTDetail.Rows(0)("FreightAmount") + DTDetail.Rows(0)("FreightAmount") * 0.18, 0).ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()
            Dim GST = New ReportParameter("GSTINWORD", db.ReadNumber(Math.Round(DTDetail.Compute("Sum(GST)", "") + DTDetail.Rows(0)("FreightAmount") * 0.18, 0).ToString(), "Rupees", "Paise", "INRs")) ' DTDetail.Compute("Sum(TotalAmount)", "").ToString()
            Dim IMG = New Uri(Server.MapPath("~/images/AuthorisedSignatory.jpeg")).AbsoluteUri
            Dim AuthorisedSignatory = New ReportParameter("ImageAuthoritys", IMG)
            Dim dsDetail As ReportDataSource = New ReportDataSource("ProjectQuotationDetail", DTDetail)
            Dim DataSetFooter As ReportDataSource = New ReportDataSource("DataSetFooter", ApprovedByAndPrintBy)
            Dim FivePerGSTA As Double = 0
            Dim EighteenPerGSTA As Double = 0
            Dim TwentyEightPerGSTA As Double = 0
            Dim TwelvePerGSTA As Double = 0
            Dim FivePerGST As Double = 0
            Dim EighteenPerGST As Double = 0
            Dim TwentyEightPerGST As Double = 0
            Dim TwelvePerGST As Double = 0

            Dim FrieghtIGST As New ReportParameter
            Dim FrieghtSGST As New ReportParameter
            Dim FrieghtCGST As New ReportParameter
            If DTDetail.Rows.Count > 0 Then
                If DTDetail.Rows(0)("IGST") > 0 Then
                    FrieghtIGST = New ReportParameter("FreightIGST", (DTDetail.Rows(0)("FreightAmount") * 0.18).ToString())
                Else
                    FrieghtCGST = New ReportParameter("FreightCGST", ((DTDetail.Rows(0)("FreightAmount") * 0.18) / 2).ToString())
                    FrieghtSGST = New ReportParameter("FreightSGST", ((DTDetail.Rows(0)("FreightAmount") * 0.18) / 2).ToString())
                End If

                For i = 0 To DTDetail.Rows.Count - 1
                    Select Case DTDetail.Rows(i)("GSTPercantage").ToString()
                        Case "5"
                            FivePerGSTA += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                            FivePerGST += Convert.ToDouble(DTDetail.Rows(i)("GST"))
                        Case "12"
                            TwelvePerGSTA += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                            TwelvePerGST += Convert.ToDouble(DTDetail.Rows(i)("GST"))
                        Case "18"
                            EighteenPerGSTA += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                            EighteenPerGST += Convert.ToDouble(DTDetail.Rows(i)("GST"))
                        Case "28"
                            TwentyEightPerGSTA += Convert.ToDouble(DTDetail.Rows(i)("Amount"))
                            TwentyEightPerGST += Convert.ToDouble(DTDetail.Rows(i)("GST"))
                    End Select
                Next
            End If
            Dim FivePerGSTPA = New ReportParameter("FivePerGSTA", FivePerGSTA)
            Dim TwentyEightPerGSTPA = New ReportParameter("TwentyEightPerGSTA", TwentyEightPerGSTA)
            Dim TwelvePerGSTpA = New ReportParameter("TwelvePerGSTA", TwelvePerGSTA)
            Dim EighteenPerGSTPA = New ReportParameter("EighteenPerGSTA", EighteenPerGSTA + Convert.ToInt32(DTDetail.Rows(0)("FreightAmount")))
            Dim FivePerGSTP = New ReportParameter("FivePerGST", FivePerGST)
            Dim TwentyEightPerGSTP = New ReportParameter("TwentyEightPerGST", TwentyEightPerGST)
            Dim TwelvePerGSTp = New ReportParameter("TwelvePerGST", TwelvePerGST)
            Dim EighteenPerGSTP = New ReportParameter("EighteenPerGST", EighteenPerGST + Convert.ToInt32(DTDetail.Rows(0)("FreightAmount")) * 0.18)
            ReportViewer1.LocalReport.EnableExternalImages = True
            ReportViewer1.LocalReport.SetParameters(sum)
            ReportViewer1.LocalReport.SetParameters(GST)
            ReportViewer1.LocalReport.SetParameters(FrieghtCGST)
            ReportViewer1.LocalReport.SetParameters(FrieghtSGST)
            ReportViewer1.LocalReport.SetParameters(FrieghtIGST)
            ReportViewer1.LocalReport.SetParameters(AuthorisedSignatory)
            ReportViewer1.LocalReport.SetParameters(TwentyEightPerGSTPA)
            ReportViewer1.LocalReport.SetParameters(EighteenPerGSTPA)
            ReportViewer1.LocalReport.SetParameters(TwelvePerGSTpA)
            ReportViewer1.LocalReport.SetParameters(FivePerGSTPA)

            ReportViewer1.LocalReport.SetParameters(TwentyEightPerGSTP)
            ReportViewer1.LocalReport.SetParameters(EighteenPerGSTP)
            ReportViewer1.LocalReport.SetParameters(TwelvePerGSTp)
            ReportViewer1.LocalReport.SetParameters(FivePerGSTP)
            ReportViewer1.LocalReport.DisplayName = "Quote_" + DTMain.Rows(0)("EstimateNo").ToString()

            ReportViewer1.LocalReport.DataSources.Add(dsDetail)
            ReportViewer1.LocalReport.DataSources.Add(DataSetFooter)
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
