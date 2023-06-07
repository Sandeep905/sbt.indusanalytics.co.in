Imports System.Data
Imports System.Data.Odbc
Imports System.Data.SqlClient
Imports System.IO
Imports Connection
Imports Microsoft.Reporting.WebForms
Partial Class ReportSalesOrderBooking
    Inherits System.Web.UI.Page
    ReadOnly db As New DBConnection

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        Try
            Dim GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            Dim ID = Request.QueryString("t")
            If Not IsPostBack Then

                ' rptGetDataset()
                Dim dtSOMain As DataTable = GetDataItemTransfer("Select top 1 JOB.OrderBookingID,JOB.SalesOrderNo,replace(Convert(nvarchar(20),JOB.OrderBookingDate,106),' ',' ') as OrderBookingDate,JOB.PONo,JOB.POMailAddress,PQ.EstimateNo,EM.EnquiryNo,replace(Convert(nvarchar(20),JOB.PODate,106),' ',' ') as PODate,replace(Convert(nvarchar(20),JOB.POMailDate,106),' ',' ') as POMailDate,(Lm.LedgerName + char(13)+Char(10) + LM.MailingAddress) as CustomerDetails ,(CM.Address1 +','+ CM.Address2+','+ CM.Address3+','+CM.City+','+CM.State+','+CM.Country+'-'+CM.Pincode) as OfficeAddress,UM.UserName,CP.Name From CompanyMaster as CM INNER JOIN JObOrderBooking  as JOB ON JOB.CompanyID = CM.CompanyID INNER JOIN LedgerMaster as LM ON LM.LedgerID = JOB.LedgerID  AND JOB.CompanyID = LM.CompanyID INNER JOIN UserMaster as UM ON UM.UserID = JOB.UserID  INNER JOIN ProductQuotation as PQ on PQ.ProductEstimateID = JOB.ProductEstimateID INNER JOIN EnquiryMain as EM on PQ.EnquiryID = EM.EnquiryID LEFT JOIN ConcernPersonMaster as CP ON CP.LedgerID = LM.LedgerID where JOB.OrderBookingID = " & ID)
                Dim dtSODetails As DataTable = GetDataItemTransfer("Select JOBD.OrderBookingID, JOBD.SalesOrderNo, JOBD.JobName, JOBD.OrderQuantity,JOBD.Unitcost as Rate ,replace(Convert(nvarchar(20),JOBD.DeliveryDate,106),' ',' ') as DeliveryDate,PQC.ProductDescription from JobOrderBookingDetails as JOBD Inner JOIN ProductQuotationContents as PQC On  PQC.ProductEstimationContentID = JOBD.ProductEstimationContentID where JOBD.OrderBookingId = " & ID)
                Dim dtTransporterDetails As DataTable = GetDataItemTransfer("Select distinct OrderBookingDeliveryID as Id,JobName,replace(Convert(nvarchar(20),DeliveryDate,106),' ',' ') as DeliveryDate,TransporterName,ScheduleQuantity,LM.LedgerName as ConsigneeName ,LM.MailingAddress as ConsigneeAddress from JobOrderBookingDeliveryDetails as JOBD Inner Join LedgerMaster AS LM on  LM.LedgerId = JOBD.ConsigneeID where OrderBookingID =" & ID)
                ReportViewer1.Reset()
                'path
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/SalesOrder.rdlc")
                'dataSource
                Dim ds1 As New ReportDataSource("DataSet1", dtSOMain)
                Dim ds2 As New ReportDataSource("DataSet2", dtSODetails)
                Dim ds3 As New ReportDataSource("DataSet3", dtTransporterDetails)
                Dim ff = dtSODetails.Compute("MAX(OrderBookingID)", "")
                Dim PP = New ReportParameter("LastRowID", ff.ToString())
                ReportViewer1.LocalReport.SetParameters(PP)
                ReportViewer1.LocalReport.DataSources.Add(ds1)
                ReportViewer1.LocalReport.DataSources.Add(ds2)
                ReportViewer1.LocalReport.DataSources.Add(ds3)
                'ReportViewer1.LocalReport.Refresh()
            End If
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub


    Private Function GetDataItemTransfer(query As String) As DataTable
        Dim dss As New DataSet()
        Dim dt As New DataTable()
        Dim sql As String = query
        Dim con As SqlConnection
        con = db.OpenDataBase()

        If con.State = ConnectionState.Closed Then
            con.Open()
        End If

        Dim cmd As New SqlCommand(sql, con)
        Dim adapter As New SqlDataAdapter(cmd)
        adapter.Fill(dt)
        con.Close()
        Return dt
    End Function
End Class
