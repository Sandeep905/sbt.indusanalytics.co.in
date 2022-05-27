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
Public Class WebServiceItemPhysicalVerification
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

    '-----------------------------------Get Supplier List From Purchase------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PhysicalStockData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'str = "SELECT Isnull(Temp.GRNTransactionID,0) AS ParentTransactionID,Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(Temp.WarehouseID,0) AS WarehouseID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(Temp.ClosingQty,0) AS BatchStock,Isnull(IM.PhysicalStock,0) AS TotalPhysicalStock,Isnull(IM.BookedStock,0) AS TotalBookedStock,Isnull(IM.AllocatedStock,0) AS TotalAllocatedStock,Isnull(IM.UnapprovedStock,0) AS TotalUnapprovedStock,0 AS TotalFreeStock,Isnull(IM.IncomingStock,0) AS TotalIncomingStock,0 AS TotalOutgoingStock,Isnull(IM.FloorStock,0) AS TotalFloorStock,0 AS TotalTheoriticalStock,0 AS TotalPhysicalStockValue,0 AS TotalBookedStockValue,0 AS TotalAllocatedStockValue,0 AS TotalUnapprovedStockValue,0 AS TotalFreeStockValue,0 AS TotalIncomingStockValue,0 AS TotalOutgoingStockValue,0 AS TotalFloorStockValue,0 AS TotalTheoriticalStockValue,Nullif(Temp.GRNNo,'') AS GRNNo,Nullif(Temp.GRNDate,'') AS GRNDate,Nullif(Temp.BatchNo,'') AS BatchNo,Nullif(Temp.WarehouseName,'') AS Warehouse,Nullif(Temp.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace  " &
            '      " From ItemMaster AS IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID LEFT JOIN (Select Isnull(IM.CompanyID,0) AS CompanyID,Isnull(IM.ItemID,0) AS ItemID,Isnull(ITD.ParentTransactionID,0) AS GRNTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) AS ClosingQty,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif('','') AS Pallet_No,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID AND ITM.VoucherID NOT IN(-8,-9,-11) AND Isnull(ITD.IsDeletedTransaction,0)=0 INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID  " &
            '      " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID Where IM.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(IM.ItemID,0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(IM.CompanyID,0) HAVING ((ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0)) > 0)) AS Temp ON Temp.ItemID=IM.ItemID AND Temp.CompanyID=IM.CompanyID Where IM.CompanyID=" & GBLCompanyID & " Order by Isnull(Temp.ClosingQty,0) Desc,Isnull(IM.ItemGroupID,0),Nullif(IM.ItemName,'')"

            str = "SELECT 0 AS ParentTransactionID,Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,0 AS WarehouseID,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,0 AS BatchStock,Isnull(IM.PhysicalStock,0) AS PhysicalStock,Isnull(IM.BookedStock,0) AS BookedStock,Isnull(IM.AllocatedStock,0) AS AllocatedStock,Isnull(IM.UnapprovedStock,0) AS UnapprovedStock,0 AS FreeStock,Isnull(IM.IncomingStock,0) AS IncomingStock,0 AS OutgoingStock,Isnull(IM.FloorStock,0) AS FloorStock,0 AS TheoriticalStock,0 AS PhysicalStockValue,0 AS BookedStockValue,0 AS AllocatedStockValue,0 AS UnapprovedStockValue,0 AS FreeStockValue,0 AS IncomingStockValue,0 AS OutgoingStockValue,0 AS FloorStockValue,0 AS TheoriticalStockValue,Nullif('','') AS GRNNo,Nullif('','') AS GRNDate,Nullif('','') AS BatchNo,Nullif('','') AS Warehouse,Nullif('','') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace  " &
                  " From ItemMaster AS IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID And Isnull(IM.IsDeletedTransaction,0)=0 LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID Where IM.CompanyID=" & GBLCompanyID & " Order By Isnull(IM.ItemGroupID,0),Nullif(IM.ItemName,'')"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Stock Batch wise Item List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetStockBatchWise(ByVal ItemId As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "SELECT Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,   Isnull(Temp.ParentTransactionID,0) As ParentTransactionID,Isnull(Temp.WarehouseID,0) As WarehouseID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription, Nullif(IM.StockUnit,'') AS StockUnit,Isnull(Temp.ClosingQty,0) AS BatchStock,0 AS IssueQuantity,Nullif(Temp.GRNNo,'') AS GRNNo,Replace(Convert(varchar(13),Temp.GRNDate,106),' ','-') AS GRNDate,Nullif(Temp.BatchNo,'') AS BatchNo,Nullif(Temp.WarehouseName,'') AS Warehouse,Nullif(Temp.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor   " &
                  " From ItemMaster As IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID And Isnull(IM.IsDeletedTransaction,0)=0 INNER JOIN (Select Isnull(IM.CompanyID,0) AS CompanyID,Isnull(IM.ItemID,0) AS ItemID,Isnull(ITD.WarehouseID,0) AS WarehouseID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.RejectedQuantity,0)), 0) AS ClosingQty,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif('','') AS Pallet_No,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate From ItemMaster As IM INNER JOIN ItemTransactionDetail As ITD On ITD.ItemID=IM.ItemID And ITD.CompanyID=IM.CompanyID And Isnull(ITD.IsDeletedTransaction, 0)=0 And (Isnull(ITD.ReceiptQuantity,0)>0 Or Isnull(ITD.IssueQuantity,0)>0) INNER JOIN ItemTransactionMain As ITM On ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And ITM.VoucherID Not In(-8, -9, -11)  INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID  " &
                  " Where ITD.CompanyID=" & GBLCompanyID & " And ITD.ItemID=" & ItemId & " Group BY Isnull(IM.ItemID, 0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(IM.CompanyID,0) HAVING((ISNULL(SUM(Isnull(ITD.ReceiptQuantity, 0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity, 0)), 0) - ISNULL(SUM(Isnull(ITD.RejectedQuantity,0)), 0)) > 0)) As Temp On Temp.ItemID=IM.ItemID And Temp.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                  " Where IM.CompanyID =" & GBLCompanyID & "  and IM.ItemID=" & ItemId & "  Order by ParentTransactionID"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateVoucherNo() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Return db.GeneratePrefixedNo("ItemTransactionMain", "PHY", "MaxVoucherNo", 0, GBLFYear, " Where VoucherPrefix='PHY' AND VoucherID=-16 And Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    '-----------------------------------Get Warehouse List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetWarehouseList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select DISTINCT WarehouseName AS Warehouse From WarehouseMaster Where Isnull(WarehouseName,'') <> '' AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & "  Order By WarehouseName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Bins List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBinsList(ByVal warehousename As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT Distinct BinName AS Bin,Isnull(WarehouseID,0) AS WarehouseID FROM WarehouseMaster Where WarehouseName='" & warehousename & "' AND Isnull(BinName,'')<>'' AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & " Order By BinName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Show List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RefreshVouchersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT ITD.TransactionDetailID,ITM.TransactionID, ITD.ParentTransactionID, ITD.ItemID,ITD.ItemGroupID, 0 AS ItemSubGroupID, ITD.WarehouseID, ITM.VoucherNo, REPLACE(CONVERT(varchar(13),ITM.VoucherDate, 106), ' ', '-') AS VoucherDate, IGM.ItemGroupName, ISGM.ItemSubGroupName, IM.ItemCode, IM.ItemName,ITD.StockUnit, ITD.OldStockQuantity,ITD.NewStockQuantity, CASE WHEN Isnull(ITD.ReceiptQuantity, 0) > 0 THEN Isnull(ITD.ReceiptQuantity, 0) ELSE Isnull(ITD.IssueQuantity, 0) END AS AdjustedStockQty, CASE WHEN Isnull(ITD.ReceiptQuantity, 0) > 0 THEN ITD.OldStockQuantity+Isnull(ITD.ReceiptQuantity, 0) ELSE ITD.OldStockQuantity-Isnull(ITD.IssueQuantity, 0) END As ClosingQty,NULLIF (IT.VoucherNo, '') AS GRNNo, REPLACE(CONVERT(varchar(13), IT.VoucherDate, 106), ' ', '-') AS GRNDate, NULLIF (ITD.BatchNo, '') AS BatchNo, NULLIF (WM.WarehouseName, '') AS Warehouse, NULLIF (WM.BinName, '') AS Bin, NULLIF (ITM.Narration, '') AS Narration, ISNULL(IM.WtPerPacking, 0) AS WtPerPacking, ISNULL(IM.UnitPerPacking, 1) AS UnitPerPacking, ISNULL(IM.ConversionFactor, 1) AS ConversionFactor, NULLIF (UM.UserName, '') AS CreatedBy " &
                  " FROM ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID Where ITM.VoucherID=-16 AND ITM.CompanyID=" & GBLCompanyID & " /*AND ITM.FYEAR IN('2018-2019','2017-2018')*/ Order By ITM.TransactionID Desc"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Save Stock Verification Voucher ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveStockVerificationVoucher(ByVal prefix As String, ByVal voucherid As Integer, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsTransactionDetail As Object) As String

        Dim dt As New DataTable
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

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' AND VoucherID=" & voucherid & " And IsDeletedTransaction =0 And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
            If (db.CheckAuthories("ItemPhysicalVerification.aspx", GBLUserID, GBLCompanyID, "CanSave", VoucherNo) = False) Then Return "You are not authorized to save..!, Can't Save"

            Using SqlTrans As New Transactions.TransactionScope
                TableName = "ItemTransactionMain"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    SqlTrans.Dispose()
                    Return "Error: Main" & TransactionID
                End If

                TableName = "ItemTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)
                If IsNumeric(str) = False Then
                    SqlTrans.Dispose()
                    Return "Error: Details" & str
                End If

                db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
                SqlTrans.Complete()
                KeyField = "Success"
            End Using

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePhysicalVerification(ByVal TransID As Integer, ByVal ItemID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            If (db.CheckAuthories("ItemPhysicalVerification.aspx", GBLUserID, GBLCompanyID, "CanDelete", TransID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

            'db.ExecuteNonSQLQuery("Update ItemTransactionMain Set IsDeletedTransaction=1,DeletedBy =" & GBLUserID & ",DeletedDate=Getdate() Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransID)
            db.ExecuteNonSQLQuery("Update ItemTransactionDetail Set IsDeletedTransaction=1,DeletedBy =" & GBLUserID & ",DeletedDate=Getdate() Where CompanyID=" & GBLCompanyID & " And TransactionDetailID=" & TransID)
            db.ExecuteNonSQLQuery("Exec UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & ",0," & ItemID & "")

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------Save Stock Verification Voucher ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ImportStockVerificationData(ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim VoucherNo As String = ""
        Dim MaxVoucherNo As Long = 0
        Dim KeyField, TransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""
        Dim prefix As String = "PHY"
        Dim voucherid As Integer = -16

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' AND VoucherID=" & voucherid & " And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
            If (db.CheckAuthories("ItemPhysicalVerification.aspx", GBLUserID, GBLCompanyID, "CanSave", VoucherNo) = False) Then Return "You are not authorized to save..!, Can't Save"
            Using SqlTrans As New Transactions.TransactionScope(Transactions.TransactionScopeOption.Required, New System.TimeSpan(0, 60, 0))
                TableName = "ItemTransactionMain"
                AddColName = "VoucherDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherID,VoucherPrefix,MaxVoucherNo,VoucherNo"
                AddColValue = "Getdate(),Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "'," & voucherid & ",'" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    SqlTrans.Dispose()
                    Return "Error: Main" & TransactionID
                End If

                TableName = "ItemTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,ParentTransactionID"
                AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsTransactionDetail, TableName, AddColName, AddColValue, "", TransactionID)
                If IsNumeric(str) = False Then
                    SqlTrans.Dispose()
                    Return "Error: Details" & str
                End If

                db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
                SqlTrans.Complete()
                KeyField = "Success"
            End Using

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class