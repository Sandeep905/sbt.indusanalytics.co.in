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
Public Class WebService_PurchaseRequisition
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

    <WebMethod()>
    <ScriptMethod()>
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
    '-----------------------------------Get Indent List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function FillGrid(ByVal RadioValue As String, ByVal FilterString As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        If RadioValue = "Indent List" Then

            str = "Select Isnull(IEM.TransactionID,0) as TransactionID,Isnull(IEM.MaxVoucherNo,0) as MaxVoucherNo,Isnull(IEM.VoucherID,0) as VoucherID,nullif(IEM.VoucherNo,'') as VoucherNo,replace(convert(nvarchar(30),IEM.VoucherDate,106),' ','-') as VoucherDate,Isnull(IED.ItemID,0) as ItemID,Isnull(IM.ItemGroupID,0) as ItemGroupID,	 " &
                " Isnull(IGM.ItemGroupNameID,0) as ItemGroupNameID,Isnull(JBC.JobBookingID,0) as BookingID,Isnull(JBC.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,nullif(IGM.ItemGroupName,'') as ItemGroupName,nullif(ISGM.ItemSubGroupName,'') as ItemSubGroupName,nullif(IM.ItemCode,'') as ItemCode,	 nullif(IM.ItemName,'') as ItemName, " &
                " nullif(IM.ItemDescription,'') as ItemDescription,nullif(JBC.JobCardContentNo,'') AS JobBookingContentNo,Isnull(IED.RequiredQuantity,0) as RequiredQuantity,Isnull(IM.BookedStock,0) as BookedStock,Isnull(IM.AllocatedStock,0) as AllocatedStock,	 Isnull(IM.PhysicalStock,0) as PhysicalStock,nullif(IED.StockUnit,'') as StockUnit,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,nullif(IM.PurchaseUnit,'') as PurchaseUnit,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.ConversionFactor,0) AS ConversionFactor,Isnull(IM.SizeW,0) AS SizeW,Nullif(C.ConversionFormula,'') AS ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS ConvertedUnitDecimalPlace,(Select Top 1 Replace(Convert(Varchar(13),A.VoucherDate,106),' ','-') FRom ItemTransactionMain AS A INNER JOIN ItemTransactionDetail as B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND B.ItemID=IED.ItemID Where A.VoucherID=-11 AND A.CompanyID =IED.CompanyID AND Isnull(A.IsDeletedTransaction,0)=0 Order By A.VoucherDate Desc) AS LastPurchaseDate " &
                " From ItemTransactionMain AS IEM INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID AND IEM.CompanyID=IED.CompanyID	INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID	 LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID	 LEFT JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingJobCardContentsID=IED.JobBookingJobCardContentsID And JBC.JobBookingID=IED.JobBookingID And JBC.CompanyID=IED.CompanyID  " &
                " LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID LEFT JOIN ConversionMaster AS C ON IM.StockUnit=C.BaseUnitSymbol AND IM.PurchaseUnit=C.ConvertedUnitSymbol And IM.CompanyID=C.CompanyID  Where IEM.VoucherID IN(-8)	and IM.CompanyID=" & GBLCompanyID & "	AND Isnull(IED.RequisitionTransactionID,0)=0 and Isnull(IEM.IsDeletedTransaction,0)<>1	" &
                " UNION ALL Select 0 as TransactionID,0 as MaxVoucherNo,0 as VoucherID,nullif('','') as VoucherNo,nullif('','') as VoucherDate,Isnull(IM.ItemID,0) as ItemID,Isnull(IM.ItemGroupID,0) as ItemGroupID,Isnull(IGM.ItemGroupNameID,0) as ItemGroupNameID, 0 as BookingID,0 as JobContentsID,nullif(IGM.ItemGroupName,'') as ItemGroupName, " &
                " nullif(ISGM.ItemSubGroupName,'') as ItemSubGroupName,nullif(IM.ItemCode,'') as ItemCode,nullif(IM.ItemName,'') as ItemName,nullif(IM.ItemDescription,'') as ItemDescription,nullif('','') AS JobBookingContentNo,	 Isnull(Nullif(IM.PurchaseOrderQuantity,''),0) as RequiredQuantity,nullif(IM.BookedStock,'') as BookedStock, " &
                " nullif(IM.AllocatedStock,'') as AllocatedStock,	Isnull(IM.PhysicalStock,0) as PhysicalStock,nullif(IM.StockUnit,'') as StockUnit,Isnull(U.DecimalPlace,0) AS UnitDecimalPlace,nullif(IM.PurchaseUnit,'') as PurchaseUnit,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.ConversionFactor,0) AS ConversionFactor,Isnull(IM.SizeW,0) AS SizeW,Nullif(C.ConversionFormula,'') AS ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS ConvertedUnitDecimalPlace,(Select Top 1 Replace(Convert(Varchar(13),A.VoucherDate,106),' ','-') FRom ItemTransactionMain AS A INNER JOIN ItemTransactionDetail as B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND B.ItemID=IM.ItemID Where A.VoucherID=-11 AND A.CompanyID =IM.CompanyID AND Isnull(A.IsDeletedTransaction,0)=0 Order By A.VoucherDate Desc) AS LastPurchaseDate	 " &
                " From ItemMaster AS IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS U ON U.UnitSymbol=IM.StockUnit And U.CompanyID=IM.CompanyID LEFT JOIN ConversionMaster AS C ON IM.StockUnit=C.BaseUnitSymbol AND IM.PurchaseUnit=C.ConvertedUnitSymbol And IM.CompanyID=C.CompanyID Where IM.CompanyID=" & GBLCompanyID & " AND Isnull(IM.IsDeletedTransaction,0)<>1 AND  " &
                " Isnull(IM.IsRegularItem,0)='1' AND Isnull(IM.MinimumStockQty,0)>Isnull(IM.PhysicalStock,0) AND IM.ItemID NOT IN(Select Distinct IED.ItemID From ItemTransactionMain AS IEM INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID AND IEM.CompanyID=IED.CompanyID  Where IEM.VoucherID IN(-8) And IEM.CompanyID=" & GBLCompanyID & " And Isnull(IED.IsDeletedTransaction,0)<>1 AND Isnull(IED.RequisitionTransactionID,0)=0) Order By ItemGroupName,ItemName ,VoucherDate"
        Else
            ' str = "Select Isnull(IEM.TransactionID,0) AS TransactionID,Isnull(IEM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IEM.VoucherID,0) AS VoucherID, " &
            '" Isnull(IED.ItemID,0) As ItemID,Isnull(IED.TransID,0) As TransID, Isnull(IM.ItemGroupID,0) As ItemGroupID, " &
            ' "Isnull(IGM.ItemGroupNameID, 0) As ItemGroupNameID,NullIf(IEM.VoucherNo,'') AS VoucherNo, " &
            ' "Replace(Convert(Varchar(30), IEM.VoucherDate, 106),' ','-') AS VoucherDate,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf('','') AS ItemCode, " &
            ' " NullIf(IM.ItemName,'') AS ItemName,NullIf(IM.ItemDescription,'') AS ItemDescription,Isnull(IED.RequiredQuantity,0) AS PurchaseQty,0 AS RequisitionQty, " &
            ' " Isnull(IM.BookedStock, 0) As BookedStock, Isnull(IM.AllocatedStock, 0) As AllocatedStock, Isnull(IM.PhysicalStock, 0) As PhysicalStock,  " &
            '  "NullIf(IED.StockUnit,'') AS StockUnit,NullIf(IED.StockUnit,'') AS OrderUnit,Replace(Convert(Varchar(30),IED.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, " &
            '  "Nullif(IED.ItemNarration,'') AS ItemNarration,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace From ItemTransactionMain AS IEM  INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID  " &
            '  "And IEM.CompanyID=IED.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID INNER JOIN  " &
            '  "ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID  " &
            '         "Where IEM.VoucherID IN(-9) AND IEM.CompanyID=" & GBLCompanyID & "	and Isnull(IM.IsDeletedTransaction,0)<>1"
            str = " Select Distinct IEM.JobBookingID,Isnull(IEM.TransactionID,0) AS TransactionID,Isnull(IEM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IEM.VoucherID,0) AS VoucherID,Isnull(IED.ItemID,0) As ItemID,Isnull(IED.TransID,0) As TransID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID, Isnull(IGM.ItemGroupNameID, 0) As ItemGroupNameID,  NullIf(IEM.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(30), IEM.VoucherDate, 106),' ','-') AS VoucherDate,NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(IM.ItemCode,'') AS ItemCode, NullIf(IM.ItemName,'') AS ItemName, NullIf(IM.ItemDescription,'') AS ItemDescription,Nullif(JBJC.JobbookingNo,'') AS RefJobCardContentNo,Isnull(IED.RequiredQuantity,0) AS PurchaseQty,  Isnull(IED.RequiredQuantity,0) AS RequisitionQty,  Isnull(IM.BookedStock, 0) As BookedStock, Isnull(IM.AllocatedStock, 0) As AllocatedStock, Isnull(IM.PhysicalStock, 0) As PhysicalStock,  NullIf(IM.StockUnit,'') AS StockUnit,  NullIf(IED.StockUnit,'') AS OrderUnit,Replace(Convert(Varchar(30),IED.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate,  " &
                 " Nullif(IED.ItemNarration,'') AS ItemNarration,Nullif(IEM.Narration,'') AS Narration,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,NullIf(IEM.FYear,'') AS FYear,NullIf(UM.UserName,'') AS CreatedBy,NullIf(UA.UserName,'') AS ApprovedBy,Isnull(IED.IsAuditApproved,0) As AuditApproved,Isnull(IED.AuditApprovedBy,0) AS AuditApprovedBy,Isnull(IED.IsAuditCancelled,0) AS IsAuditCancelled,Isnull(IED.IsVoucherItemApproved,0) AS IsVoucherItemApproved,Isnull(IED.IsCancelled,0) AS IsCancelled,NullIf(IM.PurchaseUnit,'') AS PurchaseUnit   " &
                 " From ItemTransactionMain AS IEM  INNER JOIN  ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID  And IEM.CompanyID=IED.CompanyID left join JobBookingJobCard as JBJC on IEM.JobBookingID = JBJC.JobBookingID INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID INNER JOIN  ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID LEFT JOIN UserMaster AS UM ON UM.UserID=IEM.CreatedBy And UM.CompanyID=IEM.CompanyID LEFT JOIN UserMaster AS UA ON UA.UserID=IED.VoucherItemApprovedBy And UA.CompanyID=IED.CompanyID    " &
                 " Where IEM.VoucherID IN(-9) AND IEM.CompanyID=" & GBLCompanyID & " " & FilterString & " And Isnull(IEM.IsDeletedTransaction,0)<>1 Order By FYear,MaxVoucherNo Desc"

        End If

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    '-----------------------------------Get Indent List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetriveRequisitionData(ByVal TransactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        'str = " Select Distinct Isnull(IEM.TransactionID,0) AS RequisitionTransactionID,Isnull(IED.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(IEM.MaxVoucherNo,0) AS RequisitionMaxVoucherNo,Isnull(IEM.VoucherID,0) AS RequisitionVoucherID, Isnull(ID.TransactionID,0) AS TransactionID,Isnull(I.MaxVoucherNo,0) AS MaxVoucherNo, Isnull(I.VoucherID,0) AS VoucherID,  " &
        '        " Isnull(IED.ItemID,0) As ItemID,Isnull(IED.TransID,0) As TransID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,  Isnull(IGM.ItemGroupNameID, 0) As ItemGroupNameID, " &
        '        " NullIf(I.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(30), I.VoucherDate, 106),' ','-') AS VoucherDate,NullIf(IEM.VoucherNo,'') AS RequisitionVoucherNo, Replace(Convert(Varchar(30), IEM.VoucherDate, 106),' ','-') AS RequisitionVoucherDate, " &
        '        " NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(IM.ItemCode,'') AS ItemCode,  NullIf(IM.ItemName,'') AS ItemName,NullIf(IM.ItemDescription,'') AS ItemDescription,Isnull(IED.RequiredQuantity,0) AS PurchaseQty, " &
        '        " Isnull((Select ROUND(Sum(Isnull(RequiredQuantity,0)),3) From ItemTransactionDetail Where RequisitionTransactionID=IED.TransactionID AND ItemID=IED.ItemID AND CompanyID=IED.CompanyID),0) AS RequisitionQty,  Isnull(IM.BookedStock, 0) As BookedStock, Isnull(IM.AllocatedStock, 0) As AllocatedStock, Isnull(IM.PhysicalStock, 0) As PhysicalStock,  NullIf(IED.StockUnit,'') AS StockUnit, " &
        '        " NullIf(IED.StockUnit,'') AS OrderUnit,Replace(Convert(Varchar(30),IED.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, Nullif(IED.ItemNarration,'') AS ItemNarration,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,NullIf(IEM.FYear,'') AS FYear,Nullif(JBC.JobCardContentNo,'') AS JobCardNo " &
        '        " From ItemTransactionMain AS IEM  INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID  And IEM.CompanyID=IED.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID " &
        '        " INNER JOIN  ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID LEFT JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=IED.TransactionID  And ID.RequisitionItemID=IED.ItemID And ID.CompanyID=IED.CompanyID  " &
        '        " LEFT JOIN ItemTransactionMain AS I ON I.TransactionID=ID.TransactionID  And I.CompanyID=ID.CompanyID LEFT JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingJobCardContentsID=I.JobBookingJobCardContentsID And JBC.JobBookingID=I.JobBookingID And JBC.CompanyID=I.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID  Where IEM.VoucherID IN(-9) AND IEM.CompanyID=" & GBLCompanyID & " And IEM.TransactionID=" & TransactionID & " and Isnull(IM.IsDeletedTransaction,0)<>1 Order By FYear,RequisitionMaxVoucherNo Desc"

        str = " Select Distinct Isnull(IEM.TransactionID,0) AS RequisitionTransactionID,Isnull(IED.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(IEM.MaxVoucherNo,0) AS RequisitionMaxVoucherNo,Isnull(IEM.VoucherID,0) AS RequisitionVoucherID, Isnull(ID.TransactionID,0) AS TransactionID,Isnull(I.MaxVoucherNo,0) AS MaxVoucherNo, Isnull(I.VoucherID,0) AS VoucherID,   Isnull(IED.ItemID,0) As RequisitionItemID,Isnull(ID.ItemID,0) As ItemID,Isnull(IED.TransID,0) As TransID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,  Isnull(IGM.ItemGroupNameID, 0) As ItemGroupNameID,  NullIf(I.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(30), I.VoucherDate, 106),' ','-') AS VoucherDate, " &
              " NullIf(IEM.VoucherNo,'') AS RequisitionVoucherNo, Replace(Convert(Varchar(30), IEM.VoucherDate, 106),' ','-') AS RequisitionVoucherDate,  NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(IM.ItemCode,'') AS RequisitionItemCode,  NullIf(IM.ItemName,'') AS RequisitionItemName,NullIf(IM.ItemDescription,'') AS RequisitionItemDescription,NullIf(M.ItemCode,'') AS ItemCode,NullIf(M.ItemName,'') AS ItemName,NullIf(M.ItemDescription,'') AS ItemDescription,Isnull(IED.RequiredQuantity,0) AS PurchaseQty,  Isnull((Select ROUND(Sum(Isnull(RequiredQuantity,0)),3) From ItemTransactionDetail Where RequisitionTransactionID=IED.TransactionID AND RequisitionItemID=IED.ItemID AND CompanyID=IED.CompanyID),0) AS TotalRequisitionQty,Isnull(ID.RequiredQuantity,0) AS  RequisitionQty, " &
              " Isnull(IM.BookedStock, 0) As RequisitionBookedStock, Isnull(IM.AllocatedStock, 0) As RequisitionAllocatedStock, Isnull(IED.CurrentStockInStockUnit, 0) As RequisitionPhysicalStock,Isnull(IED.CurrentStockInPurchaseUnit, 0) As RequisitionPhysicalStockInPurchaseUnit,Isnull(M.BookedStock, 0) As BookedStock, Isnull(M.AllocatedStock, 0) As AllocatedStock, Isnull(M.PhysicalStock, 0) As PhysicalStock,  NullIf(IM.StockUnit,'') AS StockUnit,  NullIf(IED.StockUnit,'') AS OrderUnit,Replace(Convert(Varchar(30),IED.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, Nullif(IED.ItemNarration,'') AS ItemNarration,NullIf(IM.PurchaseUnit,'') AS PurchaseUnit,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,NullIf(IEM.FYear,'') AS FYear,Nullif(JBC.JobCardContentNo,'') AS JobCardNo,Nullif(IED.RefJobCardContentNo,'') AS RefJobCardContentNo,Nullif(IED.JobbookingID,'') AS RefJobBookingJobCardContentsID,Nullif(ID.JobBookingJobCardContentsID,'') AS JobBookingJobCardContentsID,(Select Top 1 Replace(Convert(Varchar(13),A.VoucherDate,106),' ','-') FRom ItemTransactionMain AS A INNER JOIN ItemTransactionDetail as B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND B.ItemID=IED.ItemID Where A.VoucherID=-11 AND A.CompanyID =IED.CompanyID AND Isnull(A.IsDeletedTransaction,0)=0 AND Cast(Floor(Cast(A.VoucherDate AS Float)) AS Datetime)<Cast(Floor(Cast(IEM.VoucherDate AS Float)) AS Datetime) Order By A.VoucherDate Desc) AS LastPurchaseDate " &
              " From ItemTransactionMain AS IEM  INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID  And IEM.CompanyID=IED.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID " &
              " INNER JOIN  ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID LEFT JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=IED.TransactionID  And ID.RequisitionItemID=IED.ItemID And ID.CompanyID=IED.CompanyID  " &
              " LEFT JOIN ItemTransactionMain AS I ON I.TransactionID=ID.TransactionID  And I.CompanyID=ID.CompanyID LEFT JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingJobCardContentsID=ID.JobBookingJobCardContentsID And JBC.JobBookingID=ID.JobBookingID And JBC.CompanyID=ID.CompanyID LEFT JOIN ItemMaster AS M ON M.ItemID=ID.ItemID And M.CompanyID=ID.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID  " &
              " Where IEM.VoucherID IN(-9) And IEM.CompanyID=" & GBLCompanyID & " And IEM.TransactionID=" & TransactionID & " And Isnull(IM.IsDeletedTransaction,0)<>1 Order By FYear,RequisitionMaxVoucherNo Desc,TransID"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '-----------------------------------Get Indent List Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MakeRequisitionGroup() As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = "select  Isnull(IEM.TransactionID,0) AS TransactionID,Isnull(IEM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(IEM.VoucherID,0) AS VoucherID,NullIf(IEM.VoucherNo,'') AS VoucherNo, " &
               " Replace(Convert(Varchar(30),IEM.VoucherDate,106),' ','-') AS VoucherDate,Isnull(IEM.TotalQuantity,0) AS TotalQuantity,UA.UserName as CreatedBy,UA.UserName as ApprovedBy,nullif(Narration,'') as Narration,nullif(IEM.FYear,'') as FYear, " &
               " (select count(TransactionID) from ItemTransactionDetail where TransactionID=IEM.TransactionID) as NoOfItems " &
               " From ItemTransactionMain AS IEM inner join UserMaster as UA on UA.UserID=IEM.CreatedBy where IEM.CompanyID='" & GBLCompanyID & "' and IEM.VoucherID='-9'	and Isnull(IEM.IsDeletedTransaction,0)<>1	Order By FYear,MaxVoucherNo Desc"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOverFlowGrid(ByVal ItemGroupID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim str1 As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If ItemGroupID <> "" Then
            str1 = " AND IM.ItemGroupID=" & ItemGroupID & ""
        Else
            str1 = ""
        End If
        str = ""
        str = " SELECT distinct Isnull(IM.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,nullif(IM.ItemCode,'') as ItemCode,nullif(IM.ItemName,'') as ItemName,nullif(IM.ItemDescription,'') as ItemDescription,Isnull(IM.BookedStock,0) as BookedStock, " &
            " Isnull(IM.AllocatedStock,0) as AllocatedStock ,Isnull(IM.PhysicalStock,0) AS PhysicalStock,nullif(IM.StockUnit,'') as StockUnit,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,nullif(IM.PurchaseUnit,'') as PurchaseUnit,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.ConversionFactor,0) AS ConversionFactor,Isnull(IM.SizeW,0) AS SizeW,nullif(C.ConversionFormula,'') AS ConversionFormula,Isnull(C.ConvertedUnitDecimalPlace,0) AS ConvertedUnitDecimalPlace,(Select Top 1 Replace(Convert(Varchar(13),A.VoucherDate,106),' ','-') FRom ItemTransactionMain AS A INNER JOIN ItemTransactionDetail as B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND B.ItemID=IM.ItemID Where A.VoucherID=-11 AND A.CompanyID =IM.CompanyID AND Isnull(A.IsDeletedTransaction,0)=0 Order By A.VoucherDate Desc) AS LastPurchaseDate " &
            " FROM ItemMaster AS IM INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID=IM.ItemGroupID  AND IGM.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster As ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID  AND ISGM.CompanyID=IM.CompanyID  LEFT JOIN UnitMaster As UOM ON UOM.UnitSymbol=IM.StockUnit  AND UOM.CompanyID=IM.CompanyID  LEFT JOIN ConversionMaster AS C ON IM.StockUnit=C.BaseUnitSymbol AND IM.PurchaseUnit=C.ConvertedUnitSymbol And IM.CompanyID=C.CompanyID " &
            " Where IM.CompanyID=" & GBLCompanyID & "  " & str1 & " And Isnull(IM.IsDeletedTransaction,0)<>1 Order By ItemGroupID,ItemSubGroupName,ItemCode,ItemName "

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Open PaaperPurchaseRequisition  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVoucherID(ByVal prefix As String) As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            KeyField = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    ''----------------------------Open PaaperPurchaseRequisition  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavePaperPurchaseRequisition(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsUpdateindentDetail As Object) As String

        Dim dt As New DataTable
        Dim VoucherNo As String
        Dim MaxVoucherNo As Long
        Dim KeyField, str2, TransactionID As String
        Dim AddColName, AddColValue, wherecndtn, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If db.CheckAuthories("PurchaseRequisition.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save..!"

            VoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND Isnull(IsDeletedTransaction,0)=0")

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,IsVoucherItemApproved,VoucherItemApprovedBy,VoucherItemApprovedDate"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "',1," & GBLUserID & ",'" & DateTime.Now & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            TableName = "ItemTransactionDetail"
            AddColName = "RequisitionTransactionID=" & TransactionID & ""
            wherecndtn = "CompanyID=" & GBLCompanyID & " "
            db.UpdateDatatableToDatabase(jsonObjectsUpdateindentDetail, TableName, AddColName, 3, wherecndtn)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open RequisitionPurchase  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdatePaperPurchaseRequisition(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsUpdateindentDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, wherecndtn, TableName As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            If db.CheckAuthories("PurchaseRequisition.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to update..!"

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 1, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,IsVoucherItemApproved,VoucherItemApprovedBy,VoucherItemApprovedDate"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "',1," & GBLUserID & ",'" & DateTime.Now & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            str = ""
            str = "Update ItemTransactionDetail Set RequisitionTransactionID=0  WHERE CompanyID='" & GBLCompanyID & "' and RequisitionTransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            TableName = "ItemTransactionDetail"
            AddColName = "RequisitionTransactionID='" & TransactionID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & ""
            db.UpdateDatatableToDatabase(jsonObjectsUpdateindentDetail, TableName, AddColName, 3, wherecndtn)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    ''----------------------------Open RequisitionPurchase Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeletePaperPurchaseRequisition(ByVal TxtPRID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try

            If db.CheckAuthories("PurchaseRequisition.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete..!"

            str = "Update ItemTransactionMain Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPRID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TxtPRID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set RequisitionTransactionID=0  WHERE CompanyID='" & GBLCompanyID & "' and RequisitionTransactionID='" & TxtPRID & "'"
            db.ExecuteNonSQLQuery(str)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TxtPRID & ",0")
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
        KeyField = ""
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            Dim dtExist As New DataTable
            Dim dtExist1 As New DataTable
            Dim SxistStr As String

            SxistStr = ""
            SxistStr = "select isnull(TransactionID,0) as TransactionID from ItemTransactionDetail where CompanyID='" & GBLCompanyID & "' and  TransactionID='" & TransactionID & "' and Isnull(IsvoucherItemApproved,0)<>0  and isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, SxistStr)
            Dim E As Integer = dtExist.Rows.Count
            If E > 0 Then
                KeyField = "Exist"
            End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    '-----------------------------------Get PrintRequisition Grid------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PrintRequisitionData(ByVal transactionID As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = ""
        str = " Select Distinct nullif(UM.UserName,'') as UserName,Isnull(IEM.TransactionID,0) AS RequisitionTransactionID,Isnull(IED.IsvoucherItemApproved,0) AS VoucherItemApproved,Isnull(IEM.MaxVoucherNo,0) AS RequisitionMaxVoucherNo,Isnull(IEM.VoucherID,0) AS RequisitionVoucherID, Isnull(ID.TransactionID,0) AS TransactionID,Isnull(I.MaxVoucherNo,0) AS MaxVoucherNo, Isnull(I.VoucherID,0) AS VoucherID,  " &
                " Isnull(IED.ItemID,0) As ItemID,Isnull(IED.TransID,0) As TransID, Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,  Isnull(IGM.ItemGroupNameID, 0) As ItemGroupNameID, " &
                " NullIf(I.VoucherNo,'') AS VoucherNo, Replace(Convert(Varchar(30), I.VoucherDate, 106),' ','-') AS VoucherDate,NullIf(IEM.VoucherNo,'') AS RequisitionVoucherNo, Replace(Convert(Varchar(30), IEM.VoucherDate, 106),' ','-') AS RequisitionVoucherDate, " &
                " NullIf(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(IM.ItemCode,'') AS ItemCode,  NullIf(IM.ItemName,'') AS ItemName,NullIf(IM.ItemDescription,'') AS ItemDescription,Isnull(IED.RequiredQuantity,0) AS PurchaseQty, " &
                " Isnull((Select ROUND(Sum(Isnull(RequiredQuantity,0)),3) From ItemTransactionDetail Where RequisitionTransactionID=IED.TransactionID AND ItemID=IED.ItemID AND CompanyID=IED.CompanyID),0) AS RequisitionQty,  Isnull(IM.BookedStock, 0) As BookedStock, Isnull(IM.AllocatedStock, 0) As AllocatedStock, Isnull(IM.PhysicalStock, 0) As PhysicalStock,  NullIf(IED.StockUnit,'') AS StockUnit, " &
                " NullIf(IED.StockUnit,'') AS OrderUnit,Replace(Convert(Varchar(30),IED.ExpectedDeliveryDate,106),' ','-') AS ExpectedDeliveryDate, Nullif(IED.ItemNarration,'') AS ItemNarration,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace,NullIf(IEM.FYear,'') AS FYear,Nullif(JBC.JobCardContentNo,'') AS JobCardNo " &
                " From ItemTransactionMain AS IEM  INNER JOIN ItemTransactionDetail AS IED ON IEM.TransactionID=IED.TransactionID  And IEM.CompanyID=IED.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=IED.ItemID And IM.CompanyID=IED.CompanyID " &
                " INNER JOIN UserMaster as UM on UM.UserID=IEM.UserID INNER JOIN  ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID LEFT JOIN ItemTransactionDetail AS ID ON ID.RequisitionTransactionID=IED.TransactionID  And ID.RequisitionItemID=IED.ItemID And ID.CompanyID=IED.CompanyID  " &
                " LEFT JOIN ItemTransactionMain AS I ON I.TransactionID=ID.TransactionID  And I.CompanyID=ID.CompanyID LEFT JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingJobCardContentsID=ID.JobBookingJobCardContentsID And JBC.JobBookingID=ID.JobBookingID And JBC.CompanyID=ID.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IED.StockUnit And UOM.CompanyID=IEM.CompanyID  Where IEM.VoucherID IN(-9) AND IEM.CompanyID=" & GBLCompanyID & " And IEM.TransactionID=" & transactionID & " and Isnull(IED.IsDeletedTransaction,0)<>1 Order By FYear,RequisitionMaxVoucherNo Desc"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
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
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Purchase Order',0,'" & PurchaseTransactionID & "',0,0,0,0,0,0"
        Else
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Purchase Requisition','" & requisitionIDs & "',0,0,0,0,0,0,0"
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
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
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

    ''' <summary>
    ''' 'Used in PO and PO Approval JS
    ''' </summary>
    ''' <returns></returns>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardList() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        'str = "Select Distinct JobCardContentNo As RefJobCardContentNo,JobBookingJobCardContentsID As RefJobBookingJobCardContentsID From JobBookingJobCardContents Where CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0"
        str = "Select Distinct JobbookingNo As RefJobCardContentNo,JobBookingID As RefJobBookingJobCardContentsID From JobBookingJobCard Where CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class