Imports System.Web
Imports System.Web.Services
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports Connection
Imports System.Web.Configuration
Imports System.Configuration
Imports Newtonsoft.Json

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_LedgerMaster
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

    <WebMethod()>
    <ScriptMethod()>
    Public Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
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

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        ' str = "SELECT LedgerGroupID,LedgerGroupName,LedgerGroupNameDisplay ,LedgerGroupNameID FROM LedgerGroupMaster Where CompanyID = " & GBLCompanyID & " And IsDeletedTransaction=0 Order By LedgerGroupID "
        str = "SELECT LedgerGroupID,LedgerGroupName,LedgerGroupNameDisplay ,LedgerGroupNameID FROM LedgerGroupMaster Where CompanyID = " & GBLCompanyID & " And IsDeletedTransaction=0 Order By CASE LedgerGroupNameDisplay WHEN 'CLIENTS' THEN 1 WHEN 'CONSIGNEE' THEN 2 WHEN 'ASSOCIATE PARTNER' THEN 3 WHEN 'SUPPLIERS' THEN 4 WHEN 'TRANSPORTERS' THEN 5 WHEN 'EMPLOYEES' THEN 6 WHEN 'SALES A/C' THEN 7 WHEN 'PURCHASE A/C' THEN 8 WHEN 'TAX LEDGER MASTER' THEN 9 ELSE 10 END; "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGrid(ByVal masterID As String) As String
        Dim str2, Qery As String
        Dim dt As New DataTable
        js.MaxJsonLength = 2147483647

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        str2 = "Select nullif(SelectQuery,'') As SelectQuery From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " And LedgerGroupID='" & masterID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dt, str2)
        Dim i As Integer = dt.Rows.Count
        If i > 0 Then
            If IsDBNull(dt.Rows(0)(0)) = True Then
                Return js.Serialize("")
            Else
                Qery = dt.Rows(0)(0)
            End If
            Try
                str = Qery & " '' " & "," & GBLCompanyID & "," & masterID
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
        str = "SELECT  nullif(GridColumnHide,'') as GridColumnHide,nullif(TabName,'') as TabName,IsNull(ConcernPerson,0) as ConcernPerson,IsNull(EmployeeMachineAllocation,0) as EmployeeMachineAllocation FROM LedgerGroupMaster Where CompanyID = " & GBLCompanyID & "  and LedgerGroupID= '" & masterID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSalesCordnators(ByVal ID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        If IsNumeric(ID) And Val(ID) > 0 Then
            str = "Select LedgerID as SalesCordinatorID,LedgerName from LedgerMaster Where LedgerGroupID= 3 and Designation ='SALES CORDINATOR' and " & ID & " in (SELECT value FROM STRING_SPLIT(UnderUserID, ','))  and CompanyId =" & GBLCompanyID
        Else
            str = "Select LedgerID as SalesCordinatorID,LedgerName from LedgerMaster Where LedgerGroupID= 3 and Designation ='SALES CORDINATOR'  and CompanyId =" & GBLCompanyID
        End If
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSalesPerson() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select LedgerID as LedgerIDSE,LedgerName from LedgerMaster Where LedgerGroupID= 3 and Designation in('SALES EXECUTIVE','SALES MANAGER') and CompanyId =" & GBLCompanyID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------Get Grid Column Name------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGridColumn(ByVal masterID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select nullif(GridColumnName,'') as GridColumnName From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " and LedgerGroupID='" & masterID & "' and isnull(IsDeletedTransaction,0)<>1 "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)

        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Open Master  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveData(ByVal CostingDataLedgerMaster As Object, ByVal CostingDataLedgerDetailMaster As Object, ByVal MasterName As String, ByVal ActiveLedger As String, ByVal LedgerGroupID As String, ByVal CostingDataSlab As Object, ByVal ItemStringArray As String) As String

        Dim dt As New DataTable
        Dim KeyField, LedgerID As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If DuplicateLedgerGroupValidate(LedgerGroupID, CostingDataLedgerDetailMaster) = True Then
                Return "Duplicate data found"
            End If

            Dim dtLedgerCode As New DataTable
            Dim MaxLedgerID As Long
            Dim LedgerCodestr2, LedgerCodePrefix, LedgerCode As String
            LedgerCodestr2 = "select nullif(LedgerGroupPrefix,'') as LedgerGroupPrefix from  LedgerGroupMaster Where  CompanyID=" & GBLCompanyID & " And LedgerGroupID='" & LedgerGroupID & "' and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtLedgerCode, LedgerCodestr2)
            LedgerCodePrefix = dtLedgerCode.Rows(0)(0)

            LedgerCode = db.GeneratePrefixedNo("LedgerMaster", LedgerCodePrefix, "MaxLedgerNo", MaxLedgerID, "", " Where LedgerGroupID=" & LedgerGroupID & " And LedgerCodeprefix='" & LedgerCodePrefix & "' And  CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0")
            If db.CheckAuthories("LedgerMaster.aspx", GBLUserID, GBLCompanyID, "CanSave", LedgerCode) = False Then Return "You are not authorized to save"
            Using updateTransaction As New Transactions.TransactionScope
                TableName = "LedgerMaster"
                AddColName = "SelectedItemIds,ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,LedgerCode,LedgerCodeprefix,MaxLedgerNo"
                AddColValue = "'" & ItemStringArray & "','" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & LedgerCode & "','" & LedgerCodePrefix & "'," & MaxLedgerID & ""
                LedgerID = db.InsertDatatableToDatabase(CostingDataLedgerMaster, TableName, AddColName, AddColValue)

                If IsNumeric(LedgerID) = False Then
                    updateTransaction.Dispose()
                    Return "fail" & LedgerID
                End If

                TableName = "LedgerMasterDetails"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & LedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"
                str = db.InsertDatatableToDatabase(CostingDataLedgerDetailMaster, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    updateTransaction.Dispose()
                    Return "fail" & str
                End If

                str = "Insert into LedgerMasterDetails (ModifiedDate,CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy,FieldValue,ParentFieldValue,ParentFieldName,FieldName,LedgerGroupID) values('" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & LedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ActiveLedger & "','" & ActiveLedger & "','ISLedgerActive','ISLedgerActive','" & LedgerGroupID & "')"
                db.ExecuteNonSQLQuery(str)

                ''Create And update mailing addresss string
                '' Now shifted in stored procdure on 12-11-20 by pKp
                'db.ExecuteNonSQLQuery("Update LedgerMasterDetails Set FieldValue= LMS.Address1+','+Case When ISNULL(LMS.Address2,'')='' Then '' Else LMS.Address2+',' End + CHAR(13)+CHAR(10) +Case When ISNULL(LMS.Address3,'')='' Then '' Else LMS.Address3+',' End +LMS.City+Case When ISNULL(LMS.Pincode,'')='' Then '' Else '-'+LMS.Pincode+',' End + CHAR(13)+CHAR(10) +Case When ISNULL(LMS.[District] ,'')='' Then '' Else 'Dist./Province -'+LMS.[District] +',' End  + LMS.[State] +' - '+ LMS.Country From LedgerMasterDetails As LMD Inner Join LedgerMaster As LM On LM.LedgerID=LMD.LedgerID And LM.CompanyID=" & GBLCompanyID & " Inner Join LedgerMasterData As LMS On LMS.LedgerID=LMD.LedgerID And LMS.LedgerGroupID=LMD.LedgerGroupID Where LMD.FieldName='MailingAddress' And LM.LedgerID=" & LedgerID & " ")
                db.ExecuteNonSQLQuery("EXEC UpdateLedgerMasterValues " & GBLCompanyID & "," & LedgerID)
                KeyField = "Success"

                TableName = "ConcernPersonMaster"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,LedgerID"
                AddColValue = "Getdate()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & LedgerID
                db.InsertDatatableToDatabase(CostingDataSlab, TableName, AddColName, AddColValue)

                updateTransaction.Complete()
            End Using
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function
    ''----------------------------Close Master  Save Data  ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveAPMachineRateSlabs(ByVal machineSlabs As Object) As String
        Dim KeyField = ""
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim LedgerID = machineSlabs(0)("LedgerID")
            Dim AddColName = "CreatedDate,UserID,CompanyID,CreatedBy"
            Dim AddColValue = "Getdate(),'" & GBLUserID & "'," & GBLCompanyID & "," & GBLUserID
            db.ExecuteNonSQLQuery("Update VendorWiseMachineSlabMaster Set IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " And MachineID=" & machineSlabs(0)("MachineID") & " And LedgerID=" & LedgerID)
            KeyField = db.InsertDatatableToDatabase(machineSlabs, "VendorWiseMachineSlabMaster", AddColName, AddColValue)
            If IsNumeric(KeyField) = False Then
                db.ExecuteNonSQLQuery("Delete from VendorWiseMachineSlabMaster WHERE IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And MachineID=" & machineSlabs(0)("MachineID") & " And LedgerID=" & LedgerID)
                db.ExecuteNonSQLQuery("Update VendorWiseMachineSlabMaster Set IsDeletedTransaction=0 WHERE IsDeletedTransaction=1 And CompanyID=" & GBLCompanyID & " And MachineID=" & machineSlabs(0)("MachineID") & " And LedgerID=" & LedgerID)
                Return "Error in slabs :- " & KeyField
            End If
            db.ExecuteNonSQLQuery("Delete from VendorWiseMachineSlabMaster WHERE IsDeletedTransaction=1 And CompanyID=" & GBLCompanyID & " And MachineID=" & machineSlabs(0)("MachineID") & " And LedgerID=" & LedgerID)
            KeyField = "Success"
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
        Return KeyField
    End Function

    ''----------------------------Open Master  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateData(ByVal CostingDataLedgerMaster As Object, ByVal CostingDataLedgerDetailMaster As Object, ByVal MasterName As String, ByVal LedgerID As String, ByVal UnderGroupID As String, ByVal ActiveLedger As String, ByVal CostingDataSlab As Object, ByVal CostingDataSlabUpdate As Object, ByVal ItemStringArray As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If db.IsDeletable("IsLocked", "LedgerMaster", "Where IsLocked=1 And LedgerID= " & LedgerID & " And CompanyID = " & GBLCompanyID & " ") = False Then
            KeyField = "fail"
            Return KeyField
            Exit Function
        End If
        If db.CheckAuthories("LedgerMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit", LedgerID) = False Then Return "You are not authorized to update"

        Try

            TableName = "LedgerMaster"
            AddColName = "SelectedItemIds='" & ItemStringArray & "',ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And LedgerID=" & LedgerID & " And LedgerGroupID=" & UnderGroupID & ""
            db.UpdateDatatableToDatabase(CostingDataLedgerMaster, TableName, AddColName, 0, wherecndtn)

            Dim SomeSpcelCaseColName, SomeSpcelCaseColValue As String
            TableName = "LedgerMasterDetails"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And LedgerID=" & LedgerID & " And LedgerGroupID=" & UnderGroupID & ""

            SomeSpcelCaseColName = "ModifiedDate,CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy"
            SomeSpcelCaseColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & LedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"

            Dim UniqueId, strUniqColName, strUniqColValue As String
            UniqueId = ""
            ConvertObjectToDatatableNEW(CostingDataLedgerDetailMaster, dt)

            Dim Cnt As Integer = 1
            Dim Pvalue As Integer

            For i As Integer = 0 To dt.Rows.Count - 1
                str = ""
                UniqueId = ""
                strUniqColName = ""
                strUniqColValue = ""
                Cnt = 1
                Pvalue = 1
                For Each column In dt.Columns
                    strUniqColName = strUniqColName & column.ColumnName & ","
                    strUniqColValue = strUniqColValue & "'" & dt.Rows(i)(column.ColumnName) & "',"

                    If Cnt <= Pvalue Then
                        UniqueId = UniqueId & column.ColumnName & " ='" & dt.Rows(i)(column.ColumnName) & "' And "
                        Cnt = Cnt + 1
                    Else
                        str = str & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "',"  ' Console.WriteLine(column.ColumnName)
                    End If
                Next
                str = Left(str, Len(str) - 1)
                If UniqueId <> "" Then
                    UniqueId = Left(UniqueId, Len(UniqueId) - 4)
                End If
                If (wherecndtn <> "") Then
                    If UniqueId <> "" Then
                        UniqueId = UniqueId & " And " & wherecndtn
                    Else
                        UniqueId = wherecndtn
                    End If
                End If

                If (AddColName <> "") Then
                    If str <> "" Then
                        str = str & " , " & AddColName
                    Else
                        str = AddColName
                    End If
                End If

                str2 = "Select * From " & TableName & " Where " & UniqueId & " and isnull(IsDeletedTransaction,0)<>1"
                Dim dtExistData As New DataTable
                db.FillDataTable(dtExistData, str2)
                Dim k As Integer = dtExistData.Rows.Count
                If k < 1 Then
                    Dim DTExistCol As New DataTable
                    FillDataTableNEW(DTExistCol, str2)

                    For Each column In dt.Columns
                        Dim row As DataRow = DTExistCol.Select(column.ColumnName & " = '" & dt.Rows(i)(column.ColumnName) & "'").FirstOrDefault()
                        If row Is Nothing Then

                            Dim strInsert As String
                            strInsert = "Insert into " & TableName & " (" & strUniqColName & SomeSpcelCaseColName & ") Values(" & strUniqColValue & SomeSpcelCaseColValue & ")"
                            db.ExecuteNonSQLQuery(strInsert)

                            Exit For
                        End If
                    Next
                End If

                Dim strUpdate As String
                strUpdate = "Update " & TableName & " Set " & str & " Where " & UniqueId
                db.ExecuteNonSQLQuery(strUpdate)

            Next

            str2 = "Select nullif(ParentFieldValue,'') as ParentFieldValue From LedgerMasterDetails Where ParentFieldName='ISLedgerActive' and FieldName='ISLedgerActive' and LedgerID='" & LedgerID & "'  and LedgerGroupID='" & UnderGroupID & "' and CompanyID=" & GBLCompanyID & " and isnull(IsDeletedTransaction,0)<>1"
            Dim dtexist As New DataTable
            db.FillDataTable(dtexist, str2)
            Dim x As Integer = dtexist.Rows.Count
            If x = 0 Then
                str = "insert into LedgerMasterDetails (ModifiedDate,CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy,FieldValue,ParentFieldValue,ParentFieldName,FieldName,LedgerGroupID) values('" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & LedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','True','True','ISLedgerActive','ISLedgerActive','" & UnderGroupID & "')"
                db.ExecuteNonSQLQuery(str)

                str = "insert into LedgerMaster (ModifiedDate,CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy,ISLedgerActive,LedgerGroupID) values('" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & LedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','True','" & UnderGroupID & "')"
                db.ExecuteNonSQLQuery(str)
            Else
                Dim ActiveLedgerUpdate As String
                ActiveLedgerUpdate = "Update LedgerMasterDetails Set ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy='" & GBLUserID & "',FieldValue='" & ActiveLedger & "',ParentFieldValue='" & ActiveLedger & "'  Where ParentFieldName='ISLedgerActive' and FieldName='ISLedgerActive' and LedgerID='" & LedgerID & "'  and LedgerGroupID='" & UnderGroupID & "' and CompanyID=" & GBLCompanyID & ""
                db.ExecuteNonSQLQuery(ActiveLedgerUpdate)

                Dim ActiveLedgerUpdateMaster As String
                ActiveLedgerUpdateMaster = "Update LedgerMaster Set ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy='" & GBLUserID & "',ISLedgerActive='" & ActiveLedger & "'  Where  LedgerID='" & LedgerID & "'  and LedgerGroupID='" & UnderGroupID & "' and CompanyID=" & GBLCompanyID & ""
                db.ExecuteNonSQLQuery(ActiveLedgerUpdateMaster)
            End If

            ''Update all fields from details to main table for time being On 12-11-20
            db.ExecuteNonSQLQuery("EXEC UpdateLedgerMasterValues " & GBLCompanyID & "," & LedgerID)
            'db.UpdateDatatableToDatabase(CostingDataLedgerDetailMaster, TableName, AddColName, 1, wherecndtn, SomeSpcelCaseColName, SomeSpcelCaseColValue)

            TableName = "ConcernPersonMaster"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,LedgerID"
            Dim AddColValue = "Getdate()," & GBLUserID & "," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID & "," & LedgerID
            db.InsertDatatableToDatabase(CostingDataSlab, TableName, AddColName, AddColValue)

            TableName = "ConcernPersonMaster"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy=" & GBLUserID
            wherecndtn = "LedgerID=" & LedgerID & " And CompanyID=" & GBLCompanyID & ""
            db.UpdateDatatableToDatabase(CostingDataSlabUpdate, TableName, AddColName, 1, wherecndtn)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
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
                cmd = New SqlCommand(SqlStoredProcedure, con) With {
                    .CommandType = CommandType.StoredProcedure
                }
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
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))

        Try

            If db.CheckAuthories("LedgerMaster.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete"
            If db.IsDeletable("IsLocked", "LedgerMaster", "Where IsLocked=1 And LedgerID= " & txtGetGridRow & " And CompanyID = " & GBLCompanyID & " ") = False Then
                KeyField = "fail"
                Return KeyField
                Exit Function
            End If

            'Dim distblName, str3 As String
            'Dim s As String = "ConcernPersonMaster,ClientMachineCostSettings,EmployeeMachineAllocation,ItemPurchaseOrderTaxes,ItemTransactionMain,JobBooking,SupplierWisePurchaseSetting"
            'Dim list As String() = s.Split(",")
            'For i = 0 To list.Length - 1
            '    distblName = ""
            '    distblName = list(i)

            '    Dim dtNew As New DataTable()
            '    
            '    str3 = "select isnull(LedgerID,0) LedgerID from " & distblName & " Where CompanyID=" & GBLCompanyID & " and LedgerID=" & txtGetGridRow & " and isnull(IsDeletedTransaction,0)<>1"
            '    db.FillDataTable(dtNew, str3)
            '    Dim E As Integer = dtNew.Rows.Count
            '    If E > 0 Then
            '        KeyField = "Exist"
            '        Return KeyField
            '    End If
            'Next

            str = "Update LedgerMasterDetails Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & txtGetGridRow & "' And LedgerGroupID='" & UnderGroupID & "' "
            db.ExecuteNonSQLQuery(str)

            str = "Update LedgerMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & txtGetGridRow & "' And LedgerGroupID='" & UnderGroupID & "'  "
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal LedgerID As String) As String
        Dim KeyField As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim distblName, str3 As String
            Dim s As String = "ConcernPersonMaster,ClientMachineCostSettings,EmployeeMachineAllocation,ItemPurchaseOrderTaxes,ItemTransactionMain,JobBooking,SupplierWisePurchaseSetting"
            Dim list As String() = s.Split(",")
            For i = 0 To list.Length - 1
                distblName = ""
                distblName = list(i)

                Dim dtNew As New DataTable()
                str3 = ""
                str3 = "select isnull(LedgerID,0) LedgerID from " & distblName & " Where CompanyID=" & GBLCompanyID & " and LedgerID=" & LedgerID & " and isnull(IsDeletedTransaction,0)<>1"
                db.FillDataTable(dtNew, str3)
                Dim E As Integer = dtNew.Rows.Count
                If E > 0 Then
                    KeyField = "Exist"
                    Return KeyField
                End If
            Next

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    '-----------------------------------Get MasterGridLoadedData (Edit)------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MasterGridLoadedData(ByVal masterID As String, ByVal Ledgerid As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        Dim selQ As String
        selQ = "Execute SelectedRowLedger  '',"
        str = selQ & GBLCompanyID & "," & masterID & "," & Ledgerid
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
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        str2 = "Select nullif(SelectQuery,'') as SelectQuery From LedgerMasterDrilDown Where CompanyID=" & GBLCompanyID & " and LedgerGroupID='" & masterID & "' and TabName='" & TabID & "' and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dt, str2)
        Dim i As Integer = dt.Rows.Count
        If i > 0 Then
            If IsDBNull(dt.Rows(0)(0)) = True Then
                Return js.Serialize("")
            Else
                Qery = dt.Rows(0)(0)
            End If
            Try
                str = Qery & " '' " & "," & GBLCompanyID & "," & masterID
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
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "SELECT LedgerGroupFieldID,LedgerGroupID,FieldName,FieldDataType,IsDisplay,IsCalculated,nullif(FieldFormula,'') as FieldFormula,FieldTabIndex,FieldDrawSequence,FieldDefaultValue,CompanyID,IsActive,FieldDisplayName,FieldType,nullif(SelectBoxQueryDB,'') as SelectBoxQueryDB,nullif(SelectBoxDefault,'') as SelectBoxDefault,nullif(ControllValidation,'') as ControllValidation,nullif(FieldFormulaString,'') as FieldFormulaString,nullif(IsRequiredFieldValidator,'') as IsRequiredFieldValidator FROM LedgerGroupFieldMaster Where CompanyID = " & GBLCompanyID & " and LedgerGroupID=" & masterID & " and IsDeletedTransaction=0 Order By FieldDrawSequence "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Dynamic SelectBoxLoad------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelectBoxLoad(ByVal Qery As String, ByVal selID As String) As String
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

                str3 = "Select nullif(SelectboxQueryDB,'') As SelectboxQueryDB,LedgerGroupID From LedgerGroupFieldMaster Where Isnull(SelectboxQueryDB,'')<>'' And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " and LedgerGroupFieldID=" & QS & ""
                db.FillDataTable(dtNew, str3)
                If dtNew.Rows.Count = 0 Then
                    Return ""
                Else
                    QSQery = dtNew.Rows(0)(0)
                    QSQery = Replace(QSQery, "#", "'")
                    QSQery = Replace(QSQery, "@CompanyID", GBLCompanyID)
                    QSQery = Replace(QSQery, "@LedgerGroupID", dtNew.Rows(0)("LedgerGroupID"))
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

    '-----------------------------------Get Ledger Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ConvertLedgerToConsignee(ByVal LedID As Integer) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Try
            Dim DTLedgerCode, DTConsignee As New DataTable
            Dim MaxLedgerID As Long
            Dim LedgerCodestr2, LedgerCodePrefix, LedgerCode, LedgerGroupID, NewLedgerID As String
            LedgerCodestr2 = "Select nullif(LedgerGroupPrefix,'') As Prefix,LedgerGroupID from  LedgerGroupMaster Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & " And LedgerGroupID=(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=44 And CompanyID=" & GBLCompanyID & ") And Isnull(IsDeletedTransaction,0)=0"
            db.FillDataTable(DTLedgerCode, LedgerCodestr2)
            If DTLedgerCode.Rows.Count > 0 Then
                LedgerCodePrefix = DTLedgerCode.Rows(0)("Prefix")
                LedgerGroupID = DTLedgerCode.Rows(0)("LedgerGroupID")

                str = "Select LedgerID,LedgerName From LedgerMaster Where LedgerGroupID=(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=24 And CompanyID=" & GBLCompanyID & ")  And CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0 And LedgerName Not In (Select Distinct LedgerName From LedgerMaster Where IsDeletedTransaction=0 And LedgerGroupID=" & LedgerGroupID & " And CompanyID=" & GBLCompanyID & ")"
                db.FillDataTable(DTConsignee, str)
                If DTConsignee.Rows.Count > 0 Then

                    Dim con As New SqlConnection
                    con = db.OpenDataBase()
                    Dim cmd As New SqlCommand()

                    For i = 0 To DTConsignee.Rows.Count - 1
                        LedID = DTConsignee.Rows(i)("LedgerID")

                        LedgerCode = db.GeneratePrefixedNo("LedgerMaster", LedgerCodePrefix, "MaxLedgerNo", MaxLedgerID, "", " Where LedgerCodeprefix='" & LedgerCodePrefix & "' And  CompanyID=" & GBLCompanyID & " And isnull(IsDeletedTransaction,0)=0")

                        Using updateTransaction As New Transactions.TransactionScope
                            str = "Insert Into LedgerMaster(LedgerCode, MaxLedgerNo, LedgerCodePrefix, LedgerName, LedgerDescription, LedgerUnitID, LedgerType, LedgerGroupID, ISLedgerActive, CompanyID, UserID, CreatedDate, IsBlocked, FYear, IsLocked, CreatedBy)" &
                                                " SELECT '" & LedgerCode & "', " & MaxLedgerID & ", '" & LedgerCodePrefix & "', LedgerName, Replace(LedgerDescription,'Client:','Consignee:'), LedgerUnitID, 'Consignee', " & LedgerGroupID & ", IsLedgerActive, CompanyID, " & GBLUserID & ", GETDATE(), IsBlocked,FYear, IsLocked, " & GBLUserID & " FROM LedgerMaster As LM Where LM.LedgerID=" & LedID & " And LM.CompanyID=" & GBLCompanyID & "; Select SCOPE_IDENTITY();"

                            cmd = New SqlCommand(str, con)
                            NewLedgerID = cmd.ExecuteScalar()

                            If IsNumeric(NewLedgerID) = False Then
                                con.Close()
                                updateTransaction.Dispose()
                                Return NewLedgerID & LedID
                            End If

                            Dim DtDetails As New DataTable
                            str = "SELECT ParentLedgerID, ParentFieldName, ParentFieldValue," & NewLedgerID & " As LedgerID, FieldID, FieldName, FieldValue, SequenceNo," & LedgerGroupID & " As LedgerGroupID," & GBLCompanyID & " As CompanyID," & GBLUserID & " As UserID, Getdate() As CreatedDate,'" & GBLFYear & "' As FYear FROM LedgerMasterDetails Where FieldName IN(Select Distinct FieldName From LedgerGroupFieldMaster Where LedgerGroupID=" & LedgerGroupID & ") And (LedgerID = " & LedID & ") And CompanyID=" & GBLCompanyID
                            db.FillDataTable(DtDetails, str)
                            str = db.InsertSecondaryDataJobCard(DtDetails, "LedgerMasterDetails", "CreatedBy", GBLUserID, "", "", "")
                            If str <> "200" Then
                                con.Close()
                                updateTransaction.Dispose()
                                Return str & LedID
                            End If

                            str = "Insert into LedgerMasterDetails (CreatedDate,UserID,CompanyID,LedgerID,FYear,CreatedBy,ModifiedBy,FieldValue,ParentFieldValue,ParentFieldName,FieldName,LedgerGroupID,SequenceNo) " &
                                " values(Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & NewLedgerID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & LedID & "','" & LedID & "','RefClientID','RefClientID','" & LedgerGroupID & "',20)"
                            db.ExecuteNonSQLQuery(str)

                            db.ExecuteNonSQLQuery("EXEC UpdateLedgerMasterValues " & GBLCompanyID & "," & NewLedgerID)

                            updateTransaction.Complete()
                        End Using
                    Next
                    con.Close()

                    Return "Success"
                Else
                    Return "Duplicate consignee found"
                End If

            Else
                Return "No any consignee group found"
            End If

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Ledger Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetLedgerName(ByVal TabelID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Execute [GetFilteredLedgerMasterData] ''," & GBLCompanyID & ",'" & TabelID & "',' And LedgerID In (Select Distinct LedgerID From LedgerMasterDetails Where FieldName=''ISLedgerActive'' And FieldValue=''True'')'"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Ledger Designation------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendorList() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And LedgerID=" & VendorID)
        str = "Select Distinct LedgerID AS VendorID,LedgerName As VendorName From LedgerMaster Where LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And   LedgerGroupNameID IN(25)) AND CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 " & VendorID & " Order By VendorName"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistSlab(ByVal Machineid As String, ByVal VendorID As Integer) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = " SELECT DISTINCT PKSlabID, MachineID,LedgerID,  SheetRangeFrom, SheetRangeTo, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges, Wastage, SpecialColorFrontCharges, SpecialColorBackCharges, NULLIF (PaperGroup, '') AS PaperGroup, MaxPlanW AS SizeW, MaxPlanL AS SizeL, MinCharges FROM VendorWiseMachineSlabMaster " &
                " WHERE (CompanyID = " & GBLCompanyID & ") AND (MachineID = " & Machineid & ") AND (LedgerID = " & VendorID & ") AND (ISNULL(IsDeletedTransaction, 0) <> 1) " &
                " Order By PaperGroup,SheetRangeFrom ,SheetRangeTo "
        db.FillDataTable(dataTable, str)

        If dataTable.Rows.Count = 0 Then
            str = "SELECT DISTINCT PKSlabID, MachineID,LedgerID,SheetRangeFrom, SheetRangeTo, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges, Wastage, SpecialColorFrontCharges, SpecialColorBackCharges, NULLIF (PaperGroup, '') AS PaperGroup, MaxPlanW AS SizeW,  MaxPlanL AS SizeL, MinCharges FROM MachineSlabMaster " &
                    " WHERE (CompanyID = " & GBLCompanyID & ") AND (MachineID = " & Machineid & ") AND (ISNULL(IsDeletedTransaction, 0) <> 1) "
            db.FillDataTable(dataTable, str)
        End If

        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Concern Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetExistCocrnPerson(ByVal LID As Integer) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct SalesCordinatorID ,SalesPersonId as LedgerIDSE,ConcernPersonID, LedgerID, Name, NULLIF (Address1, '') AS Address1, NULLIF (Address2, '') AS Address2, NULLIF (Mobile, '') AS Mobile, NULLIF (Email, '') AS Email, NULLIF (Designation, '') AS Designation,IsPrimaryConcernPerson From ConcernPersonMaster Where CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0 And LedgerID=" & LID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ConcernPersonMaster Delete Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteConcernPersonData(ByVal LedgerID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update ConcernPersonMaster Set DeletedBy=" & GBLUserID & ",DeletedDate=GETDATE(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " And LedgerID=" & LedgerID
            KeyField = db.ExecuteNonSQLQuery(str)
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open ConcernPerson  Delete From GridClick  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteConcernPersonDataGridRow(ByVal ConcernPersonID As String, ByVal LedgerID As String) As String

        Dim dt As New DataTable
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            KeyField = db.ExecuteNonSQLQuery("Delete From ConcernPersonMaster WHERE CompanyID=" & GBLCompanyID & " And ConcernPersonID=" & ConcernPersonID & " And LedgerID=" & LedgerID)
        Catch ex As Exception
            KeyField = "Not match"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Employee Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOperatorName() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select L.LedgerID,L.LedgerName From LedgerMaster As L Inner Join LedgerMasterDetails As LD On L.LedgerID=LD.LedgerID And L.CompanyID=LD.CompanyID Where LD.FieldName='Designation' And Upper(LD.FieldValue)='OPERATOR' And L.CompanyID=" & GBLCompanyID & " And Isnull(L.IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Employee Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetEmployeeName(ByVal TabelID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select LedgerID,LedgerName from LedgerMaster where CompanyID=" & GBLCompanyID & " And LedgerGroupID='" & TabelID & "' and isnull(IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open EmpMachineAllocation  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveEmpMachineAllocation(ByVal CostingDataMachinAllocation As Object, ByVal EmployeID As String, ByVal GridRow As String) As String

        Dim KeyField, maxValue As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            db.ExecuteNonSQLQuery("Delete from EmployeeMachineAllocation WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & EmployeID & "' and isnull(IsDeletedTransaction,0)<>1")

            If GridRow <> "" Then
                maxValue = db.GenerateMaxVoucherNo("EmployeeMachineAllocation", "EmployeeMachineAllocationID", " CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)<>1")

                TableName = "EmployeeMachineAllocation"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,MachineIDString,EmployeeMachineAllocationID"
                AddColValue = "Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GridRow & "','" & maxValue & "'"
                db.InsertDatatableToDatabase(CostingDataMachinAllocation, TableName, AddColName, AddColValue)
            End If

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function
    ''----------------------------Close EmpMachineAllocation  Save Data  ------------------------------------------
    '-----------------------------------Get MachineID String------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistMachineID(ByVal EmployeeID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim VendorID As String = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And VendorID =" & VendorID)

        str = "Select Top(1) MachineIDString from EmployeeMachineAllocation Where CompanyID=" & GBLCompanyID & " and LedgerID='" + EmployeeID + "' And isnull(IsDeletedTransaction,0)<>1 " & VendorID

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Vendor Wise Machine Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function VendorMachineGrid(ByVal VendorID As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And MM.VendorID IN(Select VendorID From LedgerMaster Where CompanyID=" & GBLCompanyID & " And IsDeletedTransaction = 0 And LedgerID=" & VendorID & ")")
        str = "Select MM.MachineID, MM.MachineName, MM.DepartmentID ,DM.DepartmentName From MachineMaster As MM Inner Join DepartmentMaster as DM on MM.DepartmentID=DM.DepartmentID And MM.CompanyID=DM.CompanyID Where MM.CompanyID=" & GBLCompanyID &
                " And MM.IsDeletedTransaction = 0 " & VendorID & " Order By MM.MachineName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    ''----------------------------Open EmployeeMachineAllocation  Delete From GridClick  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteEmpMacineAllo(ByVal LedgerID As String) As String
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update EmployeeMachineAllocation Set DeletedBy=" & GBLUserID & ",DeletedDate=GETDATE(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " And LedgerID=" & LedgerID
            KeyField = db.ExecuteNonSQLQuery(str)
        Catch ex As Exception
            KeyField = "Not match"
        End Try
        Return KeyField
    End Function

    '-----------------------------------Get FieldNameName (SaveAs)------------------------------------------
    Private Function DuplicateLedgerGroupValidate(ByVal TabelID As String, ByVal tblObj As Object) As Boolean
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim str2, ColValue As String
        Dim dtExist As New DataTable
        Dim dt As New DataTable
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str2 = "Select nullif(SaveAsString,'') as SaveAsString From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " and LedgerGroupID='" & TabelID & "' and Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                If IsDBNull(dtExist.Rows(0)(0)) = True Then
                    Return False
                Else
                    Dim GetColumn As String
                    GetColumn = dtExist.Rows(0)(0)
                    '  GetColumn = "LedgerName, MailingName"
                    db.ConvertObjectToDatatable(tblObj, dt)
                    ColValue = ""
                    For i As Integer = 0 To dt.Rows.Count - 1
                        If GetColumn.Contains(dt.Rows(i)("FieldName")) Then
                            If ColValue = "" Then
                                ColValue = "And Isnull(IsDeletedTransaction,0)<>1 And LedgerGroupID In(Select Distinct LedgerGroupID From LedgerMasterDetails Where FieldName=''" & dt.Rows(i)("FieldName") & "'' And FieldValue=''" & dt.Rows(i)("FieldValue") & "'')"
                            Else
                                ColValue = ColValue & " And LedgerGroupID In(Select Distinct LedgerGroupID From LedgerMasterDetails Where FieldName=''" & dt.Rows(i)("FieldName") & "'' And FieldValue=''" & dt.Rows(i)("FieldValue") & "'')"
                            End If
                        End If
                    Next
                    str2 = "Exec GetFilteredLedgerMasterData 'LedgerMasterDetails'," & GBLCompanyID & "," & TabelID & ",'" & ColValue & "'"
                    dtExist.Clear()
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




    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SessionTimeOut() As Integer
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        HttpContext.Current.Session("Reset") = True
        Session("Reset") = True
        Dim timeout As Integer = GetSessionTimeout()
        HttpContext.Current.Session.Timeout = timeout / 1000 / 60 ''added by pKp extends session timeout
        Return timeout
    End Function

    Private Shared Function GetSessionTimeout() As Integer
        Dim config As Configuration = WebConfigurationManager.OpenWebConfiguration("~/Web.Config")
        Dim section As SessionStateSection = CType(config.GetSection("system.web/sessionState"), SessionStateSection)
        'Return Convert.ToInt32(section.Timeout.TotalMinutes * 1000 * 60)
        Dim timeout As Integer = CInt(section.Timeout.TotalMinutes) * 1000 * 60
        Return timeout

    End Function

    '-----------------------------------Get LedgerGroupNameID------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetLedgerGroupNameID(ByVal MID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select LedgerGroupNameID from LedgerGroupMaster where LedgerGroupID='" & MID & "'  And COmpanyID=" & GBLCompanyID & " "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function



    '-----------------------------------Get Supplier Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSupplierName(ByVal LedgerGrNID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Isnull(LedgerID,0) AS LedgerID,Nullif(LedgerName,'') AS LedgerName From LedgerMaster Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 " &
                " And LedgerGroupID In(Select Distinct LedgerGroupID From LedgerGroupMaster Where COmpanyID=" & GBLCompanyID & " AND LedgerGroupNameID ='" & LedgerGrNID & "') Order By Nullif(LedgerName,'')"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Item Group Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GroupGrid() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Isnull(ItemGroupID,0) AS ItemGroupID,Nullif(ItemGroupName,'') AS ItemGroupName From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 Order By Nullif(ItemGroupName,'')"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Item Group Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SpareGroupGrid() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct SparePartGroup from SparePartMaster Where CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By SparePartGroup"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get MachineID String------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistGroupID(ByVal SupplierID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select top(1) nullif(GroupAllocationIDString,'') as GroupAllocationIDString from SupplierItemGroupAllocation where CompanyID=" & GBLCompanyID & " and LedgerID='" + SupplierID + "' And isnull(IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open SupplierWiseGroupAllocation  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveGroupAllocation(ByVal CostingDataGroupAllocation As Object, ByVal SuppID As String, ByVal GridRow As String, ByVal ObjSparePartAllocation As Object) As String

        Dim dt As New DataTable
        Dim KeyField, maxValue As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            db.ExecuteNonSQLQuery("Delete from SupplierItemGroupAllocation WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & SuppID & "' and isnull(IsDeletedTransaction,0)<>1")
            db.ExecuteNonSQLQuery("Delete from SupplierSpareGroupAllocation WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & SuppID & "' and isnull(IsDeletedTransaction,0)<>1")

            If GridRow <> "" Then
                Dim dtExist As New DataTable
                TableName = "SupplierItemGroupAllocation"
                maxValue = db.GenerateMaxVoucherNo(TableName, "SupplierItemGroupAllocationID", " CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0")

                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GroupAllocationIDString,SupplierItemGroupAllocationID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GridRow & "','" & maxValue & "'"
                str = db.InsertDatatableToDatabase(CostingDataGroupAllocation, TableName, AddColName, AddColValue)
            End If

            TableName = "SupplierSpareGroupAllocation"
            maxValue = db.GenerateMaxVoucherNo(TableName, "SupplierSpareGroupAllocationID", " CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0")
            AddColName = "SupplierSpareGroupAllocationID,ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
            AddColValue = "" & maxValue & ",'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"
            str = db.InsertDatatableToDatabase(ObjSparePartAllocation, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open GroupAllocation  Delete From GridClick  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteGroupAllo(ByVal LedgerID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            str = "Update SupplierItemGroupAllocation Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and LedgerID='" & LedgerID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "Not match"
        End Try
        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistSparesGroupID(ByVal SupplierID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select STUFF((SELECT DISTINCT ','+(c.SparePartGroup) FROM [dbo].[SupplierSpareGroupAllocation] c Where c.CompanyID=" & GBLCompanyID & " and c.LedgerID=" + SupplierID + " And c.IsDeletedTransaction=0 FOR XML PATH(''), TYPE ).value('.', 'nvarchar(max)'), 1, 1, '') As IDString;"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FieldTypeLoadData() As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select distinct FieldType from LedgerGroupFieldMaster where CompanyID=" & GBLCompanyID
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ITEMFieldTypeLoadData() As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select distinct FieldType from ItemGroupFieldMaster where CompanyID=" & GBLCompanyID
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LedgerMasterLoadList() As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select LedgerGroupID,LedgerGroupNameDisplay from LedgerGroupMaster where CompanyID=" & GBLCompanyID
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ItemMasterLoadList() As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select ItemGroupID,ItemGroupName from ItemGroupMaster where CompanyID=" & GBLCompanyID
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LedgerGroupIDWiseData(ByVal LedgerGroupID As String) As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select LGFM.FieldType, LGFM.LedgerGroupFieldID,LGFM.LedgerGroupID,LGFM.FieldName,LGFM.FieldDataType,LGFM.FieldDescription,LGFM.IsDisplay,LGFM.IsCalculated,LGFM.FieldFormula,LGFM.FieldTabIndex,LGFM.FieldDrawSequence,LGFM.FieldDefaultValue,LGFM.IsActive,LGFM.FieldDisplayName,LGFM.SelectBoxQueryDB,LGFM.SelectBoxDefault,LGFM.ControllValidation,LGFM.FieldFormulaString,LGFM.IsLocked,LGFM.IsDeletedTransaction from LedgerGroupFieldMaster as LGFM Inner Join LedgerGroupMaster as LGM on LGM.LedgerGroupID = LGFM.LedgerGroupID and LGM.CompanyID = LGFM.CompanyID and isnull(LGM.IsDeleted,0)=0 where LGFM.LedgerGroupID = '" & LedgerGroupID & "'  and LGFM.CompanyID = " & GBLCompanyID & " and ISNULL(LGFM.IsDeleted,0)=0 order by LGFM.FieldDrawSequence"
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ItemGroupIDWiseData(ByVal LedgerGroupID As String) As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select LGFM.FieldType, LGFM.ItemGroupFieldID,LGFM.ItemGroupID,LGFM.FieldName,LGFM.FieldDataType,LGFM.FieldDescription,LGFM.IsDisplay,LGFM.IsCalculated,LGFM.FieldFormula,LGFM.FieldTabIndex,LGFM.FieldDrawSequence,LGFM.FieldDefaultValue,LGFM.IsActive,LGFM.FieldDisplayName,LGFM.SelectBoxQueryDB,LGFM.SelectBoxDefault,LGFM.ControllValidation,LGFM.FieldFormulaString,LGFM.IsLocked,LGFM.IsDeletedTransaction from ItemGroupFieldMaster as LGFM Inner Join ItemGroupMaster as LGM on LGM.ItemGroupID = LGFM.ItemGroupID and LGM.CompanyID = LGFM.CompanyID and isnull(LGM.IsDeleted,0)=0 where LGFM.ItemGroupID =" & LedgerGroupID & "and LGFM.CompanyID = " & GBLCompanyID & " and ISNULL(LGFM.IsDeleted,0)=0 order by LGFM.FieldDrawSequence"
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetItemsList() As String
        Dim cmd As New SqlCommand
        Dim str As String
        Dim dt As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select ItemId,ItemCode,ItemName,Quality,StockCategory,GSM,ItemSize,ItemDescription,ItemType,StockUnit,EstimationUnit from ItemMaster where isnull(IsDeletedTransaction,0) <> 1 and CompanyID =" & GBLCompanyID
        db.FillDataTable(dt, str)

        data.Message = db.ConvertDataTableTojSonString(dt)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveConfiguration(ByVal Data As Object) As String

        Dim dt As New DataTable
        Dim KeyField, LedgerID As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim ToUpdateQuery = ""
        ConvertObjectToDatatableNEW(Data, dt)
        Try
            For index = 0 To dt.Rows.Count - 1
                ToUpdateQuery += "Update LedgerGroupFieldMaster set FieldDisplayName = '" & dt.Rows(index)("FieldDisplayName") & "',IsDisplay = '" & dt.Rows(index)("IsDisplay") & "',FieldDrawSequence = '" & dt.Rows(index)("FieldDrawSequence") & "',IsActive = '" & dt.Rows(index)("IsActive") & "',FieldType = '" & dt.Rows(index)("FieldType") & "',IsLocked = '" & dt.Rows(index)("IsLocked") & "'where LedgerGroupFieldID =" & dt.Rows(index)("LedgerGroupFieldID") & ";"
            Next
            KeyField = db.ExecuteNonSQLQuery(ToUpdateQuery)

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveItemConfiguration(ByVal Data As Object) As String

        Dim dt As New DataTable
        Dim KeyField, LedgerID As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim ToUpdateQuery = ""
        ConvertObjectToDatatableNEW(Data, dt)
        Try
            For index = 0 To dt.Rows.Count - 1
                ToUpdateQuery += "Update ItemGroupFieldMaster set FieldDisplayName = '" & dt.Rows(index)("FieldDisplayName") & "',IsDisplay = '" & dt.Rows(index)("IsDisplay") & "',FieldDrawSequence = '" & dt.Rows(index)("FieldDrawSequence") & "',IsActive = '" & dt.Rows(index)("IsActive") & "',FieldType = '" & dt.Rows(index)("FieldType") & "',IsLocked = '" & dt.Rows(index)("IsLocked") & "'where ItemGroupFieldID =" & dt.Rows(index)("ItemGroupFieldID") & ";"
            Next
            KeyField = db.ExecuteNonSQLQuery(ToUpdateQuery)

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