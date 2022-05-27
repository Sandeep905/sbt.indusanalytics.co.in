Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports Connection

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_NewSchedularPlanner
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLUserName As String
    Dim GBLBranchID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    Private Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
        Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer With {
            .MaxJsonLength = 2147483647
        }
        Dim tableRows As New List(Of Dictionary(Of [String], [Object]))()
        Dim row As Dictionary(Of [String], [Object])
        For Each dr As DataRow In dataTable.Rows
            row = New Dictionary(Of [String], [Object])()
            For Each col As DataColumn In dataTable.Columns
                row.Add(col.ColumnName, dr(col))
                System.Console.WriteLine(dr(col))
            Next
            tableRows.Add(row)
        Next
        Return serializer.Serialize(tableRows)
    End Function

    '---GetData Schedular Planner to open---

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllJobCardList(ByVal JCDateFrom As String, ByVal JCDateTo As String, ByVal checkB As String, ByVal checkD As String, ByVal DeldateboxJCDateFrom As String, ByVal DeldateboxTo As String) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Dim sql As String
            If checkB = "True" And checkD = "False" Then
                sql = "And Cast(Floor(Cast(JC.JobBookingDate as float)) as datetime)>='" & JCDateFrom & "' AND Cast(Floor(Cast(JC.JobBookingDate as float)) as datetime)<='" & JCDateTo & "'"
            ElseIf checkD = "True" And checkB = "False" Then
                sql = "And Cast(Floor(Cast(JC.DeliveryDate as float)) as datetime)>='" & DeldateboxJCDateFrom & "' AND Cast(Floor(Cast(JC.DeliveryDate as float)) as datetime)<='" & DeldateboxTo & "'"
            ElseIf checkD = "True" And checkB = "True" Then
                sql = "And Cast(Floor(Cast(JC.JobBookingDate as float)) as datetime)>='" & JCDateFrom & "' AND Cast(Floor(Cast(JC.JobBookingDate as float)) as datetime)<='" & JCDateTo & "' And Cast(Floor(Cast(JC.DeliveryDate as float)) as datetime)>='" & DeldateboxJCDateFrom & "' AND Cast(Floor(Cast(JC.DeliveryDate as float)) as datetime)<='" & DeldateboxTo & "'"
            Else
                sql = ""
            End If

            str = "Select JC.JobBookingNo,JC.JobBookingID,isnull(LM.LedgerID,0) as LedgerID, nullif(LM.LedgerName,'') as LedgerName, nullif(JOB.SalesOrderNO,'') as SalesOrderNO, nullif(JC.PONO,'') as PONO, CM.CategoryName,     " &
                  " Replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-') As JobBookingDate, nullif(JC.JobName,'') as JobName,Isnull(JC.OrderQuantity,0) as OrderQuantity,replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') as DeliveryDate, nullif(JC.ProductCode,'') as ProductCode,nullif(JC.JobPriority,'') As JobPriority " &
                  " From LedgerMaster as LM   " &
                  " INNER JOIN JobOrderBooking AS JOB ON  JOB.LedgerID = LM.LedgerID And JOB.CompanyID = LM.CompanyID   " &
                  " INNER JOIN JobBookingJobCard AS JC ON JC.OrderBookingID = JOB.OrderBookingID AND JC.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster AS CM ON JC.CategoryID = CM.CategoryID AND JC.CompanyID = CM.CompanyID " &
                  " Where JC.IsClose=0 And Isnull((Select Count(1) From JobBookingJobCardContents Where isnull(IsRelease,0)=0 And JobBookingID=JC.JobBookingID And CompanyID=JC.CompanyID ),0)>0 And JC.CompanyID='" & GBLCompanyID & "' " & sql & " AND Isnull(JC.IsDeletedTransaction,0) = 0   " &
                  " GROUP BY LM.LedgerID , LM.LedgerName ,JOB.SalesOrderNO , JC.PONO ,CM.CategoryName, Replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-')  ,  JC.JobName  , JC.OrderQuantity,replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') , JC.JobBookingNo,JC.JobBookingID,JC.ProductCode , JC.JobPriority  " &
                  " ORDER BY JC.JobBookingID"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSchedulePlanner(ByVal JCId As Integer) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select isnull(JCD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,isnull(LM.LedgerID,0) as LedgerID, nullif(LM.LedgerName,'') as LedgerName,  " &
                  "nullif(JOB.SalesOrderNO,'') as SalesOrderNO, nullif(JC.PONO,'') as PONO, nullif(JCD.JobCardContentNo,'') as JobCardContentNo,     " &
                  "replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-') as JobBookingDate, nullif(JC.JobName,'') as JobName, nullif(JCD.PlanContName,'') as PlanContName,  " &
                  "isnull(JC.OrderQuantity,0) as OrderQuantity,    replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') as DeliveryDate, nullif(JC.ProductCode,'') as ProductCode,  " &
                  "nullif(JC.JobPriority,'') as JobPriority, nullif(JCD.JobType,'') as JobType,    nullif(IM.ItemCode,'') as ItemCode,nullif(IM.ItemType,'') as ItemType,   " &
                  "nullif(IM.ItemName,'') as ItemName,isnull(JCD.FullSheets,0) as FullSheets, isnull(JCD.ActualSheets,0) as ActualSheets     " &
                  "From LedgerMaster as LM   " &
                  "INNER JOIN JobOrderBooking AS JOB ON  JOB.LedgerID = LM.LedgerID And JOB.CompanyID = LM.CompanyID AND Isnull(JOB.IsDeletedTransaction,0)=0 " &
                  "INNER JOIN JobBookingJobCard AS JC ON JC.OrderBookingID = JOB.OrderBookingID AND JC.CompanyID = JOB.CompanyID   " &
                  "INNER JOIN  JobBookingJobCardContents as JCD ON JCD.JobBookingID = JC.JobBookingID And JCD.CompanyID = JC.CompanyID   " &
                  "INNER JOIN ItemMaster as IM ON IM.ItemID = JCD.PaperID And JCD.CompanyID = IM.CompanyID   " &
                  "Where isnull(JCD.IsRelease,0)<>1 And JCD.CompanyID='" & GBLCompanyID & "' And JC.JobBookingID=" & JCId & " AND Isnull(JC.IsDeletedTransaction,0) = 0   " &
                  "GROUP BY JCD.JobBookingJobCardContentsID   , LM.LedgerID ,  LM.LedgerName ,JOB.SalesOrderNO  ,  JC.PONO   ,  JCD.JobCardContentNo ,  " &
                  "replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-')  ,  JC.JobName   ,  JCD.PlanContName   , JC.OrderQuantity   ,    replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') ,   " &
                  "JC.ProductCode , JC.JobPriority  ,  JCD.JobType ,    IM.ItemCode   , IM.ItemType ,  IM.ItemName  ,     JCD.FullSheets  ,  JCD.ActualSheets   " &
                  "ORDER BY JCD.JobCardContentNo"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOperation(ByVal JContentsID As String) As String

        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select isnull(JEO.JobBookingJobCardContentsID,0) as  JobBookingJobCardContentsID, isnull(JEO.SequenceNO,0) as SequenceNO,  isnull(JEO.ProcessID,0) as ProcessID,  " &
                   " nullif(PM.ProcessName,'') as ProcessName, nullif(JEO.RateFactor,'') as  RateFactor,Isnull(nullif(PM.ProcessProductionType,''),'None') as ProcessProductionType,  " &
                   " isnull(JEO.ToBeProduceQty,0)  As QTY     " &
                   " From JobBookingJobCardProcess As JEO INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JEO.ProcessID And PM.CompanyID = JEO.CompanyID   " &
                   " where  PM.ProcessName NOT LIKE '%Plate Making%' AND isnull(JEO.JobBookingJobCardContentsID,0)='" & JContentsID & "' AND JEO.CompanyID = '" & GBLCompanyID & "'  " &
                   " GROUP By JEO.JobBookingJobCardContentsID , JEO.SequenceNO,  JEO.ProcessID,   " &
                   " PM.ProcessName, JEO.RateFactor ,PM.ProcessProductionType,PM.ProcessID,JEO.CompanyID,isnull(JEO.ToBeProduceQty,0)   Order By JEO.JobBookingJobCardContentsID , JEO.SequenceNO "

            'str = "Select isnull(JEO.JobBookingJobCardContentsID,0) as  JobBookingJobCardContentsID, isnull(JEO.SequenceNO,0) as SequenceNO,  isnull(JEO.ProcessID,0) as ProcessID, nullif(PM.ProcessName,'') as ProcessName, nullif(JEO.RateFactor,'') as  RateFactor,nullif(PM.ProcessProductionType,'') as ProcessProductionType  " &
            '       " From JobBookingJobCardProcess As JEO INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JEO.ProcessID AND PM.CompanyID = JEO.CompanyID where  isnull(JEO.JobBookingJobCardContentsID,0)='" & JContentsID & "' " &
            '       " GROUP By JEO.JobBookingJobCardContentsID , JEO.SequenceNO,  JEO.ProcessID, PM.ProcessName, JEO.RateFactor ,PM.ProcessProductionType  " &
            '       " Order By JEO.JobBookingJobCardContentsID , JEO.SequenceNO "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFormWiseProcessDetail(ByVal ContentsID As String) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            str = "EXEC ScheduleReleaseFromWiseProcessWise '" & ContentsID & "', '" & GBLCompanyID & "' "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AllocatedSchedulePlanner(ByVal JobBookingContentsID As String) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select isnull(IM.ItemID,0) as ItemID, nullif(IM.ItemCode,'') as  ItemCode, nullif(IM.ItemName,'') as  ItemName, isnull(JR.RequiredQty,0) as RequiredQty,  nullif(IM.StockUnit,'') as StockUnit , isnull(JR.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID   " &
                    "From ItemMaster   As IM INNER JOIN   JobBookingJobCardProcessMaterialRequirement As JR On JR.ItemID = IM.ItemID And JR.CompanyID= IM.CompanyID    " &
                    "Where JR.JobBookingJobCardContentsID='" & JobBookingContentsID & "' And JR.CompanyID=" & GBLCompanyID & "  " &
                    "GROUP BY IM.ItemID, IM.ItemCode, IM.ItemName , JR.RequiredQty,  IM.StockUnit , JR.JobBookingJobCardContentsID Order BY IM.ItemCode"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeliverySchedulePlanner(ByVal TxtOrderSalesID As String) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select isnull(CM.LedgerID,0) as LedgerID, nullif(CM.LedgerName,'') as Consignee, isnull(JD.ScheduleQuantity,0) as ScheduleQuantity, replace(convert(nvarchar(30),JD.DeliveryDate,106),'','-') as DeliveryDate, nullif(JD.TransporterName,'') as  TransporterName, nullif(JD.SalesOrderNO,'') as  SalesOrderNO  " &
                  "  From LedgerMaster As CM INNER JOIN JobOrderBookingDeliveryDetails As JD On JD.ConsigneeID = CM.LedgerID And JD.CompanyID = CM.CompanyID And CM.LedgerGroupID = (Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID = 44 And CompanyID=CM.CompanyID ) Where JD.SalesOrderNo='" & TxtOrderSalesID & "' And JD.CompanyID=" & GBLCompanyID & "  " &
                  "  Order By JD.DeliveryDate"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachine() As String
        'ByVal UserId As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = " Select Distinct isnull(MM.MachineID,0) as MachineID, nullif(MM.MachineName,'') as MachineName, isnull(MM.MachineSpeed,0) as MachineSpeed,isnull(PM.ProcessID,0) as ProcessID  From ProcessMaster as PM INNER JOIN ProcessAllocatedMachineMaster as PAM ON PAM.ProcessID = PM.ProcessID AND PAM.CompanyID = PM.CompanyID INNER JOIN   " &
                    "MachineMaster AS MM ON MM.MachineID = PAM.MachineID AND  PAM.CompanyID = MM.CompanyID Where PAM.CompanyID = " & GBLCompanyID & " Order BY MachineName"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineWiseLoads(ByVal PId As Integer) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select MachineID, MachineName,Case When MachineLoad>0 Then Round(MachineLoad/60,2) Else 0 End As MachineLoadInHr From (Select MM.MachineID, MM.MachineName, (Isnull((Select Sum(Isnull(TotalTimeToBeTaken,0)) as TimeMinutes From JobScheduleReleaseMachineWise Where MachineID = MM.MachineID AND CompanyID = MM.CompanyID  GROUP BY MachineID),0) + Isnull((Select Sum(Isnull(TotalTimeToBeTaken,0)) as TimeMinutes From JobScheduleRelease  Where MachineID = MM.MachineID AND CompanyID = MM.CompanyID  GROUP BY MachineID),0)) As MachineLoad " &
                  " From MachineMaster as MM INNER JOIN ProcessAllocatedMachineMaster as P ON P.MachineID = MM.MachineID AND P.CompanyID = MM.CompanyID Where P.ProcessID = " & PId & " AND P.CompanyID =" & GBLCompanyID & ") As A  Order By MachineName"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open SaveSchedule  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveSchedule(ByVal FinalGridDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName, ScheduleID As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If db.IsDeletable("ScheduleID", "JobScheduleRelease", " Where IsDeletedTransaction=0 And JobBookingJobCardContentsID=" & FinalGridDetail(0)("JobBookingJobCardContentsID") & " And CompanyID=" & GBLCompanyID) = False Then
                Return "Error: Schedule already created for this content, please check show list.."
            End If

            If db.CheckAuthories("JobScheduleRelease.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then
                Return "Erorr: You are not authorized to save schedule"
            End If

            TableName = "JobScheduleRelease"
            ScheduleID = db.GenerateMaxVoucherNo(TableName, "ScheduleID", " Where CompanyID=" & GBLCompanyID)
            AddColName = "ModifiedDate,CreatedDate,CompanyID,CreatedBy,ModifiedBy,ScheduleID"
            AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLCompanyID & "','" & GBLUserID & "','" & GBLUserID & "'," & ScheduleID & ""

            str = db.InsertDatatableToDatabase(FinalGridDetail, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                Return "Error: " & str
            End If

            str = "Update JobBookingJobCardContents Set IsRelease = 1, ReleasedBy = '" & GBLUserID & "', ReleasedDate = '" & DateTime.Now & "' Where  JobBookingJobCardContentsID = '" & FinalGridDetail(0)("JobBookingJobCardContentsID") & "' And  CompanyID = " & GBLCompanyID
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetShowlistReleased() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = " SELECT Distinct LM.LedgerID ,nullif(LM.LedgerName,'') As LedgerName,nullif(JB.JobName,'') As JobName,JB.OrderQuantity,nullif(JB.JobBookingNo,'') As JobBookingNo,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,nullif(J.BookingNo,'') As BookingNo,JB.JobBookingID,JBC.JobCardContentNo, nullif(UM.UserName,'') As ReleasedBy,Replace(Convert(nvarchar(30),JSR.CreatedDate ,106),'','-') As ReleasedDate , nullif(U.UserName,'')  As JCBY,Replace(Convert(nvarchar(30),JB.DeliveryDate ,106),'','-') As DeliveryDate,JB.DeliveryDate AS DeliveryDateOrdered ,JBC.JobBookingJobCardContentsID,JSR.ScheduleID,JSS.IsScheduled , JBC.PlanContName,NULLIF(JBC.JobType,'') AS JobType, NULLIF(JBC.PONo,'') AS PONo, JBC.JobPriority, J.ProductCode" &
                  " FROM JobBookingJobCard As JB INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID=JB.CompanyID INNER JOIN JobScheduleRelease AS JSR ON JSR.JobBookingID = JBC.JobBookingID And JSR.JobBookingJobCardContentsID=JBC.JobBookingJobCardContentsID AND JSR.CompanyID = JBC.CompanyID INNER JOIN JobBooking As J ON J.BookingID=JB.BookingID And J.CompanyID=JB.CompanyID LEFT JOIN UserMaster As UM ON UM.UserID = JSR.CreatedBy And JBC.CompanyID=UM.CompanyID LEFT JOIN UserMaster As U ON U.UserID = JB.CreatedBy And U.CompanyID=JB.CompanyID INNER JOIN LedgerMaster As LM ON LM.LedgerID=JB.LedgerID And LM.CompanyID=JB.CompanyID Left Join JobScheduleReleaseSequence As JSS On JSR.ScheduleID=JSS.ScheduleID And JSR.CompanyID=JSS.CompanyID" &
                  " Where Isnull(JB.IsCancel,0)=0 And Isnull(JBC.IsLastProcessComplete,0)=0 And Isnull(JSR.IsDeletedTransaction,0)=0 And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & " And JSR.CreatedBy>0 Order by DeliveryDateOrdered, JSR.ScheduleID"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetReleasedQty(ByVal JobScheduleID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = " SELECT Distinct REPLACE(CONVERT(nvarchar(30), JSR.CreatedDate, 106), '', '-') AS ReleasedDate, JSR.JobName, JSR.ContentName, JSR.JobCardContentNo, JSR.ProcessName, Nullif( JSR.RateFactor,'') As RateFactor, JSR.MachineSpeed, JSR.JobCardFormNo, JSR.ScheduleQty, JSR.SequenceNo, MM.MachineName" &
                  " From JobScheduleRelease AS JSR INNER JOIN MachineMaster AS MM ON JSR.MachineID = MM.MachineId AND JSR.CompanyID = MM.CompanyID " &
                  " Where  (JSR.ScheduleID = " & JobScheduleID & ") And Isnull(JSR.IsDeletedTransaction,0)=0 And JSR.CompanyID=" & GBLCompanyID & " Order By SequenceNo"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteJobScheduleRelease(ByVal JobScheduleID As Integer, ByVal JobContentsID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            If db.CheckAuthories("JobScheduleRelease.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then
                Return "You are not authorized to delete"
            End If
            If db.IsDeletable("JobBookingID", "ProductionEntry", "Where CompanyID = " & GBLCompanyID & " And JobBookingJobCardContentsID = " & JobContentsID & "") = False Then
                Return "Production is started you can't delete this schedule"
            End If
            If db.IsDeletable("JobBookingID", "JobBookingJobCard", "Where CompanyID = " & GBLCompanyID & " And JobBookingID = " & JobContentsID & "") = False Then
                Return "Production is started you can't delete this schedule"
            End If
            str = "Update JobScheduleRelease Set IsDeletedTransaction=1,DeletedDate=Getdate(),DeletedBy=" & GBLUserID & " Where ScheduleID=" & JobScheduleID & " And JobBookingJobCardContentsID = '" & JobContentsID & "' And CompanyID=" & GBLCompanyID
            db.ExecuteNonSQLQuery(str)

            str = "Update JobBookingJobCardContents Set IsRelease = 0, ReleasedBy = 0, ReleasedDate = Getdate() Where  JobBookingJobCardContentsID = " & JobContentsID & " And  CompanyID = " & GBLCompanyID
            db.ExecuteNonSQLQuery(str)

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '---Close GetData Schedular Planner to open---



    '============================================Open Job Schedule Sequence===================================
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllScheduleSequenceList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = " SELECT Distinct isnull(LM.LedgerID,0) As LedgerID,nullif(JBC.PlanContName,'') As ContentName,nullif(LM.LedgerName,'') As LedgerName,nullif(JB.JobName,'') As JobName,nullif(JB.JobBookingNo,'') As JobBookingNo,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,nullif(J.BookingNo,'') As BookingNo,isnull(JB.JobBookingID,0) As JobBookingID,JBC.JobCardContentNo, nullif(UM.UserName,'') As ReleasedBy,Replace(Convert(nvarchar(30),JSR.CreatedDate ,106),'','-') As ReleasedDate , nullif(U.UserName,'')  As JCBY,Replace(Convert(nvarchar(30),JB.DeliveryDate ,106),'','-') As DeliveryDate,JB.DeliveryDate AS DeliveryDateOrdered ,JBC.JobBookingJobCardContentsID,JSR.ScheduleID" &
                  " FROM JobBookingJobCard As JB INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID=JB.CompanyID INNER JOIN JobScheduleRelease AS JSR ON JSR.JobBookingID = JBC.JobBookingID And JSR.JobBookingJobCardContentsID=JBC.JobBookingJobCardContentsID AND JSR.CompanyID = JBC.CompanyID INNER JOIN JobBooking As J ON J.BookingID=JB.BookingID And J.CompanyID=JB.CompanyID LEFT JOIN UserMaster As UM ON UM.UserID = JSR.CreatedBy And JBC.CompanyID=UM.CompanyID LEFT JOIN UserMaster As U ON U.UserID = JB.CreatedBy And U.CompanyID=JB.CompanyID INNER JOIN LedgerMaster As LM ON LM.LedgerID=JB.LedgerID And LM.CompanyID=JB.CompanyID " &
                  " Where JSR.JobBookingJobCardContentsID Not In (Select Distinct JobBookingJobCardContentsID From JobScheduleReleaseSequence Where Isnull(IsScheduled,0)=1 And CompanyID=JB.CompanyID) And Isnull(JB.IsCancel,0)=0 And Isnull(JBC.IsLastProcessComplete,0)=0 And Isnull(JB.IsDeletedTransaction,0)=0 And Isnull(JSR.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & " Order by DeliveryDateOrdered, JSR.ScheduleID"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateJobScheduleSequence(ByVal Obj_UpdateDate As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName, ScheduleSequenceID As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Using UpdatTrans As New Transactions.TransactionScope

            Try
                TableName = "JobScheduleReleaseSequence"
                ScheduleSequenceID = db.GenerateMaxVoucherNo(TableName, "ScheduleSequenceID", " Where CompanyID=" & GBLCompanyID)

                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ScheduleSequenceID"
                AddColValue = "GetDate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'," & ScheduleSequenceID & ""
                KeyField = db.InsertDatatableToDatabase(Obj_UpdateDate, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    UpdatTrans.Dispose()
                    Return "Error: " & KeyField
                End If

                dataTable = New DataTable()
                db.FillDataTable(dataTable, "Select IsScheduleSequenced From JobScheduleReleaseStatus")
                If dataTable.Rows.Count > 0 Then
                    KeyField = db.ExecuteNonSQLQuery("Update JobScheduleReleaseStatus Set IsScheduleSequenced=1")
                Else
                    KeyField = db.ExecuteNonSQLQuery("Insert Into JobScheduleReleaseStatus(IsScheduleSequenced,IsReady) Values(1,0)")
                End If
                If KeyField <> "Success" Then
                    UpdatTrans.Dispose()
                    Return "Error: " & KeyField
                End If

                UpdatTrans.Complete()
                KeyField = "Success"

            Catch ex As Exception
                UpdatTrans.Dispose()
                KeyField = "Error: " & ex.Message
            End Try
        End Using

        Return KeyField
    End Function

    '============================================Close Job Schedule Sequence===================================

    '============================================Open Job Schedule Gantt===================================
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSequencedGanttData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim DTMain, DTProcess As New DataTable
            str = "SELECT JSRM.FinalScheduleID As id,JSRM.JobCardContentNo, JSRM.JCFormNo, JSRM.RefNo, JSRM.ScheduleQty, JSRM.ProcessID,JSRM.TransID, JSRM.MachineID,  REPLACE(CONVERT(nvarchar(30), JSRM.StartTime, 106), '', '-') AS StartTime,  REPLACE(CONVERT(nvarchar(30), JSRM.EndTime, 106), '', '-') AS EndTime, JSRM.TotalTimeToBeTaken, JSRM.ScheduleDate, JSRM.MachineSpeed, " &
                  " JSRM.JobBookingJobcardContentsID, MM.MachineName FROM JobScheduleReleaseMachineWise AS JSRM INNER JOIN MachineMaster AS MM ON JSRM.MachineID = MM.MachineId And ISNULL(MM.IsDeletedTransaction,0)=0 AND JSRM.CompanyID =" & GBLCompanyID & " Order by JSRM.FinalScheduleID"

            db.FillDataTable(DTMain, str)
            str = "Select PM.ProcessName,PM.ProcessID,JBP.JobBookingJobCardContentsID From JobBookingJobCardProcess As JBP On PM.ProcessID=JBP.ProcessID And JBP.CompanyID=PM.CompanyID Inner Join JobScheduleRelease As JS On JS.JobBookingJobCardContentsID=JBP.JobBookingJobCardContentsID And JBP.CompanyID=JS.CompanyID"
            db.FillDataTable(DTProcess, str)

            DTMain.TableName = "DTMain"
            DTProcess.TableName = "DTProcess"
            Dim Dataset As New DataSet

            Dataset.Merge(DTMain)
            Dataset.Merge(DTProcess)
            data.Message = db.ConvertDataSetsTojSonString(Dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '============================================Close Job Schedule Gantt===================================
    '=============================================== Job Schedule Machine Wise==============================
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllMachineScheduleList(ByVal TName As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            If TName = "Temp" Then
                TName = "JobScheduleReleaseMachineWiseTemp"
            Else
                TName = "JobScheduleReleaseMachineWise"
            End If
            str = "SELECT Distinct JSRM.FinalScheduleID,JSRM.ScheduleID, Replace(Convert(nvarchar(30),JC.DeliveryDate ,106),'','-') As DeliveryDate, nullif(JCC.PlanContName,'') As ContentName, JCC.JobBookingJobcardContentsID, JSRM.MachineSpeed, Nullif(JSR.RateFactor,'') As RateFactor, JSRM.JCFormNo, JSRM.RefNo, JSRM.ScheduleQty, JSRM.TransID, JSRM.ProcessID, JSRM.MachineID, JSRM.StartTime, JSRM.EndTime, JSRM.TotalTimeToBeTaken, JSRM.ScheduleDate, MM.MachineName, PM.ProcessName, JC.JobName, JC.JobBookingNo, JC.ClientName, LM.LedgerName, JCC.JobCardContentNo , JCC.JobPriority " &
                  " FROM LedgerMaster AS LM INNER JOIN JobBookingJobCard AS JC ON JC.LedgerID = LM.LedgerID AND LM.CompanyID = JC.CompanyID INNER JOIN JobBookingJobCardContents AS JCC ON JC.JobBookingID = JCC.JobBookingID AND JC.CompanyID = JCC.CompanyID INNER JOIN " & TName & " AS JSRM  ON JCC.JobBookingJobcardContentsID = JSRM.JobBookingJobcardContentsID AND JCC.CompanyID = JSRM.CompanyID INNER JOIN JobScheduleRelease As JSR On JSR.ScheduleID=JSRM.ScheduleID And JSR.CompanyID=JSRM.CompanyID And JSRM.ProcessID=JSR.ProcessID AND Isnull(JSRM.RateFactor,'') = Isnull(JSR.RateFactor,'') Inner Join MachineMaster AS MM ON JSRM.MachineID = MM.MachineId AND JSRM.CompanyID = MM.CompanyID INNER JOIN ProcessMaster AS PM ON JSRM.ProcessID = PM.ProcessID AND JSRM.CompanyID = PM.CompanyID " &
                  " Where JC.CompanyID=" & GBLCompanyID & " And Isnull(JSR.Status,'In Queue')='In Queue' And Isnull(JSR.IsDeletedTransaction,0)=0 Order By JSRM.MachineID, JSRM.TransID,JSRM.StartTime"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    Public Function SaveAsMachineSchedule() As String
        Try
            str = "Truncate Table JobScheduleReleaseMachineWiseTemp; Insert Into JobScheduleReleaseMachineWiseTemp(FinalScheduleID, ScheduleID, JobBookingJobcardContentsID, MachineSpeed, JobCardContentNo, JCFormNo, RefNo, ScheduleQty, TransID, ProcessID, MachineID, StartTime, EndTime, TotalTimeToBeTaken, CompanyID, ScheduleDate) " &
                   "SELECT FinalScheduleID, ScheduleID, JobBookingJobcardContentsID, MachineSpeed, JobCardContentNo, JCFormNo, RefNo, ScheduleQty, ROW_NUMBER() OVER (PARTITION BY MachineID ORDER BY MachineID) As TransID , ProcessID, MachineID, StartTime, EndTime, TotalTimeToBeTaken, CompanyID, ScheduleDate FROM JobScheduleReleaseMachineWise;"
            Dim con As New SqlConnection
            con = db.OpenDataBase()
            Dim cmd As New SqlCommand(str, con) With {
                .CommandType = CommandType.Text,
                .Connection = con
            }
            cmd.ExecuteNonQuery()

            con.Close()
            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateMachineSchedule(ByVal ObjData As Object, ByVal MId As Integer) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            Using updateTransaction As New Transactions.TransactionScope
                TableName = "JobScheduleReleaseMachineWiseTemp"
                AddColName = "MachineID=" & MId
                KeyField = db.UpdateDatatableToDatabase(ObjData, TableName, AddColName, 6, " MachineID=" & MId & " And CompanyID=" & GBLCompanyID)
                If KeyField <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If
                KeyField = "Success"
                updateTransaction.Complete()
            End Using
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
        Return KeyField
    End Function

    '=============================================== Close Schedule Machine Wise==============================

    Public Class HelloWorldData
        Public Message As [String]
    End Class


End Class