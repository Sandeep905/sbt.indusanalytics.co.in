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
Public Class WebService_ProductGroupMasterForGST
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


    '---------------Open Master code---------------------------------
    '-----------------------------------Get UnderGroup List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UnderGroup() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select DISTINCT ProductHSNName, ProductHSNID From ProductHSNMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " AND Isnull(ProductHSNName,'') <> '' AND ProductHSNName IS NOT NULL Order By ProductHSNName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get SelItemGroupName List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelItemGroupName() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select ItemGRoupID,ItemGroupName From ItemGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " Order By ItemGroupID"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get ProductGroupMAster Show List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Showlist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("ReportFYear"))

            str = "Select PHM.ProductHSNID,nullif(PHM.ProductHSNName,'') as ProductHSNName,nullif(PHM.HSNCode,'') as HSNCode,isnull(PHM.UnderProductHSNID,0) as UnderProductHSNID,  " &
                  "  isnull(PHM.CompanyID,'') as CompanyID,nullif(PHM.DisplayName,'') as DisplayName,nullif(PHM.TariffNo,'') as TariffNo,nullif(PHM.ProductCategory,'') as ProductCategory,isnull(PHM.GSTTaxPercentage,0) as GSTTaxPercentage,  " &
                  "  isnull(PHM.CGSTTaxPercentage, 0) As CGSTTaxPercentage,isnull(PHM.SGSTTaxPercentage,0) As SGSTTaxPercentage,isnull(PHM.IGSTTaxPercentage,0) As IGSTTaxPercentage,isnull(PHM.ItemGroupID,0) As ItemGroupID,isnull(UM.UserName,0) As CreatedBy,  " &
                  "  nullif(PHM.FYear,'') as FYear,REPLACE(CONVERT(nvarchar(30),PHM.CreatedDate,106),'','-') as CreatedDate  " &
                  "  From ProductHSNMaster As PHM left Join UserMaster As UM On PHM.CreatedBy=UM.UserID Where PHM.companyID = '" & GBLCompanyID & "' and isnull(PHM.IsDeletedTransaction,0)<>1 Order By PHM.ProductHSNID Desc"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function


    ''----------------------------Open ProductGroupMAster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavePGHMData(ByVal jsonObjectsRecordMain As Object, ByVal TxtGroupName As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim dtExist As New DataTable
            str2 = "Select Distinct ProductHSNName From ProductHSNMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And DisplayName= '" & TxtGroupName & "'"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else
                TableName = "ProductHSNMaster"
                AddColName = "CreatedDate, UserID, CompanyID, FYear, CreatedBy"
                AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)
            End If
            If IsNumeric(KeyField) = True Then
                KeyField = "Success"
            End If
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open ProductGroupMAster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePGHM(ByVal ID As String, ByVal jsonObjectsRecordMain As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "ProductHSNMaster"
            AddColName = "ModifiedDate=Getdate(),ModifiedBy=" & GBLUserID
            wherecndtn = "CompanyID=" & GBLCompanyID & " And ProductHSNID='" & ID & "' "
            KeyField = db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 0, wherecndtn)
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open Issue Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePGHM(ByVal TxtPGMID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            str = "Update ProductHSNMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1 WHERE CompanyID='" & GBLCompanyID & "' and ProductHSNID='" & TxtPGMID & "'"
            KeyField = db.ExecuteNonSQLQuery(str)

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