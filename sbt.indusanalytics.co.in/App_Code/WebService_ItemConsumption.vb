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
Public Class WebService_ItemConsumption
    Inherits System.Web.Services.WebService

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
    Dim UserName As String

    '---------------Open Master code---------------------------------

    ''----------------------------Open Get Consumption No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetConsumptionNO(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            KeyField = db.GeneratePrefixedNo("ItemConsumptionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Allocated Job List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobAllocatedPicklist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(MM.MachineID,0) AS MachineID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockType,'') AS StockType, " &
                  " Nullif(IM.StockCategory,'') AS StockCategory,   Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                   " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                   " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)>0 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Allocated Job List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function NonJobAllocatedPicklist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(MM.MachineID,0) AS MachineID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockType,'') AS StockType, " &
                  " Nullif(IM.StockCategory,'') AS StockCategory,   Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                   " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                   " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)=0 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get All Job List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AllPicklist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(MM.MachineID,0) AS MachineID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockType,'') AS StockType, " &
                  " Nullif(IM.StockCategory,'') AS StockCategory,   Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                   " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                   " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open Issue  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveIssueData(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim PONo As String
        Dim MaxPONo As Long
        Dim KeyField, TransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            PONo = db.GeneratePrefixedNo("ItemConsumptionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
            If (db.CheckAuthories("ItemConsumption.aspx", GBLUserID, GBLCompanyID, "CanSave", PONo) = False) Then Return "You are not authorized to save..!, Can't Save"

            TableName = "ItemConsumptionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)

            TableName = "ItemConsumptionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Issue  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateIssue(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If (db.CheckAuthories("ItemConsumption.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

            TableName = "ItemConsumptionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And ConsumptionTransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ItemConsumptionDetail WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & TransactionID & "' ")

            TableName = "ItemConsumptionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Issue Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteConsumption(ByVal TransactionID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If (db.CheckAuthories("ItemConsumption.aspx", GBLUserID, GBLCompanyID, "CanDelete", TransactionID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

            str = ""
            str = "Update ItemConsumptionMain Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = ""
            str = "Update ItemConsumptionDetail Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Showlist List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Showlist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "	Select Isnull(ICM.ConsumptionTransactionID,0) AS ConsumptionTransactionID,Isnull(ICM.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingID,0) AS JobBookingID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICM.CreatedBy,0) AS UserID,Isnull(ICM.VoucherID,0) AS VoucherID,  " &
                    "Isnull(ICM.MaxVoucherNo,0) As MaxVoucherNo,Nullif(ICM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ICM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(ITM.VoucherNo,'') AS IssueVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS IssueVoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,ROUND(Sum(Isnull(ICD.ConsumeQuantity,0)),3) AS ConsumeQuantity,Nullif(UM.UserName,'') AS CreatedBy,Nullif(ICM.FYear,'') AS FYear  " &
                   " From ItemConsumptionMain AS ICM  " &
                   " INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID  " &
                   " INNER JOIN ItemTransactionMain AS ITM ON ITM.TransactionID=ICD.IssueTransactionID And ITM.CompanyID=ICD.CompanyID  " &
                   " INNER JOIN ItemMaster AS IM ON IM.ItemID=ICD.ItemID AND IM.CompanyID=ICD.CompanyID  " &
                   " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                   " INNER JOIN UserMaster AS UM ON UM.UserID=ICM.CreatedBy And UM.CompanyID=ICM.CompanyID  " &
                   " INNER JOIN DepartmentMaster AS DM ON DM.DepartmentID=ICM.DepartmentID AND DM.CompanyID=ICM.CompanyID  " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                   " LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ICD.JobBookingJobCardContentsID AND JC.CompanyID=ICD.CompanyID  " &
                   " Where ICM.VoucherID=-30 And Isnull(ICM.IsDeletedTransaction,0)=0 And ICM.CompanyID='" & GBLCompanyID & "'  " &
                   " GROUP BY Isnull(ICM.ConsumptionTransactionID,0),Isnull(ICM.DepartmentID,0),Isnull(ICD.JobBookingID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Isnull(ICD.ItemID,0),Isnull(IM.ItemGroupID,0),Isnull(IM.ItemSubGroupID,0),Isnull(ICD.IssueTransactionID,0),Isnull(ICM.CreatedBy,0),Isnull(ICM.VoucherID,0),  " &
                   " Isnull(ICM.MaxVoucherNo,0),Nullif(ICM.VoucherNo,''),Replace(Convert(Varchar(13),ICM.VoucherDate,106),' ','-'),Nullif(DM.DepartmentName,''),Nullif(JC.JobCardContentNo,''),Nullif(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'),Nullif(IM.ItemCode,''),Nullif(IGM.ItemGroupName,''),Nullif(ISGM.ItemSubGroupName,''),Nullif(IM.ItemName,''),Nullif(IM.ItemDescription,''),Nullif(IM.StockUnit,''),Nullif(UM.UserName,''),Nullif(ICM.FYear,'')  " &
                   " Order By FYear,MaxVoucherNo Desc"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get SelectedRow List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelectedRow(ByVal transactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(ICD.IssueTransactionID,0) AS TransactionID,  " &
                    "Isnull(ICD.ConsumptionTransactionDetailID,0) As ConsumptionTransactionDetailID,  " &
                    "Isnull(ICD.ConsumptionTransactionID,0) AS ConsumptionTransactionID,	  " &
                    "Isnull(ICD.TransID,0) AS TransID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,  " &
                    "Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.ItemID,0) AS ItemID,  " &
                    "Nullif(ICD.BatchNo,'') AS BatchNo,  " &
                    "Isnull(ICD.ItemGroupID,0) AS ItemGroupID,  " &
                    "Isnull(ICD.JobBookingID,0) AS JobBookingID,  " &
                    "Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ICD.MachineID,0) AS MachineID,  " &
                    "Isnull(ICD.ProcessID,0) AS ProcessID,Isnull(ICD.ConsumeQuantity,0) AS IssueQuantity,  " &
                    "Isnull(ICD.ReturnQuantity,0) AS ReturnQuantity,  " &
                    "Nullif(ICD.BatchNo,'') AS BatchNo,  " &
                    "Isnull(ICD.ItemRate,0) AS ItemRate,Isnull(ICD.FloorWarehouseID,0) AS FloorWarehouseID,  " &
                    "Isnull(ICD.ReturnTransactionID,0) AS ReturnTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,  " &
                    "nullif(ICM.VoucherNo,'') as VoucherNo,nullif(ICM.MaxVoucherNo,'') as MaxVoucherNo,  " &
                    "replace(convert(nvarchar(30),ICM.VoucherDate,106),'','-') as VoucherDate,Nullif(IGM.ItemGroupNameID,'') AS ItemGroupNameID,  " &
                    "Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,  " &
                    "Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,  " &
                    "Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,  " &
                    "Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,  " &
                    "Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.WarehouseName,'') AS Bin  " &
                    "from ItemConsumptionMain as ICM inner join ItemConsumptionDetail as ICD on ICM.CompanyID=ICD.CompanyID And   " &
                    "ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID  " &
                    "INNER JOIN ItemMaster AS IM ON IM.ItemID=ICD.ItemID And IM.CompanyID=ICD.CompanyID   " &
                    "INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID   " &
                    "LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                    "LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ICM.DepartmentID And DM.CompanyID=ICM.CompanyID    " &
                    "LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ICD.JobBookingJobCardContentsID And JC.CompanyID=ICD.CompanyID   " &
                    "LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID  " &
                    "INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ICD.FloorWarehouseID And WM.CompanyID=ICD.CompanyID  " &
                    "where ICM.VoucherID=-30 And ICD.ConsumptionTransactionID='" & transactionID & "' And  ICD.CompanyID='" & GBLCompanyID & "' AND Isnull(ICD.IsDeletedTransaction,0)<>1"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function


    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class