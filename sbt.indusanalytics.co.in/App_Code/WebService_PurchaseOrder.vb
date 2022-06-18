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
Public Class WebService_PurchaseOrder
    Inherits System.Web.Services.WebService

    ReadOnly db As New DBConnection
    ReadOnly js As New JavaScriptSerializer()
    ReadOnly data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String

    <System.Web.Services.WebMethod(EnableSession:=True)>
    <ScriptMethod(UseHttpGet:=True, ResponseFormat:=ResponseFormat.Json)>
    Public Sub HelloWorld()
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
    End Sub

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


    Public Function DataSetToJSONWithJavaScriptSerializer(ByVal dataset As DataSet) As String
        Dim jsSerializer As JavaScriptSerializer = New JavaScriptSerializer()
        Dim ssvalue As Dictionary(Of String, Object) = New Dictionary(Of String, Object)()

        For Each table As DataTable In dataset.Tables
            Dim parentRow As List(Of Dictionary(Of String, Object)) = New List(Of Dictionary(Of String, Object))()
            Dim childRow As Dictionary(Of String, Object)
            Dim tablename As String = table.TableName

            For Each row As DataRow In table.Rows
                childRow = New Dictionary(Of String, Object)()

                For Each col As DataColumn In table.Columns
                    childRow.Add(col.ColumnName, row(col))
                Next

                parentRow.Add(childRow)
            Next

            ssvalue.Add(tablename, parentRow)
        Next

        Return jsSerializer.Serialize(ssvalue)
    End Function


    '---------------Open Master code---------------------------------
    '-----------------------------------Get Pending Requisition List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillGrid(ByVal RadioValue As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If RadioValue = "Pending Requisitions" Then
            str = ""
            str = " Select Distinct ITM.TransactionID,ITD.TransID,ITM.VoucherID,ITD.ItemID, IM.ItemGroupID ,IM.ItemSubGroupID,IGM.ItemGroupNameID,Isnull(ITM.MaxVoucherNo,0) As MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,    Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS RefJobBookingJobCardContentsID,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS OrderUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,     " &
                " NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,  (Isnull(ITD.RequiredQuantity, 0) - Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And RequisitionTransactionID = ITD.TransactionID And ItemID = ITD.ItemID And CompanyID = ITD.CompanyID),0)) As PurchaseQuantityComp,(Isnull(ITD.RequiredQuantity, 0) - Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And RequisitionTransactionID = ITD.TransactionID And ItemID = ITD.ItemID And CompanyID = ITD.CompanyID),0)) As PurchaseQuantity,Isnull(Nullif(IM.PurchaseRate,''),0) as PurchaseRate,  nullif(IM.PurchaseUnit,'') as PurchaseUnit, nullif(PHM.ProductHSNName,'') as ProductHSNName,  " &
                " replace(convert(nvarchar(30),ITD.ExpectedDeliveryDate,106),'','-') AS ExpectedDeliveryDate,nullif(PHM.HSNCode,'') as HSNCode, isnull(PHM.GSTTaxPercentage,0) as GSTTaxPercentage, isnull(PHM.CGSTTaxPercentage,0) as CGSTTaxPercentage, isnull(PHM.SGSTTaxPercentage,0) as SGSTTaxPercentage, isnull(PHM.IGSTTaxPercentage ,0) as IGSTTaxPercentage  ,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(Nullif(IM.SizeW,''),0) AS SizeW,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Nullif(C.ConversionFormula,'') AS  ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace,Nullif(CU.ConversionFormula,'') AS  ConversionFormulaStockUnit,Isnull(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit,NullIf(IM.StockUnit,'') AS StockUnit,NullIf(IM.PurchaseUnit,'') AS PurchaseUnit   " &
                " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy And UA.CompanyID=ITM.CompanyID " &
                " LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID =IM.ProductHSNID And PHM.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=IM.StockUnit AND C.ConvertedUnitSymbol=IM.PurchaseUnit And C.CompanyID=IM.CompanyID  LEFT JOIN ConversionMaster As CU ON CU.BaseUnitSymbol=IM.PurchaseUnit AND CU.ConvertedUnitSymbol=IM.StockUnit And CU.CompanyID=IM.CompanyID  " &
                " Where Isnull(ITM.VoucherID, 0) = -9 And ITM.CompanyID = " & GBLCompanyID & " AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsVoucherItemApproved,0)=1 And (Isnull(ITD.RequiredQuantity, 0) > Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0)=0 And RequisitionTransactionID=ITD.TransactionID And ItemID=ITD.ItemID And CompanyID=ITD.CompanyID),0)) " &
                " Order By FYear Desc,MaxVoucherNo Desc,TransID "
        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Requisition List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProcessFillGrid(ByVal FDate As String, ByVal ToDate As String, ByVal chk As String, ByVal Detail As String, ByVal FilterStr As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim dateString As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If Detail = "True" Then
            If chk = "True" Then
                'dateString = " AND  Cast(Floor(Cast(ITM.VoucherDate as Float)) as DateTime) >= ('" & FDate & "') AND Cast(Floor(Cast(ITM.VoucherDate as Float)) as DateTime) <= ('" & ToDate & "') "
            Else
                dateString = ""
            End If
            str = ""
            str = " Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemDescription,''),'') AS ItemDescription, Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.PurchaseRate,0) AS PurchaseRate,Isnull(ITD.GrossAmount,0) AS GrossAmount,Isnull(ITD.DiscountAmount,0) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS BasicAmount,Isnull(ITD.GSTPercentage,0) AS GSTPercentage, " &
                " (Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,Isnull(ITD.NetAmount,0) AS NetAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,Isnull((Select Top 1 TransactionID From ItemTransactionDetail Where PurchaseTransactionID=ITM.TransactionID AND CompanyID=ITD.CompanyID AND Isnull(IsDeletedTransaction,0)<>1 AND Isnull(PurchaseTransactionID,0)>0),0) AS ReceiptTransactionID,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,Nullif('','') AS ReworkRemark,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS RefJobBookingJobCardContentsID,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,(Select ROUND(Sum(Isnull(RequisitionProcessQuantity,0)),2) From ItemPurchaseRequisitionDetail Where TransactionID=ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID) AS RequiredQuantity,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, " &
                " Isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID,Isnull(ITD.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(ITD.IsCancelled,0) AS VoucherCancelled,Isnull(NullIf(ITM.CurrencyCode,''),'INR') AS CurrencyCode,Isnull(ITM.VoucherApprovalByEmployeeID,0) AS VoucherApprovalByEmployeeID,ISNULL(ITD.PurchaseOrderQuantity, 0)-ISNULL((SELECT Case When IGM.ItemGroupNameID=-1 And (Upper(ITD.PurchaseUnit)='KG' OR Upper(ITD.PurchaseUnit)='KGS') And (Upper(ITD.StockUnit)='SHEET' OR Upper(ITD.StockUnit)='SHEETS') Then Round(SUM(ChallanQuantity*ReceiptWtPerPacking),3) Else SUM(ChallanQuantity) End AS Expr1 FROM ItemTransactionDetail WHERE (PurchaseTransactionID = ITM.TransactionID) AND (CompanyID = ITD.CompanyID) AND (ISNULL(IsDeletedTransaction, 0) <> 1) And (ItemID=ITD.ItemID) AND (ISNULL(PurchaseTransactionID, 0) > 0)), 0) AS PendingToReceiveQty  " &
                " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID  INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID  INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID  " &
                " Where ITM.VoucherID= -11 And ITM.CompanyID=" & GBLCompanyID & "  " & FilterStr & " AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By FYear,MaxVoucherNo Desc,TransID "
        Else
            If chk = "True" Then
                'dateString = " AND  Cast(Floor(Cast(ITM.VoucherDate as Float)) as DateTime) >= ('" & FDate & "') AND Cast(Floor(Cast(ITM.VoucherDate as Float)) as DateTime) <= ('" & ToDate & "') "
            Else
                dateString = ""
            End If

            str = ""
            str = " Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,0 AS TransID,0 AS ItemID, 0 As ItemGroupID,0 As ItemSubGroupID,0 AS ItemGroupNameID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,NullIf('','') AS ItemCode,NullIf('','') AS ItemGroupName,NullIf('','') AS ItemSubGroupName,NullIf('','') AS ItemName,NullIf('','') AS ItemDescription, ROUND(SUM(Isnull(ITD.PurchaseOrderQuantity, 0)), 2) As PurchaseQuantity,Nullif('','') AS PurchaseUnit,0 AS PurchaseRate,ROUND(SUM(Isnull(ITD.GrossAmount,0)),2) AS GrossAmount, 0 AS DiscountAmount,ROUND(SUM(Isnull(ITD.BasicAmount,0)),2) AS BasicAmount,0 AS GSTPercentage,ROUND((SUM(Isnull(ITD.CGSTAmount,0))+SUM(Isnull(ITD.SGSTAmount,0))+SUM(Isnull(ITD.IGSTAmount,0))),2) AS GSTTaxAmount, " &
                " ROUND(SUM(Isnull(ITD.NetAmount,0)),2) AS NetAmount, NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITM.FYear,'') AS FYear,0 AS ReceiptTransactionID,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 As IsReworked, Nullif('','') AS ReworkRemark,Nullif('','') AS RefJobBookingJobCardContentsID,Nullif('','') AS RefJobCardContentNo,Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision ,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,0 AS RequiredQuantity,Nullif('','') AS ExpectedDeliveryDate,isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,ROUND(SUM(Isnull(ITD.TaxableAmount,0)),2) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID,Isnull(ITD.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(ITD.IsCancelled,0) AS VoucherCancelled,Isnull(NullIf(ITM.CurrencyCode,''),'INR') AS CurrencyCode,Isnull(ITM.VoucherApprovalByEmployeeID,0) AS VoucherApprovalByEmployeeID   " &
                " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy And UA.CompanyID=ITM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy And UA.CompanyID=ITM.CompanyID  " &
                " Where ITM.VoucherID = -11 And ITM.CompanyID =" & GBLCompanyID & " " & FilterStr & " AND Isnull(ITD.IsDeletedTransaction,0)<>1  GROUP BY Isnull(ITM.TransactionID, 0),Isnull(ITM.VoucherID,0),Isnull(ITM.LedgerID,0), NullIf(LM.LedgerName,''),Isnull(ITM.MaxVoucherNo,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'), NullIf(Isnull(UA.UserName,''),''),NullIf(Isnull(UM.UserName,''),''),NullIf(ITM.FYear,''),Isnull(ITD.IsVoucherItemApproved,0),Nullif(ITM.PurchaseReferenceRemark,''),Nullif(ITM.Narration,''),Nullif(ITM.PurchaseDivision,''),Nullif(ITM.ContactPersonID,''),Isnull(ITM.TotalTaxAmount,0),Isnull(ITM.TotalOverheadAmount,0),Nullif(ITM.DeliveryAddress,''),Isnull(ITM.TotalQuantity,''),nullif(ITM.TermsOfPayment,''),nullif(ITM.ModeOfTransport ,''),nullif(ITM.DealerID,''),Isnull(ITD.IsCancelled,0),Isnull(NullIf(ITM.CurrencyCode,''),'INR')  ,isnull(ITM.VoucherApprovalByEmployeeID,0)   Order By NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0) Desc "
        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Retrive List Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePoCreateGrid(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = " Select Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS PurchaseVoucherID,Isnull(IPR.RequisitionTransactionID,0) AS TransactionID,Isnull(IR.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.ItemID,0) AS ItemID,  Isnull(ITD.ItemGroupID,0) As ItemGroupID, NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS PurchaseMaxVoucherNo,Isnull(IR.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS PurchaseVoucherNo,NullIf(IR.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseVoucherDate,Replace(Convert(Varchar(13),IR.VoucherDate,106),' ','-') AS VoucherDate, NullIf(IM.ItemCode,'') AS ItemCode, NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName, " &
             " NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemDescription,''),'') AS ItemDescription, Isnull(IPR.RequisitionProcessQuantity,0) AS RequiredQuantity, Isnull(IRD.RequiredQuantity,0) AS RequisitionQty,Isnull(IRD.StockUnit,0) AS StockUnit, Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,  Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit,Isnull(ITD.PurchaseRate,0) AS PurchaseRate, Isnull(ITD.GrossAmount,0) AS BasicAmount,Isnull(ITD.DiscountPercentage,0) AS Disc,Isnull(ITD.DiscountAmount,0) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS AfterDisAmt,Isnull(ITD.PurchaseTolerance,0) AS Tolerance, Isnull(ITD.GSTPercentage,0) AS GSTTaxPercentage,(Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,Isnull(ITD.NetAmount,0) AS TotalAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy, NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,0 AS ReceiptTransactionID,  " &
             " Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,Nullif('','') AS ReworkRemark, Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,  Isnull(ITD.RequiredQuantity,0) /* (Select ROUND(Sum(Isnull(RequisitionProcessQuantity,0)),2) From ItemPurchaseRequisitionDetail Where TransactionID=ITD.TransactionID And ItemID=ITD.ItemID And CompanyID=ITD.CompanyID) */ AS TotalRequiredQuantity, Nullif(IM.StockUnit,'') AS PurchaseStockUnit,Isnull(ITD.CGSTPercentage,0) as CGSTTaxPercentage,Isnull(ITD.SGSTPercentage,0) as SGSTTaxPercentage,Isnull(ITD.IGSTPercentage,0) as IGSTTaxPercentage , Isnull(ITD.CGSTAmount,0) as CGSTAmt, " &
             " Isnull(ITD.SGSTAmount,0) as SGSTAmt,Isnull(ITD.IGSTAmount,0) as IGSTAmt ,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,Nullif(PHM.ProductHSNName,'') AS ProductHSNName,Nullif(PHM.HSNCode,'') AS HSNCode,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(IM.SizeW,0) AS SizeW,Nullif(C.ConversionFormula,'') AS  ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace,Nullif(CU.ConversionFormula,'') AS  ConversionFormulaStockUnit,Isnull(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit,Nullif(ITD.RefJobCardContentNo,'') AS  PORefJobCardContentNo,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS  PORefJobBookingJobCardContentsID,Nullif(IRD.RefJobCardContentNo,'') AS  RefJobCardContentNo,Nullif(IRD.RefJobBookingJobCardContentsID,'') AS  RefJobBookingJobCardContentsID,Isnull(PHM.ProductHSNID,0) as ProductHSNID     " &
             " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=ITD.CompanyID INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  LEFT JOIN ItemPurchaseRequisitionDetail AS IPR ON IPR.TransactionID=ITD.TransactionID And IPR.ItemID=ITD.ItemID And IPR.CompanyID=ITD.CompanyID " &
             " LEFT JOIN ItemTransactionMain AS IR ON IR.TransactionID=IPR.RequisitionTransactionID And IR.CompanyID=IPR.CompanyID LEFT JOIN ItemTransactionDetail AS IRD ON IRD.TransactionID=IPR.RequisitionTransactionID And IRD.ItemID=IPR.ItemID And IRD.CompanyID=IPR.CompanyID LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=IM.StockUnit AND C.ConvertedUnitSymbol=IM.PurchaseUnit And C.CompanyID=ITD.CompanyID  LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID=IM.ProductHSNID AND PHM.CompanyID=IM.CompanyID  LEFT JOIN ConversionMaster As CU ON CU.BaseUnitSymbol=IM.PurchaseUnit AND CU.ConvertedUnitSymbol=IM.StockUnit And CU.CompanyID=IM.CompanyID  " &
             " Where ITM.VoucherID= -11 And ITM.CompanyID = " & GBLCompanyID & " and ITD.TransactionID=" & transactionID & "  AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By TransID "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Retrive Schedule Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePoSchedule(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = " select Isnull(IPDS.TransID,0) AS id,Isnull(IPDS.TransactionID,0) AS TransactionID,Isnull(IPDS.ItemID,0) AS ItemID,Nullif(IM.ItemCode,'') AS ItemCode,nullif(IPDS.Unit,'') AS PurchaseUnit, " &
                "Isnull(IPDS.Quantity, 0) As Quantity,Replace(Convert(Varchar(13),IPDS.ScheduleDeliveryDate,106),' ','-') AS SchDate " &
                "From ItemPurchaseDeliverySchedule As IPDS INNER JOIN ItemMaster As IM ON IM.ItemID=IPDS.ItemID AND IM.CompanyID=IPDS.CompanyID Where IPDS.CompanyID ='" & GBLCompanyID & "' and IPDS.TransactionID='" & transactionID & "'  AND Isnull(IPDS.IsDeletedTransaction,0)<>1"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Retrive PoOverHead Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePoOverHead(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = " select Isnull(IPOHC.TransID,0) AS TransID,Isnull(IPOHC.TransactionID,0) AS TransactionID,Isnull(IPOHC.headID,0) AS HeadID, " &
              "  Isnull(IPOHC.Quantity,0) As Weight,nullif(IPOHC.ChargesType,'') AS RateType,Isnull(IPOHC.Amount,0) AS HeadAmount,Isnull(IPOHC.Rate,0) AS Rate,nullif(IPOHC.headName,'') AS Head " &
               " from ItemPurchaseOverheadCharges as IPOHC where IPOHC.CompanyID='" & GBLCompanyID & "' and IPOHC.TransactionID='" & transactionID & "'  AND Isnull(IPOHC.IsDeletedTransaction,0)<>1 "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Retrive RequisitionDetail Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetriveRequisitionDetail(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Distinct Isnull(ITRM.TransactionID,0) AS TransactionID,Isnull(ITRD.TransID,0) AS TransID,Isnull(ITRM.VoucherID,0) AS VoucherID,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITRM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,  " &
                "Isnull(ITRM.VoucherNo,0) As VoucherNo,Replace(Convert(Varchar(13),ITRM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(IM.ItemCode,'') AS ItemCode,  " &
                "Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Isnull(IPRD.RequisitionProcessQuantity,0) AS RequiredQuantity,  " &
                "Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,Nullif(IPRD.StockUnit,'') AS StockUnit,Nullif(UM.UserName,'') AS CreatedBy,Nullif('','') AS ItemNarration,Nullif(ITD.PurchaseUnit,'') AS PurchaseUnit,0 AS GSTTaxPercentage,0 AS CGSTTaxPercentage,0 AS SGSTTaxPercentage,  " &
                "0 AS IGSTTaxPercentage,NullIf('','') AS Narration,Nullif(ITRD.FYear,'') AS FYear,Isnull(ITD.PurchaseRate,0) AS PurchaseRate,Nullif('','') AS ProductHSNName,Nullif('','') AS HSNCode   " &
                "From ItemTransactionMain AS ITM  " &
                "INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID  " &
                "INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  " &
                "LEFT JOIN ItemPurchaseRequisitionDetail AS IPRD ON IPRD.TransactionID=ITM.TransactionID AND IPRD.ItemID=ITD.ItemID AND IPRD.CompanyID=ITD.CompanyID  " &
                "LEFT JOIN ItemTransactionMain AS ITRM ON ITRM.TransactionID=IPRD.RequisitionTransactionID And ITRM.CompanyID=IPRD.CompanyID  " &
                "LEFT JOIN ItemTransactionDetail AS ITRD ON ITRD.TransactionID=IPRD.RequisitionTransactionID AND ITRD.ItemID=IPRD.ItemID AND ITRD.CompanyID=IPRD.CompanyID  " &
                "LEFT JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=ITD.ItemGroupID And IGM.CompanyID=ITD.CompanyID  " &
                "LEFT JOIN UserMaster AS UM ON UM.UserID=ITRD.CreatedBy AND UM.CompanyID=ITRD.CompanyID  " &
                "Where ITM.VoucherID=-11 AND ITM.TransactionID='" & transactionID & "' AND ITM.CompanyID='" & GBLCompanyID & "'"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------Get Process Retrive PoCreateTaxChares Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePoCreateTaxChares(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        ''New query 12-11-20
        str = "SELECT LM.LedgerID, IPOT.TransID, IPOT.TransactionID, ISNULL(LM.TaxRatePer, 0) AS TaxRatePer, ISNULL(IPOT.Amount, 0) AS ChargesAmount, ISNULL(LM.InAmount, 0) AS InAmount, ISNULL(LM.IsCumulative, 0) AS IsCumulative, ISNULL(IPOT.GSTApplicable, 0) AS GSTApplicable,IPOT.CalculatedON As CalculateON, LM.LedgerName, NULLIF (LM.TaxType, '') AS TaxType, NULLIF (LM.GSTLedgerType, '') AS GSTLedgerType " &
            "FROM ItemPurchaseOrderTaxes AS IPOT INNER JOIN LedgerMaster AS LM ON LM.LedgerID = IPOT.LedgerID AND LM.CompanyID = IPOT.CompanyID WHERE (IPOT.CompanyID = " & GBLCompanyID & ") AND (IPOT.TransactionID = " & transactionID & " ) AND (ISNULL(IPOT.IsDeletedTransaction, 0) = 0) ORDER BY IPOT.TransID"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Open ProcessPurchaseOrder Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePaperPurchaseOrder(ByVal TxtPOID As String) As String

        Dim KeyField As String
        Dim dtExist As New DataTable

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If db.CheckAuthories("PurchaseOrder.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete..!"

        str = "Select TransactionID from ItemTransactionDetail where CompanyID='" & GBLCompanyID & "' and  TransactionID='" & TxtPOID & "' and Isnull(IsvoucherItemApproved,0)=1 And isnull(IsDeletedTransaction,0)<>1"
        db.FillDataTable(dtExist, str)
        If dtExist.Rows.Count > 0 Then
            Return "This transaction is used in another process..! Record can not be delete..."
        End If

        dtExist = New DataTable()
        str = "Select TransactionID From ItemTransactionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And isnull(QCApprovalNo,'')<>'' AND TransactionID=" & TxtPOID & " And Isnull(IsDeletedTransaction,0)=0 AND (Isnull(ApprovedQuantity,0)>0 OR Isnull(RejectedQuantity,0)>0)"
        db.FillDataTable(dtExist, str)
        If dtExist.Rows.Count > 0 Then
            Return "This transaction is used in another process..! Record can not be delete..."
        End If

        Try

            str = ""
            str = "Update ItemTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseOverheadCharges Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseDeliverySchedule Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseOrderTaxes Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseRequisitionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TxtPOID & ",0")
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function



    '-----------------------------------CheckPermission------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPermission(ByVal TransactionID As String) As String
        Dim KeyField As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            Dim D1, D2 As String

            SxistStr = "Select TransactionID from ItemTransactionDetail where CompanyID='" & GBLCompanyID & "' and  TransactionID='" & TransactionID & "' and Isnull(IsvoucherItemApproved,0)=1  and isnull(IsDeletedTransaction,0)<>1"
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


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOverFlowGrid(ByVal SelSupplierName As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If SelSupplierName = "" Then
            str = "Select  A.[ItemID],A.[CompanyID],A.[ItemGroupID],Isnull(IGM.[ItemGroupNameID],0) As ItemGroupNameID,Isnull(PH.[ProductHSNID],0) As ProductHSNID,Isnull(A.[ItemSubGroupID],0) As ItemSubGroupID,Nullif(IGM.[ItemGroupName],'') as ItemGroupName,nullif(A.[ItemCode],'') AS ItemCode,nullif(ISGM.[ItemSubGroupName],'') AS ItemSubGroupName,  Nullif(A.[ItemName],'') as ItemName,Nullif(A.[ItemDescription],'') as ItemDescription, Isnull(A.[BookedStock],0) As BookedStock,Isnull(A.[AllocatedStock],0) As AllocatedStock,Isnull(A.[PhysicalStock],0) As PhysicalStock,Nullif(A.[StockUnit],'') as StockUnit,Isnull(nullif(A.[PurchaseOrderQuantity],''),0) AS PurchaseOrderQuantity,Isnull(nullif(A.[PurchaseRate],''),0) AS PurchaseRate,  " &
                    " nullif(A.[PurchaseUnit],'') AS PurchaseUnit,Nullif(PH.HSNCode,'')  AS HSNCode,Nullif(PH.ProductHSNName,'')  AS ProductHSNName,Isnull(PH.GSTTaxPercentage,0) AS GSTTaxPercentage,Isnull(PH.CGSTTaxPercentage,0) AS CGSTTaxPercentage,Isnull(PH.SGSTTaxPercentage,0) AS SGSTTaxPercentage,Isnull(PH.IGSTTaxPercentage,0) AS IGSTTaxPercentage,Isnull(A.WtPerPacking,0) as WtPerPacking,Isnull(A.UnitPerPacking,0) as UnitPerPacking,Isnull(A.ConversionFactor,0) as ConversionFactor,Nullif(C.ConversionFormula,'') AS ConversionFormula, Nullif(C.ConvertedUnitDecimalPlace,'') AS UnitDecimalPlace,Nullif(CU.ConversionFormula,'') AS  ConversionFormulaStockUnit,Isnull(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit   " &
                    " From ItemMaster As A INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=A.ItemGroupID And Isnull(A.IsDeletedTransaction,0)=0 And IGM.CompanyID=A.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=A.ItemSubGroupID  And ISGM.CompanyID=A.CompanyID   " &
                    " LEFT JOIN ProductHSNMaster As PH ON PH.ProductHSNID=A.ProductHSNID And A.CompanyID=A.CompanyID LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=A.StockUnit And C.ConvertedUnitSymbol=A.PurchaseUnit And C.CompanyID=A.CompanyID LEFT JOIN ConversionMaster As CU ON CU.BaseUnitSymbol=A.PurchaseUnit And CU.ConvertedUnitSymbol=A.StockUnit And CU.CompanyID=A.CompanyID Where A.CompanyID = " & GBLCompanyID & " Order by A.[ItemGroupID],A.[ItemName] "
        Else
            str = "Select Distinct Isnull(SGA.LedgerID,0) AS LedgerID,A.[ItemID],A.[CompanyID],A.[ItemGroupID],Isnull(PH.[ProductHSNID],0) AS ProductHSNID,Isnull(IGM.[ItemGroupNameID],0) AS ItemGroupNameID,Isnull(A.[ItemSubGroupID],0) AS ItemSubGroupID,Nullif(IGM.[ItemGroupName],'') as ItemGroupName,nullif(A.[ItemCode],'') AS ItemCode,nullif(ISGM.[ItemSubGroupName],'') AS ItemSubGroupName,Nullif(A.[ItemName],'') as ItemName,Nullif(A.[ItemDescription],'') as ItemDescription, Isnull(A.[BookedStock],0) As BookedStock,Isnull(A.[AllocatedStock],0) As AllocatedStock,Isnull(A.[PhysicalStock],0) As PhysicalStock,Nullif(A.[StockUnit],'') as StockUnit,Isnull(nullif(A.[PurchaseOrderQuantity],''),0) AS PurchaseOrderQuantity,Isnull(nullif(A.[PurchaseRate],''),0) AS PurchaseRate,  " &
                    " nullif(A.[PurchaseUnit],'') AS PurchaseUnit,Nullif(PH.HSNCode,'')  AS HSNCode,Nullif(PH.ProductHSNName,'')  AS ProductHSNName,Isnull(PH.GSTTaxPercentage,0) AS GSTTaxPercentage,Isnull(PH.CGSTTaxPercentage,0) AS CGSTTaxPercentage,Isnull(PH.SGSTTaxPercentage,0) AS SGSTTaxPercentage,Isnull(PH.IGSTTaxPercentage,0) AS IGSTTaxPercentage,Isnull(A.WtPerPacking,0) as WtPerPacking,Isnull(A.UnitPerPacking,0) as UnitPerPacking,Isnull(A.ConversionFactor,0) as ConversionFactor,Nullif(C.ConversionFormula,'') AS ConversionFormula, Nullif(C.ConvertedUnitDecimalPlace,'') AS UnitDecimalPlace,Nullif(CU.ConversionFormula,'') AS  ConversionFormulaStockUnit,Isnull(CU.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlaceStockUnit " &
                    " From ItemMaster AS A INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=A.ItemGroupID And Isnull(A.IsDeletedTransaction,0)=0 And IGM.CompanyID=A.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=A.ItemSubGroupID  And ISGM.CompanyID=A.CompanyID  " &
                    " INNER JOIN SupplierWisePurchaseSetting As SGA ON SGA.ItemGroupID=IGM.ItemGroupID And SGA.ItemID=A.ItemID And SGA.CompanyID=IGM.CompanyID LEFT JOIN ProductHSNMaster As PH ON PH.ProductHSNID=A.ProductHSNID And A.CompanyID=A.CompanyID  LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=A.StockUnit And C.ConvertedUnitSymbol=A.PurchaseUnit And C.CompanyID=A.CompanyID LEFT JOIN ConversionMaster As CU ON CU.BaseUnitSymbol=A.PurchaseUnit And CU.ConvertedUnitSymbol=A.StockUnit And CU.CompanyID=A.CompanyID " &
                    " Where A.CompanyID=" & GBLCompanyID & " And SGA.LedgerID=" & SelSupplierName & " Order by [ItemGroupID],[ItemName] "
        End If


        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Get Purchase Order No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPONO(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            Return db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open Get Purchase Order No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckIsAdmin() As String

        Dim IsAdminUser As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))

        Try
            If GBLUserName = "Admin" Then
                IsAdminUser = True
            Else
                IsAdminUser = False
            End If
        Catch ex As Exception
            IsAdminUser = False
        End Try
        Return IsAdminUser

    End Function

    '---------------Supplier code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Supplier() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct A.[LedgerID],B.[LedgerGroupID],B.[LedgerGroupNameID],A.[CompanyID],A.[LedgerName],nullif(A.[MailingName],'') as MailingName,nullif(A.[City],'') as City,nullif(A.[State],'') as SupState,nullif(S.[StateCode],'') AS StateCode,Isnull(S.[StateTinNo],0) AS StateTinNo,nullif(A.[Country],'') as Country,nullif(A.[MobileNo],'') as MobileNo,nullif(A.[GSTNo],'') AS GSTNo,nullif(A.[CurrencyCode],'') AS CurrencyCode,Isnull(A.[GSTApplicable],0) AS GSTApplicable,Isnull(C.stateTinNo,0) AS CompanyStateTinNo " &
                "From LedgerMaster AS A " &
                "INNER JOIN LedgerGroupMaster AS B ON A.LedgerGroupID=B.LedgerGroupID And A.CompanyID = B.CompanyID INNER JOIN CompanyMaster AS C ON C.CompanyID =A.CompanyID LEFT JOIN CountryStateMaster AS S ON S.State=A.State " &
                "Where A.CompanyID='" & GBLCompanyID & "'  and LedgerGroupNameID=23 "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Contact Peson code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContactPerson(ByVal ContactPerson As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select ConcernPersonID,Name from ConcernPersonMaster Where LedgerID='" & ContactPerson & "'  AND CompanyID='" & GBLCompanyID & "'   Order By Name "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Contact Peson code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CHLname() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "SELECT LedgerID,LedgerName,isnull([TaxPercentage],0) as TaxPercentage,nullif([TaxType],'') as TaxType,Isnull([GSTApplicable],'False') as GSTApplicable,nullif([GSTLedgerType],'') as GSTLedgerType,nullif([GSTCalculationOn],'') as GSTCalculationOn " &
               " FROM LedgerMaster Where CompanyID='" & GBLCompanyID & "' AND IsDeletedTransaction=0 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=43) "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Head Data code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function HeadFun() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        str = "Select isnull(HeadID,0) as HeadID,nullif(Head,'') as Head,nullif(RateType,'') as RateType,0 as Weight,0 as Rate,0 as HeadAmount From PurchaseHeadMaster where CompanyID='" & GBLCompanyID & "'"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Get Item rate code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetItemRate(ByVal LedgerId As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        str = "Select Distinct isnull(ItemID,0) AS ItemID,QuantityTolerance,Isnull(PurchaseRate,0) AS PurchaseRate,isnull(LedgerID,'') as LedgerID  From SupplierWisePurchaseSetting Where LedgerID='" & LedgerId & "' AND CompanyID='" & GBLCompanyID & "' "
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open PaaperPurchaseOrder  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavePaperPurchaseOrder(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsRecordOverHead As Object, ByVal jsonObjectsRecordTax As Object, ByVal jsonObjectsRecordSchedule As Object, ByVal jsonObjectsRecordRequisition As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If db.CheckAuthories("PurchaseOrder.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!"

        Dim dt As New DataTable
        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName As String 'For Currency
        Dim PONo As String
        Dim MaxPONo As Long
        Dim KeyField, str2, TransactionID, NumberToWord As String
        Dim AddColName, AddColValue, TableName As String
        Dim result As String

        Try
            NumberToWord = ""
            If CurrencyCode = "INR" Or CurrencyCode = "" Then
                CurrencyHeadName = ""
                CurrencyChildName = ""
                CurrencyCode = "INR"
                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
            Else
                NumberToWord = ""
                str2 = ""
                str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where  CurrencyCode='" & CurrencyCode & "'"
                db.FillDataTable(dtCurrency, str2)
                Dim j As Integer = dtCurrency.Rows.Count
                If j > 0 Then
                    CurrencyHeadName = dtCurrency.Rows(0)(0)
                    CurrencyChildName = dtCurrency.Rows(0)(1)
                    NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
                End If
            End If

            PONo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherID = -11 And VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "','" & NumberToWord & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)

            If IsNumeric(TransactionID) = False Then
                Return "Error: " & TransactionID
            End If

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            result = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            If IsNumeric(result) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                Return "Error: " & result
            End If

            TableName = "ItemPurchaseOrderTaxes"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            result = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)

            If IsNumeric(result) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where TransactionID=" & TransactionID)
                Return "Error: " & result
            End If

            TableName = "ItemPurchaseDeliverySchedule"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            result = db.InsertDatatableToDatabase(jsonObjectsRecordSchedule, TableName, AddColName, AddColValue)

            If IsNumeric(result) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseOrderTaxes Where TransactionID=" & TransactionID)
                Return "Error: " & result
            End If

            TableName = "ItemPurchaseOverheadCharges"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            result = db.InsertDatatableToDatabase(jsonObjectsRecordOverHead, TableName, AddColName, AddColValue)

            If IsNumeric(result) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseOrderTaxes Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseDeliverySchedule Where TransactionID=" & TransactionID)
                Return "Error: " & result
            End If

            TableName = "ItemPurchaseRequisitionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            result = db.InsertDatatableToDatabase(jsonObjectsRecordRequisition, TableName, AddColName, AddColValue)

            If IsNumeric(result) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseOrderTaxes Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseDeliverySchedule Where TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemPurchaseOverheadCharges Where TransactionID=" & TransactionID)
                Return "Error: " & result
            End If

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open PurchaseOrder  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePurchaseOrder(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsRecordOverHead As Object, ByVal jsonObjectsRecordTax As Object, ByVal jsonObjectsRecordSchedule As Object, ByVal jsonObjectsRecordRequisition As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If db.CheckAuthories("PurchaseOrder.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to update..!"

        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Dim dt As New DataTable
        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName, str2 As String 'For Currency
        Dim KeyField, NumberToWord As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String

        If CurrencyCode = "INR" Or CurrencyCode = "" Then
            CurrencyHeadName = ""
            CurrencyChildName = ""
            CurrencyCode = "INR"
            NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
        Else
            NumberToWord = ""
            str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where CurrencyCode='" & CurrencyCode & "'"
            db.FillDataTable(dtCurrency, str2)
            Dim j As Integer = dtCurrency.Rows.Count
            If j > 0 Then
                CurrencyHeadName = dtCurrency.Rows(0)(0)
                CurrencyChildName = dtCurrency.Rows(0)(1)
                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
            End If
        End If
        Using updateTransaction As New Transactions.TransactionScope
            Try
                Dim dtExist As New DataTable

                TableName = "ItemTransactionMain"
                AddColName = ""
                wherecndtn = ""
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "',AmountInWords='" & NumberToWord & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
                KeyField = db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 1, wherecndtn)

                If KeyField <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")
                db.ExecuteNonSQLQuery("Delete from ItemPurchaseOrderTaxes WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")
                db.ExecuteNonSQLQuery("Delete from ItemPurchaseDeliverySchedule WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")
                db.ExecuteNonSQLQuery("Delete from ItemPurchaseOverheadCharges WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")
                db.ExecuteNonSQLQuery("Delete from ItemPurchaseRequisitionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

                TableName = "ItemTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                TableName = "ItemPurchaseOrderTaxes"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                TableName = "ItemPurchaseDeliverySchedule"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordSchedule, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                TableName = "ItemPurchaseOverheadCharges"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordOverHead, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                TableName = "ItemPurchaseRequisitionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordRequisition, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updateTransaction.Dispose()
                    Return "Error: " & KeyField
                End If

                db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

                updateTransaction.Complete()
                KeyField = "Success"

            Catch ex As Exception
                updateTransaction.Dispose()
                KeyField = "Error: " & ex.Message
            End Try
            Return KeyField
        End Using
    End Function

    '---------------Allocated Supp ItemGroupWise---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllotedSupp(ByVal ItemGroupID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct Isnull(LM.LedgerID,0) as LedgerID,Nullif(LM.LedgerName,'') as LedgerName from SupplierWisePurchaseSetting as STGA inner join LedgerMaster as LM on STGA.LedgerID=LM.LedgerID And STGA.CompanyID=LM.CompanyID where STGA.ItemGroupID='" & ItemGroupID & "'  AND STGA.CompanyID='" & GBLCompanyID & "' and Isnull(STGA.IsDeletedTransaction,0)<>1 "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '---------------PrintPO---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PrintPO(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select top 1 Isnull(ITM.NetAmount,0) as NetAmount,Isnull(ITM.TotalOverHeadAmount,0) as TotalOverHeadAmount,Isnull(ITM.AmountInWords,0) as AmountInWords,NullIf(CM.CompanyName,'') AS CompanyName,NullIf(CM.GSTIN,'') AS GSTIN,NullIf(CM.Address1,'') +' , '+NullIf(CM.Address2,'') +' , '+NullIf(CM.City,'') +' , '+NullIf(CM.State,'') +' , '+NullIf(CM.Country,'') +' - '+NullIf(CM.Pincode,'') As CompanyAddress,NullIf(CM.State,'') as CompanyState,  " &
               " NullIf(LM.GSTNo,'') AS GSTNo,NullIf(LM.Address1,'') +' , '+NullIf(LM.Address2,'') +' , '+NullIf(LM.City,'') +' , '+NullIf(LM.State,'') +' , '+NullIf(LM.Country,'') As SuppAddress  " &
               " ,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,  " &
               " 0 AS TransID,0 AS ItemID, 0 As ItemGroupID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,  " &
               " NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,  " &
               " NullIf('','') AS ItemCode,NullIf('','') AS ItemName,NullIf('','') AS ItemDescription,   " &
               " ROUND(SUM(Isnull(ITD.PurchaseOrderQuantity, 0)), 2) As PurchaseQuantity, Nullif('','') AS PurchaseUnit,0 AS PurchaseRate,  " &
               " ROUND(SUM(Isnull(ITD.GrossAmount, 0)), 2) As GrossAmount, 0 As DiscountAmount, ROUND(SUM(Isnull(ITD.BasicAmount, 0)), 2) As BasicAmount,  " &
               " 0 AS GSTPercentage,ROUND((SUM(Isnull(ITD.CGSTAmount,0))+SUM(Isnull(ITD.SGSTAmount,0))+SUM(Isnull(ITD.IGSTAmount,0))),2) AS  " &
               " GSTTaxAmount, ROUND(SUM(Isnull(ITD.NetAmount, 0)), 2) As NetAmount, NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,  " &
               " NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITM.FYear,'') AS FYear,0 AS ReceiptTransactionID,  " &
               " Isnull(ITD.IsVoucherItemApproved, 0) As IsVoucherItemApproved, 0 As IsReworked, Nullif('','') AS ReworkRemark,  " &
               " Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,  " &
               " Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision ,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,0 AS RequiredQuantity,  " &
               " Nullif('','') AS ExpectedDeliveryDate,isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,  " &
               " Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID     " &
               " From ItemTransactionMain As ITM   " &
               " INNER Join CompanyMaster as CM on CM.CompanyID=ITM.CompanyID  " &
               " INNER Join ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID    " &
               " INNER Join UserMaster AS UA ON UA.UserID=ITM.CreatedBy And UA.CompanyID=ITM.CompanyID    " &
               " INNER Join LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID And LM.CompanyID=ITM.CompanyID  Left Join UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy And UA.CompanyID=ITM.CompanyID  " &
               " Where ITM.VoucherID = -11 And ITM.CompanyID ='" & GBLCompanyID & "' and ITM.TransactionID='" & transactionID & "'  AND Isnull(ITD.IsDeletedTransaction,0)<>1     " &
               " Group BY Isnull(ITM.TransactionID, 0),Isnull(ITM.VoucherID,0),Isnull(ITM.LedgerID,0),NullIf(LM.Address1,''), NullIf(LM.Address2,''), NullIf(LM.GSTNo,''), NullIf(CM.GSTIN,''),NullIf(CM.CompanyName,''),NullIf(CM.Address1,'') +' , '+NullIf(CM.Address2,'') +' , '+NullIf(CM.City,'') +' , '+NullIf(CM.State,'') +' , '+NullIf(CM.Country,'') +' - '+NullIf(CM.Pincode,''),NullIf(CM.State,''),  " &
               " NullIf(LM.Country,''),NullIf(LM.State,''), NullIf(LM.City,''),NullIf(LM.LedgerName,''),Isnull(ITM.MaxVoucherNo,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'), NullIf(Isnull(UA.UserName,''),''),NullIf(Isnull(UM.UserName,''),''),NullIf(ITM.FYear,''),Isnull(ITD.IsVoucherItemApproved,0),Nullif(ITM.PurchaseReferenceRemark,''),Nullif(ITM.Narration,''),Nullif(ITM.PurchaseDivision,''),Nullif(ITM.ContactPersonID,''),isnull(ITM.TotalTaxAmount,0),isnull(ITM.TotalOverheadAmount,0),Nullif(ITM.DeliveryAddress,''),Isnull(ITM.TotalQuantity,''),nullif(ITM.TermsOfPayment,''),Isnull(ITD.TaxableAmount,0),nullif(ITM.ModeOfTransport ,''),nullif(ITM.DealerID,''),Isnull(ITM.NetAmount,0),Isnull(ITM.TotalOverHeadAmount,0),Isnull(ITM.AmountInWords,0)     Order By NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0) "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------InWordFunction---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function InWords(ByVal TxtNetAmt As String) As String

        Dim dt As New DataTable
        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName, CurrencyCode, str2 As String 'For Currency
        Dim KeyField, NumberToWord As String

        Try
            CurrencyCode = "INR"
            NumberToWord = ""
            If CurrencyCode = "INR" Or CurrencyCode = "" Then
                CurrencyHeadName = ""
                CurrencyChildName = ""
                CurrencyCode = "INR"
                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
            Else
                NumberToWord = ""
                str2 = ""
                str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where CurrencyCode='" & CurrencyCode & "'"
                db.FillDataTable(dtCurrency, str2)
                Dim j As Integer = dtCurrency.Rows.Count
                If j > 0 Then
                    CurrencyHeadName = dtCurrency.Rows(0)(0)
                    CurrencyChildName = dtCurrency.Rows(0)(1)
                    NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
                End If
            End If

            KeyField = NumberToWord

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '---------------Head RetrivePoCreateGrid_ForPrint code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePoCreateGrid_ForPrint(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = "Select distinct Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS PurchaseVoucherID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,  " &
                    "Isnull(ITD.TransID,0) As TransID,Isnull(ITD.ItemID,0) As ItemID,  Isnull(ITD.ItemGroupID,0) As ItemGroupID,  " &
                    "NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS PurchaseMaxVoucherNo,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,  " &
                   " NullIf(ITM.VoucherNo,'') AS PurchaseVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo,   " &
                   " Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseVoucherDate,  " &
                   " Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate, NullIf(IM.ItemCode,'') AS ItemCode,  " &
                   " NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,   " &
                   " NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemDescription,''),'') AS ItemDescription, Isnull(ITD.RequiredQuantity,0) AS RequisitionQty,   " &
                   " Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseQuantity,  Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit,  " &
                   " Isnull(ITD.PurchaseRate,0) AS PurchaseRate, Isnull(ITD.GrossAmount,0) AS BasicAmount,Isnull(ITD.DiscountPercentage,0) AS Disc,  " &
                   " Isnull(ITD.DiscountAmount,0) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS AfterDisAmt,  " &
                   " Isnull(ITD.PurchaseTolerance,0) AS Tolerance, Isnull(ITD.GSTPercentage,0) AS GSTTaxPercentage,  " &
                   " (Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,  " &
                   " Isnull(ITD.NetAmount,0) AS TotalAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,   " &
                   " NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,0 AS ReceiptTransactionID,   " &
                   " Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,Nullif('','') AS ReworkRemark,   " &
                   " Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision,  	  " &
                   " Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,   " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.CGSTPercentage,0) as CGSTTaxPercentage,  " &
                   " Isnull(ITD.SGSTPercentage,0) as SGSTTaxPercentage,Isnull(ITD.IGSTPercentage,0) as IGSTTaxPercentage ,   " &
                   " Isnull(ITD.CGSTAmount,0) as CGSTAmt,  Isnull(ITD.SGSTAmount,0) as SGSTAmt,Isnull(ITD.IGSTAmount,0) as IGSTAmt ,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,  " &
                   " Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,  " &
                   " Nullif(PHM.ProductHSNName,'') AS ProductHSNName,Nullif(PHM.HSNCode,'') AS HSNCode,Isnull(IM.WtPerPacking,0) AS WtPerPacking,  " &
                   " Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,  " &
                   " Nullif(C.ConversionFormula,'') AS  ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace  " &
                   " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID   " &
                   " And ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID   " &
                   " And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=ITD.CompanyID   " &
                   " INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID   " &
                   " INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID And LM.CompanyID=ITM.CompanyID   " &
                   " LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID   " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID 			  " &
                   " LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=IM.StockUnit AND C.ConvertedUnitSymbol=ITD.PurchaseUnit And C.CompanyID=ITD.CompanyID    " &
                   " LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID=IM.ProductHSNID AND PHM.CompanyID=IM.CompanyID  Where ITM.VoucherID= -11 And ITM.CompanyID = '" & GBLCompanyID & "' and ITD.TransactionID='" & transactionID & "'  AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By TransID "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Open Master code---------------------------------
    '-----------------------------------Get Pending Requisition List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SupplierItemRates(ByVal itemIds As String, ByVal supID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If itemIds <> "" And supID <> "" Then
            str = " Select Distinct Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ITM.MaxVoucherNo,0) As MaxVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,    Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobBookingJobCardContentsID,'') AS RefJobBookingJobCardContentsID,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,     " &
                " NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,  (Isnull(ITD.RequiredQuantity, 0) - Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And RequisitionTransactionID = ITD.TransactionID And ItemID = ITD.ItemID And CompanyID = ITD.CompanyID),0)) As PurchaseQuantityComp,(Isnull(ITD.RequiredQuantity, 0) - Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0) = 0 And RequisitionTransactionID = ITD.TransactionID And ItemID = ITD.ItemID And CompanyID = ITD.CompanyID),0)) As PurchaseQuantity,Isnull(Nullif(IM.PurchaseRate,''),0) as PurchaseRate,  nullif(IM.PurchaseUnit,'') as PurchaseUnit, nullif(PHM.ProductHSNName,'') as ProductHSNName,  " &
                " replace(convert(nvarchar(30),ITD.ExpectedDeliveryDate,106),'','-') AS ExpectedDeliveryDate,nullif(PHM.HSNCode,'') as HSNCode, isnull(PHM.GSTTaxPercentage,0) as GSTTaxPercentage, isnull(PHM.CGSTTaxPercentage,0) as CGSTTaxPercentage, isnull(PHM.SGSTTaxPercentage,0) as SGSTTaxPercentage, isnull(PHM.IGSTTaxPercentage ,0) as IGSTTaxPercentage  ,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(Nullif(IM.SizeW,''),0) AS SizeW,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Nullif(C.ConversionFormula,'') AS  ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace   " &
                " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy And UA.CompanyID=ITM.CompanyID " &
                " LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID =IM.ProductHSNID And PHM.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=ITD.StockUnit AND C.ConvertedUnitSymbol=IM.PurchaseUnit And C.CompanyID=ITD.CompanyID " &
                " Where Isnull(ITM.VoucherID, 0) = -9 And ITM.CompanyID = " & GBLCompanyID & " AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsVoucherItemApproved,0)=1 And (Isnull(ITD.RequiredQuantity, 0) - Isnull((Select Sum(Isnull(RequisitionProcessQuantity, 0))  From ItemPurchaseRequisitionDetail Where Isnull(IsDeletedTransaction, 0)=0    And RequisitionTransactionID=ITD.TransactionID And ItemID=ITD.ItemID And CompanyID=ITD.CompanyID),0))>0    " &
                " Order By FYear Desc,MaxVoucherNo Desc,TransID "
        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''Get Currency Code List From Database
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCurrencyList() As String

        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = " Select Distinct CurrencyCode From CurrencyMaster Where Isnull(CurrencyCode,'')<>'' Order by CurrencyCode"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''Get POApprovalBy List From Database
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPOApprovalBy() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select Distinct Isnull(LM.LedgerID,0) as LedgerID,Nullif(LM.LedgerName,'') as LedgerName  From LedgerMaster As LM where LM.CompanyID ='" & GBLCompanyID & "' And Isnull(LM.IsDeletedTransaction,0)<>1 AND  LM.LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=27 AND CompanyID='" & GBLCompanyID & "')"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '--------------- Get Requisition and purchase order Comment Data---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCommentData(ByVal PurchaseTransactionID As String, ByVal requisitionIDs As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        If PurchaseTransactionID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Purchase Order',0," & PurchaseTransactionID & ",0,0,0,0,0,0"
        Else
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Purchase Order','" & requisitionIDs & "',0,0,0,0,0,0"
        End If
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Save Comment Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCommentData(ByVal jsonObjectCommentDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

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

    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class