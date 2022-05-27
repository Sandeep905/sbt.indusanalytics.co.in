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
Public Class WebService_ChallanDetail
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

    '---------------Open Master code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetClientData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            str = "Select A.LedgerID,A.LedgerName,Nullif(A.[MailingAddress],'') As MailingAddress,(Select Top 1 StateTinNo From CountryStateMaster Where State=A.State) As CompanyStateTinNo  From LedgerMaster AS A Where A.IsDeletedTransaction=0 And A.LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=24)"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetConsigneeData(ByVal ClientID As Integer) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            str = "Select A.[LedgerID] AS ConsigneeID,A.[LedgerName] As ConsigneeName,Nullif(A.[MailingAddress],'') As MailingAddress From LedgerMaster As A Where A.IsDeletedTransaction=0 And A.RefClientID =" & ClientID & " AND A.LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=44)"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetTransporterData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            str = "Select Distinct LedgerID As TransporterID,LedgerName As TransporterName From LedgerMaster As IMD Inner Join LedgerGroupMaster AS LGM On LGM.LedgerGroupID=IMD.LedgerGroupID And IMD.CompanyID=LGM.CompanyID  Where IMD.CompanyID=" & GBLCompanyID & " And Isnull(LGM.IsDeletedTransaction,0)<>1 And LGM.LedgerGroupNameID=35"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPendingOrdersList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Isnull(0,0) AS JobBookingJobCardContentsID,Isnull(CompanyID,0) AS CompanyID,Isnull(LedgerID,0) AS LedgerID,Isnull(ConsigneeID,0) AS ConsigneeID,Isnull(OrderBookingID,0) AS OrderBookingID,Isnull(OrderBookingDetailsID,0) AS OrderBookingDetailsID,Isnull(JobBookingID,0) AS JobBookingID,Isnull(ProductMasterID,0) AS ProductMasterID,Nullif(LedgerName,'') AS ClientName,Nullif(ConsigneeName,'') AS ConsigneeName,Nullif(JobBookingNo,'') AS JobBookingNo,replace(convert(nvarchar(30),JobBookingDate,106),'','-') AS JobBookingDate,Nullif(SalesOrderNo,'') AS SalesOrderNo,replace(convert(nvarchar(30),OrderBookingDate,106),'','-') AS OrderBookingDate,Nullif(ProductMasterCode,'') AS ProductMasterCode,Nullif(JobName,'') AS JobName,Nullif(ProductCode,'') AS ProductCode,Isnull(OrderQuantity,0) AS OrderQuantity,Isnull(JCQty,0) AS JCQty,  " &
                "Sum(Isnull(FinishGoodsQty,0)) As FinishGoodsQty, Sum(Isnull(DeliveredQuantity,0)) As DeliveredQuantity,(Isnull(JCQTY,0) - Sum(Isnull(DeliveredQuantity,0))) PendingQuantity,replace(convert(nvarchar(30),DeliveryDate,106),'','-') AS DeliveryDate,Nullif(PODetail,'') AS PODetail,ROUND(Sum(Isnull(FinishGoodsWt,0)),3) AS FinishGoodsWt,0 as TTLCFT, 0 as WTPerCFC,Sum(Isnull(TotalFGOuterCartons,0)) AS TotalFGOuterCartons,  " &
               " Nullif(DispatchRemark,'') AS DispatchRemark,Nullif(PONo,'') AS PONo,Nullif(Remark,'') AS Remark,replace(convert(nvarchar(30),PODate,106),'','-') AS PODate,(Select StateTinNo From CompanyMaster Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & ") AS StateTinNo, HSNCode " &
               " From DeliveryNotePendingFinishGoods " &
               " Where CompanyID ='" & GBLCompanyID & "' AND ISNULL(FinishGoodsQty,0)>0 " &
               " GROUP BY  Isnull(CompanyID,0),Isnull(LedgerID,0),Isnull(ConsigneeID,0),Isnull(OrderBookingID,0),Isnull(OrderBookingDetailsID,0),Isnull(JobBookingID,0),Isnull(ProductMasterID,0),Nullif(LedgerName,''),Nullif(ConsigneeName,''),Nullif(JobBookingNo,''),replace(convert(nvarchar(30),JobBookingDate,106),'','-') ,Nullif(SalesOrderNo,'') ,replace(convert(nvarchar(30),OrderBookingDate,106),'','-')  ,Nullif(ProductMasterCode,'') ,Nullif(JobName,'') ,Nullif(ProductCode,'') ,Isnull(OrderQuantity,0),Isnull(JCQty,0),  " &
                "replace(convert(nvarchar(30),DeliveryDate,106),'','-'),Nullif(PODetail,''),Nullif(DispatchRemark,''),Nullif(PONo,''),Nullif(Remark,''),replace(convert(nvarchar(30),PODate,106),'','-'), HSNCode  " &
                "Order BY  JobBookingNo"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProcessOrdersList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select JBC.JobBookingNo,JBC.JobName,Isnull(FGM.FGTransactionID,0) AS FGTransactionID,Isnull(FGM.LedgerID,0) AS LedgerID,Isnull(FGM.ConsigneeLedgerID,0) AS ConsigneeID,Isnull(FGM.MaxVoucherNo,0) AS MaxVoucherNo,Nullif(FGM.VoucherNo,'') AS VoucherNo,  " &
              " replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') as VoucherDate,nullif(LM.LedgerName,'') as LedgerName,nullif(CM.LedgerName,'') AS ConsigneeName,nullif(JOB.PONo,'') AS PONo, " &
              " replace(convert(nvarchar(30),JOB.PODate,106),'','-') as PODate,Isnull(FGM.TotalOuterCarton,0) AS TotalOuterCarton,Isnull(FGM.TotalQuantity,0) AS TotalQuantity,Isnull(FGM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(FGM.NetAMount,0) AS NetAmount  " &
                ",nullif(FGM.ModeOfTransport,'') AS ModeOfTransport,nullif(FGM.Narration,'') AS Narration,Nullif(VehicleNo,'') As VehicleNo,nullif(Transporter,0) As TransporterID,nullif(FGM.PODNo,'') As PODNo,isnull(TotalBasicAmount,0) as TotalBasicAmount ,(Select StateTinNo From CompanyMaster Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & ") AS StateTinNo " &
                " From FinishGoodsTransactionMain As FGM  " &
               " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGD.FGTransactionID=FGM.FGTransactionID AND FGD.CompanyID=FGM.CompanyID  " &
               " INNER JOIN LedgerMaster AS LM ON FGM.LedgerID=LM.LedgerID And FGM.CompanyID=LM.CompanyID  " &
               " LEFT JOIN LedgerMaster AS CM ON FGM.ConsigneeLedgerID=CM.LedgerID AND FGM.CompanyID=CM.CompanyID  " &
               " INNER JOIN JobOrderBooking AS JOB ON FGD.DeliveryOrderBookingID=JOB.OrderBookingID And FGD.CompanyID=JOB.CompanyID  " &
               " INNER JOIN JobBookingJobCard AS JBC ON JBC.JobBookingID=FGD.JobBookingID And FGD.CompanyID=JBC.CompanyID And JBC.IsDeletedTransaction=0 " &
               " Where FGM.VoucherID=-51 AND FGM.CompanyID='" & GBLCompanyID & "' AND Isnull(FGM.IsDeletedTransaction,0)=0  " &
               " Order By Isnull(FGM.MaxVoucherNo,0)"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AfterEditOrderDetailGrid(ByVal TxtCHDID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Isnull(FGD.CompanyID,0) AS CompanyID,Isnull(FGD.DeliveryJobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(FGM.LedgerID,0) AS LedgerID,Isnull(FGM.ConsigneeLedgerID,0) AS ConsigneeID,   " &
              " Isnull(FGD.DeliveryOrderBookingID,0) As OrderBookingID,Isnull(FGD.DeliveryOrderBookingDetailsID,0) As OrderBookingDetailsID,Isnull(FGD.DeliveryJobBookingID,0) As JobBookingID,Isnull(FGD.ProductMasterID,0) As ProductMasterID,Null As ClientName,NULL As ConsigneeName,  " &
              " Nullif(JBJ.JobBookingNo,'') AS JobBookingNo,replace(convert(nvarchar(30),JBJ.JobBookingDate,106),'','-') AS JobBookingDate,Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') AS OrderBookingDate,Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,  " &
              " NULLIF (PGM.HSNCode, '') AS HSNCode,Nullif(JBJ.JobName,'') AS JobName,Nullif(JBJ.ProductCode,'') AS ProductCode,Nullif(JOB.PONo,'') AS PONo,Nullif(JOB.PODate,'') AS PODate,Isnull(JOBD.OrderQuantity,0) AS OrderQuantity,Isnull(JBJC.PlanContQty,0) AS JCQty, " &
              " (Select Isnull(Sum(Isnull(B.IssueQuantity,0)),0) From FinishGoodsTransactionMain AS A INNER JOIN  FinishGoodsTransactionDetail AS B ON A.FGTransactionID=B.FGTransactionID And A.CompanyID=B.CompanyID Where A.VoucherID=-51 And Isnull(A.IsDeletedTransaction,0)=0 And B.DeliveryOrderBookingID=JOB.OrderBookingID And B.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID And A.CompanyID=JOB.CompanyID) AS DeliveredQuantity,  " &
              " (Isnull(FM.TotalQuantity,0)-Isnull((Select Sum(Isnull(B.IssueQuantity,0)) From FinishGoodsTransactionMain AS A INNER JOIN  FinishGoodsTransactionDetail AS B ON A.FGTransactionID=B.FGTransactionID  And A.CompanyID=B.CompanyID Where A.VoucherID=-51 And Isnull(A.IsDeletedTransaction,0)=0 And B.DeliveryOrderBookingID=JOB.OrderBookingID And B.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID And A.CompanyID=JOB.CompanyID),0)) AS PendingQuantity,  " &
              " FM.TotalQuantity AS FinishGoodsQty,Nullif(JOB.PODetail,'') AS PODetail,Nullif(JOB.Remark,'') AS DispatchRemark,0 AS TotalFGOuterCartons,0 AS FinishGoodsWt  " &
              " From FinishGoodsTransactionMain AS FGM  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID AND FGM.CompanyID=FGD.CompanyID  " &
              " INNER JOIN  FinishGoodsTransactionMain AS FM ON FM.FGTransactionID = FGD.ParentFGTransactionID AND FGD.CompanyID = FM.CompanyID " &
              " INNER JOIN JobOrderBooking AS JOB ON FGD.DeliveryOrderBookingID=JOB.OrderBookingID And FGD.CompanyID=JOB.CompanyID  " &
              " INNER JOIN JobOrderBookingDetails AS JOBD ON FGD.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID AND JOB.OrderBookingID=JOBD.OrderBookingID AND FGD.CompanyID=JOB.CompanyID  " &
              " LEFT JOIN JobBookingJobCard AS JBJ ON FGD.DeliveryJobBookingID=JBJ.JobBookingID And FGD.CompanyID=JBJ.CompanyID  " &
              " LEFT JOIN JobBookingJobCardContents AS JBJC ON FGD.DeliveryJobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID AND FGD.CompanyID=JBJC.CompanyID  " &
              " LEFT JOIN ProductMaster AS PM ON FGD.ProductMasterID=PM.ProductMasterID And FGD.CompanyID=PM.CompanyID  " &
              " LEFT JOIN ProductHSNMaster As PGM On PGM.ProductHSNID=JOBD.ProductHSNID AND JOBD.CompanyID = PGM.CompanyID " &
              " Where Isnull(FGM.IsDeletedTransaction,0)=0 AND FGM.voucherID=-51 AND FGM.CompanyID='" & GBLCompanyID & "' AND FGM.FGTransactionID= '" & TxtCHDID & "' " &
              " Order By FGD.DeliveryOrderBookingID"
        'Group By ISNULL(FGD.CompanyID, 0) , ISNULL(FGD.DeliveryJobBookingJobCardContentsID, 0) , ISNULL(FGM.LedgerID, 0), ISNULL(FGM.ConsigneeLedgerID, 0) , ISNULL(FGD.DeliveryOrderBookingID, 0), ISNULL(FGD.DeliveryOrderBookingDetailsID, 0) , ISNULL(FGD.DeliveryJobBookingID, 0),ISNULL(FGD.ProductMasterID, 0) , NULLIF (JBJ.JobBookingNo, '') , REPLACE(CONVERT(nvarchar(30), JBJ.JobBookingDate, 106), '', '-') , NULLIF (JOB.SalesOrderNo, ''), REPLACE(CONVERT(nvarchar(30), JOBD.OrderBookingDate, 106), '', '-') , NULLIF (PM.ProductMasterCode, ''), NULLIF (PM.ProductMasterCode, '') , NULLIF (JBJ.JobName, '') , NULLIF (JBJ.ProductCode, '') , NULLIF (JOB.PONo, '') , NULLIF (JOB.PODate, '') , ISNULL(JOBD.OrderQuantity, 0) , ISNULL(JBJC.PlanContQty, 0), JOB.OrderBookingID, JOBD.OrderBookingDetailsID, JOB.CompanyID,NULLIF (JOB.PODetail, '') , NULLIF (JOB.Remark, ''),FGD.DeliveryOrderBookingID 

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDataAfterEdit(ByVal TxtCHDID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Isnull(FGD.ParentFGTransactionID,0) as ParentFGTransactionID,Isnull(FGD.CompanyID,0) as CompanyID,Isnull(FGD.SemiPackingMainID,0) as SemiPackingMainID,  " &
              " Isnull(FGD.SemiPackingDetailID,0) As SemiPackingDetailID,Isnull(FGD.ParentFGTransactionDetailID,0) As ParentFGTransactionDetailID,Isnull(FGD.JobBookingID,0) As JobBookingID,  " &
              " Isnull(FGD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,Isnull(FGD.ProductMasterID,0) as ProductMasterID,Isnull(FGD.OrderBookingID,0) as OrderBookingID,  " &
              " Isnull(FGD.OrderBookingDetailsID,0) as OrderBookingDetailsID,Isnull(FGD.WarehouseID,0) as WarehouseID,Isnull(FGD.ProductHSNID,0) as ProductHSNID, nullif(FM.VoucherNo,'') AS PackingNo,replace(convert(nvarchar(30),FM.VoucherDate,106),'','-') AS PackingDate,  " &
              " nullif(JOB.SalesOrderNo,'') as SalesOrderNo,replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') as OrderBookingDate,nullif(JBJ.JobBookingNo,'') as JobBookingNo,  " &
              " replace(convert(nvarchar(30),JBJ.JobBookingDate,106),'','-') AS JobBookingDate,nullif(PM.ProductMasterCode,'') as ProductMasterCode,nullif(JOBD.ProductCode,'') as ProductCode,  " &
              " nullif(JBJ.JobName,'') as JobName,Isnull(FGD.IssueOuterCarton,0) as IssueOuterCarton,Isnull(FGD.InnerCarton,0) as InnerCarton,Isnull(FGD.QuantityPerPack,0) as QuantityPerPack,  " &
              " Isnull(FGD.IssueQuantity,0) AS PurchaseQuantity,Isnull(FGD.Rate,0) AS PurchaseRate, nullif(FGD.Unit,'') AS PurchaseUnit,Isnull(FGD.BasicAmount,0) as BasicAmount,Isnull(FGD.DiscountPercentage,0) AS Disc,Isnull(FGD.BasicAmount,0)-Isnull(FGM.TotalDiscountAmount,0) AS AfterDisAmt,Isnull(FGM.TotalDiscountAmount,0) As TotalDiscountAmount,Isnull(FGD.TaxableAmount,0) as TaxableAmount,  " &
              " Isnull( FGD.GSTPercentage,0) AS GSTTaxPercentage,Isnull(FGD.CGSTPercentage,0) AS CGSTTaxPercentage, Isnull(FGD.SGSTPercentage,0) AS SGSTTaxPercentage,Isnull(FGD.IGSTPercentage,0) AS IGSTTaxPercentage,  " &
              " Isnull(FGD.CGSTAmount,0) AS CGSTAmt,Isnull(FGD.SGSTAmount,0) AS SGSTAmt,Isnull(FGD.IGSTAmount,0) AS IGSTAmt,Isnull(FGD.NetAmount,0) AS TotalAmount,  " &
              " nullif(FGD.CFT,'') as CFT, nullif(FGD.CBCM,'') as CBCM, nullif(FGD.ShipperLengthCM,'') as ShipperLengthCM, nullif(FGD.ShipperWidthCM,'') as ShipperWidthCM, nullif(FGD.ShipperHeightCM,'') as ShipperHeightCM,  " &
              " nullif(FGD.WeightPerOuterCarton,0) as WeightPerOuterCarton, nullif(WM.WarehouseName,'') as WarehouseName, nullif(WM.WarehouseBinName,'') as WarehouseBinName,Isnull(FGD.DeliveryOrderBookingID,0) as DeliveryOrderBookingID,  " &
              " Isnull(FGD.DeliveryOrderBookingDetailsID,0) as DeliveryOrderBookingDetailsID,Isnull(FGD.DeliveryJobBookingID,0) as DeliveryJobBookingID,  " &
              " Isnull(FGD.DeliveryJobBookingJobCardContentsID,0) as  DeliveryJobBookingJobCardContentsID, PGM.HSNCode  " &
              " From FinishGoodsTransactionMain AS FGM  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID And FGM.CompanyID=FGD.CompanyID AND Isnull(FGD.IsDeletedTransaction,0)=0 " &
              " INNER JOIN FinishGoodsTransactionMain AS FM ON FGD.ParentFGTransactionID=FM.FGTransactionID AND FGD.CompanyID=FM.CompanyID  " &
              " INNER JOIN JobOrderBooking AS JOB ON FGD.OrderBookingID=JOB.OrderBookingID And FGD.CompanyID=JOB.CompanyID AND Isnull(JOB.IsDeletedTransaction,0)=0 " &
              " INNER JOIN JobOrderBookingDetails AS JOBD ON FGD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID AND FGD.CompanyID=JOBD.CompanyID AND Isnull(JOBD.IsDeletedTransaction,0)=0 " &
              " INNER JOIN WarehouseMaster AS WM ON FGD.WarehouseID=WM.WarehouseID And FGD.CompanyID=WM.CompanyID " &
              " LEFT JOIN ProductHSNMaster As PGM On PGM.ProductHSNID=JOBD.ProductHSNID AND JOBD.CompanyID = PGM.CompanyID " &
              " LEFT JOIN JobBookingJobCard AS JBJ ON FGD.JobBookingID=JBJ.JobBookingID AND FGD.CompanyID=JBJ.CompanyID AND Isnull(JBJ.IsDeletedTransaction,0)=0 " &
              " LEFT JOIN ProductMaster AS PM ON FGD.ProductMasterID=PM.ProductMasterID And FGD.CompanyID=PM.CompanyID  " &
              " Where FGM.VoucherID=-51 AND FGM.FGTransactionID=" & TxtCHDID & " AND FGM.CompanyID='" & GBLCompanyID & "' AND Isnull(FGM.IsDeletedTransaction,0)=0"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDataAfterEdit_ChargesGrid(ByVal TxtCHDID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Nullif(LM.LedgerName,'') AS LedgerName,Isnull(FGT.TaxPercentage,0) AS TaxRatePer,Nullif(FGT.CalculatedON,'') AS CalculateON,Isnull(FGT.GSTApplicable,0) AS GSTApplicable,   " &
             "  Isnull(FGT.TaxInAmount,0) As InAmount,Isnull(FGT.Amount,0) As ChargesAmount,Isnull(FGT.Iscomulative,0) As IsCumulative,  " &
             "  Nullif((Select Distinct FieldValue From LedgerMasterDetails  Where LedgerID=FGT.LedgerID AND CompanyID=FGT.CompanyID AND FieldName='TaxType' And Isnull(FieldValue,'')<>''),'') AS TaxType,Nullif((Select Distinct FieldValue From LedgerMasterDetails  Where LedgerID=FGT.LedgerID AND CompanyID=FGT.CompanyID AND FieldName='GSTLedgerType' And Isnull(FieldValue,'')<>''),'') AS GSTLedgerType,Isnull(FGT.LedgerID,0) AS LedgerID  " &
             "  From FinishGoodsTransactionMain AS FGM  " &
             "  INNER JOIN FinishGoodsTransactionTaxes AS FGT ON FGM.FGTransactionID=FGT.FGTransactionID AND FGM.CompanyID=FGT.CompanyID  " &
             "  INNER JOIN LedgerMaster AS LM ON FGT.LedgerID=LM.LedgerID And FGT.CompanyID=LM.CompanyID  " &
             "  Where Isnull(FGM.IsDeletedTransaction,0)=0 AND FGM.voucherID=-51 AND FGM.CompanyID='" & GBLCompanyID & "'  AND FGM.FGTransactionID='" & TxtCHDID & "'  " &
             "  Order By FGT.TransID"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function StockDetail(ByVal LedgerID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select isnull(FD.ParentFGTransactionID,0) As ParentFGTransactionID,isnull(FGD.ParentFGTransactionDetailID,0) As ParentFGTransactionDetailID, " &
              " isnull(FD.ProductMasterID,0) As ProductMasterID, " &
              " isnull(FD.OrderBookingID,0) As OrderBookingID,isnull(FD.OrderBookingDetailsID,0) As OrderBookingDetailsID,isnull(FD.JobBookingID,0) As JobBookingID, " &
              " isnull(FD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,isnull(FGD.WarehouseID,0) As WarehouseID,  " &
              " nullif(JOB.SalesOrderNo,'') as SalesOrderNo,nullif(JBJ.JobBookingNo,'') as JobBookingNo,nullif(JBJC.JobCardContentNo,'') as JobCardContentNo, " &
              " nullif(JOB.SalesOrderNo,'') as SalesOrderNo,isnull(JOBD.OrderQuantity,0) as OrderQuantity,nullif(FG.VoucherNo,'') AS PackingNo, " &
              " replace(convert(nvarchar(30),FG.VoucherDate,106),'','-') AS PackingDate, " &
              " (Sum(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) As TotalFGOuterCarton, " &
              " nullif(FD.InnerCarton,'') as InnerCarton, nullif(FD.QuantityPerPack,'') as QuantityPerPack,Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0)) As TotalFGQuantity, " &
              " nullif(FD.WeightPerOuterCarton,'') as WeightPerOuterCarton,Isnull(FD.WeightPerOuterCarton,0)*(Sum(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) AS TotalFGWeight, " &
              " Cast((SUm(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) As Nvarchar(100))+'x'+Cast(Isnull(FD.InnerCarton,0)*Isnull(FD.QuantityPerPack,0) As nvarchar(50)) As PackingDetail, " &
              " nullif(FD.ShipperHeightCM,'') as ShipperHeightCM,nullif( FD.ShipperWidthCM,'') as ShipperWidthCM,nullif(FD.ShipperHeightCM,'') as ShipperHeightCM,nullif(FD.CBCM,'') as CBCM, " &
              " nullif( FD.CFT,'') as CFT, nullif(FD.TotalCFT,'') as TotalCFT, nullif(WM.WarehouseName,'') as WarehouseName,  " &
              " nullif(WM.WarehouseBinName,'') as WarehouseBinName,Datediff(d,FG.VoucherDate,GETDATE()) AS AGING" &
              " From FinishGoodsTransactionMain AS FGM  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID AND FGM.CompanyID=FGD.CompanyID  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FD ON FD.FGTransactionID=FGD.ParentFGTransactionID AND FD.FGTransactionDetailID=FGD.ParentFGTransactionDetailID AND FD.CompanyID=FGD.CompanyID AND Isnull(FD.ProductMasterID,0)>0  " &
              " INNER JOIN FinishGoodsTransactionMain AS FG ON FG.FGTransactionID=FGD.ParentFGTransactionID And FG.CompanyID=FGD.CompanyID  " &
              " INNER JOIN WarehouseMaster AS WM ON FGD.WarehouseID=WM.WarehouseID And FGD.CompanyID=WM.CompanyID  " &
              " INNER JOIN JobOrderBookingDetails AS JOBD ON FD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID AND FD.CompanyID=JOBD.CompanyID  " &
              " INNER JOIN JobOrderBooking AS JOB ON JOBD.OrderBookingID=JOB.OrderBookingID And JOBD.CompanyID=JOB.CompanyID  " &
              " LEFT JOIN JobBookingJobCard AS JBJ ON FD.JobBookingID=JBJ.JobBookingID AND FD.CompanyID=JBJ.CompanyID  " &
              " LEFT JOIN JobBookingJobCardContents AS JBJC ON FD.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID And FD.JobBookingID=JBJC.JobBookingID And FD.CompanyID=JBJC.CompanyID  " &
              " Where FGD.CompanyID='" & GBLCompanyID & "' AND Isnull(FGD.IsDeletedTransaction,0)=0 AND (Isnull(JBJ.ProductMasterID,0)>0 Or Isnull(FD.ProductMasterID,0)>0) AND FG.LedgerID='" & LedgerID & "'  " &
              " GROUP BY FD.ParentFGTransactionID,FGD.ParentFGTransactionDetailID,FD.ProductMasterID,FD.OrderBookingID,FD.OrderBookingDetailsID,FD.JobBookingID,FD.JobBookingJobCardContentsID,FGD.WarehouseID,   " &
              " JOB.SalesOrderNo,JBJ.JobBookingNo,JBJC.JobCardContentNo,JOB.SalesOrderNo,JOBD.OrderQuantity,FG.VoucherNo,FG.VoucherDate,FD.InnerCarton,FD.QuantityPerPack,FD.WeightPerOuterCarton,FD.ShipperHeightCM, FD.ShipperWidthCM,FD.ShipperHeightCM ,FD.CBCM, FD.CFT, FD.TotalCFT, WM.WarehouseName,   " &
              "  WM.WarehouseBinName  " &
              "  UNION ALL  " &
              " Select isnull(FD.ParentFGTransactionID,0) as ParentFGTransactionID,isnull(FGD.ParentFGTransactionDetailID,0) as ParentFGTransactionDetailID,isnull(FD.ProductMasterID,0) as ProductMasterID,  " &
              "  isnull(FD.OrderBookingID,0) As OrderBookingID,isnull(FD.OrderBookingDetailsID,0) As OrderBookingDetailsID,isnull(FD.JobBookingID,0) As JobBookingID,  " &
              "  isnull(FD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,isnull(FGD.WarehouseID,0) as WarehouseID,   " &
              "  nullif(JOB.SalesOrderNo,'') as SalesOrderNo,nullif(JBJ.JobBookingNo,'') as JobBookingNo,nullif(JBJC.JobCardContentNo,'') as JobCardContentNo,  " &
              "  nullif(JOB.SalesOrderNo,'') as SalesOrderNo,nullif(JOBD.OrderQuantity,'') as OrderQuantity,nullif(FG.VoucherNo,'') as  PackingNo,  " &
              "  replace(convert(nvarchar(30),FG.VoucherDate,106),'','-')  AS PackingDate,(Sum(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) As TotalFGOuterCarton,  " &
              "  nullif(FD.InnerCarton,'') as InnerCarton,nullif(FD.QuantityPerPack,'') as QuantityPerPack,Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0)) As TotalFGQuantity,  " &
              "  nullif(FD.WeightPerOuterCarton,'') as WeightPerOuterCarton,Isnull(FD.WeightPerOuterCarton,0)*(Sum(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) AS TotalFGWeight,  " &
              "  Cast((SUm(ISNULL(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))) As Nvarchar(100))+'x'+Cast(Isnull(FD.InnerCarton,0)*Isnull(FD.QuantityPerPack,0) As nvarchar(50)) As PackingDetail,  " &
              "  nullif(FD.ShipperHeightCM,'') as ShipperHeightCM, nullif(FD.ShipperWidthCM,'') as ShipperWidthCM,nullif(FD.ShipperHeightCM,'') as  ShipperHeightCM,  " &
              "  nullif(FD.CBCM,'') as CBCM,nullif( FD.CFT,'') as CFT,nullif( FD.TotalCFT,'') as TotalCFT, nullif(WM.WarehouseName,'') as WarehouseName,   " &
              "  nullif(WM.WarehouseBinName,'') as WarehouseBinName,Datediff(d,FG.VoucherDate,GETDATE()) AS AGING" &
              " From FinishGoodsTransactionMain AS FGM  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID And FGM.CompanyID=FGD.CompanyID  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FD ON FD.FGTransactionID=FGD.ParentFGTransactionID And FD.FGTransactionDetailID=FGD.ParentFGTransactionDetailID And FD.CompanyID=FGD.CompanyID AND Isnull(FD.ProductMasterID,0)=0 " &
              " INNER JOIN FinishGoodsTransactionMain AS FG ON FG.FGTransactionID=FGD.ParentFGTransactionID AND FG.CompanyID=FGD.CompanyID  " &
              " INNER JOIN WarehouseMaster AS WM ON FGD.WarehouseID=WM.WarehouseID AND FGD.CompanyID=WM.CompanyID  " &
              " INNER JOIN JobOrderBookingDetails AS JOBD ON FD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID And FD.CompanyID=JOBD.CompanyID  " &
              " INNER JOIN JobOrderBooking AS JOB ON JOBD.OrderBookingID=JOB.OrderBookingID AND JOBD.CompanyID=JOB.CompanyID  " &
              " LEFT JOIN JobBookingJobCard AS JBJ ON FD.JobBookingID=JBJ.JobBookingID And FD.CompanyID=JBJ.CompanyID  " &
              " LEFT JOIN JobBookingJobCardContents AS JBJC ON FD.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID AND FD.JobBookingID=JBJC.JobBookingID AND FD.CompanyID=JBJC.CompanyID  " &
              " Where FGD.CompanyID='" & GBLCompanyID & "' AND Isnull(FGD.IsDeletedTransaction,0)=0 AND (Isnull(JBJ.ProductMasterID,0)=0 Or Isnull(FD.ProductMasterID,0)=0) AND FG.LedgerID='" & LedgerID & "'  " &
              " GROUP BY FD.ParentFGTransactionID,FGD.ParentFGTransactionDetailID,FD.ProductMasterID,FD.OrderBookingID,FD.OrderBookingDetailsID,FD.JobBookingID,FD.JobBookingJobCardContentsID,FGD.WarehouseID,   " &
              " JOB.SalesOrderNo,JBJ.JobBookingNo,JBJC.JobCardContentNo,JOB.SalesOrderNo,JOBD.OrderQuantity,FG.VoucherNo,FG.VoucherDate,FD.InnerCarton,FD.QuantityPerPack,FD.WeightPerOuterCarton,FD.ShipperHeightCM, FD.ShipperWidthCM,FD.ShipperHeightCM ,FD.CBCM, FD.CFT, FD.TotalCFT, WM.WarehouseName,   " &
              "  WM.WarehouseBinName"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function



    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDeliveryDetail(ByVal JobBokingIdString As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = " Select Isnull(FGM.FGTransactionID,0) as FGTransactionID,nullif(FGM.VoucherNo,'') as DeliveryNoteNo, " &
                " replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') as DeliveryNoteDate,nullif(JBJ.JobBookingNo,'') as JobBookingNo, " &
                " replace(convert(nvarchar(30),JBJ.JobBookingDate,106),'','-') as JobBookingDate,nullif(JBJC.JobCardContentNo,'') as JobCardContentNo,isnull(JBJC.PlanContQty,0) AS OrderQuantity, " &
                " ISNULL(Sum(ISNULL(FGD.IssueOuterCarton,0)),0) As Total_Box,ISNULL(Sum(ISNULL(FGD.IssueQuantity,0)),0) As TotalQty,ROUND(ISNULL(Sum(ISNULL(FGD.IssueTotalWeight,0)),0),2) As TotalWt    " &
                " From FinishGoodsTransactionMain AS FGM INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID AND FGM.CompanyID=FGD.CompanyID LEFT JOIN JobBookingJobCardContents AS JBJC ON FGD.DeliveryJobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID AND FGD.DeliveryJobBookingID=JBJC.JobBookingID AND FGD.CompanyID=JBJC.CompanyID " &
                " LEFT JOIN JobBookingJobCard AS JBJ ON FGD.JobBookingID=JBJ.JobBookingID AND FGD.CompanyID=JBJ.CompanyID " &
                " Where FGM.VoucherID=-51 AND Isnull(FGM.IsDeletedTransaction,0)=0 AND  FGM.CompanyID='" & GBLCompanyID & "' AND FGD.JobBookingID IN(" & JobBokingIdString & ") " &
                " GROUP BY FGM.FGTransactionID,FGM.VoucherNo,FGM.VoucherDate,JBJ.JobBookingNo,JBJ.JobBookingDate,JBJC.JobCardContentNo,JBJC.PlanContQty"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open FinishGoodDetail Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetFinisgGoddDetail(ByVal ProductMasterID As String, ByVal JobBookingID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If ProductMasterID = "" Or ProductMasterID = 0 Or ProductMasterID = "0" Then
            str = ""
            str = "Select Isnull(FGD.ParentFGTransactionID,0) AS ParentFGTransactionID,Isnull(FGD.CompanyID,0) AS CompanyID,Isnull(FGD.SemiPackingMainID,0) AS SemiPackingMainID,Isnull(FGD.SemiPackingDetailID,0) AS SemiPackingDetailID,Isnull(FGD.ParentFGTransactionDetailID,0) AS ParentFGTransactionDetailID,Isnull(FD.JobBookingID,0) AS JobBookingID,Isnull(FD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(FGD.ProductMasterID,0) AS ProductMasterID,Isnull(FGD.OrderBookingID,0) AS OrderBookingID,Isnull(FGD.OrderBookingDetailsID,0) AS OrderBookingDetailsID,Isnull(FGD.WarehouseID,0) AS WarehouseID,NULLIF (PHM.HSNCode, '') AS HSNCode,Isnull(JBJ.ProductHSNID,0) AS ProductHSNID,Nullif(FM.VoucherNo,'') AS PackingNo,replace(convert(nvarchar(30),FM.VoucherDate,106),'','-')  AS PackingDate,    Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,JOBD.OrderBookingDate,Nullif(JBJ.JobBookingNo,'') AS JobBookingNo,JBJ.JobBookingDate,Case When Isnull(FGD.ProductMasterID,0)>0 Then Nullif(PM.ProductMasterCode,'') Else NULL End As ProductMasterCode,Nullif(JOBD.ProductCode,'') AS ProductCode,Nullif(JBJ.JobName,'') AS JobName,    Sum(Isnull(FGD.ReceiptQuantity,0)) AS PackedQuantity,Sum(Isnull(FGD.IssueQuantity,0)) AS DeliveredQuantity,(Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0))) AS FGStock,Sum(Isnull(FGD.ReceiptOuterCarton,0)) AS TotalPackedOuterCartons,Sum(Isnull(FGD.IssueOuterCarton,0)) AS TotalDeliveredOuterCartons,Round((Sum(Isnull(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))),3) AS TotalFGOuterCartons, " &
                  " Isnull(FD.InnerCarton,0) AS InnerCarton,Isnull(JOBD.ChangeCost,0) As PurchaseRate,JOBD.RateType As PurchaseUnit,Isnull(FD.QuantityPerPack,0) AS QuantityPerPack,Isnull(FD.CFT,0) AS CFT,Isnull(FD.CBCM,0) AS CBCM,Isnull(FD.ShipperLengthCM,0) AS ShipperLengthCM,Isnull(FD.ShipperWidthCM,0) AS ShipperWidthCM,Isnull(FD.ShipperHeightCM,0) AS ShipperHeightCM,Isnull(FD.WeightPerOuterCarton,0) AS WeightPerOuterCarton, Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.WarehouseBinName,'') AS WarehouseBinName,Isnull(PHM.GSTTaxPercentage,0) AS GSTTaxPercentage,Isnull(PHM.CGSTTaxPercentage,0) AS CGSTTaxPercentage,Isnull(PHM.SGSTTaxPercentage,0) AS SGSTTaxPercentage,Isnull(PHM.IGSTTaxPercentage,0) AS IGSTTaxPercentage,0 AS CGSTAmt,0 AS SGSTAmt,0 AS IGSTAmt, 0 AS TotalAmount " &
                  " From FinishGoodsTransactionMain as FGM INNER JOIN FinishGoodsTransactionDetail as FGD ON FGM.FGTransactionID=FGD.FGTransactionID And FGM.CompanyID=FGD.CompanyID INNER JOIN FinishGoodsTransactionDetail as FD ON FGD.ParentFGTransactionID=FD.FGTransactionID And FGD.ParentFGTransactionDetailID=FD.FGTransactionDetailID And FGD.CompanyID=FD.CompanyID INNER JOIN FinishGoodsTransactionMain as FM ON FD.FGTransactionID=FM.FGTransactionID And FD.CompanyID=FM.CompanyID INNER JOIN JobOrderBookingDetails as JOBD ON FGD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID And FGD.OrderBookingID=JOBD.OrderBookingID And FGD.CompanyID=JOBD.CompanyID INNER JOIN JobOrderBooking as JOB ON JOBD.OrderBookingID=JOB.OrderBookingID And JOBD.CompanyID=JOB.CompanyID " &
                  " INNER JOIN WarehouseMaster as WM ON FGD.WarehouseID=WM.WarehouseID And FGD.CompanyID=WM.CompanyID LEFT JOIN ProductMaster as PM ON FGD.ProductMasterID=PM.ProductMasterID And FGD.CompanyID=PM.CompanyID LEFT JOIN JobBookingJobCard as JBJ ON FGD.JobBookingID=JBJ.JobBookingID And FGD.CompanyID=JBJ.CompanyID AND Isnull(JBJ.IsDeletedTransaction,0)=0 LEFT JOIN JobBookingJobCardContents as JBJC ON FD.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID And FD.JobBookingID=JBJC.JobBookingID And FD.CompanyID=JBJC.CompanyID LEFT JOIN ProductHSNMaster as PHM ON JBJ.ProductHSNID=PHM.ProductHSNID And JBJ.CompanyID=PHM.CompanyID " &
                   " Where FGD.JobBookingID='" & JobBookingID & "' and Isnull(FGD.IsDeletedTransaction,0)=0 and FGD.CompanyID='" & GBLCompanyID & "'   " &
                   " GROUP BY FGD.ParentFGTransactionID,FGD.CompanyID,FGD.SemiPackingMainID,JOBD.ChangeCost,JOBD.RateType,FGD.SemiPackingDetailID,FGD.ParentFGTransactionDetailID,FD.JobBookingID,FD.JobBookingJobCardContentsID,FGD.ProductMasterID,FGD.OrderBookingID,FGD.OrderBookingDetailsID,FGD.WarehouseID, JOB.SalesOrderNo,JOBD.OrderBookingDate,JBJ.JobBookingNo,JBJ.JobBookingDate,PM.ProductMasterCode,JOBD.ProductCode,JBJ.JobName,Isnull(FD.InnerCarton,0),Isnull(FD.QuantityPerPack,0),Isnull(FD.CFT,0) ,Isnull(FD.CBCM,0) ,Isnull(FD.ShipperLengthCM,0),Isnull(FD.ShipperWidthCM,0),Isnull(FD.ShipperHeightCM,0),Isnull(FD.WeightPerOuterCarton,0),    WM.WarehouseName,WM.WarehouseBinName,FM.VoucherNo,FM.VoucherDate,NULLIF (PHM.HSNCode, ''),Isnull(JBJ.ProductHSNID,0),Isnull(PHM.GSTTaxPercentage,0),Isnull(PHM.CGSTTaxPercentage,0),Isnull(PHM.SGSTTaxPercentage,0),Isnull(PHM.IGSTTaxPercentage,0)  " &
                   " Having (Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0)))>0"
        Else
            str = ""
            str = "Select Isnull(FGD.ParentFGTransactionID,0) AS ParentFGTransactionID,Isnull(FGD.CompanyID,0) AS CompanyID,Isnull(FGD.SemiPackingMainID,0) AS SemiPackingMainID,Isnull(FGD.SemiPackingDetailID,0) AS SemiPackingDetailID,Isnull(FGD.ParentFGTransactionDetailID,0) AS ParentFGTransactionDetailID,Isnull(FGD.JobBookingID,0) AS JobBookingID,Isnull(FGD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(FGD.ProductMasterID,0) AS ProductMasterID,Isnull(FGD.OrderBookingID,0) AS OrderBookingID,Isnull(FGD.OrderBookingDetailsID,0) AS OrderBookingDetailsID,Isnull(FGD.WarehouseID,0) AS WarehouseID,NULLIF (PHM.HSNCode, '') AS HSNCode,Isnull(JBJ.ProductHSNID,0) AS ProductHSNID,Nullif(FM.VoucherNo,'') AS PackingNo,replace(convert(nvarchar(30),FM.VoucherDate,106),'','-')  AS PackingDate,   " &
                  "  Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,JOBD.OrderBookingDate,Nullif(JBJ.JobBookingNo,'') AS JobBookingNo,JBJ.JobBookingDate,Case When Isnull(FGD.ProductMasterID,0)>0 Then Nullif(PM.ProductMasterCode,'') Else NULL End As ProductMasterCode,Nullif(JOBD.ProductCode,'') AS ProductCode,Isnull(JOBD.ChangeCost,0) As PurchaseRate,JOBD.RateType As PurchaseUnit,Nullif(JBJ.JobName,'') AS JobName, Sum(Isnull(FGD.ReceiptQuantity,0)) AS PackedQuantity,Sum(Isnull(FGD.IssueQuantity,0)) AS DeliveredQuantity,(Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0))) AS FGStock,   " &
                  "  Sum(Isnull(FGD.ReceiptOuterCarton,0)) AS TotalPackedOuterCartons,Sum(Isnull(FGD.IssueOuterCarton,0)) AS TotalDeliveredOuterCartons,Round((Sum(Isnull(FGD.ReceiptOuterCarton,0))-Sum(Isnull(FGD.IssueOuterCarton,0))),3) AS TotalFGOuterCartons, Isnull(FD.InnerCarton,0) AS InnerCarton,Isnull(FD.QuantityPerPack,0) AS QuantityPerPack,Isnull(FD.CFT,0) AS CFT,Isnull(FD.CBCM,0) AS CBCM,Isnull(FD.ShipperLengthCM,0) AS ShipperLengthCM,Isnull(FD.ShipperWidthCM,0) AS ShipperWidthCM,Isnull(FD.ShipperHeightCM,0) AS ShipperHeightCM,Isnull(FD.WeightPerOuterCarton,0) AS WeightPerOuterCarton,   " &
                  "  WM.WarehouseName,WM.WarehouseBinName,Isnull(PHM.GSTTaxPercentage,0) AS GSTTaxPercentage,Isnull(PHM.CGSTTaxPercentage,0) AS CGSTTaxPercentage,Isnull(PHM.SGSTTaxPercentage,0) AS SGSTTaxPercentage,Isnull(PHM.IGSTTaxPercentage,0) AS IGSTTaxPercentage,0 AS CGSTAmt,0 AS SGSTAmt,0 AS IGSTAmt, 0 AS TotalAmount   " &
                  "  From FinishGoodsTransactionMain as FGM   " &
                  "  INNER JOIN FinishGoodsTransactionDetail as FGD ON FGD.FGTransactionID=FGM.FGTransactionID And FGD.CompanyID=FGM.CompanyID AND Isnull(FGD.IsDeletedTransaction,0)=0  " &
                  "  INNER JOIN FinishGoodsTransactionDetail as FD ON FD.FGTransactionID=FGD.ParentFGTransactionID And FD.FGTransactionDetailID=FGD.ParentFGTransactionDetailID And FD.CompanyID=FGD.CompanyID AND Isnull(FD.IsDeletedTransaction,0)=0 " &
                  "  INNER JOIN FinishGoodsTransactionMain as FM ON FM.FGTransactionID=FD.FGTransactionID And FM.CompanyID=FD.CompanyID AND Isnull(FM.IsDeletedTransaction,0)=0  " &
                  "  INNER JOIN JobOrderBookingDetails as JOBD ON JOBD.OrderBookingDetailsID=FGD.OrderBookingDetailsID And JOBD.OrderBookingID=FGD.OrderBookingID And JOBD.CompanyID=FGD.CompanyID AND Isnull(JOBD.IsDeletedTransaction,0)=0  " &
                  "  INNER JOIN JobOrderBooking as JOB ON JOB.OrderBookingID=JOBD.OrderBookingID And JOB.CompanyID=JOBD.CompanyID   " &
                  "  INNER JOIN WarehouseMaster as WM ON WM.WarehouseID=FGD.WarehouseID And WM.CompanyID=FGD.CompanyID   " &
                  "  INNER JOIN ProductMaster as PM ON PM.ProductMasterID=FGD.ProductMasterID And FM.CompanyID=FD.CompanyID  AND Isnull(PM.IsDeletedTransaction,0)=0 " &
                  "  LEFT JOIN JobBookingJobCard as JBJ ON JBJ.JobBookingID=FGD.JobBookingID And JBJ.CompanyID=FGD.CompanyID  AND Isnull(JBJ.IsDeletedTransaction,0)=0 " &
                  "  LEFT JOIN JobBookingJobCardContents as JBJC ON JBJC.JobBookingJobCardContentsID=FGD.JobBookingJobCardContentsID And JBJC.JobBookingID=FGD.JobBookingID And JBJC.CompanyID=FGD.CompanyID   " &
                  "  LEFT JOIN ProductHSNMaster as PHM ON JBJ.ProductHSNID=PHM.ProductHSNID And JBJ.CompanyID=PHM.CompanyID   " &
                  "  Where FGD.ProductMasterID= '" & ProductMasterID & "' And FGD.CompanyID='" & GBLCompanyID & "'  " &
                  "  GROUP BY FGD.ParentFGTransactionID,FGD.CompanyID,FGD.SemiPackingMainID,FGD.SemiPackingDetailID,FGD.ParentFGTransactionDetailID,FGD.JobBookingID,FGD.JobBookingJobCardContentsID,FGD.ProductMasterID,FGD.OrderBookingID,FGD.OrderBookingDetailsID,FGD.WarehouseID,   " &
                  "  JOB.SalesOrderNo,JOBD.OrderBookingDate,JBJ.JobBookingNo,JBJ.JobBookingDate,PM.ProductMasterCode,JOBD.ProductCode,JBJ.JobName,Isnull(FD.InnerCarton,0),Isnull(FD.QuantityPerPack,0),Isnull(FD.CFT,0) ,Isnull(FD.CBCM,0) ,Isnull(FD.ShipperLengthCM,0),Isnull(FD.ShipperWidthCM,0),Isnull(FD.ShipperHeightCM,0),Isnull(FD.WeightPerOuterCarton,0),   " &
                  "  WM.WarehouseName,WM.WarehouseBinName,FM.VoucherNo,FM.VoucherDate,Isnull(PHM.GSTTaxPercentage,0),Isnull(PHM.CGSTTaxPercentage,0),Isnull(PHM.SGSTTaxPercentage,0),Isnull(PHM.IGSTTaxPercentage,0),NULLIF (PHM.HSNCode, ''),Isnull(JBJ.ProductHSNID,0)  " &
                  "  Having (Sum(Isnull(FGD.ReceiptQuantity,0))-Sum(Isnull(FGD.IssueQuantity,0)))>0"
        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Open Get Delivery Noter No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetNoteNO(ByVal prefix As String) As String

        Dim KeyField As String
        Dim MaxVoucherNo As Long

        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            KeyField = db.GeneratePrefixedNo("FinishGoodsTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And VoucherID=-51 And Isnull(IsDeletedTransaction,0)=0 ")
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    ''----------------------------Open PaaperPurchaseOrder  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveChallanDetail(ByVal prefix As String, ByVal jsonObjectsChallanDetyailmain As Object, ByVal jsonObjectsChallanDetyail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

        Dim dt As New DataTable
        Dim PONo As String
        Dim MaxPONo As Long
        Dim KeyField, str2, TransactionID, NumberToWord As String
        Dim AddColName, AddColValue, TableName As String
        Dim result As String
        AddColName = ""
        AddColValue = ""

        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName As String 'For Currency

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

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

            PONo = db.GeneratePrefixedNo("FinishGoodsTransactionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And VoucherID=-51 And Isnull(IsDeletedTransaction,0)=0 ")
            If (db.CheckAuthories("ChallanDetail.aspx", GBLUserID, GBLCompanyID, "CanSave", PONo) = False) Then Return "You are not authorized to save..!, Can't Save"

            Using UpdtTrans As New Transactions.TransactionScope

                TableName = "FinishGoodsTransactionMain"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherID,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "',-51,'" & prefix & "','" & MaxPONo & "','" & PONo & "','" & NumberToWord & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsChallanDetyailmain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    UpdtTrans.Dispose()
                    Return "fail " & TransactionID
                End If

                TableName = "FinishGoodsTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,FGTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                result = db.InsertDatatableToDatabase(jsonObjectsChallanDetyail, TableName, AddColName, AddColValue)
                If IsNumeric(result) = False Then
                    UpdtTrans.Dispose()
                    Return "fail " & result
                End If

                TableName = "FinishGoodsTransactionTaxes"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,FGTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                result = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(result) = False Then
                    UpdtTrans.Dispose()
                    Return "fail " & result
                End If

                KeyField = "Success"
                UpdtTrans.Complete()

            End Using
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open PurchaseOrder  Update Data  ------------------------------------------
    '<WebMethod(EnableSession:=True)>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Function UpdatePurchaseOrder(ByVal FGTransactionID As String, ByVal jsonObjectsChallanDetyailmain As Object, ByVal jsonObjectsChallanDetyail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

    '    Dim dt As New DataTable
    '    Dim KeyField, NumberToWord As String
    '    Dim AddColName, wherecndtn, TableName, AddColValue As String
    '    AddColName = ""

    'Dim dtCurrency As New DataTable 'For Currency
    'Dim CurrencyHeadName, CurrencyChildName As String 'For Currency

    '    GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    '    GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
    '    GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
    '    GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
    '    GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

    '    NumberToWord = ""
    'If CurrencyCode = "INR" Or CurrencyCode = "" Then
    '            CurrencyHeadName = ""
    '            CurrencyChildName = ""
    '            CurrencyCode = "INR"
    '            NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
    '        Else
    '            NumberToWord = ""
    '            str2 = ""
    '            str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where  CurrencyCode='" & CurrencyCode & "'"
    '            db.FillDataTable(dtCurrency, str2)
    '            Dim j As Integer = dtCurrency.Rows.Count
    'If j > 0 Then
    '                CurrencyHeadName = dtCurrency.Rows(0)(0)
    '                CurrencyChildName = dtCurrency.Rows(0)(1)
    '                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
    '            End If
    'End If



    '    Try
    '        Dim con As New SqlConnection
    '        con = db.OpenDataBase()
    '        Dim dtExist As New DataTable

    '        TableName = "ItemTransactionMain"
    '        AddColName = ""
    '        wherecndtn = ""
    '        AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "',AmountInWords='" & NumberToWord & "'"
    '        wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
    '        db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 1, wherecndtn)

    '        db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

    '        TableName = "ItemTransactionDetail"
    '        AddColName = ""
    '        AddColValue = ""
    '        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
    '        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
    '        db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

    '        db.ExecuteNonSQLQuery("Delete from ItemPurchaseOrderTaxes WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

    '        TableName = "ItemPurchaseOrderTaxes"
    '        AddColName = ""
    '        AddColValue = ""
    '        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
    '        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
    '        db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)

    '        db.ExecuteNonSQLQuery("Delete from ItemPurchaseDeliverySchedule WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

    '        TableName = "ItemPurchaseDeliverySchedule"
    '        AddColName = ""
    '        AddColValue = ""
    '        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
    '        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
    '        db.InsertDatatableToDatabase(jsonObjectsRecordSchedule, TableName, AddColName, AddColValue)

    '        db.ExecuteNonSQLQuery("Delete from ItemPurchaseOverheadCharges WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

    '        TableName = "ItemPurchaseOverheadCharges"
    '        AddColName = ""
    '        AddColValue = ""
    '        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
    '        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
    '        db.InsertDatatableToDatabase(jsonObjectsRecordOverHead, TableName, AddColName, AddColValue)

    '        db.ExecuteNonSQLQuery("Delete from ItemPurchaseRequisitionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

    '        TableName = "ItemPurchaseRequisitionDetail"
    '        AddColName = ""
    '        AddColValue = ""
    '        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
    '        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
    '        db.InsertDatatableToDatabase(jsonObjectsRecordRequisition, TableName, AddColName, AddColValue)


    '        con.Close()
    '        KeyField = "Success"

    '    Catch ex As Exception
    '        KeyField = "fail"
    '    End Try
    '    Return KeyField

    'End Function

    ''----------------------------Open ProcessPurchaseOrder Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteChallanDetail(ByVal TxtPOID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If (db.CheckAuthories("ChallanDetail.aspx", GBLUserID, GBLCompanyID, "CanDelete", TxtPOID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

        Try

            str = "Update FinishGoodsTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update FinishGoodsTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update FinishGoodsTransactionTaxes Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

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