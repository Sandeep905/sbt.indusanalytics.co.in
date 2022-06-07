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
Public Class WebServiceProcessMaster
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLUserName As String
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

    '-----------------------------------Get ProcessMaster------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProcessMaster() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct nullif(PM.ProcessID,'') as ProcessID,nullif(PM.DisplayProcessName,'') as DisplayProcessName,nullif(PM.TypeofCharges,'') as TypeofCharges, " &
                "nullif(PM.SizeToBeConsidered,'') as SizeToBeConsidered,nullif(PM.Rate,'') as Rate,nullif(PM.MinimumCharges,'') as MinimumCharges, " &
                "nullif(PM.SetupCharges,'') as SetupCharges,nullif(PM.StartUnit,'') as StartUnit,nullif(PM.IsDisplay,'') as IsDisplay, Isnull(ProcessProductionType,'None') As ProcessProductionType, " &
                "nullif(PM.ChargeApplyOnSheets,'') as ChargeApplyOnSheets,nullif(DM.DepartmentName,'') as DepartmentName,nullif(PM.PrePress,'') as PrePress, " &
                "nullif(PM.ProcessName,'') as ProcessName,nullif(PM.EndUnit,'') as EndUnit,nullif(PM.StartUnit,'') as StartUnit,nullif(PM.UnitConversion,'') as UnitConversion,PM.DepartmentID,nullif(PM.AllocattedMachineID,'') as AllocattedMachineID,nullif(PM.AllocatedContentID,'') as AllocatedContentID,nullif(PM.ChargeApplyOnSheets,'') as ChargeApplyOnSheets,nullif(PM.Rate,'') as Rate,nullif(PM.ProcessPurpose ,'') as ProcessPurpose " &
                "from ProcessMaster as PM inner join DepartmentMaster as DM on PM.DepartmentID=DM.DepartmentID where PM.CompanyID='" & GBLCompanyID & "' " &
                "and isnull(PM.IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Department Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSelectDepartment() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct DepartmentID, DepartmentName From DepartmentMaster where CompanyID=" & GBLCompanyID & " And isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Department Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MachiGrid() As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim VendorID As String = Convert.ToString(HttpContext.Current.Session("VendorID"))
        VendorID = IIf(VendorID = 0 Or VendorID = "", "", " And MM.VendorID =" & VendorID)
        str = "Select MM.MachineID, MM.MachineName, MM.DepartmentID ,DM.DepartmentName From MachineMaster As MM Inner Join DepartmentMaster as DM on MM.DepartmentID=DM.DepartmentID And MM.CompanyID=DM.CompanyID Where MM.CompanyID=" & GBLCompanyID &
                " And MM.IsDeletedTransaction = 0 " & VendorID & " Order By MM.MachineName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function
    '-----------------------------------Get Type Of Charges------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetTypeOfCharges() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select distinct nullif(ChargesID,'') as ChargesID, nullif(TypeOfCharges,'') as TypeOfCharges From TypeOfCharges where CompanyID='" & GBLCompanyID & "' And Isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Start/Ent Unit------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function StartUnit() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select distinct nullif(UnitSymbol,'') as UnitSymbol, nullif(UnitName,'') as UnitName From UnitMaster Where /*CompanyID='" & GBLCompanyID & "' And*/ Isnull(IsDeletedTransaction,0)=0"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ProcessMaster  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveprocessMasterData(ByVal CostingDataProcessDetailMaster As Object, ByVal CostingDataMachinAllocation As Object, ByVal CostingDataContentAllocation As Object, ByVal CostingDataSlab As Object, ByVal ProcessName As String, ByVal finalStringContent As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2, ProcessID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If db.CheckAuthories("ProcessMaster.aspx", GBLUserID, GBLCompanyID, "CanSave", ProcessName) = False Then Return "You are not authorized to save..!, Can't Save"

        Try

            Dim dtExist As New DataTable
            str2 = ""
            str2 = "Select nullif(ProcessName,'') as ProcessName From ProcessMaster Where CompanyID='" & GBLCompanyID & "' and ProcessName='" & ProcessName & "' and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            Else

                TableName = "ProcessMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,AllocatedContentID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & finalStringContent & "'"
                ProcessID = db.InsertDatatableToDatabase(CostingDataProcessDetailMaster, TableName, AddColName, AddColValue)

                TableName = "ProcessAllocatedMachineMaster"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
                db.InsertDatatableToDatabase(CostingDataMachinAllocation, TableName, AddColName, AddColValue)


                'TableName = "ProcessContentAllocationMaster"
                'AddColName = ""
                'AddColValue = ""
                'AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
                'AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
                'db.InsertDatatableToDatabase(CostingDataContentAllocation, TableName, AddColName, AddColValue)

                TableName = "ProcessMasterSlabs"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
                db.InsertDatatableToDatabase(CostingDataSlab, TableName, AddColName, AddColValue)
                KeyField = "Success"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function
    ''----------------------------Close ProcessMaster  Save Data  ------------------------------------------
    '-----------------------------------Get ExistSlab Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ExistSlab(ByVal ProcessID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select nullif(FromQty,'') as FromQty, nullif(ToQty,'') as ToQty,nullif(StartUnit,'') as StartUnit,nullif(RateFactor,'') as RateFactor,isnull(Rate,0) as Rate,isnull(MinimumCharges,0) as MinimumCharges,IsLocked " &
                "from ProcessMasterSlabs where CompanyID='" & GBLCompanyID & "' And ProcessID='" & ProcessID & "'" &
                "and isnull(IsDeletedTransaction,0)<>1"
        'str = "EXECUTE GetProcessSlabData '','" & GBLCompanyID & "','" & ProcessID & "'"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ProcessMaster  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatprocessMasterData(ByVal CostingDataProcessDetailMaster As Object, ByVal CostingDataMachinAllocation As Object, ByVal CostingDataContentAllocation As Object, ByVal CostingDataSlab As Object, ByVal ProcessID As String, ByVal finalStringContent As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If db.CheckAuthories("ProcessMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit", ProcessID) = False Then Return "You are not authorized to update..!, Can't Update"

        Try

            TableName = "ProcessMaster"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",ModifiedBy='" & GBLUserID & "',AllocatedContentID='" & finalStringContent & "'"
            wherecndtn = "ProcessID=" & ProcessID & " and CompanyID=" & GBLCompanyID & ""
            db.UpdateDatatableToDatabase(CostingDataProcessDetailMaster, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ProcessAllocatedMachineMaster WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "' ")

            TableName = "ProcessAllocatedMachineMaster"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
            db.InsertDatatableToDatabase(CostingDataMachinAllocation, TableName, AddColName, AddColValue)

            'db.ExecuteNonSQLQuery("Delete from ProcessContentAllocationMaster WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "' ")

            'TableName = "ProcessContentAllocationMaster"
            'AddColName = ""
            'AddColValue = ""
            'AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
            'AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
            'db.InsertDatatableToDatabase(CostingDataContentAllocation, TableName, AddColName, AddColValue)


            db.ExecuteNonSQLQuery("Delete from ProcessMasterSlabs WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "'")

            TableName = "ProcessMasterSlabs"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ProcessID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ProcessID & "'"
            db.InsertDatatableToDatabase(CostingDataSlab, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function
    ''----------------------------Close ProcessMaster  Update Data  ------------------------------------------
    ''----------------------------Open ProcesMaster Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteprocessMasterData(ByVal ProcessID As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim RevisionNo As Long = 0
        Dim AddColName, AddColValue As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        AddColName = ""
        AddColValue = ""

        If db.CheckAuthories("ProcessMaster.aspx", GBLUserID, GBLCompanyID, "CanDelete", ProcessID) = False Then Return "You are not authorized to delete..!, Can't Delete"
        If db.IsDeletable("ProcessID", "JobBookingProcess", " Where ProcessID=" & ProcessID & " And CompanyID=" & GBLCompanyID) = False Then
            Return "You can't delete this process ,this process already used in further transactions"
        End If

        Try
            str = "Update ProcessMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ProcessAllocatedMachineMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "' "
            db.ExecuteNonSQLQuery(str)

            str = "Update ProcessContentAllocationMaster Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "' "
            db.ExecuteNonSQLQuery(str)

            str = "Update ProcessMasterSlabs Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ProcessID='" & ProcessID & "' "
            db.ExecuteNonSQLQuery(str)

            'db.ExecuteNonSQLQuery("Delete from ItemMasterDetails WHERE CompanyID='" & GBLCompanyID & "' and ItemID='" & txtGetGridRow & "' And ItemGroupID='" & UnderGroupID & "' ")
            'db.ExecuteNonSQLQuery("Delete from ItemMaster WHERE CompanyID='" & GBLCompanyID & "' and ItemID='" & txtGetGridRow & "' And ItemGroupID='" & UnderGroupID & "' ")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function
    ''====================================Content Allocation=======================

    '-----------------------------------Get Department Master------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ContentGrid() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "select distinct nullif(CM.ContentID,'') as ContentID, nullif(CM.ContentName,'') as ContentName, nullif(CM.ContentCaption,'') as ContentCaption " &
                "from ContentMaster as CM  where CM.CompanyID='" & GBLCompanyID & "' And CM.IsActive=1"
        ' "and isnull(CM.IsDeletedTransaction,0)<>1"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class