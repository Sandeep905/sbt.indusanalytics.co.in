Imports System.Data
Imports System.Web
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports Connection
Imports UserAuthentication

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebServiceProductionOutsource
    Inherits System.Web.Services.WebService
    Dim db As New DBConnection
    Dim Str As String
    Dim dataTable As New DataTable
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()

    Dim GBLUserID As String
    Dim GBLCompanyID As String
    Dim GBLFYear As String


    ''/////////////////////////////////////////////// Outsource Send Start

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOutsourceVoucherNo(ByVal prefix As String) As String
        Try
            Dim MaxVoucherNo As Long
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Return db.GeneratePrefixedNo("OutsourceProductionMain", prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendorsList() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            '            Str = "Select Distinct LedgerID,LedgerName From LedgerMaster Where Isnull(IsDeletedTransaction,0)=0 And LedgerGroupID =(Select LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=25 And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0) And CompanyID=" & GBLCompanyID & ""
            Str = "Select A.[LedgerID] AS LedgerID,A.[LedgerName] As LedgerName,Nullif(A.[State],'') As State,Nullif(A.[City],'') As [City],(Select Top 1 StateTinNo From CountryStateMaster Where State=A.State) As CompanyStateTinNo From (SELECT [LedgerID],[LedgerGroupID],[LedgerName],[State],[City] FROM (SELECT [LedgerID],[LedgerGroupID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] Where Isnull(IsDeletedTransaction,0)=0 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where Isnull(IsDeletedTransaction,0)=0 And CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=25 ))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[State],[City])) p) AS A"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOutsourceOperators() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "Select Distinct LedgerID As OperatorID,LedgerName As OperatorName From LedgerMaster Where LedgerName Like '%Outsource%' And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOutsourceMachines() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "Select Distinct MachineID ,MachineName From MachineMaster Where MachineName Like '%Outsource%' And CompanyID=" & GBLCompanyID
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetScheduledJobCard() As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            Str = "Select Distinct JB.JobBookingID,JB.JobBookingNo From JobBookingJobCard As JB Inner Join JobScheduleRelease As JSR On JSR.JobBookingID=JB.JobBookingID And JB.CompanyID=JSR.CompanyID And Isnull(JB.IsDeletedTransaction,0)=0 Where JB.CompanyID=" & GBLCompanyID & " Order BY JB.JobBookingNo"

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetScheduledJobCardContents(ByVal JCId As Integer) As String
        Try
            Dim str As String

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            str = "Select Distinct Isnull(JCD.JobBookingJobCardContentsID,0) as JobBookingJobCardContentsID,isnull(LM.LedgerID,0) as LedgerID, nullif(LM.LedgerName,'') as LedgerName, nullif(JOB.SalesOrderNO,'') as SalesOrderNO, nullif(JC.PONO,'') as PONO, nullif(JCD.JobCardContentNo,'') as JobCardContentNo, replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-') as JobBookingDate, nullif(JC.JobName,'') as JobName, nullif(JCD.PlanContName,'') as PlanContName,  " &
                  "isnull(JC.OrderQuantity,0) as OrderQuantity,    replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') as DeliveryDate, nullif(JC.ProductCode,'') as ProductCode, nullif(JC.JobPriority,'') as JobPriority, nullif(JCD.JobType,'') as JobType, nullif(IM.ItemCode,'') as ItemCode,nullif(IM.ItemType,'') as ItemType,   " &
                  "nullif(IM.ItemName,'') as ItemName,isnull(JCD.FullSheets,0) as FullSheets, isnull(JCD.ActualSheets,0) as ActualSheets From LedgerMaster as LM   " &
                  "INNER JOIN JobOrderBooking AS JOB ON  JOB.LedgerID = LM.LedgerID And JOB.CompanyID = LM.CompanyID   " &
                  "INNER JOIN JobBookingJobCard AS JC ON JC.OrderBookingID = JOB.OrderBookingID AND JC.CompanyID = JOB.CompanyID   " &
                  "INNER JOIN  JobBookingJobCardContents as JCD ON JCD.JobBookingID = JC.JobBookingID And JCD.CompanyID = JC.CompanyID   " &
                  "INNER JOIN ItemMaster as IM ON IM.ItemID = JCD.PaperID And JCD.CompanyID = IM.CompanyID Inner Join JobScheduleRelease As JSR On JCD.JobBookingID=JSR.JobBookingID And JCD.JobBookingJobCardContentsID=JSR.JobBookingJobCardContentsID And JCD.CompanyID=JSR.CompanyID  " &
                  "Where JCD.CompanyID='" & GBLCompanyID & "' And JC.JobBookingID=" & JCId & " AND Isnull(JC.IsDeletedTransaction,0) = 0   " &
                  "GROUP BY JCD.JobBookingJobCardContentsID , LM.LedgerID , LM.LedgerName ,JOB.SalesOrderNo,JC.PONO,JCD.JobCardContentNo,Replace(convert(nvarchar(30),JC.JobBookingDate,106),' ','-') , JC.JobName , JCD.PlanContName , JC.OrderQuantity , replace(convert(nvarchar(30),JC.DeliveryDate,106),' ','-') ,JC.ProductCode , JC.JobPriority , JCD.JobType , IM.ItemCode , IM.ItemType , IM.ItemName , JCD.FullSheets , JCD.ActualSheets " &
                  "ORDER BY JobCardContentNo"

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentWiseProcessDetail(ByVal ContID As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            Str = "Select JSR.ScheduleSequenceID,JSR.JobBookingJobCardContentsID,Isnull(JSR.SequenceNo,0) As SequenceNo,isnull(JEO.ProcessID,0) as ProcessID, nullif(PM.ProcessName,'') as ProcessName, nullif(JEO.RateFactor,'') As RateFactor,(Select ProcessName From ProcessMaster Where ProcessID= dbo.GETPREVIOUSPROCESSID(JSR.JobBookingJobCardContentsID,JEO.CompanyID,PM.ProcessID) And CompanyID=JEO.CompanyID) As PreProcessName, (Select Isnull(Sum(ReadyQuantity),0) From ProductionEntryFormWise Where ProcessID= dbo.GETPREVIOUSPROCESSID(JSR.JobBookingJobCardContentsID,JEO.CompanyID,PM.ProcessID) And CompanyID=JEO.CompanyID And JobCardFormNo=JSR.JobCardFormNO) As PreProcessQty,Isnull(JEO.ToBeProduceQty,0)  As ToBeProduceQty ,JSR.ScheduleQty-Isnull(SUM(PE.ReceivedQuantity),0) As ScheduleQty,Isnull(Sum(PE.ReadyQuantity),0) As ReadyQuantity,JSR.JobCardFormNo " &
                    " From JobBookingJobCardProcess As JEO INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JEO.ProcessID And PM.CompanyID = JEO.CompanyID And JEO.IsDeletedTransaction=0 Inner Join JobScheduleRelease As JSR On JSR.JobBookingJobCardContentsID=JEO.JobBookingJobCardContentsID And JSR.ProcessID=JEO.ProcessID And JEO.CompanyID=JSR.CompanyID And JSR.RateFactor=JEO.RateFactor And JSR.IsDeletedTransaction=0 Left Join ProductionEntry As PE On PE.JobBookingJobCardContentsID=JEO.JobBookingJobCardContentsID And PE.ProcessID=JEO.ProcessID And PE.CompanyID=JSR.CompanyID And PE.RateFactor=JEO.RateFactor " &
                    " Where PM.ProcessName NOT LIKE '%Plate Making%' AND isnull(JEO.JobBookingJobCardContentsID,0)='" & ContID & "' AND JEO.CompanyID = '" & GBLCompanyID & "' And Isnull(JSR.Status,'In Queue') Not In ('Running','Complete') " &
                    " GROUP By JSR.ScheduleSequenceID,JSR.SequenceNo,JSR.ScheduleQty,JEO.ProcessID, PM.ProcessName, JEO.RateFactor , PM.ProcessID,JEO.CompanyID,JEO.ToBeProduceQty,JSR.JobCardFormNo,JSR.JobBookingJobCardContentsID /*Having Isnull(SUM(PE.ReceivedQuantity),0)<=JSR.ScheduleQty*/ Order By SequenceNo "
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentWiseProcessMaterialsDetail(ByVal ContID As Integer, ByVal OprType As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            'Str = "SELECT Distinct JBMR.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, JBMR.SequenceNo,  (Sum(Isnull(ITD.IssueQuantity,0)) - Isnull((Select Sum(Isnull(D.ConsumeQuantity,0)) From ItemConsumptionMain as M INNER JOIN ItemConsumptionDetail as D ON M.ConsumptionTransactionID = D.ConsumptionTransactionID AND M.CompanyID=D.CompanyID Where D.ItemID = ITD.ItemID AND D.CompanyID = ITD.CompanyID AND Isnull(D.IsDeletedTransaction,0) =0),0)) As FloorStock,JBMR.RequiredQty,Case When JBMR.RequiredQtyUnit='' Then IM.StockUnit Else JBMR.RequiredQtyUnit End AS StockUnit, JBMR.EstimatedQuantity, IM.ItemCode, IGM.ItemGroupName,Sum(ITD.IssueQuantity) As IssueQuantity " &
            '        " FROM JobBookingJobCard AS JB INNER JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingID = JB.JobBookingID AND JBC.CompanyID = JB.CompanyID AND ISNULL(JB.IsDeletedTransaction, 0) = 0 AND JB.CompanyID = " & GBLCompanyID & " INNER JOIN JobBookingJobCardProcessMaterialRequirement AS JBMR ON JBMR.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND JBMR.CompanyID = JBC.CompanyID AND ISNULL(JBMR.IsDeletedTransaction, 0) = 0 INNER JOIN ItemMaster AS IM ON JBMR.ItemID = IM.ItemID AND JBMR.CompanyID = IM.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID AND IGM.CompanyID = IM.CompanyID Inner Join " &
            '        " ItemTransactionDetail As ITD On ITD.ItemID = JBMR.ItemID And ITD.ItemGroupID=JBMR.ItemGroupID And ITD.CompanyID=JBMR.CompanyID Inner Join ItemTransactionMain As ITM On ITD.TransactionID = ITM.TransactionID And ITD.CompanyID=ITM.CompanyID And ITM.VoucherID=-19 " &
            '        " WHERE (JBMR.JobBookingJobCardContentsID = '" & ContID & "') AND (JBMR.ProcessID = '" & OprID & "') " &
            '        " Group By ITD.CompanyID, JBMR.ItemID, ITD.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, JBMR.SequenceNo , JBMR.RequiredQtyUnit ,IM.StockUnit, JBMR.EstimatedQuantity,JBMR.RequiredQty, IM.ItemCode, IGM.ItemGroupName, IM.ItemName"
            Str = "SELECT DISTINCT IM.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, ITD.TransID As SequenceNo, ROUND(SUM(ISNULL(ITD.ReceivedQuantity, 0)) - SUM(ISNULL(ITD.IssueQuantity, 0)), 3) AS FloorStock , Isnull(JBMR.RequiredQty,0) As RequiredQty, Isnull(JBMR.EstimatedQuantity,0) As EstimatedQuantity , CASE WHEN ITD.StockUnit = '' THEN IM.StockUnit ELSE ITD.StockUnit END AS StockUnit, IM.ItemCode, IGM.ItemGroupName, ROUND(SUM(ISNULL(ITD.ReceivedQuantity, 0)),3) As IssueQuantity,ITD.BatchNo,ITD.FloorWarehouseID,ITD.DepartmentID,ITD.IssueTransactionID,ITD.ParentTransactionID,0 As ProcessingQty, CASE WHEN ITD.StockUnit = '' THEN IM.StockUnit ELSE ITD.StockUnit END AS WIPUnit " &
                " FROM JobBookingJobCard AS JB INNER JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingID = JB.JobBookingID AND JBC.CompanyID = JB.CompanyID AND ISNULL(JB.IsDeletedTransaction, 0) = 0 AND JB.CompanyID = " & GBLCompanyID & " Inner Join ItemConsumptionDetail AS ITD ON ITD.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND ITD.CompanyID = JBC.CompanyID And ITD.IsDeletedTransaction=0 INNER JOIN ItemConsumptionMain AS ITM ON ITD.ConsumptionTransactionID = ITM.ConsumptionTransactionID AND ITD.CompanyID = ITM.CompanyID Left JOIN JobBookingJobCardProcessMaterialRequirement AS JBMR ON JBMR.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID And JBMR.ProcessID=ITD.ProcessID AND JBMR.CompanyID = JBC.CompanyID AND ISNULL(JBMR.IsDeletedTransaction, 0) = 0 " &
                " INNER JOIN ItemMaster AS IM ON ITD.ItemID = IM.ItemID AND JB.CompanyID = IM.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID AND IGM.CompanyID = IM.CompanyID " &
                " WHERE (ITD.JobBookingJobCardContentsID = " & ContID & ") " &
                " GROUP BY ITD.CompanyID, IM.ItemID, ITD.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, ITD.TransID, ITD.StockUnit, IM.StockUnit, JBMR.EstimatedQuantity, JBMR.RequiredQty, IM.ItemCode, IGM.ItemGroupName, IM.ItemName,ITD.BatchNo,ITD.FloorWarehouseID,ITD.DepartmentID,ITD.IssueTransactionID,ITD.ParentTransactionID"

            If OprType = "All" Then
                Str = Str & " Union All " & "SELECT DISTINCT IM.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, ITD.TransID As SequenceNo, ROUND(SUM(ISNULL(ITD.ReceivedQuantity, 0)) - SUM(ISNULL(ITD.IssueQuantity, 0)), 3) AS FloorStock , 0 As RequiredQty, 0 As EstimatedQuantity , CASE WHEN ITD.StockUnit = '' THEN IM.StockUnit ELSE ITD.StockUnit END AS StockUnit, IM.ItemCode, IGM.ItemGroupName, ROUND(SUM(ISNULL(ITD.ReceivedQuantity, 0)),3) As IssueQuantity,ITD.BatchNo,ITD.FloorWarehouseID,ITD.DepartmentID,ITD.IssueTransactionID,ITD.ParentTransactionID ,0 As ProcessingQty, CASE WHEN ITD.StockUnit = '' THEN IM.StockUnit ELSE ITD.StockUnit END AS WIPUnit " &
                                    " FROM ItemConsumptionMain AS ITM INNER JOIN ItemConsumptionDetail AS ITD ON ITD.ConsumptionTransactionID = ITM.ConsumptionTransactionID AND ITD.CompanyID = ITM.CompanyID And ITM.VoucherID=-53 And ITD.IsDeletedTransaction=0 INNER JOIN " &
                                    " ItemMaster AS IM ON ITD.ItemID = IM.ItemID AND ITD.CompanyID = IM.CompanyID INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID AND IGM.CompanyID = IM.CompanyID " &
                                    " WHERE (ITD.DepartmentID = -11) AND ISNULL(ITD.IsDeletedTransaction, 0) = 0 AND ITD.CompanyID = " & GBLCompanyID & "" &
                                    " GROUP BY ITD.CompanyID, IM.ItemID, ITD.ItemID, IGM.ItemGroupID, IGM.ItemGroupNameID, IM.ItemName, ITD.TransID, ITD.StockUnit, IM.StockUnit, IM.ItemCode, IGM.ItemGroupName, IM.ItemName,ITD.BatchNo,ITD.FloorWarehouseID,ITD.DepartmentID,ITD.IssueTransactionID,ITD.ParentTransactionID"
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductionOutsource(ByVal ObjData As Object, ByVal ObjDataMain As Object, ByVal ObjDataDetails As Object, ByVal ObjProcess As Object, ByVal objMachineEntry As Object, ByVal objFormsEntry As Object) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If (db.CheckAuthories("ProductionOutsource.aspx", GBLUserID, GBLCompanyID, "CanSave") = False) Then Return "You are not authorized to save..!, Can't Save"

            Dim Prefix As String = "OS"
            Dim MaxVoucherNo As Long = 0
            Dim TableName, AddCol, ColValue As String
            Dim OutsourceID As String

            TableName = "OutsourceProductionMain"
            Dim VoucherNo As String = db.GeneratePrefixedNo(TableName, Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where Prefix='" & Prefix & "' And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            AddCol = "Prefix,VoucherID,VoucherNo,MaxVoucherNo,CompanyID,UserID,FYear,VoucherDate"
            ColValue = "'" & Prefix & "',-50,'" & VoucherNo & "','" & MaxVoucherNo & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate() "
            Using UpTrans As New Transactions.TransactionScope

                OutsourceID = db.InsertDatatableToDatabase(ObjData, TableName, AddCol, ColValue)
                If IsNumeric(OutsourceID) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & OutsourceID
                End If

                TableName = "OutsourceProductionDetails"
                AddCol = "OutsourceID,CompanyID,UserID,FYear,SentDate"
                ColValue = "'" & OutsourceID & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate() "

                Str = db.InsertDatatableToDatabase(ObjProcess, TableName, AddCol, ColValue)
                If IsNumeric(Str) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & Str
                End If

                Dim VoucherID = -50
                Prefix = "OPS"
                VoucherNo = db.GeneratePrefixedNo("ItemConsumptionMain", Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & Prefix & "' And VoucherID=" & VoucherID & " And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

                TableName = "ItemConsumptionMain"
                AddCol = "OutsourceProductionID,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,VoucherID"
                ColValue = "" & OutsourceID & ",Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'," & VoucherID & ""
                Str = db.InsertDatatableToDatabase(ObjDataMain, TableName, AddCol, ColValue)
                If IsNumeric(Str) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & Str
                End If

                TableName = "ItemConsumptionDetail"
                AddCol = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
                ColValue = "Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Str & "'"

                Str = db.InsertDatatableToDatabase(ObjDataDetails, TableName, AddCol, ColValue)
                If IsNumeric(Str) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & Str
                End If

                For index = 0 To ObjProcess.length - 1
                    Dim objMachineE, objFormsE As New Collection()

                    objMachineE.Add(objMachineEntry(index))
                    objFormsE.Add(objFormsEntry(index))

                    Str = SaveProductionData(objMachineE, objFormsE, OutsourceID)
                    If Str <> "Success" Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If

                    db.ExecuteNonSQLQuery("Update JobScheduleRelease Set Status='Outsource Send' Where ProcessID=" & ObjProcess(index)("ProcessID") & " And RateFactor='" & ObjProcess(index)("RateFactor") & "' And JobCardFormNo='" & ObjProcess(index)("JobCardFormNo") & "' And JobBookingID=" & ObjProcess(index)("JobBookingID") & " And JobBookingJobCardContentsID=" & ObjProcess(index)("JobBookingJobCardContentsID") & " And MachineID=" & objMachineEntry(index)("MachineID"))
                    db.ExecuteNonSQLQuery("Update JobBookingJobCardProcess Set Status='Outsource Send' Where ProcessID=" & ObjProcess(index)("ProcessID") & " And RateFactor='" & ObjProcess(index)("RateFactor") & "' And JobBookingID=" & ObjProcess(index)("JobBookingID") & " And JobBookingJobCardContentsID=" & ObjProcess(index)("JobBookingJobCardContentsID"))
                Next

                UpTrans.Complete()

            End Using
            Return "Success"
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
    End Function

    Private Function SaveProductionData(ByVal objMachineEntry As Object, ByVal objFormsEntry As Object, ByVal OutsourceID As Long) As String

        Dim KeyFieldStatus As String
        Dim ProductionID As String

        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim Shift As String = db.GetColumnValue("ShiftNo", "ShiftManagement", " CompanyID='" & GBLCompanyID & "' And Convert(varchar, getdate(), 8) Between  Convert(varchar, StartTime , 8) And Convert(varchar, EndTime, 8)")
            If Shift = "" Then Shift = 1

            TableName = "ProductionEntry"
            AddColName = "Shift,ModifiedDate,FromTime,UserID,CompanyID,FYear,OutsourceProductionID,IsOutSource"
            AddColValue = "" & Shift & ",'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "'," & OutsourceID & ",1"
            ProductionID = db.InsertDatatableToDatabase(objMachineEntry, TableName, AddColName, AddColValue)
            If IsNumeric(ProductionID) = False Then
                KeyFieldStatus = ProductionID
                Return KeyFieldStatus
            End If

            TableName = "ProductionUpdateEntry"
            AddColName = "Shift,ModifiedDate,FromTime,UserID,CompanyID,FYear,ProductionID,OutsourceProductionID"
            AddColValue = "" & Shift & ",'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & ProductionID & "'," & OutsourceID & ""
            KeyFieldStatus = db.InsertDatatableToDatabase(objMachineEntry, TableName, AddColName, AddColValue)
            If IsNumeric(KeyFieldStatus) = False Then
                Return KeyFieldStatus
            End If

            TableName = "ProductionEntryFormWise"
            AddColName = "Shift,ModifiedDate,FromTime,UserID,CompanyID,FYear,ProductionID,OutsourceProductionID"
            AddColValue = "" & Shift & ",'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & ProductionID & "'," & OutsourceID & ""
            KeyFieldStatus = db.InsertDatatableToDatabase(objFormsEntry, TableName, AddColName, AddColValue)
            If IsNumeric(KeyFieldStatus) = False Then
                Return KeyFieldStatus
            End If

            KeyFieldStatus = "Success"
            '   End If
        Catch ex As Exception
            KeyFieldStatus = "fail " & ex.Message
        End Try
        Return KeyFieldStatus
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetShowList() As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Str = "SELECT DISTINCT OPD.SequenceNo,OPR.VoucherNo As ReceiptVoucherNo,REPLACE(CONVERT(nvarchar(30), OPR.VoucherDate, 106), ' ', '-') As ReceiptVoucherDate,Isnull(OPM.IsChallanSend,0) As IsChallanSend,OPM.OutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPM.VoucherNo, REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS VoucherDate, OPM.LedgerID, NULLIF (OPM.Remark, '') AS Remark, LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,NULLIF(OPM.Transporter,'') As Transporter,NULLIF(OPM.VehicleNo,'') As VehicleNo,OPD.QuantitySent, IsNull(SUM(OPRD.QuantityReceive),0) As QuantityReceive,(OPD.QuantitySent)-IsNull(SUM(OPRD.QuantityReceive),0)-(Select Isnull(Sum(QuantityReceive),0) From OutsourceProductionDetails Where CompanyID = OPRD.CompanyID AND ISNULL(IsDeletedTransaction, 0) = 0 AND OutsourceID < OPRD.OutsourceID AND JobBookingJobCardContentsID = OPRD.JobBookingJobCardContentsID AND ProcessID = OPRD.ProcessID AND RateFactor = OPRD.RateFactor AND JobCardFormNo = OPRD.JobCardFormNo) As PendingToReceive,OPM.PlaceOfSupply,PE.EmployeeID As OperatorID,PE.MachineID " &
                    " FROM OutsourceProductionMain AS OPM INNER JOIN OutsourceProductionDetails AS OPD On OPM.OutsourceID=OPD.OutsourceID And OPM.CompanyID=OPD.CompanyID INNER JOIN JobBookingJobCard AS JB ON JB.JobBookingID = OPM.JobBookingID AND JB.CompanyID = OPM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID AND LM.CompanyID = OPM.CompanyID INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID And OPM.CompanyID=UM.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID " &
                    " LEFT JOIN OutsourceProductionMain As OPR On (OPR.CompanyID = OPM.CompanyID) AND (ISNULL(OPR.IsDeletedTransaction, 0) = 0) AND (OPM.OutsourceID= OPR.ParentOutsourceID) And OPR.VoucherID=-51 LEFT JOIN OutsourceProductionDetails As OPRD On (OPRD.CompanyID = OPR.CompanyID) AND (ISNULL(OPRD.IsDeletedTransaction, 0) = 0) AND (OPR.OutsourceID= OPRD.OutsourceID) And OPRD.JobBookingJobCardContentsID=OPD.JobBookingJobCardContentsID And OPRD.ProcessID=OPD.ProcessID And OPRD.RateFactor=OPD.RateFactor And OPRD.JobCardFormNo=OPD.JobCardFormNo LEFT JOIN ProductionEntry As PE On PE.OutsourceProductionID=OPM.OutsourceID And PE.CompanyID=OPM.CompanyID" &
                    " Where OPM.VoucherID=-50 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID=" & GBLCompanyID &
                    " Group By OPD.SequenceNo,OPR.VoucherNo ,OPR.VoucherDate,OPM.IsChallanSend, OPM.OutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, JB.JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPM.VoucherNo, OPM.VoucherDate, OPM.LedgerID, OPM.Remark, LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,OPM.Transporter,OPM.VehicleNo, OPD.QuantitySent,OPRD.JobBookingJobCardContentsID,OPRD.ProcessID,OPRD.RateFactor,OPRD.JobCardFormNo,OPRD.CompanyID,OPRD.OutsourceID, OPM.PlaceOfSupply, PE.EmployeeID ,PE.MachineID " &
                    " Order By ReceiptVoucherNo"

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ReloadEditData(ByVal OutsourceID As Integer) As String
        Try
            Dim DTContents, DTProcess As New DataTable

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Str = "SELECT ICM.ConsumptionTransactionID, IM.ItemName, IM.ItemCode, IM.ItemGroupID, IM.ItemID, ICM.JobBookingJobCardContentsID, PM.ProcessID, PM.ProcessName, ICD.IssueTransactionID, ICD.ParentTransactionID, DM.DepartmentID, ICD.BatchNo, ICD.WarehouseID, ICD.FloorWarehouseID, ICD.MachineID, ICD.IssueQuantity As RequiredQty, IM.StockUnit, ICD.Remark, ICD.ProcessingQty, ICD.WIPUnit,OCD.JobCardContentNo, OCD.PlanContName, OCD.RateFactor, OCD.JobCardFormNo, OCD.ReadyQuantity " &
                    " From ItemConsumptionDetail As ICD INNER JOIN ItemConsumptionMain As ICM ON ICM.ConsumptionTransactionID=ICD.ConsumptionTransactionID And ICM.CompanyID=ICD.CompanyID INNER JOIN OutsourceProductionMain AS OCM ON OCM.OutsourceID = ICM.OutsourceProductionID AND OCM.CompanyID = ICD.CompanyID INNER JOIN OutsourceProductionDetails AS OCD ON OCM.OutsourceID = OCD.OutsourceID AND OCM.CompanyID = OCD.CompanyID " &
                    " INNER JOIN ItemMaster As IM ON IM.ItemID=ICD.ItemID And IM.CompanyID=ICD.CompanyID INNER JOIN ProcessMaster As PM ON PM.ProcessID=ICD.ProcessID And PM.CompanyID=ICD.CompanyID " &
                    " INNER JOIN DepartmentMaster As DM ON DM.DepartmentID=ICD.DepartmentID And DM.CompanyID=ICD.CompanyID " &
                    " Where ICM.OutsourceProductionID=" & OutsourceID & " And ICM.IsDeletedTransaction=0 And ICM.CompanyID=" & GBLCompanyID

            db.FillDataTable(DTContents, Str)

            Str = "SELECT PM.ProcessName,OCD.ProcessID, OCD.RateFactor, OCD.JobCardFormNo, OCD.ReadyQuantity, OCD.QuantitySent AS ScheduleQty, OCD.OutsourceFormID, OCM.JobBookingID, OCM.JobBookingJobCardContentsID " &
                    " From OutsourceProductionMain As OCM INNER Join " &
                    " OutsourceProductionDetails AS OCD ON OCM.OutsourceID = OCD.OutsourceID AND OCM.CompanyID = OCD.CompanyID INNER JOIN ProcessMaster As PM ON PM.ProcessID=OCD.ProcessID And PM.CompanyID=OCD.CompanyID " &
                    " Where OCM.OutsourceID=" & OutsourceID & " And OCM.IsDeletedTransaction=0 And OCM.CompanyID=" & GBLCompanyID

            db.FillDataTable(DTProcess, Str)

            Dim dataSet As New DataSet
            DTContents.TableName = "DTContentsDetail"
            dataSet.Tables.Add(DTContents)
            DTProcess.TableName = "DTProcessDetail"
            dataSet.Tables.Add(DTProcess)

            data.Message = db.ConvertDataSetsTojSonString(dataSet)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProductionOutsource(ByVal OutID As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If (db.CheckAuthories("ProductionOutsource.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False) Then Return "You are not authorized to delete..!, Can't Delete"

            'Str = "Select OutsourceID From OutsourceProductionMain Where OutsourceID=" & OutID & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0 And IsChallanSend=1 Or ParentOutsourceID>0"
            Str = "Select OutsourceID From OutsourceChallanMain Where OutsourceID =" & OutID & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0"
            db.FillDataTable(dataTable, Str)
            If dataTable.Rows.Count > 0 Then
                Return "Can't Delete, Transaction is further processed.."
            End If

            Str = DeleteOutsourceData(OutID, "In Queue")
            Return Str
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    ''////////////////////////////////// Outsource Challan Start/////////////////////////////////

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOutsourceChallanVoucherNo() As String
        Try
            Dim MaxVoucherNo As Long

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Return db.GeneratePrefixedNo("OutsourceChallanMain", "POC", "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where Prefix='POC' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPendingChallanPO(ByVal flag As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            If flag = False Then
                Str = "SELECT DISTINCT  0 As OutsourceChallanID ,OPM.OutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPM.VoucherNo As SendVoucherNo, REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS SendVoucherDate, OPM.LedgerID, NULLIF (OPM.Remark, '') AS Remark, LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,NULL As Transporter,NULL As VehicleNo,OPM.PlaceOfSupply,NULL As EWayBillNumber,Getdate() AS EWayBillDate  " &
                    " FROM OutsourceProductionMain AS OPM INNER JOIN JobBookingJobCard AS JB  ON JB.JobBookingID = OPM.JobBookingID AND JB.CompanyID = OPM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID AND LM.CompanyID = OPM.CompanyID INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID And OPM.CompanyID=UM.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID " &
                    " Where OPM.VoucherID=-50 And Isnull(OPM.IsChallanSend,0)=0 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID=" & GBLCompanyID
            Else
                Str = "SELECT DISTINCT  OCM.OutsourceChallanID, OPM.OutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID,OCM.VoucherNo, REPLACE(CONVERT(nvarchar(30), OCM.VoucherDate, 106), ' ', '-') AS VoucherDate,  OPM.VoucherNo As SendVoucherNo, REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS SendVoucherDate, OPM.LedgerID, NULLIF (OCM.Remark, '') AS Remark, LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,NULLif(OCM.Transporter,'') As Transporter,NULLIF(OCM.VehicleNo ,'') As VehicleNo,OCM.PlaceOfSupply,OCM.EWayBillNumber,Case When Isnull(OCM.EWayBillDate,'')='' Then Getdate() Else REPLACE(CONVERT(nvarchar(30),OCM.EWayBillDate , 106), ' ', '-') End AS EWayBillDate " &
                    " FROM OutsourceProductionMain AS OPM INNER JOIN OutsourceProductionDetails AS OPD ON OPD.OutsourceID = OPM.OutsourceID AND OPD.CompanyID = OPM.CompanyID INNER JOIN OutsourceChallanDetails AS OCD ON OCD.OutsourceID = OPD.OutsourceID AND OCD.CompanyID = OPM.CompanyID INNER JOIN OutsourceChallanMain AS OCM ON OCM.OutsourceChallanID = OCD.OutsourceChallanID AND OCM.CompanyID = OCD.CompanyID INNER JOIN JobBookingJobCard AS JB ON JB.JobBookingID = OPM.JobBookingID AND JB.CompanyID = OPM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OCM.LedgerID AND LM.CompanyID = OPM.CompanyID INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID AND OPM.CompanyID = UM.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID " &
                    " Where (ISNULL(OCM.IsDeletedTransaction, 0) = 0) AND Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID=" & GBLCompanyID
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetContentWiseMaterialDetail(ByVal OutID As String, ByVal Flag As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            If Flag = False Then
                Str = "SELECT DISTINCT 0 As ChallanDetailID, OM.OutsourceID, ICD.ItemID, JSR.JobCardContentNo, JSR.ContentName As PlanContName, /*JSR.JobCardFormNo,*/ ICM.VoucherNo, ICM.JobBookingID,ICM.JobBookingJobCardContentsID, ICD.ProcessID, ICD.IssueQuantity,Case When Isnull(dbo.CallRateLanded(Isnull(ICD.ParentTransactionID,0), IM.ItemID,ICD.BatchNo),0)>0 THEN dbo.CallRateLanded(Isnull(ICD.ParentTransactionID,0), IM.ItemID,ICD.BatchNo) ELSE Isnull(IM.PurchaseRate,0) END As ItemRate,IM.ItemGroupID, IM.LastPurchaseRate,Case When Upper(IM.PurchaseUnit)='KG' And IM.ItemGroupID=1 Then Round(ICD.IssueQuantity*IM.WtPerPacking,3) Else ICD.IssueQuantity End IssueWt,IM.PurchaseUnit,Case When Upper(IM.PurchaseUnit)='KG' And IM.ItemGroupID=1 Then Round(ICD.IssueQuantity*IM.WtPerPacking*IM.PurchaseRate,3) Else ICD.IssueQuantity*IM.PurchaseRate End As ItemAmount,Case When Isnull(ICD.StockUnit,'')='' Then IM.StockUnit Else ICD.StockUnit End As StockUnit,ICD.BatchNo, IM.ItemCode, IM.ItemName, IM.ProductHSNID, IGM.HSNCode, IGM.ProductHSNName,ICD.IssueQuantity,NULL AS Remark ,ICD.Remark As ItemDescription ,ICD.ProcessingQty,ICD.WIPUnit " &
                    " FROM ItemConsumptionMain AS ICM INNER JOIN ItemConsumptionDetail AS ICD ON ICM.ConsumptionTransactionID = ICD.ConsumptionTransactionID AND ICM.CompanyID = ICD.CompanyID INNER JOIN ItemMaster AS IM ON ICD.ItemID = IM.ItemID AND ICD.CompanyID = IM.CompanyID INNER JOIN ProductHSNMaster AS IGM ON IM.ProductHSNID = IGM.ProductHSNID AND IM.CompanyID = IGM.CompanyID INNER JOIN OutsourceProductionDetails AS OM ON ICM.OutsourceProductionID = OM.OutsourceID AND ICM.JobBookingJobCardContentsID = OM.JobBookingJobCardContentsID AND ICM.CompanyID = OM.CompanyID INNER JOIN JobScheduleRelease AS JSR ON ICM.JobBookingID = JSR.JobBookingID AND ICM.JobBookingJobCardContentsID = JSR.JobBookingJobCardContentsID AND ICM.CompanyID = JSR.CompanyID " &
                    " Where Isnull(OM.IsDeletedTransaction,0)=0 And OM.OutsourceID In(" & OutID & ") And OM.CompanyID=" & GBLCompanyID
            Else
                Str = "SELECT DISTINCT ICD.ChallanDetailID, ICD.OutsourceID, ICD.ItemID, JSR.JobCardContentNo, JSR.ContentName AS PlanContName, /*JSR.JobCardFormNo,*/ ICM.VoucherNo, ICM.JobBookingJobCardContentsID, ICD.ItemRate, IM.ItemGroupID, IM.LastPurchaseRate, ICD.ItemAmount, CASE WHEN Isnull(ICD.StockUnit, '') = '' THEN IM.StockUnit ELSE ICD.StockUnit END AS StockUnit,IM.ItemCode, IM.ItemName, IM.ProductHSNID, IGM.HSNCode, IGM.ProductHSNName,Case When Upper(IM.PurchaseUnit)='KG' And IM.ItemGroupID=1 Then Round(ICD.ConsumeQuantity*IM.WtPerPacking,3) Else ICD.ConsumeQuantity End IssueWt,IM.PurchaseUnit, ICD.ConsumeQuantity As IssueQuantity,ICD.Remark, ICD.ItemDescription ,ICD.ProcessingQty,ICD.WIPUnit " &
                    " FROM OutsourceChallanMain AS ICM INNER JOIN OutsourceChallanDetails AS ICD ON ICM.OutsourceChallanID = ICD.OutsourceChallanID AND ICM.CompanyID = ICD.CompanyID INNER JOIN ItemMaster AS IM ON ICD.ItemID = IM.ItemID AND ICD.CompanyID = IM.CompanyID INNER JOIN ProductHSNMaster AS IGM ON IM.ProductHSNID = IGM.ProductHSNID AND IM.CompanyID = IGM.CompanyID INNER JOIN JobScheduleRelease AS JSR ON ICM.JobBookingJobCardContentsID = JSR.JobBookingJobCardContentsID AND ICM.CompanyID = JSR.CompanyID" &
                    " WHERE (ISNULL(ICM.IsDeletedTransaction, 0) = 0) AND (ICM.OutsourceChallanID = " & OutID & ") AND (ICM.CompanyID = " & GBLCompanyID & ")"
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductionOutsourceChallan(ByVal ObjData As Object, ByVal ObjDataDetails As Object, ByVal ChallanID As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If ChallanID > 0 Then
                If (db.CheckAuthories("ProductionOutsourceChallan.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False) Then Return "You are not authorized to edit..!, Can't Edit"
                Str = "Select Count(OutsourceID) As OutsourceID From OutsourceProductionMain Where ParentOutsourceID In (Select OutsourceID From OutsourceChallanDetails Where OutsourceChallanID=" & ChallanID & " And CompanyID=" & GBLCompanyID & ") And CompanyID=" & GBLCompanyID
                db.FillDataTable(dataTable, Str)
                If dataTable.Rows.Count > 0 Then If dataTable.Rows(0)(0) > 0 Then Return "Challan Further Processed..!, Can't Edit"
                dataTable = New DataTable()
            Else
                If (db.CheckAuthories("ProductionOutsourceChallan.aspx", GBLUserID, GBLCompanyID, "CanSave") = False) Then Return "You are not authorized to save..!, Can't Save"
            End If

            Dim Prefix As String = "POC"
            Dim MaxVoucherNo As Long = 0
            Dim TableName, AddCol, ColValue As String
            TableName = "OutsourceChallanMain"
            Dim NumberToWord As String = db.ReadNumber(ObjData(0)("TotalAmount"), "", "", "INR")

            Using UpTrans As New Transactions.TransactionScope
                If ChallanID <= 0 Then
                    Dim VoucherNo As String = db.GeneratePrefixedNo(TableName, Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where Prefix='" & Prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

                    AddCol = "Prefix,VoucherNo,MaxVoucherNo,CompanyID,UserID,FYear,CreatedDate,AmountInWords"
                    ColValue = "'" & Prefix & "','" & VoucherNo & "','" & MaxVoucherNo & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate(),'" & NumberToWord & "' "
                    ChallanID = db.InsertDatatableToDatabase(ObjData, TableName, AddCol, ColValue)
                    If IsNumeric(ChallanID) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & ChallanID
                    End If

                    TableName = "OutsourceChallanDetails"
                    AddCol = "OutsourceChallanID,CompanyID,UserID,FYear,CreatedDate"
                    ColValue = "'" & ChallanID & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate() "

                    Str = db.InsertDatatableToDatabase(ObjDataDetails, TableName, AddCol, ColValue)
                    If IsNumeric(Str) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & ChallanID
                    End If

                    For i = 0 To ObjDataDetails.length - 1
                        db.ExecuteNonSQLQuery("Update OutsourceProductionMain Set IsChallanSend=1 Where CompanyID=" & GBLCompanyID & " And OutsourceID=" & ObjDataDetails(i)("OutsourceID") & "")
                    Next
                Else
                    AddCol = "ModifiedBy=" & GBLUserID & ",ModifiedDate=Getdate(),AmountInWords='" & NumberToWord & "'"
                    Str = db.UpdateDatatableToDatabase(ObjData, TableName, AddCol, 1, "OutsourceChallanID=" & ChallanID & " And CompanyID=" & GBLCompanyID)
                    If Str <> "Success" Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If

                    TableName = "OutsourceChallanDetails"
                    Str = db.UpdateDatatableToDatabase(ObjDataDetails, TableName, "", 2, "OutsourceChallanID=" & ChallanID & " And CompanyID=" & GBLCompanyID)
                    If Str <> "Success" Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If
                End If

                UpTrans.Complete()

            End Using
            Return "Success:" & ChallanID
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProductionOutsourceChallan(ByVal OutID As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If (db.CheckAuthories("ProductionOutsourceChallan.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False) Then Return "You are not authorized to delete..!, Can't Delete"

            Str = "Select OutsourceID From OutsourceProductionMain Where OutsourceID=(Select OutsourceID From OutsourceChallanMain Where OutsourceChallanID=" & OutID & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0) And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0 And IsChallanSend=1 And VoucherID=-51"
            db.FillDataTable(dataTable, Str)
            If dataTable.Rows.Count > 0 Then
                Return "Can't Delete, Transaction is further processed.."
            End If

            Dim TableName As String

            TableName = "OutsourceChallanMain"
            Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and OutsourceChallanID='" & OutID & "'"
            db.ExecuteNonSQLQuery(Str)

            TableName = "OutsourceChallanDetails"
            Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and OutsourceChallanID='" & OutID & "'"
            db.ExecuteNonSQLQuery(Str)

            db.ExecuteNonSQLQuery("Update OutsourceProductionMain Set IsChallanSend=0 Where CompanyID=" & GBLCompanyID & " And OutsourceID IN (Select OutsourceID From OutsourceChallanMain Where CompanyID='" & GBLCompanyID & "' And OutsourceChallanID='" & OutID & "')")

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''//////////////////////////////////////////////////////////////Outsource Received Start//////////////////////////////////////
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetPendingProcessedReceivedData(ByVal flag As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            If flag = False Then
                Str = "SELECT DISTINCT  OPM.OutsourceID,OPM.ParentOutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPM.VoucherNo As SendVoucherNo, REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS SendVoucherDate, OPM.LedgerID, NULLIF (OPM.Remark, '') AS Remark,  LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,NULL As Transporter,NULL As VehicleNo,OPD.QuantitySent, Isnull(SUM(OPRD.QuantityReceive),0) As QuantityReceive,(OPD.QuantitySent)-Isnull(SUM(OPRD.QuantityReceive),0) As PendingToReceive,Nullif(OPM.Remark,'') As Remark ,NULL As EWayBillNumber ,NULL As EWayBillDate " &
                    " FROM OutsourceProductionMain AS OPM INNER JOIN OutsourceProductionDetails AS OPD On OPM.OutsourceID=OPD.OutsourceID And OPM.CompanyID=OPD.CompanyID INNER JOIN JobBookingJobCard AS JB ON JB.JobBookingID = OPM.JobBookingID AND JB.CompanyID = OPM.CompanyID INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID AND LM.CompanyID = OPM.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID AND OPM.CompanyID = UM.CompanyID" &
                    " LEFT JOIN OutsourceProductionMain As OPR On (OPR.CompanyID = OPM.CompanyID) AND (ISNULL(OPR.IsDeletedTransaction, 0) = 0) AND (OPM.OutsourceID= OPR.ParentOutsourceID) And OPR.VoucherID=-51 LEFT JOIN OutsourceProductionDetails As OPRD On (OPRD.CompanyID = OPR.CompanyID) AND (ISNULL(OPRD.IsDeletedTransaction, 0) = 0) AND (OPR.OutsourceID= OPRD.OutsourceID) And OPRD.ProcessID=OPD.ProcessID And OPRD.RateFactor=OPD.RateFactor And OPRD.JobCardFormNo=OPD.JobCardFormNo And OPRD.JobBookingJobCardContentsID=OPD.JobBookingJobCardContentsID" &
                    " Where OPM.VoucherID=-50 And Isnull(OPM.IsChallanSend,0)=1 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID=" & GBLCompanyID &
                    " Group By OPM.OutsourceID, OPM.ParentOutsourceID,OPD.QuantitySent, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, JB.JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPM.VoucherNo, OPM.VoucherDate, OPM.LedgerID, OPM.Remark, LM.LedgerName, UM.UserName,OPM.IsChallanSend, JBC.JobCardContentNo, JBC.PlanContName, OPM.CompanyID,OPRD.ProcessID,OPRD.RateFactor,OPRD.JobCardFormNo" &
                    " Having (Isnull(Sum(OPRD.QuantityReceive),0) < (OPD.QuantitySent))"
            Else
                Str = "SELECT DISTINCT OPM.OutsourceID,OPM.ParentOutsourceID, JBC.JobBookingID, JB.JobName, JB.JobBookingNo, REPLACE(CONVERT(nvarchar(30), JB.JobBookingDate, 106), ' ', '-') AS JobBookingDate, JB.OrderQuantity, OPM.JobBookingJobCardContentsID, OPS.VoucherNo As SendVoucherNo,  REPLACE(CONVERT(nvarchar(30), OPS.VoucherDate, 106), ' ', '-') AS SendVoucherDate,OPM.VoucherNo, REPLACE(CONVERT(nvarchar(30), OPM.VoucherDate, 106), ' ', '-') AS VoucherDate, OPM.LedgerID, NULLIF (OPM.Remark, '') AS Remark, LM.LedgerName, UM.UserName, JBC.JobCardContentNo, JBC.PlanContName,NULLIF(OPM.Transporter,'') As Transporter,NULLIF(OPM.VehicleNo,'') As VehicleNo,OPD.QuantityReceive,OPD.QuantitySent,REPLACE(CONVERT(nvarchar(30), OPM.DeliveryNoteDate, 106), ' ', '-') AS DeliveryNoteDate,Nullif(OPM.DeliveryNoteNo,'') As DeliveryNoteNo,Nullif(OPM.ReceivedBy,'') As ReceivedBy,OPM.EWayBillNumber,Case When Isnull(OPM.EWayBillDate,'')='' Then REPLACE(CONVERT(nvarchar(30), Getdate(), 106), ' ', '-') Else REPLACE(CONVERT(nvarchar(30),OPM.EWayBillDate , 106), ' ', '-') End AS EWayBillDate " &
                    " FROM OutsourceProductionMain AS OPM INNER JOIN OutsourceProductionDetails AS OPD On OPM.OutsourceID=OPD.OutsourceID And OPM.CompanyID=OPD.CompanyID INNER JOIN JobBookingJobCard AS JB  ON JB.JobBookingID = OPM.JobBookingID AND JB.CompanyID = OPM.CompanyID  INNER JOIN LedgerMaster AS LM ON LM.LedgerID = OPM.LedgerID AND LM.CompanyID = OPM.CompanyID INNER JOIN UserMaster AS UM ON OPM.UserID = UM.UserID And OPM.CompanyID=UM.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON OPM.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID AND OPM.CompanyID = JBC.CompanyID " &
                    " LEFT JOIN OutsourceProductionMain As OPS On (OPS.CompanyID = OPM.CompanyID) AND (ISNULL(OPS.IsDeletedTransaction, 0) = 0) AND (OPS.OutsourceID= OPM.ParentOutsourceID) And OPS.VoucherID=-50 LEFT JOIN OutsourceProductionDetails As OPSD On (OPSD.CompanyID = OPS.CompanyID) AND (ISNULL(OPSD.IsDeletedTransaction, 0) = 0) AND (OPS.OutsourceID= OPSD.OutsourceID) " &
                    " Where OPM.VoucherID=-51 And Isnull(OPM.IsChallanSend,0)=0 And Isnull(OPM.IsDeletedTransaction,0)=0 And OPM.CompanyID=" & GBLCompanyID & " Order By OPM.OutsourceID Desc"
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOutsourceContentWiseDetails(ByVal OutID As Integer, ByVal Flag As String) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            Dim DTProcess, DTMaterial As New DataTable
            'Dim keyField As String = ""
            'If Flag = False Then keyField = "Outsource Send" Else keyField = "Outsource Received"
            If Flag = False Then
                Str = "SELECT DISTINCT ICD.JobBookingJobCardContentsID, ICD.ProcessID,ICD.MachineID, ICD.ItemID, JSR.JobCardContentNo, JSR.ContentName AS PlanContName, OM.VoucherNo, IM.ItemGroupID, IM.LastPurchaseRate,CASE WHEN Isnull(ICD.StockUnit, '') = '' THEN IM.StockUnit ELSE ICD.StockUnit END AS StockUnit, IM.ItemCode, IM.ItemName, IM.ProductHSNID, IGM.HSNCode, IGM.ProductHSNName,ICD.IssueQuantity,ICD.ReceivedQuantity,ICD.IssueQuantity As ConsumeQuantity,ICD.FloorWarehouseID,ICD.BatchNo,ICD.DepartmentID,ICD.IssueTransactionID,ICD.ParentTransactionID,ICD.Remark As ItemDescription ,ICD.ProcessingQty,ICD.WIPUnit " &
                        " FROM OutsourceProductionMain AS OM  Inner Join ItemConsumptionMain As ICM On ICM.OutsourceProductionID=OM.OutsourceID And OM.CompanyID=ICM.CompanyID Inner Join ItemConsumptionDetail As ICD On ICD.ConsumptionTransactionID=ICM.ConsumptionTransactionID And ICD.CompanyID=OM.CompanyID INNER JOIN ItemMaster AS IM ON ICD.ItemID = IM.ItemID AND ICD.CompanyID = IM.CompanyID INNER JOIN ProductHSNMaster AS IGM ON IM.ProductHSNID = IGM.ProductHSNID AND IM.CompanyID = IGM.CompanyID INNER JOIN JobScheduleRelease AS JSR ON OM.JobBookingJobCardContentsID = JSR.JobBookingJobCardContentsID AND OM.CompanyID = JSR.CompanyID" &
                        " WHERE (ISNULL(OM.IsDeletedTransaction, 0) = 0) AND (OM.OutsourceID = " & OutID & ") AND (OM.CompanyID = " & GBLCompanyID & ")"
            Else
                Str = "SELECT DISTINCT ICD.JobBookingJobCardContentsID, ICD.ProcessID, ICD.MachineID, ICD.ItemID, JSR.JobCardContentNo, JSR.ContentName AS PlanContName, OM.VoucherNo, IM.ItemGroupID, IM.LastPurchaseRate, CASE WHEN Isnull(ICD.StockUnit, '') = '' THEN IM.StockUnit ELSE ICD.StockUnit END AS StockUnit, IM.ItemCode, IM.ItemName, IM.ProductHSNID, IGM.HSNCode, IGM.ProductHSNName, Isnull(OPD.IssueQuantity,0) As IssueQuantity, Isnull(ICD1.ReceivedQuantity,0) As ReceivedQuantity, Isnull(ICD.ConsumeQuantity,0) As ConsumeQuantity, ICD.FloorWarehouseID, ICD.BatchNo, ICD.DepartmentID, ICD.IssueTransactionID,ICD.ParentTransactionID ,ICD.Remark As ItemDescription ,ICD.ProcessingQty,ICD.WIPUnit " &
                    " FROM OutsourceProductionMain AS OM INNER JOIN " &
                    " ItemConsumptionMain AS ICM ON ICM.OutsourceProductionID = OM.OutsourceID AND OM.CompanyID = ICM.CompanyID And ICM.VoucherID=-52 INNER JOIN " &
                    " ItemConsumptionDetail AS ICD ON ICD.ConsumptionTransactionID = ICM.ConsumptionTransactionID AND ICD.CompanyID = OM.CompanyID INNER JOIN " &
                    " ItemMaster AS IM ON ICD.ItemID = IM.ItemID AND ICD.CompanyID = IM.CompanyID INNER JOIN " &
                    " ProductHSNMaster AS IGM ON IM.ProductHSNID = IGM.ProductHSNID AND IM.CompanyID = IGM.CompanyID INNER JOIN " &
                    " JobScheduleRelease AS JSR ON OM.JobBookingJobCardContentsID = JSR.JobBookingJobCardContentsID AND OM.CompanyID = JSR.CompanyID Left JOIN " &
                    " ItemConsumptionMain AS ICM1 ON ICM1.OutsourceProductionID = OM.OutsourceID AND OM.CompanyID = ICM1.CompanyID And ICM1.VoucherID=-51 Left JOIN " &
                    " ItemConsumptionDetail AS ICD1 ON ICD1.ConsumptionTransactionID = ICM1.ConsumptionTransactionID AND ICD1.CompanyID = ICM1.CompanyID And ICD1.ItemID=ICD.ItemID And ICD1.BatchNo=ICD.BatchNo " &
                    " Inner Join ItemConsumptionMain As OPM On OPM.OutsourceProductionID=OM.ParentOutsourceID And OPM.CompanyID=OM.CompanyID Inner Join ItemConsumptionDetail As OPD on OPM.ConsumptionTransactionID=OPD.ConsumptionTransactionID And OPD.ItemID=ICD.ItemID And OPD.BatchNo=ICD.BatchNo And OPM.IsDeletedTransaction=0 " &
                    " WHERE (ISNULL(OM.IsDeletedTransaction, 0) = 0) AND (OM.OutsourceID = " & OutID & ") AND (OM.CompanyID = " & GBLCompanyID & ")"
                'Group By ICD.JobBookingJobCardContentsID, ICD.ProcessID, ICD.MachineID, ICD.ItemID, JSR.JobCardContentNo, JSR.ContentName , JSR.JobCardFormNo,OM.VoucherNo, IM.ItemGroupID,IM.LastPurchaseRate, ICD.StockUnit,IM.StockUnit , IM.ItemCode, IM.ItemName, IM.ProductHSNID, IGM.HSNCode, IGM.ProductHSNName,ICD.FloorWarehouseID, ICD.BatchNo, ICD.DepartmentID, ICD.IssueTransactionID,ICD.ParentTransactionID
            End If

            db.FillDataTable(DTMaterial, Str)

            Str = "SELECT PE.ProductionID, OPD.OutsourceID, OPD.SequenceNo, PM.ProcessName, OPM.VoucherNo, OPD.JobBookingID, OPD.JobBookingJobCardContentsID, OPD.JobCardContentNo, OPD.JobCardFormNo, OPD.PlanContName, OPD.ProcessID, nullif(OPD.RateFactor,'') As RateFactor, OPD.QuantitySent, OPD.QuantityReceive, OPD.ReceiveDate, OPD.ReceiveChallanNo, OPD.ReadyQuantity,PE.WastageQuantity,PE.SuspenseQuantity,Case When Isnull(PE.SuspenseQuantity,0)=0 Then OPD.QuantitySent Else PE.SuspenseQuantity End As RemainingQuantity,PE.MachineID,PE.EmployeeID As OperatorID," & IIf(Flag = False, "nullif(OPD.Remark,'')", "nullif(PE.Remark,'')") & " As Remark, OPD.OutsourceFormID,CASE WHEN Upper(PM.UnitConversion) = 'CUTS UNIT' THEN (JBC.CutLH * JBC.CutHL) + (JBC.CutL * JBC.CutW) WHEN Upper(PM.UnitConversion) = 'UPS UNIT' THEN (JBC.TotalUps) ELSE 1 END AS ConvertValue" &
                  " FROM OutsourceProductionDetails AS OPD INNER JOIN ProcessMaster AS PM ON OPD.ProcessID = PM.ProcessID AND OPD.CompanyID = PM.CompanyID And OPD.IsDeletedTransaction=0 INNER JOIN OutsourceProductionMain AS OPM ON OPD.OutsourceID = OPM.OutsourceID AND OPD.CompanyID = OPM.CompanyID And OPM.IsDeletedTransaction=0 Inner Join ProductionUpdateEntry AS PUE ON PUE.OutsourceProductionID = OPD.OutsourceID AND ISNULL(PUE.RateFactor, N'') = ISNULL(OPD.RateFactor, N'') AND PUE.ProcessID = OPD.ProcessID AND PUE.CompanyID = OPD.CompanyID And PUE.JobCardFormNo=OPD.JobCardFormNo INNER JOIN ProductionEntry AS PE On PE.ProductionID=PUE.ProductionID And PE.CompanyID=PUE.CompanyID INNER JOIN JobBookingJobCardContents AS JBC ON JBC.JobBookingJobCardContentsID = PE.JobBookingJobCardContentsID AND PE.CompanyID = JBC.CompanyID" &
                  " WHERE (ISNULL(OPM.IsDeletedTransaction, 0) = 0) AND (OPM.OutsourceID = " & OutID & ") AND (OPM.CompanyID = " & GBLCompanyID & ")"
            db.FillDataTable(DTProcess, Str)
            DTMaterial.TableName = "TblMaterial"
            DTProcess.TableName = "TblProcess"

            Dim DataSet As New DataSet
            DataSet.Merge(DTProcess)
            DataSet.Merge(DTMaterial)

            data.Message = db.ConvertDataSetsTojSonString(DataSet)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductionOutsourceReceipt(ByVal ObjData As Object, ByVal ObjConsumedMain As Object, ByVal ObjConsumedDetails As Object, ByVal ObjReturnDetails As Object, ByVal ObjProcess As Object, ByVal objMachineEntry As Object, ByVal objMachineUpdtEntry As Object, ByVal objFormsEntry As Object) As String
        Try
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If (db.CheckAuthories("ProductionOutsourceReceived.aspx", GBLUserID, GBLCompanyID, "CanSave") = False) Then Return "You are not authorized to save..!, Can't Save"

            Dim Prefix As String = "OR"
            Dim MaxVoucherNo As Long = 0
            Dim TableName, AddCol, ColValue As String
            Dim OutsourceID As String

            TableName = "OutsourceProductionMain"
            Dim VoucherNo As String = db.GeneratePrefixedNo(TableName, Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherID=-51 And Prefix='" & Prefix & "' And IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

            AddCol = "Prefix,VoucherID,VoucherNo,MaxVoucherNo,CompanyID,UserID,FYear,VoucherDate"
            ColValue = "'" & Prefix & "',-51,'" & VoucherNo & "','" & MaxVoucherNo & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate() "
            Using UpTrans As New Transactions.TransactionScope

                OutsourceID = db.InsertDatatableToDatabase(ObjData, TableName, AddCol, ColValue)
                If IsNumeric(OutsourceID) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & OutsourceID
                End If

                TableName = "OutsourceProductionDetails"
                AddCol = "OutsourceID,CompanyID,UserID,FYear,SentDate"
                ColValue = "'" & OutsourceID & "','" & GBLCompanyID & "'," & GBLUserID & ",'" & GBLFYear & "',Getdate() "

                Str = db.InsertDatatableToDatabase(ObjProcess, TableName, AddCol, ColValue)
                If IsNumeric(Str) = False Then
                    UpTrans.Dispose()
                    Return "Error: " & Str
                End If

                '///////////////////// Consume Qty
                Dim VoucherID = -52
                If ObjConsumedDetails.length > 0 Then
                    Prefix = "OPC"
                    VoucherNo = db.GeneratePrefixedNo("ItemConsumptionMain", Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & Prefix & "' And VoucherID=" & VoucherID & " And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

                    TableName = "ItemConsumptionMain"
                    AddCol = "OutsourceProductionID,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,VoucherID"
                    ColValue = "" & OutsourceID & ",Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'," & VoucherID & ""
                    Str = db.InsertDatatableToDatabase(ObjConsumedMain, TableName, AddCol, ColValue)
                    If IsNumeric(Str) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If

                    TableName = "ItemConsumptionDetail"
                    AddCol = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
                    ColValue = "Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Str & "'"

                    Str = db.InsertDatatableToDatabase(ObjConsumedDetails, TableName, AddCol, ColValue)
                    If IsNumeric(Str) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If
                End If
                ' ////////////////////////////////////// Received(balance return) Entry
                If ObjReturnDetails.length > 0 Then
                    VoucherID = -51
                    Prefix = "OPR"
                    VoucherNo = db.GeneratePrefixedNo("ItemConsumptionMain", Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & Prefix & "' And VoucherID=" & VoucherID & " And CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' ")

                    TableName = "ItemConsumptionMain"
                    AddCol = "OutsourceProductionID,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherPrefix,MaxVoucherNo,VoucherNo,VoucherID"
                    ColValue = "" & OutsourceID & ",Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Prefix & "','" & MaxVoucherNo & "','" & VoucherNo & "'," & VoucherID & ""
                    Str = db.InsertDatatableToDatabase(ObjConsumedMain, TableName, AddCol, ColValue)
                    If IsNumeric(Str) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If

                    TableName = "ItemConsumptionDetail"
                    AddCol = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,ConsumptionTransactionID"
                    ColValue = "Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & Str & "'"

                    Str = db.InsertDatatableToDatabase(ObjReturnDetails, TableName, AddCol, ColValue)
                    If IsNumeric(Str) = False Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If
                End If

                For index = 0 To ObjProcess.length - 1
                    Dim objMachineE, objMachineUpdtE, objFormsE As New Collection()

                    objMachineE.Add(objMachineEntry(index))
                    objFormsE.Add(objFormsEntry(index))
                    objMachineUpdtE.Add(objMachineUpdtEntry(index))

                    Str = UpdateProductionData(objMachineE, objMachineUpdtE, objFormsE, OutsourceID, objMachineEntry(index)("ProductionID"), objMachineEntry(index)("JobBookingID"), objMachineEntry(index)("ProcessID"), objMachineEntry(index)("JobBookingJobCardContentsID"))
                    If Str <> "Success" Then
                        UpTrans.Dispose()
                        Return "Error: " & Str
                    End If

                    db.ExecuteNonSQLQuery("Update JobScheduleRelease Set Status='Outsource Receive' Where ProcessID=" & ObjProcess(index)("ProcessID") & " And RateFactor='" & ObjProcess(index)("RateFactor") & "' And JobCardFormNo='" & ObjProcess(index)("JobCardFormNo") & "' And JobBookingID=" & ObjProcess(index)("JobBookingID") & " And JobBookingJobCardContentsID=" & ObjProcess(index)("JobBookingJobCardContentsID") & " And MachineID=" & objMachineEntry(index)("MachineID"))
                    db.ExecuteNonSQLQuery("Update JobBookingJobCardProcess Set Status='Outsource Receive' Where ProcessID=" & ObjProcess(index)("ProcessID") & " And RateFactor='" & ObjProcess(index)("RateFactor") & "' And JobBookingID=" & ObjProcess(index)("JobBookingID") & " And JobBookingJobCardContentsID=" & ObjProcess(index)("JobBookingJobCardContentsID"))
                Next

                UpTrans.Complete()

            End Using
            Return "Success"
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
    End Function

    Private Function UpdateProductionData(ByVal objEntry As Object, ByVal objEntryUpdate As Object, ByVal objFormsEntry As Object, ByVal OutsourceID As String, ByVal ProductionID As String, ByVal JobBookingID As String, ByVal JobContentsID As String, ByVal ProcessID As String) As String

        Dim KeyFieldStatus As String

        Dim AddColName, AddColValue, wherecndtn, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            Dim Shift As String = db.GetColumnValue("ShiftNo", "ShiftManagement", " CompanyID='" & GBLCompanyID & "' And Convert(varchar, getdate(), 8) Between  Convert(varchar, StartTime , 8) And Convert(varchar, EndTime, 8)")
            If Shift = "" Then Shift = 1

            TableName = "ProductionEntry"
            AddColName = "TimeConsumption=DATEDIFF(HOUR,FromTime,Getdate()),TotalMinute=DATEDIFF(MINUTE,FromTime,Getdate()),ToTime='" & DateTime.Now & "',ModifiedDate=Getdate(),ModifiedBy=" & GBLUserID & ",SequenceNo=(Select Max(SequenceNo)+1 From ProductionEntry Where JobBookingID=" & JobBookingID & " And ProcessID=" & ProcessID & " And JobBookingJobCardContentsID=" & JobContentsID & ")"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And ProductionID='" & ProductionID & "' And FYear='" & GBLFYear & "'"
            KeyFieldStatus = db.UpdateDatatableToDatabase(objEntry, TableName, AddColName, 1, wherecndtn)
            If KeyFieldStatus <> "Success" Then
                Return KeyFieldStatus
            End If

            TableName = "ProductionUpdateEntry"
            AddColName = "Shift,ModifiedDate,ToTime,UserID,CompanyID,FYear,ProductionID,OutsourceProductionID"
            AddColValue = "'" & Shift & "','" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & ProductionID & "'," & OutsourceID
            KeyFieldStatus = db.InsertDatatableToDatabase(objEntryUpdate, TableName, AddColName, AddColValue)
            If IsNumeric(KeyFieldStatus) = False Then
                Return KeyFieldStatus
            End If

            TableName = "ProductionEntryFormWise"
            AddColName = "ModifiedDate='" & DateTime.Now & "',ToTime='" & DateTime.Now & "',UserID='" & GBLUserID & "'"
            KeyFieldStatus = db.UpdateDatatableToDatabase(objFormsEntry, TableName, AddColName, 1, " ProductionID=" & ProductionID & " And FYear='" & GBLFYear & "' And CompanyID=" & GBLCompanyID)
            If KeyFieldStatus <> "Success" Then
                Return KeyFieldStatus
            End If

            KeyFieldStatus = "Success"
        Catch ex As Exception
            KeyFieldStatus = ex.Message
        End Try
        Return KeyFieldStatus
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProductionOutsourceReceipt(ByVal OutID As Integer) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            If (db.CheckAuthories("ProductionOutsourceReceived.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False) Then Return "You are not authorized to delete..!, Can't Delete"

            Str = "Select Distinct ProductionID From ProductionUpdateEntry Where ProductionOutsourceID=" & OutID & " And CompanyID=" & GBLCompanyID & " And Isnull(IsDeletedTransaction,0)=0"
            db.FillDataTable(dataTable, Str)
            If dataTable.Rows.Count > 0 Then
                Return "Transaction is further processed.., Can't Delete"
            End If

            Str = DeleteOutsourceData(OutID, "Outsource Send")
            Return Str

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Private Function DeleteOutsourceData(ByVal OutID As Integer, ByVal Status As String) As String
        Try

            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
            GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Dim TableName As String

            TableName = "OutsourceProductionMain"
            Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and OutsourceID='" & OutID & "'"
            db.ExecuteNonSQLQuery(Str)

            TableName = "OutsourceProductionDetails"
            Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and OutsourceID='" & OutID & "'"
            db.ExecuteNonSQLQuery(Str)

            TableName = "ItemConsumptionMain"
            Str = "Select Distinct ConsumptionTransactionID From ItemConsumptionMain Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And OutsourceProductionID=" & OutID & ""
            db.FillDataTable(dataTable, Str)

            Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and OutsourceProductionID='" & OutID & "'"
            db.ExecuteNonSQLQuery(Str)

            TableName = "ItemConsumptionDetail"
            For index = 0 To dataTable.Rows.Count - 1
                Str = "Update " & TableName & " Set IsDeletedTransaction=1,DeletedBy='" & GBLUserID & "',DeletedDate=Getdate() WHERE CompanyID='" & GBLCompanyID & "' and ConsumptionTransactionID='" & dataTable.Rows(index)("ConsumptionTransactionID") & "'"
                db.ExecuteNonSQLQuery(Str)
            Next

            dataTable = New DataTable()
            Str = "Select ProcessID,ProductionUpdateID,ProductionID,JobCardFormNo,JobBookingID,JobBookingJobCardContentsID,RateFactor From ProductionUpdateEntry Where CompanyID=" & GBLCompanyID & " And OutsourceProductionID=" & OutID & ""
            db.FillDataTable(dataTable, Str)

            For i = 0 To dataTable.Rows.Count - 1
                If Status = "In Queue" Then
                    Str = "Delete From ProductionEntry WHERE CompanyID='" & GBLCompanyID & "' And ProductionID='" & dataTable.Rows(i)("ProductionID") & "'"
                Else
                    Str = "Update ProductionEntry Set Status='Outsource Send',ToTime=NULL,ConsumedQuantity=0,ProductionQuantity=0,ReadyQuantity=0,WastageQuantity=0,SuspenseQuantity=0 WHERE CompanyID='" & GBLCompanyID & "' and ProductionID='" & dataTable.Rows(i)("ProductionID") & "'"
                End If
                db.ExecuteNonSQLQuery(Str)

                Str = "Delete From ProductionUpdateEntry WHERE CompanyID='" & GBLCompanyID & "' and ProductionUpdateID='" & dataTable.Rows(i)("ProductionUpdateID") & "'"
                db.ExecuteNonSQLQuery(Str)

                If Status = "In Queue" Then
                    Str = "Delete From ProductionEntryFormWise WHERE CompanyID='" & GBLCompanyID & "' and ProductionID='" & dataTable.Rows(i)("ProductionID") & "'"
                Else
                    Str = "Update ProductionEntryFormWise Set Status='Outsource Send',ToTime=NULL,ConsumedQuantity=0,ProductionQuantity=0,ReadyQuantity=0,WastageQuantity=0,SuspenseQuantity=0 WHERE CompanyID='" & GBLCompanyID & "' and ProductionID='" & dataTable.Rows(i)("ProductionID") & "'"
                End If
                db.ExecuteNonSQLQuery(Str)

                db.ExecuteNonSQLQuery("Update JobScheduleRelease Set Status='" & Status & "' Where ProcessID=" & dataTable.Rows(i)("ProcessID") & " And RateFactor='" & dataTable(i)("RateFactor") & "' And JobCardFormNo='" & dataTable.Rows(i)("JobCardFormNo") & "' And JobBookingID=" & dataTable.Rows(i)("JobBookingID") & " And JobBookingJobCardContentsID=" & dataTable.Rows(i)("JobBookingJobCardContentsID"))
                db.ExecuteNonSQLQuery("Update JobBookingJobCardProcess Set Status='" & Status & "' Where ProcessID=" & dataTable.Rows(i)("ProcessID") & " And RateFactor='" & dataTable(i)("RateFactor") & "' And JobBookingID=" & dataTable.Rows(i)("JobBookingID") & " And JobBookingJobCardContentsID=" & dataTable.Rows(i)("JobBookingJobCardContentsID"))
            Next

            Return "Success"
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
End Class