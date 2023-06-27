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
Public Class WebService_StockReport
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
    '-----------------------------------Get PhysicalStockData------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PhysicalStockData() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "SELECT  distinct 0 AS ParentTransactionID,Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,0 AS WarehouseID,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockUnit,'') AS StockUnit,0 AS BatchStock,Isnull(IM.PhysicalStock,0) AS PhysicalStock,Isnull(IM.BookedStock,0) AS BookedStock,Isnull(IM.AllocatedStock,0) AS AllocatedStock,Isnull(IM.UnapprovedStock,0) AS UnapprovedStock,Isnull(IM.PhysicalStock,0)-Isnull(IM.AllocatedStock,0) AS FreeStock,Isnull(IM.IncomingStock,0) AS IncomingStock,0 AS OutgoingStock,Isnull(IM.FloorStock,0) AS FloorStock,Isnull(IM.PhysicalStock,0)-Isnull(IM.AllocatedStock,0)+Isnull(IM.IncomingStock,0)-Isnull(IM.BookedStock,0) AS TheoriticalStock,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(UOM.DecimalPlace,0) AS UnitDecimalPlace  " &
                  " From ItemMaster AS IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID And Isnull(IM.IsDeletedTransaction,0)=0 LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID AND ISGM.CompanyID=IM.CompanyID LEFT JOIN UnitMaster AS UOM ON UOM.UnitSymbol=IM.StockUnit AND UOM.CompanyID=IM.CompanyID Where IM.CompanyID=" & GBLCompanyID & " Order By Isnull(IM.ItemGroupID,0),Nullif(IM.ItemName,'')"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get PhysicalBatchStockData------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetStockBatchWise(ByVal ItemId As String, ByVal colDataField As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            If colDataField = "PhysicalStock" Then
                str = ""
                str = "SELECT Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,   Isnull(Temp.ParentTransactionID,0) As ParentTransactionID,Isnull(Temp.WarehouseID,0) As WarehouseID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription, Nullif(IM.StockUnit,'') AS StockUnit,Isnull(Temp.ClosingQty,0) AS BatchStock,0 AS IssueQuantity,Nullif(Temp.GRNNo,'') AS GRNNo,Replace(Convert(varchar(13),Temp.GRNDate,106),' ','-') AS GRNDate,Nullif(Temp.BatchNo,'') AS BatchNo,Nullif(Temp.WarehouseName,'') AS Warehouse,Nullif(Temp.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor   " &
                    " From ItemMaster As IM INNER JOIN ItemGroupMaster As IGM On IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                    " INNER JOIN (Select Isnull(IM.CompanyID,0) As CompanyID,Isnull(IM.ItemID,0) As ItemID,Isnull(ITD.WarehouseID,0) As WarehouseID,Isnull(ITD.ParentTransactionID,0) As ParentTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) - Isnull(SUM(ITD.RejectedQuantity),0) As ClosingQty,Nullif(ITD.BatchNo,'') AS BatchNo,Null AS Pallet_No,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate From ItemMaster As IM INNER JOIN ItemTransactionDetail As ITD On ITD.ItemID=IM.ItemID And ITD.CompanyID=IM.CompanyID And Isnull(ITD.IsDeletedTransaction, 0)=0 And (Isnull(ITD.ReceiptQuantity,0)>0 Or Isnull(ITD.IssueQuantity,0)>0) INNER JOIN ItemTransactionMain As ITM On ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And ITM.VoucherID Not In(-8, -9, -11) AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsDeletedTransaction,0)=0 " &
                    " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID AND Isnull(IT.IsDeletedTransaction,0)=0 INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID AND Isnull(WM.IsDeletedTransaction,0)=0 " &
                    " Where ITD.CompanyID='" & GBLCompanyID & "' And ITD.ItemID='" & ItemId & "' Group BY Isnull(IM.ItemID, 0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(IM.CompanyID,0) HAVING((ISNULL(SUM(Isnull(ITD.ReceiptQuantity, 0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity, 0)), 0) - Isnull(SUM(ITD.RejectedQuantity),0)) > 0)) As Temp On Temp.ItemID=IM.ItemID And Temp.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                    " Where IM.CompanyID ='" & GBLCompanyID & "'  and IM.ItemID='" & ItemId & "'  Order by ParentTransactionID"

            ElseIf colDataField = "AllocatedStock" Then
                str = ""
                'str = "Select Isnull(ITM.TransactionID,0) as PicklistTransactionID,Isnull(ITD.TransactionDetailID,0) as TransactionDetailID,Isnull(ITD.IsReleased,0) as IsReleased,Isnull(ITD.IsCancelled,0) as IsCancelled,  " &
                '       " Isnull(ITD.IsCompleted,0) As IsCompleted,Isnull(ITM.DepartmentID,0) As DepartmentID,  " &
                '       " Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ItemID,0) AS ItemID,  " &
                '       " Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Nullif(ITM.VoucherNo,'') AS PicklistNo,     " &
                '       " Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS PicklistDate,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(JEJ.JobBookingNo,'') AS BookingNo,Nullif(JEJC.JobCardContentNo,'') AS JobCardNo,  " &
                '       " Nullif(JEJ.JobName,'') AS JobName,Nullif(JEJC.PlanContName,'') AS ContentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,  " &
                '       " Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.RequiredQuantity,0) AS PicklistQuantity,  " &
                '       " Isnull((Select Sum(Isnull(ReleaseQuantity,0)) From ItemPicklistReleaseDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID),0) AS ReleasedQuantity,  " &
                '       " Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID   AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0) AS IssuedQuantity,    " &
                '       " (Isnull(ITD.RequiredQuantity,0)-Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID   AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0)) AS AllocatedQuantity,  " &
                '       "  Nullif(UM.UserName,'') AS CreatedBy  " &
                '       " From ItemTransactionMain As ITM   " &
                '       " INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID   " &
                '       " INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID   " &
                '       " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID   " &
                '       " INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy And UM.CompanyID=ITM.CompanyID   " &
                '       " INNER JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID   " &
                '       " Left Join ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID   " &
                '       " Left Join JobBookingJobCardContents AS JEJC ON JEJC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JEJC.CompanyID=ITD.CompanyID   " &
                '       " Left Join JobBookingJobCard AS JEJ ON JEJ.JobBookingID=JEJC.JobBookingID And JEJ.CompanyID=JEJC.CompanyID   " &
                '      "  Where ITM.VoucherID = -17 And ITM.CompanyID ='" & GBLCompanyID & "' AND ITD.ItemID='" & ItemId & "' AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsCompleted,0)=0 AND Isnull(ITD.IsCancelled,0)=0  " &
                '      "  And (Isnull(ITD.RequiredQuantity,0)-Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID='" & GBLCompanyID & "' AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID   AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0))>0  " &
                '      "  Order By PicklistTransactionID Desc"
                str = " Select Isnull(ITM.TransactionID,0) as PicklistTransactionID,Isnull(ITD.TransactionDetailID,0) as TransactionDetailID,Isnull(ITD.IsReleased,0) as IsReleased,Isnull(ITD.IsCancelled,0) as IsCancelled,   Isnull(ITD.IsCompleted,0) As IsCompleted,Isnull(ITM.DepartmentID,0) As DepartmentID,    Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Nullif(ITM.VoucherNo,'') AS PicklistNo,       Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS PicklistDate,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(JEJ.JobBookingNo,'') AS BookingNo,Nullif(JEJC.JobCardContentNo,'') AS JobCardNo,    Nullif(JEJ.JobName,'') AS JobName,Nullif(JEJC.PlanContName,'') AS ContentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,     Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ItemID,0) AS ItemID,    Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.RequiredQuantity,0) AS PicklistQuantity,    Isnull((Select Sum(Isnull(ReleaseQuantity,0)) From ItemPicklistReleaseDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID AND  JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID),0) AS ReleasedQuantity, Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID=" & GBLCompanyID & " AND  Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND   PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID   AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0)  AS IssuedQuantity,   (Isnull(ITD.RequiredQuantity,0)-Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID  IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID AND DepartmentID=ITM.DepartmentID   " &
                      " AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0)) AS AllocatedQuantity,     Nullif(UM.UserName,'') AS CreatedBy  From ItemTransactionMain As ITM  INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID     INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID     INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy And UM.CompanyID=ITM.CompanyID INNER JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID     Left Join ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID Left Join JobBookingJobCardContents AS JEJC ON  JEJC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JEJC.CompanyID=ITD.CompanyID Left Join JobBookingJobCard AS JEJ ON JEJ.JobBookingID=JEJC.JobBookingID And JEJ.CompanyID=JEJC.CompanyID  Where ITM.VoucherID = -17 And ITM.CompanyID =" & GBLCompanyID & " AND ITD.ItemID='" & ItemId & "' AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.IsCompleted,0)=0 AND Isnull(ITD.IsCancelled,0)=0    And (Isnull(ITD.RequiredQuantity,0)-Isnull((Select SUM(Isnull(IssueQuantity,0)) From ItemTransactionDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND PicklistReleaseTransactionID  IN(Select Distinct PicklistReleaseTransactionID From ItemPicklistReleaseDetail Where CompanyID=" & GBLCompanyID & " AND Isnull(IsDeletedTransaction,0)=0 AND PicklistTransactionID=ITM.TransactionID   AND DepartmentID=ITM.DepartmentID   AND JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND ItemID=ITD.ItemID) AND ItemID=ITD.ItemID AND CompanyID=ITD.CompanyID),0))>0    Order By PicklistTransactionID Desc  "


            ElseIf colDataField = "BookedStock" Then
                str = ""
                'str = "Select Isnull(JBI.JobBookingID,0) AS JobBookingID,Isnull(JBI.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(JBI.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,  " &
                '      "  Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(JBI.BookedQuantity,0) AS BookedQuantity,  " &
                '      "  Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.VoucherID=-17 Where B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND B.ItemID=JBI.ItemID AND B.CompanyID=JBI.CompanyID AND Isnull(B.IsDeletedTransaction,0)=0),0) AS AllocatedQuantity,  " &
                '      "  ROUND((Isnull(JBI.BookedQuantity,0)-Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID And A.VoucherID=-17 Where B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID And B.ItemID=JBI.ItemID And B.CompanyID=JBI.CompanyID And Isnull(B.IsDeletedTransaction,0)=0),0)),3) AS UnallocatedQuantity  " &
                '      "  From JobBookingJobCardContentsBookedItems AS JBI  " &
                '      "  INNER JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JBI.JobBookingID And JJ.CompanyID=JBI.CompanyID  " &
                '      "  INNER JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND JC.CompanyID=JBI.CompanyID  " &
                '      "  INNER JOIN ItemMaster AS IM ON IM.ItemID=JBI.ItemID And JC.CompanyID=JBI.CompanyID  " &
                '      "  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                '      "  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                '      "  LEFT JOIN JobBookingJobCardProcess AS JBP ON JBP.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND JBP.CompanyID=JBI.CompanyID  " &
                '      "  Where JBI.CompanyID='" & GBLCompanyID & "' AND JBI.ItemID='" & ItemId & "' AND Isnull(JBP.Status,'In Queue')<>'Complete' AND Isnull(JJ.IsDeletedTransaction,0)=0 AND ROUND((Isnull(JBI.BookedQuantity,0)-Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.VoucherID=-17 Where B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND B.ItemID=JBI.ItemID AND B.CompanyID=JBI.CompanyID AND Isnull(B.IsDeletedTransaction,0)=0),0)),3)>0"
                str = " Select Distinct Isnull(JBI.JobBookingID,0) AS JobBookingID,Isnull(JBI.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(JBI.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,     Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'')   AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(JBI.RequiredQty,0) AS BookedQuantity,    Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.VoucherID=-17 Where  " &
                      "  B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND B.ItemID=JBI.ItemID AND B.CompanyID=JBI.CompanyID  AND Isnull(B.IsCancelled,0)=0  AND Isnull(B.IsDeletedTransaction,0)=0 ),0) AS AllocatedQuantity,     ROUND((Isnull(JBI.RequiredQty,0)-Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID    And A.VoucherID=-17 Where B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID And B.ItemID=JBI.ItemID And B.CompanyID=JBI.CompanyID AND Isnull(B.IsCancelled,0)=0    And Isnull(B.IsDeletedTransaction,0)=0),0)),3) AS UnallocatedQuantity      From /*JobBookingJobCardContentsBookedItems*/  JobBookingJobCardProcessMaterialRequirement AS JBI  INNER JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JBI.JobBookingID And JJ.CompanyID=JBI.CompanyID    " &
                      " INNER JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND JC.CompanyID=JBI.CompanyID    INNER JOIN ItemMaster AS IM ON IM.ItemID=JBI.ItemID And JC.CompanyID=JBI.CompanyID     INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID      LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  LEFT JOIN JobBookingJobCardProcess AS JBP ON JBP.JobBookingJobCardContentsID=   JBI.JobBookingJobCardContentsID AND JBP.CompanyID=JBI.CompanyID  Where JBI.CompanyID=" & GBLCompanyID & " AND JBI.ItemID='" & ItemId & "' AND Isnull(JBP.Status,'In Queue')<>'Complete'    AND Isnull(JJ.IsDeletedTransaction,0)=0 AND ROUND((Isnull(JBI.RequiredQty,0)-Isnull((Select Sum(Isnull(RequiredQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B  " &
                      " ON A.TransactionID=B.TransactionID AND Isnull(B.IsCancelled,0)=0 AND A.VoucherID=-17 Where B.JobBookingJobCardContentsID=JBI.JobBookingJobCardContentsID AND B.ItemID=JBI.ItemID AND B.CompanyID=JBI.CompanyID AND    Isnull(B.IsDeletedTransaction,0)=0),0)),3)>0 "

            ElseIf colDataField = "IncomingStock" Then
                str = ""
                'str = "  Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,  Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(ITM.VoucherNo,'') AS PurchaseOrderNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseOrderDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName, Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,   " &
                '        "  Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,    Isnull((Select SUM(ISNULL(B.ChallanQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID And A.VoucherID=-14  Where B.ItemID=ITD.ItemID AND B.PurchaseTransactionID = ITM.TransactionID And Isnull(B.PurchaseTransactionID,0) >0 And B.CompanyID=" & GBLCompanyID & "),0) AS ChallanQuantity,    " &
                '        "  0 AS ReceiptQuantity,0 AS PendingQuantity,Nullif(IM.PurchaseUnit,'') AS PurchaseUnit, (Isnull(ITD.PurchaseOrderQuantity,0)  -  [dbo].CONVERT_UNIT_QUANTITY(Isnull(ITD.ItemID,0), Isnull((Select SUM(ISNULL(B.ChallanQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID And A.VoucherID=-14 Where B.ItemID=ITD.ItemID  AND B.PurchaseTransactionID = ITM.TransactionID And Isnull(B.PurchaseTransactionID,0) >0  " &
                '        "  And B.CompanyID=" & GBLCompanyID & "),0) ,Isnull(IM.WtPerPacking,0),IM.PurchaseUnit,IM.StockUnit)) AS IncomingStockQty,  Nullif(IM.StockUnit,'') AS StockUnit,  Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,(Select Isnull(Nullif([ParentFieldValue],''),1) From ItemMasterDetails     " &
                '        "  Where ItemID=ITD.ItemID AND FieldName='SizeW' AND CompanyID=ITD.CompanyID) AS SizeW   From ItemTransactionMain AS ITM  INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID    " &
                '        "  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID     Where ITM.CompanyID = " & GBLCompanyID & " AND ITM.VoucherID=-11 AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsCancelled,0)=0 AND Isnull(ITD.IsCompleted,0)=0 AND ITD.ItemID = " & ItemId & "  Order By ITM.TransactionID "
                str = " Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,  Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(ITM.VoucherNo,'') AS PurchaseOrderNo, Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS PurchaseOrderDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName, Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,   " &
                      " Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Isnull(ITD.PurchaseOrderQuantity,0) AS PurchaseOrderQuantity,    Isnull((Select SUM(ISNULL(B.ChallanQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID And A.VoucherID=-14  Where B.ItemID=ITD.ItemID AND B.PurchaseTransactionID = ITM.TransactionID And Isnull(B.PurchaseTransactionID,0) >0 And B.CompanyID=" & GBLCompanyID & "),0) AS ChallanQuantity,      " &
                      " 0 AS ReceiptQuantity,0 AS PendingQuantity,Nullif(IM.PurchaseUnit,'') AS PurchaseUnit, (Isnull(ITD.PurchaseOrderQuantity,0)  -  [dbo].CONVERT_UNIT_QUANTITY(Isnull(ITD.ItemID,0), Isnull((Select SUM(ISNULL(B.ChallanQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID And A.VoucherID=-14 Where B.ItemID=ITD.ItemID  AND B.PurchaseTransactionID = ITM.TransactionID And Isnull(B.PurchaseTransactionID,0) >0    " &
                      " And B.CompanyID=" & GBLCompanyID & "),0) ,Isnull(IM.WtPerPacking,0),IM.PurchaseUnit,IM.StockUnit)) AS IncomingStockQty,  Nullif(IM.StockUnit,'') AS StockUnit,  Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,(Select Isnull(Nullif([ParentFieldValue],''),1) From ItemMasterDetails       " &
                      " Where ItemID=ITD.ItemID AND FieldName='SizeW' AND CompanyID=ITD.CompanyID) AS SizeW   From ItemTransactionMain AS ITM  INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID      " &
                      " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID     Where ITM.CompanyID = " & GBLCompanyID & " AND ITM.VoucherID=-11 AND Isnull(ITM.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsCancelled,0)=0 AND Isnull(ITD.IsCompleted,0)=0 AND ITD.ItemID = '" & ItemId & "' Order By ITM.TransactionID "


            ElseIf colDataField = "FloorStock" Then
                str = ""
                'str = "Select Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,  " &
                '       " Isnull(ITD.FloorWarehouseID,0) As FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) As MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,  " &
                '       " Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS IssueNo,     " &
                '       " Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS IssueDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,  " &
                '       " Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,  " &
                '       " Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,  " &
                '       " ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName     " &
                '       " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID   " &
                '       " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID    " &
                '       " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID   " &
                '       " LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID   " &
                '       " LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID   " &
                '       " LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID    " &
                '       " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID='" & GBLCompanyID & "' GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID    " &
                '       " Where ITM.VoucherID = -19  AND ITD.ItemID='" & ItemId & "' AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

                str = " Select Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,     Isnull(ITD.FloorWarehouseID,0) As FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) As MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,     Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS IssueNo,        Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS IssueDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,     Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,     Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,     " &
                     " ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName        From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID      INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID       LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID      LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID      LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID      LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID       " &
                     " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,  Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+  SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND   ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID= " & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),  Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID   AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID       Where ITM.VoucherID = -19  AND ITD.ItemID = '" & ItemId & "' AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc  "


            End If

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function



    '---------------Close Master code---------------------------------

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class