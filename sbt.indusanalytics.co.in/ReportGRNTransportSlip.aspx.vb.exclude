Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection

Partial Class ReportGRNTransportSlip
    Inherits System.Web.UI.Page
    Dim db As New DBConnection
    'Dim GBLCompanyID As String = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

    Dim GBLCompanyID, TransactionID As String

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))
        If Not IsPostBack Then

            Dim dsCustomers As DataTable = getDataItemTransfer("Select  CM.CompanyName,LM.GSTNo, CM.GSTIN, LM.MailingAddress As SuppAddress, ITM.TransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,LM.LedgerName, ITMP.VoucherNo as PONo ,ITM.VoucherNo AS ReceiptVoucherNo,ITM.VoucherDate AS ReceiptVoucherDate, ITMP.VoucherNo AS PurchaseVoucherNo,ITMP.VoucherDate AS PurchaseVoucherDate, ITM.DeliveryNoteNo AS DeliveryNoteNo,ITM.DeliveryNoteDate AS DeliveryNoteDate,ITM.GateEntryNo,ITM.GateEntryDate AS GateEntryDate, ITM.LRNoVehicleNo,ITM.Transporter, EM.LedgerName AS ReceiverName, ITM.Narration,UM.UserName AS CreatedBy,ITD.ItemID,IM.ItemGroupID,IM.ItemCode,IM.ItemName AS ItemDescription," &
                   "  ITD.ChallanQuantity,Case When Upper(ITMPD.PurchaseUnit)='KG' And IGM.ItemGroupNameID=-1 Then ITD.ChallanQuantity*ITD.ReceiptWtPerPacking Else ITD.ChallanQuantity End As ChallanWeight, ITD.ApprovedQuantity,ITD.RejectedQuantity,ITD.QCApprovalNO,ITD.QCApprovedNarration, ITD.BatchNo,ITD.StockUnit, WM.WarehouseBinName AS Warehouse,ITMPD.PurchaseOrderQuantity, ITD.TransID " &
                   "  From ItemTransactionMain AS ITM    " &
                   "  INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID   " &
                   "  INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID  " &
                   "  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                   "  INNER JOIN CompanyMaster as CM on CM.CompanyID= ITM.CompanyID  " &
                   "  INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITD.PurchaseTransactionID And ITMPD.ItemID=ITD.ItemID AND ITMPD.CompanyID=ITD.CompanyID    " &
                   "  INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID  " &
                   "  INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[State],A.[MailingAddress],[GSTNo]   " &
                   "  From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[State],[MailingAddress],[GSTNo] FROM (SELECT [LedgerID],[LedgerGroupID], [CompanyID],[FieldName],nullif([FieldValue],'') as FieldValue  FROM [LedgerMasterDetails] where CompanyID='" & GBLCompanyID & "'   " &
                   "  And Isnull(IsDeletedTransaction,0)<>1 And LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster    Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=23))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for    FieldName in ([LedgerName],[State],[MailingAddress],[GSTNo])) p) AS A   " &
                   "  Where A.CompanyID='" & GBLCompanyID & "' ) AS LM ON LM.LedgerID=ITM.LedgerID AND   LM.CompanyID=ITM.CompanyID  " &
                   "  INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID   " &
                   "  LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID  " &
                   "  Where ITM.VoucherID=-14 AND   ITM.CompanyID='" & GBLCompanyID & "' and ITM.TransactionID='" & TransactionID & "' And isnull(ITM.IsDeletedTransaction,0)<>1 Order By TransID, ItemID")
            ReportViewer1.Reset()
            'path
            '  ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ReportPurchaseOrder.rdlc")
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/GRNTransport.rdlc")

            'dataSource
            Dim ds1 As ReportDataSource = New ReportDataSource("GRNTransport", dsCustomers)
            ReportViewer1.LocalReport.DataSources.Add(ds1)
            'Add SubReport
            ' AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ContentDetailSubreportProcessing
            'refresh
            'ReportViewer1.LocalReport.Refresh()
        End If
    End Sub

    Private Function getDataItemTransfer(query As String) As DataTable
        Dim dss As DataSet = New DataSet()
        Dim con As New SqlConnection
        con = db.OpenDataBase()
        Dim sql As String = ""
        Dim dt As DataTable = New DataTable()
        sql = query

        Dim cmd As SqlCommand = New SqlCommand(sql, con)
        Dim adapter As New SqlDataAdapter(cmd)
        adapter.Fill(dt)
        con.Close()
        Return dt
    End Function
End Class