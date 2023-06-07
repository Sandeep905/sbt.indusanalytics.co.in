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
Public Class WebServicePurchaseOrderApproval
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBL_User_ID As String
    Dim GBLCompanyID As String
    Dim GBL_F_Year As String

    '-----------------------------------Get UnApproved Purchase Order's List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UnApprovedPurchaseOrders() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "SELECT ITM.TransactionID, ITM.VoucherID, ITM.LedgerID, ITD.TransID, ITD.ItemID, ITD.ItemGroupID,(SELECT COUNT(TransactionDetailID) FROM ItemTransactionDetail WHERE (TransactionID = ITM.TransactionID) AND (CompanyID = ITM.CompanyID) AND (IsDeletedTransaction = 0)) AS TotalItems, LM.LedgerName, ITM.MaxVoucherNo, ITM.VoucherNo, REPLACE(CONVERT(Varchar(13), ITM.VoucherDate, 106), ' ', '-') AS VoucherDate, IM.ItemCode, IM.ItemName, ITD.PurchaseOrderQuantity, ITD.PurchaseUnit, ITD.PurchaseRate, ITD.GrossAmount, ITD.DiscountAmount, ITD.BasicAmount, ITD.GSTPercentage, ITD.CGSTAmount + ITD.SGSTAmount + ITD.IGSTAmount AS GSTTaxAmount, ITD.NetAmount, ITD.RefJobCardContentNo, UA.UserName AS CreatedBy, UM.UserName AS ApprovedBy, ITD.FYear, 0 AS ReceiptTransactionID, ITM.PurchaseDivision, ITM.CurrencyCode, ITD.AuditApprovedBy, ITM.DealerID, ITM.PurchaseReferenceRemark, ITM.ModeOfTransport, ITM.DeliveryAddress, ITM.TermsOfDelivery, ITM.TermsOfPayment, ITD.TaxableAmount, ITM.TotalTaxAmount, ITD.BasicAmount AS AfterDisAmt, ITM.Narration " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID " &
              " Where ITM.VoucherID= -11 AND ITM.CompanyID=" & GBLCompanyID & " AND ITD.IsDeletedTransaction=0 AND ITD.IsVoucherItemApproved =0 AND ITD.IsCancelled =0 Order By ITM.TransactionID Desc "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Approved Purchase Order's List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ApprovedPurchaseOrders() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select ITM.TransactionID,ITM.VoucherID,ITM.LedgerID,ITD.TransID,ITD.ItemID,ITD.ItemGroupID,(Select Count(TransactionDetailID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID AND IsDeletedTransaction=0) AS TotalItems,LM.LedgerName,ITM.MaxVoucherNo,ITM.VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,IM.ItemCode,IM.ItemName, " &
              " ITD.PurchaseOrderQuantity,ITD.PurchaseUnit,ITD.PurchaseRate,ITD.GrossAmount,ITD.DiscountAmount,ITD.BasicAmount,ITD.GSTPercentage,(Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,ITD.NetAmount,ITD.RefJobCardContentNo,UA.UserName AS CreatedBy,UM.UserName AS ApprovedBy,Replace(Convert(Varchar(13),ITD.VoucherItemApprovedDate,106),' ','-') AS ApprovalDate,ITD.FYear,Isnull((Select Top 1 TransactionID From ItemTransactionDetail Where PurchaseTransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID And IsDeletedTransaction=0),0) AS ReceiptTransactionID,PurchaseDivision,ITM.CurrencyCode,AuditApprovedBy,DealerID,PurchaseReferenceRemark,ModeOfTransport,DeliveryAddress,TermsOfDelivery,ITM.TermsOfPayment,TaxableAmount,ITM.NetAmount,TotalTaxAmount,ITD.BasicAmount As AfterDisAmt,Narration " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID " &
              " Where ITM.VoucherID= -11 And ITM.CompanyID=" & GBLCompanyID & " And ITD.IsDeletedTransaction = 0 And ITD.IsVoucherItemApproved = 1 Order By ITM.TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Approved Purchase Order's List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CancelledPurchaseOrders() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        str = "Select ITM.TransactionID,ITM.VoucherID,ITM.LedgerID,ITD.TransID,ITD.ItemID,ITD.ItemGroupID,(Select Count(TransactionDetailID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID AND Isnull(IsDeletedTransaction,0)=0) AS TotalItems,LM.LedgerName,ITM.MaxVoucherNo,ITM.VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(Isnull(IM.ItemName,''),'') AS ItemName, " &
              " ITD.PurchaseOrderQuantity,ITD.PurchaseUnit,ITD.PurchaseRate,ITD.GrossAmount,ITD.DiscountAmount,ITD.BasicAmount,ITD.GSTPercentage,(Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,ITD.NetAmount,ITD.RefJobCardContentNo,UA.UserName AS CreatedBy,UM.UserName AS ApprovedBy,Replace(Convert(Varchar(13),ITD.VoucherItemApprovedDate,106),' ','-') AS ApprovalDate,ITD.FYear,Isnull((Select Top 1 TransactionID From ItemTransactionDetail Where PurchaseTransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID And IsDeletedTransaction=0),0) AS ReceiptTransactionID,PurchaseDivision,ITM.CurrencyCode,AuditApprovedBy,DealerID,PurchaseReferenceRemark,ModeOfTransport,DeliveryAddress,TermsOfDelivery,ITM.TermsOfPayment,TaxableAmount,ITM.NetAmount,TotalTaxAmount,ITD.BasicAmount As AfterDisAmt,Narration " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID " &
              " Where ITM.VoucherID= -11 And ITM.CompanyID=" & GBLCompanyID & " And ITD.IsDeletedTransaction=0 And ITD.IsVoucherItemApproved=0 And ITD.IsCancelled=1 Order By ITM.TransactionID Desc "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open PickListStatus  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateData(ByVal BtnText As String, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBL_User_ID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBL_F_Year = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "ItemTransactionDetail"
            If db.CheckAuthories("PurchaseOrderApproval.aspx", GBL_User_ID, GBLCompanyID, "CanSave", "For " & BtnText) = False Then Return "You are not authorized"

            If BtnText = "Approve" Then
                AddColName = "ModifiedDate='" & DateTime.Now & "',ModifiedBy=" & GBL_User_ID & ",IsVoucherItemApproved=1,VoucherItemApprovedBy=" & GBL_User_ID & ",VoucherItemApprovedDate='" & DateTime.Now & "',IsCancelled=0"
            ElseIf BtnText = "UnApprove" Then
                AddColName = "ModifiedDate='" & DateTime.Now & "',ModifiedBy=" & GBL_User_ID & ",IsVoucherItemApproved=0,VoucherItemApprovedBy=" & GBL_User_ID & ",VoucherItemApprovedDate='" & DateTime.Now & "',IsCancelled=0"
            ElseIf BtnText = "Cancel" Then
                AddColName = "ModifiedDate='" & DateTime.Now & "',ModifiedBy=" & GBL_User_ID & ",IsCancelled=1,CancelledBy=" & GBL_User_ID & ",CancelledDate='" & DateTime.Now & "',IsVoucherItemApproved=0"
            ElseIf BtnText = "UnCancel" Then
                AddColName = "ModifiedDate='" & DateTime.Now & "',ModifiedBy=" & GBL_User_ID & ",IsCancelled=0,CancelledBy=" & GBL_User_ID & ",CancelledDate='" & DateTime.Now & "',IsVoucherItemApproved=0"
            End If

            wherecndtn = "CompanyID=" & GBLCompanyID & " "
            db.UpdateDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, 1, wherecndtn)

            KeyField = "Success"

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