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
Public Class WebService_ReturnToStock
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

    '-----------------------------------Get Showlist List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Showlist() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.MaxVoucherNo,0) AS MaxVoucherNo,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.ParentTransactionID,0) AS GRNTransactionID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ITD.WarehouseID,0) AS WarehouseID,  " &
                   " Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Isnull(ITD.JobBookingID,0) As JobBookingID,  " &
                   " Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Nullif(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IT.VoucherNo,'') AS IssueVoucherNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS IssueVoucherDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,  " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptQuantity,0) AS ReturnQuantity,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.WarehouseName,'') AS Bin  " &
                   " From ItemTransactionMain AS ITM  " &
                   " INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID  " &
                   " INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  " &
                   " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                   " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.IssueTransactionID And IT.CompanyID=ITD.CompanyID And IT.VoucherID=-19  " &
                   " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID  " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                  "  LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID AND DM.CompanyID=ITM.CompanyID  " &
                  "  LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID  " &
                  "  LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID AND JJ.CompanyID=JC.CompanyID  " &
                 "   Where ITM.VoucherID=-25 And ITM.CompanyID='" & GBLCompanyID & "' And Isnull(ITD.IsDeletedTransaction, 0) <> 1"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get SelectedRow List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelectedRow(ByVal transactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(ITM.TransactionID,0) AS ReturnTransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ID.MachineID,0) AS MachineID,Isnull(ID.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.ProcessID,0) AS ProcessID,  " &
                   " Isnull(ITD.ParentTransactionID,0) As ParentTransactionID,Isnull(ITD.ItemID,0) As ItemID,Isnull(ITD.IssueTransactionID,0) As TransactionID,  " &
                   " Isnull(ITD.WarehouseID,0) AS BinID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,  " &
                   " Isnull(ITD.JobBookingID,0) As JobBookingID,Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Nullif(ITM.VoucherNo,'') AS ReturnVoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS ReturnVoucherDate,Nullif(IT.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS VoucherDate,  " &
                   " Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,   " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptQuantity,0) AS FloorStock,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.WarehouseName,'') AS Bin,Nullif(I.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),I.VoucherDate,106),' ','-') AS GRNDate,0 AS ConsumeQuantity,MM.MachineName  " &
                   " From ItemTransactionMain AS ITM   " &
                   " INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID   " &
                   " INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID   " &
                   " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID   " &
                   " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.IssueTransactionID And IT.CompanyID=ITD.CompanyID And IT.VoucherID=-19   " &
                   " INNER JOIN ItemTransactionDetail AS ID ON ID.TransactionID=ITD.IssueTransactionID And ID.ItemID=ITD.ItemID And ID.BatchNo=ITD.BatchNo And ID.CompanyID=ITD.CompanyID And ID.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID  " &
                   " INNER JOIN ItemTransactionMain AS I ON I.TransactionID=ITD.ParentTransactionID And I.CompanyID=ITD.CompanyID  " &
                   " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID And WM.CompanyID=ITD.CompanyID   " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID   " &
                   " LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID   " &
                   " LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID   " &
                   " LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID   " &
                   " LEFT JOIN MachineMaster AS MM ON MM.MachineID=ID.MachineID AND MM.CompanyID=ITD.CompanyID   " &
                   " Where ITM.VoucherID=-25 And ITD.TransactionID='" & transactionID & "' And ITM.CompanyID='" & GBLCompanyID & "'"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function


    ''----------------------------Open Get RTS No  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetRTSVoucherNO(ByVal prefix As String) As String
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

    '-----------------------------------Get Warehouse List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetWarehouseList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

            str = "Select DISTINCT Nullif(WarehouseName,'') AS Warehouse,Nullif(WarehouseName,'') AS Warehouse From WarehouseMaster Where WarehouseName <> '' AND WarehouseName IS NOT NULL  AND CompanyID=" & GBLCompanyID & "  Order By Nullif(WarehouseName,'')"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
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
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

            str = "SELECT Distinct Nullif(BinName,'') AS Bin,Isnull(WarehouseID,0) AS WarehouseID FROM WarehouseMaster Where WarehouseName='" & warehousename & "' AND Isnull(BinName,'')<>'' AND CompanyID=" & GBLCompanyID & " Order By Nullif(BinName,'')"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Bins List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDestinationBinsList(ByVal warehousename As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))

            str = "SELECT Distinct BinName AS DestinationBin,Isnull(WarehouseID,0) AS DestinationWarehouseID FROM WarehouseMaster Where WarehouseName='" & warehousename & "' AND Isnull(BinName,'')<>'' AND CompanyID=" & GBLCompanyID & " Order By DestinationBin"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Machine Name------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineMachine(ByVal DepartmentID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "select nullif(MachineId,'') as MachineId, nullif(MachineName,'') as MachineName from MachineMaster where DepartmentID='" & DepartmentID & "' and CompanyID='" & GBLCompanyID & "' And Isnull(IsDeletedTransaction, 0) <> 1"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
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
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select DepartmentID,DepartmentName From DepartmentMaster Where DepartmentID IN(Select Distinct DepartmentID From ItemTransactionMain Where VoucherID=-19 AND CompanyID= '" & GBLCompanyID & "') AND CompanyID= '" & GBLCompanyID & "' "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
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
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
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
                    "Where JEJC.CompanyID = '" & GBLCompanyID & "' And JEJC.FYEAR IN('" & GBLFYear & "')  Order BY JEJC.JobCardContentNo"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get Issue Floor Stock------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function IssueFloorStock(ByVal SelDepartment As String, ByVal RadioValue As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Isnull(MM.MachineID,0) AS MachineID,Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID, " &
                   " Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,  " &
                   " Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockType,'') AS StockType,Nullif(IM.StockCategory,'') AS StockCategory,  " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,0 AS ConsumeQuantity,(Isnull(ITD.IssueQuantity,0)-0) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM   " &
                   " INNER Join ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID  " &
                   " INNER Join ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  " &
                   " INNER Join ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID  " &
                   "  Left Join ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                   " Left Join DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID  " &
                   " Left Join JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID  " &
                   " Left Join JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID  " &
                   " Left Join ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID And Isnull(ITM.VoucherID, 0)=-14  " &
                   " Left Join WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID  " &
                   " Left Join MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID  " &
                   " Where ITM.VoucherID = -19 And Isnull(ITM.DepartmentID, 0) ='" & SelDepartment & "' AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)=1 AND (Isnull(ITD.IssueQuantity,0)-0)>0 AND Isnull(Nullif(IM.StockType,''),'" & RadioValue & "')='" & RadioValue & "'"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    '-----------------------------------Get All Issue Vouchers------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobPendingVouchers(ByVal Options As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            If Options = "AllIssueVouchers" Then
                str = "Select Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockType,'') AS StockType, " &
                  " Nullif(IM.StockCategory,'') AS StockCategory,   Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                   " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                   " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "
            ElseIf Options = "NonJobIssueVouchers" Then

                str = "Select Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif('','') AS StockType,  Nullif('','') AS StockCategory,Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity, " &
                  " ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName   " &
                  " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                  " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                  " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                  " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)=0 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

            ElseIf Options = "JobIssueVouchers" Then

                str = "Select Isnull(ITD.JobBookingID,0) AS JobBookingID,Isnull(ITD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.FloorWarehouseID,0) AS FloorWarehouseID,Isnull(ITD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(ITD.MachineID,0) AS MachineID,Isnull(ITD.ItemID,0) As ItemID,Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(ITM.VoucherNo,'') AS VoucherNo,   Replace(Convert(Varchar(13), ITM.VoucherDate, 106),' ','-') AS VoucherDate,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,Nullif('','') AS StockType, " &
                  " Nullif('','') AS StockCategory,   Nullif(IM.StockUnit,'') AS StockUnit,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(IT.VoucherNo,'') AS GRNNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS GRNDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Isnull(ITD.IssueQuantity,0) AS IssueQuantity,Isnull(CS.ConsumedStock,0) AS ConsumeQuantity,ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3) AS FloorStock,Nullif(WM.WarehouseName,'') AS WarehouseName,Nullif(WM.BinName,'') AS Bin,Nullif(MM.MachineName,'') AS MachineName  " &
                   " From ItemTransactionMain As ITM INNER JOIN ItemTransactionDetail AS ITD ON ITD.TransactionID=ITM.TransactionID And ITD.CompanyID=ITM.CompanyID INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID And IGM.CompanyID=IM.CompanyID " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID And DM.CompanyID=ITM.CompanyID LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID And JJ.CompanyID=JC.CompanyID LEFT JOIN ItemTransactionMain As IT On IT.TransactionID=ITD.ParentTransactionID And IT.CompanyID=ITD.CompanyID LEFT JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.FloorWarehouseID And WM.CompanyID=ITD.CompanyID LEFT JOIN MachineMaster AS MM ON MM.MachineID=ITD.MachineID And MM.CompanyID=ITD.CompanyID " &
                   " LEFT JOIN (Select Isnull(ICD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ICD.CompanyID,0) AS CompanyID,Isnull(ICD.ItemID,0) AS ItemID,Isnull(ICD.ParentTransactionID,0) AS ParentTransactionID,Isnull(ICD.DepartmentID,0) AS DepartmentID,Isnull(ICD.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID ,Nullif(ICD.BatchNo,'') AS BatchNo,ROUND((SUM(ISNULL(ICD.ConsumeQuantity,0))+SUM(ISNULL(ICD.ReturnQuantity,0))),3) AS ConsumedStock From ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID AND ICM.CompanyID=ICD.CompanyID Where Isnull(ICD.IsDeletedTransaction,0)=0 AND ICD.CompanyID=" & GBLCompanyID & " GROUP BY Isnull(ICD.IssueTransactionID,0),Isnull(ICD.CompanyID,0),Isnull(ICD.ItemID,0),Isnull(ICD.ParentTransactionID,0),Isnull(ICD.DepartmentID,0),Isnull(ICD.JobBookingJobCardContentsID,0),Nullif(ICD.BatchNo,'')) AS CS ON CS.IssueTransactionID=ITM.TransactionID AND CS.ItemID=ITD.ItemID AND CS.ParentTransactionID=ITD.ParentTransactionID AND CS.BatchNo=ITD.BatchNo AND CS.CompanyID=ITD.CompanyID " &
                   " Where ITM.VoucherID = -19  AND Isnull(ITD.IsDeletedTransaction,0)<>1 AND Isnull(ITD.JobBookingJobCardContentsID,0)>0 AND (ROUND((Isnull(ITD.IssueQuantity,0)-Isnull(CS.ConsumedStock,0)),3))>0 Order By TransactionID Desc "

            End If

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open RTS  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveRTSData(ByVal prefix As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsConsumptionMain As Object, ByVal jsonObjectsConsumptionDetail As Object) As String

        Dim dt, dt1 As New DataTable
        Dim PONo, ConsumptionVoucherNo As String
        Dim MaxPONo, MaxVoucherNo As Long
        Dim KeyField, TransactionID, ConsumptionTransactionID As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        If db.CheckAuthories("ReturnToStock.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then Return "You are not authorized to save"

        Try

            PONo = db.GeneratePrefixedNo("ItemTransactionMain", prefix, "MaxVoucherNo", MaxPONo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And IsDeletedTransaction=0 ")

            TableName = "ItemTransactionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxPONo & "','" & PONo & "'"
            TransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            ConsumptionVoucherNo = db.GeneratePrefixedNo("ItemConsumptionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' And IsDeletedTransaction=0")
            TableName = "ItemConsumptionMain"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,ReturnTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & prefix & "','" & MaxVoucherNo & "','" & ConsumptionVoucherNo & "'," & TransactionID & ""
            ConsumptionTransactionID = db.InsertDatatableToDatabase(jsonObjectsConsumptionMain, TableName, AddColName, AddColValue)

            TableName = "ItemConsumptionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ConsumptionTransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsConsumptionDetail, TableName, AddColName, AddColValue)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open RTS  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateRTS(ByVal TransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object, ByVal jsonObjectsConsumptionMain As Object, ByVal jsonObjectsConsumptionDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField, str2 As String
        Dim AddColName, wherecndtn, TableName, AddColValue, ConsumptionTransactionID As String

        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If db.CheckAuthories("ReturnToStock.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then Return "You are not authorized to edit"

        Try

            TableName = "ItemTransactionMain"
            AddColName = ""
            wherecndtn = ""
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And TransactionID='" & TransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from ItemTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "' ")

            TableName = "ItemTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & TransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
            str2 = ""
            str2 = "Select Top 1 ConsumptionTransactionID From ItemConsumptionMain Where ReturnTransactionID=" & TransactionID & " AND CompanyID=" & GBLCompanyID & " And IsDeletedTransaction=0"
            db.FillDataTable(dt, str2)
            Dim i As Integer = dt.Rows.Count
            If i > 0 Then
                ConsumptionTransactionID = dt.Rows(0)(0)

                TableName = "ItemConsumptionMain"
                AddColName = ""
                wherecndtn = ""
                AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
                wherecndtn = "CompanyID=" & GBLCompanyID & " And ReturnTransactionID='" & TransactionID & "' AND ConsumptionTransactionID='" & ConsumptionTransactionID & "'"
                db.UpdateDatatableToDatabase(jsonObjectsConsumptionMain, TableName, AddColName, 0, wherecndtn)

                db.ExecuteNonSQLQuery("Delete From ItemConsumptionDetail WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & ConsumptionTransactionID & "'")

                TableName = "ItemConsumptionDetail"
                AddColName = ""
                AddColValue = ""
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
                AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & ConsumptionTransactionID & "'"
                db.InsertDatatableToDatabase(jsonObjectsConsumptionDetail, TableName, AddColName, AddColValue)

            End If
            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    ''----------------------------Open RTS Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteRTS(ByVal TransactionID As String) As String

        Dim KeyField As String
        Dim ConsumptionTransactionID As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        If db.CheckAuthories("ReturnToStock.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete"

        Try

            str = "Update ItemTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update ItemTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and TransactionID='" & TransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & GBLCompanyID & "," & TransactionID & ",0")
            str = "Select Top 1 ConsumptionTransactionID From ItemConsumptionMain Where ReturnTransactionID='" & TransactionID & "' AND CompanyID='" & GBLCompanyID & "'"
            Dim DT As New DataTable
            db.FillDataTable(dt, str)
            Dim count As Integer = 0
            count = dt.Rows.Count
            If count > 0 Then
                ConsumptionTransactionID = dt.Rows(0)(0)

                str = "Update ItemConsumptionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & ConsumptionTransactionID & "' AND ReturnTransactionID='" & TransactionID & "'"
                db.ExecuteNonSQLQuery(str)

                str = "Update ItemConsumptionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & ConsumptionTransactionID & "'"
                db.ExecuteNonSQLQuery(str)

            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '-----------------------------------Get Show List------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function HeaderNAme(ByVal transactionID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("UserCompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select top 1 nullif(UM.UserName,'') as UserName,Isnull(ITM.TransactionID,0) AS TransactionID,Isnull(ITM.DepartmentID,0) AS DepartmentID,Isnull(ITD.ParentTransactionID,0) AS GRNTransactionID,Isnull(ITD.ItemID,0) AS ItemID,Isnull(ITD.IssueTransactionID,0) AS IssueTransactionID,Isnull(ITD.WarehouseID,0) AS WarehouseID,  " &
                   " Isnull(IM.ItemGroupID,0) As ItemGroupID,Isnull(IGM.ItemGroupNameID,0) As ItemGroupNameID,Isnull(IM.ItemSubGroupID,0) As ItemSubGroupID,Isnull(ITD.JobBookingID,0) As JobBookingID,  " &
                   " Isnull(ITD.JobBookingJobCardContentsID,0) As JobBookingJobCardContentsID,Nullif(ITM.VoucherNo,'') AS VoucherNo,Replace(Convert(Varchar(13),ITM.VoucherDate,106),' ','-') AS VoucherDate,Nullif(IT.VoucherNo,'') AS IssueVoucherNo,Replace(Convert(Varchar(13),IT.VoucherDate,106),' ','-') AS IssueVoucherDate,Nullif(JC.JobCardContentNo,'') AS JobCardNo,Nullif(JJ.JobName,'') AS JobName,Nullif(JC.PlanContName,'') AS ContentName,Nullif(DM.DepartmentName,'') AS DepartmentName,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IM.ItemName,'') AS ItemName,  " &
                   " Nullif(IM.StockUnit,'') AS StockUnit,Isnull(ITD.ReceiptQuantity,0) AS ReturnQuantity,Nullif(ITD.BatchNo,'') AS BatchNo,Nullif(WM.WarehouseName,'') AS Warehouse,Nullif(WM.WarehouseName,'') AS Bin  " &
                   " From ItemTransactionMain AS ITM  inner join UserMaster as UM on UM.UserID=ITM.CreatedBy" &
                   " INNER JOIN ItemTransactionDetail AS ITD ON ITM.TransactionID=ITD.TransactionID AND ITM.CompanyID=ITD.CompanyID  " &
                   " INNER JOIN ItemMaster AS IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  " &
                   " INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID=IM.ItemGroupID AND IGM.CompanyID=IM.CompanyID  " &
                   " INNER JOIN ItemTransactionMain AS IT ON IT.TransactionID=ITD.IssueTransactionID And IT.CompanyID=ITD.CompanyID And IT.VoucherID=-19  " &
                   " INNER JOIN WarehouseMaster AS WM ON WM.WarehouseID=ITD.WarehouseID AND WM.CompanyID=ITD.CompanyID  " &
                   " LEFT JOIN ItemSubGroupMaster AS ISGM ON ISGM.ItemSubGroupID=IM.ItemSubGroupID And ISGM.CompanyID=IM.CompanyID  " &
                  "  LEFT JOIN DepartmentMaster AS DM ON DM.DepartmentID=ITM.DepartmentID AND DM.CompanyID=ITM.CompanyID  " &
                  "  LEFT JOIN JobBookingJobCardContents AS JC ON JC.JobBookingJobCardContentsID=ITD.JobBookingJobCardContentsID And JC.CompanyID=ITD.CompanyID  " &
                  "  LEFT JOIN JobBookingJobCard AS JJ ON JJ.JobBookingID=JC.JobBookingID AND JJ.CompanyID=JC.CompanyID  " &
                 "   Where ITM.VoucherID=-25 And ITM.CompanyID='" & GBLCompanyID & "' and ITM.TransactionID='" & transactionID & "'"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
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