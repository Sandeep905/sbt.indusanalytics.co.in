Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection

Partial Class ReportJobCard
    Inherits System.Web.UI.Page
    Dim db As New DBConnection
    Dim GBLCompanyID As String
    Dim ContID As String = Convert.ToString(HttpContext.Current.Request.QueryString("ContID"))
    Dim dsContents As New DataTable

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            ShowData()
        End If
    End Sub

    Public Sub ShowData()
        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        dsContents = GetData("Execute ProductionWorkOrderPrint 1,'" & ContID & "','" & GBLCompanyID & "'")
        'reset
        ReportViewer1.Reset()
        If dsContents.Rows.Count <= 0 Then Exit Sub
        'path
        ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/JobCardPrint.rdlc")
        For i = 0 To dsContents.Rows.Count - 1
            dsContents.Rows(i)("PrintedBy") = UserName
        Next
        'dataSource
        Dim JobContents As ReportDataSource = New ReportDataSource("JobCardContents", dsContents)
        ReportViewer1.LocalReport.DataSources.Add(JobContents)

        'Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'Dim DTJob As DataTable = GetData("Select  '" & UserName & "' As PrintedBy,Getdate() As PrintedDate ")
        'Dim JobContents1 As ReportDataSource = New ReportDataSource("DataSet1", DTJob)
        'ReportViewer1.LocalReport.DataSources.Add(JobContents1)

        'Add SubReport
        'JobCardSummary
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobCardSummarySubreportProcessing
        'JobDescription
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobCardProductionDetailsSubreportProcessing
        'Production Form Detail
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf FormDetailSubreportProcessing
        'Production Item Detail
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ProductionItemDetailSubreportProcessing
        'Reel Details
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ProductionReelDetailSubreportProcessing
        'Material Details
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ProductionMaterialDetailSubreportProcessing
        'Operation Details
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf OperationDetailSubreportProcessing

        'refresh
        ReportViewer1.LocalReport.Refresh()
    End Sub

    Private Sub JobCardSummarySubreportProcessing(ByVal sender As Object, ByVal e As SubreportProcessingEventArgs)
        Dim JobBookingJobcardContentsID As String = e.Parameters("JobBookingJobcardContentsID").Values(0)
        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))

        Dim CDT As DataTable = GetData("Select   JEJC.JobBookingID, JEJC.JobBookingJobCardContentsID, UM.UserName, LM.LedgerName,CM.LedgerName AS ConsigneeName, CC.CategoryName,JEJ.JobBookingNo,JEJ.JobBookingDate,J1.BookingNo,JEJ.DeliveryDate,JEJ.OrderQuantity,JEJ.JobName,JEJ.PONo,JEJ.PODate,JEJC.JobPriority,JEJC.JobType,JCM.LedgerName AS JobCoordinatorName ,'" & UserName & "' As PrintedBy,Getdate() As PrintedDate " &
                                                "From JobBookingJobCard AS JEJ INNER JOIN JobBookingJobCardContents as JEJC ON JEJC.JobBookingID = JEJ.JobBookingID AND JEJC.CompanyID=JEJ.CompanyID INNER JOIN UserMaster as UM ON UM.UserID = JEJ.CreatedBy And UM.CompanyID=JEJ.CompanyID  " &
                                                "INNER JOIN LedgerMaster as LM ON JEJ.LedgerID = LM.LedgerID AND JEJ.CompanyID=LM.CompanyID LEFT JOIN CategoryMaster as CC ON JEJ.CategoryID = CC.CategoryID  And JEJ.CompanyID=CC.CompanyID   " &
                                                "LEFT JOIN JobBooking AS J1 ON JEJ.BookingID = J1.BookingID AND JEJ.CompanyID=J1.CompanyID LEFT JOIN LedgerMaster as CM ON JEJ.ConsigneeID = CM.LedgerID And J1.CompanyID=CM.CompanyID  LEFT JOIN LedgerMaster as JCM ON JEJ.CoordinatorLedgerID = JCM.LedgerID And JEJ.CompanyID=JCM.CompanyID      " &
                                                "Where JEJC.JobBookingJobcardContentsID = '" & JobBookingJobcardContentsID & "'  AND JEJC.CompanyID='" & GBLCompanyID & "'")
        Dim datasource As ReportDataSource = New ReportDataSource("JobcardSummary", CDT)
        e.DataSources.Add(datasource)

        Dim DTJob As DataTable = GetData("Select  '" & UserName & "' As PrintedBy,Getdate() As PrintedDate ")
        Dim JobContents1 As ReportDataSource = New ReportDataSource("DataSet1", DTJob)
        e.DataSources.Add(JobContents1)

    End Sub

    Private Sub JobCardProductionDetailsSubreportProcessing(ByVal senderDS As Object, ByVal d As SubreportProcessingEventArgs)
        Dim JobBookingJobcardContentsID As String = d.Parameters("JobBookingID").Values(0)
        'Dim JDS As DataTable = getData("Select Distinct UM.UserName ,JE.BookingNo AS QuotationNO, JE.BookingID, JEJC.JobBookingJobCardContentsID, JEJC.PlanContName AS ContentName,  " &
        '                                           " ((Convert(NVARCHAR(20), (Isnull(JJC.PlanFColor, 0))) + '+' + Convert(NVARCHAR(20),Isnull(JJC.PlanSpeFColor, 0))) + '/' +   (Convert(NVARCHAR(20), (Isnull(JJC.PlanBColor, 0))) + '+' + Convert(NVARCHAR(20),Isnull(JJC.PlanSpeBColor, 0)))) as Printing,    " &
        '                                           " Stuff((Select ','+PM.DisplayProcessName From JobBookingJobCard as JEJ1 INNER JOIN JobBookingJobCardContents  AS JEC1 on JEJ1.JobBookingID = JEC1.JobBookingID AND JEJ1.CompanyID=JEC1.CompanyID AND JEJC.JobBookingID=JEJ1.JobBookingID    " &
        '                                           " INNER Join JobBookingJobCardProcess  as JEO ON JEO.JobBookingJobCardContentsID = JEC1.JobBookingJobCardContentsID And JEJC.JobBookingJobCardContentsID = JEC1.JobBookingJobCardContentsID And JEJC.CompanyID=JEO.CompanyID  " &
        '                                           " INNER Join ProcessMaster AS PM ON JEO.ProcessID=PM.ProcessID And JEO.CompanyID=PM.CompanyID Order By JEO.SequenceNo  FOR XML PATH('')),1,1,'') AS ProcessDetail,   JEO.Remarks AS ProcessRemark ,JE.OrderQuantity , LM.LedgerName,  " &
        '                                           " CM.LedgerName AS ConsigneeName, CC.CategoryName, Null As Shipper_Name, 0 As Shipper_Per_Box_Wt, 0 As Shipper_pack_Qty, 0 As Total_Shipper_Qty_Req, 0 As Shipper_NO_OF_Ply, 0 AS Shipper_ID,   " &
        '                                           " JJC.JobPrePlan as JobSize,  (JJC.ItemPlanQuality  + ', '+  Convert(nvarchar(20),JJC.ItemPlanGSM) + ', '+  JJC.ItemPlanMill) as Material  From JobBookingJobCard As JEJ  " &
        '                                           " INNER Join JobBookingJobCardContents AS JEJC on JEJ.JobBookingID = JEJC.JobBookingID  And JEJ.CompanyID=JEJC.CompanyID " &
        '                                           " INNER Join JobBooking AS JE ON JEJ.BookingID = JE.BookingID And JEJ.CompanyID=JE.CompanyID    " &
        '                                           " INNER Join LedgerMaster as LM ON JE.LedgerID = LM.LedgerID  And JE.CompanyID=LM.CompanyID    " &
        '                                           " INNER Join ViewJobBookingJobCardContents as JJC ON JEJC.JobBookingID=JJC.JobBookingID And JEJC.JobBookingJobCardContentsID=JJC.JobBookingJobCardContentsID And JEJC.CompanyID=JJC.CompanyID " &
        '                                           " Left Join JobBookingJobCardProcess AS JEO ON  JEO.JobBookingID=JEJC.JobBookingID And JEO.JobBookingJobCardContentsID=JEJC.JobBookingJobCardContentsID And JEO.CompanyID=JEJC.CompanyID " &
        '                                           " Left Join ItemMaster AS IM ON IM.ItemID=JEJC.PaperID And IM.CompanyID=JEJC.CompanyID    " &
        '                                           " Left Join LedgerMaster as CM ON JE.ConsigneeID=CM.LedgerID And JE.CompanyID=CM.CompanyID   " &
        '                                           " Left Join CategoryMaster as CC ON JE.CategoryID=CC.CategoryID  And JE.CompanyID=CM.CompanyID   " &
        '                                           " Left Join Usermaster as UM ON UM.UserID = JEJ.CreatedBy And UM.CompanyID=JEJ.CompanyID  " &
        '                                           " Where JEJC.JobBookingID =(Select JobBookingID From JobBookingJobCardContents Where JobBookingJobcardContentsID =" & JobBookingJobcardContentsID & " AND CompanyID=" & GBLCompanyID & ") AND JEJ.CompanyID='" & GBLCompanyID & "'")

        'Dim dsContents As DataTable = getData("execute ProductionWorkOrderPrint 1," & ContID & ",'" & GBLCompanyID & "'")
        Dim datasource As ReportDataSource = New ReportDataSource("JobCardProductionDetails", dsContents)
        d.DataSources.Add(datasource)

        'Dim FDetail As New DataTable
        'FDetail = getData("Select JobCardFormNO,RefNo,TransID,PrintingStyle,Pages,TotalSheets,PrintingRemark,ActualSheets,WasteSheets,JobBookingID,JobBookingJobCardContentsID From JobBookingJOBCardFormWiseDetails Where CompanyID='" & GBLCompanyID & "' AND JobBookingID ='" & JobBookingJobcardContentsID & "' Order By TransID")

        'datasource = New ReportDataSource("FormDetails", FDetail)
        'd.DataSources.Add(datasource)
    End Sub

    Private Sub FormDetailSubreportProcessing(ByVal senderFD As Object, ByVal f As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = f.Parameters("JobBookingID").Values(0)
        'Dim FDetail As DataTable = getData("Select  JF.TransID,JF.JobCardFormNo, JEJ.PrintingStyle, JF.Pages, JF.TotalSheets, JF.PrintingRemark,JF.JobBookingJobCardContentsID,JEJ.WastageSheets,    " &
        '                                    "ROUND(CONVERT(BIGINT, JF.TotalSheets) / ((CASE WHEN ISNULL((Select Sum(Isnull(CONVERT(REAL, JF.TotalSheets),0)) From  JobBookingJobCardFormWiseDetails Where JobBookingJobCardContentsID =  JF.JobBookingJobCardContentsID And CompanyID=JF.CompanyID),0)= 0 Then 1 Else    " &
        '                                    "ISNULL((Select Sum(Isnull(CONVERT(REAL,TotalSheets),0)) From JobBookingJobCardFormWiseDetails Where JobBookingJobCardContentsID =   JF.JobBookingJobCardContentsID AND CompanyID=JF.CompanyID),0) END  /  " &
        '                                    "CASE WHEN Isnull(JEJ.WastageSheets,0) = 0 THEN 1 ELSE Isnull(JEJ.WastageSheets,0) END )),0)  as Waste  ,      " &
        '                                    "( ROUND(CONVERT(BIGINT,JF.TotalSheets)/ ((CASE WHEN ISNULL((Select Sum(Isnull(CONVERT(REAL,TotalSheets),0)) From  JobBookingJobCardFormWiseDetails Where JobBookingJobCardContentsID =  JF.JobBookingJobCardContentsID AND CompanyID=JF.CompanyID),0)= 0 THEN 1 ELSE    " &
        '                                    "ISNULL((Select Sum(Isnull(CONVERT(REAL,TotalSheets),0)) From JobBookingJobCardFormWiseDetails Where JobBookingJobCardContentsID =   JF.JobBookingJobCardContentsID And CompanyID=JF.CompanyID),0) END  /  " &
        '                                    "CASE WHEN Isnull(JEJ.WastageSheets,0) = 0 THEN 1 ELSE Isnull(JEJ.WastageSheets,0) END )),0)  + CONVERT(BIGINT,JF.TotalSheets)) AS TTL  " &
        '                                    "From JobBookingJobCard AS J  " &
        '                                    "INNER JOIN JobBookingJobCardContents AS JEJ ON J.JobBookingID=JEJ.JobBookingID AND J.CompanyID=JEJ.CompanyID " &
        '                                    "INNER JOIN JobBookingJobCardFormWiseDetails AS JF ON JEJ.JobBookingJobCardContentsID=JF.JobBookingJobCardContentsID And JEJ.CompanyID=JF.CompanyID " &
        '                                    "Where JF.CompanyID='" & GBLCompanyID & "' AND JF.JobBookingJobCardContentsID IN(Select Distinct JobBookingID From JobBookingJobCardContents Where JobBookingId='" & JobBookingJobCardContentsID & "' AND CompanyID='" & GBLCompanyID & "') " &
        '                                    "GROUP BY JF.CompanyID,JEJ.WastageSheets,JF.TransID, JF.JobCardFormNo, JEJ.PrintingStyle, JF.Pages, JF.TotalSheets, JF.PrintingRemark,JEJ.WastageSheets, JF.JobBookingJobCardContentsID  Order By JF.TransID")

        Dim FDetail As New DataTable
        FDetail = GetData("Select JobCardFormNO,PlanContName,RefNo,TransID,PrintingStyle,Pages,PageNo,TotalSheets,PrintingRemark,ActualSheets,WasteSheets,JobBookingID,JobBookingJobCardContentsID From JobBookingJOBCardFormWiseDetails Where CompanyID='" & GBLCompanyID & "' AND JobBookingID ='" & JobBookingJobCardContentsID & "' Order By JobBookingJobCardContentsID,TransID")

        Dim datasource As ReportDataSource = New ReportDataSource("FormDetails", FDetail)
        f.DataSources.Add(datasource)
    End Sub

    Private Sub ProductionItemDetailSubreportProcessing(ByVal senderID As Object, ByVal i As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = i.Parameters("JobBookingID").Values(0)
        Dim IDE As DataTable = GetData("Select JC.PlanContName,JC.JobCardContentNo,IM.ItemCode,JM.StockUnit, IM.ItemName,(ISNULL(JC.ActualSheets,0)+ISNULL(JC.WastageSheets,0)+ISNULL(JC.MakeReadyWastageSheet,0)) As TotalSheets, JC.FullSheets,JC.WastageSheets As [WastageSheets], SUM(JM.RequiredQty) AS RequiredQty,JC.ActualSheets,SUM(JM.EstimatedQuantity) AS EstimatedQuantity, JM.JobBookingJobCardContentsID, JM.JobBookingID, JC.CutSize, ISNULL(JC.CutL, 0) * ISNULL(JC.CutW, 0) + ISNULL(JC.CutLH, 0) * ISNULL(JC.CutHL, 0) AS Cuts, (ISNULL(JC.CutL, 0) * ISNULL(JC.CutW, 0) + ISNULL(JC.CutLH, 0) * ISNULL(JC.CutHL, 0)) * JC.FullSheets AS Final_Quantity,Case When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID Where ItemID=JM.ItemID And M.CompanyID=JC.CompanyID And MD.JobBookingJobCardContentsID=JM.JobBookingJobCardContentsID And M.VoucherID=-19 And M.IsDeletedTransaction=0)>0 Then 'Item Issued' When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID Where ItemID=JM.ItemID And M.CompanyID=JC.CompanyID And MD.JobBookingJobCardContentsID=JM.JobBookingJobCardContentsID And M.VoucherID=-17 And M.IsDeletedTransaction=0)>0 Then 'PickList Created' When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID Where ItemID=JM.ItemID And M.CompanyID=JC.CompanyID And MD.JobBookingJobCardContentsID=JM.JobBookingJobCardContentsID And M.VoucherID=-8 And M.IsDeletedTransaction=0)>0 Then 'Indent Send' End As MaterialStatus " &
                                        " From JobBookingJobCard As J INNER JOIN JobBookingJobCardContents as JC ON  J.JobBookingID = JC.JobBookingID AND J.CompanyID=JC.CompanyID    " &
                                        " INNER JOIN JobBookingJobCardProcessMaterialRequirement as JM ON  JC.JobBookingJobCardContentsID = JM.JobBookingJobCardContentsID And JC.CompanyID=JM.CompanyID And Isnull(JM.IsDeletedTransaction,0)=0 " &
                                        " INNER JOIN ItemMaster as IM ON JM.ItemID=IM.ItemID AND JC.CompanyID=IM.CompanyID  " &
                                        " INNER JOIN ItemGroupMaster as IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  And IGM.ItemGroupNameID In(-1,-2)  " &
                                        " Where J.CompanyID='" & GBLCompanyID & "' AND JM.JobBookingID='" & JobBookingJobCardContentsID & "'" &
                                        " GROUP BY JC.PlanContName,IGM.ItemGroupNameID,JC.JobCardContentNo,IM.ItemCode,JM.StockUnit,  IM.ItemName, JM.JobBookingJobCardContentsID, JM.JobBookingID, JC.CutSize, JC.CutL, JC.CutW, JC.CutLH, JC.CutHL,JM.ItemID,JC.CompanyID,JC.ActualSheets,JC.WastageSheets,JM.SequenceNo,JC.FullSheets,JC.MakeReadyWastageSheet ORDER BY JM.SequenceNo")
        Dim datasource As ReportDataSource = New ReportDataSource("DataSetItemDetails", IDE)
        i.DataSources.Add(datasource)
    End Sub

    Private Sub ProductionReelDetailSubreportProcessing(ByVal senderRD As Object, ByVal r As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = r.Parameters("JobBookingJobCardContentsID").Values(0)
        Dim RD As DataTable = GetData("Select JM.JobBookingJobCardContentsID,JM.JobBookingID,  IM.ItemCode AS ReelCode, IM.ItemName AS ReelName,IM.StockUnit as Unit,JM.RequiredQty AS RequiredStock ,0 AS CutSheets, 0 as Cuts,  JC.CutSize as Working_Size    " &
                                       " From JobBookingJobCard as J  " &
                                       " INNER Join JobBookingJobCardContents as JC ON  J.JobBookingID = JC.JobBookingID And J.CompanyID=JC.CompanyID     " &
                                       " INNER Join JobBookingJobCardProcessMaterialRequirement as JM ON  JC.JobBookingJobCardContentsID = JM.JobBookingJobCardContentsID And JC.CompanyID=JM.CompanyID   " &
                                       " INNER Join ItemMaster as IM ON JC.PaperID=IM.ItemID And JC.CompanyID=IM.CompanyID   " &
                                       " INNER Join ItemGroupMaster as IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID And IGM.ItemGroupNameID=-2  " &
                                       " Where J.CompanyID='" & GBLCompanyID & "' AND JC.JobBookingJobCardContentsID='" & JobBookingJobCardContentsID & "' AND IGM.ItemGroupNameID=-2 Order by ReelCode")
        Dim datasource As ReportDataSource = New ReportDataSource("ReelDetails", RD)
        r.DataSources.Add(datasource)
    End Sub
    Private Sub ProductionMaterialDetailSubreportProcessing(ByVal senderMD As Object, ByVal m As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = m.Parameters("JobBookingID").Values(0)
        Dim MD As DataTable = GetData("Select Distinct JP.ProcessID, PM.ProcessName + Case When JPM.RateFactor<>'' then '('+JPM.RateFactor+')'End As SpecialRemark,JP.JobBookingJobCardContentsID,JP.JobBookingID,IM.ItemCode,JP.PlanContName As ContentName,JJ.JobCardContentNo,  MM.MachineName , IM.ItemName,  JP.Remarks AS ProductionRemark ,JPM.EstimatedQuantity-JPM.WasteQty As ActualQty,JPM.WasteQty,JPM.RequiredQty, JPM.StockUnit AS Unit," &
                                        " Case When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID And ItemID=JPM.ItemID And M.CompanyID=JPM.CompanyID And MD.JobBookingJobCardContentsID=JPM.JobBookingJobCardContentsID And M.VoucherID=-19 And MD.ProcessID = JPM.ProcessID)>0 Then 'Item Issued'" &
                                        " When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID And ItemID=JPM.ItemID And M.CompanyID=JPM.CompanyID And MD.JobBookingJobCardContentsID=JPM.JobBookingJobCardContentsID And M.VoucherID=-17 And MD.ProcessID = JPM.ProcessID)>0 Then 'PickList Created'" &
                                        " When (Select Count(M.TransactionID) From ItemTransactionMain As M Inner Join ItemTransactionDetail As MD On M.TransactionID=MD.TransactionID And M.CompanyID=MD.CompanyID And ItemID=JPM.ItemID And M.CompanyID=JPM.CompanyID And MD.JobBookingJobCardContentsID=JPM.JobBookingJobCardContentsID And M.VoucherID=-8 And MD.ProcessID = JPM.ProcessID)>0 Then 'Indent Sent' End As PresentStatus" &
                                        " From JobBookingJobCard as J INNER JOIN JobBookingJobCardContents as JJ ON  J.JobBookingID = JJ.JobBookingID AND J.CompanyID=JJ.CompanyID " &
                                        " INNER JOIN JobBookingJobCardProcess AS JP ON JJ.JobBookingJobCardContentsID = JP.JobBookingJobCardContentsID And JJ.CompanyID = JP.CompanyID  " &
                                        " INNER JOIN JobBookingJobCardProcessMaterialRequirement AS JPM ON JP.JobBookingJobCardContentsID = JPM.JobBookingJobCardContentsID AND JP.ProcessID = JPM.ProcessID  AND JP.CompanyID = JPM.CompanyID And Isnull(JPM.RateFactor,'')=Isnull(JP.RateFactor,'') " &
                                        " INNER JOIN ProcessMaster As PM On PM.ProcessID=JP.ProcessID And PM.CompanyID=JP.CompanyID And PM.IsDeletedTransaction=0 " &
                                        " INNER JOIN ItemMaster AS IM ON IM.ItemID=JPM.ItemID  And JPM.CompanyID = IM.CompanyID " &
                                        " LEFT JOIN MachineMaster AS MM ON MM.MachineID=JPM.MachineID  AND JPM.CompanyID = MM.CompanyID  " &
                                        " Where J.CompanyID='" & GBLCompanyID & "' AND JJ.JobBookingID='" & JobBookingJobCardContentsID & "' ")
        Dim datasource As ReportDataSource = New ReportDataSource("MaterialDetails", MD)
        m.DataSources.Add(datasource)
    End Sub
    Private Sub OperationDetailSubreportProcessing(ByVal senderOD As Object, ByVal o As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = o.Parameters("JobBookingJobCardContentsID").Values(0)
        Dim OD As DataTable = GetData("Select DISTINCT Null AS Remark,JP.JobBookingJobCardContentsID,JP.JobBookingID, JP.SequenceNo,Case When Isnull(JP.RateFactor,'')='' Then PM.ProcessName Else (PM.ProcessName +' - ('+ JP.RateFactor +')') End As ProcessName, Null AS MachineName,PM.ProcessID, Null AS EmployeeName, 0 AS ConsumedQty, 0 AS ReadyQty, PM.EndUnit, NUll as Modify_Date, 0 AS RejectedQty,JP.Status,Null AS UserName,Null AS Remark  " &
                                        "From JobBookingJobCard as J  " &
                                        "INNER JOIN JobBookingJobCardContents as JJ ON  J.JobBookingID = JJ.JobBookingID AND J.CompanyID=JJ.CompanyID  " &
                                        "INNER JOIN JobBookingJobCardProcess AS JP ON JJ.JobBookingJobCardContentsID = JP.JobBookingJobCardContentsID And JJ.CompanyID = JP.CompanyID   " &
                                        "INNER JOIN ProcessMaster AS PM ON PM.ProcessID=JP.ProcessID  AND JP.CompanyID = PM.CompanyID   " &
                                        " Where J.CompanyID='" & GBLCompanyID & "' AND JJ.JobBookingJobCardContentsID='" & JobBookingJobCardContentsID & "' Order by SequenceNo ")
        Dim datasource As ReportDataSource = New ReportDataSource("OperationDetails", OD)
        o.DataSources.Add(datasource)
    End Sub

    Private Function GetData(query As String) As DataTable
        Dim con As New SqlConnection
        Dim dss As DataSet = New DataSet()
        Dim sql As String = ""
        Dim dt As New DataTable
        Try
            con = db.OpenDataBase()
            sql = query
            Dim cmd As SqlCommand = New SqlCommand(sql, con)
            Dim adapter As New SqlDataAdapter(cmd)
            adapter.Fill(dt)
            con.Close()
            Return dt
        Catch ex As Exception
            Return dt
        End Try
    End Function
End Class
