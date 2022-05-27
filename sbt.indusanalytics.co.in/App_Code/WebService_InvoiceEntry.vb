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
Public Class WebService_InvoiceEntry
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

    Public Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
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

            str = "SELECT A.LedgerID, A.LedgerName, A.MailingName,A.LegalName, NULLIF (A.State, '') AS State, NULLIF (A.City, '') AS City, (SELECT TOP (1) StateTinNo FROM CountryStateMaster WHERE (State = A.State)) AS CompanyStateTinNo FROM LedgerMaster As A Where LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=24) And CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By MailingName"
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

            str = "Select A.[LedgerID] AS ConsigneeID,A.[LedgerName] As ConsigneeName,A.LegalName,Nullif(A.[State],'') As State,A.MailingName, Nullif(A.[City],'') As [City],(Select Top 1 StateTinNo From CountryStateMaster Where State=A.State And ISNULL(State,'')<>'') As CompanyStateTinNo From LedgerMaster As A Where LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=44) And A.RefClientID=" & ClientID & " And A.CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By MailingName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductHSNGroups(ByVal Category As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            str = "Select ProductHSNID,DisplayName As ProductHSNName,HSNCode,GSTTaxPercentage,CGSTTaxPercentage,SGSTTaxPercentage,IGSTTaxPercentage From ProductHSNMaster Where CompanyID=" & GBLCompanyID & " AND ProductCategory='" & Category & "' Order By ProductHSNName"
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
        str = "Select FGM.FGTransactionID,FGM.LedgerID,FGM.ConsigneeLedgerID,FGD.ProductMasterID,FGD.DeliveryOrderBookingID,FGD.DeliveryOrderBookingDetailsID,FGD.DeliveryOrderBookingDetailsID,   " &
               " FGM.Transporter,Isnull(FGD.DeliveryJobBookingID,0) As DeliveryJobBookingID,Isnull(FGD.DeliveryJobBookingJobCardContentsID,0) As DeliveryJobBookingJobCardContentsID,Isnull(FGM.MaxVoucherNo,0) As MaxVoucherNo,   " &
               " Nullif(FGM.VoucherNo,'') AS DeliveryNoteNo,replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-')  AS DeliveryNoteDate,Nullif(LM.LedgerName,'') AS ClientName,Nullif(CM.LedgerName,'') AS ConsigneeName,Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-')  As OrderBookingDate,Nullif(JB.JobBookingNo,'') AS JobBookingNo,   " &
               " Nullif(JOBD.ProductCode,'') AS ProductCode,Isnull(PHM.HSNCode,0) As HSNCode,Nullif(JB.JobName,'') AS JobName,SUM(Isnull(FGD.IssueOuterCarton,0)) AS TotalOuterCarton,SUM(Isnull(FGD.IssueQuantity,0)) AS TotalDeliveredQuantity,nullif(C.State,'') AS CompanyState,   " &
               " Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where FieldName='State' AND LedgerID=LM.LedgerID AND CompanyID=LM.CompanyID),'') AS ClientState,   " &
               " Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where FieldName='State' AND LedgerID=CM.LedgerID AND CompanyID=CM.CompanyID),'') AS ConsigneeState,C.StateTinNo   " &
               " From FinishGoodsTransactionMain AS FGM   " &
               " INNER JOIN FinishGoodsTransactionDetail as FGD ON FGM.FGTransactionID=FGD.FGTransactionID And FGM.CompanyID=FGD.CompanyID   And FGD.IsDeletedTransaction=0 " &
               " INNER JOIN JobOrderBooking as JOB ON FGD.DeliveryOrderBookingID=JOB.OrderBookingID AND FGD.CompanyID=JOB.CompanyID   And JOB.IsDeletedTransaction=0 " &
               " INNER JOIN JobOrderBookingDetails as JOBD ON FGD.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID And FGD.CompanyID=JOBD.CompanyID   " &
               " INNER JOIN LedgerMaster as LM ON FGM.LedgerID=LM.LedgerID AND FGM.CompanyID=LM.CompanyID   And LM.IsDeletedTransaction=0 " &
               " INNER JOIN CompanyMaster as C ON FGM.CompanyID=C.CompanyID   " &
               " Left Join ProductHSNMaster as PHM ON JOBD.ProductHSNID=PHM.ProductHSNID And JOBD.CompanyID=PHM.CompanyID  And PHM.IsDeletedTransaction=0 " &
               " LEFT JOIN LedgerMaster as CM ON FGM.ConsigneeLedgerID=CM.LedgerID AND FGM.CompanyID=CM.CompanyID   And CM.IsDeletedTransaction=0 " &
               " LEFT JOIN JobBookingJobCard as JB ON FGD.DeliveryJobBookingID=JB.JobBookingID And FGD.CompanyID=JB.CompanyID   And JB.IsDeletedTransaction=0 " &
               " LEFT JOIN ProductMaster as PM ON FGD.ProductMasterID=PM.ProductMasterID AND FGD.CompanyID=PM.CompanyID  And PM.IsDeletedTransaction=0  " &
               " Where FGM.VoucherID=-51 And Isnull(FGM.IsDeletedTransaction,0)=0 And FGM.CompanyID='" & GBLCompanyID & "'   " &
               " AND Not exists (Select Distinct FGTransactionID From InvoiceTransactionDetail Where Isnull(IsDeletedTransaction,0)=0 AND CompanyID='" & GBLCompanyID & "' AND FGTransactionID=FGM.FGTransactionID)   " &
               " GROUP BY JOBD.OrderBookingDate,FGM.VoucherDate,FGM.FGTransactionID,FGM.LedgerID,FGM.ConsigneeLedgerID,FGD.ProductMasterID,FGD.DeliveryOrderBookingID,FGD.DeliveryOrderBookingDetailsID,FGD.DeliveryOrderBookingDetailsID,   " &
               " FGM.Transporter,FGD.DeliveryJobBookingID,Isnull(FGD.DeliveryJobBookingJobCardContentsID,0),Isnull(FGM.MaxVoucherNo,0),   " &
               " Nullif(FGM.VoucherNo,''),Nullif(FGM.VoucherDate,''),Nullif(LM.LedgerName,''),Nullif(CM.LedgerName,''),Nullif(PM.ProductMasterCode,''),Nullif(JOB.SalesOrderNo,''),Nullif(JOBD.OrderBookingDate,''),Nullif(JB.JobBookingNo,''),   " &
               " Nullif(JOBD.ProductCode,''),Isnull(PHM.HSNCode,0),Nullif(JB.JobName,''),nullif(C.State,''),LM.LedgerID,CM.LedgerID,LM.CompanyID,CM.CompanyID,C.StateTinNo  " &
               " Order By Isnull(FGM.MaxVoucherNo,0)"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''----------------------------Open PopUpFirstGrid Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PopUpFirstGrid(ByVal TransactionIDString As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Isnull(FGM.FGTransactionID,0) AS FGTransactionID,Isnull(FGM.CompanyID,0) AS CompanyID,Isnull(FGD.DeliveryOrderBookingID,0) AS DeliveryOrderBookingID,Isnull(FGD.DeliveryOrderBookingDetailsID,0) AS DeliveryOrderBookingDetailsID,Isnull(FGD.DeliveryJobBookingID,0) AS DeliveryJobBookingID,Isnull(FGD.DeliveryJobBookingJobCardContentsID,0) AS DeliveryJobBookingJobCardContentsID,   " &
               " Isnull(FGD.ProductMasterID,0) As ProductMasterID,Isnull(JOBD.ProductHSNID,0) As ProductHSNID,Isnull(PHM.HSNCode,0) As HSNCode,Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,Nullif(JOBD.ProductCode,'') AS ProductCode,Nullif(JB.JobName,'') AS JobName,SUM(Isnull(FGD.IssueQuantity,0)) AS PurchaseQuantity,Isnull(JOBD.ChangeCost,0) AS PurchaseRate,NUllif(JOBD.RateType,'') AS PurchaseUnit,0 AS BasicAmount,0 AS TaxableAmount,  " &
               " Isnull(PHM.GSTTaxPercentage, 0) As GSTTaxPercentage,Isnull(PHM.CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(PHM.SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(PHM.IGSTTaxPercentage,0) As IGSTTaxPercentage,0 As CGSTAmt,0 As SGSTAmt,0 As IGSTAmt,0 As TotalAmount,Nullif(JOBD.PONo,'') AS PONo,replace(convert(nvarchar(30),JOBD.PODate,106),'','-') AS PODate,Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,  " &
               " replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-')  AS OrderBookingDate,replace(convert(nvarchar(30),JB.JobBookingDate,106),'','-') AS JobBookingDate,Nullif(FGM.VoucherNo,'') AS DeliveryNoteNo,replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-')  AS DeliveryNoteDate, JB.JobBookingNo, 0 As Disc, 0 As AfterDisAmt ,0 As FreeQuantity,'No' As IsService , FGD.IssueOuterCarton,FGD.InnerCarton" &
               " From FinishGoodsTransactionMain As FGM  " &
               " INNER Join FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID And FGM.CompanyID=FGD.CompanyID  And FGD.IsDeletedTransaction=0 " &
               " INNER Join JobOrderBooking as JOB ON FGD.DeliveryOrderBookingID=JOB.OrderBookingID And FGD.CompanyID=JOB.CompanyID  And JOB.IsDeletedTransaction=0 " &
               " INNER Join JobOrderBookingDetails as JOBD ON FGD.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID And FGD.CompanyID=JOBD.CompanyID  And JOBD.IsDeletedTransaction=0 " &
               " Left Join ProductHSNMaster as PHM ON JOBD.ProductHSNID=PHM.ProductHSNID And JOBD.CompanyID=PHM.CompanyID  And PHM.IsDeletedTransaction=0 " &
               " Left Join JobBookingJobCard as JB ON FGD.DeliveryJobBookingID=JB.JobBookingID And FGD.CompanyID=JB.CompanyID  And JB.IsDeletedTransaction=0 " &
               " Left Join ProductMaster as PM ON FGD.ProductMasterID=PM.ProductMasterID And FGD.CompanyID=PM.CompanyID  " &
               " Where FGM.VoucherID = -51 And Isnull(FGM.IsDeletedTransaction, 0) = 0 And FGM.CompanyID ='" & GBLCompanyID & "'  " &
               " And FGD.FGTransactionID IN(" & TransactionIDString & ")  " &
               " Group BY Isnull(FGM.FGTransactionID, 0),Isnull(FGM.CompanyID,0),Isnull(FGD.DeliveryOrderBookingID,0),Isnull(FGD.DeliveryOrderBookingDetailsID,0),Isnull(FGD.DeliveryJobBookingID,0),Isnull(FGD.DeliveryJobBookingJobCardContentsID,0),   " &
               " Isnull(FGD.ProductMasterID, 0),Isnull(JOBD.ProductHSNID,0),Isnull(PHM.HSNCode,0),Nullif(PM.ProductMasterCode,''),Nullif(JOBD.ProductCode,''),Nullif(JB.JobName,''),Isnull(JOBD.ChangeCost,0),NUllif(JOBD.RateType,''),Isnull(PHM.GSTTaxPercentage,0),Isnull(PHM.CGSTTaxPercentage,0),Isnull(PHM.SGSTTaxPercentage,0),Isnull(PHM.IGSTTaxPercentage,0),Nullif(JOBD.PONo,''),replace(convert(nvarchar(30),JOBD.PODate,106),'','-') ,Nullif(JOB.SalesOrderNo,''),  " &
               "replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') , JB.JobBookingNo ,replace(convert(nvarchar(30),JB.JobBookingDate,106),'','-'),Nullif(FGM.VoucherNo,''),replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') , FGD.IssueOuterCarton,FGD.InnerCarton" &
               " Order By Isnull(FGM.FGTransactionID, 0),Isnull(FGD.DeliveryOrderBookingID,0)"


        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    ''Get Currency Code List From Database
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SalesLedger() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select LedgerID,LedgerName,CM.StateTinNo From LedgerMaster As LM Inner Join CompanyMaster As CM On CM.CompanyID=LM.CompanyID Where Isnull(LM.IsDeletedTransaction,0)=0 AND LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=21 AND CompanyID='" & GBLCompanyID & "')"

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
        str = "Select JBC.JobBookingNo,Replace(ITD.JobName,'""','') As JobName,ITM.InvoiceTransactionID,ITM.LedgerID,ITM.ConsigneeLedgerID,ITM.SalesLedgerID,ITM.TotalTaxAmount,ITM.TotalBasicAmount,nullif(ITM.Narration,'') as Narration,ITM.MaxVoucherNo,ITM.VoucherNo AS InvoiceNo,replace(convert(nvarchar(30),ITM.VoucherDate,106),'','-') AS InvoiceDate,LM.LedgerName AS ClientName,CM.LedgerName AS ConsigneeName, PHM.DisplayName,PHM.ProductHSNName,PHM.HSNCode,FGM.VoucherNo As ChallanNo, ITD.Quantity, ITM.TotalQuantity,ITD.Rate,ITM.NetAmount,C.State AS CompanyState,C.StateTinNo,SLM.LedgerName AS SalesLedgerName,LM.State As ClientState ,ITM.IsDirectInvoice,ITM.IsLocked,ITM.IsInvoiceApproved,ITM.IsPostedInTally,  " &
               " ITM.DocumentType, ITM.IsExport, ITM.CurrencyCode, ITM.ShippedFrom, ITM.ShippedLedgerType, ITM.ShippedLedgerID, ITM.IGSTOnIntra, ITM.ReverseCharge, ITM.ECommerce, ITM.ECommerceLedgerID, ITM.OriginCountry, ITM.DestinationCountry, ITM.NotifyParty1,ITM.NotifyParty2Caption, ITM.NotifyParty2, ITM.LoadingPort, ITM.DischargePort, ITM.EPCGLicenceNo, ITM.REXRegistrationNo, ITM.BankerID, ITM.DeliveryTerms, ITM.PaymentTerms, ITM.NetWeight, ITM.GrossWeight, ITM.OtherRemarks, ITM.InvoiceReferenceNo, ITM.ContainerDescription, ITM.DBKRemarks, ITM.EWayBillNumber, replace(convert(nvarchar(30),ITM.EWayBillDate,106),'','-') As EWayBillDate, ITM.TransporterID, ITM.VehicleNo,ITM.TotalDistance " &
               " From InvoiceTransactionMain AS ITM  " &
               " INNER JOIN InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID=ITD.InvoiceTransactionID And ITM.CompanyID=ITD.CompanyID  And ITD.IsDeletedTransaction=0 " &
               " INNER JOIN LedgerMaster AS LM ON ITM.LedgerID=LM.LedgerID AND ITM.CompanyID=LM.CompanyID  And LM.IsDeletedTransaction=0 " &
               " INNER JOIN CompanyMaster as C ON ITM.CompanyID=C.CompanyID INNER JOIN ProductHSNMaster AS PHM ON PHM.ProductHSNID = ITD.ProductHSNID AND PHM.CompanyID = ITD.CompanyID AND PHM.IsDeletedTransaction = 0  " &
               " LEFT JOIN LedgerMaster AS CM ON ITM.ConsigneeLedgerID=CM.LedgerID AND ITM.CompanyID=CM.CompanyID  And CM.IsDeletedTransaction=0 " &
               " LEFT JOIN LedgerMaster AS SLM ON ITM.SalesLedgerID=SLM.LedgerID And ITM.CompanyID=SLM.CompanyID  And SLM.IsDeletedTransaction=0 " &
               " LEFT JOIN JobBookingJobCard AS JBC ON JBC.JobBookingID=ITD.JobBookingID And ITM.CompanyID=JBC.CompanyID And JBC.IsDeletedTransaction=0 " &
               " LEFT JOIN FinishGoodsTransactionMain AS FGM ON FGM.FGTransactionID = ITD.FGTransactionID AND FGM.JobBookingID = ITD.JobBookingID AND ITD.CompanyID = FGM.CompanyID AND FGM.IsDeletedTransaction = 0 " &
               " Where ITM.IsDeletedTransaction=0 AND ITM.CompanyID='" & GBLCompanyID & "'  " &
               " Order By InvoiceTransactionID DESC"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDataAfterEdit(ByVal TxtCHDID As String, ByVal DirectInvoice As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = " INNER JOIN"
        If DirectInvoice = True Then
            str = " LEFT JOIN"
        End If
        str = "Select Isnull(ITD.FGTransactionID,0) AS FGTransactionID,Isnull(ITD.CompanyID,0) AS CompanyID,Isnull(ITD.ProductMasterID,0) AS ProductMasterID,Isnull(ITD.ProductHSNID,0) AS ProductHSNID,Isnull(PHM.HSNCode,0) As HSNCode,  " &
               " Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,Nullif(JOBD.ProductCode,'') AS ProductCode,Nullif(ITD.JobName,'') AS JobName,Isnull(ITD.Quantity,0) AS PurchaseQuantity,Isnull(ITD.Rate,0) AS PurchaseRate,Isnull(ITD.RateType,0) AS PurchaseUnit,  " &
               " Isnull(ITD.BasicAmount,0) AS BasicAmount,0 AS Disc,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,Isnull(ITD.TaxableAmount,0) AS TaxableAmount,Isnull(ITD.GSTPercentage,0) AS GSTTaxPercentage,Isnull(ITD.CGSTPercentage,0) AS CGSTTaxPercentage,Isnull(ITD.SGSTPercentage,0) AS SGSTTaxPercentage,Isnull(ITD.IGSTPercentage,0) AS IGSTTaxPercentage,  " &
               " Isnull(ITD.CGSTAmount,0) AS CGSTAmt,Isnull(ITD.SGSTAmount,0) AS SGSTAmt,Isnull(ITD.IGSTAmount,0) AS IGSTAmt,Isnull(ITD.GrossAmount,0) AS TotalAmount,Nullif(JOB.PONo,'') AS PONo,  " &
               " replace(convert(nvarchar(30),JOB.PODate,106),'','-') AS PODate,Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,  " &
               " replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') AS OrderBookingDate,Nullif(JB.JobBookingNo,'') AS JobBookingNo,  " &
               " replace(convert(nvarchar(30),JB.JobBookingDate,106),'','-') AS JobBookingDate,Nullif(FGM.VoucherNo,'') AS DeliveryNoteNo,  " &
               " replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') AS DeliveryNoteDate,Isnull(ITD.BasicAmount,0)-Isnull(ITD.DiscountAmount,0) AS AfterDisAmt, ITD.DiscountAmount, " &
               " Isnull(ITD.OrderBookingID,0) AS DeliveryOrderBookingID,Isnull(ITD.OrderBookingDetailsID,0) AS DeliveryOrderBookingDetailsID,Isnull(ITD.JobBookingID,0) AS DeliveryJobBookingID,Isnull(ITD.JobBookingJobCardContentsID,0) AS DeliveryJobBookingJobCardContentsID  " &
               " From InvoiceTransactionMain AS ITM  " &
               " INNER JOIN InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID=ITD.InvoiceTransactionID AND ITM.CompanyID=ITD.CompanyID  And ITD.IsDeletedTransaction=0 " &
               str & " FinishGoodsTransactionMain AS FGM ON ITD.FGTransactionID=FGM.FGTransactionID And ITD.CompanyID=FGM.CompanyID  And FGM.IsDeletedTransaction=0 " &
               str & " JobOrderBooking AS JOB ON ITD.OrderBookingID=JOB.OrderBookingID AND ITD.CompanyID=JOB.CompanyID  " &
               str & " JobOrderBookingDetails AS JOBD ON ITD.OrderBookingDetailsID=JOBD.OrderBookingDetailsID And ITD.OrderBookingID=JOBD.OrderBookingID And ITD.CompanyID=JOBD.CompanyID  " &
               " LEFT JOIN ProductHSNMaster as PHM ON ITD.ProductHSNID=PHM.ProductHSNID And JOBD.CompanyID=PHM.CompanyID  And PHM.IsDeletedTransaction=0 " &
               " LEFT JOIN JobBookingJobCard AS JB ON ITD.JobBookingID=JB.JobBookingID AND ITD.CompanyID=JB.CompanyID  And JB.IsDeletedTransaction=0 " &
               " LEFT JOIN ProductMaster AS PM ON ITD.ProductMasterID=PM.ProductMasterID And ITD.CompanyID=PM.CompanyID  " &
               " Where ITM.InvoiceTransactionID='" & TxtCHDID & "' AND Isnull(ITM.IsDeletedTransaction,0)=0 AND ITM.CompanyID='" & GBLCompanyID & "'   " &
               " Order By ITD.TransID"

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
        str = "Select Nullif(LM.LedgerName,'') AS LedgerName,Isnull(IT.TaxPercentage,0) AS TaxRatePer,Isnull(IT.CalculatedON,0) AS CalculateON,Isnull(IT.GSTApplicable,0) AS GSTApplicable,  " &
               " Isnull(IT.TaxInAmount,0) As InAmount,Isnull(IT.Amount,0) As ChargesAmount,Isnull(IT.IsComulative,0) As IsCumulative,Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where LedgerID=LM.LedgerID AND CompanyID=LM.CompanyID AND FieldName='TaxType'),'') AS TaxType,Nullif((Select Isnull(FieldValue,'') From LedgerMasterDetails Where LedgerID=LM.LedgerID AND CompanyID=LM.CompanyID AND FieldName='GSTLedgerType'),'') AS GSTLedgerType,Nullif(IT.LedgerID,'') AS LedgerID  " &
               " From InvoiceTransactionTaxes AS IT INNER JOIN LedgerMaster AS LM ON IT.LedgerID=LM.LedgerID AND IT.CompanyID=LM.CompanyID  " &
               " Where IT.InvoiceTransactionID='" & TxtCHDID & "' And IT.CompanyID='" & GBLCompanyID & "'  And Upper(LM.LedgerName)<>'ROUNDOFF' And IT.IsDeletedTransaction=0 " &
               " Order By IT.TransID"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function StockDetail(ByVal FGTransactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Isnull(FGM.FGTransactionID,0) AS FGTransactionID,Isnull(FGM.LedgerID,0) AS LedgerID,Isnull(FGD.DeliveryOrderBookingID,0) AS OrderBookingID,Isnull(FGD.DeliveryOrderBookingDetailsID,0) AS OrderBookingDetailsID,Isnull(FGD.ProductMasterID,0) AS ProductMasterID,Isnull(FGD.DeliveryJobBookingID,0) AS JobBookingID,Isnull(FGM.MaxVoucherNo,0) AS MaxDNNo,Nullif(FGM.VoucherNo,'') AS DeliveryNoteNo,  " &
              " replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-')  AS DeliveryNoteDate,  " &
              " Nullif(JOB.SalesOrderNo,'') AS SalesOrderNo,replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') AS OrderBookingDate,Nullif(JBJ.JobBookingNo,'') AS JobBookingNo,Sum(Isnull(FGD.IssueOuterCarton,0)) AS TotalDeliveredOuterCarton,Sum(Isnull(FGD.IssueQuantity,0)) AS TotalDeliveredQuantity  " &
              " From FinishGoodsTransactionMain AS FGM  " &
              " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID AND FGM.CompanyID=FGD.CompanyID  " &
              " INNER JOIN JobOrderBooking AS JOB ON FGD.DeliveryOrderBookingID=JOB.OrderBookingID And FGD.CompanyID=JOB.CompanyID  " &
              " INNER JOIN JobOrderBookingDetails AS JOBD ON FGD.DeliveryOrderBookingDetailsID=JOBD.OrderBookingDetailsID AND FGD.DeliveryOrderBookingID=JOBD.OrderBookingID  AND FGD.CompanyID=JOBD.CompanyID  " &
              " LEFT JOIN JobBookingJobCard AS JBJ ON FGD.DeliveryJobBookingID=JBJ.JobBookingID And FGD.CompanyID=JBJ.CompanyID  " &
              " Where FGM.CompanyID='" & GBLCompanyID & "' AND Isnull(FGM.IsDeletedTransaction,0)=0 AND FGM.FGTransactionID='" & FGTransactionID & "'  " &
              " GROUP BY Isnull(FGM.FGTransactionID,0),Isnull(FGM.LedgerID,0),Isnull(FGD.DeliveryOrderBookingID,0),Isnull(FGD.DeliveryOrderBookingDetailsID,0),Isnull(FGD.ProductMasterID,0),Isnull(FGD.DeliveryJobBookingID,0),Isnull(FGM.MaxVoucherNo,0),Nullif(FGM.VoucherNo,''),replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') ,  " &
              " Nullif(JOB.SalesOrderNo,''),replace(convert(nvarchar(30),JOBD.OrderBookingDate,106),'','-') ,Nullif(JBJ.JobBookingNo,'')"
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
        str = " Select Isnull(FGM.FGTransactionID,0) as FGTransactionID,nullif(FGM.DeliveryNoteNo,'') as DeliveryNoteNo, " &
                " replace(convert(nvarchar(30),FGM.DeliveryNoteDate,106),'','-') as DeliveryNoteDate,nullif(JBJ.JobBookingNo,'') as JobBookingNo, " &
                " replace(convert(nvarchar(30),JBJ.JobBookingDate,106),'','-') as JobBookingDate,nullif(JBJC.JobCardContentNo,'') as JobCardContentNo,isnull(JBJC.PlanContQty,0) AS OrderQuantity, " &
                " ISNULL(Sum(ISNULL(FGD.IssueOuterCarton,0)),0) As Total_Box,ISNULL(Sum(ISNULL(FGD.IssueQuantity,0)),0) As TotalQty,ROUND(ISNULL(Sum(ISNULL(FGD.IssueTotalWeight,0)),0),2) As TotalWt    " &
                " From FinishGoodsTransactionMain AS FGM " &
                " INNER JOIN FinishGoodsTransactionDetail AS FGD ON FGM.FGTransactionID=FGD.FGTransactionID AND FGM.CompanyID=FGD.CompanyID " &
                " LEFT JOIN JobBookingJobCardContents AS JBJC ON JBJC.JobBookingJobCardContentsID=FGD.JobBookingJobCardContentsID AND JBJC.JobBookingID=FGD.JobBookingID AND JBJC.CompanyID=FGD.CompanyID " &
                " LEFT JOIN JobBookingJobCard AS JBJ ON JBJC.JobBookingID=JBJ.JobBookingID AND JBJC.CompanyID=JBJ.CompanyID " &
                " Where FGM.VoucherID=-51 AND FGM.CompanyID='" & GBLCompanyID & "' AND FGD.JobBookingID IN(" & JobBokingIdString & ") " &
                " GROUP BY FGM.FGTransactionID,FGM.DeliveryNoteNo,FGM.DeliveryNoteDate,JBJ.JobBookingNo,JBJ.JobBookingDate,JBJC.JobCardContentNo,JBJC.PlanContQty"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Get Delivery Noter No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetNoteNO(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            KeyField = db.GenerateInvoiceNo("InvoiceTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And VoucherID=-3 And IsDeletedTransaction=0 ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    ''----------------------------Open Invoice Detail  Save Data  ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveInvoiceDetail(ByVal prefix As String, ByVal jsonObjectsInvoicemain As Object, ByVal jsonObjectsInvoiceDetyail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

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

            PONo = db.GenerateInvoiceNo("InvoiceTransactionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And VoucherID=-3 And IsDeletedTransaction=0")
            If (db.CheckAuthories("InvoiceEntryNew.aspx", GBLUserID, GBLCompanyID, "CanSave", PONo) = False) Then Return "You are not authorized to save..!, Can't Save"
            Using updtTran As New Transactions.TransactionScope

                TableName = "InvoiceTransactionMain"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherID,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "',-3,'" & prefix & "','" & MaxPONo & "','" & PONo & "','" & NumberToWord & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsInvoicemain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    updtTran.Dispose()
                    Return "Error:Main:- " & TransactionID
                End If

                TableName = "InvoiceTransactionDetail"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,InvoiceTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
                result = db.InsertDatatableToDatabase(jsonObjectsInvoiceDetyail, TableName, AddColName, AddColValue)
                If IsNumeric(result) = False Then
                    updtTran.Dispose()
                    Return "Error:Details:- " & result
                End If

                TableName = "InvoiceTransactionTaxes"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,InvoiceTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
                result = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(result) = False Then
                    updtTran.Dispose()
                    Return "Error:Tax:- " & result
                End If

                If jsonObjectsInvoicemain(0)("RoundOffTax") <> 0 Then
                    Dim RoundOffLedgerID As String = 0
                    RoundOffLedgerID = db.GetColumnValue("LedgerID", "LedgerMaster", " Isnull(IsDeletedTransaction,0)=0 AND Upper(LedgerName)='ROUNDOFF' And LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=43 AND CompanyID='" & GBLCompanyID & "')")
                    db.ExecuteNonSQLQuery("Insert Into InvoiceTransactionTaxes(CreatedDate,UserID,CompanyID,FYear,CreatedBy,InvoiceTransactionID, TransID, LedgerID, Amount, TaxInAmount)" &
                                          " Select '" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'," & jsonObjectsRecordTax.length & "," & RoundOffLedgerID & "," & jsonObjectsInvoicemain(0)("RoundOffTax") & ",1")
                End If

                KeyField = "Success"
                updtTran.Complete()
            End Using

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open PurchaseOrder  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateInvoice(ByVal TxtInvoceTransactionID As String, ByVal jsonObjectsInvoicemain As Object, ByVal jsonObjectsInvoiceDetyail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String, ByVal CurrencyCode As String) As String

        Dim dt As New DataTable
        Dim KeyField, str2, NumberToWord As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName As String 'For Currency

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If (db.CheckAuthories("InvoiceEntryNew.aspx", GBLUserID, GBLCompanyID, "CanEdit", TxtInvoceTransactionID) = False) Then Return "You are Not authorized to edit..!, Can't Edit"

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

            Using updtTran As New Transactions.TransactionScope

                TableName = "InvoiceTransactionMain"
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "',AmountInWords='" & NumberToWord & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And InvoiceTransactionID='" & TxtInvoceTransactionID & "' "
                KeyField = db.UpdateDatatableToDatabase(jsonObjectsInvoicemain, TableName, AddColName, 0, wherecndtn)
                If KeyField <> "Success" Then
                    updtTran.Dispose()
                    Return "Error:Main:- " & KeyField
                End If

                db.ExecuteNonSQLQuery("Delete from InvoiceTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and InvoiceTransactionID='" & TxtInvoceTransactionID & "' ")

                TableName = "InvoiceTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,InvoiceTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TxtInvoceTransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsInvoiceDetyail, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updtTran.Dispose()
                    Return "Error:Details:- " & KeyField
                End If

                db.ExecuteNonSQLQuery("Delete from InvoiceTransactionTaxes WHERE CompanyID='" & GBLCompanyID & "' and InvoiceTransactionID='" & TxtInvoceTransactionID & "' ")

                TableName = "InvoiceTransactionTaxes"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,InvoiceTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TxtInvoceTransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    updtTran.Dispose()
                    Return "Error:Tax:- " & KeyField
                End If

                If jsonObjectsInvoicemain(0)("RoundOffTax") <> 0 Then
                    Dim RoundOffLedgerID As String = 0
                    RoundOffLedgerID = db.GetColumnValue("LedgerID", "LedgerMaster", " Isnull(IsDeletedTransaction,0)=0 AND Upper(LedgerName)='ROUNDOFF' And LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=43 AND CompanyID='" & GBLCompanyID & "')")
                    db.ExecuteNonSQLQuery("Insert Into InvoiceTransactionTaxes(CreatedDate,UserID,CompanyID,FYear,CreatedBy,InvoiceTransactionID, TransID, LedgerID, Amount, TaxInAmount)" &
                                          " Select '" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TxtInvoceTransactionID & "'," & jsonObjectsRecordTax.length & "," & RoundOffLedgerID & "," & jsonObjectsInvoicemain(0)("RoundOffTax") & ",1")
                End If
                KeyField = "Success"
                updtTran.Complete()

            End Using
        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField
    End Function

    ''----------------------------Open ProcessPurchaseOrder Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteInvoice(ByVal TxtPOID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If (db.CheckAuthories("InvoiceEntryNew.aspx", GBLUserID, GBLCompanyID, "CanDelete", TxtPOID) = False) Then Return "You are not authorized to delete..!, Can't Delete"
        If db.IsDeletable("IsDespatchFreightEntryDone", "InvoiceTransactionMain", " Where IsPostedInTally=1 And InvoiceTransactionID " & TxtPOID & " And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID) = False Then
            Return "Invoice posted in tally , Can't Delete"
        End If
        Try

            str = "Update InvoiceTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and InvoiceTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update InvoiceTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and InvoiceTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update InvoiceTransactionTaxes Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and InvoiceTransactionID='" & TxtPOID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProcessInvoiceList() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select JBC.JobBookingNo,Replace(Nullif(ITD.JobName,''),'""','') As JobName,ITM.InvoiceTransactionID,ITM.LedgerID,ITM.ConsigneeLedgerID,  " &
               " Isnull(ITM.SalesLedgerID,0) As SalesLedgerID,isnull(ITM.TotalTaxAmount,0) as TotalTaxAmount,isnull(ITM.TotalBasicAmount,0) as TotalBasicAmount,nullif(ITM.Narration,'') as Narration,  " &
               " Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,Nullif(ITM.VoucherNo,'') AS InvoiceNo,replace(convert(nvarchar(30),ITM.VoucherDate,106),'','-') AS InvoiceDate,Nullif(LM.LedgerName,'') AS ClientName,Nullif(CM.LedgerName,'') AS ConsigneeName,  " &
               " PHM.DisplayName,PHM.ProductHSNName,PHM.HSNCode,FGM.VoucherNo As ChallanNo, ITD.Quantity, Isnull(ITM.TotalQuantity,0) AS TotalQuantity,ITD.Rate,Isnull(ITM.NetAmount,0) AS NetAmount,Isnull(C.State,0) AS CompanyState,C.StateTinNo,Nullif(SLM.LedgerName,'') AS SalesLedgerName,(Select FieldValue From LedgerMasterDetails Where LedgerID=LM.LedgerID And CompanyID=LM.CompanyID And ISNULL(IsDeletedTransaction,0)=0 And FieldName='State') As ClientState ,ITM.IsDirectInvoice,ITM.IsLocked,ITM.IsInvoiceApproved,ITM.IsPostedInTally " &
               " From InvoiceTransactionMain AS ITM  " &
               " INNER JOIN InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID=ITD.InvoiceTransactionID And ITM.CompanyID=ITD.CompanyID  And ITD.IsDeletedTransaction=0 " &
               " INNER JOIN LedgerMaster AS LM ON ITM.LedgerID=LM.LedgerID AND ITM.CompanyID=LM.CompanyID  And LM.IsDeletedTransaction=0 " &
               " INNER JOIN CompanyMaster as C ON ITM.CompanyID=C.CompanyID INNER JOIN ProductHSNMaster AS PHM ON PHM.ProductHSNID = ITD.ProductHSNID AND PHM.CompanyID = ITD.CompanyID AND PHM.IsDeletedTransaction = 0  " &
               " LEFT JOIN LedgerMaster AS CM ON ITM.ConsigneeLedgerID=CM.LedgerID AND ITM.CompanyID=CM.CompanyID  And CM.IsDeletedTransaction=0 " &
               " LEFT JOIN LedgerMaster AS SLM ON ITM.SalesLedgerID=SLM.LedgerID And ITM.CompanyID=SLM.CompanyID  And SLM.IsDeletedTransaction=0 " &
               " LEFT JOIN JobBookingJobCard AS JBC ON JBC.JobBookingID=ITD.JobBookingID And ITM.CompanyID=JBC.CompanyID And JBC.IsDeletedTransaction=0 " &
               " LEFT JOIN FinishGoodsTransactionMain AS FGM ON FGM.FGTransactionID = ITD.FGTransactionID AND FGM.JobBookingID = ITD.JobBookingID AND ITD.CompanyID = FGM.CompanyID AND FGM.IsDeletedTransaction = 0 " &
               " Where Isnull(ITM.IsDeletedTransaction,0)=0 AND ITM.CompanyID='" & GBLCompanyID & "'  " &
               " Order By InvoiceTransactionID DESC"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function InvoiceEntryApproval(ByVal InvoiceID As Integer, ByVal IsApprove As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            If (db.CheckAuthories("InvoiceApproval.aspx", GBLUserID, GBLCompanyID, "CanSave", InvoiceID) = False) Then Return "You are not authorized to Approve..!, Can't Approve"
            If IsApprove = False Then
                If (db.CheckAuthories("InvoiceApproval.aspx", GBLUserID, GBLCompanyID, "CanEdit", InvoiceID) = False) Then Return "You are not authorized to unapprove..!, Can't UnApprove"
                If db.IsDeletable("IsDespatchFreightEntryDone", "InvoiceTransactionMain", " Where IsPostedInTally=1 And InvoiceTransactionID " & InvoiceID & " And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID) = False Then
                    Return "Invoice posted in tally , Can't Unapprove"
                End If
            End If

            db.ExecuteNonSQLQuery("Update InvoiceTransactionMain Set IsInvoiceApproved='" & IsApprove & "',InvoiceApprovedBy=" & GBLUserID & ",InvoiceApprovedDate=Getdate() Where InvoiceTransactionID=" & InvoiceID & " And CompanyID=" & GBLCompanyID)
            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCurrencyCode() As String
        str = "Select Distinct CurrencyCode,CurrencyName From CurrencyMaster"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCountryList() As String
        str = "Select Distinct Country,CountryCode From CountryStateMaster Where IsDeletedTransaction=0 Order by Country"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPortsList() As String
        str = "Select Distinct PortName,PortName From PortMaster"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetShippedFromLedger(ByVal value As String) As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))

        If value = "Supplier" Then
            str = "Select Distinct LedgerName,LegalName,LedgerID,MailingName From LedgerMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " AND LedgerGroupID IN (Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=23) Order by LegalName"
        ElseIf value = "Vendor" Then
            str = "Select Distinct LedgerName,LegalName,LedgerID,MailingName From LedgerMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " AND LedgerGroupID IN (Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=25) Order by LegalName"
        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateJsonFile(ByVal TxtCHDID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim DTTranDtls, DTDocDtls, DTSellerDtls, DTBuyerDtls, DTShippedDtls, DTValDtls, DTRefDtls, DTItemList As New DataTable

        str = "SELECT DISTINCT 'GST' AS TaxSch, LM.SupplyTypeCode AS SupTyp, LEFT(ITM.IGSTOnIntra,1) AS IgstOnIntra, LEFT(ITM.ReverseCharge,1) AS RegRev, Case When Isnull(ITM.ECommerce,'No')='No' Then '' Else ECM.GSTNo End AS EcmGstin FROM InvoiceTransactionMain AS ITM INNER JOIN LedgerMaster AS LM ON LM.LedgerID = ITM.LedgerID AND LM.CompanyID = ITM.CompanyID Left Join LedgerMaster AS ECM ON ECM.LedgerID = ITM.ECommerceLedgerID AND ECM.CompanyID = ITM.CompanyID Where ITM.InvoiceTransactionID=" & TxtCHDID & " And ITM.CompanyID=" & GBLCompanyID
        db.FillDataTable(DTTranDtls, str)
        str = "Select DocumentType As Typ,CONVERT(nvarchar(16), MaxVoucherNo) As No,format(VoucherDate,'dd/MM/yyyy') As Dt From InvoiceTransactionMain Where InvoiceTransactionID=" & TxtCHDID & " And CompanyID=" & GBLCompanyID
        db.FillDataTable(DTDocDtls, str)
        str = "SELECT DISTINCT LM.GSTNo AS Gstin, Upper(LM.LegalName) AS LglNm, LM.Address1 AS Addr1, LM.Address2 AS Addr2, LM.City AS Loc, CONVERT(bigint, LM.Pincode) AS Pin, CSM.StateTinNo AS Stcd, LM.MobileNo AS Ph, LM.Email AS Em FROM LedgerMaster AS LM INNER JOIN CountryStateMaster AS CSM ON LM.State = CSM.State AND Isnull(CSM.StateTinNo,'') <> '' AND LM.LegalName =(SELECT DISTINCT CompanyName FROM CompanyMaster Where CompanyID = " & GBLCompanyID & ") And LM.IsDeletedTransaction=0 And LM.CompanyID = " & GBLCompanyID
        db.FillDataTable(DTSellerDtls, str)
        str = "Select Distinct LM.GSTNo As Gstin,LM.LegalName As LglNm,CSM.StateTinNo As Pos,LM.Address1 As Addr1,LM.Address2 As Addr2,LM.City As Loc,CONVERT(bigint, LM.Pincode) As Pin,CSM.StateTinNo As Stcd,LM.MobileNo As Ph,LM.Email As Em From LedgerMaster As LM Inner Join CountryStateMaster As CSM On LM.State=CSM.State And LM.CompanyID=CSM.CompanyID And Isnull(CSM.StateTinNo,'')<>'' Inner Join InvoiceTransactionMain As ITM On LM.LedgerID=ITM.LedgerID And LM.CompanyID=ITM.CompanyID And ITM.InvoiceTransactionID=" & TxtCHDID & " And LM.CompanyID=" & GBLCompanyID
        db.FillDataTable(DTBuyerDtls, str)
        str = "Select Distinct LM.GSTNo As Gstin,LM.LegalName As LglNm,LM.Address1 As Addr1,LM.Address2 As Addr2,LM.City As Loc,CONVERT(bigint, LM.Pincode) As Pin,CSM.StateTinNo As Stcd,LM.MobileNo As Ph,LM.Email As Em From LedgerMaster As LM Inner Join CountryStateMaster As CSM On LM.State=CSM.State And LM.CompanyID=CSM.CompanyID And Isnull(CSM.StateTinNo,'')<>'' Inner Join InvoiceTransactionMain As ITM On LM.LedgerID=ITM.ConsigneeLedgerID And LM.CompanyID=ITM.CompanyID And ITM.InvoiceTransactionID=" & TxtCHDID & " And LM.CompanyID=" & GBLCompanyID
        db.FillDataTable(DTShippedDtls, str)
        str = "SELECT Distinct  TotalBasicAmount As AssVal,TotalIGSTTaxAmount As IgstVal, TotalCGSTTaxAmount As CgstVal, TotalSGSTTaxAmount As SgstVal,TotalCessAmount As CesVal,TotalStCessAmount As StCesVal, TotalDiscountAmount As Discount,0 As OthChrg,RoundOffTax As RndOffAmt, NetAmount As TotInvVal FROM InvoiceTransactionMain Where InvoiceTransactionID=" & TxtCHDID & " And CompanyID=" & GBLCompanyID
        db.FillDataTable(DTValDtls, str)
        str = "SELECT Distinct InvoiceReferenceNo As InvRm,PONo As PORefr,format(PODate ,'dd/MM/yyyy') As PORefDt FROM InvoiceTransactionMain Where InvoiceTransactionID=" & TxtCHDID & " And CompanyID=" & GBLCompanyID
        db.FillDataTable(DTRefDtls, str)
        str = "SELECT DISTINCT CONVERT(nvarchar(8), ITD.TransID) As SlNo, ITD.JobName As PrdDesc, LEFT(ITD.IsService,1) As IsServc, PHM.HSNCode As HsnCd, ITD.Quantity As Qty,ITD.FreeQuantity As FreeQty, Case When ITD.RateType='UnitCost' Then 'UNT' When ITD.RateType ='UnitThCost' Then 'THD' Else 'NOS' End As Unit,ITD.Rate As UnitPrice, ITD.BasicAmount As TotAmt,ITD.DiscountAmount As Discount, 0 As PreTaxVal,ITD.TaxableAmount As AssAmt, ITD.GSTPercentage As GstRt, ITD.IGSTAmount As IgstAmt, ITD.CGSTAmount As CgstAmt, ITD.SGSTAmount As SgstAmt,0 As CesRt, 0 As CesAmt, 0 As CesNonAdvlAmt, 0 As StateCesRt, 0 As StateCesAmt, 0 As StateCesNonAdvlAmt, 0 As OthChrg, ITD.GrossAmount As TotItemVal " &
                " FROM InvoiceTransactionMain AS ITM INNER JOIN  InvoiceTransactionDetail AS ITD ON ITM.InvoiceTransactionID = ITD.InvoiceTransactionID AND ITM.CompanyID = ITD.CompanyID INNER JOIN ProductHSNMaster AS PHM ON ITD.ProductHSNID = PHM.ProductHSNID AND ITD.CompanyID = PHM.CompanyID " &
                " WHERE (ITM.InvoiceTransactionID = " & TxtCHDID & ")  And ITM.CompanyID=" & GBLCompanyID
        db.FillDataTable(DTItemList, str)

        DTTranDtls.TableName = "TranDtls"
        DTDocDtls.TableName = "DocDtls"
        DTSellerDtls.TableName = "SellerDtls"
        DTBuyerDtls.TableName = "BuyerDtls"
        DTValDtls.TableName = "ValDtls"
        DTRefDtls.TableName = "RefDtls"
        DTItemList.TableName = "ItemList"
        DTShippedDtls.TableName = "ShippedDtls"

        Dim Dataset As New DataSet

        Dataset.Merge(DTTranDtls)
        Dataset.Merge(DTDocDtls)
        Dataset.Merge(DTSellerDtls)
        Dataset.Merge(DTBuyerDtls)
        Dataset.Merge(DTValDtls)
        Dataset.Merge(DTRefDtls)
        Dataset.Merge(DTItemList)
        Dataset.Merge(DTShippedDtls)

        data.Message = db.ConvertDataSetsTojSonString(Dataset)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateInvoiceDetails(ByVal TxtInvoceTransactionID As Integer, ByVal jsonObjectsInvoicemain As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If (db.CheckAuthories("InvoiceEntryNew.aspx", GBLUserID, GBLCompanyID, "CanEdit", TxtInvoceTransactionID) = False) Then Return "You are Not authorized to edit..!, Can't Edit"

        Try
            Using updtTran As New Transactions.TransactionScope
                TableName = "InvoiceTransactionMain"
                AddColName = ""
                wherecndtn = "CompanyID=" & GBLCompanyID & " And InvoiceTransactionID=" & TxtInvoceTransactionID & ""
                KeyField = db.UpdateDatatableToDatabase(jsonObjectsInvoicemain, TableName, AddColName, 0, wherecndtn)
                If KeyField <> "Success" Then
                    updtTran.Dispose()
                    Return "Error:Main:- " & KeyField
                End If
                updtTran.Complete()
            End Using
        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField
    End Function

    '---------------Close Invoice code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class