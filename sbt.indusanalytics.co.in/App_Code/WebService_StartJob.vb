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
Public Class WebService_StartJob
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim GBLUserName As String
    Dim Str As String
    'Dim Version As String = "Estimo"
    Dim UserId As String = Convert.ToString(HttpContext.Current.Session("UserID"))
    Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))
    Dim VendorID As String = Convert.ToString(HttpContext.Current.Session("VendorID"))

    <System.Web.Services.WebMethod(EnableSession:=True)>
    <ScriptMethod(UseHttpGet:=True, ResponseFormat:=ResponseFormat.Json)>
    Private Sub HelloWorld()

        ''CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        ''UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        ''GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        ''FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        'Version = Convert.ToString(ConfigurationManager.AppSettings.Item("Version"))
        'Context.Response.Clear()
        'Context.Response.ContentType = "application/json"
        'data.Message = db.ConvertDataTableTojSonString(GetDataTable)
        'Context.Response.Write(js.Serialize(data.Message))
    End Sub

    ''---------------------------- Start  Code  ------------------------------------------ Pradeep Yadav 09 Dec 2019

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOperatorMachineWise(ByVal MId As Integer) As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Str = "Select Distinct LM.LedgerID As OperatorID,LM.LedgerName As OperatorName From LedgerMaster As LM Inner Join EmployeeMachineAllocation As EMA On EMA.LedgerID=LM.LedgerID And EMA.CompanyID=LM.CompanyID Where IsNull(LM.IsDeletedTransaction,0)=0 And EMA.MachineID=" & MId & " And LM.CompanyID=" & CompanyId
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOperator(ByVal LId As Integer) As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And LM.VendorID=" & VendorID)

            If LId > 0 Then Str = " OperatorID=" & LId & " And "
            Str = "Select Distinct OperatorID,OperatorName From UserOperatorAllocation As UOA Inner Join LedgerMaster AS LM ON LM.LedgerID=UOA.OperatorID And LM.CompanyID=UOA.CompanyID Where IsNull(LM.IsDeletedTransaction,0)=0 And " & Str & VendorID & " LM.CompanyID=" & CompanyId
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachine(ByVal EmpID As Integer) As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Str = "Select Distinct MM.MachineID, MM.MachineName,Upper(MM.CurrentStatus) As CurrentStatus From MachineMaster As MM INNER JOIN EmployeeMachineAllocation As EM On EM.MachineID = MM.MachineID And EM.CompanyID=MM.CompanyID Inner Join UserOperatorAllocation As UOA On UOA.OperatorID=EM.LedgerID And UOA.CompanyID=EM.CompanyID /*Inner Join JobScheduleRelease As JS On JS.MachineID=MM.MachineId And JS.CompanyID=MM.CompanyID*/ Where MM.CompanyId=" & CompanyId & " And UOA.UserID=" & UserId & " And Isnull(MM.IsDeletedTransaction,0)=0 Order By MachineName"
            'Str = "Select Distinct isnull(MM.MachineID,0) As MachineID, nullif(MM.MachineName,'') As MachineName,isnull(OMAM.ProcessID,0) As ProcessID ,nullif(OM.ProcessName,'') As ProcessName,nullif(MM.CurrentStatus,'') As CurrentStatus From MachineMaster As MM INNER JOIN  EmployeeMachineAllocation As EM On EM.MachineID = MM.MachineID And EM.CompanyID=MM.CompanyID Right Join ProcessAllocatedMachineMaster as OMAM  ON OMAM.MachineID=MM.MachineID  and OMAM.CompanyID=MM.CompanyID Inner Join ProcessMaster As OM on OM.ProcessID=OMAM.ProcessID And OM.CompanyID=OMAM.CompanyID Inner Join JobScheduleRelease As JS On JS.MachineID=MM.MachineId And JS.CompanyID=MM.CompanyID And Isnull(JS.Status,'In Queue')<>'Running' Where MM.CompanyId=" & CompanyId & " And MM.MachineID=" & EmpID & " GROUP BY MM.MachineID, MM.MachineName,OMAM.ProcessID,OM.ProcessName,MM.CurrentStatus Order By MachineName"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetUserWiseOperators() As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            Str = "Select OperatorID,OperatorName From UserOperatorAllocation Where IsNull(IsDeletedTransaction,0)=0 And UserID=" & UserId & " And CompanyID=" & CompanyId
            'str = "Select Distinct MM.MachineID, MM.MachineName,MM.LedgerID From MachineMaster As MM Inner Join EmployeeMachineAllocation As EMA On MM.MachineID=EMA.MachineID And EMA.CompanyID=MM.CompanyID Where IsNull(IsDeletedTransaction,0)=0 And UserID=" & GblUserID & " And CompanyID=" & GblCompanyID
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineOperatorWise(ByVal EmpID As Integer) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        Str = "Select Distinct MM.MachineID, MM.MachineName,OM.ProcessID ,OM.ProcessName,MM.CurrentStatus  From MachineMaster As MM INNER JOIN  EmployeeMachineAllocation As EM On EM.MachineID = MM.MachineID And EM.CompanyID=MM.CompanyID AND IsNull(MM.IsDeletedTransaction,0)=0 Right Join ProcessAllocatedMachineMaster as OMAM  ON OMAM.MachineID=MM.MachineID  and OMAM.CompanyID=MM.CompanyID Inner Join ProcessMaster As OM on OM.ProcessID=OMAM.ProcessID And OM.CompanyID=OMAM.CompanyID /*Inner Join JobScheduleRelease As JS On JS.MachineID=MM.MachineId And JS.CompanyID=MM.CompanyID And Isnull(JS.Status,'In Queue')<>'Running'*/ Where IsNull(OM.IsDeletedTransaction,0)=0 And MM.CompanyId=" & CompanyId & " And EM.LedgerID=" & EmpID & " GROUP BY MM.MachineID, MM.MachineName,OM.ProcessID,OM.ProcessName,MM.CurrentStatus Order By MachineName"

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCard(ByVal Operation_ID As Integer, ByVal MID As Integer) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And JSR.VendorID=" & VendorID)

        Str = "SELECT Distinct JEJ.JobBookingNo, JEJ.JobBookingID FROM JobBookingJobCard AS JEJ Inner Join JobScheduleRelease As JSR On JEJ.JobBookingID=JSR.JobBookingID And JSR.CompanyID=JEJ.CompanyID Inner Join ProcessAllocatedMachineMaster As PMM On PMM.MachineId=JSR.MachineID And PMM.CompanyID=JSR.CompanyID And PMM.IsDeletedTransaction=0 WHERE IsNull(JEJ.IsDeletedTransaction,0)=0 And JEJ.IsClose=0 AND IsNull(JSR.IsDeletedTransaction,0)=0 AND (Isnull(JSR.Status,'In Queue') <> 'Complete') AND (JEJ.CompanyID =" & CompanyId & ") And PMM.ProcessID IN(Select ProcessID From ProcessAllocatedMachineMaster Where MachineID = " & MID & " And IsDeletedTransaction=0 And CompanyID=" & CompanyId & ")" & VendorID

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardContents(ByVal Operation_ID As Integer, ByVal MID As Integer, ByVal BKID As String) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Str = "SELECT Distinct NULLIF (JEJ.JobBookingNo, '') AS JobBookingNo, JEJC.JobCardContentNo+'-'+JEJC.PlanContName AS JobCardContentNo, JEJC.JobBookingJobCardContentsID FROM JobBookingJobCardContents AS JEJC INNER JOIN JobBookingJobCardProcess AS JBJP ON JEJC.JobBookingID = JBJP.JobBookingID AND JEJC.CompanyID = JBJP.CompanyID INNER JOIN JobBookingJobCard AS JEJ ON JEJC.JobBookingID = JEJ.JobBookingID AND JEJC.CompanyID = JEJ.CompanyID LEFT JOIN JobScheduleRelease AS JSR ON JEJC.JobBookingID = JSR.JobBookingID AND JSR.MachineID = " & MID & " AND JSR.CompanyID = JEJC.CompanyID AND IsNull(JEJ.IsDeletedTransaction,0)=0  And JEJC.JobBookingJobCardContentsID=JSR.JobBookingJobCardContentsID  LEFT OUTER JOIN JobBookingJobCardFormWiseDetails AS JCF ON JEJC.JobBookingID = JCF.JobBookingID AND JCF.CompanyID = JEJC.CompanyID AND JCF.JobCardFormNo = JSR.JobCardFormNo WHERE IsNull(JSR.IsDeletedTransaction,0)=0 AND (Isnull(JSR.Status,'In Queue') Not In ('Complete','Running')) And JEJC.IsRelease=1 AND /*(JBJP.ProcessID = " & Operation_ID & ") AND*/ (JEJC.CompanyID =" & CompanyId & ") And JEJ.JobBookingID='" & BKID & "'"
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentProcess(ByVal MachineID As Integer, ByVal ContentID As Integer) As String
        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Str = "SELECT Distinct NULLIF (JS.RateFactor,'') As RateFactor,OM.ProcessID,OM.ProcessName ,OM.ProcessName + Case When JS.RateFactor<>'' Then '('+JS.RateFactor+')' ELSE '' End As ProcessFactorName " &
              " FROM JobBookingJobCardContents AS JEJC INNER JOIN JobBookingJobCardProcess AS JOS ON JOS.JobBookingJobCardContentsID = JEJC.JobBookingJobCardContentsID AND JEJC.CompanyID = JOS.CompanyID INNER JOIN ProcessMaster AS OM ON OM.ProcessID = JOS.ProcessID AND OM.CompanyID = JOS.CompanyID INNER JOIN JobScheduleRelease AS JS ON JS.JobBookingID = JOS.JobBookingID AND JS.JobBookingJobCardContentsID = JEJC.JobBookingJobCardContentsID AND JS.CompanyID = JEJC.CompanyID AND  JOS.ProcessID = JS.ProcessID LEFT OUTER JOIN JobBookingJobCardFormWiseDetails AS JEJF ON JEJC.JobBookingJobCardContentsID = JEJF.JobBookingJobCardContentsID AND JEJF.CompanyID = JEJC.CompanyID AND JS.JobCardFormNO = JEJF.JobCardFormNo AND JS.ProcessID = JOS.ProcessID WHERE (JEJC.JobBookingJobCardContentsID = '" & ContentID & "') AND ISNULL(JS.Status, N'In Queue') NOT IN ('Complete', 'Running') AND (OM.ProcessID IN(Select ProcessID From ProcessAllocatedMachineMaster Where MachineID = " & MachineID & " And CompanyID=" & CompanyId & " And IsDeletedTransaction=0)) AND (JOS.CompanyID = " & CompanyId & ")"
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentForms(ByVal MachineID As Integer, ByVal ContentID As Integer, ByVal ProcID As Integer) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))

        Str = "SELECT Distinct JS.JobCardFormNo,JS.ScheduleSequenceID FROM JobBookingJobCardContents AS JEJC INNER JOIN JobScheduleRelease AS JS ON JS.JobBookingID = JEJC.JobBookingID AND JS.JobBookingJobCardContentsID = JEJC.JobBookingJobCardContentsID AND JS.CompanyID = JEJC.CompanyID WHERE (JEJC.JobBookingJobCardContentsID = '" & ContentID & "') AND ISNULL(JS.Status, N'In Queue') NOT IN ('Complete',  'Running') And JEJC.IsDeletedTransaction=JS.IsDeletedTransaction And JEJC.IsDeletedTransaction=0 AND /*(JS.MachineID = " & MachineID & ") AND*/ (JS.ProcessID = " & ProcID & ") AND (JS.CompanyID = " & CompanyId & ")  ORDER BY JS.ScheduleSequenceID,JS.JobCardFormNo"

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectedData(ByVal MachineID As String) As String
        Str = "Exec [GetProductionMakeReadyStartData] " & CompanyId & "," & MachineID & ",'Make Ready'"
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardDetails(ByVal MachineID As Integer, ByVal ObjJobCardNo As String, ByVal ProcID As Integer, ByVal RateFactor As String, ByVal FormNo As String) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        Str = "Exec [GetProductionStartData] " & CompanyId & "," & ObjJobCardNo & "," & MachineID & "," & ProcID & " ,'" & RateFactor & "','" & FormNo & "'"
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPaperDetail(ByVal BookingTrID As String, ByVal DeptID As Integer) As String
        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Str = "Exec GetProductionItemDetails " & BookingTrID & "," & DeptID & "," & CompanyId
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFormWiseReceiptQty(ByVal FormNo As String, ByVal PID As Integer) As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "SELECT JobBookingID, JobBookingJobCardContentsID, JobCardFormNo, MachineID, ProcessID, EmployeeID, Status,ReadyQuantity, ProductionQuantity, WastageQuantity, SuspenseQuantity, RejectedQuantity FROM ProductionEntryFormWise Where JobCardFormNo='" & FormNo & "' And ProcessID=dbo.GETPREVIOUSProcessID(J.JobBookingJobCardContentsID, J.CompanyID, " & PID & ") And CompanyID=" & CompanyId
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckMachineStatusHome(ByVal MachineID As Integer) As String
        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        'Str = "Select Top 1 MCS.Status, MM.MachineID ,MM.MachineName From MachineMaster As MM INNER JOIN MachineCurrentStatusEntry As MCS On MCS.MachineID = MM.MachineID And MCS.CompanyID = MM.CompanyID Where MM.MachineID = " & MachineID & " AND MM.CompanyID=" & CompanyId & " Order By MCS.StartTime Desc "
        Str = "Select Top 1 MCS.TransactionID,Isnull(MCS.MachineStatus, MCS.Status) AS Status, MM.MachineID, MM.MachineName From MachineMaster As MM INNER JOIN MachineCurrentStatusEntry As MCS On MCS.MachineID = MM.MachineId And MCS.CompanyID = MM.CompanyID LEFT JOIN ProductionEntry AS ME ON ME.MachineID = MM.MachineID ANd MM.CompanyID = ME.CompanyID And ME.JobBookingJobCardContentsID=MCS.JobBookingJobCardContentsID And ME.ProcessID =MCS.ProcessID And ME.FromTime>=MCS.StartTime Where MM.MachineID = " & MachineID & " AND MM.CompanyID=" & CompanyId & " Order By TransactionID Desc "
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckMachineStatus(ByVal MachineID As Integer) As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'Str = "Select isnull(ME.MachineID,0) As MachineID, nullif(JEJ.JobBookingNo,'') As JobBookingNo,nullif(JEJC.JobCardContentNo,'') As JobCardContentNo,  nullif(OM.ProcessName,'') As ProcessName,nullif(MM.MachineName,'') As MachineName  From MachineMaster As MM INNER JOIN ProductionEntry AS ME ON ME.MachineID = MM.MachineID ANd MM.CompanyID = ME.CompanyID INNER JOIN JobBookingJobCardContents As JEJC On JEJC.JobBookingJobCardContentsID = Me.JobBookingJobCardContentsID And JEJC.CompanyID = ME.CompanyID INNER JOIN JobBookingJobCard As JEJ On JEJC.JobBookingID = JEJ.JobBookingID And JEJC.CompanyID = JEJ.CompanyID AND IsNull(JEJ.IsDeletedTransaction,0)=0 INNER JOIN ProcessMaster as OM On OM.ProcessID = ME.ProcessID ANd OM.CompanyID = ME.CompanyID Where ME.MachineID = " & MachineID & " AND ME.CompanyID=" & CompanyId & " AND ME.Status = 'Running' "
        Str = "Select Top 1 ME.ProductionID, ME.Status, ME.MachineID, JEJ.JobBookingNo,JEJC.JobCardContentNo,OM.ProcessName,MM.MachineName From MachineMaster As MM INNER JOIN ProductionEntry AS ME ON ME.MachineID = MM.MachineID ANd MM.CompanyID = ME.CompanyID INNER JOIN JobBookingJobCardContents As JEJC On JEJC.JobBookingJobCardContentsID = Me.JobBookingJobCardContentsID And JEJC.CompanyID = ME.CompanyID INNER JOIN JobBookingJobCard As JEJ On JEJC.JobBookingID = JEJ.JobBookingID And JEJC.CompanyID = JEJ.CompanyID AND IsNull(JEJ.IsDeletedTransaction,0)=0 INNER JOIN ProcessMaster as OM On OM.ProcessID = ME.ProcessID ANd OM.CompanyID = ME.CompanyID Where ME.MachineID = " & MachineID & " AND ME.CompanyID=" & CompanyId & " /*AND ME.Status = 'Running'*/ Order By ProductionID Desc "
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckMachineCurrentStatus(ByVal MachineID As Integer) As String
        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Str = "Select Distinct MM.MachineID,UPPER(Isnull(JS.Status,'IN QUEUE')) As Status,MM.DepartmentID,nullif(MM.MachineName,'') As MachineName From MachineMaster As MM INNER JOIN JobScheduleRelease AS JS ON JS.MachineID = MM.MachineID AND MM.CompanyID = JS.CompanyID Where JS.IsDeletedTransaction=0 And MM.MachineID = " & MachineID & " AND MM.CompanyID=" & CompanyId & " Order BY Status Desc"

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ReloadBindingContentDetails(ByVal BKID As Integer, ByVal ContID As Integer) As String
        Try

            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "SELECT LM.LedgerID,JBC.JobBookingId,LM.LedgerName,JB.JobName,JBC.PlanContName,JB.JobBookingNo,Convert(CHAR(30),JB.JobBookingDate, 106) AS JobBookingDate,0 As IssueQuantity,Case When Isnull(JOBD.DeliveryDate,'')='' Then Convert(CHAR(30),JOBD.ExpectedDeliveryDate, 106) Else Convert(CHAR(30),JOBD.DeliveryDate, 106) End As DeliveryDate, C.CategoryName,0 As Gang,JBC.JobCardContentNo,JOB.SalesOrderNo, Convert(CHAR(30),JOBD.OrderBookingDate, 106) As OrderBookingDate,  JOBD.OrderQuantity, JOBD.PONO,  Convert(CHAR(30),JOBD.PODate, 106) As PODate, JOBD.Remark, JBC.JobSize,  JBC.JobType, JBC.CoordinatorLedgerName, JBC.JobPriority,  JBC.JobReference,JBC.JobDetailsRemark	,JBC.QCInstruction, ('L=' + Convert(Nvarchar(10),VJBC.PaperTrimleft)+ ';R=' +  Convert(Nvarchar(10),VJBC.PaperTrimright) + ';T='    +Convert(Nvarchar(10),VJBC.PaperTrimtop) + ';B=' +Convert(Nvarchar(10), VJBC.PaperTrimbottom)) As PaperTrimming FROM  JobBookingJobCard As JB INNER JOIN CategoryMaster As C ON C.CategoryID=  JB.CategoryID And C.CompanyID= JB.CompanyID And JB.CompanyID= " & CompanyId & "  INNER JOIN JobBookingJobCardContents  As JBC ON  JBC.JObBookingID=JB.JobBookingID And JBC.CompanyID = JB.CompanyID  INNER JOIN ViewJobBookingJobCardContents  As VJBC ON  JBC.JObBookingID=VJBC.JobBookingID And JBC.JobBookingJobCardContentsID=VJBC.JobBookingJobCardContentsID And JBC.CompanyID= VJBC.CompanyID INNER JOIN JobOrderBookingDetails As JOBD ON JOBD.OrderBookingID  = JB.OrderBookingID And JOBD.CompanyID = JB.CompanyID INNER JOIN JobOrderBooking As JOB ON JOB.OrderBookingID  =JOBD.OrderBookingID And JOB.CompanyID = JB.CompanyID INNER JOIN  LedgerMaster As LM ON LM.LedgerID=JOBD.LedgerID  And JB.CompanyID = LM.CompanyID   And  Isnull(JB.IsCancel,0)=0 AND  Isnull(JBC.IsRelease,0) = 1 And Isnull(JB.IsHold,0)=0 Where JB.JobBookingID = " & BKID & " AND JBC.JobBookingJobCardContentsID <>  " & ContID & " Group By LM.LedgerID,JB.JobBookingDate,JBC.JobBookingID,  LM.LedgerName,JB.JobName,JB.JobBookingNo,JB.OrderQuantity,JBC.PlanContName,C.CategoryName, JBC.JobCardContentNo,JB.IsHold,JB.IsCancel ,JOBD.DeliveryDate, JOBD.ExpectedDeliveryDate ,JOBD.DeliveryDate  ,JBC.PlanContName,  JOBD.SalesOrderNo, JOB.SalesOrderNo, JOBD.OrderBookingDate, JOBD.OrderQuantity, JOBD.PONO, JOBD.PODate, JOBD.Remark, JBC.JobSize, JBC.JobType, JBC.CoordinatorLedgerName,JBC.JobPriority, JBC.JobReference,JBC.JobDetailsRemark,JBC.QCInstruction,VJBC.PaperTrimleft, VJBC.PaperTrimright,VJBC.PaperTrimtop,VJBC.PaperTrimbottom, JBC.PlanContentType Order by JB.JobBookingNo"

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Private Function CheckCommonFormStatus(ByVal ProcID As Integer, ByVal ContID As Integer, ByVal Status As String, ByVal TotalForms As Integer) As String
        Try
            Dim Running As Integer = 0
            Dim PartComplete As Integer = 0
            Dim Complete As Integer = 0
            Dim InQueue As Integer = 0

            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "Select Status, JobCardFormNo, ProcessID From ProductionEntryFormWise Where ProcessID = " & ProcID & " AND CompanyID=" & CompanyId & " And JobBookingJobCardContentsID =" & ContID

            db.FillDataTable(dataTable, Str)
            If dataTable.Rows.Count > 0 Then
                For index = 0 To dataTable.Rows.Count - 1
                    If dataTable.Rows(index)("Status") = "Running" Then
                        Running = 1 + Running
                    ElseIf dataTable.Rows(index)("Status") = "Part Complete" Then
                        PartComplete = 1 + PartComplete
                    ElseIf dataTable.Rows(index)("Status") = "Complete" Then
                        Complete = 1 + Complete
                    ElseIf dataTable.Rows(index)("Status") = "In Queue" Then
                        InQueue = 1 + InQueue
                    End If
                Next
            End If
            If (TotalForms - 1) = Complete And Running = 1 And Status = "Complete" Then
                CheckCommonFormStatus = "Complete"
            ElseIf (TotalForms - 1) > Complete And Running >= 1 And PartComplete >= 1 Or Status = "Part Complete" Then
                CheckCommonFormStatus = "Part Complete"
            Else
                CheckCommonFormStatus = ""
            End If

            Return CheckCommonFormStatus
        Catch ex As Exception
            Return ""
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RefreshFormWiseDetails(ByVal ProId As Integer, ByVal BKId As Integer, ByVal Purpose As String) As String
        Try

            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If Purpose = "Gathering" Then
                Str = "Select J.JobBookingID,J.JobCardFormNo,J.RefNo,J.ColorsFB, J.Pages, J.PageNo, J.TotalSheets,J.PrintingStyle, J.FoldingStyle,  J.TotalFolds,  J.PrintingRemark,J.FoldingRemark,J.OtherRemark, PE.Status ,MM.MachineID, MM.MachineName, EM.LedgerID, EM.LedgerName, PE.ProductionID,Isnull(PE.ReadyQuantity,0) As ReadyQuantity From JobBookingJobCardFormWiseDetails As J INNER JOIN ProductionEntryFormWise as PE ON PE.JobCardFormNo = J.JobCardFormNo And PE.CompanyID=J.CompanyID AND PE.ProcessID = dbo.GETPREVIOUSProcessID(J.JobBookingJobCardContentsID, J.CompanyID, " & ProId & ") /*AND J.RefNo = PE.RefNo*/ INNER JOIN  MachineMaster as MM ON MM.MachineID = PE.MachineID And PE.CompanyID=MM.CompanyID INNER JOIN LedgerMaster as EM  ON EM.LedgerID = PE.EmployeeID And PE.CompanyID=EM.CompanyID Where J.JobBookingID= " & BKId & " And J.CompanyID=" & CompanyId & " Order by J.RefNO "
            Else
                Str = "Select J.JobCardFormNo,J.RefNo,J.ColorsFB, J.Pages, J.PageNo, J.ActualSheets, J.WasteSheets, J.TotalSheets ,J.PrintingStyle,J.PrintingRemark,J.FoldingRemark, J.OtherRemark, CASE WHEN Isnull(PE.Status,'') = '' THEN 'In Queue' ELSE PE.Status END AS Status,MM.MachineID, MM.MachineName, EM.LedgerID, EM.LedgerName, PE.ProductionID,Isnull(PE.ReadyQuantity,0) As ReadyQuantity  From JobBookingJobCardContents as JEJ INNER JOIN JobBookingJobCardFormWiseDetails as J  ON J.JobBookingJobCardContentsID = JEJ.JobBookingJobCardContentsID And JEJ.CompanyID=J.CompanyID LEFT JOIN ProductionEntryFormWise as PE ON PE.JobCardFormNo = J.JobCardFormNo  AND PE.ProcessID = " & ProId & " And PE.CompanyID=J.CompanyID AND J.RefNo =  PE.RefNo AND PE.ProductionID IN(Select Max(Isnull(ProductionID,0)) From ProductionEntryFormWise Where JobBookingJobCardContentsID = J.JobBookingJobCardContentsID AND  JobCardFormNo = PE.JobCardFormNo AND ProcessID =  PE.ProcessID And CompanyID=PE.CompanyID) AND  PE.TransID IN(Select Max(Isnull(TransID,0)) From ProductionEntryFormWise Where   JobBookingJobCardContentsID= PE.JobBookingJobCardContentsID AND  JobCardFormNo = PE.JobCardFormNo AND ProcessID =  PE.ProcessID And CompanyID=PE.CompanyID) LEFT JOIN MachineMaster as MM ON MM.MachineID = PE.MachineID And MM.CompanyID=PE.CompanyID LEFT JOIN LedgerMaster as  EM  ON EM.LedgerID = PE.EmployeeID  And PE.CompanyID=EM.CompanyID Where J.JobBookingJobCardContentsID= " & BKId & " And J.CompanyID=" & CompanyId & " Order by J.RefNO "
            End If
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function EstimoStartProductionData(ByVal objMachine_Entry As Object, ByVal DdlStatus As String, ByVal objFormsEntry As Object) As String

        Dim dt As New DataTable
        Dim KeyField, KeyFieldStatus As String
        Dim Max_Production_ID As String

        Dim AddColName, AddColValue, TableName As String

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'FYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Dim con As New SqlConnection
        Dim objTrans As SqlTransaction
        Dim Shift As String = db.GetColumnValue("ShiftNo", "ShiftManagement", " CompanyID='" & CompanyId & "' And Convert(varchar, getdate(), 8) Between  Convert(varchar, StartTime , 8) And Convert(varchar, EndTime, 8)")
        If Shift = "" Then Shift = 1
        Dim TransID = db.GenerateMaxVoucherNo("ProductionEntry", "TransID", "Where CompanyID='" & CompanyId & "' And ProcessID=" & objMachine_Entry(0)("ProcessID") & " And JobBookingJobCardContentsID=" & objMachine_Entry(0)("JobBookingJobCardContentsID"))

        con = db.OpenDataBase()
        If con.State = ConnectionState.Closed Then
            con.Open()
        End If
        objTrans = con.BeginTransaction()

        Try

            TableName = "ProductionEntry"
            AddColName = "ModifiedDate,FromTime,UserID,CompanyID,FYear,Shift,TransID"
            AddColValue = "Getdate(),Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "'," & Shift & "," & TransID
            Max_Production_ID = db.ProductionInsertDatatableToDatabase(objMachine_Entry, TableName, AddColName, AddColValue, con, objTrans)
            If IsNumeric(Max_Production_ID) = False Then
                objTrans.Rollback()
                KeyFieldStatus = Max_Production_ID
                Return KeyFieldStatus
            End If

            TableName = "ProductionUpdateEntry"
            AddColName = "ModifiedDate,FromTime,UserID,CompanyID,FYear,ProductionID,Shift,TransID"
            AddColValue = "Getdate(),Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "','" & Max_Production_ID & "'," & Shift & "," & TransID
            KeyFieldStatus = db.ProductionInsertDatatableToDatabase(objMachine_Entry, TableName, AddColName, AddColValue, con, objTrans)
            If IsNumeric(KeyFieldStatus) = False Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            TableName = "ProductionEntryFormWise"
            AddColName = "ModifiedDate,FromTime,UserID,CompanyID,FYear,ProductionID,Shift,TransID"
            AddColValue = "Getdate(),Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "','" & Max_Production_ID & "'," & Shift & "," & TransID
            KeyFieldStatus = db.ProductionInsertDatatableToDatabase(objFormsEntry, TableName, AddColName, AddColValue, con, objTrans)
            If IsNumeric(KeyFieldStatus) = False Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            Str = "Update JobBookingJobCardProcess Set Status='" & DdlStatus & "' WHERE CompanyID='" & CompanyId & "' and ProcessID='" & objMachine_Entry(0)("ProcessID") & "' And RateFactor='" & objMachine_Entry(0)("RateFactor") & "' And JobBookingJobCardContentsID=" & objMachine_Entry(0)("JobBookingJobCardContentsID")
            Dim cmd As New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Connection = con,
                .Transaction = objTrans
            }
            KeyFieldStatus = cmd.ExecuteNonQuery()
            If KeyFieldStatus <= 0 Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            ''Schedule release status update
            Str = "Update JobScheduleRelease Set Status='" & DdlStatus & "' Where JobCardFormNo='" & objFormsEntry(0)("JobCardFormNo") & "' And CompanyID='" & CompanyId & "' And RateFactor='" & objMachine_Entry(0)("RateFactor") & "' And ScheduleSequenceID=" & objMachine_Entry(0)("ScheduleSequenceID") & " And ProcessID=" & objMachine_Entry(0)("ProcessID") & " And JobBookingJobCardContentsID=" & objMachine_Entry(0)("JobBookingJobCardContentsID")
            cmd = New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Transaction = objTrans
            }
            KeyFieldStatus = cmd.ExecuteNonQuery()
            If KeyFieldStatus <= 0 Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            KeyFieldStatus = "Success"

            objTrans.Commit()
            '   End If
        Catch ex As Exception
            objTrans.Rollback()
            KeyFieldStatus = "fail " & ex.Message
        Finally
            con.Close()
            KeyField = KeyFieldStatus
        End Try
        Return KeyField

    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function EstimoSaveProductionData(ByVal objPEEntry As Object, ByVal objUpdateEntry As Object, ByVal ProductionID As Integer, ByVal objFormsEntry As Object) As String

        Dim dt As New DataTable
        Dim KeyField, KeyFieldStatus As String

        Dim AddColName, AddColValue, wherecndtn, TableName As String

        Dim con As New SqlConnection
        Dim objTrans As SqlTransaction
        Dim Shift As String = db.GetColumnValue("ShiftNo", "ShiftManagement", " CompanyID='" & CompanyId & "' And Convert(varchar, getdate(), 8) Between  Convert(varchar, StartTime , 8) And Convert(varchar, EndTime, 8)")
        If Shift = "" Then Shift = 1
        Dim TransID = db.GenerateMaxVoucherNo("ProductionUpdateEntry", "TransID", "Where CompanyID='" & CompanyId & "' And ProductionID=" & ProductionID)

        con = db.OpenDataBase()
        If con.State = ConnectionState.Closed Then
            con.Open()
        End If
        objTrans = con.BeginTransaction()

        Try

            TableName = "ProductionEntry"
            AddColName = "ToTime=Getdate(),ModifiedDate=Getdate(),ModifiedBy=" & UserId & ",SequenceNo=(Select Max(SequenceNo)+1 From ProductionEntry Where JobBookingID=" & objPEEntry(0)("JobBookingID") & " And ProcessID=" & objPEEntry(0)("ProcessID") & " And JobBookingJobCardContentsID=" & objPEEntry(0)("JobBookingJobCardContentsID") & ")"
            wherecndtn = "CompanyID=" & CompanyId & " And ProductionID=" & ProductionID
            KeyFieldStatus = db.ProductionUpdateDatatableToDatabase(objPEEntry, TableName, AddColName, 0, con, objTrans, wherecndtn)
            If KeyFieldStatus <> "Success" Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If
            TableName = "ProductionUpdateEntry"
            AddColName = "ModifiedDate,FromTime,UserID,CompanyID,FYear,ProductionID,Shift,TransID"
            AddColValue = "Getdate(),Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "','" & ProductionID & "'," & Shift & "," & TransID
            KeyFieldStatus = db.ProductionInsertDatatableToDatabase(objUpdateEntry, TableName, AddColName, AddColValue, con, objTrans)
            If IsNumeric(KeyFieldStatus) = False Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If
            db.ExecuteNonSQLQuery("Update ProductionUpdateEntry Set ToTime=Getdate() Where " & wherecndtn & " And ProductionUpdateID=" & Val(KeyFieldStatus) - 1)

            TableName = "ProductionEntryFormWise"
            AddColName = "ModifiedDate=Getdate(),ToTime=Getdate(),UserID='" & UserId & "'"
            KeyFieldStatus = db.ProductionUpdateDatatableToDatabase(objFormsEntry, TableName, AddColName, 1, con, objTrans, " ProductionID=" & ProductionID & " And CompanyID=" & CompanyId)
            If KeyFieldStatus <> "Success" Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            Str = "Update JobBookingJobCardProcess Set Status='" & objUpdateEntry(0)("Status") & "' Where CompanyID='" & CompanyId & "' And ProcessID='" & objUpdateEntry(0)("ProcessID") & "' And RateFactor='" & objUpdateEntry(0)("RateFactor") & "' And JobBookingJobCardContentsID=" & objUpdateEntry(0)("JobBookingJobCardContentsID")
            Dim cmd As New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Transaction = objTrans
            }
            KeyFieldStatus = cmd.ExecuteNonQuery()
            If KeyFieldStatus <= 0 Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            ''Schedule release status update
            Str = "Update JobScheduleRelease Set Status='" & objUpdateEntry(0)("Status") & "' Where JobCardFormNo='" & objFormsEntry(0)("JobCardFormNo") & "' And CompanyID='" & CompanyId & "' And RateFactor='" & objUpdateEntry(0)("RateFactor") & "' And ProcessID='" & objUpdateEntry(0)("ProcessID") & "' And JobBookingJobCardContentsID=" & objUpdateEntry(0)("JobBookingJobCardContentsID")
            cmd = New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Transaction = objTrans
            }
            KeyFieldStatus = cmd.ExecuteNonQuery()
            If KeyFieldStatus <= 0 Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If
            KeyFieldStatus = "Success"

            objTrans.Commit()

        Catch ex As Exception
            objTrans.Rollback()
            KeyFieldStatus = ex.Message
        Finally
            con.Close()
            KeyField = KeyFieldStatus
        End Try
        Return KeyField

    End Function
    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class