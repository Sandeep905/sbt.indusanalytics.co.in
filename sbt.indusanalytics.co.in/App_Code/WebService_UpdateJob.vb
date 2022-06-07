Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports System.IO
Imports System.Net.Mail
Imports System.Net
Imports MailMessage = System.Net.Mail.MailMessage
Imports Connection


' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_UpdateJob
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim GBLUserName As String
    Dim Str As String
    Dim Version As String = "Estimo" ' Convert.ToString(ConfigurationManager.AppSettings.Item("Version"))
    Dim UserId As String = Convert.ToString(HttpContext.Current.Session("UserID")) ' Convert.ToString(HttpContext.Current.Request.QueryString("UId"))
    Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyID")) ' Convert.ToString(HttpContext.Current.Request.QueryString("CId"))
    Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear")) ' Convert.ToString(HttpContext.Current.Request.QueryString("FYear"))

    <System.Web.Services.WebMethod(EnableSession:=True)>
    <ScriptMethod(UseHttpGet:=True, ResponseFormat:=ResponseFormat.Json)>
    Private Sub HelloWorld()

        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Version = Convert.ToString(HttpContext.Current.Session("Version"))

        'Context.Response.Clear()
        'Context.Response.ContentType = "application/json"
        'data.Message = db.ConvertDataTableTojSonString(GetDataTable)
        'Context.Response.Write(js.Serialize(data.Message))
    End Sub

    Public Function DataSetToJSONWithJavaScriptSerializer(ByVal dataset As DataSet) As String
        Dim jsSerializer As JavaScriptSerializer = New JavaScriptSerializer()
        Dim ssvalue As Dictionary(Of String, Object) = New Dictionary(Of String, Object)()

        For Each table As DataTable In dataset.Tables
            Dim parentRow As List(Of Dictionary(Of String, Object)) = New List(Of Dictionary(Of String, Object))()
            Dim childRow As Dictionary(Of String, Object)
            Dim tablename As String = table.TableName

            For Each row As DataRow In table.Rows
                childRow = New Dictionary(Of String, Object)()

                For Each col As DataColumn In table.Columns
                    childRow.Add(col.ColumnName, row(col))
                Next
                parentRow.Add(childRow)
            Next
            ssvalue.Add(tablename, parentRow)
        Next
        Return jsSerializer.Serialize(ssvalue)
    End Function

    ''---------------------------- Start  Code  ------------------------------------------  Pradeep Yadav 09 Dec 2019
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetRunningMachine() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'Version = Convert.ToString(HttpContext.Current.Session("Version"))
        If Version = "Estimo" Then
            Str = "Select distinct isnull(PE.MachineID,0) as MachineID,nullif(MM.MachineName,'') as MachineName From MachineMaster As MM INNER JOIN ProductionEntry As PE On PE.MachineID = MM.MachineID And MM.CompanyID = PE.CompanyID  Where PE.Status = 'Running' and PE.CompanyID=" & CompanyId
        Else
            Str = "Select distinct isnull(ME.Machine_ID,0) as Machine_ID,nullif(MM.Machine_Name,'') as Machine_Name From Machine_Master As MM INNER JOIN Machine_Entry As Me On Me.Machine_ID = MM.Machine_ID And MM.Company_ID = Me.Company_ID  Where ME.Status = 'Running' and ME.Company_ID='" & CompanyId & "'"
        End If

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineStatusList(ByVal MId As Integer) As String
        Try

            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            ''Version = Convert.ToString(HttpContext.Current.Session("Version"))
            If Version = "Estimo" Then
                Str = "Select Distinct MachineStatusID,nullif(MachineStatus,'') As MachineStatus,nullif(IconSrc,'') As IconSrc,nullif(StatusActionType ,'') As StatusActionType,StatusCssClass From MachineStatusMaster Where MachineStatus Not In(Select Distinct CurrentStatus From MachineMaster Where MachineID=" & MId & " And CompanyID=" & CompanyId & ") And CompanyID=" & CompanyId
            Else
                Str = ""
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectedData(ByVal MachineID As String) As String

        Str = "Exec GetProductionUpdateData " & CompanyId & "," & MachineID

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''' <summary>
    ''' Save Production Update for Lovely Estimo Product
    ''' </summary>
    ''' <param name="objPEEntry"></param>
    ''' <param name="objUpdateEntry"></param>
    ''' <param name="objPaper_Consumption"></param>
    ''' <param name="objPaper_ConsumptionDetails"></param>
    ''' <param name="ProcessID"></param>
    ''' <param name="JobBookingContID"></param>
    ''' <param name="ProductionID"></param>
    ''' <param name="VarCheckConsumption"></param>
    ''' <param name="objFormsEntry"></param>
    ''' <returns></returns>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function EstimoSaveProductionData(ByVal objPEEntry As Object, ByVal objUpdateEntry As Object, ByVal objPaper_Consumption As Object, ByVal objPaper_ConsumptionDetails As Object, ByVal ProcessID As String, ByVal JobBookingContID As Integer, ByVal ProductionID As Integer, ByVal VarCheckConsumption As String, ByVal objFormsEntry As Object, ByVal OptSemiPack As Object, ByVal OptSemiPackDetails As Object, ByVal objMachineData As Object) As String

        Dim dt As New DataTable
        Dim KeyFieldStatus As String
        Dim Max_TransactionID As String
        Dim PONo, prefix As String
        Dim MaxPONo As Long

        Dim AddColName, AddColValue, wherecndtn, TableName As String
        prefix = "ICP"

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'FYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Dim objTrans As SqlTransaction
        Dim Shift As String = db.GetColumnValue("ShiftNo", "ShiftManagement", " CompanyID='" & CompanyId & "' And Convert(varchar, getdate(), 8) Between  Convert(varchar, StartTime , 8) And Convert(varchar, EndTime, 8)")
        If Shift = "" Then Shift = 1
        Dim TransID = db.GenerateMaxVoucherNo("ProductionUpdateEntry", "TransID", "Where CompanyID='" & CompanyId & "' And ProductionID='" & ProductionID & "'")

        Dim con As SqlConnection = db.OpenDataBase()
        If con.State = ConnectionState.Closed Then
            con.Open()
        End If
        objTrans = con.BeginTransaction()

        Try

            TableName = "ProductionEntry"
            AddColName = "ToTime=Getdate(),ModifiedDate=Getdate(),ModifiedBy=" & UserId & ",SequenceNo=(Select Max(SequenceNo)+1 From ProductionEntry Where JobBookingID=" & objPEEntry(0)("JobBookingID") & " And ProcessID=" & objPEEntry(0)("ProcessID") & " And JobBookingJobCardContentsID=" & objPEEntry(0)("JobBookingJobCardContentsID") & ")"
            wherecndtn = "CompanyID=" & CompanyId & " And ProductionID='" & ProductionID & "'"
            KeyFieldStatus = db.ProductionUpdateDatatableToDatabase(objPEEntry, TableName, AddColName, 0, con, objTrans, wherecndtn)
            If KeyFieldStatus <> "Success" Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            TableName = "ProductionUpdateEntry"
            AddColName = "ModifiedDate,ToTime,UserID,CompanyID,FYear,ProductionID,Shift,TransID"
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

            Str = "Update JobBookingJobCardProcess Set Status='" & objUpdateEntry(0)("Status") & "' Where CompanyID='" & CompanyId & "' And ProcessID='" & ProcessID & "' And RateFactor='" & objUpdateEntry(0)("RateFactor") & "' And JobBookingJobCardContentsID='" & JobBookingContID & "'"
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
            Str = "Update JobScheduleRelease Set Status='" & objUpdateEntry(0)("Status") & "' Where JobCardFormNo='" & objFormsEntry(0)("JobCardFormNo") & "' And CompanyID='" & CompanyId & "' And RateFactor='" & objUpdateEntry(0)("RateFactor") & "' And ProcessID='" & ProcessID & "' And JobBookingJobCardContentsID='" & JobBookingContID & "'"
            cmd = New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Transaction = objTrans
            }
            KeyFieldStatus = cmd.ExecuteNonQuery()
            If KeyFieldStatus <= 0 Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If

            ''Machine status update entry
            KeyFieldStatus = SaveMachineStatusEntry(objMachineData, objPEEntry(0)("EmployeeID"), con, objTrans)
            If IsNumeric(KeyFieldStatus) = False Then
                objTrans.Rollback()
                Return KeyFieldStatus
            End If
            '''''' 
            '' Item Consumption Entry
            If VarCheckConsumption = True Or VarCheckConsumption = "True" Then
                PONo = db.GeneratePrefixedNo("ItemConsumptionMain", prefix, "MaxVoucherNo", MaxPONo, FYear, " Where VoucherID=-54 And VoucherPrefix='" & prefix & "' And  CompanyID=" & CompanyId & " And FYear='" & FYear & "' ")

                TableName = "ItemConsumptionMain"
                AddColName = "ProductionID,CreatedDate,CreatedBy,UserID,CompanyID,FYear,VoucherPrefix,VoucherID,MaxVoucherNo,VoucherNo"
                AddColValue = "'" & ProductionID & "',Getdate(),'" & UserId & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & prefix & "',-54,'" & MaxPONo & "','" & PONo & "'"
                Max_TransactionID = db.ProductionInsertDatatableToDatabase(objPaper_Consumption, TableName, AddColName, AddColValue, con, objTrans)
                If IsNumeric(Max_TransactionID) = False Then
                    objTrans.Rollback()
                    KeyFieldStatus = Max_TransactionID
                    Return KeyFieldStatus
                End If

                TableName = "ItemConsumptionDetail"
                AddColName = "CreatedDate,CreatedBy,UserID,CompanyID,FYear,ConsumptionTransactionID"
                AddColValue = "Getdate(),'" & UserId & "','" & UserId & "','" & CompanyId & "','" & FYear & "'," & Max_TransactionID
                Max_TransactionID = db.ProductionInsertDatatableToDatabase(objPaper_ConsumptionDetails, TableName, AddColName, AddColValue, con, objTrans)
                If IsNumeric(Max_TransactionID) = False Then
                    objTrans.Rollback()
                    KeyFieldStatus = Max_TransactionID
                    Return KeyFieldStatus
                End If
            End If

            '' Save Semi packing details
            If OptSemiPackDetails.length > 0 Then
                prefix = "P"
                TableName = "JobSemiPackingMain"
                PONo = db.GeneratePrefixedNo(TableName, prefix, "MaxSemiPackingNo", MaxPONo, FYear, " Where SemiPackingPrefix='" & prefix & "' And  CompanyID=" & CompanyId & " And FYear='" & FYear & "' ")

                AddColName = "SemiPackingDate,CreatedDate,CreatedBy,UserID,CompanyID,FYear,SemiPackingPrefix,MaxSemiPackingNo,SemiPackingNo"
                AddColValue = "Getdate(),Getdate(),'" & UserId & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & prefix & "','" & MaxPONo & "','" & PONo & "'"
                Max_TransactionID = db.ProductionInsertDatatableToDatabase(OptSemiPack, TableName, AddColName, AddColValue, con, objTrans)
                If IsNumeric(Max_TransactionID) = False Then
                    objTrans.Rollback()
                    KeyFieldStatus = Max_TransactionID
                    Return KeyFieldStatus
                End If

                TableName = "JobSemiPackingDetail"
                AddColName = "CreatedDate,CreatedBy,UserID,CompanyID,FYear,SemiPackingMainID"
                AddColValue = "Getdate(),'" & UserId & "','" & UserId & "','" & CompanyId & "','" & FYear & "'," & Max_TransactionID
                Max_TransactionID = db.ProductionInsertDatatableToDatabase(OptSemiPackDetails, TableName, AddColName, AddColValue, con, objTrans)
                If IsNumeric(Max_TransactionID) = False Then
                    objTrans.Rollback()
                    KeyFieldStatus = Max_TransactionID
                    Return KeyFieldStatus
                End If
            End If
            KeyFieldStatus = "Update"

            objTrans.Commit()
        Catch ex As Exception
            objTrans.Rollback()
            KeyFieldStatus = ex.Message
        Finally
            con.Close()
        End Try
        Return KeyFieldStatus
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveMachineCurrentStatusEntry(ByVal objData As Object, ByVal LId As Integer) As String
        Dim con As New SqlConnection
        Dim objTrans As SqlTransaction
        Try
            con = db.OpenDataBase()
            If con.State = ConnectionState.Closed Then
                con.Open()
            End If
            objTrans = con.BeginTransaction()
            Str = SaveMachineStatusEntry(objData, LId, con, objTrans, "MachineStatus=Status ,")
            If IsNumeric(Str) = False Then
                objTrans.Rollback()
                Return Str
            End If
            objTrans.Commit()
            Return "Success"
        Catch ex As Exception
            objTrans.Rollback()
            Return ex.Message
        Finally
            con.Close()
        End Try
    End Function

    ''' <summary>
    ''' Save machine current status entry
    ''' </summary>
    ''' <param name="objData">contains details of machine and status</param>
    ''' <param name="LId">LedgerID</param>
    ''' <param name="con">sql con</param>
    ''' <param name="objTrans">sql transaction</param>
    ''' <returns></returns>
    Public Function SaveMachineStatusEntry(ByVal objData As Object, ByVal LId As Integer, ByRef con As SqlConnection, ByRef objTrans As SqlTransaction, Optional ByVal AddColName As String = "") As String

        Dim AddColValue, wherecndtn, TableName As String
        'Dim LedgerID As String = Convert.ToString(HttpContext.Current.Session("LedgerID"))
        Try

            TableName = "MachineCurrentStatusEntry"
            Str = "Select TransactionID,Status From " & TableName & " Where TransactionID IN(Select Max(TransactionID) From " & TableName & " Where MachineID = " & objData(0)("MachineID") & " AND Status Not IN ('Active'))"
            db.FillDataTable(dataTable, Str)
            If dataTable.Rows.Count > 0 Then
                AddColName = AddColName & " EndTime=Getdate(),ModifiedDate=Getdate(),ModifiedBy=" & UserId & ",LedgerID=" & LId
                wherecndtn = "TransactionID=" & dataTable.Rows(0)("TransactionID") & " And CompanyID=" & CompanyId
                Str = db.ProductionUpdateDatatableToDatabase(objData, TableName, AddColName, 1, con, objTrans, wherecndtn)
                If Str <> "Success" Then
                    Return Str
                End If
                If objData(0)("Status") <> "Active" Then
                    AddColName = "CreatedDate,CreatedBy,CompanyID,FYear,LedgerID"
                    AddColValue = "Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "'," & LId & ""
                    Str = db.ProductionInsertDatatableToDatabase(objData, TableName, AddColName, AddColValue, con, objTrans)
                    If IsNumeric(Str) = False Then
                        Return Str
                    End If
                End If
            Else
                AddColName = "CreatedDate,CreatedBy,CompanyID,FYear,LedgerID"
                AddColValue = "Getdate(),'" & UserId & "','" & CompanyId & "','" & FYear & "'," & LId & ""
                Str = db.ProductionInsertDatatableToDatabase(objData, TableName, AddColName, AddColValue, con, objTrans)
                If IsNumeric(Str) = False Then
                    Return Str
                End If
            End If
            ''Machine status update
            Str = "Update MachineMaster Set CurrentStatus='" & objData(0)("Status") & "' Where MachineID='" & objData(0)("MachineID") & "' And CompanyID=" & CompanyId
            Dim cmd As New SqlCommand(Str, con) With {
                .CommandType = CommandType.Text,
                .Transaction = objTrans
            }
            Str = cmd.ExecuteNonQuery()
            If Str <= 0 Then
                Return "Invalid machine data"
            End If
        Catch ex As Exception
            Str = ex.Message
        End Try
        Return Str
    End Function

    '*******************************************************Start Job Status Data**************************************************

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardDetail(ByVal ddlJobCard As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'FYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If Version = "Estimo" Then
            Str = "Select Distinct LM.LedgerName,JEJ.JobBookingID, JEJC.JobCardContentNo, JEJ.JobBookingNo, replace(convert(nvarchar(30),JEJ.JobBookingDate,106),'','-') as BookingDate, JEJ.JobName, nullif(JEJC.PlanContName,'') as ContentName, JEJ.OrderQuantity as OrderQty,  nullif(JEJ.PONO,'') as PONo,  replace(convert(nvarchar(30),JEJ.PODate,106),'','-') as PODate, nullif(JEJ.ProductCode,'') as ProductCode,nullif(JOB.SalesOrderNo,'') As OrderBookingNo,JEJC.JobBookingJobCardContentsID  From LedgerMaster as LM INNER JOIN JobBookingJobCard as JEJ ON JEJ.LedgerID = LM.LedgerID AND  JEJ.CompanyID = LM.CompanyID Inner Join JobOrderBookingDetails As JOB On JOB.BookingID=JEJ.BookingID And JOB.CompanyID=JEJ.CompanyID And JEJ.OrderBookingID=JOB.OrderBookingID INNER JOIN JobBookingJobCardContents as JEJC ON JEJC.JobBookingID =  JEJ.JobBookingID And  JEJ.CompanyID = JEJC.CompanyID And JEJC.IsDeletedTransaction=0 Where ISNULL(JEJ.IsDeletedTransaction,0)=0 And JEJ.JobBookingID ='" & ddlJobCard & "'  and JEJC.CompanyId=" & CompanyId & " Order BY JEJ.JobBookingID DESC"
        Else
            Str = "Select nullif(LM.Ledger_Name,'') as Ledger_Name, nullif(JEJC.Job_Card_NO,'') as Job_Card_NO, replace(convert(nvarchar(30),JEJ.Booking_Date,106),'','-') as Booking_Date, nullif(JEJC.Job_Name,'') as Job_Name, nullif(JEJC.Content_Name,'') as Content_Name,  " &
               "  Isnull(Order_Qty,'') as Order_Qty,  nullif(JEJ.PO_NO,'') as PO_NO,  replace(convert(nvarchar(30),JEJ.PO_Date,106),'','-') as PO_Date, nullif(JEJ.Product_Code,'') as Product_Code, nullif(JEJ.Order_Booking_NO,'') as  Order_Booking_NO,   " &
               "  Isnull(JEJC.Booking_Transaction_ID,0) as Booking_Transaction_ID  From Ledger_Master as LM INNER JOIN Job_Estimation_JobCard as JEJ ON JEJ.Ledger_ID = LM.Ledger_ID AND  JEJ.Company_ID = LM.Company_ID   " &
               "  INNER JOIN Job_Estimation_JobCard_Contents as JEJC ON JEJC.Booking_NO =  JEJ.Booking_NO And  JEJ.Company_ID = JEJC.Company_ID Where JEJC.Job_Card_NO Like '%" & ddlJobCard & "%'  and JEJC.Company_Id='" & CompanyId & "'  " &
               "  Order BY JEJC.Job_Card_NO  DESC"
        End If

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOperationDetail(ByVal BookingTrID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'Version = Convert.ToString(HttpContext.Current.Session("Version"))

        If Version = "Estimo" Then
            Str = "Exec GetProductionStatus " & BookingTrID & " ," & CompanyId
        Else
            Str = "SELECT  Isnull(JOS.Operation_ID,0) as Operation_ID, Isnull(JOS.Booking_Transaction_ID,0) as Booking_Transaction_ID, Isnull(JOS.Trans_ID,0) as Trans_ID,  " &
                    " nullif(OM.Operation_Name,'') as Operation_Name, nullif(JOS.Status,'') as Status, nullif(MM.Machine_Name,'') as Machine_Name,  nullif(EM.Employee_Name,'') as Employee_Name,   " &
                    "replace(convert(nvarchar(30),ME.From_Time,120),'','-') as From_Time,replace(convert(nvarchar(30),ME.To_Time,120),'','-') as To_Time,  Isnull(ME.Production_Quantity,0) as Production_Quantity,  Isnull(ME.Ready_Quantity,0) as Ready_Quantity,  Isnull(ME.Wastage_Quantity,0) as Wastage_Quantity,  " &
                    "  nullif(ME.Conversion_value,'') as Conversion_value, nullif(UM.User_Name,'') as User_Name,Isnull(ME.Production_ID,0) as Production_ID,Isnull(OM.Department_ID,0) as Department_ID, isnull(MM.Machine_ID,0) as Machine_ID FROM  " &
                    " Job_Operation_Schedule AS JOS INNER JOIN Operation_Master AS OM ON JOS.Operation_ID = OM.Operation_ID And JOS.Company_ID = OM.Company_ID       " &
                    " LEFT JOIN Machine_Entry AS ME ON JOS.Booking_Transaction_ID = ME.Booking_Transaction_ID AND JOS.Operation_ID = ME.Operation_ID  AND JOS.Company_ID = ME.Company_ID   " &
                    " INNER JOIN Machine_Master AS MM ON MM.Machine_ID = ME.Machine_ID And MM.Company_ID = ME.Company_ID INNER JOIN Employee_Master as EM ON EM.Employee_ID = ME.Employee_ID And EM.Company_ID = ME.Company_ID  " &
                    " INNER JOIN User_Master AS UM ON UM.User_ID = ME.User_ID AND UM.User_ID = ME.User_ID  AND UM.Company_ID = ME.Company_ID    " &
                    " Where JOS.Booking_Transaction_ID='" & BookingTrID & "' and JOS.Company_ID = '" & CompanyId & "'  " &
                    " Order by JOS.Trans_ID, ME.From_Time "
        End If

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DrawStatus(ByVal BookingTrID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        'Version = Convert.ToString(HttpContext.Current.Session("Version"))

        If Version = "Estimo" Then
            Str = "SELECT Isnull(JOS.ProcessID,0) as ProcessID, Isnull(JOS.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID, Isnull(JOS.SequenceNo,0) as TransID, nullif(OM.ProcessName,'') as ProcessName,  Isnull(JOS.PaperConsumptionRequired,0) As PaperConsumptionRequired, Isnull((SELECT Sum(Isnull(PE.ReadyQuantity,0)) AS ReadyQuantity  FROM ProductionEntry As PE  Where PE.JobBookingJobCardContentsID=JOS.JobBookingJobCardContentsID And JOS.CompanyID = PE.CompanyID And JOS.ProcessID=PE.ProcessID),0) AS ReadyQuantity , ISNULL((SELECT SUM(ISNULL(QCApprovedQty, 0)) AS QCApprovedQty FROM ProductionEntry AS PE WHERE (JobBookingJobCardContentsID = JOS.JobBookingJobCardContentsID) And (JOS.CompanyID = CompanyID) And (JOS.ProcessID = ProcessID)), 0) AS QCApprovedQty ,  nullif(OM.StartUnit,'') as StartUnit,nullif(OM.EndUnit,'') as EndUnit,nullif(OM.UnitConversion,'') as UnitConversion, Isnull(nullif(JOS.Status,''),'In Queue') as Status , Isnull((Select Max(ProductionID) as ProductionID From ProductionEntry  WHERE  JobBookingJobCardContentsID = JOS.JobBookingJobCardContentsID AND JOS.CompanyID = CompanyID  And  JOS.ProcessID = ProcessID GROUP BY JobBookingJobCardContentsID,ProcessID ) , 0) as ProductionID,Isnull((Select nullif(Shift,'') as Shift From ProductionEntry  WHERE  JobBookingJobCardContentsID = JOS.JobBookingJobCardContentsID AND JOS.CompanyID = CompanyID  And  JOS.ProcessID = ProcessID GROUP BY JobBookingJobCardContentsID,nullif(Shift,'') ) , 0) as Shift FROM JobBookingJobCardProcess AS JOS INNER JOIN    ProcessMaster AS OM ON JOS.ProcessID = OM.ProcessID And JOS.CompanyID = OM.CompanyID And JOS.JobBookingJobCardContentsID='" & BookingTrID & "' and JOS.CompanyID = '" & CompanyId & "' Order by JOS.SequenceNo"
        Else
            Str = "SELECT Isnull(JOS.Operation_ID,0) as Operation_ID, Isnull(JOS.Booking_Transaction_ID,0) as Booking_Transaction_ID, Isnull(JOS.Trans_ID,0) as Trans_ID, nullif(OM.Operation_Name,'') as Operation_Name,  " &
               " isnull(JOS.Paper_Consumption_Required,0) As Paper_Consumption_Required,   " &
               " Isnull((SELECT Sum(Isnull(PE.Ready_Quantity,0)) AS Ready_Quantity  FROM Machine_Entry As PE  Where PE.Booking_Transaction_ID=JOS.Booking_Transaction_ID     " &
               " And JOS.Company_ID = PE.Company_ID And JOS.Operation_ID=PE.Operation_ID),0) AS Ready_Qty ,        " &
               " ISNULL ((SELECT        SUM(ISNULL(QC_Approved_Qty, 0)) AS QC_Approved_Qty FROM Machine_Entry AS PE WHERE (Booking_Transaction_ID = JOS.Booking_Transaction_ID)  " &
               " And (JOS.Company_ID = Company_ID) And (JOS.Operation_ID = Operation_ID)), 0) AS QC_Approved_Qty ,  " &
               " nullif(OM.Start_Unit,'') as Start_Unit,nullif(OM.End_Unit,'') as End_Unit,nullif(OM.Unit_Conversion,'') as Unit_Conversion,  " &
               " nullif(JOS.Status,'') as Status ,   " &
               " Isnull((Select Max(Production_ID) as Production_ID From Machine_Entry  WHERE  Booking_Transaction_ID = JOS.Booking_Transaction_ID  AND   " &
               " JOS.Company_ID = Company_ID  And  JOS.Operation_ID = Operation_ID GROUP BY Booking_Transaction_ID,Operation_ID ) , 0) as Production_ID,Isnull((Select nullif(Shift,'') as Shift From Machine_Entry  WHERE  Booking_Transaction_ID = JOS.Booking_Transaction_ID AND JOS.Company_ID = Company_ID  And  JOS.Operation_ID = Operation_ID GROUP BY Booking_Transaction_ID,nullif(Shift,'') ) , 0) as Shift    " &
               " FROM Job_Operation_Schedule AS JOS INNER JOIN    Operation_Master AS OM ON JOS.Operation_ID = OM.Operation_ID And JOS.Company_ID = OM.Company_ID    " &
               " And JOS.Booking_Transaction_ID='" & BookingTrID & "' and JOS.Company_ID = '" & CompanyId & "'   Order by JOS.Trans_ID"
        End If

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardList() As String
        Try
            'CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            'Version = Convert.ToString(HttpContext.Current.Session("Version"))

            If Version = "Estimo" Then
                Str = "SELECT Distinct JEJ.JobBookingNo, JEJ.JobBookingID FROM JobBookingJobCard AS JEJ Inner Join JobScheduleRelease As JSR On JEJ.JobBookingID=JSR.JobBookingID And JSR.CompanyID=JEJ.CompanyID WHERE (Isnull(JSR.Status,'In Queue') Not In ('Complete','Running')) And JEJ.IsClose=0 AND (JEJ.CompanyID =" & CompanyId & ") Order By JobBookingID"
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
    Public Function JobCardProcessList(ByVal BKID As Integer) As String
        Str = "SELECT DISTINCT  JOS.JobBookingJobCardProcessID As JobProcessID,JOS.SequenceNo, OM.ProcessName,OM.IsEditToBeProduceQty,JOS.Remarks, NULLIF (JOS.RateFactor, '') AS RateFactor,JOS.ProductionTolerance " &
             " FROM JobBookingJobCardProcess AS JOS INNER JOIN " &
             " ProcessMaster AS OM ON JOS.ProcessID = OM.ProcessID AND JOS.CompanyID = OM.CompanyID And JOS.IsDeletedTransaction=0  " &
             " INNER JOIN JobBookingJobCard AS JC ON JC.JobBookingID = JOS.JobBookingID AND JC.CompanyID = JOS.CompanyID AND JC.IsDeletedTransaction=0 And JC.IsClose=0  " &
             " INNER JOIN JobScheduleRelease AS JS ON JS.JobBookingJobCardContentsID = JOS.JobBookingJobCardContentsID AND JS.CompanyID = JOS.CompanyID AND JS.ProcessID = JOS.ProcessID AND JS.RateFactor = JOS.RateFactor And JS.IsDeletedTransaction=0  " &
             " WHERE (JOS.JobBookingJobCardContentsID = " & BKID & " ) AND (JOS.CompanyID = " & CompanyId & ") Order By JOS.SequenceNo"
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateProductionTolerance(ByVal PKID As Integer, ByVal Tolerance As Double) As String
        Dim TableName As String
        Try
            If db.CheckAuthories("ProductionToll.aspx", UserId, CompanyId, "CanSave", PKID & ",Tolerance-" & Tolerance) = False Then Return "You are not authorized to save..!"

            TableName = "JobBookingJobCardProcess"
            Str = db.ExecuteNonSQLQuery("Update " & TableName & " Set ToleranceCreatedBy=" & UserId & ",ProductionTolerance=" & Tolerance & " Where JobBookingJobCardProcessID=" & PKID & " And CompanyID=" & CompanyId)
            Return Str
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    '***************************************** Production Comments

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductionComments(ByVal ObjCommentDetail As Object, ByVal LId As Integer) As String
        Dim con As New SqlConnection
        Dim objTrans As SqlTransaction
        Dim AddColName, AddColValue, TableName As String
        Try
            con = db.OpenDataBase()
            If con.State = ConnectionState.Closed Then
                con.Open()
            End If
            objTrans = con.BeginTransaction()

            TableName = "ProductionCommentsEntry"
            AddColName = "CreatedDate,CreatedBy,UserID,CompanyID,FYear"
            AddColValue = "Getdate(),'" & LId & "','" & UserId & "','" & CompanyId & "','" & FYear & "'"
            Str = db.ProductionInsertDatatableToDatabase(ObjCommentDetail, TableName, AddColName, AddColValue, con, objTrans)
            If IsNumeric(Str) = False Then
                objTrans.Rollback()
                Return Str
            End If
            objTrans.Commit()

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        Finally
            con.Close()
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductionComments(ByVal ContentID As Integer, ByVal PID As Integer) As String
        Try

            Str = "SELECT PCE.CommentTitle, PCE.CommentType, PCE.CommentDescription, PM.ProcessName, PCE.CreatedDate, PCE.CreatedBy, LM.LedgerName FROM ProductionCommentsEntry AS PCE INNER JOIN ProcessMaster AS PM ON PCE.ProcessID = PM.ProcessID AND PCE.CompanyID = PM.CompanyID AND PCE.IsDeletedTransaction = PM.IsDeletedTransaction INNER JOIN LedgerMaster AS LM ON PCE.CreatedBy = LM.LedgerID AND PCE.CompanyID = LM.CompanyID Where PCE.IsDeletedTransaction=0 And PCE.JobCardContentID=" & ContentID & " And PCE.ProcessID=" & PID & " And PCE.CompanyID=" & CompanyId
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod>
    Public Function UploadFileProductionUpdate() As String
        Dim httpPostedFile = HttpContext.Current.Request.Files("UserAttchedFiles")
        Try

            If httpPostedFile IsNot Nothing Then
                ' Get the complete file path
                Dim fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("/Files/Production/UpdateFiles/"), httpPostedFile.FileName)

                Dim fi As New FileInfo(fileSavePath)
                If (fi.Exists) Then    'if file exists, delete it
                    fi.Delete()
                End If
                ' Save the uploaded file to "UserAttachedFiles" folder
                httpPostedFile.SaveAs(fileSavePath)
            End If
            Return "Success"

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    '*******************************************************Close Job Status Data**************************************************

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SendMail(ByVal EmailId As String, ByVal Subject As String, ByVal Body As String) As String
        Try
            Dim Emails As String() = EmailId.Split(New Char() {","c})

            ' Use For Each loop over email and send them.
            For Each EmailTo As String In Emails
                'Console.WriteLine("Email: {0}", EmailTo)
                Dim sb As New StringBuilder()
                Dim imagepath As String = Server.MapPath(".") & "/image/Pamex1.jpg"

                sb.Append("<table width='100%' cellspacing='0' cellpadding='2'>")
                sb.Append("<tr><td style='width:100%;height:auto'>" & Body & "</td></tr>")
                sb.Append("<tr><td><img style='width:100%;height:30em;' src='http://production.indusanalytics.co.in/image/Pamex1.jpg' alt='Invitation' /></td></tr>")
                sb.Append("</table>")
                'sb.Append(Body)

                Dim msg As New MailMessage
                Dim smtp As New SmtpClient()
                msg.From = New Net.Mail.MailAddress("info@indusanalytics.in")
                msg.[To].Add(EmailTo)
                msg.Priority = MailPriority.High
                msg.Attachments.Add(New Attachment(imagepath))

                msg.Subject = Subject

                msg.Body = sb.ToString()
                msg.IsBodyHtml = True

                smtp.UseDefaultCredentials = False
                smtp.EnableSsl = False
                smtp.Credentials = New NetworkCredential("info@indusanalytics.in", "Week@99811")
                smtp.Port = 25 '587 ' 
                smtp.Host = "relay-hosting.secureserver.net" ' "smtp.gmail.com" '
                smtp.Send(msg)

            Next

        Catch ex As Exception
            Return ex.Message
        End Try
        Return "Success"
    End Function

    ''---------------------------- Close Code  ------------------------------------------ Pradeep Yadav 09 Dec 2019

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class