Imports System.Web
Imports System.Web.Services
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
Public Class WebService_ItemPurchaseGRS
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

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetGRSNO(ByVal prefix As String) As String

        Dim dt As New DataTable
        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            KeyField = db.GeneratePrefixedNo("GRSTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get GRS Vouchers List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GRSVouchersList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = " Select Distinct GTM.GRSTransactionID,GTM.GRNTransactionID,GTM.LedgerID,ITM.ReceivedBy AS ReceivedByID,GTM.MaxVoucherNo,GTM.VoucherNo,Replace(Convert(nvarchar(30),GTM.VoucherDate ,106),'','-') As VoucherDate,ITM.VoucherNo AS GRNNo,Replace(Convert(nvarchar(30),ITM.VoucherDate ,106),'','-') As GRNDate, Nullif(LM.LedgerName,'') AS LedgerName,Nullif(GTM.TransporterBillNo,'') AS TransporterBillNo,Nullif(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(nvarchar(30),ITM.DeliveryNoteDate,106),'','-') As DeliveryNoteDate,Nullif(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(nvarchar(30),ITM.GateEntryDate ,106),'','-') As GateEntryDate,Nullif(GTM.Transporter,'') AS Transporter,Nullif(GTM.LRNOVehicleNo,'') AS LRNOVehicleNo,Nullif(EM.LedgerName,'') AS ReceivedBy,Nullif(ITM.Narration,'') AS GRNNarration, Nullif(GTM.Narration,'') AS Narration,Nullif(GTM.FYear,'') AS FYear " &
                  " From GRSTransactionMain AS GTM INNER JOIN GRSTransactionDetail AS GTD ON GTD.GRSTransactionID=GTM.GRSTransactionID AND GTD.CompanyID=GTM.CompanyID INNER JOIN ItemTransactionMain AS ITM ON ITM.TransactionID=GTM.GRNTransactionID AND ITM.CompanyID=GTM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID=GTM.LedgerID AND LM.CompanyID=GTM.CompanyID INNER JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID " &
                  " Where GTM.CompanyID=" & GBLCompanyID & " AND Isnull(GTM.IsDeletedTransaction,0)<>1 Order By FYear Asc,GTM.MaxVoucherNo Desc"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Issue Voucher Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetGRNList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Distinct ITM.VoucherID,ITM.TransactionID AS GRNTransactionID,ITM.LedgerID,ITM.ReceivedBy AS ReceivedByID,ITM.MaxVoucherNo,ITM.VoucherNo AS GRNNo,Replace(Convert(nvarchar(30),ITM.VoucherDate ,106),'','-') AS GRNDate,LM.LedgerName,Nullif(ITM.DeliveryNoteNo,'') AS DeliveryNoteNo,Replace(Convert(nvarchar(30),ITM.DeliveryNoteDate ,106),'','-') As DeliveryNoteDate,Nullif(ITM.GateEntryNo,'') AS GateEntryNo,Replace(Convert(nvarchar(30),ITM.GateEntryDate ,106),'','-') As GateEntryDate,Nullif(ITM.Transporter,'') AS Transporter,Nullif(ITM.LRNoVehicleNo,'') AS LRNOVehicleNo,NULLIF(EM.LedgerName,'') AS ReceivedBy,NULLIF(ITM.Narration,'') AS GRNNarration,ITM.FYear " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITD.ParentTransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID AND Isnull(ITD.PurchaseTransactionID,0)>0 INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=ITM.ReceivedBy AND EM.CompanyID=ITM.CompanyID " &
                  " Where ITM.VoucherID=-14 AND ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITM.IsDeletedTransaction,0)=0 AND ITM.FYear='" & GBLFYear & "' Order By ITM.FYear Asc, ITM.MaxVoucherNo Desc"


            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get GRN Voucher Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetGRNDetails(ByVal GRNTransactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Distinct 0 AS Sel, ITM.VoucherID,ITM.TransactionID AS GRNTransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,ITD.ItemID,IGM.ItemGroupID,IGM.ItemGroupNameID, ITPM.VoucherNo AS PONo,IM.ItemCode,IGM.ItemGroupName,IM.ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Sum(Isnull(ITD.ChallanQuantity,0)) AS ChallanQuantity,ROUND(Avg(Isnull(ITD.ReceiptWtPerPacking,0)),6) AS ReceiptWtPerPacking, Nullif(IM.StockUnit,'') AS StockUnit,Nullif(IM.PurchaseUnit,'') AS PurchaseUnit,Nullif(CM.ConversionFormula,'') AS ConversionFormula,Isnull(CM.ConvertedUnitDecimalPlace,0) AS ConvertedUnitDecimalPlace,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.SizeW,0) AS SizeW " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITD.ParentTransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID AND Isnull(ITD.PurchaseTransactionID,0)>0 INNER JOIN LedgerMaster AS LM ON LM.LedgerID=ITM.LedgerID AND LM.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN ItemTransactionMain AS ITPM ON ITPM.TransactionID=ITD.PurchaseTransactionID AND ITPM.CompanyID=ITD.CompanyID LEFT JOIN ConversionMaster AS CM ON CM.BaseUnitSymbol=IM.StockUnit AND CM.ConvertedUnitSymbol=IM.PurchaseUnit AND ITPM.CompanyID=ITD.CompanyID " &
                  " Where ITM.VoucherID=-14 AND ITM.CompanyID=" & GBLCompanyID & " AND ITM.TransactionID=" & GRNTransactionID & " AND Isnull(ITM.IsDeletedTransaction,0)=0  " &
                  " GROUP BY ITM.VoucherID,ITM.TransactionID,ITD.PurchaseTransactionID,ITM.LedgerID,ITD.ItemID,IGM.ItemGroupID,IGM.ItemGroupNameID,ITPM.VoucherNo,IM.ItemCode,IGM.ItemGroupName,IM.ItemName,IM.ItemDescription,IM.StockUnit,IM.PurchaseUnit,CM.ConversionFormula,CM.ConvertedUnitDecimalPlace,IM.SizeW,IM.UnitPerPacking,IM.WtPerPacking"


            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '-----------------------------------Get Overhead Grid Data------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RefreshOverheadGrid(ByVal FlagStatus As String, ByVal GRSTransactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If FlagStatus = "Update" Then
                str = "Select 0 AS Sel,PH.HeadID,PH.Head,PH.RateType,Isnull(A.Quantity,0) AS QtyWeight,Isnull(A.Rate,0) AS Rate,Isnull(A.Amount,0) AS Amount  From PurchaseHeadMaster AS PH LEFT JOIN GRSTransactionDetail AS A ON A.HeadID=PH.HeadID AND A.CompanyID=PH.CompanyID AND A.GRSTransactionID=" & GRSTransactionID & " AND A.CompanyID=" & GBLCompanyID & " Where PH.CompanyID=" & GBLCompanyID & " Order By PH.HeadID"
            Else
                str = "Select 0 AS Sel, HeadID,Head,RateType,0 AS QtyWeight,0 AS Rate,0 AS Amount From PurchaseHeadMaster Where CompanyID=" & GBLCompanyID & " Order By HeadID"
            End If

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------Open GRS  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveGRSData(ByVal prefix As String, ByVal jsonObjectsGRSTransactionMain As Object, ByVal jsonObjectsGRSTransactionDetail As Object, ByVal jsonObjectsGRSItemTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim VoucherNo As String
        Dim MaxVoucherNo As Long
        Dim KeyField, str2, GRSTransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            VoucherNo = db.GeneratePrefixedNo("GRSTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where IsDeletedTransaction=0 And VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            TableName = "GRSTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
            GRSTransactionID = db.InsertDatatableToDatabase(jsonObjectsGRSTransactionMain, TableName, AddColName, AddColValue)
            If IsNumeric(GRSTransactionID) = False Then
                Return "fail " & GRSTransactionID
            End If

            TableName = "GRSTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GRSTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GRSTransactionID & "'"
            str = db.InsertDatatableToDatabase(jsonObjectsGRSTransactionDetail, TableName, AddColName, AddColValue)

            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From GRSTransactionMain Where GRSTransactionID=" & GRSTransactionID & " And CompanyID=" & GBLCompanyID)
                Return "fail " & str
            End If

            TableName = "GRSItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GRSTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GRSTransactionID & "'"
            str = db.InsertDatatableToDatabase(jsonObjectsGRSItemTransactionDetail, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From GRSTransactionMain Where GRSTransactionID=" & GRSTransactionID & " And CompanyID=" & GBLCompanyID)
                db.ExecuteNonSQLQuery("Delete From GRSTransactionDetail Where GRSTransactionID=" & GRSTransactionID & " And CompanyID=" & GBLCompanyID)
                Return "fail " & str
            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open GRS  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateGRS(ByVal GRSTransactionID As String, ByVal jsonObjectsGRSTransactionMain As Object, ByVal jsonObjectsGRSTransactionDetail As Object, ByVal jsonObjectsGRSItemTransactionDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        Try

            Dim dtExist As New DataTable

            TableName = "GRSTransactionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And GRSTransactionID='" & GRSTransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsGRSTransactionMain, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from GRSTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and GRSTransactionID='" & GRSTransactionID & "' ")
            db.ExecuteNonSQLQuery("Delete from GRSItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and GRSTransactionID='" & GRSTransactionID & "' ")

            TableName = "GRSTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GRSTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GRSTransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsGRSTransactionDetail, TableName, AddColName, AddColValue)

            TableName = "GRSItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,GRSTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & GRSTransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsGRSItemTransactionDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open GRS Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteGRSVoucher(ByVal GRSTransactionID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            str = ""
            str = "Update GRSTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and GRSTransactionID='" & GRSTransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update GRSTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and GRSTransactionID='" & GRSTransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update GRSItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and GRSTransactionID='" & GRSTransactionID & "'"
            db.ExecuteNonSQLQuery(str)

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