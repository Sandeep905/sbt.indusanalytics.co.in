Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports Connection
Imports Newtonsoft.Json


' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_Master
    Inherits System.Web.Services.WebService

    Private DA As SqlDataAdapter
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
        Dim jsSerializer As JavaScriptSerializer = New JavaScriptSerializer()
        Dim ssvalue As Dictionary(Of String, Object) = New Dictionary(Of String, Object)()
        jsSerializer.MaxJsonLength = 2147483647

        For Each table As DataTable In dataset.Tables
            Dim parentRow As List(Of Dictionary(Of String, Object)) = New List(Of Dictionary(Of String, Object))()
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

    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "SELECT  ItemGroupID, ItemGroupName FROM ItemGroupMaster Where CompanyID = " & GBLCompanyID & " And isnull(IsDeletedTransaction,0)<>1  Order By ItemGroupID "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGrid(ByVal masterID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim str2, Qery As String
        Dim dt As New DataTable
        js.MaxJsonLength = 2147483647

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        str2 = "Select nullif(SelectQuery,'') as SelectQuery From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " and ItemGroupID='" & masterID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dt, str2)
        Dim i As Integer = dt.Rows.Count
        If i > 0 Then
            If IsDBNull(dt.Rows(0)(0)) = True Then
                Return ""
            Else
                Qery = dt.Rows(0)(0)
            End If
            Try
                If Qery.ToUpper().Contains("EXECUTE") Then
                    str = Qery & " '' " & "," & GBLCompanyID & "," & masterID
                Else
                    str = Qery
                End If
                db.FillDataTable(dataTable, str)
                data.Message = ConvertDataTableTojSonString(dataTable)
            Catch ex As Exception
                Return ex.Message
            End Try

        End If
        Return js.Serialize(data.Message)

    End Function


    ''************************ Logic Convert Object To DataTable *** Using Newtonsoft *******************************
    Public Function ConvertObjectToDatatableNEW(ByVal jsonObject As Object, ByRef datatable As DataTable) As DataTable
        Try
            Dim st As String = JsonConvert.SerializeObject(jsonObject)
            datatable = JsonConvert.DeserializeObject(Of DataTable)(st)

        Catch ex As Exception
            str = ex.Message
        End Try
        Return datatable
    End Function

    '-----------------------------------Get MasterGridColumnHide------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGridColumnHide(ByVal masterID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "SELECT  nullif(GridColumnHide,'') as GridColumnHide,nullif(TabName,'') as TabName,nullif(ItemNameFormula,'') as ItemNameFormula,nullif(ItemDescriptionFormula,'') as ItemDescriptionFormula FROM ItemGroupMaster Where CompanyID = " & GBLCompanyID & "  and ItemGroupID= '" & masterID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------Get Grid Column Name------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGridColumn(ByVal masterID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select nullif(GridColumnName,'') as GridColumnName From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " and ItemGroupID='" & masterID & "' and isnull(IsDeletedTransaction,0)<>1 "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)

        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Master  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveData(ByVal CostingDataItemMaster As Object, ByVal CostingDataItemDetailMaster As Object, ByVal MasterName As String, ByVal ItemGroupID As String, ByVal ActiveItem As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim ItemID As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            If DuplicateItemGroupValidate(ItemGroupID, CostingDataItemMaster) = True Then
                Return "Duplicate data found"
            End If

            Dim dtItemCode As New DataTable
            Dim MaxItemID As Long
            Dim ItemCodestr2, ItemCodePrefix, ItemCode As String

            ItemCodestr2 = "select nullif(ItemGroupPrefix,'') as ItemGroupPrefix from  ItemGroupMaster Where  CompanyID=" & GBLCompanyID & " And ItemGroupID='" & ItemGroupID & "' and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtItemCode, ItemCodestr2)
            ItemCodePrefix = dtItemCode.Rows(0)(0)

            ItemCode = db.GeneratePrefixedNo("ItemMaster", ItemCodePrefix, "MaxItemNo", MaxItemID, "", " Where ItemCodeprefix='" & ItemCodePrefix & "' And  CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0 ")

            TableName = "ItemMaster"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ItemCode,ItemCodePrefix,MaxItemNo,IsItemActive"
            AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & ",'" & ItemCode & "','" & ItemCodePrefix & "'," & MaxItemID & ",1"
            ItemID = db.InsertDatatableToDatabase(CostingDataItemMaster, TableName, AddColName, AddColValue)

            If IsNumeric(ItemID) = False Then
                Return "fail " & ItemID
            End If

            'If ItemID = "" Then Return "fail"
            'TableName = "ItemMasterDetails"
            'AddColName = "CreatedDate,UserID,CompanyID,ItemID,FYear,CreatedBy,ModifiedBy"
            'AddColValue = "GETDATE()," & GBLUserID & "," & GBLCompanyID & ",'" & ItemID & "','" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ""
            'db.InsertDatatableToDatabase(CostingDataItemDetailMaster, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function
    ''----------------------------Close Master  Save Data  ------------------------------------------

    ''----------------------------Open Master  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateData(ByVal CostingDataItemMaster As Object, ByVal CostingDataItemDetailMaster As Object, ByVal MasterName As String, ByVal ItemID As String, ByVal UnderGroupID As String, ByVal ActiveItem As String) As String

        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            TableName = "ItemMaster"
            AddColName = "ModifiedDate=GETDATE(),ModifiedBy=" & GBLUserID
            wherecndtn = "CompanyID=" & GBLCompanyID & " And ItemID=" & ItemID & " And ItemGroupID=" & UnderGroupID
            KeyField = db.UpdateDatatableToDatabase(CostingDataItemMaster, TableName, AddColName, 0, wherecndtn)

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function
    ''----------------------------Close Master  Update Data  ------------------------------------------

    Public Sub FillDataTableNEW(ByRef DataTableObj As DataTable, ByVal SqlSelectQuery As String, Optional ByVal SqlStoredProcedure As String = "")
        Try

            Dim con As New SqlConnection
            con = db.OpenDataBase()

            Dim cmd As SqlCommand
            If Trim(SqlSelectQuery) = "" Then
                cmd = New SqlCommand(SqlStoredProcedure, con)
                cmd.CommandType = CommandType.StoredProcedure
            Else
                cmd = New SqlCommand(SqlSelectQuery, con)
            End If
            DA = New SqlDataAdapter(cmd)
            DA.Fill(DataTableObj)
            con.Close()
        Catch ex As Exception
            MsgBox(ex.Message)
        End Try
    End Sub



    ''----------------------------Open Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteData(ByVal txtGetGridRow As String, ByVal MasterName As String, ByVal UnderGroupID As String) As String
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Try
            If db.IsDeletable("ItemID", "ItemTransactionDetail", "Where CompanyID=" & GBLCompanyID & " and ItemID= " & txtGetGridRow & " and IsDeletedTransaction=0") = False Then Return "Item used in further transactions can't delete"
            If db.IsDeletable("PaperID", "JobBookingContents", "Where CompanyID=" & GBLCompanyID & " and PaperID= " & txtGetGridRow & " and IsDeletedTransaction=0") = False Then Return "Item used in further transactions can't delete"

            str = "Update ItemMasterDetails Set DeletedBy=" & GBLUserID & ",DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and ItemID='" & txtGetGridRow & "' And ItemGroupID='" & UnderGroupID & "' "
            KeyField = db.ExecuteNonSQLQuery(str)

            str = "Update ItemMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=Getdate(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " and ItemID='" & txtGetGridRow & "' And ItemGroupID='" & UnderGroupID & "'  "
            KeyField = db.ExecuteNonSQLQuery(str)

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function


    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal TransactionID As String) As String
        Dim KeyField As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            Dim D1 = "", D2 As String = ""

            SxistStr = "select ItemID from ItemTransactionDetail where CompanyID=" & GBLCompanyID & " and  ItemID= '" & TransactionID & "' and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, SxistStr)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                D1 = dtExist.Rows(0)(0)
            End If

            SxistStr = "Select ItemID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And isnull(QCApprovalNo,'')<>'' AND TransactionID=" & TransactionID & "  AND (Isnull(ApprovedQuantity,0)>0 OR  Isnull(RejectedQuantity,0)>0)"
            db.FillDataTable(dtExist1, SxistStr)
            E = dtExist1.Rows.Count
            If E > 0 Then
                D2 = dtExist1.Rows(0)(0)
            End If

            If D1 <> "" Or D2 <> "" Then
                KeyField = "Exist"
            End If
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    '-----------------------------------Get MasterGridLoadedData (Edit)------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGridLoadedData(ByVal masterID As String, ByVal Itemid As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Dim selQ As String
        selQ = "execute SelectedRow  '',"
        str = selQ & GBLCompanyID & "," & masterID & "," & Itemid
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)

        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Drill down Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DrillDownMasterGrid(ByVal masterID As String, ByVal TabID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim str2, Qery As String
        Dim dt As New DataTable


        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str2 = "Select nullif(SelectQuery,'') as SelectQuery From DrilDown Where CompanyID=" & GBLCompanyID & " and ItemGroupID='" & masterID & "' and TabName='" & TabID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dt, str2)
        Dim i As Integer = dt.Rows.Count
        If i > 0 Then
            If IsDBNull(dt.Rows(0)(0)) = True Then
                Return ""
            Else
                Qery = dt.Rows(0)(0)
            End If
            Try
                If Qery.ToUpper().Contains("EXECUTE") Then
                    str = Qery & " '' " & "," & GBLCompanyID & "," & masterID
                Else
                    str = Qery
                End If
                db.FillDataTable(dataTable, str)
                data.Message = ConvertDataTableTojSonString(dataTable)
            Catch ex As Exception
                Return ex.Message
            End Try

        End If
        Return js.Serialize(data.Message)

    End Function

    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Master(ByVal masterID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "SELECT Distinct nullif(ItemGroupFieldID,'') as ItemGroupFieldID,nullif(ItemGroupID,'') as ItemGroupID,nullif(FieldName,'') as FieldName,nullif(FieldDataType,'') as FieldDataType,nullif(FieldDescription,'') as FieldDescription,nullif(IsDisplay,'') as IsDisplay,nullif(IsCalculated,'') as IsCalculated,nullif(FieldFormula,'') as FieldFormula,nullif(FieldTabIndex,'') as FieldTabIndex,nullif(FieldDrawSequence,'') as FieldDrawSequence,nullif(FieldDefaultValue,'') as FieldDefaultValue,nullif(CompanyID,'') as CompanyID,nullif(UserID,'') as UserID,nullif(ModifiedDate,'') as ModifiedDate,nullif(FYear,'') as FYear,nullif(IsActive,'') as IsActive,nullif(IsDeleted,'') as IsDeleted,nullif(FieldDisplayName,'') as FieldDisplayName,nullif(FieldType,'') as FieldType,nullif(SelectBoxQueryDB,'') as SelectBoxQueryDB,nullif(SelectBoxDefault,'') as SelectBoxDefault,nullif(ControllValidation,'') as ControllValidation,nullif(FieldFormulaString,'') as FieldFormulaString,nullif(IsRequiredFieldValidator,'') as IsRequiredFieldValidator,nullif(UnitMeasurement,'') as UnitMeasurement FROM ItemGroupFieldMaster Where CompanyID = " & GBLCompanyID & " and ItemGroupID='" & masterID & "' and isnull(IsDeletedTransaction,0)<>1 Order By FieldDrawSequence "
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
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))

            Dim NewQuery As String() = Qery.Split("?")
            Dim NewSelID As String() = selID.Split("?")

            For i = 0 To NewQuery.Length - 1
                dt = New DataTable()

                QS = NewQuery(i)
                SI = NewSelID(i)

                Dim QSQery, str3 As String
                Dim dtNew As New DataTable()

                str3 = "Select nullif(SelectboxQueryDB,'') as SelectboxQueryDB,ItemGroupID From ItemGroupFieldMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupFieldID=" & QS & " and isnull(IsDeletedTransaction,0)<>1"
                db.FillDataTable(dtNew, str3)
                If IsDBNull(dtNew.Rows(0)(0)) = True Then
                    Return ""
                Else
                    QSQery = dtNew.Rows(0)(0)
                    QSQery = Replace(QSQery, "#", "'")
                    QSQery = Replace(QSQery, "@CompanyID", GBLCompanyID)
                    QSQery = Replace(QSQery, "@ItemGroupID", dtNew.Rows(0)("ItemGroupID"))
                    QSQery = Replace(QSQery, "@VendorID", IIf(VendorID = 0 Or VendorID = "", "", " And LedgerID=" & VendorID))
                End If

                If QSQery = "" Then
                    Return ""
                Else
                    str = QSQery
                End If

                db.FillDataTable(dt, str)
                dt.NewRow()
                If dt.Columns.Count = 2 Then
                    If dt.Rows.Count > 0 Then
                        dt.Rows.Add(dt.Rows(0)(dt.Columns(0).ColumnName), SI)
                    Else
                        dt.Rows.Add(0, SI)
                    End If
                ElseIf dt.Columns.Count = 1 Then
                    dt.Rows.Add(SI)
                Else
                    dt.Columns.Add(SI, GetType(String))
                    dt.Rows.Add(SI)
                End If

                ds.Tables.Add(dt)
                data.Message = DataSetToJSONWithJavaScriptSerializer(ds)
            Next
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get FieldNameName (SaveAs)------------------------------------------
    Private Function DuplicateItemGroupValidate(ByVal TabelID As String, ByVal tblObj As Object) As Boolean
        Dim str2, ColValue As String
        Dim dtExist As New DataTable
        Dim dt As New DataTable
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str2 = "Select IsNull(SaveAsString,'') as SaveAsString From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " and ItemGroupID='" & TabelID & "' and Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            If dtExist.Rows.Count > 0 Then
                If IsDBNull(dtExist.Rows(0)(0)) = True Then
                    Return False
                Else
                    Dim GetColumn As String
                    GetColumn = dtExist.Rows(0)(0)
                    db.ConvertObjectToDatatable(tblObj, dt)
                    ColValue = ""
                    Dim BrakCount = ""

                    For i As Integer = 0 To dt.Rows.Count - 1
                        ColValue = ""
                        For Each column In dt.Columns
                            If GetColumn.Contains(column.ColumnName) Then
                                If ColValue = "" Then
                                    ColValue = " And " & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & " And " & column.ColumnName & "='" & Replace(dt.Rows(i)(column.ColumnName), "'", "") & "'"
                                End If
                            End If
                        Next
                    Next

                    'For i As Integer = 0 To dt.Rows.Count - 1
                    '    If GetColumn.Contains(dt.Rows(i)("FieldName")) Then
                    '        If ColValue = "" Then
                    '            ColValue = " And Isnull(IsDeletedTransaction,0)<>1 And ItemID In(Select Distinct ItemID From ItemMasterDetails Where FieldName='" & dt.Rows(i)("FieldName") & "' And FieldValue='" & dt.Rows(i)("FieldValue") & "'"
                    '            BrakCount = " )"
                    '        Else
                    '            ColValue = ColValue & " And ItemID In(Select Distinct ItemID From ItemMasterDetails Where FieldName='" & dt.Rows(i)("FieldName") & "' And FieldValue='" & dt.Rows(i)("FieldValue") & "'"
                    '            BrakCount = BrakCount & ")"
                    '        End If
                    '    End If
                    'Next

                    str2 = "Select Distinct ItemID From ItemMaster Where CompanyID=" & GBLCompanyID & " And ItemGroupID=" & TabelID & ColValue
                    dtExist = New DataTable
                    db.FillDataTable(dtExist, str2)
                    If dtExist.Rows.Count > 0 Then
                        Return True
                    End If
                End If
            Else
                Return False
            End If
            Return False
        Catch ex As Exception
            Return True
        End Try
    End Function


    '--------------------------------------Master Group Creation-------------------------------
    '-----------------------------------Get UnderGroupName------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetUnderGroup() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct ItemSubGroupID,ItemSubGroupDisplayName from ItemSubGroupMaster Where CompanyID=" & GBLCompanyID & ""
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get GroupName Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetGroup() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select distinct ISGM.ItemSubGroupUniqueID,ISGM.ItemSubGroupID,ISGM.ItemSubGroupDisplayName,ISGM.UnderSubGroupID,ISGM.ItemSubGroupName,ISGM.ItemSubGroupLevel ,(select top 1 ItemSubGroupDisplayName from ItemSubGroupMaster where ItemSubGroupID=ISGM.UnderSubGroupID and CompanyID=ISGM.CompanyID) as GroupName from ItemSubGroupMaster  as ISGM  where CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Master  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveGroupData(ByVal CostingDataGroupMaster As Object, ByVal GroupName As String, ByVal UnderGroupID As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2, GroupLevel As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            Dim dtExist As New DataTable
            Dim ItemSubGroupID As Integer
            '' and  UnderSubGroupID = '" & UnderGroupID & "'
            str2 = ""
            str2 = "select distinct nullif(ItemSubGroupName,'') as ItemSubGroupName " &
                "from ItemSubGroupMaster where CompanyID=" & GBLCompanyID & " and ItemSubGroupName= '" & GroupName & "' " &
                "and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else

                Dim dt1 As New DataTable
                str2 = ""
                str2 = "Select isnull(max(ItemSubGroupID),0) + 1 As ItemSubGroupID From ItemSubGroupMaster Where  CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1"
                db.FillDataTable(dt1, str2)
                Dim i As Integer = dt1.Rows.Count
                If i > 0 Then
                    ItemSubGroupID = dt1.Rows(0)(0)
                End If

                Dim dt2 As New DataTable
                str2 = ""
                str2 = "Select isnull(ItemSubGroupLevel,0) ItemSubGroupLevel From ItemSubGroupMaster Where ItemSubGroupID = '" & UnderGroupID & "' And CompanyID=" & GBLCompanyID & " and Isnull(IsDeletedTransaction,0)<>1"
                db.FillDataTable(dt2, str2)
                Dim k As Integer = dt2.Rows.Count
                GroupLevel = k + 1

                TableName = "ItemSubGroupMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,ItemSubGroupID,FYear,CreatedBy,ModifiedBy,ItemSubGroupLevel"
                AddColValue = "GETDATE(),GETDATE()," & GBLUserID & ",'" & ItemSubGroupID & "','" & GBLFYear & "'," & GBLUserID & "," & GBLUserID & ",'" & GroupLevel & "'"
                db.InsertDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, AddColValue)

                KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Master  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatGroupData(ByVal CostingDataGroupMaster As Object, ByVal ItemSubGroupUniqueID As String, ByVal ItemSubGroupLevel As String, ByVal GroupName As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            Dim dtExist As New DataTable

            str2 = "Select distinct nullif(ItemSubGroupName,'') as ItemSubGroupName from ItemSubGroupMaster where CompanyID=" & GBLCompanyID & " and ItemSubGroupName= '" & GroupName & "' AND ItemSubGroupUniqueID<>" & ItemSubGroupUniqueID & " And isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)

            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else
                TableName = "ItemSubGroupMaster"
                AddColName = "ModifiedDate=Getdate(),UserID=" & GBLUserID & ",ModifiedBy=" & GBLUserID & ",ItemSubGroupLevel='" & ItemSubGroupLevel & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And ItemSubGroupUniqueID=" & ItemSubGroupUniqueID
                KeyField = db.UpdateDatatableToDatabase(CostingDataGroupMaster, TableName, AddColName, 0, wherecndtn)
            End If
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open GroupMaster Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteGroupMasterData(ByVal ItemSubGroupUniqueID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update ItemSubGroupMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " And ItemSubGroupUniqueID=" & ItemSubGroupUniqueID
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