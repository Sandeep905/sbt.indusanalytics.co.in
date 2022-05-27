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
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class WebServiceCountryStateMaster
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String
    Dim GBLUserID As String
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

    '---------------Open UserMaster code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CountryStateMasterFunction() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select DISTINCT  isnull(CountryStateID,0) as CountryStateID, nullif(Country,'') as Country, nullif(State,'') as State, nullif(City,'') as City, nullif(StateTinNo,'') as StateTinNo, nullif(StateCode,'') as StateCode,Nullif(CountryCode,'') As CountryCode from  CountryStateMaster Where Isnull(IsDeletedTransaction,0)=0"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    ''----------------------------Save CountryStateMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCountryStateMasterFunction(ByVal TextCountry As String, ByVal TextState As String, ByVal TextCity As String, ByVal TextStateTinNo As String, ByVal TextStateCode As String, ByVal TextCountryCode As String) As String

        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Dim KeyField As String

        Try
            str = "INSERT INTO CountryStateMaster (Country, State, City, StateTinNo, StateCode,CountryCode,CompanyID,UserID,FYear,CreatedBy,CreatedDate,ModifiedDate,ModifiedBy) VALUES('" & TextCountry & "', '" & TextState & "' , '" & TextCity & "' , '" & TextStateTinNo & "' , '" & TextStateCode & "','" & TextCountryCode & "', '" & GBLCompanyID & "', '" & GBLUserID & "', '" & GBLFYear & "', '" & GBLUserID & "', '" & DateTime.Now & "', '" & DateTime.Now & "', '" & GBLUserID & "')"
            db.ExecuteNonSQLQuery(str)
            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '---------------Close Master code---------------------------------
    '---------------To open Get Country List-----------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function toGetCountryList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct nullif(Country,'') as Country from CountryStateMaster Where Isnull(Country,'')<>'' And CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '---------------To close  Country List-----------------------
    '---------------To open Get State List-----------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function toGetStateList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct nullif(State,'') as State from CountryStateMaster Where Isnull(State,'')<>'' And CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '---------------To close  Country List-----------------------
    '---------------To open Get City List-----------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function toGetCityList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct City from CountryStateMaster Where Isnull(City,'')<>'' And CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '---------------To close  Country List-----------------------
    '---------------To Delete the data Open--------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function deleteCountryStateMasterData(ByVal getTextCountryStateId As String) As String
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update CountryStateMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "', IsDeletedTransaction=1 WHERE CountryStateId='" & getTextCountryStateId & "' and CompanyID='" & GBLCompanyID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function
    ''----------------------------Open CountryStateMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateCountryStateMasterFunction(ByVal TextCountryStateId As String, ByVal TextCountry As String, ByVal TextState As String, ByVal TextCity As String, ByVal TextStateTinNo As String, ByVal TextStateCode As String, ByVal TextCountryCode As String) As String
        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            str = "Update CountryStateMaster Set ModifiedDate='" & DateTime.Now & "',ModifiedBy='" & GBLUserID & "',FYear='" & GBLFYear & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',Country='" & TextCountry & "', State='" & TextState & "', City='" & TextCity & "', StateTinNo='" & TextStateTinNo & "', StateCode='" & TextStateCode & "',CountryCode='" & TextCountryCode & "' WHERE  CountryStateId='" & TextCountryStateId & "' and CompanyID='" & GBLCompanyID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '///''''' Port Master Start////'''

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetStateCode() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct StateCode,StateCode From CountryStateMaster Where Isnull(StateCode,'')<>'' And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPortMasters() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct PortID,StateCode,PortCode,PortName From PortMaster Where CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveUpdatePortMaster(ByVal PortID As Integer, ByVal ObjPort As Object) As String
        Dim dt As New DataTable
        Dim KeyField As String
        Dim TableName, AddColName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            TableName = "PortMaster"
            If PortID = 0 Then
                If db.CheckAuthories("PortMaster.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!"

                AddColName = "CreatedDate,UserID,CompanyID,CreatedBy"
                AddColValue = "Getdate()," & GBLUserID & "," & GBLCompanyID & "," & GBLUserID
                KeyField = db.InsertDatatableToDatabase(ObjPort, TableName, AddColName, AddColValue)

                If IsNumeric(KeyField) = False Then
                    Return "Error in saving data: " & KeyField
                Else
                    Return "Saved"
                End If

            Else
                If db.CheckAuthories("PortMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to update..!"
                KeyField = db.UpdateDatatableToDatabase(ObjPort, TableName, " ModifiedDate='" & DateTime.Now & "',ModifiedBy=" & GBLUserID, 0, " CompanyId=" & GBLCompanyID & " And PortID=" & PortID)
                If KeyField <> "Success" Then
                    Return "Error in updating data: " & KeyField
                Else
                    Return "Updated"
                End If
            End If

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class