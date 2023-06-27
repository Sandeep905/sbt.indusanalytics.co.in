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
Public Class WebServicePurchaseGRN
    Inherits System.Web.Services.WebService

    ReadOnly db As New DBConnection
    ReadOnly js As New JavaScriptSerializer()
    ReadOnly data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    '-----------------------------------Get Supplier List From Purchase------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPurchaseSuppliersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct LM.LedgerID,LM.LedgerName From ItemTransactionMain AS ITM INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID Inner Join LedgerGroupMaster AS LGM On LGM.LedgerGroupID=LM.LedgerGroupID And LGM.CompanyID=LM.CompanyID  AND LGM.LedgerGroupNameID=23 Where ITM.CompanyID=" & GBLCompanyID & " AND ITM.VoucherID=-11 Order By LM.LedgerName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Pending Purchase List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPendingOrdersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct ITM.TransactionID,ITM.VoucherID,ITM.LedgerID,ITD.TransID,ITD.ItemID,ITD.ItemGroupID,IGM.ItemGroupNameID,LM.LedgerName,ITM.MaxVoucherNo,ITM.VoucherNo AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseVoucherDate,IM.ItemCode ,IGM.ItemGroupName,ISGM.ItemSubGroupName,IM.ItemName,Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,Isnull(ITD.PurchaseOrderQuantity,0) AS PendingQty, Isnull(IM.PurchaseUnit,'') AS PurchaseUnit,Isnull(IM.StockUnit,'') AS StockUnit,Isnull(ITD.PurchaseTolerance,0) AS PurchaseTolerance,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy, " &
                  " nullif(ITD.RefJobCardContentNo ,'') AS RefJobCardContentNo,NullIf(ITD.FYear,'') AS FYear,NullIf(ITM.PurchaseDivision,'') AS PurchaseDivision,NULLIf(ITM.PurchaseReferenceRemark,'') AS PurchaseReferenceRemark,Isnull(IM.SizeW,1) AS SizeW,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Nullif(C.ConversionFormula,'') AS FormulaStockToPurchaseUnit,ISNULL(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlacePurchaseUnit,(Select ROUND(Sum(Isnull(ChallanQuantity,0)),3) From ItemTransactionDetail Where PurchaseTransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND Isnull(IsDeletedTransaction,0)<>1) AS ReceiptQuantity,Nullif(CU.ConversionFormula,'') AS FormulaPurchaseToStockUnit,ISNULL(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID AND Isnull(ITM.IsDeletedTransaction,0)=0 INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ConversionMaster AS C ON C.BaseUnitSymbol=IM.StockUnit AND C.ConvertedUnitSymbol=IM.PurchaseUnit  LEFT JOIN ConversionMaster AS CU ON CU.BaseUnitSymbol=IM.PurchaseUnit AND CU.ConvertedUnitSymbol=IM.StockUnit   " &
                  " Where ITM.VoucherID= -11 AND ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsDeletedTransaction,0)<>1  AND Isnull(ITD.IsCompleted,0)<>1 AND Isnull(ITD.IsVoucherItemApproved,0)=1 Order By ITM.TransactionID Desc "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Receipt Vouchers List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetReceiptNoteList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct ITM.TransactionID,nullif(ITD.RefJobCardContentNo ,'') AS RefJobCardContentNo,ITD.PurchaseTransactionID,ITM.LedgerID,ITM.MaxVoucherNo,LM.LedgerName,ITM.VoucherNo AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,ROUND(SUM(Isnull(ITD.ChallanQuantity,0)),2) AS ChallanQuantity,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-') AS GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo,NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName,NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy,ITD.IsVoucherItemApproved " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsDeletedTransaction,0)=0 INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID AND Isnull(ITMP.IsDeletedTransaction,0)=0 INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID And LM.IsDeletedTransaction=0" &
                  " INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID And EM.IsDeletedTransaction=0 Where ITM.VoucherID=-14 AND  ITM.CompanyID=" & GBLCompanyID & " GROUP BY ITM.TransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,ITM.VoucherNo,ITM.VoucherDate, " &
                  " ITMP.VoucherNo,ITMP.VoucherDate,ITM.DeliveryNoteNo,ITM.DeliveryNoteDate,ITM.GateEntryNo,ITM.GateEntryDate,ITM.LRNoVehicleNo,ITM.Transporter,ITM.Narration,EM.LedgerName,LM.LedgerName,ITM.FYear,ITM.MaxVoucherNo,UM.UserName,ITM.ReceivedBy,ITD.RefJobCardContentNo,ITD.IsVoucherItemApproved Order By ITM.TransactionID Desc "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Receipt Note Batch Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetReceiptVoucherBatchDetail(ByVal TransactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select nullif(ITMPD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,  " &
                  "  NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IM.ItemName,'') AS ItemName,Isnull(ITMPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,NullIf(ITMPD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.ChallanQuantity, 0) As ChallanQuantity, NullIf(ITD.BatchNo,'') AS BatchNo,NullIf(IM.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptWtPerPacking,0) AS ReceiptWtPerPacking,Isnull(ITMPD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(IM.WtPerPacking,0) AS WtPerPacking,  " &
                  "  Isnull(IM.UnitPerPacking, 1) As UnitPerPacking, Isnull(IM.ConversionFactor, 1) As ConversionFactor, Isnull(IM.SizeW, 1) As SizeW, Isnull(ITD.WarehouseID, 0) As WarehouseID, Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Isnull((Select Sum(Isnull(ChallanQuantity,0))  From ItemTransactionDetail Where Isnull(IsDeletedTransaction,0)=0 AND Isnull(PurchaseTransactionID,0)>0 AND Isnull(ChallanQuantity,0)>0 AND PurchaseTransactionID=ITMPD.TransactionID AND ItemID=ITMPD.ItemID),0) AS ReceiptQuantity,Nullif(CM.ConversionFormula,'') AS FormulaStockToPurchaseUnit,Isnull(CM.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlacePurchaseUnit,Nullif(CU.ConversionFormula,'') AS FormulaPurchaseToStockUnit,Isnull(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit  " &
                  "  From ItemTransactionMain As ITM INNER Join ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsDeletedTransaction,0)=0 INNER Join ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER Join ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER Join ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID INNER Join ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITMP.TransactionID And ITMPD.ItemID=IM.ItemID And ITMPD.TransactionID=ITD.PurchaseTransactionID And ITMPD.CompanyID=ITMP.CompanyID AND Isnull(ITMP.IsDeletedTransaction,0)=0 AND Isnull(ITMPD.IsDeletedTransaction,0)=0 " &
                  "  INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID Left Join ConversionMaster AS CM ON CM.BaseUnitSymbol=IM.StockUnit And CM.ConvertedUnitSymbol=IM.PurchaseUnit And CM.CompanyID=IM.CompanyID Left Join ConversionMaster AS CU ON CU.BaseUnitSymbol=IM.PurchaseUnit And CU.ConvertedUnitSymbol=IM.StockUnit And CU.CompanyID=IM.CompanyID Where ITM.VoucherID = -14 And ITM.TransactionID ='" & TransactionID & "' AND  ITM.CompanyID='" & GBLCompanyID & "'  Order By TransID"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Receivers List From Employee------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetReceiverList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Distinct LM.LedgerID,LM.LedgerName From LedgerMaster As LM Inner Join LedgerGroupMaster AS LGM On LGM.LedgerGroupID=LM.LedgerGroupID And LGM.CompanyID=LM.CompanyID  AND LGM.LedgerGroupNameID=27 Where LM.CompanyID=" & GBLCompanyID & " And LM.IsDeletedTransaction=0 Order By LM.LedgerName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
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
            str = "Select DISTINCT WarehouseName AS Warehouse From WarehouseMaster Where Isnull(IsDeletedTransaction,0)=0 AND Isnull(WarehouseName,'')<>'' AND CompanyID=" & GBLCompanyID & "  Order By WarehouseName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
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
            If warehousename = "" Then
                str = "SELECT Distinct Nullif(BinName,'') AS Bin,Isnull(WarehouseID,0) AS WarehouseID FROM WarehouseMaster Where Isnull(IsDeletedTransaction,0)=0 AND Isnull(BinName,'')<>'' AND CompanyID=" & GBLCompanyID & " Order By Bin"
            Else str = "SELECT Distinct Nullif(BinName,'') AS Bin,Isnull(WarehouseID,0) AS WarehouseID FROM WarehouseMaster Where Isnull(IsDeletedTransaction,0)=0 AND WarehouseName='" & warehousename & "' AND Isnull(BinName,'')<>'' AND CompanyID=" & GBLCompanyID & " Order By Bin"
            End If
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------GetPreviousReceivedQuantity------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPreviousReceivedQuantity(ByVal PurchaseTransactionID As String, ByVal ItemID As String, ByVal GRNTransactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Isnull(PTM.TransactionID,0) AS TransactionID,Isnull(PTD.ItemID,0) AS ItemID,Isnull(PTD.ItemID,0) AS ItemID,Isnull(PTD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(PTD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,IM.PurchaseUnit,Isnull((Select Sum(Isnull(ChallanQuantity,0)) From ItemTransactionDetail Where ISNULL(ChallanQuantity,0)>0 AND PurchaseTransactionID=PTM.TransactionID AND TransactionID<>" & GRNTransactionID & " AND ItemID=PTD.ItemID AND CompanyID=PTM.CompanyID AND Isnull(IsDeletedTransaction,0)<>1),0 ) AS PreReceiptQuantity,IM.StockUnit,Nullif(C.ConversionFormula,'') AS FormulaPurchaseToStockUnit,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit  " &
                " From ItemTransactionMain AS PTM INNER JOIN ItemTransactionDetail AS PTD ON PTD.TransactionID=PTM.TransactionID AND PTM.CompanyID=PTD.CompanyID AND Isnull(PTM.IsDeletedTransaction,0)=0 AND Isnull(PTD.IsDeletedTransaction,0)=0 INNER JOIN ItemMaster AS IM ON IM.ItemID=PTD.ItemID AND IM.CompanyID=PTD.CompanyID LEFT JOIN ConversionMaster AS C ON C.BaseUnitSymbol=IM.PurchaseUnit AND C.ConvertedUnitSymbol=IM.StockUnit AND C.CompanyID=IM.CompanyID Where PTM.VoucherID=-11 AND PTM.TransactionID=" & PurchaseTransactionID & " AND PTD.ItemID=" & ItemID & "  AND PTM.CompanyID=" & GBLCompanyID & ""
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    '---------------Close Master code---------------------------------

    ''----------------------------Generate Receipt No ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetReceiptNo(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            KeyField = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND VoucherID=-14 AND Isnull(IsDeletedTransaction,0)=0")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Save Receipt Note Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveReceiptData(ByVal prefix As String, ByVal voucherid As Integer, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsTransactionDetail As Object) As String

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
        If db.CheckAuthories("PurchaseGRN.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!, Can't Save"

        Try

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' AND VoucherID=" & voucherid & " And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND Isnull(IsDeletedTransaction,0)=0 ")
            TableName = "ItemTransactionMain"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, AddColValue)
            If IsNumeric(TransactionID) = False Then
                Return "Error:Main " & TransactionID
            End If

            TableName = "ItemTransactionDetail"
            AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID,ParentTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "'," & GBLCompanyID & ",'" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "','" & TransactionID & "'"
            str = db.InsertDatatableToDatabase(jsonObjectsTransactionDetail, TableName, AddColName, AddColValue, "Receipt Note", TransactionID)
            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                Return "Error:Detail " & str
            End If

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            Return "Error:Ex " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Update Receipt Note Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateReceiptData(ByVal TransactionID As String, ByVal jsonObjectsTransactionMain As Object, ByVal jsonObjectsTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If db.CheckAuthories("PurchaseGRN.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to update..!, Can't Update"

        Try
            Using trans As New Transactions.TransactionScope
                TableName = "ItemTransactionMain"
                AddColName = "ModifiedDate='" & DateTime.Now & "',CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
                str = db.UpdateDatatableToDatabase(jsonObjectsTransactionMain, TableName, AddColName, 1, wherecndtn)
                If str <> "Success" Then
                    trans.Dispose()
                    Return "Error:Main " & str
                End If
                db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

                TableName = "ItemTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,ParentTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsTransactionDetail, TableName, AddColName, AddColValue, "Receipt Note", TransactionID)
                If IsNumeric(str) = False Then
                    trans.Dispose()
                    Return "Error:Detail " & str
                End If

                trans.Complete()
                KeyField = "Success"
            End Using
            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

        Catch ex As Exception
            KeyField = "Error:Ex " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Purchase GRN Delete Data ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePGRN(ByVal TransactionID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If (db.CheckAuthories("PurchaseGRN.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False) Then Return "You are not authorized to delete..!, Can't Delete"

        Try
            str = "Update ItemTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal TransactionID As String) As String
        Dim KeyField As String = ""
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            Dim D1, D2 As String

            SxistStr = "Select TransactionID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And ParentTransactionID = " & TransactionID & " And CompanyID = '" & GBLCompanyID & "' And TransactionID <> ParentTransactionID"
            db.FillDataTable(dtExist, SxistStr)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                D1 = dtExist.Rows(0)(0)
            End If

            SxistStr = "Select TransactionID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And isnull(QCApprovalNo,'')<>'' AND TransactionID=" & TransactionID & "  AND (Isnull(ApprovedQuantity,0)>0 OR  Isnull(RejectedQuantity,0)>0)"
            db.FillDataTable(dtExist1, SxistStr)
            Dim F As Integer = dtExist1.Rows.Count
            If F > 0 Then
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


    '--------------- Get Requisition and purchase order Comment Data---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCommentData(ByVal receiptTransactionID As String, ByVal purchaseTransactionIDs As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        If receiptTransactionID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Goods Receipt Note',0,0," & receiptTransactionID & ",0,0,0,0,0"
        Else
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Goods Receipt Note',0,'" & purchaseTransactionIDs & "',0,0,0,0,0,0"
        End If
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Save Comment Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCommentData(ByVal jsonObjectCommentDetail As Object) As String

        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "CommentChainMaster"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"
            db.InsertDatatableToDatabase(jsonObjectCommentDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''''Item Stock Update ''''---------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVouchersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select DISTINCT TransactionID,VoucherNo From ItemTransactionMain Where IsDeletedTransaction=0 AND VoucherID Not IN(-8,-17,-11,-9) And CompanyID=" & GBLCompanyID & "  Order By VoucherNo"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function TransactionWiseStockData(ByVal TransID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "SELECT IM.ItemID,IM.ItemGroupID,ISGM.ItemSubGroupID,IM.ItemCode,IGM.ItemGroupName,ISGM.ItemSubGroupName,IM.ItemName,IM.StockUnit,IM.PhysicalStock,IM.BookedStock,IM.AllocatedStock,IM.UnapprovedStock,IM.PhysicalStock - IM.AllocatedStock AS FreeStock,IM.IncomingStock,IM.FloorStock,IM.PhysicalStock - IM.AllocatedStock + IM.IncomingStock - IM.BookedStock AS TheoriticalStock,IM.WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace  " &
                  " From ItemMaster AS IM INNER JOIN ItemTransactionDetail As ITD ON ITD.ItemID=IM.ItemID And IM.CompanyID=ITD.CompanyID And ITD.IsDeletedTransaction = 0 INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID And IM.IsDeletedTransaction=0 LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID Where IM.CompanyID=" & GBLCompanyID & " And ITD.TransactionID=" & TransID & " Order By IM.ItemName"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class