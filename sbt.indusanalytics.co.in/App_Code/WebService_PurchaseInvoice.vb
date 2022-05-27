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
Public Class WebService_PurchaseInvoice
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

    '---------------Open Master code---------------------------------

    '-----------------------------------Get Pending List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillGrid(ByVal RadioValue As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If RadioValue = "Pending" Then
            str = ""
            str = "Select ITM.TransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,NullIf(LM.LedgerName,'') AS LedgerName,  " &
                   " NullIf(ITM.VoucherNo,'') AS ReceiptVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReceiptVoucherDate,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,ROUND(SUM(Isnull(ITD.ChallanQuantity,0)),2) AS ChallanQuantity,NullIf(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate,NullIf(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-') AS GateEntryDate,NullIf(ITM.LRNoVehicleNo,'') AS LRNoVehicleNo,NullIf(ITM.Transporter,'') AS Transporter,NullIf(EM.LedgerName,'') AS ReceiverName,NullIf(ITM.Narration,'') AS Narration,NullIf(ITM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,Isnull(ITM.ReceivedBy,0) AS ReceivedBy   " &
                   " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID AND ITMP.CompanyID=ITD.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID And LM.CompanyID=ITM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy And EM.CompanyID=ITM.CompanyID   " &
                   " Where ITM.VoucherID=-14 AND  ITM.CompanyID= " & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)<>1 And ITD.IsDeletedTransaction=0 AND Isnull(ITM.IsPurchaseInvoiceCreated,0)=0  " &
                   " GROUP BY ITM.TransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,NullIf(ITM.VoucherNo,''),Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-'),NullIf(ITMP.VoucherNo,''),Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-'),NullIf(ITM.DeliveryNoteNo,''),Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-'),NullIf(ITM.GateEntryNo,''),Replace(Convert(Varchar(13),ITM.GateEntryDate,106),' ','-'),NullIf(ITM.LRNoVehicleNo,''),NullIf(ITM.Transporter,''),NullIf(ITM.Narration,''),NullIf(EM.LedgerName,''),NullIf(LM.LedgerName,''),NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0),NullIf(UM.UserName,''),Isnull(ITM.ReceivedBy,0) Order By  NullIf(ITM.FYear,''),Isnull(ITM.MaxVoucherNo,0)"
        End If

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Get Purchase Invoice No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPINO(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            KeyField = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetTCSRate() As String
        Dim KeyField As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        Try
            KeyField = db.GetColumnValue("Rate", "TaxCollectedAtSourceMaster", " CompanyID=" & GBLCompanyID)
        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open Get ledgerName For Charges Grid Data  ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CHLname() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "SELECT isnull([LedgerID],0) as LedgerID,nullif([LedgerName],'') as LedgerName,isnull([TaxPercentage],0) as TaxPercentage,nullif([TaxType],'') as TaxType,nullif([GSTApplicable],'') as GSTApplicable,nullif([GSTLedgerType],'') as GSTLedgerType,nullif([GSTCalculationOn],'') as GSTCalculationOn  FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName], nullif([FieldValue],'''') as FieldValue  " &
               " FROM [LedgerMasterDetails] Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)<>1 AND   " &
               " LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=43))x unpivot (value for name in ([FieldValue])) up pivot (max(value)   " &
               " for FieldName in ([LedgerName],[TaxPercentage],[TaxType],[GSTApplicable],[GSTLedgerType],[GSTCalculationOn])) p"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open Fill PO Grid For Create Btn Click  Data  ------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillCreatePIGrid(ByVal DelNoteNo As String, ByVal GetTransactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select ITM.TransactionID,ITD.PurchaseTransactionID,ITD.ItemID,IM.ItemGroupID,IGM.ItemGroupNameID,NullIf(ITMP.VoucherNo,'') AS PurchaseVoucherNo,Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-') AS PurchaseVoucherDate,NullIf(IM.ItemCode,'') AS ItemCode,NullIf(IM.ItemName,'') AS ItemName,  " &
               " Isnull(ITMPD.PurchaseOrderQuantity,0) As PurchaseOrderQuantity,NullIf(ITMPD.PurchaseUnit,'') AS PurchaseUnit,ROUND(Sum(Isnull(ITD.ChallanQuantity,0)),3) AS ChallanQuantity,NullIf(IM.StockUnit,'') AS StockUnit,  " &
               " Isnull(ITMPD.PurchaseRate,0) AS PurchaseRate,Isnull(ITD.ReceiptWtPerPacking,0) AS ReceiptWtPerPacking,Isnull(ITMPD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(IM.SizeW,1) AS SizeW  " &
               ",nullif(ITM.Narration,'') as Narration,nullif(ITM.FYear,'') as FYear,  nullif(PHM.ProductHSNName,'') as ProductHSNName, nullif(PHM.HSNCode,'') as HSNCode, isnull(PHM.GSTTaxPercentage,0) as GSTTaxPercentage,  isnull(PHM.CGSTTaxPercentage,0) as CGSTTaxPercentage, isnull(PHM.SGSTTaxPercentage,0) as SGSTTaxPercentage,  isnull(PHM.IGSTTaxPercentage ,0) as IGSTTaxPercentage " &
               " From ItemTransactionMain AS ITM   " &
               " INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID And ITD.IsDeletedTransaction=0 " &
               " INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID   " &
               " LEFT JOIN ProductHSNMaster As PHM ON PHM.ProductHSNID =IM.ProductHSNID And PHM.CompanyID=IM.CompanyID " &
               " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID " &
               " INNER JOIN ItemTransactionMain AS ITMP ON ITMP.TransactionID=ITD.PurchaseTransactionID And ITMP.CompanyID=ITD.CompanyID  And ITMP.IsDeletedTransaction=0   " &
               " INNER JOIN ItemTransactionDetail AS ITMPD ON ITMPD.TransactionID=ITMP.TransactionID AND ITMPD.ItemID=IM.ItemID AND ITMPD.TransactionID=ITD.PurchaseTransactionID AND ITMPD.CompanyID=ITMP.CompanyID And ITMPD.IsDeletedTransaction=0 " &
               " Where ITM.VoucherID=-14 And ITM.TransactionID IN(" & GetTransactionID & ") AND  ITM.CompanyID='" & GBLCompanyID & "' /*AND ITM.DeliveryNoteNo IN('" & DelNoteNo & "')  */ " &
               " GROUP BY ITM.TransactionID,ITD.PurchaseTransactionID,ITD.ItemID,IM.ItemGroupID,IGM.ItemGroupNameID,NullIf(ITMP.VoucherNo,''),Replace(Convert(Varchar(13),ITMP.VoucherDate,106),' ','-'),NullIf(IM.ItemCode,''),NullIf(IM.ItemName,''), " &
               " Isnull(ITMPD.PurchaseOrderQuantity,0),NullIf(ITMPD.PurchaseUnit,''),NullIf(IM.StockUnit,''),Isnull(ITMPD.PurchaseRate,0),Isnull(ITD.ReceiptWtPerPacking,0),Isnull(ITMPD.PurchaseTolerance,0),  " &
               " Isnull(IM.WtPerPacking,0),Isnull(IM.UnitPerPacking,1),Isnull(IM.ConversionFactor,1), " &
               " Isnull(IM.SizeW,1),nullif(ITM.FYear,''),nullif(ITM.Narration,''),nullif(PHM.ProductHSNName,''),nullif(PHM.HSNCode,''),isnull(PHM.GSTTaxPercentage,0),isnull(PHM.CGSTTaxPercentage,0),isnull(PHM.SGSTTaxPercentage,0),isnull(PHM.IGSTTaxPercentage ,0) Order by TransactionID"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Supplier code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Supplier(ByVal LedgerID As Integer) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Distinct A.[LedgerID],A.[LedgerName],nullif(A.[MailingName],'') as MailingName,nullif(A.[City],'') as City,nullif(A.[State],'') as SupState,Isnull(S.[StateTinNo],0) AS StateTinNo,nullif(A.[Country],'') as Country,nullif(A.[MobileNo],'') as MobileNo,nullif(A.[GSTNo],'') AS GSTNo,nullif(A.[CurrencyCode],'') AS CurrencyCode,Isnull(A.[GSTApplicable],0) AS GSTApplicable,Isnull(C.StateTinNo,0) AS CompanyStateTinNo " &
                "From LedgerMaster AS A  " &
                "INNER JOIN LedgerGroupMaster AS B ON A.LedgerGroupID=B.LedgerGroupID And A.CompanyID = B.CompanyID INNER JOIN CompanyMaster AS C ON C.CompanyID =A.CompanyID LEFT JOIN CountryStateMaster AS S ON S.State=A.State " &
                "Where A.CompanyID=" & GBLCompanyID & " And A.LedgerID=" & LedgerID & " And LedgerGroupNameID=23 "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Supplier code---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PurchaseLedger() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select LedgerID,LedgerName From LedgerMaster  " &
                "Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID='" & GBLCompanyID & "' AND LedgerGroupNameID=20) Order By LedgerName "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '---------------Get Item rate code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetItemRate(ByVal LedgerId As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        str = "Select Distinct isnull(ItemID,0) AS ItemID,Isnull(PurchaseRate,0) AS PurchaseRate,isnull(LedgerID,'') as LedgerID  From SupplierWisePurchaseSetting Where LedgerID='" & LedgerId & "' AND CompanyID='" & GBLCompanyID & "' "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ItemPurchaseInvoice  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavePaperPurchaseInvoice(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String, ByVal TransactionID_String As String) As String

        Dim dt As New DataTable
        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName, CurrencyCode As String 'For Currency
        Dim PONo As String
        Dim MaxPONo As Long
        Dim KeyField, str2, TransactionID, NumberToWord As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        CurrencyCode = "INR"
        Try

            NumberToWord = ""
            '  NumberToWord = db.ReadNumber(TxtNetAmt)
            If CurrencyCode = "INR" Or CurrencyCode = "" Then
                CurrencyHeadName = ""
                CurrencyChildName = ""
                CurrencyCode = "INR"
                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
            Else
                NumberToWord = ""
                str2 = ""
                str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where   CurrencyCode='" & CurrencyCode & "'"
                db.FillDataTable(dtCurrency, str2)
                Dim j As Integer = dtCurrency.Rows.Count
                If j > 0 Then
                    CurrencyHeadName = dtCurrency.Rows(0)(0)
                    CurrencyChildName = dtCurrency.Rows(0)(1)
                    NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
                End If
            End If

            PONo = db.GeneratePrefixedNo("ItemPurchaseInvoiceMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And IsDeletedTransaction=0 ")
            Using UpdtTrans As New Transactions.TransactionScope

                TableName = "ItemPurchaseInvoiceMain"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "','" & NumberToWord & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    UpdtTrans.Dispose()
                    Return "Error in main " & TransactionID
                End If

                TableName = "ItemPurchaseInvoiceDetail"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    UpdtTrans.Dispose()
                    Return "Error in details " & KeyField
                End If

                TableName = "ItemPurchaseInvoiceTaxes"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    UpdtTrans.Dispose()
                    Return "Error in taxes " & KeyField
                End If

                str = "Update ItemTransactionMain Set IsPurchaseInvoiceCreated=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID IN(" & TransactionID_String & ")"
                KeyField = db.ExecuteNonSQLQuery(str)
                If KeyField <> "Success" Then
                    UpdtTrans.Dispose()
                    Return "Error in updating " & KeyField
                End If

                If jsonObjectsRecordMain(0)("RoundOffValue") <> 0 Then
                    Dim RoundOffLedgerID As String = 0
                    RoundOffLedgerID = db.GetColumnValue("LedgerID", "LedgerMaster", " Isnull(IsDeletedTransaction,0)=0 AND Upper(LedgerName)='ROUNDOFF' And LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=43 AND CompanyID='" & GBLCompanyID & "')")
                    db.ExecuteNonSQLQuery("Insert Into ItemPurchaseInvoiceTaxes(CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID, TransID, LedgerID, Amount, TaxInAmount)" &
                                           " Select '" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'," & jsonObjectsRecordTax.length & "," & RoundOffLedgerID & "," & jsonObjectsRecordMain(0)("RoundOffValue") & ",1")
                End If
                UpdtTrans.Complete()
            End Using

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open PurchaseInvoice  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePurchaseInvoice(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsRecordTax As Object, ByVal TxtNetAmt As String) As String

        Dim dt As New DataTable
        Dim dtCurrency As New DataTable 'For Currency
        Dim CurrencyHeadName, CurrencyChildName, CurrencyCode, str2 As String 'For Currency
        Dim KeyField, NumberToWord As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

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
            str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where   CurrencyCode='" & CurrencyCode & "'"
            db.FillDataTable(dtCurrency, str2)
            Dim j As Integer = dtCurrency.Rows.Count
            If j > 0 Then
                CurrencyHeadName = dtCurrency.Rows(0)(0)
                CurrencyChildName = dtCurrency.Rows(0)(1)
                NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
            End If
        End If

        Try
            Using UpdtTrans As New Transactions.TransactionScope
                TableName = "ItemPurchaseInvoiceMain"
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "',AmountInWords='" & NumberToWord & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
                KeyField = db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 1, wherecndtn)
                If KeyField <> "Success" Then
                    UpdtTrans.Dispose()
                    Return "Error in updating " & KeyField
                End If

                db.ExecuteNonSQLQuery("Delete from ItemPurchaseInvoiceDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

                TableName = "ItemPurchaseInvoiceDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    UpdtTrans.Dispose()
                    Return "Error in details " & KeyField
                End If

                db.ExecuteNonSQLQuery("Delete from ItemPurchaseInvoiceTaxes WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

                TableName = "ItemPurchaseInvoiceTaxes"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                KeyField = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    UpdtTrans.Dispose()
                    Return "Error in taxes " & KeyField
                End If

                If jsonObjectsRecordMain(0)("RoundOffValue") <> 0 Then
                    Dim RoundOffLedgerID As String = 0
                    RoundOffLedgerID = db.GetColumnValue("LedgerID", "LedgerMaster", " Isnull(IsDeletedTransaction,0)=0 AND Upper(LedgerName)='ROUNDOFF' And LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=43 AND CompanyID='" & GBLCompanyID & "')")
                    db.ExecuteNonSQLQuery("Insert Into ItemPurchaseInvoiceTaxes(CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID, TransID, LedgerID, Amount, TaxInAmount)" &
                                           " Select '" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'," & jsonObjectsRecordTax.length & "," & RoundOffLedgerID & "," & jsonObjectsRecordMain(0)("RoundOffValue") & ",1")
                End If

                UpdtTrans.Complete()
            End Using

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error " & ex.Message
        End Try
        Return KeyField

    End Function

    '---------------Get Showlist code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Showlist() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        str = "Select Isnull(IPM.TransactionID,0) AS TransactionID,Isnull(IPM.VoucherID,0) AS VoucherID,Nullif(IPM.FYear,'') AS FYear,Isnull(IPM.MaxVoucherNo,0) AS MaxVoucherNo,Nullif(IPM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IPM.VoucherDate,106),' ','-') AS VoucherDate, IPM.TCSRate,IPM.TCSAmount,  " &
               " Isnull(IPM.PurchaseLedgerID,0) AS PurchaseLedgerID,Isnull(IPM.TotalQuantity,0) AS TotalQuantity,Isnull(IPM.TotalBasicAmount,0) AS TotalBasicAmount,Isnull(IPM.TotalDiscountAmount,0) As TotalDiscountAmount,Isnull(IPM.TotalCGSTTaxAmount,0) As TotalCGSTTaxAmount,Isnull(IPM.TotalSGSTTaxAmount,0) As TotalSGSTTaxAmount,  " &
               " Isnull(IPM.TotalIGSTTaxAmount,0) AS TotalIGSTTaxAmount,Isnull(IPM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(IPM.NetAmount,0) AS NetAmount, Isnull(IPM.InvoiceNo,0) AS InvoiceNo,Replace(Convert(Varchar(13),IPM.InvoiceDate,106),' ','-') AS InvoiceDate,Isnull(IPM.RoundOffValue,0) AS RoundOffValue,  " &
               " nullif(IPM.Narration,'') AS Narration, Nullif(IPO.VoucherNo,'') AS PONo,Nullif(ITM.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS GRNDate,Nullif(IPM.InvoiceNo,'') AS InvoiceNo,Replace(Convert(Varchar(13),IPM.InvoiceDate,106),' ','-') AS InvoiceDate,Nullif(LM.LedgerName,'') AS SupplierName,isnull(LM.LedgerID,0) AS SupplierID,Nullif(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(Varchar(13),ITM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate  " &
               " From ItemPurchaseInvoiceMain AS IPM INNER JOIN ItemPurchaseInvoiceDetail AS IPD ON IPM.TransactionID=IPD.TransactionID AND IPM.CompanyID=IPD.CompanyID   " &
               " INNER JOIN ItemTransactionMain AS ITM ON ITM.TransactionID=IPD.ParentTransactionID And ITM.CompanyID=IPD.CompanyID And ITM.VoucherID=-14  " &
               " INNER JOIN LedgerMaster AS LM ON LM.LedgerID=IPM.LedgerID AND LM.CompanyID=IPM.CompanyID  " &
               " INNER JOIN ItemTransactionMain AS IPO ON IPO.TransactionID=IPD.PurchaseTransactionID And IPO.CompanyID=IPD.CompanyID And IPO.VoucherID=-11  " &
               " where IPO.CompanyID='" & GBLCompanyID & "' and isnull(IPM.IsDeletedTransaction,0)<>1 Order By FYear,TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------Get Selected Row code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePICreateGrid(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.PurchaseTransactionID,0) AS PurchaseTransactionID,Isnull(IPD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Nullif(ITPM.VoucherNo,'') AS PurchaseVoucherNo,  " &
              " Replace(Convert(Varchar(13),ITPM.VoucherDate,106),' ','-') AS PurchaseVoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Isnull(ITPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,  " &
              " Isnull(IPD.ChallanQuantity, 0) As ChallanQuantity,Nullif(IM.StockUnit,'') as StockUnit,Isnull(IPD.ReceiptQuantity,0) AS ReceiptQuantity,Isnull(IPD.ReceiptRate,0) AS PurchaseRate,Nullif(IPD.PurchaseUnit,'') as PurchaseUnit,  " &
              " Isnull(IPD.ReceiptWtPerPacking, 0) As ReceiptWtPerPacking,Nullif('','') AS ExpectedDeliveryDate,0 AS PurchaseTolerance,Isnull(IPD.BasicAmount,0) AS BasicAmount,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,  " &
              " Isnull(Nullif(IM.SizeW,''),1) AS SizeW,Isnull(IPD.DiscountPercentage,0) as DiscountPercentage,Isnull(IPD.DiscountAmount,0) as DiscountAmount,Isnull(IPD.GrossAmount,0) as AfterDisAmt,Isnull(IPD.TaxableAmount,0) as TaxableAmount,Isnull(IPD.GSTPercentage,0) as GSTPercentage,  " &
              " Isnull(IPD.CGSTPercentage, 0) As CGSTPercentage, Isnull(IPD.SGSTPercentage, 0) As SGSTPercentage, Isnull(IPD.IGSTPercentage, 0) As IGSTPercentage, Isnull(IPD.CGSTAmount, 0) As CGSTAmt, Isnull(IPD.SGSTAmount, 0) As SGSTAmt, Isnull(IPD.IGSTAmount, 0) As IGSTAmt, Isnull(IPD.NetAmount, 0) As TotalAmount,  " &
              " Isnull(IPD.IGSTAmount, 0) As IGSTAmt,0 As ReceiptQuantityComp,Nullif('','') AS CreatedBy,Nullif(IPD.ItemNarration,'') AS Narration,Nullif(IPD.FYear,'') AS FYear,Nullif(PGM.ProductHSNName,'') AS ProductHSNName,Nullif(PGM.HSNCode,'') AS HSNCode,Nullif(IM.ItemDescription,'') AS ItemDescription,  " &
              " Isnull(IPD.LandedAmount,'') AS LandedAmt,Isnull(IPD.LandedRate,'') AS LandedPrice  " &
              " From ItemPurchaseInvoiceMain As IPM   " &
              " INNER Join ItemPurchaseInvoiceDetail AS IPD ON IPD.TransactionID=IPM.TransactionID And IPD.CompanyID=IPM.CompanyID And IPD.IsDeletedTransaction=0 " &
              " INNER Join ItemMaster AS IM ON IM.ItemID=IPD.ItemID And IM.CompanyID=IPD.CompanyID  " &
              " INNER Join ItemTransactionMain AS ITM ON ITM.TransactionID=IPD.ParentTransactionID And ITM.CompanyID=IPD.CompanyID And ITM.IsDeletedTransaction=0 " &
              " INNER Join ItemTransactionDetail AS ITD ON ITD.TransactionID=IPD.ParentTransactionID And ITD.ItemID=IPD.ItemID And ITD.CompanyID=IPD.CompanyID And ITD.IsDeletedTransaction=0 " &
              " INNER Join ItemTransactionDetail AS ITPD ON ITPD.TransactionID=IPD.PurchaseTransactionID And ITPD.ItemID=IPD.ItemID And ITPD.CompanyID=IPD.CompanyID And ITPD.IsDeletedTransaction=0 " &
              " INNER Join ItemTransactionMain AS ITPM ON ITPM.TransactionID=ITPD.TransactionID And ITPM.CompanyID=ITPD.CompanyID And ITPM.IsDeletedTransaction=0 " &
              " INNER Join ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  " &
              " Left Join ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
              " Left Join ProductHSNMaster AS PGM ON PGM.ProductHSNID=IPD.ProductHSNID And PGM.CompanyID=IPD.CompanyID  " &
              " Where IPM.TransactionID ='" & transactionID & "' AND IPM.CompanyID=" & GBLCompanyID
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Process Retrive PICreateTaxChares Grid------------------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetrivePICreateTaxChares(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

        str = "SELECT Isnull(IPOT.LedgerID, 0) As LedgerID,Isnull(IPOT.TransID,0) As TransID,Isnull(IPOT.TransactionID,0) As TransactionID,Isnull(IPOT.TaxPercentage,0) As TaxRatePer, Isnull(IPOT.Amount,0) AS ChargesAmount,isnull(IPOT.TaxInAmount,0) AS InAmount,  Isnull(IPOT.IsComulative,0) AS IsCumulative,nullif(IPOT.GSTApplicable,'') AS GSTApplicable,nullif(IPOT.CalculatedON,'') AS CalculateON,LMD.[LedgerName],NULLIF (LMD.TaxType, '') AS TaxType, NULLIF (LMD.GSTLedgerType, '') AS GSTLedgerType " &
            " FROM ItemPurchaseInvoiceTaxes AS IPOT INNER JOIN LedgerMaster AS LMD ON LMD.LedgerID = IPOT.LedgerID AND LMD.CompanyID = IPOT.CompanyID WHERE (IPOT.CompanyID = " & GBLCompanyID & ") AND (IPOT.TransactionID = " & transactionID & ") AND (ISNULL(IPOT.IsDeletedTransaction, 0) =0) AND (UPPER(LMD.LedgerName) <> 'ROUNDOFF') ORDER BY TransID "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open ProcessPurchaseInvoice Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePaperPurchaseInvoice(ByVal TxtPIID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            str = ""
            str = "Update ItemPurchaseInvoiceMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseInvoiceDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemPurchaseInvoiceTaxes Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionMain Set IsPurchaseInvoiceCreated=0 Where TransactionID IN(Select Distinct ParentTransactionID From ItemPurchaseInvoiceDetail Where TransactionID='" & TxtPIID & "' AND CompanyID='" & GBLCompanyID & "') AND CompanyID='" & GBLCompanyID & "'"
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