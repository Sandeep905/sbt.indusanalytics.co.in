Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection
Imports System.Net.Mail
Imports System.Net

Partial Class ReportPurchaseOrder
    Inherits System.Web.UI.Page
    Dim db As New DBConnection
    'Dim GBLCompanyID As String = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
    Dim GBLCompanyID, TransactionID, PrintType, TblPrefix, VoucherID, GBLUserID As String

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            'reset
            TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))
            PrintType = Convert.ToString(HttpContext.Current.Request.QueryString("PrintType"))
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            Dim Str As String
            If PrintType = "Other" Then
                TblPrefix = "Other"
                VoucherID = -10
                If (db.CheckAuthories("OtherPurchaseOrderApproval.aspx", GBLUserID, GBLCompanyID, "CanPrint", TransactionID) = False) Then
                    MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
                    Exit Sub
                End If
            Else
                TblPrefix = ""
                VoucherID = -11
                If (db.CheckAuthories("PurchaseOrderApproval.aspx", GBLUserID, GBLCompanyID, "CanPrint", TransactionID) = False) Then
                    MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
                    Exit Sub
                End If
            End If
            'Header Data
            Dim dsCustomers1 As DataTable = GetData("Select distinct Isnull(ITM.NetAmount,0) as NetAmount,Isnull(ITM.TotalOverHeadAmount,0) as TotalOverHeadAmount,Isnull(ITM.AmountInWords,0) as AmountInWords,NullIf(CM.CompanyName,'') AS CompanyName,NullIf(CM.GSTIN,'') AS GSTIN,CM.Address As CompanyAddress,NullIf(CM.State,'') as CompanyState,   " &
                                                    " NullIf(LM.GSTNo,'') AS GSTNo,LM.MailingAddress As SuppAddress    " &
                                                    " ,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID,    " &
                                                    " 0 AS TransID,0 AS ItemID, 0 As ItemGroupID,NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,  " &
                                                    " NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,    " &
                                                    " NullIf('','') AS ItemCode,NullIf('','') AS ItemName,NullIf('','') AS ItemDescription,    " &
                                                   "  ROUND(SUM(Isnull(ITD.PurchaseOrderQuantity, 0)), 2) As PurchaseQuantity, Nullif('','') AS PurchaseUnit,0 AS PurchaseRate,   " &
                                                   "  ROUND(SUM(Isnull(ITD.GrossAmount, 0)), 2) As GrossAmount, 0 As DiscountAmount, ROUND(SUM(Isnull(ITD.BasicAmount, 0)), 2) As BasicAmount,   " &
                                                   "  0 AS GSTPercentage,ROUND((SUM(Isnull(ITD.CGSTAmount,0))+SUM(Isnull(ITD.SGSTAmount,0))+SUM(Isnull(ITD.IGSTAmount,0))),2) AS   " &
                                                   "  GSTTaxAmount, ROUND(SUM(Isnull(ITD.NetAmount, 0)), 2) As NetAmount, NullIf(Isnull(UA.UserName,''),'') AS CreatedBy,    " &
                                                   "  NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITM.FYear,'') AS FYear,0 AS ReceiptTransactionID,   " &
                                                    " Isnull(ITD.IsVoucherItemApproved, 0) As IsVoucherItemApproved, 0 As IsReworked, " &
                                                    " Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,   " &
                                                    " Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision ,Nullif(ITM.ContactPersonID,'') AS ContactPersonID,0 AS RequiredQuantity,    " &
                                                    " Nullif('','') AS ExpectedDeliveryDate,isnull(ITM.TotalTaxAmount,0) AS TotalTaxAmount,isnull(ITM.TotalOverheadAmount,0) AS TotalOverheadAmount,   " &
                                                    " Nullif(ITM.DeliveryAddress,'') as DeliveryAddress,Isnull(ITM.TotalQuantity,'') as TotalQuantity,nullif(ITM.TermsOfPayment,'') as TermsOfPayment,ROUND(SUM(Isnull(ITD.TaxableAmount,0)),2) AS TaxableAmount,nullif(ITM.ModeOfTransport ,'') as ModeOfTransport ,nullif(ITM.DealerID,'') as DealerID ,Case When isnull(ITM.CurrencyCode,'')='' Then 'INR' Else ITM.CurrencyCode End As CurrencyCode    " &
                                                    " From " & TblPrefix & "ItemTransactionMain As ITM     " &
                                                    " INNER Join CompanyMaster as CM on CM.CompanyID=ITM.CompanyID    " &
                                                    "   INNER Join " & TblPrefix & "ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID      " &
                                                     "INNER Join UserMaster AS UA ON UA.UserID=ITM.CreatedBy And UA.CompanyID=ITM.CompanyID      " &
                                                     "INNER Join(Select A.[LedgerID] AS LedgerID, A.[CompanyID] As CompanyID, A.[LedgerName], A.[City], A.[State], A.[Country], A.[Address1], A.[Address2], A.[GSTNo],[MailingAddress]    " &
                                                     "From(SELECT [LedgerID], [LedgerGroupID], [CompanyID], [LedgerName], [City], [State], [Country], [Address1], [Address2], [GSTNo],[MailingAddress]    " &
                                                     "FROM(Select [LedgerID], [LedgerGroupID], [CompanyID], [FieldName], nullif([FieldValue],'''') as FieldValue      " &
                                                     "From [LedgerMasterDetails] Where CompanyID ='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)<>1 AND    " &
                                                     "LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster    " &
                                                     "Where CompanyID ='" & GBLCompanyID & "' AND LedgerGroupNameID=23))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for    " &
                                                     "FieldName In ([LedgerName], [City], [State], [Country], [Address1], [Address2], [GSTNo],[MailingAddress])) p) AS A  Where A.CompanyID='" & GBLCompanyID & "' ) AS LM ON LM.LedgerID=ITM.LedgerID   " &
                                                     "And LM.CompanyID=ITM.CompanyID  Left Join UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy And UA.CompanyID=ITM.CompanyID      " &
                                                     "Where ITM.VoucherID = " & VoucherID & " And ITM.CompanyID ='" & GBLCompanyID & "' and ITM.TransactionID='" & TransactionID & "'  AND Isnull(ITD.IsDeletedTransaction,0)<>1      " &
                                                     "Group BY Isnull(ITM.TransactionID, 0),Isnull(ITM.VoucherID,0),Isnull(ITM.LedgerID,0),NullIf(LM.Address1,''), NullIf(LM.Address2,''), NullIf(LM.GSTNo,''), NullIf(CM.GSTIN,''),NullIf(CM.CompanyName,''),NullIf(CM.State,'') ,NullIf(CM.State,''),CM.Address, ITM.CurrencyCode, LM.MailingAddress,  " &
                                                    " NullIf(LM.Country,''),NullIf(LM.State,''), NullIf(LM.City,''),NullIf(LM.LedgerName,''),Isnull(ITM.MaxVoucherNo,0),NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'), NullIf(Isnull(UA.UserName,''),''),NullIf(Isnull(UM.UserName,''),''),NullIf(ITM.FYear,''),Isnull(ITD.IsVoucherItemApproved,0),Nullif(ITM.PurchaseReferenceRemark,''),Nullif(ITM.Narration,''),Nullif(ITM.PurchaseDivision,''),Nullif(ITM.ContactPersonID,''),isnull(ITM.TotalTaxAmount,0),isnull(ITM.TotalOverheadAmount,0),Nullif(ITM.DeliveryAddress,''),Isnull(ITM.TotalQuantity,''),nullif(ITM.TermsOfPayment,''),nullif(ITM.ModeOfTransport ,''),nullif(ITM.DealerID,''),Isnull(ITM.NetAmount,0),Isnull(ITM.TotalOverHeadAmount,0),Isnull(ITM.AmountInWords,0)     Order By NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0) ")
            If PrintType = "Other" Then
                Str = "SELECT DISTINCT  ISNULL(ITM.TransactionID, 0) AS PurchaseTransactionID, ITM.VoucherID AS PurchaseVoucherID, ITM.VoucherID AS VoucherID, ITM.LedgerID AS LedgerID,ITD.TransID ,  ITD.ItemID , ITD.ItemGroupID, NULLIF (LM.LedgerName, '') AS LedgerName, NULLIF (ITM.VoucherNo, '') AS PurchaseVoucherNo, NULLIF (ITM.VoucherNo, '') AS VoucherNo, REPLACE(CONVERT(Varchar(13), ITM.VoucherDate, 106), ' ', '-') AS PurchaseVoucherDate,REPLACE(CONVERT(Varchar(13), ITM.VoucherDate, 106), ' ', '-') AS VoucherDate,NULLIF (ISNULL(ITD.ItemName, ''), '') AS ItemDescription, ITD.RequiredQuantity AS RequisitionQty, ITD.PurchaseOrderQuantity " &
                        " AS PurchaseQuantity, ITD.ChallanWeight AS OrderWt, ISNULL(ITD.PurchaseUnit, '') AS PurchaseUnit, ITD.PurchaseRate AS PurchaseRate, ITD.GrossAmount AS BasicAmount, ISNULL(ITD.DiscountPercentage, 0) AS Disc, ROUND(ISNULL(ITD.DiscountAmount, 0), 2) AS DiscountAmount, ISNULL(ITD.BasicAmount, 0) AS AfterDisAmt, ISNULL(ITD.PurchaseTolerance, 0) AS Tolerance,  " &
                        " ISNULL(ITD.GSTPercentage, 0) AS GSTTaxPercentage, ISNULL(ITD.CGSTAmount, 0) + ISNULL(ITD.SGSTAmount, 0) + ISNULL(ITD.IGSTAmount, 0) AS GSTTaxAmount, ITD.NetAmount AS TotalAmount, NULLIF (ISNULL(UA.UserName, ''), '') AS CreatedBy, NULLIF (ISNULL(UM.UserName, ''), '') AS ApprovedBy, NULLIF (ITD.FYear, '') AS FYear, 0 AS ReceiptTransactionID, ITD.IsVoucherItemApproved AS IsVoucherItemApproved, 0 AS IsReworked, NULLIF ('', '') AS ReworkRemark, NULLIF (ITM.PurchaseReferenceRemark, '') AS PurchaseReference, NULLIF (ITM.Narration, '') AS Narration, NULLIF (ITM.PurchaseDivision, '')  " &
                        " AS PurchaseDivision, REPLACE(CONVERT(Varchar(13), ITD.ExpectedDeliveryDate, 106), ' ', '-') AS ExpectedDeliveryDate, NULLIF (ITD.StockUnit, '') AS StockUnit, ISNULL(ITD.CGSTPercentage, 0) AS CGSTTaxPercentage,  " &
                        " ISNULL(ITD.SGSTPercentage, 0) AS SGSTTaxPercentage, ISNULL(ITD.IGSTPercentage, 0) AS IGSTTaxPercentage, ISNULL(ITD.CGSTAmount, 0) AS CGSTAmt, ISNULL(ITD.SGSTAmount, 0) AS SGSTAmt, ISNULL(ITD.IGSTAmount, 0)  " &
                        " AS IGSTAmt, ISNULL(ITD.TaxableAmount, 0) AS TaxableAmount, REPLACE(CONVERT(Varchar(13), ITD.ExpectedDeliveryDate, 106), ' ', '-') AS ExpectedDeliveryDate, NULLIF (PHM.ProductHSNName, '') AS ProductHSNName,  " &
                        " NULLIF (PHM.HSNCode, '') AS HSNCode, ISNULL(ITD.ReceiptWtPerPacking, 0) AS WtPerPacking, 1 AS UnitPerPacking, 1 AS ConversionFactor,ITM.TotalTaxAmount-ITM.TotalSGSTTaxAmount-ITM.TotalCGSTTaxAmount-ITM.TotalIGSTTaxAmount As AdditionalChargesAmt, NULLIF (C.ConversionFormula, '')  " &
                        " AS ConversionFormula, ISNULL(C.ConvertedUnitDecimalPlace, 0) AS UnitDecimalPlace, CASE WHEN isnull(ITM.CurrencyCode, '') = '' THEN 'INR' ELSE ITM.CurrencyCode END AS CurrencyCode " &
                        " FROM OtherItemTransactionMain AS ITM INNER JOIN " &
                        " OtherItemTransactionDetail AS ITD ON ITM.TransactionID = ITD.TransactionID AND ITM.CompanyID = ITD.CompanyID AND (ISNULL(ITD.IsDeletedTransaction, 0) = 0) INNER JOIN " &
                        " UserMaster AS UA ON UA.UserID = ITM.CreatedBy AND UA.CompanyID = ITM.CompanyID INNER JOIN " &
                        " LedgerMaster AS LM ON LM.LedgerID = ITM.LedgerID AND LM.CompanyID = ITM.CompanyID LEFT OUTER JOIN " &
                        " UserMaster AS UM ON UM.UserID = ITD.VoucherItemApprovedBy AND UA.CompanyID = ITM.CompanyID LEFT OUTER JOIN " &
                        " ConversionMaster AS C ON C.BaseUnitSymbol = ITD.StockUnit AND C.ConvertedUnitSymbol = ITD.PurchaseUnit AND C.CompanyID = ITD.CompanyID LEFT OUTER JOIN " &
                        " ProductHSNMaster AS PHM ON PHM.ProductHSNID = ITD.ProductHSNID AND PHM.CompanyID = ITD.CompanyID " &
                        " WHERE ITM.VoucherID= " & VoucherID & " And ITM.CompanyID = '" & GBLCompanyID & "' and ITD.TransactionID='" & TransactionID & "' " &
                        " ORDER BY TransID "
            Else
                Str = "Select distinct Isnull(ITM.TransactionID,0) AS PurchaseTransactionID,Isnull(ITM.VoucherID,0) AS PurchaseVoucherID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.LedgerID,0) AS LedgerID, Isnull(ITD.TransID,0) As TransID,Isnull(ITD.ItemID,0) As ItemID,  Isnull(ITD.ItemGroupID,0) As ItemGroupID, NullIf(LM.LedgerName,'') AS LedgerName,Isnull(ITM.MaxVoucherNo,0) AS PurchaseMaxVoucherNo,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,  " &
                   " NullIf(ITM.VoucherNo,'') AS PurchaseVoucherNo,NullIf(ITM.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseVoucherDate, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate, NullIf(IM.ItemCode,'') AS ItemCode, NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName, NullIf(Isnull(IM.ItemName,''),'') AS ItemName,NullIf(Isnull(IM.ItemName,''),'') AS ItemDescription, Isnull(ITD.RequiredQuantity,0) AS RequisitionQty,   " &
                   " Isnull(ITD.ChallanWeight,0) AS PurchaseQuantity,ITD.PurchaseOrderQuantity/Isnull(IM.UnitPerPacking,1) As OrderWt,  Isnull(ITD.PurchaseUnit,'') AS PurchaseUnit, Isnull(ITD.PurchaseRate,0) AS PurchaseRate, Isnull(ITD.GrossAmount,0) AS BasicAmount,Isnull(ITD.DiscountPercentage,0) AS Disc, ROUND(Isnull(ITD.DiscountAmount,0),2) AS DiscountAmount,Isnull(ITD.BasicAmount,0) AS AfterDisAmt, Isnull(ITD.PurchaseTolerance,0) AS Tolerance, Isnull(ITD.GSTPercentage,0) AS GSTTaxPercentage, (Isnull(ITD.CGSTAmount,0)+Isnull(ITD.SGSTAmount,0)+Isnull(ITD.IGSTAmount,0)) AS GSTTaxAmount,  " &
                   " Isnull(ITD.NetAmount,0) AS TotalAmount,NullIf(Isnull(UA.UserName,''),'') AS CreatedBy, NullIf(Isnull(UM.UserName,''),'') AS ApprovedBy,NullIf(ITD.FYear,'') AS FYear,0 AS ReceiptTransactionID, Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved, 0 AS IsReworked,ITM.TotalTaxAmount-ITM.TotalSGSTTaxAmount-ITM.TotalCGSTTaxAmount-ITM.TotalIGSTTaxAmount As AdditionalChargesAmt, Nullif(ITM.PurchaseReferenceRemark,'') AS PurchaseReference,Nullif(ITM.Narration,'') AS Narration,Nullif(ITM.PurchaseDivision,'') AS PurchaseDivision, Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,   " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.CGSTPercentage,0) as CGSTTaxPercentage, Isnull(ITD.SGSTPercentage,0) as SGSTTaxPercentage,Isnull(ITD.IGSTPercentage,0) as IGSTTaxPercentage , Isnull(ITD.CGSTAmount,0) as CGSTAmt,  Isnull(ITD.SGSTAmount,0) as SGSTAmt,Isnull(ITD.IGSTAmount,0) as IGSTAmt ,Isnull(ITD.TaxableAmount,0) AS TaxableAmount, Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, Nullif(PHM.ProductHSNName,'') AS ProductHSNName,Nullif(PHM.HSNCode,'') AS HSNCode,Isnull(IM.WtPerPacking,0) AS WtPerPacking,  " &
                   " Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor, Nullif(C.ConversionFormula,'') AS  ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS UnitDecimalPlace,Case When isnull(ITM.CurrencyCode,'')='' Then 'INR' Else ITM.CurrencyCode End As CurrencyCode     " &
                   " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID   " &
                   " And ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID   " &
                   " And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=ITD.CompanyID   " &
                   " INNER JOIN UserMaster AS UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID   " &
                   " INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID And LM.CompanyID=ITM.CompanyID   " &
                   " LEFT JOIN UserMaster AS UM ON UM.UserID=ITD.VoucherItemApprovedBy AND UA.CompanyID=ITM.CompanyID   " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID                           " &
                   " LEFT JOIN ConversionMaster As C ON C.BaseUnitSymbol=IM.StockUnit AND C.ConvertedUnitSymbol=ITD.PurchaseUnit And C.CompanyID=ITD.CompanyID    " &
                   " LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID=IM.ProductHSNID AND PHM.CompanyID=IM.CompanyID  Where ITM.VoucherID= " & VoucherID & " And ITM.CompanyID = '" & GBLCompanyID & "' and ITD.TransactionID='" & TransactionID & "'  AND Isnull(ITD.IsDeletedTransaction,0)<>1 Order By TransID "
            End If
            Dim dsCustomers2 As DataTable = GetData(Str)

            Dim dsCustomers3 As DataTable = GetData("select Isnull(IPOHC.TransID,0) AS TransID,Isnull(IPOHC.TransactionID,0) AS TransactionID,Isnull(IPOHC.headID,0) AS HeadID, " &
              " Isnull(IPOHC.Quantity,0) As Weight,nullif(IPOHC.ChargesType,'') AS RateType,Isnull(IPOHC.Amount,0) AS HeadAmount,Isnull(IPOHC.Rate,0) AS Rate,nullif(IPOHC.headName,'') AS Head " &
               " from " & TblPrefix & "ItemPurchaseOverheadCharges as IPOHC where IPOHC.CompanyID='" & GBLCompanyID & "' and IPOHC.TransactionID='" & TransactionID & "'  AND Isnull(IPOHC.IsDeletedTransaction,0)<>1 ")

            Dim DSAdditionalCharges As DataTable = GetData("Select TransID,TransactionID,IPOT.Amount As ChargesAmount,LedgerName From " & TblPrefix & "ItemPurchaseOrderTaxes As IPOT INNER JOIN LedgerMaster As LM on LM.LedgerID=IPOT.LedgerID AND LM.CompanyID=IPOT.CompanyID " &
                " Where IPOT.CompanyID = '" & GBLCompanyID & "' And IPOT.TransactionID = '" & TransactionID & "' AND Isnull(IPOT.IsDeletedTransaction,0)<>1  Order By TransID")

            '' Delivery Schedule
            Dim dsScheduleDelivery As DataTable = GetData("Select Distinct TransactionID,TransID,Sum(Quantity) As Quantity,Unit,ScheduleDeliveryDate From " & TblPrefix & "ItemPurchaseDeliverySchedule Where CompanyID = '" & GBLCompanyID & "'  And  TransactionID = '" & TransactionID & "' Group By TransactionID,TransID,ScheduleDeliveryDate,Unit Order By ScheduleDeliveryDate ")

            ReportViewer1.Reset()
            'path
            '  ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/ReportPurchaseOrder.rdlc")
            ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/PurchaseOrder.rdlc")

            'dataSource
            Dim ds1 As ReportDataSource = New ReportDataSource("DataSet1", dsCustomers1)
            Dim ds2 As ReportDataSource = New ReportDataSource("DataSet2", dsCustomers2)
            Dim ds3 As ReportDataSource = New ReportDataSource("DataSet3", dsCustomers3)
            Dim ds4 As ReportDataSource = New ReportDataSource("DSScheduleDelivery", dsScheduleDelivery)
            Dim ds5 As ReportDataSource = New ReportDataSource("DSAdditionalCharges", DSAdditionalCharges)

            ReportViewer1.LocalReport.DataSources.Add(ds1)
            ReportViewer1.LocalReport.DataSources.Add(ds2)
            ReportViewer1.LocalReport.DataSources.Add(ds3)
            ReportViewer1.LocalReport.DataSources.Add(ds4)
            ReportViewer1.LocalReport.DataSources.Add(ds5)

            'Add SubReport
            ' AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ContentDetailSubreportProcessing
            'refresh
            ReportViewer1.LocalReport.Refresh()
        End If
    End Sub

    Private Function GetData(query As String) As DataTable

        Dim dss As DataSet = New DataSet()
        Dim sql As String = ""
        Dim dt As DataTable = New DataTable()
        sql = query
        Try
            Dim con As New SqlConnection
            con = db.OpenDataBase()

            Dim cmd As SqlCommand = New SqlCommand(sql, con)
            Dim adapter As New SqlDataAdapter(cmd)
            adapter.Fill(dt)

            con.Close()

            Return dt
        Catch ex As Exception
            Return dt
        End Try
    End Function

    Protected Sub Email(ByVal sender As Object, ByVal e As EventArgs)
        MailError.InnerHtml = ""
        TransactionID = Convert.ToString(HttpContext.Current.Request.QueryString("TransactionID"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserId"))
        If TransactionID <= 0 Or GBLCompanyID <= 0 Or GBLUserID <= 0 Then Exit Sub

        Dim DtUser As New DataTable
        db.FillDataTable(DtUser, "SELECT Distinct IsnuLL(Nullif(EmailID,''),smtpUserName) As smtpUserID,  Isnull(smtpUserPassword,'') As smtpUserPassword,  Isnull(smtpServer,'smtp.gmail.com') As smtpServer,  Isnull(smtpServerPort,'587') As smtpServerPort,  Isnull(smtpAuthenticate,'True') As smtpAuthenticate,  Isnull(smtpUseSSL,'True') As smtpUseSSL FROM UserMaster Where Isnull(IsBlocked,0)=0 And IsnuLL(IsHidden,0)=0 And ISNULL(IsDeletedUser,0)=0 And CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID)
        If DtUser.Rows.Count <= 0 Then MailError.InnerHtml = "Invalid user details" : Exit Sub
        If DtUser.Rows(0)("smtpUserID") = "" Or DtUser.Rows(0)("smtpUserID").contains("@") = False Then
            MailError.InnerHtml = "Invalid sender mail id, Please update mail id in user master"
            Exit Sub
        End If
        Try
            Dim mm As MailMessage = New MailMessage(DtUser.Rows(0)("smtpUserID").ToString(), TxtEmailTo.Value.ToString()) With {
                .Subject = TxtSubject.Value.ToString(),
                .Body = TxtEmailBody.Value.ToString()
            }
            mm.Attachments.Add(New Attachment(ExportReportToPDF(Server.MapPath("~/Files/POFiles/"), "PO " & TransactionID & ".pdf")))
            mm.IsBodyHtml = True
            mm.Priority = MailPriority.High
            If TxtEmailCC.Value.ToString() <> "" And TxtEmailCC.Value.Contains("@") = True Then
                mm.CC.Add(TxtEmailCC.Value.ToString())
            End If
            If TxtEmailBcc.Value.ToString() <> "" And TxtEmailBcc.Value.Contains("@") = True Then
                mm.Bcc.Add(TxtEmailBcc.Value.ToString())
            End If

            Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = DtUser.Rows(0)("smtpUserID").ToString(),
                .Password = DtUser.Rows(0)("smtpUserPassword").ToString()
            }

            Dim smtp As SmtpClient = New SmtpClient With {
                .Host = DtUser.Rows(0)("smtpServer").ToString(),
                .Credentials = credential,
                .Port = DtUser.Rows(0)("smtpServerPort").ToString(),
                .EnableSsl = DtUser.Rows(0)("smtpUseSSL").ToString()
                }
            smtp.Send(mm)

            'Dim PlanWindow As New WebServicePlanWindow
            'MailError.InnerHtml = PlanWindow.SubmitMail(mm)
            MailError.InnerHtml = "Email Send Successfully"
            db.ExecuteNonSQLQuery("Update ItemTransactionMain set IsMailSent=1 Where TransactionID=" & TransactionID & " And CompanyId =" & GBLCompanyID)
        Catch ex As Exception
            'MsgBox(ex.Message)
            MailError.InnerHtml = ex.Message
        End Try
    End Sub

    Private Function ExportReportToPDF(ByVal path As String, ByVal reportName As String) As String
        Dim warnings As Warning()
        Dim streamids As String()
        Dim mimeType As String = ""
        Dim encoding As String = ""
        Dim filenameExtension As String = ""
        Dim bytes As Byte() = ReportViewer1.LocalReport.Render("PDF", Nothing, mimeType, encoding, filenameExtension, streamids, warnings)
        Dim filename As String = path & reportName

        Using fs = New System.IO.FileStream(filename, System.IO.FileMode.Create)
            fs.Write(bytes, 0, bytes.Length)
            fs.Close()
        End Using

        Return filename
    End Function
End Class
