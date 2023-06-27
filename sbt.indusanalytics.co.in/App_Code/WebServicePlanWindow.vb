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
Imports MailMessage = System.Net.Mail.MailMessage

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebServicePlanWindow
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim FYear As String
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLBranchID As String
    Dim GBLCompanyID As String
    Dim GBLUserName As String

    '---------------Open plan window code---------------------------------
    '-----------------------------------Get Quality------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetQuality() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))


        If str = "New" Then
            'str = "Select Distinct FieldValue As Quality from ItemMaster Where CompanyID=" & GBLCompanyID & " And FieldName='Quality' And  ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)=0"
            str = "Select Distinct Quality from ItemMaster Where CompanyID=" & GBLCompanyID & " And  ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)=0 And ISNULL(Quality,'')<>'' Order By Quality"
        Else
            str = "select Distinct Quality from PaperMaster where CompanyID=" & GBLCompanyID & " Union Select Distinct Quality from ReelMaster  where CompanyID=" & GBLCompanyID & " Order by Quality"
        End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get GSM------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetGSM(ByVal Quality As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        ' str = "select  Quality from PaperMaster where CompanyID='" & GBLCompanyID & "' union select Quality from ReelMaster  where CompanyID='" & GBLCompanyID & "' "

        'If str = "New" Then
        '    str = "Select Distinct FieldValue As GSM from ItemMaster where CompanyID=" & GBLCompanyID & " And FieldName='GSM' And Isnull(IsDeletedTransaction,0)=0 Order By FieldValue "
        'Else
        If Quality = "" Then
            'str = "Select Distinct FieldValue As GSM From ItemMaster Where FieldName='GSM' And  ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)<>1 And CompanyID=" & GBLCompanyID
            str = "Select Distinct GSM From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)=0 And ISNULL(GSM,0)>0 And CompanyID=" & GBLCompanyID & " Order By GSM "
        Else
            str = "Select Distinct GSM From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ISNULL(GSM,0)>0 And ItemID IN (Select ItemID From ItemMaster Where IsDeletedTransaction=0 And Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & ") And Isnull(IsDeletedTransaction,0)<>1 Order By GSM "
        End If
        'str = "Select ItemID,FieldName,FieldValue From ItemMaster Where FieldName In('Quality','GSM','Finish','Mill') And CompanyID=" & GBLCompanyID
        'End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Mill------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMill(ByVal Quality As String, ByVal GSM As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        'If str = "New" Then
        '    str = "Select Distinct FieldValue As GSM from ItemMaster where CompanyID=" & GBLCompanyID & " And FieldName='GSM' And Isnull(IsDeletedTransaction,0)=0 Order By FieldValue "
        'Else
        If Quality = "" And GSM = "" Then
            str = "Select Distinct Manufecturer As Mill From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)<>1 And ISNULL(Manufecturer,'')<>'' And CompanyID=" & GBLCompanyID
        Else
            str = "Select Distinct Manufecturer As Mill From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ItemID IN (Select ItemID From ItemMaster Where Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where GSM='" & GSM & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And Isnull(IsDeletedTransaction,0)<>1 Order By Mill"
        End If
        'str = "Select ItemID,FieldName,FieldValue From ItemMaster Where FieldName In('Quality','GSM','Finish','Mill') And CompanyID=" & GBLCompanyID
        'End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Finish------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFinish(ByVal Quality As String, ByVal GSM As String, ByVal Mill As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        'If str = "New" Then
        '    str = "Select Distinct FieldValue As GSM from ItemMaster where CompanyID=" & GBLCompanyID & " And FieldName='GSM' And Isnull(IsDeletedTransaction,0)=0 Order By FieldValue "
        'Else
        If Quality = "" And GSM = "" And Mill = "" Then
            str = "Select Distinct Finish From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)<>1 And ISNULL(Finish,'')<>'' And CompanyID=" & GBLCompanyID & " Order By Finish"
        Else
            str = "Select Distinct Finish From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ItemID IN (Select ItemID From ItemMaster Where GSM=" & GSM & " And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where Manufecturer='" & Mill & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And Isnull(IsDeletedTransaction,0)<>1 Order By Finish"
        End If
        'str = "Select ItemID,FieldName,FieldValue From ItemMaster Where FieldName In('Quality','GSM','Finish','Mill') And CompanyID=" & GBLCompanyID
        'End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Filtered Paper------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFiteredItems(ByVal Quality As String, ByVal GSM As String, ByVal Mill As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim DTMILL As New DataTable
        Dim DTFinish As New DataTable
        Dim DTGSM As New DataTable
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If str = "New" Then
            If Quality = "" Then
                str = "Select Distinct GSM From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)<>1 And ISNULL(GSM,0)>0 And CompanyID=" & GBLCompanyID & " Order By GSM"
            Else
                str = "Select Distinct GSM From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ItemID IN (Select ItemID From ItemMaster Where Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And Isnull(IsDeletedTransaction,0)<>1 Order By GSM"
            End If
            db.FillDataTable(DTGSM, str)

            If Quality = "" And GSM = "" Then
                str = "Select Distinct Manufecturer As Mill From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And Isnull(IsDeletedTransaction,0)<>1 And ISNULL(Manufecturer,'')<>'' And CompanyID=" & GBLCompanyID & " Order By Mill"
            Else
                str = "Select Distinct Manufecturer As Mill From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ItemID IN (Select ItemID From ItemMaster Where GSM='" & GSM & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And Isnull(IsDeletedTransaction,0)<>1 Order By Mill"
            End If
            db.FillDataTable(DTMILL, str)

            If Quality = "" And GSM = "" And Mill = "" Then
                str = "Select Distinct Finish From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1 And ISNULL(Finish,'')<>'' Order By Finish"
            Else
                str = "Select Distinct Finish From ItemMaster Where ItemGroupID In (Select ItemGroupID From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupNameID IN(-1,-2)) And ItemID IN (Select ItemID From ItemMaster Where GSM=" & GSM & " And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where Quality='" & Quality & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And ItemID IN (Select ItemID From ItemMaster Where Manufecturer='" & Mill & "' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0) And Isnull(IsDeletedTransaction,0)<>1 Order By Finish"
            End If
            db.FillDataTable(DTFinish, str)
        Else
            str = "Select Distinct Mill from PaperMaster " & Quality & " And CompanyID=" & GBLCompanyID & " Union Select Distinct Mill from ReelMaster  " & Quality & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1 Order by Mill Asc"
            db.FillDataTable(DTMILL, str)

            str = "select Distinct Finish from PaperMaster " & Quality & " And CompanyID=" & GBLCompanyID & " Union select Distinct Finish from ReelMaster  " & Quality & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1 Order by Finish Asc"
            db.FillDataTable(DTFinish, str)

            str = "Select Distinct GSM from PaperMaster " & Quality & " And CompanyID=" & GBLCompanyID & " Union Select Distinct GSM From ReelMaster " & Quality & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1 Order By GSM Asc"
            db.FillDataTable(DTGSM, str)
        End If
        DTMILL.TableName = "TblMill"
        DTGSM.TableName = "TblGSM"
        DTFinish.TableName = "TblFinish"
        Dim Dataset As New DataSet

        Dataset.Merge(DTMILL)
        Dataset.Merge(DTGSM)
        Dataset.Merge(DTFinish)

        data.Message = db.ConvertDataSetsTojSonString(Dataset)
        Return js.Serialize(data.Message)
    End Function

    ''---------------------------- Plan Operations  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadDefaultOperations(ByVal CategoryID As Integer, ByVal ContName As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = Convert.ToString(HttpContext.Current.Session("Version"))

            If str = "New" Then
                str = "SELECT DISTINCT PM.ProcessID,CPA.IsDefaultProcess, REPLACE(NULLIF (PM.ProcessName, ''), '""', '') AS ProcessName, ROUND(ISNULL(NULLIF (PM.Rate, ''), 0), 4) AS Rate, '' AS RateFactor,CPA.ID " &
                      " FROM ProcessMaster AS PM Inner Join CategoryWiseProcessAllocation As CPA On CPA.ProcessID=PM.ProcessID And CPA.CompanyID=PM.CompanyID And Isnull(CPA.IsDeletedTransaction,0)=0 Inner Join CategoryContentAllocationMaster As PCM On PCM.CategoryID=CPA.CategoryID And PCM.ContentID=CPA.ContentID And CPA.CompanyID=PCM.CompanyID And Isnull(PCM.IsDeletedTransaction,0)=0 Inner Join ContentMaster As CM On CM.ContentID=PCM.ContentID And CM.CompanyID=CPA.CompanyID WHERE (ISNULL(PM.IsDeletedTransaction, 0) = 0) AND (PM.CompanyID = " & GBLCompanyID & " ) And CPA.CategoryID=" & CategoryID & " And CM.ContentName='" & ContName & "' ORDER BY CPA.ID"
                db.FillDataTable(dataTable, str)
            Else
                str = " Select Distinct OperationId, Replace(Nullif(OperationName,''),'""','') as OperationName, Round(Isnull(Nullif(Rate,''),0),4) As Rate From OperationMaster WHERE /*(OperationID NOT IN (0, - 5, - 1)) And*/ CompanyId = " & GBLCompanyID & "  Order By OperationName Asc  "
                db.FillDataTable(dataTable, str)
            End If

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadProcessProduct(ByVal CategoryID As Integer) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        str = "SELECT DISTINCT 0 As IsDefaultProcess,0 As IsDisplayInEnquiry,PM.ProcessID, REPLACE(NULLIF (ProcessName, ''), '""', '') AS ProcessName, NULLIF (PrePress, '') AS PrePress, NULLIF (TypeofCharges, '') AS TypeofCharges, NULLIF (SizeToBeConsidered, '') AS SizeToBeConsidered, ROUND(ISNULL(NULLIF (Rate, ''), 0), 4) AS Rate, NULLIF (MinimumCharges, '') AS MinimumCharges, NULLIF (SetupCharges, '') AS SetupCharges, NULLIF (IsDisplay, '') AS IsDisplay, REPLACE(NULLIF (ChargeApplyOnSheets, ''), '""', '') AS ChargeApplyOnSheets, REPLACE(NULLIF (DisplayProcessName, ''), '""', '') AS DisplayProcessName, 0 AS Amount, '' AS RateFactor, '' AS AddRow FROM ProcessMaster AS PM where (ISNULL(PM.IsDeletedTransaction, 0) = 0) AND (PM.CompanyID = " & GBLCompanyID & " ) and PM.ProcessID in (Select * from  dbo.CSVToTable((Select ProcessIDString from CategoryMaster where isnull(IsDeletedTransaction,0) <> 1 and CategoryID =" & CategoryID & ")))  ORDER BY ProcessName"
        db.FillDataTable(dataTable, str)

        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''---------------------------- Plan Operations  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadOperations(ByVal CategoryID As Integer) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = Convert.ToString(HttpContext.Current.Session("Version"))

        If str = "New" Then
            str = "SELECT DISTINCT 0 As IsDefaultProcess,0 As IsDisplayInEnquiry,PM.ProcessID, REPLACE(NULLIF (ProcessName, ''), '""', '') AS ProcessName, NULLIF (PrePress, '') AS PrePress, NULLIF (TypeofCharges, '') AS TypeofCharges, NULLIF (SizeToBeConsidered, '') AS SizeToBeConsidered, ROUND(ISNULL(NULLIF (Rate, ''), 0), 4) AS Rate, NULLIF (MinimumCharges, '') AS MinimumCharges, NULLIF (SetupCharges, '') AS SetupCharges, NULLIF (IsDisplay, '') AS IsDisplay, REPLACE(NULLIF (ChargeApplyOnSheets, ''), '""', '') AS ChargeApplyOnSheets, REPLACE(NULLIF (DisplayProcessName, ''), '""', '') AS DisplayProcessName, 0 AS Amount, '' AS RateFactor, '' AS AddRow " &
                "FROM ProcessMaster AS PM Inner Join CategoryWiseProcessAllocation As CPA On CPA.ProcessID=PM.ProcessID And CPA.CompanyID=PM.CompanyID WHERE (ISNULL(PM.IsDeletedTransaction, 0) = 0) AND (PM.CompanyID = " & GBLCompanyID & " ) And CPA.CategoryID=" & CategoryID & "  ORDER BY ProcessName"
            db.FillDataTable(dataTable, str)
            If dataTable.Rows.Count <= 0 Then
                str = " Select Distinct 0 As IsDefaultProcess,0 As IsDisplayInEnquiry,ProcessID, Replace(Nullif(ProcessName,''),'""','') as ProcessName, Nullif(PrePress,'') as PrePress, Nullif(TypeofCharges,'') as TypeofCharges, Nullif(SizeToBeConsidered,'') as SizeToBeConsidered, Round(Isnull(Nullif(Rate,''),0),4) As Rate,Nullif(MinimumCharges,'') as MinimumCharges, Nullif(SetupCharges,'') as SetupCharges, " &
                   "Nullif(IsDisplay,'') as IsDisplay, Replace(Nullif(ChargeApplyOnSheets,''),'""','') As ChargeApplyOnSheets, Replace( Nullif(DisplayProcessName,''),'""','') as DisplayProcessName,0 As Amount,'' As RateFactor,'' As AddRow From ProcessMaster WHERE Isnull(IsDeletedTransaction,0)=0 And /*(ProcessID NOT IN (0, - 5, - 1)) And*/ CompanyId = " & GBLCompanyID & "  Order By ProcessName Asc  "
                dataTable.Clear()
                db.FillDataTable(dataTable, str)
            End If
        Else
            str = " Select Distinct OperationId, Replace(Nullif(OperationName,''),'""','') as OperationName, Nullif(PrePress,'') as PrePress, Nullif(TypeofCharges,'') as TypeofCharges, Nullif(SizeToBeConsidered,'') as SizeToBeConsidered, Round(Isnull(Nullif(Rate,''),0),4) As Rate, Nullif(MinimumCharges,'') as MinimumCharges, Nullif(SetupCharges,'') as SetupCharges,  " &
                   " Nullif(IsDisplay,'') as IsDisplay, Replace(Nullif(ChargeApplyOnSheets,''),'""','') as ChargeApplyOnSheets, Replace( Nullif(DisplayOperationName,''),'""','') as DisplayOperationName,0 As Amount From OperationMaster WHERE /*(OperationID NOT IN (0, - 5, - 1)) And*/ CompanyId = " & GBLCompanyID & "  Order By OperationName Asc  "
            db.FillDataTable(dataTable, str)
        End If

        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '// Suggested Process
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SuggestedOperations(ByVal processids As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select ProcessID, REPLACE(NULLIF (ProcessName, ''), '""', '') AS ProcessName, NULLIF (PrePress, '') AS PrePress, NULLIF (TypeofCharges, '') AS TypeofCharges, NULLIF (SizeToBeConsidered, '') AS SizeToBeConsidered, ROUND(ISNULL(NULLIF (Rate, ''), 0), 4) AS Rate, NULLIF (MinimumCharges, '') AS MinimumCharges, NULLIF (SetupCharges, '') AS SetupCharges, NULLIF (IsDisplay, '') AS IsDisplay, REPLACE(NULLIF (ChargeApplyOnSheets, ''), '""', '') AS ChargeApplyOnSheets, REPLACE(NULLIF (DisplayProcessName, ''), '""', '') AS DisplayProcessName, 0 AS Amount, '' AS RateFactor FROM ProcessMaster where ProcessID in (" & processids & ")"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '// Get Vendore List With Rates
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendoreListWithRates() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        '    str = "Select ProcessID, REPLACE(NULLIF (ProcessName, ''), '""', '') AS ProcessName, NULLIF (PrePress, '') AS PrePress, NULLIF (TypeofCharges, '') AS TypeofCharges, NULLIF (SizeToBeConsidered, '') AS SizeToBeConsidered, ROUND(ISNULL(NULLIF (Rate, ''), 0), 4) AS Rate, NULLIF (MinimumCharges, '') AS MinimumCharges, NULLIF (SetupCharges, '') AS SetupCharges, NULLIF (IsDisplay, '') AS IsDisplay, REPLACE(NULLIF (ChargeApplyOnSheets, ''), '""', '') AS ChargeApplyOnSheets, REPLACE(NULLIF (DisplayProcessName, ''), '""', '') AS DisplayProcessName, 0 AS Amount, '' AS RateFactor FROM ProcessMaster where ProcessID in (" & processids & ")"
        str = "Select * from LedgerMaster where LedgerGroupID = 8"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''---------------------------- Plan Operations Slabs Name------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadOperationsSlabs() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = Convert.ToString(HttpContext.Current.Session("Version"))

        If str = "New" Then
            'str = " Select Distinct ProcessID, Replace(Nullif(ProcessName,''),'""','') as ProcessName, Nullif(PrePress,'') as PrePress, Nullif(TypeofCharges,'') as TypeofCharges, Nullif(SizeToBeConsidered,'') as SizeToBeConsidered, Isnull(Nullif(Rate,''),0) as Rate,Nullif(MinimumCharges,'') as MinimumCharges, Nullif(SetupCharges,'') as SetupCharges, " &
            '   "Nullif(IsDisplay,'') as IsDisplay, Replace(Nullif(ChargeApplyOnSheets,''),'""','') As ChargeApplyOnSheets, Replace( Nullif(DisplayProcessName,''),'""','') as DisplayProcessName,0 As Amount,'' As RateFactor,'' As AddRow From ProcessMaster WHERE /*(ProcessID NOT IN (0, - 5, - 1)) And*/ CompanyId = " & GBLCompanyID & "  Order By ProcessName Asc  "
            str = "Select Distinct ProcessID,RateFactor From ProcessMasterSlabs Where ISNULL(RateFactor,'')<>'' And IsLocked=0 And Isnull(IsDeletedTransaction,0)<>1 And CompanyId = " & GBLCompanyID & ""
        End If

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadBookContents() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = " Select * From ContentMaster Where ContentsCategory='Book' And CompanyId = " & GBLCompanyID & "  Order By ContentName Asc  "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    ''' <summary>
    ''' ''Save Booking Data
    ''' </summary>
    ''' <param name="TblBooking">Details</param>
    ''' <param name="TblPlanning">Plan data</param>
    ''' <param name="TblOperations">Operation data</param>
    ''' <param name="FlagSave"></param>
    ''' <param name="BookingNo"></param>
    ''' <returns></returns>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function saveQuotationData(ByVal TblBooking As Object, ByVal TblPlanning As Object, ByVal TblOperations As Object, ByVal TblContentForms As Object, ByVal CostingData As Object, ByVal FlagSave As String, ByVal BookingNo As String, ByVal ObjShippers As Object, ByVal ArrObjAttc As Object) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))
            Dim dt As New DataTable

            Dim BookingID As String
            Dim MaxQuotationNo, RevisionNo As Long
            Dim AddColName, AddColValue, TableName As String
            AddColName = ""
            AddColValue = ""

            If db.CheckAuthories("ProjectQuotation.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then
                Return "You are not authorized to save"
            End If

            Using updateTransaction As New Transactions.TransactionScope

                TableName = "JobBooking"
                BookingID = db.GenerateMaxVoucherNo("JobBooking", "BookingId")
                If FlagSave = "True" Or FlagSave = True Then
                    MaxQuotationNo = db.GenerateMaxVoucherNo(TableName, "MaxBookingNo", "Where CompanyId = " & GBLCompanyID & " ")
                    RevisionNo = 0
                Else
                    RevisionNo = db.GenerateMaxVoucherNo(TableName, "RevisionNo", "Where BookingID = " & BookingNo & " and CompanyId = " & GBLCompanyID & " ")
                    MaxQuotationNo = BookingNo
                End If
                BookingNo = MaxQuotationNo & "." & RevisionNo

                TableName = "JobBooking"
                AddColName = "BookingNo,MaxBookingNo,RevisionNo,CompanyId,CreatedBy,FYear,EnquiryId,IsApproved,CreatedDate,ModifiedDate,QuotedByUserID"
                AddColValue = "'" & BookingNo & "','" & MaxQuotationNo & "','" & RevisionNo & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & FYear & "',0,0,getdate(),getdate()," & GBLUserID & ""
                BookingID = db.InsertDatatableToDatabase(TblBooking, TableName, AddColName, AddColValue)

                If Val(BookingID) <= 0 Or IsNumeric(BookingID) = False Then Return "Error:500 Main" & BookingID

                AddColName = "BookingId,BookingNo,CreatedDate,CompanyId"
                AddColValue = "" & BookingID & ",'" & BookingNo & "',getdate()," & GBLCompanyID & ""
                TableName = "JobBookingContents"
                str = db.InsertDatatableToDatabase(TblPlanning, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    Return "Error:500 Contents" & str
                End If

                TableName = "JobBookingProcess"
                str = db.AddToDatabaseOperation(TblOperations, TableName, AddColName, AddColValue)
                If str <> "200" Then
                    Return "Error:500 Process" & str
                End If

                AddColName = "BookingId,CreatedDate,CompanyId"
                AddColValue = "" & BookingID & ",getdate()," & GBLCompanyID & ""
                TableName = "JobBookingContentBookForms"
                str = db.AddToDatabaseOperation(TblContentForms, TableName, AddColName, AddColValue)

                If str <> "200" Then
                    Return "Error:500 Forms" & str
                End If

                TableName = "JobBookingCostings"
                str = db.InsertDatatableToDatabase(CostingData, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    Return "Error:500 Costings" & str
                End If

                'AddColName = "BookingId,CreatedDate,CreatedBy,CompanyId"
                'AddColValue = "" & BookingID & ",getdate()," & GBLUserID & "," & GBLCompanyID & ""
                'TableName = "JobBookingMaterialCost"
                'str = db.InsertDatatableToDatabase(ObjShippers, TableName, AddColName, AddColValue)
                'If IsNumeric(str) = False Then
                '    Return "Error:500 Materials" & str
                'End If

                AddColName = "BookingId,CreatedDate,CreatedBy,CompanyID"
                AddColValue = "" & BookingID & ",getdate()," & GBLUserID & "," & GBLCompanyID & ""
                TableName = "JobBookingAttachments"
                str = db.InsertDatatableToDatabase(ArrObjAttc, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    Return "Error:500 Attachements" & str
                End If

                updateTransaction.Complete()
                Return BookingID
            End Using

        Catch ex As Exception
            Return "Error:500 Exception" & ex.Message
        End Try
    End Function

    Private Sub DeleteBookingData(ByVal BKID As Integer)

        Dim conn As SqlConnection
        Try
            conn = db.OpenDataBase()
            If conn.State = ConnectionState.Closed Then
                conn.Open()
            End If
            str = "Delete From JobBooking Where BookingId=" & BKID
            Dim cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()

            str = "Delete From JobBookingContents Where BookingId=" & BKID
            cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()

            str = "Delete From JobBookingProcess Where BookingId=" & BKID
            cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()

            str = "Delete From JobBookingContentBookForms Where BookingId=" & BKID
            cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()

            str = "Delete From JobBookingCostings Where BookingId=" & BKID
            cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()

            str = "Delete From JobBookingAttachments Where BookingId=" & BKID
            cmd = New SqlCommand(str, conn)
            cmd.ExecuteNonQuery()
            conn.Close()
        Catch ex As Exception
            If conn.State = ConnectionState.Open Then
                conn.Close()
            End If
        End Try
    End Sub
    ''---------------------------- Select Box Client  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSbClient() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            '            str = "Select Distinct Nullif(Replace(LedgerName ,'""',''),'') as LedgerName,LedgerID As LedgerId From LedgerMaster Where UnderGroupID=24 And CompanyId = " & GBLCompanyID & " Order By LedgerName"
            str = "Select Distinct Nullif(Replace(LedgerName ,'""',''),'') as LedgerName,LedgerID As LedgerId From LedgerMaster As LM Inner Join LedgerGroupMaster As LGM On LGM.LedgerGroupID=LM.LedgerGroupID AND LM.CompanyID =LGM.CompanyID  Where LGM.LedgerGroupNameID=24 And Isnull(LM.IsDeletedTransaction,0)<>1 And LM.IsLedgerActive=1 And LM.CompanyId = " & GBLCompanyID & " Order By LedgerName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return "500"
        End Try
    End Function

    ''---------------------------- Select Box Category  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSbCategory() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = " Select Distinct CategoryId,Nullif(Replace(CategoryName,'""',''),'') as CategoryName From CategoryMaster Where CompanyId = " & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1   Order By CategoryName "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return "500"
        End Try
    End Function

    ''----------------------------Get All Active Contents------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllContents() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select  ContentID,Nullif(Replace(ContentName,'""',''),'') As ContentName,  Nullif(Replace(ContentCaption,'""',''),'') As ContentCaption, Nullif(Replace(ContentOpenHref,'""',''),'') As ContentOpenHref,  Nullif(Replace(ContentClosedHref,'""',''),'') As ContentClosedHref,  Nullif(Replace(ContentSizes,'""',''),'') As ContentSizes From ContentMaster Where Isnull(IsActive,0)=1 And CompanyId = " & GBLCompanyID & " Order By SequencNo "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''---------------------------- Get Contents Sizes------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentSize(ByVal ContName As String) As String
        Try
            ''            k = Convert.ToString(HttpContext.Current.Request.QueryString("ContType"))

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select ContentID,Nullif(Replace(ContentName,'""',''),'') As ContentName, Nullif(Replace(ContentSizes,'""',''),'') As ContentSizes From ContentMaster Where Isnull(IsActive,0)=1 And ContentName='" & ContName & "' And CompanyId = " & GBLCompanyID & " Order By SequencNo "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''---------------------------- Get Bookking No------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetQuoteNo(BKID As Integer) As String
        Dim bookingNo As String = ""
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If BKID = 0 Then
                bookingNo = db.GenerateMaxVoucherNo("JobBooking", "MaxBookingNo", "Where CompanyId = " & GBLCompanyID & " ")
                'str = "Select Top 1 BookingNo,BookingID,Max(MaxBookingNo) From JobBooking Where CompanyId= " & GBLCompanyID & " Group BY BookingNo,BookingID Order By BookingID Desc"
                'dataTable.Clear()
                'db.FillDataTable(dataTable, str)
                'If dataTable.Rows.Count > 0 Then
                '    bookingNo = dataTable.Rows(0)(0)
                'End If
            Else
                str = "Select BookingNo From JobBooking Where BookingID=" & BKID & " And CompanyId=" & GBLCompanyID
                dataTable.Clear()
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    bookingNo = dataTable.Rows(0)(0)
                End If
            End If
        Catch ex As Exception
            Return ex.Message
        End Try
        Return bookingNo
    End Function

    ''---------------------------- Get Operation formulas------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetTypeOfCharges() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT Distinct TypeOfCharges, Isnull(CalculationFormula,'') As CalculationFormula, isnull(FormulaVariables,'') As FormulaVariables FROM TypeOfCharges Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '---------------close plan window code---------------------------------
    '---------------------------------Quote Panel --------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBookingData(ByVal FilterSTR As String) As String
        Try
            If FilterSTR = "All" Then FilterSTR = ""
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LId = db.GetColumnValue("EmployeeId", "UserMaster", "UserId = " & GBLUserID)
            Dim Designation = db.GetColumnValue("Designation", "LedgerMaster", " LedgerGroupID =3 And Isnull(IsDeletedTransaction,0) = 0 And LedgerId = " & LId)

            Dim ConStr = ""

            If Designation.ToUpper() = "SALES CORDINATOR" Then
                ConStr = " And PQ.SalesCordinatorId = " & LId
            ElseIf Designation.ToUpper() = "SALES EXECUTIVE" Then
                ConStr = " And PQ.SalesPersonID = " & LId
            ElseIf Designation.ToUpper() = "SALES MANAGER" Then
                ConStr = " And PQ.SalesManagerId = " & LId
            End If

            FilterSTR = FilterSTR + ConStr

            Dim DT As New DataTable
            str = "Select PQ.EnquiryID, Isnull(PQ.IsSendForInternalApproval,0) as IsSendInternalApproval,Isnull(PQ.IsSendForPriceApproval,0) as IsSendForPriceApproval,Isnull(PQ.IsRework,0) as IsSendRework,Isnull(PQ.IsInternalApproved,0) as IsInternalApproved,Isnull(PQ.Isapproved,0) as IsPriceApproved,Isnull(PQ.IsCancelled,0) as IsCancelled, Isnull(EQ.EnquiryNo,'') as EnquiryNo,Isnull(UMA.UserName,'') as ApprovalSendTo, PQ.ApprovalSendTo,Isnull(convert(varchar,PQ.ApprovalSendDate,106),'') as ApprovalSendDate, PQ.EstimateNo as QuotationNo,convert(varchar, PQ.CreatedDate, 103) As CreatedDate,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,LMSM.LedgerName as SalesManager,LMSC.LedgerName as SalesCordinator,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark, PQ.ProductEstimateID,Isnull(convert(varchar,PQ.CancelledDate,106),'') as CancelledDate,PQ.CancelledRemark,Isnull(convert(varchar,PQ.ApprovedDate,106),'') as ApprovedDate,PQ.ApprovedRemark,Isnull(convert(varchar,PQ.ReworkDate,106),'') as ReworkDate,PQ.ReworkRemark,PQ.RemarkInternalApproved,Isnull(convert(varchar,PQ.InternalApprovedDate,106),'') as InternalApprovedDate from ProductQuotation as PQ inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID  and LMS.LedgerGroupID =3 inner Join LedgerMaster as LMSC on LMSC.CompanyID = PQ.CompanyID and LMSC.LedgerID = PQ.SalesCordinatorId and LMSC.LedgerGroupID =3 inner Join LedgerMaster as LMSM on LMSM.CompanyID = PQ.CompanyID and LMSM.LedgerID = PQ.SalesManagerId  and LMSM.LedgerGroupID = 3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy left join UserMaster as UMA on UMA.CompanyID = PQ.CompanyID and PQ.ApprovalSendTo = UMA.UserID inner join EnquiryMain as EQ on EQ.EnquiryID = PQ.EnquiryID and EQ.CompanyID = PQ.CompanyID  inner JOIN (Select Max(RevisionNo) as RevisionNo, EnquiryID,CompanyID From ProductQuotation Group By EnquiryID,CompanyID) as Q ON Q.EnquiryID = PQ.EnquiryID AND Q.RevisionNo = PQ.RevisionNo AND Q.CompanyID = EQ.CompanyID   where PQ.CompanyID =" & GBLCompanyID & " and PQ.IsDeletedTransaction = 0 " & FilterSTR & " order by PQ.CreatedDate desc"
            db.FillDataTable(dataTable, str)
            str = "Select PQC.ProductName as ProductName1, PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID  where  PQC.IsDeletedTransaction = 0 and PQC.CompanyID = " & GBLCompanyID
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPoBookingData(ByVal FilterSTR As String) As String
        Try
            If FilterSTR = "All" Then FilterSTR = ""
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LId = db.GetColumnValue("EmployeeId", "UserMaster", "UserId = " & GBLUserID)
            Dim Designation = db.GetColumnValue("Designation", "LedgerMaster", " LedgerGroupID =3 And Isnull(IsDeletedTransaction,0) = 0 And LedgerId = " & LId)

            Dim ConStr = ""
            'FilterSTR = ""
            'If Designation.ToUpper() = "SALES CORDINATOR" Then
            '    ConStr = " And PQ.SalesCordinatorId = " & LId
            'ElseIf Designation.ToUpper() = "SALES EXECUTIVE" Then
            '    ConStr = " And PQ.SalesPersonID = " & LId
            'ElseIf Designation.ToUpper() = "SALES MANAGER" Then
            '    ConStr = " And PQ.SalesManagerId = " & LId
            'End If

            FilterSTR = FilterSTR + ConStr

            Dim DT As New DataTable
            str = "Select distinct PQ.EstimateNo,EM.EnquiryNo,LM.LedgerName, PO.POID,Isnull(convert(varchar,PO.PoDate,106),'') PoDate, PO.PONumber + '.' + CONVERT(varchar,PO.VersionNo) as PONumber, PO.JobbookingNo,PO.salesOrderNo,PO.NetAmount,PO.IGSTAmount,PO.SGSTAmount,PO.CGSTAmount,PO.TotalGSTAmount,PO.TotalAmount,PO.IsRework,Isnull(PO.IsSentForApproval,0) IsSentForApproval,Isnull(PO.IsApproved,0) IsApproved,Isnull(PO.IsCancel,0) IsCancel,Isnull(convert(varchar,PO.ApprovalSentDate,106),'') as ApprovalSentDate,Isnull(convert(varchar,PO.ApprovedDate,106),'') as ApprovedDate ,Isnull(convert(varchar,PO.CanceledDate,106),'') as CanceledDate,Isnull(convert(varchar,PO.ReworkDate,106),'') as ReworkDate,isnull(UM.UserName,'') as ApprovalSentTo,Isnull(PO.ApprovedRemark,'') ApprovedRemark,Isnull(PO.ReworkRemark,'') ReworkRemark,Isnull(PO.CanceledRemark,'') CanceledRemark ,Isnull(UMA.UserName,'') ApprovedBy from ServicePOMain as PO inner join  JobBookingJobCard as JBJC on JBJC.JobBookingID = PO.JobBookingID inner join LedgerMaster as LM on LM.LedgerID = PO.LedgerID left join UserMaster UM on UM.UserID = PO.ApprovalSentTo left join UserMaster UMA on UMA.UserID = PO.ApprovedBy inner join ProductQuotation as PQ  on PQ.ProductEstimateID = PO.ProductEstimateID inner join EnquiryMain as EM  on EM.EnquiryID = PO.EnquiryId inner join (Select Max(VersionNo) as V,PONumber from ServicePOMain Group by PONumber) as Q on Q.PONumber = PO.PONumber and Q.V = PO.VersionNo  where PO.isDeletedTransaction = 0  and PO.companyID =" & GBLCompanyID & FilterSTR & " order By POID desc"
            db.FillDataTable(dataTable, str)
            str = "Select Distinct SPD.POID, VM.LedgerName as PlanedVendor,SVM.LedgerName as ScheduleVendorName, SPD.OrderQuantity,SPD.ProductName,SPD.ScheduleQty,SPD.PlannedRate as Rate,SPD.ScheduleRate,SPD.NetAmount,SPD.IGSTAmount,SPD.CGSTAmount,SPD.SGSTAmount,SPD.TotalGSTAmount,SPD.TotalAmount from ServicePODetails as SPD inner Join LedgerMaster as VM on VM.LedgerID = SPD.PlannedVendorID inner Join LedgerMaster as SVM on SVM.LedgerID = SPD.ScheduleVendorId where ISNULL(SPD.IsdeletedTransaction,0)<>1 "
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPoBookingHistoryData(ByVal PONumber As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LId = db.GetColumnValue("EmployeeId", "UserMaster", "UserId = " & GBLUserID)
            Dim Designation = db.GetColumnValue("Designation", "LedgerMaster", " LedgerGroupID =3 And Isnull(IsDeletedTransaction,0) = 0 And LedgerId = " & LId)

            Dim ConStr = ""

            Dim DT As New DataTable
            str = "Select distinct PQ.EstimateNo,EM.EnquiryNo,LM.LedgerName, PO.POID,Isnull(convert(varchar,PO.PoDate,106),'') PoDate, PO.PONumber + '.' + CONVERT(varchar,PO.VersionNo) as PONumber, PO.JobbookingNo,PO.salesOrderNo,PO.NetAmount,PO.IGSTAmount,PO.SGSTAmount,PO.CGSTAmount,PO.TotalGSTAmount,PO.TotalAmount,PO.IsRework,Isnull(PO.IsSentForApproval,0) IsSentForApproval,Isnull(PO.IsApproved,0) IsApproved,Isnull(PO.IsCancel,0) IsCancel,Isnull(convert(varchar,PO.ApprovalSentDate,106),'') as ApprovalSentDate,Isnull(convert(varchar,PO.ApprovedDate,106),'') as ApprovedDate ,Isnull(convert(varchar,PO.CanceledDate,106),'') as CanceledDate,Isnull(convert(varchar,PO.ReworkDate,106),'') as ReworkDate,isnull(UM.UserName,'') as ApprovalSentTo,Isnull(PO.ApprovedRemark,'') ApprovedRemark,Isnull(PO.ReworkRemark,'') ReworkRemark,Isnull(PO.CanceledRemark,'') CanceledRemark ,Isnull(UMA.UserName,'') ApprovedBy from ServicePOMain as PO inner join  JobBookingJobCard as JBJC on JBJC.JobBookingID = PO.JobBookingID inner join LedgerMaster as LM on LM.LedgerID = PO.LedgerID left join UserMaster UM on UM.UserID = PO.ApprovalSentTo left join UserMaster UMA on UMA.UserID = PO.ApprovedBy inner join ProductQuotation as PQ  on PQ.ProductEstimateID = PO.ProductEstimateID inner join EnquiryMain as EM  on EM.EnquiryID = PO.EnquiryId  where PO.isDeletedTransaction = 0  and PO.PONumber = '" & PONumber & "' and PO.companyID =" & GBLCompanyID & " order By POID desc"
            db.FillDataTable(dataTable, str)
            str = "Select Distinct SPD.POID, VM.LedgerName as PlanedVendor,SVM.LedgerName as ScheduleVendorName, SPD.OrderQuantity,SPD.ProductName,SPD.ScheduleQty,SPD.PlannedRate as Rate,SPD.ScheduleRate,SPD.NetAmount,SPD.IGSTAmount,SPD.CGSTAmount,SPD.SGSTAmount,SPD.TotalGSTAmount,SPD.TotalAmount from ServicePODetails as SPD inner Join LedgerMaster as VM on VM.LedgerID = SPD.PlannedVendorID inner Join LedgerMaster as SVM on SVM.LedgerID = SPD.ScheduleVendorId where ISNULL(SPD.IsdeletedTransaction,0)<>1 "
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePOStatus(ByVal Type As String, ByVal Remark As String, ByVal ID As Int16) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim Keyfield As String = ""
            Dim DT As New DataTable

            If Type = "Approved" Then
                str = "Update ServicePoMain set IsRework=0,ReworkRemark='',IsCancel=0,CanceledRemark='', IsApproved= 1,ApprovedBy=" + GBLUserID + ",ApprovedDate=Getdate(),ApprovedRemark='" & Remark & "' where POID= " & ID
            ElseIf Type = "Rework" Then
                str = "Update ServicePoMain set IsRework=1,ReworkRemark='" + Remark + "',ReworkDate= getdate(),IsCancel=0,CanceledRemark='', IsApproved= 0,ApprovedBy=0,ApprovedRemark='' where POID= " & ID
            Else
                str = "Update ServicePoMain set IsRework=0,ReworkRemark='',IsCancel=1,CanceledDate=GetDate(),CanceledRemark='" + Remark + "', IsApproved= 0,ApprovedBy=0,ApprovedRemark='' where POID= " & ID
            End If

            Keyfield = db.ExecuteNonSQLQuery(str)
            Return Keyfield
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePO(ByVal POID As Int16) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim Keyfield As String = ""
            Dim DT As New DataTable

            str = "Update ServicePoMain set IsDeletedTransaction = 1 , DeletedDate=GetDate() where POID=" & POID & "; Update ServicePoDetails set IsDeletedTransaction = 1 , DeletedDate=GetDate() where POID=" & POID

            Keyfield = db.ExecuteNonSQLQuery(str)
            Return Keyfield
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBookingDataHistory(ByVal ID As String) As String
        Try
            Dim FilterSTR = ""
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LId = db.GetColumnValue("EmployeeId", "UserMaster", "UserId = " & GBLUserID)
            Dim Designation = db.GetColumnValue("Designation", "LedgerMaster", " LedgerGroupID =3 And Isnull(IsDeletedTransaction,0) = 0 And LedgerId = " & LId)

            Dim ConStr = ""

            'If Designation.ToUpper() = "SALES CORDINATOR" Then
            '    ConStr = " And PQ.SalesCordinatorId = " & LId
            'ElseIf Designation.ToUpper() = "SALES EXECUTIVE" Then
            '    ConStr = " And PQ.SalesPersonID = " & LId
            'ElseIf Designation.ToUpper() = "SALES MANAGER" Then
            '    ConStr = " And PQ.SalesManagerId = " & LId
            'End If

            FilterSTR = FilterSTR + ConStr

            Dim DT As New DataTable
            str = "Select Isnull(PQ.IsSendForInternalApproval,0) as IsSendInternalApproval,Isnull(PQ.IsSendForPriceApproval,0) as IsSendForPriceApproval,Isnull(PQ.IsRework,0) as IsSendRework,Isnull(PQ.IsInternalApproved,0) as IsInternalApproved,Isnull(PQ.Isapproved,0) as IsPriceApproved,Isnull(PQ.IsCancelled,0) as IsCancelled, Isnull(EQ.EnquiryNo,'') as EnquiryNo,Isnull(UMA.UserName,'') as ApprovalSendTo, PQ.ApprovalSendTo,Isnull(convert(varchar,PQ.ApprovalSendDate,106),'') as ApprovalSendDate, PQ.EstimateNo as QuotationNo,convert(varchar, PQ.CreatedDate, 103) As CreatedDate,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,LMSM.LedgerName as SalesManager,LMSC.LedgerName as SalesCordinator,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark, PQ.ProductEstimateID,Isnull(convert(varchar,PQ.CancelledDate,106),'') as CancelledDate,PQ.CancelledRemark,Isnull(convert(varchar,PQ.ApprovedDate,106),'') as ApprovedDate,PQ.ApprovedRemark,Isnull(convert(varchar,PQ.ReworkDate,106),'') as ReworkDate,PQ.ReworkRemark,PQ.RemarkInternalApproved,Isnull(convert(varchar,PQ.InternalApprovedDate,106),'') as InternalApprovedDate from ProductQuotation as PQ inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID  and LMS.LedgerGroupID =3 inner Join LedgerMaster as LMSC on LMSC.CompanyID = PQ.CompanyID and LMSC.LedgerID = PQ.SalesCordinatorId and LMSC.LedgerGroupID =3 inner Join LedgerMaster as LMSM on LMSM.CompanyID = PQ.CompanyID and LMSM.LedgerID = PQ.SalesManagerId  and LMSM.LedgerGroupID = 3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy inner join UserMaster as UMA on UMA.CompanyID = PQ.CompanyID and PQ.ApprovalSendTo = UMA.UserID inner join EnquiryMain as EQ on EQ.EnquiryID = PQ.EnquiryID and EQ.CompanyID = PQ.CompanyID where PQ.CompanyID =" & GBLCompanyID & " and PQ.IsDeletedTransaction = 0 " & FilterSTR & " and PQ.EnquiryID= " & ID & " order by PQ.CreatedDate desc"
            db.FillDataTable(dataTable, str)
            str = "Select PQC.ProductName as ProductName1, PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID  where  PQC.IsDeletedTransaction = 0  and PQC.CompanyID = " & GBLCompanyID
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadPlanProject(ByVal ProjectEstimateID As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Dim DT As New DataTable
            str = "Select * from ProductQuotation where CompanyID=" & GBLCompanyID & " and ProductEstimateID=" & ProjectEstimateID
            db.FillDataTable(dataTable, str)
            str = "Select     ROW_NUMBER()   OVER (ORDER BY ED.EnquiryIDDetail) AS SequenceNo   , ED.EnquiryIDDetail, PQC.IsManualCosting, PQC.CGSTAmount,PQC.CGSTPercantage,PQC.SGSTAmount,PQC.SGSTPercantage,PQC.IGSTAmount,PQC.IGSTPercantage, PQC.ProductName as ProductName1, PQ.BookingID,LM.LedgerName as VendorName,LM.City,PCM.IsOffsetProduct,PCM.IsUnitProduct, PCM.ProductCatalogCode,REPLACE(PQC.ProductDescription, CHAR(13) + CHAR(10), ' ') ProductDescription,ProductEstimationContentID,PQC.ProductEstimateID,PQC.Quantity as RequiredQuantity ,PQC.Quantity,PQC.CategoryID,PQC.ProductCatalogID,PQC.VendorID,PQC.MiscAmount,PQC.MiscPercantage as MiscPer,PQC.ShippingCost,PQC.GSTAmount,PQC.GSTPercantage as GSTTaxPercentage,PQC.ProfitCost,PQC.ProfitPer,PQC.Rate,PQC.Rate as VendorRate,PQC.Amount,PQC.ProcessCost,PQC.FinalAmount,PQC.UnitCost,PQC.RateType,PQC.ProcessIDStr,isnull(PQC.UnitCostVendor,0) UnitCostVendor,PQC.ProductHSNID,PQC.DefaultProcessStr,REPLACE(PQC.ProductDescription, CHAR(13) + CHAR(10), ' ')  ProductDescriptions,REPLACE(PQC.PackagingDetails, CHAR(13) + CHAR(10), ' ') PackagingDetails,REPLACE(PQC.DescriptionOther, CHAR(13) + CHAR(10), ' ') DescriptionOther from ProductQuotationContents as PQC inner join ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID and PCM.CompanyID =PQC.CompanyID inner join LedgerMaster as LM on LM.LedgerID = PQC.VendorID  and PQC.CompanyID = LM.CompanyID Inner Join ProductQuotation as PQ on PQ.ProductEstimateID = PQC.ProductEstimateID and PQ.CompanyID = PQC.CompanyID inner join EnquiryDetails as ED on PQ.EnquiryID = ED.EnquiryID and PQC.ProductCatalogID = ED.ProductCatalogID and PQC.ProductName = ED.ProductName where PQC.IsDeletedTransaction=0 and LM.LedgerGroupID=8 and PQC.CompanyID=" & GBLCompanyID & " and PQC.ProductEstimateID=" & ProjectEstimateID
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetInputSizes(ByVal ProductEstimationContentID As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select ProductInputSizes from ProductQuotationContents where  CompanyID=" & GBLCompanyID & " and ProductEstimationContentID=" & ProductEstimationContentID
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectedPlan(ByVal ProductEstimationContentID As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select SelectedPlan from ProductQuotationContents where  CompanyID=" & GBLCompanyID & " and ProductEstimationContentID=" & ProductEstimationContentID
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '---------------------------------Load Printing slabs--------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadPrintingSlabsDetails(ByVal MachineID As Integer, ByVal PaperGrp As String, ByVal SizeWL As String) As String
        Try
            Dim SheetL, SheetH As Double
            SeperatePaperSize(SizeWL, SheetL, SheetH)
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct MachineID, SheetRangeFrom, SheetRangeTo, Wastage, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges,CoatingCharges, SpecialColorFrontCharges, SpecialColorBackCharges, FlatRate, FlatWastageSheets, ApplyAsFixedCharge,PaperGroup,MaxPlanL,MaxPlanW,MinCharges From MachineSlabMaster  Where CompanyId = " & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1 And MachineID =" & MachineID & " And PaperGroup='" & PaperGrp & "' And ((MaxPlanL >= " & SheetL & " AND MaxPlanW >= " & SheetH & ") OR (MaxPlanL >= " & SheetH & " AND MaxPlanW >= " & SheetL & "))  Order By MachineID, SheetRangeFrom, SheetRangeTo "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get online Caoting types------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCoating() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        str = Convert.ToString(HttpContext.Current.Session("Version"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        If str = "New" Then
            str = "SELECT Distinct CoatingName From MachineOnlineCoatingRates Where CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0 Group By CoatingName"
        Else
            str = "SELECT Distinct CoatingName As CoatingName From MachineOnlineCoatingRates Where CompanyID=" & GBLCompanyID & " Group By CoatingName"
        End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------------------------ReLoad Plan Details--------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadPlanDetails(ByVal BookingID As Integer) As String
        Try
            Dim DTBooking As New DataTable
            Dim DTCost As New DataTable
            Dim DTContent As New DataTable
            Dim DTProcess As New DataTable
            Dim DTBookForms As New DataTable
            Context.Response.Clear()
            Context.Response.ContentType = "application/json"

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            '            str = "SELECT BookingNo,BookingID,JobName, LedgerID, CategoryID, OrderQuantity, TypeOfCost, FinalCost, Nullif(BookingRemark,'') As BookingRemark, Nullif(Remark,'') As Remark, ClientName, ProductCode, ExpectedCompletionDays FROM JobBooking WHERE (BookingID = " & BookingID & ") And Isnull(IsCancelled,0)=0 And Isnull(IsEstimate,0)=1 And QuoteType ='Job Costing' And CompanyID=" & GBLCompanyID
            str = "SELECT Distinct JB.BookingNo,JB.BookingID,JobName, LedgerID, CategoryID, OrderQuantity, TypeOfCost, FinalCost,Isnull(QuotedCost,0) As QuotedCost, Nullif(BookingRemark,'') As BookingRemark, Nullif(Remark,'') As Remark, ClientName, Nullif(ProductCode,'') As ProductCode, ExpectedCompletionDays,JBC.PlanContentType,JBC.PlanContName,Isnull(JB.CurrencySymbol,'INR') As CurrencySymbol,Isnull(JB.ConversionValue,1) As ConversionValue,Isnull(JB.ConsigneeID,0) As ConsigneeID,Isnull(JB.ProductHSNID,0) As ProductHSNID,convert(varchar, JB.CreatedDate, 103) As CreatedDate,ShipperID FROM JobBooking As JB Inner Join JobBookingContents As JBC On JB.BookingID=JBC.BookingID WHERE (JB.BookingID = " & BookingID & ") /*And Isnull(IsCancelled,0)=0*/ And Isnull(IsEstimate,0)=1 And QuoteType ='Job Costing'  And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID
            db.FillDataTable(DTBooking, str)
            If DTBooking.Rows.Count <= 0 Then Return "error code:404"

            str = "SELECT Top 1 MachineID, MachineName, Gripper, GripperSide, MachineColors, PaperID, PaperSize, CutSize, CutL, CutW, UpsL, UpsW, TotalUps, BalPiece, BalSide, WasteArea, WastePerc, WastageKg, GrainDirection, PlateQty, PlateRate, PlateAmount, MakeReadyWastageSheet, ActualSheets, WastageSheets, TotalPaperWeightInKg, FullSheets, PaperRate, PaperAmount, PrintingImpressions, ImpressionsToBeCharged, PrintingRate, PrintingAmount, TotalMakeReadies, MakeReadyRate, MakeReadyAmount, FinalQuantity, TotalColors, TotalAmount, CutLH, CutHL, PrintingStyle, PrintingChargesType, ExpectedExecutionTime, TotalExecutionTime, MainPaperName, PlanType, PaperRateType, DieCutSize, InterlockStyle, NoOfSets, GrantAmount, Packing, UnitPerPacking, RoundofImpressionsWith, SpeColorFCharges, SpeColorBCharges, SpeColorFAmt, SpeColorBAmt, OpAmt, PlanID, PlanContQty, PlanContentType, PlanContName, SequenceNo, Nullif(ContentSizeValues,'') As ContentSizeValues, CoatingCharges, CoatingAmount, PaperGroup,VendorID,Nullif(VendorName,'') VendorName FROM JobBookingContents As JBC Inner Join JobBooking AS JB On JB.BookingID=JBC.BookingID  And Isnull(JB.IsDeletedTransaction,0)=0 And Isnull(JBC.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") /*And Isnull(JB.IsCancelled,0)=0*/ And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(ContentSizeValues,'')<>'' And JB.CompanyID=" & GBLCompanyID
            db.FillDataTable(DTContent, str)

            str = "SELECT  PlanContQty, TaxPercentage, MiscPercentage, ProfitPercentage, DiscountPercentage, TotalCost, MiscCost, ProfitCost, DiscountAmount, TaxAmount, GrandTotalCost, UnitCost, UnitCost1000, JBC.FinalCost,Isnull(JBC.ShipperCost,0) As ShipperCost,Isnull(JBC.QuotedCost,0) As QuotedCost FROM JobBookingCostings  As JBC Inner Join JobBooking AS JB On JB.BookingID=JBC.BookingID WHERE (JB.BookingID = " & BookingID & ") /*And Isnull(JB.IsCancelled,0)=0*/ And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(JB.IsDeletedTransaction,0)=0 And Isnull(JBC.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID
            db.FillDataTable(DTCost, str)

            str = "SELECT Distinct PM.ProcessID,PM.ProcessName,Nullif(PMS.RateFactor,'') AS RateFactor, Quantity, PlanID, PlanContQty, PlanContentType, PlanContName,ROUND(JBC.Rate,4) As Rate, Ups, NoOfPass, Pieces, NoOfStitch, NoOfLoops, NoOfColors, SizeL, SizeW, Amount, Nullif(Remarks,'') AS Remarks, SequenceNo,PM.MinimumCharges,PM.TypeofCharges,PM.SetupCharges,Isnull(JBC.IsDisplay,0) As IsDisplay,Isnull(PM.Rate,0) As MasterRate FROM JobBookingProcess  As JBC Inner Join JobBooking AS JB On JB.BookingID=JBC.BookingID  And Isnull(JB.IsDeletedTransaction,0)=0 And JBC.CompanyID=JB.CompanyID Inner Join ProcessMaster AS PM On PM.ProcessID=JBC.ProcessID And JBC.CompanyID=PM.CompanyID Left Join ProcessMasterSlabs As PMS On PMS.ProcessID= PM.ProcessID And JBC.RateFactor=PMS.RateFactor WHERE (JB.BookingID = " & BookingID & ") /*And Isnull(JB.IsCancelled,0)=0*/ And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(JBC.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & " Order By PlanID,SequenceNo"
            db.FillDataTable(DTProcess, str)

            str = "SELECT PlanContQty, PlanContentType, PlanContName, Forms, Sets, Pages, Sheets, ImpressionsPerSet, FormsInPoint, ImprsToChargedPerSet, BasicRate, SlabRate, RateType, Amount, WastagePercentSheet, PlateRate, PlanID FROM JobBookingContentBookForms  As JBC Inner Join JobBooking AS JB On JB.BookingID=JBC.BookingID And Isnull(JB.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") /*And Isnull(JB.IsCancelled,0)=0*/ And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(JBC.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID
            db.FillDataTable(DTBookForms, str)

            DTBooking.TableName = "TblBooking"
            DTContent.TableName = "TblBookingContents"
            DTCost.TableName = "TblBookingCosting"
            DTProcess.TableName = "TblBookingProcess"
            DTBookForms.TableName = "TblBookingForms"

            Dim Dataset As New DataSet

            Dataset.Merge(DTBooking)
            Dataset.Merge(DTContent)
            Dataset.Merge(DTCost)
            Dataset.Merge(DTProcess)
            Dataset.Merge(DTBookForms)

            data.Message = db.ConvertDataSetsTojSonString(Dataset)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message & "500"
        End Try
    End Function

    ''---------------------------- Set Is send for Approval------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateSendForApproval(ByVal BKID As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            str = "Update ProductQuotation Set IsSendForPriceApproval=1,ApprovalSendDate=Getdate(),ApprovalSendBy=" & GBLUserID & " Where CompanyId = " & GBLCompanyID & " And ProductEstimateID In (" & BKID & ")"
            db.ExecuteNonSQLQuery(str)

            Return "Save"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DisApproval(ByVal BKID As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            str = "Update ProductQuotation Set IsApproved=0 Where CompanyId = " & GBLCompanyID & " And ProductEstimateID In (" & BKID & ");Update JobApprovedCost Set IsDeletedTransaction=1 Where CompanyId = " & GBLCompanyID & " And BookingID In (" & BKID & ")"
            db.ExecuteNonSQLQuery(str)

            Return "Save"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''---------------------------- Set Is send for Approval------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateSendForIA(ByVal BKID As String, ByVal flag As Integer, ByVal SendTo As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            str = "Update ProductQuotation Set IsSendForInternalApproval=" & flag & ",ApprovalSendTo=" & SendTo & ",ApprovalSendDate = GETDATE() Where CompanyId = " & GBLCompanyID & " And ProductEstimateID In (" & BKID & ")"
            db.ExecuteNonSQLQuery(str)


            If flag = 1 Then


                '' get Quotation Details
                'str = "Select  Isnull(EQ.EnquiryNo,'') as EnquiryNo,convert(varchar, EQ.CreatedDate, 103) As EnquiryCreationDate,convert(varchar, EQ.CreatedDate, 8) As EnquiryTime, PQ.EstimateNo as QuotationNo,convert(varchar, PQ.CreatedDate, 103) As QuoteCreatedDate,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,LMSM.LedgerName as SalesManager,LMSC.LedgerName as SalesCordinator,UM.UserName as EstimateBy, PQ.ProductEstimateID,UME.UserName as EnquiryBy   from ProductQuotation as PQ inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID  and LMS.LedgerGroupID =3 inner Join LedgerMaster as LMSC on LMSC.CompanyID = PQ.CompanyID and LMSC.LedgerID = PQ.SalesCordinatorId and LMSC.LedgerGroupID =3 inner Join LedgerMaster as LMSM on LMSM.CompanyID = PQ.CompanyID and LMSM.LedgerID = PQ.SalesManagerId  and LMSM.LedgerGroupID = 3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy inner join EnquiryMain as EQ on EQ.EnquiryID = PQ.EnquiryID and EQ.CompanyID = PQ.CompanyID inner Join UserMaster as UME on UME.CompanyID = PQ.CompanyID and UME.UserID = EQ.CreatedBy inner JOIN (Select Max(RevisionNo) as RevisionNo, EnquiryID,CompanyID From ProductQuotation Group By EnquiryID,CompanyID) as Q ON Q.EnquiryID = PQ.EnquiryID AND Q.RevisionNo = PQ.RevisionNo AND Q.CompanyID = EQ.CompanyID  where PQ.CompanyID =1 and PQ.ProductEstimateID = " & BKID & " and PQ.IsDeletedTransaction = 0 order by PQ.CreatedDate desc"
                'Dim Dt As New DataTable
                'db.FillDataTable(Dt, str)

                'If Dt.Rows.Count > 0 Then

                '    Dim ToMail = db.GetColumnValue("EmailID", "UserMaster", "  companyID=" & GBLCompanyID & " and UserId=" & SendTo)
                '    db.FillDataTable(Dt, str)
                '    '' Sending Notification Bty Mail To User(SendTo)
                '    Dim Subject = "Need Internal Approval on Quotation No. " + Dt.Rows(0)("QuotationNo").ToString

                '    If ToMail = "" Then
                '        Return "Save"
                '    End If
                '    Dim Body = "Dear Sir/ mam,<br/><br/>" &
                '               " Greetings For the day!<br/><br/>" &
                '               " Need internal approval on Quotation No. <b>" + Dt.Rows(0)("QuotationNo").ToString + "</b><br/>" &
                '               " <b>Job detail mention below :- </b><br/><br/>" &
                '               "<b> Enquiry no.:</b> " + Dt.Rows(0)("EnquiryNo").ToString + "<br/>" &
                '               "<b> punched by:</b> " + Dt.Rows(0)("EnquiryBy").ToString + " , on dated " + Dt.Rows(0)("EnquiryCreationDate").ToString + " , time " + Dt.Rows(0)("EnquiryTime").ToString + " <br/>" &
                '               "<b> Sales executive:</b> " + Dt.Rows(0)("SalesPerson").ToString + "  <br/>" &
                '               "<b> Sales Manager:</b> " + Dt.Rows(0)("SalesManager").ToString + " <br/>" &
                '               "<b> Client Name:</b> " + Dt.Rows(0)("ClientName").ToString + " <br/>" &
                '               " Quotation <b>" + Dt.Rows(0)("QuotationNo").ToString + " </b> has been generated by <b>" + Dt.Rows(0)("EstimateBy").ToString + "</b> .<br/><br/>" &
                '               " Please review the quotation and provide internal approval. <br/>" &
                '               " I am available to answer any questions and provide any clarification you may need. <br/>" &
                '               " If there are likely to be any delays or holdups, let me know. I'll do everything I can to help " &
                '               " accelerate the process.<br/>" &
                '               " Thank You <br/>" &
                '               " " + GBLUserName + ""

                '    db.SendEmail(Subject, Body, ToMail)

                'End If

            End If

            Return "Save"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateSendForApprovalPO(ByVal BKID As String, ByVal flag As Integer, ByVal SendTo As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            str = "Update ServicePoMain Set IsSentForApproval=" & flag & ",ApprovalSentTo=" & SendTo & ",ApprovalSentDate = GETDATE() Where CompanyId = " & GBLCompanyID & " And POID In (" & BKID & ")"
            db.ExecuteNonSQLQuery(str)
            Return "Save"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Sendmail() As String
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim ToMail = "sandeep.indusanalytics@gmail.com" 'db.GetColumnValue("EmailID", "UserMaster", "  companyID=" & GBLCompanyID & " and UserId=" & GBLUserID)

        '' Sending Notification Bty Mail To User(SendTo)
        Dim Subject = "Need Internal Approval on Quotation No"

        If ToMail = "" Then
            Return "Save"
        End If
        Dim Body = "Dear Sir/ mam,<br/><br/>" &
                   " Greetings For the day!<br/><br/>" &
                   " Need internal approval on Quotation No. <b></b><br/>" &
                   " <b>Job detail mention below :- </b><br/><br/>" &
                   " Thank You <br/>"


        Return db.SendEmails(ToMail, "Sandeep")
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteQuotation(ByVal BKId As Integer) As String
        Dim KeyField As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            If db.IsDeletable("BookingId", "JobApprovedCost", "Where BookingId = " & BKId & " And CompanyID = " & GBLCompanyID & " ") = False Then
                KeyField = "false"
                Return KeyField
                Exit Function
            End If
            If db.IsDeletable("BookingId", "JobOrderBookingDetails", "Where BookingId = " & BKId & " And CompanyID = " & GBLCompanyID & " ") = False Then
                KeyField = "false"
                Return KeyField
                Exit Function
            End If

            Dim con As New SqlConnection
            Dim cmd = New SqlCommand()
            con = db.OpenDataBase()
            If con.State = ConnectionState.Closed Then
                con.Open()
            End If
            Dim trans As SqlTransaction = con.BeginTransaction()
            Try
                cmd.Transaction = trans
                str = "Update JobBooking Set IsDeletedTransaction=1, DeletedDate = getdate(), DeletedBy = " & GBLUserID & " where BookingId = '" & BKId & "' And CompanyID = " & GBLCompanyID & " "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()
                str = "Update JobBookingProcess Set IsDeletedTransaction=1,DeletedDate=getdate(),DeletedBy=" & GBLUserID & " Where BookingId = '" & BKId & "' And CompanyID = " & GBLCompanyID & "  "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()
                str = "Update JobBookingContents Set SheetLayout='',UpsLayout='',IsDeletedTransaction=1,DeletedDate=getdate(),DeletedBy=" & GBLUserID & " where BookingId = '" & BKId & "'  And CompanyID = " & GBLCompanyID & "  "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()
                str = "Update JobBookingCostings Set IsDeletedTransaction=1,DeletedDate=getdate(),DeletedBy=" & GBLUserID & " where BookingId = '" & BKId & "'  And CompanyID = " & GBLCompanyID & "  "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()
                str = "Update JobBookingContentBookForms Set IsDeletedTransaction=1,DeletedDate=getdate(),DeletedBy=" & GBLUserID & " where BookingId = '" & BKId & "'  And CompanyID = " & GBLCompanyID & "  "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()
                str = "Update JobBookingAttachments Set IsDeletedTransaction=1,DeletedDate=getdate(),DeletedBy=" & GBLUserID & " where BookingId = '" & BKId & "'  And CompanyID = " & GBLCompanyID & "  "
                cmd = New SqlCommand(str, con, trans)
                cmd.CommandType = CommandType.Text
                cmd.ExecuteNonQuery()

                trans.Commit()
                con.Close()
                KeyField = "Success"

            Catch ex As Exception
                trans.Rollback()
                KeyField = ex.Message
            End Try
        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    ''---------------------------- Select Box Currency ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSbCurrency() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT CurrencyID, Nullif(Replace(CurrencyName,'""',''),'') As CurrencyName, CurrencyCode, CurrencySymbol, ConversionValue, INRValue FROM CurrencyMaster Order By CurrencyName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return "500"
        End Try
    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class

    Sub SeperatePaperSize(ByVal SizeWL As String, ByRef SizeL As Double, ByRef SizeH As Double)
        On Error Resume Next
        Dim xPosition As Long
        xPosition = InStr(1, SizeWL, "x", vbTextCompare)
        SizeH = Val(Mid(SizeWL, 1, xPosition - 1))
        SizeL = Val(Mid(SizeWL, xPosition + 1, Len(SizeWL)))
    End Sub

    ''---------------------------- Load Shipper List ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadShippersList(ByVal BKID As Integer, ByVal PlanQty As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            '            str = "SELECT Distinct JobQuantity,EstimatedQuantity As TotalShipperQtyReq, ItemID As ShipperID,Convert(nvarchar(30),SizeL, 106) +'x'+Convert(nvarchar(30),SizeW, 106) +'x'+Convert(nvarchar(30),SizeH, 106)  As ShipperName,Isnull(SizeL,0) As ShipperLength, Isnull(SizeW,0) As ShipperWidth,Isnull(SizeH,0) As ShipperHeight, EstimatedRate As ShipperRate, EstimatedCost,Isnull(EmptyCartonWt,0) As ShipperWeight,Isnull(Capacity,0) As ShipperCapacityWeight,'SHIPPER CARTON' As ItemGroupName,ItemGroupID,Isnull(CBM,0) As CBM,Isnull(CBF,0) As CBF,PackX As ShipperX,PackY As ShipperY,PackZ As ShipperZ,NoOfPly,QtyPerShipper As QtyInShipper,PerBoxWt,TotalWt From JobBookingMaterialCost Where BookingID=" & BKID & " And CompanyID =" & GBLCompanyID
            str = "SELECT Distinct EstimatedQuantity As TotalShipperQtyReq, ItemID As ShipperID,Convert(nvarchar(30),SizeL, 106) +'x'+Convert(nvarchar(30),SizeW, 106) +'x'+Convert(nvarchar(30),SizeH, 106)  As ShipperName,Isnull(SizeL,0) As SizeL, Isnull(SizeW,0) As SizeW,Isnull(SizeH,0) As SizeH, Isnull(EmptyCartonWt,0) As EmptyCartonWt,Isnull(Capacity,0) As Capacity,'SHIPPER CARTON' As ItemGroupName,ItemGroupID,Isnull(CBM,0) As CBM,Isnull(CBF,0) As CBF,PackX ,PackY ,PackZ ,NoOfPly,QtyPerShipper ,EstimatedRate As ShipperRate,EstimatedCost As ShipperCost,ShippingRate,ShippingCost,TotalWtOfAllShippers,ShipperWeightPerPack,ProductLength ,ProductWidth ,ProductHeight ,ProductWt From JobBookingMaterialCost Where BookingID=" & BKID & " And JobQuantity= " & PlanQty & " And Isnull(IsDeletedTransaction,0)<>1 And CompanyID =" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return "500"
        End Try
    End Function

    ''---------------------------- Load Containers List ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadContainersList(ByVal BKID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT JBMC.ContainerID, JBMC.BoxInLength AS CountL, JBMC.BoxInWidth AS CountW, JBMC.BoxInHeight AS CountH, JBMC.TotalCarton, JBMC.TotalContainers, JBMC.TotalCBF AS CBM, JBMC.TotalCBM AS CBF, JBMC.TotalContainerWt AS TotalWt, JBMC.BoxDirection AS Direction, CM.LengthMM, CM.WidthMM, CM.HeightMM, CM.LengthFT, CM.WidthFT, CM.HeightFT, CM.MaxWeight, CM.ContainerName FROM JobBookingMaterialCost AS JBMC INNER JOIN ContainerMaster AS CM ON JBMC.ContainerID = CM.ContainerID AND JBMC.CompanyID = CM.CompanyID WHERE (JBMC.BookingID = " & BKID & " ) And Isnull(JBMC.IsDeletedTransaction,0)<>1 And JBMC.CompanyID =" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return "500"
        End Try
    End Function
    ''---------------------------- Load Shipper List ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadShippersID(ByVal ShipperName As String) As Double
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Isnull(ItemID,0) As ItemID From ItemMaster Where ItemName Like '%" & ShipperName & "%' And ItemGroupID=7 And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dataTable, str)
            If dataTable.Rows.Count > 0 Then
                Return dataTable.Rows(0)(0)
            End If
            Return 0
        Catch ex As Exception
            Return "Error"
        End Try
    End Function

    ''---------------------------- Get Coating Machines------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCoatingMachines(ByVal coating As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct nullif(MM.MachineID,'') As MachineID, nullif(MM.MachineName,'') As MachineName From MachineMaster As MM Where MM.CompanyID=" & GBLCompanyID & " And MM.MachineId In (Select Distinct MachineID From MachineOnlineCoatingRates Where CoatingName='" & coating & "' And CompanyID=" & GBLCompanyID & " ) And Isnull(MM.IsDeletedTransaction,0)<>1 Order By MachineName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Function LoadCategoryWiseContents(ByVal CID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct CM.ContentCaption As PlanContName,CM.ContentName As PlanContentType From CategoryContentAllocationMaster As CAM Inner Join ContentMaster As CM On CM.ContentID=CAM.ContentID And CM.CompanyID=CAM.CompanyID Where CAM.CategoryID='" & CID & "' And CAM.CompanyID=" & GBLCompanyID & " And Isnull(CAM.IsDeletedTransaction,0)<>1"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '--------------- Get Requisition and purchase order Comment Data---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCommentData(ByVal BookingID As String, ByVal PriceApprovalID As String, ByVal OrderBookingIDs As String, ByVal ProductMasterID As String, ByVal JobBookingID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        If BookingID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Estimation',0,0,0,'" & BookingID & "',0,0,0,0"
        ElseIf PriceApprovalID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Price Approval',0,0,0,0,'" & PriceApprovalID & "',0,0,0"
        ElseIf OrderBookingIDs <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Sales Order Booking',0,0,0,0,0,'" & OrderBookingIDs & "',0,0"
        ElseIf ProductMasterID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Product Catalog',0,0,0,0,0,0,'" & ProductMasterID & "',0"
        ElseIf JobBookingID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Production Work Order',0,0,0,0,0,0'" & JobBookingID & "'"
        End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Save Comment Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCommentData(ByVal jsonObjectCommentDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName, GBLFYear As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim con As New SqlConnection
            con = db.OpenDataBase()

            TableName = "CommentChainMaster"
            AddColName = ""
            AddColValue = ""
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"
            db.InsertDatatableToDatabase(jsonObjectCommentDetail, TableName, AddColName, AddColValue)

            con.Close()
            KeyField = "Success"
            '  End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobSizeTemplate() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT Distinct JobSizeTemplateName, JobHeight, JobLength, JobWidth, OverlapFlap, BottomFlap, OpenFlap, TongueHeight, Pages, Ups, Leaves FROM JobSizeTemplate"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadItemStockDetails(ByVal ItmID As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT ItemCode, ItemDescription, PhysicalStock, BookedStock, AllocatedStock, IncomingStock, FloorStock, UnapprovedStock, IndentStock, RequisitionStock FROM ItemMaster Where CompanyID=" & GBLCompanyID & " And ItemID =" & ItmID & " And Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    Public Function GetMailQuoteData(ByVal JobBKID As Integer) As String
        Try
            Dim DTQuotes, DTQty As New DataTable

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct JEJ.PlanContName, JE.BookingID, JE.JobName, JE.FinalCost, JE.BookingRemark, JE.Remark, JE.ClientName, JE.ConcernPerson, Case When Isnull(JE.HeaderText,'')='' Then Isnull(UM.HeaderText,'') Else JE.HeaderText End As HeaderText, Case When Isnull(JE.FooterText,'')='' Then Isnull(UM.FooterText,'') Else JE.FooterText End As FooterText, JE.ProductCode, JE.ReworkRemark, JE.ReasonsofQuote, JE.ConversionValue, Case When Isnull(JE.MailingName,'')='' Then LM.LedgerName Else JE.MailingName End As MailingName,Case When Isnull(JE.MailingAddress,'')='' Then LM.MailingAddress Else JE.MailingAddress End As MailingAddress, JE.EmailSubject, JE.ProcessContentRemarks, UM.UserName,UM.Designation, JE.BookingNo, JE.OrderQuantity, Case When Isnull(JE.EmailBody,'')='' Then Isnull(UM.EmailMessage,'') Else JE.EmailBody End As EmailBody, JE.IsMailSent, JE.RemarkInternalApproval, JE.RemarkInternalApproved, JE.CurrencySymbol, JE.CurrencyName, JE.EmailTo,  Stuff((Select ', '+P.DisplayProcessName + Case When Isnull(S.RateFactor,'')='' Then '' Else '(' + S.RateFactor + ')' End From ProcessMaster As P Inner Join JobBookingProcess As S On S.BookingID=JEJ.BookingID And S.ContentsID=JEJ.JobContentsID And P.ProcessID=S.ProcessID And S.CompanyID=JEJ.CompanyID Order By S.SequenceNo For XML PATH('')),1,1,'') As ProcessDetail " &
                  " From JobBooking As JE INNER Join JobBookingContents AS JEJ on JEJ.BookingID = JE.BookingID  And JEJ.CompanyID=JE.CompanyID And Isnull(JE.IsDeletedTransaction,0)=0 Inner Join UserMaster As UM On JE.QuotedByUserID=UM.UserID And JE.CompanyID=UM.CompanyID And Isnull(UM.IsBlocked,0)=0 INNER JOIN LedgerMaster As LM On JE.LedgerID=LM.LedgerID And JE.CompanyID=LM.CompanyID And Isnull(LM.IsDeletedTransaction,0)=0 LEFT Join JobBookingProcess As JEO On JEO.ContentsID=JEJ.JobContentsID And JEJ.CompanyID=JEO.CompanyID Where JE.CompanyID=" & GBLCompanyID & " And JE.BookingID =" & JobBKID & " And Isnull(JE.IsDeletedTransaction,0)<>1"
            db.FillDataTable(DTQuotes, str)

            str = "SELECT PlanContQty, QuotedCost AS FinalCost FROM JobBookingCostings Where CompanyID=" & GBLCompanyID & " And BookingID =" & JobBKID & " And Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(DTQty, str)

            DTQuotes.TableName = "TblQuotes"
            DTQty.TableName = "TblQuoteQties"

            Dim Dataset As New DataSet

            Dataset.Merge(DTQuotes)
            Dataset.Merge(DTQty)

            data.Message = db.ConvertDataSetsTojSonString(Dataset)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    Public Function UpdateMailQuoteData(ByVal ObjData As Object) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = db.UpdateDatatableToDatabase(ObjData, "JobBooking", "", 1, " CompanyID=" & GBLCompanyID)
            If str <> "Success" Then
                Return "Error:500," & str
            End If
        Catch ex As Exception
            Return ex.Message
        End Try
        Return "Success"
    End Function

    '----------------------------------------------------------------------Delete Image From Folder Pradeep Yadav 09 Dec 2019------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteQuoteAttachedFiles(ByVal fileUpload As Object) As String
        Dim Key_Field As String

        Try
            If fileUpload <> "" Then
                Dim completePath As String
                completePath = Server.MapPath(fileUpload)
                If System.IO.File.Exists(completePath) Then
                    System.IO.File.Delete(completePath)
                End If
            End If

            Key_Field = "Success"
        Catch ex As Exception
            Key_Field = "Fail " & ex.Message
        End Try
        Return Key_Field
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBookingdashboarddata(ByVal FilterSTR As String) As String
        Try
            If FilterSTR = "All" Then FilterSTR = ""
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LId = db.GetColumnValue("EmployeeId", "UserMaster", "UserId = " & GBLUserID)
            Dim Designation = db.GetColumnValue("Designation", "LedgerMaster", " LedgerGroupID =3 And Isnull(IsDeletedTransaction,0) = 0 And LedgerId = " & LId)

            Dim ConStr = ""



            If Designation.ToUpper() = "SALES CORDINATOR" Then
                ConStr = " And PQ.SalesCordinatorId = " & LId
            ElseIf Designation.ToUpper() = "SALES EXECUTIVE" Then
                ConStr = " And PQ.SalesPersonID = " & LId
            ElseIf Designation.ToUpper() = "SALES MANAGER" Then
                ConStr = " And PQ.SalesManagerId = " & LId
            End If

            FilterSTR = FilterSTR + ConStr

            Dim DT As New DataTable
            str = "Select PQ.EnquiryID, Isnull(PQ.IsSendForInternalApproval,0) as IsSendInternalApproval,Isnull(PQ.IsSendForPriceApproval,0) as IsSendForPriceApproval,Isnull(PQ.IsRework,0) as IsSendRework,Isnull(PQ.IsInternalApproved,0) as IsInternalApproved,Isnull(PQ.Isapproved,0) as IsPriceApproved,Isnull(PQ.IsCancelled,0) as IsCancelled, Isnull(EQ.EnquiryNo,'') as EnquiryNo,Isnull(UMA.UserName,'') as ApprovalSendTo, PQ.ApprovalSendTo,Isnull(convert(varchar,PQ.ApprovalSendDate,106),'') as ApprovalSendDate, PQ.EstimateNo as QuotationNo,convert(varchar, PQ.CreatedDate, 103) As CreatedDate,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,LMSM.LedgerName as SalesManager,LMSC.LedgerName as SalesCordinator,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark, PQ.ProductEstimateID,Isnull(convert(varchar,PQ.CancelledDate,106),'') as CancelledDate,PQ.CancelledRemark,Isnull(convert(varchar,PQ.ApprovedDate,106),'') as ApprovedDate,PQ.ApprovedRemark,Isnull(convert(varchar,PQ.ReworkDate,106),'') as ReworkDate,PQ.ReworkRemark,PQ.RemarkInternalApproved,Isnull(convert(varchar,PQ.InternalApprovedDate,106),'') as InternalApprovedDate from ProductQuotation as PQ inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID  and LMS.LedgerGroupID =3 inner Join LedgerMaster as LMSC on LMSC.CompanyID = PQ.CompanyID and LMSC.LedgerID = PQ.SalesCordinatorId and LMSC.LedgerGroupID =3 inner Join LedgerMaster as LMSM on LMSM.CompanyID = PQ.CompanyID and LMSM.LedgerID = PQ.SalesManagerId  and LMSM.LedgerGroupID = 3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy left join UserMaster as UMA on UMA.CompanyID = PQ.CompanyID and PQ.ApprovalSendTo = UMA.UserID inner join EnquiryMain as EQ on EQ.EnquiryID = PQ.EnquiryID and EQ.CompanyID = PQ.CompanyID  inner JOIN (Select Max(RevisionNo) as RevisionNo, EnquiryID,CompanyID From ProductQuotation Group By EnquiryID,CompanyID) as Q ON Q.EnquiryID = PQ.EnquiryID AND Q.RevisionNo = PQ.RevisionNo AND Q.CompanyID = EQ.CompanyID   where PQ.CompanyID =" & GBLCompanyID & " and PQ.IsDeletedTransaction = 0 " & FilterSTR & "  order by PQ.CreatedDate desc"
            db.FillDataTable(dataTable, str)
            str = "Select PQC.ProductName as ProductName1, PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID   where  PQC.IsDeletedTransaction = 0 and PQC.CompanyID = " & GBLCompanyID
            db.FillDataTable(DT, str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    '' Send Quote Mail
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SubmitMail(ByVal msg As MailMessage) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim DtUser As New DataTable
            db.FillDataTable(DtUser, "SELECT Distinct IsnuLL(Nullif(EmailID,''),smtpUserName) As smtpUserID,  Isnull(smtpUserPassword,'') As smtpUserPassword,  Isnull(smtpServer,'smtp.gmail.com') As smtpServer,  Isnull(smtpServerPort,'587') As smtpServerPort,  Isnull(smtpAuthenticate,'True') As smtpAuthenticate,  Isnull(smtpUseSSL,'True') As smtpUseSSL FROM UserMaster Where Isnull(IsBlocked,0)=0 And IsnuLL(IsHidden,0)=0 And ISNULL(IsDeletedUser,0)=0 And CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID)
            If DtUser.Rows.Count <= 0 Then Return "Invalid user details"
            If DtUser.Rows(0)("smtpUserID") = "" Or DtUser.Rows(0)("smtpUserID").contains("@") = False Then
                Return "Invalid sender mail id, Please update mail id in user master"
            End If

            Dim smtp As New SmtpClient()

            smtp.Credentials = New NetworkCredential(DtUser.Rows(0)("smtpUserID").ToString(), DtUser.Rows(0)("smtpUserPassword").ToString())
            smtp.Port = DtUser.Rows(0)("smtpServerPort").ToString() '25 '  587 '
            smtp.Host = DtUser.Rows(0)("smtpServer").ToString() ' "relay-hosting.secureserver.net" ' "smtp.gmail.com" '
            smtp.EnableSsl = DtUser.Rows(0)("smtpUseSSL").ToString() 'False
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network
            smtp.UseDefaultCredentials = False

            smtp.Send(msg)
        Catch ex As Exception
            Return ex.Message
        End Try
        Return "Email Send Successfully"
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadKeyline(ByVal ObjData As Object) As String
        Try
            Dim constring = "Data Source = 13.232.228.188,1232;Initial Catalog=Indus;Persist Security Info=True;User ID=INDUS;Password=@3ZfO&#$313IU#!"

            Dim KeyLine = db.InsertKeylineDatatableToDatabase(ObjData, "Indus_Company_Keyline_For_Web_Module", "", "", constring)
            Return db.Modu(KeyLine, "key")
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
    End Function

End Class