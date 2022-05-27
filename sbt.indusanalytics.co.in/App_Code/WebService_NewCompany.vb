Imports System.Data
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services
Imports System.Web.Services
Imports Connection

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_NewCompany
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    '---------------Open Master code---------------------------------
    '-----------------------------------Get Fyear------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCurrencySymbol() As String
        Try
            Context.Response.Clear()
            Context.Response.ContentType = "application/json"

            str = "Select distinct nullif(CurrencySymbol,'') as CurrencySymbol from CompanyMaster"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    '-----------------------------------Get Fyear------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFyear() As String
        Try
            Context.Response.Clear()
            Context.Response.ContentType = "application/json"

            str = "Select distinct nullif(Fyear,'') as Fyear from CompanyMaster"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Country------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCountry() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select distinct nullif(Country,'') as Country from CompanyMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllPara() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select distinct nullif(Country,'') as Country,nullif(State,'') as State,nullif(City,'') as City,nullif(Pincode,'') as Pincode from CompanyMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCompany() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct CompanyID, CompanyName,nullif(Address1,'') as Address1,MobileNO As ContactNO,nullif(FAX,'') as FAX,nullif(Email,'') as Email,nullif(Website,'') as Website,nullif(Country,'') as Country,nullif(State,'') as State,nullif(City,'') as City,nullif(Pincode,'') as Pincode,nullif(PAN,'') as PAN,nullif(CINNo,'') as CINNo,nullif(GSTIN,'') as GSTIN,nullif(ProductionUnitName,'') as ProductionUnitName,Nullif(ImportExportCode,'') As ImportExportCode,Nullif(PictureQuotationPath,'') As PictureQuotationPath From CompanyMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCompanyProfile(ByVal objCompany_Entry As Object) As String

        Dim KeyField As String
        Dim TableName As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Dim UserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        Try
            If (UserName.ToUpper() <> "INDUS") Then Return "You are not authorized to save..!, Can't Save"
            If db.CheckAuthories("CompanyMaster.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!, Can't Save"

            TableName = "CompanyMaster"
            'KeyField = db.InsertDatatableToDatabase(objCompany_Entry, TableName, "", "")
            'If IsNumeric(KeyField) = False Then
            '    Return KeyField
            'End If
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatCompanyData(ByVal objCompany_Entry As Object) As String

        Dim KeyField As String
        Dim TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            If db.CheckAuthories("CompanyMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to edit..!, Can't Update"

            TableName = "CompanyMaster"
            db.UpdateDatatableToDatabase(objCompany_Entry, TableName, "", 1, "")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function
    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class