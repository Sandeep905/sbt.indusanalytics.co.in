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
Public Class WebService_JobStatus
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLUserName As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    '---------------Open Master code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardNo() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "SELECT Distinct JC.JobBookingID,JC.JobBookingNo FROM   JobBookingJobCard As JC /*INNER JOIN JobScheduleRelease As JSR On JSR.JobBookingID = JC.JobBookingID And JSR.CompanyID = JC.CompanyID */" &
              " WHERE (JC.CompanyID = '" & GBLCompanyID & "')  AND (ISNULL(JC.IsDeletedTransaction, 0) = 0) ORDER BY JC.JobBookingNo"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardContentsDetail(ByVal JCID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select Distinct LM.LedgerName,JEJ.JobBookingID, JEJC.JobCardContentNo, JEJ.JobBookingNo, Replace(convert(nvarchar(30),JEJ.JobBookingDate,106),'','-') as BookingDate, Replace(JEJ.JobName,'""','') As JobName, Replace(JEJC.PlanContName,'""','')as ContentName, JEJ.OrderQuantity,  nullif(JEJ.PONO,'') as PONo,  replace(convert(nvarchar(30),JEJ.PODate,106),'','-') as PODate, nullif(JEJ.ProductCode,'') as ProductCode,nullif(JOB.SalesOrderNo,'') As OrderBookingNo,JEJC.JobBookingJobCardContentsID,JEJ.IsClose From LedgerMaster as LM INNER JOIN JobBookingJobCard as JEJ ON JEJ.LedgerID = LM.LedgerID AND  JEJ.CompanyID = LM.CompanyID Inner Join JobOrderBookingDetails As JOB On JOB.BookingID=JEJ.BookingID And JOB.CompanyID=JEJ.CompanyID And JEJ.OrderBookingID=JOB.OrderBookingID INNER JOIN JobBookingJobCardContents as JEJC ON JEJC.JobBookingID =  JEJ.JobBookingID And  JEJ.CompanyID = JEJC.CompanyID And JEJC.IsDeletedTransaction=0 Where ISNULL(JEJ.IsDeletedTransaction,0)=0 And JEJ.JobBookingID ='" & JCID & "'  and JEJC.CompanyId=" & GBLCompanyID & " Order BY JEJ.JobBookingID DESC"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647

            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAfterJobCardData(ByVal JobBookingJobCardContentsID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Exec GetProductionStatus " & JobBookingJobCardContentsID & " ," & GBLCompanyID

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function OperationDetailData(ByVal JobBookingJobCardContentsID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "  Select  JS.SequenceNo as SN, Isnull(JS.ProcessID,0) as ProcessID, nullif(JS.ProcessName ,'') as ProcessName, nullif(JS.RateFactor ,'') as RateFactor, nullif(JS.JobCardFormNo ,'') as JobCardFormNo, Isnull(JS.ScheduleQty,0) as ScheduleQty,JS.ContentName,  " &
                " Isnull((Select Sum(Isnull(ProductionQuantity,0)) As ProductionQuantity From ProductionEntry Where JobCardFormNO = JS.JobCardFormNO And RateFactor = JS.RateFactor And CompanyID = JS.CompanyID),0) As ProductionQuantity,  " &
                " Isnull((Select Sum(Isnull(ReadyQuantity,0)) as READY From ProductionEntry Where JobCardFormNO = JS.JobCardFormNO AND RateFactor = JS.RateFactor ANd CompanyID = JS.CompanyID),0) as ReadyQuantity,  " &
                " Isnull((Select Sum(Isnull(WastageQuantity,0)) as WastageQuantity From ProductionEntry Where JobCardFormNO = JS.JobCardFormNO And RateFactor = JS.RateFactor And CompanyID = JS.CompanyID),0) as WastageQuantity,  " &
                " Isnull((Select Sum(Isnull(SuspenseQuantity,0)) as SuspenseQuantity From ProductionEntry Where JobCardFormNO = JS.JobCardFormNO AND RateFactor = JS.RateFactor ANd CompanyID = JS.CompanyID),0) as SuspenseQuantity ,  " &
                " nullif(JS.MachineName,'') as ScheduledMachine, nullif(JS.MachineSpeed,'') as Speed ,nullif(JS.TotalTimeToBeTaken,'') AS TimeToBeTaken,Isnull(JS.Status ,'In Queue') as Status   " &
                " From JobScheduleRelease as JS  Where JS.JobBookingJobCardContentsID = '" & JobBookingJobCardContentsID & "' AND JS.CompanyID = '" & GBLCompanyID & "' ORDER BY SN "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DrawStatus(ByVal JobBookingJobCardContentsID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select nullif(PM.ProcessName,'') As ProcessName,Isnull(JSP.Status,'In Queue') as Status   " &
              " From JobBookingJobCardProcess as JSP INNER JOIN ProcessMaster as PM ON PM.ProcessID = JSP.ProcessID AND PM.CompanyID = JSP.CompanyID    " &
              " Where JSP.JobBookingJobCardContentsID = '" & JobBookingJobCardContentsID & "' AND JSP.CompanyID = '" & GBLCompanyID & "'  " &
              " Order by JSP.JobBookingJobCardProcessID"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductionDetailPopUp(ByVal JobBookingJobCardContentsID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select  JS.SequenceNo As SN, JS.JobBookingJobCardContentsID, ISNULL(JS.ProcessID,0) as ProcessID, nullif(JS.ProcessName,'') as ProcessName, nullif(JS.RateFactor,'') as RateFactor,  nullif(JS.JobCardFormNo,'') as JobCardFormNo, ISNULL(JS.ScheduleQty,0) as ScheduleQty,    " &
              " nullif(MM.MachineName,'') as MachineName, nullif(EM.LedgerName,'') as LedgerName, replace(convert(nvarchar(30),PE.FromTime,106),'','-')  as FromTime, replace(convert(nvarchar(30),PE.ToTime,106),'','-')  as ToTime,         " &
              " Isnull(PUE.ProductionQuantity,0) as ProductionQuantity ,Isnull(PUE.ReadyQuantity,0) as ReadyQuantity,   Isnull(PUE.WastageQuantity,0) as WastageQuantity,      " &
              " Isnull(PUE.SuspenseQuantity,0) as SuspenseQuantity, nullif(JS.MachineName,'') as ScheduledMachine, nullif(JS.MachineSpeed,'')  as Speed ,nullif(JS.TotalTimeToBeTaken,'')   AS TimeToBeTaken,Isnull(JS.Status ,'In Queue') as Status ,isnull(PE.ProductionID,0) as ProductionID  " &
              " From JobScheduleRelease as JS INNER JOIN ProductionEntry as PE ON PE.JobCardFormNO = JS.JobCardFormNO AND Isnull(PE.RateFactor,'') = Isnull(JS.RateFactor,'') AND PE.CompanyID = JS.CompanyID      " &
              " And PE.ProcessID = JS.ProcessID And JS.IsDeletedTransaction=0  INNER JOIN ProductionUpdateEntry As PUE On PUE.ProductionID=PE.ProductionID And PUE.CompanyID=PE.CompanyID And PUE.ProductionQuantity>0 LEFT JOIN MachineMaster as MM ON MM.MachineID = PE.MachineID And MM.CompanyID = PE.CompanyID     " &
              " LEFT JOIN LedgerMaster as EM ON EM.LedgerID = PE.EmployeeID ANd EM.CompanyID = PE.CompanyID      " &
              " Where JS.JobBookingJobCardContentsID = '" & JobBookingJobCardContentsID & "' AND JS.CompanyID = '" & GBLCompanyID & "' ORDER BY SN Asc"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Close Job Status---------------------------------
    '---------------------- Book Form Updation ---------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardNoFormWise() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "SELECT Distinct JC.JobBookingID,JC.JobBookingNo FROM JobBookingJobCard As JC LEFT JOIN JobScheduleRelease As JSR On JSR.JobBookingID = JC.JobBookingID And JSR.CompanyID = JC.CompanyID  " &
              " INNER JOIN JobBookingJobCardFormWiseDetails AS JEJF ON JC.JobBookingID = JEJF.JobBookingID AND JEJF.CompanyID = JC.CompanyID  AND ISNULL(JSR.Status, N'In Queue')='In Queue'  WHERE (JC.CompanyID = '" & GBLCompanyID & "')  AND (ISNULL(JC.IsDeletedTransaction, 0) = 0) ORDER BY JobBookingNo"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)

    End Function

    '' Only having Forms contents list
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardFormContentsDetail(ByVal JCID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select Distinct LM.LedgerName,JEJ.JobBookingID, JEJC.JobCardContentNo, JEJ.JobBookingNo, Replace(convert(nvarchar(30),JEJ.JobBookingDate,106),'','-') as BookingDate, Replace(JEJ.JobName,'""','') As JobName, Replace(JEJC.PlanContName,'""','')as ContentName, JEJ.OrderQuantity,  nullif(JEJ.PONO,'') as PONo,  replace(convert(nvarchar(30),JEJ.PODate,106),'','-') as PODate, nullif(JEJ.ProductCode,'') as ProductCode,nullif(JOB.SalesOrderNo,'') As OrderBookingNo,JEJC.JobBookingJobCardContentsID From LedgerMaster as LM INNER JOIN JobBookingJobCard as JEJ ON JEJ.LedgerID = LM.LedgerID AND  JEJ.CompanyID = LM.CompanyID Inner Join JobOrderBookingDetails As JOB On JOB.BookingID=JEJ.BookingID And JOB.CompanyID=JEJ.CompanyID And JEJ.OrderBookingID=JOB.OrderBookingID INNER JOIN JobBookingJobCardContents as JEJC ON JEJC.JobBookingID =  JEJ.JobBookingID And  JEJ.CompanyID = JEJC.CompanyID And JEJC.IsDeletedTransaction=0 INNER JOIN JobBookingJobCardFormWiseDetails AS JEJF ON JEJC.JobBookingID = JEJF.JobBookingID AND JEJF.CompanyID = JEJC.CompanyID And JEJF.JobBookingJobCardContentsID=JEJC.JobBookingJobCardContentsID Where ISNULL(JEJ.IsDeletedTransaction,0)=0 And JEJ.JobBookingID ='" & JCID & "'  and JEJC.CompanyId=" & GBLCompanyID & " Order BY JEJ.JobBookingID DESC"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentWiseFormsDetails(ByVal ContentsID As Integer, ByVal BKID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "SELECT JCFW.JobCardFormDetailID,JCFW.JobBookingJobCardContentsID,JCFW.PlanContName, JCFW.PlanContQty, JCFW.PlanContentType, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo,JCFW.RefNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID,JCFW.TransID,JCFW.ActualSheets,JCFW.WasteSheets FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID And MM.CompanyID=JCFW.CompanyID WHERE (JCFW.JobBookingID = '" & BKID & "')  And (JCFW.JobBookingJobCardContentsID = '" & ContentsID & "')  And JCFW.CompanyID = " & GBLCompanyID & " And Isnull(JCFW.IsDeletedTransaction,0)=0 Order By TransID"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
        Return ""
    End Function

    ''----------------------------Open PickList  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateFormsDetails(ByVal jsonObjFormsMain As Object) As String
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("ContentsBookFormSequence.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save"

        Try

            TableName = "JobBookingJobCardFormWiseDetails"
            AddColName = "ModifiedDate=Getdate(),ModifiedBy='" & GBLUserID & "'"
            wherecndtn = " CompanyID=" & GBLCompanyID
            KeyField = db.UpdateDatatableToDatabase(jsonObjFormsMain, TableName, AddColName, 2, wherecndtn)

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField
    End Function

    ''------------------------Job Close List
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridJobCardData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "SELECT Distinct JEJ.JobBookingDate ,JEJ.CoordinatorLedgerID,JEJ.JobPriority,JEJ.CategoryID,Replace(Nullif(JEJ.Remark,''),'""','') As Remark,JOB.JobReference, JOB.JobType, Replace(Nullif(LM.LedgerName,''),'"" ','') as LedgerName ,Nullif(JEJ.PONo,'') as PONo,Replace(Convert(Nvarchar(13),JEJ.PODate,106),' ','-') As PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,JOB.SalesOrderNo,Replace(Nullif(JEJ.JobName,''),'""','') as JobName,JEJ.OrderQuantity As OrderQty,Replace(Nullif(JEJ.ProductCode,''),'""','') as ProductCode,JEJ.JobBookingNo,  JE.BookingNo,Replace(Convert(Nvarchar(13),JEJ.JobBookingDate,106),' ','-') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(PM.ProductMasterCode,''),'""','') as ProductMasterCode,JEJ.FYear,JEJ.LedgerID,JEJ.ProductHSNID,Nullif(LM.Email,'') As Email,JEJ.OrderQuantity as Quantity,JEJ.BookingID,Replace(Convert(Nvarchar(13),JEJ.DeliveryDate,106),' ','-') as DeliveryDate,JE.ExpectedCompletionDays,JOB.OrderBookingID,JOB.OrderBookingDetailsID,JEJ.ProductMasterID,JEJ.JobBookingID,JEJ.ConsigneeID,JEJ.CriticalInstructions ,JEJ.IsClose,ISNULL(SPM.TotalPackedQuantity,0) As TotalPackedQuantity " &
                  " FROM LedgerMaster As LM INNER JOIN JobBookingJobCard  As JEJ ON JEJ.LedgerId =LM.LedgerId And JEJ.CompanyID = " & GBLCompanyID & " And JEJ.IsDeletedTransaction=0  INNER JOIN JobOrderBookingDetails As JOB ON JEJ.LedgerId =JOB.LedgerId And JEJ.OrderBookingID=JOB.OrderBookingID And JEJ.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster as CM ON  CM.CategoryId = JEJ.CategoryID  AND CM.CompanyID = JEJ.CompanyID INNER JOIN UserMaster AS UM ON UM.UserId = JEJ.CreatedBy LEFT JOIN JobBooking As JE  ON JE.BookingID = JEJ.BookingID LEFT JOIN ProductMaster AS PM On PM.ProductMasterID =JEJ.ProductMasterID Left JOIN JobSemiPackingMain As SPM On SPM.JobBookingID=JEJ.JobBookingID And SPM.CompanyID=JEJ.CompanyID And  SPM.IsDeletedTransaction=0 Order by JobBookingDate DESC "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobCardEntryClose(ByVal BKID As Integer, ByVal IsClose As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            db.ExecuteNonSQLQuery("Update JobBookingJobCard Set IsClose='" & IsClose & "' Where JobBookingID=" & BKID & " And CompanyID=" & GBLCompanyID)
            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class