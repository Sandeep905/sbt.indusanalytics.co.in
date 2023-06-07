Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection

Partial Class ReportPurchaseGRN
    Inherits System.Web.UI.Page
    Dim db As New DBConnection
    'Dim GBLCompanyID As String = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
    Dim GBLCompanyID, TransactionID, PrintType As String

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))
            PrintType = Convert.ToString(HttpContext.Current.Request.QueryString("PrintType"))
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Dim Str As String
            If PrintType = "Other" Then
                Str = "Select  NullIf(CM.CompanyName,'') AS CompanyName,ITMP.PurchaseDivision,ITMP.PurchaseReferenceRemark As POReference,NullIf(LM.GSTNo,'') AS GSTNo,LM.MailingAddress As SuppAddress,Isnull(ITM.TransactionID,0) AS TransactionID, Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID, Isnull(ITM.LedgerID,0) As LedgerID,NullIf(LM.LedgerName,'') AS LedgerName, NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,ITM.VoucherDate AS ReceiptVoucherDate, NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,  " &
                   "  ITMP.VoucherDate As PurchaseVoucherDate,ITMPD.RefJobCardContentNo As ItemDescription, NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo, ITM.DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo, ITM.GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo, NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName, NullIf(ITM.Narration,'') AS Narration,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy," &
                   "  ITD.ItemName,Isnull(ITD.ReceiptQuantity,0) AS ChallanQuantity, NullIf(ITMPD.PurchaseUnit,'') AS StockUnit,Isnull(ITMPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity, ITD.TransId,PGM.HSNCode " &
                   "  From OtherItemTransactionMain AS ITM " &
                   "  INNER JOIN OtherItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN CompanyMaster as CM on CM.CompanyID= ITM.CompanyID  " &
                   "  INNER JOIN OtherItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN OtherItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITMP.TransactionID And ITMPD.ItemName=ITD.ItemName AND ITMPD.CompanyID=ITD.CompanyID " &
                   "  LEFT Join ProductHSNMaster As PGM On PGM.ProductHSNID=ITMPD.ProductHSNID And PGM.CompanyID=ITD.CompanyID " &
                   "  INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],[MailingAddress],[GSTNo]   " &
                   "  From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[MailingAddress],[GSTNo] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'') as FieldValue  FROM [LedgerMasterDetails] where CompanyID='" & GBLCompanyID & "'    " &
                   "  And Isnull(IsDeletedTransaction,0)<>1 And LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=23))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[MailingAddress],[GSTNo])) p) AS A   " &
                   "  Where A.CompanyID='" & GBLCompanyID & "' ) AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  " &
                   "  INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID " &
                   "  LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID  " &
                   "  Where ITM.VoucherID=-103 AND ITM.CompanyID='" & GBLCompanyID & "' And ITM.TransactionID='" & TransactionID & "' And isnull(ITM.IsDeletedTransaction,0)<>1 Order By  TransID "

            Else
                Str = "Select  NullIf(CM.CompanyName,'') AS CompanyName,ITMP.PurchaseDivision,ITMP.PurchaseReferenceRemark As POReference,NullIf(LM.GSTNo,'') AS GSTNo,LM.MailingAddress As SuppAddress ,   Isnull(ITM.TransactionID,0) AS TransactionID, Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID, Isnull(ITM.LedgerID,0) As LedgerID,Isnull(ITM.MaxVoucherNo,0) As MaxVoucherNo,NullIf(LM.LedgerName,'') AS LedgerName, NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,   NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,  " &
                   "  ITMP.VoucherDate As PurchaseVoucherDate,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo, 0 As ShelfLife, ITM.DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo, ITM.GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo,    NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName, NullIf(ITM.Narration,'') AS Narration,   NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,  " &
                   "  Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IM.ItemName,'') AS ItemName,Case When IGM.ItemGroupNameID=-1 Then Round(ITMPD.PurchaseOrderQuantity/ITD.ReceiptWtPerPacking,0) Else ITMPD.PurchaseOrderQuantity End As OrderSheets ,Case When IGM.ItemGroupNameID=-1 Then Round(ITD.ChallanQuantity*ITD.ReceiptWtPerPacking,3) Else ITD.ChallanQuantity End As ChallanWt ,Isnull(ITD.ChallanQuantity,0) AS ChallanQuantity,Isnull(ITD.ApprovedQuantity,0) AS [AcceptPkt],Case When IGM.ItemGroupNameID=-1 Then ITD.ApprovedQuantity*ITD.ReceiptWtPerPacking Else ITD.ApprovedQuantity End As ApprovedQuantity,Isnull(ITD.RejectedQuantity,0) AS RejectedQuantity,Case When IGM.ItemGroupNameID=-1 Then ITD.RejectedQuantity*ITD.ReceiptWtPerPacking Else ITD.RejectedQuantity End As RejectedWt,nullif(ITD.QCApprovalNO,'') AS QCApprovalNO,  " &
                   "  nullif(ITD.QCApprovedNarration,'') AS QCApprovedNarration, NullIf(ITD.BatchNo,'') AS BatchNo,NullIf(ITMPD.PurchaseUnit,'') AS StockUnit,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin, (Nullif(WM.WarehouseName,'')+' '+Nullif(WM.BinName,'')) AS WarehouseBinName,Isnull(ITMPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity, ITD.TransId,PGM.HSNCode " &
                   "  From ItemTransactionMain AS ITM " &
                   "  INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID  " &
                   "  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                   "  INNER JOIN CompanyMaster as CM on CM.CompanyID= ITM.CompanyID  " &
                   "  INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITD.PurchaseTransactionID And ITMPD.ItemID=ITD.ItemID AND ITMPD.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID  " &
                   "  Inner Join ProductHSNMaster As PGM On PGM.ProductHSNID=IM.ProductHSNID And PGM.CompanyID=IM.CompanyID " &
                   "  INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],[MailingAddress],[GSTNo]   " &
                   "  From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[MailingAddress],[GSTNo] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'') as FieldValue  FROM [LedgerMasterDetails] where CompanyID='" & GBLCompanyID & "'    " &
                   "  And Isnull(IsDeletedTransaction,0)<>1 And LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster    Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=23))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[MailingAddress],[GSTNo])) p) AS A   " &
                   "  Where A.CompanyID='" & GBLCompanyID & "' ) AS LM ON LM.LedgerID=ITM.LedgerID AND   LM.CompanyID=ITM.CompanyID  " &
                   "  INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID   " &
                   "  LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID  " &
                   "  Where ITM.VoucherID=-14 AND   ITM.CompanyID='" & GBLCompanyID & "' And ITM.TransactionID='" & TransactionID & "' And isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsVoucherItemApproved,0)<>0 AND   Isnull(ITD.QCApprovalNo,'')<>'' Order By  TransId, ItemId "
            End If

            Dim dsCustomers5 As DataTable = getDataReceiptGRN(Str)

            ReportViewer1.Reset()
            'path
            If PrintType = "Other" Then
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/Report_GRN_FileOther.rdlc")
            Else
                ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/Report_GRN_File.rdlc")
            End If

            'dataSource
            Dim ds5 As ReportDataSource = New ReportDataSource("DataSet5", dsCustomers5)

            ReportViewer1.LocalReport.DataSources.Add(ds5)

            ReportViewer1.LocalReport.Refresh()
        End If
    End Sub

    Private Function getDataReceiptGRN(query As String) As DataTable
        Dim dt As New DataTable()
        Dim dss As New DataSet()
        Try
            Dim con As New SqlConnection
            con = db.OpenDataBase()

            Dim cmd As SqlCommand = New SqlCommand(query, con)
            Dim adapter As New SqlDataAdapter(cmd)

            adapter.Fill(dt)
            con.Close()
            Return dt

        Catch ex As Exception
            Return dt
        End Try
    End Function
End Class
