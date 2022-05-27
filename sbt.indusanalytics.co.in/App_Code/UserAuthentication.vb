Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports Connection
Imports System.Net
Imports System.Net.Mail

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class UserAuthentication
    Inherits System.Web.Services.WebService


    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLCompanyID As String
    Dim UserID As String
    Dim GBLUserID As String

    Private Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
        Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()

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

    '---------------Open code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ShowUserList() As String
        Try

            str = "Select UserID,nullif(UserName,'') as UserName from UserMaster Where CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ShowUMList() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select distinct isnull(MM.SetGroupIndex, 0) as SetGroupIndex,isnull(MM.ModuleID, 0) as ModuleID,isnull(MM.ModuleHeadDisplayOrder, 0) as ModuleHeadDisplayOrder,Nullif(MM.ModuleHeadName,'') AS ModuleHeadName,nullif(MM.ModuleName,'') as ModuleName,nullif(MM.ModuleDisplayName,'') as ModuleDisplayName,nullif(UMA.CanView,'') as CanView,nullif(UMA.CanSave,'') as CanSave,nullif(UMA.CanEdit,'') as CanEdit,nullif(UMA.CanDelete,'') as CanDelete,nullif(UMA.CanExport,'') as CanExport,nullif(UMA.CanPrint,'') as CanPrint from UserModuleAuthentication As UMA Right Join ModuleMaster As MM on UMA.ModuleID=MM.ModuleID And MM.CompanyID=UMA.CompanyID Where MM.CompanyID=" & GBLCompanyID & " And MM.UserID='" & GBLUserID & "'"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    '-------------------mycode----------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllForm() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select Distinct isnull(MM.SetGroupIndex, 0) as SetGroupIndex,isnull(MM.ModuleID, 0) as ModuleID,isnull(MM.ModuleHeadDisplayOrder, 0) as ModuleHeadDisplayOrder,Nullif(MM.ModuleHeadName,'') AS ModuleHeadName,nullif(MM.ModuleName,'') as ModuleName,nullif(MM.ModuleDisplayName,'') as ModuleDisplayName,0 as CanView,0 as CanSave,0 as CanEdit,0 as CanDelete,0 as CanExport,0 as CanPrint,(Select Count(Distinct(SetGroupIndex)) from ModuleMaster Where CompanyID=MM.CompanyID) As SectionCount From ModuleMaster As MM Where MM.CompanyID=" & GBLCompanyID

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function


    Public Function ShowMailList() As String
        Try
            str = "Select Distinct isnull(Email, 0) as Email,isnull(Password, 0) as Password,Nullif(smtp_Server,'') AS smtp_Server,nullif(smtp_ServerPort,'') as smtp_ServerPort,nullif(smtp_Authenticate,'') as smtp_Authenticate,nullif(smtp_UseSSL,'') "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    '-------------------------end-----

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function InsertFun(ByVal jsonObjectsRecordDetail As Object, ByVal User_ID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Dim KeyField, IsUserCreate As String
        Dim AddColName, AddColValue, TableName As String

        Try
            IsUserCreate = db.GetColumnValue("Isnull(IsAdmin,'False')", "UserMaster", " CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID & " And Isnull(IsBlocked,0)=0 And Isnull(IsDeletedUser,0)=0")
            If IsUserCreate = False Or IsUserCreate = "False" Then
                Return "Only admin have the authority to change user form's rights..!"
            End If

            str = "Delete from UserModuleAuthentication Where UserID = " & User_ID & " and CompanyID='" & GBLCompanyID & "'"
            db.ExecuteNonSQLQuery(str)

            TableName = "UserModuleAuthentication"
            AddColName = "UserID,CompanyID,CreatedBy,CreatedDate"
            AddColValue = "" & User_ID & ",'" & GBLCompanyID & "'," & GBLUserID & ",Getdate()"

            KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                Return "fail " & KeyField
            End If

            'str1 = "INSERT INTO UserModuleAuthentication (Typeofsupport, TypeofPriority, TypeDescription) VALUES('" & Textsupport & "', '" & TextPriority & "' , '" & TextDescription & "')"
            'Db.ExecuteNonSQLQuery(str)
            KeyField = "Success"
            'End If
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RecordWidthInsert(ByVal JsonOperationRecordDetailsData As Object, ByVal GridName As String, ByVal GridColumnString As String) As String 'ByVal jsonObjectsRecordDetail As Object

        Dim dt As New DataTable

        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        UserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            db.ExecuteNonSQLQuery("Delete from UserModuleGridLayout WHERE CompanyID='" & GBLCompanyID & "' and GridName='" & GridName & "' ")

            TableName = "UserModuleGridLayout"
            AddColName = "CompanyID,ColumnString"
            AddColValue = "" & GBLCompanyID & ",'" & GridColumnString & "'"
            db.InsertDatatableToDatabase(JsonOperationRecordDetailsData, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetTicketNumber(ByVal prefix As String) As String
        'ByVal Textsupport As String, ByVal TextPriority As String, ByVal TextDescription As String

        Dim MaxTicketNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            KeyField = db.GeneratePrefixedNo("TicketSupportSystem", prefix, "MaxTicketNo", MaxTicketNo, "2019-2020", " Where Prefix='" & prefix & "'")
            ''EXEC sp_BackupDatabases 'IndusEnterprise', 'F', 'D:\INDUS ANALYTICS\INDUS PRINT ERP BACKUP\INDUS ENTERPRISES WEB BACKUP\'
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '---------UpdateList----------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateList(ByVal GBLTicketID As String, ByVal TextTicketNo As String, ByVal TextLocationModule As String, ByVal TextDescription As String, ByVal TextDateTime As String, ByVal TextClientName As String, ByVal TextContactPerson As String, ByVal TextContactNumber As String, ByVal RefrenceNumber As String, ByVal CallReceivedTime As String, ByVal Attachment As String, ByVal Textsupport As String, ByVal TextPriority As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, AddColValue As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        'GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            str2 = "update TicketSupportSystem set Location = '" & TextLocationModule & "', Description = '" & TextDescription & "',TicketDate = '" & TextDateTime & "',ClientName = '" & TextClientName & "',ContactPerson = '" & TextContactPerson & "',ContactNumber = '" & TextContactNumber & "',RefrenceNumber = '" & RefrenceNumber & "',CallReceivedTime = '" & CallReceivedTime & "',Attachment = '" & Attachment & "',TypeofSupport = '" & Textsupport & "',Priority = '" & TextPriority & "' where TicketID = '" & GBLTicketID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
            'End If
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
        ''PONo = db.GeneratePrefixedNo("TicketSupportSystem", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")


        'str2 = "select * from TicketSupportSystem"
        ''If (TicketID == ) Then
        'TableName = "TicketSupportSystem"
        'AddColName = ""
        'AddColValue = ""
        'AddColName = "TicketNo, Location, Description, TicketDate, ClientName, ContactPerson, ContactNumber, RefrenceNumber, CallReceivedTime, Attachment, TypeofSupport, Priority"
        'AddColValue = "'" & TextLocationModule & "','" & TextDescription & "','" & TextDateTime & "','" & TextClientName & "','" & TextContactPerson & "','" & RefrenceNumber & "','" & CallReceivedTime & "','" & Attachment & "','" & Textsupport & "','" & TextPriority & "'"
        ''db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)


        'str2 = ""
        ''str2 = "Select Max(TicketSupportSystem) as ConsumptionTransactionID From ItemConsumptionMain Where  CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1"
        'db.FillDataTable(dt, str2)
        'Dim i As Integer = dt.Rows.Count
        'If i > 1 Then
        '    TicketID = dt.Rows(0)(0)

        '    TableName = "TicketSupportSystem"
        '    AddColName = ""
        '    AddColValue = ""
        '    AddColName = "TicketNo, Location, Description, TicketDate, ClientName, ContactPerson, ContactNumber, RefrenceNumber, CallReceivedTime, Attachment, TypeofSupport, Priority"
        '    AddColValue = "'" & TextLocationModule & "','" & TextDescription & "','" & TextDateTime & "','" & TextClientName & "','" & TextContactPerson & "','" & RefrenceNumber & "','" & CallReceivedTime & "','" & Attachment & "','" & Textsupport & "','" & TextPriority & "'"
        '    '  db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

    End Function

    '---------close update--------

    '---------------Close Master code---------------------------------

    ''' <summary>
    ''' ERP Settings
    ''' </summary>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectedBlockData(ByVal CurrentBlock As String) As String
        Try

            str = "Select isnull(ParameterID,0) as ParameterID,nullif(ParameterName,'') as ParameterName,nullif(ParameterType,'') as ParameterType,nullif(ParameterValue,'') As  ParameterValue From ERPParameterSetting Where Isnull(IsDeletedTransaction,0)=0 And ParameterType='" & CurrentBlock & "'"

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
    Public Function InsertRecordData(ByVal JsonObjectReference As Object, ByVal PID As Integer) As String
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim DT As New DataTable

        Try
            TableName = "ERPParameterSetting"
            If PID = 0 Then
                str = "Select Count(*) From " & TableName & " Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & " And ParameterName='" & JsonObjectReference(0)("ParameterName") & "' And ParameterValue='" & JsonObjectReference(0)("ParameterValue") & "'"
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    Return "Duplicate Data"
                End If
                AddColName = "CompanyID,CreatedBy,CreatedDate"
                AddColValue = GBLCompanyID & "," & GBLUserID & ",getdate()"
                db.InsertDatatableToDatabase(JsonObjectReference, TableName, AddColName, AddColValue)
            Else
                str = "SELECT A.TABLE_NAME FROM INFORMATION_SCHEMA.TABLES as A Inner Join INFORMATION_SCHEMA.columns As B on A.Table_Name=B.Table_Name WHERE A.TABLE_TYPE='BASE TABLE' and B.Column_Name='" & Replace(JsonObjectReference(0)("ParameterName"), " ", "") & "' And B.Table_Name Not In ('JobType','JobPriority','JobBookingPrefix','JobReference')"
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    For index = 0 To dataTable.Rows.Count
                        str = "Select * From " & dataTable.Rows(0)(0) & " Where Isnull(IsDeletedTransaction,0)=0 And " & Replace(JsonObjectReference(0)("ParameterName"), " ", "") & "='" & JsonObjectReference(0)("ParameterValue") & "'"
                        db.FillDataTable(DT, str)
                        If DT.Rows.Count > 0 Then
                            Return "This parameter has used in other process"
                        End If
                    Next
                End If

                AddColName = "ModifiedBy=" & GBLUserID & ",ModifyDate=getdate()"
                db.UpdateDatatableToDatabase(JsonObjectReference, TableName, AddColName, 0, " ParameterID=" & PID & " And CompanyID=" & GBLCompanyID)
            End If
            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField
    End Function

    '----------DELETEMETHOD-ERPSEtting-----------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteParameterData(ByVal ParameterID As Integer, ByVal JsonObjectReference As Object) As String
        Dim keyfield As String
        Try
            Dim str As String
            Dim DT As New DataTable

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            str = "SELECT A.TABLE_NAME FROM INFORMATION_SCHEMA.TABLES as A Inner Join INFORMATION_SCHEMA.columns As B on A.Table_Name=B.Table_Name WHERE A.TABLE_TYPE='BASE TABLE' and B.Column_Name='" & Replace(JsonObjectReference(0)("ParameterName"), " ", "") & "' And B.Table_Name Not In ('JobType','JobPriority','JobBookingPrefix','JobReference')"
            db.FillDataTable(dataTable, str)
            If dataTable.Rows.Count > 0 Then
                For index = 0 To dataTable.Rows.Count
                    str = "Select * From " & dataTable.Rows(0)(0) & " Where Isnull(IsDeletedTransaction,0)=0 And " & Replace(JsonObjectReference(0)("ParameterName"), " ", "") & "='" & JsonObjectReference(0)("ParameterValue") & "'"
                    db.FillDataTable(DT, str)
                    If DT.Rows.Count > 0 Then
                        Return "This parameter has used in other process"
                    End If
                Next
            End If

            str = "Update ERPParameterSetting Set IsDeletedTransaction=1,DeletedBy=" & GBLUserID & ",DeletedDate=getdate() Where ParameterID=" & ParameterID & " And CompanyID=" & GBLCompanyID
            db.ExecuteNonSQLQuery(str)

            keyfield = "success"
        Catch ex As Exception
            keyfield = "failed " & ex.Message
        End Try
        Return keyfield
    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class

    '''---------------- Company Registration ------------------------------'''
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveData(ByVal Country As String, ByVal ph_no As String, ByVal Mail_Add As String, ByVal User_Name As String, ByVal Company_Name As String) As String
        Dim keyfield As String
        Try
            Dim str As String
            If Mail_Add.ToString() = "" Or Mail_Add.Contains("@") = False Or Mail_Add.Split("@")(0).Length <= 2 Or Mail_Add.Split("@")(1).Length <= 2 Then
                Return "Company registration failed with Invalid mail id"
            End If

            If db.IsDeletable("Email", "CompanyMaster", " Where Email='" & Mail_Add & "' Or MobileNo=" & ph_no) = False Then
                Return "Company already exist with this email id or mobile number. Please contact us at +91 81036 17108"
            End If
            str = "Insert Into CompanyMaster (CompanyName,Country,MobileNo,Email,ConcerningPerson,IsVerifedMobileNo) Values ('" & Company_Name & "','" & Country & "'," & ph_no & ",'" & Mail_Add & "','" & User_Name & "',1)"
            keyfield = db.ExecuteNonSQLQuery(str)

            'Try
            '    conn = db.OpenDataBase()
            '    If conn.State = ConnectionState.Closed Then
            '        conn.Open()
            '    End If

            '    Dim cmd As New SqlCommand(str, conn) With {
            '        .CommandType = CommandType.Text,
            '        .CommandTimeout = 0
            '    }
            '    keyfield = cmd.ExecuteScalar()
            '    cmd = Nothing
            '    conn.Close()

            'Catch ex As Exception
            '    keyfield = ex.Message
            '    conn.Close()
            'End Try

            If keyfield <> "Success" Then Return keyfield
            keyfield = SendEmail(Mail_Add, User_Name)
            If keyfield = "Success" Then
                keyfield = "PaymentPage.html?mailid=" & Mail_Add
            Else
                keyfield = "failed " & keyfield
            End If
        Catch ex As Exception
            keyfield = "failed " & ex.Message
        End Try
        Return keyfield
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ConfirmOTP(ByVal UserOTP As Integer) As String
        Dim OTP = Convert.ToString(HttpContext.Current.Session("OTP"))
        Dim KeyField As String
        Try
            KeyField = ""
            If UserOTP = OTP Then
                KeyField = "Success"
            Else
                KeyField = "Failed"
            End If
        Catch ex As Exception
            KeyField = "Somthing Went Wrong"
        End Try
        Return KeyField
    End Function

    Private Function SendEmail(ByVal TxtMailTo As String, ByVal Username As String) As String
        Dim TxtEmailBody, TxtSubject As String
        Dim random As New Random
        Dim rndomNum As String = db.ChangePassword(TxtMailTo)
        Dim varifyUrl = "http://inprint.indusanalytics.co.in/activateaccount.aspx?mailid=" & TxtMailTo & "&hash=" & rndomNum
        If TxtMailTo.ToString() = "" Or TxtMailTo.Contains("@") = False Then
            Return "Invalid mail id"
        End If

        TxtSubject = "New account verification"
        TxtEmailBody = "Hello " & Username & ",<br/><br/><b>Please verify your account</b><br/><br/>Hi! You've registered as new customer account at inPrint." &
          " Verify your account now and enjoy inPrint application." &
          " <br/><br/><a href='" + varifyUrl + "'>Verify Your Account</a>"

        Try
            Dim mm As MailMessage = New MailMessage("info@indusanalytics.in", TxtMailTo) With {
                .Subject = TxtSubject,
                .Body = TxtEmailBody
            }

            mm.IsBodyHtml = True
            mm.Priority = MailPriority.High
            mm.Bcc.Add("admin@indusanalytics.in")
            mm.CC.Add("bhupendra.indusanalytics@gmail.com")

            Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = "info@indusanalytics.in",
                .Password = "acxutzrqyxukybgb"
            }

            Dim smtp As SmtpClient = New SmtpClient With {
                .Host = "smtp.gmail.com",
                .Credentials = credential,
                .Port = 587,
                .EnableSsl = True
                }
            smtp.Send(mm)
            db.ExecuteNonSQLQuery("Update CompanyMaster Set HashCode='" & rndomNum & "' Where Email='" & TxtMailTo & "'")

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SendOtp(ByVal MobNo As Int64, ByVal prifix As Int64) As String
        Dim OTP = 0
        Dim rnd As New Random
        Dim dt As New DataTable
        Dim KeyField As String
        Dim destinationaddr As String = "91" & MobNo

        If db.IsDeletable("MobileNo", "CompanyMaster", " Where MobileNo=" & MobNo) = False Then
            Return "Company already exist with this mobile number. Please contact us at +91 81036 17108"
        End If
        OTP = rnd.Next(10, 99) & rnd.Next(10, 99)
        Session("OTP") = OTP
        Dim message As String = OTP & " is your OTP to register as Indus App user.Kindly use this to complete your registration,Please do not share this OTP.%nRegards,%nIndus Analytics"
        Try
            KeyField = ""
            Dim message1 As String = HttpUtility.UrlEncode(message)
            Dim wb As WebClient = New WebClient()
            Dim response As Byte() = wb.UploadValues("Http://api.textlocal.in/send/", New NameValueCollection() From {
                                    {"apikey", "tHyfgmyOVH8-jyLPyCa55NcG6F9OrbyHr4wZ6nBPrZ"},
                                    {"numbers", destinationaddr},
                                    {"message", message1},
                                    {"sender", "PRTERP"}
                                })
            KeyField = System.Text.Encoding.UTF8.GetString(response)
            If KeyField.Contains("success") = True Then
                Return "Success"
            Else
                Return "Failed"
            End If

        Catch ex As Exception
            KeyField = "Not match: " & ex.Message
        End Try

        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Load_Client_Data_() As String
        Dim dt_clients As New DataTable

        Dim str = "SELECT Distinct CM.CompanyID, CM.CompanyName,Replace(Convert(nvarchar(30),CM.CreatedDate,106),'','-') AS CreatedDate, CM.ConcerningPerson, CM.MobileNO, CM.Email, CM.IsVerifiedMail,SD.CompanyID AS SubCompanyID,Replace(Convert(nvarchar(30),SD.PaymentDueDate,106),'','-') AS PaymentDueDate FROM CompanyMaster AS CM LEFT OUTER JOIN CompanySubscriptionStatusDetail AS SD ON SD.CompanyID = CM.CompanyID ORDER BY CreatedDate DESC"
        db.FillDataTable(dt_clients, str)
        data.Message = ConvertDataTableTojSonString(dt_clients)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateClientActivation(ByVal ArrObjDetail As Object, ByVal CompanyIDStr As String, ByVal ToDate As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Dim KeyField, IsUserCreate As String
        Dim AddColName, AddColValue, TableName As String

        Try
            IsUserCreate = db.GetColumnValue("Isnull(IsAdmin,'False')", "UserMaster", " CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID & " And Isnull(IsBlocked,0)=0 And Isnull(IsDeletedUser,0)=0")
            If IsUserCreate = False Or IsUserCreate = "False" Then
                Return "Only indus admin have the authority to change this..!"
            End If
            If db.CheckAuthories("ClientActivation.aspx", GBLUserID, GBLCompanyID, "CanSave", CompanyIDStr) = False Then
                Return "You don't have authority to activate clients..!"
            End If

            TableName = "CompanySubscriptionStatusDetail"
            AddColName = "CreatedBy,CreatedDate"
            AddColValue = GBLUserID & ",Getdate()"

            KeyField = db.InsertDatatableToDatabase(ArrObjDetail, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                Return "fail " & KeyField
            End If
            If CompanyIDStr <> "" Then
                db.ExecuteNonSQLQuery("Update CompanySubscriptionStatusDetail Set ToDate='" & ToDate & "',PaymentDueDate='" & ToDate & "' Where CompanyID IN(" & CompanyIDStr & ")")
            End If
            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod()>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadButtonDetails(ByVal VoucherCode As String) As String
        If VoucherCode = "" Then
            str = "SELECT Distinct CouponName,CouponNo, CouponButtonMonthly As CouponButtonMonthlyHref, CouponButtonYearly As CouponButtonYearlyHref,CouponMessage As Status From CouponCodeMaster Where IsDefault=1 And IsExpired=0"
        Else
            If VoucherCode.Length > 10 Then
                GoTo pk
            End If

            str = "SELECT Distinct CouponName,CouponNo, CouponButtonMonthly As CouponButtonMonthlyHref, CouponButtonYearly As CouponButtonYearlyHref,CouponMessage As Status,DiscountAmount,DiscountPercentage,CouponAppliedOn As AppliedOn From CouponCodeMaster Where IsDefault=0 And IsExpired=0 And DATEDIFF(DAY,GETDATE(),CouponValidity)>0 And CouponNo='" & VoucherCode & "'"
        End If

        db.FillDataTable(dataTable, str)
        If (dataTable.Rows.Count = 0) Then
pk:
            str = "SELECT Distinct CouponName,CouponNo, CouponButtonMonthly As CouponButtonMonthlyHref, CouponButtonYearly As CouponButtonYearlyHref,'Invalid promo code entered...' As Status From CouponCodeMaster Where IsDefault=1 And IsExpired=0"
            db.FillDataTable(dataTable, str)
        End If
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod()>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RegisterWebinarData(ByVal Country As String, ByVal ph_no As String, ByVal Mail_Add As String, ByVal User_Name As String, ByVal Company_Name As String) As String
        Dim keyfield As String
        Try
            Dim str As String
            If Mail_Add.ToString() = "" Or Mail_Add.Contains("@") = False Or Mail_Add.Split("@")(0).Length <= 2 Or Mail_Add.Split("@")(1).Length <= 2 Then
                Return "Company registration failed with Invalid mail id"
            End If

            If db.IsDeletable("Email", "CompanyMasterForWebinar", " Where Email='" & Mail_Add & "' Or MobileNo=" & ph_no) = False Then
                Return "Company already registered for the webinar. Please attend the webinar on Monday 30-Aug-21, 15Hrs(3.00PM)IST"
            End If
            str = "Insert Into CompanyMasterForWebinar (CompanyName,Country,MobileNo,Email,ConcerningPerson) Values ('" & Company_Name & "','" & Country & "'," & ph_no & ",'" & Mail_Add & "','" & User_Name & "')"
            keyfield = db.ExecuteNonSQLQuery(str)

            If keyfield <> "Success" Then Return keyfield
            keyfield = SendEmailWebinar(Mail_Add, User_Name)
            If keyfield = "Success" Then
                keyfield = "You are successfully registered for the webinar , our representative will contact you for the further information about the webinar."
            Else
                keyfield = "failed " & keyfield
            End If
        Catch ex As Exception
            keyfield = "failed " & ex.Message
        End Try
        Return keyfield
    End Function

    Private Function SendEmailWebinar(ByVal TxtMailTo As String, ByVal Username As String) As String
        Dim TxtEmailBody, TxtSubject As String
        Dim random As New Random
        Dim rndomNum As String = db.ChangePassword(TxtMailTo)
        If TxtMailTo.ToString() = "" Or TxtMailTo.Contains("@") = False Then
            Return "Invalid mail id"
        End If

        TxtSubject = "Invitation For Indus Webinar On 30-Aug-2021"
        TxtEmailBody = "Hello <b>" & Username & "</b>,<br/><br/>Thank you for registering with us. We will get back to you soon with more details.<br/>We will share the webinar link in the next e-mail.<br/>Thanks and regards"

        Try
            Dim mm As MailMessage = New MailMessage("info@indusanalytics.in", TxtMailTo) With {
                .Subject = TxtSubject,
                .Body = TxtEmailBody
            }

            mm.IsBodyHtml = True
            mm.Priority = MailPriority.High
            mm.Bcc.Add("admin@indusanalytics.in")
            mm.Bcc.Add("bhupendra.indusanalytics@gmail.com")

            'Dim attachment As System.Net.Mail.Attachment
            'attachment = New System.Net.Mail.Attachment(Server.MapPath("~/images/inPrint-App-wallpaper.png"))
            'mm.Attachments.Add(attachment)

            Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = "info@indusanalytics.in",
                .Password = "acxutzrqyxukybgb"
            }

            Dim smtp As SmtpClient = New SmtpClient With {
                .Host = "smtp.gmail.com",
                .Credentials = credential,
                .Port = 587,
                .EnableSsl = True
                }
            smtp.Send(mm)

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
End Class
