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
Public Class WebService_DynamicMaster
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLCompanyID As String

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

    '---------------Open Master code---------------------------------
    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Master(ByVal masterID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = "SELECT  * FROM ItemGroupFieldMaster Where CompanyID = 1 and ItemGroupID='" & masterID & "' Order By ItemGroupFieldID "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = "SELECT  * FROM ItemGroupMaster Where CompanyID = " & GBLCompanyID & "  Order By ItemGroupID "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Dynamic SelectBoxLoad------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelectBoxLoad(ByVal Qery As String, ByVal selID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim dt As New DataTable()
        Dim i As Integer
        Dim QS, SI As String

        Dim ds As New DataSet()

        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim NewQuery As String() = Qery.Split("?")
            Dim NewSelID As String() = selID.Split("?")

            For i = 0 To NewQuery.Length
                dt = New DataTable()
                QS = NewQuery(i)
                SI = NewSelID(i)

                str = QS

                db.FillDataTable(dt, str)
                dt.NewRow()
                dt.Rows.Add(dt.Rows(0)(dt.Columns(0).ColumnName), SI)
                ds.Tables.Add(dt)
                ' data.Message = ConvertDataTableTojSonString(dt)
                'Context.Response.Clear()
                'Context.Response.Write(data.Message)

            Next
            Return js.Serialize(ds)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '<WebMethod(EnableSession:=True)>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Sub SelectBoxLoad(ByVal Qery As String, ByVal selID As String)
    '    Context.Response.Clear()
    '    Context.Response.ContentType = "application/json"
    '    Dim dt As New DataTable()
    '    Dim i As Integer
    '    Dim QS, SI As String
    '    Try
    '        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    '        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
    '        Dim NewQuery As String() = Qery.Split("?")
    '        Dim NewSelID As String() = selID.Split("?")

    '        For i = 0 To NewQuery.Length
    '            dt = New DataTable()
    '            QS = ""
    '            QS = NewQuery(i)
    '            SI = ""
    '            SI = NewSelID(i)

    '            str = ""
    '            str = QS
    '            db.FillDataTable(dt, str)
    '            dt.NewRow()
    '            dt.Rows.Add(dt.Rows(0)(dt.Columns(0).ColumnName), SI)
    '            data.Message = ConvertDataTableTojSonString(dt)
    '            Context.Response.Clear()
    '            Context.Response.Write(data.Message)

    '        Next
    '        ' Return js.Serialize(data.Message)

    '    Catch ex As Exception
    '        'Return ex.Message
    '    End Try

    'End Sub

    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class