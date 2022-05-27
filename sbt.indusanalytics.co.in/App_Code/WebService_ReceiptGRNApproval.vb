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
Public Class WebService_ReceiptGRNApproval
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
    '-----------------------------------Get Receipt Vouchers List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillGrid(ByVal RadioValue As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            If RadioValue = "Pending Receipt Note" Then
                str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(LM.LedgerName,'') AS LedgerName,NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo, " &
                        "Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,ROUND(SUM(Isnull(ITD.ChallanQuantity,0)),2) AS ChallanQuantity,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-') AS GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo, " &
                        "NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName,NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy  " &
                        "From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  " &
                        "INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID Where ITM.VoucherID=-14 AND  ITM.CompanyID=" & GBLCompanyID & " and isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsVoucherItemApproved,0)<>1 AND Isnull(ITD.QCApprovalNo,'')=''  " &
                        "GROUP BY Isnull(ITM.TransactionID,0),Isnull(ITD.PurchaseTransactionID,0),Isnull(ITM.LedgerID,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'),  NullIf(ITMP.VoucherNo,''),Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-'),NullIf(ITM.DeliveryNoteNo,''),Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-'),NullIf(ITM.GateEntryNo,''),Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-'),NullIf(ITM.LRNoVehicleNo,''),NullIf(ITM.Transporter,''),NullIf(ITM.Narration,''),NullIf(EM.LedgerName,''),NullIf(LM.LedgerName,''),NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0),NullIf(UM.UserName,''),Isnull(ITM.ReceivedBy,0) Order By  FYear,MaxVoucherNo Desc "
            Else
                str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(LM.LedgerName,'') AS LedgerName,NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo, " &
                        "Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,ROUND(SUM(Isnull(ITD.ChallanQuantity,0)),2) AS ChallanQuantity,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-') AS GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo, " &
                        "NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName,NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy,Nullif(UA.UserName,'') AS ApprovedBy,Replace(Convert(Varchar(13),ITD.VoucherItemApprovedDate,106),' ','-') AS ApprovalDate  " &
                        "From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UA ON UA.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID  Where ITM.VoucherID=-14 AND  ITM.CompanyID=" & GBLCompanyID & " And isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsVoucherItemApproved,0)<>0 AND Isnull(ITD.QCApprovalNo,'')<>'' " &
                        "GROUP BY Isnull(ITM.TransactionID,0),Isnull(ITD.PurchaseTransactionID,0),Isnull(ITM.LedgerID,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'),  NullIf(ITMP.VoucherNo,''),Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-'),NullIf(ITM.DeliveryNoteNo,''),Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-'),NullIf(ITM.GateEntryNo,''),Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-'),NullIf(ITM.LRNoVehicleNo,''),NullIf(ITM.Transporter,''),NullIf(ITM.Narration,''),NullIf(EM.LedgerName,''),NullIf(LM.LedgerName,''),NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0),NullIf(UM.UserName,''),Isnull(ITM.ReceivedBy,0),Nullif(UA.UserName,''),Replace(Convert(Varchar(13),ITD.VoucherItemApprovedDate,106),' ','-') Order By  FYear,MaxVoucherNo Desc "

            End If
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
    Public Function GetReceiptVoucherBatchDetail(ByVal TransactionID As String, ByVal RadioValue As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            If RadioValue = "Pending Receipt Note" Then
                str = "Select Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(IM.ItemName,'') AS ItemName,NullIf(IM.ItemDescription,'') AS ItemDescription,Isnull(ITMPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,NullIf(ITMPD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.ChallanQuantity,0) AS ChallanQuantity,Isnull(ITD.ChallanQuantity,0) AS ApprovedQuantity,0 AS RejectedQuantity,NullIf(ITD.BatchNo,'') AS BatchNo,NullIf(ITD.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptWtPerPacking,0) AS ReceiptWtPerPacking,Isnull(ITMPD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,0 AS SizeW,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Isnull(UOM.DecimalPlace,0)  AS UnitDecimalPlace  " &
                      " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITMP.TransactionID AND ITMPD.ItemID=IM.ItemID AND ITMPD.TransactionID=ITD.PurchaseTransactionID AND ITMPD.CompanyID=ITMP.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID  " &
                      " Where ITM.VoucherID=-14 And ITM.TransactionID=" & TransactionID & " And  ITM.CompanyID=" & GBLCompanyID & " Order By TransID"

            Else
                str = "Select Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(IM.ItemName,'') AS ItemName,NullIf(IM.ItemDescription,'') AS ItemDescription,Isnull(ITMPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,NullIf(ITMPD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.ChallanQuantity,0) AS ChallanQuantity,Isnull(ITD.ApprovedQuantity,0) AS ApprovedQuantity,Isnull(ITD.RejectedQuantity,0) AS RejectedQuantity,nullif(ITD.QCApprovalNO,'') AS QCApprovalNO,nullif(ITD.QCApprovedNarration,'') AS QCApprovedNarration, NullIf(ITD.BatchNo,'') AS BatchNo,NullIf(ITD.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptWtPerPacking,0) AS ReceiptWtPerPacking,Isnull(ITMPD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,0 AS SizeW,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Isnull(UOM.DecimalPlace,0)  AS UnitDecimalPlace " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITMP.TransactionID AND ITMPD.ItemID=IM.ItemID AND ITMPD.TransactionID=ITD.PurchaseTransactionID AND ITMPD.CompanyID=ITMP.CompanyID  INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID  " &
                  " Where ITM.VoucherID=-14 AND ITM.TransactionID=" & TransactionID & " AND  ITM.CompanyID=" & GBLCompanyID & " Order By TransID"

            End If
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open PurchaseOrder  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateGRNApproval(ByVal jsonObjectsRecordGRNApproval As Object, ByVal TransactionID As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If db.CheckAuthories("ReceiptGRNApproval.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!"

        Try
            Dim dtExist As New DataTable
            str = "Select TransactionID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And ParentTransactionID = '" & TransactionID & "' And CompanyID = '" & GBLCompanyID & "' And TransactionID <> ParentTransactionID"
            db.FillDataTable(dtExist, str)
            If dtExist.Rows.Count > 0 Then
                Return "Exist"
            End If

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate='" & DateTime.Now & "',CompanyID=" & GBLCompanyID & ",ModifiedBy=" & GBLUserID & ",VoucherItemApprovedBy='" & GBLUserID & "',VoucherItemApprovedDate='" & DateTime.Now & "'"
            wherecndtn = " Isnull(IsDeletedTransaction, 0) = 0 And CompanyID=" & GBLCompanyID & ""
            KeyField = db.UpdateDatatableToDatabase(jsonObjectsRecordGRNApproval, TableName, AddColName, 3, wherecndtn)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    '---------------PrintReceiptApproval---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function HeaderNAme(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select CM.CompanyName,NULL AS POReference,NullIf(LM.GSTNo,'') AS GSTNo, NullIf(LM.MailingAddress,'') As SuppAddress ,  " &
               " ITM.TransactionID,Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,  " &
               " Isnull(ITM.LedgerID,0) As LedgerID,Isnull(ITM.MaxVoucherNo,0) As MaxVoucherNo,NullIf(LM.LedgerName,'') AS LedgerName,  " &
               " NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,  " &
               " NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo, Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,  " &
               " ROUND(SUM(Isnull(ITD.ChallanQuantity,0)),2) AS ChallanQuantity,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,  " &
               " Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo,  " &
               " Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-') AS GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo,   " &
               " NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName,NullIf(ITM.Narration,'') AS Narration,  " &
               " NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy    " &
               " From ItemTransactionMain AS ITM   " &
               " INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID   " &
               " Inner join CompanyMaster As CM on CM.CompanyID= ITM.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID   " &
               " INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND  " &
               " LM.CompanyID=ITM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID  " &
               " LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID Where ITM.VoucherID=-14 AND  " &
               " ITM.CompanyID='" & GBLCompanyID & "' and ITM.TransactionID='" & transactionID & "' And isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsVoucherItemApproved,0)<>0 AND Isnull(ITD.QCApprovalNo,'')<>'' " &
               " GROUP BY CM.CompanyName,NullIf(LM.GSTNo,''),NullIf(LM.MailingAddress,''), ITM.TransactionID,Isnull(ITD.PurchaseTransactionID,0), Isnull(ITM.LedgerID,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'),    " &
               " NullIf(ITMP.VoucherNo,''),Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-'),NullIf(ITM.DeliveryNoteNo,''), Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-'),NullIf(ITM.GateEntryNo,''),  " &
               " Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-'),NullIf(ITM.LRNoVehicleNo,''),NullIf(ITM.Transporter,''), NullIf(ITM.Narration,''),NullIf(EM.LedgerName,''),NullIf(LM.LedgerName,''),NullIf(ITM.FYear,''),  " &
               " Isnull(ITM.MaxVoucherNo,0),NullIf(UM.UserName,''),Isnull(ITM.ReceivedBy,0) Order By ITM.TransactionID"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal TransactionID As String) As String
        Dim KeyField As String
        KeyField = ""
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            SxistStr = ""
            SxistStr = "Select TransactionID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And ParentTransactionID = '" & TransactionID & "' And CompanyID = '" & GBLCompanyID & "' And TransactionID <> ParentTransactionID"
            db.FillDataTable(dtExist, SxistStr)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            End If

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