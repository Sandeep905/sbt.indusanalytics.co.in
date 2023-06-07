Imports System.Data
Imports System.IO
Imports System.Web
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports Connection

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebServiceProductionWorkOrder
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim FYear As String
    Dim CompanyId As Integer
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str, UserId As String

    '' //////////////************************************   Grid Production Work Order Pending Process Data    **************************************/////////////////
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridPendingProcessData(ByVal check As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            FYear = Convert.ToString(HttpContext.Current.Session("ReportFYear"))
            If check = "Processed" Then
                'str = "SELECT Distinct JEJ.JobBookingDate ,JEJ.CategoryID,Replace(Nullif(JEJ.Remark,''),'""','') As Remark, Replace(Nullif(LM.LedgerName,''),'"" ','') as LedgerName ,Nullif(JEJ.PONo,'') as PONo,Replace(Convert(Nvarchar(13),JEJ.PODate,106),' ','-') As PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,JOB.SalesOrderNo,Replace(Nullif(JEJ.JobName,''),'""','') as JobName,JEJ.OrderQuantity As OrderQty,Replace(Nullif(JEJ.ProductCode,''),'""','') as ProductCode,JEJ.JobBookingNo,  JE.BookingNo,Replace(Convert(Nvarchar(13),JEJ.JobBookingDate,106),' ','-') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(PM.ProductMasterCode,''),'""','') as ProductMasterCode,JEJ.FYear,JEJ.LedgerID,JEJ.ProductHSNID,Nullif(LM.Email,'') As Email,JEJ.OrderQuantity as Quantity,JEJ.BookingID,Replace(Convert(Nvarchar(13),JEJ.DeliveryDate,106),' ','-') as DeliveryDate,JE.ExpectedCompletionDays,JOB.OrderBookingID,JEJ.ProductMasterID,JEJ.JobBookingID,JEJ.ConsigneeID,JEJ.CriticalInstructions  " &
                '      " FROM LedgerMaster As LM INNER JOIN JobBookingJobCard  As JEJ ON JEJ.LedgerId =LM.LedgerId And JEJ.CompanyID = " & CompanyId & " And JEJ.FYear='" & FYear & "' And JEJ.IsDeletedTransaction=0  INNER JOIN JobOrderBookingDetails As JOB ON JEJ.LedgerId =JOB.LedgerId And JEJ.OrderBookingID=JOB.OrderBookingID And JEJ.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster as CM ON  CM.CategoryId = JEJ.CategoryID  AND CM.CompanyID = JEJ.CompanyID INNER JOIN UserMaster AS UM ON UM.UserId = JEJ.CreatedBy LEFT JOIN JobBooking As JE  ON JE.BookingID = JEJ.BookingID LEFT JOIN ProductMaster AS PM On PM.ProductMasterID =JEJ.ProductMasterID Order by JobBookingDate DESC "
                str = " Select Distinct JBJC.BookingID, JBJC.ProductEstimateID,JOB.SalesOrderNo, Replace(Convert(Nvarchar(13),JBJC.PODate,106),' ','-') as PODate ,JBJC.PONo,PQ.ProjectName,JBJC.JobPriority,JBJC.CreatedBy,UM.UserName as BookedBy,LM.LedgerName from JobBookingJobCard as JBJC  inner join LedgerMaster as LM on LM.LedgerID = JBJC.LedgerID and LM.CompanyID = JBJC.CompanyID inner join UserMaster as UM on UM.UserID = JBJC.CreatedBy and UM.CompanyID = JBJC.CompanyID  inner join JobOrderBooking  as JOB on JOB.OrderBookingID = JBJC.OrderBookingID and JOB.CompanyID = JBJC.CompanyID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JBJC.ProductEstimateID and PQ.CompanyID = JBJC.CompanyID where JBJC.CompanyId =" & CompanyId & " and JBJC.IsDeletedTransaction =0"
            Else
                'str = "SELECT Distinct JOB.OrderBookingID, JOBD.JobCoordinatorId As Coor dinatorLedgerID,JOBD.JobPriority,JOBD.CategoryID,Replace(Nullif(JOBD.Remark,''),'""','') As Remark,JOBD.JobReference,JOBD.JobType, Replace(Nullif(LM.LedgerName,''),'""','') as LedgerName,JOBD.OrderQuantity as Quantity,Nullif(JOBD.PONo,'') as PONo,Replace(Convert(Nvarchar(13),JOBD.PODate,106),' ','-') as PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,Replace(Nullif(JOBD.JobName,''),'""','') as JobName,JOBD.OrderQuantity As OrderQty,Replace(Nullif(JOBD.ProductCode,''),'""','') as ProductCode,JE.BookingNo,JOB.SalesOrderNo,Replace(Convert(Nvarchar(13),JOBD.OrderBookingDate,106),' ','-') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(PM.ProductMasterCode,''),'""','') as ProductMasterCode,Replace(Nullif(JOBD.ApprovalNo,''),'""','') as ApprovalNo,JOBD.FYear,JOBD.LedgerID,JOBD.ProductHSNID,Nullif(LM.Email,'') as Email,JOBD.BookingID, Replace(Convert(Nvarchar(13),JOBD.DeliveryDate,106),' ','-') as DeliveryDate,Replace(Nullif(JOBD.JobReferenceName ,''),'""','') as JobReferenceName,JE.ExpectedCompletionDays,JOB.OrderBookingID,JOBD.OrderBookingDetailsID,PM.ProductMasterID,(Select Top 1 Isnull(ConsigneeID,0) From JobOrderBookingDeliveryDetails Where OrderBookingID=JOBD.OrderBookingID AND BookingID=JOBD.BookingID AND CompanyID=JOBD.CompanyID)  AS ConsigneeID  " &
                '     " FROM LedgerMaster As LM INNER JOIN JobOrderBooking As JOB On JOB.LedgerID=LM.LedgerID And LM.CompanyID=JOB.CompanyID Inner Join JobOrderBookingDetails As JOBD ON JOBD.OrderBookingID = JOB.OrderBookingID And JOBD.LedgerId = LM.LedgerId And JOB.CompanyID = " & CompanyId & " And Isnull(JOB.IsDeletedTransaction,0)<>1 INNER JOIN CategoryMaster as CM ON CM.CategoryId = JOBD.CategoryID And CM.CompanyID=JOB.CompanyID And JOB.IsDeletedTransaction =CM.IsDeletedTransaction INNER JOIN UserMaster AS UM ON UM.UserId = JOBD.UserId And UM.CompanyID=JOB.CompanyID And ISNULL(JOBD.IsBooked,0) = 0 LEFT JOIN JobBooking As JE ON JE.BookingID = JOBD.BookingID And JE.CompanyID=JOB.CompanyID And JOB.IsDeletedTransaction=0 LEFT JOIN ProductMaster AS PM On PM.BookingID =JE.BookingID And JE.CompanyID=PM.CompanyID And PM.IsDeletedTransaction=0 Order by BookingDate Desc "
                str = "Select Distinct JOB.ProductEstimateID, JOB.OrderBookingID,LM.LedgerName,LM.Email,JOB.SalesOrderNo,Replace(Convert(Nvarchar(13),JOB.OrderBookingDate,106),' ','-') as BookingDate,PQ.ProjectName,UM.UserName as BookedBy from JobOrderBooking as JOB inner Join LedgerMaster as LM on LM.LedgerID =JOB.LedgerID and LM.CompanyID = JOB.CompanyID inner Join ProductQuotation as PQ on PQ.ProductEstimateID = JOB.ProductEstimateID and JOB.CompanyID = PQ.CompanyID inner join UserMaster as UM on UM.UserID = job.UserID and UM.CompanyID = JOB.CompanyID where JOB.CompanyID = " & CompanyId & " and Isnull(JOB.IsDeletedTransaction,0) = 0 order by BookingDate desc"
            End If
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
    Public Function GetPOData(ByVal POID As Int16) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            FYear = Convert.ToString(HttpContext.Current.Session("ReportFYear"))

            Dim Dt As New DataTable

            str = "Select distinct Isnull(SPM.Freight,0) as Freight, SPM.ProductCatelogID,  SPM.DelivaryAddress, SPM.LedgerID,SPM.OrderBookingID,SPM.EnquiryID,LM.LedgerName as ScheduleVendorName, SPD.ScheduleVendorId,SPM.Remark, SPM.ProductEstimateID,SPM.JobbookingNo,SPM.JobBookingID,SPM.SalesOrderNo,SPM.PONumber,SPM.NetAmount,SPM.IGSTAmount,EM.EnquiryNo,PQ.EstimateNo,Replace(Convert(Nvarchar(13),JOB.OrderBookingDate,106),' ','-') as BookingDate from ServicePomain as SPM inner Join ServicePODetails As SPD on SPM.POID = SPD.POID inner join ProductQuotation as PQ on PQ.ProductEstimateID = SPM.ProductEstimateID inner join EnquiryMain as EM on EM.EnquiryID = SPM.EnquiryId  inner join JobOrderBooking as JOB on JOB.OrderBookingID = SPM.OrderBookingID inner join LedgerMaster as LM on LM.LedgerID= SPD.ScheduleVendorId Where SPM.POID=" & POID & " And SPM.COmpanyID=" & CompanyId
            db.FillDataTable(dataTable, str)

            str = "Select distinct  SPD.OrderBookingDetailsID, SPD.POID,PLM.LedgerName as VendorName,LN.LedgerName as Jobcordinator, LM.LedgerName as ClientName,SPM.ProductCatelogID as ProductCatelogID,PQ.EstimateNo as QuotaionNo,PQC.GSTPercantage,SPM.ProductEstimateID,PQC.ProductEstimationContentID as JobContentsID,SPM.JobBookingID,JBS.ProductType,PLM.LedgerName as PlanedVendorName,LMAV.LedgerName ScheduleVendorName, JBS.OrderBookingScheduleID,JBS.OrderBookingID,JBS.ProductEstimateID,SPD.ProductName,JBS.OrderQuantity,JBS.JobType,JBS.JobReference,JBS.JobPriority, convert(CHAR(30),JBS.ExpectedDeliveryDate, 106) ExpectedDeliveryDate,SPD.ProductEstimationContentID,SPD.RateType,SPD.OrderQuantity,SPD.PlannedRate AS Rate,SPD.ScheduleRate,SPD.ScheduleVendorId,SPD.ScheduleQty,SPD.NetAmount,SPD.IGSTAmount as IGSTTaxAmount,SPD.SGSTAmount as SGSTTaxAmount, SPD.CGSTAmount as CGSTTaxAmount,SPD.TotalGSTAmount ToTalGSTAmount,SPD.TotalAmount,SPD.PlannedVendorID VendorID,JBS.SGSTTaxPercentage,JBS.CGSTTaxPercentage,JBS.IGSTTaxPercentage from ServicePODetails as SPD inner join ServicePOMain as SPM on SPM.POID = SPD.POID inner join JobOrderBooking as JOB on JOB.OrderBookingID = SPM.OrderBookingID inner join JobCardSchedule AS JBS ON JBS.JobCardID = SPM.JobBookingID and JBS.OrderBookingDetailsID = SPD.OrderBookingDetailsID inner join JobBookingJobCard AS JBJC ON JBJC.JobBookingID = SPM.JobBookingID inner join LedgerMaster as PLM on PLM.LedgerID = SPD.PlannedVendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = SPD.ScheduleVendorId left join  LedgerMaster as LN on LN.LedgerID = JBJC.CoordinatorLedgerID inner Join LedgerMaster as LM on LM.LedgerID = SPM.LedgerId inner join ProductQuotation as PQ on PQ.ProductEstimateID = SPM.ProductEstimateID inner join ProductQuotationContents as PQC on  SPD.ProductEstimationContentID = PQC.ProductEstimationContentID where SPD.POID =" & POID & " And isnull(SPD.IsDeletedTransaction,0) <> 1 and SPM.CompanyID =" & CompanyId
            db.FillDataTable(Dt, str)

            Dt.TableName = "PODetail"
            dataTable.TableName = "POMain"

            Dim dataset As New DataSet
            dataset.Merge(Dt)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridPendingContentsData(ByVal BookingID As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select distinct PQC.ProcessIDStr,PQC.ProductEstimateID, JOBD.SalesEmployeeID,JOBD.OrderBookingID,JOBD.OrderBookingDetailsID, JOBD.PONo,Replace(Convert(Nvarchar(30),JOBD.DeliveryDate,106),'','-') as DeliveryDate,Replace(Convert(Nvarchar(30),JOBD.PODate,106),'','-') as PODate, JOBD.JobReference, JOBD.JobType,JOBD.JobPriority,JOBD.CategoryID,JOBD.LedgerID, JOBD.ProductHSNID, JOBD.BookingID,JOBD.JobName as ProductName,CM.CategoryName,HM.HSNCode, JOBD.OrderQuantity,JOBD.Rate,JOBD.RateType,JOBD.GSTPercantage,Round(JOBD.GSTAmount,2) as GSTAmount,JOBd.MiscAmount,JOBD.MiscPercantage,JOBD.ShippingCost,JOBD.NetAmount as FinalAmount,LM.LedgerName as VendorName from JobOrderBookingDetails as JOBD inner join CategoryMaster as CM on CM.CategoryID = JOBD.CategoryID and CM.CompanyID = JOBD.CompanyID inner join  ProductHSNMaster  as HM on HM.ProductHSNID = JOBD.ProductHSNID and HM.CompanyID = JOBd.CompanyID inner join LedgerMaster as LM on LM.LedgerID = JOBD.VendorID and LM.CompanyID = JOBD.CompanyID inner join JobOrderBooking as JOB on JOb.CompanyID = JOBD.CompanyID and JOB.OrderBookingID = JOBD.OrderBookingID inner join ProductQuotationContents as PQC on PQC.CompanyID = JOBD.CompanyID and PQC.ProductEstimateID = JOB.ProductEstimateID and PQC.ProductEstimationContentID = JOBD.ProductEstimationContentID where JOBD.CompanyID =" & CompanyId & " and Isnull(JOBD.IsDeletedTransaction ,0) = 0 and JOBD.OrderBookingID = " & BookingID
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveJobSchedule(ByVal Order As Object) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim AddColName = "CompanyId"
        Dim AddColValue = "" & CompanyId & ""
        str = db.InsertDatatableToDatabase(Order, "JobcardSchedule", AddColName, AddColValue, "", "")
        If IsNumeric(str) = True Then
            Return "Success"
        Else
            Return "Fail"
        End If

    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobcardPendingData() As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Dt As New DataTable
        str = "SELECT JOB.OrderBookingID, JOB.BookingID, JOB.LedgerID, JOB.ProductMasterID, JOB.SalesEmployeeID, JOB.MaxSalesOrderNo, JOB.SalesOrderNo,Replace(Convert(Varchar(13),JOB.OrderBookingDate,106),' ','-') As OrderDate, LM.LedgerName AS ClientName, CM.CategoryName, JOB.ProductMasterCode, JOB.BookingNo, JOB.ProductCode, JOB.JobName, JOB.OrderQuantity,Replace(Convert(Varchar(13),JOB.DeliveryDate,106),' ','-') As DeliveryDate, JOB.PONo,Replace(Convert(Varchar(13),JOB.PODate,106),' ','-') As PODate, EM.LedgerName, JOB.ApprovalNo, UM.UserName AS BookedBy, JOB.IsBooked, JOB.FYear, LM.City, LM.State, ISNULL(JOB.OrderApproved, 0) AS OrderApproved, JOB.HoldRemark, LM.StateTinNo, ISNULL(JOB.IsJobWorkOrder, 0) AS JobWork,  ISNULL(JOB.IsDirectOrder, 0) AS DirectOrder FROM JobOrderBookingDetails AS JOB INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country],A.StateTinNo From  (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country],[StateTinNo] FROM  (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') As FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country],[StateTinNo])) p) AS A) AS LM ON JOB.LedgerID = LM.LedgerID AND JOB.CompanyID = LM.CompanyID And Isnull(JOB.IsDeletedTransaction,0)=0 INNER JOIN UserMaster AS UM ON UM.UserID = JOB.UserID AND UM.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster AS CM ON JOB.CategoryID = CM.CategoryID AND CM.CompanyID = JOB.CompanyID LEFT OUTER JOIN " &
                 "LedgerMaster AS EM ON EM.LedgerID = JOB.SalesEmployeeID AND EM.CompanyID = JOB.CompanyID WHERE (JOB.CompanyID = " & CompanyId & ") AND (ISNULL(JOB.IsProofingOrder, 0) = 0) AND (ISNULL(JOB.IsTempOrder, 0) = 0) GROUP BY JOB.OrderBookingID, JOB.BookingID, JOB.LedgerID, JOB.ProductMasterID, JOB.SalesEmployeeID, JOB.MaxSalesOrderNo, JOB.SalesOrderNo, JOB.OrderBookingDate, LM.LedgerName, CM.CategoryName, JOB.ProductMasterCode, JOB.BookingNo, JOB.ProductCode, JOB.JobName, JOB.OrderQuantity, JOB.DeliveryDate, JOB.PONo, JOB.PODate, EM.LedgerName, JOB.ApprovalNo, UM.UserName, JOB.IsBooked, JOB.FYear, LM.City, LM.State, JOB.OrderApproved, JOB.HoldRemark, LM.StateTinNo, JOB.IsJobWorkOrder, JOB.IsDirectOrder ORDER BY JOB.OrderBookingID DESC"
        db.FillDataTable(dataTable, str)

        'str = "Select distinct PQC.ProcessIDStr,JOBD.OrderBookingID,JOBD.OrderBookingDetailsID, JOBD.PONo,Replace(Convert(Nvarchar(30),JOBD.DeliveryDate,106),'','-') as DeliveryDate,Replace(Convert(Nvarchar(30),JOBD.PODate,106),'','-') as PODate, JOBD.JobReference, JOBD.JobType,JOBD.JobPriority,JOBD.CategoryID,JOBD.LedgerID, JOBD.ProductHSNID, JOBD.BookingID,JOBD.JobName as ProductName,CM.CategoryName,HM.HSNCode, JOBD.OrderQuantity,JOBD.Rate,JOBD.RateType,JOBD.GSTPercantage,Round(JOBD.GSTAmount,2) as GSTAmount,JOBd.MiscAmount,JOBD.MiscPercantage,JOBD.ShippingCost,JOBD.NetAmount as FinalAmount,LM.LedgerName as VendorName from JobOrderBookingDetails as JOBD inner join CategoryMaster as CM on CM.CategoryID = JOBD.CategoryID and CM.CompanyID = JOBD.CompanyID inner join  ProductHSNMaster  as HM on HM.ProductHSNID = JOBD.ProductHSNID and HM.CompanyID = JOBd.CompanyID inner join LedgerMaster as LM on LM.LedgerID = JOBD.VendorID and LM.CompanyID = JOBD.CompanyID inner join JobOrderBooking as JOB on JOb.CompanyID = JOBD.CompanyID and JOB.OrderBookingID = JOBD.OrderBookingID inner join ProductQuotationContents as PQC on PQC.CompanyID = JOBD.CompanyID and PQC.ProductEstimateID = JOB.ProductEstimateID where JOBD.CompanyID =" & CompanyId & " and Isnull(JOBD.IsDeletedTransaction ,0) = 0 "
        'db.FillDataTable(Dt, str)

        dataTable.TableName = "Projects"
        'Dt.TableName = "Contents"

        Dim dataset As New DataSet
        dataset.Merge(dataTable)
        dataset.Merge(Dt)
        data.Message = db.ConvertDataSetsTojSonString(dataset)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadProcess(ByVal pids As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select distinct ProcessName, ProcessID,Rate,TypeofCharges as RateFactor from ProcessMaster where CompanyId=" & CompanyId & " AND ProcessID  in (" & pids & ") "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridProcessedContentsData(ByVal BookingID As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "SELECT Distinct JEJ.JobBookingDate ,JEJ.CategoryID,Replace(Nullif(JEJ.Remark,''),'""','') As Remark, Replace(Nullif(LM.LedgerName,''),'"" ','') as LedgerName ,Nullif(JEJ.PONo,'') as PONo,Replace(Convert(Nvarchar(13),JEJ.PODate,106),' ','-') As PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,JOB.SalesOrderNo,Replace(Nullif(JEJ.JobName,''),'""','') as JobName,JEJ.OrderQuantity As OrderQty,Replace(Nullif(JEJ.ProductCode,''),'""','') as ProductCode,JEJ.JobBookingNo,  JE.BookingNo,Replace(Convert(Nvarchar(13),JEJ.JobBookingDate,106),' ','-') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(PM.ProductMasterCode,''),'""','') as ProductMasterCode,JEJ.FYear,JEJ.LedgerID,JEJ.ProductHSNID,Nullif(LM.Email,'') As Email,JEJ.OrderQuantity as Quantity,JEJ.BookingID,Replace(Convert(Nvarchar(13),JEJ.DeliveryDate,106),' ','-') as DeliveryDate,JE.ExpectedCompletionDays,JOB.OrderBookingID,JEJ.ProductMasterID,JEJ.JobBookingID,JEJ.ConsigneeID,JEJ.CriticalInstructions  " &
          " FROM LedgerMaster As LM INNER JOIN JobBookingJobCard  As JEJ ON JEJ.LedgerId =LM.LedgerId And JEJ.CompanyID = " & CompanyId & " And JEJ.BookingID='" & BookingID & "' And JEJ.IsDeletedTransaction=0  INNER JOIN JobOrderBookingDetails As JOB ON JEJ.LedgerId =JOB.LedgerId And JEJ.OrderBookingID=JOB.OrderBookingID And JEJ.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster as CM ON  CM.CategoryId = JEJ.CategoryID  AND CM.CompanyID = JEJ.CompanyID INNER JOIN UserMaster AS UM ON UM.UserId = JEJ.CreatedBy LEFT JOIN JobBooking As JE  ON JE.BookingID = JEJ.BookingID LEFT JOIN ProductMaster AS PM On PM.ProductMasterID =JEJ.ProductMasterID Order by JobBookingDate DESC "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckProductType(ByVal ContentName As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Isnull(IsOffsetProduct,0) IsOffsetProduct,Isnull(IsUnitProduct,0) IsUnitProduct From ProductCatalogMaster where ProductName = '" & ContentName & "' and IsDeletedTransaction = 0 and CompanyID = " & CompanyId
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function
    '---------------------------------  Open Department Master code---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDepartmentName() As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select Distinct DepartmentID,DepartmentName From DepartmentMaster Where CompanyID=" & CompanyId & " And IsDeletedTransaction=0 "
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '' //////////////************************************   Grid Product Catalog Pending Process Data    **************************************/////////////////
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadProductMasterData(ByVal Type As String) As String
        Try

            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Dim DtPM As New DataTable
            If Type = "Pending" Then
                str = "SELECT Distinct JB.LedgerID,JB.BookingID,CM.CategoryID,LM.LedgerName,CM.CategoryName,JB.JobName,JEC.PlanContQty As OrderQuantity,JB.BookingNo,Replace(Convert(Varchar(13),JB.CreatedDate,106),' ','-') As QuoteDate,JAE.ApprovalNo,Replace(Convert(Varchar(13),JAE.PriceApprovedDate,106),' ','-') As ApprovedDate,JAE.ApprovedBy,UM.UserName As QuotedBy,Replace(Convert(Varchar(13),JAE.AppliedDateValidUpto,106),' ','-') As AppliedDateValidUpto, Case When JAE.AppliedDateValidUpto<getDate() Then 1 Else 0 End As IsCostExpire,JB.ProductHSNID,PGM.ProductHSNName,JB.ProductCode,JOBD.JobType,(Select FieldValue From LedgerMasterDetails Where FieldName='Email' And LedgerID=LM.LedgerID And CompanyID=LM.CompanyID) As Email,JOBD.ConsigneeID,JOBD.JobReference,JOBD.JobPriority,JOBD.JobCoordinatorID,JAE.Remark FROM LedgerMaster As LM INNER JOIN JobBooking As JB ON JB.LedgerId =LM.LedgerId And JB.CompanyID=" & CompanyId & " And Isnull(JB.IsDeletedTransaction,0)=0 INNER JOIN CategoryMaster as CM ON CM.CategoryId = JB.CategoryID INNER JOIN JobBookingContents As JEC ON JB.BookingID = JEC.BookingID INNER JOIN JobApprovedCost As JAE ON JAE.BookingID = JEC.BookingID  And JEC.PlanContQty=JAE.Quantity  And  Isnull(JAE.IsProductMaster,0)=0 INNER JOIN UserMaster AS UM ON UM.UserID = JB.CreatedBy And ISNULL(JB.IsApproved,0) =1 Left Join JobOrderBookingDetails As JOBD On JOBD.BookingID=JB.BookingID And JOBD.CompanyID=JB.CompanyID LEFT OUTER JOIN ProductHSNMaster AS PGM ON PGM.ProductHSNID = JB.ProductHSNID AND PGM.CompanyID = JB.CompanyID Order by QuoteDate Desc"
            Else
                str = "SELECT Distinct PM.ProductMasterID,PM.ProductMasterCode,PM.ParentProductMasterCode,PM.LedgerID,LM.LedgerName ,PM.ApprovalNo,Replace(Convert(Varchar(13),JAC.PriceApprovedDate,106),' ','-') As ApprovedDate,PM.BookingID,PM.BookingNo,CM.CategoryID,CM.CategoryName,PM.JobName,PM.OrderQuantity,PM.ProductCode,Replace(Convert(Varchar(13),PM.QuoteDate,106),' ','-') As QuoteDate,UM.UserName,PM.IsHidden,PGM.ProductHSNName,PM.ProductHSNID,PM.JobType,PM.JobReference,PM.JobPriority,PM.CoordinatorLedgerID,PM.Remark, PM.MaxProductMasterCode,(Select FieldValue From LedgerMasterDetails Where FieldName='Email' And LedgerID=LM.LedgerID And CompanyID=LM.CompanyID) As Email,PM.ConsigneeID,PM.ProductHSNID,PM.FYear, (Select Max(JobBookingNo) From JobBookingJobCard Where ProductMasterID = PM.ProductMasterID And CompanyID=PM.CompanyID) As JobBookingNo,PM.FileNo FROM LedgerMaster As LM INNER JOIN ProductMaster As PM ON PM.LedgerID = LM.LedgerID And PM.CompanyID = LM.CompanyID INNER JOIN CategoryMaster As CM ON CM.CategoryID = PM.CategoryID And PM.CompanyID=CM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID = PM.CreatedBy And PM.CompanyID = UM.CompanyID And Isnull(PM.IsDeletedTransaction,0)=0 INNER JOIN JobApprovedCost As JAC ON JAC.BookingID = PM.BookingID And JAC.ApprovalNo=PM.ApprovalNo And PM.CompanyID = JAC.CompanyID LEFT JOIN ProductHSNMaster As PGM ON PGM.ProductHSNID=PM.ProductHSNID And PGM.CompanyID=PM.CompanyID Where PM.CompanyID=" & CompanyId & " Order By PM.ProductMasterCode Desc"
            End If

            db.FillDataTable(DtPM, str)

            DtPM.TableName = "PMData"

            Dim dataset As New DataSet
            dataset.Merge(DtPM)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Protected Function GridProductPendingProcessData(ByVal check As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            'If (check = "Process") Then
            '    str = "SELECT Distinct JEJ.LedgerID,JEJ.BookingID,CM.CategoryID,LM.LedgerName ,CM.CategoryName,JEJ.JobName,JEJ.OrderQuantity,JEJ.ProductCode,JEJ.JobDate As QuotDate,UM.UserName,JEJ.ProductMasterCode,JEJ.ArtworkCode,JEJ.IsHidden,PM.ProductHSNName,JEJ.MaxProductMasterCode,JEJ.ProductHSNID,JEJ.FYear,JEJ.ProductMasterCode, (Select Top(1) JobCardContentNo From JobBookingJobcardContents Where ProductMasterCode = JEJ.ProductMasterCode Order By JEJ.ModifiedDate DESC),JEJ.FileNo  FROM LedgerMaster As LM INNER JOIN ProductMaster As JEJ ON JEJ.LedgerId =LM.LedgerId And JEJ.CompaanyID=LM.CompanyID INNER JOIN CategoryMaster as CM ON CM.CategoryId = JEJ.CategoryID INNER JOIN UserMaster AS UM ON UM.UserId = JEJ.UserId And JEJ.CompanyID =" & CompanyId & " LEFT JOIN ProductHSNMaster As PM ON PM.ProductHSNID=JEJ.ProductHSNID Where JEJ.CompanyID=" & CompanyId & " Order By JEJ.ProductMasterCode Desc"
            'Else
            '    str = "SELECT Distinct JE.LedgerID,JE.BookingID,CM.CategoryID,LM.LedgerName,CM.CategoryName,JE.JobName,JEC.PlanContQty As Quantity,JE.BookingNo,JE.CreatedDate As QuotDate,UM.UserName FROM LedgerMaster As LM INNER JOIN JobBooking As JE ON JE.LedgerId =LM.LedgerId INNER JOIN CategoryMaster as CM ON CM.CategoryId = JE.CategoryID INNER JOIN UserMaster AS UM ON UM.UserId = JE.CreatedBy And ISNULL(JE.IsApproved,0) =1 INNER JOIN JobBookingContents As JEC ON JE.BookingID = JEC.BookingID INNER JOIN JobApprovedCost As JAE ON JAE.BookingID = JEC.BookingID And JEC.PlanContQty=JAE.Quantity And Isnull(JAE.IsProductMaster,0)in(0) Order by JE.CreatedDate Desc  "
            'End If
            If (check = "Processed") Then
                str = "SELECT Distinct JEJ.JobBookingDate ,JEJ.CoordinatorLedgerID,JEJ.JobPriority,JEJ.CategoryID,JEJ.Remark,JOB.JobReference, JOB.JobType, Replace(Nullif(LM.LedgerName,''),'"" ','') as LedgerName ,Nullif(JEJ.PONo,'') as PONo,Replace(Convert(Nvarchar(30),JEJ.PODate,106),'-','') As PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,JOB.SalesOrderNo,Replace(Nullif(JEJ.JobName,''),'""','') as JobName,JEJ.OrderQuantity As OrderQty,Replace(Nullif(JEJ.ProductCode,''),'""','') as ProductCode,JEJ.JobBookingNo,  JE.BookingNo,Replace(Convert(Nvarchar(30),JEJ.JobBookingDate,106),'-','') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(PM.ProductMasterCode,''),'""','') as ProductMasterCode,JEJ.FYear,JEJ.LedgerID,JE.ProductHSNID,Nullif(LM.Email,'') As Email,JEJ.OrderQuantity as Quantity,JEJ.BookingID,Replace(Convert(Nvarchar(30),JEJ.DeliveryDate,106),'-','') as DeliveryDate,JE.ExpectedCompletionDays,JOB.OrderBookingID,JOB.OrderBookingDetailsID,JEJ.ProductMasterID,JEJ.JobBookingID  " &
                        " FROM(Select A.[LedgerID], B.[LedgerGroupID], B.[LedgerGroupNameID], A.[CompanyID], A.[LedgerName], A.[MailingName], A.[City], A.[State], Isnull(S.[StateCode],'') AS StateCode,Isnull(S.[StateTinNo],0) AS StateTinNo,A.[Country],A.[MobileNo],Isnull(A.[GSTNo],'') AS GSTNo,Isnull(A.[CurrencyCode],'') AS CurrencyCode,Isnull(A.[GSTApplicable],0) AS GSTApplicable,Email From (SELECT [LedgerID],[LedgerGroupID], [CompanyID],[LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue  FROM [LedgerMasterDetails] Where Isnull(IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email])) p) AS A INNER JOIN LedgerGroupMaster AS B ON A.LedgerGroupID=B.LedgerGroupID AND A.CompanyID = B.CompanyID LEFT JOIN CountryStateMaster AS S ON S.State=A.State) As LM INNER JOIN JobBookingJobCard  As JEJ ON JEJ.LedgerId =LM.LedgerId And JEJ.CompanyID = " & CompanyId & " And JEJ.IsDeletedTransaction=0  INNER JOIN JobOrderBookingDetails As JOB ON JEJ.LedgerId =JOB.LedgerId And JEJ.OrderBookingID=JOB.OrderBookingID And JEJ.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster as CM ON  CM.CategoryId = JEJ.CategoryID  AND CM.CompanyID = JEJ.CompanyID INNER JOIN UserMaster AS UM ON UM.UserId = JEJ.CreatedBy LEFT JOIN JobBooking As JE  ON JE.BookingID = JEJ.BookingID LEFT JOIN ProductMaster AS PM On PM.ProductMasterID =JEJ.ProductMasterID Order by JobBookingDate DESC "
            Else
                str = "SELECT Distinct JOBD.JobCoordinatorId As CoordinatorLedgerID,JOBD.JobPriority,JOBD.CategoryID,JOBD.Remark,JOBD.JobReference,JOBD.JobType, Replace(Nullif(LM.LedgerName,''),'""','') as LedgerName,JOBD.OrderQuantity as Quantity,Nullif(JOBD.PONo,'') as PONo,Replace(Convert(Nvarchar(30),JOBD.PODate,106),'-','') as PODate,Replace(Nullif(CM.CategoryName,''),'""','') as CategoryName,Replace(Nullif(JOBD.JobName,''),'""','') as JobName,JOBD.OrderQuantity As OrderQty,Replace(Nullif(JOBD.ProductCode,''),'""','') as ProductCode,JE.BookingNo,JOB.SalesOrderNo,Replace(Convert(Nvarchar(30),JOBD.OrderBookingDate,106),'-','') as BookingDate,UM.UserName as BookedBy,Replace(Nullif(JOBD.ProductMasterCode,''),'""','') as ProductMasterCode,Replace(Nullif(JOBD.ApprovalNo,''),'""','') as ApprovalNo,JOBD.FYear,JOBD.LedgerID,JE.ProductHSNID,Nullif(LM.Email,'') as Email,JOBD.BookingID, Replace(Convert(Nvarchar(30),JOBD.DeliveryDate,106),'-','') as DeliveryDate,Replace(Nullif(JOBD.JobReferenceName ,''),'""','') as JobReferenceName,JE.ExpectedCompletionDays,JOB.OrderBookingID,JOBD.OrderBookingDetailsID,PM.ProductMasterID " &
                       "FROM(Select A.[LedgerID], B.[LedgerGroupID], B.[LedgerGroupNameID], A.[CompanyID], A.[LedgerName], A.[MailingName], A.[City], A.[State], Isnull(S.[StateCode],'') AS StateCode,Isnull(S.[StateTinNo],0) AS StateTinNo,A.[Country],A.[MobileNo],Isnull(A.[GSTNo],'') AS GSTNo,Isnull(A.[CurrencyCode],'') AS CurrencyCode,Isnull(A.[GSTApplicable],0) AS GSTApplicable,Email From (SELECT [LedgerID],[LedgerGroupID], [CompanyID],[LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue  FROM [LedgerMasterDetails] Where Isnull(IsDeletedTransaction,0)<>1 And CompanyID = " & CompanyId & " )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email])) p) AS A INNER JOIN LedgerGroupMaster AS B ON A.LedgerGroupID=B.LedgerGroupID AND A.CompanyID = B.CompanyID LEFT JOIN CountryStateMaster AS S ON S.State=A.State) As LM INNER JOIN JobOrderBooking As JOB On JOB.LedgerID=LM.LedgerID And LM.CompanyID=JOB.CompanyID Inner Join JobOrderBookingDetails As JOBD ON JOBD.OrderBookingID = JOB.OrderBookingID And JOBD.LedgerId = LM.LedgerId And JOB.CompanyID = " & CompanyId & " And Isnull(JOB.IsDeletedTransaction,0)<>1 INNER JOIN CategoryMaster as CM ON CM.CategoryId = JOBD.CategoryID And CM.CompanyID=JOB.CompanyID And JOB.IsDeletedTransaction =CM.IsDeletedTransaction INNER JOIN UserMaster AS UM ON UM.UserId = JOBD.UserId And UM.CompanyID=JOB.CompanyID And ISNULL(JOBD.IsBooked,0) = 0 LEFT JOIN JobBooking As JE ON JE.BookingID = JOBD.BookingID And JE.CompanyID=JOB.CompanyID And JOB.IsDeletedTransaction=0 LEFT JOIN ProductMaster AS PM On PM.BookingID =JE.BookingID And JE.CompanyID=PM.CompanyID And PM.IsDeletedTransaction=0 Order by BookingDate Desc "
            End If
            ''''Proofing Jobs        'SELECT Distinct JE.LedgerID,JE.BookingID,CM.CategoryID,0 AS ProductMasterID,0 AS ProductHSNID,0 AS JobCoordinatorID,JE.SalesEmployeeID,JE.EnquiryID,0 AS MaxProductMasterCode,0 AS OrderID,'' AS SalesOrderNo,'' AS OrderBookingNo,'' AS ProductMasterCode,Getdate() AS ProductMasterDate,LM.LedgerName,CM.CategoryName,JE.JobName,'' AS GroupName,JE.ProductCode,JEC.PlanContQty,EM.LedgerName As EmployeeName,JE.BookingNo,JE.CreatedDate As QuotDate,'' AS OrderBookedBy,'' AS ProductMasterBy,'' AS JobReference,'' AS JobType,'' AS LastJCNo,'' AS lastSONo,'' AS FileNo, '' AS JobCoordinatorName,JE.FYear,UM.UserName AS QuotedBy     FROM LedgerMaster As LM INNER JOIN JobBooking As JE ON JE.LedgerId =LM.LedgerId AND LM.CompanyID=JE.CompanyID INNER JOIN CategoryMaster as CM ON CM.CategoryId = JE.CategoryID AND CM.CompanyID=JE.CompanyID INNER JOIN UserMaster AS UM ON UM.UserId = JE.CreatedBy AND UM.CompanyID=JE.CompanyID       /* And ISNULL(JE.IsApproved,0) =1 */ INNER JOIN JobBookingContents As JEC ON JE.BookingID = JEC.BookingID AND JEC.CompanyID=JE.CompanyID /*INNER JOIN JobApprovedPrice As JAE ON JAE.BookingID = JEC.BookingID  And JEC.Quantity=JAE.Quantity  And Isnull(JAE.IsApproved,0)=1 And  Isnull(JAE.IsProductMaster,0)in(0) */ LEFT JOIN (SELECT [LedgerID],[LedgerGroupID], [CompanyID],[LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue  FROM [LedgerMasterDetails] Where Isnull(IsDeletedTransaction,0)<>1 And CompanyID = "& CompanyID &" )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[MailingName],[City],[State],[Country],[MobileNo],[GSTNo],[CurrencyCode],[GSTApplicable],[Email])) p) AS EM ON EM.LedgerID=JE.SalesEmployeeID AND EM.CompanyID=JE.CompanyID Where Not Exists (Select Distinct Isnull(BookingID,0) From ProductMaster Where BookingID=JE.BookingID AND CompanyID=JE.CompanyID) AND JE.CompanyID=2 Order by JE.CreatedDate desc   
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '' ---------------------------- Generate Job Booking Job Card No ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateJobCardNo() As String
        Try
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim GenJobCardNo As String
            GenJobCardNo = db.GeneratePrefixedNo("JobBookingJobCard", "J", "MaxJobBookingNo", 0, FYear, " Where FYear='" & FYear & "' And CompanyID=" & CompanyId)
            Return GenJobCardNo
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '' ---------------------------- Generate Product Catalog No ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateProductCatalogNo() As String
        Try
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim ProductMasterCode As String
            ProductMasterCode = db.GeneratePrefixedNo("ProductMaster", "PC", "MaxProductMasterCode", 0, FYear, "Where CompanyId = " & CompanyId & " And FYear='" & FYear & "'")
            Return ProductMasterCode
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''---------------------------- Generate Content Id  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateContentIdJobcard() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim GenContId As String
            GenContId = db.GenerateProductionCode("JobBookingJobcardContents", "JobBookingJobCardContentsID", 0, "Where CompanyID = " & CompanyId)
            Return GenContId
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------  Product  All  Contents  Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridProductContentsData(ByVal BookingId As Integer, ByVal ProductType As String, ByVal check As String, ByVal ProdMasCode As String, ByVal Quantity As Long) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim strcolName As String
        Dim tableName As String
        '/**/  /* And JEC.ContentName = '" & ContentName & "'*/ 
        Try
            If ProductType = "JobCard" Then
                If (check = "Pending") Then
                    If (ProdMasCode = "" Or Nothing) Then
                        strcolName = ""
                        tableName = "JobBookingContents AS JBC Inner Join ViewJobBookingContents "
                    Else
                        strcolName = "JEC.Correction,JEC.DieNo,JEC.LineNo,JEC.JobDetailsRemark, "
                        tableName = "ProductMasterContents AS JBC Inner Join ViewProductMasterContents "
                    End If
                    str = "Select " & strcolName & " JEC.PlanContQty As Quantity,JEC.PlanContName As ContentName,JEC.JobContentsID As ContentId,JEC.PlanContentType As ContentType,JBC.GrantAmount AS TotalCost,JBC.JobCloseSize, JEC.PlanColorStrip As ColorStrip,JEC.PlanGripper As GripperMain,JEC.PlanFColor As FrontColor, JEC.PlanBColor As BackColor,JEC.PlanSpeFColor As SpecialFrontColor,JEC.PlanSpeBColor As SpecialBackColor,JBC.GrainDirection As GrainDirectionMain,JEC.PlanPrintingStyle As WorkAndTurn, JEC.ItemPlanQuality As Quality,JEC.ItemPlanGSM As GSM,JEC.ItemPlanMill As Mill,JEC.PlanPlateType As PlateType,JEC.PlanWtageType As WastageType,JEC.PlanWtageValue As WastageValue, 'L='+JEC.Trimmingleft+'; T='+JEC.Trimmingtop+'; R='+JEC.Trimmingright+'; B='+JEC.Trimmingbottom As JobTrimming,JEC.Trimmingleft As JobTrimmingL,JEC.Trimmingright As JobTrimmingR,JEC.Trimmingtop As JobTrimmingT,JEC.Trimmingbottom As JobTrimmingB, JEC.StripingLeft As StripingL, JEC.Stripingright As StripingR, JEC.Stripingtop As StripingT, JEC.Stripingbottom As StripingB, JEC.SizeHeight As JobHeight, JEC.SizeLength As JobLength, JEC.SizeWidth As JobWidth, JEC.SizeOpenflap As OpenFlap, JEC.SizeOpenflap As OverlapFlap,JEC.SizeBottomflap As BottomFlap, JEC.PlanGripper As Gripper,  JBC.InterlockStyle,JBC.PlateQty, JBC.GripperSide, JBC.PlanType, JBC.UpsL, JBC.UpsW, JBC.GrainDirection, PM.EstimationUnit As RateType, JBC.TotalPaperWeightInKg As TotalPaperInKG, JBC.FullSheets, JBC.MachineID, JBC.ImpressionsToBeCharged, JBC.FinalQuantity, JBC.TotalUps,  JBC.TotalColors, JBC.MainPaperName, JBC.MakeReadyWastageSheet As MakeReadySheetsTotal,JBC.ActualSheets, JBC.WastageSheets, PM.UnitPerPacking, PM.PackingType, JBC.SpeColorFCharges, JBC.SpeColorBCharges,  JBC.SpeColorFAmt,JBC.SpeColorBAmt,JBC.PrintingChargesType, MM.RoundofImpressionsWith, JBC.MachineName, JBC.PaperSize, JBC.CutSize As PrintingSheetSize,JBC.BalPiece, JBC.WastePerc, JBC.WastageKg, JBC.TotalAmount, JBC.PrintingStyle,JBC.ExpectedExecutionTime,JBC.PlateRate, JBC.PlateAmount, JBC.PaperRate, JBC.PaperAmount, JBC.PrintingRate, JBC.PrintingAmount,JEC.JobNoOfPages As Pages,'L='+JEC.Stripingleft+'; T='+JEC.Stripingtop+'; R='+JEC.Stripingright+'; B='+JEC.Stripingbottom As StripingMargin, '' As JobDetailForQuotation, JBC.MachineColors, JBC.PaperID, JBC.CutL, JBC.CutW, JBC.BalSide, JBC.WasteArea,JBC.PrintingImpressions, JBC.TotalMakeReadies, JBC.MakeReadyRate, JBC.MakeReadyAmount, JBC.CutLH, JBC.CutHL, 1 As NoofSetsofFrontBack, Case When Isnull(JEC.ChkPaperByClient,'False') = 'True' Then 'Client' Else 'Self' End As PaperBy, JBC.DieCutSize, JEC.OnlineCoating,PM.PurchaseUnit,PM.ItemCode " &
                    " From " & tableName & " As JEC On JBC.BookingID=JEC.BookingID And JBC.JobContentsID=JEC.JobContentsID And JBC.PlanContQty =  " & Quantity & " And JBC.CompanyID=JEC.CompanyID Inner Join (SELECT Distinct PaperID, Quality, GSM, Manufecturer, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, PaperTrimming, SizeW, SizeL, Caliper, Isnull(IsStandardItem,0) As IsStandardItem, ItemCode, Isnull(IsBalancePiece,0) As IsBalancePiece, IsNull(EstimationUnit,'') As EstimationUnit,PaperName,PaperGroup,ItemGroupName,PurchaseUnit From (Select Distinct [ItemID] As PaperID,IMD.ItemGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From ItemMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.ItemGroupID And IMD.CompanyID=IG.CompanyID And IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1 And Isnull(IMD.IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Quality], [GSM], [Manufecturer], [PackingType], [UnitPerPacking], [WtPerPacking], [EstimationRate], [Finish], [PaperTrimming],[SizeW], [SizeL], [Caliper], [IsStandardItem], [ItemCode], [IsBalancePiece], [EstimationUnit],[PaperName],[PaperGroup],[PurchaseUnit])) P) As PM On PM.PaperID = JBC.PaperID Inner Join MachineMaster As MM On MM.MachineId = JBC.MachineId Where JBC.BookingId = " & BookingId & " And JEC.CompanyId = " & CompanyId & " Order By JBC.JobContentsID Asc"
                Else
                    str = "Select JEC.Quantity,JEC.ContentName,JEC.ContentId,JEC.Orientation as ContentType,JEC.TotalCost,JEC.JobCloseSize,JEC.ColorStrip,JEC.GripperMain,JEC.FrontColor,JEC.BackColor,JEC.SpecialFrontColor,JEC.SpecialBackColor,JEC.GrainDirectionMain, JEC.WorkAndTurn,Quality,GSM,Mill,JEC.PlateType,JEC.WastageType,JEC.WastagePercentSheets,JEC.JobTrimming,JEC.JobTrimmingL,JEC.JobTrimmingR,JEC.JobTrimmingT, JEC.JobTrimmingB, JEC.StrippingL, JEC.StrippingR, JEC.StrippingT, JEC.StrippingB, JEC.JobHeight, JEC.JobLength, JEC.JobWidth, JEC.OpenFlap, JEC.OverlapFlap, JEC.BottomFlap, JEC.Gripper, JEC.InterlockStyle,JEC.PlateQuantity, JEC.GripperSide, JEC.PlanType, JEC.UpsL, JEC.UpsW, JEC.GrainDirection, PM.RateType, JEC.TotalPaperInKG, JEC.FullSheets, JEC.MachineId, JEC.ImpressionToBeCharged, JEC.FinalQuantity, JEC.UpsTotal, JEC.TotalColors, JEC.MainPaperName, JEC.MakeReadySheetsTotal, JEC.ActualSheets, JEC.WastageSheets, PM.UnitPerPacking, PM.Packing, JEC.SpecialColorFrontCharges, JEC.SpecialColorBackCharges, JEC.SpecialColorFrontAmount, JEC.SpecialColorBackAmount, JEC.PrintingChargesType, MM.RoundofImpressionsWith, JEC.MachineName, JEC.PaperSize, JEC.PrintingSheetSize, JEC.BalancePiece, JEC.WasteInPercentage, JEC.PaperWastageInKg, JEC.TotalAmount, JEC.PrintingStyle,      " &
                   " JEC.ExpectedExecutionTime, JEC.PlanType, JEC.PlateQuantity, JEC.PlateRate, JEC.PlateAmount, JEC.PaperRate, JEC.PaperAmount, JEC.PrintingRate, JEC.PrintingAmount,      " &
                   " JEC.Pages, JEC.StrippingMargin, JEC.Paper, JEC.PaperSearchString, JEC.JobDetailForQuotation, JEC.MachineColors, JEC.PaperId, JEC.CutL, JEC.CutW, JEC.BalancePieceSide, JEC.Waste,      " &
                   " JEC.PrintingImpressions, JEC.MakeReadies, JEC.MakeReadyRate, JEC.MakeReadyAmount, JEC.CutLH, JEC.CutHL, JEC.NoofSetsofFrontBack, JEC.PaperBy, JEC.DieCutSize, JEC.TotalColorsAll, JEC.OnlineCoating,    " &
                   " JobCoordinatorId,JobCoordinatorName ,JobPriority,JobType,JobReference,DieNo,LineNo,JobDetailsRemark,Correction, Rulling    From JobBookingJobcardContents As JEC Inner Join PaperMaster As PM On PM.PaperID = JEC.PaperID Inner Join MachineMaster As MM       " &
                   " On MM.MachineId = JBC.MachineId And JBC.CompanyID=MM.CompanyID Where BookingId = " & BookingId & " And JEC.CompanyId = " & CompanyId & " Order By ContentId Desc  "
                End If
            ElseIf ProductType = "Product" Then
                If (check = "Pending") Then
                    tableName = "JobBookingContents AS JBC Inner Join ViewJobBookingContent"

                    str = "Select JEC.PlanContQty As Quantity,JEC.PlanContName As ContentName,JEC.JobContentsID As ContentId,JEC.PlanContentType As ContentType,JBC.GrantAmount AS TotalCost,JBC.JobCloseSize, JEC.PlanColorStrip As ColorStrip,JEC.PlanGripper As GripperMain,JEC.PlanFColor As FrontColor, JEC.PlanBColor As BackColor,JEC.PlanSpeFColor As SpecialFrontColor,JEC.PlanSpeBColor As SpecialBackColor,JBC.GrainDirection As GrainDirectionMain,JEC.PlanPrintingStyle As WorkAndTurn, JEC.ItemPlanQuality As Quality,JEC.ItemPlanGSM As GSM,JEC.ItemPlanMill As Mill,JEC.PlanPlateType As PlateType,JEC.PlanWtageType As WastageType,JEC.PlanWtageValue As WastageValue, 'L='+JEC.Trimmingleft+'; T='+JEC.Trimmingtop+'; R='+JEC.Trimmingright+'; B='+JEC.Trimmingbottom As JobTrimming,JEC.Trimmingleft As JobTrimmingL,JEC.Trimmingright As JobTrimmingR,JEC.Trimmingtop As JobTrimmingT,JEC.Trimmingbottom As JobTrimmingB, JEC.StripingLeft As StripingL, JEC.Stripingright As StripingR, JEC.Stripingtop As StripingT, JEC.Stripingbottom As StripingB, JEC.SizeHeight As JobHeight, JEC.SizeLength As JobLength, JEC.SizeWidth As JobWidth, JEC.SizeOpenflap As OpenFlap, JEC.SizeOpenflap As OverlapFlap,JEC.SizeBottomflap As BottomFlap, JEC.PlanGripper As Gripper,  JBC.InterlockStyle,JBC.PlateQty, JBC.GripperSide, JBC.PlanType, JBC.UpsL, JBC.UpsW, JBC.GrainDirection, PM.EstimationUnit As RateType, JBC.TotalPaperWeightInKg As TotalPaperInKG, JBC.FullSheets, JBC.MachineID, JBC.ImpressionsToBeCharged, JBC.FinalQuantity, JBC.TotalUps,  JBC.TotalColors, JBC.MainPaperName, JBC.MakeReadyWastageSheet As MakeReadySheetsTotal,JBC.ActualSheets, JBC.WastageSheets, PM.UnitPerPacking, PM.PackingType, JBC.SpeColorFCharges, JBC.SpeColorBCharges,  JBC.SpeColorFAmt,JBC.SpeColorBAmt,JBC.PrintingChargesType, MM.RoundofImpressionsWith, JBC.MachineName, JBC.PaperSize, JBC.CutSize As PrintingSheetSize,JBC.BalPiece, JBC.WastePerc, JBC.WastageKg, JBC.TotalAmount, JBC.PrintingStyle,JBC.ExpectedExecutionTime,JBC.PlateRate, JBC.PlateAmount, JBC.PaperRate, JBC.PaperAmount, JBC.PrintingRate, JBC.PrintingAmount,JEC.JobNoOfPages As Pages,'L='+JEC.Stripingleft+'; T='+JEC.Stripingtop+'; R='+JEC.Stripingright+'; B='+JEC.Stripingbottom As StripingMargin, '' As JobDetailForQuotation, JBC.MachineColors, JBC.PaperID, JBC.CutL, JBC.CutW, JBC.BalSide, JBC.WasteArea,JBC.PrintingImpressions, JBC.TotalMakeReadies, JBC.MakeReadyRate, JBC.MakeReadyAmount, JBC.CutLH, JBC.CutHL, 1 As NoofSetsofFrontBack, Case When Isnull(JEC.ChkPaperByClient,'False') = 'True' Then 'Client' Else 'Self' End As PaperBy, JBC.DieCutSize, JEC.OnlineCoating,PM.PurchaseUnit,PM.ItemCode " &
                    " From " & tableName & " As JEC On JBC.BookingID=JEC.BookingID And JBC.JobContentsID=JEC.JobContentsID And JBC.PlanContQty =  " & Quantity & " And JBC.CompanyID=JEC.CompanyID Inner Join (SELECT Distinct PaperID, Quality, GSM, Manufecturer, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, SizeW, SizeL, Caliper, ItemCode, IsNull(EstimationUnit,'') As EstimationUnit,PurchaseUnit From (Select Distinct [ItemID] As PaperID,IMD.ItemGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From ItemMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.ItemGroupID And IMD.CompanyID=IG.CompanyID And IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1 And Isnull(IMD.IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Quality], [GSM], [Manufecturer], [PackingType], [UnitPerPacking], [WtPerPacking], [EstimationRate], [Finish], [SizeW], [SizeL], [Caliper], [ItemCode], [EstimationUnit],[PurchaseUnit])) P) As PM On PM.PaperID = JBC.PaperID Inner Join MachineMaster As MM On MM.MachineId = JBC.MachineId Where JBC.BookingId = " & BookingId & " And JEC.CompanyId = " & CompanyId & " Order By JBC.JobContentsID Asc"
                Else
                    str = "Select JEC.Quantity,JEC.ContentName,JEC.ContentId,JEC.Orientation as ContentType,JEC.TotalCost,JEC.JobCloseSize,JEC.ColorStrip,JEC.GripperMain,JEC.FrontColor,JEC.BackColor,JEC.SpecialFrontColor,JEC.SpecialBackColor,JEC.GrainDirectionMain, JEC.WorkAndTurn,Quality,GSM,Mill,JEC.PlateType,JEC.WastageType,JEC.WastagePercentSheets,JEC.JobTrimming,JEC.JobTrimmingL,JEC.JobTrimmingR,JEC.JobTrimmingT, JEC.JobTrimmingB, JEC.StrippingL, JEC.StrippingR, JEC.StrippingT, JEC.StrippingB, JEC.JobHeight, JEC.JobLength, JEC.JobWidth, JEC.OpenFlap, JEC.OverlapFlap, JEC.BottomFlap, JEC.Gripper, JEC.InterlockStyle,JEC.PlateQuantity, JEC.GripperSide, JEC.PlanType, JEC.UpsL, JEC.UpsW, JEC.GrainDirection, PM.RateType, JEC.TotalPaperInKG, JEC.FullSheets, JEC.MachineId, JEC.ImpressionToBeCharged, JEC.FinalQuantity, JEC.UpsTotal, JEC.TotalColors, JEC.MainPaperName, JEC.MakeReadySheetsTotal, JEC.ActualSheets, JEC.WastageSheets, PM.UnitPerPacking, PM.Packing, JEC.SpecialColorFrontCharges, JEC.SpecialColorBackCharges, JEC.SpecialColorFrontAmount, JEC.SpecialColorBackAmount, JEC.PrintingChargesType, MM.RoundofImpressionsWith, JEC.MachineName, JEC.PaperSize, JEC.PrintingSheetSize, JEC.BalancePiece, JEC.WasteInPercentage, JEC.PaperWastageInKg, JEC.TotalAmount, JEC.PrintingStyle,      " &
                   " JEC.ExpectedExecutionTime, JEC.PlanType, JEC.PlateQuantity, JEC.PlateRate, JEC.PlateAmount, JEC.PaperRate, JEC.PaperAmount, JEC.PrintingRate, JEC.PrintingAmount,      " &
                   " JEC.Pages, JEC.StrippingMargin, JEC.Paper, JEC.PaperSearchString, JEC.JobDetailForQuotation, JEC.MachineColors, JEC.PaperId, JEC.CutL, JEC.CutW, JEC.BalancePieceSide, JEC.Waste,      " &
                   " JEC.PrintingImpressions, JEC.MakeReadies, JEC.MakeReadyRate, JEC.MakeReadyAmount, JEC.CutLH, JEC.CutHL, JEC.NoofSetsofFrontBack, JEC.PaperBy, JEC.DieCutSize, JEC.TotalColorsAll, JEC.OnlineCoating,    " &
                   " JobCoordinatorId,JobCoordinatorName ,JobPriority,JobType,JobReference,DieNo,LineNo,JobDetailsRemark,Correction, Rulling    From JobBookingJobcardContents As JEC Inner Join PaperMaster As PM On PM.PaperID = JEC.PaperID Inner Join MachineMaster As MM       " &
                   " On MM.MachineId = JBC.MachineId And JBC.CompanyID=MM.CompanyID Where BookingId = " & BookingId & " And JEC.CompanyId = " & CompanyId & " Order By ContentId Desc  "
                End If
            End If

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------    Process  Data    ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridSelectedProductProcessData(ByVal BookingId As Integer, ByVal Quantity As Long, ByVal ContentName As String, ByVal check As String, ByVal ProdMasCode As String, ByVal ContId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            If (check = "Process") Then
                str = " SELECT   JEO.ContentId, OM.ProcessId, OM.ProcessName, JEO.Rate,  JEO.SizeL, JEO.SizeW, JEO.Amount,JEO.Remarks  From JobProcessSchedule JEO, ProcessMaster OM Where JEO.ProcessID = OM.ProcessID And JEO.BookingID = " & BookingId & " And  ContentId = '" & ContId & "' And JEO.CompanyId = " & CompanyId & " Order by JEO.ContentID, JEO.TransID  "
            Else
                If (ProdMasCode = "" Or Nothing) Then
                    str = "SELECT JEO.PlanContName As ContentName, OM.ProcessID, OM.ProcessName, JEO.Rate, JEO.SizeL, JEO.SizeW, JEO.Amount,JEO.RateFactor,JEO.Remarks FROM JobBookingProcess AS JEO CROSS JOIN ProcessMaster AS OM WHERE (JEO.ProcessID = OM.ProcessID) AND (JEO.BookingID = " & BookingId & ") AND (JEO.PlanContQty = " & Quantity & ") AND (JEO.PlanContName = '" & ContentName & "') AND (JEO.CompanyId = " & CompanyId & ") ORDER BY JEO.ContentsID, JEO.TransID, JEO.PlanContQty"
                Else
                    str = " SELECT   JEO.PlanContName As ContentName, OM.ProcessId, OM.ProcessName, JEO.Rate,  JEO.SizeL, JEO.SizeW, JEO.Amount,JEO.RateFactor,JEO.Remarks From JobBookingProcess JEO, ProcessMaster OM Where JEO.ProcessID = OM.ProcessID And JEO.BookingID = " & BookingId & "  And  " &
                        "Isnull(JEO.PlanContQty,0) = " & Quantity & " And PlanContName = '" & ContentName & "' And JEO.CompanyId = " & CompanyId & " Order by JEO.ContentsID, JEO.TransID, JEO.PlanContQty"
                End If
            End If
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------    Ink Shade selected  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridInkShadeSelectedData(ByVal BookingId As Integer, ByVal ProductContID As Integer, ByVal ProdMasID As Integer, ByVal JobContId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            If (JobContId > 0) Then
                str = "Select Distinct TransID,BookingID,ProductMasterCode,ProductMasterContentsID,ContentsID,PlanContName,ItemGroupID,-3 AS ItemGroupNameID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingColorDetails Where CompanyId = " & CompanyId & " And BookingID = " & BookingId & " And JobBookingID = " & ProdMasID & " And JobCardContentsID= " & JobContId & " Order By TransID"
            ElseIf (ProductContID > 0) Then
                str = "Select Distinct TransID,BookingID,ProductMasterCode,ProductMasterContentsID,ContentsID,PlanContName,ItemGroupID,-3 AS ItemGroupNameID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingColorDetails Where CompanyId = " & CompanyId & " And BookingID = " & BookingId & " And ProductMasterID = " & ProdMasID & " And ProductMasterContentID= " & ProductContID & " Order By TransID"
            Else
                str = "Select Distinct TransID,BookingID,ProductMasterCode,ProductMasterContentsID,ContentsID,PlanContName,ItemGroupID,-3 AS ItemGroupNameID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingColorDetails Where CompanyId = " & CompanyId & " And ProductMasterID = 0 Order by ProductMasterContentsID,TransID"
            End If
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''----------------------------    Ink Shade List  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadAllInksList() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "SELECT Distinct IM.ItemID, IM.ItemName, IM.ItemGroupID,IGM.ItemGroupNameID, IM.ItemCode,IGM.ItemGroupName,(Select FieldValue From ItemMasterDetails Where ItemID=IM.ItemID And CompanyID=IM.CompanyID And FieldName='IsStandardItem') As IsStandardItem ,(Select FieldValue From ItemMasterDetails Where ItemID=IM.ItemID And CompanyID=IM.CompanyID And FieldName='PantoneCode') As ItemPantoneCode From ItemMaster As IM INNER JOIN ItemGroupMaster As IGM ON IGM.ItemGroupID = IM.ItemGroupID And IGM.ItemGroupNameID IN(-3)/*Ink and adhesive group name id*/ And IM.CompanyID=" & CompanyId & " Order by IM.ItemName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''---------------------------- Content Data for Review Revise and Copy as new  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function TableJobCardContentsData(ByVal BookingId As Integer, ByVal Quantity As Integer, ByVal check As String, ByVal ProdMasCode As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim tablnam As String
        If (check = "Pending") Then
            If (ProdMasCode = "" Or Nothing) Then
                tablnam = "JobBookingContents"
            Else
                tablnam = "ProductMasterContents"
            End If
        Else
            tablnam = "JobBookingJobcardContents"
        End If
        str = " Select JEC.ContentId,JEC.Quantity,JEC.ContentName,JEC.Orientation,JEC.TotalCost,JEC.JobCloseSize,JEC.ColorStrip,JEC.GripperMain,JEC.FrontColor,JEC.BackColor,JEC.SpecialFrontColor,JEC.SpecialBackColor,JEC.GrainDirectionMain,   " &
               " JEC.WorkAndTurn,Quality,GSM,Mill,JEC.PlateType,JEC.WastageType,JEC.WastagePercentSheets,JEC.JobTrimming,JEC.JobTrimmingL,JEC.JobTrimmingR,JEC.JobTrimmingT,   " &
               " JEC.JobTrimmingB,JEC.StrippingL,JEC.StrippingR,JEC.StrippingT,JEC.StrippingB,JEC.JobHeight,JEC.JobLength,JEC.JobWidth,JEC.OpenFlap,JEC.OverlapFlap,   " &
               " JEC.BottomFlap,JEC.Gripper,JEC.InterlockStyle,JEC.GripperSide,JEC.PlanType,JEC.UpsL,JEC.UpsW,JEC.GrainDirection,PM.RateType,JEC.TotalPaperInKG,   " &
               " JEC.FullSheets,JEC.MachineId,JEC.ImpressionToBeCharged,JEC.FinalQuantity,JEC.UpsTotal,JEC.TotalColors,JEC.MainPaperName,JEC.MakeReadySheetsTotal,   " &
               " JEC.ActualSheets,JEC.WastageSheets,PM.UnitPerPacking,PM.Packing,JEC.SpecialColorFrontCharges,JEC.SpecialColorBackCharges,JEC.SpecialColorFrontAmount,   " &
               " JEC.SpecialColorBackAmount,JEC.PrintingChargesType,MM.RoundofImpressionsWith,JEC.MachineName,JEC.PaperSize,JEC.PrintingSheetSize,JEC.BalancePiece,JEC.WasteInPercentage,JEC.PaperWastageInKg,JEC.TotalAmount,JEC.PrintingStyle,   " &
               " JEC.ExpectedExecutionTime,JEC.PlanType,JEC.PlateQuantity,JEC.PlateRate,JEC.PlateAmount,JEC.PaperRate,JEC.PaperAmount,JEC.PrintingRate,JEC.PrintingAmount,   " &
               " JEC.Pages,JEC.StrippingMargin,JEC.Paper,JEC.PaperSearchString,JEC.JobDetailForQuotation,JEC.MachineColors,JEC.PaperId,JEC.CutL,JEC.CutW,JEC.BalancePieceSide,JEC.Waste,  " &
               " JEC.PrintingImpressions, JEC.MakeReadies, JEC.MakeReadyRate, JEC.MakeReadyAmount, JEC.CutLH, JEC.CutHL, JEC.NoofSetsofFrontBack, JEC.PaperBy,   " &
               " JEC.DieCutSize, JEC.TotalColorsAll, JEC.OnlineCoating ,IsPlanned, JEC.PrintingMargin,PrintingMarginL,PrintingMarginR,PrintingMarginT,PrintingMarginB  " &
               " From " & tablnam & " As JEC Inner Join PaperMaster As PM On PM.PaperID = JEC.PaperID Inner Join MachineMaster As MM On MM.MachineId = JEC.MachineId Where BookingId = '" & BookingId & "' and Quantity = '" & Quantity & "' and JEC.CompanyId = '" & CompanyId & "'   Order By ContentId Asc  "
        dataTable.Reset()
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''' <summary>
    ''' Save data job card /Production work order
    ''' </summary>
    ''' <param name="TblBooking">Main table job card </param>
    ''' <param name="TblPlanning">Contents data</param>
    ''' <param name="TblOperations">Process data</param>
    ''' <param name="TblContentForms">Book forms data</param>
    ''' <param name="FlagEdit">Insert or update flag</param>
    ''' <param name="JobBookingNo">Job card number</param>
    ''' <param name="ObjMateRequire">Material requireent data on process or machine</param>
    ''' <returns></returns>

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductionWorkOrderData(ByVal TblBooking As Object, ByVal TblPlanning As Object, ByVal TblOperations As Object, ByVal TblContentForms As Object, ByVal FlagEdit As String, ByVal JobBookingNo As String, ByVal JobBookingID As Integer, ByVal ObjMateRequire As Object, ByVal ObjInkData As Object, ByVal TblItemIndentsMainData As Object, ByVal TblItemIndentsDetailData As Object, ByVal TblContentFormsDetails As Object, ByVal TblItemPickListDetailData As Object, ByVal TblItemPickListMainData As Object) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Dim MaxJobBookingNo As Long
            Dim IndentTransactionID As Long = 0
            Dim IndentVoucherNo As String
            Dim IndentPrefix As String = "IND"
            Dim MaxVoucherNo As Long = 0
            Dim DTValid As New DataTable

            Dim AddColName = "", AddColValue = "", TableName As String = ""
            If FlagEdit = True Then

                If db.CheckAuthories("ProductionWorkOrder.aspx", UserId, CompanyId, "CanEdit") = False Then
                    Return "You are not authorized to update job card..!"
                End If

                str = "Select IsRelease From JobBookingJobCardContents Where IsDeletedTransaction=0 And Isnull(IsRelease,0)=1 And JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    Return "You can not Modify the Job, Job is scheduled"
                End If

                str = "Select JobBookingID From JobScheduleRelease Where IsDeletedTransaction=0 And JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    Return "You can not Modify the Job, Job is scheduled"
                End If

                dataTable = New DataTable()
                db.ConvertObjectToDatatable(TblItemPickListDetailData, dataTable)
                For i = 0 To dataTable.Rows.Count - 1
                    If db.IsDeletable("PicklistTransactionID", "ItemPicklistReleaseDetail", " Where JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & " And ItemID=" & dataTable.Rows(i)("ItemID") & " And IsDeletedTransaction=0") = False Then
                        Return "You can not Modify the Job, Item is released, please delete all transactions.."
                    End If
                Next
                dataTable = New DataTable()
            Else
                If db.CheckAuthories("ProductionWorkOrder.aspx", UserId, CompanyId, "CanSave") = False Then
                    Return "You are not authorized to save job card..!"
                End If
            End If

            Using updateTransaction As New Transactions.TransactionScope

                TableName = "JobBookingJobCard"
                If FlagEdit = "False" Or FlagEdit = False Then
                    JobBookingNo = db.GeneratePrefixedNo(TableName, "J", "MaxJobBookingNo", MaxJobBookingNo, FYear, " Where CompanyID = " & CompanyId & " And FYear='" & FYear & "' AND Isnull(IsDeletedTransaction,0)=0")
                End If
                AddColName = "JobBookingNo,MaxJobBookingNo,CompanyID,CreatedBy,FYear,JobBookingDate,CreatedDate,ModifiedDate"
                AddColValue = "'" & JobBookingNo & "','" & MaxJobBookingNo & "','" & CompanyId & "'," & UserId & ",'" & FYear & "',getdate(),getdate(),getdate()"
                If FlagEdit = False Then
                    JobBookingID = db.InsertDatatableToDatabase(TblBooking, TableName, AddColName, AddColValue)
                Else
                    db.UpdateDatatableToDatabase(TblBooking, TableName, "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", 1, " JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardProcess Where  JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardContentBookForms Where  JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardProcessMaterialRequirement Where  JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardColorDetails Where  JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")

                    Dim DTRecordDetail As New DataTable
                    db.FillDataTable(DTRecordDetail, "Select Distinct ItemID From ItemTransactionDetail Where IsDeletedTransaction=0 And JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId)

                    db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId)

                    For i = 0 To DTRecordDetail.Rows.Count - 1
                        db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & CompanyId & ",0," & DTRecordDetail.Rows(i)("ItemID"))
                    Next

                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardFormWiseDetails Where  JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                End If
                If Val(JobBookingID) <= 0 Then Return "Error:500"
                Dim TblObj, TblObjCont As New DataTable
                TableName = "JobBookingJobCardContents"
                If FlagEdit = True Then
                    For i = 0 To TblPlanning.length - 1
                        TblPlanning(i)("JobCardContentNo") = JobBookingNo & "[" & i + 1 & "_" & TblPlanning.length & "]"
                    Next
                    str = db.UpdateContentsDatatableToDatabase(TblPlanning, TableName, "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", "JobBookingJobCardContentsID", " JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500 Contents updating- " & str
                    End If
                Else
                    db.ConvertObjectToDatatable(TblPlanning, TblObjCont, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500, Contents saving- " & str
                    End If

                    'TblObjCont.DefaultView.Sort = "SequenceNo Asc"
                    If TblObjCont.Rows.Count > 0 Then
                        TblObjCont.Columns.Remove("OrderBookingID")
                        TblObjCont.Columns.Remove("OrderBookingDetailsID")
                    End If
                    TblObjCont.Columns.Add("JobCardContentNo")
                    For i = 0 To TblObjCont.Rows.Count - 1
                        TblObjCont.Rows(i)("JobCardContentNo") = JobBookingNo & "[" & i + 1 & "_" & TblObjCont.Rows.Count & "]"
                    Next
                    AddColName = "JobBookingID,CreatedDate,CompanyId"
                    AddColValue = "'" & JobBookingID & "',Getdate(),'" & CompanyId & "'"
                    str = db.InsertSecondaryDataJobCard(TblObjCont, TableName, AddColName, AddColValue, "", "", "")
                    If IsNumeric(str) = False Then
                        updateTransaction.Dispose()
                        Return "Error:500, Contents saving- " & str
                    End If
                End If

                AddColName = "JobBookingID,CreatedDate,CompanyId"
                AddColValue = "'" & JobBookingID & "',Getdate(),'" & CompanyId & "'"
                Dim WhereCndtn = " And JobBookingID =" & JobBookingID & " And CompanyID=" & CompanyId & ""
                TblObj.Clear()
                TableName = "JobBookingJobCardProcess"
                db.ConvertObjectToDatatable(TblOperations, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                TblObj.Clear()
                TableName = "JobBookingJobCardContentBookForms"
                db.ConvertObjectToDatatable(TblContentForms, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                TblObj.Clear()
                TableName = "JobBookingJobCardFormWiseDetails"
                db.ConvertObjectToDatatable(TblContentFormsDetails, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                Dim PlanContName As String = ""
                Dim JobCardContentNo As String = ""
                Dim x = 0

                ''Added on 11052020
                If FlagEdit = True Then
                    db.ConvertObjectToDatatable(TblPlanning, TblObjCont, str)

                    'TblObjCont.Columns.Add("JobCardContentNo")
                    'For i = 0 To TblObjCont.Rows.Count - 1
                    '    TblObjCont.Rows(i)("JobCardContentNo") = JobBookingNo & "[" & i + 1 & "_" & TblObjCont.Rows.Count & "]"
                    'Next
                End If

                For i = 0 To TblObj.Rows.Count - 1
                    If TblObj.Rows(i)("PlanContName") <> PlanContName Then
                        x = 1
                    End If
                    For index = 0 To TblObjCont.Rows.Count - 1
                        If TblObjCont.Rows(index)("PlanContName") = TblObj.Rows(i)("PlanContName") Then
                            JobCardContentNo = TblObjCont.Rows(index)("JobCardContentNo")
                        End If
                        TblObj.Rows(i)("JobCardFormNo") = JobCardContentNo & "_" & x
                    Next
                    PlanContName = TblObj.Rows(i)("PlanContName")
                    x = x + 1
                Next
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName & ",JobBookingJobCardNo", AddColValue & ",'" & JobBookingNo & "'", "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                TblObj.Clear()
                TableName = "JobBookingJobCardProcessMaterialRequirement"
                db.ConvertObjectToDatatable(ObjMateRequire, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                TblObj.Clear()
                TableName = "JobBookingJobCardColorDetails"
                db.ConvertObjectToDatatable(ObjInkData, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                TblObj.Columns.Add("JobBookingNo")
                For i = 0 To TblObj.Rows.Count - 1
                    TblObj.Rows(i)("JobBookingNo") = JobBookingNo
                Next
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If

                '''''''''''''' Save Indent data
                TblObj.Clear()
                If TblItemIndentsDetailData.length > 0 Then
                    TableName = "ItemTransactionMain"
                    IndentVoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", IndentPrefix, "MaxVoucherNo", MaxVoucherNo, FYear, " Where VoucherPrefix='" & IndentPrefix & "' And  CompanyID=" & CompanyId & " And FYear='" & FYear & "' And VoucherID=-8")

                    AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherID,VoucherPrefix,MaxVoucherNo,VoucherNo,JobBookingID,Particular"
                    AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & UserId & "','" & UserId & "',-8,'" & IndentPrefix & "','" & MaxVoucherNo & "','" & IndentVoucherNo & "'," & JobBookingID & ",'JOBCARD INDENT'"
                    IndentTransactionID = db.InsertDatatableToDatabase(TblItemIndentsMainData, TableName, AddColName, AddColValue)

                    If IsNumeric(IndentTransactionID) = False Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If

                    TblObj.Clear()
                    TableName = "ItemTransactionDetail"
                    db.ConvertObjectToDatatable(TblItemIndentsDetailData, TblObj, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If

                    AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,JobBookingID,IsReleased,ReleasedBy,ReleasedDate"
                    AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & UserId & "','" & UserId & "'," & IndentTransactionID & "," & JobBookingID & ",1,'" & UserId & "','" & DateTime.Now & "'"
                    str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)

                    If str <> "200" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If
                    db.ExecuteNonSQLQuery("UPDATE ItemTransactionMain Set JobBookingID = " & JobBookingID & ",JobBookingJobCardContentsID = (Select Top 1 JobBookingJobCardContentsID From ItemTransactionDetail Where TransactionID=" & IndentTransactionID & " AND CompanyID=" & CompanyId & ") Where TransactionID = " & IndentTransactionID & " And CompanyID = " & CompanyId & "")
                End If
                '''''''''''''''End

                '''''''''''''' Save Auto Allocated Picklist
                If TblItemPickListMainData.length > 0 Then
                    IndentPrefix = "IPIC"
                    IndentVoucherNo = db.GeneratePrefixedNo("ItemTransactionMain", IndentPrefix, "MaxVoucherNo", MaxVoucherNo, FYear, " Where VoucherPrefix='" & IndentPrefix & "' And  CompanyID=" & CompanyId & " And FYear='" & FYear & "' And VoucherID=-17")

                    TableName = "ItemTransactionMain"
                    AddColName = "CreatedDate,UserID,CompanyID,FYear,CreatedBy,VoucherID,VoucherPrefix,JobBookingID,Particular"
                    AddColValue = "'" & DateTime.Now & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & UserId & "',-17,'" & IndentPrefix & "'," & JobBookingID & ",'JOBCARD PICKLIST'"

                    TblObj = New DataTable
                    db.ConvertObjectToDatatable(TblItemPickListMainData, TblObj, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If
                    'TblObj = TblObj.DefaultView.ToTable(True, "DepartmentID", "TotalQuantity", "OperationID", "PlanContName", "PlanContentType")

                    PlanContName = ""
                    TblObj.Columns.Add("MaxVoucherNo")
                    TblObj.Columns.Add("VoucherNo")
                    For i = 0 To TblObj.Rows.Count - 1
                        If TblObj.Rows(i)("PlanContName") <> PlanContName And i > 0 Then
                            IndentVoucherNo = Replace(IndentVoucherNo, MaxVoucherNo, MaxVoucherNo + i)
                            MaxVoucherNo = MaxVoucherNo + i
                        End If
                        TblObj.Rows(i)("VoucherNo") = IndentVoucherNo
                        TblObj.Rows(i)("MaxVoucherNo") = MaxVoucherNo

                        PlanContName = TblObj.Rows(i)("PlanContName")
                    Next

                    IndentTransactionID = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)

                    If IsNumeric(IndentTransactionID) = False Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If

                    TblObj = New DataTable
                    TblObj.Clear()
                    TableName = "ItemTransactionDetail"
                    db.ConvertObjectToDatatable(TblItemPickListDetailData, TblObj, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If

                    TblObj.Columns.Add("TransactionID")
                    For index = 0 To TblObj.Rows.Count - 1
                        TblObj.Rows(index)("TransactionID") = db.GetColumnValue("MAX(TransactionID) As TransactionID", "ItemTransactionMain", "VoucherID=-17 And IsDeletedTransaction=0 And CompanyID=" & CompanyId & " And PlanContentType='" & TblObj.Rows(index)("PlanContentType") & "' And PlanContName='" & TblObj.Rows(index)("PlanContName") & "' And JobBookingID=" & JobBookingID & "", " TransactionID Desc")

                        db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & CompanyId & "," & TblObj.Rows(index)("TransactionID") & ",0")
                    Next

                    AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,JobBookingID"
                    AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & UserId & "','" & CompanyId & "','" & FYear & "','" & UserId & "','" & UserId & "'," & JobBookingID & "" ''" & IndentTransactionID & "',
                    str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "JobBookingJobCardContents", "JobBookingJobCardContentsID", "JobBookingJobCardContentsID", WhereCndtn)

                    If str <> "200" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If
                    db.ExecuteNonSQLQuery("UPDATE ItemTransactionMain Set JobBookingID = " & JobBookingID & ",JobBookingJobCardContentsID = (Select Top 1 JobBookingJobCardContentsID From ItemTransactionDetail Where TransactionID=" & IndentTransactionID & " AND CompanyID=" & CompanyId & ") Where TransactionID = " & IndentTransactionID & " And CompanyID = " & CompanyId & "")
                End If

                ''''''''''''''End Auto pick list

                Dim dt As New DataTable
                db.ConvertObjectToDatatable(TblBooking, dt, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                db.ExecuteNonSQLQuery("UPDATE JobOrderBookingDetails Set IsBooked = 1,PONo='" & dt.Rows(0)("PONo") & "',PODate='" & dt.Rows(0)("PODate") & "',DeliveryDate='" & dt.Rows(0)("DeliveryDate") & "',ModifiedBy=" & UserId & ",ModifiedDate=Getdate() Where OrderBookingID = " & dt.Rows(0)("OrderBookingID") & " And OrderBookingDetailsID = " & dt.Rows(0)("OrderBookingDetailsID") & " And CompanyID = " & CompanyId & " ")

                For index = 0 To TblObjCont.Rows.Count - 1
                    str = db.ExecuteNonSQLQuery("EXEC UpdateQtyJcProcess '" & TblObjCont.Rows(index)("JobCardContentNo") & "' , " & CompanyId)
                    If str.Contains("Error:") Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If
                Next
                db.ExecuteNonSQLQuery("Update JobBooking Set IsBooked=1 Where BookingID = " & TblBooking(0)("BookingID"))

                updateTransaction.Complete()
            End Using

            Return JobBookingNo
        Catch ex As Exception
            Return "Error:500," & ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavejobcardSchedule(ByVal JobCardMain As Object, ByVal JobcardContents As Object, ByVal JObCardSchedule As Object, ByVal ProcessArr As Object, ByVal FlagEdit As Boolean, ByVal JobcardId As Int16) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))

            Dim JobBookingNo As String = ""
            Dim MaxJobBookingNo As Long
            Dim IndentTransactionID As Long = 0
            Dim IndentVoucherNo As String
            Dim IndentPrefix As String = "IND"
            Dim MaxVoucherNo As Long = 0
            Dim DTValid As New DataTable

            Dim AddColName = "", AddColValue = "", TableName As String = ""
            If FlagEdit = True Then

                If db.CheckAuthories("JobCardSchedule.aspx", UserId, CompanyId, "CanEdit") = False Then
                    Return "You are not authorized to update job card..!"
                End If

                str = "Select IsRelease From JobBookingJobCardContents Where IsDeletedTransaction=0 And Isnull(IsRelease,0)=1 And JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    Return "You can not Modify the Job, Job is scheduled"
                End If

                'str = "Select JobBookingID From JobScheduleRelease Where IsDeletedTransaction=0 And JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId
                'db.FillDataTable(dataTable, str)
                'If dataTable.Rows.Count > 0 Then
                '    Return "You can not Modify the Job, Job is scheduled"
                'End If

                'dataTable = New DataTable()
                'db.ConvertObjectToDatatable(TblItemPickListDetailData, dataTable)
                'For i = 0 To dataTable.Rows.Count - 1
                '    If db.IsDeletable("PicklistTransactionID", "ItemPicklistReleaseDetail", " Where JobBookingID=" & JobBookingID & " And CompanyID=" & CompanyId & " And ItemID=" & dataTable.Rows(i)("ItemID") & " And IsDeletedTransaction=0") = False Then
                '        Return "You can not Modify the Job, Item is released, please delete all transactions.."
                '    End If
                'Next
                'dataTable = New DataTable()
            Else
                If db.CheckAuthories("JobCardSchedule.aspx", UserId, CompanyId, "CanSave") = False Then
                    Return "You are not authorized to save job card..!"
                End If
            End If

            Using updateTransaction As New Transactions.TransactionScope

                TableName = "JobBookingJobCard"
                If FlagEdit = "False" Or FlagEdit = False Then
                    JobBookingNo = db.GeneratePrefixedNo(TableName, "J", "MaxJobBookingNo", MaxJobBookingNo, FYear, " Where CompanyID = " & CompanyId & " And FYear='" & FYear & "' AND Isnull(IsDeletedTransaction,0)=0")
                End If
                AddColName = "JobBookingNo,MaxJobBookingNo,CompanyID,CreatedBy,FYear,JobBookingDate,CreatedDate,ModifiedDate"
                AddColValue = "'" & JobBookingNo & "','" & MaxJobBookingNo & "','" & CompanyId & "'," & UserId & ",'" & FYear & "',getdate(),getdate(),getdate()"
                If FlagEdit = False Then
                    JobcardId = db.InsertDatatableToDatabase(JobCardMain, TableName, AddColName, AddColValue)
                Else
                    db.UpdateDatatableToDatabase(JobCardMain, TableName, "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", 1, " JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardProcess Where  JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardContentBookForms Where  JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardProcessMaterialRequirement Where  JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")
                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardColorDetails Where  JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")

                    Dim DTRecordDetail As New DataTable
                    db.FillDataTable(DTRecordDetail, "Select Distinct ItemID From ItemTransactionDetail Where IsDeletedTransaction=0 And JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId)

                    db.ExecuteNonSQLQuery("Delete From ItemTransactionDetail Where JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From ItemTransactionMain Where JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId)

                    For i = 0 To DTRecordDetail.Rows.Count - 1
                        db.ExecuteNonSQLQuery("EXEC UPDATE_ITEM_STOCK_VALUES " & CompanyId & ",0," & DTRecordDetail.Rows(i)("ItemID"))
                    Next

                    db.ExecuteNonSQLQuery("Delete From JobBookingJobCardFormWiseDetails Where  JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")
                End If
                If Val(JobcardId) <= 0 Then Return "Error:500"
                Dim TblObj, TblObjCont As New DataTable
                TableName = "JobBookingJobCardContents"
                If FlagEdit = True Then
                    For i = 0 To JobCardMain.length - 1
                        JobCardMain(i)("JobCardContentNo") = JobBookingNo & "[" & i + 1 & "_" & JobCardMain.length & "]"
                    Next
                    str = db.UpdateContentsDatatableToDatabase(JobcardContents, TableName, "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", "JobBookingJobCardContentsID", " JobBookingID=" & JobcardId & " And CompanyID=" & CompanyId & "")
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500 Contents updating- " & str
                    End If
                Else
                    db.ConvertObjectToDatatable(JobcardContents, TblObjCont, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500, Contents saving- " & str
                    End If

                    TblObjCont.Columns.Add("JobCardContentNo")
                    For i = 0 To TblObjCont.Rows.Count - 1
                        TblObjCont.Rows(i)("JobCardContentNo") = JobBookingNo & "[" & i + 1 & "_" & TblObjCont.Rows.Count & "]"
                    Next
                    AddColName = "JobBookingID,CreatedDate,CompanyId"
                    AddColValue = "'" & JobcardId & "',Getdate(),'" & CompanyId & "'"
                    str = db.InsertSecondaryDataJobCard(TblObjCont, TableName, AddColName, AddColValue, "", "", "")
                    If IsNumeric(str) = False Then
                        updateTransaction.Dispose()
                        Return "Error:500, Contents saving- " & str
                    End If
                End If

                AddColName = "JobCardID,ModifiedDate,CompanyId"
                AddColValue = "'" & JobcardId & "',Getdate(),'" & CompanyId & "'"

                TableName = "JobCardSchedule"
                str = db.InsertDatatableToDatabase(JObCardSchedule, TableName, AddColName, AddColValue)
                If Val(str) <= 0 Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                    'Else
                    '    Return "Success," + JobBookingNo
                End If
                '' Process
                AddColName = "JobbookingID,ModifiedDate,CompanyId"
                AddColValue = "'" & JobcardId & "',Getdate(),'" & CompanyId & "'"

                TableName = "JobbookingJobcardProcess"
                str = db.InsertDatatableToDatabase(ProcessArr, TableName, AddColName, AddColValue)
                If Val(str) <= 0 Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                    'Else
                    '    Return "Success," + JobBookingNo
                End If


                updateTransaction.Complete()
            End Using

            Return JobBookingNo
        Catch ex As Exception
            Return "Error:500," & ex.Message
        End Try
    End Function

    <WebMethod>
    Public Function UploadFileDetails() As String
        Dim httpPostedFile = HttpContext.Current.Request.Files("UserAttchedFiles")
        Try

            If httpPostedFile IsNot Nothing Then
                ' Get the complete file path
                Dim fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("/Files/JobCard/UserAttchedFiles/"), httpPostedFile.FileName)

                Dim fi As New FileInfo(fileSavePath)
                If (fi.Exists) Then    'if file exists, delete it
                    fi.Delete()
                End If
                ' Save the uploaded file to "UserAttachedFiles" folder
                httpPostedFile.SaveAs(fileSavePath)
            End If
            Return "Success"

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    ''**********************************************   Save Product Catalog   *****************************************************************

    ''' <summary>
    ''' Save data product catalog
    ''' </summary>
    ''' <param name="TblBooking">Main table job card </param>
    ''' <param name="TblPlanning">Contents data</param>
    ''' <param name="TblOperations">Process data</param>
    ''' <param name="TblContentForms">Book forms data</param>
    ''' <param name="FlagEdit">Insert or update flag</param>
    ''' <param name="ProductMasterCode">Product Master Code</param>
    ''' <param name="ObjMateRequire">Material requireent data on process or machine</param>
    ''' <returns></returns>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductCatalogData(ByVal TblBooking As Object, ByVal TblPlanning As Object, ByVal TblOperations As Object, ByVal TblContentForms As Object, ByVal FlagEdit As String, ByVal ProductMasterCode As String, ByVal JobBookingID As String, ByVal ObjMateRequire As Object, ByVal ObjInkData As Object) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
            If FlagEdit = False Then
                If db.CheckAuthories("ProductCatalog.aspx", UserId, CompanyId, "CanSave") = False Then Return "You are not authorized to save..!, Can't Save"
            Else
                If db.CheckAuthories("ProductCatalog.aspx", UserId, CompanyId, "CanEdit") = False Then Return "You are not authorized to update..!, Can't Update"
            End If

            Dim MaxProductMasterCode, RevisionNo As Long
            Dim AddColName = "", AddColValue = "", TableName As String = ""
            Dim ParentProductMasterCode As String = ProductMasterCode

            Using updateTransaction As New Transactions.TransactionScope

                TableName = "ProductMaster"
                'db.FillDataTable(dataTable, "Select OrderBookingID From JobOrderBookingDetails Where ProductMasterCode = '" & ParentProductMasterCode & "' And CompanyID = " & CompanyId)
                'If dataTable.Rows.Count > 0 Then
                '    FlagEdit = False
                'End If

                ProductMasterCode = db.GeneratePrefixedNo(TableName, "PC", "MaxProductMasterCode", MaxProductMasterCode, FYear, "Where CompanyId = " & CompanyId & " And FYear='" & FYear & "'")
                RevisionNo = db.GenerateMaxVoucherNo(TableName, "RevisionNo", "Where ParentProductMasterCode = '" & ParentProductMasterCode & "' And CompanyId = " & CompanyId)

                AddColName = "RevisionNo,ProductMasterCode,MaxProductMasterCode,CompanyId,CreatedBy,FYear,CreatedDate,ModifiedDate"
                AddColValue = "" & RevisionNo & ",'" & ProductMasterCode & "','" & MaxProductMasterCode & "','" & CompanyId & "'," & UserId & ",'" & FYear & "',getdate(),getdate()"

                If FlagEdit = False Then
                    JobBookingID = db.InsertDatatableToDatabase(TblBooking, TableName, AddColName, AddColValue)
                    db.ExecuteNonSQLQuery("Update ProductMaster Set ParentProductMasterCode='" & ParentProductMasterCode & "', ParentProductMasterID=(Select ProductMasterID From ProductMaster Where ProductMasterCode='" & ParentProductMasterCode & "' And CompanyID=" & CompanyId & ") Where ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                Else
                    ProductMasterCode = ParentProductMasterCode
                    str = db.UpdateContentsDatatableToDatabase(TblBooking, "ProductMaster", "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", "ProductMasterContentsID", " ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId & " ")
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error: Main" & str
                    End If

                    'db.ExecuteNonSQLQuery("Delete From ProductMasterContents Where  ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From ProductMasterProcess Where  ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From ProductMasterContentBookForms Where  ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From ProductMasterProcessMaterialRequirement Where  ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId)
                    db.ExecuteNonSQLQuery("Delete From JobBookingColorDetails Where  ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId)
                End If

                If IsNumeric(JobBookingID) = False Then
                    updateTransaction.Dispose()
                    Return "Error: Main" & JobBookingID
                End If

                Dim TblObj As New DataTable
                TableName = "ProductMasterContents"
                If FlagEdit = True Then
                    str = db.UpdateDatatableToDatabase(TblPlanning, TableName, "ModifiedDate = Getdate(),ModifiedBy =" & UserId & "", 1, " ProductMasterID=" & JobBookingID & " And CompanyID=" & CompanyId & "")
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error: Contents update" & str
                    End If
                Else
                    AddColName = "ProductMasterID,ProductMasterCode,CreatedDate,CompanyID,FYear"
                    AddColValue = "" & JobBookingID & ",'" & ProductMasterCode & "',Getdate()," & CompanyId & ",'" & FYear & "'"

                    db.ConvertObjectToDatatable(TblPlanning, TblObj, str)
                    If str <> "Success" Then
                        updateTransaction.Dispose()
                        Return "Error:500," & str
                    End If
                    TblObj.Columns.Add("ProductMasterContentNo")
                    For i = 0 To TblObj.Rows.Count - 1
                        TblObj.Rows(i)("ProductMasterContentNo") = ProductMasterCode & "[" & i + 1 & "_" & TblObj.Rows.Count & "]"
                    Next

                    str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "", "", "")
                    If str <> "200" Then
                        updateTransaction.Dispose()
                        Return "Error: Contents insert" & str
                    End If
                End If

                TblObj.Clear()
                TableName = "ProductMasterProcess"
                AddColName = "ProductMasterID,CreatedDate,CompanyID,FYear"
                AddColValue = "" & JobBookingID & ",Getdate()," & CompanyId & ",'" & FYear & "'"
                Dim WhereCndtn = " And ProductMasterID =" & JobBookingID & " And CompanyID=" & CompanyId & ""
                db.ConvertObjectToDatatable(TblOperations, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "ProductMasterContents", "ProductMasterContentsID", "ProductMasterContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error: Process" & str
                End If

                TblObj.Clear()
                TableName = "ProductMasterContentBookForms"
                db.ConvertObjectToDatatable(TblContentForms, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "ProductMasterContents", "ProductMasterContentsID", "ProductMasterContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error: Book Forms" & str
                End If

                TblObj.Clear()
                TableName = "ProductMasterProcessMaterialRequirement"
                db.ConvertObjectToDatatable(ObjMateRequire, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "ProductMasterContents", "ProductMasterContentsID", "ProductMasterContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error: Materials" & str
                End If

                TblObj.Clear()
                TableName = "JobBookingColorDetails"
                AddColName = "ProductMasterID,ProductMasterCode,CreatedDate,CompanyID,FYear"
                AddColValue = "" & JobBookingID & ",'" & ProductMasterCode & "',Getdate()," & CompanyId & ",'" & FYear & "'"
                db.ConvertObjectToDatatable(ObjInkData, TblObj, str)
                If str <> "Success" Then
                    updateTransaction.Dispose()
                    Return "Error:500," & str
                End If
                str = db.InsertSecondaryDataJobCard(TblObj, TableName, AddColName, AddColValue, "ProductMasterContents", "ProductMasterContentsID", "ProductMasterContentsID", WhereCndtn)
                If str <> "200" Then
                    updateTransaction.Dispose()
                    Return "Error: Color Details " & str
                End If
                db.ExecuteNonSQLQuery("Update JobApprovedCost Set IsProductMaster=1 Where BookingID=(Select BookingID From ProductMaster Where ProductMasterCode='" & ProductMasterCode & "' And CompanyID=" & CompanyId & ") And CompanyID=" & CompanyId & " ")

                updateTransaction.Complete()
            End Using
            Return ProductMasterCode
        Catch ex As Exception
            Return "Error: " & ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobCardData() As String
        Try
            Dim Dt As New DataTable
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "Select JOB.SalesOrderNo,convert(CHAR(30),JOB.OrderBookingDate, 106) OrderBookingDate,PQ.EstimateNo,EM.EnquiryNo, JBJC.JobBookingID,JBJC.JobBookingNo,JBJC.BookingID,convert(CHAR(30),JBJC.JobBookingDate, 106) JobBookingDate,JBJC.OrderBookingID, convert(CHAR(30),JBJC.PODate, 106) PODate,JBJC.PONo,JBJC.JobName as ProjectName,JBJC.ClientName,JBJC.LedgerID from JobBookingJobCard as JBJC inner join ProductQuotation as PQ on PQ.ProductEstimateID = JBJC.ProductEstimateID inner join EnquiryMain as EM on EM.EnquiryID = PQ.EnquiryID inner join JobOrderBooking as JOB on JBJC.OrderBookingID = JOB.OrderBookingID where JBJC.CompanyID =" & CompanyId & " and Isnull(JBJC.IsdeletedTransaction,0) <> 1 order by JBJC.JobBookingID desc"
            db.FillDataTable(dataTable, str)
            str = "Select JCS.ProcessIDStr,JCS.JobContentsID as ProductEstimationContentID, JCS.JobCardID AS JobBookingID,JCS.ProductType,LMV.LedgerName as VendorName,LMAV.LedgerName ScheduleVendorName, JCS.OrderBookingScheduleID,JCS.OrderBookingID,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106) ExpectedDeliveryDate,JCS.TotalAmount,JCS.NetAmount,JCS.SGSTTaxAmount,JCS.SGSTTaxPercentage,JCS.CGSTTaxAmount,JCS.CGSTTaxPercentage,JCS.IGSTTaxAmount,JCS.IGSTTaxPercentage,JCS.RateType,JCS.Rate,JCS.ScheduleQty as QTY,JCS.VendorID,JCS.ScheduleVendorId as AllocatedVendorID,JCS.CriticalRemark as CriticalInstructions,EM.LedgerName as JobCoordinator,EM.ledgerId as JobCoordinatorID  from JobCardSchedule as JCS inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId inner join LedgerMaster as EM on EM.LedgerID = JCS.JobCoordinatorID where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId
            db.FillDataTable(Dt, str)

            Dt.TableName = "JobcardSchedule"
            dataTable.TableName = "JobcardMain"

            Dim dataset As New DataSet
            dataset.Merge(Dt)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadSOContents(ByVal OrderbookingID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select JOBD.OrderBookingDetailsID,PQC.ProductDescription,PQC.PackagingDetails,PQC.DescriptionOther, JOBD.ProductEstimationContentID, Isnull(PQC.ProcessIDStr,'') as ProcessIDStr ,PQC.ProductEstimateID, JOBD.CGSTTaxPercentage,JOBD.CGSTTaxAmount,JOBD.SGSTTaxAmount,JOBD.SGSTTaxPercentage,JOBD.IGSTTaxAmount,JOBD.IGSTTaxPercentage,LM.LedgerName as VendorName ,JOBD.ConsigneeID ,JOBD.SalesEmployeeID,JOBD.ProductHSNID,JOBD.VendorID,JOBD.BookingNo,JOBD.OrderBookingId, JOBD.CategoryID,JOBD.ProductHSNID,JOBD.ProductCode,JOBD.JobCoordinatorID, JOBD.JobName as ProductName,OrderQuantity,JOBD.Rate,JOBD.RateType,JobType,JobReference,JobPriority,convert(varchar,JOBD.ExpectedDeliveryDate,106) as ExpectedDeliveryDate,JOBD.NetAmount,JOBD.FinalCost,JOBD.DispatchRemark,JOBD.MiscAmount,JOBD.GSTAmount from JobOrderBookingDetails as JOBD inner join LedgerMaster as LM on LM.LedgerID = JOBD.VendorID INNER join ProductQuotationContents as PQC on PQC.ProductEstimationContentID = JOBD.ProductEstimationContentID where isnull(JOBD.IsDeletedTransaction,0) <> 1 and JOBD.CompanyID =" & CompanyId & " And JOBD.OrderbookingId = " & OrderbookingID

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteJC(ByVal JCID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
            Dim KeyField As String = ""

            If db.CheckAuthories("jobcardSchedule.aspx", UserId, CompanyId, "CanDelete") = False Then Return "You are not authorized to delete..!, Can't Delete"

            If db.IsDeletable("JobBookingID", "ServicePOMain", "Where CompanyID = " & CompanyId & " And Isnull(IsdeletedTransaction,0) = 0 And JobBookingID = " & JCID & "") = False Then
                KeyField = "PO already generated, can't delete this JC "
                Return KeyField
                Exit Function
            End If

            str = "Update Jobbookingjobcard set Isdeletedtransaction= 1 where companyid=" & CompanyId & " and Jobbookingid=" & JCID & "; Update JobBookingJobCardContents set Isdeletedtransaction= 1 where companyid=" & CompanyId & " and Jobbookingid=" & JCID & "; Update JobBookingJobCardProcess set Isdeletedtransaction= 1 where companyid=" & CompanyId & " and Jobbookingid=" & JCID & "; Update JobcardSchedule set Isdeletedtransaction= 1 where companyid=" & CompanyId & " and JObcardID=" & JCID & ";"

            Return db.ExecuteNonSQLQuery(str)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RecycleProductCatalog(ByVal PCNo As String, ByVal PCId As Integer) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
        Dim KeyField As String
        Try
            If db.IsDeletable("BookingID", "JobOrderBookingDetails", "Where CompanyID = " & CompanyId & " And ProductMasterID = " & PCId & "") = False Then
                KeyField = "Order Booked"
                Return KeyField
                Exit Function
            End If
            If db.IsDeletable("BookingID", "JobBookingJobCard", "Where CompanyID = " & CompanyId & " And ProductMasterID = " & PCId & "") = False Then
                KeyField = "Production Work Order"
                Return KeyField
                Exit Function
            End If
            If db.CheckAuthories("ProductCatalog.aspx", UserId, CompanyId, "CanDelete") = False Then Return "You are not authorized to delete..!, Can't Delete"

            Using updateTransaction As New Transactions.TransactionScope
                KeyField = db.ExecuteNonSQLQuery("Update ProductMaster Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterCode = '" & PCNo & "' And ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update ProductMasterContents Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterCode = '" & PCNo & "' And ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update ProductMasterProcess Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update ProductMasterContentBookForms Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update ProductMasterProcessMaterialRequirement Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingColorDetails Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where ProductMasterID = " & PCId & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobApprovedCost Set IsProductMaster=0 Where BookingID=(Select Top 1 BookingID From ProductMaster Where ProductMasterID=" & PCId & " And CompanyID=" & CompanyId & ") And CompanyID=" & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                updateTransaction.Complete()
                KeyField = "Success"
            End Using
        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RecycleProductionWorkOrder(ByVal JCNo As String, ByVal JobBookingID As Integer) As String

        Dim KeyField As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
            If db.CheckAuthories("ProductionWorkOrder.aspx", UserId, CompanyId, "CanDelete") = False Then Return "You are not authorized to delete..!, Can't Delete"

            If db.IsDeletable("BookingID", "JobBookingJobCard", "Where IsDeletedTransaction=0 And JobStart=1 And JobBookingNo = '" & JCNo & "' And CompanyID = " & CompanyId & " And JobBookingId = " & JobBookingID & "") = False Then
                Return "You can not delete the Job, Job is started"
            End If
            If db.IsDeletable("IsRelease", "JobBookingJobCardContents", "Where IsDeletedTransaction=0 And Isnull(IsRelease,0)=1 And CompanyID = " & CompanyId & " And JobBookingId = " & JobBookingID & "") = False Then
                Return "You can not delete the Job, Job is released"
            End If
            If db.IsDeletable("JobBookingID", "JobScheduleRelease", "Where IsDeletedTransaction=0 And CompanyID = " & CompanyId & " And JobBookingId = " & JobBookingID & "") = False Then
                Return "You can not delete the Job, Job is released"
            End If
            If db.IsDeletable("JobBookingID", "MachineProductionEntry", "Where IsDeletedTransaction=0 And CompanyID = " & CompanyId & " And JobBookingId = " & JobBookingID & "") = False Then
                Return "You can not delete the Job, Production is start"
            End If

            Using updateTransaction As New Transactions.TransactionScope
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCard Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingNo = '" & JCNo & "' And JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCardContents Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCardProcess Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCardContentBookForms Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCardProcessMaterialRequirement Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingColorDetails Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingId = " & JobBookingID & " And CompanyId = " & CompanyId & " ")

                If KeyField <> "Success" Then
                    Return KeyField
                End If
                KeyField = db.ExecuteNonSQLQuery("Update JobBookingJobCardFormWiseDetails Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingID = " & JobBookingID & " And CompanyID = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If

                KeyField = db.ExecuteNonSQLQuery("UPDATE JobOrderBookingDetails Set IsBooked = 0,ModifiedDate=Getdate() Where OrderBookingDetailsID = (SELECT OrderBookingDetailsID FROM JobBookingJobCard Where JobBookingNo = '" & JCNo & "' And CompanyID = " & CompanyId & " And JobBookingId = " & JobBookingID & ") And CompanyId = " & CompanyId & " ")
                If KeyField <> "Success" Then
                    Return KeyField
                End If

                KeyField = db.ExecuteNonSQLQuery("Update ItemTransactionMain Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingID = " & JobBookingID & " And CompanyId = " & CompanyId & " ")

                If KeyField <> "Success" Then
                    Return KeyField
                End If

                KeyField = db.ExecuteNonSQLQuery("Update ItemTransactionDetail Set IsDeletedTransaction=1,DeletedBy=" & UserId & ",DeletedDate=getdate() Where JobBookingID = " & JobBookingID & " And CompanyId = " & CompanyId & " ")

                updateTransaction.Complete()
                KeyField = "Success"
            End Using
        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    ''****************************** Send Indent validation  *****************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckStockJobCard(ByVal PaperId As Integer, ByVal JobBKID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "Select Isnull(Sum(PhysicalStock),0) As StockInSheets From ItemMaster Where ItemID = " & PaperId & " And CompanyId = " & CompanyId & " "
            db.FillDataTable(dataTable, str)

            str = "Select Isnull(A.IsIndentSent,'False') As IsIndentSent,UM.UserName As IndentSentBy From JobBookingJobcardContents As A Inner Join UserMaster As UM On UM.UserID=A.IndentSentBy And UM.CompanyID=A.CompanyID Where Isnull(A.IsIsDeletedTransaction,0)=0 And A.JobBookingID  = " & JobBKID & " And CompanyId =  " & CompanyId & "    "
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ValidateSendIndent(ByVal PaperId As Integer, ByVal JobBKID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "Select Isnull(A.IsIndentSent,'False') As IsIndentSent,UM.UserName As IndentSentBy From JobBookingJobcardContents As A Inner Join UserMaster As UM On UM.UserID=A.IndentSentBy And UM.CompanyID=A.CompanyID Where Isnull(A.IsIsDeletedTransaction,0)=0 And A.PaperID=" & PaperId & " And A.JobBookingID  = " & JobBKID & " And A.CompanyId =  " & CompanyId & "    "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadIndentGridData(ByVal PaperId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            '            str = "SELECT Distinct PaperID, Quality, GSM, Manufecturer As Mill, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, SizeW, SizeL, Caliper, ItemCode, IsNull(EstimationUnit,'') As EstimationUnit,PurchaseUnit From (Select Distinct [ItemID] As PaperID,IMD.ItemGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From ItemMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.ItemGroupID And IMD.CompanyID=IG.CompanyID And IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1  And Isnull(IMD.IsDeletedTransaction,0)<>1 Where IMD.ItemID= " & PaperId & " And IMD.CompanyId = " & CompanyId & " )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Quality], [GSM], [Manufecturer], [PackingType], [UnitPerPacking], [WtPerPacking], [EstimationRate], [Finish], [SizeW], [SizeL], [Caliper], [ItemCode], [EstimationUnit],[PurchaseUnit])) P "
            str = "SELECT IM.ItemID,IM.ItemCode, IM.ItemName,  IM.UnitPerPacking,IM.FloorStock,IM.IncomingStock,IM.AllocatedStock,IM.BookedStock,IM.IndentStock, '' AS ReqdSize, '' AS DieSize, '' AS Ups, '' AS WstPersent, '' AS PlanType  FROM ItemTransactionDetail As ITD INNER JOIN ItemMaster As IM ON IM.ItemID=ITD.ItemID And IM.CompanyID=ITD.CompanyID  And Isnull(IM.IsDeletedTransaction,0)=Isnull(ITD.IsDeletedTransaction,0) And ISNULL(ITD.JobBookingID,0)<>0 INNER JOIN ItemTransactionMain As ITM On ITM.TransactionID=ITD.TransactionID And ITM.CompanyID=ITD.CompanyID And Isnull(ITM.IsDeletedTransaction,0)=Isnull(ITD.IsDeletedTransaction,0)  INNER JOIN (Select Distinct JobBookingID From JobBookingJobCardProcess Where Isnull(Status,'In Queue')<>'Complete' And CompanyID=" & CompanyId & ") AS JCP ON JCP.JobBookingID=ITD.JobBookingID Where /*ITM.VoucherID=-8 And*/ Isnull(ITM.IsDeletedTransaction,0)=0 And IM.ItemID=" & PaperId & " And ITM.CompanyID=" & CompanyId & " Order by IM.SizeW"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadItemsList() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            '            str = "SELECT Distinct PaperID, Quality, GSM, Manufecturer As Mill, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, SizeW, SizeL, Caliper, ItemCode, IsNull(EstimationUnit,'') As EstimationUnit,PurchaseUnit From (Select Distinct [ItemID] As PaperID,IMD.ItemGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From ItemMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.ItemGroupID And IMD.CompanyID=IG.CompanyID And IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1  And Isnull(IMD.IsDeletedTransaction,0)<>1 Where IMD.ItemID= " & PaperId & " And IMD.CompanyId = " & CompanyId & " )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Quality], [GSM], [Manufecturer], [PackingType], [UnitPerPacking], [WtPerPacking], [EstimationRate], [Finish], [SizeW], [SizeL], [Caliper], [ItemCode], [EstimationUnit],[PurchaseUnit])) P "
            str = "Select Distinct IM.ItemID,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,IM.ItemGroupID,IGM.ItemGroupNameID,IM.ItemSubGroupID,Nullif(IMQ.FieldValue,'') As Quality,Isnull(Nullif(IMG.FieldValue,''),0) As GSM,Isnull(IM.SizeW,0) AS SizeW,Isnull(Nullif(IML.FieldValue,''),0) As SizeL,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockUnit,'') AS StockUnit,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Nullif(IM.EstimationUnit,'') AS EstimationUnit,Isnull(IM.EstimationRate,0) As Rate,Isnull(IM.PhysicalStock,0) AS PhysicalStock,Isnull(IM.FloorStock,0) AS FloorStock,Isnull(IM.IncomingStock,0) AS IncomingStock,Isnull(IM.AllocatedStock,0) AS AllocatedStock,Isnull(IM.BookedStock,0) AS BookedStock,Isnull(IM.IndentStock,0) AS IndentStock,Nullif(IM.PurchaseUnit,'') AS PurchaseUnit,Isnull(IM.LastPurchaseRate,0) AS LastPORate  " &
                  " From ItemMaster As IM Inner Join ItemGroupMaster As IGM On IM.ItemGroupID=IGM.ItemGroupID And IM.CompanyID=IGM.CompanyID  Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='Quality' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMQ On IM.ItemID=IMQ.ItemID And IM.CompanyID=IMQ.CompanyID Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='GSM' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMG On IM.ItemID=IMG.ItemID And IM.CompanyID=IMG.CompanyID Left Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='SizeL' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IML On IM.ItemID=IML.ItemID And IM.CompanyID=IML.CompanyID " &
                  " Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='SizeW' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMW On IM.ItemID=IMW.ItemID And IM.CompanyID=IMW.CompanyID " &
                  " Left Join ItemSubGroupMaster As ISGM On IM.ItemSubGroupID=ISGM.ItemSubGroupID And IM.CompanyID=ISGM.CompanyID " &
                  " Where IGM.ItemGroupNameID IN (-1,-2) And IM.CompanyId =" & CompanyId & " Order By ItemCode"
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Dim lcljs As New JavaScriptSerializer With {
                .MaxJsonLength = 2147483647
            }
            Return lcljs.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadIndentItemsList(ByVal GblJobBookingID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            'str = "Select Distinct IM.ItemID,IM.ItemCode,IM.ItemName,IM.StockUnit,IM.UnitPerPacking,IM.WtPerPacking,IM.EstimationUnit,IM.FloorStock,IM.IncomingStock,IM.AllocatedStock,IM.BookedStock,IM.IndentStock From ItemMaster As IM Inner Join ItemGroupMaster As IGM On IM.ItemGroupID=IGM.ItemGroupID And IM.CompanyID=IGM.CompanyID " &
            '      " Where IGM.ItemGroupNameID In (-1,-2) And IM.CompanyId = " & CompanyId

            'str = "Select Distinct IM.ItemID,IM.ItemCode,IM.ItemGroupID,IGM.ItemGroupNameID,IMQ.FieldValue As Quality,IMG.FieldValue As GSM,IM.SizeW,IML.FieldValue As SizeL,IM.ItemName,IM.StockUnit,IM.UnitPerPacking,IM.WtPerPacking,IM.EstimationUnit,IM.FloorStock,IM.IncomingStock,IM.AllocatedStock,IM.BookedStock,IM.IndentStock From ItemMaster As IM Inner Join ItemGroupMaster As IGM On IM.ItemGroupID=IGM.ItemGroupID And IM.CompanyID=IGM.CompanyID  Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='Quality' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMQ On IM.ItemID=IMQ.ItemID And IM.CompanyID=IMQ.CompanyID Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='GSM' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMG On IM.ItemID=IMG.ItemID And IM.CompanyID=IMG.CompanyID Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='SizeL' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IML On IM.ItemID=IML.ItemID And IM.CompanyID=IML.CompanyID And IGM.ItemGroupNameID IN (-1,-2) And IM.CompanyId =" & CompanyId


            str = "Select Distinct Isnull(JCM.SequenceNo,0) AS SequenceNo,IM.ItemID,IM.ItemGroupID,IGM.ItemGroupNameID,IM.ItemSubGroupID,Nullif(IM.ItemCode,'') AS ItemCode,Nullif(IGM.ItemGroupName,'') AS ItemGroupName,Nullif(ISGM.ItemSubGroupName,'') AS ItemSubGroupName,Nullif(IMQ.FieldValue,'') As Quality,Isnull(Nullif(IMG.FieldValue,''),0) As GSM,Case When Isnull(IM.SizeW,0) = 0 Then Isnull(IMW.FieldValue,0) Else Isnull(IM.SizeW,0) End AS SizeW,Isnull(Nullif(IML.FieldValue,''),0) As SizeL,Nullif(IM.ItemName,'') AS ItemName,Nullif(IM.StockUnit,'') AS StockUnit,Nullif('','') AS RequiredSize,Isnull(IM.UnitPerPacking,0) AS UnitPerPacking,Isnull(IM.WtPerPacking,0) AS WtPerPacking,Isnull(JCM.RequiredQty,0) AS FullSheets,ROUND((Isnull(JCM.RequiredQty,0)/Isnull(IM.UnitPerPacking,1)),3) AS IssuePacks,Case When IGM.ItemGroupNameID=-1 Then ROUND(((Isnull(JCM.RequiredQty,0)/Isnull(IM.UnitPerPacking,1))*Isnull(IM.WtPerPacking,0)),3) ELSE Isnull(JCM.RequiredQty,0) END AS TotalPaperWtInKG,Isnull(JCM.EstimatedQuantity,0) AS EstimatedQuantity,Isnull(JCM.Rate,0) AS Rate,Isnull(JCM.Amount,0) AS Amount,Nullif(IM.EstimationUnit,'') AS EstimationUnit,Isnull(IM.FloorStock,0) AS FloorStock,Isnull(IM.IncomingStock,0) AS IncomingStock,Isnull(IM.AllocatedStock,0) AS AllocatedStock,Isnull(IM.BookedStock,0) AS BookedStock,Isnull(IM.IndentStock,0) AS IndentStock,Isnull(IM.PhysicalStock,0) AS PhysicalStock,JCM.IsCreateIndent,JCM.IsCreatePickList,Isnull(JCM.PlanContQty,0) AS PlanContQty,Nullif(JCM.PlanContName,'') AS ContentName,Nullif(JCM.PlanContentType,'') AS PlanContentType " &
                  " From JobBookingJobCard AS JB Inner Join JobBookingJobCardContents AS JBC ON JBC.JobBookingID=JB.JobBookingID AND JBC.CompanyID=JB.CompanyID AND Isnull(JB.IsDeletedTransaction,0)=0 Inner Join JobBookingJobCardProcessMaterialRequirement AS JCM ON JCM.JobBookingID=JBC.JobBookingID AND JCM.JobBookingJobCardContentsID=JBC.JobBookingJobCardContentsID AND JCM.CompanyID=JBC.CompanyID Inner Join ItemMaster As IM ON IM.ItemID=JCM.ItemID AND IM.CompanyID=JCM.CompanyID Inner Join ItemGroupMaster As IGM On IM.ItemGroupID=IGM.ItemGroupID And IM.CompanyID=IGM.CompanyID Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='Quality' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMQ On IM.ItemID=IMQ.ItemID And IM.CompanyID=IMQ.CompanyID Inner Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='GSM' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMG On IM.ItemID=IMG.ItemID And IM.CompanyID=IMG.CompanyID Left Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='SizeL' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IML On IM.ItemID=IML.ItemID And IM.CompanyID=IML.CompanyID Left Join (Select ItemID,FieldValue,CompanyID From ItemMasterDetails Where FieldName='SizeW' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where ItemGroupNameID IN (-1,-2) And CompanyId = " & CompanyId & ")) As IMW On IM.ItemID=IMW.ItemID And IM.CompanyID=IMW.CompanyID Left Join ItemSubGroupMaster As ISGM On IM.ItemSubGroupID=ISGM.ItemSubGroupID And IM.CompanyID=ISGM.CompanyID  " &
                  " Where JCM.JobBookingID='" & GblJobBookingID & "' AND IGM.ItemGroupNameID IN (-1,-2) And IM.CompanyId =" & CompanyId & " Order By SequenceNo"
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Dim lcljs As New JavaScriptSerializer With {
                .MaxJsonLength = 2147483647
            }
            Return lcljs.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GenerateMaxVoucherNo() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = " select (Max(MaxVoucherNo) + 1) as VoucherNo from paperentry where voucherid = 46 And   CompanyId = " & CompanyId & " "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''**********************************************   Save PWO Item requisition  *****************************************************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveRequisitionJobcard(ByVal OBJSaveSendRequisition As Object, ByVal check As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName, VoucherNo As String
        AddColName = ""
        AddColValue = ""
        Dim TransactionId As Long = db.GenerateMaxVoucherNo("PaperEntry", "TransactionId", "Where CompanyId = " & CompanyId & " ")
        Dim MaxVoucherNo As Long = db.GenerateMaxVoucherNo("PaperEntry", "MaxVoucherNo", "Where VoucherId = 46 And CompanyId = " & CompanyId & "  ")
        str = "SELECT Prefix, Postfix FROM VoucherMaster WHERE VoucherId = 46 And CompanyID = " & CompanyId & " "
        db.FillDataTable(dt, str)
        VoucherNo = dt.Rows(0)(0) & "" & MaxVoucherNo & "" & dt.Rows(0)(1)

        Try
            db.ExecuteNonSQLQuery("Delete From PaperEntry Where TransactionId = '" & TransactionId & "' And CompanyId = " & CompanyId & " ")

            TableName = "PaperEntry"
            AddColName = "TransactionID,VoucherID,VoucherNo,MaxVoucherNo,FYear,CompanyID,UserID,ModifiedDate,VoucherDate,ProductionUnitID,IsGeneratePO,IsCompletePo"
            AddColValue = "'" & TransactionId & "', '" & 46 & "', '" & VoucherNo & "', '" & MaxVoucherNo & "', '" & FYear & "', '" & CompanyId & "', '" & UserId & "', '" & DateTime.Now & "', '" & DateTime.Now & "'," & "1" & "," & 0 & "," & 0
            'db.InsertDatatableToDatabaseForProcess(OBJSaveSendRequisition, TableName, AddColName, AddColValue)

            'db.DeleteUpdateRecordfromDBTable("UPDATE JobOrderBooking", " Set IsBooked = 1  where BookingId = " & dt.Rows(0)(0) & " And CompanyId = " & CompanyId & " ")

            KeyField = "Save"
        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    ''*****************************      Material Process Allocation List     ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridMaterialList(ByVal OPID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            'str = "Select Distinct IM.ItemID,IM.ItemGroupID,IGM.ItemGroupNameID,IM.ItemCode,IM.ItemName,IGM.ItemGroupName, (Select ItemSubGroupName From ItemSubGroupMaster Where ItemSubGroupID=IM.ItemSubGroupID And CompanyID=IM.CompanyID) AS ItemSubGroupName, IM.StockUnit,IM.PhysicalStock ,IGM.ItemConsumptionFormula, IM.FloorStock,Isnull(Nullif(IMD.Density,''),0) As Density, Nullif(IMD.ConversionFactor,'')  As ConversionFactor, Isnull(Nullif(IMD.NoOfLoop,''),0) As NoOfLoop,Isnull(Nullif(IMD.Pitch,''),0) As Pitch,Isnull(Nullif(IMD.SizeH,''),0) As SizeH,Isnull(Nullif(IMD.SizeL,''),0) As SizeL, Isnull(Nullif(IMD.SizeW,''),0) As SizeW,Isnull(Nullif(IMD.Thickness,''),0) As Thickness,IsNull(IM.PurchaseRate,0) As PurchaseRate,Isnull(IMD.EstimationRate,0) As Rate, IM.StockUnit,Isnull(Nullif(IMD.Caliper,''),0) As Caliper  From ItemMaster As IM Inner Join (SELECT Distinct ItemID,ItemGroupID,CompanyID, Density,ConversionFactor,NoOfLoop, Pitch,SizeH,SizeL,SizeW,Thickness,PurchaseRate,EstimationRate,StockUnit,Caliper From (Select Distinct ItemID,B.ItemGroupID,G.ItemGroupName,B.CompanyID,B.UserID, convert(CHAR(30),B.ModifiedDate, 106) AS [ModifiedDate],B.FYear,[FieldName],[FieldValue] From ItemMasterDetails As B  Inner Join ItemGroupMaster AS G On G.ItemGroupID=B.ItemGroupID And B.CompanyID=G.CompanyID And B.CompanyID=" & CompanyId & " And Isnull(G.IsDeletedTransaction,0)<>1  And Isnull(B.IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In " &
            '        " ([Density],[ConversionFactor],[NoOfLoop],[Pitch],[SizeH],[SizeL],[SizeW],[Thickness],[PurchaseRate],[EstimationRate],[StockUnit],[Caliper])) P) As IMD  On IM.ItemID=IMD.ItemID And IM.ItemGroupID=IMD.ItemGroupID And IM.CompanyID=IMD.CompanyID  INNER JOIN ItemGroupMaster As IGM On IGM.ItemGroupID=IM.ItemGroupID And IM.CompanyID=IGM.CompanyID And Isnull(IM.ItemName,'')<>'' Where IM.CompanyID = '" & CompanyId & "' And IM.ItemSubGroupID IN(Select Distinct ItemSubGroupID From MachineItemSubGroupAllocationMaster Where CompanyID='" & CompanyId & "' AND MachineID IN(Select Distinct MachineID From ProcessAllocatedMachineMaster Where CompanyID='" & CompanyId & "' AND ProcessID='" & OPID & "'))  Order By ItemGroupID,ItemName "
            str = "Select Distinct IM.ItemID,IM.ItemGroupID,IMD.ItemGroupNameID,IM.ItemCode,IM.ItemName,IMD.ItemGroupName, ISM.ItemSubGroupName, IM.StockUnit,IM.PhysicalStock ,IMD.ItemConsumptionFormula, IM.FloorStock,Isnull(Nullif(IMD.Density,''),0) As Density, Nullif(IMD.ConversionFactor,'')  As ConversionFactor,Isnull(Nullif(IMD.NoOfLoop,''),0) As NoOfLoop,Isnull(Nullif(IMD.Pitch,''),0) As Pitch,Isnull(Nullif(IMD.SizeH,''),0) As SizeH,Isnull(Nullif(IMD.SizeL,''),0) As SizeL,Isnull(Nullif(IMD.SizeW,''),0) As SizeW,Isnull(Nullif(IMD.Thickness,''),0) As Thickness,IsNull(IM.PurchaseRate,0) As PurchaseRate,Isnull(IMD.EstimationRate,0) As Rate, IM.StockUnit,Isnull(Nullif(IMD.Caliper,''),0) As Caliper " &
                   " From ItemMaster As IM Inner Join (SELECT Distinct ItemID,ItemGroupID,ItemGroupName,ItemGroupNameID,ItemConsumptionFormula,CompanyID, Density,ConversionFactor,NoOfLoop,Pitch,SizeH,SizeL,SizeW,Thickness,PurchaseRate,EstimationRate,StockUnit,Caliper From (Select Distinct ItemID,B.ItemGroupID,G.ItemGroupName,B.CompanyID,G.ItemGroupNameID,G.ItemConsumptionFormula,[FieldName],[FieldValue] From ItemMasterDetails As B Inner Join ItemGroupMaster AS G On G.ItemGroupID=B.ItemGroupID And B.CompanyID=G.CompanyID And B.CompanyID=" & CompanyId & " And Isnull(G.IsDeletedTransaction,0)<>1 And Isnull(B.IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Density],[ConversionFactor],[NoOfLoop],[Pitch],[SizeH],[SizeL],[SizeW],[Thickness],[PurchaseRate],[EstimationRate],[StockUnit],[Caliper])) P) As IMD " &
                   " On IM.ItemID=IMD.ItemID And IM.ItemGroupID=IMD.ItemGroupID And IM.CompanyID=IMD.CompanyID  And IM.IsDeletedTransaction=0 Inner Join ItemSubGroupMaster As ISM On ISM.ItemSubGroupID=IM.ItemSubGroupID And ISM.CompanyID=IM.CompanyID And IM.CompanyID = " & CompanyId & " Inner Join MachineItemSubGroupAllocationMaster As MIA On MIA.ItemSubGroupID=IM.ItemSubGroupID And MIA.CompanyID=IM.CompanyID Inner Join ProcessAllocatedMachineMaster As PAM On PAM.MachineID=MIA.MachineID And PAM.CompanyID=MIA.CompanyID And PAM.IsDeletedTransaction=0 And PAM.ProcessID=" & OPID & " Where MIA.MachineID Not In(Select MachineID From MachineMaster Where MachineName='OUTSOURCE') Order By ItemGroupID,ItemName "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    ''*****************************      Material Process Department Machines List     ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDepartmentMachines(ByVal OPID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "Select Distinct MachineName,MachineID From MachineMaster Where DepartmentID In (Select Distinct DepartmentID From ProcessMaster Where ProcessID=" & OPID & " And Isnull(IsDeletedTransaction,0)=0 And CompanyID = " & CompanyId & ") And Isnull(IsDeletedTransaction,0)=0 And CompanyID = " & CompanyId
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''*****************************      Shipper      ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridShipper(ByVal BookingId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "SELECT ShipperID, NULLIF(ShipperName, '') AS ShipperName, ShipperPackX, ShipperPackY, ShipperPackZ, ShipperPerBoxWt, TotalShipperQtyReq, ShipperPackQty FROM JobBooking Where BookingID = " & BookingId & " And CompanyId = " & CompanyId & " "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''*****************************      JC Form Wise      ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridJCFormWise(ByVal JobCardNO As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "SELECT JCFW.ContentName, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID WHERE (JCFW.JobBookingJobCardNo = '" & JobCardNO & "') And Isnull(JCFW.IsDetetedTransaction,0)=0 And JCFW.CompanyId = " & CompanyId & " "
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''*****************************      Load Job Coordinator      ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadJobCoordinators() As String
        Try

            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "SELECT [LedgerID] AS CoordinatorLedgerID,[LedgerName] As CoordinatorLedgerName FROM [LedgerMaster] Where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27) AND LedgerID IN (Select Distinct LedgerID From LedgerMasterDetails Where CompanyID=" & CompanyId & " AND FieldName='Designation' And FieldValue='JOB COORDINATOR' And IsDeletedTransaction=0) Order By [LedgerName]"
            ''str = "Select A.[LedgerID] AS CoordinatorLedgerID,A.LedgerName As CoordinatorLedgerName From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[DepartmentID] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[DepartmentID])) p) As A Where A.DepartmentID=-70"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''*****************************      Load Client wise Consignee      ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadLedgerConsignee(ByVal ClientID As Integer) As String
        Try

            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "Select LedgerID As LedgerConsigneeID,LedgerName As LedgerConsigneeName From LedgerMaster Where LedgerGroupID=4 And LedgerID In (Select LedgerID From LedgerMaster Where RefClientID=" & ClientID & " And IsDeletedTransaction=0 And CompanyId = " & CompanyId & ") And IsDeletedTransaction=0 And CompanyId = " & CompanyId & " Order By LedgerConsigneeName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''' <summary>
    ''' Call for ReLoad data of Product catalog Or Production work order Details
    ''' </summary>
    ''' <param name="BookingID">Booking Id</param>
    ''' <param name="ProdMasCode">Product Catalog Code</param>
    ''' <param name="JobCardNo">Production work order code</param>
    ''' <param name="Qty">Job or Product Quantity</param>
    ''' <returns></returns>
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ReloadProductContDetails(ByVal BookingID As Integer, ByVal ProdMasCode As String, ByVal JobCardNo As String, ByVal Qty As Integer) As String
        Try
            Dim DTContent, DTProcess, DTBookForms, DTMaterials, DTInkShades, DTJCBookFormsDetail As New DataTable
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If ProdMasCode = "" And JobCardNo = "" Then
                str = "Select Top 1 Isnull(Quantity,0),B.BookingID FROM ProductQuotationContents As A inner join ProductQuotation as B on b.ProductEstimateID = A.ProductEstimateID Where A.ProductEstimateID=" & BookingID & " AND A.CompanyId=" & CompanyId & " Order By ABS(Quantity-" & Qty & ")"
                db.FillDataTable(dataTable, str)
                If dataTable.Rows.Count > 0 Then
                    Qty = dataTable.Rows(0)(0)
                    BookingID = dataTable.Rows(0)(1)
                End If
                str = "SELECT Distinct JobContentsID, MachineID, MachineName, Gripper, GripperSide, MachineColors, PaperID, PaperSize, CutSize, CutL, CutW, UpsL, UpsW, TotalUps, BalPiece, BalSide, WasteArea, WastePerc, WastageKg, GrainDirection, PlateQty, PlateRate, PlateAmount, MakeReadyWastageSheet, ActualSheets, WastageSheets, TotalPaperWeightInKg, FullSheets, PaperRate, PaperAmount, PrintingImpressions, ImpressionsToBeCharged, PrintingRate, PrintingAmount, TotalMakeReadies, MakeReadyRate, MakeReadyAmount, FinalQuantity, TotalColors, TotalAmount, CutLH, CutHL, PrintingStyle, PrintingChargesType, ExpectedExecutionTime, TotalExecutionTime, MainPaperName, PlanType, PaperRateType, DieCutSize, InterlockStyle, NoOfSets, GrantAmount,GrantAmount As OldGrantAmount, Packing, UnitPerPacking, RoundofImpressionsWith, SpeColorFCharges, SpeColorBCharges, SpeColorFAmt, SpeColorBAmt, OpAmt, PlanID, PlanContQty, PlanContentType, PlanContName, ROW_NUMBER() OVER (ORDER BY JobContentsID) As SequenceNo, Nullif(ContentSizeValues,'') As ContentSizeValues, CoatingCharges, CoatingAmount, PaperGroup,(Select Distinct FieldValue From ItemMasterDetails Where FieldName='PurchaseUnit' And ItemID=JBC.PaperID And CompanyID=JBC.CompanyID ) As PurchaseUnit,NULL AS JobType,NULL As JobReference,NULL AS JobPriority,NULL As PlateType,JBC.UpsLayout,JBC.SheetLayout,NULL As UserAttachedPicture, NULL As AttachedFileName,NULL As SpecialInstructions,VendorID FROM JobBookingContents As JBC Inner Join JobBooking AS JB On JB.BookingID=JBC.BookingID And JB.CompanyID=JBC.CompanyID And Isnull(JB.IsDeletedTransaction,0)=0 And Isnull(JBC.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") And Isnull(JB.IsCancelled,0)=0 And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(ContentSizeValues,'')<>'' And JBC.PlanContQty=" & Qty & " And JB.CompanyID=" & CompanyId & " Order BY JobContentsID"
                db.FillDataTable(DTContent, str)

                str = "SELECT Distinct PM.ProcessID, PM.ProcessName, NULLIF (PMS.RateFactor, N'') AS RateFactor, JBC.Quantity, JBC.PlanID, JBC.PlanContQty, JBC.PlanContentType, JBC.PlanContName, ROUND(JBC.Rate, 3) AS Rate, JBC.Ups, JBC.NoOfPass,JBC.Pieces, JBC.NoOfStitch, JBC.NoOfLoops, JBC.NoOfColors, JBC.SizeL, JBC.SizeW, JBC.Amount, NULLIF (JBC.Remarks, N'') AS Remarks, JBC.SequenceNo, PM.MinimumCharges, PM.TypeofCharges, PM.SetupCharges,0 As PaperConsumptionRequired, ISNULL(PM.Rate, 0) AS MasterRate,PM.DepartmentID " &
                      " FROM JobBookingProcess  As JBC INNER JOIN JobBooking AS JB On JB.BookingID=JBC.BookingID  And Isnull(JB.IsDeletedTransaction,0)=0 And JBC.CompanyID=JB.CompanyID INNER JOIN ProcessMaster AS PM On PM.ProcessID=JBC.ProcessID And JBC.CompanyID=PM.CompanyID LEFT JOIN ProcessMasterSlabs As PMS On PMS.ProcessID= PM.ProcessID And JBC.RateFactor=PMS.RateFactor WHERE (JB.BookingID = " & BookingID & ") And Isnull(JB.IsCancelled,0)=0 And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(PM.ProcessPurpose,'Both')<>'Estimate' And Isnull(PM.IsDeletedTransaction,0)=0 And JBC.PlanContQty=" & Qty & " And JB.CompanyID=" & CompanyId & " Order By SequenceNo "
                db.FillDataTable(DTProcess, str)

                str = "SELECT Distinct JobContentBookFormsID,PlanContQty, PlanContentType, PlanContName, Forms, Sets, Pages, Sheets, ImpressionsPerSet, FormsInPoint, ImprsToChargedPerSet, BasicRate, SlabRate, RateType, Amount, WastagePercentSheet, PlateRate, PlanID FROM JobBookingContentBookForms  As JBC INNER JOIN JobBooking AS JB On JB.BookingID=JBC.BookingID And Isnull(JB.IsDeletedTransaction,0)=0 " &
                      " WHERE (JB.BookingID = " & BookingID & ") And Isnull(JB.IsCancelled,0)=0 And Isnull(JB.IsEstimate,0)=1 And JB.QuoteType ='Job Costing' And Isnull(JBC.IsDeletedTransaction,0)=0 And JBC.PlanContQty=" & Qty & " And JB.CompanyID=" & CompanyId & " Order By JobContentBookFormsID"
                db.FillDataTable(DTBookForms, str)

                ''''Comment By Minesh Jain ON 23-May-2019 All booked materials included paper and reel also
                'str = "SELECT JBMR.BookingID, JBMR.MachineID, JBMR.ProcessID, JBMR.ItemID,  JBMR.SequenceNo, JBMR.PlanContName, JBMR.PlanContentType, JBMR.PlanContQty, JBMR.RequiredQty, JBMR.Rate, JBMR.Amount, PM.ProcessName, IM.ItemCode, IM.ItemName, MM.MachineName FROM JobBookingProcessMaterialRequirement AS JBMR INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JBMR.ProcessID AND PM.CompanyID = JBMR.CompanyID And PM.CompanyID=" & CompanyId & " And JBMR.IsDeletedTransaction=0 INNER JOIN ItemMaster AS IM ON JBMR.ItemID = IM.ItemID AND JBMR.CompanyID = IM.CompanyID INNER JOIN MachineMaster AS MM ON JBMR.MachineID = MM.MachineId AND JBMR.CompanyID = MM.CompanyID Where JBMR.BookingID = " & BookingID & " And JBMR.PlanContQty=" & Qty & " Order By SequenceNo"

                str = "SELECT JBMR.BookingID, JBMR.MachineID, JBMR.ProcessID, JBMR.ItemID,IGM.ItemGroupID,IGM.ItemGroupNameID, JBMR.SequenceNo, JBMR.PlanContName, JBMR.PlanContentType, JBMR.PlanContQty, JBMR.RequiredQty,JBMR.RequiredQtyUnit AS StockUnit,JBMR.Rate, JBMR.Amount, PM.ProcessName, IM.ItemCode,IGM.ItemGroupName, IM.ItemName, MM.MachineName,IM.EstimationUnit,IM.UnitPerPacking,IM.WtPerPacking,'' As RequiredSize,0 As FullSheets,0 As TotalPaperWtInKG,0 As IssuePacks,Isnull(IM.PhysicalStock,0) AS PhysicalStock,IMD.FieldValue As SizeW,IMG.FieldValue As GSM " &
                      " FROM JobBookingProcessMaterialRequirement AS JBMR INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JBMR.ProcessID And PM.CompanyID = JBMR.CompanyID And PM.CompanyID=" & CompanyId & " And JBMR.IsDeletedTransaction=0 INNER JOIN ItemMaster AS IM ON JBMR.ItemID = IM.ItemID And JBMR.CompanyID = IM.CompanyID AND IM.IsDeletedTransaction = 0 INNER JOIN ItemMasterDetails AS IMD ON IM.ItemID = IMD.ItemID AND IM.CompanyID = IMD.CompanyID And IMD.FieldName='SizeW' AND IMD.IsDeletedTransaction = 0  INNER JOIN ItemMasterDetails AS IMG ON IM.ItemID = IMG.ItemID AND IM.CompanyID = IMG.CompanyID And IMG.FieldName='GSM' AND IMG.IsDeletedTransaction = 0 INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID And IGM.CompanyID = IM.CompanyID INNER JOIN MachineMaster AS MM ON JBMR.MachineID = MM.MachineId And JBMR.CompanyID = MM.CompanyID Where JBMR.BookingID = " & BookingID & " And JBMR.PlanContQty=" & Qty & "" &
                      " UNION ALL SELECT JBMR.BookingID, JBMR.MachineID, 0 AS ProcessID, IM.ItemID,IGM.ItemGroupID,IGM.ItemGroupNameID, JBMR.SequenceNo, JBMR.PlanContName, JBMR.PlanContentType, JBMR.PlanContQty, JBMR.FullSheets AS RequiredQty,IM.StockUnit,JBMR.PaperRate AS Rate, JBMR.PaperAmount AS Amount, NULL AS ProcessName, IM.ItemCode,IGM.ItemGroupName, IM.ItemName, MM.MachineName,IM.EstimationUnit,IM.UnitPerPacking,IM.WtPerPacking,JBMR.CutSize As RequiredSize,JBMR.FullSheets,JBMR.TotalPaperWeightInKg As TotalPaperWtInKG,JBMR.FullSheets As IssuePacks,Isnull(IM.PhysicalStock,0) AS PhysicalStock,IMD.FieldValue As SizeW,IMG.FieldValue As GSM " &
                      " FROM JobBookingContents AS JBMR INNER JOIN ItemMaster AS IM ON JBMR.PaperID = IM.ItemID And JBMR.CompanyID = IM.CompanyID And JBMR.IsDeletedTransaction=0 AND IM.IsDeletedTransaction = 0 INNER JOIN ItemMasterDetails AS IMD ON IM.ItemID = IMD.ItemID AND IM.CompanyID = IMD.CompanyID And IMD.FieldName='SizeW' AND IMD.IsDeletedTransaction = 0 INNER JOIN ItemMasterDetails AS IMG ON IM.ItemID = IMG.ItemID AND IM.CompanyID = IMG.CompanyID And IMG.FieldName='GSM' AND IMG.IsDeletedTransaction = 0 INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID And IGM.CompanyID = IM.CompanyID INNER JOIN MachineMaster AS MM ON JBMR.MachineID = MM.MachineId And JBMR.CompanyID = MM.CompanyID Where JBMR.BookingID = " & BookingID & " And JBMR.PlanContQty=" & Qty & " AND JBMR.CompanyID=" & CompanyId & " Order By SequenceNo"
                db.FillDataTable(DTMaterials, str)
                ''''''''End
                str = "Select Distinct SequenceNo,BookingID,ProductMasterCode,ProductMasterContentsID,ContentsID,PlanContName,PlanContentType, PlanContQty,ItemGroupID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingColorDetails Where CompanyId = " & CompanyId & " And BookingID = " & BookingID & " And PlanContQty=" & Qty & " Order By SequenceNo"
                db.FillDataTable(DTInkShades, str)

                str = "SELECT JCFW.PlanContName,0 As PlanContQty,'' As PlanContentType, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID ,JCFW.TransID,0 As ActualSheets,0 As WasteSheets FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID And MM.CompanyID=JCFW.CompanyID WHERE (JCFW.JobBookingJobCardNo = '" & JobCardNo & "') And JCFW.CompanyID = " & CompanyId & " And Isnull(JCFW.IsDeletedTransaction,0)=0 And JCFW.BookingID = " & BookingID & " Order By TransID"
                db.FillDataTable(DTJCBookFormsDetail, str)
            ElseIf JobCardNo = "" And ProdMasCode <> "" Then
                str = "SELECT JBC.ProductMasterContentsID ,MachineID, MachineName, Gripper, GripperSide, MachineColors, PaperID, PaperSize, CutSize, CutL, CutW, UpsL, UpsW, TotalUps, BalPiece, BalSide, WasteArea, WastePerc, WastageKg, GrainDirection, PlateQty, PlateRate, PlateAmount, MakeReadyWastageSheet, ActualSheets, WastageSheets, TotalPaperWeightInKg, FullSheets, PaperRate, PaperAmount, PrintingImpressions, ImpressionsToBeCharged, PrintingRate, PrintingAmount, TotalMakeReadies, MakeReadyRate, MakeReadyAmount, FinalQuantity, TotalColors, TotalAmount, CutLH, CutHL, PrintingStyle, PrintingChargesType, ExpectedExecutionTime, TotalExecutionTime, MainPaperName, PlanType, PaperRateType, DieCutSize, InterlockStyle, NoOfSets, GrantAmount,OldGrantAmount, Packing, UnitPerPacking, RoundofImpressionsWith, SpeColorFCharges, SpeColorBCharges, SpeColorFAmt, SpeColorBAmt, OpAmt, PlanID, PlanContQty, PlanContentType, PlanContName,ROW_NUMBER() OVER (ORDER BY ProductMasterContentsID) As SequenceNo, Nullif(ContentSizeValues,'') As ContentSizeValues, CoatingCharges, CoatingAmount, PaperGroup,(Select Distinct FieldValue From ItemMasterDetails Where FieldName='PurchaseUnit' And ItemID=JBC.PaperID And CompanyID=JBC.CompanyID ) As PurchaseUnit,JBC.JobType,JBC.JobReference,JBC.JobPriority,JBC.PlateType,JBC.UpsLayout,JBC.SheetLayout, JBC.UserAttachedPicture, JBC.AttachedFileName,JBC.SpecialInstructions FROM ProductMasterContents As JBC Inner Join ProductMaster AS JB On JB.BookingID=JBC.BookingID And JB.ProductMasterID=JBC.ProductMasterID And Isnull(JB.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") And JB.ProductMasterCode='" & ProdMasCode & "' And Isnull(ContentSizeValues,'')<>'' /*And JBC.PlanContQty=" & Qty & "*/ And JB.CompanyID=" & CompanyId & " Order BY JBC.ProductMasterContentsID"
                db.FillDataTable(DTContent, str)

                str = "SELECT Distinct PM.ProcessID, PM.ProcessName, NULLIF (PMS.RateFactor, N'') AS RateFactor, JBC.Quantity, JBC.PlanID, JBC.PlanContQty, JBC.PlanContentType, JBC.PlanContName, ROUND(JBC.Rate, 3) AS Rate, JBC.Ups, JBC.NoOfPass, JBC.Pieces, JBC.NoOfStitch, JBC.NoOfLoops, JBC.NoOfColors, JBC.SizeL, JBC.SizeW, JBC.Amount, NULLIF (JBC.Remarks, N'') AS Remarks, JBC.SequenceNo, PM.MinimumCharges, PM.TypeofCharges, PM.SetupCharges, ISNULL(JBC.PaperConsumptionRequired, N'false') AS PaperConsumptionRequired, ISNULL(PM.Rate, 0) AS MasterRate,PM.DepartmentID FROM ProductMasterProcess As JBC Inner Join ProductMaster AS JB On JB.ProductMasterID=JBC.ProductMasterID And JBC.CompanyID=JB.CompanyID Inner Join ProcessMaster AS PM On PM.ProcessID=JBC.ProcessID And JBC.CompanyID=PM.CompanyID And Isnull(PM.IsDeletedTransaction,0)=0  And Isnull(JB.IsDeletedTransaction,0)=0 Left Join ProcessMasterSlabs As PMS On PMS.ProcessID= PM.ProcessID And JBC.RateFactor=PMS.RateFactor WHERE (JB.BookingID = " & BookingID & ") /*And JBC.PlanContQty=" & Qty & "*/ And Isnull(PM.ProcessPurpose,'Both')<>'Estimate' And JB.ProductMasterCode='" & ProdMasCode & "' And JB.CompanyID=" & CompanyId & " Order By SequenceNo"
                db.FillDataTable(DTProcess, str)

                str = "SELECT ProductMasterBookFormsID,PlanContQty, PlanContentType, PlanContName, Forms, Sets, Pages, Sheets, ImpressionsPerSet, FormsInPoint, ImprsToChargedPerSet, BasicRate, SlabRate, JBC.RateType, Amount, WastagePercentSheet, PlateRate, PlanID FROM ProductMasterContentBookForms As JBC Inner Join ProductMaster AS JB On JB.ProductMasterID=JBC.ProductMasterID And JBC.CompanyID=JB.CompanyID And Isnull(JB.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") And JB.ProductMasterCode='" & ProdMasCode & "' And Isnull(JB.IsDeletedTransaction,0)=0 And JBC.PlanContQty=" & Qty & " And JB.CompanyID=" & CompanyId & " Order By ProductMasterBookFormsID"
                db.FillDataTable(DTBookForms, str)

                str = "SELECT JBMR.BookingID, JBMR.MachineID, JBMR.ProcessID, JBMR.ItemID,  JBMR.SequenceNo, JBMR.PlanContName, JBMR.PlanContentType, JBMR.PlanContQty, JBMR.RequiredQty,IM.EstimationUnit,IM.UnitPerPacking,IM.WtPerPacking, JBMR.Rate, JBMR.Amount, PM.ProcessName, IM.ItemCode, IM.ItemName, MM.MachineName,JBC.CutSize As RequiredSize,JBC.FullSheets,JBC.TotalPaperWeightInKg As TotalPaperWtInKG,JBC.FullSheets As IssuePacks,Isnull(IM.PhysicalStock,0) AS PhysicalStock,IMD.FieldValue As SizeW,IMG.FieldValue As GSM " &
                    " FROM ProductMasterProcessMaterialRequirement AS JBMR INNER JOIN ProcessMaster AS PM ON PM.ProcessID = JBMR.ProcessID AND PM.CompanyID = JBMR.CompanyID And PM.CompanyID=" & CompanyId & " And JBMR.IsDeletedTransaction=0 INNER JOIN ItemMaster AS IM ON JBMR.ItemID = IM.ItemID AND JBMR.CompanyID = IM.CompanyID INNER JOIN ItemMasterDetails AS IMD ON IM.ItemID = IMD.ItemID AND IM.CompanyID = IMD.CompanyID And IMD.FieldName='SizeW' AND IMD.IsDeletedTransaction = 0 INNER JOIN ItemMasterDetails AS IMG ON IM.ItemID = IMG.ItemID AND IM.CompanyID = IMG.CompanyID And IMG.FieldName='GSM' AND IMG.IsDeletedTransaction = 0 INNER JOIN MachineMaster AS MM ON JBMR.MachineID = MM.MachineId AND JBMR.CompanyID = MM.CompanyID Inner Join ProductMasterContents AS JBC ON JBC.ProductMasterID = JBMR.ProductMasterID AND JBMR.CompanyID = JBC.CompanyID Where (JBC.ProductMasterCode='" & ProdMasCode & "') Order By JBMR.SequenceNo"
                db.FillDataTable(DTMaterials, str)

                str = "Select Distinct SequenceNo,BookingID,ProductMasterCode,ProductMasterContentsID,ContentsID,PlanContName,PlanContentType, PlanContQty,ItemGroupID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingColorDetails Where CompanyId = " & CompanyId & " And BookingID = " & BookingID & " And ProductMasterCode='" & ProdMasCode & "' Order By SequenceNo"
                db.FillDataTable(DTInkShades, str)

                str = "SELECT JCFW.PlanContName,0 As PlanContQty,'' As PlanContentType, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo,JCFW.RefNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID,JCFW.TransID,0 As ActualSheets,0 As WasteSheets FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID And MM.CompanyID=JCFW.CompanyID WHERE (JCFW.JobBookingJobCardNo = '" & JobCardNo & "')  And JCFW.CompanyID = " & CompanyId & " And Isnull(JCFW.IsDeletedTransaction,0)=0 And JCFW.BookingID = " & BookingID & " Order By TransID"
                db.FillDataTable(DTJCBookFormsDetail, str)
            Else
                str = "SELECT Distinct JobBookingJobCardContentsID,JBC.ProductMasterContentsID,MachineID, MachineName, Gripper, GripperSide, MachineColors, PaperID, PaperSize, CutSize, CutL, CutW, UpsL, UpsW, TotalUps, BalPiece, BalSide, WasteArea, WastePerc, WastageKg, GrainDirection, PlateQty, PlateRate, PlateAmount, MakeReadyWastageSheet, ActualSheets, WastageSheets, TotalPaperWeightInKg, FullSheets, PaperRate, PaperAmount, PrintingImpressions, ImpressionsToBeCharged, PrintingRate, PrintingAmount, TotalMakeReadies, MakeReadyRate, MakeReadyAmount, FinalQuantity, TotalColors, TotalAmount, CutLH, CutHL, PrintingStyle, PrintingChargesType, ExpectedExecutionTime, TotalExecutionTime, MainPaperName, PlanType, PaperRateType, DieCutSize, InterlockStyle, NoOfSets, GrantAmount,OldGrantAmount, Packing, UnitPerPacking, RoundofImpressionsWith, SpeColorFCharges, SpeColorBCharges, SpeColorFAmt, SpeColorBAmt, OpAmt, PlanID, PlanContQty, PlanContentType, PlanContName,ROW_NUMBER() OVER (ORDER BY JobBookingJobCardContentsID) As SequenceNo, Nullif(ContentSizeValues,'') As ContentSizeValues, CoatingCharges, CoatingAmount, PaperGroup,JBC.PurchaseUnit,JBC.JobType,JBC.JobReference,JBC.JobPriority,JBC.PlateType,JBC.UpsLayout,JBC.SheetLayout, JBC.UserAttachedPicture, JBC.AttachedFileName ,JBC.SpecialInstructions,JBC.VendorID FROM JobBookingJobCardContents As JBC Inner Join JobBookingJobCard AS JB On JB.BookingID=JBC.BookingID And JB.JobBookingID=JBC.JobBookingID And Isnull(JB.IsDeletedTransaction,0)=0  WHERE (JB.BookingID = " & BookingID & ") And Isnull(JBC.IsDeletedTransaction,0)=0 And (JB.JobBookingNo = '" & JobCardNo & "') And Isnull(ContentSizeValues,'')<>'' /*And JBC.PlanContQty=" & Qty & "*/ And JB.CompanyID=" & CompanyId & " Order By SequenceNo,JobBookingJobCardContentsID"
                db.FillDataTable(DTContent, str)

                str = "SELECT Distinct PM.ProcessID,PM.ProcessName,Nullif(PMS.RateFactor,'') AS RateFactor, Quantity, PlanID, PlanContQty, PlanContentType, PlanContName,ROUND(JBC.Rate,3) As Rate, Ups, NoOfPass, Pieces, NoOfStitch, NoOfLoops, NoOfColors, SizeL, SizeW, Amount, Nullif(Remarks,'') AS Remarks, SequenceNo,PM.MinimumCharges,PM.TypeofCharges,PM.SetupCharges,Isnull(JBC.PaperConsumptionRequired,'false') As PaperConsumptionRequired,Isnull(PM.Rate,0) As MasterRate,PM.DepartmentID FROM JobBookingJobCardProcess As JBC Inner Join JobBookingJobCard AS JB On JB.JobBookingID=JBC.JobBookingID And Isnull(JB.IsDeletedTransaction,0)=0 And JBC.CompanyID=JB.CompanyID Inner Join ProcessMaster AS PM On PM.ProcessID=JBC.ProcessID And JBC.CompanyID=PM.CompanyID Left Join ProcessMasterSlabs As PMS On PMS.ProcessID= PM.ProcessID And JBC.RateFactor=PMS.RateFactor WHERE (JB.BookingID = " & BookingID & ") And (JB.JobBookingNo = '" & JobCardNo & "') /*And JBC.PlanContQty=" & Qty & "*/ And Isnull(PM.ProcessPurpose,'Both')<>'Estimate' And JB.CompanyID=" & CompanyId & " Order By SequenceNo"
                db.FillDataTable(DTProcess, str)

                str = "SELECT Distinct PlanContQty, PlanContentType, PlanContName, Forms, Sets, Pages, Sheets, ImpressionsPerSet, FormsInPoint, ImprsToChargedPerSet, BasicRate, SlabRate, JBC.RateType, Amount, WastagePercentSheet, PlateRate, PlanID FROM JobBookingJobCardContentBookForms  As JBC Inner Join JobBookingJobCard AS JB On JB.BookingID=JBC.BookingID And JB.JobBookingID=JBC.JobBookingID And Isnull(JB.IsDeletedTransaction,0)=0 WHERE (JB.BookingID = " & BookingID & ") And (JB.JobBookingNo = '" & JobCardNo & "') And JBC.PlanContQty=" & Qty & " And JB.CompanyID=" & CompanyId
                db.FillDataTable(DTBookForms, str)

                str = "SELECT JBMR.BookingID, JBMR.MachineID, JBMR.ProcessID, JBMR.ItemID,IGM.ItemGroupID,IGM.ItemGroupNameID,JBMR.SequenceNo, JBMR.PlanContName, JBMR.PlanContentType, JBMR.PlanContQty, JBMR.RequiredQty,JBMR.StockUnit,JBMR.EstimatedQuantity,IM.EstimationUnit, IM.UnitPerPacking,IM.WtPerPacking, JBMR.Rate, JBMR.Amount, PM.ProcessName, IM.ItemCode,IGM.ItemGroupName, IM.ItemName, MM.MachineName,JBC.CutSize As RequiredSize,JBMR.EstimatedQuantity As FullSheets,JBC.TotalPaperWeightInKg As TotalPaperWtInKG, JBMR.RequiredQty As IssuePacks,Isnull(IM.PhysicalStock,0) AS PhysicalStock,IsCreateIndent ,IsCreatePickList ,IMD.FieldValue As SizeW,IMG.FieldValue As GSM " &
                      " FROM JobBookingJobCard As JB INNER JOIN JobBookingJobCardContents AS JBC On JBC.JobBookingID=JB.JobBookingID And JBC.CompanyID = JB.CompanyID And Isnull(JB.IsDeletedTransaction,0)=0 And JB.CompanyID=" & CompanyId & "  INNER JOIN JobBookingJobCardProcessMaterialRequirement AS JBMR On JBMR.JobBookingID=JBC.JobBookingID And JBMR.JobBookingJobCardContentsID = JBC.JobBookingJobCardContentsID And JBMR.CompanyID = JBC.CompanyID And Isnull(JBMR.IsDeletedTransaction,0)=0 And JBMR.CompanyID=" & CompanyId & " INNER JOIN ItemMaster AS IM ON JBMR.ItemID = IM.ItemID And JBMR.CompanyID = IM.CompanyID INNER JOIN ItemMasterDetails AS IMD ON IM.ItemID = IMD.ItemID AND IM.CompanyID = IMD.CompanyID And IMD.FieldName='SizeW' AND IMD.IsDeletedTransaction = 0  INNER JOIN ItemMasterDetails AS IMG ON IM.ItemID = IMG.ItemID AND IM.CompanyID = IMG.CompanyID And IMG.FieldName='GSM' AND IMG.IsDeletedTransaction = 0 INNER JOIN ItemGroupMaster AS IGM ON IGM.ItemGroupID = IM.ItemGroupID And IGM.CompanyID = IM.CompanyID LEFT JOIN ProcessMaster AS PM ON PM.ProcessID = JBMR.ProcessID And PM.CompanyID = JBMR.CompanyID LEFT JOIN MachineMaster AS MM ON JBMR.MachineID = MM.MachineId And JBMR.CompanyID = MM.CompanyID Where (JB.JobBookingNo = '" & JobCardNo & "') Order By JBMR.SequenceNo"
                db.FillDataTable(DTMaterials, str)

                str = "Select Distinct SequenceNo,BookingID,JobBookingID,JobBookingJobCardContentsID,ContentsID,PlanContName,PlanContentType, PlanContQty,ItemGroupID,ItemID,ItemName,ColorSpecification,FormNo,FormSide,CoverageAreaPercent,Solid,Midtone,Highlight,Quartertone,IsPlateComplete,JobBookingNo,OrderBookingNo,ItemPantoneCode FROM JobBookingJobCardColorDetails Where CompanyId = " & CompanyId & " And BookingID = " & BookingID & " And JobBookingNo='" & JobCardNo & "' Order By SequenceNo" ''JobBookingID In (Select Distinct JobBookingID From JobBookingJobCard Where JobBookingNo='" & JobCardNo & "' And CompanyID='" & CompanyId & "' And isnull(IsDeletedTransaction,0)=0) Or 
                db.FillDataTable(DTInkShades, str)

                str = "SELECT JCFW.PlanContName, JCFW.PlanContQty, JCFW.PlanContentType, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo,JCFW.RefNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID,JCFW.TransID,JCFW.ActualSheets,JCFW.WasteSheets FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID And MM.CompanyID=JCFW.CompanyID WHERE (JCFW.JobBookingJobCardNo = '" & JobCardNo & "')  And JCFW.CompanyID = " & CompanyId & " And Isnull(JCFW.IsDeletedTransaction,0)=0 And JCFW.BookingID = " & BookingID & " Order By TransID"
                db.FillDataTable(DTJCBookFormsDetail, str)

            End If
            If DTJCBookFormsDetail.Rows.Count = 0 Then
                RecalculateFormsDetails(DTJCBookFormsDetail, DTContent, DTBookForms)
            End If

            DTContent.TableName = "TblBookingContents"
            DTProcess.TableName = "TblBookingProcess"
            DTBookForms.TableName = "TblBookingForms"
            DTMaterials.TableName = "TblBookingMaterials"
            DTInkShades.TableName = "TblBookingInks"
            DTJCBookFormsDetail.TableName = "TblJCBookFormsDetail"

            If ProdMasCode = "" And JobCardNo = "" Then
                DTBookForms.Columns.Remove("JobContentBookFormsID") ''''not for use after calculations b/c it will affects in saving data (Unique Id)
            ElseIf JobCardNo = "" And ProdMasCode <> "" Then
                DTBookForms.Columns.Remove("ProductMasterBookFormsID") ''''not for use after calculations b/c it will affects in saving data (Unique Id)
            End If

            Dim Dataset As New DataSet

            Dataset.Merge(DTContent)
            Dataset.Merge(DTProcess)
            Dataset.Merge(DTBookForms)
            Dataset.Merge(DTMaterials)
            Dataset.Merge(DTInkShades)
            Dataset.Merge(DTJCBookFormsDetail)
            data.Message = db.ConvertDataSetsTojSonString(Dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message & "500"
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetInputSizess(ByVal ID As String) As String
        Try

            Dim GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str = "Select isnull(ProductInputSizes,'') as ProductInputSizes from ProductQuotationContents where  CompanyID=" & GBLCompanyID & " and ProductEstimationContentID=" & ID
            db.FillDataTable(dataTable, str)

            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RecalculateFormsDetails(ByVal ObjContents As Object, ByVal ObjForms As Object) As String
        Try
            Dim DTJCBookFormsDetail, DTContent, DTBookForms As New DataTable
            str = "SELECT JCFW.PlanContName, JCFW.PlanContQty, JCFW.PlanContentType, JCFW.JobCardFormNo, MM.MachineName, JCFW.PlateSize, JCFW.ColorsFB, JCFW.Pages, JCFW.Ups, JCFW.SetsForms, JCFW.SheetSize, JCFW.PageNo, JCFW.TotalSheets, JCFW.PrintingStyle, JCFW.PaperDetails, JCFW.FoldingStyle, JCFW.TotalFolds, JCFW.PrintingRemark, JCFW.FoldingRemark, JCFW.OtherRemark, JCFW.MachineID, JCFW.PaperID,JCFW.TransID,JCFW.ActualSheets,JCFW.WasteSheets FROM JobBookingJobCardFormWiseDetails AS JCFW INNER JOIN MachineMaster AS MM ON MM.MachineId = JCFW.MachineID And MM.CompanyID=JCFW.CompanyID WHERE (JCFW.JobBookingJobCardNo = '')  And JCFW.CompanyID = 0 And Isnull(JCFW.IsDeletedTransaction,0)=0 And JCFW.BookingID = 0 Order By TransID"
            db.FillDataTable(DTJCBookFormsDetail, str)

            db.ConvertObjectToDatatable(ObjContents, DTContent)
            db.ConvertObjectToDatatable(ObjForms, DTBookForms)
            Return RecalculateFormsDetails(DTJCBookFormsDetail, DTContent, DTBookForms)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Public Function RecalculateFormsDetails(ByRef DTJCBookFormsDetail As DataTable, ByVal DTContent As DataTable, ByVal DTBookForms As DataTable) As String
        Try

            Dim x = 0
            Dim GenJobCardNo As String
            GenJobCardNo = GenerateJobCardNo()

            For i = 0 To DTContent.Rows.Count - 1
                Dim aryTextFile() As String
                Dim BColor = 0
                Dim FColor = 0
                aryTextFile = Split(DTContent.Rows(i)("ContentSizeValues"), "AndOr")
                For j = 0 To UBound(aryTextFile)
                    If aryTextFile(j).Contains("PlanFColor") Then
                        FColor = FColor + Val(Split(aryTextFile(j), "=")(1))
                    ElseIf aryTextFile(j).Contains("PlanBColor") Then
                        BColor = BColor + Val(Split(aryTextFile(j), "=")(1))
                    ElseIf aryTextFile(j).Contains("PlanSpeFColor") Then
                        FColor = FColor + Val(Split(aryTextFile(j), "=")(1))
                    ElseIf aryTextFile(j).Contains("PlanSpeBColor") Then
                        BColor = BColor + Val(Split(aryTextFile(j), "=")(1))
                    End If
                Next

                Dim row As DataRow = DTBookForms.Select("PlanContName = '" & DTContent.Rows(i)("PlanContName") & "'").FirstOrDefault()
                If Not row Is Nothing Then
                    dataTable.Clear()
                    db.FillDataTable(dataTable, "Select MachineType,MachineName,(Convert(Nvarchar(20),PlateWidth) + 'X' + Convert(Nvarchar(20),PlateLength)) As PlateSize From MachineMaster Where MachineID = " & DTContent.Rows(i)("MachineID"))

                    Dim formIndex = 0
                    For index = 0 To DTBookForms.Rows.Count - 1
                        If DTBookForms.Rows(index)("PlanContName") = DTContent.Rows(i)("PlanContName") Then
                            If FColor > 0 Or BColor > 0 Then
                                'DTJCBookFormsDetail.NewRow()
                                'DTJCBookFormsDetail.Rows.Add(0)
                                Dim PS As String
                                If formIndex = 0 Then
                                    If DTContent.Rows(i)("PrintingStyle") = "Single Side" Then
                                        PS = DTContent.Rows(i)("PrintingStyle")
                                    Else
                                        PS = "Front & Back"
                                    End If
                                Else
                                    If DTContent.Rows(i)("PrintingStyle") = "Single Side" Then
                                        PS = DTContent.Rows(i)("PrintingStyle")
                                    Else
                                        If dataTable.Rows(0)("MachineType") = "Web Offset" Then
                                            PS = "Front & Back"
                                        Else
                                            PS = DTContent.Rows(i)("PrintingStyle")
                                        End If
                                    End If
                                End If
                                For j = 1 To IIf(IsDBNull(DTBookForms.Rows(index)("Forms")), 0, DTBookForms.Rows(index)("Forms"))
                                    DTJCBookFormsDetail.ImportRow(row)
                                    DTJCBookFormsDetail.Rows(x)("ColorsFB") = FColor & " + " & BColor
                                    Dim Pages = IIf(IsDBNull(DTBookForms.Rows(index)("Pages")), 0, DTBookForms.Rows(index)("Pages")) / IIf(IsDBNull(DTBookForms.Rows(index)("Forms")), 0, DTBookForms.Rows(index)("Forms"))
                                    DTJCBookFormsDetail.Rows(x)("ActualSheets") = RoundUP(DTContent.Rows(i)("PlanContQty") * (Pages / (DTContent.Rows(i)("TotalUps") * 2)), 0)
                                    DTJCBookFormsDetail.Rows(x)("Pages") = Pages & "(" & IIf(IsDBNull(DTBookForms.Rows(index)("Pages")), 0, DTBookForms.Rows(index)("Pages")) & ")"
                                    DTJCBookFormsDetail.Rows(x)("PaperDetails") = DTContent.Rows(i)("MainPaperName")
                                    DTJCBookFormsDetail.Rows(x)("SheetSize") = DTContent.Rows(i)("PaperSize")
                                    DTJCBookFormsDetail.Rows(x)("PrintingStyle") = PS ' DTContent.Rows(i)("PrintingStyle")
                                    DTJCBookFormsDetail.Rows(x)("PaperID") = DTContent.Rows(i)("PaperID")
                                    DTJCBookFormsDetail.Rows(x)("MachineID") = DTContent.Rows(i)("MachineID")
                                    DTJCBookFormsDetail.Rows(x)("MachineName") = DTContent.Rows(i)("MachineName")
                                    DTJCBookFormsDetail.Rows(x)("PlateSize") = dataTable.Rows(0)("PlateSize")
                                    DTJCBookFormsDetail.Rows(x)("Ups") = DTContent.Rows(i)("TotalUps")
                                    DTJCBookFormsDetail.Rows(x)("SetsForms") = j
                                    DTJCBookFormsDetail.Rows(x)("TransID") = j + formIndex
                                    DTJCBookFormsDetail.Rows(x)("WasteSheets") = Math.Round(DTJCBookFormsDetail.Rows(x)("ActualSheets") / (DTBookForms.Rows(index)("Sheets") / DTContent.Rows(i)("WastageSheets")), 0)
                                    DTJCBookFormsDetail.Rows(x)("TotalSheets") = DTJCBookFormsDetail.Rows(x)("WasteSheets") + DTJCBookFormsDetail.Rows(x)("ActualSheets")
                                    DTJCBookFormsDetail.Rows(x)("JobCardFormNo") = GenJobCardNo & "[" & i + 1 & "_" & DTContent.Rows.Count & "]" & "_" & j
                                    x = x + 1
                                Next
                            End If
                            formIndex = formIndex + 1
                        End If
                    Next
                End If
            Next
            data.Message = db.ConvertDataTableTojSonString(DTJCBookFormsDetail)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    '--------------- Get Requisition and purchase order Comment Data---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCommentData(ByVal orderBookingID As Integer, ByVal jobBookingID As Integer) As String

        Dim GBLCompanyID As String
        Dim GBLUserID As String
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        str = ""

        If orderBookingID > 0 Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Production Work Order',0,0,0,0,0,'" & orderBookingID & "',0,0"
        ElseIf jobBookingID <> "0" Then
            str = " EXEC GetCommentData " & GBLCompanyID & ",'Production Work Order',0,0,0,0,0,0,0,'" & jobBookingID & "'"
        End If

        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647

        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Save Comment Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCommentData(ByVal jsonObjectCommentDetail As Object) As String

        Dim GBLCompanyID, GBLFYear As String
        Dim GBLUserID As String
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            TableName = "CommentChainMaster"
            AddColName = ""
            AddColValue = ""
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "'"
            db.InsertDatatableToDatabase(jsonObjectCommentDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"
            '  End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckItemStock(ByVal Id As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select Isnull(PhysicalStock,0) As PhysicalStock,Isnull(BookedStock,0) As BookedStock From ItemMaster Where ItemID=" & Id & " And CompanyID=" & CompanyId & ""
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    ''*****************************    '' Apply Tools   ********************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetToolsList() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            str = "Select Distinct ToolCode,ToolName,ToolID From ToolMaster Where Isnull(IsDeletedTransaction,0)=0 And CompanyID = " & CompanyId

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobDataPO(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct PQC.ProductCatalogID as ProductCatelogID,PQ.ProductEstimateID,PQ.EstimateNo as QuotaionNo,JOB.SalesOrderNo,convert(CHAR(30),JOB.OrderBookingDate, 106) OrderBookingDate,PQ.EnquiryID,EM.EnquiryNo,JBJC.JobBookingID,JBJC.JobBookingNo,JBJC.BookingID,convert(CHAR(30),JBJC.JobBookingDate, 106) JobBookingDate,JBJC.OrderBookingID, convert(CHAR(30),JBJC.PODate, 106) PODate,JBJC.PONo,JBJC.JobName as ProjectName,JBJC.ClientName,JBJC.LedgerID,JBS.ScheduleVendorId from JobBookingJobCard as JBJC inner join ProductQuotation as PQ on PQ.ProductEstimateID =JBJC.ProductEstimateID inner join EnquiryMain as EM on EM.EnquiryID= PQ.EnquiryID  inner join JobOrderBooking as JOB on JBJC.OrderBookingID = JOB.OrderBookingID inner join JobCardSchedule AS JBS ON JBS.JobCardID = JBJC.JobBookingID inner join ProductQuotationContents as PQC on PQC.ProductEstimationContentID = JBS.JobContentsID  where JBJC.CompanyID =" & CompanyId & " and  JBJC.JobBookingID =" & JobBookingID & " and   JBS.ScheduleVendorId = " & ScheduleVendorId & " And  Isnull(JBJC.IsdeletedTransaction,0) <> 1 order by JBJC.JobBookingID desc"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobbookingDataPO(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct   (JCS.SGSTTaxAmount + JCS.CGSTTaxAmount + JCS.IGSTTaxAmount) AS ToTalGSTAmount ,JCS.OrderBookingDetailsID,PQC.ProductEstimationContentID,  LMAV.LedgerName as VendorName,LN.LedgerName as Jobcordinator, LM.LedgerName as ClientName, PCM.ProductCatalogID, PQ.EstimateNo as QuotaionNo,PQC.GSTPercantage,JCS.JobContentsID,JCS.JobCardID AS JobBookingID,JCS.ProductType,LMV.LedgerName as PlanedVendorName,LMAV.LedgerName ScheduleVendorName, JCS.OrderBookingScheduleID,JCS.OrderBookingID,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106) ExpectedDeliveryDate,JCS.TotalAmount,JCS.NetAmount,JCS.SGSTTaxAmount,JCS.SGSTTaxPercentage,JCS.CGSTTaxAmount,JCS.CGSTTaxPercentage,JCS.IGSTTaxAmount,JCS.IGSTTaxPercentage,JCS.RateType,JCS.Rate,JCS.Rate as ScheduleRate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId,JCS.CriticalRemark  from JobCardSchedule as JCS inner join JobBookingJobCard as JBJC on JBJC.JobBookingID = JCS.JobCardID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID inner join ProductQuotationContents as PQC on PQC.ProductEstimateID = JCS.ProductEstimateID and JCS.JobContentsID = PQC.ProductEstimationContentID inner join ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId inner Join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID left join  LedgerMaster as LN on LN.LedgerID = JBJC.CoordinatorLedgerID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PCM.ProductHSNID where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId & " And JCS.JOBCARDID = " & JobBookingID & " and  JCS.ScheduleVendorId = " & ScheduleVendorId
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function VendorName(ByVal JobbookingID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            str = "select distinct JCS.JobCardID as JobBookingID, schedulevendorid as LedgerID ,LedgerName as VendorName,state  from JobCardSchedule as JCS inner join LedgerMaster as LM on JCS.ScheduleVendorId = LM.LedgerID And JCS.CompanyId = " & CompanyId & " where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.JobCardID =" & JobbookingID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    Public Function GetPONo() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim TableName = "servicepomain"
            Dim MaxPONo = 0
            Dim PONumber = ""
            PONumber = db.GeneratePrefixedNo(TableName, "PO", "MaxPONo", MaxPONo, "", "Where CompanyId=" & CompanyID)
            Return PONumber
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SavePO(ByVal Data As Object, ByVal POData As Object, ByVal IsEdit As Boolean, ByVal GBLPOID As Int16) As String
        Try
            Dim UserId As String = Convert.ToString(Session("UserID"))
            Dim UserName As String = Convert.ToString(HttpContext.Current.Session("UserName"))
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim keyField = ""
            Dim TableName = "servicepomain"
            Dim AddCol = ""
            Dim AddVal = ""
            Dim MaxPONo = 0

            If IsEdit = False Then ''  to save new data
                ' to save customer data
                Dim PONumber = db.GeneratePrefixedNo(TableName, "PO", "MaxPONo", MaxPONo, "", "Where CompanyId=" & CompanyID)

                AddCol = "CreatedBy,PODate,CreatedDate,ModifiedDate,CompanyID,PONumber,MaxPONo"
                AddVal = UserId & ",getdate(),getdate(),getdate()," & CompanyID & ",'" & PONumber & "'," & MaxPONo
                Dim POID = db.InsertDatatableToDatabase(Data, TableName, AddCol, AddVal)
                If IsNumeric(POID) Then
                    ' to save PO data againest PO id

                    AddCol = "CreatedBy,CreatedDate,POID"
                    AddVal = UserId & ",getdate()," & POID

                    keyField = db.InsertDatatableToDatabase(POData, "servicepodetails", AddCol, AddVal)

                    If IsNumeric(keyField) Then
                        Return "Success"
                    Else
                        db.ExecuteNonSQLQuery("Delete from servicepomain where POID=" & POID)
                        Return "Failed"
                    End If
                Else
                    Return "Failed"
                End If
            Else '' to create new version of the PO
                Dim GetPOCode = db.GetColumnValue("PONumber", "ServicePoMain", " POID=" & GBLPOID & " and CompanyID=" & CompanyID)
                Dim Version = db.GetColumnValue("VersionNo", "ServicePoMain", " POID=" & GBLPOID & " and CompanyID=" & CompanyID)
                Dim MaxPONos = db.GetColumnValue("MaxPONo", "ServicePoMain", " POID=" & GBLPOID & " and CompanyID=" & CompanyID)

                AddCol = "CreatedBy,PODate,CreatedDate,ModifiedDate,CompanyID,PONumber,MaxPONo,VersionNo,IsSentForApproval,ApprovalSentTo,ApprovalSentDate,IsApproved,ApprovedBy,ApprovedDate,ApprovedRemark"
                AddVal = UserId & ",getdate(),getdate(),getdate()," & CompanyID & ",'" & GetPOCode & "'," & MaxPONos & "," & Version + 1 & ",1," & UserId & ",GetDate(),1," & UserId & ",GetDate(),'Auto Approved, Revised by " & UserName & "'"

                Dim POID = db.InsertDatatableToDatabase(Data, TableName, AddCol, AddVal)
                If IsNumeric(POID) Then
                    ' to save PO data againest PO id

                    AddCol = "CreatedBy,CreatedDate,POID"
                    AddVal = UserId & ",getdate()," & POID

                    keyField = db.InsertDatatableToDatabase(POData, "servicepodetails", AddCol, AddVal)

                    If IsNumeric(keyField) Then
                        Return "Success"
                    Else
                        db.ExecuteNonSQLQuery("Delete from servicepomain where POID=" & POID)
                        Return "Failed"
                    End If
                Else
                    Return "Failed"
                End If
            End If

            Return "Failed"
        Catch ex As Exception
            Return ex.Message
        End Try


    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendorName() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "select LedgerID,LedgerName from LedgerMaster where LedgerGroupID =8 and IsDeletedTransaction = 0 and CompanyID =" & CompanyID
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try


    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendorNamePO() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "select LedgerID,LedgerName from LedgerMaster where LedgerGroupID =8 and IsDeletedTransaction = 0 and LedgerId in (Select distinct SchedulevendorID from JobcardSchedule where IsdeletedTransaction = 0) and CompanyID =" & CompanyID
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try


    End Function


    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DropDown(ByVal LedgerID As Integer) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "Select distinct JBJC.JobBookingID,JBJC.JobBookingNo,JBS.ScheduleVendorId from JobBookingJobCard as JBJC inner join JobCardSchedule AS JBS ON JBS.JobCardID = JBJC.JobBookingID where JBJC.CompanyID = " & CompanyID & " and JBS.ScheduleVendorId = " & LedgerID & " And Isnull(JBJC.IsdeletedTransaction, 0) <> 1 order by JBJC.JobBookingID desc"

            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetJobbookingDataStart(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct JBJC.JobBookingNo,PQ.EnquiryID,EM.EnquiryNo,LMAV.LedgerName as VendorName,LN.LedgerName as Jobcordinator, LM.LedgerName as ClientName,PCM.ProductCatalogID, PQ.ProductEstimateID,PQ.EstimateNo as QuotaionNo,PQC.ProductEstimateID,JCS.Processidstr,JCS.JobContentsID,JCS.JobCardID AS JobBookingID,JCS.ProductType, JCS.OrderBookingScheduleID,JCS.OrderBookingID,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106) ExpectedDeliveryDate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId,JCS.CriticalRemark  from JobCardSchedule as JCS inner join JobBookingJobCard as JBJC on JBJC.JobBookingID = JCS.JobCardID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID inner join ProductQuotationContents as PQC on PQC.ProductEstimateID = JCS.ProductEstimateID  and JCS.JobContentsID = PQC.ProductEstimationContentID inner join ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId inner Join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID left join  LedgerMaster as LN on LN.LedgerID = JBJC.CoordinatorLedgerID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PCM.ProductHSNID  INNER JOIN EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID  where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId & " And JCS.JOBCARDID = " & JobBookingID & " and  JCS.ScheduleVendorId = " & ScheduleVendorId
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Operation(ByVal JobBookingID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct JP.JobBookingID,PM.ProcessId,PM.ProcessName from  ProcessMaster  as PM inner join JobBookingJobCardProcess as JP on jp.processid = PM.ProcessID  where Isnull(PM.IsdeletedTransaction, 0) <> 1 And jp.CompanyID = " & CompanyId & " And jp.JobBookingID = " & JobBookingID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function JobcardEnd(ByVal LedgerID As Integer) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "Select distinct JBJC.JobBookingID,JBJC.JobBookingNo,JBS.ScheduleVendorId from JobBookingJobCard as JBJC INNER JOIN ProductionEntry AS PE on PE.JobBookingID = JBJC.JobBookingID inner join JobCardSchedule AS JBS ON JBS.JobCardID = JBJC.JobBookingID  where JBJC.CompanyID = " & CompanyID & " and JBS.ScheduleVendorId = " & LedgerID & " And Isnull(JBJC.IsdeletedTransaction, 0) <> 1 order by JBJC.JobBookingID desc"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    Public Function SaveStart(ByVal Data As Object, ByVal IsEdit As Boolean, ByVal JobBookingID As String) As String
        Try
            Dim UserId As String = Convert.ToString(Session("UserID"))
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim keyField = ""
            Dim TableName = "ProductionEntry"
            Dim AddCol = ""
            Dim AddVal = ""
            If IsEdit = False Then ''  to save new data
                AddCol = "GetDate,ModifiedDate,CompanyID"
                AddVal = "getdate(),getdate()," & CompanyID
                keyField = db.InsertDatatableToDatabase(Data, TableName, AddCol, AddVal)
                If IsNumeric(keyField) Then
                    'to update the data
                    str = "update JobBookingJobCard set JobStart= '1 ' where JobBookingID= " & JobBookingID
                    db.ExecuteNonSQLQuery(str)


                    Return "Success"
                Else
                    Return "Failed"
                End If
            Else '' to Update the data
                AddCol = "ModifiedDate=getdate(),CompanyID=" & CompanyID
                keyField = db.UpdateDatatableToDatabase(Data, TableName, AddCol, 1)
                If keyField = "Success" Then
                    Return "Success"
                Else
                    Return "Failed"
                End If

            End If

            Return "Failed"
        Catch ex As Exception
            Return ex.Message
        End Try


    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RunningJob(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "select distinct LM.LedgerName AS VendorName,JBJC.JobBookingNo , PE.ProductionID, jBJC.jobbookingNo,JBJC.JobBookingID,PE.ProcessID,PE.Remark,PE.ProductionQuantity,PE.JobBookingNo,PE.VendorID,PE.Remark,JCS.JobName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority,JCS.CriticalRemark,PM.ProcessName as Operation,JCS.ScheduleQty as Quantity,Replace(Convert(Nvarchar(13),JCS.ExpectedDeliveryDate,106),' ','-') as ExpectedDeliveryDate from ProductionEntry AS PE INNER jOIN JobCardSchedule as JCS On JCS.VendorID =  PE.VendorID inner Join ProcessMaster as PM on PM.ProcessID = PE.ProcessID inner join JobBookingJobcard as JBJC on JBJC.JobBookingID = PE.JobBookingID inner join LedgerMaster as LM on LM.LedgerID = JBJC.LedgerID   where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId & " And JCS.JOBCARDID = " & JobBookingID & " and  JCS.ScheduleVendorId = " & ScheduleVendorId

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Process(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer, ByVal ProcessId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'str = "select JCS.orderQuantity, PE.ProductionQuantity,(Isnull(JCS.orderQuantity,0) - Isnull(PE.ProductionQuantity,0)) as remainingValue From JobCardSchedule as JCS left Join ProductionEntry as PE on PE.JobBookingID = JCS.JobCardID and PE.VendorID = JCS.ScheduleVendorId AND PE.ProcessID in ( SELECT id FROM dbo.CSVToTable((SELECT ProcessIDStr AS ID FROM JobCardSchedule WHERE ScheduleVendorId = " & ScheduleVendorId & " and JobCardID =  " & JobBookingID & " ))) where JCS.ScheduleVendorId = " & ScheduleVendorId & " and JCS.JobCardID = " & JobBookingID & " AND  " & ProcessId & "  in ( SELECT id FROM dbo.CSVToTable((SELECT ProcessIDStr AS ID FROM JobCardSchedule WHERE  ScheduleVendorId = " & ScheduleVendorId & " and JobCardID = " & JobBookingID & "   ))) "
            str = "select Isnull(PE.ProcessID,0) ProcessID, JCS.orderQuantity, isnull(PE.ProductionQuantity,0) ProductionQuantity,(Isnull(JCS.orderQuantity,0) - Isnull(PE.ProductionQuantity,0)) as remainingValue From JobCardSchedule as JCS left Join ProductionEntry as PE on PE.JobBookingID = JCS.JobCardID and PE.VendorID = JCS.ScheduleVendorId AND PE.ProcessID in (" & ProcessId & ") where JCS.ScheduleVendorId = " & ScheduleVendorId & " and JCS.JobCardID =" & JobBookingID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ENDJOB(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "select distinct	PS.JobBookingNo,PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,PQC.ProductEstimateID,JCS.Processidstr,JCS.JobContentsID,JCS.JobCardID AS JobBookingID,PS.ProductionQuantity,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId,JCS.CriticalRemark,PCM.ProductCatalogID, PQ.ProductEstimateID from JobCardSchedule as JCS INNER JOIN  JobBookingJobCard as JBJC on JBJC.JobBookingID = JCS.JobCardID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID inner join ProductQuotationContents as PQC on PQC.ProductEstimateID = JCS.ProductEstimateID and JCS.JobCardID = PQC.ProductEstimationContentID inner join ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId inner Join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID left join  LedgerMaster as LN on LN.LedgerID = JBJC.CoordinatorLedgerID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PCM.ProductHSNID INNER JOIN EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner Join ProductionEntry as PE on PE.JobBookingID = JBJC.jobbookingid INNER JOIN ProductionEntry as PS on PS.JobBookingID = JBJC.JobBookingID where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId & " And JCS.JOBCARDID = " & JobBookingID & " and  JCS.ScheduleVendorId = " & ScheduleVendorId

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProductionQuantity(ByVal JobBookingID As Integer, ByVal ScheduleVendorId As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "select distinct	PS.JobBookingNo,PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,PQC.ProductEstimateID,JCS.Processidstr,JCS.JobContentsID,JCS.JobCardID AS JobBookingID,PS.ProductionQuantity,JCS.ProductEstimateID,JCS.JobName as ProductName,JCS.OrderQuantity,JCS.JobType,JCS.JobReference,JCS.JobPriority, convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId,JCS.CriticalRemark,PCM.ProductCatalogID, PQ.ProductEstimateID from JobCardSchedule as JCS INNER JOIN  JobBookingJobCard as JBJC on JBJC.JobBookingID = JCS.JobCardID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID inner join ProductQuotationContents as PQC on PQC.ProductEstimateID = JCS.ProductEstimateID and JCS.JobCardID = PQC.ProductEstimationContentID inner join ProductCatalogMaster as PCM on PCM.ProductCatalogID = PQC.ProductCatalogID inner Join LedgerMaster as LMV on LMV.LedgerID = JCS.VendorID inner Join LedgerMaster as LMAV on LMAV.LedgerID = JCS.ScheduleVendorId inner Join LedgerMaster as LM on LM.LedgerID = PQ.LedgerID left join  LedgerMaster as LN on LN.LedgerID = JBJC.CoordinatorLedgerID inner join ProductHSNMaster as PHM on PHM.ProductHSNID = PCM.ProductHSNID INNER JOIN EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner Join ProductionEntry as PE on PE.JobBookingID = JBJC.jobbookingid INNER JOIN ProductionEntry as PS on PS.JobBookingID = JBJC.JobBookingID where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID =" & CompanyId & " And JCS.JOBCARDID = " & JobBookingID & " and  JCS.ScheduleVendorId = " & ScheduleVendorId

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function



    <WebMethod(EnableSession:=True)>
    Public Function SaveEnd(ByVal Data As Object, ByVal IsEdit As Boolean, ByVal JobBookingID As String) As String
        Try
            Dim UserId As String = Convert.ToString(Session("UserID"))
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim keyField = ""
            Dim TableName = "Productionentry"
            Dim AddCol = ""
            Dim AddVal = ""


            If IsEdit = False Then ''  to save new data
                AddCol = "GetDate,ModifiedDate,CompanyID"
                AddVal = "getdate(),getdate()," & CompanyID
                keyField = db.InsertDatatableToDatabase(Data, TableName, AddCol, AddVal)
                If IsNumeric(keyField) Then



                    'to update the data
                    str = "update JobBookingJobCard set JobStart= '1 ' where JobBookingID= " & JobBookingID
                    db.ExecuteNonSQLQuery(str)


                    Return "Success"
                Else
                    Return "Failed"
                End If
            Else '' to Update the data
                AddCol = "ModifiedDate=getdate(),CompanyID=" & CompanyID
                keyField = db.UpdateDatatableToDatabase(Data, TableName, AddCol, 1)
                If keyField = "Success" Then
                    Return "Success"
                Else
                    Return "Failed"
                End If

            End If

            Return "Failed"
        Catch ex As Exception
            Return ex.Message
        End Try


    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetRunningJobDt(ByVal ScheduleVendorid As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct PE.JobBookingID, PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,JCS.JobName as ProductName,JCS.ScheduleQty as OrderQuantity,convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.VendorID,JCS.ScheduleVendorId from ProductionEntry as PE INNER JOIN JobCardSchedule AS JCS ON JCS.VendorID = PE.VendorID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID left join EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner join JobBookingJobCard as JBJC ON JBJC.JobBookingID = PE.JobBookingID where isnull(PE.IsDeletedTransaction,0) <> 1 and PE.CompanyID = " & CompanyId & "  and   isnull(PE.VENDORID,0) = " & ScheduleVendorid
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function AllocatedDT(ByVal ScheduleVendorid As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,JCS.JobName as ProductName,JCS.ScheduleQty as OrderQuantity,convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.VendorID,JCS.ScheduleVendorId from ProductionEntry as PE INNER JOIN JobCardSchedule AS JCS ON JCS.VendorID = PE.VendorID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID left join EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner join JobBookingJobCard as JBJC ON JBJC.JobBookingID != PE.JobBookingID where isnull(PE.IsDeletedTransaction,0) <> 1 and PE.CompanyID = " & CompanyId & "  and   isnull(PE.VENDORID,0) = " & ScheduleVendorid
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDataGrid2(ByVal ScheduleVendorid As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct PE.ProductionQuantity,LM.LedgerName ScheduleVendorName,PM.ProcessName,PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,JCS.JobName as ProductName,JCS.OrderQuantity,convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.ScheduleQty,JCS.VendorID,JCS.ScheduleVendorId from JobCardSchedule as JCS inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID inner Join LedgerMaster as LM on LM.LedgerID = JCS.ScheduleVendorId left join  EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner join ProductionEntry as PE on PE.VendorID = JCS.VendorID inner Join ProcessMaster as PM on PM.ProcessID = PE.ProcessID where isnull(JCS.IsDeletedTransaction,0) <> 1 and JCS.CompanyID = " & CompanyId & "  and   isnull(JCS.ScheduleVendorId,0) = " & ScheduleVendorid
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function NewRunningJob(ByVal JobBookingID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select distinct  LM.LedgerName ScheduleVendorName,JCS.JobName as ProductName,PM.ProcessName,PQ.EnquiryID,EM.EnquiryNo,PQ.EstimateNo as QuotaionNo,JCS.JobName as ProductName,JCS.ScheduleQty as OrderQuantity,convert(CHAR(30),JCS.ExpectedDeliveryDate, 106)ExpectedDeliveryDate,JCS.VendorID,PE.ProductionQuantity from ProductionEntry as PE INNER JOIN JobCardSchedule AS JCS ON JCS.VendorID = PE.VendorID INNER JOIN LedgerMaster AS LM ON LM.LedgerID = PE.VendorID inner Join ProcessMaster as PM on PM.ProcessID = PE.ProcessID inner join ProductQuotation as PQ on PQ.ProductEstimateID = JCS.ProductEstimateID left join EnquiryMain AS EM ON EM.EnquiryID = PQ.EnquiryID inner join JobBookingJobCard as JBJC ON JBJC.JobBookingID = PE.JobBookingID  where isnull(PE.IsDeletedTransaction,0) <> 1  and	PE.CompanyID =" & CompanyId & " and PE.JobBookingID = " & JobBookingID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetAllProcess(ByVal JobBookingID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "select distinct PM.ProcessName,PM.ProcessID from ProductionEntry as PE inner join ProcessMaster as PM on PE.ProcessId = PM.ProcessID where PE.CompanyID = " & CompanyId & " and PE.JobbookingId = " & JobBookingID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetDelAddress(ByVal LedgerId As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

        str = "Select LedgerId,LedgerName,MailingAddress as Address from LedgerMaster Where RefClientID = " & LedgerId & "And LedgerGroupID = 4 UNION ALL Select CompanyID as LedgerId,CompanyName As LedgerName,Address1 as Address fROM CompanyMaster Where CompanyID = " & CompanyId & " order By LedgerID"
        db.FillDataTable(dataTable, str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    Private Function RoundUP(value As Double, decimals As Integer) As Double
        Return Math.Ceiling(value * (10 ^ decimals)) / (10 ^ decimals)
    End Function

    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class