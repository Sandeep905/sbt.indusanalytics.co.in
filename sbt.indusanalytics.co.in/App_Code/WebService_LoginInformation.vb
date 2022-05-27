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
Public Class WebService_LoginInformation
    Inherits System.Web.Services.WebService

    Dim CompanyId As String
    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim GBLUserName As String
    Dim Str As String

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

    ''---------------------------- Start Code ------------------------------------------ Pradeep Yadav 09 Dec 2019

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllUser() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Str = "Select distinct Isnull(UserID,0) AS UserID,Nullif(UserName,'') AS UserName from UserMaster  Where  CompanyID='" & CompanyId & "' And isnull(IsDeletedUser,0)=0"

            db.FillDataTable(dataTable, Str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllMachine() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Str = "Select Distinct MachineID,MachineName From UserLoginInfo Where CompanyID=" & CompanyId

            db.FillDataTable(dataTable, Str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllForms() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Str = "Select Distinct ModuleID,ModuleDisplayName From ModuleMaster Where CompanyID=" & CompanyId & " And Isnull(ModuleDisplayName,'')<>'' And IsDeletedTransaction=0"

            db.FillDataTable(dataTable, Str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetLoginInfo(ByVal DateFrom As String, ByVal DateTo As String, ByVal ShowAll As String, ByVal UserID As String, ByVal MachineID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            Dim str_date1 As String = ""
            If (ShowAll = False Or ShowAll = "False") Then
                str_date1 = "and Cast(Floor(Cast(UL.LoginTime as float)) AS Datetime) >=  '" & DateFrom & "' and  Cast(Floor(Cast(UL.LoginTime as float)) AS Datetime) <=  '" & DateTo & "'" 'Added by Pradeep Yadav 17-04-2018
            Else
                str_date1 = ""
            End If
            If MachineID <> "" Then
                MachineID = " And UL.MachineID In(" & MachineID & ")"
            End If
            If UserID <> "" Then
                UserID = " And UL.UserID In(" & UserID & ")"
            End If
            Str = "Select Isnull(UM.UserID,0) AS UserID,Nullif(UM.UserName,'') AS UserName,Isnull(UL.MachineID,0) AS MachineID,Nullif(UL.MachineName,'') AS MachineName,  " &
                   " Replace(Convert(Varchar(30),UL.LoginTime,120),' ','-') AS LoginTime,Replace(Convert(Varchar(30),UL.LogOutTime,120),' ','-') AS LogOutTime  " &
                   " From UserMaster AS UM Inner JOIN UserLoginInfo as UL on UM.UserID=UL.UserID And UM.CompanyID=UL.CompanyID " &
                   " Where UM.CompanyID=" & CompanyId & UserID & MachineID & str_date1 & " And UM.IsDeletedUser=0"

            db.FillDataTable(dataTable, Str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllRecord(ByVal DateFrom As String, ByVal DateTo As String, ByVal ShowAll As String, ByVal UserID As String, ByVal ModuleID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))

            Dim str_date1 As String = ""
            If (ShowAll = False) Then
                str_date1 = " And Cast(Floor(Cast(UTL.CreatedDate as float)) AS Datetime) >=  '" & DateFrom & "' and  Cast(Floor(Cast(UTL.CreatedDate as float)) AS Datetime) <=  '" & DateTo & "'" 'Added by Pradeep Yadav 17-04-2018
            Else
                str_date1 = ""
            End If
            If ModuleID <> "" Then
                ModuleID = " And MM.ModuleID in(" & ModuleID & ")"
            End If
            If UserID <> "" Then
                UserID = " And UM.UserID In(" & UserID & ")"
            End If
            Str = "Select Isnull(MM.ModuleID,0) AS ModuleID,Nullif(MM.ModuleDisplayName,'') AS ModuleDisplayName,  " &
                  " Nullif(MM.ModuleHeadName,'') AS ModuleHeadName,Isnull(UM.UserID,0) AS UserID,Nullif(UM.UserName,'') AS UserName,  " &
                  " Nullif(UTL.Details,'') AS Details,Replace(Convert(Varchar(30),UTL.CreatedDate,106),' ','-') AS CreatedDate,Replace(Convert(Varchar(30),UTL.CreatedDate,120),' ','-') AS CreatedTime  " &
                  " From ModuleMaster as MM Inner JOIN UserTransactionLogs as UTL on MM.ModuleID=UTL.ModuleID And MM.CompanyID=UTL.CompanyID  " &
                  " Inner JOIN UserMaster AS UM on UM.UserID=UTL.UserID and UM.CompanyID=UTL.CompanyID  " &
                  " Where UM.CompanyID=" & CompanyId & UserID & ModuleID & str_date1 & " and isnull(UM.IsDeletedUser,0)<>1"

            db.FillDataTable(dataTable, Str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    ''---------------------------- Close Code  ------------------------------------------ Pradeep Yadav 09 Dec 2019

    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class