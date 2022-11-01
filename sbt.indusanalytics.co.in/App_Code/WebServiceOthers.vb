Imports System.Data
Imports System.Data.SqlClient
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
Public Class WebServiceOthers
    Inherits System.Web.Services.WebService

    Dim db As New DBConnection
    Dim data As New HelloWorldData()
    Dim js As New JavaScriptSerializer()
    Dim FYear, Str As String
    Dim CompanyId, UserId As Integer
    Dim dataTable As New DataTable

    ''*** Start Internal approval ******''''''
    '--------------------------------- Get Internal approvals data --------------------------
    '<WebMethod(EnableSession:=True)>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Function GetInternalApprovalData(ByVal types As Integer) As String
    '    Try
    '        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    '        UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
    '        Dim UserName As String = Convert.ToString(HttpContext.Current.Session("UserName"))
    '        Dim strFilter = "", column As String = ""
    '        Dim useridStr As String = "JE.CreatedBy"
    '        If types = 0 Then 'Pending For Approval
    '            strFilter = " AND Isnull(JE.IsInternalApproved,0) = 0 And IsNull(JE.IsRework, 0) = 0 AND Isnull(JE.IsCancelled,0) = 0  AND Isnull(JE.IsSendForInternalApproval,0) = 1 "
    '            useridStr = "JE.CreatedBy"
    '        ElseIf types = 1 Then 'Internal Approved
    '            strFilter = " AND Isnull(JE.IsInternalApproved,0) = 1 "
    '            column = ", JE.RemarkInternalApproved "
    '            useridStr = "JE.InternalApprovedUserID"
    '        ElseIf types = 2 Then 'Rework
    '            strFilter = " AND Isnull(JE.IsRework,0) = 1 "
    '            column = ", JE.ReworkRemark "
    '            useridStr = "JE.ReworkBy"
    '        ElseIf types = 3 Then 'Cancelled
    '            strFilter = " AND Isnull(JE.IsCancelled,0) = 1 "
    '            column = ", JE.CancelledRemark "
    '            useridStr = "JE.CancelledBy"
    '        End If
    '        If UserName <> "Admin" Then
    '            strFilter = strFilter & " And Isnull(JE.ApprovalSendTo,0)=" & UserId & " "
    '        End If
    '        Str = "SELECT Distinct JE.ClientName, CM.CategoryName, JE.JobName, JE.BookingNo,Replace(Convert(Nvarchar(30),JE.CreatedDate,106),'','-') As CreatedDate, JE.OrderQuantity, JE.BookingID, JE.MAXBookingNo,JE.LedgerID, UM.UserName, (Select Top 1 Cast(QuotedCost AS Nvarchar(50))+' '+Isnull(CurrencySymbol,'INR') From JobBookingCostings Where BookingID=JE.BookingID And FinalCost=JE.FinalCost) AS QuotedCost,JE.FinalCost, JE.TypeOfCost,Replace(Convert(Nvarchar(30),JE.InternalApprovedDate,106),'','-') As InternalApprovedDate,Nullif(JE.Remark,'') As Remark , JE.EnquiryID " & column & " FROM JobBooking AS JE INNER JOIN CategoryMaster AS CM ON CM.CategoryID=JE.CategoryID AND CM.CompanyID=JE.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID =" & useridStr & "  AND UM.CompanyID=JE.CompanyID Where JE.CompanyID = " & CompanyId & " " & strFilter & "  And Isnull(JE.IsDeletedTransaction,0)=0  Group By JE.ClientName, CM.CategoryName, JE.JobName, JE.BookingNo, JE.CreatedDate, JE.OrderQuantity, JE.BookingID, JE.MAXBookingNo, JE.LedgerID,UM.UserName, JE.FinalCost, JE.TypeOfCost,JE.InternalApprovedDate,JE.Remark, JE.EnquiryID " & column & " Order By JE.BookingID Desc"
    '        db.FillDataTable(dataTable, Str)
    '        data.Message = db.ConvertDataTableTojSonString(dataTable)
    '        Return js.Serialize(data.Message)
    '    Catch ex As Exception
    '        Return ex.Message
    '    End Try
    'End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetInternalApprovalData(ByVal types As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
            Dim DT As New DataTable
            Dim UserName As String = Convert.ToString(HttpContext.Current.Session("UserName"))

            Dim strFilter = "", column As String = ""
            Dim useridStr As String = "PQ.CreatedBy"
            If types = 0 Then 'Pending For Approval
                strFilter = " AND Isnull(PQ.IsInternalApproved,0) = 0 And IsNull(PQ.IsRework, 0) = 0 AND Isnull(PQ.IsCancelled,0) = 0  AND Isnull(PQ.IsSendForiNTERNALApproval,0) = 1 "
                useridStr = " and PQ.ApprovalSendTo"
            ElseIf types = 1 Then 'Internal Approved
                strFilter = " AND Isnull(PQ.IsInternalApproved,0) = 1 "
                column = ", PQ.RemarkInternalApproved "
                useridStr = " and PQ.ApprovalSendTo"
            ElseIf types = 2 Then 'Rework
                strFilter = " AND Isnull(PQ.IsRework,0) = 1 "
                column = ", PQ.ReworkRemark "
                useridStr = " and PQ.ReworkBy"
            ElseIf types = 3 Then 'Cancelled
                strFilter = " AND Isnull(PQ.IsCancelled,0) = 1 "
                column = ", PQ.CancelledRemark "
                useridStr = " and PQ.CancelledBy"
            End If

            Str = "Select PQ.EstimateNo + '_'+  CONVERT(varchar(10),PQ.RevisionNo)  as QuotationNo,convert(varchar, PQ.CreatedDate, 103) As CreatedDate,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark,PQ.ProductEstimateID from ProductQuotation as PQ inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID and LMS.LedgerGroupID =3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy  where PQ.CompanyID =" & CompanyId & " and PQ.IsDeletedTransaction = 0 " & strFilter & useridStr & "=" & UserId & " order by PQ.CreatedDate desc"
            db.FillDataTable(dataTable, Str)
            Str = "Select PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID  where  PQC.IsDeletedTransaction = 0 and PQC.CompanyID = " & CompanyId
            db.FillDataTable(DT, Str)

            DT.TableName = "Contents"
            dataTable.TableName = "Projects"

            Dim dataset As New DataSet
            dataset.Merge(DT)
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
    Public Function InternalApprovalUpdateStatus(ByVal ObjJSJson As Object) As String
        Try
            Dim ObjDT, DTCheck As New DataTable
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserId"))
            db.ConvertObjectToDatatable(ObjJSJson, ObjDT)
            If ObjDT.Rows.Count <= 0 Then
                Return "No data for update status"
            Else
                If ObjDT.Rows(0)(0) = 0 Then 'Pending For Intenal Appproval
                    If ObjDT.Rows(0)(1) = "Approve" Then
                        Str = "Update ProductQuotation Set IsInternalApproved=1,InternalApprovedDate=Getdate(),InternalApprovedUserID=" & UserId & ",RemarkInternalApproved ='" & ObjDT.Rows(0)(2) & "',ApprovedBy=" & UserId & " Where ProductEstimateID=" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId
                    ElseIf ObjDT.Rows(0)(1) = "Rework" Then
                        Str = "Update ProductQuotation Set IsRework =1 ,ReworkDate = Getdate(), ReworkRemark = '" & ObjDT.Rows(0)(2) & "' ,ReworkBy=" & UserId & " Where ProductEstimateID =" & ObjDT.Rows(0)(3) & "  AND CompanyId = " & CompanyId
                    ElseIf ObjDT.Rows(0)(1) = "Reject" Then
                        Str = "Update ProductQuotation Set InternalApprovedUserID=0, IsInternalApproved=0,InternalApprovedDate=Getdate(),RemarkInternalApproved ='',IsCancelled =1 ,CancelledDate = Getdate(), CancelledRemark = '" & ObjDT.Rows(0)(2) & "',CancelledBy=" & UserId & " Where ProductEstimateID =" & ObjDT.Rows(0)(3) & "  AND CompanyId = " & CompanyId
                    End If
                ElseIf ObjDT.Rows(0)(0) = 1 Then 'Intenal Appproved
                    db.FillDataTable(DTCheck, "Select Isnull(IsSendForPriceApproval,0) As IsSendForPriceApproval From ProductQuotation Where ProductEstimateID =" & ObjDT.Rows(0)(3) & " AND CompanyId = " & CompanyId)
                    If DTCheck.Rows.Count > 0 Then
                        If IIf(IsDBNull(DTCheck.Rows(0)(0)), 0, DTCheck.Rows(0)(0)) = 1 Or IIf(IsDBNull(DTCheck.Rows(0)(0)), False, DTCheck.Rows(0)(0)) = True Then
                            Return "Already approved in price approval"
                        End If
                    End If
                    If ObjDT.Rows(0)(1) = "Rework" Then
                        Str = "Update ProductQuotation Set InternalApprovedUserID=0, IsInternalApproved=0,InternalApprovedDate=Getdate(),RemarkInternalApproved ='',IsRework =1 ,ReworkDate = Getdate(), ReworkRemark = '" & ObjDT.Rows(0)(2) & "',ReworkBy=" & UserId & " Where ProductEstimateID=" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId
                    ElseIf ObjDT.Rows(0)(1) = "Reject" Then
                        Str = "Update ProductQuotation Set InternalApprovedUserID=0, IsInternalApproved=0,InternalApprovedDate=Getdate(),RemarkInternalApproved ='',IsCancelled =1 ,CancelledDate = Getdate(), CancelledRemark = '" & ObjDT.Rows(0)(2) & "',CancelledBy=" & UserId & " Where ProductEstimateID =" & ObjDT.Rows(0)(3) & "  AND CompanyId = " & CompanyId
                    End If

                ElseIf ObjDT.Rows(0)(0) = 2 Then 'Rework
                    db.FillDataTable(DTCheck, "Select Max(ProductEstimateID) As MaxProductEstimateID From ProductQuotation Where CompanyId = " & CompanyId & " AND MaxBookingNo IN(Select Distinct MaxBookingNo From ProductQuotation Where ProductEstimateID =" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId & ")")
                    If DTCheck.Rows.Count > 0 Then
                        If IIf(IsDBNull(DTCheck.Rows(0)(0)), 0, DTCheck.Rows(0)(0)) > ObjDT.Rows(0)(3) Then
                            Return "Another revision of this quote is exists, can't update status..!"
                        End If
                    End If
                    If ObjDT.Rows(0)(1) = "Approve" Then
                        Str = "Update ProductQuotation Set IsInternalApproved=1,InternalApprovedDate=Getdate(),RemarkInternalApproved ='" & ObjDT.Rows(0)(2) & "',InternalApprovedUserID=" & UserId & ",IsRework =0 ,ReworkDate = Getdate(), ReworkRemark = '' Where ProductEstimateID=" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId
                    End If
                    'ElseIf ObjDT.Rows(0)(0) = 3 Then
                    '    If ObjDT.Rows(0)(1) = "Approve" Then
                    '        Str = "Update ProductQuotation Set IsInternalApproved=1,InternalApprovedDate=Getdate(),RemarkInternalApproved ='" & ObjDT.Rows(0)(2) & "',InternalApprovedUserID=" & UserId & ",IsCancelled =0 ,CancelledDate = Getdate(), CancelledRemark = '' Where ProductEstimateID=" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId
                    '    ElseIf ObjDT.Rows(0)(1) = "Rework" Then
                    '        Str = "Update ProductQuotation Set IsCancelled =0 ,CancelledDate = Getdate(), CancelledRemark = '',IsRework =1 ,ReworkDate = Getdate(), ReworkRemark = '" & ObjDT.Rows(0)(2) & "',ReworkBy=" & UserId & " Where ProductEstimateID=" & ObjDT.Rows(0)(3) & " And CompanyID=" & CompanyId
                    '    End If
                End If
            End If
            Str = db.ExecuteNonSQLQuery(Str)
            Return Str
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    ''***********End IA
    ''---------------------------- Start Cost Approval Code  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CostApprovalEnquiryNo() As String
        Dim MaxApprovalNo As Integer
        Dim EnquiryNo As String
        FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        EnquiryNo = db.GeneratePrefixedNo("JobApprovedCost", "A", "MaxApprovalNo", MaxApprovalNo, FYear, " Where CompanyId = " & CompanyId & " AND Isnull(IsDeletedTransaction,0)=0")
        Return EnquiryNo
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CostApprovalQuoteLoad() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable

            Context.Response.Clear()
            Context.Response.ContentType = "application/json"
            'Dim str = "SELECT JE.BookingID,Replace(Nullif(JE.ClientName,''),' ','') As ClientName,Nullif(LM.Address,'') as Address, nullif(LM.Phone,'') as Phone,JE.CategoryID , Nullif(JE.JobName,'') as JobName, Nullif(JE.ProductCode,'') As ProductCode, JE.BookingNo,Replace(Convert(Nvarchar(30),JE.CreatedDate,106),'','-') as JobDate,nullif(JE.OrderQuantity,'') As OrderQuantity, JE.LedgerID, Nullif(JE.BookingRemark,'') As BookingRemark, Nullif(UM.UserName,'') as UserName, Nullif(JE.Remark,'') As Remark FROM JobBooking As JE INNER JOIN UserMaster As UM On UM.UserID = JE.QuotedByUserID Inner Join LedgerMaster As LM On JE.LedgerID = LM.LedgerID And ISNULL(JE.IsApproved,0) = 0 And ISNULL(JE.IsBooked,0) = 0  And ISNULL(JE.IsSendForPriceApproval,0) <> 0   And JE.CompanyID = " & CompanyId & " Order by JE.MaxBookingNo desc "
            'Str = "SELECT JE.BookingID,Replace(Nullif(JE.ClientName,''),' ','') As ClientName,Nullif(LM.Address1,'') as Address, nullif(LM.MobileNo,'') as PhoneNo,JE.CategoryID , Nullif(JE.JobName,'') as JobName, Nullif(JE.ProductCode,'') As ProductCode, JE.BookingNo,Replace(Convert(Nvarchar(30),JE.CreatedDate,106),'','-') As JobDate,nullif(JE.OrderQuantity,'') As OrderQuantity, JE.LedgerID, Nullif(JE.BookingRemark,'') As BookingRemark, Nullif(JE.Remark,'') As Remark FROM JobBooking As JE Inner Join (SELECT Distinct LedgerID, LedgerName, MailingName, Address1, Case When Isnull(TelephoneNo,'')='' then MobileNo Else TelephoneNo End As MobileNo, Email,RefSalesRepresentativeID,ISLedgerActive, PANNo, GSTNo, State, City, Isnull(Country,'') As Country, MailingAddress,Pincode, ItemGroupName From (Select Distinct LedgerID,IMD.LedgerGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From LedgerMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.LedgerGroupID And IMD.CompanyID=IG.CompanyID  Where IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1 )x unpivot  (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([LedgerName], [MailingName], [Address1], [TelephoneNo], [MobileNo], [Email], [RefSalesRepresentativeID], [ISLedgerActive], [PANNo],[GSTNo], [State], [City], [Country], [MailingAddress], [Pincode])) P ) As LM On JE.LedgerID = LM.LedgerID And ISNULL(JE.IsApproved,0) = 0 And ISNULL(JE.IsBooked,0) = 0  And ISNULL(JE.IsSendForPriceApproval,0) <> 0   And JE.CompanyID = " & CompanyId & " Order by JE.MaxBookingNo desc "
            Str = "Select PQ.EstimateNo + '_'+  CONVERT(varchar(10),PQ.RevisionNo)  as QuotationNo,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark,PQ.ProductEstimateID,LM.Address1,LM.TelephoneNo as PhoneNo,'-' as ProductCode,Replace(Convert(Nvarchar(30),PQ.CreatedDate,106),'','-') as JobDate,PQ.Narration,LM.LedgerID,Round(Sum(PQC.MiscAmount),2) as MiscAmount,Round(Sum(PQC.GSTAmount),2) as GSTAmount,Round(Sum(PQC.ShippingCost),2) as ShippingCost,Round(Sum(PQC.FinalAmount),2) as FinalAmount,Round(Sum(PQC.ProfitCost),2) as ProfitCost from ProductQuotation as PQ inner join ProductQuotationContents as PQC on PQ.ProductEstimateID = PQC.ProductEstimateID and PQ.CompanyID = PQC.CompanyID inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID and LMS.LedgerGroupID =3 inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy  where PQ.CompanyID =" & CompanyId & " and PQ.IsDeletedTransaction = 0 AND ISNULL(PQ.IsSendForPriceApproval,0) =1 AND ISNULL(PQ.ISAPPROVED,0) =0 Group by   PQ.EstimateNo + '_'+  CONVERT(varchar(10),PQ.RevisionNo) ,PQ.ProjectName, LM.LedgerName,LMS.LedgerName ,PQ.FreightAmount,UM.UserName,PQ.Narration,PQ.ProductEstimateID,LM.Address1,LM.TelephoneNo,PQ.CreatedDate,PQ.Narration,LM.LedgerID "
            db.FillDataTable(dataTable, Str)
            Str = "Select PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID  where  PQC.IsDeletedTransaction = 0 and PQC.CompanyID = " & CompanyId
            db.FillDataTable(Dt, Str)

            Dt.TableName = "Contents"
            dataTable.TableName = "Projects"
            Dim dataset As New DataSet
            dataset.Merge(Dt)
            dataset.Merge(dataTable)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Context.Response.Write(ex.Message)
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Sub CostApprovalShowlist()

        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        data.Message = db.ConvertDataTableTojSonString(GetDataTablePriceApprovalShowlist)
        js.MaxJsonLength = 2147483647
        Context.Response.Write(js.Serialize(data.Message))
    End Sub

    Private Function GetDataTablePriceApprovalShowlist() As DataTable
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Str = "Select Distinct Replace(Nullif(LM.Address1,''),'""','') as Address,Replace(Nullif(JE.ClientName,''),'""','') as ClientName,Replace(Nullif(JE.ProductCode,''),'""','') as ProductCode,Replace(Nullif(JE.BookingRemark,''),'""','') as BookingRemark,LM.MobileNo as PhoneNo,JAP.ApprovalNo,Replace(Convert(Nvarchar(30),JAP.AppliedDateValidUpTo,106),'','-') As AppliedDateTo,  " &
               " Replace(Convert(Nvarchar(30),JAP.PriceApprovedDate,106),'','-')as PriceApprovedDate, JAP.BookingID, JAP.BookingNo ,Replace(Convert(Nvarchar(30),JE.CreatedDate,106),'','-') as JobDate, Replace(Nullif(JAP.JobName,''),'""','') as JobName,JAP.OrderQuantity, JAP.FinalCost,   " &
               " Replace(Nullif(UM.UserName,''),'""','') as UserName,UM.UserId, Replace(Nullif(JE.Remark,''),'""','') as Remark, Replace(Nullif(JAP.Remark,''),'""','') as RemarkJAP, JAP.LedgerID, JAP.CategoryID,JAP.ApprovalID  FROM JobApprovedCost AS JAP INNER JOIN (SELECT Distinct LedgerID, LedgerName,CompanyID , MailingName, Address1, Case When Isnull(TelephoneNo,'')='' then MobileNo Else TelephoneNo End As MobileNo, Email,RefSalesRepresentativeID,ISLedgerActive, PANNo, GSTNo, State, City, Isnull(Country,'') As Country, MailingAddress,Pincode, ItemGroupName From (Select Distinct LedgerID,IMD.LedgerGroupID,IG.ItemGroupName,IMD.CompanyID,IMD.UserID AS [UserID],convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From LedgerMasterDetails As IMD Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.LedgerGroupID And IMD.CompanyID=IG.CompanyID  Where IMD.CompanyID=" & CompanyId & " And Isnull(IG.IsDeletedTransaction,0)<>1 )x unpivot  (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([LedgerName], [MailingName], [Address1], [TelephoneNo], [MobileNo], [Email], [RefSalesRepresentativeID], [ISLedgerActive], [PANNo],[GSTNo], [State], [City], [Country], [MailingAddress], [Pincode])) P ) AS LM ON JAP.LedgerID = LM.LedgerID And LM.CompanyID = JAP.CompanyID And JAP.CompanyID = " & CompanyId & " INNER JOIN JobBooking As JE ON JE.BookingID = JAP.BookingID " &
               " INNER JOIN CategoryMaster As CM On CM.CategoryID =JAP.CategoryID INNER JOIN UserMaster As UM On UM.UserID = JAP.UserID Where Isnull(JAP.IsDeletedTransaction,0)= 0 And JAP.CompanyID=" & CompanyId & " Order By JAP.ApprovalID Desc "
        db.FillDataTable(dataTable, Str)
        Return dataTable
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridDataForApprovalWindow(ByVal BookingID As Integer, ByVal Flag As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        If Flag = False Then
            Str = "Select PlanContQty As Quantity,TotalCost As Total,MiscCost,ProfitCost As Profit,DiscountAmount,TaxAmount,GrandTotalCost As GrandTotal,UnitCost,UnitCost1000,FinalCost,QuotedCost,Isnull(CurrencySymbol,'INR') AS CurrencySymbol,Isnull(ConversionValue,1) AS ConversionValue From JobBookingCostings Where BookingID = " & BookingID & "  And CompanyId = " & CompanyId & "   AND Isnull(IsDeletedTransaction,0)=0 "
        Else
            Str = "Select OrderQuantity as Quantity,TotalCost As Total,MiscCost,ProfitCost As Profit,DiscountPercentage,TaxPercentage,GrandTotal,UnitCost,UnitCost1000 ,QuotedFinalCost,QuotedCost,FinalCost,Isnull(CurrencySymbol,'INR') AS CurrencySymbol,Isnull(ConversionValue,1) AS ConversionValue From JobApprovedCost Where BookingID = " & BookingID & "  And CompanyId = " & CompanyId & "  AND Isnull(IsDeletedTransaction,0)=0 "
        End If
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        Return js.Serialize(data.Message)
    End Function

    ''**********************************************   Save Cost Approval   *****************************************************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCostApprovalData(ByVal CAData As Object, ByVal BKID As Integer, ByVal Flag As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim dt As New DataTable
        Dim con As New SqlConnection

        Dim MaxApprovalNo As Integer
        Dim KeyField, ApprovalNo As String
        Dim AddColName, AddColValue, TableName As String

        MaxApprovalNo = db.GenerateMaxVoucherNo("JobApprovedCost", "MaxApprovalNo", " Where CompanyId = " & CompanyId & " AND Isnull(IsDeletedTransaction,0)=0")
        ApprovalNo = db.GeneratePrefixedNo("JobApprovedCost", "A", "MaxApprovalNo", MaxApprovalNo, FYear, " Where CompanyId = " & CompanyId & " AND Isnull(IsDeletedTransaction,0)=0")

        AddColName = ""
        AddColValue = ""
        Try
            If Flag = "true" Or Flag = True Then
                If db.CheckAuthories("CostApproval.aspx", UserId, CompanyId, "CanEdit") = False Then Return "You are not authorized to update..!"

                TableName = "JobApprovedCost"
                KeyField = db.UpdateDatatableToDatabase(CAData, TableName, "", 1, "CompanyId=" & CompanyId)
                If KeyField = "Success" Then KeyField = "Update"
            Else
                If db.CheckAuthories("CostApproval.aspx", UserId, CompanyId, "CanSave") = False Then Return "You are not authorized to save..!"

                TableName = "JobApprovedCost"
                AddColName = "CompanyId, UserId,ApprovedBy,FYear,BookingId,ApprovalNo,MaxApprovalNo,ModifiedDate"
                AddColValue = "'" & CompanyId & "','" & UserId & "','" & UserId & "','" & FYear & "','" & BKID & "','" & ApprovalNo & "','" & MaxApprovalNo & "','" & DateTime.Now & "'"
                db.InsertDatatableToDatabase(CAData, TableName, AddColName, AddColValue)

                Str = "UPDATE ProductQuotation SET ISAPPROVED = 1  WHERE ProductEstimateID = '" & BKID & "' And CompanyId = " & CompanyId & " "
                db.ExecuteNonSQLQuery(Str)

                KeyField = "Save"
            End If

        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    ''**********************************************   Delete Cost Approval   *****************************************************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteCostApproval(ByVal BookingID As Integer) As String
        Dim KeyField As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
        If db.IsDeletable("ApprovalNo", "ProductMaster", "Where BookingId = '" & BookingID & "'  And CompanyId = " & CompanyId & " ") = False Then
            KeyField = "false"
            Return KeyField
            Exit Function
        End If
        If db.IsDeletable("ApprovalNo", "JobOrderBooking", "Where BookingId = '" & BookingID & "' And CompanyId = " & CompanyId & " ") = False Then
            KeyField = "false"
            Return KeyField
            Exit Function
        End If
        'If db.IsDeletable("BookingNo", "JobEstimationJobcard", "Where BookingId = '" & BookingID & "' And CompanyId = " & CompanyId & " ") = False Then
        '    KeyField = "false"
        '    Return KeyField
        '    Exit Function
        'End If
        If db.CheckAuthories("CostApproval.aspx", UserId, CompanyId, "CanDelete") = False Then Return "You are not authorized to delete..!"

        Try

            Str = "UPDATE JobApprovedCost Set IsDeletedTransaction=1,DeletedDate=Getdate(),DeletedBy=" & UserId & " Where BookingId =" & BookingID & " And CompanyId =" & CompanyId & " "
            db.ExecuteNonSQLQuery(Str)

            Str = "UPDATE JobBooking SET IsApproved = 0 Where BookingId = '" & BookingID & "' And CompanyId =" & CompanyId & " "
            db.ExecuteNonSQLQuery(Str)

            KeyField = "Success"
        Catch ex As Exception
            KeyField = ex.Message
        End Try
        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Sub CostingApprovalBookingLoad()
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim Dt As New DataTable

            Context.Response.Clear()
            Context.Response.ContentType = "application/json"

            Str = "SELECT DISTINCT JE.ClientName, JE.JobName, CM.CategoryName,JE.BookingNo,Replace(Convert(Nvarchar(30),JE.CreatedDate,106),'','-') As CreatedDate,JE.BookingID,SQA.ApprovalNo FROM JobBooking AS JE INNER JOIN CategoryMaster AS CM ON JE.CategoryID = CM.CategoryID LEFT OUTER JOIN ReverseCalculationBookingsApproved AS SQA ON  SQA.ReverseCostBookingNo =BookingNo WHERE (JE.CreatedBy = " & UserId & ") And JE.CompanyID=" & CompanyId & " And ISNULL(JE.ISAPPROVED,0)<>1 Order BY JE.ClientName, JE.JobName, CM.CategoryName,SQA.ApprovalNo"
            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            js.MaxJsonLength = 2147483647
            Context.Response.Write(js.Serialize(data.Message))
        Catch ex As Exception
            Context.Response.Write(ex.Message)
        End Try
    End Sub

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GridDataForCostingWindow(ByVal BKID As Integer) As String
        Try
            Dim DtJob, DtPrices, DtCost As New DataTable

            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Str = "SELECT JB.BookingID, JB.LedgerID, JB.Remark, JB.ClientName, JB.JobName, JB.EnquiryID, JB.ProductCode, JCS.SizeHeight, JCS.SizeLength, JCS.SizeWidth, Case When Isnull(JBC.JobCloseSize,'')='' Then 'H:'+JCS.SizeHeight+',L:'+ JCS.SizeLength+ ',W:'+JCS.SizeWidth Else JBC.JobCloseSize End As JobCloseSize, Stuff((Select ProcessName + ' ,'  From ProcessMaster Where ProcessID In (Select ProcessID From JobBookingProcess  Where BookingID=JB.BookingID And ContentsID=JBC.JobContentsID And PlanContQty = JBC.PlanContQty) For XML PATH('')),2,2,'') AS Process, JBC.MainPaperName, JB.BookingNo, Replace(Convert(Nvarchar(30),JB.CreatedDate,106),'','-') As CreatedDate, JBC.PlanContentType, JBC.JobContentsID FROM CategoryMaster INNER JOIN JobBooking AS JB ON CategoryMaster.CategoryID = JB.CategoryID And JB.CompanyID=" & CompanyId & " INNER JOIN JobBookingContents AS JBC ON JB.BookingID = JBC.BookingID INNER JOIN ViewJobBookingContents AS JCS ON JCS.BookingID = JBC.BookingID AND JCS.CompanyID = JBC.CompanyID  WHERE JB.BookingID = " & BKID
            db.FillDataTable(DtJob, Str)

            Str = "SELECT IsNull(PlanContQty,0) As Quantity,(Round(Sum(Isnull(ProfitCost,0))+Sum(Isnull(MiscCost,0))+Sum(Isnull(TotalCost,0)),3)) As TotalCost FROM JobBookingCostings Where BookingID = " & BKID & " And CompanyID=" & CompanyId & " Group by PlanContQty Order By PlanContQty"
            db.FillDataTable(DtPrices, Str)

            Str = "SELECT ROUND(SUM(JC.PlateAmount),3) as Plate,ROUND(SUM(JC.PrintingAmount),3) as Printing,ROUND((SUM(JC.PaperAmount)),3) As Paper,ROUND(SUM(ISNULL(ProfitCost,0)),3) As ProfitCost,ROUND(SUM(ISNULL(MiscCost,0)),3) As MiscCost,ROUND(SUM(ISNULL(JC.OpAmt,0)),3) As ProcessCost,JBC.PlanContQty As Quantity  FROM JobBookingCostings As JBC Inner Join JobBookingContents As JC On JBC.BookingID=JC.BookingID And JC.PlanContQty=JBC.PlanContQty And JC.CompanyID=JBC.CompanyID WHERE JBC.BookingID=" & BKID & "  Group By JBC.PlanContQty"
            db.FillDataTable(DtCost, Str)

            DtJob.TableName = "DTDetails"
            DtPrices.TableName = "DTPrices"
            DtCost.TableName = "DTCosts"

            Dim dataset As New DataSet
            dataset.Merge(DtJob)
            dataset.Merge(DtPrices)
            dataset.Merge(DtCost)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    '******************************************* End Cost Approval ************************************************'
    '******************************************* Start Sales Order Booking************************************************'
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadOrderBookingData() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable
            'Str = "Select JOB.OrderBookingID,JOB.BookingID,JOB.LedgerID,JOB.ProductMasterID,JOB.SalesEmployeeID,JOB.MaxOrderBookingNo,JOB.MaxSalesOrderNo,JOB.SalesOrderNo,JOB.OrderBookingDate,JOB.OrderBookingNo,LM.LedgerName As ClientName,CM.CategoryName,JOB.ProductMasterCode,JOB.BookingNo,JOB.ProductCode,JOB.JobName,JOB.OrderQuantity,JOB.DeliveryDate,JOB.PONo,JOB.PODate,EM.LedgerName,JOB.ApprovalNo,UM.UserName As BookedBy,JOB.IsBooked,JOB.FYear,LM.City,LM.State,Isnull(JOB.OrderApproved,0) AS OrderApproved,JOB.HoldRemark,LM.StateTinNo,Isnull(JOB.IsJobWorkOrder,0) AS JobWork,Isnull(JOB.IsDirectOrder,0) AS DirectOrder " &
            '    "From JobOrderBooking As JOB INNER JOIN LedgerMaster As LM ON JOB.LedgerID = LM.LedgerID And LM.UnderGroupID=27 AND JOB.CompanyID=LM.CompanyID INNER JOIN UserMaster As UM ON UM.UserID=JOB.UserID AND UM.CompanyID=JOB.CompanyID INNER JOIN CategoryMaster AS CM ON JOB.CategoryID = CM.CategoryID AND CM.CompanyID=JOB.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID = JOB.SalesEmployeeID AND EM.CompanyID=JOB.CompanyID Where JOB.CompanyId =" & CompanyId & " AND Isnull(JOB.IsProofingOrder,0)=0 AND  Isnull(JOB.IsTempOrder,0)=0   " &
            '    "Group By JOB.OrderBookingID,JOB.BookingID,JOB.LedgerID,JOB.ProductMasterID,JOB.SalesEmployeeID,JOB.MaxOrderBookingNo, JOB.MaxSalesOrderNo,JOB.SalesOrderNo,JOB.OrderBookingDate,JOB.OrderBookingNo,LM.LedgerName,CM.CategoryName,JOB.ProductMasterCode,JOB.BookingNo,JOB.ProductCode, JOB.JobName,JOB.OrderQuantity,JOB.DeliveryDate,JOB.PONo,JOB.PODate,EM.LedgerName,JOB.ApprovalNo,UM.UserName,JOB.ISBooked,JOB.FYear,LM.City,LM.State,JOB.OrderApproved,JOB.HoldRemark,LM.StateTinNo,JOB.IsJobWorkOrder,JOB.IsDirectOrder  Order by JOB.OrderBookingID Desc"
            Str = "SELECT JOB.OrderBookingID, JOB.BookingID, JOB.LedgerID, JOB.ProductMasterID, JOB.SalesEmployeeID, JOB.MaxSalesOrderNo, JOB.SalesOrderNo,Replace(Convert(Varchar(13),JOB.OrderBookingDate,106),' ','-') As OrderDate, LM.LedgerName AS ClientName, CM.CategoryName, JOB.ProductMasterCode, JOB.BookingNo, JOB.ProductCode, JOB.JobName, JOB.OrderQuantity,Replace(Convert(Varchar(13),JOB.DeliveryDate,106),' ','-') As DeliveryDate, JOB.PONo,Replace(Convert(Varchar(13),JOB.PODate,106),' ','-') As PODate, EM.LedgerName, JOB.ApprovalNo, UM.UserName AS BookedBy, JOB.IsBooked, JOB.FYear, LM.City, LM.State, ISNULL(JOB.OrderApproved, 0) AS OrderApproved, JOB.HoldRemark, LM.StateTinNo, ISNULL(JOB.IsJobWorkOrder, 0) AS JobWork,  ISNULL(JOB.IsDirectOrder, 0) AS DirectOrder FROM JobOrderBookingDetails AS JOB INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country],A.StateTinNo From  (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country],[StateTinNo] FROM  (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') As FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country],[StateTinNo])) p) AS A) AS LM ON JOB.LedgerID = LM.LedgerID AND JOB.CompanyID = LM.CompanyID And Isnull(JOB.IsDeletedTransaction,0)=0 INNER JOIN UserMaster AS UM ON UM.UserID = JOB.UserID AND UM.CompanyID = JOB.CompanyID INNER JOIN CategoryMaster AS CM ON JOB.CategoryID = CM.CategoryID AND CM.CompanyID = JOB.CompanyID LEFT OUTER JOIN " &
                 "LedgerMaster AS EM ON EM.LedgerID = JOB.SalesEmployeeID AND EM.CompanyID = JOB.CompanyID WHERE (JOB.CompanyID = " & CompanyId & ") AND (ISNULL(JOB.IsProofingOrder, 0) = 0) AND (ISNULL(JOB.IsTempOrder, 0) = 0) GROUP BY JOB.OrderBookingID, JOB.BookingID, JOB.LedgerID, JOB.ProductMasterID, JOB.SalesEmployeeID, JOB.MaxSalesOrderNo, JOB.SalesOrderNo, JOB.OrderBookingDate, LM.LedgerName, CM.CategoryName, JOB.ProductMasterCode, JOB.BookingNo, JOB.ProductCode, JOB.JobName, JOB.OrderQuantity, JOB.DeliveryDate, JOB.PONo, JOB.PODate, EM.LedgerName, JOB.ApprovalNo, UM.UserName, JOB.IsBooked, JOB.FYear, LM.City, LM.State, JOB.OrderApproved, JOB.HoldRemark, LM.StateTinNo, JOB.IsJobWorkOrder, JOB.IsDirectOrder ORDER BY JOB.OrderBookingID DESC"
            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadOBProductsData(ByVal LedgerID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable
            'Str = "Select Case JE.BookingID, JE.LedgerID,CM.CategoryID,JE.ProductHSNID,JE.SalesEmployeeID,JE.EnquiryID, JE.MAXBookingNo,LM.LedgerName,JE.JobName,JE.ProductCode, CM.CategoryName, JE.BookingNo, Replace(Convert(Varchar(13),JE.CreatedDate,106),' ','-') AS QuoteDate,PGM.HSNCode,PGM.ProductHSNName,Isnull(JAP.ApprovalNo,'') AS ApprovalNo,EM.LedgerName, 0 AS Quantity,JE.FinalCost, JE.TypeOfCost,JE.ExpectedCompletionDays,PGM.GSTTaxPercentage,PGM.CGSTTaxPercentage,PGM.SGSTTaxPercentage,PGM.IGSTTaxPercentage  FROM JobBooking As JE INNER JOIN LedgerMaster As LM ON LM.LedgerID=JE.LedgerID AND JE.CompanyID=LM.CompanyID INNER JOIN CategoryMaster As CM ON JE.CategoryID = CM.CategoryID AND JE.CompanyID = CM.CompanyID And Isnull(JE.IsSendForPriceApproval,0) =1  And Not Exists (Select P.BookingID FROM ProductMaster As P Where JE.BookingID=P.BookingID AND JE.CompanyID=P.CompanyID)  LEFT JOIN ProductHSNMaster AS PGM ON PGM.ProductHSNID=JE.ProductHSNID AND PGM.CompanyID=JE.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=JE.SalesEmployeeID AND EM.CompanyID=JE.CompanyID LEFT JOIN JobApprovedCost As JAP ON JAP.BookingID = JE.BookingID AND JAP.CompanyID = JE.CompanyID Where JE.CompanyID=" & CompanyId & " AND JE.LedgerID=" & LedgerID & " Group by LM.LedgerName, CM.CategoryName, JE.JobName,JE.MaxBookingNo, JE.BookingNo,JE.CreatedDate,JE.BookingID, JE.MAXBookingNo, JE.LedgerID,JAP.ApprovalNo, JE.FinalCost, JE.TypeOfCost,JE.EnquiryID,CM.CategoryID,JE.ProductCode, JE.ExpectedCompletionDays,JE.ProductHSNID,PGM.ProductHSNName,PGM.HSNCode,JE.SalesEmployeeID,EM.LedgerName,PGM.GSTTaxPercentage,PGM.CGSTTaxPercentage,PGM.SGSTTaxPercentage,PGM.IGSTTaxPercentage"
            'Str = "Select BookingID,LedgerID,CategoryID,ProductHSNID,ProductMasterID,JobCoordinatorID,EnquiryID,MAXBookingNo,MaxPMCode,LedgerName,OrderEnquiryNo,OrderDate,FinalDeliveryDate , JobName, ProductCode, CategoryName, EnquiryNo, BookingNo, QuoteDate, PMCode As ProductMasterCode, PMDate, HSNCode, ProductHSNName, ApprovalBy, ApprovalNo,EmployeeName , PONo, PoDate, quantity, FinalCost, TypeOfCost, JobPriority, PrePressRemark, JobType, JobReference, ExpectedCompletionDays, City,ClientState, ModifiedDate, LastODate, PMBy,ApprovalBy,OrderRate,SalesOrderImgPath,ItemOrderNo,Remark,GSTTaxPercentage,CGSTTaxPercentage,SGSTTaxPercentage,IGSTTaxPercentage,OrderQuantity,QuoteRate,ApprovedRate ,TotalAmount,CompanyState From (SELECT  JE.BookingID, JE.LedgerID,CM.CategoryID,JE.ProductHSNID,0 AS ProductMasterID,0 AS JobCoordinatorID,JE.EnquiryID, JE.MAXBookingNo,0 AS MaxPMCode,LM.LedgerName,'' AS OrderEnquiryNo,'' AS OrderDate,'' AS FinalDeliveryDate,JE.JobName,JE.ProductCode, CM.CategoryName, '' AS EnquiryNo,JE.BookingNo, Replace(Convert(Varchar(13),JE.CreatedDate,106),' ','-') AS QuoteDate,'' AS PMCode,'' AS PMDate,PGM.HSNCode,PGM.ProductHSNName,'' AS ApprovedBy,Isnull(JAP.ApprovalNo,'') AS ApprovalNo,EM.LedgerName As EmployeeName,'' AS PONo,'' AS PODate, 0 AS Quantity,JE.FinalCost, JE.TypeOfCost, '' AS JobPriority,'' AS PrePressRemark,'' AS JobType,'' AS JobReference,  JE.ExpectedCompletionDays,LM.City,LM.State As ClientState,'' AS ModifiedDate,'' AS LastODate,'' AS PMBy,'' AS ApprovalBy,0 AS OrderRate,'' AS SalesOrderImgPath,'' AS ItemOrderNo,'' AS Remark,Isnull(PGM.GSTTaxPercentage,0) As GSTTaxPercentage,Isnull(PGM.CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(PGM.SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(PGM.IGSTTaxPercentage,0) As IGSTTaxPercentage,0 As OrderQuantity,0 As QuoteRate,0 As ApprovedRate ,0 As TotalAmount,(Select State From CompanyMaster Where CompanyID=" & CompanyId & ") As CompanyState  FROM JobBooking As JE INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24)  )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) As LM ON LM.LedgerID=JE.LedgerID AND JE.CompanyID=LM.CompanyID INNER JOIN CategoryMaster As CM ON JE.CategoryID = CM.CategoryID AND JE.CompanyID = CM.CompanyID And Isnull(JE.IsSendForPriceApproval,0)  =1  And Not Exists (Select P.BookingID FROM ProductMaster As P Where JE.BookingID=P.BookingID AND JE.CompanyID=P.CompanyID) LEFT JOIN ProductHSNMaster AS PGM ON PGM.ProductHSNID=JE.ProductHSNID AND PGM.CompanyID=JE.CompanyID LEFT JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] " &
            '        "From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) AS EM ON EM.LedgerID=JE.LedgerID AND EM.CompanyID=JE.CompanyID  LEFT JOIN JobApprovedCost As JAP ON JAP.BookingID = JE.BookingID AND JAP.CompanyID = JE.CompanyID Where JE.CompanyID=" & CompanyId & "  AND JE.LedgerID=" & LedgerID & " Group by LM.LedgerName, CM.CategoryName, JE.JobName,JE.MaxBookingNo, JE.BookingNo,JE.CreatedDate,JE.BookingID, JE.MAXBookingNo, JE.LedgerID,JAP.ApprovalNo, JE.FinalCost, JE.TypeOfCost,JE.EnquiryID,CM.CategoryID,JE.ProductCode, JE.ExpectedCompletionDays,LM.City,JE.ProductHSNID,PGM.ProductHSNName,PGM.HSNCode,JE.LedgerID,EM.LedgerName,PGM.GSTTaxPercentage,PGM.CGSTTaxPercentage,PGM.SGSTTaxPercentage,PGM.IGSTTaxPercentage,LM.State Union All " &
            '        "SELECT Distinct PM.BookingID,PM.LedgerId,CM.CategoryID,PMG.ProductHSNID,PM.ProductMasterID,PM.JobCoordinatorID,0 AS EnquiryID,JE.MAXBookingNo,PM.MaxProductMasterCode,LM.LedgerName,'' AS OrderEnquiryNo,'' AS OrderDate,'' AS FinalDeliveryDate, PM.JobName,PM.ProductCode,CM.CategoryName,'' AS EnquiryNo,JE.BookingNo,'' AS QuoteDate,PM.ProductMasterCode,Replace(Convert(Varchar(13),PM.CreatedDate,106),' ','-') AS PMDate,PMG.HSNCode,PMG.ProductHSNName,'' AS ApprovedBy,Isnull(JPA.ApprovalNo,'') AS ApprovalNo,EM.LedgerName As EmployeeName,'' AS PONo,'' AS PODate,0 AS OrderQuantity,0 AS FinalCost, Case When Isnull(JE.BookingID,0)>0 THEN JE.TypeOfCost ELSE PM.RateType END AS TypeOfCost,'' AS JobPriority,'' AS PrePressRemark,PM.JobType,PM.JobReference,  0 AS ExpcCompDays,LM.City,LM.State As ClientState,Replace(Convert(Varchar(13),PM.ModifiedDate,106),' ','-') AS ModifiedDate,Replace(Convert(Varchar(13),A.LastODRDate,106),' ','-')  As [Last use date],UM.UserName,'' AS ApprovalBy,0 AS OrderRate,'' AS SalesOrderImgPath,'' AS ItemOrderNo,'' AS Remark,Isnull(PMG.GSTTaxPercentage,0) As GSTTaxPercentage,Isnull(PMG.CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(PMG.SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(PMG.IGSTTaxPercentage,0) As IGSTTaxPercentage,0 As OrderQuantity,0 As QuoteRate,0 As ApprovedRate ,0 As TotalAmount,(Select State From CompanyMaster Where CompanyID=" & CompanyId & ") As CompanyState  FROM ProductMaster AS PM  INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24) )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) As LM ON LM.LedgerId = PM.LedgerID AND LM.CompanyID=PM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID = PM.CreatedBy AND UM.CompanyID=PM.CompanyID INNER JOIN CategoryMaster As CM ON CM.CategoryId = PM.CategoryID  AND CM.CompanyID=PM.CompanyID And Isnull(PM.IsHidden,0)=0  " &
            '        "LEFT JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27) )x unpivot (value for name in ([FieldValue])) up Pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) AS EM ON EM.LedgerID=PM.LedgerID AND EM.CompanyID=PM.CompanyID LEFT JOIN ProductHSNMaster AS PMG ON PMG.ProductHSNID=PM.ProductHSNID AND PMG.CompanyID=PM.CompanyID  LEFT JOIN JobBooking As JE ON JE.BookingID = PM.BookingID AND JE.CompanyID=PM.CompanyID LEFT JOIN JobApprovedCost as JPA on PM.BookingID = JPA.BookingID AND PM.CompanyID = JPA.CompanyID LEFT JOIN (SELECT CompanyID,Max(OrderBookingDate) As LastODRDate,ProductMasterCode  FROM JobOrderBookingDetails Where CompanyID=" & CompanyId & "  Group By ProductMasterCode,CompanyID) As A ON A.ProductMasterCode=PM.ProductMasterCode AND A.CompanyID=PM.CompanyID Where PM.CompanyID=" & CompanyId & "   AND PM.LedgerID=" & LedgerID & ") AS AL  Where LedgerID=" & LedgerID & " Order By JobName"

            'Str = "Select BookingID,LedgerID,CategoryID,ProductHSNID,ProductMasterID,JobCoordinatorID,EnquiryID,MAXBookingNo,MaxPMCode,LedgerName,OrderEnquiryNo,OrderDate,FinalDeliveryDate , JobName, ProductCode, CategoryName, EnquiryNo, BookingNo, QuoteDate, PMCode As ProductMasterCode, PMDate, HSNCode, ProductHSNName, ApprovalBy, ApprovalNo,EmployeeName , PONo, PoDate, quantity, FinalCost, TypeOfCost, JobPriority, PrePressRemark, JobType, JobReference, ExpectedCompletionDays, City,ClientState, ModifiedDate, LastODate, PMBy,ApprovalBy,OrderRate,SalesOrderImgPath,ItemOrderNo,Remark,GSTTaxPercentage,CGSTTaxPercentage,SGSTTaxPercentage,IGSTTaxPercentage,CurrencySymbol,OrderQuantity,QuoteRate,ApprovedRate ,TotalAmount,CompanyState " &
            '      " From (SELECT  JE.BookingID, JE.LedgerID,CM.CategoryID,JE.ProductHSNID,0 AS ProductMasterID,0 AS JobCoordinatorID,JE.EnquiryID, JE.MAXBookingNo,0 AS MaxPMCode,LM.LedgerName,'' AS OrderEnquiryNo,'' AS OrderDate,'' AS FinalDeliveryDate,JE.JobName,JE.ProductCode, CM.CategoryName, '' AS EnquiryNo,JE.BookingNo, Replace(Convert(Varchar(13),JE.CreatedDate,106),' ','-') AS QuoteDate,'' AS PMCode,'' AS PMDate,PGM.HSNCode,PGM.ProductHSNName,'' AS ApprovedBy,Isnull(JAP.ApprovalNo,'') AS ApprovalNo,EM.LedgerName As EmployeeName,'' AS PONo,'' AS PODate, 0 AS Quantity,JE.FinalCost, JE.TypeOfCost, '' AS JobPriority,'' AS PrePressRemark,'' AS JobType,'' AS JobReference,  JE.ExpectedCompletionDays,LM.City,LM.State As ClientState,'' AS ModifiedDate,'' AS LastODate,'' AS PMBy,'' AS ApprovalBy,0 AS OrderRate,'' AS SalesOrderImgPath,'' AS ItemOrderNo,'' AS Remark,Isnull(PGM.GSTTaxPercentage,0) As GSTTaxPercentage,Isnull(PGM.CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(PGM.SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(PGM.IGSTTaxPercentage,0) As IGSTTaxPercentage,Isnull(JAP.CurrencySymbol,'INR') AS CurrencySymbol,JAP.OrderQuantity As OrderQuantity,Isnull((Select Top 1 Isnull(QuotedCost,0) FROM JobBookingCostings Where BookingId=JE.BookingId AND CompanyId=JE.CompanyId And (PlanContQty<=JAP.OrderQuantity) Order BY PlanContQty Desc),0) As QuoteRate,Isnull((Select Top 1 Isnull(A.FinalCost,0) FROM JobApprovedCost As A Where A.BookingId=JE.BookingId AND A.CompanyId=JE.CompanyId And (OrderQuantity<=JAP.OrderQuantity) Order BY OrderQuantity Desc),0) AS ApprovedRate,0 As TotalAmount,(Select State From CompanyMaster Where CompanyID=" & CompanyId & ") As CompanyState  " &
            '      " FROM JobBooking As JE INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] Where CompanyID=" & CompanyId & " AND Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24)  )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) As LM ON LM.LedgerID=JE.LedgerID AND JE.CompanyID=LM.CompanyID INNER JOIN CategoryMaster As CM ON JE.CategoryID = CM.CategoryID AND JE.CompanyID = CM.CompanyID And Isnull(JE.IsSendForPriceApproval,0)  =1  And Not Exists (Select P.BookingID FROM ProductMaster As P Where JE.BookingID=P.BookingID AND JE.CompanyID=P.CompanyID AND Isnull(P.IsDeletedTransaction,0)=0) And Not Exists (Select JD.BookingID FROM JobOrderBookingDetails As JD Where JE.BookingID=JD.BookingID AND JE.CompanyID=JD.CompanyID AND Isnull(JD.IsDeletedTransaction,0)=0) INNER JOIN JobApprovedCost As JAP ON JAP.BookingID = JE.BookingID AND JAP.CompanyID = JE.CompanyID AND Isnull(JAP.IsDeletedTransaction,0)=0  LEFT JOIN ProductHSNMaster AS PGM ON PGM.ProductHSNID=JE.ProductHSNID AND PGM.CompanyID=JE.CompanyID LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=JE.LedgerID AND EM.CompanyID=JE.CompanyID AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=27 AND CompanyID=" & CompanyId & ") " &
            '      " Where JE.CompanyID=" & CompanyId & "  AND JE.LedgerID=" & LedgerID & " " &
            '      " Group by JAP.OrderQuantity,LM.LedgerName, CM.CategoryName, JE.JobName,JE.MaxBookingNo, JE.BookingNo,JE.CreatedDate,JE.BookingID, JE.MAXBookingNo, JE.LedgerID,JAP.ApprovalNo, JE.FinalCost, JE.TypeOfCost,JE.EnquiryID,CM.CategoryID,JE.ProductCode, JE.ExpectedCompletionDays,LM.City,JE.ProductHSNID,PGM.ProductHSNName,PGM.HSNCode,JE.LedgerID,EM.LedgerName,PGM.GSTTaxPercentage,PGM.CGSTTaxPercentage,PGM.SGSTTaxPercentage,PGM.IGSTTaxPercentage,JAP.CurrencySymbol,LM.State,JE.CompanyID " &
            '      " Union All SELECT Distinct PM.BookingID,PM.LedgerId,CM.CategoryID,PMG.ProductHSNID,PM.ProductMasterID,PM.JobCoordinatorID,0 AS EnquiryID,JE.MAXBookingNo,PM.MaxProductMasterCode,LM.LedgerName,'' AS OrderEnquiryNo,'' AS OrderDate,'' AS FinalDeliveryDate, PM.JobName,PM.ProductCode,CM.CategoryName,'' AS EnquiryNo,JE.BookingNo,'' AS QuoteDate,PM.ProductMasterCode,Replace(Convert(Varchar(13),PM.CreatedDate,106),' ','-') AS PMDate,PMG.HSNCode,PMG.ProductHSNName,'' AS ApprovedBy,Isnull(JPA.ApprovalNo,'') AS ApprovalNo,EM.LedgerName As EmployeeName,'' AS PONo,'' AS PODate,JPA.OrderQuantity AS OrderQuantity,Case When Isnull(JE.BookingID,0)>0 THEN JE.FinalCost ELSE 0 END AS FinalCost, Case When Isnull(JE.BookingID,0)>0 THEN JE.TypeOfCost ELSE PM.RateType END AS TypeOfCost,'' AS JobPriority,'' AS PrePressRemark,PM.JobType,PM.JobReference,  0 AS ExpcCompDays,LM.City,LM.State As ClientState,Replace(Convert(Varchar(13),PM.ModifiedDate,106),' ','-') AS ModifiedDate,Replace(Convert(Varchar(13),A.LastODRDate,106),' ','-')  As [Last use date],UM.UserName,'' AS ApprovalBy,0 AS OrderRate,'' AS SalesOrderImgPath,'' AS ItemOrderNo,'' AS Remark,Isnull(PMG.GSTTaxPercentage,0) As GSTTaxPercentage,Isnull(PMG.CGSTTaxPercentage,0) As CGSTTaxPercentage,Isnull(PMG.SGSTTaxPercentage,0) As SGSTTaxPercentage,Isnull(PMG.IGSTTaxPercentage,0) As IGSTTaxPercentage,Isnull(JPA.CurrencySymbol,'') AS CurrencySymbol,JPA.OrderQuantity As OrderQuantity,Isnull((Select Top 1 Isnull(QuotedCost,0) FROM JobBookingCostings Where BookingId=JE.BookingId AND CompanyId=JE.CompanyId And (PlanContQty<=JPA.OrderQuantity) Order BY PlanContQty Desc),0) As QuoteRate,Isnull((Select Top 1 Isnull(A.FinalCost,0) FROM JobApprovedCost As A Where A.BookingId=JE.BookingId AND A.CompanyId=JE.CompanyId And (OrderQuantity<=JPA.OrderQuantity) Order BY OrderQuantity Desc),0) AS ApprovedRate,0 As TotalAmount,(Select State From CompanyMaster Where CompanyID=" & CompanyId & ") As CompanyState  " &
            '      " FROM ProductMaster AS PM INNER JOIN (Select A.[LedgerID] AS LedgerID,A.[CompanyID] AS CompanyID,A.[LedgerName],A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=24) )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A) As LM ON LM.LedgerId = PM.LedgerID AND LM.CompanyID=PM.CompanyID INNER JOIN UserMaster AS UM ON UM.UserID = PM.CreatedBy AND UM.CompanyID=PM.CompanyID INNER JOIN CategoryMaster As CM ON CM.CategoryId = PM.CategoryID  AND CM.CompanyID=PM.CompanyID And Isnull(PM.IsHidden,0)=0  LEFT JOIN LedgerMaster AS EM ON EM.LedgerID=PM.LedgerID AND EM.CompanyID=PM.CompanyID AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where LedgerGroupNameID=27 AND CompanyID=" & CompanyId & ") LEFT JOIN ProductHSNMaster AS PMG ON PMG.ProductHSNID=PM.ProductHSNID AND PMG.CompanyID=PM.CompanyID  LEFT JOIN JobBooking As JE ON JE.BookingID = PM.BookingID AND JE.CompanyID=PM.CompanyID LEFT JOIN JobApprovedCost as JPA on PM.BookingID = JPA.BookingID AND PM.CompanyID = JPA.CompanyID LEFT JOIN (SELECT CompanyID,Max(OrderBookingDate) As LastODRDate,ProductMasterCode  FROM JobOrderBookingDetails Where CompanyID=" & CompanyId & "  AND Isnull(IsDeletedTransaction,0)=0 Group By ProductMasterCode,CompanyID) As A ON A.ProductMasterCode=PM.ProductMasterCode AND A.CompanyID=PM.CompanyID " &
            '      " Where PM.CompanyID = " & CompanyId & " And PM.LedgerID = " & LedgerID & " And Isnull(PM.IsDeletedTransaction, 0) = 0) AS AL  Where LedgerID=" & LedgerID & " Order By JobName"

            Str = "Select DISTINCT  Replace(Convert(Nvarchar(30),PQc.CreatedDate,106),'','-')   as BookingDate ,JAC.ApprovalNo,  PQ.EstimateNo + '_'+  CONVERT(varchar(10),PQ.RevisionNo)  as QuotationNo,PQ.ProjectName, LM.LedgerName as ClientName,LMS.LedgerName as SalesPerson,PQ.FreightAmount,UM.UserName as EstimateBy,PQ.Narration as Remark,PQ.ProductEstimateID,LM.Address1,LM.TelephoneNo as PhoneNo,'-' as ProductCode,Replace(Convert(Nvarchar(30),PQ.CreatedDate,106),'','-') as JobDate,PQ.Narration,LM.LedgerID,LME.UserName as ApprovedBy from ProductQuotation as PQ inner join ProductQuotationContents as PQC on PQ.ProductEstimateID = PQC.ProductEstimateID and PQ.CompanyID = PQC.CompanyID inner Join LedgerMaster as LM on LM.CompanyID = PQ.CompanyID and LM.LedgerID = PQ.LedgerID and LM.LedgerGroupID = 1 inner Join LedgerMaster as LMS on LMS.CompanyID = PQ.CompanyID and LMS.LedgerID = PQ.SalesPersonID and LMS.LedgerGroupID =3 inner join ProductHSNMaster as PHM on PQC.ProductHSNID = PHM.ProductHSNID and PQc.CompanyID = PHM.CompanyID inner join JobApprovedCost as JAC on JAC.CompanyID = PQ.CompanyID and JAC.BookingID = PQ.ProductEstimateID inner Join UserMaster as LME on LME.CompanyID = JAC.CompanyID and LME.UserID = JAC.UserID inner Join UserMaster as UM on UM.CompanyID = PQ.CompanyID and UM.UserID = PQ.CreatedBy  where PQ.CompanyID =" & CompanyId & " and PQ.IsDeletedTransaction = 0 AND ISNULL(PQ.ISAPPROVED,0) =1 and PQ.LedgerID= " & LedgerID & " "


            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadProjectContents(ByVal ProductEstimateID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable


            Str = "Select PQC.VendorID, PQC.ProductEstimationContentID ,PQC.ProductHSNID,PQC.CategoryID, PQC.ProductEstimateID,PCM.ProductName,CM.CategoryName,PHM.HSNCode,PQC.Quantity,PQC.Rate,PQC.RateType,PQC.UnitCost,PQC.GSTPercantage,PQC.GSTAmount,PQC.MiscPercantage,PQC.MiscAmount,Isnull(PQC.ShippingCost,0) as ShippingCost,PQC.ProfitPer,PQC.ProfitCost,PQC.FinalAmount,LM.LedgerName as VendorName from ProductQuotationContents as PQC inner Join ProductCatalogMaster as PCM on PCM.CompanyID = PQC.CompanyID and PQC.ProductCatalogID = PCM.ProductCatalogID Inner Join CategoryMaster as CM on CM.CompanyID = PQC.CompanyID and PQC.CategoryID = CM.CategoryID inner join LedgerMaster as LM on LM.CompanyID = PQC.CompanyID and PQC.VendorID = LM.LedgerID AND lm.LedgerGroupID = 8 Inner join ProductHSNMaster as PHM on PHM.CompanyID = PQC.CompanyID and PHM.ProductHSNID = PQC.ProductHSNID  where  PQC.IsDeletedTransaction = 0 and PQC.CompanyID = " & CompanyId & " And PQC.ProductEstimateID=" & ProductEstimateID

            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SOBSalesRepresentive() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable
            'Str = "Select A.[LedgerID] AS EmployeeID,A.LedgerName As EmployeeName From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[DepartmentID] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[DepartmentID])) p) As A Where A.DepartmentID=-70"

            Str = "SELECT [LedgerID] AS EmployeeID,[LedgerName] As EmployeeName FROM [LedgerMaster] Where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=27) AND LedgerID IN (Select Distinct LedgerID From LedgerMasterDetails Where CompanyID=" & CompanyId & " AND FieldName='Designation' And FieldValue='JOB COORDINATOR' And IsDeletedTransaction=0) Order By [LedgerName]"
            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            js.MaxJsonLength = 2147483647
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetOrderHistory(ByVal OID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable
            Str = "Select Distinct JOB.SalesOrderNo,Replace(Convert(Nvarchar(30),JOB.OrderBookingDate,106),'','-') As OrderBookingDate,JOB.OrderQuantity, CASE WHEN Isnull(JOB.ChangeCost, 0) = 0 THEN Isnull(JOB.FinalCost, 0)  ELSE JOB.ChangeCost END AS Cost,JBJC.JobBookingNo,JOB.Remark,JOB.ApproveCostRemark From JobOrderBookingDetails As JOB Left Outer Join JobBookingJobCard As JBJC On JBJC.OrderBookingID=JOB.OrderBookingID And JOB.CompanyID=JBJC.CompanyID Where Isnull(JOB.IsDeletedTransaction,0)=0 And JOB.ProductMasterCode='" & OID & "' And JOB.CompanyID=" & CompanyId & " Order By OrderBookingDate,JOB.SalesOrderNo Desc"

            db.FillDataTable(Dt, Str)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SOBOrderNo(ByVal PFix As String) As String
        Dim MaxSalesOrderNo As Integer
        FYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Return db.GeneratePrefixedNo("JobOrderBooking", PFix, "MaxSalesOrderNo", MaxSalesOrderNo, FYear, " Where BookingPrefix='" & PFix & "' And CompanyId = " & CompanyId)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Function SOBCalculateSlabRates(ByVal BKID As Integer, Qty As Integer, ByVal type As String) As Double
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Dt As New DataTable
            Str = "Select MIN(PlanContQty) As Qty From JobBookingCostings Where BookingID=" & BKID & " AND CompanyID=" & CompanyId
            db.FillDataTable(Dt, Str)
            If Dt.Rows(0)("Qty") > Qty Then
                Return 0
            End If
            Dt.Clear()
            'Str = "Select JB.BookingID,(Select Top 1 Isnull(A.QuotedCost,0) FROM JobBookingCostings As A Where A.BookingId=JB.BookingId AND A.CompanyId=JB.CompanyId Order By ABS(A.PlanContQty-" & Qty & ")) AS QuotedCost,Isnull((Select Top 1 Isnull(A.FinalCost,0) FROM JobApprovedCost As A Where A.BookingId=JB.BookingId AND A.CompanyId=JB.CompanyId Order By ABS(A.OrderQuantity-" & Qty & ")),0) AS FinalCost From JobBooking As JB Where BookingID=" & BKID & " AND CompanyID=" & CompanyId
            Str = "Exec [QuantityWiseQuoteAndPriceApprovalCost] " & BKID & "," & Qty & "," & CompanyId
            db.FillDataTable(Dt, Str)
            If Dt.Rows.Count > 0 Then
                If type = "AR" Then
                    Return Dt.Rows(0)("FinalCost")
                Else
                    Return Dt.Rows(0)("QuotedCost")
                End If
            Else
                Return 0
            End If
            Return 0
        Catch ex As Exception
            Return 0
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxTypes() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim DtPlates, DTJobType As New DataTable

            Str = "Select Distinct Nullif(ParameterValue,'') As PlateType From ERPParameterSetting Where (ParameterName = 'Plate Type') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by PlateType"
            db.FillDataTable(DtPlates, Str)

            Str = "Select Distinct Nullif(ParameterValue,'') As JobType From ERPParameterSetting Where (ParameterName = 'Job Type') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by JobType"
            db.FillDataTable(DTJobType, Str)

            Dim Dataset As New DataSet
            DtPlates.TableName = "TblPlateType"
            DTJobType.TableName = "TblJobType"
            Dataset.Merge(DtPlates)
            Dataset.Merge(DTJobType)

            data.Message = db.ConvertDataSetsTojSonString(Dataset)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxPlateType() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select Distinct Nullif(ParameterValue,'') As PlateType From ERPParameterSetting Where (ParameterName = 'Plate Type') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by PlateType"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxPrefix() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select Distinct Nullif(ParameterValue,'') As JobPrefix From ERPParameterSetting Where (ParameterName = 'Booking Prefix') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by JobPrefix"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxJobPriority() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select Distinct Nullif(ParameterValue,'') As JobPriority From ERPParameterSetting Where (ParameterName = 'Job Priority') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by JobPriority"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxTransporter() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select Distinct LedgerID As TransporterID,LedgerName As TransporterName From LedgerMaster As IMD Inner Join LedgerGroupMaster AS LGM On LGM.LedgerGroupID=IMD.LedgerGroupID And IMD.CompanyID=LGM.CompanyID  Where IMD.CompanyID=" & CompanyId & " And Isnull(LGM.IsDeletedTransaction,0)<>1 And LGM.LedgerGroupNameID=35"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxJobReference() As String

        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            'Str = "Select  Nullif(JobReference,'') As JobReference from JobReference "
            Str = "Select Distinct Nullif(ParameterValue,'') As JobReference From ERPParameterSetting Where (ParameterName = 'Job Reference') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by JobReference"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SelctboxJobType() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            'Str = "Select  Nullif(JobType,'') As JobType from JobType Order by JobType"
            Str = "Select Distinct Nullif(ParameterValue,'') As JobType From ERPParameterSetting Where (ParameterName = 'Job Type') And IsNull(IsDeletedTransaction,0)=0 And CompanyID=" & CompanyId & " Order by JobType"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetConsigneeData(ByVal ClientID As Integer) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            'Str = "Select A.[LedgerID] AS ConsigneeID,A.[CompanyID] AS CompanyID,A.[LedgerName] As ConsigneeName,A.[City],A.[State],A.[Country] From (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[LedgerName],[City],[State],[Country] FROM (SELECT [LedgerID],[LedgerGroupID],[CompanyID],[FieldName],nullif([FieldValue],'''') as FieldValue FROM [LedgerMasterDetails] where Isnull(IsDeletedTransaction,0)<>1 AND LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " AND LedgerGroupNameID=44 And LedgerID In (Select Distinct LedgerID From LedgerMasterDetails Where FieldName='RefClientID' And FieldValue=" & ClientID & " And CompanyID=" & CompanyId & ")))x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName in ([LedgerName],[City],[State],[Country])) p) AS A"
            Str = "Select A.[LedgerID] AS ConsigneeID,A.[CompanyID] AS CompanyID,A.[LedgerName] As ConsigneeName,A.[City],A.[State],A.[Country] From  LedgerMaster as A where A.LedgerGroupId = 4 and A.CompanyID=" & CompanyId
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCostFilteredClient() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select Distinct Nullif(Replace(LM.LedgerName ,'""',''),'') as LedgerName,LM.LedgerID As LedgerId From LedgerMaster As LM Inner Join LedgerGroupMaster As LGM On LGM.LedgerGroupID=LM.LedgerGroupID AND LM.CompanyID =LGM.CompanyID Inner Join JobApprovedCost As JAC On JAC.LedgerID=LM.LedgerID And LM.CompanyID=JAC.CompanyID And Isnull(LM.IsDeletedTransaction,0)=Isnull(JAC.IsDeletedTransaction,0) Where LGM.LedgerGroupNameID=24  And Isnull(LM.IsDeletedTransaction,0)<>1 And LM.CompanyId = " & CompanyId & " Order By LedgerName "
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductHSNGroups(ByVal Category As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))

            Str = "Select ProductHSNID,HSNCode,ProductHSNName,ProductCategory,GSTTaxPercentage,CGSTTaxPercentage,SGSTTaxPercentage,IGSTTaxPercentage From ProductHSNMaster Where IsDeletedTransaction=0 And CompanyID=" & CompanyId & " AND ProductCategory='" & Category & "' Order By ProductHSNName"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ReloadOrderBooking(ByVal BKNo As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim DtOBD As New DataTable
            Dim DtOBDSch As New DataTable

            Str = "SELECT JOB.BookingID as ProductEstimateID,  LM.LedgerName as VendorName,JOB.OrderBookingDetailsID, JB.OrderBookingID, JB.SalesOrderNo, JOB.BookingID,Replace(Convert(Nvarchar(30),JOB.OrderBookingDate,106),'','-') As OrderBookingDate, JB.LedgerID, JOB.JobName as ProductName, JOB.CategoryID, JOB.OrderQuantity as Quantity, JB.PONo,Replace(Convert(Nvarchar(30),JB.PODate,106),'','-') As PODate,Replace(Convert(Nvarchar(30),JOB.DeliveryDate,106),'','-') As FinalDeliveryDate, JOB.TransporterID, JOB.TransporterName, JB.Remark, JOB.ProductionUnitID, JOB.NewJob, JOB.ProductCode, JOB.OldProductCode,Replace(Convert(Nvarchar(30),JOB.BookingDate,106),'','-') As BookingDate, JOB.IsBooked, JOB.JobType, JOB.ApprovalBy, JOB.JobReference, JOB.JobCoordinatorID, JOB.JobPriority, JB.BookingPrefix, JOB.ConsigneeID, JOB.BookingNo, Isnull(JOB.ProductMasterCode,'') As ProductMasterCode, JOB.ApprovalNo, JOB.Transport, JOB.Rate, JOB.Total,Replace(Convert(Nvarchar(30),JOB.ExpectedDeliveryDate,106),'','-') As ExpectedDeliveryDate, JB.PODetail, JOB.JobReferenceName, JOB.NewBookingID, JOB.NewBookingNo, JOB.IsApproveCost, JOB.FinalCost as FinalAmount, JOB.ApproveQuantity, JOB.ApproveCostRemark, JOB.ChangeCost As ApprovedRate, JOB.DispatchRemark, JOB.PrePressRemark, JOB.Tolerance, JOB.JobArtworkCode, JOB.JobMarketedBy, PGM.ProductHSNID, JB.SalesEmployeeID, JOB.OrderApproved, JOB.CustomerOrderRate, JOB.ProductMasterID, JOB.BasicAmount, JOB.DiscountPercentage, JB.TotalAmount, JOB.CGSTTaxPercentage, JOB.CGSTTaxAmount, JOB.SGSTTaxPercentage, JOB.SGSTTaxAmount, JOB.IGSTTaxPercentage, JOB.IGSTTaxAmount, JOB.NetAmount,JOB.GSTAmount,JOB.GSTPercantage,JOB.ProfitCost,JOB.ProfitPer,JOb.ShippingCost,JOB.MiscAmount,JOB.MiscPercantage, JOB.IsJobWorkOrder, JOB.IsDirectOrder, JOB.RateType ,PGM.ProductHSNName,CM.CategoryName,Isnull(JAC.CurrencySymbol,'INR') AS CurrencySymbol FROM JobOrderBooking AS JB INNER JOIN JobOrderBookingDetails AS JOB ON JOB.OrderBookingID = JB.OrderBookingID AND Isnull(JB.IsDeletedTransaction,0) = 0 LEFT JOIN LedgerMaster AS LM ON LM.LedgerId = JOB.VendorID AND LM.CompanyID = JOB.CompanyID Inner Join CategoryMaster As CM On CM.CategoryID=JOB.CategoryID AND CM.CompanyID=JOB.CompanyID LEFT JOIN ProductHSNMaster AS PGM ON PGM.ProductHSNID = JOB.ProductHSNID AND PGM.CompanyID = JOB.CompanyID LEFT JOIN JobApprovedCost As JAC On JOB.BookingID=JAC.BookingID AND JOB.CompanyID=JAC.CompanyID AND Isnull(JAC.IsDeletedTransaction,0)=0 Where JB.SalesOrderNo='" & BKNo & "' And JB.CompanyID=" & CompanyId
            db.FillDataTable(DtOBD, Str)

            Str = "SELECT JBDD.OrderBookingDeliveryID,Isnull(JBDD.JobName,'') As JobName ,JBDD.ProductEstimationContentID, JBDD.SalesOrderNo, JBDD.MaxSalesOrderNo, JBDD.OrderBookingID, Isnull(JBDD.ProductMasterCode,'') As ProductMasterCode, JBDD.ApprovalNo, JBDD.BookingID,Replace(Convert(Nvarchar(30),JBDD.DeliveryDate,106),'','-') As DeliveryDate, JBDD.ScheduleQuantity , JBDD.ConsigneeID,(Select Distinct LedgerName From LedgerMaster Where LedgerID=JBDD.ConsigneeID) As ConsigneeName, JBDD.TransporterID, JBDD.TransporterName as Transporter FROM JobOrderBookingDeliveryDetails AS JBDD INNER JOIN JobOrderBooking AS JB ON JB.OrderBookingID = JBDD.OrderBookingID And Isnull(JB.IsDeletedTransaction,0)=0 Where JB.SalesOrderNo='" & BKNo & "' And JB.CompanyID=" & CompanyId
            db.FillDataTable(DtOBDSch, Str)

            DtOBD.TableName = "OrderBooking"
            DtOBDSch.TableName = "OrderBookingDelivery"

            Dim dataset As New DataSet
            dataset.Merge(DtOBD)
            dataset.Merge(DtOBDSch)
            data.Message = db.ConvertDataSetsTojSonString(dataset)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PreOrderSavevalidation(ByVal Objvalid As Object) As String
        Dim DT As New DataTable
        Dim i As Integer
        Dim duplicate As String = ""
        Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))

        Try
            If CompanyId = "" Then Return "Session Expired"
            If UserID = "" Or UserID = 0 Then Return "Session Expired"

            db.ConvertObjectToDatatable(Objvalid, DT)
            For i = 0 To DT.Rows.Count - 1
                Str = "Select Distinct PONO,LedgerID,BookingID,ProductCode from JobOrderBookingDetails Where PONO='" & DT.Rows(i)(0) & "' And LedgerID=" & DT.Rows(i)(1) & " And BookingID=" & DT.Rows(i)(2) & " And ProductCode ='" & DT.Rows(i)(3) & "'"
                db.FillDataTable(dataTable, Str)
            Next

            If dataTable.Rows.Count > 0 Then
                For i = 0 To dataTable.Rows.Count - 1
                    If duplicate = "" Then
                        duplicate = i + 1 & ". Duplicate PO No [" & dataTable.Rows(i)(0) & "] with product code [" & dataTable.Rows(i)(3) & "] of this client [" & DT.Rows(0)(4) & "]"
                    Else
                        duplicate = duplicate & "\n " & i + 1 & ". Duplicate PO No [" & dataTable.Rows(i)(0) & "] with product code [" & dataTable.Rows(i)(3) & "] of this client [" & DT.Rows(0)(4) & "]"
                    End If
                Next
                Return duplicate
            Else
                Return "Valid"
            End If

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveNewJobOrder(ByVal NewOrderBook As Object, ByVal NewOrderBookDetails As Object, ByVal ScheduleGridData As Object, ByVal FlagEdit As String, ByVal SOBTxtNo As String, ByVal Prefix As String, ByVal PMIDS As String, ByVal BKIDS As String) As String
        Dim Key As String

        Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim MaxSalesOrderNo As Long
        Dim BookingNo As String
        Dim SalesOrderID As Integer

        Try
            If CompanyId = "" Then Return "Session Expired"
            If UserID = "" Or UserID = 0 Then Return "Session Expired"

            Dim TableName, AddColName, AddColValue As String

            If FlagEdit <> "" And FlagEdit = True Then
                If db.IsDeletable("JobBookingNo", "JobBookingJobCard", "Where JobBookingNo ='" & SOBTxtNo & "'") = False Then
                    Return "Not Editable"
                    Exit Function
                End If
                If db.CheckAuthories("SalesOrderBooking.aspx", UserID, CompanyId, "CanEdit") = False Then Return "You are not authorized to update..!"

                Key = db.ExecuteNonSQLQuery("Delete From JobOrderBookingDeliveryDetails WHERE SalesOrderNo ='" & SOBTxtNo & "'")
                If Key = "Success" Then
                    TableName = "JobOrderBookingDeliveryDetails"
                    AddColName = "UserID,FYear , CompanyId , ModifiedDate,OrderBookingID,MaxSalesOrderNo"
                    AddColValue = "'" & UserID & "','" & FYear & "','" & CompanyId & "','" & DateTime.Now & "',(Select OrderBookingID From JobOrderBooking Where SalesOrderNo='" & SOBTxtNo & "' And CompanyID=" & CompanyId & " And FYear='" & FYear & "'),(Select MaxSalesOrderNo From JobOrderBooking Where SalesOrderNo='" & SOBTxtNo & "' And CompanyID=" & CompanyId & " And FYear='" & FYear & "')"
                    db.InsertDatatableToDatabase(ScheduleGridData, TableName, AddColName, AddColValue)

                    TableName = "JobOrderBooking"
                    AddColName = "UserID='" & UserID & "',FYear='" & FYear & "' , CompanyId ='" & CompanyId & "', ModifiedDate=getdate()"
                    db.UpdateDatatableToDatabase(NewOrderBook, TableName, AddColName, 3)

                    TableName = "JobOrderBookingDetails"
                    AddColName = "UserID='" & UserID & "',FYear='" & FYear & "' , CompanyId ='" & CompanyId & "', ModifiedDate=getdate()"
                    db.UpdateDatatableToDatabase(NewOrderBookDetails, TableName, AddColName, 3)

                    Key = "Success"
                Else
                    Return Key
                End If

            Else
                If db.CheckAuthories("SalesOrderBooking.aspx", UserID, CompanyId, "CanSave") = False Then Return "You are not authorized to save..!"

                BookingNo = db.GeneratePrefixedNo("JobOrderBooking", Prefix, "MaxSalesOrderNo", MaxSalesOrderNo, FYear, " Where BookingPrefix='" & Prefix & "' And CompanyID=" & CompanyId & " And FYear='" & FYear & "' ")

                TableName = "JobOrderBooking"
                AddColName = "UserID,FYear , CompanyId , ModifiedDate, MaxSalesOrderNo, SalesOrderNo"
                AddColValue = "'" & UserID & "','" & FYear & "','" & CompanyId & "','" & DateTime.Now & "'," & MaxSalesOrderNo & ",'" & BookingNo & "'"
                SalesOrderID = db.InsertDatatableToDatabase(NewOrderBook, TableName, AddColName, AddColValue)

                If IsNumeric(SalesOrderID) = True And SalesOrderID > 0 Then

                    TableName = "JobOrderBookingDetails"
                    AddColName = "UserID,FYear , CompanyId , ModifiedDate, MaxSalesOrderNo, SalesOrderNo,OrderBookingID"
                    AddColValue = "'" & UserID & "','" & FYear & "','" & CompanyId & "','" & DateTime.Now & "'," & MaxSalesOrderNo & ",'" & BookingNo & "'," & SalesOrderID & ""
                    Key = db.InsertDatatableToDatabase(NewOrderBookDetails, TableName, AddColName, AddColValue)

                    If IsNumeric(Key) = False Then
                        SalesOrderBookingDelete(BookingNo, True)
                        Return Key
                    End If

                    TableName = "JobOrderBookingDeliveryDetails"
                    AddColName = "UserID,FYear , CompanyId , ModifiedDate, MaxSalesOrderNo, SalesOrderNo,OrderBookingID"
                    AddColValue = "'" & UserID & "','" & FYear & "','" & CompanyId & "','" & DateTime.Now & "'," & MaxSalesOrderNo & ",'" & BookingNo & "'," & SalesOrderID & ""
                    Key = db.InsertDatatableToDatabase(ScheduleGridData, TableName, AddColName, AddColValue)

                    If IsNumeric(Key) = False Then
                        SalesOrderBookingDelete(BookingNo, True)
                        Return Key
                    End If

                    db.ExecuteNonSQLQuery("Update JobBooking Set IsBooked=1 Where BookingID IN (" & BKIDS & ")")
                    Key = "Success"
                Else
                    Return SalesOrderID
                End If

            End If

        Catch ex As Exception
            Return ex.Message
        End Try
        Return Key
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SalesOrderBookingDelete(ByVal SOBNo As String, ByVal HardDelete As String) As String
        Dim Key As String

        Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))

        Try
            If HardDelete = True Then
                Key = db.ExecuteNonSQLQuery("Delete from JobOrderBooking WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                If (Key = "Success") Then
                    Key = db.ExecuteNonSQLQuery("Delete from JobOrderBookingDetails WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                Else
                    Return Key
                End If
                If (Key = "Success") Then
                    Key = db.ExecuteNonSQLQuery("Delete from JobOrderBookingDeliveryDetails WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                Else
                    Return Key
                End If
            Else
                If db.CheckAuthories("SalesOrderBooking.aspx", UserID, CompanyId, "CanDelete") = False Then Return "You are not authorized to delete..!"
                If db.IsDeletable("JobBookingNo", "JobBookingJobCard", " Where IsDeletedTransaction=0 And OrderBookingID IN (Select OrderBookingID From JobOrderBooking Where IsDeletedTransaction=0 And SalesOrderNo='" & SOBNo & "' And CompanyID=" & CompanyId & ")") = False Then
                    Return "Transaction further processed ,not deletable"
                End If
                Key = db.ExecuteNonSQLQuery("Update JobOrderBooking Set IsDeletedTransaction=1,DeletedBy =" & UserID & ",DeletedDate=Getdate() WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                If (Key = "Success") Then
                    Key = db.ExecuteNonSQLQuery("Update JobOrderBookingDetails Set IsDeletedTransaction=1,DeletedBy =" & UserID & ",DeletedDate=Getdate() WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                Else
                    Return Key
                End If
                If (Key = "Success") Then
                    Key = db.ExecuteNonSQLQuery("Update JobOrderBookingDeliveryDetails  Set IsDeletedTransaction=1,DeletedBy =" & UserID & ",DeletedDate=Getdate() WHERE SalesOrderNo ='" & SOBNo & "' And CompanyID=" & CompanyId)
                Else
                    Return Key
                End If
            End If

            Key = "Success"

        Catch ex As Exception
            Return ex.Message
        End Try
        Return Key
    End Function

    '--------------- Get estimation and sales order Comment Data---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetCommentData(ByVal bookingIDs As String, ByVal productMasterIDs As String, ByVal salesOrderNo As String, ByVal priceApprovalNo As String, ByVal moduleName As String) As String
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim GBLCompanyID As String
        Dim GBLUserID As String
        Dim orderBookingID, str1, priceApprovalID As String
        Dim dt As New DataTable
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        Str = ""
        str1 = ""
        If moduleName.ToUpper() = "SALES ORDER BOOKING" Then
            If bookingIDs <> "" Then
                Str = " EXEC GetCommentData " & GBLCompanyID & ",'Sales Order Booking',0,0,0,'" & bookingIDs & "',0,0,0,0"
            ElseIf productMasterIDs <> "" Then
                Str = " EXEC GetCommentData " & GBLCompanyID & ",'Sales Order Booking',0,0,0,0,0,0,'" & productMasterIDs & "',0"
            ElseIf salesOrderNo <> "" Then
                str1 = " Select Distinct OrderBookingID from JobOrderBooking Where CompanyID=" & GBLCompanyID & " AND SalesOrderNo='" & salesOrderNo & "'"
                db.FillDataTable(dt, str1)
                If dt.Rows.Count > 0 Then
                    orderBookingID = dt.Rows(0)(0)
                    If orderBookingID <> "" Then
                        Str = " EXEC GetCommentData " & GBLCompanyID & ",'Sales Order Booking',0,0,0,0,0,'" & orderBookingID & "',0,0"
                    End If
                End If
            End If
        ElseIf moduleName.ToUpper() = "PRICE APPROVAL" Then
            If priceApprovalNo <> "" Then
                str1 = " Select Distinct ApprovalID from JobApprovedCost Where CompanyID=" & GBLCompanyID & " AND ApprovalNo='" & priceApprovalNo & "'"
                db.FillDataTable(dt, str1)
                If dt.Rows.Count > 0 Then
                    priceApprovalID = dt.Rows(0)(0)
                    If priceApprovalID <> "" Then
                        Str = " EXEC GetCommentData " & GBLCompanyID & ",'PRICE APPROVAL',0,0,0,0,'" & priceApprovalID & "',0,0,0"
                    End If
                End If
            Else
                Str = " EXEC GetCommentData " & GBLCompanyID & ",'PRICE APPROVAL',0,0,0,0,'" & bookingIDs & "',0,0,0,0"
            End If
        End If

        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    ''----------------------------Save Comment Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveCommentData(ByVal jsonObjectCommentDetail As Object, ByVal salesOrderNo As String, ByVal priceApprovalNo As String, ByVal moduleName As String) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim GBLCompanyID, GBLUserID, orderBookingID, approvalID As String
        Dim AddColName, AddColValue, TableName, GBLFYear, Str As String
        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        'GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            If moduleName.ToUpper() = "SALES ORDER BOOKING" Then
                Str = "Select Distinct OrderBookingID From JobOrderBooking Where SalesOrderNo='" & salesOrderNo & "' AND CompanyID=" & GBLCompanyID & ""
                db.FillDataTable(dt, Str)
                orderBookingID = ""
                If dt.Rows.Count > 0 Then
                    orderBookingID = dt.Rows(0)(0)
                    If orderBookingID <> "" Then
                        TableName = "CommentChainMaster"
                        AddColName = ""
                        AddColValue = ""
                        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,OrderBookingID"
                        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & orderBookingID & "','" & orderBookingID & "'"
                        db.InsertDatatableToDatabase(jsonObjectCommentDetail, TableName, AddColName, AddColValue)
                        KeyField = "Success"
                    Else
                        KeyField = "fail"
                    End If
                Else
                    KeyField = "fail"
                End If
            Else
                Str = "Select Distinct ApprovalID From JobApprovedCost Where ApprovalNo='" & priceApprovalNo & "' AND CompanyID=" & GBLCompanyID & ""
                db.FillDataTable(dt, Str)
                approvalID = ""
                If dt.Rows.Count > 0 Then
                    approvalID = dt.Rows(0)(0)
                    If approvalID <> "" Then
                        TableName = "CommentChainMaster"
                        AddColName = ""
                        AddColValue = ""
                        AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,TransactionID,PriceApprovalID"
                        AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & approvalID & "','" & approvalID & "'"
                        db.InsertDatatableToDatabase(jsonObjectCommentDetail, TableName, AddColName, AddColValue)
                        KeyField = "Success"
                    Else
                        KeyField = "fail"
                    End If
                Else
                    KeyField = "fail"
                End If
            End If

            '  End If

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function

    '''''''************************************** End Sales Order Booking **************************************''''''''''

    <WebMethod(EnableSession:=True)> <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetImportData(ByVal dxboxval As String) As String ''for import Tool by sandeep ' 14 Apr 2021
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Str = "Select * from ItemMasterForImport Where Itemtype = '" & dxboxval & "' And CompanyId =2 "
        db.FillDataTable(dataTable, Str)
        data.Message = db.ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Save_Import_Data(ByVal approveobj As Object) As String ''for import  Tool by sandeep ' 14 Apr 2021
        Dim Key As String
        Dim FYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))
        Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
        Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        Dim MaxItemNo As Integer
        Try
            If UserID = "" Or UserID = 0 Or FYear = "" Or CompanyId = "" Or CompanyId <= 0 Then Return "Session Expired"

            Dim DTItemGroup As New DataTable
            db.FillDataTable(DTItemGroup, "SELECT  ItemGroupID, ItemGroupNameID,ItemGroupPrefix,ItemGroupName FROM ItemGroupMaster WHERE IsDeletedTransaction=0 And (CompanyID = " & CompanyId & ") And ItemGroupNameID =(Select ItemGroupNameID From ItemGroupMaster Where CompanyID=2 And ItemGroupID=" & approveobj(0)("ItemGroupID") & ")")

            If DuplicateItemGroupValidate(DTItemGroup.Rows(0)("ItemGroupID"), approveobj) = True Then
                ''Return "Duplicate data found"
            End If

            Dim st As String = DTItemGroup.Rows(0)("ItemGroupPrefix")
            db.GeneratePrefixedNo("ItemMaster", DTItemGroup.Rows(0)("ItemGroupPrefix"), "MaxItemNo", MaxItemNo, "", " Where IsDeletedTransaction=0 And ItemGroupID=" & DTItemGroup.Rows(0)("ItemGroupID") & " And ItemCodePrefix='" & DTItemGroup.Rows(0)("ItemGroupPrefix") & "' And  CompanyID=" & CompanyId)

            For i = 0 To approveobj.length - 1
                approveobj(i)("MaxItemNo") = MaxItemNo
                For x = 1 To 5 - MaxItemNo.ToString().Length()
                    st = Trim(st) & 0
                Next
                approveobj(i)("ItemCode") = st & MaxItemNo
                approveobj(i)("ItemCodePrefix") = DTItemGroup.Rows(0)("ItemGroupPrefix")
                approveobj(i)("ItemGroupID") = DTItemGroup.Rows(0)("ItemGroupID")
                approveobj(i)("ItemType") = DTItemGroup.Rows(0)("ItemGroupName")
                MaxItemNo = MaxItemNo + 1
            Next

            Dim TableName, AddColName, AddColValue As String
            TableName = "ItemMaster"
            AddColName = "UserID,FYear,CompanyID,CreatedDate"
            AddColValue = UserID & ",'" & FYear & "'," & CompanyId & ",Getdate()"
            Key = db.InsertDatatableToDatabase(approveobj, TableName, AddColName, AddColValue)

            db.ExecuteNonSQLQuery("Exec InsertBulkItemMasterDetailData " & CompanyId & "," & DTItemGroup.Rows(0)("ItemGroupID"))

            If IsNumeric(Key) = True Then Key = "Success"
            Return Key
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    Private Function DuplicateItemGroupValidate(ByVal TabelID As String, ByVal tblObj As Object) As Boolean
        Dim str2, ColValue As String
        Dim dtExist As New DataTable
        Dim dt As New DataTable
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            str2 = "Select IsNull(SaveAsString,'') as SaveAsString From ItemGroupMaster Where CompanyID='" & CompanyId & "' and ItemGroupID='" & TabelID & "' and Isnull(IsDeletedTransaction,0)<>1"
            db.FillDataTable(dtExist, str2)
            If dtExist.Rows.Count > 0 Then
                If IsDBNull(dtExist.Rows(0)(0)) = True Then
                    Return False
                Else
                    Dim GetColumn As String
                    GetColumn = dtExist.Rows(0)(0)
                    db.ConvertObjectToDatatable(tblObj, dt)
                    ColValue = ""
                    Dim BrakCount = ""

                    For i As Integer = 0 To dt.Rows.Count - 1
                        ColValue = ""
                        For Each column In dt.Columns
                            If GetColumn.Contains(column.ColumnName) Then
                                If ColValue = "" Then
                                    ColValue = " And " & column.ColumnName & "='" & dt.Rows(i)(column.ColumnName) & "'"
                                Else
                                    ColValue = ColValue & " And " & column.ColumnName & "='" & Replace(dt.Rows(i)(column.ColumnName), "'", "") & "'"
                                End If
                            End If
                        Next

                        str2 = "Select Distinct ItemID From ItemMaster Where CompanyID=" & CompanyId & " And ItemGroupID=" & TabelID & ColValue
                        dtExist = New DataTable
                        db.FillDataTable(dtExist, str2)
                        If dtExist.Rows.Count > 0 Then
                            tblObj.RemoveAt(i)
                            'Return True
                        End If
                    Next
                End If
            Else
                Return False
            End If
            Return False
        Catch ex As Exception
            Return True
        End Try
    End Function

    ''********************************************** Open  By Sandeep 23-06-2021 for client wise rate setting   *****************************************************************
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineSelectBox() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Str = "Select MachineId ,MachineName From MachineMaster Where IsDeletedTransaction=0 And Companyid = " & CompanyId & " Order By MachineName"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetClientSelectBox() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Str = "Select LedgerID,LedgerName from LedgerMaster Where IsDeletedTransaction=0 And LedgerGroupID =(Select LedgerGroupID From LedgerGroupMaster Where CompanyID=" & CompanyId & " And LedgerGroupNameID=24 ) And Companyid = " & CompanyId & " Order By LedgerName"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetMachineData(ByVal MachineID As String, ByVal ClientID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            If ClientID > 0 Then
                Str = "Select PaperGroup, MaxPlanW, MaxPlanL,SheetRangeFrom,SheetRangeTo, MinCharges, Rate, Wastage, PLateCharges, PSPlateCharges, CTCPPlateCharges,  SpecialColorFrontCharges, SpecialColorBackCharges,SlabID From ClientMachineCostSettings Where LedgerID = " & ClientID & " AND MachineID = " & MachineID & " AND CompanyID = " & CompanyId & " Order By SlabID,MaxPlanW, MaxPlanL,SheetRangeFrom"
            Else
                Str = "Select PaperGroup, MaxPlanW, MaxPlanL,SheetRangeFrom,SheetRangeTo, MinCharges, Rate, Wastage, PLateCharges, PSPlateCharges, CTCPPlateCharges,  SpecialColorFrontCharges, SpecialColorBackCharges From MachineSlabMaster Where MachineID = " & MachineID & " AND CompanyID = " & CompanyId & " AND Isnull(MaxPlanW,0) > 0 AND Isnull(MaxPlanL,0) > 0 Order BY PaperGroup,MaxPlanW, MaxPlanL,SheetRangeFrom"
            End If

            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetShowList() As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Str = "SELECT Distinct L.LedgerName,L.LedgerID, M.MachineName,M.MachineID, C.ClientMachineCostID, C.MinimumSheet, C.ChargesType, C.RoundofImpressionsWith, C.BasicPrintingCharges FROM ClientMachineCostSettings AS C INNER JOIN LedgerMaster AS L ON C.LedgerID = L.LedgerID And C.CompanyID = L.CompanyID INNER JOIN MachineMaster AS M ON C.MachineID = M.MachineId And C.CompanyID = M.CompanyID where  C.CompanyID = " & CompanyId & " GROUP BY L.LedgerName, M.MachineName, C.ClientMachineCostID, C.MinimumSheet, C.ChargesType, C.RoundofImpressionsWith, C.BasicPrintingCharges,L.LedgerId,M.MachineID ORDER BY L.LedgerName, M.MachineName"
            db.FillDataTable(dataTable, Str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function CheckPreEntry(ByVal MachineID As String, ByVal ClientId As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            UserId = Convert.ToString(HttpContext.Current.Session("UserID"))

            Str = "Select Distinct ClientMachineCostID From ClientMachineCostSettings Where LedgerID = " & ClientId & " AND MachineID = " & MachineID & " and CompanyID = " & CompanyId
            db.FillDataTable(dataTable, Str)

            If dataTable.Rows.Count > 0 Then
                If db.CheckAuthories("ClientWisePrintingSetting.aspx", UserId, CompanyId, "CanEdit", "LedgerID= " & ClientId & " And MachineID = " & MachineID) = False Then Return "You are not authorized to update..!"
                Return True
            Else
                Return False
            End If
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveClientSetting(ByVal ObjSaveOrder As Object) As String
        Try
            Dim UserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
            Dim CompanyId As String = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            Dim Key As String = ""
            Try
                If CompanyId = "" Or UserID = "" Or UserID = 0 Then Return "Session Expired"
                If db.CheckAuthories("ClientWisePrintingSetting.aspx", UserID, CompanyId, "CanSave", "LedgerID= " & ObjSaveOrder(0)("LedgerID") & " And MachineID = " & ObjSaveOrder(0)("MachineID") & "") = False Then Return "You are not authorized to save..!"

                Dim TableName, AddColName, AddColValue As String
                Dim ClientMachineCostID As Long
                TableName = "ClientMachineCostSettings"

                ClientMachineCostID = db.GenerateMaxVoucherNo(TableName, "ClientMachineCostID", " Where CompanyID=" & CompanyId)

                AddColName = "CompanyID,ClientMachineCostID,CreatedBy,CreatedDate"
                AddColValue = CompanyId & "," & ClientMachineCostID & "," & UserID & ",Getdate()"

                Str = "Delete From ClientMachineCostSettings Where CompanyID = " & CompanyId & " AND LedgerID= " & ObjSaveOrder(0)("LedgerID") & " And MachineID = " & ObjSaveOrder(0)("MachineID") & ""
                db.ExecuteNonSQLQuery(Str)

                Key = db.InsertDatatableToDatabase(ObjSaveOrder, TableName, AddColName, AddColValue)
                If IsNumeric(Key) = True Then
                    Return "Success"
                Else
                    Return "Fail"
                End If

            Catch ex As Exception
                Return ex.Message
            End Try
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteCostSetting(ByVal Client_Machine_Cost_ID As String) As String
        CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        If db.CheckAuthories("ClientWisePrintingSetting.aspx", UserId, CompanyId, "CanDelete", Client_Machine_Cost_ID) = False Then Return "You are not authorized to delete..!"

        Str = "Delete from ClientMachineCostSettings Where CompanyId=" & CompanyId & " And ClientMachineCostID = " & Client_Machine_Cost_ID & ""
        Dim flage As String = db.ExecuteNonSQLQuery(Str)
        Return flage
    End Function
    ''********************************************** Close  By Sandeep 23-06-2021 for client wise rate setting   *****************************************************************

    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class