Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports Connection
Imports System.Collections.Generic
Imports System.Web.UI.WebControls
Imports System.Net
Imports System.IO
Imports System.Net.Mail

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebServiceRequisitionApproval
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBL_User_ID As String
    Dim GBL_User_Name As String
    Dim GBL_Branch_ID As String
    Dim GBLCompanyID As String
    Dim GBL_F_Year As String
    Dim User_Name As String

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

    '-----------------------------------Get UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UnApprovedRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct ITM.TransactionID, ITM.VoucherID, ITM.MaxVoucherNo, ITD.ItemGroupID, ITD.ItemID,ITM.VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo, " &
              " Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(ITM.Narration,'') AS Narration,(Select Count(TransactionID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID) AS TotalItems,Isnull(ITM.TotalQuantity,0) AS TotalQuantity,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy  " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsCancelled,0)=0 AND Isnull(ITD.IsAuditApproved,0)=1  Order By ITM.TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ApprovedRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct ITM.TransactionID, ITM.VoucherID, ITM.MaxVoucherNo, ITD.ItemGroupID, ITD.ItemID,ITM.VoucherNo, REPLACE(CONVERT(Varchar(13), ITM.VoucherDate, 106), ' ', '-') AS VoucherDate, IM.ItemCode, NULLIF (IGM.ItemGroupName, '') AS ItemGroupName, NULLIF (ISGM.ItemSubGroupName, '') AS ItemSubGroupName, IM.ItemName, NULLIF (ITD.RefJobCardContentNo, '') AS RefJobCardContentNo, ITD.RequiredQuantity, NULLIF (ITD.StockUnit, '') AS StockUnit, REPLACE(CONVERT(Varchar(13), ITD.ExpectedDeliveryDate, 106), ' ', '-') AS ExpectedDeliveryDate, NULLIF (ITD.ItemNarration, '') AS ItemNarration, NULLIF (ITM.Narration, '') AS Narration," &
              " (SELECT COUNT(TransactionID) AS Expr1 FROM ItemTransactionDetail WHERE (TransactionID = ITM.TransactionID) AND (CompanyID = ITM.CompanyID)) AS TotalItems, ITM.TotalQuantity, NULLIF (ITM.FYear, '') AS FYear, NULLIF (UA.UserName, '') AS CreatedBy, NULLIF (U.UserName, '') AS ApprovedBy, REPLACE(CONVERT(Varchar(13), ITD.VoucherItemApprovedDate, 106), ' ', '-') AS ApprovalDate, (SELECT TOP (1) TransactionID FROM ItemPurchaseRequisitionDetail WHERE (RequisitionTransactionID = ITD.TransactionID) AND (ItemID = ITD.ItemID) AND (CompanyID = ITD.CompanyID) And IsDeletedTransaction=0) AS PurchaseTransactionID " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UserMaster As U ON U.UserID=ITD.VoucherItemApprovedBy AND U.CompanyID=ITD.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsVoucherItemApproved,0)=1  Order By ITM.TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Cancelled Requisition ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CancelledRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct ITM.TransactionID, ITM.VoucherID, ITM.MaxVoucherNo, ITD.ItemGroupID, ITD.ItemID,ITM.VoucherNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo, " &
              " Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(ITD.ItemNarration,'') AS ItemNarration,NullIf(ITM.Narration,'') AS Narration,(Select Count(TransactionID) From ItemTransactionDetail Where TransactionID=ITM.TransactionID AND CompanyID=ITM.CompanyID) AS TotalItems,Isnull(ITM.TotalQuantity,0) AS TotalQuantity,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,NullIf(U.UserName,'') AS ApprovedBy,Replace(Convert(Varchar(13),ITD.VoucherItemApprovedDate,106),' ','-') AS ApprovalDate,Isnull((Select Top 1  TransactionID From ItemPurchaseRequisitionDetail Where RequisitionTransactionID= ITD.TransactionID AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0) AS  PurchaseTransactionID  " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UserMaster As U ON U.UserID=ITD.VoucherItemApprovedBy AND U.CompanyID=ITD.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsCancelled,0)=1  Order By ITM.TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AuditUnApprovedRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct ITM.TransactionID,ITM.VoucherID,ITM.MaxVoucherNo,ITD.ItemGroupID,ITD.ItemID AS RequisitionItemID,ITM.VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(ITM.Narration,'') AS Narration,Isnull(ITM.TotalQuantity,0) AS TotalQuantity,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved  " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsAuditApproved,0)=0 And Isnull(ITD.IsAuditCancelled,0)=0 Order By ITM.TransactionID Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit UnApproved Requisition Detail List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AuditUnApprovedRequisitionDetails() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS RequisitionTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(IDM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS RequisitionItemID,Isnull(ID.ItemID,0) AS IndentItemID,NullIf(IDM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IDM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ID.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ID.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(IDM.Narration,'') AS Narration,NullIf(IDM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy  " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=ITM.TransactionID AND ID.RequisitionItemID=ITD.ItemID AND ID.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IDM ON IDM.TransactionID=ID.TransactionID AND IDM.CompanyID=ID.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ID.ItemID AND IM.CompanyID=ID.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=IDM.CreatedBy AND UA.CompanyID=IDM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsVoucherItemApproved,0)=0 And Isnull(ITD.IsAuditApproved,0)=0 And Isnull(ITD.IsAuditCancelled,0)=0 Order By FYear,MaxVoucherNo Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit UnApproved Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AuditApprovedRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS RequisitionItemID,NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(ITM.Narration,'') AS Narration,Isnull(ITM.TotalQuantity,0) AS TotalQuantity,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,NullIf(U.UserName,'') AS ApprovedBy,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID INNER JOIN UserMaster As U ON U.UserID=ITD.AuditApprovedBy AND U.CompanyID=ITD.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsAuditApproved,0)=1 And Isnull(ITD.IsAuditCancelled,0)=0 Order By FYear,MaxVoucherNo Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit UnApproved Requisition Detail List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AuditApprovedRequisitionDetails() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS RequisitionTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(IDM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS RequisitionItemID,Isnull(ID.ItemID,0) AS IndentItemID,NullIf(IDM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IDM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ID.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ID.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(IDM.Narration,'') AS Narration,NullIf(IDM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=ITM.TransactionID AND ID.RequisitionItemID=ITD.ItemID AND ID.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IDM ON IDM.TransactionID=ID.TransactionID AND IDM.CompanyID=ID.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ID.ItemID AND IM.CompanyID=ID.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=IDM.CreatedBy AND UA.CompanyID=IDM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsAuditApproved,0)=1 AND Isnull(ITD.AuditApprovedBy,0)>0  And Isnull(ITD.IsAuditCancelled,0)=0 Order By FYear,MaxVoucherNo Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit Cancelled Requisition List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CancelledAuditRequisitions() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(ITD.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS RequisitionItemID,NullIf(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ITD.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ITD.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(ITM.Narration,'') AS Narration,Isnull(ITM.TotalQuantity,0) AS TotalQuantity,NullIf(ITM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy,NullIf('','') AS ApprovedBy,Isnull(ITD.IsVoucherItemApproved,0) AS IsVoucherItemApproved " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=ITM.CreatedBy AND UA.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsAuditApproved,0)=0 AND Isnull(ITD.IsAuditCancelled,0)=1  Order By FYear,MaxVoucherNo Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Audit Cancelled Requisition Detail List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CancelledAuditRequisitionDetails() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        str = "Select Distinct Isnull(ITM.TransactionID,0) AS RequisitionTransactionID,Isnull(ITM.VoucherID,0) AS VoucherID,Isnull(IDM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ITD.ItemID,0) AS RequisitionItemID,Isnull(ID.ItemID,0) AS IndentItemID,NullIf(IDM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IDM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.RefJobCardContentNo,'') AS RefJobCardContentNo,Isnull(ID.RequiredQuantity,0) AS RequiredQuantity,NullIf(ITD.StockUnit,'') AS StockUnit,NullIf(ID.ItemNarration,'') AS ItemNarration,Replace(Convert(Varchar(13),ITD.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,NullIf(IDM.Narration,'') AS Narration,NullIf(IDM.FYear,'') AS FYear,NullIf(UA.UserName,'') AS CreatedBy " &
              " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail As ITD ON ITD.TransactionID=ITM.TransactionID AND ITD.CompanyID=ITM.CompanyID INNER JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=ITM.TransactionID AND ID.RequisitionItemID=ITD.ItemID AND ID.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IDM ON IDM.TransactionID=ID.TransactionID AND IDM.CompanyID=ID.CompanyID INNER JOIN ItemMaster As IM ON IM.ItemID=ID.ItemID AND IM.CompanyID=ID.CompanyID INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster As UA ON UA.UserID=IDM.CreatedBy AND UA.CompanyID=IDM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID " &
              " Where Isnull(ITM.VoucherID,0) =-9 And ITM.CompanyID=" & GBLCompanyID & " And Isnull(ITM.IsDeletedTransaction,0)=0 And Isnull(ITD.IsAuditApproved,0)=0  AND Isnull(ITD.IsAuditCancelled,0)=1 Order By FYear,MaxVoucherNo Desc"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Close Master code---------------------------------

    ''----------------------------Open PickListStatus  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateData(ByVal BtnText As String, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBL_User_ID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBL_F_Year = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "ItemTransactionDetail"
            AddColName = ""
            wherecndtn = ""
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
            KeyField = db.UpdateDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, 2, wherecndtn)

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Update Audit Approval Data------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateRequisitionAuditData(ByVal BtnText As String, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBL_User_ID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBL_F_Year = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim dtExist As New DataTable

            TableName = "ItemTransactionDetail"
            AddColName = ""
            wherecndtn = ""
            If BtnText = "Approve" Then
                AddColName = "IsAuditApproved=1,AuditApprovedBy=" & GBL_User_ID & ",AuditApprovedDate='" & DateTime.Now & "',IsAuditCancelled=0,AuditCancelledBy=0"
            ElseIf BtnText = "UnApprove" Then
                AddColName = "IsAuditApproved=0,AuditApprovedBy=" & GBL_User_ID & ",AuditApprovedDate='" & DateTime.Now & "',IsAuditCancelled=0,AuditCancelledBy=0"
            ElseIf BtnText = "Cancel" Then
                AddColName = "IsAuditApproved=0,AuditApprovedBy=0,AuditApprovedDate='" & DateTime.Now & "',IsAuditCancelled=1,AuditCancelledBy=" & GBL_User_ID & ",AuditCancelledDate='" & DateTime.Now & "'"
            ElseIf BtnText = "UnCancel" Then
                AddColName = "IsAuditApproved=0,AuditApprovedBy=" & GBL_User_ID & ",IsAuditCancelled=0,AuditCancelledBy=0,AuditCancelledDate='" & DateTime.Now & "'"
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