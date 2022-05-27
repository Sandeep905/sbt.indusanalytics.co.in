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
Public Class WebServiceItemTransferBetweenWarehouses
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

    '-----------------------------------Get Stock Transfer Vouchers Data------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCreatedVouchersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ITD.WarehouseID,0) AS WarehouseID,Isnull(ITM.DestinationWarehouseID,0) AS DestinationWarehouseID, " &
                  " Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,Nullif(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,(Select Count(TransactionDetailID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID AND Isnull(IssueQuantity,0)>0 And IsDeletedTransaction=0) AS TotalTransferItems,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,  " &
                  " Nullif(IM.ItemName,'') AS ItemName,Nullif(ITD.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,0 AS BatchStock,Isnull(ITD.IssueQuantity,0) AS TransferStock,Isnull(IT.VoucherNo,0) AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Nullif(W.WarehouseName,'') AS DestinationWarehouse,  " &
                  " Nullif(W.BinName,'') AS DestinationBin,Nullif(UM.UserName,'') AS CreatedBy,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Nullif(ITM.FYear,'') AS FYear  " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                  " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITM.CompanyID INNER JOIN WarehouseMaster AS W ON W.WarehouseID=ITM.DestinationWarehouseID AND W.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID  " &
                  " INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID Where ITM.VoucherID=-22 AND ITM.CompanyID=" & GBLCompanyID & "  AND Isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IssueQUantity,0)>0 Order by FYear,MaxVoucherNo Desc "
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Warehouse Stock Data------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function WarehouseStockData(ByVal WarehouseID As Long) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT Isnull(Temp.GRNTransactionID,0) AS ParentTransactionID,Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(Temp.WarehouseID,0) AS WarehouseID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(Temp.ClosingQty,0) AS BatchStock,Isnull(Temp.ClosingQty,0) AS TransferStock,Nullif(Temp.GRNNo,'') AS GRNNo,Nullif(Temp.GRNDate,'') AS GRNDate,Nullif(Temp.BatchNo,'') AS BatchNo,Nullif(Temp.WarehouseName,'') AS Warehouse,Nullif(Temp.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor " &
                  " From ItemMaster AS IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN (Select Isnull(IM.CompanyID,0) AS CompanyID,Isnull(IM.ItemID,0) AS ItemID,Isnull(ITD.ParentTransactionID,0) AS GRNTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) AS ClosingQty,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif('','') AS Pallet_No,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate From ItemMaster AS IM INNER JOIN ItemTransactionDetail AS ITD ON ITD.ItemID=IM.ItemID AND ITD.CompanyID=IM.CompanyID AND Isnull(ITD.IsDeletedTransaction,0)=0 INNER JOIN ItemTransactionMain AS ITM ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID AND ITM.VoucherID NOT IN(-8,-9,-11) " &
                  " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID Where ITD.WarehouseID=" & WarehouseID & " AND ITD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(IM.ItemID,0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(IM.CompanyID,0) HAVING ((ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0)) > 0)) AS Temp ON Temp.ItemID=IM.ItemID AND Temp.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID Where IM.CompanyID=" & GBLCompanyID & " Order by Isnull(Temp.ClosingQty,0) Desc,Isnull(IM.ItemGroupID,0),Nullif(IM.ItemName,'')"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Destination Bins List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDestinationBinsList(ByVal warehousename As String, ByVal sourcebinid As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT Distinct BinName AS Bin, WarehouseID FROM WarehouseMaster Where WarehouseName='" & warehousename & "' AND WarehouseID<>" & sourcebinid & " AND Isnull(BinName,'')<>'' AND CompanyID=" & GBLCompanyID & " Order By Bin"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Senders List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSenderData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT A.LedgerID As DealerID, A.LedgerName As SenderName, A.MailingName,A.LegalName, NULLIF (A.State, '') AS State, NULLIF (A.City, '') AS City, (SELECT TOP (1) StateTinNo FROM CountryStateMaster WHERE (State = A.State)) AS CompanyStateTinNo FROM LedgerMaster As A Where LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=24) And CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By SenderName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------Open PaaperPurchaseRequisition  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CreateVoucherNo(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String
        Dim VoucherID As Integer

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            VoucherID = -22
            KeyField = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND VoucherID=" & VoucherID & " AND IsDeletedTransaction=0")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Save Stock Verification Voucher ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveStockTransferWarehouseVoucher(ByVal prefix As String, ByVal voucherid As Integer, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsIssueTransactionDetail As Object, ByVal jsonObjectsReceiptTransactionDetail As Object) As String

        Dim VoucherNo As String = ""
        Dim MaxVoucherNo As Long = 0
        Dim KeyField, TransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' AND VoucherID=" & voucherid & " And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            If (db.CheckAuthories("ItemTransferBetweenWarehouses.aspx", GBLUserID, GBLCompanyID, "CanSave", VoucherNo) = False) Then Return "You are not authorized to save..!, Can't Save"

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, AddColValue)

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsIssueTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsReceiptTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    ''----------------------------Update Transfer B/W Warehouse Voucher  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateStockTransferWarehouseVoucher(ByVal TransactionID As String, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsIssueTransactionDetail As Object, ByVal jsonObjectsReceiptTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If (db.CheckAuthories("ItemTransferBetweenWarehouses.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, 1, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsIssueTransactionDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Transfer B/W Warehouse Voucher Delete Data  ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteTransferVoucher(ByVal TransactionID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            If (db.CheckAuthories("ItemTransferBetweenWarehouses.aspx", GBLUserID, GBLCompanyID, "CanDelete", TransactionID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

            str = "Update ItemTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''/////////////////////// Stock Transfer Start ///////////////////
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CreateStockTransferNo(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String
        Dim VoucherID As Integer

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            VoucherID = -20
            KeyField = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND VoucherID=" & VoucherID & " AND IsDeletedTransaction=0")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Pending List Stock Data------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PendingProcessStockData(ByVal Options As String, ByVal FromDate As String, ByVal ToDate As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If Options = "Pending" Then
                str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ITD.WarehouseID,0) AS WarehouseID,Isnull(ITM.DestinationWarehouseID,0) AS DestinationWarehouseID, " &
                 " Nullif(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,(Select Count(TransactionDetailID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID AND Isnull(IssueQuantity,0)>0 And IsDeletedTransaction=0) AS TotalTransferItems,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,  " &
                 " Nullif(IM.ItemName,'') AS ItemName,Nullif(ITD.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,ISNULL(ITD.IssueQuantity, 0) AS BatchStock,Isnull(ITD.IssueQuantity,0) AS TransferStock,Isnull(IT.VoucherNo,0) AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Nullif(W.WarehouseName,'') AS DestinationWarehouse,  " &
                 " Nullif(W.BinName,'') AS DestinationBin,Nullif(UM.UserName,'') AS CreatedBy,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.EWayBillNumber,'') AS EWayBillNumber,Replace(Convert(Varchar(13),ITM.EWayBillDate,106),' ','-') AS EWayBillDate,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor, dbo.CallRateLanded(Isnull(ITD.ParentTransactionID,0), Isnull(IM.ItemID, 0),Nullif(ITD.BatchNo,'')) As PurchaseRate ,IM.ProductHSNID,PGM.HSNCode,PGM.DisplayName " &
                 " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                 " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITM.CompanyID INNER JOIN WarehouseMaster AS W ON W.WarehouseID=ITM.DestinationWarehouseID AND W.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID  " &
                 " INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID Left Join ProductHSNMaster As PGM On PGM.ProductHSNID=IM.ProductHSNID And PGM.CompanyID=IM.CompanyID Where Cast(Floor(Cast(ITM.VoucherDate As Float)) AS datetime) >= ('" & FromDate & "') AND Cast(Floor(Cast(ITM.VoucherDate As Float)) AS datetime) <= ('" & ToDate & "') AND IM.PhysicalStock>0 " &
                 " And ITM.VoucherID=-22 AND ITM.CompanyID=" & GBLCompanyID & "  AND ITM.IsDeletedTransaction =0 AND Isnull(ITD.IssueQuantity,0)>0 Order by TransactionID Desc "
            ElseIf Options = "Processed" Then
                str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ITD.WarehouseID,0) AS WarehouseID,Isnull(ITD.DestinationWarehouseID,0) AS DestinationWarehouseID, " &
                 " Nullif(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,(Select Count(TransactionDetailID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID AND Isnull(ReceiptQuantity,0)>0 And IsDeletedTransaction=0) AS TotalTransferItems,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,  " &
                 " Nullif(IM.ItemName,'') AS ItemName,Nullif(ITD.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,ISNULL(ITD.ReceiptQuantity, 0) AS BatchStock,Isnull(ITD.ReceiptQuantity,0) AS TransferStock,Isnull(IT.VoucherNo,0) AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Nullif(W.WarehouseName,'') AS DestinationWarehouse,  " &
                 " Nullif(W.BinName,'') AS DestinationBin,Nullif(UM.UserName,'') AS CreatedBy,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.EWayBillNumber,'') AS EWayBillNumber,Replace(Convert(Varchar(13),ITM.EWayBillDate,106),' ','-') AS EWayBillDate,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor, ITD.PurchaseRate,ITD.ProductHSNID,PGM.HSNCode,PGM.DisplayName ,LM.LedgerName,SM.LedgerName As SenderName,TM.LedgerName As TransporterName,ITM.WorkOrderNarration " &
                 " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                 " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID = ITM.LedgerID AND LM.CompanyID = ITM.CompanyID INNER JOIN LedgerMaster AS SM ON SM.LedgerID = ITM.DealerID AND SM.CompanyID = ITM.CompanyID INNER JOIN LedgerMaster AS TM ON TM.LedgerID = ITM.Transporter AND TM.CompanyID = ITM.CompanyID INNER JOIN WarehouseMaster AS W ON W.WarehouseID=ITD.DestinationWarehouseID AND W.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID  " &
                 " INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID Left Join ProductHSNMaster As PGM On PGM.ProductHSNID=ITD.ProductHSNID And PGM.CompanyID=ITD.CompanyID Where ITM.VoucherID=-20 AND ITM.CompanyID=" & GBLCompanyID & "  AND Isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.ReceiptQuantity,0)>0 Order by TransactionID Desc "
            End If

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------Save Stock Transfer------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveStockTransfer(ByVal prefix As String, ByVal voucherid As Integer, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsIssueTransactionDetail As Object, ByVal jsonObjectsReceiptTransactionDetail As Object) As String

        Dim VoucherNo As String = ""
        Dim MaxVoucherNo As Long = 0
        Dim KeyField, TransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim NumberToWord As String = db.ReadNumber(jsonObjectsTransactionMain(0)("TotalBasicAmount"), "", "", "INR")

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' AND VoucherID=" & voucherid & " And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
            If (db.CheckAuthories("StockTransfer.aspx", GBLUserID, GBLCompanyID, "CanSave", VoucherNo) = False) Then Return "You are not authorized to save..!, Can't Save"

            TableName = "ItemTransactionMain"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
            AddColValue = "Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "','" & NumberToWord & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, AddColValue)

            TableName = "ItemTransactionDetail"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID"
            AddColValue = "Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsIssueTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)

            TableName = "ItemTransactionDetail"
            db.InsertDatatableToDatabase(jsonObjectsReceiptTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Update Stock Transfer  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateStockTransfer(ByVal TransactionID As String, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsIssueTransactionDetail As Object, ByVal jsonObjectsReceiptTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If (db.CheckAuthories("StockTransfer.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

        Try

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, 1, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsIssueTransactionDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateStockTransferEWayDetails(ByVal TransactionID As String, ByVal EwayDate As String, ByVal EWayBillNumber As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            If (db.CheckAuthories("StockTransfer.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

            str = "Update ItemTransactionMain Set EWayBillNumber='" & EWayBillNumber & "',EWayBillDate='" & EwayDate & "' WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            KeyField = db.ExecuteNonSQLQuery(str)

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''/////////////////////// Stock Transfer End ///////////////////

    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class