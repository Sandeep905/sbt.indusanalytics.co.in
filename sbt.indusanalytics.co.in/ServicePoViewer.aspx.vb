Imports System.Data
Imports System.Data.SqlClient
Imports Connection
Imports Microsoft.Reporting.WebForms
Partial Class ServicePoViewer
    Inherits System.Web.UI.Page
    'Dim GBLCompanyID, TransactionID, IsDirect, QueryStr As String
    Dim db As New DBConnection

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        Dim GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        Dim ID = Request.QueryString("t")
        If Not IsPostBack Then

            ReportViewer1.Reset()
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ServicePO.rdlc")

            Dim DTMain As DataTable = GetDataTable("Select Distinct JCS.JobBookingNo as JCNO,  JC.LedgerName + ',' + JC.Email +',' + JC.TelephoneNo as SalesPerson,SPM.DelivaryAddress , SPM.ProductEstimateID,SPM.JobBookingID,SPM.QuotationNo as EstimateNo,SPM.EnquiryNo,SPM.PONumber,Replace(Convert(Nvarchar(30),SPM.PoDate,106),'','-') as PODate,SPM.VersionNo as RevisionNo,LMV.LedgerName,'GST No. - ' + LMV.GSTNo as GSTIN,LMV.Address1+ CHAR(13)+CHAR(10)+LMV.City +', '+ LMV.State +', '+ LMV.Country as ClientAddress from ServicePOMain As SPM Inner Join ServicePODetails as SPD On SPM.POID = SPD.POID Inner Join LedgerMaster As LM On SPM.LedgerId = Lm.LedgerID Inner Join LedgerMaster as LMV on LMV.LedgerID = SPD.ScheduleVendorId inner join JobCardSchedule as JBJC on JBJC.JobCardID = SPM.JobBookingID and JBJC.JobContentsID = SPD.ProductEstimationContentID inner join LedgerMaster as JC on JC.LedgerID = JBJC.JobCoordinatorID inner join Jobbookingjobcard as JCS on JCS.JobbookingID= JBJC.JObcardID Where SPM.POID = " & ID & " AND SPM.CompanyID = " & GBLCompanyID)
            Dim dsMain As ReportDataSource = New ReportDataSource("ServicePOMain", DTMain)
            ReportViewer1.LocalReport.DataSources.Add(dsMain)

            Dim DtTandC As DataTable = GetDataTable("Select Nullif(FooterText,'') As FooterText from UserMaster Where CompanyID=" & GBLCompanyID & " and UserId=" & GBLUserID & "")
            Dim DsTandC As ReportDataSource = New ReportDataSource("TandC", DtTandC)
            ReportViewer1.LocalReport.DataSources.Add(DsTandC)
            Dim DTDetail As DataTable = GetDataTable("Select PHM.HSNCode as HSN,SPD.ProductName,SPD.ScheduleQty as Quantity,SPD.ScheduleRate As Rate,SPD.NetAmount as Amount,SPD.IGSTAmount,PQC.SGSTPercantage,PQC.IGSTPercantage,PQC.CGSTPercantage,PQC.GSTPercantage,SPD.TotalGSTAmount as GST ,Isnull(PQ.FreightAmount,0) as FreightAmount,SPD.CGSTAmount,SPD.SGSTAmount,SPD.TotalAmount from ServicePOMain As SPM  Inner Join ServicePODetails as SPD On SPM.POID = SPD.POID Inner Join LedgerMaster As LM On SPM.LedgerId = Lm.LedgerID Inner Join ProductQuotation as PQ on PQ.ProductEstimateID = SPM.ProductEstimateID Inner Join ProductQuotationContents AS PQC On PQC.ProductEstimationContentID = SPD.ProductEstimationContentID inner join ProductHSNMaster as PHM on PHM.ProductHSNID  = PQC.ProductHSNID Where SPM.POID = " & ID & " AND SPM.CompanyID = " & GBLCompanyID & "")
            Dim ApprovedByAndPrintBy As DataTable = GetDataTable("Select TOP(1) isnull(UM.UserName,'') as ApprovedBy,'' as PrintedBy,Isnull(convert(varchar,GetDate(),106),'') as PrintedDate from ServicePOMain PQ LEFT join UserMaster UM on PQ.ApprovedBy = UM.UserID where Isnull(PQ.IsDeletedTransaction,0) = 0 and PQ.POID =" & ID & " and PQ.CompanyID=" & GBLCompanyID)

            For i = 0 To ApprovedByAndPrintBy.Rows.Count - 1
                ApprovedByAndPrintBy.Rows(i)("PrintedBy") = UserName
            Next

            Dim sum = New ReportParameter("TOTALINWORD", db.ReadNumber(DTDetail.Compute("SUM(TotalAmount)", ""), "Rupees", "Paise", "INRs")) '
            Dim GST = New ReportParameter("GSTINWORD", db.ReadNumber(DTDetail.Rows(0)("CGSTAmount") + DTDetail.Rows(0)("IGSTAmount") + DTDetail.Rows(0)("SGSTAmount"), "Rupees", "Paise", "INRs"))
            Dim IMG = New Uri(Server.MapPath("~/images/AuthorisedSignatory.jpeg")).AbsoluteUri
            Dim AuthorisedSignatory = New ReportParameter("ImageAuthoritys", IMG)
            Dim dsDetail As ReportDataSource = New ReportDataSource("ServicePODetails", DTDetail)
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
                'If DTDetail.Rows(0)("IGST") > 0 Then
                '    FrieghtIGST = New ReportParameter("FreightIGST", (DTDetail.Rows(0)("FreightAmount") * 0.18).ToString())
                'Else
                '    FrieghtCGST = New ReportParameter("FreightCGST", ((DTDetail.Rows(0)("FreightAmount") * 0.18) / 2).ToString())
                '    FrieghtSGST = New ReportParameter("FreightSGST", ((DTDetail.Rows(0)("FreightAmount") * 0.18) / 2).ToString())
                'End If

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
            Dim EighteenPerGSTPA = New ReportParameter("EighteenPerGSTA", EighteenPerGSTA)
            Dim FivePerGSTP = New ReportParameter("FivePerGST", FivePerGST)
            Dim TwentyEightPerGSTP = New ReportParameter("TwentyEightPerGST", TwentyEightPerGST)
            Dim TwelvePerGSTp = New ReportParameter("TwelvePerGST", TwelvePerGST)
            Dim EighteenPerGSTP = New ReportParameter("EighteenPerGST", EighteenPerGST)


            ReportViewer1.LocalReport.EnableExternalImages = True
            ReportViewer1.LocalReport.SetParameters(GST)
            ReportViewer1.LocalReport.SetParameters(sum)
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
            ReportViewer1.LocalReport.DisplayName = "ServicePO_" + DTMain.Rows(0)("PONumber").ToString()

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
