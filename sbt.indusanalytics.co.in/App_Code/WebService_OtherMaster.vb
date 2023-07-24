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
Public Class WebService_OtherMaster
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
        Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()
        serializer.MaxJsonLength = 2147483647
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

    '---------------Internal Approval Users---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function InternalApprovalUsers() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct A.UserID,A.UserName From UserMaster As A Inner Join UserModuleAuthentication As B On A.UserID=B.UserID And A.CompanyID=B.CompanyID And B.ModuleName='InternalApproval.aspx' And B.CanSave=1 Where A.CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedUser,0)<>1  Order By A.UserName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open CategoryMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCategory() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct CategoryID ,nullif(BusinessCategory,'') as BusinessCategory,CategoryName,nullif(Orientation,'') as Orientation , nullif(ProcessIDString,'') as  ProcessIDString,nullif(ContentsIDString ,'') As ContentsIDString from CategoryMaster where CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1  order by CategoryID desc "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function EmployeeUser() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct LedgerID,LedgerName From LedgerMaster Where Isnull(IsDeletedTransaction,0)=0 and LedgerGroupId = 3 and CompanyID = " & GBLCompanyID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open CategoryMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCategoryData(ByVal CostingDataGroupMaster As Object, ByVal CategoryName As String, ByVal SelectBoxOrientation As String, ByVal CostingDataProcessAllocation As Object, ByVal CostingDataContentAllocation As Object) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, AddColValue, TableName, CategoryID As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Try

            Dim dtExist As New DataTable

            str2 = "Select distinct nullif(CategoryName,'') as CategoryName " &
                "From CategoryMaster where CompanyID=" & GBLCompanyID & " and CategoryName= '" & CategoryName & "' And isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else
                TableName = "CategoryMaster"
                AddColName = ""
                AddColValue = ""
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ""
                CategoryID = db.InsertDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, AddColValue)

                TableName = "ProcessContentAllocationMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,CategoryID "
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & "," & CategoryID & ""
                db.InsertDatatableToDatabase(CostingDataContentAllocation, TableName, AddColName, AddColValue)

                TableName = "CategoryWiseProcessAllocation"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,CategoryID"
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ",'" & CategoryID & "'"
                db.InsertDatatableToDatabase(CostingDataProcessAllocation, TableName, AddColName, AddColValue)

                KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open CategoryMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatCategoryData(ByVal CostingDataGroupMaster As Object, ByVal TxtCategoryID As String, ByVal CostingDataProcessAllocation As Object, ByVal CostingDataContentAllocation As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        Try

            TableName = "CategoryMaster"
            AddColName = "ModifiedDate=GETDATE(),UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy=" & GBLUserID & ""
            wherecndtn = "CompanyID=" & GBLCompanyID & " And CategoryID=" & TxtCategoryID & " "
            db.UpdateDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, 0, wherecndtn)

            If CostingDataContentAllocation.length > 0 Then
                Dim ContentID = CostingDataContentAllocation(0)("ContentID")
                db.ExecuteNonSQLQuery("Delete from CategoryContentAllocationMaster WHERE CompanyID=" & GBLCompanyID & " and CategoryID='" & TxtCategoryID & "' And ContentID=" & ContentID)
                TableName = "CategoryContentAllocationMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,CategoryID"
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & "," & TxtCategoryID & ""
                db.InsertDatatableToDatabase(CostingDataContentAllocation, TableName, AddColName, AddColValue)

                db.ExecuteNonSQLQuery("Delete from CategoryWiseProcessAllocation WHERE CompanyID=" & GBLCompanyID & " and CategoryID='" & TxtCategoryID & "' And ContentID=" & ContentID & "")
                TableName = "CategoryWiseProcessAllocation"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,CategoryID"
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ",'" & TxtCategoryID & "'"
                db.InsertDatatableToDatabase(CostingDataProcessAllocation, TableName, AddColName, AddColValue)
            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open CategoryMaster Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteCategoryMasterData(ByVal TxtCategoryID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            str = "Update CategoryMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=GETDATE(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and CategoryID='" & TxtCategoryID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    Function GetContentWiseProcess(ByVal ContID As Integer, ByVal CategoryID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select ProcessID,IsDefaultProcess From CategoryWiseProcessAllocation Where CategoryID=" & CategoryID & " And ContentID=" & ContID & " And CompanyID=" & GBLCompanyID & " And ISNULL(IsDeletedTransaction,0)=0"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    Function GetBusinessCategory() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct BusinessCategory From CategoryMaster Where BusinessCategory <> ''  And CompanyID=" & GBLCompanyID & " And ISNULL(IsDeletedTransaction,0)=0"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '===================================Close Category Master===================

    '===================================Open Department master============================
    '---------------Open CategoryMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDepartment() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct DepartmentID,DepartmentName,Press,nullif(SequenceNo,'') as SequenceNo from DepartmentMaster where CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1  order by DepartmentID desc "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open DepartmentMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveDepartmentData(ByVal CostingDataGroupMaster As Object, ByVal DepartmentName As String, ByVal SelectBoxPress As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim dtExist As New DataTable

            str2 = "Select Distinct DepartmentName From DepartmentMaster Where CompanyID=" & GBLCompanyID & " And DepartmentName= '" & DepartmentName & "' And isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Department name already exist!"
            Else
                Dim dt1 As New DataTable
                Dim MaxDepartmentID As Integer
                str2 = "Select isnull(max(DepartmentID),0) + 1 As DepartmentID From DepartmentMaster Where  CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1"
                db.FillDataTable(dt1, str2)
                Dim i As Integer = dt1.Rows.Count
                If i > 0 Then
                    MaxDepartmentID = dt1.Rows(0)(0)
                End If

                TableName = "DepartmentMaster"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,DepartmentID"
                AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & MaxDepartmentID
                db.InsertDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, AddColValue)

                KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open DepartmentMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatDepartmentData(ByVal CostingDataGroupMaster As Object, ByVal TxtDepartmentID As String) As String

        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            TableName = "DepartmentMaster"
            AddColName = "ModifiedDate=GETDATE(),UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy=" & GBLUserID
            wherecndtn = "CompanyID=" & GBLCompanyID & " And DepartmentID=" & TxtDepartmentID
            KeyField = db.UpdateDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, 0, wherecndtn)

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open DepartmentMaster Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteDepartmentMasterData(ByVal TxtDepartmentID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update DepartmentMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=GETDATE(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " And DepartmentID=" & TxtDepartmentID
            KeyField = db.ExecuteNonSQLQuery(str)
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '=====================================Close Department master==================================

    '---------------Open UserMaster GetCountry code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCountry() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct nullif(Country,'') as Country from CountryStateMaster Where Isnull(Country,'')<>''"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open UserMaster GetState code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetState() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct nullif(State,'') as State From CountryStateMaster Where Isnull(State,'')<>''"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open UserMaster GetCity code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCity() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct nullif(City,'') as City from CountryStateMaster Where Isnull(City,'')<>''"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetUser() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim VendorID As String = Convert.ToString(HttpContext.Current.Session("VendorID"))
        If VendorID <> "" Or Val(VendorID) > 0 Then VendorID = "And VendorID=" & VendorID
        str = ""
        Dim IsUserCreate As String = db.GetColumnValue("Isnull(IsCreateUser,'False')", "UserMaster", " CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID & " And Isnull(IsBlocked,0)=0 And Isnull(IsDeletedUser,0)=0")
        If IsUserCreate = False Or IsUserCreate = "False" Then
            str = " And UserID=" & GBLUserID
        End If
        str = "Select isnull(IsBlocked,0) IsBlocked, EmployeeId, UserID,UserName,Password,ContactNo,UnderUserID,nullif(Designation,'') as Designation,nullif(EmailID,'') as EmailID,nullif(Country,'') as Country,nullif(State,'') as State,nullif(City,'') as City,nullif(smtpUserName,'') as smtpUserName,nullif(smtpUserPassword,'') as smtpUserPassword,nullif(smtpServer,'') as smtpServer,nullif(smtpServerPort,'') as smtpServerPort,nullif(smtpAuthenticate,'') as smtpAuthenticate,nullif(smtpUseSSL,'') as smtpUseSSL,nullif(Details,'') as Details,IsCreateUser,IsExtraPaperIssue,IsUserCannotViewCostingDetail,IsHidden,IsAdmin,ISChooseAnotherPaper,IsEditableProductionDate,nullif(ProfilePicHref,'') as ProfilePicHref,nullif(SignPicHref,'') as SignPicHref,Nullif(UserWiseOperatorsIDStr,'') As UserWiseOperatorsIDStr,Nullif(EmailMessage,'') As EmailMessage,Nullif(HeaderText,'') As HeaderText,Nullif(FooterText,'') As FooterText from UserMaster Where CompanyID=" & GBLCompanyID & str & " And IsDeletedUser=0 " & VendorID & " Order By UserID desc "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UnderUser() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct nullif(UserID,'') as UserID,nullif(UserName,'') as UserName from UserMaster where CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedUser,0)<>1  order by UserID desc "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UserOperatorsList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "Select Distinct LM.LedgerID,LM.LedgerName From LedgerMaster AS LM Inner Join EmployeeMachineAllocation As EMA On EMA.LedgerID=LM.LedgerID And EMA.CompanyID=LM.CompanyID  And Isnull(LM.IsDeletedTransaction,0)=0 Where LM.CompanyID=" & GBLCompanyID & " Order By LedgerName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '------------------------------Open ShowData---------------------------------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function showData(ByVal ID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        Try

            str = "Select MM.SetGroupIndex,MM.ModuleID,MM.ModuleHeadDisplayOrder, MM.ModuleHeadName,MM.ModuleName,MM.ModuleDisplayName ,MA.CanView,MA.CanSave,MA.CanEdit,MA.CanDelete,  " &
                   " MA.CanPrint,MA.CanExport,(Select count(Distinct(SetGroupIndex)) from ModuleMaster) as SectionCount From ModuleMaster As MM Left Join UserModuleAuthentication As MA On MA.ModuleID=MM.ModuleID And MM.CompanyID=MA.CompanyID And MA.UserID='" & ID & "' Where MM.CompanyID=" & GBLCompanyID & ""

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '------------------------------Open ShowData---------------------------------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridColumnDynamic(ByVal ID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Try
            str = "Select ModuleID,nullif(GridName,'') as GridName,GridColumnIndexNo, " &
                    " nullif(GridColumnDatafieldName,'') as GridColumnDatafieldName,GridColumnWidth,nullif(GridColumnCaption,'') as GridColumnCaption,nullif(ColumnString,'') as ColumnString,nullif(ColumnVisibe,'') as ColumnVisibe " &
                    " ,nullif(ColumnDataType,'') as ColumnDataType,ColumnGroupIndex,nullif(ColummnFormat,'') as ColummnFormat" &
                    " From UserModuleGridLayout Where UserID = " & ID & " And CompanyID =" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UserDesignation() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct nullif(Designation,'') as Designation From UserMaster Where CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedUser,0)=0 "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open UserMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveUserData(ByVal CostingDataUserMaster As Object, ByVal OperatorAllocation As Object) As String

        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("EditProfile.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save user profile..!"

        Try

            TableName = "UserMaster"
            AddColName = "LastModiDate,CreationDate,CompanyID,FYear,CreatedBy"
            AddColValue = "GETDATE(),GETDATE()," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID
            str = db.InsertDatatableToDatabase(CostingDataUserMaster, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                Return "Error in main: " & str
            End If

            TableName = "UserOperatorAllocation"
            AddColName = "CreatedDate,CompanyID,FYear,CreatedBy,UserID"
            AddColValue = "GETDATE()," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & str
            KeyField = db.InsertDatatableToDatabase(OperatorAllocation, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                db.ExecuteNonSQLQuery("Delete From UserMaster Where UserID=" & str & " And CompanyID=" & GBLCompanyID)
                db.ExecuteNonSQLQuery("Delete From UserOperatorAllocation Where UserID=" & str & " And CompanyID=" & GBLCompanyID)
                Return "Error in operator allocation: " & KeyField
            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open DepartmentMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatUserMasterData(ByVal CostingDataUserMaster As Object, ByVal TxtUserid As String, ByVal folderimgdel As String, ByVal OperatorAllocation As Object) As String ', ByVal ReasionDes As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("EditProfile.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then
            Return "You are not authorized to edit user profile..!"
        End If

        Try

            If folderimgdel <> "" Then
                If folderimgdel <> "StringBlank" Then
                    Dim completePath As String
                    completePath = Server.MapPath(folderimgdel)
                    If System.IO.File.Exists(completePath) Then
                        System.IO.File.Delete(completePath)
                    End If
                End If
            End If

            TableName = "UserMaster"
            AddColName = "LastModiDate=GETDATE(),CompanyID=" & GBLCompanyID & ",ModifiedBy=" & GBLUserID & ""
            wherecndtn = "CompanyID=" & GBLCompanyID & " And UserID=" & TxtUserid & " "
            db.UpdateDatatableToDatabase(CostingDataUserMaster, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete From UserOperatorAllocation Where " & wherecndtn)
            TableName = "UserOperatorAllocation"
            AddColName = "ModifiedDate,CreatedDate,CompanyID,FYear,CreatedBy,UserID,ModifiedBy"
            Dim AddColValue = "GETDATE(),GETDATE()," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & ",'" & TxtUserid & "','" & TxtUserid & "'"
            db.InsertDatatableToDatabase(OperatorAllocation, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open UserMaster Delete Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteUserMasterData(ByVal Userid As String) As String
        Dim KeyField As String
        Dim Dt As New DataTable()

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("EditProfile.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then
            Return "You are not authorized to delete user profile..!"
        End If

        Try
            str = "SELECT A.TABLE_NAME FROM INFORMATION_SCHEMA.TABLES as A Inner Join INFORMATION_SCHEMA.columns As B on A.Table_Name=B.Table_Name WHERE A.TABLE_TYPE='BASE TABLE' and B.Column_Name='CreatedBy' And B.Table_Name Not In ('UserMaster')"
            db.FillDataTable(dataTable, str)
            For index = 0 To dataTable.Rows.Count
                str = "Select Count(CreatedBy) From " & dataTable.Rows(0)(0) & " Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & " And CreatedBy=" & Userid
                db.FillDataTable(Dt, str)
                If Dt.Rows(0)(0) <= 0 Then
                    Return "Error: This user name has been used in some transactions ,please delete transactions first"
                End If
            Next

            str = "Update UserMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=GETDATE(),IsDeletedUser=1 WHERE CompanyID=" & GBLCompanyID & " and UserID='" & Userid & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField
    End Function


    ''----------------------------Open UserMaster Change Password Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePasswordData(ByVal TxtUserid As String, ByVal NewPassword As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("EditProfile.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then
            Return "You are not authorized to edit user password..!"
        End If

        Try

            str = "Update UserMaster Set ModifiedBy=" & GBLUserID & ",Password='" & db.ChangePassword(NewPassword) & "',LastModiDate=GETDATE() WHERE CompanyID=" & GBLCompanyID & " And UserID='" & TxtUserid & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '========================================Open Create Dynamic Menu By Pradeep Yadav====================
    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CreateDynamicMenu() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select MM.ModuleHeadName,(Select Count(ModuleHeadName) from ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0) as NumberOfChild  " &
                ",(Select Top 1 nullif(ModuleName,'')  From ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0) as ModuleName,isnull(MM.SetGroupIndex,0) as SetGroupIndex " &
                "From UserModuleAuthentication as UMA Inner Join ModuleMaster as MM on UMA.ModuleID=MM.ModuleID And UMA.CompanyID=MM.CompanyID And MM.IsDeletedTransaction=0 And MM.IsLocked=0 Where UMA.UserID=" & GBLUserID & " and UMA.CompanyID=" & GBLCompanyID & "  and Isnull(UMA.CanView,0)=1 And Isnull(MM.IsDeletedTransaction,0)=0 group by MM.ModuleHeadName,MM.SetGroupIndex,MM.CompanyID Order By SetGroupIndex"
        'str = "SELECT NULLIF (MM.ModuleHeadName, '') AS ModuleHeadName, MM.ModuleDisplayOrder, (SELECT COUNT(ModuleHeadName) AS ModuleHeadName FROM ModuleMaster WHERE (ModuleHeadName = MM.ModuleHeadName)) AS NumberOfChild, (SELECT TOP (1) NULLIF (ModuleName, '') AS ModuleName FROM ModuleMaster WHERE (ModuleHeadName = MM.ModuleHeadName)) AS ModuleName, ISNULL(MM.SetGroupIndex, 0) AS SetGroupIndex " &
        '        "FROM UserModuleAuthentication AS UMA INNER JOIN ModuleMaster AS MM ON UMA.ModuleID = MM.ModuleID  WHERE (UMA.UserID = " & GBLUserID & ") AND (UMA.CompanyID = " & GBLCompanyID & ") AND (ISNULL(UMA.CanView, 0) = 1) GROUP BY MM.ModuleHeadName, MM.SetGroupIndex, MM.ModuleDisplayOrder ORDER BY MM.SetGroupIndex,MM.ModuleDisplayOrder"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CreateDynamicSubMenu() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = " Select MM.ModuleHeadName,nullif(MM.ModuleDisplayName,'') as ModuleDisplayName,isnull(MM.SetGroupIndex,0) as SetGroupIndex,(Select Count(ModuleHeadName) From ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0) as NumberOfChild,MM.ModuleName ,MM.ModuleDisplayOrder " &
               "  From UserModuleAuthentication As UMA Inner Join ModuleMaster As MM On UMA.ModuleID=MM.ModuleID And UMA.CompanyID=MM.CompanyID And MM.IsDeletedTransaction=0 And MM.IsLocked=0 " &
               "  Where UMA.CompanyID=" & GBLCompanyID & " AND UMA.UserID=" & GBLUserID & " AND Isnull(UMA.CanView,0)=1 And Isnull(MM.IsDeletedTransaction,0)=0 " &
               "  Group by MM.ModuleHeadName,MM.SetGroupIndex,MM.ModuleName,MM.ModuleDisplayName,MM.ModuleDisplayOrder,MM.CompanyID " &
               "  HAVING (select Count(ModuleHeadName) from ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0)>1  Order By SetGroupIndex,MM.ModuleDisplayOrder"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CreateDynamicMenuWithSubMenu() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = " Select Distinct MM.ModuleHeadName,MM.ModuleDisplayName,MM.SetGroupIndex,(Select Count(ModuleHeadName) From ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0) as NumberOfChild,MM.ModuleName ,MM.ModuleDisplayOrder " &
               "  From UserModuleAuthentication As UMA Inner Join ModuleMaster As MM On UMA.ModuleID=MM.ModuleID And UMA.CompanyID=MM.CompanyID And MM.IsDeletedTransaction=0 And MM.IsLocked=0 " &
               "  Where UMA.CompanyID=" & GBLCompanyID & " AND UMA.UserID=" & GBLUserID & " AND Isnull(UMA.CanView,0)=1 And Isnull(MM.IsDeletedTransaction,0)=0 And Isnull(MM.ModuleDisplayName,'')<>''" &
               "  Group by MM.ModuleHeadName,MM.SetGroupIndex,MM.ModuleName,MM.ModuleDisplayName,MM.ModuleDisplayOrder,MM.CompanyID " &
               "  HAVING (select Count(ModuleHeadName) from ModuleMaster where ModuleHeadName=MM.ModuleHeadName And CompanyID=MM.CompanyID And IsDeletedTransaction=0)>0 Order By SetGroupIndex,MM.ModuleDisplayOrder"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetQuoteWiseQuantity(ByVal BKID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct PlanContQty,BookingID From JobBookingCostings Where IsDeletedTransaction=0 And BookingID IN(" & BKID & ") And CompanyID=" & GBLCompanyID
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SendForJobCardFromQuote(ByVal BKID As Integer, ByVal JCQty As Long, ByVal flg As Integer) As String
        Dim Key As String
        Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim CompanyID As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim MaxSalesOrderNo As Long
        Dim BookingNo As String
        Dim SalesOrderID As Integer

        Try

            If CompanyID = "" Or UserID = "" Or UserID = 0 Then Return "Session Expired"
            Dim TableName, AddColName, AddColValue As String
            Dim NewOrderBook, NewOrderBookDetails As New DataTable
            Dim Prefix As String = "COM"

            If flg = 0 Then
                If db.IsDeletable("JobBookingNo", "JobBookingJobCard", "Where JobBookingID =" & BKID & " And CompanyID=" & CompanyID) = False Then
                    Return "Transaction can't be delete, it is used in further transactions"
                End If
                SalesOrderID = db.GetColumnValue("OrderBookingID", "JobOrderBooking", " BookingID=" & BKID & " And CompanyID=" & CompanyID)
                Key = SalesOrderBookingDelete(SalesOrderID, False)
                Return Key
            End If

            BookingNo = db.GeneratePrefixedNo("JobOrderBooking", Prefix, "MaxSalesOrderNo", MaxSalesOrderNo, FYear, " Where IsDeletedTransaction=0 And BookingPrefix='" & Prefix & "' And CompanyID=" & CompanyID & " And FYear='" & FYear & "'")

            db.FillDataTable(NewOrderBook, "SELECT Distinct Getdate() As OrderBookingDate, LedgerID, JBC.TotalAmount FROM JobBooking As JB Inner Join JobBookingContents AS JBC On JB.BookingID=JBC.BookingID And JB.CompanyID=JBC.CompanyID Where JB.CompanyID=" & CompanyID & " And JB.BookingID IN(" & BKID & ") And JBC.PlanContQty=" & JCQty & "")

            TableName = "JobOrderBooking"
            AddColName = "BookingPrefix,UserID,FYear,CompanyID,MaxSalesOrderNo,SalesOrderNo"
            AddColValue = "'" & Prefix & "'," & UserID & ",'" & FYear & "'," & CompanyID & "," & MaxSalesOrderNo & ",'" & BookingNo & "'"
            SalesOrderID = db.InsertDatatableToDatabase(NewOrderBook, TableName, AddColName, AddColValue)

            If IsNumeric(SalesOrderID) = True And SalesOrderID > 0 Then
                str = "SELECT Distinct JB.BookingID, JB.BookingID AS NewBookingID, GETDATE() AS OrderBookingDate, JB.LedgerID, JB.JobName, JB.CategoryID, JB.OrderQuantity, JB.OrderQuantity AS ApproveQuantity, JB.FinalCost, JB.FinalCost AS Rate, " &
                        " JB.FinalCost AS ChangeCost, JB.TypeOfCost AS RateType, JB.DeliveryDate, JB.ProductCode, 'NEW' AS JobType, 'HIGH' AS JobPriority, JB.BookingNo, '' AS ProductMasterCode, '' AS ApprovalNo, GETDATE()  " &
                        " + JB.ExpectedCompletionDays AS ExpectedDeliveryDate, JB.SalesEmployeeID, JB.SalesEmployeeID AS JobCoordinatorID, JB.ConsigneeID, JB.ProductHSNID,JBC.TotalAmount As BasicAmount, JBC.TotalAmount,  " &
                        " PHM.CGSTTaxPercentage,JBC.TotalAmount*PHM.CGSTTaxPercentage As CGSTTaxAmount, PHM.SGSTTaxPercentage,JBC.TotalAmount*PHM.SGSTTaxPercentage As SGSTTaxAmount, PHM.IGSTTaxPercentage,JBC.TotalAmount*PHM.IGSTTaxPercentage As IGSTTaxAmount, " &
                        " (Case When TypeOfCost='UnitCost' Then PlanContQty Else PlanContQty/1000 End *FinalCost)+(JBC.TotalAmount*PHM.CGSTTaxPercentage)+(JBC.TotalAmount*PHM.SGSTTaxPercentage)+(JBC.TotalAmount*PHM.IGSTTaxPercentage) As NetAmount, JBC.SequenceNo As TransID " &
                        " FROM JobBooking AS JB INNER JOIN " &
                        " JobBookingContents AS JBC ON JB.BookingID = JBC.BookingID AND JB.CompanyID = JBC.CompanyID LEFT JOIN " &
                        " ProductHSNMaster AS PHM ON PHM.ProductHSNID = JB.ProductHSNID AND PHM.CompanyID = JB.CompanyID " &
                        " Where JB.CompanyID=" & CompanyID & " And JB.BookingID IN(" & BKID & ") And JBC.PlanContQty=" & JCQty & ""
                db.FillDataTable(NewOrderBookDetails, str)

                TableName = "JobOrderBookingDetails"
                AddColName = "BookingPrefix,UserID,FYear,CompanyID,MaxSalesOrderNo,SalesOrderNo,OrderBookingID"
                AddColValue = "'" & Prefix & "','" & UserID & "','" & FYear & "','" & CompanyID & "'," & MaxSalesOrderNo & ",'" & BookingNo & "'," & SalesOrderID & ""
                Key = db.InsertDatatableToDatabase(NewOrderBookDetails, TableName, AddColName, AddColValue)

                If IsNumeric(Key) = False Then
                    SalesOrderBookingDelete(SalesOrderID, True)
                    Return Key
                End If

                db.ExecuteNonSQLQuery("Update JobBooking Set IsInternalApproved=1 Where BookingID IN (" & BKID & ")")
                Key = "Success"
            Else
                Return SalesOrderID
            End If
            Return Key
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
        Return SalesOrderID
    End Function

    Private Function SalesOrderBookingDelete(ByVal SalesOrderID As String, ByVal HardDelete As String) As String
        Dim Key As String
        Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))

        If HardDelete = True Then
            Key = db.ExecuteNonSQLQuery("Delete from JobOrderBooking WHERE OrderBookingID ='" & SalesOrderID & "' And CompanyID=" & CompanyId)
            If (Key = "Success") Then
                Key = db.ExecuteNonSQLQuery("Delete from JobOrderBookingDetails WHERE OrderBookingID ='" & SalesOrderID & "' And CompanyID=" & CompanyId)
            End If
        Else
            Key = db.ExecuteNonSQLQuery("Update JobOrderBooking Set IsDeletedTransaction=1,DeletedDate=GETDATE() And DeletedBy=" & UserID & " WHERE OrderBookingID =" & SalesOrderID & " And CompanyID=" & CompanyId)
            If (Key = "Success") Then
                Key = db.ExecuteNonSQLQuery("Update JobOrderBookingDetails Set IsDeletedTransaction=1,DeletedDate=GETDATE() And DeletedBy=" & UserID & " WHERE OrderBookingID =" & SalesOrderID & " And CompanyID=" & CompanyId)
            End If
        End If

        Return Key
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckRights() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = " Select UMA.UserID,UMA.ModuleID,nullif(MM.ModuleName,'') as ModuleName,UMA.CanView ,UMA.CanSave,UMA.CanEdit,UMA.CanDelete,UMA.CanPrint,UMA.CanExport  " &
               "  From UserModuleAuthentication As UMA  inner join ModuleMaster As MM On UMA.ModuleID=MM.ModuleID inner join UserMaster as UM on UM.UserID=UMA.UserID     " &
               "  Where UM.IsDeletedUser=0 And UMA.CompanyID=" & GBLCompanyID & " AND UMA.UserID=" & GBLUserID & " AND Isnull(UMA.CanView,0)=1 "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '========================================Close Create Dynamic Menu By Pradeep Yadav====================

    '---------------Close Master code---------------------------------

    ''' <summary>
    ''' ''''Production Release
    ''' </summary>
    '''
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProductionReleaseList(ByVal type As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            If type = "For Release" Then
                str = "SELECT Distinct LM.LedgerName,JB.JobName,JB.JobBookingNo,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,JB.OrderQuantity,0 As IssueQuantity,J.BookingNo,JB.JobBookingID,Isnull(JBC.IsJobStarted,0) As IsJobStarted, UM.UserName,Replace(Convert(nvarchar(30),JBC.ReleasedDate ,106),'','-') As ReleasedDate , U.UserName As JCBY FROM JobBookingJobCard As JB INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID=JB.CompanyID INNER JOIN JobBooking As J ON J.BookingID=JB.JobBookingID And J.CompanyID=JB.CompanyID LEFT JOIN UserMaster as UM ON UM.UserID = JBC.ReleasedBy And JBC.CompanyID=UM.CompanyID LEFT JOIN UserMaster as U ON U.UserID = JB.CreatedBy And U.CompanyID=JB.CompanyID INNER JOIN LedgerMaster As LM ON LM.LedgerID=JB.LedgerID And LM.CompanyID=JB.CompanyID Where Isnull(JBC.IsRelease,0)=0 AND Isnull(JB.IsCancel,0)=0 And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & " Order by JB.JobBookingNo "
            Else
                str = "SELECT Distinct LM.LedgerName,JB.JobName,JB.JobBookingNo,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,JB.OrderQuantity,0 As IssueQuantity,J.BookingNo,JB.JobBookingID,Isnull(JBC.IsJobStarted,0) As IsJobStarted, UM.UserName,Replace(Convert(nvarchar(30),JBC.ReleasedDate ,106),'','-') As ReleasedDate , U.UserName As JCBY FROM JobBookingJobCard As JB INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID=JB.CompanyID INNER JOIN JobBooking As J ON J.BookingID=JB.JobBookingID And J.CompanyID=JB.CompanyID LEFT JOIN UserMaster as UM ON UM.UserID = JBC.ReleasedBy And JBC.CompanyID=UM.CompanyID LEFT JOIN UserMaster as U ON U.UserID = JB.CreatedBy And U.CompanyID=JB.CompanyID INNER JOIN LedgerMaster As LM ON LM.LedgerID=JB.LedgerID And LM.CompanyID=JB.CompanyID Where Isnull(JBC.IsRelease,0)=1 AND Isnull(JB.IsCancel,0)=0 And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & " Order by JB.JobBookingNo "
            End If

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProductionReleaseUpdate(ByVal type As String, ByVal BKID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            If type = "For Release" Then
                str = "Update JobBookingJobCardContents Set IsRelease=1 ,ReleasedBy=" & GBLUserID & ",ReleasedDate=Getdate() Where CompanyID=" & GBLCompanyID & " And JobBookingID In (" & BKID & ")"
            Else
                str = "Update JobBookingJobCardContents Set IsRelease=0 ,ReleasedBy=" & GBLUserID & ",ReleasedDate=Getdate() Where CompanyID=" & GBLCompanyID & " And JobBookingID In (" & BKID & ") And Isnull(IsJobStarted,0)=0"
            End If
            db.ExecuteNonSQLQuery(str)
            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProcessGrid() As String

        ' and DepartmentID='" & UnderGroupID & "' remove Pradeep
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select 0 IsDefaultProcess, nullif(ProcessID,'') As ProcessID, nullif(ProcessName,'') As ProcessName, nullif(TypeofCharges,'') As TypeofCharges from ProcessMaster Where CompanyID=" & GBLCompanyID & "" &
                "And Isnull(IsDeletedTransaction,0)<>1 Order By ProcessName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function




    '============================================Open Delivery Schedule===================================
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllScheduleList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            str = "select distinct isnull(LM.LedgerID,0) as LedgerID,nullif(LM.LedgerName,'') as LedgerName,nullif(JSRT.JobName,'') as JobName,nullif(JSRT.JobBookingNo,'') as JobBookingNo ,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,isnull(JSRT.ScheduleQty,0) as OrderQuantity,isnull(0,0) As IssueQuantity,  " &
                  " nullif(J.BookingNo,'') as BookingNo,isnull(JB.JobBookingID,0) as JobBookingID  " &
                  " ,Isnull(JBC.IsJobStarted,0) As IsJobStarted, nullif(UM.UserName,'') as UserName,Replace(Convert(nvarchar(30),JBC.ReleasedDate ,106),'','-') As ReleasedDate,  " &
                  " nullif(U.UserName,'')  As JCBY,Replace(Convert(nvarchar(30),JSRT.DeliveryDate ,106),'','-') As DeliveryDate  " &
                  " from JobScheduleReleaseTemp as JSRT inner join LedgerMaster As LM ON LM.LedgerID=JSRT.LedgerID And LM.CompanyID=JSRT.CompanyID   " &
                  " INNER JOIN JobBookingJobCard As JB ON JB.JobBookingID=JSRT.JobBookingID And JB.CompanyID=JSRT.CompanyID   " &
                  " INNER JOIN JobBooking As J ON J.BookingID=JSRT.JobBookingID And J.CompanyID=JSRT.CompanyID   " &
                  " INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JSRT.JobBookingID And JBC.CompanyID=JSRT.CompanyID   " &
                  " inner JOIN UserMaster as U ON U.UserID = JSRT.CreatedBy And U.CompanyID=JSRT.CompanyID   " &
                  " inner JOIN UserMaster as UM ON UM.UserID = JSRT.UserID And U.CompanyID=JSRT.CompanyID   " &
                  " where Isnull(JSRT.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & "  " &
                  " UNION  " &
                  " SELECT distinct isnull(LM.LedgerID,0) as LedgerID,nullif(LM.LedgerName,'') as LedgerName,nullif(JB.JobName,'') as JobName,nullif(JB.JobBookingNo,'') as JobBookingNo,Replace(Convert(nvarchar(30),JB.JobBookingDate ,106),'','-') As JobBookingDate,isnull(JB.OrderQuantity,0) as OrderQuantity,0 As IssueQuantity,  " &
                  " nullif(J.BookingNo,'') as BookingNo,isnull(JB.JobBookingID,0) as JobBookingID,Isnull(JBC.IsJobStarted,0) As IsJobStarted, nullif(UM.UserName,'') as UserName,Replace(Convert(nvarchar(30),JBC.ReleasedDate ,106),'','-') As ReleasedDate ,  " &
                  " nullif(U.UserName,'')  As JCBY,Replace(Convert(nvarchar(30),JB.DeliveryDate ,106),'','-') As DeliveryDate   " &
                  " FROM JobBookingJobCard As JB   " &
                  " INNER JOIN JobBookingJobCardContents As JBC ON JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID=JB.CompanyID   " &
                  " INNER JOIN JobBooking As J ON J.BookingID=JB.JobBookingID And J.CompanyID=JB.CompanyID   " &
                  " LEFT JOIN UserMaster as UM ON UM.UserID = JBC.ReleasedBy And JBC.CompanyID=UM.CompanyID   " &
                  " LEFT JOIN UserMaster as U ON U.UserID = JB.CreatedBy And U.CompanyID=JB.CompanyID   " &
                  " INNER JOIN LedgerMaster As LM ON LM.LedgerID=JB.LedgerID And LM.CompanyID=JB.CompanyID   " &
                  " Where Isnull(JBC.IsRelease,0)=0 AND Isnull(JB.IsCancel,0)=0 And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & GBLCompanyID & ""

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateDeliverySchedule(ByVal Obj_UpdateDate As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            str = ""
            str = "Delete from JobScheduleReleaseTemp WHERE CompanyID=" & GBLCompanyID & ""
            db.ExecuteNonSQLQuery(str)

            TableName = "JobScheduleReleaseTemp"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
            AddColValue = "GETDATE(),GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ""
            db.InsertDatatableToDatabase(Obj_UpdateDate, TableName, AddColName, AddColValue)

            'str = ""
            'str = "delete from JobScheduleReleaseTemp WHERE CompanyID=" & GBLCompanyID & ""
            'Dim cmd1 As New SqlCommand(str, con)
            'cmd1.CommandType = CommandType.Text
            'cmd1.Connection = con
            'cmd1.ExecuteNonQuery()

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '============================================Close Delivery Schedule===================================




    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class