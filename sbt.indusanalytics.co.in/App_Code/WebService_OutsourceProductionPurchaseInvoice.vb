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
Public Class WebService_OutsourceProductionPurchaseInvoice
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

    '-----------------------------------Get Pending List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillGrid(ByVal RadioValue As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If RadioValue = "Pending" Then
            str = "SELECT DISTINCT isnull(OPM.OutsourceID,0) as TransactionID,isnull(OPM.ParentOutsourceID,0) as PurchaseTransactionID, isnull(JBC.JobBookingID,0) as JobBookingID,  " &
                   " nullif(JB.JobName,'') as JobName, nullif(JB.JobBookingNo,'') as JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate,  " &
                   " isnull(JB.OrderQuantity,0) as OrderQuantity, isnull(OPM.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID, nullif(OPM.VoucherNo,'') as VoucherNo,  " &
                   " REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS VoucherDate,  " &
                   " isnull(OPM.LedgerID,0) as LedgerID, NULLIF (OPM.Remark, '') AS Remark, nullif(LM.LedgerName, '') AS LedgerName, nullif(UM.UserName, '') AS UserName,   " &
                   " nullif(JBC.JobCardContentNo,'') as JobCardContentNo, nullif(JBC.PlanContName,'') as PlanContName,NULL As Transporter,NULL As VehicleNo,OPM.DeliveryNoteNo,OPM.DeliveryNoteDate  FROM OutsourceProductionMain AS OPM INNER JOIN JobBookingJobCard AS JB  ON JB.JobBookingID = OPM.JobBookingID AND OPM.IsDeletedTransaction=0 And  " &
                   " JB.CompanyID = OPM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID And LM.CompanyID = OPM.CompanyID And LM.IsDeletedTransaction=0 INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID And OPM.CompanyID=UM.CompanyID   " &
                   " INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID And JBC.IsDeletedTransaction=0" &
                   " Where OPM.VoucherID=-51 And Isnull(OPM.IsChallanSend,0)=0 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID='" & GBLCompanyID & "'"
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

        Dim dt As New DataTable
        Dim PONo As String
        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim con As New SqlConnection
            con = db.OpenDataBase()

            PONo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            con.Close()
            KeyField = PONo
            '  End If

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
    Public Function FillCreatePIGrid(ByVal GetTransactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "SELECT DISTINCT  OPM.OutsourceID AS TransactionID, OPM.ParentOutsourceID AS PurchaseTransactionID, JB.JobName AS ItemName, OPM.JobBookingJobCardContentsID , OPM1.VoucherNo AS OutsourceSendNo, OPM.VoucherNo AS OutsourceReceiptNo, OPM.LedgerID, LM.LedgerName, OPD.JobCardFormNo, JBC.PlanContName, NULLIF (OPM.Transporter,'') AS Transporter, NULLIF(OPM.VehicleNo,'') AS VehicleNo,  PM.ProcessID, PM.ProcessName," &
              " ISNULL(OPD.QuantitySent, 0) AS PurchaseOrderQuantity, ISNULL(OPD.QuantityReceive, 0) AS ChallanQuantity, 0 AS PurchaseTolerance, PGM.ProductHSNName, PGM.HSNCode, PGM.ProductHSNID, PGM.GSTTaxPercentage, PGM.CGSTTaxPercentage, PGM.SGSTTaxPercentage, PGM.IGSTTaxPercentage,  NULLIF (OPM.FYear, '') AS FYear, NULLIF (OPM.Remark, '') AS Narration, ISNULL(OPD.QuantityReceive, 0)  AS ChargeQty, NULLIF(VPR.RateType,'') AS RateType, VPR.Rate AS PurchaseRate,VPR.MinimumCharges, 0 AS IsFlatRate " &
              " FROM ProcessMaster as PM INNER JOIN  OutsourceProductionDetails as OPD ON OPD.ProcessID = PM.ProcessID AND  PM.CompanyID = OPD.CompanyID   " &
              " INNER JOIN OutsourceProductionMain AS OPM ON OPM.OutsourceID = OPD.OutsourceID And OPM.CompanyID = OPD.CompanyID   " &
              " INNER JOIN OutsourceProductionMain AS OPM1 ON OPM1.OutsourceID = OPM.ParentOutsourceID AND OPM1.CompanyID = OPM.CompanyID   " &
              " INNER JOIN JobBookingJobCard AS JB  ON JB.JobBookingID = OPM.JobBookingID And JB.CompanyID = OPM.CompanyID    " &
              " INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID AND LM.CompanyID = OPM.CompanyID " &
              " INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID LEFT JOIN VendorWiseProcessRates As VPR On VPR.LedgerID=OPM.LedgerID And VPR.CompanyID=OPM.CompanyID And VPR.IsDeletedTransaction=0 And VPR.ProcessID=OPD.ProcessID And VPR.RateFactor=OPD.RateFactor CROSS JOIN (SELECT ProductHSNID, HSNCode, GSTTaxPercentage, CGSTTaxPercentage, SGSTTaxPercentage, IGSTTaxPercentage, DisplayName As ProductHSNName FROM ProductHSNMaster Where DisplayName = 'Service Charges' And IsDeletedTransaction=0) As PGM " &
              " Where OPM.VoucherID=-51 And Isnull(OPM.IsChallanSend,0)=0 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID='" & GBLCompanyID & "' and OPM.OutsourceID IN(" & GetTransactionID & ")"

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''Get GetAllHSN List From Database
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllHSN() As String

        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Distinct Isnull(ProductHSNID,0) as ProductHSNID,nullif(HSNCode,'') as HSNCode,nullif(ProductHSNName,'') as ProductHSNName,  " &
               " Isnull(GSTTaxPercentage,0) As GSTTaxPercentage,Isnull(CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(IGSTTaxPercentage,0) as IGSTTaxPercentage   " &
               "  From ProductHSNMaster Where CompanyID='" & GBLCompanyID & "' AND  Isnull(IsDeletedTransaction,0)=0 Order By nullif(ProductHSNName,'') asc "

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '---------------GET Vendor Name---------------------------------

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Supplier() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "Select Distinct A.[LedgerID],B.[LedgerGroupID],B.[LedgerGroupNameID],A.[CompanyID],A.[LedgerName],nullif(A.[MailingName],'') as MailingName,nullif(A.[City],'') as City,nullif(A.[State],'') as SupState,Isnull(S.[StateTinNo],0) AS StateTinNo,nullif(A.[Country],'') as Country,nullif(A.[MobileNo],'') as MobileNo,nullif(A.[GSTNo],'') AS GSTNo,nullif(A.[CurrencyCode],'') AS CurrencyCode,Isnull(A.[GSTApplicable],0) AS GSTApplicable,Isnull(C.stateTinNo,0) AS CompanyStateTinNo " &
                "From (Select Distinct [LedgerID],[LedgerGroupID], [CompanyID],[LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable] FROM (Select [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'') as FieldValue " &
                "FROM [LedgerMasterDetails] Where Isnull(IsDeletedTransaction,0)=0 " &
                ")x unpivot (value for name in ([FieldValue])) up " &
                "pivot (max(value) for FieldName in ([LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable])) p) AS A  " &
                "INNER JOIN LedgerGroupMaster AS B ON A.LedgerGroupID=B.LedgerGroupID And A.CompanyID = B.CompanyID And A.CompanyID = '" & GBLCompanyID & "' And B.LedgerGroupNameID=25 INNER JOIN CompanyMaster AS C ON C.CompanyID =A.CompanyID LEFT JOIN CountryStateMaster AS S ON S.State=A.State And Isnull(S.State,'')<>''" &
                "Where A.CompanyID='" & GBLCompanyID & "' And LedgerGroupNameID=25 "

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
                str2 = "Select nullif(CurrencyHeadName,'') as CurrencyHeadName,Nullif(CurrencyChildName,'') as CurrencyChildName From CurrencyMaster Where   CurrencyCode='" & CurrencyCode & "'"
                db.FillDataTable(dtCurrency, str2)
                Dim j As Integer = dtCurrency.Rows.Count
                If j > 0 Then
                    CurrencyHeadName = dtCurrency.Rows(0)(0)
                    CurrencyChildName = dtCurrency.Rows(0)(1)
                    NumberToWord = db.ReadNumber(TxtNetAmt, CurrencyHeadName, CurrencyChildName, CurrencyCode)
                End If
            End If

            PONo = db.GeneratePrefixedNo("OutSourceProductionPurchaseInvoiceMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
            If (db.CheckAuthories("OutsourceProductionPurchaseInvoice.aspx", GBLUserID, GBLCompanyID, "CanSave", PONo) = False) Then Return "You are not authorized to save..!, Can't Save"

            Using UpdtTran As New Transactions.TransactionScope

                TableName = "OutSourceProductionPurchaseInvoiceMain"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,AmountInWords"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "','" & NumberToWord & "'"
                TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)
                If IsNumeric(TransactionID) = False Then
                    UpdtTran.Dispose()
                    Return "Error: " & TransactionID
                End If

                TableName = "OutSourceProductionPurchaseInvoiceDetail"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    UpdtTran.Dispose()
                    Return "Error: " & str
                End If

                TableName = "OutSourceProductionPurchaseInvoiceTaxes"
                AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    UpdtTran.Dispose()
                    Return "Error: " & str
                End If

                'Dim s As String = TransactionID_String
                'Dim parts As String() = s.Split(",")
                'Dim word As String
                'For Each word In parts
                '    ' Console.WriteLine(word)
                '    str = ""
                '    str = "Update OtherItemTransactionMain Set IsPurchaseInvoiceCreated=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & word & "'"

                '    Dim cmd As New SqlCommand(str, con)
                '    cmd.CommandType = CommandType.Text
                '    cmd.Connection = con
                '    cmd.ExecuteNonQuery()
                'Next
                UpdtTran.Complete()
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
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

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
            If (db.CheckAuthories("OutsourceProductionPurchaseInvoice.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

            TableName = "OutSourceProductionPurchaseInvoiceMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "',AmountInWords='" & NumberToWord & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 1, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from OutSourceProductionPurchaseInvoiceDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "OutSourceProductionPurchaseInvoiceDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            db.ExecuteNonSQLQuery("Delete from OutSourceProductionPurchaseInvoiceTaxes WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "OutSourceProductionPurchaseInvoiceTaxes"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordTax, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
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
        str = "Select distinct Isnull(IPM.TransactionID,0) AS TransactionID,Isnull(IPM.VoucherID,0) AS VoucherID,Nullif(IPM.FYear,'') AS FYear,Isnull(IPM.MaxVoucherNo,0) AS MaxVoucherNo,Nullif(IPM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IPM.VoucherDate,106),' ','-') AS VoucherDate,    " &
               " Isnull(IPM.PurchaseLedgerID,0) As PurchaseLedgerID,Isnull(IPM.TotalQuantity,0) As TotalQuantity,Isnull(IPM.TotalBasicAmount,0) As TotalBasicAmount,    " &
               " Isnull(IPM.TotalDiscountAmount,0) As TotalDiscountAmount,Isnull(IPM.TotalCGSTTaxAmount,0) As TotalCGSTTaxAmount,Isnull(IPM.TotalSGSTTaxAmount,0) As TotalSGSTTaxAmount,    " &
               " Isnull(IPM.TotalIGSTTaxAmount,0) AS TotalIGSTTaxAmount,Isnull(IPM.TotalTaxAmount,0) AS TotalTaxAmount,Isnull(IPM.NetAmount,0) AS NetAmount,    " &
               " Isnull(IPM.InvoiceNo,0) AS InvoiceNo,Replace(Convert(Varchar(13),IPM.InvoiceDate,106),' ','-') AS InvoiceDate,Isnull(IPM.RoundOffValue,0) AS RoundOffValue,    " &
               " nullif(IPM.Narration,'') AS Narration,    " &
               " Nullif(IPO.VoucherNo,'') AS PONo,Nullif(ITM.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS GRNDate,Nullif(IPM.InvoiceNo,'') AS InvoiceNo,Replace(Convert(Varchar(13),IPM.InvoiceDate,106),' ','-') AS InvoiceDate,Nullif(LM.LedgerName,'') AS SupplierName,LM.LedgerID As SupplierID ,ITM.DeliveryNoteNo,Replace(Convert(Varchar(13),IPM.DeliveryNoteDate,106),' ','-') AS DeliveryNoteDate  " &
               " From OutSourceProductionPurchaseInvoiceMain AS IPM   " &
               " INNER JOIN OutSourceProductionPurchaseInvoiceDetail AS IPD ON IPM.TransactionID=IPD.TransactionID And IPM.CompanyID=IPD.CompanyID     " &
               " INNER JOIN OutsourceProductionMain AS ITM ON ITM.OutSourceID=IPD.ParentTransactionID And ITM.CompanyID=IPD.CompanyID  " &
               " And ITM.VoucherID=-51 INNER JOIN LedgerMaster AS LM ON LM.LedgerID=IPM.LedgerID And LM.CompanyID=IPM.CompanyID    " &
               " INNER JOIN OutsourceProductionMain AS IPO ON IPO.ParentOutSourceID=IPD.PurchaseTransactionID   " &
               " And IPO.CompanyID=IPD.CompanyID And IPO.VoucherID=-51  where IPO.CompanyID='" & GBLCompanyID & "' and isnull(IPM.IsDeletedTransaction,0)<>1 Order By FYear,TransactionID Desc"
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
        str = "Select Distinct Isnull(ITM.OutSourceID,0) AS TransactionID,Isnull(IPD.PurchaseTransactionID,0) AS PurchaseTransactionID,    " &
              "  Nullif(IPD.JobName,'') AS ItemName,  Nullif(ITPM.VoucherNo,'') AS PurchaseVoucherNo, Replace(Convert(Varchar(13),ITPM.VoucherDate,106),' ','-') AS PurchaseVoucherDate,     " &
              "  Isnull(IPD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,    Isnull(IPD.ChallanQuantity, 0) As ChallanQuantity, Isnull(IPD.ReceiptQuantity,0) AS ReceiptQuantity,Isnull(IPD.ReceiptRate,0) AS PurchaseRate,     " &
              "  Nullif(IPD.PurchaseUnit,'') as PurchaseUnit,Replace(Convert(Varchar(13),IPD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,isnull(IPD.PurchaseTolerance,0) AS PurchaseTolerance,Isnull(IPD.BasicAmount,0) AS BasicAmount,Isnull(IPD.DiscountPercentage,0) as Disc,     " &
              "  Isnull(IPD.DiscountAmount,0) as DiscountAmount,Isnull(IPD.GrossAmount,0) as AfterDisAmt,   Isnull(IPD.TaxableAmount,0) as TaxableAmount,Isnull(IPD.GSTPercentage,0) as GSTPercentage,        " &
              "  Isnull(IPD.CGSTPercentage, 0) As CGSTPercentage, Isnull(IPD.SGSTPercentage, 0) As SGSTPercentage,  Isnull(IPD.IGSTPercentage, 0) As IGSTPercentage, Isnull(IPD.CGSTAmount, 0) As CGSTAmt, Isnull(IPD.SGSTAmount, 0) As SGSTAmt,      " &
              "  Isnull(IPD.IGSTAmount, 0) As IGSTAmt, Isnull(IPD.NetAmount, 0) As TotalAmount,    Isnull(IPD.IGSTAmount, 0) As IGSTAmt,  0 As ReceiptQuantityComp,NULL AS CreatedBy,Nullif(IPD.ItemNarration,'') AS Narration,Nullif(IPD.FYear,'') AS FYear,     " &
              "  Nullif(PGM.ProductHSNName,'') AS ProductHSNName,Nullif(PGM.HSNCode,'') AS HSNCode,   Isnull(IPD.LandedAmount,'') AS LandedAmt,Isnull(IPD.LandedRate,'') AS LandedPrice ,   " &
              "  Isnull(IPD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID, Isnull(IPD.LedgerID,0) as LedgerID, Nullif(IPD.OutsourceSendNo,'') as OutsourceSendNo,   " &
              "  Nullif(IPD.OutsourceReceiptNo,'') as OutsourceReceiptNo, Nullif(IPD.JobCardFormNo,'') as JobCardFormNo, Nullif(IPD.PlanContName,'') as PlanContName,   " &
              "  Isnull(IPD.ChargeQty,0) as ChargeQty,Isnull(IPD.ProductHSNID,0) as ProductHSNID, Nullif(IPD.RateType,'') as RateType,Nullif(IPD.LedgerName,'') as LedgerName,   " &
              "  Isnull(IPD.IsFlatRate,0) as IsFlatRate ,Isnull(IPD.GSTPercentage,0) as GSTTaxPercentage,Isnull(IPD.CGSTPercentage,0) as CGSTTaxPercentage,Isnull(IPD.SGSTPercentage,0) as SGSTTaxPercentage,Isnull(IPD.IGSTPercentage,0) as IGSTTaxPercentage,Isnull(IPD.CGSTAmount,0) as CGSTAmt,Isnull(IPD.SGSTAmount,0) as SGSTAmt,Isnull(IPD.IGSTAmount,0) as IGSTAmt ,PM.ProcessName " &
              "  From OutSourceProductionPurchaseInvoiceMain As IPM         " &
              "  INNER Join OutSourceProductionPurchaseInvoiceDetail AS IPD ON IPD.TransactionID=IPM.TransactionID And IPD.CompanyID=IPM.CompanyID      " &
              "  INNER Join OutsourceProductionMain AS ITM ON ITM.OutSourceID=IPD.ParentTransactionID And ITM.CompanyID=IPD.CompanyID       " &
              "  INNER Join OutsourceProductionDetails AS ITD ON ITD.OutSourceID=ITM.OutSourceID And ITD.CompanyID=IPD.CompanyID       " &
              "  INNER Join OutsourceProductionDetails AS ITPD ON ITPD.OutSourceID=IPD.PurchaseTransactionID  And ITPD.CompanyID=IPD.CompanyID   " &
              "  INNER Join ProcessMaster As PM On PM.ProcessID=ITPD.ProcessID And PM.CompanyID=ITPD.CompanyID    " &
              "  INNER Join OutsourceProductionMain AS ITPM ON ITPM.OutSourceID=ITPD.OutSourceID And ITPM.CompanyID=ITPD.CompanyID      " &
              "  Left Join ProductHSNMaster AS PGM ON PGM.ProductHSNID=IPD.ProductHSNID And PGM.CompanyID=IPD.CompanyID     " &
              "  Where IPM.TransactionID ='" & transactionID & "' AND IPM.CompanyID='" & GBLCompanyID & "' "
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
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = " Select Isnull(LedgerID,0) AS LedgerID,Isnull(TransID,0) AS TransID,Isnull(TransactionID,0) AS TransactionID,Isnull(TaxRatePer,0) AS TaxRatePer,Isnull(ChargesAmount,0) AS ChargesAmount,isnull(InAmount,0) AS InAmount,  nullif(IsCumulative,'') AS IsCumulative,nullif(GSTApplicable,'') AS GSTApplicable,nullif(CalculateON,'') AS CalculateON,Nullif([LedgerName],'') AS LedgerName,Nullif([TaxType],'') AS TaxType, Nullif([GSTLedgerType],'') AS GSTLedgerType  " &
            " From(Select Isnull(IPOT.LedgerID, 0) As LedgerID,Isnull(IPOT.TransID,0) As TransID,Isnull(IPOT.TransactionID,0) As TransactionID,Isnull(IPOT.TaxPercentage,0) As TaxRatePer, Isnull(IPOT.Amount,0) AS ChargesAmount,isnull(IPOT.TaxInAmount,0) AS InAmount,  nullif(IPOT.IsComulative,'') AS IsCumulative,nullif(IPOT.GSTApplicable,'') AS GSTApplicable,nullif(IPOT.CalculatedON,'') AS CalculateON,[FieldName],nullif([FieldValue],'''') as FieldValue From OutSourceProductionPurchaseInvoiceTaxes As IPOT " &
            " INNER JOIN LedgerMasterDetails as LMD on LMD.LedgerID=IPOT.LedgerID AND LMD.CompanyID=IPOT.CompanyID  Where IPOT.CompanyID =" & GBLCompanyID & " and IPOT.TransactionID=" & transactionID & "  AND Isnull(IPOT.IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[TaxType],[GSTLedgerType])) p Order By TransID"

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
        If (db.CheckAuthories("OutsourceProductionPurchaseInvoice.aspx", GBLUserID, GBLCompanyID, "CanDelete", TxtPIID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

        Try

            str = "Update OutSourceProductionPurchaseInvoiceMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update OutSourceProductionPurchaseInvoiceDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update OutSourceProductionPurchaseInvoiceTaxes Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPIID & "'"
            db.ExecuteNonSQLQuery(str)

            'str = ""
            'str = "Update OtherItemTransactionMain Set IsPurchaseInvoiceCreated=0 Where TransactionID IN(Select Distinct ParentTransactionID From ItemPurchaseInvoiceDetail Where TransactionID='" & TxtPIID & "' AND CompanyID='" & GBLCompanyID & "') AND CompanyID='" & GBLCompanyID & "'"

            'Dim cmdU As New SqlCommand(str, con)
            'cmdU.CommandType = CommandType.Text
            'cmdU.Connection = con
            'cmdU.ExecuteNonQuery()

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