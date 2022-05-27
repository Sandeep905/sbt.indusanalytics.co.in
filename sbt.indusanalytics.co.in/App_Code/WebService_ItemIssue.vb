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
Public Class WebService_ItemIssue
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    Dim GBLUserID As String
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
    ''----------------------------Open Get Issue No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetIssueNO(ByVal prefix As String) As String

        Dim dt As New DataTable
        Dim PONo As String
        Dim MaxVoucherNo As Long
        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            PONo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            KeyField = PONo

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Warehouse List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetWarehouseList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select DISTINCT WarehouseName As Warehouse From WarehouseMaster Where Isnull(WarehouseName,'') <> '' AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & "  Order By WarehouseName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Bins List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBinsList(ByVal warehousename As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "SELECT Distinct BinName AS Bin,Isnull(WarehouseID,0) AS WarehouseID FROM WarehouseMaster Where WarehouseName='" & warehousename & "' AND Isnull(BinName,'')<>'' AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & " Order By BinName"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get JobCard List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobCardRender() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "SELECT Distinct JEJ.JobBookingID,JEJC.JobBookingJobCardContentsID,JEJ.LedgerID,JEJ.JobBookingNo,JEJC.JobCardContentNo,JEJ.JobName,JEJC.PlanContName  " &
                    "FROM JobBookingJobCard As JEJ  " &
                    "INNER Join JobBookingJobCardContents As JEJC ON JEJC.JobBookingID=JEJ.JobBookingID And JEJC.CompanyID=JEJ.CompanyID " &
                    "INNER Join JobBookingJobCardProcess As JOS ON JOS.JobBookingJobCardContentsID=JEJC.JobBookingJobCardContentsID And JOS.JobBookingID=JEJ.JobBookingID " &
                    "INNER Join(Select DepartmentID, JobBookingJobCardContentsID, CompanyID, ROUND(sum(Isnull(PendingQty, 0)), 2) as PendingQty  " &
                    "From(Select ITPM.DepartmentID, ITPD.JobBookingJobCardContentsID, (ITPD.RequiredQuantity - Isnull(ITID.IssueQuantity, 0)) As PendingQty, ITPM.CompanyID   " &
                    "From ItemTransactionMain As ITPM INNER Join ItemTransactionDetail As ITPD ON ITPM.TransactionID=ITPD.TransactionID And ITPM.CompanyID=ITPD.CompanyID And Isnull(ITPD.IsDeletedTransaction,0)<>1 And ITPM.VoucherID=-17 " &
                    "Left Join(Select ITID.PicklistTransactionID, ITID.JobBookingJobCardContentsID, ITID.JobBookingID, ITIM.DepartmentID, Isnull(ITID.IssueQuantity, 0) As IssueQuantity, Isnull(ITID.ParentTransactionID, 0) As ParentTransactionID, Nullif(ITID.BatchNo,'') AS BatchNo  " &
                    "From ItemTransactionMain As ITIM INNER Join ItemTransactionDetail As ITID On ITIM.TransactionID=ITID.TransactionID And ITIM.CompanyID=ITID.CompanyID  Where ITIM.VoucherID = -19 And ITIM.CompanyID ='" + GBLCompanyID + "' AND Isnull(ITIM.IsDeletedTransaction,0)<>1) AS ITID " &
                    "ON ITID.PicklistTransactionID=ITPD.TransactionID And ITID.JobBookingJobCardContentsID=ITPD.JobBookingJobCardContentsID And ITID.DepartmentID=ITPM.DepartmentID " &
                    "And ITID.ParentTransactionID=ITPD.ParentTransactionID And  ITID.BatchNo=ITPD.BatchNo  " &
                    "Where IsNull(ITPD.IsCancelled, 0) = 0 And IsNull(ITPD.IsCompleted, 0) = 0 ) as qry  " &
                    "Group by DepartmentID, JobBookingJobCardContentsID, CompanyID  " &
                    "having ROUND(sum(Isnull(PendingQty, 0)), 2) > 0) AS A ON A.JobBookingJobCardContentsID=JEJC.JobBookingJobCardContentsID And A.CompanyID=JEJC.CompanyID  " &
                    "Where JEJC.CompanyID = '" + GBLCompanyID + "' And JEJC.FYEAR IN('" + GBLFYear + "')  Order BY JEJC.JobCardContentNo"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Department List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DepartmentName() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Distinct isnull(B.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,isnull(A.DepartmentID,0) as DepartmentID,nullif(A.DepartmentName,'') as DepartmentName From DepartmentMaster AS A INNER JOIN(  " &
                  "  Select DepartmentID,JobBookingJobCardContentsID,CompanyID,ROUND(sum(Isnull(PendingQty,0)),2) As PendingQty   " &
                  "  From(Select ITPM.DepartmentID, ITPD.JobBookingJobCardContentsID, (ITPD.RequiredQuantity - Isnull(ITID.IssueQuantity, 0)) As PendingQty, ITPM.CompanyID    " &
                  "  From ItemTransactionMain As ITPM INNER Join ItemTransactionDetail As ITPD ON ITPM.TransactionID=ITPD.TransactionID And ITPM.CompanyID=ITPD.CompanyID And Isnull(ITPD.IsDeletedTransaction,0)<>1 And ITPM.VoucherID=-17  " &
                  "  Left Join(Select ITID.PicklistTransactionID, ITID.JobBookingJobCardContentsID, ITID.JobBookingID, ITIM.DepartmentID, ITID.ItemID, Isnull(ITID.IssueQuantity, 0) As IssueQuantity, Isnull(ITID.ParentTransactionID, 0) As ParentTransactionID, Nullif(ITID.BatchNo,'') AS BatchNo   " &
                  "  From ItemTransactionMain As ITIM INNER Join ItemTransactionDetail As ITID On ITIM.TransactionID=ITID.TransactionID And ITIM.CompanyID=ITID.CompanyID  Where ITIM.VoucherID = -19 And ITIM.CompanyID = " & GBLCompanyID & " And Isnull(ITIM.IsDeletedTransaction, 0) <> 1) AS ITID  " &
                  "  On ITID.PicklistTransactionID=ITPD.TransactionID And ITID.JobBookingJobCardContentsID=ITPD.JobBookingJobCardContentsID And ITID.DepartmentID=ITPM.DepartmentID  " &
                  " And ITID.ParentTransactionID=ITPD.ParentTransactionID And ITID.ItemID=ITPD.ItemID And  ITID.BatchNo=ITPD.BatchNo   " &
                  " Where IsNull(ITPD.IsCancelled, 0) = 0 And IsNull(ITPD.IsCompleted, 0) = 0 ) as qry   " &
                  "Group by DepartmentID, JobBookingJobCardContentsID, CompanyID   " &
                  "having ROUND(sum(Isnull(PendingQty, 0)), 2) > 0) AS B ON A.DepartmentID=B.DepartmentID AND A.CompanyID=B.CompanyID Where A.CompanyID=" & GBLCompanyID & " "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Allocated Job List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobAllocatedPicklist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            str = " Select Isnull(ITM.TransactionID,0) AS PicklistTransactionID,Isnull(IPR.PicklistReleaseTransactionID,0) AS PicklistReleaseTransactionID,Isnull(IPR.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(IPR.DepartmentID,0) AS DepartmentID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ProcessID,0) AS ProcessID,Isnull(IPR.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(ITM.VoucherNo,0) AS PicklistNo,Isnull(IPR.MaxReleaseNo,0) AS ReleaseNo,Nullif(JJ.JobBookingNo,'') AS BookingNo,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Nullif(PM.ProcessName,'') AS ProcessName,Nullif(DM.DepartmentName,'') AS Department,Nullif(MM.MachineName,'') AS MachineName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(IM.PhysicalStock,0) AS PhysicalStock,Isnull(IM.AllocatedStock,0) AS AllocatedStock,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,Isnull(IPR.ReleaseQuantity,0) AS ReleaseQuantity,Isnull((Select Sum(Isnull(IssueQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND A.VoucherID=-19 Where Isnull(B.IsDeletedTransaction,0)=0 AND B.PicklistReleaseTransactionID=IPR.PicklistReleaseTransactionID AND B.ItemID=IPR.ItemID AND B.JobBookingJobCardContentsID=IPR.JobBookingJobCardContentsID AND A.DepartmentID=IPR.DepartmentID AND B.CompanyID=IPR.CompanyID ),0) AS IssueQuantity, " &
                " (Isnull(IPR.ReleaseQuantity,0)-Isnull((Select Sum(Isnull(IssueQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND A.VoucherID=-19 And B.IsDeletedTransaction=0 Where B.PicklistReleaseTransactionID=IPR.PicklistReleaseTransactionID AND B.ItemID=IPR.ItemID AND B.JobBookingJobCardContentsID=IPR.JobBookingJobCardContentsID AND A.DepartmentID=IPR.DepartmentID AND B.CompanyID=IPR.CompanyID ),0)) AS PendingQuantity,Isnull(IGM.AllowIssueExtraQuantity,0) AS AllowIssueExtraQuantity " &
                " From ItemPicklistReleaseDetail AS IPR INNER JOIN ItemTransactionMain AS ITM ON ITM.TransactionID=IPR.PicklistTransactionID AND ITM.CompanyID=IPR.CompanyID INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=IPR.PicklistTransactionID AND ITD.TransactionDetailID=IPR.PicklistTransactionDetailID AND ITD.ItemID=IPR.ItemID AND ITD.JobBookingJobCardContentsID=IPR.JobBookingJobCardContentsID  AND ITM.DepartmentID=IPR.DepartmentID AND ITD.CompanyID=IPR.CompanyID  " &
                " INNER JOIN ItemMaster AS IM ON IM.ItemID=IPR.ItemID And IM.CompanyID=IPR.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER JOIN DepartmentMaster AS DM ON DM.DepartmentID=IPR.DepartmentID And DM.CompanyID=IPR.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=IPR.JobBookingJobCardContentsID And JC.CompanyID=IPR.CompanyID  LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID LEFT JOIN ProcessMaster AS PM ON PM.ProcessID=ITD.ProcessID And PM.CompanyID=ITD.CompanyID  " &
                " Where IPR.CompanyID=" & GBLCompanyID & " AND Isnull(IPR.IsDeletedTransaction,0)=0 AND Isnull(ITD.IsCancelled,0)=0 AND Isnull(ITD.IsCompleted,0)=0 AND Isnull(ITD.IsDeletedTransaction,0)=0 AND (Isnull(IPR.ReleaseQuantity,0)-Isnull((Select Sum(Isnull(IssueQuantity,0)) From ItemTransactionMain AS A INNER JOIN ItemTransactionDetail AS B ON A.TransactionID=B.TransactionID AND A.CompanyID=B.CompanyID AND A.VoucherID=-19 And B.IsDeletedTransaction=0 Where B.PicklistReleaseTransactionID=IPR.PicklistReleaseTransactionID AND B.ItemID=IPR.ItemID AND B.JobBookingJobCardContentsID=IPR.JobBookingJobCardContentsID AND A.DepartmentID=IPR.DepartmentID AND B.CompanyID=IPR.CompanyID ),0))>0 " &
                " Order By IPR.PicklistReleaseTransactionID "
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get All Job List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AllPicklist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "SELECT Isnull(IPD.TransactionID,0) AS TransactionID,Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,Isnull(ITS.GRNTransactionID,0) AS GRNTransactionID,Isnull(ITS.WarehouseID,0) AS WarehouseID,Isnull(IPD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,  " &
                  "  Nullif(IPD.VoucherNo,'') AS Picklist_Order_No,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif('','') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,  " &
                  "  Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITS.ClosingQty,0) AS BatchStock,Isnull(IM.PhysicalStock,0) AS TotalPhysicalStock,Isnull(IM.AllocatedStock,0) AS TotalAllocatedStock,Nullif(ITS.GRNNo,'') AS GRNNo,replace(convert(nvarchar(30),ITS.GRNDate,106),'','-')  AS GRNDate,  " &
                  "  Nullif(ITS.BatchNo,'') AS BatchNo,Nullif(ITS.WarehouseName,'') AS Warehouse,Nullif(ITS.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor,0 AS Issue_Qty,IPS.PendingQuantity    " &
                  "  From ItemMaster AS IM   " &
                  "  INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER JOIN " &
                  "  (Select Isnull(ITD.CompanyID,0) AS CompanyID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.ParentTransactionID,0) AS GRNTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) AS ClosingQty,  " &
                  "  Nullif(ITD.BatchNo,'') AS BatchNo,Nullif('','') AS Pallet_No,Isnull(ITD.WarehouseID,0) AS WarehouseID,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate  " &
                  "  From ItemTransactionMain AS ITM   " &
                  "  INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And ITM.VoucherID Not IN(-8,-9,-11)  " &
                  "  INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID   " &
                  "  INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID   " &
                  "  Where ITM.CompanyID='" & GBLCompanyID & "' AND Isnull(ITD.IsDeletedTransaction,0)=0 AND (Isnull(ITD.ReceiptQuantity,0)>0 Or Isnull(ITD.IssueQuantity,0)>0)  " &
                  "  GROUP BY Isnull(ITD.ItemID,0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(ITD.CompanyID,0)  " &
                  "  HAVING ((ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0)) > 0)) AS ITS ON ITS.ItemID=IM.ItemID AND ITS.CompanyID=IM.CompanyID     " &
                  "  LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID   " &
                  "  INNER JOIN (Select Distinct ITPM.TransactionID,ITPD.IsReleased,ITPD.JobBookingJobCardContentsID,ITPM.DepartmentID,ITPD.CompanyID,ITPD.ItemID,ITPD.BatchNo,ITPM.VoucherNo   " &
                  "  From ItemTransactionMain AS ITPM INNER JOIN ItemTransactionDetail AS ITPD ON ITPM.TransactionID=ITPD.TransactionID And ITPM.CompanyID=ITPD.CompanyID Where ITPM.VoucherID=-17 And ITPM.CompanyID='" & GBLCompanyID & "' AND ITPM.DepartmentID=-50 AND ITPD.JobBookingJobCardContentsID=0) AS IPD ON IPD.ItemID=ITS.ItemID AND IPD.BatchNo=ITS.BatchNo AND IPD.CompanyID=ITS.CompanyID  " &
                  "  INNER JOIN (Select ITM.TransactionID,ITD.ItemID,ITD.CompanyID,(Sum(isnull(ITD.RequiredQuantity,0))-Isnull(IPS.IssueQuantity,0)) AS PendingQuantity    " &
                  "  From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And ITM.VoucherID=-17  " &
                  "  LEFT JOIN (Select ITD.PicklistTransactionID,ITD.ItemID,ITM.DepartmentID,ITD.JobBookingJobCardContentsID,ITD.CompanyID,ROUND(Sum(Isnull(ITD.IssueQuantity,0)),2) AS IssueQuantity   " &
                  "  From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID   " &
                  "  Where ITM.VoucherID=-19 AND Isnull(ITM.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)=0 AND Isnull(ITM.DepartmentID,0)=-50  " &
                  "  Group By ITD.PicklistTransactionID,ITD.ItemID,ITM.DepartmentID,ITD.JobBookingJobCardContentsID,ITD.CompanyID) AS IPS ON IPS.PicklistTransactionID=ITD.TransactionID And IPS.ItemID=ITD.ItemID   " &
                  "  AND IPS.DepartmentID=ITM.DepartmentID AND IPS.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID   " &
                  "  Where Isnull(ITD.IsCancelled,0)=0 And Isnull(ITD.IsCompleted,0)=0 And Isnull(ITD.IsDeletedTransaction,0)<>1  " &
                  "  Group By ITM.TransactionID,ITD.ItemID,ITD.CompanyID,IPS.IssueQuantity) AS IPS ON IPS.TransactionID=IPD.TransactionID AND IPS.ItemID=IPD.ItemID   " &
                  "  Where Isnull(IPD.IsReleased,0)=1 AND IM.ItemName like '%%' "

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Stock Batch wise Item List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetStockBatchWise(ByVal ItemId As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "SELECT Isnull(IM.ItemID,0) AS ItemID,Isnull(IM.ItemGroupID,0) AS ItemGroupID,Isnull(IGM.ItemGroupNameID,0) AS ItemGroupNameID,Isnull(ISGM.ItemSubGroupID,0) AS ItemSubGroupID,   Isnull(Temp.ParentTransactionID,0) As ParentTransactionID,Isnull(Temp.WarehouseID,0) As WarehouseID,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription, Nullif(IM.StockUnit,'') AS StockUnit,Isnull(Temp.ClosingQty,0) AS BatchStock,0 AS IssueQuantity,Nullif(Temp.GRNNo,'') AS GRNNo,Replace(Convert(varchar(13),Temp.GRNDate,106),' ','-') AS GRNDate,Nullif(Temp.BatchNo,'') AS BatchNo,Nullif(Temp.WarehouseName,'') AS Warehouse,Nullif(Temp.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor   " &
                  " From ItemMaster As IM INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID INNER JOIN (Select Isnull(IM.CompanyID,0) AS CompanyID,Isnull(IM.ItemID,0) AS ItemID,Isnull(ITD.WarehouseID,0) AS WarehouseID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,ISNULL(SUM(Isnull(ITD.ReceiptQuantity,0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity,0)), 0) AS ClosingQty,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif('','') AS Pallet_No,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS BinName,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate From ItemMaster As IM INNER JOIN ItemTransactionDetail As ITD On ITD.ItemID=IM.ItemID And ITD.CompanyID=IM.CompanyID And Isnull(ITD.IsDeletedTransaction, 0)=0 And (Isnull(ITD.ReceiptQuantity,0)>0 Or Isnull(ITD.IssueQuantity,0)>0) INNER JOIN ItemTransactionMain As ITM On ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And ITM.VoucherID Not In(-8, -9, -11)  INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID  " &
                  " Where ITD.CompanyID=" & GBLCompanyID & " And ITD.ItemID=" & ItemId & " And Isnull(ITM.IsDeletedTransaction,0)=0 Group BY Isnull(IM.ItemID, 0),Isnull(ITD.ParentTransactionID,0),Nullif(ITD.BatchNo,''),Isnull(ITD.WarehouseID,0),Nullif(WM.WarehouseName,''),Nullif(WM.BinName,''),Nullif(IT.VoucherNo,''),Replace(Convert(varchar(13),IT.VoucherDate,106),' ','-'),Isnull(IM.CompanyID,0) HAVING((ISNULL(SUM(Isnull(ITD.ReceiptQuantity, 0)), 0) - ISNULL(SUM(Isnull(ITD.IssueQuantity, 0)), 0)) > 0)) As Temp On Temp.ItemID=IM.ItemID And Temp.CompanyID=IM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                  " Where IM.CompanyID =" & GBLCompanyID & "  and IM.ItemID=" & ItemId & "  Order by ParentTransactionID"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function
    '-----------------------------------Get Show List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Showlist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = " Select Isnull(ITM.TransactionID,0) as TransactionID,Isnull(ITD.ItemID,0) as ItemID,Isnull(IM.ItemGroupID,0) as ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID, 0) As ItemSubGroupID,ITD.WarehouseID, Isnull(ITD.FloorWarehouseID, 0) As FloorWarehouseID,Isnull(ITM.DepartmentID,0) As DepartmentID,Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Isnull(ITD.PicklistReleaseTransactionID,0) As PicklistReleaseTransactionID,Isnull(ITD.PicklistTransactionID,0) As PicklistTransactionID,Isnull(ITM.MaxVoucherNo,0) as MaxVoucherNo,Nullif(ITM.VoucherNo,'') as VoucherNo,Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IPM.VoucherNo,'') AS PicklistNo,Nullif(DM.DepartmentName,'') as DepartmentName,   Nullif(JEJC.JobCardContentNo,'') AS JobCardNo,Nullif(JEJ.JobName,'') as JobName,Nullif(JEJC.PlanContName,'') AS ContentName, " &
                  " Nullif(DM.DepartmentName,'') as DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') as ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') as ItemName,Nullif(IM.ItemDescription,'') as ItemDescription,Nullif(ITD.StockUnit,'') as StockUnit,Sum(Isnull(ITD.IssueQuantity,0)) as IssueQuantity,WM.WarehouseName As Warehouse,WM.BinName As Bin,Nullif(ITM.DeliveryNoteNo,'') as DeliveryNoteNo,Nullif(UM.UserName,'') as UserName,Nullif(ITM.Narration,'') as Narration   " &
                  " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemPicklistReleaseDetail AS IPR ON IPR.PicklistReleaseTransactionID=ITD.PicklistReleaseTransactionID AND IPR.PicklistTransactionID=ITD.PicklistTransactionID AND IPR.ItemID=ITD.ItemID AND IPR.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND IPR.DepartmentID=ITM.DepartmentID AND IPR.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IPM ON IPM.TransactionID=ITD.PicklistTransactionID AND IPM.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID AND IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy AND UM.CompanyID=ITM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JEJC ON JEJC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JEJC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JEJ ON JEJ.JobBookingID=JEJC.JobBookingID And JEJ.CompanyID=JEJC.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID Left Outer Join WarehouseMaster As WM On WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID " &
                  " Where ITM.VoucherID = -19 AND Isnull(ITD.IsDeletedTransaction, 0) <> 1 AND ITM.CompanyID =" & GBLCompanyID & " AND ITM.FYear IN('" & GBLFYear & "') " &
                  " GROUP BY ITM.TransactionID , ITD.ItemID, IM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemSubGroupID, ITD.WarehouseID, ITD.FloorWarehouseID, ITM.DepartmentID, ITD.JobBookingJobCardContentsID, ITD.PicklistReleaseTransactionID, ITD.PicklistTransactionID, ITM.MaxVoucherNo, ITM.VoucherNo,ITM.VoucherDate, IPM.VoucherNo, DM.DepartmentName, JEJC.JobCardContentNo, JEJ.JobName, JEJC.PlanContName,DM.DepartmentName,IM.ItemCode,IGM.ItemGroupName,ISGM.ItemSubGroupName,IM.ItemName,IM.ItemDescription,ITD.StockUnit,ITM.DeliveryNoteNo,UM.UserName,ITM.Narration,WM.WarehouseName,WM.BinName " &
                  " ORDER BY TransactionID Desc"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Issue Voucher Details------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetIssueVoucherDetails(ByVal transactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(ITD.PicklistTransactionID,0) as PicklistTransactionID,Isnull(ITD.TransID,0) AS TransID,Isnull(ITD.PicklistReleaseTransactionID,0) as PicklistReleaseTransactionID,Isnull(ITD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,Isnull(ITM.DepartmentID,0) as DepartmentID,Isnull(IPD.MachineID,0) as MachineID,Isnull(IPD.ProcessID,0) as ProcessID,Isnull(ITD.ParentTransactionID,0) As ParentTransactionID,Isnull(ITD.ItemID,0) as ItemID,Isnull(IM.ItemGroupID,0) as ItemGroupID,Isnull(IGM.ItemGroupNameID,0) as ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Isnull(ITD.WarehouseID,0) As WarehouseID,Nullif(IPM.VoucherNo,'') AS PicklistNo,Isnull(IPR.MaxReleaseNo,0) as ReleaseNo,Nullif(JJ.JobBookingNo,'') AS BookingNo,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Nullif(PM.ProcessName,'') AS ProcessName,Nullif(MM.MachineName,'') AS MachineName,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,   Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.ItemDescription,'') AS ItemDescription,Nullif(ITD.StockUnit,'') AS StockUnit,0 AS BatchStock,   Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,   Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(WM.WareHouseName,'') AS Warehouse,Nullif(WM.BinName,'') AS Bin,Isnull(IM.WtPerPacking,0) AS WtPerPacking,   Isnull(IM.UnitPerPacking,1) AS UnitPerPacking,Isnull(IM.ConversionFactor,1) AS ConversionFactor " &
                  " From ItemTransactionMain AS ITM INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID INNER JOIN ItemPicklistReleaseDetail AS IPR ON IPR.PicklistReleaseTransactionID=ITD.PicklistReleaseTransactionID AND IPR.PicklistTransactionID=ITD.PicklistTransactionID AND IPR.ItemID=ITD.ItemID AND IPR.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID AND IPR.DepartmentID=ITM.DepartmentID AND IPR.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IPM ON IPM.TransactionID=ITD.PicklistTransactionID And IPM.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionDetail AS IPD ON IPD.TransactionID=ITD.PicklistTransactionID AND IPD.ItemID=ITD.ItemID AND IPD.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And IPD.CompanyID=ITD.CompanyID INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.ParentTransactionID AND IT.CompanyID=ITD.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID=ITM.CreatedBy And UM.CompanyID=ITM.CompanyID INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID INNER JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID AND DM.CompanyID=ITM.CompanyID LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=ITD.CompanyID LEFT JOIN ProcessMaster AS PM ON PM.ProcessID=IPD.ProcessID And PM.CompanyID=IPD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=IPD.MachineID And MM.CompanyID=IPD.CompanyID  " &
                  " Where ITM.VoucherID=-19 AND ITM.TransactionID=" & transactionID & " AND ITM.CompanyID=" & GBLCompanyID & " AND Isnull(ITD.IsDeletedTransaction,0)<>1  Order By TransID"


            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Show List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function HeaderNAme(ByVal transactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select isnull(ITM.TransactionID,0) as TransactionID,isnull(ITD.ItemID,0) as ItemID,isnull(IM.ItemGroupID,0) as ItemGroupID,  " &
                  "  isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Nullif(ITM.DeliveryNoteNo,'') as DeliveryNoteNo,  " &
                  "  isnull(IM.ItemSubGroupID, 0) As ItemSubGroupID,isnull(ITD.WarehouseID,0) As WarehouseID,  " &
                  "  isnull(ITD.FloorWarehouseID, 0) As FloorWarehouseID,isnull(ITM.DepartmentID,0) As DepartmentID,isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,  " &
                  "  Nullif(ITM.MaxVoucherNo,'') as MaxVoucherNo,Nullif(ITM.VoucherNo,'') as VoucherNo,  " &
                   " Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,  " &
                   " Nullif(IPM.VoucherNo,'') AS PicklistNo,Nullif(DM.DepartmentName,'') as DepartmentName,  " &
                   " Nullif(JEJC.JobCardContentNo,'') AS JobCardNo,Nullif(JEJ.JobName,'') as JobName,  " &
                   " Nullif(JEJC.PlanContName,'') AS ContentName,Nullif(DM.DepartmentName,'') as DepartmentName,  " &
                   " Nullif(IGM.ItemGroupName,'') as ItemGroupName,NullIf(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,  " &
                   " Nullif('','') AS ItemCode,Nullif(IM.ItemName,'') as ItemName,Nullif(IM.ItemDescription,'') as ItemDescription,  " &
                   " Nullif(ITD.StockUnit,'') as StockUnit,Nullif(ITD.IssueQuantity,'') as IssueQuantity,Nullif(ITD.BatchNo,'') as BatchNo,  " &
                   " Nullif(WM.WareHouseName,'') as Warehouse,Nullif(WM.BinName,'') as Bin,Nullif(UM.UserName,'') as UserName,Nullif(ITM.Narration,'') as Narration  " &
                   " From ItemTransactionMain As ITM  " &
                   " INNER Join ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID  " &
                   " INNER Join ItemTransactionMain AS IPM ON IPM.TransactionID=ITD.PicklistTransactionID And IPM.CompanyID=ITD.CompanyID  " &
                   " INNER Join ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  " &
                   " INNER Join ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  " &
                   " INNER Join UserMaster AS UM ON UM.UserID=ITM.CreatedBy And UM.CompanyID=ITM.CompanyID  " &
                   " Left JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID  " &
                   " Left Join JobBookingJobCardContents AS JEJC ON JEJC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JEJC.CompanyID=ITD.CompanyID  " &
                   " Left Join JobBookingJobCard AS JEJ ON JEJ.JobBookingID=JEJC.JobBookingID And JEJ.CompanyID=JEJC.CompanyID  " &
                   " Left Join ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                   " Left Join WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID  " &
                   " Where ITM.VoucherID = -19 And Isnull(ITD.IsDeletedTransaction, 0) <> 1 And ITM.TransactionID='" & transactionID & "' And ITM.CompanyID ='" & GBLCompanyID & "' AND ITM.FYear IN('" & GBLFYear & "')"

            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open Issue  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveIssueData(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal ObjectsConsumeMain As Object, ByVal ObjectsConsumeDetails As Object) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Dim dt As New DataTable
        Dim PONo As String
        Dim MaxPONo As Long
        Dim KeyField, TransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        Try

            PONo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            If (db.CheckAuthories("ItemIssue.aspx", GBLUserID, GBLCompanyID, "CanSave", PONo) = False) Then Return "You are not authorized to save..!, Can't Save"

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)
            If IsNumeric(TransactionID) = False Then
                Return "Error in transaction main: " & TransactionID
            End If

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            str = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransactionID)
                Return "Error in transaction details: " & str
            End If

            '/////Consumption receipt Entry for floor stock
            ' //ReturnTransactionID is Issue Transaction ID
            Dim VoucherID = -53
            prefix = "RFS"
            PONo = db.GeneratePrefixedNo("ItemConsumptionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherID=" & VoucherID & " And VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            TableName = "ItemConsumptionMain"
            AddColName = "ReturnTransactionID,ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,VoucherID"
            AddColValue = "" & TransactionID & ",'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "'," & VoucherID & ""
            str = db.InsertDatatableToDatabase(ObjectsConsumeMain, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransactionID)
                Return "Error in consumption main: " & str
            End If

            TableName = "ItemConsumptionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID,IssueTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & str & "','" & TransactionID & "'"
            str = db.InsertDatatableToDatabase(ObjectsConsumeDetails, TableName, AddColName, AddColValue)
            If IsNumeric(str) = False Then
                db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where CompanyID=" & GBLCompanyID & " And TransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemConsumptionMain Where CompanyID=" & GBLCompanyID & " And ReturnTransactionID=" & TransactionID)
                db.ExecuteNonSQLQuery("Delete From ItemConsumptionDetail Where CompanyID=" & GBLCompanyID & " And IssueTransactionID=" & TransactionID)
                Return "Error in consumption details: " & str
            End If
            '////////////
            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "Error in exception: " & ex.Message
        End Try
        Return KeyField
    End Function

    ''----------------------------Open Issue  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateIssue(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal ObjectsConsumeMain As Object, ByVal ObjectsConsumeDetails As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If (db.CheckAuthories("ItemIssue.aspx", GBLUserID, GBLCompanyID, "CanEdit", TransactionID) = False) Then Return "You are not authorized to update..!, Can't Update"

        Using UpTrans As New Transactions.TransactionScope
            Try

                TableName = "ItemTransactionMain"
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
                str = db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 0, wherecndtn)
                If str <> "Success" Then
                    UpTrans.Dispose()
                    Return "Error in Main: " & str
                End If
                db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

                TableName = "ItemTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
                AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    UpTrans.Dispose()
                    Return "Error in Detail: " & str
                End If

                '/////Consumption receipt Entry for floor stock
                ' //ReturnTransactionID is Issue Transaction ID

                TableName = "ItemConsumptionMain"
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And ReturnTransactionID='" & TransactionID & "' "
                str = db.UpdateDatatableToDatabase(ObjectsConsumeMain, TableName, AddColName, 0, wherecndtn)
                If str <> "Success" Then
                    UpTrans.Dispose()
                    Return "Error in Consumption Main: " & str
                End If
                db.ExecuteNonSQLQuery("Delete from ItemConsumptionDetail WHERE CompanyID='" & GBLCompanyID & "' and IssueTransactionID='" & TransactionID & "' ")

                str = "Select ConsumptionTransactionID From ItemConsumptionMain Where CompanyID='" & GBLCompanyID & "' and isnull(IsDeletedTransaction,0)<>1 And ReturnTransactionID='" & TransactionID & "'"
                db.FillDataTable(dt, str)
                If dt.Rows.Count > 0 Then
                    str = dt.Rows(0)(0)
                End If

                TableName = "ItemConsumptionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID,IssueTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & str & "','" & TransactionID & "'"
                str = db.InsertDatatableToDatabase(ObjectsConsumeDetails, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    UpTrans.Dispose()
                    Return "Error in Consumption Detail: " & str
                End If

                '/////
                db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
                KeyField = "Success"

            Catch ex As Exception
                UpTrans.Dispose()
                KeyField = "Error: " & ex.Message
            End Try

            UpTrans.Complete()

            Return KeyField
        End Using

    End Function

    ''----------------------------Open Issue Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteIssue(ByVal TransactionID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If (db.CheckAuthories("ItemIssue.aspx", GBLUserID, GBLCompanyID, "CanDelete", TransactionID) = False) Then Return "You are not authorized to delete..!, Can't Delete"

        If db.IsDeletable("ConsumptionTransactionID", "ItemConsumptionDetail AS ICD ", "INNER JOIN ItemConsumptionMain AS ICM ON ICD.ConsumptionTransactionID = ICM.ConsumptionTransactionID AND ICD.CompanyID = ICM.CompanyID And ICD.IsDeletedTransaction=0 Where ICD.CompanyID=" & GBLCompanyID & " And ICD.IssueTransactionID='" & TransactionID & "' And ICM.IsDeletedTransaction=0") = False Then
            Return "You can not delete the Issue. item is consumed in production process.., Can't Delete"
        End If

        Dim KeyField As String

        Try

            str = "Update ItemTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemConsumptionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ReturnTransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemConsumptionDetail Set ModifiedBy='" & GBLUserID & "',DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',ModifiedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and IssueTransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")

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