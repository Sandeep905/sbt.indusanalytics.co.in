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
Public Class WebServiceItemPurchaseOrderClose
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
    Dim User_Name As String

    '-----------------------------------Get UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function OpenPurchaseOrders() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        'str = "Select Distinct Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS PurchaseVoucherID,Isnull(ITD.TransID,0) AS PurchaseItemTransID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(ITM.LedgerID,0) AS LedgerID, " &
        '      " NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(LM.LedgerName,'') AS LedgerName,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(IM.ItemCode,'') AS ItemCode, " &
        '      " NullIf(Isnull(IM.ItemName,''),'') AS ItemName,Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,Isnull((Select ROUND(Sum(Isnull(ChallanQuantity,0)),3) From ItemTransactionDetail Where Isnull(IsDeletedTransaction,0)<>1 AND PurchaseTransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0) AS ReceiptQty, " &
        '      " ROUND((Isnull(ITD.PurchaseOrderQuantity,0)-Isnull((Select Case When IGM.ItemGroupNameID=-1 And (Upper(ITD.PurchaseUnit)='KG' OR Upper(ITD.PurchaseUnit)='KGS') And (Upper(ITD.StockUnit)='SHEET' OR Upper(ITD.StockUnit)='SHEETS') Then Round(SUM(ChallanQuantity*ReceiptWtPerPacking),3) Else SUM(ChallanQuantity) End AS Expr1 From ItemTransactionDetail Where Isnull(IsDeletedTransaction,0)<>1 AND PurchaseTransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0)),3) AS PendingQuantity,Nullif(ITD.PurchaseUnit,'') AS PurchaseUnit, " &
        '      " /*NullIf(IR.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IR.VoucherDate,106),' ','-') AS GRNDate,Isnull(IR.ReceiptQuantity,0) AS ReceiptQuantity,Nullif(IR.BatchNo,'') AS BatchNo,Nullif(IR.StockUnit,'') AS StockUnit,*/Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReferenceRemark, " &
        '      " Nullif(ITM.Narration,'') AS Narration,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(Isnull(ITM.FYear,''),'') AS FYear,/*Nullif(Replace(Isnull(UOM.ConversionFormula,''),'Quantity','ReceiptQty'),'') AS ConversionFormula ,*/Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor/*,Isnull(UOM.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace*/ " &
        '      " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID " &
        '      " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID /*LEFT JOIN (Select IRM.CompanyID,IRM.VoucherNo,IRM.VoucherDate,IRD.PurchaseTransactionID,IRD.ItemID,IRD.ChallanQuantity AS ReceiptQuantity,IRD.BatchNo,IRD.ApprovedQuantity,IRD.QCApprovalNo,IRD.StockUnit " &
        '      " From ItemTransactionMain AS IRM INNER JOIN ItemTransactionDetail AS IRD ON IRM.TransactionID=IRD.TransactionID AND IRM.CompanyID=IRD.CompanyID AND IRM.TransactionID=IRD.ParentTransactionID Where IRM.VoucherID=-14 AND IRM.CompanyID=" & GBLCompanyID & " ) AS IR ON IR.PurchaseTransactionID=ITM.TransactionID AND IR.ItemID=ITD.ItemID AND IR.CompanyID=ITD.CompanyID LEFT JOIN ConversionMaster AS UOM ON UOM.BaseUnitSymbol=isnull(IR.StockUnit,'') AND UOM.ConvertedUnitSymbol=ITD.PurchaseUnit AND UOM.CompanyID=ITD.CompanyID */" &
        '      " Where ITM.VoucherID= -11 AND ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsCancelled,0)<>1  AND Isnull(ITD.IsCompleted,0)=0 Order By FYear,PurchaseItemTransID "
        str = " Select Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemDescription,''),'') AS ItemDescription, Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.PurchaseRate,0) AS PurchaseRate,Isnull(ITD.GrossAmount,0) AS GrossAmount,Isnull(ITD.DiscountAmount,0) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS BasicAmount,Isnull(ITD.GSTPercentage,0) AS GSTPercentage, " &
                " (Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,Isnull(ITD.NetAmount,0) AS NetAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,Isnull((Select Top 1 TransactionID From ItemTransactionDetail Where PurchaseTransactionID=ITM.TransactionID AND CompanyID=ITD.CompanyID AND Isnull(IsDeletedTransaction,0)<>1 AND Isnull(PurchaseTransactionID,0)>0),0) AS ReceiptTransactionID,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,Nullif('','') AS ReworkRemark,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS RefJobBookingJobCardContentsID,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,(Select ROUND(Sum(Isnull(RequisitionProcessQuantity,0)),2) From ItemPurchaseRequisitionDetail Where TransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID) AS RequiredQuantity,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, " &
                " Isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID,Isnull(ITD.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(ITD.IsCancelled,0) AS VoucherCancelled,Isnull(NullIf(ITM.CurrencyCode,''),'INR') AS CurrencyCode,Isnull(ITM.VoucherApprovalByEmployeeID,0) AS VoucherApprovalByEmployeeID,ISNULL(ITD.PurchaseOrderQuantity, 0)-ISNULL((SELECT Case When IGM.ItemGroupNameID=-1 And (Upper(ITD.PurchaseUnit)='KG' OR Upper(ITD.PurchaseUnit)='KGS') And (Upper(ITD.StockUnit)='SHEET' OR Upper(ITD.StockUnit)='SHEETS') Then Round(SUM(ChallanQuantity*ReceiptWtPerPacking),3) Else SUM(ChallanQuantity) End AS Expr1 FROM ItemTransactionDetail WHERE (PurchaseTransactionID = ITM.TransactionID) AND (CompanyID = ITD.CompanyID) AND (ISNULL(IsDeletedTransaction, 0) <> 1) And (ItemID=ITD.ItemID) AND (ISNULL(PurchaseTransactionID, 0) > 0)), 0) AS PendingToReceiveQty  " &
                " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID  INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID  INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID  " &
                " Where ITM.VoucherID= -11 And ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsCompleted,0)=0 AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By FYear,MaxVoucherNo Desc,TransID "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ClosedPurchaseOrders() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        'str = "Select Distinct Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS PurchaseVoucherID,Isnull(ITD.TransID,0) AS PurchaseItemTransID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(ITM.LedgerID,0) AS LedgerID, " &
        '      " NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(LM.LedgerName,'') AS LedgerName,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(IM.ItemCode,'') AS ItemCode, " &
        '      " NullIf(Isnull(IM.ItemName,''),'') AS ItemName,Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,Isnull((Select ROUND(Sum(Isnull(ChallanQuantity,0)),3) From ItemTransactionDetail Where Isnull(IsDeletedTransaction,0)<>1 AND PurchaseTransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0) AS ReceiptQty, " &
        '      " ROUND((Isnull(ITD.PurchaseOrderQuantity,0)-Isnull((Select ROUND(Sum(Isnull(ChallanQuantity,0)),3) From ItemTransactionDetail Where Isnull(IsDeletedTransaction,0)<>1 AND PurchaseTransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0)),3) AS PendingQuantity,Nullif(ITD.PurchaseUnit,'') AS PurchaseUnit, " &
        '      " /*NullIf(IR.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IR.VoucherDate,106),' ','-') AS GRNDate,Isnull(IR.ReceiptQuantity,0) AS ReceiptQuantity,Nullif(IR.BatchNo,'') AS BatchNo,Nullif(IR.StockUnit,'') AS StockUnit,*/Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReferenceRemark, " &
        '      " Nullif(ITM.Narration,'') AS Narration,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(Isnull(ITM.FYear,''),'') AS FYear /*,Nullif(Replace(Isnull(UOM.ConversionFormula,''),'Quantity','ReceiptQty'),'') AS ConversionFormula */,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor/*,Isnull(UOM.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace*/ " &
        '      " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID " &
        '      " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID /*LEFT JOIN (Select IRM.CompanyID,IRM.VoucherNo,IRM.VoucherDate,IRD.PurchaseTransactionID,IRD.ItemID,IRD.ChallanQuantity AS ReceiptQuantity,IRD.BatchNo,IRD.ApprovedQuantity,IRD.QCApprovalNo,IRD.StockUnit " &
        '      " From ItemTransactionMain AS IRM INNER JOIN ItemTransactionDetail AS IRD ON IRM.TransactionID=IRD.TransactionID AND IRM.CompanyID=IRD.CompanyID AND IRM.TransactionID=IRD.ParentTransactionID Where IRM.VoucherID=-14 AND IRM.CompanyID=" & GBLCompanyID & " ) AS IR ON IR.PurchaseTransactionID=ITM.TransactionID AND IR.ItemID=ITD.ItemID AND IR.CompanyID=ITD.CompanyID LEFT JOIN ConversionMaster AS UOM ON UOM.BaseUnitSymbol=isnull(IR.StockUnit,'') AND UOM.ConvertedUnitSymbol=ITD.PurchaseUnit AND UOM.CompanyID=ITD.CompanyID*/ " &
        '      " Where ITM.VoucherID= -11 AND ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsCancelled,0)<>1  AND Isnull(ITD.IsCompleted,0)=1 Order By FYear,PurchaseItemTransID "
        str = " Select Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemDescription,''),'') AS ItemDescription, Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.PurchaseRate,0) AS PurchaseRate,Isnull(ITD.GrossAmount,0) AS GrossAmount,Isnull(ITD.DiscountAmount,0) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS BasicAmount,Isnull(ITD.GSTPercentage,0) AS GSTPercentage, " &
                " (Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,Isnull(ITD.NetAmount,0) AS NetAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,Isnull((Select Top 1 TransactionID From ItemTransactionDetail Where PurchaseTransactionID=ITM.TransactionID AND CompanyID=ITD.CompanyID AND Isnull(IsDeletedTransaction,0)<>1 AND Isnull(PurchaseTransactionID,0)>0),0) AS ReceiptTransactionID,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,Nullif('','') AS ReworkRemark,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS RefJobBookingJobCardContentsID,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,(Select ROUND(Sum(Isnull(RequisitionProcessQuantity,0)),2) From ItemPurchaseRequisitionDetail Where TransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID) AS RequiredQuantity,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, " &
                " Isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID,Isnull(ITD.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(ITD.IsCancelled,0) AS VoucherCancelled,Isnull(NullIf(ITM.CurrencyCode,''),'INR') AS CurrencyCode,Isnull(ITM.VoucherApprovalByEmployeeID,0) AS VoucherApprovalByEmployeeID,ISNULL(ITD.PurchaseOrderQuantity, 0)-ISNULL((SELECT Case When IGM.ItemGroupNameID=-1 And (Upper(ITD.PurchaseUnit)='KG' OR Upper(ITD.PurchaseUnit)='KGS') And (Upper(ITD.StockUnit)='SHEET' OR Upper(ITD.StockUnit)='SHEETS') Then Round(SUM(ChallanQuantity*ReceiptWtPerPacking),3) Else SUM(ChallanQuantity) End AS Expr1 FROM ItemTransactionDetail WHERE (PurchaseTransactionID = ITM.TransactionID) AND (CompanyID = ITD.CompanyID) AND (ISNULL(IsDeletedTransaction, 0) <> 1) And (ItemID=ITD.ItemID) AND (ISNULL(PurchaseTransactionID, 0) > 0)), 0) AS PendingToReceiveQty  " &
                " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID  INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID  INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID  " &
                " Where ITM.VoucherID= -11 And ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsCompleted,0)=1 AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By FYear,MaxVoucherNo Desc,TransID "

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

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "ItemTransactionDetail"
            If BtnText = "Close Purchase Order" Then
                AddColName = "CompletedDate='" & DateTime.Now & "',CompletedBy=" & GBLUserID & ",IsCompleted=1,IsCancelled=0"
            ElseIf BtnText = "Open Purchase Order" Then
                AddColName = "CompletedDate='" & DateTime.Now & "',CompletedBy=" & GBLUserID & ",IsCompleted=0,IsCancelled=1"
            End If

            wherecndtn = "CompanyID=" & GBLCompanyID & " "
            db.UpdateDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, 2, wherecndtn)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class