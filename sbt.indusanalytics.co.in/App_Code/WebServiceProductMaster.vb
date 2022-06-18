Imports System.Data
Imports System.IO
Imports System.Web
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports Connection

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebServiceProductMaster
    Inherits System.Web.Services.WebService

    ReadOnly db As New DBConnection
    ReadOnly js As New JavaScriptSerializer()
    ReadOnly data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    ReadOnly GBLUserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
    ReadOnly GBLCompanyID As String = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    ReadOnly GBLFYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductCode() As String
        Dim MaxVoucherNo As Long
        Dim KeyField As String

        Dim prefix As String = "PCM"
        Try

            Return db.GeneratePrefixedNo("ProductCatalogMaster", prefix, "MaxProductCode", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID)
        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProductMaster(ByVal TxtPOID As Integer) As String

        Dim KeyField As String
        Dim dtExist As New DataTable

        'GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        'GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("ProductMaster.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete..!"

        str = "Select BookingID From JobBooking Where CompanyID=" & GBLCompanyID & " And ProductCatalogID=" & TxtPOID & " And IsDeletedTransaction = 0"
        db.FillDataTable(dtExist, str)
        If dtExist.Rows.Count > 0 Then
            Return "This product is used in another process..! Record can't be delete..."
        End If

        Try

            str = "Update ProductCatalogMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " And ProductCatalogID=" & TxtPOID
            str += ";Update ProductVendorWiseRateSetting Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & TxtPOID
            str += ";Update ProductConfigurationMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & TxtPOID
            KeyField = db.ExecuteNonSQLQuery(str)

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductMasterData(ByVal ObjMain As Object, ByVal ObjProductConfig As Object, ByVal ObjVendorRate As Object) As String

        Dim dt As New DataTable
        Dim KeyField, ProductCatalogID As String
        Dim AddColName, AddColValue, TableName As String

        Try
            If (db.CheckAuthories("ProductMaster.aspx", GBLUserID, GBLCompanyID, "CanSave", ObjMain(0)("ProductName")) = False) Then Return "You are not authorized to save..!, Can't Save"

            Dim dtExist As New DataTable
            db.FillDataTable(dtExist, "Select Distinct ProductName From ProductCatalogMaster Where CompanyID=" & GBLCompanyID & " And ProductName= '" & ObjMain(0)("ProductName") & "' And IsDeletedTransaction=0")
            If dtExist.Rows.Count > 0 Then
                Return "Product name already exist, please check the product first.."
            End If

            TableName = "ProductCatalogMaster"
            AddColName = "CreatedDate,CompanyID,CreatedBy"
            AddColValue = "Getdate()," & GBLCompanyID & "," & GBLUserID
            ProductCatalogID = db.InsertDatatableToDatabase(ObjMain, TableName, AddColName, AddColValue)

            If IsNumeric(ProductCatalogID) = False Then
                Return "Error in main :- " & ProductCatalogID
            End If
            TableName = "ProductConfigurationMaster"
            AddColName = "CreatedDate,CompanyID,CreatedBy,ProductCatalogID"
            AddColValue = "Getdate()," & GBLCompanyID & ",,'" & GBLUserID & "'," & ProductCatalogID
            KeyField = db.InsertDatatableToDatabase(ObjProductConfig, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                db.ExecuteNonSQLQuery("Delete from ProductCatalogMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                db.ExecuteNonSQLQuery("Delete from ProductConfigurationMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                Return "Error in product config :- " & KeyField
            End If

            TableName = "ProductVendorWiseRateSetting"
            KeyField = db.InsertDatatableToDatabase(ObjVendorRate, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                db.ExecuteNonSQLQuery("Delete from ProductCatalogMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                db.ExecuteNonSQLQuery("Delete from ProductConfigurationMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                db.ExecuteNonSQLQuery("Delete from ProductVendorWiseRateSetting WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                Return "Error in vendor rates :- " & KeyField
            End If
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    Public Function UploadProductImageFile() As String
        Dim httpPostedFile = HttpContext.Current.Request.Files("UserAttchedFiles")
        Try

            If httpPostedFile IsNot Nothing Then
                ' Get the complete file path
                Dim fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("/Files/ProductFiles/"), httpPostedFile.FileName)

                Dim fi As New FileInfo(fileSavePath)
                If (fi.Exists) Then    'if file exists, delete it
                    fi.Delete()
                End If
                ' Save the uploaded file to "ProductFiles" folder
                httpPostedFile.SaveAs(fileSavePath)
            End If
            Return "Success"

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
End Class