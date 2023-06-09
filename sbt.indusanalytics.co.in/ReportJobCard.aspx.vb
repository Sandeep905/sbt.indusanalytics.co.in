﻿Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection
Imports System.Net.Mail
Imports System.Net

Partial Class ReportJobCard
    Inherits System.Web.UI.Page
    ReadOnly db As New DBConnection
    Dim GBLCompanyID As String
    ReadOnly ContID As String = Convert.ToString(HttpContext.Current.Request.QueryString("ContID"))
    ReadOnly JobCardId As String = Convert.ToString(HttpContext.Current.Request.QueryString("JobCardId"))
    ReadOnly jobContentID As String = Convert.ToString(HttpContext.Current.Request.QueryString("jobContentID"))
    ReadOnly OrderBookingScheduleID As String = Convert.ToString(HttpContext.Current.Request.QueryString("OrderBookingScheduleID"))

    Dim GBLUserID As String
    Dim dsContents As New DataTable
    Dim ProductType As String = ""

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserId"))
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            If db.CheckAuthories("JobCardSchedule.aspx", GBLUserID, GBLCompanyID, "CanPrint", JobCardId) = False Then
                MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
                Exit Sub
            End If

            ShowData()
        End If
    End Sub

    Public Sub ShowData()

        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))

        Dim JobSchedule = GetData("Select JCS.JobCardID AS JobBookingID,JCS.ProductType,LMV.LedgerName as PlanedVendorName,LMAV.LedgerName ScheduleVendorName, JCS.OrderBookingScheduleID,JCS.OrderBookingID,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106) ExpectedDeliveryDate,JCS.TotalAmount,JCS.NetAmount,JCS.SGSTTaxAmount,JCS.SGSTTaxPercentage,JCS.CGSTTaxAmount,JCS.CGSTTaxPercentage,JCS.IGSTTaxAmount,JCS.IGSTTaxPercentage,JCS.RateType,JCS.Rate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId,JCS.CriticalRemark  from JobCardSchedule as JCS inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & GBLCompanyID & " and JCS.JobCardID=" & JobCardId & " and JCS.JobContentsID = " & jobContentID & " And JCS.OrderBookingScheduleID=" & OrderBookingScheduleID)

        If JobSchedule.Rows.Count > 0 Then
            Dim Vendor As ReportDataSource = New ReportDataSource("DataSetVendor", JobSchedule)
            ReportViewer1.LocalReport.DataSources.Add(Vendor)

            ProductType = JobSchedule.Rows(0)("ProductType")
            If ProductType = "Offset" Then
                dsContents = GetData("Execute ProductionWorkOrderPrint 1,'" & ContID & "','" & GBLCompanyID & "'," & jobContentID & "," & OrderBookingScheduleID & "")
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
            Else
                dsContents = GetData("SELECT  b.JobCardContentNo JobBookingNo, replace(Convert(nvarchar(20),JCS.ExpectedDeliveryDate ,106),' ','-')  DeliveryDate, JCS.DescriptionOther,JCS.PackagingDetails,JCS.ProductDescription,B.BookingID,B.JobContentsID,B.JobContentsID JobBookingJobCardContentsID, replace(Convert(nvarchar(20),A.JobBookingDate,106),' ','-')   As JobBookingDate,B.Tolerence, B.Email,0 AS NoOfSetsOfFrontBack,NUll AS ApprovalBy,A.JobName,A.ProductCode,JE.BookingNo,L.LedgerName,J.PONo, replace(Convert(nvarchar(20),J.PODate,106),' ','-') AS PODate,JCS.JobPriority,E.LedgerName AS JobCoordinatorName,C.CategoryName As Category,JCS.JobType,JCS.JobReference,CM.LedgerName AS ConsigneeName,Null AS Email,B.PlanType,IM.Caliper,ItemCode AS PaperCode,J.SalesOrderNo AS OrderBookingNo,Null AS OrderBookingDate, JCS.ScheduleQty OrderQuantity,A.DeliveryDate, UM.UserName , A.Remark as JobBookingRemark,A.JobBookingID,IM.EstimationUnit,jcs.CriticalRemark SpecialInstructions,UserName As PrintedBy,GETDATE()  As PrintedDate FROM JobBookingJobCard AS A  " &
                                     "LEFT JOIN JobBookingJobCardContents AS B ON A.JobBookingID=B.JobBookingID And A.CompanyID=B.CompanyID  AND Isnull(A.IsDeletedTransaction,0)=0 inner join JobCardSchedule as JCS on JCS.JobCardID = B.JobBookingID and JCS.JobContentsID = B.JobContentsID LEFT JOIN ViewJobBookingJobCardContents AS JJC ON JJC.JobBookingJobCardContentsID=B.JobBookingJobCardContentsID And JJC.CompanyID=B.CompanyID  And B.IsDeletedTransaction=0 LEFT JOIN JobOrderBooking AS J ON J.OrderBookingID=A.OrderBookingID And J.CompanyID=A.CompanyID AND Isnull(J.IsDeletedTransaction,0)=0 LEFT JOIN LedgerMaster AS L ON JCS.SchedulevENDORid=L.LedgerID  And Jcs.CompanyID=L.CompanyID LEFT JOIN CategoryMaster AS C ON C.CategoryID=A.CategoryID AND C.CompanyID=A.CompanyID LEFT JOIN LedgerMaster AS E ON E.LedgerID=B.CoordinatorLedgerID  AND E.CompanyID=B.CompanyID " &
                                     "LEFT JOIN JobBooking AS JE ON JE.BookingID=A.BookingID And JE.CompanyID=A.CompanyID LEFT JOIN LedgerMaster AS CM ON CM.LedgerID=ISNULL(A.ConsigneeID,0) AND CM.CompanyID=A.CompanyID LEFT JOIN UserMaster as UM ON UM.UserID = A.CreatedBy  And UM.CompanyID=A.CompanyID LEFT JOIN ItemMaster As IM On B.PaperID= IM.ItemID And B.CompanyID = IM.CompanyID Where  B.CompanyID=" & GBLCompanyID & "  AND B.JobContentsID =" & jobContentID & " and B.JobBookingID=" & JobCardId & " Order By B.SequenceNo Asc")
                'reset
                ReportViewer1.Reset()
                If dsContents.Rows.Count <= 0 Then Exit Sub
                'path
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/JobCardOtherPrint.rdlc")
                For i = 0 To dsContents.Rows.Count - 1
                    dsContents.Rows(i)("PrintedBy") = UserName
                Next
                'dataSource
                Dim JobContents As ReportDataSource = New ReportDataSource("JobCardSummary", dsContents)
                ReportViewer1.LocalReport.DataSources.Add(JobContents)

                AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobCardSummarySubreportProcessing
                AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf JobCardProductionDetailsSubreportProcessing
            End If
        Else

        End If

    End Sub

    Private Sub JobCardSummarySubreportProcessing(ByVal sender As Object, ByVal e As SubreportProcessingEventArgs)
        Dim JobBookingJobcardContentsID As String = e.Parameters("JobBookingJobcardContentsID").Values(0)
        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))

        Dim CDT As DataTable = GetData("Select Distinct JEJC.JobBookingID, JEJC.JobBookingJobCardContentsID, UM.UserName, LM.LedgerName,CM.LedgerName AS ConsigneeName, CC.CategoryName,JEJ.JobBookingNo,JEJ.JobBookingDate,J1.BookingNo, JCS.ExPectedDeliveryDate as DeliveryDate,JCS.ScheduleQty OrderQuantity,JEJ.JobName,JEJ.PONo,JEJ.PODate,JCS.JobPriority,JCS.JobType,JCM.LedgerName AS JobCoordinatorName ,'Ritesh Bansal' As PrintedBy,Getdate() As PrintedDate From JobBookingJobCard AS JEJ INNER JOIN JobBookingJobCardContents as JEJC ON JEJC.JobBookingID = JEJ.JobBookingID AND JEJC.CompanyID=JEJ.CompanyID inner join JobCardSchedule as JCS on JCS.JobCardID = JEJC.JobBookingID and JCS.JobContentsID = JEJC.JobContentsID INNER JOIN UserMaster as UM ON UM.UserID = JEJ.CreatedBy And UM.CompanyID=JEJ.CompanyID  INNER JOIN LedgerMaster as LM ON JCS.SchedulevENDORid = LM.LedgerID AND JCS.CompanyID=LM.CompanyID LEFT JOIN CategoryMaster as CC ON JEJ.CategoryID = CC.CategoryID  And JEJ.CompanyID=CC.CompanyID LEFT JOIN JobBooking AS J1 ON JEJ.BookingID = J1.BookingID AND JEJ.CompanyID=J1.CompanyID LEFT JOIN LedgerMaster as CM ON JEJ.ConsigneeID = CM.LedgerID And J1.CompanyID=CM.CompanyID  left join  LedgerMaster as JCM ON JEJ.CoordinatorLedgerID = JCM.LedgerID And JEJ.CompanyID=JCM.CompanyID " &
                                                "Where JEJC.JobBookingJobcardContentsID = '" & JobBookingJobcardContentsID & "'  AND JEJC.CompanyID='" & GBLCompanyID & "'  and JCS.OrderBookingScheduleID =" & OrderBookingScheduleID)
        Dim datasource As ReportDataSource = New ReportDataSource("JobcardSummary", CDT)
        e.DataSources.Add(datasource)

        Dim DTJob As DataTable = GetData("Select  '" & UserName & "' As PrintedBy,Getdate() As PrintedDate ")
        Dim JobContents1 As ReportDataSource = New ReportDataSource("DataSet1", DTJob)
        e.DataSources.Add(JobContents1)

    End Sub

    Private Sub JobCardProductionDetailsSubreportProcessing(ByVal senderDS As Object, ByVal d As SubreportProcessingEventArgs)
        Dim JobBookingJobcardContentsID As String = d.Parameters("JobBookingID").Values(0)
        'Dim dsContents As DataTable = getData("execute ProductionWorkOrderPrint 1," & ContID & ",'" & GBLCompanyID & "'")
        Dim datasource As ReportDataSource = New ReportDataSource("JobCardProductionDetails", dsContents)
        d.DataSources.Add(datasource)
        Dim datasource1 As ReportDataSource = New ReportDataSource("DataSetItemDetails", dsContents)
        d.DataSources.Add(datasource1)

        'Dim FDetail As New DataTable
        'FDetail = getData("Select JobCardFormNO,RefNo,TransID,PrintingStyle,Pages,TotalSheets,PrintingRemark,ActualSheets,WasteSheets,JobBookingID,JobBookingJobCardContentsID From JobBookingJOBCardFormWiseDetails Where CompanyID='" & GBLCompanyID & "' AND JobBookingID ='" & JobBookingJobcardContentsID & "' Order By TransID")

        'datasource = New ReportDataSource("FormDetails", FDetail)
        'd.DataSources.Add(datasource)
    End Sub

    Private Sub FormDetailSubreportProcessing(ByVal senderFD As Object, ByVal f As SubreportProcessingEventArgs)
        Dim JobBookingJobCardContentsID As Integer = f.Parameters("JobBookingID").Values(0)

        Dim FDetail As DataTable = GetData("Select JobCardFormNO,PlanContName,RefNo,TransID,PrintingStyle,Pages,PageNo,TotalSheets,PrintingRemark,ActualSheets,WasteSheets,JobBookingID,JobBookingJobCardContentsID From JobBookingJOBCardFormWiseDetails Where CompanyID='" & GBLCompanyID & "' AND JobBookingID ='" & JobBookingJobCardContentsID & "' Order By JobBookingJobCardContentsID,TransID")
        Dim datasource As New ReportDataSource("FormDetails", FDetail)
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
        Dim datasource As New ReportDataSource("DataSetItemDetails", IDE)
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
        Dim dss As New DataSet()
        Dim dt As New DataTable
        Try
            Dim con As SqlConnection = db.OpenDataBase()
            Dim sql As String = query
            Dim cmd As New SqlCommand(sql, con)
            Dim adapter As New SqlDataAdapter(cmd)
            adapter.Fill(dt)
            con.Close()
            Return dt
        Catch ex As Exception
            Return dt
        End Try
    End Function

    Protected Sub Email()
        MailError.InnerHtml = ""
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserId"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        If ContID = "" Or GBLCompanyID <= 0 Or GBLUserID <= 0 Then Exit Sub
        If (db.CheckAuthories("ProductionWorkOrder.aspx", GBLUserID, GBLCompanyID, "CanPrint", ContID) = False) Then
            MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
            Exit Sub
        End If

        Dim DtUser As New DataTable
        db.FillDataTable(DtUser, "SELECT Distinct IsnuLL(Nullif(EmailID,''),smtpUserName) As smtpUserID,  Isnull(smtpUserPassword,'') As smtpUserPassword,  Isnull(smtpServer,'smtp.gmail.com') As smtpServer,  Isnull(smtpServerPort,'587') As smtpServerPort,  Isnull(smtpAuthenticate,'True') As smtpAuthenticate,  Isnull(smtpUseSSL,'True') As smtpUseSSL FROM UserMaster Where Isnull(IsBlocked,0)=0 And IsnuLL(IsHidden,0)=0 And ISNULL(IsDeletedUser,0)=0 And CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID)
        If DtUser.Rows.Count <= 0 Then MailError.InnerHtml = "Invalid user details" : Exit Sub
        If DtUser.Rows(0)("smtpUserID") = "" Or DtUser.Rows(0)("smtpUserID").contains("@") = False Then
            MailError.InnerHtml = "Invalid sender mail id, Please update mail id in user master"
            Exit Sub
        End If
        Try
            Dim mm As New MailMessage(DtUser.Rows(0)("smtpUserID").ToString(), TxtEmailTo.Value.ToString()) With {
                .Subject = TxtSubject.Value.ToString(),
                .Body = TxtEmailBody.Value.ToString()
            }
            mm.Attachments.Add(New Attachment(ExportReportToPDF(Server.MapPath("~/Files/JobCard/"), "JobCard.pdf")))

            Dim DT_New As New DataTable()
            db.FillDataTable(DT_New, "SELECT Distinct AttachedFileName,UserAttachedPicture FROM JobBookingJobCardContents Where AttachedFileName<>'' And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And JobBookingID=(Select JobBookingID From JobBookingJobCard Where IsDeletedTransaction=0 And JobBookingNo='" & ContID & "' And CompanyID=" & GBLCompanyID & ")")
            For i = 0 To DT_New.Rows.Count - 1
                'Dim bytes As Byte() = System.Text.Encoding.Unicode.GetBytes(DT_New.Rows(i)("UserAttachedPicture"))
                Dim filename As String = Server.MapPath("~/Files/JobCard/UserAttchedFiles/" & DT_New.Rows(i)("AttachedFileName"))

                'Dim fi As New FileInfo(filename)
                'If (fi.Exists) Then    'if file exists, delete it
                '    'fi.Delete()
                'Else
                '    Using fs = New System.IO.FileStream(filename, System.IO.FileMode.Create)
                '        fs.Write(bytes, 0, bytes.Length)
                '        fs.Close()
                '    End Using
                'End If

                mm.Attachments.Add(New Attachment(filename))
            Next

            mm.IsBodyHtml = True
            mm.Priority = MailPriority.High
            If TxtEmailCC.Value.ToString() <> "" And TxtEmailCC.Value.Contains("@") = True Then
                mm.CC.Add(TxtEmailCC.Value.ToString())
            End If
            If TxtEmailBcc.Value.ToString() <> "" And TxtEmailBcc.Value.Contains("@") = True Then
                mm.Bcc.Add(TxtEmailBcc.Value.ToString())
            End If

            Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = DtUser.Rows(0)("smtpUserID").ToString(),
                .Password = DtUser.Rows(0)("smtpUserPassword").ToString()
            }

            Dim smtp As SmtpClient = New SmtpClient With {
                .Host = DtUser.Rows(0)("smtpServer").ToString(),
                .Credentials = credential,
                .Port = DtUser.Rows(0)("smtpServerPort").ToString(),
                .EnableSsl = DtUser.Rows(0)("smtpUseSSL").ToString()
                }
            smtp.Send(mm)

            MailError.InnerHtml = "Email Send Successfully"
            db.ExecuteNonSQLQuery("Update JobBookingJobCard Set IsMailSend=1,MailSendBy=" & GBLUserID & ",MailSendDate=GETDATE() Where CompanyID=" & GBLCompanyID & " And JobBookingNo='" & ContID & "'")
        Catch ex As Exception
            'MsgBox(ex.Message)
            MailError.InnerHtml = ex.Message
        End Try
    End Sub

    Private Function ExportReportToPDF(ByVal path As String, ByVal reportName As String) As String
        Dim warnings As Warning()
        Dim streamids As String()
        Dim DeviceInfo = "<DeviceInfo><EmbedFonts>None</EmbedFonts></DeviceInfo>"
        Dim bytes As Byte() = ReportViewer1.LocalReport.Render("PDF", DeviceInfo)
        Dim filename As String = path & reportName

        Using fs = New System.IO.FileStream(filename, System.IO.FileMode.Create)
            fs.Write(bytes, 0, bytes.Length)
            fs.Close()
        End Using

        Return filename
    End Function
End Class
