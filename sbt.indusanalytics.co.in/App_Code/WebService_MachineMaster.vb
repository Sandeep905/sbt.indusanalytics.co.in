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
Public Class WebService_MachineMaster
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID, VendorID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

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


    '---------------Open Machine Master code---------------------------------
    '-----------------------------------Get Department Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectDepartment() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select distinct nullif(DepartmentID,'') as DepartmentID, nullif(DepartmentName,'') as DepartmentName " &
                "from DepartmentMaster where CompanyID=" & GBLCompanyID & " " &
                "and isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function TxtChangeEventFun(ByVal VTxtMachine As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And VendorID=" & VendorID)

        str = "Select distinct nullif(MachineName,'') as MachineName From MachineMaster Where CompanyID=" & GBLCompanyID & " and MachineName= '" & VTxtMachine & "' " &
                "and IsDeletedTransaction=0 " & VendorID
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------Get MachineMaster------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MachineMaster() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        VendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And MM.VendorID=" & VendorID)

        str = "Select Distinct MM.MachineId,MM.MachineName,MM.MinimumSheet, MM.Gripper,MM.MaxLength,MM.MaxWidth, MM.MinLength,MM.MinWidth,MM.Colors, " &
                "MM.MakeReadyCharges,MM.MakeReadyWastageSheet ,MM.DepartmentID, MM.MachineType,MM.MakeReadyTime ,MM.ElectricConsumption , " &
                "MM.PrintingMargin,MM.WebCutOffSize, MM.MinReelSize,MM.MaxReelSize ,MM.MachineSpeed ,MM.LabourCharges,MM.WebCutOffSizeMin ,MM.ChargesType, " &
                "MM.RoundofImpressionsWith,MM.IsPerfectaMachine ,MM.IsSpecialMachine ,MM.BasicPrintingCharges, MM.JobChangeOverTime,MM.PlateLength ,MM.PlateWidth , " &
                "MM.OtherCharges,MM.WastageType ,MM.WastageCalculationOn,MM.PerHourCost,MM.ElectricConsumptionUnitPerMinute,DM.DepartmentName,MM.VendorID " &
                "From MachineMaster As MM Inner Join DepartmentMaster AS DM On DM.DepartmentID=MM.DepartmentID And DM.CompanyID=MM.CompanyID " &
                "Where MM.CompanyID=" & GBLCompanyID & " and MM.IsDeletedTransaction=0 " & VendorID
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '-----------------------------------Get MachineMaster------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistSlab(ByVal Machineid As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct SheetRangeFrom,SheetRangeTo,Rate, PlateCharges,PSPlateCharges,CTCPPlateCharges,Wastage,SpecialColorFrontCharges,SpecialColorBackCharges,nullif(PaperGroup,'') as PaperGroup,MaxPlanW as SizeW, MaxPlanL as SizeL,MinCharges " &
                " From MachineSlabMaster Where CompanyID=" & GBLCompanyID & " And MachineID=" & Machineid & " And isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ProcessMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveMachineMasterData(ByVal CostingMachineData As Object, ByVal ObjMachineSlab As Object, ByVal MachineName As String, ByVal CoatingRates As Object) As String

        Dim dt As New DataTable
        Dim KeyField, MachineID As String
        Dim AddColName, AddColValue, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If (db.CheckAuthories("MachineMaster.aspx", GBLUserID, GBLCompanyID, "CanSave", MachineName) = False) Then Return "You are not authorized to save..!, Can't Save"

            Dim dtExist As New DataTable
            db.FillDataTable(dtExist, "Select Distinct MachineName From MachineMaster where CompanyID=" & GBLCompanyID & " and MachineName= '" & MachineName & "' And Isnull(IsDeletedTransaction,0)<>1")
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else

                TableName = "MachineMaster"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy"
                AddColValue = "Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "'," & GBLUserID
                MachineID = db.InsertDatatableToDatabase(CostingMachineData, TableName, AddColName, AddColValue)

                If IsNumeric(MachineID) = False Then
                    Return "Error in main :- " & MachineID
                End If
                TableName = "MachineSlabMaster"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,MachineID"
                AddColValue = "Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "'," & MachineID
                KeyField = db.InsertDatatableToDatabase(ObjMachineSlab, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    db.ExecuteNonSQLQuery("Delete from MachineSlabMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' ")
                    db.ExecuteNonSQLQuery("Delete from MachineMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' ")
                    Return "Error in slabs :- " & KeyField
                End If

                TableName = "MachineOnlineCoatingRates"
                AddColName = "CompanyID,MachineID"
                AddColValue = GBLCompanyID & "," & MachineID
                KeyField = db.InsertDatatableToDatabase(CoatingRates, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    db.ExecuteNonSQLQuery("Delete from MachineSlabMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' ")
                    db.ExecuteNonSQLQuery("Delete from MachineMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' ")
                    db.ExecuteNonSQLQuery("Delete from MachineOnlineCoatingRates WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' ")
                    Return "Error in coating :- " & KeyField
                End If
                KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function
    ''----------------------------Close ProcessMaster  Save Data  ------------------------------------------

    ''----------------------------Open MachineMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatMachineMasterData(ByVal CostingMachineData As Object, ByVal ObjMachineSlab As Object, ByVal Machineid As String, ByVal CoatingRates As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "MachineMaster"
            AddColName = "ModifiedDate=Getdate(),ModifiedBy=" & GBLUserID
            wherecndtn = "Machineid=" & Machineid & " And CompanyID=" & GBLCompanyID
            Dim MachineName As String = db.GetColumnValue("MachineName", TableName, wherecndtn)
            If (db.CheckAuthories("MachineMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit", MachineName) = False) Then Return "You are not authorized to edit..!, Can't Edit"

            KeyField = db.UpdateDatatableToDatabase(CostingMachineData, TableName, AddColName, 0, wherecndtn)
            If KeyField <> "Success" Then
                Return "Error:" & KeyField
            End If

            db.ExecuteNonSQLQuery("Delete From MachineSlabMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & Machineid & "' ")
            TableName = "MachineSlabMaster"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,MachineID"
            AddColValue = "Getdate(),Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Machineid & "'"
            db.InsertDatatableToDatabase(ObjMachineSlab, TableName, AddColName, AddColValue)

            db.ExecuteNonSQLQuery("Delete From MachineOnlineCoatingRates WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & Machineid & "' ")
            TableName = "MachineOnlineCoatingRates"
            AddColName = "CompanyID,MachineID"
            AddColValue = GBLCompanyID & "," & Machineid
            db.InsertDatatableToDatabase(CoatingRates, TableName, AddColName, AddColValue)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function
    ''----------------------------Close MachineMaster  Update Data  ------------------------------------------
    ''----------------------------Open Machine Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteMachineMasterData(ByVal Machineid As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim RevisionNo As Long = 0
        Dim AddColName, AddColValue As String
        Dim dtExist As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        AddColName = ""
        AddColValue = ""

        Try

            Dim TableName = "MachineMaster"
            Dim wherecndtn = "Machineid=" & Machineid & " and CompanyID=" & GBLCompanyID & ""
            Dim MachineName As String = db.GetColumnValue("MachineName", TableName, wherecndtn)
            If (db.CheckAuthories("MachineMaster.aspx", GBLUserID, GBLCompanyID, "CanDelete", MachineName) = False) Then Return "You are not authorized to delete..!, Can't Delete"

            Dim str2 As String = "Select MachineID From JobBookingContents Where CompanyID=" & GBLCompanyID & " And MachineID= '" & Machineid & "' And Isnull(IsDeletedTransaction,0)=0"
            db.FillDataTable(dtExist, str2)
            If dtExist.Rows.Count > 0 Then
                KeyField = "Further Used, Can't Delete Machine..!"
            End If

            str = "Update MachineMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and MachineId='" & Machineid & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update MachineSlabMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & Machineid & "' "
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Online Coating Rates ------------------------------------------
    '<WebMethod(EnableSession:=True)>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Function GetMachineOnlineCoatingRates(ByVal MID As Integer) As String
    '    Try
    '        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

    '        str = "EXECUTE GetOnlineCoatingSlabData " & GBLCompanyID & ",'" & MID & "'"
    '        db.FillDataTable(dataTable, str)
    '        data.Message = ConvertDataTableTojSonString(dataTable)
    '        Return js.Serialize(data.Message)
    '    Catch ex As Exception
    '        Return ex.Message
    '    End Try

    'End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineOnlineCoatingRates(ByVal MID As Integer) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Nullif(CoatingName,'') AS CoatingName,Isnull(SheetRangeFrom,0) AS SheetRangeFrom,Isnull(SheetRangeTo,0) AS SheetRangeTo,Nullif(RateType,'') AS RateType,Isnull(Rate,0) AS Rate,Isnull(BasicCoatingCharges,0) AS BasicCoatingCharges From MachineOnlineCoatingRates Where CompanyID=" & GBLCompanyID & " AND MachineID='" & MID & "' and isnull(IsDeletedTransaction,0)<>1 Order By CoatingName,RateType,SheetRangeFrom,SheetRangeTo "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get MachineName------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MachineName() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select distinct nullif(MM.MachineID,'') as MachineID, nullif(MM.MachineName,'') as MachineName from MachineMaster as MM inner join DepartmentMaster as DM on MM.DepartmentID=DM.DepartmentID  AND MM.CompanyID=DM.CompanyID  where MM.CompanyID=" & GBLCompanyID & " " &
                "and isnull(MM.IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get GroupGrid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GroupGrid() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        'str = "Select Isnull(ItemGroupID,0) AS ItemGroupID,Nullif(ItemGroupName,'') AS ItemGroupName From ItemGroupMaster Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 Order By Nullif(ItemGroupName,'')"
        str = "Select Isnull(ItemSubGroupID,0) AS ItemSubGroupID,Nullif(ItemSubGroupName,'') AS ItemSubGroupName " &
                "From ItemSubGroupMaster Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)<>1 Order By Nullif(ItemSubGroupName,'')"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open GroupAllocation  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveGroupAllocation(ByVal CostingDataGroupAllocation As Object, ByVal MachineID As String, ByVal GridRow As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            db.ExecuteNonSQLQuery("Delete from MachineItemSubGroupAllocationMaster WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "' and isnull(IsDeletedTransaction,0)<>1")

            If GridRow <> "" Then

                TableName = "MachineItemSubGroupAllocationMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GroupAllocationIDs"
                AddColValue = "Getdate(),Getdate(),'" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GridRow & "'"
                db.InsertDatatableToDatabase(CostingDataGroupAllocation, TableName, AddColName, AddColValue)

            End If
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open GroupAllocation  Delete From GridClick  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteGroupAllo(ByVal MachineID As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim RevisionNo As Long = 0

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            str = "Update MachineItemSubGroupAllocationMaster Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),ModifiedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and MachineID='" & MachineID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "Not match"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get MachineID String------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistGroupID(ByVal MachineID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select Top(1) nullif(GroupAllocationIDs,'') as GroupAllocationIDs from MachineItemSubGroupAllocationMaster Where CompanyID=" & GBLCompanyID & " and MachineID='" + MachineID + "' And isnull(IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '----------------------Add New Code 15 May 2019
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCoatingName() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select Distinct Nullif(CoatingName,'') AS CoatingName From MachineOnlineCoatingRates Where Isnull(CoatingName,'')<>'' And CompanyID=" & GBLCompanyID & " and isnull(IsDeletedTransaction,0)<>1 Order By CoatingName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------close Machine Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class