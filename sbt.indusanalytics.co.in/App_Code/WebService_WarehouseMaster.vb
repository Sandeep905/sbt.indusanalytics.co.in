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
Public Class WebService_WarehouseMaster
    Inherits System.Web.Services.WebService


    Private ReadOnly DA As SqlDataAdapter
    ReadOnly db As New DBConnection
    ReadOnly IndexFormName As String
    ReadOnly k As String
    ReadOnly js As New JavaScriptSerializer()
    ReadOnly data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    <System.Web.Services.WebMethod(EnableSession:=True)>
    <ScriptMethod(UseHttpGet:=True, ResponseFormat:=ResponseFormat.Json)>
    Public Sub HelloWorld()

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        data.Message = ConvertDataTableTojSonString(GetDataTable)
        Context.Response.Write(js.Serialize(data.Message))
    End Sub

    <WebMethod()>
    <ScriptMethod()>
    Public Function GetDataTable() As DataTable

        If k = "client" Then
            str = " SELECT LedgerName as ClientName, MailingName,Address1,Address2,Address3,City,State,Country,Address,Phone,Fax,Email,PinCode,Website,PAN,ECC,CST,TIN,DeliveredQtyTolerence,ProfitPercentage,PaymentTerms,MinimumCreditLimit,UrgentCreditLimit,CriticalCreditLimit,LedgerID From LedgerMaster Where  UnderGroupID IN ( 28, 24)  Order By LedgerName "
        Else
            str = " Select  Top 10 RollId,RollCode,ItemCode,Quality,Width,MfgBy ,'F: ' + cast(isnull(GSMFacePaper,0) as nvarchar)+ ' ' + ' R: ' + cast(isnull(GSMReleasePaper,0) as nvarchar)  " &
                  " + ' ' + ' A: ' + cast(isnull(GSMAdhesive,0) as nvarchar) as GSM From RollMaster "
        End If

        db.FillDataTable(dataTable, str)
        Return dataTable
    End Function
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


    Public Function DataSetToJSONWithJavaScriptSerializer(ByVal dataset As DataSet) As String
        Dim jsSerializer As New JavaScriptSerializer()
        Dim ssvalue As New Dictionary(Of String, Object)()

        For Each table As DataTable In dataset.Tables
            Dim parentRow As New List(Of Dictionary(Of String, Object))()
            Dim childRow As Dictionary(Of String, Object)
            Dim tablename As String = table.TableName

            For Each row As DataRow In table.Rows
                childRow = New Dictionary(Of String, Object)()

                For Each col As DataColumn In table.Columns
                    childRow.Add(col.ColumnName, row(col))
                Next

                parentRow.Add(childRow)
            Next

            ssvalue.Add(tablename, parentRow)
        Next

        Return jsSerializer.Serialize(ssvalue)
    End Function

    '---------------Open Master code---------------------------------

    '-----------------------------------Get City List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCity() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select Distinct nullif(City,'') as City From CountryStateMaster Where Isnull(City,'')<>'' And CompanyID= " & GBLCompanyID & " And IsDeletedTransaction=0 "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------Open Warehouse  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveWarehouse(ByVal jsonObjectsSaveRecord As Object) As String
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            TableName = "WarehouseMaster"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy"
            AddColValue = "GETDATE(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "'," & GBLUserID
            KeyField = db.InsertDatatableToDatabase(jsonObjectsSaveRecord, TableName, AddColName, AddColValue)
            If IsNumeric(KeyField) Then KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open RTS  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateWarehouse(ByVal jsonObjectsSaveRecord As Object, ByVal jsonObjectsUpdateRecord As Object) As String
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If jsonObjectsUpdateRecord.length > 0 Then
                TableName = "WarehouseMaster"
                AddColName = "ModifiedDate=GETDATE(),ModifiedBy=" & GBLUserID
                wherecndtn = "CompanyID=" & GBLCompanyID & " "
                KeyField = db.UpdateDatatableToDatabase(jsonObjectsUpdateRecord, TableName, AddColName, 1, wherecndtn)
            End If

            If jsonObjectsSaveRecord.length > 0 Then
                TableName = "WarehouseMaster"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy"
                AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID
                KeyField = db.InsertDatatableToDatabase(jsonObjectsSaveRecord, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) Then KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Warehouse List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ShowListWarehouseMaster() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "select distinct nullif(WarehouseName,'') as WarehouseName, nullif(City,'') as City, nullif(Address,'') as Address,  " &
                    "nullif(CompanyID,0) As CompanyID, isnull(UserID,0) As UserID,isnull(IsDeleted,0) As IsDeleted,nullif(FYear,'') as FYear,  " &
                    "isnull(CreatedBy,0) as CreatedBy,isnull(ModifiedBy,0) as ModifiedBy,  " &
                    "replace(convert(nvarchar(30),ModifiedDate,106),'','-') as ModifiedDate,isnull(DeletedBy,0) as DeletedBy,  " &
                    "replace(convert(nvarchar(30),DeletedDate,106),'','-') as DeletedDate from WarehouseMaster where CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get SelectedRow List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelectBinName(ByVal WarehouseName As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "select isnull(WarehouseID,0) as WarehouseID,nullif(BinName,'') as BinName from WarehouseMaster where WarehouseName='" & WarehouseName & "' and CompanyID='" & GBLCompanyID & "' And  isnull(IsDeletedTransaction,0)<>1"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal GetRowWarehouseID As String) As String
        Dim KeyField As String
        Try
            Dim con As New SqlConnection
            con = db.OpenDataBase()

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            SxistStr = "Select top 1 isnull(WarehouseID,0) as WarehouseID From ItemTransactionDetail Where WarehouseID = '" & GetRowWarehouseID & "' And  isnull(IsDeletedTransaction,0)<>1 and CompanyID='" & GBLCompanyID & "'"
            db.FillDataTable(dtExist1, SxistStr)
            Dim F As Integer = dtExist1.Rows.Count
            If F > 0 Then
                KeyField = "Exist"
            Else
                str = ""
                str = "Update WarehouseMaster Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and WarehouseID = '" & GetRowWarehouseID & "'"

                Dim cmd As New SqlCommand(str, con)
                cmd.CommandType = CommandType.Text
                cmd.Connection = con
                cmd.ExecuteNonQuery()

                KeyField = "Success"
            End If

            con.Close()
            KeyField = KeyField

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