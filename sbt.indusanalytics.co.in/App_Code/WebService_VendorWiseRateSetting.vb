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
Public Class WebService_VendorWiseRateSetting
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLUserName As String
    Dim VendorID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String
    Dim UserName As String

    <WebMethod()>
    <ScriptMethod()>
    Public Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
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

    '---------------Open Master code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function VendorName() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And LedgerID=" & VendorID)

        str = "Select Distinct LedgerID,LedgerName From LedgerMaster Where Isnull(IsDeletedTransaction,0)=0 And LedgerGroupID =(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=25 And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0) And CompanyID=" & GBLCompanyID & VendorID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Vendor Charges Type---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function VendorChargesType() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And VendorID=" & VendorID)

        str = "Select Distinct ChargesID,TypeOfCharges As RateType,Nullif(CalculationFormula,'') As CalculationFormula From TypeOfCharges Where Isnull(TypeOfCharges,'')<>'' And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0" & VendorID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Get All Process---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllProcess() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select ProcessID,ProcessName,nullif(StartUnit,'') as StartUnit,nullif(UnitConversion,'') as UnitConversion,nullif(EndUnit,'') as EndUnit,  " &
                "isnull(Rate,0) as Rate,nullif(TypeofCharges,'') as RateType from ProcessMaster Where CompanyID=" & GBLCompanyID & " and isnull(IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Get All Exist Process VendorWise---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllExistProcessVendorWise(ByVal SMID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select PM.ProcessID,PM.ProcessName,nullif(VWPR.RateFactor,'') as RateFactor,nullif(PM.StartUnit,'') as StartUnit,nullif(PM.UnitConversion,'') as UnitConversion,nullif(PM.EndUnit,'') as EndUnit,  " &
              " Isnull(VWPR.Rate,0) as Rate,nullif(VWPR.RateType,'') As RateType ,VWPR.MinimumCharges" &
              " From VendorWiseProcessRates VWPR inner join ProcessMaster PM on VWPR.ProcessID=PM.ProcessID And VWPR.CompanyID=PM.CompanyID  " &
              " Where VWPR.CompanyID=" & GBLCompanyID & " and isnull(VWPR.IsDeletedTransaction,0)<>1 and VWPR.LedgerID=" & SMID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveVendorRatesetting(ByVal jsonObjectsRateRecord As Object, ByVal VendorID As String) As String

        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            db.ExecuteNonSQLQuery("Delete From VendorWiseProcessRates WHERE CompanyID=" & GBLCompanyID & " And LedgerID=" & VendorID)

            TableName = "VendorWiseProcessRates"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy"
            AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID
            KeyField = db.InsertDatatableToDatabase(jsonObjectsRateRecord, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = True Then
                KeyField = "Success"
            End If
        Catch ex As Exception
            KeyField = "Error.." & ex.Message
        End Try
        Return KeyField

    End Function
    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class