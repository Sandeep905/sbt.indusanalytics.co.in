Imports System.Data
Imports System.Data.SqlClient
Imports System.Net
Imports System.Net.Mail
Imports System.Web.Script.Serialization
Imports Newtonsoft.Json

Namespace Connection

    Public Class DBConnection
        Public Db As New SqlConnection
        Public IndexName As String
        Private DA As SqlDataAdapter
        Dim str As String
        'Dim constr As String = ConfigurationManager.ConnectionStrings("constr").ConnectionString
        ' Dim con As New SqlConnection(constr)        
        Dim dt As New DataTable
        Dim flagID As Boolean
        Dim UniqueId As String
        Dim GblCompanyName As String

#Region "Constructor"

        Public Sub New()

        End Sub

        Public Sub New(ByVal ConnectionOpen As Boolean)
            OpenDataBase()
            Db.Open()
        End Sub

#End Region

#Region "Method"

        Public Function OpenDataBase() As SqlConnection
            Dim i As Integer = 0
            Dim constring As String
            'constring = "Data Source = 95.217.184.123\MSSQLSERVER2019;Initial Catalog=softber4_indus;Persist Security Info=True;User ID=softber4sql;Password=%9Lb535ze"
            constring = "Data Source = 65.2.64.18,1433;Initial Catalog=IndusEnterprise_SBT;Persist Security Info=True;User ID=Indus_SBT;Password=@5X10&#$313INDUS#!"
            'constring = "Data Source = PAWAN;Initial Catalog=IndusEnterprise;Persist Security Info=True;User ID=Indus;Password=Param@99811"

            Try
                Db = New SqlConnection
                Db.ConnectionString = constring
                'Db.ConnectionString = ConfigurationManager.ConnectionStrings.Item("PrintXP5ConnectionString1").ConnectionString
m:
                If i = 1 Then
                    Db = New SqlConnection
                    Db.ConnectionString = constring
                End If
                Db.Open()
                Return Db
            Catch ex As Exception
                If i = 0 Then
                    i = i + 1
                    If Db.State = ConnectionState.Open Then
                        Db.Close()
                    End If
                    GoTo m
                Else
                    If Db.State = ConnectionState.Open Then
                        Db.Close()
                    End If
                End If
                Return Db
            End Try
        End Function

        Public Sub FillDataTable(ByRef DataTableObj As DataTable, ByVal SqlSelectQuery As String, Optional ByVal SqlStoredProcedure As String = "")
            Try
                'GblCompanyName = Convert.ToString(HttpContext.Current.Session("CompanyName"))
                'GetCompName(GblCompanyName)
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If
                Dim cmd As SqlCommand
                If Trim(SqlSelectQuery) = "" Then
                    cmd = New SqlCommand(SqlStoredProcedure, Db)
                    cmd.CommandType = CommandType.StoredProcedure
                Else
                    cmd = New SqlCommand(SqlSelectQuery, Db)
                End If
                cmd.CommandTimeout = 300
                DA = New SqlDataAdapter(cmd)
                DA.Fill(DataTableObj)
                Db.Close()
            Catch ex As Exception
                'MsgBox(ex.Message)
                If Db.State = ConnectionState.Open Then
                    Db.Close()
                End If
            End Try
        End Sub
        '==========================================IsDeletable===========================================================================
        Public Function IsDeletable(ByVal FieldName As String, ByVal TableName As String, Optional SearchCondition As String = "") As Boolean
            Try
                'Dim constr As String = ConfigurationManager.ConnectionStrings("constr").ConnectionString
                'Dim con As New SqlConnection(constr)
                Dim dt As New DataTable
                str = "SELECT " & FieldName & " FROM " & TableName & " " & SearchCondition
                FillDataTable(dt, str)
                If dt.Rows.Count = 0 Then
                    IsDeletable = True
                Else
                    IsDeletable = False
                End If
            Catch ex As Exception
                Return ex.Message
            End Try
            Return IsDeletable
        End Function

        Public Sub FillDataSet(ByRef DataSetObj As DataSet, ByVal SqlSelectQuery As String, Optional ByVal SqlStoredProcedure As String = "")
            Try
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If
                Dim cmd As New SqlCommand
                If Trim(SqlSelectQuery) = "" Then
                    cmd.CommandText = SqlStoredProcedure
                    cmd.CommandType = CommandType.StoredProcedure
                Else
                    cmd = New SqlCommand(SqlSelectQuery, Db)
                End If

                DA = New SqlDataAdapter(cmd)
                DA.Fill(DataSetObj)
                Db.Close()
            Catch ex As Exception
                '   MsgBox(ex.Message)
            End Try
        End Sub

        Public Sub FillDataReader(ByRef DataSetObj As SqlDataReader, ByVal SqlSelectQuery As String, Optional ByVal SqlStoredProcedure As String = "")
            Try
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If
                Dim cmd As New SqlCommand
                If Trim(SqlSelectQuery) = "" Then
                    cmd.CommandText = SqlStoredProcedure
                    cmd.CommandType = CommandType.StoredProcedure
                Else
                    cmd = New SqlCommand(SqlSelectQuery, Db)
                End If

                DataSetObj = cmd.ExecuteReader()

                Db.Close()
            Catch ex As Exception
                ' MsgBox(ex.Message)
            End Try
        End Sub

        Public Sub FillCombo(ByRef DropDownListName As DropDownList, ByVal TableName As String, ByVal FieldName As String, Optional ByVal KeyFieldName As String = "", Optional ByVal SearchCondition As String = "")
            Try
                If Trim(SearchCondition) = "" Then
                    SearchCondition = "  Where ISNULL(" & FieldName & ",'')<>'' "
                Else
                    SearchCondition = SearchCondition + "  and ISNULL(" & FieldName & ",'')<>'' "
                End If

                Dim Sql As String = ""
                If Trim(TableName) <> "" And Trim(FieldName) <> "" Then
                    If Trim(KeyFieldName) = "" Then
                        Sql = "SELECT DISTINCT  " + FieldName + "  FROM  " + TableName + "  " + SearchCondition
                    Else
                        Sql = "SELECT DISTINCT  " + KeyFieldName + "," + FieldName + "  FROM  " + TableName + "  " + SearchCondition
                    End If
                    Dim dt As New DataTable
                    FillDataTable(dt, Sql)
                    DropDownListName.DataSource = dt
                    DropDownListName.DataTextField = FieldName
                    If Trim(KeyFieldName) <> "" Then
                        DropDownListName.DataValueField = KeyFieldName
                    End If
                    DropDownListName.DataBind()
                    DropDownListName.Items.Insert(0, "--Select--")
                End If
            Catch ex As Exception
                ' MsgBox(ex.Message)
            End Try
        End Sub

        Public Function InsertDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, ByVal AddColValue As String, Optional ByVal VoucherType As String = "", Optional ByVal TransactionID As String = "") As String
            '  Dim constr As String = ConfigurationManager.ConnectionStrings("constr").ConnectionString
            '  Dim con As New SqlConnection(constr)
            Db = OpenDataBase()
            If Db.State = ConnectionState.Closed Then
                Db.Open()
            End If
            Dim KeyReturn As String = 0
            Dim ColName As String = ""
            Dim TransID As String = ""
            Dim ColValue As String
            Dim dt As New DataTable
            Try
                ConvertObjectToDatatable(JsonObject, dt, str)
                If str <> "Success" Then
                    Return str
                End If
                ColName = ""
                For Each column In dt.Columns
                    If column.ColumnName <> "Id" Then ''''indexed db Id not for store
                        If ColName = "" Then
                            ColName = column.ColumnName
                        Else
                            ColName = ColName & "," & column.ColumnName
                        End If
                    End If
                Next

                For i As Integer = 0 To dt.Rows.Count - 1
                    ColValue = ""
                    For Each column In dt.Columns
                        If column.ColumnName <> "Id" Then
                            'If column.dataType.Name = "String" Then
                            '    If ColValue = "" Then
                            '        ColValue = "'" & dt.Rows(i)(column.ColumnName) & "'"
                            '    Else
                            '        ColValue = ColValue & "," & "'" & Replace(dt.Rows(i)(column.ColumnName), "'", "") & "'"
                            '    End If
                            'Else
                            If VoucherType = "Receipt Note" Then
                                If column.ColumnName = "TransID" Then
                                    TransID = "" & dt.Rows(i)(column.ColumnName) & ""
                                End If
                            End If
                            If column.ColumnName = "BatchNo" And VoucherType = "Receipt Note" Then
                                If ColValue = "" Then
                                    ColValue = "'" & TransactionID & dt.Rows(i)(column.ColumnName) & "_" & TransID & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & TransactionID & dt.Rows(i)(column.ColumnName) & "_" & TransID & "'"
                                End If
                            Else
                                If column.ColumnName = "ParentTransactionID" Then
                                    If dt.Rows(i)(column.ColumnName) <= 0 Then
                                        dt.Rows(i)(column.ColumnName) = TransactionID
                                    End If
                                End If
                                If ColValue = "" Then
                                    ColValue = "'" & dt.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & dt.Rows(i)(column.ColumnName) & "'"
                                End If
                            End If


                            'End If
                        End If
                    Next
                    If AddColName = "" Then
                        str = "Insert Into " & TableName & "( " & ColName & ") Values( " & ColValue & ")"
                    Else
                        str = "Insert Into " & TableName & "( " & ColName & "," & AddColName & ") Values(" & ColValue & "," & AddColValue & ")"
                    End If

                    str = str & "SELECT SCOPE_IDENTITY();"
                    Dim cmd = New SqlCommand(str, Db)
                    cmd.CommandTimeout = Db.ConnectionTimeout
                    ''cmd.ExecuteNonQuery()
                    KeyReturn = cmd.ExecuteScalar()
                Next
                Db.Close()
                dt = Nothing
                Return KeyReturn
            Catch ex As Exception
                If Db.State = ConnectionState.Open Then
                    Db.Close()
                End If
                KeyReturn = ex.Message
            End Try
            Return KeyReturn
        End Function


        Public Function ProductionInsertDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, ByVal AddColValue As String, ByRef con As SqlConnection, ByRef objTrans As SqlTransaction, Optional ByVal VoucherType As String = "", Optional ByVal TransactionID As String = "") As String

            'Db = OpenDataBase()
            'If Db.State = ConnectionState.Closed Then
            '    Db.Open()
            'End If
            Db = con
            Dim KeyReturn As String = ""
            Dim ColName As String = ""
            Dim TransID As String = ""
            Dim ColValue As String
            Dim dt As New DataTable
            ConvertObjectToDatatable(JsonObject, dt)

            Try
                ColName = ""
                For Each column In dt.Columns
                    If column.ColumnName <> "Id" Then ''''indexed db Id not for store
                        If ColName = "" Then
                            ColName = column.ColumnName
                        Else
                            ColName = ColName & "," & column.ColumnName
                        End If
                    End If
                Next

                For i As Integer = 0 To dt.Rows.Count - 1
                    ColValue = ""
                    For Each column In dt.Columns
                        If column.ColumnName <> "Id" Then
                            'If column.dataType.Name = "String" Then
                            '    If ColValue = "" Then
                            '        ColValue = "'" & dt.Rows(i)(column.ColumnName) & "'"
                            '    Else
                            '        ColValue = ColValue & "," & "'" & Replace(dt.Rows(i)(column.ColumnName), "'", "") & "'"
                            '    End If
                            'Else
                            If VoucherType = "Receipt Note" Then
                                If column.ColumnName = "TransID" Then
                                    TransID = "" & dt.Rows(i)(column.ColumnName) & ""
                                End If
                            End If
                            If column.ColumnName = "BatchNo" And VoucherType = "Receipt Note" Then
                                If ColValue = "" Then
                                    ColValue = "'" & TransactionID & dt.Rows(i)(column.ColumnName) & "_" & TransID & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & TransactionID & dt.Rows(i)(column.ColumnName) & "_" & TransID & "'"
                                End If
                            Else
                                If column.ColumnName = "ParentTransactionID" Then
                                    If dt.Rows(i)(column.ColumnName) <= 0 Then
                                        dt.Rows(i)(column.ColumnName) = TransactionID
                                    End If
                                End If
                                If ColValue = "" Then
                                    ColValue = "'" & dt.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & dt.Rows(i)(column.ColumnName) & "'"
                                End If
                            End If


                            'End If
                        End If
                    Next
                    If AddColName = "" Then
                        str = "Insert Into " & TableName & "( " & ColName & ") Values( " & ColValue & ")"
                    Else
                        str = "Insert Into " & TableName & "( " & ColName & "," & AddColName & ") Values(" & ColValue & "," & AddColValue & ")"
                    End If

                    str = str & "SELECT SCOPE_IDENTITY();"
                    Dim cmd = New SqlCommand(str, Db)
                    cmd.Transaction = objTrans
                    KeyReturn = cmd.ExecuteScalar()
                Next
                '  Db.Close()
                dt = Nothing
                Return KeyReturn
            Catch ex As Exception
                KeyReturn = ex.Message
            End Try
            Return KeyReturn
        End Function

        Public Function ProductionUpdateDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, ByVal Pvalue As Integer, ByRef con As SqlConnection, ByRef objTrans As SqlTransaction, Optional ByVal wherecndtn As String = "") As String
            Dim KeyField As String = ""

            Try
                UniqueId = ""
                ConvertObjectToDatatable(JsonObject, dt)

                'Db = OpenDataBase()
                'If Db.State = ConnectionState.Closed Then
                '    Db.Open()
                'End If
                Db = con
                Dim Cnt As Integer = 1

                For i As Integer = 0 To dt.Rows.Count - 1
                    str = ""
                    UniqueId = ""
                    Cnt = 1
                    For Each column In dt.Columns
                        If Cnt <= Pvalue Then
                            UniqueId = UniqueId & column.ColumnName & " ='" & dt.Rows(i)(column.ColumnName) & "' And "
                            Cnt = Cnt + 1
                        Else
                            str = str & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "',"  ' Console.WriteLine(column.ColumnName)
                        End If
                    Next
                    str = Left(str, Len(str) - 1)
                    If UniqueId <> "" Then UniqueId = Left(UniqueId, Len(UniqueId) - 4)
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

                    str = "Update " & TableName & " Set " & str & " Where " & UniqueId

                    Dim cmd As New SqlCommand(str, Db) With {
                    .CommandType = CommandType.Text,
                    .Transaction = objTrans
                }
                    cmd.ExecuteNonQuery()
                Next
                'Db.Close()
                KeyField = "Success"

                'Dim query = From iex In dt.AsEnumerable()
                '            Join idb In dt.AsEnumerable()
                '                On iex("FieldName") Equals idb("FieldName") And iex("FieldValue") Equals idb("FieldValue")
                '            Select iex

            Catch ex As Exception
                Return ex.Message
            End Try
            Return KeyField
        End Function

        Public Function InsertKeylineDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, ByVal AddColValue As String, Optional ByVal ConStr As String = "") As String
            Dim con As New SqlConnection(ConStr)

            If con.State = ConnectionState.Closed Then
                con.Open()
            End If
            Dim KeyReturn As String = 0
            Dim ColName As String = ""
            Dim TransID As String = ""
            Dim ColValue As String
            Dim dt As New DataTable
            Try
                ConvertObjectToDatatable(JsonObject, dt, str)
                If str <> "Success" Then
                    Return str
                End If
                ColName = ""
                For Each column In dt.Columns
                    If column.ColumnName <> "Id" Then ''''indexed db Id not for store
                        If ColName = "" Then
                            ColName = column.ColumnName
                        Else
                            ColName = ColName & "," & column.ColumnName
                        End If
                    End If
                Next

                For i As Integer = 0 To dt.Rows.Count - 1
                    ColValue = ""
                    For Each column In dt.Columns
                        If column.ColumnName <> "Id" Then
                            If ColValue = "" Then
                                ColValue = "'" & dt.Rows(i)(column.ColumnName) & "'"
                            Else
                                ColValue = ColValue & "," & "'" & dt.Rows(i)(column.ColumnName) & "'"
                            End If
                        End If
                    Next
                    If AddColName = "" Then
                        str = "Insert Into " & TableName & "( " & ColName & ") Values( " & ColValue & ")"
                    Else
                        str = "Insert Into " & TableName & "( " & ColName & "," & AddColName & ") Values(" & ColValue & "," & AddColValue & ")"
                    End If

                    str = str & "SELECT SCOPE_IDENTITY();"
                    Dim cmd = New SqlCommand(str, con) With {
                        .CommandTimeout = con.ConnectionTimeout
                    }
                    KeyReturn = cmd.ExecuteScalar()
                Next
                con.Close()
                dt = Nothing
                Return KeyReturn
            Catch ex As Exception
                If con.State = ConnectionState.Open Then
                    con.Close()
                End If
                KeyReturn = ex.Message
            End Try
            Return KeyReturn
        End Function

        Private Sub ExecuteSqlTransaction(ByVal connectionString As String)
            Using connection As New SqlConnection(connectionString)
                connection.Open()

                Dim command As SqlCommand = connection.CreateCommand()
                Dim transaction As SqlTransaction

                ' Start a local transaction
                transaction = connection.BeginTransaction("SampleTransaction")

                ' Must assign both transaction object and connection
                ' to Command object for a pending local transaction.
                command.Connection = connection
                command.Transaction = transaction

                Try
                    command.CommandText =
              "Insert into Region (RegionID, RegionDescription) VALUES (100, 'Description')"
                    command.ExecuteNonQuery()
                    command.CommandText =
              "Insert into Region (RegionID, RegionDescription) VALUES (101, 'Description')"

                    command.ExecuteNonQuery()

                    ' Attempt to commit the transaction.
                    transaction.Commit()
                    Console.WriteLine("Both records are written to database.")

                Catch ex As Exception
                    Console.WriteLine("Commit Exception Type: {0}", ex.GetType())
                    Console.WriteLine("  Message: {0}", ex.Message)

                    ' Attempt to roll back the transaction.
                    Try
                        transaction.Rollback()

                    Catch ex2 As Exception
                        ' This catch block will handle any errors that may have occurred
                        ' on the server that would cause the rollback to fail, such as
                        ' a closed connection.
                        Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType())
                        Console.WriteLine("  Message: {0}", ex2.Message)
                    End Try
                End Try
            End Using
        End Sub

        ''' <summary>
        ''' ''Save Booking operations data contents wise
        ''' </summary>
        ''' <param name="PObject">Operation data</param>
        ''' <param name="STableName">secondary table name</param>
        ''' <param name="AddColName">extra columns</param>
        ''' <param name="AddColValue">extra columns value</param>
        ''' <returns></returns>
        Public Function AddToDatabaseOperation(ByVal PObject As Object, ByVal STableName As String, ByVal AddColName As String, ByVal AddColValue As String) As String

            Dim KeyField As String
            Dim ColName As String = ""
            Dim ColValue As String
            Dim dts As New DataTable
            Dim WherCol As String = ""

            ConvertObjectToDatatable(PObject, dts)

            Try
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If

                ColName = ""
                For Each column In dts.Columns
                    If column.ColumnName <> "Id" Then
                        If ColName = "" Then
                            ColName = column.ColumnName
                        Else
                            ColName = ColName & "," & column.ColumnName
                        End If
                    End If
                Next
                For i As Integer = 0 To dts.Rows.Count - 1
                    ColValue = ""
                    For Each column In dts.Columns
                        If column.ColumnName <> "Id" Then
                            If ColValue = "" Then
                                ColValue = "'" & dts.Rows(i)(column.ColumnName) & "'"
                            Else
                                ColValue = ColValue & "," & "'" & dts.Rows(i)(column.ColumnName) & "'"
                            End If
                        End If
                        If column.ColumnName = "PlanContQty" Or column.ColumnName = "PlanContentType" Or column.ColumnName = "PlanContName" Then
                            If WherCol = "" Then
                                WherCol = "Where " & "" & column.ColumnName & "='" & dts.Rows(i)(column.ColumnName) & "' And "
                            Else
                                WherCol = WherCol & "" & column.ColumnName & "='" & dts.Rows(i)(column.ColumnName) & "' And "
                            End If
                        End If
                    Next
                    WherCol = WherCol.Remove(WherCol.Length - 4, 4)
                    str = "Insert Into " & STableName & "( " & ColName & "," & AddColName & ",ContentsId) " &
                        "Select " & ColValue & "," & AddColValue & ",(Select Max(JobContentsID) From JobBookingContents " & WherCol & ");"
                    Dim cmd = New SqlCommand(str, Db)
                    cmd.ExecuteNonQuery()
                    WherCol = ""
                Next
                Db.Close()
                dts = Nothing
                KeyField = "200"

            Catch ex As Exception
                KeyField = ex.Message
            End Try
            Return KeyField
        End Function

        ''' <summary>
        ''' Insert Job card and product master content id in process and forms 
        ''' </summary>
        ''' <param name="Dts">Save Data Table</param>
        ''' <param name="STableName">Table in which data is insert</param>
        ''' <param name="AddColName">Extra column name</param>
        ''' <param name="AddColValue">Extra column name's value</param>
        ''' <param name="PTableName">Primary table name from which identity column is fetch</param>
        ''' <param name="STableColumn">Secondary table column name in which primary key value is insert</param>
        ''' <param name="PTblMaxColumn">Primary table identity key name</param>
        ''' <returns></returns>
        Public Function InsertSecondaryDataJobCard(ByVal Dts As DataTable, ByVal STableName As String, ByVal AddColName As String, ByVal AddColValue As String, ByVal PTableName As String, ByVal STableColumn As String, ByVal PTblMaxColumn As String, Optional ByVal WhereCndtn As String = "") As String

            Dim KeyField As String
            Dim ColName As String = ""
            Dim ColValue As String
            Dim WherCol As String = ""

            Try
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If

                ColName = ""
                For Each column In Dts.Columns
                    If STableName.ToUpper() <> "ITEMTRANSACTIONDETAIL" Then
                        If column.ColumnName <> "Id" Then
                            If ColName = "" Then
                                ColName = column.ColumnName
                            Else
                                ColName = ColName & "," & column.ColumnName
                            End If
                        End If
                    Else
                        If column.ColumnName <> "Id" And column.ColumnName <> "PlanContQty" And column.ColumnName <> "PlanContentType" And column.ColumnName <> "PlanContName" Then
                            If ColName = "" Then
                                ColName = column.ColumnName
                            Else
                                ColName = ColName & "," & column.ColumnName
                            End If
                        End If
                    End If

                Next
                For i As Integer = 0 To Dts.Rows.Count - 1
                    ColValue = ""
                    For Each column In Dts.Columns
                        If STableName.ToUpper() <> "ITEMTRANSACTIONDETAIL" Then
                            If column.ColumnName <> "Id" Then
                                If ColValue = "" Then
                                    ColValue = "'" & Dts.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & Dts.Rows(i)(column.ColumnName) & "'"
                                End If

                            End If
                        Else
                            If column.ColumnName <> "Id" And column.ColumnName <> "PlanContQty" And column.ColumnName <> "PlanContentType" And column.ColumnName <> "PlanContName" Then
                                If ColValue = "" Then
                                    ColValue = "'" & Dts.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & "," & "'" & Dts.Rows(i)(column.ColumnName) & "'"
                                End If

                            End If
                        End If

                        If column.ColumnName = "PlanContQty" Or column.ColumnName = "PlanContentType" Or column.ColumnName = "PlanContName" Then
                            If WherCol = "" Then
                                WherCol = "Where " & "" & column.ColumnName & "='" & Dts.Rows(i)(column.ColumnName) & "' And "
                            Else
                                WherCol = WherCol & "" & column.ColumnName & "='" & Dts.Rows(i)(column.ColumnName) & "' And "
                            End If
                        End If
                    Next

                    If STableColumn <> "" Then
                        If WherCol <> "" And WherCol <> Nothing Then WherCol = WherCol & " IsDeletedTransaction=0 " & WhereCndtn '.Remove(WherCol.Length - 4, 4)
                        str = "Insert Into " & STableName & "( " & ColName & "," & AddColName & "," & STableColumn & ") " &
                        "Select " & ColValue & "," & AddColValue & ",(Select Max(" & PTblMaxColumn & ") From " & PTableName & " " & WherCol & ");"
                    Else
                        str = "Insert Into " & STableName & "( " & ColName & "," & AddColName & ") " &
                        "Select " & ColValue & "," & AddColValue & ";"
                    End If

                    Dim cmd = New SqlCommand(str, Db)
                    cmd.ExecuteNonQuery()
                    WherCol = ""
                Next
                Db.Close()
                Dts = Nothing
                KeyField = "200"

            Catch ex As Exception
                If Db.State = ConnectionState.Open Then
                    Db.Close()
                End If
                KeyField = ex.Message
            End Try
            Return KeyField
        End Function

        Public Function UpdateContentsDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, Optional ByVal Pvalue As String = "", Optional ByVal wherecndtn As String = "") As String
            Dim KeyField As String = ""

            Try
                UniqueId = ""
                dt = New DataTable()

                ConvertObjectToDatatable(JsonObject, dt, str)
                If str <> "Success" Then
                    Return str
                End If

                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If

                For i As Integer = 0 To dt.Rows.Count - 1
                    str = ""
                    UniqueId = ""

                    For Each column In dt.Columns
                        If Pvalue <> "" Then
                            If Pvalue.Contains(column.ColumnName) Then
                                UniqueId = UniqueId & column.ColumnName & " ='" & dt.Rows(i)(column.ColumnName) & "' And "
                            Else
                                If column.ColumnName <> "Id" Then
                                    str = str & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "',"  ' Console.WriteLine(column.ColumnName)
                                End If
                            End If
                        Else
                            If column.ColumnName <> "Id" Then
                                str = str & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "',"  ' Console.WriteLine(column.ColumnName)
                            End If
                        End If
                    Next
                    If str <> "" Then
                        str = Left(str, Len(str) - 1)
                    End If
                    If UniqueId <> "" Then UniqueId = Left(UniqueId, Len(UniqueId) - 4)
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

                    str = "Update " & TableName & " Set " & str & " Where " & UniqueId

                    Dim cmd As New SqlCommand(str, Db)
                    cmd.CommandType = CommandType.Text
                    cmd.ExecuteNonQuery()
                Next
                Db.Close()
                KeyField = "Success"

                'Dim query = From iex In dt.AsEnumerable()
                '            Join idb In dt.AsEnumerable()
                '                On iex("FieldName") Equals idb("FieldName") And iex("FieldValue") Equals idb("FieldValue")
                '            Select iex

            Catch ex As Exception
                If Db.State = ConnectionState.Open Then
                    Db.Close()
                End If
                Return ex.Message
            End Try
            Return KeyField
        End Function

        Public Function UpdateDatatableToDatabase(ByVal JsonObject As Object, ByVal TableName As String, ByVal AddColName As String, ByVal Pvalue As Integer, Optional ByVal wherecndtn As String = "") As String
            Dim KeyField As String = ""

            Try
                UniqueId = ""
                dt = New DataTable()

                ConvertObjectToDatatable(JsonObject, dt, str)
                If str <> "Success" Then
                    Return str
                End If

                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If
                Dim Cnt As Integer = 1

                For i As Integer = 0 To dt.Rows.Count - 1
                    str = ""
                    UniqueId = ""
                    Cnt = 1
                    For Each column In dt.Columns
                        If Cnt <= Pvalue Then
                            UniqueId = UniqueId & column.ColumnName & " ='" & dt.Rows(i)(column.ColumnName) & "' And "
                            Cnt = Cnt + 1
                        Else
                            If column.ColumnName <> "Id" Then
                                str = str & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "',"  ' Console.WriteLine(column.ColumnName)
                            End If
                        End If
                    Next
                    If str <> "" Then
                        str = Left(str, Len(str) - 1)
                    End If
                    If UniqueId <> "" Then UniqueId = Left(UniqueId, Len(UniqueId) - 4)
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

                    str = "Update " & TableName & " Set " & str & " Where " & UniqueId

                    Dim cmd As New SqlCommand(str, Db)
                    cmd.CommandType = CommandType.Text
                    cmd.ExecuteNonQuery()
                Next
                Db.Close()
                KeyField = "Success"

                'Dim query = From iex In dt.AsEnumerable()
                '            Join idb In dt.AsEnumerable()
                '                On iex("FieldName") Equals idb("FieldName") And iex("FieldValue") Equals idb("FieldValue")
                '            Select iex

            Catch ex As Exception
                If Db.State = ConnectionState.Open Then
                    Db.Close()
                End If
                Return ex.Message
            End Try
            Return KeyField
        End Function

        Public Function ExecuteNonSQLQuery(ByVal QueryStr As String) As String
            Dim ReMsg As String
            Try
                Db = OpenDataBase()
                If Db.State = ConnectionState.Closed Then
                    Db.Open()
                End If

                Dim cmd As New SqlCommand(QueryStr, Db) With {
                    .CommandType = CommandType.Text,
                    .CommandTimeout = 0
                }
                cmd.ExecuteNonQuery()
                cmd = Nothing
                Db.Close()
                ReMsg = "Success"
            Catch ex As Exception
                ReMsg = ex.Message
                Db.Close()
            End Try
            Return ReMsg
        End Function

        Public Function ConvertDataSetsTojSonString(ByVal dataset As DataSet) As String
            Dim jsSerializer As JavaScriptSerializer = New JavaScriptSerializer()
            Dim ssvalue As Dictionary(Of String, Object) = New Dictionary(Of String, Object)()
            jsSerializer.MaxJsonLength = 2147483647
            Try

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
            Catch ex As Exception
                Return "Error: " & ex.Message
            End Try
        End Function

        Public Function GenerateInvoiceNo(ByVal TableName As String, ByVal Prefix As String, ByVal MaxFieldName As String, ByRef MaxNoVariable As Integer, ByVal FYear As String, Optional ByVal SearchCondition As String = "") As String
            Dim dt As New DataTable()
            Dim st As String
            Dim i As Integer
            Dim GblCodesize As Integer
            GblCodesize = 5
            st = ""
            FillDataTable(dt, "Select isnull(MAX(isnull(" & MaxFieldName & " ,0)),0) + 1  From  " & TableName & "  " & SearchCondition)
            If dt.Rows.Count > 0 Then
                'For i = 1 To GblCodesize - dt.Rows(0)(0).ToString().Length()
                '    st = Trim(st) & 0
                'Next
                MaxNoVariable = dt.Rows(0)(0)
                If FYear <> "" Then
                    st = Trim(st) & dt.Rows(0)(0) & "/" & Val(Right(FYear, 7)) & "-" & Val(Right(FYear, 2))
                Else
                    st = Trim(st) & dt.Rows(0)(0)
                End If
                GenerateInvoiceNo = Trim(Prefix) & st
            Else
                MaxNoVariable = 1
                If FYear <> "" Then
                    GenerateInvoiceNo = Trim(Prefix) & "00001" & "/" & Val(Right(FYear, 7)) & "-" & Val(Right(FYear, 2))
                Else
                    GenerateInvoiceNo = Trim(Prefix) & "00001"
                End If
            End If
            Return GenerateInvoiceNo
        End Function

        Public Function GeneratePrefixedNo(ByVal TableName As String, ByVal Prefix As String, ByVal MaxFieldName As String, ByRef MaxNoVariable As Integer, ByVal FYear As String, Optional ByVal SearchCondition As String = "") As String
            Dim dt As New DataTable()
            Dim st As String
            Dim i As Integer
            Dim GblCodesize As Integer
            GblCodesize = 5
            st = ""
            FillDataTable(dt, "Select isnull(MAX(isnull(" & MaxFieldName & " ,0)),0) + 1  From  " & TableName & "  " & SearchCondition)
            If dt.Rows.Count > 0 Then
                For i = 1 To GblCodesize - dt.Rows(0)(0).ToString().Length()
                    st = Trim(st) & 0
                Next
                MaxNoVariable = dt.Rows(0)(0)
                If FYear <> "" Then
                    st = Trim(st) & dt.Rows(0)(0) & "_" & Val(Right(FYear, 7)) & "_" & Val(Right(FYear, 2))
                Else
                    st = Trim(st) & dt.Rows(0)(0)
                End If
                GeneratePrefixedNo = Trim(Prefix) & st
            Else
                MaxNoVariable = 1
                If FYear <> "" Then
                    GeneratePrefixedNo = Trim(Prefix) & "00001" & "_" & Val(Right(FYear, 7)) & "_" & Val(Right(FYear, 2))
                Else
                    GeneratePrefixedNo = Trim(Prefix) & "00001"
                End If
            End If
            Return GeneratePrefixedNo
        End Function

        ''************************ Logic Convert Object To DataTable *** Using Newtonsoft *******************************
        Public Function ConvertObjectToDatatable(ByVal jsonObject As Object, ByRef datatable As DataTable, Optional ByRef ErrMsg As String = "") As DataTable
            Try
                Dim st As String = JsonConvert.SerializeObject(jsonObject)
                datatable = JsonConvert.DeserializeObject(Of DataTable)(st)
                ErrMsg = "Success"
            Catch ex As Exception
                ErrMsg = ex.Message
            End Try
            Return datatable
        End Function

        Public Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
            Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()

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
            serializer.MaxJsonLength = 2147483647
            Return serializer.Serialize(tableRows)
        End Function

        Public Function GenerateMaxVoucherNo(ByVal TableName As String, ByVal fieldname As String, Optional ByVal SearchCondition As String = "") As Long
            On Error Resume Next
            Dim dt As New DataTable()
            Dim Sql As String = ""
            Sql = "Select Isnull(MAX(Isnull(" & fieldname & ",0)),0) From " & TableName & " " & SearchCondition
            FillDataTable(dt, Sql)
            If dt.Rows.Count > 0 Then
                GenerateMaxVoucherNo = IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) + 1
            Else
                GenerateMaxVoucherNo = 1
            End If
            Return GenerateMaxVoucherNo
        End Function

        Public Function GenerateProductionCode(ByVal TableName As String, ByVal MaxFieldName As String, ByRef MaxNoVariable As Long, Optional SearchCondition As String = "") As String
            On Error Resume Next
            Dim dt As New DataTable()
            Dim Sql As String = ""
            Sql = "Select isnull(MAX(isnull(" & MaxFieldName & " ,0)),0) + 1  From  " & TableName & "  " & SearchCondition
            FillDataTable(dt, Sql)
            If dt.Rows.Count > 0 Then
                GenerateProductionCode = IIf(IsDBNull(dt.Rows(0)(0)), 1, dt.Rows(0)(0))
            Else
                GenerateProductionCode = 1
            End If
            Return GenerateProductionCode
        End Function

        ''' <summary>
        ''' Check user permissions
        ''' </summary>
        ''' <param name="ModuleName">module page name</param>
        ''' <param name="UserId">User Id</param>
        ''' <param name="CompanyId">Company ID</param>
        ''' <param name="ActionType">CanSave,CanEdit,CanDelete</param>
        ''' <returns>False not allowed OR true allowed</returns>
        Public Function CheckAuthories(ByVal ModuleName As String, ByVal UserId As Integer, ByVal CompanyId As Integer, ByVal ActionType As String, Optional ByVal TransactionDetails As String = "") As Boolean
            Try
                Dim DT As New DataTable
                Dim ModuleID As Integer

                str = "Select Isnull(" & ActionType & ",'False') As Action,MM.ModuleID From UserModuleAuthentication As A Inner Join ModuleMaster As MM On MM.ModuleID=A.ModuleID And MM.CompanyID=A.CompanyID Where Isnull(A.IsDeletedTransaction,0)=0 And A.UserID=" & UserId & " And MM.ModuleName='" & ModuleName & "' And A.CompanyID=" & CompanyId
                FillDataTable(DT, str)
                If DT.Rows.Count > 0 Then
                    If DT.Rows(0)("Action") = False Then
                        Return False
                    End If
                    ModuleID = DT.Rows(0)("ModuleID")
                Else
                    Return False
                End If
                ExecuteNonSQLQuery("Insert Into UserTransactionLogs( ModuleID, ModuleName, Details, RecordID, RecordName, ActionType, UserID, CompanyID, CreatedDate) Values(" & ModuleID & ",'" & ModuleName & "','" & ActionType & " performed on " & TransactionDetails & "',0,'" & TransactionDetails & "','" & ActionType & "'," & UserId & "," & CompanyId & ",Getdate())")
                Return True
            Catch ex As Exception
                Return False
            End Try
        End Function

        Public Function GetColumnValue(ByVal ColumnName As String, ByVal TableName As String, ByVal WhereCndtn As String, Optional ByVal OrderBy As String = "") As String
            Try
                Dim DT As New DataTable
                If OrderBy = "" Then OrderBy = ColumnName
                str = "Select Distinct " & ColumnName & " From " & TableName & " Where " & WhereCndtn & " Order By " & OrderBy
                FillDataTable(DT, str)
                If DT.Rows.Count > 0 Then
                    Return DT.Rows(0)(0)
                End If
                Return ""
            Catch ex As Exception
                Return "Error: " & ex.Message
            End Try
        End Function

        Public Function ResetPassword(ByVal TxtMailTo As String) As String
            Dim TxtEmailBody, TxtSubject As String
            Dim passwordtext = String.Empty
            Dim LoginURL = "http://inprint.indusanalytics.co.in/Login.aspx"

            Dim pattern As String = "^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$"
            Dim emailAddressMatch = Regex.Match(TxtMailTo, pattern)
            If emailAddressMatch.Success Then
            Else
                Return "You have entered incorrect email id."
            End If
            Dim DT As New DataTable

            str = "Select UA.UserName,CCM.CompanyName,CCM.IsVerifiedMail FROM UserMaster As UA Inner Join CompanyMaster As CCM on UA.CompanyID=CCM.CompanyID Where Isnull(UA.IsBlocked,0)=0 And UA.EmailID='" & Trim(TxtMailTo) & "' "

            FillDataTable(DT, str)
            If DT.Rows.Count > 0 Then
                If DT.Rows(0)("IsVerifiedMail") = 0 Then
                    Return "Account is not verified. Please check your mail inbox and activate your account first."
                End If
            Else
                Return "Email Id not registered with us.!"
            End If

            Dim rand As New Random()
            Dim allowableChars() As Char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ0123456789".ToCharArray()
            For i As Integer = 0 To 8
                passwordtext += allowableChars(rand.Next(allowableChars.Length - 1))
            Next

            TxtSubject = "Password Reset Successfully"
            TxtEmailBody = "Hello " & DT.Rows(0)("UserName") & ",<br/><br/><b>New Password Request</b><br/><br/>You've successfully reset your account password for inPrint." &
                            " Your new password is <b>'" + passwordtext + "'</b> <br/><br/><a href='" + LoginURL + "'>Login Here</a> and enjoy inPrint application."

            Try
                Dim mm As MailMessage = New MailMessage("info@indusanalytics.in", TxtMailTo) With {
                .Subject = TxtSubject,
                .Body = TxtEmailBody
            }

                mm.IsBodyHtml = True
                mm.Priority = MailPriority.High

                Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = "info@indusanalytics.in",
                .Password = "acxutzrqyxukybgb"
            }

                Dim smtp As SmtpClient = New SmtpClient With {
                .Host = "smtp.gmail.com",
                .Credentials = credential,
                .Port = 587,
                .EnableSsl = True
                }
                smtp.Send(mm)
                ExecuteNonSQLQuery("Update UserMaster Set Password='" & ChangePassword(passwordtext) & "' Where EmailID='" & TxtMailTo & "'")

                Return "Password reset successfully, Please check your mail."
            Catch ex As Exception
                Return ex.Message
            End Try
        End Function

        Public Function ChangePassword(ByVal s As String) As String
            Dim i As Long = 0
            Dim p As String = "", k As String = ""
            Dim X As Long = 0
            For i = 1 To Len(s)
                k = Mid(s, i, 1)
                If IsNumeric(k) Then
                    p = p & (Val(k) + 7)
                Else
                    p = p & (Asc(k) + 7)
                End If
            Next
            s = ""
            X = 1
            For i = 1 To Len(p)
                k = Mid(p, X, 4)
                If k <> "" Then
                    s = s & (Val(k) * 7)
                    X = X + 4
                End If
            Next
            Return s
        End Function

        Public Function Modu(Str As String, Key As String) As String
            Dim Rts As String = ""
            Dim i As Long

            For i = 1 To Len(Str)
                Rts = Rts & Asc(Mid(Str, i, 1)) * 4
            Next

            Rts = StrReverse(Rts)
            Key = Mid(Rts, (Len(Rts) \ 2) + 1, Len(Rts)) & Mid(Rts, 1, Len(Rts) \ 2)

            Return Rts
        End Function
        Private Function DeModu(ByVal Str As String) As String
            Dim Rts As String = ""
            Dim i As Long
            Dim Key As String
            Key = Mid(Str, (Len(Str) \ 2) + 1, Len(Str)) & Mid(Str, 1, Len(Str) \ 2)

            Str = StrReverse(Str)
            For i = 1 To Len(Str) Step 3
                Rts = Rts & Chr((Mid(Str, i, 3) / 4))
            Next

            DeModu = Rts
        End Function

        Public Function RoundFix(ByVal Num As Double) As Long    'Round off number to Upper side forcely '
            'like num = 6.50  to num 6.99 then num = 7 and like num = 6.01  to num 6.49 then num = 6
            On Error Resume Next
            Dim returnValue As Long
            Dim s As String, t As String
            Dim pos As Integer
            t = CStr(Num)
            pos = InStr(1, t, ".")
            If pos = 0 Then
                returnValue = CLng(Num)
            Else
                s = Left(t, pos - 1)
                returnValue = CLng(s)
            End If
            Return returnValue
        End Function

        Public Sub FillDDL(ByVal query As String, ByVal ddl As DropDownList, ByVal DM As String, ByVal VM As String)
            Dim da As New SqlDataAdapter(query, Db)
            Dim dt As New DataTable()
            da.Fill(dt)
            ddl.DataSource = dt
            ddl.DataTextField = DM
            ddl.DataValueField = VM

            ddl.DataBind()
            ddl.Items.Insert(0, "--Select--")
        End Sub

        Public Function GenerateMaxEnquiryNo(ByVal TableName As String, ByVal MaxFieldName As String, ByRef MaxNoVariable As Integer) As String
            Dim dt As New DataTable()
            Dim st As String
            Dim i As Integer
            Dim GblCodesize As Integer
            GblCodesize = 4
            st = ""
            FillDataTable(dt, "Select isnull(MAX(isnull(" & MaxFieldName & " ,0)),0) + 1  From  " & TableName)
            If dt.Rows.Count > 0 Then
                For i = 1 To GblCodesize - dt.Rows(0)(0).ToString().Length()
                    st = Trim(st) & 0
                Next
                MaxNoVariable = dt.Rows(0)(0)
                st = Trim(st)
                GenerateMaxEnquiryNo = st & dt.Rows(0)(0)
            Else
                MaxNoVariable = 1
                GenerateMaxEnquiryNo = "0001"
            End If
            Return GenerateMaxEnquiryNo
        End Function

        Public Function GenerateMaxComplainNo(ByVal TableName As String, ByVal MaxFieldName As String, ByRef MaxNoVariable As Integer, ByVal GblYear As String, Optional ByVal SearchCondition As String = "") As String
            Dim dt As New DataTable()
            Dim st As String
            Dim i As Integer
            Dim GblCodesize As Integer
            GblCodesize = 4
            st = ""
            FillDataTable(dt, "Select isnull(MAX(isnull(" & MaxFieldName & " ,0)),0) + 1  From  " & TableName & "  " & SearchCondition)
            If dt.Rows.Count > 0 Then
                For i = 1 To GblCodesize - dt.Rows(0)(0).ToString().Length()
                    st = Trim(st) & 0
                Next
                MaxNoVariable = dt.Rows(0)(0)
                st = GblYear & "-" & Trim(st) & dt.Rows(0)(0)
                GenerateMaxComplainNo = st
            Else
                MaxNoVariable = 1
                GenerateMaxComplainNo = GblYear & "-" & "0001"
            End If
            Return GenerateMaxComplainNo
        End Function

        Public Function ReadNumber(ByVal Number As String, ByVal CurrencyHeadName As String, ByVal CurrencyChildName As String, ByVal CurrencyCode As String) As String
            Dim s As String
            Dim S1 As String
            Dim S2 As String
            If IsNumeric(Number) = False Then
                ReadNumber = "Not a valid number"
                Exit Function
            End If

            If Val(Number) > 1.0E+16 Then
                ReadNumber = "Sorry! To long number"
                Exit Function
            End If
            s = FormatNumber(Number, 2, vbFalse, vbFalse, vbFalse)
            S1 = Trim(Mid(s, 1, IIf(InStr(1, s, ".") = 0, Len(s), InStr(1, s, ".") - 1)))
            S2 = Trim(Mid(s, IIf(InStr(1, s, ".") = 0, Len(s) + 1, InStr(1, s, ".") + 1), Len(s)))
            If Val(S2) > 0 Then
                If CurrencyCode = "INR" Then
                    ReadNumber = StrConv(BeforeDecimal(Val(S1)), vbProperCase) + "Rupee and " + StrConv(BeforeDecimal(Val(S2)), vbProperCase) + " Paisa"
                Else
                    ReadNumber = StrConv(BeforeDecimal(Val(S1)), vbProperCase) + " " + CurrencyHeadName + " and " + StrConv(BeforeDecimal(Val(S2)), vbProperCase) + " " + CurrencyChildName
                End If

            Else
                If CurrencyCode = "INR" Then
                    ReadNumber = StrConv(BeforeDecimal(Val(S1)), vbProperCase) + " Rupee" '+ BeforeDecimal(Val(S2)) + " paisa"
                Else
                    ReadNumber = StrConv(BeforeDecimal(Val(S1)), vbProperCase) + " " + CurrencyHeadName '+ BeforeDecimal(Val(S2)) + " paisa"
                End If

            End If
        End Function

        Public Function BeforeDecimal(ByVal Num As Double) As String
            Dim s As String = ""
            While Num <> 0
                If Num >= 1 And Num <= 20 Then
                    s = s & ReadDigit(Num)
                    Num = 0
                ElseIf Num > 20 And Num < 100 Then
                    s = s & ReadDigit2(Left(Num, 1))
                    Num = Right(Num, 1)
                ElseIf Num >= 100 And Num < 1000 Then
                    If Left(Num, 1) = "1" Then
                        s = s & ReadDigit(Left(Num, 1)) & " hundred"
                    Else
                        s = s & ReadDigit(Left(Num, 1)) & " hundred"
                    End If
                    Num = Right(Num, 2)
                ElseIf Num >= 1000 And Num < 10000 Then
                    If Left(Num, 1) = "1" Then
                        s = s & ReadDigit(Left(Num, 1)) & " thousand"
                    Else
                        s = s & ReadDigit(Left(Num, 1)) & " thousand"
                    End If
                    Num = Right(Num, 3)
                ElseIf Num >= 10000 And Num < 20000 Then
                    s = s & ReadDigit(Left(Num, 2)) & " thousand"
                    Num = Right(Num, 3)
                ElseIf Num >= 20000 And Num < 100000 Then
                    s = s & ReadDigit2(Left(Num, 1)) & " " & ReadDigit(Mid(Num, 2, 1)) & " thousand"
                    Num = Right(Num, 3)
                ElseIf Num >= 100000 And Num < 1000000 Then
                    If Left(Num, 1) = "1" Then
                        s = s & ReadDigit(Left(Num, 1)) & " lakh"
                    Else
                        s = s & ReadDigit(Left(Num, 1)) & " lakhs"
                    End If
                    Num = Right(Num, 5)
                ElseIf Num >= 1000000 And Num < 2000000 Then
                    s = s & ReadDigit(Left(Num, 2)) & " lakhs"
                    Num = Right(Num, 5)
                ElseIf Num >= 2000000 And Num < 10000000 Then
                    s = s & ReadDigit2(Left(Num, 1)) & " " & ReadDigit(Mid(Num, 2, 1)) & " lakhs"
                    Num = Right(Num, 5)
                ElseIf Num >= 10000000 And Num < 100000000 Then
                    If Left(Num, 1) = "1" Then
                        s = s & ReadDigit(Left(Num, 1)) & " crore"
                    Else
                        s = s & ReadDigit(Left(Num, 1)) & " crores"
                    End If
                    Num = Right(Num, 7)
                ElseIf Num >= 100000000 And Num < 200000000 Then
                    s = s & ReadDigit(Left(Num, 2)) & " crores"
                    Num = Right(Num, 7)
                ElseIf Num >= 200000000 And Num < 1000000000 Then
                    s = s & ReadDigit2(Left(Num, 1)) & " " & ReadDigit(Mid(Num, 2, 1)) & " crores"
                    Num = Right(Num, 7)
                ElseIf Num >= 1000000000 Then
                    If Left(Num, 1) = "1" Then
                        s = s & BeforeDecimal(Mid(Num, 1, Len(str(Num)) - 8)) & " crore"
                    Else
                        s = s & BeforeDecimal(Mid(Num, 1, Len(str(Num)) - 8)) & " crores"
                    End If
                    Num = Mid(Num, Len(str(Num)) - 7, Len(str(Num)))
                End If
                s = s & " "
            End While
            BeforeDecimal = s
        End Function

        Public Function ReadDigit(ByVal Digit As Double) As String
            Select Case Digit
                'Case 0
                '   ReadDigit = "zero"
                Case 1
                    ReadDigit = "one"
                Case 2
                    ReadDigit = "two"
                Case 3
                    ReadDigit = "three"
                Case 4
                    ReadDigit = "four"
                Case 5
                    ReadDigit = "five"
                Case 6
                    ReadDigit = "six"
                Case 7
                    ReadDigit = "seven"
                Case 8
                    ReadDigit = "eight"
                Case 9
                    ReadDigit = "nine"
                Case 10
                    ReadDigit = "ten"
                Case 11
                    ReadDigit = "eleven"
                Case 12
                    ReadDigit = "twelve"
                Case 13
                    ReadDigit = "thirteen"
                Case 14
                    ReadDigit = "fourteen"
                Case 15
                    ReadDigit = "fifteen"
                Case 16
                    ReadDigit = "sixteen"
                Case 17
                    ReadDigit = "seventeen"
                Case 18
                    ReadDigit = "eighteen"
                Case 19
                    ReadDigit = "nineteen"
                Case 20
                    ReadDigit = "twenty"
            End Select
            Return ReadDigit
        End Function

        Public Function ReadDigit2(ByVal Digit As Double) As String
            Select Case Digit
                Case 2
                    ReadDigit2 = "twenty"
                Case 3
                    ReadDigit2 = "thirty"
                Case 4
                    ReadDigit2 = "forty"
                Case 5
                    ReadDigit2 = "fifty"
                Case 6
                    ReadDigit2 = "sixty"
                Case 7
                    ReadDigit2 = "seventy"
                Case 8
                    ReadDigit2 = "eighty"
                Case 9
                    ReadDigit2 = "ninety"
            End Select
            Return ReadDigit2
        End Function

#Region "Code For Visual studio 2010 or 2012"


        ' '' '' ''Public Sub FillChart(ByRef Chart As Chart, ByVal ChartType As SeriesChartType, ByVal SqlSelectQuery As String, Optional ByVal SqlStoredProcedure As String = "")
        ' '' '' ''    Try
        ' '' '' ''        Dim dt As New DataTable
        ' '' '' ''        FillDataTable(dt, SqlSelectQuery, SqlStoredProcedure)
        ' '' '' ''        Chart.DataSource = dt
        ' '' '' ''        Chart.Series(0).XValueMember = dt.Columns(1).ColumnName
        ' '' '' ''        Chart.Series(0).YValueMembers = dt.Columns(0).ColumnName
        ' '' '' ''        Chart.Series(1).XValueMember = dt.Columns(2).ColumnName
        ' '' '' ''        Chart.Series(1).YValueMembers = dt.Columns(0).ColumnName
        ' '' '' ''        Chart.Series(0).ChartType = ChartType

        ' '' '' ''        Chart.BackColor = Color.Gray
        ' '' '' ''        Chart.BackSecondaryColor = Color.WhiteSmoke
        ' '' '' ''        Chart.BackGradientStyle = GradientStyle.DiagonalRight
        ' '' '' ''        Chart.BorderlineDashStyle = ChartDashStyle.Solid
        ' '' '' ''        Chart.BorderSkin.SkinStyle = BorderSkinStyle.Emboss
        ' '' '' ''        Chart.BorderlineColor = Color.Gray

        ' '' '' ''        ' format the chart area
        ' '' '' ''        Chart.ChartAreas(0).BackColor = Color.Wheat
        ' '' '' ''        ' add and format the title
        ' '' '' ''        Chart.Titles.Add("Table Bound Chart")
        ' '' '' ''        Chart.Titles(0).Font = New Font("Utopia", 16)


        ' '' '' ''    Catch ex As Exception
        ' '' '' ''        MsgBox(ex.Message)
        ' '' '' ''    End Try
        ' '' '' ''End Sub

        ' Install-Package Newtonsoft.Json -Version 9.0.1
#End Region

#End Region
    End Class

End Namespace
