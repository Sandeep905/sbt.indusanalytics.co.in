
Imports System.Data
Imports System.Data.Odbc
Imports System.Data.SqlClient
Imports System.IO
Imports Connection
Imports Microsoft.Reporting.WebForms

Partial Class ReportDetailCosting
    Inherits System.Web.UI.Page

    ReadOnly db As New DBConnection
    Dim BookingID, GBLCompanyID As String
    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Try

            If Not IsPostBack Then
                BookingID = Convert.ToString(HttpContext.Current.Request.QueryString("BN"))
                ' rptGetDataset()
                Dim dsCustomers As DataTable = GetDataItemTransfer("Select JB.BookingID,JBC.JobContentsID, JB.BookingNo, JB.CreatedDate As QuoteDate, JB.JobName, JB.ProductCode, JB.OrderQuantity, JB.ClientName, JBC.PlanContName, JBC.MachineName, JBC.PaperSize, JBC.CutSize, JBC.TotalUps, JBC.BalPiece, JBC.BalSide, JBC.WasteArea, JBC.WastePerc, " &
                                                                    "JBC.WastageKg, JBC.GrainDirection, JBC.MakeReadyWastageSheet, VJBC.PlanGripper, JBC.TotalMakeReadies, JBC.ActualSheets, JBC.WastageSheets, JBC.TotalPaperWeightInKg, JBC.FullSheets, JBC.TotalColors, JBC.MainPaperName, JBC.NoOfSets, JBC.PlateQty As PlateQty, JBC.PlateRate As PlateRate, JBC.PlateAmount As PlateAmount, JBC.PaperRate As PaperRate, JBC.PaperAmount As PaperAmount, JBC.MakeReadyRate As MakeReadyRate, JBC.MakeReadyAmount As MakeReadyAmount, JBC.PrintingImpressions As PrintingImpressions, JBC.PrintingRate As PrintingRate, JBC.PrintingAmount As PrintingAmount, VJBC.PlanSpeBColor As PlanSpeBColor, JBC.SpeColorBAmt As SpeColorBAmt, JBC.SpeColorBCharges As SpeColorBCharges, VJBC.PlanSpeFColor As PlanSpeFColor, JBC.SpeColorFCharges As SpeColorFCharges, JBC.SpeColorFAmt As SpeColorFAmt, JBC.CoatingCharges As CoatingCharges, JBC.CoatingAmount As CoatingAmount, " &
                                                                    "JBC.PlanContQty, VJBC.PlanColorStrip, VJBC.CompanyID, JBC.TotalExecutionTime, 'L='+VJBC.Trimmingleft+';R='+ VJBC.Trimmingright+';T='+ VJBC.Trimmingtop+';B='+  VJBC.Trimmingbottom As Trimming, JBC.PrintingStyle, VJBC.JobPrePlan, Case When VJBC.ChkPaperByClient='false' then 'Self' Else 'Client' End As PaperBy " &
                                                                    ",(Select ItemCode From ItemMaster Where ItemID=JBC.PaperID And CompanyID=JB.CompanyID) As PaperCode ,VJBC.PlanPlateType, 'L='+VJBC.Stripingleft+';R='+ VJBC.Stripingright+';T='+ VJBC.Stripingtop+';B='+  VJBC.Stripingbottom As Striping,VJBC.JobNoOfPages,'Front='+VJBC.PlanFColor+'; Back='+VJBC.PlanBColor As Colors " &
                                                                    ",JBC.SheetLayout,JBC.UpsLayout,JBC.PrintingImpressions,Case When VJBC.PlanContentType= 'Book Pages' Or VJBC.PlanContentType= 'Table Calendar' Or VJBC.PlanContentType= 'Wall Calendar 2 Side' Or VJBC.PlanContentType= 'Wiro Book' Then JBC.TotalUps*2 Else 0 End As PagesPerSheet " &
                                                                    ", CM.CategoryName, JB.TypeOfCost, JB.QuotedCost, LM.TelephoneNo AS TelPhone, LM.MailingAddress As Address, " &
                                                                    "JB.FinalCost, JB.BookingRemark, JB.Remark,JB.ConcernPerson, JB.CreatedDate AS QuoteDate,UM.UserName " &
                                                                    "FROM JobBooking AS JB INNER JOIN JobBookingContents AS JBC ON JBC.BookingID = JB.BookingID AND JB.CompanyID = JBC.CompanyID /*And JB.OrderQuantity=JBC.PlanContQty*/ INNER JOIN " &
                                                                    "ViewJobBookingContents AS VJBC ON JBC.JobContentsID = VJBC.JobContentsID AND JB.BookingID = VJBC.BookingID AND JB.CompanyID = VJBC.CompanyID " &
                                                                    "Inner Join LedgerMaster As LM On JB.LedgerID=LM.LedgerID And LM.CompanyID=JB.CompanyID " &
                                                                    "Inner Join CategoryMaster As CM On CM.CategoryID=JB.CategoryID And CM.CompanyID=JB.CompanyID Inner Join UserMaster As UM On UM.UserID=JB.QuotedByUserID And UM.CompanyID=JB.CompanyID  " &
                                                                    "WHERE (JB.IsDeletedTransaction = 0) And JB.BookingID=" & BookingID & " AND JB.CompanyID =" & GBLCompanyID & "")
                ReportViewer1.Reset()
                'path
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ReportDetailCosting.rdlc")

                'dataSource
                Dim ds1 As New ReportDataSource("DetailCostingName", dsCustomers)
                ReportViewer1.LocalReport.DataSources.Add(ds1)
                'Add SubReport
                AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobDetailProcessSubreportProcessing
                AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobDetailQuantitySubreportProcessing
                'refresh
                'ReportViewer1.LocalReport.Refresh()

            End If

        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub JobDetailProcessSubreportProcessing(ByVal sender As Object, ByVal e As SubreportProcessingEventArgs)
        Dim BookingID As Integer = e.Parameters("BookingID").Values(0)
        Dim JobContentsID As Integer = e.Parameters("JobContentsID").Values(0)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim ProductDetailName As DataTable = GetDataItemTransfer("SELECT JBC.BookingID,JBC.JobContentsID,PM.ProcessName,PM.TypeofCharges, JBP.Rate,JBP.Amount,Case When JBP.SizeL=0 then 'None x None' Else Convert(nvarchar(15),JBP.SizeL) +' x '+Convert(nvarchar(15),JBP.SizeW) End As Size,JBP.RateFactor	" &
                                                                 "From JobBookingProcess As JBP " &
                                                                 "INNER JOIN  ProcessMaster AS PM ON JBP.ProcessID = PM.ProcessID AND JBP.CompanyID = PM.CompanyID " &
                                                                 "INNER Join JobBookingContents AS JBC ON JBP.ContentsID = JBC.JobContentsID And JBP.CompanyID = JBC.CompanyID " &
                                                                 "WHERE isnull(JBC.IsDeletedTransaction,0)<>1 And JBC.BookingID=" & BookingID & " AND JBC.JobContentsID=" & JobContentsID & " And JBC.CompanyID = " & GBLCompanyID)
        'Dim ProductDetailName As DataTable = getDataItemTransfer("Exec [CostApprovalCostingDetail] '194',2")

        Dim datasource As New ReportDataSource("DetailCostingProcess", ProductDetailName)
        e.DataSources.Add(datasource)
    End Sub

    Private Sub JobDetailQuantitySubreportProcessing(ByVal sender As Object, ByVal e As SubreportProcessingEventArgs)
        Dim BookingID As Integer = e.Parameters("BookingID").Values(0)
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim ProductDetailName As DataTable = GetDataItemTransfer("SELECT JBC.PlanContName,JBC.BookingID, JBP.PlanContQty, TaxPercentage, MiscPercentage, ProfitPercentage, DiscountPercentage, JBC.TotalAmount As TotalCost, MiscCost, ProfitCost, DiscountAmount, TaxAmount, GrandTotalCost, UnitCost, UnitCost1000, FinalCost, QuotedCost " &
                                                                 "From JobBookingCostings As JBP " &
                                                                 "INNER Join JobBookingContents AS JBC ON JBP.PlanContQty = JBC.PlanContQty And JBP.BookingID = JBC.BookingID And JBP.CompanyID = JBC.CompanyID " &
                                                                 "WHERE isnull(JBC.IsDeletedTransaction,0)<>1 And JBC.BookingID=" & BookingID & " And JBC.CompanyID = " & GBLCompanyID)
        'Dim ProductDetailName As DataTable = getDataItemTransfer("Exec [CostApprovalCostingDetail] '194',2")

        Dim datasource As New ReportDataSource("JobDetailQuantity", ProductDetailName)
        e.DataSources.Add(datasource)
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
